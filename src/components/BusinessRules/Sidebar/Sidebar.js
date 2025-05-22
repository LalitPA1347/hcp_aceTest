import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toggleAtom } from "../../../atom";
import { Stack, Typography, Box } from "@mui/material";
import MarketBasketIcon from "../../../assets/images/BasketIcon.png";
import DCIcon from "../../../assets/images/DCIcon.png";
import LotIcon from "../../../assets/images/LotIcon.png";
import SurgeryIcon from "../../../assets/images/SurgeryIcon.png";
import MatestaticIcon from "../../../assets/images/MatestaticIcon.png";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAtom } from "jotai";
import "./Sidebar.css";

const style = {
  sidebarText: {
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  },
};

const Sidebar = () => {
  const [toggle, setToggle] = useAtom(toggleAtom);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = ()=>{
    setToggle(!toggle);
  }
  const navList = [
    {
      text: "Market Basket",
      onClick: () => navigate("/businessRules/marketBasket"),
      link: "/businessRules/marketBasket",
      icon: MarketBasketIcon,
    },
    {
      text: "Diagnosis Codes",
      onClick: () => navigate("/businessRules/diagosisCode"),
      link: "/businessRules/diagosisCode",
      icon: DCIcon,
    },
    {
      text: "Lot",
      onClick: () => navigate("/businessRules/lot"),
      link: "/businessRules/lot",
      icon: LotIcon,
    },
    {
      text: "Surgery Codes",
      onClick: () => navigate("/businessRules/surgeryCodes"),
      link: "/businessRules/surgeryCodes",
      icon: SurgeryIcon,
    },
    {
      text: "Metastatic Codes",
      onClick: () => navigate("/businessRules/metastaticCodes"),
      link: "/businessRules/metastaticCodes",
      icon: MatestaticIcon,
    },
    {
      text: "Testing Codes",
      onClick: () => navigate("/businessRules/testingCodes"),
      link: "/businessRules/testingCodes",
      icon: SurgeryIcon,
    },
    {
      text: "Comorbid Codes",
      onClick: () => navigate("/businessRules/comorbidCodes"),
      link: "/businessRules/comorbidCodes",
      icon: SurgeryIcon,
    },
  ];

  return (
    <>
      {toggle ? (
        <Stack className="sidebar-model">
          {navList.map((item) => {
            return (
              <Stack
              key={item.text}
                className="sidebar-box"
                direction="row"
                justifyContent="space-between"
                onClick={item.onClick}
              >
                <Stack
                  className="sidebar-inner-box"
                  direction="row"
                  alignItems="center"
                >
                  <img src={item.icon} alt="img" />
                  <Typography variant="h5" sx={style.sidebarText}>
                    {item.text}
                  </Typography>
                </Stack>
                <Box
                  className={
                    location.pathname === item.link
                      ? "active-sideLine"
                      : "sideLine"
                  }
                ></Box>
              </Stack>
            );
          })}
          {/* <Box className="expand-btn" onClick={handleToggle}>
            <ArrowBackIosNewIcon sx={{ fontSize: "12px" }} />
          </Box> */}
        </Stack>
      ):
      (<Box className="nav-collapse">
        {navList.map((item) => {
          return (
            <Stack
              key={item.text}
              className={`nav-collapse-img-circle ${
                location.pathname === item.link ? "active" : ""
              }`}
              onClick={item.onClick}
            >
              <img
                src={item.icon}
                className={`nav-collapse-img ${
                  location.pathname === item.link ? "active" : ""
                }`}
                alt="img"
              />
            </Stack>
          );
        })}
        {/* <Box className="collapse-btn" onClick={handleToggle}>
          <ArrowForwardIosIcon sx={{ fontSize: "12px" }} />
        </Box> */}
      </Box>)
      }
    </>
  );
};

export default Sidebar;
