import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grow,
} from "@mui/material";
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} unmountOnExit />;
});

const useConfirmMessage = ({
  onConfirm = () => {},
  title = "الرجاء التأكيد",
  text = "هل انت متأكد انك تريد المتابعة؟",
  variant = "confirm",
}) => {
  const [open, setOpen] = useState(false);
  const [args, setArgs] = useState(null);

  const handleOpen = (...params) => {
    setArgs([...params]);
    setOpen(true);
  };

  return [
    handleOpen,
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiPaper-root": {
          width: 500,
        },
      }}
      TransitionComponent={Transition}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        {variant === "confirm" && (
          <>
            <Button color="error" onClick={() => setOpen(false)}>
              لا
            </Button>
            <Button
              onClick={() => {
                onConfirm(...args);
                setOpen(false);
              }}
            >
              نعم
            </Button>
          </>
        )}
        {variant === "alert" && (
          <Button onClick={() => setOpen(false)}>حسناً</Button>
        )}
      </DialogActions>
    </Dialog>,
  ];
};

export default useConfirmMessage;
