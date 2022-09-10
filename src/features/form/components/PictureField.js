import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box } from "@mui/system";
import { useRef } from "react";
import { useState } from "react";

const PictureField = ({
  multiple = false,
  label,
  placeholder,
  onChange = () => {},
  ...rest
}) => {
  const ref = useRef(null);
  const [value, setValue] = useState({});

  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        multiple={multiple ? true : false}
        ref={ref}
        onChange={(e) => {
          setValue(e.target.files);
          onChange(e);
        }}
        style={{ display: "none" }}
      />
      <TextField
        variant="standard"
        label={label}
        placeholder={placeholder}
        sx={{
          width: "100%",
          "& .MuiInputBase-input": {
            cursor: "pointer",
          },
        }}
        value={Object.keys(value)
          .map((picture) => value[picture]?.name)
          .join(" - ")}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={(e) => ref.current.click()}>
                <AddPhotoAlternateIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...rest}
      />
    </Box>
  );
};

export default PictureField;
