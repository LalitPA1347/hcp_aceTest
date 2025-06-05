/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./MainContent.css"; // Styles for this component
// import DescriptiveInsightsTable from "../DescriptiveInsightsTable/DescriptiveInsightsTable";
import ParameterModal from "../Popup/ParameterModal";
import { nanoid } from "@reduxjs/toolkit"; // Add this line
import {
  setDragData,
  removeDroppedParam,
  addDroppedParam,
  setFlowChartData,
} from "../../../../../redux/descriptiveInsights/hcpaceSlice";

import { kpiFilterCountApi } from "../../../../../services/businessRules.service";
import {
  setColumns,
  sethcpAceApiData,
  setRows,
  sethcpLoader,
  setOutputTabData,
  setDecilingData,
} from "../../../../../redux/descriptiveInsights/tableSlice";

import {
  decilingApi,
  hcpAceApi,
  saveFlowChartDataApi,
} from "../../../../../services/DescriptiveInsights/hcpace.service";
import ResultTabs from "../ResultTabs/ResultTabs";
import FlowChartPanel from "./Flowchart/FlowChartPanel";
import { toast } from "react-toastify";

const MainContent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingParam, setPendingParam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousParams, setPreviousParams] = useState([]);
  const [droppedParamsConfig, setDroppedParamsConfig] = useState({});
  const [countsData, setCountsData] = useState({});

  const [customFilterStatus, setCustomFilterStatus] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [selectedChip, setSelectedChip] = useState({
    dataSource: null,
    index: null,
  });
  const [position, setPosition] = useState(false);
  const [selectedListType, setSelectedListType] = useState(""); // 'Unique List' or 'Overlap List'
  const [filtered, setFiltered] = useState(null);
  const [defaultTab, setDefaultTab] = useState(0);
  const selectedkpiData = useSelector(
    (state) => state.dragData.selectedkpiData
  );
  const savedFlowChartData = useSelector(
    (state) => state.dragData.savedFlowChartData
  );
  // console.log("selectedkpidata", selectedkpiData);

  const [sourceOfTrigger, setSourceOfTrigger] = useState("");
  const kpiConfig = useSelector((state) => state.dragData.Kpiconfigs);

  // console.log("kpiconfig", kpiConfig);
  const dragData = useSelector((state) => state.dragData.dragData);
  // console.log("dragdata", dragData);
  const actionType = useSelector((state) => state.dragData.actionType);
  // console.log("actiontype", actionType);
  const [filterConditions, setFilterdConditions] = useState("");
  const [showTable, setShowTable] = useState(false);
  const selectedDataSources = useSelector(
    (state) => state.dragData.selectedDataSources
  );
  // console.log("selecteddatasource", selectedDataSources);
  const droppedParamsBySource = useSelector(
    (state) => state.dragData.droppedParamsBySource
  );
  // console.log("droppedparamsbysource", droppedParamsBySource);
  const dispatch = useDispatch();
  const [dataSources, setDataSources] = useState([]);

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
      const lastChip = dragData[dragData.length - 1]; // now it's a chip object
      const paramName = lastChip?.name;
      const chipType = lastChip?.type;

      const alreadyConfigured =
        droppedParamsConfig[paramName] &&
        Object.keys(droppedParamsConfig[paramName]).length > 0;

      const isRegularParam = chipType === "param";

      if (isRegularParam && paramName && !pendingParam && !alreadyConfigured) {
        setPendingParam(lastChip); // set the full chip object
        setModalOpen(true);
      }
    }

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

  const handleTabChange = (newTab) => {
    setDefaultTab(newTab);
  };

  useEffect(() => {
    if (actionType === "remove" && Array.isArray(dragData)) {
      setIsCancelled(true);
      setSourceOfTrigger("cancel");

      const remainingIds = new Set(dragData.map((chip) => chip.id));

      // Loop over each source and remove chips that are no longer in dragData
      for (const source in droppedParamsBySource) {
        droppedParamsBySource[source].forEach((chip) => {
          if (
            chip.type === "param" && // ✅ Only act on param chips
            !remainingIds.has(chip.id)
          ) {
            dispatch(
              removeDroppedParam({
                chipId: chip.id,
                dataSource: source,
              })
            );
          }
        });
      }

      // Also update droppedParamsConfig if needed
      setDroppedParamsConfig((prev) => {
        const updated = {};
        dragData.forEach((chip) => {
          if (chip.type === "param" && prev[chip.name]) {
            updated[chip.name] = prev[chip.name];
          }
        });
        return updated;
      });
    }
  }, [actionType, dragData, droppedParamsBySource]);

  useEffect(() => {
    if (sourceOfTrigger === "custom" || sourceOfTrigger === "reorder") {
      callKpiFilterCountApi();
      setCustomFilterStatus(false);
      setPosition(false);
      setSourceOfTrigger(null); // Reset
    }
  }, [customFilterStatus, position, sourceOfTrigger]);

  useEffect(() => {
    if (
      !isEditMode &&
      pendingParam?.type === "param" &&
      sourceOfTrigger !== "custom" &&
      sourceOfTrigger !== "reorder" &&
      pendingParam?.name &&
      droppedParamsConfig[pendingParam.name] &&
      Object.keys(droppedParamsConfig[pendingParam.name]).length > 0
    ) {
      callKpiFilterCountApi();
      // setSourceOfTrigger(null);
    }
  }, [droppedParamsConfig, pendingParam, sourceOfTrigger]);

  useEffect(() => {
    if (sourceOfTrigger) {
      const timer = setTimeout(() => setSourceOfTrigger(null), 200);
      return () => clearTimeout(timer);
    }
  }, [sourceOfTrigger]);

  useEffect(() => {
    if (pendingParam && pendingParam.id) {
      // Check if pendingParam is a valid object with an ID
      setModalOpen(true); // Open the modal
    } else {
      // If pendingParam becomes null (e.g., after modal close/cancel),
      // ensure modal is closed as well.
      setModalOpen(false);
    }
  }, [pendingParam]);

