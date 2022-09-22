import React from "react";
import { DialogContent, Stack } from "@mui/material";
import PropTypes from "prop-types";

const DialogButtonsGroup = ({
  children,
  justifyContent = "center",
  alignItems = "flex-end",
  spacing = 2,
  direction = "row",
  sx = {},
  ...props
}) => {
  return (
    <DialogContent sx={{ height: "100% !important", ...sx }}>
      <Stack
        direction={direction}
        justifyContent={justifyContent}
        alignItems={alignItems}
        spacing={spacing}
        sx={{ height: "100%" }}
        {...props}
      >
        {children}
      </Stack>
    </DialogContent>
  );
};

export default DialogButtonsGroup;

DialogButtonsGroup.propTypes = {
  justifyContent: PropTypes.oneOf([
    "center",
    "space-between",
    "space-evenly",
    "start",
    "end",
  ]),
  alignItems: PropTypes.oneOf(["center", "start", "end"]),
  spacing: PropTypes.number,
  direction: PropTypes.oneOf(["row", "column"]),
};
