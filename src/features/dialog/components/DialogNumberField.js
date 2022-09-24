import React from "react";
import { TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { NumericFormat } from "react-number-format";

const DialogNumberField = ({
  variant,
  label = "",
  sx = {},
  onChange,
  ...rest
}) => {
  const handleNativeOnChange = (values) => {
    onChange({
      target: {
        ...values,
      },
    });
  };

  return (
    <Grid2 container rowSpacing={2} sx={{ width: "100%" }}>
      <Grid2 md={2} xs={12}>
        <Typography>{label}</Typography>
      </Grid2>
      <Grid2 md={10} xs={12}>
        <NumericFormat
          customInput={TextField}
          variant={Boolean(variant) ? variant : "standard"}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              bgcolor: "white",
            },
            ...sx,
          }}
          onValueChange={handleNativeOnChange}
          {...rest}
        />
      </Grid2>
    </Grid2>
  );
};

export default DialogNumberField;
