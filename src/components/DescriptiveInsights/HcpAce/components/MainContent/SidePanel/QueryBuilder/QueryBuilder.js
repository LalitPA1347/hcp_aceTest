/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Stack,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import SingleSelectDropdown from "../../../../../../Common/DropDown/SingleSelectDropdown";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import AdhocsSingleSelectDropdown from "../../../../../../Common/DropDown/AdhocsSingleSelectDropdown";
import AdhocsMultiSelectDropdown from "../../../../../../Common/DropDown/AdhocsMultiSelectDropdown";
import { useDispatch, useSelector } from "react-redux";
// import { setOpenAdhocs } from "../../../redux/AdhocsSlice";
import CloseIcon from "../../../../../../../assets/images/CloseIcon.svg";
import AddGroup from "../../../../../../../assets/images/AddGroup.svg";
import CloseGroup from "../../../../../../../assets/images/CloseGroup.svg";
import DeleteRule from "../../../../../../../assets/images/DeleteRule.svg";
import AddIcon from "@mui/icons-material/Add";
import MinusIcon from "../../../../../../../assets/images/MinusIcon.svg";
import "./QueryBuilder.css";
 
const style = {
  dialog: {
    "& .MuiDialog-paper": {
      minWidth: "40.5%",
      height: "84%",
      borderRadius: 2,
      padding: "20px 15px 20px 15px",
      maxHeight: "95%",
    },
  },
  addBtn: {
    mt: "5px",
    mb: "5px",
    textTransform: "capitalize",
    color: "#000000",
    border: "1px solid #CACBCE",
    background: "#F8F8F8",
    "&:hover": {
      background: "#F2F5FF",
      color: "#0057D9",
    },
  },
  icon: {
    fontSize: "24px",
    cursor: "pointer",
  },
  titleText: {
    fontSize: "24px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#000000",
    marginLeft: "10px",
    marginBottom: "6px",
  },
  addGroupBtn: {
    marginRight: "4px",
    border: "1px solid #d8d8d8",
    color: "black",
  },
  mergeGroupBtn: {
    background: "#001A50",
    textTransform: "capitalize",
    width: "140px",
    height: "45px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    border: "1px solid ##CACBCE",
    mb: "10px",
    mr: "80px",
    "&:hover": {
      backgroundColor: "#012164",
    },
  },
  textFields: {
    width: "220px",
    ml: "10px",
    // backgroundColor: "#F8F8F8",
    "& .MuiOutlinedInput-root": {
      height: "48px",
      borderRadius: "4px",
      padding: "0px",
      backgroundColor: "#F8F8F8",
      "& input": {
        height: "48px",
        padding: "0 8px",
        boxSizing: "border-box",
        backgroundColor: "#F8F8F8",
      },
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
};
 
const secondaryDropdown = (value = []) => [
  {
    name: "Select Column",
    type: "singleSelect",
    option: value,
    disabled: value.length === 0 ? true : false,
  },
  {
    name: "Condition",
    type: "singleSelect",
    option: [">", "<", ">=", "<=", "=", "in", "not in"],
    disabled: true,
  },
  {
    name: "Select Values",
    type: "singleSelect",
    option: [],
    disabled: true,
  },
];
const QueryBuilder = ({
  addConditionsPopup,
  handleSaveCondition,
  seletedAdhocsCondition,
  savedCondition,
  datasourceOption,
  selectedKpiData,
  handleClose,
}) => {
  const kpisData = useSelector((state) => state.dragData.KpisData);
  const [selectedGroups, setSelectedGroups] = useState({});
  const [mergedGroups, setMergedGroups] = useState({});
  const [query, setQuery] = useState("");
  const [conditionName, setConditionName] = useState("");
  const [primaryDropdownValue, setPrimaryDropdownValue] = useState({});
  const [groups, setGroups] = useState({
    "Group 1": {
      id: uuidv4(),
      DropDown: { Rule1: secondaryDropdown() },
      Rules: { Rule1: {} },
      condition: "AND",
      datasource: "",
    },
  });
  const groupDetails = {
    id: uuidv4(),
    DropDown: { Rule1: secondaryDropdown() },
    Rules: { Rule1: {} },
    condition: "AND",
    datasource: "",
  };
  const handleValidations = (primaryDropdownValue, groups, conditionName) => {
    if (!conditionName) {
      toast.warning("Please fill Condition name before saving!");
      return false;
    }
 
    // Iterate over groups and validate fields
    let isLotFound = false;
 
    for (const groupKey in groups) {
      const group = groups[groupKey];
 
      // Validate Rules in the Group
      if (group.Rules) {
        for (const ruleKey in group.Rules) {
          const rule = group.Rules[ruleKey];
          const ruleDropdown = group.DropDown[ruleKey];
 
          // Check if any required field in DropDown is empty
          for (const dropdown of ruleDropdown) {
            if (!rule[dropdown.name] || rule[dropdown.name] === "") {
              const errorMessage = `${groupKey} - ${ruleKey} - ${dropdown.name} is empty!`;
              toast.warning(errorMessage);
              // setAddConditionsPopup(true);  // Open the popup
              return false;
            }
          }
        }
      }
    }
    return true;
  };
 
  const handleSave = (primaryDropdownValue, query, groups, conditionName) => {
    if (handleValidations(primaryDropdownValue, groups, conditionName)) {
      handleSaveCondition(
        primaryDropdownValue,
        query,
        groups,
        conditionName,
        mergedGroups
      );
      handleClose();
      //   dispatch(setOpenAdhocs(false));
    }
  };
 
  useEffect(() => {
    if (savedCondition && Object.keys(savedCondition).length > 0) {
      setGroups(savedCondition.GroupsInfo);
      setMergedGroups(savedCondition.MergedGroups);
      setConditionName(savedCondition?.QueryName);
      return;
    }
    if (seletedAdhocsCondition) {
      setGroups(seletedAdhocsCondition.GroupsInfo);
      setMergedGroups(seletedAdhocsCondition.MergedGroups);
      setConditionName(seletedAdhocsCondition?.QueryName);
      return;
    }
  }, []);
 
  useEffect(() => {
    setMergedGroups((prevMergedGroups) => {
      const updatedMergedGroups = structuredClone(prevMergedGroups);
 
      Object.keys(updatedMergedGroups).forEach((mergeGroupKey) => {
        const selectedGroups = updatedMergedGroups[mergeGroupKey].selectedGroup;
 
        Object.keys(selectedGroups).forEach((groupName) => {
          if (groups[groupName]) {
            selectedGroups[groupName] = structuredClone(groups[groupName]);
          }
        });
 
        updatedMergedGroups[mergeGroupKey].selectedGroup = {
          ...selectedGroups,
        };
      });
 
      return updatedMergedGroups;
    });
  }, [groups]);
 
  const generateLogicString = (mergedGroups) => {
    const mergeGroupEntries = Object.entries(mergedGroups);
 
    if (mergeGroupEntries.length === 0) return "";
 
    const logicString = mergeGroupEntries
      .map(([mergeGroupName, mergeGroup]) => {
        const groupEntries = Object.entries(mergeGroup.selectedGroup || {});
 
        if (groupEntries.length === 0) return "";
 
        const groupString = groupEntries
          .map(([groupName, groupData], index) => {
            if (index === groupEntries.length - 1) {
              return groupName;
            }
            return `${groupName} ${groupData.condition}`;
          })
          .join(" ");
 
        return `(${groupString})`;
      })
      .filter(Boolean)
      .map((groupString, index) => {
        const mergeGroupCondition = mergeGroupEntries[index][1].condition;
        return `${groupString} ${mergeGroupCondition}`;
      })
      .join(" ");
 
    return logicString;
  };
 
  const genarateQuery = (conditionString, groupCondition) => {
    if (groupCondition) {
      return `${conditionString} ${groupCondition}`;
    }
    conditionString = conditionString.replace(/\s*(AND|OR)\s*$/, "").trim();
    return conditionString;
  };
 
  useEffect(() => {
    let mergeCondition = "";
    let groupCondition = "";
    const restOfTheGroups = getGroupsNotMerge(groups || {}, mergedGroups || {});
 
    if (mergedGroups && Object.keys(mergedGroups).length > 0) {
      mergeCondition = generateLogicString(mergedGroups);
    }
    if (restOfTheGroups && Object.keys(restOfTheGroups).length > 0) {
      const groupKeys = Object.keys(restOfTheGroups);
      groupCondition = groupKeys.reduce((acc, group, index) => {
        if (index === 0) return group;
        return `${acc} ${groups[groupKeys[index - 1]].condition} ${group}`;
      }, "");
    }
    if (mergeCondition.length > 0) {
      const query = genarateQuery(mergeCondition, groupCondition);
      setQuery(query);
      return;
    }
    setQuery(groupCondition);
  }, [groups, mergedGroups]);
 
  const handleCheckbox = (e, groupName) => {
    const value = e.target.checked;
    setSelectedGroups((prev) => ({ ...prev, [groupName]: value }));
  };
 
  const addGroup = () => {
    const getNextGroupName = () => {
      const lastGroup = Object.keys(groups).at(-1);
      const lastGroupNumber = parseInt(lastGroup.split(" ").pop());
      return lastGroupNumber + 1;
    };
    setGroups((prevGroups) => ({
      ...prevGroups,
      [`Group ${getNextGroupName()}`]: groupDetails,
    }));
  };
 
  const removeGroup = (groupName) => {
    if (Object.keys(groups).length === 1) {
      toast.info("There is only one group. Cannot delete it!");
      return;
    }
    setGroups((prev) => {
      const updatedGroups = { ...prev };
      delete updatedGroups[groupName];
      return updatedGroups;
    });
  };
 
  const addRule = (groupName) => {
    const getNextRuleName = (arr) =>
      String.fromCharCode(
        Object.keys(groups[groupName].Rules).at(-1).slice(-1).charCodeAt(0) + 1
      );
 
    setGroups((prevGroups) => ({
      ...prevGroups,
      [groupName]: {
        ...prevGroups[groupName],
        Rules: {
          ...prevGroups[groupName].Rules,
          [`Rule${getNextRuleName()}`]: {},
        },
        DropDown: {
          ...prevGroups[groupName].DropDown,
          [`Rule${getNextRuleName()}`]: secondaryDropdown(
            prevGroups[groupName].DropDown.Rule1[0].option
          ),
        },
      },
    }));
  };
 
  const removeRule = (groupName, group, ruleName) => {
    const editedGroup = {
      ...group,
      Rules: { ...group.Rules },
      DropDown: { ...group.DropDown },
    };
    if (Object.keys(group?.Rules).length === 1) {
      toast.info("There is only one row. Cannot delete it!");
      return;
    }
    delete editedGroup.Rules[ruleName];
    delete editedGroup.DropDown[ruleName];
    setGroups((prevGroups) => ({
      ...prevGroups,
      [groupName]: editedGroup,
    }));
  };
 
  const mergeGroupsHandler = () => {
    const selectedGroupKeys = Object.keys(selectedGroups).filter(
      (key) => selectedGroups[key] && groups[key]
    );
 
    if (selectedGroupKeys.length < 2) {
      toast.info("Select at least two valid groups to merge.");
      return;
    }
 
    const selectedGroupObjects = selectedGroupKeys.map((key) => groups[key]);
 
    // const hasMissingDatasource = selectedGroupObjects.some(
    //   (group) => !group.datasource || group.datasource.trim() === ""
    // );
    // if (hasMissingDatasource) {
    //   toast.warning("Please select datasource before merging.");
    //   return;
    // }
 
    // const firstDatasource = selectedGroupObjects[0].datasource;
    // const allSameDatasource = selectedGroupObjects.every(
    //   (group) => group.datasource === firstDatasource
    // );
    // if (!allSameDatasource) {
    //   toast.warning("All selected groups must have the same datasource.");
    //   return;
    // }
 
    const getMergeGroupName = () => {
      const keys = Object.keys(mergedGroups);
      const lastNum = keys.length
        ? parseInt(keys.at(-1).match(/\d+$/)?.[0] || 0, 10)
        : 0;
      return `Merge Group ${lastNum + 1}`;
    };
 
    const mergedGroupObject = {
      [getMergeGroupName()]: {
        selectedGroup: Object.keys(selectedGroups)
          .filter((group) => selectedGroups[group] && groups[group])
          .reduce((acc, group) => {
            acc[group] = groups[group];
            return acc;
          }, {}),
        condition: "AND",
      },
    };
    setMergedGroups((prev) => ({ ...prev, ...mergedGroupObject }));
    setSelectedGroups({});
  };
 
  const undoMergeGroupsHandler = (mergeName) => {
    setMergedGroups((prevMergedGroups) => {
      const updatedGroups = { ...prevMergedGroups };
      delete updatedGroups[mergeName];
      return updatedGroups;
    });
  };
 
  const handleChangeSecondaryDropdown = (event, groupName, ruleName) => {
    const { name, value } = event.target;
    if (name === "Select Column") {
      setGroups((prevGroups) => ({
        ...prevGroups,
        [groupName]: {
          ...prevGroups[groupName],
          Rules: {
            ...prevGroups[groupName].Rules,
            [ruleName]: {
              [name]: value,
              Condition: "",
              "Select Values": "",
            },
          },
          DropDown: {
            ...prevGroups[groupName].DropDown,
            [ruleName]: prevGroups[groupName].DropDown[ruleName].map(
              (dropdown) => {
                if (dropdown.name === "Condition") {
                  return {
                    ...dropdown,
                    disabled: false,
                    option:
                      value === "NRX" || value === "TRX" || value === "Total Calls"
                        ? [">", "<", ">=", "<=", "="]
                        : ["in", "not in"],
                  };
                }
                if (dropdown.name === "Select Values") {
                  return { ...dropdown, disabled: true };
                }
                return dropdown;
              }
            ),
          },
        },
      }));
    }
 
    if (name === "Condition") {
      setGroups((prevGroups) => {
        const selectedColumn =
          prevGroups[groupName].Rules[ruleName]["Select Column"];
        const selectValuesOptions = kpisData[selectedColumn] || [];
 
        return {
          ...prevGroups,
          [groupName]: {
            ...prevGroups[groupName],
            Rules: {
              ...prevGroups[groupName].Rules,
              [ruleName]: {
                ...prevGroups[groupName].Rules[ruleName],
                [name]: value,
                "Select Values": "",
              },
            },
            DropDown: {
              ...prevGroups[groupName].DropDown,
              [ruleName]: prevGroups[groupName].DropDown[ruleName].map(
                (dropdown) =>
                  dropdown.name === "Select Values"
                    ? {
                        ...dropdown,
                        disabled: false,
                        option: selectValuesOptions,
                        type: `${
                          value === "in" || value === "not in"
                            ? "multiSelect"
                            : "textFiled"
                        }`,
                      }
                    : dropdown
              ),
            },
          },
        };
      });
    }
    if (name === "Select Values") {
      setGroups((prevGroups) => ({
        ...prevGroups,
        [groupName]: {
          ...prevGroups[groupName],
          Rules: {
            ...prevGroups[groupName].Rules,
            [ruleName]: {
              ...prevGroups[groupName].Rules[ruleName],
              [name]: value,
            },
          },
        },
      }));
    }
  };
 
  const handleChangeAndOrCondition = (event, groupName) => {
    const { value } = event.target;
    setGroups((prevGroups) => ({
      ...prevGroups,
      [groupName]: {
        ...prevGroups[groupName],
        condition: value,
      },
    }));
  };
 
  const getColumnByDataSource = (data, dataSource) => {
    const result = new Set();
 
    Object.entries(data).forEach(([_, section]) => {
      if (section.DataSource?.includes(dataSource)) {
        const traverse = (obj) =>
          Object.entries(obj).forEach(([key, value]) => {
            if (Array.isArray(value) && value.includes(dataSource))
              result.add(key);
            else if (typeof value === "object" && value !== null)
              traverse(value);
          });
 
        traverse(section);
      }
    });
 
    return [...result];
  };
 
  const handleDatasource = (event, groupName) => {
    const columnValues = getColumnByDataSource(
      selectedKpiData,
      event.target.value
    );
 
    setGroups((prevGroups) => {
      const updatedDropDown = prevGroups[groupName].DropDown.Rule1.map(
        (item) => {
          if (item.name === "Select Column") {
            return { ...item, disabled: false, option: columnValues };
          } else if (
            item.name === "Condition" ||
            item.name === "Select Values"
          ) {
            return { ...item, disabled: true };
          }
          return item;
        }
      );
 
      return {
        ...prevGroups,
        [groupName]: {
          ...prevGroups[groupName],
          datasource: event.target.value,
          DropDown: {
            Rule1: updatedDropDown,
          },
          Rules: {
            Rule1: {},
          },
        },
      };
    });
  };
 
  const renderGroup = (group, groupName, index, merge, restOfTheGroups) => (
    <div key={groupName?.key}>
      <div key={group.id} className="custom-kpi-parent-group">
        <div className="group-header">
          <p
            style={{
              marginLeft: `${merge ? "10px" : "0px"}`,
              marginTop: `${merge ? "6px" : "0px"}`,
              fontSize: "18px",
            }}
          >
            {!merge && (
              <Checkbox
                value={group.id}
                checked={!!selectedGroups[groupName]}
                onChange={(e) => handleCheckbox(e, groupName)}
                sx={{
                  paddingTop: "4px",
                  transform: "scale(0.8)",
                  "& .MuiSvgIcon-root": {
                    fontSize: "26px",
                  },
                }}
              />
            )}
            {groupName}
          </p>
          <Box sx={{ width: "60%" }}>
            <AdhocsSingleSelectDropdown
              key="Datasource"
              dropDownValue={datasourceOption}
              dropDownName="Datasource"
              selectedValue={group.datasource || ""}
              handleChange={(event) => handleDatasource(event, groupName)}
            />
          </Box>
          <div>
            <Tooltip title="Add Rule">
              <IconButton
                aria-label="close"
                onClick={() => addRule(groupName)}
                sx={{
                  width: 24,
                  height: 24,
                  padding: 0,
                  marginRight: "15px",
                  marginTop: "4px",
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <img
                  src={AddGroup}
                  style={{
                    width: "29px",
                    height: "29px",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close Group">
              <IconButton
                aria-label="close"
                onClick={() => {
                  if (!merge) removeGroup(groupName);
                }}
                sx={{
                  width: 24,
                  height: 24,
                  padding: 0,
                  marginRight: "10px",
                  marginTop: "4px",
                }}
              >
                <img
                  src={CloseGroup}
                  style={{
                    width: "28px",
                    height: "28px",
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
 
        <div className="custom-kpi-group">
          {group.Rules &&
            Object.keys(group.Rules).map((ruleName, index) => {
              return (
                <Stack key={index} className="custom-kpi-filters-parent">
                  <Stack className="custom-kpi-filters">
                    {group?.DropDown[ruleName].map((dropdown, index) => {
                      if (dropdown.type === "singleSelect") {
                        return (
                          <AdhocsSingleSelectDropdown
                            className="filters-condition"
                            key={dropdown.name}
                            dropDownValue={dropdown.option}
                            dropDownName={dropdown.name}
                            selectedValue={
                              group.Rules[ruleName][dropdown?.name] || ""
                            }
                            handleChange={(event) =>
                              handleChangeSecondaryDropdown(
                                event,
                                groupName,
                                ruleName
                              )
                            }
                            disabled={dropdown.disabled}
                          />
                        );
                      }
                      if (dropdown.type === "multiSelect") {
                        return (
                          <AdhocsMultiSelectDropdown
                            key={dropdown.name}
                            dropDownValue={dropdown.option}
                            dropDownName={dropdown.name}
                            selectedValue={
                              group.Rules[ruleName][dropdown?.name] || []
                            }
                            handleChange={(event) =>
                              handleChangeSecondaryDropdown(
                                event,
                                groupName,
                                ruleName
                              )
                            }
                            disabled={dropdown.disabled}
                          />
                        );
                      }
                      if (dropdown.type === "textFiled") {
                        return (
                          <TextField
                            sx={style.textFields}
                            id="outlined-textarea"
                            placeholder="Enter Value"
                            name="Select Values"
                            value={group.Rules[ruleName][dropdown?.name] || ""}
                            onChange={(event) =>
                              handleChangeSecondaryDropdown(
                                event,
                                groupName,
                                ruleName
                              )
                            }
                            disabled={dropdown.disabled}
                          />
                        );
                      }
                      return null;
                    })}
                  </Stack>
                  <Stack className="buttons">
                    <Tooltip title="Delete Rule">
                      <IconButton
                        aria-label="delete"
                        onClick={() => removeRule(groupName, group, ruleName)}
                        sx={{
                          width: 30,
                          height: 30,
                          padding: 0,
                          marginRight: "12px",
                        }}
                      >
                        <img
                          src={DeleteRule}
                          style={{
                            width: "36px",
                            height: "36px",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              );
            })}
        </div>
      </div>
      <div className="conditions-dropdown">
        {restOfTheGroups &&
          index === Object.keys(restOfTheGroups).length - 1 && (
            <Button
              variant="outlined"
              sx={{
                ...style.addBtn,
                "&:hover .add-icon": {
                  color: "#0057D9",
                },
              }}
              onClick={addGroup}
              startIcon={
                <AddIcon
                  className="add-icon"
                  sx={{ color: "#000000", transition: "color 0.3s" }}
                />
              }
            >
              Add Group
            </Button>
          )}
      </div>
      {merge?.selectedGroup &&
        index !== Object.keys(merge?.selectedGroup).length - 1 && (
          <Stack sx={{ marginTop: "10px", width: "15%" }}>
            <SingleSelectDropdown
              className="filters-condition"
              key={group?.condition}
              dropDownValue={["AND", "OR", "Except"]}
              dropDownName={group?.condition}
              selectedValue={group?.condition || ""}
              handleChange={(event) =>
                handleChangeAndOrCondition(event, groupName)
              }
            />
          </Stack>
        )}
      {restOfTheGroups && index !== Object.keys(restOfTheGroups).length - 1 && (
        <Stack sx={{ marginTop: "10px", width: "15%" }}>
          <SingleSelectDropdown
            className="filters-condition"
            key={group?.condition}
            dropDownValue={["AND", "OR", "Except"]}
            dropDownName={group?.condition}
            selectedValue={group?.condition || ""}
            handleChange={(event) =>
              handleChangeAndOrCondition(event, groupName)
            }
          />
        </Stack>
      )}
    </div>
  );
 
  const getLastMergeGroup = (mergeName) => {
    if (!mergedGroups || typeof mergedGroups !== "object") return true;
    if (!groups || typeof groups !== "object") return true;
 
    const mergedGroupKeys = Object.keys(mergedGroups);
    if (mergedGroupKeys.at(-1) !== mergeName) return true;
 
    const getSelectedGroupKeys = mergedGroupKeys.flatMap((mergeGroup) =>
      Object.keys(mergedGroups[mergeGroup]?.selectedGroup || {})
    );
 
    const missing = Object.keys(groups).some(
      (value) => !getSelectedGroupKeys.includes(value)
    );
 
    return missing;
  };
 
  const getGroupsNotMerge = (restGroup = {}, mergeGroupSelected = {}) => {
    if (!restGroup || typeof restGroup !== "object") return {};
    if (!mergeGroupSelected || typeof mergeGroupSelected !== "object")
      return {};
 
    // Extract selected group names safely
    const selectedGroupNames = Object.values(mergeGroupSelected).flatMap(
      (mergeGroup) => Object.keys(mergeGroup.selectedGroup || {})
    );
 
    // Filter groups not included in selectedGroupNames
    return Object.keys(restGroup)
      .filter((groupName) => !selectedGroupNames.includes(groupName))
      .reduce((acc, key) => {
        acc[key] = restGroup[key];
        return acc;
      }, {});
  };
 
  const handleChangeMergeCondition = (event, mergeName) => {
    const { value } = event.target;
    setMergedGroups((prev) => ({
      ...prev,
      [mergeName]: {
        ...prev[mergeName],
        condition: value,
      },
    }));
  };
 
  const renderCondition = () => {
    const restOfTheGroups = getGroupsNotMerge(groups || {}, mergedGroups || {});
    return (
      <Box>
        {Object.keys(mergedGroups).map((mergeName, index) => {
          const merge = mergedGroups[mergeName];
          return (
            <>
              <Box className="merged-groups-container" key={index}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <p
                    style={{
                      fontSize: "18px",
                      marginLeft: "10px",
                      marginTop: "4px",
                    }}
                  >
                    {mergeName}{" "}
                  </p>
                  <Tooltip title="Undo Merge">
                    <IconButton
                      aria-label="close"
                      onClick={() => undoMergeGroupsHandler(mergeName)}
                      sx={{
                        width: 24,
                        height: 24,
                        padding: 0,
                        marginRight: "6px",
                        marginTop: "4px",
                      }}
                    >
                      <img
                        src={MinusIcon}
                        style={{
                          width: "24px",
                          height: "24px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Stack>
 
                <Stack className="groups-container">
                  {merge.selectedGroup &&
                    Object.keys(merge.selectedGroup).map((groupName, index) => {
                      const group = merge.selectedGroup[groupName];
                      return renderGroup(group, groupName, index, merge, false);
                    })}
                </Stack>
              </Box>
              {getLastMergeGroup(mergeName) && (
                <Stack sx={{ marginTop: "10px", width: "15%" }}>
                  <SingleSelectDropdown
                    className="filters-condition"
                    key={merge?.condition}
                    dropDownValue={["AND", "OR", "Except"]}
                    dropDownName={merge?.condition}
                    selectedValue={merge?.condition || ""}
                    handleChange={(event) =>
                      handleChangeMergeCondition(event, mergeName)
                    }
                  />
                </Stack>
              )}
            </>
          );
        })}
 
        {restOfTheGroups && Object.keys(restOfTheGroups).length === 0 ? (
          <Button
            variant="outlined"
            sx={{
              ...style.addBtn,
              marginLeft: "10px",
              "&:hover .add-icon": {
                color: "#0057D9",
              },
            }}
            onClick={addGroup}
            startIcon={
              <AddIcon
                className="add-icon"
                sx={{ color: "#000000", transition: "color 0.3s" }}
              />
            }
          >
            Add Group
          </Button>
        ) : (
          <>
            {Object.keys(restOfTheGroups).map((groupName, index) => {
              const group = restOfTheGroups[groupName];
              return renderGroup(
                group,
                groupName,
                index,
                false,
                restOfTheGroups
              );
            })}
          </>
        )}
      </Box>
    );
  };
 
  const handlePrimaryChange = (event) => {
    const { name, value } = event.target;
    setPrimaryDropdownValue((prev) => ({ ...prev, [name]: [...value] }));
  };
 
  return (
    <Dialog sx={style.dialog} open={addConditionsPopup}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography sx={style.titleText}>
          {savedCondition ? "Edit" : "Add"} conditions
        </Typography>
        <Button
          variant="contained"
          sx={style.mergeGroupBtn}
          onClick={() => mergeGroupsHandler()}
        >
          Merge Groups
        </Button>
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
          sx={{
            position: "absolute",
            right: 16,
            top: 15,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {/* <CloseIcon /> */}
          <img src={CloseIcon} />
        </IconButton>
      </Stack>
 
      <Stack className="primary-filters"></Stack>
      <Stack className="groups-container">{renderCondition()}</Stack>
      <hr />
      <Stack>
        <TextField
          sx={{
            width: "97.5%",
            ml: "10px",
            mt: "10px",
            "& .MuiInputBase-input": {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "black",
              fontSize: "16px",
              backgroundColor: "#FFFFFF",
            },
            "& .MuiInputBase-root": {
              height: 45,
              borderRadius: "5px",
            },
          }}
          id="filled-hidden-label-small"
          placeholder="Enter Adhocs Condition Name "
          value={conditionName}
          onChange={(event) => setConditionName(event.target.value)}
        />
      </Stack>
      <Stack className="query-container">
        <TextField
          sx={{
            width: "85%",
            "& .MuiInputBase-input": {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "black",
              fontSize: "16px",
              borderColor: "#0057D9",
            },
            "& .MuiInputBase-root": {
              height: 45,
              borderRadius: "5px",
              backgroundColor: " #F8F8F8",
            },
            "& .Mui-disabled": {
              color: "black !important",
              WebkitTextFillColor: "black ",
            },
          }}
          hiddenLabel
          id="filled-hidden-label-small"
          value={query}
          disabled
        />
        <Button
          size="large"
          variant="contained"
          sx={{
            background: "#001A50",
            textTransform: "capitalize",
            width: "14%",
            fontSize: "15px",
            fontWeight: "500",
            fontFamily: "Inter, sans-serif",
            "&:hover": {
              backgroundColor: "#012164",
            },
          }}
          onClick={() =>
            handleSave(primaryDropdownValue, query, groups, conditionName)
          }
        >
          {seletedAdhocsCondition ? "Edit" : "Save"}
        </Button>
      </Stack>
    </Dialog>
  );
};
export default QueryBuilder;