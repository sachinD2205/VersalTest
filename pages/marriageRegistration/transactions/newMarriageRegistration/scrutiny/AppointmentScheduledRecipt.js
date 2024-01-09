import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import router from "next/router";
import sweetAlert from "sweetalert";
import Loader from "../../../../../containers/Layout/components/Loader";
import styles from "./AppointmentScheduleRecipt.module.css";

import axios from "axios";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
const AppointmentScheduledReipt = () => {
  const language = useSelector((state) => state?.labels.language);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    router.push({ pathname: "/homepage" });
  };
  const [data, setData] = useState(null);
  const [loaderstate, setloaderstate] = useState(false);
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

  const AppointmentScheduledData = () => {
    console.log("1234", router?.query?.id);

    axios
      .get(
        `${
          urls.MR
        }/transaction/applicant/getapplicantById?applicationId=${Number(
          router?.query?.id,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setData(res.data);
        console.log("AppointmentScheduled", res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    console.log("useeffect");
    AppointmentScheduledData();
  }, []);

  // useEffect(() => {
  //   console.log("router.query", router.query);
  //   if (router.query.id && router.query.serviceId) {
  //     setloaderstate(true);
  //     axios
  //       .get(
  //         `${urls.MR}/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${router.query.id}&serviceId=${router.query.serviceId}`,
  //       )
  //       .then((r) => {
  //         setloaderstate(false);
  //         console.log("r.data", r.data);
  //         setData(r.data);
  //       });
  //   }
  // }, []);

  // view
  return (
    <>
      {" "}
      {loaderstate ? (
        <Loader />
      ) : (
        <>
          <div>
            <ComponentToPrint data={data} ref={componentRef} />
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
                })
                  // swal({
                  //   title: "Exit?",
                  //   text: "Are you sure you want to exit this Record ? ",
                  //   icon: "warning",
                  //   buttons: true,
                  //   dangerMode: true,
                  // }).
                  .then((willDelete) => {
                    if (willDelete) {
                      // swal("Record is Successfully Exit!", {
                      //   icon: "success",
                      // });
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
                            button: "ओके",
                          });
                      router.push(
                        "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
                      );
                    } else {
                      // swal("Record is Safe");
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
      )}
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
              <div className={styles.middle}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                {/* <h4>
                  {' '}
                  <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
                </h4>

                <h4>
                  {' '}
                  <b>महाराष्ट्र, भारत</b>
                </h4> */}
              </div>
              <div className={styles.logo}>
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
                <b>अपॉइंटमेंट बुकिंग</b>
                <h5>
                  (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८)
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              <h4
                style={{
                  marginLeft: "40px",
                  color: "red",
                  fontStyle: "italic",
                  // marginTop: "25px",
                }}
              >
                <p>
                  कृपया अंतिम अर्जावर 100 रु कोर्ट फी स्टॅम्प चिकटवा आणि तुमच्या
                  नियोजित भेटीच्या वेळी सर्व मूळ कागदपत्रांसह फॉर्म आणा.
                </p>
              </h4>
              <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>टोकन क्रमांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {this?.props?.data?.appointmentScheduleReschDao?.tokenNo}
                    </b>
                  </h4>
                </div>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>दिनांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(
                          // {this?.props?.data?.loi?.loiNo}
                          this?.props?.data?.appointmentScheduleReschDao
                            ?.appointmentDate,
                          "YYYY-MM-DD",
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* <b>{router?.query?.appointmentDate}</b> */}
                  </h4>
                </div>

                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>वेळ :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.data?.appointmentScheduleReschDao?.time}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    <b>अर्जाचा क्रमांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {router?.query?.applicationNumber}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{}}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>अर्ज दिनांक : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(
                          router?.query?.applicationDate,
                          "YYYY-MM-DD",
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{}}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>अर्जदाराचे नाव : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {router?.query?.applicantNameMr}
                  </h4>
                </div>
              </div>

              <div
                style={{
                  marginTop: "2vh",
                  marginLeft: "5vh",
                  marginRight: "5vh",
                }}
              >
                <h4>
                  <b>प्रिय {router?.query?.applicantNameMr} ,</b>
                  <b>
                    <br />
                    तुमचा {router?.query?.serviceNameMr} अर्ज प्राप्त झाला आहे
                    आणि मंजुरी साठी प्रलंबित आहे.
                  </b>
                  <b>
                    {" "}
                    अपॉइंटमेंट तारीख आणि अपॉइंटमेंट स्लॉट वेळ :{" "}
                    {" " +
                      moment(
                        this?.props?.data?.appointmentScheduleReschDao
                          ?.appointmentDate,
                        "YYYY-MM-DD",
                      ).format("DD-MM-YYYY")}{" "}
                    {this?.props?.data?.appointmentScheduleReschDao?.time}
                  </b>{" "}
                  &nbsp;
                  <b>
                    <br />
                    कृपया सर्व चेकलिस्ट दस्तऐवजांची मूळ हार्ड कॉपी{" "}
                    {router?.query?.zoneAddress} येथे सोबत ठेवा
                  </b>{" "}
                  &nbsp;
                  <b>
                    {router?.query?.serviceNameMr} या सेवेसाठी नागरिक सेवा
                    पोर्टलवर तुमची अपॉइंटमेंट बुक झाली आहे. <br />
                    पिंपरी चिंचवड महानगरपालिका विभागीय कार्यालय आपल्यासेवेस
                    तत्पर आहे ,धन्यवाद.!!
                  </b>
                </h4>
              </div>

              <hr />

              <div className={styles.add}>
                <h5>पिंपरी चिंचवड महानगरपालिका </h5>
                <h5>
                  {" "}
                  {this?.props?.data?.zone?.zoneNameMr}
                  {","} {this?.props?.data?.zone?.zoneaddressMr}
                </h5>
              </div>

              <div className={styles.add1}>
                <h5>कृपया संबंधित क्षेत्रीय कार्यालयाशी संपर्क साधावा</h5>
                {/* <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AppointmentScheduledReipt;
