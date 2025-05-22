import React, { useState } from "react";
import "./SidePanel.css";
import Remove from "../../../../../../assets/images/Remove.svg";
import QueryBuilder from "./QueryBuilder/QueryBuilder";
import { useSelector } from "react-redux";
import { Box, Stack, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function SidePanel({ open, setOpen, children }) {
  const Kpiconfigs = useSelector((state) => state.dragData.Kpiconfigs);
  const selectedkpi = useSelector((state) => state.dragData.selectedkpiData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [customFilterData, setCustomFilterData] = useState([]);
  const [openQueryBuilder, setOpenQueryBuilder] = useState(false);
  const [savedQueryCondition, setSavedQueryCondition] = useState(false);
  const selectedKpiData = getSelectedKPIInfo(selectedkpi, Kpiconfigs);
  const datasourceOption = getUniqueDataSources(selectedKpiData);

  const togglePanel = () => setOpen((prev) => !prev);

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
    const deepCopy = JSON.parse(JSON.stringify(customFilterData)).filter(item => item.QueryName !== conditionName);

    setCustomFilterData([data, ...deepCopy]);
    setOpenQueryBuilder(false);
  };

  const handleCloseQueryBuilder = () => {
    setOpenQueryBuilder(false);
    setSavedQueryCondition({});
  };

  const handleOpenSaveQuery = (saveQuery) => {
    setSavedQueryCondition(saveQuery);
    setOpenQueryBuilder(true);
  };

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData(
      "customFilter",
      JSON.stringify({
        name: item.QueryName,
        dataSources: Object.values(item.GroupsInfo).map(
          (group) => group.datasource
        ),
      })
    );
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`sp-toggle ${open ? "open" : ""}`}
        onClick={togglePanel}
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
              onClick={() => handleOpenSaveQuery(item)}
            >
              <Typography
                noWrap
                sx={{ color: "#444", fontSize: "0.95rem", letterSpacing: "0%" }}
              >
                {item.QueryName}
              </Typography>
              <ArrowForwardIosIcon sx={{ color: "#444", fontSize: "16px" }} />
            </Stack>
          ))}
        </Box>
        {children}
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
