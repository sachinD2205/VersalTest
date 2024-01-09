import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Typography,
  Paper,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Box,
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Controller,
  useFormContext,
  useForm,
  FormProvider,
} from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import LoiGenerationRecipt from "../LoiGenerationRecipt";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "../../../view.module.css";

// import LoiGenerationRecipt from "../components/"
// import theme from "";
import urls from "../../../../../URLS/urls";
import { useRouter } from "next/router";
// import LoiCollectionComponent from "./LoiCollectionComponent";
// Loi Generation
const LoiGenerationComponent = () => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query);
      reset(router.query);
    }
  }, []);

  // const {
  //   control,
  //   register,
  //   reset,
  //   formState: { errors },
  // } = useForm();

  const router = useRouter();

  useEffect(() => {
    getServices();
    getChargeTypeRate();
  }, []);

  const [services, setServices] = useState();

  const getServices = () => {
    axios
      .get("http://localhost:8090/cfc/api/master/service/getAll")
      .then((res) => setServices(res?.data?.service))
      .catch((error) => console.log(error));
  };

  const [chargeTypeRate, setchargeTypeRate] = useState();

  const getChargeTypeRate = () => {
    axios
      .get("${urls.FbsURL}/chargeTypeRateEntry/getAll")
      .then((res) => setchargeTypeRate(res?.data?.chargeTypeRate))
      .catch((error) => console.log(error));
  };

  const language = useSelector((state) => state?.labels.language);

  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] =
    useState(false);
  const loiGenerationReceiptDailogOpen = () =>
    setLoiGenerationReceiptDailog(true);
  const loiGenerationReceiptDailogClose = () =>
    setLoiGenerationReceiptDailog(false);

  // const loi Recipit
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen();
  };

  const [crPincodes, setCrPinCodes] = useState();

  useEffect(() => {
    console.log("title", getValues("title"));
    console.log("serviceName", getValues("serviceName"));
    console.log("firstName", getValues("firstName"));
  }, []);

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

  const [licenseType, setlicenseType] = useState([]);

  const getlicenseType = () => {
    axios.get(`${urls.SSLM}/master/MstLicenseType/getAll`).then((r) => {
      setlicenseType(
        r.data.MstLicenseType.map((row) => ({
          id: row.id,
          licenseTypeEn: row.licenseType,
          licenseTypeMar: row.licenseTypeMar,
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

  const [durationOfLicense, setdurationOfLicense] = useState([]);

  const getdurationOfLicense = () => {
    axios.get(`${urls.HMSURL}/licenseValidity/getAll`).then((r) => {
      setdurationOfLicense(
        r.data.licenseValidity.map((row) => ({
          id: row.id,
          durationOfLicense: row.durationOfLicense,
          durationOfLicensemr: row.durationOfLicenseMr,
        }))
      );
    });
  };

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

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);

    const finalBody = {
      ...fromData,
      dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
        "YYYY-MM-DDThh:mm:ss"
      ),
      departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
    };
    axios
      .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, finalBody)
      .then((res) => {
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.back();
        }
      });
  };

  useEffect(() => {
    getserviceNames();
    getTitles;
    getlicenseType();
    getdurationOfLicense();
    getServiceCharges();
  }, []);

  // ServiceName
  const [serviceNames, setServiceNames] = useState([]);

  // verify LOI
  const verifyLoi = () => {};

  return (
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname: "/FireBrigadeSystem/transactions/firstAhawal",
                    })
                  }
                />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                {<FormattedLabel id="emergencyServicesFirstVardiAhawal" />}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.small}>
                  <div className={styles.details}>
                    <div className={styles.h1Tag}>
                      <h3
                        style={{
                          color: "white",
                          marginTop: "5px",
                          paddingLeft: 10,
                        }}
                      >
                        {<FormattedLabel id="informerDetails" />}
                      </h3>
                    </div>
                  </div>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        // size="small"
                        id="standard-basic"
                        label={<FormattedLabel id="informerName" />}
                        variant="standard"
                        {...register("informerName")}
                        error={!!errors.informerName}
                        helperText={
                          errors?.informerName
                            ? errors.informerName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerMiddleName" />}
                        variant="standard"
                        {...register("informerMiddleName")}
                        error={!!errors.informerMiddleName}
                        helperText={
                          errors?.informerMiddleName
                            ? errors.informerMiddleName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerLastName" />}
                        variant="standard"
                        {...register("informerLastName")}
                        error={!!errors.informerLastName}
                        helperText={
                          errors?.informerLastName
                            ? errors.informerLastName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerNameMr" />}
                        variant="standard"
                        {...register("informerNameMr")}
                        error={!!errors.informerNameMr}
                        helperText={
                          errors?.informerNameMr
                            ? errors.informerNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerMiddleNameMr" />}
                        variant="standard"
                        {...register("informerMiddleNameMr")}
                        error={!!errors.informerMiddleNameMr}
                        helperText={
                          errors?.informerMiddleNameMr
                            ? errors.informerMiddleNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerLastNameMr" />}
                        variant="standard"
                        {...register("informerLastNameMr")}
                        error={!!errors.informerLastNameMr}
                        helperText={
                          errors?.informerLastNameMr
                            ? errors.informerLastNameMr.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="area" />}
                        variant="standard"
                        {...register("area")}
                        error={!!errors.area}
                        helperText={errors?.area ? errors.area.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="city" />}
                        variant="standard"
                        {...register("city")}
                        error={!!errors.city}
                        helperText={errors?.city ? errors.city.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        variant="standard"
                        sx={{ width: "65%" }}
                        error={!!errors.pinCode}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Pin Code
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Pin Code"
                            >
                              {crPincodes &&
                                crPincodes.map((crPincode, index) => (
                                  <MenuItem key={index} value={crPincode.id}>
                                    {crPincode.pinCode}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="pinCode"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.pinCode ? errors.pinCode.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="areaMr" />}
                        variant="standard"
                        {...register("areaMr")}
                        error={!!errors.areaMr}
                        helperText={
                          errors?.areaMr ? errors.areaMr.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="cityMr" />}
                        variant="standard"
                        {...register("cityMr")}
                        error={!!errors.cityMr}
                        helperText={
                          errors?.cityMr ? errors.cityMr.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="contactNumber" />}
                        variant="standard"
                        {...register("contactNumber")}
                        error={!!errors.contactNumber}
                        helperText={
                          errors?.contactNumber
                            ? errors.contactNumber.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <div className={styles.details}>
                    <div className={styles.h1Tag}>
                      <h3
                        style={{
                          color: "white",
                          marginTop: "5px",
                          paddingLeft: 10,
                        }}
                      >
                        {/* {<FormattedLabel id="informerDetails" />} */}
                        Charge Details
                      </h3>
                    </div>
                  </div>
                  {/* charge  */}
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        variant="standard"
                        sx={{ width: "65%" }}
                        error={!!errors.pinCode}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Service Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Service Name"
                            >
                              {services &&
                                services.map((service, index) => (
                                  <MenuItem key={index} value={service.id}>
                                    {service.serviceName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="serviceName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.pinCode ? errors.pinCode.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        variant="standard"
                        sx={{ marginTop: 2 }}
                        error={!!errors.serviceCharge}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* <FormattedLabel id="serviceCharge" /> */}
                          Charge Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "230px" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="serviceCharge" />}
                            >
                              {/* {serviceCharges &&
                                serviceCharges.map((serviceCharge, index) => (
                                  <MenuItem
                                    key={index}
                                    value={serviceCharge.id}
                                  >
                                    {serviceCharge.serviceChargeType}
                                  </MenuItem>
                                ))} */}
                              {chargeTypeRate &&
                                chargeTypeRate.map((ch, index) => (
                                  <MenuItem key={index} value={ch.id}>
                                    {ch.chargeName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="serviceCharge"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.serviceCharge
                            ? errors.serviceCharge.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        variant="standard"
                        // label={<FormattedLabel id="rate" />}
                        label="Rate"
                        {...register("rate")}
                        error={!!errors.rate}
                        helperText={errors?.rate ? errors.rate.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        variant="standard"
                        // label={<FormattedLabel id="amount" />}
                        label="Amount"
                        {...register("amount")}
                        error={!!errors.amount}
                        helperText={
                          errors?.amount ? errors.amount.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        variant="standard"
                        // label={<FormattedLabel id="total" />}
                        label="Total"
                        {...register("total")}
                        error={!!errors.total}
                        helperText={errors?.total ? errors.total.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        variant="standard"
                        // label={<FormattedLabel id="totalInWords" />}
                        label="Total In Words"
                        {...register("totalInWords")}
                        error={!!errors.totalInWords}
                        helperText={
                          errors?.totalInWords
                            ? errors.totalInWords.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <br />{" "}
                  {/* <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="save" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        // color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={() =>
                          router.push({
                            pathname:
                              "/FireBrigadeSystem/transactions/firstAhawal",
                          })
                        }
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid> */}
                  <Grid
                    container
                    sx={{
                      marginTop: 1,
                      marginBottom: 5,
                      paddingLeft: "50px",
                      align: "center",
                    }}
                  >
                    <br />
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItem: "center",
                      }}
                    >
                      <Stack spacing={5} direction="row">
                        <Button
                          sx={{ width: "230 px" }}
                          variant="contained"
                          onClick={() => verifyLoi()}
                        >
                          {/* <FormattedLabel id="verifyLoi" /> */}
                          "Verify LOI"
                        </Button>
                        <Button
                          sx={{ width: "230 px" }}
                          variant="contained"
                          onClick={() => loiGenerationReceipt()}
                        >
                          {/* <FormattedLabel id="previewLoi" /> */}
                          Preview LOI
                        </Button>
                        <Button sx={{ width: "230 px" }} variant="contained">
                          {/* <FormattedLabel id="generateLoi" /> */}
                          Generate LOI
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                  {/** Form Preview Dailog */}
                  <Dialog
                    fullWidth
                    maxWidth={"lg"}
                    open={loiGenerationReceiptDailog}
                    onClose={() => loiGenerationReceiptDailogClose()}
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
                                loiGenerationReceiptDailogClose();
                              }}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </DialogTitle>
                    <DialogContent>
                      <LoiGenerationRecipt />
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
                        <Button
                          variant="contained"
                          onClick={loiGenerationReceiptDailogClose}
                        >
                          Exit
                        </Button>
                      </Grid>
                    </DialogTitle>
                  </Dialog>
                </div>
              </form>
            </FormProvider>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default LoiGenerationComponent;
