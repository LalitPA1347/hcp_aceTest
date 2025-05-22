import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PatientAnalytics: [],
  ModuleColumns: {},
  DropDownValues: {},
};

const patientAnalyticsDataSlice = createSlice({
  name: "patientAnalyticsData",
  initialState,
  reducers: {
    setDataForPatientAnalytics: (state, action) => {
      state.PatientAnalytics = action.payload.Modules_names;
      state.ModuleColumns = action.payload.Module_Columns;
      state.DropDownValues = action.payload.DropDown_Values;
    },
  },
});

// Initial state for physician analytics chart data
const initialPatientAnalyticsChartState = {
  data: {},
};

// Slice for physician analytics chart data
const patientAnalyticsChartSlice = createSlice({
  name: "patientAnalyticsChart",
  initialState: initialPatientAnalyticsChartState,
  reducers: {
    setPatientAnalyticsChartData: (state, action) => {
      state.data = action.payload;
    },
  },
});

const initialPatientAnalyticsReports = {
  reports: {},
};

const patientAnalyticsReportsSlice = createSlice({
  name: "patientAnalyticsReports",
  initialState: initialPatientAnalyticsReports,
  reducers: {
    setPatientAnalyticsReports: (state, action) => {
      state.reports = action.payload;
    },
  },
});

// Export actions
export const { setDataForPatientAnalytics } = patientAnalyticsDataSlice.actions;
export const { setPatientAnalyticsChartData } =
  patientAnalyticsChartSlice.actions;
export const { setPatientAnalyticsReports} =
  patientAnalyticsReportsSlice.actions;

// Export reducers
export const patientAnalyticsDataReducer = patientAnalyticsDataSlice.reducer;
export const patientAnalyticsChartReducer = patientAnalyticsChartSlice.reducer;
export const patientAnalyticsReportsReducer =
  patientAnalyticsReportsSlice.reducer;
