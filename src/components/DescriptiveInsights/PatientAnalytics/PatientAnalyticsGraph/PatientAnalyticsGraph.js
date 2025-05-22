import React, { useEffect, useState, useRef } from "react";
import { Stack, Typography } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import GenerateDataTable from "../../GenerateDataTable";
import SankeyChart from "../../SankeyChart";
import GraphIconsContainer from "../../GraphIconsContainer";
import "./PatientAnalyticsGraph.css";
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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const style = {
  text: {
    mt: "3px",
    mb: "3px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#002060",
  },
  middleText: {
    ml: "30%",
    mt: "19%",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
};

const PatientAnalyticsGraph = () => {
  const { flag } = useParams();
  const svgRef = useRef(null);
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const data = useSelector((store) => store.patientAnalyticsChart.data || {});

  useEffect(() => {
    if (flag in data) {
      if (flag === "sob") {
        processSankyChartData(data?.[flag]?.chartData?.Graph_Data);
        return;
      }
      processChartData(
        data?.[flag]?.chartData?.Graph_Data,
        data?.[flag]?.chartData?.Graph_Dimension,
        data?.[flag]?.chartData?.Graph_type
      );
      return;
    }
    setChartData({});
  }, [data, flag]);

  const processChartData = (Graph_Data, Graph_Dimension, chartType) => {
    const extractKeys = () => {
      const dimensions = Graph_Dimension?.reduce((acc, dim) => {
        Object.keys(dim).forEach((key) => {
          acc[key] = dim[key];
        });
        return acc;
      }, {});

      return {
        xKey: dimensions?.Xaxis,
        yKey: dimensions?.Yaxis,
        legendKey: dimensions?.Legend,
      };
    };

    const keys = extractKeys(Graph_Data, Graph_Dimension);

    const legends = [
      ...new Set(Graph_Data?.map((item) => item[keys.legendKey])),
    ];

    //custom colors
    const colors = [
      "#002060",
      "#005878",
      "#0070C0",
      "#00B0F0",
      "#5DD4FF",
      "#7ED348",
      "#004B7E",
      "#26B170",
      "#7F7f7F",
      "#A4DBDD",
      "#00B050",
    ];

    const datasets = legends.map((legend, index) => {
      const dataPoints = Graph_Data.filter(
        (item) => item[keys.legendKey] === legend
      ).map((item) => item[keys.yKey]);

      // Cycle through colors if there are more legends than colors
      const color = colors[index % colors.length];

      return {
        label: `${legend}`,
        data: dataPoints,
        fill: chartType === "Area" || chartType === "100% Stack",
        borderColor: color,
        backgroundColor:
          chartType === "100% Stack"
            ? color
            : chartType === "Area"
            ? `${color}33` // 33 for semi-transparent Area
            : undefined,
        borderWidth: chartType === "100% Stack" ? 0 : 1.5,
        pointRadius: 2.5, // Larger points for clarity
        pointHoverRadius: 4, // Hover effect
      };
    });

    const labels = [...new Set(Graph_Data?.map((item) => item[keys.xKey]))];

    setChartData({
      labels: labels,
      datasets: datasets,
      chartType: chartType,
      options: {
        scales:
          chartType === "100% Stack"
            ? {
                x: {
                  stacked: true,
                  title: {
                    display: true,
                    text: Graph_Dimension?.find((d) => d.Xaxis)?.Xaxis,
                  },
                },
                y: {
                  stacked: true,
                  ticks: { callback: (value) => `${value}%` },
                  title: {
                    display: true,
                    text: Graph_Dimension?.find((d) => d.Yaxis)?.Yaxis,
                  },
                },
              }
            : {
                x: {
                  title: {
                    display: true,
                    text: Graph_Dimension?.find((d) => d.Xaxis)?.Xaxis,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: Graph_Dimension?.find((d) => d.Yaxis)?.Yaxis,
                  },
                },
              },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              usePointStyle: true, // Use point style for custom legend look
              boxWidth: 14, // Adjust circle width (default is 40)
              boxHeight: 8, // Adjust circle height (optional, sets it to a rectangle if modified)
              padding: 10, // Space between legend items
              generateLabels: (chart) => {
                const labels = chart.data.datasets.map((dataset, i) => {
                  return {
                    text: dataset.label,
                    fillStyle: dataset.borderColor,
                    hidden: !chart.isDatasetVisible(i),
                    datasetIndex: i,
                    pointStyle: "circle", // Set to 'line' to use line style in legend
                  };
                });
                return labels;
              },
            },
          },
        },
      },
    });
  };

  const processSankyChartData = (Graph_Data) => {
    const nodes = new Set();
    const edges = [];

    // Define your custom colors
    const colors = [
      "#002060",
      "#004B7E",
      "#0070C0",
      "#00B0F0",
      "#005878",
      "#7F7f7F",
      "#A6A6A6",
      "#BFBFBF",
      "#F2F2F2",
      "#00B050",
    ];

    const nodeColors = {};
    let colorIndex = 0;

    // Iterate over the graph data to populate nodes, edges, and assign colors
    Graph_Data?.forEach(([from, to, weight]) => {
      if (from === to) return; // Skip self-referential nodes

      const weightValue = parseFloat(weight);
      if (isNaN(weightValue)) return; // Skip if weight is invalid

      nodes.add(from);
      nodes.add(to);

      // Assign colors to nodes
      if (!nodeColors[from]) {
        nodeColors[from] = colors[colorIndex % colors.length];
        colorIndex++;
      }
      if (!nodeColors[to]) {
        nodeColors[to] = colors[colorIndex % colors.length];
        colorIndex++;
      }

      // Add the edge as a simple array of [from, to, weightValue]
      edges.push([from, to, weightValue]);
    });

    // Prepare the sankyData for the chart (array of arrays in [from, to, weight] format)
    const sankyData = edges; // edges already in desired format

    // Prepare node color array
    const nodeColorArray = Array.from(nodes).map((node) => ({
      id: node,
      color: nodeColors[node],
    }));

    setChartData({
      data: { sankyData, nodeColorArray, chartType: "sankey" },
    });
  };

  const title = (input) => {
    return input
      .split("-")
      .map((word) =>
        word === "dot" || word === "sob"
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  return (
    <Stack className="patient-analytics-graph-box">
      {chartData?.chartType !== "Table" && (
        <Stack className="patient-analytics-graph-model">
          {chartData?.chartType !== "Table" && (
            <Stack
              className="patient-analytics-graph-header"
              justifyContent="flex-end"
              direction="rows"
            >
              <Stack
                direction="row"
                sx={{ width: "55%" }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography sx={style.text}>{`${title(
                  flag
                )} Graph`}</Typography>
                <GraphIconsContainer
                  chartRef={chartRef}
                  svgRef={svgRef}
                  data={chartData}
                />
              </Stack>
            </Stack>
          )}
          {Object.keys(chartData).length === 0 && (
            <Typography sx={style.middleText}>
              Select all the dropdown values and submit to view the Graph.
            </Typography>
          )}
          <Stack className="graph-background-color">
            {chartData?.chartType === "Line" && (
              <Line
                ref={chartRef}
                data={chartData}
                options={chartData.options}
                width={800}
                height={310}
              />
            )}
            {chartData?.chartType === "Area" && (
              <Line
                ref={chartRef}
                data={chartData}
                options={chartData.options}
                width={800}
                height={310}
              />
            )}
            {chartData?.chartType === "100% Stack" && (
              <Bar
                ref={chartRef}
                data={chartData}
                options={chartData.options}
                width={800}
                height={310}
              />
            )}
            {chartData?.data?.chartType === "sankey" && (
              <Stack
                className="sankey-chart-container"
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: "100%",
                  width: "100%",
                  pt: "6px",
                  paddingBottom: "2px",
                }}
              >
                <SankeyChart data={chartData?.data} svgRef={svgRef} />
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
      {flag !== "sob" && Object.keys(chartData).length !== 0 && (
        <Stack className="table-container2">
          <GenerateDataTable data={chartData} />
        </Stack>
      )}
    </Stack>
  );
};

export default PatientAnalyticsGraph;
