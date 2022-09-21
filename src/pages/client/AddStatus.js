import React from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import Form, { InputField } from "../../features/form";
import useControls from "../../hooks/useControls";
import { Stack } from "@mui/system";
import { Button } from "@mui/material";
import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { STATUS } from "../../data/APIs";

const AddStatus = () => {
  const [
    { controls, required, invalid },
    { setControl, resetControls, validate },
  ] = useControls([
    {
      control: "name",
      value: "",
      isRequired: true,
    },
  ]);

  //----request hooks----
  const [statusPostRequest, statusPostResponse] = useRequest({
    path: STATUS,
    method: "post",
    successMessage: "تم إضافة حالة",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    validate().then((output) => {
      if (!output.isOk) return;
      statusPostRequest({
        body: {
          name: controls.name,
        },
        onSuccess: (res) => {
          resetControls();
        },
      });
    });
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "إضافة حالة عميل"]} />
      <Stack
        component="form"
        onSubmit={handleSubmit}
        noValidate
        spacing={2}
        sx={{ maxWidth: 770 }}
        alignItems="center"
      >
        <Form
          hideFooter
          hideHeader
          maxChildWidth="550px"
          sx={{ width: "100%" }}
        >
          <InputField
            label="الحالة"
            placeholder="الحالة"
            value={controls.name}
            required={required.includes("name")}
            error={Boolean(invalid?.name)}
            helperText={invalid?.name}
            onChange={(e) => setControl("name", e.target.value)}
          />
        </Form>
        <Button
          variant="contained"
          type="submit"
          disabled={statusPostResponse.isPending}
          sx={{ width: 140, height: 50 }}
        >
          حفظ
        </Button>
      </Stack>
      {statusPostResponse.successAlert}
      {statusPostResponse.failAlert}
    </Wrapper>
  );
};

export default AddStatus;
