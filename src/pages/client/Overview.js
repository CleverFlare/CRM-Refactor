import React from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/system";
import Breadcrumbs from "../../components/Breadcrumbs";
import Wrapper from "../../components/Wrapper";
import StatisticsCard from "../../components/StatisticsCard";
import DataTable from "../../components/DataTable";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { SUMMARY } from "../../data/APIs";
import { useEffect } from "react";
import { Avatar } from "@mui/material";
import { useState } from "react";
import format from "../../utils/ISOToReadable";

const Overview = () => {
  //----store----
  const overviewStore = useSelector((state) => state.overview.value);

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
      onSuccess: (res) => {
        dispatch({ type: "overview/set", payload: res.data });
        setSelectedClients(res.data.employees.best_employees[0].clients);
      },
    });
  }, []);

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
          flexWrap="wrap"
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
          />
        </Stack>
      </Wrapper>
    </Box>
  );
};

export default Overview;

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
