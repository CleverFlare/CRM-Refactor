import { Grid, Switch } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState } from "react";
import useAfterEffect from "../hooks/useAfterEffect";
import usePropState from "../hooks/usePropState";

const PermissionToggles = ({
  permissions = [],
  initialToggles = [],
  onToggle = () => {},
  ...props
}) => {
  const [toggles, setToggles] = usePropState(initialToggles, true, [
    initialToggles.length,
  ]);

  const handleToggle = (e) => {
    switch (e.target.checked) {
      case true:
        setToggles((old) => [...old, e.target.value]);
        break;
      case false:
        setToggles((old) => old.filter((item) => item !== e.target.value));
        break;
      default:
        setToggles((old) => old);
    }
  };

  useAfterEffect(() => {
    onToggle({ toggles });
  }, [toggles]);

  return (
    <Box {...props}>
      <Grid
        container
        spacing={2}
        sx={{
          "& .MuiGrid-item": {
            paddingRight: 13,
          },
        }}
      >
        {Boolean(permissions?.length) &&
          permissions.map((perm, index) => (
            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
              key={`${perm} ${index}`}
            >
              {perm.name_ar}
              <Switch
                value={perm.codename}
                onChange={handleToggle}
                checked={Boolean(toggles?.includes(perm.codename))}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default PermissionToggles;
