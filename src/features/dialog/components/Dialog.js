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
  children,
  hideBackdrop = false,
  isPending = false,
  paperProps = {},
  sx = {},
}) => {
  useAfterEffect(() => {
    if (open) {
      onOpen();
    }
  }, [open]);

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      hideBackdrop={hideBackdrop}
      sx={{
        "& .MuiDialog-paper": {
          bgcolor: (theme) => theme.palette.primary.main,
          color: "white",
          maxWidth: 1000,
          width: "90vw",
          maxHeight: "95%",
          overflowY: isPending ? "hidden" : "auto",
          position: "relative",
          ...paperProps,
        },
        ".MuiDialogContent-root": {
          height: "max-content",
          flex: "unset",
          overflow: "initial",
        },
        ...sx,
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
