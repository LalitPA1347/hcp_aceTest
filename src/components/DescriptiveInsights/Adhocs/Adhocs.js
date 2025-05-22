import { Stack } from "@mui/material";
import React from "react";
import Header from "../../Header/Header";
import AdhocsSidebar from "./AdhocsSidebar/AdhocsSidebar";

const Adhocs = () => {
  return (
    <Stack sx={{ background: "#F5F7FA" }}>
      <Header />
      <AdhocsSidebar />
    </Stack>
  );
};

export default Adhocs;
