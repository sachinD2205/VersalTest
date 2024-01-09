import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import { flexbox, Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import Form from "../../../pages/FireBrigadeSystem/transactions/businessNoc/citizen/form";
import urls from "../../../URLS/urls";
import UploadButton1 from "../../fileUpload/UploadButton1";
import VerificationOfDocument from "./VerificationOfDocument";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SiteVisit from "./SiteVisit";
import HistoryComponent from "./HistoryComponent";
import Loader from "../../../containers/Layout/components/Loader";
import moment from "moment";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

//  Verification Application Details
const ApplicantBasicDetails = (props) => {
  // const methods = useForm();
  const methods = useForm();
  const {
    control,
    getValues,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
  } = methods;
  const userToken = useGetToken();

  const language = useSelector((state) => state.labels.language);

  console.log("language", language);

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  // document upload
  const [letterToApplicant, setLetterToApplicant] = useState(null);
  const [locationMap, setLocationMap] = useState(null);
  const [permissionFromLandOwner, setPermissionFromLandOwner] = useState(null);
  const [refellingCertificate, setRefellingCertificate] = useState(null);
  const [trainFirePersonList, setTrainFirePersonList] = useState(null);
  const [structuralStabilityCertificate, setStructuralStabilityCertificate] =
    useState(null);
  const [electrialInspectorCertificate, setElectrialInspectorCertificate] =
    useState(null);

  // Form Preview - ===================>
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  useEffect(() => {
    getserviceNames();
    getBusinessTypes();
  }, []);

  const [serviceNames, setServiceNames] = useState([]);

  // getserviceNames
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setServiceNames(
          r.data.service.map((row) => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceNameMr: row.serviceNameMr,
          }))
        );
      });
  };

  const [businessTypes, setBusinessTypes] = useState([]);

  // getBusinessTypes
  const getBusinessTypes = () => {
    setLoad(true);

    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setLoad(false);

        setBusinessTypes(
          r.data
          // r.data.service.map((row) => ({
          //   id: row.id,
          //   serviceName: row.serviceName,
          //   serviceNameMr: row.serviceNameMr,
          // }))
        );
      });
  };

  useEffect(() => {
    setLoad(true);

    reset(props?.props);
    setLoad(false);

    console.log("propssdflsdjf", props?.props?.hotelDTLDao);
    // if (props?.props?.hotelDTLDao?.isStarHotel == 1) {
    //   setValue("starHotel", props?.props?.hotelDTLDao?.starHotel);
    // }
  }, []);

  console.log("getValues", props?.props?.id);

  return (
    <>
      <Box>
        <FormProvider {...methods}>
          <h3 style={{ textAlign: "center" }}>Applicant Basic Details</h3>
          {/* <h3 style={{ textAlign: "center" }}>Application Form</h3> */}

          <br />
          <Paper sx={{ p: 3, pt: 5, backgroundColor: "#F2F3F4" }}>
            {load ? (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={load}
                onClick={handleLoad}
              >
                Loading....
                <CircularProgress color="inherit" />
              </Backdrop>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={4.5} md={4.5} xl={4.5} lg={4.5} sm={4.5}>
                  <TextField
                    variant="outlined"
                    size="small"
                    sx={{
                      width: "80%",
                      // marginLeft: "6%",
                      backgroundColor: "white",
                    }}
                    id="standard-basic"
                    label={<FormattedLabel id="applicationNumber" />}
                    // disabled
                    // defaultValue='23848494848'
                    {...register("applicationNo")}
                    error={!!errors.applicationNo}
                    helperText={
                      errors?.applicationNo
                        ? errors.applicationNo.message
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={3.5} md={3.5} xl={3.5} lg={3.5} sm={3.5}>
                  <FormControl
                    error={!!errors.applicationDate}
                    sx={{ marginTop: "-1px" }}
                  >
                    <Controller
                      control={control}
                      name="applicationDate"
                      defaultValue={Date.now()}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            // disabled
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="applicationDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                sx={{ backgroundColor: "white" }}
                                variant="outlined"
                                {...params}
                                size="small"
                                fullWidth
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.applicationDate
                        ? errors.applicationDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                  <FormControl
                    size="small"
                    error={!!errors.serviceName}
                    variant="outlined"
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="businessType" />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          variant="outlined"
                          size="small"
                          // disabled={inputState}
                          autoFocus
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="businessType" />}
                          id="demo-simple-select-standard"
                          labelId="id='demo-simple-select-standard-label'"
                          sx={{ backgroundColor: "white", width: "60vh" }}
                        >
                          {businessTypes &&
                            businessTypes.map((businessType, index) => (
                              <MenuItem key={index} value={businessType.id}>
                                {language == "en"
                                  ? businessType?.typeOfBusiness
                                  : businessType?.typeOfBusinessMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="typeOfBusiness"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.businessType
                        ? errors.businessType.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Paper>
        </FormProvider>
      </Box>
    </>
  );
};

export default ApplicantBasicDetails;

// new

// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import React, { useEffect, useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { useSelector } from "react-redux";
// // import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel.js";
// import axios from "axios";
// import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// // import UploadButtonOP from "../../../components/fileUpload/DocumentsUploadOP.js";
// import UploadButtonOP from "../../../components/fileUpload/DocumentsUploadOP";
// // import Loader from "../../../../../containers/Layout/components/Loader/index.js";
// import Loader from "../../../containers/Layout/components/Loader/index";

// import urls from "../../../URLS/urls";

// const Document = () => {
//   const {
//     control,
//     register,
//     reset,
//     getValues,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useFormContext();

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     getDocuments();
//   }, []);

//   const getDocuments = () => {
//     axios
//       .get(
//         `${urls.FbsURL}/businessAndServiceMapping/getAllServiceWiseCheckList?typeOfBusinessId=4`
//       )
//       .then((res) => {
//         console.log(
//           "res?.data?.serviceWiseChecklist",
//           res?.data?.serviceWiseChecklist
//         );
//         setValue(
//           "attachmentss",
//           res?.data?.serviceWiseChecklist?.map((r, ind) => {
//             return {
//               ...r,
//               docKey: r.document,
//               id: null,
//               status: r.isDocumentMandetory ? "Mandatory" : "Not Mandatory",
//               srNo: ind + 1,
//               filePath: null,

//               // id: null,
//               // isDocumentMandetory: r?.isDocumentMandetory
//               //   ? "Mandatory"
//               //   : "Not Mandatory",
//               // department: r?.department,
//               // service: r?.service,
//               // document: r?.document,
//               // documentChecklistEn: r?.documentChecklistEn,
//               // documentChecklistMr: r?.documentChecklistMr,
//               // documentType: r?.documentType,
//               // usageType: r?.usageType,
//               activeFlag: r?.activeFlag,
//             };
//           })
//         );
//         // setAttachment("attachments", res?.data?.serviceWiseChecklist);
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     setIsLoading(false);
//     console.log("attachmentssafterupdate", watch("attachmentss"));
//   }, [watch("attachmentss")]);
//   // }, []);

//   const language = useSelector((state) => state.labels.language);

//   let appName = "FBS";

//   let serviceName = "BusinessNoc";

//   const columnsF = [
//     {
//       field: "srNo",
//       headerName: <FormattedLabel id='srNo' />,
//       width: 70,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: language == "en" ? "documentChecklistEn" : "documentChecklistMr",
//       headerName: "Document Name",
//       flex: 4,
//       headerAlign: "center",
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       flex: 1,
//       width: 30,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "actions",
//       headerName: "Upload Document",
//       flex: 2,
//       // headerAlign: "center",
//       // align: "center",
//       sortable: false,
//       disableColumnMenu: true,
//       renderCell: (params) => {
//         return (
//           <>
//             <UploadButtonOP
//               // error={!!errors?.advirtiseMentInDocx}
//               appName={appName}
//               serviceName={serviceName}
//               fileDtl={getValues(
//                 `attachmentss[${params.row.srNo - 1}].filePath`
//               )}
//               fileKey={params.row.srNo - 1}
//               showDel={true}
//             />
//             {/*  */}
//           </>
//         );
//       },
//     },
//   ];

//   return (
//     <>
//       {/* <Grid
//         style={{
//           backgroundColor: "#0084ff",
//           color: "white",
//           fontSize: 19,
//           padding: 8,
//           paddingLeft: 30,
//           // marginLeft: "40px",
//           // marginRight: "65px",
//           borderRadius: 100,
//         }}
//       >
//         Documents Upload
//       </Grid> */}
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <DataGrid
//           style={{
//             marginTop: 30,
//             marginBottom: 30,
//           }}
//           getRowId={(row) => row.srNo}
//           disableColumnFilter
//           disableColumnSelector
//           disableDensitySelector
//           disableExport
//           hideFooter
//           components={{ Toolbar: GridToolbar }}
//           autoHeight
//           density='compact'
//           sx={{
//             backgroundColor: "white",

//             boxShadow: 2,
//             border: 1,
//             borderColor: "primary.light",
//             "& .MuiDataGrid-cell:hover": {},
//             "& .MuiDataGrid-row:hover": {
//               backgroundColor: "#E1FDFF",
//             },
//             "& .MuiDataGrid-columnHeadersInner": {
//               backgroundColor: "#87E9F7",
//             },
//           }}
//           rows={getValues(`attachmentss`) ? getValues(`attachmentss`) : []}
//           columns={columnsF}
//         />
//       )}
//     </>
//   );
// };
// export default Document;
