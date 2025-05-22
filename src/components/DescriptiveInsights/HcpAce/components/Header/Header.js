import React, { useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "../../../../../assets/images/Help.svg"
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./Header.css";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleUserIcon = (fullName) => {
    if (!fullName) return "";
    const nameParts = fullName.trim().split(" ");
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial =
      nameParts.length > 1
        ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        : "";
    return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack direction="row" className="navigation-bar">
        {/* Left: Logo */}
        <Stack className="logo-alignment" direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box className="logo-box">
              <Box className="logo-box-icon">
                <Typography
                  className="logo-box-icon-textbox"
                  sx={{ fontSize: "24px", fontWeight: "500" }}
                >
                  H<span style={{ color: "#D32F2F" }}>A</span>
                </Typography>
              </Box>
              <Box className="logo-text-box">
                <Typography noWrap sx={{ fontSize: "24px", color: "#262526" }}>
                  HCP{" "}
                  <span
                    style={{
                      fontSize: "24px",
                      color: "#D32F2F",
                      fontWeight: "700",
                    }}
                  >
                    ACE
                  </span>
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>

        {/* Right: Icons */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Help */}
          <Box className="logo-box-icons-right">
            <Tooltip title="Help" placement="bottom">
              <IconButton color="inherit" sx={{ color: "#002060" }}>
                <img src={HelpIcon} alt="help" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Settings */}
          {/* <Box className="logo-box-icons-right">
            <Tooltip title="Settings" placement="bottom">
              <IconButton
                color="inherit"
                sx={{ color: "#002060" }}
                onClick={handleOpenSettings}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box> */}

          {/* Avatar and Menu */}
          <Stack
            sx={{
              border: "1px solid",
              borderColor: "#CACBCE",
              background: "#F8F8F8",
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  height: "100%",
                  borderRadius: "10px",
                  pr: "6px",
                  cursor: "pointer",
              }}
            >
              <Avatar
                alt={userName}
                sx={{
                  width: "55px",
                  height: "54px",
                  borderRadius: "10px",
                  fontSize: "18px",
                  marginLeft: "0px",
                  paddingLeft: "0px",
                  background: "#EBF2FF",
                  color: "black",
                   
                }}
              >
                {handleUserIcon(userName)}
              </Avatar>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ width: "20px", height: "20px" }}
              >
                <ExpandMoreIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    ml: 1,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
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
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleClose}>
                  <Avatar  /> {userName}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                 <ListItemIcon>
                   <NotificationsIcon fontSize="small" />
                 </ListItemIcon>
                 Notification
                 </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Stack>
      </Stack>

    </>
  );
};

export default Header;
