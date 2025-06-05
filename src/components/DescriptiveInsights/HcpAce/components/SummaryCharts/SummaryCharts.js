import React, { useImperativeHandle, useRef, forwardRef } from "react";
import { Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Blue shades from darkest to lightest
const blueShades = [
  "#001a50",
  "#002b80",
  "#0033a0",
  "#0047b3",
  "#0057d9",
  "#1e70ff",
  "#3399ff",
  "#66b2ff",
  "#99ccff",
  "#cce5ff",
];

const SummaryCharts = forwardRef((props, ref) => {
  const chartRefs = useRef([]);
  const chartData = props.chartData || [];
  const chartType = props.type || "bar";

  // Chunk array into pairs of 2
  const chunkedData = [];
  for (let i = 0; i < chartData.length; i += 2) {
    chunkedData.push(chartData.slice(i, i + 2));
  }

  // Expose download method to parent
  useImperativeHandle(ref, () => ({
    handleDownload: () => {
      chartRefs.current.forEach((chart, index) => {
        if (chart && chart.toBase64Image) {
          const image = chart.toBase64Image();
          const link = document.createElement("a");
          link.href = image;
          link.download = `bar-chart-${index + 1}.png`;
          link.click();
        }
      });
    },
  }));

  // Check if all chart rows are empty
  const noData =
    chunkedData.length === 0 ||
    chunkedData.every((pair) =>
      pair.every((chart) => !chart || !chart.Rows || chart.Rows.length === 0)
    );

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
      {noData ? (
        <Typography
          variant="h6"
          color="text.primary"
          align="center"
          sx={{ marginTop: "150px" }}
        >
          No data available to display charts.
        </Typography>
      ) : (
        <Box sx={{ width: "100%" }}>
          {chunkedData.map((pair, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 4,
                gap: 3,
              }}
            >
              {pair.map((chart, colIndex) => {
                if (!chart || !chart.Rows || chart.Rows.length === 0)
                  return null;

                const rows = [...chart.Rows];
                const keyLabel = Object.keys(rows[0])[0];
                const keyValue = Object.keys(rows[0])[1];

                // Sort descending by value
                rows.sort((a, b) => b[keyValue] - a[keyValue]);

                const labels = rows.map((row) => row[keyLabel]);
                const values = rows.map((row) => row[keyValue]);

                const data = {
                  labels,
                  datasets: [
                    {
                      label: chart.Title.split(" ")[0],
                      data: values,
                      backgroundColor: blueShades.slice(0, values.length),
                    },
                  ],
                };
                // const labelKey = chart.Columns[0];
                // const metricKeys = chart.Columns.slice(1);

                // rows.sort((a, b) => b[metricKeys[0]] - a[metricKeys[0]]);

                // const labels = rows.map((row) => row[labelKey]);

                // let datasets;

                // if (metricKeys.length === 1) {
                //   // Single metric case
                //   datasets = [
                //     {
                //       label: metricKeys[0],
                //       data: rows.map((row) => row[metricKeys[0]]),
                //       backgroundColor: blueShades.slice(0, rows.length),
                //     },
                //   ];
                // } else {
                //   // Multi-metric case
                //   datasets = metricKeys.map((metric, index) => ({
                //     label: metric,
                //     data: rows.map((row) => row[metric]),
                //     backgroundColor: blueShades[index % blueShades.length],
                //   }));
                // }

                // const data = {
                //   labels,
                //   datasets,
                // };


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
                        padding: 10,
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
                    title: {
                      display: false,
                      text: chart.Title.split(" ")[0],
                      align: "center",
                      font: { size: 16 },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: keyLabel,
                        font: { size: 14 },
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: keyValue,
                        font: { size: 14 },
                      },
                      ticks: { beginAtZero: true },
                    },
                  },
                };

                return (
                  <Box key={colIndex} sx={{ width: "50%" }}>
                    <Bar
                      ref={(el) =>
                        (chartRefs.current[rowIndex * 2 + colIndex] = el)
                      }
                      data={data}
                      options={options}
                    />
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
});

export default SummaryCharts;