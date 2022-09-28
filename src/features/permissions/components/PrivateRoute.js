import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, permissions }) => {
  const userInfo = useSelector((state) => state.userInfo.value);

  const userPermissions = userInfo.user_permissions.map(
    (perm) => perm.codename
  );

  const isPermitted =
    Boolean(
      permissions.some((permission) => userPermissions.includes(permission))
    ) || !Boolean(permissions.length);

  return <>{isPermitted ? children : <Navigate replace to="/" />}</>;
};

export default PrivateRoute;
