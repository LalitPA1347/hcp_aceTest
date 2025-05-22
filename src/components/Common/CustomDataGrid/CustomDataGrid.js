import React from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import styled from "@emotion/styled";

const SDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: "#fafafc",
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: "#ffffff",
  },
  [`& .${gridClasses.columnHeader}`]: {
    backgroundColor: "#EAEAF8",
    fontSize: "12px",
    fontWeight: "500",
    color: "#8085AF",
  },
  "& .MuiDataGrid-footerContainer": {
    display: "none",
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: "#EAEAF8",
  },
  "& .MuiDataGrid-scrollbarFiller": {
    backgroundColor: "#EAEAF8",
  },
}));

const CustomDataGrid = (props) => {
  const {
    cellClick,
    checkbox,
    selectedRowIds,
    handleOnRowSelectionModelChange,
    rows,
    columns,
  } = props;
  
  const getRowId = (row) => row.id;

  return (
    <SDataGrid
      key={checkbox ? getRowId : ""}
      rows={rows}
      columns={columns}
      onCellClick={cellClick}
      rowHeight={36}
      columnHeaderHeight={36}
      checkboxSelection={checkbox}
      rowSelectionModel={selectedRowIds}
      onRowSelectionModelChange={handleOnRowSelectionModelChange}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
    />
  );
};

export default CustomDataGrid;
