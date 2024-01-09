/* eslint-disable @next/next/no-img-element */
import { Button, Card } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../../URLS/urls";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import styles from "../acknowledgmentReceiptmarathi/view.module.css";

const Index = () => {
  const userDao = useSelector((state) => state?.user?.user?.userDao);
  const componentRef = useRef(null);
  const router = useRouter();
  const userToken = useGetToken();
  const [venueNames, setVenueNames] = useState([]);
  const [datetime, setDatetime] = useState([]);
  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
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

  // getDateTime
  const getDateTime = () => {
    axios.get(`${urls.SPURL}/bookingTime/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setDatetime(
        r.data.bookingTime.map((row) => ({
          id: row.id,
          fromBookingTime: row.fromBookingTime,
          toBookingTime: row.toBookingTime,
        }))
      );
    })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    ;
  };

  //getVenueNames
  const getVenueNames = () => {
    axios.get(`${urls.SPURL}/venueMasterSection/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
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
    ;
  };

  // getByGroundBookingId
  const getByGroundBookingId = () => {
    axios
      .get(`${urls.SPURL}/groundBooking/getById?id=${router?.query?.Id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        const tempData = res?.data;
        const _res = {
          ...tempData,
          selectedBookingSlots: JSON.parse(tempData?.selectedBookingSlots),
          venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)
            ?.venue,
          fromBookingTime: datetime?.find(
            (obj) => obj?.id == tempData?.bookingIds.split(",")[0]
          )?.fromBookingTime,
          toBookingTime: datetime?.find(
            (obj) => obj?.id == tempData?.bookingIds.split(",")[0]
          )?.toBookingTime,
        };
        setData(_res);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    ;

  }


  //!========================== useEffect 

  useEffect(() => {
    getVenueNames();
    getDateTime();
  }, []);

  useEffect(() => {
    if (router?.query?.Id) {
      getByGroundBookingId();
    }
  }, [router.isReady, venueNames, datetime]);

  //!======================= view
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
            if (userDao?.cfcUser) {
              router.push("/CFC_Dashboard");
            } else if (userDao?.deptUser) {
              router.push("/sportsPortal/transaction/groundBookingNew/scrutiny");
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
                </h3>
                <h3>
                  &nbsp; &nbsp;पिंपरी चिंचवड नागरिक सेवा वापरल्याबद्दल धन्यवाद
                  !!
                </h3>
                <h3>
                  &nbsp; &nbsp; पिंपरी चिंचवड महापालिकेअंतर्गत येणाऱ्या नागरिक
                  सेवा अंतर्गत तुमचा <br />
                  &nbsp; &nbsp; {this?.props?.data?.serviceName}
                  &nbsp; &nbsp;अर्ज यशस्वीरीत्या सादर झाला आहे.
                </h3>
                <h3>&nbsp; &nbsp;Venue : {this?.props?.data?.venueNames}</h3>
                <h3>
                  &nbsp; &nbsp;Date :{" "}
                  {moment(
                    this?.props?.data?.fromDate,
                    "YYYY-MM-DD HH:mm:ss A"
                  ).format("DD-MM-YYYY")}{" "}
                  -{" "}
                  {moment(
                    this?.props?.data?.toDate,
                    "YYYY-MM-DD HH:mm:ss A"
                  ).format("DD-MM-YYYY")}{" "}
                </h3>
                <h3 >
                  <span>
                    &nbsp; &nbsp;Selected Slots :
                  </span>
                  <span style={{ paddingRight: "1vw" }}>
                    {this?.props?.data?.selectedBookingSlots}
                  </span>
                </h3>

              </div>
            </Card>

            <div>
              <h2 className={styles.heading}>अर्जाचा तपशील</h2>
            </div>
            <Card>
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
                कोणत्याही प्रश्नासाठी कृपया तुमच्या जवळच्या ऑपरेटरशी संपर्क साधा
                खालील संपर्क तपशील:
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
