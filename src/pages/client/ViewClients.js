import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import DataGrid from "../../components/DataGrid";
import Breadcrumbs from "../../components/Breadcrumbs";
import format from "../../utils/ISOToReadable";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { CLIENTS } from "../../data/APIs";
import { Button, Stack } from "@mui/material";

const ViewClients = () => {
  //----store----
  const clientsStore = useSelector((state) => state.clients.value);

  const dispatch = useDispatch();

  //----states----
  const [selected, setSelected] = useState([]);

  //----request hooks----
  const [clientsGetRequest, clientsGetResponse] = useRequest({
    path: CLIENTS,
    method: "get",
  });

  const [clientDeleteRequest, clientDeleteResponse] = useRequest({
    path: CLIENTS,
    method: "delete",
  });

  //----effects----
  useEffect(() => {
    getClients();
  }, []);

  //----functions----
  const getClients = () => {
    clientsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "clients/set", payload: res.data });
      },
    });
  };

  const deleteClient = (e, { id }) => {
    clientDeleteRequest({
      id: id,
      onSuccess: (res) => {
        dispatch({ type: "clients/deleteItem", payload: { id } });
      },
    });
  };

  const handlePaginate = (params) => {
    clientsGetRequest({
      params: {
        page: params.current,
      },
      onSuccess: (res) => {
        dispatch({ type: "clients/set", payload: res.data });
      },
    });
  };

  const handleChecks = ({ checks }) => {
    setSelected(checks);
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "جميع العملاء"]} />
      <DataGrid
        columns={columns}
        rows={clientsStore.results}
        isPending={clientsGetResponse.isPending}
        onCheck={handleChecks}
        onEdit={() => {}}
        onDelete={deleteClient}
        onView={() => {}}
        onPaginate={handlePaginate}
      />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Button
          variant="contained"
          disabled={!Boolean(selected.length)}
          sx={{ width: "200px", height: "50px" }}
        >
          تصدير المحدد
        </Button>
        <Button
          variant="contained"
          disabled={!Boolean(selected.length)}
          sx={{ width: "200px", height: "50px" }}
        >
          تحويل المحدد
        </Button>
        <Button
          variant="contained"
          disabled={!Boolean(selected.length)}
          sx={{ width: "200px", height: "50px" }}
        >
          تغيير مشاريع المحدد
        </Button>
      </Stack>
      {clientDeleteResponse.successAlert}
      {clientDeleteResponse.failAlert}
    </Wrapper>
  );
};

export default ViewClients;

const columns = [
  {
    field: "name",
    headerName: "الإسم",
    customContent: ({ user }) => `${user.first_name} ${user.last_name}`,
  },
  {
    field: "phone",
    headerName: "الهاتف",
    customContent: ({ user }) => `${user.country_code}${user.phone}`,
  },
  {
    field: "project",
    headerName: "المشروع",
    customContent: ({ bussiness }) =>
      `${bussiness.map((project) => project.name).join(" ، ")}`,
  },
  {
    field: "comment",
    headerName: "التعليق",
    customEmpty: "لا يوجد",
  },
  {
    field: "event",
    headerName: "الحالة",
    customEmpty: "لا يوجد",
  },
  {
    field: "created_at",
    headerName: "تاريخ الإنشاء",
    customContent: ({ created_at }) => format(created_at),
  },
  {
    field: "created_by",
    headerName: "تم الإنشاء بواسطة",
  },
  {
    field: "followup",
    headerName: "تاريخ المعاينة",
  },
  {
    field: "agent",
    headerName: "الموظف",
    customContent: ({ agent }) => `${agent.name}`,
  },
];

