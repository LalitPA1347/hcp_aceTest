import React from "react";
import { Stack } from "@mui/material";
import Header from "../../Header/Header";
import ExecutionMetricsSidebar from "./ExecutionMetricsSidebar/ExecutionMetricsSidebar";
import ExecutionMetricsIndication from "./ExecutionMetricsIndication/ExecutionMetricsIndication";
import ExecutionMetricsGraph from "./ExecutionMetricsGraph/ExecutionMetricsGraph";
import ReportsSection from "../ReportsSection";

const ExecutionMetrics = () => {
  return (
    <Stack sx={{ background: "#F5F7FA" }}>
      <Header />
      <ExecutionMetricsSidebar />
      <ExecutionMetricsIndication />
      <ExecutionMetricsGraph/>
      <ReportsSection/>
    </Stack>
  );
};

export default ExecutionMetrics;
