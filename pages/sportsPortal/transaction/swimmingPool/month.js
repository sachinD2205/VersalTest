import {
  Button,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { FormProvider, useForm } from "react-hook-form";
import BookingDetail from "../components/BookingDetail";
import { useDispatch } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import { addIsssuanceofHawkerLicense } from "../../../redux/features/isssuanceofHawkerLicenseSlice";
// import AdditionalDetails from "../components/AdditionalDetails";
// import AddressOfHawker from "../components/AddressOfHawker";
import DocumentUpload from "../components/DocumentUpload";
import theme from "../../../../theme.js";
import URLS from "../../../../URLS/urls";

import SwimmingPoolF from "../components/SwimmingPoolF";
// import AadharAuthentication from "../components/AadharAuthentication";
import axios from "axios";
import BookingDetailsSwimming from "../components/BookingDetailsSwimming";
import sweetAlert from "sweetalert";
import EcsDetails from "../components/EcsDetails";
import moment from "moment";
// import schema from "./Schema";
import { useRouter } from "next/router";
import { Details } from "@mui/icons-material";

//.....
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HomeIcon from "@mui/icons-material/Home";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import PersonalDetails from "../components/PersonalDetails";
import AadharAuthentication from "../components/AadharAuthentication";
import SwimmingM from "../components/SwimmingM";

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
    borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
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
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
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
    2: <BabyChangingStationIcon />,
    // 3: <VideoLabelIcon />,
    3: <HomeIcon />,
    4: <BrandingWatermarkIcon />,
    5: <AddCircleIcon />,
    6: <UploadFileIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
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
    <strong key={1}>Booking Details</strong>,

    <strong key={2}>Personal Details</strong>,

    // <strong>Swimming</strong>,

    <strong key={3}>Aadhar AuthenticationDetails</strong>,

    <strong key={4}>ECS Details</strong>,

    <strong key={5}> Upload Documents</strong>,
  ];
}

function GetStepContent(step) {
  // const [bookingTypeR, setBookingTypeR] = useState(null);
  switch (step) {
    case 0:
      return <BookingDetailsSwimming />;
    case 1:
      return <PersonalDetails />;

    // case 2:
    //   return <SwimmingM />;

    case 2:
      return <AadharAuthentication />;

    case 3:
      return <EcsDetails />;
    case 4:
      return <DocumentUpload />;

    default:
      return "unknown step";
  }
}

