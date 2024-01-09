import { useEffect, useState } from "react";
import * as React from "react";
import {
  Box, Link,
  Typography,
  Grid,
  Tooltip,
  Card,
  CardHeader,
  Modal,
  Badge,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AbcIcon from "@mui/icons-material/Abc";
import AdjustIcon from "@mui/icons-material/Adjust";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import * as MuiIcons from "@mui/icons-material";
import { setApplicationName } from "../../../features/userSlice";
import styles from './[DashboardTabs].module.css'


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

// multi dept modal close


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

const DashboardTabs = (props) => {
  const [fontSize, setFontSize] = useState(15)
  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon 
    style={{ fontSize: fontSize + 40, }}
     />;
  };
  let [value, setValue] = useState(0);
  const [isCardClick, setCardClick] = useState(false)
  const [clickedTitle, setClickTitle] = useState('')

  const [clickedIcon, setClickIcon] = useState('false')


  const handleCancel1 = () => {
    setCardClick(false);
    // setValue("isApplicationMultiDept", "false");
  };
  const usersCitizenDashboardData = useSelector((state) => {
    console.log(
      "usersCitizenDashboardData",
      state.user.usersCitizenDashboardData
    );
    return state.user.usersCitizenDashboardData;
  });
  let language = useSelector((state) => state.labels.language);

  const user = useSelector((state) => {
    return state.user.user;
  });

  const dispatch = useDispatch();
  const modalStyles = {
    overlay: {
      backgroundColor: '#ffffff',
    },
  };
  let [services, setServices] = useState(getServicesByAppId(getAppId(0)));

  const router = useRouter();

  function getServicesByAppId(appId) {
    return usersCitizenDashboardData?.services
      .filter((v) => appId === v.application)
      .map((r) => r);
  }

  function getAppId(index) {
    return usersCitizenDashboardData?.applications[index]?.id;
  }

  // let res = [];
  // res = usersCitizenDashboardData.applications.map((val) => {
  //   // let childEle = usersCitizenDashboardData.menus.filter(
  //     //   (value) => val.id == value.appId.id,
  //     // )
  //     return usersCitizenDashboardData.services.filter(
  //       (value) => val.id == value.application,
  //       )
  //       // return val
  // })

  // console.log('responseee', res)
  useEffect(() => {
    console.log('isCardClick', isCardClick);
  }, [isCardClick])
  const handleChange = (e, val) => {
    console.log("val", val);
    setValue(val);
    let appId = getAppId(val);
    setServices(getServicesByAppId(appId));
  };
  const [iconColor, seticonColor] = useState('grey')
  const changeIconColor = (color) => {
    console.log(`icon color ${color}`)
    const icons = document.querySelectorAll(".icon-element");
    icons.forEach((icons) => {
      icons.style.color = color;

    });
    seticonColor(color)
    const elements = document.querySelectorAll(".background-element");

    elements.forEach((element) => {
      element.style.borderRight = `thick double ${color}`;

    });
  };

  const [tempColor, setTempColor] = useState('#000000')

  const changeFontColor = (color) => {
    const textElements = document.querySelectorAll(".text-element");
    textElements.forEach((textElement) => {
      textElement.style.color = color;
    });
    setTempColor(color)

  };
  // res.push(...childEle)

  // const tabNames = [
  //   {
  //     name: "Shop and Establishment License",
  //     iconName: AutoFixHighIcon,
  //     subText: "દુકાન અને સ્થાપન લાયસન્સ",
  //     subText2:
  //       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     services: [
  //       "Shop and Establishment Registration",
  //       "Transfer of Shop and Establishment License",
  //     ],
  //   },
  //   {
  //     name: "Birth and Death",
  //     iconName: AddBoxIcon,
  //     subText: "Service",
  //     subText2:
  //       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     services: [
  //       "Duplicate copy of Death Certificate",
  //       "Birth Correction Registration",
  //       "Death Correction Registration",
  //     ],
  //   },
  //   {
  //     name: "Property Tax",
  //     iconName: AdjustIcon,
  //     subText: "Sub five",
  //     subText2:
  //       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     services: [
  //       "New Assessment or Self Assessment",
  //       "Extract of Property",
  //       "Transfer of Property",
  //     ],
  //   },
  //   {
  //     name: "Professional tax",
  //     iconName: AbcIcon,
  //     subText: "Service",
  //     subText2:
  //       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     services: [
  //       "New Assessment or Self Assessment",
  //       "New Assessment or Self Assessment",
  //       "Transfer of Property",
  //       "Duplicate Bill",
  //       "No Due Certificate",
  //       "Application regarding vacant premises certificate",
  //     ],
  //   },
  //   {
  //     name: "Marriage Registration",
  //     iconName: AdjustIcon,
  //     subText: "Service",
  //     subText2:
  //       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     services: [
  //       "Marriage Registration",
  //       "Duplicate copy of Marriage Certificate",
  //     ],
  //   },
  //   {
  //     name: "Shop and Establishment License",
  //     iconName: AutoFixHighIcon,
  //     subText: "દુકાન અને સ્થાપન લાયસન્સ",
  //     subText2:
  //       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     services: [
  //       "Shop and Establishment Registration",
  //       "Transfer of Shop and Establishment License",
  //     ],
  //   },
  // ];

  return (
    // <Box>
    //   <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    //     <Tabs
    //       variant="scrollable"
    //       scrollButtons={true}
    //       value={value}
    //       onChange={handleChange}
    //       aria-label="scrollable force tabs example"
    //       sx={{
    //         "& .MuiTabs-indicator": {
    //           display: "none",
    //         },
    //         "& .MuiTabs-scrollButtons":{
    //             backgroundColor:'#EDE7F6',
    //             margin: '10px',
    //             "&.Mui-disabled": {
    //                 opacity: 0.5
    //               }
    //         }
    //       }}

    //       // TabIndicatorProps={{
    //       //   style: { backgroundColor: "#2162DF", height: "0%", color:'white' },
    //       // }}
    //     >
    //           <Tab
    //             // key={tab.name}
    //             style={{
    //               height: "180px",
    //               width: "175px",
    //               margin: "10px",
    //               // zIndex: 1,
    //               // color: "black",
    //               border: "1px solid gray"
    //             }}
    //             sx={{
    //               color: "black",
    //               "&.Mui-selected": {
    //                 color: "white",
    //                 backgroundColor: "#2162DF",
    //               },
    //             }}
    //             // icon={<tab.iconName style={{ fontSize: 50 }} />}
    //             label={
    //               <React.Fragment>
    //                 {props.children}
    //                 <br />
    //                 {/* <span style={{ fontSize: "smaller" }}>{tab.subText}</span> */}
    //               </React.Fragment>
    //             }
    //             {...a11yProps(value)}
    //           />
    //     </Tabs>
    //   </Box>
    //   {tabNames.length > 0
    //     ? tabNames.map((tab, id) => {
    //         return (
    //           <TabPanel
    //             value={value}
    //             index={id}
    //             key={id}
    //             style={{ border: "1px solid gray", margin: "10px" }}
    //             // className={value === 1 ? 'active' : ''}
    //           >
    //             <Grid container spacing={2}>
    //               {tab.services.length > 0
    //                 ? tab.services.map((j) => {
    //                     return (
    //                       <Grid item xs={3}>
    //                         <Tooltip title={j}>
    //                           <Card style={{ border: "1px solid gray" }}>
    //                             <CardHeader
    //                               titleTypographyProps={{
    //                                 variant: "body2",
    //                                 textAlign: "center",
    //                               }}
    //                               title={j}
    //                             />
    //                           </Card>
    //                         </Tooltip>
    //                       </Grid>
    //                     );
    //                   })
    //                 : "NA"}
    //             </Grid>
    //           </TabPanel>
    //         );
    //       })
    //     : "NAA"}
    // </Box>

    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        // overflow: "scroll"
      }}
    >



      {/* //////////////////////Commentted by shivani */}
      {/* <Tabs
        variant="scrollable"
        scrollButtons={true}
        style={{ width: "100%" }}
        value={value}
        onChange={handleChange}
        aria-label="scrollable force tabs example"
        sx={{
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTabs-scrollButtons": {
            backgroundColor: "#EDE7F6",
            margin: "10px",
            "&.Mui-disabled": {
              opacity: 0.5,
            },
          },
        }} */}

      {/* TabIndicatorProps={{
         style: { backgroundColor: "#2162DF", height: "0%", color:'white' },
       }}
      > */}
      {/* <div>
          {usersCitizenDashboardData?.applications?.map((tab, id) => {
            return (
              <Tab
                key={tab.applicationNameEng}
                style={{
                  height: "180px",
                  width: "175px",
                  margin: "10px",
                  border: "1px solid gray",
                }}
                sx={{
                  color: "black",
                  "&.Mui-selected": {
                    color: "white",
                    backgroundColor: "#2162DF",
                    backgroundColor: "#555555",
                  },
                  "&.MuiTab-root": {
                    padding: "0",
                  },
                }}
                label={
                  <Badge
                    variant="dot"
                    color="success"
                    sx={{ "& .MuiBadge-badge": { height: 18, width: 18 } }}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Box style={{ width: "100%", height: "100%" }}>
                      <Box
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Card
                          sx={{
                            width: "100%",
                            height: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "0%",
                            backgroundColor: "#23A9F4",
                          }}
                        >
                          <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            sx={{
                              width: "30px",
                              height: "50px",
                              borderRadius: 0,
                            }}
                          >
                            <ComponentWithIcon iconName={tab.icon} />

                           </IconButton>
                        </Card>
                        <Box
                          boxShadow={3}
                          style={{
                            width: "100%",
                            height: "50%",
                            padding: "5px",
                          }}
                        >
                          <Box style={{ height: "55%" }}>
                            <Typography
                              sx={{ fontWeight: "bold" }}
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              {language === "en"
                                ? tab.applicationNameEng
                                : tab.applicationNameMr}
                            </Typography>
                          </Box>
                        </Box>
                          </Box>
                    </Box>
                  </Badge>
                }
                {...a11yProps(value)}
              />
            );
          })}
        </div>
      </Tabs> */}
      {/* ////////////////////////end////////// */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          padding: '10px',
          float: 'right',
        }}
      >
        <div
          style={{
            display: 'flex',
            margin: '5px',
            placeItems: 'center',
          }}
        >
          {[
            { label: 'A+', fontSize: 15 },
            { label: 'A', fontSize: 12 },
            { label: 'A-', fontSize: 10 },
          ].map((fontButton) => (
            <span
              key={fontButton.label}
              className={styles.fontButtons}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                border: '1px solid white',
                color: 'black',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '5px',
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: '15px',
              }}
              onClick={() => setFontSize(fontButton.fontSize)}
            >
              {fontButton.label}
            </span>

          ))}
        </div>
        <div style={{ marginRight: '20px' }}>
          <h3>
            {language === 'en' ? 'Icon Color' : 'आयकॉन रंग'}{' '}
            <input
              type='color'
              defaultValue='#0b669e'
              onChange={(e) => changeIconColor(e.target.value)}
            />
          </h3>
        </div>

        <div style={{ marginRight: '20px' }}>
          <h3>
            {language === 'en' ? 'Font Color' : 'फॉन्टचा रंग'}{' '}
            <input
              type='color'
              onChange={(e) => changeFontColor(e.target.value)}
            />
          </h3>
        </div>
      </div>



      <Grid
        container
        style={{ display: "flex",
        //  justifyContent: "center", 
         marginBottom: '10px',
        // backgroundImage: `url(/bgImage.jpeg)`,
       }}
      >
        {usersCitizenDashboardData?.applications?.map((val, id) => {
          return (
            <Tooltip title={language === "en"
              ? val.applicationNameEng
              : val.applicationNameMr}>
              <Grid
                key={id}
                item
                xs={2}
                style={{
                  paddingTop: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingBottom: "0px",
                  display: "flex",

                  justifyContent: "center",

                }}
              >
                <Grid
                  container
                  // className={styles.dashCardFrontSide}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "15px",
                    backgroundColor: "white",
                    backgroundImage: `url("/orange-shadow.svg")`,
                    // height: "100vh",
                    backgroundSize: "contain",
                    backgroundRepeat: 'no-repeat',
                    height: "90%",
                    width: "90%",

                  }}
                  sx={{
                    ":hover": {
                      boxShadow: "grey 0px 5px 0px 0px, #e6680a 0px 0px 0px 0px, grey 0px 0px 0px 0px",
                    },
                  }}
                  boxShadow={3}
                >
                  <Grid
                    item
                    xs={2}
                    className='icon-element'
                    // style={{ color: 'orange' }}
                    style={{
                      padding: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: val.bg,
                      color: "grey",
                      // size: '20px',
                      size: `${fontSize + 2}px !important`,
                      borderRadius: "7px",
                      maxWidth: "unset",
                      width: "30%",
                    }}
                    boxShadow={2}
                  >
                    <ComponentWithIcon
                      iconName={val.icon} />
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    style={{
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      maxWidth: "unset",
                      width: "60%",
                      // fontSize: fontSize,
                    }}
                  >
                    <Link
                      className="text-element"
                      style={{
                        fontWeight: "600",
                        color: "black",
                        letterSpacing: "1px",
                        textAlign: "center",
                        fontSize: fontSize,
                      }}
                      onClick={() => {
                        setCardClick(true)
                        setClickIcon(val.icon)
                        setClickTitle(language === "en"
                          ? val.applicationNameEng
                          : val.applicationNameMr)
                        setServices(getServicesByAppId(val.id))
                        // setIsModalOpenForResolved(true)
                      }}
                      tabIndex={0}
                      component="button"
                    >
                      {language === "en"
                        ? val.applicationNameEng
                        : val.applicationNameMr}
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Tooltip>
          )
        })}
      </Grid>


      {/* sample code flip */}
      {/* <Grid className={styles.flipCard} >
        <Grid className={styles.flipCardInner} >
          <Grid className={styles.dashCardFrontSide}>
            <Grid
              container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "15px",
                backgroundColor: "white",
                backgroundImage: `url("/orange-shadow.svg")`,
                // height: "100vh",
                backgroundSize: "contain",
                backgroundRepeat: 'no-repeat',
                height: "100%",
                width: "100%",
              }}
              sx={{
                ":hover": {
                  boxShadow: "0px 5px #556CD6",
                },
              }}
              boxShadow={3}
            >
              <Grid
                item
                xs={2}
                style={{
                  padding: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: 'white',
                  color: "grey",
                  size: '20px',
                  borderRadius: "7px",
                  maxWidth: "unset",
                  width: "30%",
                }}
                boxShadow={2}
              >
                <ComponentWithIcon iconName={'Assessment'} />
              </Grid>
              <Grid
                item
                xs={10}
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: "unset",
                  width: "70%",
                }}
              >

                <Link
                  style={{
                    fontWeight: "800",
                    color: "black",
                    letterSpacing: "1px",
                  }}
                  onClick={() => {
                    console.log('sssssss', true);
                    setCardClick(true)
                  }}
                  tabIndex={0}
                  component="button"
                >
                  {language === "en"
                    ? 'val.applicationNameEng'
                    : 'val.applicationNameMr'}
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={styles.dashCardBackSide}>
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </Grid>
        </Grid>
      </Grid> */}

      {/* end */}

      {/* <Box>
        <Grid container sx={{ padding: "10px" }}>
          {services?.length > 0 ? (
            services.map((tab, id) => {
              return (
                <Grid
                  item
                  xs={4}
                  key={id}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Tooltip
                    title={
                      language === "en" ? tab.serviceName : tab.serviceNameMr
                    }
                  >
                    <Card
                      sx={{
                        width: "80%",
                        height: "90%",
                        cursor: "pointer",
                        backgroundColor: "#CDCDCD",
                      }}
                      onClick={() => {
                        console.log("tab", tab);
                        dispatch(setApplicationName(tab));
                        user.isProfileComleted === "Y"
                          ? tab.clickTo && tab.application == 6
                            ? router.push({
                              pathname: tab.clickTo,
                              query: { pageMode: "Add" },
                            })
                            : router.push({ pathname: tab.clickTo })
                          : router.push("/CompleteProfile");
                      }}
                    >
                      <CardHeader
                        titleTypographyProps={{
                          variant: "body2",
                          textAlign: "center",
                          padding: "6px",
                        }}
                        title={
                          language === "en"
                            ? tab.serviceName
                            : tab.serviceNameMr
                        }
                      />
                    </Card>
                  </Tooltip>
                </Grid>
              );
            })
          ) : (
            <Box>
              <Card>
                <CardHeader
                  titleTypographyProps={{
                    variant: "body2",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "red",
                  }}
                  title={
                    language === "en"
                      ? "Services Not Available"
                      : "सेवा उपलब्ध नाही"
                  }
                />
              </Card>
            </Box>
          )}
        </Grid>
      </Box> */}




      <Modal
        // title="Modal For Multi Department"
        open={isCardClick}
        closeTimeoutMS={500}
        //  className={styles.overlay}
        style={modalStyles}
        // onOk={true}
        // onCancel
        onClose={handleCancel1} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
        footer=""
        sx={{
          padding: 5,
          display: "flex",
          justifyContent: "center",
          placeContent: "center",
          zIndex: "1300",
          top: "0px",
          left: "0px",
          position: "fixed",
          alignItems: "center",
        }}
      >

        <Box
          sx={{
            width: "50%",
            borderRadius: '30px',
            backgroundColor: "white",
            minHeight: "45%",
            height: "fit-content",
            animation: 'popup 0.7s',
            // visibility: 'hidden',
            // transform: 'scale(1.1)',
            // transition: 'opacity 0.2s 0s ease-in-out , transform 0.2s 0s ease-in-out'
            // transition: 'all 5s ease-in-out'            // border:'1px solid'
          }}
        >

          <Box>
            <Grid
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                borderTopLeftRadius: '30px',
                backgroundColor: '#fcecdb',
                borderTopRightRadius: '30px',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url("/orange-shadow.svg")`,
                backgroundSize: "100% 100%",
                backgroundSize: "contain",
                backgroundRepeat: 'no-repeat',
              }}>
              <Grid
                container
                // className={styles.dashCardFrontSide}
                style={{
                  padding: "10px",
                  width: '90%',
                  flexWrap: "nowrap",

                  boxShadow: "none",
                }}
                sx={{
                  ":hover": {
                    boxShadow: "0px 5px #556CD6",
                  },
                }}
                boxShadow={3}
              >
                <Grid

                  item
                  xs={2}
                  className="icon-element"
                  style={{
                    padding: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: 'white',
                    color: iconColor,
                    size: '20px',
                    borderRadius: "7px",
                    maxWidth: "unset",
                    width: "30%",
                  }}
                  boxShadow={2}
                >
                  <ComponentWithIcon
                   iconName={clickedIcon} />
                </Grid>
                <Grid
                  item
                  xs={10}
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "unset",
                    // width: "70%",
                  }}
                >

                  {/* {( */}
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#383636",
                      fontSize: "25px",
                      textAlign: "left",
                      width: "100%"
                    }}
                    onClick={() => {
                      console.log('sssssss', true);
                      setCardClick(true)
                    }}
                    tabIndex={0}
                    component="button"
                  >
                    {clickedTitle}
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              {services?.length > 0 ? (
                services.map((tab, id) => {
                  return (
                    <Grid
                      item
                      xs={4}
                      key={id}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "10px 0px",
                        alignItems: "center",
                      }}
                    >
                      <Card
                        sx={{
                          display: "flex",
                          width: "85%",
                          height: "90%",
                          cursor: "pointer",
                          boxShadow: '0px 0px 1px 1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                          ":hover": {
                            boxShadow: "0px 1px 5px 1px grey, 0px 1px 1px 0px grey, 0px 1px 3px 0px grey",
                          },
                        }}
                        onClick={() => {
                          console.log("tab", tab);
                          dispatch(setApplicationName(tab));
                          user.isProfileComleted === "Y"
                            ? tab.clickTo && tab.application == 6
                              ? router.push({
                                pathname: tab.clickTo,
                                query: { pageMode: "Add" },
                              })
                              : router.push({ pathname: tab.clickTo })
                            : router.push("/CompleteProfile");
                        }}
                      >
                        {/* <CardHeader
                          titleTypographyProps={{
                            variant: "body2",
                            textAlign: "center",
                            padding: "6px",
                            fontWeight: 500,
                            fontSize: '0.8rem'
                          }}
                          title={
                            language === "en"
                              ? tab.serviceName
                              : tab.serviceNameMr
                          }
                        /> */}
                        <div
                          style={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",

                          }}>
                          <p
                            // className="text-element"
                            style={{
                              alignSelf: "center",
                              color: tempColor,
                              padding: "0px 5px",
                              textAlign: "-webkit-center", fontSize: "12px", margin: '1em 0px'
                            }}>
                            {
                              language === "en"
                                ? tab.serviceName
                                : tab.serviceNameMr
                            }
                          </p>
                        </div>
                      </Card>
                      {/* </Tooltip> */}
                    </Grid>
                  );
                })
              ) : (
                <Box>
                  <Card>
                    <CardHeader
                      titleTypographyProps={{
                        variant: "body2",
                        textAlign: "center",
                        fontWeight: 700,
                        color: "red",
                      }}
                      title={
                        language === "en"
                          ? "Services Not Available"
                          : "सेवा उपलब्ध नाही"
                      }
                    />
                  </Card>
                </Box>
              )}
            </Grid>
          </Box>

        </Box>
      </Modal>
    </Box >



  );
};

export default DashboardTabs;
