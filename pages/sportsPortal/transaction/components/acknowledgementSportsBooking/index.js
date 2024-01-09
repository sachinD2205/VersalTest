import React, { useEffect, useRef, useState } from "react";
import styles from "../acknowledgmentReceiptmarathi/view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card } from "@mui/material";
import axios from "axios";
import moment from "moment";
import urls from "../../../../../URLS/urls";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Loader from "../../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

// import { watch } from "fs";
// import { getValue } from "@mui/system";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  // const {
  //   watch,
  //   formState: { errors },
  // } = methods;
  // const methods = useForm({
  //   defaultValues: {
  //     bookingRegistrationId: "",
  //     applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
  //     // toDate: moment("fromDate").add(4, 'M').format('DD-MM-YYYY'),
  //     sportsBookingGroupDetailsDao: [],
  //     serviceName: "Sports Booking",
  //   },
  //   mode: "onChange",
  //   criteriaMode: "all",
  //   resolver: yupResolver(dataValidation),
  // });

  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    getVenueNames();
    getDateTime();
  }, []);

  const [datetime, setDatetime] = useState([]);
  const [applicationId, setApplicationId] = useState("");
  const language = useSelector((state) => state?.labels.language);

  const [loadderState, setLoadderState] = useState(false);
  const token = useSelector((state) => state.user.user.token);
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
  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    setLoadderState(true);

    console.log("router.query.ack", router.query);
    if (
      // router.query?.Id != null && router.query?.Id != undefined
      !!router.query?.Id
    ) {
      axios
        .get(`${urls.SPURL}/sportsBooking/getById`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: router.query.Id,
          },
        })
        .then((res) => {
          if ((res.status = 200)) {
            setLoadderState(false);
            console.log("1111", res);
            setApplicationId(Number(res?.data?.id));
            // setData(res.data);
            const tempData = res?.data;
            console.log("data ky yetoy", res?.data);
            const _res = {
              ...tempData,
              venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)
                ?.venue,
              // fromBookingTime: datetime?.find(
              //   (obj) => obj?.id == tempData?.bookingIds?.split(",")[0]
              // )?.fromBookingTime,
              // toBookingTime: datetime?.find(
              //   (obj) => obj?.id == tempData?.bookingIds?.split(",")[0]
              // )?.toBookingTime,
              fromBookingTime: datetime?.find(
                (obj) => obj?.id == tempData?.bookingTimeId
              )?.fromBookingTime,
              toBookingTime: datetime?.find(
                (obj) => obj?.id == tempData?.bookingTimeId
              )?.toBookingTime,
            };
            console.log("getbyId", _res.bookingIds);
            setData(_res);
            console.log("loi recept data", res.data);
          } else {
            console.log("error");
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [router.isReady, venueNames, datetime]);

  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
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
              // onClick={() => {
              //   router.push({
              //     pathname:
              //       "/sportsPortal/transaction/sportBooking/PaymentCollection",
              //     query: {
              //       applicationId: router.query.Id,
              //       serviceId: 29,
              //     },
              //   });
              // }}
              onClick={() => {
                if (router.query.applicantType === "No Concession") {
                  let ApplicationId = router.query.Id;
                  router.push({
                    pathname: `/sportsPortal/transaction/sportBooking/PaymentCollection`,
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
      )}
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
                  &nbsp; &nbsp;पिंपरी चिंचवड महापालिकेअंतर्गत येणाऱ्या नागरिक
                  सेवा अंतर्गत तुमचा &nbsp;
                  {this?.props?.data?.serviceName}
                  <br></br>
                  {/* {venueNames?.find((obj) => obj?.id === r.venue)?.venue} */}
                  &nbsp; &nbsp;अर्ज यशस्वीरीत्या सादर झाला आहे.
                </h3>
                <h3>&nbsp; &nbsp;Venue : {this?.props?.data?.venueNames}</h3>
                <h3>
                  &nbsp; &nbsp; Date :{" "}
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
                <h3>
                  &nbsp; &nbsp;Selected Slots :{" "}
                  {this?.props?.data?.fromBookingTime} To{" "}
                  {this?.props?.data?.toBookingTime}
                </h3>
                {/* <h3>
                  Time : {this?.props?.data?.fromBookingTime} - {this?.props?.data?.toBookingTime}{" "}
                </h3> */}
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
                  {/* <h3> : {this?.props?.data?.createDtTm}</h3>
                   */}

                  <h3>
                    {" "}
                    :{" "}
                    {moment(this?.props?.data?.createDtTm).format("hh:MM:ss A")}
                  </h3>
                  <h3> : {this?.props?.data?.mobileNo}</h3>
                  <h3>
                    : {this?.props?.data?.cAddress}{" "}
                    {/* {this?.props?.data?.abuildingNameMr} {','} */}
                    {/* {this?.props?.data?.aroadNameMr} {','}{' '}
                    {this?.props?.data?.alandmarkMr} {','}{' '} */}
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
              {/* <div
                className={styles.logo1}
                style={{
                  marginLeft: '5vh',
                }}
              >
                <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
              </div> */}
              {/* <div
                className={styles.logo1}
                style={{
                  marginLeft: '5vh',
                  marginRight: '5vh',
                }}
              >
                <img src="/barcode.png" alt="" height="50vh" width="100vw" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
