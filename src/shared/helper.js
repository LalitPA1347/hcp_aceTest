import {
  setPatientAnalyticsChartData,
  setPatientAnalyticsReports,
} from "../redux/descriptiveInsights/patientAnalyticsSlice";
import {
  setPhysicianAnalyticsReports,
  setPhysicianAnalyticsChartData,
} from "../redux/descriptiveInsights/physicianAnalyticsSlice";
import {
  resetPatientAnalyticsReportStale,
  resetPhysicianAnalyticsReportStale,
  resetSmartAlertAnalyticsReportStale,
  resetExecutionMatricsReportStale,
  setIsPatientAnalyticsReportStale,
  setIsPhysicianAnalyticsReportStale,
  setIsSmartAlertAnalyticsReportStale,
  setIsExecutionMatricsReportStale,
} from "../redux/descriptiveInsights/reportsSlice";
import {
  setSmartAlertAnalyticsChartData,
  setSmartAlertAnalyticsReports,
} from "../redux/descriptiveInsights/SmartAlertAnalyticsSlice";
import {
  setExecutionMetricsChartData,
  setExecutionMetricsReports,
} from "../redux/descriptiveInsights/executionMetricsSlice";

export const analyticsConfig = {
  patientAnalytics: {
    setReportsAction: setPatientAnalyticsReports,
    setChartDataAction: setPatientAnalyticsChartData,
    resetStaleAction: resetPatientAnalyticsReportStale,
    setStaleReportsAction: setIsPatientAnalyticsReportStale,
  },
  physicianAnalytics: {
    setReportsAction: setPhysicianAnalyticsReports,
    setChartDataAction: setPhysicianAnalyticsChartData,
    resetStaleAction: resetPhysicianAnalyticsReportStale,
    setStaleReportsAction: setIsPhysicianAnalyticsReportStale,
  },
  smartAlertAnalytics: {
    setReportsAction: setSmartAlertAnalyticsReports,
    setChartDataAction: setSmartAlertAnalyticsChartData,
    resetStaleAction: resetSmartAlertAnalyticsReportStale,
    setStaleReportsAction: setIsSmartAlertAnalyticsReportStale,
  },
  executionMetrics: {
    setReportsAction: setExecutionMetricsReports,
    setChartDataAction: setExecutionMetricsChartData,
    resetStaleAction: resetExecutionMatricsReportStale,
    setStaleReportsAction: setIsExecutionMatricsReportStale,
  },
};

export const tabsConfig = [
  {
    label: "Output",
    dropdown: true,
    download: true,
  },
  {
    label: "Deciling",
    dropdown: true,
    download: true,
    kpiFilter: true,
  },
  // {
  //   label: "Segmentation & Target",
  //   dropdown: true,
  //   download: true,
  //   kpiFilter: true,
  // },
  // Add more tabs as needed...
];