import React from "react";
import VpnKeyOffIcon from "@mui/icons-material/VpnKeyOff";
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
    const isPermitted = Boolean(
      permissions.some((permission) => userPermissions.includes(permission))
    );
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
            <VpnKeyOffIcon sx={{ width: 300, height: 300, color: "#494949" }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#494949" }}
            >
              للأسف انت لا تملك الصلاحية لرؤية هذه الصفحة
            </Typography>
          </Stack>
        )}
      </>
    );
  };

export default routeGate;
