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
  const [fontSize, setFontSize] = useState(15);
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
    console.log(`hii`);
    console.log("e", e);
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

  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
    setIsHovered(true);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
    setIsHovered(false);
  };

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return (
      <Icon
        style={{
          fontSize: "50px",
          // color: 'orange',
          transition: "transform 0.1s",
        }}
        color={isHovered ? "white" : "orange"}
      />
    );
  };
  const changeIconColor = (color) => {
    const icons = document.querySelectorAll(".icon-element");
    icons.forEach((icons) => {
      icons.style.color = color;
    });
    const elements = document.querySelectorAll(".background-element");

    elements.forEach((element) => {
      element.style.borderRight = `thick double ${color}`;
    });
  };

  const changeFontColor = (color) => {
    const textElements = document.querySelectorAll(".text-element");
    textElements.forEach((textElement) => {
      textElement.style.color = color;
    });
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
                // fontSize: `${fontSize + 2}px !important`,
                fontSize: "16px !important",
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
            {/* <Box
              sx={{ flexGrow: 14, display: { xs: 'none', md: 'flex' } }}
            ></Box>
            <div className={styles.fontButtonGroup}>
              {[
                { label: 'A+', fontSize: 18 },
                { label: 'A', fontSize: 15 },
                { label: 'A-', fontSize: 12 },
              ].map((fontButton) => (
                <span
                  className={styles.fontButtons}
                  style={{ fontSize: 15 }}
                  onClick={() => setFontSize(fontButton.fontSize)}
                >
                  {fontButton.label}
                </span>
              ))}
            </div> */}
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
                  display: {
                    xs: "none",
                    md: "inline-flex",
                    fontSize: "16px !important",
                  },
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
                        pathname: "../departmentPasswordChange",
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
      {/* <br />
      <br />
      <br /> */}
      <div
        style={{
          background: "#EFF2F7",
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
        }}
      >
        <div className={styles.backgroundImageDashboardV1}></div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "10px",
            float: "right",
            position: "relative",
            zIndex: "1",
          }}
        >
          <div
            style={{
              display: "flex",
              margin: "5px",
              placeItems: "center",
            }}
          >
            {[
              { label: "A+", fontSize: 15 },
              { label: "A", fontSize: 12 },
              { label: "A-", fontSize: 10 },
            ].map((fontButton) => (
              <span
                key={fontButton.label}
                className={styles.fontButtons}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  border: "1px solid white",
                  color: "black",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "5px",
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: "15px",
                }}
                onClick={() => setFontSize(fontButton.fontSize)}
              >
                {fontButton.label}
              </span>
            ))}
          </div>
          <div style={{ marginRight: "20px" }}>
            <h3>
              {_language === "en" ? "Icon Color" : "आयकॉन रंग"}{" "}
              <input
                type="color"
                defaultValue="#0b669e"
                onChange={(e) => changeIconColor(e.target.value)}
              />
            </h3>
          </div>

          <div style={{ marginRight: "20px" }}>
            <h3>
              {_language === "en" ? "Font Color" : "फॉन्टचा रंग"}{" "}
              <input
                type="color"
                onChange={(e) => changeFontColor(e.target.value)}
              />
            </h3>
          </div>
        </div>
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
          sx={{
            marginTop: "45px",
          }}
          columns={{ xs: 2, sm: 8, md: 12 }}
        >
          {usersDepartmentDashboardData?.applications?.length > 0
            ? usersDepartmentDashboardData?.applications?.map((data, index) => {
                const colorForMenu = data;
                return (
                  <Grid
                    item
                    xs={2}
                    sx={
                      {
                        // padding: "0px",
                        // position: "relative",
                      }
                    }
                    className={styles.content}
                    key={index}
                    style={{
                      padding: "15px",
                    }}
                  >
                    <a
                    // href={"http://localhost:4001/dashboard"}
                    >
                      <Card
                        className={styles.cardBGIMage}
                        onMouseEnter={() => handleCardHover(data.id)}
                        onMouseLeave={handleCardLeave}
                        style={{
                          // zIndex: "999",
                          border: "1px solid #FFD494",
                          // position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "140px",
                          // padding: "20px 10px 20px 10px",
                          // cursor: "pointer",
                          borderRadius: "20px",
                          marginTop: "20px",
                          // boxShadow: "0px 2px 2px 0px #85929E",
                          // border: "2px solid white",
                          backgroundColor: "#fff",
                          // background: "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
                          // color: "white",
                          transition: "all 0.3s ease-in-out",
                        }}
                        sx={{
                          ":hover": {
                            // boxShadow: "2px 5px #556CD6",
                            // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                            // transform: "scale3d(1.05, 1.15, 1)",
                            // transform: "translate(-50%, -50%)",
                            background:
                              "linear-gradient(to right, transparent 50%, #FFD494 50%)",
                            backgroundPosition: "0 0",
                            backgroundSize: "200% 100%",
                            backgroundPosition: "100% 0",
                            color: "#fff",
                            transition: "all 0.3s ease-in-out",
                          },
                        }}
                        onClick={() => {
                          handleApplicationClick(data);
                        }}
                      >
                        <Box
                          className={styles.vibratingImage}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            // height: "100px",
                            height: "50%",
                            padding: "10px",
                          }}
                        >
                          {/* <IconButton
                            sx={{
                              background: 'transparent',
                              // color: "orange",
                              border: '2px solid white',
                              padding: '0px',
                              // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                              // backgroundColor: "gray",
                              // background:
                              //   "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                            }}
                          >
                            <ComponentWithIcon iconName={data.icon} />
                          </IconButton> */}
                          <div
                            className="icon-element"
                            style={{ color: "orange" }}
                          >
                            <ComponentWithIcon
                              className="icon-element"
                              iconName={data.icon}
                            />
                          </div>
                        </Box>
                        <Box
                          sx={{
                            // display: "flex",
                            // //  flexDirection: "column",
                            // alignItems: "center",
                            // justifyContent: "center",
                            textAlign: "center",
                            // height: "30px",
                          }}
                        >
                          <Typography
                            className="text-element"
                            variant="subtitle1"
                            style={{
                              // background:  "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
                              // fontSize: '15px',
                              fontSize: fontSize,
                              fontFamily: "revert",
                              fontWeight: "medium",
                              height: "50%",
                            }}
                          >
                            {_language === "en"
                              ? data.applicationNameEng
                              : data.applicationNameMr}
                          </Typography>
                        </Box>
                        {/* {hoveredCard === data.id && (
                          <div>
                            <Box
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              <Button
                                onClick={handleApplicationClick(data)}
                                sx={{
                                  background: "white",
                                  color: "orange",
                                  fontWeight: "900",
                                  display: "block",
                                  marginBottom: "10px",
                                  ":hover": {
                                    background: "white",
                                    color: "orange",
                                    fontWeight: "900",
                                    marginBottom: "10px",
                                  },
                                }}
                              >
                                Explore
                              </Button>
                            </Box>
                          </div>
                        )} */}
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
      {/* <br />
      <br />
      <br /> */}
    </>
  );
};

DepartmentDashboard.propTypes = {
  window: PropTypes.func,
};

export default DepartmentDashboard;
