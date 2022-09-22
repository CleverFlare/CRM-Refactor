import React from "react";
import { useSelector } from "react-redux";

const PermissionsGate = ({ children, type, permissions, renderAuthFailed }) => {
  const userInfo = useSelector((state) => state.userInfo.value);

  const userPermissions = userInfo.user_permissions.map(
    (perm) => perm.codename
  );

  const isPermitted = Boolean(
    permissions.some((permission) => userPermissions.includes(permission))
  );

  return (
    <>{isPermitted ? renderAuthFailed ? renderAuthFailed : <></> : children}</>
  );
};
