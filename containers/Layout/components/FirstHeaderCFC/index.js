import {
  AppBar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import styles from "./[FirstHeaderCFC].module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setUsersDepartmentDashboardData,
} from "../../../../features/userSlice";
import { language } from "../../../../features/labelSlice";
import axios from "axios";
import urls from "../../../../URLS/urls";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 340;

const FirstHeaderCFC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  // const user = useSelector((state) => state.user.user)
  // const _language = useSelector((state) => state.labels.language);
  const underline = useSelector((state) => state?.labels.language);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [cfcDetails, setcfcDetails] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useSelector((state) => state.user.user.token);

  useEffect(() => {
    getWalletAmountByCFC_Id();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const _language = useSelector((state) => state?.labels.language);
  const user = useSelector((state) => state.user.user.userDao);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    dispatch(setUsersDepartmentDashboardData(null));
    localStorage.setItem("loggedInUser", null);
    router.push("/login");
  };

  const getWalletAmountByCFC_Id = () => {
    let cfcId = user?.cfc;
    const tempData = axios
      .get(`${urls.CFCURL}/master/cfcCenters/getByCfcId?cfcId=${cfcId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Id Respose", res);
        setcfcDetails(res?.data);
      })
      .catch((err) => console.log("err", err));
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Grid container>
          <Grid item xs={isSmallScreen ? 2 : 1} className={styles.appIcon}>
            <Image
              src="/logo.png"
              alt="Picturer"
              width={50}
              height={50}
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push("../../../CFC_Dashboard");
              }}
            />
          </Grid>
          <Grid
            item
            xs={isSmallScreen ? 7 : 8}
            className={styles.appNameContainer}
          >
            <Typography
              sx={{
                typography: {
                  xs: "body2",
                  sm: "body2",
                  md: "body1",
                  lg: "subtitle1",
                  xl: "h6",
                },
              }}
            >
              {_language === "en" ? "PIMPRI CHINCHWAD" : "पिंपरी चिंचवड"}
            </Typography>
            <Typography
              sx={{
                typography: {
                  xs: "body2",
                  sm: "body2",
                  md: "body1",
                  lg: "subtitle1",
                  xl: "h6",
                },
              }}
            >
              {_language === "en" ? "MUNICIPAL CORPORATION" : "महानगरपालिका"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div
              className={
                underline == "en" ? styles.chotuContainer : styles.language
              }
            >
              <Typography
                textAlign="center"
                style={{
                  color: "white",
                  fontSize: isSmallScreen ? "12px" : "14px",
                  textTransform: "capitalize",
                  padding: "5px",
                }}
                onClick={() => {
                  dispatch(language("en"));
                }}
              >
                ENG
              </Typography>
            </div>
            <div
              className={
                underline == "mr" ? styles.chotuContainer : styles.language
              }
            >
              <Typography
                textAlign="center"
                style={{
                  color: "white",
                  fontSize: isSmallScreen ? "12px" : "14px",
                  padding: "5px",
                }}
                onClick={() => {
                  dispatch(language("mr"));
                }}
              >
                मराठी
              </Typography>
            </div>
          </Grid>
          <Grid item xs={2}>
            <div className={styles.menuIcon}>
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
              {/* <Menu
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
                <MenuItem className={styles.menuList}>
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography variant="body2" className={styles.menuTitle}>
                      Name :{" "}
                    </Typography>
                    <Typography>ABCD MNOP</Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      Role :{" "}
                    </Typography>
                    <Typography>Admin</Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      Email ID :{" "}
                    </Typography>
                    <Typography>abcdmnop@gmail.component</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
                  Logout
                </MenuItem>
              </Menu> */}
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
                <MenuItem className={styles.menuList}>
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography variant="body2" className={styles.menuTitle}>
                      Name :{" "}
                    </Typography>
                    <Typography>
                      {_language === "en"
                        ? user?.firstNameEn
                        : user?.firstNameMr}{" "}
                      {_language === "en"
                        ? user?.middleNameEn
                        : user?.middleNameMr}{" "}
                      {_language === "en" ? user?.lastNameEn : user?.lastNameMr}
                    </Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      Email ID :{" "}
                    </Typography>
                    <Typography>{user?.email}</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem className={styles.menuList}>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      CFC Id : {cfcDetails?.cfcId ? cfcDetails?.cfcId : "-"}
                    </Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      CFC Name :{" "}
                      {cfcDetails?.cfcName ? cfcDetails?.cfcName : "-"}
                    </Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      CFC Wallet Amount :{" "}
                      {cfcDetails?.balanceAvailableRs
                        ? cfcDetails?.balanceAvailableRs
                        : 0}
                    </Typography>
                  </Box>
                </MenuItem>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "1%",
                  }}
                >
                  <Button
                    sx={{ backgroundColor: "#6739B7" }}
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={() => {
                      router.push({
                        pathname: "../../common/transactions/topUpProcess",
                        query: {
                          cfcDetails: cfcDetails && JSON.stringify(cfcDetails),
                          pageMode: "Edit",
                        },
                      });
                    }}
                  >
                    {_language === "en" ? "Topup Wallet" : "टॉपअप वॉलेट"}
                  </Button>
                </Box>
                <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
                  {_language === "en" ? "Logout" : "बाहेर पडा"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("../../../../CFC/ChangePasswordCFC");
                  }}
                  style={{ color: "red" }}
                >
                  {_language === "en" ? "Reset Password" : "पासवर्ड रीसेट करा"}
                </MenuItem>
                <MenuItem className={styles.menuList}>
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "14px" }}>
                      {underline === "en" ? user?.firstName : user?.firstNameMr}{" "}
                      {underline === "en"
                        ? user?.middleName
                        : user?.middleNameMr}{" "}
                      {underline === "en" ? user?.surname : user?.surnamemr}
                    </Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography sx={{ color: "blue", fontSize: "12px" }}>
                      {user?.emailID}
                    </Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default FirstHeaderCFC;
