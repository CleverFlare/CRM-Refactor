import { createSlice } from "@reduxjs/toolkit";

export const allPermissionsSlice = createSlice({
  name: "allPermissions",
  initialState: {
    value: [],
  },
  reducers: {
    set: (state, action) => {
      state.value = [...action.payload];
    },
  },
});

export default allPermissionsSlice.reducer;
