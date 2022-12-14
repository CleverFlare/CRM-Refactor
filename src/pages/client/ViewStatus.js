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
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";
import useConfirmMessage from "../../hooks/useConfirmMessage";

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

  const [statusDeleteRequest, statusDeleteResponse] = useRequest({
    path: STATUS,
    method: "delete",
    successMessage: "???? ?????? ???????????? ??????????",
  });

  const deleteStatus = (e, row) => {
    statusDeleteRequest({
      id: row.id,
      onSuccess: () => {
        dispatch({ type: "status/deleteItem", payload: { id: row.id } });
      },
    });
  };

  const [handleDeleteStatus, deleteStatusConfirmDialog] = useConfirmMessage({
    onConfirm: deleteStatus,
    text: "???? ?????? ?????????? ???? ?????? ???????? ?????? ?????? ??????????????",
  });

  const isPermitted = useIsPermitted();

  return (
    <Wrapper>
      <Breadcrumbs path={["??????????????", "?????? ?????????? ??????????????"]} />
      <DataGrid
        columns={columns}
        rows={statusStore.results}
        isPending={statusGetResponse.isPending}
        total={statusStore.count}
        onDelete={isPermitted(
          (e, row) => handleDeleteStatus(e, row),
          ["delete_aqarevent"]
        )}
        onFilter={handleFilter}
        onAmountChange={handleChangeAmount}
        onPaginate={handlePaginate}
        filters={filters}
      />
      {deleteStatusConfirmDialog}
      {statusDeleteResponse.successAlert}
      {statusDeleteResponse.failAlert}
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
    <InputField placeholder="??????????" value={value} onChange={handleChange} />
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
      renderedValue: `???? ${formatDate(String(startPoint))} - ?????? ${formatDate(
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
        label="????"
        value={value.start}
        onChange={handleChangeStartPoint}
      />
      <TextField
        variant="standard"
        type="date"
        label="??????"
        value={value.end}
        onChange={handleChangeEndPoint}
      />
    </Stack>
  );
};

const filters = [
  {
    name: "??????????",
    component: <NameFilter />,
  },
  {
    name: "??????????",
    component: <DateFilter />,
    valueShape: {
      start: "",
      end: "",
    },
  },
];

const columns = [
  {
    field: "name",
    headerName: "?????? ????????????",
  },
  {
    field: "date",
    headerName: "?????????? ??????????????",
    customContent: (params) => format(params.created_at),
  },
];
