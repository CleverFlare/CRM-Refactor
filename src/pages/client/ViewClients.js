import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import DataGrid from "../../components/DataGrid";
import Breadcrumbs from "../../components/Breadcrumbs";
import format from "../../utils/ISOToReadable";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import {
  CHANNELS,
  CLIENTS,
  CLIENTS_COMMENTS,
  CLIENTS_HISTORY,
  CLIENTS_SELECTED_DELETE,
  CLIENTS_TRANSFER,
  CLIENTS_TRANSFER_PROJECT,
  EMPLOYEES,
  PROJECTS,
  STATUS,
} from "../../data/APIs";
import {
  Button,
  Stack,
  Box,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Checkbox,
  IconButton,
  RadioGroup,
  Radio,
  FormGroup,
  Menu,
  TextField,
} from "@mui/material";
import useAfterEffect from "../../hooks/useAfterEffect";
import InputField from "../../features/form/components/InputField";
import useControls from "../../hooks/useControls";
import Form, {
  MultiSelectItem,
  NumberField,
  PhoneField,
  SelectField,
  TextareaField,
} from "../../features/form";
import { v4 as uuid } from "uuid";
import filter from "../../utils/ClearNull";
import AutocompleteField from "../../features/form/components/AutocompleteField";
import Dialog, {
  DialogButton,
  DialogButtonsGroup,
  DialogContent,
  DialogForm,
  DialogHeading,
  DialogInfoWindow,
  DialogInputField,
  DialogMultiSelectField,
  DialogNumberField,
  DialogPhoneField,
  DialogSelectField,
  DialogTable,
} from "../../features/dialog";

import moment from "moment";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import DateRangeIcon from "@mui/icons-material/DateRange";

import * as XLSX from "xlsx";
import DialogPeopleWindow, {
  DialogSelectItem,
} from "../../features/dialog/components/DialogPeopleWindow";
import usePropState from "../../hooks/usePropState";
import compare from "../../utils/Compare";
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";
import PermissionsGate from "../../features/permissions/components/PermissionsGate";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import useConfirmMessage from "../../hooks/useConfirmMessage";

