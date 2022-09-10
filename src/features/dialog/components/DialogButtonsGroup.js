import React from "react";
import { DialogContent, Stack } from "@mui/material";
import PropTypes from "prop-types";

const DialogButtonsGroup = ({
  children,
  justifyContent = "center",
  alignItems = "center",
  spacing = 2,
  direction = "row",
  ...props
}) => {
  return (
    <DialogContent>
      <Stack
        direction={direction}
        justifyContent={justifyContent}
        alignItems={alignItems}
        spacing={spacing}
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
