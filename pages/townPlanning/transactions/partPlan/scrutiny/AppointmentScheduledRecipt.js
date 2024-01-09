import { Button } from "@mui/material";
import moment from "moment";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./AppointmentScheduleRecipt.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
const AppointmentScheduledReipt = () => {
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [data, setdata] = useState();
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
  const getLoiGenerationData = (data) => {
    console.log("AppontmentSchID", router?.query?.applicationId);

    if (router?.query?.applicationId) {
      axios
        .get(
          `${urls.TPURL}/developmentPlanOpinion/getDevelopmentPlanOpinionById?id=${router?.query?.applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          setdata(res.data);
          console.log("loi recept data", res.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    console.log("useeffect");
    getLoiGenerationData();
  }, []);
  const language = useSelector((state) => state?.labels.language);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    router.push({ pathname: "/homepage" });
  };
  useEffect(() => {
    console.log("router?.query", router?.query);
    reset(router?.query);
  }, []);
  // view
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={data} />
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
                      button: "ओके",
                    });
                router.push(
                  "/townPlanning/transactions/developmentPlanOpinion/scrutiny/",
                );
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
              <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>टोकन क्रमांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>{router?.query?.tokenNo}</b>
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
                          router?.query?.appointmentDate,
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
                    {router?.query?.appointmentFromTime} -{" "}
                    {router?.query?.appointmentToTime}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginTop: "2vh" }}>
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
                        router?.query?.appointmentDate,
                        "YYYY-MM-DD",
                      ).format("DD-MM-YYYY")}{" "}
                    {router?.query?.appointmentFromTime} -{" "}
                    {router?.query?.appointmentToTime}
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
                <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                <h5> महाराष्ट्र, भारत</h5>
              </div>

              <div className={styles.add1}>
                <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AppointmentScheduledReipt;
