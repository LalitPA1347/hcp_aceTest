import React from "react";
import { Checkbox, TextField, InputAdornment } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DraggableProgression from "./DraggableProgression"; // Assuming this is an existing component

const ProgressionRules = ({
  expand,
  segmentationData,
  style,
  progressionDays,
  matRuleList,
  handleCheckBox,
  handleDaysChange,
  moveProgressionItem,
  handleDeleteProgressionRules,
  handleUpdateProgressionRule,
  setAddNewRulesPopup,
}) => {
  return (
    <>
      {expand && (
        <div className="segmentation-progression-rules-model">
          <div className="segmentation-progression-rules-textbox-box">
            <Checkbox
              checked={segmentationData.LOT?.a_to_a_status}
              sx={style.checkbox}
              name="AtoACheckbox"
              onChange={handleCheckBox}
            />
            <TextField
              sx={style.rulesTypeFields}
              id="outlined-textarea"
              name="AtoA"
              value={progressionDays.AtoA}
              disabled={!segmentationData.LOT?.a_to_a_status}
              onChange={handleDaysChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    A to A progression -
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    <InputAdornment sx={{ mr: "268px" }} position="end">
                      days
                    </InputAdornment>
                    <InputAdornment position="end">
                      <ModeEditIcon />
                    </InputAdornment>
                  </>
                ),
              }}
            />
            <TextField
              sx={style.rulesTypeFields}
              id="outlined-textarea"
              name="AtoB"
              value={progressionDays.AtoB}
              onChange={handleDaysChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    A to B progression -
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    <InputAdornment sx={{ mr: "266px" }} position="end">
                      days
                    </InputAdornment>
                    <InputAdornment position="end">
                      <ModeEditIcon />
                    </InputAdornment>
                  </>
                ),
              }}
            />
          </div>

          <div className="segmentation-new-rules-box">
            {matRuleList.length === 0 && (
              <h2>Added Progression Rules will be shown Here</h2>
            )}
            {matRuleList.map((item, index) => (
              <DraggableProgression
                key={index}
                item={item}
                index={index}
                moveItem={moveProgressionItem}
                handleDeleteProgressionRules={handleDeleteProgressionRules}
                handleUpdateProgressionRule={handleUpdateProgressionRule}
                ruleName={item.Rule_Name}
                ruleDesc={item.Rule_desc}
              />
            ))}
          </div>

          <h5 onClick={() => setAddNewRulesPopup(true)}>+ Add New Rules</h5>
        </div>
      )}
    </>
  );
};

export default ProgressionRules;
