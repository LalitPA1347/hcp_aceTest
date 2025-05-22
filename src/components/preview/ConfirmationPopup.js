import React from "react";
import { Button, Dialog } from "@mui/material";
import { fetchDataAtom } from "../../atom";
import { useAtomValue } from "jotai";
import "./Preview.css";

const style = {
  Btn: {
    textTransform: "capitalize",
    width: "140px",
    height: "45px",
    backgroundColor: "#004B7E",
    ml: "10px",
    "&:hover": {
      backgroundColor: "#004B7E",
    },
  },
};

const ConfirmationPopup = (props) => {
  const {open, close, submit} = props;
  const fetchData = useAtomValue(fetchDataAtom);

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          minWidth: "48%",
          minHeight: "48%",
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 25)",
          backdropFilter: "blur(4px)",
        },
      }}
      onClose={close}
      open={open}
    >
      <div className="confirmation-box">
        <h2>
          {`There have been no changes made in the selected version. The same
          version of the data was processed ${fetchData.dayDiff} days ago.`}
        </h2>
        <h2>Do you still want to process it again?</h2>
        <div className="confirmation-btn-box">
          <Button variant="contained" sx={style.Btn} onClick={close}>
            No
          </Button>
          <Button variant="contained" sx={style.Btn} onClick={submit}>
            Yes
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationPopup;
