import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./Segmentation.css";
import SegmentationIndication from "./SegmentationIndication/SegmentationIndication";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAtom } from "jotai";
import {
  segmentationDataAtom,
  createdRegimenRulesAtom,
  createdProgressionRulesAtom,
  createdSegmentRulesAtom,
  createdProgressionDataAtom,
  regimenListAtom,
  matRuleListAtom,
  segmentListAtom,
  progressionDaysAtom,
} from "../../atom";
import Validation from "../../validation/Validation";
import { UpdateProgressionRuleApi } from "../../services/segmentation";
import { toast } from "react-toastify";
import AddNewRulesDialogBox from "./AddNewRulesDialogBox/AddNewRulesDialogBox";
import ImportDialog from "./ImportDialog";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RegimenCategory from "./RegimenCategory";
import ProgressionRules from "./ProgressionRules";
import SegmentationHeader from "./SegmentationHeader";
import CommonAddDialogSegment from "./CommonAddDialogSegment";
const style = {
  typeFields: {
    width: "38vw",
    backgroundColor: "#f2f2f2",
    marginTop: "2px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      "& fieldset": {
        border: "1px solid #d8d8d8",
        Padding: "0px",
      },
    },
    "&:hover": {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "1px solid #d8d8d8",
        },
      },
    },
  },
  conditionTextFields: {
    width: "7vw",
    backgroundColor: "#f2f2f2",
    marginTop: "10px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
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
  },
  rulesTypeFields: {
    width: "40vw",
    backgroundColor: "#f2f2f2",
    marginTop: "8px",
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
  },
  checkbox: {
    padding: 0,
    marginTop: "5px",
  },
};

const databasesMenu = [{ value: "AND", label: "AND" }];

