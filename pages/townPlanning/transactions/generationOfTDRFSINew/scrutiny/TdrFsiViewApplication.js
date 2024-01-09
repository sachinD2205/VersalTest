import { yupResolver } from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  CircularProgress,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import theme from "../../../../../theme";
// import TsrFsiDetails from "../../../../../components/townPlanning/TdrFsiDetails"
import TsrFsiDetails from "../../../../../components/townPlanning/TdrFsiDetails";
// import TdrFsiChecklistNewWorkingTable from "../../../../../components/townPlanning/TdrFsiChecklistNewWorkingTable"
import FileTable from "../tdrFsiTable/FileTable";
// import styles from "./modificationInMBR.module.css";
// import AreaWardZoneMapping from "../../components/marriageRegistration/AreaWardZpneMapping/AreaWardZpneMapping";
import TdrFsiChecklist from "../../../../../components/townPlanning/TdrFsiChecklist";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = ({ setFiles }) => {
  //catch
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

  // console.log("rrrrrr111222", props);
  const disptach = useDispatch();
  let appName = "MR";
  let serviceName = "M-MMBC";
  let applicationFrom = "online";
  const [document, setDocument] = useState([]);
  const [pageMode, setPageMode] = useState(null);
  const [disable, setDisable] = useState(false);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;
  const user = useSelector((state) => state?.user.user);
  const [flagSearch, setFlagSearch] = useState(false);
  const [temp, setTemp] = useState();
  const [temp1, setTemp1] = useState();
  const [tempData, setTempData] = useState();
  const [loader, setLoader] = useState(false);
  const [showAccordian, setshowAccordian] = useState(true);
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [zoneKeys, setZoneKeys] = useState([]);
  useEffect(() => {
    let pageMode = router.query.pageMode;
    if (pageMode === "Add") {
      setPageMode(null);
      console.log("enabled", pageMode);
      setDisable(true);
    } else if (pageMode === "Edit") {
      setPageMode(pageMode);
      setDisable(false);
    } else if (pageMode === "View") {
      setDisable(true);
    } else {
      setDisable(false);
      setPageMode(pageMode);
      console.log("disabled", pageMode);
    }
  }, []);

  const logedInUser = localStorage.getItem("loggedInUser");

  //   const getAreas = async () => {
  //     await axios
  //       .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`)
  //       .then((r) => {
  //         setAreaNames(r.data);
  //       });
  //   };
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // wardKeys
  const [wardKeys, setWardKeys] = useState([]);

  // getWardKeys
  const getWardKeys = async () => {
    await axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [atitles, setatitles] = useState([]);

  const getTitles = async () => {
    await axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            atitle: row.title,
            // titlemr: row.titlemr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [TitleMrs, setTitleMrs] = useState([]);

  const getTitleMr = async () => {
    await axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setTitleMrs(
          r.data.title.map((row) => ({
            id: row.id,
            atitlemr: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    if (router.query.pageMode != "Add") setTemp1(getValues("zoneKey"));
  }, [getValues("zoneKey")]);

  // useEffect(() => {
  //   if (router.query.pageMode != "View") setTemp(true);
  // }, [router.query.pageMode]);

  useEffect(() => {
    getZoneKeys();
    getWardKeys();
    getTitleMr();
    getTitles();
  }, [temp]);

  useEffect(() => {
    if (router.query.pageMode != "Add" && watch("zoneKey")) getWardKeys();
  }, [watch("zoneKey")]);
  useEffect(() => {
    console.log("boardOPhoto:", watch("boardOrganizationPhotoMod"));
  }, [watch("boardOrganizationPhotoMod")]);
  const getApplicationData = (id) => {
    console.log("result111id", id);
    axios
      .get(`${urls.TPURL}/generationTdrFsi/getGenerationTdrFsi?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("result111", res);
        reset(res?.data);
        setValue("zoneId", JSON.parse(res?.data.zoneId));
        setValue("villageName", JSON.parse(res?.data.villageName));
        setValue("gatNo", JSON.parse(res?.data.gatNo));
        setValue("attachmentss", res?.data.files);

        if (res.status == 201 || res.status == 200) {
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    if (router.query.pageMode == "View" && router.query.applicationId) {
      getApplicationData(router.query.applicationId);
    }
  }, [router.query]);

  console.log("dsxfdfgrtfg", watch("attachmentss"));
  useEffect(() => {
    if (router.query.mode == "DOCUMENT_VERIFICATION") {
      setFiles(watch("attachmentss"));
    }
  }, [watch("attachmentss")]);
  return (
    <>
      {" "}
      {loader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // Adjust itasper requirement.
          }}
        >
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "50%",
              padding: 8,
            }}
            elevation={8}
          >
            <CircularProgress color="success" />
          </Paper>
        </div>
      ) : (
        <div>
          <FormProvider {...methods}>
            <form>
              <ThemeProvider theme={theme}>
                <Paper
                  sx={{
                    marginLeft: 5,
                    marginRight: 2,
                    marginTop: 2,
                    marginBottom: 5,
                    padding: 1,
                    border: 1,
                    borderColor: "grey.500",
                  }}
                >
                  <>
                    <Accordion
                    //   sx={{
                    //     marginLeft: "5vh",
                    //     marginRight: "5vh",
                    //     marginTop: "2vh",
                    //     marginBottom: "2vh",
                    //   }}
                    >
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#0070f3",
                          color: "white",
                          textTransform: "uppercase",
                          border: "1px solid white",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#0070f3"
                      >
                        <Typography>
                          {" "}
                          {language == "en"
                            ? "Land Ownership details for DRC"
                            : "DRC साठी जमिनीच्या मालकीचे तपशील"}
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <TsrFsiDetails />
                      </AccordionDetails>
                    </Accordion>

                    <Accordion
                    //   sx={{
                    //     marginLeft: "5vh",
                    //     marginRight: "5vh",
                    //     marginTop: "2vh",
                    //     marginBottom: "2vh",
                    //   }}
                    >
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#0070f3",
                          color: "white",
                          textTransform: "uppercase",
                          border: "1px solid white",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#0070f3"
                      >
                        <Typography>
                          {" "}
                          {language == "en" ? "Checklist" : "चेकलिस्ट"}
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        {/* < TdrFsiChecklistNewWorkingTable/> */}
                        <TdrFsiChecklist />
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                    //   sx={{
                    //     marginLeft: "5vh",
                    //     marginRight: "5vh",
                    //     marginTop: "2vh",
                    //     marginBottom: "2vh",
                    //   }}
                    >
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#0070f3",
                          color: "white",
                          textTransform: "uppercase",
                          border: "1px solid white",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#0070f3"
                      >
                        <Typography>
                          {" "}
                          {language == "en"
                            ? "Uploaded Documents"
                            : "अपलोड केलेले दस्तऐवज"}
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <FileTable key={2} serviceId={21} />
                      </AccordionDetails>
                    </Accordion>
                  </>
                </Paper>
              </ThemeProvider>
            </form>
          </FormProvider>
        </div>
      )}
    </>
  );
};

export default Index;
