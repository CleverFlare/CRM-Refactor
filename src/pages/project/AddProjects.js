import React from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import Form, { InputField, TextareaField } from "../../features/form";
import { Stack } from "@mui/system";
import PicturePicker from "../../components/PicturePicker";
import { Box, Button } from "@mui/material";
import useControls from "../../hooks/useControls";
import useRequest from "../../hooks/useRequest";
import { PROJECTS } from "../../data/APIs";
import filter from "../../utils/ClearNull";

const AddProjects = () => {
  const [projectPostRequest, projectPostResponse] = useRequest({
    path: PROJECTS,
    method: "post",
    successMessage: "تم إضافة مشروع جديد بنجاح",
  });

  const [
    { controls, required, invalid },
    { setControl, resetControls, validate, setInvalid },
  ] = useControls([
    {
      control: "picture",
      value: "",
      isRequired: true,
    },
    {
      control: "name",
      value: "",
      isRequired: true,
    },
    {
      control: "address",
      value: "",
      isRequired: true,
    },
    {
      control: "description",
      value: "",
      isRequired: true,
    },
    {
      control: "image",
      value: "",
      isRequired: true,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validate().then((output) => {
      if (!output.isOk) return;

      const requestBody = filter({
        obj: {
          name: controls.name,
          address: controls.address,
          comment: controls.description,
          logo: controls.image,
        },
        output: "formData",
      });

      projectPostRequest({
        body: requestBody,
        onSuccess: () => {
          resetControls();
        },
      }).then(({ data: { response } }) => {
        const responseBody = {
          name: response.name,
          address: response.address,
          description: response.comment,
          picture: response.logo,
        };

        setInvalid(responseBody);
      });
    });
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["المشاريع", "إضافة مشروع"]} />
      <Stack
        component="form"
        onSubmit={handleSubmit}
        noValidate
        alignItems="center"
        gap={2}
        sx={{ maxWidth: 770 }}
      >
        <Form
          hideFooter
          hideHeader
          maxChildWidth="550px"
          sx={{
            width: "100%",
            boxShadow: {
              xl: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
              lg: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
              md: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
              sm: "none",
              xs: "none",
            },
          }}
        >
          <Box
            direction="row"
            sx={{
              display: {
                xl: "grid",
                lg: "grid",
                md: "grid",
                sm: "flex",
                xs: "flex",
              },
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gridTemplateColumns: "auto 1fr",
              gap: 4,
              width: "100%",
            }}
          >
            <PicturePicker
              description="اضف صورة المشروع هنا"
              picture={controls.picture}
              onChange={(e, path) => {
                setControl("picture", path);
                setControl("image", e.target.files[0]);
              }}
              error={Boolean(invalid.picture)}
            />
            <Stack gap={3} sx={{ width: "100%" }}>
              <InputField
                placeholder="إسم المشروع"
                label="إسم المشروع"
                value={controls.name}
                onChange={(e) => setControl("name", e.target.value)}
                required={required.includes("name")}
                error={Boolean(invalid.name)}
                helperText={invalid.name}
              />
              <InputField
                placeholder="عنوان المشروع"
                label="عنوان المشروع"
                value={controls.address}
                onChange={(e) => setControl("address", e.target.value)}
                required={required.includes("address")}
                error={Boolean(invalid.address)}
                helperText={invalid.address}
              />
            </Stack>
          </Box>
          <TextareaField
            placeholder="الوصف"
            label="الوصف"
            value={controls.description}
            onChange={(e) => setControl("description", e.target.value)}
            required={required.includes("description")}
            error={Boolean(invalid.description)}
            helperText={invalid.description}
          />
        </Form>
        <Button
          variant="contained"
          type="submit"
          disabled={projectPostResponse.isPending}
          sx={{ width: 140, height: 50 }}
        >
          حفظ
        </Button>
      </Stack>
      {projectPostResponse.successAlert}
      {projectPostResponse.failAlert}
    </Wrapper>
  );
};

export default AddProjects;
