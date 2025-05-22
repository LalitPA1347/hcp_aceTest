import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  segmentationDataAtom,
  createdRegimenRulesAtom,
  createdProgressionRulesAtom,
  createdProgressionDataAtom,
  segmentationIndicationValue,
  regimenListAtom,
  segmentListAtom,
  matRuleListAtom,
  progressionDaysAtom,
} from "../../../atom";
import { useAtom } from "jotai";
import { segmentationProcessApi, SegmentationDataApi } from "../../../services";
import { toast } from "react-toastify";
import "./SegmentationIndication.css";
import { useDispatch } from "react-redux";
import { setAllRegCat,SetAllSegCat } from "../../../redux/indicationDropdownSlice";

const style = {
  selectFields: {
    mt: "10px",
    mr: "35px",
    width: "25vw",
    background: "#f2f2f2",
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      height: "6.5vh",
      "& fieldset": {
        border: "1px solid #d8d8d8",
      },
    },
    "&:hover": {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "1px solid #d8d8d8",
        },
      },
    },
    "& .MuiSelect-select": {
      fontSize: "15px",
      fontWeight: "400",
      fontFamily: "Inter, sans-serif",
    },
  },
  processBtn: {
    background: "#002060",
    textTransform: "capitalize",
    width: "150px",
    height: "6.2vh",
    marginRight: "10px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#002060",
    },
  },
  dropDown: {
    fontSize: "15px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
  },
  indicationText: {
    fontSize: "14px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
  },
};

const SegmentationIndication = () => {
  const [segmentationData, setSegmentationData] = useAtom(segmentationDataAtom);
  const [createdRegimenRules, setCreatedRegimenRules] = useAtom(
    createdRegimenRulesAtom
  );
  const [createdProgressionRules, setCreatedProgressionRules] = useAtom(
    createdProgressionRulesAtom
  );
  const [progressionData, setProgressionData] = useAtom(
    createdProgressionDataAtom
  );
  const [dropDownValue, setDropDropValue] = useAtom(
    segmentationIndicationValue
  );
  const [regimenList, setRegimenList] = useAtom(regimenListAtom);
  const [segmentList, setSegmentList] = useAtom(segmentListAtom);
  const [matRuleList, setMatRuleList] = useAtom(matRuleListAtom);
  const [progressionDays, setProgressionDays] = useAtom(progressionDaysAtom);
  const [showLoader, setShowLoader] = useState(false);
  const [processBtn, setProcessBtn] = useState(false);
  const dispatch = useDispatch();
  const handleSegmentationData = async (indicationValue, versionValue) => {
    const payload = {
      Indication: indicationValue,
      Version: versionValue,
    };
    setShowLoader(true);
    const response = await SegmentationDataApi(payload);
    console.log("segmentaiton", response);
    if (response?.data?.msg) {
      toast.warning(response?.data?.msg);
      setShowLoader(false);
      setProcessBtn(true);
      return;
    }
    if (response && response?.data && response.status === 200) {
      const versionList = response?.data?.Indication_version.find(
        (item) => item.name === response?.data?.selected_values[0]?.indication
      );
      setSegmentationData({
        indicationVersion: response?.data?.Indication_version,
        indication: response?.data?.indication,
        product: response?.data?.product,
        version: versionList.versions,
        selectedValues: response?.data?.selected_values,
        RegimenCategoryRuleList: response?.data?.Regimen_category_rule_list,
        SegmentCategoryRuleList: response?.data?.Segment_rule_list,
        MetRuleList: response?.data?.Met_Rule_List,
        RegimenCategoryList: response?.data?.Regimen_category_list,
        LotList: response?.data?.LOT_List,
        LOT: response?.data?.LOT,
        // LOT:{a_to_a_lot: 120, a_to_b_lot: 28, a_to_a_status: true },
      });
      dispatch(setAllRegCat(response?.data?.All_Reg_Cat_rules_list));
      dispatch(SetAllSegCat(response?.data?.All_Segment_list));
      setProgressionDays({
        AtoA: response?.data?.LOT?.a_to_a_lot,
        AtoB: response?.data?.LOT?.a_to_b_lot,
      });

      setDropDropValue({
        indication: response?.data?.selected_values[0]?.indication,
        version: response?.data?.selected_values[0]?.version,
      });

      setRegimenList(response?.data?.Regimen_category_rule_list);
      setSegmentList(response?.data?.Segment_rule_list);
      setMatRuleList(response?.data?.Met_Rule_List);
      setShowLoader(false);
    } else {
      console.log("error", response);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (dropDownValue.indication === "") {
      handleSegmentationData(dropDownValue.indication, dropDownValue.version);
      return;
    }
  }, []);

  useEffect(() => {
    if (regimenList.length === 0) {
      setProcessBtn(true);
      return;
    }
    setProcessBtn(false);
  }, [regimenList]);

  const databasesMenu = segmentationData?.indication.map((values) => {
    return { value: values, label: values };
  });
  const version = segmentationData?.version.map((values) => {
    return { value: values, label: values };
  });

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === "indication") {
      const versionList = segmentationData.indicationVersion.find(
        (item) => item.name === e.target.value
      );
      handleSegmentationData(e.target.value, versionList.versions[0]);
      return;
    }
    if (e.target.name === "version") {
      handleSegmentationData(dropDownValue.indication, e.target.value);
      return;
    }
  };

  // Function to compare both arrays
  const compareArrays = (arr1, arr2) => {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
  };

  const handleProcess = async () => {
    const payload = {
      Indication: segmentationData.selectedValues[0].indication,
      Version: segmentationData.selectedValues[0].version,
      Regmin_Category: {
        // Added: createdRegimenRules.added,
        // Deleted: createdRegimenRules.deleted,
        updated: compareArrays(
          regimenList,
          segmentationData.RegimenCategoryRuleList
        )
          ? []
          : regimenList,
      },
      Segment_Category: {
        updated: compareArrays(
          segmentList,
          segmentationData.SegmentCategoryRuleList
        )
          ? []
          : segmentList,
      },
      a_to_a_progression: progressionDays.AtoA,
      a_to_b_progression: progressionDays.AtoB,
      progression_rules: {
        Added: createdProgressionRules.added,
        Deleted: createdProgressionRules.deleted,
      },
      Data: progressionData,
      a_to_a_status: segmentationData.LOT?.a_to_a_status,
    };

    try {
      toast.info(
        "Data is being processed and you will be notified by mail once it's done."
      );
      const response = await segmentationProcessApi(payload);
      if (response?.status === "200") {
        console.log("response", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="segmentation-indication-model">
      <div className="segmentation-indication-box">
        <Stack direction="row">
          <Stack>
            <Typography variant="h5" sx={style.indicationText}>
              Choose your Indication
            </Typography>
            <TextField
              id="outlined-select-database"
              sx={style.selectFields}
              select
              name="indication"
              value={dropDownValue.indication}
              onChange={handleChange}
            >
              {databasesMenu.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={style.dropDown}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack>
            <Typography variant="h5" sx={style.indicationText}>
              Choose the version
            </Typography>
            <TextField
              id="outlined-select-database"
              sx={style.selectFields}
              select
              name="version"
              value={dropDownValue.version}
              onChange={handleChange}
            >
              {version.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={style.dropDown}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          sx={style.processBtn}
          onClick={handleProcess}
          disabled={processBtn}
        >
          Start Process
        </Button>
      </div>
      <Backdrop sx={{ zIndex: 10 }} open={showLoader}>
        <CircularProgress sx={{ color: "black" }} />
      </Backdrop>
    </div>
  );
};

export default SegmentationIndication;
