// http://localhost:4000/sportsPortal/transaction/sportBooking/SanctionLetter
import { Button } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "./payment9.module.css";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  const router = useRouter();
  const componentRef = useRef(null);
  const [facilityNames, setFacilityNames] = useState([]);
  const [title, setTitle] = useState([]);
  const [applicableCharages, setApplicableCharages] = useState([]);
  const [totalAmountFinal, setTotalAmountFinal] = useState(0);
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
  useEffect(() => {
    // getFacilityTypes();
    getFacilityName();
    getTitles();
    getZoneKeys();
    getVenueNames();
    getDateTime();
  }, []);
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
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getTitles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setTitle(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
            titleMr: row.titleMr,
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
  const [id, setid] = useState();
  const [dataa, setDataa] = useState(null);

  const getData = () => {
    if (id != null && id != undefined) {
      axios
        .get(`${urls.SPURL}/sportsBooking/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log("54332313456", r?.data);
          setApplicableCharages(r?.data?.applicableCharages);

          let amount = 0;
          let finalAmount = 0;
          r?.data?.applicableCharages?.map(
            (data) => (amount = data?.totalAmount)
          );

          finalAmount = amount + (amount * 18) / 100;

          console.log("amount", amount, finalAmount);

          setTotalAmountFinal(finalAmount);

          const tempData = r?.data;

          const _res = {
            ...tempData,
            venue: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
            fromBookingTime: datetime?.find(
              (obj) => obj?.id == tempData?.bookingTimeId
            )?.fromBookingTime,
            toBookingTime: datetime?.find(
              (obj) => obj?.id == tempData?.bookingTimeId
            )?.toBookingTime,
            facilityName: facilityNames?.find(
              (obj) => obj?.id == tempData?.facilityName
            )?.facilityName,

            title: title?.find((obj) => obj?.id == tempData?.title)?.title,
          };

          console.log("getbyId", _res);
          setDataa(_res);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    getData();
  }, [id, venueNames, datetime]);

  useEffect(() => {
    if (
      localStorage.getItem("id") != null ||
      localStorage.getItem("id") != ""
    ) {
      setid(localStorage.getItem("id"));
    }
    if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
      // setValue("disabledFieldInputState", true);
    } else {
      // setValue("disabledFieldInputState", false);
    }
  }, []);

  const [zoneKeys, setZoneKeys] = useState([]);

  const getZoneKeys = async () => {
    await axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

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
    documentTitle: "new document",
  });
  return (
    <>
      <div>
        <ComponentToPrint
          ref={componentRef}
          dataa={dataa}
          totalAmountFinal={totalAmountFinal}
        />
      </div>
      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={printHandler}
        >
          {language == "en" ? "Download" : "डाउनलोड करा"}
        </Button>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          {language == "en" ? "Print" : "छापा"}
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            let title;
            let titleText;
            {
              language == "en" ? (title = "Exit?") : (title = "बाहेर पडू?");
            }
            {
              language == "en"
                ? (titleText = "Are you sure you want to exit this Record ? ")
                : (titleText =
                    "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ? ");
            }
            swal({
              title: title,
              text: titleText,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                {
                  language == "en"
                    ? swal("Record is Successfully Exit!", { icon: "success" })
                    : swal("रेकॉर्ड यशस्वीरित्या बाहेर पडा!", {
                        icon: "success",
                      });
                }
                router.push("/dashboard");
              } else {
                {
                  language == "en"
                    ? swal("Record is Safe")
                    : swal("रेकॉर्ड सुरक्षित आहे");
                }
              }
            });
          }}
        >
          {language == "en" ? "Exit" : "बाहेर पडा"}
        </Button>
      </div>
    </>
  );
};

// class component
class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }
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
                  <b>Pimpri Chinchwad Municipal Corporation</b>
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
              <h2 className={styles.heading}>Sanction Letter</h2>
            </div>

            <div className={styles.two}>
              <p>
                To,
                <br></br>
                {/* Dear */}
                {this?.props?.dataa?.title}
                <b>
                  {" "}
                  {this?.props?.dataa?.firstName}{" "}
                  {this?.props?.dataa?.middleName}{" "}
                  {this?.props?.dataa?.lastName},
                </b>
                <br></br>This is an acknowledgement that your application with
                listed details received for Sports Booking same message is sent
                on you
                <br></br>registered mobile no.and email.
                <br></br>
                <p>
                  <br />
                  <p>
                    <br />
                    <h3>
                      {" "}
                      <b>Selected Sports : </b>
                      {this?.props?.dataa?.facilityName}
                    </h3>

                    <h3>
                      {" "}
                      <b>Venue Name : </b>
                      {this?.props?.dataa?.venue}
                    </h3>
                    <h3>
                      {" "}
                      <b>Date : </b>
                      {moment(
                        this?.props?.dataa?.fromDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}{" "}
                      To{" "}
                      {moment(
                        this?.props?.dataa?.toDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}{" "}
                    </h3>
                    <h3>
                      <b> Time : </b>
                      {this?.props?.dataa?.fromBookingTime} <b>-</b>{" "}
                      {this?.props?.dataa?.toBookingTime}
                    </h3>
                  </p>

                  <table id="table-to-xls" className={styles.report_table}>
                    <thead>
                      <tr>
                        <th colSpan={5}>Sr. No</th>
                        <th colSpan={10}>Member's Name</th>
                        {/* <th colSpan={10}>प्रत्येकी रक्कम (रु)</th> */}
                        {/* <th colSpan={10}>एकूण संख्या</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5}>1)</td>
                        <td colSpan={10}>
                          {this?.props?.dataa?.applicantName}
                        </td>
                      </tr>
                      {this?.props?.dataa?.sportsBookingGroupDetailsDao?.map((applicant, index) => (
                       <tr key={index}>
                        <td colSpan={5}>{index+2})</td>
                                <td>
                                  {" "}
                                  {applicant.applicantFirstName}{" "}
                                  {applicant.applicantMiddleName}{" "}
                                  {applicant.applicantLastName}
                                </td>
                       </tr>
          ))}

                      {/* <tr>
                        {this?.props?.dataa?.sportsBookingGroupDetailsDao?.map(
                          (applicant, index) => {
                            return (
                              <>
                                <td colSpan={5}>2)</td>
                                <td>
                                  {" "}
                                  {applicant.applicantFirstName}{" "}
                                  {applicant.applicantMiddleName}{" "}
                                  {applicant.applicantLastName}
                                </td>
                              </>
                            );
                          }
                        )}
                      </tr> */}
                    </tbody>
                  </table>
                  <b>
                    <br />
                    Order No.:- 001235
                  </b>
                  <b>
                    <br />
                    Address:-{this?.props?.dataa?.cAddress}{" "}
                    {this?.props?.dataa?.cCityName}{" "}
                    {this?.props?.dataa?.cPincode}{" "}
                  </b>
                </p>
                <div>
                  <table className={styles.table}></table>
                  <br />

                  <p>
                    <b>
                      Total Cash received Rs   <b>{this?.props?.dataa?.applicableCharages[0]?.totalAmount}</b>
                      -/(रु)
                    </b>
                  </p>
                </div>
              </p>
              <div className={styles.bottomContainer}>
                <div className={styles.signature}>
                  <h4>Authority Signature</h4>
                  <div className={styles.canvaSign}></div>
                  <h4>Officer Municipal Corporation</h4>
                </div>
              </div>
              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>Pimpri Chinchwad Municipal Corporation </h5>
                  <h5>Mumbai-Pune Highway Pimpri, Pune</h5>
                  <h5>Maharashtra, India</h5>
                </div>
                <div className={styles.add1}>
                  <h5>Phone Number:91-020-2742-5511/12/13/14</h5>
                  <h5>
                    email: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
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
