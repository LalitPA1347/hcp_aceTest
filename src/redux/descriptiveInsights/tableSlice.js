import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hcpAceApiData: {},
  outputTabData: { columns: [], rows: [] },
  decilingData: [],
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
    setOutputTabData: (state, action) => {
      state.outputTabData = action.payload;
    },
    sethcpAceApiData: (state, action) => {
      state.hcpAceApiData = action.payload;
    },
    setDecilingData: (state, action) => {
      state.decilingData = action.payload;
    },
    sethcpLoader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

export const {
  setRows,
  setColumns,
  setOutputTabData,
  sethcpAceApiData,
  setDecilingData,
  sethcpLoader,
} = tableSlice.actions;
export default tableSlice.reducer;
