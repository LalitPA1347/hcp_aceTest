import { configureStore } from "@reduxjs/toolkit";
import indicationDropdownReducer from "./indicationDropdownSlice";
import isChartDataReducer from "./chartDataSlice";
import tableReducer from "./descriptiveInsights/tableSlice";
// import isSelectedValuesReducer from "./selectedValuesSlice";
import {
  physicianAnalyticsDataReducer,
  physicianAnalyticsChartReducer,
  physicianAnalyticsReportsReducer,
} from "./descriptiveInsights/physicianAnalyticsSlice";
import {
  patientAnalyticsDataReducer,
  patientAnalyticsChartReducer,
  patientAnalyticsReportsReducer,
} from "./descriptiveInsights/patientAnalyticsSlice";
import {
  smartAlertAnalyticsDataReducer,
  smartAlertAnalyticsChartReducer,
  smartAlertAnalyticsReportsReducer,
  baseLotReducer,
} from "./descriptiveInsights/SmartAlertAnalyticsSlice";
import {
  executionMetricsDataReducer,
  executionMetricsChartReducer,
  executionMetricsReportsReducer,
} from "./descriptiveInsights/executionMetricsSlice";
import { reportsStaleReducer } from "./descriptiveInsights/reportsSlice";
import {
  adhocsResultsReducer,
  savedAdhocsReducer,
  selectedAdhocsReducer,
} from "./descriptiveInsights/AdhocsSlice";
import { dragDataReducer } from "./descriptiveInsights/hcpaceSlice";
import { customFilterDataReducer } from "./descriptiveInsights/customFilterSlice";

const store = configureStore({
  reducer: {
    indicationDropdowns: indicationDropdownReducer,
    isChartData: isChartDataReducer,
    // isSelectedValues: isSelectedValuesReducer,
    physicianAnalyticsData: physicianAnalyticsDataReducer,
    physicianAnalyticsChart: physicianAnalyticsChartReducer,
    patientAnalyticsData: patientAnalyticsDataReducer,
    patientAnalyticsChart: patientAnalyticsChartReducer,
    smartAlertAnalyticsData: smartAlertAnalyticsDataReducer,
    smartAlertAnalyticsChart: smartAlertAnalyticsChartReducer,
    patientAnalyticsReports: patientAnalyticsReportsReducer,
    physicianAnalyticsReports: physicianAnalyticsReportsReducer,
    smartAlertAnalyticsReports: smartAlertAnalyticsReportsReducer,
    executionMetricsReports: executionMetricsReportsReducer,
    executionMetricsData: executionMetricsDataReducer,
    executionMetricsChart: executionMetricsChartReducer,
    reportsStale: reportsStaleReducer,
    savedAdhocs: savedAdhocsReducer,
    adhocsResults: adhocsResultsReducer,
    selectedAdhocsReports: selectedAdhocsReducer,
    baseLot: baseLotReducer,
    dragData: dragDataReducer,
    table: tableReducer,
    customFilterData: customFilterDataReducer,
  },
});

export default store;