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
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
// import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event";
import React, { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToWords } from "to-words";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import LoiGenerationRecipt from "../loiGenerationRecipt";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
// Loi Generation
const LoiGenerationComponent = () => {
  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const toWords = new ToWords();

  useEffect(() => {
    reset(router.query);
  }, [router.query]);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "serviceCharges", // unique name for your Field Array
    }
  );

  const language = useSelector((state) => state?.labels.language);
  const [rate, setrate] = useState();
  const [total, settotal] = useState();
  const [amount, setamount] = useState();

  const [totalInWords, setTotalInWords] = useState();

  // lOI GENERATION PREVIEW

  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] =
    useState(false);
  const loiGenerationReceiptDailogOpen = () =>
    setLoiGenerationReceiptDailog(true);
  const loiGenerationReceiptDailogClose = () =>
    setLoiGenerationReceiptDailog(false);

  // const trnLoiDao Recipit - Preview
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen();
  };

  const [shrink1, setShrink1] = useState();
  const [shrink2, setShrink2] = useState();
  const [addressShrink, setAddressShrink] = useState();
  const [serviceCharge, setServiceCharges] = useState([]);

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
  const [ratecharts, setratechart] = useState([]);
  const getratechart = () => {
    axios
      .get(`${urls.SSLM}/master/MstRateChartOfIndustrialLicense/getAll`)
      .then((res) => {
        if (res.status == 200) {
          setratechart(
            res.data.MstRateChartOfIndustrialLicense.map((r) => ({
              id: r.id,
              noOfEmployees: r.noOfEmployees,
              rate: r.rate,
              //licenseTypeMar: row.licenseTypeMar,
            }))
          );
        }
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

  const [licenseTypes, setlicenseTypes] = useState([]);

  const getlicenseType = () => {
    axios.get(`${urls.SSLM}/master/MstLicenseType/getAll`).then((r) => {
      setlicenseTypes(
        r.data.MstLicenseType.map((row) => ({
          id: row.id,
          licenseType: row.licenseType,
        }))
      );
    });
  };
  const [durationOfLicenseValiditys, setDurationOfLicenseValiditys] =
    useState();

  const getDurationOfLicenseValiditys = () => {
    axios.get(`${urls.SSLM}/master/MstLicenseValidity/getAll`).then((res) => {
      if (res.status == 200) {
        setDurationOfLicenseValiditys(
          res.data.MstLicenseValidity.map((r) => ({
            id: r.id,
            licenseValidity: r.licenseValidity,
            licenseType: r.licenseType,
          }))
        );
      }
    });
  };

  const getServiceCharges = () => {
    axios
      .get(
        `${
          urls.CfcURLMaster
        }/servicecharges/getByServiceId?serviceId=${getValues("serviceName")}`
      )
      .then((r) => {
        setServiceCharges(
          r.data.serviceCharge.map((row) => ({
            id: row.id,
            serviceChargeType: row.serviceChargeType,
            serviceChargeTypeName: row.serviceChargeTypeName,
            serviceChargeType: row.serviceChargeType,
            charge: row.charge,
            chargeName: row.chargeName,
            amount: row.amount,
          }))
        );
      });
  };

  const [inputState, setInputState] = useState(false);

  useEffect(() => {
    getTitles;
    getserviceNames();
    getTitles();
    getlicenseType();
    getDurationOfLicenseValiditys();
    getServiceCharges();
    getratechart();
  }, []);

  useEffect(() => {
    setInputState(getValues("inputState"));
    setValue("serviceCharges", serviceCharge);
    let total = 0;

    serviceCharge.forEach((data, index) => {
      total += data.amount;
    });
    // setValue("trnLoiDao.total", total);
    setValue(setamount(total));

    // setValue("trnLoiDao.totalInWords", toWords.convert(total));
  }, [serviceCharge]);

  // License Validity -Based on Duration
  useEffect(() => {
    setValue(
      "trnLoiDao.durationOfLicenseValidity",
      durationOfLicenseValiditys?.find(
        (d) => d?.licenseType == getValues("licenseType")
      )?.id
    );
  }, [durationOfLicenseValiditys]);

  const getLoiGenerationData = () => {
    const id = getValues("id");

    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${id}`)
      .then((res) => {
        if (res.data == 200) {
          console.log("resp.data", res.data);
          reset(res.data);
        }
      });
  };

  useEffect(() => {
    console.log("bhava yetay ka id ", getValues("id"));
    getLoiGenerationData();
  }, [getValues("id")]);

  // Handle Next
  const handleNext = (data) => {
    // setValue("trnLoiDao.serviceCharges", getValues("serviceCharges"));
    // let data1 = getValues("trnLoiDao.serviceCharges");
    console.log("data1", data);
    const datas = {
      ...data,
      role: "LOI_GENERATION",
    };

    const roledao = {
      ...datas.roledao,
      trnLoiServiceChargesDao: getValues("serviceCharges"),
    };
    const trnSiteVisitFormDao = {
      ...datas.trnSiteVisitFormDao,
      trnLoiServiceChargesDao: getValues("serviceCharges"),
    };
    const trnLoiDao = {
      ...datas.trnLoiDao,
      trnLoiServiceChargesDao: getValues("serviceCharges"),
    };

    const trnLicenseDao = {
      ...datas.trnLicenseDao,
      // trnLoiServiceChargesDao: getValues("serviceCharges"),
    };
    const trnPaymentCollectionDao = {
      ...datas.trnPaymentCollectionDao,
      // trnLoiServiceChargesDao: getValues("serviceCharges"),
    };

    const trnIndustryBussinessDetailsDao = {
      ...datas.trnIndustryBussinessDetailsDao,
      // trnLoiServiceChargesDao: getValues("serviceCharges"),
    };

    const trnPartnerDao = [
      {
        trnapplicantKey: data.id,
        title: data.title,
        // ...datas.trnPartnerDao,
        // trnLoiServiceChargesDao: getValues("serviceCharges"),
      },
    ];

    const trnApplicantAttachmentDao = [
      {
        applicant: data.id,
      },
    ];

    let finalBodyForApi = {
      ...datas,
      trnLoiDao,
      trnLicenseDao,
      trnIndustryBussinessDetailsDao,
      trnPartnerDao,
      trnApplicantAttachmentDao,
      trnSiteVisitFormDao,
      trnPaymentCollectionDao,
      roledao,
      // trnLoiDao,
      // data1,
    };
    console.log("dataaaaaaa", finalBodyForApi);
    // console.log("datas", datas);

    axios
      .post(
        `${urls.SSLM}/Trn/ApplicantDetails/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            role: "LOI_GENERATION",
          },
        }
      )
      .then((res) => {
        if (res.status == 201) {
          console.log("respone", res.data.message);
          let message = res.data.message;
          finalBodyForApi.id
            ? sweetAlert("Loi Generated Successfully!", message, "success")
            : sweetAlert("Saved!", "Record Saved successfully ! ", "success");
        }
      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <form onSubmit={handleSubmit(handleNext)}>
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
              <FormattedLabel id="applicantDetails" />
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
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="serviceName" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
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
                disabled={inputState}
                label="Application No."
                {...register("applicationNumber")}
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
                        disabled={inputState}
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
                      inputFormat="DD/MM/YYYY"
                      disabled={inputState}
                      sx={{ width: "230px" }}
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
                {...register("emailAddress")}
                error={!!errors.emailAddress}
                helperText={
                  errors?.emailAddress ? errors.emailAddress.message : null
                }
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
            <strong>
              <FormattedLabel id="licenseValidity" />
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
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.licenseType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  license Type
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="License Type"
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
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.licenseType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="durationOfLicenseValidity" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="durationOfLicenseValidity" />}
                    >
                      {durationOfLicenseValiditys &&
                        durationOfLicenseValiditys.map(
                          (licenseValidity, index) => (
                            <MenuItem key={index} value={licenseValidity.id}>
                              {licenseValidity.licenseValidity}
                            </MenuItem>
                          )
                        )}
                    </Select>
                  )}
                  name="trnLoiDao.durationOfLicenseValidity"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.licenseType ? errors.licenseType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl flexDirection="row">
                <FormLabel
                  sx={{ width: "230px" }}
                  id="demo-row-radio-buttons-group-label"
                >
                  {<FormattedLabel id="licenseDuration" />}
                </FormLabel>

                <Controller
                  name="trnLoiDao.licenseDuration"
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
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="calendar year"
                        // disabled={inputState}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="calendarYear" />}
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="date of issuance"
                        // disabled={inputState}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="dateOfIssuance" />}
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
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
              <FormattedLabel id="chargesDetails" />
            </strong>
          </div>
          {serviceCharge.length > 0 && (
            <>
              {fields.map((serviceChargeId, index) => {
                return (
                  <Grid
                    container
                    key={index}
                    sx={{
                      paddingLeft: "50px",
                      align: "center",
                    }}
                  >
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        id="standard-basic"
                        key={serviceChargeId.id}
                        // disabled={inputState}
                        disabled
                        label={<FormattedLabel id="serviceChargeTypeName" />}
                        {...register(
                          `serviceCharges.${index}.serviceChargeTypeName`
                        )}
                        // error={!!errors.serviceChargeType}
                        // helperText={
                        //   errors?.serviceChargeType
                        //     ? errors.serviceChargeType.message
                        //     : null
                        // }
                      />
                    </Grid>
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        sx={{ width: "240px" }}
                        id="standard-basic"
                        //disabled={inputState}
                        disabled
                        key={serviceChargeId.id}
                        label={<FormattedLabel id="chargeName" />}
                        {...register(`serviceCharges.${index}.chargeName`)}
                        // error={!!errors.charge}
                        // helperText={errors?.charge ? errors.charge.message : null}
                      />
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <TextField
                        sx={{ width: "250px" }}
                        id="standard-basic"
                        // disabled={inputState}
                        disabled
                        key={serviceChargeId.id}
                        label={<FormattedLabel id="amount" />}
                        {...register(`serviceCharges.${index}.amount`)}
                        // error={!!errors.amount}
                        // helperText={
                        //   errors?.amount ? errors.amount.message : null

                        // }
                      />
                    </Grid>

                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <FormControl
                        variant="standard"
                        sx={{ width: "240px" }}
                        error={!!errors.noOfEmployees}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="noOfEmployees" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={inputState}
                              sx={{ width: 200 }}
                              value={field.value}
                              // key={ratechartid.id}
                              onChange={(value) => {
                                field.onChange(value);
                                let temp = ratecharts.find(
                                  (obj) => obj.id === value.target.value
                                ).rate;
                                // let temp1 = trnLoiDao.amount;

                                let total1 = parseInt(temp) + parseInt(amount);

                                let totalword = toWords.convert(
                                  parseInt(total1)
                                );

                                setrate(temp);
                                setValue("trnLoiDao.rate", temp);

                                setValue("trnLoiDao.total", total1);
                                setValue("trnLoiDao.totalInWords", totalword);
                              }}
                              label={<FormattedLabel id="noOfEmployees" />}
                            >
                              {ratecharts &&
                                ratecharts.map((noOfEmployees, index) => (
                                  <MenuItem
                                    key={index}
                                    value={noOfEmployees.id}
                                  >
                                    {noOfEmployees.noOfEmployees}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="trnLoiDao.noOfEmployees"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.noOfEmployees
                            ? errors.noOfEmployees.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        sx={{ width: "240px" }}
                        id="standard-basic"
                        //disabled={inputState}
                        disabled
                        InputLabelProps={{ shrink: true }}
                        // value={rate}
                        label={<FormattedLabel id="rate" />}
                        // name="trnLoiDao.rate"
                        {...register("trnLoiDao.rate")}
                        error={!!errors.rate}
                        helperText={errors?.rate ? errors.rate.message : null}
                      />
                    </Grid>
                  </Grid>
                );
              })}
            </>
          )}

          <Grid
            container
            sx={{
              paddingLeft: "50px",
              align: "center",
              backgroundColor: "primary",
              // border: "4px solid black",
            }}
          >
            {/* <Grid item xs={4} md={4} sm={4} xl={4} lg={4}></Grid> */}
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                label={<FormattedLabel id="totalCharges" />}
                sx={{ width: "240px" }}
                InputLabelProps={{ shrink: true }}
                // disabled={inputState}
                disabled
                {...register("trnLoiDao.total")}
                error={!!errors.total}
                helperText={errors?.total ? errors.total.message : null}
              />
            </Grid>
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                // disabled={inputState}
                disabled
                sx={{ width: "450px" }}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="totalInWords" />}
                {...register("trnLoiDao.totalInWords")}
                error={!!errors.totalInWords}
                helperText={
                  errors?.totalInWords ? errors.totalInWords.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                marginTop: "30px",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <Stack spacing={5} direction="row">
                <Button
                  type="submit"
                  sx={{ width: "230 px" }}
                  variant="contained"
                >
                  <FormattedLabel id="generateLoi" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>

        {/** Form Preview Dailog */}

        {/***
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
                  aria-label='delete'
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
                variant='contained'
                onClick={loiGenerationReceiptDailogClose}
              >
                Exit
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>
         */}
      </ThemeProvider>
    </>
  );
};

export default LoiGenerationComponent;
