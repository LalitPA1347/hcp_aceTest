import React from "react";
import { MenuItem, Select, ListItemText, Checkbox } from "@mui/material";

const style = {
  dropDown: {
    m: "0px 0px 10px 10px",
    fontSize: "12px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
    background: "#ffffff",
    textTransform: "capitalize",
    height: "35px",
    borderRadius: "2px",
    "&:hover": {
      background: "#ffffff",
    },
    ".MuiTypography-root": {
      fontSize: "12px",
      fontWeight: "400",
      color: "#000000",
      fontFamily: "Inter, sans-serif",
    },
  },
  dropDownPaper: {
    ".MuiTypography-root": {
      fontSize: "12px",
      fontWeight: "400",
      color: "#000000",
      fontFamily: "Inter, sans-serif",
    },
  },
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight:"400px"
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
};

const MultiSelectDropdown = ({
  dropDownValue,
  dropDownName,
  selectedValue,
  handleChange,
  disabled
}) => {
  return (
    <Select
      sx={{
        ...style.dropDown,
        ".MuiSvgIcon-root": {
          color: disabled ? "#c2c1c1" : "#000000",
        },
      }}
      labelId="outlined-select-database-label"
      id="outlined-select-database"
      autoWidth
      displayEmpty
      multiple
      MenuProps={MenuProps}
      value={selectedValue}
      onChange={handleChange}
      renderValue={(selected) =>
        selected.length === 0 ? dropDownName : selectedValue.join(", ")
      }
      name={dropDownName}
      disabled={disabled}
    >
      {dropDownValue.map((option) => (
        <MenuItem key={option} value={option}>
          <Checkbox checked={selectedValue.indexOf(option) > -1} />
          <ListItemText primary={option} sx={style.dropDownPaper} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultiSelectDropdown;
