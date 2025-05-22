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
  Tooltip,
  IconButton,
  Drawer,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDescriptiveInsightsApi } from "../../../../services";
import { setDataForPhysicianAnalytics } from "../../../../redux/descriptiveInsights/physicianAnalyticsSlice";
import { databasesMenu, handleDropdownChange } from "../../Helper";
import "./PhysicianAnalyticsSidebar.css";
import MenuIcon from "@mui/icons-material/Menu";

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
    mt: "5px",
    mb: "5px",
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

const PhysicianAnalyticsSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const patientAnalytics = useSelector(
    (state) => state.physicianAnalyticsData.PatientAnalytics
  );
  const [showLoader, setShowLoader] = useState(false);

  const handlePhysicianAnalyticsApi = async () => {
    const payload = {
      Analytics_Section: "Physician Analytics",
    };
    setShowLoader(true);
    const response = await fetchDescriptiveInsightsApi(payload);
    if (response) {
      dispatch(setDataForPhysicianAnalytics(response.data));
      setShowLoader(false);
    }
    setShowLoader(false);
  };

  useEffect(() => {
    if (patientAnalytics.length === 0) {
      handlePhysicianAnalyticsApi();
    }
  }, []);

  const routeFlagName = (value) => value.toLowerCase().replace(/\s+/g, "-");

  const handleSidebar = (value) => {
    const flag = routeFlagName(value);
    navigate("/descriptiveInsights/physicianAnalytics/" + flag);
  };

  const data2 = () => {
    return (
      <>
        <Select
        sx={style.dropDown}
        labelId="outlined-select-database-label"
        id="outlined-select-database"
        value="Physician_Analytics"
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
        {patientAnalytics?.map((item, index) => {
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
                  "/descriptiveInsights/physicianAnalytics/" +
                    routeFlagName(item)
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
      
      </>
    )
  
  }

  return (
    <>
    <Box className="physician-analytics-sidebar-box" spacing={0.5}>
        {data2()}
    </Box>
      
      <Tooltip title="Menu">
      <IconButton
        onClick={toggleDrawer(true)}
        size="small"
        sx={{
          color: "darkblue",
          display: { sm: "inline-flex", lg: "none" },
          ml: 2,
          marginTop: "20px",
          backgroundColor: "white",
        }}
      >
        <MenuIcon fontSize="medium" />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {
          <Box
            sx={{ width: 250, marginTop: "110px", marginLeft: "30px" }}
            role="presentation"
            onClick={toggleDrawer(false)}
            spacing={0.5}
          >
            {data2()}
          </Box>
        }
      </Drawer>
    </Tooltip>
    </>
  );
};

export default PhysicianAnalyticsSidebar;
