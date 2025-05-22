import React, { useState } from "react";
import { Button, Stack, Typography, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ndcProcedureCodeAtom,
  fetchDataAtom,
  addPopupDataAtom,
  addedDataAtom,
  deleteDataAtom,
} from "../../../atom";
import NdcProcedureBox from "./NdcProcedureBox";
import CustomDataGrid from "../../Common/CustomDataGrid/CustomDataGrid";
import CustomDeleteDialogBox from "../../Common/CustomDeleteDialogBox/CustomDeleteDialogBox";
import { CustomConfirmationDialogBox } from "../../Common/CustomConfirmationDialogBox/CustomConfirmationDialogBox";
import CommonAddDialogBox from "../AddProductDialogBox/AddProductDialogBox";
import { useSetAtom, useAtom } from "jotai";
import "./MarketBasket.css";

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

const MarketBasket = () => {
  const setNdcProcedureCode = useSetAtom(ndcProcedureCodeAtom);
  const [marketBacketData, setMarketBacketData] = useAtom(fetchDataAtom);
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
    msg:"",
  });
  const DeleteText = {
    title: "Delete Product?",
    msg: "Are you sure you want to delete this product? In case you want to include it in the future, use Add functionality.",
  };
  const AddDialogBox = {
    title: "Select Products",
    msg: "Below is the list of all the Products",
  };

  // MUI Datagrid Rows mapping
  const rows = marketBacketData.productName.map((item, index) => {
    const nccnApproved = Object.values(item).map((array) => {
      return array.find((data) => data.hasOwnProperty("nccn_approved"))
        .nccn_approved;
    });
    const fdaApproved = Object.values(item).map((array) => {
      return array.find((data) => data.hasOwnProperty("fda_approved"))
        .fda_approved;
    });
    return {
      id: index + 1,
      ProductName: Object.keys(item)[0],
      nccnApproved: nccnApproved,
      fdaApproved: fdaApproved,
    };
  });

  const columns = [
    {
      field: "ProductName",
      headerName: "Product Name",
      width: 248,
    },
    {
      field: "nccnApproved",
      headerName: "NCCN Approved",
      width: 185,
    },
    {
      field: "fdaApproved",
      headerName: "FDA Approved",
      width: 185,
    },
  ];

  const handleCellClick = (params) => {
    if (params.field === "ProductName") {
      const ClickProductName = marketBacketData.productName.filter((item) =>
        item.hasOwnProperty(params.row.ProductName)
      );

      setNdcProcedureCode({
        productName: params.row.ProductName,
        ndcCode: ClickProductName[0][params.row.ProductName][0]["NDC"],
        procedureCode:
          ClickProductName[0][params.row.ProductName][1]["Procedure_Code"],
      });
    }
  };

  const handleOnRowSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => {
      const row = rows.find((rowItem) => rowItem.id === id);
      return row.ProductName;
    });

    const deleteRow = selectedRowsData.map((item) => {
      return marketBacketData.productName.find((element) => element[item]);
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

  const handleAddProductFoundInDeleteProduct = (product) => {
    const filteredMarketBacketData = deleteData.products.filter((item) =>
      product.includes(Object.keys(item)[0])
    );
    const filteredDeleteData = deleteData.products.filter(
      (item) => !product.includes(Object.keys(item)[0])
    );
    setDeleteData((prevState) => ({
      ...prevState,
      products: filteredDeleteData,
    }));
    return filteredMarketBacketData;
  };

  const handleAddProductnotFoundInDeleteProduct = (product) => {
    const addedProduct = product.map((item) => {
      return addDialogProductData?.allProducts.find((element) => element[item]);
    });
    setAddedData((prevState) => ({
      ...prevState,
      products: [...prevState.products, ...addedProduct],
    }));
    return addedProduct;
  };

  const handleAddProduct = (product) => {
    const marketbasketAddedData = [];

    const filteredDialogData = addDialogProductData.allProducts.filter(
      (item) => !product.includes(Object.keys(item)[0])
    );

    const { found, notFound } = product.reduce(
      (acc, item) => {
        deleteData.products.some((obj) => obj[item])
          ? acc.found.push(item)
          : acc.notFound.push(item);
        return acc;
      },
      { found: [], notFound: [] }
    );

    if (found.length > 0) {
      const value = handleAddProductFoundInDeleteProduct(found);
      marketbasketAddedData.push(...value);
    }
    if (notFound.length > 0) {
      const value = handleAddProductnotFoundInDeleteProduct(notFound);
      marketbasketAddedData.push(...value);
    }

    setAddDialogProductData((prevState) => ({
      ...prevState,
      allProducts: filteredDialogData,
    }));

    setMarketBacketData((prevState) => ({
      ...prevState,
      productName: [...marketBacketData.productName, ...marketbasketAddedData],
    }));
    handleAddDialogBox();
    setConfirmationDialogBox({
      state: true,
      title: "Product Added!",
      msg: "Your Product has been Added successfully",
    });
  };
  
  const handleDeleteProductFoundInAddedProduct = (product) => {
    const filteredAddedData = addedData.products.filter(
      (item) => !product.includes(Object.keys(item)[0])
    );

    setAddedData((prevState) => ({
      ...prevState,
      products: filteredAddedData,
    }));
  };

  const handleDeleteProductnotFoundInAddedProduct = (product) => {
    const deletedProduct = product.map((item) => {
      return marketBacketData?.productName.find((element) => element[item]);
    });

     setDeleteData((prevState) => ({
       ...prevState,
       products: [...prevState.products, ...deletedProduct],
     }));
  };

  const handleDeleteProduct = () => {
    const deleteProductName = deleteRowValue.map((obj) => Object.keys(obj)[0]);

    const filteredData = marketBacketData.productName.filter((item) => {
      const key = Object.keys(item)[0];
      return !deleteProductName.includes(key);
    });

    const { found, notFound } = deleteProductName.reduce(
      (acc, item) => {
        addedData.products.some((obj) => obj[item])
          ? acc.found.push(item)
          : acc.notFound.push(item);
        return acc;
      },
      { found: [], notFound: [] }
    );    
    
    if (found.length > 0) {
      handleDeleteProductFoundInAddedProduct(found);
    }
    if (notFound.length > 0) {
      handleDeleteProductnotFoundInAddedProduct(notFound);
    }

    setMarketBacketData((prevState) => ({
      ...prevState,
      productName: filteredData,
    }));
    setAddDialogProductData((prevState) => ({
      ...prevState,
      allProducts: [...prevState.allProducts, ...deleteRowValue],
    }));
    handleDeleteDialogBox();
    handleDeleteOption();
    setConfirmationDialogBox({
      state: true,
      title: "Product deleted!",
      msg: "Your Product has been deleted successfully",
    });
  };

  return (
    <Stack className="market-basket-model">
      <Stack direction="row" className="market-basket-box">
        <Stack className="market-basket-table-model">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="market-basket-title-box"
          >
            <Typography sx={style.text}>
              Market Basket({rows?.length})
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
            cellClick={handleCellClick}
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
                Delete({deleteRowValue.length}) Products
              </Button>
            </Stack>
          )}
        </Stack>
        <NdcProcedureBox />
      </Stack>
      {deleteDialogOpen && (
        <CustomDeleteDialogBox
          open={deleteDialogOpen}
          close={handleDeleteDialogBox}
          text={DeleteText}
          submit={handleDeleteProduct}
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
        <CommonAddDialogBox
          open={addDialogOpen}
          close={handleAddDialogBox}
          text={AddDialogBox}
          addProduct={handleAddProduct}
        />
      )}
    </Stack>
  );
};

export default MarketBasket;
