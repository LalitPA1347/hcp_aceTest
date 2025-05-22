/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { MenuItem, Select, ListItemText } from "@mui/material";

const style = {
  dropDown: {
    m: "0px 0px 10px 10px",
    fontSize: "16px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
    background: "#F8F8F8",
    textTransform: "capitalize",
    height: "48px",
    borderRadius: "5px",
    "&:hover": {
      background: "#F8F8F8",
    },
    ".MuiTypography-root": {
      fontSize: "16px",
      fontWeight: "400",
      color: "#000000",
      fontFamily: "Inter, sans-serif",
    },
  },
  dropDownPaper: (selectedValue, value) => {
    return {
      ".MuiTypography-root": {
        fontSize: "16px",
        fontWeight: selectedValue === value ? "600" : "400",
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

const AdhocsSingleSelectDropdown = ({
  dropDownValue,
  dropDownName,
  selectedValue,
  handleChange,
  disabled,
}) => {
  const textRef = useRef(null);
  const [width, setWidth] = useState("auto");
  const [visibleCount, setVisibleCount] = useState(10);
  const listRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth + 118; // Extra padding for dropdown
      setWidth(`${textWidth}px`);
    }
  }, [dropDownName]);

  // Handle scroll directly on PaperProps
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setVisibleCount((prev) => Math.min(prev + 10, dropDownValue.length));
    }
  };

  const visibleOptions = dropDownValue.slice(0, visibleCount);

  return (
    <>
      {/* Hidden span to measure text width correctly */}
      <span
        ref={textRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontSize: "16px",
          fontWeight: "400",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {dropDownName}
      </span>
      <Select
        sx={{
          ...style.dropDown,
          width: dropDownName === "Condition" ? "120px" : "220px",
          height: dropDownName === "Datasource" ? "40px" : "48px",
          ".MuiSvgIcon-root": {
            color: disabled ? "#c2c1c1" : "#000000",
          },
        }}
        labelId="outlined-select-database-label"
        id="outlined-select-database"
        displayEmpty
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          PaperProps: {
            style: {
              maxHeight: 350,
              overflowY: "auto",
            },
            onScroll: handleScroll,
          },
        }}
        value={selectedValue}
        onChange={handleChange}
        renderValue={() => (selectedValue ? selectedValue : dropDownName)}
        name={dropDownName}
        disabled={disabled}
      >
        {visibleOptions.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemText
              primary={option}
              sx={style.dropDownPaper(selectedValue, option)}
            />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default AdhocsSingleSelectDropdown;
