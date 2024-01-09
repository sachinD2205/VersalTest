import { GroupAdd } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Check from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
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
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import URLS from "../../../../../URLS/urls";
import Loader from "../../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import steeperCSS from "../../../../../styles/sportsPortalStyles/stepper.module.css";
import theme from "../../../../../theme.js";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import AadharAuthentication from "../../components/AadharAuthentication";
import BookingDetail from "../../components/BookingDetail";
import EcsDetails from "../../components/EcsDetails";
import PersonalDetailsForSports from "../../components/PersonalDetailsForSports";
import FileTable from "../../components/fileTableSports/FileTable";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";

import { yupResolver } from "@hookform/resolvers/yup";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks.js";
import {
  AadharAuthenticationSchema,
  BookingDetailSchema,
  EcsDetailsSchema,
  PersonalDetailsSchema,
  documentsUpload,
} from "../../../../../containers/schema/sportsPortalSchema/groundSchema";
import SelfDeclarationSwimming from "../../swimmingPoolM/selfDeclarationSwimming.js";
import SelfDeclarationGroundBooking from "../selfDeclarationGroundBooking.js";

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

    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
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
    1: <PermIdentityIcon />,
    2: <GroupAdd />,
    3: <BrandingWatermarkIcon />,
    4: <AccountBalanceIcon />,
    5: <AddCircleIcon />,
    6: <UploadFileIcon />,
    6: <ViewHeadlineIcon />,

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

function getSteps(i) {
  return [
    <strong key={1}>
      <FormattedLabel id="bookingDetails" />
    </strong>,
    <strong key={2}>
      <FormattedLabel id="personalGroupDetails" />
    </strong>,
    <strong key={3}>
      <FormattedLabel id="aadharAuthenticationDetails" />
    </strong>,
    <strong key={4}>
      <FormattedLabel id="paymentDetails" />
    </strong>,
    <strong key={5}>
      <FormattedLabel id="documentsUpload" />
    </strong>,
    <strong key={6}>
    <FormattedLabel id="selfDeclaration" />
  </strong>,
  ];
}
function GetStepContent(step) {
  switch (step) {
    case 0:
      return <BookingDetail />;
    case 1:
      return <PersonalDetailsForSports />;
    case 2:
      return <AadharAuthentication />;
    case 3:
      return <EcsDetails />;
    case 4:
      return <FileTable key={2} serviceId={68} />;
      case 5:
        return <SelfDeclarationGroundBooking />;
    default:
      return "unknown step";
  }
}



