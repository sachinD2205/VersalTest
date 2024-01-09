import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import styles from "./paymentSlip.module.css";
import { ToWords } from "to-words";
import { Button, Paper } from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { ExitToApp, Print } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import URLs from "../../../../URLS/urls";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Service Charges Receipt",
  });

  let user = useSelector((state) => state.user.user);
  const logedInUser = localStorage.getItem("loggedInUser");
  const headers = { Authorization: `Bearer ${user?.token}` };
  // @ts-ignore
  const printByNameDao =
    // @ts-ignore
    useSelector((state) => state?.user?.user?.userDao) ??
    // @ts-ignore
    useSelector((state) => state.user.user);
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const isDeptUser = useSelector(
    // @ts-ignore
    (state) => state?.user?.user?.userDao?.deptUser
  );

  const receiptType =
    logedInUser === "citizenUser"
      ? [{ id: 2, type: "customerCopy" }]
      : [
          { id: 1, type: "officeCopy" },
          { id: 2, type: "customerCopy" },
        ];
  const [fiscalYear, setFiscalYear] = useState("");
  const [applicationDetails, setApplicationDetails] = useState({});
  const [loiDetails, setLoiDetails] = useState(null);
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
  const toWordsEn = new ToWords({ localeCode: "en-IN" });
  const toWordsMr = new ToWords({ localeCode: "mr-IN" });
  const toWords = language == "en" ? toWordsEn : toWordsMr;
  const [paymentTypes, setPaymentTypes] = useState([]);

 

  const getPaymentTypes = () => {
    axios
      .get(`${URLs.CFCURL}/master/paymentMode/getAll`, { headers: headers })
      .then((r) => {
        setPaymentTypes(
          r.data.paymentMode.map((row) => ({
            id: row.id,
            paymentMode: row.paymentMode,
            paymentModeMr: row.paymentModeMr,
          }))
        );
      }) .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    getPaymentTypes();
    let currentYear = Number(moment(new Date()).format("YYYY"));
    setFiscalYear(`${currentYear}-${currentYear + 1}`);
    if (router.query.id != null && router.query.id != undefined) {
      if (router.query.trnType == "ap") {
        getApplicationDetails("ap");
      } else if (router.query.trnType === "apl") {
        getAppealDetails();
      } else {
        getApplicationLoiDetails();
      }
    }
  }, [router.query.id]);



  const getApplicationLoiDetails = () => {
    axios
      .get(
        `${URLs.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${router.query?.id}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.data.trnAppealLoiList.length != 0) {
          setLoiDetails({ ...res.data.trnAppealLoiList[0] });
        }
      }).catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (loiDetails != null) {
      getApplicationDetails(loiDetails?.applicationKey);
    }
  }, [loiDetails]);

  const getApplicationDetails = (data) => {
    if (data === "ap") {
      axios
        .get(`${URLs.RTI}/trnRtiApplication/getById?id=${router.query.id}`, {
          headers: headers,
        })
        .then((res) => {
          setApplicationDetails(res.data);
        })
        .catch((error) => {
          cfcErrorCatchMethod(err, false);
        });
    } else {
      axios
        .get(`${URLs.RTI}/trnRtiApplication/getById?id=${data}`, {
          headers: headers,
        })
        .then((res) => {
          setApplicationDetails({
            ...loiDetails,
            applicantFirstName: res.data.applicantFirstName,
            applicantMiddleName: res.data.applicantMiddleName,
            applicantLastName: res.data.applicantLastName,
            applicantFirstNameMr: res.data.applicantFirstNameMr,
            applicantMiddleNameMr: res.data.applicantMiddleNameMr,
            applicantLastNameMr: res.data.applicantLastNameMr,
            address: res.data.address,
            addressMr: res.data.addressMr,
          });
        })
        .catch((error) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const getAppealDetails = () => {
    axios
      .get(`${URLs.RTI}/trnRtiAppeal/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((res) => {
        setApplicationDetails(res.data);
      })
      .catch((error) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  

  return (
    <>
      <Head>
        <title>
          <FormattedLabel id="serviceChargeReceipt" />
        </title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.paymentWrapper} ref={componentRef}>
          {receiptType.map((obj, index) => (
            <div key={index}>
              <div className={styles[obj]}>
                <div className={styles.header}>
                  <Image src={"/rtiqrcode.png"} width={60} height={60} />
                  <div className={styles.centerHeader}>
                    <h1>
                      <FormattedLabel id="pcmc" />
                    </h1>
                    <div className={styles.row}>
                      <div style={{ display: "flex", columnGap: 10 }}>
                        <label style={{ fontWeight: "bold" }}>
                          <FormattedLabel id="fiscalYear" />:
                        </label>
                        <span>{fiscalYear}</span>
                      </div>
                    </div>
                  </div>
                  <Image src={"/logo.png"} width={70} height={70} />
                </div>

                <table className={styles.tableWrap}>
                  <tr className={styles.tableRow}>
                    <td
                      className={styles.tableData1}
                      style={{ textAlign: "center" }}
                      colSpan={5}
                    >
                      <FormattedLabel id={obj.type} />
                    </td>
                  </tr>

                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="receiptNo" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="date" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="relatedTo" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="cfcRefNo" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="cfcCounterNo" />}</label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData2}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails?.receiptNo
                        }
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {moment(
                          // @ts-ignore
                          applicationDetails?.transactionDateTime
                        ).format("DD-MM-YYYY")}
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        <FormattedLabel id="rti" />
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span></span>
                    </td>
                    <td className={styles.tableData2}>
                      <span></span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="receivedFrom" />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      {language === "en" && (
                        <span>
                          {applicationDetails.applicantFirstName +
                            " " +
                            applicationDetails.applicantMiddleName +
                            " " +
                            applicationDetails.applicantLastName}
                        </span>
                      )}
                      {language === "mr" && (
                        <span>
                          {applicationDetails.applicantFirstNameMr +
                            " " +
                            applicationDetails.applicantFirstNameMr +
                            " " +
                            applicationDetails.applicantFirstNameMr}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="serviceName" />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      <span>
                        {(router.query.trnType == "ap" ||
                          router.query.trnType == "loi") && (
                          <FormattedLabel id="rtiApplication" />
                        )}
                        {router.query.trnType == "apl" && (
                          <FormattedLabel id="rtiAppeal" />
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="narration" />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      <span>
                        {router.query.trnType === "ap" && (
                          <FormattedLabel id="applicationServiceReceipt" />
                        )}
                        {router.query.trnType === "apl" && (
                          <FormattedLabel id="appealServiceReceipt" />
                        )}
                        {router.query.trnType === "loi" && (
                          <FormattedLabel id="loiPaymentReceipt" />
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="address" />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      {language === "en" && (
                        <span>{applicationDetails.address}</span>
                      )}
                      {language === "mr" && (
                        <span>{applicationDetails.addressMr}</span>
                      )}
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="paymentMode" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="rupees" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="bankName" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="chequeNo" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="chequeDate" />}</label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData2}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails?.paymentModeKey != 0 ||
                          applicationDetails.paymentModeKey != null
                            ? (applicationDetails?.paymentType != undefined
                                ? language === "en"
                                  ? applicationDetails?.paymentType + " - "
                                  : applicationDetails?.paymentType === "Online"
                                  ? "ऑनलाइन - "
                                  : "ऑफलाइन -"
                                : "") +
                              (applicationDetails?.paymentModeKey != null
                                ? language === "en"
                                  ? paymentTypes &&
                                    paymentTypes?.find(
                                      (obj) =>
                                        obj.id ===
                                        applicationDetails?.paymentModeKey
                                    )?.paymentMode
                                  : paymentTypes &&
                                    paymentTypes?.find(
                                      (obj) =>
                                        obj.id ===
                                        applicationDetails?.paymentModeKey
                                    )?.paymentModeMr
                                : "-")
                            : applicationDetails?.paymentMode
                        }
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {(router.query.trnType === "ap" ||
                          router.query.trnType === "apl") &&
                          Number(
                            applicationDetails?.serviceChargePaidAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.receivedAmount).toFixed(2)}

                        {/* <FormattedLabel id='twentyRs' /> */}
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {language === "en"
                          ? // @ts-ignore
                            applicationDetails?.paymentDao?.bankNameEn
                          : // @ts-ignore
                            applicationDetails?.paymentDao?.bankNameMr}
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      {/* <span>01/02/2023</span> */}
                    </td>
                    <td className={styles.tableData2}>
                      {/* <span>State Bank of India</span> */}
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="referenceNo" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="date" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="details" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="payableAmount" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="receivedAmount" />}</label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData2}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails?.bankRefNo
                        }
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {moment(applicationDetails?.transactionDateTime).format(
                          "DD-MM-YYYY "
                        )}
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {(router.query.trnType === "ap" ||
                          router.query.trnType === "apl") && (
                          <FormattedLabel id="serviceCharges" />
                        )}
                        {router.query.trnType === "loi" && (
                          <FormattedLabel id="loiPayment" />
                        )}
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {(router.query.trnType === "ap" ||
                          router.query.trnType === "apl") &&
                          Number(
                            applicationDetails?.serviceChargeAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.receivedAmount).toFixed(2)}
                        {/* <FormattedLabel id='twentyRs' /> */}
                      </span>
                      <br />
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {(router.query.trnType === "ap" ||
                          router.query.trnType === "apl") &&
                          Number(
                            applicationDetails?.serviceChargePaidAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.receivedAmount).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="payableAmount" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="rebateAmount" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="advanceAmount" />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>
                        {<FormattedLabel id="actualPayableAmount" />}
                      </label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="receivedAmount" />}</label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData2}>
                      <label>
                        {(router.query.trnType === "ap" ||
                          router.query.trnType === "apl") &&
                          Number(
                            applicationDetails?.serviceChargeAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.receivedAmount).toFixed(2)}
                      </label>
                    </td>
                    <td className={styles.tableData2}>
                      {/* <label>Rebate Amount/सूट रक्कम</label> */}
                    </td>
                    <td className={styles.tableData2}>
                      {/* <label>Advance Amount/आगाऊ रक्कम</label> */}
                    </td>
                    <td className={styles.tableData2}>
                      <label>
                        {(router.query.trnType === "ap" ||
                          router.query.trnType === "apl") &&
                          Number(
                            applicationDetails?.serviceChargeAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.receivedAmount).toFixed(2)}
                      </label>
                    </td>
                    <td className={styles.tableData2}>
                      <label>
                        {(router.query.trnType === "ap" ||
                          router.query.trnType === "apl") &&
                          Number(
                            applicationDetails?.serviceChargePaidAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.receivedAmount).toFixed(2)}
                      </label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1} colSpan={1}>
                      <label>{<FormattedLabel id="totalAmount" />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      <label>
                        {(router.query.trnType === "ap" ||
                          router.query.trnType === "apl") &&
                          Number(
                            applicationDetails?.serviceChargePaidAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.totalAmount).toFixed(2)}

                        {/* <FormattedLabel id='twentyRs' /> */}
                      </label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="amountInWord" />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={2}>
                      {(router.query.trnType === "ap" ||
                        router.query.trnType === "apl") && (
                        <span>
                          ₹.{" "}
                          {toWords.convert(
                            Number(
                              applicationDetails?.serviceChargePaidAmount || 0
                            )
                          )}{" "}
                          {language === "en" ? " Rupees Only" : " रुपये फक्त "}
                          {/* <FormattedLabel id='twentyRsWords' /> */}
                        </span>
                      )}
                      {router.query.trnType === "loi" && (
                        <span>
                          ₹.{" "}
                          {toWords.convert(
                            Number(applicationDetails?.totalAmount || 0)
                          )}{" "}
                          {language === "en" ? " Rupees Only" : " रुपये फक्त "}
                          {/* <FormattedLabel id='twentyRsWords' /> */}
                        </span>
                      )}
                    </td>
                    <td className={styles.tableData1} colSpan={3}>
                      <label style={{ marginBottom: 100 }}>
                        {<FormattedLabel id="receiverSignature" />}:
                      </label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="remark" />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={2}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails.billingNotes
                        }
                      </span>
                    </td>
                    <td
                      className={styles.tableData3}
                      rowSpan={3}
                      colSpan={2}
                    ></td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>
                        {<FormattedLabel id="printDateAndTime" />}:{" "}
                      </label>
                    </td>
                    <td className={styles.tableData3} colSpan={2}>
                      <span>
                        {moment(new Date()).format("DD-MM-YYYY HH:mm")}
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id="printBy" />}: </label>
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
                </table>
              </div>
              {obj.id == 1 && <div className={styles.divider}></div>}
            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <Button
            variant="contained"
            color="error"
            size="small"
            endIcon={<ExitToApp />}
            onClick={() => {
              logedInUser === "citizenUser"
                ? router.push("/dashboard")
                : logedInUser === "cfcUser"
                ? router.push("/CFC_Dashboard")
                : router.query.trnType === "ap"
                ? router.push(
                    "/RTIOnlineSystem/transactions/rtiApplication/rtiAplicationList"
                  )
                : router.push(
                    "/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList"
                  );
            }}
          >
            <FormattedLabel id="exit" />
          </Button>
          <Button
            variant="contained"
            endIcon={<Print />}
            size="small"
            onClick={handleToPrint}
          >
            <FormattedLabel id="print" />
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
