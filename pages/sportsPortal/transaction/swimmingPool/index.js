/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Check from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
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
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks.js";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel.js";
import {
  BookingDetailSchema,
  PersonalDetailsSchema,
  EcsDetailsSchema,
  documentsUpload,
} from "../../../../containers/schema/sportsPortalSchema/swiimingSchema";
import steeperCSS from "../../../../styles/sportsPortalStyles/stepper.module.css";
import theme from "../../../../theme.js";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import PersonalDetails from "../components/PersonalDetails";
import Swimming from "../components/Swimming";
// import EcsDetails from "../../components/EcsDetails";
import EcsDetails from "../components/EcsDetails";
import FileTable from "../components/fileTableSports/FileTable";
import SelfDeclarationSwimming from "../swimmingPoolM/selfDeclarationSwimming.js";

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
    2: <BabyChangingStationIcon />,
    3: <ViewHeadlineIcon />,
    // 3: <HomeIcon />,
    4: <BrandingWatermarkIcon />,
    5: <AddCircleIcon />,
    6: <UploadFileIcon />,
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
      <FormattedLabel id="eCSDetails" />
    </strong>,
    <strong key={4}>
      <FormattedLabel id="documentUploadDaily" />
    </strong>,
    <strong key={5}>
      <FormattedLabel id="selfDeclaration" />
    </strong>,
  ];
}

function GetStepContent(step) {
  switch (step) {
    case 0:
      return <Swimming />;
    case 1:
      return <PersonalDetails />;
    case 2:
      return <EcsDetails />;
    case 3:
      return <FileTable key={2} serviceId={32} />;
    case 4:
      return <SelfDeclarationSwimming />;
    default:
      return "unknown step";
  }
}

