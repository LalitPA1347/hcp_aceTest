import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DescriptiveInsightsTable from "../DescriptiveInsightsTable/DescriptiveInsightsTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getRandomColor = (index) => {
  const colors = [
    "#002060",
    // "#004B7E",
    "#0070C0",
    "#00B0F0",
    "#005878",
    "#7F7f7F",
    "#A6A6A6",
    "#BFBFBF",
    "#F2F2F2",
    "#00B050",
  ];
  return colors[index % colors.length];
};

const ConcentrationCurveChart = forwardRef(({ chartData }, ref) => {
  const [dropdown1, setDropdown1] = useState("Specialty");
  const [dropdown2, setDropdown2] = useState("Absolute");
  const [tableData, setTableData] = useState(chartData[1][0] || {});
  const [expandedChart, setExpandedChart] = useState(null);
  const chartRefs = useRef([]);
  const theme = useTheme();
  useImperativeHandle(ref, () => ({
    handleDownload: () => {
      chartRefs.current.forEach((chart, idx) => {
        if (chart) {
          const image = chart.toBase64Image();
          const link = document.createElement("a");
          link.href = image;
          link.download = `deciling-chart-${idx + 1}.png`;
          link.click();
        }
      });
    },
  }));

  if (!Array.isArray(chartData) || chartData.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 15 }}>
        No data available.
      </Typography>
    );
  }

  // Break charts into rows of 2
  const chartRows = [];
  for (let i = 0; i < chartData[0].length; i += 2) {
    chartRows.push(chartData[0].slice(i, i + 2));
  }

  const handleDropdown1Change = (event) => {
    setDropdown1(event.target.value);
    const selectedData = chartData[1]
      .slice(0, 12)
      .filter((item) => item.Title.split(" ").includes(event.target.value));
    const finalData = selectedData.find((item) => item.Type === dropdown2);
    setTableData(finalData);
  };

  const handleDropdown2Change = (event) => {
    setDropdown2(event.target.value);
    const selectedData = chartData[1]
      .slice(0, 12)
      .filter((item) => item.Type.split(" ").includes(event.target.value));
    const finalData = selectedData.find((item) =>
      item.Title.split(" ").includes(dropdown1)
    );
    setTableData(finalData);
  };

  const columns =
    tableData &&
    tableData?.Columns.map((col) => ({
      field: col,
      headerName: col.toUpperCase(),
      flex: 1,
      minWidth: 100,
    }));

  const rows =
    tableData &&
    tableData?.Rows.map((row, index) => ({
      id: index + 1,
      ...row,
    }));

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
      {chartRows.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: "flex",
            flexDirection: "row",
            mb: 2,
            gap: 3,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {row.map((chart, chartIndex) => {
            const [keyLabel, keyValue] = chart.Columns || [];
            const labels = chart?.Rows.map((row) => row[keyLabel]);
            const values = chart?.Rows.map((row) => row[keyValue]);

            const data = {
              labels,
              datasets: [
                {
                  label:
                    chart.Title || `Chart ${rowIndex * 2 + chartIndex + 1}`,
                  data: values,
                  borderColor: getRandomColor(rowIndex * 2 + chartIndex),
                  backgroundColor:
                    getRandomColor(rowIndex * 2 + chartIndex) + "33",
                  fill: false,
                },
              ],
            };

            const options = {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  labels: {
                    usePointStyle: true,
                    boxWidth: 14,
                    boxHeight: 10,
                    // padding: 10,
                    font: { size: 14 },
                    generateLabels: (chart) => {
                      return chart.data.datasets.map((dataset, i) => ({
                        text: dataset.label,
                        fillStyle: dataset.borderColor,
                        hidden: !chart.isDatasetVisible(i),
                        datasetIndex: i,
                        pointStyle: "line",
                      }));
                    },
                  },
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: { display: true, text: keyLabel, font: { size: 14 } },
                },
                y: {
                  title: { display: true, text: keyValue, font: { size: 14 } },
                  beginAtZero: true,
                },
              },
            };

            return (
              <Box
                key={chartIndex}
                sx={{
                  flex: row.length === 1 ? "1 1 100%" : "1 1 48%",
                  minWidth: 0, // important for responsive shrink
                  backgroundColor: "#f5f7fa",
                  borderRadius: 4,
                  p: 2,
                  position: "relative",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ height: 370 }}>
                  <IconButton
                    aria-label="expand"
                    onClick={() =>
                      setExpandedChart({
                        data,
                        options,
                        title: chart.Title,
                      })
                    }
                    sx={{ position: "absolute", top: 4, right: 8, zIndex: 1 }}
                  >
                    <OpenInFullIcon />
                  </IconButton>
                  <Line
                    ref={(el) =>
                      (chartRefs.current[rowIndex * 2 + chartIndex] = el)
                    }
                    data={data}
                    options={options}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}

      <Box sx={{ mt: 2, mb: 2, borderTop: 1, borderColor: "divider" }}>
        <Box sx={{ mb: 1, mt: 1, display: "flex", gap: 2 }}>
          <Select
            value={dropdown1}
            onChange={handleDropdown1Change}
            size="small"
            sx={{ minWidth: 180, backgroundColor: "#fff" }}
          >
            {chartData[1][13]?.dropdown2.map((value) => (
              <MenuItem value={value}>{value}</MenuItem>
            ))}
          </Select>
          <Select
            value={dropdown2}
            onChange={handleDropdown2Change}
            size="small"
            sx={{ minWidth: 180, backgroundColor: "#fff" }}
          >
            {chartData[1][12]?.dropdown1.map((value) => (
              <MenuItem value={value}>{value}</MenuItem>
            ))}
          </Select>
          <Typography variant="h6" mb={1} ml={25}>
            {tableData.Title}
          </Typography>
        </Box>
        <DescriptiveInsightsTable rows={rows} columns={columns} />
      </Box>

      {/* Expand Chart Dialog */}
      <Dialog
        open={Boolean(expandedChart)}
        onClose={() => setExpandedChart(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ height: "80vh" }}>
          {expandedChart && (
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" mb={2}>
                {expandedChart.title}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line
                  data={expandedChart.data}
                  options={{
                    ...expandedChart.options,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
});

export default ConcentrationCurveChart;