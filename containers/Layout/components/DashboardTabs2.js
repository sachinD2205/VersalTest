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
// import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";
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

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Grid
        container
        style={{ display: "grid",
        gridTemplateColumns: "auto auto auto auto",
        marginTop: "25px",
         justifyContent: "center",justifyContent: 'space-between', gap: "25px"  }}
      >
        {usersCitizenDashboardData?.applications?.map((val, id) => {
          return (
            <Box style={{width:'100%',marginBottom: '10px'}}>
            <Grid
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                borderTopLeftRadius: '30px',
                backgroundColor: '#ffba68',
                borderTopRightRadius: '30px',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url("/orange-dark-shadow.svg")`,
                backgroundSize: "100% 100%",
                backgroundSize: "contain",
                backgroundRepeat: 'no-repeat',
              }}>
              <Grid
                container
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
                  style={{
                    padding: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "grey",
                    size: '20px',
                    borderRadius: "7px",
                    maxWidth: "unset",
                    width: "30%",
                  }}
                  boxShadow={2}
                >
                  <ComponentWithIcon iconName={val.icon} />
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
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      color: "black",
                      color: "#383636",
                      fontSize: "15px",
                      width: "100%",
                    }}
                    onClick={() => {
                      // setCardClick(true)
                    }}
                    tabIndex={0}
                    component="button"
                  >
                    {language === "en"
                          ? val.applicationNameEng
                          : val.applicationNameMr}
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px",backgroundColor:'white',      border: "1px solid burlywood",   alignContent: "flex-start" }}>
              {usersCitizenDashboardData.services?.length > 0 ? (
                getServicesByAppId(val.id)?.map((tab, id) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      key={id}
                      style={{height: "fit-content", marginBottom: "10px"}}
                      // sx={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      // }}
                    >
                      <Card
                        sx={{
                          // width: "80%",
                          // height: "90%",
                          // cursor: "pointer",
                          // boxShadow: '0px 0px 1px 1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                          // ":hover": {
                          //   boxShadow: "0px 1px 5px 1px grey, 0px 1px 1px 0px grey, 0px 1px 3px 0px grey",
                          // },
                        }}
                        onClick={() => {
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
                        <div style={{padding: "3px", fontSize: "13px", fontWeight: "bold"}}>
                          {
                            language === "en"
                              ? tab.serviceName
                              : tab.serviceNameMr
                          }
                          </div>
                      </Card>
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
          )
        })}
      </Grid>


     <Modal
        open={isCardClick}
        closeTimeoutMS={500}
        style={modalStyles}
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
            minHeight: "50%",
            height: "fit-content",
            animation: 'popup 0.7s',
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
                backgroundColor: '#fec27a',
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
                  style={{
                    padding: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "grey",
                    size: '20px',
                    borderRadius: "7px",
                    maxWidth: "unset",
                    width: "30%",
                  }}
                  boxShadow={2}
                >
                  <ComponentWithIcon iconName={clickedIcon} />
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
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      color: "black",
                      color: "#383636",
                      fontSize: "25px",
                    }}
                    onClick={() => {
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
                        alignItems: "center",
                      }}
                    >
                      <Card
                        sx={{
                          width: "80%",
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
                        <CardHeader
                          titleTypographyProps={{
                            variant: "body2",
                            textAlign: "center",
                            padding: "6px",
                            fontWeight: 500,
                            fontSize: '0.9rem'
                          }}
                          title={
                            language === "en"
                              ? tab.serviceName
                              : tab.serviceNameMr
                          }
                        />
                      </Card>
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
    </Box>



  );
};

export default DashboardTabs;
