import React, { useEffect, useState, Fragment } from "react";
import Sidebar from "./components/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Topbar from "./components/Topbar";
import useToggle from "./hooks/useToggle";
import pages from "./data/pages";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "./hooks/useRequest";
import { NOTIFICATIONS, USER_INFO } from "./data/APIs";
import Login from "./pages/Login";
import PrivateRoute from "./features/permissions/components/PrivateRoute";
import Notfound from "./components/Notfound";
import filter from "./utils/ClearNull";
import Compress from "react-image-file-resizer";

const sidebarWidth = 240;

Date.prototype.toCorrectISOString = function () {
  function pad(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  }
  return (
    this.getFullYear() +
    "-" +
    pad(this.getMonth() + 1) +
    "-" +
    pad(this.getDate()) +
    "T" +
    pad(this.getHours()) +
    ":" +
    pad(this.getMinutes()) +
    ":" +
    pad(this.getSeconds()) +
    "." +
    (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    "Z"
  );
};

const Layout = ({
  children,
  permissions,
  notifications,
  onRemoveNotifications = () => {},
  onClear = () => {},
  onChangeAvatar,
  isAvatarPending = false,
  isPending = false,
  userInfo = {},
}) => {
  //----hooks----
  const sm = useMediaQuery("(max-width:712px)");
  const [openSidebar, toggleOpenSidebar] = useToggle(false);

  const dispatch = useDispatch();

  //----styles----
  let gridStyle = {
    display: "grid",
    gridTemplateRows: "auto 1fr",
    gridTemplateColumns: sm ? "1fr" : `${sidebarWidth}px 1fr`,
    height: "100vh",

    "& > :nth-child(1)": {
      gridColumn: sm ? "1 / -1" : "2 / 2",
    },

    "& > :nth-child(3)": {
      gridColumn: sm ? "1 / -1" : "2 / 2",
      gridRow: sm ? "2 / 3" : "2 / 3",
    },
  };

  return (
    <Box sx={gridStyle}>
      <Topbar
        showBurger={sm}
        onBurgerClick={() => toggleOpenSidebar()}
        notifications={notifications}
        onNotificationsOpen={onRemoveNotifications}
        onClear={onClear}
      />
      <Sidebar
        permanent={!sm}
        open={openSidebar}
        onOpen={() => toggleOpenSidebar(true)}
        onClose={() => toggleOpenSidebar(false)}
        onLogout={() => dispatch({ type: "userInfo/logout" })}
        permissions={permissions}
        onChangeAvatar={onChangeAvatar}
        name={userInfo.name}
        role={userInfo.role}
        organization={userInfo.organization}
        avatar={userInfo.image}
        width={sidebarWidth}
        isNamePending={isPending}
        isRolePending={isPending}
        isOrganizationPending={isPending}
        isTabsPending={isPending}
        isAvatarPending={isPending || isAvatarPending}
      />
      <Box sx={{ overflowY: "auto" }}>{children}</Box>
    </Box>
  );
};

const App = () => {
  //----store----
  const token = useSelector((state) => state.userInfo.value.token);

  const dispatch = useDispatch();

  //----states----
  const [notifications, setNotifications] = useState([]);

  const userInfo = useSelector((state) => state.userInfo.value);

  const [userInfoGetRequest, userInfoGetResponse] = useRequest({
    path: USER_INFO,
    method: "get",
  });

  //----request hooks----
  const [missedNotificationsGetRequest] = useRequest({
    path: NOTIFICATIONS,
    method: "get",
  });

  //----effects----
  useEffect(() => {
    if (!token) return;
    userInfoGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "userInfo/setUserInfo", payload: res.data });
      },
    });

    missedNotificationsGetRequest({
      onSuccess: (res) => {
        setNotifications(res.data.notifications);
      },
    });

    const ws = new WebSocket(`wss://crmsystem.cyparta.com/ws/?${token}`);

    const handleNotifications = (data) => {
      setNotifications((old) => [data.data, ...old]);
    };

    const handleImportProgress = (data) => {
      dispatch({
        type: "exportClients/setProgress",
        payload: data.data.message,
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.action) {
        case "notifications":
          handleNotifications(data);
          break;
        case "import":
          handleImportProgress(data);
          break;
      }
    };

    return () => ws.close();
  }, [token]);

  const handleSeenNotifications = () => {
    missedNotificationsGetRequest({
      customMethod: "delete",
    });
  };

  //===Start===== change avatar login ========
  const resize = (file) => {
    return new Promise((resolve) => {
      Compress.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => resolve(uri),
        "file"
      );
    });
  };

  const [changeAvatarPatchRequest, changeAvatarPatchResponse] = useRequest({
    path: USER_INFO,
    method: "patch",
  });

  const changeAavatar = async (file) => {
    console.log("wait");
    const image = await resize(file);
    console.log("finish", file);

    const requestBody = filter({
      obj: {
        image: image,
      },
      output: "formData",
    });

    changeAvatarPatchRequest({
      body: requestBody,
      id: userInfo.id,
      onSuccess: (res) => {
        console.log(res.data);
        dispatch({ type: "userInfo/setUserInfo", payload: res.data });
      },
    });
  };

  //====End==== change avatar login ========

  return (
    <Fragment>
      {token && (
        <Layout
          permissions={userInfo.user_permissions.map((perm) => perm.codename)}
          notifications={notifications}
          onRemoveNotifications={handleSeenNotifications}
          userInfo={{
            name: `${userInfo.first_name} ${userInfo.last_name}`,
            role: userInfo.job_title,
            organization: userInfo.organization.name,
            image: userInfo.image,
          }}
          isPending={userInfoGetResponse.isPending}
          onChangeAvatar={changeAavatar}
          isAvatarPending={changeAvatarPatchResponse.isPending}
          onClear={() => setNotifications([])}
        >
          <Routes>
            {pages.map((page, pageIndex) => {
              if (!Boolean(page)) return;
              switch (page.hasOwnProperty("subtabs")) {
                case false:
                  return (
                    <Route
                      path={page.path}
                      element={
                        <PrivateRoute permissions={page.permitted}>
                          {page.element}
                        </PrivateRoute>
                      }
                      key={`route page ${pageIndex}`}
                    />
                  );
                case true:
                  return page.subtabs.map((subtab, subtabIndex) => (
                    <Route
                      path={page.path + subtab.path}
                      element={
                        <PrivateRoute permissions={subtab.permitted}>
                          {subtab.element}
                        </PrivateRoute>
                      }
                      key={`route subpage ${subtabIndex}`}
                    />
                  ));
                default:
                  return;
              }
            })}

            <Route path="/*" element={<Navigate replace to="/" />} />
            {/* <Route path="/404" element={<Notfound />} /> */}
          </Routes>
        </Layout>
      )}
      {!token && (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Navigate replace to="/" />} />
        </Routes>
      )}
    </Fragment>
  );
};

export default App;

const dummyPermissions = [
  "add_aqarpost",
  "view_aqarpost",
  "delete_aqarpost",
  "change_aqarpost",
  "aqarstatistics",
  "add_aqarclient",
  "view_aqarclient",
  "delete_aqarclient",
  "add_aqarevent",
  "view_aqarevent",
  "aqarexport_file",
  "aqarexport_file",
  "view_aqarimportexportfiels",
  "add_aqarproject",
  "view_aqarproject",
  "add_aqaremployee",
  "view_aqaremployee",
  "add_aqarjob",
  "view_aqarjob",
  "add_aqaremployee",
  "view_aqaremployee",
  "add_aqaremployee",
  "view_aqaremployee",
  "add_aqaremployee",
  "view_aqaremployee",
];
