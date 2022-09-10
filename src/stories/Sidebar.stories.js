import { default as SidebarComponent } from "../components/Sidebar";
import { BrowserRouter as Router } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import theme, { cacheRtl } from "../Theme";

export default {
  title: "Components/Sidebar",
  component: SidebarComponent,
};

const Template = (args) => (
  <Router>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <SidebarComponent {...args} />
      </ThemeProvider>
    </CacheProvider>
  </Router>
);

export const Sidebar = Template.bind({});

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

Sidebar.args = {
  width: 240,
  permissions: dummyPermissions,
  open: true,
  permanent: true,
  name: "someone",
  role: "something",
  organization: "somewhere",
};
