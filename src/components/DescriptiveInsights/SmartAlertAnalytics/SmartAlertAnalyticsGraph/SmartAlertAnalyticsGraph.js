import React, { useEffect, useState, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import GraphIconsContainer from "../../GraphIconsContainer";
import "./SmartAlertAnalyticsGraph.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SmartAlertAnalyticsTable from "../SmartAlertAnalyticsTable";

const style = {
  text: {
    mt: "3px",
    mb: "3px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  middleText: {
    ml: "30%",
    mt: "19%",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
};

const SmartAlertAnalyticsGraph = () => {
  const { flag } = useParams();
  const svgRef = useRef(null);
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const [chartData, setChartData] = useState([]);

  const data = useSelector(
    (store) => store.smartAlertAnalyticsChart.data || {}
  );

  useEffect(() => {
    if (flag in data) {
      data?.[flag]?.chartData?.charts.map((chart) => {
        if (chart?.Graph_Data && chart?.Graph_Dimension) {
          processChartData(
            chart?.Graph_Data,
            chart?.Graph_Dimension,
            chart?.Graph_type
          );
        }
      });
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

    const colors = [
      "#002060",
      "#00B0F0",
      "#7ED348",
      "#26B170",
      "#7F7f7F",
      "#004B7E",
      "#0070C0",
      "#5DD4FF",
      "#005878",
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
    const newChartData = {
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
                  ticks: { callback: (value) => `${value}` },
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
            align: "end",
            labels: {
              usePointStyle: false, // Use point style for custom legend look
              boxWidth: 0, // Adjust circle width (default is 40)
              // boxHeight: 3, // Adjust circle height (optional, sets it to a rectangle if modified)
              // padding: 10, // Space between legend items
              generateLabels: (chart) => {
                const labels = chart?.data?.datasets.map((dataset, i) => {
                  return {
                    // text: dataset.label,
                    text: `Median ${dataset.label} days`,
                    // fillStyle: dataset.borderColor,
                    // fillStyle: "transparent",
                    hidden: !chart.isDatasetVisible(i),
                    datasetIndex: i,
                    // pointStyle: "none", // Set to 'line' to use line style in legend
                  };
                });
                return labels;
              },
            },
          },
          datalabels: {
            anchor: "end", // Ensures labels are on top
            align: "top",
            offset: -5, // Adjusts gap between label and bar
            color: "#000", // Set label text color
            font: {
              size: 12, // Adjust font size
              weight: "bold",
            },
            formatter: (value) => value, // Show exact values
          },
        },
      },
    };
    setChartData((prevData) => {
      const safePrevData = Array.isArray(prevData) ? prevData : [];
      return [...safePrevData, newChartData].slice(-2);
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

  const GraphHeader = ({ chartRef, title }) => (
    <Stack
      className="smartAlert-analytics-graph-header"
      justifyContent="flex-end"
      direction="row"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ position: "relative", width: "100%" }}
      >
        <Typography
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            ...style.text,
          }}
        >
          {title}
        </Typography>
        {/* Empty div to take up space and push GraphIconsContainer to the end */}
        <Box sx={{ flexGrow: 1 }} />
        {chartData && (
          <GraphIconsContainer
            chartRef={chartRef}
            svgRef={svgRef}
            data={chartData}
          />
        )}
      </Stack>
    </Stack>
  );

  return (
    <Stack
      className="smartAlert-analytics-graph-box"
      sx={{ height: flag === "trigger-analysis" ? "61vh" : "77vh" }}
    >
      <Stack className="smartAlert-analytics-graph-model ">
        {Object.keys(chartData).length === 0 ? (
          <>
            <GraphHeader title={`${title(flag)} Graph`} />
            <Typography sx={style.middleText}>
              Select all the dropdown values and submit to view the Graph.
            </Typography>
          </>
        ) : (
          <Stack className="graph-background">
            <Accordion defaultExpanded disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h7">Trigger Analysis Graphs</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack className="graph" direction={"row"} spacing={0.5}>
                  <Stack
                    sx={{
                      width: "49.9%",
                      height: "100%",
                      border: "1px solid #e1e1e1",
                      borderRadius: "4px",
                    }}
                  >
                    <GraphHeader
                      chartRef={chartRef1}
                      title={data?.[flag]?.chartData?.charts[0].title}
                    />
                    {chartData.length > 0 && (
                      <Bar
                        ref={chartRef1}
                        data={chartData[0]}
                        options={{
                          ...chartData[0]?.options,
                          responsive: true,
                          datasets: {
                            bar: {
                              barThickness: 40, // Set a fixed bar width (Adjust to your needs)
                              maxBarThickness: 50, // Prevents bars from being too wide
                              minBarLength: 2, // Ensures very small values are still visible
                            },
                          },
                        }}
                        plugins={[ChartDataLabels]}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )}
                  </Stack>
                  <Stack
                    sx={{
                      width: "49.8%",
                      height: "100%",
                      border: "1px solid #e1e1e1",
                      borderRadius: "4px",
                    }}
                  >
                    {chartData.length > 0 && (
                      <>
                        <GraphHeader
                          chartRef={chartRef2}
                          title={data?.[flag]?.chartData?.charts[1].title}
                        />
                        <Bar
                          ref={chartRef2}
                          data={chartData[1]}
                          options={{
                            ...chartData[1]?.options,
                            responsive: true,
                            // maintainAspectRatio: false,
                            datasets: {
                              bar: {
                                barThickness: 43.5, // Set a fixed bar width (Adjust to your needs)
                                maxBarThickness: 50, // Prevents bars from being too wide
                                minBarLength: 2, // Ensures very small values are still visible
                              },
                            },
                          }}
                          plugins={[ChartDataLabels]}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </>
                    )}
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            {/* Second Accordion: Tables (Initially Collapsed) */}
            {flag !== "predictive-analysis" && (
              <>
                <Accordion disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h7">
                      Trigger Analysis Data Tables
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack className="table" spacing={2}>
                      <SmartAlertAnalyticsTable
                        data={data?.[flag]?.chartData?.tables[0]}
                        title={data?.[flag]?.chartData?.tables[0]?.Table_type}
                      />
                      <SmartAlertAnalyticsTable
                        data={data?.[flag]?.chartData?.tables[1]}
                        title={data?.[flag]?.chartData?.tables[1]?.Table_type}
                      />
                    </Stack>
                  </AccordionDetails>
                </Accordion>
                <Accordion disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h7">Summary Table</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack className="table" spacing={2}>
                      <SmartAlertAnalyticsTable
                        data={data?.[flag]?.chartData?.tables[2]}
                        title={data?.[flag]?.chartData?.tables[2]?.Table_type}
                      />
                    </Stack>
                  </AccordionDetails>
                </Accordion>
                <Accordion disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h7">
                      Combined Triggers table
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack className="table" spacing={2}>
                      <SmartAlertAnalyticsTable
                        data={data?.[flag]?.chartData?.tables[3]}
                        title={data?.[flag]?.chartData?.tables[3]?.Table_type}
                      />
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default SmartAlertAnalyticsGraph;
