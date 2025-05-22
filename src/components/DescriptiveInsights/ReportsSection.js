import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  IconButton,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ShareIcon from "@mui/icons-material/Share";
import { API_URL } from "../../shared/apiEndPointURL";
import axiosApiInstance from "../auth/apiInstance";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CommonLoader from "../Common/Loader/CommonLoader";
import { analyticsConfig } from "../../shared/helper";
import CustomDeleteDialogBox from "../Common/CustomDeleteDialogBox/CustomDeleteDialogBox";

const styles = {
  buttons: {
    fontSize: 11,
    textTransform: "none",
    backgroundColor: "#002060",
    "&:hover": {
      backgroundColor: "#002060",
    },
  },
};

const ReportsSection = () => {
  const params = useParams();
  const tab = params.flag;
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [checkedReports, setCheckedReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let analyticsName = location.pathname.split("/").filter(Boolean);
  let analytics = analyticsName[1];

  //dynamic tab chart data
  const analyticsChart = useSelector((store) => store[`${analytics}Chart`]);
  //dynamic tab report data
  const analyticsReports = useSelector((store) => store[`${analytics}Reports`]);
  //dynamic tab report stale status
  const isReportStale = useSelector(
    (store) => store.reportsStale[`${analytics}ReportsStale`]
  );

  const DeleteText = {
    title: "Delete Reports",
    msg: "By Deleting this, you wont be able to access this file.",
  };

  useEffect(() => {
    if (open && !showLoader) {
      getReports();
    }
  }, [open]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredReports(analyticsReports?.reports?.reports || []);
    } else {
      const filtered = analyticsReports?.reports?.reports?.filter((report) => {
        return report?.report_name
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
      setFilteredReports(filtered);
    }
  }, [searchText, analyticsReports]);

  const getReports = async () => {
    const config = analyticsConfig[analytics];

    if (analyticsReports?.reports?.reports && !isReportStale) {
      return;
    }

    const payload = {
      analytics: analytics,
    };

    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Authentication token is missing. Please log in again.", {
        autoClose: 2000,
      });
      return;
    }
    try {
      setShowLoader(true);
      const response = await axiosApiInstance.post(
        API_URL.fetchReportsApi,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status_code === 404) {
        dispatch(config.setReportsAction({ reports: [] }));
      } else {
        dispatch(config.setReportsAction(response.data));
      }
      setShowLoader(false);
      dispatch(config.resetStaleAction());
    } catch (error) {
      toast.error("Failed to fetch the reports. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleToggle = (report_name) => {
    setCheckedReports((prevCheckedReports) =>
      prevCheckedReports.includes(report_name)
        ? prevCheckedReports.filter((i) => i !== report_name)
        : [...prevCheckedReports, report_name]
    );
  };

  const handleApply = () => {
    const config = analyticsConfig[analytics];
    const selectedReports = checkedReports;

    if (selectedReports.length === 1) {
      const selectedReport = analyticsReports?.reports?.reports.find(
        (report) => report.report_name === checkedReports[0]
      );

      if (selectedReport) {
        const reportTab = selectedReport.module;

        if (reportTab !== tab) {
          navigate(`/descriptiveInsights/${analytics}/${reportTab}`);
        }

        let updatedChartData = {
          ...analyticsChart.data,
          [reportTab]: {
            selectedDropDownValue: JSON.parse(
              selectedReport.selected_dropdown_value
            ),
            dropDownOptions: [],
            chartData: JSON.parse(selectedReport.data),
          },
        };

        dispatch(config.setChartDataAction(updatedChartData));
        setTimeout(() => setOpen(!open), 300);
      }
    }
  };

  const handleDelete = async () => {
    setOpenConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setIsDelete(true);
    setOpenConfirmDialog(false);
    const reportNames = checkedReports;

    const payload = {
      analytics: analytics,
      reportName: reportNames,
      moduleName: tab,
    };

    try {
      const response = await axiosApiInstance.post(
        API_URL.deleteReportApi,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response?.data?.message, { autoClose: 2000 });

        const remainingReports = analyticsReports?.reports?.reports.filter(
          (report) => !checkedReports.includes(report.report_name)
        );

        const config = analyticsConfig[analytics];
        dispatch(
          config.setReportsAction({
            ...analyticsReports,
            reports: remainingReports,
          })
        );
        setCheckedReports([]);
      } else {
        throw new Error("Failed to delete the report");
      }
    } catch (error) {
      toast.error("Failed to delete the reports. Please try again.", {
        autoClose: 2000,
      });
    } finally {
      setIsDelete(false);
    }
  };

  const cancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={toggleDrawer}
        style={{
          position: "absolute ",
          top: "33%",
          right: open ? "44%" : "0",
          backgroundColor: open ? "#f9f9f9" : "#b1c4e9",
          writingMode: "vertical-rl",
          textOrientation: "sideways",
          transform: "rotate(180deg)",
          zIndex: 1300,
          width: "30px",
          height: "73px",
          fontSize: "12px",
          minWidth: "0",
          transition: "right 0.3s ease-in-out",
          borderRadius: "0 5px 5px  0",
          fontFamily: "Inter",
          color: "black",
          textTransform: "none",
          boxShadow: "none",
        }}
        sx={{
          "@media (max-width: 1200px)": {
            marginRight: open ? "-49px" : "0",
          },
          "@media (max-width: 1120px)": {
            marginRight: open ? "-45px" : "0",
          },
          "@media (max-width: 960px)": {
            marginRight: open ? "-39px" : "0",
          },
          "@media (max-width: 770px)": {
            marginRight: open ? "45px" : "0",
          },
        }}
      >
        Reports
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: "44%",
            height: "100%",
            position: "absolute",
            zIndex: 1200,
            padding: "2%",
            background: "#f9f9f9",
            "@media (max-width: 1200px)": {
              width: "40%",
            },
            "@media (max-width: 950px)": {
              width: "45%",
            },
            "@media (max-width: 830px)": {
              width: "50%",
            },
          },
        }}
      >
        <div className="drawer">
          <div className="search-container">
            <h3 className="reports-heading">Reports</h3>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "80px",
              }}
            >
              <TextField
                placeholder="Search By Name"
                value={searchText}
                variant="standard"
                onChange={handleSearchChange}
                sx={{
                  width: "12rem",
                  "& .MuiInputBase-input": {
                    fontSize: "12px",
                  },
                }}
              />
              <SearchSharpIcon sx={{ fontSize: "20px" }} />
            </Box>
            <IconButton onClick={toggleDrawer} style={{ color: "black" }}>
              <CloseIcon />
            </IconButton>
          </div>
          {showLoader || isDelete ? (
            <Box className="no-reports-loader">
              <CommonLoader />
            </Box>
          ) : (
            <>
              {filteredReports.length !== 0 && (
                <div className="heading">
                  <span sx={{ marginRight: "20px" }}>Name</span>
                  <span>Date Created</span>
                </div>
              )}
              <List className="report-list">
                {filteredReports.length !== 0 ? (
                  filteredReports?.map((report) => (
                    <ListItem
                      key={report.report_name}
                      className="report-list-item"
                    >
                      <Checkbox
                        edge="start"
                        sx={{
                          color: "#8085af",
                          "&.Mui-checked": {
                            color: "#8085af",
                          },
                        }}
                        checked={checkedReports.includes(report.report_name)}
                        onChange={() => handleToggle(report.report_name)}
                      />
                      <DescriptionOutlinedIcon
                        sx={{ fontSize: "medium", marginRight: "4px" }}
                      />
                      <ListItemText
                        primary={
                          <span className="report-name">
                            {report.report_name}
                          </span>
                        }
                      />
                      <ListItemText
                        primary={
                          <span className="report-name">
                            {report.timestamp.split(" ")[0] +
                              " | " +
                              report.timestamp.split(" ")[1].slice(0, 5)}
                          </span>
                        }
                      />
                      <ShareIcon
                        sx={{
                          fontSize: "15px",
                          marginLeft: "6px",
                          marginRight: "10px",
                          color: "rgba(0, 0, 0, 0.54)",
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <div className="no-reports-found">
                    <DescriptionOutlinedIcon
                      sx={{ fontSize: "large", marginRight: "4px" }}
                    />
                    <span>No Reports Found!</span>
                  </div>
                )}
              </List>
            </>
          )}

          {!showLoader && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
                marginTop: "18px",
              }}
            >
              <Button
                size="large"
                variant="contained"
                disabled={checkedReports.length === 1 ? false : true}
                sx={styles.buttons}
                onClick={handleApply}
              >
                Apply
              </Button>

              <Button
                size="large"
                variant="contained"
                disabled={checkedReports.length > 0 ? false : true}
                sx={styles.buttons}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          )}
        </div>
      </Drawer>
      {openConfirmDialog && (
        <CustomDeleteDialogBox
          open={openConfirmDialog}
          close={cancelDelete}
          text={DeleteText}
          submit={confirmDelete}
        />
      )}
    </div>
  );
};

export default ReportsSection;
