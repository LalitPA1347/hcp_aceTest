// components/FlowChartPanel.js
import React, { useState } from "react";
import {
  ArrowUpward,
  ArrowDownward,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import "./FlowChartPanel.css";
import SaveFlowChartPopup from "../../Popup/SaveFlowChartPopup";

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

export default function FlowChartPanel({
  dataSources = [],
  operatorButtonColors = [],
  droppedParamsBySource = {},
  customFilterChips = {},
  countsData = {},
  selectedChip = {},
  isLoading = false,
  handleDrop,
  handleChipClickInternal,
  handleMoveUp,
  handleMoveDown,
  handleEditClick,
  handleCloseClick,
  setCustomFilterChips,
  setSourceOfTrigger,
  setIsCancelled,
  areAnyChipsPresent,
  selectedListType,
  handleListTypeChange,
  getListData,
  handleListClick,
  handleFlowChartSave,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFlowChartSave1 = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (name) => {
     handleFlowChartSave(name) ;
    setIsModalOpen(false);
  };

  return (
    //section set as per both side drawers open and close.
    <section className="data-source-cards-flowchart-outer">
      <div className="data-source-cards-flowchart-inner">
        <div className="flow-chart-header">
          <h3 className="heading_flowchart">Flow Chart</h3>
          <Button
            variant="outlined"
            sx={style.addBtn}
            onClick={handleFlowChartSave1}
          >
            Save
          </Button>

           <SaveFlowChartPopup
        open={isModalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
        </div>
        <div className="flowchart-outer">
          {dataSources.map((dataSource, index) => (
            <div
              key={dataSource}
              className="drop-parameter vertical-flow-1"
              style={{
                border: `2px solid ${
                  operatorButtonColors[index % operatorButtonColors.length]
                }`,
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, dataSource)}
            >
              <h5 className="drop-names">{dataSource}</h5>

              {/* Combine mapping of both regular parameters and custom filters */}
              {(droppedParamsBySource[dataSource] || []).map((chip, idx) => {
                const isSelected =
                  selectedChip.dataSource === dataSource &&
                  selectedChip.index === idx;

                // Render based on chip type
                return (
                  <div
                    key={chip.id} // Use chip.id as the key
                    className={`dp-chip flow-item ${
                      chip.type === "customFilter" ? "flow-item-cf" : "" // Add custom filter specific class
                    } ${isLoading ? "chip-loading" : ""}`}
                    style={{
                      color: isSelected ? "white" : "#001A50",
                      background: isSelected ? "#0057d9" : "#D7DFE9",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                      // Pass index and dataSource to handleChipClickInternal
                      onClick={(e) =>
                        handleChipClickInternal(e, idx, dataSource)
                      }
                    >
                      {/* Conditional rendering for chip content */}

                      {chip.type === "param" ? (
                        <>
                          {chip.name}
                          {countsData[dataSource]?.[chip.name] !==
                            undefined && (
                            <span style={{ marginLeft: "0px" }}>
                              ({countsData[dataSource][chip.name]})
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {chip.name}
                          {chip.countKey &&
                            countsData[dataSource]?.[chip.countKey] !==
                              undefined && (
                              <span style={{ marginLeft: "0px" }}>
                                ({countsData[dataSource][chip.countKey]})
                              </span>
                            )}
                        </>
                      )}

                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {idx > 0 && (
                          <ArrowUpward
                            fontSize="12px"
                            style={{ cursor: "pointer", marginRight: "4px" }}
                            onClick={(e) => handleMoveUp(e, dataSource, chip)} // Pass the full chip object
                          />
                        )}
                        {idx <
                          (droppedParamsBySource[dataSource] || []).length -
                            1 && (
                          <ArrowDownward
                            fontSize="12px"
                            style={{ cursor: "pointer", marginRight: "4px" }}
                            onClick={(e) => handleMoveDown(e, dataSource, chip)} // Pass the full chip object
                          />
                        )}
                        {/* Edit icon for both, but handleEditClick needs to differentiate */}
                        <EditIcon
                          fontSize="12px"
                          style={{ marginLeft: "8px", cursor: "pointer" }}
                          onClick={(e) => handleEditClick(e, chip)} // Pass the full chip object
                        />
                        <CloseIcon
                          fontSize="12px"
                          className="dp-chip-remove"
                          onClick={(e) => handleCloseClick(e, chip, dataSource)} // Pass the full chip object and dataSource
                        />
                      </div>
                    </span>
                    {/* Flow arrow after each chip except the last one */}
                    {idx <
                      (droppedParamsBySource[dataSource] || []).length - 1 && (
                      <div className="flow-arrow"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Unique/Overlap List Section */}
      {areAnyChipsPresent() && (
        <div className="drop-parameter vertical-flow-2">
          <FormControl
            component="fieldset"
            disabled={!areAnyChipsPresent()}
            className="drop-names"
          >
            <RadioGroup
              name="list-type"
              value={selectedListType}
              onChange={handleListTypeChange}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel
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

          <div className="drop-parameter vertical-flow-3">
            <h5 className="drop-names">{selectedListType}</h5>

            {Object.entries(getListData()).map(([key, value], index, array) => (
              <div
                key={key}
                className="dp-chip flow-item-list"
                onClick={() => handleListClick(index)}
              >
                {key}: {value}
                {index < array.length - 1 && <div className="flow-arrow"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
