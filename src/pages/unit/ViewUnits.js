import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataGrid from "../../components/DataGrid";
import {
  Avatar,
  Badge,
  CircularProgress,
  IconButton,
  MenuItem,
} from "@mui/material";
import useRequest from "../../hooks/useRequest";
import { COUNTRY_FILTER, STATES, STATE_CITIES, UNITS } from "../../data/APIs";
import { useDispatch, useSelector } from "react-redux";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import Form, { InputField, SelectField } from "../../features/form";
import useControls from "../../hooks/useControls";
import filter from "../../utils/ClearNull";
import Dialog, {
  DialogButton,
  DialogButtonsGroup,
  DialogContent,
  DialogForm,
  DialogHeading,
  DialogInfoWindow,
  DialogInputField,
  DialogPhoneField,
  DialogSelectField,
} from "../../features/dialog";
import useAfterEffect from "../../hooks/useAfterEffect";
import DialogNumberField from "../../features/dialog/components/DialogNumberField";
import compare from "../../utils/Compare";
import AddIcon from "@mui/icons-material/Add";
import { Box, Stack } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef } from "react";
import usePropState from "../../hooks/usePropState";
import useIsPermitted from "../../features/permissions/hook/useIsPermitted";
import PermissionsGate from "../../features/permissions/components/PermissionsGate";

import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  RedditIcon,
  TumblrIcon,
  LivejournalIcon,
  MailruIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  EmailIcon,
} from "react-share";
import format from "../../utils/ISOToReadable";

