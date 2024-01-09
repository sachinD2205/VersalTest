import {
  Button,
  Grid,
  Paper,
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
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
//personal d
import FileTableCitizen from "../tdrFsiTable/FileTable";
//icon
import { Check } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FormatAlignLeftRoundedIcon from "@mui/icons-material/FormatAlignLeftRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import TdrFsiChecklist from "../../../../../components/townPlanning/TdrFsiChecklist";
import TsrFsiDetails from "../../../../../components/townPlanning/TdrFsiDetails";
import urls from "../../../../../URLS/urls";
import DevelopmentRightCertificate from "../../../Receipts/DevelopmentRightCertificate";
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
    2: <MenuRoundedIcon />,
    3: <FormatAlignLeftRoundedIcon />,
    4: <UploadFileIcon />,
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
      <FormattedLabel id="details" />
    </strong>,

    <strong key={2}>
      <FormattedLabel id="checkList" />
    </strong>,
    <strong key={2}>
      <FormattedLabel id="applicationForm" />
    </strong>,
    <strong key={2}>
      <FormattedLabel id="documentUpload" />
    </strong>,
  ];
}

// Get Step Content Form
function getStepContent(step, docApi, pageMode) {
  switch (step) {
    case 0:
      return <TsrFsiDetails key={1} />;

    case 1:
      return <TdrFsiChecklist />;
    // return <TdrFsiChecklistNewWorkingTable />
    case 2:
      return <DevelopmentRightCertificate />;
    case 3:
      // return <FileTable key={2} serviceId={21} docApi={docApi}/>
      return <FileTableCitizen key={2} serviceId={21} docApi={docApi} />;

    default:
      return "unknown step";
  }
}

