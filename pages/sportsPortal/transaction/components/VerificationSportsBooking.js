import {
  Button,
  Checkbox,
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
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import {
  useForm,
  useFormContext,
  Controller,
  FormProvider,
} from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import axios from "axios";
import { useSelector } from "react-redux";
import { flexbox, Stack } from "@mui/system";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UploadButton1 from "../../../../components/fileUpload/UploadButton1";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import BookingDetails from "./BookingDetails";
import PersonalDetailsForSports from "./PersonalDetailsForSports";
// import FileTableVerification from "../../../../../components/townPlanning/fileTablefire/FileTableVerification";
import FileTableVerification from "./fileTableSports/FileTableVerification";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// import OwnerDetail from "./OwnerDetail";

//  Verification Application Details
const VerificationSportsBooking = (props) => {
  // const methods = useForm();
  const methods = useFormContext();
  const {
    control,
    getValues,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
  } = methods;
  const [serviceNames, setServiceNames] = useState([]);
  const language = useSelector((state) => state?.labes?.language);
  const [panCard, setpanCard] = useState(null);
  // const [idCard, setIdcard] = useState(null);
  const [medicalCertificate, setmedicalCertificate] = useState(null);
  const [idCard, setPassportPhoto] = useState(null);
  const [aadharCard, setaadharCard] = useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  // Form Preview - ===================>
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  const [applicationData, setApplicationData] = useState();

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);
  const token = useSelector((state) => state.user.user.token);
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
  // getserviceNames
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const user = useSelector((state) => state?.user.user);

  useEffect(() => {
    setValue("title", user.title);
    setValue("firstName", user.firstName);
    setValue("middleName", user.middleName);
    setValue("lastName", user.surname);
    setValue("gender", user.gender);
    setValue("mobileNo", user.mobile);
    setValue("emailAddress", user.emailID);

    setValue(
      "cAddress",
      user.cflatBuildingNo +
        "," +
        user.cbuildingName +
        "," +
        user.croadName +
        "," +
        user.clandmark
    );
    setValue("cCityName", user.ccity);
    setValue("cPincode", user.cpinCode);
  }, []);

  useEffect(() => {
    getserviceNames();
  }, []);

  useEffect(() => {
    console.log("propssdflsdjf", props);
  }, [props]);

  return (
    <>
      <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="applicationNumber" />}
              disabled
              defaultValue="23848494848"
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            />
          </Grid>
          {/* <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                <TextField
                  id="standard-basic"
                  // label={<FormattedLabel id="applicationNumber" />}
                  label="Application Number"
                  disabled
                  // defaultValue="23848494848"
                  {...register("applicationNo")}
                  error={!!errors.applicationNo}
                  helperText={errors?.applicationNo ? errors.applicationNo.message : null}
                />
              </Grid> */}
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <FormControl
              error={!!errors.applicationDate}
              sx={{ marginTop: 0 }}
              // sx={{ border: "solid 1px yellow" }}
            >
              <Controller
                control={control}
                name="applicationDate"
                defaultValue={Date.now()}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled
                      inputFormat="DD/MM/YYYY"
                      label={<FormattedLabel id="applicationDate" />}
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
          {/* <Grid item xs={4} sm={12} md={4} lg={4} xl={4}>
                <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Service Name
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "50vh" }}
                        disabled={inputState}
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Service Name *"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {serviceNames &&
                          serviceNames.map((serviceName, index) => (
                            <MenuItem key={index} value={serviceName.id}>
                              {language == "en" ? serviceName?.serviceName : serviceName?.serviceNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="serviceName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.serviceName ? errors.serviceName.message : null}</FormHelperText>
                </FormControl>
              </Grid> */}

          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="serviceName" />}
              disabled
              defaultValue="Sports Booking"
              {...register("applicationNo")}
              error={!!errors.applicationNo}
              helperText={
                errors?.applicationNo ? errors.applicationNo.message : null
              }
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
            <Stack
              style={{ display: flexbox, justifyContent: "center" }}
              spacing={3}
              direction={"row"}
            >
              {/** Form Preview Button */}

              <IconButton
                onClick={() => {
                  console.log("viewFormProps", props?.props);
                  reset(props?.props);
                  setValue("serviceName", props.serviceId);
                  formPreviewDailogOpen();
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  size="small"
                >
                  {/* View Form */}
                  <FormattedLabel id="viewForm" />
                </Button>
              </IconButton>

              {/** View Document Button */}

              <IconButton>
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  size="small"
                  onClick={() => {
                    console.log("viewDocument", props?.props);
                    // reset(props?.props);
                    setValue("serviceName", props.serviceId);
                    documentPreviewDailogOpen();
                  }}
                >
                  {/* View Document */}
                  <FormattedLabel id="viewDocument" />
                </Button>

                {/* <Button
                      variant="contained"
                      onClick={() => {
                        documentPreviewDailogOpen();
                      }}
                    >
                      document Preview
                    </Button> */}
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

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
                      console.log("viewFormProps", props?.props);
                      reset(props?.props);
                      setApplicationData(props.row);
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <BookingDetails readOnly />
            <PersonalDetailsForSports readOnly />
            {/* <BookingDetailsGym readOnly />;
            <BookingPersonDetailsGym readOnly />; */}
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
              <Button onClick={formPreviewDailogClose}>Exit</Button>
            </Grid>
          </DialogTitle>
        </Dialog>

        {/** Document Preview Dailog - OK */}
        {/* <Dialog
              fullWidth
              maxWidth={"md"}
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
                          ":hover": {
                            bgcolor: "red", 
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            documentPreviewDailogClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent
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
                          <TableCell style={{ border: "2px soiid black" }}>1 </TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>Aadhar Card</TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>Required</TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>
                            <UploadButton1
                              appName="SP"
                              serviceName="SP-SPORTSBOOKING"
                              filePath={setAadharPhoto}
                              fileName={getValues("aadharPhoto")}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ border: "2px soiid black" }}>2 </TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>Pan Card</TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>Required</TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>
                            <UploadButton1
                              appName="SP"
                              serviceName="SP-SPORTSBOOKING"
                              filePath={setpanCard}
                              fileName={getValues("panCard")}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ border: "2px soiid black" }}>3</TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>Other Document</TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>Required</TableCell>
                          <TableCell style={{ border: "2px soiid black" }}>
                            <UploadButton1
                              appName="SP"
                              serviceName="SP-SPORTSBOOKING"
                              filePath={setotherDocumentPhoto}
                              fileName={getValues("otherDocument")}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                    <Button variant="contained" onClick={documentPreviewDailogClose}>
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Paper>
            </Dialog> */}

        {/** Document Preview Dailog - OK */}
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={documentPreviewDialog}
          onClose={() => {
            documentPreviewDailogClose();
          }}
        >
          {/* <Paper sx={{ p: 2 }}>
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
                        documentPreviewDailogClose();
                      }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead
                    stickyHeader={true}
                    sx={{
                      backgroundColor: "#1890ff",
                    }}
                  >
                    <TableRow>
                      <TableCell style={{ color: "white" }}>sr.no</TableCell>
                      <TableCell style={{ color: "white" }}>
                        <h3>Document Name</h3>
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        <h3>Mandatory</h3>
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        <h3>View Document</h3>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>1 </TableCell>
                      <TableCell>Photo</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="SP"
                          serviceName="SP-SPORTSBOOKING"
                          filePath={setPassportPhoto}
                          fileName={getValues("idCard")}
                        
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2 </TableCell>
                      <TableCell>Aadhaar Card</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="SP"
                          serviceName="SP-SPORTSBOOKING"
                          filePath={setaadharCard}
                          fileName={getValues("aadharCard")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3 </TableCell>
                      <TableCell> Medical Certificate</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="SP"
                          serviceName="SP-SPORTSBOOKING"
                          filePath={setmedicalCertificate}
                          fileName={getValues("medicalCertificate")}
                        />

                        <Controller
                          name="isValidCertificate"
                          control={control}
                          render={({ field: { value, ref, ...field } }) => (
                            <Checkbox
                            
                              {...field}
                              inputRef={ref}
                              checked={!!value}
                              onChange={(e) => {
                                setValue(
                                  "isValidCertificate",
                                  e?.target?.checked
                                );
                                console.log(
                                  "CheckBox Value",
                                  e?.target?.checked
                                );
                              }}
                            />
                          )}
                        />

                        {<b>{<FormattedLabel id="verify" />}</b>}

                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>4 </TableCell>
                      <TableCell>Pan Card </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="SP"
                          serviceName="SP-SPORTSBOOKING"
                          filePath={setpanCard}
                          fileName={getValues("panCard")}
                        />
                      </TableCell>
                    </TableRow>

                   
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <Grid container>
             
            </Grid>
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
                    documentPreviewDailogClose();
                  }}
                >
                  Exit
                </Button>
                </Grid>
                </DialogTitle>
              </Paper> */}
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
                {/* <Grid
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
                  >
                    <CloseIcon
                      sx={{
                        color: "black",
                      }}
                      onClick={() => {
                        documentPreviewDailogClose();
                      }}
                    />
                  </IconButton>
                </Grid> */}
              </Grid>
            </DialogTitle>

            <FileTableVerification />
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
                  style={{ marginRight: 4 }}
                  onClick={() => {
                    // ----------------------------------------------------------------------
                    swal({
                      title: "Save?",
                      text: "Are you sure you want to Save this Record ? ",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete === true) {
                        let _AA = watch("attachmentList")?.filter(
                          (obj) =>
                            obj?.docStatus !== null && obj?.docStatus !== ""
                        );

                        if (_AA?.length !== watch("attachmentList")?.length) {
                          sweetAlert("Please Select All Docs Actions");
                        } else {
                          if (_AA?.find((obj) => obj?.docStatus === "Reject")) {
                            setValue("docsRevert", "YES"),
                              setValue("approveBtnState", "DISABLE");
                          } else {
                            setValue("approveBtnState", "ENABLE");
                          }
                          documentPreviewDailogClose();
                        }
                      }
                    });
                    // ----------------------------------------------------------------------
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    documentPreviewDailogClose();
                  }}
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

export default VerificationSportsBooking;
