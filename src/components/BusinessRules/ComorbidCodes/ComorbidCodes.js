import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Tooltip,
  Checkbox,
  Button,
} from "@mui/material";
import { fetchDataAtom, allComorbidCodeRules } from "../../../atom";
import { useAtom, useAtomValue } from "jotai";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Validation from "../../../validation/Validation";
import { toast } from "react-toastify";
import "./ComorbidCodes.css";

const style = {
  text: {
    fontSize: "18px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  insideText: {
    fontSize: "14px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
    width: "28vw",
    paddingRight: "8px",
  },
  autoCompleteTypeFields: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    marginTop: "10px",
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
  icon: {
    fontSize: "16px",
    mr: "6px",
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
    cursor: "pointer",
    color: "#aaaaaa",
    "&:hover": {
      color: "black",
    },
  },
  selectBtn: {
    background: "#002060",
    textTransform: "capitalize",
    width: "94px",
    height: "5vh",
    mt: "8px",
    fontSize: "10px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#002060",
    },
  },
  textCancelIcon: {
    marginLeft: "4px",
    fontSize: "14px",
    cursor: "pointer",
  },
  addedText: {
    fontSize: "14px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
  },
};

const ComorbidCodes = () => {
  const comorbidData = useAtomValue(fetchDataAtom);
  const [testingCodes, setTestingCodes] = useState([]);
  const [selectedtestingCodes, setSelectedTestingCodes] = useState([]);
  const [testingType, setTestingType] = useState("");
  const [shownCode, setShownCode] = useState([]);
  const [testingCodeRules, setTestingCodeRules] = useAtom(allComorbidCodeRules);
  const [editTestingCodeIndex, setEditTestingCodeIndex] = useState();
  const [error, setError] = useState({});
  const [inputValue, setInputValue] = useState("");

  const rows = comorbidData.diagnosisCode.map((item) => Object.keys(item)[0]);

  useEffect(() => {
    const rows = comorbidData.diagnosisCode.map((item) => Object.keys(item)[0]);
    setShownCode(rows);
  }, []);

  const generateQuery = () => {
    if (testingCodes.length === 0 || testingType.trim() === "") {
      const data = {
        testingCodes: testingCodes,
        testingType: testingType,
      };
      const newError = Validation(data);
      if (newError) {
        setError(newError);
        console.log(error);
      }
      return;
    } else {
      const codeSentence = `Comorbid Codes in (${testingCodes
        .map((code) => `${code}`)
        .join(", ")}) THEN Comorbid Type is ${testingType}`;

      if (
        testingCodeRules.some(
          (item) => item.toLowerCase() === codeSentence.toLowerCase()
        )
      ) {
        toast.error("Comorbid Code already exist!", {
          autoClose: 1000,
        });
        return;
      }
      setTestingCodeRules((prev) => [codeSentence, ...prev]);

      if (editTestingCodeIndex) {
        const editedCode = testingCodeRules;
        editedCode.splice(editTestingCodeIndex, 0, codeSentence);
        setTestingCodeRules(editedCode);
        setEditTestingCodeIndex();
      } else {
        setTestingCodeRules([codeSentence, ...testingCodeRules]);
      }
      setTestingCodes([]); // Clear selected codes
      setTestingType(""); // Clear the group by text box
      setError({});
    }
    setShownCode(rows);
  };

  const handleDelete = (data) => {
    const filteredTestingCodes = testingCodeRules.filter(
      (item) => item !== data
    );
    setTestingCodeRules(filteredTestingCodes);
  };

  const handleEdit = (index) => {
    // Match content inside the round brackets
    const bracketMatch = testingCodeRules[index].match(/\(([^)]+)\)/);
    const valuesInBrackets = bracketMatch
      ? bracketMatch[1]
          .split(",")
          .map((value) => value.trim().replace(/"/g, "")) // Split by comma and remove extra spaces and quotes
      : [];

    // Match the last quoted value (outside brackets)
    const lastQuoteMatch = testingCodeRules[index].match(
      /THEN Testing Type is ([^\s]+)/
    );
    const lastValue = lastQuoteMatch ? lastQuoteMatch[1] : null;

    setTestingCodes(valuesInBrackets);
    setTestingType(lastValue);
    setEditTestingCodeIndex(index);
    handleDelete(testingCodeRules[index]);
  };

  const handleInputChange = (event, newInputValue) => {
    if (newInputValue !== "") {
      setInputValue(newInputValue);
      const filteredOptions = shownCode.filter((option) =>
        option?.toLowerCase().includes(newInputValue?.toLowerCase())
      );
      setSelectedTestingCodes(filteredOptions);
      return;
    }
    if (
      (event === null && newInputValue === "") ||
      event._reactName === "onBlur"
    ) {
      return;
    } else if (event.type !== "click" && newInputValue === "") {
      setInputValue("");
      setSelectedTestingCodes([]);
    }
  };

  const handleSelectCode = () => {
    const result = shownCode.filter(
      (item) => !selectedtestingCodes.includes(item)
    );
    setTestingCodes((prev) => [...prev, ...selectedtestingCodes]);
    setSelectedTestingCodes([]);
    setInputValue("");
    setShownCode(result);
  };

  const handleRemoveCode = (code) => {
    const result = testingCodes.filter((item) => item !== code);
    setTestingCodes(result);
    setShownCode((prev) => [...prev, code]);
    setSelectedTestingCodes([]);
    setInputValue("");
  };

  return (
    <Stack className="testing-code-model">
      <Stack direction="row" className="testing-code-box">
        <Stack className="testing-code-table-model">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="testing-code-title-box"
          >
            <Typography sx={style.text}>
              Comorbid Codes({rows?.length})
            </Typography>
          </Stack>

          {/* CustomDataGrid for Table Representation */}

          <Stack
            sx={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            direction="row"
          >
            <Stack className="testing-code-selection-box">
              <Typography sx={style.insideText}>Comorbid Codes</Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ border: "1px soild black" }}
              >
                <Autocomplete
                  id="testing-auto-complete"
                  options={shownCode}
                  getOptionLabel={(option) => option}
                  disableCloseOnSelect
                  multiple
                  disablePortal
                  value={selectedtestingCodes}
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                  isOptionEqualToValue={(option, value) => option === value}
                  sx={style.autocomplete}
                  onChange={(event, newValue) => {
                    setSelectedTestingCodes(newValue);
                  }}
                  renderTags={() => ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ ...style.autoCompleteTypeFields, width: "335px" }}
                      size="small"
                      label={
                        selectedtestingCodes.length === 0
                          ? "Search"
                          : `Search ${selectedtestingCodes.length} Testing Codes Found`
                      }
                    />
                  )}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option}
                      </li>
                    );
                  }}
                />
                <Button
                  variant="contained"
                  sx={style.selectBtn}
                  onClick={() => handleSelectCode()}
                >
                  Select code
                </Button>
              </Stack>
              {error.testingCodes && (
                <h5 className="error">{error.testingCodes}</h5>
              )}

              <Stack
                className="add-testing-box"
                direction="row"
                alignItems="flex-start"
                alignContent="start"
              >
                {/* Map the Added Product/Code */}
                {testingCodes.length === 0 && (
                  <Typography sx={{ ...style.addedText, color: "#979797" }}>
                    No code Selected
                  </Typography>
                )}
                {testingCodes &&
                  testingCodes.map((code, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      className="added-text-box"
                    >
                      <Typography sx={style.addedText}>{code}</Typography>
                      <CloseIcon
                        sx={style.textCancelIcon}
                        onClick={() => handleRemoveCode(code)}
                      />
                    </Stack>
                  ))}
              </Stack>

              <Typography sx={{ ...style.insideText, mt: "10px" }}>
                Group By
              </Typography>
              <TextField
                sx={style.autoCompleteTypeFields}
                size="small"
                placeholder="Enter a Group By Name"
                value={testingType}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    generateQuery();
                  }
                }}
                onChange={(event) => {
                  setTestingType(event.target.value);
                }}
              />
              {error.testingType && (
                <h5 className="error">{error.testingType}</h5>
              )}
            </Stack>
            <Box className="testing-code-add-btn">
              <h5 className="testing-code-add-btn-text" onClick={generateQuery}>
                Add &gt;&gt;
              </h5>
            </Box>
            <Stack className="testing-code-selection-box">
              {testingCodeRules && testingCodeRules?.length === 0 ? (
                <h2>Added Comorbid Codes and types will be shown here</h2>
              ) : (
                testingCodeRules?.map((data, index) => (
                  <Box className="testing-code-added-box" id={index}>
                    <Typography sx={style.insideText}>{data}</Typography>
                    <Stack direction="row">
                      <Tooltip title="Edit" placement="top">
                        <EditIcon
                          sx={index === 1 ? style.icon2 : style.disableIcon2}
                          onClick={() => handleEdit(index)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <CloseIcon
                          sx={style.icon}
                          onClick={() => handleDelete(data)}
                        />
                      </Tooltip>
                    </Stack>
                  </Box>
                ))
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ComorbidCodes;
