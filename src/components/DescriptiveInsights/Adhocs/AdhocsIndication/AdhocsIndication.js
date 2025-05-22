import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { useState } from "react";
  import "../AdhocsIndication/AdhocsIndiction.css";
  import CloseIcon from "@mui/icons-material/Close";
  import { text } from "d3";
  
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
  
  const AdhocsIndication = ({
    droppedItems,
    handleDrop,
    removeItem,
    showPopup,
    currentItem,
    setShowPopup,
  }) => {
  
    const [showSelectedProduct, setShowSelectedProduct] = useState([]);
      const [selectedOptions, setSelectedOptions] = useState([]);
      const [inputValue, setInputValue] = useState("");
      const [dropDownProductCode, setDropDownProductCode] = useState(['a','b','c','d','d','e','f']);
     
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleClose = () => {
      setShowPopup(false);
    };
  
    return (
      <Stack className="indication-model2">
        <div style={{ width: "8%", paddingLeft: "10px", paddingTop: "6px" , fontSize:'14px' }}>
          Column :{" "}
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            marginTop: "2px",
            overflowY: "scroll",
            flex: "1 1 20%",
            display: "flex",
            gap: "10px",
            maxHeight: "200px",
            maxWidth: "100%",
            flexWrap: "wrap",
           marginBottom :'18px',
          // border:'2px solid red ',
          // height :'80px'
          // lineHeight :'1'
          minHeight :'60px'
          
          }}
        >
          {droppedItems.length === 0 && (
            <div
              style={{ color: "#aaa", fontStyle: "italic", paddingTop: "6px" , fontSize:'14px' }}
            >
              Drop filters here...
            </div>
          )}
          
          {droppedItems.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                justifyContent: "space-between",
  
                alignItems: "center",
                backgroundColor: "#ddd",
                marginBottom: "0px",
                padding: "5px",
                height: "25px",
                borderRadius: "10px",
                fontSize: "14px",
                // border :'2px solid red',
                // marginBottom: droppedItems.length > 6 ? "10px" : "6px",
               
              }}
            >
              {item}
              <span
                style={{
                  cursor: "pointer",
                  marginLeft: "10px",
                  fontWeight: "bold",
                  marginTop: "3px  ",
                }}
                onClick={() => removeItem(item)}
              >
                <CloseIcon sx={{ fontSize: "14px", paddingLeft:'2px' }} />
              </span>
            </div>
          ))}
        </div>
  
        {showPopup && (
            <Dialog sx={style.dialog} 
            // onClose={setShowPopup(!showPopup)} 
            open={showPopup}
            >
            <Stack className="add-dialog-model">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography sx={style.titleText}>{currentItem}</Typography>
                  <Typography sx={style.msgText}>{"Below is the list of all the Values"}</Typography>
                </Box>
                <CloseIcon sx={style.closeIcon} 
                onClick={()=> removeItem(currentItem)} 
                />
              </Stack>
              <Stack direction="row" alignItems="end" justifyContent="space-between">
                <Autocomplete
                  id="add-dialog-box"
                  options={dropDownProductCode}
                  getOptionLabel={(option) => option}
                  disableCloseOnSelect
                  multiple
                  disablePortal
                  value={selectedOptions}
                  inputValue={inputValue}
                  // onInputChange={handleInputChange}
                  isOptionEqualToValue={(option, value) =>
                    option.title === value.title
                  }
                  sx={style.autocomplete}
                  // onChange={handleSelectionChange}
                  renderTags={() => ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      // label={
                      //   selectedOptions.length === 0
                      //     ? "Search"
                      //     : `Search ${selectedOptions.length} Products Found`
                      // }
                    />
                  )}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox style={{ marginRight: 8 }} checked={selected} />
                        {option}
                      </li>
                    );
                  }}
                />
                <Button
                  variant="contained"
                  sx={style.addBtn}
                  // onClick={handleAddProduct}
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
                        // onClick={() => handleRemoveProduct(product)}
                      />
                    </Stack>
                  ))}
              </Stack>
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" sx={style.cancleBtn} 
                onClick={()=> removeItem(currentItem)}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  sx={style.addProductBtn}
                  // disabled={showSelectedProduct.length === 0}
                  onClick={() => setShowPopup(!showPopup) }
                >
                  Add Value
                </Button>
              </Stack>
            </Stack>
          </Dialog>
        )}
      </Stack>
    );
  };
  
  export default AdhocsIndication;
  