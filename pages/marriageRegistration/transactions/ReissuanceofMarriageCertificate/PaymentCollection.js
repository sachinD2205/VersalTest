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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { ToWords } from "to-words";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import styles from "./PaymentCollection.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  let user = useSelector((state) => state.user.user);
  const router = useRouter();
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { noOfCopies: 1 },
  });

  const [total, setTotal] = useState();
  const [totalWord, setTotalWord] = useState("zero");
  const [chargePerCopy, setChargePerCopy] = useState(0);
  const onlinModes = [
    {
      id: 1,
      paymentModePrefixMr: null,
      paymentModePrefix: "Test payment Mode Prefix ",
      fromDate: "2022-12-11",
      toDate: "2022-12-12",
      paymentModeMr: "यु पी ई",
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
      paymentModeMr: "नेट बँकिंग",
      paymentMode: "NET BANKING",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
    {
      id: 3,
      paymentModePrefixMr: null,
      paymentModePrefix: "test payment mode prefix 2",
      fromDate: "2019-02-11",
      toDate: "2022-10-10",
      paymentModeMr: "कार्ड पेमेंट",
      paymentMode: "CARD PAYMENT",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
  ];
  const language = useSelector((state) => state?.labels.language);
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
  // let user = useSelector((state) => state.user.user);
  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=11`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setChargePerCopy(r.data.serviceCharge[0].amount);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
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
    let tempCharges;
    if (watch("noOfCopies") > 1) {
      tempCharges = watch("noOfCopies") * chargePerCopy;
    } else if (watch("noOfCopies") == 1) {
      tempCharges = 20;
    } else {
      tempCharges = 20;
    }
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

  const [cfcDetail, setCfcDetail] = useState({});

  const getCfcUserDetails = () => {
    let cfcId = user?.userDao?.cfc;
    if (cfcId) {
      axios
        .get(`${urls.CFCURL}/master/cfcCenters/getByCfcId?cfcId=${cfcId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          console.log("cfcDetail", r?.data);
          setCfcDetail(r?.data);
        })
        .catch((e) => {
          console.log("error", e);
        });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("loggedInUser") == "cfcUser") {
      getCfcUserDetails();
    }
  }, [localStorage.getItem("loggedInUser")]);

  const handleExit = () => {
    swal(
      language == "en" ? "Exit ! " : "बाहेर पडा!",
      language == "en"
        ? "Successfully Exitted  Payment!"
        : "पेमेंट यशस्वीरित्या बाहेर पडले!",
      "success",
    );
    // router.push(
    //   `/marriageRegistration/transactions/ReissuanceofMarriageCertificate`,
    // );
    localStorage.loggedInUser == "departmentUser"
      ? router.push(
          "/marriageRegistration/transactions/ReissuanceofMarriageCertificate",
        )
      : router.push("/dashboard");
  };

  // const getToPaymentGateway = (payDetail) => {

  //   document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
  //   <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
  //   <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
  //   document.getElementById("dynForm").submit();
  // };
  const getToPaymentGateway = (payDetail) => {
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };
  const handlePay = () => {
    setValue("payment.amount", watch("charges"));
    console.log("dataa1111", dataa);
    console.log(" dataa?.id", dataa?.id, getValues("payment"));
    const finalBody = {
      id: Number(dataa?.id),
      // role: 'CASHIER',
      // loi: getValues('loi'),
      payment: getValues("payment"),
      applicationSide: "Citizen",
    };

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
    if (watch("payment.paymentType") === "Online") {
      console.log("offline");

      let ccAvenueKitLtp = null;
      switch (location.hostname) {
        case "localhost":
          ccAvenueKitLtp = "L";
          break;
        case "noncoredev.pcmcindia.gov.in":
          ccAvenueKitLtp = "T";
          break;
        case "noncoreuat.pcmcindia.gov.in":
          ccAvenueKitLtp = "T";
          break;
        default:
          ccAvenueKitLtp = "L";
          break;
      }
      let testBody = {
        currency: "INR",
        language: "EN",
        moduleId: "MR",
        amount: watch("payment.amount"),
        divertPageLink:
          "marriageRegistration/transactions/newMarriageRegistration/scrutiny/pgSuccess",
        ccAvenueKitLtp: ccAvenueKitLtp,
        serviceId: 11,
        // applicationNo: Number(dataa?.id),
        applicationNo: router?.query?.applicationNumber,
        applicationId: Number(router?.query?.applicationId),
        domain: window.location.hostname,
        // applicationId:router?.query?.applicationNumber
      };
      if (watch("payment.paymentType") === "Online") {
        axios
          .post(
            `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
            // `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
            testBody,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              let tempBody = {
                encRequest: res.data.encRequest,
                access_code: res.data.access_code,
              };

              // let urltemp = res.data.url;
              // window.location(urltemp);

              // setPayDetail(res.data)
              localStorage.setItem("selectedServiceId", 11);
              localStorage.setItem(
                "selectedApplicationId",
                router?.query?.applicationId,
                // testBody.applicationId,
              );
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
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    } else {
      console.log("offline");
      axios
        .post(
          `${urls.MR}/transaction/reIssuanceM/saveApplicationApprove`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          console.log("res123", res);
          swal(
            language == "en" ? "Submitted!" : "सबमिट केले!!",
            language == "en"
              ? "Payment Collected successfully !"
              : "पेमेंट यशस्वीरित्या गोळा केले गेले!",
            "success",
          );
          router.push({
            pathname:
              "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
            query: {
              ...router?.query,
            },
          });
        })
        .catch((error) => {
          callCatchMethod(error, language);
          router.push(
            `/marriageRegistration/transactions/ReissuanceofMarriageCertificate`,
          );
        });
    }
  };

  const [paymentTypes, setPaymentTypes] = useState([]);

  // const getPaymentTypes = () => {
  //   axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((r) => {
  //     setPaymentTypes(
  //       r.data.paymentType.map((row) => ({
  //         id: row.id,
  //         paymentType: row.paymentType,
  //         paymentTypeMr: row.paymentTypeMr,
  //       })),
  //     );
  //   });
  // };
  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (localStorage.getItem("loggedInUser") == "citizenUser") {
          let tempArr = [];
          r.data.paymentType.forEach((row) => {
            if (row.paymentType == "Online") {
              tempArr.push({
                id: row.id,
                paymentType: row.paymentType,
                paymentTypeMr: row.paymentTypeMr,
              });
            }
          });
          console.log("aala citizen", tempArr);

          setPaymentTypes(tempArr);
        } else {
          // setPaymentTypes(
          //   r.data.paymentType.map((row) => ({
          //     id: row.id,
          //     paymentType: row.paymentType,
          //     paymentTypeMr: row.paymentTypeMr,
          //   })),
          // )
          let tempArr = [];
          r.data.paymentType.forEach((row) => {
            if (row.paymentType !== "Online") {
              tempArr.push({
                id: row.id,
                paymentType: row.paymentType,
                paymentTypeMr: row.paymentTypeMr,
              });
            }
          });
          console.log("aala citizen", tempArr);

          setPaymentTypes(tempArr);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const [paymentModes, setPaymentModes] = useState([]);
  const [pmode, setPmode] = useState([]);
  const getPaymentModes = () => {
    axios
      .get(`${urls.BaseURL}/paymentMode/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setPmode(
          r.data.paymentMode.map((row) => ({
            id: row.id,
            paymentMode: row.paymentMode,
            paymentModeMr: row.paymentModeMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [dataa, setDataa] = useState(null);

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
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

  useEffect(() => {
    console.log("inside1233");
    if (router?.query?.serviceId == 11) {
      axios
        .get(
          `${urls.MR}/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${router?.query?.id}&serviceId=${router.query.serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          reset(res.data);
          setDataa(res.data);
          console.log("board data", res.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, []);

  // useEffect(() => {
  //     let chargeee = null;
  //     if (router.query.serviceId == 10) {
  //         chargeee = Number(dataa?.serviceCharge) + Number(dataa?.penaltyCharge)
  //         console.log("nmr");
  //     } else if (router.query.serviceId == 14) {
  //         console.log("rmbc");
  //     } else {
  //         console.log("nono");

  //     }
  //     console.log('serviceID', router.query.serviceId)
  //     setTotal(chargeee)
  //     console.log('charges', chargeee)
  // }, [dataa])

  return (
    <>
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
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {language === "en" ? "Payment Collection" : "पेमेंट संकलन"}
              </h3>
            </div>
          </div>
          <div className={styles.appDetails}>
            <h4>अर्जाचा क्रमांक : {dataa?.applicationNumber}</h4>

            <h4>
              अर्जादारचे नाव :{" " + dataa?.afNameMr + " " + dataa?.alNameMr}
            </h4>

            <h4>
              अर्जाची दिनांक :
              {moment(dataa?.applicationDate).format("DD-MM-YYYY")}
            </h4>

            {/* <TextField
              //  disabled

              sx={{ width: 230 }}
              id="standard-basic"
              // defaultValue={"abc"}
              label={<FormattedLabel id="noOfCopies" />}
              variant="standard"
              // onChange={(event) => {
              //   console.log("valuess", event.target.value)
              //   let tempCharges = event.target.value * chargePerCopy;

              //   setValue(
              //     'charges',
              //     tempCharges
              //   )
              // }}
              // onChange={(e)=> {
              //   console.log("log1",e);
              // }}

              {...register("noOfCopies")}
            /> */}
            <div className={styles.row5}></div>
            <h4>एकुण रक्कम रुपये: २० /-</h4>

            {/* {router.query.serviceId != 9 ? (
                <div style={{ paddingLeft: '40px' }}>
                  <h4>1)Service Charge : { dataa?.serviceCharge}</h4>
                  <h4>2)Penalty Charge : { dataa?.penaltyCharge}</h4>
                </div>
              ) : (
                ''
              )}
              */}
            {/* <div>
              <h4>
                Total Amount to be paid :{" "}
                {router.query.serviceId == 11 ? watch("charges") : total}
              </h4>
              <h4>Total Amount to be paid in Words : {totalWord}</h4>
            </div> */}

            <div>
              <h4>
                {language == "en"
                  ? " Total Amount to be paid :"
                  : "भरायची एकूण रक्कम :"}{" "}
                {router.query.serviceId == 11 ? watch("charges") : total}
              </h4>
              <h4>
                {language == "en"
                  ? "Total Amount to be paid in Words :"
                  : "शब्दांमध्ये भरावी लागणारी एकूण रक्कम:"}{" "}
                {totalWord}
              </h4>
            </div>
            {/* <div
                style={{
                  backgroundColor: '#0084ff',
                  color: 'white',
                  fontSize: 19,
                  marginTop: 30,
                  marginBottom: 30,
                  padding: 8,
                  paddingLeft: 30,
                  marginLeft: '40px',
                  marginRight: '40px',
                  borderRadius: 100,
                }}
              >
                <strong>
                  <FormattedLabel id="receiptModeDetails" />
                </strong>
              </div> */}
            <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: "white",
                    marginTop: "7px",
                  }}
                >
                  <FormattedLabel id="receiptModeDetails" />
                </h3>
              </div>
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
                <FormControl error={!!errors.paymentType} sx={{ marginTop: 2 }}>
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
              <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                <FormControl error={!!errors.paymentMode} sx={{ marginTop: 2 }}>
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

              {watch("payment.paymentMode") == "DD" && (
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
                      label={<FormattedLabel id="ddNo" />}
                      variant="standard"
                      {...register("payment.ddNo")}
                      error={!!errors.ddNo}
                      helperText={errors?.ddNo ? errors.ddNo.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <FormControl sx={{ marginTop: 0 }} error={!!errors.dDDate}>
                      <Controller
                        name="payment.ddDate"
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
                                  moment(date).format("YYYY-MM-DD"),
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
              {watch("payment.paymentMode") == "CHEUQE" && (
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
                      label={<FormattedLabel id="cheuqeNo" />}
                      variant="standard"
                      {...register("payment.ddNo")}
                      error={!!errors.ddNo}
                      helperText={errors?.ddNo ? errors.ddNo.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <FormControl sx={{ marginTop: 0 }} error={!!errors.dDDate}>
                      <Controller
                        name="payment.ddDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 2 }}>
                                  <FormattedLabel id="cheuqeDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD"),
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
                      // label={<FormattedLabel id="bankName" />}
                      label="UPI ID"
                      variant="standard"
                      {...register("payment.upiId")}
                      error={!!errors.upiId}
                      helperText={errors?.upiId ? errors.upiId.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      error={!!errors.upilist}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        UPI LIST
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

              {watch("payment.paymentMode") == "NET BANKING" && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label={<FormattedLabel id="bankName" required />}
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
                      variant="standard"
                      {...register("branchName")}
                      error={!!errors.branchName}
                      helperText={
                        errors?.branchName ? errors.branchName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label={<FormattedLabel id="ifsc" required />}
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
                      variant="standard"
                      {...register("accountNumber")}
                      // error={!!errors.aFName}
                      // helperText={errors?.aFName ? errors.aFName.message : null}
                    />
                  </Grid>
                </>
              )}
              {watch("payment.paymentMode") == "CARD PAYMENT" && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label={<FormattedLabel id="accountNumber" required />}
                      label="Card Number"
                      variant="standard"
                      {...register("accountNumber")}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label="CVV"
                      variant="standard"
                      {...register("ifsc")}
                    />
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      id="standard-basic"
                      // label={<FormattedLabel id="branchName" />}
                      label="Expiration Date"
                      variant="standard"
                      {...register("branchName")}
                      error={!!errors.branchName}
                      helperText={
                        errors?.branchName ? errors.branchName.message : null
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <div>
              <div className={styles.row4}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    //disabled={validatePay()}
                    onClick={() => {
                      handlePay();
                    }}
                  >
                    {<FormattedLabel id="pay" />}
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    // disabled={validateSearch()}

                    onClick={() => {
                      swal({
                        title: "Exit?",
                        text: "Are you sure you want to exit this Record ? ",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      }).then((willDelete) => {
                        if (willDelete) {
                          swal("Record is Successfully Exit!", {
                            icon: "success",
                          });
                          handleExit();
                        } else {
                          swal("Record is Safe");
                        }
                      });
                    }}
                    // onClick={() => {
                    //     handleExit()
                    // }}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </ThemeProvider>
    </>
  );
};
export default Index;
