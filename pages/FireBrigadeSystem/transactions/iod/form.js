import { yupResolver } from "@hookform/resolvers/yup";
import { Check } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import HomeIcon from "@mui/icons-material/Home";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import {
  Button,
  Grid,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import ApplicantDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/ApplicantDetails";
import ApplicantDetails from "../../../../components/fireBrigadeSystem/iod/ApplicantDetails";
// import OwnerDetail from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/OwnerDetail";
import OwnerDetail from "../../../../components/fireBrigadeSystem/iod/OwnerDetail";
// import FormsDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/FormsDetails";
import FormsDetails from "../../../../components/fireBrigadeSystem/iod/FormsDetails";
// import BuildingDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/BuildingDetails";
import BuildingDetails from "../../../../components/fireBrigadeSystem/iod/BuildingDetails";
// import NewBuildingDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/NewBuildingDetails";
// import BuildingFloorType from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/BuildingFloorType";
import Document from "../../../../components/fireBrigadeSystem/iod/Document";
import {
  BuildingUseSchema,
  formDTLIodDaoSchema,
  OtherDetailSchema,
  OwnerSchema,
  applicantDTLDaoSchema,
} from "../../../../components/fireBrigadeSystem/schema/buildingFireNoc";
import swal from "sweetalert";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// QontoConnector
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 10,
//     left: "calc(-50% + 16px)",
//     right: "calc(50% + 16px)",
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: "#784af4",
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: "#784af4",
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     borderColor:
//       theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
//     borderTopWidth: 3,
//     borderRadius: 1,
//   },
// }));

// QontoStepIconRoot
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

// QontoStepIcon
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

// QontoStepIcon
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
    1: <AddCircleIcon />,
    2: <PermIdentityIcon />,
    3: <PermIdentityIcon />,
    4: <HomeIcon />,
    5: <BrandingWatermarkIcon />,
    6: <AddCircleIcon />,
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
    "Applicant Details",
    "Owner Details",
    "Form Details",
    "Building Details",
    "Documents",
  ];
}

// getStepContent
function getStepContent(step, loadderState) {
  switch (step) {
    case 0:
      return <ApplicantDetails />;

    case 1:
      return <OwnerDetail />;

    case 2:
      return <FormsDetails />;

    case 3:
      return <BuildingDetails />;

    // case 3:
    //   return <BuildingFloorType />;

    case 4:
      return <Document loadderState={loadderState} />;

    default:
      return "unknown step";
  }
}

