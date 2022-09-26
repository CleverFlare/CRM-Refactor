import React from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import DataGrid from "../../components/DataGrid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import {
  BLOCK_EMPLOYEE,
  EMPLOYEES,
  EMPLOYEES_PERMISSIONS,
  JOBS,
  JOB_PERMISSIONS,
} from "../../data/APIs";
import { useState } from "react";
import format from "../../utils/ISOToReadable";
import useDataGrid from "../../hooks/useDataGrid";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import Dialog, {
  DialogButton,
  DialogButtonsGroup,
  DialogHeading,
  DialogForm,
  DialogInputField,
  DialogContent,
} from "../../features/dialog";
import usePropState from "../../hooks/usePropState";
import useControls from "../../hooks/useControls";
import DialogSelectField from "../../features/dialog/components/DialogSelectField";
import { MenuItem, TextField } from "@mui/material";
import useAfterEffect from "../../hooks/useAfterEffect";
import { InputField, SelectField } from "../../features/form";
import compare from "../../utils/Compare";
import PermissionToggles from "../../components/PermissionToggles";
import filter from "../../utils/ClearNull";
import _ from "lodash";
import { useRef } from "react";
import { Stack } from "@mui/system";
import Breadcrumbs from "../../components/Breadcrumbs";
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";

const ViewEmployees = () => {
  const employeesStore = useSelector((state) => state.employees.value);

  const dispatch = useDispatch();

  const [employeesGetRequest, employeesGetResponse] = useRequest({
    path: EMPLOYEES,
    method: "get",
  });

  const handleGetEmployees = (urlParams) => {
    employeesGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "employees/set", payload: res.data });
      },
    });
  };

  const { handlePaginate, handleChangeAmount, handleFilter } = useDataGrid({
    onParamsChange: handleGetEmployees,
  });

  const [employeeDeteleRequest, employeeDeleteResponse] = useRequest({
    path: EMPLOYEES,
    method: "delete",
    successMessage: "تم حذف الموظف بنجاح",
  });

  const deleteEmployee = (e, row) => {
    employeeDeteleRequest({
      id: row.id,
      onSuccess: (res) => {
        dispatch({ type: "employees/deleteItem", payload: { id: row.id } });
      },
    });
  };

  const [handleDeleteEmployee, deleteEmployeeConfirmDialog] = useConfirmMessage(
    {
      onConfirm: deleteEmployee,
      text: "هل انت متأكد من انك تريد حذف هذا الموظف؟",
    }
  );

  const [openEditInfo, setOpenEditInfo] = useState(null);

  const handleOpenEdit = (e, row) => {
    setOpenEditInfo(row);
  };

  const [blockEmployeePostRequest] = useRequest({
    path: BLOCK_EMPLOYEE,
    method: "post",
  });

  const handleBlockEmployee = (e, row) => {
    blockEmployeePostRequest({
      body: {
        agent: row.id,
      },
      onSuccess: (res) => {
        dispatch({ type: "employees/blockItem", payload: { id: row.id } });
      },
    });
  };

  const [openEditPassword, setOpenEditPassword] = useState(null);

  const userInfo = useSelector((state) => state.userInfo.value);

  const isPermitted = useIsPermitted();

  return (
    <Wrapper>
      <Breadcrumbs path={["الموظفين", "عرض الموظفين"]} />
      <DataGrid
        columns={columns}
        rows={employeesStore.results.filter(
          (employee) => employee.user.id !== userInfo.id
        )}
        total={employeesStore.count}
        isPending={employeesGetResponse.isPending}
        onDelete={isPermitted(handleDeleteEmployee, ["delete_aqaremployee"])}
        onBlock={isPermitted(handleBlockEmployee, ["aqarblock_employees"])}
        onChangePassword={isPermitted(
          (e, row) => setOpenEditPassword(row.id),
          ["change_aqaremployee"]
        )}
        onEdit={isPermitted(handleOpenEdit, ["change_aqaremployee"])}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onFilter={handleFilter}
        filters={filters}
      />
      <EditInfoDialog
        open={Boolean(openEditInfo)}
        onClose={() => setOpenEditInfo(null)}
        data={openEditInfo}
      />
      <EditPasswordDialog
        open={Boolean(openEditPassword)}
        onClose={() => setOpenEditPassword(null)}
        id={openEditPassword}
      />
      {deleteEmployeeConfirmDialog}
      {employeeDeleteResponse.successAlert}
      {employeeDeleteResponse.failAlert}
    </Wrapper>
  );
};

export default ViewEmployees;

