import React, { useEffect, useState } from "react";
import {
  Dialog,
  Stack,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Checkbox,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { addProductCodeApi } from "../../../services";
import { fetchDataAtom, addPopupDataAtom, deleteDataAtom } from "../../../atom";
import { useAtomValue, useAtom } from "jotai";
import "./AddProductDialogBox.css";

const style = {
  dialog: {
    "& .MuiDialog-paper": {
      minWidth: "36%",
      minHeight: "80%",
      borderRadius: 2,
    },
  },
  titleText: {
    fontSize: "20px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#000000",
  },
  msgText: {
    fontSize: "12px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
    color: "#6E6E6E",
  },
  addedText: {
    fontSize: "14px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
  },
  closeIcon: {
    cursor: "pointer",
  },
  textCancelIcon: {
    marginLeft: "4px",
    fontSize: "14px",
    cursor: "pointer",
  },
  autocomplete: {
    width: 320,
  },
  addBtn: {
    mt: "25px",
    background: "#002060",
    textTransform: "capitalize",
    width: "100px",
    height: "5.8vh",
    marginLeft: "10px",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#002060",
    },
  },
  cancleBtn: {
    mt: "20px",
    background: "#CCCCCC",
    textTransform: "capitalize",
    width: "130px",
    height: "6.2vh",
    marginLeft: "10px",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#000000",
    "&:hover": {
      background: "#CCCCCC",
    },
  },
  addProductBtn: {
    mt: "20px",
    background: "#002060",
    textTransform: "capitalize",
    width: "130px",
    height: "6.2vh",
    marginLeft: "10px",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#fffff",
    "&:hover": {
      background: "#002060",
    },
  },
};

const CommonAddDialogBox = (props) => {
  const { open, close, text, addProduct } = props;
  const fetchData = useAtomValue(fetchDataAtom);
  const [dialogData, setDialogData] = useAtom(addPopupDataAtom);
  const deleteData = useAtomValue(deleteDataAtom);
  const [showSelectedProduct, setShowSelectedProduct] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dropDownProductCode, setDropDownProductCode] = useState([]);

  const handleAllProductCodeApi = async () => {
    const payload = {
      Indication: fetchData.selectedIndication,
      Version: fetchData.selectedVersion,
    };
    const response = await addProductCodeApi(payload);
    if (response && response?.data && response.status === 200) {
      const data = {
        allProducts: [...response?.data?.Product_Name, ...deleteData?.products],
        diagnosisCode: [
          ...response?.data?.Diag_data,
          ...deleteData?.diagnosisCode,
        ],
        surgeryCode: [...response?.data?.Surg_data, ...deleteData?.surgeryCode],
        metastaticCode: [
          ...response?.data?.metastatic_data,
          ...deleteData?.metastaticCode,
        ],
      };

      const list = data.allProducts?.map((product) => ({
        title: Object.keys(product)[0],
      }));

      setDialogData(data);
      setDropDownProductCode(list);
    }
  };

  useEffect(() => {
    if (dialogData?.allProducts?.length > 0) {
      const keys = deleteData?.products.map((obj) => Object.keys(obj)[0]);
      const filteredAddedData = dialogData?.allProducts?.filter(
        (item) => !keys.includes(Object.keys(item)[0])
      );
      if (filteredAddedData.length === 0) {
        handleAllProductCodeApi();
        return;
      }
      const list = dialogData.allProducts?.map((product) => ({
        title: Object.keys(product)[0],
      }));
      setDropDownProductCode(list);
      return;
    }
    handleAllProductCodeApi();
  }, []);

  const handleInputChange = (event, newInputValue) => {
    if (newInputValue !== "") {
      setInputValue(newInputValue);
      const filteredOptions = dropDownProductCode.filter((option) =>
        option?.title?.toLowerCase().includes(newInputValue?.toLowerCase())
      );
      setSelectedOptions(filteredOptions);
      return;
    }
    if (
      (event === null && newInputValue === "") ||
      event._reactName === "onBlur"
    ) {
      return;
    } else if (event.type !== "click" && newInputValue === "") {
      setInputValue("");
      setSelectedOptions([]);
    }
  };

  const handleSelectionChange = (event, newValue) => {
    setSelectedOptions(newValue);
  };

  const handleAddProduct = () => {
    const showOptionArray = selectedOptions.map((option) => {
      return option.title;
    });
    const filteredArray = dialogData?.allProducts?.filter(
      (item) =>
        ![...showOptionArray, ...showSelectedProduct].includes(
          Object.keys(item)[0]
        )
    );
    const list = filteredArray.map((productCode) => ({
      title: Object.keys(productCode)[0],
    }));
    setShowSelectedProduct((prev) => [...prev, ...showOptionArray]);
    setDropDownProductCode(list);
    setSelectedOptions([]);
    setInputValue("");
  };

  const handleRemoveProduct = (product) => {
    const productList = showSelectedProduct.filter((item) => item !== product);
    const filteredArray = dialogData?.allProducts?.filter(
      (item) => !productList.includes(Object.keys(item)[0])
    );
    const list = filteredArray.map((productCode) => ({
      title: Object.keys(productCode)[0],
    }));
    setDropDownProductCode(list);
    setShowSelectedProduct(productList);
  };

  return (
    <Dialog sx={style.dialog} onClose={close} open={open}>
      <Stack className="add-dialog-model">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography sx={style.titleText}>{text?.title}</Typography>
            <Typography sx={style.msgText}>{text?.msg}</Typography>
          </Box>
          <CloseIcon sx={style.closeIcon} onClick={close} />
        </Stack>
        <Stack direction="row" alignItems="end" justifyContent="space-between">
          <Autocomplete
            id="add-dialog-box"
            options={dropDownProductCode}
            getOptionLabel={(option) => option.title}
            disableCloseOnSelect
            multiple
            disablePortal
            value={selectedOptions}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            sx={style.autocomplete}
            onChange={handleSelectionChange}
            renderTags={() => ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={
                  selectedOptions.length === 0
                    ? "Search"
                    : `Search ${selectedOptions.length} Products Found`
                }
              />
            )}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option.title}
                </li>
              );
            }}
          />
          <Button
            variant="contained"
            sx={style.addBtn}
            onClick={handleAddProduct}
          >
            Add
          </Button>
        </Stack>
        <Stack
          className="add-dialog-box"
          direction="row"
          alignItems="flex-start"
          alignContent="start"
        >
          {/* Map the Added Product/Code */}
          {showSelectedProduct &&
            showSelectedProduct.map((product, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                className="added-text-box"
              >
                <Typography sx={style.addedText}>{product}</Typography>
                <CloseIcon
                  sx={style.textCancelIcon}
                  onClick={() => handleRemoveProduct(product)}
                />
              </Stack>
            ))}
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" sx={style.cancleBtn} onClick={close}>
            Close
          </Button>
          <Button
            variant="contained"
            sx={style.addProductBtn}
            disabled={showSelectedProduct.length === 0}
            onClick={() => addProduct(showSelectedProduct)}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default CommonAddDialogBox;