const ViewUnits = () => {
  const unitsStore = useSelector((state) => state.units.value);

  const dispatch = useDispatch();

  const [unitsGetRequest, unitsGetResponse] = useRequest({
    path: UNITS,
    method: "get",
  });

  const [requestParams, setRequestParams] = useState({
    currentPage: [["page", 1]],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams();

    Object.values(requestParams).map((item) =>
      item.map(([key, value]) => urlParams.append(key, value))
    );

    unitsGetRequest({
      params: urlParams,
      onSuccess: (res) => {
        dispatch({ type: "units/set", payload: res.data });
      },
    });
  }, [requestParams]);

  const handlePaginate = (params) => {
    setRequestParams((old) => ({
      ...old,
      currentPage: [["page", params.current]],
    }));
  };

  const handleChangeAmount = ({ value }) => {
    setRequestParams((old) => ({
      ...old,
      currentPage: [["page", 1]],
      amount: [["size", value]],
    }));
  };

  const [unitDeleteRequest, unitDeleteResponse] = useRequest({
    path: UNITS,
    method: "delete",
    successMessage: "???? ?????? ???????????? ??????????",
  });

  const deleteUnit = (e, row) => {
    unitDeleteRequest({
      id: row.id,
      onSuccess: (res) => {
        dispatch({ type: "units/deleteItem", payload: { id: row.id } });
      },
    });
  };

  const [handleDeleteUnit, deleteUnitConfirmDialog] = useConfirmMessage({
    onConfirm: deleteUnit,
    text: "???? ?????? ?????????? ???? ?????? ???????? ?????? ?????? ????????????",
  });

  const [{ controls }, { setControl, resetControls }] = useControls([
    {
      control: "country",
      value: "",
      isRequired: false,
    },
    {
      control: "governorate",
      value: "",
      isRequired: false,
    },
    {
      control: "city",
      value: "",
      isRequired: false,
    },
    {
      control: "district",
      value: "",
      isRequired: false,
    },
    {
      control: "near",
      value: "",
      isRequired: false,
    },
    {
      control: "number",
      value: "",
      isRequired: false,
    },
    {
      control: "type",
      value: "",
      isRequired: false,
    },
    {
      control: "sale",
      value: "",
      isRequired: false,
    },
    {
      control: "floor",
      value: "",
      isRequired: false,
    },
    {
      control: "area",
      value: "",
      isRequired: false,
    },
    {
      control: "rooms",
      value: "",
      isRequired: false,
    },
    {
      control: "bathrooms",
      value: "",
      isRequired: false,
    },
    {
      control: "genre",
      value: "",
      isRequired: false,
    },
    {
      control: "price",
      value: "",
      isRequired: false,
    },
    {
      control: "client",
      value: "",
      isRequired: false,
    },
  ]);

  const handleFilter = () => {
    const requestBody = filter({
      obj: {
        country: controls.country,
        state: controls.governorate,
        city: controls.city,
        area: controls.district,
        part: controls.near,
        flat_number: controls.number,
        unit_type: controls.type,
        sales_type: controls.sale,
        floor_number: controls.floor,
        area_size: controls.area,
        room_number: controls.rooms,
        bath_count: controls.bathrooms,
        complete_type: controls.genre,
        price: controls.price,
        client: controls.client,
      },
    });

    setRequestParams((old) => ({
      ...old,
      filters: Object.entries(requestBody),
    }));
  };

  const handleResetFilter = () => {
    resetControls();

    setRequestParams((old) => ({
      ...old,
      filters: [],
    }));
  };

  const [editData, setEditData] = useState(null);

  const [infoData, setInfoData] = useState(null);

  const isPermitted = useIsPermitted();

  //===Start===== Get Countries logic =========
  const [countriesData, setCountriesData] = useState([]);

  const [countriesGetRequest, countriesGetResponse] = useRequest({
    path: COUNTRY_FILTER,
    method: "get",
  });

  const getCountries = () => {
    countriesGetRequest({
      onSuccess: (res) => {
        setCountriesData(res.data.data);
      },
    });
  };

  const [governoratesData, setGovernoratesData] = useState([]);

  const [statesGetRequest, statesGetResponse] = useRequest({
    path: STATES,
    method: "post",
  });

  const getGovernorates = () => {
    statesGetRequest({
      body: {
        country: controls.country,
      },
      onSuccess: (res) => {
        setGovernoratesData(res.data.data);
      },
    });
  };

  //===End===== Get Countries logic =========

  return (
    <Wrapper>
      <Breadcrumbs path={["??????????????", "?????? ??????????????"]} />
      <Form
        childrenProps={{
          saveBtn: {
            children: "??????????",
            onClick: handleFilter,
          },
          closeBtn: {
            onClick: handleResetFilter,
          },
        }}
      >
        <SelectField
          label="??????????"
          placeholder="??????????"
          onOpen={getCountries}
          isPending={countriesGetResponse.isPending}
          value={controls.country}
          onChange={(e) => {
            setControl("country", e.target.value);
            setControl("governorate", "");
            setControl("city", "");
          }}
        >
          {countriesData.map((country, index) => (
            <MenuItem value={country} key={`country ${index}`}>
              {country}
            </MenuItem>
          ))}
        </SelectField>
        <SelectField
          label="????????????????"
          placeholder="????????????????"
          disabled={!Boolean(controls.country)}
          onOpen={getGovernorates}
          isPending={statesGetResponse.isPending}
          value={controls.governorate}
          onChange={(e) => {
            setControl("governorate", e.target.value);
            setControl("city", "");
          }}
        >
          {governoratesData.map((governorate, index) => (
            <MenuItem value={governorate} key={`state ${index}`}>
              {governorate}
            </MenuItem>
          ))}
        </SelectField>
        <InputField
          label="??????????????"
          placeholder="??????????????"
          value={controls.city}
          onChange={(e) => setControl("city", e.target.value)}
        />
        <InputField
          label="??????????????"
          placeholder="??????????????"
          value={controls.district}
          onChange={(e) => setControl("district", e.target.value)}
        />
        <InputField
          label="????????????????"
          placeholder="????????????????"
          value={controls.near}
          onChange={(e) => setControl("near", e.target.value)}
        />
        <InputField
          label="?????? ??????????????"
          placeholder="?????? ??????????????"
          value={controls.number}
          onChange={(e) => setControl("number", e.target.value)}
        />
        <InputField
          label="?????? ????????????"
          placeholder="?????? ????????????"
          value={controls.type}
          onChange={(e) => setControl("type", e.target.value)}
        />
        <InputField
          label="?????? ??????????"
          placeholder="?????? ??????????"
          value={controls.sale}
          onChange={(e) => setControl("sale", e.target.value)}
        />
        <InputField
          label="??????????"
          placeholder="??????????"
          value={controls.floor}
          onChange={(e) => setControl("floor", e.target.value)}
        />
        <InputField
          label="??????????????"
          placeholder="??????????????"
          value={controls.area}
          onChange={(e) => setControl("area", e.target.value)}
        />
        <InputField
          label="?????? ??????????"
          placeholder="?????? ??????????"
          value={controls.rooms}
          onChange={(e) => setControl("rooms", e.target.value)}
        />
        <InputField
          label="?????? ????????????????"
          placeholder="?????? ????????????????"
          value={controls.bathrooms}
          onChange={(e) => setControl("bathrooms", e.target.value)}
        />
        <InputField
          label="?????? ??????????????"
          placeholder="?????? ??????????????"
          value={controls.genre}
          onChange={(e) => setControl("genre", e.target.value)}
        />
        <InputField
          label="??????????"
          placeholder="??????????"
          value={controls.price}
          onChange={(e) => setControl("price", e.target.value)}
        />
        <InputField
          label="?????? ????????????"
          placeholder="?????? ????????????"
          value={controls.client}
          onChange={(e) => setControl("client", e.target.value)}
        />
      </Form>
      <DataGrid
        columns={columns}
        rows={unitsStore.results}
        total={unitsStore.count}
        isPending={unitsGetResponse.isPending}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onDelete={isPermitted(handleDeleteUnit, ["delete_aqarunit"])}
        onEdit={isPermitted((e, row) => setEditData(row), ["change_aqarunit"])}
        onView={(e, row) => setInfoData(row)}
      />
      <EditDialog
        open={Boolean(editData)}
        onClose={() => setEditData(null)}
        data={editData}
      />
      <InfoDialog
        open={Boolean(infoData)}
        onClose={() => setInfoData(null)}
        data={infoData}
      />
      {deleteUnitConfirmDialog}
      {unitDeleteResponse.successAlert}
      {unitDeleteResponse.failAlert}
    </Wrapper>
  );
};

