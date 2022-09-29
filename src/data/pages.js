import React from "react";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import GroupsIcon from "@mui/icons-material/Groups";
import StoreIcon from "@mui/icons-material/Store";
import BadgeIcon from "@mui/icons-material/Badge";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ApartmentIcon from "@mui/icons-material/Apartment";

import Home from "../pages/Home";

import AddClients from "../pages/client/AddClients";
import AddStatus from "../pages/client/AddStatus";
import DeletedClients from "../pages/client/DeletedClients";
import ExportClients from "../pages/client/ExportClients";
import ExportRegistry from "../pages/client/ExportRegistry";
import ImportClients from "../pages/client/ImportClients";
import ImportRegistry from "../pages/client/ImportRegistry";
import Overview from "../pages/client/Overview";
import ViewClients from "../pages/client/ViewClients";
import ViewStatus from "../pages/client/ViewStatus";

import AddProjects from "../pages/project/AddProjects";
import ViewProjects from "../pages/project/ViewProjects";

import AddEmployees from "../pages/employee/AddEmployees";
import AddJobs from "../pages/employee/AddJobs";
import ViewEmployees from "../pages/employee/ViewEmployees";
import ViewJobs from "../pages/employee/ViewJobs";

import AddChannels from "../pages/channel/AddChannels";
import ViewChannels from "../pages/channel/ViewChannels";

import AddUnits from "../pages/unit/AddUnits";
import ViewUnits from "../pages/unit/ViewUnits";

import ChangePassword from "../pages/setting/ChangePassword";
import { Navigate } from "react-router-dom";

const pages = [
  {
    name: "الرئيسية",
    icon: <AutoAwesomeMosaicIcon />,
    path: "/",
    element: <Home />,
    permitted: [],
  },
  {
    name: "العملاء",
    icon: <GroupsIcon />,
    path: "/clients",
    subtabs: [
      {
        name: "الإحصائيات",
        path: "/overview",
        element: <Overview />,
        permitted: ["aqarstatistics"],
      },
      {
        name: "إضافة عميل جديد",
        path: "/create-client",
        element: <AddClients />,
        permitted: ["add_aqarclient"],
      },
      {
        name: "جميع العملاء",
        path: "/view-clients",
        element: <ViewClients />,
        permitted: ["view_aqarclient"],
      },
      {
        name: "العملاء الحذوفة",
        path: "/deleted-clients",
        element: <DeletedClients />,
        permitted: ["delete_aqarclient"],
      },
      {
        name: "إضافة حالة عميل",
        path: "/create-status",
        element: <AddStatus />,
        permitted: ["add_aqarevent"],
      },
      {
        name: "عرض حالات العملاء",
        path: "/view-status",
        element: <ViewStatus />,
        permitted: ["view_aqarevent"],
      },
      {
        name: "إستيراد عملاء",
        path: "/import-clients",
        element: <ImportClients />,
        permitted: ["aqarexport_file"],
      },
      {
        name: "تصدير عملاء",
        path: "/export-clients",
        element: <ExportClients />,
        permitted: ["aqarexport_file"],
      },
      {
        name: "سجل الإستيراد",
        path: "/import-records",
        element: <ImportRegistry />,
        permitted: ["view_aqarimportexportfiels"],
      },
      {
        name: "سجل التصدير",
        path: "/export-records",
        element: <ExportRegistry />,
        permitted: ["view_aqarimportexportfiels"],
      },
    ],
  },
  {
    name: "المشاريع",
    icon: <StoreIcon />,
    path: "/projects",
    subtabs: [
      {
        name: "إضافة مشروع",
        path: "/create-projects",
        element: <AddProjects />,
        permitted: ["add_aqarproject"],
      },
      {
        name: "عرض المشاريع",
        path: "/view-projects",
        element: <ViewProjects />,
        permitted: ["view_aqarproject"],
      },
    ],
  },
  {
    name: "الموظفين",
    icon: <BadgeIcon />,
    path: "/employees",
    subtabs: [
      {
        name: "إضافة وظيفة موظف",
        path: "/create-jobs",
        element: <AddJobs />,
        permitted: ["add_aqarjob"],
      },
      {
        name: "عرض وظائف الموظفين",
        path: "/view-jobs",
        element: <ViewJobs />,
        permitted: ["view_aqarjob"],
      },
      {
        name: "إضافة موظف",
        path: "/create-employees",
        element: <AddEmployees />,
        permitted: ["add_aqaremployee"],
      },
      {
        name: "عرض الموظفين",
        path: "/view-employees",
        element: <ViewEmployees />,
        permitted: ["view_aqaremployee"],
      },
    ],
  },
  {
    name: "القنوات",
    icon: <AddCircleIcon />,
    path: "/channels",
    subtabs: [
      {
        name: "إضافة قناة",
        path: "/create-channels",
        element: <AddChannels />,
        permitted: ["add_aqaremployee"],
      },
      {
        name: "عرض القنوات",
        path: "/view-channels",
        element: <ViewChannels />,
        permitted: ["view_aqaremployee"],
      },
    ],
  },
  {
    name: "الوحدات",
    icon: <ApartmentIcon />,
    path: "/units",
    subtabs: [
      {
        name: "إضافة وحدة",
        path: "/create-units",
        element: <AddUnits />,
        permitted: ["add_aqarunit"],
      },
      {
        name: "عرض الوحدات",
        path: "/view-units",
        element: <ViewUnits />,
        permitted: ["view_aqarunit"],
      },
    ],
  },
  null,
  {
    name: "الإعدادات",
    icon: <SettingsIcon />,
    path: "/settings",
    subtabs: [
      {
        name: "تغيير الرقم السري",
        path: "/change-password",
        element: <ChangePassword />,
        permitted: ["add_aqaremployee"],
      },
    ],
  },
  null,
];

export default pages;
