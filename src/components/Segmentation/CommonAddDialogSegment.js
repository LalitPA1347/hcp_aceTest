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
import { useAtomValue, useAtom } from "jotai";
import { addProductCodeApi } from "../../services"; // Product API
import { addPopupDataAtom, fetchDataAtom, deleteDataAtom } from "../../atom"; // Atom references for Product
import { useSelector } from "react-redux";

const style = {
  headerText: {
    lineHeight: 1.5,
    letterSpacing: "0.00938em",
    color: "#000000",
    fontSize: "20px",
    fontWeight: 500,
    fontFamily: "Inter, sans-serif",
  },
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
  cancelBtn: {
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
      background: "#B0B0B0", // slightly darker gray on hover
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
    color: "#ffffff", // corrected to #ffffff
    "&:hover": {
      background: "#001040", // slightly darker blue on hover
    },
  },
  addDialogBox: {
    display: "inline-flex",
    flexWrap: "wrap",
    boxSizing: "border-box",
    marginTop: "20px",
    border: "1px solid #e1e1e1",
    borderRadius: "4px",
    height: "44vh",
    width: "31.6vw",
    overflow: "auto",
    padding: "10px",
  },
};

const CommonAddDialogProduct = (props) => {
  const { open, close, addProduct } = props;
  const fetchData = useAtomValue(fetchDataAtom); // Fetch product-related data
  const [dialogData, setDialogData] = useAtom(addPopupDataAtom); // Handle product popup data
  const deleteData = useAtomValue(deleteDataAtom); // To handle deleted data if necessary
  const [showSelectedProduct, setShowSelectedProduct] = useState([]); // Store selected products
  const [selectedOptions, setSelectedOptions] = useState([]); // Selected product options
  const [inputValue, setInputValue] = useState("");
  const [dropDownProductCode, setDropDownProductCode] = useState([]); // Dropdown for product codes
  const { selectedAllSegCat } = useSelector(
    (store) => store.indicationDropdowns // Redux store for product-related categories
  );

  const handleAllProductCodeApi = async () => {
    const payload = {
      Indication: fetchData.selectedIndication,
      Version: fetchData.selectedVersion,
    };
    const response = await addProductCodeApi(payload); // API call for product codes
    if (response && response?.data && response.status === 200) {
      const data = {
        allProducts: selectedAllSegCat,
      };
      const list = data.allProducts?.map((product) => ({
        title: Object.keys(product)[0],
      }));
      setDialogData(data);
      setDropDownProductCode(list);
    }
  };

  useEffect(() => {
    const data = {
      allProducts: selectedAllSegCat,
    };
    const list = data.allProducts?.map((product) => ({
      title: product,
    }));
    setDialogData(data);
    setDropDownProductCode(list);
  }, [selectedAllSegCat]);

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
      (item) => ![...showOptionArray, ...showSelectedProduct].includes(item)
    );
    const list = filteredArray.map((productCode) => ({
      title: productCode,
    }));
    setShowSelectedProduct((prev) => [...prev, ...showOptionArray]);
    setDropDownProductCode(list);
    setSelectedOptions([]);
    setInputValue("");
  };

  useEffect(() => {
    if (props.open === true) {
      setShowSelectedProduct([]);
    }
  }, [props.open]);

  const handleRemoveProduct = (product) => {
    const productList = showSelectedProduct.filter((item) => item !== product);
    const filteredArray = dialogData?.allProducts?.filter(
      (item) => !productList.includes(item)
    );
    const list = filteredArray.map((productCode) => ({
      title: productCode,
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
          <Typography sx={style.headerText}>Select Segment category</Typography>
          <CloseIcon sx={style.closeIcon} onClick={close} />
        </Stack>
        <Typography sx={style.msgText}>
          Below is the list of all the rules of Segment Category
        </Typography>
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
          sx={style.addDialogBox}
          direction="row"
          alignItems="flex-start"
          alignContent="start"
        >
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
          <Button variant="contained" sx={style.cancelBtn} onClick={close}>
            Close
          </Button>
          <Button
            variant="contained"
            sx={style.addProductBtn}
            disabled={showSelectedProduct.length === 0}
            onClick={() => {
              addProduct(showSelectedProduct);
            }}
          >
            Import
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default CommonAddDialogProduct;
