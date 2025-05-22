import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SingleSelectDropdown from "../../../Common/DropDown/SingleSelectDropdown";
import MultiSelectDropdown from "../../../Common/DropDown/MultiSelectDropdown";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "./Adhocs.css";
import AdhocsSingleSelectDropdown from "../../../Common/DropDown/AdhocsSingleSelectDropdown";
import AdhocsMultiSelectDropdown from "../../../Common/DropDown/AdhocsMultiSelectDropdown";
import { useDispatch } from "react-redux";
import { setOpenAdhocs } from "../../../../redux/descriptiveInsights/AdhocsSlice";

const style = {
  dialog: {
    "& .MuiDialog-paper": {
      minWidth: "42%",
      height: "95%",
      borderRadius: 2,
      padding: "20px 15px 20px 15px",
      maxHeight: "95%",
    },
  },
  icon: {
    fontSize: "18px",
    cursor: "pointer",
  },
  titleText: {
    fontSize: "20px",
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
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    textTransform: "none",
    borderRadius: "2.5px",
    height: "35px",
    backgroundColor: "#002060",
    "&:hover": {
      backgroundColor: "#002060",
    },
  },
};

const Conditions = ({
  primaryDropdown,
  secondaryDropdown,
  addConditionsPopup,
  setAddConditionsPopup,
  handleSecondaryDropdownValue,
  handleSaveCondition,
  seletedAdhocsCondition,
  savedCondition,
}) => {
  const [selectedGroups, setSelectedGroups] = useState({});
  const [mergedGroups, setMergedGroups] = useState({});
  const [query, setQuery] = useState("");
  const [conditionName, setConditionName] = useState("");
  const [primaryDropdownValue, setPrimaryDropdownValue] = useState({});
  const [type, setType] = useState(10);
  const dispatch = useDispatch();
  const [groups, setGroups] = useState({
    "Group 1": {
      id: uuidv4(),
      DropDown: { Rule1: secondaryDropdown() },
      Rules: { Rule1: {} },
      condition: "AND",
    },
  });
  const groupDetails = {
    id: uuidv4(),
    DropDown: { Rule1: secondaryDropdown() },
    Rules: { Rule1: {} },
    condition: "AND",
  };

  const handleValidations = (primaryDropdownValue, groups, conditionName) => {
    if (!primaryDropdownValue.Measures) {
      toast.warning("Please fill Measure field before saving!");
      return false;
    }

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

          if (
            primaryDropdownValue.Measures.includes("SOB") && rule["Select Column"] === "LOT") {
            isLotFound = true;
          }

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

    if (primaryDropdownValue.Measures.includes("SOB") && isLotFound === false) {
      toast.warning('"LOT" must be selected when "SOB" is in Measures!');
      return false;
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
      setAddConditionsPopup(false);
    }
  };

  useEffect(() => {
    const valueObject = primaryDropdown().reduce((acc, item) => {
      acc[item.name] = "";
      return acc;
    }, {});

    if (savedCondition && Object.keys(savedCondition).length > 0) {
      setPrimaryDropdownValue({
        Measures: savedCondition?.KPI,
        "Group By": savedCondition?.["Group By"],
      });
      setGroups(savedCondition.GroupsInfo);
      setMergedGroups(savedCondition.MergedGroups);
      setConditionName(savedCondition?.["Adhoc Name"]);
      return;
    }
    if (seletedAdhocsCondition) {
      setPrimaryDropdownValue({
        Measures: seletedAdhocsCondition?.KPI,
        "Group By": seletedAdhocsCondition?.["Group By"],
      });
      setGroups(seletedAdhocsCondition.GroupsInfo);
      setMergedGroups(seletedAdhocsCondition.MergedGroups);
      setConditionName(seletedAdhocsCondition?.["Adhoc Name"]);
      return;
    }
    setPrimaryDropdownValue(valueObject);
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
          [`Rule${getNextRuleName()}`]: secondaryDropdown(),
        },
      },
    }));
  };

  const removeRule = (groupName, group, ruleName) => {
    const editedGroup = group;
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
    if (Object.keys(selectedGroups).length < 2) {
      toast.info("Select at least two groups to merge.");
      return;
    }
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
          .filter((group) => selectedGroups[group])
          .reduce((acc, group) => {
            acc[group] = groups?.[group];
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

  const handleClose = () => {
    setAddConditionsPopup(false);
    dispatch(setOpenAdhocs(false));
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
                      value === "LOT" || value === "Years"
                        ? [">", "<", ">=", "<=", "=", "in", "not in"]
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
        const selectValuesOptions =
          handleSecondaryDropdownValue(selectedColumn);

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
                            : "singleSelect"
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

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const renderGroup = (group, groupName, index, merge, restOfTheGroups) => (
    <div key={groupName?.key}>
      <div key={group.id} className="custom-kpi-parent-group">
        <div className="group-header">
          <p style={{ marginLeft: `${merge ? "5px" : "0px"}` }}>
            {!merge && (
              <Checkbox
                value={group.id}
                checked={!!selectedGroups[groupName]}
                onChange={(e) => handleCheckbox(e, groupName)}
                sx={{
                  padding: "1px",
                  margin: "0px",
                  transform: "scale(0.8)",
                  "& .MuiSvgIcon-root": {
                    fontSize: "22px",
                  },
                }}
              />
            )}
            {groupName}
          </p>
          <div>
            <Tooltip title="Add Rule">
              <AddCircleOutlineOutlinedIcon
                sx={{ ...style.icon, marginRight: "10px" }}
                onClick={() => addRule(groupName)}
              />
            </Tooltip>
            <CloseIcon
              fontSize="small"
              sx={{ ...style.icon }}
              onClick={() => {
                if (!merge) removeGroup(groupName);
              }}
            />
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
                      return null;
                    })}
                  </Stack>
                  <Stack className="buttons">
                    <DeleteIcon
                      sx={{
                        ...style.icon,
                        marginRight: "20px",
                        marginLeft: "10px",
                      }}
                      onClick={() => removeRule(groupName, group, ruleName)}
                    />
                  </Stack>
                </Stack>
              );
            })}
        </div>
      </div>
      <div className="conditions-dropdown">
        {restOfTheGroups &&
          index === Object.keys(restOfTheGroups).length - 1 && (
            <Tooltip title="Add Group">
              <Button
                size="small"
                variant="outlined"
                sx={style.addGroupBtn}
                onClick={addGroup}
              >
                <AddCircleOutlineOutlinedIcon sx={style.icon} />
              </Button>
            </Tooltip>
          )}
      </div>
      {merge?.selectedGroup &&
        index !== Object.keys(merge?.selectedGroup).length - 1 && (
          <SingleSelectDropdown
            className="filters-condition"
            key={group?.condition}
            dropDownValue={["AND", "OR"]}
            dropDownName={group?.condition}
            selectedValue={group?.condition || ""}
            handleChange={(event) =>
              handleChangeAndOrCondition(event, groupName)
            }
          />
        )}
      {restOfTheGroups && index !== Object.keys(restOfTheGroups).length - 1 && (
        <SingleSelectDropdown
          className="filters-condition"
          key={group?.condition}
          dropDownValue={["AND", "OR"]}
          dropDownName={group?.condition}
          selectedValue={group?.condition || ""}
          handleChange={(event) => handleChangeAndOrCondition(event, groupName)}
        />
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
                  <h5>{mergeName} </h5>
                  <Tooltip title="Undo Merge">
                    <RemoveCircleOutlineIcon
                      sx={style.icon}
                      onClick={() => undoMergeGroupsHandler(mergeName)}
                    />
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
                <Box>
                  <SingleSelectDropdown
                    className="filters-condition"
                    key={merge?.condition}
                    dropDownValue={["AND", "OR"]}
                    dropDownName={merge?.condition}
                    selectedValue={merge?.condition || ""}
                    handleChange={(event) =>
                      handleChangeMergeCondition(event, mergeName)
                    }
                  />
                </Box>
              )}
            </>
          );
        })}

        {restOfTheGroups && Object.keys(restOfTheGroups).length === 0 ? (
          <Tooltip title="Add Group">
            <Button
              size="small"
              variant="outlined"
              sx={{ ...style.addGroupBtn, marginLeft: "10px" }}
              onClick={addGroup}
            >
              <AddCircleOutlineOutlinedIcon sx={style.icon} />
            </Button>
          </Tooltip>
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
        <Typography sx={style.titleText}>{seletedAdhocsCondition ? "Edit" : "Add"} conditions</Typography>
        <CloseIcon
          fontSize="small"
          sx={{ ...style.icon }}
          onClick={() => handleClose()}
        />
      </Stack>

      <Stack className="primary-filters">
        <Box>
          {primaryDropdown().map((dropdown, index) => {
            if (dropdown.type === "multiSelect") {
              return (
                <AdhocsMultiSelectDropdown
                  key={dropdown.name}
                  dropDownValue={dropdown.option}
                  dropDownName={dropdown.name}
                  selectedValue={primaryDropdownValue?.[dropdown?.name] || []}
                  handleChange={handlePrimaryChange}
                />
              );
            }
            return null;
          })}
        </Box>
        <Button
          size="small"
          variant="contained"
          sx={style.mergeGroupBtn}
          onClick={() => mergeGroupsHandler()}
        >
          Merge Groups
        </Button>
      </Stack>
      <Stack className="groups-container">{renderCondition()}</Stack>
      <Stack>
        <TextField
          sx={{
            width: "82%",
            height: "1%",
            ml: "10px",
            mt: "8px",
            "& .MuiInputBase-input": {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "black",
              fontSize: "12px",
              backgroundColor: " #eaeaf8",
              borderRadius: "2.5px",
            },
          }}
          id="filled-hidden-label-small"
          placeholder="Define Adhocs Condition Name "
          value={conditionName}
          onChange={(event) => setConditionName(event.target.value)}
          size="small"
        />
      </Stack>
      <Stack className="query-container">
        <TextField
          sx={{
            width: "85%",
            height: "1%",
            "& .MuiInputBase-input": {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "black",
              fontSize: "12px",
              backgroundColor: " #eaeaf8",
              borderRadius: "2.5px",
            },
            "& .Mui-disabled": {
              color: "black !important",
              WebkitTextFillColor: "black ",
            },
          }}
          hiddenLabel
          id="filled-hidden-label-small"
          value={query}
          // variant="filled"
          size="small"
          disabled
        />
        <Button
          size="large"
          variant="contained"
          sx={{
            width: "14%",
            fontSize: 12,
            textTransform: "none",
            borderRadius: "2.5px",
            height: "33px",
            backgroundColor: "#002060",
            "&:hover": {
              backgroundColor: "#002060",
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

export default Conditions;
