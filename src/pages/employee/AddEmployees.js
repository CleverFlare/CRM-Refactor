import React, { useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import useControls from "../../hooks/useControls";
import Form, {
  InputField,
  PasswordField,
  PhoneField,
  SelectField,
} from "../../features/form";
import useRequest from "../../hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, MenuItem } from "@mui/material";
import PendingBackdrop from "../../components/PendingBackdrop";
import PermissionToggles from "../../components/PermissionToggles";
import { EMPLOYEES, JOB_PERMISSIONS } from "../../data/APIs";
import useAfterEffect from "../../hooks/useAfterEffect";
import filter from "../../utils/ClearNull";

const AddEmployees = () => {
  const userInfo = useSelector((state) => state.userInfo.value);

  const jobsStore = useSelector((state) => state.jobs.value);

  const dispatch = useDispatch();

  const [
    { controls, required, invalid },
    { setControl, resetControls, validate, setInvalid },
  ] = useControls([
    {
      control: "name",
      value: "",
      isRequired: true,
    },
    {
      control: "code",
      value: "",
      isRequired: true,
    },
    {
      control: "phone",
      value: "",
      isRequired: true,
    },
    {
      control: "job",
      value: "",
      isRequired: true,
    },
    {
      control: "to",
      value: "",
      isRequired: false,
    },
    {
      control: "username",
      value: "",
      isRequired: true,
    },
    {
      control: "password",
      value: "",
      isRequired: true,
    },
    {
      control: "confirm",
      value: "",
      isRequired: true,
      validations: [
        {
          test: (controls) => new RegExp(`^${controls.password}$`),
          message: "الرقم السري لا يطابق",
        },
      ],
    },
    {
      control: "email",
      value: "",
      isRequired: false,
      validations: [
        {
          test: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: "البريد غير صالح",
        },
      ],
    },
  ]);

  const [jobsGetRequest, jobsGetResponse] = useRequest({
    path: "aqar/api/router/Job/",
    method: "get",
  });

  const getJobs = () => {
    if (Boolean(jobsStore.results.length)) return;
    jobsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "jobs/set", payload: res.data });
      },
    });
  };

  const [employeesState, setEmployeesState] = useState([]);

  const [employeesGetRequest, employeesGetResponse] = useRequest({
    path: "aqar/api/router/Employee/",
    method: "get",
  });

  const getEmployees = () => {
    employeesGetRequest({
      params: {
        top: 1,
        job: controls.job,
      },
      onSuccess: (res) => {
        setEmployeesState(res.data);
      },
    });
  };

  const [jobPermissionsGetRequest, jobPermissionsGetResponse] = useRequest({
    path: JOB_PERMISSIONS,
    method: "get",
  });

  const [selectedPerms, setSelectedPerms] = useState([]);

  const [permissionsState, setPermissionsState] = useState([]);

  const getJobPermissions = () => {
    if (!controls.job) return;
    jobPermissionsGetRequest({
      params: {
        id: controls.job,
      },
      onSuccess: (res) => {
        setPermissionsState(res.data);
      },
    });
  };

  useAfterEffect(() => {
    getJobPermissions();
  }, [controls.job]);

  const [employeePostRequest, employeePostResponse] = useRequest({
    path: EMPLOYEES,
    method: "post",
    successMessage: "تم إضافة موظف جديد بنجاح",
  });

  const handleSubmit = () => {
    validate().then((output) => {
      if (!output.isOk) return;
      const requestBody = filter({
        obj: {
          user: {
            first_name: controls.name.split(/(?<=^\S+)\s/)[0],
            last_name: controls.name.split(/(?<=^\S+)\s/)[1],
            username: `${
              controls.username
            }@${userInfo?.organization?.name?.replace(/\s/gi, "")}.com`,
            email: controls.email,
            country_code: controls.code,
            phone: controls.phone,
            password: controls.password,
            user_permissions: selectedPerms.map((perm) => ({
              codename: perm,
            })),
          },
          job: controls.job,
          parent: controls.to,
        },
      });
      employeePostRequest({
        onSuccess: () => {
          setPermissionsState([]);
          resetControls();
        },
        body: requestBody,
      }).then((res) => {
        const response = res?.response?.data;
        const responseBody = filter({
          obj: {
            name:
              response?.user?.first_name?.join("-") ||
              response?.user?.last_name?.join("-"),
            email: response?.user?.email?.join("-"),
            phone:
              response?.user?.phone?.join("-") ||
              response?.user?.country_code?.join("-"),
            password: response?.user?.password?.join("-"),
            job: response?.job?.join("-"),
          },
        });
        setInvalid(responseBody);
      });
    });
  };

  return (
    <Wrapper sx={{ position: "relative" }}>
      {jobPermissionsGetResponse.isPending && (
        <PendingBackdrop
          backdropColor="white"
          indicatorColor={(theme) => theme.palette.primary.main}
        />
      )}
      <Breadcrumbs path={["الموظفين", "إضافة موظف"]} />
      <Form
        component="form"
        onSubmit={() => handleSubmit()}
        childrenProps={{
          saveBtn: {
            disabled: employeePostResponse.isPending,
          },
          closeBtn: {
            disabled: employeePostResponse.isPending,
          },
        }}
      >
        <InputField
          label="الإسم"
          placeholder="الإسم"
          required={required.includes("name")}
          value={controls.name}
          onChange={(e) => setControl("name", e.target.value)}
          error={Boolean(invalid.name)}
          helperText={invalid.name}
        />
        <PhoneField
          label="الهاتف"
          placeholder="الهاتف"
          required={required.includes("phone")}
          requiredCode
          selectProps={{
            value: controls.code,
            onChange: (e) => setControl("code", e.target.value),
          }}
          value={controls.phone}
          onChange={(e) => setControl("phone", e.target.value)}
          error={Boolean(invalid.phone)}
          helperText={invalid.phone}
        />
        <SelectField
          label="الوظيفة"
          placeholder="الوظيفة"
          onOpen={() => getJobs()}
          isPending={jobsGetResponse.isPending}
          required={required.includes("job")}
          value={controls.job}
          renderValue={(selected) => {
            return jobsStore.results.find((job) => job.id === selected).title;
          }}
          onChange={(e) => {
            setControl("job", e.target.value);
            setControl("to", "");
          }}
          error={Boolean(invalid.job)}
          helperText={invalid.job}
        >
          {jobsStore.results.map((job, index) => (
            <MenuItem key={`${job.title} ${index}`} value={job.id}>
              {job.title}
            </MenuItem>
          ))}
        </SelectField>
        <SelectField
          label="التابع له"
          placeholder="التابع له"
          disabled={!controls.job}
          isPending={employeesGetResponse.isPending}
          onOpen={getEmployees}
          required={required.includes("to")}
          value={controls.to}
          renderValue={(selected) => {
            return `${
              employeesState.find((employee) => employee.id === selected).user
                .first_name
            } ${
              employeesState.find((employee) => employee.id === selected).user
                .last_name
            }`;
          }}
          onChange={(e) => setControl("to", e.target.value)}
          error={Boolean(invalid.to)}
          helperText={invalid.to}
        >
          {employeesState.map((employee) => (
            <MenuItem value={employee.id} key={employee.id}>
              {employee.user.first_name} {employee.user.last_name}
            </MenuItem>
          ))}
        </SelectField>
        <InputField
          label="إسم المستخدم"
          placeholder="إسم المستخدم"
          required={required.includes("username")}
          value={controls.username}
          onChange={(e) => setControl("username", e.target.value)}
          error={Boolean(invalid.username)}
          helperText={invalid.username}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ direction: "rtl", paddingLeft: "10px" }}
              >
                @{userInfo?.organization?.name?.replace(/\s/gi, "")}.com
              </InputAdornment>
            ),
          }}
        />
        <PasswordField
          label="الرقم السري"
          placeholder="الرقم السري"
          required={required.includes("password")}
          value={controls.password}
          onChange={(e) => setControl("password", e.target.value)}
          error={Boolean(invalid.password)}
          helperText={invalid.password}
        />
        <PasswordField
          label="تأكيد الرقم السري"
          placeholder="تأكيد الرقم السري"
          required={required.includes("confirm")}
          value={controls.confirm}
          onChange={(e) => setControl("confirm", e.target.value)}
          error={Boolean(invalid.confirm)}
          helperText={invalid.confirm}
        />
        <InputField
          label="البريد الإلكتروني"
          placeholder="البريد الإلكتروني"
          required={required.includes("email")}
          value={controls.email}
          onChange={(e) => setControl("email", e.target.value)}
          error={Boolean(invalid.email)}
          helperText={invalid.email}
        />
        <PermissionToggles
          permissions={permissionsState}
          sx={{ gridColumn: "1 / -1" }}
          onToggle={({ toggles }) => setSelectedPerms(toggles)}
          // initialToggles={[]}
        />
      </Form>
      {employeePostResponse.successAlert}
      {employeePostResponse.failAlert}
    </Wrapper>
  );
};

export default AddEmployees;
