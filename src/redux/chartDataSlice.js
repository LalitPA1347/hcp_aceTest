import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  versionData: { selectedVersion: "", selectedIndication: "" },
};
const chartDataSlice = createSlice({
  name: "isChartData",
  initialState,
  reducers: {
    setVersionValue: (state, action) => {
      state.versionData = action.payload;
    },
  },
});

export const { setIsChartData, resetIsChartData, setVersionValue } =
  chartDataSlice.actions;
export default chartDataSlice.reducer;
