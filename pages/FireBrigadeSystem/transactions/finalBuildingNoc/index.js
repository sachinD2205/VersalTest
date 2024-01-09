// import {
//   Box,
//   Button,
//   Chip,
//   Container,
//   Paper,
//   Stack,
//   Step,
//   StepLabel,
//   Stepper,
//   ThemeProvider,
//   Typography,
// } from "@mui/material";
// import React, { useState } from "react";

// import { FormProvider, useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import { addIsssuanceofHawkerLicense } from "../../../redux/features/isssuanceofHawkerLicenseSlice";

// // import DocumentsUpload from "../components/DocumentsUpload";
// import theme from "../../../../theme.js";
// import urls from "../../../../URLS/urls";
// import axios from "axios";
// import sweetAlert from "sweetalert";
// import moment from "moment";
// // import schema from "./Schema";
// import { useRouter } from "next/router";
// import { Details } from "@mui/icons-material";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";

// //.....
// import PropTypes from "prop-types";
// import { styled } from "@mui/material/styles";
// import Check from "@mui/icons-material/Check";
// import SettingsIcon from "@mui/icons-material/Settings";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import VideoLabelIcon from "@mui/icons-material/VideoLabel";
// import StepConnector, {
//   stepConnectorClasses,
// } from "@mui/material/StepConnector";
// import PermIdentityIcon from "@mui/icons-material/PermIdentity";
// import HomeIcon from "@mui/icons-material/Home";
// import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
// import ApplicantDetails from "./components/ApplicantDetails";
// import FormsDetails from "./components/FormsDetails";
// import BuildingUse from "./components/BuildingUse";
// import OtherDetails from "./components/OtherDetails";

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

// const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
//   color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
//   display: "flex",
//   height: 22,
//   alignItems: "center",
//   ...(ownerState.active && {
//     color: "#784af4",
//   }),
//   "& .QontoStepIcon-completedIcon": {
//     color: "#784af4",
//     zIndex: 1,
//     fontSize: 18,
//   },
//   "& .QontoStepIcon-circle": {
//     width: 8,
//     height: 8,
//     borderRadius: "50%",
//     backgroundColor: "currentColor",
//   },
// }));

// function QontoStepIcon(props) {
//   const { active, completed, className } = props;

//   return (
//     <QontoStepIconRoot ownerState={{ active }} className={className}>
//       {completed ? (
//         <Check className="QontoStepIcon-completedIcon" />
//       ) : (
//         <div className="QontoStepIcon-circle" />
//       )}
//     </QontoStepIconRoot>
//   );
// }

// QontoStepIcon.propTypes = {
//   /**
//    * Whether this step is active.
//    * @default false
//    */
//   active: PropTypes.bool,
//   className: PropTypes.string,
//   /**
//    * Mark the step as completed. Is passed to child components.
//    * @default false
//    */
//   completed: PropTypes.bool,
// };

// const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 22,
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage:
//         "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage:
//         "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor:
//       theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
//     borderRadius: 1,
//   },
// }));

// const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
//   backgroundColor:
//     theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
//   zIndex: 1,
//   color: "#fff",
//   width: 50,
//   height: 50,
//   display: "flex",
//   borderRadius: "50%",
//   justifyContent: "center",
//   alignItems: "center",
//   ...(ownerState.active && {
//     // background: rgb(9,32,121),
//     // background: linear-gradient(90deg, rgba(9,32,121,1) 1%, rgba(0,212,255,1) 76%);

//     backgroundImage:
//       "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
//     // "radial-gradient(circle, rgba(100,255,250,1) 11%, rgba(16,21,145,1) 100%)",
//     boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
//   }),
//   ...(ownerState.completed && {
//     backgroundImage:
//       "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
//   }),
// }));

// function ColorlibStepIcon(props) {
//   const { active, completed, className } = props;

//   const icons = {
//     // 1: <SettingsIcon />,
//     1: <PermIdentityIcon />,
//     2: <BrandingWatermarkIcon />,
//     // 3: <VideoLabelIcon />,
//     3: <HomeIcon />,
//     4: <AddCircleIcon />,
//     // 5: <AddCircleIcon />,
//     // 6: <UploadFileIcon />,
//   };

//   return (
//     <ColorlibStepIconRoot
//       ownerState={{ completed, active }}
//       className={className}
//     >
//       {icons[String(props.icon)]}
//     </ColorlibStepIconRoot>
//   );
// }

