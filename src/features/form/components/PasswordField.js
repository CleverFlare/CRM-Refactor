import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordField = ({
  variant = null,
  onChange,
  label = "",
  value,
  placeholder = "",
  InputProps,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      type={visible ? "text" : "password"}
      variant={variant ? variant : "standard"}
      label={label}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      inputProps={{ autoComplete: "new-password" }}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end" sx={{ margin: 0 }}>
            <IconButton onClick={() => setVisible((old) => !old)}>
              {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
};

export default PasswordField;
