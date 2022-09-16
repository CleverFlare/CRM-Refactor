import React, { useEffect, useRef, useState } from "react";
import {
  Checkbox,
  IconButton as MuiIconButton,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Divider,
  MenuItem,
  Chip,
  Menu,
  CircularProgress,
  Button,
  Grow,
  Collapse,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import KeyIcon from "@mui/icons-material/Key";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PropTypes from "prop-types";
import useAfterEffect from "../hooks/useAfterEffect";
import EmptyBox from "../svg/EmptyBox";
import { v4 as uuid } from "uuid";

const DataGrid = ({
  rows = [],
  columns,
  onCheck = null,
  onView = null,
  onDelete = null,
  onArchive = null,
  onChangePassword = null,
  onBlock = null,
  onEdit = null,
  isPending = false,
  onFilter = null,
  total = 1,
  onAmountChange = () => {},
  onPaginate = () => {},
  availableAmounts = [8, 10, 50, 100, 200],
  filters,
}) => {
  //----states----
  const [rowsState, setRowsState] = useState(rows);
  const [columnsState, setColumnsState] = useState(columns);
  const [filtersList, setFiltersList] = useState([]);
  const [amount, setAmount] = useState(availableAmounts[0]);
  const [checked, setChecked] = useState({
    type: "",
    checks: [],
  });

  //----conditions----
  const renderProcedures = Boolean(
    onDelete || onArchive || onChangePassword || onBlock || onEdit
  );
  const rootCheckboxCheck =
    Boolean(rowsState.length) && checked.checks.length === rowsState.length;
  const rootCheckboxIndeterminate = Boolean(
    checked.checks.length > 0 && checked.checks.length < rowsState.length
  );

  //----effects----
  useEffect(() => {
    setRowsState(rows);
  }, [rows]);

  useEffect(() => {
    setColumnsState(columns);
  }, [columns]);

  useAfterEffect(() => {
    onCheck && onCheck(checked);
  }, [checked]);

  useAfterEffect(() => {
    onFilter && onFilter(filtersList);
  }, [filtersList]);

  //----functions----
  const handleRootCheckboxChange = (e) => {
    switch (e.target.checked) {
      case false:
        setChecked({ type: "root", checks: [] });
        break;
      case true:
        setChecked({ type: "root", checks: [...rowsState] });
        break;
    }
  };

  const handleChildCheckboxChange = async (e, row) => {
    switch (e.target.checked) {
      case false:
        setChecked((old) => ({
          type: "child",
          checks: old.checks.filter((item) => item.id !== row.id),
        }));
        break;
      case true:
        setChecked((old) => ({ type: "child", checks: [...old.checks, row] }));
        break;
    }
  };

  const handleAmountChange = (params) => {
    setAmount(params.value);
    onAmountChange(params);
  };

  return (
    <Paper sx={{ overflowX: "auto", marginBlock: 5 }} elevation={2}>
      <Paper
        variant="outlined"
        sx={{
          position: "relative",
        }}
      >
        <Stack
          direction="row"
          sx={{
            p: 2,
            maxWidth: "100%",
            flexWrap: "wrap",
            rowGap: 2,
          }}
          spacing={2}
        >
          <SelectAmount
            availableAmounts={availableAmounts}
            onChange={handleAmountChange}
          />
          <Stack direction="row" spacing={2}>
            {filtersList.map((filter, index) => (
              <ChipsFilterItem
                key={`filter ${filter.id}`}
                name={filter.name}
                renderedValue={filter.renderedValue}
                query={filter.query}
                value={filter.value}
                id={filter.id}
                onRemove={() =>
                  setFiltersList((old) =>
                    old.filter((item) => item.id !== filter.id)
                  )
                }
                component={filter.component}
                onSubmit={(params) =>
                  setFiltersList((old) =>
                    old.map((item) => {
                      if (item.id === filter.id) {
                        return { ...item, ...params };
                      }
                      return item;
                    })
                  )
                }
              />
            ))}
          </Stack>
          {filters && (
            <ChipsFilter
              filters={filters}
              onFilter={(param) => setFiltersList((old) => [...old, param])}
            />
          )}
        </Stack>
        <Divider orientation="horizontal" />
        <Box
          sx={{
            overflowX: isPending ? "hidden" : "auto",
          }}
        >
          <Stack
            direction="column"
            sx={{
              width: "max-content",
              minWidth: "100%",
            }}
          >
            {/* Grid Header */}

            {/* Grid Content */}
            <Box
              sx={{
                maxHeight: 600,
                height: 600,
                minHeight: 600,
                overflowY: isPending ? "hidden" : "auto",
                position: "relative",
              }}
            >
              {!Boolean(rowsState.length) && (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <EmptyBox style={{ opacity: 0.2, width: 200, height: 200 }} />
                </Box>
              )}
              {isPending && (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "white",
                  }}
                >
                  <CircularProgress sx={{ color: "gray" }} />
                </Box>
              )}
              {columnsState && (
                <Table
                  sx={{
                    width: "100%",
                    "& .MuiTableCell-root": {
                      height: "max-content",
                      border: "none",
                    },
                  }}
                >
                  <TableHead
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 500,
                      bgcolor: "white",
                    }}
                  >
                    <TableRow>
                      {onCheck && (
                        <TableCell sx={{ position: "relative" }}>
                          <Checkbox
                            checked={rootCheckboxCheck}
                            indeterminate={rootCheckboxIndeterminate}
                            onChange={handleRootCheckboxChange}
                            sx={{
                              padding: 0,
                            }}
                            disableRipple
                          />
                        </TableCell>
                      )}
                      {columns?.map((column, index) => (
                        <TableCell key={`column ${index}`}>
                          {column.headerName ? column.headerName : column.field}
                        </TableCell>
                      ))}

                      {renderProcedures && <TableCell>إجرائات</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ height: "max-content" }}>
                    {!isPending &&
                      rowsState?.map((row, rowIndex) => {
                        return (
                          <TableRow
                            sx={{
                              bgcolor: row.isblock
                                ? "#ffb6b6"
                                : rowIndex % 2 == 0
                                ? "#f5f5f5"
                                : "#fff",
                            }}
                            key={rowIndex}
                          >
                            {onCheck && (
                              <TableCell sx={{ position: "relative" }}>
                                <Checkbox
                                  checked={Boolean(
                                    checked.checks.find(
                                      (item) => item.id === row.id
                                    )
                                  )}
                                  onChange={(e) =>
                                    handleChildCheckboxChange(e, row)
                                  }
                                  sx={{
                                    padding: 0,
                                  }}
                                  disableRipple
                                />
                              </TableCell>
                            )}
                            {columnsState &&
                              columnsState?.map((column, columnIndex) => {
                                if (column.customContent) {
                                  return (
                                    <TableCell key={columnIndex}>
                                      {column.customContent({
                                        ...row,
                                        columnIndex: columnIndex,
                                        rowIndex: rowIndex,
                                      })
                                        ? column.customContent({
                                            ...row,
                                            columnIndex: columnIndex,
                                            rowIndex: rowIndex,
                                          })
                                        : column.customEmpty
                                        ? column.customEmpty
                                        : "غير معروف"}
                                    </TableCell>
                                  );
                                }
                                if (row[column.field] !== undefined) {
                                  return (
                                    <TableCell key={columnIndex}>
                                      {row[column.field]
                                        ? row[column.field]
                                        : column.customEmpty
                                        ? column.customEmpty
                                        : "غير معروف"}
                                    </TableCell>
                                  );
                                } else {
                                  throw Error(
                                    `The field "${column.field}" does not match any key in the object, error fired at index ${rowIndex}`
                                  );
                                }
                              })}
                            {renderProcedures && (
                              <TableCell>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  {onView && (
                                    <IconButton
                                      color="#495f9b"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onView(event, row);
                                      }}
                                    >
                                      <RemoveRedEyeIcon
                                        sx={{ width: 20, height: 20 }}
                                      />
                                    </IconButton>
                                  )}
                                  {onChangePassword && (
                                    <IconButton
                                      color="#495f9b"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onChangePassword(event, row);
                                      }}
                                    >
                                      <KeyIcon sx={{ width: 20, height: 20 }} />
                                    </IconButton>
                                  )}
                                  {onEdit && (
                                    <IconButton
                                      color="#96ee9d"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onEdit(event, row);
                                      }}
                                    >
                                      <EditIcon
                                        sx={{ width: 20, height: 20 }}
                                      />
                                    </IconButton>
                                  )}
                                  {onDelete && (
                                    <IconButton
                                      color="#f8c6c6"
                                      iconColor="red"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onDelete(event, row);
                                      }}
                                    >
                                      <DeleteIcon
                                        sx={{ width: 20, height: 20 }}
                                      />
                                    </IconButton>
                                  )}
                                  {onBlock && (
                                    <IconButton
                                      color="#ff3c3c"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onBlock(event, row);
                                      }}
                                    >
                                      <BlockIcon
                                        sx={{ width: 20, height: 20 }}
                                      />
                                    </IconButton>
                                  )}
                                </Stack>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Stack>
        </Box>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ direction: "rtl", paddingBlock: 1, position: "relative" }}
        >
          <TablePagination
            limit={Math.ceil(total / amount)}
            onChange={onPaginate}
          />
        </Stack>
      </Paper>
    </Paper>
  );
};

