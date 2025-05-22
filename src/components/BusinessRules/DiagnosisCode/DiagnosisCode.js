import React, { useState } from "react";
import { Button, Stack, Typography, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchDataAtom,
  addPopupDataAtom,
  addedDataAtom,
  deleteDataAtom,
} from "../../../atom";
import CustomDataGrid from "../../Common/CustomDataGrid/CustomDataGrid";
import CustomDeleteDialogBox from "../../Common/CustomDeleteDialogBox/CustomDeleteDialogBox";
import { CustomConfirmationDialogBox } from "../../Common/CustomConfirmationDialogBox/CustomConfirmationDialogBox";
import AddCodeDialogBox from "../AddCodeDialogBox/AddCodeDialogBox";
import { useAtom } from "jotai";
import "./DiagnosisCode.css";

const style = {
  text: {
    fontSize: "18px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  icon: {
    fontSize: "20px",
    marginRight: "5px",
    cursor: "pointer",
  },
  backBtn: {
    mt: "10px",
    background: "#002060",
    textTransform: "capitalize",
    width: "152px",
    height: "6.2vh",
    marginRight: "10px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#002060",
    },
  },
  deleteBtn: {
    mt: "10px",
    background: "#C00000",
    textTransform: "capitalize",
    width: "152px",
    height: "6.2vh",
    marginRight: "10px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#C00000",
    },
  },
};

