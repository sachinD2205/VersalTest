import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
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
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import EcsDetails from "../../components/EcsDetails";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import steeperCSS from "../../../../../styles/sportsPortalStyles/stepper.module.css";
// import FileTable from "../../../../../components/townPlanning/fileTablefire/FileTable";
import { yupResolver } from "@hookform/resolvers/yup";
import { GroupAdd } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Check from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";

import {
  BookingDetailSchema,
  PersonalDetailsSchema,
  EcsDetailsSchema,
  documentsUpload,
} from "../../../../../containers/schema/sportsPortalSchema/gymSchema";
import theme from "../../../../../theme.js";
import BookingDetailsGym from "../../components/BookingDetailsGym";
import BookingPersonDetailsGym from "../../components/BookingPersonDetailsGym";
import FileTable from "../../components/fileTableSports/FileTable";
import Loader from "../../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import SelfDeclarationGym from "../selfDeclarationGym.js";
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
    // 3: <HomeIcon />,

    3: <BrandingWatermarkIcon />,

    // 4: <BrandingWatermarkIcon />,
    // 4: <AccountBalanceIcon />,

    5: <AddCircleIcon />,
    6: <UploadFileIcon />,
    4: <ViewHeadlineIcon />,
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
    // <strong>Booking Details</strong>,
    <strong key={1}>
      <FormattedLabel id="bookingDetails" />
    </strong>,
    // <strong>`${tabName}`</strong>,
    <strong key={2}>
      <FormattedLabel id="personalGroupDetails" />
    </strong>,
    <strong key={3}>
      <FormattedLabel id="eCSDetails" />
    </strong>,
    // <strong key={3}>
    //   <FormattedLabel id="aadharAuthenticationDetails" />
    // </strong>,
    // <strong key={4}>
    //   <FormattedLabel id="eCSDetails" />
    // </strong>,
    <strong key={4}>
      <FormattedLabel id="documentsUpload" />
    </strong>,
    <strong key={5}>
      <FormattedLabel id="selfDeclaration" />
    </strong>,
  ];
}
function GetStepContent(step) {
  // const [bookingTypeR, setBookingTypeR] = useState(null);
  switch (step) {
    case 0:
      // return <BookingDetails bookingType={setBookingTypeR} />;
      // case 0:
      return <BookingDetailsGym />;

    case 1:
      return <BookingPersonDetailsGym />;

    case 2:
      return <EcsDetails />;

    case 3:
      return (
        <FileTable
          key={2}
          serviceId={36}
          // userId={userId}
          // filePath={getValues("finalFilePath")}
        />
      );
    case 4:
      return <SelfDeclarationGym />;
    default:
      return "unknown step";
  }
}

