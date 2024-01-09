import { Button } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import router from "next/router";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import styles from "../swimmingPoolM/scrutiny/SanctionLetter/payment9.module.css";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { DecryptData, EncryptData } from "../../../../components/common/EncryptDecrypt";

const Index = (props) => {
  const router = useRouter();
  const componentRef = useRef(null);
  const [facilityNames, setFacilityNames] = useState([]);
  const token = useSelector((state) => state.user.user.token);
  const [photo, setPhoto] = useState();
  const [datetime, setDatetime] = useState([]);
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

  const [id, setid] = useState();
  const [datta, setDatta] = useState();
  const getData = () => {
    console.log("asdsdf");
    if (id) {
      axios
        .get(`${urls.SPURL}/swimmingPool/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log("54332313456", r?.data);
          if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
            console.log("Data", r?.data?.attachmentList[1].filePath);
            getIcardPhoto(r?.data?.attachmentList[1].filePath);
            const tempData = r?.data;

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
            };

            console.log("getbyId", _res);

            setDatta(_res);
            // setDatta(r?.data);
            if (
              localStorage.getItem("applicationRevertedToCititizen") == "true"
            ) {
              // setValue("disabledFieldInputState", false);
            } else {
              // setValue("disabledFieldInputState", true);
            }
          } else {
          }
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
    } else {
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

  useEffect(() => {
    console.log("hgvghfv", router.query.applicationId);
  }, []);

  useEffect(() => {
    getFacilityName();
    getZoneKeys();
    getVenueNames();
    getDateTime();
  }, []);

  const data = [
    {
      id: 1,
      name: "Booking Name",
      value: "Sanskar School (upto 12 STD)",
    },
    {
      id: 2,
      name: "Ground Name",
      value: "Manapa Hockey Poligras Ground, Nehru Nagar",
    },
  ];
  const handleExit = () => {
    {
      language == "en"
        ? swal("Exit!", "Successfully Exitted  Payment!", "success")
        : swal("बाहेर पडा!", "पेमेंट यशस्वीरित्या बाहेर पडले!", "success");
    }
    // router.push("/sportsPortal/dashboard");
    router.back();
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
      <ComponentToPrint datta={datta} ref={componentRef} />
    );

    let base64str;
    html2pdf().from(element).toPdf().set(opt).output("datauristring").save();
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("datta", datta);
  }, [datta]);

  const getIcardPhoto = (filePath) => {
    console.log("filePath123", filePath);
    if (filePath != null && filePath != undefined && filePath != "") {

      // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
      const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
      const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`


    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    }
  };
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} datta={datta} photo={photo} />
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
        <Button type="primary" onClick={handlePrint}>
          {language == "en" ? "Print" : "छापा"}
        </Button>
        <Button
          variant="contained"
          type="primary"
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
                handleExit();
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
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
      {console.log("testtt",this.props)}
        <div className={styles.main}>
          <div className={styles.small}>
            {/* <div className={styles.one}>
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
            </div> */}
             <div className={styles.container}>
  <div >
    <div>
      <img src="/logo.png" alt=""  height="90vh" width="90vw"/>
    </div>
  </div>
  <div className={styles.middleNew}>
    <h1>
      <b>पिंपरी चिंचवड महानगरपालिका</b>
    </h1>
  </div>
  <div >
    <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
  </div>
</div>
            <div>
              <h2 className={styles.heading}>
                <b>I-CARD</b>
              </h2>
            </div>

            <div className={styles.two}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.photoCard}>
                  <div>
                    {/* <img
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.datta?.idCard}`}
                      alt="Photo "
                      width={200}
                    ></img> */}
                    <img
                      className={styles.ImageOp}
                      src={`data:image/png;base64,${this?.props?.photo}`}
                      // src={`data:image/png;base64,${this?.props?.attachmentList[1]?.filePath}`}
                      alt=" Photo"
                      // width={200}
                    ></img>
                  </div>
                </div>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>
                      अर्जाचा क्रमांक : {this?.props?.datta?.applicationNumber}
                    </b>
                  </h4>{" "}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>
                      अर्जदाराचे नाव : {this?.props?.datta?.firstName}
                      {""} {this?.props?.datta?.middleName}
                      {""} {this?.props?.datta?.lastName}
                    </b>
                  </h4>{" "}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>मोबाईल नं. : {this?.props?.datta?.mobileNo}</b>
                  </h4>{" "}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>पत्ता: {this?.props?.datta?.cAddress}</b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>
                      कालावधी:{" "}
                      {moment(
                        this?.props?.datta?.fromDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}{" "}
                      To{" "}
                      {moment(
                        this?.props?.datta?.toDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}
                    </b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>ठिकाण: {this?.props?.datta?.venueNames}</b>
                  </h4>{" "}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>
                      वेळ: {this?.props?.datta?.fromBookingTime} To{" "}
                      {this?.props?.datta?.toBookingTime}
                    </b>
                  </h4>{" "}
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
