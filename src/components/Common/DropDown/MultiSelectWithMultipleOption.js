import React, { useState } from "react";
import {
  Popover,
  MenuItem,
  Select,
  ListItemText,
  Checkbox,
  Typography,
  Stack,
  CircularProgress,
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
        fontWeight: selectedValue.includes(value) ? "600" : "400",
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

const MultiSelectWithMultipleOption = ({
  dropDownValue,
  dropDownName,
  selectedValue,
  handleChange,
  disabled,
}) => {
  const [subValues, setSubValues] = useState({ option: "", subValue: [] });
  const [allSubValues, setAllSubValues] = useState([]);
  const mainSelectedValues = Object.keys(selectedValue || {});
  const [anchorEl, setAnchorEl] = useState(null);
  const [loader, setLoader] = useState(false);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event, option, subOption) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    if (subOption.length > 50) setLoader(true);

    const limitedSubOption =
      subOption.length > 50 ? subOption.slice(0, 50) : subOption;
    setSubValues({ option: option, subValue: limitedSubOption });
    setAllSubValues(subOption);
  };

  const handlePopoverClose = (subselectedValue, value) => {
    if (Object.keys(selectedValue).includes(value)) {
      if (selectedValue?.[value].includes(subselectedValue)) {
        const updatedSubValue = selectedValue?.[value].filter(
          (item) => item !== subselectedValue
        );
        if (updatedSubValue.length === 0) {
          const updatedSelectedValue = Object.fromEntries(
            Object.entries(selectedValue).filter(([key]) => key !== value)
          );
          handleChange(dropDownName, updatedSelectedValue);
          return;
        }
        handleChange(dropDownName, {
          ...selectedValue,
          [value]: updatedSubValue,
        });
        return;
      }
      handleChange(dropDownName, {
        ...selectedValue,
        [value]: [...selectedValue?.[value], subselectedValue],
      });
      return;
    }
    handleChange(dropDownName, {
      ...selectedValue,
      [value]: [subselectedValue],
    });
    return;
  };

  const handleCheckbox = (subselectedValue, value) => {
    if (Object.keys(selectedValue).includes(value)) {
      if (selectedValue?.[value].includes(subselectedValue)) {
        return true;
      }
    }
    return false;
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight) {
      setSubValues((prev) => {
        const currentLength = prev.subValue.length;
        const nextBatch = allSubValues.slice(
          currentLength,
          currentLength + 100
        );

        // Avoid duplication if no more items are available
        if (nextBatch.length === 0) {
          setLoader(false);
          return prev;
        }

        return {
          ...prev,
          subValue: [...prev.subValue, ...nextBatch], 
        };
      });
    }
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
        {dropDownValue.map((option, index) => (
          <MenuItem
            key={index}
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
        onClose={() => {
          setSubValues({ option: null, subValue: [] });
          setAnchorEl(null);
        }}
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
          onScroll: (event) => handleScroll(event),
        }}
      >
        {open &&
          subValues?.subValue.map((subValue, index) => (
            <Stack direction="row" alignItems="center" key={index}>
              <Checkbox
                checked={handleCheckbox(subValue, subValues.option)}
                onClick={() => handlePopoverClose(subValue, subValues.option)}
                size="small"
              />
              <Typography
                key={index}
                variant="h5"
                sx={style.popover}
                onClick={() => handlePopoverClose(subValue, subValues.option)}
              >
                {subValue}
              </Typography>
            </Stack>
          ))}

        {loader && <CircularProgress size="30px" sx={{ ml: "45%" }} />}
      </Popover>
    </>
  );
};

export default MultiSelectWithMultipleOption;
