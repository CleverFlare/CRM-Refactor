import React from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import Form, { InputField, SelectField } from "../../features/form";
import PermissionToggles from "../../components/PermissionToggles";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { JOBS, JOB_PERMISSIONS, PERMISSIONS } from "../../data/APIs";
import { useEffect } from "react";
import useControls from "../../hooks/useControls";
import useAfterEffect from "../../hooks/useAfterEffect";
import PendingBackdrop from "../../components/PendingBackdrop";
import { Button, MenuItem } from "@mui/material";
import { Stack } from "@mui/system";
import filter from "../../utils/ClearNull";

const AddJobs = () => {
  const [
    { controls, invalid, required },
    { setControl, resetControls, validate, setInvalid },
  ] = useControls([
    {
      control: "name",
      value: "",
      isRequired: true,
    },
    {
      control: "to",
      value: "",
      isRequired: false,
    },
  ]);

  const allPermissions = useSelector((state) => state.allPermissions.value);

  const dispatch = useDispatch();

  const [permissionsState, setPermissionsState] = useState([]);

  const [allPermissionsGetRequest, allPermissionsGetResponse] = useRequest({
    path: PERMISSIONS,
    method: "get",
  });

  const [jobPermissionsGetRequest, jobPermissionsGetResponse] = useRequest({
    path: JOB_PERMISSIONS,
    method: "get",
  });

  const getPermissions = () => {
    allPermissionsGetRequest({
      onSuccess: (res) => {
        dispatch({
          type: "allPermissions/set",
          payload: res.data.permissions,
        });
      },
    });
  };

  useEffect(() => {
    if (allPermissions.length) return;
    getPermissions();
  }, []);

  useEffect(() => {
    setPermissionsState(allPermissions);
  }, [allPermissions]);

  useAfterEffect(() => {
    if (!controls.to) return;
    jobPermissionsGetRequest({
      params: {
        id: controls.to,
      },
      onSuccess: (res) => {
        setPermissionsState(res.data);
      },
    });
  }, [controls.to]);

  const [jobs, setJobs] = useState([]);

  const [jobsGetRequest, jobsGetResponse] = useRequest({
    path: JOBS,
    method: "get",
  });

  const getJobs = () => {
    jobsGetRequest({
      onSuccess: (res) => {
        setJobs(res.data.results);
      },
    });
  };

  const [jobPostRequest, jobPostResponse] = useRequest({
    path: JOBS,
    method: "post",
    successMessage: "تم إضافة وظيفة بنجاح",
  });

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validate().then(({ isOk }) => {
      if (!isOk) return;

      const requestBody = filter({
        obj: {
          title: controls.name,
          parent: controls.to,
          permissions: selectedPermissions.map((perm) => ({ codename: perm })),
        },
      });

      jobPostRequest({
        body: requestBody,
        onSuccess: () => {
          resetControls();
          setSelectedPermissions([]);
        },
      }).then((res) => {
        let response = res?.response?.data;
        const responseBody = filter({
          obj: {
            name: response?.title,
            to: response?.parent,
          },
        });
        setInvalid(responseBody);
      });
    });
  };

  return (
    <Wrapper
      sx={{
        position: "relative",
        paddingBottom: "20px",
        height: "max-content",
      }}
    >
      <Breadcrumbs path={["الموظفين", "إضافة وظيفة موظف"]} />
      {(allPermissionsGetResponse.isPending ||
        jobPermissionsGetResponse.isPending) && (
        <PendingBackdrop
          backdropColor="white"
          indicatorColor={(theme) => theme.palette.primary.main}
        />
      )}
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <Form hideFooter hideHeader minChildWidth="600px">
          <InputField
            label="الإسم"
            placeholder="الإسم"
            value={controls.name}
            onChange={(e) => setControl("name", e.target.value)}
            required={required.includes("name")}
            error={Boolean(invalid.name)}
            helperText={invalid.name}
          />
          <SelectField
            label="التابعه له"
            placeholder="التابعه له"
            isPending={jobsGetResponse.isPending}
            onOpen={getJobs}
            value={controls.to}
            onChange={(e) => setControl("to", e.target.value)}
            required={required.includes("to")}
            error={Boolean(invalid.to)}
            helperText={invalid.to}
            renderValue={(selected) => {
              return jobs.find((job) => job.id === selected).title;
            }}
          >
            {jobs.map((job, index) => (
              <MenuItem value={job.id} key={`job ${index}`}>
                {job.title}
              </MenuItem>
            ))}
          </SelectField>
          <PermissionToggles
            sx={{ gridColumn: "1 / -1" }}
            initialToggles={selectedPermissions}
            onToggle={({ toggles }) => {
              setSelectedPermissions(toggles);
            }}
            permissions={permissionsState}
          />
        </Form>

        <Button
          variant="contained"
          type="submit"
          sx={{ width: 140, height: 50 }}
          disabled={jobPostResponse.isPending}
        >
          حفظ
        </Button>
      </Stack>
      {jobPostResponse.successAlert}
      {jobPostResponse.failAlert}
    </Wrapper>
  );
};

export default AddJobs;
