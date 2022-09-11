import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import DataGrid from "../../components/DataGrid";
import Breadcrumbs from "../../components/Breadcrumbs";
import format from "../../utils/ISOToReadable";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { CLIENTS } from "../../data/APIs";
import { Button, Stack } from "@mui/material";
import useAfterEffect from "../../hooks/useAfterEffect";
import InputField from "../../features/form/components/InputField";

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

  const dispatch = useDispatch();

  //----states----
  const [selected, setSelected] = useState([]);
  const [requestParams, setRequestParams] = useState({
    currentPage: [["page", 1]],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [amount, setAmount] = useState();
  const [filters, setFilters] = useState([]);

  //----request hooks----
  const [clientsGetRequest, clientsGetResponse] = useRequest({
    path: CLIENTS,
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
      onSuccess: (res) => {
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

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "جميع العملاء"]} />
      <DataGrid
        columns={columns}
        rows={clientsStore.results}
        isPending={clientsGetResponse.isPending}
        total={clientsStore.count ? clientsStore.count : 1}
        onCheck={handleChecks}
        onEdit={() => {}}
        onDelete={deleteClient}
        onView={() => {}}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onFilter={handleFilter}
        filters={template}
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
      {clientDeleteResponse.successAlert}
      {clientDeleteResponse.failAlert}
    </Wrapper>
  );
};

export default ViewClients;

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
