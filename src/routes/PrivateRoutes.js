import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const auth = localStorage.getItem("auth_token");
  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
