import React from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import useControls from "../../hooks/useControls";
import { useState } from "react";
import { CHANGE_PASSWORD } from "../../data/APIs";
import filter from "../../utils/ClearNull";
import useRequest from "../../hooks/useRequest";

const ChangePassword = () => {
  const [visibilities, setVisibilities] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [
    { controls, invalid, required },
    { setControl, resetControls, validate },
  ] = useControls([
    {
      control: "old",
      value: "",
      isRequired: true,
    },
    {
      control: "new",
      value: "",
      isRequired: true,
    },
    {
      control: "confirm",
      value: "",
      isRequired: true,
      validations: [
        {
          test: (controls) => new RegExp(`^${controls.new}$`),
          message: "الرقم السري لا يطابق",
        },
      ],
    },
  ]);

  const handleVisibilityToggle = (which) => {
    switch (which) {
      case "old":
        setVisibilities({ ...visibilities, old: !visibilities.old });
        break;
      case "new":
        setVisibilities({ ...visibilities, new: !visibilities.new });
        break;
        break;
      case "confirm":
        setVisibilities({ ...visibilities, confirm: !visibilities.confirm });
        break;
      default:
        setVisibilities(visibilities);
    }
  };

  const [changePasswordPostRequest, changePasswordPostResponse] = useRequest({
    path: CHANGE_PASSWORD,
    method: "put",
    successMessage: "تم تغيير الرقم السري بنجاح",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    validate().then(({ isOk }) => {
      if (!isOk) return;
      const requestBody = filter({
        obj: {
          old_password: controls.old,
          new_password: controls.new,
          confirm_new_password: controls.confirm,
        },
      });
      changePasswordPostRequest({
        body: requestBody,
        onSuccess: (res) => {
          resetControls();
        },
      });
    });
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["الإعدادات", "تغير الرقم السري"]} />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ height: 500 }}
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <Stack
          direction="column"
          justifyContent="center"
          sx={{ width: 350 }}
          spacing={3}
        >
          <TextField
            type={visibilities.old ? "text" : "password"}
            variant="standard"
            label="الرقم السري القديم"
            sx={{
              "& .MuiInputLabel-formControl": {
                fontSize: 20,
                fontWeight: "normal",
                transform: "translate(10px, -10.5px) scale(0.75)",
                color: (theme) => theme.palette.primary.main,
              },
              "& .MuiInput-input": {
                paddingBlock: 1.2,
                fontSize: 15,
              },
              "& .MuiInputBase-formControl": {
                borderColor: "#233975",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => handleVisibilityToggle("old")}
                >
                  <IconButton>
                    {visibilities.old ? (
                      <VisibilityIcon color="primary" />
                    ) : (
                      <VisibilityOffIcon color="primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={controls.old}
            onChange={(e) => setControl("old", e.target.value)}
            required={required.includes("old")}
            error={Boolean(invalid?.old)}
            helperText={invalid?.old}
          />
          <TextField
            type={visibilities.new ? "text" : "password"}
            variant="standard"
            label="الرقم السري الجديد"
            sx={{
              "& .MuiInputLabel-formControl": {
                fontSize: 20,
                fontWeight: "normal",
                transform: "translate(10px, -10.5px) scale(0.75)",
                color: (theme) => theme.palette.primary.main,
              },
              "& .MuiInput-input": {
                paddingBlock: 1.2,
                fontSize: 15,
              },
              "& .MuiInputBase-formControl": {
                borderColor: "#233975",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleVisibilityToggle("new")}>
                    {visibilities.new ? (
                      <VisibilityIcon color="primary" />
                    ) : (
                      <VisibilityOffIcon color="primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={controls.new}
            onChange={(e) => setControl("new", e.target.value)}
            required={required.includes("new")}
            error={Boolean(invalid?.new)}
            helperText={invalid?.new}
          />
          <TextField
            type={visibilities.confirm ? "text" : "password"}
            variant="standard"
            label="تأكيد الرقم السري"
            sx={{
              "& .MuiInputLabel-formControl": {
                fontSize: 20,
                fontWeight: "normal",
                transform: "translate(10px, -10.5px) scale(0.75)",
                color: (theme) => theme.palette.primary.main,
              },
              "& .MuiInput-input": {
                paddingBlock: 1.2,
                fontSize: 15,
              },
              "& .MuiInputBase-formControl": {
                borderColor: "#233975",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleVisibilityToggle("confirm")}>
                    {visibilities.confirm ? (
                      <VisibilityIcon color="primary" />
                    ) : (
                      <VisibilityOffIcon color="primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={controls.confirm}
            onChange={(e) => setControl("confirm", e.target.value)}
            required={required.includes("confirm")}
            error={Boolean(invalid?.confirm)}
            helperText={invalid?.confirm}
          />
          <Button type="submit" variant="contained">
            حفظ
          </Button>
        </Stack>
      </Stack>
      {changePasswordPostResponse.successAlert}
      {changePasswordPostResponse.failAlert}
    </Wrapper>
  );
};

export default ChangePassword;
