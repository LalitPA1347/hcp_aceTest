import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DescriptiveInsightsTable from "../DescriptiveInsightsTable/DescriptiveInsightsTable";
import SummaryCharts from "../SummaryCharts/SummaryCharts";
import TargetModal from "../Popup/TargetModal";
import CommonLoader from "../../../../Common/Loader/CommonLoader";
import { useDispatch, useSelector } from "react-redux";
import Download from "../../../../../assets/images/imagesR/Download.svg";
import "./ResultTabs.css";
import KpiFilterDialog from "../KpiFilterDialogBox/KpiFilterDialog";
import { decilingApi } from "../../../../../services/DescriptiveInsights/hcpace.service";
import {
  setDecilingData,
  sethcpLoader,
  setColumns,
  setRows,
} from "../../../../../redux/descriptiveInsights/tableSlice";
import ConcentrationCurveChart from "../SummaryCharts/ConcentrationCurveChart";
import { segmentationApi } from "../../../../../services/businessRules.service";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SegmentationCharts from "../../SummaryCharts/SegmentationCharts";
import { Opacity } from "@mui/icons-material";

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
  saveButton: {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "400",
    borderRadius: "4px",
    textTransform: "none",
    opacity: "0.5",
    backgroundColor: "#001A50",
    "&:hover": {
      backgroundColor: "#001A50",
      color: "#FFFFFF",
      cursor: "default",
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
  { label: "Output", dropdown: true, download: true },
  {
    label: "Deciling",
    dropdown: true,
    download: true,
    kpiFilter: true,
    decileType: true,
  },
  { label: "Segmentation & Target", dropdown: true, download: true },
  { label: "KOL/OL" },
  { label: "Smart Alert" },
  { label: "Dynamic Targeting" },
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

function ResultTabs({
  filtered,
  dataSource,
  selectedListType,
  onTabChange,
  defaultTab,
  filterConditions,
}) {
  const [value, setValue] = useState(0);
  const [contentOption, setContentOption] = useState("Output");
  const [openTargetModal, setOpenTargetModal] = useState(false);
  const [segmentationData, setSegmentationData] = useState(null);
  const [firstTimeOpened, setFirstTimeOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kpiDialogOpen, setKpiDialogOpen] = useState(false);
  const [selectedKpis, setSelectedKpis] = useState([]);
  const [rowsS, setRowsS] = useState([]);
  const [columnsS, setColumnsS] = useState([]);
  const kpiConfig = useSelector((state) => state.dragData.Kpiconfigs);
  const [sData, setSData] = useState([]);
  const { rows: outputRows, columns: outputColumns } = useSelector(
    (state) => state.table.outputTabData
  );

  const dispatch = useDispatch();
  const tableRef = useRef();
  const chartsRef = useRef();
  const loader = useSelector((state) => state.table.loader);
  const selectedkpiData = useSelector(
    (state) => state.dragData.selectedkpiData
  );
  const chartData = useSelector((store) => store.table.hcpAceApiData || []);
  const decilingData = useSelector((state) => state.table.decilingData);
  const currentTab = tabsConfig[value];

  useEffect(() => {
    const selectedTab = tabs[value];

    if (selectedTab === "Deciling") {
      fetchDecilingData();
    }
  }, [value]);

  function findKPIsByDataSource(bigObject, targetDataSource) {
    const result = [];

    for (const [kpiKey, kpiValue] of Object.entries(bigObject)) {
      if (containsDataSource(kpiValue, targetDataSource)) {
        result.push(kpiKey);
      }
    }

    return result;
  }

  // Recursive helper function to search deeply
  function containsDataSource(obj, target) {
    if (obj.DataSource.includes(target)) {
      return true;
    }
    return false;
  }

  const result = findKPIsByDataSource(kpiConfig, dataSource);
  const mapKpi = ["NRX", "Patient Count", "Total Calls"].find((kpi) =>
    result.includes(kpi)
  );

  const fetchDecilingData = async () => {
    const payload = {
      Kpi: selectedListType === "" ? [mapKpi] : selectedkpiData,
      filter_condition:
        selectedListType === ""
          ? {
              [dataSource]: {
                ...filtered,
              },
            }
          : filterConditions,
      ...(selectedListType !== "" && { selected_dataset: selectedListType }),
    };
    setSelectedKpis(payload.Kpi);
    try {
      dispatch(sethcpLoader(true));
      const response = await decilingApi(payload);
      if (response?.status === 200 && response.data) {
        dispatch(setDecilingData(response.data));
      }
      dispatch(sethcpLoader(false));
    } catch (error) {
      console.error("Error fetching deciling data:", error);
      dispatch(sethcpLoader(false));
    }
  };

  useEffect(() => {
    setValue(defaultTab);
  }, [defaultTab]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue, currentTab); // Notify parent component about tab change
    }
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

  const openKpiDialog = () => setKpiDialogOpen(true);
  const closeKpiDialog = () => {
    setKpiDialogOpen(false);
    // fetchDecilingData(true);
  };

  const handleKpiChange = async (newKpiSelection) => {
    setSelectedKpis(newKpiSelection);

    const payload = {
      Kpi: newKpiSelection,
      filter_condition:
        selectedListType === ""
          ? {
              [dataSource]: {
                ...filtered,
              },
            }
          : filterConditions,
      ...(selectedListType !== "" && { selected_dataset: selectedListType }),
    };

    try {
      dispatch(sethcpLoader(true));
      const response = await decilingApi(payload);
      if (response?.status === 200 && response.data) {
        dispatch(setDecilingData(response.data));
      }
      dispatch(sethcpLoader(false));
    } catch (error) {
      console.error("Error fetching deciling data:", error);
      dispatch(sethcpLoader(false));
    }
  };

  useEffect(() => {
    if (value === 1) fetchDecilingData();
  }, [value]);

  useEffect(() => {
    if (value === 2 && !segmentationData && !firstTimeOpened) {
      setOpenTargetModal(true);
      setFirstTimeOpened(true);
    }
  }, [value, segmentationData, firstTimeOpened]);

  const handleSegmentationSubmit = (data) => {
    setSegmentationData(data);
    setOpenTargetModal(false);
    setIsLoading(true);

    segmentationApi(data)
      .then((res) => {
        const responseData = res?.data?.[0];
        setSData(res?.data);

        if (
          responseData &&
          Array.isArray(responseData.Columns) &&
          Array.isArray(responseData.Rows)
        ) {
          const transformedColumns = responseData.Columns.map((col) => ({
            field: col,
            headerName: col.toUpperCase(),
            flex: 1,
          }));

          const transformedRows = responseData.Rows.map((row, index) => ({
            id: index + 1,
            ...row,
          }));

          setColumnsS(transformedColumns);
          setRowsS(transformedRows);
        } else {
          console.warn("Invalid segmentation data format:", responseData);
          setColumnsS([]);
          setRowsS([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching segmentationAPI:", error);
        setColumnsS([]);
        setRowsS([]);
      })
      .finally(() => setIsLoading(false));
  };

  const renderContent = () => {
    const currentTab = tabs[value];

    if (["Output", "Deciling"].includes(currentTab)) {
      let rows = [];
      let columns = [];

      if (currentTab === "Output") {
        rows = outputRows;
        columns = outputColumns;
      } else if (currentTab === "Deciling") {
        const data = decilingData[0];
        if (data && Array.isArray(data.Columns) && Array.isArray(data.Rows)) {
          columns = data.Columns.map((col) => ({
            field: col.toLowerCase(),
            headerName: col.replaceAll("_", " ").toUpperCase(),
            flex: 1,
            minWidth: 100,
            sortable: true,
          }));
          rows = data.Rows.map((row, i) => {
            const formattedRow = { id: i + 1 };
            data.Columns.forEach((col) => {
              formattedRow[col.toLowerCase()] = row[col.toLowerCase()];
            });
            return formattedRow;
          });
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
            {decilingData.length > 0 && currentTab === "Deciling" ? (
              <ConcentrationCurveChart
                ref={chartsRef}
                chartData={decilingData.slice(1)}
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

    if (currentTab === "Segmentation & Target") {
      if (contentOption === "Output") {
        return segmentationData && rowsS.length > 0 && columnsS.length > 0 ? (
          <DescriptiveInsightsTable
            rows={rowsS}
            columns={columnsS}
            ref={tableRef}
          />
        ) : (
          <Typography variant="body2" sx={{ ml: "10px" }}>
            No segmentation/target values set.
          </Typography>
        );
      } else if (contentOption === "Summary Charts") {
        return sData && sData.length > 0 ? (
          <SegmentationCharts ref={chartsRef} chartData={sData} />
        ) : (
          <Typography variant="body2" sx={{ ml: "10px" }}>
            No segmentation chart data available.
          </Typography>
        );
      }
    }

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
              marginRight: "80px",
            },
          }}
          IconComponent={KeyboardArrowDownIcon}
        >
          {tabsConfig.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {(currentTab.dropdown ||
        currentTab.download ||
        currentTab.kpiFilter ||
        currentTab.decileType) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Typography>{contentOption}</Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
            {currentTab.kpiFilter && (
              <Button
                variant="outlined"
                onClick={openKpiDialog}
                sx={style.addBtn}
              >
                Filter KPI's
              </Button>
            )}
            {currentTab.decileType && (
              <Button variant="outlined" sx={style.saveButton}>
                Decile Type
              </Button>
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
            {value === 2 && (
              <>
                <Button variant="outlined" sx={style.saveButton}>
                  Save Target File
                </Button>
                <FilterAltOutlinedIcon
                  onClick={() => setOpenTargetModal(true)}
                  sx={{
                    color: "#001A50",
                    fontSize: "28px",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                />
              </>
            )}
          </Box>
          {(loader || isLoading) && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1100,
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

      {openTargetModal && (
        <TargetModal
          open={openTargetModal}
          onCancel={() => setOpenTargetModal(false)}
          onSubmit={handleSegmentationSubmit}
          existingData={segmentationData}
        />
      )}

      <KpiFilterDialog
        open={kpiDialogOpen}
        onClose={closeKpiDialog}
        kpis={selectedListType ? selectedkpiData : [mapKpi]}
        selectedKpis={selectedKpis}
        onKpiChange={handleKpiChange}
      />
    </Box>
  );
}

export default ResultTabs;