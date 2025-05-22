import React, { forwardRef, useImperativeHandle } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import "./DescriptiveInsightsTable.css";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DescriptiveInsightsTable = forwardRef((props, ref) => {
  const theme = useTheme();
  const rows = useSelector((state) => state.table.rows);
  const columns = useSelector((state) => state.table.columns);

  useImperativeHandle(ref, () => ({
    handleDownload() {
      const exportData = rows.map((row) => {
        const result = {};
        columns.forEach((col) => {
          result[col.headerName] = row[col.field];
        });
        return result;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Output");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const file = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(file, "output.xlsx");
    },
  }));

  return (
    <>
      <Box
        sx={{
          height: 370,
          width: "100%",
          bgcolor: "#fff",
          overflowY: "auto",
          // borderRadius: 2,
          // boxShadow: 1,
          // p: 2,
        }}
      >
        {/* <Box className="outputText">Output </Box> */}
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={{
            border: "none",
            // borderRadius: "0px",
            fontFamily: `"Segoe UI","Selawik","Open Sans",Arial,sans-serif`,
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: theme.palette.grey[100],
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderTop: `1px solid ${theme.palette.divider}`,
              position: "sticky", // 👈 ensures sticky headers
              top: 0,
            },
            "& .MuiDataGrid-row": {
              bgcolor: "#fff",
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: theme.palette.action.hover,
            },
            "& .MuiDataGrid-footerContainer": {
              display: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
          }}
        />
      </Box>
    </>
  );
});

export default DescriptiveInsightsTable;
