import React from "react";
import Wrapper from "../../components/Wrapper";
import Breadcrumbs from "../../components/Breadcrumbs";
import Form, {
  InputField,
  MultiSelectField,
  MultiSelectItem,
  NumberField,
  PhoneField,
  SelectField,
} from "../../features/form";
import useControls from "../../hooks/useControls";
import useRequest from "../../hooks/useRequest";
import { CHANNELS, CLIENTS, EMPLOYEES, PROJECTS } from "../../data/APIs";
import { useDispatch, useSelector } from "react-redux";
import { MenuItem } from "@mui/material";
import filter from "../../utils/ClearNull";

const AddClients = () => {
  //----store----
  const projectsStore = useSelector((state) => state.projects.value);
  const employeesStore = useSelector((state) => state.employees.value);
  const channelsStore = useSelector((state) => state.channels.value);

  const dispatch = useDispatch();

  //----states----
  const [
    { controls, invalid, required },
    { setControl, resetControls, setInvalid, validate },
  ] = useControls([
    {
      control: "name",
      value: "",
      isRequired: true,
    },
    {
      control: "code",
      value: "",
      isRequired: false,
    },
    {
      control: "phone",
      value: "",
      isRequired: true,
    },
    {
      control: "employee",
      value: "",
      isRequired: true,
    },
    {
      control: "channel",
      value: "",
      isRequired: true,
    },
    {
      control: "email",
      value: "",
      isRequired: false,
    },
    {
      control: "mediator",
      value: "",
      isRequired: false,
    },
    {
      control: "contact",
      value: "",
      isRequired: false,
    },
    {
      control: "budget",
      value: "",
      isRequired: false,
    },
    {
      control: "projects",
      value: [],
      convert: (old) => old?.join("-"),
      isRequired: true,
    },
  ]);

  //----request hooks----
  const [projectsGetRequest, projectsGetResponse] = useRequest({
    path: PROJECTS,
    method: "get",
  });

  const [employeesGetRequest, employeesGetResponse] = useRequest({
    path: EMPLOYEES,
    method: "get",
  });

  const [channelsGetRequest, channelsGetResponse] = useRequest({
    path: CHANNELS,
    method: "get",
  });

  const [clientPostRequest, clientPostResponse] = useRequest({
    path: CLIENTS,
    method: "post",
  });

  //----functions----
  const getProjects = () => {
    if (Boolean(projectsStore.results.length)) return;
    projectsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "projects/set", payload: res.data });
      },
    });
  };

  const getEmployees = () => {
    if (Boolean(employeesStore.results.length)) return;
    employeesGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "employees/set", payload: res.data });
      },
    });
  };

  const getChannels = () => {
    if (Boolean(channelsStore.results.length)) return;
    channelsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "channels/set", payload: res.data });
      },
    });
  };

  const handleSubmit = () => {
    validate().then((output) => {
      console.log(output);
      if (!output.isOk) return;
      const requestBody = filter({
        obj: {
          user: {
            first_name: controls.name.split(/(?<=^\S+)\s/)[0],
            last_name: controls.name.split(/(?<=^\S+)\s/)?.[1],
            email: controls.email,
            phone: controls.phone,
            country_code: controls.code,
            user_permissions: [],
          },
          bussiness: controls.projects,
          channel: controls.channel,
          agent: controls.employee,
          fav_contacts: controls.contact,
          max_budget: controls.budget.replace(/,/gi, ""),
        },
        output: "object",
      });
      clientPostRequest({
        body: requestBody,
        onSuccess: () => {
          resetControls();
        },
      }).then((res) => {
        let response = res?.response?.data;
        const responseBody = filter({
          obj: {
            name:
              response?.user?.first_name?.join(" ") ||
              response?.user?.last_name?.join(" "),
            email: response?.user?.email?.join(" "),
            phone: response?.user?.phone?.join(" "),
            code: response?.user?.country_code?.join(" "),
            projects: response?.bussiness?.join(" "),
            channel: response?.channel?.join(" "),
            employee: response?.agent?.join(" "),
            budget: response?.max_budget?.join(" "),
            mediator: response?.comment?.join(" "),
            contact: response?.fav_contacts?.join(" "),
          },
          output: "object",
        });

        setInvalid(responseBody);
      });
    });
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["العملاء", "إضافة عميل"]} />
      <Form
        subtitle="الرجاء ملئ المعلومات الآتية لاضافة عميل جديد"
        childrenProps={{
          saveBtn: {
            onClick: handleSubmit,
            disabled: clientPostResponse.isPending,
          },
          closeBtn: {
            onClick: resetControls,
            disabled: clientPostResponse.isPending,
          },
        }}
      >
        <InputField
          label="الإسم"
          placeholder="الإسم"
          onChange={(e) => setControl("name", e.target.value)}
          value={controls.name}
          required={required.includes("name")}
          error={Boolean(invalid.name)}
          helperText={invalid.name}
        />
        <PhoneField
          label="الهاتف"
          placeholder="الهاتف"
          requiredCode
          selectProps={{
            value: controls.code,
            onChange: (e) => {
              setControl("code", e.target.value);
            },
          }}
          onChange={(e) => setControl("phone", e.target.value)}
          value={controls.phone}
          required={required.includes("phone")}
          error={Boolean(invalid.phone)}
          helperText={invalid.phone}
        />
        <MultiSelectField
          label="المشروع"
          placeholder="المشروع"
          isPending={projectsGetResponse.isPending}
          onOpen={getProjects}
          renderValue={(selected) => {
            return selected
              ?.map(
                (id) =>
                  projectsStore.results.find((project) => project.id === id)
                    .name
              )
              ?.join(" ، ");
          }}
          onChange={(e) => {
            setControl("projects", [...e.target.value]);
          }}
          value={controls.projects}
          required={required.includes("projects")}
          error={Boolean(invalid.projects)}
          helperText={invalid.projects}
        >
          {projectsStore.results.map((project, index) => (
            <MultiSelectItem
              value={project.id}
              key={`${project.name} ${index}`}
            >
              {project.name}
            </MultiSelectItem>
          ))}
        </MultiSelectField>
        <SelectField
          label="الموظف"
          placeholder="الموظف"
          isPending={employeesGetResponse.isPending}
          onOpen={getEmployees}
          renderValue={(selected) => {
            return `${
              employeesStore.results.find(
                (employee) => employee.id === selected
              ).user.first_name
            } ${
              employeesStore.results.find(
                (employee) => employee.id === selected
              ).user.last_name
            }`;
          }}
          onChange={(e) => {
            setControl("employee", e.target.value);
          }}
          value={controls.employee}
          required={required.includes("employee")}
          error={Boolean(invalid.employee)}
          helperText={invalid.employee}
        >
          {employeesStore.results.map((employee, index) => (
            <MenuItem
              value={employee.id}
              key={`${employee.user.first_name} ${index}`}
            >{`${employee.user.first_name} ${employee.user.last_name}`}</MenuItem>
          ))}
        </SelectField>
        <SelectField
          label="القناة الإعلانية"
          placeholder="القناة الإعلانية"
          isPending={channelsGetResponse.isPending}
          onOpen={getChannels}
          renderValue={(selected) => {
            return channelsStore.results.find(
              (channel) => channel.id === selected
            ).name;
          }}
          onChange={(e) => {
            setControl("channel", e.target.value);
          }}
          value={controls.channel}
          required={required.includes("channel")}
          error={Boolean(invalid.channel)}
          helperText={invalid.channel}
        >
          {channelsStore.results.map((channel, index) => (
            <MenuItem value={channel.id} key={`${channel.name} ${index}`}>
              {channel.name}
            </MenuItem>
          ))}
        </SelectField>
        <InputField
          label="البريدالإلكتروني"
          placeholder="البريدالإلكتروني"
          onChange={(e) => {
            setControl("email", e.target.value);
          }}
          value={controls.email}
          required={required.includes("email")}
          error={Boolean(invalid.email)}
          helperText={invalid.email}
        />
        <InputField
          label="الوسيط"
          placeholder="الوسيط"
          onChange={(e) => {
            setControl("mediator", e.target.value);
          }}
          value={controls.mediator}
          required={required.includes("mediator")}
          error={Boolean(invalid.mediator)}
          helperText={invalid.mediator}
        />
        <SelectField
          label="طريقة التواصل"
          placeholder="طريقة التواصل"
          renderValue={(selected) => {
            return contactMeans.find((mean) => mean.value === selected).title;
          }}
          onChange={(e) => {
            setControl("contact", e.target.value);
          }}
          value={controls.contact}
          required={required.includes("contact")}
          error={Boolean(invalid.contact)}
          helperText={invalid.contact}
        >
          {contactMeans.map((mean, index) => (
            <MenuItem value={mean.value} key={`${mean.value} ${index}`}>
              {mean.title}
            </MenuItem>
          ))}
        </SelectField>
        <NumberField
          label="الميزانية"
          placeholder="الميزانية"
          thousandSeparator
          onChange={(e) => {
            setControl("budget", e.target.value);
          }}
          value={controls.budget}
          required={required.includes("budget")}
          error={Boolean(invalid.budget)}
          helperText={invalid.budget}
        />
      </Form>
      {clientPostResponse.successAlert}
      {clientPostResponse.failAlert}
    </Wrapper>
  );
};

export default AddClients;

const contactMeans = [
  {
    title: "الهاتف",
    value: "phone",
  },
  {
    title: "البريد الإلكتروني",
    value: "email",
  },
  {
    title: "الواتساب",
    value: "whats app",
  },
];