const DiagnosisCode = () => {
  const [diagnosisCodeData, setDiagnosisCodeData] = useAtom(fetchDataAtom);
  const [addedData, setAddedData] = useAtom(addedDataAtom);
  const [deleteData, setDeleteData] = useAtom(deleteDataAtom);
  const [addDialogProductData, setAddDialogProductData] =
    useAtom(addPopupDataAtom);
  const [deleteRowOption, setDeleteRowOption] = useState(false);
  const [deleteRowValue, setDeleteRowValue] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [confirmationDialogBox, setConfirmationDialogBox] = useState({
    state: false,
    title: "",
    msg: "",
  });
  const DeleteText = {
    title: "Diagnosis Code?",
    msg: "Are you sure you want to delete this Diagnosis Code? In case you want to include it in the future, use Add functionality.",
  };
  const AddDialogBox = {
    title: "Select Codes",
    msg: "Below is the list of all the Codes",
  };

  // MUI Datagrid Rows mapping
  const rows = diagnosisCodeData.diagnosisCode.map((item, index) => {
    const code = Object.keys(item)[0];
    const description = item[code];
    return { id: index + 1, code, description };
  });

  // MUI Datagrid Columns mapping
  const columns = [
    { field: "code", headerName: "Code", width: 80 },
    {
      field: "description",
      headerName: "Description",
      width: 880,
    },
  ];

  const handleOnRowSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => {
      const row = rows.find((rowItem) => rowItem.id === id);
      return row.code;
    });
    const deleteRow = selectedRowsData.map((item) => {
      return diagnosisCodeData.diagnosisCode.find((element) => element[item]);
    });
    setDeleteRowValue(deleteRow);
    setSelectedRowIds(ids);
  };

  const handleDeleteOption = () => {
    setSelectedRowIds([]);
    setDeleteRowValue([]);
    setDeleteRowOption((prev) => !prev);
  };

  const handleDeleteDialogBox = () => {
    setDeleteDialogOpen((prev) => !prev);
  };

  const handleConfirmationDialogBox = () => {
    setConfirmationDialogBox({
      state: false,
      title: "",
      msg: "",
    });
  };

  const handleAddDialogBox = () => {
    setAddDialogOpen((prev) => !prev);
  };

  const handleAddProductFoundInDeleteCode = (code) => {
    const filteredDiagnosisCode = deleteData.diagnosisCode.filter((item) =>
      code.includes(Object.keys(item)[0])
    );
    const filteredDeleteData = deleteData.diagnosisCode.filter(
      (item) => !code.includes(Object.keys(item)[0])
    );
    setDeleteData((prevState) => ({
      ...prevState,
      diagnosisCode: filteredDeleteData,
    }));
    return filteredDiagnosisCode;
  };

  const handleAddProductnotFoundInDeleteCode = (code) => {
    const addedProduct = code.map((item) => {
      return addDialogProductData?.diagnosisCode.find(
        (element) => element[item]
      );
    });
    setAddedData((prevState) => ({
      ...prevState,
      diagnosisCode: [...prevState.diagnosisCode, ...addedProduct],
    }));
    return addedProduct;
  };

  const handleAddCode = (codeArray) => {
    const diagnosisCodeAddedData = [];

    const code = codeArray.map((str) => str.split(":")[0]);
    const filteredDialogData = addDialogProductData.diagnosisCode.filter(
      (item) => !code.includes(Object.keys(item)[0])
    );

    const { found, notFound } = code.reduce(
      (acc, item) => {
        deleteData.diagnosisCode.some((obj) => obj[item])
          ? acc.found.push(item)
          : acc.notFound.push(item);
        return acc;
      },
      { found: [], notFound: [] }
    );

    if (found.length > 0) {
      const value = handleAddProductFoundInDeleteCode(found);
      diagnosisCodeAddedData.push(...value);
    }
    if (notFound.length > 0) {
      const value = handleAddProductnotFoundInDeleteCode(notFound);
      diagnosisCodeAddedData.push(...value);
    }

    setAddDialogProductData((prevState) => ({
      ...prevState,
      diagnosisCode: filteredDialogData,
    }));

    setDiagnosisCodeData((prevState) => ({
      ...prevState,
      diagnosisCode: [
        ...diagnosisCodeData.diagnosisCode,
        ...diagnosisCodeAddedData,
      ],
    }));
    handleAddDialogBox();
    setConfirmationDialogBox({
      state: true,
      title: "Codes Added!",
      msg: "Your Codes has been Added successfully",
    });
  };

  const handleDeleteProductFoundInAddedCode = (code) => {
    const filteredAddedData = addedData.diagnosisCode.filter(
      (item) => !code.includes(Object.keys(item)[0])
    );
    setAddedData((prevState) => ({
      ...prevState,
      diagnosisCode: filteredAddedData,
    }));
  };

  const handleDeleteProductnotFoundInAddedCode = (code) => {
    const deletedProduct = code.map((item) => {
      return diagnosisCodeData?.diagnosisCode.find((element) => element[item]);
    });
    setDeleteData((prevState) => ({
      ...prevState,
      diagnosisCode: [...prevState.diagnosisCode, ...deletedProduct],
    }));
  };

  const handleDeleteCode = () => {
    const deleteCode = deleteRowValue.map((obj) => Object.keys(obj)[0]);
    const filteredDialogData = diagnosisCodeData.diagnosisCode.filter(
      (item) => !deleteCode.includes(Object.keys(item)[0])
    );
    const { found, notFound } = deleteCode.reduce(
      (acc, item) => {
        addedData.products.some((obj) => obj[item])
          ? acc.found.push(item)
          : acc.notFound.push(item);
        return acc;
      },
      { found: [], notFound: [] }
    );

    if (found.length > 0) {
      handleDeleteProductFoundInAddedCode(found);
    }
    if (notFound.length > 0) {
      handleDeleteProductnotFoundInAddedCode(notFound);
    }

    setDiagnosisCodeData((prevState) => ({
      ...prevState,
      diagnosisCode: filteredDialogData,
    }));
    setAddDialogProductData((prevState) => ({
      ...prevState,
      diagnosisCode: [...prevState.diagnosisCode, ...deleteRowValue],
    }));
    handleDeleteDialogBox();
    handleDeleteOption();
    setConfirmationDialogBox({
      state: true,
      title: "Code deleted!",
      msg: "Your Code has been deleted successfully",
    });
  };
  return (
    <Stack className="code-model">
      <Stack direction="row" className="code-box">
        <Stack className="code-table-model">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="code-title-box"
          >
            <Typography sx={style.text}>
              Diagnosis Code({rows?.length})
            </Typography>
            <Box>
              <DeleteIcon sx={style.icon} onClick={handleDeleteOption} />
              <AddCircleOutlineIcon
                sx={style.icon}
                onClick={handleAddDialogBox}
              />
            </Box>
          </Stack>

          {/* CustomDataGrid for Table Representation */}
          <CustomDataGrid
            rows={rows}
            columns={columns}
            checkbox={deleteRowOption}
            selectedRowIds={selectedRowIds}
            handleOnRowSelectionModelChange={handleOnRowSelectionModelChange}
          />

          {deleteRowOption && (
            <Stack direction="row" justifyContent="space-evenly">
              <Button
                variant="contained"
                sx={style.backBtn}
                onClick={handleDeleteOption}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteDialogBox}
                sx={style.deleteBtn}
                disabled={!deleteRowValue.length > 0}
              >
                Delete({deleteRowValue.length}) codes
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
      {deleteDialogOpen && (
        <CustomDeleteDialogBox
          open={deleteDialogOpen}
          close={handleDeleteDialogBox}
          text={DeleteText}
          submit={handleDeleteCode}
        />
      )}
      {confirmationDialogBox.state && (
        <CustomConfirmationDialogBox
          open={confirmationDialogBox.state}
          close={handleConfirmationDialogBox}
          text={confirmationDialogBox}
        />
      )}
      {addDialogOpen && (
        <AddCodeDialogBox
          open={addDialogOpen}
          close={handleAddDialogBox}
          text={AddDialogBox}
          codeName="diagnosisCode"
          handleAddCode={handleAddCode}
        />
      )}
    </Stack>
  );
};

export default DiagnosisCode;
