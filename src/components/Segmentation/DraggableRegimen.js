import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import EditIcon from "@mui/icons-material/Edit";
import { Stack, Tooltip } from "@mui/material";

const style = {
  icon: {
    fontSize: "16px",
    mr: "8px",
    ml: "5px",
    cursor: "pointer",
    color: "#aaaaaa",
    "&:hover": {
      color: "black",
    },
  },
  icon2: {
    fontSize: "16px",
    mr: "0px",
    cursor: "pointer",
    color: "#aaaaaa",
    "&:hover": {
      color: "black",
    },
  },
  disableIcon2: {
    fontSize: "16px",
    mr: "0px",
    color: "#aaaaaa",
  },
};
const DraggableRegimen = ({
  item,
  index,
  moveItem,
  handleDeleteRegimanRule,
  handleEdit
}) => {
  return (
    <div className="segmentation-regimen-textbox">
      <h3 style={{ width: "410px" }}>{item}</h3>
      <Stack direction="row">
        <Tooltip title="Edit" placement="top">
          <EditIcon
            sx={index === 1 ? style.icon2 : style.disableIcon2}
            onClick={() => handleEdit(index)}
          />
        </Tooltip>
        <NorthIcon
          sx={index === 1 ? style.icon2 : style.disableIcon2}
          onClick={() => moveItem(index, "up")}
        />
        <SouthIcon sx={style.icon2} onClick={() => moveItem(index, "down")} />
        <CloseIcon
          sx={style.icon}
          onClick={() => handleDeleteRegimanRule(item)}
        />
      </Stack>
    </div>
  );
};

export default DraggableRegimen;
