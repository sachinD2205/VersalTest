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
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import urls from "../../../../../URLS/urls";
import styles from "./PaymentCollection.module.css";

const Index = (props) => {
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
  } = useForm();

  const [total, setTotal] = useState();
  const [totalWord, setTotalWord] = useState("zero");
  const [chargePerCopy, setChargePerCopy] = useState(0);

  const getToPaymentGateway = (payDetail) => {
    document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
    <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
    <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
    document.getElementById("dynForm").submit();
  };
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
    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=35`)
      .then((r) => {
        setChargePerCopy(r.data.serviceCharge[0].amount);
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

  const handleExit = () => {
    swal("Exit!", "Successfully Exitted  Payment!", "success");
    router.push("/sportsPortal/transaction/swimmingPoolM/scrutiny");
  };

  const handlePay = () => {
    setValue("payment.amount", dataa?.loi?.amount);
    console.log(" dataa?.id", dataa?.id);

    if (watch("payment.paymentType") == 2) {
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
        moduleId: "SP",
        // amount: watch("payment.amount"),
        amount: getValues("loi.totalAmount"),
        divertPageLink:
          "sportsPortal/transaction/swimmingPoolM/scrutiny/pgSuccess",
        loiId: getValues("loi.id"),
        loiNo: getValues("loi.loiNo"),
        ccAvenueKitLtp: ccAvenueKitLtp,
        serviceId: 35,
        applicationId: Number(dataa?.id),
        applicationStatus: "PAYEMENT_SUCCESSFUL",
        bookingTimeId: Number(props?.data?.bookingTimeId),
        // applicationId:router?.query?.applicationNumber
      };
      axios
        .post(
          `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
          testBody
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            let tempBody = {
              encRequest: res.data.encRequest,
              access_code: res.data.access_code,
            };

            getToPaymentGateway(res.data);
          }
        });
    } else {
      const finalBody = {
        id: props?.data?.id,
        role: props?.newRole,
        bookingTimeId: Number(props?.data?.bookingTimeId),
        loi: getValues("loi"),
        paymentCollection: getValues("payment"),
        serviceId: 35,
        emailAddress: watch("emailAddress"),
      };

      axios
        .post(
          `${urls.SPURL}/swimmingBookingMonthly/saveApplicationApprove`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          swal("Submitted!", "Payment Collected successfully !", "success");
          router.push({
            pathname:
              "/sportsPortal/transaction/swimmingPoolM/scrutiny/ServiceChargeRecipt",
            query: {
              applicationId: getValues("id"),
            },
          });
        })
        .catch((err) => {
          swal("Error!", "Somethings Wrong!", "error");
          router.push("/sportsPortal/transaction/swimmingPoolM/scrutiny");
        });
    }
  };

  const language = useSelector((state) => state?.labels.language);

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((r) => {
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
  const [pmode, setPmode] = useState([]);
  const getPaymentModes = () => {
    axios.get(`${urls.BaseURL}/paymentMode/getAll`).then((r) => {
      setPmode(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        }))
      );
    });
  };

  const [dataa, setDataa] = useState(null);
  const [applicableCharages, setApplicableCharages] = useState([]);

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
    axios
      .get(`${urls.SPURL}/swimmingBookingMonthly/getById?id=${props?.data?.id}`)
      .then((res) => {
        reset(res.data);
        setDataa(res.data);
        setApplicableCharages(res?.data?.appCharagesDaos);

        console.log("board data", applicableCharages);
      });
  }, []);

  useEffect(() => {
    console.log("router?.query?.role", router?.query?.role);
    reset(props?.data);
    console.log("propsyetoy", props);
  }, []);

  useEffect(() => {
    // let chargeee = null
    // if (router.query.serviceId == 10) {
    //   chargeee = Number(dataa?.serviceCharge) + Number(dataa?.penaltyCharge)
    //   console.log('nmr')
    // } else if (router.query.serviceId == 14) {
    //   console.log('rmbc')
    //   chargeee = Number(dataa?.serviceCharge)
    // } else {
    //   console.log('nono')
    // }
    // console.log('serviceID', router.query.serviceId)
    // setTotal(chargeee)
    // console.log('charges', chargeee)
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
            <h4>अर्जादारचे नाव :{" " + dataa?.firstName}</h4>
            {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
            <h4>
              अर्ज दिनांक : {}{" "}
              {" " +
                moment(dataa?.applicationDate, "YYYY-MM-DD").format(
                  "DD-MM-YYYY"
                )}
            </h4>
            {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
            {/* </div>
                        </div> */}
            <div className={styles.row5}></div>
            {/* <h4>एकुण रक्कम : {dataa?.amount} रु</h4> */}

            {/* <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>अ.क्र</th>
                  <th colSpan={8}>शुल्काचे नाव</th>
                  <th colSpan={2}>रक्कम (रु)</th>
                </tr>
                <tr>
                  <td colSpan={4}>1)</td>
                  <td colSpan={4}>{dataa?.serviceName}</td>
                  <td colSpan={4}>{dataa?.amount}</td>
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
                    <b>एकूण रक्कम : {dataa?.amount}</b>
                  </td>
                </tr>
              </tbody>
            </table> */}

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>अ.क्र</th>
                  <th colSpan={8}>शुल्काचे नाव</th>
                  <th colSpan={2}>रक्कम (रु)</th>
                </tr>
                {/* <tr>
                  <td colSpan={4}>1)</td>
                  <td colSpan={4}>
                    <b>Registration Fees</b>
                  </td>
                  <td colSpan={4}></td>
                </tr> */}
              </thead>
              <tbody>
                {dataa?.appCharagesDaos?.map((r, i) => (
                  <tr>
                    <td colSpan={4}>{}</td>

                    <td colSpan={4}>{r.chargeTypeName}</td>

                    <td colSpan={4}>{r.amountPerHead}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={4}>
                    <b></b>
                  </td>
                  <td colSpan={4}>
                    <b>एकूण रक्कम : </b>
                  </td>
                  <td colSpan={4}>
                    <b></b>
                  </td>
                </tr>
              </tbody>
            </table>

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
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
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
                            <MenuItem key={index} value={paymentType.id}>
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
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
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
                            <MenuItem key={index} value={paymentMode.id}>
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
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
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

                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
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
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
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
                      {...register("payment.receiptAmount")}
                      error={!!errors.receiptAmount}
                      helperText={errors?.receiptAmount ? errors.receiptAmount.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      label={<FormattedLabel id="receiptNumber" />}
                      variant="standard"
                      {...register("payment.receiptNo")}
                      error={!!errors.receiptNo}
                      helperText={errors?.receiptNo ? errors.receiptNo.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <FormControl sx={{ marginTop: 0 }} error={!!errors.receiptDate}>
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
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                        {errors?.receiptDate ? errors.receiptDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}
                </>
              )}

              {watch("payment.paymentMode") == "ECS" && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="receiptAmount" />}
                      label="Amount"
                      variant="standard"
                      {...register("payment.receiptAmount")}
                      error={!!errors.receiptAmount}
                      helperText={
                        errors?.receiptAmount
                          ? errors.receiptAmount.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="receiptNumber" />}
                      label="Account Number"
                      variant="standard"
                      {...register("payment.receiptNo")}
                      error={!!errors.receiptNo}
                      helperText={
                        errors?.receiptNo ? errors.receiptNo.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="receiptNumber" />}
                      label="branch Name"
                      variant="standard"
                      {...register("payment.receiptNo")}
                      error={!!errors.receiptNo}
                      helperText={
                        errors?.receiptNo ? errors.receiptNo.message : null
                      }
                    />
                  </Grid>
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
                    //   handleExit()
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

// import {
//   Button,
//   FormControl,
//   FormHelperText,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   TextField,
//   ThemeProvider,
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import axios from "axios";
// import moment from "moment";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import swal from "sweetalert";
// import { ToWords } from "to-words";
// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import theme from "../../../../../theme";
// import urls from "../../../../../URLS/urls";
// import styles from "./PaymentCollection.module.css";

// const Index = () => {
//   let user = useSelector((state) => state.user.user);
//   const router = useRouter();
//   const {
//     control,
//     register,
//     reset,
//     setValue,
//     getValues,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const [total, setTotal] = useState();
//   const [totalWord, setTotalWord] = useState("zero");
//   const [chargePerCopy, setChargePerCopy] = useState(0);
//   const onlinModes = [
//     {
//       id: 1,
//       paymentModePrefixMr: null,
//       paymentModePrefix: "Test payment Mode Prefix ",
//       fromDate: "2022-12-11",
//       toDate: "2022-12-12",
//       paymentModeMr: null,
//       paymentMode: "UPI",
//       paymentTypeId: null,
//       remark: "remark",
//       remarkMr: null,
//       activeFlag: "Y",
//     },
//     {
//       id: 2,
//       paymentModePrefixMr: null,
//       paymentModePrefix: "test payment mode prefix 2",
//       fromDate: "2019-02-11",
//       toDate: "2022-10-10",
//       paymentModeMr: null,
//       paymentMode: "Net Banking",
//       paymentTypeId: null,
//       remark: "Done",
//       remarkMr: null,
//       activeFlag: "Y",
//     },
//   ];

//   const toWords = new ToWords();

//   useEffect(() => {
//     axios.get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=35`).then((r) => {
//       setChargePerCopy(r.data.serviceCharge[0].amount);
//     });
//   }, []);

//   useEffect(() => {
//     if (total) {
//       if (router.query.serviceId != 9) {
//         console.log("total", total, typeof total);
//         setTotalWord(toWords.convert(total));
//       }
//     }
//   }, [total]);

//   useEffect(() => {
//     if (watch("charges")) {
//       if (watch("charges") == undefined || watch("charges") === 0) {
//         setTotalWord("zero");
//       } else {
//         setTotalWord(toWords.convert(watch("charges")));
//       }
//     } else {
//       setTotalWord("zero");
//     }
//   }, [watch("charges")]);

//   useEffect(() => {
//     console.log("deid");
//     let tempCharges = watch("noOfCopies") * chargePerCopy;
//     setValue("charges", tempCharges);
//   }, [watch("noOfCopies")]);

//   const validatePay = () => {
//     if (
//       watch("accountNumber") === undefined ||
//       watch("accountNumber") === "" ||
//       watch("bankName") === undefined ||
//       watch("bankName") === "" ||
//       watch("branchName") === undefined ||
//       watch("branchName") === "" ||
//       watch("ifsc") === undefined ||
//       watch("ifsc") === ""
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   const handleExit = () => {
//     swal("Exit!", "Successfully Exitted  Payment!", "success");
//     router.push("/sportsPortal/transaction/swimmingPoolM/scrutiny");
//   };

//   const handlePay = () => {
//     setValue("payment.amount", dataa?.loi?.amount);
//     console.log(" dataa?.id", dataa?.id);
//     const finalBody = {
//       id: Number(dataa?.id),
//       role: "CASHIER",
//       loi: getValues("loi"),
//       payment: getValues("payment"),
//     };

//     axios
//       .post(`${urls.SPURL}/swimmingBooking/saveApplicationApprove`, finalBody)
//       .then((res) => {
//         console.log(res);
//         swal("Submitted!", "Payment Collected successfully !", "success");
//         router.push({
//           pathname: "/sportsPortal/transaction/swimmingPoolM/scrutiny/ServiceChargeRecipt",
//           query: {
//             ...router?.query,
//           },
//         });
//       })
//       .catch((err) => {
//         swal("Error!", "Somethings Wrong!", "error");
//         router.push("/sportsPortal/transaction/swimmingPoolM/scrutiny");
//       });
//   };

//   const language = useSelector((state) => state?.labels.language);

//   const [paymentTypes, setPaymentTypes] = useState([]);

//   const getPaymentTypes = () => {
//     axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((r) => {
//       setPaymentTypes(
//         r.data.paymentType.map((row) => ({
//           id: row.id,
//           paymentType: row.paymentType,
//           paymentTypeMr: row.paymentTypeMr,
//         })),
//       );
//     });
//   };

//   const [paymentModes, setPaymentModes] = useState([]);
//   const [pmode, setPmode] = useState([]);
//   const getPaymentModes = () => {
//     axios.get(`${urls.BaseURL}/paymentMode/getAll`).then((r) => {
//       setPmode(
//         r.data.paymentMode.map((row) => ({
//           id: row.id,
//           paymentMode: row.paymentMode,
//           paymentModeMr: row.paymentModeMr,
//         })),
//       );
//     });
//   };

//   const [dataa, setDataa] = useState(null);

//   useEffect(() => {
//     getPaymentTypes();
//     getPaymentModes();
//   }, []);

//   useEffect(() => {
//     console.log("paymenttype", watch("payment.paymentType"));
//     if (watch("payment.paymentType") === "Online") {
//       setPaymentModes(onlinModes);
//     } else {
//       setPaymentModes(pmode);
//     }
//   }, [watch("payment.paymentType")]);
//   // const [data, setdata] = useState()

//   useEffect(() => {
//     axios.get(`${urls.SPURL}/swimmingBooking/getById?id=${35}`).then((res) => {
//       reset(res.data);
//       setDataa(res.data);
//       console.log("7777", res.data);
//     });
//   }, []);

//   useEffect(() => {
//     // let chargeee = null
//     // if (router.query.serviceId == 10) {
//     //   chargeee = Number(dataa?.serviceCharge) + Number(dataa?.penaltyCharge)
//     //   console.log('nmr')
//     // } else if (router.query.serviceId == 14) {
//     //   console.log('rmbc')
//     //   chargeee = Number(dataa?.serviceCharge)
//     // } else {
//     //   console.log('nono')
//     // }
//     // console.log('serviceID', router.query.serviceId)
//     // setTotal(chargeee)
//     // console.log('charges', chargeee)
//   }, [dataa]);

//   return (
//     <>
//       <ThemeProvider theme={theme}>
//         <Paper
//           sx={{
//             marginLeft: 10,
//             marginRight: 2,
//             marginTop: 5,
//             marginBottom: 5,
//             padding: 1,
//             border: 2,
//             borderColor: "black.500",
//           }}
//         >
//           <div className={styles.details}>
//             <div className={styles.h1Tag}>
//               <h3
//                 style={{
//                   color: "white",
//                   marginTop: "7px",
//                 }}
//               >
//                 Payment Collection
//               </h3>
//             </div>
//           </div>
//           <div className={styles.appDetails}>
//             {/* <div className={styles.row} >
//                             <div > */}
//             <h4>अर्जाचा क्रमांक : {dataa?.bookingRegistrationId}</h4>
//             {/* </div>
//                         </div>
//                         <div className={styles.row1}>
//                             <div > */}
//             <h4>अर्जादारचे नाव :{" " + dataa?.applicantName}</h4>
//             {/* </div>
//                         </div>
//                         <div className={styles.row1}>
//                             <div > */}
//             <h4>
//               अर्ज दिनांक : {} {" " + moment(dataa?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
//             </h4>
//             {/* </div>
//                         </div>
//                         <div className={styles.row1}>
//                             <div > */}
//             {/* </div>
//                         </div> */}
//             <div className={styles.row5}></div>
//             <h4>एकुण रक्कम : {dataa?.totalAmount} रु</h4>

//             <table id="table-to-xls" className={styles.report_table}>
//               <thead>
//                 <tr>
//                   <th colSpan={2}>अ.क्र</th>
//                   <th colSpan={8}>शुल्काचे नाव</th>
//                   <th colSpan={2}>रक्कम (रु)</th>
//                 </tr>
//                 <tr>
//                   <td colSpan={4}>1)</td>
//                   <td colSpan={4}>{dataa?.serviceName}</td>
//                   <td colSpan={4}>{dataa?.totalAmount}</td>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td colSpan={4}>
//                     <b></b>
//                   </td>
//                   <td colSpan={4}>
//                     <b></b>
//                   </td>
//                   <td colSpan={4}>
//                     <b>एकूण रक्कम : {dataa?.totalAmount}</b>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             <div className={styles.details}>
//               <div className={styles.h1Tag}>
//                 <h3
//                   style={{
//                     color: "white",
//                     marginTop: "7px",
//                   }}
//                 >
//                   <FormattedLabel id="receiptModeDetails" />
//                 </h3>
//               </div>
//             </div>
//             <Grid
//               container
//               sx={{
//                 marginTop: 1,
//                 marginBottom: 5,
//                 paddingLeft: "50px",
//                 align: "center",
//               }}
//             >
//               <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
//                 <FormControl error={!!errors.paymentType} sx={{ marginTop: 2 }}>
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="paymentType" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ minWidth: "230px" }}
//                         // // dissabled={inputState}
//                         autoFocus
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label=<FormattedLabel id="paymentType" />
//                         id="demo-simple-select-standard"
//                         labelId="id='demo-simple-select-standard-label'"
//                       >
//                         {paymentTypes &&
//                           paymentTypes.map((paymentType, index) => (
//                             <MenuItem key={index} value={paymentType.paymentType}>
//                               {language == "en" ? paymentType?.paymentType : paymentType?.paymentTypeMr}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="payment.paymentType"
//                     control={control}
//                     defaultValue=""
//                   />
//                 </FormControl>
//               </Grid>
//               <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
//                 <FormControl error={!!errors.paymentMode} sx={{ marginTop: 2 }}>
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="paymentMode" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ minWidth: "230px" }}
//                         // // dissabled={inputState}
//                         autoFocus
//                         value={field.value}
//                         onChange={(value) => {
//                           field.onChange(value);
//                         }}
//                         label={<FormattedLabel id="paymentMode" />}
//                         id="demo-simple-select-standard"
//                         labelId="id='demo-simple-select-standard-label'"
//                       >
//                         {paymentModes &&
//                           paymentModes.map((paymentMode, index) => (
//                             <MenuItem key={index} value={paymentMode.paymentMode}>
//                               {language == "en" ? paymentMode?.paymentMode : paymentMode?.paymentModeMr}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="payment.paymentMode"
//                     control={control}
//                     defaultValue=""
//                   />
//                 </FormControl>
//               </Grid>

//               {watch("payment.paymentMode") == "DD" && (
//                 <>
//                   <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       label={<FormattedLabel id="bankName" />}
//                       variant="standard"
//                       {...register("payment.bankName")}
//                       error={!!errors.bankName}
//                       helperText={errors?.bankName ? errors.bankName.message : null}
//                     />
//                   </Grid>

//                   <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       label={<FormattedLabel id="bankAccountNo" />}
//                       variant="standard"
//                       {...register("payment.accountNo")}
//                       error={!!errors.accountNo}
//                       helperText={errors?.accountNo ? errors.accountNo.message : null}
//                     />
//                   </Grid>
//                   <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       label={<FormattedLabel id="ddNo" />}
//                       variant="standard"
//                       {...register("payment.ddNo")}
//                       error={!!errors.ddNo}
//                       helperText={errors?.ddNo ? errors.ddNo.message : null}
//                     />
//                   </Grid>

//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <FormControl sx={{ marginTop: 0 }} error={!!errors.dDDate}>
//                       <Controller
//                         name="payment.ddDate"
//                         control={control}
//                         defaultValue={null}
//                         render={({ field }) => (
//                           <LocalizationProvider dateAdapter={AdapterMoment}>
//                             <DatePicker
//                               inputFormat="DD/MM/YYYY"
//                               label={
//                                 <span style={{ fontSize: 16, marginTop: 2 }}>
//                                   <FormattedLabel id="ddDate" />
//                                 </span>
//                               }
//                               value={field.value}
//                               onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
//                               selected={field.value}
//                               center
//                               renderInput={(params) => (
//                                 <TextField
//                                   {...params}
//                                   size="small"
//                                   fullWidth
//                                   InputLabelProps={{
//                                     style: {
//                                       fontSize: 12,
//                                       marginTop: 3,
//                                     },
//                                   }}
//                                 />
//                               )}
//                             />
//                           </LocalizationProvider>
//                         )}
//                       />
//                       <FormHelperText>{errors?.ddDate ? errors.ddDate.message : null}</FormHelperText>
//                     </FormControl>
//                   </Grid>
//                 </>
//               )}

//               {watch("payment.paymentMode") == "CASH" && (
//                 <>
//                   {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       label={<FormattedLabel id="receiptAmount" />}
//                       variant="standard"
//                       {...register("payment.receiptAmount")}
//                       error={!!errors.receiptAmount}
//                       helperText={errors?.receiptAmount ? errors.receiptAmount.message : null}
//                     />
//                   </Grid>
//                   <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       label={<FormattedLabel id="receiptNumber" />}
//                       variant="standard"
//                       {...register("payment.receiptNo")}
//                       error={!!errors.receiptNo}
//                       helperText={errors?.receiptNo ? errors.receiptNo.message : null}
//                     />
//                   </Grid>

//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <FormControl sx={{ marginTop: 0 }} error={!!errors.receiptDate}>
//                       <Controller
//                         name="payment.receiptDate"
//                         control={control}
//                         defaultValue={moment()}
//                         render={({ field }) => (
//                           <LocalizationProvider dateAdapter={AdapterMoment}>
//                             <DatePicker
//                               inputFormat="DD/MM/YYYY"
//                               label={
//                                 <span style={{ fontSize: 16, marginTop: 2 }}>
//                                   <FormattedLabel id="receiptDate" />
//                                 </span>
//                               }
//                               value={field.value}
//                               onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
//                               selected={field.value}
//                               center
//                               renderInput={(params) => (
//                                 <TextField
//                                   {...params}
//                                   size="small"
//                                   fullWidth
//                                   InputLabelProps={{
//                                     style: {
//                                       fontSize: 12,
//                                       marginTop: 3,
//                                     },
//                                   }}
//                                 />
//                               )}
//                             />
//                           </LocalizationProvider>
//                         )}
//                       />
//                       <FormHelperText>
//                         {errors?.receiptDate ? errors.receiptDate.message : null}
//                       </FormHelperText>
//                     </FormControl>
//                   </Grid> */}
//                 </>
//               )}

//               {watch("payment.paymentMode") == "ECS" && (
//                 <>
//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       // label={<FormattedLabel id="receiptAmount" />}
//                       label="Amount"
//                       variant="standard"
//                       {...register("payment.receiptAmount")}
//                       error={!!errors.receiptAmount}
//                       helperText={errors?.receiptAmount ? errors.receiptAmount.message : null}
//                     />
//                   </Grid>
//                   <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       // label={<FormattedLabel id="receiptNumber" />}
//                       label="Account Number"
//                       variant="standard"
//                       {...register("payment.receiptNo")}
//                       error={!!errors.receiptNo}
//                       helperText={errors?.receiptNo ? errors.receiptNo.message : null}
//                     />
//                   </Grid>

//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       // label={<FormattedLabel id="receiptNumber" />}
//                       label="branch Name"
//                       variant="standard"
//                       {...register("payment.receiptNo")}
//                       error={!!errors.receiptNo}
//                       helperText={errors?.receiptNo ? errors.receiptNo.message : null}
//                     />
//                   </Grid>
//                 </>
//               )}

//               {watch("payment.paymentMode") == "UPI" && (
//                 <>
//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <TextField
//                       // disabled={inputState}
//                       id="standard-basic"
//                       // label={<FormattedLabel id="bankName" />}
//                       label="UPI ID"
//                       variant="standard"
//                       {...register("payment.upiId")}
//                       error={!!errors.upiId}
//                       helperText={errors?.upiId ? errors.upiId.message : null}
//                     />
//                   </Grid>

//                   <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
//                     <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.upilist}>
//                       <InputLabel id="demo-simple-select-standard-label">UPI LIST</InputLabel>
//                       <Controller
//                         render={({ field }) => (
//                           <Select
//                             value={field.value}
//                             onChange={(value) => field.onChange(value)}
//                             label="Status at time of marriage *"
//                           >
//                             <MenuItem value={1}>@ybl</MenuItem>
//                             <MenuItem value={2}>@okaxis</MenuItem>
//                             <MenuItem value={3}>@okicici</MenuItem>
//                           </Select>
//                         )}
//                         name="upilist"
//                         control={control}
//                         defaultValue=""
//                       />
//                       <FormHelperText>{errors?.upilist ? errors.upilist.message : null}</FormHelperText>
//                     </FormControl>
//                   </Grid>
//                 </>
//               )}

//               {watch("payment.paymentMode") == "Net Banking" && (
//                 <>
//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <TextField
//                       //  disabled
//                       sx={{ width: 230 }}
//                       id="standard-basic"
//                       label={<FormattedLabel id="bankName" required />}
//                       variant="standard"
//                       {...register("bankName")}
//                       // error={!!errors.aFName}
//                       // helperText={errors?.aFName ? errors.aFName.message : null}
//                     />
//                   </Grid>

//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <TextField
//                       //disabled={inputState}
//                       id="standard-basic"
//                       label={<FormattedLabel id="branchName" />}
//                       variant="standard"
//                       {...register("branchName")}
//                       error={!!errors.branchName}
//                       helperText={errors?.branchName ? errors.branchName.message : null}
//                     />
//                   </Grid>
//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <TextField
//                       //  disabled
//                       sx={{ width: 230 }}
//                       id="standard-basic"
//                       label={<FormattedLabel id="ifsc" required />}
//                       variant="standard"
//                       {...register("ifsc")}
//                       // error={!!errors.aFName}
//                       // helperText={errors?.aFName ? errors.aFName.message : null}
//                     />
//                   </Grid>

//                   <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
//                     <TextField
//                       //  disabled
//                       sx={{ width: 230 }}
//                       id="standard-basic"
//                       label={<FormattedLabel id="accountNumber" required />}
//                       variant="standard"
//                       {...register("accountNumber")}
//                       // error={!!errors.aFName}
//                       // helperText={errors?.aFName ? errors.aFName.message : null}
//                     />
//                   </Grid>
//                 </>
//               )}
//             </Grid>
//             <div>
//               <div className={styles.row4}>
//                 <div>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     //disabled={validatePay()}
//                     onClick={() => {
//                       handlePay();
//                     }}
//                   >
//                     {<FormattedLabel id="pay" />}
//                   </Button>
//                 </div>
//                 <div>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     // disabled={validateSearch()}
//                     onClick={() => {
//                       swal({
//                         title: "Exit?",
//                         text: "Are you sure you want to exit this Record ? ",
//                         icon: "warning",
//                         buttons: true,
//                         dangerMode: true,
//                       }).then((willDelete) => {
//                         if (willDelete) {
//                           swal("Record is Successfully Exit!", {
//                             icon: "success",
//                           });
//                           handleExit();
//                         } else {
//                           swal("Record is Safe");
//                         }
//                       });
//                     }}
//                     // onClick={() => {
//                     //   handleExit()
//                     // }}
//                   >
//                     {<FormattedLabel id="exit" />}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Paper>
//       </ThemeProvider>
//     </>
//   );
// };

// export default Index;
