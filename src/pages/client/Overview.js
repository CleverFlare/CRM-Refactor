import React from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/system";
import Breadcrumbs from "../../components/Breadcrumbs";
import Wrapper from "../../components/Wrapper";
import StatisticsCard from "../../components/StatisticsCard";
import DataTable from "../../components/DataTable";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { STATUS, SUMMARY } from "../../data/APIs";
import { useEffect } from "react";
import { Avatar, MenuItem } from "@mui/material";
import { useState } from "react";
import format from "../../utils/ISOToReadable";
import { SelectField } from "../../features/form";
import useAfterEffect from "../../hooks/useAfterEffect";

const Overview = () => {
  //----store----
  const overviewStore = useSelector((state) => state.overview.value);
  const statusStore = useSelector((state) => state.status.value);

  const dispatch = useDispatch();

  //----state----
  const [selectedClients, setSelectedClients] = useState([]);

  //----request hooks----
  const [overviewGetRequest, overviewGetResponse] = useRequest({
    path: SUMMARY,
    method: "get",
  });

  const [statusGetRequest, statusGetResponse] = useRequest({
    path: STATUS,
    method: "get",
  });

  useEffect(() => {
    overviewGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "overview/set", payload: res.data });
        setSelectedClients(res.data.employees.best_employees[0].clients);
      },
    });
  }, []);

  const handleFilterChange = (filters) => {
    overviewGetRequest({
      id: filters.period,
      onSuccess: (res) => {
        dispatch({ type: "overview/set", payload: res.data });
        setSelectedClients(res.data.employees.best_employees[0].clients);
      },
    });
  };

  const getStatus = () => {
    if (statusStore.results.length) return;
    statusGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "status/set", payload: res.data });
      },
    });
  };

  return (
    <Box>
      <Wrapper>
        <Breadcrumbs path={["العملاء", "الإحصائيات"]} />
        <Stack
          direction="row"
          justifyContent="space-evenly"
          flexWrap="wrap"
          gap={2}
        >
          <StatisticsCard
            title="جميع العملاء"
            since="منذ يوم"
            number={overviewStore.employees.new_employees}
            percentage={70}
            sx={{ width: "100%" }}
          />
          <StatisticsCard
            title="الموظفين الجدد"
            since="منذ اسبوع"
            number={overviewStore.clients.all}
            bars={[5, 4, 2, 4, 2, 3, 5, 1, 3]}
            sx={{ width: "100%" }}
          />
          <StatisticsCard
            title="العملاء الجدد"
            since="اكتساب"
            number={overviewStore.clients.new_clients}
            percentage={30}
            sx={{ width: "100%" }}
          />
        </Stack>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          sx={{ marginTop: 10, maxWidth: "100%" }}
          gap={2}
        >
          <DataTable
            title="حالة العميل"
            columns={clientStatusColumns}
            rows={selectedClients}
            isPending={overviewGetResponse.isPending}
            path="/"
            sx={{ flex: 2, maxWidth: "100%" }}
          />
          <DataTable
            title="افضل موظف"
            columns={bestEmployeeColumns}
            rows={overviewStore.employees.best_employees}
            isPending={overviewGetResponse.isPending}
            path="/"
            sx={{ flex: 1, maxWidth: "100%" }}
            onClick={(e, row) => setSelectedClients(row.clients)}
            actions={
              <Filters
                onChange={handleFilterChange}
                statusData={statusStore.results.map((status) => ({
                  name: status.name,
                  value: status.id,
                }))}
                isStatusPending={statusGetResponse.isPending}
                onStatusOpen={getStatus}
              />
            }
          />
        </Stack>
      </Wrapper>
    </Box>
  );
};

export default Overview;

const Filters = ({
  onChange = () => {},
  isStatusPending,
  statusData = [],
  onStatusOpen = () => {},
}) => {
  const [period, setPeriod] = useState("1");
  const [status, setStatus] = useState("");

  useAfterEffect(() => {
    onChange({ period, event: status });
  }, [period, status]);

  const periods = [
    {
      name: "اليوم",
      value: "1",
    },
    {
      name: "الإسبوع",
      value: "7",
    },
    {
      name: "الشهر",
      value: "30",
    },
    {
      name: "السنة",
      value: "360",
    },
  ];

  return (
    <Stack
      direction="row-reverse"
      flexWrap="wrap"
      gap={2}
      sx={{ width: "max-content" }}
    >
      <SelectField
        value={`${period}`}
        onChange={(e) => setPeriod(e.target.value)}
        renderValue={(selected) => {
          return periods.find((period) => period.value === selected).name;
        }}
        sx={{ maxWidth: 120, width: "100vmax", minWidth: 0 }}
      >
        {periods.length &&
          periods.map((period, index) => (
            <MenuItem value={period.value} key={`periodFilter ${index}`}>
              {period.name}
            </MenuItem>
          ))}
      </SelectField>
      <SelectField
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        isPending={isStatusPending}
        onOpen={onStatusOpen}
        placeholder="الحالة"
        sx={{ maxWidth: 120, width: "100vmax", minWidth: 0 }}
        renderValue={(selected) => {
          return statusData.find((status) => status.value === selected).name;
        }}
      >
        {statusData.length &&
          statusData.map((item, index) => (
            <MenuItem value={item.value} key={`dataTableStatusFilter ${index}`}>
              {item.name}
            </MenuItem>
          ))}
      </SelectField>
    </Stack>
  );
};

const clientStatusColumns = [
  {
    field: "name",
    headerName: "الأسم",
    customContent: (params) => {
      return params?.user__first_name + " " + params?.user__last_name;
    },
  },
  {
    field: "user__phone",
    headerName: "رقم الهاتف",
  },
  {
    field: "created_at",
    headerName: "التاريخ",
    customContent: (params) => {
      return format(params.created_at);
    },
  },
  {
    field: "event",
    headerName: "الحالة",
    customContent: (params) => (params.event ? params.event : "غير معروف"),
  },
  {
    field: "comment",
    headerName: "التعليق",
    customContent: (params) => (params.comment ? params.comment : "غير معروف"),
  },
];

const bestEmployeeColumns = [
  {
    field: "name",
    headerName: "الإسم",
    customContent: () => <Avatar sx={{ width: 24, height: 24 }} />,
  },
  {
    field: "name",
    headerName: "الإسم",
    customContent: (params) => params.fullname,
  },
  {
    field: "amount",
    headerName: "عدد العملاء",
    customContent: (params) => params.count,
  },
];
