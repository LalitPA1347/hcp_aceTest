import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import "./SegmentationPanel.css";

const SegmentationPanel = ({
  open,
  handleSavedFlowChart,
  customerFilterOpen,
  FlowChartOpen,
}) => {
  return (
    <>
      {/* Toggle Button */}
      <button
        className={`sfc-toggle1 ${
          open
            ? "open"
            : customerFilterOpen || FlowChartOpen
            ? "custom-filter-open"
            : ""
        }`}
        onClick={handleSavedFlowChart}
        aria-label="Segmentation"
      >
        <span
          style={{
            display: "inline-block",
            transform: "rotate(90deg)",
            transformOrigin: "center",
            transition: "transform 0.2s ease",
          }}
        >
          Segmentation
        </span>
      </button>

      {/* Panel */}
      <div className={`sfc-panel ${open ? "open" : ""}`}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            height: "100%",
            gap: "25px",
            marginTop: "25px",
          }}
        >
          <Stack
            sx={{
              borderRadius: "8px",
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "16px",
              background: "#F9F9F9",
              height: "40%",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Segmentation Filter
            </Typography>
          </Stack>

          <Stack
            sx={{
              borderRadius: "8px",
              border: "1px solid #ccc",
              padding: "12px",
              background: "#F9F9F9",
              height: "40%",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Target File
            </Typography>
          </Stack>
        </Box>
      </div>
    </>
  );
};

export default SegmentationPanel;