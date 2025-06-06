import React, { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import DeleteRule from "../../../../../../assets/images/DeleteRule.svg";
import {
  savedFlowChartDataApi,
  deleteFlowChartDataApi,
} from "../../../../../../services/DescriptiveInsights/hcpace.service";
import { useDispatch, useSelector } from "react-redux";
import "./SavedFlowChart.css";
import { setFlowChartData } from "../../../../../../redux/descriptiveInsights/hcpaceSlice";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const SavedFlowChart = ({
  open,
  handleSavedFlowChart,
  customerFilterOpen,
  segmentationPanelOpen,
}) => {
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [selectedFlowChartInfo, setSelectedFlowChartInfo] = useState(null);
  const dispatch = useDispatch();
  const savedFlowChartData = useSelector(
    (state) => state.dragData.savedFlowChartData
  );
  console.log(savedFlowChartData, "savedFlowChartData 99");
  console.log(selectedFlowChartInfo, "selectedFlowChartInfo 99");
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
      toast.success("Flow Chart Deleted Successfully");
    } else {
      console.error("Error deleting custom filter:", response);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`sfc-toggle ${
          open
            ? "open"
            : customerFilterOpen || segmentationPanelOpen
            ? "custom-filter-open"
            : ""
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
              direction="row"
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
                sx={{
                  color: "#444",
                  fontSize: "0.95rem",
                  letterSpacing: "0%",
                }}
              >
                {item.FlowChartName}
              </Typography>

              <Stack
                key={item.QueryName}
                alignItems="center"
                direction="row"
                gap={"5px"}
              >
                <VisibilityIcon
                  color="action"
                  fontSize="small"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedFlowChartInfo(item);
                    setOpenInfoDialog(true);
                  }}
                />
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

      {/* <Dialog
        open={openInfoDialog}
        onClose={() => setOpenInfoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selected Filters</DialogTitle>
        <DialogContent dividers>
          {selectedFlowChartInfo ? (
            <Box
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "rgb(250, 250, 250)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Flow Chart Name
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{selectedFlowChartInfo.FlowChartName}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    KPI
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    {selectedFlowChartInfo.Kpi?.join(", ")}
                  </Typography>
                </Grid>

                {selectedFlowChartInfo.filter_condition &&
                  Object.entries(selectedFlowChartInfo.filter_condition).map(
                    ([dataSource, conditions]) => (
                      <React.Fragment key={dataSource}>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {dataSource}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          {Object.entries(conditions).map(([key, value]) => {
                            if (Array.isArray(value)) {
                              return (
                                <Typography key={key}>
                                  <strong>{key}:</strong> {value.join(", ")}
                                </Typography>
                              );
                            } else if (
                              typeof value === "object" &&
                              key === "customFilter1" &&
                              value.GroupsInfo
                            ) {
                              // customFilter1 → GroupsInfo → GroupName → Rules
                              return Object.entries(value.GroupsInfo).map(
                                ([groupName, groupData]) => {
                                  const rules = groupData.Rules || {};
                                  return (
                                    <Box key={groupName} sx={{ mb: 1 }}>
                                      <Typography
                                        fontWeight="bold"
                                        sx={{ mt: 1 }}
                                      >
                                        Custom Filter - {groupName}
                                      </Typography>
                                      {Object.entries(rules).map(
                                        ([ruleName, ruleData]) => (
                                          <Box key={ruleName} sx={{ pl: 2 }}>
                                            <Typography>
                                              <strong>{ruleName}:</strong>
                                            </Typography>
                                            {Object.entries(ruleData).map(
                                              ([field, fieldValue]) => (
                                                <Typography
                                                  key={field}
                                                  sx={{ pl: 2 }}
                                                >
                                                  <strong>{field}:</strong>{" "}
                                                  {Array.isArray(fieldValue)
                                                    ? fieldValue.join(", ")
                                                    : fieldValue}
                                                </Typography>
                                              )
                                            )}
                                          </Box>
                                        )
                                      )}
                                    </Box>
                                  );
                                }
                              );
                            } else {
                              return (
                                <Typography key={key}>
                                  <strong>{key}:</strong>{" "}
                                  {typeof value === "object"
                                    ? JSON.stringify(value)
                                    : value?.toString()}
                                </Typography>
                              );
                            }
                          })}
                        </Grid>
                      </React.Fragment>
                    )
                  )}
              </Grid>
            </Box>
          ) : (
            <Typography>No data available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfoDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
  open={openInfoDialog}
  onClose={() => setOpenInfoDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Selected Filters</DialogTitle>
  <DialogContent dividers>
    {selectedFlowChartInfo ? (
      <Box
        sx={{
          p: 2,
          border: "1px solid #ddd",
          borderRadius: 2,
          backgroundColor: "rgb(250, 250, 250)",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              Flow Chart Name
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{selectedFlowChartInfo.FlowChartName}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              KPI
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{selectedFlowChartInfo.Kpi?.join(", ")}</Typography>
          </Grid>

          {selectedFlowChartInfo.filter_condition &&
            Object.entries(selectedFlowChartInfo.filter_condition).map(
              ([dataSource, conditions]) => (
                <React.Fragment key={dataSource}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {dataSource}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    {Object.entries(conditions).map(([key, value]) => {
                      if (Array.isArray(value)) {
                        return (
                          <Typography key={key}>
                            <strong>{key}:</strong> {value.join(", ")}
                          </Typography>
                        );
                      }

                      // Handle customFilters 1,2,3
                      if (
                        typeof value === "object" &&
                        key.startsWith("customFilter") &&
                        value.GroupsInfo
                      ) {
                        return Object.entries(value.GroupsInfo).map(
                          ([groupName, groupData]) => {
                            const rules = groupData.Rules || {};
                            return (
                              <Box key={groupName} sx={{ mb: 1 }}>
                                <Typography fontWeight="bold" sx={{ mt: 1 }}>
                                  {key} - {groupName}
                                </Typography>
                                {Object.entries(rules).map(
                                  ([ruleName, ruleData]) => (
                                    <Box key={ruleName} sx={{ pl: 2 }}>
                                      <Typography>
                                        <strong>{ruleName}:</strong>
                                      </Typography>
                                      {Object.entries(ruleData).map(
                                        ([field, fieldValue]) => (
                                          <Typography
                                            key={field}
                                            sx={{ pl: 2 }}
                                          >
                                            <strong>{field}:</strong>{" "}
                                            {Array.isArray(fieldValue)
                                              ? fieldValue.join(", ")
                                              : fieldValue}
                                          </Typography>
                                        )
                                      )}
                                    </Box>
                                  )
                                )}
                              </Box>
                            );
                          }
                        );
                      }

                      return (
                        <Typography key={key}>
                          <strong>{key}:</strong>{" "}
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : value?.toString()}
                        </Typography>
                      );
                    })}
                  </Grid>
                </React.Fragment>
              )
            )}
        </Grid>
      </Box>
    ) : (
      <Typography>No data available</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenInfoDialog(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
};

export default SavedFlowChart;