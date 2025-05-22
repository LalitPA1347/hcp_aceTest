import React from "react";
import {
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./DropdownMenuButton.css";

const DropdownMenuButton = ({
  buttonLabel,
  options = [],
  selectedOptions,
  handleClick,
  handleCheckboxChange,
  anchorEl,
  handleClose,
}) => {
  return (
    <div>
      <button
        id="dropdown-menu-button"
        onClick={handleClick}
        className="button-dropdown"
      >
        {buttonLabel}
        <KeyboardArrowDownIcon className="arrow-icon" />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        MenuListProps={{
          "aria-labelledby": "multiSelect",
        }}
        className="menu-dropdown"
      >
        <MenuItem disabled className="menu-item">
          <em>{buttonLabel}</em>
        </MenuItem>

        <MenuItem className="menu-item">
          <FormControlLabel
            control={
              <Checkbox
                value="*"
                checked={selectedOptions.length === options.length}
                onChange={handleCheckboxChange}
                className="checkbox"
              />
            }
            label="Select All"
            className="checkbox-label"
          />
        </MenuItem>

        {options.map((option, index) => (
          <MenuItem key={index} className="menu-item">
            <Tooltip title={option}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={handleCheckboxChange}
                    className="checkbox"
                  />
                }
                label={option}
                className="checkbox-label"
              />
            </Tooltip>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownMenuButton;
