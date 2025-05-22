import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  ListItemText,
  Stack,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDescriptiveInsightsApi } from "../../../../services";
import { setDataForExecutionMetrics } from "../../../../redux/descriptiveInsights/executionMetricsSlice";
import { databasesMenu, handleDropdownChange } from "../../Helper";
import "./ExecutionMetricsSidebar.css"

const style = {
    selectFields: {
      width: "10vw",
      mr: "20px",
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        height: "6vh",
        "& fieldset": {
          border: "none",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        },
      },
    },
    text: {
      ml: "10px",
      fontSize: "14px",
      fontWeight: "500",
      fontFamily: "Inter, sans-serif",
      width: "14vw",
    },
    dropDown: {
      color: "white",
      fontWeight: "small",
      background: "#ffffff",
      textTransform: "capitalize",
      height: "35px",
      borderRadius: "2px",
      "&:hover": {
        background: "#ffffff",
      },
      ".MuiSvgIcon-root": {
        color: "#000000",
      },
      ".MuiTypography-root": {
        fontSize: "12px",
        fontWeight: "400",
        color: "#000000",
        fontFamily: "Inter, sans-serif",
      },
    },
    dropDownPaper: {
      ".MuiTypography-root": {
        fontSize: "12px",
        fontWeight: "400",
        color: "#000000",
        fontFamily: "Inter, sans-serif",
      },
    },
  };

const ExecutionMetricsSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const executionMetrics = useSelector(
    (store) => store.executionMetricsData.ExecutionMetrics
  );
  const [showLoader, setShowLoader] = useState(false);

  const handlePhysicianAnalyticsApi = async () => {
    const payload = {
      Analytics_Section: "Execution Metrics",
    };
    setShowLoader(true);
    const response = await fetchDescriptiveInsightsApi(payload);
    if (response) {
      dispatch(setDataForExecutionMetrics(response.data));
      setShowLoader(false);
    }
    setShowLoader(false);
  };

  useEffect(() => {
    if (executionMetrics.length === 0) {
      handlePhysicianAnalyticsApi();
    }
  }, []);

  const routeFlagName = (value) => value.toLowerCase().replace(/\s+/g, "-");

  const handleSidebar = (value) => {
    const flag = routeFlagName(value);
    navigate("/descriptiveInsights/executionMetrics/" + flag);
  };

  return (
    <Box className="physician-analytics-sidebar-box" spacing={0.5}>
      <Select
        sx={style.dropDown}
        labelId="outlined-select-database-label"
        id="outlined-select-database"
        value="Execution_Metrics"
        onChange={(event) => handleDropdownChange(event, navigate)}
        autoWidth
      >
        {databasesMenu.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            <ListItemText primary={option.label} sx={style.dropDownPaper} />
          </MenuItem>
        ))}
      </Select>
      <Box className="DI-sidebar-inner-box">
        {executionMetrics?.map((item, index) => {
          return (
            <Stack
              key={index}
              className="physician-analytics-sidebar-inner-box"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => handleSidebar(item)}
            >
              <Typography sx={style.text}>{item}</Typography>
              <Box
                className={
                  location.pathname.trim() ===
                  "/descriptiveInsights/executionMetrics/" + routeFlagName(item)
                    ? "physician-analytics-active-sideLine"
                    : "physician-analytics-sideLine"
                }
              ></Box>
            </Stack>
          );
        })}
      </Box>
      <Backdrop sx={{ zIndex: 10 }} open={showLoader}>
        <CircularProgress sx={{ color: "black" }} />
      </Backdrop>
    </Box>
  );
};

export default ExecutionMetricsSidebar