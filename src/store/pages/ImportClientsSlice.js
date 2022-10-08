import { createSlice } from "@reduxjs/toolkit";

export const ImportClientSlice = createSlice({
  name: "importClients",
  initialState: {
    value: [],
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
    reset: (state) => {
      state.value = [];
    },
  },
});

export default ImportClientSlice.reducer;
