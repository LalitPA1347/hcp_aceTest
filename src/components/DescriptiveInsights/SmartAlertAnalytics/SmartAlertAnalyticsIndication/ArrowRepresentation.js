import React from "react";
import { Box, Typography } from "@mui/material";

const ArrowRepresentation = ({ startLine, endLine, triggers }) => {
  return (
    <Box
      sx={{
        width: "90%",
        marginLeft: "60px ",
        marginTop: "46px",
        position: "relative",
        textAlign: "center",
      }}
    >
      {/* Arrow Line */}
      <svg width="100%" height="40">
        {/* Main arrow line */}
        <line
          x1="0"
          y1="20"
          x2="100%"
          y2="20"
          stroke="gray"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
        />
        {/* Arrowhead */}
        {/* <polygon points="98% 10, 100% 20, 98% 30" fill="black" /> */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="gray" />
          </marker>
        </defs>
      </svg>

      {/* Start Line Box */}
      <Box
        sx={{
          position: "absolute",
          left: "-10%",
          top: "-40px",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">Start Line</Typography>
        <Box
          sx={{
            border: "1px solid gray",
            paddingLeft: "4px",
            paddingRight: "4px",
            display: "inline-block",
            background: "white",
          }}
        >
          <Typography>{startLine}</Typography>
        </Box>
        {/* Vertical Line from Start Line Box to Arrow */}
        <svg width="100%" height="16">
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="15"
            stroke="gray"
            strokeWidth="1.5"
          />
        </svg>
      </Box>

      {/* End Line Box */}
      <Box
        sx={{
          position: "absolute",
          right: "15%",
          top: "-40px",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">End Line</Typography>
        <Box
          sx={{
            border: "1px solid gray",
            paddingLeft: "4px",
            paddingRight: "4px",
            display: "inline-block",
            background: "white",
          }}
        >
          <Typography>{endLine}</Typography>
        </Box>
        <svg width="100%" height="16">
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="15"
            stroke="gray"
            strokeWidth="1.5"
          />
        </svg>
      </Box>

      {/* Left Yellow Box (Dx) */}
      <Box
        sx={{
          position: "absolute",
          left: "-4%",
          top: "10px",
          width: "40px",
          height: "22px",
          backgroundColor: "gold",
          border: "1px solid gray",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2">Dx</Typography>
      </Box>

      {/* Triggers Box */}
      <Box
        sx={{
          position: "absolute",
          left: "55%",
          transform: "translateX(-50%)",
          top: "-25px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: "-18px",
            marginLeft: "18%",
            border: "1px solid gray",
            width: "70px",
            zIndex: 2000,
            background: "white",
          }}
        >
          Triggers
        </Typography>
        <Box
          sx={{
            border: "1px solid gray",
            width: "60%",
            display: "inline-block",
            paddingTop: "4px",
            background: "white",
          }}
        >
          <Typography sx={{ fontSize: "15px" }}>
            {triggers.join(", ")}
          </Typography>
        </Box>

        {/* Small Arrows Under Triggers */}
        <svg width="60%" height="18">
          {triggers.map((_, index) => (
            <line
              key={index}
              x1={`${(index + 1) * (100 / (triggers.length + 1))}%`}
              y1="30"
              x2={`${(index + 1) * (100 / (triggers.length + 1))}%`}
              y2="10"
              stroke="gray"
              strokeWidth="1"
              markerEnd="url(#smallArrow)"
            />
          ))}
          <defs>
            <marker
              id="smallArrow"
              markerWidth="6"
              markerHeight="6"
              refX="0"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="gray" />
            </marker>
          </defs>
        </svg>
      </Box>
    </Box>
  );
};

export default ArrowRepresentation;
