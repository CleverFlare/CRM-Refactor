import { createSlice } from "@reduxjs/toolkit";

export const OverviewSlice = createSlice({
  name: "overview",
  initialState: {
    value: {
      clients: {
        all: 0,
        new_clients: 0,
        postponed_clients: 0,
        percent_new_clients: 0,
      },
      employees: {
        all: 0,
        new_employees: 0,
        best_employees: [],
      },
    },
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default OverviewSlice.reducer;
