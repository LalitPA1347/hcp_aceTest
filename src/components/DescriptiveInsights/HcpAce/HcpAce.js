import React, { useState } from "react";
import { Drawer, IconButton, Box, Stack } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import MainContent from "./components/MainContent/MainContent";
import "./HcpAce.css";
import SidePanel from "./components/MainContent/SidePanel/SidePanel";
import TuneIcon from "@mui/icons-material/Tune";

const drawerWidth = "17.45%";

const HcpAce = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  return (
    <div className="hcpace-wrapper">
      <Header title="Descriptive Insights" />

      <div className="hcpace-body">
        {/* Drawer */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            width: sidebarOpen ? drawerWidth : 0, 
            flexShrink: 0,
            transition: "right 0.3s ease-in-out",
            "& .MuiDrawer-paper": {
              width: sidebarOpen ? drawerWidth : 0,
              boxSizing: "border-box",

              transition: "right 0.3s ease-in-out",
              marginTop: "4.7%",
              overflow: "visible",
            },
          }}
        >
          <Stack
            sx={{ display: "flex", flexDirection: "column", overflow: "auto" }}
          >
            <Sidebar style={{ display: sidebarOpen ? "block" : "none" }} />

            {sidebarOpen && (
              <Box
                sx={{
                  position: "absolute",
                  width: "40px",
                  height: "53px",
                  top: "50px",
                  left: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopRightRadius: "8px",
                  borderBottomRightRadius: "8px",
                  zIndex: "1300",
                  backgroundColor: "#EBF2FF",
                  display: "flex",

                  boxShadow: "0px 2px 4px 0px #0000001A",
                }}
              >
                <IconButton size="large" onClick={() => setSidebarOpen(false)}>
                  <ChevronLeftIcon
                    sx={{ color: "#001A50", fontSize: "36px", padding: "0px" }}
                  />
                </IconButton>
              </Box>
            )}
          </Stack>
        </Drawer>

        {/* Toggle to open when drawer is closed */}
        {!sidebarOpen && (
          <Box
            sx={{
              position: "absolute",
              width: "40px",
              height: "53px",
              top: "140px",
              left: 0,
              alignItems: "center",
              justifyContent: "center",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              zIndex: 1301,
              backgroundColor: "#EBF2FF",
              display: "flex",

              boxShadow: "0px 2px 4px 0px #0000001A",
            }}
          >
            <IconButton size="large" onClick={() => setSidebarOpen(true)}>
              <TuneIcon
                sx={{ color: "#001A50", fontSize: "36px", padding: "0px" }}
              />
            </IconButton>
          </Box>
        )}

        {/* Main Content */}
        {/* <MainContent /> */}
        <SidePanel open={sidePanelOpen} setOpen={setSidePanelOpen} />
        <Box
          sx={{
            flexGrow: 1,
            transition: "margin 0.3s ease-in-out, width 0.3s ease-in-out",
            marginRight: sidePanelOpen ? "17.5%" : 0, 
            overflow: "auto",
          }}
        >
          <MainContent />
        </Box>
      </div>
    </div>
  );
};

export default HcpAce;
