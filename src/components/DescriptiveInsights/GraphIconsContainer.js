import React, { useState } from "react";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Tooltip from "@mui/material/Tooltip";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import { useParams } from "react-router-dom";
import SaveReportDialog from "./SaveReportDialogBox";
import "./IndicationDropdowns.css";
import { resetIsDuplicateReport } from "../../redux/descriptiveInsights/reportsSlice";
import { useDispatch } from "react-redux";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";

const GraphIconsContainer = ({ chartRef, svgRef, data }) => {
  const params = useParams();
  const tab = params.flag;
  const dispatch=useDispatch()
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    dispatch(resetIsDuplicateReport())
  };

  const handleSave = (fileName) => {
    console.log(`Saving report with file name: ${fileName}`);
  };

  const exportChartAsImage = () => {
    
    if (chartRef?.current) {
      const base64Image = chartRef?.current.toBase64Image();
      const link = document.createElement("a");
      link.href = base64Image;
      link.download = "chart_image.png";
      link.click();
    } else {
      console.log("Chart reference is not available.");
    }
  };

  const exportSankeyChartAsImage = () => {
    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);

      // Create a canvas element
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const svgWidth = svgElement.clientWidth;
      const svgHeight = svgElement.clientHeight;

      canvas.width = svgWidth;
      canvas.height = svgHeight;

      const img = new Image();
      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        context.clearRect(0, 0, svgWidth, svgHeight);
        context.drawImage(img, 0, 0, svgWidth, svgHeight);
        URL.revokeObjectURL(url);

        // Download the image
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "sankey-chart.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      img.src = url;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {data && (
        <div className="graph-icons">
          {tab !== "sob" ? (
            <Tooltip title="Export as Image">
              <GetAppOutlinedIcon
                sx={{
                  fontSize: "22px",
                  marginRight: "8px",
                  cursor: "pointer",
                  color: "#002060",
                }}
                onClick={exportChartAsImage}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Export as Image">
              <GetAppOutlinedIcon
                sx={{
                  fontSize: "22px",
                  marginRight: "8px",
                  cursor: "pointer",
                  color: "#002060",
                }}
                onClick={exportSankeyChartAsImage}
              />
            </Tooltip>
          )}
          <Tooltip title="Save Report">
            <SaveAsOutlinedIcon
              sx={{
                fontSize: "20px",
                marginRight: "8px",
                cursor: "pointer",
                color: "#002060",
              }}
              onClick={handleDialogOpen}
            />
          </Tooltip>
        </div>
      )}
      {/* Include the SaveReportDialog */}
      <SaveReportDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
      />
    </>
  );
};

export default GraphIconsContainer;
