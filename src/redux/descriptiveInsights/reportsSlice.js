import { createSlice } from "@reduxjs/toolkit";

const reportsStaleState = {
  patientAnalyticsReportsStale: false,
  physicianAnalyticsReportsStale:false,
  smartAlertAnalyticsReportsStale:false,
  executionMetricsReportsStale:false,
  duplicateReportName:""
};

const reportsStaleSlice = createSlice({
  name: "reportsStale",
  initialState: reportsStaleState,
  reducers: {
    setIsPatientAnalyticsReportStale: (state) => {
      state.patientAnalyticsReportsStale = true;
    },
    resetPatientAnalyticsReportStale: (state) => {
      state.patientAnalyticsReportsStale = false;
    },

    setIsPhysicianAnalyticsReportStale: (state) => {
      state.physicianAnalyticsReportsStale = true;
    },
    resetPhysicianAnalyticsReportStale: (state) => {
      state.physicianAnalyticsReportsStale = false;
    },

    setIsSmartAlertAnalyticsReportStale: (state) => {
      state.smartAlertAnalyticsReportsStale = true;
    },
    resetSmartAlertAnalyticsReportStale: (state) => {
      state.smartAlertAnalyticsReportsStale = false;
    },

    setIsExecutionMatricsReportStale: (state) => {
      state.executionMetricsReportsStale = true;
    },
    resetExecutionMatricsReportStale: (state) => {
      state.executionMetricsReportsStale = false;
    },

    setIsDuplicateReport: (state,action) => {
      state.duplicateReportName = action.payload;
    },
    resetIsDuplicateReport: (state) => {
      state.duplicateReportName = "";
    },
  },
});

export const {
  setIsPatientAnalyticsReportStale,
  resetPatientAnalyticsReportStale,
  setIsPhysicianAnalyticsReportStale,
  resetPhysicianAnalyticsReportStale,
  setIsSmartAlertAnalyticsReportStale,
  resetSmartAlertAnalyticsReportStale,
  setIsExecutionMatricsReportStale,
  resetExecutionMatricsReportStale,
  setIsDuplicateReport,
  resetIsDuplicateReport,
} = reportsStaleSlice.actions;
export const reportsStaleReducer = reportsStaleSlice.reducer;
