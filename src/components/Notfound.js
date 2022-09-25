import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import notfound from "../assets/404.jpg";
import React from "react";

const Notfound = () => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
      component="img"
      src={notfound}
    ></Stack>
  );
};

export default Notfound;
