import * as MuiIcons from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Card, Grid, IconButton, Link, Menu, MenuItem, Toolbar, Typography, Modal } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./[CitizenDashboardData].module.css";
import CloseIcon from '@mui/icons-material/Close';
import { setApplicationName } from "../../../../features/userSlice";
// import {  Modal } from '@mui/material';
// import styles from "../../styles/[DepartmentDashboard].module.css";
const drawerWidth = 340;
// const [openModal, setOpenModal] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);


const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return (
        <Icon
            style={{
                fontSize: "70px", transition: "transform 0.2s",
                // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                padding: "10px", borderRadius: "50%"
            }}
        // color={isHovered ? "white" : "orange"}
        />
    );
};

const CitizenDashboardV2 = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
        // console.log(state)
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

    const handleChange = (e, val) => {
        console.log("val", val);
        setValue(val);
        let appId = getAppId(val);
        console.log(appId)
        setServices(getServicesByAppId(appId));
    };

    function passData(val, name) {
        console.log(name)
        console.log("val", val);
        setValue(val);
        setName(name);
        let appId = getAppId(val);
        console.log(appId)
        setServices(getServicesByAppId(appId));
        openModal(name)
    }

    const changeIconColor = (color) => {
        console.log(`icon color ${color}`)
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
      <>
        <div
          // key={id}
          style={{
            background: 'transparent',
            height: '100%',
            // marginTop: "120px",
          }}
        >
          <Box>
            <Card style={{ backgroundColor: '#FAF7F7', padding: '10px' }}>
              <Typography
                sx={{
                  color: '#3752CC',
                  fontWeight: 600,
                  fontSize: {
                    xs: 19,
                    lg: 19,
                    md: 15,
                    sm: 12,
                    xs: 10,
                  },
                }}
              >
                {language === 'en'
                  ? 'Welcome to Pimpri Chinchwad Online Citizen Portal'
                  : 'पिंपरी चिंचवड ऑनलाईन सिटीझन पोर्टलवर आपले स्वागत आहे. '}
              </Typography>
              <Typography
                sx={{
                  width: '100%',
                  // wordBreak:'break-word',
                  fontSize: {
                    xs: 12,
                    lg: 12,
                    md: 10,
                    sm: 10,
                    xs: 8,
                  },
                }}
              >
                {language === 'en'
                  ? ' Welcome to Pimpri Chinchwad Online Citizen Portal, which is simple and convenient way for citizens to acess various services from anywhere at anytime. The service of virtual civic center can be accessed without paying any additional charges.'
                  : 'पिंपरी चिंचवड ऑनलाइन सिटिझन पोर्टलवर आपले स्वागत आहे, जे नागरिकांसाठी कोणत्याही वेळी कोठूनही विविध सेवांमध्ये प्रवेश करण्याचा सोपा आणि सोयीस्कर मार्ग आहे. कोणतेही अतिरिक्त शुल्क न भरता आभासी नागरी केंद्राच्या सेवेत प्रवेश करता येतो.'}
              </Typography>
            </Card>
          </Box>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              padding: '10px',
              float: 'right',
            }}
          >
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
            // sx={{
            //   position: "absolute",
            //   overflow: "auto",
            //   backgroundImage: `url(
            //     "https://punemirror-dev.s3.ap-south-1.amazonaws.com/full/cc4349b6baf91888c72d7604daa8aad15df6eb82.jpg")`,
            //   opacity: "0.2",
            // }}
            sx={{
              marginTop: '20px',
            }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            {usersCitizenDashboardData?.applications?.map((data, id) => {
              // console.log(data);
              return (
                <Grid
                  item
                  xs={2}
                  sx={{
                    padding: '0px',
                    // position: "relative",
                  }}
                  className={styles.content}
                  // key={index}
                  style={
                    {
                      // padding: "15px",
                    }
                  }
                >
                  <a>
                    {/* <Tooltip title={data?.description}> */}
                    <Tooltip title={data?.description} arrow>
                      <Card
                        className={styles.cardBGIMage}
                        // onMouseEnter={() => handleCardHover(data.id)}
                        // onMouseLeave={handleCardLeave}
                        style={{
                          // zIndex: "999",
                          // position: "relative",
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          marginTop: '15px',
                          // alignItems: "right",
                          height: '140px',
                          // borderRight:"thick double #32a1ce",
                          borderRight: '2px solid #cccccc',
                          padding: '20px 10px 20px 10px',
                          // cursor: "pointer",
                          // borderRadius: "10px",
                          // marginTop: "20px",
                          // boxShadow: "0px 2px 2px 0px #85929E",
                          // border: "2px solid white",
                          //   backgroundColor: "#fff",
                          backgroundColor: '#fff',
                          // background: "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
                          // color: "white",
                          transition: 'all 0.3s ease-in-out',
                        }}
                        sx={{
                          ':hover': {
                            // boxShadow: "2px 5px #556CD6",
                            // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            // transform: "scale3d(1.05, 1.15, 1)",
                            // transform: "translate(-50%, -50%)",
                            background:
                              'linear-gradient(to right, transparent 50%, #fff 50%)',
                            // backgroundPosition: "0 0",
                            backgroundSize: '200% 100%',
                            backgroundPosition: '100% 0',
                            color: '#fff',
                            transition: 'all 0.3s ease-in-out',
                          },
                        }}
                        // value={value}
                        // onClick={handleChange}
                        // onClick={openModal}
                        onClick={() => {
                          passData(
                            id,
                            language === 'en'
                              ? data.applicationNameEng
                              : data.applicationNameMr
                          )
                        }}
                        // onClick={() => {
                        //   handleApplicationClick(data);
                        // }}
                      >
                        <Box
                          className={styles.vibratingImage}
                          style={{
                            width: '100%',
                            // textAlign: "center",
                            // marginTop:"10px",
                            // height: "20%",
                            // padding: "10px",
                            // new change
                            // position:"absolute",
                            // marginTop:"-175px"
                          }}
                        >
                          <IconButton
                            className='icon-element'
                            sx={{
                              background: 'transparent',
                              height: '20%',
                              color: '#0b669e',
                              //   color: "orange",
                              // border: "2px solid white",
                              marginLeft: '10px',
                              padding: '0px',
                              // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
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
                            // display: "flex",
                            // //  flexDirection: "column",
                            // alignItems: "center",
                            // justifyContent: "center",
                            marginLeft: '20px',
                            // textAlign: "center",
                            height: '50%',
                          }}
                        >
                          <Typography
                            variant='subtitle1'
                            className='text-element'
                            style={{
                              fontSize: '16px',
                              fontFamily: 'revert',
                              fontWeight: '600',
                              // color: "black",
                              // lineHeight:"20px"
                              marginTop: '-25px',
                            }}
                          >
                            {language === 'en'
                              ? data.applicationNameEng
                              : data.applicationNameMr}
                          </Typography>
                        </Box>
                      </Card>
                    </Tooltip>
                  </a>
                </Grid>
              )
            })}
          </Grid>
        </div>

        <Modal
          open={isModalOpen}
          onClose={closeModal}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box>
            <div className={styles.modalStyle}>
              <h2
                style={{
                  padding: '10px',
                  marginTop: '-25px',
                  color: '#0b669e',
                }}
              >
                {name}
              </h2>
              <IconButton
                edge='end'
                color='inherit'
                onClick={closeModal}
                aria-label='close'
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 0,
                  marginRight: '15px',
                }}
              >
                <CloseIcon />
              </IconButton>

              <Grid container spacing={2}>
                {services?.length > 0 ? (
                  services.map((tab, id) => (
                    <Grid item xs={12} sm={6} md={4} key={id}>
                      <Card
                        className={styles.cardBGIMage}
                        style={{
                          // zIndex: "999",
                          // position: "relative",
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          marginTop: '15px',
                          // alignItems: "right",
                          height: '110px',
                          // borderRight:"thick double #32a1ce",
                          borderRight: '2px solid #cccccc',
                          padding: '20px 10px 20px 10px',
                          // cursor: "pointer",
                          // borderRadius: "10px",
                          // marginTop: "20px",
                          // boxShadow: "0px 2px 2px 0px #85929E",
                          // border: "2px solid white",
                          //   backgroundColor: "#fff",
                          backgroundColor: '#fff',
                          // background: "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
                          // color: "white",
                          transition: 'all 0.3s ease-in-out',
                        }}
                        sx={{
                          ':hover': {
                            // boxShadow: "2px 5px #556CD6",
                            // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            // transform: "scale3d(1.05, 1.15, 1)",
                            // transform: "translate(-50%, -50%)",
                            background:
                              'linear-gradient(to right, transparent 50%, #fff 50%)',
                            // backgroundPosition: "0 0",
                            backgroundSize: '200% 100%',
                            backgroundPosition: '100% 0',
                            color: '#fff',
                            transition: 'all 0.3s ease-in-out',
                          },
                        }}
                        onClick={() => {
                          console.log('tab', tab)
                          dispatch(setApplicationName(tab))
                          user.isProfileComleted === 'Y'
                            ? tab.clickTo && tab.application == 6
                              ? router.push({
                                  pathname: tab.clickTo,
                                  query: { pageMode: 'Add' },
                                })
                              : router.push({ pathname: tab.clickTo })
                            : router.push('/CompleteProfile')
                        }}
                      >
                        <div className={styles.modalContent1}>
                          <Typography
                            title={
                              language === 'en'
                                ? tab.serviceName
                                : tab.serviceNameMr
                            }
                            variant='h6'
                            className='text-element'
                            style={{ fontSize: '18px' }}
                          >
                            {language === 'en'
                              ? tab.serviceName
                              : tab.serviceNameMr}
                          </Typography>
                        </div>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <div style={{ textAlign: 'center' }}>
                      <Typography
                        variant='h6'
                        style={{ color: 'red', fontSize: '22px' }}
                      >
                        {language == 'en'
                          ? 'Services Not Available'
                          : 'सेवा उपलब्ध नाही'}
                      </Typography>
                    </div>
                  </Grid>
                )}
              </Grid>
            </div>
          </Box>
        </Modal>
      </>
    )

    // return (
    //     <div
    //     style={{
    //         background: "#fff",
    //         // marginTop: "120px",
    //     }}>
    //     <Grid
    //         container
    //         // sx={{
    //         //   position: "absolute",
    //         //   overflow: "auto",
    //         //   backgroundImage: `url(
    //         //     "https://punemirror-dev.s3.ap-south-1.amazonaws.com/full/cc4349b6baf91888c72d7604daa8aad15df6eb82.jpg")`,
    //         //   opacity: "0.2",
    //         // }}
    //         sx={{
    //             marginTop: "20px"
    //         }}
    //         columns={{ xs: 2, sm: 8, md: 12 }}
    //     >
    //         <Grid
    //             item
    //             xs={2}
    //             sx={{
    //                 padding: "0px",
    //                 // position: "relative",
    //             }}
    //             // className={styles.content}
    //             // key={index}
    //             style={{
    //                 // padding: "15px",

    //             }}
    //         >
    //             <a
    //             >
    //                 <Card
    //                     className={styles.cardBGIMage} 
    //                     // onMouseEnter={() => handleCardHover(data.id)}
    //                     // onMouseLeave={handleCardLeave}
    //                     style={{
    //                         // zIndex: "999",
    //                         // position: "relative",
    //                         display: "flex",
    //                         flexDirection: "column",
    //                         justifyContent: "center",
    //                         marginTop: "15px",
    //                         // alignItems: "right",
    //                         height: "140px",
    //                         // borderRight:"thick double #32a1ce",
    //                         borderRight: "2px solid #cccccc",
    //                         padding: "20px 10px 20px 10px",
    //                         // cursor: "pointer",
    //                         // borderRadius: "10px",
    //                         // marginTop: "20px",
    //                         // boxShadow: "0px 2px 2px 0px #85929E",
    //                         // border: "2px solid white",
    //                         //   backgroundColor: "#fff",
    //                         backgroundColor: "#eaeded",
    //                         // background: "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
    //                         // color: "white",
    //                         transition: "all 0.3s ease-in-out",
    //                     }}
    //                     sx={{
    //                         ":hover": {
    //                             // boxShadow: "2px 5px #556CD6",
    //                             // background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
    //                             boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    //                             // transform: "scale3d(1.05, 1.15, 1)",
    //                             // transform: "translate(-50%, -50%)",
    //                             background: "linear-gradient(to right, transparent 50%, #fff 50%)",
    //                             // backgroundPosition: "0 0",
    //                             backgroundSize: "200% 100%",
    //                             backgroundPosition: "100% 0",
    //                             color: "#fff",
    //                             transition: "all 0.3s ease-in-out",
    //                         },
    //                     }}
    //                 // onClick={() => {
    //                 //   handleApplicationClick(data);
    //                 // }}
    //                 >
    //                     <Box
    //                         className={styles.vibratingImage}
    //                         style={{
    //                             width: "100%",
    //                             // textAlign: "center",
    //                             // marginTop:"10px",
    //                             // height: "20%",
    //                             // padding: "10px",
    //                             // new change
    //                             // position:"absolute",
    //                             // marginTop:"-175px"

    //                         }}
    //                     >
    //                         <IconButton
    //                             sx={{
    //                                 background: "transparent",
    //                                 height: "20%",
    //                                 //   color: "orange",
    //                                 // border: "2px solid white",
    //                                 marginLeft: "10px",
    //                                 padding: "0px",
    //                                 // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    //                                 // backgroundColor: "gray",
    //                                 // background:
    //                                 //   "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
    //                             }}
    //                         >
    //                             {/* <ComponentWithIcon iconName={data.icon} /> */}
    //                             icon
    //                         </IconButton>
    //                     </Box>
    //                     <Box
    //                         sx={{
    //                             // display: "flex",
    //                             // //  flexDirection: "column",
    //                             // alignItems: "center",
    //                             // justifyContent: "center",
    //                             marginLeft: "20px",
    //                             // textAlign: "center",
    //                             height: "50%",
    //                         }}
    //                     >
    //                         <Typography
    //                             variant="subtitle1"
    //                             style={{
    //                                 // background:  "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
    //                                 fontSize: "16px",
    //                                 fontFamily: "revert",
    //                                 fontWeight: "700",
    //                                 color: "black",
    //                                 // lineHeight:"20px"
    //                                 marginTop: "-25px"
    //                             }}
    //                         >
    //                             {/* {tab?.applicationNameEng} */}

    //                             content
    //                         </Typography>
    //                     </Box>
    //                 </Card>
    //             </a>

    //         </Grid>
    //     </Grid>
    // </div>
    // )
};

export default CitizenDashboardV2;