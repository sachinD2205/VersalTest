import * as MuiIcons from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import styles from "../../styles/[DepartmentDashboard].module.css";
// import HeaderAvatar from "../../containers/Layout/components/HeaderAvatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import LayoutFooter from "../../containers/Layout/components/LayoutFooter";
import { language } from "../../features/labelSlice";
import {
  logout,
  setSelectedApplicationId,
  setSelectedBreadcrumbApplication,
  setUsersDepartmentDashboardData,
} from "../../features/userSlice";
// import styles from "./styles.module.css";

const drawerWidth = 340;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

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

// const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  height: "92%",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  height: "92%",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  // backgroundColor: "#556CD6",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// English - Marathi button
export const Marathi = () => {
  // English Marathi Buttons
  const [runAgain, setRunAgain] = useState(false);

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
          fontSize: "12px",
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
          fontSize: "12px",
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

// button end

const DepartmentDashboard = (props) => {
  // English Marathi button
  const [lang, setLanguage] = useState(false);

  // useEffect(() => {
  //   setLanguage(!language);
  // }, [language]);

  const chnageLaguage = () => {
    setLanguage(!lang);
  };

  // button end

  // responsive
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // end responsive

  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const [openItemID, setOpenItemID] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();

  const _language = useSelector((state) => state?.labels.language);
  const [runAgain, setRunAgain] = useState(false);
  const underline = useSelector((state) => state?.labels.language);

  const user = useSelector((state) => state?.user.user);
  let abc = "hii";
  const [mapArray, setMapArray] = useState([]);

  const [openCollapse, setOpenCollapse] = React.useState(false);

  // English Marathi Buttons
  useEffect(() => {
    setRunAgain(false);
  }, [runAgain]);

  const handleChange = (event) => {
    setRunAgain(true);
    dispatch(language(event.target.value));
    setAge(event.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("isPasswordChanged") == "N") {
      router.push("/departmentPasswordChange");
    }
  }, []);

  const usersDepartmentDashboardData = useSelector((state) => {
    console.log(
      "usersDepartmentDashboardData",
      state.user.usersDepartmentDashboardData
    );
    return state.user.usersDepartmentDashboardData;
  });

  function handleListItemsClick(key) {
    if (openCollapse == false) {
      setOpenItemID(key);
      setOpenCollapse(true);
    } else {
      setOpenItemID(null);
      setOpenCollapse(false);
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // const menu = [
  //   { name: 'Notifications', icon: 'Notifications' },
  //   { name: 'Create Notification', icon: 'Adb' },
  // ]

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(setUsersDepartmentDashboardData(null));
    dispatch(logout());
    router.push("/login");
  };

  const handleMenuSubListItemClick = (value, index) => {
    router.push(value);
  };

  const defaultMenu = usersDepartmentDashboardData?.menus?.map((val) => {
    return val;
    // return val.appKey === 0 ? val : "";
  });
  const arr11 = [];

  usersDepartmentDashboardData?.applications.map((val) => {
    let _childElem = defaultMenu.filter((txt) => {
      return txt.appKey === val.id;
    });
    arr11.push(..._childElem);
    // setMapArray(arr11)
  });

  const handleApplicationClick = (e) => {
    // console.log("e", e);
    // let arr = usersDepartmentDashboardData.menus.filter((val) => {
    //   return  e.id === val.appKey;
    // });
    // if (e.url.includes("http://")) {
    // if (e.id == 16) {
    //   router.push(`${e.url}Admin`);
    // } else if (e.id == 22) {
    //   router.push(`${e.url}Admin`);
    // }
    // if (e.id == 16) {
    //   router.push(`${e.url}Admin`);
    // } else if (e.id == 22) {
    //   router.push(`${e.url}Admin`);
    // }
    // } else {
    // }
    // router.push("/LegalCase/dashboard");
    dispatch(setSelectedBreadcrumbApplication(null));
    dispatch(setSelectedApplicationId(e.id));
    dispatch(setSelectedBreadcrumbApplication(e.url));
    router.push(e.url);
    console.log("arr", arr, e);
  };

  const handleApplicationCardClick = (data) => {
    window.open("https://www.google.com");

    // usersDepartmentDashboardData.applications.map((val) => {
    //   let _childElem = usersDepartmentDashboardData.menus.filter((txt) => {
    //     return txt.appKey == data.id && txt;
    //   });
    //   arr11=[];
    //   arr11.push(..._childElem);
    // });
  };

  let arr = usersDepartmentDashboardData?.menus?.filter((val) => {
    return val.isParent;
  });
  let res = [];
  arr && res.push(...arr);
  const abcd = arr?.map((val) => {
    let childEle = usersDepartmentDashboardData?.menus?.filter(
      (value) => val.id == value.parentId
    );
    // res.push(val);
    res.push(...childEle);
    return val;
  });

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "40px" }} />;
  };

  return (
    // Responsive
    <>
      <AppBar
        position="fixed"
        sx={{
          background:
            "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
        }}
      >
        <Container maxWidth="xl" minHeight="sm">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Image
                src="/logo.png"
                alt="Picturer"
                width={52}
                height={52}
                style={{ cursor: "pointer" }}
              />
            </Box>

            <Typography
              sx={{
                // color: "white",
                padding: "2%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
                display: { xs: "none", md: "flex" },
              }}
              className={styles.title1}
            >
              {underline === "en"
                ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION"
                : "पिंपरी-चिंचवड महानगरपालिका"}
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {/* {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))} */}
                <Button onClick={handleCloseNavMenu}>
                  <div
                    className={
                      underline == "en"
                        ? styles.chotuContainer
                        : styles.language
                    }
                  >
                    <Typography
                      textAlign="center"
                      className={styles.engLang}
                      style={{
                        marginRight: "30px",
                        color: "black",
                        fontSize: "7px",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        setRunAgain(true);
                        dispatch(language("en"));
                      }}
                    >
                      English
                    </Typography>
                  </div>
                  <div
                    className={
                      underline == "mr"
                        ? styles.chotuContainer
                        : styles.language
                    }
                  >
                    <Typography
                      textAlign="center"
                      className={styles.language}
                      style={{
                        color: "black",
                        fontSize: "7px",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        setRunAgain(true);
                        dispatch(language("mr"));
                      }}
                    >
                      Marathi
                    </Typography>
                  </div>
                </Button>
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} /> */}
            <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
              <Image
                src="/logo.png"
                alt="Picturer"
                width={50}
                height={50}
                style={{ cursor: "pointer" }}
              />
            </Box>
            <Typography
              sx={{
                // color: "white",
                padding: "1%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h6",
                  lg: "h5",
                  xl: "h5",
                },
                display: { xs: "flex", md: "none" },
              }}
              className={styles.title1}
            >
              {underline === "en"
                ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION"
                : "पिंपरी-चिंचवड महानगरपालिका"}
            </Typography>
            {/* {pages.map((page) => (
                <Button key={page} onClick={handleCloseNavMenu} sx={{ my: 2, color: "white", display: "block" }}>
                {page}
                </Button>
              ))} */}

            {/* <div
                style={{ paddingRight: "9px" }}
                className={underline == "en" ? styles.chotuContainer : styles.language}
              >
                <span
                  className={styles.engLang}
                  style={{
                    color: "white",
                    // border: "2px solid red",
                    textTransform: "capitalize",
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    setRunAgain(true);
                    dispatch(language("en"));
                  }}
                >
                  English
                </span>
              </div>
              <div className={underline == "mr" ? styles.chotuContainer : styles.language}>
                <span
                  className={styles.language}
                  style={{
                    color: "white",
                    textTransform: "capitalize",

                    fontSize: "15px",
                  }}
                  onClick={() => {
                    setRunAgain(true);
                    dispatch(language("mr"));
                  }}
                >
                  Marathi
                </span>
              </div> */}
            {/* User Login Logout */}
            <Box
              sx={{ flexGrow: 6, display: { xs: "none", md: "flex" } }}
            ></Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button onClick={handleCloseNavMenu}>
                <Button onClick={chnageLaguage}>
                  {lang ? <English /> : <Marathi />}
                </Button>
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Link
                href="#"
                color="inherit"
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  textDecoration: "none",
                  ":hover": {
                    color: "white",
                  },
                }}
              >
                {_language === "en"
                  ? user?.userDao?.firstNameEn
                  : user?.userDao?.firstNameMr}{" "}
                {_language === "en"
                  ? user?.userDao?.lastNameEn
                  : user?.userDao?.lastNameMr}
              </Link>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ paddingLeft: 1 }}
                >
                  <AccountCircleIcon
                    sx={{ fontSize: "31px", color: "white" }}
                  />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))} */}
                <MenuItem
                  className={styles.menuList}
                  onClick={handleCloseUserMenu}
                >
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "14px" }}>
                      {_language === "en"
                        ? user?.userDao?.firstNameEn
                        : user?.userDao?.firstNameMr}{" "}
                      {_language === "en"
                        ? user?.userDao?.middleNameEn
                        : user?.userDao?.middleNameMr}{" "}
                      {_language === "en"
                        ? user?.userDao?.lastNameEn
                        : user?.userDao?.lastNameMr}
                    </Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography sx={{ color: "blue", fontSize: "12px" }}>
                      {user?.userDao?.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem>
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
                      router.push({
                        pathname: "./departmentPasswordChange",
                        query: {
                          // pageMode: "Edit",
                          // ...record,
                          // user: user?.userDao?.firstNameEn : user?.userDao?.firstNameMr,
                        },
                      });
                    }}
                    variant="standard"
                  >
                    Change Password
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* // End Responsive */}
      {/* Content */}
      <br />
      <br />
      <br />
      <div
        style={
          {
            // backgroundImage: `url(
            // "https://punemirror-dev.s3.ap-south-1.amazonaws.com/full/cc4349b6baf91888c72d7604daa8aad15df6eb82.jpg")`,
            // opacity: "0.2",
            // backgroundSize: "cover",
            //   resizeMode: "cover",
            //   backgroundRepeat: "repeat",
            //   // backgroundSize: "300px 100px",
            //   backgroundBlendMode: "lighten",
            //   height: "100vh",
            //   position: "absolute",
            //   // border: "2px solid black",
            //   height: "100vh",
            //   width: "100%",
            //   display: "flex",
            // }}
            // component="main"
            // sx={{
            //   flexGrow: 1,
            // backgroundSize: "cover",
            // height: "100vh",
            // marginTop: "-70px",
            // font-size:50px;
            // background-repeat:no-repeat;
          }
        }
        className={styles.backgroundImageCVR}
      >
        <div className={styles.backgroundImage}></div>

        {/* <DrawerHeader /> */}
        {/* <div className={styles.backgroundImageCVR}>
          <div className={styles.backgroundImage}></div>
          {usersDepartmentDashboardData.applications.length > 0
            ? usersDepartmentDashboardData.applications.map((data, index) => {
                return (
                  <div className={styles.content}>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aliquam erat in ante
                      malesuada, facilisis semper nulla semper. Phasellus sapien neque, faucibus in malesuada
                      quis, lacinia et libero. Sed sed turpis tellus. Etiam ac aliquam tortor, eleifend
                      rhoncus metus. Ut turpis massa, sollicitudin sit amet molestie a, posuere sit amet nisl.
                      Mauris tincidunt cursus posuere. Nam commodo libero quis lacus sodales, nec feugiat ante
                      posuere. Donec pulvinar auctor commodo. Donec egestas diam ut mi adipiscing, quis
                      lacinia mauris condimentum. Quisque quis odio venenatis, venenatis nisi a, vehicula
                      ipsum. Etiam at nisl eu felis vulputate porta.
                    </p>
                    <p>
                      Fusce ut placerat eros. Aliquam consequat in augue sed convallis. Donec orci urna,
                      tincidunt vel dui at, elementum semper dolor. Donec tincidunt risus sed magna dictum,
                      quis luctus metus volutpat. Donec accumsan et nunc vulputate accumsan. Vestibulum
                      tempor, erat in mattis fringilla, elit urna ornare nunc, vel pretium elit sem quis orci.
                      Vivamus condimentum dictum tempor. Nam at est ante. Sed lobortis et lorem in sagittis.
                      In suscipit in est et vehicula.
                    </p>
                  </div>
                );
              })
            : "NA"}
        </div> */}
        <Grid
          container
          // sx={{
          //   position: "absolute",
          //   overflow: "auto",
          //   backgroundImage: `url(
          //     "https://punemirror-dev.s3.ap-south-1.amazonaws.com/full/cc4349b6baf91888c72d7604daa8aad15df6eb82.jpg")`,
          //   opacity: "0.2",
          // }}
          columns={{ xs: 3, sm: 7, md: 12 }}
        >
          {usersDepartmentDashboardData?.applications?.length > 0
            ? usersDepartmentDashboardData?.applications?.map((data, index) => {
                const colorForMenu = data;
                return (
                  <Grid
                    item
                    xs={3}
                    sx={{
                      padding: "23px",
                      // position: "relative",
                    }}
                    className={styles.content}
                    key={index}
                  >
                    <a
                    // href={"http://localhost:4001/dashboard"}
                    >
                      <Card
                        style={{
                          // zIndex: "999",

                          // position: "relative",
                          display: "flex",
                          // justifyContent: "center",
                          // alignItems: "center",
                          height: "100%",
                          padding: "20px 10px 20px 10px",
                          cursor: "pointer",
                          borderRadius: "15px",
                          boxShadow: "5px 5px 4px 1px #85929E",
                          // border: "2px solid white",
                          backgroundColor: "#EAEDED",
                          // background: "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
                          // color: "white",
                        }}
                        sx={{
                          ":hover": {
                            // boxShadow: "2px 5px #556CD6",
                            // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                            transform: "scale3d(1.10, 1.05, 4)",
                            backgroundColor: "white",
                            // transform: "translate(-50%, -50%)",
                          },
                        }}
                        onClick={() => {
                          handleApplicationClick(data);
                        }}
                      >
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            // alignItems: "flex-start",
                            // justifyContent: "flex-start",
                            padding: "10px",
                          }}
                        >
                          <IconButton
                            sx={{
                              background:
                                "linear-Gradient(100deg,rgba(9,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                              color: "white",
                              border: "2px solid white",
                              padding: "9px",

                              // backgroundColor: "gray",
                              // background:
                              //   "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                            }}
                          >
                            <ComponentWithIcon iconName={data.icon} />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            //  flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            style={{
                              // background:  "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
                              fontWeight: 900,
                              // color: "white",
                              fontFamily: "sans-serif",
                              fontWeight: "normal",
                            }}
                          >
                            {_language === "en"
                              ? data.applicationNameEng
                              : data.applicationNameMr}
                          </Typography>
                        </Box>
                      </Card>
                    </a>
                  </Grid>
                );
              })
            : "NA"}
        </Grid>
        {/* <DrawerHeader /> */}
      </div>
      <LayoutFooter />
      <br />
      <br />
      <br />
    </>

    //  <Box sx={{ display: "flex" }}>
    //     <CssBaseline />
    //     <AppBar
    //       position="fixed"
    //       open={open}
    //       sx={{
    //         background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
    //         height: "50px",
    //       }}
    //     >
    //       {/* <Grid item className={styles.drawerIconContainer}>
    //             <IconButton
    //               color="inherit"
    //               aria-label="open drawer"
    //               onClick={handleDrawerOpen}
    //               edge="start"
    //               sx={{
    //                 marginRight: 5,
    //                 ...(open && { display: "none" }),
    //               }}
    //             >
    //               <MenuIcon />
    //             </IconButton>
    //           </Grid> */}{" "}
    //       {/* <Toolbar> */}
    //       <Grid container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    //         {/* <Grid item xs={1} className={styles.appIcon} sx={{ paddingBottom: "4px" }}>
    //         </Grid> */}
    //         <Image src="/logo.png" alt="Picturer" width={35} height={35} style={{ cursor: "pointer" }} />
    //         <Grid
    //           item
    //           xs={7}
    //           // ml={2}
    //           sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    //           className={styles.appNameContainer}
    //         >
    //           <Typography
    //             sx={{
    //               // color: "white",
    //               padding: "2%",
    //               typography: {
    //                 xs: "body1",
    //                 sm: "h6",
    //                 md: "h5",
    //                 lg: "h4",
    //                 xl: "h3",
    //               },
    //             }}
    //             className={styles.title1}
    //           >
    //             {underline === "en" ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION" : "पिंपरी-चिंचवड महानगरपालिका"}
    //           </Typography>
    //         </Grid>

    //         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    //           <div
    //             style={{
    //               display: "flex",
    //               alignItems: "center",
    //               justifyContent: "space-between",

    //               width: 120,
    //             }}
    //           >
    //             <div className={underline == "en" ? styles.chotuContainer : styles.language}>
    //               <span
    //                 className={styles.engLang}
    //                 style={{
    //                   color: "white",
    //                   border: "2px solid red",
    //                   fontSize: "15px",
    //                 }}
    //                 onClick={() => {
    //                   setRunAgain(true);
    //                   dispatch(language("en"));
    //                 }}
    //               >
    //                 English
    //               </span>
    //             </div>
    //             <div className={underline == "mr" ? styles.chotuContainer : styles.language}>
    //               <span
    //                 className={styles.language}
    //                 style={{
    //                   color: "white",
    //                   fontSize: "15px",
    //                 }}
    //                 onClick={() => {
    //                   setRunAgain(true);
    //                   dispatch(language("mr"));
    //                 }}
    //               >
    //                 Marathi
    //               </span>
    //             </div>
    //           </div>
    //         </Grid>
    //         {/* User Login Logout */}
    //         <Grid
    //           item
    //           xs={2}
    //           sx={{
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Box
    //             sx={{
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //           >
    //             <Link href="#" color="inherit">
    //               {_language === "en" ? user?.userDao?.firstNameEn : user?.userDao?.firstNameMr}{" "}
    //               {_language === "en" ? user?.userDao?.lastNameEn : user?.userDao?.lastNameMr}
    //             </Link>
    //           </Box>
    //           <IconButton
    //             size="large"
    //             aria-label="account of current user"
    //             aria-controls="menu-appbar"
    //             aria-haspopup="true"
    //             onClick={handleMenu}
    //             color="inherit"
    //           >
    //             <AccountCircle />
    //           </IconButton>

    //           <Menu
    //             id="menu-appbar"
    //             anchorEl={anchorEl}
    //             anchorOrigin={{
    //               vertical: "top",
    //               horizontal: "right",
    //             }}
    //             keepMounted
    //             transformOrigin={{
    //               vertical: "top",
    //               horizontal: "right",
    //             }}
    //             open={Boolean(anchorEl)}
    //             onClose={handleClose}
    //           >
    //             <MenuItem className={styles.menuList}>
    //               <Box
    //                 sx={{
    //                   width: "100%",
    //                 }}
    //               >
    //                 <Typography variant="body2" className={styles.menuTitle}>
    //                   Name :{" "}
    //                 </Typography>
    //                 <Typography>
    //                   {_language === "en" ? user?.userDao?.firstNameEn : user?.userDao?.firstNameMr}{" "}
    //                   {_language === "en" ? user?.userDao?.middleNameEn : user?.userDao?.middleNameMr}{" "}
    //                   {_language === "en" ? user?.userDao?.lastNameEn : user?.userDao?.lastNameMr}
    //                 </Typography>
    //               </Box>
    //               <Box className={styles.menuTitleContainer}>
    //                 <Typography variant="body2" className={styles.menuTitle}>
    //                   Email ID :{" "}
    //                 </Typography>
    //                 <Typography>{user?.userDao?.email}</Typography>
    //               </Box>
    //             </MenuItem>
    //             <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
    //               Logout
    //             </MenuItem>
    //           </Menu>
    //         </Grid>
    //       </Grid>
    //       {/* </Toolbar> */}
    //     </AppBar>
    //     {/* <Drawer variant="permanent" open={open}>
    //       <DrawerHeader>
    //         <IconButton onClick={handleDrawerClose} style={{ color: "white" }}>
    //           {theme.direction === "rtl" ? (
    //             <ChevronRightIcon />
    //           ) : (
    //             <ChevronLeftIcon />
    //           )}
    //         </IconButton>
    //       </DrawerHeader>
    //       <Divider />
    //       <List
    //         sx={{
    //           display: "flex",
    //           flexDirection: "column",
    //           width: "100%",
    //         }}
    //         component="nav"
    //         aria-labelledby="nested-list-subheader"
    //       >
    //         {res.length > 0
    //           ? res.map((text, index) => {
    //               return (
    //                 <Box key={index}>
    //                   <ListItemButton
    //                     style={{
    //                       cursor: "pointer",
    //                       display: text.isParent ? "flex" : "none",
    //                     }}
    //                     onClick={() => {
    //                       handleListItemsClick(text.id);
    //                     }}
    //                   >
    //                     {text.isParent !== null && (
    //                       <ListItemIcon>
    //                         <InboxIcon />
    //                       </ListItemIcon>
    //                     )}
    //                     {text.isParent !== null && (
    //                       <ListItemText primary={text.menuNameEng} />
    //                     )}
    //                     {text.isParent !== null &&
    //                       (openItemID === text.id ? (
    //                         <ExpandLessIcon />
    //                       ) : (
    //                         <ExpandMoreIcon />
    //                       ))}
    //                   </ListItemButton>
    //                   <Collapse
    //                     in={openCollapse && openItemID === text.parentId}
    //                     timeout="auto"
    //                     unmountOnExit
    //                   >
    //                     <List
    //                       style={{
    //                         display: text.menuNameEng ? "flex" : "none",
    //                       }}
    //                       component="div"
    //                       disablePadding
    //                       onClick={() => {
    //                         handleMenuSubListItemClick(text.clickTo, index);
    //                       }}
    //                     >
    //                       <ListItemButton sx={{ pl: 4 }}>
    //                         <ListItemIcon>
    //                           <InboxIcon />
    //                         </ListItemIcon>
    //                         <ListItemText primary={text.menuNameEng} />
    //                       </ListItemButton>
    //                       <Divider />
    //                     </List>
    //                   </Collapse>
    //                 </Box>
    //               );
    //             })
    //           : "NA"}
    //       </List>
    //     </Drawer> */}
    //     <Box
    //       component="main"
    //       sx={{ flexGrow: 1, paddingTop: "50px", backgroundColor: "#E5E8E8", height: "100vh" }}
    //     >
    //       {/* <DrawerHeader /> */}

    //       <Grid container columns={{ xs: 4, sm: 8, md: 12 }} sx={{ backgroundColor: "#E5E8E8" }}>
    //         {usersDepartmentDashboardData.applications.length > 0
    //           ? usersDepartmentDashboardData.applications.map((data, index) => {
    //               return (
    //                 <Grid item xs={3} sx={{ padding: "15px", backgroundColor: "#E5E8E8" }} key={index}>
    //                   <a
    //                   // href={"http://localhost:4001/dashboard"}
    //                   >
    //                     <Card
    //                       style={{
    //                         display: "flex",
    //                         justifyContent: "center",
    //                         alignItems: "center",
    //                         height: "100%",
    //                         cursor: "pointer",
    //                         borderRadius: "15px",
    //                         boxShadow: "5px 5px 4px 1px white",
    //                         // border: "2px solid white",
    //                         border: "2px solid white",
    //                         // backgroundColor: "#C3C3E5",
    //                         background: "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
    //                         color: "white",
    //                       }}
    //                       sx={{
    //                         ":hover": {
    //                           // boxShadow: "2px 5px #556CD6",
    //                           // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
    //                           transform: "scale3d(1.05, 1.05, 4)",
    //                           backgroundColor: "white",
    //                           // transform: "translate(-50%, -50%)",
    //                         },
    //                       }}
    //                       onClick={() => {
    //                         handleApplicationClick(data);
    //                       }}
    //                     >
    //                       <Box
    //                         style={{
    //                           display: "flex",
    //                           flexDirection: "column",
    //                           alignItems: "center",
    //                           justifyContent: "center",
    //                           padding: "10px",
    //                         }}
    //                       >
    //                         <IconButton
    //                           sx={{
    //                             color: "white",
    //                             border: "2px solid white",
    //                             // backgroundColor: "gray",
    //                             // background:
    //                             //   "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
    //                           }}
    //                         >
    //                           <ComponentWithIcon iconName={data.icon} />
    //                         </IconButton>
    //                         <Typography
    //                           variant="subtitle1"
    //                           style={{
    //                             fontWeight: 900,
    //                             color: "white",
    //                             fontFamily: "sans-serif",
    //                             fontWeight: "normal",
    //                           }}
    //                         >
    //                           {_language === "en" ? data.applicationNameEng : data.applicationNameMr}
    //                         </Typography>
    //                       </Box>
    //                     </Card>
    //                   </a>
    //                 </Grid>
    //               );
    //             })
    //           : "NA"}
    //       </Grid>
    //       {/* <DrawerHeader /> */}
    //       <LayoutFooter />
    //     </Box>
    //   </Box>

    // <Box sx={{ display: "flex" }}>
    //   <CssBaseline />
    //   <AppBar position="fixed" open={open}>
    //     <Toolbar>
    //       <Grid container>
    //         <Grid item className={styles.drawerIconContainer}>
    //           <IconButton
    //             color="inherit"
    //             aria-label="open drawer"
    //             onClick={handleDrawerOpen}
    //             edge="start"
    //             sx={{
    //               marginRight: 5,
    //               ...(open && { display: "none" }),
    //             }}
    //           >
    //             <MenuIcon />
    //           </IconButton>
    //         </Grid>
    //         <Grid item xs={1} className={styles.appIcon}>
    //           <Image
    //             src="/logo.png"
    //             alt="Picturer"
    //             width={50}
    //             height={50}
    //             style={{ cursor: "pointer" }}
    //           />
    //         </Grid>
    //         <Grid item xs={8} className={styles.appNameContainer}>
    //           <Typography className={styles.title1}>
    //             PIMPRI CHINCHWAD
    //           </Typography>
    //           <Typography className={styles.title1}>
    //             MUNICIPAL CORPORATION
    //           </Typography>
    //         </Grid>
    //         <Grid item xs={2}>
    //           <div className={styles.menuIcon}>
    //             <IconButton
    //               size="large"
    //               aria-label="account of current user"
    //               aria-controls="menu-appbar"
    //               aria-haspopup="true"
    //               onClick={handleMenu}
    //               color="inherit"
    //             >
    //               <AccountCircle />
    //             </IconButton>
    //             <Menu
    //               id="menu-appbar"
    //               anchorEl={anchorEl}
    //               anchorOrigin={{
    //                 vertical: "top",
    //                 horizontal: "right",
    //               }}
    //               keepMounted
    //               transformOrigin={{
    //                 vertical: "top",
    //                 horizontal: "right",
    //               }}
    //               open={Boolean(anchorEl)}
    //               onClose={handleClose}
    //             >
    //               <MenuItem className={styles.menuList}>
    //                 <Box
    //                   sx={{
    //                     width: "100%",
    //                   }}
    //                 >
    //                   <Typography variant="body2" className={styles.menuTitle}>
    //                     Name :{" "}
    //                   </Typography>
    //                   <Typography>ABCD MNOP</Typography>
    //                 </Box>
    //                 <Box className={styles.menuTitleContainer}>
    //                   <Typography variant="body2" className={styles.menuTitle}>
    //                     Role :{" "}
    //                   </Typography>
    //                   <Typography>Admin</Typography>
    //                 </Box>
    //                 <Box className={styles.menuTitleContainer}>
    //                   <Typography variant="body2" className={styles.menuTitle}>
    //                     Email ID :{" "}
    //                   </Typography>
    //                   <Typography>abcdmnop@gmail.component</Typography>
    //                 </Box>
    //               </MenuItem>
    //               <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
    //                 Logout
    //               </MenuItem>
    //             </Menu>
    //           </div>
    //         </Grid>
    //       </Grid>
    //     </Toolbar>
    //   </AppBar>
    //   <Drawer variant="permanent" open={open}>
    //     <DrawerHeader>
    //       <IconButton onClick={handleDrawerClose} style={{ color: "white" }}>
    //         {theme.direction === "rtl" ? (
    //           <ChevronRightIcon />
    //         ) : (
    //           <ChevronLeftIcon />
    //         )}
    //       </IconButton>
    //     </DrawerHeader>
    //     <Divider />
    //     <List
    //       sx={{
    //         display: "flex",
    //         flexDirection: "column",
    //         width: "100%",
    //       }}
    //       component="nav"
    //       aria-labelledby="nested-list-subheader"
    //     >
    //       {res.length > 0
    //         ? res.map((text, index) => {
    //             return (
    //               <Box key={index}>
    //                 <ListItemButton
    //                   style={{
    //                     cursor: "pointer",
    //                     display: text.isParent === "Y" ? "flex" : "none",
    //                   }}
    //                   onClick={() => {
    //                     handleListItemsClick(text.id);
    //                   }}
    //                 >
    //                   {text.isParent !== null && (
    //                     <ListItemIcon>
    //                       <InboxIcon />
    //                     </ListItemIcon>
    //                   )}
    //                   {text.isParent !== null && (
    //                     <ListItemText primary={text.menuNameEng} />
    //                   )}
    //                   {text.isParent !== null &&
    //                     (openItemID === text.id ? (
    //                       <ExpandLessIcon />
    //                     ) : (
    //                       <ExpandMoreIcon />
    //                     ))}
    //                 </ListItemButton>
    //                 <Collapse
    //                   in={openCollapse && openItemID === text.parentId}
    //                   timeout="auto"
    //                   unmountOnExit
    //                 >
    //                   <List
    //                     component="div"
    //                     disablePadding
    //                     onClick={() => {
    //                       handleMenuSubListItemClick(text.clickTo, index);
    //                     }}
    //                   >
    //                     <ListItemButton sx={{ pl: 4 }}>
    //                       <ListItemIcon>
    //                         <InboxIcon />
    //                       </ListItemIcon>
    //                       <ListItemText  primary={text.menuNameEng} />
    //                     </ListItemButton>
    //                     <Divider />
    //                   </List>
    //                 </Collapse>
    //               </Box>
    //             );
    //           })
    //         : "NA"}
    //     </List>
    //   </Drawer>
    //   <Box component="main" sx={{ flexGrow: 1 }}>
    //     <DrawerHeader />
    //     <Grid container>
    //       {usersDepartmentDashboardData.applications.length > 0
    //         ? usersDepartmentDashboardData.applications.map((data, index) => {
    //             return (
    //               <Grid item xs={6} sm={4} md={3} sx={{ padding: "10px" }} key={index}>
    //                 <Card
    //                   style={{
    //                     display: "flex",
    //                     justifyContent: "center",
    //                     alignItems: "center",
    //                     height: "100%",
    //                     cursor: "pointer",
    //                   }}
    //                 >
    //                   <CardContent
    //                     style={{
    //                       display: "flex",
    //                       flexDirection: "column",
    //                       alignItems: "center",
    //                       justifyContent: "center",
    //                     }}
    //                   >
    //                     <IconButton>
    //                       <AccessAlarmIcon style={{ fontSize: "30px" }} />
    //                     </IconButton>
    //                     <Typography variant="subtitle1">
    //                       {data.applicationNameEng}
    //                     </Typography>
    //                   </CardContent>
    //                 </Card>
    //               </Grid>
    //             );
    //           })
    //         : "NA"}
    //     </Grid>
    //   </Box>
    // </Box>
    //////////////////////////////////////////////////////////////////////
    // <Box sx={{ display: "flex"}}>
    //   <CssBaseline />
    //   <Box
    //     component="nav"
    //     sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    //     aria-label="mailbox folders"
    //   >
    //     <Drawer
    //       variant="permanent"
    //       sx={{
    //         display: { xs: "none", sm: "block" },
    //         "& .MuiDrawer-paper": {
    //           boxSizing: "border-box",
    //           width: drawerWidth,
    //         },
    //       }}
    //       open
    //     >
    //       <DrawerList />
    //     </Drawer>
    //     <Drawer
    //       container={container}
    //       variant="temporary"
    //       open={mobileOpen}
    //       onClose={handleDrawerToggle}
    //       ModalProps={{
    //         keepMounted: true,
    //       }}
    //       sx={{
    //         display: { xs: "block", sm: "none" },
    //         "& .MuiDrawer-paper": {
    //           boxSizing: "border-box",
    //           width: drawerWidth,
    //         },
    //       }}
    //     >
    //       <DrawerList />
    //     </Drawer>
    //   </Box>
    //   <Box
    //     component="main"
    //     sx={{
    //       flexGrow: 1,
    //       p: 3,
    //       width: { sm: `calc(100% - ${drawerWidth}px)` },
    //     }}
    //   >
    //     <Toolbar />
    //     <Grid container>
    //       {usersDepartmentDashboardData.applications.length > 0
    //         ? usersDepartmentDashboardData.applications.map((data, index) => {
    //             return (
    //               <Grid item xs={6} sm={4} md={3} sx={{ padding: "10px" }}>
    //                 <Card
    //                   style={{
    //                     display: "flex",
    //                     flexDirection: "column",
    //                     justifyContent: "center",
    //                     alignItems: "center",
    //                     height: "100%",
    //                     cursor: "pointer",
    //                   }}
    //                 >
    //                   <IconButton>
    //                     <AccessAlarmIcon style={{ fontSize: "30px" }} />
    //                   </IconButton>
    //                   <CardContent>
    //                     <Typography variant="subtitle1">
    //                       {data.applicationNameEng}
    //                     </Typography>
    //                   </CardContent>
    //                 </Card>
    //               </Grid>
    //             );
    //           })
    //         : "NA"}
    //     </Grid>
    //   </Box>
    // </Box>
  );
};

DepartmentDashboard.propTypes = {
  window: PropTypes.func,
};

export default DepartmentDashboard;
