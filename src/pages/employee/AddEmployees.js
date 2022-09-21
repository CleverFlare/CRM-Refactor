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
import PendingBackdrop from "../../../../CRM-Master/src/components/PendingBackdrop";

const AddEmployees = () => {
  const userInfo = useSelector((state) => state.userInfo.value);

  const jobsStore = useSelector((state) => state.jobs.value);

  const dispatch = useDispatch();

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

  const [jobsPermissionsGetRequest] = useRequest({
    path: "aqar/api/router/JobPermission/?",
    method: "get",
  });

  // const getJobPermissions = () => {
  //   if (!controls.job) return;
  //   jobsPermissionsGetRequest({
  //     params: {
  //       id: controls.job,
  //     },
  //     onSuccess: (res) => {
  //       setPermissions(res.data);
  //       setSelectedPermissions([]);
  //     },
  //   });
  // };

  const [employeePostRequest, employeePostResponse] = useRequest({
    path: "aqar/api/router/Employee/",
    method: "post",
  });

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
          test: (controls) => new RegExp(`${old.password}`),
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

  return (
    <Wrapper sx={{ position: "relative" }}>
      {false && (
        <PendingBackdrop
          backdropColor="white"
          indicatorColor={(theme) => theme.palette.primary.main}
        />
      )}
      <Breadcrumbs path={["الموظفين", "إضافة موظف"]} />
      <Form>
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
      </Form>
    </Wrapper>
  );
};

export default AddEmployees;
