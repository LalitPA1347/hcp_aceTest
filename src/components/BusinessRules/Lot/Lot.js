import React from "react";
import { Stack, Typography, Checkbox, TextField } from "@mui/material";
import { fetchDataAtom } from "../../../atom";
import { useAtom } from "jotai";
import "./Lot.css";

const style = {
  headerText: {
    fontSize: "18px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  text: {
    mt: "30px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  lotText: {
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  checkbox: {
    padding: 0,
  },
  typeFields: {
    width: "28vw",
    mt: "10px",
  },
};

const Lot = () => {
  const [fetchData, setFetchData] = useAtom(fetchDataAtom);

  const handleChange = (event) => {
    const { value, name } = event.target;
    // Ensure that only numeric and 3 digit values are allowed
    if (/^\d*$/.test(value)) {
      if (value >= 0 && value <= 999) {
        setFetchData((prevData) => ({
          ...prevData,
          LOT: {
            ...prevData.LOT,
            [name]: value,
          },
        }));
      }
    }
  };

  const handleCheckBox = () => {
    setFetchData((prevData) => ({
      ...prevData,
      LOT: {
        ...prevData.LOT,
        a_to_a_status: !prevData.LOT.a_to_a_status,
      },
    }));
  };

  return (
    <Stack className="code-model">
      <Stack className="code-box">
        <Typography sx={style.headerText}>Lot(Line of Therapy)</Typography>
        <Typography sx={style.text}>A to B Lot Change</Typography>
        <Stack
          direction="row"
          alignItems="center"
          className="lot-checkbox-model"
        >
          <Checkbox checked={true} disabled sx={style.checkbox} />
          <Typography sx={style.lotText}>
            When changing from "Product A" to "Product B", if the date
            difference is more than 28 days, mark a line change.
          </Typography>
        </Stack>
        <TextField
          sx={style.typeFields}
          id="outlined-textarea"
          placeholder="Enter A to B Lot Change"
          name="a_to_b_lot"
          value={fetchData.LOT?.a_to_b_lot}
          onChange={handleChange}
        />
        <Typography sx={style.text}>A to A Lot Change</Typography>
        <Stack
          direction="row"
          alignItems="center"
          className="lot-checkbox-model"
        >
          <Checkbox
            checked={fetchData.LOT?.a_to_a_status ?? false}
            sx={style.checkbox}
            name="AtoACheckbox"
            onChange={() => handleCheckBox()}
          />
          <Typography sx={style.lotText}>
            When changing from "Product A" to "Product A", if the date
            difference is more than 120 days, mark a line change.
          </Typography>
        </Stack>
        <TextField
          sx={style.typeFields}
          id="outlined-textarea"
          placeholder="Enter A to A Lot Change"
          name="a_to_a_lot"
          value={fetchData.LOT?.a_to_a_lot}
          disabled={!fetchData.LOT?.a_to_a_status}
          onChange={handleChange}
        />
      </Stack>
    </Stack>
  );
};

export default Lot;
