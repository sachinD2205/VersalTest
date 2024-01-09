import { useEffect, useState } from "react";
import * as React from "react";
import {
  Box,
  Typography,
  Grid,
  Tooltip,
  Card,
  CardHeader,
  Tabs,
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

const ComponentWithIcon = ({ iconName }) => {
  const Icon = MuiIcons[iconName];
  return <Icon style={{ fontSize: "50px" }} />;
};

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

const DashboardTabs = (props) => {
  let [value, setValue] = useState(0);
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

  const handleChange = (e, val) => {
    console.log("val", val);
    setValue(val);
    let appId = getAppId(val);
    setServices(getServicesByAppId(appId));
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
      <Tabs
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
        }}

        // TabIndicatorProps={{
        //   style: { backgroundColor: "#2162DF", height: "0%", color:'white' },
        // }}
      >
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
                  // backgroundColor: "#2162DF",
                  backgroundColor: "#555555",
                },
                "&.MuiTab-root": {
                  padding: "0",
                },
              }}
              // icon={<tab.iconName style={{ fontSize: 50 }} />}
              label={
                <Badge
                  variant="dot"
                  color="success"
                  sx={{ "& .MuiBadge-badge": { height: 18, width: 18 } }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Box style={{ width: "100%", height: "100%" }}>
                    <Tooltip title={tab?.description}>
                    <Box
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      // onClick={() => {
                      //   router.push(
                      //     '/FireBrigadeSystem/transactions/emergencyService',
                      //   )
                      // }}
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
                        // sx={{
                        //   "&.Mui-selected": {
                        //     color: "white",
                        //     // backgroundColor: "#2162DF",
                        //     backgroundColor: "#555555",
                        //   },
                        // }}
                      >
                        <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          // edge="end"
                          sx={{
                            width: "30px",
                            height: "50px",
                            borderRadius: 0,
                          }}
                        >
                          {/* <AutoFixHighIcon /> */}
                          <ComponentWithIcon iconName={tab.icon} />

                          {/* <tab.iconName style={{ fontSize: 50 }} /> */}
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
                              // textTransform: 'none',
                            }}
                          >
                            {language === "en"
                              ? tab.applicationNameEng
                              : tab.applicationNameMr}
                            {/* {tab.applicationNameEng} */}
                          </Typography>
                        </Box>
                        {/* <Box style={{ display: "flex" }}>
                            <Typography
                              noWrap="true"
                              style={{
                                fontSize: "12px",
                                textTransform: "none",
                                overflow: "hidden",
                              }}
                            >
                              {tab.applicationNameEng}
                            </Typography>
                          </Box> */}
                      </Box>
                      {/* {tab.name}
                    <br />
                    <span style={{ fontSize: "smaller" }}>{tab.subText}</span> */}
                    </Box>
                    </Tooltip>
                  </Box>
                </Badge>
              }
              {...a11yProps(value)}
            />
          );
        })}
      </Tabs>
      <Box>
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
                // <TabPanel
                //   value={value}
                //   index={id}
                //   key={id}
                //   style={{
                //     border: "1px solid gray",
                //   }}
                // >
                //   <Grid container sx={{ padding: "10px" }}>
                //     <Grid item xs={3}>
                //       {tab?.serviceName}
                //       {/* <Tooltip title={tab.serviceName}>
                //         <Card
                //           onClick={() => {
                //             router.push(tab.clickTo);
                //           }}
                //         >
                //           <CardHeader
                //             titleTypographyProps={{
                //               variant: "body2",
                //               textAlign: "center",
                //             }}
                //             title={tab.serviceName}
                //           />
                //         </Card>
                //       </Tooltip> */}
                //     </Grid>
                //   </Grid>
                // </TabPanel>
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
  );
};

export default DashboardTabs;
