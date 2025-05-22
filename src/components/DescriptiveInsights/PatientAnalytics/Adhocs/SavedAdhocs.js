import {
  Box,
  Button,
  Checkbox,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import axiosApiInstance from "../../../auth/apiInstance";
import { API_URL } from "../../../../shared/apiEndPointURL";
import { toast } from "react-toastify";
import CommonLoader from "../../../Common/Loader/CommonLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAdhocsUpdated,
  setOpenAdhocs,
  setSavedAdhocs,
  setSelectedAdhocs,
} from "../../../../redux/descriptiveInsights/AdhocsSlice";
import CustomDeleteDialogBox from "../../../Common/CustomDeleteDialogBox/CustomDeleteDialogBox";

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

const SavedAdhocs = () => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [filteredReports, setFilteredReports] = useState([]);
  const [checkedReports, setCheckedReports] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const isAdhocsUpdated = useSelector(
    (store) => store.savedAdhocs.isAdhocsUpdated
  );
  const DeleteText = {
    title: "Delete Adhocs",
    msg: "By Deleting this, you wont be able to access this file.",
  };

  const dispatch = useDispatch();

  const savedAdhocs = useSelector((store) => store.savedAdhocs.adhocs);

  useEffect(() => {
    if (searchText === "") {
      setFilteredReports(savedAdhocs || []);
    } else {
      const filtered = savedAdhocs.filter((adhoc) => {
        return adhoc["Adhoc Name"]
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
      setFilteredReports(filtered);
    }
  }, [searchText, savedAdhocs]);

  useEffect(() => {
    if (open) {
      getReports();
    }
  }, [open]);

  const getReports = async () => {
    if (savedAdhocs.length > 0 && !isAdhocsUpdated) {
      return;
    }
    const token = localStorage.getItem("auth_token");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.", {
        autoClose: 2000,
      });
      return;
    }

    const payload = {
      analytics: "Patient Analytics",
    };

    try {
      setShowLoader(true);
      const response = await axiosApiInstance.post(
        API_URL.getSavedAdhocs,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(setIsAdhocsUpdated(false));
        dispatch(setSavedAdhocs(response?.data?.["Saved Adhocs"] || []));
      }
      setShowLoader(false);
    } catch (error) {
      console.log(error);
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
    const selectedAdhocs = checkedReports;

    if (selectedAdhocs.length === 1) {
      const selectedAdhoc = savedAdhocs.find(
        (adhoc) => adhoc["Adhoc Name"] === checkedReports[0]
      );
      dispatch(setSelectedAdhocs(selectedAdhoc));
      dispatch(setOpenAdhocs(true));
      setOpen(!open);

      // if (selectedReport) {
      //   const reportTab = selectedReport.module;

      //   if (reportTab !== tab) {
      //     navigate(`/patientAnalyticsTool/patientInsights/${reportTab}`);
      //   }

      //   let updatedChartData = {
      //     ...analyticsChart.data,
      //     [reportTab]: {
      //       selectedDropDownValue: JSON.parse(
      //         selectedReport.selected_dropdown_value
      //       ),
      //       dropDownOptions: [],
      //       chartData: JSON.parse(selectedReport.data),
      //     },
      //   };

      //   dispatch(config.setChartDataAction(updatedChartData));
      //   setTimeout(() => setOpen(!open), 300);
      // }
    }
  };

  const handleDelete = () => {
    setOpenConfirmDialog(true);
  };

  const cancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const confirmDelete = async () => {
    setShowLoader(true);
    setOpenConfirmDialog(false);
    const selectedAdhocs = checkedReports;

    const token = localStorage.getItem("auth_token");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.", {
        autoClose: 2000,
      });
      return;
    }

    const payload = {
      analytics: "Patient Analytics",
      adhocName: selectedAdhocs,
    };
    try {
      const response = await axiosApiInstance.post(
        API_URL.deleteAdhocs,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Adhoc deleted successfully!", {
          autoClose: 2000,
        });
        const remainingAdhocs = savedAdhocs.filter(
          (adhoc) => !selectedAdhocs.includes(adhoc?.["Adhoc Name"])
        );
        dispatch(setSavedAdhocs(remainingAdhocs));
        setCheckedReports([]);
        setSearchText("")
        setShowLoader(false);
      } else {
        throw new Error("Failed to delete the Adhoc report");
      }
    } catch (error) {
      console.log(error);
    }
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
        Adhocs
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
            <h3 className="reports-heading">Saved Adhocs</h3>
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
          {showLoader ? (
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
                  filteredReports
                    .slice()
                    .sort(
                      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                    )
                    .map((adhoc, index) => (
                      <ListItem key={index} className="report-list-item">
                        <Checkbox
                          edge="start"
                          sx={{
                            color: "#8085af",
                            "&.Mui-checked": {
                              color: "#8085af",
                            },
                          }}
                          checked={checkedReports.includes(adhoc["Adhoc Name"])}
                          onChange={() => handleToggle(adhoc["Adhoc Name"])}
                        />
                        <DescriptionOutlinedIcon
                          sx={{ fontSize: "medium", marginRight: "4px" }}
                        />
                        <ListItemText
                          primary={
                            <span className="report-name">
                              {adhoc["Adhoc Name"]}
                            </span>
                          }
                        />
                        <ListItemText
                          primary={
                            <span className="report-name">
                              {adhoc?.timestamp.split(" ")[0] +
                                " | " +
                                adhoc?.timestamp.split(" ")[1].slice(0, 5)}
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
                View
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

export default SavedAdhocs;
