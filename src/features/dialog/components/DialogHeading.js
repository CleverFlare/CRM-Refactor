import React from "react";
import { DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PropTypes from "prop-types";

const DialogHeading = ({ children, onGoBack = null }) => {
  return (
    <DialogTitle>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {children}
        {onGoBack && (
          <IconButton sx={{ color: "white" }} onClick={onGoBack}>
            <ArrowBackIcon sx={{ color: "white" }} />
          </IconButton>
        )}
      </Stack>
    </DialogTitle>
  );
};

export default DialogHeading;

DialogHeading.propTypes = {
  onGoBack: PropTypes.func,
};
