// import React from "react";
// // import BasicLayout from '../../containers/Layout/BasicLayout'
// // import BasicLayout from '../../../containers/Layout/BasicLayout'
// // import InnerCards from '../../containers/Layout/Inner-Cards/InnerCards'

// const DashboardHome = () => {
//   return (
//     <div style={{ backgroundColor: "blue" }}>
//       {/* <BasicLayout titleProp={'PCMC Dashboard'}> */}
//       {/* <InnerCards pageKey={'dashboard'} /> */}
//       {/* </BasicLayout> */}
//       <h1 style={{ color: "white", paddingLeft: "500px" }}> CFC Dashboard</h1>
//     </div>
//   );
// };

// export default DashboardHome;

import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardHeader, Grid, Paper } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import axios from "axios";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import URLs from "../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{ fontSize: "0.9rem", border: "1px solid red" }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(-90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const CFC_Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [filteredServices, setFilteredServices] = useState([]);

  const [_expanded, set_Expanded] = React.useState();
  const [accordionOpen, setAccordionOpen] = React.useState(false);
  const language = useSelector((state) => state.labels.language);
  const handleChange = (panel, accordionOpen, val) => {
    set_Expanded(accordionOpen ? panel : false);
    let vh = [];
    let arr = [];

    setFilteredServices([]);
    applications?.map((_val) => {
      vh = services?.filter((txt) => {
        return val.id === txt.application && txt;
      });
      arr = [];
      arr.push(...vh);
      setFilteredServices(arr);
    });
  };

  useEffect(() => {
    getApplication();
    getServices();
  }, []);

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const getServices = () => {
    setLoading(true);
    axios
      .get(`${URLs.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res", r);
          setLoading(false);
          setServices(r.data.service);
        } else {
          setLoading(false);
          message.error("Login Failed ! Please Try Again !");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getApplication = () => {
    axios
      // .get('http://localhost:8090/cfc/api/master/application/getAll')
      .get(`${URLs.CFCURL}/master/application/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res", r);
          setLoading(false);

          setApplications(
            r.data.application.filter((val) => {
              return val.module === 1;
            })
          );
        } else {
          setLoading(false);
          message.error("Login Failed ! Please Try Again !");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const handleModuleClick = (val) => {
    let vh = [];
    let arr = [];

    setFilteredServices([]);
    applications.map((_val) => {
      vh = services.filter((txt) => {
        return val.id === txt.application && txt;
      });
      arr = [];
      arr.push(...vh);
      setFilteredServices(arr);
    });
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDrawerOpen = () => {
    console.log("drawer opem");
    setOpen(true);
  };
  const handleDrawerClose = () => {
    console.log("drawer opem");
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
    dispatch(logout());
    router.push("/login");
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary
          sx={{
            backgroundColor: "white",
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Box /* elevation={5} */>
            <Typography style={{ fontSize: "16px", fontWeight: "600" }}>
              {language == "en" ? "Apply for services" : "सेवांसाठी अर्ज करा"}
            </Typography>
          </Box>
        </AccordionSummary>
        <Box>
          {applications &&
            applications.map((val, index) => {
              return (
                <Box key={index}>
                  <Accordion
                    expanded={_expanded === val.id}
                    onChange={() => {
                      handleChange(val.id, accordionOpen, val);
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "white",
                      }}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      onClick={() => {
                        setAccordionOpen(!accordionOpen);
                      }}
                    >
                      <Typography>{val.applicationNameEng}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container>
                        {filteredServices &&
                          filteredServices.map((val, id) => {
                            return (
                              <Grid
                                key={id}
                                xs={6}
                                item
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "10px",
                                }}
                              >
                                <Card
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    router.push(val.clickTo);
                                    console.log("val", val);
                                  }}
                                >
                                  <CardHeader
                                    title={
                                      language == "en"
                                        ? val.serviceName
                                        : val.serviceNameMr
                                    }
                                    titleTypographyProps={{
                                      fontSize: "18px",
                                      fontWeight: "550",
                                    }}
                                  />
                                </Card>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  {/* <Accordion
                onChange={(e, expanded) => {
                  handleModuleClick(val);
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <Typography>{val.applicationNameEng}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container>
                    {filteredServices &&
                      filteredServices.map((val, id) => {
                        return (
                          <Grid
                            key={id}
                            xs={6}
                            item
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              padding: "10px",
                            }}
                          >
                            <Card style={{ cursor: "pointer" }}>
                              <CardHeader
                                title={val.service}
                                titleTypographyProps={{
                                  fontSize: "18px",
                                  fontWeight: "500",
                                }}
                              />
                            </Card>
                          </Grid>
                        );
                      })}
                  </Grid>
                </AccordionDetails>
              </Accordion> */}
                </Box>
              );
            })}
        </Box>
      </Accordion>
    </Box>
  );
};

export default CFC_Dashboard;
