/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import { ToWords } from "to-words";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

/** Authore - Sachin Durge */
// Loi Generation
const LoiGeneration = () => {
  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    setError,
    clearErrors,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;
  const language = useSelector((state) => state?.labels?.language);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "serviceCharges",
    }
  );

  // const { serviceID } = props;
  const router = useRouter();
  const toWords = new ToWords();
  const [inputState, setInputState] = useState(false);
  const [durationOfLicenseValiditys, setDurationOfLicenseValiditys] =
    useState();
  const [titles, setTitles] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [serviceCharges, setServiceCharges] = useState([]);
  const [loadderState, setLoadderState] = useState(false);
  const [shrinkTemp, setShrinkTemp] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
    useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
  const userToken = useGetToken();
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

  // titles
  const getTitles = () => {
    const url = `${urls.CFCURL}/master/title/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setTitles(
            r?.data?.title?.map((row) => ({
              id: row?.id,
              title: row?.title,
              titleMr: row?.titleMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
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
            r?.data?.service?.map((row) => ({
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

  // hawkerTypes
  const getHawkerType = () => {
    const url = `${urls.HMSURL}/hawkerType/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setHawkerTypes(
            r?.data?.hawkerType?.map((row) => ({
              id: row?.id,
              hawkerType: row?.hawkerType,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // durationOfLicenseValiditys
  const getDurationOfLicenseValiditys = () => {
    const url = `${urls.HMSURL}/licenseValidity/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setDurationOfLicenseValiditys(
            res?.data?.licenseValidity?.map((r) => ({
              id: r?.id,
              licenseValidity: r?.licenseValidity,
              hawkerType: r?.hawkerType,
              serviceId: r?.serviceId,
            }))
          );
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // serviceCharges
  const getServiceCharges = () => {
    if (watch("serviceId")) {
      const url = `${urls.CFCURL
        }/master/servicecharges/getByServiceId?serviceId=${watch("serviceId")}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setServiceCharges(
              r?.data?.serviceCharge?.map((row) => ({
                id: row?.id,
                serviceChargeTypeName: row?.serviceChargeTypeName,
                charge: row?.charge,
                servicex: row?.service,
                amount: row?.amount,
                chargeName: row?.chargeName,
                serviceChargeType: row?.serviceChargeType,
              }))
            );
          }
          setValue("loadderState", false);
        })
        .catch((error) => {
          setValue("loadderState", false);
          callCatchMethod(error, language);
        });
    }
  };

  // getHawkerLicenseData
  const getHawkerLicenseData = () => {
    setValue("loadderState", true);
    let url = ``;
    // issuance
    if (
      issuanceOfHawkerLicenseId != null &&
      issuanceOfHawkerLicenseId != undefined &&
      issuanceOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`;
    }
    // renewal
    else if (
      renewalOfHawkerLicenseId != null &&
      renewalOfHawkerLicenseId != undefined &&
      renewalOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/getById?id=${renewalOfHawkerLicenseId}`;
    }
    // cancellation
    else if (
      cancellationOfHawkerLicenseId != null &&
      cancellationOfHawkerLicenseId != undefined &&
      cancellationOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/cancellationOfHawkerLicense/getById?id=${cancellationOfHawkerLicenseId}`;
    }
    // transfer
    else if (
      transferOfHawkerLicenseId != null &&
      transferOfHawkerLicenseId != undefined &&
      transferOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/transferOfHawkerLicense/getById?id=${transferOfHawkerLicenseId}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          if (
            r?.data != null &&
            r?.data != undefined &&
            typeof r?.data != "string"
          ) {
            let finalData = {
              ...r?.data,
              disabledFieldInputState: true,
              loadderState: false,
              firstName:
                language == "en" ? r?.data?.firstName : r?.data?.firstNameMr,
              middleName:
                language == "en" ? r?.data?.middleName : r?.data?.middleNameMr,
              lastName:
                language == "en" ? r?.data?.lastName : r?.data?.lastNameMr,
            };
            reset(finalData);
            getDurationOfLicenseValiditys();
            getServiceCharges();
            setValue("loi.licenseDuration", "date of issuance");
            setValue("loi.dateOfIssuanceYear", new Date());
          }
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // Handle Next
  const handleNext = (data) => {
    setValue("loadderState", true);
    let url = ``;
    const data1 = data;
    // let loi;
    let finalBodyForApi;

    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      const loi = {
        ...data1?.loi,
        loiServiceCharges: watch("serviceCharges"),
        issuanceOfHawker: watch("id"),
      };

      finalBodyForApi = {
        ...data,
        loi,
        role: "LOI_GENERATION",
      };

      url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
    }

    // renewal
    else if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
      localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
      localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
      const loi = {
        ...data1?.loi,
        loiServiceCharges: watch("serviceCharges"),
        renewalOfHawker: watch("id"),
      };

      finalBodyForApi = {
        ...data,
        loi,
        role: "LOI_GENERATION",
      };

      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfHawkerLicenseApprove`;
    }

    // cancelltion
    else if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      const loi = {
        ...data1?.loi,
        loiServiceCharges: watch("serviceCharges"),
        issuanceOfHawker: watch("id"),
      };

      finalBodyForApi = {
        ...data,
        loi,
        role: "LOI_GENERATION",
      };
      url = `${urls.HMSURL}/cancellationOfHawkerLicense/saveCancellationOfHawkerLicenseApprove`;
    }

    // transfer
    else if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" &&
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
      const loi = {
        ...data1?.loi,
        loiServiceCharges: watch("serviceCharges"),
        issuanceOfHawker: watch("id"),
      };

      finalBodyForApi = {
        ...data,
        loi,
        role: "LOI_GENERATION",
      };
      url = `${urls.HMSURL}/transferOfHawkerLicense/saveTransferOfHawkerLicenseApprove`;
    }

    axios
      .post(url, finalBodyForApi, {
        headers: {
          role: "LOI_GENERATION",
          id: data?.id,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setValue("loadderState", false);
        if (res?.status == 200 || res?.status == 201) {
          sweetAlert({
            title: language == "en" ? "LOI!" : "LOI!",
            text:
              language == "en"
                ? "LOI successfully generated !!!"
                : "LOI यशस्वीरित्या व्युत्पन्न केले !!!",
            icon: "success",
            buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
          });
          router.push("/streetVendorManagementSystem/dashboards");
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  //! ===================> useEffects <================

  useEffect(() => {
    setValue("loadderState", true);
    getTitles();
    getserviceNames();
    getHawkerType();

    setValue("disabledFieldInputState", true);

    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      setIssuanceOfHawkerLicenseId(
        localStorage.getItem("issuanceOfHawkerLicenseId")
      );
    }

    // renewal
    else if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
      localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
      localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
      setRenewalOfHawkerLicenseId(
        localStorage.getItem("renewalOfHawkerLicenseId")
      );
    }

    // cancelltion
    else if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      setCancellationOfHawkerLicenseId(
        localStorage.getItem("cancellationOfHawkerLicenseId")
      );
    }

    // transfer
    else if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" &&
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
      setTransferOfHawkerLicenseId(
        localStorage.getItem("transferOfHawkerLicenseId")
      );
    } else {
      setValue("loadderState", false);
    }
  }, []);

  useEffect(() => {
    setValue("loadderState", true);
    setInputState(watch("inputState"));
    setValue("serviceCharges", serviceCharges);
    let total = 0;
    serviceCharges.forEach((data, index) => {
      total += data?.amount;
    });
    setValue("loi.totalAmount", total);
    setValue("loi.totalInWords", toWords.convert(total));
    setShrinkTemp(true);
    setValue("loadderState", false);
  }, [serviceCharges]);

  // License Validity -Based on Duration
  useEffect(() => {
    setValue("loadderState", true);
    setValue(
      "loi.durationOfLicenseValidity",
      durationOfLicenseValiditys?.find(
        (d) => d?.hawkerType == watch("hawkerType") &&
          d?.serviceId == watch("serviceId")
      )?.id
    );

    setValue("loadderState", false);
  }, [durationOfLicenseValiditys, watch("hawkerType")]);

  // api
  useEffect(() => {
    getHawkerLicenseData();
  }, [
    issuanceOfHawkerLicenseId,
    renewalOfHawkerLicenseId,
    cancellationOfHawkerLicenseId,
    transferOfHawkerLicenseId,
  ]);

  useEffect(() => { }, [shrinkTemp]);

  useEffect(() => {

  }, [watch("loi.durationOfLicenseValidity")]);

  // view
  return (
    <>
      <form onSubmit={handleSubmit(handleNext)}>
        {watch("loadderState") ? (
          <Loader />
        ) : (
          <>
            {shrinkTemp && (
              <ThemeProvider theme={theme}>
                <Paper
                  square
                  sx={{
                    padding: 1,
                    paddingTop: 5,
                    paddingBottom: 5,
                    backgroundColor: "white",
                  }}
                  elevation={5}
                >
                  {/** Main Heading */}
                  <Typography
                    variant="h5"
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      marginTop: "2px",
                    }}
                  >
                    <strong>{<FormattedLabel id="loiGeneration" />}</strong>
                  </Typography>
                  <br /> <br />
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
                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                      <FormControl
                        error={!!errors.serviceName}
                        sx={{ marginTop: 2 }}
                      >
                        <InputLabel
                          shrink={true}
                          id="demo-simple-select-standard-label"
                        >
                          {<FormattedLabel id="serviceName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled
                              sx={{ minWidth: "230px", width: "450px" }}
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
                          name="serviceId"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <TextField
                        disabled
                        sx={{ minWidth: "230px", width: "370px" }}
                        InputLabelProps={{ shrink: true }}
                        label=<FormattedLabel id="applicationNo" />
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
                                disabled
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    {<FormattedLabel id="applicationDate" />}
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
                          {errors?.applicationDate
                            ? errors.applicationDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                        <InputLabel
                          shrink={true}
                          id="demo-simple-select-standard-label"
                        >
                          {<FormattedLabel id="title" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              inputFormat="DD/MM/YYYY"
                              disabled
                              autoFocus
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="title" />}
                              id="demo-simple-select-standard"
                              labelId="id='demo-simple-select-standard-label'"
                            >
                              {titles &&
                                titles.map((title, index) => (
                                  <MenuItem key={index} value={title?.id}>
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
                        InputLabelProps={{ shrink: true }}
                        disabled
                        label={<FormattedLabel id="firstName" />}
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
                        InputLabelProps={{ shrink: true }}
                        disabled
                        label={<FormattedLabel id="middleName" />}
                        {...register("middleName")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        InputLabelProps={{ shrink: true }}
                        disabled
                        label={<FormattedLabel id="lastName" />}
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
                        InputLabelProps={{ shrink: true }}
                        disabled
                        label={<FormattedLabel id="emailAddress" />}
                        {...register("emailAddress")}
                        error={!!errors.emailAddress}
                        helperText={
                          errors?.emailAddress
                            ? errors.emailAddress.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        disabled
                        InputLabelProps={{ shrink: true }}
                        label={<FormattedLabel id="mobile" />}
                        {...register("mobile")}
                        error={!!errors.mobile}
                        helperText={
                          errors?.mobile ? errors.mobile.message : null
                        }
                      />
                    </Grid>
                  </Grid>
                  {(localStorage.getItem("cancellationOfHawkerLicenseId") ==
                    undefined ||
                    localStorage.getItem("cancellationOfHawkerLicenseId") ==
                    null ||
                    localStorage.getItem("cancellationOfHawkerLicenseId") ==
                    "") && (
                      <>
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
                              error={!!errors.hawkerType}
                              shrink={true}
                            >
                              <InputLabel
                                shrink={true}
                                id="demo-simple-select-standard-label"
                              >
                                <FormattedLabel id="hawkerType1" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled
                                    sx={{ width: 250 }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={<FormattedLabel id="hawkerType1" />}
                                  >
                                    {hawkerTypes &&
                                      hawkerTypes.map((hawkerType, index) => (
                                        <MenuItem
                                          key={index}
                                          value={hawkerType.id}
                                        >
                                          {hawkerType?.hawkerType}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="hawkerType"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.hawkerType
                                  ? errors.hawkerType.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                            <FormControl
                              variant="standard"
                              sx={{ m: 1, minWidth: 120 }}
                              error={!!errors.licenseType}
                              inputProps={{ shrink: true }}
                            >
                              <InputLabel
                                shrink={true}
                                id="demo-simple-select-standard-label"
                              >
                                {
                                  <FormattedLabel id="durationOfLicenseValidity" />
                                }
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled
                                    inputProps={{ shrink: true }}
                                    sx={{ width: 250 }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel id="durationOfLicenseValidity" />
                                  >
                                    {durationOfLicenseValiditys &&
                                      durationOfLicenseValiditys.map(
                                        (licenseValidity, index) => (
                                          <MenuItem
                                            key={index}
                                            value={licenseValidity?.id}
                                          >
                                            {licenseValidity?.licenseValidity}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="loi.durationOfLicenseValidity"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.licenseType
                                  ? errors.licenseType.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormControl flexDirection="row">
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                {<FormattedLabel id="licenseDuration" required />}
                              </FormLabel>

                              <Controller
                                name="loi.licenseDuration"
                                control={control}
                                defaultValue={"date of issuance"}
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
                                      label={
                                        <FormattedLabel id="financialYear" />
                                      }
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
                                      label={
                                        <FormattedLabel id="dateOfIssuance" />
                                      }
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

                          {/** date Of IssuanceYear */}
                          {watch("loi.licenseDuration") == "date of issuance" && (
                            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                              <FormControl
                                sx={{ marginTop: 0 }}
                                error={!!errors.dateOfIssuanceYear}
                              >
                                <Controller
                                  name="loi.dateOfIssuanceYear"
                                  control={control}
                                  defaultValue={new Date()}
                                  render={({ field }) => (
                                    <LocalizationProvider
                                      dateAdapter={AdapterMoment}
                                    >
                                      <DatePicker
                                        // disabled
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                          <span
                                            style={{ fontSize: 16, marginTop: 2 }}
                                          >
                                            {
                                              <FormattedLabel
                                                id="dateOfIssuance"
                                                required
                                              />
                                            }
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
                                  {errors?.dateOfIssuanceYear
                                    ? errors.dateOfIssuanceYear.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          )}
                        </Grid>
                      </>
                    )}
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
                  {serviceCharges.length > 0 && (
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
                                sx={{ width: "300px" }}
                                id="standard-basic"
                                key={serviceChargeId?.id}
                                disabled
                                label={
                                  <FormattedLabel id="serviceChargeTypeName" />
                                }
                                {...register(
                                  `serviceCharges.${index}.serviceChargeTypeName`
                                )}

                              />
                            </Grid>
                            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                              <TextField
                                sx={{ width: "240px" }}
                                id="standard-basic"
                                disabled
                                key={serviceChargeId.id}
                                label={<FormattedLabel id="chargeName" />}
                                {...register(
                                  `serviceCharges.${index}.chargeName`
                                )}
                              />
                            </Grid>
                            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                              <TextField
                                sx={{ width: "250px" }}
                                id="standard-basic"
                                disabled
                                key={serviceChargeId.id}
                                label={<FormattedLabel id="amount" />}
                                {...register(`serviceCharges.${index}.amount`)}
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
                    }}
                  >
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}></Grid>

                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label={<FormattedLabel id="totalCharges" />}
                        disabled
                        {...register("loi.totalAmount")}
                        error={!!errors.total}
                        helperText={errors?.total ? errors.total.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        sx={{ width: "250px" }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        label={<FormattedLabel id="totalInWords" />}
                        {...register("loi.totalInWords")}
                        error={!!errors.totalInWords}
                        helperText={
                          errors?.totalInWords
                            ? errors.totalInWords.message
                            : null
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
                        <Button
                          onClick={() => {
                            localStorage.removeItem(
                              "issuanceOfHawkerLicenseId"
                            );
                            router.push(
                              "/streetVendorManagementSystem/dashboards"
                            );
                          }}
                          type="button"
                          variant="contained"
                          color="primary"
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </ThemeProvider>
            )}
          </>
        )}
      </form>
    </>
  );
};

export default LoiGeneration;