// Linear Stepper
const Index = () => {
  // const [dataValidation, setDataValidation] = useState(personalDetailsSchema);

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const language = useSelector((state) => state?.labels?.language);
  const [tempId, setTempId] = useState();
  const [fetchedData, setFetchedData] = useState({});
  const [docApi, setDocApi] = useState(false);

  // Const

  // useEffect(() => {
  console.log("steps", activeStep);
  //   if (activeStep == "0") {
  //     setDataValidation(personalDetailsSchema);
  //   }
  //   // else if (activeStep == "1") {
  //   //   setDataValidation(areaDetailsSchema);

  //   // }
  //   else if (activeStep == "1") {
  //     setDataValidation(documentsUpload);
  //   }
  // }, [activeStep]);

  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      // setBackDrop: false,
      id: null,
      files: [],
      pageMode: "View",
      landOwnershipDetails: [
        {
          // srNo: '1',
          sevenTwelvePRCard: "",
          village: "",
          holder: "",
          tenure: "",
          easementRights: "",
          applicantStatus: "",
          areaOfPlot: "",
          areaUnderReservationRoad: "",
          asrRate: "",
        },
      ],
    },
    criteriaMode: "all",
    // resolver: yupResolver(dataValidation),
    mode: "onChange",
  });
  const {
    reset,
    method,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = methods;
  // const { fields, append, remove,update } = useFieldArray({
  //   control,
  //   name: 'landOwnershipDetails',
  // });

  //catch
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

  let user = useSelector((state) => state.user.user);
  const getApplicationData = (id) => {
    console.log("result111id", activeStep);
    if(id){
    axios
      .get(`${urls.TPURL}/generationTdrFsi/getGenerationTdrFsi?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("result111", res);
        const data = {
          ...res?.data,
          zoneId: JSON.parse(res?.data.zoneId),
          villageName: JSON.parse(res?.data.villageName),
          gatNo: JSON.parse(res?.data.gatNo),
        };
        // reset("fasercf",res?.data)
        // reset(data);
        reset(data);
        setValue("attachmentss", res?.data.files);
        if (activeStep == 2) {
          setDocApi(true);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
    }
  };
  useEffect(() => {
    console.log("xxxxxx", watch("zoneId"));
    if (router.query.pageMode == "View" && router.query.applicationId) {
      getApplicationData(router.query.applicationId);
    }
  }, [router.query]);
  useEffect(() => {
    if ((router.query.pageMode == "Edit" || router.query.pageMode == "View") && router?.query?.draftId) {
      // reset(router.query)
      // console.log("called???");
      axios
        .get(
          `${urls.TPURL}/generationTdrFsi/getGenerationTdrFsi?id=${router?.query?.draftId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          // setFetchedData(resp?.data)
          console.log("viewEditMode", resp.data);
          reset(resp?.data);
          // console.log(
          //   "12121",
          //   [...resp?.data.zoneId.slice(1, resp?.data.zoneId.length - 1)],
          //   "df",
          //   resp?.data?.zoneId
          // )
          setValue("zoneId", JSON.parse(resp?.data.zoneId));
          setValue("villageName", JSON.parse(resp?.data.villageName));
          setValue("gatNo", JSON.parse(resp?.data.gatNo));

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
  }, [router.query]);
  console.log(
    "documents log",
    getValues("quation12D"),
    getValues("quation12C"),
    getValues("quation8A"),
  );

  // Handle Next
  const handleNext = (data) => {
    console.log("qqAll Data --------", data.landOwnershipDetails);

    const data1 = {
      ...data,
      zoneId: JSON.stringify(watch("zoneId")),
      villageName: JSON.stringify(watch("villageName")),
      gatNo: JSON.stringify(watch("gatNo")),
      files:
        watch("attachmentss") == undefined
          ? []
          : [...watch("attachmentss")?.filter((r) => r.filePath)],
      // landOwnershipDetails: watch("landOwnershipDetails")
    };

    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "CFC_USER") {
      userType = 2;
    } else if (localStorage.getItem("loggedInUser") == "DEPT_USER") {
      userType = 3;
    }

    // dispach(addNewMarriageRegistraction(data));

    if (activeStep == steps.length - 1) {
      console.log(`data ---------> ${data}`);

      const finalBody = {
        ...data1,
        createdUserId: user?.id,
        userType: userType,
        serviceId: 21,
        // applicationStat: "APPLICATION_CREATED",
        id: tempId,
        activeFlag: "Y",
        // quation8A	:watch("quation8A"),
        // quation12C	:watch("quation12C"),
        // quation12D:watch("quation12D")
      };

      if (router?.query?.pageMode != "View") {
        axios
          .post(`${urls.TPURL}/generationTdrFsi/save`, finalBody, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
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
                pathname: `/townPlanning/Receipts/acknowledgmentReceiptmarathi`,
                query: {
                  id: res?.data?.message,
                  serviceId: 21,
                  // ...res.data[0]
                },
              });
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    } else {
      let finalBody;
      if (activeStep == 0) {
        finalBody = {
          ...data1,
          createdUserId: user?.id,
          userType: userType,
          serviceId: 21,
          applicationStat: "DRAFT",
          id: tempId,
          activeFlag: "Y",
          //   quation8A	:watch("quation8A"),
          // quation12C	:watch("quation12C"),
          // quation12D:watch("quation12D")
        };
      } else {
        finalBody = {
          ...data1,
          createdUserId: user?.id,
          userType: userType,
          serviceId: 21,
          applicationStat: "DRAFT",
          id: tempId,
          activeFlag: "Y",
          //   quation8A	:watch("quation8A"),
          // quation12C	:watch("quation12C"),
          // quation12D:watch("quation12D")
        };
      }

      console.log("Iddddd", tempId);
      if (router?.query?.pageMode != "View") {
        axios
          .post(`${urls.TPURL}/generationTdrFsi/save`, finalBody, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
              toast.success("Application Drafted Successfully !!!", {
                autoClose: "1000",
                position: toast.POSITION.TOP_RIGHT,
              });
              let temp = res?.data?.message;
              setTempId(Number(temp));
              getApplicationData(Number(temp));
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }

      setActiveStep(activeStep + 1);
    }
    // }
  };
  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // handleClose
  const handleClose = () => {};
  console.log("All Data11 --------", fetchedData);
  const [backDrop, setBackDrop] = useState(false);
  console.log("zsfsdf", errors);
  return (
    <>
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
          <Grid
            item
            xl={3}
            lg={3}
            md={6}
            sm={6}
            xs={12}
            p={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>{language == "en" ? "DRC Generation" : "DRC जनरेशन"}</h1>
          </Grid>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
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
            </Typography>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(
                  activeStep,
                  docApi,
                  router?.query?.pageMode,
                  fetchedData,
                )}

                <Button
                  sx={{ marginTop: 7 }}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="contained"
                  color="primary"
                  style={{ marginRight: 30, marginLeft: 10 }}
                >
                  {<FormattedLabel id="back" />}
                </Button>

                <Button
                  sx={{ marginTop: 7 }}
                  // disabled={activeStep == 4 ? (watch("witnesses").length != 3 ? true : false) : false}
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
                  sx={{ marginTop: 7, marginLeft: 5 }}
                  variant="contained"
                  onClick={() => {
                    router.push(`/dashboard`);
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
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
    </>
  );
};

export default Index;
