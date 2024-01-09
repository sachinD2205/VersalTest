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
import React, { useEffect, useState } from "react";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import DocumentsUpload from ".../../../../components/fireBrigadeSystem/revisedBuildingNoc/DocumentsUpload";
import axios from "axios";
import urls from "../../../../URLS/urls";
// import schema from "./Schema";

import { useRouter } from "next/router";

//.....
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Check from "@mui/icons-material/Check";
import HomeIcon from "@mui/icons-material/Home";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import ApplicantDetails from "../../../../components/fireBrigadeSystem/revisedBuildingNoc/ApplicantDetails";
import BuildingUse from "../../../../components/fireBrigadeSystem/revisedBuildingNoc/BuildingUse";
import FormsDetails from "../../../../components/fireBrigadeSystem/revisedBuildingNoc/FormsDetails";
import OtherDetails from "../../../../components/fireBrigadeSystem/revisedBuildingNoc/OtherDetails";

import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ApplicantSchema from "../../../../components/fireBrigadeSystem/revisedBuildingNoc/ApplicantSchema";
import BuildingUseSchema from "../../../../components/fireBrigadeSystem/revisedBuildingNoc/BuildingUseSchema";
import FormSchema from "../../../../components/fireBrigadeSystem/revisedBuildingNoc/FormSchema";
import OtherSchema from "../../../../components/fireBrigadeSystem/revisedBuildingNoc/OtherSchema";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

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
    // 1: <SettingsIcon />,
    1: <PermIdentityIcon />,
    2: <BrandingWatermarkIcon />,
    // 3: <VideoLabelIcon />,
    3: <HomeIcon />,
    4: <UploadFileIcon />,
    // 5: <AddCircleIcon />,
    // 6: <UploadFileIcon />,
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

const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];

function getSteps() {
  return [
    // "",
    "Applicant Details",
    "Forms Details",
    "Purpose Of Building Use",
    "Documents Upload",
  ];
}

// Get Step Content Form
// function getStepContent(step) {
//   switch (step) {
//     case 0:
//       return <BasicApplicationDetails />;

//     case 1:
//       return <HawkerDetails />;

//     case 2:
//       return <AddressOfHawker />;

//     case 3:
//       return <AadharAuthentication />;

//     case 4:
//       return <AdditionalDetails />;

//     case 5:
//       return <DocumentsUpload />;

//     default:
//       return "unknown step";
//   }
// }
// Get Step Content Form

var schemaStepper;
function getStepContent(step) {
  switch (step) {
    // case 0:
    // return <IssuanceOfHawkerLicense />;

    case 0:
      schemaStepper = ApplicantSchema;
      return <ApplicantDetails />;

    case 1:
      schemaStepper = FormSchema;
      return <FormsDetails />;

    case 2:
      schemaStepper = BuildingUseSchema;
      return <BuildingUse />;

    case 3:
      schemaStepper = OtherSchema;
      return <OtherDetails />;

    default:
      return "unknown step";
  }
}

