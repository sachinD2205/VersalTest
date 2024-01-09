import React, { useState } from "react";
import styles from "./[header].module.css";
import { Input, Row, Col, Avatar } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import HeaderAvatar from "../components/HeaderAvatar";
import { useRouter } from "next/router";
import Demo from "../../../pages/MyApplications";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  AppBar,
  Grid,
  Box,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PropTypes from "prop-types";
import { Gradient } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  setApplicationName,
  setCitizenDashboardTabsValue,
} from "../../../features/userSlice";
import LayoutPageHeader from "./LayoutPageHeader";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  let language = useSelector((state) => state.labels.language);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const FirstHeader = () => {
  const router = useRouter();
  const [value, setValue] = useState(1);
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  let language = useSelector((state) => state.labels.language);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // const [value, setValue] = React.useState(0);
  const handleClick = () => {
    router.push("/dashboard");
  };

  const componentName = useSelector((state) => {
    return state.user.applicationName;
  });

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  useEffect(() => {
    let auth = user?.services?.find((r) => {
      if (r.clickTo == componentName?.clickTo) {
        return r;
      }
    });
    setAuthority(auth);
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    dispatch(setCitizenDashboardTabsValue(newValue));
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  let noRoutes = ["/CompleteProfile", "/dashboard"];

  return (
    <>
      <Box>
        <AppBar
          position="fixed"
          sx={{
            background:
              "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
          }}
        >
          <Toolbar variant="dense">
            <Grid container>
              <Grid
                item
                xs={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Image
                  onClick={handleClick}
                  src="/logo.png"
                  alt="Picturer"
                  width={50}
                  height={50}
                  style={{ cursor: "pointer" }}
                />
              </Grid>
              <Grid
                item
                xs={isSmallScreen ? 4 : 2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={handleClick}
              >
                <Typography
                  style={{ fontSize: isSmallScreen ? "10px" : "14px" }}
                  component="div"
                >
                  {language === "en" ? "Pimpri Chinchwad" : "पिंपरी चिंचवड"}
                </Typography>
                <Typography
                  style={{ fontSize: isSmallScreen ? "10px" : "14px" }}
                  component="div"
                >
                  {language === "en" ? "Municipal Corporation" : "महानगरपालिका"}
                </Typography>
              </Grid>
              <Grid item xs={isSmallScreen ? 4 : 5} style={{ display: "flex" }}>
                {/* <Box ml={2}> */}
                <Tabs
                  value={value}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                  sx={{
                    color: "white",
                    "& .Mui-selected": {
                      color: "white",
                    },
                  }}
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "white",
                      height: "5%",
                    },
                  }}
                >
                  <Tab
                    label={language === "en" ? "My Application" : "माझे अर्ज"}
                    style={{
                      color: "white",
                      textTransform: "none",
                      fontSize: isSmallScreen ? "8px" : "14px",
                      minWidth: isSmallScreen && "33%",
                      width: isSmallScreen && "33%",
                    }}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label={language === "en" ? "All Services" : "सर्व सेवा"}
                    style={{
                      color: "white",
                      textTransform: "none",
                      fontSize: isSmallScreen ? "8px" : "14px",
                      minWidth: isSmallScreen && "33%",
                      width: isSmallScreen && "33%",
                    }}
                    {...a11yProps(1)}
                  />
                  <Button
                    sx={{
                      color: "white",
                      textTransform: "capitalize",
                      fontSize: isSmallScreen ? "8px" : "14px",
                      minWidth: isSmallScreen && "33%",
                      // width: isSmallScreen && "33%"
                    }}
                    onClick={() => {
                      router.push(`/dashboard`);
                      dispatch(setApplicationName(null));
                    }}
                  >
                    {language === "en" ? "Home" : "मुख्यपृष्ठ"}
                  </Button>
                  {/* <Tab
                        label="Geo Portal"
                        style={{ color: "white", textTransform: "none" }}
                        {...a11yProps(2)}
                      /> */}
                </Tabs>
                {/* </Box> */}
              </Grid>

              <Grid
                item
                xs={isSmallScreen ? 3 : 4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Typography
                  style={{ fontSize: isSmallScreen ? "10px" : "12px" }}
                >
                  {
                    user?.applications?.find(
                      (val) => val?.id == componentName?.application
                    )?.applicationNameEng
                  }
                </Typography>
                <HeaderAvatar />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <br />
        <br />
        <br />
        <br />
        <br />
        {/* {!noRoutes.includes(router.route) && (
          <Box
            sx={{
              padding: "5px",
              backgroundColor: "#556CD6",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{ color: "white" }}
              aria-label="upload picture"
              component="label"
              onClick={() => {
                router.back();
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                {language == "en" ? authority?.serviceName : authority?.serviceNameMr}
              </Typography>
            </Box>
          </Box>
        )} */}

        {/* <LayoutPageHeader /> */}
        {/* <Toolbar /> */}
      </Box>
    </>
  );
};

export default FirstHeader;
