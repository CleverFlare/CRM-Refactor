import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataGrid from "../../components/DataGrid";
import format from "../../utils/ISOToReadable";
import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { STATUS } from "../../data/APIs";
import { useDispatch, useSelector } from "react-redux";
import { InputField } from "../../features/form";
import { Box } from "@mui/system";
import { Stack, TextField } from "@mui/material";

const ViewStatus = () => {
  //----store----
  const statusStore = useSelector((state) => state.status.value);

  const dispatch = useDispatch();

  //----request hooks----
  const [statusGetRequest, statusGetResponse] = useRequest({
    path: STATUS,
    method: "get",
  });

  //----state----
  const [requestParams, setRequestParams] = useState({
    currentPage: [["page", 1]],
  });

  //----effects----
  useEffect(() => {
    const urlParams = new URLSearchParams();

    Object.values(requestParams).map((item) =>
      item.map(([key, value]) => urlParams.append(key, value))
    );

    statusGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "status/set", payload: res.data });
      },
    });
  }, [requestParams]);

  const handlePaginate = (params) => {
    setRequestParams((old) => ({
      ...old,
      currentPage: [["page", params.current]],
    }));
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
      <Breadcrumbs path={["العملاء", "عرض حالات العملاء"]} />
      <DataGrid
        columns={columns}
        rows={statusStore.results}
        isPending={statusGetResponse.isPending}
        total={statusStore.count}
        onDelete={() => {}}
        onFilter={handleFilter}
        onAmountChange={handleChangeAmount}
        onPaginate={handlePaginate}
        filters={filters}
      />
    </Wrapper>
  );
};

export default ViewStatus;

const NameFilter = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange({
      query: ["name", e.target.value],
      renderedValue: e.target.value,
      value: e.target.value,
    });
  };

  return (
    <InputField placeholder="الإسم" value={value} onChange={handleChange} />
  );
};

const DateFilter = ({ value = { start: "", end: "" }, onChange } = {}) => {
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");

  const formatDate = (date) => {
    return date?.split("-").reverse().join("/");
  };

  useEffect(() => {
    if (!startPoint && !endPoint) return;
    onChange({
      query: [
        "created_at",
        `${formatDate(String(startPoint))}-${formatDate(String(endPoint))}`,
      ],
      renderedValue: `من ${formatDate(String(startPoint))} - إلى ${formatDate(
        String(endPoint)
      )}`,
      value: {
        start: startPoint,
        end: endPoint,
      },
    });
  }, [startPoint, endPoint]);

  const handleChangeStartPoint = (e) => {
    setStartPoint(e.target.value);
  };

  const handleChangeEndPoint = (e) => {
    setEndPoint(e.target.value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        variant="standard"
        type="date"
        label="من"
        value={value.start}
        onChange={handleChangeStartPoint}
      />
      <TextField
        variant="standard"
        type="date"
        label="إلى"
        value={value.end}
        onChange={handleChangeEndPoint}
      />
    </Stack>
  );
};

const filters = [
  {
    name: "الإسم",
    component: <NameFilter />,
  },
  {
    name: "تاريخ",
    component: <DateFilter />,
  },
];

const columns = [
  {
    field: "name",
    headerName: "اسم الحالة",
  },
  {
    field: "date",
    headerName: "تاريخ الإنشاء",
    customContent: (params) => format(params.created_at),
  },
];
