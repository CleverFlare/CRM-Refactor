import { createSlice } from "@reduxjs/toolkit";

export const allPermissionsSlice = createSlice({
  name: "allPermissions",
  initialState: {
    value: {
      isPending: false,
      allPermissions: [],
    },
  },
  reducers: {
    togglePending: (state, action) => {
      switch (Boolean(action.payload)) {
        case true:
          state.isPending = action.payload;
          break;
        case false:
          state.isPending = !state.isPending;
          break;
      }
    },
    setPermissions: (state, action) => {
      state.allPermissions = action.payload;
    },
  },
});

export default allPermissionsSlice.reducer;
