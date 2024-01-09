import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import HomeIcon from "@mui/icons-material/Home";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
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
import { useDispatch } from "react-redux";
import sweetAlert from "sweetalert";
import AdditionalDetails from "../../../../components/fireBrigadeSystem/finalAhawal/AdditionalDetails";
import AddressOfFire from "../../../../components/fireBrigadeSystem/finalAhawal/AddressOfFire";
import FireDetails from "../../../../components/fireBrigadeSystem/finalAhawal/FireDetails";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/fireBrigadeSystem/finalAhawalTransaction";
import urls from "../../../../URLS/urls";
import {
  applicantDTLDaoSchema,
  formDTLDaoSchema,
  otherDetailSchema,
} from "../../../../containers/schema/fireBrigadeSystem/finalAhawalTransaction";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// Design Stepper
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
      {/* {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )} */}
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
    2: <HomeIcon />,
    3: <BrandingWatermarkIcon />,
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
function getSteps() {
  return [
    <FormattedLabel key={1} id="applicantDetails" />,
    <FormattedLabel key={1} id="fireDetails" />,
    <FormattedLabel key={1} id="financialLossDetails" />,
  ];
}
// end stepper

// Linear Stepper
const Form = (props) => {
  const { applicationDataId, pageMode } = props;
  const userToken = useGetToken();

  // Get Step Content Form
  function getStepContent(step) {
    switch (step) {
      case 0:
        return <FireDetails props={props} />;

      case 1:
        return <AddressOfFire props={props} />;

      case 2:
        return <AdditionalDetails props={props} />;

      default:
        return "unknown step";
    }
  }

  const [dataValidation, setDataValidation] = useState(formDTLDaoSchema);

  useEffect(() => {
    console.log("acitiveStep", activeStep);
    // if (activeStep == "0") {
    //   setDataValidation(formDTLDaoSchema);
    // }
    if (activeStep == "1") {
      setDataValidation(applicantDTLDaoSchema);
    } else if (activeStep == "2") {
      setDataValidation(otherDetailSchema);
    }
    //  else if (activeStep == "2") {
    //   setDataValidation(FormDTLDaoSchema);
    // } else if (activeStep == "3") {
    //   setDataValidation(BuildingUseSchema);
    // } else if (activeStep == "4") {
    // }
  }, [activeStep]);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),

    mode: "onChange",
    defaultValues: {
      serviceName: "",
      applicationNumber: "",
      applicationDate: null,
      trackingID: "",
      citySurveyNo: "",
      hawkingZoneName: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      religion: "",
      cast: "",
      subCast: "",
      dateOfBirth: "",
      age: "",
      disbality: "",
      typeOfDisability: "",
      mobile: "",
      emailAddress: "",
      crCitySurveyNumber: "",
      crAreaName: "",
      crLandmarkName: "",
      crVillageName: "",
      crCityName: "",
      crState: "",
      crPincode: "",
      crLattitude: "",
      addressCheckBox: "",
      prCitySurveyNumber: "",
      prAreaName: "",
      prLandmarkName: "",
      prVillageName: "",
      prCityName: "",
      prState: "",
      prPincode: "",
      prLattitude: "",
      wardNo: "",
      wardName: "",
      natureOfBusiness: "",
      hawkingDurationDaily: "",
      hawkerType: "",
      item: "",
      periodOfResidenceInMaharashtra: null,
      periodOfResidenceInPCMC: null,
      rationCardNo: "",
      bankMaster: "",
      branchName: "",
      bankAccountNo: "",
      ifscCode: "",
    },
  });

  useEffect(() => {
    console.log("acitiveStep", activeStep);
  }, [activeStep]);

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();

  const router = useRouter();

  // useEffect(() => {
  //   if (router.query.pageMode == "Edit") {
  //     methods.reset(router.query);
  //     console.log("hello2", router.query);
  //   }
  // }, []);

  useEffect(() => {
    getPinCode();
  }, []);

  // useEffect(() => {
  //   console.log("props", props?.props);
  //   if (props?.props) {
  //     methods.reset(props?.props);
  //   }
  // }, []);

  const [crPincodes, setCrPinCodes] = useState();

  // fetch pin code from cfc
  const getPinCode = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("pin", res?.data?.pinCode);
        setCrPinCodes(res?.data?.pinCode);
      })
      .catch((err) => console.log(err));
  };

  // Handle Next
  const handleNext = (fromData) => {
    console.log("activeStep", activeStep);
    console.log("All Data --------", fromData);
    const finalBody = {
      // for validation
      // applicantDTLDao:
      //   watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
      // // ownerDTLDao
      // ownerDTLDao:
      //   watch("ownerDTLDao") == undefined ? [] : [...watch("ownerDTLDao")],

      dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
        "YYYY-MM-DDThh:mm:ss"
      ),

      id: router?.query?.id ? router.query.id : null,
      // id: fromData.id,
      role: "VERIFICATION",
      desg: "CHEIF_FIRE_OFFICER",
      finalAhawal: {
        // ...fromData,
        ...fromData.finalAhawal,
        id: router?.query?.finalAhawalId ? router.query.finalAhawalId : null,
        // id: fromData?.finalAhawalId,
        // id: router?.query?.id ? router.query.id : null,

        // departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
        // totalTimeConsumedAtLocationInHrsAndMinutes: moment(
        //   fromData.totalTimeConsumedAtLocationInHrsAndMinutes,
        //   "HH:mm"
        // ).format("HH:mm"),
      },
    };
    console.log("All finalBody --------", finalBody);
    // dispach(addfinalVardi(data));
    if (activeStep == steps.length - 1) {
      console.log(`data --------->s ${finalBody}`);
      axios
        .post(
          `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          // if(res.status == 200){
          // localStorage.removeItem(key);
          // }
          fromData?.finalAhawalId
            ? sweetAlert(
                "Action Completed!",
                "Record Save successfully !",
                "success"
              )
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/FireBrigadeSystem/transactions/finalAhawal`);
        });
    } else {
      setActiveStep(activeStep + 1);
    }

    localStorage.removeItem("attachments");
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    console.log("applicationDataId", applicationDataId);
    if (applicationDataId) {
      axios
        .get(
          `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${applicationDataId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          // if (r.status == 200) {
          console.log("dattaaaa", res?.data?.firstAhawal);
          methods.reset(res?.data);

          // setValue(
          //   "finalAhawal.thirdCharge",
          //   res?.data?.finalAhawal?.thirdCharge
          // );

          setValue("typeOfVardiId", res?.data?.vardiSlip?.typeOfVardiId);

          setValue(
            "isLossInAmount",
            res?.data?.firstAhawal?.isLossInAmount &&
              res?.data?.firstAhawal?.isLossInAmount == true
              ? "Yes"
              : "No"
          );
          setLossAmount(
            res?.data?.firstAhawal?.isLossInAmount &&
              res?.data?.firstAhawal?.isLossInAmount == true
              ? "Yes"
              : "No"
          );
          setExternalService(
            res?.data?.firstAhawal?.isExternalServiceProvide &&
              res?.data?.firstAhawal?.isExternalServiceProvide == true
              ? "Yes"
              : "No"
          );
          setExternalPerson(
            res?.data?.firstAhawal?.isExternalPersonAddedInDuty &&
              res?.data?.firstAhawal?.isExternalPersonAddedInDuty == true
              ? "Yes"
              : "No"
          );
          setInsurrancePolicy(
            // res?.data?.firstAhawal?.insurancePolicyApplicable &&
            res?.data?.firstAhawal?.insurancePolicyApplicable == true
              ? "Yes"
              : "No"
          );
        })
        .catch((err) => {
          console.log("errApplication", err);
        });
    }
    console.log("00000", props?.props);
    if (
      router.query.pageMode === "Edit" ||
      router.query.pageMode === "View" ||
      router.query.pageMode === "Status"
    ) {
      console.log("000222222", router?.query?.finalAhawalId);
      if (router?.query?.id) {
        axios
          .get(
            `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            // if (r.status == 200) {
            console.log("dataaaaa876", res?.data?.firstAhawal);
            methods.reset(res?.data?.firstAhawal);

            // setValue(
            //   "finalAhawal.thirdCharge",
            //   res?.data?.finalAhawal?.thirdCharge
            // );

            setValue("typeOfVardiId", res?.data?.vardiSlip?.typeOfVardiId);

            setValue(
              "isLossInAmount",
              res?.data?.firstAhawal?.isLossInAmount &&
                res?.data?.firstAhawal?.isLossInAmount == true
                ? "Yes"
                : "No"
            );
            setLossAmount(
              res?.data?.firstAhawal?.isLossInAmount &&
                res?.data?.firstAhawal?.isLossInAmount == true
                ? "Yes"
                : "No"
            );
            setExternalService(
              res?.data?.firstAhawal?.isExternalServiceProvide &&
                res?.data?.firstAhawal?.isExternalServiceProvide == true
                ? "Yes"
                : "No"
            );
            setExternalPerson(
              res?.data?.firstAhawal?.isExternalPersonAddedInDuty &&
                res?.data?.firstAhawal?.isExternalPersonAddedInDuty == true
                ? "Yes"
                : "No"
            );
            setInsurrancePolicy(
              // res?.data?.firstAhawal?.insurancePolicyApplicable &&
              res?.data?.firstAhawal?.insurancePolicyApplicable == true
                ? "Yes"
                : "No"
            );
          })
          .catch((err) => {
            console.log("errApplication", err);
          });
      }
    }
  }, []);

  // View
  return (
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname: "/FireBrigadeSystem/transactions/finalAhawal",
                    })
                  }
                />
              </IconButton>
              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                {<FormattedLabel id="emergencyServicesFinalVardiAhawal" />}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          {/* <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {};
              const stepProps = {};

              return (
                <Step {...stepProps} key={index}>
                  <StepLabel {...labelProps}>{step}</StepLabel>
                </Step>
              );
            })}
          </Stepper> */}
          <Stack
            sx={{
              width: "100%",
              paddingBottom: "5%",
            }}
            spacing={4}
          >
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
              alternativeLabel
              // activeStep={1}
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
          {/* {activeStep === steps.length ? ( */}
          {activeStep === steps.length ? (
            <Typography variant="h3" align="center">
              <br />
              <br />
              Thank You
            </Typography>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(activeStep)}
                <div style={{ paddingLeft: "500px" }}>
                  {router.query.pageMode === "Status" &&
                    activeStep === steps.length - 1 && (
                      <Button
                        type="submit"
                        size="small"
                        variant="outlined"
                        // className={styles.button}
                        // endIcon={<SaveIcon />}
                      >
                        Approved
                      </Button>
                    )}
                </div>
                {console.log("99999", props?.pageMode)}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: 12,
                  }}
                >
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    back
                  </Button>
                  {console.log("909090activeStep", router.query.pageMode)}
                  <Button
                    disabled={
                      // activeStep === 2 ||
                      (router.query.pageMode === "Status" &&
                        activeStep === 2) ||
                      (props?.pageMode == "Edit" && activeStep === 2) ||
                      (props?.pageMode == "View" && activeStep === 2)
                    }
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    {activeStep === steps.length - 1 ? "Save" : "Next"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Form;
