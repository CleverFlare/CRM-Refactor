import React, { useEffect } from "react";
import {
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SelectField = ({
  variant = null,
  isPending = false,
  onOpen,
  onClose,
  renderValue = null,
  children,
  placeholder = "",
  SelectProps = {},
  ...rest
}) => {
  return (
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
      {...rest}
    >
      {Boolean(isPending) ? (
        <Stack justifyContent="center" alignItems="center" sx={{ p: 1 }}>
          <CircularProgress size="30px" sx={{ color: "gray" }} />
        </Stack>
      ) : children?.length ? (
        children
      ) : (
        <MenuItem disabled>فارغ</MenuItem>
      )}
    </TextField>
  );
};

export default SelectField;