// Linear Stepper
const LinaerStepper = () => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      // period: "",
      // slots: "",
      // facilityName: "",
      // facilityType: "",
      // zone: "",
      // bookingType: "",
      // title: "",
      // firstName: "",
      // middleName: "",
      // lastName: "",
      // gender: "",
      // age: "",
      // mobileNo: "",
      // aadharCardNo: "",
      // emailAddress: "",
      // cAddress: "",
      // cCityName: "",
      // cState: "",
      // cPincode: "",
      // cLattitude: "",
      // cLongitude: "",
      // pAddress: "",
      // pCityName: "",
      // pState: "",
      // pPincode: "",
      // pLattitude: "",
      // pLongitude: "",
      // aadharCardNo: "",
      // bankName: "",
      // branchName: "",
      // bankAccountHolderName: "",
      // bankAccountNo: "",
      // ifscCode: "",
      // bankAddress: "",
      // applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      // applicationNumber: "HMS089734584837",
      // trackingID: "46454565454445",
      // prState: "Maharashtra",
      // prCityName: "Pimpri-Chinchwad",
      // crState: "Maharashtra",
      // crCityName: "Pimpri-Chinchwad",
    },
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(schema),
  });

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();

  // Handle Next
  const handleNext = (data) => {
    console.log("Form  Submit Data --->", JSON.stringify(data));
    console.log(data);
    if (activeStep == steps.length - 1) {
      axios
        .post(`${URLS.SPURL}/swimmingBooking/save`, data, {
          headers: {
            role: "CITIZEN",
          },
        })
        .then((res) => {
          if (res.status == 200) {
            data.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            router.push(`/dashboard`);
          }
        });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // View
  return (
    <>
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
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
              {steps.map((label) => {
                const labelProps = {};
                const stepProps = {};

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps} StepIconComponent={ColorlibStepIcon}>
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
              <form onSubmit={methods.handleSubmit(handleNext)} sx={{ marginTop: 10 }}>
                {GetStepContent(activeStep)}
                <Stack direction="row" spacing={2} style={{ marginLeft: 1000 }}>
                  <Button
                    disabled={activeStep === 0}
                    // disabled
                    onClick={handleBack}
                    variant="contained"
                  >
                    back
                  </Button>
                  <Button
                    variant="contained"
                    // disabled={activeStep === steps.length - 1}
                    // color="primary"
                    // onClick={handleNext}
                    type="submit"
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                </Stack>
              </form>
            </FormProvider>
          )}
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default LinaerStepper;

// import {
//   Box,
//   Button,
//   Container,
//   Paper,
//   Step,
//   StepLabel,
//   Stepper,
//   ThemeProvider,
//   Typography,
// } from "@mui/material";
// import React, { useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import { addIsssuanceofHawkerLicense } from "../../../redux/features/isssuanceofHawkerLicenseSlice";
// import EcsDetails from "../components/EcsDetails";
// import PersonalDetails from "../components/PersonalDetails";
// import BookingDetails from "../components/BookingDetails";
// import DocumentsUpload from "../components/DocumentsUpload";
// import theme from "../../../../theme";
// import AadharAuthentication from "../components/AadharAuthentication";
// import urls from "../../../../URLS/urls";
// import axios from "axios";
// import sweetAlert from "sweetalert";
// import moment from "moment";
// import GroupDetails from "../components/GroupDetails";

// // Get steps - Name
// function getSteps() {
//   return [
//     <Typography variant="subtitle2" sx={{ marginTop: 2 }}>
//       Booking Details
//     </Typography>,
//     <Typography variant="subtitle2" sx={{ marginTop: 2 }}>
//       Personal Details
//     </Typography>,
//     <Typography variant="subtitle2" sx={{ marginTop: 2 }}>
//       Aadhar Authentication
//     </Typography>,
//     <Typography variant="subtitle2" sx={{ marginTop: 2 }}>
//       ECS Details
//     </Typography>,
//     <Typography variant="subtitle2" sx={{ marginTop: 2 }}>
//       Documents Upload
//     </Typography>,
//   ];
// }

// // Get Step Content Form
// function GetStepContent(step) {
//   const [bookingTypeR, setBookingTypeR] = useState(null);
//   switch (step) {
//     case 0:
//       return <BookingDetails bookingType={setBookingTypeR} />;

//     case 1:
//       if (bookingTypeR && bookingTypeR === "Individual") {
//         return <PersonalDetails />;
//       } else {
//         return <GroupDetails />;
//       }
//     case 2:
//       return <AadharAuthentication />;

//     case 3:
//       return <EcsDetails />;

//     case 4:
//       return <DocumentsUpload />;

//     default:
//       return "unknown step";
//   }
// }

// // Linear Stepper
// const LinaerStepper = () => {
//   const methods = useForm({
//     defaultValues: {
//       bookingRegistrationId: "SP202200001",
//       bookingType: "",
//       applicationDate: "",
//       wardName: "",
//       zone: "",
//       department: "",
//       subDepartment: "",
//       facilityType: "",
//       facilityName: "",
//       venue: "",
//       totalGroupMember: "",
//       groupDetails: "",

//       title: "",
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       gender: "",
//       age: "",
//       applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
//       prCityName: "Pimpri-Chinchwad",
//       prState: "Maharashtra",
//       mobile: "",
//       emailAddress: "",
//       prPincode: "",
//       prState: "",
//       prCityName: "",
//       permanentAddress: "",
//       crPincode: "",
//       crState: "",
//       crCityName: "",
//       currentAddress: "",

//       bankMaster: "",
//       branchName: "",
//       bankAccountNo: "",
//       ifscCode: "",
//       dateOfBirth: null,

//       // applicationNumber: "HMS089734584837",

//       crCityName: "Pimpri-Chinchwad",
//       crState: "Maharashtra",
//       crPincode: "",

//       addressCheckBox: "",

//       prAreaName: "",

//       prPincode: "",
//       wardName: "",
//     },
//   });

//   // Const
//   const [activeStep, setActiveStep] = useState(0);
//   const steps = getSteps();
//   const dispach = useDispatch();

//   // Handle Next
//   const handleNext = (data) => {
//     console.log("Form  Submit Data --->", JSON.stringify(data));
//     dispach(addIsssuanceofHawkerLicense(data));
//     console.log(data);
//     if (activeStep == steps.length - 1) {
//       axios
//         .post(
//           `${urls.BaseURL}/IssuanceofHawkerLicense/saveIssuanceOfHawkerLicense`,
//           data,
//           {
//             headers: {
//               role: "CITIZEN",
//             },
//           }
//         )
//         .then((res) => {
//           if (res.data == 200) {
//             console.log("Sweet");
//             data.id
//               ? sweetAlert(
//                   "Updated!",
//                   "Record Updated successfully !",
//                   "success"
//                 )
//               : sweetAlert("Saved!", "Record Saved successfully !", "success");
//           }
//         });
//     } else {
//       setActiveStep(activeStep + 1);
//     }
//   };

//   // Handle Back
//   const handleBack = () => {
//     setActiveStep(activeStep - 1);
//   };

//   // View
//   return (
//     <>
//       <BasicLayout>
//         <ThemeProvider theme={theme}>
//           <Paper
//             component={Box}
//             sx={{ p: 3 }}
//             square

//             // sx={{
//             //   margin: 5,
//             //   padding: 1,
//             //   paddingTop: 5,
//             //   paddingBottom: 5,
//             // }}
//           >
//             <Stepper alternativeLabel activeStep={activeStep}>
//               {steps.map((step, index) => {
//                 const labelProps = {};
//                 const stepProps = {};

//                 return (
//                   <Step {...stepProps} key={index}>
//                     <StepLabel {...labelProps}>{step}</StepLabel>
//                   </Step>
//                 );
//               })}
//             </Stepper>

//             {activeStep === steps.length ? (
//               <Typography variant="h3" align="center">
//                 Thank You
//               </Typography>
//             ) : (
//               <FormProvider {...methods}>
//                 <form
//                   onSubmit={methods.handleSubmit(handleNext)}
//                   sx={{ marginTop: 10 }}
//                 >
//                   {GetStepContent(activeStep)}

//                   <Button disabled={activeStep === 0} onClick={handleBack}>
//                     back
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     // onClick={handleNext}
//                     type="submit"
//                   >
//                     {activeStep === steps.length - 1 ? "Finish" : "Next"}
//                   </Button>
//                 </form>
//               </FormProvider>
//             )}
//           </Paper>
//         </ThemeProvider>
//       </BasicLayout>
//     </>
//   );
// };

// export default LinaerStepper;