const dummyRows = [
  {
    id: 24890,
    user: {
      id: 48317,
      first_name: "hisham",
      last_name: "fouad",
      email: "",
      country_code: "+20",
      phone: "01153375735",
      image:
        "https://sadakatcdn.cyparta.com/media/media/DefaultPhotos/defult.png",
    },
    organization: 6,
    bussiness: [
      {
        id: 157,
        name: "El alamein",
      },
    ],
    channel: "",
    agent: {
      id: 93,
      name: "Ahmed",
    },
    max_budget: "0.00",
    fav_contacts: "phone",
    created_at: "2022-09-06T21:49:45.939560+02:00",
    event: "",
    comment: "",
    followup: null,
    created_by: "Ahmed",
  },
  {
    id: 24888,
    user: {
      id: 48315,
      first_name: "mohammad",
      last_name: "salah kandil",
      email: "",
      country_code: "+20",
      phone: "01116114068",
      image:
        "https://sadakatcdn.cyparta.com/media/media/DefaultPhotos/defult.png",
    },
    organization: 6,
    bussiness: [
      {
        id: 157,
        name: "El alamein",
      },
    ],
    channel: "",
    agent: {
      id: 93,
      name: "Ahmed",
    },
    max_budget: "0.00",
    fav_contacts: "phone",
    created_at: "2022-09-06T21:49:45.710312+02:00",
    event: "",
    comment: "",
    followup: null,
    created_by: "Ahmed",
  },
  {
    id: 24887,
    user: {
      id: 48314,
      first_name: "ahmed",
      last_name: "elkordi",
      email: "",
      country_code: "+20",
      phone: "01012224387",
      image:
        "https://sadakatcdn.cyparta.com/media/media/DefaultPhotos/defult.png",
    },
    organization: 6,
    bussiness: [
      {
        id: 157,
        name: "El alamein",
      },
    ],
    channel: "",
    agent: {
      id: 93,
      name: "Ahmed",
    },
    max_budget: "0.00",
    fav_contacts: "phone",
    created_at: "2022-09-06T21:49:45.601893+02:00",
    event: "",
    comment: "",
    followup: null,
    created_by: "Ahmed",
  },
  {
    id: 24886,
    user: {
      id: 48313,
      first_name: "lulu",
      last_name: "khaled",
      email: "",
      country_code: "+20",
      phone: "01159603519",
      image:
        "https://sadakatcdn.cyparta.com/media/media/DefaultPhotos/defult.png",
    },
    organization: 6,
    bussiness: [
      {
        id: 157,
        name: "El alamein",
      },
    ],
    channel: "",
    agent: {
      id: 93,
      name: "Ahmed",
    },
    max_budget: "0.00",
    fav_contacts: "phone",
    created_at: "2022-09-06T21:49:45.501670+02:00",
    event: "",
    comment: "",
    followup: null,
    created_by: "Ahmed",
  },
  {
    id: 24885,
    user: {
      id: 48312,
      first_name: "mohamed",
      last_name: "salem hassan",
      email: "",
      country_code: "+20",
      phone: "01114134284",
      image:
        "https://sadakatcdn.cyparta.com/media/media/DefaultPhotos/defult.png",
    },
    organization: 6,
    bussiness: [
      {
        id: 157,
        name: "El alamein",
      },
    ],
    channel: "",
    agent: {
      id: 93,
      name: "Ahmed",
    },
    max_budget: "0.00",
    fav_contacts: "phone",
    created_at: "2022-09-06T21:49:45.404422+02:00",
    event: "",
    comment: "",
    followup: null,
    created_by: "Ahmed",
  },
  {
    id: 24884,
    user: {
      id: 48311,
      first_name: "mohamed",
      last_name: "farahat",
      email: "",
      country_code: "+20",
      phone: "01066962626",
      image:
        "https://sadakatcdn.cyparta.com/media/media/DefaultPhotos/defult.png",
    },
    organization: 6,
    bussiness: [
      {
        id: 157,
        name: "El alamein",
      },
    ],
    channel: "",
    agent: {
      id: 93,
      name: "Ahmed",
    },
    max_budget: "0.00",
    fav_contacts: "phone",
    created_at: "2022-09-06T21:49:45.296132+02:00",
    event: "",
    comment: "",
    followup: null,
    created_by: "Ahmed",
  },
  {
    id: 24883,
    user: {
      id: 48310,
      first_name: "mahmoud",
      last_name: "fashlom",
      email: "",
      country_code: "+20",
      phone: "01224000150",
      image:
        "https://sadakatcdn.cyparta.com/media/media/DefaultPhotos/defult.png",
    },
    organization: 6,
    bussiness: [
      {
        id: 157,
        name: "El alamein",
      },
    ],
    channel: "",
    agent: {
      id: 93,
      name: "Ahmed",
    },
    max_budget: "0.00",
    fav_contacts: "phone",
    created_at: "2022-09-06T21:49:45.202780+02:00",
    event: "",
    comment: "",
    followup: null,
    created_by: "Ahmed",
  },
  {
    id: 24882,
    user: {
      id: 48309,
      first_name: "mido",
      last_name: "mohamed",
      email: "",
      country_code: "+20",
      phone: "01288442660",
      image:
        "https://sadakatcdn.cyparta.com/media/media/DefaultPhotos/defult.png",
    },
    organization: 6,
    bussiness: [
      {
        id: 157,
        name: "El alamein",
      },
    ],
    channel: "",
    agent: {
      id: 93,
      name: "Ahmed",
    },
    max_budget: "0.00",
    fav_contacts: "phone",
    created_at: "2022-09-06T21:49:45.107056+02:00",
    event: "",
    comment: "",
    followup: null,
    created_by: "Ahmed",
  },
];
