// const baseUrl = "http://paclaimstoolbackend.us-east-2.elasticbeanstalk.com"
// const baseUrl =
//   "http://paclaimstoolbackendcommon.us-east-2.elasticbeanstalk.com";
// const baseUrl = "https://api.patientace.pharmaace.ai";
const baseUrl = "http://localhost:8000"
export const API_URL = {
  // login: `${process.env.BASE_URL}/users/login`,
  BaseURL: baseUrl,
  firstPageData: `${baseUrl}/FirstPageData`,
  addProductCode: `${baseUrl}/AllData`,
  login: `${baseUrl}/login`,
  descriptiveInsights: `${baseUrl}/DI_Starting_Page_SideBar`,
  selectedDropdownData: `${baseUrl}/DropDown_Filter_Values`,
  graphData: `${baseUrl}/DOT_Graph`,
  segmentationProcess: `${baseUrl}/segmentationStartProcess`,
  updateProgressionRule: `${baseUrl}/segmentationProgressionRuleValues`,
  startProcess: `${baseUrl}/PreviewData`,
  segmentationFirstPage: `${baseUrl}/segmentation_first_page`,
  refreshToken: `${baseUrl}/auth/refreshtoken`,
  getIndver: `${baseUrl}/get-indver`,
  defaultChange: `${baseUrl}/default-change`,
  descriptiveInsightsFetchData: `${baseUrl}/pa-analytics-filter-values`,
  descriptiveInsightsPhysicianAnalyticsGraph: `${baseUrl}/di-analytics-module-data`,
  saveReportApi: `${baseUrl}/report-save`,
  deleteReportApi: `${baseUrl}/report-delete`,
  fetchReportsApi: `${baseUrl}/report-fetch`,
  adhocsResultApi: `${baseUrl}/di-analytics-adhoc-module-data`,
  getSavedAdhocs: `${baseUrl}/fetch-savedadhocs`,
  deleteAdhocs: `${baseUrl}/delete-adhoc`,
  kpiFilterCount: `${baseUrl}/Kpi_filter_count`,
  hcpOutputDataApi: `${baseUrl}/output-data`,
};