export default DataGrid;

const IconButton = ({
  children,
  color = "#495f9b",
  iconColor = "white",
  onClick,
}) => {
  return (
    <MuiIconButton
      size="small"
      sx={{
        bgcolor: color,
        color: iconColor,
        borderRadius: 2,
        "&:hover": {
          bgcolor: color,
          filter: "brightness(.8)",
        },
        height: "max-content",
      }}
      onClick={onClick}
    >
      {children}
    </MuiIconButton>
  );
};

const TablePagination = ({ current = 1, limit, onChange = () => {} }) => {
  const [page, setPage] = useState(1);
  const max = useRef(0);

  //----conditions----
  const disableRight = Boolean(page >= limit);
  const disableLeft = Boolean(page <= 1);

  //----effects----
  useEffect(() => {
    setPage(current);
  }, [current]);

  useEffect(() => {
    max.current = limit;
  }, [limit]);

  //----functions----
  const handleKeyDown = (e) => {
    if (
      e.code !== "Enter" ||
      parseInt(e.target.value) < 1 ||
      parseInt(e.target.value) > parseInt(limit)
    )
      return;

    onChange({ current: page, limit: max });
  };

  const handleMoveForward = () => {
    setPage((old) => {
      if (old + 1 > limit) return old;
      onChange({ current: old + 1, limit: max });
      return old + 1;
    });
  };

  const handleMoveBackward = () => {
    setPage((old) => {
      if (old - 1 < 1) return old;
      onChange({ current: old - 1, limit: max });
      return old - 1;
    });
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      spacing={1}
      sx={{ direction: "ltr" }}
    >
      <MuiIconButton
        onClick={handleMoveForward}
        disabled={disableRight}
        sx={{
          "&.Mui-disabled": {
            opacity: ".2",
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ width: 15, height: 15 }} color="primary" />
      </MuiIconButton>
      <Typography variant="caption" sx={{ fontWeight: "bold" }} color="primary">
        {max.current}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: "bold" }} color="primary">
        من
      </Typography>
      <Box sx={{ color: "primary" }}>
        <NumericFormat
          customInput={TextField}
          variant="standard"
          sx={{
            width: 50,
            "& input": {
              fontSize: 13,
              fontWeight: "bold",
              textAlign: "center",
            },
          }}
          isAllowed={({ formattedValue }) => formattedValue !== ""}
          allowNegative={false}
          onKeyDown={handleKeyDown}
          value={page}
          decimalScale={0}
          onValueChange={(e) => setPage(e.floatValue)}
        />
      </Box>
      <MuiIconButton
        onClick={handleMoveBackward}
        disabled={disableLeft}
        sx={{
          "&.Mui-disabled": {
            opacity: ".2",
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ width: 15, height: 15 }} color="primary" />
      </MuiIconButton>
    </Stack>
  );
};

