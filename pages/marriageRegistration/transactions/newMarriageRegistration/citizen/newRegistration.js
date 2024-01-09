import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
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
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import swal from "sweetalert";
import ApplicantDetails from "../../../../../components/marriageRegistration/ApplicantDetails";
import BrideDetails from "../../../../../components/marriageRegistration/BrideDetails";
import DocumentsUpload from "../../../../../components/marriageRegistration/DocumentsUpload";
import { addNewMarriageRegistraction } from "../../../../../components/marriageRegistration/features/newMarriageRegistrationSlice";
import GroomDetails from "../../../../../components/marriageRegistration/GroomDetails";
import PriestDetails from "../../../../../components/marriageRegistration/PriestDetails";
import WitnessDetails from "../../../../../components/marriageRegistration/WitnessDetails";
import IssuanceOfStreetVendorCSS from "../../../../../components/streetVendorManagementSystem/styles/IssuanceOfHawkerLicenseSteeper.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
//icon
import HistoryComponent from "../../../../../components/marriageRegistration/HistoryComponent";

import { Check } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import ManIcon from "@mui/icons-material/Man";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Woman2Icon from "@mui/icons-material/Woman2";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import sweetAlert from "sweetalert";
import styles from "../../../../../components/marriageRegistration/view.module.css";

import { toast } from "react-toastify";
import {
  applicationDetailsSchema,
  brideSchema,
  documentsUpload,
  groomSchema,
  priestSchema,
  witnessDetailsSchema,
} from "../../../../../components/marriageRegistration/schema/applicantschema";
import Loader from "../../../../../containers/Layout/components/Loader";
import urls from "../../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

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
    1: <AccountCircleIcon />,
    2: <ManIcon />,
    3: <Woman2Icon />,
    4: <TempleHinduIcon />,
    5: <EscalatorWarningIcon />,
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
    <strong key={1}>
      <FormattedLabel /* key={1} */ id="ApplicatDetails" />
    </strong>,
    <strong key={2}>
      <FormattedLabel /* key={2} */ id="groomDetail" />
    </strong>,
    <strong key={3}>
      <FormattedLabel /* key={3} */ id="brideDetails" />
    </strong>,
    <strong key={4}>
      <FormattedLabel /* key={4} */ id="priestDetails" />
    </strong>,

    <strong key={5}>
      <FormattedLabel /* key={5} */ id="witnessDetails" />
    </strong>,
    <strong key={6}>
      <FormattedLabel /* key={6} */ id="documentsUpload" />
    </strong>,
  ];
}

// Get Step Content Form
function getStepContent(step) {
  switch (step) {
    case 0:
      return <ApplicantDetails key={1} />;

    case 1:
      return <GroomDetails key={2} />;

    case 2:
      return <BrideDetails key={3} />;

    case 3:
      return <PriestDetails key={4} />;

    case 4:
      return <WitnessDetails key={5} />;

    case 5:
      return <DocumentsUpload key={6} />;

    default:
      return "unknown step";
  }
}