// ColorlibStepIcon.propTypes = {
//   /**
//    * Whether this step is active.
//    * @default false
//    */
//   active: PropTypes.bool,
//   className: PropTypes.string,
//   /**
//    * Mark the step as completed. Is passed to child components.
//    * @default false
//    */
//   completed: PropTypes.bool,
//   /**
//    * The label displayed in the step icon.
//    */
//   icon: PropTypes.node,
// };

// const steps = [
//   "Select campaign settings",
//   "Create an ad group",
//   "Create an ad",
// ];

// function getSteps() {
//   return [
//     // "",
//     "Applicant Details",
//     "Forms Details",
//     "Purpose Of Building Use",
//     "Other Details",
//   ];
// }

// // function getStepContent(step) {
// //   switch (step) {
// //     case 0:
// //       return <BasicApplicationDetails />;

// //     case 1:
// //       return <HawkerDetails />;

// //     case 2:
// //       return <AddressOfHawker />;

// //     case 3:
// //       return <AadharAuthentication />;

// //     case 4:
// //       return <AdditionalDetails />;

// //     case 5:
// //       return <DocumentsUpload />;

// //     default:
// //       return "unknown step";
// //   }
// // }
// // Get Step Content Form
// function getStepContent(step) {
//   switch (step) {
//     // case 0:
//     // return <IssuanceOfHawkerLicense />;

//     case 0:
//       return <ApplicantDetails />;

//     case 1:
//       return <FormsDetails />;

//     case 2:
//       return <BuildingUse />;

//     case 3:
//       return <OtherDetails />;

//     default:
//       return "unknown step";
//   }
// }

// // Linear Stepper
// const LinaerStepper = () => {
//   const router = useRouter();
//   const methods = useForm({
//     defaultValues: {
//       applicantName: "",
//       applicationDate: "",
//       officeContactNo: 123,
//       workingSiteOnsitePersonMobileNo: "",
//       emailId: "",
//       appliedFor: "",
//       architectName: "",
//       architectFirmName: "",
//       architectRegistrationNo: "",
//       applicantPermanentAddress: "",
//       siteAddress: "",
//       applicantContactNo: "",
//       finalPlotNo: "",
//       revenueSurveyNo: "",
//       buildingLocation: "",
//       townPlanningNo: "",
//       blockNo: "",
//       opNo: "",
//       citySurveyNo: "",
//       typeOfBuilding: "",
//       residentialUse: "",
//       commercialUse: "",
//       nOCFor: "",
//       buildingHeightFromGroundFloorInMeter: "",
//       noOfBasement: "",
//       totalBuildingFloor: "",
//       basementAreaInsquareMeter: "",
//       noOfVentilation: "",
//       noOfTowers: "",
//       plotAreaSquareMeter: "",
//       constructionAreSqMeter: "",
//       noOfApprochedRoad: "",
//       drawingProvided: "",
//       highTensionLine: "",
//       areaZone: "",
//       previouslyAnyFireNocTaken: "",
//       underTheGroundWaterTankCapacityLighter: "",
//       l: "",
//       b: "",
//       h: "",
//       volumeLBHIn: "",
//       approvedMapOfUndergroundWaterTank: "",
//       overHeadWaterTankCapacityInLiter: "",
//       overHearWaterTankCoApprovedMaps: "",
//       approvedKeyPlan: "",
//       approvedLayoutPlanPCMC: "",
//       approvedApproachRoadPCMC: "",
//       measurementOfTank: "",
//       explosiveLicense: "",
//       permissionLetterOfPCMC: "",
//       completionCertificate: "",
//       structuralStabilityCertificate: "",
//       escalatorApprovedByGovtCertificate: "",
//       fireDrawingFloorWiseAlsoApprovedByComplianceAuthority: "",
//       nocfor: "",
//     },
//   });

//   // Const
//   const [activeStep, setActiveStep] = useState(0);
//   const steps = getSteps();
//   const dispach = useDispatch();

