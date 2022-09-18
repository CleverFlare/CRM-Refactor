import React from "react";
import {
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const MultiSelectField = ({
  variant = null,
  isPending = false,
  onOpen,
  onClose,
  renderValue = null,
  children,
  placeholder = "",
  ...rest
}) => {
  return (
    <TextField
      variant="standard"
      defaultValue={[]}
      select
      SelectProps={{
        displayEmpty: true,
        multiple: true,
        onOpen: onOpen,
        renderValue: (selected) => {
          if (!Boolean(selected.length)) {
            return (
              <Typography sx={{ color: "currentColor", opacity: "0.42" }}>
                {placeholder}
              </Typography>
            );
          } else {
            return Boolean(renderValue) && typeof renderValue === "function"
              ? renderValue(selected)
              : selected.join(", ");
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
      }}
      {...rest}
    >
      {Boolean(isPending) ? (
        <Stack justifyContent="center" alignItems="center" sx={{ p: 1 }}>
          <CircularProgress size="30px" sx={{ color: "gray" }} />
        </Stack>
      ) : Boolean(children?.length) ? (
        children
      ) : (
        <MenuItem disabled>فارغ</MenuItem>
      )}
    </TextField>
  );
};

export const MultiSelectItem = ({ children, selected = false, ...rest }) => {
  return (
    <MenuItem {...rest}>
      {children}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {selected ? (
          <CancelIcon sx={{ color: "#f54242" }} />
        ) : (
          <AddCircleIcon
            sx={{
              color: (theme) => theme.palette.primary.main,
            }}
          />
        )}
      </Box>
    </MenuItem>
  );
};

export default MultiSelectField;
