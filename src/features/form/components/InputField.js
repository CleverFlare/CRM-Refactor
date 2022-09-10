import React from "react";
import { TextField } from "@mui/material";

const InputField = ({
  variant = null,
  onChange,
  label = "",
  value,
  placeholder = "",
  ...rest
}) => {
  return (
    <TextField
      variant={variant ? variant : "standard"}
      label={label}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      {...rest}
    />
  );
};

export default InputField;
