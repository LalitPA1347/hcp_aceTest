import React, { useState, forwardRef, useMemo, useRef } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DescriptiveInsightsTable from "../components/DescriptiveInsightsTable/DescriptiveInsightsTable";

ChartJS.register(ArcElement, Tooltip, Legend);

const pieColors = ["#001a50", "#0033a0", "#0057d9", "#66b2ff", "#99ccff"];

const SegmentationCharts = forwardRef(({ chartData = [] }, ref) => {
  const [expandedChart, setExpandedChart] = useState(null);
  const [typeFilter, setTypeFilter] = useState("Absolute");
  const [dimensionFilter, setDimensionFilter] = useState("Specialty");
  const tableRef = useRef();
  const tableData = chartData.find((chart) => chart.Title === "Summary Table");
  const pieChartData = chartData.find(
    (chart) => chart.Title === "Summary graph"
  );

  const dropdown1Values = useMemo(() => {
    const lastEntry = chartData[chartData.length - 1];
    if (Array.isArray(lastEntry)) {
      const dropdownObj = lastEntry.find((item) => item.dropdown1);
      return dropdownObj ? dropdownObj.dropdown1 : [];
    }
    return [];
  }, [chartData]);

  const dropdown2Values = useMemo(() => {
    const lastEntry = chartData[chartData.length - 1];
    if (Array.isArray(lastEntry)) {
      const dropdownObj = lastEntry.find((item) => item.dropdown2);
      return dropdownObj ? dropdownObj.dropdown2 : [];
    }
    return [];
  }, [chartData]);

  const segmentationCharts = useMemo(() => {
    const lastEntry = chartData[chartData.length - 1];
    return Array.isArray(lastEntry)
      ? lastEntry.filter((d) => d.Title && d.Rows && d.Columns)
      : [];
  }, [chartData]);

  const matchedChart = useMemo(() => {
    if (!typeFilter || !dimensionFilter) return null;
    return segmentationCharts.find(
      (entry) =>
        entry.Type === typeFilter &&
        entry.Title.toLowerCase().includes(dimensionFilter.toLowerCase())
    );
  }, [typeFilter, dimensionFilter, segmentationCharts]);

  return (
    <Box
      p={2}
      sx={{
        borderTop: 1,
        borderColor: "divider",
        height: 370,
        overflowY: "auto",
      }}
    >
      {/* Summary Table & Graph */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {tableData && (
          <Box
            sx={{
              width: "50%",
              backgroundColor: "#f5f7fa",
              borderRadius: 4,
              p: 1,
              position: "relative",
            }}
          >
            <IconButton
              aria-label="expand"
              onClick={() =>
                setExpandedChart({ type: "table", data: tableData })
              }
              sx={{ position: "absolute", top: 4, right: 8, zIndex: 1 }}
            >
              <OpenInFullIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              {tableData.Title}
            </Typography>

            <DescriptiveInsightsTable
              ref={tableRef}
              rows={tableData?.Rows?.map((row, index) => ({
                id: index,
                ...row,
              }))}
              columns={tableData?.Columns?.map((col) => ({
                field: col,
                headerName: col,
                flex: 1,
              }))}
            />
          </Box>
        )}

        {pieChartData && (
          <Box
            sx={{
              width: "50%",
              backgroundColor: "#f5f7fa",
              borderRadius: 4,
              p: 1,
              position: "relative",
            }}
          >
            <IconButton
              aria-label="expand"
              onClick={() =>
                setExpandedChart({ type: "pie", data: pieChartData })
              }
              sx={{ position: "absolute", top: 4, right: 8, zIndex: 1 }}
            >
              <OpenInFullIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              {pieChartData.Title}
            </Typography>
            <Pie
              data={{
                labels: pieChartData.Rows.map(
                  (r) => r[pieChartData.Columns[0]]
                ),
                datasets: [
                  {
                    label: pieChartData.Columns[1],
                    data: pieChartData.Rows.map(
                      (r) => r[pieChartData.Columns[1]]
                    ),
                    backgroundColor: pieColors,
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </Box>
        )}
      </Box>

      {/* Dropdown Filters */}
      <Box display="flex" gap={2} mt={3} mb={2}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {dropdown1Values.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Dimension</InputLabel>
          <Select
            value={dimensionFilter}
            label="Dimension"
            onChange={(e) => setDimensionFilter(e.target.value)}
          >
            {dropdown2Values.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Segmentation Table */}
      {matchedChart ? (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            {matchedChart.Title}
          </Typography>

          <DescriptiveInsightsTable
            ref={tableRef}
            rows={matchedChart?.Rows?.map((row, index) => ({
              id: index,
              ...row,
            }))}
            columns={matchedChart?.Columns?.map((col) => ({
              field: col,
              headerName: col,
              flex: 1,
            }))}
          />
        </Box>
      ) : (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please select type and dimension to view segmentation data.
        </Typography>
      )}

      {/* Expand Dialog */}
      <Dialog
        open={Boolean(expandedChart)}
        onClose={() => setExpandedChart(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ height: "80vh" }}>
          {expandedChart?.type === "table" && (
            <TableContainer component={Paper} sx={{ height: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {expandedChart.data.Columns.map((col, index) => (
                      <TableCell key={index}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expandedChart.data.Rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {expandedChart.data.Columns.map((col, colIndex) => (
                        <TableCell key={colIndex}>{row[col]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {expandedChart?.type === "pie" && (
            <Box sx={{ height: "100%" }}>
              <Pie
                data={{
                  labels: expandedChart.data.Rows.map(
                    (r) => r[expandedChart.data.Columns[0]]
                  ),
                  datasets: [
                    {
                      label: expandedChart.data.Columns[1],
                      data: expandedChart.data.Rows.map(
                        (r) => r[expandedChart.data.Columns[1]]
                      ),
                      backgroundColor: pieColors,
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
});

export default SegmentationCharts;