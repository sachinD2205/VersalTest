import React, { useEffect, useRef, useState } from "react";
import styles from "../acknowledgmentReceiptmarathi/view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import urls from "../../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    getVenueNames();
    getDateTime();
  }, []);
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state?.labels.language);

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
  const [venueNames, setVenueNames] = useState([]);
  const getVenueNames = () => {
    axios
      .get(`${urls.SPURL}/venueMasterSection/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setVenueNames(
          r.data.venueSection.map((row) => ({
            id: row.id,
            venue: row.venue,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [datetime, setDatetime] = useState([]);

  const getDateTime = () => {
    axios
      .get(`${urls.SPURL}/master/slotDetails/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDatetime(
          r.data.slotDetails.map((row) => ({
            id: row.id,
            fromBookingTime: row.fromTime,
            toBookingTime: row.toTime,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("router.query.ack", router.query);
    axios
      .get(`${urls.SPURL}/gymBooking/getById?id=${router.query?.Id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // setData(res.data);
        const tempData = res?.data;

        const _res = {
          ...tempData,
          venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)
            ?.venue,
          fromBookingTime: datetime?.find(
            (obj) => obj?.id == tempData?.bookingTimeId
          )?.fromBookingTime,
          toBookingTime: datetime?.find(
            (obj) => obj?.id == tempData?.bookingTimeId
          )?.toBookingTime,
          // venueNames: tempData?.venue,
          // venue: tempData?.venueNames,
        };

        console.log("getbyId", _res);

        setData(_res);
        console.log("loi recept data", res.data);

        console.log("loi recept data", res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, [router.isReady, venueNames, datetime]);

  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            if (router.query.applicantType === "No Concession") {
              // router.push("/sportsPortal/transaction/gymBooking/Pay");
              // router.push(
              //   "/sportsPortal/transaction/gymBooking/PaymentCollectionGym"
              // );
              let ApplicationId = router.query.Id;
              router.push({
                pathname: `/sportsPortal/transaction/gymBooking/PaymentCollectionGym`,
                query: {
                  applicationId: ApplicationId,
                },
              });
            } else {
              router.push("/dashboard");
            }
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
    return (
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
              <b>पोच पावती</b>
            </h2>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h3>
                  &nbsp; &nbsp; प्रती, <b>{this?.props?.data?.applicantName}</b>
                </h3>{" "}
                <h3>
                  {" "}
                  &nbsp; &nbsp;पिंपरी चिंचवड नागरिक सेवा वापरल्याबद्दल धन्यवाद
                  !!
                </h3>
                <h3>
                  &nbsp; &nbsp;पिंपरी चिंचवड महापालिकेअंतर्गत येणाऱ्या नागरिक
                  सेवा अंतर्गत तुमचा
                  {this?.props?.data?.serviceName}
                  {/* {venueNames?.find((obj) => obj?.id === r.venue)?.venue} */}
                  &nbsp; अर्ज यशस्वीरीत्या सादर झाला आहे.
                </h3>
                <h3> &nbsp; &nbsp;Venue : {this?.props?.data?.venueNames}</h3>
                <h3>
                  {/* Date : {this?.props?.data?.fromDate} - {this?.props?.data?.toDate}{" "} */}
                  &nbsp; &nbsp;Date :{" "}
                  {moment(
                    this?.props?.data?.fromDate,
                    "YYYY-MM-DD HH:mm:ss A"
                  ).format("DD-MM-YYYY")}
                  -{" "}
                  {moment(
                    this?.props?.data?.toDate,
                    "YYYY-MM-DD HH:mm:ss A"
                  ).format("DD-MM-YYYY")}{" "}
                </h3>
                <h3>
                  &nbsp; &nbsp;Selected Slot :{" "}
                  {/* { moment(this?.props?.data?.fromBookingTime, 'HH:mm:ss').format('hh:mm A')} */}
                  {this?.props?.data?.fromBookingTime} -{" "}
                  {this?.props?.data?.toBookingTime}{" "}
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}>अर्जाचा तपशील</h2>
            </div>
            <Card>
              {/* <h2 className={styles.summary}>Application Summary</h2> */}
              <div className={styles.summ}>
                <div>
                  <h3>&nbsp; &nbsp;अर्जाचा क्रमांक </h3>
                  <h3>&nbsp; &nbsp;अर्जदाराचे नाव </h3>
                  <h3>&nbsp; &nbsp;अर्ज दिनांक </h3>
                  <h3>&nbsp; &nbsp;अर्ज वेळ </h3>
                  <h3>&nbsp; &nbsp;मोबाईल क्र.</h3>
                  <h3>&nbsp; &nbsp;पत्ता </h3>
                </div>
                <div>
                  <h3> : {this?.props?.data?.applicationNumber}</h3>
                  <h3>
                    {" "}
                    : <b>{this?.props?.data?.applicantName}</b>
                  </h3>
                  <h3>
                    {" "}
                    :{" "}
                    {moment(this?.props?.data?.applicationDate).format(
                      "DD-MM-YYYY"
                    )}
                  </h3>
                  {/* <h3> : {this?.props?.data?.createDtTm}</h3> */}
                  <h3>
                    {" "}
                    :{" "}
                    {moment(this?.props?.data?.createDtTm).format("hh:mm:ss A")}
                  </h3>

                  <h3> : {this?.props?.data?.mobileNo}</h3>
                  <h3>
                    : {this?.props?.data?.cAddress}{" "}
                    {this?.props?.data?.cCityName} {","}{" "}
                    {this?.props?.data?.cState} {","}{" "}
                    {this?.props?.data?.cPincode}{" "}
                  </h3>
                </div>
              </div>
            </Card>
            <div className={styles.query}>
              <h4>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;कोणत्याही
                प्रश्नासाठी कृपया तुमच्या जवळच्या ऑपरेटरशी संपर्क साधा खालील
                संपर्क तपशील:
              </h4>
            </div>

            <div className={styles.foot}>
              <div className={styles.add}>
                <h5>पिंपरी चिंचवड महानगरपलिका </h5>
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
      </div>
    );
  }
}

export default Index;
