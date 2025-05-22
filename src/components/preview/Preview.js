import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/Header";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownloadIcon from "@mui/icons-material/Download";
import { Button, TextField, Checkbox, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchDataAtom,
  addedDataAtom,
  deleteDataAtom,
  allTestingCodeRules,
  allComorbidCodeRules,
} from "../../atom";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import ConfirmationPopup from "./ConfirmationPopup";
import { startProcessApi } from "../../services";
import "./Preview.css";

const style = {
  selectFields: {
    mt: "10px",
    width: "28vw",
    background: "#f2f2f2",
    borderRadius: "5px",
    "& .MuiOutlinedInput-root": {
      height: "6.5vh",
      "& fieldset": {
        border: "1px solid #d8d8d8",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "black",
      opacity: 1,
    },
  },
  selectFields2: {
    mt: "10px",
    width: "63vw",
    background: "#f2f2f2",
    borderRadius: "5px",
    "& .MuiOutlinedInput-root": {
      height: "6.5vh",
      "& fieldset": {
        border: "1px solid #d8d8d8",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "black",
      opacity: 1,
    },
  },
  processBtn: {
    background: "#002060",
    textTransform: "capitalize",
    width: "135px",
    height: "6.2vh",
    marginRight: "10px",
    marginTop: "4px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#002060",
    },
  },
};

const Preview = () => {
  const topRef = useRef(null);
  const doc = new jsPDF();
  const navigate = useNavigate();
  const addedData = useAtomValue(addedDataAtom);
  const deleteData = useAtomValue(deleteDataAtom);
  const fetchData = useAtomValue(fetchDataAtom);
  const testingCodes = useAtomValue(allTestingCodeRules);
  const comorbidCodes = useAtomValue(allComorbidCodeRules);
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [versionDescription, setVersionDescription] = useState("");
  const [newVersionSwitchChecked, setNewVersionSwitchChecked] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [mbpreview, setMbpreview] = useState({
    MarketBasket: false,
    DiagnosisCode: false,
    SurgeryCode: false,
    MetastaticCode: false,
    TestingCode: false,
  });
  const [previewData, setPreviewData] = useState({
    MarketBasket: {
      text: "Market Basket",
      dataDetails: {
        "Total Products": fetchData.productName,
        "Added Products": addedData.products,
        "Deleted Products": deleteData.products,
      },
      onClick: () => handleClick("MarketBasket"),
    },
    DiagnosisCode: {
      text: "Diagnosis Code",
      dataDetails: {
        "Total Diagnosis Code": fetchData.diagnosisCode,
        "Added Diagnosis Code": addedData.diagnosisCode,
        "Deleted Diagnosis Code": deleteData.diagnosisCode,
      },
      onClick: () => handleClick("DiagnosisCode"),
    },
    SurgeryCode: {
      text: "Surgery Code",
      dataDetails: {
        "Total Surgery Code": fetchData.surgeryCode,
        "Added Surgery Code": addedData.surgeryCode,
        "Deleted Surgery Code": deleteData.surgeryCode,
      },
      onClick: () => handleClick("SurgeryCode"),
    },
    MetastaticCode: {
      text: "Metastatic Code",
      dataDetails: {
        "Total Metastatic Code": fetchData.metastaticCode,
        "Added Metastatic Code": addedData.metastaticCode,
        "Deleted Metastatic Code": deleteData.metastaticCode,
      },
      onClick: () => handleClick("MetastaticCode"),
    },
    TestingCode: {
      text: "Testing Code",
      dataDetails: {
        "Total Testing Code": testingCodes.map((item) => ({ [item]: "" })),
        "Added Testing Code": testingCodes
          .filter((item) => !fetchData.testingCode.includes(item))
          .map((item) => ({ [item]: "" })),
        "Deleted Testing Code": fetchData.testingCode
          .filter((item) => !testingCodes.includes(item))
          .map((item) => ({ [item]: "" })),
      },
      onClick: () => handleClick("TestingCode"),
    },
  });

  const handleGeneratePdf = () => {
    // Extract product names from fetchData
    const productNames = fetchData.productName.map(
      (item) => Object.keys(item)[0]
    );
    // Start at initial position
    let y = 10;
    // Add "Total Product" header
    doc.text("Total Product", 10, y);
    // Increase y position for next content
    y += 10;
    // Loop through each product name and add to the PDF
    doc.setFontSize(8);
    productNames.forEach((productName) => {
      doc.text(productName, 10, y);
      y += 10;
    });
    doc.save("download.pdf");
  };

  const handleClick = (key) => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setMbpreview((prevState) => ({
      MarketBasket: key === "MarketBasket" ? !prevState.MarketBasket : false,
      DiagnosisCode: key === "DiagnosisCode" ? !prevState.DiagnosisCode : false,
      SurgeryCode: key === "SurgeryCode" ? !prevState.SurgeryCode : false,
      MetastaticCode:
        key === "MetastaticCode" ? !prevState.MetastaticCode : false,
      TestingCode: key === "TestingCode" ? !prevState.TestingCode : false,
    }));
  };

  useEffect(() => {
    if (fetchData.selectedVersion.length === 0) {
      setNewVersionSwitchChecked(true);
    }
    const handleLoad = () => {
      if (localStorage.getItem("wasloaded") === "true") {
        navigate("/businessRules/marketBasket");
      }
      localStorage.setItem("wasloaded", "true");
    };
    handleLoad();

    // Clean up event listeners on component unmount
    return () => {
      localStorage.removeItem("wasloaded");
    };
  }, []);

  const PreviewDataApi = async () => {
    const productName = fetchData.productName.map((item) => {
      const key = Object.keys(item)[0];
      return key;
    });

    const DiagnosisCode = fetchData.diagnosisCode.map((item) => {
      const key = Object.keys(item)[0];
      return key;
    });

    const SurgeryCode = fetchData.surgeryCode.map((item) => {
      const key = Object.keys(item)[0];
      return key;
    });
    const metastaticCode = fetchData.metastaticCode.map((item) => {
      const key = Object.keys(item)[0];
      return key;
    });

    const payload = {
      Indication: fetchData.selectedIndication,
      Version: fetchData.selectedVersion,
      Data: {
        Product_Name: productName,
        Diagnosis_code: DiagnosisCode,
        Lot: fetchData.LOT,
        Surgery_code: SurgeryCode,
        Metastatic_code: metastaticCode,
        testing_code: testingCodes,
        comorbid_code: comorbidCodes,
      },
      Current_default_version: fetchData.finalVersionName[0],
      New_Version: newVersionSwitchChecked,
      New_Version_Name: versionName,
      Make_default: defaultChecked,
    };
    navigate("/businessRules/marketBasket");
    toast.info(
      "Data is being processed and you will be notified by mail once it's done."
    );

    await startProcessApi(payload);
  };

  const checkForChanges = (data) => {
    return Object.values(data).every(({ dataDetails }) => {
      const changes = Object.keys(dataDetails).filter(
        (key) => key.startsWith("Added") || key.startsWith("Deleted")
      );
      return changes.every((key) => dataDetails[key].length === 0);
    });
  };

  const checkNameExists = () =>
    fetchData?.version.some(
      (version) =>
        version.replace(/\(Default\)$/, "").toLowerCase() ===
        versionName.toLowerCase()
    );

  const handleNameCheck = () => {
    const regex = /^[a-zA-Z0-9_ ]+$/;
    return regex.test(versionName);
  };

  const handleProcess = () => {
    if (
      checkForChanges(previewData) &&
      !newVersionSwitchChecked &&
      fetchData.dayDiff < 7
    ) {
      setConfirmationPopup(true);
      return;
    }
    if (!newVersionSwitchChecked) {
      PreviewDataApi();
      return;
    }
    if (newVersionSwitchChecked && versionName.length === 0) {
      toast.error("Please write a version name", {
        autoClose: 1000,
      });
      return;
    }

    const versionNameExists = checkNameExists();
    const nameCheck = handleNameCheck();

    if (!nameCheck) {
      toast.error(
        "Version name Should not have special characters except underscores",
        {
          autoClose: 1000,
        }
      );
      return;
    }

    if (versionNameExists) {
      toast.error("Version name already exists", {
        autoClose: 1000,
      });
      return;
    }
    PreviewDataApi();
  };

  const handleConfirmationSubmit = () => {
    PreviewDataApi();
    setConfirmationPopup(false);
  };

  const handleConfirmationClose = () => {
    setConfirmationPopup(false);
  };
  return (
    <>
      <Header />
      <div className="preview-model">
        <div ref={topRef} className="preview-box">
          {Object.entries(previewData).map(([key, item]) => (
            <div className="preview-content" key={key}>
              <div
                className="preview-header"
                onClick={() => {
                  item.onClick();
                }}
              >
                <h4>{item.text}</h4>
                {!mbpreview?.[key] && <KeyboardArrowDownIcon />}
                {mbpreview?.[key] && <KeyboardArrowUpIcon />}
              </div>
              {mbpreview?.[key] && (
                <div className="preview-data" key={key}>
                  <div className="preview-data-card-model">
                    {/* Map the card here */}
                    {Object.entries(item.dataDetails).map(([dataKey, data]) => (
                      <div className="preview-data-card">
                        <div className="preview-data-card-value">
                          <h5>{data?.length}</h5>
                          <KeyboardArrowRightIcon
                            sx={{
                              ml: "150px",
                              color: "rgb(122, 122, 121)",
                              fontSize: "30px",
                            }}
                          />
                        </div>
                        <div className="preview-card-data">
                          <h4>{dataKey}</h4>
                          <h5>Market scanner</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* map the product data box , added product, remove product, total product */}
                  <div className="preview-data-list-model">
                    {Object.entries(item.dataDetails).map(([dataKey, data]) => (
                      <div className="preview-data-list">
                        <h4>{`${dataKey}(${data.length})`}</h4>
                        <div className="preview-list-data">
                          {data.map((item) => {
                            const key = Object.keys(item)[0];
                            const value = item[key];
                            return <h6>{key}</h6>;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="preview-option-model">
            <div className="preview-option-switch">
              <Switch
                checked={
                  fetchData.selectedVersion.length === 0
                    ? true
                    : newVersionSwitchChecked
                }
                onChange={(event) => {
                  if (fetchData.selectedVersion.length === 0) {
                    return;
                  }
                  setNewVersionSwitchChecked(event.target.checked);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
              {newVersionSwitchChecked ? (
                <h5>Make a new version</h5>
              ) : (
                <h5>Overwrite the current version</h5>
              )}
            </div>
            {newVersionSwitchChecked && (
              <div className="preview-textfield-box">
                <div className="preview-textfield">
                  <h5>Version Name</h5>
                  <TextField
                    sx={style.selectFields}
                    id="outlined-textarea"
                    // placeholder="Enter Version"
                    placeholder={"Enter Version"}
                    size="small"
                    value={versionName}
                    onChange={(e) => {
                      setVersionName(e.target.value);
                    }}
                    name="version"
                  />
                </div>
                <div className="preview-textfield-2">
                  <h5>Description</h5>
                  <TextField
                    sx={style.selectFields2}
                    id="outlined-textarea"
                    placeholder={"Enter Description"}
                    size="small"
                    value={versionDescription}
                    onChange={(e) => {
                      setVersionDescription(e.target.value);
                    }}
                    name="version"
                  />
                </div>
              </div>
            )}
            <div className="preview-checkbox-model">
              <div className="preview-check-box">
                <Checkbox
                  checked={
                    fetchData.selectedVersion.length === 0
                      ? true
                      : defaultChecked
                  }
                  onChange={(event) => {
                    if (fetchData.selectedVersion.length === 0) {
                      return;
                    }
                    setDefaultChecked(event.target.checked);
                  }}
                />
                <h5>Make as default version</h5>
              </div>
            </div>
            <div className="preview-btn-box">
              <Button
                variant="contained"
                sx={style.processBtn}
                onClick={handleProcess}
              >
                Start Process
              </Button>
              <Button
                variant="contained"
                sx={style.processBtn}
                onClick={() => {
                  navigate("/businessRules/marketBasket");
                }}
              >
                Back
              </Button>
              {/* <DownloadIcon
                sx={{ fontSize: "32px", ml: "20px", cursor: "pointer" }}
                onClick={handleGeneratePdf}
              /> */}
            </div>
          </div>
        </div>
      </div>
      {confirmationPopup && (
        <ConfirmationPopup
          open={confirmationPopup}
          close={handleConfirmationClose}
          submit={handleConfirmationSubmit}
        />
      )}
    </>
  );
};

export default Preview;
