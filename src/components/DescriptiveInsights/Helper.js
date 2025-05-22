export const databasesMenu = [
  { value: "Patient_Analytics", label: "Patient Analytics" },
  { value: "Physician_Analytics", label: "Physician Analytics" },
  { value: "Smart_Alert_Analytics", label: "Smart Alert Analytics" },
  { value: "Execution_Metrics", label: "Execution Metrics" },
  { value: "Adhocs", label: "Adhocs" }
];

export const handleDropdownChange = (event, navigate) => {
  const value = event.target.value;
  if (value === "Patient_Analytics") {
    navigate("/descriptiveInsights/patientAnalytics/dot");
    return;
  }
  if (value === "Physician_Analytics") {
    navigate("/descriptiveInsights/physicianAnalytics/initiator-&-repeator");
  }
  if (value === "Smart_Alert_Analytics") {
    navigate("/descriptiveInsights/smartAlertAnalytics/trigger-analysis");
    return;
  }
  if (value === "Execution_Metrics") {
    navigate("/descriptiveInsights/executionMetrics/reach");
    return;
  }
  if (value === "Adhocs") {
    navigate("/descriptiveInsights/adhocs");
    return;
  }
};

export const filterReportData = (
  reportSelectedValue,
  reportDropdownValue,
  reportData,
  flag
) => {
  const reportedSelectedValue = reportSelectedValue;
  const reportedDropDownValue = reportDropdownValue;
  let reportedData = Object.fromEntries(
    Object.entries(reportData).filter(([_, data]) =>
      data.some((item) =>
        item.DataSource?.includes(reportedSelectedValue.DataSource)
      )
    )
  );

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

  const filterDataByIndication = (indicationCriteria) => {
    if (!indicationCriteria) {
      if (
        flag === "usage-by-indication" ||
        flag === "usage-by-specialty" ||
        flag === "testing-rate"
      ) {
        const filterData = filterDataWithDefaultIndication(reportedData);
        return filterData;
      }
      return reportedData;
    }
    const results = {};
    const indications = Object.entries(indicationCriteria);
    indications.forEach(([key, val]) => {
      Object.keys(reportedData).forEach((dataKey) => {
        const dataSet = reportedData[dataKey];
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

  const handleDropdownValue = (name, value, data) => {
    const index = reportedDropDownValue.findIndex((item) => item.name === name);
    const nextDropdown = reportedDropDownValue[index + 1]?.name;

    if (!nextDropdown) {
      return;
    }

    if (nextDropdown === "Indication") {
      const filteredApiData = Object.fromEntries(
        Object.entries(reportedData).filter(([_, data]) =>
          data.some((item) => item.DataSource?.includes(value))
        )
      );
      data = filteredApiData;
      const MultiSelectOptions = getIndicationValues(
        nextDropdown,
        filteredApiData
      );

      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = MultiSelectOptions;
      }
      return;
    }

    if (nextDropdown === "Product Category") {
      const MultiSelectOptions = getProductCategoryValues(data);
      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = MultiSelectOptions;
      }
      return;
    }

    const nextDropdownValue = getUniqueOptions(data, nextDropdown);
    const indication = reportedDropDownValue.find(
      (item) => item.name === nextDropdown
    );
    if (indication) {
      indication.option = nextDropdownValue;
    }
    return;
  };

  for (const [key, value] of Object.entries(reportedSelectedValue)) {
    // if (key === "DataSource") continue;
    const filterIndicationData = filterDataByIndication(
      reportedSelectedValue?.Indication
    );
    handleDropdownValue(key, value, filterIndicationData);
  }

  return { reportedSelectedValue, reportedDropDownValue, reportedData };
};

export const filterReportDataExecutionMetrics = (
  reportSelectedValue,
  reportDropdownValue,
  reportData,
  flag
) => {
  const reportedSelectedValue = reportSelectedValue;
  const reportedDropDownValue = reportDropdownValue;
  let reportedData = Object.fromEntries(
    Object.entries(reportData).filter(([_, data]) =>
      data.some((item) =>
        item.DataSource?.includes(reportedSelectedValue.DataSource)
      )
    )
  );

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

  const filterDataByIndication = (indicationCriteria) => {
    if (!indicationCriteria) {
      if (
        flag === "usage-by-indication" ||
        flag === "usage-by-specialty" ||
        flag === "testing-rate"
      ) {
        const filterData = filterDataWithDefaultIndication(reportedData);
        return filterData;
      }
      return reportedData;
    }
    const results = {};
    const indications = Object.entries(indicationCriteria);
    indications.forEach(([key, val]) => {
      Object.keys(reportedData).forEach((dataKey) => {
        const dataSet = reportedData[dataKey];
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

  const handleDropdownValue = (name, value, data) => {
    const index = reportedDropDownValue.findIndex((item) => item.name === name);
    const nextDropdown = reportedDropDownValue[index + 1]?.name;

    if (!nextDropdown) {
      return;
    }

    if (nextDropdown === "Indication") {
      const filteredApiData = Object.fromEntries(
        Object.entries(reportedData).filter(([_, data]) =>
          data.some((item) => item.DataSource?.includes(value))
        )
      );
      data = filteredApiData;
      const MultiSelectOptions = getIndicationValues(
        nextDropdown,
        filteredApiData
      );

      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = MultiSelectOptions;
      }
      return;
    }

    const nextDropdownValue = getUniqueOptions(data, nextDropdown);
    const indication = reportedDropDownValue.find(
      (item) => item.name === nextDropdown
    );
    if (indication) {
      indication.option = nextDropdownValue;
    }
    return;
  };

  for (const [key, value] of Object.entries(reportedSelectedValue)) {
    // if (key === "DataSource") continue;
    const filterIndicationData = filterDataByIndication(
      reportedSelectedValue?.Indication
    );
    handleDropdownValue(key, value, filterIndicationData);
  }

  return { reportedSelectedValue, reportedDropDownValue, reportedData };
};

export const filterReportPhysicianAnalytics = (
  reportSelectedValue,
  reportDropdownValue,
  reportData,
  flag
) => {
  const reportedSelectedValue = reportSelectedValue;
  const reportedDropDownValue = reportDropdownValue;
  let reportedData = Object.fromEntries(
    Object.entries(reportData).filter(([_, data]) =>
      data.some((item) =>
        item.DataSource?.includes(reportedSelectedValue.DataSource)
      )
    )
  );
  //   return Object.fromEntries(
  //     Object.entries(data).filter(([, dataSource]) =>
  //       dataSource.some(
  //         (item) =>
  //           item.Indication &&
  //           Object.values(item.Indication)
  //             .flat()
  //             .some((v) => v.includes("(Default)"))
  //       )
  //     )
  //   );
  // };

  const filterDataByIndication = (indicationCriteria) => {
    if (!indicationCriteria) {
      return reportedData;
    }
    const results = {};
    const indications = Object.entries(indicationCriteria);
    indications.forEach(([key, val]) => {
      Object.keys(reportedData).forEach((dataKey) => {
        const dataSet = reportedData[dataKey];
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

  const handleTerritoryDropdownValue = (data, values) => {
    const results = [];
    const search = (obj) =>
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && !Array.isArray(value)) search(value);
        else if (values.includes(key)) results.push(...value);
      });
    search(data);
    return results;
  };

  const handleDropdownValue = (name, value, data) => {
    const index = reportedDropDownValue.findIndex((item) => item.name === name);
    const nextDropdown = reportedDropDownValue[index + 1]?.name;

    if (!nextDropdown) {
      return;
    }

    if (nextDropdown === "Indication") {
      const filteredApiData = Object.fromEntries(
        Object.entries(reportedData).filter(([_, data]) =>
          data.some((item) => item.DataSource?.includes(value))
        )
      );
      data = filteredApiData;
      const MultiSelectOptions = getIndicationValues(
        nextDropdown,
        filteredApiData
      );

      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = MultiSelectOptions;
      }
      return;
    }

    if (nextDropdown === "Product Category") {
      const MultiSelectOptions = getProductCategoryValues(data);
      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = MultiSelectOptions;
      }
      return;
    }

    if (nextDropdown === "Area") {
      const keys = Object.keys(data);
      const geographicalData = data?.[keys[0]].find((item) => item.Area)
        ?.Area[0];
      const areaData = Object.keys(geographicalData);
      console.log("areaData", areaData);
      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      console.log("indication", indication);
      if (indication) {
        indication.option = areaData;
      }
      return;
    }

    if (nextDropdown === "Region") {
      const keys = Object.keys(data);
      const geographicalData = data?.[keys[0]].find((item) => item.Area)
        ?.Area[0];
      const result = value.flatMap((key) =>
        geographicalData[key] ? Object.keys(geographicalData[key]) : []
      );
      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = result;
      }
      return;
    }

    if (nextDropdown === "Territory") {
      const keys = Object.keys(data);
      const geographicalData = data?.[keys[0]].find((item) => item.Area)
        ?.Area[0];
      const filteredGeographicalData = reportedSelectedValue.Area.reduce(
        (obj, key) => {
          if (geographicalData[key]) obj[key] = geographicalData[key];
          return obj;
        },
        {}
      );

      const territoryValue = handleTerritoryDropdownValue(
        filteredGeographicalData,
        value
      );

      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = territoryValue;
      }
      return;
    }

    const nextDropdownValue = getUniqueOptions(data, nextDropdown);
    const indication = reportedDropDownValue.find(
      (item) => item.name === nextDropdown
    );
    if (indication) {
      indication.option = nextDropdownValue;
    }
    return;
  };

  for (const [key, value] of Object.entries(reportedSelectedValue)) {
    // if (key === "DataSource") continue;
    const filterIndicationData = filterDataByIndication(
      reportedSelectedValue?.Indication
    );
    handleDropdownValue(key, value, filterIndicationData);
  }

  return { reportedSelectedValue, reportedDropDownValue, reportedData };
};

export const filterReportSmartAlertAnalytics = (
  reportSelectedValue,
  reportDropdownValue,
  reportData,
  flag
) => {
  const reportedSelectedValue = reportSelectedValue;
  const reportedDropDownValue = reportDropdownValue;
  let reportedData = Object.fromEntries(
    Object.entries(reportData).filter(([_, data]) =>
      data.some((item) =>
        item.DataSource?.includes(reportedSelectedValue.DataSource)
      )
    )
  );

  const filterDataByIndication = (indicationCriteria) => {
    if (!indicationCriteria) {
      return reportedData;
    }
    const results = {};
    const indications = Object.entries(indicationCriteria);
    indications.forEach(([key, val]) => {
      Object.keys(reportedData).forEach((dataKey) => {
        const dataSet = reportedData[dataKey];
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

  const getProductCategoryValues = (data) => {
    const productCategoryKeys = ["Base Lot", "Condition", "Product"];
    const result = [];

    productCategoryKeys.forEach((key) => {
      const uniqueValues = new Set();
      Object.values(data).forEach((dataArray) => {
        dataArray.forEach((item) => {
          if (item["Label"] && item["Label"][key]) {
            item["Label"][key].forEach((value) => {
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

  const handleDropdownValue = (name, value, data) => {
    const index = reportedDropDownValue.findIndex((item) => item.name === name);
    const nextDropdown = reportedDropDownValue[index + 1]?.name;

    if (!nextDropdown) {
      return;
    }

    if (nextDropdown === "Indication") {
      const filteredApiData = Object.fromEntries(
        Object.entries(reportedData).filter(([_, data]) =>
          data.some((item) => item.DataSource?.includes(value))
        )
      );
      data = filteredApiData;
      const MultiSelectOptions = getIndicationValues(
        nextDropdown,
        filteredApiData
      );

      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = MultiSelectOptions;
      }
      return;
    }

    if (nextDropdown === "Label") {
      const MultiSelectOptions = getProductCategoryValues(data);
      const indication = reportedDropDownValue.find(
        (item) => item.name === nextDropdown
      );
      if (indication) {
        indication.option = MultiSelectOptions;
      }
      return;
    }

    const nextDropdownValue = getUniqueOptions(data, nextDropdown);
    const indication = reportedDropDownValue.find(
      (item) => item.name === nextDropdown
    );
    if (indication) {
      indication.option = nextDropdownValue;
    }
    return;
  };

  for (const [key, value] of Object.entries(reportedSelectedValue)) {
    // if (key === "DataSource") continue;
    const filterIndicationData = filterDataByIndication(
      reportedSelectedValue?.Indication
    );
    handleDropdownValue(key, value, filterIndicationData);
  }

  return { reportedSelectedValue, reportedDropDownValue, reportedData };
};

//function to convert the data into the format required by the chart
export const processChartData = (Graph_Data, Graph_Dimension, chartType,Title) => {
  const extractKeys = () => {
    const dimensions = Graph_Dimension?.reduce((acc, dim) => {
      Object.keys(dim).forEach((key) => {
        acc[key] = dim[key];
      });
      return acc;
    }, {});

    return {
      xKey: dimensions?.Xaxis,
      yKey: dimensions?.Yaxis,
      legendKey: dimensions?.Legend,
    };
  };

  const keys = extractKeys(Graph_Data, Graph_Dimension);

  const legends = [...new Set(Graph_Data?.map((item) => item[keys.legendKey]))];

  //custom colors
  const colors = [
    "#002060",
    "#00B0F0",
    "#005878",
    "#0070C0",
    "#A4DBDD",
    "#7F7f7F",
    "#26B170",
    "#004B7E",
    "#5DD4FF",
    "#7ED348",
    "#00B050",
  ];

  const datasets = legends.map((legend, index) => {
    const dataPoints = Graph_Data.filter(
      (item) => item[keys.legendKey] === legend
    ).map((item) => item[keys.yKey]);

    // Cycle through colors if there are more legends than colors
    const color = colors[index % colors.length];

    return {
      label: `${legend}`,
      data: dataPoints,
      fill: chartType === "Area" || chartType === "100% Stack",
      borderColor: color,
      backgroundColor:
        chartType === "100% Stack"
          ? color
          : chartType === "Area"
          ? `${color}33` // 33 for semi-transparent Area
          : undefined,
      borderWidth: chartType === "100% Stack" ? 0 : 1.5,
      pointRadius: 2.5, // Larger points for clarity
      pointHoverRadius: 4, // Hover effect
    };
  });

  const labels = [...new Set(Graph_Data?.map((item) => item[keys.xKey]))];
console.log(Title);

  return {
    title: Title,
    labels: labels,
    datasets: datasets,
    chartType: chartType,
    options: {
      scales:
        chartType === "100% Stack"
          ? {
              x: {
                stacked: true,
                title: {
                  display: true,
                  text: Graph_Dimension?.find((d) => d.Xaxis)?.Xaxis,
                },
              },
              y: {
                stacked: true,
                ticks: { callback: (value) => `${value}%` },
                title: {
                  display: true,
                  text: Graph_Dimension?.find((d) => d.Yaxis)?.Yaxis,
                },
              },
            }
          : {
              x: {
                title: {
                  display: true,
                  text: Graph_Dimension?.find((d) => d.Xaxis)?.Xaxis,
                },
              },
              y: {
                title: {
                  display: true,
                  text: Graph_Dimension?.find((d) => d.Yaxis)?.Yaxis,
                },
              },
            },
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            usePointStyle: true, // Use point style for custom legend look
            boxWidth: 14, // Adjust circle width (default is 40)
            boxHeight: 8, // Adjust circle height (optional, sets it to a rectangle if modified)
            padding: 10, // Space between legend items
            generateLabels: (chart) => {
              const labels = chart.data.datasets.map((dataset, i) => {
                return {
                  text: dataset.label,
                  fillStyle: dataset.borderColor,
                  hidden: !chart.isDatasetVisible(i),
                  datasetIndex: i,
                  pointStyle: "circle", // Set to 'line' to use line style in legend
                };
              });
              return labels;
            },
          },
        },
      },
    },
  };
};
