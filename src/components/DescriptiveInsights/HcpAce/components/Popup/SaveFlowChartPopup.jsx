import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import "./ParameterModal.css";


const SaveFlowChartPopup = ({ open, onCancel, onSubmit }) => {
  const [name, setName] = useState("");
  const [entries, setEntries] = useState([]);

  const handleClose = () =>{
    setName("");
    if(onCancel) onCancel() ;
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit(name);
    setName("");
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
      <DialogTitle className="modal-title">Save Flowchart</DialogTitle>
      <DialogContent className="modal-content" sx={{ marginTop: "20px" }}>
        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <TextField
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            style={{ width: 600 }}
          />
        </Box>
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button
          onClick={handleClose}
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
          disabled={name.length === 0}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFlowChartPopup;