const ViewClients = () => {
  //----store----
  const clientsStore = useSelector((state) => state.clients.value);
  const clientCommentsStore = useSelector(
    (state) => state.clientComments.value
  );
  const employeesStore = useSelector((state) => state.employees.value);
  const projectsStore = useSelector((state) => state.projects.value);
  const channelsStore = useSelector((state) => state.channels.value);
  const statusStore = useSelector((state) => state.status.value);

  const dispatch = useDispatch();

  //----states----
  const [isCleared, setIsCleared] = useState(null);
  const [openTransferProject, setOpenTransferProject] = useState(false);
  const [
    openTransferMultipleClientsToEmployee,
    setOpenTransferMultipleClientsToEmployee,
  ] = useState(false);
  const [clientDetails, setClientDetails] = useState({
    details: null,
    tab: "details",
  });
  const [selected, setSelected] = useState([]);
  const [requestParams, setRequestParams] = useState({
    currentPage: [["page", 1]],
  });

  const [{ controls }, { setControl, resetControls }] = useControls([
    {
      control: "name",
      value: "",
      isRequired: false,
    },
    {
      control: "employee",
      value: "",
      isRequired: false,
    },
    {
      control: "code",
      value: "",
      isRequired: false,
    },
    {
      control: "phone",
      value: "",
      isRequired: false,
    },
    {
      control: "project",
      value: "",
      isRequired: false,
    },
    {
      control: "channel",
      value: "",
      isRequired: false,
    },
    {
      control: "status",
      value: "",
      isRequired: false,
    },
    {
      control: "budget",
      value: "",
      isRequired: false,
    },
    {
      control: "budgetType",
      value: "max_budget",
      isRequired: false,
    },
    {
      control: "dateStart",
      value: "",
      isRequired: false,
    },
    {
      control: "dateEnd",
      value: "",
      isRequired: false,
    },
    {
      control: "history",
      value: "",
      isRequired: false,
    },
    {
      control: "newClients",
      value: false,
      isRequired: false,
    },
  ]);

  //----request hooks----
  const [clientsGetRequest, clientsGetResponse] = useRequest({
    path: CLIENTS,
    method: "get",
  });

  const [clientCommentsGetRequest, clientCommentsGetResponse] = useRequest({
    path: CLIENTS_COMMENTS,
    method: "get",
  });

  const [clientHistoryGetRequest, clientHistoryGetResponse] = useRequest({
    path: CLIENTS_HISTORY,
    method: "get",
  });

  const [employeesGetRequest, employeesGetResponse] = useRequest({
    path: EMPLOYEES,
    method: "get",
  });

  const [projectsGetRequest, projectsGetResponse] = useRequest({
    path: PROJECTS,
    method: "get",
  });

  const [channelsGetRequest, channelsGetResponse] = useRequest({
    path: CHANNELS,
    method: "get",
  });

  const [statusGetRequest, statusGetResponse] = useRequest({
    path: STATUS,
    method: "get",
  });

  const [clientCommentPostRequest] = useRequest({
    path: CLIENTS_COMMENTS,
    method: "post",
  });

  const [clientTransferPostRequest, clientTransferPostResponse] = useRequest({
    path: CLIENTS_TRANSFER,
    method: "post",
    successMessage: "???? ??????????????",
  });

  const [clientTransferProjectPostRequest, clientTransferProjectPostResponse] =
    useRequest({
      path: CLIENTS_TRANSFER_PROJECT,
      method: "post",
      successMessage: "???? ?????????? ??????????????",
    });

  //----effects----
  useEffect(() => {
    getClients();
  }, []);

  useAfterEffect(() => {
    if (!clientDetails.details) return;
    setClientDetails((old) => ({
      ...old,
      details: clientsStore.results.find((item) => item.id === old.details?.id),
    }));
  }, [clientsStore]);

  useAfterEffect(() => {
    const urlParams = new URLSearchParams();

    Object.values(requestParams).map((item) =>
      item.map(([key, value]) => urlParams.append(key, value))
    );

    clientsGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "clients/set", payload: res.data });
      },
    });
  }, [requestParams]);

  //----functions----
  const getClients = () => {
    clientsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "clients/set", payload: res.data });
      },
    });
  };

  //===Start===== Delete Client Logic =========

  const [clientDeleteRequest, clientDeleteResponse] = useRequest({
    path: CLIENTS,
    method: "delete",
    successMessage: "???? ?????????? ??????????",
  });

  const deleteClient = (e, { id }) => {
    clientDeleteRequest({
      id: id,
      onSuccess: () => {
        dispatch({ type: "clients/deleteItem", payload: { id } });
      },
    });
  };

  const [handleDeleteClient, deleteClientConfirmDialog] = useConfirmMessage({
    onConfirm: deleteClient,
    text: "???? ?????? ?????????? ???? ?????? ???????? ?????? ?????? ??????????????",
  });

  //===End===== Delete Client Logic =========

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
      currentPage: [["page", 1]],
      amount: [["size", value]],
    }));
  };

  const handleFilter = (filters) => {
    setRequestParams((old) => ({
      ...old,
      filters: filters.map(({ query }) => query),
    }));
  };

  const handleFormFilterSubmit = () => {
    const params = filter({
      obj: {
        name: controls.name,
        agent: controls.employee === 0 ? "0" : controls.employee,
        job: controls.job,
        user__country_code: encodeURIComponent(controls.code),
        user__phone: controls.phone,
        bussiness: controls.project,
        event: controls.newClients ? undefined : controls.status,
        channel: controls.channel,
        state: controls.newClients ? 1 : undefined,
        [controls.budgetType]: controls.budget.replace(/,/gi, ""),
        created_at:
          controls.dateStart && controls.dateEnd
            ? `${controls.dateStart
                .split("-")
                .reverse()
                .join("/")}-${controls.dateEnd.split("-").reverse().join("/")}`
            : undefined,
        history_date: controls?.history,
      },
      output: "object",
    });
    setRequestParams((old) => ({
      ...old,
      filters: Object.entries(params),
    }));
  };

  const handleClearFilters = () => {
    setRequestParams((old) => ({ ...old, filters: [] }));
    resetControls();
    setIsCleared(uuid());
  };

  const getEmployees = () => {
    if (employeesStore.results.length) return;
    employeesGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        dispatch({ type: "employees/set", payload: res.data });
      },
    });
  };

  const getProjects = () => {
    if (projectsStore.results.length) return;
    projectsGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        dispatch({ type: "projects/set", payload: res.data });
      },
    });
  };

  const getChannels = () => {
    if (channelsStore.results.length) return;
    channelsGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        dispatch({ type: "channels/set", payload: res.data });
      },
    });
  };

  const getStatus = () => {
    if (statusStore.results.length) return;
    statusGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        dispatch({ type: "status/set", payload: res.data });
      },
    });
  };

  const handleExportExcelSheet = () => {
    const properFormat = selected.map((item) => {
      return {
        full_name: item.user.first_name
          ? `${item.user.first_name} ${item.user.last_name}`
          : "",
        phone: `${item.user.country_code}${item.user.phone}`,
        project: `${item.bussiness
          .map((project) => project?.name)
          .join(" ?? ")}`,
        channel: `${item.channel}`,
        agent: `${item.agent.name}`,
        status: `${item.event}`,
        comment: `${item.comment}`,
        created_by: `${item.created_by}`,
        created_at: `${item.created_at}`,
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(properFormat);

    XLSX.utils.book_append_sheet(wb, ws, "clientsSheet");

    XLSX.writeFile(wb, "CRM Clients Sheet.xlsx");
  };

  const getClientHistory = () => {
    clientHistoryGetRequest({
      params: {
        id: clientDetails.details.id,
      },
      onSuccess: (res) => {
        dispatch({ type: "clientHistory/set", payload: res.data });
      },
    });
  };

  const getComments = () => {
    clientCommentsGetRequest({
      params: {
        id: clientDetails.details.id,
      },
      onSuccess: (res) => {
        dispatch({ type: "clientComments/set", payload: res.data });
      },
    });
  };

  const handleCloseDetailsDialog = () => {
    setClientDetails((old) => ({ ...old, details: null, tab: "details" }));
  };

  const handleSubmitComment = async (e) => {
    const requestBody = filter({
      obj: e,
      output: "object",
    });

    return clientCommentPostRequest({
      body: requestBody,
      onSuccess: (res) => {
        dispatch({ type: "clientComments/addItem", payload: res.data });
        dispatch({
          type: "clients/patchItem",
          payload: {
            id: res.data.client_id,
            item: { comment: res.data.comment, event: res.data.event },
          },
        });
      },
    });
  };

  const handleSubmitEmployeeTransfer = (e) => {
    clientTransferPostRequest({
      body: e,
      onSuccess: (res) => {
        setOpenTransferMultipleClientsToEmployee(false);
        setClientDetails((old) => ({ ...old, details: null, tab: "details" }));
        if (res.data.hasOwnProperty("clients")) {
          res.data.clients.map((client) => {
            dispatch({
              type: "clients/patchItem",
              payload: { id: client.id, item: { ...client } },
            });
          });
        } else {
          dispatch({
            type: "clients/patchItem",
            payload: { id: res.data.id, item: { ...res.data } },
          });
        }
      },
    });
  };

  const handleSubmitProjectTransfer = (e) => {
    clientTransferProjectPostRequest({
      body: e,
      onSuccess: (res) => {
        setOpenTransferProject(false);
        if (res.data.hasOwnProperty("clients")) {
          res.data.clients.map((client) => {
            dispatch({
              type: "clients/patchItem",
              payload: { id: client.id, item: { ...client } },
            });
          });
        } else {
          dispatch({
            type: "clients/patchItem",
            payload: { id: res.data.id, item: { ...res.data } },
          });
        }
      },
    });
  };

  const [editData, setEditData] = useState(null);

  const isPermitted = useIsPermitted();

  //===Start===== Delete Selected Clients Logic ===========

  const [selectedClientsDeleteRequest, selectedClientsDeleteResponse] =
    useRequest({
      path: CLIENTS_SELECTED_DELETE,
      method: "delete",
      successMessage: "???? ?????? ?????????????? ??????????",
    });

  const deleteSelected = () => {
    selectedClientsDeleteRequest({
      body: {
        client: selected.map((client) => client.id),
      },
      onSuccess: () => {
        selected.map((client) => {
          dispatch({ type: "clients/deleteItem", payload: { id: client.id } });
        });
      },
    });
  };

  const [handleDeleteSelected, deleteSelectedConfirmDialog] = useConfirmMessage(
    {
      onConfirm: deleteSelected,
      text: "???? ?????? ?????????? ???? ?????? ???????? ?????? ?????????? ????????????????",
    }
  );

  //===End===== Delete Selected Clients Logic ===========

  return (
    <Wrapper>
      <Breadcrumbs path={["??????????????", "???????? ??????????????"]} />

      {/* filteration form */}
      <Form
        childrenProps={{
          saveBtn: {
            onClick: handleFormFilterSubmit,
            children: "??????????",
          },
          closeBtn: {
            onClick: handleClearFilters,
          },
        }}
      >
        <InputField
          label="??????????"
          placeholder="??????????"
          value={controls.name}
          onChange={(e) => setControl("name", e.target.value)}
        />
        <AutocompleteField
          label="?????????? ????????????????"
          placeholder="?????????? ????????????????"
          key={`employee ${isCleared}`}
          onOpen={getEmployees}
          isPending={employeesGetResponse.isPending}
          value={controls.employee}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, options, reason) => {
            switch (reason) {
              case "selectOption":
                setControl("employee", options.value);
                break;
              case "clear":
                setControl("employee", "");
            }
          }}
          data={[
            {
              label: `????????`,
              value: 0,
            },
            ...employeesStore.results.map((employee) => ({
              label: `${employee.user.first_name} ${employee.user.last_name}`,
              value: employee.id,
            })),
          ]}
        />
        <PhoneField
          label="????????????"
          placeholder="????????????"
          requiredCode
          selectProps={{
            value: controls.code,
            onChange: (e) => {
              setControl("code", e.target.value);
            },
          }}
          onChange={(e) => {
            setControl("phone", e.target.value);
          }}
          value={controls.phone}
        />
        <AutocompleteField
          label="??????????????"
          placeholder="??????????????"
          key={`project ${isCleared}`}
          onOpen={getProjects}
          isPending={projectsGetResponse.isPending}
          value={controls.project}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, options, reason) => {
            switch (reason) {
              case "selectOption":
                setControl("project", options.value);
                break;
              case "clear":
                setControl("project", "");
            }
          }}
          data={projectsStore.results.map((project) => ({
            label: project.name,
            value: project.id,
          }))}
        />
        <AutocompleteField
          label="???????????? ??????????????????"
          placeholder="???????????? ??????????????????"
          key={`channel ${isCleared}`}
          onOpen={getChannels}
          isPending={channelsGetResponse.isPending}
          value={controls.channel}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, options, reason) => {
            switch (reason) {
              case "selectOption":
                setControl("channel", options.value);
                break;
              case "clear":
                setControl("channel", "");
            }
          }}
          data={channelsStore.results.map((channel) => ({
            label: channel.name,
            value: channel.id,
          }))}
        />
        <AutocompleteField
          label="????????????"
          placeholder="????????????"
          key={`status ${isCleared}`}
          onOpen={getStatus}
          isPending={statusGetResponse.isPending}
          disabled={Boolean(controls.newClients)}
          value={controls.status}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, options, reason) => {
            switch (reason) {
              case "selectOption":
                setControl("status", options.value);
                break;
              case "clear":
                setControl("status", "");
            }
          }}
          data={statusStore.results.map((status) => ({
            label: status.name,
            value: status.name,
          }))}
        />
        <NumberField
          label="??????????????????"
          placeholder="??????????????????"
          thousandSeparator
          value={controls.budget}
          onChange={(e) => setControl("budget", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SelectField
                  defaultValue="equal"
                  sx={{
                    width: "100px",
                  }}
                  SelectProps={{
                    sx: {
                      "&.MuiInputBase-root": {
                        borderRadius: 0,
                        border: "none",
                      },
                    },
                  }}
                  value={controls.budgetType}
                  onChange={(e) => setControl("budgetType", e.target.value)}
                  renderValue={(selected) => {
                    switch (selected) {
                      case "max_budget":
                        return "??????????";
                      case "max_budget__gte":
                        return "???????? ????";
                      case "max_budget__lte":
                        return "???????? ????";
                      default:
                        return "...";
                    }
                  }}
                >
                  <MenuItem value="max_budget">??????????</MenuItem>
                  <MenuItem value="max_budget__gte">???????? ????</MenuItem>
                  <MenuItem value="max_budget__lte">???????? ????</MenuItem>
                </SelectField>
              </InputAdornment>
            ),
          }}
        />
        <InputField
          type="date"
          label="???????????? ????"
          value={controls.dateStart}
          onChange={(e) => {
            if (
              controls.dateEnd &&
              parseInt(controls.dateEnd.split("-").join("")) <
                parseInt(e.target.value.split("-").join(""))
            ) {
              setControl("dateStart", controls.dateEnd);
              return;
            }

            setControl("dateStart", e.target.value);
          }}
        />
        <InputField
          type="date"
          label="???????????? ??????"
          value={controls.dateEnd}
          onChange={(e) => {
            if (
              controls.dateStart &&
              parseInt(controls.dateStart.split("-").join("")) >
                parseInt(e.target.value.split("-").join(""))
            ) {
              setControl("dateEnd", controls.dateStart);
              return;
            }

            setControl("dateEnd", e.target.value);
          }}
        />
        <InputField
          type="date"
          label="?????????? ??????????"
          value={controls.history}
          onChange={(e) => setControl("history", e.target.value)}
        />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <FormControlLabel
            label="?????????????? ??????????"
            control={
              <Checkbox
                checked={Boolean(controls.newClients)}
                onChange={(e) => setControl("newClients", e.target.checked)}
              />
            }
          />
        </Box>
      </Form>

      {/* datagrid */}
      <DataGrid
        columns={columns}
        rows={clientsStore.results}
        isPending={clientsGetResponse.isPending}
        total={clientsStore.count ? clientsStore.count : 1}
        onCheck={handleChecks}
        onEdit={isPermitted(
          (e, row) => setEditData(row),
          ["change_aqarclient"]
        )}
        onDelete={isPermitted(
          (e, row) => handleDeleteClient(e, row),
          ["delete_aqarclient"]
        )}
        onView={(e, row) => {
          setClientDetails((old) => ({
            ...old,
            details: row,
          }));
        }}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onFilter={handleFilter}
      />

      <TransferToEmployeeDialog
        open={Boolean(
          clientDetails.details && clientDetails.tab === "transfer"
        )}
        onOpen={getEmployees}
        onClose={handleCloseDetailsDialog}
        onGoBack={() => setClientDetails((old) => ({ ...old, tab: "details" }))}
        initSelected={clientDetails?.details?.agent?.id}
        id={clientDetails.details?.id}
        data={[
          {
            title: "????????????",
            body: "????????????",
            picture: "asdfsd",
            id: null,
          },
          ...employeesStore.results.map((employee) => ({
            title: `${employee.user.first_name} ${employee.user.last_name}`,
            body: employee.job.title,
            id: employee.id,
            picture: employee.user.image,
          })),
        ]}
        isPending={employeesGetResponse.isPending}
        submitPending={clientTransferPostResponse.isPending}
        onSubmit={handleSubmitEmployeeTransfer}
      />

      <CommentDialog
        open={Boolean(clientDetails.details && clientDetails.tab === "comment")}
        onOpen={getComments}
        onClose={handleCloseDetailsDialog}
        onGoBack={() => setClientDetails((old) => ({ ...old, tab: "details" }))}
        isPending={clientCommentsGetResponse.isPending}
        data={clientCommentsStore.results.map((item) => ({
          body: item.comment,
          date: format(item.created_at),
          title: item.commenter.fullname,
          picture: item.commenter.image,
          status: item.event,
        }))}
        id={clientDetails.details?.id}
        onStatusOpen={getStatus}
        isStatusPending={statusGetResponse.isPending}
        status={statusStore.results.map((item) => ({
          name: item.name,
          value: item.id,
        }))}
        onSubmit={handleSubmitComment}
      />

      <InfoDialog
        open={Boolean(clientDetails.details && clientDetails.tab === "details")}
        onOpen={getClientHistory}
        onClose={handleCloseDetailsDialog}
        data={Boolean(clientDetails.details) && clientDetails.details}
        isHistoryPending={clientHistoryGetResponse.isPending}
        onTransferAgentClick={() =>
          setClientDetails((old) => ({ ...old, tab: "transfer" }))
        }
        onCommentsClick={() =>
          setClientDetails((old) => ({ ...old, tab: "comment" }))
        }
      />

      <TransferToEmployeeDialog
        open={openTransferMultipleClientsToEmployee}
        onClose={() => setOpenTransferMultipleClientsToEmployee(false)}
        onOpen={getEmployees}
        id={selected.map((item) => item.id)}
        data={[
          {
            title: "????????????",
            body: "????????????",
            picture: "asdfsd",
            id: null,
          },
          ...employeesStore.results.map((employee) => ({
            title: `${employee.user.first_name} ${employee.user.last_name}`,
            body: employee.job.title,
            id: employee.id,
            picture: employee.user.image,
          })),
        ]}
        isPending={employeesGetResponse.isPending}
        submitPending={clientTransferPostResponse.isPending}
        onSubmit={handleSubmitEmployeeTransfer}
      />

      <TransferToProjectDialog
        open={openTransferProject}
        onClose={() => setOpenTransferProject(false)}
        onOpen={getProjects}
        isPending={projectsGetResponse.isPending}
        id={selected.map((item) => item.id)}
        data={projectsStore.results.map((item) => ({
          name: item.name,
          picture: item.logo,
          id: item.id,
        }))}
        submitPending={clientTransferProjectPostResponse.isPending}
        onSubmit={handleSubmitProjectTransfer}
      />

      <EditDialog
        open={Boolean(editData)}
        onClose={() => setEditData(null)}
        data={editData}
      />

      {/* buttons */}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <PermissionsGate permissions={["delete_aqarclient"]}>
          <Button
            variant="contained"
            color="error"
            disabled={
              !Boolean(selected.length) ||
              selectedClientsDeleteResponse.isPending
            }
            sx={{ width: "200px", height: "50px" }}
            onClick={handleDeleteSelected}
          >
            ?????? ????????????
          </Button>
        </PermissionsGate>
        <Button
          variant="contained"
          disabled={!Boolean(selected.length)}
          sx={{ width: "200px", height: "50px" }}
          onClick={() => handleExportExcelSheet()}
        >
          ?????????? ????????????
        </Button>
        <PermissionsGate permissions={["aqartransfer_clients"]}>
          <Button
            variant="contained"
            disabled={!Boolean(selected.length)}
            sx={{ width: "200px", height: "50px" }}
            onClick={() => setOpenTransferMultipleClientsToEmployee(true)}
          >
            ?????????? ????????????
          </Button>
        </PermissionsGate>
        <Button
          variant="contained"
          disabled={!Boolean(selected.length)}
          sx={{ width: "200px", height: "50px" }}
          onClick={() => setOpenTransferProject(true)}
        >
          ?????????? ???????????? ????????????
        </Button>
      </Stack>

      {selectedClientsDeleteResponse.successAlert}
      {selectedClientsDeleteResponse.failAlert}
      {clientDeleteResponse.successAlert}
      {clientDeleteResponse.failAlert}

      {deleteSelectedConfirmDialog}
      {deleteClientConfirmDialog}
    </Wrapper>
  );
};

