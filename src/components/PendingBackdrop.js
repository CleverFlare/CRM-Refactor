import React from "react";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

const PendingBackdrop = ({ backdropColor = null, indicatorColor = null }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        bgcolor: backdropColor
          ? backdropColor
          : (theme) => theme.palette.primary.main,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        zIndex: 123455,
      }}
    >
      <CircularProgress
        sx={{ color: indicatorColor ? indicatorColor : "white" }}
      />
    </Box>
  );
};

export default PendingBackdrop;
