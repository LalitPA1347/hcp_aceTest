import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";

const KpiFilterDialog = ({
  open,
  onClose,
  kpis,
  selectedKpis,
  onKpiChange,
}) => {
  
  const [localSelected, setLocalSelected] = useState([]);

  useEffect(() => {
    if (open) {
      setLocalSelected(selectedKpis); // initialize selection on open
    }
  }, [open, selectedKpis]);

  const toggleKpi = (kpi) => {
    setLocalSelected((prev) =>
      prev.includes(kpi) ? prev.filter((item) => item !== kpi) : [...prev, kpi]
    );
  };

  const handleApply = () => {
    onKpiChange(localSelected); // send selected KPIs to parent
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleApply}
      PaperProps={{
        sx: {
          width: "16vw",
        },
      }}
    >
      <DialogTitle>Select KPI's</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            {kpis.map((kpi) => (
              <FormControlLabel
                key={kpi}
                control={
                  <Checkbox
                    checked={localSelected.includes(kpi)}
                    onChange={() => toggleKpi(kpi)}
                  />
                }
                label={kpi}
              />
            ))}
          </FormGroup>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleApply}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
};

export default KpiFilterDialog;
