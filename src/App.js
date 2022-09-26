import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Topbar from "./components/Topbar";
import useToggle from "./hooks/useToggle";
import pages from "./data/pages";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "./hooks/useRequest";
import { NOTIFICATIONS, USER_INFO } from "./data/APIs";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "./features/permissions/components/PrivateRoute";
import Notfound from "./components/Notfound";

const sidebarWidth = 240;

const Layout = ({
  children,
  permissions,
  notifications,
  onRemoveNotifications = () => {},
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
        onClear={onRemoveNotifications}
      />
      <Sidebar
        permanent={!sm}
        open={openSidebar}
        onOpen={() => toggleOpenSidebar(true)}
        onClose={() => toggleOpenSidebar(false)}
        onLogout={() => dispatch({ type: "userInfo/logout" })}
        permissions={permissions}
        name={userInfo.name}
        role={userInfo.role}
        organization={userInfo.organization}
        avatar={userInfo.image}
        width={sidebarWidth}
        isNamePending={isPending}
        isRolePending={isPending}
        isOrganizationPending={isPending}
        isTabsPending={isPending}
        isAvatarPending={isPending}
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
  const [missedNotificationsGetRequest, missedNotificationsGetResponse] =
    useRequest({
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

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "notifications") {
        data.data.followup = data.data.followup.replace(" ", "T");
        setNotifications((old) => [data.data, ...old]);
      }
    };
  }, [token]);

  const handleRemoveNotifications = () => {
    missedNotificationsGetRequest({
      customMethod: "delete",
      onSuccess: () => {
        setNotifications([]);
      },
    });
  };

  return (
    <Provider store={store}>
      <Router>
        {token && (
          <Layout
            permissions={userInfo.user_permissions.map((perm) => perm.codename)}
            notifications={notifications}
            onRemoveNotifications={handleRemoveNotifications}
            userInfo={{
              name: `${userInfo.first_name} ${userInfo.last_name}`,
              role: userInfo.job_title,
              organization: userInfo.organization.name,
              image: userInfo.image,
            }}
            isPending={userInfoGetResponse.isPending}
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

              <Route path="/*" element={<Navigate replace to="/home" />} />
              <Route path="/404" element={<Notfound />} />
            </Routes>
          </Layout>
        )}
        {!token && (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/*" element={<Navigate replace to="/" />} />
          </Routes>
        )}
      </Router>
    </Provider>
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