export default ViewClients;

const InfoDialog = ({
  data,
  isHistoryPending,
  open,
  onOpen,
  onClose,
  onTransferAgentClick = () => {},
  onCommentsClick = () => {},
}) => {
  //----store----
  const historyStore = useSelector((state) => state.clientHistory.value);

  const dispatch = useDispatch();

  //====Start===== Preview Date Logic ===============

  const [previewDatePicker, setPreviewDatePicker] = useState(null);
  const openPreviewPicker = Boolean(previewDatePicker);
  const [selectedPreviewDate, setSelectedPreviewDate] = useState("");

  const [previewDatePatchRequest, previewDatePatchResponse] = useRequest({
    path: CLIENTS,
    method: "patch",
  });

  const handlePreviewSubmit = () => {
    previewDatePatchRequest({
      id: data.id,
      body: {
        user: {},
        followup: moment(selectedPreviewDate).format(),
      },
      onSuccess: (res) => {
        setPreviewDatePicker(null);
        dispatch({
          type: "clients/putItem",
          payload: { id: res.data.id, item: res.data },
        });
        data.followup = res.data.followup;
      },
    }).then(() => {
      setPreviewDatePicker(null);
    });
  };

  //----variables----
  const info = [
    {
      name: "??????????",
      value: `${data?.user?.first_name} ${data?.user?.last_name}`,
    },
    {
      name: "????????????",
      value: `(${data?.user?.country_code})${data?.user?.phone}`,
      addition: (
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          <IconButton
            sx={{ color: "white" }}
            onClick={() =>
              window.open(
                "https://wa.me/" +
                  `${data?.user?.country_code}${data?.user?.phone}`,
                "_blank"
              )
            }
          >
            <WhatsAppIcon fontSize="small" sx={{ color: "#5ef979" }} />
          </IconButton>
          <IconButton
            sx={{ color: "white" }}
            onClick={() =>
              window.open(
                "https://www.truecaller.com/search/eg/" +
                  `${data?.user?.country_code}${data?.user?.phone}`,
                "_blank"
              )
            }
          >
            <CallIcon fontSize="small" sx={{ color: "#127fff" }} />
          </IconButton>
        </Box>
      ),
    },
    {
      name: "??????????????",
      value: data?.business?.map((project) => project?.name)?.join(" ?? "),
    },
    {
      name: "???????????? ??????????????????",
      value: data?.channel?.name,
    },
    {
      name: "????????",
      value: data?.agent?.name,
      addition: (
        <PermissionsGate permissions={["aqartransfer_clients"]}>
          <IconButton sx={{ color: "white" }} onClick={onTransferAgentClick}>
            <ChangeCircleIcon
              sx={{ color: "white", transform: "scale(1.2)" }}
            />
          </IconButton>
        </PermissionsGate>
      ),
    },
    {
      name: "?????????? ??????????????",
      value: data?.created_at ? format(data?.created_at) : "",
      customEmpty: "???? ????????",
    },
    {
      name: "?????????? ????????????????",
      value: data?.followup ? format(data?.followup) : "",
      customEmpty: "???? ????????",
      addition: (
        <PermissionsGate permissions={[]}>
          <IconButton
            sx={{ color: "white" }}
            onClick={(e) => setPreviewDatePicker(e.currentTarget)}
          >
            <DateRangeIcon sx={{ color: "white", transform: "scale(1.2)" }} />
          </IconButton>
          <Menu
            open={openPreviewPicker}
            anchorEl={previewDatePicker}
            onClose={() => setPreviewDatePicker(null)}
            PaperProps={{
              sx: {
                "& .MuiList-root": {
                  p: 2,
                },
              },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="DateTimePicker"
                value={selectedPreviewDate}
                onChange={(newValue) => {
                  setSelectedPreviewDate(newValue);
                }}
                renderInput={(params) => (
                  <InputField
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": {
                        border: "none",
                      },
                    }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              sx={{ width: "100%", marginTop: 3 }}
              disabled={previewDatePatchResponse.isPending}
              onClick={(e) => {
                handlePreviewSubmit({
                  ...e,
                  selectedPreviewDate,
                  clientId: data.id,
                });
              }}
            >
              ??????
            </Button>
          </Menu>
        </PermissionsGate>
      ),
    },
    {
      name: "??????????",
      value: data?.comment,
      addition: (
        <PermissionsGate permissions={["view_aqarclientcomment"]}>
          <IconButton sx={{ color: "white" }} onClick={onCommentsClick}>
            <ModeCommentIcon sx={{ color: "white" }} />
          </IconButton>
        </PermissionsGate>
      ),
    },
    {
      name: "??????????????????",
      value: data?.max_budget,
    },
  ];

  const columns = [
    {
      field: "projects",
      headerName: "??????????????????",
      customContent: ({ rowData }) => `${rowData?.bussiness?.join(" ?? ")}`,
    },
    {
      field: "channel",
      headerName: "??????????????",
    },
    {
      field: "agent",
      headerName: "????????????",
    },
    {
      field: "history_user",
      headerName: "????????????",
      customContent: ({ rowData }) =>
        rowData.history_user
          ? `${rowData.history_user.first_name} ${rowData.history_user.last_name}`
          : "",
    },
    {
      field: "comment",
      headerName: "??????????????",
    },
    {
      field: "event",
      headerName: "????????????",
    },
    {
      field: "history_date",
      headerName: "?????????? ??????????????",
      customContent: ({ rowData }) =>
        rowData.history_date ? format(rowData.history_date) : "",
    },
  ];

  //----effects----
  useAfterEffect(() => {
    if (!open) return;
    onOpen();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeading>???????????? ????????????</DialogHeading>
      <DialogInfoWindow information={info} />
      <PermissionsGate permissions={["view_historicalaqarclient"]}>
        <DialogHeading>?????? ????????????</DialogHeading>
        <DialogTable
          rows={historyStore.results}
          columns={columns}
          isPending={isHistoryPending}
        />
      </PermissionsGate>
      <DialogButtonsGroup>
        <DialogButton variant="close" onClick={onClose}>
          ??????????
        </DialogButton>
      </DialogButtonsGroup>
    </Dialog>
  );
};
const columns = [
  {
    field: "name",
    headerName: "??????????",
    customContent: ({ user }) => `${user.first_name} ${user.last_name}`,
  },
  {
    field: "phone",
    headerName: "????????????",
    customContent: ({ user }) => `${user.country_code}${user.phone}`,
  },
  {
    field: "project",
    headerName: "??????????????",
    customContent: ({ bussiness }) =>
      `${bussiness?.map((project) => project?.name).join(" ?? ")}`,
  },
  {
    field: "comment",
    headerName: "??????????????",
    customEmpty: "???? ????????",
  },
  {
    field: "event",
    headerName: "????????????",
    customEmpty: "???? ????????",
  },
  {
    field: "created_at",
    headerName: "?????????? ??????????????",
    customContent: ({ created_at }) => format(created_at),
  },
  {
    field: "created_by",
    headerName: "???? ?????????????? ????????????",
  },
  {
    field: "followup",
    headerName: "?????????? ????????????????",
    customContent: ({ followup }) => (followup ? format(followup) : null),
    customEmpty: "???? ????????",
  },
  {
    field: "agent",
    headerName: "????????????",
    customContent: ({ agent }) => Boolean(agent.name) && `${agent.name}`,
    customEmpty: "????????",
  },
];

const TransferToEmployeeDialog = ({
  open,
  onOpen = () => {},
  onClose = () => {},
  onGoBack = () => {},
  isPending = false,
  submitPending = false,
  id,
  data = [],
  initSelected,
  onSubmit = () => {},
}) => {
  const [selected, setSelected] = usePropState(initSelected, [initSelected]);
  const [searchValue, setSearchValue] = useState("");
  const [method, setMethod] = useState(1);

  const handleChangeSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({
      agent: selected,
      client: id,
      option: Boolean(parseInt(method)),
    });
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      paperProps={{
        maxWidth: 450,
      }}
    >
      <DialogHeading onGoBack={onGoBack}>?????????? ?????? ????????</DialogHeading>
      <DialogPeopleWindow
        isPending={isPending}
        searchValue={searchValue}
        onSearch={handleChangeSearchValue}
        sx={{ height: 400 }}
      >
        {data
          ?.filter(
            (item) =>
              item.title.toLowerCase().includes(searchValue) ||
              item.body.toLowerCase().includes(searchValue)
          )
          ?.map((item, index) => (
            <DialogSelectItem
              key={`selectEmployeeItem ${index}`}
              selected={item.id === selected}
              picture={item.picture}
              title={item.title}
              body={item.body}
              onClick={() => setSelected(item.id)}
            />
          ))}
      </DialogPeopleWindow>
      <PermissionsGate permissions={["delete_historicalaqarclient"]}>
        <DialogContent>
          <FormGroup>
            <RadioGroup
              name="transfer-method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <FormControlLabel
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "& *": {
                        color: "white",
                      },
                    }}
                  />
                }
                label="?????? ??????????????"
                value={1}
              />
              <FormControlLabel
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "& *": {
                        color: "white",
                      },
                    }}
                  />
                }
                label="?????? ??????????????"
                value={0}
              />
            </RadioGroup>
          </FormGroup>
        </DialogContent>
      </PermissionsGate>
      <DialogButtonsGroup>
        <DialogButton onClick={handleSubmit} disabled={submitPending}>
          ??????????
        </DialogButton>
        <DialogButton variant="close" onClick={onClose}>
          ??????????
        </DialogButton>
      </DialogButtonsGroup>
    </Dialog>
  );
};

