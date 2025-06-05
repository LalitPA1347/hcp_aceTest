import { createSlice } from "@reduxjs/toolkit";

const customFilterInitialState = {
  filters: [],
};

const customFilterSlice = createSlice({
  name: "customFilterData",
  initialState: customFilterInitialState,
  reducers: {
    setCustomFilter: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const { setCustomFilter } = customFilterSlice.actions;
export const customFilterDataReducer = customFilterSlice.reducer;
