import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  courtCaseDetailsSchema,
  courtCaseEntryAdvocateDetailsSchema,
  courtCaseDetailsSchemxaMr,
  courtCaseEntryAdvocateDetailsSchemaMr,
} from "../../../../containers/schema/LegalCaseSchema/courtCaseEntrySchema";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import AdvocateDetails from "./AdvocateDetails";
import CaseDetails from "./CaseDetails";
import Documents from "./Documents";
import BillDetails from "./BillDetails";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
// import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// steps
function getSteps(pageMode) {
  console.log("newPageMode", pageMode);
  if (pageMode == "Add") {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
    ];
  } else if ("View") {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
      <FormattedLabel key={4} id="paymentDetails" />,
    ];
  } else {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
      // <FormattedLabel key={4} id='caseFees' />,
      <FormattedLabel key={4} id="paymentDetails" />,
      // <FormattedLabel key={2} id='advocateDetails' />,
    ];
  }
}

// getStepContent
function getStepContent(
  step,
  pageMode,
  buttonInputStateNew,
  newCourtCaseEntry
) {
  console.log("6565", newCourtCaseEntry);
  if (pageMode == "Add") {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      console.log("yeda aahe ka ", buttonInputStateNew);
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
      // return <Documents props={newCourtCaseEntry} />;
    }
  } else if ("View") {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
    } else if (step == "3") {
      return <BillDetails />;
    }
  } else {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
    } else if (step == "3") {
      return <BillDetails />;
    }
  }
}