const SelectAmount = ({ availableAmounts, onChange = () => {} }) => {
  //----states----
  const [value, setValue] = useState(availableAmounts[0]);

  //----functions----
  const handleChange = (e) => {
    setValue(e.target.value);
    onChange({ value: e.target.value });
  };

  return (
    <Paper variant="outlined" sx={{ paddingBlock: "5px" }}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ paddingInline: 2, height: "100%" }}
        spacing={2}
      >
        <Typography variant="body2">عرض العناصر</Typography>
        <TextField
          variant="standard"
          select
          sx={{
            width: 70,
            borderRadius: "100vmax",
            "& .MuiInputBase-root, & .MuiSelect-standard:focus": {
              borderRadius: "100vmax",
            },
            "& .MuiSelect-standard": {
              paddingBlock: "0",
              borderRadius: "100vmax",
            },
          }}
          value={value}
          SelectProps={{
            IconComponent: KeyboardArrowDownIcon,
          }}
          onChange={handleChange}
        >
          {availableAmounts.map((item, index) => (
            <MenuItem value={item} key={item + " " + index}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Paper>
  );
};

const ChipsFilterItem = ({
  name,
  renderedValue,
  query,
  value,
  id,
  onRemove,
  component,
  onSubmit,
}) => {
  //----states----
  const [emerge, setEmerge] = useState(false);
  const [grow, setGrow] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  //----variables----
  const open = Boolean(anchorEl);

  //----effects----
  useEffect(() => {
    setEmerge(true);
  }, []);

  //----functions----
  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleGrow = () => {
    setGrow(true);
  };

  const handleShrink = () => {
    setEmerge(false);
  };

  const handleRemove = () => {
    onRemove();
  };

  const handleSubmit = (params) => {
    onSubmit({ ...params, id });
    setAnchorEl(null);
  };

  return (
    <Collapse
      in={emerge}
      orientation="horizontal"
      timeout={300}
      onEntered={() => handleGrow()}
      onExited={() => handleRemove()}
    >
      <Grow in={grow} timeout={200} onExited={() => handleShrink()}>
        <Box>
          <Chip
            label={
              <Typography>
                <b>{name}:</b> {renderedValue}
              </Typography>
            }
            sx={{
              height: "40px",
              borderRadius: "100vmax",
              p: 1,
              direction: "rtl",
              boxShadow: "0 3px 6px #0005",
              "& .MuiChip-deleteIcon": {
                marginLeft: 0,
              },
            }}
            onDelete={(e) => setGrow(false)}
            onClick={handleOpenMenu}
          />
          <Menu open={open} anchorEl={anchorEl} onClose={handleCloseMenu}>
            <FilterTemplate
              name={name}
              component={component}
              value={value}
              onSubmit={handleSubmit}
              onClose={handleCloseMenu}
            />
          </Menu>
        </Box>
      </Grow>
    </Collapse>
  );
};

const ChipsFilter = ({ filters = [], sx, onFilter = () => {} }) => {
  //----states----
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  //----variables
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!anchorEl) return;
    setSelectedFilter(null);
  }, [open]);

  //----functions----
  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOnFilter = (params) => {
    onFilter({ ...params, ...selectedFilter });
    setAnchorEl(null);
  };

  return (
    <Box>
      <Chip
        label="إضافة تصفية"
        icon={<AddCircleIcon />}
        onClick={handleOpenMenu}
        sx={{
          height: "40px",
          borderRadius: "100vmax",
          p: 1,
          direction: "rtl",
          boxShadow: "0 3px 6px #0005",
          "& .MuiChip-icon": {
            marginRight: 0,
          },
          ...sx,
        }}
        color="primary"
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {!Boolean(filters.length) && (
          <MenuItem disabled sx={{ minWidth: 150 }}>
            فارغ
          </MenuItem>
        )}
        {Boolean(filters.length) &&
          (!Boolean(selectedFilter) ? (
            filters.map((filter, index) => {
              return (
                <MenuItem
                  onClick={() => setSelectedFilter(filter)}
                  key={`filter ${index}`}
                  sx={{ minWidth: 150 }}
                >
                  {filter.name}
                </MenuItem>
              );
            })
          ) : (
            <FilterTemplate
              name={selectedFilter.name}
              component={selectedFilter.component}
              onSubmit={handleOnFilter}
              onClose={handleCloseMenu}
            />
          ))}
      </Menu>
    </Box>
  );
};

