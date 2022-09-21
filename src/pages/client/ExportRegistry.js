import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataGrid from "../../components/DataGrid";
import useRequest from "../../hooks/useRequest";
import { FILES_HISTORY } from "../../data/APIs";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import format from "../../utils/ISOToReadable";
import { IconButton, TextField } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { InputField } from "../../features/form";
import { Stack } from "@mui/system";

const ExportRegistry = () => {
  const exportRegistryStore = useSelector(
    (state) => state.exportRegistry.value
  );

  const dispatch = useDispatch();

  const [requestParams, setRequestParams] = useState({
    currentPage: [["page", 1]],
  });

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

  const [importRegistryGetRequest, importRegistryGetResponse] = useRequest({
    path: FILES_HISTORY,
    method: "get",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams();

    urlParams.append("type", "0");

    Object.values(requestParams).map((item) =>
      item.map(([key, value]) => urlParams.append(key, value))
    );

    importRegistryGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "exportRegistry/set", payload: res.data });
      },
    });
  }, [requestParams]);

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "سجل الإستيراد"]} />
      <DataGrid
        columns={columns}
        rows={exportRegistryStore.results}
        total={exportRegistryStore.count}
        isPending={importRegistryGetResponse.isPending}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onFilter={handleFilter}
        filters={filters}
      />
    </Wrapper>
  );
};

export default ExportRegistry;

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
    field: "users",
    headerName: "الأسم",
  },
  {
    field: "created_at",
    headerName: "تاريخ الإنشاء",
    customContent: (params) => {
      return format(params?.created_at);
    },
  },
  {
    field: "post_file",
    headerName: "الملف",
    customContent: (params) => {
      return (
        <IconButton
          onClick={() => {
            window.open(params.post_file, "_blank");
          }}
        >
          <DownloadIcon />
        </IconButton>
      );
    },
  },
];
