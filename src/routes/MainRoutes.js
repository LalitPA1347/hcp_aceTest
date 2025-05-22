import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Login from "../components/auth/login/Login";
// import PhysicianAnalytics from "../components/DescriptiveInsights/PhysicianAnalytics/PhysicianAnalytics";
// import PatientAnalytics from "../components/DescriptiveInsights/PatientAnalytics/PatientAnalytics";
// import SmartAlertAnalytics from "../components/DescriptiveInsights/SmartAlertAnalytics/SmartAlertAnalytics";
// import ExecutionMetrics from "../components/DescriptiveInsights/ExecutionMetrics/ExecutionMetrics";
// import Adhocs from "../components/DescriptiveInsights/Adhocs/Adhocs";
import HcpAce from "../components/DescriptiveInsights/HcpAce/HcpAce";
const MainRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        {/* <Route
          exact
          path="/descriptiveInsights/patientAnalytics/:flag"
          element={<PatientAnalytics />}
        /> */}
        {/* <Route
          exact
          path="/descriptiveInsights/physicianAnalytics/:flag"
          element={<PhysicianAnalytics />}
        /> */}
        {/* <Route
          exact
          path="/descriptiveInsights/smartAlertAnalytics/:flag"
          element={<SmartAlertAnalytics />}
        /> */}
        {/* <Route
          exact
          path="/descriptiveInsights/executionMetrics/:flag"
          element={<ExecutionMetrics />}
        /> */}

        {/* <Route exact path="/descriptiveInsights/adhocs" element={<Adhocs />} /> */}
        <Route exact path="/descriptiveInsights/hcpAce" element={<HcpAce />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