//   // Handle Next
//   // const handleNext = (data) => {
//   //   console.log("Form  Submit Data --->", JSON.stringify(data));
//   //   dispach(addIsssuanceofHawkerLicense(data));
//   //   console.log(data);
//   //   if (activeStep == steps.length - 1) {
//   //     axios
//   //       .post(
//   //         `localhost:8092/fbs/api/transaction/provisionalBuildingFireNOC/saveTrnProvisionalBuildingFireNOC`,
//   //         data,
//   //         {
//   //           headers: {
//   //             role: "CITIZEN",
//   //           },
//   //         }
//   //       )
//   //       .then((res) => {
//   //         if (res.status == 200) {
//   //           data.id
//   //             ? sweetAlert(
//   //                 "Updated!",
//   //                 "Record Updated successfully !",
//   //                 "success"
//   //               )
//   //             : sweetAlert("Saved!", "Record Saved successfully !", "success");
//   //           router.push(`/dashboard`);
//   //         }
//   //       });
//   //   } else {
//   //     setActiveStep(activeStep + 1);
//   //   }
//   // };

//   const handleNext = (data) => {
//     console.log("All Data --------", data);
//     // console.log("gAgeProofDocumentPhoto --------", data.gAgeProofDocumentPhoto);
//     // console.log("gResidentDocumentPhoto --------", data.gResidentDocumentPhoto);
//     // console.log("bAgeProofDocumentPhoto --------", data.gResidentDocumentPhoto);
//     // let files = ({ gAgeProofDocumentPhoto } = data);
//     // dispach(addNewMarriageRegistraction(data));

//     if (router.query.pageMode == "Edit") {
//       if (activeStep == steps.length - 1) {
//         axios
//           .put(
//             `localhost:8092/fbs/api/transaction/provisionalBuildingFireNOC/saveTrnProvisionalBuildingFireNOC/${id}`,
//             data
//           )
//           .then((res) => {
//             if (res.status == 201) {
//               swal("Updated!", "Record Saved successfully !", "success");
//             }
//           });
//       } else {
//         setActiveStep(activeStep + 1);
//       }
//     } else {
//       if (activeStep == steps.length - 1) {
//         console.log(`data --------->s ${data}`);
//         axios
//           .post(
//             `localhost:8092/fbs/api/transaction/provisionalBuildingFireNOC/saveTrnProvisionalBuildingFireNOC`,
//             data
//           )
//           .then((res) => {
//             if (res.status == 201) {
//               swal("Submited!", "Record Submited successfully !", "success");
//             }
//             router.push(
//               `/FireBrigadeSystem/transactions/provisionalBuildingNoc/Table`
//             );
//           });
//       } else {
//         setActiveStep(activeStep + 1);
//       }
//     }
//   };

//   // Handle Back
//   const handleBack = () => {
//     setActiveStep(activeStep - 1);
//   };

//   // View
//   return (
//     <>
//       <BasicLayout>
//         <ThemeProvider theme={theme}>
//           <div
//             style={{
//               // fontWeight: "bold",
//               textAlign: "center",
//               marginBottom: 30,
//               // textTransform: "uppercase",
//               // backgroundColor: "blue",
//             }}
//           >
//             {" "}
//             {/* <FormattedLabel id="advocate" /> */}
//             {/* Provisional Building Fire NOC */}
//             <Chip
//               sx={{
//                 backgroundColor: "#2196f3",
//                 color: "white",
//                 fontSize: 17,
//                 padding: 2,
//                 background: "rgb(255,117,100)",
//                 background:
//                   "radial-gradient(circle, rgba(255,117,100,1) 0%, rgba(236,14,14,1) 79%)",
//               }}
//               label="Add Provisional Building Fire NOC"
//             />
//           </div>
//           <Paper
//             component={Box}
//             sx={{ p: 3 }}
//             square
//             // sx={{
//             //   margin: 5,
//             //   padding: 1,
//             //   paddingTop: 5,
//             //   paddingBottom: 5,
//             // }}
//             elevation={20}
//           >
//             {/* <Stepper
//               alternativeLabel
//               activeStep={activeStep}
//               style={{
//                 backgroundColor: "#F2F3F4",
//                 padding: 20,
//                 borderRadius: 10,
//               }}
//             >
//               {steps.map((step, index) => {
//                 const labelProps = {};
//                 const stepProps = {};

//                 return (
//                   <Step {...stepProps} key={index}>
//                     <StepLabel {...labelProps}>{step}</StepLabel>
//                   </Step>
//                 );
//               })}
//             </Stepper> */}
//             <Stack sx={{ width: "100%" }} spacing={4}>
//               {/* <Stepper
//                 alternativeLabel
//                 // activeStep={1}
//                 activeStep={activeStep}
//                 connector={<QontoConnector />}
//               >
//                 {steps.map((label) => {
//                   const labelProps = {};
//                   const stepProps = {};

