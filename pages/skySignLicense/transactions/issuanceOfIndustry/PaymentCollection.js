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
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import styles from "./PaymentCollection.module.css";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
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

  useEffect(() => {
    if (router?.query?.id) {
      axios
        .get(
          `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setChargePerCopy(r.data.serviceCharge?.amount);
        })
        .catch((error) => {
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

  useEffect(() => {
    console.log("query", router?.query);
  }, [router?.query]);

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

  const handleExit = () => {
    swal("Exit!", "Successfully Exitted  Payment!", "success");
    if (router?.query?.citizenView) {
      router.push("/dashboard");
    } else {
      router.push("/skySignLicense/transactions/issuanceOfIndustry/scrutiny");
    }
  };

  const handlePay = () => {
    setValue("payment.amount", dataa?.trnLoiDao?.amount);
    console.log(" dataa?.id", dataa?.id);
    const finalBody = {
      id: Number(dataa?.id),
      // role: 'CASHIER',
      // loi: getValues('loi'),
      paymentDao: getValues("payment"),
    };

    let finalBodyForApi = {
      // ...data,
      role: router?.query?.role,
      // payment: null,
      id: Number(router?.query?.id),
      // trnLoiDao: { trnLoiServiceChargesDao: [{}] }
      trnLoiDao: dataa?.trnLoiDao,
      trnPaymentCollectionDao: getValues("payment"),
      userId: user.id,
    };

    let ccAvenueKitLtp = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_HOST;

    let testBody = {
      currency: "INR",
      language: "EN",
      moduleId: "SSLM",
      amount: watch("payment.amount"),
      divertPageLink:
        "skySignLicense/transactions/issuanceOfIndustry/pgSuccess",
      loiId: dataa?.trnLoiDao?.id,
      loiNo: dataa?.trnLoiDao?.loiNo,
      userId: user.id,
      // loiId: "0",
      // loiNo: "123456",
      ccAvenueKitLtp: ccAvenueKitLtp,
      serviceId: 8,
      applicationNo: dataa?.applicationNumber,
      applicationId: Number(router?.query?.id),
      applicationSide: router?.query?.applicationSide,
      domain: window.location.hostname,
    };

    if (watch("payment.paymentType") === "Online") {
      console.log("onlinePGpayload", testBody);
      axios
        .post(
          // `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
          `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
          testBody,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
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
            getToPaymentGateway(res?.data);

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
    } else {
      axios
        .post(
          `${urls.SSLM}/trnIssuanceOfIndustrialLicense/saveApprove`,
          finalBodyForApi,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            router.push({
              pathname:
                "/skySignLicense/transactions/issuanceOfIndustry/ServiceChargeRecipt",
              query: {
                id: router?.query?.id,
                citizenView: router?.query?.citizenView,
              },
            });
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  const getToPaymentGateway = (payDetail) => {
    // return (
    //   <form id="nonseamless" method="post" name="redirect" action={payDetail.url}>
    //     <input type="hidden" id="encRequest" name="encRequest" value={payDetail.encRequest}></input>
    //     <input type="hidden" id="access_code" name="access_code" value={payDetail.access_code}></input>
    //     {/* <script language="javascript">{document.redirect.submit()}</script> */}
    //     <script language="javascript">{dispatchEvent(new Event("submit"))}</script>

    //   </form>
    // )
    // -------------------------------------------------------------------------
    // document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
    // <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
    // <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
    // document.getElementById("dynForm").submit();
    // -------------------------------------------------------------------------
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (router.query.citizenView == "true") {
          let tempArr = [];
          r?.data?.paymentType?.forEach((row) => {
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
          r?.data?.paymentType?.forEach((row) => {
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
          Authorization: `Bearer ${userToken}`,
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
    if (router?.query?.serviceId == 8) {
      axios
        .get(
          `${urls.SSLM}/trnIssuanceOfIndustrialLicense/getByServiceIdAndId?serviceId=8&id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
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
  }, [router?.query]);

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
                Payment Collection
              </h3>
            </div>
          </div>
          <div className={styles.appDetails}>
            {/* <div className={styles.row} >
                            <div > */}
            <h4>अर्जाचा क्रमांक : {dataa?.applicationNumber}</h4>
            {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
            <h4>
              अर्जादारचे नाव :
              {" " + dataa?.marFirstName + " " + dataa?.marLastName}
            </h4>
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
            <h4>एकुण रक्कम : {dataa?.trnLoiDao?.amount}</h4>

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>अ.क्र</th>
                  <th colSpan={8}>शुल्काचे नाव</th>
                  <th colSpan={2}>रक्कम</th>
                </tr>
                <tr>
                  <td colSpan={4}>1)</td>
                  <td colSpan={4}>{dataa?.serviceNameMr}</td>
                  <td colSpan={4}>{dataa?.trnLoiDao?.amount}</td>
                </tr>
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
                    <b>एकूण रक्कम : {dataa?.trnLoiDao?.amount}</b>
                  </td>
                </tr>
              </tbody>
            </table>

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
                  {/* <FormattedLabel id="receiptModeDetails" /> */}
                  Payment Details
                </h3>
              </div>
            </div>
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
                <FormControl error={!!errors.paymentType} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* {<FormattedLabel id="paymentType" />} */}
                    Payment Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ minWidth: "230px" }}
                        // // dissabled={inputState}
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        // label=<FormattedLabel id="paymentType" />
                        label="Payment Type"
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
                      {/* {<FormattedLabel id="paymentMode" />} */}
                      Payment Mode
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
                          // label={<FormattedLabel id="paymentMode" />}
                          label="Payment Mode"
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
                      // label={<FormattedLabel id="bankName" />}
                      label="Bank Name"
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
                      // label={<FormattedLabel id="bankAccountNo" />}
                      label="Bank Account No"
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
                      // label={<FormattedLabel id="ddNo" />}
                      label="DD No"
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
                                  {/* <FormattedLabel id="ddDate" /> */}
                                  DD Date
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

              {watch("payment.paymentMode") == "Net Banking" && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label={<FormattedLabel id="bankName" required />}
                      label="Bank Name"
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
                      // label={<FormattedLabel id="branchName" />}
                      label="Branch Name"
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
                      // label={<FormattedLabel id="ifsc" required />}
                      label="IFSC"
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
                      // label={<FormattedLabel id="accountNumber" required />}
                      label="Account No"
                      variant="standard"
                      {...register("accountNumber")}
                      // error={!!errors.aFName}
                      // helperText={errors?.aFName ? errors.aFName.message : null}
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
                    {/* {<FormattedLabel id="pay" />} */}
                    Pay
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