const columns = [
  {
    field: "name",
    headerName: "الأسم",
    customContent: (params) =>
      params.user.first_name
        ? `${params.user.first_name} ${params.user.last_name}`
        : "غير معروف",
  },
  {
    field: "job",
    headerName: "الوظيفة",
    customContent: (params) =>
      params.job?.title ? params.job?.title : "غير معروف",
  },
  {
    field: "username",
    headerName: "اسم المستخدم",
    customContent: (params) =>
      params.user.username ? params.user.username : "غير معروف",
  },
  {
    field: "date",
    headerName: "تاريخ الإنشاء",
    customContent: (params) =>
      params.created_at ? format(params.created_at) : "غير معروف",
  },
  {
    field: "clients",
    headerName: "عدد العملاء",
    customContent: (params) => params.client_count,
    customEmpty: "0",
  },
  {
    field: "newClients",
    headerName: "عدد العملاء الجدد",
    customContent: (params) => params.new_client_count,
    customEmpty: "0",
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

const JobFilter = ({ value, onChange }) => {
  const [jobs, setJobs] = useState([]);

  const handleChange = (e) => {
    onChange({
      query: ["job", e.target.value],
      renderedValue: jobs.find((job) => job.id === e.target.value).title,
      value: e.target.value,
    });
  };

  const [jobGetRequest, jobGetResponse] = useRequest({
    path: JOBS,
    method: "get",
  });

  const getJobs = () => {
    jobGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        setJobs(res.data.results);
      },
    });
  };

  return (
    <SelectField
      placeholder="الوظيفة"
      renderValue={(selected) => jobs.find((job) => job.id === selected).title}
      onOpen={getJobs}
      isPending={jobGetResponse.isPending}
      onChange={handleChange}
    >
      {jobs.map((job, index) => (
        <MenuItem value={job.id} key={`employeeFilterJob ${index}`}>
          {job.title}
        </MenuItem>
      ))}
    </SelectField>
  );
};

const filters = [
  {
    name: "الإسم",
    component: <NameFilter />,
  },
  {
    name: "الوظيفة",
    component: <JobFilter />,
  },
];

