import {
  Button,
  FormControl,
  Grid,
  FormControlLabel,
  Checkbox,
  InputLabel,
  TextField,
  MenuItem,
  Paper,
  Select,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./PaymentCollection.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  let user = useSelector((state) => state.user.user);
  const router = useRouter();
  const {
    control,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm();

  const logedInUser = localStorage.getItem("loggedInUser");
  const [isLoading, setIsLoading] = useState(false);
  const [chargePerCopy, setChargePerCopy] = useState(0);
  const [paymentModes, setPaymentModes] = useState([]);
  const [dataa, setDataa] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const language = useSelector((state) => state?.labels.language);
  let currDate = new moment(Date()).format("DD/MM/YYYY");
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [checkedOne, setCheckedOne] = React.useState(false);
  const [paymentGatUrl, setPayGatUrl] = useState(null);
  const [encRequest, setEncRequest] = useState(null);
  const [accessCode, setAccesssCode] = useState(null);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  const pmode = [
    {
      id: 1,
      paymentModePrefixMr: null,
      paymentModePrefix: "Test Offline Prefix ",
      fromDate: "2022-12-11",
      toDate: "2022-12-12",
      paymentModeMr: "रोख",
      paymentMode: "CASH",
      paymentTypeId: null,
      remark: "remark",
      remarkMr: null,
      activeFlag: "Y",
    },
    {
      id: 2,
      paymentModePrefixMr: null,
      paymentModePrefix: "test Offline prefix 1",
      fromDate: "2019-02-11",
      toDate: "2022-10-10",
      paymentModeMr: "चलन",
      paymentMode: "CHALLAN",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
  ];

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
      paymentModePrefix: "test payment mode prefix 1",
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
      paymentModeMr: "क्रेडीट कार्ड",
      paymentMode: "CREDIT CARD",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
    {
      id: 4,
      paymentModePrefixMr: null,
      paymentModePrefix: "test payment mode prefix 3",
      fromDate: "2019-02-11",
      toDate: "2022-10-10",
      paymentModeMr: "डेबिट कार्ड",
      paymentMode: "DEBIT CARD",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
  ];

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      if (router.query.trnType === "ap") {
        getApplicationByApplicationNo();
      } else {
        getAppealApplicationByApplicationNO();
      }
    }
  }, [router.query.id]);

  const handleChangeOne = () => {
    setCheckedOne(!checkedOne);
  };
  useEffect(() => {
    if (checkedOne == true) {
      getPaymentDetails();
    } else {
      setPayGatUrl(null);
      setEncRequest(null);
      setAccesssCode(null);
    }
  }, [checkedOne]);

  // load payment details
  const getPaymentDetails = () => {
    let encodeUrl = "RTIOnlineSystem/transactions/pgSuccess";
    let body = {
      currency: "INR",
      language: "EN",
      moduleId: "RTI",
      amount: Number(chargePerCopy?.amount),
      divertPageLink: encodeUrl,
      loiId: 0,
      loiNo: 0,
      ccAvenueKitLtp: "T",
      serviceId: router.query.trnType === "ap" ? 103 : 104,
      applicationId: applicationId,
      applicationNo: router.query.id,
    };
    setIsLoading(true);
    axios
      .post(
        `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
        body
      )
      .then((r) => {
        setIsLoading(false);
        setPayGatUrl(r.data.url);
        setEncRequest(r.data.encRequest);
        setAccesssCode(r.data.access_code);
        // getToPaymentGateway(r.data)
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, true);
      });
  };
  const getToPaymentGateway = (payDetail) => {
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };
  const getApplicationByApplicationNo = () => {
    setIsLoading(true);
    const headers =
      logedInUser === "citizenUser"
        ? { Userid: user?.id }
        : { Authorization: `Bearer ${user?.token}` };
    axios
      .get(
        `${urls.RTI}/trnRtiApplication/searchByApplicationNumber?applicationNumber=${router.query.id}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setApplicationId(res.data.id);
        setDataa(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAppealApplicationByApplicationNO = () => {
    setIsLoading(true);
    const headers =
      logedInUser === "citizenUser"
        ? { Userid: user?.id }
        : { Authorization: `Bearer ${user?.token}` };
    axios
      .get(
        `${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${router.query.id}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setApplicationId(res.data.id);
        setDataa(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (router.query.trnType != null && router.query.trnType != undefined)
      if (router.query.trnType === "ap") {
        axios
          .get(
            `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=103`
          )
          .then((r) => {
            setChargePerCopy(r.data.serviceCharge.find((obj) => obj.id === 49));
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, true);
          });
      } else {
        axios
          .get(
            `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=104`
          )
          .then((r) => {
            setChargePerCopy(r.data.serviceCharge.find((obj) => obj.id === 50));
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, true);
          });
      }
  }, [router.query.trnType]);

  const handleExit = () => {
    if (router.query.trnType === "ap") {
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handlePay = () => {
    const body = {
      activeFlag: "Y",
      isComplete: false,
      isApproved: false,
      ...dataa,
      paymentType: watch("payment.paymentType"),
      paymentMode: watch("payment.paymentMode"),
      serviceChargeAmount: chargePerCopy?.amount,
      serviceChargePaidAmount: chargePerCopy?.amount,
      transactionRefNo: "4562214455",
      transactionDateTime: null,
      transactionStatus: null,
    };
    setIsLoading(true);
    if (router.query.trnType === "ap") {
      const headers =
        logedInUser === "citizenUser"
          ? { Userid: user?.id }
          : { Authorization: `Bearer ${user?.token}` };
      const tempData = axios
        .post(`${urls.RTI}/trnRtiApplication/save`, body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert({
              title: language == "en" ? "Saved!" : "जतन केले",
              text:
                language == "en"
                  ? "RTI Application Saved Successfully !"
                  : "RTI अर्ज यशस्वीरित्या जतन झाला!",
              icon: "success",
              dangerMode: false,
              button: language === "en" ? "Ok" : "ठीक आहे",
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                sweetAlert({
                  text:
                    language == "en"
                      ? ` Your Application No Is : ${
                          res.data.message.split("[")[1].split("]")[0]
                        }`
                      : `तुमचा अर्ज क्र : ${
                          res.data.message.split("[")[1].split("]")[0]
                        }`,
                  icon: "success",
                  buttons: [
                    language == "en" ? "View Acknowledgement" : "पावती पहा",
                    language == "en"
                      ? "Go To Application List"
                      : "अर्ज सूचीवर जा",
                  ],
                  dangerMode: false,
                  closeOnClickOutside: false,
                }).then((will) => {
                  if (will) {
                    {
                      router.push("/dashboard");
                    }
                  } else {
                    router.push({
                      pathname:
                        "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                      query: {
                        id: res.data.message.split("[")[1].split("]")[0],
                      },
                    });
                  }
                });
              }
            });
          } else {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी!",
              language == "en"
                ? "Something Went Wrong !"
                : "काहीतरी चूक झाली !",
              "error",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      const headers =
        logedInUser === "citizenUser"
          ? { Userid: user?.id }
          : { Authorization: `Bearer ${user?.token}` };
      const tempData = axios
        .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert({
              title: language == "en" ? "Saved!" : "जतन केले",
              text:
                language == "en"
                  ? "RTI Appeal Saved Successfully !"
                  : "आरटीआय अपील यशस्वीरित्या जतन केले!",
              icon: "success",
              dangerMode: false,
              button: language === "en" ? "Ok" : "ठीक आहे",
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                sweetAlert({
                  text:
                    language == "en"
                      ? `Your Appeal Application No Is: ${
                          res.data.message.split("[")[1].split("]")[0]
                        }`
                      : ` तुमचा अपील अर्ज क्र: ${
                          res.data.message.split("[")[1].split("]")[0]
                        }`,
                  icon: "success",
                  buttons: [
                    language == "en" ? "View Acknowledgement" : "पावती पहा",
                    language == "en" ? "Go To Appeal List" : "अपील सूचीवर जा",
                  ],
                  dangerMode: false,
                  closeOnClickOutside: false,
                }).then((will) => {
                  if (will) {
                    {
                      router.push(
                        "/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList"
                      );
                    }
                  } else {
                    router.push({
                      pathname:
                        "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                      query: {
                        id: res.data.message.split("[")[1].split("]")[0],
                      },
                    });
                  }
                });
              }
            });
          } else {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी!",
              language == "en"
                ? "Something Went Wrong !"
                : "काहीतरी चूक झाली !",
              "error",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };


  useEffect(() => {
    if (logedInUser === "citizenUser") {
      setValue("payment.paymentType", "Online");
    }
    getPaymentTypes();
  }, []);

  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`)
      .then((r) => {
        setPaymentTypes(
          r.data.paymentType.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
            paymentTypeMr: row.paymentTypeMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (watch("payment.paymentType") === "Online") {
      setPaymentModes(onlinModes);
    } else {
      setPaymentModes(pmode);
    }
  }, [watch("payment.paymentType")]);

  return (
    <>
      <ThemeProvider theme={theme}>
        {isLoading && <CommonLoader />}
        <Paper
          sx={{
            marginLeft: 1,
            marginRight: 1,
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
                <FormattedLabel id="paymentCollection" />
              </h3>
            </div>
          </div>
          <div className={styles.appDetails}>
            {/* <div className={styles.date3}> */}
            <div className={styles.labelValue}>
              <div className={styles.date2}>
                <h4>
                  {" "}
                  <b>
                    <FormattedLabel id="applicationNo" /> :
                  </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>{router.query.id}</h4>
              </div>
            </div>
            {/* <div className={styles.labelValue}>
              <div className={styles.date3}>
                <h4>
                  {" "}
                  <b>
                    <FormattedLabel id="datePayment" />:
                  </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}> {" " + currDate}</h4>
              </div>
            </div> */}
            <div className={styles.labelValue}>
              <h4>
                <b>
                  <FormattedLabel id="applicantName" /> :
                </b>
                {language === "en" && (
                  <>
                    {" " +
                      dataa?.applicantFirstName +
                      " " +
                      dataa?.applicantMiddleName +
                      " " +
                      dataa?.applicantLastName}
                  </>
                )}
                {language === "mr" && (
                  <>
                    {" " +
                      dataa?.applicantFirstNameMr +
                      " " +
                      dataa?.applicantMiddleNameMr +
                      " " +
                      dataa?.applicantLastNameMr}
                  </>
                )}
              </h4>
            </div>

            <div className={styles.labelValue}>
              <h4>
                <b>
                  <FormattedLabel id="applicationDate" />:
                </b>{" "}
                {} {moment(dataa?.applicationDate).format("DD-MM-YYYY")}
              </h4>
            </div>
            <div className={styles.labelValue}>
              <h4>
                <b>
                  <FormattedLabel id="totalAmount" />:
                </b>{" "}
                ₹ {chargePerCopy?.amount}{" "}
              </h4>
            </div>

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>
                    <FormattedLabel id="srNo" />
                  </th>
                  <th colSpan={8}>
                    <FormattedLabel id="chargeType" />
                  </th>
                  <th colSpan={2}>
                    <FormattedLabel id="amount" /> (₹)
                  </th>
                </tr>
                <tr>
                  <td colSpan={4}>1)</td>
                  <td colSpan={4}>
                    <FormattedLabel
                      id={
                        router.query.trnType === "ap"
                          ? "rtiApplication"
                          : "rtiAppeal"
                      }
                    />
                  </td>
                  <td colSpan={4}>{chargePerCopy?.amount}/-</td>
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
                    <b>
                      <FormattedLabel id="totalAmount" />: ₹{" "}
                      {chargePerCopy?.amount}/-
                    </b>
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
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xs={12} md={12} sm={12} xl={6} lg={6}>
                <FormControl
                  error={!!errors.paymentType}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="paymentType" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={logedInUser === "citizenUser"}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        autoFocus
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          setValue("payment.paymentMode", "");
                        }}
                        label={<FormattedLabel id="paymentType" />}
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
              {logedInUser != "citizenUser" && (
                <Grid item xs={12} md={12} sm={12} xl={6} lg={6}>
                  <FormControl
                    error={!!errors.paymentMode}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="paymentMode" />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
              )}
            </Grid>

            {(dataa?.transactionStatus == null ||
              dataa?.transactionStatus == "Failure") && (
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value="I agree"
                      checked={checkedOne}
                      onChange={handleChangeOne}
                    />
                  }
                  label={<FormattedLabel id="iagreeForOnlinePay" />}
                />
              </Grid>
            )}
            <div>
              <div className={styles.row4}>
                <div style={{ width: "100%" }}>
                  {/* <Button
                    variant="contained"
                    color="primary"
                    // disabled={
                    //   watch("payment.paymentType") &&
                    //   watch("payment.paymentMode")
                    //     ? false
                    //     : true
                    // }
                    onClick={() => {
                      handlePay();
                    }}
                  >
                    {<FormattedLabel id="pay" />}
                  </Button> */}

                  <form method="POST" action={paymentGatUrl}>
                    <div className={styles.small} hidden>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="encRequest"
                            variant="standard"
                            value={encRequest}
                            {...register("encRequest")}
                            error={!!errors.moduleName}
                            helperText={
                              errors?.moduleName
                                ? errors.moduleName.message
                                : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.row} hidden>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="access_code"
                            variant="standard"
                            value={accessCode}
                            {...register("access_code")}
                            error={!!errors.moduleName}
                            helperText={
                              errors?.moduleName
                                ? errors.moduleName.message
                                : null
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        // sx={{ marginRight: "10px" }}
                        onClick={() => {
                          swal({
                            title:
                              language == "en" ? "Exit?" : "बाहेर पडू इच्छिता ",
                            text:
                              language == "en"
                                ? "Are you sure you want to exit this Record ? "
                                : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ? ",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                            buttons: [
                              language === "en" ? "No" : "नाही",
                              language === "en" ? "Yes" : "होय",
                            ],
                          }).then((willDelete) => {
                            if (willDelete) {
                              handleExit();
                            } else {
                              swal(
                                language == "en"
                                  ? "Record is Safe"
                                  : "रेकॉर्ड सुरक्षित आहे",
                                { button: language === "en" ? "Ok" : "ठीक आहे" }
                              );
                            }
                          });
                        }}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={!paymentGatUrl}
                        startIcon={<SaveIcon />}
                        type="submit"
                        size="small"
                      >
                        {<FormattedLabel id="payment" />}
                      </Button>
                    </div>
                  </form>
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
