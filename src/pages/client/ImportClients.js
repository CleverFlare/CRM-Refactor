import React, { useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Stack } from "@mui/system";
import DropBox from "../../components/DropBox";
import useRequest from "../../hooks/useRequest";
import { IMPORT_CLIENTS } from "../../data/APIs";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";

const ImportClients = () => {
  const [importClientsGetRequest, importClientsGetResponse] = useRequest({
    path: IMPORT_CLIENTS,
    method: "get",
    responseType: "blob",
  });

  const handleDownload = () => {
    importClientsGetRequest({
      onSuccess: (res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "sheet.xls");
        document.body.appendChild(link);
        link.click();
      },
    });
  };

  const handleDownloadModel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "full_name",
        "phone",
        "email",
        "channel",
        "agent",
        "project",
        "max_budget",
        "event",
        "comment",
      ],
    ]);

    XLSX.utils.book_append_sheet(wb, ws, "clientsSheet");

    XLSX.writeFile(wb, "CRM Clients Sheet.xls");
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "إستيراد عملاء"]} />
      <Stack alignItems="center" spacing={2}>
        <DropBox
          buttonLabel="تنزيل ملف"
          onClick={handleDownload}
          isPending={importClientsGetResponse.isPending}
        />
        <Button
          variant="contained"
          sx={{ width: "200px", height: "50px" }}
          onClick={handleDownloadModel}
        >
          تنزيل نموذج
        </Button>
      </Stack>
    </Wrapper>
  );
};

export default ImportClients;
