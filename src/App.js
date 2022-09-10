import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Topbar from "./components/Topbar";
import useToggle from "./hooks/useToggle";
import pages from "./data/pages";
import { useSelector } from "react-redux";
import useRequest from "./hooks/useRequest";
import { NOTIFICATIONS } from "./data/APIs";

const sidebarWidth = 240;

const Layout = ({ children, permissions, notifications, userInfo = {} }) => {
  //----hooks----
  const sm = useMediaQuery("(max-width:712px)");
  const [openSidebar, toggleOpenSidebar] = useToggle(false);

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
        onClear={() => {}}
      />
      <Sidebar
        permanent={!sm}
        open={openSidebar}
        onOpen={() => toggleOpenSidebar(true)}
        onClose={() => toggleOpenSidebar(false)}
        permissions={permissions}
        name={userInfo.name}
        role={userInfo.role}
        organization={userInfo.organization}
        avatar={userInfo.image}
        width={sidebarWidth}
      />
      <Box sx={{ overflowY: "auto" }}>{children}</Box>
    </Box>
  );
};

const App = () => {
  //----store----
  const token = useSelector((state) => state.userInfo.value.token);

  //----states----
  const [notifications, setNotifications] = useState([]);

  const userInfo = useSelector((state) => state.userInfo.value);

  //----request hooks----
  const [missedNotificationsGetRequest, missedNotificationsGetResponse] =
    useRequest({
      path: NOTIFICATIONS,
      method: "get",
    });

  //----effects----
  useEffect(() => {
    missedNotificationsGetRequest({
      onSuccess: (res) => {
        setNotifications(res.data.notifications);
      },
    });

    const ws = new WebSocket(`wss://crmsystem.cyparta.com/ws/?${token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.data);
      if (data.action === "notifications") {
        data.data.followup = data.data.followup.replace(" ", "T");
        setNotifications((old) => [data.data, ...old]);
      }
    };
  }, []);

  return (
    <Router>
      <Layout
        permissions={dummyPermissions}
        notifications={notifications}
        userInfo={{
          name: `${userInfo.first_name} ${userInfo.last_name}`,
          role: userInfo.job_title,
          organization: userInfo.organization.name,
          image: userInfo.image,
        }}
      >
        <Routes>
          {pages.map((page, pageIndex) => {
            if (!Boolean(page)) return;
            switch (page.hasOwnProperty("subtabs")) {
              case false:
                return (
                  <Route
                    path={page.path}
                    element={page.element}
                    key={`route page ${pageIndex}`}
                  />
                );
              case true:
                return page.subtabs.map((subtab, subtabIndex) => (
                  <Route
                    path={page.path + subtab.path}
                    element={subtab.element}
                    key={`route subpage ${subtabIndex}`}
                  />
                ));
              default:
                return;
            }
          })}
        </Routes>
      </Layout>
    </Router>
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
