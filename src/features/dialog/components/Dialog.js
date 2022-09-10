import React from "react";
import { Dialog as MuiDialog, Grow } from "@mui/material";
import PropTypes from "prop-types";
import useAfterEffect from "../../../hooks/useAfterEffect";
import PendingBackdrop from "../../../components/PendingBackdrop";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} unmountOnExit />;
});

const Dialog = ({
  onClose = () => {},
  onOpen = () => {},
  open = false,
  width = "90vw",
  maxWidth = 1000,
  children,
  hideBackdrop = false,
  isPending = false,
}) => {
  const handleClose = (e) => onClose(e);
  const handleOpen = (e) => onOpen(e);

  useAfterEffect(() => {
    switch (open) {
      case true:
        handleOpen();
        return;
      case false:
        handleClose();
        return;
    }
  }, [open]);

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      hideBackdrop={hideBackdrop}
      sx={{
        "& .MuiDialog-paper": {
          bgcolor: (theme) => theme.palette.primary.main,
          color: "white",
          maxWidth: maxWidth,
          width: width,
          maxHeight: "95%",
          overflowY: isPending ? "hidden" : "auto",
          position: "relative",
        },
        ".MuiDialogContent-root": {
          height: "max-content",
          flex: "unset",
          overflow: "initial",
        },
      }}
      BackdropProps={{
        sx: {
          bgcolor: "rgb(255 255 255 / 50%)",
        },
      }}
    >
      {isPending && <PendingBackdrop />}
      {children}
    </MuiDialog>
  );
};

export default Dialog;

Dialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  open: PropTypes.bool.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isPending: PropTypes.bool,
  hideBackdrop: PropTypes.bool,
};