const handleChipClick = async (clickedIndex, dataSource) => {
  setSelectedListType(""); // Reset selected list type on chip click
  if (defaultTab !== 0) setDefaultTab(0);

 
  const sliced = droppedParamsBySource[dataSource]?.slice(0, clickedIndex + 1);
  setPreviousParams(sliced);

  const getFilteredSlicedValues = (dataSource, filterConditions, sliced) => {
    const result = {};

    const actualDataSourceKey = Object.keys(filterConditions).find(
      (key) => key.toLowerCase() === dataSource.toLowerCase()
    );


    if (!actualDataSourceKey) {
      console.warn(`Data source "${dataSource}" not found in filterConditions.`);
      return result;
    }

    const dataSourceFilters = filterConditions[actualDataSourceKey];
     
    let customFilterCounter = 1;

    for (const sliceObj of sliced) {
      const key = sliceObj.name;
      console.log(key,'key --')
      if (sliceObj.type === "customFilter") {
        const customKey = `customFilter${customFilterCounter++}`;
        result[customKey] = sliceObj.data; 
      } else if (dataSourceFilters.hasOwnProperty(key)) {
        result[key] = dataSourceFilters[key]; 
      }
    }
    
    return { [actualDataSourceKey]: result };
  };

  const filtered = getFilteredSlicedValues(dataSource, filterConditions, sliced);
  setFiltered(filtered);

  const payload = {
    Kpi: selectedkpiData,
    filter_condition: filtered,
    same_kpi_with_added_filter: true,
  };


  try {
    dispatch(sethcpLoader(true));
    const response = await hcpAceApi(payload);
    if (response?.status === 200 && response.data) {
      dispatch(sethcpAceApiData(response.data));
      const apiRows = response.data[0].Rows || [];
      const apiColumns = response.data[0].Columns || [];

      const fieldAliasMap = {
        specialty: "spec",
        total_calls: "total_calls",
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
      dispatch(setOutputTabData({ columns: transformedColumns, rows: transformedRows }));
      setShowTable(true);
    }
  } catch (error) {
    console.error("Error calling hcpAceApi:", error);
  } finally {
    dispatch(sethcpLoader(false));
  }
};


  const handleListClick = async (index) => {
    defaultTab !== 0 && setDefaultTab(0);
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
          dispatch(
            setOutputTabData({
              columns: allTables[0].columns,
              rows: allTables[0].rows,
            })
          );
        }

        setShowTable(true);
      }
    } catch (error) {
      console.error("Error calling hcpAceApi:", error);
      dispatch(sethcpLoader(false));
    }
  };
  const generateKpiFilterPayload = ({
    droppedParamsBySource,
    droppedParamsConfig,
    selectedkpiData,
  }) => {
    const filterCondition = {};

    const allRelevantDataSourceNames = Object.keys(droppedParamsBySource);

    for (const dataSourceName of allRelevantDataSourceNames) {
      const chipsInDataSource = droppedParamsBySource[dataSourceName];
      if (!chipsInDataSource || chipsInDataSource.length === 0) continue;

      filterCondition[dataSourceName] = {};
      let customFilterCounter = 1;

      chipsInDataSource.forEach((chip) => {
        if (chip.type === "param") {
          const paramName = chip.name;

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
        } else if (chip.type === "customFilter") {
          const filterKey = `customFilter${customFilterCounter}`;
          filterCondition[dataSourceName][filterKey] = chip.data || {};
          customFilterCounter++;
        }
      });

      if (Object.keys(filterCondition[dataSourceName]).length === 0) {
        delete filterCondition[dataSourceName];
      }
    }

    const kpiPayload = Array.isArray(selectedkpiData)
      ? selectedkpiData
      : selectedkpiData
      ? [selectedkpiData]
      : [];

    return {
      kpiPayload,
      filterCondition,
    };
  };

  const callKpiFilterCountApi = () => {
    const { kpiPayload, filterCondition } = generateKpiFilterPayload({
      droppedParamsBySource,
      droppedParamsConfig,
      selectedkpiData,
    });

    if (kpiPayload.length === 0) {
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
      setCountsData({});
      setIsLoading(false);
      if (pendingParam) setPendingParam(null);
      return;
    }

    const payload = {
      Kpi: kpiPayload,
      filter_condition: filterCondition,
      same_kpi_with_added_filter: true,
    };

    setFilterdConditions(filterCondition);
    setIsLoading(true);

    kpiFilterCountApi(payload)
      .then((res) => {
        setCountsData(res?.data?.Counts || {});
      })
      .catch((error) => {
        console.error("Error fetching kpiFilterCountApi:", error);
        setCountsData({});
      })
      .finally(() => {
        setIsLoading(false);
        if (pendingParam) setPendingParam(null);
      });
  };

  const handleModalSubmit = ({ param, dataSource, values }) => {
    if (!param || !dataSource) {
      setIsEditMode(false);
      setModalOpen(false);

      if (pendingParam && param === pendingParam?.name) setPendingParam(null);
      return;
    }

    // If `param` is a string, find the chip object from current dropped list
    let paramChip = param;
    if (typeof param === "string") {
      const sourceChips = droppedParamsBySource[dataSource] || [];
      paramChip = sourceChips.find((chip) => chip.name === param);
    }

    if (!paramChip || !paramChip.id) {
      console.warn("Could not locate valid chip object for param", param);
      setIsEditMode(false);
      setModalOpen(false);
      return;
    }

    // Update config using chip name and dataSource
    setDroppedParamsConfig((prevConfig) => ({
      ...prevConfig,
      [paramChip.name]: {
        ...prevConfig[paramChip.name],
        [dataSource]: values,
      },
    }));

    setPendingParam(paramChip); // Store full chip object
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

  const getListData = () => {
    if (!selectedListType || !countsData) return {};
    const listTypeKey = selectedListType.replace(" ", "_");
    return countsData[listTypeKey] || {};
  };

  const handleDrop = (e, dataSource) => {
    e.preventDefault();

    const existingCustomFilters =
      droppedParamsBySource[dataSource]?.filter(
        (chip) => chip.type === "customFilter"
      ) || [];

    const newCountKey = `customFilter${existingCustomFilters.length + 1}`;

    // 1. Handle Custom Filter Drop
    const customData = e.dataTransfer.getData("customFilter");
    if (customData) {
      try {
        const parsed = JSON.parse(customData);
        const chip = {
          name: parsed.name,
          id: `${parsed.name}-${Date.now()}-${nanoid()}`,
          type: "customFilter",
          data: parsed.data,
          countKey: newCountKey,
        };

        const firstDataSource = parsed.dataSources[0];

        if (firstDataSource === dataSource) {
          dispatch(
            addDroppedParam({
              chip,
              dataSource: firstDataSource,
            })
          );
          setSourceOfTrigger("custom");
          setCustomFilterStatus(true);
        }
      } catch (err) {
        console.error("Invalid custom filter data:", err);
      }
      return; // Exit after handling custom
    }

    // 2. Handle Regular Parameter Drop
    const paramName = e.dataTransfer.getData("text/plain").trim();
    if (
      paramName &&
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
              kpiConfigForKpi[level1][paramName]
            ) {
              kpiConfigForKpi[level1][paramName].forEach((source) => {
                sourcesToAdd.add(source.trim());
              });
              break;
            }
          }
        }
      });

      const newParamChip = {
        id: `${paramName}-${nanoid()}`,
        type: "param",
        name: paramName,
      };

      dispatch(
        addDroppedParam({
          chip: newParamChip,
          sources: Array.from(sourcesToAdd),
        })
      );

      // ✅ FIXED: Push full chip object to dragData, not just a string
      dispatch(
        setDragData({
          dragData: [...dragData, newParamChip],
          actionType: "add",
        })
      );
    }
  };

  const handleChipClickInternal = (e, idx, dataSource) => {
    e.stopPropagation();
    setShowTable(true);
    setPreviousParams(droppedParamsBySource[dataSource]?.slice(0, idx + 1));
    handleChipClick(idx, dataSource);

    // currentTab === 0
    //   ? handleChipClick(idx, dataSource)
    //   : fetchDecilingData(idx, dataSource);
    setSelectedChip({ dataSource, index: idx });
  };

  // Change parameter from 'param' to 'chipToMove' (or just 'chip')
  const handleMoveUp = (e, dataSource, chipToMove) => {
    // chipToMove is now the full chip object
    e.stopPropagation();
    const currentChips = [...(droppedParamsBySource[dataSource] || [])];
    // Find the index by comparing chip IDs
    const indexToMove = currentChips.findIndex(
      (chip) => chip.id === chipToMove.id
    );

    if (indexToMove > 0) {
      const newChips = [...currentChips];
      [newChips[indexToMove - 1], newChips[indexToMove]] = [
        newChips[indexToMove],
        newChips[indexToMove - 1],
      ];

      dispatch({
        type: "dragData/reorderDroppedParams",
        payload: { dataSource, chips: newChips }, // Ensure payload property name matches reducer expects 'chips'
      });
      setSourceOfTrigger("reorder");
      setPosition(true);

      // callKpiFilterCountApi();
    }
  };

  const handleMoveDown = (e, dataSource, chipToMove) => {
    // chipToMove is now the full chip object
    e.stopPropagation();
    const currentChips = [...(droppedParamsBySource[dataSource] || [])];
    // Find the index by comparing chip IDs
    const indexToMove = currentChips.findIndex(
      (chip) => chip.id === chipToMove.id
    );

    if (indexToMove < currentChips.length - 1) {
      const newChips = [...currentChips];
      [newChips[indexToMove], newChips[indexToMove + 1]] = [
        newChips[indexToMove + 1],
        newChips[indexToMove],
      ];

      dispatch({
        type: "dragData/reorderDroppedParams",
        payload: { dataSource, chips: newChips }, // Ensure payload property name matches reducer expects 'chips'
      });

      setSourceOfTrigger("reorder");
      setPosition(true);
      // callKpiFilterCountApi();
    }
  };

  const handleCloseClick = (e, chipToRemove, dataSource) => {
    e.stopPropagation();

    // The chipToRemove object now contains id, type, name, and potentially data
    dispatch(
      removeDroppedParam({
        chipId: chipToRemove.id, // Use the unique ID for removal
        dataSource: dataSource, // Pass the dataSource to target the specific array
      })
    );

    setSourceOfTrigger("cancel");
    setIsCancelled(true);
  };

  const handleEditClick = (e, chipToEdit) => {
    // chipToEdit is the full chip object
    e.stopPropagation();

    // If it's a custom filter chip, do nothing as per requirement
    if (chipToEdit.type === "customFilter") {
      console.log("Edit action not supported for custom filter chips yet.");
      return; // Exit the function
    }

    // Logic for regular parameter chips (chipToEdit.type === 'param')
    // We now set the ENTIRE chip object to pendingParam
    setIsEditMode(true);
    setPendingParam(chipToEdit); // <-- CHANGE THIS LINE

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

    // When checking against timePeriodParams, use chipToEdit.name
    if (timePeriodParams.includes(chipToEdit.name)) {
      // Use chipToEdit.name here
      setModalOpen(true);
      // setDateModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };
  const getSelectedConfig = () => {
    return Object.entries(droppedParamsBySource).reduce(
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
    );
  };

  const handleModalCancel = () => {
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
  };

  const handleFlowChartSave = async (FlowChartName ) => {
 
        const { kpiPayload, filterCondition } = generateKpiFilterPayload({
      droppedParamsBySource,
      droppedParamsConfig,
      selectedkpiData,
    });
    const payload = {
      FlowChartName: FlowChartName,
    Kpi: kpiPayload,
      filter_condition: filterCondition,
      same_kpi_with_added_filter: true,
    };
    const response = await saveFlowChartDataApi(payload);
    if (response?.status === 200) {
      dispatch(setFlowChartData([payload, ...savedFlowChartData]));
      toast.success("Flow Chart saved sucessfully")
    } else {
      console.error("Error fetching saved custom filters:", response);
    }
  };

  // Assuming pendingParam is now the full chip object when set

  // Assuming pendingParam is now the full chip object when set
  // e.g., setPendingParam(chipToEdit); in handleEditClick

  const handleModalSubmitWrapper = (data) => {
    // If pendingParam is a chip object (which it should be in edit mode)
    if (!pendingParam || !pendingParam.id) {
      console.error(
        "handleModalSubmitWrapper: pendingParam is not a valid chip object."
      );
      return; // Or handle this error more gracefully
    }

    // Find the dataSource where this specific chip (by ID) exists
    let dataSourceFound = null;
    for (const source in droppedParamsBySource) {
      if (
        droppedParamsBySource[source]?.some(
          (chip) => chip.id === pendingParam.id
        )
      ) {
        dataSourceFound = source;
        break;
      }
    }

    // If the chip wasn't found in any source (which implies an error in flow),
    // you might want to handle this case, e.g., by logging or preventing submission.
    if (!dataSourceFound) {
      console.warn(
        "handleModalSubmitWrapper: Chip not found in any dataSource for submission."
      );
      // You might decide to return here or proceed without a dataSource if handleModalSubmit can handle it
      // For now, we'll proceed assuming dataSource is nullable or handles 'undefined'.
    }

    handleModalSubmit({
      ...data,
      dataSource: dataSourceFound, // Pass the found dataSource
      // You might also want to pass the chip's ID or type if handleModalSubmit needs it
      chipId: pendingParam.id,
      chipType: pendingParam.type,
      chipName: pendingParam.name, // The original name string
    });
  };

  //   if (!pendingParam || !pendingParam.id) {
  //     console.error(
  //       "handleModalCancel: pendingParam is not a valid chip object."
  //     );
  //     setIsEditMode(false);
  //     setModalOpen(false);
  //     setPendingParam(null);
  //     return;
  //   }

  //   // Check if the current pendingParam (chip object) has an existing configuration
  //   // We assume droppedParamsConfig uses the chip's original name as key for 'param' type
  //   // and potentially the chip.id for 'customFilter' type if they have configs.
  //   // For now, let's assume droppedParamsConfig is only for 'param' types.
  //   const hasConfiguration =
  //     pendingParam.type === "param" && !!droppedParamsConfig[pendingParam.name];

  //   if (!hasConfiguration) {
  //     // If no configuration, remove the chip from all dataSources it exists in
  //     // and also from dragData (if it's a regular parameter).
  //     const sourcesToClean = [];
  //     for (const source in droppedParamsBySource) {
  //       if (
  //         droppedParamsBySource[source]?.some(
  //           (chip) => chip.id === pendingParam.id
  //         )
  //       ) {
  //         sourcesToClean.push(source);
  //       }
  //     }

  //     // Dispatch removal for each source where the chip was found
  //     sourcesToClean.forEach((source) => {
  //       dispatch(
  //         removeDroppedParam({ chipId: pendingParam.id, dataSource: source })
  //       );
  //     });

  //     // Only update dragData if the chip is a regular parameter
  //     if (pendingParam.type === "param") {
  //       dispatch(
  //         setDragData({
  //           dragData: dragData.filter((item) => item !== pendingParam.name), // Filter by param name string
  //           actionType: "remove",
  //         })
  //       );
  //     }
  //   }

  //   setIsEditMode(false);
  //   setModalOpen(false);
  //   setPendingParam(null); // Clear the pending chip
  // };
  return (
    <>
      <main className="hcpace-main">
        <FlowChartPanel
          dataSources={dataSources}
          operatorButtonColors={operatorButtonColors}
          droppedParamsBySource={droppedParamsBySource} // This now contains BOTH types of chips
          countsData={countsData}
          selectedChip={selectedChip}
          isLoading={isLoading}
          handleDrop={handleDrop}
          handleChipClickInternal={handleChipClickInternal}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleEditClick={handleEditClick}
          handleCloseClick={handleCloseClick}
          setSourceOfTrigger={setSourceOfTrigger}
          setIsCancelled={setIsCancelled}
          areAnyChipsPresent={areAnyChipsPresent}
          selectedListType={selectedListType}
          handleListTypeChange={handleListTypeChange}
          getListData={getListData}
          handleListClick={handleListClick}
          handleFlowChartSave={handleFlowChartSave}
        />

        {showTable && (
          <section
            className="data-source-cards-tabs"
            style={{ background: "#FFFFFF" }}
          >
            <ResultTabs
              filtered={filtered}
              dataSource={selectedChip.dataSource}
              selectedListType={selectedListType}
              onTabChange={handleTabChange}
              defaultTab={defaultTab}
              filterConditions={filterConditions}
            />
          </section>
        )}

        <ParameterModal
          open={modalOpen}
          param={pendingParam}
          selected={getSelectedConfig()}
          onSubmit={handleModalSubmitWrapper}
          onCancel={handleModalCancel}
        />
        {/* DateParameterModal is not included in the new code */}
      </main>
    </>
  );
};
export default MainContent;
