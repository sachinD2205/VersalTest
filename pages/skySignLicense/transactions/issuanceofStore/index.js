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
import React, { useEffect, useState } from "react";
import theme from "../../../../theme.js";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import { router } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { addIsssuanceofLicenseSlice } from "../../redux/features/isssuanceofLicenseSlice";
import ApplicantDetails from "../components/ApplicantDetails";
import AddressOfLicense from "../components/AddressOfLicense";
import IssuanceOfLicense from "../components/IssuanceOfLicense";
import PartenershipDetail from "../components/PartenershipDetail";
import BusinessAndEmployeeDetails from "../components/BusinessAndEmployeeDetails";
import BusinessInfo from "../components/BusinessInfo";
import StoreInformation from "../components/StoreInformation.js";
import AadharAuthentication from "../components/AadharAuthentication";
import IndustryDocumentsUpload from "../components/IndustryDocumentsUpload";
// import "./styles.css";
import ReactDOM from "react-dom";
import urls from "../../../../URLS/urls.js";
import Loader from "../../../../containers/Layout/components/Loader/index.js";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// Get steps - Name
function getSteps() {
  return [
    // <FormattedLabel key={1} id="issuanceofLicense" />,
    <FormattedLabel key={1} id="applicantDetails" />,
    // <FormattedLabel key={2} id="aadharAuthentication" />,
    <FormattedLabel key={2} id="addressOfLicense" />,
    <FormattedLabel key={3} id="storeInfo" />,
    // <FormattedLabel key={4} id="employeeDetaills" />,
    <FormattedLabel key={4} id="partenershipDetail" />,
    <FormattedLabel key={5} id="documentUpload" />,
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
    // case 0:
    //   return <IssuanceOfLicense />;
    // case 1:
    //   return <AadharAuthentication />;

    case 0:
      return <ApplicantDetails />;

    case 1:
      return <AddressOfLicense />;

    case 2:
      return <StoreInformation />;

    // case 3:
    //   return <BusinessAndEmployeeDetails />;

    case 3:
      return <PartenershipDetail />;

    case 4:
      return <IndustryDocumentsUpload />;

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

const schema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter school contact person Mobile Number"),
});
const LinaerStepper = () => {
  const methods = useForm({
    // resolver: yupResolver(schema),
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

  const {
    getValues,
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const language = useSelector((state) => state?.labels?.language);
  let user = useSelector((state) => state.user.user);
  const [tempId, setTempId] = useState();
  const [tempIndustryId, setTempIndustryId] = useState();

  const [tempState, setTemp] = useState(false);
  const [loading, setLoading] = useState(false);

  const userToken = useGetToken();
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

  useEffect(() => {
    const ID = router.query?.id;

    console.log("router?.query?", router?.query);
    if (ID) {
      setValue("applicationNumber", Number(ID));
      setLoading(true);
      axios
        .get(
          `${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/getByIdAndServiceId?serviceId=${router?.query?.serviceId}&id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          // setdata(res.data.trnApplicantDetailsDao[0])
          setLoading(false);
          reset(res?.data);
          if (res?.data?.trnPartnerDao?.length > 0) {
            setValue("addPartnerCheckBox", true);
          }
          setTemp(true);
          console.log("loi recept data", res?.data);
        })
        .catch((err) => {
          setLoading(false);
          sweetAlert({
            title: language === "en" ? "Error !! " : "त्रुटी !!",
            text:
              language === "en"
                ? "Somethings Wrong !! Getting error while fetching records !"
                : "काहीतरी त्रुटी !! रेकॉर्ड मिळवताना त्रुटी येत आहे",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              router.push(`/dashboard`);
            }
          });
        });
    }
    if (router.query?.applicationStatus === "DRAFT" && ID) {
      console.log("setTempId", Number(ID));
      setTempId(Number(ID));
    }
  }, [router.query]);

  // Handle Next
  // const handleNext = (data) => {
  //   dispach(addIsssuanceofLicenseSlice(data));
  //   console.log(data);
  //   if (activeStep == steps.length - 1) {
  //     fetch("https://jsonplaceholder.typicode.com/comments")
  //       .then((data) => data.json())
  //       .then((res) => {
  //         console.log(res);
  //         setActiveStep(activeStep + 1);
  //       });
  //   } else {
  //     setActiveStep(activeStep + 1);
  //   }
  // };

  const handleNext = (data) => {
    console.log("All Data --------", activeStep);
    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "CFC_USER") {
      userType = 2;
    } else if (localStorage.getItem("loggedInUser") == "DEPT_USER") {
      userType = 3;
    }

    // console.log('attachements All Data --------', attachments)

    dispach(addIsssuanceofLicenseSlice(data));

    if (activeStep == steps.length - 1) {
      console.log("data123", data, tempId);
      const finalBody = {
        ...data,
        createdUserId: user?.id,
        userType: userType,
        serviceId: 9,
        applicationStatus: "APPLICATION_SUBMITTED",
        id: tempId,
        activeFlag: "Y",
      };

      // if (router?.query?.pageMode != 'View') {
      setLoading(true);
      axios
        .post(`${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/save`, finalBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            // setLoading(false);
            console.log("resp data", res?.data);
            let temp = res?.data?.message?.split("$")[1];
            console.log("temp1", Number(temp?.split("@")[0]));
            sweetAlert({
              title: language === "en" ? "Submit ! " : "सबमिट केले !",
              text:
                language === "en"
                  ? "Record Submitted Successfully"
                  : "रेकॉर्ड यशस्वीरित्या सबमिट केले",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                router.push({
                  pathname: `/skySignLicense/report/acknowledgmentReceiptStore`,
                  query: {
                    id: Number(temp?.split("@")[0]),
                  },
                });
              }
            });

            // swal("Submited!", "Record Submited successfully !", "success");
            // console.log("resp data", res.data);
            // let temp = res?.data?.message?.split("$")[1];

            // console.log("temp1", Number(temp.split("@")[0]));
            // router.push({
            //   pathname: `/skySignLicense/report/acknowledgmentReceiptStore`,
            //   query: {
            //     id: Number(temp.split("@")[0]),
            //   },
            // });

            // router.push({
            //   pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
            //   query: {
            //     id: res?.data?.message?.split('$')[1],
            //     serviceId: 10,
            //     // ...res.data[0]
            //   },
            // })
          }
        })
        .catch((err) => {
          setLoading(false);
          sweetAlert({
            title: language === "en" ? "Error !! " : "त्रुटी !!",
            text:
              language === "en"
                ? "Somethings Wrong !! Record not Saved!"
                : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              // router.push(`/skySignLicense/dashboards`);
            }
          });
        });
      // } else {
      //   router.push({
      //     pathname: `/dashboard`,
      //   })
      // }
    } else {
      let finalBody;
      if (activeStep == 0) {
        finalBody = {
          ...data,
          createdUserId: user?.id,
          userType: userType,
          serviceId: 9,
          id: tempId ? tempId : null,
          applicationStatus: "DRAFT",
        };
      } else if (activeStep == 3) {
        finalBody = {
          ...data,
          createdUserId: user?.id,
          userType: userType,
          serviceId: 9,
          applicationStatus: "DRAFT",
          id: tempId,
          activeFlag: "Y",
        };
      } else {
        finalBody = {
          ...data,
          createdUserId: user?.id,
          userType: userType,
          serviceId: 9,
          applicationStatus: "DRAFT",
          id: tempId,
          activeFlag: "Y",
        };
      }

      axios
        .post(`${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/save`, finalBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            let toastMes =
              language === "en"
                ? "Record Saved Successfully"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!";
            toast.success(toastMes, {
              position: toast.POSITION.TOP_RIGHT,
            });

            // swal('Submited!', 'Record Drafted successfully !', 'success')
            console.log("resp data", res.data);
            let temp = res?.data?.message?.split("$")[1];
            setTempId(Number(temp.split("@")[0]));
            console.log("tempa", Number(temp.split("@")[0]));
            if (activeStep == 2) {
              setValue("trnStoreDetailsDao.id", Number(temp.split("@")[1]));
              // setTempIndustryId(Number(temp.split('@')[1]))
            }
            setActiveStep(activeStep + 1);
          }
        })
        .catch((er) => {
          let toastMes =
            language === "en"
              ? "Somethings Wrong !! Record not Saved!"
              : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!";
          toast.error(toastMes, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    }
    // }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleExit = () => {
    router.push({
      pathname: `/dashboard`,
    });
  };

  // View
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <BasicLayout> */}
          <ThemeProvider theme={theme}>
            <Paper
              // component={Box}
              sx={{
                marginLeft: 2,
                marginRight: 2,
                marginTop: 1,
                marginBottom: 2,
                padding: 1,

                backgroundColor: "#F5F5F5",
                // border: 1,
              }}
              elevation={5}
              // square

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

                    <Button
                      sx={{ marginTop: 7 }}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="contained"
                      color="primary"
                      style={{ marginRight: 30, marginLeft: 10 }}
                    >
                      {<FormattedLabel id="back"></FormattedLabel>}
                    </Button>
                    <Button
                      sx={{ marginTop: 7 }}
                      variant="contained"
                      color="primary"
                      // onClick={handleNext}
                      type="submit"
                    >
                      {/* {activeStep === steps.length - 1 ? (
                    <FormattedLabel id="finish" />
                  ) : (
                    <FormattedLabel id="saveAndNext" />
                  )}{" "} */}
                      {activeStep === steps.length - 1
                        ? language != "en"
                          ? "जतन करा"
                          : "submit"
                        : language == "mr"
                        ? "जतन करा आणि पुढील"
                        : "Save & Next"}
                    </Button>
                    <Button
                      sx={{ marginTop: 7 }}
                      onClick={handleExit}
                      variant="contained"
                      color="primary"
                      style={{ marginRight: 30, marginLeft: 30 }}
                    >
                      {<FormattedLabel id="exit"></FormattedLabel>}
                    </Button>
                  </form>
                </FormProvider>
              )}
            </Paper>
          </ThemeProvider>
          {/* </BasicLayout> */}
        </>
      )}
    </>
  );
};

export default LinaerStepper;