const Form = () => {
  const userToken = useGetToken();
  const user = useSelector((state) => state.user.user);
  const [dataValidation, setDataValidation] = useState(applicantDTLDaoSchema);
  const [activeStep, setActiveStep] = useState(0);
  // const [btnSaveText, setBtnSaveText] = useState("Save");
  const router = useRouter();
  const steps = getSteps();

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
    defaultValues: { nocId: "" },
  });
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    reset,
    clearErrors,
  } = methods;

  const [loadderState, setLoadderState] = useState(false);

  const getDocuments = (data) => {
    setLoadderState(true);
    console.log("which data ", watch("nocType"));
    let nocType = watch("nocType") ? watch("nocType") : 76;
    console.log("nocType", watch("nocType"));
    axios
      .get(
        `${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId?serviceId=${nocType}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setValue(
          "attachmentss",
          res?.data?.serviceWiseChecklist?.map((r, ind) => {
            return {
              ...r,
              docKey: r.document,
              id: data?.attachments?.find((dd) => dd.docKey == r.document)?.id
                ? data?.attachments?.find((dd) => dd.docKey == r.document)?.id
                : null,
              status: r.isDocumentMandetory ? "Mandatory" : "Not Mandatory",
              srNo: ind + 1,
              filePath: data?.attachments?.find((dd) => dd.docKey == r.document)
                ?.filePath
                ? data?.attachments?.find((dd) => dd.docKey == r.document)
                    ?.filePath
                : null,
            };
          })
        );
        setLoadderState(false);
      })
      .catch((err) => console.log(err));
  };

  const getProvisionalBuildingNoc = () => {
    axios
      .get(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${
          router?.query?.applicationId != null
            ? router?.query?.applicationId
            : watch("provisionalBuildingNocId")
        }`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log(
            "getById",
            res?.data?.formDTLIodDao?.underGroundWaterTankDao
          );
          reset(res?.data);
          setValue("provisionalBuildingNocId", res?.data?.id);
          if (activeStep == steps.length - 1) {
            console.log("calleddd", res?.data);
            getDocuments(res?.data);
          }

          // Filter tanks where tankLocation is equal to 1
          let filteredTanks =
            res?.data?.formDTLIodDao?.underGroundWaterTankDao?.filter(
              (tank) => tank.tankLocation === 1 && tank.activeFlag === "Y"
            );

          console.log("filteredTanks", filteredTanks);

          // Calculate total capacity for filtered tanks using reduce
          let totalCapacity = filteredTanks.reduce(
            (accumulator, currentTank) => accumulator + currentTank.capacity,
            0
          );

          setValue("formDTLIodDao.totalOverheadCap", totalCapacity);

          // Filter tanks where tankLocation is equal to 1
          let filteredUnderTanks =
            res?.data?.formDTLIodDao?.underGroundWaterTankDao?.filter(
              (tank) => tank.tankLocation === 2 && tank.activeFlag === "Y"
            );

          console.log("totalCapacityUnder", totalCapacityUnder);

          // Calculate total capacity for filtered tanks using reduce
          let totalCapacityUnder = filteredUnderTanks.reduce(
            (accumulator, currentTank) => accumulator + currentTank.capacity,
            0
          );

          setValue("formDTLIodDao.totalUndergroundCap", totalCapacityUnder);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const apiCalll = (finalBodyForApi) => {
    if (
      !(
        router?.query?.pageMode == "View" &&
        router?.query?.applicationId != null
      )
    ) {
      axios
        .post(`${urls.FbsURL}/transaction/iodNoc/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            // alert("d");
            setValue(
              "provisionalBuildingNocId",
              res?.data?.status?.split("$")[1]
            );
            // sweetAlert(
            //   "Saveddddddddd!",
            //   "Record Saved successfully !",
            //   "success"
            // );
          }
        })
        .catch((error) => {
          console.log("Error", error);
        });
    }

    if (activeStep == steps.length - 1) {
      router.back();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleNext = (data) => {
    console.log("65465464", watch("formDTLIodDao"));
    const finalBodyForApi = {
      ...data,

      createdUserId: user?.id,
      id: getValues("provisionalBuildingNocId"),
      // applicantDTLDao
      applicantDTLDao:
        watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
      // ownerDTLIodDao
      ownerDTLIodDao:
        watch("ownerDTLIodDao") == undefined
          ? []
          : [...watch("ownerDTLIodDao")],

      // approachRoadDTLDao
      approachRoadDTLDao:
        watch("formDTLIodDao.approachRoadDTLDao") == undefined
          ? {}
          : [...watch("formDTLIodDao.approachRoadDTLDao")],

      // floorDTLDao
      floorDTLDao:
        watch("buildingDTLDao.floorDTLDao") == undefined
          ? {}
          : [...watch("buildingDTLDao.floorDTLDao")],

      floorWiseUsageTypeDao:
        watch("buildingDTLDao.floorDTLDao.floorWiseUsageTypeDao") == undefined
          ? {}
          : [...watch("buildingDTLDao.floorDTLDao.floorWiseUsageTypeDao")],

      // propertyDTLDao
      // propertyDTLDao:
      //   watch("formDTLIodDao.propertyDTLDao") == undefined
      //     ? {}
      //     : [...watch("formDTLIodDao.propertyDTLDao")],

      // formDTLIodDao
      formDTLIodDao:
        watch("formDTLIodDao") == undefined ? {} : watch("formDTLIodDao"),

      // approachRoadDTLDao
      // underGroundWaterTankDao:
      //   watch("formDTLIodDao.underGroundWaterTankDao") == undefined
      //     ? {}
      //     : [...watch("formDTLIodDao.underGroundWaterTankDao")],

      // buildingDTLDao
      buildingDTLDao:
        watch("buildingDTLDao") == undefined
          ? []
          : [...watch("buildingDTLDao")],
      // attachments
      attachments:
        watch("attachmentss") == undefined
          ? []
          : [...watch("attachmentss")?.filter((r) => r.filePath)],
      applicationStatus:
        activeStep == steps?.length - 1
          ? "APPLICATION_CREATED"
          : data?.applicationStatus,
    };
    console.log("final", finalBodyForApi);

    if (activeStep == 0) {
      apiCalll(finalBodyForApi);
    }
    if (activeStep == 1) {
      let data = watch("ownerDTLIodDao") || [];
      if (data?.length == 0) {
        swal("please enter at least one owner deatils");
      } else {
        apiCalll(finalBodyForApi);
      }
    }
    if (activeStep == 2) {
      let directionData = watch("formDTLIodDao.approachRoadDTLDao") || [];
      let propertyData = watch("formDTLIodDao.propertyDTLDao") || [];
      let waterTankData = watch("formDTLIodDao.underGroundWaterTankDao") || [];

      if (directionData.length == 0) {
        swal("please enter at least one Direction details ");
      }
      if (propertyData.length == 0) {
        swal("please enter at least one Property number");
      }
      if (
        watch("formDTLIodDao.isPlanhaveUnderGroundWaterTank") === "Y" &&
        waterTankData.length == 0
      ) {
        swal("please enter at least one water tank details");
      }

      if (
        propertyData?.length != 0 &&
        directionData?.length != 0
        // watch("formDTLIodDao.isPlanhaveUnderGroundWaterTank") == "Y" &&
        // waterTankData?.length != 0
      ) {
        apiCalll(finalBodyForApi);
      }
    }
    if (activeStep == 3) {
      let data = watch("buildingDTLDao");
      if (data <= 1) {
        swal("please enter at least one building deatils");
      } else {
        apiCalll(finalBodyForApi);
      }
    }
    if (activeStep == 4) {
      // apiCalll(finalBodyForApi);
      if (
        !(
          router?.query?.pageMode == "View" &&
          router?.query?.applicationId != null
        )
      ) {
        axios
          .post(`${urls.FbsURL}/transaction/iodNoc/save`, finalBodyForApi, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res?.status == 200 || res?.status == 201) {
              console.log("res?.data?.id", res?.data?.id);
              // alert("d");
              setValue(
                "provisionalBuildingNocId",
                res?.data?.status?.split("$")[1]
              );
              sweetAlert("Saved!", "Record Saved successfully !", "success");
              router.push({
                // pathname: `/FireBrigadeSystem/transactions/provisionalBuildingNoc/acknowledgmentReceipt`,
                pathname: `/FireBrigadeSystem/prints/acknowledgmentReceiptmarathi`,
                query: {
                  // Id: res?.data?.message?.split(": ")[1],
                  id: res?.data?.status?.split("$")[1],
                  // id: res?.data?.id,
                  // serviceId: 35,
                  // ...res.data[0]
                },
              });
            }
          })
          .catch((error) => {
            console.log("Error", error);
          });
      }

      if (activeStep == steps.length - 1) {
        router.back();
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  // const handleNext = (data) => {
  //   console.log("data23432", data);

  //   // finalBodyForApi
  //   const finalBodyForApi = {
  //     ...data,
  //     createdUserId: user?.id,
  //     id: getValues("provisionalBuildingNocId"),
  //     // applicantDTLDao
  //     applicantDTLDao:
  //       watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
  //     // ownerDTLIodDao
  //     ownerDTLIodDao:
  //       watch("ownerDTLIodDao") == undefined ? [] : [...watch("ownerDTLIodDao")],
  //     // formDTLIodDao
  //     formDTLIodDao: watch("formDTLIodDao") == undefined ? {} : watch("formDTLIodDao"),
  //     // buildingDTLDao
  //     buildingDTLDao:
  //       watch("buildingDTLDao") == undefined
  //         ? []
  //         : [...watch("buildingDTLDao")],
  //     // attachments
  //     attachments:
  //       watch("attachmentss") == undefined
  //         ? []
  //         : [...watch("attachmentss")?.filter((r) => r.filePath)],
  //     applicationStatus:
  //       activeStep == steps.length - 1
  //         ? "APPLICATION_CREATED"
  //         : data.applicationStatus,
  //   };

  //   console.log("finalBodyForApiProvisionalBuildingNoc", finalBodyForApi);
  //   if (
  //     !(
  //       router?.query?.pageMode == "View" &&
  //       router?.query?.applicationId != null
  //     )
  //   ) {
  //     axios
  //       .post(
  //         `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res?.status == 200 || res?.status == 201) {
  //           // alert("d");
  //           setValue(
  //             "provisionalBuildingNocId",
  //             res?.data?.status?.split("$")[1]
  //           );
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Error", error);
  //         //
  //       });
  //   }

  //   if (activeStep == steps.length - 1) {
  //     console.log("provisionalBuildingNoc", data);
  //     router.back();
  //   } else {
  //     setActiveStep(activeStep + 1);
  //   }
  // };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    console.log("acitiveStep", activeStep);
    if (activeStep == "0") {
      setDataValidation(applicantDTLDaoSchema);
    } else if (activeStep == "1") {
      setDataValidation(OwnerSchema);
    } else if (activeStep == "2") {
      setDataValidation(formDTLIodDaoSchema);
    } else if (activeStep == "3") {
      setDataValidation(BuildingUseSchema);
    } else if (activeStep == "4") {
      setDataValidation(OtherDetailSchema);
    }
  }, [activeStep]);

  useEffect(() => {
    console.log("provisionalBuildingNocId", watch("provisionalBuildingNocId"));
    if (
      watch("provisionalBuildingNocId") == "" ||
      watch("provisionalBuildingNocId") != undefined ||
      watch("provisionalBuildingNocId") != null
    ) {
      if (router?.query?.pageMode != "View") {
        getProvisionalBuildingNoc();
      }
    }
  }, [watch("provisionalBuildingNocId")]);

  useEffect(() => {
    if (
      router?.query?.pageMode == "View" &&
      router?.query?.applicationId != null
    ) {
      getProvisionalBuildingNoc();
    }
  }, []);

  useEffect(() => {
    if (
      router?.query?.pageMode == "View" &&
      router?.query?.applicationId != null &&
      activeStep == steps.length - 1
    ) {
      getDocuments(getValues());
    }
  }, [watch("attachments"), activeStep]);

  // useEffect(() => {
  //   if (activeStep == steps.length - 1) {
  //     getDocuments(getValues());
  //   }
  // }, [activeStep]);

  return (
    <>
      <Paper
        square
        sx={{
          paddingBottom: 5,
          backgroundColor: "white",
        }}
        elevation={5}
      >
        <marquee>
          <Typography
            variant="h5"
            style={{
              textAlign: "center",
              justifyContent: "center",
              marginTop: "2px",
            }}
          >
            {/* <strong>{<FormattedLabel id="addProvisionalBuildingNoc" />}</strong> */}
            <strong>IOD Building NOC</strong>
          </Typography>
        </marquee>

        <Stack
          sx={{
            width: "100%",
            paddingBottom: "1%",
          }}
          spacing={4}
        >
          <Stepper
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
            <br />
            <br />
            <FormattedLabel id="thankYou" />
          </Typography>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep, loadderState)}
              <br />
              <br />
              <Grid container className={styles.feildres} spacing={2}>
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => router.back()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    <FormattedLabel id="back" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    type="submit"
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Save & Next"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        )}
      </Paper>
    </>
  );
};

export default Form;
