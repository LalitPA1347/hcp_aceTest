import React, { useEffect, useRef, useState } from "react";
import { Box, Tabs, Tab, Button, MenuItem, Select } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DescriptiveInsightsTable from "../DescriptiveInsightsTable/DescriptiveInsightsTable";
import SummaryCharts from "../SummaryCharts/SummaryCharts";
import CommonLoader from "../../../../Common/Loader/CommonLoader";
import { useDispatch, useSelector } from "react-redux";
import Download from "../../../../../assets/images/imagesR/Download.svg";
import "./ResultTabs.css";
import KpiFilterDialog from "../KpiFilterDialogBox/KpiFilterDialog";
import { decilingApi } from "../../../../../services/DescriptiveInsights/hcpace.service";
import { setDecilingData } from "../../../../../redux/descriptiveInsights/tableSlice";
import ConcentrationCurveChart from "../SummaryCharts/ConcentrationCurveChart";

const style = {
  addBtn: {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "400",
    borderRadius: "4px",
    textTransform: "none",
    backgroundColor: "#001A50",
    "&:hover": {
      backgroundColor: "#001A50",
      color: "#FFFFFF",
    },
  },
};

const tabs = [
  "Output",
  "Deciling",
  "Segmentation & Target",
  "KOL/OL",
  "Smart Alert",
  "Dynamic Targeting",
];