// Linear Stepper
const Index = () => {
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  const [dataValidation, setDataValidation] = useState(
    applicationDetailsSchema,
  );

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const language = useSelector((state) => state?.labels?.language);
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
  const [tempId, setTempId] = useState();

  const [tempState, setTemp] = useState(false);
  // Const

  useEffect(() => {
    console.log("steps", activeStep);
    if (activeStep == "0") {
      setDataValidation(applicationDetailsSchema);
    } else if (activeStep == "1") {
      setDataValidation(groomSchema(watch("gstatusAtTimeMarriageKey")));
    } else if (activeStep == "2") {
      setDataValidation(brideSchema(watch("bstatusAtTimeMarriageKey")));
    } else if (activeStep == "3") {
      setDataValidation(priestSchema);
    } else if (activeStep == "4") {
      setDataValidation(witnessDetailsSchema);
    } else if (activeStep == "5") {
      setDataValidation(
        documentsUpload(
          watch("gdisabled"),
          watch("bdisabled"),
          watch("gstatusAtTimeMarriageKey"),
          watch("lawOfMarriage"),
        ),
      );
    }
  }, [activeStep]);

  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      setBackDrop: false,
      id: null,
      applicationFrom: "online",
      applicationDate: "",
      zoneKey: "",
      wardKey: "",
      atitle: "",
      afName: "",
      amName: "",
      alName: "",
      atitleMr: "",
      afNameMr: "",
      amNameMr: "",
      alNameMr: "",
      aemail: "",
      amobileNo: "",

      aflatBuildingNo: "",
      abuildingName: "",
      aroadName: "",
      alandmark: "",

      aflatBuildingNoMr: "",
      abuildingNameMr: "",
      aroadNameMr: "",
      alandmarkMr: "",

      acityName: "",
      astate: "Maharashtra",
      acityNameMr: "",
      astateMr: "महाराष्ट्र",
      apincode: "",
      marriageDate: null,
      pplaceOfMarriage: "",
      pplaceOfMarriageMr: "",

      //  religionKey: '',
      //husband/groom
      gfName: "",
      gmName: "",
      glName: "",
      gbuildingNo: "",
      gbuildingName: "",
      groadName: "",
      glandmark: "",
      gvillageName: "",
      gcityName: "",
      gpincode: "",
      gstate: "Maharashtra",
      gstateMr: "महाराष्ट्र",
      ggender: "",
      gmobileNo: "",
      gphoneNo: "",
      gemail: "",
      gage: "",
      gstatus: "",
      greligionByBirth: "",
      greligionByAdoption: "",
      gbirthDate: null,

      gfNameMr: "",
      gmNameMr: "",
      glNameMr: "",

      // Groom Father
      // gFFName: '',
      // gFMName: '',
      // gFLName: '',
      // gFAge: '',
      // gFAadharNo: '',
      // gFMobileNo: '',
      // gFBuildingNo: '',
      // gFBuildingName: '',
      // gFRoadName: '',
      // gFLandmark: '',
      // gFVillageName: '',
      // gFCityName: '',
      // gFPincode: '',
      // gFState: 'Maharashtra',
      // gFEmail: '',
      //groom mother
      // gMFName: '',
      // gMMName: '',
      // gMLName: '',
      // gMMobileNo: '',
      // gMAadharNo: '',
      // gMAge: '',

      //wife/bride
      bfName: "",
      bmName: "",
      blName: "",
      bbuildingNo: "",
      bbuildingName: "",
      broadName: "",
      bkandmark: "",
      bvillageName: "",
      bcityName: "",
      bpincode: "",
      bstate: "Maharashtra",
      bstateMr: "महाराष्ट्र",
      bgender: "",
      baadharNo: "",
      bmobileNo: "",
      bphoneNo: "",
      bemail: "",
      bage: "",
      bstatus: "",
      breligionByBirth: "",
      breligionByAdoption: "",
      bbirthDate: null,

      bfNameMr: "",
      bmNameMr: "",
      blNameMr: "",

      //bride father
      // bFFName: '',
      // bFMName: '',
      // bFLName: '',
      // bFAge: '',
      // bFAadharNo: '',
      // bFMobileNo: '',
      // bFBuildingNo: '',
      // bFBuildingName: '',
      // bFRoadName: '',
      // bFLandmark: '',
      // bFVillageName: '',
      // bFCityName: '',
      // bFPincode: '',
      // bFState: 'Maharashtra',
      // bFEmail: '',

      //bride mother
      // bMFName: '',
      // bMMName: '',
      // bMLName: '',
      // bMMobileNo: '',
      // bMAadharNo: '',
      // bMAge: '',

      //prist
      ptitle: "",
      pfName: "",
      pmName: "",
      plName: "",
      pbuildingNo: "",
      pbuildingName: "",
      proadName: "",
      plandmark: "",
      pvillageName: "",
      pcityName: "",
      pstate: "Maharashtra",
      pstateMr: "महाराष्ट्र",
      pgender: "",
      paadharNo: "",
      pmobileNo: "",
      pphoneNo: "",
      pemail: "",
      page: "",
      preligionByBirth: "",
      preligionByAdoption: "",
      pbirthDate: null,
      pplaceOfMarriage: "",
      pplaceOfMarriageMr: "",

      // documents
      gageProofDocument: "",
      gresidentialProofDocument: "",
      gphoto: "",
      gthumb: "",
      bageProofDocument: "",
      bresidentialProofDocument: "",
      bphoto: "",
      bthumb: "",
      pdocument: "",
      invitationProof: "",
      inventPhoto: "",
      divorceCertificate: "",
      udeathcer: null,
      udivorcePaper: null,
      ucertiReligious: null,
      unofficialMarriageCertificate: "",

      // Photo
      religionCertificatePhoto: "",
      // dateCertificate: '',
      divorceCertificate: "",
      invitationProof: "",
      pdocument: "",
      bresidentialProofDocument: "",
      bAgeProofDocument: "",
      gresidentialProofDocument: "",
      gageProofDocument: "",
      marriageDate: null,
      // witness
      witnesses: [],
      attachments: [],
    },
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
  });
  const {
    reset,
    method,
    getValues,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;

  let user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      // reset(router.query)
      if (
        router?.query?.id != null &&
        router?.query?.id != undefined &&
        router?.query?.id != ""
      ) {
        axios
          .get(
            `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((resp) => {
            console.log("viewEditMode", resp.data);
            reset(resp?.data);

            if (
              router?.query?.draftId != null &&
              router?.query?.draftId != undefined &&
              router?.query?.draftId != ""
            ) {
              setTempId(router?.query?.draftId);
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
        // setFieldsDiabled(true);
      }
    }
  }, []);

  // // getByIdNewMarriageRegistraction(id);
  // const newMarriageRegistarionById = useSelector((state) =>
  //   newMarriageRegistractionSelector.selectById(state, id),
  // );

  // useEffect(() => {
  //   reset({ defaultValues });
  // }, []);

  // const

  // const getByIdNewMarriageRegistraction = (id) => {
  //   axios
  //     .get(`http://localhost:8091/mr/api/applicant/applicantRegistration/${id}`)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         reset({ ...res.data });
  //       }
  //     });
  // };

  // Handle Next
  const handleNext = (data) => {
    console.log("errorsss", errors);
    console.log("All Data --------", activeStep);

    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "cfcUser") {
      userType = 2;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    }

    // const finalBody = {
    //   ...data,
    //   createdUserId: user?.id,
    //   serviceId: 10,
    // };
    // console.log('attachements All Data --------', attachments)

    dispach(addNewMarriageRegistraction(data));
    if (router?.query?.pageMode != "View") {
      if (activeStep == steps.length - 1) {
        console.log(`data ---------> ${data}`);
        const finalBody = {
          ...data,
          createdUserId: user?.id,
          applicantType: userType,
          serviceId: 10,
          applicationStatus: "APPLICATION_CREATED",
          id: tempId,
          activeFlag: "Y",
        };

        if (router?.query?.pageMode != "View") {
          axios
            .post(
              `${urls.MR}/transaction/applicant/saveApplicantRegistration`,
              finalBody,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            )
            .then((res) => {
              if (res.status == 201) {
                // swal("Submited!", "Record Submited successfully !", "success");
                language == "en"
                  ? sweetAlert({
                      title: "Saved!",
                      text: "Record Saved successfully!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "जतन केले!",
                      text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                      icon: "success",
                      button: "ओके",
                    });
                router.push({
                  pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
                  query: {
                    id: res?.data?.message?.split("$")[1],
                    serviceId: 10,
                    // ...res.data[0]
                  },
                });
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
          // } else {
          //   router.push({
          //     pathname: `/dashboard`,
          //   });
          // }
        }
      } else {
        let finalBody;
        if (activeStep == 0) {
          finalBody = {
            ...data,
            createdUserId: user?.id,
            applicantType: userType,
            serviceId: 10,
            applicationStatus: "DRAFT",
            id: tempId,
            activeFlag: "Y",
          };
        } else if (activeStep == 2) {
          finalBody = {
            ...data,
            createdUserId: user?.id,
            applicantType: userType,
            serviceId: 10,
            applicationStatus: "DRAFT",
            id: tempId,
            activeFlag: "Y",
          };
        } else {
          // clearErrorsFun()
          finalBody = {
            ...data,
            createdUserId: user?.id,
            applicantType: userType,
            serviceId: 10,
            applicationStatus: "DRAFT",
            id: tempId,
            activeFlag: "Y",
          };
        }

        console.log("FinalBody12", finalBody);
        if (finalBody.gdisabled == null) {
          console.log("=>=>");
          clearErrors("ugdisabled");
        }
        axios
          .post(
            `${urls.MR}/transaction/applicant/saveApplicantRegistration`,
            finalBody,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
              toast.success(
                language == "en"
                  ? "Application Drafted Successfully !!!"
                  : "अर्जाचा मसुदा यशस्वीरित्या तयार झाला !!!",
                {
                  autoClose: "1000",
                  position: toast.POSITION.TOP_RIGHT,
                },
              );
              // swal("DRAFT!", "Record Submited successfully !", "success");
              let temp = res?.data?.message?.split("$")[1];
              setTempId(Number(temp));

              // setTempId(Number(temp.split("@")[0]));
              // if (activeStep == 4) {
              //   setValue('trnIndustryDetailsDao.id', Number(temp.split('@')[1]))
              //   // setTempIndustryId(Number(temp.split('@')[1]))
              // }
              // router.push({
              //   pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
              //   query: {
              //     id: res?.data?.message?.split("$")[1],
              //     serviceId: 10,
              //     // ...res.data[0]
              //   },
              // });
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    }
    setActiveStep(activeStep + 1);
    // }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  // handleClose
  const handleClose = () => {};

  const [backDrop, setBackDrop] = useState(false);
  // const clearErrorsFun=()=>{
  //   if(watch("gdisabled")==null || watch("gdisabled")==false){
  //     console.log("=>=>")
  //     clearErrors("ugdisabled");
  //   }
  // }
  console.log("ssssss", errors);
  console.log("ssssss11", watch("gstatusAtTimeMarriageKey"));

  useEffect(() => {
    console.log(
      "gresidentialProofDocument8987",
      watch("gresidentialProofDocument"),
    );
  }, [watch("gresidentialProofDocument")]);

  return (
    <>
      <Box>
        {/* <Typography style={{ marginLeft: "3vh" }}>
          {language != "en" ? "नवीन विवाह नोंदणी" : "New Marriage Registration"}
          /MarriageRegistration/Transactions/New Marriage Registration
        </Typography> */}

        <div className={styles.detailsHeder}>
          <div className={styles.h1TagHeder}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {language != "en"
                ? "नवीन विवाह नोंदणी"
                : "New Marriage Registration"}
            </h3>
          </div>
        </div>
      </Box>
      {router.query.pageMode == "Edit" ||
        (router.query.pageMode == "View" && (
          <HistoryComponent serviceId={10} applicationId={router?.query?.id} />
        ))}
      {/* <BasicLayout> */}
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 1,
            marginBottom: 2,
            padding: 1,

            backgroundColor: "#F5F5F5",
            border: 1,
          }}
          elevation={5}
        >
          <Stepper
            className={IssuanceOfStreetVendorCSS.Stepper}
            alternativeLabel
            activeStep={activeStep}
            // className={styles.Stepper}
            connector={<ColorlibConnector />}
          >
            {steps.map((label) => {
              const lableProps = {};
              const stepProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel
                    {...lableProps}
                    StepIconComponent={ColorlibStepIcon}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <Typography variant="h3" align="center">
              Thank You
              <Loader />
            </Typography>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(activeStep)}
                <div className={IssuanceOfStreetVendorCSS.ButtonMainDiv}>
                  <Stack
                    className={IssuanceOfStreetVendorCSS.ButtonMainDiv}
                    direction={{
                      xs: "column",
                      sm: "row",
                      md: "row",
                      lg: "row",
                      xl: "row",
                    }}
                    spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                    justifyContent="flex-start"
                    alignItems="center"
                    marginTop={10}
                    paddingBottom="500"
                  >
                    <Button
                      // sx={{ marginTop: 7 }}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="contained"
                      color="primary"
                      style={{ marginRight: 30, marginLeft: 10 }}
                    >
                      {<FormattedLabel id="back" />}
                    </Button>
                    {activeStep === steps.length - 1 && (
                      <Button
                        sx={{ marginTop: 7 }}
                        disabled={activeStep === 0}
                        onClick={formPreviewDailogOpen}
                        variant="contained"
                        endIcon={<VisibilityIcon />}
                        color="success"
                        style={{ marginRight: 30, marginLeft: 10 }}
                      >
                        {<FormattedLabel id="preview" />}
                      </Button>
                    )}

                    <Button
                      sx={{ marginTop: 7 }}
                      disabled={
                        activeStep == 4 && localStorage.getItem("showError")
                          ? watch("witnesses").length != 3
                            ? true
                            : false
                          : false
                      }
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      {activeStep === steps.length - 1
                        ? language != "en"
                          ? "जतन करा"
                          : "submit"
                        : language == "mr"
                        ? "पुढे"
                        : "next"}
                    </Button>
                    <Button
                      color="error"
                      className={IssuanceOfStreetVendorCSS.ButtonForMobileWidth}
                      variant="contained"
                      onClick={() => {
                        if (localStorage.loggedInUser == "departmentUser") {
                          router.push(`/marriageRegistration`);
                        } else {
                          router.push(`/dashboard`);
                        }
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Stack>
                </div>
              </form>
            </FormProvider>
          )}
        </Paper>
      </ThemeProvider>
      {/* </BasicLayout> */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDrop}
        onClick={handleClose}
      >
        <CircularProgress color="primary" />
      </Backdrop>

      {/** Dailog */}
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
              {<FormattedLabel id="preview" />}
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
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form>
                  <strong>
                    {" "}
                    <FormattedLabel id="ApplicatDetails" /> :
                  </strong>
                  <ApplicantDetails />
                  <strong>
                    {" "}
                    <FormattedLabel id="groomDetail" /> :
                  </strong>
                  <GroomDetails />
                  <strong>
                    {" "}
                    <FormattedLabel id="brideDetails" /> :
                  </strong>
                  <BrideDetails />
                  <strong>
                    {" "}
                    <FormattedLabel id="priestDetails" /> :
                  </strong>
                  <PriestDetails />
                  <strong>
                    {" "}
                    <FormattedLabel id="witnessDetails" /> :
                  </strong>
                  <WitnessDetails />
                  <strong>
                    {" "}
                    <FormattedLabel id="documentsUpload" /> :
                  </strong>
                  <DocumentsUpload preview={true} />
                </form>
              </FormProvider>
            </ThemeProvider>
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
              onClick={() => {
                const textAlert =
                  language == "en"
                    ? "Are you sure you want to exit this Record ? "
                    : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                const title = language == "en" ? "Exit ! " : "बाहेर पडा!";

                sweetAlert({
                  title: title,
                  text: textAlert,
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    language == "en"
                      ? sweetAlert({
                          title: "Exit!",
                          text: "Record is Successfully Exit!!",
                          icon: "success",
                          button: "Ok",
                        })
                      : sweetAlert({
                          title: "बाहेर पडा!",
                          text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                          icon: "success",
                          button: "Ok",
                        });
                    formPreviewDailogClose();
                  } else {
                    language == "en"
                      ? sweetAlert({
                          title: "Cancel!",
                          text: "Record is Successfully Cancel!!",
                          icon: "success",
                          button: "Ok",
                        })
                      : sweetAlert({
                          title: "रद्द केले!",
                          text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                          icon: "success",
                          button: "ओके",
                        });
                  }
                });
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </Grid>
        </DialogTitle>
      </Dialog>
    </>
  );
};

export default Index;
