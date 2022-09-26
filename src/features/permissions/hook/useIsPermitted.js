import { useSelector } from "react-redux";

const useIsPermitted = () => {
  const userInfo = useSelector((state) => state.userInfo.value);

  const userPermissions = userInfo.user_permissions.map(
    (permission) => permission.codename
  );

  const isPermitted = (callback, permissions = []) => {
    const canAccess = permissions.some((permission) =>
      userPermissions.includes(permission)
    );

    return canAccess ? callback : null;
  };

  return isPermitted;
};

export default useIsPermitted;
