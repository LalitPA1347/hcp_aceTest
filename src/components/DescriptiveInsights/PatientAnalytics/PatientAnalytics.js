import React, { useState } from "react";
import { Stack } from "@mui/material";
import Header from "../../Header/Header";
import PatientAnalyticsSidebar from "./PatientAnalyticsSidebar/PatientAnalyticsSidebar";
import PatientAnalyticsIndication from "./PatientAnalyticsIndication/PatientAnalyticsIndication";
import PatientAnalyticsGraph from "./PatientAnalyticsGraph/PatientAnalyticsGraph";
import ReportsSection from "../ReportsSection";
import { useParams } from "react-router-dom";
import Adhocs from "./Adhocs/Adhocs";

const PatientAnalytics = () => {
  const { flag } = useParams();

  return (
    <>
      <Stack sx={{ background: "#F5F7FA" }}>
        <Header />
        <PatientAnalyticsSidebar />
        {flag !== "adhocs" ? (
          <>
            <PatientAnalyticsIndication />
            <PatientAnalyticsGraph />
            <ReportsSection />
          </>
        ) : (
          <Adhocs />
        )}
      </Stack>
    </>
  );
};

export default PatientAnalytics;
