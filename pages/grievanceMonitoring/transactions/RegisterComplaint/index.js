import { yupResolver } from "@hookform/resolvers/yup";
import { Check } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import SpatialAudioIcon from "@mui/icons-material/SpatialAudio";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  styled,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import Form from "../../../../components/grievanceMonitoring/Form";
import GrievanceDetails from "../../../../components/grievanceMonitoring/GrievanceDetails";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  basicInformation,
  userGrievanceDetails,
} from "../../../../containers/schema/grievanceMonitoring/TransactionsSchema's/raiseGrievance";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
// QontoStepIconRoot
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

// QontoStepIcon
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

// QontoStepIcon
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

// ColorlibConnector
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

// ColorlibStepIconRoot
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
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
  }),
}));

// ColorlibStepIcon
function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <AccountCircleIcon />,
    2: <SpatialAudioIcon />,
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

// ColorlibStepIcon
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

// getSteps
function getSteps() {
  return [
    <strong key={1}>
      <FormattedLabel id="personalDetailss" />
    </strong>,
    <strong key={2}>
      <FormattedLabel id="grievanceDetailss" />
    </strong>,
  ];
}

// getStepContent
function getStepContent(step) {
  switch (step) {
    case 0:
      return <Form key={1} />;

    case 1:
      return <GrievanceDetails key={2} />;

    default:
      return "unknown step";
  }
}

// Index - Stepper
const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const [dataValidation, setDataValidation] = useState(basicInformation);
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    defaultValues: {
      applicantType: null,
      area: "",
      buildingNo: "",
      category: null,
      city: "",
      complaintDescription: "",
      departmentName: null,
      email: "",
      firstName: "",
      houseNo: "",
      location: null,
      middleName: "",
      pincode: "",
      roadName: "",
      subDepartment: null,
      surname: "",
      title: "",
      complaintSubTypeId: "",
      complaintTypeId: null,
      eventTypeId: null,
      mediaId: null,
      wardKey: null,
      zoneKey: null,
    },
  });
  const user = useSelector((state) => {
    return state?.user?.user?.userDao?.id;
  });
  const userSociety = useSelector((state) => {
    return state?.user?.user.societyChecked;
  });
  const userCitizen = useSelector((state) => {
    return state?.user?.user?.id;
  });
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });

  const userCFC = useSelector((state) => {
    return state?.user?.user?.id;
  });
  const { setValue, getValue, watch } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const router = useRouter();
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  const [settingTheFormData, setSettingTheFormData] = useState(null);
  const logedInUser = localStorage.getItem("loggedInUser");
  const headers = { Authorization: `Bearer ${userToken}` };

  // handleparams
  const handelParams = (key) => {
    if (key === "departmentUser") {
      return user;
    } else if (key === "citizenUser") {
      return userCitizen;
    } else if (key === "cfcUser") {
      return userCFC;
    }
  };

  useEffect(() => {
    getMediaType();
  }, []);

  const getMediaType = () => {
    axios
      .get(`${urls.GM}/mediaMaster/getMediaForDropDown`, {
        headers: headers,
      })
      .then((res) => {
        let data = res?.data?.mediaMasterList?.map((r, i) => ({
          id: r.id,
          mediaTypeEn: r.mediaName,
          mediaTypeMr: r.mediaNameMr,
          prefix: r.prefix,
        }));
        setMediaTypes(data);
      }).catch((err)=>{
        cfcErrorCatchMethod(err,false);
      });
  };


  // handleNext
  const handleNext = (data) => {
    if (activeStep == steps.length - 1) {
      sweetAlert({
        text:
          language == "en"
            ? "Do You Want To Preview This Grievance?"
            : "तुम्हाला या तक्रारीचे पूर्वावलोकन करायचे आहे का?",
        icon: "warning",
        buttons: {
          confirm: language == "en" ? "Yes" : "होय",
        },
        dangerMode: false,
        closeOnClickOutside: true,
      }).then((willDelete) => {
        if (willDelete) {
          formPreviewDailogOpen();
          setSettingTheFormData(data);
        }
      });
    } else {
      setActiveStep(activeStep + 1);
    }
  };
