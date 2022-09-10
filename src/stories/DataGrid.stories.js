import { default as DataGridComponent } from "../components/DataGrid";
import { BrowserRouter as Router } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import theme, { cacheRtl } from "../Theme";

export default {
  title: "Components/DataGrid",
  component: DataGridComponent,
  argsTypes: {
    onCheck: "onCheck",
  },
};

const Template = (args) => (
  <Router>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <DataGridComponent {...args} />
      </ThemeProvider>
    </CacheProvider>
  </Router>
);

export const Basic = Template.bind({});

export const Checkboxes = Template.bind({});

export const Procedural = Template.bind({});

const dummyColumns = [
  {
    field: "column1",
    headerName: "العمود الأول",
  },
  {
    field: "column2",
    headerName: "العمود الثاني",
  },
  {
    field: "column3",
    headerName: "العمود الثالث",
  },
  {
    field: "column4",
    headerName: "العمود الرابع",
  },
  {
    field: "column5",
    headerName: "العمود الخامس",
  },
];

const dummyRows = [
  {
    column1: "حقل",
    column2: "حقل",
    column3: "حقل",
    column4: "حقل",
    column5: "حقل",
    id: 1,
  },
  {
    column1: "حقل",
    column2: "حقل",
    column3: "حقل",
    column4: "حقل",
    column5: "حقل",
    id: 2,
  },
  {
    column1: "حقل",
    column2: "حقل",
    column3: "حقل",
    column4: "حقل",
    column5: "حقل",
    id: 3,
  },
  {
    column1: "حقل",
    column2: "حقل",
    column3: "حقل",
    column4: "حقل",
    column5: "حقل",
    id: 4,
  },
  {
    column1: "حقل",
    column2: "حقل",
    column3: "حقل",
    column4: "حقل",
    column5: "حقل",
    id: 5,
  },
  {
    column1: "حقل",
    column2: "حقل",
    column3: "حقل",
    column4: "حقل",
    column5: "حقل",
    id: 6,
  },
  {
    column1: "حقل",
    column2: "حقل",
    column3: "حقل",
    column4: "حقل",
    column5: "حقل",
    id: 7,
  },
  {
    column1: "حقل",
    column2: "حقل",
    column3: "حقل",
    column4: "حقل",
    column5: "حقل",
    id: 8,
  },
];

Basic.args = {
  columns: dummyColumns,
  rows: dummyRows,
  isPending: false,
  onCheck: null,
  onView: null,
  onDelete: null,
  onArchive: null,
  onChangePassword: null,
  onBlock: null,
  onEdit: null,
};

Checkboxes.args = {
  columns: dummyColumns,
  rows: dummyRows,
  isPending: false,
  onCheck: () => {},
  onView: null,
  onDelete: null,
  onArchive: null,
  onChangePassword: null,
  onBlock: null,
  onEdit: null,
};

Procedural.args = {
  columns: dummyColumns,
  rows: dummyRows,
  isPending: false,
  onCheck: () => {},
  onView: () => {},
  onDelete: () => {},
  onArchive: () => {},
  onChangePassword: () => {},
  onBlock: () => {},
  onEdit: () => {},
};
