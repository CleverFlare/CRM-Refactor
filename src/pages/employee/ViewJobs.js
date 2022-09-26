import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DataGrid from "../../components/DataGrid";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { JOBS } from "../../data/APIs";
import useDataGrid from "../../hooks/useDataGrid";
import format from "../../utils/ISOToReadable";
import { InputField } from "../../features/form";
import { TextField } from "@mui/material";
import { Stack } from "@mui/system";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";

const ViewJobs = () => {
  const jobsStore = useSelector((state) => state.jobs.value);

  const dispatch = useDispatch();

  const [jobsGetRequest, jobsGetResponse] = useRequest({
    path: JOBS,
    method: "get",
  });

  const getJobs = (urlParams) => {
    jobsGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "jobs/set", payload: res.data });
      },
    });
  };

  const { handlePaginate, handleChangeAmount, handleFilter } = useDataGrid({
    onParamsChange: getJobs,
  });

  const [jobDeleteRequest, jobDeleteResponse] = useRequest({
    path: JOBS,
    method: "delete",
  });

  const handleDeleteJob = (e, row) => {
    jobDeleteRequest({
      id: row.id,
      onSuccess: (res) => {
        dispatch({ type: "jobs/deleteItem", payload: { id: row.id } });
      },
    });
  };

  const [handleDelete, deleteJobConfirmDialog] = useConfirmMessage({
    onConfirm: handleDeleteJob,
    text: "هل انت متأكد من أنك تريد حذف هذه الوظيفة؟",
  });

  const isPermitted = useIsPermitted();

  return (
    <Wrapper>
      <Breadcrumbs path={["الموظفين", "عرض وظائف الموظفين"]} />
      <DataGrid
        columns={columns}
        rows={jobsStore.results}
        total={jobsStore.count}
        isPending={jobsGetResponse.isPending}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onFilter={handleFilter}
        onDelete={isPermitted(handleDelete, ["delete_aqarjob"])}
        filters={filters}
      />
      {deleteJobConfirmDialog}
      {jobDeleteResponse.successAlert}
      {jobDeleteResponse.failAlert}
    </Wrapper>
  );
};

export default ViewJobs;

const columns = [
  {
    field: "title",
    headerName: "اسم الوظيفة",
  },
  {
    field: "created_at",
    headerName: "تاريخ الإنشاء",
    customContent: ({ created_at }) => format(created_at),
  },
];

const NameFilter = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange({
      query: ["title", e.target.value],
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
