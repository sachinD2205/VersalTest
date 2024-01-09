import { Box, Button, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../goshwara.module.css";
import axios from "axios";
import urls from "../../../../../../URLS/urls";
import { useSelector } from "react-redux";
import moment from "moment";
import { useRouter } from "next/router";
import { ToWords } from "to-words";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../../util/commonErrorUtil";

const Index = ({
  commonObject,
  selectedData,
  setSelectionModel,
  handleClose,
  setData,
  getCreatedBillDataSearch,
  handleResetValues,
}) => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  const router = useRouter();

  const toWords = new ToWords({ localeCode: "mr-IN" });

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

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  const [dataSource, setDataSource] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState();
  const [totalBilledUnit, setTotalBilledUnit] = useState();
  const [totalConsumedUnit, setTotalConsumedUnit] = useState();
  const [zoneName, setZoneName] = useState();
  const [subDivisionName, setSubDivisionName] = useState();

  useEffect(() => {
    getCreatedBillData();
  }, [commonObject]);

  useEffect(() => {
    let result =
      selectedData &&
      selectedData.map((i) => {
        let res =
          dataSource &&
          dataSource.find((j) => {
            return i == j.id;
          });
        return res;
      });

    setTableData(result);
  }, [dataSource]);

  useEffect(() => {
    let sumOfAmountToBePaid = 0;
    let sumOfBilledUnit = 0;
    let sumOfConsumedUnit = 0;

    tableData &&
      tableData.map((each) => {
        sumOfAmountToBePaid = sumOfAmountToBePaid + each?.amountToBePaid;
        sumOfBilledUnit = sumOfBilledUnit + each?.billedAmount;
        sumOfConsumedUnit = sumOfConsumedUnit + each?.consumedUnit;
      });
    setTotalAmountToBePaid(sumOfAmountToBePaid);
    setTotalBilledUnit(sumOfBilledUnit);
    setTotalConsumedUnit(sumOfConsumedUnit);
    getZone();
    getSubDivision();
  }, [tableData]);

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  // get Zone Name
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.zone;
        let _res = temp.find((each) => each.id == tableData[0]?.zoneKey);
        setZoneName(_res?.zoneNameMr);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.mstSubDivisionList;
        let _res = temp.find((each) => each.id == tableData[0]?.subDivisionKey);
        setSubDivisionName(_res?.subDivisionMr);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleApprovalBill = async (id) => {
    let temp = await axios
      .get(`${urls.EBPSURL}/trnBillGenerate/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });

    let generatedBills = [temp];

    let result =
      generatedBills &&
      generatedBills.map((each) => {
        return {
          ...each,
          isApproved: true,
          isComplete: null,
          isSentToMsecdl: null,
          tippaniGenrated: true,
          dakhalaGenerated: true,
          adeshGenerated: true,
          tippaniRejected: false,
        };
      });

    let _data = {
      trnBillGenerateDao: result,
    };

    const tempData = axios
      .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          let string = res?.data?.message;
          let string1 = string.split("[")[1];
          let string2 = string1.split("]")[0];
          sweetAlert(
            language == "en" ? "Send!" : "पाठवले!",
            language == "en"
              ? `Bill ${string2} Approved and send to Pay bills successfully !`
              : `बिल ${string2} मंजूर आणि यशस्वीरित्या बिले पे करण्यासाठी पाठवले!`,
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
          getCreatedBillData();
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // Get Table - Data
  const getCreatedBillData = () => {
    axios
      .get(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setDataSource(r.data.trnMeterReadingAndBillGenerateList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  //
  const onSubmitForm = () => {
    let consumerNumber = [];
    tableData &&
      tableData.map((each) => {
        if (each?.consumerNo != undefined) {
          consumerNumber.push(each?.consumerNo);
        }
      });
    let _data = {
      id: null,
      activeFlag: "Y",
      consumerNo: consumerNumber?.join(","),
      amountToBePaid: totalAmountToBePaid,
      status: null,
      consumedUnit: totalConsumedUnit,
      billedAmount: totalBilledUnit,
      trnMeterReadingAndBillGenerateDaoList: tableData,
      zoneKey: tableData[0]?.zoneKey,
      isApproved: true,
      isComplete: null,
      isSentToMsecdl: null,
      tippaniGenrated: true,
      dakhalaGenerated: true,
      adeshGenerated: true,
      tippaniRejected: false,
    };

    const tempData = axios
      .post(`${urls.EBPSURL}/trnBillGenerate/bulk/generate`, _data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          let string = res?.data?.message;
          let string1 = string.split("[")[1];
          let string2 = string1.split("]")[0];

          // authority && authority.find((val) => val === "JUNIOR_ENGINEER") ?
          // handleApprovalBill(string2)
          // :""
          sweetAlert(
            language == "en" ? "Send!" : "पाठवले!",
            language == "en"
              ? `Bill ${string2} Approved and send to Pay bills successfully !`
              : `बिल ${string2} मंजूर आणि यशस्वीरित्या बिले पे करण्यासाठी पाठवले!`,
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
          getCreatedBillData();
          handleClose();
          router.push(
            "/ElectricBillingPayment/transaction/billGeneration/billGenerationDetails"
          );
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  return (
    <div>
      {/* ---------- Tipani ------------- */}

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="tipani" />
        </h2>
      </Box>

      <Grid container>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका </b>
                    </h5>
                    <h5>
                      {" "}
                      <b>मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</b>
                    </h5>
                    <h5>
                      <b> महाराष्ट्र, भारत</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फोन क्रमांक:91-020-2742-5511/12/13/14</b>
                    </h5>
                    <h5>
                      <b> इमेल: egov@pcmcindia.gov.in</b>
                    </h5>
                    <h5>
                      <b>/ sarathi@pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div>
              </div>
              <div className={styles.logo1}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                {/* <b>पावती</b> */}
                <h5>
                  {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/********** LETTER HEADER **************/}

              <div className={styles.date7}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>कार्यालयीन टिपणी</b>
                    </h4>
                  </div>
                </div>

                <div className={styles.date8}>
                  <div className={styles.add7} style={{ marginBottom: "2vh" }}>
                    <h4 style={{ marginRight: "40px" }}>
                      <b>दिनांक :</b>
                      <b>{`  ${day}/${month}/${year}`}</b>
                    </h4>
                  </div>
                </div>
              </div>

              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6}>
                  <h4>
                    {" "}
                    <b>विषय : </b>{" "}
                    {`${zoneName ? zoneName : ""} कार्यक्षेत्रातील  ${
                      subDivisionName ? subDivisionName : ""
                    } उपविभागातील `}{" "}
                    इमारत, शाळा व कार्यालये वीजमीटरचे वीजबील म.रा.वि.वि.क.ली.
                    यांना अदा करणेबाबत.
                    {/* {`(माहे: ${tableData?.length > 0 && tableData[0]?.monthAndYear ? moment( tableData[0]?.monthAndYear).format("YYYY-MMM")  : "" })`} */}
                  </h4>{" "}
                </div>
              </div>

              {/*********** LETTER TO ****************/}

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "80px" }}>
                    {" "}
                    <b>मा. सविनय सादर, </b>
                  </h4>{" "}
                </div>
              </div>

              {/*********** LETTER BODY ****************/}

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    {"  "}
                    {`${zoneName ? zoneName : ""} कार्यक्षेत्रातील  ${
                      subDivisionName ? subDivisionName : ""
                    } उपविभागातील `}{" "}
                    वीजमीटरचे वीजबील या कार्यालयास प्राप्त झाले असून सदर बीलाची
                    तांत्रीक तपासणी केली असता मीटर ग्राहक क्रमांक व देय रक्कम
                    म.रा. वि.वि.के.सी. वे नियमाप्रमाणे योग्य आहेत. प्राप्त
                    बीलाचा तपशित खालीलप्रमाणे.
                  </p>{" "}
                </div>
              </div>

              {/*********** LETTER TABLE ****************/}

              <div className={styles.table} style={{ marginBottom: "2vh" }}>
                <table>
                  <tr>
                    <th style={{ width: "5%" }}>अ.क्र.</th>
                    <th style={{ width: "10%" }}>विजमिटरचे ठिकाण</th>
                    <th style={{ width: "10%" }}>ग्राहक क्रमांक</th>
                    <th style={{ width: "10%" }}>VAN क्रमांक</th>
                    <th style={{ width: "10%" }}>खपत युनिट</th>
                    <th style={{ width: "10%" }}>माहे</th>
                    <th style={{ width: "13%" }}>मीटर क्रमांक</th>
                    <th style={{ width: "15%" }}>देय रक्कम</th>
                  </tr>
                  {tableData &&
                    tableData.map((obj, i) => (
                      <tr key={i}>
                        <td style={{ width: "5%" }}>{i + 1}</td>
                        <td style={{ width: "10%" }}>
                          {obj?.newConnectionEntryDao?.consumerAddressMr}
                        </td>
                        <td style={{ width: "10%" }}>{obj?.consumerNo}</td>
                        <td style={{ width: "10%" }}>
                          {obj?.newConnectionEntryDao?.vanNo}
                        </td>
                        <td style={{ width: "10%" }}>{obj?.consumedUnit}</td>
                        <td style={{ width: "10%" }}>
                          {moment(obj?.monthAndYear).format("YYYY-MMM")}
                        </td>
                        <td style={{ width: "13%" }}>
                          {obj?.newConnectionEntryDao?.meterNo}
                        </td>
                        <td style={{ width: "15%", textAlign: "end" }}>
                          {obj?.amountToBePaid?.toString().includes(".")
                            ? obj?.amountToBePaid
                            : `${obj?.amountToBePaid}.00`}
                        </td>
                      </tr>
                    ))}

                  <tr>
                    <td style={{ width: "5%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "13%" }}>
                      <b>एकूण रक्कम रुपये</b>
                    </td>
                    <td style={{ width: "15%", textAlign: "end" }}>
                      <b>
                        {totalAmountToBePaid?.toString().includes(".")
                          ? totalAmountToBePaid
                          : `${totalAmountToBePaid}.00`}
                      </b>
                    </td>
                  </tr>
                </table>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    {" "}
                    येथील वीजमीटरचे वीजबील म.रा. वि.वि.के.सी. यांना अदा
                    करणेबाबत.
                  </p>{" "}
                </div>
              </div>

              <div className={styles.date5}>
                <div>
                  <h4 style={{ marginLeft: "80px" }}>
                    <b>रक्कम रुपये :</b>
                    {"  "}
                    {totalAmountToBePaid ? totalAmountToBePaid : "0"}
                  </h4>
                </div>

                {/* <div>
                  <h4 style={{ marginLeft: "80px" }}>
                    <b>इतकी तरतुद सन :</b>
                     {connectionData} 
                  </h4>
                </div> */}
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    {" "}
                    अंदाजपत्रकात केलेली आहे.व रक्कम रु.{" "}
                    <b>{totalAmountToBePaid ? totalAmountToBePaid : "0"}</b>
                    {"  "}
                    इतकी तरतुद शिल्लक आहे. उपरोक् ठिकाणांचा विजपुरवठा म.रा. वि.
                    वि. के.सी. कडून खंडीत केला जाऊ नये यासाठी प्राप्त बील अदा
                    करणे आवश्यक आहे. तथापि, सदर बील अदा करणेसाठी मंजुरी असल्यास
                    सोबतच्या आदेशावर स्वाक्षरी होणे.
                  </p>{" "}
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}> सविनय सादर,</p>
                </div>
              </div>

              <Grid container>
                {/* First Column */}

                <Grid
                  item
                  xl={3}
                  lg={2}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    // alignItems: "center",
                  }}
                  className={styles.date4}
                >
                  <div className={styles.date2}>
                    <p style={{ marginLeft: "80px" }}>
                      <b>कनिष्ठ अभियंता (वि)</b>
                    </p>
                  </div>
                </Grid>

                <Grid
                  item
                  xl={2}
                  lg={2}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    // alignItems: "center",
                    marginTop: "100px",
                  }}
                  className={styles.date4}
                >
                  {/* <div className={styles.date4} style={{ marginBottom: "2vh", marginLeft: "30vh" }}> */}
                  <div className={styles.date2}>
                    <p>
                      <b>उपअभियंता (वि)</b>
                    </p>
                  </div>
                </Grid>

                <Grid
                  item
                  xl={2}
                  lg={2}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    // alignItems: "center",
                    marginTop: "200px",
                  }}
                  className={styles.date4}
                >
                  {/* <div className={styles.date4} style={{ marginBottom: "2vh", marginLeft: "60vh" }}> */}
                  <div className={styles.date2}>
                    <p>
                      <b>लेखापाल</b>
                    </p>
                  </div>
                </Grid>

                <Grid
                  item
                  xl={2}
                  lg={2}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    // alignItems: "center",
                    marginTop: "300px",
                  }}
                  className={styles.date4}
                >
                  {/* <div className={styles.date4} style={{ marginBottom: "2vh", marginLeft: "80vh" }}> */}
                  <div className={styles.date2}>
                    <p>
                      <b>मा.लेखाधिकारी</b>
                    </p>
                  </div>
                </Grid>

                <Grid
                  item
                  xl={2}
                  lg={2}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    // alignItems: "center",
                    marginTop: "400px",
                    marginBottom: "20px",
                  }}
                  className={styles.date4}
                >
                  {/* <div className={styles.date4} style={{ marginBottom: "2vh", marginLeft: "100vh" }}> */}
                  <div className={styles.date2}>
                    <p>
                      <b>कार्यकारी अभियंता (वि)</b>
                    </p>
                  </div>
                </Grid>
              </Grid>

              {/*********** LETTER SIGNATURE ****************/}

              {/* <div className={styles.date7} style={{ marginBottom: "2vh" }}>
                <div className={styles.date8}>
                  <div className={styles.add7}>
                    <h5>
                      <b>सही/-</b>
                    </h5>
                    <h5>सहाय्यक आयुक्त</h5>
                    <h5>माहिती व जनसंपर्क विभाग</h5>
                    <h5>पिंपरी चिंचवड महानगरपालिका</h5>
                    <h5>पिंपरी ४११ ०१८</h5>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </Grid>

      {/* ------------- Dakhala --------------- */}

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          marginTop: "13px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="dakhala" />
        </h2>
      </Box>

      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका </b>
                    </h5>
                    <h5>
                      {" "}
                      <b>मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</b>
                    </h5>
                    <h5>
                      <b> महाराष्ट्र, भारत</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फोन क्रमांक:91-020-2742-5511/12/13/14</b>
                    </h5>
                    <h5>
                      <b> इमेल: egov@pcmcindia.gov.in</b>
                    </h5>
                    <h5>
                      <b>/ sarathi@pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div>
              </div>
              <div className={styles.logo1}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                {/* <b>पावती</b> */}
                <h5>
                  {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6}>
                  <h4
                    style={{
                      marginTop: "40px",
                      marginBottom: "40px",
                    }}
                  >
                    {" "}
                    <b>विषय : </b>{" "}
                    {`${zoneName ? zoneName : ""} कार्यक्षेत्रातील  ${
                      subDivisionName ? subDivisionName : ""
                    } विद्युत उपविभागातील `}{" "}
                    इमारत, शाळा व कार्यालये येथील वीजमीटरचे वीजबील
                    म.रा.वि.वि.क.ली. यांना अदा करणेबाबत.
                  </h4>{" "}
                </div>
              </div>

              {/*********** LETTER TABLE ****************/}

              <div className={styles.table} style={{ marginBottom: "2vh" }}>
                <table>
                  <tr>
                    <th style={{ width: "5%" }}>अ.क्र.</th>
                    <th style={{ width: "10%" }}>ग्राहक क्रमांक</th>
                    <th style={{ width: "10%" }}>ग्राहकाचे नाव</th>
                    <th style={{ width: "10%" }}>VAN क्रमांक</th>
                    <th style={{ width: "10%" }}>खपत युनिट</th>
                    <th style={{ width: "10%" }}>माहे</th>
                    <th style={{ width: "13%" }}>मीटर क्रमांक</th>
                    <th style={{ width: "15%" }}>रक्कम रुपये</th>
                  </tr>
                  {tableData &&
                    tableData.map((obj, i) => (
                      <tr key={i}>
                        <td style={{ width: "5%" }}>{i + 1}</td>
                        <td style={{ width: "10%" }}>{obj?.consumerNo}</td>
                        <td style={{ width: "10%" }}>
                          {obj?.newConnectionEntryDao?.consumerNameMr}
                        </td>
                        <td style={{ width: "10%" }}>
                          {obj?.newConnectionEntryDao?.vanNo}
                        </td>
                        <td style={{ width: "10%" }}>{obj?.consumedUnit}</td>
                        <td style={{ width: "10%" }}>
                          {moment(obj?.monthAndYear).format("YYYY-MMM")}
                        </td>
                        <td style={{ width: "13%" }}>
                          {obj?.newConnectionEntryDao?.meterNo}
                        </td>
                        <td style={{ width: "15%", textAlign: "end" }}>
                          {obj?.amountToBePaid?.toString().includes(".")
                            ? obj?.amountToBePaid
                            : `${obj?.amountToBePaid}.00`}
                        </td>
                      </tr>
                    ))}

                  <tr>
                    <td style={{ width: "5%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "13%" }}>
                      <b>एकूण रक्कम रुपये</b>
                    </td>
                    <td style={{ width: "15%", textAlign: "end" }}>
                      <b>
                        {totalAmountToBePaid?.toString().includes(".")
                          ? totalAmountToBePaid
                          : `${totalAmountToBePaid}.00`}
                      </b>
                    </td>
                  </tr>
                </table>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "80px" }}>
                    <b>दिनांक :</b>
                    <b>{`  ${day}/${month}/${year}`}</b>
                  </h4>
                </div>
              </div>

              <div className={styles.date5}>
                <div>
                  <h4 style={{ marginLeft: "80px" }}>
                    <b>दाखला :-</b>
                    {"  "}
                  </h4>
                </div>

                <div>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    <b>(1)</b> सदरचे बिल यापुर्वी अदा केलेले नाही
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    <b>(2)</b> सदरचे बिल म.रा.वि.वि.क.ली. मंडळाच्या नियमानुसार
                    योग्य आहे
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    <b>(3)</b> सदरच्या बिलाची नोंद बिल रजिस्टर मध्ये घेन्यात आली
                    आहे
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    <b>(4)</b> प्रदानार्थ मंजूर रक्कम रु.{" "}
                    <b>{totalAmountToBePaid ? totalAmountToBePaid : "0"}</b>
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    <b>(5)</b> अक्षरी रक्कम रु.{" "}
                    <b>
                      {toWords.convert(
                        totalAmountToBePaid ? totalAmountToBePaid : "0"
                      )}
                    </b>{" "}
                    फक्त
                  </p>
                </div>
              </div>

              <div className={styles.btn} style={{ marginTop: "80px" }}>
                <div>
                  <p style={{ marginLeft: "80px" }}> कनिष्ठ अभियंता (वि)</p>
                  <p style={{ marginLeft: "80px" }}>
                    <b>विद्युत विभाग</b>
                  </p>
                </div>

                <div>
                  <p style={{ marginLeft: "80px" }}> उप-अभियंता (वि)</p>
                  <p style={{ marginLeft: "80px" }}>
                    <b>विद्युत विभाग</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>

      {/* --------------- Adesh ------------------- */}

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          marginTop: "13px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="adesh" />
        </h2>
      </Box>

      <Grid
        container
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका </b>
                    </h5>
                    <h5>
                      {" "}
                      <b>मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</b>
                    </h5>
                    <h5>
                      <b> महाराष्ट्र, भारत</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फोन क्रमांक:91-020-2742-5511/12/13/14</b>
                    </h5>
                    <h5>
                      <b> इमेल: egov@pcmcindia.gov.in</b>
                    </h5>
                    <h5>
                      <b>/ sarathi@pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div>

                {/* <div className={styles.foot}>
           
           
            
          </div> */}
                {/* <h4>
              {' '}
              <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
            </h4> */}

                {/* <h4>
              {' '}
              <b>महाराष्ट्र, भारत</b>
            </h4> */}
              </div>
              <div className={styles.logo1}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                {/* <b>पावती</b> */}
                <h5>
                  {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div >
              <h4>
                {' '}
                <b>दिनांक :</b>
              </h4>{' '}
              <h4 style={{ marginLeft: '10px' }}>
                <b>{this?.props?.dataa?.payment?.receiptDate}</b>
              </h4>
            </div>

            <div >
              <h4>
                {' '}
                <b>वेळ :</b>
              </h4>{' '}
              <h4 style={{ marginLeft: '10px' }}>
                {this?.props?.dataa?.payment?.receiptTime}
              </h4>
            </div>
          </div>
          <div className={styles.date2}>
            <h4 style={{ marginLeft: '40px' }}>
              {' '}
              <b>पावती क्रमांक :</b>
            </h4>{' '}
            <h4 style={{ marginLeft: '10px' }}>
              <b>{this?.props?.dataa?.payment?.receiptNo}</b>
            </h4>
          </div> */}

              {/********** LETTER HEADER **************/}

              <div className={styles.date7}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>
                        १) मा.कार्यकारी अभियंता (वि), विदयुत यांचेकडील दिनांक{" "}
                        {`  ${day}/${month}/${year}`} रोजीची मंजुर टिपणी.
                      </b>
                    </h4>
                  </div>
                </div>
              </div>

              <div className={styles.date7}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>
                        २) म.रा.वि.वि.कंपनी लि. यांचेकडील प्राप्त बील माहे :{" "}
                        {tableData[0]?.monthAndYear
                          ? moment(tableData[0]?.monthAndYear).format(
                              "MMM-YYYY"
                            )
                          : ""}
                      </b>
                    </h4>
                  </div>
                </div>
              </div>

              <div className={styles.date7}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>
                        ३) मा.आयुक्त यांचेकडील अधिकार प्रदान आदेश क्र.
                        लेखा/कावि/४१४/२०१८/, दि {"23/04/2018"}
                      </b>
                    </h4>
                  </div>
                </div>
              </div>

              <hr
                style={{
                  height: "2px",
                  backgroundColor: "#000",
                  marginLeft: "70px",
                  marginRight: "70px",
                }}
              />

              <div
                className={styles.date7}
                style={{ marginBottom: "2vh", marginTop: "2vh" }}
              >
                <div className={styles.date8}>
                  <div className={styles.add7}>
                    <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका</b>
                    </h5>
                    <h5>पिंपरी - १८</h5>
                    <h5>क्र.: /वि/जा/</h5>
                    <h5>
                      {" "}
                      दिनांक:- <b>{`  ${day}/${month}/${year}`}</b>
                    </h5>
                  </div>
                </div>
              </div>

              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6}>
                  <h4>
                    {" "}
                    <b>विषय : </b>{" "}
                    {`${zoneName ? zoneName : ""} कार्यक्षेत्रातील  ${
                      subDivisionName ? subDivisionName : ""
                    } विद्युत उपविभागातील `}{" "}
                    इमारत, शाळा व कार्यालये येथील वीजमीटरचे वीजबील
                    म.रा.वि.वि.क.ली. यांना अदा करणेबाबत.
                  </h4>{" "}
                </div>
              </div>

              {/*********** LETTER TO ****************/}

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "80px" }}>
                    {" "}
                    <b>आदेश, </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {/* {' ' +
                                            moment(
                                                this?.props?.selectedObject?.createDtTm,
                                                'YYYY-MM-DD',
                                            ).format('DD-MM-YYYY')} */}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              {/*********** LETTER BODY ****************/}

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "40px" }}>
                    {"  "}
                    {`${zoneName ? zoneName : ""} कार्यक्षेत्रातील  ${
                      subDivisionName ? subDivisionName : ""
                    } विद्युत उपविभागातील `}{" "}
                    इमारत, शाळा व कार्यालये येथील वीजमीटरचे वीजबील या कार्यालयास
                    प्राप्त झाले असुन, सदर बिलांची तांत्रीक तपासणी केली असता
                    मीटर ग्राहक क्रमांक व देय रक्कम म.रा.वि.वि.कं.लि. चे
                    नियमाप्रमाणे योग्य आहेत. प्राप्त बिलांचा तपशिल खालीलप्रमाणे.
                  </p>{" "}
                </div>
              </div>

              {/*********** LETTER TABLE ****************/}

              <div className={styles.table} style={{ marginBottom: "2vh" }}>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th style={{ width: "5%" }}>अ.क्र.</th>
                    <th style={{ width: "10%" }}>विजमिटरचे ठिकाण</th>
                    <th style={{ width: "10%" }}>ग्राहक क्रमांक</th>
                    <th style={{ width: "10%" }}>VAN क्रमांक</th>
                    <th style={{ width: "10%" }}>खपत युनिट</th>
                    <th style={{ width: "10%" }}>माहे</th>
                    <th style={{ width: "13%" }}>मीटर क्रमांक</th>
                    <th style={{ width: "15%" }}>निव्वळ देय रक्कम</th>
                  </tr>
                  {tableData &&
                    tableData.map((each, i) => (
                      <tr key={i}>
                        <td style={{ width: "5%" }}>{i + 1}</td>
                        <td style={{ width: "10%" }}>
                          {each?.newConnectionEntryDao?.consumerAddressMr}
                        </td>
                        <td style={{ width: "10%" }}>{each?.consumerNo}</td>
                        <td style={{ width: "10%" }}>
                          {each?.newConnectionEntryDao?.vanNo}
                        </td>
                        <td style={{ width: "10%" }}>{each?.consumedUnit}</td>
                        <td style={{ width: "10%" }}>
                          {moment(each?.monthAndYear).format("YYYY-MMM")}
                        </td>
                        <td style={{ width: "13%" }}>
                          {each?.newConnectionEntryDao?.meterNo}
                        </td>
                        <td style={{ width: "15%", textAlign: "end" }}>
                          {each?.amountToBePaid?.toString().includes(".")
                            ? each?.amountToBePaid
                            : `${each?.amountToBePaid}.00`}
                        </td>
                      </tr>
                    ))}

                  <tr>
                    <td style={{ width: "5%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "10%" }}> </td>
                    <td style={{ width: "13%" }}>
                      <b>एकूण रक्कम रुपये</b>
                    </td>
                    <td style={{ width: "15%", textAlign: "end" }}>
                      <b>
                        {totalAmountToBePaid?.toString().includes(".")
                          ? totalAmountToBePaid
                          : `${totalAmountToBePaid}.00`}
                      </b>
                    </td>
                  </tr>
                </table>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    उपरोक्त ठिकाणी म.न.पा. तर्फे विजवापर होत असलेले सदरचे बिल
                    म.रा.वि.वि.क. लि.स अदा करणे आवश्यक आहे.
                  </p>{" "}
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    {" "}
                    सबब, मी, कार्यकारी अभियंता (वि), विदयुत, पिंपरी चिंचवड
                    महानगरपालिका, या आदेशान्वये म.रा.वि.वि.कं.लि.स रक्कम रुपये{" "}
                    <b>
                      {totalAmountToBePaid?.toString().includes(".")
                        ? totalAmountToBePaid
                        : `${totalAmountToBePaid}.00`}
                    </b>{" "}
                    अक्षरी रक्कम रुपये{" "}
                    <b>
                      {toWords.convert(
                        totalAmountToBePaid ? totalAmountToBePaid : "0"
                      )}
                    </b>{" "}
                    रुपये फक्त म.रा.वि.वि.कं.लि.स अदा करण्यास या आदेशान्वये
                    मान्यता देण्यात येत आहे.
                  </p>{" "}
                </div>
              </div>

              {/*********** LETTER SIGNATURE ****************/}

              <div className={styles.date7} style={{ marginTop: "40px" }}>
                <div className={styles.date8}>
                  <div className={styles.add7}>
                    <h5>
                      <b>कार्यकारी अभियंता (वि)</b>
                    </h5>
                    <h5>
                      {" "}
                      <b>पिंपरी चिंचवड महानगरपलिका</b>
                    </h5>
                  </div>
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    <b>प्रत-</b>
                  </p>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    <b> १. लेखा विभाग</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>

      {/* --------------- Buttons --------------- */}

      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <Grid
          item
          xl={6}
          lg={6}
          md={6}
          sm={6}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button variant="contained" size="small" onClick={onSubmitForm}>
            <FormattedLabel id="signAndForward" />
          </Button>
        </Grid>

        <Grid
          item
          xl={6}
          lg={6}
          md={6}
          sm={6}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              handleClose();
            }}
          >
            <FormattedLabel id="back" />
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Index;
