import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import AdhocsIndication from "./AdhocsIndication/AdhocsIndication";
import "./Adhocs.css";
import AdhocsGenerateTable from "./AdhocsGenerateTable";
import { useSelector } from "react-redux";
import { processChartData } from "../../Helper";
import GenerateDataTable from "../../GenerateDataTable";
import SavedAdhocs from "./SavedAdhocs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const style = {
  text: {
    mt: "3px",
    mb: "3px",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    color: "#002060",
  },
};
// const results = [
//   {
//     Title: "Patient Count",
//     headers: ["lot", "year", "patient count"],
//     rows: [
//       {
//         lot: "0",
//         year: 2015,
//         "patient count": 602,
//       },
//       {
//         lot: "0",
//         year: 2016,
//         "patient count": 840,
//       },
//       {
//         lot: "0",
//         year: 2017,
//         "patient count": 1013,
//       },
//       {
//         lot: "0",
//         year: 2018,
//         "patient count": 821,
//       },
//     ],
//     Adhoc_Graph: false,
//   },
//   {
//     Title: "New Patient Count",
//     headers: ["lot", "year", "new patient count"],
//     rows: [
//       {
//         lot: "0",
//         year: 2015,
//         "new patient count": 1,
//       },
//       {
//         lot: "0",
//         year: 2016,
//         "new patient count": 18,
//       },
//       {
//         lot: "0",
//         year: 2017,
//         "new patient count": 149,
//       },
//     ],
//     Adhoc_Graph: false,
//   },
//   {
//     Graph_Data: [
//       {
//         group: "NSCLC-0",
//         M_SERIES: "M1",
//         DOT: 100.0,
//       },
//       {
//         group: "NSCLC-0",
//         M_SERIES: "M2",
//         DOT: 94.0,
//       },
//       {
//         group: "NSCLC-0",
//         M_SERIES: "M3",
//         DOT: 77.0,
//       },
//     ],
//     Graph_Dimension: [
//       {
//         Xaxis: "M_SERIES",
//       },
//       {
//         Yaxis: "DOT",
//       },
//       {
//         Legend: "group",
//       },
//     ],
//     Graph_type: "Line",
//     Adhoc_Graph: true,
//   },
//   {
//     Graph_Data: [
//       {
//         group: "NSCLC-0",
//         M_SERIES: "M1",
//         DOT: 50.0,
//       },
//       {
//         group: "NSCLC-0",
//         M_SERIES: "M2",
//         DOT: 49.0,
//       },
//       {
//         group: "NSCLC-0",
//         M_SERIES: "M3",
//         DOT: 27.0,
//       },
//     ],
//     Graph_Dimension: [
//       {
//         Xaxis: "M_SERIES",
//       },
//       {
//         Yaxis: "DOT",
//       },
//       {
//         Legend: "group",
//       },
//     ],
//     Graph_type: "Line",
//     Adhoc_Graph: true,
//   },
// ];
const Adhocs = () => {
  const [adhocGraphTrue, setAdhocGraphTrue] = useState([]); //when adhocGraph comes as true from API
  const [adhocGraphFalse, setAdhocGraphFalse] = useState([]); //when adhocGraph comes as false from API
  const results = useSelector((store) => store.adhocsResults.result);

  useEffect(() => {
    try {
      if (results && results.length > 0) {
        let adhocTrueData = [];
        let adhocFalseData = [];

        results.forEach((result) => {
          if (result?.Adhoc_Graph) {
            const processData = processChartData(
              result?.Graph_Data,
              result?.Graph_Dimension,
              result?.Graph_type,
              result?.Title
            );
            adhocTrueData.push(processData);
          } else {
            adhocFalseData.push({ ...result });
          }
        });
        setAdhocGraphTrue(adhocTrueData);
        setAdhocGraphFalse(adhocFalseData);
      } else {
        setAdhocGraphTrue([]);
        setAdhocGraphFalse([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [results]);

  return (
    <>
      <AdhocsIndication />
      <Box className="custom-kpi">
        {/* <Stack className="custom-kpi-box">
          {Object.keys(results).length !== 0 ? (
            <Stack>
              {results.map((result) =>
                result?.Adhoc_Graph ? (
                  adhocGraphTrue && Object.keys(adhocGraphTrue).length !== 0 ? (
                    <GenerateDataTable data={adhocGraphTrue} />
                  ) : null
                ) : adhocGraphFalse &&
                  Object.keys(adhocGraphFalse).length !== 0 ? (
                  adhocGraphFalse.map((data) => (
                    <AdhocsGenerateTable data={data} />
                  ))
                ) : null
              )}
            </Stack>
          ) : (
            <div className="custom-kpi-header">
              <Typography sx={style.text}>Adhocs</Typography>
            </div>
          )}
        </Stack> */}

        <Stack className="custom-kpi-box">
          {results.length > 0 ? (
            <Stack>
              {/* Render table if adhocGraph is true */}
              {adhocGraphTrue &&
                Object.keys(adhocGraphTrue).length !== 0 &&
                adhocGraphTrue.map((data) => (
                  <Accordion defaultExpanded disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{data?.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <GenerateDataTable data={data} />
                    </AccordionDetails>
                  </Accordion>
                ))}

              {/* Render table if adhocGraph is false */}
              {adhocGraphFalse.length > 0 &&
                adhocGraphFalse.map((data,index) => (
                  <Accordion defaultExpanded={index === 0} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{data.Title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <AdhocsGenerateTable data={data} />
                    </AccordionDetails>
                  </Accordion>
                ))}
            </Stack>
          ) : (
            <div className="custom-kpi-header">
              <Typography sx={style.text}>Adhocs</Typography>
            </div>
          )}
        </Stack>
      </Box>
      <SavedAdhocs />
    </>
  );
};

export default Adhocs;