// Linear Stepper
const LinaerStepper = () => {
  const language = useSelector((state) => state?.labels?.language);
  const [dataValidation, setDataValidation] = useState(BookingDetailSchema);
  let user = useSelector((state) => state?.user?.user);
  const [GroundBookingId, setGroundBookingId] = useState()
  const userToken = useGetToken();
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      bookingRegistrationId: "",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      age: "",
      mobile: "",
      aadharNo: "",
      emailAddress: "",
      currentAddress: "",
      cityName: "",
      crPincode: "",
      permanentAddress: "",
      cityName: "",
      aadhaarNo: "",
      bankMaster: "",
      branchName: "",
      bankAccountHolderName: "",
      bankAccountNo: "",
      ifscCode: "",
      bankAddress: "",
      facilityName: "",
      bookingIds1: []
    },
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
  });
  const {
    reset,
    method,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = methods;
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
  const [loadderState, setLoadderState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Handle Back
  const handleBack = () => {
    setLoading(false);
    setActiveStep(activeStep - 1);
  };

  // slotShodKiBhava
  const slotShodKiBhava = () => {
    let bookingIds;
    // let bookingIdsRemoved;
    // filtered Time Slot Array
    let tempSlots = [];
    watch("bookingIds1")?.map((data) => {
      let selectedSlotTemp = watch("slots")?.find(selected => selected?.id == data)?.slot
      console.log("selectedSlotTemp", selectedSlotTemp)
      tempSlots.push(selectedSlotTemp)
    })

    // filtered
    console.log("tempSlots4545", tempSlots)

    setValue("selectedBookingSlots", JSON.stringify(tempSlots.toString()))
    const allID = [];

    watch("allSlots")?.map((sachin) => {
      console.log("Sachin", sachin?.slotDetailsDao
      );
      tempSlots?.map((tempSlot1) => {
        console.log("tempSlot1", tempSlot1)
        const tempBL = sachin?.slotDetailsDao?.find(dt => JSON.stringify(dt?.fromTime + "-" + dt?.toTime) == JSON.stringify(tempSlot1)
        )?.id
        console.log("tempBL", tempBL)
        allID.push(tempBL)
      })

      console.log("allID", allID)
      bookingIds = allID.toString();
      console.log("bookingIdsN", bookingIds)

      //!======================== for Removed Id Not Required ==============>
      // const tempArray2 = [];
      // const tempArray1 = null;
      // if (watch("bookingIds") != null && watch("bookingIds") != undefined && watch("bookingIds").length != 0) {
      //   //! 1st Array 
      //   tempArray1 = watch("bookingIds").split(",").map((data) => Number(data)),
      //   tempArray1.map((tempArr) => {
      //       if (!allID.includes(tempArr)) {
      //         tempArray2.push(tempArr)
      //       }
      //     })
      //   bookingIds = allID.toString();
      //   bookingIdsRemoved = tempArray2.toString()
      // } else {
      //   bookingIds = allID.toString();
      // }
    })
    // setValue("bookingIdsRemoved", bookingIdsRemoved)
    return bookingIds
  }

  // Handle Next
  const handleNext = (data) => {
    setLoadderState(true);

    let docs = [];
    let docsMr = [];

    //! -----
    watch("attachmentss")?.map((g) => {
      if (g?.filePath == null) {
        docs.push(g?.documentChecklistEn);
        docsMr.push(g?.documentChecklistMr);
      }
    });

    console.log(watch("attachmentss"), "sdfsdfdslfjdsl", docs, docsMr);
    //! document upload ok asel tar
    //! activeStep
    if (activeStep == steps.length - 1) {
      if (
        (docs?.length != 0 &&
          docs?.length != undefined &&
          docs?.length != null) ||
        (docsMr?.length != 0 &&
          docsMr?.length != undefined &&
          docsMr?.length != null)
      ) {
        setLoadderState(false);
        language == "en"
          ? sweetAlert({
            title: "Required!",
            text: "Please Upload  " + docs?.toString(),
            icon: "error",
            button: "Ok",
          })
          : sweetAlert({
            title: "आवश्यक आहे!",
            text: "कृपया अपलोड करा " + docsMr?.toString(),
            icon: "error",
            button: "ओके",
          });
      }
      else {
        const bookingIds = slotShodKiBhava();
        const bookingIds1 = watch("bookingIds1").toString();
        console.log("bookingIdsWithArray", bookingIds, activeStep)
        let _body = {
          ...data,
          createdUserId: user?.id,
          serviceId: 68,
          id: data?.id != null && data?.id != undefined && data?.id != "" ? data?.id : null,
          emailAddress: watch("emailAddress"),
          pageMode: data?.id != null && data?.id != undefined && data?.id != "" ? "APPLICATION_SENT_BACK_TO_CITIZEN" : "APPLICATION_CREATED",
          applicationStatus: "APPLICATION_CREATED",
          bookingIds: bookingIds,
          bookingIds1: bookingIds1,
          slots: null,
          allSlots: null,
          hours: watch("bookingIds1") != null && watch("bookingIds1") != undefined && watch("bookingIds1").length != 0 ? watch("bookingIds1").length : 0,

          // bookingIdsRemoved: watch("bookingIdsRemoved"),
          attachmentList:
            watch("attachmentss") == undefined
              ? []
              : [...watch("attachmentss")?.filter((r) => r?.filePath)],
        };


        axios
          .post(`${URLS.SPURL}/groundBooking/saveGroundBooking`, _body, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }).then((res) => {
            setLoadderState(false);
            if (res?.status == 200 || res?.status == 201) {

              language == "en"
                ? swal("Submited!", "Record Submited successfully !", "success")
                : swal(
                  "सबमिट केले",
                  "रेकॉर्ड यशस्वीरित्या सबमिट केले !",
                  "success"
                );

              router.push({
                pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptmarathi`,
                query: {
                  Id: res?.data?.message?.split(": ")[1],
                  serviceId: 68,
                },
              });
            }
          })
          .catch((error) => {
            setLoadderState(false);
            callCatchMethod(error, language);
          });
      }
    } else {
      setLoadderState(false);
      setActiveStep(activeStep + 1);
    }
  };


  // getByGroundBookingId
  const getByGroundBookingId = () => {
    setLoadderState(true);
    axios
      .get(`${URLS.SPURL}/groundBooking/getById?id=${GroundBookingId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {

          console.log("resdata54", res?.data);

          const data = {
            ...res?.data,
            disabledFieldInputState: false,
            bookingIds1: res?.data?.bookingIds1.split(",").map((data) => Number(data)),
            attachmentss: res?.data?.attachmentList,
          }
          console.log("data23432", data)
          reset(data);
          setLoadderState(false);
        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {

        setLoadderState(false);
        callCatchMethod(error, language);
      });
    ;

  }


  //!========================================> useEffect

  useEffect(() => {
    if (activeStep == "0") {
      setDataValidation(BookingDetailSchema);
    } else if (activeStep == "1") {
      setDataValidation(PersonalDetailsSchema);
    } else if (activeStep == "2") {
      setDataValidation(AadharAuthenticationSchema);
    } else if (activeStep == "3") {
      setDataValidation(EcsDetailsSchema);
    } else if (activeStep == "4") {
      setDataValidation(documentsUpload);
    }
  }, [activeStep]);

  useEffect(() => {
  }, [loading, loadderState]);

  useEffect(() => {
    console.log("erorrs", errors);
  }, [errors]);


  useEffect(() => {
    console.log("234324attachmentss", watch("attachmentss"))
  }, [watch("attachmentss")])


  useEffect(() => {
    if (
      localStorage.getItem("GroundBookingId") != null &&
      localStorage.getItem("GroundBookingId") != "" && localStorage.getItem("GroundBookingId") != undefined
    ) {
      setGroundBookingId(localStorage.getItem("GroundBookingId"));
    }
  }, []);

  useEffect(() => {
    if (GroundBookingId) {
      getByGroundBookingId();
    }
  }, [GroundBookingId]);
  useEffect(() => {
   console.log("facilityName",watch("facilityName"));
  }, [watch("facilityName")]);

  //!====================> View
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>

          <Paper
            sx={{
              margin: 2,
              padding: 2,
              paddingTop: 2,
              paddingBottom: 2,
              backgroundColor: "#FFFFF",
            }}
            elevation={5}
          >

            <Stack sx={{ width: "100%" }} spacing={4}>

              <Stepper
                className={steeperCSS.Stepper}
                alternativeLabel
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
            {activeStep === steps.length ? (
              <Typography variant="h3" align="center">
                Thank You
              </Typography>
            ) : (
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(handleNext)}
                >
                  {GetStepContent(activeStep)}
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="contained"
                    style={{ marginRight: 30, marginLeft: 10 }}
                  >
                    <FormattedLabel id="back" />
                  </Button>
                  {activeStep == steps.length - 1 && (
                    <Button
                      onClick={() => {
                        formPreviewDailogOpen();
                      }}
                      variant="contained"
                      style={{
                        marginRight: 30,
                        marginLeft: 10,
                        margin: "2vw",
                      }}
                      endIcon={<VisibilityIcon />}
                    >
                      <FormattedLabel id="viewForm" />
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    disabled={
                      activeStep === steps.length - 1 &&
                      !watch("acceptDeclaration")
                    }
                    style={{ marginRight: 30, marginLeft: 10 }}
                    type="submit"
                  >
                    {activeStep === steps.length - 1&&
                    watch("acceptDeclaration") ? (
                      <FormattedLabel id="submit" />
                    ) : (
                      <FormattedLabel id="next" />
                    )}
                  </Button>

                  {/** Form Preview Dailog  - OK */}
                  <Dialog
                    fullWidth
                    maxWidth={"xl"}
                    open={formPreviewDailog}
                    onClose={() => formPreviewDailogClose()}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <Grid container>
                        <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                          View Form
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
                                bgcolor: "red",
                                color: "white",
                              },
                            }}
                            onClick={() => {
                              formPreviewDailogClose();
                            }}
                          >
                            <CloseIcon
                              sx={{
                                color: "black",
                              }}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </DialogTitle>
                    <DialogContent>
                      {/* <BookingDetailsSwimming readOnly/> */}
                      <BookingDetail readOnly />
                      <PersonalDetailsForSports readOnly />
                      <EcsDetails readOnly />
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
                        <Button onClick={() => formPreviewDailogClose()}>
                          Exit
                        </Button>
                      </Grid>
                    </DialogTitle>
                  </Dialog>
                </form>
              </FormProvider>
            )}
          </Paper>
        </ThemeProvider>
      )}
    </>
  );
};

export default LinaerStepper;
