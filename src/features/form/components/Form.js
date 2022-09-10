import React from "react";
import {
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";

const Form = ({
  title = "مرحباً بك!",
  subtitle = "قم بملئ الحقول للحصول على النتائج المطلوبة",
  hideHeader = false,
  hideFooter = false,
  maxChildWidth = null,
  minChildWidth = null,
  childrenProps = {
    title: {},
    subtitle: {},
    saveBtn: {},
    closeBtn: {},
  },
  children,
  sx,
}) => {
  const sm = useMediaQuery("(max-width: 768px)");
  return (
    <Paper sx={sx}>
      {!Boolean(hideHeader) && (
        <>
          <Stack sx={{ padding: 2, bgcolor: "#f8f8f9" }}>
            <Typography sx={{ fontWeight: "bold" }} {...childrenProps.title}>
              {title}
            </Typography>
            <Typography {...childrenProps.subtitle}>{subtitle}</Typography>
          </Stack>
          <Divider orientation="horizontal" />
        </>
      )}
      <Box
        sx={{
          display: sm ? "flex" : "grid",
          flexDirection: "column",
          gridTemplateColumns: `repeat(auto-fit, minmax(${
            Boolean(minChildWidth) ? minChildWidth : sm ? "210px" : "310px"
          }, ${Boolean(maxChildWidth) ? maxChildWidth : "1fr"}))`,
          rowGap: "30px",
          columnGap: "10%",
          p: 2,
        }}
      >
        {children}
      </Box>
      {!Boolean(hideFooter) && (
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
          sx={{ padding: 2, bgcolor: "#fffaf3" }}
        >
          <Button
            variant="contained"
            color="primary"
            {...childrenProps.saveBtn}
          >
            {Boolean(childrenProps.saveBtn?.children)
              ? childrenProps.saveBtn.children
              : "حفظ"}
          </Button>
          <Button variant="contained" color="error" {...childrenProps.closeBtn}>
            {Boolean(childrenProps.closeBtn?.children)
              ? childrenProps.closeBtn.children
              : "الغاء"}
          </Button>
        </Stack>
      )}
    </Paper>
  );
};

export default Form;
