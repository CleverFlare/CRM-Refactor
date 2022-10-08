import React from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AutocompleteField = ({
  variant = null,
  onChange,
  label = "",
  value,
  placeholder = "",
  children,
  isPending,
  onOpen = () => {},
  onClose = () => {},
  data = [],
  ...rest
}) => {
  return (
    <Autocomplete
      loading={isPending}
      loadingText="الرجاء الإنتظار..."
      options={!isPending ? data : []}
      onOpen={onOpen}
      onClose={onClose}
      onChange={onChange}
      fullWidth
      popupIcon={<KeyboardArrowDownIcon />}
      noOptionsText="فارغ"
      sx={{
        "& .MuiInput-root .MuiInput-input": {
          paddingInline: "10px",
        },
      }}
      {...rest}
      renderInput={(params) => (
        <TextField
          variant={variant ? variant : "standard"}
          {...params}
          InputLabelProps={{ shrink: true }}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default AutocompleteField;
