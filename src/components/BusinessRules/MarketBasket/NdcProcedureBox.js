import React from 'react'
import { Stack, Typography, Box } from "@mui/material";
import { ndcProcedureCodeAtom } from '../../../atom';
import { useAtomValue } from 'jotai';

const style = {
  text: {
    fontSize: "18px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  codeTitleText: {
    width: "12vw",
    height: "5.5vh",
    fontSize: "12px",
    fontWeight: "500",
    background: "#EAEAF8",
    textAlign: "center",
    pt: "10px",
    color: "#8085AF",
    fontFamily: "Inter, sans-serif",
  },
  codeText: {
    fontSize: "11px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  icon: {
    fontSize: "22px",
    marginRight: "5px",
    cursor: "pointer",
  },
  backBtn: {
    mt: "10px",
    background: "#002060",
    textTransform: "capitalize",
    width: "152px",
    height: "6.2vh",
    marginRight: "10px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#002060",
    },
  },
  deleteBtn: {
    mt: "10px",
    background: "#C00000",
    textTransform: "capitalize",
    width: "152px",
    height: "6.2vh",
    marginRight: "10px",
    fontSize: "12px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    "&:hover": {
      background: "#C00000",
    },
  },
};
const NdcProcedureBox = () => {
    const ndcProcedureCode = useAtomValue(ndcProcedureCodeAtom);
  return (
    <Stack className="procedure-ndc-model">
      <Typography sx={style.text}>{ndcProcedureCode.productName}</Typography>
      <Stack direction="row" className="mb-code-title">
        <Typography sx={style.codeTitleText}>NDC Code</Typography>
        <Typography sx={style.codeTitleText}>Procedure Code</Typography>
      </Stack>
      <Stack direction="row" className="procedure-ndc-data-box">
        <Box>
          {/* map the ndc code  */}
          {ndcProcedureCode.ndcCode.length === 0 &&
            (
              <Box
                className={`codeTextBox ${(0 + 1) % 2 === 0 ? "odd" : ""}`}
              >
              </Box>
            )}
          {ndcProcedureCode.ndcCode &&
            ndcProcedureCode.ndcCode.map((item, index) => (
              <Box
                key={index}
                className={`codeTextBox ${(index + 1) % 2 === 0 ? "odd" : ""}`}
              >
                <Typography sx={style.codeText}>{item}</Typography>
              </Box>
            ))}

        </Box>
        <Stack className="code-border"></Stack>
        <Box>
          {/* map the procedure code  */}
          {ndcProcedureCode.procedureCode &&
            ndcProcedureCode.procedureCode.map((item, index) => (
              <Box
                key={index}
                className={`codeTextBox ${(index + 1) % 2 === 0 ? "odd" : ""}`}
              >
                <Typography sx={style.codeText}>{item}</Typography>
              </Box>
            ))}
        </Box>
      </Stack>
    </Stack>
  );
}

export default NdcProcedureBox