const EditInfoDialog = ({ open = false, onClose = () => {}, data = {} }) => {
  const dispatch = useDispatch();

  const [{ controls, invalid }, { setControl, validate }] = useControls(
    [
      {
        control: "name",
        value: `${data?.user?.first_name} ${data?.user?.last_name}`,
      },
      {
        control: "email",
        value: data?.user?.email,
        validations: [
          {
            test: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "البريد غير صالح",
          },
        ],
      },
      {
        control: "job",
        value: data?.job?.id,
      },
      {
        control: "to",
        value: data?.parent,
      },
    ],
    [data]
  );

  const [jobs, setJobs] = useState([]);

  const [jobsGetRequest, jobsGetResponse] = useRequest({
    path: JOBS,
    method: "get",
  });

  const getJobs = () => {
    jobsGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        setJobs(res.data.results);
      },
    });
  };

  const [employees, setEmployees] = useState([]);

  const [employeesGetRequest, employeesGetResponse] = useRequest({
    path: EMPLOYEES,
    method: "get",
  });

  const getEmployees = () => {
    employeesGetRequest({
      params: {
        top: controls.job,
        size: 1000,
      },
      onSuccess: (res) => {
        setEmployees(res.data.results);
      },
    });
  };

  const originalEmployeePermissions = useRef();

  const [employeePermissions, setEmployeePermissions] = useState([]);

  const [employeePermissionsGetRequest, employeePermissionsGetResponse] =
    useRequest({
      path: EMPLOYEES_PERMISSIONS,
      method: "get",
    });

  const getEmployeePermissions = () => {
    employeePermissionsGetRequest({
      params: {
        id: data.id,
      },
      onSuccess: (res) => {
        originalEmployeePermissions.current = res.data.map(
          (perm) => perm.codename
        );
        setEmployeePermissions(res.data.map((perm) => perm.codename));
      },
    });
  };

  const [permissionsState, setPermissionsState] = useState([]);

  const [jobPermissionsGetRequest, jobPermissionsGetResponse] = useRequest({
    path: JOB_PERMISSIONS,
    method: "get",
  });

  const getJobPermissions = () => {
    jobPermissionsGetRequest({
      params: {
        id: controls.job,
      },
      onSuccess: (res) => {
        setPermissionsState(res.data);
        getEmployeePermissions();
      },
    });
  };

  useAfterEffect(() => {
    getJobPermissions();
  }, [controls.job]);

  const [employeePatchRequest, employeePatchResponse] = useRequest({
    path: EMPLOYEES,
    method: "patch",
    successMessage: "تم التعديل بنجاح",
  });

  const handleSubmit = () => {
    const isThereChange = !compare(
      [
        [controls.name.split(/(?<=^\S+)\s/)[0], data.user.first_name],
        [controls.name.split(/(?<=^\S+)\s/)[1], data.user.last_name],
        [controls.email, data.user.email],
        [controls.job, data.job.id],
        [controls.to, data.parent],
        [originalEmployeePermissions.current, employeePermissions],
      ],
      true
    );

    if (isThereChange) {
      validate().then(({ isOk }) => {
        if (!isOk) return;
        const requestBody = filter({
          obj: {
            user: {
              first_name: controls.name.split(/(?<=^\S+)\s/)[0],
              last_name: controls.name.split(/(?<=^\S+)\s/)[1],
              email: controls.email,
              user_permissions: employeePermissions.map((perm) => ({
                codename: perm,
              })),
            },
            parent: controls.to,
            job: controls.job,
          },
        });

        employeePatchRequest({
          body: requestBody,
          id: data.id,
          onSuccess: (res) => {
            dispatch({
              type: "employees/putItem",
              payload: { id: res.data.id, item: res.data },
            });
          },
        });
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      paperProps={{ height: "100vmax" }}
      isPending={
        jobPermissionsGetResponse.isPending ||
        employeePermissionsGetResponse.isPending
      }
    >
      <DialogHeading>تعديل بيانات الموظفين</DialogHeading>
      <DialogForm>
        <DialogInputField
          label="الإسم"
          placeholder="الإسم"
          value={controls.name}
          onChange={(e) => setControl("name", e.target.value)}
        />
        <DialogInputField
          label="البريد الإلكتروني"
          placeholder="البريد الإلكتروني"
          value={controls.email}
          onChange={(e) => setControl("email", e.target.value)}
          error={Boolean(invalid.email)}
          helperText={invalid.email}
        />
        <DialogSelectField
          label="الوظيفة"
          placeholder="الوظيفة"
          onOpen={getJobs}
          isPending={jobsGetResponse.isPending}
          value={controls.job}
          onChange={(e) => setControl("job", e.target.value)}
          renderValue={(selected) => {
            return Boolean(jobs.find((job) => job.id === controls.job))
              ? jobs.find((job) => job.id === selected).title
              : data?.job?.title;
          }}
        >
          {jobs.map((job, index) => (
            <MenuItem value={job.id} key={`employeeJobEdit ${index}`}>
              {job.title}
            </MenuItem>
          ))}
        </DialogSelectField>
        <DialogSelectField
          label="التابع له"
          placeholder="التابع له"
          onOpen={getEmployees}
          isPending={employeesGetResponse.isPending}
          disabled={!Boolean(controls.job)}
          value={controls.to}
          onChange={(e) => setControl("to", e.target.value)}
          renderValue={(selected) => {
            return Boolean(employees.find((job) => job.id === controls.to))
              ? `${
                  employees.find((job) => job.id === selected).user.first_name
                } ${
                  employees.find((job) => job.id === selected).user.last_name
                }`
              : "غير معروف الإسم";
          }}
        >
          {employees.map((employee, index) => (
            <MenuItem value={employee.id} key={`employeeSuperEdit ${index}`}>
              {employee.user.first_name} {employee.user.last_name}
            </MenuItem>
          ))}
        </DialogSelectField>
        <PermissionToggles
          permissions={permissionsState}
          initialToggles={employeePermissions}
          onToggle={({ toggles }) => setEmployeePermissions(toggles)}
        />
      </DialogForm>
      <DialogButtonsGroup>
        <DialogButton
          onClick={handleSubmit}
          disabled={employeePatchResponse.isPending}
        >
          حفظ
        </DialogButton>
        <DialogButton
          variant="close"
          onClick={onClose}
          disabled={employeePatchResponse.isPending}
        >
          إلغاء
        </DialogButton>
      </DialogButtonsGroup>
      {employeePatchResponse.successAlert}
      {employeePatchResponse.failAlert}
    </Dialog>
  );
};

const EditPasswordDialog = ({ open, onClose, id }) => {
  const [password, setPassword] = useState("");

  const [changePasswordPatchReqeust, changePasswordPatchResponse] = useRequest({
    path: EMPLOYEES,
    method: "patch",
    successMessage: "تم تغير الرقم السري بنجاح",
  });

  const handleSubmit = () => {
    if (!password) return;
    changePasswordPatchReqeust({
      body: {
        user: {
          password: password,
        },
      },
      id: id,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} paperProps={{ maxWidth: 600 }}>
      <DialogContent
        sx={{
          height: "100% !important",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack justifyContent="center" alignItems="center">
          <DialogButtonsGroup sx={{ width: "100%" }}>
            <TextField
              variant="standard"
              label="الرقم السري الجديد"
              placeholder="الرقم السري الجديد"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                width: "100%",
                "& .MuiInputLabel-formControl": {
                  fontSize: 20,
                  fontWeight: "normal",
                  transform: "translate(10px, -10.5px) scale(0.75)",
                  color: "white",
                },
                "& .MuiInput-input": {
                  paddingBlock: 1.2,
                  fontSize: 15,
                },
                "& .MuiInputBase-formControl": {
                  borderColor: "white",
                  bgcolor: "white",
                },

                "& .MuiInputLabel-formControl.Mui-focused": {
                  color: "unset",
                },
              }}
            />
          </DialogButtonsGroup>
          <DialogButtonsGroup>
            <DialogButton
              onClick={handleSubmit}
              sx={{ width: "100%" }}
              disabled={changePasswordPatchResponse.isPending}
            >
              حفظ
            </DialogButton>
            <DialogButton
              variant="close"
              onClick={onClose}
              sx={{ width: "100%" }}
              disabled={changePasswordPatchResponse.isPending}
            >
              إلغاء
            </DialogButton>
          </DialogButtonsGroup>
        </Stack>
      </DialogContent>
      {changePasswordPatchResponse.successAlert}
      {changePasswordPatchResponse.failAlert}
    </Dialog>
  );
};
