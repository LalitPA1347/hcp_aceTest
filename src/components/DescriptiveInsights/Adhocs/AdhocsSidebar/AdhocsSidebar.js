import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  IconButton,
  Box,
} from "@mui/material";
import "../AdhocsSidebar/AdhocsSidebar.css";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AdhocsMultiSelectDropdown from "../../../Common/DropDown/AdhocsMultiSelectDropdown";
// import Header from "../../../../Header/Header";
// import IndicationUi from "../../../../BusinessRules/IndicationUi/IndicationUi";
import AdhocsIndication from "../AdhocsIndication/AdhocsIndication";
import { fetchDescriptiveInsightsApi } from "../../../../services";
// import AdhocsIndiction2 from "./AdhocsIndiction2";

const AdhocsSidebar = () => {
  const [selectedValue, setSelectedValue] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [droppedItems, setDroppedItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [databasesMenu] = useState([
    "PatCount",
    "HCPCount",
    "NRx",
    "TRx",
    "NBRx",
    "SalesUnits",
    "HCPList",
  ]);
  const HCPList = [
    "Setting",
    "Territory",
    "Specialty",
    "YrsOfPractice",
    "AgeGroup",
    "Gender",
    "IsTarget",
    "Loyalist",
    "NPI",
    "Name",
    "BHID/BPID/InternalID",
  ];

  const patientList = ["AgeGroup", "Gender", "Biomarker Setting"];

  const dataSource = [
    "Xponent",
    "SHS Phast",
    "IQVIAClaims",
    "SHS Claims",
    "DDD",
    "NSP",
    "NPA",
    "SubnationalReport",
  ];

  const accordionConfig = [
    { key: "hcp", title: "HCP Profile", options: HCPList },
    { key: "Patient", title: "Patient Profile", options: patientList },
    { key: "Account", title: "Account", options: HCPList },
    { key: "Datasources", title: "Datasources", options: dataSource },
  ];
   
  const handlePhysicianAnalyticsApi = async () => {
      const payload = {
        Analytics_Section: "Adhocs",
      };
      // setShowLoader(true);
      const response = await fetchDescriptiveInsightsApi(payload);
      if (response) {
        console.log("response",response)
        // setShowLoader(false);
      }
      // setShowLoader(false);
    };
  
    useEffect(() => {
        handlePhysicianAnalyticsApi();
    }, []);

  //isExpanded boolean provided by the Accordion
  const handleAccordionToggle = (panel) => (event, isExpanded) => {
    if (selectedValue.length === 0) {
      toast.warning("Select Matrics To Apply Filter", {
        autoClose: 1000,
      });
      return;
    }
    setExpandedPanel(isExpanded ? panel : null);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedValue(typeof value === "string" ? value.split(",") : value);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text", item);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text");
    setCurrentItem(item);
    if (item && !droppedItems.includes(item)) {
      setDroppedItems([...droppedItems, item]);
    }
    setShowPopup(true);
  };

  // const handleDragOver = (e) => {
  //   e.preventDefault();
  // };

  const removeItem = (item) => {
    setDroppedItems(droppedItems.filter((i) => i !== item));
    setShowPopup(false);
  };

  return (
    <Stack sx={{ background :' #f5f7fa', height:'88vh' }} >
      <Stack className="sidebar-model-adhocs">
        <Box sx={{ ml: "20px" }}>
          <AdhocsMultiSelectDropdown
            key={"Metrics"}
            dropDownValue={databasesMenu}
            dropDownName={"Select Metrics"}
            selectedValue={selectedValue}
            handleChange={handleChange}
          />
        </Box>
        <Stack className="Accordian-allignment">
          <Typography component="span" sx={{ fontSize: "18px" }}>
            Filters
          </Typography>
          <Stack sx={{ height: "65vh", overflowY: "auto" }}>
            {accordionConfig.map(({ key, title, options }) => (
              <Accordion
                key={key}
                expanded={expandedPanel === key}
                onChange={handleAccordionToggle(key)}
                sx={{
                  boxShadow: "none",
                  border: "none",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  className="accordianSummery"
                  expandIcon={
                    <IconButton size="small" sx={{ paddingRight: "0px" }}>
                      {expandedPanel === key ? <RemoveIcon /> : <AddIcon />}
                    </IconButton>
                  }
                  aria-controls={`${key}-content`}
                  id={`${key}-header`}
                  sx={{
                    minHeight: "32px", 
                    "&.Mui-expanded": {
                      minHeight: "32px", 
                    },
                    "& .MuiAccordionSummary-content": {
                      margin: "0px 0", 
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    {title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    paddingTop: "0px",
                    paddingBottom: "0px",
                  }}
                >
                  <FormGroup>
                    {options.map((option) => (
                      <div
                        key={option}
                        draggable
                        onDragStart={(e) => handleDragStart(e, option)}
                        style={{
                          // backgroundColor: "rgb(215, 215, 230)",
                          // marginBottom: "5px",
                          padding: "5px",
                          cursor: "grab",
                          fontSize: "12px",
                          marginBottom: "0px",
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Stack>
      </Stack>

      <AdhocsIndication
        droppedItems={droppedItems}
        handleDrop={handleDrop}
        removeItem={removeItem}
        showPopup={showPopup}
        currentItem={currentItem}
        setShowPopup={setShowPopup}
      />
    </Stack>
  );
};

export default AdhocsSidebar;
