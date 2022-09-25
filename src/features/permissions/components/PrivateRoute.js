import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, permissions }) => {
  const userInfo = useSelector((state) => state.userInfo.value);

  const userPermissions = userInfo.user_permissions.map(
    (perm) => perm.codename
  );

  const isPermitted = Boolean(
    permissions.some((permission) => userPermissions.includes(permission))
  );

  return <>{isPermitted ? children : <Navigate replace to="/404" />}</>;
};

export default PrivateRoute;
