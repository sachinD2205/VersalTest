import Check from "@mui/icons-material/Check";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
// import { LoadingButton } from "@mui/lab";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { BasicApplicationDetailsSchema } from "../../../../components/streetVendorManagementSystem/schema/issuanceOfHawkerLicenseSchema";
import SachinTempSchema from "../../../../components/streetVendorManagementSystem/schema/sachinTempSchema.js";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import Documents from "./Documents";
import NoticeDetails from "./NoticeDetails";
import urls from "../../../../URLS/urls";
import axios from "axios";
import {
  Schema,
  SchemaMr,
} from "../../../../containers/schema/LegalCaseSchema/newNoticeSchema";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { Language } from "@mui/icons-material";
import { language } from "../../../../features/labelSlice";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    // background: rgb(9,32,121),
    // background: linear-gradient(90deg, rgba(9,32,121,1) 1%, rgba(0,212,255,1) 76%);
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
    // "radial-gradient(circle, rgba(100,255,250,1) 11%, rgba(16,21,145,1) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    // 1: <SettingsIcon />,
    1: <PermIdentityIcon />,
    2: <UploadFileIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

// Get steps - Name
function getSteps(i) {
  return [
    <strong key={1}>{<FormattedLabel id="noticeDetails" key={1} />}</strong>,
    <strong key={2}>{<FormattedLabel id="documentUpload" key={2} />}</strong>,
  ];
}

// Get Step Content Form
function getStepContent(step) {
  console.log("step123", step);
  switch (step) {
    case 0:
      return <NoticeDetails key={1} />;

    case 1:
      return <Documents key={2} />;
  }
}

