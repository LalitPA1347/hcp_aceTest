import React, { useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import DeleteRule from "../../../../../../assets/images/DeleteRule.svg";
import {
  savedFlowChartDataApi,
  deleteFlowChartDataApi,
} from "../../../../../../services/DescriptiveInsights/hcpace.service";
import { useDispatch, useSelector } from "react-redux";
import "./SavedFlowChart.css";
import { setFlowChartData } from "../../../../../../redux/descriptiveInsights/hcpaceSlice";

const SavedFlowChart = ({ open, handleSavedFlowChart, customerFilterOpen }) => {
  const dispatch = useDispatch();
  const savedFlowChartData = useSelector(
    (state) => state.dragData.savedFlowChartData
  );

  const fetchSavedFlowChartData = async () => {
    const response = await savedFlowChartDataApi();
    if (response?.status === 200) {
      dispatch(setFlowChartData(response?.data?.flowcharts || []));
    } else {
      console.error("Error fetching saved custom filters:", response);
    }
  };

  useEffect(() => {
    fetchSavedFlowChartData();
  }, []);

  const handleDeleteFlowChartData = async (flowChartData) => {
    const payload = {
      FlowChartName: flowChartData.FlowChartName,
    };
    const response = await deleteFlowChartDataApi(payload);
    if (response?.status === 200) {
      const deepCopy = JSON.parse(JSON.stringify(savedFlowChartData)).filter(
        (item) => item.FlowChartName !== payload.FlowChartName
      );
      dispatch(setFlowChartData(deepCopy));
    } else {
      console.error("Error deleting custom filter:", response);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`sfc-toggle ${
          open ? "open" : customerFilterOpen ? "custom-filter-open" : ""
        }`}
        onClick={handleSavedFlowChart}
        aria-label={open ? "Saved Flow Chart" : "Saved Flow Chart"}
      >
        <span
          style={{
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "rotate(90deg)",
            transformOrigin: "center",
            transition: "transform 0.2s ease",
          }}
        >
          {open ? "Saved Flow Chart" : "Saved Flow Chart"}
        </span>
      </button>
      {/* Panel */}
      <div className={`sfc-panel ${open ? "open" : ""}`}>
        <div className="sp-search">
          <label htmlFor="custom-search">Saved FLow Chart</label>
          <input
            id="custom-search"
            type="text"
            placeholder="Search..."
            // value={searchQuery}
            // onChange={handleSearchChange}
          />
        </div>
        <Box sx={{ m: "20px" }}>
          {savedFlowChartData.map((item) => (
            <Stack
              key={item.FlowChartName}
              alignItems="center"
              direction="rows"
              justifyContent="space-between"
              sx={{
                height: "46px",
                borderRadius: "5px",
                background: "#F3F5F6",
                p: "0 10px",
                mb: "10px",
                cursor: "pointer",
              }}
            >
              <Typography
                noWrap
                sx={{ color: "#444", fontSize: "0.95rem", letterSpacing: "0%" }}
              >
                {item.FlowChartName}
              </Typography>

              <Stack key={item.QueryName} alignItems="center" direction="rows">
                <img
                  src={DeleteRule}
                  alt="Delete Rule"
                  style={{
                    marginLeft: "5px",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteFlowChartData(item)}
                />
              </Stack>
            </Stack>
          ))}
        </Box>
      </div>
    </>
  );
};

export default SavedFlowChart;
