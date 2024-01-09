import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  TextField
} from "@mui/material";
import { Stack, flexbox } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFormContext
} from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import BookingDetail from "../components/BookingDetail";
import EcsDetails from "../components/EcsDetails";
import PersonalDetailsForSports from "../components/PersonalDetailsForSports";
import FileTableVerification from "../components/fileTableSports/FileTableVerification";
import Loader from "../../../../containers/Layout/components/Loader";

//  Verification Application Details
const VerificationGroundBooking = (props) => {
  // const methods = useForm();
  const language = useSelector((state) => state?.labes?.language);
  const userToken = useGetToken();
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
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [loadderState, setLoadderState] = useState()
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

  // Form Preview - ===================>
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  const [applicationData, setApplicationData] = useState();

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  // getserviceNames
  const getserviceNames = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },

    }).then((r) => {
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceName: row.serviceName,
          serviceNameMr: row.serviceNameMr,
        }))
      );
    }).catch((error) => {
      setValue("loadderState", false);
      callCatchMethod(error, language);
    });;
  };
  const user = useSelector((state) => state?.user?.user);

  //!==========================> useEffect

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


  //!===================== view
  return (

    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div>
          <FormProvider {...methods}>
            <Grid container>
              <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                <TextField
                  id="standard-basic"
                  sx={{ width: 250 }}
                  // label="Application Number"
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

              <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="serviceName" />}
                  disabled
                  defaultValue="Ground Booking"
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
                      setValue("serviceName", props?.serviceId);
                      formPreviewDailogOpen();
                    }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<VisibilityIcon />}
                      size="small"
                    >
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
                        setValue("serviceName", props?.serviceId);
                        documentPreviewDailogOpen();
                      }}
                    >
                      {/* View Document */}
                      <FormattedLabel id="viewDocument" />
                    </Button>
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
                          setApplicationData(props?.row);
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent>
                <BookingDetail readOnly />;
                <PersonalDetailsForSports readOnly />;
                <EcsDetails readOnly />;
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
            <Dialog
              fullWidth
              maxWidth={"xl"}
              open={documentPreviewDialog}
              onClose={() => {
                documentPreviewDailogClose();
              }}
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

                        setLoadderState(true);
                        const _AA = watch("attachmentList")?.filter(
                          (obj) =>
                            obj?.docStatus !== null && obj?.docStatus !== ""
                        );

                        // 
                        if (_AA?.length !== watch("attachmentList")?.length) {
                          setLoadderState(false)
                          language == "en" ? sweetAlert("please select action approve or reject for all documents") : sweetAlert("कृपया सर्व कागदपत्रांसाठी कृती मंजूर किंवा नाकारणे निवडा");
                        }
                        // 
                        else {
                          //
                          if (_AA?.find((obj) => obj?.docStatus === "Reject")) {
                            setValue("docsRevert", "YES");
                            setValue("approveBtnState", "DISABLE");

                          } else {
                            setValue("approveBtnState", "ENABLE");

                          }


                          setLoadderState(false)
                          documentPreviewDailogClose();
                        }

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
        </div>
      )}
    </>
  );
};

export default VerificationGroundBooking;
