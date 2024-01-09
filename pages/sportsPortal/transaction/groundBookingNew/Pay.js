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
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import styles from "../swimmingPoolM/scrutiny/PaymentCollection.module.css";

const Index = (props) => {
  const language = useSelector((state) => state?.labels.language);
  const userDao = useSelector((state) => state?.user?.user?.userDao);
  const router = useRouter();
  const userToken = useGetToken();
  const {
    control,
    register,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  const toWords = new ToWords();
  const [total, setTotal] = useState();
  const [id, setid] = useState();
  const [totalWord, setTotalWord] = useState("zero");
  const [chargePerCopy, setChargePerCopy] = useState(0);
  const [sum, setSum] = useState(null);
  const [applicableCharages, setApplicableCharages] = useState([]);
  const [applicableCharagesTemp, setApplicableCharagesTemp] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [pmode, setPmode] = useState([]);
  const [dataa, setDataa] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [shrinkTemp, setShrinkTemp] = useState()
  const [loadderState, setLoadderState] = useState(false)
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


  // getToPaymentGateWay
  const getToPaymentGateway = (payDetail) => {
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };

  // handlePay
  const handlePay = () => {
    console.log("34324234324324", watch())
    {
      let amount = 0;
      dataa?.applicableCharages?.map((r, i) =>
        setValue("amount", r.totalAmount)
      );
      console.log("234243", amount);
    }


    if (watch("payment.paymentType") == 2) {
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
        amount: watch("amount"),
        divertPageLink:
          "sportsPortal/transaction/groundBookingNew/scrutiny/pgSuccess",
        loiId: watch("loi.id"),
        loiNo: watch("loi.loiNo"),
        ccAvenueKitLtp: ccAvenueKitLtp,
        serviceId: 68,
        applicationId: Number(dataa?.id),
        domain: window.location.hostname,
        applicationNo: watch("applicationNumber"),
        applicationNumber: watch("applicationNumber")
      };

      console.log("testBody", testBody);

      axios
        .post(
          `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
          testBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            getToPaymentGateway(res.data);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });;
    } else {
      const finalBody = {
        bookingTimeId: Number(router?.query?.bookingTimeId),
        trnPaymentCollectionDao: watch("payment"),
        id: watch("id"),
        isPayProcess: "Y",
      };
      axios
        .post(`${urls.SPURL}/swimmingPool/save`, finalBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log("6787", res);
          swal("Submitted!", "Payment Collected successfully !", "success");
          router.push({
            pathname:
              "/sportsPortal/transaction/swimmingPool/ServiceChargeRecipt",
            query: {
              applicationId: watch("id"),
            },
          });
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // getPaymentTypes
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

  // getData
  const getData = () => {
    axios
      .get(`${urls.SPURL}/groundBooking/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("54332313456", r?.data);
        console.log("applicableCharages34534534", r?.data?.applicableCharages)
        // setApplicableCharages(r?.data?.applicableCharages);
        // setApplicableCharagesTemp(r?.data?.applicableCharages);
        calculateCharges(r?.data?.applicableCharages)

        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log("hawkerLicenseData", r?.data);
          setDataa(r.data);

          reset(r.data);
          if (
            localStorage.getItem("applicationRevertedToCititizen") == "true"
          ) {
            setValue("disabledFieldInputState", false);
          } else {
            setValue("disabledFieldInputState", true);
          }
          setShrinkTemp(true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          setShrinkTemp(true);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };



  // getServiceCharges
  const getServiceCharges = () => {
    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=35`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setChargePerCopy(r.data.serviceCharge[0].amount);
      }).catch((error) => {
        callCatchMethod(error, language);
      });
  }


  //! ========================= useEffects 

  useEffect(() => {
    if (total) {
      if (router.query.serviceId != 9) {
        console.log("total", total, typeof total);
        setTotalWord(toWords.convert(total));
      }
    }
  }, [total]);

  //  calculateCharges
  const calculateCharges = (charges) => {

    console.log("charges3432", charges)
    let deposite = 0;
    let rate = 0;
    let cgst = 0;
    let sgst = 0;
    let finalTotalWithCGSTSGST = 0;
    let total = 0;
    let applicableCharagesBhava = null;

    //! kllll
    if (charges) {
      charges.forEach((charge) => {
        deposite += charge?.chargeType == 2 ? charge?.amountPerHead : 0;
        rate += charge?.chargeType == 1 ? charge?.totalAmount : 0;
      });
      // total 
      total = deposite + rate;
      // cgst 
      cgst = (total * 9) / 100
      sgst = (total * 9) / 100
      finalTotalWithCGSTSGST = total + cgst + sgst;
      // sum 
      setSum(finalTotalWithCGSTSGST);

      //! ===============> updated content 



      applicableCharagesBhava = charges[0];

      console.log("applicableCharagesTemp1111", applicableCharagesTemp)


      let data1 = {
        ...applicableCharagesBhava,
        totalAmount: cgst,
        chargeTypeName: "CGST 9%",
        chargeTypeNameMr: "CGST 9%",
        amountPerHead: null,
        chargeType: null,
        hours: null,
        chargableDays: null,
      }


      let data2 = {
        ...applicableCharagesBhava,
        chargeTypeName: "SGST 9%",
        chargeTypeNameMr: "SGST 9%",
        totalAmount: sgst,
        amountPerHead: null,
        chargeType: null,
        hours: null,
        chargableDays: null,
      }


      setApplicableCharages([...charges, data1, data2])

      console.log("applicableCharges", [...charges, data1, data2])




    }





  }




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
    if (id != null && id != undefined && id != "") {
      getData();
    }
  }, [id]);


  useEffect(() => {
    getServiceCharges();
    getPaymentTypes();

    reset(props?.data);
    if (
      localStorage.getItem("id") != null &&
      localStorage.getItem("id") != "" && localStorage.getItem("id") != undefined
    ) {
      setid(localStorage.getItem("id"));
    }
    if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
      setApplicationRevertedToCititizen(true);
      setApplicationRevertedToCititizenNew(false);
      setValue("disabledFieldInputState", true);
    }
  }, []);


  useEffect(() => {
    console.log("paymenttype", watch("payment.paymentType"));
    if (watch("payment.paymentType") === "Online") {
      setPaymentModes(onlinModes);
    } else {
      setPaymentModes(pmode);
    }
  }, [watch("payment.paymentType")]);


  //!======================== return 
  return (
    <div>
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

            <h4>अर्जाचा क्रमांक : {dataa?.applicationNumber}</h4>

            <h4>अर्जादारचे नाव :{dataa?.firstName}</h4>

            <h4>
              अर्ज दिनांक : { }{" "}
              {" " +
                moment(dataa?.applicationDate, "YYYY-MM-DD").format(
                  "DD-MM-YYYY"
                )}
            </h4>


            <div className={styles.row5}></div>
            <h4>एकुण रक्कम : {sum} रु</h4>

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>अ.क्र</th>
                  <th colSpan={8}>शुल्काचे नाव</th>
                  <th colSpan={2}>रक्कम (रु)</th>
                  <th colSpan={2}>एकूण तास</th>
                  <th colSpan={2}>एकूण दिवस</th>
                  <th colSpan={2}>एकूण (रु)</th>
                </tr>
              </thead>
              <tbody>
                {applicableCharages?.map((r, i) => (
                  <>
                    <tr>
                      <td colSpan={4}>{i + 1}</td>
                      <td colSpan={4}>{r?.chargeTypeName}</td>
                      <td colSpan={4}>{r?.amountPerHead != null && r?.amountPerHead != undefined && r?.amountPerHead != "" ? r?.amountPerHead : "-"}</td>
                      <td colSpan={2}>{

                        (r?.chargeType == 2 ? "-" : r?.hours) != undefined &&
                          (r?.chargeType == 2 ? "-" : r?.hours) != null &&
                          (r?.chargeType == 2 ? "-" : r?.hours) != "" ?
                          (r?.chargeType == 2 ? "-" : r?.hours) : "-"

                      }</td>
                      <td colSpan={2}>
                        {
                          (r?.chargeType == 2 ? "-" : r?.chargableDays) != null
                            &&
                            (r?.chargeType == 2 ? "-" : r?.chargableDays) != undefined
                            &&
                            (r?.chargeType == 2 ? "-" : r?.chargableDays) != ""
                            ?
                            (r?.chargeType == 2 ? "-" : r?.chargableDays) : "-"}
                      </td>
                      <td colSpan={4}>
                        {(r.chargeType == 2 ? r?.amountPerHead : r?.totalAmount)
                          != null &&
                          (r.chargeType == 2 ? r?.amountPerHead : r?.totalAmount)
                          != undefined &&
                          (r.chargeType == 2 ? r?.amountPerHead : r?.totalAmount)
                          != null ?
                          (r.chargeType == 2 ? r?.amountPerHead : r?.totalAmount)
                          : "-"
                        }
                      </td>
                    </tr>
                  </>
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
                  <td colSpan={2}>
                    <b></b>
                  </td>
                  <td colSpan={2}>
                    <b></b>
                  </td>
                  <td colSpan={4}>
                    <b>{sum}</b>
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
                    onClick={() => {
                      if (userDao?.cfcUser) {
                        router.push("/CFC_Dashboard");
                      } else if (userDao?.deptUser) {
                        router.push("/sportsPortal/transaction/groundBookingNew/scrutiny");
                      } else {
                        router.push("/dashboard");
                      }
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
    </div>
  );
};

export default Index;

