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
  TableSortLabel,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import * as XLSX from "xlsx";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";

const style = {
  text: {
    mt: "3px",
    mb: "3px",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#002060",
  },
};

const AdhocsGenerateTable = ({ data }) => {
  const [tooltipText, setTooltipText] = useState("Copy Table Data");
  const { headers, rows, Title } = data;

  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedRows = useMemo(() => {
    const sorted = rows.slice().sort((a, b) => {
      if (!orderBy) return 0;
      const valA = a[orderBy];
      const valB = b[orderBy];
  
      if (typeof valA === "number" && typeof valB === "number") {
        return order === "asc" ? valA - valB : valB - valA;
      }
  
      return order === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  
    return sorted;
  }, [rows, orderBy, order]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    XLSX.writeFile(workbook, "Table_data.xlsx");
  };

  const copyTableData = () => {
    const rowsString = sortedRows
      .map((row) => headers.map((header) => row[header]).join("\t"))
      .join("\n");
    const headersString = headers.join("\t");
    return `${headersString}\n${rowsString}`;
  };

  const handleCopy = () => {
    setTooltipText("Copied to Clipboard!");
    setTimeout(() => {
      setTooltipText("Copy Table Data");
    }, 2000);
  };
  const BATCH_SIZE = 100;
  const [visibleRows, setVisibleRows] = useState(
    sortedRows.slice(0, BATCH_SIZE)
  );
  useEffect(() => {
    setVisibleRows(sortedRows.slice(0, BATCH_SIZE));
  }, [sortedRows]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const bottom = scrollTop + clientHeight >= scrollHeight - 5;

    if (bottom && visibleRows.length < sortedRows.length) {
      const nextBatch = sortedRows.slice(
        visibleRows.length,
        visibleRows.length + BATCH_SIZE
      );
      setVisibleRows((prev) => [...prev, ...nextBatch]);
    }
  };

  return data ? (
    <div className="table-container">
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
            {Title}
          </Typography>
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
              />
            </Tooltip>
            <CopyToClipboard text={copyTableData()} onCopy={handleCopy}>
              <Tooltip title={tooltipText} key={tooltipText}>
                <ContentCopyIcon
                  sx={{
                    fontSize: "19px",
                    marginRight: "8px",
                    cursor: "pointer",
                    color: "#002060",
                  }}
                />
              </Tooltip>
            </CopyToClipboard>
          </Stack>
        </Stack>
      </Stack>

      <TableContainer
        component={Paper}
        onScroll={handleScroll}
        sx={{ maxHeight: "418px", overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              {headers &&
                headers.map((header) => (
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
                      whiteSpace: "nowrap",
                      borderBottom: "2px solid #dcdcdc",
                      cursor: "pointer",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === header}
                      direction={orderBy === header ? order : "asc"}
                      onClick={() => handleSort(header)}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows &&
              visibleRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontFamily: "Inter, sans-serif",
                        padding: "8px",
                        fontSize: "12px",
                        color: "#333",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid #dcdcdc",
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
    </div>
  ) : (
    <p className="chart-msg">
      Select the dropdowns, Conditions and submit to view the result.
    </p>
  );
};

export default AdhocsGenerateTable;

