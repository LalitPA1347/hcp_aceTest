import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PatientAnalytics: [],
  ModuleColumns: {},
  DropDownValues: {},
};

const physicianAnalyticsDataSlice = createSlice({
  name: "physicianAnalyticsData",
  initialState,
  reducers: {
    setDataForPhysicianAnalytics: (state, action) => {
      state.PatientAnalytics = action.payload.Modules_names;
      state.ModuleColumns = action.payload.Module_Columns;
      state.DropDownValues = action.payload.DropDown_Values;
    },
  },
});

// Initial state for physician analytics chart data
const initialPhysicianAnalyticsChartState = {
  data: {},
};

// Slice for physician analytics chart data
const physicianAnalyticsChartSlice = createSlice({
  name: "physicianAnalyticsChart",
  initialState: initialPhysicianAnalyticsChartState,
  reducers: {
    setPhysicianAnalyticsChartData: (state, action) => {
      state.data = action.payload;
    },
  },
});

const initialPhysicianAnalyticsReports = {
  reports: {},
};

const physicianAnalyticsReportsSlice = createSlice({
  name: "physicianAnalyticsReports",
  initialState: initialPhysicianAnalyticsReports,
  reducers: {
    setPhysicianAnalyticsReports: (state, action) => {
      state.reports = action.payload;
    },
  },
});

// Export actions
export const { setDataForPhysicianAnalytics } =
  physicianAnalyticsDataSlice.actions;
export const { setPhysicianAnalyticsChartData } =
  physicianAnalyticsChartSlice.actions;
export const { setPhysicianAnalyticsReports } =
  physicianAnalyticsReportsSlice.actions;

// Export reducers
export const physicianAnalyticsDataReducer =
  physicianAnalyticsDataSlice.reducer;
export const physicianAnalyticsChartReducer =
  physicianAnalyticsChartSlice.reducer;
export const physicianAnalyticsReportsReducer =
  physicianAnalyticsReportsSlice.reducer;
