import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import {
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { NumericFormat } from "react-number-format";
import countriesCodes from "../../../data/countriesCodes";

const DialogPhoneField = ({
  selectProps = {},
  requiredCode = false,
  onChange,
  label = "",
  ...rest
}) => {
  const [country, setCountry] = useState("");

  useEffect(() => {
    setCountry(rest?.value);
  }, [rest?.value]);
  return (
    <Grid2 container rowSpacing={2} sx={{ width: "100%" }}>
      <Grid2 md={2} xs={12}>
        <Typography>{label}</Typography>
      </Grid2>
      <Grid2 md={10} xs={12}>
        <NumericFormat
          customInput={TextField}
          variant="standard"
          disabled={requiredCode && !Boolean(country)}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              overflow: "hidden",
              bgcolor: "white",
            },
            "& .MuiInputBase-input": {
              appearance: "textfield",
            },
            "& .MuiInputBase-input::-webkit-outer-spin-button, & .MuiInputBase-input::-webkit-inner-spin-button":
              {
                appearance: "none",
                margin: 0,
              },
          }}
          onValueChange={(e) =>
            onChange({
              target: { value: e.value, valueAsNumber: e.floatValue },
            })
          }
          {...rest}
          inputProps={{ min: 0 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ margin: 0 }}>
                <TextField
                  variant="standard"
                  select
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 0,
                      borderLeft: "none",
                    },
                    "& .MuiSelect-standard": {
                      width: 60,
                    },
                  }}
                  {...selectProps}
                  SelectProps={{
                    defaultValue: "",
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return (
                          <Typography
                            sx={{
                              color: "currentColor",
                              opacity: "0.42",
                            }}
                          >
                            {selectProps.placeholder
                              ? selectProps.placeholder
                              : "الكود"}
                          </Typography>
                        );
                      } else {
                        const selectedCountry = countriesCodes.find(
                          (item) => item.dial === selected
                        );
                        return (
                          <Stack direction="row" spacing={1}>
                            <img
                              src={selectedCountry.flag}
                              style={{ maxWidth: 20 }}
                            />
                            <Typography>{selectedCountry.dial}</Typography>
                          </Stack>
                        );
                      }
                    },
                    MenuProps: {
                      PaperProps: {
                        sx: { maxHeight: 200, overflowY: "auto" },
                      },
                    },
                    onChange: (e) => {
                      setCountry(e.target.value);
                      selectProps.onChange(e);
                    },
                    IconComponent: KeyboardArrowDownIcon,
                  }}
                >
                  {countriesCodes?.map((item, index) => (
                    <MenuItem key={index} value={item.dial}>
                      <ListItemIcon
                        sx={{
                          minWidth: "max-content",
                          marginRight: "5px",
                        }}
                      >
                        <img src={item.flag} style={{ maxWidth: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={item.code} />
                    </MenuItem>
                  ))}
                </TextField>
              </InputAdornment>
            ),
          }}
        />
      </Grid2>
    </Grid2>
  );
};

export default DialogPhoneField;
