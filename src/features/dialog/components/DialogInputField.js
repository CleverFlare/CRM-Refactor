import React from "react";
import { TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Stack } from "@mui/system";

const DialogInputField = ({
  variant = null,
  onChange,
  label = "",
  value,
  placeholder = "",
  sx = {},
  ...rest
}) => {
  return (
    <Grid2 container rowSpacing={2} sx={{ width: "100%" }}>
      <Grid2 md={2} xs={12}>
        <Typography>{label}</Typography>
      </Grid2>
      <Grid2 md={10} xs={12}>
        <TextField
          variant={variant ? variant : "standard"}
          label={null}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              bgcolor: "white",
            },
            ...sx,
          }}
          {...rest}
        />
      </Grid2>
    </Grid2>
  );
};

export default DialogInputField;
