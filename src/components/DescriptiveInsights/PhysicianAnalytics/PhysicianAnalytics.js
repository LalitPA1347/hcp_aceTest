import React from "react";
import Header from "../../Header/Header";
import PhysicianAnalyticsSidebar from "./PhysicianAnalyticsSidebar/PhysicianAnalyticsSidebar";
import PhysicianAnalyticsIndication from "./PhysicianAnalyticsIndication/PhysicianAnalyticsIndication";
import { Stack } from "@mui/material";
import PhysicianAnalyticsGraph from "./PhysicianAnalyticsGraph/PhysicianAnalyticsGraph";
import ReportsSection from "../ReportsSection";

const PhysicianAnalytics = () => {
  return (
    <Stack sx={{ background: "#F5F7FA" }}>
      <Header />
      <PhysicianAnalyticsSidebar />
      <PhysicianAnalyticsIndication />
      <PhysicianAnalyticsGraph />
      <ReportsSection />
    </Stack>
  );
};

export default PhysicianAnalytics;