const tabsConfig = [
  {
    label: "Output",
    dropdown: true,
    download: true,
  },
  {
    label: "Deciling",
    dropdown: true,
    download: true,
    kpiFilter: true,
  },
  {
    label: "Segmentation & Target",
  },
  {
    label: "KOL/OL",
  },
  {
    label: "Smart Alert",
  },
  {
    label: "Dynamic Targeting",
  },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function ResultTabs({ filtered, dataSource, selectedListType }) {
  console.log(filtered, dataSource);

  const [value, setValue] = useState(0);
  const [contentOption, setContentOption] = useState("Output");
  const [kpiDialogOpen, setKpiDialogOpen] = useState(false);
  const [selectedKpis, setSelectedKpis] = useState([]);
  // const [dataSources, setDataSources] = useState([]);
  // // const [filterConditions, setFilterdConditions] = useState("");
  // const selectedDataSources = useSelector(
  //   (state) => state.dragData.selectedDataSources
  // );
  const { rows: outputRows, columns: outputColumns } = useSelector(
    (state) => state.table.outputTabData
  );
  const selectedkpiData = useSelector(
    (state) => state.dragData.selectedkpiData
  );
  const chartData = useSelector((store) => store.table.hcpAceApiData || []);
  const decilingData = useSelector((state) => state.table.decilingData);

  // useEffect(() => {
  //   setDataSources(selectedDataSources || []);
  // }, [selectedDataSources]);

  const dispatch = useDispatch();
  const loader = useSelector((state) => state.table.loader);
  const tableRef = useRef();
  const chartsRef = useRef();

  const currentTab = tabsConfig[value];

  // This will run only once when dialog is opened for the first time
  useEffect(() => {
    if (
      kpiDialogOpen &&
      selectedKpis.length === 0 &&
      selectedkpiData.length > 0
    ) {
      setSelectedKpis(selectedkpiData); // Select all KPIs initially
    }
  }, [kpiDialogOpen, selectedkpiData, selectedKpis.length]);

  useEffect(() => {
    const selectedTab = tabs[value];

    if (selectedTab === "Deciling") {
      fetchDecilingData();
    }
  }, [value]);

  const fetchDecilingData = async () => {
    const payload = {
      Kpi: selectedkpiData,
      filter_condition: {
        [dataSource]: {
          ...filtered,
        },
      },
      ...(selectedListType !== "" && { selected_dataset: selectedListType }),
    };

    try {
      const response = await decilingApi(payload);
      if (response?.status === 200 && response.data) {
        dispatch(setDecilingData(response.data));
      }
      console.log("Deciling API Response:", response.data);
    } catch (error) {
      console.error("Error fetching deciling data:", error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDropdownChange = (event) => {
    setContentOption(event.target.value);
  };

  const handleDownload = () => {
    if (contentOption === "Output") {
      tableRef.current?.handleDownload?.();
    } else if (contentOption === "Summary Charts") {
      chartsRef.current?.handleDownload?.();
    }
  };

  const toggleKpi = (kpi) => {
    setSelectedKpis((prev) =>
      prev.includes(kpi) ? prev.filter((item) => item !== kpi) : [...prev, kpi]
    );
  };

  const fetchDecilingDataPostKpiFilter = async () => {
    const payload = {
      Kpi: selectedKpis,
      filter_condition: {
        [dataSource]: {
          ...filtered,
        },
      },
      ...(selectedListType !== "" && { selected_dataset: selectedListType }),
    };

    try {
      const response = await decilingApi(payload);
      if (response?.status === 200 && response.data) {
        dispatch(setDecilingData(response.data));
      }
      console.log("Deciling API Response:", response.data);
    } catch (error) {
      console.error("Error fetching deciling data:", error);
    }
  };

  const openKpiDialog = () => setKpiDialogOpen(true);
  const closeKpiDialog = () => {
    setKpiDialogOpen(false);
    fetchDecilingDataPostKpiFilter();
  };

  const renderContent = () => {
    const currentTab = tabs[value]; // get current tab name

    if (["Output", "Deciling"].includes(currentTab)) {
      let rows = [];
      let columns = [];

      if (currentTab === "Output") {
        rows = outputRows;
        columns = outputColumns;
      } else if (currentTab === "Deciling") {
        const fieldAliasMap = {
          specialty: "spec", // rename this field
          total_calls: "total_calls", // keep as-is
        };

        const data = decilingData[0];
        const hasValidData =
          data && Array.isArray(data.Columns) && Array.isArray(data.Rows);

        if (hasValidData) {
          const transformedColumns = decilingData[0]?.Columns.map((col) => {
            const field = col.toLowerCase();
            const fieldName = fieldAliasMap[field] || field;
            const headerName =
              col.charAt(0).toUpperCase() + col.slice(1).replaceAll("_", " ");

            return {
              field: fieldName,
              headerName,
              flex: 1,
              minWidth: 100,
              type: typeof field === "number" ? "number" : "string",
              sortable: true,
            };
          });

          const transformedRows = decilingData[0]?.Rows.map((row, index) => {
            const newRow = { id: index + 1 };

            decilingData[0]?.Columns.forEach((col) => {
              const originalKey = col.toLowerCase();
              const mappedKey = fieldAliasMap[originalKey] || originalKey;

              newRow[mappedKey] = row[originalKey];
            });

            return newRow;
          });
          rows = transformedRows;
          columns = transformedColumns;
        }
      }

      if (contentOption === "Output") {
        return (
          <DescriptiveInsightsTable
            ref={tableRef}
            rows={rows}
            columns={columns}
          />
        );
      } else if (contentOption === "Summary Charts") {
        return (
          <>
            {currentTab === "Deciling" ? (
              <ConcentrationCurveChart
                ref={chartsRef}
                chartData={decilingData[1]}
              />
            ) : (
              <SummaryCharts
                ref={chartsRef}
                chartData={chartData.slice(1)}
                chartType="bar"
              />
            )}
          </>
        );
      }
    }

    // Default content for other tabs like KOL/OL etc.
    return <Box sx={{ p: 2 }}>Coming Soon</Box>;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", p: "10px 10px 0px 0px" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Result Tabs"
          sx={{
            "& .MuiTab-root": {
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              textTransform: "none",
              color: "#262526",
              marginRight: "auto",
            },
          }}
          IconComponent={KeyboardArrowDownIcon}
        >
          {tabsConfig.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {(currentTab.dropdown || currentTab.download || currentTab.kpiFilter) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            position: "relative",
          }}
        >
          <Box className="contentText">{contentOption}</Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {currentTab.kpiFilter && (
              <Button
                variant="outlined"
                onClick={openKpiDialog}
                sx={{ textTransform: "none" }}
              >
                Filter KPI's
              </Button>
            )}
            {currentTab.dropdown && (
              <Select
                value={contentOption}
                onChange={handleDropdownChange}
                size="small"
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="Output">Output</MenuItem>
                <MenuItem value="Summary Charts">Summary Charts</MenuItem>
              </Select>
            )}

            {currentTab.download && (
              <Button
                variant="outlined"
                sx={style.addBtn}
                startIcon={<img src={Download} alt="download icon" />}
                onClick={handleDownload}
              >
                Download
              </Button>
            )}
          </Box>

          {loader && (
            <Box
              sx={{
                position: "absolute",
                mt: "400px",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              <CommonLoader />
            </Box>
          )}
        </Box>
      )}

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {renderContent()}
        </TabPanel>
      ))}
      <KpiFilterDialog
        open={kpiDialogOpen}
        onClose={closeKpiDialog}
        kpis={selectedkpiData}
        selectedKpis={selectedKpis}
        onKpiChange={toggleKpi}
      />
    </Box>
  );
}

export default ResultTabs;