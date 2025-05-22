import React, { useState } from "react";
import {
  Popover,
  MenuItem,
  Select,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
  popover: {
    fontSize: "12px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
    mr: "20px",
    cursor: "pointer",
  },
  dropDownPaper: (selectedValue, value) => {
    return {
      ".MuiTypography-root": {
        fontSize: "12px",
        fontWeight: selectedValue[0] === value ? "600" : "400",
        color: "#000000",
        fontFamily: "Inter, sans-serif",
      },
    };
  },
};

const MenuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
};

const SingleSelectWithSingleOptionDropdown = ({
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
    handleChange(dropDownName, { [value]: subselectedValue });
    setAnchorEl(null);
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
      m: "10px 20px 10px 20px",
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
        displayEmpty
        MenuProps={MenuProps}
        value={mainSelectedValues}
        renderValue={() =>
          Object.keys(mainSelectedValues).length !== 0
            ? mainSelectedValues
            : dropDownName
        }
        name={dropDownName}
        disabled={disabled}
        multiple
      >
        {dropDownValue.map((option) => (
          <MenuItem
            key={option.option}
            value={option.option}
            onClick={(event) => {
              event.preventDefault();
              handlePopoverOpen(event, option.option, option.values);
            }}
          >
            <ListItemText
              primary={option.option}
              sx={style.dropDownPaper(mainSelectedValues, option.option)}
            />
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
          <Stack direction="row" alignItems="center" key={index}>
            <Typography
              key={index}
              variant="h5"
              sx={subSelectDropDownStyle(subValue, subValues.option)}
              onClick={() => handlePopoverClose(subValue, subValues.option)}
            >
              {subValue}
            </Typography>
          </Stack>
        ))}
      </Popover>
    </>
  );
};

export default SingleSelectWithSingleOptionDropdown;
