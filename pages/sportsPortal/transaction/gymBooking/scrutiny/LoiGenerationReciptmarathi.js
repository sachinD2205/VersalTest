import { Button } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import styles from "./LoiGenerationRecipt.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
const LoiGenerationRecipt = () => {
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

  const [applicableCharages, setApplicableCharages] = useState([]);

  const [datetime, setDatetime] = useState([]);
  const token = useSelector((state) => state.user.user.token);
  const getDateTime = () => {
    axios.get(`${urls.SPURL}/master/slotDetails/getAll`,{ headers: {
      Authorization: `Bearer ${token}`,
    },
}).then((r) => {
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
  const language = useSelector((state) => state.labels.language);
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
    axios.get(`${urls.SPURL}/venueMasterSection/getAll`,{ headers: {
      Authorization: `Bearer ${token}`,
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
  };

  useEffect(() => {
    getVenueNames();
    getDateTime();
  }, []);

  useEffect(() => {
    getLoiGenerationData();
  }, [venueNames, datetime, router?.query]);

  const getLoiGenerationData = (data) => {
    axios
      .get(
        `${urls.SPURL}/gymBooking/getById?id=${router?.query?.applicationId}`,{ headers: {
          Authorization: `Bearer ${token}`,
        },
    }
      )

      .then((res) => {
        const tempData = res?.data;
        setApplicableCharages(res?.data?.applicableCharages);
        const _res = {
          ...tempData,
          venue: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
          // facilityName: facilityNames?.find(
          //   (obj) => obj?.id == tempData?.facilityName
          // )?.facilityName,
          fromBookingTime: datetime?.find(
            (obj) => obj?.id == tempData?.bookingTimeId
          )?.fromBookingTime,
          toBookingTime: datetime?.find(
            (obj) => obj?.id == tempData?.bookingTimeId
          )?.toBookingTime,
        };
        setdata(_res);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    if (applicableCharages) {
      let total = 0;
      applicableCharages.map((charge) => {
        total = total + charge.amountPerHead;
      });
      setSum(total);
      console.log("Total Sum ", total);
    }
  }, [applicableCharages]);

  const [data, setdata] = useState();
  const [sum, setSum] = useState();
  useEffect(() => {
    console.log("useEffect");
    getLoiGenerationData();
  }, []);
  const user = useSelector((state) => state?.user.user);

  const componentRef = useRef(null);
  const router = useRouter();

  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "Sanction-Letter.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };

    const element = ReactDOMServer.renderToString(
      <ComponentToPrint data={data} sum={sum} ref={componentRef} />
    );
    let base64str;
    html2pdf().from(element).toPdf().set(opt).output("datauristring").save();
  };

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("router?.query", router?.query);
    reset(router?.query);
  }, []);

  // View
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={data} sum={sum} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={printHandler}
        >
          {/* Download */}
          <FormattedLabel id="download" />
        </Button>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          {/* print */}
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            language == "en"
              ? swal("Are you sure you want to exit this Record ? ")
              : swal(
                  "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?"
                )
                  // swal({
                  //   title: "Exit?",
                  //   text: "Are you sure you want to exit this Record ? ",
                  //   icon: "warning",
                  //   buttons: true,
                  //   dangerMode: true,
                  // })
                  .then((willDelete) => {
                    if (willDelete) {
                      {language == "en"
                        ? swal("Record is Successfully Exit!")
                        : swal("रेकॉर्ड यशस्वीरित्या बाहेर पडा!");}
                      // swal("Record is Successfully Exit!", {
                      //   icon: "success",
                      // });
                      router.push(
                        "/sportsPortal/transaction/gymBooking/scrutiny"
                      );
                    } else {
                      language == "en"
                        ? swal("Record is Safe")
                        : swal("रेकॉर्ड सुरक्षित आहे");
                      // swal("Record is Safe");
                    }
                  });
          }}
        >
          {/* Exit */}
          <FormattedLabel id="exit" />
        </Button>
      </div>
    </>
  );
};
// class component To Print
class ComponentToPrint extends React.Component {
  render() {
    console.log(this.props.data, "props");
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
                <b>सेवा स्वीकृती पत्र</b>
              </h2>
            </div>

            <div className={styles.two}>
              <p>
                <b>
                  <h3>प्रती, {this?.props?.data?.applicantName}</h3>
                  <br></br> &ensp; तुमच्याकडे {this?.props?.data?.serviceName}{" "}
                  या सेवेसाठी नागरिक सेवा पोर्टलवर कृपया तुमची रक्कम रुपये:{" "}
                  {this?.props?.data?.loi?.amount} <br />
                  निश्चित करा आणि केलेल्या सेवेची रक्कम/शुल्क भरा.
                  <br /> किंवा जवळील पिंपरी चिंचवड महानगरपलिका विभागीय
                  कार्यालयाला भेट द्या .<br></br>
                </b>
              </p>
              <div className={styles.date2}>
                <h4>LOI No. : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.loiNo}
                </h4>
              </div>

              <div className={styles.date2}></div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम (रु)</th>
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.data?.applicableCharages?.map((r, i) => (
                    <tr>
                      <td colSpan={4}>{i + 1}</td>

                      <td colSpan={4}>{r.chargeTypeName}</td>

                      <td colSpan={4}>{r.amountPerHead}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>एकूण रक्कम : </b>
                    </td>
                    <td colSpan={4}>
                      <b>{this?.props?.sum}</b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4>अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b> {this?.props?.data?.applicationNumber}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " +
                      moment(
                        this?.props?.data?.applicationDate,
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")}
                  </b>{" "}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>ठिकाण :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.venue}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>वेळ:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {this?.props?.data?.fromBookingTime} -{" "}
                    {this?.props?.data?.toBookingTime}{" "}
                  </b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>कालावधी:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {moment(
                      this?.props?.data?.fromDate,
                      "YYYY-MM-DD HH:mm:ss A"
                    ).format("DD-MM-YYYY")}{" "}
                    To{" "}
                    {moment(
                      this?.props?.data?.toDate,
                      "YYYY-MM-DD HH:mm:ss A"
                    ).format("DD-MM-YYYY")}{" "}
                  </b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचा पत्ता : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {this?.props?.data?.cAddress}
                    {" ,"}
                    <br></br> {this?.props?.data?.cCityName} {","}
                    {this?.props?.data?.cState}
                    {","}
                    {this?.props?.data?.cPincode}{" "}
                  </b>
                </h4>
              </div>

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

export default LoiGenerationRecipt;
