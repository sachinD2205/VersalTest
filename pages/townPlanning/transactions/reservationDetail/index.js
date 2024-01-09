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
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
//personal d
import PossessionDetails from "../../../../components/townPlanning/PossessionDetails";
import ReservationDetails from "../../../../components/townPlanning/ReservationDetails";
//icon
import { Check } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ManIcon from "@mui/icons-material/Man";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import {
//   documentsUpload,
//   personalDetailsSchema,
// } from "../../../../components/townPlanning/schema/partMap";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
    3: <UploadFileIcon />,
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
      {/* <FormattedLabel id="personalDetails" /> */}
      Reservation Details
    </strong>,

    <strong key={2}>Possession Details</strong>,
  ];
}

// Get Step Content Form
function getStepContent(step) {
  switch (step) {
    case 0:
      return <ReservationDetails key={1} />;

    // case 1:
    //   return <AddressDetailsDOP key={2} />;

    case 1:
      return <PossessionDetails key={2} />;

    default:
      return "unknown step";
  }
}

// Linear Stepper
const Index = () => {
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

  // const [dataValidation, setDataValidation] = useState(personalDetailsSchema);

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const language = useSelector((state) => state?.labels?.language);

  // Const

  useEffect(() => {
    console.log("steps", activeStep);
  }, [activeStep]);

  // useEffect(() => {
  //   console.log("steps", activeStep);
  //   if (activeStep == "0") {
  //     setDataValidation(personalDetailsSchema);
  //   } else if (activeStep == "1") {
  //     setDataValidation(documentsUpload);
  //   }
  // }, [activeStep]);

  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      // setBackDrop: false,
      // // id: null,
      possessionDetails: [],
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
    formState: { errors },
  } = methods;

  let user = useSelector((state) => state.user.user);
  const [villageDropDown, setVillageNameDropDown] = useState([]);
  const [selectedvillageDropDown, setSelectedvillageDropDown] = useState([]);
  const [zoneDropDown, setzoneDropDown] = useState([]);
  const [selectedzoneDropDown, setSelectedzoneDropDown] = useState([]);
  const [appropriateAuthorityDropDown, setAppropriateAuthorityDropDown] =
    useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [selectedwardKeys, setSelectedwardKeys] = useState([]);
  // useEffect(() => {
  //   if (router.query.pageMode == 'Edit' || router.query.pageMode == 'View') {
  //     let Id = router?.query?.id
  //     axios
  //       .get(`${urls.TPURL}/transaction/zoneCertificate/getById?id=${Id}`)
  //       .then((resp) => {
  //         console.log('viewEditMode', resp.data)
  //         reset(resp.data)
  //         let fileee = getValues("files");
  //         console.log("ahe ka kahi index", fileee);
  //       })
  //   }
  // }, [])

  useEffect(() => {
    console.log("aala village", watch("selectedVillages"));
  }, [watch("selectedVillages")]);
  // Handle Next
  const handleNext = (data) => {
    console.log("caleddddddd", watch("selectedVillages"));

    // let nps = villageDropDown
    //   .filter((r) => selectedvillageDropDown?.includes(r.villageNameEn))
    //   .map((r) => r.id);
    // // let stringggg = nps.toString();

    const finalBody = {
      ...data,
      createdUserId: user?.id,
      activeFlag: data.activeFlag,
      villageId: "," + watch("selectedVillages") + ",",
      zoneId: "," + watch("selectedZones") + ",",
      gatId: "," + watch("selectedGats") + ",",
      // files: getValues("files"),
      // isDrafted: activeStep == steps.length - 1 ? false : true,
      // serviceId: 18,
    };

    console.log("finalBody", finalBody);

    if (activeStep == steps.length - 1) {
      if (router?.query?.pageMode != "View") {
        // let data = { ...finalBody } ;
        console.log("datammmmm", data);
        axios
          .post(`${urls.TPURL}/reservationDetail/save `, finalBody, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
              // setValue("applicationId", res?.data?.message?.split("$")[1]);

              if (activeStep == steps.length - 1) {
                swal("Submited!", "Record Submited successfully !", "success");
                router.push({
                  pathname: `/townPlanning/transactions/reservationDetail/table`,
                });
              }

              axios
                .get
                // `
                // ${urls.TPURL}/transaction/zoneCertificate/getById/${
                //   res?.data?.message?.split('$')[1]
                // }
                // `,
                ()
                .then((r) => {
                  if (
                    r?.status == 200 ||
                    res?.status == 201 ||
                    res?.status == "SUCCESS"
                  ) {
                    reset(r?.data);
                  }
                })
                .catch((error) => {
                  callCatchMethod(error, language);
                });
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // handleClose
  const handleClose = () => {};

  const [backDrop, setBackDrop] = useState(false);

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
            <h2>Reservation Details</h2>
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
                {getStepContent(activeStep)}

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
