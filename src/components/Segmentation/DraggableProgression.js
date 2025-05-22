import React from "react";
import { Tooltip } from "@mui/material";
import { Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";

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

const DraggableProgression = ({
  item,
  index,
  moveItem,
  ruleName,
  ruleDesc,
  handleDeleteProgressionRules,
  handleUpdateProgressionRule,
}) => {
  return (
    <Tooltip key={ruleName} title={ruleDesc} placement="top">
      <div
        key={index}
        className="segmentation-new-rules-textbox"
        onClick={() => handleUpdateProgressionRule(ruleName, ruleDesc)}
      >
        <h4>{ruleName}</h4>
        <Stack direction="row">
          <NorthIcon
            sx={index === 1 ? style.disableIcon2:style.icon2}
            onClick={(e) => {
              e.stopPropagation();
              moveItem(index, "up");
            }}
          />
          <SouthIcon
            sx={style.icon2}
            onClick={(e) => {
              e.stopPropagation();
              moveItem(index, "down");
            }}
          />
          <CloseIcon
            sx={style.icon}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProgressionRules(item);
            }}
          />
        </Stack>
      </div>
    </Tooltip>
  );
};

export default DraggableProgression;
