import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./[firstHeaderDepartment].module.css";
// import HeaderAvatar from "../../containers/Layout/components/HeaderAvatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeIcon from "@mui/icons-material/Home";
import Drawer from "@mui/material/Drawer";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { language } from "../../../../features/labelSlice";
import {
  logout,
  setUsersDepartmentDashboardData,
  setSelectedBreadcrumbApplication,
} from "../../../../features/userSlice";

import urls from "../../../../URLS/urls";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 320;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// const openedMixin = (theme) => ({
//   width: "25%",
//   height: "92%",
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     // duration: theme.transitions.duration.enteringScreen,
//     duration: 400,
//   }),
//   overflowX: "hidden",
//   // display: "inline",
// });

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     // duration: theme.transitions.duration.leavingScreen,
//     duration: 600,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   height: "92%",
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   backgroundColor: "#556CD6",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     // marginLeft: drawerWidth,
//     marginLeft: "25%",
//     width: `calc(100% - 25%)`,
//     // width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   // width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "normal",
//   boxSizing: "border-box",
//   ...(open && {
//     ...openedMixin(theme),
//     "& .MuiDrawer-paper": openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));

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

const FirstHeaderDepartment = (props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [runAgain, setRunAgain] = useState(false);
  const _language = useSelector((state) => state?.labels.language);
  const user = useSelector((state) => state?.user.user);
  const _user = useSelector((state) => state?.user);

  const [age, setAge] = useState(_language);
  // const theme = useTheme();
  const [openCollapse, setOpenCollapse] = React.useState(false);

  console.log("3434", props);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  // const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [openItemID, setOpenItemID] = useState(null);
  const selectedApplicationId = useSelector((state) => {
    return state.user.selectedApplicationId;
  });

  const response = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });

  const underline = useSelector((state) => state?.labels.language);

  const [applications, setApplications] = useState([]);

  const usersDepartmentDashboardData = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });

  useEffect(() => {
    setApplications(usersDepartmentDashboardData?.applications);
  }, [usersDepartmentDashboardData]);

  useEffect(() => {
    setRunAgain(false);
    // getApplication();
  }, [runAgain]);

  let arr = [];
  let objj = {};
  let res = [];

  console.log("response", response);

  let abc = response?.menus?.filter((val) => {
    return val.appKey === selectedApplicationId;
  });

  arr = response?.menus?.filter((val) => {
    return val.isParent === "Y";
  });

  arr?.map((val) => {
    let childEle = abc
      .sort((a, b) => (a.menuNameEng > b.menuNameEng ? 1 : -1))
      .filter((value) => {
        return val.id == value.parentId;
      });

    console.log("childEle", childEle);

    objj[val.menuNameEng] = childEle;

    res.push(val);
    res.push(...childEle);

    return val;
  });

  const handleChange = (event) => {
    setRunAgain(true);
    dispatch(language(event.target.value));
    setAge(event.target.value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const handleDrawerOpen = () => {
  //   console.log("drawer opem");
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  function handleListItemsClick(key) {
    if (openCollapse == false) {
      setOpenItemID(key);
      setOpenCollapse(true);
    } else {
      setOpenItemID(null);
      setOpenCollapse(false);
    }
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(language("en"));
    dispatch(logout());
    dispatch(setUsersDepartmentDashboardData(null));
    localStorage.setItem("loggedInUser", null);
    router.push("/login");
  };

  const handleMenuSubListItemClick = (value, id) => {
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    console.log("clickedMenuuuu", value, "id", id);
    localStorage.setItem("selectedMenuFromDrawer", id);
    dispatch(setSelectedBreadcrumbApplication(null));
    router.push(value);
  };

  const getApplication = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res", r);
          setApplications(r.data.application);
        } else {
          message.error("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
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
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <Button
                sx={{
                  paddingLeft: "2px",
                  paddingRight: "7px",
                  color: "white",
                  fontSize: isSmallScreen ? "12px" : "14px",
                  // textTransform: "capitalize",
                  ":hover": {
                    border: "1px solid white",
                    // backgroundColor: "white",
                    // color: "blue",
                  },
                }}
                variant="outlined"
              >
                <MenuIcon
                  sx={{
                    paddingRight: "2px",
                    marginRight: "5px",
                  }}
                />
                Menu
              </Button>
            </IconButton>
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
                // fontSize: isSmallScreen ? "22px" : "4px",
                // border:'solid red',
                padding: "2%",
                typography: {
                  xs: "body1",
                  sm: "body1",
                  md: "body2",
                  lg: "body2",
                  xl: "body2",
                },
                display: { xs: "none", md: "flex" },
              }}
              // className={styles.title1}
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
                        fontSize: "10px",
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
                        fontSize: "10px",
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
                <Button
                  size="small"
                  sx={{
                    color: "black",
                    textTransform: "capitalize",
                    fontWeight: "normal",
                  }}
                  onClick={() =>
                    // router.push(`/DepartmentDashboard/dashboardV1`)
                    router.push(`/DepartmentDashboard`)
                  }
                >
                  {/* Home */}
                  <HomeIcon />
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
                // color: "red",
                padding: "1%",
                // typography: {
                //   xs: "body1",
                //   sm: "h6",
                //   md: "h6",
                //   lg: "h5",
                //   xl: "h5",
                // },
                fontSize: isSmallScreen ? "12px" : "14px",
                display: { xs: "flex", md: "none" },
              }}
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
              sx={{
                flexGrow: 6,
                display: { xs: "none", md: "flex" },
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: isSmallScreen ? "12px" : "14px",
                }}
              >
                {_language === "en"
                  ? applications?.find(
                      (obj) => obj?.id === _user?.selectedApplicationId
                    )?.applicationNameEng
                  : applications?.find(
                      (obj) => obj?.id === _user?.selectedApplicationId
                    )?.applicationNameMr}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <Button
                sx={{ color: "white", textTransform: "capitalize" }}
                // onClick={() => router.push(`/DepartmentDashboard/dashboardV1`)}
                onClick={() => router.push(`/DepartmentDashboard`)}
              >
                {underline === "en" ? "Home" : "मुख्यपृष्ठ"}
              </Button>
            </Box>
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
                    {/* <Typography variant="body2" className={styles.menuTitle}>
                    Name :{" "}
                  </Typography> */}

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
                    {/* <Typography variant="body2" className={styles.menuTitle}>
                    Email ID :{" "}
                  </Typography> */}
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
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <br />
      <br />

      <Drawer
        // PaperProps={{
        //   sx: {
        //     // backgroundColor: "#66D3FF",
        //     backgroundColor: "#F2F3F4",
        //   },
        // }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          sx={{
            height: "100%",
            display: "flex",
            // border: "1px solid red",
            flexDirection: "column",
            width: "100%",
          }}
          component="nav"
          // onMouseOut={handleDrawerClose}
          // onMouseOver={handleDrawerOpen}
          aria-labelledby="nested-list-subheader"
        >
          {res.length > 0
            ? res.map((text, index) => {
                return (
                  <Box
                    key={index}
                    // onMouseOut={handleDrawerClose}
                    // onMouseOver={handleDrawerOpen}

                    // sx={{
                    // boxSizing: "content-box",
                    // }}
                  >
                    <ListItemButton
                      style={{
                        cursor: "pointer",
                        display: text.isParent ? "flex" : "none",
                      }}
                      // sx={{
                      // ":hover": {
                      // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                      // color: "white",
                      // },
                      // }}
                      onClick={() => {
                        handleListItemsClick(text.id);
                      }}
                    >
                      {text.isParent !== null && (
                        <ListItemIcon onMouseOver={handleDrawerOpen}>
                          <InboxIcon style={{ color: "#1D6EBE" }} />
                        </ListItemIcon>
                      )}
                      {text.isParent !== null && (
                        <ListItemText
                          sx={{ color: "blue" }}
                          primary={
                            _language == "en"
                              ? text.menuNameEng
                              : text.menuNameMr
                          }
                        />
                      )}
                      {text.isParent !== null &&
                        (openItemID === text.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        ))}
                    </ListItemButton>
                    <Collapse
                      in={openCollapse && openItemID === text.parentId}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        // onMouseOut={handleDrawerClose}
                        // onMouseOver={handleDrawerOpen}
                        style={{
                          display: text.menuNameEng ? "flex" : "none",
                          backgroundColor: "#E7F4FF",
                          fontSize: "0.877em",
                          // color: "#545B63",
                          // backgroundColor: "#99E1FE",
                        }}
                        sx={{
                          display: "inline",
                          ":hover": {
                            color: "blue",
                          },
                          // boxSizing: "content-box",
                        }}
                        // onClose={handleDrawerClose}
                        // onMouseOut={handleDrawerClose}
                        component="div"
                        disablePadding
                        onClick={() => {
                          handleMenuSubListItemClick(text.clickTo, text.id);
                        }}
                      >
                        <ListItemButton
                          sx={{
                            // pl: 4,
                            paddingLeft: "-4px",
                            borderLeft: "11px solid white",
                            // borderTop: "1px solid white",
                            borderBottom: "2px solid white",
                            borderRight: "1px solid white",
                          }}
                        >
                          <ListItemIcon>
                            <DescriptionIcon
                              sx={{
                                fontSize: "16px",
                                color: "white",
                                border: "1px solid white",
                                backgroundColor: "#2BB2E8",
                                // ":hover": {
                                //   color: "blue",
                                //   backgroundColor: "blue",
                                // },
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            disableTypography
                            sx={{
                              // wordWrap: "word-break",
                              // wordBreak: "keep-all",
                              // wordWrap: "break-word",
                              marginLeft: "-23px",
                              // display: "inline-block",
                              fontSize: "14px",
                            }}
                            primary={
                              _language == "en"
                                ? text.menuNameEng
                                : text.menuNameMr
                            }
                          />
                        </ListItemButton>
                        <Divider />
                      </List>
                    </Collapse>
                  </Box>
                );
              })
            : "NA"}
        </List>
        {/* <Divider /> */}
        {/* <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      {/* <DrawerHeader /> */}
      {/* <Main open={open}>
        <BasicLayout />
      </Main> */}
    </>
    // <Box
    //   style={{
    //     display: "flex",
    //   }}
    // >
    //   <CssBaseline />
    //   <AppBar
    //     position="fixed"
    //     open={open}
    //     sx={{
    //       background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
    //       height: "50px",
    //       // border: "2px solid red",
    //     }}
    //   >
    //     {/* <Toolbar> */}
    //     <Grid container>
    //       <Grid item className={styles.drawerIconContainer} xs={1} sx={{ paddingLeft: "10px" }}>
    //         <IconButton
    //           color="inherit"
    //           aria-label="open drawer"
    //           onClick={handleDrawerOpen}
    //           // onMouseOver={handleDrawerOpen}
    //           edge="start"
    //           sx={{
    //             marginRight: 4,
    //             // marginLeft: "none",
    //             ...(open && { display: "none" }),
    //           }}
    //         >
    //           <MenuIcon />
    //         </IconButton>
    //         <Image
    //           src="/logo.png"
    //           alt="Picturer"
    //           width={40}
    //           height={40}
    //           style={{
    //             // marginRight: 4,
    //             marginBottom: 3,
    //             marginTop: -3,
    //             cursor: "pointer",
    //           }}
    //         />
    //       </Grid>
    //       {/* <Grid
    //         sx={{
    //           // marginRight: 1,
    //         }}
    //         item xs={1} className={styles.appIcon}>
    //           <Image

    //             src="/logo.png"
    //             alt="Picturer"
    //             width={50}
    //             height={50}
    //             style={{
    //               // marginRight:5,
    //                cursor: "pointer" }}
    //           />
    //         </Grid> */}
    //       <Grid
    //         sx={{
    //           marginLeft: 2,
    //           ...(!open && { marginRight: 10 }),
    //         }}
    //         item
    //         xs={5}
    //         className={styles.appNameContainer}
    //       >
    //         {/* <Typography className={styles.title1}>
    //             {underline === "en" ? "PIMPRI CHINCHWAD" : "पिंपरी-चिंचवड"}
    //           </Typography>
    //           <Typography className={styles.title1}>
    //             {underline === "en" ? "MUNICIPAL CORPORATION" : "महानगरपालिका"}
    //           </Typography> */}
    //         <Typography className={styles.title1}>
    //           {underline === "en" ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION" : "पिंपरी-चिंचवड महानगरपालिका"}
    //         </Typography>
    //       </Grid>
    //       <Grid
    //         item
    //         xs={2}
    //         sx={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <div
    //           style={{
    //             // border: "2px solid red",
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "space-between",
    //             width: 120,
    //           }}
    //         >
    //           <div className={underline == "en" ? styles.chotuContainer : styles.language}>
    //             <span
    //               className={styles.engLang}
    //               style={{
    //                 color: "white",
    //                 fontSize: "15px",
    //               }}
    //               onClick={() => {
    //                 setRunAgain(true);
    //                 dispatch(language("en"));
    //               }}
    //             >
    //               English
    //             </span>
    //           </div>
    //           <div className={underline == "mr" ? styles.chotuContainer : styles.language}>
    //             <span
    //               className={styles.language}
    //               style={{
    //                 color: "white",
    //                 fontSize: "15px",
    //               }}
    //               onClick={() => {
    //                 setRunAgain(true);
    //                 dispatch(language("mr"));
    //               }}
    //             >
    //               Marathi
    //             </span>
    //           </div>
    //         </div>
    //       </Grid>
    //       <Grid
    //         item
    //         xs={1}
    //         sx={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         {" "}
    //         <Button
    //           sx={{ color: "white", textTransform: "capitalize", fontWeight: "normal" }}
    //           onClick={() => router.push(`/DepartmentDashboard`)}
    //         >
    //           Home
    //         </Button>
    //       </Grid>

    //       <Grid
    //         item
    //         xs={2}
    //         sx={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //           }}
    //         >
    //           <Link href="#" color="inherit">
    //             {_language === "en" ? user?.userDao?.firstNameEn : user?.userDao?.firstNameMr}{" "}
    //             {_language === "en" ? user?.userDao?.middleNameEn : user?.userDao?.middleNameMr}{" "}
    //             {_language === "en" ? user?.userDao?.lastNameEn : user?.userDao?.lastNameMr}
    //           </Link>
    //         </Box>
    //         <IconButton
    //           size="large"
    //           aria-label="account of current user"
    //           aria-controls="menu-appbar"
    //           aria-haspopup="true"
    //           onClick={handleMenu}
    //           color="inherit"
    //         >
    //           <AccountCircle />
    //         </IconButton>

    //         <Menu
    //           id="menu-appbar"
    //           anchorEl={anchorEl}
    //           anchorOrigin={{
    //             vertical: "top",
    //             horizontal: "right",
    //           }}
    //           keepMounted
    //           transformOrigin={{
    //             vertical: "top",
    //             horizontal: "right",
    //           }}
    //           open={Boolean(anchorEl)}
    //           onClose={handleClose}
    //         >
    //           <MenuItem className={styles.menuList}>
    //             <Box
    //               sx={{
    //                 width: "100%",
    //               }}
    //             >
    //               <Typography variant="body2" className={styles.menuTitle}>
    //                 Name :{" "}
    //               </Typography>
    //               <Typography>
    //                 {_language === "en" ? user?.userDao?.firstNameEn : user?.userDao?.firstNameMr}{" "}
    //                 {_language === "en" ? user?.userDao?.middleNameEn : user?.userDao?.middleNameMr}{" "}
    //                 {_language === "en" ? user?.userDao?.lastNameEn : user?.userDao?.lastNameMr}
    //               </Typography>
    //             </Box>
    //             <Box className={styles.menuTitleContainer}>
    //               <Typography variant="body2" className={styles.menuTitle}>
    //                 Email ID :{" "}
    //               </Typography>
    //               <Typography>{user?.userDao?.email}</Typography>
    //             </Box>
    //           </MenuItem>
    //           <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
    //             {_language === "en" ? "Logout" : "बाहेर पडा"}
    //           </MenuItem>
    //         </Menu>
    //       </Grid>
    //     </Grid>
    //     {/* </Toolbar> */}
    //   </AppBar>
    //   <Drawer
    //     variant="permanent"
    //     open={open}

    //     // PaperProps={{ style: { width: '26%' } }}
    //   >
    //     <DrawerHeader
    //       sx={{
    //         // border: "2px solid red",
    //         backgroundColor: "white",
    //         // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
    //       }}
    //     >
    //       <IconButton
    //         // onMouseOver={handleDrawerClose}
    //         onClick={handleDrawerClose}
    //         style={{ color: "black" }}
    //       >
    //         {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    //       </IconButton>
    //     </DrawerHeader>
    //     <Divider />
    //     <List
    //       sx={{
    //         display: "flex",
    //         // border: "1px solid red",
    //         flexDirection: "column",
    //         width: "100%",
    //       }}
    //       component="nav"
    //       aria-labelledby="nested-list-subheader"
    //     >
    //       {res.length > 0
    //         ? res.map((text, index) => {
    //             return (
    //               <Box
    //                 key={index}
    //                 // onMouseOut={handleDrawerClose}
    //                 // sx={{
    //                 // boxSizing: "content-box",
    //                 // }}
    //               >
    //                 <ListItemButton
    //                   style={{
    //                     cursor: "pointer",
    //                     display: text.isParent ? "flex" : "none",
    //                   }}
    //                   // sx={{
    //                   // ":hover": {
    //                   // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
    //                   // color: "white",
    //                   // },
    //                   // }}
    //                   onClick={() => {
    //                     handleListItemsClick(text.id);
    //                   }}
    //                 >
    //                   {text.isParent !== null && (
    //                     <ListItemIcon onMouseOver={handleDrawerOpen}>
    //                       <InboxIcon style={{ color: "#56B3D9" }} />
    //                     </ListItemIcon>
    //                   )}
    //                   {text.isParent !== null && (
    //                     <ListItemText primary={_language == "en" ? text.menuNameEng : text.menuNameMr} />
    //                   )}
    //                   {text.isParent !== null &&
    //                     (openItemID === text.id ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
    //                 </ListItemButton>
    //                 <Collapse in={openCollapse && openItemID === text.parentId} timeout="auto" unmountOnExit>
    //                   <List
    //                     onMouseOut={handleDrawerClose}
    //                     onMouseOver={handleDrawerOpen}
    //                     style={{
    //                       display: text.menuNameEng ? "flex" : "none",
    //                       backgroundColor: "#DFF3FC",
    //                       // backgroundColor: "#99E1FE",
    //                     }}
    //                     sx={{
    //                       ":hover": {
    //                         color: "blue",
    //                       },
    //                       // boxSizing: "content-box",
    //                     }}
    //                     component="div"
    //                     disablePadding
    //                     onClick={() => {
    //                       handleMenuSubListItemClick(text.clickTo, text.id);
    //                     }}
    //                   >
    //                     <ListItemButton
    //                       sx={{
    //                         pl: 4,
    //                         paddingLeft: "-10px",
    //                         borderLeft: "20px solid white",
    //                         // borderTop: "1px solid white",
    //                         borderBottom: "1px solid white",
    //                         borderRight: "5px solid white",
    //                       }}
    //                     >
    //                       <ListItemIcon>
    //                         <DescriptionIcon
    //                           sx={{
    //                             color: "white",
    //                             border: "1px solid white",
    //                             backgroundColor: "#2BB2E8",
    //                             // ":hover": {
    //                             //   color: "blue",
    //                             //   backgroundColor: "blue",
    //                             // },
    //                           }}
    //                         />
    //                       </ListItemIcon>
    //                       <ListItemText
    //                         sx={{
    //                           // border: "solid red",
    //                           // boxSizing: "border-box",
    //                           // width: "200px",
    //                           display: "inline-block",
    //                         }}
    //                         primary={_language == "en" ? text.menuNameEng : text.menuNameMr}
    //                       />
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
    //   {/* <Box
    //     sx={{
    //       padding: "80px",
    //       backgroundColor: "#556CD6",
    //       width: "100%",
    //       display: "flex",
    //       alignItems: "center",
    //     }}
    //   >
    //     <IconButton
    //       sx={{ color: "black" }}
    //       aria-label="upload picture"
    //       component="label"
    //     >
    //       <ArrowBackIcon />
    //     </IconButton>
    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         width: "100%",
    //       }}
    //     >
    //       <Typography variant="h5">Component name</Typography>
    //     </Box>
    //   </Box> */}
    //   {/* <Box component="main" sx={{ flexGrow: 1 }}>

    //     {children}
    //   </Box> */}

    //   {/* <AppBar
    //     position="fixed"
    //     style={{
    //       width:
    //         router.asPath == "/DepartmentDashboard"
    //           ? `calc(100% - ${drawerWidth}px)`
    //           : "",
    //       ml: router.asPath == "/DepartmentDashboard" ? `${drawerWidth}px` : "",
    //     }}
    //     sx={{
    //       width: { sm: `calc(100% - ${drawerWidth}px)` },
    //       ml: { sm: `${drawerWidth}px` },
    //     }}
    //   >
    //     <Toolbar>
    //       <Grid container>
    //         <Grid item xs={1} className={styles.drawerIconContainer}>
    //           <IconButton
    //             onClick={handleDrawerToggle}
    //             sx={{ mr: 2, display: { sm: "none" } }}
    //             size="large"
    //             edge="start"
    //             color="inherit"
    //             aria-label="menu"
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
    //         <Grid item xs={6} className={styles.appNameContainer}>
    //           <Typography className={styles.title1}>
    //             Pimpri Chinchwad
    //           </Typography>
    //           <Typography className={styles.title1}>
    //             Municipal Corporation
    //           </Typography>
    //         </Grid>
    //         <Grid
    //           item
    //           xs={2}
    //           style={{
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "space-evenly",
    //           }}
    //         >
    //           <FormControl fullWidth size="small" variant="standard">
    //             <Select
    //               labelId="demo-simple-select-label"
    //               id="demo-simple-select"
    //               value={age}
    //               label="Language"
    //               onChange={handleChange}
    //               style={{
    //                 color: "white",
    //               }}
    //               labelStyle={{ color: "#ff0000" }}
    //               sx={{
    //                 ".MuiSvgIcon-root ": {
    //                   fill: "white !important",
    //                 },
    //               }}
    //             >
    //               <MenuItem value={"en"}>English</MenuItem>
    //               <MenuItem value={"mr"}>Marathi</MenuItem>
    //             </Select>
    //           </FormControl>
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
    //   </AppBar> */}
    // </Box>
  );
};

export default FirstHeaderDepartment;
