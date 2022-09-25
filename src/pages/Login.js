import React from "react";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import useControls from "../hooks/useControls";
import DafaLogo from "../svg/DafaLogo";
import Lottie from "lottie-react";
import loginAnimation from "../assets/LoginAnimation.json";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import useRequest from "../hooks/useRequest";
import BASEURL, { LOGIN } from "../data/APIs";
import filter from "../utils/ClearNull";
import { useDispatch } from "react-redux";
import axios from "axios";
import useRequest from "../hooks/useRequest";

const Login = () => {
  const sm = useMediaQuery(`(max-width: 1259px)`);
  const [visibilities, setVisibilities] = useState({
    password: false,
  });

  const [
    { controls, invalid, required },
    { setControl, resetControls, setInvalid, validate },
  ] = useControls([
    {
      control: "username",
      value: "",
      isRequired: true,
    },
    {
      control: "password",
      value: "",
      isRequired: true,
    },
  ]);

  const [loginPostRequest, loginPostResponse] = useRequest({
    path: LOGIN,
    method: "post",
    successMessage: "تم تسجيل الدخول بنجاح",
  });

  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    validate().then(({ isOk }) => {
      if (!isOk) return;

      const requestBody = filter({
        obj: {
          username: controls.username,
          password: controls.password,
        },
      });

      loginPostRequest({
        body: requestBody,
        noHeaders: true,
        onSuccess: (res) => {
          dispatch({ type: "userInfo/setToken", payload: res.data.token });
          resetControls();
        },
      });
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.primary.main,
      }}
    >
      <Stack
        direction={sm ? "column" : "row"}
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          sx={{
            boxShadow: sm ? "none" : "0 0 10px 5px #fff5",
            height: sm ? "max-content" : "80%",
            paddingInline: "50px",
            gap: "40px",
            paddingBlock: "40px",
            boxSizing: sm ? "content-box" : "border-box",
            order: 2,
          }}
          alignItems="center"
        >
          <DafaLogo
            size="200px"
            style={{ color: "#fff", width: sm ? "70vw" : "initial" }}
          />
          <Box
            component="form"
            sx={{ width: "100%" }}
            onSubmit={handleLogin}
            noValidate
          >
            <Stack spacing={5}>
              <Stack justifyContent="center" alignItems="center">
                <Typography sx={{ color: "white" }} variant="h5">
                  تسجيل الدخول
                </Typography>
              </Stack>
              <TextField
                variant="standard"
                label="اسم المستخدم"
                sx={{
                  "& .MuiInputLabel-formControl": {
                    fontSize: 20,
                    fontWeight: "normal",
                    transform: "translate(10px, -10.5px) scale(0.75)",
                    color: "white !important",
                  },
                  "& .MuiInput-input": {
                    paddingBlock: 1.2,
                    fontSize: 15,
                  },
                  "& .MuiInputBase-formControl": {
                    borderColor: "white",
                    bgcolor: "white",
                    color: "black",
                  },
                }}
                required={required?.includes("username")}
                value={controls.username}
                onChange={(e) => setControl("username", e.target.value)}
                error={Boolean(invalid?.username)}
                helperText={invalid?.username}
              />
              <TextField
                type={visibilities.password ? "text" : "password"}
                variant="standard"
                label="الرقم السري القديم"
                sx={{
                  "& .MuiInputLabel-formControl": {
                    fontSize: 20,
                    fontWeight: "normal",
                    transform: "translate(10px, -10.5px) scale(0.75)",
                    color: "white !important",
                  },
                  "& .MuiInput-input": {
                    paddingBlock: 1.2,
                    fontSize: 15,
                  },
                  "& .MuiInputBase-formControl": {
                    borderColor: "white",
                    bgcolor: "white",
                    color: "black",
                  },
                }}
                required={required?.includes("password")}
                value={controls.password}
                onChange={(e) => setControl("password", e.target.value)}
                error={Boolean(invalid?.password)}
                helperText={invalid?.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() =>
                        setVisibilities((old) => ({
                          ...old,
                          password: !old.password,
                        }))
                      }
                    >
                      <IconButton>
                        {visibilities.password ? (
                          <VisibilityIcon color="primary" />
                        ) : (
                          <VisibilityOffIcon color="primary" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  paddingBlock: "10px",
                  "&:hover": { borderColor: "white" },
                }}
              >
                تسجيل الدخول
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Box sx={{ width: sm ? "200px" : "650px", order: sm ? 0 : 2 }}>
          <Lottie loop={false} animationData={loginAnimation} />
        </Box>
      </Stack>
      {loginPostResponse.failAlert}
    </Box>
  );
};

export default Login;
