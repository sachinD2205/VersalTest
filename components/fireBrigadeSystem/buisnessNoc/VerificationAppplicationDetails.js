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
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

//  Verification Application Details
const VerificationAppplicationDetails = (props) => {
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
    // getserviceNames();
    getBusinessTypes();
  }, []);

  // const [serviceNames, setServiceNames] = useState([]);

  // // getserviceNames
  // const getserviceNames = () => {
  //   axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
  //     setServiceNames(
  //       r.data.service.map((row) => ({
  //         id: row.id,
  //         serviceName: row.serviceName,
  //         serviceNameMr: row.serviceNameMr,
  //       }))
  //     );
  //   });
  // };

  const [businessTypes, setBusinessTypes] = useState([]);

  // getBusinessTypes
  const getBusinessTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
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
    reset(props?.props);

    console.log("propssdflsdjf", props?.props?.hotelDTLDao);
    // if (props?.props?.hotelDTLDao?.isStarHotel == 1) {
    //   setValue("starHotel", props?.props?.hotelDTLDao?.starHotel);
    // }
  }, []);

  console.log("getValues", props?.props?.id);

  return (
    <>
      <FormProvider {...methods}>
        <h3 style={{ textAlign: "center" }}>Applicant Basic Details</h3>
        {/* <h3 style={{ textAlign: "center" }}>Application Form</h3> */}

        <br />

        <Paper sx={{ p: 3, pt: 5, backgroundColor: "#F2F3F4" }}>
          <Grid container spacing={2}>
            <Grid item xs={4} md={5} xl={5} lg={5} sm={5}>
              <TextField
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
                  errors?.applicationNo ? errors.applicationNo.message : null
                }
              />
            </Grid>

            <Grid item xs={3} md={3} xl={3} lg={3} sm={3}>
              <FormControl
                error={!!errors.applicationDate}
                sx={{
                  marginRight: 5,
                  backgroundColor: "white",
                }}
                // sx={{ border: "solid 1px yellow" }}
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
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
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

            <Grid item xs={4} sm={12} md={4} lg={4} xl={4}>
              <FormControl size="small" error={!!errors.serviceName}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="businessType" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
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
                  {errors?.businessType ? errors.businessType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <br />
        <br />
        <HistoryComponent appId={props?.props?.id} />
        <br />
        <br />
        {/* <Accordion
          sx={{
            margin: "40px",
            marginLeft: "5vh",
            marginRight: "5vh",
            marginTop: "2vh",
            marginBottom: "2vh",
          }}
          elevation={0}
        >
          <AccordionSummary
            sx={{
              backgroundColor: "#0084ff",
              color: "white",
              textTransform: "uppercase",
              border: "1px solid white",
            }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            backgroundColor='#0070f3'
          >
            <Typography variant='subtitle'>Applicant Form Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Form props={{ ...props?.props, docPriview: true }} />
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            margin: "40px",
            marginLeft: "5vh",
            marginRight: "5vh",
            marginTop: "2vh",
            marginBottom: "2vh",
          }}
          elevation={0}
        >
          <AccordionSummary
            sx={{
              backgroundColor: "#0084ff",
              color: "white",
              textTransform: "uppercase",
              border: "1px solid white",
            }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            backgroundColor='#0070f3'
          >
            <Typography variant='subtitle'>Site Visit</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SiteVisit
              // siteVisitDailogP={setSetVisitDailog}
              appID={getValues("id")}
            />
          </AccordionDetails>
        </Accordion> */}
        {/* View Form and document comment */}
        {/* <Grid container>
          <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
            <Stack
              style={{ display: flexbox, justifyContent: "center" }}
              spacing={3}
              direction={"row"}
            >

              <IconButton
                onClick={() => {
                  console.log("viewFormProps", props?.props);
                  reset(props?.props);

                  setValue("businessTyp", props?.businessTyp);
                  setValue("serviceName", props?.serviceId);
                  setValue("typeOfBusiness", props?.typeOfBusiness);
                  formPreviewDailogOpen();
                }}
              >
                <Button
                  variant='contained'
                  endIcon={<VisibilityIcon />}
                  size='small'
                >
                  View Form
                </Button>
              </IconButton>
         


              <IconButton>
                <Button
                  variant='contained'
                  endIcon={<VisibilityIcon />}
                  size='small'
                  onClick={() => {
                    reset(props?.props);
                    setValue("serviceName", props.serviceId);
                    documentPreviewDailogOpen();
                  }}
                >
                  View Document
                </Button>
              </IconButton>
            </Stack>
          </Grid>
        </Grid> */}
        <h3 style={{ textAlign: "center" }}>Application Form</h3>
        <br />
        <Form props={{ ...props?.props, docPriview: true }} />
        <br />
        <br />
        <h3 style={{ textAlign: "center" }}>Document Verification</h3>
        <br />

        <VerificationOfDocument />
        <br />

        {/** Form Preview Dailog  - OK */}
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
                Preview
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
                      bgcolor: "blue", // theme.palette.primary.main
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
            {/* <Form
              props={{
                ...props?.props,
                docPriview: true,
                businessTyp: props?.typeOfBusiness,
              }}
            /> */}
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
              <Button size="small" onClick={formPreviewDailogClose}>
                Exit
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>

        {/** Document Preview Dailog - OK */}
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={documentPreviewDialog}
          onClose={() => documentPreviewDailogClose()}
        >
          <Paper sx={{ p: 2 }}>
            <CssBaseline />
            <DialogTitle>
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sm={6}
                  lg={6}
                  xl={6}
                  md={6}
                  sx={{
                    display: "flex",
                    alignItem: "left",
                    justifyContent: "left",
                  }}
                >
                  Document Preview
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
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: "black",
                        ":hover": {
                          border: "2px solid black",
                        },
                      }}
                      onClick={() => {
                        documentPreviewDailogClose();
                      }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
            <VerificationOfDocument />

            {/* <DialogContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TableContainer style={{ border: "2px soiid black" }}>
                <Table style={{ border: "2px soiid red" }}>
                  <TableHead
                    stickyHeader={true}
                    sx={{
                      // textDecorationColor: "white",
                      backgroundColor: "#1890ff",
                    }}
                  >
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>Sr.No</h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>Document Name</h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>Mandatory</h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>View Document</h3>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>1 </TableCell>
                      <TableCell>
                        {" "}
                        Letter to Applicant by Police inspector, Licence Branch,
                        Vadodra City
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName='FBS'
                          serviceName='businessNoc'
                          filePath={setLetterToApplicant}
                          fileName={getValues("letterToApplicant")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2 </TableCell>
                      <TableCell>
                        Location Map / Internal Drawing with Entry or Exit with
                        measurement
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName='FBS'
                          serviceName='businessNoc'
                          filePath={setLocationMap}
                          fileName={getValues("locationMap")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3</TableCell>
                      <TableCell> Permission From Land Owner</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName='FBS'
                          serviceName='businessNoc'
                          filePath={setPermissionFromLandOwner}
                          fileName={getValues("permissionFromLandOwner")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>4</TableCell>
                      <TableCell>
                        Refelling Certificate of Fire Fightning equipments
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName='FBS'
                          serviceName='businessNoc'
                          filePath={setRefellingCertificate}
                          fileName={getValues("refellingCertificate")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>5</TableCell>
                      <TableCell>
                        Train Fire Persion List with their Name & Mobile
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName='FBS'
                          serviceName='businessNoc'
                          filePath={setTrainFirePersonList}
                          fileName={getValues("trainFirePersonList")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>6</TableCell>
                      <TableCell>
                        Structural Stability Certificate From PWD Department
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName='FBS'
                          serviceName='businessNoc'
                          filePath={setStructuralStabilityCertificate}
                          fileName={getValues("structuralStabilityCertificate")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>7</TableCell>
                      <TableCell>Electrical Inspector Certificate</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName='FBS'
                          serviceName='Business Noc'
                          filePath={setElectrialInspectorCertificate}
                          fileName={getValues("otherDocumentPhoto")}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent> */}
            {/**
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Stack
                direction='row'
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant='contained' onClick={approveButton}>
                  Approve
                </Button>
                <Button variant='contained' onClick={revertButton}>
                  Revert
                </Button>
              </Stack>
            </Grid>
          </Grid>
           */}
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
                  sx={{ marginRight: 2 }}
                  size="small"
                  variant="contained"
                  onClick={documentPreviewDailogClose}
                >
                  Ok
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={documentPreviewDailogClose}
                >
                  Exit
                </Button>
              </Grid>
            </DialogTitle>
          </Paper>
        </Dialog>
      </FormProvider>
    </>
  );
};

export default VerificationAppplicationDetails;

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