// Main Component
const View = () => {
  const user = useSelector((state) => {
    return state.user.user;
  });
  const token = useSelector((state) => state.user.user.token);

  const [dataValidation, setDataValidation] = useState(courtCaseDetailsSchema);
  const methods = useForm({
    defaultValues: {
      courtName: "",
      caseMainType: "",
      subType: "",
      year: "",
      stampNo: "",
      fillingDate: null,
      // filedBy: "",
      // filedAgainst: "",
      caseDetails: "",
      caseDetailsMr: "",
      // Advocate Details
      advocateName: "",
      opponentAdvocate: "",
      concernPerson: "",
      appearanceDate: null,
      department: "",
      courtName: "",
    },
    mode: "onChange",
    resolver: yupResolver(dataValidation),
    criteriaMode: "all",
  });
  const { register, reset, setValue, getValues, method, watch } = methods;
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [courtCaseNumbers, setcourtCaseNumbers] = useState([]);
  const [newCourtCaseEntry, setNewCourtCaseEntry] = useState();
  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] =
    useState([]);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [pageMode, setPageMode] = useState("Add");
  const [noticeHistoryList, setNoticeHistoryList] = useState([]);

  const [caseDetailsList, setCaseDetailsList] = useState([]);
  const [caseDetailsListM, setCaseDetailsListM] = useState([]);

  const [noticeId, setNoticeId] = React.useState(null);

  const [caseId, setCaseId] = React.useState(null);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);

  const [userNames, setUserNames] = useState([]);
  const [loadderState, setLoadderState] = useState(false);

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

  //  courtNames
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtNameEn: r.courtName,
            courtNameMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get User List based on department

  const getUserList = async (value) => {
    try {
      const { data } = await axios.get(
        `${urls.LCMSURL}/master/user/getUserByDpt?dptId=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("dataaaaaa", data);
      setUserNames(
        data?.map((r, i) => ({
          id: r.id,
          userName: r.firstNameEn + " " + r.middleNameEn + " " + r.lastNameEn,
          userNameMr: r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
        }))
      );
    } catch (err) {
      console.log("err", err);
      callCatchMethod(err, language);
    }
  };

  // TableData
  const getAddHearingData = () => {
    axios
      .get(`${urls.LCMSURL}/trnsaction/addHearing/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("22222", i + 1),
        setDataSource(
          res.data.addHearing.map((r, i) => ({
            srNo: i + 1,
            // id: r.id,
            caseEntry: courtCaseNumbers?.find((obj) => obj.id === r.caseStages)
              ?.courtCaseNumber,
            caseEntry1: r.caseStages,
            fillingDate: moment(r.fillingDate).format("YYYY-MM-DD"),
            courtCaseNumber: r.courtCaseNumber,
            courtCaseNumbers: courtCaseNumbers?.find(
              (obj) => obj.id === r.courtCaseNumber
            )?.courtCaseNumber,
            courtNameMr: courtNames?.find((obj) => obj.id === r.court)
              ?.courtNameMr,
            courtNameEn: courtNames?.find((obj) => obj.id === r.court)
              ?.courtNameEn,
            hearingDate: moment(r.hearingDate).format("YYYY-MM-DD"),
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // deleteById
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.LCMSURL}/courtCaseEntry/discardcourtCaseEntry/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
            }
          });
      }
    });
  };

  // columns
  const columns = [
    // old
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      field: "courtNameEn",
      headerName: <FormattedLabel id="courtCaseNumber" />,
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "fillingDate",
      headerName: <FormattedLabel id="fillingDate" />,
      width: 170,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    ,
    {
      field: "hearingDate",
      headerName: <FormattedLabel id="hearingDate" />,
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      width: 650,
      headerAlign: "center",
      align: "center",
      // flex: 5,
      renderCell: (record) => {
        return (
          <>
            <IconButton>
              <Button
                size="small"
                variant="contained"
                endIcon={<VisibilityIcon />}
                onClick={() => actionOnRecord(record.row, "View")}
              >
                view
              </Button>
            </IconButton>
          </>
        );
      },
    },
  ];

  // Hearing Detils column

  const hearing_details_columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hearingDate",

      // set the date format?

      // hearingDate: moment(hearingDate).format("DD-MM-YYYY"),

      // headerName: <FormattedLabel id="remarkDate" />,
      headerName: "Hearing Date",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "caseStatus",
      // headerName: <FormattedLabel id="user" />,
      headerName: "Case-Status",
      width: 210,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "caseStages",
      // headerName: <FormattedLabel id="user" />,
      headerName: "Case-Stages",
      width: 210,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hearingRemark",
      // headerName: <FormattedLabel id="deptName" />,
      headerName: "Hearing Details",
      // type: "number",
      width: 400,
      align: "center",
      headerAlign: "center",
    },
  ];

  // Parawise Details Column
  const parawise_details_columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,

      align: "center",
      headerAlign: "center",
    },
    // {
    // field: "caseNumber",
    // headerName: "Department Name",
    // width: 200,
    // align: "center",
    // headerAlign: "center",
    // },
    {
      field: "courtName",
      // headerName: <FormattedLabel id="user" />,
      headerName: "Parawise Date",
      width: 300,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "caseFillingDate",
      // headerName: <FormattedLabel id="deptName" />,
      headerName: "Parawise Remarks",
      // type: "number",
      width: 500,
      align: "center",
      headerAlign: "center",
    },
  ];

  // WS Process Details
  const ws_details_columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "WsCreatedAt",
      // headerName: <FormattedLabel id="remarkDate" />,
      headerName: "Written Statement Date",
      width: 270,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "courtName",
      // headerName: <FormattedLabel id="user" />,
      headerName: "Written Statement Remarks",
      width: 750,
      align: "center",
      headerAlign: "center",
    },
  ];

  const steps = getSteps(localStorage.getItem("pageMode"));

  // handleNext
  const handleNext = (data) => {
    setLoadderState(true);

    // alert("mkjhgf");
    console.log("handleNext", data);
    let paidAmountDate = null;
    setNewCourtCaseEntryAttachmentList(
      JSON.parse(localStorage.getItem("NewCourtCaseEntryAttachmentList"))
    );

    const appearanceDate = moment(data.appearanceDate).format("YYYY-MM-DD");
    let _trnDptLocationDao = JSON.parse(
      localStorage.getItem("trnDptLocationDao")
    )?.map((item) => {
      return {
        id: item?.id,
        dptId: item?.dptId,
        locationId: item?.locationId,
        concernPersonId: item?.concernPersonId,
        activeFlag: item?.activeFlag === undefined ? "Y" : item?.activeFlag,
      };
    });

    // finalBody
    const finalBody = {
      ...data,
      paidAmountDate,
      appearanceDate,
      createdUserId: user.id,
      pendingAmount: data?.pendingAmount ?? 0,
      // NewCourtCaseEntryAttachmentList: JSON.parse(
      //   localStorage.getItem("NewCourtCaseEntryAttachmentList")
      // ),
      NewCourtCaseEntryAttachmentList: [],
      newCourtCaseEntryAttachmentListForUpload: JSON.parse(
        localStorage.getItem("NewCourtCaseEntryAttachmentList")
      ),
      trnDptLocationDao: _trnDptLocationDao ? _trnDptLocationDao : [],
      // sagar: JSON.parse(
      //   localStorage.getItem("NewCourtCaseEntryAttachmentList")
      // ),
    };
    console.log("finalBody_______", finalBody);

    if (activeStep == steps.length - 1) {
      console.log("finalBody_______", finalBody);
      axios
        .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, finalBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            localStorage.removeItem("newCourtCaseEntry");
            localStorage.removeItem("NewCourtCaseEntryAttachmentList");
            localStorage.removeItem("buttonInputStateNew");
            localStorage.removeItem("pageMode");
            localStorage.removeItem("deleteButtonInputState");
            localStorage.removeItem("addButtonInputState");
            localStorage.removeItem("buttonInputState");
            localStorage.removeItem("btnInputStateDemandBill");
            localStorage.removeItem("disabledButtonInputState");
            localStorage.removeItem("billDetail");
            localStorage.removeItem("trnDptLocationDao");
            if (data.id) {
              sweetAlert(
                language == "en" ? "Updated!" : "अपडेट केले",
                language == "en" ? "रेकॉर्ड यशस्वीरित्या अपडेट केले!" : "",
                "success"
              );
            } else {
              sweetAlert(
                // "Saved!",
                language == "en" ? "Saved!" : "जतन केले",

                // "Record Saved successfully !",
                language == "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",

                "success"
              );
            }
            router.push(`/LegalCase/transaction/newCourtCaseEntry/`);
          }
          setLoadderState(false);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } else {
      setLoadderState(false);

      setActiveStep(activeStep + 1);

      // sweetAlert("Not!", "CASE NUMBER EXISTS");
    }
    // setLoadderState(false);
  };

  // handleBack
  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  useEffect(() => {
    console.log("check data", localStorage.getItem("newCourtCaseEntry"));
    setCaseId(router?.query?.caseId);
    setButtonInputStateNew(localStorage.getItem("buttonInputStateNew"));
    setPageMode(localStorage.getItem("pageMode"));
    setNewCourtCaseEntry(localStorage.getItem("newCourtCaseEntry"));
    setNewCourtCaseEntryAttachmentList(
      localStorage.getItem("NewCourtCaseEntryAttachmentList")
    );
    console.log("first", JSON.parse(localStorage.getItem("newCourtCaseEntry")));
    reset(JSON.parse(localStorage.getItem("newCourtCaseEntry")));
    setValue(
      "concernPerson",
      JSON.parse(localStorage.getItem("newCourtCaseEntry"))?._concernPerson
    );
    getCourtName();

    // getUserList();
  }, []);

  console.log("pageMode", pageMode);

  // useEffect(() => {
  //   if (activeStep == "0") {
  //     setDataValidation(courtCaseDetailsSchema);
  //   } else if (activeStep == "1") {
  //     setDataValidation(courtCaseEntryAdvocateDetailsSchema);
  //   }
  // }, [activeStep]);

  // Validation for En and Mr
  const language = useSelector((state) => state?.labels?.language);

  useEffect(() => {
    //console.log('steps', activeStep)
    if (activeStep == "0" && language == "en") {
      setDataValidation(courtCaseDetailsSchema);
    }
    if (activeStep == "0" && language == "mr") {
      setDataValidation(courtCaseDetailsSchemxaMr);
    }
    if (activeStep == "1" && language == "en") {
      setDataValidation(courtCaseEntryAdvocateDetailsSchema);
    }
    if (activeStep == "1" && language == "mr") {
      setDataValidation(courtCaseEntryAdvocateDetailsSchemaMr);
    }
  }, [activeStep, language]);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAddHearingData();
    // getNoticeHistory();
    // getCaseDetails()
  }, [courtNames]);

  useEffect(() => {
    console.log("pageMode12121", pageMode);
  }, [pageMode]);

  // useEffect(()=>{
  //   if(pageMode == "CaseDetails"){

  // setIsOpenCollapse(true)
  // // setIsOpenCollapse(!isOpenCollapse);

  // }},[])

  // getNoticeHistory
  const getNoticeHistory = () => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/noticeHistory/getHistoryByNoticeId?noticeId=${noticeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setNoticeHistoryList(r?.data);
          // setPaymentCollectionReciptData(r?.data);
        } else {
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Case Details
  const getCaseDetails = () => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCaseDetails?caseId=${caseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          // setNoticeHistoryList(r?.data)

          // hearingDate: moment(r.fillingDate).format("DD-MM-YYYY"),

          setCaseDetailsList(r?.data);
          // setPaymentCollectionReciptData(r?.data);
        } else {
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    console.log("caseId", caseId);
    if (caseId) {
      getCaseDetails();
    }
  }, [caseId]);

  useEffect(() => {
    let caseDetails23 = caseDetailsList?.map((data, index) => {
      return {
        ...data,
        srNo: index + 1,
      };
    });

    setCaseDetailsListM(caseDetails23);
  }, [caseDetailsList]);

  // view
  return (
    <>
      {/* BreadcrumbComponent */}
      <Box
        sx={{
          marginLeft: "3vw",
        }}
      >
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 1,
            marginBottom: 5,
            padding: 1,
            paddingTop: 3,
            paddingBottom: 5,
          }}
        >
          <Grid
            container
            style={{
              backgroundColor: "#556CD6",
              height: "8vh",
              fontSize: 19,
              marginRight: "75px",
              borderRadius: 100,
            }}
          >
            <IconButton
              style={{
                marginBottom: "1vh",
                marginLeft: "0%",
                color: "white",
                marginBottom: "2vh",
              }}
            >
              <ArrowBackIcon
                onClick={() => {
                  router.back();
                }}
              />
            </IconButton>

            <Grid item xs={11}>
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FormattedLabel id="newCourtCaseEntry" />
              </h2>
            </Grid>
          </Grid>
          {/* <h2 style={{ marginBottom: "20Px" }}>
            {" "}
            {<FormattedLabel id='newCourtCaseEntry' />}
          </h2> */}
          {/* </marquee> */}
          <Stepper
            style={{
              marginTop: "50px",
            }}
            alternativeLabel
            activeStep={activeStep}
          >
            {steps.map((step, index) => {
              const labelProps = {};
              const stepProps = {};
              return (
                <Step {...stepProps} key={index}>
                  <StepLabel {...labelProps}>{step}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <Typography variant="h3" align="center">
              Thank You
            </Typography>
          ) : (
            <>
              <ThemeProvider theme={theme}>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleNext)}>
                    {getStepContent(
                      activeStep,
                      localStorage.getItem("pageMode"),
                      buttonInputStateNew,
                      newCourtCaseEntry
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        ml: "40px",
                        mr: "40px",
                        pt: 2,
                      }}
                    >
                      <Button
                        size="small"
                        disabled={activeStep === 0}
                        variant="contained"
                        onClick={() => previousStep()}
                      >
                        <FormattedLabel id="back" />
                      </Button>

                      <Box sx={{ flex: "1 auto" }} />

                      {/** SaveAndNext Button */}
                      <>
                        {activeStep != steps.length - 1 && (
                          <>
                            {localStorage.getItem("pageMode") !== "View" && (
                              <Button
                                size="small"
                                variant="contained"
                                type="submit"
                              >
                                <FormattedLabel id="saveAndNext" />
                              </Button>
                            )}
                            {localStorage.getItem("pageMode") == "View" && (
                              <Button variant="contained" type="submit">
                                <FormattedLabel id="next" />
                              </Button>
                            )}
                          </>
                        )}

                        <Box sx={{ flex: "0.01 auto" }} />

                        {/* Exit Button */}
                        <Button
                          sx={{ marginRight: 2 }}
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            localStorage.removeItem("newCourtCaseEntry");
                            localStorage.removeItem("buttonInputStateNew");
                            localStorage.removeItem("pageMode");
                            localStorage.removeItem("deleteButtonInputState");
                            localStorage.removeItem("addButtonInputState");
                            localStorage.removeItem("buttonInputState");
                            localStorage.removeItem("btnInputStateDemandBill");
                            localStorage.removeItem("trnDptLocationDao");
                            localStorage.removeItem("billDetail");
                            localStorage.removeItem("disabledButtonInputState");
                            localStorage.removeItem(
                              "NewCourtCaseEntryAttachmentList"
                            );
                            router.push(
                              `/LegalCase/transaction/newCourtCaseEntry`
                            );
                          }}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </>

                      {/**  Finish Submit */}
                      <>
                        {localStorage.getItem("pageMode") !== "View" && (
                          <>
                            {activeStep == steps.length - 1 && (
                              <Button
                                size="small"
                                variant="contained"
                                type="submit"
                              >
                                <FormattedLabel id="finish" />
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    </Box>
                  </form>
                </FormProvider>
              </ThemeProvider>
            </>
          )}
        </Paper>
      )}
    </>
  );
};

export default View;
