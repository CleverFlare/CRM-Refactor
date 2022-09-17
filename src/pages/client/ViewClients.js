import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import DataGrid from "../../components/DataGrid";
import Breadcrumbs from "../../components/Breadcrumbs";
import format from "../../utils/ISOToReadable";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import {
  CHANNELS,
  CLIENTS,
  CLIENTS_HISTORY,
  EMPLOYEES,
  PROJECTS,
  STATUS,
} from "../../data/APIs";
import {
  Button,
  FormControl,
  Stack,
  Box,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Checkbox,
  IconButton,
} from "@mui/material";
import useAfterEffect from "../../hooks/useAfterEffect";
import InputField from "../../features/form/components/InputField";
import useControls from "../../hooks/useControls";
import Form, {
  NumberField,
  PhoneField,
  SelectField,
} from "../../features/form";
import { v4 as uuid } from "uuid";
import filter from "../../utils/ClearNull";
import AutocompleteField from "../../features/form/components/AutocompleteField";
import Dialog, {
  DialogHeading,
  DialogInfoWindow,
  DialogTable,
} from "../../features/dialog";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ModeCommentIcon from "@mui/icons-material/ModeComment";

import * as XLSX from "xlsx";

const TestFilter = ({ placeholder, value, onChange }) => {
  const handleChange = (e) => {
    onChange({
      query: ["name", e.target.value],
      renderedValue: e.target.value,
      value: e.target.value,
    });
  };
  return (
    <InputField
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
};

const template = [
  {
    name: "الإسم",
    component: <TestFilter placeholder="الإسم" />,
  },
];

const ViewClients = () => {
  //----store----
  const clientsStore = useSelector((state) => state.clients.value);
  const employeesStore = useSelector((state) => state.employees.value);
  const projectsStore = useSelector((state) => state.projects.value);
  const channelsStore = useSelector((state) => state.channels.value);
  const statusStore = useSelector((state) => state.status.value);

  const dispatch = useDispatch();

  //----states----
  const [isCleared, setIsCleared] = useState(null);
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

  const [clientDeleteRequest, clientDeleteResponse] = useRequest({
    path: CLIENTS,
    method: "delete",
  });

  //----effects----
  useEffect(() => {
    getClients();
  }, []);

  useAfterEffect(() => {
    console.log("Hi Guys");

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

  const deleteClient = (e, { id }) => {
    clientDeleteRequest({
      id: id,
      onSuccess: () => {
        dispatch({ type: "clients/deleteItem", payload: { id } });
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

  const handleFormFilterSubmit = () => {
    const params = filter({
      obj: {
        name: controls.name,
        agent: controls.employee,
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
        project: `${item.bussiness.map((project) => project.name).join(" ، ")}`,
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

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "جميع العملاء"]} />

      {/* filteration form */}
      <Form
        childrenProps={{
          saveBtn: {
            onClick: handleFormFilterSubmit,
          },
          closeBtn: {
            onClick: handleClearFilters,
          },
        }}
      >
        <InputField
          label="الأسم"
          placeholder="الأسم"
          value={controls.name}
          onChange={(e) => setControl("name", e.target.value)}
        />
        <AutocompleteField
          label="مسؤول المبيعات"
          placeholder="مسؤول المبيعات"
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
          data={employeesStore.results.map((employee) => ({
            label: `${employee.user.first_name} ${employee.user.last_name}`,
            value: employee.id,
          }))}
        />
        <PhoneField
          label="الهاتف"
          placeholder="الهاتف"
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
          label="المشروع"
          placeholder="المشروع"
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
          label="القناة الإعلانية"
          placeholder="القناة الإعلانية"
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
          label="الحالة"
          placeholder="الحالة"
          key={`status ${isCleared}`}
          onOpen={getStatus}
          isPending={statusGetResponse.isPending}
          disabled={controls.newClients}
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
          label="الميزانية"
          placeholder="الميزانية"
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
                >
                  <MenuItem value="max_budget">يساوي</MenuItem>
                  <MenuItem value="max_budget__gte">اكبر من</MenuItem>
                  <MenuItem value="max_budget__lte">اصغر من</MenuItem>
                </SelectField>
              </InputAdornment>
            ),
          }}
        />
        <InputField
          type="date"
          label="الفترة من"
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
          label="الفترة إلى"
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
          label="تاريخ إجراء"
          value={controls.history}
          onChange={(e) => setControl("history", e.target.value)}
        />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <FormControlLabel
            label="العملاء الجدد"
            control={
              <Checkbox
                checked={controls.newClients}
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
        onEdit={() => {}}
        onDelete={deleteClient}
        onView={(e, row) => {
          setClientDetails((old) => ({
            ...old,
            details: row,
          }));
        }}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onFilter={handleFilter}
        filters={template}
      />

      <InfoDialog
        open={Boolean(clientDetails.details && clientDetails.tab === "details")}
        onOpen={getClientHistory}
        onClose={() => setClientDetails((old) => ({ ...old, details: null }))}
        data={Boolean(clientDetails.details) && clientDetails.details}
        isHistoryPending={clientHistoryGetResponse.isPending}
      />

      {/* buttons */}
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
          onClick={() => handleExportExcelSheet()}
        >
          تصدير المحدد
        </Button>
        <Button
          variant="contained"
          disabled={!Boolean(selected.length)}
          sx={{ width: "200px", height: "50px" }}
        >
          تحويل المحدد
        </Button>
        <Button
          variant="contained"
          disabled={!Boolean(selected.length)}
          sx={{ width: "200px", height: "50px" }}
        >
          تغيير مشاريع المحدد
        </Button>
      </Stack>

      {/* alerts */}
      {clientDeleteResponse.successAlert}
      {clientDeleteResponse.failAlert}
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

  //----variables----
  const info = [
    {
      name: "الإسم",
      value: `${data?.user?.first_name} ${data?.user?.last_name}`,
    },
    {
      name: "الهاتف",
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
            <WhatsAppIcon
              fontSize="small"
              sx={{ color: "#5ef979" }}
              onClick={() =>
                window.open(
                  "https://www.truecaller.com/search/eg/" +
                    `${data?.user?.country_code}${data?.user?.phone}`,
                  "_blank"
                )
              }
            />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <CallIcon fontSize="small" sx={{ color: "#127fff" }} />
          </IconButton>
        </Box>
      ),
    },
    {
      name: "المشروع",
      value: data?.business?.map((project) => project.name)?.join(" ، "),
    },
    {
      name: "القناة الإعلانية",
      value: data?.channel,
    },
    {
      name: "موظف",
      value: data?.agent?.name,
      addition: (
        <IconButton sx={{ color: "white" }} onClick={onTransferAgentClick}>
          <ChangeCircleIcon sx={{ color: "white", transform: "scale(1.2)" }} />
        </IconButton>
      ),
    },
    {
      name: "تاريخ الإنشاء",
      value: data?.created_at ? format(data?.created_at) : "",
    },
    {
      name: "تعليق",
      value: data?.comment,
      addition: (
        <IconButton sx={{ color: "white" }} onClick={onCommentsClick}>
          <ModeCommentIcon sx={{ color: "white" }} />
        </IconButton>
      ),
    },
    {
      name: "الميزانية",
      value: data?.max_budget,
    },
  ];

  const columns = [
    {
      field: "projects",
      headerName: "المشروعات",
      customContent: ({ rowData }) => `${rowData?.bussiness?.join(" ، ")}`,
    },
    {
      field: "channel",
      headerName: "المشروعات",
    },
    {
      field: "agent",
      headerName: "المشروعات",
    },
    {
      field: "history_user",
      headerName: "المشروعات",
      customContent: ({ rowData }) =>
        rowData.history_user
          ? `${rowData.history_user.first_name} ${rowData.history_user.last_name}`
          : "",
    },
    {
      field: "comment",
      headerName: "المشروعات",
    },
    {
      field: "event",
      headerName: "المشروعات",
    },
    {
      field: "history_date",
      headerName: "المشروعات",
      customContent: ({ rowData }) =>
        rowData.created_at ? format(rowData.created_at) : "",
    },
  ];

  //----effects----
  useAfterEffect(() => {
    if (!open) return;
    onOpen();
  }, [open]);

  //----functions----
  const handleClose = (e) => {
    onClose(e);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogHeading>تفاصيل العميل</DialogHeading>
      <DialogInfoWindow information={info} />
      <DialogHeading>سجل العميل</DialogHeading>
      <DialogTable
        rows={historyStore.results}
        columns={columns}
        isPending={isHistoryPending}
      />
    </Dialog>
  );
};

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
