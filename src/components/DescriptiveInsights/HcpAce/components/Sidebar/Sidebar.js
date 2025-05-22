/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  ExpandMore as ChevronDownIcon,
  ExpandLess as ChevronUpIcon,
  AddOutlined as AddOutlinedIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

import { ReactComponent as ExpandAllIcon } from "../../../../../assets/images/imagesR/ArrowsOutSimple.svg";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DropdownMenuButton from "../Shared/MultiselectedDropdown/DropdownMenuButton";
import SearchParameterIcon from "../Shared/filterSVG/SearchParameterIcon";
import {
  setDragData,
  setKpisData,
  setKpiconfigs,
  setSelectedKpiData,
  addDroppedParam,
  removeDroppedParam,
  setSelectedDataSources,
  selectActiveParameters,
} from "../../../../../redux/descriptiveInsights/hcpaceSlice";
import "./Sidebar.css";
import { fetchDescriptiveInsightsApi } from "../../../../../services";
import Loader from "../Loader/Loader";

const Sidebar = ({ collapsed, onToggle }) => {
  const [kpiConfig, setKpiConfig] = useState({});
  const [selectedKpis, setSelectedKpis] = useState([]);
  const [openSections, setOpenSections] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredKpisState, setFilteredKpisState] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const dispatch = useDispatch();
  const activeParameters = useSelector(selectActiveParameters);
  const dragData = useSelector((state) => state.dragData.dragData);
  const kpiConfigRedux = useSelector((state) => state.dragData.Kpiconfigs);
  const selectedkpiData = useSelector(
    (state) => state.dragData.selectedkpiData
  );

  const droppedParamsBySource = useSelector(
    // Access the state outside the loop
    (state) => state.dragData.droppedParamsBySource
  );

  const handlePhysicianAnalyticsApi = async () => {
    setLoading(true);
    const payload = { Analytics_Section: "Adhocs" };
    try {
      const response = await fetchDescriptiveInsightsApi(payload);
      if (response?.data?.KPI_Information) {
        const data = response.data.KPI_Information;
        setKpiConfig(data);
        dispatch(setKpisData(response.data.Column_distinct_values));
        dispatch(setKpiconfigs(data));
        setSelectedKpis(selectedkpiData);
        // dispatch(setSelectedKpiData(Object.keys(data)));
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePhysicianAnalyticsApi();
  }, []);

  useEffect(() => {
    const filteredKpis = selectedKpis.filter((kpi) => {
      if (!searchText) return true;
      const lowerSearch = searchText.toLowerCase();
      if (kpi.toLowerCase().includes(lowerSearch)) return true;
      const sections = kpiConfig[kpi] || {};
      return Object.entries(sections).some(([header, items]) => {
        if (header.toLowerCase().includes(lowerSearch)) return true;
        const sectionItems = Array.isArray(items)
          ? items
          : typeof items === "object"
          ? Object.keys(items)
          : [];
        return sectionItems.some((item) =>
          item.toLowerCase().includes(lowerSearch)
        );
      });
    });
    setFilteredKpisState(filteredKpis);
  }, [searchText, selectedKpis, kpiConfig]);

  const handleCheckboxChangeKpi = (event) => {
    const { value, checked } = event.target;
    let newSelected;
    if (value === "*") {
      newSelected = checked ? Object.keys(kpiConfig) : [];
    } else {
      newSelected = checked
        ? [...selectedKpis, value]
        : selectedKpis.filter((kpi) => kpi !== value);
    }
    setSelectedKpis(newSelected);
    dispatch(setSelectedKpiData(newSelected));
    setOpenSections([]);
  };

  const toggleSection = (header) => {
    setOpenSections((prev) =>
      prev.includes(header)
        ? prev.filter((h) => h !== header)
        : [...prev, header]
    );
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item);
  };

  const handleExpandAll = () => {
    const allHeaders = Object.values(kpiConfig).flatMap((sec) =>
      Object.keys(sec)
    );
    setOpenSections(Array.from(new Set(allHeaders)));
  };

  const handleClearAll = () => {
    setSearchText("");
    setSelectedKpis(Object.keys(kpiConfig));
    setOpenSections([]);
    setSelectedDatasets([]);
  };

  const handleDatasetCheckboxChange = (dataset) => {
    setSelectedDatasets((prev) => {
      const updatedDatasets = prev.includes(dataset)
        ? prev.filter((d) => d !== dataset)
        : [...prev, dataset];
      setSelectedDatasets(updatedDatasets);
      dispatch(setSelectedDataSources(updatedDatasets));
      return updatedDatasets;
    });
  };
  const handleAddRemoveParam = (paramName, isCurrentlyDragged) => {
    const updatedDragData = isCurrentlyDragged
      ? dragData.filter((d) => d !== paramName)
      : [...dragData, paramName];

    dispatch(
      setDragData({
        dragData: updatedDragData,
        actionType: isCurrentlyDragged ? "remove" : "add",
      })
    );

    if (!isCurrentlyDragged) {
      // Logic to find sources for the parameter when adding
      if (
        paramName &&
        selectedkpiData &&
        selectedkpiData.length > 0 &&
        kpiConfigRedux
      ) {
        const sourcesToAdd = new Set();
        selectedkpiData.forEach((kpiName) => {
          const kpiConfigForKpi = kpiConfigRedux[kpiName];
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
        dispatch(
          addDroppedParam({
            param: paramName,
            sources: Array.from(sourcesToAdd),
          })
        );
      }
    } else {
      // Logic to find and remove from droppedParamsBySource when removing
      if (paramName && droppedParamsBySource) {
        for (const source in droppedParamsBySource) {
          if (droppedParamsBySource[source]?.includes(paramName)) {
            dispatch(removeDroppedParam({ param: paramName, source }));
            // It's possible a parameter exists in multiple sources, so we don't break here.
          }
        }
      }
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="filter-name">Filter</div>
      {!collapsed && (
        <div className="filter-actions">
          <Button
            endIcon={<ExpandAllIcon style={{ width: 18, height: 18 }} />}
            onClick={handleExpandAll}
            sx={{
              background: "#EBF2FF",
              border: "none",
              borderRadius: "5px",
              width: "154px",
              color: "black",
              textTransform: "none",
              "&:hover": {
                background: "#EBF2FF",
                boxShadow: "none",
              },
            }}
          >
            Expand All Filter
          </Button>
          <Button
            variant="text"
            endIcon={<ClearIcon />}
            color="error"
            onClick={handleClearAll}
            sx={{
              background: "#FFF5F4",
              border: "none",
              width: "102px",
              borderRadius: "5px",
              color: "#D32F2F",
              textTransform: "none",
            }}
          >
            Clear All
          </Button>
        </div>
      )}
      {!collapsed && (
        <div className="sidebar-content">
          {loading ? (
            <div className="loader-container">
              <Loader />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "16px" }} />
              <div className="search-parameters-wrapper">
                <div className="search-parameters-header">
                  <span className="filter-icon">
                    <SearchParameterIcon />
                  </span>
                  <span className="search-parameters-title">
                    Search Parameters
                  </span>
                </div>
                <div className="search-bar-wrapper">
                  <span className="search-icon">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Search"
                    className="styled-search-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <DropdownMenuButton
                  buttonLabel="Select KPI"
                  options={Object.keys(kpiConfig)}
                  selectedOptions={selectedKpis}
                  handleClick={(e) => setAnchorEl(e.currentTarget)}
                  handleCheckboxChange={handleCheckboxChangeKpi}
                  anchorEl={anchorEl}
                  handleClose={() => setAnchorEl(null)}
                />
              </div>

              {filteredKpisState.length > 0 &&
                (() => {
                  const mergedHeaders = {};

                  filteredKpisState.forEach((kpi) => {
                    const kpiData = kpiConfig[kpi] || {};
                    Object.entries(kpiData).forEach(([header, items]) => {
                      const normalizedHeader = header.toLowerCase();

                      const sectionItems = Array.isArray(items)
                        ? items.map((v) => ({
                            displayName: v,
                            value: v,
                            dataSource: kpiData?.DataSource || [],
                          }))
                        : typeof items === "object"
                        ? Object.entries(items).map(
                            ([displayName, dataSource]) => ({
                              displayName,
                              value: displayName,
                              dataSource,
                            })
                          )
                        : [];

                      sectionItems.forEach(
                        ({ displayName, value, dataSource }) => {
                          const key = normalizedHeader;
                          const lowerItem = displayName.toLowerCase();

                          if (!mergedHeaders[key]) {
                            mergedHeaders[key] = {
                              originalHeader: header,
                              itemsMap: {},
                            };
                          }

                          if (!mergedHeaders[key].itemsMap[lowerItem]) {
                            mergedHeaders[key].itemsMap[lowerItem] = {
                              displayName,
                              value,
                              dataSources: new Set(dataSource),
                              kpis: new Set(),
                            };
                          } else {
                            dataSource.forEach((ds) =>
                              mergedHeaders[key].itemsMap[
                                lowerItem
                              ].dataSources.add(ds)
                            );
                          }
                          mergedHeaders[key].itemsMap[lowerItem].kpis.add(kpi);
                        }
                      );
                    });
                  });

                  // Sort to show "DataSource" first
                  const sortedHeaders = Object.entries(mergedHeaders).sort(
                    ([a], [b]) =>
                      a.includes("datasource")
                        ? -1
                        : b.includes("datasource")
                        ? 1
                        : 0
                  );

                  return sortedHeaders.map(
                    ([normalizedHeader, { originalHeader, itemsMap }]) => {
                      const isDataSourceSection =
                        normalizedHeader.includes("datasource");
                      const isOpen = openSections.includes(originalHeader);

                      const filteredItems = Object.values(itemsMap).filter(
                        ({ displayName, value, dataSources }) => {
                          const searchTextMatch = displayName
                            .toLowerCase()
                            .includes(searchText.toLowerCase());

                          const dataSourceMatch =
                            isDataSourceSection ||
                            selectedDatasets.length === 0 ||
                            [...dataSources].some((ds) =>
                              selectedDatasets.includes(ds)
                            );

                          return searchTextMatch && dataSourceMatch;
                        }
                      );

                      if (!filteredItems.length) return null;

                      return (
                        <div key={originalHeader} className="param-group">
                          <div
                            className="param-header"
                            onClick={() => toggleSection(originalHeader)}
                          >
                            <span>{originalHeader}</span>
                            {isOpen ? (
                              <ChevronUpIcon className="icon-btn" />
                            ) : (
                              <ChevronDownIcon className="icon-btn" />
                            )}
                          </div>

                          {isOpen &&
                            filteredItems.map(
                              ({ displayName, value, dataSources }) => {
                                const isDragged =
                                  dragData.includes(displayName);
                                const isDataSourceItem =
                                  normalizedHeader.includes("datasource");
                                const isParamActive =
                                  activeParameters.includes(displayName); // Check if parameter has active chips
                                return (
                                  <div
                                    style={{ display: "flex" }}
                                    key={`${displayName}-${value}`}
                                  >
                                    <div
                                      className="param-data-parent-wrapper"
                                      draggable={!isDataSourceItem}
                                      onDragStart={(e) => {
                                        if (!isDataSourceItem) {
                                          handleDragStart(e, displayName);
                                        } else {
                                          e.preventDefault();
                                        }
                                      }}
                                      style={{
                                        cursor: isDataSourceItem
                                          ? "default"
                                          : "grab",
                                        width: isDataSourceItem
                                          ? "288px"
                                          : "215px",
                                        color: "#262526",
                                        borderColor: isParamActive
                                          ? "#0057D9"
                                          : "#CACBCE",
                                        backgroundColor: isParamActive
                                          ? "#EBF2FF"
                                          : "transparent", 
                                      }}
                                    >
                                      {isDataSourceItem ? (
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={selectedDatasets.includes(
                                                value
                                              )}
                                              onChange={() =>
                                                handleDatasetCheckboxChange(
                                                  value
                                                )
                                              }
                                            />
                                          }
                                          label={displayName}
                                        />
                                      ) : (
                                        <div className="param-item">
                                          {displayName}
                                        </div>
                                      )}
                                    </div>
                                    {!isDataSourceItem && (
                                      <div
                                        className="param-icon"
                                        onClick={() =>
                                          handleAddRemoveParam(
                                            displayName,
                                            isDragged
                                          )
                                        }
                                      >
                                        <Button
                                          className="btnClass"
                                          variant="outlined"
                                          style={{
                                            color: isParamActive
                                              ? "#0057D9"
                                              : "#262526", 
                                            borderColor: isParamActive
                                              ? "#0057D9"
                                              : "#CACBCE", 
                                            backgroundColor: isParamActive
                                              ? "#EBF2FF"
                                              : "transparent", 
                                          }}
                                        >                                     
                                          {isParamActive ? (
                                            <RemoveIcon />
                                          ) : (
                                            <AddOutlinedIcon />
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                        </div>
                      );
                    }
                  );
                })()}
            </>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
