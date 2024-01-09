import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import AdvocateDetails from "./AdvocateDetails";
import BankDetails from "./BankDetails";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Check from "@mui/icons-material/Check";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";

// for Icon
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

import {
  advocateDetailsSchema,
  advocateDetailsSchemaMr,
  bankDetailsSchema,
} from "../../../../containers/schema/LegalCaseSchema/advocateSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Documents from "./Documents";
import { useSelector } from "react-redux";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// For Icon
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
    3: <UploadFileIcon />,
    4: <BrandingWatermarkIcon />,
    5: <VideoLabelIcon />,
    6: <AddCircleIcon />,
    7: <HomeIcon />,
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

// steps
function getSteps() {
  return [
    <FormattedLabel key={1} id="advocateDetails" />,
    <FormattedLabel key={2} id="bankDetails" />,
    <FormattedLabel key={3} id="document" />,
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AdvocateDetails />;
    case 1:
      return <BankDetails />;
    case 2:
      return <Documents />;
  }
}

// Main Component
const View = () => {
  const router = useRouter();
  const [loadderState, setLoadderState] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [courtCaseNumbers, setcourtCaseNumbers] = useState([]);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [newCourtCaseEntry, setNewCourtCaseEntry] = useState();
  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] =
    useState([]);

  const [tempTitle, setTempTitle] = useState();
  const token = useSelector((state) => state.user.user.token);

  // mstAdvocateAttachmentDao
  // const [mstAdvocateAttachmentDao, setmstAdvocateAttachmentDao] = useState([]);

  const [dataValidation, setDataValidation] = useState(advocateDetailsSchema);
  // demandBillAdvocateDetailsSchema,

  const steps = getSteps();
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    defaultValues: {
      courtName: "",
      title: "",
      // caseMainType:"",
      // subType:"",
      // year:"",
      // stampNo:"",
      // filingDate: null,
      // filedBy:"",
      // filedAgainst:"",
      // caseDetails:"",

      // Advocate Details

      // advocateName:"",
      // opponentAdvocate:"",
      // concernPerson:"",
      // appearanceDate: null,
      // department:"",
      // courtName:""
    },
    mode: "onChange",

    criteriaMode: "all",
  });
  const { reset, setValue, getValues, watch } = methods;

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

  // For Document

  const [deleteButtonInputState, setDeleteButtonState] = useState(false);

  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.LCMSURL}/courtCaseEntry/discardcourtCaseEntry/${value}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            callCatchMethod(err, language);
          });
      }
    });
  };

  const handleNext = (data) => {
    // console.log("data",data)
    // setmstAdvocateAttachmentDao(JSON.parse(localStorage.getItem("mstAdvocateAttachmentDao")));
    // console.log("data",JSON.stringify(data));
    console.log("yearrr", getValues("yearrr"));
    console.log("firstName", getValues("firstName"));

    console.log("handleNext", activeStep);
    const finalBody = {
      ...data,
      // title: getValues("titleId"),
      mstAdvocateAttachmentDao: JSON.parse(
        localStorage.getItem("mstAdvocateAttachmentDao")
      ),
    };
    console.log("finalBodyAdvocate", finalBody);

    setLoadderState(true);

    if (activeStep == steps.length - 1) {
      setLoadderState(true);

      axios
        .post(`${urls.LCMSURL}/master/advocate/save`, finalBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res.status", res?.st);
          if (res.status == 200 || res.status == 201) {
            swal(
              // "Submited!",
              language === "en" ? "Saved!" : "जतन केले!",
              // "Record Submited successfully !",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            localStorage.removeItem("mstAdvocateAttachmentDao");
            router.push(`/LegalCase/master/advocate/`);
            setLoadderState(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } else {
      setLoadderState(false);

      setActiveStep(activeStep + 1);
    }
  };

  // Handle Back
  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  const nextStep = () => {
    setActiveStep((activeStep) => activeStep + 1);
  };

  useEffect(() => {
    setButtonInputStateNew(localStorage.getItem("buttonInputStateNew"));
    // setPageMode(localStorage.getItem("pageMode"));
    setNewCourtCaseEntry(localStorage.getItem("Advocate"));
    setNewCourtCaseEntryAttachmentList(localStorage.getItem("Advocate"));
    // reset(JSON.parse(localStorage.getItem("advocate")));
    // getCourtName();
  }, []);

  useEffect(() => {
    // methods.setValue("courtCaseNumber",getCourtCaseNumber());
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      console.log("Data------", router.query);
      methods.reset(router?.query);
      setValue("title", Number(router?.query?.title));
    }
  }, []);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  const language = useSelector((state) => state?.labels?.language);

  // For Validation
  useEffect(() => {
    //console.log('steps', activeStep)
    if (activeStep == "0" && language == "en") {
      setDataValidation(advocateDetailsSchema);
    }
    if (activeStep == "0" && language == "mr") {
      setDataValidation(advocateDetailsSchemaMr);
    }
    if (activeStep == "1" && language == "en") {
      setDataValidation(bankDetailsSchema);
    }
  }, [activeStep, language]);

  // view
  return (
    <>
      <div>
        <BreadcrumbComponent />
      </div>
      {/*  */}

      {loadderState ? (
        <Loader />
      ) : (
        // <div
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       height: "60vh", // Adjust itasper requirement.
        //     }}
        //   >
        //     <Paper
        //       style={{
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         background: "white",
        //         borderRadius: "50%",
        //         padding: 8,
        //       }}
        //       elevation={8}
        //     >
        //       <CircularProgress color="success" />
        //     </Paper>
        //   </div>

        <>
          <Paper
            sx={{
              // marginLeft: 5,
              marginRight: 5,
              marginTop: 1,
              marginBottom: 5,
              padding: 1,
              paddingTop: 5,
              paddingBottom: 5,
              border: "1px solid",
              borderColor: "blue",
              width: "100%",
            }}
          >
            <Stepper
              alternativeLabel
              connector={<ColorlibConnector />}
              activeStep={activeStep}
            >
              {steps.map((step, index) => {
                const labelProps = {};
                const stepProps = {};

                return (
                  <Step {...stepProps} key={index}>
                    <StepLabel
                      StepIconComponent={ColorlibStepIcon}
                      {...labelProps}
                    >
                      {step}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            {activeStep === steps.length ? (
              <Typography variant="h3" align="center">
                Thank You
              </Typography>
            ) : (
              <>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleNext)}>
                    {getStepContent(activeStep)}
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        disabled={activeStep.length === 0}
                        variant="outlined"
                        onClick={() => previousStep()}
                      >
                        <FormattedLabel id="back" />
                      </Button>
                      <Box sx={{ flex: "1 auto" }} />
                      <Button
                        variant="contained"
                        color="primary"
                        // onClick={"./LegalCase/master/advocate"}
                        onClick={() => {
                          localStorage.removeItem("mstAdvocateAttachmentDao");
                          router.push(`/LegalCase/master/advocate/`);
                        }}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                      <Box sx={{ flex: "0.01 auto" }} />

                      <Button variant="contained" color="primary" type="submit">
                        {activeStep === steps.length - 1 ? (
                          <FormattedLabel id="finish" />
                        ) : (
                          <FormattedLabel id="saveAndNext" />
                        )}
                      </Button>
                    </Box>
                  </form>
                </FormProvider>
              </>
            )}
          </Paper>
        </>
      )}

      {/*  */}

      {/* </BasicLayout> */}
    </>
  );
};

export default View;
