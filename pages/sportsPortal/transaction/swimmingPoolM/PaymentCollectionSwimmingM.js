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
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import ReactDOMServer from "react-dom/server";
// import styles from "./PaymentCollection.module.css";
import styles from "../sportBooking/PaymentCollection.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
  const [sum, setSum] = useState(null);
  const [totalWord, setTotalWord] = useState("zero");
  const [chargePerCopy, setChargePerCopy] = useState(0);
  const [applicableCharages, setApplicableCharages] = useState([]);
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
  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setValue(
          "payment.paymentType",
          r.data.paymentType?.find((ff) => ff.id == 2).id
        );
        console.log("23232", getValues("payment.paymentType"));

        setPaymentTypes(
          r.data.paymentType.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
            paymentTypeMr: row.paymentTypeMr,
          }))
        );
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
        callCatchMethod(error, language);
      });
  };

  // const onlinModes = [
  //   {
  //     id: 1,
  //     paymentModePrefixMr: null,
  //     paymentModePrefix: "Test payment Mode Prefix ",
  //     fromDate: "2022-12-11",
  //     toDate: "2022-12-12",
  //     paymentModeMr: null,
  //     paymentMode: 1,
  //     paymentTypeId: null,
  //     remark: "remark",
  //     remarkMr: null,
  //     activeFlag: "Y",
  //   },
  //   {
  //     id: 2,
  //     paymentModePrefixMr: null,
  //     paymentModePrefix: "test payment mode prefix 2",
  //     fromDate: "2019-02-11",
  //     toDate: "2022-10-10",
  //     paymentModeMr: null,
  //     paymentMode: 1,
  //     paymentTypeId: null,
  //     remark: "Done",
  //     remarkMr: null,
  //     activeFlag: "Y",
  //   },
  // ];

  const onlinModes = [
    {
      id: 10,
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
      id: 11,
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
    // {
    //   id: 3,
    //   paymentModePrefixMr: null,
    //   paymentModePrefix: "test payment mode prefix 2",
    //   fromDate: "2019-02-11",
    //   toDate: "2022-10-10",
    //   paymentModeMr: "कार्ड पेमेंट",
    //   paymentMode: "CARD PAYMENT",
    //   paymentTypeId: null,
    //   remark: "Done",
    //   remarkMr: null,
    //   activeFlag: "Y",
    // },
  ];

  const toWords = new ToWords();

  const getSportsBookingData = () => {
    if (
      router?.query?.applicationId != null &&
      router?.query?.applicationId != undefined
    ) {
      axios
        .get(
          `${urls.SPURL}/swimmingBookingMonthly/getById?id=${router?.query?.applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const tempData = res?.data;
          console.log("responce 121212", res);

          const _res = {
            ...tempData,
            facilityName: facilityNames?.find(
              (obj) => obj?.id == tempData?.facilityName
            )?.facilityName,
          };

          reset(_res);
          setDataa(_res);
          setApplicableCharages(res?.data?.applicableCharages);
          console.log("sport booking", _res);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // useEffect(() => {
  //   console.log("Slot chi id ", router?.query?.bookingId);
  //   axios
  //     .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=68`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((r) => {
  //       setChargePerCopy(r.data.serviceCharge[0].amount);
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (total) {
  //     if (router.query.serviceId != 9) {
  //       console.log("total", total, typeof total);
  //       setTotalWord(toWords.convert(total));
  //     }
  //   }
  // }, [total]);

  // useEffect(() => {
  //   if (watch("charges")) {
  //     if (watch("charges") == undefined || watch("charges") === 0) {
  //       setTotalWord("zero");
  //     } else {
  //       setTotalWord(toWords.convert(watch("charges")));
  //     }
  //   } else {
  //     setTotalWord("zero");
  //   }
  // }, [watch("charges")]);

  // useEffect(() => {
  //   if (
  //     localStorage.getItem("id") != null ||
  //     localStorage.getItem("id") != ""
  //   ) {
  //     axios
  //       .get(
  //         `${urls.SPURL}/swimmingBookingMonthly/getById?id=${
  //           router?.query?.applicationId
  //             ? router?.query?.applicationId
  //             : localStorage.getItem("id")
  //         }`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )

  //       .then((res) => {
  //         reset(res.data);
  //         console.log("r", res?.data);
  //         setDataa(res.data);
  //         setValue("id", Number(localStorage.getItem("id")));
  //         setApplicableCharages(res?.data?.applicableCharages);
  //         console.log("data12121", res.data);
  //       })
  //       .catch((error) => {
  //         callCatchMethod(error, language);
  //       });
  //   }
  // }, []);

  useEffect(() => {
    console.log("deid");
    let tempCharges = watch("noOfCopies") * chargePerCopy;
    setValue("charges", tempCharges);
  }, [watch("noOfCopies")]);

  useEffect(() => {
    if (applicableCharages) {
      let total = 0;
      applicableCharages.map((charge) => {
        total = total + charge.amountPerHead;
      });
      setSum(total);
    }
  }, [applicableCharages]);

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

  //old
  // const getToPaymentGateway = (payDetail) => {
  //   document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
  //   <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
  //   <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
  //   document.getElementById("dynForm").submit();
  // };

  // getToPaymentGateWay
  const getToPaymentGateway = (payDetail) => {
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };

  const handleExit = () => {
    swal("Exit!", "Successfully Exitted  Payment!", "success");
    // router.back();
    router.push("/dashboard");
  };

  const handlePay = () => {
    console.log("watchamount", dataa);
    if (watch("payment.paymentType") == 2) {
      {
        let amount = 0;
        dataa?.applicableCharages?.map((r, i) =>
          setValue("amount", r.totalAmount)
        );
        console.log("234243", amount);
      }

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
          "sportsPortal/transaction/swimmingPoolM/scrutiny/pgSuccess",
        loiId: getValues("loi.id"),
        loiNo: getValues("loi.loiNo"),
        ccAvenueKitLtp: ccAvenueKitLtp,
        serviceId: 35,
        emailAddress: watch("emailAddress"),
        // pageMode: "PAYEMENT_SUCCESSFUL",
        applicationId: Number(dataa?.id),
        // applicationNo: Number(dataa?.applicationNumber),
        applicationNumber: dataa?.applicationNumber,
        applicationStatus: "PAYEMENT_SUCCESSFUL",
        bookingTimeId: Number(dataa.bookingTimeId),
        // ? Number(router?.query?.bookingTimeId)
        // : dataa?.bookingTimeId,
        domain: window.location.hostname,
        // applicationNo: router?.query?.applicationNumber,
      };
      console.log("Test body", testBody);
      axios
        .post(
          `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
          testBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            let tempBody = {
              encRequest: res.data.encRequest,
              access_code: res.data.access_code,
            };
            getToPaymentGateway(res.data);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else {
      setValue("payment.amount", dataa?.loi?.amount);
      console.log(" dataa?.id", dataa?.id);
      console.log("Slot chi ID", router?.query?.bookingTimeId);
      const finalBody = {
        pageMode: "PAYEMENT_SUCCESSFUL",
        emailAddress: watch("emailAddress"),
        serviceId: 29,
        bookingTimeId: Number(router?.query?.bookingTimeId)
          ? Number(router?.query?.bookingTimeId)
          : dataa?.bookingTimeId,
        paymentCollection: {
          ...getValues("payment"),
          paymentMode: paymentModes?.find(
            (p) => p?.paymentMode == getValues("payment.paymentMode")
          )?.id,
        },
        id: getValues("id"),
      };

      axios
        .post(`${urls.SPURL}/gymBooking/saveGymBooking`, finalBody, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("6787", res);
          swal("Submitted!", "Payment Collected successfully !", "success");
          router.push({
            pathname:
              "/sportsPortal/transaction/gymBooking/scrutiny/ServiceChargeRecipt",
            query: {
              applicationId: getValues("id"),
            },
          });
        })
        .catch((error) => {
          callCatchMethod(error, language);
          router.push("/dashboard");
        });
    }
  };

  // const handlePay = () => {
  //   router.push({
  //     pathname: "/sportsPortal/transaction/sportBooking/ServiceChargeRecipt",
  //     query: {
  //       ...router?.query,
  //     },
  //   });
  //   router.push("/sportsPortal/transaction/sportBooking/ServiceChargeRecipt");
  //   setValue("payment.amount", dataa?.loi?.amount);
  //   console.log(" dataa?.id", dataa?.id);
  //   const finalBody = {
  //     id: Number(dataa?.id),
  //     role: "CASHIER",
  //     loi: getValues("loi"),
  //     payment: getValues("payment"),
  //   };

  //   //   //   // axios.post`${urls.SPURL}/groundBooking/saveApplicationApprove`,
  //   //   //   //   finalBody()
  //   //   //   //     .then((res) => {
  //   //   //   //       console.log(res)
  //   //   //   //       swal('Submitted!', 'Payment Collected successfully !', 'success')
  //   //   //   //       router.push({
  //   //   //   //         pathname:
  //   //   //   //           '/sportsPortal/transaction/sportBooking/ServiceChargeRecipt',
  //   //   //   //         query: {
  //   //   //   //           ...router?.query,
  //   //   //   //         },
  //   //   //   //       })
  //   //   //   //     })
  //   //   //   //     .catch((err) => {
  //   //   //   //       swal('Error!', 'Somethings Wrong!', 'error')
  //   //   //   //       router.push('/sportsPortal/transaction/groundBookingNew/scrutiny')
  //   //   //   //     })
  // };

  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [paymentTypes, setPaymentTypes] = useState([]);

  // const [bookingId, setBookingId] = useState([]);
  // const getBookingId = () => {
  //   axios.get(`${urls.SPURL}/bookingMaster/getAll`).then((r) => {
  //     setBookingId(
  //       r.data.bookingMaster.map((row) => ({
  //         id: row.id,
  //       })),
  //     );
  //   });
  // };

  const [dataa, setDataa] = useState([]);

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    // getBookingId();
  }, []);

  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setValue(
          "payment.paymentType",
          r.data.paymentType?.find((ff) => ff.id == 2).id
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, [watch("payment.paymentType")]);

  useEffect(() => {
    console.log("paymenttype", watch("payment.paymentType"));
    if (watch("payment.paymentType") === 2) {
      setPaymentModes(onlinModes);
    } else {
      setPaymentModes(pmode);
    }
  }, [watch("payment.paymentType")]);

  const [data, setdata] = useState();

  useEffect(() => {}, [dataa]);
  const [facilityNames, setFacilityNames] = useState([]);
  const getFacilityName = () => {
    axios
      .get(`${urls.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // // useEffect
  // useEffect(() => {
  //   // getFacilityTypes();
  //   getFacilityName();
  // }, []);

  useEffect(() => {
    getSportsBookingData();
  }, []);

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
            <h4>अर्जाचा क्रमांक : {dataa?.applicationNumber}</h4>

            <h4>
              अर्जादारचे नाव :{" " + dataa?.firstName}
              {" " + dataa?.middleName}
              {" " + dataa?.lastName}
            </h4>

            <h4>
              अर्ज दिनांक : {}{" "}
              {" " +
                moment(dataa?.applicationDate, "YYYY-MM-DD").format(
                  "DD-MM-YYYY"
                )}
            </h4>

            <div className={styles.row5}></div>

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>अ.क्र</th>
                  <th colSpan={8}>शुल्काचे नाव</th>
                  <th colSpan={2}>रक्कम (रु)</th>
                </tr>
              </thead>

              <tbody>
                {applicableCharages?.map((r, i) => (
                  <tr>
                    <td colSpan={4}>{i + 1}</td>

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
                  <td colSpan={4}>{<b>{sum}</b>}</td>
                </tr>

                {/* <tr>
                  <td colSpan={4}>
                    <b></b>
                  </td>
                  <td colSpan={4}>
                    <b>एकूण रक्कम : </b>
                  </td>
                  <td colSpan={4}>
                    <b>
                      {applicableCharages?.map((charge, index) => {
                        console.log("serviceChargeId1212", charge);
                        return <td colSpan={4}>{charge.totalAmount}</td>;
                      })}
                    </b>
                  </td>
                </tr> */}
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
                        disabled
                        sx={{ minWidth: "230px" }}
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="paymentType" />}
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
                                      padding: 2,
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
                                      padding: 2,
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

              {watch("payment.paymentMode") == "CASH" && <></>}

              {watch("payment.paymentMode") == "UPI" && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
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