// Linear Stepper
const Form = () => {
  const router = useRouter();
  const userToken = useGetToken();

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schemaStepper),
    mode: "onChange",
    // defaultValues: {
    //   serviceName: "",
    //   applicationNumber: "HMS089734584837",
    //   applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
    //   trackingID: "46454565454445",
    //   citySurveyNo: "",
    //   hawkingZoneName: "",
    //   title: "",
    //   firstName: "",
    //   middleName: "",
    //   lastName: "",
    //   gender: "",
    //   religion: "",
    //   cast: "",
    //   subCast: "",
    //   dateOfBirth: null,
    //   age: "",
    //   disbality: "",
    //   typeOfDisability: "",
    //   mobile: "",
    //   emailAddress: "",
    //   crCitySurveyNumber: "",
    //   crAreaName: "",
    //   crLandmarkName: "",
    //   crVillageName: "",
    //   crCityName: "Pimpri-Chinchwad",
    //   crState: "Maharashtra",
    //   crPincode: "",
    //   crLattitude: "",
    //   addressCheckBox: "",
    //   prCitySurveyNumber: "",
    //   prAreaName: "",
    //   prLandmarkName: "",
    //   prVillageName: "",
    //   prCityName: "Pimpri-Chinchwad",
    //   prState: "Maharashtra",
    //   prPincode: "",
    //   prLattitude: "",
    //   wardNo: "",
    //   wardName: "",
    //   natureOfBusiness: "",
    //   hawkingDurationDaily: "",
    //   hawkerType: "",
    //   item: "",
    //   periodOfResidenceInMaharashtra: null,
    //   periodOfResidenceInPCMC: null,
    //   rationCardNo: "",
    //   bankMaster: "",
    //   branchName: "",
    //   bankAccountNo: "",
    //   ifscCode: "",
    // },
  });

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();

  // Handle Next
  // const handleNext = (data) => {
  //   console.log("Form  Submit Data --->", JSON.stringify(data));
  //   dispach(addIsssuanceofHawkerLicense(data));
  //   console.log(data);
  //   if (activeStep == steps.length - 1) {
  //     axios
  //       .post(
  //         `${urls.BaseURL}/IssuanceofHawkerLicense/saveIssuanceOfHawkerLicense`,
  //         data,
  //         {
  //           headers: {
  //             role: "CITIZEN",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           data.id
  //             ? sweetAlert(
  //                 "Updated!",
  //                 "Record Updated successfully !",
  //                 "success"
  //               )
  //             : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           router.push(`/dashboard`);
  //         }
  //       });
  //   } else {
  //     setActiveStep(activeStep + 1);
  //   }
  // };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      methods.reset(router.query);
    }
  }, [router.query.pageMode]);

  const handleNext = (data) => {
    console.log("All Data --------", data);
    // console.log("gAgeProofDocumentPhoto --------", data.gAgeProofDocumentPhoto);
    // console.log("gResidentDocumentPhoto --------", data.gResidentDocumentPhoto);
    // console.log("bAgeProofDocumentPhoto --------", data.gResidentDocumentPhoto);
    // let files = ({ gAgeProofDocumentPhoto } = data);
    // dispach(addNewMarriageRegistraction(data));

    if (router.query.pageMode == "Edit") {
      if (activeStep == steps.length - 1) {
        axios
          .post(
            `${urls.BaseURL}/transaction/provisionalBuildingFireNOC/save`,
            data,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              swal("Updated!", "Record Saved successfully !", "success");
              router.back();
            }
          });
      } else {
        setActiveStep(activeStep + 1);
      }
    } else {
      if (activeStep == steps.length - 1) {
        console.log(`data --------->s ${data}`);
        axios
          .post(
            `${urls.BaseURL}/transaction/provisionalBuildingFireNOC/save`,
            data,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              swal("Submited!", "Record Submited successfully !", "success");
            }
            router.push(`/FireBrigadeSystem/transactions/revisedBuildingNoc`);
          });
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // View
  return (
    // <>
    //   <Box sx={{ flexGrow: 1 }}>
    //     <AppBar position="static">
    //       <Toolbar variant="dense">
    //         <IconButton
    //           edge="start"
    //           color="inherit"
    //           aria-label="menu"
    //           sx={{ mr: 2 }}
    //         >
    //           <ArrowBackIcon
    //             onClick={() =>
    //               router.push({
    //                 pathname:
    //                   "/FireBrigadeSystem/transactions/revisedBuildingNoc",
    //               })
    //             }
    //           />
    //         </IconButton>
    //         <Typography variant="h6" color="inherit" component="div">
    //           {<FormattedLabel id="revisedBuildingNoc" />}
    //         </Typography>
    //       </Toolbar>
    //     </AppBar>
    //   </Box>
    //   <Paper
    //     sx={{
    //       marginTop: 2,
    //       // margin: 5,
    //       // padding: 1,
    //       marginLeft: 5,
    //       marginRight: 5,
    //       paddingTop: 5,
    //       paddingBottom: 2,
    //       backgroundColor: "#F5F5F5",
    //     }}
    //     elevation={5}
    //   >
    //     {/* <Stepper
    //           alternativeLabel
    //           activeStep={activeStep}
    //           style={{
    //             backgroundColor: "#F2F3F4",
    //             padding: 20,
    //             borderRadius: 10,
    //           }}
    //         >
    //           {steps.map((step, index) => {
    //             const labelProps = {};
    //             const stepProps = {};

    //             return (
    //               <Step {...stepProps} key={index}>
    //                 <StepLabel {...labelProps}>{step}</StepLabel>
    //               </Step>
    //             );
    //           })}
    //         </Stepper> */}
    //     <Stack sx={{ width: "100%" }} spacing={4}>
    //       {/* <Stepper
    //             alternativeLabel
    //             // activeStep={1}
    //             activeStep={activeStep}
    //             connector={<QontoConnector />}
    //           >
    //             {steps.map((label) => {
    //               const labelProps = {};
    //               const stepProps = {};

    //               return (
    //                 <Step key={label} {...stepProps}>
    //                   <StepLabel
    //                     {...labelProps}
    //                     StepIconComponent={QontoStepIcon}
    //                   >
    //                     {label}
    //                   </StepLabel>
    //                 </Step>
    //               );
    //             })}
    //           </Stepper> */}
    //       <Stepper
    //         alternativeLabel
    //         // activeStep={1}
    //         activeStep={activeStep}
    //         connector={<ColorlibConnector />}
    //       >
    //         {steps.map((label) => {
    //           const labelProps = {};
    //           const stepProps = {};

    //           return (
    //             <Step key={label} {...stepProps}>
    //               <StepLabel
    //                 {...labelProps}
    //                 StepIconComponent={ColorlibStepIcon}
    //               >
    //                 {label}
    //               </StepLabel>
    //             </Step>
    //           );
    //         })}
    //       </Stepper>
    //     </Stack>
    //     <br />
    //     {activeStep === steps.length ? (
    //       <Typography variant="h3" align="center">
    //         Thank You
    //       </Typography>
    //     ) : (
    //       <FormProvider {...methods}>
    //         <form
    //           onSubmit={methods.handleSubmit(handleNext)}
    //           sx={{ marginTop: 10 }}
    //         >
    //           {getStepContent(activeStep)}
    //           <div
    //             style={{
    //               display: "flex",
    //               justifyContent: "flex-end",
    //               paddingRight: 12,
    //             }}
    //           >
    //             <Button disabled={activeStep === 0} onClick={handleBack}>
    //               back
    //             </Button>
    //             <Button
    //               variant="contained"
    //               color="primary"
    //               // onClick={handleNext}
    //               type="submit"
    //             >
    //               {activeStep === steps.length - 1 ? "Submit" : "Next"}
    //               {/* {activeStep === steps.length - 1 ? (
    //                   "Submit"
    //                 ) : (
    //                   <FormattedLabel id="next" />
    //                 )} */}
    //             </Button>
    //           </div>
    //         </form>
    //       </FormProvider>
    //     )}
    //   </Paper>
    // </>
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
                      pathname:
                        "/FireBrigadeSystem/transactions/revisedBuildingNoc",
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
                {<FormattedLabel id="revisedBuildingFireNOC" />}
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
                  <Button variant="contained" color="primary" type="submit">
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
