import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { ToWords } from "to-words";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import urls from "../../../../../URLS/urls";
import styles from "./PaymentCollection.module.css";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import Loader from "../../../../../containers/Layout/components/Loader";

const Index = () => {
  let user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.user.token);

  const router = useRouter();
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const [totalWord, setTotalWord] = useState("zero");
  const [chargePerCopy, setChargePerCopy] = useState(0);
  const onlinModes = [
    {
      id: 1,
      paymentModePrefixMr: null,
      paymentModePrefix: "Test payment Mode Prefix ",
      fromDate: "2022-12-11",
      toDate: "2022-12-12",
      paymentModeMr: null,
      paymentMode: "UPI",
      paymentTypeId: null,
      remark: "remark",
      remarkMr: null,
      activeFlag: "Y",
    },
    {
      id: 2,
      paymentModePrefixMr: null,
      paymentModePrefix: "test payment mode prefix 2",
      fromDate: "2019-02-11",
      toDate: "2022-10-10",
      paymentModeMr: null,
      paymentMode: "Net Banking",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
  ];

  const toWords = new ToWords();

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

  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
    // router.push({
    //   pathname: `/dashboard`,
    // });

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      router.push(`/dashboard`);
    } else if (localStorage.getItem("loggedInUser") == "cfcUser") {
      router.push(`/CFC_Dashboard`);
    } else {
      router.push(`/lms/transactions/renewMembership/scrutiny`);
    }
  };

  useEffect(() => {
    if (router?.query?.id) {
      setLoading(true);
      axios
        .get(
          `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          setLoading(false);
          setChargePerCopy(r.data.serviceCharge?.amount);
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  }, []);

  useEffect(() => {
    if (total) {
      if (router.query.serviceId != 9) {
        console.log("total", total, typeof total);
        setTotalWord(toWords.convert(total));
      }
    }
  }, [total]);

  useEffect(() => {
    if (watch("charges")) {
      if (watch("charges") == undefined || watch("charges") === 0) {
        setTotalWord("zero");
      } else {
        setTotalWord(toWords.convert(watch("charges")));
      }
    } else {
      setTotalWord("zero");
    }
  }, [watch("charges")]);

  useEffect(() => {
    console.log("deid");
    let tempCharges = watch("noOfCopies") * chargePerCopy;
    setValue("charges", tempCharges);
  }, [watch("noOfCopies")]);

  const validatePay = () => {
    if (
      watch("accountNumber") === undefined ||
      watch("accountNumber") === "" ||
      watch("bankName") === undefined ||
      watch("bankName") === "" ||
      watch("branchName") === undefined ||
      watch("branchName") === "" ||
      watch("ifsc") === undefined ||
      watch("ifsc") === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getToPaymentGateway = (payDetail) => {
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };

  const handleExit = () => {
    swal(
      language == "en" ? "Exit!" : "बाहेर पडा",
      language == "en"
        ? "Successfully Exited From Payment!!"
        : "पेमेंटमधून यशस्वीरित्या बाहेर पडले!",
      "success"
    );
    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      router.push(`/dashboard`);
    } else if (localStorage.getItem("loggedInUser") == "cfcUser") {
      router.push(`/CFC_Dashboard`);
    } else {
      router.push(`/lms/transactions/renewMemberships/scrutiny`);
    }
    // if (router.query.applicationSide == "Citizen") {
    //   router.push({
    //     pathname: `/dashboard`,
    //   });
    // } else {
    //   router.push("/lms/transactions/renewMemberships/scrutiny");
    // }
  };

  const handlePay = () => {
    setLoading(true);
    // setValue("payment.amount", dataa?.amount);
    setValue("payment.amount", dataa?.loiDao?.amount);
    console.log(" dataa?.id", dataa?.id);
    const finalBody = {
      id: Number(dataa?.id),
      // role: 'CASHIER',
      // loi: getValues('loi'),
      paymentDao: getValues("payment"),
    };
    // router.push({
    //   pathname:
    //     '/lms/transactions/newMembershipRegistration/scrutiny/ServiceChargeRecipt',
    //   query: {
    //     id: router?.query?.id
    //   },
    // })
    // accountNumber: getValues('accountNumber'),
    // bankName: getValues('bankName'),
    // branchName: getValues('branchName'),
    // ifscCode: getValues('ifsc'),
    // console.log('Search Body', finalBody)
    // router.push({
    //   pathname: '/marriageRegistration/Receipts/ServiceChargeRecipt',
    //   query: {
    //     ...router?.query,
    //   },
    // })
    let ccAvenueKitLtp = null;

    ccAvenueKitLtp = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_HOST;

    let testBody = {
      currency: "INR",
      language: "EN",
      moduleId: "LMS",
      amount: watch("payment.amount"),
      divertPageLink: "/lms/transactions/renewMembership/scrutiny/pgSuccess",
      loiId: "0",
      loiNo: "123456",
      ccAvenueKitLtp: ccAvenueKitLtp,
      serviceId: 90,
      applicationNo: router?.query?.applicationNumber,
      applicationId: Number(router?.query?.id),
      applicationSide: router?.query?.applicationSide,
      domain: window.location.hostname,
    };
    console.log("testBody", testBody);

    if (localStorage.getItem("loggedInUser") == "cfcUser") {
      let cfcBody = {
        cfcId: user?.userDao?.cfc,
        serviceId: 85,
        moduleId: "LMS",
        paymentAmount: watch("payment.amount"),
        appId: 13,
      };
      console.log("cfcBody", cfcBody);
      let _finalBody = {
        id: Number(dataa?.id),
        serviceId: 90,
        paymentDao: {
          ...getValues("payment"),
          paymentType: "cash",
          paymentMode: "online",
        },
      };
      console.log("_finalBody", _finalBody);
      // axios
      //   .post(
      //     `${urls.CFCURL}/trasaction/cfcPaymentDetails/save`,
      //     cfcBody
      //   )
      //   .then((res) => {
      //     if (res.status == 200 || res.status == 201) {
      //       // let tempBody = {
      //       //   encRequest: res.data.encRequest,
      //       //   access_code: res.data.access_code,
      //       // };
      //       // getToPaymentGateway(res.data);
      //     }
      //   });
      axios
        .post(
          `${urls.LMSURL}/trnRenewalOfMembership/processPaymentCollection`,
          _finalBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          console.log(res);
          if (res.status == 200 || res.status == 201) {
            swal(
              language == "en" ? "Submitted!" : "सादर केले!",
              language == "en"
                ? "Payment Collected successfully!"
                : "पेमेंट यशस्वीरित्या गोळा केले!",
              "success"
            );
            router.push({
              pathname:
                "/lms/transactions/renewMembership/scrutiny/ServiceChargeRecipt",
              query: {
                id: router?.query?.id,
                applicationSide: router?.query?.applicationSide,
              },
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          swal(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en" ? "Somethings Wrong!" : "काहीतरी चुकीचे!",
            "error"
          );
          // router.push("/lms/transactions/renewMembership/scrutiny");
          backToHomeButton();
        });
    } else if (watch("payment.paymentType") === "Online") {
      setLoading(true);
      axios
        .post(
          // `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
          // `${urls.CFCURL}/transaction/paymentCollection/initiatePaymentV1`,
          // `${urls.CFCURL}/payment/transaction/paymentCollection/initiatePaymentV1`,
          `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
          testBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res.status == 200 || res.status == 201) {
            let tempBody = {
              encRequest: res.data.encRequest,
              access_code: res.data.access_code,
            };

            // let urltemp = res.data.url;
            // window.location(urltemp);

            // setPayDetail(res.data)

            getToPaymentGateway(res.data);

            // router.push(urltemp)
            // router.push({
            //   pathname:
            //   urltemp,
            //   query:tempBody,
            // })
            // axios
            //   .post(
            //     `${urltemp}`,
            //     tempBody,
            //   )
            //   .then((res1) => {
            //     swal('Payement Screen')

            //   })
          }
        });
    } else {
      axios
        .post(
          `${urls.LMSURL}/trnRenewalOfMembership/processPaymentCollection`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          console.log(res);
          if (res.status == 200 || res.status == 201) {
            swal(
              language == "en" ? "Submitted!" : "सादर केले!",
              language == "en"
                ? "Payment Collected successfully!"
                : "पेमेंट यशस्वीरित्या गोळा केले!",
              "success"
            );
            router.push({
              pathname:
                "/lms/transactions/renewMembership/scrutiny/ServiceChargeRecipt",
              query: {
                id: router?.query?.id,
                applicationSide: router?.query?.applicationSide,
              },
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          swal(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en" ? "Somethings Wrong!" : "काहीतरी चुकीचे!",
            "error"
          );
          // router.push("/lms/transactions/renewMembership/scrutiny");
          backToHomeButton();
        });
    }
  };

  const language = useSelector((state) => state?.labels.language);

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setPaymentTypes(r?.data?.paymentType ?? []);
        // -----------------------------------------------------------------------
        // if (router.query.applicationSide == "Citizen") {
        //   let tempArr = [];
        //   r.data.paymentType.forEach((row) => {
        //     if (row.paymentType == "Online") {
        //       tempArr.push({
        //         id: row.id,
        //         paymentType: row.paymentType,
        //         paymentTypeMr: row.paymentTypeMr,
        //       });
        //     }
        //   });
        //   console.log("aala citizen", tempArr);

        //   setPaymentTypes(tempArr);
        // } else {
        //   // setPaymentTypes(
        //   //   r.data.paymentType.map((row) => ({
        //   //     id: row.id,
        //   //     paymentType: row.paymentType,
        //   //     paymentTypeMr: row.paymentTypeMr,
        //   //   })),
        //   // )
        //   let tempArr = [];
        //   r.data.paymentType.forEach((row) => {
        //     if (row.paymentType !== "Online") {
        //       tempArr.push({
        //         id: row.id,
        //         paymentType: row.paymentType,
        //         paymentTypeMr: row.paymentTypeMr,
        //       });
        //     }
        //   });
        //   console.log("aala citizen", tempArr);

        //   setPaymentTypes(tempArr);
        // }
        // -----------------------------------------------------------------------
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const [paymentModes, setPaymentModes] = useState([]);
  const [pmode, setPmode] = useState([]);
  const getPaymentModes = () => {
    axios
      .get(`${urls.BaseURL}/paymentMode/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setPmode(
          r.data.paymentMode.map((row) => ({
            id: row.id,
            paymentMode: row.paymentMode,
            paymentModeMr: row.paymentModeMr,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const [dataa, setDataa] = useState(null);

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    sendIdForOfferApplicableOrNot();
  }, []);

  useEffect(() => {
    console.log("paymenttype", watch("payment.paymentType"));
    if (watch("payment.paymentType") === "Online") {
      setPaymentModes(onlinModes);
    } else {
      setPaymentModes(pmode);
    }
  }, [watch("payment.paymentType")]);
  // const [data, setdata] = useState()

  const sendIdForOfferApplicableOrNot = () => {
    if (router?.query?.id) {
      let _id = { id: Number(router?.query?.id) };
      axios
        .post(
          `${urls.LMSURL}/trnRenewalOfMembership/checkingDiscountBeforePayment`,
          _id,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201 || res?.status == 200) {
            getIsOfferApplicableOrNot();
          }
        })
        .catch((error) => {
          // setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  const getIsOfferApplicableOrNot = () => {
    if (router?.query?.id) {
      axios
        .get(
          `${urls.LMSURL}/trnRenewalOfMembership/getByIdAndServiceId?id=${
            router?.query?.id
          }&serviceId=${90}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          reset(res.data);
          setDataa(res.data);
          console.log("board data", res.data);
        })
        .catch((error) => {
          // setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    let chargeee = null;
    if (router.query.serviceId == 10) {
      chargeee = Number(dataa?.serviceCharge) + Number(dataa?.penaltyCharge);
      console.log("nmr");
    } else if (router.query.serviceId == 14) {
      console.log("rmbc");
      chargeee = Number(dataa?.serviceCharge);
    } else {
      console.log("nono");
    }
    console.log("serviceID", router.query.serviceId);
    setTotal(chargeee);
    console.log("charges", chargeee);
  }, [dataa]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <Paper
            sx={{
              marginLeft: 10,
              marginRight: 2,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
              border: 2,
              borderColor: "black.500",
            }}
          >
            {/* <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="paymentCollection" />}
              </h3>
            </div>
          </div> */}
            <LmsHeader
              language={language}
              enName="Payment Collection"
              mrName="पेमेंट संकलन"
            />
            <div className={styles.appDetails}>
              {/* <div className={styles.row} >
                            <div > */}
              <h4>अर्जाचा क्रमांक : {dataa?.applicationNumber}</h4>
              {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
              <h4>अर्जादारचे नाव :{" " + dataa?.applicantNameMr}</h4>
              {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
              <h4>
                अर्ज दिनांक :{" "}
                {moment(dataa?.applicationDate).format("DD-MM-YYYY")}
              </h4>
              {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
              {/* </div>
                        </div> */}
              <div className={styles.row5}></div>
              {/* <h4>एकुण रक्कम : {dataa?.amount}&nbsp;रु</h4> */}
              <h4>एकुण रक्कम : {dataa?.loiDao?.amount}&nbsp;रु</h4>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम(रु)</th>
                  </tr>
                  <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>{dataa?.serviceNameMr}</td>
                    <td colSpan={4}>{dataa?.amount}</td>
                  </tr>
                  {dataa?.loiDao?.isDiscount == true && (
                    <tr>
                      <td colSpan={4}>2)</td>
                      <td colSpan={4}>सवलत</td>
                      <td colSpan={4}>-{dataa?.loiDao?.discountAmount}</td>
                    </tr>
                  )}
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      {/* <b>एकूण रक्कम : {dataa?.amount}/-</b> */}
                      <b>एकूण रक्कम : {dataa?.loiDao?.amount}/-</b>
                    </td>
                  </tr>
                </tbody>
              </table>
              {localStorage.getItem("loggedInUser") != "cfcUser" && (
                <div
                  className={styles.details}
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      <FormattedLabel id="paymentDetails" />
                      {/* Payment Details */}
                    </h3>
                  </div>
                </div>
              )}
              {localStorage.getItem("loggedInUser") != "cfcUser" && (
                <Grid
                  container
                  sx={{
                    marginTop: 1,
                    marginBottom: 5,
                    // paddingLeft: '50px',
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
                        {/* Payment Type */}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: "230px" }}
                            // // dissabled={inputState}
                            autoFocus
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="paymentType" />}
                            // label="Payment Type"
                            id="demo-simple-select-standard"
                            labelId="id='demo-simple-select-standard-label'"
                          >
                            {paymentTypes &&
                              paymentTypes.map((paymentType, index) => (
                                <MenuItem
                                  key={index}
                                  value={paymentType.paymentType}
                                >
                                  {language == "en"
                                    ? paymentType?.paymentType
                                    : paymentType?.paymentTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="payment.paymentType"
                        control={control}
                        defaultValue=""
                      />
                    </FormControl>
                  </Grid>
                  {watch("payment.paymentType") == "Offline " ? (
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <FormControl
                        error={!!errors.paymentMode}
                        sx={{ marginTop: 2 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="paymentMode" />}
                          {/* Payment Mode */}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: "230px" }}
                              // // dissabled={inputState}
                              autoFocus
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label={<FormattedLabel id="paymentMode" />}
                              // label="Payment Mode"
                              id="demo-simple-select-standard"
                              labelId="id='demo-simple-select-standard-label'"
                            >
                              {paymentModes &&
                                paymentModes.map((paymentMode, index) => (
                                  <MenuItem
                                    key={index}
                                    value={paymentMode.paymentMode}
                                  >
                                    {language == "en"
                                      ? paymentMode?.paymentMode
                                      : paymentMode?.paymentModeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="payment.paymentMode"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
                    </Grid>
                  ) : (
                    ""
                  )}

                  {watch("payment.paymentMode") == "DD" && (
                    <>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="bankName" />}
                          // label="Bank Name"
                          variant="standard"
                          {...register("payment.bankName")}
                          error={!!errors.bankName}
                          helperText={
                            errors?.bankName ? errors.bankName.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="bankAccountNumber" />}
                          // label="Bank Account No"
                          variant="standard"
                          {...register("payment.accountNo")}
                          error={!!errors.accountNo}
                          helperText={
                            errors?.accountNo ? errors.accountNo.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="ddNo" />}
                          // label="DD No"
                          variant="standard"
                          {...register("payment.ddNo")}
                          error={!!errors.ddNo}
                          helperText={errors?.ddNo ? errors.ddNo.message : null}
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <FormControl
                          sx={{ marginTop: 0 }}
                          error={!!errors.dDDate}
                        >
                          <Controller
                            name="payment.ddDate"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      <FormattedLabel id="ddDate" />
                                      {/* DD Date */}
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
                            {errors?.ddDate ? errors.ddDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {watch("payment.paymentMode") == "CASH" && (
                    <>
                      {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      label={<FormattedLabel id="receiptAmount" />}
                      variant="standard"
                      {...register('payment.receiptAmount')}
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
                      {...register('payment.receiptNo')}
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
                        name="payment.receiptDate"
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
                                  moment(date).format('YYYY-MM-DD'),
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
                  </Grid> */}
                    </>
                  )}

                  {watch("payment.paymentMode") == "UPI" && (
                    <>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="upiId" />}
                          // label="UPI ID"
                          variant="standard"
                          {...register("payment.upiId")}
                          error={!!errors.upiId}
                          helperText={
                            errors?.upiId ? errors.upiId.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.upilist}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* UPI LIST */}
                            {<FormattedLabel id="upiList" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Status at time of marriage *"
                              >
                                <MenuItem value={1}>@ybl</MenuItem>
                                <MenuItem value={2}>@okaxis</MenuItem>
                                <MenuItem value={3}>@okicici</MenuItem>
                              </Select>
                            )}
                            name="upilist"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.upilist ? errors.upilist.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {watch("payment.paymentMode") == "Net Banking" && (
                    <>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          //  disabled
                          sx={{ width: 230 }}
                          id="standard-basic"
                          label={<FormattedLabel id="bankName" required />}
                          // label="Bank Name"
                          variant="standard"
                          {...register("bankName")}
                          // error={!!errors.aFName}
                          // helperText={errors?.aFName ? errors.aFName.message : null}
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          //disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="branchName" />}
                          // label="Branch Name"
                          variant="standard"
                          {...register("branchName")}
                          error={!!errors.branchName}
                          helperText={
                            errors?.branchName
                              ? errors.branchName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          //  disabled
                          sx={{ width: 230 }}
                          id="standard-basic"
                          label={<FormattedLabel id="bankIFSC" required />}
                          // label="IFSC"
                          variant="standard"
                          {...register("ifsc")}
                          // error={!!errors.aFName}
                          // helperText={errors?.aFName ? errors.aFName.message : null}
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          //  disabled
                          sx={{ width: 230 }}
                          id="standard-basic"
                          label={<FormattedLabel id="accountNumber" required />}
                          // label="Account No"
                          variant="standard"
                          {...register("accountNumber")}
                          // error={!!errors.aFName}
                          // helperText={errors?.aFName ? errors.aFName.message : null}
                        />
                      </Grid>
                    </>
                  )}
                  {watch("payment.paymentMode") == "CHEQUE" && (
                    <>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="bankName" />}
                          variant="standard"
                          {...register("payment.bankName")}
                          error={!!errors.bankName}
                          helperText={
                            errors?.bankName ? errors.bankName.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="bankAccountNo" />}
                          variant="standard"
                          {...register("payment.accountNo")}
                          error={!!errors.accountNo}
                          helperText={
                            errors?.accountNo ? errors.accountNo.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          label={<FormattedLabel id="chequeNo" />}
                          variant="standard"
                          {...register("payment.chequeNo")}
                          error={!!errors.ddNo}
                          helperText={errors?.ddNo ? errors.ddNo.message : null}
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <FormControl
                          sx={{ marginTop: 0 }}
                          error={!!errors.dDDate}
                        >
                          <Controller
                            name="payment.chequeDate"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      <FormattedLabel id="chequeDate" />
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
                            {errors?.ddDate ? errors.ddDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                </Grid>
              )}
              <div style={{ marginTop: "50px" }}>
                <div className={styles.row4}>
                  <div>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      //disabled={validatePay()}
                      disabled={
                        watch("payment.paymentType") ||
                        localStorage.getItem("loggedInUser") == "cfcUser"
                          ? false
                          : true
                      }
                      onClick={() => {
                        handlePay();
                      }}
                    >
                      {<FormattedLabel id="pay" />}
                      {/* Pay */}
                    </Button>
                  </div>
                  <div>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      // disabled={validateSearch()}

                      onClick={() => {
                        swal({
                          title: language == "en" ? "Exit?" : "बाहेर पडा?",
                          text:
                            language == "en"
                              ? "Are you sure you want to exit this Record?"
                              : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            swal(
                              language == "en"
                                ? "Successfully Exited From Record !"
                                : "रेकॉर्डमधून यशस्वीरित्या बाहेर पडले!",
                              {
                                icon: "success",
                              }
                            );
                            handleExit();
                          } else {
                            swal(
                              language == "en"
                                ? "Record is Safe"
                                : "रेकॉर्ड सुरक्षित आहे"
                            );
                          }
                        });
                      }}
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        </ThemeProvider>
      )}
    </>
  );
};

export default Index;
