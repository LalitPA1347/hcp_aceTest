import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import SingleSelectDropdown from "../../../../Common/DropDown/SingleSelectDropdown";
import SingleSelectWithSingleOptionDropdown from "../../../../Common/DropDown/SingleSelectWithSingleOptionDropdown";
import Conditions from "../Conditions";
import { useDispatch, useSelector } from "react-redux";
import "./AdhocsIndication.css";
import axiosApiInstance from "../../../../auth/apiInstance";
import { API_URL } from "../../../../../shared/apiEndPointURL";
import {
  setAdhocsResults,
  setIsAdhocsUpdated,
  setOpenAdhocs,
  setSelectedConditions,
} from "../../../../../redux/descriptiveInsights/AdhocsSlice";

const style = {
  SubmitBtn: {
    mr: "10px",
    background: "#002060",
    textTransform: "capitalize",
    width: "82px",
    height: "35px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#002060",
    },
  },
  titleText: {
    fontSize: "14px",
    mt: "7px",
    ml: "14px",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    color: "rgb(70, 70, 248)",
    textDecoration: "underline",
    textUnderlineOffset: "5px",
  },
};

const AdhocsIndication = () => {
  const moduleColumns = useSelector(
    (state) => state.patientAnalyticsData.ModuleColumns
  );
  const dropDownValues = useSelector(
    (state) => state.patientAnalyticsData.DropDownValues
  );
  const [selectedValue, setSelectedValue] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [dropDownNamesValuesOptions, setDropDownNamesValuesOptions] = useState(
    []
  );
  const [addConditionsPopup, setAddConditionsPopup] = useState(false);
  const [updatedAddConditionsPopup, setUpdatedAddConditionsPopup] =
    useState(false);
  const [filteredData, setFilteredData] = useState();
  const [payload, setPayload] = useState({});
  const [seletedAdhocsCondition, setSeletedAdhocsCondition] = useState();
  const dispatch = useDispatch();

  const selectedAdhocs = useSelector(
    (store) => store.selectedAdhocsReports.selectedAdhocs
  );
  const openAdhocs = useSelector(
    (store) => store.selectedAdhocsReports.openAdhocs
  );

  useEffect(() => {
    if (selectedAdhocs) {
      handleChange({
        target: {
          name: Object.keys(selectedAdhocs).find(
            (key) => selectedAdhocs[key] === selectedAdhocs.DataSource
          ),
          value: selectedAdhocs.DataSource,
        },
      });

      const name = Object.keys(selectedAdhocs).find(
        (key) => selectedAdhocs[key] === selectedAdhocs.Indication
      );

      const value = selectedAdhocs.Indication;

      handleChangeMultipleSelect(name, value);
      setFilteredData(dropDownValues);
      openAdhocs
        ? setUpdatedAddConditionsPopup(true)
        : setUpdatedAddConditionsPopup(false);
      const copy = JSON.parse(JSON.stringify(selectedAdhocs.Groups));
      Object.keys(copy).forEach((group) => {
        delete copy[group].id;
        delete copy[group].DropDown;
      });
      const data = {
        DataSource: selectedAdhocs.DataSource,
        Indication: selectedAdhocs.Indication,
        KPI: selectedAdhocs?.KPI,
        "Group By": selectedAdhocs?.["Group By"],
        Query: selectedAdhocs?.Query,
        Groups: copy,
        GroupsInfo: selectedAdhocs?.GroupsInfo,
        MergedGroups: selectedAdhocs?.MergedGroups,
        "Adhoc Name": selectedAdhocs?.["Adhoc Name"],
      };
      setSeletedAdhocsCondition(data);
    }
  }, [selectedAdhocs, openAdhocs]);

  const handleSaveCondition = (
    primaryDropdownValue,
    query,
    groups,
    conditionName,
    mergedGroups
  ) => {
    const copy = JSON.parse(JSON.stringify(groups));
    Object.keys(copy).forEach((group) => {
      delete copy[group].id;
      delete copy[group].DropDown;
    });
    const data = {
      KPI: primaryDropdownValue.Measures,
      "Group By": primaryDropdownValue?.["Group By"],
      Query: query,
      Groups: copy,
      "Adhoc Name": conditionName,
      GroupsInfo: groups,
      MergedGroups: mergedGroups,
    };
    setPayload(data);
    setSeletedAdhocsCondition(data);
  };

  const primaryDropdown = () => {
    const dropdownNamesValues = moduleColumns?.adhocs?.[
      selectedValue?.DataSource
    ]
      ?.filter(
        (item) =>
          item.Dropdown_value === "Measures" ||
          item.Dropdown_value === "Group By"
      )
      .map((item) => ({
        name: item.Dropdown_value,
        type: item.Selection_Type,
        option: [],
      }));

    const primaryDropdown = dropdownNamesValues?.map((objectItem) => {
      const keys = Object.keys(filteredData)[0];

      if (filteredData && keys) {
        const entry = filteredData?.[keys].find(
          (item) => item?.[objectItem.name]
        );
        objectItem.option = entry?.[objectItem.name];
      }
      return objectItem;
    });
    return primaryDropdown;
  };

  const secondaryDropdown = () => {
    const dropdownNamesValues = moduleColumns?.adhocs?.[
      selectedValue?.DataSource
    ]
      ?.filter(
        (item) =>
          item.Dropdown_value !== "Group By" &&
          item.Dropdown_value !== "Measures" &&
          item.Dropdown_value !== "DataSource" &&
          item.Dropdown_value !== "Indication"
      )
      .map((item) => item.Dropdown_value);

    const secondaryDropdownValue = [
      {
        name: "Select Column",
        type: "singleSelect",
        option: dropdownNamesValues,
        disabled: false,
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
    return secondaryDropdownValue;
  };

  const handleSecondaryDropdownValue = (value) => {
    const keys = Object.keys(filteredData)[0];
    const secondaryDropdownValue = dropDownValues[keys].find(
      (item) => item?.[value]
    )?.[value];
    return secondaryDropdownValue;
  };

  // Function to extract unique values for Dropdown values
  const getUniqueOptions = (dropDownValues, key) => {
    const optionsSet = new Set();

    Object.values(dropDownValues).forEach((data) =>
      data.forEach((item) => {
        if (item[key]) {
          optionsSet.add(item[key]);
        }
      })
    );
    const dropdownValue = [...new Set(Array.from(optionsSet).flat())].sort();
    return dropdownValue;
  };

  const handleDataSourceSelect = (value) => {
    const dropdownNamesValues = moduleColumns?.adhocs?.[value]
      ?.filter(
        (item) =>
          item.Dropdown_value === "DataSource" ||
          item.Dropdown_value === "Indication"
      )
      .map((item) => ({
        name: item.Dropdown_value,
        type: item.Selection_Type,
        option: [],
      }));
    const dataSourceArray = getUniqueOptions(
      dropDownValues,
      dropdownNamesValues[0]?.name
    );
    dropdownNamesValues[0].option = dataSourceArray;
    setDropDownNamesValuesOptions(dropdownNamesValues);
    return dropdownNamesValues;
  };

  useEffect(() => {
    if (moduleColumns.adhocs) {
      setSelectedValue({});
      handleDataSourceSelect("Claims");
    }
    setFilteredData(dropDownValues);
  }, [moduleColumns]);

  // function to remove the values of next dropdowns if inbetween dropdown is selected again
  const removeObjectValue = (data, key, value) => {
    const sortedData = {};
    const hasKey = key in data;
    if (!hasKey) {
      return { ...data, [key]: value };
    }
    for (let k in data) {
      if (k === key) {
        if (value.length === 0) return sortedData;
        if (Object.keys(k).length === 0) return sortedData;
        sortedData[k] = value;
        return sortedData;
      }
      sortedData[k] = data[k];
    }
  };

  // function to get the value of indication dropdown
  const getIndicationValues = (key, filteredApiData) => {
    const optionsMap = {};
    Object.values(filteredApiData).forEach((dataSet) => {
      dataSet.forEach((entry) => {
        if (entry[key]) {
          const option = Object.keys(entry[key])[0];
          const version = entry[key][option];

          if (!optionsMap[option]) {
            optionsMap[option] = [];
          }

          optionsMap[option].push(version);
        }
      });
    });

    return Object.keys(optionsMap).map((option) => ({
      option,
      values: optionsMap[option],
    }));
  };

  // function to get the values of the next Dropdown
  const handleDropdownValue = (name, value, data) => {
    const index = dropDownNamesValuesOptions.findIndex(
      (item) => item.name === name
    );
    const nextDropdown = dropDownNamesValuesOptions[index + 1]?.name;

    if (nextDropdown === "Indication") {
      const filteredApiData = Object.fromEntries(
        Object.entries(dropDownValues)?.filter(([_, data]) =>
          data.some((item) => item.DataSource?.includes(value))
        )
      );
      setFilteredData(filteredApiData);
      const MultiSelectOptions = getIndicationValues(
        nextDropdown,
        filteredApiData
      );

      setDropDownNamesValuesOptions((prevState) =>
        prevState.map((item) =>
          item.name === nextDropdown
            ? { ...item, option: MultiSelectOptions }
            : item
        )
      );
      return;
    }
  };

  // function to handle single select dropdown change
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "DataSource") {
      handleDataSourceSelect(value);
    }
    handleDropdownValue(name, value, filteredData);
    const sortedSelectedValue = removeObjectValue(selectedValue, name, value);
    setSelectedValue(sortedSelectedValue);
  };

  // function to filter Data based on Indication selected in indication dropdown
  const filterDataByIndication = (indicationCriteria) => {
    const results = {};
    const indications = Object.entries(indicationCriteria);
    indications.forEach(([key, val]) => {
      Object.keys(dropDownValues).forEach((dataKey) => {
        const dataSet = dropDownValues[dataKey];
        const hasIndication = dataSet.some(
          (obj) => obj.Indication && obj.Indication[key] === val
        );

        if (hasIndication) {
          results[dataKey] = dataSet;
        }
      });
    });

    return results;
  };

  // function to handle multi select & other dropdown change
  const handleChangeMultipleSelect = (name, value) => {
    const filterData = filterDataByIndication(value);
    setFilteredData(filterData);
    setSelectedValue((prev) => ({ ...prev, [name]: value }));
  };

  // function to handle enable/disable next dropdown based on current dropdown value
  const isDropdownDisabled = (index) => {
    if (index === 0) return false;
    const prevDropdownName = dropDownNamesValuesOptions[index - 1].name;
    return !selectedValue[prevDropdownName];
  };

  const handlePopup = () => {
    if (selectedValue?.DataSource && selectedValue?.Indication) {
      setAddConditionsPopup(true);
      return;
    }
    toast.warning("Please Select DataSource & Indication Dropdown");
  };

  const handleSubmit = async () => {
    try{
    const indication = Object.keys(selectedValue.Indication)[0];
    const APIpayload = {
      Module: "adhocs",
      Analytics_Section: "Patient Analytics",
      groupdata: {
        DataSource: [selectedValue.DataSource],
        Indication: { [indication]: [selectedValue.Indication?.[indication]] },
        KPI: payload.KPI,
        "Group By": payload["Group By"] || [] ,
        "Adhoc Name": payload["Adhoc Name"],
        Query: payload.Query,
        Groups: payload.Groups,
        GroupsInfo: payload.GroupsInfo,
        MergedGroups: payload.MergedGroups,
      },
    };
    setShowLoader(true);
    const res = await axiosApiInstance.post(
      API_URL.adhocsResultApi,
      APIpayload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
 
    if (res && res.data) {
      dispatch(setIsAdhocsUpdated(true));
      dispatch(setSelectedConditions(APIpayload.groupdata));
      dispatch(setAdhocsResults(res.data));
      setShowLoader(false);
      return;
    } else {
      toast.warning("Response is empty ");
      setShowLoader(false);
    }
  } catch (error) {
    toast.warning(`Error: ${error?.response?.data?.message || error.message}`);
    setShowLoader(false);
  }
  };

  return (
    <Stack
      justifyContent="space-between"
      direction="row"
      sx={{ ml: "256px", height: "11vh" }}
    >
      <Stack className="adhocs-indication-model" direction="row">
        <Box>
          {dropDownNamesValuesOptions.map((dropdown, index) => {
            if (dropdown.type === "singleSelect") {
              return (
                <SingleSelectDropdown
                  key={dropdown.name}
                  dropDownValue={dropdown.option}
                  dropDownName={dropdown.name}
                  selectedValue={selectedValue?.[dropdown?.name] || ""}
                  handleChange={handleChange}
                  disabled={isDropdownDisabled(index)}
                />
              );
            }
            if (dropdown.type === "singleSelectWithSingleOption") {
              return (
                <SingleSelectWithSingleOptionDropdown
                  key={dropdown.name}
                  dropDownValue={dropdown.option}
                  dropDownName={dropdown.name}
                  selectedValue={selectedValue?.[dropdown?.name] || []}
                  handleChange={handleChangeMultipleSelect}
                  disabled={isDropdownDisabled(index)}
                />
              );
            }
            return null;
          })}
        </Box>
        <Typography sx={style.titleText} onClick={handlePopup}>
          {Object.keys(payload).length > 0 ? "Saved Conditions": "Add New Conditions"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            height: "37px",
            position: "absolute",
            right: "40px",
          }}
        >
          <Button
            variant="contained"
            sx={style.SubmitBtn}
            onClick={handleSubmit}
            // disabled={SubmitBtnDisable()}
          >
            Submit
          </Button>
        </Box>
        <Backdrop sx={{ zIndex: 10 }} open={showLoader}>
          <CircularProgress sx={{ color: "black" }} />
        </Backdrop>
      </Stack>
      {addConditionsPopup && (
        <Conditions
          primaryDropdown={primaryDropdown}
          secondaryDropdown={secondaryDropdown}
          handleSecondaryDropdownValue={handleSecondaryDropdownValue}
          addConditionsPopup={addConditionsPopup}
          setAddConditionsPopup={setAddConditionsPopup}
          handleSaveCondition={handleSaveCondition}
          savedCondition={payload}
        />
      )}
      {updatedAddConditionsPopup && (
        <Conditions
          primaryDropdown={primaryDropdown}
          secondaryDropdown={secondaryDropdown}
          handleSecondaryDropdownValue={handleSecondaryDropdownValue}
          addConditionsPopup={updatedAddConditionsPopup}
          setAddConditionsPopup={setUpdatedAddConditionsPopup}
          handleSaveCondition={handleSaveCondition}
          seletedAdhocsCondition={seletedAdhocsCondition}
        />
      )}
    </Stack>
  );
};

export default AdhocsIndication;
