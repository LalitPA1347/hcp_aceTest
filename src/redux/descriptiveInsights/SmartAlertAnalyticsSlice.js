import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  SmartAlertAnalytics: [],
  ModuleColumns: {},
  DropDownValues: {},
};

const smartAlertAnalyticsDataSlice = createSlice({
  name: "smartAlertAnalyticsData",
  initialState,
  reducers: {
    setDataForSmartAlertAnalytics: (state, action) => {
      state.SmartAlertAnalytics = action.payload.Modules_names;
      state.ModuleColumns = action.payload.Module_Columns;
      state.DropDownValues = action.payload.DropDown_Values;
    },
  },
});

// Initial state for physician analytics chart data
const initialSmartAlertAnalyticsChartState = {
  data: {},
};

// Slice for physician analytics chart data
const smartAlertAnalyticsChartSlice = createSlice({
  name: "smartAlertAnalyticsChart",
  initialState: initialSmartAlertAnalyticsChartState,
  reducers: {
    setSmartAlertAnalyticsChartData: (state, action) => {
      state.data = action.payload;
    },
  },
});

const initialSmartAlertAnalyticsReports = {
  reports: {},
};

const smartAlertAnalyticsReportsSlice = createSlice({
  name: "smartAlertAnalyticsReports",
  initialState: initialSmartAlertAnalyticsReports,
  reducers: {
    setSmartAlertAnalyticsReports: (state, action) => {
      state.reports = action.payload;
    },
  },
});

const initialBaseLot = {
  baseLot: null,
};

const baseLotSlice = createSlice({
  name: "baseLot",
  initialState: initialBaseLot,
  reducers: {
    setbaseLot: (state,action) => {
      state.baseLot = action.payload;
    },
  },
});

// Export actions
export const { setDataForSmartAlertAnalytics } =
  smartAlertAnalyticsDataSlice.actions;
export const { setSmartAlertAnalyticsChartData } =
  smartAlertAnalyticsChartSlice.actions;
export const { setSmartAlertAnalyticsReports } =
  smartAlertAnalyticsReportsSlice.actions;
export const { setbaseLot } = baseLotSlice.actions;

// Export reducers
export const smartAlertAnalyticsDataReducer =
  smartAlertAnalyticsDataSlice.reducer;
export const smartAlertAnalyticsChartReducer =
  smartAlertAnalyticsChartSlice.reducer;
export const smartAlertAnalyticsReportsReducer =
  smartAlertAnalyticsReportsSlice.reducer;
export const baseLotReducer = baseLotSlice.reducer;
