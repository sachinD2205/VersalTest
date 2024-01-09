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

import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { addIsssuanceofLicenseSlice } from "../../redux/features/isssuanceofLicenseSlice";
import ApplicantDetails from "../components/ApplicantDetails";
import ApplicantDetailsNewForm from "../components/ApplicantDetailsNewForm";
import AddressOfLicense from "../components/AddressOfLicense";
import SkysignInfo from "../components/SkysignInfo.js";
import IssuanceOfLicense from "../components/IssuanceOfLicense";
import IndustryDocumentsUpload from "../components/IndustryDocumentsUpload";
import SkySignBusinessDetails from "../components/SkySignBusinessDetails";
import HoardingDetails from "../components/HoardingDetails";
import SkySignRate from "../components/SkySignRate";
import AadharAuthentication from "../components/AadharAuthentication";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// Get steps - Name
function getSteps() {
  return [
    // <FormattedLabel key={1} id="issuanceofLicense" />,
    <FormattedLabel key={1} id="applicantDetails" />,
    // <FormattedLabel key={1} id="aadharAuthentication" />,
    <FormattedLabel key={2} id="addressOfLicense" />,
    <FormattedLabel key={3} id="skysignInformation" />,
    <FormattedLabel key={4} id="documentUpload" />,

    // <FormattedLabel key={3} id="hoardingDetails" />,
    // <FormattedLabel key={4} id="skySignBusinessDetails" />,
    // <FormattedLabel key={5} id="skySignRate" />,

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
    //   <strong>Hoarding Details </strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> SkySign Business Details</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> SkySign Rate</strong>
    // </Typography>,
  ];
}

// // Get steps - Name
// function getSteps() {
//   return [
//     // "Issuance of  License",
//     "Applicant Details",
//     "Address Of License",
//     "Hoarding Details",
//     "SkySign Business Details",
//     "SkySign Rate"
//   ];
// }

// Get Step Content Form
function getStepContent(step) {
  switch (step) {
    // case 0:
    //   return <IssuanceOfLicense />;

    case 0:
      return <ApplicantDetails />;
    // return <ApplicantDetailsNewForm />;

    // case 1:
    //   return <AadharAuthentication />;

    case 1:
      return <AddressOfLicense />;

    case 2:
      return <SkysignInfo />;

    case 3:
      return <IndustryDocumentsUpload />;

    // case 3:
    //   return <HoardingDetails />;

    // case 4:
    //   return <SkySignBusinessDetails />;

    // case 5:
    //   return <SkySignRate />;

    default:
      return "unknown step";
  }
}

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
      dateOfBirth: "",
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
  const language = useSelector((state) => state?.labels.language);

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
            marginLeft: "10px",
            marginRight: "10px",
            padding: 1,
          }}
          square
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

                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{
                    marginLeft: "10vh",
                    marginRight: "5vh",
                    marginTop: "2vh",
                  }}
                >
                  {<FormattedLabel id="back"></FormattedLabel>}
                </Button>
                <Button
                  sx={{ marginTop: "2vh" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {activeStep === steps.length - 1
                    ? language != "en"
                      ? "जतन करा"
                      : "submit"
                    : language == "mr"
                    ? "जतन करा आणि पुढील"
                    : "Save & Next"}
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