const Segmentation = () => {
  const [addNewRulesPopup, setAddNewRulesPopup] = useState(false);
  const [segmentationData, setSegmentationData] = useAtom(segmentationDataAtom);
  const [createdRegimenRules, setCreatedRegimenRules] = useAtom(
    createdRegimenRulesAtom
  );
  const [createdSegmentRules, setCreatedSegmentRules] = useAtom(
    createdSegmentRulesAtom
  );
  const [progressionData, setProgressionData] = useAtom(
    createdProgressionDataAtom
  );
  const [createdProgressionRules, setCreatedProgressionRules] = useAtom(
    createdProgressionRulesAtom
  );
  const [progressionDays, setProgressionDays] = useAtom(progressionDaysAtom);
  const [regimenList, setRegimenList] = useAtom(regimenListAtom);
  const [segmentList, setSegmentList] = useAtom(segmentListAtom);

  const [matRuleList, setMatRuleList] = useAtom(matRuleListAtom);
  const [productList, setProductList] = useState([]);
  const [firstRegimenList, setFirstRegimenList] = useState([]);
  const [firstSegmentList, setFirstSegmentList] = useState([]);
  const [regimenCategory, setRegimenCategory] = useState("");
  const [segmentCategory, setSegmentCategory] = useState("");
  const [numberOfCodition, setNumberOfCodition] = useState(0);
  const [numberOfCoditionSegment, setNumberOfCoditionSegment] = useState(0);
  const [conditions, setConditions] = useState([]);
  const [conditionsSegment, setConditionsSegment] = useState([]);
  const [error, setError] = useState({});
  const [segmentError, setSegmentError] = useState({});
  const [isImportDialogSegmentOpen, setIsImportDialogSegmentOpen] =
    useState(false);
  const [updateProgressionRuleData, setUpdateProgressionRuleData] = useState(
    {}
  );
  const [editRegimen, setEditRegimen] = useState();
  const [timeFrame, setTimeFrame] = useState(""); //
  const [lot, setLot] = useState(""); //
  const [editSegment, setEditSegment] = useState();

  const [expand, setExpand] = useState({
    regimenCategory: false,
    progressionRules: false,
    setSegmentCategory: false,
  });

  const [openImportDialog, setOpenImportDialog] = useState(false);

  const handleOpenImportDialog = () => {
    setOpenImportDialog(true);
  };

  const handleCloseImportDialog = () => {
    setOpenImportDialog(false);
  };

  const handleOpenImportDialogSegment = () => {
    setIsImportDialogSegmentOpen(true);
  };
  const handleCloseImportDialogSegment = () => {
    setIsImportDialogSegmentOpen(false);
  };
  const [importedSegmentList, setImportedSegmentList] =
    useAtom(segmentListAtom);

  // Your handleAddSegment function (from the previous example)
  const handleAddSegment = (selectedSegments) => {
    let hasDuplicates = false;
    let duplicateSegmentNames = [];

    setSegmentList((prevList) => {
      const duplicateSegments = selectedSegments.filter((segment) => {
        const isDuplicate = prevList.some((item) => item === segment);
        if (isDuplicate) {
          duplicateSegmentNames.push(segment);
        }
        return isDuplicate;
      });

      if (duplicateSegments.length > 0) {
        hasDuplicates = true;
        const uniqueDuplicates = [...new Set(duplicateSegmentNames)];
        toast.error(
          `The following Segments are already in the selected list: ${uniqueDuplicates.join(
            ", "
          )}`
        );
        return prevList;
      }

      return [...prevList, ...selectedSegments];
    });

    if (!hasDuplicates) {
      handleCloseImportDialogSegment();
    }
  };

  const handleAddProduct = (selectedProducts) => {
    let hasDuplicates = false; // Flag to track if any duplicates were found
    let duplicateProductNames = []; // Array to store names of duplicate products

    setRegimenList((prevList) => {
      const duplicateProducts = selectedProducts.filter((product) => {
        const isDuplicate = prevList.some((item) => item === product); // Adjust comparison logic if necessary
        if (isDuplicate) {
          duplicateProductNames.push(product); // Add the duplicate product name to the array
        }
        return isDuplicate;
      });

      if (duplicateProducts.length > 0) {
        hasDuplicates = true; // Set flag to true if duplicates were found

        // Show a toast message for duplicate products with specific names
        const uniqueDuplicates = [...new Set(duplicateProductNames)]; // Get unique duplicate names
        toast.error(
          `The following Regimen Category are already in the selected list : ${uniqueDuplicates.join(
            ", "
          )}`
        );
        return prevList; // Return the unchanged list to prevent adding duplicates
      }

      // If no duplicates, add selected products to the list
      return [...prevList, ...selectedProducts];
    });

    // Only set added products and close dialog if no duplicates were found
    if (!hasDuplicates) {
      handleCloseImportDialog(); // Close the dialog only if no duplicates
    }
  };

  useEffect(() => {
    setProductList(segmentationData.product);
  }, [segmentationData]);

  useEffect(() => {
    let filteredProduct = segmentationData.product.filter(
      (item) => !firstRegimenList.includes(item)
    );

    if (conditions.length !== 0) {
      conditions.forEach((item) => {
        const { selectedProducts } = item;
        selectedProducts.forEach((product) => {
          filteredProduct = filteredProduct.filter((p) => p !== product);
          setProductList(filteredProduct);
          return;
        });
      });
    }
    setProductList(filteredProduct);
  }, [firstRegimenList, conditions]);

  useEffect(() => {
    let filteredProduct = segmentationData.product.filter(
      (item) => !firstSegmentList.includes(item)
    );

    if (conditionsSegment.length !== 0) {
      conditionsSegment.forEach((item) => {
        const { selectedProducts } = item;
        selectedProducts.forEach((product) => {
          filteredProduct = filteredProduct.filter((p) => p !== product);
          setProductList(filteredProduct);
          return;
        });
      });
    }
    setProductList(filteredProduct);
  }, [firstSegmentList, conditionsSegment]);

  useEffect(() => {
    // console.log("first", createdProgressionRules)
    const updatedProgressionRules = [
      ...createdProgressionRules.added,
      ...segmentationData.MetRuleList,
    ].filter(
      (obj) =>
        !createdProgressionRules.deleted.some(
          (removeObj) =>
            obj.Rule_Name === removeObj.Rule_Name &&
            obj.Rule_desc === removeObj.Rule_desc
        )
    );
    setMatRuleList(updatedProgressionRules);
  }, [createdProgressionRules]);

  const handleDaysChange = (event) => {
    const value = event.target.value;
    // Ensure that only numeric values are allowed
    if (/^\d*$/.test(value)) {
      if (value >= 0 && value <= 999) {
        setProgressionDays((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
      }
    }
  };

  const handleAddCondition = () => {
    setNumberOfCodition(numberOfCodition + 1);
    setConditions((prevConditions) => [
      ...prevConditions,
      { logicalOperator: "AND", selectedProducts: [] },
    ]);
  };
  const handleAddConditionSegment = () => {
    setNumberOfCoditionSegment(numberOfCoditionSegment + 1);
    setConditionsSegment((prevConditions) => [
      ...prevConditions,
      { logicalOperator: "AND", selectedProducts: [] },
    ]);
  };

  const handleLogicalOperatorChange = (index, newValue) => {
    setConditions((prevConditions) => {
      const newConditions = [...prevConditions];
      newConditions[index].logicalOperator = newValue;
      return newConditions;
    });
  };
  const handleLogicalOperatorChangeSegment = (index, newValue) => {
    setConditionsSegment((prevConditions) => {
      const newConditions = [...prevConditions];
      newConditions[index].logicalOperator = newValue;
      return newConditions;
    });
  };

  const handleAutocompleteChange = (index, newValue) => {
    setConditions((prevConditions) => {
      const newConditions = [...prevConditions];
      newConditions[index].selectedProducts = newValue;
      return newConditions;
    });
  };
  const handleAutocompleteChangeSegment = (index, newValue) => {
    setConditionsSegment((prevConditions) => {
      const newConditions = [...prevConditions];
      newConditions[index].selectedProducts = newValue;
      return newConditions;
    });
  };
  const handleRemoveCondition = () => {
    if (numberOfCodition > 0) {
      setNumberOfCodition((prevCount) => prevCount - 1);
      setConditions((prevConditions) => prevConditions.slice(0, -1));
    }
  };
  const handleRemoveConditionSegment = () => {
    if (numberOfCoditionSegment > 0) {
      setNumberOfCoditionSegment((prevCount) => prevCount - 1);
      setConditionsSegment((prevConditions) => prevConditions.slice(0, -1));
    }
  };
  const generateQuery = () => {
    const savedRegimenCategory = regimenList.map((item) =>
      item.split("THEN")[1].trim().replace(/'/g, "")
    );
    if (
      savedRegimenCategory.some(
        (item) => item.toLowerCase() === regimenCategory.toLowerCase()
      )
    ) {
      toast.error("Regimen Category already exist", {
        autoClose: 1000,
      });
      return;
    }
    if (
      regimenCategory.length === 0 ||
      firstRegimenList.length === 0 ||
      conditions.some((condition) => !condition.selectedProducts.length)
    ) {
      const data = {
        firstRegimenList: firstRegimenList,
        regimenCategory: regimenCategory,
        conditions: conditions,
      };
      const newError = Validation(data);
      if (newError) {
        setError(newError);
      }
      console.log(error);

      return;
    }
    let query = conditions
      .map((item) => {
        let operator = item.logicalOperator === "OR" ? "OR" : "AND";
        let products = item.selectedProducts
          .map((product) => `${product}`)
          .join(", ");
        return `${operator} REGIMEN in (${products})`;
      })
      .join(" ");
    query = `REGIMEN in (${firstRegimenList}) ${query} THEN '${regimenCategory}'`;
    setCreatedRegimenRules((prev) => ({
      ...prev,
      added: [...prev.added, query],
    }));
    if (editRegimen) {
      const editedRegimen = regimenList;
      editedRegimen.splice(editRegimen, 0, query);
      setRegimenList(editedRegimen);
      setEditRegimen();
    } else {
      setRegimenList([query, ...regimenList]);
    }
    setFirstRegimenList([]);
    setRegimenCategory("");
    setNumberOfCodition(0);
    setConditions([]);
    setError({});
  };
  const generateQuerySegment = () => {
    const savedRegimenCategory = segmentList.map((item) =>
      item.split("THEN")[1].trim().replace(/'/g, "")
    );
    if (
      savedRegimenCategory.some(
        (item) => item.toLowerCase() === segmentCategory.toLowerCase()
      )
    ) {
      toast.error("Segment Category already exist", {
        autoClose: 1000,
      });
      return;
    }
    if (
      segmentCategory.length === 0 ||
      firstSegmentList.length === 0 ||
      conditionsSegment.some((condition) => !condition.selectedProducts.length)
    ) {
      const data = {
        firstSegmentList: firstSegmentList,
        segmentCategory: segmentCategory,
        conditionsSegment: conditionsSegment,
      };
      const newError = Validation(data);
      if (newError) {
        setSegmentError(newError);
      }
      console.log(segmentError);

      return;
    }
    let query = conditionsSegment
      .map((item) => {
        let operator = item.logicalOperator === "OR" ? "OR" : "AND";
        let products = item.selectedProducts
          .map((product) => `${product}`)
          .join(", ");
        return `${operator} REGIMEN in (${products})`;
      })
      .join(" ");
    query = `REGIMEN in (${firstSegmentList}) ${query} ${
      timeFrame && timeFrame !== "NA" ? `AND LOT ${timeFrame} ${lot}` : ""
    } THEN '${segmentCategory}'`;
    setCreatedSegmentRules((prev) => ({
      ...prev,
      added: [...prev.added, query],
    }));
    if (editSegment) {
      const editedSegment = segmentList;
      editedSegment.splice(editSegment, 0, query);
      setSegmentList(editedSegment);
      setEditSegment();
    } else {
      setSegmentList([query, ...segmentList]);
    }
    setFirstSegmentList([]);
    setSegmentCategory("");
    setNumberOfCoditionSegment(0);
    setConditionsSegment([]);
    setTimeFrame("");
    setLot("");
    setSegmentError({});
  };

  const handleDeleteRegimanRule = (rule) => {
    if (createdRegimenRules.added.some((item) => item === rule)) {
      const sortAddedArr = createdRegimenRules.added.filter(
        (item) => item !== rule
      );
      setCreatedRegimenRules((prev) => ({
        ...prev,
        added: [...sortAddedArr],
      }));
    } else {
      setCreatedRegimenRules((prev) => ({
        ...prev,
        deleted: [...prev.deleted, rule],
      }));
    }

    const sortedRegimenList = regimenList.filter((item) => item !== rule);

    setRegimenList(sortedRegimenList);
  };

  const handleDeleteSegment = (segment) => {
    // Check if the segment exists in the added list of createdRegimenRules
    if (createdSegmentRules.added.includes(segment)) {
      // Remove the segment from the added list
      const updatedAddedSegments = createdSegmentRules.added.filter(
        (item) => item !== segment
      );
      setCreatedSegmentRules((prev) => ({
        ...prev,
        added: updatedAddedSegments,
      }));
    } else {
      // If the segment is not in the added list, add it to the deleted list
      setCreatedSegmentRules((prev) => ({
        ...prev,
        deleted: [...prev.deleted, segment],
      }));
    }

    // Filter out the segment from the regimenList
    const updatedRegimenList = segmentList.filter((item) => item !== segment);
    setSegmentList(updatedRegimenList);
  };

  const handleDeleteProgressionRules = (deletedRule) => {
    if (
      createdProgressionRules.added.some(
        (rule) =>
          rule.Rule_Name === deletedRule.Rule_Name &&
          rule.Rule_desc === deletedRule.Rule_desc
      )
    ) {
      const addedProgressionData = progressionData.filter(
        (rule) => rule.ruleName !== deletedRule.Rule_Name
      );
      const updatedProgressionRules = createdProgressionRules.added.filter(
        (rule) =>
          rule.Rule_Name !== deletedRule.Rule_Name ||
          rule.Rule_desc !== deletedRule.Rule_desc
      );

      setCreatedProgressionRules((prev) => ({
        ...prev,
        added: updatedProgressionRules,
      }));

      setProgressionData(addedProgressionData);

      return;
    }

    setCreatedProgressionRules((prev) => ({
      ...prev,
      deleted: [...prev.deleted, deletedRule],
    }));
  };

  const handleUpdateProgressionRuleApi = async (payload) => {
    try {
      const response = await UpdateProgressionRuleApi(payload);

      setUpdateProgressionRuleData({
        ruleName: response.data.met_rule_name,
        ruleSelected: response.data.reg_selected_type,
        fromRegimen: response.data.from_regimen,
        fromLot: response.data.from_lot,
        toRegimen: response.data.to_regimen,
        toLot: response.data.to_lot,
        timeFrame: response.data.time_frame,
        timeFrameValue: response.data.time_frame_value,
        lotDecision: response.data.lot_decision,
        RuleDesc: response.data.met_rule_desc,
      });
      setAddNewRulesPopup(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateProgressionRule = (RuleName, RuleDesc) => {
    if (
      createdProgressionRules.added.some(
        (rule) => rule.Rule_Name === RuleName && rule.Rule_desc === RuleDesc
      )
    ) {
      const result = progressionData.find((rule) => rule.ruleName === RuleName);
      setUpdateProgressionRuleData({
        ruleName: result.ruleName,
        ruleSelected: result.ruleSelected,
        fromRegimen: result.fromRegimen,
        fromLot: result.fromLot,
        toRegimen: result.toRegimen,
        toLot: result.toLot,
        timeFrame: result.timeFrame,
        timeFrameValue: result.timeFrameValue,
        lotDecision: result.lotDecision,
        RuleDesc: RuleDesc,
      });
      setAddNewRulesPopup(true);
      return;
    }

    const payload = {
      Indication: segmentationData.selectedValues[0].indication,
      Version: segmentationData.selectedValues[0].version,
      rule_name: RuleName,
    };
    handleUpdateProgressionRuleApi(payload);
  };

  const moveRegimenItem = (index, direction) => {
    const newList = [...regimenList];

    if (direction === "up" && index > 0) {
      [newList[index], newList[index - 1]] = [
        newList[index - 1],
        newList[index],
      ];
    } else if (direction === "down" && index < newList.length - 1) {
      [newList[index], newList[index + 1]] = [
        newList[index + 1],
        newList[index],
      ];
    }

    setRegimenList(newList);
  };
  const moveRegimenItemSegment = (index, direction) => {
    const newList = [...segmentList];

    if (direction === "up" && index > 0) {
      [newList[index], newList[index - 1]] = [
        newList[index - 1],
        newList[index],
      ];
    } else if (direction === "down" && index < newList.length - 1) {
      [newList[index], newList[index + 1]] = [
        newList[index + 1],
        newList[index],
      ];
    }

    setSegmentList(newList);
  };
  const moveProgressionItem = (index, direction) => {
    // const updatedList = [...matRuleList];
    const newList = [...matRuleList];

    if (direction === "up" && index > 0) {
      // Swap the item with the one above it
      [newList[index], newList[index - 1]] = [
        newList[index - 1],
        newList[index],
      ];
    } else if (direction === "down" && index < newList.length - 1) {
      // Swap the item with the one below it
      [newList[index], newList[index + 1]] = [
        newList[index + 1],
        newList[index],
      ];
    }
    setMatRuleList(newList);
  };

  const handleAddNewRulesPopup = () => {
    setAddNewRulesPopup(false);
    setUpdateProgressionRuleData({});
  };

  const handleCheckBox = () => {
    setSegmentationData((prevData) => ({
      ...prevData,
      LOT: {
        ...prevData.LOT,
        a_to_a_status: !prevData.LOT.a_to_a_status,
      },
    }));
  };

  const handleEditRegimen = (value) => {
    const [initial, thenPart] = regimenList[value].split(" THEN ");

    // Extract regimen values before the first "And" and split by comma
    const regimen = (initial.match(/\(([^)]+)\)/)?.[1] || "")
      .split(",")
      .map((item) => item.trim());

    // Create conditionRegimen by starting from the first "And" clause
    const conditionRegimen = initial
      .split(" AND ")
      .slice(1) // Skip the first selectedProducts in "regimen"
      .map((part) => {
        const products = part
          .match(/\(([^)]+)\)/)[1]
          .split(",")
          .map((item) => item.trim());
        return {
          logicalOperator: "AND",
          selectedProducts: products,
        };
      });
    console.log(conditionRegimen);

    // Extract regimenCategory (word after THEN)
    const regimenCategory = thenPart?.trim().replace(/'/g, "");

    setNumberOfCodition(conditionRegimen.length);
    setFirstRegimenList(regimen);
    setRegimenCategory(regimenCategory);
    setConditions(conditionRegimen);
    setEditRegimen(value);
    handleDeleteRegimanRule(regimenList[value]);
  };

  const getRelationalCondition = (part) => {
    const operatorMatch = part.match(/(>=|<=|>|<|=)/);
    if (operatorMatch) {
      const [left, right] = part
        .split(operatorMatch[0])
        .map((str) => str.trim());
      return {
        logicalOperator: "AND",
        condition: left, // e.g., "LOT"
        operator: operatorMatch[0], // e.g., ">="
        value: right, // e.g., "2"
      };
    }
    return null;
  };

  const handleEditSegment = (value) => {
    const [initial, thenPart] = segmentList[value].split(" THEN ");

    // Extract regimen values before the first "And" and split by comma
    const regimen = (initial.match(/\(([^)]+)\)/)?.[1] || "")
      .split(",")
      .map((item) => item.trim());

    const conditionRegimen = [];
    const relationalConditions = [];

    // Create conditionRegimen by starting from the first "And" clause
    initial
      .split(" AND ")
      .slice(1) // Skip the first selectedProducts in "regimen"
      .forEach((part) => {
        if (part.includes("REGIMEN")) {
          const products = part
            .match(/\(([^)]+)\)/)[1]
            .split(",")
            .map((item) => item.trim());
          conditionRegimen.push({
            logicalOperator: "AND",
            selectedProducts: products,
          });
        } else {
          // Store relational conditions separately
          const relationalCondition = getRelationalCondition(part);
          if (relationalCondition) {
            relationalConditions.push(relationalCondition);
          } else {
            conditionRegimen.push(part); // Store non-relational conditions in conditionRegimen
          }
        }
      });

    // Extract regimenCategory (word after THEN)
    const regimenCategory = thenPart?.trim().replace(/'/g, "");

    setNumberOfCoditionSegment(conditionRegimen.length);
    setFirstSegmentList(regimen);
    setSegmentCategory(regimenCategory);
    setConditionsSegment(conditionRegimen);
    setTimeFrame(relationalConditions[0]?.operator);
    setLot(relationalConditions[0]?.value);
    setEditSegment(value);
    handleDeleteSegment(segmentList[value]);
  };

  return (
    <>
      <Header />
      <SegmentationIndication />
      <div className="segmentation-model">
        <div className="segmentation-model-line">
          {/* Regimen Category Section */}
          <div>
            <div className="segmentation-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <h4
                  style={{ margin: 0, width: "100%" }}
                  onClick={() => {
                    setExpand((prevState) => ({
                      regimenCategory: !prevState.regimenCategory,
                      progressionRules: false,
                      segmentation: false, // collapse other sections when this is clicked
                    }));
                  }}
                >
                  {`Define Regimen Category `}
                  {expand.regimenCategory && (
                    <span style={{ fontSize: "12px" }}>
                      (For non-selected products, the regimen category will be
                      "Others")
                    </span>
                  )}
                </h4>

                <div style={{ display: "flex", alignItems: "center" }}>
                  {expand?.regimenCategory && (
                    <Tooltip title="Import" arrow>
                      <IconButton onClick={handleOpenImportDialog}>
                        <AddCircleOutlineIcon
                          sx={{ fontSize: "22px", color: "#002060" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}

                  {expand?.regimenCategory ? (
                    <KeyboardArrowUpIcon
                      sx={{ fontSize: "28px" }}
                      onClick={() => {
                        setExpand((prevState) => ({
                          regimenCategory: !prevState.regimenCategory,
                          progressionRules: false,
                          segmentation: false, // collapse other sections when this is clicked
                        }));
                      }}
                    />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ fontSize: "28px" }}
                      onClick={() => {
                        setExpand((prevState) => ({
                          regimenCategory: !prevState.regimenCategory,
                          progressionRules: false,
                          segmentation: false, // collapse other sections when this is clicked
                        }));
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <RegimenCategory
              expand={expand}
              productList={productList}
              firstRegimenList={firstRegimenList}
              setFirstRegimenList={setFirstRegimenList}
              error={error}
              numberOfCodition={numberOfCodition}
              databasesMenu={databasesMenu}
              conditions={conditions}
              handleLogicalOperatorChange={handleLogicalOperatorChange}
              handleAutocompleteChange={handleAutocompleteChange}
              handleAddCondition={handleAddCondition}
              handleRemoveCondition={handleRemoveCondition}
              regimenCategory={regimenCategory}
              setRegimenCategory={setRegimenCategory}
              generateQuery={generateQuery}
              importedRegimenList={regimenList}
              moveRegimenItem={moveRegimenItem}
              handleDeleteRegimanRule={handleDeleteRegimanRule}
              handleEdit={handleEditRegimen}
              style={style}
            />
          </div>

          {/* Progression Rules Section */}
          <div
            className="segmentation-header"
            onClick={() => {
              setExpand((prevState) => ({
                regimenCategory: false,
                progressionRules: !prevState.progressionRules,
                segmentation: false, // collapse other sections when this is clicked
              }));
            }}
          >
            <h4>Progression Rules</h4>
            {!expand?.progressionRules && (
              <KeyboardArrowDownIcon sx={{ fontSize: "28px" }} />
            )}
            {expand?.progressionRules && (
              <KeyboardArrowUpIcon sx={{ fontSize: "28px" }} />
            )}
          </div>
          <ProgressionRules
            expand={expand.progressionRules}
            segmentationData={segmentationData}
            style={style}
            progressionDays={progressionDays}
            matRuleList={matRuleList}
            handleCheckBox={handleCheckBox}
            handleDaysChange={handleDaysChange}
            moveProgressionItem={moveProgressionItem}
            handleDeleteProgressionRules={handleDeleteProgressionRules}
            handleUpdateProgressionRule={handleUpdateProgressionRule}
            setAddNewRulesPopup={setAddNewRulesPopup}
          />

          {/* Segmentation Header Section */}
          <div className="segmentation-header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h4
                style={{ margin: 0, width: "100%" }}
                onClick={() => {
                  setExpand((prevState) => ({
                    regimenCategory: false,
                    progressionRules: false,
                    segmentation: !prevState.segmentation, // toggle this section
                  }));
                }}
              >
                Segmentation
              </h4>

              <div style={{ display: "flex", alignItems: "center" }}>
                {expand?.segmentation && (
                  <Tooltip title="Import" arrow>
                    <IconButton onClick={handleOpenImportDialogSegment}>
                      <AddCircleOutlineIcon
                        sx={{ fontSize: "22px", color: "#002060" }}
                      />
                    </IconButton>
                  </Tooltip>
                )}

                {expand?.segmentation ? (
                  <KeyboardArrowUpIcon
                    sx={{ fontSize: "28px" }}
                    onClick={() => {
                      setExpand((prevState) => ({
                        regimenCategory: false,
                        progressionRules: false,
                        segmentation: !prevState.segmentation, // toggle this section
                      }));
                    }}
                  />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ fontSize: "28px" }}
                    onClick={() => {
                      setExpand((prevState) => ({
                        regimenCategory: false,
                        progressionRules: false,
                        segmentation: !prevState.segmentation, // toggle this section
                      }));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <SegmentationHeader
            expand={expand.segmentation}
            productList={productList}
            firstRegimenList={firstSegmentList}
            setFirstRegimenList={setFirstSegmentList}
            segmentError={segmentError}
            numberOfCodition={numberOfCoditionSegment}
            databasesMenu={databasesMenu}
            conditions={conditionsSegment}
            handleLogicalOperatorChange={handleLogicalOperatorChangeSegment}
            handleAutocompleteChange={handleAutocompleteChangeSegment}
            handleAddCondition={handleAddConditionSegment}
            handleRemoveCondition={handleRemoveConditionSegment}
            regimenCategory={segmentCategory}
            setRegimenCategory={setSegmentCategory}
            generateQuery={generateQuerySegment}
            importedRegimenList={segmentList}
            moveRegimenItem={moveRegimenItemSegment}
            handleDeleteRegimanRule={handleDeleteSegment}
            style={style}
            setTimeFrame={setTimeFrame}
            setLot={setLot}
            timeFrame={timeFrame}
            lot={lot}
            handleEdit={handleEditSegment}
          />
        </div>
      </div>
      {addNewRulesPopup && (
        <AddNewRulesDialogBox
          open={addNewRulesPopup}
          close={handleAddNewRulesPopup}
          regimenList={regimenList}
          matRuleList={matRuleList}
          updateProgressionRuleData={updateProgressionRuleData}
        />
      )}
      <ImportDialog
        open={openImportDialog}
        close={handleCloseImportDialog}
        addProduct={handleAddProduct}
      />
      <CommonAddDialogSegment
        open={isImportDialogSegmentOpen}
        close={handleCloseImportDialogSegment}
        addProduct={handleAddSegment}
      />
    </>
  );
};

export default Segmentation;
