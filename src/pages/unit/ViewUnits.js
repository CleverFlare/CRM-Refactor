import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataGrid from "../../components/DataGrid";
import { Avatar } from "@mui/material";
import useRequest from "../../hooks/useRequest";
import { UINTS } from "../../data/APIs";
import { useDispatch, useSelector } from "react-redux";
import useConfirmMessage from "../../hooks/useConfirmMessage";
import Form, { InputField } from "../../features/form";
import useControls from "../../hooks/useControls";
import filter from "../../utils/ClearNull";
import Dialog, {
  DialogButton,
  DialogButtonsGroup,
  DialogForm,
} from "../../features/dialog";

const ViewUnits = () => {
  const unitsStore = useSelector((state) => state.units.value);

  const dispatch = useDispatch();

  const [unitsGetRequest, unitsGetResponse] = useRequest({
    path: UINTS,
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
    path: UINTS,
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
        isPending={unitsGetResponse.isPending}
        onPaginate={handlePaginate}
        onAmountChange={handleChangeAmount}
        onDelete={handleDeleteUnit}
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

const EditDialog = ({ open, onClose }) => {
  return (
    <Dialog opne={open} onClose={onClose}>
      <DialogForm></DialogForm>
      <DialogButtonsGroup>
        <DialogButton>حفظ</DialogButton>
        <DialogButton variant="close">إلغاء</DialogButton>
      </DialogButtonsGroup>
    </Dialog>
  );
};
