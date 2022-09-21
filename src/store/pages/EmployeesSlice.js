import { createSlice } from "@reduxjs/toolkit";

export const EmployeesSlice = createSlice({
  name: "employees",
  initialState: {
    value: {
      count: 0,
      next: null,
      previous: null,
      results: [],
    },
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
    reset: (state) => {
      state.value = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    },
    deleteItem: (state, action) => {
      state.value.results = state.value.results.filter(
        (item) => item.id !== action.payload.id
      );
      state.value.count = state.value.count - 1;
    },
    addItem: (state, action) => {
      state.value.results = [action.payload, ...state.value.results];
    },
    putItem: (state, action) => {
      const index = state.value.results.findIndex(
        (item) => item.id === action.payload.id
      );
      state.value.results.splice(index, 1, action.payload.item);
    },
    patchItem: (state, action) => {
      const index = state.value.results.findIndex(
        (item) => item.id === action.payload.id
      );
      state.value.results.splice(index, 1, {
        ...state.value.results[index],
        ...action.payload.item,
      });
    },
  },
});

export default EmployeesSlice.reducer;
