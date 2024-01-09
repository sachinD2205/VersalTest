import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import sweetAlert from "sweetalert";
import urls from "../../../../../../URLS/urls";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./goshwara.module.css";
import { catchExceptionHandlingMethod } from "../../../../../../util/util";

const Index = () => {
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
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const language = useSelector((state) => state?.labels.language);

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  let user = useSelector((state) => state.user.user);
  const [dataa, setDataa] = useState();
  useEffect(() => {
    console.log("router.query", router.query);
    if (router?.query?.id) {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((r) => {
          console.log("r.data", r.data);
          setDataa(r.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router?.query?.applicationId) {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${router?.query?.applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((r) => {
          console.log("r.data", r.data);
          setDataa(r.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [router?.query]);
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
                localStorage.loggedInUser == "departmentUser"
                  ? router.push(
                      "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny",
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
              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
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
                        ).format("HH:mm")}
                    </b>{" "}
                  </h4>
                </div>
              </div>
              <div
                className={styles.date4}
                style={{ marginTop: "", marginLeft: "6vh" }}
              >
                <div className={styles.date3}>
                  <h4 style={{ marginRight: "" }}>
                    {" "}
                    <b>एल.ओ.आय क्र :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.dataa?.loi?.loiNo}
                  </h4>
                </div>
                <div className={styles.date3} style={{ marginRight: "5vh" }}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b> एल.ओ.आय दिनांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" "}
                    {" " +
                      moment(
                        this?.props?.dataa?.loi?.createDtTm,
                        "YYYY-MM-DD HH:mm:ss A",
                      ).format("DD-MM-YYYY HH:mm")}
                  </h4>
                </div>
              </div>
              <div className={styles.date4} style={{ marginTop: "" }}>
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

              {/* <div className={styles.date4}>
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
                    {" " +
                      this?.props?.dataa?.afNameMr +
                      " " +
                      this?.props?.dataa?.amNameMr +
                      " " +
                      this?.props?.dataa?.alNameMr}
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
                    पुढीलप्रमाणे फी मिळाली :-
                    <br />
                    <table id="table-to-xls" className={styles.report_table}>
                      <thead>
                        <tr>
                          <th colSpan={2}>अ.क्र</th>
                          <th colSpan={8}>शुल्काचे नाव</th>
                          <th colSpan={2}>रक्कम (रु)</th>
                        </tr>
                        <tr>
                          <td colSpan={4}>1</td>
                          <td colSpan={4}>
                            {this?.props?.dataa?.serviceNameMr}
                          </td>
                          <td colSpan={4}>{this?.props?.dataa?.loi?.amount}</td>
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
                              एकूण रक्कम : {this?.props?.dataa?.loi?.amount}
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    ५(२) विवाह शास्त्रोक्त पद्धतीने झालेल्याच्या दिनांक:{" "}
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.marriageDate,
                          "YYYY-MM-DD",
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.marriageDate} */}
                    विवाह नोंदणीकृत आकारण्यात येणारे विवाह प्रमाणपत्र पुन्हा
                    जारी करणे &nbsp;
                  </b>
                  <b>एकूण शुल्क</b> &nbsp;
                  {/* <b>{this?.props?.dataa?.loi?.amount}</b> */}
                  <b>{this?.props?.dataa?.payment?.amount} रु .</b>
                  <br />
                  <b>
                    {this?.props?.dataa?.serviceNameMr} या सेवेसाठी नागरिक सेवा
                    पोर्टलवर तुमची रक्कम प्राप्त झाली आहे. <br />
                    पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालय आपल्यासेवेस तत्पर
                    आहे ,धन्यवाद.!!
                  </b>
                </h5>
              </p>

              <hr />

              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5>
                    {" "}
                    {this?.props?.dataa?.zone?.zoneNameMr}
                    {","} {this?.props?.dataa?.zone?.zoneaddressMr}
                  </h5>
                  {/* <h5> महाराष्ट्र, भारत</h5> */}
                </div>
                <div className={styles.add1}>
                  <h5>कृपया संबंधित क्षेत्रीय कार्यालयाशी संपर्क साधावा</h5>
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
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
