import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Backdrop, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import SingleSelectDropdown from "../../../Common/DropDown/SingleSelectDropdown";
import MultiSelectDropdown from "../../../Common/DropDown/MultiSelectDropdown";
import MultiSelectWithSingleOptionDropDown from "../../../Common/DropDown/MultiSelectWithSingleOptionDropDown";
import SingleSelectWithMultipleOptionDropdown from "../../../Common/DropDown/SingleSelectWithMultipleOptionDropdown";
import SingleSelectWithSingleOptionDropdown from "../../../Common/DropDown/SingleSelectWithSingleOptionDropdown";
import { setExecutionMetricsChartData } from "../../../../redux/descriptiveInsights/executionMetricsSlice";
import { DIGraphGenerateApi } from "../../../../services";
import { filterReportDataExecutionMetrics } from "../../Helper";
import "./ExecutionMetricsIndication.css";

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
};

const ExecutionMetricsIndication = () => {
  const { flag } = useParams();
  const dispatch = useDispatch();
  const moduleColumns = useSelector(
    (state) => state.executionMetricsData.ModuleColumns
  );
  const dropDownValues = useSelector(
    (state) => state.executionMetricsData.DropDownValues
  );
  const savedDropdown = useSelector(
    (state) => state.executionMetricsChart.data || {}
  );
  const [selectedValue, setSelectedValue] = useState({});
  const [filteredData, setFilteredData] = useState();
  const [dropDownNamesValuesOptions, setDropDownNamesValuesOptions] = useState(
    []
  );
  const [showLoader, setShowLoader] = useState(false);

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

  // function to get number of dropdown based on DataSource selected, by default it is Call Activity
  const handleDataSourceSelect = (value) => {
    const dropdownNamesValues = moduleColumns?.[flag]?.[value].map((item) => ({
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
    if (flag in savedDropdown) {
      setDropDownNamesValuesOptions(savedDropdown?.[flag].dropDownOptions);
      setSelectedValue(savedDropdown?.[flag].selectedDropDownValue);
      if (savedDropdown?.[flag].dropDownOptions.length === 0) {
        const reportOption = handleDataSourceSelect(
          savedDropdown?.[flag].selectedDropDownValue.DataSource
        );
        const { reportedSelectedValue, reportedDropDownValue, reportedData } =
          filterReportDataExecutionMetrics(
            savedDropdown?.[flag].selectedDropDownValue,
            reportOption,
            dropDownValues,
            flag
          );
        setDropDownNamesValuesOptions(reportedDropDownValue);
        return;
      }
      // to filter the data based on Datasource
      const filteredApiData = Object.fromEntries(
        Object.entries(dropDownValues).filter(([_, data]) =>
          data.some((item) =>
            item.DataSource?.includes(
              savedDropdown?.[flag].selectedDropDownValue.DataSource
            )
          )
        )
      );
      setFilteredData(filteredApiData);
      return;
    }

    if (moduleColumns?.[flag]) {
      setSelectedValue({});
      handleDataSourceSelect("Call Activity");
    }
    setFilteredData(dropDownValues);
  }, [moduleColumns, flag, savedDropdown]);

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

  // function to get the values of Product Category Dropdown
  const getProductCategoryValues = (data) => {
    const productCategoryKeys = ["Regimen Category", "Product", "Regimen"];
    const result = [];

    productCategoryKeys.forEach((key) => {
      const uniqueValues = new Set();
      Object.values(data).forEach((dataArray) => {
        dataArray.forEach((item) => {
          if (item["Product Category"] && item["Product Category"][key]) {
            item["Product Category"][key].forEach((value) => {
              uniqueValues.add(value);
            });
          }
        });
      });

      result.push({
        option: key,
        values: Array.from(uniqueValues).sort(),
      });
    });

    return result;
  };

  // function to get the values of the next Dropdown
  const handleDropdownValue = (name, value, data) => {
    const index = dropDownNamesValuesOptions.findIndex(
      (item) => item.name === name
    );
    const nextDropdown = dropDownNamesValuesOptions[index + 1]?.name;

    if (!nextDropdown) {
      return;
    }

    if (nextDropdown === "Indication") {
      const filteredApiData = Object.fromEntries(
        Object.entries(dropDownValues).filter(([_, data]) =>
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

    if (nextDropdown === "Product Category") {
      const MultiSelectOptions = getProductCategoryValues(data);
      setDropDownNamesValuesOptions((prevState) =>
        prevState.map((item) =>
          item.name === nextDropdown
            ? { ...item, option: MultiSelectOptions }
            : item
        )
      );
      return;
    }

    const nextDropdownValue = getUniqueOptions(data, nextDropdown);
    setDropDownNamesValuesOptions((prevState) =>
      prevState.map((item) =>
        item.name === nextDropdown
          ? { ...item, option: nextDropdownValue }
          : item
      )
    );
  };

  // function to filter Data based on Default Indication only
  const filterDataWithDefaultIndication = (data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([, dataSource]) =>
        dataSource.some(
          (item) =>
            item.Indication &&
            Object.values(item.Indication)
              .flat()
              .some((v) => v.includes("(Default)"))
        )
      )
    );
  };

  // function to filter Data based on Indication selected in indication dropdown
  const filterDataByIndication = (indicationCriteria) => {
    if (!indicationCriteria) {
      if (
        flag === "usage-by-indication" ||
        flag === "usage-by-specialty" ||
        flag === "testing-rate"
      ) {
        const filterData = filterDataWithDefaultIndication(filteredData);
        return filterData;
      }
      return filteredData;
    }
    const results = {};
    const indications = Object.entries(indicationCriteria);
    indications.forEach(([key, val]) => {
      Object.keys(filteredData).forEach((dataKey) => {
        const dataSet = filteredData[dataKey];
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

  // function to handle single select dropdown change
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "DataSource") {
      handleDataSourceSelect(value);
    }
    const filterIndicationData = filterDataByIndication(
      selectedValue?.Indication
    );
    handleDropdownValue(name, value, filterIndicationData);
    const sortedSelectedValue = removeObjectValue(selectedValue, name, value);
    setSelectedValue(sortedSelectedValue);
  };

  // function to handle multi select & other dropdown change
  const handleChangeMultipleSelect = (name, value) => {
    if (name === "Indication") {
      const filterIndicationData = filterDataByIndication(value);
      handleDropdownValue(name, value, filterIndicationData);
      const sortedSelectedValue = removeObjectValue(selectedValue, name, value);
      setSelectedValue(sortedSelectedValue);
      return;
    }

    const filterIndicationData = filterDataByIndication(
      selectedValue?.Indication
    );
    handleDropdownValue(name, value, filterIndicationData);
    const sortedSelectedValue = removeObjectValue(selectedValue, name, value);
    setSelectedValue(sortedSelectedValue);
  };

  // function to handle enable/disable next dropdown based on current dropdown value
  const isDropdownDisabled = (index) => {
    if (index === 0) return false;
    const prevDropdownName = dropDownNamesValuesOptions[index - 1].name;
    return !selectedValue[prevDropdownName];
  };

  const transformData = (data) => {
    const payloadData = {};

    for (const key in data) {
      if (typeof data[key] === "string" || typeof data[key] === "number") {
        payloadData[key] = [data[key]];
      } else if (Array.isArray(data[key])) {
        payloadData[key] = data[key];
      } else if (typeof data[key] === "object" && data[key] !== null) {
        payloadData[key] = transformData(data[key]);
      } else {
        payloadData[key] = data[key];
      }
    }

    return payloadData;
  };

  const handleSubmit = async () => {
    const dropDownData = transformData(selectedValue);
    const payload = {
      Module: flag,
      Analytics_Section: "Execution Metrics",
      Selected_Filter2: dropDownData,
    };
    setShowLoader(true);

    const response = await DIGraphGenerateApi(payload);
    if (response?.data?.Graph_Data) {
      const savedData = {
        [flag]: {
          selectedDropDownValue: selectedValue,
          dropDownOptions: dropDownNamesValuesOptions,
          chartData: response.data,
        },
      };
      dispatch(
        setExecutionMetricsChartData({ ...savedDropdown, ...savedData })
      );
      setShowLoader(false);
      return;
    } else {
      toast.warning("No data to show for Selected filters");
      setShowLoader(false);
    }
  };

  const SubmitBtnDisable = () => {
    if (
      Object.keys(selectedValue).length ===
      Object.keys(dropDownNamesValuesOptions).length
    ) {
      return false;
    }
    return true;
  };

  // console.log("selectedValue", selectedValue);
  // console.log("dropDownNamesValuesOptions", dropDownNamesValuesOptions);

  return (
    <Stack
      justifyContent="space-between"
      direction="row"
      sx={{ ml: "256px", height: "11vh" }}
    >
      <Stack
        className="physician-analytics-indication-model"
        justifyContent="space-between"
        direction="row"
      >
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
            if (dropdown.type === "multiSelect") {
              return (
                <MultiSelectDropdown
                  key={dropdown.name}
                  dropDownValue={dropdown.option}
                  dropDownName={dropdown.name}
                  selectedValue={selectedValue?.[dropdown?.name] || []}
                  handleChange={handleChange}
                  disabled={isDropdownDisabled(index)}
                />
              );
            }
            if (dropdown.type === "multiSelectWithSingleOption") {
              return (
                <MultiSelectWithSingleOptionDropDown
                  key={dropdown.name}
                  dropDownValue={dropdown.option}
                  dropDownName={dropdown.name}
                  selectedValue={selectedValue?.[dropdown?.name] || []}
                  handleChange={handleChangeMultipleSelect}
                  disabled={isDropdownDisabled(index)}
                />
              );
            }
            if (dropdown.type === "singleSelectWithMultipleOption") {
              return (
                <SingleSelectWithMultipleOptionDropdown
                  key={dropdown.name}
                  dropDownValue={dropdown.option}
                  dropDownName={dropdown.name}
                  selectedValue={selectedValue?.[dropdown?.name] || []}
                  handleChange={handleChangeMultipleSelect}
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
        <Box sx={{ display: "flex", height: "37px" }}>
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
    </Stack>
  );
};

export default ExecutionMetricsIndication;
