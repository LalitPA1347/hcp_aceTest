import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DatePickerComponent = (props) => {
  const { label, value, onChange } = props;
  const [hideLabel, setHideLabel] = useState(false);

  const handleChange = (date) => {
    setHideLabel(true);
    onChange(dayjs(date));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={["DatePicker"]}
        sx={{
          paddingTop: 0,
          margin: "0px 0px 10px 10px",
          background: "#ffffff",
          ".MuiTextField-root": {
            minWidth: "200px", 
          },
          ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
            fontSize: "12px",
            paddingLeft: "-2px", 
            paddingRight: "2px", 
          },
          ".css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
            borderRadius: 0,
          },
          overflow: "visible",
          height: 35,
          width: "200px", 
        }}
      >
        <DatePicker
          label={hideLabel ? "" : label} 
          autowidth
          slotProps={{
            textField: {
              sx: {
                width: "100%", 
                textAlign: "center",
                ".MuiInputLabel-root": {
                  textAlign: "center",
                  left: "40%",
                  top: "2%",
                  transform: "translateX(-40%)",
                  backgroundColor: "white",
                  padding: "9px 22px 5px 22px ",
                  display: hideLabel ? "none" : "block",
                },
              },
              InputLabelProps: {
                shrink: false,
                zIndex: 1100,
                background: "white",
                style: {
                  fontSize: "12px",
                },
              },
              inputProps: {
                style: {
                  height: 2,
                  textAlign: "center",
                },
              },
            },
            openPickerIcon: {
              sx: {
                fontSize: "18px",
              },
            },
          }}
          value={value || null}
          onChange={handleChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DatePickerComponent;

