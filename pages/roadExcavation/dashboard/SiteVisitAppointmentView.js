import {
    Box,
    Button,
    CssBaseline,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Stack,
    TextField,
    ThemeProvider,
  } from "@mui/material";
  import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
  import React from "react";
  import { useEffect, useState } from "react";
  import { Controller, FormProvider, useForm } from "react-hook-form";
  import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
  import { useSelector } from "react-redux";
  import axios from "axios";
  import urls from "../../../URLS/urls";
  import { yupResolver } from "@hookform/resolvers/yup";
//   import SiteVisitAppointmentViewSchema from "../schema/SiteVisitAppointmentViewSchema";
  import theme from "../../../theme";
  import SiteVisitSchedule from "../transaction/roadExcevationForms/siteVisitScedule";
  import { useRouter } from "next/router";
  import Loader from "../../../containers/Layout/components/Loader";
  import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
  
  const SiteVisitAppointmentView = ({ selectedEventData }) => {
    const methods = useForm({
      criteriaMode: "all",
    //   resolver: yupResolver(SiteVisitAppointmentViewSchema),
      mode: "onChange",
    });
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
    
    const router = useRouter();
    const userToken = useGetToken();
    const language = useSelector((state) => state?.labes?.language);
    // site Schedule Modal
    const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);
    const siteVisitScheduleOpen = () => setSiteVisitScheduleModal(true);
    const siteVisitScheduleClose = () => setSiteVisitScheduleModal(false);
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
    // serviceNames
    const getserviceNames = () => {
      const url = `${urls.CFCURL}/master/service/getAll`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setServiceNames(
              r?.data?.service.map((row) => ({
                id: row?.id,
                serviceName: row?.serviceName,
                serviceNameMr: row?.serviceNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    };
  
   
   
    //! ================= useEffect ===============>
  
    useEffect(() => {
      // setValue("loadderState",true);
      // loadderSetTimeOutFunction();
      localStorage.removeItem("applicationId");
      getserviceNames();
    }, []);
  
    console.log("siteVisitAppointmentViewProps", selectedEventData,"dfgdgh",selectedEventData.deptName);
    useEffect(() => {
      reset(selectedEventData);
    }, [selectedEventData, serviceNames]);
  
    // view
    return (
      <>
        {watch("loadderState") ? (
          <Loader />
        ) : (
          <div>
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <Grid container>
                  <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="applicationName" />}
                      disabled
                      defaultValue=""
                      {...register("deptName")}
                      error={!!errors.deptName}
                      helperText={
                        errors?.deptName ? errors.deptName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                    <FormControl
                      error={!!errors.serviceName}
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="serviceName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "50vh" }}
                            disabled
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
                                  {language == "en"
                                    ? serviceName?.serviceName
                                    : serviceName?.serviceNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="serviceName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.serviceName ? errors.serviceName.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                    <TextField
                      id="standard-basic"
                      sx={{ width: "50vh" }}
                      label={<FormattedLabel id="applicationNumber" />}
                      disabled
                      defaultValue=""
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
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="applicantName" />}
                      disabled
                      defaultValue=""
                      {...register("applicantName")}
                      error={!!errors.applicantName}
                      helperText={
                        errors?.applicantName
                          ? errors.applicantName.message
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
                              defaultValue={null}
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
                      label={<FormattedLabel id="emailAddress" />}
                      disabled
                      defaultValue=""
                      {...register("emailAddress")}
                      error={!!errors.emailAddress}
                      helperText={
                        errors?.emailAddress ? errors.emailAddress.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="mobileNo" />}
                      disabled
                      defaultValue=""
                      {...register("mobile")}
                      error={!!errors.mobile}
                      helperText={errors?.mobile ? errors.mobile.message : null}
                    />
                  </Grid>
  
                  <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                    <FormControl
                      error={!!errors?.siteVisitDate}
                      sx={{ marginTop: 0 }}
                      // sx={{ border: "solid 1px yellow" }}
                    >
                      <Controller
                        control={control}
                        name="siteVisitDate"
                        defaultValue={Date.now()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="siteVisitDate" />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(moment(date).format("YYYY-MM-DD"))
                              }
                              selected={field.value}
                              center
                              defaultValue={null}
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
                        {errors?.siteVisitDate
                          ? errors?.siteVisitDate?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="siteVisitTime" />}
                      disabled
                      defaultValue=""
                      {...register("siteVisitTime")}
                      error={!!errors?.siteVisitTime}
                      helperText={
                        errors?.siteVisitTime
                          ? errors?.siteVisitTime?.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <br />
                <Stack
                  style={{ display: "flex", justifyContent: "center" }}
                  spacing={3}
                  direction={"row"}
                >
                  {/* <IconButton
                    onClick={() => {
                      // issuance
                      if (watch("serviceName") == 24) {
                        localStorage.setItem(
                          "issuanceOfHawkerLicenseId",
                          watch("applicationId")
                        );
                      }
                      // renewal
                      else if (watch("serviceName") == 25) {
                        localStorage.setItem(
                          "renewalOfHawkerLicenseId",
                          watch("applicationId")
                        );
                      }
                      // cancellation
                      else if (watch("serviceName") == 27) {
                        localStorage.setItem(
                          "cancellationOfHawkerLicenseId",
                          watch("applicationId")
                        );
                      }
                      // transfer
                      else if (watch("serviceName") == 26) {
                        localStorage.setItem(
                          "transferOfHawkerLicenseId",
                          watch("applicationId")
                        );
                      }
  
                      router.push(
                        `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/SiteVisit`
                      );
                    }}
                  >
                    <Button variant="contained" size="small">
                      {<FormattedLabel id="siteVisit" />}
                    </Button>
                  </IconButton> */}
                  <IconButton
                    onClick={() => {
                      // router.push("/roadExcavation/transaction/roadExcevationForms/siteVisitScedule")
                      selectedEventData.deptName=="Road Excavation NOC Permission Maintenance"
                      ? router.push({
                        pathname:
                          "/roadExcavation/transaction/roadExcevationForms/siteVisitScedule",
                        query: {
                          id:watch("id"),
                          pageMode:"Maintaince"
                        },
                      })
                    : router.push({
                        pathname:
                          "/roadExcavation/transaction/roadExcevationForms/siteVisitScedule",
                        query: {
                          id:watch("applicationId")
                        },
                      });
                    }}
                  >
                    <Button variant="contained" size="small">
                    {<FormattedLabel id="siteVisitReschedule" />}
                     
                    </Button>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      router.push(`/roadExcavation/dashboard/siteVisitDashboard`);
                    }}
                  >
                    <Button
                      style={{ backgroundColor: "red" }}
                      variant="contained"
                      size="small"
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </IconButton>
                </Stack>
  
                {/** Site Visit Schedule Modal OK*/}
                <Modal
                  open={siteVisitScheduleModal}
                  onClose={() => siteVisitScheduleClose()}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 5,
                  }}
                >
                  <Paper
                    sx={{
                      // backgroundColor: "#F5F5F5",
                      padding: 2,
                      height: "600px",
                      width: "500px",
                      // display: "flex",
                      // alignItems: "center",
                      // justifyContent: "center",
                    }}
                    elevation={5}
                    component={Box}
                  >
                    <CssBaseline />
                    <SiteVisitSchedule
                      appID={watch("applicationId")}
                      serviceId={watch("serviceName")}
                    />
                    <Grid container>
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
                          onClick={() => siteVisitScheduleClose()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Modal>
              </FormProvider>
            </ThemeProvider>
          </div>
        )}
      </>
    );
  };
  
  export default SiteVisitAppointmentView;
  