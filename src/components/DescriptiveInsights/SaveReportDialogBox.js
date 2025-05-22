import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../shared/apiEndPointURL";
import {
  resetIsDuplicateReport,
  setIsDuplicateReport,
} from "../../redux/descriptiveInsights/reportsSlice";
import axiosApiInstance from "../auth/apiInstance";
import ArticleIcon from "@mui/icons-material/Article";
import { analyticsConfig } from "../../shared/helper";
import CircularProgress from "@mui/material/CircularProgress";

const SaveReportDialog = ({ open, onClose, onSave }) => {
  const params = useParams();
  const tab = params.flag;

  const [fileName, setFileName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  let analyticsName = location.pathname.split("/").filter(Boolean);
  let analytics = analyticsName[1];

  const selectedDropdownValues = useSelector(
    (store) => store[`${analytics}Chart`]?.data
  );

  const { duplicateReportName } = useSelector((store) => store.reportsStale);

  const handleSave = async () => {
    const config = analyticsConfig[analytics];
    const filteredDataForCurrentTab = Object.keys(selectedDropdownValues)
      .filter((key) => key === tab) // Check if the key matches the current tab
      .reduce((acc, key) => {
        acc[key] = selectedDropdownValues[key];
        return acc;
      }, {});

    if (fileName === "" || fileName === undefined) {
      dispatch(setIsDuplicateReport("Report Name is required!"));
      return;
    } else if (Object.keys(filteredDataForCurrentTab).length === 0) {
      toast.warning("There is no data to save in the Report!", {
        autoClose: 2000,
      });
      return;
    }

    const token = localStorage.getItem("auth_token");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.", {
        autoClose: 2000,
      });
      return;
    }
    const fetchPayload = {
      analytics: analytics,
    };

    try {
      setIsSaving(true);
      // Fetch existing reports
      const fetchResponse = await axiosApiInstance.post(
        API_URL.fetchReportsApi,
        fetchPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (fetchResponse.status === 200) {
        const existingReports = fetchResponse.data.reports || [];
        const isDuplicate = existingReports.some(
          (report) =>
            report.report_name.toLowerCase() === fileName.toLowerCase()
        );

        if (isDuplicate) {
          dispatch(
            setIsDuplicateReport(
              "Report name already exist. Please enter a different name."
            )
          );
          setIsSaving(false);
          return;
        }
      } else {
        throw new Error("Failed to fetch existing reports");
      }
    } catch (error) {
      toast.error("Failed to fetch reports. Please try again.", {
        autoClose: 2000,
      });
    }
    const payload = {
      analytics: analytics,
      reportName: fileName,
      moduleName: tab,
      selectedDropDownValue:
        filteredDataForCurrentTab?.[tab]?.selectedDropDownValue || {},
      chartData: filteredDataForCurrentTab?.[tab]?.chartData || {},
      dropDownName: Object.keys(
        filteredDataForCurrentTab?.[tab]?.selectedDropDownValue
      ),
    };

    try {
      setIsSaving(true);
      const response = await axiosApiInstance.post(
        API_URL.saveReportApi,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message, { autoClose: 2000 });

        dispatch(config.setStaleReportsAction());
        dispatch(resetIsDuplicateReport());
        setFileName("");
        onSave(fileName);
        onClose();
      } else {
        throw new Error("Failed to save the report");
      }
    } catch (error) {
      toast.error("Failed to save the report. Please try again.", {
        autoClose: 2000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "470px",
        },
      }}
    >
      <DialogTitle>
        <h5>Save Report</h5>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "gray" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="fileName"
          label="Report Name"
          variant="standard"
          fullWidth
          required
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        {duplicateReportName && (
          <h5 className="error">{duplicateReportName}</h5>
        )}
        <Box sx={{ marginTop: 2 }}>
          <Paper
            elevation={3}
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 1,
              paddingBottom: 1,
              backgroundColor: "#ebf2ff",
              borderLeft: "4px solid #004eea",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "13px" }}
            >
              <ArticleIcon
                fontSize="xsmall"
                style={{ color: "#002060", marginRight: "8px" }}
              />
              Note
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: "12px" }}
            >
              This report will be saved in the Reports Section.
            </Typography>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ paddingRight: 3, paddingTop: 0, paddingBottom: 2 }}>
        <Button
          size="large"
          onClick={onClose}
          variant="outlined"
          sx={{
            fontSize: 12,
            textTransform: "none",
            borderRadius: "2.5px",
            background: "#f6f7f8",
            color: "black",
            "&:hover": {
              backgroundColor: "#f6f7f8",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          size="large"
          onClick={handleSave}
          variant="contained"
          sx={{
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            textTransform: "none",
            borderRadius: "2.5px",
            backgroundColor: "#002060",
            "&:hover": {
              backgroundColor: "#002060",
            },
          }}
        >
          Save
          {isSaving ? (
            <CircularProgress
              size="1rem"
              sx={{ marginLeft: "6px" }}
              color="inherit"
            />
          ) : (
            <SaveAsOutlinedIcon sx={{ fontSize: "16px", marginLeft: "6px" }} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveReportDialog;
