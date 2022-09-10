import React from "react";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

const NumberField = ({ variant, ...rest }) => {
  return (
    <NumericFormat
      customInput={TextField}
      variant={Boolean(variant) ? variant : "standard"}
      {...rest}
    />
  );
};

export default NumberField;
