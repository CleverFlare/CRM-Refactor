import React from "react";
import {
  DialogContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import PendingBackdrop from "../../../components/PendingBackdrop";
import PropTypes from "prop-types";

const dummyColumns = [
  {
    field: "column1",
    headerName: "dummy column 1",
  },
  {
    field: "column2",
    headerName: "dummy column 2",
  },
  {
    field: "column3",
    headerName: "dummy column 3",
  },
  {
    field: "column4",
    headerName: "dummy column 4",
  },
];

const dummyRows = [
  {
    column1: "dummy data",
    column2: "dummy data",
    column3: "dummy data",
    column4: "dummy data",
  },
  {
    column1: "dummy data",
    column2: "dummy data",
    column3: "dummy data",
    column4: "dummy data",
  },
  {
    column1: "dummy data",
    column2: "dummy data",
    column3: "dummy data",
    column4: "dummy data",
  },
  {
    column1: "dummy data",
    column2: "dummy data",
    column3: "dummy data",
    column4: "dummy data",
  },
  {
    column1: "dummy data",
    column2: "dummy data",
    column3: "dummy data",
    column4: "dummy data",
  },
];

const DialogTable = ({
  rows = dummyRows,
  columns = dummyColumns,
  isPending = false,
  ...props
}) => {
  return (
    <DialogContent>
      <Box
        sx={{
          width: "100%",
          border: "1px solid #ffffff6e",
          borderRadius: 2,
          p: 2,
          boxShadow: "0 0 20px #ffffff6e",
          boxSizing: "border-box",
          "& .MuiTableCell-root": {
            border: "none",
          },
          overflow: "hidden",
          position: "relative",
        }}
        {...props}
      >
        {isPending && <PendingBackdrop />}
        <Box sx={{ maxHeight: "200px", height: "100vmax", overflowY: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((columnData, index) => (
                  <TableCell
                    sx={{
                      color: "white",
                      position: "sticky",
                      top: 0,
                      bgcolor: (theme) => theme.palette.primary.main,
                    }}
                    key={`column ${index}`}
                  >
                    {columnData?.headerName
                      ? columnData?.headerName
                      : columnData?.field}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((rowData, index) => (
                <TableRow key={`row ${index}`}>
                  {columns.map((columnData, index) => {
                    if (columnData.customContent) {
                      return (
                        <TableCell
                          sx={{ color: "white" }}
                          key={`cell ${index}`}
                        >
                          {columnData.customContent({
                            rowData,
                          })
                            ? columnData.customContent({
                                rowData,
                              })
                            : "غير معروف"}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell sx={{ color: "white" }} key={`cell ${index}`}>
                        {rowData[columnData.field]
                          ? rowData[columnData.field]
                          : "غير معروف"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </DialogContent>
  );
};

export default DialogTable;

DialogTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  isPending: PropTypes.bool,
};
