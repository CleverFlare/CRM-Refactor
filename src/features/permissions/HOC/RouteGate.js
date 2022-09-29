import React from "react";
import safe from "../../../assets/safe.png";
import { useSelector } from "react-redux";
import { Box, Stack } from "@mui/system";
import { Typography } from "@mui/material";

const routeGate =
  (Component, permissions) =>
  (...args) => {
    const userInfo = useSelector((state) => state.userInfo.value);
    const userPermissions = userInfo.user_permissions.map(
      (perm) => perm.codename
    );
    const isPermitted =
      Boolean(
        permissions.some((permission) => userPermissions.includes(permission))
      ) || !Boolean(permissions.length);

    return (
      <>
        {isPermitted ? (
          <Component {...args} />
        ) : (
          <Stack
            spacing={2}
            sx={{ width: "100%", height: "100%" }}
            justifyContent="center"
            alignItems="center"
          >
            <Box
              component="img"
              src={safe}
              sx={{
                maxWidth: {
                  xl: 500,
                  lg: 500,
                  md: 300,
                  sm: 300,
                  xs: 200,
                },
                maxHeight: {
                  xl: 500,
                  lg: 500,
                  md: 300,
                  sm: 200,
                  xs: 200,
                },
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#494949",
                textAlign: "center",
                fontSize: {
                  xl: 50,
                  lg: 50,
                  md: 50,
                  sm: 40,
                  xs: 30,
                },
              }}
            >
              للأسف انت لا تملك الصلاحية لرؤية هذه الصفحة
            </Typography>
          </Stack>
        )}
      </>
    );
  };

export default routeGate;
