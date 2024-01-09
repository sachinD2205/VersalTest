import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
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
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

/** Author - Sachin Durge */
// LoiCollectionComponent
const PaymentCollection = () => {
  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [licenseTypes, setLicenseTypes] = useState([]);
  const [titles, setTitles] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
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

  // licenseTypes
  const getLicenseTypes = () => {
    const url = `${urls.HMSURL}/licenseValidity/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setLicenseTypes(
            r?.data?.licenseValidity?.map((row) => ({
              id: row?.id,
              licenseType: row?.licenseValidity,
              licenseTypeMr: row?.licenseValidity,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
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
        if (r?.status == 200 || res?.status == 201) {
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
  const getServiceNames = () => {
    const url = `${urls.CFCURL}/master/service/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
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

  // paymentTypes
  const getPaymentTypes = () => {
    const url = `${urls.CFCURL}/master/paymentType/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          let findPaymentType;
          if (
            localStorage.getItem("loggedInUser") == "DEPT_USER" ||
            localStorage.getItem("loggedInUser") == "departmentUser"
          ) {
            findPaymentType = r?.data?.paymentType?.find(
              (data) => data?.paymentType == "Offline "
            );
          } else if (localStorage.getItem("loggedInUser") == "citizenUser") {
            findPaymentType = r?.data?.paymentType?.find(
              (data) => data?.paymentType == "Online"
            );
          }
          setPaymentTypes([findPaymentType]);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // paymentModes
  const getPaymentModes = () => {
    const url = `${urls.HMSURL}/master/paymentMode/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          let paymentModeCash = r?.data?.paymentMode?.find(
            (data) => data?.paymentMode == "CASH"
          );
          setPaymentModes([paymentModeCash]);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };


  // hawker
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
            r?.data != undefined &&
            r?.data != null &&
            r?.data != "" &&
            typeof r?.data != "string"
          ) {
            const finalData = {
              ...r?.data,
              disabledFieldInputState: "true",
              loadderState: false,
            };
            reset(finalData);
            setShrinkTemp(true);
            setValue("loi.loiId", r?.data?.loi?.id);
            if (
              watch("loi.totalAmount") != null &&
              watch("loi.totalAmount") != undefined &&
              watch("loi.totalAmount") != ""
            ) {
              setValue(
                "paymentCollection.receiptAmount",
                watch("loi.totalAmount")
              );
              setValue("paymentCollection.receiptDate", new Date());
            }
          }
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };






  // getToPaymentGateWay
  const getToPaymentGateway = (payDetail) => {
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };




  // handleNext
  const handleNext = (data) => {
    setValue("loadderState", true);

    let url = ``;
    let finalBodyForApi;
    let finalPaymentBodyOnline;
    let ccAvenueKitLtp = null;


    ccAvenueKitLtp = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_HOST;


    if (watch("paymentCollection.paymentType") === "Online") {
      // issuance
      if (
        localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
        localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
        localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
      ) {
        finalPaymentBodyOnline = {
          currency: "INR",
          language: "EN",
          moduleId: "HMS",
          amount: watch("loi.totalAmount"),
          divertPageLink:
            "/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/pgSuccess",
          loiId: Number(watch("loi.loiId")),
          loiNo: watch("loi.loiNo"),
          ccAvenueKitLtp: ccAvenueKitLtp,
          serviceId: 24,
          emailAddress: watch("emailAddress"),
          applicationNo: watch("applicationNumber"),
          applicationId: Number(issuanceOfHawkerLicenseId),
          applicationSide: router?.query?.applicationSide,
          domain: window.location.hostname,
        };
      }



      // renewal
      else if (
        localStorage.getItem("renewalOfHawkerLicenseId") != null &&
        localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
        localStorage.getItem("renewalOfHawkerLicenseId") != undefined
      )
        finalPaymentBodyOnline = {
          currency: "INR",
          language: "EN",
          moduleId: "HMS",
          amount: watch("loi.totalAmount"),
          divertPageLink:
            "/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/pgSuccess",
          loiId: Number(watch("loi.loiId")),
          loiNo: watch("loi.loiNo"),
          ccAvenueKitLtp: ccAvenueKitLtp,
          serviceId: 25,
          emailAddress: watch("emailAddress"),
          applicationNo: watch("applicationNumber"),
          applicationId: Number(renewalOfHawkerLicenseId),
          applicationSide: router?.query?.applicationSide,
          domain: window.location.hostname,
        };
      // cancelltion
      else if (
        localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
        localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
        localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
      ) {
        finalPaymentBodyOnline = finalPaymentBodyOnline = {
          currency: "INR",
          language: "EN",
          moduleId: "HMS",
          amount: watch("loi.totalAmount"),
          divertPageLink:
            "/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/pgSuccess",
          loiId: Number(watch("loi.loiId")),
          loiNo: watch("loi.loiNo"),
          ccAvenueKitLtp: ccAvenueKitLtp,
          serviceId: 27,
          emailAddress: watch("emailAddress"),
          applicationNo: watch("applicationNumber"),
          applicationId: Number(cancellationOfHawkerLicenseId),
          applicationSide: router?.query?.applicationSide,
          domain: window.location.hostname,
        };
      }

      // transfer
      else if (
        localStorage.getItem("transferOfHawkerLicenseId") != null &&
        localStorage.getItem("transferOfHawkerLicenseId") != "" &&
        localStorage.getItem("transferOfHawkerLicenseId") != undefined
      ) {
        finalPaymentBodyOnline = finalPaymentBodyOnline = {
          currency: "INR",
          language: "EN",
          moduleId: "HMS",
          amount: watch("loi.totalAmount"),
          divertPageLink:
            "/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/pgSuccess",
          loiId: Number(watch("loi.loiId")),
          loiNo: watch("loi.loiNo"),
          ccAvenueKitLtp: ccAvenueKitLtp,
          serviceId: 26,
          emailAddress: watch("emailAddress"),
          applicationNo: watch("applicationNumber"),
          applicationId: Number(transferOfHawkerLicenseId),
          applicationSide: router?.query?.applicationSide,
          domain: window.location.hostname,
        };
      }


      axios
        .post(
          `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
          finalPaymentBodyOnline,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            getToPaymentGateway(res?.data);
          }
          setValue("loadderState", false);
        })
        .catch((error) => {
          setValue("loadderState", false);
          callCatchMethod(error, language);
        });
    } else {
      // issuance
      if (
        localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
        localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
        localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
      ) {
        finalBodyForApi = {
          ...data,
          role: "LOI_COLLECTION",
        };

        url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
      }

      // renewal
      else if (
        localStorage.getItem("renewalOfHawkerLicenseId") != null &&
        localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
        localStorage.getItem("renewalOfHawkerLicenseId") != undefined
      ) {
        finalBodyForApi = {
          ...data,
          role: "LOI_COLLECTION",
        };

        url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfHawkerLicenseApprove`;
      }

      // cancelltion
      else if (
        localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
        localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
        localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
      ) {
        finalBodyForApi = {
          ...data,
          role: "LOI_COLLECTION",
        };

        url = `${urls.HMSURL}/cancellationOfHawkerLicense/saveCancellationOfHawkerLicenseApprove`;
      }

      // transfer
      else if (
        localStorage.getItem("transferOfHawkerLicenseId") != null &&
        localStorage.getItem("transferOfHawkerLicenseId") != "" &&
        localStorage.getItem("transferOfHawkerLicenseId") != undefined
      ) {
        finalBodyForApi = {
          ...data,
          role: "LOI_COLLECTION",
        };

        url = `${urls.HMSURL}/transferOfHawkerLicense/saveTransferOfHawkerLicenseApprove`;
      }

      axios
        .post(url, finalBodyForApi, {
          headers: {
            role: "LOI_COLLECTION",
            id: data?.id,
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setValue("loadderState", false);
          if (res?.status == 200 || res?.status == 201) {
            sweetAlert({
              title: language == "en" ? "Payment!" : "पेमेंट!",
              text:
                language == "en"
                  ? "payment paid successfully !!!"
                  : "पेमेंट यशस्वीरित्या भरले  !!!",
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
    }
  };





  //! ======================> useEffects <=======================

  useEffect(() => {
    setValue("loadderState", true);
    getTitles();
    getPaymentTypes();
    getPaymentModes();
    getServiceNames();
    getLicenseTypes();
    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      setValue("loadderState", true);
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
      setValue("loadderState", true);
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
      setValue("loadderState", true);
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
      setValue("loadderState", true);
      setTransferOfHawkerLicenseId(
        localStorage.getItem("transferOfHawkerLicenseId")
      );
    } else {
      setValue("loadderState", false);
    }
  }, []);

  useEffect(() => {
    setValue("loadderState", true);

    setValue("paymentCollection.receiptAmount", watch("loi.totalAmount"));
    setValue("paymentCollection.receiptDate", new Date());

    setValue("loadderState", false);
  }, [
    watch("paymentCollection.paymentMode"),
    watch("loi.totalAmount"),
    watch("paymentCollection.paymentType"),
  ]);

  useEffect(() => { }, [
    watch("paymentCollection.receiptAmount"),
    watch("paymentCollection.receiptDate"),
  ]);

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

  // view
  return (
    <div>
      <ThemeProvider theme={theme}>
        <form onSubmit={handleSubmit(handleNext)}>
          {watch("loadderState") ? (
            <Loader />
          ) : (
            <div>
              {shrinkTemp && (
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
                  <Typography
                    variant="h5"
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      marginTop: "2px",
                    }}
                  >
                    <strong>
                      <FormattedLabel id="paymentCollection" />
                    </strong>
                  </Typography>
                  <br />
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
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="serviceName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled
                              sx={{ minWidth: "230px", width: "450px" }}
                              autoFocus
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Service Name *"
                              id="demo-simple-select-standard"
                              labelId="id='demo-simple-select-standard-label'"
                            >
                              {serviceNames &&
                                serviceNames.map((serviceName, index) => (
                                  <MenuItem
                                    key={index}
                                    value={serviceName.id}
                                  >
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
                                  <span
                                    style={{ fontSize: 16, marginTop: 2 }}
                                  >
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
                      <FormControl
                        error={!!errors.title}
                        sx={{ marginTop: 2 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="title" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              inputFormat="DD/MM/YYYY"
                              disabled
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
                        disabled
                        label={<FormattedLabel id="middleName" />}
                        {...register("middleName")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
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
                        label={<FormattedLabel id="mobile" />}
                        {...register("mobile")}
                        error={!!errors.mobile}
                        helperText={
                          errors?.mobile ? errors.mobile.message : null
                        }
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
                        disabled
                        label={<FormattedLabel id="loiNO" />}
                        {...register("loi.loiNo")}
                        error={!!errors.loiNO}
                        helperText={
                          errors?.loiNO ? errors.loiNO.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.loiDate}
                      >
                        <Controller
                          name="loi.loiDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span
                                    style={{ fontSize: 16, marginTop: 2 }}
                                  >
                                    <FormattedLabel id="loiDate" />
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
                          {errors?.loiDate ? errors.loiDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <FormControl
                        variant="standard"
                        sx={{ marginTop: 2 }}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.durationOfLicenseValidity}
                      >
                        <InputLabel
                          InputLabelProps={{ shrink: true }}
                          id="demo-simple-select-standard-label"
                        >
                          {<FormattedLabel id="durationOfLicenseValidity" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              InputLabelProps={{ shrink: true }}
                              disabled
                              sx={{ width: 230 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                <FormattedLabel id="durationOfLicenseValidity" />
                              }
                            >
                              {licenseTypes &&
                                licenseTypes.map((licenseType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={licenseType.id}
                                  >
                                    {licenseType.licenseType}
                                  </MenuItem>
                                ))}
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
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <TextField
                        disabled
                        label={<FormattedLabel id="totalCharges" />}
                        {...register("loi.totalAmount")}
                        error={!!errors.total}
                        helperText={
                          errors?.total ? errors.total.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <TextField
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
                      <FormControl
                        error={!!errors.paymentType}
                        sx={{ marginTop: 2 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="paymentType" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: "230px" }}
                              autoFocus
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label=<FormattedLabel id="paymentType" />
                              id="demo-simple-select-standard"
                              labelId="id='demo-simple-select-standard-label'"
                            >
                              {paymentTypes &&
                                paymentTypes.map((paymentType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={paymentType?.paymentType}
                                  >
                                    {language == "en"
                                      ? paymentType?.paymentType
                                      : paymentType?.paymentTypeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="paymentCollection.paymentType"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
                    </Grid>
                    {watch("paymentCollection.paymentType") == "Offline " ? (
                      <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                        <FormControl
                          error={!!errors.paymentMode}
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="paymentMode" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: "230px" }}

                                autoFocus
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label={<FormattedLabel id="paymentMode" />}
                                id="demo-simple-select-standard"
                                labelId="id='demo-simple-select-standard-label'"
                              >
                                {paymentModes &&
                                  paymentModes.map((paymentMode, index) => (
                                    <MenuItem
                                      key={index}
                                      value={paymentMode?.paymentMode}
                                    >
                                      {language == "en"
                                        ? paymentMode?.paymentMode
                                        : paymentMode?.paymentModeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="paymentCollection.paymentMode"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                      </Grid>
                    ) : (
                      ""
                    )}

                    {watch("paymentCollection.paymentMode") == "DD" && (
                      <>
                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                          <TextField

                            id="standard-basic"
                            label={<FormattedLabel id="bankName" />}
                            variant="standard"
                            {...register("paymentCollection.bankName")}
                            error={!!errors.bankName}
                            helperText={
                              errors?.bankName
                                ? errors.bankName.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                          <TextField

                            id="standard-basic"
                            label={<FormattedLabel id="bankAccountNo" />}
                            variant="standard"
                            {...register("paymentCollection.bankAccountNo")}
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

                            id="standard-basic"
                            label={<FormattedLabel id="ddNo" />}
                            variant="standard"
                            {...register("paymentCollection.dDNo")}
                            error={!!errors.dDNo}
                            helperText={
                              errors?.dDNo ? errors.dDNo.message : null
                            }
                          />
                        </Grid>

                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                          <FormControl
                            sx={{ marginTop: 0 }}
                            error={!!errors.dDDate}
                          >
                            <Controller
                              name="paymentCollection.dDDate"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span
                                        style={{
                                          fontSize: 16,
                                          marginTop: 2,
                                        }}
                                      >
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

                    {watch("paymentCollection.paymentMode") == "CASH" && (
                      <>
                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                          <TextField

                            id="standard-basic"
                            label={<FormattedLabel id="receiptAmount" />}
                            variant="standard"
                            disabled
                            {...register("paymentCollection.receiptAmount")}
                            error={!!errors.receiptAmount}
                            helperText={
                              errors?.receiptAmount
                                ? errors.receiptAmount.message
                                : null
                            }
                          />
                        </Grid>
                        {/***
                           <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <TextField
                              
                              id="standard-basic"
                              label={<FormattedLabel id="receiptNumber" />}
                              variant="standard"
                              {...register("paymentCollection.receiptNo")}
                              error={!!errors.receiptNo}
                              helperText={errors?.receiptNo ? errors.receiptNo.message : null}
                            />
                          </Grid>
                          */}

                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                          <FormControl
                            sx={{ marginTop: 0 }}
                            error={!!errors.receiptDate}
                          >
                            <Controller
                              name="paymentCollection.receiptDate"
                              control={control}
                              defaultValue={new Date()}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    disabled
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span
                                        style={{
                                          fontSize: 16,
                                          marginTop: 2,
                                        }}
                                      >
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
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Stack
                        direction="row"
                        spacing={5}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button type="submit">
                          {<FormattedLabel id="submit" />}
                        </Button>
                        <Button
                          onClick={() => {
                            localStorage.removeItem(
                              "issuanceOfHawkerLicenseId"
                            );
                            if (router.query.applicationSide == "Citizen") {
                              router.push({
                                pathname: `/dashboard`,
                              });
                            } else {
                              router.push(
                                "/streetVendorManagementSystem/dashboards"
                              );
                            }
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
              )}
            </div>
          )}
        </form>
      </ThemeProvider>
    </div>
  );
};

export default PaymentCollection;