useEffect(()=>{

  console.log('userSociety',userSociety )
},[])
  // setterFun
  let setterFun = () => {
    let uploadedDocumentAll = watch("uploadedDocumentAll");
    let documentUploadTable = watch("documentUploadTable");
    let documentUploadTableActiveFlagY = watch(
      "documentUploadTableActiveFlagY"
    );
    console.log("settingTheFormData ", userSociety);
    let bodyToSend = {
      ...settingTheFormData,
      eventCode:
        logedInUser === "citizenUser"
          ?userSociety?'SOC': "W"
          : mediaTypes?.find(
              (obj) => obj.id === Number(settingTheFormData?.mediaId)
            )?.prefix,
      applicantType:
        Number(settingTheFormData?.applicantType) != 0
          ? Number(settingTheFormData?.applicantType)
          : null,
      mediaId:
        Number(settingTheFormData?.mediaId) != 0
          ? Number(settingTheFormData?.mediaId)
          : null,
      complaintTypeId:
        Number(settingTheFormData?.complaintTypeId) != 0
          ? Number(settingTheFormData?.complaintTypeId)
          : null,
      complaintSubTypeId:
        Number(settingTheFormData?.complaintSubTypeId) != 0
          ? Number(settingTheFormData?.complaintSubTypeId)
          : null,
      subDepartment:
        Number(settingTheFormData?.subDepartment) != 0
          ? Number(settingTheFormData?.subDepartment)
          : null,
      category:
        Number(settingTheFormData?.category) != 0
          ? Number(settingTheFormData?.category)
          : null,
      areaKey:
        Number(settingTheFormData?.areaKey) != 0
          ? Number(settingTheFormData?.areaKey)
          : null,
      departmentName:
        Number(settingTheFormData?.departmentName) != 0
          ? Number(settingTheFormData?.departmentName)
          : null,
      eventTypeId:
        Number(settingTheFormData?.eventTypeId) != 0
          ? Number(settingTheFormData?.eventTypeId)
          : null,
      pincode: settingTheFormData?.pincode
        ? Number(settingTheFormData?.pincode)
        : null,
      pincodeMr: settingTheFormData?.pincodeMr
        ? Number(settingTheFormData?.pincodeMr)
        : null,
      mobileNumber: settingTheFormData?.mobileNumber
        ? Number(settingTheFormData?.mobileNumber)
        : null,
      villageKey:
        Number(settingTheFormData?.villageKey) != 0
          ? Number(settingTheFormData?.villageKey)
          : null,
      wardKey:
        Number(settingTheFormData?.wardKey) != 0
          ? Number(settingTheFormData?.wardKey)
          : null,
      zoneKey:
        Number(settingTheFormData?.zoneKey) != 0
          ? Number(settingTheFormData?.zoneKey)
          : null,
      officeLocation:
        Number(settingTheFormData?.officeLocation) != 0
          ? Number(settingTheFormData?.officeLocation)
          : null,
      createdBy: handelParams(logedInUser),
      trnAttacheDocumentDtos: watch("documentUploadTable"),
      uploadedDocumentAll: null,
      documentUploadTable: null,
      documentUploadTableActiveFlagY: null,
    };

    if (settingTheFormData != null) {
      setIsLoading(true);
      callingAxiosReq(bodyToSend)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            setValue("loadderState", false);
            setIsLoading(false);
            sweetAlert({
              title: language == "en" ? "Saved!" : "जतन केले!",
              text:
                language == "en"
                  ? "Grievance Saved Successfully !"
                  : "तक्रार यशस्वीरित्या जतन केली!",
              icon: "success",
              dangerMode: false,
              button: language === "en" ? "Ok" : "ठीक आहे",
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                sweetAlert({
                  title: language == "en" ? "Submitted!" : "अर्ज दाखल केला",
                  text:
                    language == "en"
                      ? ` Your Complaint Number is  ${
                          res?.data?.applicationNo !== undefined
                            ? res?.data?.applicationNo
                            : "Your Grievance Complaint Number Is Not Genrated!"
                        }`
                      : ` तुमचा तक्रार क्रमांक आहे  ${
                          res?.data?.applicationNo !== undefined
                            ? res?.data?.applicationNo
                            : "तुमचा तक्रार क्रमांक जनरेट झालेला नाही!"
                        }`,
                  icon: "success",
                  buttons: [
                    language == "en" ? "View Acknowledgement" : "पावती पहा",
                    language == "en" ? "Go To Dashboard" : "डॅशबोर्डवर जा",
                  ],
                  dangerMode: false,
                  closeOnClickOutside: false,
                }).then((will) => {
                  if (will) {
                    provideThePath(logedInUser);
                    setSettingTheFormData(null);
                  } else {
                    router.push({
                      pathname:
                        "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                      query: { id: res?.data?.applicationNo },
                    });
                    setSettingTheFormData(null);
                  }
                });
              }
            });
          } else {
            setValue("documentUploadTable", uploadedDocumentAll);
            setValue("documentUploadTable", documentUploadTable);
            setValue(
              "documentUploadTableActiveFlagY",
              documentUploadTableActiveFlagY.map((temp) => {
                if (temp.transactionType === "ROC") {
                  return { ...temp, transactionType: "Reopen" };
                } else if (temp.transactionType === "RC") {
                  return { ...temp, transactionType: "Register" };
                } else {
                  return { ...temp, transactionType: "" };
                }
              })
            );
            setValue("loadderState", false);
            language == "en"
              ? sweetAlert("Something Went Wrong!", { button: ["Ok"] })
              : sweetAlert("काहीतरी चूक झाली!", { button: ["ठीक आहे"] });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setValue("documentUploadTable", uploadedDocumentAll);
          setValue("documentUploadTable", documentUploadTable);
          setValue(
            "documentUploadTableActiveFlagY",
            documentUploadTableActiveFlagY.map((temp) => {
              if (temp.transactionType === "ROC") {
                return { ...temp, transactionType: "Reopen" };
              } else if (temp.transactionType === "RC") {
                return { ...temp, transactionType: "Register" };
              } else {
                return { ...temp, transactionType: "" };
              }
            })
          );
          setValue("loadderState", false);
          cfcErrorCatchMethod(err,false);
        });
    } else {
      setValue("documentUploadTable", uploadedDocumentAll);
      setValue("documentUploadTable", documentUploadTable);
      setValue(
        "documentUploadTableActiveFlagY",
        documentUploadTableActiveFlagY.map((temp) => {
          if (temp.transactionType === "ROC") {
            return { ...temp, transactionType: "Reopen" };
          } else if (temp.transactionType === "RC") {
            return { ...temp, transactionType: "Register" };
          } else {
            return { ...temp, transactionType: "" };
          }
        })
      );
      setValue("loadderState", false);
      sweetAlert("Setting The FormData Is Null", {
        button: [language === "en" ? "Ok" : "ठीक आहे"],
      });
    }
  };

  // callingAxiosReq
  let callingAxiosReq = (bodyToSend) => {
    if (logedInUser === "citizenUser") {
      return axios.post(`${urls.GM}/trnRegisterComplaint/save`, bodyToSend, {
        headers: headers,
      });
    } else {
      return axios.post(`${urls.GM}/trnRegisterComplaint/save`, bodyToSend, {
        headers: headers ,
      });
    }
  };

  // provideThepath
  let provideThePath = (logedInUser) => {
    switch (logedInUser) {
      case "departmentUser":
        router.push({
          pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
        });
        break;
      case "citizenUser":
        router.push({
          pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
        });
        break;
      case "cfcUser":
        router.push({
          pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
        });
        break;
      default:
        sweetAlert(
          language === "en" ? "Not The Valid User" : "वैध वापरकर्ता नाही",
          { button: [language === "en" ? "Ok" : "ठीक आहे"] }
        );
    }
  };

  // Handle Back
  const handleBack = () => {
    if (activeStep === 0) {
      if (logedInUser === "citizenUser") {
        router.push("/dashboard");
      } else {
        router.push("/DepartmentDashboard");
      }
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  useEffect(() => {
    if (activeStep == "0") {
      setDataValidation(basicInformation);
    } else if (activeStep == "1") {
      setDataValidation(userGrievanceDetails());
    }
  }, [activeStep]);

  // formPreviewDailog
  useEffect(() => {
    if (formPreviewDailog == true) {
      setValue("documentUploadButtonSachinInputState", false);
      setValue("documentUploadSachinDeleteButtonInputState", false);
      setValue("disabledInputState", false);
    } else {
      setValue("documentUploadButtonSachinInputState", true);
      setValue("documentUploadSachinDeleteButtonInputState", true);
      setValue("disabledInputState", true);
    }
  }, [formPreviewDailog]);

  // View
  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>

      {isLoading && <CommonLoader />}
      <Paper style={{ margin: "30px" }}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
          style={{ paddingTop: "15px" }}
        >
          {steps.map((step, index) => {
            const labelProps = {};
            const stepProps = {};
            return (
              <Step {...stepProps} key={index}>
                <StepLabel {...labelProps} StepIconComponent={ColorlibStepIcon}>
                  {step}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <Typography variant="h3" align="center">
            {language === "en" ? " Thank You" : "धन्यवाद"}
          </Typography>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              <div
                style={{
                  marginTop: 10,
                  paddingBottom: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 90,
                }}
              >
                <Button onClick={handleBack} color="error" size="small">
                  {language === "en" ? "BACK" : "मागे"}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={isLoading}
                  type="submit"
                  size="small"
                >
                  {activeStep === steps.length - 1
                    ? `${language === "en" ? "SAVE" : "जतन करा"}`
                    : `${language === "en" ? "NEXT" : "पुढे"}`}
                </Button>
              </div>

              {/** Dailog */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={formPreviewDailog}
                onClose={formPreviewDailogClose}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      <FormattedLabel id="Previews" />
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
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            formPreviewDailogClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <>
                    <Form />
                    <GrievanceDetails />
                  </>
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
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => {
                        swal({
                          title:
                            language == "en"
                              ? "Raise Grievance"
                              : "तक्रार करा ",
                          text:
                            language == "en"
                              ? "Are you sure you want to raise this grievance?"
                              : "तुमची खात्री आहे की तुम्ही ही तक्रार करू इच्छिता?",
                          icon: "warning",
                          buttons: {
                            cancel: language == "en" ? "Cancel" : "रद्द करा",
                            confirm: language == "en" ? "Ok" : "ठीक आहे",
                          },
                          dangerMode: true,
                          closeOnClickOutside: true,
                        }).then((will) => {
                          if (will) {
                            formPreviewDailogClose();
                            setterFun();
                          } else {
                            setSettingTheFormData(null);
                          }
                        });
                      }}
                    >
                      {language === "en" ? "SAVE" : "जतन करा"}
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>
            </form>
          </FormProvider>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
