import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import router, { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "./goshwara.module.css";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import { Controller, useFormContext } from "react-hook-form";
import { timelineItemClasses } from "@mui/lab";
import { ja } from "date-fns/locale";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  const componentRef = useRef();

  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "Sanction-Letter.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };

    // const element = ReactDOMServer.renderToString(<ComponentToPrint data={data} ref={componentRef} />);
    const element = ReactDOMServer.renderToString(
      <ComponentToPrint dataa={dataa} ref={componentRef} />
    );
    // console.log("ggggggg", html2pdf().set(opt).from(element));
    let base64str;
    html2pdf()
      .from(element)
      .toPdf()
      .set(opt)
      .output("datauristring")
      // .then(function (pdfAsString) {
      //   console.log("pdfAsString", pdfAsString);
      //   var file = dataURLtoFile(pdfAsString, "final-bill.pdf");
      //   console.log(file);
      //   let formData = new FormData();
      //   formData.append("file", file);
      //   formData.append("appName", "NRMS");
      //   formData.append("serviceName", "N-BS");
      //   formData.append("fileName", "bill.pdf");
      //   axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
      //     console.log(r.data.filePath);
      //   });
      // });
      .save();
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const router = useRouter();
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [datetime, setDatetime] = useState([]);
  const [venueNames, setVenueNames] = useState([]);
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

  const getDateTime = () => {
    axios
      .get(`${urls.SPURL}/master/slotDetails/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("11", r);
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
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    console.log("applicableCharages", applicableCharages);
  }, [applicableCharages]);

  useEffect(() => {
    getFacilityName();
    getVenueNames();
    getDateTime();
  }, [dataa]);
  const [dataa, setDataa] = useState(null);
  const [applicableCharages, setApplicableCharages] = useState([]);

  useEffect(() => {
    if (router?.query?.applicationId) {
      axios
        .get(
          `${urls.SPURL}/sportsBooking/getById?id=${router?.query?.applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("564", res);
          setApplicableCharages(res?.data?.applicableCharages);
          const tempData = res?.data;

          const _res = {
            ...tempData,
            facilityName: facilityNames?.find(
              (obj) => obj?.id == tempData?.facilityName
            )?.facilityName,
            venue: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
            fromBookingTime: datetime?.find(
              (obj) => obj?.id == tempData?.bookingTimeId
            )?.fromBookingTime,
            toBookingTime: datetime?.find(
              (obj) => obj?.id == tempData?.bookingTimeId
            )?.toBookingTime,
          };
          setDataa(_res);

          console.log("Sports data", _res);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [venueNames, datetime, facilityNames]);

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
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={() => {
            router.push({
              pathname: "/sportsPortal/transaction/sportBooking/SanctionLetter",
              query: {
                ...router?.query,
              },
            });
          }}
        >
          {language == "en" ? "View Sanction Letter" : "मंजुरी पत्र पहा"}
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
                // router.push({
                //   pathname:
                //     "/sportsPortal/transaction/sportBooking/SanctionLetter",
                //   query: {
                //     ...router?.query,
                //   },
                // });
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

class ComponentToPrint extends React.Component {
  render() {
    console.log(
      "this?.props?.dataa?.fromBookingTime",
      this?.props?.dataa?.fromBookingTime
    );
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
                {/* <h5>(महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८)</h5> */}
              </h2>
            </div>

            <div className={styles.two}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>अर्जाचा क्रमांक :</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b> {this?.props?.dataa?.applicationNumber}</b>
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}> अर्ज दिनांक :</h4>{" "}
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

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}> Applicant Name :</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " + this?.props?.dataa?.firstName}
                      {" " + this?.props?.dataa?.middleName}
                      {" " + this?.props?.dataa?.lastName}
                    </b>
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}> Venue Name :</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b> {" " + this?.props?.dataa?.venue}</b>
                  </h4>
                  {/* <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b> निवडलेला स्लॉट: 
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.bookingId}</h4> */}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}> Selected Month:</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {moment(
                        this?.props?.dataa?.fromDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}{" "}
                    </b>{" "}
                  </h4>
                  {" "}To{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {moment(
                        this?.props?.dataa?.toDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}{" "}
                    </b>
                  </h4>
                  <h4 style={{ marginLeft: "40px" }}> </h4>{" "}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}> Selected Slot:</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b> {" " + this?.props?.dataa?.fromBookingTime} </b>-{" "}
                    <b>{" " + this?.props?.dataa?.toBookingTime}</b>
                  </h4>
                  {/* <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.bookingTimeId} </h4> */}
                  {/* <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.}</h4> */}
                </div>
              </div>

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
                          <td colSpan={4}>{this?.props?.dataa?.facilityName}</td>
                          <td colSpan={4}>{this?.props?.dataa?.totalAmount}</td>
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
                            <b>एकूण रक्कम : {this?.props?.dataa?.amount} रु .</b>
                          </td>
                        </tr>
                      </tbody>
                    </table> */}
                    {this?.props?.dataa?.bookingType === "Individual" && (
                      <table id="table-to-xls" className={styles.report_table}>
                        <thead>
                          <tr>
                            <th colSpan={2}>अ.क्र</th>
                            <th colSpan={8}>शुल्काचे नाव</th>
                            <th colSpan={2}>रक्कम (रु)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={4}>1)</td>
                            <td colSpan={4}>
                              {this?.props?.dataa?.applicableCharages?.map(
                                (charge, index) => {
                                  return (
                                    <td colSpan={4}>
                                      <b>{charge.chargeTypeName}</b>
                                    </td>
                                  );
                                }
                              )}
                            </td>

                            <>
                              {this?.props?.dataa?.applicableCharages?.map(
                                (charge, index) => {
                                  console.log("serviceChargeId1212", charge);
                                  return (
                                    <td colSpan={4}>{charge.amountPerHead}</td>
                                  );
                                }
                              )}
                            </>
                          </tr>

                          <tr>
                            <td colSpan={4}>
                              <b></b>
                            </td>
                            <td colSpan={4}>
                              <b>एकूण रक्कम : </b>
                            </td>
                            <td colSpan={4}>
                              <b>
                                {this?.props?.dataa?.applicableCharages?.map(
                                  (charge, index) => {
                                    console.log("serviceChargeId1212", charge);
                                    return (
                                      <td colSpan={4}>{charge.totalAmount}</td>
                                    );
                                  }
                                )}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {this?.props?.dataa?.bookingType === "Group" && (
                      <>
                        {" "}
                        <table
                          id="table-to-xls"
                          className={styles.report_table}
                        >
                          <thead>
                            <tr>
                              <th colSpan={5}>अ.क्र</th>
                              <th colSpan={10}>सदस्याचे नाव</th>
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
                              {/* <td colSpan={10}>
                                {this?.props?.dataa?.sportsBookingGroupDetailsDao?.map(
                                  (applicant, index) => {
                                    return (
                                      <>
                                        <b>{applicant.applicantFirstName}</b>
                                      </>
                                    );
                                  }
                                )}
                              </td> */}
                              {/* <td colSpan={10}>
                                {this?.props?.dataa?.totalGroupMember + 1}
                              </td> */}
                              {/* this?.props?.dataa?.totalGroupMember */}
                              {/* <td colSpan={4}></td> */}
                              {/* <td colSpan={10}>
                                {this?.props?.dataa?.applicableCharages?.map(
                                  (charge, index) => {
                                    return <>{charge.amountPerHead}</>;
                                  }
                                )}
                              </td> */}
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
                                        <b>
                                          {applicant.applicantFirstName}{" "}
                                          {applicant.applicantMiddleName}{" "}
                                          {applicant.applicantLastName}
                                        </b>
                                      </td>
                                    </>
                                  );
                                }
                              )}
                            </tr> */}

                            {/* <tr>
                              <td colSpan={25}>
                                <b>एकूण रक्कम : </b>
                              </td>
                              <td colSpan={10}>
                                <b>
                                  {this?.props?.dataa?.applicableCharages?.map(
                                    (charge, index) => {
                                      console.log(
                                        "serviceChargeId1212",
                                        charge
                                      );
                                      return <>{charge.totalAmount}</>;
                                    }
                                  )}
                                </b>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                        <table
                          id="table-to-xls"
                          className={styles.report_table}
                        >
                          <thead>
                            <tr>
                              <th colSpan={5}>अ.क्र</th>
                              <th colSpan={10}>शुल्काचे नाव</th>
                              <th colSpan={10}>एकूण संख्या</th>
                              <th colSpan={10}>प्रत्येकी रक्कम (रु)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={5}>1)</td>
                              <td colSpan={10}>
                                {this?.props?.dataa?.applicableCharages?.map(
                                  (charge, index) => {
                                    return (
                                      <>
                                        <b>{charge.chargeTypeName}</b>
                                      </>
                                    );
                                  }
                                )}
                              </td>
                              <td colSpan={10}>
                                {this?.props?.dataa?.totalGroupMember + 1}
                              </td>
                              {/* this?.props?.dataa?.totalGroupMember */}
                              {/* <td colSpan={4}></td> */}
                              <td colSpan={10}>
                                {this?.props?.dataa?.applicableCharages?.map(
                                  (charge, index) => {
                                    return <>{charge.amountPerHead}</>;
                                  }
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td colSpan={25}>
                                <b>एकूण रक्कम : </b>
                              </td>
                              <td colSpan={10}>
                                <b>
                                  {this?.props?.dataa?.applicableCharages?.map(
                                    (charge, index) => {
                                      console.log(
                                        "serviceChargeId1212",
                                        charge
                                      );
                                      return <>{charge.totalAmount}</>;
                                    }
                                  )}
                                </b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    )}
                    <br />
                    खेळ आरक्षित झालेल्याचा दिनांक:{" "}
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.applicationDate,
                          "YYYY-MM-DD"
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.marriageDate} */}व खेळ आरक्षित
                    आकारण्यात येणारे शुल्क
                  </b>
                  <b> एकूण फी</b> &nbsp;
                  {/* <b>{this?.props?.dataa?.loi?.amount}</b> */}
                  <b>
                    {this?.props?.dataa?.applicableCharages?.map(
                      (charge, index) => {
                        console.log("serviceChargeId1212", charge);
                        return <>{charge.totalAmount}</>;
                      }
                    )}{" "}
                    रु .
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
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
                </div>
                <div className={styles.logo1}>
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
