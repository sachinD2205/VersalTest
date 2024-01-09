import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/meterReadingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import UploadButton from "../../../../../components/ElectricBillingComponent/uploadDocument/uploadButton";
import { useRouter } from "next/router";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import Loader from "../../../../../containers/Layout/components/Loader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

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

  //get logged in user
  const user = useSelector((state) => state.user.user);
  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  const [photo, setPhoto] = useState();

  useEffect(() => {
    if (router.query.id) {
      getMeterReadingDetailsById(router.query.id);
    }
  }, [router.query.id]);

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  const getMeterReadingDetailsById = (id) => {
    setLoading(true);
    axios
      .get(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/getById?id=${id}`, {
        headers: headers,
      })
      .then((res) => {
        setLoading(false);
        reset(res.data);
        setValue("vanNo", res?.data?.newConnectionEntryDao?.vanNo);
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleUploadDocument = (path) => {
    let temp = {
      documentPath: path,
      documentKey: 1,
      documentType: "",
      remarks: "",
    };
    setPhoto(temp);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
  };

  return loading ? (
    <CommonLoader />
  ) : (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Box>
            <Grid
              container
              className={commonStyles.title}
              style={{ marginBottom: "8px" }}
            >
              <Grid item xs={1}>
                <IconButton
                  style={{
                    color: "white",
                  }}
                  onClick={() => {
                    router.back();
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs={10}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginRight: "2rem",
                  }}
                >
                  <FormattedLabel id="meterReadingEntry" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Card
            sx={{
              padding: "20px",
              marginTop: "20px",
            }}
          >
            <Grid container>
              {/* Consumer No  */}

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
                  disabled
                  id="standard-textarea"
                  label={<FormattedLabel id="consumerNo" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  value={watch("consumerNo")}
                  error={!!errors.consumerNo}
                  helperText={
                    errors?.consumerNo ? errors.consumerNo.message : null
                  }
                  InputLabelProps={{
                    //true
                    shrink: watch("consumerNo") ? true : false,
                  }}
                />
              </Grid>

              {/* Van No  */}

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
                  disabled
                  id="standard-textarea"
                  label={<FormattedLabel id="vanNo" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  value={watch("vanNo")}
                  error={!!errors.vanNo}
                  helperText={errors?.vanNo ? errors.vanNo.message : null}
                  InputLabelProps={{
                    shrink: watch("vanNo") ? true : false,
                  }}
                />
              </Grid>

              {/*previous Reading Date */}

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
                {/* Current reading date in English */}
                <FormControl error={!!errors.prevReadingDate}>
                  <Controller
                    control={control}
                    name="prevReadingDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled
                          inputFormat="DD/MM/yyyy"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="prevReadingDate" />
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            // field.onChange(date)
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                          }}
                          // selected={field.value}
                          // center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ m: 1, minWidth: "75%" }}
                              variant="standard"
                              error={!!errors.prevReadingDate}
                              helperText={
                                errors.prevReadingDate
                                  ? errors.prevReadingDate?.message
                                  : null
                              }
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
                </FormControl>
              </Grid>

              {/* prevReading */}

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
                  disabled
                  id="standard-textarea"
                  label={<FormattedLabel id="previousReading" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  {...register("prevReading")}
                  error={!!errors.prevReading}
                  helperText={
                    errors?.prevReading ? errors.prevReading.message : null
                  }
                  InputLabelProps={{
                    //true
                    shrink: watch("prevReading") ? true : false,
                  }}
                />
              </Grid>

              {/*current Reading Date */}

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
                {/* Current reading date in English */}
                <FormControl error={!!errors.currReadingDate}>
                  <Controller
                    control={control}
                    name="currReadingDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled
                          inputFormat="DD/MM/yyyy"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="currReadingDate" />
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            // field.onChange(date)
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                          }}
                          // selected={field.value}
                          // center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ m: 1, minWidth: "75%" }}
                              variant="standard"
                              error={!!errors.currReadingDate}
                              helperText={
                                errors.currReadingDate
                                  ? errors.currReadingDate?.message
                                  : null
                              }
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
                </FormControl>
              </Grid>

              {/* currentReading  */}

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
                  disabled
                  id="standard-textarea"
                  label={<FormattedLabel id="currentReading" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  {...register("currReading")}
                  error={!!errors.currReading}
                  helperText={
                    errors?.currReading ? errors.currReading.message : null
                  }
                  InputLabelProps={{
                    //true
                    shrink: watch("currReading") ? true : false,
                  }}
                />
              </Grid>

              {/* consumedUnit  */}

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
                  disabled
                  id="standard-textarea"
                  label={<FormattedLabel id="consumedUnit" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  value={watch("consumedUnit")}
                  error={!!errors.consumedUnit}
                  helperText={
                    errors?.consumedUnit ? errors.consumedUnit.message : null
                  }
                  InputLabelProps={{
                    //true
                    shrink: watch("consumedUnit") ? true : false,
                  }}
                />
              </Grid>

              {/* billedAmount  */}

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
                  disabled
                  id="standard-textarea"
                  label={<FormattedLabel id="billedAmount" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  {...register("billedAmount")}
                  error={!!errors.billedAmount}
                  helperText={
                    errors?.billedAmount ? errors.billedAmount.message : null
                  }
                  InputLabelProps={{
                    //true
                    shrink: watch("billedAmount") ? true : false,
                  }}
                />
              </Grid>

              {/* amount to be paid  */}

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
                  disabled
                  id="standard-textarea"
                  label={<FormattedLabel id="amountToBePaid" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  {...register("amountToBePaid")}
                  error={!!errors.amountToBePaid}
                  helperText={
                    errors?.amountToBePaid
                      ? errors.amountToBePaid.message
                      : null
                  }
                  InputLabelProps={{
                    //true
                    shrink: watch("amountToBePaid") ? true : false,
                  }}
                />
              </Grid>

              {/*bill amount to be paid Date */}

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
                {/* Current reading date in English */}
                <FormControl error={!!errors.billAmountTobePaidDate}>
                  <Controller
                    control={control}
                    name="billAmountTobePaidDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled
                          inputFormat="DD/MM/yyyy"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="billAmountTobePaidDate" />
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            // field.onChange(date)
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                          }}
                          // selected={field.value}
                          // center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ m: 1, minWidth: "75%" }}
                              variant="standard"
                              error={!!errors.billAmountTobePaidDate}
                              helperText={
                                errors.billAmountTobePaidDate
                                  ? errors.billAmountTobePaidDate?.message
                                  : null
                              }
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
                </FormControl>
              </Grid>

              {/* year and month */}

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
                {/* Current reading date in English */}
                <FormControl error={!!errors.monthAndYear}>
                  <Controller
                    control={control}
                    name="monthAndYear"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled
                          views={["month", "year"]}
                          inputFormat="MM/yyyy"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="monthAndYear" />
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            // field.onChange(date)
                            field.onChange(moment(date).format("YYYY-MM"));
                          }}
                          // selected={field.value}
                          // center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ m: 1, minWidth: "75%" }}
                              variant="standard"
                              error={!!errors.monthAndYear}
                              helperText={
                                errors.monthAndYear
                                  ? errors.monthAndYear?.message
                                  : null
                              }
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
                </FormControl>
              </Grid>

              {/* remarks  */}

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
                  disabled
                  id="standard-textarea"
                  label={<FormattedLabel id="remark" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  {...register("remarks")}
                  error={!!errors.remarks}
                  helperText={errors?.remarks ? errors.remarks.message : null}
                />
              </Grid>

              {/* Attachement */}
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
                  marginTop: "20px",
                }}
              >
                <label>
                  <b>
                    <FormattedLabel id="meterReadingReciept" />
                  </b>
                </label>
                <UploadButton
                  appName="EBP"
                  serviceName="EBP-NewConnection"
                  filePath={(path) => {
                    handleUploadDocument(path);
                  }}
                  fileName={photo && photo.documentPath}
                />
              </Grid>
            </Grid>

            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <Grid
                item
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    router.push(
                      "/ElectricBillingPayment/transaction/meterReadingEntry/meterReadingDetails"
                    );
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </Grid>
          </Card>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;
