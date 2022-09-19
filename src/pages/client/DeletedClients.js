import React from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataGrid from "../../components/DataGrid";
import { useDispatch, useSelector } from "react-redux";
import { InputField, NumberField, SelectField } from "../../features/form";
import useRequest from "../../hooks/useRequest";
import { PROJECTS } from "../../data/APIs";
import { MenuItem, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const DeletedClients = () => {
  //----store----
  const deletedClientsStore = useSelector(
    (state) => state.deletedClients.value
  );

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "العملاء المحذوفة"]} />
      <DataGrid
        columns={columns}
        rows={deletedClientsStore.results}
        filters={filters}
      />
    </Wrapper>
  );
};

const NameFilter = ({ value = "", onChange = () => {}, ...props }) => {
  const handleChange = (e) => {
    onChange({
      query: ["name", e.target.value],
      value: e.target.value,
      renderedValue: e.target.value,
    });
  };

  return (
    <InputField value={value} onChange={handleChange} placeholder="الإسم" />
  );
};

const ProjectFilter = ({ value = "", onChange = () => {}, ...props }) => {
  const projectsStore = useSelector((state) => state.projects.value);

  const [getRequest, getResponse] = useRequest({
    path: PROJECTS,
    method: "get",
  });

  const dispatch = useDispatch();

  const getProjects = () => {
    getRequest({
      params: {
        size: 200,
      },
      onSuccess: (res) => {
        dispatch({ type: "projects/set", payload: res.data });
      },
    });
  };

  const handleChange = (e) => {
    onChange({
      query: ["name", e.target.value],
      value: e.target.value,
      renderedValue: projectsStore.results.find(
        (project) => project.id === e.target.value
      ).name,
    });
  };

  return (
    <SelectField
      value={value}
      onChange={handleChange}
      onOpen={getProjects}
      renderValue={(selected) => {
        return projectsStore.results.find((project) => project.id === selected)
          .name;
      }}
      isPending={getResponse.isPending}
      placeholder="المشروع"
    >
      {projectsStore.results.map((project, index) => (
        <MenuItem value={project.id} key={`projectFilterItem ${index}`}>
          {project.name}
        </MenuItem>
      ))}
    </SelectField>
  );
};

const BudgetFilter = ({ value = "", onChange = () => {}, ...props }) => {
  const [type, setType] = useState("max_budget");

  const handleChange = (e) => {
    onChange({
      query: [type, e.floatValue],
      value: e.floatValue,
      renderedValue: `${e.floatValue.toLocaleString("en")} (${
        (type === "max_budget" && "يساوي") ||
        (type === "max_budget__gte" && "اكبر من") ||
        (type === "max_budget__lte" && "اصغر من")
      })`,
    });
  };

  return (
    <Stack spacing={2}>
      <SelectField
        value={type}
        onChange={(e) => setType(e.target.value)}
        renderValue={(selected) => {
          switch (selected) {
            case "max_budget":
              return "يساوي";
            case "max_budget__gte":
              return "اكبر من";
            case "max_budget__lte":
              return "اصغر من";
            default:
              return "...";
          }
        }}
      >
        <MenuItem value="max_budget">يساوي</MenuItem>
        <MenuItem value="max_budget__gte">أكبر من</MenuItem>
        <MenuItem value="max_budget__lte">أصغر من</MenuItem>
      </SelectField>
      <NumberField
        placeholder="الميزانية"
        value={value}
        onValueChange={handleChange}
        thousandSeparator=","
      />
    </Stack>
  );
};

const filters = [
  {
    name: "الإسم",
    component: <NameFilter placeholder="الإسم" />,
  },
  {
    name: "المشروع",
    component: <ProjectFilter placeholder="الإسم" />,
  },
  {
    name: "الميزانية",
    component: <BudgetFilter />,
  },
];

const columns = [
  {
    field: "name",
    headerName: "الإسم",
    customContent: ({ user }) => `${user.first_name} ${user.last_name}`,
  },
  {
    field: "phone",
    headerName: "الهاتف",
    customContent: ({ user }) => `${user.country_code}${user.phone}`,
  },
  {
    field: "project",
    headerName: "المشروع",
    customContent: ({ bussiness }) =>
      `${bussiness.map((project) => project.name).join(" ، ")}`,
  },
  {
    field: "comment",
    headerName: "التعليق",
    customEmpty: "لا يوجد",
  },
  {
    field: "event",
    headerName: "الحالة",
    customEmpty: "لا يوجد",
  },
  {
    field: "created_at",
    headerName: "تاريخ الإنشاء",
    customContent: ({ created_at }) => format(created_at),
  },
  {
    field: "created_by",
    headerName: "تم الإنشاء بواسطة",
  },
  {
    field: "followup",
    headerName: "تاريخ المعاينة",
    customContent: ({ followup }) => (followup ? format(followup) : null),
    customEmpty: "لا يوجد",
  },
  {
    field: "agent",
    headerName: "الموظف",
    customContent: ({ agent }) => `${agent.name}`,
  },
];

export default DeletedClients;
