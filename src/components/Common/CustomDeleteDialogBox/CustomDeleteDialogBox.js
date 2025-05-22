import React from "react";
import { Dialog, Stack, Typography, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import BackspaceIcon from "@mui/icons-material/Backspace";
import "./CustomDeleteDialogBox.css";

const style = {
  dialog: {
    "& .MuiDialog-paper": {
      minWidth: "38%",
      minHeight: "36%",
      borderRadius: 2,
    },
  },
  text: {
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#000000",
  },
  warningtext: {
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    color: "#282828",
  },
  msgText: {
    fontSize: "12px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
    color: "#282828",
    mt: "2px",
    width:"450px",
    mb:"5px"
  },
  closeIcon: {
    fontSize: "20px",
    cursor:"pointer"
  },
  warningIcon: {
    fontSize: "16px",
    color: "#791808",
  },
  deleteIcon: {
    color: "C00000",
  },
  backBtn: {
    mt: "25px",
    background: "#CCCCCC",
    textTransform: "capitalize",
    width: "130px",
    height: "6.2vh",
    marginLeft: "10px",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#282828",
    "&:hover": {
      background: "#CCCCCC",
    },
  },
  deleteBtn: {
    mt: "25px",
    background: "#C00000",
    textTransform: "capitalize",
    width: "152px",
    height: "6.2vh",
    marginLeft: "10px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#C00000",
    },
  },
};

const CustomDeleteDialogBox = (props) => {
  const { open, close, text, submit } = props;
  return (
    <Dialog sx={style.dialog} onClose={close} open={open}>
      <Stack className="delete-dialog-box">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography sx={style.text}>{text?.title}</Typography>
          <CloseIcon sx={style.closeIcon} onClick={close} />
        </Stack>
        <Stack direction="row" className="delete-dialog-warning-box">
          <Box className="delete-dialog-red-line"></Box>
          <Stack className="delete-dialog-warning-model">
            <Stack
              direction="row"
              alignItems="center"
              className="delete-dialog-warning-text-box"
            >
              <WarningIcon sx={style.warningIcon} />
              <Typography sx={style.warningtext}>Warning</Typography>
            </Stack>
            <Typography sx={style.msgText}>{text?.msg}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" sx={style.backBtn} onClick={close}>
            No, Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submit}
            sx={style.deleteBtn}
            endIcon={<BackspaceIcon sx={style.deleteIcon} />}
          >
            Yes, Delete it
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default CustomDeleteDialogBox;
