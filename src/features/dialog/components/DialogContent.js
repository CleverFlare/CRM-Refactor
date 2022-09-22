import React from "react";
import { DialogContent as MuiDialogContent } from "@mui/material";

const DialogContent = ({ children, ...props }) => {
  return <MuiDialogContent {...props}>{children}</MuiDialogContent>;
};

export default DialogContent;
