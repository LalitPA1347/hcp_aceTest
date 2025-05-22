import React from "react";
import { Stack } from "@mui/material";
import Header from "../../Header/Header";
import SmartAlertAnalyticsSidebar from "./SmartAlertAnalyticsSidebar/SmartAlertAnalyticsSidebar";
import SmartAlertAnalyticsIndication from "./SmartAlertAnalyticsIndication/SmartAlertAnalyticsIndication";
import SmartAlertAnalyticsGraph from "./SmartAlertAnalyticsGraph/SmartAlertAnalyticsGraph";
import ReportsSection from "../ReportsSection";

const SmartAlertAnalytics = () => {
  
  return (
    <Stack sx={{ background: "#F5F7FA" }}>
      <Header />
      <SmartAlertAnalyticsSidebar />
      <SmartAlertAnalyticsIndication />
      <SmartAlertAnalyticsGraph />
      <ReportsSection />
    </Stack>
  );
};

export default SmartAlertAnalytics;
