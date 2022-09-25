import React from "react";
import {
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DialogMultiSelectField = ({
  variant = null,
  isPending = false,
  onOpen,
  onClose,
  renderValue = null,
  children,
  placeholder = "",
  label = "",
  ...rest
}) => {
  return (
    <Grid2 container rowSpacing={2} sx={{ width: "100%" }}>
      <Grid2 md={2} xs={12}>
        <Typography>{label}</Typography>
      </Grid2>
      <Grid2 md={10} xs={12}>
        <TextField
          variant="standard"
          defaultValue={[]}
          select
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              bgcolor: "white",
            },
          }}
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
      </Grid2>
    </Grid2>
  );
};

export default DialogMultiSelectField;
