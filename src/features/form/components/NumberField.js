import React from "react";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

const NumberField = ({ variant, onChange, ...rest }) => {
  const handleValueChange = (values) => {
    onChange({ target: { ...values } });
  };

  return (
    <NumericFormat
      customInput={TextField}
      variant={Boolean(variant) ? variant : "standard"}
      onValueChange={handleValueChange}
      {...rest}
    />
  );
};

export default NumberField;
