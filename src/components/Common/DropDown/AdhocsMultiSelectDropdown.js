import React, { useEffect, useRef, useState } from "react";
import { MenuItem, Select, ListItemText, Checkbox } from "@mui/material";

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
  dropDownPaper: {
    ".MuiTypography-root": {
      fontSize: "16px",
      fontWeight: "400",
      color: "#000000",
      fontFamily: "Inter, sans-serif",
    },
  },
};

const AdhocsMultiSelectDropdown = ({
  dropDownValue,
  dropDownName,
  selectedValue,
  handleChange,
  disabled,
}) => {
  const textRef = useRef(null);
  const [, setWidth] = useState("auto");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth + 178; 
      setWidth(`${textWidth}px`);
    }
  }, [dropDownName]);

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
          fontSize: "12px",
          fontWeight: "400",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {dropDownName}
      </span>
      <Select
        sx={{
          ...style.dropDown,
          width: "220px",
          ".MuiSvgIcon-root": {
            color: disabled ? "#c2c1c1" : "#000000",
          },
        }}
        labelId="outlined-select-database-label"
        id="outlined-select-database"
        displayEmpty
        multiple
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
        renderValue={(selected) =>
          selected.length === 0 ? dropDownName : selectedValue.join(", ")
        }
        name={dropDownName}
        disabled={disabled}
      >
        {visibleOptions.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={selectedValue.indexOf(option) > -1} />
            <ListItemText primary={option} sx={style.dropDownPaper} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default AdhocsMultiSelectDropdown;
