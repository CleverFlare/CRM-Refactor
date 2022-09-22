import { DialogContent, Stack, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const DialogForm = ({
  maxChildWidth = null,
  minChildWidth = null,
  children,
  sx = {},
  onSubmit = () => {},
  ...props
}) => {
  const sm = useMediaQuery("(max-width: 768px)");

  return (
    <DialogContent>
      <Stack spacing={2} sx={{ width: "100%" }} {...props}>
        {children}
      </Stack>
    </DialogContent>
  );
};

export default DialogForm;
