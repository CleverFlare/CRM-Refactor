import React from "react";
import { TextField } from "@mui/material";

const TextareaField = ({
  variant = null,
  onChange,
  label = "",
  value,
  placeholder = "",
  rows = 4,
  ...rest
}) => {
  return (
    <TextField
      variant={variant ? variant : "standard"}
      label={label}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      multiline
      rows={rows}
      {...rest}
    />
  );
};

export default TextareaField;
