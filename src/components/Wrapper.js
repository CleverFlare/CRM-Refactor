import React from "react";
import { Box } from "@mui/material";

const Wrapper = ({ children, sx = {}, ...props }) => {
  return (
    <Box
      sx={{ paddingInline: 5, paddingBottom: 5, height: "100%", ...sx }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
