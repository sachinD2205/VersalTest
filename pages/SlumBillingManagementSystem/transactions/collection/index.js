import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
// import BasicLayout from "../../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel.js";
// import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/connectionEntrySchema";
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import trnCollectionSchema from "../../../../containers/schema/slumManagementSchema/trnCollectionSchema.js";
import urls from "../../../../URLS/urls.js";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil.js";

const EntryForm = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(trnCollectionSchema),
    mode: "onChange",
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState([]);
  const [meterConnectionDate, setMeterConnectionDate] = useState();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  useEffect(() => {
    getBillingCycle();
  }, []);

  const onSubmitForm = (formData) => {
    console.log("formData", formData);

    const body = {
      ...entryConnectionData,
      ...formData,
      meterConnectionDate,
    };
    let temp = {};
    const tempData = axios.post(`${urls.SLUMURL}/save`, body, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((res) => {
      console.log("res", res);
      if (res.status == 201) {
        router.push(
          "/ElectricBillingPayment/transaction/newConnectionEntry/demandGeneration"
        );
        sweetAlert("Saved!", "Record Saved successfully !", "success");
      } else {
        sweetAlert("Error!", "Something Went Wrong !", "error");
      }
    }).catch((err)=>{
      cfcErrorCatchMethod(err, false);
    });
  };

  // get Billing Cycle
  const getBillingCycle = () => {
    axios.get(`${urls.SLUMURL}/getAll`).then((res) => {
      setBillingCycle(res.data.mstBillingCycleList);
      console.log("getBillingCycle", res.data);
    }).catch((err)=>{
      cfcErrorCatchMethod(err, false);
    });
  };

  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="collection" />
          </h2>
        </Box>

        <Divider />

        <Box
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          <Box p={4}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      style={{ marginTop: 10 }}
                      error={!!errors.trnCollectionDate}
                    >
                      <Controller
                        control={control}
                        name="Meter Connection Date"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="YYYY/MM/DD"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="trnCollectionDate" />}
                                </span>
                              }
                              value={meterConnectionDate}
                              onChange={(date) =>
                                setMeterConnectionDate(
                                  moment(date).format("YYYY-MM-DDThh:mm:ss")
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  sx={{ width: 230 }}
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
                        {errors?.trnCollectionDate
                          ? errors.trnCollectionDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* sanctioned Demand */}

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="serviceName" />}
                      multiline
                      variant="standard"
                      {...register("serviceName")}
                      error={!!errors.serviceName}
                      helperText={
                        errors?.serviceName ? errors.serviceName.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="receiptNo" />}
                      multiline
                      variant="standard"
                      {...register("receiptNo")}
                      error={!!errors.receiptNo}
                      helperText={
                        errors?.receiptNo ? errors.receiptNo.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="collectionCenter" />}
                      multiline
                      variant="standard"
                      {...register("collectionCenter")}
                      error={!!errors.collectionCenter}
                      helperText={
                        errors?.collectionCenter
                          ? errors.collectionCenter.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="counter" />}
                      multiline
                      variant="standard"
                      {...register("counter")}
                      error={!!errors.counter}
                      helperText={
                        errors?.counter ? errors.counter.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="moduleName" />}
                      multiline
                      variant="standard"
                      {...register("moduleName")}
                      error={!!errors.moduleName}
                      helperText={
                        errors?.moduleName ? errors.moduleName.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="userName" />}
                      multiline
                      variant="standard"
                      {...register("userName")}
                      error={!!errors.userName}
                      helperText={
                        errors?.userName ? errors.userName.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{ width: 230 }}
                      error={!!errors.receiptType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="receiptType" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            {...register("receiptType")}
                            label={<FormattedLabel id="receiptType" />}
                          >
                            {billingCycle &&
                              billingCycle.map((cycle, index) => (
                                <MenuItem key={index} value={cycle.id}>
                                  {cycle.billingCycle}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="receiptType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.receiptType
                          ? errors.receiptType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="refernece" />}
                      id="standard-textarea"
                      sx={{ width: 230 }}
                      variant="standard"
                      {...register("refernece")}
                      error={!!errors.refernece}
                      helperText={
                        errors?.refernece ? errors.refernece.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* from date in English */}
                    <FormControl
                      variant="standard"
                      style={{ marginTop: 10 }}
                      error={!!errors.trnCollectionDate}
                    >
                      <Controller
                        // variant="standard"
                        control={control}
                        name="Transaction Date"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="YYYY/MM/DD"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {/* Meter Connection Date */}
                                  {/* Opinion Request Date */}
                                  {<FormattedLabel id="trnCollectionDate" />}
                                </span>
                              }
                              value={meterConnectionDate}
                              onChange={(date) =>
                                setMeterConnectionDate(
                                  moment(date).format("YYYY-MM-DDThh:mm:ss")
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  sx={{ width: 230 }}
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
                        {errors?.trnCollectionDate
                          ? errors.trnCollectionDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="payerName" />}
                      variant="standard"
                      {...register("payerName")}
                      error={!!errors.payerName}
                      helperText={
                        errors?.payerName ? errors.payerName.message : null
                      }
                    />
                  </Grid>
                  {/* Button Row */}

                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="address" />}
                      multiline
                      variant="standard"
                      {...register("address")}
                      error={!!errors.address}
                      helperText={
                        errors?.address ? errors.address.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="narration" />}
                      multiline
                      variant="standard"
                      {...register("narration")}
                      error={!!errors.narration}
                      helperText={
                        errors?.narration ? errors.narration.message : null
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ width: 230 }}
                      error={!!errors.paymentMode}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="paymentMode" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            {...register("paymentMode")}
                            label={<FormattedLabel id="paymentMode" />}
                          >
                            {billingCycle &&
                              billingCycle.map((cycle, index) => (
                                <MenuItem key={index} value={cycle.id}>
                                  {cycle.billingCycle}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="paymentMode"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.paymentMode
                          ? errors.paymentMode.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="accoundCode" />}
                      multiline
                      variant="standard"
                      {...register("accoundCode")}
                      error={!!errors.accoundCode}
                      helperText={
                        errors?.accoundCode ? errors.accoundCode.message : null
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="codeDescription" />}
                      multiline
                      variant="standard"
                      {...register("codeDescription")}
                      error={!!errors.codeDescription}
                      helperText={
                        errors?.codeDescription
                          ? errors.codeDescription.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="amount" />}
                      multiline
                      variant="standard"
                      {...register("amount")}
                      error={!!errors.amount}
                      helperText={errors?.amount ? errors.amount.message : null}
                    />
                  </Grid>

                  <Grid container mt={5} border px={5}>
                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button type="Submit" color="success" variant="contained">
                        Submit
                      </Button>
                    </Grid>

                    <Grid item xs={2}></Grid>

                    <Grid item>
                      <Button
                        onClick={() => setButtonText("Clear")}
                        variant="contained"
                        color="primary"
                      >
                        Clear
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          router.push(
                            `/ElectricBillingPayment/transaction/quotationEntry`
                          )
                        }
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default EntryForm;
