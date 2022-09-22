import React, { useEffect } from "react";
import {
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DialogSelectField = ({
  variant = null,
  isPending = false,
  onOpen,
  onClose,
  label = "",
  renderValue = null,
  children,
  placeholder = "",
  SelectProps = {},
  ...rest
}) => {
  return (
    <Grid2 container rowSpacing={2} sx={{ width: "100%" }}>
      <Grid2 md={2} xs={12}>
        <Typography>{label}</Typography>
      </Grid2>
      <Grid2 md={10} xs={12}>
        <TextField
          variant={Boolean(variant) ? variant : "standard"}
          select
          SelectProps={{
            defaultValue: "",
            displayEmpty: true,
            onOpen: onOpen,
            onClose: onClose,
            renderValue: (selected) => {
              if (!Boolean(selected)) {
                return (
                  <Typography sx={{ color: "currentColor", opacity: "0.42" }}>
                    {placeholder}
                  </Typography>
                );
              } else {
                return Boolean(renderValue) && typeof renderValue === "function"
                  ? renderValue(selected)
                  : selected;
              }
            },
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: "200px",
                  overflowY: "auto",
                },
              },
            },
            IconComponent: KeyboardArrowDownIcon,
            ...SelectProps,
          }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              bgcolor: "white",
            },
          }}
          {...rest}
        >
          {Boolean(isPending) ? (
            <Stack justifyContent="center" alignItems="center" sx={{ p: 1 }}>
              <CircularProgress size="30px" sx={{ color: "gray" }} />
            </Stack>
          ) : Boolean(Object.keys(children)?.length) ? (
            children
          ) : (
            <MenuItem disabled>فارغ</MenuItem>
          )}
        </TextField>
      </Grid2>
    </Grid2>
  );
};

export default DialogSelectField;
