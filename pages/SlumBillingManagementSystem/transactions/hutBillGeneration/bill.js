import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./bill.module.css";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import { Button, Paper } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { ExitToApp, Print } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import urls from "../../../../URLS/urls";

const Index = () => {
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Hut Bill",
  });

  // @ts-ignore
  const token = useSelector((state) => state.user.user.token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [slumData, setSlumData] = useState([{ id: 1, slumName: "" }]);
  const [areaData, setAreaData] = useState([{ id: 1, areaName: "" }]);
  const [ownershipData, setOwnershipData] = useState([
    { id: 1, ownershipType: "" },
  ]);
  const [usageTypeData, setUsageTypeData] = useState([
    { id: 1, usageType: "" },
  ]);
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
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
  const headers = { Authorization: `Bearer ${user?.token}` };
  const [billData, setBillData] = useState({
    billNo: "",
    billDate: "",
    slumName: "",
    ownership: "",
    ownerName: "",
    areaName: "",
    usageType: "",
    hutNo: "",
    area: "",
    fromDate: "",
    toDate: "",
    billPreviousAmount: "",
    billCurrentAmount: "",
    balanceAmount: "",
  });

  useEffect(() => {
    //Get Area
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setAreaData(
          res.data.area.map((r, i) => ({
            id: r.id,
            areaName: r.areaName,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });

    //Get Slum
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setSlumData(
          res.data.mstSlumList.map((r, i) => ({
            id: r.id,
            slumName: r.slumName,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });

    //Get Usage Type
    axios
      .get(`${urls.SLUMURL}/mstSbUsageType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setUsageTypeData(
          res.data.mstSbUsageTypeList.map((r, i) => ({
            id: r.id,
            usageType: r.usageType,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });

    //Get Ownership Type
    axios
      .get(`${urls.SLUMURL}/mstSbOwnershipType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setOwnershipData(
          res.data.mstSbOwnershipTypeList.map((r, i) => ({
            id: r.id,
            ownershipType: r.ownershipType,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      //Get Bill Data
      axios
        .get(`${urls.SLUMURL}/trnBill/getById?id=${router.query.id}`, {
          headers: headers,
        })
        .then((res) => {
          setBillData({
            billNo: res.data.billNo ?? "--",
            billDate:
              moment(res.data.billDate).format("DD / MM / YYYY") ?? "--",
            slumName:
              slumData.find((obj) => obj.id == res.data.slumKey)?.slumName ??
              "--",
            ownership:
              ownershipData.find((obj) => obj.id == res.data.ownershipKey)
                ?.ownershipType ?? "--",
            ownerName:
              res.data.ownerFirstName +
                " " +
                res.data.ownerMiddleName +
                " " +
                res.data.ownerLastName ?? "--",
            areaName:
              areaData.find((obj) => obj.id == res.data.areaKey)?.areaName ??
              "--",
            usageType:
              usageTypeData.find((obj) => obj.id == res.data.usageTypeKey)
                ?.usageType ?? "--",
            hutNo: res.data.hutNo ?? "--",
            area: res.data.areaOfHut ?? "--",
            fromDate:
              moment(res.data.billFromDate).format("DD / MM / YYYY") ?? "--",
            toDate:
              moment(res.data.billToDate).format("DD / MM / YYYY") ?? "--",
            billPreviousAmount: res.data.previousPendingBillAmount ?? "--",
            billCurrentAmount: res.data.currentBillAmount ?? "--",
            balanceAmount: res.data.balanceAmount ?? "--",
          });
        }).catch((err)=>{
          cfcErrorCatchMethod(err, false);
        });
    }
  }, [areaData, slumData, usageTypeData, ownershipData]);

  return (
    <>
      <Head>
        <title>Hut Bill</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.wrapper} ref={componentRef}>
          <div className={styles.head}>
            <img src="/logo.png" alt="pcmc logo" height={115} />
            <div className={styles.headContent}>
              <span className={styles.heading}>पिंपरी चिंचवड महानगरपालिका</span>
              <span className={styles.heading}>
                झोपडपट्टी निर्मुलन व पुनर्वसन विभाग
              </span>
              <span className={styles.subHeading}>एकत्रित सेवा शुल्क बील</span>
              <span className={styles.subHeading}>
                महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्रक-२०४(१)झोपसु(१),
                दिनांक ११ जुलै २००१
              </span>
              <span className={styles.subHeading}>
                महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्रक-३६४(२)झोपसु(१),
                दिनांक ३ मे २००३
              </span>
            </div>
          </div>

          <table className={styles.billDetails1}>
            <tr>
              <td>
                <span>बील क्रमांक:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.billNo}</span>
              </td>
              <td>
                <span>बील दिनांक:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.billDate}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>झोपडपट्टीचे नाव:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.slumName}</span>
              </td>
              <td>
                <span>जागा मालकी:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.ownership}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>झोपडी धारकाचे नाव/ पत्ता:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.ownerName}</span>
              </td>
              <td>
                <span>विभागाचे नाव:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.areaName}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>वापर:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.usageType}</span>
              </td>
              <td>
                <span>झोपडी क्रमांक:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.hutNo}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>क्षेत्र:</span>
              </td>
              <td colSpan={3}>
                <span className={styles.dataText}>{billData.area}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>मागणी कालावधी दिनांक पासून:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.fromDate}</span>
              </td>
              <td>
                <span>ते दिनांक:</span>
              </td>
              <td>
                <span className={styles.dataText}>{billData.toDate}</span>
              </td>
            </tr>
          </table>
          <p className={styles.highlightContent}>
            पिंपरी चिंचवड महानगरपालिकेच्या हद्दीत आपल्या वर नमूद केलेल्या
            झोपडीवरील एकत्रित सेवा शुकाची खालीलप्रमाणे आपणांस मागणी करण्यात येत
            आहे. या बीलात मागणी केलेली रक्कम, हे बील आपणांस मिळाले पासून पंधरा
            दिवसाच्या आत महानगरपालिकेच्या झोपडपट्टी निर्मुलन व पुनर्वसन
            कार्यालयात रोख भरावी.
          </p>
          <table className={styles.billDetails2}>
            <tr>
              <td style={{ textAlign: "left" }}>
                <span>कराचे नाव</span>
              </td>
              <td>
                <span>मागील बाकी रक्कम रुपये</span>
              </td>
              <td>
                <span>चालु मागणी रक्कम रुपये</span>
              </td>
              <td>
                <span>एकुण मागणी रक्कम रुपये</span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "left" }}>
                <span>एकत्रित सेवा शुल्क</span>
              </td>
              <td>
                <span className={styles.dataText}>
                  {billData.billPreviousAmount}
                </span>
              </td>
              <td>
                <span className={styles.dataText}>
                  {billData.billCurrentAmount}
                </span>
              </td>
              <td>
                <span className={styles.dataText}>
                  {billData.balanceAmount}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "left" }}>
                <span>एकुण</span>
              </td>
              <td>
                <span className={styles.dataText}>
                  {billData.billPreviousAmount}
                </span>
              </td>
              <td>
                <span className={styles.dataText}>
                  {billData.billCurrentAmount}
                </span>
              </td>
              <td>
                <span className={styles.dataText}>
                  {billData.balanceAmount}
                </span>
              </td>
            </tr>
          </table>
          <div className={styles.signature}>
            <span>सक्षम प्रधीकारण संस्था सहा. आयुक्त </span>
            <span>झोपडपट्टी निर्मुलन व पुनर्वसन विभाग</span>
            <span>पिंपरी चिंचवड महानगरपालिका, पिंपरी १८</span>
          </div>
          <div className={`${styles.instructions} ${styles.highlightContent}`}>
            <span className={styles.row}>-महत्वाच्या सुचना-</span>
            <p>
              १) एकत्रित सेवा शुल्काबाबतची सविस्तर माहिती कार्यालयात पहावयास
              मिळेल. <br />
              २) रोख रक्कम झोपडपट्टी निर्मुलन व पुनर्वसन कार्यालयामध्ये भरावी व
              पावती घ्यावी. <br />
              ३) पावतीशिवाय पैसे भरले आहेत, असे ग्राह्य धरले जाणार नाही. <br />
              ४) एकत्रित सेवा शुल्काची रक्कम धरण्याची कार्यालयीन वेळ (सुट्टीचे
              दिवस सोडून) १०-०० ते दुपारी ४-०० वाजेपर्यंत <br />
              ५) रक्कम भरण्यास येताना कृपया हे बील सोबत आणावे. काही
              तक्रारअसल्यास मागील पावत्या सोबत आणाव्यात.
              <br />
              ६) सेवा आकार हा महापालिकेकडून मिळणाऱ्या सेवा, सुविधायांचे
              प्रीत्यर्थ आहे. सेवा आकार भरला म्हणजे झोपडीचा अथवा जागेचा
              अधिकृतपणा झाला असे समजले जाणार नाही.
            </p>
          </div>
          <div className={styles.row}>
            <span>
              बिलातील झोपडी क्षेत्रापेक्षा वाढीव क्षेत्र अढळून आल्यास
              त्याप्रमाणे वाढीव
            </span>
            <span>
              क्षेत्राची एकत्रित सेवा शुल्क आकारणी व वसुली करण्यात येईल.
            </span>
          </div>
          <div className={styles.footer}>
            <span>बील मिळालेबाबत</span>
            <span>स्वाक्षरी दिनांक</span>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Print />}
            onClick={handleToPrint}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              router.push(
                "/SlumBillingManagementSystem/transactions/hutBillGeneration/billsGenerated"
              );
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
