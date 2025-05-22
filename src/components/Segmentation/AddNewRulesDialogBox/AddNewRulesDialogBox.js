import React, { useEffect, useState } from "react";
import {
  Dialog,
  Stack,
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  MenuItem,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  segmentationDataAtom,
  createdProgressionRulesAtom,
  createdProgressionDataAtom,
} from "../../../atom";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import "./AddNewRulesDialogBox.css";

const lotDecisionForRegimen = [
  "Consider as stage-3",
  "Make Line One",
  "Reduce The Line By One",
  "Increase The Line By One",
  "Merge Line",
];
const lotDecisionForMetastaticSurgery = [
  "Consider as stage-3",
  "Make Line One",
  "Reduce The Line By One",
  "Increase The Line By One",
];

const TimeFrameDropDown = [
  {
    value: ">",
    label: ">",
  },
  {
    value: "<",
    label: "<",
  },
  {
    value: ">=",
    label: ">=",
  },
  {
    value: "<=",
    label: "<=",
  },
  {
    value: "NA",
    label: "NA",
  },
];

const style = {
  dialog: {
    "& .MuiDialog-paper": {
      minWidth: "48%",
      height: "90%",
      borderRadius: 2,
    },
  },
  titleText: {
    fontSize: "20px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#000000",
  },
  msgText: {
    fontSize: "12px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
    color: "#6E6E6E",
    mb: "10px",
  },
  closeIcon: {
    cursor: "pointer",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    m: "10px 40px",
  },
  radioGroupLabel: {
    "& .MuiFormControlLabel-label": {
      fontSize: "14px",
      fontWeight: "500",
      fontFamily: "Inter, sans-serif",
    },
  },
  typeFieldLabel: {
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  regimenText: {
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    mb: "5px",
    mt: "10px",
  },
  autocomplete: {
    width: 260,
    mt: "5px",
    background: "#f2f2f2",
  },
  selectFields: {
    mt: "5px",
    width: "6vw",
    mr: "16px",
    background: "#f2f2f2",
  },
  cancleBtn: {
    mt: "20px",
    background: "#CCCCCC",
    textTransform: "capitalize",
    width: "130px",
    height: "6.2vh",
    marginLeft: "10px",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#000000",
    "&:hover": {
      background: "#CCCCCC",
    },
  },
  addProductBtn: {
    mt: "20px",
    background: "#002060",
    textTransform: "capitalize",
    width: "130px",
    height: "6.2vh",
    marginLeft: "10px",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#fffff",
    "&:hover": {
      background: "#002060",
    },
  },
};

const AddNewRulesDialogBox = (props) => {
  const { open, close, regimenList, matRuleList, updateProgressionRuleData } =
    props;

  const [segmentationData, setSegmentationData] = useAtom(segmentationDataAtom);
  const [createdProgressionRules, setCreatedProgressionRules] = useAtom(
    createdProgressionRulesAtom
  );
  const [savedProgressionData, setSavedProgressionData] = useAtom(
    createdProgressionDataAtom
  );
  const [regimenCategoryList, setRegimenCategoryList] = useState([]);
  const [progressionData, setProgressionData] = useState({
    ruleName: "",
    ruleSelected: "regimen",
    fromRegimen: "",
    fromLot: "",
    toRegimen: [],
    toLot: "",
    timeFrame: ">",
    timeFrameValue: "",
    lotDecision: "",
  });

  useEffect(() => {
    if (updateProgressionRuleData.ruleName) {
      setProgressionData({
        ruleName: updateProgressionRuleData.ruleName,
        ruleSelected: updateProgressionRuleData.ruleSelected,
        fromRegimen: updateProgressionRuleData.fromRegimen,
        fromLot: updateProgressionRuleData.fromLot,
        toRegimen: updateProgressionRuleData.toRegimen,
        toLot: updateProgressionRuleData.toLot,
        timeFrame: updateProgressionRuleData.timeFrame,
        timeFrameValue: updateProgressionRuleData.timeFrameValue,
        lotDecision: updateProgressionRuleData.lotDecision,
      });
    }
    const savedRegimenCategory = regimenList.map((item) =>
      item.split("THEN")[1].trim().replace(/'/g, "")
    );
    setRegimenCategoryList([...savedRegimenCategory, "OTHERS"]);
  }, []);

  const handleFromRegimenChange = (event, newValue, condition) => {
    if (condition === "from") {
      setProgressionData((prev) => ({
        ...prev,
        fromRegimen: newValue,
      }));
    } else {
      setProgressionData((prev) => ({
        ...prev,
        toRegimen: newValue,
      }));
    }
  };

  const handleTimeFrame = (event) => {
    const value = event.target.value;
    // Ensure that only numeric values are allowed
    if (/^\d*$/.test(value)) {
      if (value >= 0 && value <= 999) {
        setProgressionData((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
      }
    }
  };

  const handleChange = (event) => {
    if (
      event.target.name === "ruleSelected" &&
      event.target.value !== progressionData.ruleSelected
    ) {
      setProgressionData({
        ruleName: "",
        ruleSelected: "regimen",
        fromRegimen: "",
        fromLot: "",
        toRegimen: [],
        toLot: "",
        timeFrame: ">",
        timeFrameValue: "",
        lotDecision: "",
      });
    }

    if (event.target.value === "NA") {
      setProgressionData((prev) => ({
        ...prev,
        timeFrameValue: "",
        [event.target.name]: event.target.value,
      }));
      return;
    }
    setProgressionData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLotChange = (event, newValue, name) => {
    setProgressionData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const isDataValid = () => {
    const {
      ruleSelected,
      timeFrameValue,
      toRegimen,
      toLot,
      ...dataToValidate
    } = progressionData;

    if (ruleSelected !== "regimen") {
      // Exclude `toRegimen` and `toLot` if `ruleSelected` is not "regimen"
      return Object.values({
        ...dataToValidate,
        ruleSelected,
        timeFrameValue,
      }).every((value) => value !== "" && value !== null);
    }

    // Check if all fields in dataToValidate are non-empty
    return Object.values({
      ...dataToValidate,
      ruleSelected,
      toRegimen,
      toLot,
    }).every((value) => value !== "" && value !== null);
  };

  const handleSubmit = () => {
    if (
      progressionData.ruleName &&
      matRuleList.some(
        (rule) =>
          rule.Rule_Name.toLowerCase() ===
          progressionData.ruleName.toLowerCase()
      )
    ) {
      toast.error("Rule name already exists", {
        autoClose: 1000,
      });
      return;
    }

    if (!isDataValid()) {
      toast.error("All fields must be filled out", {
        autoClose: 1000,
      });
      return;
    }

    const toRegimen = () => {
      if (progressionData.ruleSelected === "regimen") {
        return ` to ${progressionData.toRegimen} ${progressionData.toLot}L`;
      }
      return "";
    };
    const ruleDesc = `This rule is for '${
      progressionData.ruleName
    }' for patients progressing from ${progressionData.fromRegimen} 
    ${progressionData.fromLot}L${toRegimen()} with day gap ${
      progressionData.timeFrame
    }${progressionData.timeFrameValue} then lot decision is ${
      progressionData.lotDecision
    } `;

    // Replace \ and \n with empty strings
    const cleanRuleDesc = ruleDesc.replace(/\\/g, "").replace(/\n/g, "");
    // const ruleDesc = `This rule is for "${progressionData.ruleName}" for patients progressing from ${progressionData.fromRegimen} ${progressionData.fromLot}L to ${progressionData.toRegimen} ${progressionData.toLot}L with day gap ${progressionData.timeFrame}${progressionData.timeFrameValue} then lot decision is ${progressionData.lotDecision} `;
    setCreatedProgressionRules((prev) => ({
      ...prev,
      added: [
        ...prev.added,
        { Rule_Name: progressionData.ruleName, Rule_desc: cleanRuleDesc },
      ],
    }));

    setSavedProgressionData((prev) => [...prev, { ...progressionData }]);
    // setAddNewRulesPopup(false);
    close();
  };

  const handleUpdateSubmit = () => {
    const toRegimen = () => {
      if (progressionData.ruleSelected === "regimen") {
        return ` to ${progressionData.toRegimen} ${progressionData.toLot}L`;
      }
      return "";
    };
    const ruleDesc = `This rule is for '${
      progressionData.ruleName
    }' for patients progressing from ${progressionData.fromRegimen} 
    ${progressionData.fromLot}L${toRegimen()} with day gap ${
      progressionData.timeFrame
    }${progressionData.timeFrameValue} then lot decision is ${
      progressionData.lotDecision
    } `;

    // Replace \ and \n with empty strings
    const cleanRuleDesc = ruleDesc.replace(/\\/g, "").replace(/\n/g, "");

    const updatedCreatedProgressionRulesAdded =
      createdProgressionRules.added.filter(
        (rule) => rule.Rule_Name !== progressionData.ruleName
      );

    const updatedCreatedProgressionRulesDataAdded = savedProgressionData.filter(
      (rule) => rule.ruleName !== progressionData.ruleName
    );

    if (
      segmentationData.MetRuleList.some(
        (rule) =>
          rule.Rule_Name === progressionData.ruleName &&
          rule.Rule_desc === updateProgressionRuleData.RuleDesc
      )
    ) {
      setCreatedProgressionRules((prev) => ({
        ...prev,
        added: [
          ...updatedCreatedProgressionRulesAdded,
          { Rule_Name: progressionData.ruleName, Rule_desc: cleanRuleDesc },
        ],
        deleted: [
          ...prev.deleted,
          {
            Rule_Name: progressionData.ruleName,
            Rule_desc: updateProgressionRuleData.RuleDesc,
          },
        ],
      }));

      setSavedProgressionData([
        ...updatedCreatedProgressionRulesDataAdded,
        { ...progressionData },
      ]);
      //   setAddNewRulesPopup(false);
      close();
      return;
    }

    setCreatedProgressionRules((prev) => ({
      ...prev,
      added: [
        ...updatedCreatedProgressionRulesAdded,
        { Rule_Name: progressionData.ruleName, Rule_desc: cleanRuleDesc },
      ],
    }));

    setSavedProgressionData([
      ...updatedCreatedProgressionRulesDataAdded,
      { ...progressionData },
    ]);
    // setAddNewRulesPopup(false);
    close();
  };
  return (
    <Dialog sx={style.dialog} onClose={close} open={open}>
      <Stack className="add-rule-dialog-model">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography sx={style.titleText}>Add New Rules</Typography>
            <Typography sx={style.msgText}>
              Adding information, you can add new rules
            </Typography>
          </Box>
          <CloseIcon sx={style.closeIcon} onClick={close} />
        </Stack>
        <TextField
          id="standard-basic"
          label="Rule Name"
          variant="standard"
          size="small"
          name="ruleName"
          value={progressionData.ruleName}
          onChange={handleChange}
          disabled={updateProgressionRuleData.ruleName}
          InputLabelProps={{
            sx: style.typeFieldLabel,
          }}
        />
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="ruleSelected"
          value={progressionData.ruleSelected}
          onChange={handleChange}
          sx={style.radioGroup}
        >
          <FormControlLabel
            value="regimen"
            control={<Radio />}
            label="Regimen Progression"
            sx={style.radioGroupLabel}
            disabled={updateProgressionRuleData.ruleSelected}
          />
          <FormControlLabel
            value="metastatic"
            control={<Radio />}
            label="Metastatic"
            sx={style.radioGroupLabel}
            disabled={updateProgressionRuleData.ruleSelected}
          />
          <FormControlLabel
            value="surgery"
            control={<Radio />}
            label="Surgery/Radiation"
            sx={style.radioGroupLabel}
            disabled={updateProgressionRuleData.ruleSelected}
          />
        </RadioGroup>
        <Stack className="regimen-category-box">
          <Typography sx={style.regimenText}>From</Typography>
          <Stack direction="row" justifyContent="space-between">
            <Stack>
              <Typography sx={style.typeFieldLabel}>
                Regimen Category
              </Typography>
              <Autocomplete
                id="tags-outlined"
                sx={style.autocomplete}
                options={regimenCategoryList}
                getOptionLabel={(option) => option}
                value={progressionData.fromRegimen}
                name="fromRegimen"
                filterSelectedOptions
                onChange={(event, newValue) =>
                  handleFromRegimenChange(event, newValue, "from")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enter your Values"
                    size="small"
                    // sx={style.typeFields}
                  />
                )}
              />
            </Stack>
            <Stack>
              <Typography sx={style.typeFieldLabel}>Lot</Typography>
              <Autocomplete
                id="tags-outlined"
                sx={style.autocomplete}
                value={progressionData.fromLot}
                options={segmentationData.LotList}
                onChange={(event, newValue) =>
                  handleLotChange(event, newValue, "fromLot")
                }
                getOptionLabel={(option) => option}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enter your Values"
                    size="small"
                    // sx={style.typeFields}
                  />
                )}
              />
            </Stack>
          </Stack>
          {progressionData.ruleSelected === "regimen" && (
            <>
              <Typography sx={style.regimenText}>To</Typography>
              <Stack direction="row" justifyContent="space-between">
                <Stack>
                  <Typography sx={style.typeFieldLabel}>
                    Regimen Category
                  </Typography>
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    sx={style.autocomplete}
                    id="tags-outlined"
                    options={regimenCategoryList}
                    getOptionLabel={(option) => option}
                    name="toRegimen"
                    value={progressionData.toRegimen}
                    onChange={(event, newValue) =>
                      handleFromRegimenChange(event, newValue, "to")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Enter your Values"
                        size="small"
                        //   sx={style.typeFields}
                      />
                    )}
                  />
                </Stack>
                <Stack>
                  <Typography sx={style.typeFieldLabel}>Lot</Typography>
                  <Autocomplete
                    sx={style.autocomplete}
                    id="tags-outlined"
                    options={segmentationData.LotList}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    value={progressionData.toLot}
                    onChange={(event, newValue) =>
                      handleLotChange(event, newValue, "toLot")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Enter your Values"
                        size="small"
                        // sx={style.typeFields}
                      />
                    )}
                  />
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
        <Stack className="time-frame-box" direction="row" alignItems="flex-end">
          <Stack>
            <Typography sx={style.typeFieldLabel}>Time frame</Typography>
            <TextField
              id="outlined-select-database"
              sx={style.selectFields}
              select
              name="timeFrame"
              size="small"
              onChange={handleChange}
              value={progressionData.timeFrame}
            >
              {TimeFrameDropDown.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            sx={{ background: "#f2f2f2", width: "14.8vw" }}
            id="outlined-textarea"
            placeholder="Days"
            size="small"
            name="timeFrameValue"
            value={progressionData.timeFrameValue}
            onChange={handleTimeFrame}
            disabled={progressionData.timeFrame === "NA"}
          />
          <Stack className="lot-decision-add-new-rules">
            <Typography sx={style.typeFieldLabel}>Lot Decision</Typography>
            <Autocomplete
              id="tags-outlined"
              sx={style.autocomplete}
              options={
                progressionData.ruleSelected === "regimen"
                  ? lotDecisionForRegimen
                  : lotDecisionForMetastaticSurgery
              }
              getOptionLabel={(option) => option}
              filterSelectedOptions
              value={progressionData.lotDecision}
              onChange={(event, newValue) =>
                handleLotChange(event, newValue, "lotDecision")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter your Values"
                  size="small"
                  //   sx={style.typeFields}
                />
              )}
            />
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="center">
          <Button
            variant="contained"
            sx={style.cancleBtn}
            onClick={close}
          >
            Close
          </Button>
          {updateProgressionRuleData.ruleName ? (
            <Button
              variant="contained"
              sx={style.addProductBtn}
              onClick={handleUpdateSubmit}
            >
              Update Rule
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={style.addProductBtn}
              onClick={handleSubmit}
            >
              Add New Rule
            </Button>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddNewRulesDialogBox;
