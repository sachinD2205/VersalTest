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
  Modal,
  IconButton,
  TextareaAutosize,
} from "@mui/material";
import { Stack, ThemeProvider } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Typography } from "antd";
import axios from "axios";
import moment, { now } from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import sweetAlert from "sweetalert";
import { toast, ToastContainer } from "react-toastify";
import styles from "../../../../styles/skysignstyles/scrutinyAction.module.css";

const CertificateGeneration = () => {
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

  const language = useSelector((state) => state?.labels.language);
  const [inputState, setInputState] = useState(false);
  const [dataSource, setDataSource] = useState();
  const router = useRouter();
  // payment Mode
  const [paymentModeName, setPaymentModeName] = useState();
  const [modalforAprov, setmodalforAprov] = useState(false);
  // let applno = router.query.applicationNumber;
  // Pay
  const pay = () => {};
  useEffect(() => {
    console.log("watch", watch("paymentMode"));
  }, [watch("paymentMode")]);
  const [applno, setapplno] = useState();
  const [loiId, setloiId] = useState();

  const [shrink2, setShrink2] = useState();
  const [addressShrink, setAddressShrink] = useState();
  // Input State
  useEffect(() => {
    setInputState(true);
    if (router.query) {
      console.log("123", router.query);
      setapplno(router.query.applicationNumber);
    }
  }, []);
  useEffect(() => {
    reset(router.query);
  }, [router.query]);

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

  // title
  const [titles, setTitles] = useState();

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
    axios.get(`${urls.CfcURLMaster}/paymentType/getAll`).then((r) => {
      setPaymentTypes(
        r.data.paymentType.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
          paymentTypeMr: row.paymentTypeMr,
        }))
      );
    });
  };

  const [paymentModes, setPaymentModes] = useState([]);

  const getPaymentModes = () => {
    axios.get(`${urls.CfcURLMaster}/paymentMode/getAll`).then((r) => {
      setPaymentModes(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        }))
      );
    });
  };

  // Bank Masters

  const [bankMasters, setBankMasters] = useState([]);

  // getBankMasters
  const getBankMasters = () => {
    axios.get(`${urls.CfcURLMaster}/bank/getAll`).then((r) => {
      setBankMasters(
        r.data.bank.map((row) => ({
          id: row.id,
          bankMaster: row.bankName,
          bankMasterMr: row.bankNameMr,
        }))
      );
    });
  };

  const getDataByApplicationNumber = () => {
    if (applno !== undefined) {
      console.log("applno", applno);
      axios
        .get(
          `${urls.SSLM}/TrnLoi/getDataByApplicationNumber?applicationNumber=${applno}`
        )
        .then((res) => {
          console.log(res);
          setDataSource(
            res.data.trnLoiDao.forEach((r, i) => setValue("loiNo", r.loiNo)),
            res.data.trnLoiDao.forEach((r, i) => {
              console.log(r.id);
              setloiId(r.id);
              //setValue("loiId", r.id);
            }),

            res.data.trnLoiDao.forEach((r, i) => setValue("total", r.total)),
            res.data.trnLoiDao.forEach((r, i) =>
              setValue("loiDate", r.loiDate)
            ),
            res.data.trnLoiDao.forEach((r, i) =>
              setValue("totalInWords", r.totalInWords)
            ),
            res.data.trnLoiDao.forEach((r, i) =>
              setValue("durationOfLicenseValidity", r.durationOfLicenseValidity)
            )
          );
        });
    }
  };

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getserviceNames();
    getTitles();
    getlicenseType();
    getBankMasters();
    getDataByApplicationNumber();
  }, []);
  useEffect(() => {
    getDataByApplicationNumber();
  }, [applno]);

  // const getLoiCollectionData = () => {
  //   const id = getValues("id");
  //   axios
  //     .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${id}`)
  //     .then((res) => {
  //       if (res.data == 200) {
  //         console.log("resp.data", res.data);
  //         reset(res.data);
  //       }
  //     });
  // };

  // useEffect(() => {
  //   getLoiCollectionData();
  // }, [getValues("id")]);

  const handleNext = (data) => {
    console.log("data1", data);

    const datas = {
      ...data,
      role: "LOI_COLLECTION",
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
      loiId: loiId,
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
        // ...datas.,
        // trnLoiServiceChargesDao: getValues(trnPartnerDao"serviceCharges"),
      },
    ];

    const trnApplicantAttachmentDao = [
      {
        applicant: data.id,
      },
    ];

    const finalBodyForApi = {
      ...datas,
      //loiId,
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

    console.log("LOID" + loiId);
    console.log("dataaaaaaa", finalBodyForApi);

    // console.log("datas", datas);

    axios
      .post(
        `${urls.SSLM}/Trn/ApplicantDetails/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            role: "LOI_COLLECTION",
            id: data.id,
          },
        }
      )
      .then((res) => {
        if (res.status == 201) {
          finalBodyForApi.id
            ? sweetAlert("LOI !", "Payment Successful!", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
        }
      });
  };

  useEffect(() => {
    if (getValues("trnPaymentCollectionDao.paymentMode") == "CASH") {
      setValue(
        "trnPaymentCollectionDao.receiptAmount",
        getValues("trnLoiDao.total")
      );
    }
  }, [watch("paymentMode")]);

  // view
  return (
    <>
      <div>
        <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit(handleNext)}>
            <div>
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
                          disabled={inputState}
                          sx={{ minWidth: "230px", width: "500px" }}
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
                                {language == "en"
                                  ? title?.title
                                  : title?.titleMr}
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
                    disabled={inputState}
                    label={<FormattedLabel id="fname" />}
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={
                      errors?.firstName ? errors.firstName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
                    // disabled={inputState}
                    label={<FormattedLabel id="mname" />}
                    {...register("middleName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
                    label={<FormattedLabel id="lname" />}
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={
                      errors?.lastName ? errors.lastName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
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
                    disabled={inputState}
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
                    disabled={inputState}
                    InputLabelProps={{ shrink: true }}
                    {...register("loiNo")}
                    error={!!errors.loiNo}
                    helperText={errors?.loiNo ? errors.loiNo.message : null}
                  />
                </Grid>

                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl sx={{ marginTop: 0 }} error={!!errors.loiDate}>
                    <Controller
                      name="loiDate"
                      InputLabelProps={{ shrink: true }}
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
                  <TextField
                    label={<FormattedLabel id="durationOfLicenseValidity" />}
                    InputLabelProps={{ shrink: true }}
                    {...register("durationOfLicenseValidity")}
                    error={!!errors.durationOfLicenseValidity}
                    helperText={
                      errors?.durationOfLicenseValidity
                        ? errors.durationOfLicenseValidity.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
                    label={<FormattedLabel id="total" />}
                    InputLabelProps={{ shrink: true }}
                    {...register("total")}
                    error={!!errors.total}
                    helperText={errors?.total ? errors.total.message : null}
                  />
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    label={<FormattedLabel id="totalInWords" />}
                    InputLabelProps={{ shrink: true }}
                    {...register("totalInWords")}
                    error={!!errors.totalInWords}
                    totalInWords
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
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <TextField
                    // disabled={inputState}
                    id="standard-basic"
                    label={<FormattedLabel id="paymentType" />}
                    variant="standard"
                    {...register("trnPaymentCollectionDao.paymentType")}
                    error={!!errors.paymentType}
                    helperText={
                      errors?.paymentType ? errors.paymentType.message : null
                    }
                  />
                </Grid>

                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <TextField
                    // disabled={inputState}
                    id="standard-basic"
                    label={<FormattedLabel id="paymentMode" />}
                    variant="standard"
                    {...register("trnPaymentCollectionDao.paymentMode")}
                    error={!!errors.paymentMode}
                    helperText={
                      errors?.paymentMode ? errors.paymentMode.message : null
                    }
                  />
                </Grid>

                {watch("trnPaymentCollectionDao.paymentMode") == 1 && (
                  <>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      {/* <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="bankName" />}
                          variant="standard"
                          {...register("trnPaymentCollectionDao.bankName")}
                          error={!!errors.bankName}
                          helperText={
                            errors?.bankName ? errors.bankName.message : null
                          }
                        /> */}

                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.bankMaster}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="bankName"></FormattedLabel>}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="bank name *"
                            >
                              {bankMasters &&
                                bankMasters.map((bankMaster, index) => (
                                  <MenuItem
                                    key={index}
                                    value={bankMaster.bankMaster}
                                  >
                                    {bankMaster.bankMaster}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="trnPaymentCollectionDao.bankName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bankMaster
                            ? errors.bankMaster.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/** 
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      disabled={inputState}
                      id='standard-basic'
                      label={<FormattedLabel id='branchName' />}
                      variant='standard'
                      {...register("branchName")}
                      error={!!errors.branchName}
                      helperText={
                        errors?.branchName ? errors.branchName.message : null
                      }
                    />
                  </Grid>
                    */}
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id="standard-basic"
                        label={<FormattedLabel id="bankAccountNo" />}
                        variant="standard"
                        {...register("trnPaymentCollectionDao.bankAccountNo")}
                        error={!!errors.bankAccountNo}
                        helperText={
                          errors?.bankAccountNo
                            ? errors.bankAccountNo.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id="standard-basic"
                        label={<FormattedLabel id="ddNo" />}
                        variant="standard"
                        {...register("trnPaymentCollectionDao.dDNo")}
                        error={!!errors.dDNo}
                        helperText={errors?.dDNo ? errors.dDNo.message : null}
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.dDDate}
                      >
                        <Controller
                          name="trnPaymentCollectionDao.dDDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    <FormattedLabel id="ddDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
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
                          {errors?.dDDate ? errors.dDDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {watch("trnPaymentCollectionDao.paymentMode") == "12" && (
                  <>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id="standard-basic"
                        label={<FormattedLabel id="receiptAmount" />}
                        variant="standard"
                        {...register("trnPaymentCollectionDao.receiptAmount")}
                        error={!!errors.receiptAmount}
                        helperText={
                          errors?.receiptAmount
                            ? errors.receiptAmount.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id="standard-basic"
                        label={<FormattedLabel id="receiptNumber" />}
                        variant="standard"
                        {...register("trnPaymentCollectionDao.receiptNo")}
                        error={!!errors.receiptNo}
                        helperText={
                          errors?.receiptNo ? errors.receiptNo.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.receiptDate}
                      >
                        <Controller
                          name="trnPaymentCollectionDao.receiptDate"
                          control={control}
                          defaultValue={moment()}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    <FormattedLabel id="receiptDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
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
                          {errors?.receiptDate
                            ? errors.receiptDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid
                container
                sx={{
                  marginTop: 1,
                  marginBottom: 5,
                  marginLeft: 50,
                  paddingLeft: "50px",
                  align: "center",
                }}
              >
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Stack
                    spacing={6}
                    direction="row"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<NextPlanIcon />}
                      color="success"
                      onClick={() => {
                        setmodalforAprov(true);
                      }}
                    >
                      Action
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<UndoIcon />}
                      onClick={() => {
                        router.push(`/skySignLicense/transactions/workFlow/`);
                      }}
                    >
                      BACK
                    </Button>

                    <Button
                      variant="contained"
                      endIcon={<CloseIcon />}
                      color="error"
                      onClick={() => {
                        router.push(`/skySignLicense/dashboard`);
                      }}
                    >
                      exit
                    </Button>
                  </Stack>
                </Grid>
                <form onSubmit={handleSubmit("remarks")}>
                  <div className={styles.model}>
                    <Modal
                      open={modalforAprov}
                      //onClose={clerkApproved}
                      onCancel={() => {
                        setmodalforAprov(false);
                      }}
                    >
                      <div className={styles.boxRemark}>
                        <div className={styles.titlemodelremarkAprove}>
                          <Typography
                            className={styles.titleOne}
                            variant="h6"
                            component="h2"
                            color="#f7f8fa"
                            style={{ marginLeft: "25px" }}
                          >
                            Enter Remark on Application
                          </Typography>
                          <IconButton>
                            <CloseIcon
                              onClick={() =>
                                router.push(
                                  `/skySignLicense/transactions/components/CertificateGeneration/`
                                )
                              }
                            />
                          </IconButton>
                        </div>

                        <div
                          className={styles.btndate}
                          style={{ marginLeft: "200px" }}
                        >
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={4}
                            placeholder="Enter a Remarks"
                            style={{ width: 700 }}
                            onChange={(e) => {
                              setRemark(e.target.value);
                            }}
                          />
                        </div>

                        <div className={styles.btnappr}>
                          <Button
                            variant="contained"
                            color="success"
                            endIcon={<ThumbUpIcon />}
                            onClick={async () => {
                              remarks("Approve");
                              // setBtnSaveText('APPROVED')
                              router.push(
                                `/skySignLicense/transactions/workFlow/`
                              );
                            }}
                          >
                            Approve
                          </Button>

                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<UndoIcon />}
                            onClick={() => {
                              // alert('tu karnar ressign ')
                              // setBtnSaveText('REASSIGN')
                              remarks("REVERT");
                              router.push(
                                `/skySignLicense/transactions/workFlow/`
                              );
                            }}
                          >
                            Revert
                          </Button>

                          <Button
                            variant="contained"
                            endIcon={<CloseIcon />}
                            color="error"
                            onClick={() =>
                              router.push(
                                `/skySignLicense/transactions/workFlow/`
                              )
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Modal>
                  </div>
                </form>
              </Grid>
            </div>
          </form>
        </ThemeProvider>
      </div>
    </>
  );
};

export default CertificateGeneration;