TransferToEmployeeDialog.propTypes = {
  open: PropTypes.bool,
  isPending: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      picture: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
    })
  ),
};

const CommentDialog = ({
  open,
  onOpen = () => {},
  onClose = () => {},
  onGoBack = () => {},
  isPending = false,
  isStatusPending = false,
  onStatusOpen = () => {},
  data = [],
  id = null,
  status = [],
  onSubmit = () => {},
}) => {
  const [search, setSearch] = useState("");
  const [
    { controls, required, invalid },
    { setControl, validate, resetControls },
  ] = useControls([
    {
      control: "comment",
      value: "",
      isRequired: true,
    },
    {
      control: "status",
      value: "",
      isRequired: true,
    },
  ]);

  const handleSubmit = () => {
    validate().then((output) => {
      if (!output.isOk) return;
      onSubmit({
        event: controls.status,
        comment: controls.comment,
        client: id,
      }).then((e) => {
        resetControls();
      });
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      paperProps={{
        maxWidth: 600,
      }}
    >
      <DialogHeading onGoBack={onGoBack}>??????????????????</DialogHeading>
      <DialogPeopleWindow
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
        isPending={isPending}
        sx={{ height: 400 }}
      >
        {data
          .filter(
            (item) =>
              item.title.includes(search) ||
              item.body.includes(search) ||
              item.status.includes(search)
          )
          .map((item, index) => (
            <DialogSelectItem
              key={`comment ${index}`}
              title={item.title}
              body={`${item.body} [${item.status}]`}
              subtitle={item.date}
              picture={item.picture}
            />
          ))}
      </DialogPeopleWindow>
      <PermissionsGate permissions={["add_aqarclientcomment"]}>
        <DialogContent>
          <Stack spacing={2}>
            <TextareaField
              placeholder="??????????"
              sx={{
                "& .MuiInput-root": {
                  bgcolor: "white",
                },
              }}
              value={controls.comment}
              required={required.includes("comment")}
              error={Boolean(invalid?.comment)}
              helperText={invalid?.comment}
              onChange={(e) => setControl("comment", e.target.value)}
            />
            <SelectField
              placeholder="????????????"
              isPending={isStatusPending}
              onOpen={onStatusOpen}
              sx={{
                "& .MuiInput-root": {
                  bgcolor: "white",
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 100,
                      overflowY: "auto",
                    },
                  },
                },
              }}
              renderValue={(selected) =>
                status.find((item) => item.value === selected).name
              }
              value={controls.status}
              required={required.includes("status")}
              error={Boolean(invalid?.status)}
              helperText={invalid?.status}
              onChange={(e) => setControl("status", e.target.value)}
            >
              {status.map((item, index) => (
                <MenuItem key={`message status ${index}`} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </SelectField>
          </Stack>
        </DialogContent>
      </PermissionsGate>
      <DialogButtonsGroup>
        <DialogButton onClick={handleSubmit}>??????????</DialogButton>
        <DialogButton variant="close" onClick={onClose}>
          ??????????
        </DialogButton>
      </DialogButtonsGroup>
    </Dialog>
  );
};

const TransferToProjectDialog = ({
  open,
  onOpen = () => {},
  onClose = () => {},
  onGoBack = () => {},
  isPending = false,
  submitPending = false,
  id,
  data = [],
  onSubmit = () => {},
}) => {
  const [selected, setSelected] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChangeSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({
      bussiness: selected,
      client: id,
    });
  };

  const handleToggleSelect = (selectedItem) => {
    switch (selected.includes(selectedItem)) {
      case true:
        setSelected((old) => old.filter((item) => item !== selectedItem));
        break;
      case false:
        setSelected((old) => [...old, selectedItem]);
        break;
      default:
        setSelected((old) => old);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      paperProps={{
        maxWidth: 450,
      }}
    >
      <DialogHeading onGoBack={onGoBack}>?????????? ???????????? ????????????</DialogHeading>
      <DialogPeopleWindow
        isPending={isPending}
        searchValue={searchValue}
        onSearch={handleChangeSearchValue}
        sx={{ height: 400 }}
      >
        {data
          ?.filter((item) => item.name.toLowerCase().includes(searchValue))
          ?.map((item, index) => (
            <DialogSelectItem
              key={`selectProjectItem ${index}`}
              selected={selected.includes(item.id)}
              picture={item.picture}
              body={item.name}
              onClick={() => handleToggleSelect(item.id)}
            />
          ))}
      </DialogPeopleWindow>
      <DialogButtonsGroup>
        <DialogButton onClick={handleSubmit} disabled={submitPending}>
          ??????????
        </DialogButton>
        <DialogButton variant="close" onClick={onClose}>
          ??????????
        </DialogButton>
      </DialogButtonsGroup>
    </Dialog>
  );
};

TransferToProjectDialog.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      picture: PropTypes.string,
    })
  ),
};

