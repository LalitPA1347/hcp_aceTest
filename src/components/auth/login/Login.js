/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EastIcon from "@mui/icons-material/East";
import Validation from "../../../validation/Validation";
import { API_URL } from "../../../shared/apiEndPointURL";
import axios from "axios";
import OpportunityScanner from "../../../assets/images/Opportunity_Scanner.jpg";
import "./Login.css";
const style = {
  loginBtn: {
    background: "#002060",
    textTransform: "capitalize",
    width: "25%",
    height: "6.2vh",
    marginRight: "10px",
    fontSize: "16px",
    fontWeight: "300",
    fontFamily: "Inter, sans-serif",
    color: "#ffffff",
    mt: "30px",
    "&:hover": {
      background: "#002060",
    },
    "&.Mui-disabled": {
      color: "#ffffff",
      backgroundColor: "#6d6b8e",
    },
  },
  textField: {
    mt: "30px",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#002060",
          borderWidth: "2px",
        },
      },
      "& input::placeholder": {
        fontSize: "1rem",
      },
    },
  },
};

const Login = () => {
  const navigate = useNavigate();
  // Initialize state variables
  const [showPassword, setShowPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    emailId: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      navigate("/descriptiveInsights/hcpAce");
    }
  }, []);

  // Event handler for input changes
  const handleChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  /* SignIn handler for submit button */
  const signInHandler = async () => {
    setIsLoading(true);
    await axios
      .post(
        `${API_URL.login}`,
        {
          username: data.emailId.toLowerCase(),
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        localStorage.setItem(
          "Version_Created",
          JSON.stringify(response.data.Version_Created)
        );

        if (response.status === 200) {
          localStorage.setItem("userName", response.data.UserName);
          localStorage.setItem("auth_token", response.data.token);
          navigate("/descriptiveInsights/hcpAce");
          toast.success("Login successful", {
            autoClose: 1000,
          });
          // if (response.data.token) {
          //   localStorage.setItem("userName", response.data.UserName);
          //   localStorage.setItem("auth_token", response.data.token);
          //   navigate("/PatientACE/home");
          // }
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.detail, {
          autoClose: 1000,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Event handler for login
  const handleLogin = (e) => {
    e.preventDefault();
    setError({});
    const validationErrors = Validation(data);
    // If there are no validation errors related to email ID and password, proceed with the sign-in
    if (!validationErrors.emailId && !validationErrors.password) {
      signInHandler();
    } else {
      setError(validationErrors);
    }
  };
  console.log(error);

  return (
    <div className="login-container">
      <div className="login-container-inner">
        <div className="login-left-panel">
          <h2>
            A complete AI powered solution for multiple HCP Analytics
            business needs
          </h2>
          <p>HCP ACE</p>

          <div className="illustration">
            <img
              className="image"
              src={OpportunityScanner}
              alt="Opportunity Scanner"
            />
          </div>

          {/* <div className="dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div> */}
        </div>

        <div className="login-right-panel">
          <div className="login-right-inner-panel">
            <h1>
              HCP<span className="red-text">ACE</span>
            </h1>
            <h2>Login</h2>
            <TextField
              className="password-input"
              name="emailId"
              value={data.emailId}
              id="email-form-control"
              label="Email"
              InputLabelProps={{ shrink: true }}
              placeholder="Enter your Email Address"
              onChange={handleChange}
              sx={style.textField}
            />
            {error.emailId && <p>{error.emailId}</p>}
            <TextField
              className="password-input"
              name="password"
              value={data.password}
              InputLabelProps={{ shrink: true }}
              id="outlined-password-input"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter Password"
              onChange={handleChange}
              sx={style.textField}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin(e);
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error.password && <p>{error.password}</p>}
            <Button
              sx={style.loginBtn}
              className="login-btn"
              onClick={handleLogin}
              endIcon={!isLoading && <EastIcon sx={{ fontSize: "14px" }} />}
            >
              Login
              {isLoading && (
                <CircularProgress
                  size="1rem"
                  sx={{
                    marginLeft: "20px",
                    // background: "rgb(255, 255, 255)", // Use your custom color here
                    "& .MuiCircularProgress-circle": {
                      stroke: "#ffffff", // Replace this with your custom color
                    },
                  }}
                />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
