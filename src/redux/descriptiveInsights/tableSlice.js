import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hcpAceApiData: {},
  columns: [],
  rows: [],
  loader: "false",
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setRows: (state, action) => {
      state.rows = action.payload;
    },
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    sethcpAceApiData: (state, action) => {
      state.hcpAceApiData = action.payload;
    },
    sethcpLoader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

export const { setRows, setColumns, sethcpAceApiData, sethcpLoader } =
  tableSlice.actions;
export default tableSlice.reducer;
