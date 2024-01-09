import React, { useState } from "react";
import HeaderAvatar from "../components/HeaderAvatar";
import { useRouter } from "next/router";
import Image from "next/image";
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
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setCitizenDashboardTabsValue } from "../../../features/userSlice";
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
              <Grid
                item
                xs={isSmallScreen ? 4 : 5}
                style={{ display: "flex" }}
              >
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
                    }}
                    onClick={() => router.push(`/dashboard`)}
                  >
                    Home
                  </Button>
                </Tabs>
              </Grid>

              <Grid item xs={isSmallScreen ? 3 : 4}>
                <HeaderAvatar />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <br />
        <br />
        <br />
        <br />
      </Box>
    </>
  );
};

export default FirstHeader;
