import React, { useEffect, useState } from "react";
import { Avatar, Popover, Row, Input, Col } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setApplicationName,
  setCitizenDashboardTabsValue,
  setUsersCitizenDashboardData,
} from "../../../../features/userSlice";
import { useRouter } from "next/router";
import { Box, Typography, Menu, MenuItem, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HelpIcon from "@mui/icons-material/Help";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styles from "../../../../styles/[DepartmentDashboard].module.css";
import { language } from "../../../../features/labelSlice";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// English - Marathi button
export const Marathi = () => {
  // English Marathi Buttons
  const [runAgain, setRunAgain] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setRunAgain(false);
  }, [runAgain]);

  const dispatch = useDispatch();
  const handleMarathi = () => {
    dispatch(language("mr"));
  };

  return (
    <>
      {/* <button onClick={handleMarathi}>Marathi</button> */}
      <span
        className={styles.language}
        style={{
          color: "white",
          textTransform: "capitalize",
          border: "1px solid white",
          padding: "5px 10px 3px 10px",
          borderRadius: "18%",
          fontWeight: "normal",
          fontSize: isSmallScreen ? "8px" : "12px",
          backgroundColor: "#5499C7",
        }}
        onClick={() => {
          setRunAgain(true);
          dispatch(language("mr"));
        }}
      >
        मराठी
      </span>
    </>
  );
};

export const English = () => {
  // English Marathi Buttons
  const [runAgain, setRunAgain] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setRunAgain(false);
  }, [runAgain]);

  const dispatch = useDispatch();
  const handleEnglish = () => {
    dispatch(language("en"));
  };

  return (
    <>
      {/* <button onClick={handleEnglish}>English</button> */}
      <span
        className={styles.engLang}
        style={{
          color: "white",
          border: "1px solid white",
          padding: "5px 6px 5px 6px",
          borderRadius: "18%",
          textTransform: "capitalize",
          fontWeight: "normal",
          fontSize: isSmallScreen ? "8px" : "12px",
          backgroundColor: "#5499C7",
        }}
        onClick={() => {
          setRunAgain(true);
          dispatch(language("en"));
        }}
      >
        English
      </span>
    </>
  );
};

const HeaderAvatar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const underline = useSelector((state) => state?.labels.language);
  const [runAgain, setRunAgain] = useState(false);
  const user = useSelector((state) => {
    return state.user.user;
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // @ts-ignore
  const userDetailsInRedux = useSelector((state) => {
    return state.user;
  });
  // const userDetailsInRedux = useSelector((state) => state.user.user)

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [lang, setLanguage] = useState(false);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const chnageLaguage = () => {
    setLanguage(!lang);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setUsersCitizenDashboardData(null));
    dispatch(setCitizenDashboardTabsValue(1));
    setAnchorEl(null);
    router.push("/login");
  };

  const usersCitizenDashboardData = useSelector((state) => {
    return state.user.usersCitizenDashboardData;
  });

  let [services, setServices] = useState(getServicesByAppId(77));

  function getServicesByAppId(appId) {
    return usersCitizenDashboardData?.services?.find((v) => v?.id === appId);
    // .map((r) => r);
  }

  useEffect(() => {}, [services]);

  const content = (
    <>
      <p>
        <b>Name:</b>
        <br />
        {userDetailsInRedux?.fullName}
      </p>
      <p>
        <b>Role:</b>
        <br />
        {userDetailsInRedux?.designation}
      </p>
      <p>
        <b>E-Mail:</b>
        <br />
        {userDetailsInRedux?.email}
      </p>
      <a type="link" onClick={handleLogout}>
        <b>Logout</b>
      </a>
    </>
  );

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedValue, setSelectedValue] = useState(10);

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "35%",
            justifyContent: "space-around",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Button onClick={handleCloseNavMenu}>
              <Button onClick={chnageLaguage}>
                {lang ? <English /> : <Marathi />}
              </Button>
            </Button>
          </Box>
          {/* <div
            className={
              underline == "en" ? styles.chotuContainer : styles.language
            }
          >
            <span
              className={styles.engLang}
              style={{
                color: "white",
                fontSize: isSmallScreen ? "8px" : "14px",
              }}
              onClick={() => {
                setRunAgain(true);
                dispatch(language("en"));
              }}
            >
              Eng
            </span>
          </div>
          <div
            className={
              underline == "mr" ? styles.chotuContainer : styles.language
            }
          >
            <span
              className={styles.language}
              style={{
                color: "white",
                fontSize: isSmallScreen ? "8px" : "14px",
              }}
              onClick={() => {
                setRunAgain(true);
                dispatch(language("mr"));
              }}
            >
              Mar
            </span>
          </div> */}
        </div>

        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {/* <MenuItem style={{ display: "flex", flexDirection: "column" }}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Typography variant="body2" style={{ fontWeight: "600" }}>
                Name :{" "}
              </Typography>
              <Typography>
                {console.log("43", underline === "en" ? user?.firstName : user?.firstNameMr)}
                {underline === "en" ? user?.firstName : user?.firstNameMr}{" "}
                {underline === "en" ? user?.middleName : user?.middleNameMr}{" "}
                {underline === "en" ? user?.surname : user?.surnamemr}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Typography variant="body2" style={{ fontWeight: "600" }}>
                Email ID :{" "}
              </Typography>
              <Typography>{user?.emailID}</Typography>
            </Box>
          </MenuItem> */}
          <MenuItem
            className={styles.menuList}
            sx={{ cursor: "default !important" }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>
                {underline === "en" ? user?.firstName : user?.firstNameMr}{" "}
                {underline === "en" ? user?.middleName : user?.middleNameMr}{" "}
                {underline === "en" ? user?.surname : user?.surnamemr}
              </Typography>
            </Box>
            <Box className={styles.menuTitleContainer}>
              <Typography sx={{ color: "blue", fontSize: "12px" }}>
                {user?.emailID}
              </Typography>
            </Box>
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              // console.log("prevRoute",router);
              // dispatch(setApplicationName(services))
              router.push("/CompleteProfile");
            }}
            style={{ color: "#2162DF" }}
          >
            Complete Profile
          </MenuItem> */}
          {/* <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
            Logout
          </MenuItem> */}
          <MenuItem sx={{ cursor: "default !important" }}>
            <Button
              size="small"
              sx={{ textTransform: "capitalize" }}
              onClick={handleLogout}
              variant="contained"
            >
              Logout
            </Button>
            <Button
              size="small"
              sx={{
                // backgroundColor: "#EAEDED",
                marginLeft: 1,
                // color: "black",
                textTransform: "capitalize",
                ":hover": {
                  color: "blue",
                },
              }}
              onClick={() => {
                // console.log("prevRoute",router);
                // dispatch(setApplicationName(services))
                router.push("/CompleteProfile");
              }}
              variant="outlined"
            >
              Complete Profile
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{
                marginLeft: 1,
                textTransform: "capitalize",
                ":hover": {
                  color: "blue",
                },
              }}
              onClick={() => {
                router.push("../../../common/masters/resetPassword");
              }}
            >
              Reset Password
            </Button>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default HeaderAvatar;
