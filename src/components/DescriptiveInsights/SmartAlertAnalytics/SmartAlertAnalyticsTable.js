import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import * as XLSX from "xlsx";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useLocation, useParams } from "react-router-dom";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import SaveReportDialog from "../SaveReportDialogBox";
import { useDispatch } from "react-redux";
import { resetIsDuplicateReport } from "../../../redux/descriptiveInsights/reportsSlice";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";

const style = {
  text: {
    mt: "3px",
    mb: "3px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#002060",
  },
};

const SmartAlertAnalyticsTable = ({ data, title }) => {
  const params = useParams();
  const tab = params.flag;
  const location = useLocation();
  const path = location.pathname;
  const dispatch = useDispatch();
  const [tooltipText, setTooltipText] = useState("Copy Table Data");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    dispatch(resetIsDuplicateReport());
  };

  const handleSave = (fileName) => {
    console.log(`Saving report with file name: ${fileName}`);
  };

  // // Extract the X-axis title from dataForGraph
  // const xAxisTitle =
  //   data?.Graph_Dimension?.find((d) => d.Xaxis)?.Xaxis || "Metric";

  // const generateTableData = () => {
  //   if (
  //     !data ||
  //     !Array.isArray(data?.labels) ||
  //     !Array.isArray(data?.datasets)
  //   ) {
  //     return { headers: [], rows: [] };
  //   }

  //   const labels = data.labels || [];
  //   const datasets = data.datasets || [];

  //   const headers = [xAxisTitle, ...labels];

  //   const rows = datasets.map((dataset) => {
  //     const rowData = { [xAxisTitle]: dataset.label };

  //     path.includes("/patientAnalytics/")
  //       ? labels.forEach((label, index) => {
  //           rowData[label] =
  //             dataset.data[index]?.y ?? dataset.data[index] + "%";
  //         })
  //       : labels.forEach((label, index) => {
  //           dataset.label === "depth"
  //             ? (rowData[label] = dataset.data[index]?.y ?? dataset.data[index])
  //             : (rowData[label] =
  //                 dataset.data[index]?.y ?? dataset.data[index]);
  //         });

  //     return rowData;
  //   });

  //   return { headers, rows };
  // };

  // const { headers, rows } = generateTableData();

  // const { Headers: headers, Rows: rows, Table_type } = data;
  const { Headers: headers = [], Rows: rows = [], Table_type = "" } = data || {};

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Add headers to the first row
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    XLSX.writeFile(workbook, "Table_data.xlsx");
  };

  const copyTableData = () => {
    const rowsString = rows
      .map((row) => headers.map((header) => row[header]).join("\t"))
      .join("\n");
    const headersString = headers.join("\t");
    return `${headersString}\n${rowsString}`;
  };

  const handleCopy = () => {
    setTooltipText("Copied to Clipboard!");
    setTimeout(() => {
      setTooltipText("Copy Table Data");
    }, 2000); // Reset tooltip text after 2 seconds
  };

  // const title = (input) => {
  //   return input
  //     .split("-")
  //     .map((word) =>
  //       word === "dot" || word === "sob"
  //         ? word.toUpperCase()
  //         : word.charAt(0).toUpperCase() + word.slice(1)
  //     )
  //     .join(" ");
  // };

  return data ? (
    <div className="table-container">
      {data?.chartType !== "sankey" && (
        <>
          <Stack
            className="patient-analytics-graph-header"
            justifyContent="flex-end"
            direction="rows"
          >
            <Stack
              className="btn-icon"
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
              <Stack direction="row">
                <Tooltip title="Export to Excel">
                  <GetAppOutlinedIcon
                    onClick={exportToExcel}
                    sx={{
                      fontSize: "22px",
                      marginRight: "8px",
                      cursor: "pointer",
                      color: "#002060",
                    }}
                  >
                    Export to Excel
                  </GetAppOutlinedIcon>
                </Tooltip>

                <CopyToClipboard text={copyTableData()} onCopy={handleCopy}>
                  <Tooltip title={tooltipText} key={tooltipText}>
                    <ContentCopyOutlinedIcon
                      sx={{
                        fontSize: "20px",
                        marginRight: "8px",
                        cursor: "pointer",
                        color: "#002060",
                      }}
                    />
                  </Tooltip>
                </CopyToClipboard>

                {(tab === "progression-rate" || tab === "testing-rate") && (
                  <>
                    <Tooltip title="Save Report">
                      <SaveAsOutlinedIcon
                        sx={{
                          fontSize: "20px",
                          marginRight: "8px",
                          cursor: "pointer",
                          color: "#002060",
                        }}
                        onClick={handleDialogOpen}
                      />
                    </Tooltip>

                    <SaveReportDialog
                      open={dialogOpen}
                      onClose={handleDialogClose}
                      onSave={handleSave}
                    />
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "100%", overflowY: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  {headers.map((header, index) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        background: "#EAEAF8",
                        fontFamily: "Inter, sans-serif",
                        border: "1px solid rgba(224, 224, 224, 1)",
                        color: "#002060",
                        padding: "8px",
                        textAlign: "center",
                        whiteSpace: "nowrap", // Prevent wrapping
                        borderBottom: "2px solid #dcdcdc",
                        ...(index === 1 && {
                          // width: "150px", // Fixed width
                          // minWidth: "150px",
                          maxWidth: "500px", // Ensures it does not resize
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }),
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header, index) => (
                      <TableCell
                        key={header}
                        sx={{
                          border: "1px solid rgba(224, 224, 224, 1)",
                          fontFamily: "Inter, sans-serif",
                          padding: "8px",
                          fontSize: "12px",
                          color: "#333",
                          textAlign: "center",
                          whiteSpace: "nowrap", // Prevent wrapping
                          borderBottom: "1px solid #dcdcdc",
                          ...(index === 1 && {
                            // width: "150px",
                            // minWidth: "150px",
                            maxWidth: "500px",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }),
                        }}
                      >
                        {row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  ) : (
    <p className="chart-msg">
      Select all the dropdown values and submit to view the Graph.
    </p>
  );
};

export default SmartAlertAnalyticsTable;
