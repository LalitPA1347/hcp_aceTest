import React, { useRef } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DescriptiveInsightsTable from "../DescriptiveInsightsTable/DescriptiveInsightsTable";
import SummaryCharts from "../SummaryCharts/SummaryCharts";
import { Button, MenuItem, Select } from "@mui/material";
import "./ResultTabs.css";
import Download from "../../../../../assets/images/imagesR/Download.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CommonLoader from "../../../../Common/Loader/CommonLoader";
import { useSelector } from "react-redux";

const style = {
  addBtn: {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "400",
    borderRadius: "4px",
    textTransform: "none",
    // marginRight: "10px",
    // border: "1px solid #001A50",
    backgroundColor: "#001A50",
    "&:hover": {
      backgroundColor: "#001A50",
      color: "#FFFFFF",
    },
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function ResultTabs() {
  const [value, setValue] = React.useState(0);
  const [contentOption, setContentOption] = React.useState("Output");
  const tableRef = useRef();
  const chartsRef = useRef();
  const loader = useSelector((state) => state.table.loader);

  const handleDownload = () => {
    if (contentOption === "Output") {
      tableRef.current?.handleDownload();
    } else if (contentOption === "Summary Charts") {
      chartsRef.current?.handleDownload();
    }
  };

  const handleDropdownChange = (event) => {
    setContentOption(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderContent = () => {
    if (contentOption === "Output") {
      return <DescriptiveInsightsTable ref={tableRef} />;
    }
    if (contentOption === "Summary Charts") {
      return <SummaryCharts ref={chartsRef} />;
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", p: "10px 10px 0px 0px" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="output and summary tabs"
          sx={{
            "& .MuiTab-root": {
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              textTransform: "none",
              color: "#262526",
              marginRight: "80px",
             letterSpacing :"0px",
            },
          }}
          IconComponent={KeyboardArrowDownIcon}
        >
          <Tab label="Output" />
          <Tab label="Deciling" />
          <Tab label="Segmentation & Target" />
          <Tab label="Smart Alert" />
          <Tab label="KOL/OL" />
          <Tab label="Dynamic Targeting" />
        </Tabs>
      </Box>
      {(contentOption === "Output" || contentOption === "Summary Charts") && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            position: "relative",
          }}
        >
          <Box className="contentText">{contentOption}</Box>

          <Box
            sx={{
              width: "30%",
              display: "flex",
              justifyContent: "flex-end",
              // alignItems: "center",
            }}
          >
            <Select
              value={contentOption}
              onChange={handleDropdownChange}
              size="small"
              sx={{ minWidth: 180, mr: "10px" }}
            >
              <MenuItem value="Output">Output</MenuItem>
              <MenuItem value="Summary Charts">Summary Charts</MenuItem>
            </Select>

            <Button
              variant="outlined"
              sx={style.addBtn}
              startIcon={<img src={Download} alt="download icon" />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Box>
          {loader && (
            <Box
              sx={{
                position: "absolute",
                mt: "400px",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000, 
              }}
            >
              <CommonLoader />
            </Box>
          )}
        </Box>
      )}
      <TabPanel value={value} index={0}>
        {renderContent()}
      </TabPanel>
      {/* <TabPanel value={value} index={1}>
        {renderContent()}
      </TabPanel> */}
    </Box>
  );
}

export default ResultTabs;
