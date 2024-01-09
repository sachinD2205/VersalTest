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

const Index = () => {
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Service Charges Receipt",
  });

  let user = useSelector((state) => state.user.user);
  const logedInUser = localStorage.getItem("loggedInUser");

  const printByNameDao =
    useSelector((state) => state?.user?.user?.userDao) ??
    useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const isDeptUser = useSelector(
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
  const toWordsEn = new ToWords({ localeCode: "en-IN" });
  const toWordsMr = new ToWords({ localeCode: "mr-IN" });
  const toWords = language == "en" ? toWordsEn : toWordsMr;
  const [paymentTypes, setPaymentTypes] = useState([]);
  const headers ={ Authorization: `Bearer ${user?.token}` };



  const getPaymentTypes = () => {
    axios.get(`${URLs.BaseURL}/paymentMode/getAll`, {
      headers: headers,
    }).then((r) => {
      setPaymentTypes(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        }))
      );
    });
  };


  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      getPaymentTypes();
    let currentYear = Number(moment(new Date()).format("YYYY"));
    setFiscalYear(`${currentYear}-${currentYear + 1}`);

    if (router.query.id != null && router.query.id != undefined) {
      if (router.query.trnType == "ht") {
        getHutDetails();
      } else if (router.query.trnType === "noc") {
        getNocDetails();
      } else if (router.query.trnType === "pp") {
        getPhotoPassDetails();
      }
    }
  }, [router.query.id]);



  const getPhotoPassDetails = () => {
    axios
      .get(`${URLs.SLUMURL}/trnIssuePhotopass/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((res) => {
        if (res.data.trnAppealLoiList.length != 0) {
          setLoiDetails({ ...res.data.trnAppealLoiList[0] });
        }
      });
  };

  // useEffect(() => {
  //   if (loiDetails != null) {
  //     getApplicationDetails(loiDetails?.applicationKey)
  //   }
  // }, [loiDetails])

  const getHutDetails = (data) => {
    console.log("Headers ", headers);
    axios
      .get(`${URLs.SLUMURL}/trnTransferHut/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((res) => {
        console.log("REZSS ", res.data);
        setApplicationDetails(res.data);
      })
      .catch((error) => {
        catchMethod(error);
      });
  };

  const getNocDetails = () => {
    axios
      .get(`${URLs.SLUMURL}/trnIssueNoc/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((res) => {
        console.log("resss ", res.data);
        setApplicationDetails(res.data);
      })
      .catch((error) => {
        catchMethod(error);
      });
  };

  const catchMethod = (err) => {
    console.log("errr ", err);
    if (err?.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language == "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err?.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language == "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language == "en" ? "Ok" : "ठीक आहे" }
      );
    }
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
                  {/* <Image src={'/RTIReceiptLogo.jpeg'} width={60} height={60} /> */}
                  <div width={60} height={60}></div>
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
                          applicationDetails?.trnLoiList &&
                            applicationDetails?.trnLoiList[0]?.receiptNo
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
                          {applicationDetails.proposedOwnerFirstName +
                            " " +
                            applicationDetails.proposedOwnerMiddleName +
                            " " +
                            applicationDetails.proposedOwnerLastName}
                        </span>
                      )}
                      {language === "mr" && (
                        <span>
                          {applicationDetails.proposedOwnerFirstNameMr +
                            " " +
                            applicationDetails.proposedOwnerMiddleNameMr +
                            " " +
                            applicationDetails.proposedOwnerLastNameMr}
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
                        {router.query.trnType == "ht" && (
                          <FormattedLabel id="hutTransfer" />
                        )}
                        {router.query.trnType == "noc" && (
                          <FormattedLabel id="issuanceOfNoc" />
                        )}
                        {router.query.trnType == "pp" && (
                          <FormattedLabel id="insuranceOfPhotopass" />
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
                        {router.query.trnType === "ht" && (
                          <FormattedLabel id="hutTransferServiceReceipt" />
                        )}
                        {router.query.trnType === "noc" && (
                          <FormattedLabel id="nocServiceReceipt" />
                        )}
                        {router.query.trnType === "pp" && (
                          <FormattedLabel id="photoPassServiceReceipt" />
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
                          applicationDetails?.trnLoiList &&
                            (applicationDetails?.trnLoiList[0]
                              ?.paymentModeKey != 0 ||
                            applicationDetails.trnLoiList[0]?.paymentModeKey !=
                              null
                              ? (applicationDetails.trnLoiList[0]
                                  ?.paymentType != undefined
                                  ? language === "en"
                                    ? applicationDetails?.trnLoiList[0]
                                        ?.paymentType + " - "
                                    : applicationDetails?.trnLoiList[0]
                                        ?.paymentType === "Online"
                                    ? "ऑनलाइन - "
                                    : "ऑफलाइन -"
                                  : "") +
                                (language === "en"
                                  ? paymentTypes &&
                                    paymentTypes?.find(
                                      (obj) =>
                                        obj.id ===
                                        applicationDetails?.trnLoiList[0]
                                          ?.paymentModeKey
                                    )?.paymentMode
                                  : paymentTypes &&
                                    paymentTypes?.find(
                                      (obj) =>
                                        obj.id ===
                                        applicationDetails?.trnLoiList[0]
                                          ?.paymentModeKey
                                    )?.paymentModeMr)
                              : applicationDetails?.trnLoiList[0]?.paymentMode)
                        }
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {router.query.trnType === "ht" &&
                          Number(
                            applicationDetails?.trnLoiList &&
                              applicationDetails?.trnLoiList[0]?.receivedAmount
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
                      {applicationDetails?.trnLoiList ? (
                        <span>
                          {moment(
                            applicationDetails?.trnLoiList[0]
                              ?.transactionDateTime
                          ).format("DD-MM-YYYY ")}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {router.query.trnType === "ht" && (
                          <FormattedLabel id="serviceCharges" />
                        )}
                        {router.query.trnType === "loi" && (
                          <FormattedLabel id="loiPayment" />
                        )}
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {router.query.trnType === "ap" &&
                          Number(
                            applicationDetails?.trnLoiList[0]?.receivedAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.receivedAmount).toFixed(2)}
                        {/* <FormattedLabel id='twentyRs' /> */}
                      </span>
                      <br />
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {router.query.trnType === "ap" &&
                          Number(
                            applicationDetails?.trnLoiList[0]?.receivedAmount
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
                        {router.query.trnType === "ht" &&
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
                        {router.query.trnType === "ht" &&
                          Number(
                            applicationDetails?.trnLoiList &&
                              applicationDetails?.trnLoiList[0]?.receivedAmount
                          ).toFixed(2)}
                        {router.query.trnType === "loi" &&
                          Number(applicationDetails?.receivedAmount).toFixed(2)}
                      </label>
                    </td>
                    <td className={styles.tableData2}>
                      <label>
                        {router.query.trnType === "ht" &&
                          Number(
                            applicationDetails?.trnLoiList &&
                              applicationDetails?.trnLoiList[0]?.receivedAmount
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
                        {router.query.trnType === "ht" &&
                          Number(
                            applicationDetails?.trnLoiList &&
                              applicationDetails?.trnLoiList[0]?.totalAmount
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
                      {router.query.trnType === "ap" && (
                        <span>
                          ₹.{" "}
                          {toWords.convert(
                            Number(applicationDetails?.receivedAmount || 0)
                          )}{" "}
                          {language === "en" ? " Rupees Only" : " रुपये फक्त "}
                          {/* <FormattedLabel id='twentyRsWords' /> */}
                        </span>
                      )}
                      {router.query.trnType === "loi" && (
                        <span>
                          ₹.{" "}
                          {toWords.convert(
                            Number(
                              applicationDetails?.trnLoiList[0]
                                ?.receivedAmount || 0
                            )
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
                      {applicationDetails.trnLoiList ? (
                        <span>
                          {
                            // @ts-ignore
                            applicationDetails.trnLoiList[0]?.billingNotes
                          }
                        </span>
                      ) : (
                        "-"
                      )}
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
            color="primary"
            endIcon={<Print />}
            onClick={handleToPrint}
          >
            <FormattedLabel id="print" />
          </Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              // router.query.trnType == 'ht' ?
              //   router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails") :
              //   router.query.trnType == 'pp'?  router.push(
              //     "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
              //   ):
              router.push("/dashboard");
            }}
          >
            <FormattedLabel id="exit" />
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
