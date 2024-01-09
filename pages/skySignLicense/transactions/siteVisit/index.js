import {
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  ThemeProvider,
  TextField,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../../theme.js";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { addIsssuanceofLicenseSlice } from "../../redux/features/isssuanceofLicenseSlice";
import ApplicantDetails from "../components/ApplicantDetails";
import AddressOfLicense from "../components/AddressOfLicense";
import IssuanceOfLicense from "../components/IssuanceOfLicense";
import PartenershipDetail from "../components/PartenershipDetail";
import IndustryAndEmployeeDetaills from "../components/IndustryAndEmployeeDetaills";
import BusinessOrIndustryInfo from "../components/BusinessOrIndustryInfo";
import AadharAuthentication from "../components/AadharAuthentication";
import IndustryDocumentsUpload from "../components/IndustryDocumentsUpload";
import ReIssuanceOfLicense from "../components/ReIssuanceOfLicense";
import SiteVisit from "../components/SiteVisit";
import ScrutinyAction from "../../../skySignLicense/transactions/components/ScrutinyAction";
import BusinessAndEmployeeDetails from "../components/BusinessAndEmployeeDetails";
import BusinessInfo from "../components/BusinessInfo";
import IndustryInfo from "../components/IndustryInfo";

import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { router } from "next/router";

import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HomeIcon from "@mui/icons-material/Home";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import urls from "../../../../URLS/urls";
import axios from "axios";
import StoreInformation from "../components/StoreInformation.js";
import Loader from "../../../../containers/Layout/components/Loader/index.js";
import { catchExceptionHandlingMethod } from "../../../../util/util";
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
    2: <BabyChangingStationIcon />,
    // 3: <VideoLabelIcon />,
    3: <HomeIcon />,
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
function getSteps() {
  return [
    <FormattedLabel key={1} id="issuanceofLicense" />,
    <FormattedLabel key={2} id="applicantDetails" />,
    <FormattedLabel key={3} id="aadharAuthentication" />,
    <FormattedLabel key={4} id="addressOfLicense" />,
    <FormattedLabel key={5} id="industryInfo" />,
    <FormattedLabel key={6} id="employeeDetaills" />,
    <FormattedLabel key={7} id="partenershipDetail" />,
    <FormattedLabel key={8} id="documentUpload" />,
  ];
}

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

    case 7:
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
const LinaerStepper = () => {
  const methods = useForm({
    defaultValues: {
      // "trnApplicantDetailsDao": {
      applicationNumber: "",
      // "SSLM20220001",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),

      serviceName: "",
      // trackingID: "",
      applicantType: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      age: "",
      mobile: "",
      emailAddress: "",
      panNo: "",
      registrationNo: "",
      gstNo: "",
      tanNo: "",
      aadhaarNo: "",
      crPropertyTaxNumber: "",
      proprtyAmount: "",
      crWaterConsumerNo: "",
      waterAmount: "",
      crCitySurveyNumber: "",
      crAreaName: "",
      crLandmarkName: "",
      crVillageName: "",
      crCityName: "Pimpri-Chinchwad",
      crState: "Maharashtra",
      crPincode: "",
      crLattitude: "",
      crLongitud: "",
      addressCheckBox: "",
      prCitySurveyNumber: "",
      prAreaName: "",
      prLandmarkName: "",
      prVillageName: "",
      prCityName: "Pimpri-Chinchwad",
      prState: "Maharashtra",
      prPincode: "",
      prLattitude: "",
      prLongitud: "",
      // },
      trnIndustryBussinessDetailsDao: {
        nameOfOrganization: "",
        propertyNo: "",
        propertyStatus: "",
        ownership: "",
        totalAreaFt: "",
        totalAreaM: "",
        zone: "",
        licenseType: "",
        industryType: "",
        businessType: "",
        businessSubType: "",
        constructionType: "",
        constructionAreaFt: "",
        constructionAreaM: "",
        machineCount: "",
        businessLocationTotalCountOfMachineries: "",
        workingHours: "",
        industryDate: null,
        temporarylicDate: null,
        citysurveyno: "",
        numbertype: "",
        blockno: "",
        sectorno: "",
        surveyno: "",
        citySurveyNo: "",
        plotNo: "",
        roadName: "",
        villageName: "",
        prCityName1: "",
        prState1: "",
        Pincode: "",
        officeStaff: "",
        permanentEmployees: "",
        temporaryEmployees: "",
        contractualEmployees: "",
        totalEmployees: "",
        fireEquirepment: "",
        firstAidKit: "",
        toilets: "",
        storageofrawmaterial: "",
        disposalSystemOfWaste: "",
        nuisanceOfResidents: "",
        ObjectionCertificate: "",
        separatebusiness: "",
      },
      pttitle: "",
      ptfname: "",
      ptmname: "",
      ptlname: "",
      ptgender: "",
      ptdateofBirth: null,
      ptmobile: "",
      ptemail: "",
      ptPropertyTaxNumber: "",
      ptroadNmae: "",
      ptvillage: "",
      ptcity: "",
      ptpincode: "",
    },
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  const {
    errors,
    getValues,
    setValue,
    reset,
    control,
    register,
    handleSubmit,
  } = methods;

  const dispach = useDispatch();
  const language = useSelector((state) => state?.labels?.language);
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
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [serviceId, setServiceId] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // reset(router?.query);
    if (router.query.id) {
      if (router?.query?.serviceId == 8) {
        setLoading(true);
        axios
          .get(
            `${urls.SSLM}/trnIssuanceOfIndustrialLicense/getByServiceIdAndId?serviceId=8&id=${router.query.id}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((r) => {
            setLoading(false);
            setServiceId(r.data.serviceId);
            reset(r.data);
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
                router.push(`/skySignLicense/dashboards`);
              }
            });
          });
      } else if (router?.query?.serviceId == 9) {
        setLoading(true);
        axios
          .get(
            `${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/getByIdAndServiceId?serviceId=9&id=${router.query.id}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((r) => {
            setLoading(false);
            setServiceId(r.data.serviceId);
            reset(r.data);
            if (r?.data?.trnPartnerDao?.length > 0) {
              setValue("addPartnerCheckBox", true);
            }
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
                router.push(`/skySignLicense/dashboards`);
              }
            });
          });
      } else {
        setLoading(true);
        axios
          .get(
            `${urls.SSLM}/trnIssuanceOfBusinessLicense/getById?id=${router.query.id}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((r) => {
            setLoading(false);
            setServiceId(r.data.serviceId);
            reset(r.data);
            if (r.data.serviceId == 7 && r?.data?.trnPartnerDao?.length > 0) {
              setValue("addPartnerCheckBox", true);
            }
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
                router.push(`/skySignLicense/dashboards`);
              }
            });
          });
      }
    }
  }, [router?.query]);

  // Handle Next
  const handleNext = (data) => {
    dispach(addIsssuanceofLicenseSlice(data));
    console.log("data", data);
    // if (activeStep == steps.length - 1) {
    //   axios
    //     .post(
    //       `${urls.SSLM}/trnIssuanceOfBusinessLicense/save`,
    //       data
    //       // {
    //       //   headers: {
    //       //     role: "CITIZEN",
    //       //   },
    //       // },
    //     )
    //     .then((res) => {
    //       if (res.status == 201) {
    //         data.id
    //           ? sweetAlert(
    //             "Updated!",
    //             "Record Updated successfully !",
    //             "success"
    //           )
    //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
    //         router.push(`/dashboard`);
    //       }
    //     });
    // } else {
    //   setActiveStep(activeStep + 1);
    // }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // View
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box>
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
              elevation={5}
            >
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(handleNext)}
                  sx={{ marginTop: 10 }}
                >
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>Site Visit </strong>
                  </div>
                  {/* <ReIssuanceOfLicense /> */}
                  {serviceId == 8 ? (
                    <>
                      <ApplicantDetails disabled={true} />

                      {/* <AadharAuthentication /> */}

                      <AddressOfLicense disabled={true} />

                      <IndustryInfo disabled={true} />

                      <PartenershipDetail disabled={true} />
                      <SiteVisit />
                    </>
                  ) : (
                    ""
                  )}
                  {serviceId == 9 ? (
                    <>
                      <ApplicantDetails disabled={true} />

                      {/* <AadharAuthentication /> */}

                      <AddressOfLicense disabled={true} />

                      <StoreInformation disabled={true} />

                      <PartenershipDetail disabled={true} />
                      <SiteVisit />
                    </>
                  ) : (
                    ""
                  )}
                  {serviceId === 7 ? (
                    <>
                      <ApplicantDetails disabled={true} />

                      {/* <AadharAuthentication /> */}

                      <AddressOfLicense disabled={true} />

                      <BusinessInfo disabled={true} />

                      <PartenershipDetail disabled={true} />
                      <SiteVisit />
                    </>
                  ) : (
                    ""
                  )}
                  <ScrutinyAction loading={setLoading} />
                  {/* <Button
                variant="contained"
                color="primary"
                // onClick={handleNext}
                type="submit"
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="primary"
                // onClick={() => proprtyAmount()}
                type="submit"
              >
                Back
              </Button> */}
                </form>
              </FormProvider>
            </Paper>
          </ThemeProvider>
          {/* </BasicLayout> */}
        </Box>
      )}
    </>
  );
};

export default LinaerStepper;