// Linear Stepper
const Index = () => {
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [dataValidation, setDataValidation] = useState(BookingDetailSchema);
  const userToken = useGetToken();
  const [filePath, setFilePath] = useState("");
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
  const [loadderState1, setLoadderState1] = useState(false);
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      applicationNumber: "",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      dateOfBirth: null,
      crCityName: "Pimpri-Chinchwad",
      crState: "Maharashtra",
      prCityName: "Pimpri-Chinchwad",
      prState: "Maharashtra",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      age: "",
      mobileNo: "",
      aadharCardNo: "",
      emailAddress: "",
      cAddress: "",
      cCityName: "",
      cState: "",
      cPincode: "",
      cLattitude: "",
      cLongitude: "",
      pAddress: "",
      pCityName: "",
      pState: "",
      pPincode: "",
      pLattitude: "",
      pLongitude: "",
      swimmingPoolName: "",
      slots: "",
      swimmingPoolDetailsDao: [],
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

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  let user = useSelector((state) => state?.user?.user);
  const [loadderState, setLoadderState] = useState(false);
  const userId = useSelector((state) => state?.user.user.id);

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const karKutheTariCall = (docKey, newFilePath) => {
    setValue(
      "attachmentss",
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
    axios
      .get(
        `${
          URLS.SPURL
        }/gymBooking/getByCreatedUserIdAndService?createdUserId=${userId}&service=${32}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        console.log("res22", res?.data?.filePath);
        if (res?.status == 200 || res?.status == 201) {
          filePath = res?.data?.filePath;
          karKutheTariCall(res?.data?.docKey, res?.data?.filePath);
          console.log("shgdcshg", filePath);
          setValue("medicalCertificate", filePath);
          const temp = getValues("attachmentss")?.map((row, index) => {
            return {
              ...row,
              srNo: index + 1,
              filePath:
                row.fileKey == res?.data?.docKey
                  ? res?.data?.filePath
                  : row?.filePath,
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
  };

  // Handle Next
  const handleNext = (data) => {
    setLoadderState1(true);
    let swimmingId = null;
    const url = `${URLS.SPURL}/swimmingPool/save`;
    let docs = [];
    let docsMr = [];
    let body = null;

    watch("attachmentss")?.map((g) => {
      if (g?.filePath == null) {
        docs.push(g?.documentChecklistEn);
        docsMr.push(g?.documentChecklistMr);
      }
    });

    if (activeStep == steps.length - 1) {
      setLoadderState1(true);

        if (watch("type") === "No Concession") {
          //! no concession

          body = {
            ...data,
            id:
              watch("id") != null &&
              watch("id") != "" &&
              watch("id") != "undefined"
                ? Number(watch("id"))
                : null,
            swimmingPoolDetailsDao:
              watch("swimmingPoolDetailsDao") == undefined
                ? {}
                : [...watch("swimmingPoolDetailsDao")],
            activeFlag: "Y",
            createdUserId: user?.id,
            pageMode: "APPLICATION_CREATED",
            serviceId: 32,
            emailAddress: watch("emailAddress"),
            attachmentList:
              watch("attachmentss") == undefined
                ? []
                : [...watch("attachmentss")?.filter((r) => r.filePath)],
          };
          axios
            .post(url, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                role: "ADMIN",
              },
            })
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setLoadderState1(false);
                swimmingId = res?.data?.message?.split(":")[1];
                console.log("Swimming Pool Cha Data", res);
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
                  pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptSwimmingDaily`,
                  query: {
                    Id:swimmingId,
                    // Id: res?.data?.message?.split(": ")[1],
                    serviceId: 32,
                    applicantType: watch("type"),
                  },
                });
              } else {
                setLoadderState1(false);
              }
            })
            .catch((error) => {
              setLoadderState1(false);
              callCatchMethod(error, language);
              console.log("swimmingPoolDailyCatch", error);
            });
        } else {
          //! concession
          body = {
            ...data,
            id:
              watch("id") != null &&
              watch("id") != "" &&
              watch("id") != "undefined"
                ? Number(watch("id"))
                : null,
            swimmingPoolDetailsDao:
              watch("swimmingPoolDetailsDao") == undefined
                ? {}
                : [...watch("swimmingPoolDetailsDao")],
            activeFlag: "Y",
            createdUserId: user?.id,
            pageMode: "APPLICATION_CREATED",
            serviceId: 32,
            emailAddress: watch("emailAddress"),
            attachmentList:
              watch("attachmentss") == undefined
                ? []
                : [...watch("attachmentss")?.filter((r) => r.filePath)],
          };

          axios
            .post(url, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                role: "ADMIN",
              },
            })
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setLoadderState1(false);
                swimmingId = res?.data?.message?.split(":")[1];
                console.log("Swimming Pool Cha Data", res);
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
                  pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptSwimmingDaily`,
                  query: {
                    Id: swimmingId,
                    serviceId: 32,
                  },
                });
              } else {
                setLoadderState1(false);
              }
            })
            .catch((error) => {
              setLoadderState1(false);
              console.log("swimmingPoolDailyCatch", error);
              callCatchMethod(error, language);
            });
        }
      }
    else{
      if(activeStep == steps.length - 2){
        if (
          (docs?.length != 0 &&
            docs?.length != undefined &&
            docs?.length != null) ||
          (docsMr?.length != 0 &&
            docsMr?.length != undefined &&
            docsMr?.length != null)
        ) {
          setLoadderState1(false);
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
          setLoadderState1(false);
          setActiveStep(activeStep + 1);
        }



    }// if not final step
    else {
      setLoadderState1(false);
      setActiveStep(activeStep + 1);
    }
  }
  };
  // handleNext End

  const swimmingPoolGetById = (id) => {
    const url = `${URLS.SPURL}/swimmingPool/getById?id=${id}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("swimmingPoolGetById", res?.data);
          reset(res?.data);
          setLoadderState1(false);
        } else {
          setLoadderState1(false);
        }
      })
      .catch((error) => {
        setLoadderState1(false);
        callCatchMethod(error, language);
      });
  };

  //! =====================> USE Effects
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

  useEffect(() => {
    checkMedicalCertificateNo();
    console.log("Medical Certificate");
  }, [watch("userId")]);

  useEffect(() => {
    if (
      watch("memberId") != null &&
      watch("memberId") != undefined &&
      watch("memberId") != ""
    ) {
      setLoadderState1(true);
      swimmingPoolGetById(watch("memberId"));
    } else {
      setLoadderState1(false);
    }
  }, [watch("memberId")]);

  useEffect(() => {
    console.log("errors3", errors);
  }, [errors]);

  // View
  return (
    <>
      {loadderState1 ? (
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
                    type="submit"
                  >
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
                      <Swimming readOnly formPreviewDailog />
                      <PersonalDetails readOnly />
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
      )}
    </>
  );
};

export default Index;
