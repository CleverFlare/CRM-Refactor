import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Stack } from "@mui/system";
import DropBox, { ProgressCard } from "../../components/DropBox";
import { Box, MenuItem } from "@mui/material";
import { useRef } from "react";
import useRequest from "../../hooks/useRequest";
import { EMPLOYEES, EXPORT_CLIENTS } from "../../data/APIs";
import useAfterEffect from "../../hooks/useAfterEffect";
import { SelectField } from "../../features/form";
import filter from "../../utils/ClearNull";

const ExportClients = () => {
  //----request hooks----
  const [exportClientsGetRequest, exportClientsGetResponse] = useRequest({
    path: EXPORT_CLIENTS,
    method: "post",
  });

  const [employeesGetRequest, employeesGetResponse] = useRequest({
    path: EMPLOYEES,
    method: "get",
  });

  //----states----
  const uploadInputRef = useRef();
  const [files, setFiles] = useState(null);
  const [selected, setSelected] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeesState, setEmployeesState] = useState([]);

  const handleUploadFile = (e) => {
    setSelected(e.target.files[0]);
  };

  const handleDragFile = (e) => {
    setSelected(e.dataTransfer.files[0]);
  };

  useAfterEffect(() => {
    const requestBody = filter({
      obj: {
        post_file: selected,
        agent: selectedEmployee,
      },
      output: "formData",
    });
    exportClientsGetRequest({
      body: requestBody,
    });
  }, [selected]);

  useAfterEffect(() => {
    const { loaded, total } = exportClientsGetResponse;
    setFiles({
      progress: Math.floor((loaded / total) * 100),
      size: total,
    });
  }, [exportClientsGetResponse.loaded, exportClientsGetResponse.total]);

  const getEmployees = () => {
    if (employeesState.length) return;

    employeesGetRequest({
      params: {
        size: 1000,
      },
      onSuccess: (res) => {
        setEmployeesState([
          {
            id: null,
            user: {
              first_name: "أدمن",
              last_name: "",
            },
          },
          ...res.data.results,
        ]);
      },
    });
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "تصدير عملاء"]} />
      <Stack alignItems="center" spacing={2}>
        <SelectField
          placeholder="الموظف"
          sx={{ maxWidth: 600, width: "100%" }}
          onOpen={getEmployees}
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          isPending={employeesGetResponse.isPending}
          renderValue={(selected) => {
            return `${
              employeesState.find((employee) => employee.id === selected).user
                .first_name
            } ${
              employeesState.find((employee) => employee.id === selected).user
                .last_name
            }`;
          }}
        >
          {employeesState.map((employee, index) => (
            <MenuItem
              key={`employeeToExport ${index}`}
              value={employee.id}
            >{`${employee.user.first_name} ${employee.user.last_name}`}</MenuItem>
          ))}
        </SelectField>
        <Box
          component="input"
          type="file"
          sx={{ display: "none" }}
          onChange={handleUploadFile}
          ref={uploadInputRef}
        />
        <DropBox
          files={
            files && (
              <ProgressCard progress={files.progress} size={files.size} />
            )
          }
          isPending={exportClientsGetResponse.isPending}
          onClick={() => uploadInputRef.current.click()}
          onDrag={handleDragFile}
          buttonLabel="رفع ملف"
        />
      </Stack>
    </Wrapper>
  );
};

export default ExportClients;
