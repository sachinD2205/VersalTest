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
import Loader from "../../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  let user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state?.user?.user?.token);
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
  const [payDetail, setPayDetail] = useState();
  const [cfcDetail, setCfcDetail] = useState({});

  const [loading, setLoading] = useState(true);

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
      router.push(`/lms/transactions/newMembershipRegistration/scrutiny`);
    }
  };

  useEffect(() => {
    if (router?.query?.id) {
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
          setChargePerCopy(r.data.serviceCharge?.amount);
        });
    }
  }, [router?.query]);

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

  const getCfcUserDetails = () => {
    let cfcId = user?.userDao?.cfc;
    if (cfcId) {
      axios
        .get(`${urls.CFCURL}/master/cfcCenters/getByCfcId?cfcId=${cfcId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleExit = () => {
    // swal("Exit!", "Successfully Exitted  Payment!", "success");
    // if (router.query.applicationSide == "Citizen") {
    //   router.push({
    //     pathname: `/dashboard`,
    //   });
    // } else {
    //   router.push("/lms/transactions/newMembershipRegistration/scrutiny");
    // }

    sweetAlert({
      title: language === "en" ? "Exit ? " : "बाहेर पडायचे ?",
      text:
        language === "en"
          ? "Are you sure you want to exit this Record ? "
          : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ?",
      icon: "warning",
      buttons: {
        ok: language === "en" ? "Ok" : "ठीक आहे",
        cancel: language === "en" ? "Cancel" : "रद्द करा",
      },
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((will) => {
      if (will) {
        swal({
          text:
            language === "en"
              ? "Successfully Exited !"
              : "यशस्वीरित्या बाहेर पडलो !",
          icon: "success",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
        // router.push(`/dashboard`);
        if (localStorage.getItem("loggedInUser") == "citizenUser") {
          router.push(`/dashboard`);
        } else if (localStorage.getItem("loggedInUser") == "cfcUser") {
          router.push(`/CFC_Dashboard`);
        } else {
          router.push(`/lms/transactions/newMembershipRegistration/scrutiny`);
        }
      } else {
        swal({
          text: language === "en" ? "Record is Safe " : "रेकॉर्ड सुरक्षित आहे",
          icon: "success",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
      }
    });
  };

  const [serviceCharge, setServiceCharges] = useState([]);

  const getServiceCharges = () => {
    axios
      // .get(
      //   `${urls.CFCURL
      //   }/master/servicecharges/getByServiceId?serviceId=${getValues(
      //     'serviceId',
      //   )}`,
      // )
      .get(`${urls.LMSURL}/libraryRateCharge/getByServiceId?serviceId=85`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Service charges", r.data.mstLibraryRateChargeList);
        // setValue('serviceCharges', r.data.mstLibraryRateChargeList)
        let tempCharges = [];
        r.data.mstLibraryRateChargeList.forEach((data) => {
          if (libraryType == "L" && data.libraryType == "L") {
            // if (data.chargeType == "C" || data.chargeType == "D") {
            if (
              data.chargeType == "C" ||
              data.chargeType == "D" ||
              data.chargeType == "F"
            ) {
              tempCharges.push(data);
            }
          } else if (libraryType == "C" && data.libraryType == "C") {
            // if (data.chargeType == "C" || data.chargeType == "D") {
            if (
              data.chargeType == "C" ||
              data.chargeType == "D" ||
              data.chargeType == "F"
            ) {
              tempCharges.push(data);
            }
          }
        });

        console.log("tempcharges", tempCharges);
        setServiceCharges(tempCharges);
      });
  };

  useEffect(() => {
    console.log("serviceCharge", serviceCharge);
  }, [serviceCharge]);

  //--------------------- new code for CFC payment too Started---------------------------
  const handlePay = () => {
    setLoading(true);
    setValue("payment.amount", dataa?.loiDao?.amount);
    console.log(" dataa?.id", dataa?.id);
    const finalBody = {
      id: Number(dataa?.id),
      serviceId: 85,
      paymentDao: getValues("payment"),
    };
    let ccAvenueKitLtp = null;
    ccAvenueKitLtp = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_HOST;
    let testBody = {
      currency: "INR",
      language: "EN",
      moduleId: "LMS",
      amount: watch("payment.amount"),
      divertPageLink:
        "/lms/transactions/newMembershipRegistration/scrutiny/pgSuccess",
      loiId: "0",
      loiNo: "123456",
      ccAvenueKitLtp: ccAvenueKitLtp,
      serviceId: 85,
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
      axios
        .post(
          `${urls.LMSURL}/trnApplyForNewMembership/processPaymentCollection`,
          _finalBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setLoading(false);
          if (res.status == 200 || res.status == 201) {
            swal("Submitted!", "Payment Collected successfully !", "success");
            router.push({
              pathname:
                "/lms/transactions/newMembershipRegistration/scrutiny/ServiceChargeRecipt",
              query: {
                id: router?.query?.id,
                applicationSide: router?.query?.applicationSide,
              },
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          swal("Error!", "Somethings Wrong!", "error");
          // router.push("/lms/transactions/newMembershipRegistration/scrutiny");
          backToHomeButton();
        });
    } else if (watch("payment.paymentType") === "Online") {
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
            getToPaymentGateway(res.data);
          }
        })
        .catch((err) => {
          setLoading(false);
          swal("Error!", "Somethings Wrong!", "error");
          // router.push("/lms/transactions/newMembershipRegistration/scrutiny");
          backToHomeButton();
        });
    } else {
      console.log("finalBody", finalBody);
      axios
        .post(
          `${urls.LMSURL}/trnApplyForNewMembership/processPaymentCollection`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setLoading(false);
          if (res.status == 200 || res.status == 201) {
            swal("Submitted!", "Payment Collected successfully !", "success");
            router.push({
              pathname:
                "/lms/transactions/newMembershipRegistration/scrutiny/ServiceChargeRecipt",
              query: {
                id: router?.query?.id,
                applicationSide: router?.query?.applicationSide,
              },
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          swal("Error!", "Somethings Wrong!", "error");
          // router.push("/lms/transactions/newMembershipRegistration/scrutiny");
          backToHomeButton();
        });
    }

    console.log(":a1", router?.query?.applicationSide);
  };
  //--------------------- new code end---------------------------

  // ---------------------old code started-------------------------------------------------
  // const handlePay = () => {
  //   setValue("payment.amount", dataa?.loiDao?.amount);
  //   console.log(" dataa?.id", dataa?.id);
  //   const finalBody = {
  //     id: Number(dataa?.id),
  //     // role: 'CASHIER',
  //     // loi: getValues('loi'),
  //     paymentDao: getValues("payment"),
  //   };
  //   // router.push({
  //   //   pathname:
  //   //     '/lms/transactions/newMembershipRegistration/scrutiny/ServiceChargeRecipt',
  //   //   query: {
  //   //     id: router?.query?.id
  //   //   },
  //   // })
  //   // accountNumber: getValues('accountNumber'),
  //   // bankName: getValues('bankName'),
  //   // branchName: getValues('branchName'),
  //   // ifscCode: getValues('ifsc'),
  //   // console.log('Search Body', finalBody)
  //   // router.push({
  //   //   pathname: '/marriageRegistration/Receipts/ServiceChargeRecipt',
  //   //   query: {
  //   //     ...router?.query,
  //   //   },
  //   // })
  //   // redirectUrl:'https://noncoreuat.pcmcindia.gov.in/payment/examples/jsp/paymentGateway/ccavResponseHandler.jsp',

  //   let ccAvenueKitLtp = null;
  //   // switch (location.hostname) {
  //   //   case "localhost":
  //   //     ccAvenueKitLtp = "L";
  //   //     break;
  //   //   case "noncoredev.pcmcindia.gov.in":
  //   //     ccAvenueKitLtp = "T";
  //   //     break;
  //   //   case "noncoreuat.pcmcindia.gov.in":
  //   //     ccAvenueKitLtp = "T";
  //   //     break;
  //   //   default:
  //   //     ccAvenueKitLtp = "L";
  //   //     break;
  //   // }

  //   ccAvenueKitLtp = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_HOST;

  //   console.log("kay yetay", ccAvenueKitLtp);
  //   let testBody = {
  //     currency: "INR",
  //     language: "EN",
  //     moduleId: "LMS",
  //     amount: watch("payment.amount"),
  //     divertPageLink:
  //       "/lms/transactions/newMembershipRegistration/scrutiny/pgSuccess",
  //     loiId: "0",
  //     loiNo: "123456",
  //     ccAvenueKitLtp: ccAvenueKitLtp,
  //     serviceId: 85,
  //     applicationNo: router?.query?.applicationNumber,
  //     applicationId: Number(router?.query?.id),
  //     applicationSide: router?.query?.applicationSide,
  //   };

  //   console.log("kya aara", testBody);
  //   if (watch("payment.paymentType") === "Online") {
  //     axios
  //       .post(
  //         `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
  //         testBody
  //       )
  //       .then((res) => {
  //         if (res.status == 200 || res.status == 201) {
  //           let tempBody = {
  //             encRequest: res.data.encRequest,
  //             access_code: res.data.access_code,
  //           };

  //           // let urltemp = res.data.url;
  //           // window.location(urltemp);

  //           // setPayDetail(res.data)

  //           getToPaymentGateway(res.data);

  //           // router.push(urltemp)
  //           // router.push({
  //           //   pathname:
  //           //   urltemp,
  //           //   query:tempBody,
  //           // })
  //           // axios
  //           //   .post(
  //           //     `${urltemp}`,
  //           //     tempBody,
  //           //   )
  //           //   .then((res1) => {
  //           //     swal('Payement Screen')

  //           //   })
  //         }
  //       });
  //   } else {
  //     axios
  //       .post(
  //         `${urls.LMSURL}/trnApplyForNewMembership/processPaymentCollection`,
  //         finalBody
  //       )
  //       .then((res) => {
  //         console.log(res);
  //         swal("Submitted!", "Payment Collected successfully !", "success");
  //         if (res.status == 200 || res.status == 201) {
  //           router.push({
  //             pathname:
  //               "/lms/transactions/newMembershipRegistration/scrutiny/ServiceChargeRecipt",
  //             query: {
  //               id: router?.query?.id,
  //               applicationSide: router?.query?.applicationSide,
  //             },
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         swal("Error!", "Somethings Wrong!", "error");
  //         router.push("/lms/transactions/newMembershipRegistration/scrutiny");
  //       });
  //   }

  //   console.log(":a1", router?.query?.applicationSide);
  // };
  //--------------------- old code end-----------------------------------------------------------------------
  // useEffect(() => {
  //   if (payDetail) {
  //     console.log("aala re", payDetail);

  //   }
  // }, [payDetail])

  const getToPaymentGateway = (payDetail) => {
    // return (
    //   <form id="nonseamless" method="post" name="redirect" action={payDetail.url}>
    //     <input type="hidden" id="encRequest" name="encRequest" value={payDetail.encRequest}></input>
    //     <input type="hidden" id="access_code" name="access_code" value={payDetail.access_code}></input>
    //     {/* <script language="javascript">{document.redirect.submit()}</script> */}
    //     <script language="javascript">{dispatchEvent(new Event("submit"))}</script>

    //   </form>
    // )
    // --------------------------------------------
    // document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
    // <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
    // <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
    // document.getElementById("dynForm").submit();
    // ----------------------------------------------------
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
      </form>`;
    document.getElementById("dynForm").submit();
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
        // ------------------------------------------------------------
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
        // ------------------------------------------------------------
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
      });
  };

  const [dataa, setDataa] = useState(null);
  const [libraryType, setLibraryType] = useState();

  const [libraryList, setLibraryList] = useState([]);

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getLibraryList();
  }, []);

  useEffect(() => {
    getServiceCharges();
  }, [libraryType]);

  const getLibraryList = () => {
    axios
      // .get(
      //   `${urls.CFCURL
      //   }/master/servicecharges/getByServiceId?serviceId=${getValues(
      //     'serviceId',
      //   )}`,
      // )
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLibraryList(r.data?.libraryMasterList);
      });
  };
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
    let _id = { id: Number(router?.query?.id) };
    axios
      .post(
        `${urls.LMSURL}/trnApplyForNewMembership/checkingDiscountBeforePayment`,
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
      });
  };

  const getIsOfferApplicableOrNot = () => {
    if (router?.query?.serviceId == 85) {
      setLoading(true);
      axios
        .get(
          `${urls.LMSURL}/trnApplyForNewMembership/getById?id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          reset(res.data);
          setDataa(res.data);
          setLoading(false);
          console.log("board data", res.data);
          setLibraryType(
            libraryList?.find((library) => library.id == res.data.libraryKey)
              ?.libraryType
          );
        })
        .catch((e) => {
          console.log("error", e);
          setLoading(false);
          catchExceptionHandlingMethod(e, language);
        });
    }
  };

  useEffect(() => {
    if (router?.query?.id && libraryList?.length > 0) {
      sendIdForOfferApplicableOrNot();
    }
  }, [router.query, libraryList]);

  // useEffect(() => {
  //   getIsOfferApplicableOrNot();
  // }, [libraryList]);

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

  useEffect(() => {
    if (localStorage.getItem("loggedInUser") == "cfcUser") {
      getCfcUserDetails();
    }
  }, [localStorage.getItem("loggedInUser")]);

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
                    color: "white",
                    marginTop: "7px",
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
              <h4>एकुण रक्कम : {dataa?.loiDao?.amount}&nbsp;रु</h4>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम(रु)</th>
                  </tr>
                  {/* <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>{dataa?.serviceNameMr}</td>
                    <td colSpan={4}>{dataa?.loiDao?.amount}</td>
                  </tr> */}
                  {serviceCharge?.map((service, index) => (
                    // < tr >
                    //   <td colSpan={4}>{index + 1}</td>
                    //   <td colSpan={4}>{service.chargeNameMr}</td>
                    //   <td colSpan={4}>{service.amount}</td>
                    // </tr>
                    <tr>
                      <td colSpan={4}>{index + 1}</td>
                      {service.chargeType == "C" ? (
                        <td colSpan={4}>
                          {service.chargeNameMr} * सदस्यत्व महिने
                        </td>
                      ) : (
                        <td colSpan={4}>{service.chargeNameMr}</td>
                      )}
                      {service.chargeType == "C" ? (
                        <td colSpan={4}>
                          {service.amount} * {dataa?.membershipMonths}
                        </td>
                      ) : (
                        <td colSpan={4}>{service.amount}</td>
                      )}
                    </tr>
                  ))}
                  {dataa?.loiDao?.isDiscount == true && (
                    <tr>
                      <td colSpan={4}>4</td>
                      <td colSpan={4}>सवलत</td>
                      <td colSpan={4}>-{dataa?.loiDao?.discountAmount}</td>
                    </tr>
                  )}
                  {/* {dataa?.libraryType == "L" ? (
                    dataa?.membershipMonths == "12" ? (
                      <tr>
                        <td colSpan={4}></td>
                        <td colSpan={4}>सवलत</td>
  
                        <td colSpan={4}>-40</td>
                      </tr>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )} */}
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
                          label={<FormattedLabel id="bankAccountNo" />}
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
                                // label="Status at time of marriage *"
                                label={<FormattedLabel id="upiList" />}
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
                          label={<FormattedLabel id="accountNo" required />}
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
              <div>
                <div className={styles.row4}>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
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
                        // swal({
                        //   title: "Exit?",
                        //   text: "Are you sure you want to exit this Record ? ",
                        //   icon: "warning",
                        //   buttons: true,
                        //   dangerMode: true,
                        // }).then((willDelete) => {
                        //   if (willDelete) {
                        //     swal("Record is Successfully Exit!", {
                        //       icon: "success",
                        //     });
                        handleExit();
                        //   } else {
                        //     swal("Record is Safe");
                        //   }
                        // });
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
