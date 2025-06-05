import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ExecutionMetrics: [],
  ModuleColumns: {},
  DropDownValues: {},
};

const executionMetricsDataSlice = createSlice({
  name: "executionMetricsData",
  initialState,
  reducers: {
    setDataForExecutionMetrics: (state, action) => {
      state.ExecutionMetrics = action.payload.Modules_names;
      state.ModuleColumns = action.payload.Module_Columns;
      state.DropDownValues = action.payload.DropDown_Values;
    },
  },
});

// Initial state for physician analytics chart data
const initialExecutionMetricsChartState = {
  data: {},
};

// Slice for physician analytics chart data
const executionMetricsChartSlice = createSlice({
  name: "executionMetricsChart",
  initialState: initialExecutionMetricsChartState,
  reducers: {
    setExecutionMetricsChartData: (state, action) => {
      state.data = action.payload;
    },
  },
});

const initialExecutionMetricsReports = {
  reports: {},
};

const executionMetricsReportsSlice = createSlice({
  name: "executionMetricsReports",
  initialState: initialExecutionMetricsReports,
  reducers: {
    setExecutionMetricsReports: (state, action) => {
      state.reports = action.payload;
    },
  },
});

// Export actions
export const { setDataForExecutionMetrics } = executionMetricsDataSlice.actions;
export const { setExecutionMetricsChartData } =
  executionMetricsChartSlice.actions;
export const { setExecutionMetricsReports } =
  executionMetricsReportsSlice.actions;

// Export reducers
export const executionMetricsDataReducer = executionMetricsDataSlice.reducer;
export const executionMetricsChartReducer = executionMetricsChartSlice.reducer;
export const executionMetricsReportsReducer =
  executionMetricsReportsSlice.reducer;
