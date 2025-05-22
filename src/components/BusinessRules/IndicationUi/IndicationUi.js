import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router";
import { fetchDataApi } from "../../../services";
import {
  fetchDataAtom,
  addedDataAtom,
  deleteDataAtom,
  allTestingCodeRules,
  ndcProcedureCodeAtom,
  allComorbidCodeRules,
} from "../../../atom";
import "./IndicationUi.css";
import { useAtom, useSetAtom } from "jotai";
import { useSelector } from "react-redux";

const style = {
  indicationText: {
    fontSize: "14px",
    fontWeight: "400",
    fontFamily: "Inter, sans-serif",
  },
  previewBtn: {
    mt: "24px",
    ml: "100px",
    background: "#002060",
    textTransform: "capitalize",
    width: "150px",
    height: "6.2vh",
    marginRight: "10px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#002060",
    },
  },
  selectFields: {
    mt: "10px",
    mr: "35px",
    width: "25vw",
    background: "#f2f2f2",
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
};

const IndicationUi = () => {
  const navigate = useNavigate();
  const [fetchData, setFetchData] = useAtom(fetchDataAtom);
  const setAddedData = useSetAtom(addedDataAtom);
  const setDeleteData = useSetAtom(deleteDataAtom);
  const setTestingCodeRules = useSetAtom(allTestingCodeRules);
  const setComorbidCodeRules = useSetAtom(allComorbidCodeRules);
  const setNdcProcedureCode = useSetAtom(ndcProcedureCodeAtom);
  const [showLoader, setShowLoader] = useState(false);
  const { versionData } = useSelector((state) => state?.isChartData);
  const emptyData = {
    products: [],
    diagnosisCode: [],
    surgeryCode: [],
    metastaticCode: [],
  };
  useEffect(() => {
    if (versionData.selectedVersion.length > 0) {
      handleFetchData(
        versionData.selectedIndicatio,
        versionData.selectedVersion
      );
    }
  }, [versionData]);


  useEffect(() => {
    if (fetchData.selectedIndication.length === 0) {
      handleFetchData();
    }
  }, []);

  const databasesMenu = fetchData?.indication.map((values) => {
    return { value: values, label: values };
  });

  const version = fetchData?.version.map((values) => {
    return { value: values, label: values };
  });

  const handleFetchData = async (indicationName, versionName) => {
    const payload = {
      Indication: indicationName || fetchData.selectedIndication,
      Version: versionName || fetchData.selectedVersion,
    };
    setShowLoader(true);
    const response = await fetchDataApi(payload);
    if (response && response?.data && response.status === 200) {
      console.log("first", response?.data)
      const data = {
        productName: response?.data?.Data?.Product_Name,
        diagnosisCode: response?.data?.Data?.Diag_data,
        metastaticCode: response?.data?.Data?.Met_Data,
        surgeryCode: response?.data?.Data?.Surgery_data,
        selectedIndication: response?.data?.Selected_values[0],
        selectedVersion: response?.data?.Selected_values[1],
        indication: response?.data?.indication,
        version: response?.data?.version,
        finalVersionName: response?.data?.Final_version_name,
        dayDiff: response?.data?.Day_diff,
        LOT: response?.data.Data.LOT,
        testingCode: response?.data.Data?.testing_code,
        // comorbidCode: response?.data.Data?.comorbid_code
      };
      setTestingCodeRules(response?.data.Data?.testing_code);
      // setComorbidCodeRules(response?.data.Data?.comorbid_code);
      setFetchData(data);
      setShowLoader(false);
      setNdcProcedureCode({
        productName: "Select the Product Name",
        ndcCode: [],
        procedureCode: [],
      });
    } else {
      setShowLoader(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setAddedData(emptyData);
    setDeleteData(emptyData);
    handleFetchData(e.target.value, null);
  };

  const handleVersionChange = (e) => {
    e.preventDefault();
    handleFetchData(null, e.target.value);
    setAddedData(emptyData);
    setDeleteData(emptyData);
  };

  return (
    <Stack className="indication-model">
      <Stack className="indication-box" direction="row" alignItems="center">
        <Stack>
          <Typography variant="h5" sx={style.indicationText}>
            Choose your Indication
          </Typography>
          <TextField
            id="outlined-select-database"
            sx={style.selectFields}
            select
            name="dataset"
            defaultValue="Select"
            value={fetchData?.selectedIndication}
            onChange={handleChange}
          >
            {databasesMenu.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontSize: "16px", fontWeight: "400" }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack>
          <Typography variant="h5" sx={style.indicationText}>
            Choose the version
          </Typography>
          <TextField
            id="outlined-select-database"
            sx={style.selectFields}
            select
            name="dataset"
            defaultValue="Select"
            value={fetchData?.selectedVersion}
            onChange={handleVersionChange}
          >
            {version.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Button
          variant="contained"
          sx={style.previewBtn}
          onClick={() => {
            navigate("/businessRules/preview");
          }}
        >
          Preview Selected
        </Button>
      </Stack>
      <Backdrop sx={{ zIndex: 10 }} open={showLoader}>
        <CircularProgress sx={{ color: "black" }} />
      </Backdrop>
    </Stack>
  );
};

export default IndicationUi;
