import React from "react";
import { Box } from "@mui/material";

const Wrapper = ({ children }) => {
  return <Box sx={{ paddingInline: 5, paddingBottom: 5 }}>{children}</Box>;
};

export default Wrapper;
