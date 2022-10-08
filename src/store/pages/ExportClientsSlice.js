import { createSlice } from "@reduxjs/toolkit";

export const ExportClientsSlice = createSlice({
  name: "exportClients",
  initialState: {
    value: {
      fileProgress: null,
    },
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
    setProgress: (state, action) => {
      state.value.fileProgress = action.payload;
    },
    reset: (state) => {
      state.value = {
        fileProgress: null,
      };
    },
  },
});

export default ExportClientsSlice.reducer;
