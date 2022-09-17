import React, { useState } from "react";
import {
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const DataTable = ({
  title,
  sx = {},
  columns,
  rows,
  path = "",
  onClick = null,
  onFilter = null,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        minHeight: "600px",
        height: 0,
        minWidth: "initial",
        maxWidth: "initial",
        width: "initial",
        ...sx,
      }}
    >
      <Stack direction="column" sx={{ height: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ p: 2, bgcolor: "#f9f9f9" }}
        >
          <Typography>{title}</Typography>
          {Boolean(onFilter) && (
            <TextField
              variant="standard"
              select
              value={controls.filter}
              onChange={(e) => {
                setControl("filter", e.target.value);
                onFilter(e, e.target.value);
              }}
            >
              {filters.map((filter, index) => (
                <MenuItem
                  value={filter.value}
                  key={`${filter.value} + ${index}`}
                >
                  {filter.title}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Stack>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Table
            sx={{
              width: "100%",
              "& .MuiTableCell-root": {
                height: "max-content",
                border: "none",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {columns?.map((column, index) => (
                  <TableCell key={index}>
                    {column.headerName ? column.headerName : column.field}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{ height: "max-content" }}>
              {rows &&
                rows?.map((row, rowIndex) => {
                  return (
                    <TableRow
                      sx={{
                        bgcolor: rowIndex % 2 == 0 ? "#f9f9f9" : "initial",
                        cursor: Boolean(onClick) ? "pointer" : "initial",
                        opacity:
                          selected === rowIndex
                            ? "1"
                            : Boolean(onClick)
                            ? ".5"
                            : "1",
                      }}
                      key={rowIndex}
                      onClick={
                        onClick
                          ? (e) => {
                              setSelected(rowIndex);
                              onClick(e, row);
                            }
                          : null
                      }
                    >
                      {columns &&
                        columns?.map((column, columnIndex) => {
                          if (column.customContent) {
                            return (
                              <TableCell key={columnIndex}>
                                {column.customContent({
                                  ...row,
                                  columnIndex: columnIndex,
                                  rowIndex: rowIndex,
                                })}
                              </TableCell>
                            );
                          }
                          if (row[column.field]) {
                            return (
                              <TableCell key={columnIndex}>
                                {row[column.field]}
                              </TableCell>
                            );
                          } else {
                            throw Error(
                              `The field "${column.field}" does not match any key in the object, error fired at index ${rowIndex}`
                            );
                          }
                        })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row-reverse", p: 2 }}>
          <Link
            to={path}
            style={{ textDecoration: "none", width: "max-content" }}
          >
            <Typography sx={{ color: "#6d5bc6" }}>عرض الجميع</Typography>
          </Link>
        </Box>
      </Stack>
    </Paper>
  );
};

export default DataTable;

DataTable.propTypes = {
  title: PropTypes.string,
};
