import React, { useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataGrid from "../../components/DataGrid";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { CHANNELS } from "../../data/APIs";
import { useEffect } from "react";
import useDataGrid from "../../hooks/useDataGrid";
import { Avatar, TextField } from "@mui/material";
import format from "../../utils/ISOToReadable";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import { Stack } from "@mui/system";
import { InputField } from "../../features/form";
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";

const ViewChannels = () => {
  const channelsStore = useSelector((state) => state.channels.value);

  const dispatch = useDispatch();

  const [channelsGetRequest, channelsGetResponse] = useRequest({
    path: CHANNELS,
    method: "get",
  });

  const getChannels = (urlParams) => {
    channelsGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "channels/set", payload: res.data });
      },
    });
  };

  const { handlePaginate, handleChangeAmount, handleFilter } = useDataGrid({
    onParamsChange: getChannels,
  });

  const [channelDeleteRequest, channelDeleteResponse] = useRequest({
    path: CHANNELS,
    method: "delete",
    successMessage: "تم حذف القناة بنجاح",
  });

  const deleteChannel = (e, row) => {
    channelDeleteRequest({
      id: row.id,
      onSuccess: (res) => {
        dispatch({ type: "channels/deleteItem", payload: { id: row.id } });
      },
    });
  };

  const [handleDeleteChannel, deleteChannelConfirmDialog] = useConfirmMessage({
    onConfirm: deleteChannel,
    text: "هل انت متأكد من انك تريد حذف هذه القناة",
  });

  const isPermitted = useIsPermitted();

  return (
    <Wrapper>
      <Breadcrumbs path={["القنوات", "عرض القنوات"]} />
      <DataGrid
        columns={columns}
        rows={channelsStore.results}
        isPending={channelsGetResponse.isPending}
        total={channelsStore.count}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onFilter={handleFilter}
        onDelete={isPermitted(handleDeleteChannel, ["delete_aqarchannel"])}
        filters={filters}
      />
      {deleteChannelConfirmDialog}
      {channelDeleteResponse.successAlert}
      {channelDeleteResponse.failAlert}
    </Wrapper>
  );
};

export default ViewChannels;

const columns = [
  {
    field: "picture",
    headerName: "الصورة",
    customContent: ({ logo, name }) => (
      <Avatar src={logo} variant="rounded">
        {name[0].toUpperCase()}
      </Avatar>
    ),
  },
  {
    field: "name",
    headerName: "الأسم",
    customContent: ({ name }) => (name ? name : "غير معروف"),
  },
  {
    field: "createdAt",
    headerName: "تاريخ الإنشاء",
    customContent: ({ created_at }) => format(created_at),
  },
];

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
