import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import Image from "next/image";
import styles from "./paymentSlip.module.css";
import URLs from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { Button, Grid, Paper } from "@mui/material";
import { ExitToApp, Print } from "@mui/icons-material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";

const Index = () => {
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Auditorium Booking Payment Slip",
  });

  // @ts-ignore
  const printByNameDao =
    useSelector((state) => state?.user?.user?.userDao) ??
    useSelector((state) => state.user.user);
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  // @ts-ignore
  const isDeptUser = useSelector(
    (state) => state?.user?.user?.userDao?.deptUser
  );

  const [fiscalYear, setFiscalYear] = useState("");
  const [applicationDetails, setApplicationDetails] = useState({});
  const [auditoriums, setAuditoriums] = useState([]);
  const [bankName, setBankName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState();

  const [paymentTypes, setPaymentTypes] = useState([]);
  const converter = require("number-to-words");

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
        setPaymentTypes(
          r.data.paymentType.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
            paymentTypeMr: row.paymentTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [paymentModes, setPaymentModes] = useState([]);
  const getPaymentModes = () => {
    axios
      .get(`${urls.BaseURL}/paymentMode/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setPaymentModes(
          r.data.paymentMode.map((row) => ({
            id: row.id,
            paymentMode: row.paymentMode,
            paymentModeMr: row.paymentModeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            ...row,
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  console.log("showData", showData);

  useEffect(() => {
    let currentYear = Number(moment(new Date()).format("YYYY"));
    setFiscalYear(`${currentYear}-${currentYear + 1}`);
    // setFiscalYear(`${currentYear}-${currentYear + 1 - 2000}`);

    //Get Bank
    axios
      .get(`${URLs.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBankName(
          res.data.bank.map((j) => ({
            id: j.id,
            bankNameEn: j.bankName,
            bankNameMr: j.bankNameMr,
            branchNameEn: j.branchName,
            branchNameMr: j.branchNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, []);

  useEffect(() => {
    console.log(
      "first1",
      router?.query,
      router?.query?.data &&
        JSON.parse(JSON.parse(router?.query?.data)?.applicationId)
    );
    // router?.query?.data && setShowData(JSON.parse(router?.query?.data));
  }, []);

  useEffect(() => {
    router?.query?.data && getAllData();
    getPaymentModes();
    getPaymentTypes();
    getAuditorium();
  }, []);

  const getAllData = () => {
    setLoading(true);
    if (router?.query?.mode == "ONLINE") {
      let id =
        router?.query?.data &&
        JSON.parse(JSON.parse(router?.query?.data)?.applicationId);
      axios
        .get(
          `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("respinse", res);
          const updatedObj = {
            ...res?.data,
            paymentData:
              router?.query?.data && JSON?.parse(router?.query?.data),
          };
          setShowData(updatedObj);
          setLoading(false);
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    } else {
      let id = router?.query?.data && JSON.parse(router?.query?.data);
      axios
        .get(
          `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id?.applicationNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("respinse", res);
          const updatedObj = {
            ...res?.data,
            paymentData:
              router?.query?.data && JSON?.parse(router?.query?.data),
          };
          setShowData(updatedObj);
          setLoading(false);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
          setLoading(false);
        });
    }
  };

  var num =
    "Zero One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen".split(
      " "
    );
  var tens = "Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety".split(" ");

  function number2words(n = 0) {
    if (n < 20) return num[n];
    var digit = n % 10;
    if (n < 100) return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
    if (n < 1000)
      return (
        num[~~(n / 100)] +
        " Hundred" +
        (n % 100 == 0 ? "" : " " + number2words(n % 100))
      );
    return (
      number2words(~~(n / 1000)) +
      " Thousand" +
      (n % 1000 != 0 ? " " + number2words(n % 1000) : "")
    );
  }

  // Convert the rupee part to words
  const rupeesWords =
    showData && converter.toWords(Math.floor(showData?.rentAmount));

  // Convert the paisa part to words
  const paisaWords =
    showData &&
    converter.toWords(
      Math.round(
        (showData?.rentAmount - Math.floor(showData?.rentAmount)) * 100
      ),
      { unit: "paisa" }
    );

  return (
    <>
      <Head>
        <title>Auditorium Booking Payment Slip</title>
      </Head>

      <Paper className={styles.main}>
        <div className={styles.paymentWrapper} ref={componentRef}>
          <div className={styles.officeCopy}>
            <Grid container>
              <Grid item xs={2}></Grid>
              <Grid item xs={7}>
                <div className={styles.centerHeader}>
                  <h1>Pimpri-Chinchwad Municipal Corporation</h1>
                  <div className={styles.row}>
                    <div style={{ display: "flex", columnGap: 10 }}>
                      <label style={{ fontWeight: "bold" }}>
                        Financial Year:
                      </label>
                      <span>{fiscalYear}</span>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "end" }}>
                <Image src={"/logo.png"} width={70} height={50} />
              </Grid>
            </Grid>
            {/* <div className={styles.header}> */}
            {/* <Image src={"/qrcode1.png"} width={60} height={60} /> */}
            {/* <div className={styles.centerHeader}>
                <h1>Pimpri-Chinchwad Municipal Corporation</h1>
                <div className={styles.row}>
                  <div style={{ display: "flex", columnGap: 10 }}>
                    <label style={{ fontWeight: "bold" }}>F.Y.:</label>
                    <span>{fiscalYear}</span>
                  </div>
                </div>
              </div> */}
            {/* <Image src={"/logo.png"} width={70} height={70} /> */}
            {/* </div> */}

            <table className={styles.tableWrap}>
              <tr className={styles.tableRow}>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: "center" }}
                  colSpan={6}
                >
                  Office Copy / कार्यालयाची प्रत
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td
                  width="16%"
                  style={{
                    paddingLeft: "10px",
                    border: "1px solid black",
                    fontWeight: "bolder",
                    backgroundColor: "#DEE3DE",
                  }}
                >
                  <label>Receipt No / पावती क्र.</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date / तारीख</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Related To / संबंधित</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Booking No / बुकिंग क्र.</label>
                </td>
                <td className={styles.tableData1}>
                  <label>CFC Counter No / सीऐफसी काउंटर क्र.</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Auditorium Name / प्रेक्षागृह / नाट्यगृह नाव</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.paymentData?.tracking_id}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {moment(
                      // @ts-ignore
                      applicationDetails?.applicationDate
                    ).format("DD-MM-YYYY")}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? "Public Auditorium Booking & Broadcast Management"
                      : "सार्वजनिक प्रेक्षागृह / नाट्यगृह बुकिंग आणि प्रसारण व्यवस्थापन"}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{showData?.paymentDao?.bookingNo}</span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {showData?.auditoriumId &&
                      auditoriums?.find(
                        (obj) => obj?.id == showData?.auditoriumId
                      )?.auditoriumNameEn}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Received From / कडून प्राप्त</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{showData?.applicantName}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Event Date / कार्यक्रमाची तारीख:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {showData?.timeSlotList &&
                      JSON?.parse(showData?.timeSlotList)?.map((val) => {
                        return (
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                              }}
                            >
                              <h4 style={{ marginLeft: "10px" }}>
                                <b>
                                  {moment(val?.bookingDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </b>
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Event Time / कार्यक्रमाची वेळ:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {showData?.timeSlotList &&
                      JSON?.parse(showData?.timeSlotList)?.map((val) => {
                        return (
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                              }}
                            >
                              <h4 style={{ marginLeft: "10px" }}>
                                <b>
                                  {val?.fromTime} To {val?.toTime}
                                </b>
                              </h4>
                              <h4 style={{ marginLeft: "10px" }}>
                                <b></b>
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Application No / अर्ज क्रमांक </label>
                </td>
                <td className={styles.tableData3}>
                  <span>{showData?.applicationNumber}</span>
                </td>
                <td className={styles.tableData1}>
                  <label>LOI No / एलओआय क्रमांक.</label>
                </td>
                <td className={styles.tableData3}>
                  <span>{showData?.LoiNo}</span>
                </td>
                <td className={styles.tableData1}>
                  <label>LOI Date / एलओआय तारीख</label>
                </td>
                <td className={styles.tableData3}>
                  <span>
                    {moment(showData?.loidao?.loiDate).format("DD/MM/YYYY")}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Service Name / सेवेचे नाव</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Auditorium Booking</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Narration / वर्णन</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{`Regarding Online Auditorium Booking For LOI No ${showData?.LoiNo}`}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Address / पत्ता</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {showData?.applicantFlatHouseNo +
                      ", " +
                      showData?.applicantArea +
                      ", " +
                      showData?.applicantCity +
                      ", " +
                      showData?.applicantState +
                      ", " +
                      showData?.applicantPinCode +
                      "."}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Payment Type / पेमेंट प्रकार</label>
                </td>
                <td className={styles.tableData1} colSpan={2}>
                  <label>Transaction Id / व्यवहार आयडी</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Bank Name / बँकेचे नाव</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque No / चेक क्र.</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque Date / चेक तारीख</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {
                      paymentTypes.find(
                        (val) => val.id == showData?.paymentDao?.paymentType
                      )?.paymentType
                    }
                  </span>
                </td>
                <td className={styles.tableData2} colSpan={2}>
                  <span>{showData?.paymentData?.bank_ref_no}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? bankName?.find((val) => {
                          return val?.id == showData?.paymentDao?.bankNameId;
                        })?.bankNameEn
                      : bankName?.find(
                          (val) => val?.id === showData?.paymentDao?.bankNameId
                        )?.bankNameMr}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>01/02/2023</span> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <span>State Bank of India</span> */}
                </td>
              </tr>
              {/* <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Application No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Event</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Payable Amount</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Received Amount</label>
                </td>
              </tr> */}
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Reference No / संदर्भ क्रमांक</label>
                  <br />
                </td>
                <td className={styles.tableData3}>{showData?.LoiNo}</td>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td
                  width="25%"
                  style={{
                    paddingLeft: "10px",
                    border: "1px solid black",
                    fontWeight: "bolder",
                    backgroundColor: "#DEE3DE",
                  }}
                >
                  <label>Details / तपशील</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Payable Amount / देय रक्कम</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Received Amount / प्राप्त रक्कम</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>{1}</span>
                  <br />
                  <span>{2}</span>
                  <br />
                  <span>{3}</span>
                  <br />
                  <span>{4}</span>
                  <br />
                  <span>{5}</span>
                  <br />
                  <span>{6}</span>
                  <br /> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <label>Deposit Amount / ठेव रक्कम</label>
                  <br /> */}
                  <label>Rent Amount / भाडे रक्कम</label>
                  <br />
                  {/* <label>Security Guard Amount / सुरक्षा रक्षक रक्कम</label>
                  <br />
                  <label>Board Charges / बोर्ड शुल्क</label>
                  <br /> */}
                  <label>CGST / सीजीएसटी (9%)</label>
                  <br />
                  <label>SGST / एसजीएसटी (9%)</label>
                  <br />
                </td>
                <td
                  className={styles.tableData2}
                  style={{ textAlign: "right" }}
                >
                  {/* <span>{`${showData?.depositAmount}`}</span>
                  <br /> */}
                  <span>{`${(showData?.rentAmount / 1.18)?.toFixed(2)}`}</span>
                  <br />
                  {/* <span>{`${showData?.securityGuardChargeAmount}`}</span>
                  <br />
                  <span>{`${showData?.boardChargesAmount}`}</span>
                  <br /> */}
                  <span>{`${(
                    (showData?.rentAmount -
                      (showData?.rentAmount / 1.18)?.toFixed(2)) /
                    2
                  )?.toFixed(2)}`}</span>
                  <br />
                  <span>{`${(
                    (showData?.rentAmount -
                      (showData?.rentAmount / 1.18)?.toFixed(2)) /
                    2
                  )?.toFixed(2)}`}</span>
                  <br />
                </td>
                <td
                  className={styles.tableData2}
                  style={{ textAlign: "right" }}
                >
                  {/* <span>{`${showData?.depositAmount}`}</span>
                  <br /> */}
                  <span>{`${(showData?.rentAmount / 1.18)?.toFixed(2)}`}</span>
                  <br />
                  {/* <span>{`${showData?.securityGuardChargeAmount}`}</span>
                  <br />
                  <span>{`${showData?.boardChargesAmount}`}</span>
                  <br /> */}
                  <span>{`${(
                    (showData?.rentAmount -
                      (showData?.rentAmount / 1.18)?.toFixed(2)) /
                    2
                  )?.toFixed(2)}`}</span>
                  <br />
                  <span>{`${(
                    (showData?.rentAmount -
                      (showData?.rentAmount / 1.18)?.toFixed(2)) /
                    2
                  )?.toFixed(2)}`}</span>
                  <br />
                </td>
                {/* <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td> */}
              </tr>
              {/* <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.applicationNumber}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY")}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{showData?.eventTitle}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                  <br />
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td>
              </tr> */}
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData2}>
                  <label></label>
                </td>
                <td className={styles.tableData2}>
                  <label></label>
                </td>
                <td className={styles.tableData1}>
                  <label>Total Amount / एकूण रक्कम</label>
                </td>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: "right" }}
                >
                  <label>{`${showData?.rentAmount?.toFixed(2)}`}</label>
                </td>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: "right" }}
                >
                  <label>{`${showData?.rentAmount?.toFixed(2)}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData2}>
                  <label></label>
                </td>
                <td className={styles.tableData2}>
                  <label></label>
                </td>
                <td className={styles.tableData1}>
                  <label>Total Amount (In words) / एकूण रक्कम (अक्षरी)</label>
                </td>
                {/* <td className={styles.tableData1}></td> */}
                <td
                  colSpan={2}
                  className={styles.tableData1}
                  style={{ textAlign: "right" }}
                >
                  <label>
                    <span
                      style={{ textTransform: "capitalize" }}
                    >{`${rupeesWords} rupees and ${paisaWords} paise`}</span>
                    {
                      //   showData && number2words(showData?.rentAmount)
                      // } Only`
                    }
                  </label>
                </td>
              </tr>
              {/* <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Deposit Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.depositAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Rent Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.rentAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>security Guard Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.securityGuardChargeAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Board Charges</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.boardChargesAmount}`}</label>
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>Total Amount :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <label> {`₹${showData?.totalAmount}`}</label>
                </td>
              </tr> */}
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span></span>
                </td>
                <td className={styles.tableData1} colSpan={1}>
                  <label style={{ marginBottom: 100 }}>
                    Receiver Signature / प्राप्तकर्त्याची स्वाक्षरी
                  </label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Remark / शेरा</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{showData?.applicationStatus}</span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={1}></td>
                <td className={styles.tableData3} rowSpan={3} colSpan={1}></td>
                <td rowSpan={3} colSpan={1}>
                  <Image src={"/qrcode1.png"} width={60} height={60} />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print Date And Time / प्रिंटची तारीख आणि वेळ</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print By / द्वारे मुद्रित </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {useSelector(
                      (state) =>
                        // @ts-ignore
                        state?.user?.user?.userDao
                    )
                      ? language === "en"
                        ? printByNameDao.firstNameEn +
                          " " +
                          printByNameDao.middleNameEn +
                          " " +
                          printByNameDao.lastNameEn
                        : printByNameDao?.firstNameMr +
                          " " +
                          printByNameDao?.middleNameMr +
                          " " +
                          printByNameDao?.lastNameMr
                      : language === "en"
                      ? printByNameDao.firstName +
                        " " +
                        printByNameDao.middleName +
                        " " +
                        printByNameDao.surname
                      : printByNameDao.firstNamemr +
                        " " +
                        printByNameDao.middleNamemr +
                        " " +
                        printByNameDao.surnamemr}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>टीप</label>
                </td>
                <td className={styles.tableData3} colSpan={5}>
                  <span>
                    पिंपरी चिंचवड महानगरपालिका जीएसटी क्रमांक - 27AAALM0464E1ZB
                  </span>
                </td>
              </tr>
            </table>
          </div>

          {/* customerCopy */}
          <div className={styles.divider}></div>
          <div className={styles.customerCopy}>
            {/* <div className={styles.header}>
              <Image src={"/qrcode1.png"} width={60} height={60} />
              <div className={styles.centerHeader}>
                <h1>Pimpri-Chinchwad Municipal Corporation</h1>
                <div className={styles.row}>
                  <div style={{ display: "flex", columnGap: 10 }}>
                    <label style={{ fontWeight: "bold" }}>F.Y.:</label>
                    <span>{fiscalYear}</span>
                  </div>
                </div>
              </div>
              <Image src={"/logo.png"} width={70} height={70} />
            </div> */}
            <Grid container>
              <Grid item xs={2}></Grid>
              <Grid item xs={7}>
                <div className={styles.centerHeader}>
                  <h1>Pimpri-Chinchwad Municipal Corporation</h1>
                  <div className={styles.row}>
                    <div style={{ display: "flex", columnGap: 10 }}>
                      <label style={{ fontWeight: "bold" }}>
                        Financial Year:
                      </label>
                      <span>{fiscalYear}</span>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "end" }}>
                <Image src={"/logo.png"} width={70} height={50} />
              </Grid>
            </Grid>

            <table className={styles.tableWrap}>
              <tr className={styles.tableRow}>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: "center" }}
                  colSpan={6}
                >
                  Customer Copy / ग्राहक प्रत
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td
                  width="16%"
                  style={{
                    paddingLeft: "10px",
                    border: "1px solid black",
                    fontWeight: "bolder",
                    backgroundColor: "#DEE3DE",
                  }}
                >
                  <label>Receipt No / पावती क्र.</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date / तारीख</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Related To / संबंधित</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Booking No / बुकिंग क्र.</label>
                </td>
                <td className={styles.tableData1}>
                  <label>CFC Counter No / सीऐफसी काउंटर क्र.</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Auditorium Name / प्रेक्षागृह / नाट्यगृह नाव</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.paymentData?.tracking_id}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {moment(
                      // @ts-ignore
                      applicationDetails?.applicationDate
                    ).format("DD-MM-YYYY")}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? "Public Auditorium Booking & Broadcast Management"
                      : "सार्वजनिक प्रेक्षागृह / नाट्यगृह बुकिंग आणि प्रसारण व्यवस्थापन"}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{showData?.paymentDao?.bookingNo}</span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {showData?.auditoriumId &&
                      auditoriums?.find(
                        (obj) => obj?.id == showData?.auditoriumId
                      )?.auditoriumNameEn}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Received From / कडून प्राप्त</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{showData?.applicantName}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Event Date / कार्यक्रमाची तारीख:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {showData?.timeSlotList &&
                      JSON?.parse(showData?.timeSlotList)?.map((val) => {
                        return (
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                              }}
                            >
                              <h4 style={{ marginLeft: "10px" }}>
                                <b>
                                  {moment(val?.bookingDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </b>
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Event Time / कार्यक्रमाची वेळ:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {showData?.timeSlotList &&
                      JSON?.parse(showData?.timeSlotList)?.map((val) => {
                        return (
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                              }}
                            >
                              <h4 style={{ marginLeft: "10px" }}>
                                <b>
                                  {val?.fromTime} To {val?.toTime}
                                </b>
                              </h4>
                              <h4 style={{ marginLeft: "10px" }}>
                                <b></b>
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Application No / अर्ज क्रमांक </label>
                </td>
                <td className={styles.tableData3}>
                  <span>{showData?.applicationNumber}</span>
                </td>
                <td className={styles.tableData1}>
                  <label>LOI No / एलओआय क्रमांक.</label>
                </td>
                <td className={styles.tableData3}>
                  <span>{showData?.LoiNo}</span>
                </td>
                <td className={styles.tableData1}>
                  <label>LOI Date / एलओआय तारीख</label>
                </td>
                <td className={styles.tableData3}>
                  <span>
                    {moment(showData?.loidao?.loiDate).format("DD/MM/YYYY")}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Service Name / सेवेचे नाव</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Auditorium Booking</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Narration / वर्णन</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{`Regarding Online Auditorium Booking For LOI No ${showData?.LoiNo}`}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Address / पत्ता</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {showData?.applicantFlatHouseNo +
                      ", " +
                      showData?.applicantArea +
                      ", " +
                      showData?.applicantCity +
                      ", " +
                      showData?.applicantState +
                      ", " +
                      showData?.applicantPinCode +
                      "."}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Payment Type / पेमेंट प्रकार</label>
                </td>
                <td className={styles.tableData1} colSpan={2}>
                  <label>Transaction Id / व्यवहार आयडी</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Bank Name / बँकेचे नाव</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque No / चेक क्र.</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque Date / चेक तारीख</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {
                      paymentTypes.find(
                        (val) => val.id == showData?.paymentDao?.paymentType
                      )?.paymentType
                    }
                  </span>
                </td>
                <td className={styles.tableData2} colSpan={2}>
                  <span>{showData?.paymentData?.bank_ref_no}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? bankName?.find((val) => {
                          return val?.id == showData?.paymentDao?.bankNameId;
                        })?.bankNameEn
                      : bankName?.find(
                          (val) => val?.id === showData?.paymentDao?.bankNameId
                        )?.bankNameMr}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>01/02/2023</span> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <span>State Bank of India</span> */}
                </td>
              </tr>
              {/* <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Application No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Event</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Payable Amount</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Received Amount</label>
                </td>
              </tr> */}
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Reference No / संदर्भ क्रमांक</label>
                  <br />
                </td>
                <td className={styles.tableData3}>{showData?.LoiNo}</td>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td
                  width="25%"
                  style={{
                    paddingLeft: "10px",
                    border: "1px solid black",
                    fontWeight: "bolder",
                    backgroundColor: "#DEE3DE",
                  }}
                >
                  <label>Details / तपशील</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Payable Amount / देय रक्कम</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Received Amount / प्राप्त रक्कम</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>{1}</span>
                  <br />
                  <span>{2}</span>
                  <br />
                  <span>{3}</span>
                  <br />
                  <span>{4}</span>
                  <br />
                  <span>{5}</span>
                  <br />
                  <span>{6}</span>
                  <br /> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <label>Deposit Amount / ठेव रक्कम</label>
                  <br /> */}
                  <label>Rent Amount / भाडे रक्कम</label>
                  <br />
                  {/* <label>Security Guard Amount / सुरक्षा रक्षक रक्कम</label>
                  <br />
                  <label>Board Charges / बोर्ड शुल्क</label>
                  <br /> */}
                  <label>CGST / सीजीएसटी (9%)</label>
                  <br />
                  <label>SGST / एसजीएसटी (9%)</label>
                  <br />
                </td>
                <td
                  className={styles.tableData2}
                  style={{ textAlign: "right" }}
                >
                  {/* <span>{`${showData?.depositAmount}`}</span>
                  <br /> */}
                  <span>{`${(showData?.rentAmount / 1.18)?.toFixed(2)}`}</span>
                  <br />
                  {/* <span>{`${showData?.securityGuardChargeAmount}`}</span>
                  <br />
                  <span>{`${showData?.boardChargesAmount}`}</span>
                  <br /> */}
                  <span>{`${(
                    (showData?.rentAmount -
                      (showData?.rentAmount / 1.18)?.toFixed(2)) /
                    2
                  )?.toFixed(2)}`}</span>
                  <br />
                  <span>{`${(
                    (showData?.rentAmount -
                      (showData?.rentAmount / 1.18)?.toFixed(2)) /
                    2
                  )?.toFixed(2)}`}</span>
                  <br />
                </td>
                <td
                  className={styles.tableData2}
                  style={{ textAlign: "right" }}
                >
                  {/* <span>{`${showData?.depositAmount}`}</span>
                  <br /> */}
                  <span>{`${(showData?.rentAmount / 1.18)?.toFixed(2)}`}</span>
                  <br />
                  {/* <span>{`${showData?.securityGuardChargeAmount}`}</span>
                  <br />
                  <span>{`${showData?.boardChargesAmount}`}</span>
                  <br /> */}
                  <span>{`${(
                    (showData?.rentAmount -
                      (showData?.rentAmount / 1.18)?.toFixed(2)) /
                    2
                  )?.toFixed(2)}`}</span>
                  <br />
                  <span>{`${(
                    (showData?.rentAmount -
                      (showData?.rentAmount / 1.18)?.toFixed(2)) /
                    2
                  )?.toFixed(2)}`}</span>
                  {/* <span>{`${(
                    (showData?.rentAmount +
                      showData?.securityGuardChargeAmount +
                      showData?.boardChargesAmount) *
                    0.09
                  )?.toFixed(2)}`}</span> */}
                  <br />
                </td>
                {/* <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td> */}
              </tr>
              {/* <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.applicationNumber}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY")}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{showData?.eventTitle}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                  <br />
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td>
              </tr> */}
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData2}>
                  <label></label>
                </td>
                <td className={styles.tableData2}>
                  <label></label>
                </td>
                <td className={styles.tableData1}>
                  <label>Total Amount / एकूण रक्कम</label>
                </td>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: "right" }}
                >
                  <label>{`${showData?.rentAmount?.toFixed(2)}`}</label>
                </td>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: "right" }}
                >
                  <label>{`${showData?.rentAmount?.toFixed(2)}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData2}>
                  <label></label>
                </td>
                <td className={styles.tableData2}>
                  <label></label>
                </td>
                <td className={styles.tableData1}>
                  <label>Total Amount (In words) / एकूण रक्कम (अक्षरी)</label>
                </td>
                {/* <td className={styles.tableData1}></td> */}
                <td
                  colSpan={2}
                  className={styles.tableData1}
                  style={{ textAlign: "right" }}
                >
                  <label>
                    <span
                      style={{ textTransform: "capitalize" }}
                    >{`${rupeesWords} rupees and ${paisaWords} paise`}</span>
                    {
                      //   showData && number2words(showData?.rentAmount)
                      // } Only`
                    }
                  </label>
                </td>
              </tr>
              {/* <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Deposit Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.depositAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Rent Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.rentAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>security Guard Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.securityGuardChargeAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Board Charges</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.boardChargesAmount}`}</label>
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>Total Amount :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <label> {`₹${showData?.totalAmount}`}</label>
                </td>
              </tr> */}
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span></span>
                </td>
                <td className={styles.tableData1} colSpan={1}>
                  <label style={{ marginBottom: 100 }}>
                    Receiver Signature / प्राप्तकर्त्याची स्वाक्षरी
                  </label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Remark / शेरा</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{showData?.applicationStatus}</span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={1}></td>
                <td className={styles.tableData3} rowSpan={3} colSpan={1}></td>
                <td rowSpan={3} colSpan={1}>
                  <Image src={"/qrcode1.png"} width={60} height={60} />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print Date And Time / प्रिंटची तारीख आणि वेळ</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print By / द्वारे मुद्रित</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {useSelector(
                      (state) =>
                        // @ts-ignore
                        state?.user?.user?.userDao
                    )
                      ? language === "en"
                        ? printByNameDao.firstNameEn +
                          " " +
                          printByNameDao.middleNameEn +
                          " " +
                          printByNameDao.lastNameEn
                        : printByNameDao?.firstNameMr +
                          " " +
                          printByNameDao?.middleNameMr +
                          " " +
                          printByNameDao?.lastNameMr
                      : language === "en"
                      ? printByNameDao.firstName +
                        " " +
                        printByNameDao.middleName +
                        " " +
                        printByNameDao.surname
                      : printByNameDao.firstNamemr +
                        " " +
                        printByNameDao.middleNamemr +
                        " " +
                        printByNameDao.surnamemr}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>टीप</label>
                </td>
                <td className={styles.tableData3} colSpan={5}>
                  <span>
                    पिंपरी चिंचवड महानगरपालिका जीएसटी क्रमांक - 27AAALM0464E1ZB
                  </span>
                </td>
              </tr>
            </table>

            {/* <table className={styles.tableWrap} style={{border:'solid red'}}>
              <tr className={styles.tableRow}>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: "center" }}
                  colSpan={5}
                >
                  Customer Copy
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Receipt No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Related To</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Booking No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>CFC Counter No</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.paymentDao?.receiptNumber}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {moment(
                      applicationDetails?.applicationDate
                    ).format("DD-MM-YYYY")}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? "Public Auditorium Booking & Broadcast Management"
                      : "सार्वजनिक सभागृह बुकिंग आणि प्रसारण व्यवस्थापन"}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{showData?.paymentDao?.bookingNo}</span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Received From:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{showData?.applicantName}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>LOI No:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{showData?.LoiNo}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Service Name:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Auditorium Booking</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Narration :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Regarding online auditorium booking </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Address :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {showData?.applicantFlatHouseNo +
                      ", " +
                      showData?.applicantArea +
                      ", " +
                      showData?.applicantCity +
                      ", " +
                      showData?.applicantState +
                      ", " +
                      showData?.applicantPinCode +
                      "."}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Payment Type</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Total Amount</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Bank Name</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque Date</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {
                      paymentTypes.find(
                        (val) => val.id == showData?.paymentDao?.paymentType
                      )?.paymentType
                    }
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? bankName?.find((val) => {
                          return val?.id == showData?.paymentDao?.bankNameId;
                        })?.bankNameEn
                      : bankName?.find(
                          (val) => val?.id === showData?.paymentDao?.bankNameId
                        )?.bankNameMr}
                  </span>
                </td>
                <td className={styles.tableData2}>
                </td>
                <td className={styles.tableData2}>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Application No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Event</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Payable Amount</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Received Amount</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.applicationNumber}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY")}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{showData?.eventTitle}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                  <br />
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Deposit Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.depositAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Rent Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.rentAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>security Guard Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.securityGuardChargeAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Board Charges</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.boardChargesAmount}`}</label>
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>Total Amount :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <label> {`₹${showData?.totalAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span></span>
                </td>
                <td className={styles.tableData1} colSpan={2}>
                  <label style={{ marginBottom: 100 }}>
                    Receiver Signature :
                  </label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Remark :</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{showData?.applicationStatus}</span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={1}></td>
                <td rowSpan={3} colSpan={1}>
                  <Image src={"/qrcode1.png"} width={60} height={60} />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print Date And Time : </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print By : </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {useSelector(
                      (state) =>
                        state?.user?.user?.userDao
                    )
                      ? language === "en"
                        ? printByNameDao.firstNameEn +
                          " " +
                          printByNameDao.middleNameEn +
                          " " +
                          printByNameDao.lastNameEn
                        : printByNameDao?.firstNameMr +
                          " " +
                          printByNameDao?.middleNameMr +
                          " " +
                          printByNameDao?.lastNameMr
                      : language === "en"
                      ? printByNameDao.firstName +
                        " " +
                        printByNameDao.middleName +
                        " " +
                        printByNameDao.surname
                      : printByNameDao.firstNamemr +
                        " " +
                        printByNameDao.middleNamemr +
                        " " +
                        printByNameDao.surnamemr}
                  </span>
                </td>
              </tr>
            </table> */}
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            size="small"
            variant="contained"
            endIcon={<Print />}
            onClick={handleToPrint}
          >
            Print
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              router.push({
                pathname: `/PublicAuditorium/transaction/auditoriumBooking/bookedAcknowledgmentReceipt`,
                query: showData,
              });
              // router.push(`/PublicAuditorium/transaction/auditoriumBooking/bookedAcknowledgmentReceipt`);
              // isDeptUser
              //   ? router.push(`/PublicAuditorium/transaction/bookedPublicAuditorium`)
              //   : router.push(`/dashboard`);
            }}
          >
            Exit
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