// Linear Stepper
const LinaerStepper = () => {
  const language = useSelector((state) => state.labels.language);
  const [dataValidation, setDataValidation] = useState(BookingDetailSchema);
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      // bookingRegistrationId: "SP00001",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
    },
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
  });

  const {
    reset,
    method,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user.user);
  const groups = useSelector((state) => {
    console.log("123", state.user.group);
  });
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

  // Handle Next
  const handleNext = (data) => {
    console.log("SubmitData", data, activeStep, watch());
    const url = `${urls.SPURL}/gymBooking/saveGymBooking`;
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
      createdUserId: user?.id,
      serviceId: 36,
      // dateOfBirth: moment(data?.dateOfBirth).format("DD-MM-YYYY"),
      emailAddress: watch("emailAddress"),
      pageMode: "APPLICATION_CREATED",
      attachmentList:
        watch("attachmentss") == undefined
          ? []
          : [...watch("attachmentss")?.filter((r) => r.filePath)],
    };
    const _bodyy = {
      ...data,
      createdUserId: user?.id,
      serviceId: 36,
      emailAddress: watch("emailAddress"),
      pageMode: "APPLICATION_SUBMITTED",
      attachmentList:
        watch("attachmentss") == undefined
          ? []
          : [...watch("attachmentss")?.filter((r) => r.filePath)],
    };

    if (activeStep == steps.length - 1) {
      setLoadderState(true);

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
        if (watch("type") === "No Concession") {
          // alert("If");
          axios
            .post(url, _bodyy, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                role: "ADMIN",
              },
            })
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setLoadderState(false);
                console.log("Run Zaly ka?");
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
                  pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptgym`,
                  query: {
                    Id: res?.data?.message?.split(":")[1],
                    serviceId: 36,
                    // applicantType: res?.data?.applicantType,
                    applicantType: watch("type"),
                  },
                });
              } else {
                setLoadderState(false);
              }
            })
            .catch((error) => {
              setLoadderState(false);
              callCatchMethod(error, language);
              console.log("GymBookingFinalApiSubmit", error);
            });
        } else {
          // alert("Else");
          axios
            .post(url, _body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                role: "ADMIN",
              },
            })
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setLoadderState(false);
                console.log("Run Zaly ka?");
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
                  pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptgym`,
                  query: {
                    Id: res?.data?.message?.split(":")[1],
                    serviceId: 36,
                  },
                });
              } else {
                setLoadderState(false);
              }
            })
            .catch((error) => {
              setLoadderState(false);
              callCatchMethod(error, language);
              console.log("GymBookingFinalApiSubmit", error);
            });
        }
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  useEffect(() => {
    console.log("steps", activeStep);
    if (activeStep == "0") {
      setDataValidation(BookingDetailSchema);
    } else if (activeStep == "1") {
      setDataValidation(PersonalDetailsSchema);
    } else if (activeStep == "2") {
      setDataValidation(EcsDetailsSchema);
    } else if (activeStep == "3") {
      setDataValidation(documentsUpload);
    }
  }, [activeStep]);

  const userId = useSelector((state) => state?.user.user.id);
  const token = useSelector((state) => state.user.user.token);

  function showFileName(fileName) {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", fileName);
    console.log("name34234", fileName);
    console.log("DecryptPhoto", DecryptPhoto);
    let fileNamee = [];
    fileNamee = DecryptPhoto.split("__");
    console.log("Shree22", fileNamee[1]);
    setFileName(fileNamee[1]);
    // return fileNamee[1];
  }

  useEffect(() => {
    checkMedicalCertificateNo();
    console.log("Medical Certificate");
  }, [watch("userId")]);

  useEffect(() => {
    console.log("filePath", filePath);
    if (filePath) {
      showFileName(filePath);
    }
  }, [filePath]);

  const karKutheTariCall = (docKey, newFilePath) => {
    console.log("khara bol");
    setValue(
      "attachmentList",
      getValues("attachmentss")?.map((row, index) => {
        return {
          ...row,
          srNo: index + 1,
          filePath: row.fileKey == docKey ? newFilePath : row.filePath,
        };
      })
    );
  };

  const checkMedicalCertificateNo = () => {
    console.log("call21");
    // let user = watch("user");
    // var finalFilePath = getValues("filePath");

    // if (user != null && user != undefined && user != "") {
    axios
      // .get(`${URLS.SPURL}/swimmingBookingMonthly/getByUserId?userId=${userId}`)
      .get(
        `${
          urls.SPURL
        }/gymBooking/getByCreatedUserIdAndService?createdUserId=${userId}&service=${36}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("res22", res.data);
        if (res?.status == 200 || res?.status == 201) {
          filePath = res?.data?.filePath;
          // fileName = res?.data?.fileName;

          karKutheTariCall(res?.data?.docKey, res?.data?.filePath);
          console.log("shgdcshg", filePath);
          // console.log("FileName22", fileName);
          // setValue("medicalCertificate", res?.data?.medicalCertificate);
          setValue("medicalCertificate", filePath);
          // setValue("medicalCertificate", fileName);
          const temp = getValues("attachmentss")?.map((row, index) => {
            return {
              ...row,
              srNo: index + 1,
              filePath:
                row.fileKey == res?.data?.docKey
                  ? res.data.filePath
                  : row.filePath,
            };
          });
          setValue("attachmentss", temp);
          console.log("khara bol: ", getValues("attachmentss"));
        } else {
          console.log("Not Valid", res?.data?.medicalCertificate);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

  const [formPreviewDailog, setFormPreviewDailog] = useState(false);

  // formPreview
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // View
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
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
            {/* <Stepper
                alternativeLabel
                activeStep={activeStep}
                style={{
                  backgroundColor: "#F2F3F4",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                {steps.map((step, index) => {
                  const labelProps = {};
                  const stepProps = {};
  
                  return (
                    <Step {...stepProps} key={index}>
                      <StepLabel {...labelProps} key={index}>
                        {step}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper> */}
            <Stack sx={{ width: "100%" }} spacing={4}>
              {/* <Stepper
                  alternativeLabel
                  // activeStep={1}
                  activeStep={activeStep}
                  connector={<QontoConnector />}
                >
                  {steps.map((label) => {
                    const labelProps = {};
                    const stepProps = {};
  
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel
                          {...labelProps}
                          StepIconComponent={QontoStepIcon}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper> */}
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
                {language == "en" ? " Thank You" : "धन्यवाद"}
              </Typography>
            ) : (
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(handleNext)}
                  // sx={{ marginTop: 10 }}
                >
                  {GetStepContent(activeStep)}

                  {/* <Button
                  disabled={activeStep === 0}
                  // disabled
                  onClick={handleBack}
                  variant="contained"
                  style={{ marginRight: 30, marginLeft: 10 }}
                >
                  back
                </Button>
                <Button
                  variant="contained"
                  // disabled={activeStep === steps.length - 1}
                  // color="primary"
                  // onClick={methods.handleSubmit(handleNext)}
                  type="submit"
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button> */}
                  <Button
                    disabled={activeStep === 0}
                    // disabled
                    onClick={handleBack}
                    variant="contained"
                    style={{ marginRight: 30, marginLeft: 10 }}
                  >
                    {/* back */}
                    <FormattedLabel id="back" />
                  </Button>
                  {activeStep == steps.length - 1 && (
                    <Button
                      onClick={() => {
                        formPreviewDailogOpen();
                      }}
                      variant="contained"
                      style={{ marginRight: 30, marginLeft: 10 }}
                      endIcon={<VisibilityIcon />}
                      // size="small"
                    >
                      {/* View Form */}
                      <FormattedLabel id="viewForm" />
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    style={{ marginRight: 30, marginLeft: 10 }}
                    disabled={
                      activeStep === steps.length - 1 &&
                      !watch("acceptDeclaration")
                    }
                    // color="primary"
                    // onClick={handleNext}
                    type="submit"
                  >
                    {/* {activeStep === steps.length - 1 ? "Submit" : "Next"} */}
                    {activeStep === steps.length - 1 &&
                    watch("acceptDeclaration") ? (
                      <FormattedLabel id="submit" />
                    ) : (
                      <FormattedLabel id="next" />
                    )}
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
                          {<FormattedLabel id="viewForm" />}
                          {/* View Form */}
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
                                bgcolor: "red", // theme.palette.primary.main
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
                      <BookingDetailsGym readOnly />
                      <BookingPersonDetailsGym readOnly />
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
                          {language == "en" ? "Exit" : "बाहेर पडा"}
                        </Button>
                      </Grid>
                    </DialogTitle>
                  </Dialog>
                </form>
              </FormProvider>
            )}
          </Paper>
        </ThemeProvider>
      )}
    </>
  );
};

export default LinaerStepper;
