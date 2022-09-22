import React from "react";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

const DialogButton = ({ variant = "save", children, sx = {}, ...props }) => {
  let style = {};

  switch (variant) {
    case "save":
      style = {
        maxWidth: "150px",
        width: "100vmax",
        height: "50px",
        bgcolor: "white",
        fontWeight: "bold",
        color: (theme) => theme.palette.primary.main,
        "&:hover": {
          bgcolor: "white",
          color: (theme) => theme.palette.primary.main,
          filter: "brightness(.9)",
        },
      };
      break;
    case "close":
      style = {
        maxWidth: "150px",
        width: "100vmax",
        height: "50px",
        bgcolor: "#f54242",
        color: "#fff",
        fontWeight: "bold",
        "&:hover": {
          bgcolor: "#f54242",
          color: "#fff",
          filter: "brightness(.9)",
        },
      };
      break;
  }

  return (
    <Button variant="contained" sx={{ ...style, sx }} {...props}>
      {children}
    </Button>
  );
};

export default DialogButton;

DialogButton.propTypes = {
  variant: PropTypes.oneOf(["save", "close"]),
};