export default ViewUnits;

const columns = [
  {
    field: "picture",
    headerName: " ",
    customContent: (params) => {
      return (
        <Avatar
          src={params.images[0]?.image}
          variant="rounded"
          sx={{ width: 90, height: 90 }}
        >
          U
        </Avatar>
      );
    },
  },
  {
    field: "area",
    headerName: "??????????????",
    customContent: (params) => {
      return params.area_size;
    },
  },
  {
    field: "rooms",
    headerName: "?????? ??????????",
    customContent: (params) => {
      return params.room_number;
    },
  },
  {
    field: "genre",
    headerName: "?????? ??????????????",
    customContent: (params) => {
      return params.complete_type;
    },
  },
  {
    field: "district",
    headerName: "??????????????",
    customContent: (params) => {
      return params.area;
    },
  },
  {
    field: "price",
    headerName: "??????????",
    customContent: (params) => {
      return params.price;
    },
  },
  {
    field: "floor",
    headerName: "??????????",
    customContent: (params) => {
      return params.floor_number;
    },
  },
];

const EditDialog = ({ open = false, onClose = () => {}, data = {} }) => {
  const [{ controls }, { setControl, resetControls }] = useControls(
    [
      {
        control: "country",
        value: data?.country,
        isRequired: false,
      },
      {
        control: "governorate",
        value: data?.state,
        isRequired: false,
      },
      {
        control: "city",
        value: data?.city,
        isRequired: false,
      },
      {
        control: "district",
        value: data?.area,
        isRequired: false,
      },
      {
        control: "near",
        value: data?.part,
        isRequired: false,
      },
      {
        control: "address",
        value: data?.address,
        isRequired: false,
      },
      {
        control: "number",
        value: data?.flat_number,
        isRequired: false,
      },
      {
        control: "type",
        value: data?.unit_type,
        isRequired: false,
      },
      {
        control: "floor",
        value: data?.floor_number,
        isRequired: false,
      },
      {
        control: "area",
        value: data?.area_size,
        isRequired: false,
      },
      {
        control: "rooms",
        value: data?.room_number,
        isRequired: false,
      },
      {
        control: "bathrooms",
        value: data?.bath_count,
        isRequired: false,
      },
      {
        control: "genre",
        value: data?.complete_type,
        isRequired: false,
      },
      {
        control: "price",
        value: data?.price,
        isRequired: false,
      },
      {
        control: "client",
        value: data?.client,
        isRequired: false,
      },
      {
        control: "countryCode",
        value: data?.country_code_phone_client,
        isRequired: false,
      },
      {
        control: "phone",
        value: data?.phone_client,
        isRequired: false,
      },
      {
        control: "notes",
        value: data?.comment,
        isRequired: false,
      },
    ],
    [data]
  );

  useAfterEffect(() => {
    if (!open) return;
  }, [open]);

  const [unitPatchRequest, unitPatchResponse] = useRequest({
    path: UNITS,
    method: "patch",
    successMessage: "???? ?????????? ???????????? ??????????",
  });

  const dispatch = useDispatch();

  const handleSubmit = () => {
    const isThereChange = !compare(
      [
        [controls.country, data.country],
        [controls.governorate, data.state],
        [controls.city, data.city],
        [controls.district, data.area],
        [controls.near, data.part],
        [controls.address, data.address],
        [controls.number, data.flat_number],
        [controls.type, data.unit_type],
        [controls.floor, data.floor_number],
        [controls.area, data.area_size],
        [controls.rooms, data.room_number],
        [controls.bathrooms, data.bath_count],
        [controls.genre, data.complete_type],
        [controls.price, data.price],
        [controls.client, data.client],
        [controls.phone, data.phone_client],
        [controls.countryCode, data.country_code_phone_client],
        [controls.notes, data.comment],
      ],
      true
    );

    if (isThereChange) {
      const requestBody = filter({
        obj: {
          country: controls.country,
          state: controls.governorate,
          city: controls.city,
          area: controls.district,
          part: controls.near,
          flat_number: controls.number,
          unit_type: controls.type,
          sales_type: controls.sale,
          floor_number: controls.floor,
          area_size: controls.area,
          room_number: controls.rooms,
          bath_count: controls.bathrooms,
          complete_type: controls.genre,
          price: controls.price,
          client: controls.client,
          phone_client: controls.countryCode + controls.phone,
          comment: controls.notes,
        },
      });
      unitPatchRequest({
        id: data.id,
        body: requestBody,
        onSuccess: (res) => {
          dispatch({
            type: "units/putItem",
            payload: { id: res.data.id, item: res.data },
          });
          onClose();
        },
      });
    }
  };

  //===Start===== Get Countries logic =========
  const [countriesData, setCountriesData] = useState([]);

  const [countriesGetRequest, countriesGetResponse] = useRequest({
    path: COUNTRY_FILTER,
    method: "get",
  });

  const getCountries = () => {
    if (countriesData.length) return;
    countriesGetRequest({
      onSuccess: (res) => {
        setCountriesData(res.data.data);
      },
    });
  };

  const [governoratesData, setGovernoratesData] = useState([]);

  const [statesGetRequest, statesGetResponse] = useRequest({
    path: STATES,
    method: "post",
  });

  const getGovernorates = () => {
    if (governoratesData.length) return;
    statesGetRequest({
      body: {
        country: controls.country,
      },
      onSuccess: (res) => {
        setGovernoratesData(res.data.data);
      },
    });
  };

  //===End===== Get Countries logic =========

  return (
    <Dialog open={open} onClose={onClose} paperProps={{ height: "100%" }}>
      <DialogHeading>?????????? ???????????? ????????????</DialogHeading>
      <DialogForm>
        <DialogSelectField
          label="??????????"
          placeholder="??????????"
          onOpen={getCountries}
          isPending={countriesGetResponse.isPending}
          value={controls.country}
          onChange={(e) => {
            setControl("country", e.target.value);
            setControl("governorate", "");
            setControl("city", "");
          }}
        >
          {countriesData.map((country, index) => (
            <MenuItem value={country} key={`country ${index}`}>
              {country}
            </MenuItem>
          ))}
        </DialogSelectField>
        <DialogSelectField
          label="????????????????"
          placeholder="????????????????"
          disabled={!Boolean(controls.country)}
          onOpen={getGovernorates}
          isPending={statesGetResponse.isPending}
          value={controls.governorate}
          onChange={(e) => {
            setControl("governorate", e.target.value);
            setControl("city", "");
          }}
        >
          {governoratesData.map((governorate, index) => (
            <MenuItem value={governorate} key={`state ${index}`}>
              {governorate}
            </MenuItem>
          ))}
        </DialogSelectField>
        <DialogInputField
          label="??????????????"
          placeholder="??????????????"
          value={controls.city}
          onChange={(e) => setControl("city", e.target.value)}
        />
        <DialogInputField
          placeholder="??????????????"
          label="??????????????"
          value={controls.district}
          onChange={(e) => setControl("district", e.target.value)}
        />
        <DialogInputField
          placeholder="????????????????"
          label="????????????????"
          value={controls.near}
          onChange={(e) => setControl("near", e.target.value)}
        />
        <DialogInputField
          placeholder="??????????????"
          label="??????????????"
          value={controls.address}
          onChange={(e) => setControl("address", e.target.value)}
        />
        <DialogNumberField
          placeholder="?????? ??????????????"
          label="?????? ??????????????"
          value={controls.number}
          onChange={(e) => setControl("number", e.target.floatValue)}
        />
        <DialogInputField
          placeholder="?????? ????????????"
          label="?????? ????????????"
          value={controls.type}
          onChange={(e) => setControl("type", e.target.value)}
        />
        <DialogNumberField
          placeholder="??????????"
          label="??????????"
          value={controls.floor}
          onChange={(e) => setControl("floor", e.target.floatValue)}
        />
        <DialogNumberField
          placeholder="??????????????"
          label="??????????????"
          prefix="?????? "
          value={controls.area}
          onChange={(e) =>
            setControl("area", e.target.floatValue.replace(/??????/gi, "").trim())
          }
        />
        <DialogNumberField
          placeholder="?????? ??????????"
          label="?????? ??????????"
          value={controls.rooms}
          onChange={(e) => setControl("rooms", e.target.floatValue)}
        />
        <DialogNumberField
          placeholder="?????? ????????????????"
          label="?????? ????????????????"
          value={controls.bathrooms}
          onChange={(e) => setControl("bathrooms", e.target.floatValue)}
        />
        <DialogInputField
          placeholder="?????? ??????????????"
          label="?????? ??????????????"
          value={controls.genre}
          onChange={(e) => setControl("genre", e.target.value)}
        />
        <DialogNumberField
          placeholder="??????????"
          label="??????????"
          value={controls.price}
          thousandSeparator
          onChange={(e) => setControl("price", e.target.floatValue)}
        />
        <DialogInputField
          placeholder="?????? ????????????"
          label="?????? ????????????"
          value={controls.client}
          onChange={(e) => setControl("client", e.target.value)}
        />
        <DialogPhoneField
          placeholder="???????? ????????????"
          label="???????? ????????????"
          selectProps={{
            value: controls.countryCode,
            onChange: (e) => setControl("countryCode", e.target.value),
          }}
          value={controls.phone}
          onChange={(e) => setControl("phone", e.target.value)}
        />
        <DialogInputField
          placeholder="??????????????"
          label="??????????????"
          value={controls.notes}
          onChange={(e) => setControl("notes", e.target.value)}
        />
      </DialogForm>
      <DialogButtonsGroup>
        <DialogButton
          onClick={handleSubmit}
          disabled={unitPatchResponse.isPending}
        >
          ??????
        </DialogButton>
        <DialogButton variant="close" onClick={onClose}>
          ??????????
        </DialogButton>
      </DialogButtonsGroup>
      {unitPatchResponse.failAlert}
    </Dialog>
  );
};

