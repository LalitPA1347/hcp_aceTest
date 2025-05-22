import React, { useState } from "react";
import {
  Popover,
  MenuItem,
  Select,
  ListItemText,
  Checkbox,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const style = {
  text: {
    fontSize: "12px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
    m: "20px",
    cursor: "pointer",
  },
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
      ml: "10px",
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

const MultiSelectWithSingleOptionDropDown = ({
  dropDownValue,
  dropDownName,
  selectedValue,
  handleChange,
  disabled,
}) => {
  const [subValues, setSubValues] = useState({ option: "", subValue: [] });
  const mainSelectedValues = Object.keys(selectedValue || {});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event, option, subOption) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSubValues({ option: option, subValue: subOption });
  };

  const handlePopoverClose = (subselectedValue, value) => {
    handleChange(dropDownName, { ...selectedValue, [value]: subselectedValue });
    setAnchorEl(null);
    return;
  };

  const handleChangeMultipleValue = (selectedOption) => {
    const newSelectedValues = [...mainSelectedValues];
    const currentIndex = newSelectedValues.indexOf(selectedOption);

    if (currentIndex === -1) {
      newSelectedValues.push(selectedOption);
    } else {
      newSelectedValues.splice(currentIndex, 1);
    }

    // Create the result object based on the new selected values
    const result = newSelectedValues.reduce((acc, opt) => {
      const data = dropDownValue.find((item) => item.option === opt);
      if (data) {
        const defaultVersion = data.values.find((version) =>
          version.includes("(Default)")
        );
        if (defaultVersion) {
          acc[opt] = defaultVersion;
        }
      }
      return acc;
    }, {});

    handleChange(dropDownName, result);
  };

  const subSelectDropDownStyle = (subselectedValue, value) => {
    let defaultVersion;
    if (mainSelectedValues.includes(value)) {
      defaultVersion = selectedValue?.[value];
    }
    return {
      fontSize: "12px",
      fontWeight: subselectedValue === defaultVersion ? "600" : "400",
      fontFamily: "Inter, sans-serif",
      m: "20px",
      cursor: "pointer",
    };
  };

  return (
    <>
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
        value={mainSelectedValues}
        displayEmpty
        multiple
        MenuProps={MenuProps}
        renderValue={(selected) =>
          selected.length === 0 ? dropDownName : mainSelectedValues.join(", ")
        }
        name={dropDownName}
        disabled={disabled}
      >
        {dropDownValue.map((option) => (
          <MenuItem
            key={option.option}
            value={option.option}
            onClick={(event) =>
              handlePopoverOpen(event, option.option, option.values)
            }
            sx={{
              ".MuiButtonBase-root": {
                padding: "0px",
              },
            }}
          >
            <Checkbox
              checked={mainSelectedValues.indexOf(option.option) > -1}
              onClick={(e) => {
                e.stopPropagation();
                handleChangeMultipleValue(option.option);
              }}
            />
            <ListItemText primary={option.option} sx={style.dropDownPaper} />
            <ArrowForwardIosIcon
              sx={{ fontSize: "12px", cursor: "pointer", ml: "10px" }}
            />
          </MenuItem>
        ))}
      </Select>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            boxShadow: "none",
            border: "1px solid #e1e1e1",
            maxHeight: "400px",
            maxWidth: "250px",
          },
        }}
      >
        {subValues?.subValue.map((subValue, index) => (
          <Typography
            key={index}
            variant="h5"
            sx={subSelectDropDownStyle(subValue, subValues.option)}
            onClick={() => handlePopoverClose(subValue, subValues.option)}
          >
            {subValue}
          </Typography>
        ))}
      </Popover>
    </>
  );
};

export default MultiSelectWithSingleOptionDropDown;
