import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  Typography,
  Box,
  Chip,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./ParameterModal.css";
const ParameterModal = ({ open, param, selected = [], onSubmit, onCancel }) => {
  const [tempSelected, setTempSelected] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  // Access KpisData from Redux state
  const kpisData = useSelector((state) => state.dragData.KpisData);

  // Normalize both the dragged param and keys in the data for comparison
  const normalizedParam = Object.keys(kpisData || {}).find(
    (key) =>
      key.toLowerCase().replace(/\s+/g, "") ===
      param?.toLowerCase().replace(/\s+/g, "")
  );
  // Get values for the matching key
  const productList = normalizedParam ? kpisData[normalizedParam] : [];
  // Define the date options explicitly
  const dateOptions = [
    "By Date",
    "By Year",
    "By Semester",
    "By Quarter",
    "By Month",
    "By Week",
  ];
  const displayList = normalizedParam === "Date" ? dateOptions : productList;
  useEffect(() => {
    if (open) {
      // Sync selected products on open
      setSelectedProducts(selected);
      setTempSelected([]);
      setVisibleCount(10); // reset scroll count when modal opens
    }
  }, [open, selected, param]);
  const handleAdd = () => {
    const unique = [...new Set([...selectedProducts, ...tempSelected])];
    setSelectedProducts(unique);
    setTempSelected([]);
  };
  const handleClearAll = () => {
    setSelectedProducts([]);
  };
  const handleRemoveItem = (product) => {
    setSelectedProducts((prev) => prev.filter((item) => item !== product));
  };
  const handleSubmit = () => {
    onSubmit({ param, values: selectedProducts });
  };
  const availableOptions = useMemo(
    () => displayList.filter((item) => !selectedProducts.includes(item)),
    [displayList, selectedProducts]
  );

  let scrollTimeout = null;

  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    const { scrollHeight, scrollTop, clientHeight } = listboxNode;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          setVisibleCount((prev) =>
            Math.min(prev + 10, availableOptions.length)
          );
          scrollTimeout = null;
        }, 100); 
      }
    }
  };

  // const handleScroll = (event) => {
  //   const listboxNode = event.currentTarget;
  //   const { scrollHeight, scrollTop, clientHeight } = listboxNode;
  //   if (scrollTop + scrollHeight >= clientHeight) {
  //     setVisibleCount((prev) => Math.min(prev + 10, availableOptions.length));
  //   }
  // };

  const [inputValue, setInputValue] = useState("");

  const optionsToShow = inputValue
    ? availableOptions
    : availableOptions.slice(0, visibleCount);

  // const visibleOptions = useMemo(
  //   () => availableOptions.slice(0, visibleCount),
  //   [availableOptions, visibleCount]
  // );

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        style: {
          width: 667,
          height: selectedProducts.length > 0 ? "auto" : 211,
          borderRadius: 10,
          position: "absolute",
          top: 312,
          left: 627,
        },
      }}
    >
      <DialogTitle className="modal-title">Select Codes</DialogTitle>
      <DialogContent className="modal-content">
        <Typography variant="subtitle2" className="column-title">
          Below is the list of all the Codes
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Autocomplete
            multiple // Allow multiple selection only if not "Date"
            // options={visibleOptions}
            options={optionsToShow}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) =>
              setInputValue(newInputValue)
            }
            value={tempSelected}
            onChange={(event, newValue) => {
              if (normalizedParam === "Date") {
                // Allow only a single selection for "Date"
                setTempSelected(newValue.slice(-1));
              } else {
                setTempSelected(newValue);
              }
            }}
            disableCloseOnSelect={normalizedParam !== "Date"} // Disable close on select for multiple
            getOptionLabel={(option) => option} // Ensure the label is displayed as "Day 1", "Day 2", etc.
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                {normalizedParam !== "Date" && (
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                )}
                {option} {/* Render the option as a single string */}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select..."
                variant="outlined"
                size="small"
                className="search-field"
              />
            )}
            renderTags={() => null} // Prevent selected items from being displayed as tags
            popupIcon={<ExpandMoreIcon />}
            ListboxProps={{
              style: { maxHeight: 300, overflow: "auto" },
              onScroll: handleScroll,
            }}
            style={{ flex: 1 }}
          />
          <Button
            onClick={handleAdd}
            className="add-btn"
            disabled={tempSelected.length === 0}
            sx={{
              background: "#001A50",
              width: "60px",
              height: "42px",
              textTransform: "none",
            }}
          >
            Add
          </Button>
        </Box>
        {selectedProducts.length > 0 && (
          <Box mt={3}>
            <Box className="selected-header">
              <Typography variant="subtitle2" className="column-title">
                Selected Products
              </Typography>
              <Button
                onClick={handleClearAll}
                className="clear-all-btn"
                disabled={selectedProducts.length === 0}
                style={{ textTransform: "none", textDecoration: "underline" }}
              >
                Clear All
              </Button>
            </Box>
            <Box className="chip-container">
              {selectedProducts.map((product) => (
                <Chip
                  key={product}
                  label={product}
                  onDelete={() => handleRemoveItem(product)}
                  className="custom-chip"
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions className="modal-actions">
        <Button
          onClick={onCancel}
          className="cancel-btn"
          variant="secondary"
          sx={{
            width: "130px",
            height: "42px",
            textTransform: "none",
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          className="add-btn"
          sx={{
            background: "#001A50",
            width: "130px",
            height: "42px",
            textTransform: "none",
          }}
          disabled={selectedProducts.length === 0}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ParameterModal;
