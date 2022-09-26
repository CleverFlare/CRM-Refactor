import React from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Stack } from "@mui/system";
import PicturePicker from "../../components/PicturePicker";
import useControls from "../../hooks/useControls";
import Form, { InputField } from "../../features/form";
import { Button } from "@mui/material";
import useRequest from "../../hooks/useRequest";
import { CHANNELS } from "../../data/APIs";
import filter from "../../utils/ClearNull";

const AddChannels = () => {
  const [
    { controls, invalid, required },
    { setControl, resetControls, setInvalid, validate },
  ] = useControls([
    {
      control: "image",
      value: "",
      isRequired: false,
    },
    {
      control: "picture",
      value: "",
      isRequired: false,
    },
    {
      control: "name",
      value: "",
      isRequired: true,
    },
  ]);

  const [channelPostRequest, channelPostResponse] = useRequest({
    path: CHANNELS,
    method: "post",
    successMessage: "تم إضافة قناة بنجاح",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    validate().then(({ isOk }) => {
      if (!isOk) return;

      const requestBody = filter({
        obj: {
          name: controls.name,
          logo: controls.image,
        },
        output: "formData",
      });

      channelPostRequest({
        body: requestBody,
        onSuccess: () => {
          resetControls();
        },
      });
    });
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["القنوات", "إضافة قناة"]} />
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ width: "max-content" }}
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <Stack direction="row" spacing={3} sx={{ width: 770 }}>
          <PicturePicker
            description="اضف صورة القناة هنا"
            picture={controls.picture}
            onChange={(e, path) => {
              setControl("picture", path);
              setControl("image", e.target.files[0]);
            }}
            error={Boolean(invalid.picture)}
          />
          <Form hideFooter hideHeader sx={{ flex: 1 }} maxChildWidth="550px">
            <InputField
              label="إسم القناة"
              placeholder="إسم القناة"
              value={controls.name}
              onChange={(e) => setControl("name", e.target.value)}
              required={required.includes("name")}
              error={Boolean(invalid.name)}
              helperText={invalid.name}
            />
          </Form>
        </Stack>
        <Button
          variant="contained"
          type="submit"
          disabled={channelPostResponse.isPending}
          sx={{ width: 140, height: 50 }}
        >
          حفظ
        </Button>
      </Stack>
      {channelPostResponse.successAlert}
      {channelPostResponse.failAlert}
    </Wrapper>
  );
};

export default AddChannels;
