import { yupResolver } from "@hookform/resolvers/yup";
import { GroupAdd } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Check from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
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
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import URLS from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  AadharAuthenticationSchema,
  BookingDetailSchema,
  EcsDetailsSchema,
  PersonalDetailsSchema,
  documentsUpload,
} from "../../../../containers/schema/sportsPortalSchema/sportBookingSchema";
import steeperCSS from "../../../../styles/sportsPortalStyles/stepper.module.css";
import theme from "../../../../theme.js";
import AadharAuthentication from "../components/AadharAuthentication";
import AddMemberSports from "../components/AddMemberSports";
import BookingDetails from "../components/BookingDetails";
import EcsDetails from "../components/EcsDetails";
import GroupDetails from "../components/GroupDetails";
import PersonalDetailsForSports from "../components/PersonalDetailsForSports";
import FileTable from "../components/fileTableSports/FileTable";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util.js";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
// import SelfDeclarationSportsBooking from "../selfDeclarationSportsBooking.js";
import SelfDeclarationSportsBooking from "../sportBooking/selfDeclarationSportsBooking.js";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

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
    1: <PermIdentityIcon />,
    2: <GroupAdd />,
    3: <BrandingWatermarkIcon />,
    4: <AccountBalanceIcon />,
    5: <AddCircleIcon />,
    // 6: <UploadFileIcon />,
    6: <ViewHeadlineIcon />,
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
    <strong key={1}>
      <FormattedLabel id="bookingDetails" />
    </strong>,
    <strong key={2}>
      <FormattedLabel id="personalGroupDetails" />
    </strong>,
    <strong key={3}>
      <FormattedLabel id="aadharAuthenticationDetails" />
    </strong>,
    <strong key={4}>
      <FormattedLabel id="eCSDetails" />
    </strong>,
    <strong key={5}>
      <FormattedLabel id="documentsUpload" />
    </strong>,
    <strong key={6}>
      <FormattedLabel id="selfDeclaration" />
    </strong>,
  ];
}
function GetStepContent(step) {
  const [bookingTypeR, setBookingTypeR] = useState(null);
  switch (step) {
    case 0:
      return <BookingDetails bookingType={setBookingTypeR} />;
    case 1:
      if (bookingTypeR && bookingTypeR === "Individual") {
        return <PersonalDetailsForSports />;
      } else {
        return (
          <>
            <PersonalDetailsForSports />
            <AddMemberSports />;
          </>
        );
      }
    case 2:
      return <AadharAuthentication />;
    case 3:
      return <EcsDetails />;
    case 4:
      return <FileTable serviceId={29} />;
    case 5:
      return <SelfDeclarationSportsBooking />;
    default:
      return "unknown step";
  }
}

