import React, { useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import Form, {
  InputField,
  NumberField,
  PhoneField,
  PictureField,
  SelectField,
} from "../../features/form";
import useControls from "../../hooks/useControls";
import { MenuItem } from "@mui/material";
import useRequest from "../../hooks/useRequest";
import { COUNTRY_FILTER, STATES, STATE_CITIES, UNITS } from "../../data/APIs";
import filter from "../../utils/ClearNull";

const AddUnits = () => {
  const [
    { controls, invalid, required },
    { setControl, resetControls, setInvalid, validate },
  ] = useControls([
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
      control: "address",
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
    {
      control: "phone",
      value: "",
      isRequired: false,
    },
    {
      control: "countryCode",
      value: "",
      isRequired: false,
    },
    {
      control: "notes",
      value: "",
      isRequired: false,
    },
    {
      control: "pictures",
      value: [],
      isRequired: false,
    },
  ]);

  const [unitPostRequest, unitPostResponse] = useRequest({
    path: UNITS,
    method: "post",
    successMessage: "تم إضافة وحدة جديدة بنجاح",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    validate().then(({ isOk }) => {
      if (!isOk) return;

      const requestBody = filter({
        obj: {
          address: controls.address,
          area: controls.district,
          floor_number: controls.floor,
          room_number: controls.rooms,
          bath_count: controls.bathrooms,
          price: controls.price,
          comment: controls.notes,
          unit_type: controls.type,
          area_size: controls.area,
          complete_type: controls.genre,
          sales_type: controls.sale,
          phone_client: controls.countryCode + controls.phone,
          client: controls.client,
          country: controls.country,
          state: controls.governorate,
          city: controls.city,
          part: controls.near,
          flat_number: controls.number,
          image: [...controls.pictures],
        },
        output: "formData",
      });

      if (
        Object.keys(
          filter({
            obj: {
              address: controls.address,
              area: controls.district,
              floor_number: controls.floor,
              room_number: controls.rooms,
              bath_count: controls.bathrooms,
              price: controls.price,
              comment: controls.notes,
              unit_type: controls.type,
              area_size: controls.area,
              complete_type: controls.genre,
              sales_type: controls.sale,
              phone_client: controls.countryCode + controls.phone,
              client: controls.client,
              country: controls.country,
              state: controls.governorate,
              city: controls.city,
              part: controls.near,
              flat_number: controls.number,
              image: [...controls.pictures],
            },
          })
        ).length <= 1
      )
        return;

      unitPostRequest({
        body: requestBody,
        onSuccess: () => resetControls(),
      }).then((res) => {
        const response = res?.response?.data;
        const responseBody = filter({
          obj: {
            address: response?.address,
            district: response?.area,
            floor: response?.floor_number,
            rooms: response?.room_number,
            bathrooms: response?.bath_count,
            price: response?.price,
            notes: response?.comment,
            type: response?.unit_type,
            area: response?.area_size,
            genre: response?.complete_type,
            sale: response?.sales_type,
            phone: response?.phone_client,
            client: response?.client,
            country: response?.country,
            governorate: response?.state,
            city: response?.city,
            near: response?.part,
            number: response?.flat_number,
          },
        });

        setInvalid(responseBody);
      });
    });
  };

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
      <Breadcrumbs path={["الوحدات", "إضافة وحدة"]} />
      <Form
        component="form"
        onSubmit={handleSubmit}
        childrenProps={{
          saveBtn: {
            disabled: unitPostResponse.isPending,
          },
          closeBtn: {
            disabled: unitPostResponse.isPending,
          },
        }}
      >
        <SelectField
          label="البلد"
          placeholder="البلد"
          onOpen={getCountries}
          isPending={countriesGetResponse.isPending}
          required={required.includes("country")}
          value={controls.country}
          onChange={(e) => {
            setControl("country", e.target.value);
            setControl("governorate", "");
            setControl("city", "");
          }}
          error={Boolean(invalid.country)}
          helperText={invalid.country}
        >
          {countriesData.map((country, index) => (
            <MenuItem value={country} key={`country ${index}`}>
              {country}
            </MenuItem>
          ))}
        </SelectField>
        <SelectField
          label="المحافظة"
          placeholder="المحافظة"
          disabled={!Boolean(controls.country)}
          onOpen={getGovernorates}
          isPending={statesGetResponse.isPending}
          required={required.includes("governorate")}
          value={controls.governorate}
          onChange={(e) => {
            setControl("governorate", e.target.value);
            setControl("city", "");
          }}
          error={Boolean(invalid.governorate)}
          helperText={invalid.governorate}
        >
          {governoratesData.map((governorate, index) => (
            <MenuItem value={governorate} key={`state ${index}`}>
              {governorate}
            </MenuItem>
          ))}
        </SelectField>
        <InputField
          label="المدينة"
          placeholder="المدينة"
          required={required.includes("city")}
          value={controls.city}
          onChange={(e) => setControl("city", e.target.value)}
          error={Boolean(invalid.city)}
          helperText={invalid.city}
        />
        <InputField
          label="المنطقة"
          placeholder="المنطقة"
          required={required.includes("district")}
          value={controls.district}
          onChange={(e) => setControl("district", e.target.value)}
          error={Boolean(invalid.district)}
          helperText={invalid.district}
        />
        <InputField
          label="المجاورة"
          placeholder="المجاورة"
          required={required.includes("near")}
          value={controls.near}
          onChange={(e) => setControl("near", e.target.value)}
          error={Boolean(invalid.near)}
          helperText={invalid.near}
        />
        <InputField
          label="العنوان"
          placeholder="العنوان"
          required={required.includes("address")}
          value={controls.address}
          onChange={(e) => setControl("address", e.target.value)}
          error={Boolean(invalid.address)}
          helperText={invalid.address}
        />
        <NumberField
          label="رقم العمارة"
          placeholder="رقم العمارة"
          required={required.includes("number")}
          value={controls.number}
          onChange={(e) => setControl("number", e.target.value)}
          error={Boolean(invalid.number)}
          helperText={invalid.number}
        />
        <InputField
          label="نوع الوحدة"
          placeholder="نوع الوحدة"
          required={required.includes("type")}
          value={controls.type}
          onChange={(e) => setControl("type", e.target.value)}
          error={Boolean(invalid.type)}
          helperText={invalid.type}
        />
        <SelectField
          label="نوع البيع"
          placeholder="نوع البيع"
          required={required.includes("sale")}
          value={controls.sale}
          renderValue={(selected) =>
            saleTypes.find((saleType) => saleType.value === selected).name
          }
          onChange={(e) => setControl("sale", e.target.value)}
          error={Boolean(invalid.sale)}
          helperText={invalid.sale}
        >
          {saleTypes.map((saleType, index) => (
            <MenuItem value={saleType.value} key={`saleType ${index}`}>
              {saleType.name}
            </MenuItem>
          ))}
        </SelectField>
        <NumberField
          label="الدور"
          placeholder="الدور"
          required={required.includes("floor")}
          value={controls.floor}
          onChange={(e) => setControl("floor", e.target.value)}
          error={Boolean(invalid.floor)}
          helperText={invalid.floor}
        />
        <NumberField
          label="المساحة"
          placeholder="المساحة"
          suffix=" متر"
          isAllowed={({ value }) => value.length <= 5}
          required={required.includes("area")}
          value={controls.area}
          onChange={(e) =>
            setControl("area", e.target.value.replace("متر", "").trim())
          }
          error={Boolean(invalid.area)}
          helperText={invalid.area}
        />
        <SelectField
          label="عدد الغرف"
          placeholder="عدد الغرف"
          required={required.includes("rooms")}
          value={controls.rooms}
          onChange={(e) => setControl("rooms", e.target.value)}
          error={Boolean(invalid.rooms)}
          helperText={invalid.rooms}
        >
          {rooms.map((room, index) => (
            <MenuItem value={room} key={`room ${index}`}>
              {room}
            </MenuItem>
          ))}
        </SelectField>
        <SelectField
          label="عدد الحمامات"
          placeholder="عدد الحمامات"
          required={required.includes("bathrooms")}
          value={controls.bathrooms}
          onChange={(e) => setControl("bathrooms", e.target.value)}
          error={Boolean(invalid.bathrooms)}
          helperText={invalid.bathrooms}
        >
          {bathrooms.map((bathroom, index) => (
            <MenuItem value={bathroom} key={`bathroom ${index}`}>
              {bathroom}
            </MenuItem>
          ))}
        </SelectField>
        <InputField
          label="نوع التشطيب"
          placeholder="نوع التشطيب"
          required={required.includes("genre")}
          value={controls.genre}
          onChange={(e) => setControl("genre", e.target.value)}
          error={Boolean(invalid.genre)}
          helperText={invalid.genre}
        />
        <InputField
          label="السعر"
          placeholder="السعر"
          required={required.includes("price")}
          value={controls.price}
          onChange={(e) => setControl("price", e.target.value)}
          error={Boolean(invalid.price)}
          helperText={invalid.price}
        />
        <InputField
          label="اسم العميل"
          placeholder="اسم العميل"
          required={required.includes("client")}
          value={controls.client}
          onChange={(e) => setControl("client", e.target.value)}
          error={Boolean(invalid.client)}
          helperText={invalid.client}
        />
        <PhoneField
          label="هاتف العميل"
          placeholder="هاتف العميل"
          selectProps={{
            value: controls.countryCode,
            onChange: (e) => {
              setControl("countryCode", e.target.value);
            },
          }}
          requiredCode
          required={required.includes("phone")}
          value={controls.phone}
          onChange={(e) => setControl("phone", e.target.value)}
          error={Boolean(invalid.phone)}
          helperText={invalid.phone}
        />
        <InputField
          label="ملاحظات"
          placeholder="ملاحظات"
          required={required.includes("notes")}
          value={controls.notes}
          onChange={(e) => setControl("notes", e.target.value)}
          error={Boolean(invalid.notes)}
          helperText={invalid.notes}
        />
        <PictureField
          label="صور"
          placeholder="صور"
          multiple
          onChange={(e) => {
            if (Object.keys(e.target.files).length > 6) {
              alert("لا يمكن إضافة اكثر من 6 صور");
              e.target.value = [];
              return;
            }
            setControl("pictures", [
              ...Object.keys(e.target.files).map((key) => e.target.files[key]),
            ]);
          }}
        />
      </Form>
      {unitPostResponse.successAlert}
      {unitPostResponse.failAlert}
    </Wrapper>
  );
};

export default AddUnits;

const bathrooms = [
  ...Array(10)
    .fill(0)
    .map((_, index) => index + 1),
];

const rooms = [
  ...Array(10)
    .fill(0)
    .map((_, index) => index + 1),
];

const saleTypes = [
  {
    name: "بيع",
    value: "sale",
  },
  {
    name: "إيجار",
    value: "rent",
  },
];
