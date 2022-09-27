import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DataGrid from "../../components/DataGrid";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { JOBS, JOB_PERMISSIONS, PERMISSIONS } from "../../data/APIs";
import useDataGrid from "../../hooks/useDataGrid";
import format from "../../utils/ISOToReadable";
import { InputField } from "../../features/form";
import { MenuItem, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";
import Dialog, {
  DialogButton,
  DialogButtonsGroup,
  DialogContent,
  DialogForm,
  DialogHeading,
  DialogInputField,
  DialogSelectField,
} from "../../features/dialog";
import PermissionToggles from "../../components/PermissionToggles";
import useControls from "../../hooks/useControls";
import { useRef } from "react";
import useAfterEffect from "../../hooks/useAfterEffect";
import compare from "../../utils/Compare";
import filter from "../../utils/ClearNull";
import func from "@mylib";

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

  const [editData, setEditData] = useState(null);

  const handleEditJob = (e, row) => {
    setEditData(row);
  };

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
        onEdit={isPermitted(handleEditJob, ["change_aqarjob"])}
        filters={filters}
      />
      <EditDialog
        open={Boolean(editData)}
        onClose={() => setEditData(null)}
        data={editData}
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

const EditDialog = ({
  open,
  onClose,
  data = {
    name: "",
  },
}) => {
  const allPermissions = useSelector((state) => state.allPermissions.value);

  const dispatch = useDispatch();

  const [{ controls }, { setControl, resetControls }] = useControls(
    [
      {
        control: "name",
        value: data?.title,
      },
      {
        control: "to",
        value: data?.parent?.id,
      },
    ],
    [data]
  );

  useEffect(() => {
    if (!open) return;
    func();
  }, [open]);

  //===Start==== Permissions Logic =========

  const [toggles, setToggles] = useState([]);
  const initialPermissions = useRef([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [jobPermissionsGetRequest, jobPermissionsGetResponse] = useRequest({
    path: JOB_PERMISSIONS,
    method: "get",
  });

  const [parentPermissionsGetRequest, parentPermissionsGetResponse] =
    useRequest({
      path: JOB_PERMISSIONS,
      method: "get",
    });

  const [allPermissionsGetRequest, allPermissionsGetResponse] = useRequest({
    path: PERMISSIONS,
    method: "get",
  });

  const getJobPermissions = () => {
    jobPermissionsGetRequest({
      params: {
        id: data.id,
      },
      onSuccess: (res) => {
        initialPermissions.current = res.data.map((perm) => perm.codename);
        setSelectedPermissions(res.data.map((perm) => perm.codename));
      },
    });
  };

  const getParentPermissions = () => {
    parentPermissionsGetRequest({
      params: {
        id: data.parent.id,
      },
      onSuccess: (res) => {
        setToggles(res.data);
        getJobPermissions();
      },
    });
  };

  const getAllPermissions = () => {
    allPermissionsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "allPermissions/set", payload: res.data.permissions });
        getJobPermissions();
      },
    });
  };

  useEffect(() => {
    if (!open) return;
    if (!Boolean(data?.parent)) {
      !allPermissions.length && getAllPermissions();
      getJobPermissions();
      setToggles([...allPermissions]);
    } else {
      getParentPermissions();
    }
  }, [open]);

  useAfterEffect(() => {
    setToggles([...allPermissions]);
  }, [allPermissions.length]);

  //===End==== Permissions Logic =========

  //====Start====== Parent Logic =========

  const [parents, setParents] = useState([]);

  const [parentsGetRequest, parentsGetResponse] = useRequest({
    path: JOBS,
    method: "get",
  });

  const getParents = () => {
    parentsGetRequest({
      params: {
        top: 1,
        id: data.id,
      },
      onSuccess: (res) => {
        setParents(res.data);
      },
    });
  };

  //====End====== Parent Logic =========

  //====Start====== Submit Logic =========

  const [jobPatchRequest, jobPatchResponse] = useRequest({
    path: JOBS,
    method: "patch",
  });

  const handleSubmit = () => {
    const isThereChange = !compare(
      [
        [data.title, controls.name],
        [data.parent.id ?? "", controls.to],
        [selectedPermissions, initialPermissions.current],
      ],
      true
    );

    if (!isThereChange) return;

    const requestBody = filter({
      obj: {
        title: controls.name,
        parent: controls.to,
        permissions: selectedPermissions.map((perm) => ({ codename: perm })),
      },
    });

    jobPatchRequest({
      id: data.id,
      body: requestBody,
      onSuccess: (res) => {
        dispatch({
          type: "jobs/putItem",
          payload: { id: res.data.id, item: res.data },
        });
        onClose();
      },
    });
  };

  //====End====== Submit Logic =========

  return (
    <Dialog
      open={open}
      onClose={onClose}
      isPending={
        jobPermissionsGetResponse.isPending ||
        parentPermissionsGetResponse.isPending ||
        allPermissionsGetResponse.isPending
      }
      paperProps={{ height: "100%" }}
    >
      <DialogHeading>تعديل الوظيفة</DialogHeading>
      <DialogForm>
        <DialogInputField
          label="الإسم"
          placeholder="الإسم"
          value={controls.name}
          onChange={(e) => setControl("name", e.target.value)}
        />
        {data?.parent && (
          <DialogSelectField
            label="التابع له"
            placeholder="التابع له"
            onOpen={getParents}
            isPending={parentsGetResponse.isPending}
            value={controls.to}
            onChange={(e) => setControl("to", e.target.value)}
            renderValue={(selected) => {
              return (
                parents.find((parent) => parent.id === selected)?.title ??
                data?.parent?.title
              );
            }}
          >
            {parents.map((parent, index) => (
              <MenuItem value={parent.id} key={`job ${index}`}>
                {parent.title}
              </MenuItem>
            ))}
          </DialogSelectField>
        )}
      </DialogForm>
      <DialogContent>
        <PermissionToggles
          permissions={toggles}
          initialToggles={selectedPermissions}
          onToggle={({ toggles }) => setSelectedPermissions(toggles)}
        />
      </DialogContent>
      <DialogButtonsGroup>
        <DialogButton
          sx={{ width: "100%" }}
          disabled={jobPatchResponse.isPending}
          onClick={handleSubmit}
        >
          حفظ
        </DialogButton>
        <DialogButton variant="close" onClick={onClose} sx={{ width: "100%" }}>
          إلغاء
        </DialogButton>
      </DialogButtonsGroup>
    </Dialog>
  );
};
