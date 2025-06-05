import React, { useState, useMemo } from "react";
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
  IconButton,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "./ParameterModal.css";
import bin from "../../../../../assets/images/imagesR/Vector.svg";

const TargetModal = ({ open, onCancel, onSubmit }) => {
  const allOptions = useMemo(
  () => Array.from({ length: 10 }, (_, i) => (10 - i).toString()),
  []
);
  const [inputValue, setInputValue] = useState("");
  const [tempSelected, setTempSelected] = useState([]);
  const [name, setName] = useState("");
  const [entries, setEntries] = useState([]);

  // Compute already selected values across all entries
  const usedValues = useMemo(
    () => entries.flatMap((entry) => entry.values),
    [entries]
  );

  // Filter dropdown options to exclude already used values
  const optionsToShow = useMemo(
    () => allOptions.filter((opt) => !usedValues.includes(opt)),
    [allOptions, usedValues]
  );

  const handleAdd = () => {
    if (!name.trim() || tempSelected.length === 0) return;

    const newEntry = {
      id: Date.now(),
      name: name.trim(),
      values: tempSelected,
    };

    setEntries([...entries, newEntry]);
    setTempSelected([]);
    setName("");
    setInputValue("");
  };

  const handleRemove = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleClearAll = () => {
    setEntries([]);
  };

  const handleSubmit = () => {
    const payload = {
      Segments: entries.reduce((acc, entry) => {
        acc[entry.name] = entry.values.map(Number); // Convert to numbers
        return acc;
      }, {}),
    };

    if (onSubmit) onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        style: {
          width: 667,
          minHeight: "250px",
          height: entries.length > 0 ? "auto" : 211,
          borderRadius: 10,
          position: "absolute",
          top: 312,
          left: 627,
        },
      }}
    >
      <DialogTitle className="modal-title">Segmentation</DialogTitle>
      <DialogContent className="modal-content" sx={{ marginTop: "20px" }}>
        <Typography variant="subtitle2" className="column-title">
          Choose your decile
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <Autocomplete
            multiple
            options={optionsToShow}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            value={tempSelected}
            onChange={(_, newValue) => setTempSelected(newValue)}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option}
              </li>
            )}
            renderTags={() => null} // ✅ Hides chips entirely
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select..."
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: null, // ✅ Prevent chip rendering
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            popupIcon={<ExpandMoreIcon />}
            style={{ flex: 1 }}
            sx={{
              "& .MuiAutocomplete-input": {
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              },
              "& .MuiAutocomplete-root": {
                width: "100%",
              },
            }}
          />

          <TextField
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            style={{ width: 200 }}
          />

          <Button
            onClick={handleAdd}
            disabled={tempSelected.length === 0 || !name.trim()}
            sx={{
              background: "#001A50",
              color: "white",
              width: "60px",
              height: "42px",
              textTransform: "none",
              "&:hover": { background: "#003080" },
              "&.Mui-disabled": {
                background: "#001A50",
                color: "white",
                opacity: 0.5, // dim the entire button
              },
            }}
          >
            Add
          </Button>
        </Box>

        {entries.length > 0 && (
          <Box
            mt={3}
            sx={{
              background: "#F8F8F8",
              padding: "10px",
              border: "1px solid #CACBCE",
              borderRadius: "5px",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" className="column-title">
                Selected Groups
              </Typography>
              <Button
                onClick={handleClearAll}
                className="clear-all-btn"
                style={{ textTransform: "none", textDecoration: "underline" }}
              >
                Clear All
              </Button>
            </Box>

            <Box mt={2} display="flex" flexDirection="column" gap={1}>
              {entries.map((entry) => (
                <Box key={entry.id} display="flex" alignItems="center" gap={1}>
                  <TextField
                    value={`${entry.name}: ${entry.values.join(", ")}`}
                    size="small"
                    fullWidth
                    disabled
                  />
                  <IconButton
                    onClick={() => handleRemove(entry.id)}
                    sx={{
                      width: 42,
                      height: 42,
                      gap: "10px",
                      borderRadius: "5px",
                      paddingTop: "8px",
                      paddingRight: "12px",
                      paddingBottom: "8px",
                      paddingLeft: "12px",
                      background: "#FFCDD2",
                      "&:hover": {
                        background: "#FFCDD2", // same as default, so no hover effect
                        boxShadow: "none", // optional: remove shadow if any
                      },
                    }}
                  >
                    <img src={bin} alt="delete" width={16} height={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{ width: "130px", height: "42px", textTransform: "none" }}
        >
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            background: "#001A50",
            color: "white",
            width: "130px",
            height: "42px",
            textTransform: "none",
            "&:hover": { background: "#003080" },
            "&.Mui-disabled": {
              background: "#001A50",
              color: "white",
              opacity: 0.5, // dim the entire button
            },
          }}
          disabled={entries.length === 0}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TargetModal;