const EditDialog = ({ open, onClose, data }) => {
  const [{ controls, invalid }, { setControl, validate }] = useControls(
    [
      {
        control: "name",
        value: `${data?.user?.first_name} ${data?.user?.last_name}`,
        isRequired: true,
      },
      {
        control: "email",
        value: data?.user?.email,
        validations: [
          {
            test: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "???????????? ?????? ????????",
          },
        ],
      },
      {
        control: "phone",
        value: data?.user?.phone,
        isRequired: true,
      },
      {
        control: "countryCode",
        value: data?.user?.country_code,
        isRequired: true,
      },
      {
        control: "project",
        value: data?.bussiness?.map((project) => project.id) ?? [],
        isRequired: true,
        convert: (project) => project.join("-"),
      },
      {
        control: "contact",
        value: data?.fav_contacts,
      },
      {
        control: "channel",
        value: data?.channel?.id,
        isRequired: true,
      },
      {
        control: "budget",
        value: data?.max_budget,
      },
    ],
    [data]
  );

  const [projectsState, setProjectsState] = useState([]);
  const [projectsGetRequest, projectsGetResponse] = useRequest({
    path: PROJECTS,
    method: "get",
  });
  const getProjects = () => {
    if (projectsState.length) return;
    projectsGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        setProjectsState(res.data.results);
      },
    });
  };

  const [channelsState, setChannelsState] = useState([]);
  const [channelsGetRequest, channelsGetResponse] = useRequest({
    path: CHANNELS,
    method: "get",
  });
  const getChannels = () => {
    if (channelsState.length) return;
    channelsGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        setChannelsState(res.data.results);
      },
    });
  };

  const [clientPatchRequest, clientPatchResponse] = useRequest({
    path: CLIENTS,
    method: "patch",
    successMessage: "???? ?????????? ???????????? ??????????",
  });

  const dispatch = useDispatch();

  const handleSubmit = () => {
    const isThereChange = compare(
      [
        [controls.name, `${data?.user?.first_name} ${data?.user?.last_name}`],
        [controls.email, data?.user?.email],
        [controls.project, data?.bussiness.map((project) => project.id)],
        [controls.channel, data?.channel?.id],
        [controls.contact, data?.fav_contacts],
        [controls.budget, data?.max_budget],
      ],
      false
    );

    console.log(!isThereChange);

    if (!isThereChange) return;

    validate().then(({ isOk }) => {
      if (!isOk) return;

      const requestBody = filter({
        obj: {
          user: {
            first_name: controls.name.split(/(?<=^\S+)\s/)[0],
            last_name: controls.name.split(/(?<=^\S+)\s/)?.[1],
            phone: controls.countryCode + controls.phone,
            email: controls.email,
          },
          ...(Boolean(controls.project.length) && {
            bussiness: controls.project,
          }),
          channel: controls.channel,
          agent: controls.employee,
          fav_contacts: controls.contact,
          max_budget: controls.budget.replace(/,/gi, ""),
        },
        output: "object",
      });

      clientPatchRequest({
        id: data.id,
        body: requestBody,
        onSuccess: (res) => {
          onClose();
          dispatch({
            type: "clients/putItem",
            payload: { id: res.data.id, item: res.data },
          });
        },
      });
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeading onGoBack={onClose}>?????????? ???????????? ????????????</DialogHeading>
      <DialogForm>
        <DialogInputField
          placeholder="??????????"
          label="??????????"
          value={controls.name}
          onChange={(e) => setControl("name", e.target.value)}
          error={Boolean(invalid.name)}
          helperText={invalid.name}
        />
        <DialogInputField
          placeholder="???????????? ????????????????????"
          label="???????????? ????????????????????"
          value={controls.email}
          onChange={(e) => setControl("email", e.target.value)}
          error={Boolean(invalid.email)}
          helperText={invalid.email}
        />
        <DialogPhoneField
          placeholder="????????????"
          label="????????????"
          value={controls.phone}
          requiredCode
          onChange={(e) => setControl("phone", e.target.value)}
          selectProps={{
            value: controls.countryCode,
            onChange: (e) => setControl("countryCode", e.target.value),
          }}
          error={Boolean(invalid.countryCode)}
          helperText={invalid.countryCode}
        />
        <DialogMultiSelectField
          placeholder="??????????????"
          label="??????????????"
          onOpen={getProjects}
          isPending={projectsGetResponse.isPending}
          value={controls.project}
          onChange={(e) => {
            setControl("project", [...e.target.value]);
          }}
          renderValue={(selected) => {
            return selected
              ?.map(
                (id) => projectsState.find((project) => project.id === id)?.name
              )
              .filter((item) => Boolean(item)).length
              ? selected
                  ?.map(
                    (id) =>
                      projectsState.find((project) => project.id === id)?.name
                  )
                  ?.join(" ?? ")
                  .trim()
              : data?.bussiness?.map((project) => project?.name).join(" ?? ");
          }}
          error={Boolean(invalid.project)}
          helperText={invalid.project}
        >
          {projectsState.map((project, index) => (
            <MultiSelectItem
              value={project.id}
              key={`edit client project ${index}`}
            >
              {project.name}
            </MultiSelectItem>
          ))}
        </DialogMultiSelectField>
        <DialogSelectField
          placeholder="?????????? ??????????????"
          label="?????????? ??????????????"
          value={controls.contact}
          onChange={(e) => setControl("contact", e.target.value)}
          renderValue={(selected) => {
            return contactMeans.find((mean) => mean.value === selected).title;
          }}
          error={Boolean(invalid.contact)}
          helperText={invalid.contact}
        >
          {contactMeans.map((mean, index) => (
            <MenuItem value={mean.value} key={`${mean.value} ${index}`}>
              {mean.title}
            </MenuItem>
          ))}
        </DialogSelectField>
        <DialogSelectField
          placeholder="???????????? ??????????????????"
          label="???????????? ??????????????????"
          onOpen={getChannels}
          isPending={channelsGetResponse.isPending}
          value={controls.channel}
          onChange={(e) => setControl("channel", e.target.value)}
          renderValue={(selected) => {
            return (
              channelsState.find((channel) => channel.id === selected)?.name ??
              data?.channel?.name
            );
          }}
          error={Boolean(invalid.channel)}
          helperText={invalid.channel}
        >
          {channelsState.map((channel, index) => (
            <MenuItem value={channel.id} key={`edit client channel ${index}`}>
              {channel.name}
            </MenuItem>
          ))}
        </DialogSelectField>
        <DialogNumberField
          placeholder="??????????????????"
          label="??????????????????"
          value={controls.budget}
          onChange={(e) => setControl("budget", e.target.value)}
          error={Boolean(invalid.budget)}
          helperText={invalid.budget}
        />
      </DialogForm>
      <DialogButtonsGroup>
        <DialogButton
          onClick={handleSubmit}
          disabled={clientPatchResponse.isPending}
        >
          ??????
        </DialogButton>
        <DialogButton variant="close" onClick={onClose}>
          ??????????
        </DialogButton>
      </DialogButtonsGroup>
      {clientPatchResponse.failAlert}
    </Dialog>
  );
};

const contactMeans = [
  {
    title: "????????????",
    value: "phone",
  },
  {
    title: "???????????? ????????????????????",
    value: "email",
  },
  {
    title: "????????????????",
    value: "whats app",
  },
];
