import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  IconButton,
  MenuItem,
  InputLabel,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getIndverApi,
  defaultChangeApi,
} from "../../services/businessRules.service";
import "./SettingsDialog.css";
import { setVersionValue } from "../../redux/chartDataSlice";
import { useDispatch } from "react-redux";

const SettingsDialog = ({ open, onClose }) => {
  const [selectedIndication, setSelectedIndication] = useState("NSCLC");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [indicationList, setIndicationList] = useState([]);
  const [versionList, setVersionList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [defaultVersion, setDefaultVersion] = useState("");
  const [disabledApplyBtn, setDisabledApplyBtn] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      handleFetchData();
    }
  }, [open]);

  useEffect(() => {
    // Ensure indicationList and defaultVersion are defined before setting the initial values
    if (indicationList.length > 0 && defaultVersion) {
      const initialIndication = indicationList[0].value;
      setSelectedIndication(initialIndication);
      setSelectedVersion(defaultVersion);
      // Initialize versionList for the first indication
      const initialVersions = indicationList.find(
        (indication) => indication.value === initialIndication
      );
      if (initialVersions) {
        setVersionList(
          initialVersions.data.map((item) => ({
            value: item,
            label: item,
          }))
        );
      }
    }
  }, [indicationList, defaultVersion]);

  const handleApply = async () => {
    setDisabledApplyBtn(true);
    try {
      setShowLoader(true);
      const payload = {
        Indication: selectedIndication,
        Version: selectedVersion,
      };

      const response = await defaultChangeApi(payload);
      if (response.status === 200) {
        dispatch(setVersionValue({ selectedIndication, selectedVersion }));
      } else {
        console.error("Failed to post data:", response.status, response.data);
      }

      setShowLoader(false);
      onClose();
    } catch (error) {
      console.error("Error posting data:", error);
      setShowLoader(false);
    }
  };

  const handleFetchData = async () => {
    setShowLoader(true);
    try {
      const response = await getIndverApi();
      if (response?.status === 200 && response?.data) {
        const indications = Object.keys(response.data).map((key) => ({
          value: key,
          label: key,
          data: response.data[key], // Add data to be used in handleIndicationChange
        }));

        setIndicationList(indications);

        if (indications.length > 0) {
          const initialIndication = indications[0].value;
          const versions = response.data[initialIndication].map((item) => ({
            value: item,
            label: item,
          }));

          setVersionList(versions);
          setDefaultVersion(
            response.data[initialIndication].find((item) =>
              item.includes("(Default)")
            ) || ""
          );
          setSelectedVersion(
            response.data[initialIndication].find((item) =>
              item.includes("(Default)")
            ) || ""
          );
        }
      }
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setShowLoader(false);
    }
  };

  const handleIndicationChange = (e) => {
    const newIndication = e.target.value;
    setSelectedIndication(newIndication);

    const selectedIndicationData = indicationList.find(
      (indication) => indication.value === newIndication
    );

    if (selectedIndicationData) {
      setVersionList(
        selectedIndicationData.data.map((item) => ({
          value: item,
          label: item,
        }))
      );
      setSelectedVersion(
        selectedIndicationData.data.find((item) =>
          item.includes("(Default)")
        ) || ""
      );
      setDisabledApplyBtn(true);
    }
  };

  const handleVersionChange = (e) => {
    setSelectedVersion(e.target.value);
    setDisabledApplyBtn(false);
  };

  const handleClose = () => {
    setDisabledApplyBtn(true);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="dialogPaper">
      <DialogTitle className="dialogTitle">
        <Typography variant="h6" style={{ fontFamily: "Inter, sans-serif" }}>
          Version Control
        </Typography>
        <IconButton onClick={handleClose} className="closeIcon">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="dialogContent">
        <div className="flexRow">
          <div>
            <InputLabel className="inputLabel" id="indication-select-label">
              Choose your Indication
            </InputLabel>
            <TextField
              id="outlined-select-indication"
              select
              name="indication"
              value={selectedIndication}
              onChange={handleIndicationChange}
              size="small"
              className="selectFields"
            >
              {indicationList.length > 0 ? (
                indicationList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No indications available</MenuItem>
              )}
            </TextField>
          </div>

          <div>
            <InputLabel className="inputLabel" id="version-select-label">
              Choose default version to make it default
            </InputLabel>
            <TextField
              id="outlined-select-version"
              select
              name="version"
              value={selectedVersion}
              onChange={handleVersionChange}
              size="small"
              className="selectFields"
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: { maxHeight: 48 * 4.5, width: 300 },
                  },
                  getContentAnchorEl: null,
                },
              }}
            >
              {versionList.length > 0 ? (
                versionList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No versions available</MenuItem>
              )}
            </TextField>
          </div>
        </div>

        <Button
          onClick={handleApply}
          variant="contained"
          className={`applyButton ${disabledApplyBtn ? "disable" : ""}`}
          disabled={disabledApplyBtn}
          style={{
            backgroundColor: disabledApplyBtn ? "#d3d3d3" : "#002060",
            textTransform: "none",
            color: disabledApplyBtn ? "#a9a9a9" : "white",
          }}
        >
          Apply
        </Button>

        <Backdrop className="backdrop" open={showLoader}>
          <CircularProgress
            className="circularProgress"
            style={{ color: "#002060" }}
          />
        </Backdrop>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
