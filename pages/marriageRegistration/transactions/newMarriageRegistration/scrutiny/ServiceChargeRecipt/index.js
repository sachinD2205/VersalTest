import { Button, Paper } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import axios from "axios";
import router from "next/router";
import styles from "./goshwara.module.css";
// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
import moment from "moment";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../../../URLS/urls";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../../../util/util";

const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const language = useSelector((state) => state?.labels.language);
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
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
  let user = useSelector((state) => state.user.user);
  useEffect(() => {
    axios
      .get(
        `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router?.query?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setDataa(res.data);
        console.log("board data", res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  // view
  return (
    <>
      <div>
        <ComponentToPrint dataa={dataa} ref={componentRef} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            const textAlert =
              language == "en"
                ? "Are you sure you want to exit this Record ? "
                : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
            const title = language == "en" ? "Exit ! " : "बाहेर पडा!";

            sweetAlert({
              title: title,
              text: textAlert,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                language == "en"
                  ? sweetAlert({
                      title: "Exit!",
                      text: "Record is Successfully Exit!!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "बाहेर पडा!",
                      text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                      icon: "success",
                      button: "Ok",
                    });
                // swal("Record is Successfully Exit!", {
                //   icon: "success",
                // });
                localStorage.loggedInUser == "departmentUser"
                  ? router.push(
                      "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
                    )
                  : router.push("/dashboard");
              } else {
                language == "en"
                  ? sweetAlert({
                      title: "Cancel!",
                      text: "Record is Successfully Cancel!!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "रद्द केले!",
                      text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                      icon: "success",
                      button: "ओके",
                    });
              }
            });
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
      </div>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <Paper
          elevation={0}
          sx={{
            paddingRight: "10px",
            // marginTop: "50px",
            paddingLeft: "10px",
            // paddingBottom: "50px",
            // height: "1000px",
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
                <div
                  className={styles.middle}
                  styles={{ paddingTop: "15vh", marginTop: "20vh" }}
                >
                  <h1>
                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                  </h1>
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
                  <b>पावती</b>
                  <h5>
                    (महाराष्ट्र विवाह मंडळाचे अधिनियम विवाह नोदणी अधिनियम १९९८)
                  </h5>
                </h2>
              </div>

              <div className={styles.two}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "41px" }}>
                      <b>पावती क्रमांक :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.payment?.receiptNo}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "5vh" }}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>पावती दिनांक :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.dataa?.payment?.createDtTm,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>{" "}
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.dataa?.payment?.receiptTime,
                            "HH:mm:ss",
                          ).format("hh:mm A")}
                      </b>{" "}
                    </h4>
                  </div>
                </div>
                <div
                  className={styles.date4}
                  style={
                    {
                      // marginTop: "2vh"
                    }
                  }
                >
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>अर्जाचा क्रमांक :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.applicationNumber}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "5vh" }}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>अर्ज दिनांक : </b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.dataa?.applicationDate,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>{" "}
                      {/* {this?.props?.dataa?.applicationDate} */}
                    </h4>
                  </div>
                </div>
                <div className={styles.date4} style={{}}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "40px" }}>
                      {"  "}
                      <b> एल.ओ.आय.क्र :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.loi?.loiNo}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "5vh" }}>
                    <h4 style={{ marginLeft: "40px" }}>
                      {" "}
                      <b>एल.ओ.आय.क्र दिनांक :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.loi?.createDtTm,
                          "YYYY-MM-DD HH:mm:ss A",
                        ).format("DD-MM-YYYY hh:mm A")}
                    </h4>
                  </div>
                </div>

                {/* <div className={styles.date4} style={{ marginBottom: "" }}>
                  <div className={styles.date2}>
                    <h4 style={{ marginLeft: "40px" }}>
                      {" "}
                      <b>अर्ज दिनांक : </b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.dataa?.applicationDate,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>{" "}
                    
                    </h4>
                  </div>
                </div> */}

                <div className={styles.date4} style={{ marginBottom: "" }}>
                  <div className={styles.date2}>
                    <h4 style={{ marginLeft: "40px" }}>
                      {" "}
                      <b>अर्जदाराचे नाव : </b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      <b>
                        {" " +
                          this?.props?.dataa?.afNameMr +
                          " " +
                          this?.props?.dataa?.amNameMr +
                          " " +
                          this?.props?.dataa?.alNameMr}
                      </b>
                    </h4>
                  </div>
                </div>

                {/* <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>पैसे भरण्याचा प्रकार :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.payment?.paymentType}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "5vh" }}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>पैसे भरण्याची पध्दत :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      <b> {this?.props?.dataa?.payment?.paymentMode}</b>{" "}
                    </h4>
                  </div>
                </div> */}

                <p>
                  <h5 style={{ marginLeft: "40px", marginRight: "40px" }}>
                    <b>
                      पुढील प्रमाणे फी मिळाली :-
                      <br />
                      {/* <table id="table-to-xls" className={styles.report_table}>
                        <thead>
                          <tr>
                            <th colSpan={2}>अ.क्र</th>
                            <th colSpan={8}>शुल्काचे नाव</th>
                            <th colSpan={2}>रक्कम (रु)</th>
                          </tr>
                          <tr>
                            <td colSpan={4}>1)</td>
                            <td colSpan={4}>{this?.props?.dataa?.serviceNameMr}</td>
                            <td colSpan={4}>{this?.props?.dataa?.payment?.amount}</td>
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
                              <b>एकूण रक्कम : {this?.props?.dataa?.payment?.amount}</b>
                            </td>
                          </tr>
                        </tbody>
                      </table> */}
                      <table className={styles.report_table}>
                        <thead>
                          <tr>
                            <th colSpan={2}>अ.क्र</th>
                            <th colSpan={8}>शुल्काचे नाव</th>
                            <th colSpan={2}>रक्कम रुपये :</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this?.props?.dataa?.serviceCharges.map((row, i) => (
                            <tr key={row.id}>
                              <td colSpan={4}>{i + 1}</td>
                              <td colSpan={4}>
                                {row.serviceChargesId == 5
                                  ? row.chargeNameMr +
                                    "(" +
                                    row.rate +
                                    ")" +
                                    " X " +
                                    this?.props?.dataa?.loi?.noOfCopies +
                                    " (प्रति)"
                                  : row.chargeNameMr}
                              </td>
                              <td colSpan={4}>
                                {row.serviceChargesId == 5
                                  ? row.rate *
                                    this?.props?.dataa?.loi?.noOfCopies
                                  : row.rate}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={4}>
                              <b></b>
                            </td>
                            <td colSpan={4}>
                              <b> एकूण रक्कम रुपये : </b>
                            </td>
                            <td colSpan={4}>
                              <b>{this?.props?.dataa?.loi?.amount} </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </b>
                  </h5>
                </p>

                <hr />

                <div className={styles.foot}>
                  <div className={styles.add}>
                    <h5>पिंपरी चिंचवड महानगरपालिका </h5>
                    <h5>
                      {" "}
                      {this?.props?.dataa?.zone?.zoneNameMr}
                      {","} {this?.props?.dataa?.zone?.zoneaddressMr}
                    </h5>
                    {/* <h5> महाराष्ट्र, भारत</h5> */}
                  </div>
                  <div className={styles.add1}>
                    <h5>कृपया संबंधित क्षेत्रीय कार्यालयाशी संपर्क साधावा</h5>
                    {/* <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5> */}
                    {/* <h5>
                    इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5> */}
                  </div>
                  <div
                    className={styles.logo1}
                    style={{ paddingRight: "5vh", paddingLeft: "5vh" }}
                  >
                    <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                  </div>
                  <div className={styles.logoBar}>
                    <img
                      src="/barcode.png"
                      alt=""
                      height="50vh"
                      width="100vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </>
    );
  }
}

export default Index;
