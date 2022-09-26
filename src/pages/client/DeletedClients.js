import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataGrid from "../../components/DataGrid";
import { useDispatch, useSelector } from "react-redux";
import { InputField, NumberField, SelectField } from "../../features/form";
import useRequest from "../../hooks/useRequest";
import { DELETED_CLIENTS, PROJECTS } from "../../data/APIs";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
} from "@mui/material";
import format from "../../utils/ISOToReadable";
import { Box } from "@mui/system";
import useAfterEffect from "../../hooks/useAfterEffect";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import RestoreIcon from "@mui/icons-material/Restore";
import PermissionsGate from "../../features/permissions/components/PermissionsGate";
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";

const DeletedClients = () => {
  //----store----
  const deletedClientsStore = useSelector(
    (state) => state.deletedClients.value
  );

  const dispatch = useDispatch();

  //----states----
  const [selected, setSelected] = useState([]);
  const [requestParams, setRequestParams] = useState({
    currentPage: [["page", 1]],
  });

  //----request hooks----
  const [deletedClientsGetRequest, deletedClientsGetResponse] = useRequest({
    path: DELETED_CLIENTS,
    method: "get",
  });

  const [deletedClientsPostRequest, deletedClientsPostResponse] = useRequest({
    path: DELETED_CLIENTS,
    method: "post",
    successMessage: "تم الإسترجاع بنجاح",
  });

  const [deletedClientsDeleteRequest, deletedClientsDeleteResponse] =
    useRequest({
      path: DELETED_CLIENTS,
      method: "delete",
      successMessage: "تم حذف العملاء بنجاح",
    });

  const handleIndividualPermanentDelete = (e, row) => {
    deletedClientsDeleteRequest({
      body: {
        id: [row.id],
      },
      onSuccess: () => {
        dispatch({
          type: "deletedClients/deleteItem",
          payload: { id: row.id },
        });
      },
    });
  };

  const handleSelectedPermanentDelete = (e) => {
    deletedClientsDeleteRequest({
      body: {
        id: [...selected.map((client) => client.id)],
      },
      onSuccess: () => {
        dispatch({
          type: "deletedClients/deleteItem",
          payload: { id: row.id },
        });
      },
    });
  };

  const [handleDelete, deleteConfirmMessage] = useConfirmMessage({
    onConfirm: handleIndividualPermanentDelete,
    text: "هل انت متأكد من انك تريد الحذف هذا الموظف؟",
  });

  const [handleDeleteSelected, deleteSelectedConfirmMessage] =
    useConfirmMessage({
      onConfirm: handleSelectedPermanentDelete,
      text: "هل انت متأكد من انك تريد الحذف هؤلاء الموظفين؟",
    });

  useEffect(() => {
    getDeletedClients();
  }, []);

  useAfterEffect(() => {
    const urlParams = new URLSearchParams();

    Object.values(requestParams).map((item) =>
      item.map(([key, value]) => urlParams.append(key, value))
    );

    deletedClientsGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "deletedClients/set", payload: res.data });
      },
    });
  }, [requestParams]);

  //----functions----
  const getDeletedClients = () => {
    deletedClientsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "deletedClients/set", payload: res.data });
      },
    });
  };

  const handlePaginate = (params) => {
    setRequestParams((old) => ({
      ...old,
      currentPage: [["page", params.current]],
    }));
  };

  const handleChecks = ({ checks }) => {
    setSelected(checks);
  };

  const handleChangeAmount = ({ value }) => {
    setRequestParams((old) => ({
      ...old,
      amount: [["size", value]],
    }));
  };

  const handleFilter = (filters) => {
    setRequestParams((old) => ({
      ...old,
      filters: filters.map(({ query }) => query),
    }));
  };

  const handleRestoreClients = () => {
    deletedClientsPostRequest({
      body: {
        id: [...selected.map((client) => client.id)],
      },
      onSuccess: (res) => {
        selected
          .map((client) => client.id)
          .map((clientId) => {
            dispatch({
              type: "deletedClients/deleteItem",
              payload: { id: clientId },
            });
          });
      },
    });
  };

  const handleRestoreClient = (e, row) => {
    deletedClientsPostRequest({
      body: {
        id: [row.id],
      },
      onSuccess: (res) => {
        dispatch({
          type: "deletedClients/deleteItem",
          payload: { id: row.id },
        });
      },
    });
  };

  const isPermitted = useIsPermitted();

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "العملاء المحذوفة"]} />
      <DataGrid
        isPending={deletedClientsGetResponse.isPending}
        columns={columns}
        rows={deletedClientsStore.results}
        total={deletedClientsStore.count ? deletedClientsStore.count : 1}
        onCheck={handleChecks}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onFilter={handleFilter}
        onDelete={isPermitted(
          (e, row) => handleDelete(e, row),
          ["delete_historicalaqarclient"]
        )}
        aditionProceduresButtons={[
          {
            icon: <RestoreIcon />,
            callback: handleRestoreClient,
          },
        ]}
        filters={filters}
      />

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Button
          variant="contained"
          disabled={!Boolean(selected.length)}
          sx={{ width: "200px", height: "50px" }}
          onClick={handleRestoreClients}
        >
          إسترجاع المحدد
        </Button>
        <PermissionsGate permissions={["delete_historicalaqarclient"]}>
          <Button
            variant="contained"
            color="error"
            disabled={!Boolean(selected.length)}
            sx={{ width: "200px", height: "50px" }}
            onClick={handleDeleteSelected}
          >
            حذف المحدد
          </Button>
        </PermissionsGate>
      </Stack>
      {deletedClientsPostResponse.successAlert}
      {deletedClientsDeleteResponse.successAlert}
      {deletedClientsPostResponse.failAlert}
      {deletedClientsDeleteResponse.failAlert}
      {deleteConfirmMessage}
      {deleteSelectedConfirmMessage}
    </Wrapper>
  );
};

const NameFilter = ({ value = "", onChange = () => {} }) => {
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

const ProjectFilter = ({ value = "", onChange = () => {} }) => {
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

const BudgetFilter = ({ value = "", onChange = () => {} }) => {
  const [type, setType] = useState("max_budget");
  const [valueState, setValueState] = useState("");

  const handleChange = (e) => {
    onChange({
      query: [type, valueState],
      value: valueState,
      renderedValue: `${valueState.toLocaleString("en")} (${
        (type === "max_budget" && "يساوي") ||
        (type === "max_budget__gte" && "اكبر من") ||
        (type === "max_budget__lte" && "اصغر من")
      })`,
    });
  };

  useAfterEffect(() => {
    handleChange();
  }, [type, valueState]);

  const handleBudgetFieldChange = (e) => {
    setValueState(e.floatValue);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <Stack spacing={2}>
      <SelectField
        value={type}
        onChange={handleTypeChange}
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
        onValueChange={handleBudgetFieldChange}
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
    customContent: ({ agent }) => agent && `${agent.name}`,
  },
];

export default DeletedClients;
