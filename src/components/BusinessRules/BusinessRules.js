import React from "react";
import Header from "../Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import IndicationUi from "./IndicationUi/IndicationUi";
import { Outlet } from "react-router-dom";
import "./BusinessRules.css";

const BusinessRules = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <IndicationUi />
      <Outlet />
    </>
  );
};

export default BusinessRules;
