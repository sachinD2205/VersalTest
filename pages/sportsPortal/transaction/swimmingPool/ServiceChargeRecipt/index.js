import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import router from "next/router";
import styles from "./dailySwimming.module.css";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import { useSelector } from "react-redux";

const Index = () => {
  const componentRef = useRef();
  const token = useSelector((state) => state.user.user.token);
  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "Sanction-Letter.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };

    const element = ReactDOMServer.renderToString(
      <ComponentToPrint dataa={dataa} ref={componentRef} />
    );
    let base64str;
    html2pdf()
      .from(element)
      .toPdf()
      .set(opt)
      .output("datauristring")

      .save();
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
  // useEffect
  useEffect(() => {
    getDateTime();
    getVenueNames();
    getFacilityName();
    getBookingTime();
  }, []);
  const [facilityNames, setFacilityNames] = useState([]);
  const getFacilityName = () => {
    axios
      .get(`${urls.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          }))
        );
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
      });
  };

  const [time, setTime] = useState([]);
  const getBookingTime = () => {
    axios
      .get(`${urls.SPURL}/bookingMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("21", r);
        // setVenueNames(
        //   r.data.venue.map((row) => ({
        //     id: row.id,
        //     venue: row.venue,
        //   })),
        // );
      });
  };

  useEffect(() => {
    axios
      .get(
        `${urls.SPURL}/swimmingPool/getById?id=${router?.query?.applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const tempData = res?.data;
        const _res = {
          ...tempData,
          venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)
            ?.venue,
          facilityName: facilityNames?.find(
            (obj) => obj?.id == tempData?.facilityName
          )?.facilityName,
          fromBookingTime: datetime?.find(
            (obj) => obj?.id == tempData?.bookingTimeId
          )?.fromBookingTime,
          toBookingTime: datetime?.find(
            (obj) => obj?.id == tempData?.bookingTimeId
          )?.toBookingTime,
        };
        setDataa(_res);
        console.log("Swimming data", _res);
      });
  }, [venueNames, datetime]);

  // useEffect(() => {
  //   axios.get(`${urls.SPURL}/sportsBooking/getById?id=${103}`).then((res) => {
  //     setDataa(res.data);
  //     console.log("board data", res.data);
  //   });
  // }, []);
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
          onClick={printHandler}
        >
          Download
        </Button>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            swal({
              title: "Exit?",
              text: "Are you sure you want to exit this Record ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal("Record is Successfully Exit!", {
                  icon: "success",
                });
                router.push("/dashboard");
              } else {
                swal("Record is Safe");
              }
            });
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
                <b>पावती</b>
              </h2>
            </div>

            <div className={styles.two}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>अर्जाचा क्रमांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.dataa?.applicationNumber}
                  </h4>
                </div>
              </div>

              <div className={styles.date4}>
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
                          "YYYY-MM-DD"
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                  </h4>
                </div>
              </div>
              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>अर्जदाराचे नाव : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" " +
                      this?.props?.dataa?.firstName +
                      " " +
                      " " +
                      this?.props?.dataa?.middleName +
                      " " +
                      this?.props?.dataa?.lastName}
                  </h4>
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>जलतरण तलावाचे नाव : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" " + this?.props?.dataa?.venueNames}
                  </h4>
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>स्लॉट: </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" " + this?.props?.dataa?.fromBookingTime}
                  </h4>{" "}
                  --
                  <h4 style={{ marginLeft: "10px" }}>
                    {" " + this?.props?.dataa?.toBookingTime}{" "}
                  </h4>
                </div>
              </div>

              <p>
                <h5 style={{ marginLeft: "40px", marginRight: "40px" }}>
                  <b>
                    पुढील प्रमाणे फी मिळाली :-
                    <br />
                    <table id="table-to-xls" className={styles.report_table}>
                      <thead>
                        <tr>
                          <th colSpan={2}>अ.क्र</th>
                          <th colSpan={8}> नाव</th>
                          <th colSpan={2}>रक्कम(रु)</th>
                        </tr>
                        <tr>
                          <td colSpan={4}>1)</td>
                          <td colSpan={4}>
                            {this?.props?.dataa?.firstName}{" "}
                            {this?.props?.dataa?.middleName}{" "}
                            {this?.props?.dataa?.lastName}{" "}
                            </td>
                          {/* <td colSpan={4}>10 रु</td> */}
                          <td colSpan={4}>
                            {this?.props?.dataa?.applicableCharages?.map(
                              (r, i) => (
                                <>{r.amountPerHead} रु</>
                              )
                            )}
                          </td>
                          {/* <td colSpan={4}>{this?.props?.dataa?.applicableCharages?.amountPerHead}</td> */}
                        </tr>
                        {this?.props?.dataa?.swimmingPoolDetailsDao?.map(
                          (r, i) => (
                            <tr>
                              <td colSpan={4}>{i + 2})</td>
                              <td colSpan={4}>{r.memberName}{" "}
                                {r.memberMname}{" "}
                                {r.memberLname}{" "}
                                </td>
                              <td colSpan={4}>
                                {this?.props?.dataa?.applicableCharages?.map(
                                  (r, i) => (
                                    <>{r.amountPerHead} रु</>
                                  )
                                )}
                              </td>
                            </tr>
                          )
                        )}
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
                              एकूण रक्कम :{" "}
                              <td colSpan={4}>
                                {this?.props?.dataa?.applicableCharages?.map(
                                  (r, i) => (
                                    <td colSpan={4}>{r.totalAmount} /-(रु)</td>
                                  )
                                )}
                              </td>
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    जलतरण तलाव नोंदणीकृत झालेल्याचा दिनांक:{" "}
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.applicationDate,
                          "YYYY-MM-DD"
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    व जलतरण तलाव नोंदणीकृत आकारण्यात येणारे शुल्क
                  </b>
                  <b> एकूण फी</b> &nbsp;
                  <b>
                    {this?.props?.dataa?.applicableCharages?.map((r, i) => (
                      <td colSpan={4}>{r.totalAmount}/- (रु)</td>
                    ))}
                  </b>
                  <br />
                  <br />
                  <b>
                    {this?.props?.dataa?.serviceNameMr} या सेवेसाठी नागरिक सेवा
                    पोर्टलवर तुमची रक्कम प्राप्त झाली आहे. <br />
                    <br />
                    पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालय आपल्यासेवेस तत्पर
                    आहे ,धन्यवाद.!!
                  </b>
                </h5>
              </p>

              <hr />

              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </div>
                <div className={styles.add1}>
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>
                    इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5>
                </div>
                <div className={styles.logo}>
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
                </div>
                <div className={styles.logo}>
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
