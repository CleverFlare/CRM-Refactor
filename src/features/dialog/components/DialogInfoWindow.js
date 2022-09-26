import React from "react";
import { DialogContent, Stack, Typography } from "@mui/material";
import PendingBackdrop from "../../../components/PendingBackdrop";
import PropTypes from "prop-types";

const DialogInfoWindow = ({
  information = {},
  isPending = false,
  ...props
}) => {
  return (
    <DialogContent>
      <Stack
        sx={{
          border: "1px solid #ffffff6e",
          borderRadius: 2,
          p: 2,
          boxShadow: "0 0 20px #ffffff6e",
          overflow: "hidden",
          position: "relative",
        }}
        spacing={2}
        {...props}
      >
        {isPending && <PendingBackdrop />}
        {information.map((piece, index) => (
          <Stack
            direction="row"
            key={`info ${index}`}
            alignItems="center"
            spacing={2}
          >
            <Typography>
              {piece.name} :{" "}
              {Boolean(piece.value)
                ? piece.value
                : piece.customEmpty ?? "غير معروف"}
            </Typography>
            {piece?.addition}
          </Stack>
        ))}
      </Stack>
    </DialogContent>
  );
};

export default DialogInfoWindow;

DialogInfoWindow.propTypes = {
  information: PropTypes.arrayOf(PropTypes.object).isRequired,
  isPending: PropTypes.bool,
};
