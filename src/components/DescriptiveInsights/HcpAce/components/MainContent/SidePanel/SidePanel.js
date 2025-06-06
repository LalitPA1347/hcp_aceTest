import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Stack, Typography } from "@mui/material";
import {
  customFilterDataApi,
  customFilterSaveDataApi,
  customFilterDeleteDataApi,
} from "../../../../../../services/DescriptiveInsights/hcpace.service";
import { useDispatch } from "react-redux";
import { setCustomFilter } from "../../../../../../redux/descriptiveInsights/customFilterSlice";
import Remove from "../../../../../../assets/images/Remove.svg";
import QueryBuilder from "./QueryBuilder/QueryBuilder";
import DeleteRule from "../../../../../../assets/images/DeleteRule.svg";
import Edit from "../../../../../../assets/images/Edit.svg";
import "./SidePanel.css";
import { toast } from "react-toastify";

export default function SidePanel({
  open,
  handlesideBar,
  FlowChartOpen,
  segmentationPanelOpen,
}) {
  const dispatch = useDispatch();
  const customFilterData = useSelector(
    (state) => state.customFilterData.filters
  );
  const Kpiconfigs = useSelector((state) => state.dragData.Kpiconfigs);
  const selectedkpi = useSelector((state) => state.dragData.selectedkpiData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openQueryBuilder, setOpenQueryBuilder] = useState(false);
  const [savedQueryCondition, setSavedQueryCondition] = useState(false);
  const selectedKpiData = getSelectedKPIInfo(selectedkpi, Kpiconfigs);
  const datasourceOption = getUniqueDataSources(selectedKpiData);

  useEffect(() => {
    handleSavedCustomFilter();
  }, []);

  const handleSavedCustomFilter = async () => {
    const response = await customFilterDataApi();
    if (response?.status === 200) {
      dispatch(setCustomFilter(response?.data || []));
    } else {
      console.error("Error fetching saved custom filters:", response);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  function getSelectedKPIInfo(keys, data) {
    return keys.reduce(function (acc, key) {
      if (data[key]) acc[key] = data[key];
      return acc;
    }, {});
  }

  function getUniqueDataSources(data) {
    const uniqueSources = new Set();

    function traverse(obj) {
      if (typeof obj !== "object" || obj === null) return;

      for (const key in obj) {
        if (key === "DataSource" && Array.isArray(obj[key])) {
          obj[key].forEach((source) => uniqueSources.add(source));
        } else {
          traverse(obj[key]);
        }
      }
    }

    traverse(data);
    return Array.from(uniqueSources);
  }

  const handleSaveConditionApi = async (payload) => {
    const response = await customFilterSaveDataApi(payload);
    if (response?.status === 200) {
      console.log("response status", response);
    } else {
      console.error("Error fetching saved custom filters:", response);
    }
  };

  const handleSaveCondition = (
    primaryDropdownValue,
    query,
    groups,
    conditionName,
    mergedGroups
  ) => {
    const data = {
      Query: query,
      QueryName: conditionName,
      GroupsInfo: groups,
      MergedGroups: mergedGroups,
    };
    const deepCopy = JSON.parse(JSON.stringify(customFilterData)).filter(
      (item) => item.QueryName !== conditionName
    );

    dispatch(setCustomFilter([data, ...deepCopy]));
    setOpenQueryBuilder(false);
    handleSaveConditionApi(data);
  };

  const handleCloseQueryBuilder = () => {
    setOpenQueryBuilder(false);
    setSavedQueryCondition(false);
  };

  const handleOpenSaveQuery = (saveQuery) => {
    setSavedQueryCondition(saveQuery);
    setOpenQueryBuilder(true);
  };

  const handleDeleteCustomFilter = async (query) => {
    const payload = {
      QueryName: query.QueryName,
    };
    const response = await customFilterDeleteDataApi(payload);
    if (response?.status === 200) {
      const deepCopy = JSON.parse(JSON.stringify(customFilterData)).filter(
        (item) => item.QueryName !== payload.QueryName
      );
      dispatch(setCustomFilter(deepCopy));
      toast.success("Custom Filter Deleted Sucessfully");
    } else {
      console.error("Error deleting custom filter:", response);
    }
  };

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData(
      "customFilter",
      JSON.stringify({
        name: item.QueryName,
        dataSources: Object.values(item.GroupsInfo).map(
          (group) => group.datasource
        ),
        data: item,
      })
    );
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`sp-toggle ${
          open
            ? "open"
            : FlowChartOpen || segmentationPanelOpen
            ? "flow-open"
            : ""
        }`}
        onClick={handlesideBar}
        aria-label={open ? "Custom Filters" : "Custom Filters"}
      >
        <span
          style={{
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "rotate(90deg)",
            transformOrigin: "center",
            transition: "transform 0.2s ease",
          }}
        >
          {open ? "Custom Filters" : "Custom Filters"}
        </span>
      </button>
      {/* Panel */}
      <div className={`sp-panel ${open ? "open" : ""}`}>
        <div className="sp-search">
          <div className="add-query-box">
            <label htmlFor="custom-search">Custom Filter</label>
            <img
              src={Remove}
              alt="addBtn"
              onClick={() => setOpenQueryBuilder(true)}
            />
          </div>
          <input
            id="custom-search"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Box sx={{ m: "20px" }}>
          {customFilterData.map((item) => (
            <Stack
              key={item.QueryName}
              alignItems="center"
              direction="rows"
              justifyContent="space-between"
              sx={{
                height: "46px",
                borderRadius: "5px",
                background: "#F3F5F6",
                p: "0 10px",
                mb: "10px",
                cursor: "grab", // Indicate draggable
              }}
              draggable="true"
              onDragStart={(event) => handleDragStart(event, item)}
            >
              <Typography
                noWrap
                sx={{ color: "#444", fontSize: "0.95rem", letterSpacing: "0%" }}
              >
                {item.QueryName}
              </Typography>

              <Stack key={item.QueryName} alignItems="center" direction="rows">
                <img
                  src={Edit}
                  alt="Edit Rule"
                  style={{
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenSaveQuery(item)}
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
                  onClick={() => handleDeleteCustomFilter(item)}
                />
              </Stack>
            </Stack>
          ))}
        </Box>
        {/* {children} */}
      </div>
      {openQueryBuilder && (
        <QueryBuilder
          addConditionsPopup={openQueryBuilder}
          handleSaveCondition={handleSaveCondition}
          savedCondition={savedQueryCondition}
          datasourceOption={datasourceOption}
          selectedKpiData={selectedKpiData}
          handleClose={handleCloseQueryBuilder}
        />
      )}
    </>
  );
}