import React from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/system";
import Breadcrumbs from "../../components/Breadcrumbs";
import Wrapper from "../../components/Wrapper";
import StatisticsCard from "../../components/StatisticsCard";
import DataTable from "../../components/DataTable";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { CHANNELS, STATUS, SUMMARY } from "../../data/APIs";
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
  const channelsStore = useSelector((state) => state.channels.value);

  const dispatch = useDispatch();

  //----state----
  const [selectedClients, setSelectedClients] = useState([]);

  //----request hooks----
  const [overviewGetRequest, overviewGetResponse] = useRequest({
    path: SUMMARY,
    method: "get",
  });

  useEffect(() => {
    overviewGetRequest({
      id: 1,
      onSuccess: (res) => {
        dispatch({ type: "overview/set", payload: res.data });
        setSelectedClients(res.data.employees.best_employees[0]?.clients);
      },
    });
  }, []);

  const handleFilterChange = (filters) => {
    const params = {};
    filters.event && (params.event = filters.event);
    filters.channel && (params.channel = filters.channel);
    overviewGetRequest({
      id: filters.period,
      params,
      onSuccess: (res) => {
        dispatch({ type: "overview/set", payload: res.data });
        setSelectedClients(res.data.employees.best_employees[0]?.clients);
      },
    });
  };

  //=====start===== status logic ===========
  const [statusGetRequest, statusGetResponse] = useRequest({
    path: STATUS,
    method: "get",
  });

  const getStatus = () => {
    if (statusStore.results.length) return;
    statusGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "status/set", payload: res.data });
      },
    });
  };

  //=====end===== status logic ===========

  //=====start===== channels logic ===========
  const [channelsGetRequest, channelsGetResponse] = useRequest({
    path: CHANNELS,
    method: "get",
  });

  const getChannels = () => {
    if (channelsStore.results.length) return;
    channelsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "channels/set", payload: res.data });
      },
    });
  };

  //=====end===== channels logic ===========

  return (
    <Box>
      <Wrapper>
        <Breadcrumbs path={["??????????????", "????????????????????"]} />
        <Stack
          direction="row"
          justifyContent="space-evenly"
          flexWrap="wrap"
          gap={2}
        >
          <StatisticsCard
            title="???????? ??????????????"
            since="?????? ??????"
            number={overviewStore.clients.all}
            percentage={70}
            sx={{ width: "100%" }}
          />
          <StatisticsCard
            title="?????????????? ??????????"
            since="????????????"
            number={overviewStore.clients.new_clients}
            bars={[5, 4, 2, 4, 2, 3, 5, 1, 3]}
            sx={{ width: "100%" }}
          />
          <StatisticsCard
            title="???????? ????????????????"
            since="?????? ??????????"
            number={overviewStore.employees.all}
            percentage={30}
            sx={{ width: "100%" }}
          />
          <StatisticsCard
            title="???????????????? ??????????"
            since="?????? ??????????"
            number={overviewStore.employees.new_employees}
            bars={[5, 4, 2, 4, 2, 3, 5, 1, 3]}
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
            title="???????? ????????????"
            columns={clientStatusColumns}
            rows={selectedClients}
            isPending={overviewGetResponse.isPending}
            path="/clients/view-clients"
            sx={{ flex: 2, maxWidth: "100%" }}
          />
          <DataTable
            title="???????? ????????"
            columns={bestEmployeeColumns}
            rows={overviewStore.employees.best_employees}
            isPending={overviewGetResponse.isPending}
            path="/employees/view-employees"
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
                channelsData={channelsStore.results.map((channel) => ({
                  name: channel.name,
                  value: channel.id,
                }))}
                isChannelPending={channelsGetResponse.isPending}
                onChannelOpen={getChannels}
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
  isChannelPending,
  channelsData = [],
  statusData = [],
  onStatusOpen = () => {},
  onChannelOpen = () => {},
}) => {
  const [period, setPeriod] = useState("1");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");

  useAfterEffect(() => {
    onChange({ period, event: status, channel });
  }, [period, status, channel]);

  const periods = [
    {
      name: "??????????",
      value: "1",
    },
    {
      name: "??????????????",
      value: "7",
    },
    {
      name: "??????????",
      value: "30",
    },
    {
      name: "??????????",
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
        placeholder="????????????"
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
      <SelectField
        value={channel}
        onChange={(e) => setChannel(e.target.value)}
        isPending={isChannelPending}
        onOpen={onChannelOpen}
        placeholder="???????????? ??????????????????"
        sx={{ maxWidth: 130, width: "100vmax", minWidth: 0 }}
        renderValue={(selected) => {
          return channelsData.find((channel) => channel.value === selected)
            .name;
        }}
      >
        {channelsData.length &&
          channelsData.map((item, index) => (
            <MenuItem
              value={item.value}
              key={`dataTableChannelFilter ${index}`}
            >
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
    headerName: "??????????",
    customContent: (params) => {
      return params?.user__first_name + " " + params?.user__last_name;
    },
  },
  {
    field: "user__phone",
    headerName: "?????? ????????????",
  },
  {
    field: "created_at",
    headerName: "??????????????",
    customContent: (params) => {
      return format(params.created_at);
    },
  },
  {
    field: "event",
    headerName: "????????????",
    customContent: (params) => (params.event ? params.event : "?????? ??????????"),
  },
  {
    field: "comment",
    headerName: "??????????????",
    customContent: (params) => (params.comment ? params.comment : "?????? ??????????"),
  },
];

const bestEmployeeColumns = [
  {
    field: "name",
    headerName: "??????????",
    customContent: () => <Avatar sx={{ width: 24, height: 24 }} />,
  },
  {
    field: "name",
    headerName: "??????????",
    customContent: (params) => params.fullname,
  },
  {
    field: "amount",
    headerName: "?????? ??????????????",
    customContent: (params) => params.count,
  },
];
