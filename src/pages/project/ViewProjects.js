import React from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import { PROJECTS } from "../../data/APIs";
import DataGrid from "../../components/DataGrid";
import useRequest from "../../hooks/useRequest";
import { useState } from "react";
import { useEffect } from "react";
import format from "../../utils/ISOToReadable";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";

const ViewProjects = () => {
  const projectsStore = useSelector((state) => state.projects.value);

  const dispatch = useDispatch();

  const handleDeleteProject = (e, row) => {
    projectsDeleteRequest({
      id: row.id,
      onSuccess: (res) => {
        dispatch({ type: "projects/deleteItem", payload: { id: row.id } });
      },
    });
  };

  const [handleDelete, deleteProjectConfirmDialog] = useConfirmMessage({
    onConfirm: handleDeleteProject,
    text: "هل انت متأكد من انك تريد حذف هذا المشروع؟",
  });

  const [projectsGetRequest, projectsGetResponse] = useRequest({
    path: PROJECTS,
    method: "get",
  });

  const [projectsDeleteRequest] = useRequest({
    path: PROJECTS,
    method: "delete",
  });

  const [requestParams, setRequestParams] = useState({
    currentPage: [["page", 1]],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams();

    Object.values(requestParams).map((item) =>
      item.map(([key, value]) => urlParams.append(key, value))
    );

    projectsGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "projects/set", payload: res.data });
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

  const isPermitted = useIsPermitted();

  return (
    <Wrapper>
      <Breadcrumbs path={["المشاريع", "عرض المشاريع"]} />
      <DataGrid
        columns={columns}
        rows={projectsStore.results}
        isPending={projectsGetResponse.isPending}
        total={projectsStore.count}
        onDelete={isPermitted(handleDelete, ["delete_aqarproject"])}
        onFilter={handleFilter}
        onAmountChange={handleChangeAmount}
        onPaginate={handlePaginate}
        filters={filters}
      />
      {deleteProjectConfirmDialog}
    </Wrapper>
  );
};

export default ViewProjects;

const columns = [
  {
    field: "picture",
    headerName: "الصورة",
    customContent: (params) => (
      <Avatar src={params?.logo}>{params?.name?.split("")?.[0]}</Avatar>
    ),
  },
  {
    field: "name",
    headerName: "اسم المشروع",
    customContent: (params) => (params?.name ? params?.name : "غير معروف"),
  },
  {
    field: "address",
    headerName: "العنوان",
    customContent: (params) =>
      params?.address ? params?.address : "غير معروف",
  },
  {
    field: "comment",
    headerName: "تفاصيل",
    customContent: (params) =>
      params?.comment ? params?.comment : "غير معروف",
  },
  {
    field: "created_at",
    headerName: "تاريخ الإنشاء",
    customContent: (params) =>
      params?.created_at ? format(params?.created_at) : "غير معروف",
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
    valueShape: {
      start: "",
      end: "",
    },
  },
];