// Linear Stepper
const LinaerStepper = () => {
  const [dataValidation, setDataValidation] = useState(BookingDetailSchema);
  const [activeStep, setActiveStep] = useState(0);
  const [loadderState, setLoadderState] = useState(false);
  const steps = getSteps();
  const language = useSelector((state) => state?.labels?.language);
  const token = useSelector((state) => state.user.user.token);
  const [loadderState1, setLoadderState1] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
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
  const formPreviewDailogOpen = () => {
    setValue("formPreviewDailogState", true);
    setFormPreviewDailog(true);
  };
  const formPreviewDailogClose = () => {
    setValue("formPreviewDailogState", false);
    setFormPreviewDailog(false);
  };
  // const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  // const formPreviewDailogClose = () => setFormPreviewDailog(false);
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      bookingRegistrationId: "",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      venue: "",
      title: "",
      applicantFirstName: "",
      applicantMiddleName: "",
      applicantLastName: "",
      gender: "",
      dateOfBirth: null,
      age: "",
      mobile: "",
      aadharNo: "",
      emailAddress: "",
      currentAddress: "",
      cityName: "",
      crPincode: "",
      permanentAddress: "",
      aadhaarNo: "",
      bankMaster: "",
      branchName: "",
      bankAccountHolderName: "",
      bankAccountNo: "",
      ifscCode: "",
      bankAddress: "",
      sportsBookingGroupDetailsDao: [],
      serviceName: "Sports Booking",
    },
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
  });
  const {
    reset,
    method,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  // Handle Next
  const handleNext = (data) => {
    console.log("sportsBookingFinalSubmitData", data, activeStep, watch());
    const url = `${URLS.SPURL}/sportsBooking/saveSportsBooking`;
    let sportsBookingKey = null;
    let docs = [];
    let docsMr = [];

    watch("attachmentss")?.map((g) => {
      if (g?.filePath == null) {
        docs.push(g?.documentChecklistEn);
        docsMr.push(g?.documentChecklistMr);
      }
    });

    console.log(watch("attachmentss"), "sdfsdfdslfjdsl", docs, docsMr);

    const _body = {
      ...data,
      // id:
      //   watch("id") != null &&
      //   watch("id") != null &&
      //   watch("id") != "" &&
      //   watch("id") != "undefined"
      //     ? Number(watch("id"))
      //     : null,
      id: null,
      createdUserId: Number(user?.id),
      serviceId: 29,
      emailAddress: watch("emailAddress"),
      pageMode: "APPLICATION_CREATED",
      attachmentList:
        watch("attachmentss") == undefined
          ? []
          : [...watch("attachmentss")?.filter((r) => r.filePath)],
    };
    const _bodyy = {
      ...data,
      // id:
      //   watch("id") != null &&
      //   watch("id") != null &&
      //   watch("id") != "" &&
      //   watch("id") != "undefined"
      //     ? Number(watch("id"))
      //     : null,
      id: null,
      createdUserId: Number(user?.id),
      serviceId: 29,
      emailAddress: watch("emailAddress"),
      pageMode: "APPLICATION_SUBMITTED",
      attachmentList:
        watch("attachmentss") == undefined
          ? []
          : [...watch("attachmentss")?.filter((r) => r.filePath)],
    };

    console.log("body22", _bodyy);

    if (activeStep == steps.length - 1) {
      setLoadderState1(true);
     
        if (watch("type") === "No Concession") {
          // alert("IF");
          axios
            .post(url, _bodyy, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                role: "ADMIN",
              },
            })
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setLoadderState1(false);
                sportsBookingKey = res?.data?.message?.split(":")[1];
                console.log("SportBookingFinalSubmit", res);
                language == "en"
                  ? swal(
                      "Submited!",
                      "Record Submited successfully !",
                      "success"
                    )
                  : swal(
                      "सबमिट केले",
                      "रेकॉर्ड यशस्वीरित्या सबमिट केले !",
                      "success"
                    );
                router.push({
                  pathname: `/sportsPortal/transaction/components/acknowledgementSportsBooking`,
                  query: {
                    Id:sportsBookingKey,
                    // Id: res?.data?.message?.split(":")[1],
                    serviceId: 29,
                    applicantType: watch("type"),
                  },
                });
              } else {
                setLoadderState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else {
          // alert("else");
          axios
            .post(url, _body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                role: "ADMIN",
              },
            })
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setLoadderState1(false);
                sportsBookingKey = res?.data?.message?.split(":")[1];
                console.log("SportBookingFinalSubmit", res);
                language == "en"
                  ? swal(
                      "Submited!",
                      "Record Submited successfully !",
                      "success"
                    )
                  : swal(
                      "सबमिट केले",
                      "रेकॉर्ड यशस्वीरित्या सबमिट केले !",
                      "success"
                    );
                router.push({
                  pathname: `/sportsPortal/transaction/components/acknowledgementSportsBooking`,
                  query: {
                    // Id: sportsBookingKey,
                    Id:res?.data?.message?.split(":")[1],
                    serviceId: 29,
                  },
                });
              } else {
                setLoadderState(false);
              }
            })
            .catch((error) => {
              setLoadderState(false);
              callCatchMethod(error, language);
            });
        }
      
    } 
    else {

      


      
      if(activeStep == steps.length - 2){



        if (
          (docs?.length != 0 &&
            docs?.length != undefined &&
            docs?.length != null) ||
          (docsMr?.length != 0 &&
            docsMr?.length != undefined &&
            docsMr?.length != null)
        ) {
          setLoadderState(false);
          language == "en"
            ? sweetAlert({
                title: "Required!",
                text: "Please Upload  " + docs?.toString(),
                icon: "error",
                button: "Ok",
              })
            : sweetAlert({
                title: "आवश्यक आहे!",
                text: "कृपया अपलोड करा " + docsMr?.toString(),
                icon: "error",
                button: "ओके",
              });
        } else {
          setActiveStep(activeStep + 1);
        }
      }else{
        setActiveStep(activeStep + 1);
      }
    }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const sportsBookingGetById = (id) => {
    // setLoadderState1(true);
    // if(id != null && id !=undefined && watch("sportsBookingKey")){
    const url = `${URLS.SPURL}/sportsBooking/getById?id=${id}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          // setLoadderState1(false);
          console.log("getByIdSportBookingId", res?.data);
          reset(res?.data);
        } else {
          // setLoadderState1(false);
        }
      });
    // .catch((error) => {
    //   callCatchMethod(error, language);
    // });
    // }
  };

  // ===================> useEffects <===========
  useEffect(() => {
    if (activeStep == "0") {
      setDataValidation(BookingDetailSchema);
    } else if (activeStep == "1") {
      setDataValidation(PersonalDetailsSchema);
    } else if (activeStep == "2") {
      setDataValidation(AadharAuthenticationSchema);
    } else if (activeStep == "3") {
      setDataValidation(EcsDetailsSchema);
    } else if (activeStep == "4") {
      setDataValidation(documentsUpload);
    }
  }, [activeStep]);

  useEffect(() => {
    console.log("sdfdsfodsf", watch("sportsBookingKey"));
    if (
      watch("sportsBookingKey") != null &&
      watch("sportsBookingKey") != undefined &&
      watch("sportsBookingKey") != ""
    ) {
      sportsBookingGetById(watch("sportsBookingKey"));
    } else {
    }
  }, [watch("sportsBookingKey")]);

  console.log("addressCheckBox", watch("pAddressMr"));
  useEffect(() => {
    console.log(errors, "errorserrors");
  }, [errors]);
  // View
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div>
          <ThemeProvider theme={theme}>
            <Paper
              sx={{
                margin: 5,
                padding: 1,
                paddingTop: 5,
                paddingBottom: 5,
                backgroundColor: "#FFFFF",
              }}
              elevation={5}
            >
              <Stack sx={{ width: "100%" }} spacing={4}>
                <Stepper
                  className={steeperCSS.Stepper}
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
              {activeStep === steps.length ? (
                <Typography variant="h3" align="center">
                  Thank You
                </Typography>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleNext)}>
                    {GetStepContent(activeStep)}
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="contained"
                      style={{ marginRight: 30, marginLeft: 10 }}
                    >
                      {<FormattedLabel id="back" />}
                    </Button>
                    {activeStep == steps.length - 1 && (
                      <Button
                        onClick={() => {
                          formPreviewDailogOpen();
                        }}
                        variant="contained"
                        style={{ marginRight: 30, marginLeft: 10 }}
                        endIcon={<VisibilityIcon />}
                      >
                        {/* View Form */}
                        {<FormattedLabel id="preview" />}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      style={{ marginRight: 30, marginLeft: 10 }}
                      type="submit"
                      disabled={
                        activeStep === steps.length - 1 &&
                        !watch("acceptDeclaration")
                      }
                    >
                      {activeStep === steps.length - 1 &&
                      watch("acceptDeclaration")
                        ? language != "en"
                          ? "जतन करा"
                          : "submit"
                        : language == "mr"
                        ? "पुढे"
                        : "next"}
                    </Button>

                    {/** Form Preview Dailog  - OK */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={formPreviewDailog}
                      onClose={() => formPreviewDailogClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>
                        <Grid container>
                          <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                            {/* View Form */}
                            <FormattedLabel id="viewForm" />
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sm={2}
                            md={4}
                            lg={6}
                            xl={6}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{
                                marginLeft: "530px",
                                backgroundColor: "primary",
                                ":hover": {
                                  bgcolor: "red",
                                  color: "white",
                                },
                              }}
                              onClick={() => {
                                formPreviewDailogClose();
                              }}
                            >
                              <CloseIcon
                                sx={{
                                  color: "black",
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      <DialogContent>
                        <BookingDetails readOnly />

                        {(
                          <>
                            <PersonalDetailsForSports readOnly />
                            <AddMemberSports readOnly />
                          </>
                        ) || <GroupDetails />}
                        <EcsDetails readOnly />
                      </DialogContent>
                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button onClick={() => formPreviewDailogClose()}>
                            {/* Exit */}
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>
                  </form>
                </FormProvider>
              )}
            </Paper>
          </ThemeProvider>
        </div>
      )}
    </>
  );
};

export default LinaerStepper;
