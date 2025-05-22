import React, { useEffect } from "react";
import { Dialog, Stack, Typography } from "@mui/material";
import ConfirmationIcon from "../../../assets/images/confirmationIcon.png";
import "./CustomConfirmationDialogBox.css";

const style = {
  dialog: {
    "& .MuiDialog-paper": {
      minWidth: "36%",
      minHeight: "42%",
      borderRadius: 2,
    },
  },
  titleText: {
    fontSize: "20px",
    fontWeight: "500",
    mt: "20px",
    fontFamily: "Inter, sans-serif",
    color: "#000000",
  },
  msgText: {
    fontSize: "12px",
    fontWeight: "400",
    mt: "10px",
    fontFamily: "Inter, sans-serif",
    color: "#909090",
  },
};

export const CustomConfirmationDialogBox = (props) => {
  const { open, close, text } = props;

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        close();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog sx={style.dialog} onClose={close} open={open}>
      <Stack alignItems="center">
        <img
          className="confirmation-img"
          src={ConfirmationIcon}
          alt="confirmationIcon"
        />
        <Typography sx={style.titleText}>{text?.title}</Typography>
        <Typography sx={style.msgText}>{text?.msg}</Typography>
      </Stack>
    </Dialog>
  );
};