// Linear Stepper - sachin
const LinaerStepper = () => {
  // const [dataValidation, setDataValidation] = useState(Schema);
  // const methods = useForm({
  //   resolver: yupResolver(SachinTempSchema),
  // });

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    defaultValues: {
      caseNumber: "",
    },
  });

  const {
    watch,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = methods;
  // const { register, getValues, setValue, handleSubmit, methos, watch, reset } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadderState, setLoadderState] = useState(false);
  const [draftId, setDraftId] = useState();
  const [noticePageMode, setNoticePageMode] = useState();
  let user = useSelector((state) => state.user.user);
  let userDepartment = useSelector(
    (state) => state?.user?.user?.userDao?.department
  );
  const token = useSelector((state) => state.user.user.token);
  const [noticeID, setNoticeID] = useState();
  const [temp, setTemp] = useState();
  const language = useSelector((state) => state?.labels?.language);

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

  let pageModeM;

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getByNoticeID = () => {
    if (noticeID) {
      setLoadderState(true);

      axios
        .get(`${urls.LCMSURL}/notice/getNoticeById?noticeId=${noticeID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log("32432dsfjsdk", r?.data?.concernDeptUserList);
          if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
            console.log("r000i", r?.data);
            reset(r?.data);
            console.log("getByIdNoticeData89348934", r.data);
            console.log("first", localStorage.getItem("rowsData"));
            // setValue("rowsData", r?.data?.concernDeptUserList);
            // let concernDeptUserList = r?.data?.concernDeptUserList ? r?.data?.concernDeptUserList?.map((data, index) => {
            //   return {
            //     srNo: index + 1,
            //     id: data?.id,
            //     activeFlag: data?.activeFlag,
            //     departmentId: data?.departmentId,
            //     empoyeeId: data?.empoyeeId,
            //     id: data?.id,
            //     notice: data?.notice,
            //     locationId: data?.locationId,
            //   };
            // }) : []
            // localStorage.setItem("rowsData", JSON.stringify(concernDeptUserList));
            setValue("noticeAttachment", r?.data?.noticeAttachment);
            setTemp("dsf");
            setLoadderState(false);
          } else {
            setLoadderState(false);
            //
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // Handle Next
  const handleNext = (data) => {
    setLoadderState(true);
    console.log("activeStep", JSON.parse(localStorage.getItem("rowsData")));

    if (activeStep == steps.length - 1) {
      swal({
        title: "Confirm",
        text: "Are you sure you want to save and proceed?",
        icon: "info",
        buttons: ["Cancel", "Save"],
      })
        .then((confirmed) => {
          let formattedRequisitionDate = moment(
            watch("requisitionDate")
          ).format("YYYY-MM-DD");
          const finalBodyForApi = {
            pageMode: localStorage.getItem("pageMode"),
            noticeID: localStorage.getItem("noticeID"),
            id: localStorage.getItem("noticeID"),
            concernDeptUserList: JSON.parse(localStorage.getItem("rowsData")),
            noticeAttachment: JSON.parse(
              localStorage.getItem("noticeAttachment")
            ),
            advocateAddress: watch("advocateAddress"),
            advocateAddressMr: watch("advocateAddressMr"),
            departmentName: watch("departmentName"),
            inwardNo: watch("inwardNo"),
            departmentName: userDepartment,
            noticeDate: watch("noticeDate"),
            noticeDetails: watch("noticeDetails"),
            noticeDetailsMr: watch("noticeDetailsMr"),
            clientNameEn: watch("clientNameEn"),
            clientNameMr: watch("clientNameMr"),
            noticeRecivedDate: watch("noticeRecivedDate"),
            noticeRecivedFromAdvocatePerson: watch(
              "noticeRecivedFromAdvocatePerson"
            ),
            noticeRecivedFromAdvocatePersonMr: watch(
              "noticeRecivedFromAdvocatePersonMr"
            ),
            // requisitionDate: watch("requisitionDate"),
            requisitionDate: formattedRequisitionDate,

            serialNo: watch("serialNo"),
          };

          // console.log("finalBodyForApi", finalBodyForApi);
          axios
            .post(`${urls.LCMSURL}/notice/saveTrnNotice`, finalBodyForApi, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            .then((res) => {
              if (res.status == 201 || res.status == 200 || res.status) {
                localStorage.removeItem("noticeAttachment");
                localStorage.removeItem("rowsData");
                localStorage.removeItem("pageMode");
                localStorage.removeItem("noticeID");
                setLoadderState(false);
                sweetAlert(
                  // "Saved!",
                  language == "en" ? "Saved" : "जतन केले",
                  language == "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  // language == "en" ? "Saved" : "जतन केले",
                  // //  "Record Saved successfully !",
                  // language === "en"
                  //   ? "Record Saved successfully !"
                  //   : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
                router.push(`/LegalCase/transaction/newNotice/`);
              } else {
                setLoadderState(false);
                //
              }
            });
        })
        .catch((err) => {
          setLoadderState(false);
          //
        });

      //
    } else {
      setLoadderState(false);
      setActiveStep(activeStep + 1);
    }

    setLoadderState(false);
  };

  useEffect(() => {
    console.log("userDepartment", userDepartment);
    if (
      JSON.parse(localStorage.getItem("noticeID")) != null ||
      JSON.parse(localStorage.getItem("noticeID")) != undefined
    ) {
      setNoticeID(JSON.parse(localStorage.getItem("noticeID")));
    }
  }, []);

  // useEffect(() => {
  //   console.log("activeStep", activeStep);
  //   if (activeStep == "0") {
  //     setDataValidation(Schema);
  //   } else if (activeStep == "1") {
  //     setDataValidation(Schema1);
  //   }

  // }, [activeStep]);

  useEffect(() => {
    getByNoticeID();
  }, [noticeID]);

  // useEffect(() => {
  //   getNoticeNumber();
  //   getOfficeLocation();
  // }, []);

  useEffect(() => {}, [temp]);
  useEffect(() => {
    console.log("pageMode1145", noticePageMode);
  }, [noticePageMode]);

  //
  useEffect(() => {
    if (
      watch("noticeAttachment") != null ||
      watch("noticeAttachment") != undefined
    ) {
      let attachments = watch("noticeAttachment");
      console.log("attachments", attachments);
      let newAttachments = attachments.map((data, index) => {
        return {
          srNo: index + 1,
          id: data?.id,
          activeFlag: data?.activeFlag,
          filePath: data?.filePath,
          extension: data?.extension,
          noticeId: data?.noticeId,
          originalFileName: data?.originalFileName,
          attachedNameMr: data?.attachedNameMr,
          attachedNameEn: data?.attachedNameEn,
          attachedDate: data?.attachedDate,
          attacheDesignation: data?.attacheDesignation,
          attacheDepartment: data?.attacheDepartment,
        };
        console.log("data3432", data?.filePath);
      });
      console.log("noticeAttachment", newAttachments);
      localStorage.setItem("noticeAttachment", JSON.stringify(newAttachments));
    }
  }, [watch("noticeAttachment")]);

  // useEffect(() => {
  //   if (watch("rowsData") != null || watch("rowsData") != undefined) {
  //     console.log("noticeEdlf", watch("rowsData"));
  //     let tempConcernDeptUserList = watch("rowsData");
  //     console.log("tempConcernDeptUserList", tempConcernDeptUserList);
  //     let concernDeptUserList = tempConcernDeptUserList.map((data, index) => {
  //       return {
  //         srNo: index + 1,
  //         id: data?.id,
  //         activeFlag: data?.activeFlag,
  //         departmentId: data?.departmentId,
  //         empoyeeId: data?.empoyeeId,
  //         id: data?.id,
  //         notice: data?.notice,
  //         locationId: data?.locationId,
  //       };
  //     });
  //     localStorage.setItem("rowsData", JSON.stringify(concernDeptUserList));
  //   }
  //   // console.log("concernDeptUserList", watch("rowsData"));
  // }, [watch("rowsData")]);

  // useEffect(()=>{
  // console.log("dataValidation",dataValidation)
  // },[dataValidation])

  // View
  return (
    <>
      <Box
        sx={{
          marginLeft: "1vw",
        }}
      ></Box>
      {loadderState ? (
        // <Loader />
        <Loader />
      ) : (
        // <div
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     height: "60vh", // Adjust itasper requirement.
        //   }}
        // >
        //   <Paper
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       background: "white",
        //       borderRadius: "50%",
        //       padding: 8,
        //     }}
        //     elevation={8}
        //   >
        //     <CircularProgress color="success" />
        //   </Paper>
        // </div>
        // <div
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     height: "60vh", // Adjust itasper requirement.
        //   }}
        // >
        //   <Paper
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       background: "white",
        //       borderRadius: "50%",
        //       padding: 8,
        //     }}
        //     elevation={8}
        //   >
        //     <CircularProgress color="success" />
        //   </Paper>
        // </div>
        <div>
          <div>
            <BreadcrumbComponent />
          </div>
          {/** Provide Custmize theme using themeProvider */}
          <ThemeProvider theme={theme}>
            {loadderState ? (
              <Loader />
            ) : (
              <Paper
                sx={{
                  // marginLeft: 5,
                  // marginRight: 5,
                  // marginTop: 5,
                  // marginBottom: 5,
                  padding: 1,
                }}
                elevation={5}
              >
                {/** Main Heading */}
                {/* <marquee> */}
                {/* <Typography
                  variant="h5"
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    marginTop: "5px",
                  }}
                >
                  <strong>{<FormattedLabel id="notice" />}</strong>
                </Typography> */}
                {/* </marquee> */}
                {/* <br /> <br /> */}
                <br />

                <Grid
                  container
                  // style={{
                  //   background:
                  //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  // }}

                  style={{
                    // backgroundColor: "#0084ff",
                    backgroundColor: "#556CD6",
                    // backgroundColor: "#1C39BB",
                    height: "8vh",

                    // #00308F
                    // color: "white",

                    fontSize: 19,
                    // marginTop: 30,
                    // marginBottom: "50px",
                    // marginTop: ,
                    // padding: 8,
                    // paddingLeft: 30,
                    // marginLeft: "50px",
                    marginRight: "75px",
                    borderRadius: 100,
                  }}
                >
                  {/* <IconButton> */}
                  <IconButton
                    style={{
                      marginBottom: "2vh",
                      color: "white",
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
                        // background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                      }}
                    >
                      {" "}
                      <FormattedLabel id="notice" />
                    </h2>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {/** Steeper icons */}
                    <Stack sx={{ width: "100%" }} spacing={4}>
                      <Stepper
                        alternativeLabel
                        activeStep={activeStep}
                        connector={<ColorlibConnector />}
                      >
                        {steps.map((label) => {
                          const labelProps = {};
                          const stepProps = {};

                          return (
                            <Step key={label} {...stepProps}>
                              <StepLabel
                                {...labelProps}
                                StepIconComponent={ColorlibStepIcon}
                              >
                                {label}
                              </StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>
                    </Stack>
                  </Grid>
                </Grid>
                {/** Main Form */}
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(handleNext)}
                    sx={{ marginTop: 10 }}
                  >
                    {getStepContent(activeStep)}

                    {/** Button */}
                    {/* <Stack
                      direction="row"
                      spacing={5}
                      sx={{ paddingLeft: "30px", marginTop: "10vh", align: "center" }}
                    > */}

                    {/** Back Button */}

                    <Grid
                      container
                      style={{
                        marginLeft: "1vw",
                      }}
                    >
                      <Grid item xs={2} xl={2} lg={2} md={2}>
                        <Button
                          disabled={activeStep === 0}
                          // disabled
                          onClick={handleBack}
                          variant="contained"
                        >
                          {<FormattedLabel id="back" />}
                        </Button>
                      </Grid>

                      <Grid
                        style={{
                          // backgroundColor: "red",
                          marginLeft: "5vw",
                        }}
                        item
                        xs={6}
                        xl={6}
                        lg={6}
                      ></Grid>
                      <Grid item xs={1.5} xl={2} lg={1.7}>
                        {/** SaveAndNext Button */}
                        {activeStep != steps.length - 1 && (
                          <Button
                            variant="contained"
                            type="submit"
                            sx={{
                              width: "100%",
                            }}
                          >
                            <FormattedLabel id="saveAndNext" />
                          </Button>
                        )}

                        {activeStep == steps.length - 1 && (
                          <>
                            {localStorage.getItem("pageMode") == "Draft" && (
                              <>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    pageModeM = "NOTICE_DRAFT";
                                    // setNoticePageMode("NOTICE_DRAFT");
                                    handleNext("NOTICE_DRAFT");
                                  }}
                                >
                                  <FormattedLabel id="finish" />
                                </Button>
                              </>
                            )}

                            {localStorage.getItem("pageMode") ==
                              "NOTICE_CREATE" && (
                              <>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    handleNext();
                                  }}
                                >
                                  <FormattedLabel id="finish" />
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </Grid>

                      <Grid item xs={1} xl={1} lg={1.2} md={1}>
                        {/** Exit Button */}
                        <Button
                          variant="contained"
                          sx={{
                            marginLeft: "3vw",
                          }}
                          onClick={() => {
                            localStorage.removeItem("noticeAttachment");
                            localStorage.removeItem("rowsData");
                            localStorage.removeItem("pageMode");
                            localStorage.removeItem("noticeID");
                            router.push(`/LegalCase/transaction/newNotice/`);
                          }}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>

                    {/* </Stack> */}
                  </form>
                </FormProvider>
              </Paper>
            )}
          </ThemeProvider>
        </div>
      )}
    </>
  );
};

export default LinaerStepper;
