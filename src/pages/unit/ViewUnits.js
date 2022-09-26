import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataGrid from "../../components/DataGrid";
import { Avatar, Badge, CircularProgress, IconButton } from "@mui/material";
import useRequest from "../../hooks/useRequest";
import { UNITS } from "../../data/APIs";
import { useDispatch, useSelector } from "react-redux";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import Form, { InputField } from "../../features/form";
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
      amount: [["size", value]],
    }));
  };

  const [unitDeleteRequest, unitDeleteResponse] = useRequest({
    path: UNITS,
    method: "delete",
    successMessage: "تم حذف الوحدة بنجاح",
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
    text: "هل انت متأكد من انك تريد حذف هذه الوحدة",
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

  return (
    <Wrapper>
      <Breadcrumbs path={["الوحدات", "عرض الوحدات"]} />
      <Form
        childrenProps={{
          saveBtn: {
            children: "تصفية",
            onClick: handleFilter,
          },
          closeBtn: {
            onClick: handleResetFilter,
          },
        }}
      >
        <InputField
          label="البلد"
          placeholder="البلد"
          value={controls.country}
          onChange={(e) => setControl("country", e.target.value)}
        />
        <InputField
          label="المحافظة"
          placeholder="المحافظة"
          value={controls.governorate}
          onChange={(e) => setControl("governorate", e.target.value)}
        />
        <InputField
          label="المدينة"
          placeholder="المدينة"
          value={controls.city}
          onChange={(e) => setControl("city", e.target.value)}
        />
        <InputField
          label="المنطقة"
          placeholder="المنطقة"
          value={controls.district}
          onChange={(e) => setControl("district", e.target.value)}
        />
        <InputField
          label="المجاورة"
          placeholder="المجاورة"
          value={controls.near}
          onChange={(e) => setControl("near", e.target.value)}
        />
        <InputField
          label="رقم العمارة"
          placeholder="رقم العمارة"
          value={controls.number}
          onChange={(e) => setControl("number", e.target.value)}
        />
        <InputField
          label="نوع الوحدة"
          placeholder="نوع الوحدة"
          value={controls.type}
          onChange={(e) => setControl("type", e.target.value)}
        />
        <InputField
          label="نوع البيع"
          placeholder="نوع البيع"
          value={controls.sale}
          onChange={(e) => setControl("sale", e.target.value)}
        />
        <InputField
          label="الدور"
          placeholder="الدور"
          value={controls.floor}
          onChange={(e) => setControl("floor", e.target.value)}
        />
        <InputField
          label="المساحة"
          placeholder="المساحة"
          value={controls.area}
          onChange={(e) => setControl("area", e.target.value)}
        />
        <InputField
          label="عدد الغرف"
          placeholder="عدد الغرف"
          value={controls.rooms}
          onChange={(e) => setControl("rooms", e.target.value)}
        />
        <InputField
          label="عدد الحمامات"
          placeholder="عدد الحمامات"
          value={controls.bathrooms}
          onChange={(e) => setControl("bathrooms", e.target.value)}
        />
        <InputField
          label="نوع التشطيب"
          placeholder="نوع التشطيب"
          value={controls.genre}
          onChange={(e) => setControl("genre", e.target.value)}
        />
        <InputField
          label="السعر"
          placeholder="السعر"
          value={controls.price}
          onChange={(e) => setControl("price", e.target.value)}
        />
        <InputField
          label="اسم العميل"
          placeholder="اسم العميل"
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
    headerName: "المساحة",
    customContent: (params) => {
      return params.area_size;
    },
  },
  {
    field: "rooms",
    headerName: "عدد الغرف",
    customContent: (params) => {
      return params.room_number;
    },
  },
  {
    field: "genre",
    headerName: "نوع التشطيب",
    customContent: (params) => {
      return params.complete_type;
    },
  },
  {
    field: "district",
    headerName: "المنطقة",
    customContent: (params) => {
      return params.area;
    },
  },
  {
    field: "price",
    headerName: "السعر",
    customContent: (params) => {
      return params.price;
    },
  },
  {
    field: "floor",
    headerName: "الدور",
    customContent: (params) => {
      return params.floor_number;
    },
  },
];

const EditDialog = ({ open = false, onClose = () => {}, data = {} }) => {
  const [{ controls }, { setControl, resetControls }] = useControls([
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
      control: "notes",
      value: data?.comment,
      isRequired: false,
    },
  ]);

  useAfterEffect(() => {
    if (!open) return;
  }, [open]);

  const [unitPatchRequest, unitPatchResponse] = useRequest({
    path: UNITS,
    method: "patch",
    successMessage: "تم تعديل الوحدة بنجاح",
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
        },
      });
    }
  };
  return (
    <Dialog open={open} onClose={onClose} paperProps={{ height: "100%" }}>
      <DialogHeading>تعديل بيانات الوحدة</DialogHeading>
      <DialogForm>
        <DialogInputField
          placeholder="البلد"
          label="البلد"
          value={controls.country}
          onChange={(e) => setControl("country", e.target.value)}
        />
        <DialogInputField
          placeholder="المحافظة"
          label="المحافظة"
          value={controls.governorate}
          onChange={(e) => setControl("governorate", e.target.value)}
        />
        <DialogInputField
          placeholder="المدينة"
          label="المدينة"
          value={controls.city}
          onChange={(e) => setControl("city", e.target.value)}
        />
        <DialogInputField
          placeholder="المنطقة"
          label="المنطقة"
          value={controls.district}
          onChange={(e) => setControl("district", e.target.value)}
        />
        <DialogInputField
          placeholder="المجاورة"
          label="المجاورة"
          value={controls.near}
          onChange={(e) => setControl("near", e.target.value)}
        />
        <DialogInputField
          placeholder="العنوان"
          label="العنوان"
          value={controls.address}
          onChange={(e) => setControl("address", e.target.value)}
        />
        <DialogNumberField
          placeholder="رقم العمارة"
          label="رقم العمارة"
          value={controls.number}
          onChange={(e) => setControl("number", e.target.floatValue)}
        />
        <DialogInputField
          placeholder="نوع الوحدة"
          label="نوع الوحدة"
          value={controls.type}
          onChange={(e) => setControl("type", e.target.value)}
        />
        <DialogNumberField
          placeholder="الدور"
          label="الدور"
          value={controls.floor}
          onChange={(e) => setControl("floor", e.target.floatValue)}
        />
        <DialogNumberField
          placeholder="المساحة"
          label="المساحة"
          prefix="متر "
          value={controls.area}
          onChange={(e) =>
            setControl("area", e.target.floatValue.replace(/متر/gi, "").trim())
          }
        />
        <DialogNumberField
          placeholder="عدد الغرف"
          label="عدد الغرف"
          value={controls.rooms}
          onChange={(e) => setControl("rooms", e.target.floatValue)}
        />
        <DialogNumberField
          placeholder="عدد الحمامات"
          label="عدد الحمامات"
          value={controls.bathrooms}
          onChange={(e) => setControl("bathrooms", e.target.floatValue)}
        />
        <DialogInputField
          placeholder="نوع التشطيب"
          label="نوع التشطيب"
          value={controls.genre}
          onChange={(e) => setControl("genre", e.target.value)}
        />
        <DialogNumberField
          placeholder="السعر"
          label="السعر"
          value={controls.price}
          thousandSeparator
          onChange={(e) => setControl("price", e.target.floatValue)}
        />
        <DialogInputField
          placeholder="إسم العميل"
          label="إسم العميل"
          value={controls.client}
          onChange={(e) => setControl("client", e.target.value)}
        />
        <DialogInputField
          placeholder="ملاحظات"
          label="ملاحظات"
          value={controls.notes}
          onChange={(e) => setControl("notes", e.target.value)}
        />
      </DialogForm>
      <DialogButtonsGroup>
        <DialogButton
          onClick={handleSubmit}
          disabled={unitPatchResponse.isPending}
        >
          حفظ
        </DialogButton>
        <DialogButton variant="close">إلغاء</DialogButton>
      </DialogButtonsGroup>
      {unitPatchResponse.successAlert}
      {unitPatchResponse.failAlert}
    </Dialog>
  );
};

