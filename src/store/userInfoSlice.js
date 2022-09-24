import { createSlice } from "@reduxjs/toolkit";

export const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    value: {
      token: localStorage.getItem("token") ?? "",
      id: null,
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      is_importing: false,
      country_code: "",
      phone: "",
      image: "",
      organization: {
        id: null,
        name: "",
      },
      job_title: "",
      user_permissions: [],
    },
  },
  reducers: {
    setToken: (state, action) => {
      state.value.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setUserInfo: (state, action) => {
      state.value = { token: state.value.token, ...action.payload };
    },
    logout: (state) => {
      state.value.token = "";
      localStorage.removeItem("token");
    },
  },
});

export default userInfo.reducer;
