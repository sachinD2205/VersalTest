import {
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  ThemeProvider,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import theme from "../../../../theme.js";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { addIsssuanceofLicenseSlice } from "../../redux/features/isssuanceofLicenseSlice";
import ApplicantDetails from "../components/ApplicantDetails";
import AddressOfLicense from "../components/AddressOfLicense";
// import IssuanceOfLicense from "../components/IssuanceOfLicense";
import ReIssuanceOfLicense from "../components/ReIssuanceOfLicense";

import PartenershipDetail from "../components/PartenershipDetail";
import IndustryAndEmployeeDetaills from "../components/IndustryAndEmployeeDetaills";
import BusinessOrIndustryInfo from "../components/BusinessOrIndustryInfo";
import AadharAuthentication from "../components/AadharAuthentication";

// import "./styles.css";
import ReactDOM from "react-dom";

// Get steps - Name
function getSteps() {
  return [
    <FormattedLabel key={1} id="issuanceofLicense" />,
    <FormattedLabel key={2} id="applicantDetails" />,
    <FormattedLabel key={3} id="aadharAuthentication" />,
    <FormattedLabel key={4} id="addressOfLicense" />,
    <FormattedLabel key={5} id="businessInfo" />,
    <FormattedLabel key={6} id="employeeDetaills" />,
    <FormattedLabel key={7} id="partenershipDetail" />,
    // <FormattedLabel id='documentUpload' />,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong>Applicant Details</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> Aadhar Authentication</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong>Address Of License</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong>Business Info </strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> Business And Employee Detaills</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> Partenership Detail</strong>
    // </Typography>,
  ];
}

// Get steps - Name
// function getSteps() {
//   return [
//     // "Issuance of  License",
//     "Applicant Details",
//     "Address Of License",
//     "Business Info",
//     "Business And Employee Detaills",
//     "PartenershipDetail"
//   ];
// }

// Get Step Content Form
function getStepContent(step) {
  switch (step) {
    case 0:
      return <ReIssuanceOfLicense />;

    case 1:
      return <ApplicantDetails />;

    case 2:
      return <AadharAuthentication />;

    case 3:
      return <AddressOfLicense />;

    case 4:
      return <BusinessOrIndustryInfo />;

    case 5:
      return <IndustryAndEmployeeDetaills />;

    case 6:
      return <PartenershipDetail />;

    //   case 5:
    //     return<SkySignRate />

    default:
      return "unknown step";
  }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <partenershipDetailView />
//       </header>
//     </div>
//   );
// }

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

// Linear Stepper
const LinaerStepper = () => {
  const methods = useForm({
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
      dateOfBirth: null,
      age: "",
      disbality: "",
      typeOfDisability: "",
      mobile: "",
      emailAddress: "",
      crWaterConsumerNo: "",
      crPropertyTaxNumber: "",
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

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();

  // Handle Next
  const handleNext = (data) => {
    dispach(addIsssuanceofLicenseSlice(data));
    console.log(data);
    if (activeStep == steps.length - 1) {
      fetch("https://jsonplaceholder.typicode.com/comments")
        .then((data) => data.json())
        .then((res) => {
          console.log(res);
          setActiveStep(activeStep + 1);
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
      {/* <BasicLayout> */}
      <ThemeProvider theme={theme}>
        <Paper
          component={Box}
          sx={{
            marginLeft: '10px',
            marginRight: '10px',
            padding: 1,
          }}
          square

        // sx={{
        //   margin: 5,
        //   padding: 1,
        //   paddingTop: 5,
        //   paddingBottom: 5,
        // }}
        >
          <Stepper alternativeLabel activeStep={activeStep}>
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
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(handleNext)}
                sx={{ marginTop: 10 }}
              >
                {getStepContent(activeStep)}

                <Button disabled={activeStep === 0} onClick={handleBack}>
                  back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={handleNext}
                  type="submit"
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </form>
            </FormProvider>
          )}
        </Paper>
      </ThemeProvider>
      {/* </BasicLayout> */}
    </>
  );
};

export default LinaerStepper;
