import React from "react";
import { Stack, Typography } from "@mui/material";
import "./Header.css";

const style = {
  navIconText: {
    fontSize: "17px",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    marginLeft: "30px",
    zIndex: "1",
    whiteSpace: "nowrap",
  },
};

const HeaderWithoutIcon = () => {
  return (
    <>
      <Stack direction="row" alignItems="center" className="navigation-bar">
        <Typography variant="h5" sx={style.navIconText}>
          Patient Analytics <span style={{ color: "#c00000" }}>Tool</span>
        </Typography>
      </Stack>
    </>
  );
};

export default HeaderWithoutIcon;