const InfoDialog = ({ open, onClose, data = {} }) => {
  const info = [
    {
      name: "اسم الموظف",
      value: data?.agent,
    },
    {
      name: "الهاتف",
      value: data?.phone,
    },
    {
      name: "المنطقة",
      value: data?.area,
    },
    {
      name: "العنوان",
      value: data?.address,
    },
    {
      name: "نوع الوحدة",
      value: data?.unit_type,
    },
    {
      name: "الدور",
      value: data?.floor_number,
    },
    {
      name: "المساحة",
      value: data?.area_size,
    },
    {
      name: "عدد الغرف",
      value: data?.room_number,
    },
    {
      name: "عدد الحمامات",
      value: data?.bath_count,
    },
    {
      name: "نوع التشطيب",
      value: data?.complete_type,
    },
    {
      name: "السعر",
      value: data?.price,
    },
    {
      name: "اسم العميل",
      value: data?.client,
    },
    {
      name: "البلد",
      value: data?.country,
    },
    {
      name: "المحافظة",
      value: data?.state,
    },
    {
      name: "المدينة",
      value: data?.city,
    },
    {
      name: "المجاورة",
      value: data?.part,
    },
    {
      name: "رقم العمارة",
      value: data?.flat_number,
    },
    {
      name: "ملاحظات",
      value: data?.comment,
    },
    {
      name: "تاريخ الأنشاء",
      value: "",
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

  return (
    <Dialog open={open} onClose={onClose}>
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
      <DialogInfoWindow information={info} />
    </Dialog>
  );
};