//                   return (
//                     <Step key={label} {...stepProps}>
//                       <StepLabel
//                         {...labelProps}
//                         StepIconComponent={QontoStepIcon}
//                       >
//                         {label}
//                       </StepLabel>
//                     </Step>
//                   );
//                 })}
//               </Stepper> */}
//               <Stepper
//                 alternativeLabel
//                 // activeStep={1}
//                 activeStep={activeStep}
//                 connector={<ColorlibConnector />}
//               >
//                 {steps.map((label) => {
//                   const labelProps = {};
//                   const stepProps = {};

//                   return (
//                     <Step key={label} {...stepProps}>
//                       <StepLabel
//                         {...labelProps}
//                         StepIconComponent={ColorlibStepIcon}
//                       >
//                         {label}
//                       </StepLabel>
//                     </Step>
//                   );
//                 })}
//               </Stepper>
//             </Stack>
//             <br />
//             {activeStep === steps.length ? (
//               <Typography variant="h3" align="center">
//                 Thank You
//               </Typography>
//             ) : (
//               <FormProvider {...methods}>
//                 <form
//                   onSubmit={methods.handleSubmit(handleNext)}
//                   sx={{ marginTop: 10 }}
//                 >
//                   {getStepContent(activeStep)}
//                   <Stack
//                     direction="row"
//                     spacing={2}
//                     style={{ marginRight: 1000 }}
//                   >
//                     <Button
//                       disabled={activeStep === 0}
//                       // disabled
//                       onClick={handleBack}
//                       variant="contained"
//                     >
//                       back
//                     </Button>
//                     <Button
//                       variant="contained"
//                       disabled={activeStep === steps.length}
//                       color="primary"
//                       // onClick={handleNext}
//                       type="submit"
//                       onClick={() =>
//                         router.push({
//                           pathname:
//                             "/FireBrigadeSystem/transactions/provisionalBuildingNoc/Table",
//                         })
//                       }
//                     >
//                       {activeStep === steps.length - 1 ? "Submit" : "Next"}
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       endIcon={<ExitToAppIcon />}
//                       // onClick={() => exitButton()}
//                       onClick={() =>
//                         router.push({
//                           pathname:
//                             "/FireBrigadeSystem/transactions/provisionalBuildingNoc/Table",
//                         })
//                       }
//                     >
//                       Exit
//                     </Button>
//                   </Stack>
//                 </form>
//               </FormProvider>
//             )}
//           </Paper>
//         </ThemeProvider>
//       </BasicLayout>
//     </>
//   );
// };

// export default LinaerStepper;

