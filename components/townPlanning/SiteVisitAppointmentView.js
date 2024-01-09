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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import SiteVisitSchedule from "../../../components/streetVendorManagementSystem/components/SiteVisitSchedule";
import theme from "../../../theme";
import SiteVisitAppointmentViewSchema from "../schema/SiteVisitAppointmentViewSchema";

const SiteVisitAppointmentView = ({ selectedEventData }) => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(SiteVisitAppointmentViewSchema),
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
  let user = useSelector((state) => state.user.user);
  // serviceNames
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (
          r?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            })),
          );
        } else {
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    localStorage.removeItem("applicationId");
    getserviceNames();
  }, []);

  useEffect(() => {
    console.log("siteVisitAppointmentViewProps", selectedEventData);
    reset(selectedEventData);
  }, [selectedEventData, serviceNames]);

  // view
  return (
    <div>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <Grid container>
            <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="departmentName" />}
                disabled
                defaultValue=""
                {...register("deptName")}
                error={!!errors.deptName}
                helperText={errors?.deptName ? errors.deptName.message : null}
              />
            </Grid>
            <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
              <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="serviceName" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: "50vh" }}
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
                  errors?.applicantName ? errors.applicantName.message : null
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
                label={<FormattedLabel id="mobile" />}
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
                  errors?.siteVisitTime ? errors?.siteVisitTime?.message : null
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
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "issuanceOfHawkerLicenseId",
                  watch("applicationId"),
                );
                router.push(
                  `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/SiteVisit`,
                );
              }}
            >
              <Button variant="contained" size="small">
                {<FormattedLabel id="siteVisit" />}
              </Button>
            </IconButton>
            <IconButton
              onClick={() => {
                // reset(record.row);
                setValue("serviceName", watch("serviceName"));
                siteVisitScheduleOpen();
              }}
            >
              <Button variant="contained" size="small">
                Site Visit Reschedule
              </Button>
            </IconButton>
            <IconButton
              onClick={() => {
                // localStorage.setItem("issuanceOfHawkerLicenseId", watch("applicationId"));
                router.push(`/streetVendorManagementSystem`);
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
  );
};

export default SiteVisitAppointmentView;
