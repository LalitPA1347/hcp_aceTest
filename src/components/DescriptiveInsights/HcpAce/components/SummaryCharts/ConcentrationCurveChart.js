import { Box, Typography } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef } from "react";
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

const ConcentrationCurveChart = forwardRef(({ chartData }, ref) => {
  console.log("ConcentrationCurveChart", chartData);

  const chartRef = useRef();

  useImperativeHandle(ref, () => ({
    handleDownload: () => {
      if (chartRef.current) {
        const image = chartRef.current.toBase64Image();
        const link = document.createElement("a");
        link.href = image;
        link.download = "deciling-chart.png";
        link.click();
      }
    },
  }));

  if (!chartData || !chartData.Rows || chartData.Rows.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 15 }}>
        No data available.
      </Typography>
    );
  }

  const rows = [...chartData.Rows];
  const keyLabel = Object.keys(rows[0])[0];
  const keyValue = Object.keys(rows[0])[1];
  const labels = rows.map((row) => row[keyLabel]);
  const values = rows.map((row) => row[keyValue]);

  const data = {
    labels,
    datasets: [
      {
        label: chartData.Title,
        data: values,
        borderColor: "#2196f3",
        backgroundColor: "#BBDEFB",
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
          boxHeight: 12,
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
    },
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: keyLabel, font: { size: 14 } } },
      y: {
        title: { display: true, text: keyValue, font: { size: 14 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ width: "100%", height: 370 }}>
      <Line ref={chartRef} data={data} options={options} />
    </Box>
  );
});

export default ConcentrationCurveChart;