import { Button, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import moment from "moment";
import { GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../../URLS/urls";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// import BasicLayout from "../../../../../pcmcerp-hk/containers/Layout/BasicLayout";

const Index = () => {
  const router = useRouter();
  const userToken = useGetToken();

  const language = useSelector((state) => state?.labels.language);

  const [dataSource, setDataSource] = useState([]);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [editButtonInputState, setEditButtonInputState] = useState(false);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [titles, settitles] = useState([]);

  // const gettitles = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/title/getAll`)
  //     .then((res) => {
  //       settitles(
  //         res.data.map((r, i) => ({
  //           id: r.id,
  //           title: r.title,
  //         }))
  //       );
  //     });
  // };
  // Get Table - Data
  useEffect(() => {
    // getData();
    getNocTypes();
  }, []);

  // get Noc Types
  const getNocTypes = () => {
    axios
      .get(`${urls.BaseURL}/typeOfNOCMaster/getTypeOfNOCMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("resssss res", res.data);

        getData(10, 0, res.data);
        setNocTypes(res.data);
      })
      .catch((err) => console.log(err));
  };
  const getData = (_pageSize = 10, _pageNo = 0, data) => {
    console.log("daatatat", data);
    axios
      .get(`${urls.BaseURL}/transaction/provisionalBuildingFireNOC/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      // .then((res) => {
      //   setDataSource(res?.data);
      // });
      .then((res) => {
        console.log("dattaaa", res.data);
        // setDataSource(res?.data);

        let _res = res.data.provisionBuilding.map((val, index) => {
          console.log("resssss noc val", val);
          var noc = "";
          data &&
            data.filter((item) => {
              if (
                val.nOCFor &&
                item.id &&
                item.id.toString().includes(val.nOCFor.toString())
              )
                noc = language == "en" ? item.nOCName : item.nOCNameMr;
            });
          console.log("resssss noc", noc);
          return {
            ...val,
            serialNo: val.id,
            nOCFor: noc,
          };
        });
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  const viewRecord = (record) => {
    router.push({
      pathname: "/FireBrigadeSystem/transactions/finalBuildingNoc/form",
      query: {
        pageMode: "Edit",
        ...record,
      },
    });
  };

  // Delete By ID
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
            `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/discardTrnProvisionalBuildingFireNOC/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              gettitles();
            }
          });
      }
    });
    // await
  };

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDateT" />,
      headerName: "Application Date",
      width: 150,
    },

    {
      // field: "applicantName",
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="applicantNameT" />,
      headerName: "Applicant Name",
      width: 150,
    },

    {
      field: "applicantContactNo",
      headerName: <FormattedLabel id="applicantContactNoT" />,
      headerName: "Applicant Number",
      width: 150,
    },
    {
      field: language == "en" ? "architectName" : "architectNameMr",
      headerName: <FormattedLabel id="architectNameT" />,
      headerName: "Architect Name",
      width: 150,
    },
    {
      field: "architectFirmName",
      headerName: <FormattedLabel id="architectFirmNameT" />,
      headerName: "Architect Firm Name",
      width: 150,
    },
    // {
    //   field: "appliedFor",
    //   // headerName: <FormattedLabel id="appliedForT" />,
    //   headerName: "Applied For",
    //   width: 100,
    // },
    {
      field: "nOCFor",
      headerName: <FormattedLabel id="nOCForT" />,
      headerName: "NOC For",
      width: 100,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      // headerName: "Actions",
      width: 370,
      headerAlign: "center",

      // // position: "sticky",
      // fixed: "right",

      renderCell: (record) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                console.log("Record", record);
                viewRecord(record.row);
              }}
            >
              <Button size="small" className={styles.click} variant="outlined">
                Action
              </Button>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                console.log("Record", record);
                viewRecord(record.row);
              }}
            >
              <Button size="small" className={styles.click} variant="outlined">
                Site Visit
              </Button>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                console.log("Record", record);
                viewRecord(record.row);
              }}
            >
              <Button size="small" className={styles.click} variant="outlined">
                Document Verification
              </Button>
            </IconButton>
          </>
        );
      },
    },
  ];

  // Row

  return (
    // <Paper
    //   sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
    // >
    //   <Grid item>
    //     <div style={{ display: "flex", justifyContent: "right" }}>
    //       <Button
    //         // type="primary"
    //         variant="contained"
    //         onClick={() =>
    //           router.push(
    //             `/FireBrigadeSystem/transactions/revisedBuildingNoc/form`
    //           )
    //         }
    //       >
    //         {/* <FormattedLabel id="add" /> */}
    //         Add
    //       </Button>
    //     </div>
    //   </Grid>
    //   <DataGrid
    //     disableColumnFilter
    //     disableColumnSelector
    //     // disableToolbarButton
    //     disableDensitySelector
    //     components={{ Toolbar: GridToolbar }}
    //     componentsProps={{
    //       toolbar: {
    //         showQuickFilter: true,
    //         quickFilterProps: { debounceMs: 500 },
    //         printOptions: { disableToolbarButton: true },
    //         // disableExport: true,
    //         // disableToolbarButton: true,
    //         csvOptions: { disableToolbarButton: true },
    //       },
    //     }}
    //     // initialState={{
    //     //   pinnedColumns: { right: ["actions"] },
    //     // }}
    //     autoHeight
    //     sx={{
    //       marginLeft: 5,
    //       marginRight: 5,
    //       marginTop: 5,
    //       marginBottom: 5,
    //     }}
    //     rows={dataSource}
    //     columns={columns}
    //     pageSize={5}
    //     rowsPerPageOptions={[5]}

    //     //checkboxSelection
    //   />
    // </Paper>
    <>
      <Box style={{ display: "flex", marginTop: "2%" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            <Typography
              sx={{
                color: "white",
                padding: "2%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
              }}
            >
              {<FormattedLabel id="finalBuildingNoc" />}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box style={{ height: 400, width: "100%" }}>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            paddingLeft: "1%",
            paddingRight: "1%",
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getData(_data, data.page);
          }}
        />
      </Box>
    </>
  );
};

export default Index;
