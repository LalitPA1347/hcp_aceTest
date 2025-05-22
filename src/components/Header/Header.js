import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { Logout, Notifications, Settings } from "@mui/icons-material";
import "./Header.css";

const style = {
  navIconText: {
    fontSize: "17px",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    marginTop: "40px",
    marginLeft: "20px",
    zIndex: "1",
    whiteSpace: "nowrap",

    "@media (max-width: 1200px)": {
      fontSize: "20px", 
    },
    "@media (max-width: 960px)": {
      fontSize: "18px",
    },
    "@media (max-width: 600px)": {
      fontSize: "16px", 
    },
  },
  navUsername: {
    fontSize: "20px",
    fontWeight: "550",
    fontFamily: "Inter, sans-serif",
  },
  navUsernameIcon: {
    fontSize: "16px",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName");
  const userAvatar = localStorage.getItem("userAvatar");
  // const [settingsOpen, setSettingsOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const titleNav = [
    {
      text: "Descriptive Insights",
      onClick: () => {
        navigate("/descriptiveInsights/patientAnalytics/dot");
      },
      link: "/descriptiveInsights",
    },
  ];

  const activePath = () => {
    const pathParts = location.pathname.split("/").slice(0, 2);
    return pathParts.join("/");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/");
  };

  const handleUserIcon = (fullName) => {
    if (!fullName) return "";

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";

    return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
  };

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };
  return (
    <>
      <Stack direction="row" alignItems="center" className="navigation-bar">
        <Typography variant="h5" sx={style.navIconText}>
          Descriptive <span style={{ color: "#c00000" }}>Insights</span>
        </Typography>
        <Stack direction="row" className="nav-model" alignItems="center">
          <Stack direction={"row"} className="nav-active-box">
            {location.pathname === "/"
              ? null
              : titleNav.map((item) => (
                  <div
                    className="inactive-link"
                    id={activePath() === item.link ? "active-tab" : ""}
                    onClick={item.onClick}
                    key={item.text}
                  >
                    <h5 style={{ whiteSpace: "norap" }} className="fontChange">
                      {item.text}
                    </h5>
                  </div>
                ))}
          </Stack>
          <div className="faded-line"></div>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0}
            sx={{ mt: "30px" }}
          >
            <Tooltip title="Notifications" placement="bottom">
              <IconButton
                color="inherit"
                sx={{ color: "#002060" }}
                className="hideIcons"
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            {userName && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  alt={userName}
                  src={userAvatar || ""}
                  sx={{ width: 30, height: 30, fontSize: "1rem" }}
                  className="hideIcons"
                >
                  {userAvatar ? null : handleUserIcon(userName)}
                </Avatar>
                <Stack direction="row" alignItems="center">
                  <Typography
                    style={style.navUsername}
                    sx={{ color: "#002060" }}
                    className="hideIcons"
                  >
                    {userName}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{ fontSize: "28px" }}
                    className="hideIcons"
                  />
                </Stack>
              </Stack>
            )}
            <Tooltip title="Logout" placement="bottom">
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{ marginRight: "28px", color: "#002060" }}
                className="hideIcons"
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            {/* <div     > */}
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                sx={{
                  color: "darkblue",
                  display: { sm: "inline-flex", lg: "none" },
                  mr: 4,
                  mt: 4,
                }}
              >
                <Avatar sx={{ width: 32, height: 32, background: "blue" }}>
                  {" "}
                  {userAvatar ? null : handleUserIcon(userName)}{" "}
                </Avatar>
              </IconButton>
            </Tooltip>
            {/* </div> */}

            <Menu
              anchor={anchor}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 12,
                    ml: -2,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "top" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> {userName}
              </MenuItem>

              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Notifications fontSize="small" />
                </ListItemIcon>
                Notifications
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Header;
