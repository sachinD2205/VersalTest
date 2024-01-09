import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { Stack, ThemeProvider } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Typography } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";

const LoiCollectionComponent = () => {
  const {
    setValue,
    getValues,
    methods,
    register,
    control,
    formState: { errors },
  } = useForm();
  const language = useSelector((state) => state?.labels.language);
  // Pay
  const pay = () => {};

  const [licenseTypes, setLicenseTypes] = useState([]);

  const getLicenseTypes = () => {
    axios.get(`${urls.HMSURL}/licenseValidity/getAll`).then((r) => {
      setLicenseTypes(
        r.data.licenseValidity.map((row) => ({
          id: row.id,
          licenseType: row.licenseType,
          licenseTypeMr: row.licenseTypeMr,
        }))
      );
    });
  };

  // title
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CfcURLMaster}/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        }))
      );
    });
  };

  const [serviceNames, setServiceNames] = useState([]);
  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CfcURLMaster}/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            }))
          );
        } else {
          message.error("Filed To Load !! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.success("Error !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios.get(`${urls.HMSURL}/paymentTypes/getAll`).then((r) => {
      setPaymentTypes(
        r.data.paymentType.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
          paymentTypeMr: row.paymentTypeMr,
        }))
      );
    });
  };

  const [serviceCharges, setServiceCharges] = useState([]);

  const getServiceCharges = () => {
    axios.get(`${urls.HMSURL}/servicecharges/getAll`).then((r) => {
      setServiceCharges(
        r.data.serviceCharge.map((row) => ({
          id: row.id,
          serviceChargeType: row.serviceChargeType,
          charge: row.charge,
          amount: row.amount,
        }))
      );
    });
  };
  const [paymentModes, setPaymentModes] = useState([]);

  const getPaymentModes = () => {
    axios.get(`${urls.HMSURL}/paymentTypes/getAll`).then((r) => {
      setPaymentModes(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        }))
      );
    });
  };

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getserviceNames();
    getTitles();
    getServiceCharges();
  }, []);

  // view
  return (
    <>
      <div>
        {/* <ThemeProvider theme={theme}> */}
        <ThemeProvider>
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              // marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "40px",
              borderRadius: 100,
            }}
          >
            <strong>{<FormattedLabel id="loiCollection" />}</strong>
          </div>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: "15px",
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <TextField
                label={<FormattedLabel id="applicationNumber" />}
                {...register("applicationNumber")}
                error={!!errors.applicationNumber}
                helperText={
                  errors?.applicationNumber
                    ? errors.applicationNumber.message
                    : null
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
                marginTop: "20px",
              }}
            >
              <Typography variant="h1">
                <strong>
                  <FormattedLabel id="or" />
                </strong>
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              {/** <Paper sx={{ backgroundColor: "#F5F5F5" }}>  </Paper>*/}

              <Stack spacing={12} direction="row">
                <TextField
                  label={<FormattedLabel id="loiNO" />}
                  {...register("loiNO1")}
                  error={!!errors.loiNO}
                  helperText={errors?.loiNO ? errors.loiNO.message : null}
                />
                <FormControl
                  sx={{ marginTop: 0 }}
                  error={!!errors.applicationDate}
                >
                  <Controller
                    name="loiDate"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16, marginTop: 2 }}>
                              <FormattedLabel id="loiDate" />
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
                    {errors?.loiDate ? errors.loiDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <Button variant="contained" sx={{ marginTop: "20px" }}>
                <FormattedLabel id="search"></FormattedLabel>
              </Button>
            </Grid>
          </Grid>

          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "40px",
              borderRadius: 100,
            }}
          >
            <strong>{<FormattedLabel id="applicantDetails" />}</strong>
          </div>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="serviceNames" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "230px", width: "500px" }}
                      // // dissabled={inputState}
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
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                label="Application No."
                {...register("applicationNumber ")}
                error={!!errors.applicationNumber}
                helperText={
                  errors?.applicationNumber
                    ? errors.applicationNumber.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl
                sx={{ marginTop: 0 }}
                error={!!errors.applicationDate}
              >
                <Controller
                  name="applicationDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16, marginTop: 2 }}>
                            Application Date
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
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="title" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "230px" }}
                      // disabled={inputState}
                      autoFocus
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="title" />}
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      {titles &&
                        titles.map((title, index) => (
                          <MenuItem key={index} value={title.id}>
                            {language == "en" ? title?.title : title?.titleMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="title"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.title ? errors.title.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="fname" />}
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="mname" />}
                {...register("middleName")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="lname" />}
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors?.lastName ? errors.lastName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="email" />}
                {...register("emailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="mobile" />}
                {...register("mobile")}
                error={!!errors.mobile}
                helperText={errors?.mobile ? errors.mobile.message : null}
              />
            </Grid>
          </Grid>

          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "40px",
              borderRadius: 100,
            }}
          >
            <strong>{<FormattedLabel id="loiDetails" />}</strong>
          </div>

          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <TextField
                label={<FormattedLabel id="loiNO" />}
                {...register("loiNO")}
                error={!!errors.loiNO}
                helperText={errors?.loiNO ? errors.loiNO.message : null}
              />
            </Grid>

            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl
                sx={{ marginTop: 0 }}
                error={!!errors.applicationDate}
              >
                <Controller
                  name="loiDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16, marginTop: 2 }}>
                            <FormattedLabel id="loiDate" />
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
                  {errors?.loiDate ? errors.loiDate.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.licenseType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="durationOfLicenseValidity" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="durationOfLicenseValidity" />}
                    >
                      {licenseTypes &&
                        licenseTypes.map((licenseType, index) => (
                          <MenuItem key={index} value={licenseType.id}>
                            {licenseType.licenseType}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="licenseType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.licenseType ? errors.licenseType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.serviceCharge}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="serviceCharge" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "230px" }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="serviceCharge" />}
                    >
                      {serviceCharges &&
                        serviceCharges.map((serviceCharge, index) => (
                          <MenuItem key={index} value={serviceCharge.id}>
                            {serviceCharge.serviceChargeType}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="serviceCharge"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.serviceCharge ? errors.serviceCharge.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <TextField
                label={<FormattedLabel id="rate" />}
                {...register("rate")}
                error={!!errors.rate}
                helperText={errors?.rate ? errors.rate.message : null}
              />
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <TextField
                label={<FormattedLabel id="amount" />}
                {...register("amount")}
                error={!!errors.amount}
                helperText={errors?.amount ? errors.amount.message : null}
              />
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <TextField
                label={<FormattedLabel id="total" />}
                {...register("total")}
                error={!!errors.total}
                helperText={errors?.total ? errors.total.message : null}
              />
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <TextField
                label={<FormattedLabel id="totalInWords" />}
                {...register("totalInWords")}
                error={!!errors.totalInWords}
                helperText={
                  errors?.totalInWords ? errors.totalInWords.message : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl flexDirection="row">
                <FormLabel
                  sx={{ width: "230px" }}
                  id="demo-row-radio-buttons-group-label"
                >
                  {<FormattedLabel id="durationOfLicenseValidity" />}
                </FormLabel>

                <Controller
                  name="durationOfLicenseValidity"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      // disabled={inputState}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        value="financial Year"
                        // disabled={inputState}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="financialYear" />}
                        error={!!errors.durationOfLicenseValidity}
                        helperText={
                          errors?.durationOfLicenseValidity
                            ? errors.durationOfLicenseValidity.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="calendar year"
                        // disabled={inputState}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="calendarYear" />}
                        error={!!errors.durationOfLicenseValidity}
                        helperText={
                          errors?.durationOfLicenseValidity
                            ? errors.durationOfLicenseValidity.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="date of issuance"
                        // disabled={inputState}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="dateOfIssuance" />}
                        error={!!errors.durationOfLicenseValidity}
                        helperText={
                          errors?.durationOfLicenseValidity
                            ? errors.durationOfLicenseValidity.message
                            : null
                        }
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "40px",
              borderRadius: 100,
            }}
          >
            <strong>
              <FormattedLabel id="receiptModeDetails" />
            </strong>
          </div>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl error={!!errors.paymentType} sx={{ marginTop: 0 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="paymentType" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "230px" }}
                      // // dissabled={inputState}
                      autoFocus
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=<FormattedLabel id="paymentType" />
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      {paymentTypes &&
                        paymentTypes.map((paymentType, index) => (
                          <MenuItem key={index} value={paymentType.id}>
                            {language == "en"
                              ? paymentType?.paymentType
                              : paymentType?.paymentTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="paymentType"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl error={!!errors.paymentMode} sx={{ marginTop: 0 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="paymentMode" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "230px" }}
                      // // dissabled={inputState}
                      autoFocus
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="paymentMode" />}
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      {paymentModes &&
                        paymentModes.map((paymentMode, index) => (
                          <MenuItem key={index} value={paymentMode.id}>
                            {language == "en"
                              ? paymentMode?.paymentMode
                              : paymentMode?.paymentModeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="paymentMode"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </>
  );
};

export default LoiCollectionComponent;
