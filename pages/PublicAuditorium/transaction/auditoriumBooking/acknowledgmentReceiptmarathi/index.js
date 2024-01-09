import React, { useEffect, useRef, useState } from "react";
import styles from "../acknowledgmentReceiptmarathi/view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card, Grid } from "@mui/material";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const [bookedAud, setBookedAud] = useState();
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [auditoriums, setAuditoriums] = useState([]);
  const [events, setEvents] = useState([]);
  const [_loggedInUser, set_LoggedInUser] = useState(null);

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

  useEffect(() => {
    set_LoggedInUser(localStorage.getItem("loggedInUser"));
    // getAuditoriumBooking();
    getAuditorium();
    getEvents();
  }, []);

  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const getAuditorium = () => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe 4Au", r);
        setLoading(false);
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
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getEvents = () => {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setEvents(
          r.data.trnAuditoriumEventsList.map((row) => ({
            ...row,
            id: row.id,
            programEventDescription: row.programEventDescription,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    console.log(
      "router.query.data",
      router.query
      // router.query.data && JSON.parse(router.query.data)
    );
    if (router.query.data) {
      let newData = router.query.data && JSON.parse(router.query.data);
      let applicationNumber =
        newData.merchant_param5 && JSON.parse(newData.applicationId);
      console.log("newData", applicationNumber);
      getDataByApplicationNumber(Number(applicationNumber));
      // setBookedAud(_newData);
    }
  }, [router.query.data]);

  const getDataByApplicationNumber = (applicationNumber) => {
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${applicationNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("by application no", res);
        setBookedAud(res?.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      <div>
        <ComponentToPrint
          data={bookedAud}
          ref={componentRef}
          auditoriums={auditoriums}
          events={events}
        />
      </div>
      <div className={styles.btn}>
        <Button
          variant="contained"
          size="small"
          type="primary"
          onClick={handlePrint}
        >
          print
        </Button>
        <Button
          color="error"
          type="primary"
          variant="contained"
          size="small"
          onClick={() => {
            _loggedInUser == "cfcUser"
              ? router.push("/CFC_Dashboard")
              : router.push("/dashboardV3");
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    console.log(
      "props",
      this.props,
      this?.props?.data?.timeSlotList &&
        JSON.parse(this?.props?.data?.timeSlotList)
    );
    return (
      <div style={{ paddingTop: "5%" }}>
        <div className={styles.mainn}>
          <div className={styles.main}>
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
                <b>पोहोच पावती</b>
              </h2>
            </div>
            <div>
              <Card>
                <div className={styles.info}>
                  <h3>
                    प्रिय, <b>{this?.props?.data?.applicantName}</b>
                  </h3>
                  <h3>पिंपरी चिंचवड नागरिक सेवा वापरल्याबद्दल धन्यवाद !!</h3>
                  <h3>
                    पिंपरी चिंचवड महापालिकेअंतर्गत येणाऱ्या नागरिक सेवा अंतर्गत
                    तुमचा {this?.props?.data?.serviceNameMr} अर्ज यशस्वीरीत्या
                    सादर झाला आहे.
                  </h3>
                </div>
              </Card>

              <div>
                <h2 className={styles.heading}>अर्जाचा तपशील</h2>
              </div>
              <Card sx={{ padding: "10px" }}>
                <table
                  style={{
                    width: "100%",
                  }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <b>Application No. / अर्जाचा क्रमांक </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>{this?.props?.data?.applicationNumber}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Applicant Name / अर्जदाराचे नाव</b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>{this?.props?.data?.applicantName}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Application Date / अर्ज दिनांक </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>
                        {" "}
                        {moment(this?.props?.data?.applicationDate).format(
                          "DD-MM-YYYY"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Applicant Address / अर्जदाराचा पत्ता </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>
                        {" "}
                        {this?.props?.data?.applicantFlatHouseNo}{" "}
                        {this?.props?.data?.applicantFlatBuildingName} {","}
                        {this?.props?.data?.applicantLandmark} {","}{" "}
                        {this?.props?.data?.applicantArea} {","}{" "}
                        {this?.props?.data?.applicantCity} {","}{" "}
                        {this?.props?.data?.applicantState}{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Auditorium Name / प्रेक्षागृह / नाट्यगृह नाव </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>
                        <b>
                          {
                            this?.props?.auditoriums?.find(
                              (obj) =>
                                obj?.id == this?.props?.data?.auditoriumId
                            )?.auditoriumNameEn
                          }
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Event / कार्यक्रम </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>
                        <b>
                          {
                            this?.props?.events?.find(
                              (obj) => obj?.id == this?.props?.data?.eventKey
                            )?.eventNameEn
                          }
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Event Title / कार्यक्रमाचे शीर्षक </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>{this?.props?.data?.eventTitle}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Event Details / कार्यक्रम तपशील </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>{this?.props?.data?.eventDetails}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Event Date / कार्यक्रमाची तारीख </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>
                        {this?.props?.data?.timeSlotList &&
                          JSON?.parse(this?.props?.data?.timeSlotList)?.map(
                            (val) => {
                              return (
                                <b>
                                  {moment(val?.bookingDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </b>
                              );
                            }
                          )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Event Time / कार्यक्रमाची वेळ </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>
                        {this?.props?.data?.timeSlotList &&
                          JSON?.parse(this?.props?.data?.timeSlotList)?.map(
                            (val) => {
                              return (
                                <b>
                                  {val?.fromTime} To {val?.toTime}
                                </b>
                              );
                            }
                          )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Event Day / कार्यक्रमाचा दिवस </b>
                      </td>
                      <td>
                        <b>:</b>
                      </td>
                      <td>
                        {" "}
                        {this?.props?.data?.timeSlotList &&
                          JSON.parse(this?.props?.data?.timeSlotList)?.map(
                            (val) => {
                              return (
                                <b>{moment(val?.bookingDate).format("dddd")}</b>
                              );
                            }
                          )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* <h2 className={styles.summary}>Application Summary</h2> */}
                {/* <div className={styles.summ}>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "45%" }}>
                      <h3>Application No. / अर्जाचा क्रमांक :</h3>
                      <h3>Applicant Name / अर्जदाराचे नाव :</h3>
                      <h3>Application Date / अर्ज दिनांक :</h3>
                      <h3>Applicant Address / अर्जदाराचा पत्ता :</h3>

                      <h3>Auditorium Name / प्रेक्षागृह / नाट्यगृह नाव :</h3>
                      <h3>Event / कार्यक्रम :</h3>
                      <h3>Event Title / कार्यक्रमाचे शीर्षक :</h3>
                      <h3>Event Details / कार्यक्रम तपशील :</h3>
                    </div>
                    <div>
                      <h3>{this?.props?.data?.applicationNumber}</h3>
                      <h3>
                        {" "}
                        <b>{this?.props?.data?.applicantName}</b>
                      </h3>
                      <h3>
                        {" "}
                        {moment(this?.props?.data?.applicationDate).format(
                          "DD-MM-YYYY"
                        )}
                      </h3>
                      <h3>
                        {this?.props?.data?.applicantFlatHouseNo}{" "}
                        {this?.props?.data?.applicantFlatBuildingName} {","}
                        {this?.props?.data?.applicantLandmark} {","}{" "}
                        {this?.props?.data?.applicantArea} {","}{" "}
                        {this?.props?.data?.applicantCity} {","}{" "}
                        {this?.props?.data?.applicantState}{" "}
                      </h3>
                      <h3>
                        {" "}
                        <b>
                          {
                            this?.props?.auditoriums?.find(
                              (obj) =>
                                obj?.id == this?.props?.data?.auditoriumId
                            )?.auditoriumNameEn
                          }
                        </b>
                      </h3>
                      <h3>
                        {" "}
                        <b>
                          {
                            this?.props?.events?.find(
                              (obj) => obj?.id == this?.props?.data?.eventKey
                            )?.eventNameEn
                          }
                        </b>
                      </h3>
                      <h3>
                        {" "}
                        <b>{this?.props?.data?.eventTitle}</b>
                      </h3>
                      <h3>
                        {" "}
                        <b>{this?.props?.data?.eventDetails}</b>
                      </h3>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "45%" }}>
                      <h3>Event Date / कार्यक्रमाची तारीख :</h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {this?.props?.data?.timeSlotList &&
                        JSON?.parse(this?.props?.data?.timeSlotList)?.map(
                          (val) => {
                            return (
                              <h3>
                                {moment(val?.bookingDate).format("DD-MM-YYYY")}
                              </h3>
                            );
                          }
                        )}
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "45%" }}>
                      <h3>Event Time / कार्यक्रमाची वेळ :</h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {this?.props?.data?.timeSlotList &&
                        JSON?.parse(this?.props?.data?.timeSlotList)?.map(
                          (val) => {
                            return (
                              <h3>
                                <b>
                                  {val?.fromTime} To {val?.toTime}
                                </b>
                              </h3>
                            );
                          }
                        )}
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "45%" }}>
                      <h3>Event Day / कार्यक्रमाचा दिवस :</h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {this?.props?.data?.timeSlotList &&
                        JSON.parse(this?.props?.data?.timeSlotList)?.map(
                          (val) => {
                            return (
                              <h3>{moment(val?.bookingDate).format("dddd")}</h3>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div> */}
              </Card>

              <Grid container className={styles.bottom}>
                <Grid item xs={4}>
                  <h5>पिंपरी चिंचवड महानगरपलिका, </h5>
                  <h5> मुंबई पुणे महामार्ग, पिंपरी, पुणे, 411-018</h5>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  {/* <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5> */}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </Grid>
              </Grid>

              {/* <div className={styles.foot}>
              <div className={styles.add}></div>
              <div className={styles.add1}></div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                }}
              ></div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                  marginRight: "5vh",
                }}
              ></div>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
