/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./MainContent.css"; // Styles for this component
// import DescriptiveInsightsTable from "../DescriptiveInsightsTable/DescriptiveInsightsTable";
import ParameterModal from "../Popup/ParameterModal";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import {
  setDragData,
  removeDroppedParam,
} from "../../../../../redux/descriptiveInsights/hcpaceSlice";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { kpiFilterCountApi } from "../../../../../services/businessRules.service";
import {
  setColumns,
  sethcpAceApiData,
  setRows,
  sethcpLoader,
} from "../../../../../redux/descriptiveInsights/tableSlice";

import {
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { hcpAceApi } from "../../../../../services/DescriptiveInsights/hcpace.service";
import ResultTabs from "../ResultTabs/ResultTabs";

const MainContent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingParam, setPendingParam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousParams, setPreviousParams] = useState([]);
  const [droppedParamsConfig, setDroppedParamsConfig] = useState({});
  const [countsData, setCountsData] = useState({});
  const [customFilterChips, setCustomFilterChips] = useState({});
  const [customFilterStatus, setCustomFilterStatus] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [selectedChip, setSelectedChip] = useState({
    dataSource: null,
    index: null,
  });
  const [position, setPosition] = useState(false);
  const [selectedListType, setSelectedListType] = useState(""); // 'Unique List' or 'Overlap List'
  const selectedkpiData = useSelector(
    (state) => state.dragData.selectedkpiData
  );

  const [sourceOfTrigger, setSourceOfTrigger] = useState("");
  const kpiConfig = useSelector((state) => state.dragData.Kpiconfigs);
  const dragData = useSelector((state) => state.dragData.dragData);
  const actionType = useSelector((state) => state.dragData.actionType);
  const [filterConditions, setFilterdConditions] = useState("");
  const [showTable, setShowTable] = useState(false);
  const selectedDataSources = useSelector(
    (state) => state.dragData.selectedDataSources
  );
  const droppedParamsBySource = useSelector(
    (state) => state.dragData.droppedParamsBySource
  );
  const dispatch = useDispatch();
  const [dataSources, setDataSources] = useState([]);
  console.log("datas--", droppedParamsBySource);
  const operatorButtonColors = [
    // "rgba(255,255,255)"

    "rgba(188, 200, 212, 1)",
    "rgba(186, 197, 187, 1)",

    "rgba(212, 203, 200, 1)",
    "rgba(194, 198, 212, 1)",
    "rgba(200, 202, 202, 1)",
    "rgba(195, 204, 198, 1)",
    "rgba(212, 162, 167, 1)",
    "rgba(194, 198, 212, 1)",
    "rgba(212, 204, 206, 1)",
  ];

  useEffect(() => {
    setDataSources(selectedDataSources || []);
  }, [selectedDataSources]);

  useEffect(() => {
    if (isCancelled) {
      callKpiFilterCountApi();
      setIsCancelled(false); // reset after API call
    }
  }, [isCancelled]);

  useEffect(() => {
    if (
      actionType === "add" &&
      dragData.length > 0 &&
      sourceOfTrigger !== "cancel"
    ) {
      const lastParam = dragData[dragData.length - 1];

      const alreadyConfigured =
        droppedParamsConfig[lastParam] &&
        Object.keys(droppedParamsConfig[lastParam]).length > 0;

      if (lastParam && !pendingParam && !alreadyConfigured) {
        setPendingParam(lastParam);
        setModalOpen(true);
      }
    }

    // Reset the trigger so future additions behave normally
    if (sourceOfTrigger === "cancel") {
      setSourceOfTrigger(null);
    }
  }, [
    dragData,
    actionType,
    droppedParamsConfig,
    sourceOfTrigger,
    pendingParam,
  ]);

  useEffect(() => {
    if (actionType === "remove") {
      setIsCancelled(true);
      setSourceOfTrigger("cancel");
    }
  }, [actionType]);

  useEffect(() => {
    callKpiFilterCountApi();
    setCustomFilterStatus(false);
    setPosition(false);
  }, [customFilterStatus, position]);
  useEffect(() => {
    // This effect triggers the API call when a parameter has been configured (its entry exists in droppedParamsConfig)

    if (
      !isEditMode &&
      pendingParam &&
      droppedParamsConfig[pendingParam] &&
      Object.keys(droppedParamsConfig[pendingParam]).length > 0
    ) {
      callKpiFilterCountApi();
      // `pendingParam` is cleared in `callKpiFilterCountApi`'s finally block or if skipped
    }
  }, [droppedParamsConfig, pendingParam]); // Ensure pendingParam is a dependency

  const handleChipClick = async (clickedIndex, dataSource) => {
    const sliced = droppedParamsBySource[dataSource]?.slice(
      0,
      clickedIndex + 1
    );
    setPreviousParams(sliced);

    const getFilteredSlicedValues = (dataSource, filterConditions, sliced) => {
      const result = {};

      const actualDataSourceKey = Object.keys(filterConditions).find((key) =>
        key.toLowerCase().includes(dataSource.toLowerCase())
      );

      if (!actualDataSourceKey) {
        console.warn(
          `Data source "${dataSource}" not found in filterCondition.`
        );
        return result;
      }

      const dataSourceFilters = filterConditions[actualDataSourceKey];

      for (const key of sliced) {
        if (dataSourceFilters.hasOwnProperty(key)) {
          result[key] = dataSourceFilters[key];
        }
      }

      return result;
    };

    const filtered = getFilteredSlicedValues(
      dataSource,
      filterConditions,
      sliced
    );

    const payload1 = {
      Kpi: selectedkpiData,
      filter_condition: {
        [dataSource]: {
          ...filtered,
        },
      },
    };

    try {
      dispatch(sethcpLoader(true));
      const response = await hcpAceApi(payload1);
      // console.log("Response from hcpAceApi:", response);
      if (response?.status === 200 && response.data) {
        dispatch(sethcpAceApiData(response.data));
        const apiRows = response.data[0].Rows || [];
        const apiColumns = response.data[0].Columns || [];

        const fieldAliasMap = {
          specialty: "spec", // rename this field
          total_calls: "total_calls", // keep as-is
        };

        const transformedColumns = apiColumns.map((col) => {
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

        const transformedRows = apiRows.map((row, index) => {
          const newRow = { id: index + 1 };

          apiColumns.forEach((col) => {
            const originalKey = col.toLowerCase();
            const mappedKey = fieldAliasMap[originalKey] || originalKey;

            newRow[mappedKey] = row[originalKey];
          });

          return newRow;
        });
        dispatch(setRows(transformedRows));
        dispatch(setColumns(transformedColumns));
        setShowTable(true);
        dispatch(sethcpLoader(false));
      }
    } catch (error) {
      console.error("Error calling hcpAceApi:", error);
      dispatch(sethcpLoader(false));
    }
  };

  const handleListClick = async (index) => {
    function getTrimmedDataByCategoryIndex(filterConditions, index) {
      const trimmed = {};

      Object.entries(filterConditions).forEach(([source, categories]) => {
        const categoryEntries = Object.entries(categories);
        const trimmedCategories = categoryEntries.slice(0, index + 1); // keep categories up to the index
        trimmed[source] = Object.fromEntries(trimmedCategories);
      });

      return trimmed;
    }

    const result = getTrimmedDataByCategoryIndex(filterConditions, index);

    const payload = {
      Kpi: selectedkpiData,
      filter_condition: result,
      selected_dataset: selectedListType,
    };

    try {
      setShowTable(true);
      dispatch(sethcpLoader(true));
      const response = await hcpAceApi(payload);

      if (response?.status === 200 && response.data) {
        dispatch(sethcpAceApiData(response.data));
        dispatch(sethcpLoader(false));
        const fieldAliasMap = {
          specialty: "spec",
          total_calls: "total_calls", // no rename, just keeping for structure
          // Add more field mappings if needed
        };

        const allTables = response.data.map((tableData, tableIndex) => {
          const apiColumns = tableData.Columns || [];
          const apiRows = tableData.Rows || [];

          const transformedColumns = apiColumns.map((col) => {
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

          const transformedRows = apiRows.map((row, index) => {
            const newRow = { id: index + 1 };

            apiColumns.forEach((col) => {
              const originalKey = col.toLowerCase();
              const mappedKey = fieldAliasMap[originalKey] || originalKey;

              newRow[mappedKey] = row[originalKey];
            });

            return newRow;
          });

          return {
            title: tableData.Title,
            columns: transformedColumns,
            rows: transformedRows,
          };
        });

        if (allTables.length > 0) {
          dispatch(setColumns(allTables[0].columns));
          dispatch(setRows(allTables[0].rows));
        }

        setShowTable(true);
      }
    } catch (error) {
      console.error("Error calling hcpAceApi:", error);
      dispatch(sethcpLoader(false));
    }
  };

  const callKpiFilterCountApi = () => {
    const filterCondition = {};

    // 1. Get a unique list of all dataSourceNames that are active
    // (i.e., have either regular params or custom filters)
    const allRelevantDataSourceNames = new Set([
      ...Object.keys(droppedParamsBySource), // Data sources with regular params
      ...Object.keys(customFilterChips).filter(
        (dsName) => customFilterChips[dsName]?.length > 0
      ), // Data sources with active custom filters
    ]);

    // 2. Iterate over this comprehensive list of data source names
    for (const dataSourceName of allRelevantDataSourceNames) {
      const paramsInDs = droppedParamsBySource[dataSourceName]; // May be undefined
      const customFiltersInDs = customFilterChips[dataSourceName]; // May be undefined or empty
      // console.log(
      //   `Data source: ${dataSourceName}, customFiltersInDs:`,
      //   customFiltersInDs
      // );
      const hasActiveRegularParams = paramsInDs && paramsInDs.length > 0;
      const hasActiveCustomFilters =
        customFiltersInDs && customFiltersInDs.length > 0;
      // console.log("hasactivecustomfilter", hasActiveCustomFilters);

      // Only proceed if there's at least one type of filter for this data source
      if (hasActiveRegularParams || hasActiveCustomFilters) {
        filterCondition[dataSourceName] = {}; // Initialize the entry for this data source

        // Logic for regular parameters (copied from your original code)
        if (hasActiveRegularParams) {
          paramsInDs.forEach((paramName) => {
            if (
              droppedParamsConfig[paramName] &&
              droppedParamsConfig[paramName][dataSourceName]
            ) {
              filterCondition[dataSourceName][paramName] =
                droppedParamsConfig[paramName][dataSourceName];
            } else if (droppedParamsConfig[paramName]) {
              const configuredSources = Object.keys(
                droppedParamsConfig[paramName]
              );
              if (configuredSources.length > 0) {
                filterCondition[dataSourceName][paramName] =
                  droppedParamsConfig[paramName][configuredSources[0]];
              }
            }
          });
        }

        // Logic for adding the hardcoded custom filter

        if (hasActiveCustomFilters) {
          switch (dataSourceName) {
            case "Xponent Data":
              filterCondition[dataSourceName]["customFilter"] = {
                ww: {
                  Col_name: "NRX",
                  Condition: ">",
                  Col_val: "5",
                },
              };
              break;

            case "Claims Data":
              filterCondition[dataSourceName]["customFilter"] = {
                ww: {
                  Col_name: "Regimen Category",
                  Condition: "in",
                  Col_val: ["OPDIVO", "O+Y", "O+CHEMO"],
                },
              };
              break;

            case "Call Activity Data":
              filterCondition[dataSourceName]["customFilter"] = {
                ww: {
                  Col_name: "Total Calls",
                  Condition: ">",
                  Col_val: "5",
                },
              };
              break;

            default:
              // Optional: add a fallback
              break;
          }
        }

        if (Object.keys(filterCondition[dataSourceName]).length === 0) {
          delete filterCondition[dataSourceName];
        }
      }
    }

    const kpiPayload = Array.isArray(selectedkpiData)
      ? selectedkpiData
      : selectedkpiData
      ? [selectedkpiData]
      : [];

    if (kpiPayload.length === 0) {
      // console.log("Skipping API call: No KPIs selected.");
      setIsLoading(false);
      if (pendingParam) setPendingParam(null);
      return;
    }

    const isFilterConditionEffectivelyEmpty =
      Object.keys(filterCondition).length === 0 ||
      Object.values(filterCondition).every(
        (params) => Object.keys(params).length === 0
      );

    if (isFilterConditionEffectivelyEmpty) {
      // console.log("Skipping API call: No filters configured to apply.");
      setCountsData({}); // Clear counts if no filters
      setIsLoading(false);
      if (pendingParam) setPendingParam(null);
      return;
    }

    const payload = {
      Kpi: kpiPayload,
      filter_condition: filterCondition,
      same_kpi_with_added_filter: true,
    };

    setFilterdConditions(filterCondition); // You might want to rename this to setFilteredConditions
    setIsLoading(true);

    kpiFilterCountApi(payload)
      .then((res) => {
        if (res?.data) {
          // console.log("API Response:", res.data);
          setCountsData(res.data.Counts || {});
        } else {
          setCountsData({});
        }
      })
      .catch((error) => {
        setCountsData({});
        console.error("Error fetching kpiFilterCountApi:", error);
      })
      .finally(() => {
        setIsLoading(false);
        if (pendingParam) setPendingParam(null);
      });
  };

  const handleModalSubmit = ({ param, dataSource, values }) => {
    console.log(
      "Modal submit error: Parameter name or dataSource is missing.",
      { param, dataSource, values }
    );
    if (!param || !dataSource) {
      setIsEditMode(false);
      setModalOpen(false);

      if (pendingParam && param === pendingParam) setPendingParam(null);
      return;
    }
    setDroppedParamsConfig((prevConfig) => ({
      ...prevConfig,
      [param]: {
        ...prevConfig[param], // Preserve other data source configs for this param
        [dataSource]: values, // Set/update config for this specific data source
      },
    }));

    setPendingParam(param);
    setIsEditMode(false);
    setModalOpen(false);
  };

  const handleListTypeChange = (event) => {
    setSelectedListType(event.target.value);
  };
  const areAnyChipsPresent = () => {
    return Object.values(droppedParamsBySource).some(
      (params) => params && params.length > 0
    );
  };

  const openEditModal = (paramToEdit) => {
    setPendingParam(paramToEdit);
    setModalOpen(true);
  };

  const handleMoveChip = (dataSource, paramToMove, direction) => {
    const currentParams = [...(droppedParamsBySource[dataSource] || [])];
    const indexToMove = currentParams.indexOf(paramToMove);
    if (indexToMove === -1) return;
    const newIndex = indexToMove + direction;

    if (newIndex >= 0 && newIndex < currentParams.length) {
      const updatedParams = [...currentParams];
      const [movedParam] = updatedParams.splice(indexToMove, 1);
      updatedParams.splice(newIndex, 0, movedParam);
      dispatch({
        type: "dragData/reorderDroppedParams",
        payload: { dataSource, params: updatedParams },
      });
      // callKpiFilterCountApi();
      setPendingParam(paramToMove);
    }
  };
  const getListData = () => {
    if (!selectedListType || !countsData) return {};
    const listTypeKey = selectedListType.replace(" ", "_");
    return countsData[listTypeKey] || {};
  };

  return (
    <>
      <main className="hcpace-main">
        <section
          className="data-source-cards-flowchart"
          style={{
            background: "transparent",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            minHeight: "410px",
            height: "auto",
            marginTop: "0px",
            border: "none",
            paddingLeft: "0px",
          }}
        >
          <div
            className="data-source-cards-flowchart"
            style={{
              height: "auto",
              marginTop: "22px",

              display: "flex",
              flexDirection: "column",
              marginBottom: "1rem",

              padding: "1rem",
              minHeight: "420px",
              background: "white",
              paddingLeft: "23px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", gap: "25%" }}>
              <div>
                {" "}
                <h3
                  style={{
                    marginBottom: "10px",
                    fontWeight: "500",
                    marginTop: "5px",
                    fontSize: "18px",
                    letterSpacing: "0px",
                  }}
                >
                  Flow Chart
                </h3>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                maxHeight: "350px",
                // overflowY: "auto",
                gap: "10px",
              }}
            >
              {dataSources.map((dataSource, index) => (
                <div
                  className="drop-parameter vertical-flow"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    marginBottom: "1rem",
                    border: `2px solid ${
                      operatorButtonColors[index % operatorButtonColors.length]
                    }`,
                    borderRadius: "5px",
                    padding: "1rem",
                    // minHeight: "284px",
                    background: "white",
                    maxWidth: "259.4px",
                    position: "relative",
                    // overflow: "hidden",
                    // minHeight: "284px",
                    height: "320px",
                    overflowY: "auto",
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();

                    const customData = e.dataTransfer.getData("customFilter");
                    if (customData) {
                      try {
                        const parsed = JSON.parse(customData);
                        const chip = {
                          name: parsed.name,
                          // count: Math.floor(Math.random() * 100) + 1,
                          id: `${parsed.name}-${Date.now()}`,
                        };
                        // console.log("parsed datasource", parsed.dataSource);

                        const firstDataSource = parsed.dataSources[0];

                        if (parsed.dataSources.includes(dataSource)) {
                          setCustomFilterChips((prev) => {
                            const updated = {
                              ...prev,
                              [firstDataSource]: [
                                ...(prev[firstDataSource] || []),
                                chip,
                              ],
                            };
                            setCustomFilterStatus(true);
                            return updated;
                          });
                        }
                      } catch (err) {
                        console.error("Invalid custom filter data:", err);
                      }
                      return;
                    }

                    // Normal parameter drop logic (unchanged)
                    const param = e.dataTransfer.getData("text/plain").trim();
                    if (
                      param &&
                      selectedkpiData &&
                      selectedkpiData.length > 0 &&
                      kpiConfig
                    ) {
                      const sourcesToAdd = new Set();
                      selectedkpiData.forEach((kpiName) => {
                        const kpiConfigForKpi = kpiConfig[kpiName];
                        if (kpiConfigForKpi) {
                          for (const level1 in kpiConfigForKpi) {
                            if (
                              kpiConfigForKpi.hasOwnProperty(level1) &&
                              kpiConfigForKpi[level1] &&
                              kpiConfigForKpi[level1][param]
                            ) {
                              kpiConfigForKpi[level1][param].forEach(
                                (source) => {
                                  sourcesToAdd.add(source.trim());
                                }
                              );
                              break;
                            }
                          }
                        }
                      });

                      dispatch({
                        type: "dragData/addDroppedParam",
                        payload: { param, sources: Array.from(sourcesToAdd) },
                      });
                      dispatch(
                        setDragData({
                          dragData: [...dragData, param],
                          actionType: "add",
                        })
                      );
                    }
                  }}
                >
                  <h5 className="drop-names">{dataSource}</h5>

                  {(droppedParamsBySource[dataSource] || []).map(
                    (param, idx) => (
                      <div
                        key={`${dataSource}-${param}-${idx}`}
                        className={`dp-chip flow-item ${
                          isLoading ? "chip-loading" : ""
                        }`}
                        style={{
                          position: "relative",
                          marginBottom: "0px",
                          padding: "8px 12px",
                          border: "1px solid #ccc",
                          width: "92%",
                          borderRadius: "5px",
                          color:
                            selectedChip.dataSource === dataSource &&
                            selectedChip.index === idx
                              ? "white"
                              : "#001A50",
                          height: "auto",
                          display: "block",
                          // display: "flex",
                          alignItems: "center",
                          background:
                            selectedChip.dataSource === dataSource &&
                            selectedChip.index === idx
                              ? "#0057d9"
                              : "#D7DFE9",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setShowTable(true);
                            setPreviousParams(
                              droppedParamsBySource[dataSource]?.slice(
                                0,
                                idx + 1
                              )
                            );
                            handleChipClick(idx, dataSource);

                            setSelectedChip({ dataSource, index: idx });
                            e.stopPropagation();
                          }}
                        >
                          {param}
                          {countsData[dataSource]?.[param] !== undefined && (
                            <span style={{ marginLeft: "0px" }}>
                              ({countsData[dataSource][param]})
                            </span>
                          )}
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            {idx > 0 && (
                              <ArrowUpward
                                fontSize="12px"
                                style={{
                                  cursor: "pointer",
                                  marginRight: "4px",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentParams = [
                                    ...(droppedParamsBySource[dataSource] ||
                                      []),
                                  ];
                                  const indexToMove =
                                    currentParams.indexOf(param);
                                  if (indexToMove > 0) {
                                    const newParams = [...currentParams];
                                    [
                                      newParams[indexToMove],
                                      newParams[indexToMove - 1],
                                    ] = [
                                      newParams[indexToMove - 1],
                                      newParams[indexToMove],
                                    ];
                                    dispatch({
                                      type: "dragData/reorderDroppedParams",
                                      payload: {
                                        dataSource,
                                        params: newParams,
                                      },
                                    });
                                    setPosition(true);
                                    // callKpiFilterCountApi();
                                  }
                                }}
                              />
                            )}
                            {idx <
                              (droppedParamsBySource[dataSource] || []).length -
                                1 && (
                              <ArrowDownward
                                fontSize="12px"
                                style={{
                                  cursor: "pointer",
                                  marginRight: "4px",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentParams = [
                                    ...(droppedParamsBySource[dataSource] ||
                                      []),
                                  ];
                                  const indexToMove =
                                    currentParams.indexOf(param);
                                  if (indexToMove < currentParams.length - 1) {
                                    const newParams = [...currentParams];
                                    [
                                      newParams[indexToMove],
                                      newParams[indexToMove + 1],
                                    ] = [
                                      newParams[indexToMove + 1],
                                      newParams[indexToMove],
                                    ];
                                    dispatch({
                                      type: "dragData/reorderDroppedParams",
                                      payload: {
                                        dataSource,
                                        params: newParams,
                                      },
                                    });
                                    setPosition(true);
                                    // callKpiFilterCountApi();
                                  }
                                }}
                              />
                            )}

                            <EditIcon
                              fontSize="12px"
                              style={{ marginLeft: "8px", cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditMode(true);
                                setPendingParam(param);
                                const timePeriodParams = [
                                  "Year",
                                  "Month",
                                  "Quarter",
                                  "Week",
                                  "Date",
                                  "Start Date Available",
                                  "End Date Available",
                                  "Diagnosis Min Date",
                                ];
                                if (timePeriodParams.includes(param)) {
                                  setModalOpen(true);
                                  // setDateModalOpen(true); // DateParameterModal is not imported in the new code
                                } else {
                                  setModalOpen(true);
                                }
                              }}
                            />
                            {/* <CloseIcon
                              fontSize="12px"
                              className="dp-chip-remove"
                              onClick={() => {
                                dispatch(
                                  removeDroppedParam({
                                    param,
                                    source: dataSource,
                                  })
                                );

                                setDroppedParamsConfig((prevConfig) => {
                                  const updatedConfig = { ...prevConfig };
                                  if (updatedConfig[param]?.[dataSource]) {
                                    delete updatedConfig[param][dataSource];
                                    if (
                                      Object.keys(updatedConfig[param])
                                        .length === 0
                                    ) {
                                      delete updatedConfig[param];
                                    }
                                  }
                                  return updatedConfig;
                                });
                                setSourceOfTrigger("cancel");
                                setIsCancelled(true);
                              }}
                            /> */}
                            <CloseIcon
                              fontSize="12px"
                              className="dp-chip-remove"
                              onClick={(e) => {
                                dispatch(
                                  removeDroppedParam({
                                    param,
                                    source: dataSource,
                                  })
                                );

                                // No config removal here — we are preserving the values
                                setSourceOfTrigger("cancel");
                                setIsCancelled(true);
                                e.stopPropagation();
                              }}
                            />
                          </div>
                        </span>
                        {idx <
                          (droppedParamsBySource[dataSource] || []).length -
                            1 && <div className="flow-arrow"></div>}
                      </div>
                    )
                  )}
                  {(customFilterChips[dataSource] || []).map((chip) => (
                    <div
                      key={chip.id}
                      className={`dp-chip flow-item ${
                        isLoading ? "chip-loading" : ""
                      }`}
                      style={{
                        position: "relative",
                        marginBottom: "0px",
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        width: "auto",
                        borderRadius: "5px",
                        color: "#001A50",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        background: "#D7DFE9",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          cursor: "pointer",
                        }}
                      >
                        {chip.name}(
                        {countsData[dataSource]?.ww !== undefined
                          ? countsData[dataSource].ww
                          : "22"}
                        {/* or 0 or loading... */}){/* ({chip.count}) */}
                      </span>
                      <CloseIcon
                        fontSize="12px"
                        style={{ cursor: "pointer", marginLeft: "6px" }}
                        onClick={() => {
                          setCustomFilterChips((prev) => ({
                            ...prev,
                            [dataSource]: (prev[dataSource] || []).filter(
                              (c) => c.id !== chip.id
                            ),
                          }));
                          setSourceOfTrigger("cancel");
                          setIsCancelled(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
                // </div>
              ))}
            </div>
          </div>
          <div>
            {areAnyChipsPresent() && (
              <div
                className="drop-parameter vertical-flow"
                style={{
                  overflowY: "auto",
                  overflowX: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "1rem",
                  marginTop: "21px",
                  border: "1px solid #CACBCE",
                  borderRadius: "10px",
                  padding: "1rem",
                  height: "422px",
                  background: "white",

                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row,",
                    padding: "0px",
                  }}
                >
                  <FormControl
                    component="fieldset"
                    disabled={!areAnyChipsPresent()}
                    className="drop-names"
                  >
                    <RadioGroup
                      aria-label="list type"
                      name="list-type"
                      value={selectedListType}
                      onChange={handleListTypeChange}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <FormControlLabel
                        className="drop-names"
                        value="Unique List"
                        control={<Radio />}
                        label="Unique List"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                            fontSize: "14px",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="Overlap List"
                        control={<Radio />}
                        label="Overlap List"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                            fontSize: "14px",
                          },
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>

                <div
                  className="drop-parameter vertical-flow"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    marginBottom: "1rem",
                    border: "2px solid #ccc",
                    borderRadius: "5px",
                    padding: "1rem",
                    // minHeight: "284px",
                    background: "white",
                    width: "259.4px",
                    position: "relative",
                    marginTop: "0px",
                    // overflow: "hidden",
                    height: "284px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <h5 className="drop-names">{selectedListType}</h5>

                  {Object.entries(getListData()).map(
                    ([key, value], index, array) => (
                      <div
                        key={key}
                        className="dp-chip"
                        style={{
                          position: "relative",
                          marginBottom: "0px",
                          padding: "8px 12px",
                          border: "1px solid #ccc",
                          minWidth: "207.39px",
                          borderRadius: "5px",
                          color: "#001A50",
                          // height: "auto",
                          height: "38px",
                          display: "flex",

                          alignItems: "center",
                          background: "#D7DFE9",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                        onClick={() => handleListClick(index)}
                      >
                        {key}: {value}
                        {/* Only show arrow if not the last item */}
                        {index < array.length - 1 && (
                          <div className="flow-arrow"></div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {showTable && (
          <section
            className="data-source-cards-tabs"
            style={{ background: "#FFFFFF" }}
          >
            <ResultTabs />
          </section>
        )}

        <ParameterModal
          open={modalOpen}
          param={pendingParam}
          selected={Object.entries(droppedParamsBySource).reduce(
            (acc, [source, params]) => {
              if (
                params.includes(pendingParam) &&
                droppedParamsConfig[pendingParam]?.[source]
              ) {
                acc = droppedParamsConfig[pendingParam][source];
              }
              return acc;
            },
            []
          )}
          onSubmit={(data) =>
            handleModalSubmit({
              ...data,
              dataSource: Object.keys(droppedParamsBySource).find((source) =>
                droppedParamsBySource[source]?.includes(pendingParam)
              ),
            })
          }
          onCancel={() => {
            if (!pendingParam) return;
            const hasConfiguration = !!droppedParamsConfig[pendingParam];
            if (!hasConfiguration) {
              for (const source in droppedParamsBySource) {
                if (droppedParamsBySource[source]?.includes(pendingParam)) {
                  dispatch(removeDroppedParam({ param: pendingParam, source }));
                }
              }
              dispatch(
                setDragData({
                  dragData: dragData.filter((item) => item !== pendingParam),
                  actionType: "remove",
                })
              );
            }
            setIsEditMode(false);
            setModalOpen(false);
            setPendingParam(null);
          }}
        />
        {/* DateParameterModal is not included in the new code */}
      </main>
    </>
  );
};
export default MainContent;
