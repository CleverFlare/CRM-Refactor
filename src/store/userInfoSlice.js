import { createSlice } from "@reduxjs/toolkit";

export const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    value: JSON.parse(localStorage.getItem("userInfo")) ?? {
      token: "",
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
      localStorage.setItem("userInfo", JSON.stringify(state.value));
    },
    setUserInfo: (state, action) => {
      state.value = { token: state.value.token, ...action.payload };
      localStorage.setItem("userInfo", JSON.stringify(state.value));
    },
    logout: (state) => {
      state.value.token = "";
      localStorage.removeItem("userInfo");
    },
  },
});

export default userInfo.reducer;
