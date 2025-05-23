import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Login from "../components/auth/login/Login";
import HcpAce from "../components/DescriptiveInsights/HcpAce/HcpAce";
const MainRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route exact path="/descriptiveInsights/hcpAce" element={<HcpAce />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
