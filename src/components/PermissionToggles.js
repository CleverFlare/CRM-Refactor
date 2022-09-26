import { Grid, Switch } from "@mui/material";
import { Box } from "@mui/system";
import _ from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useAfterEffect from "../hooks/useAfterEffect";
import usePropState from "../hooks/usePropState";

const PermissionToggles = ({
  permissions = [],
  initialToggles = [],
  onToggle = () => {},
  ...props
}) => {
  const [toggles, setToggles] = usePropState(initialToggles, [
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

  const handleToggleAll = (e) => {
    switch (e.target.checked) {
      case true:
        setToggles(JSON.parse(e.target.value));
        break;
      case false:
        setToggles([]);
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
        {Boolean(permissions.length) && (
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            جميع الصلاحيات
            <Switch
              value={JSON.stringify(permissions.map((perm) => perm.codename))}
              onChange={handleToggleAll}
              checked={_.isEqual(
                permissions.map((perm) => perm.codename),
                toggles
              )}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PermissionToggles;