const FilterTemplate = ({
  onSubmit,
  name,
  renderedValue = "",
  query = [],
  value = "",
  component,
  onClose,
}) => {
  //----states----
  const [valueState, setValueState] = useState("");
  const [renderedValueState, setRenderedValueState] = useState("");
  const [queryState, setQueryState] = useState([]);

  //----conditions----
  const nullishValue =
    !Boolean(valueState) ||
    !Boolean(renderedValueState) ||
    !Boolean(queryState.length);

  //***** this is an antipattern but I had no choice :( *****
  useEffect(() => {
    setRenderedValueState(renderedValue);
    setQueryState(query);
    setValueState(value);
  }, []);

  //----functions----
  const handleChange = ({ renderedValue, query, value }) => {
    setRenderedValueState(renderedValue);
    setQueryState(query);
    setValueState(value);
  };

  const handleSubmit = () => {
    if (nullishValue) return;
    onSubmit({
      renderedValue: renderedValueState,
      query: queryState,
      value: valueState,
      id: uuid(),
    });
  };
  return (
    <Box
      sx={{
        paddingInline: 3,
        paddingBlock: 1,
        maxWidth: 400,
        width: "100vmax",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <Typography variant="body2">{name}</Typography>
      {React.cloneElement(component, {
        value: valueState,
        onChange: handleChange,
      })}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button color="error" onClick={onClose}>
          إلغاء
        </Button>
        <Button onClick={handleSubmit}>تنفيذ</Button>
      </Box>
    </Box>
  );
};

//----typechecking----
DataGrid.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  filters: PropTypes.arrayOf(PropTypes.object),
  isPending: PropTypes.bool,
  onCheck: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  onArchive: PropTypes.func,
  onChangePassword: PropTypes.func,
  onBlock: PropTypes.func,
  onEdit: PropTypes.func,
  onFilter: PropTypes.func,
};
