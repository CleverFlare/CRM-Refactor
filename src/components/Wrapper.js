import React from "react";
import { Box } from "@mui/material";

const Wrapper = ({ children, sx = {}, ...props }) => {
  return (
    <Box
      sx={{
        paddingInline: 5,
        paddingBottom: 5,
        minHeight: "100%",
        boxSizing: "border-box",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
