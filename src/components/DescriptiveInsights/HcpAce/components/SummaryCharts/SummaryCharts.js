// import React, { useImperativeHandle, useRef, forwardRef } from "react";
// import { Box } from "@mui/material";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useSelector } from "react-redux";

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Blue shades from darkest to lightest
// const blueShades = [
//   "#001a50", // Navy Blue
//   "#002b80", // Deep Royal Blue
//   "#0033a0", // Strong Blue
//   "#0047b3", // Royal Blue
//   "#0057d9", // Bold Blue
//   "#1e70ff", // Blue Crayola
//   "#3399ff", // Medium Sky Blue
//   "#66b2ff", // Light Sky Blue
//   "#99ccff", // Pale Blue
//   "#cce5ff", // Powder Blue
// ];

// const SummaryCharts = forwardRef((props, ref) => {
//   const chartRefs = useRef([]);
//   const chartData = useSelector((store) => store.table.hcpAceApiData || []);

//   // Exclude the 0th chart
//   const usableData = chartData.slice(1);

//   // Chunk array into pairs of 2
//   const chunkedData = [];
//   for (let i = 0; i < usableData.length; i += 2) {
//     chunkedData.push(usableData.slice(i, i + 2));
//   }

//   useImperativeHandle(ref, () => ({
//     handleDownload: () => {
//       chartRefs.current.forEach((chart, index) => {
//         if (chart && chart.toBase64Image) {
//           const image = chart.toBase64Image();
//           const link = document.createElement("a");
//           link.href = image;
//           link.download = `bar-chart-${index + 1}.png`;
//           link.click();
//         }
//       });
//     },
//   }));

//   return (
//     <Box
//       p={2}
//       sx={{
//         borderTop: 1,
//         borderColor: "divider",
//         height: 370,
//         overflowY: "auto",
//       }}
//     >
//       {chunkedData.map((pair, rowIndex) => (
//         <Box
//           key={rowIndex}
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             mb: 4,
//             gap: 3,
//           }}
//         >
//           {pair.map((chart, colIndex) => {
//             const rows = [...chart.Rows]; // clone to avoid mutating Redux state
//             const keyLabel = Object.keys(rows[0])[0];
//             const keyValue = Object.keys(rows[0])[1];

//             // Sort rows in descending order by value
//             rows.sort((a, b) => b[keyValue] - a[keyValue]);

//             const labels = rows.map((row) => row[keyLabel]);
//             const values = rows.map((row) => row[keyValue]);

//             const data = {
//               labels,
//               datasets: [
//                 {
//                   label: chart.Title.split(" ")[0],
//                   data: values,
//                   backgroundColor: blueShades.slice(0, values.length),
//                 },
//               ],
//             };

//             const options = {
//               responsive: true,
//               plugins: {
//                 legend: {
//                   display: true,
//                   position: "top",
//                   labels: {
//                     usePointStyle: true, // Use point style for custom legend look
//                     boxWidth: 14, // Adjust circle width (default is 40)
//                     boxHeight: 10, // Adjust circle height (optional, sets it to a rectangle if modified)
//                     padding: 10, // Space between legend items
//                     font: {
//                       size: 14, // <-- increase this value for larger font
//                       weight: "normal", // or 'bold', 'lighter', etc.
//                     },
//                     generateLabels: (chart) => {
//                       const labels = chart.data.datasets.map((dataset, i) => {
//                         return {
//                           text: dataset.label,
//                           fillStyle: dataset.borderColor,
//                           hidden: !chart.isDatasetVisible(i),
//                           datasetIndex: i,
//                           pointStyle: "line", // Set to 'line' to use line style in legend
//                         };
//                       });
//                       return labels;
//                     },
//                   },
//                 },
//               },
//               scales: {
//                 x: {
//                   title: {
//                     display: true,
//                     text: Object.keys(chart.Rows[0])[0], // Label for X-axis
//                     font: {
//                       size: 14,
//                     },
//                   },
//                 },
//                 y: {
//                   title: {
//                     display: true,
//                     text: Object.keys(chart.Rows[0])[1], // Label for Y-axis
//                     font: {
//                       size: 14,
//                     },
//                   },
//                   ticks: {
//                     beginAtZero: true,
//                   },
//                 },
//               },
//             };

//             return (
//               <Box key={colIndex} sx={{ width: "50%" }}>
//                 {/* <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                   {chart.Title.split(" ")[0]}
//                 </Typography> */}
//                 <Bar
//                   ref={(el) =>
//                     (chartRefs.current[rowIndex * 2 + colIndex] = el)
//                   }
//                   data={data}
//                   options={options}
//                 />
//               </Box>
//             );
//           })}
//         </Box>
//       ))}
//     </Box>
//   );
// });

// export default SummaryCharts;

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
import { useSelector } from "react-redux";

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
  const chartData = useSelector((store) => store.table.hcpAceApiData || []);

  // Exclude the 0th chart
  const usableData = chartData.slice(1);

  // Chunk array into pairs of 2
  const chunkedData = [];
  for (let i = 0; i < usableData.length; i += 2) {
    chunkedData.push(usableData.slice(i, i + 2));
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
