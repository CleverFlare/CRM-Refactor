import React from "react";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import GroupsIcon from "@mui/icons-material/Groups";
import StoreIcon from "@mui/icons-material/Store";
import BadgeIcon from "@mui/icons-material/Badge";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ApartmentIcon from "@mui/icons-material/Apartment";

import Home from "../pages/Home";
import AddClients from "../pages/client/AddClient";
import ViewClients from "../pages/client/ViewClients";

const pages = [
  {
    name: "الرئيسية",
    icon: <AutoAwesomeMosaicIcon />,
    path: "/",
    element: <Home />,
    permitted: [
      "add_aqarpost",
      "view_aqarpost",
      "delete_aqarpost",
      "change_aqarpost",
    ],
  },
  {
    name: "العملاء",
    icon: <GroupsIcon />,
    path: "/clients",
    subtabs: [
      {
        name: "الإحصائيات",
        path: "/overview",
        element: <></>,
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
        element: <></>,
        permitted: ["delete_aqarclient"],
      },
      {
        name: "إضافة حالة عميل",
        path: "/create-status",
        element: <></>,
        permitted: ["add_aqarevent"],
      },
      {
        name: "عرض حالات العملاء",
        path: "/view-status",
        element: <></>,
        permitted: ["view_aqarevent"],
      },
      {
        name: "إستيراد عملاء",
        path: "/import-clients",
        element: <></>,
        permitted: ["aqarexport_file"],
      },
      {
        name: "تصدير عملاء",
        path: "/export-clients",
        element: <></>,
        permitted: ["aqarexport_file"],
      },
      {
        name: "سجل الإستيراد",
        path: "/import-records",
        element: <></>,
        permitted: ["view_aqarimportexportfiels"],
      },
      {
        name: "سجل التصدير",
        path: "/export-records",
        element: <></>,
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
        element: <></>,
        permitted: ["add_aqarproject"],
      },
      {
        name: "عرض المشاريع",
        path: "/view-projects",
        element: <></>,
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
        name: "إضافة موظف",
        path: "/create-employees",
        element: <></>,
        permitted: ["add_aqaremployee"],
      },
      {
        name: "عرض الموظفين",
        path: "/view-employees",
        element: <></>,
        permitted: ["view_aqaremployee"],
      },
      {
        name: "إضافة وظيفة موظف",
        path: "/create-jobs",
        element: <></>,
        permitted: ["add_aqarjob"],
      },
      {
        name: "عرض وظائف الموظفين",
        path: "/view-jobs",
        element: <></>,
        permitted: ["view_aqarjob"],
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
        element: <></>,
        permitted: ["add_aqaremployee"],
      },
      {
        name: "عرض القنوات",
        path: "/view-channels",
        element: <></>,
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
        element: <></>,
        permitted: ["add_aqaremployee"],
      },
      {
        name: "عرض الوحدات",
        path: "/view-units",
        element: <></>,
        permitted: ["view_aqaremployee"],
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
        element: <></>,
        permitted: ["add_aqaremployee"],
      },
    ],
  },
  null,
];

export default pages;
