import React from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Typography,
  TextField,
  Autocomplete,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DraggableRegimen from "./DraggableRegimen";

const timeFrameDropDown = [
  {
    value: ">",
    label: ">",
  },
  {
    value: "<",
    label: "<",
  },
  {
    value: ">=",
    label: ">=",
  },
  {
    value: "<=",
    label: "<=",
  },
  {
    value: "=",
    label: "=",
  },
  {
    value: "NA",
    label: "NA",
  },
];

const lotDropDown = [
  {
    value: "0",
    label: "Early Stage",
  },
  {
    value: "1",
    label: "1",
  },
  {
    value: "2",
    label: "2",
  },
  {
    value: "3",
    label: "3",
  },
  {
    value: "4",
    label: "4",
  },
];

const SegmentationHeader = ({
  expand,
  onToggle,
  productList,
  firstRegimenList,
  setFirstRegimenList,
  segmentError,
  numberOfCodition,
  databasesMenu,
  conditions,
  handleLogicalOperatorChange,
  handleAutocompleteChange,
  handleAddCondition,
  handleRemoveCondition,
  regimenCategory,
  setRegimenCategory,
  generateQuery,
  importedRegimenList,
  moveRegimenItem,
  handleDeleteRegimanRule,
  handleOpenImportDialog, // Include this prop for opening the import dialog
  style,
  setTimeFrame,
  setLot,
  timeFrame,
  lot,
  handleEdit,
}) => {
  return (
    <div>
      {expand && (
        <div className="segmentation-category-box">
          <div className="segmentation-category-data">
            <div className="segmentation-category-data-condition">
              <h6 className="segmentation-category-data-condition-h6">
                Market Basket Product
              </h6>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={productList}
                getOptionLabel={(option) => option}
                value={firstRegimenList}
                onChange={(event, newValue) => {
                  setFirstRegimenList(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select the Product"
                    size="small"
                    sx={style.typeFields}
                  />
                )}
              />
              {segmentError.firstSegmentList && (
                <h1>{segmentError.firstSegmentList}</h1>
              )}
              {Array.from({ length: numberOfCodition }, (_, index) => (
                <div key={index}>
                  <div className="regimen-and-condition">
                    <TextField
                      id={`products-textfield-${index}`}
                      sx={style.typeFields}
                      select
                      name="dataset"
                      defaultValue="AND"
                      size="small"
                      onChange={(event) =>
                        handleLogicalOperatorChange(index, event.target.value)
                      }
                    >
                      {databasesMenu.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{ fontSize: "14px", fontWeight: "400" }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <Autocomplete
                    multiple
                    id={`products-autocomplete-${index}`}
                    options={productList}
                    getOptionLabel={(option) => option}
                    value={
                      conditions[index]
                        ? conditions[index].selectedProducts
                        : []
                    }
                    onChange={(event, newValue) =>
                      handleAutocompleteChange(index, newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select the Product"
                        size="small"
                        sx={style.typeFields}
                      />
                    )}
                  />
                  {segmentError?.conditionsSegment?.[index] && (
                    <h1>{segmentError?.conditionsSegment[index]}</h1>
                  )}
                </div>
              ))}
              <div className="segmentation-category-add">
                <AddIcon
                  sx={{ color: "#302f2f", cursor: "pointer" }}
                  onClick={handleAddCondition}
                />
                {numberOfCodition > 0 && (
                  <RemoveIcon
                    sx={{ color: "#302f2f", cursor: "pointer" }}
                    onClick={handleRemoveCondition}
                  />
                )}
              </div>
              <hr></hr>
              {/* Here are my changes */}
              <div className="segmentation-category-timeframe-lot">
                <Stack>
                  <h6 className="segmentation-category-data-condition-h6">
                    Lot Conditions
                  </h6>
                  <TextField
                    id="outlined-select-database"
                    sx={{
                      mt: "2px",
                      mb: "15px",
                      width: "7vw",
                      mr: "12px",
                      background: "#f2f2f2",
                    }}
                    select
                    name="timeFrame"
                    size="small"
                    onChange={(e) => setTimeFrame(e.target.value)}
                    value={timeFrame}
                  >
                    {timeFrameDropDown.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Stack sx={{ paddingTop: 4.1 }}>
                  {/* <h6 className="segmentation-category-data-condition-h6">
                    Lot
                  </h6> */}
                  <TextField
                    id="outlined-select-database"
                    sx={{
                      mt: "2px",
                      mb: "15px",
                      width: "12vw",
                      background: "#f2f2f2",
                    }}
                    select
                    name="lot"
                    size="small"
                    onChange={(e) => setLot(e.target.value)}
                    value={lot}
                  >
                    {lotDropDown.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </div>
              {/*  */}

              <h6>Segment</h6>
              <TextField
                sx={style.typeFields}
                id="outlined-textarea"
                placeholder="Enter a Category Name"
                name="regimenCategory"
                size="small"
                value={regimenCategory}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    generateQuery();
                  }
                }}
                onChange={(event) => {
                  setRegimenCategory(event.target.value);
                }}
              />
              {segmentError.segmentCategory && (
                <h1>{segmentError.segmentCategory}</h1>
              )}
            </div>
            <div className="segmentation-category-addToList">
              <h5 onClick={generateQuery}>Add &gt;&gt; </h5>
            </div>

            <div className="segmentation-regimen-box">
              {importedRegimenList.length === 0 ? (
                <h2>Added Segment Category will be shown Here</h2>
              ) : (
                importedRegimenList
                  .flat()
                  .map((item, index) => (
                    <DraggableRegimen
                      key={index}
                      item={item}
                      index={index}
                      moveItem={moveRegimenItem}
                      handleDeleteRegimanRule={handleDeleteRegimanRule}
                      handleEdit={handleEdit}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentationHeader;