const InfoDialog = ({ open, onClose, data = {} }) => {
  const info = [
    {
      name: "?????? ????????????",
      value: data?.agent,
    },
    {
      name: "???????? ????????????",
      value: data?.phone,
    },
    {
      name: "??????????????",
      value: data?.area,
    },
    {
      name: "??????????????",
      value: data?.address,
    },
    {
      name: "?????? ????????????",
      value: data?.unit_type,
    },
    {
      name: "??????????",
      value: data?.floor_number,
    },
    {
      name: "??????????????",
      value: data?.area_size,
    },
    {
      name: "?????? ??????????",
      value: data?.room_number,
    },
    {
      name: "?????? ????????????????",
      value: data?.bath_count,
    },
    {
      name: "?????? ??????????????",
      value: data?.complete_type,
    },
    {
      name: "??????????",
      value: data?.price,
    },
    {
      name: "?????? ????????????",
      value: data?.client,
    },
    {
      name: "???????? ????????????",
      value: data?.phone_client,
    },
    {
      name: "??????????",
      value: data?.country,
    },
    {
      name: "????????????????",
      value: data?.state,
    },
    {
      name: "??????????????",
      value: data?.city,
    },
    {
      name: "????????????????",
      value: data?.part,
    },
    {
      name: "?????? ??????????????",
      value: data?.flat_number,
    },
    {
      name: "??????????????",
      value: data?.comment,
    },
    {
      name: "?????????? ??????????????",
      value: data?.created_at && format(data?.created_at),
    },
  ];

  const addPictureRef = useRef(null);

  const changePictureRef = useRef(null);

  const [pictures, setPictures] = usePropState(data?.images, [data]);

  const [picturePatchRequest, picturePatchResponse] = useRequest({
    path: UNITS,
    method: "patch",
  });

  const dispatch = useDispatch();

  const handleDeletePicture = (id) => {
    const requestBody = filter({
      obj: {
        image_id: id,
      },
      output: "formData",
    });

    picturePatchRequest({
      body: requestBody,
      id: data.id,
      onSuccess: (res) => {
        dispatch({
          type: "units/putItem",
          payload: { id: res.data.id, item: res.data },
        });

        setPictures(res.data.images);
      },
    });
  };

  const handleAddPicture = (e) => {
    const requestBody = filter({
      obj: {
        image: e.target.files[0],
      },
      output: "formData",
    });

    picturePatchRequest({
      body: requestBody,
      id: data.id,
      onSuccess: (res) => {
        dispatch({
          type: "units/putItem",
          payload: { id: res.data.id, item: res.data },
        });

        setPictures(res.data.images);
      },
    });
  };

  const handleChangePicture = ({ id, image }) => {
    const requestBody = filter({
      obj: {
        image_id: id,
        image: image,
      },
      output: "formData",
    });

    picturePatchRequest({
      body: requestBody,
      id: data.id,
      onSuccess: (res) => {
        dispatch({
          type: "units/putItem",
          payload: { id: res.data.id, item: res.data },
        });

        setPictures(res.data.images);
      },
    });
  };

  //===Start====== share logic ===========

  const userInfo = useSelector((state) => state.userInfo.value);

  const message = `?????????? ?????? ${
    userInfo?.organization?.name ? userInfo?.organization?.name : "?????? ??????????"
  }
  ?????? ????????????: ${data?.unit_type ? data?.unit_type : "???? ????????"}
  ??????????????: ${data?.address ? data?.address : "???? ????????"}
  ??????????????: ${data?.area ? data?.area : "???? ????????"}
  ??????????: ${data?.floor_number ? data?.floor_number : "???? ????????"}
  ??????????????: ${data?.area_size ? data?.area_size : "???? ????????"}
  ?????? ??????????: ${data?.room_number ? data?.room_number : "???? ????????"}
  ?????? ????????????????: ${data?.bath_count ? data?.bath_count : "???? ????????"}
  ?????? ??????????????: ${data?.complete_type ? data?.complete_type : "???? ????????"}
  ??????????: ${data?.price ? data?.price : "???? ????????"}
  ??????????: ${data?.country ? data?.country : "???? ????????"}
  ????????????????: ${data?.state ? data?.state : "???? ????????"}
  ??????????????: ${data?.city ? data?.city : "???? ????????"}
  ?????? ??????????????: ${data?.flat_number ? data?.flat_number : "???? ????????"}\n`;

  //===End====== share logic ===========

  return (
    <Dialog open={open} onClose={onClose}>
      <PermissionsGate permissions={["change_aqarunit"]}>
        <DialogContent>
          <Stack
            direction="row"
            sx={{ width: "100%" }}
            justifyContent="center"
            gap="20px"
          >
            <Box
              component="input"
              type="file"
              ref={changePictureRef}
              sx={{ display: "none" }}
              onChange={(e) => {
                handleChangePicture({
                  id: e.target.id,
                  image: e.target.files[0],
                });
              }}
            ></Box>
            {pictures &&
              pictures.map((item, index) => (
                <Badge
                  badgeContent={
                    <IconButton
                      sx={{
                        bgcolor: "red",
                        position: "relative",
                        "&:hover": {
                          bgcolor: "red",
                        },
                      }}
                      onClick={() => handleDeletePicture(item.id)}
                    >
                      <DeleteIcon sx={{ color: "white" }} />
                    </IconButton>
                  }
                  key={`image ${index}`}
                >
                  {picturePatchResponse.isPending && (
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.2)",
                        zIndex: 1,
                      }}
                    >
                      <CircularProgress sx={{ color: "white" }} />
                    </Stack>
                  )}
                  <Avatar
                    variant="rounded"
                    src={item.image}
                    sx={{
                      width: 120,
                      height: 120,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      changePictureRef.current.id = item.id;
                      changePictureRef.current.click();
                    }}
                  >
                    U
                  </Avatar>
                </Badge>
              ))}
            <Box
              component="input"
              type="file"
              sx={{ display: "none" }}
              ref={addPictureRef}
              onChange={handleAddPicture}
            ></Box>
            {pictures?.length < 5 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 120,
                  height: 120,
                  bgcolor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: 1.5,
                  cursor: "pointer",
                }}
                onClick={() => addPictureRef.current.click()}
              >
                <AddIcon sx={{ color: "white" }} />
              </Box>
            )}
          </Stack>
        </DialogContent>
      </PermissionsGate>
      <DialogInfoWindow information={info} />
      <DialogContent>
        <Stack direction="row" justifyContent="center">
          <FacebookShareButton
            quote={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <FacebookIcon size={32} round={true} />
            </IconButton>
          </FacebookShareButton>
          <WhatsappShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <WhatsappIcon size={32} round={true} />
            </IconButton>
          </WhatsappShareButton>
          <LinkedinShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <LinkedinIcon size={32} round={true} />
            </IconButton>
          </LinkedinShareButton>
          <TelegramShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <TelegramIcon size={32} round={true} />
            </IconButton>
          </TelegramShareButton>
          <PinterestShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <PinterestIcon size={32} round={true} />
            </IconButton>
          </PinterestShareButton>
          <VKShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <VKIcon size={32} round={true} />
            </IconButton>
          </VKShareButton>
          <OKShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <OKIcon size={32} round={true} />
            </IconButton>
          </OKShareButton>
          <RedditShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <RedditIcon size={32} round={true} />
            </IconButton>
          </RedditShareButton>
          <TumblrShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <TumblrIcon size={32} round={true} />
            </IconButton>
          </TumblrShareButton>
          <LivejournalShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <LivejournalIcon size={32} round={true} />
            </IconButton>
          </LivejournalShareButton>
          <TwitterShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <TwitterIcon size={32} round={true} />
            </IconButton>
          </TwitterShareButton>
          <MailruShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <MailruIcon size={32} round={true} />
            </IconButton>
          </MailruShareButton>
          <WorkplaceShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <WorkplaceIcon size={32} round={true} />
            </IconButton>
          </WorkplaceShareButton>
          <ViberShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <ViberIcon size={32} round={true} />
            </IconButton>
          </ViberShareButton>
          <LineShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <LineIcon size={32} round={true} />
            </IconButton>
          </LineShareButton>
          <EmailShareButton
            title={message}
            url={`${
              userInfo.organization.url
                ? userInfo.organization.url
                : "???????????? ?????? ??????????"
            }`}
          >
            <IconButton>
              <EmailIcon size={32} round={true} />
            </IconButton>
          </EmailShareButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
