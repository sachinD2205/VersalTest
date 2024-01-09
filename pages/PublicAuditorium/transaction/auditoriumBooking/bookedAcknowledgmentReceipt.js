import { Button, Grid } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "./bookedAcknowledgmentReceipt.module.css";
import { toast } from "react-toastify";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const BookedAcknowledgmentReceipt = () => {
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
  const [loading, setLoading] = useState(false);
  const [_loggedInUser, set_LoggedInUser] = useState(null);
  const [auditoriums, setAuditoriums] = useState([]);
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
    getAuditorium();
  }, []);
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const isDeptUser = useSelector(
    (state) => state?.user?.user?.userDao?.deptUser
  );

  const [showData, setShowData] = useState();

  const componentRef = useRef(null);
  const router = useRouter();
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  let _daata;

  useEffect(() => {
    console.log("router?.query", router?.query);
    if (router?.query?.showData) {
      let data = router?.query?.showData && JSON.parse(router?.query?.showData);
      axios
        .get(
          `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${data?.applicationNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("respinse", res);
          setShowData(res?.data);
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    } else {
      // _daata = router?.query && router?.query;
      // console.log("respinse11", _daata && _daata);
      // _daata && setShowData(_daata);

      axios
        .get(
          `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${router?.query?.applicationNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("respinse", res);
          setShowData(res?.data);
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
  }, [auditoriums]);

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe 4Au", r);
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

  return (
    <>
      <div>
        <ComponentToPrint
          ref={componentRef}
          data={showData}
          auditoriums={auditoriums}
        />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          size="small"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          size="small"
          variant="contained"
          color="error"
          onClick={() => {
            swal({
              title: language == "en" ? "Exit?" : "बाहेर पडायचे?",
              text:
                language == "en"
                  ? "Are you sure you want to exit ? "
                  : "तुम्हाला खात्री आहे की तुम्ही बाहेर पडू इच्छिता?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                // swal("Record is Successfully Exit!", {
                //   icon: "success",
                // });
                // router.push("/PublicAuditorium/transaction/bookedPublicAuditorium");
                if (
                  router?.query?.showData &&
                  router?.query?.user != "CFC_USER"
                ) {
                  router.push(`/dashboardV3`);
                } else if (
                  _loggedInUser == "cfcUser" &&
                  router?.query?.user == "CFC_USER"
                ) {
                  router.push(`/CFC_Dashboard`);
                } else {
                  // isDeptUser
                  //   ? router.push(
                  //       `/PublicAuditorium/transaction/bookedPublicAuditorium`
                  //     )
                  //   :
                  router.push(`/dashboardV3`);
                }
              } else {
                // swal("Record is Safe");
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
// class component To Print
class ComponentToPrint extends React.Component {
  render() {
    console.log("props", this.props);
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src="/logo.png" alt="" height="80vh" width="80vw" />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h2>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="80vh"
                  width="80vw"
                />
              </Grid>
            </Grid>
            <div>
              <h2 className={styles.heading}>
                <b>प्रेक्षागृह बुकिंग आदेश</b>
              </h2>
            </div>

            <div
              className={styles.two}
              style={{
                marginTop: "2vh",
                marginLeft: "5vh",
                marginRight: "5vh",
              }}
            >
              <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "" }}>
                    {" "}
                    <b>एलओआय क्र : {}</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {this?.props?.data?.LoiNo
                        ? this?.props?.data?.LoiNo
                        : "-"}
                    </b>
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
                        moment(this?.props?.data?.applicationDate).format(
                          "DD-MM-YYYY"
                        )}
                    </b>{" "}
                    {/* <b>{router?.query?.appointmentDate}</b> */}
                  </h4>
                </div>
              </div>
              <div className={styles.date2}>
                <h4>अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.applicationNumber}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " +
                      moment(this?.props?.data?.applicationDate).format(
                        "DD-MM-YYYY"
                      )}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
                </h4>
              </div>

              <p>
                <b>
                  <h3>प्रति,</h3>
                  <div className={styles.date2}>
                    <h3 style={{ marginLeft: "15px" }}>
                      {this?.props?.data?.applicantName}
                      <br></br>
                      {this?.props?.data?.applicantFlatHouseNo}
                      {" ,"}
                      {this?.props?.data?.applicantFlatBuildingName}
                      {" ,"}
                      {this?.props?.data?.applicantLandmark} {","}
                      {this?.props?.data?.applicantArea} {","}
                      {/* <br></br> */}
                      {this?.props?.data?.applicantCity} {","}
                      {this?.props?.data?.applicantState}
                      {","}
                      {this?.props?.data?.applicantPinCode}
                      {"."}
                    </h3>
                  </div>
                  <p>
                    <b>
                      <h3 style={{ paddingLeft: "10%", fontWeight: 900 }}>
                        विषय :- प्रेक्षागृह बुकिंग आदेश
                      </h3>
                      <h3 style={{ paddingLeft: "10%" }}>
                        संदर्भ :- आपला अर्ज क्र{" "}
                        {this?.props?.data?.applicationNumber}, दिनांक -{" "}
                        {" " +
                          moment(this?.props?.data?.applicationDate).format(
                            "DD-MM-YYYY"
                          )}
                        ,
                      </h3>
                    </b>
                  </p>
                  महोदय/महोदया,
                  <br /> आपल्या वरील संदर्भीय अर्जान्वये केलेली अधिकृत पिंपरी
                  चिंचवड महापालिकेच्या सार्वजनिक प्रेक्षागृह / नाट्यगृह बुकिंग
                  ची विनंती यशस्वीरित्या मान्य झाली आहे.
                </b>
              </p>

              <div className={styles.date2}>
                {this?.props?.data?.bookingFor ==
                "Booking For PCMC Employee" ? (
                  ""
                ) : (
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {`* ₹${Number(this?.props?.data?.depositAmount)?.toFixed(
                        2
                      )} Deposit Paid on ${moment(
                        this?.props?.data?.paymentDao?.depositePayDate
                      ).format("DD/MM/YYYY")} with transaction id = ${
                        this?.props?.data?.paymentDao?.pgDepositeKey
                      }.`}
                    </b>
                  </h4>
                )}
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {`* ₹${Number(this?.props?.data?.rentAmount)?.toFixed(
                      2
                    )} Rent Paid on ${moment(
                      this?.props?.data?.paymentDao?.rentPayDate
                    ).format("DD/MM/YYYY")} with transaction id = ${
                      this?.props?.data?.paymentDao?.pgBookingKey
                    }.`}
                  </b>
                </h4>
                {console.log("77", this?.props?.data)}
              </div>
              <div className={styles.date2}>
                <h4>कार्यक्रमाचे नाव:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.eventTitle}</b>
                </h4>
              </div>
              <div className={styles.date2}>
                <h4>प्रेक्षागृह / नाट्यगृह नाव:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {this?.props?.auditoriums.length > 0
                      ? this?.props?.auditoriums?.find((obj) => {
                          return obj?.id == this?.props?.data?.auditoriumId;
                        })?.auditoriumNameMr
                      : "-"}
                  </b>
                </h4>
              </div>
              {this?.props?.data?.timeSlotList &&
                JSON?.parse(this?.props?.data?.timeSlotList)?.map((val) => {
                  return (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div className={styles.date2}>
                        <h4>कार्यक्रमाची तारीख:</h4>{" "}
                        <h4 style={{ marginLeft: "10px" }}>
                          <b>{moment(val?.bookingDate).format("DD/MM/YYYY")}</b>
                        </h4>
                        <h4 style={{ marginLeft: "10px" }}>
                          <b></b>
                        </h4>
                      </div>
                      <div className={styles.date2}>
                        <h4>कार्यक्रमाची वेळ:</h4>{" "}
                        <h4 style={{ marginLeft: "10px" }}>
                          <b>
                            {val?.fromTime} To {val?.toTime}
                          </b>
                        </h4>
                        <h4 style={{ marginLeft: "10px" }}>
                          <b></b>
                        </h4>
                      </div>
                      <div className={styles.date2}>
                        <h4>कार्यक्रमाचा दिवस:</h4>{" "}
                        <h4 style={{ marginLeft: "10px" }}>
                          <b>{moment(val?.bookingDate).format("dddd")}</b>
                        </h4>
                      </div>
                    </div>
                  );
                })}

              {/* <div className={styles.date2}>
                <h4>नियोजित तास:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {
                      this?.props?.auditoriums?.find((obj) => {
                        return obj?.id == this?.props?.data?.auditoriumId;
                      })?.auditoriumNameMr
                    }
                  </b>
                </h4>
              </div> */}

              <hr></hr>
              <h3
                style={{
                  color: "red",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <b>रंगमंदिर वापराबाबत अटी व शर्ती</b>
              </h3>
              <div>
                <h4>
                  १) कार्यक्रमाचे आरक्षण अनामत रक्कम भरुन घेउन करणेत येईल. मात्र
                  किमान १५ दिवस अगोदर भाडे जमा केल्यानंतरच कार्यक्रमाचे आरक्षण
                  निश्चीत होईल. कार्यक्रम / रंगीत तालमीपूर्वी अर्जदाराने
                  कार्यक्रमाचे भाडे न भरल्यास जमा केलेली अनामत रक्कम जप्त
                  करण्यात येईल.
                </h4>

                <h4>
                  2) विजबिल व इतर साहित्य / आकार (उपलब्धतेनुसार) कार्यक्रमाचे
                  दिवशी भरावा लागेल.
                </h4>

                <h4>
                  3) पोलीस परवान्याची प्रत कार्यक्रमाच्या १५ दिवस अगोदर किवा
                  भाडे भरताना नाट्यगृहात जमा करणे बंधनकारक राहील अन्यथा
                  कार्यक्रम रद्द करण्यात येईल (आदेशावरुन)
                </h4>

                <h4>
                  ४) करमणूक कर अधिकारी कार्यालय पुणे, धर्मादाय आयुक्त नोंदणी
                  प्रमाणपत्र, तिकीट सेलिंग परवाना, नाट्यप्रयोगास लेखकाचे परवानगी
                  पत्र इ. परवाने कार्यक्रमाच्या तीन दिवस अगोदर व्यवस्थापकास
                  दाखवण्यात यावेत, याबात कायदेशीर बाबी निर्माण झाल्यास त्याची
                  जबाबदारी अर्जदारावर राहील.
                </h4>

                <h4>५) रंगमंदिरात स्वयंपाक करता येणार नाही.</h4>

                <h4>
                  ६) अपवादात्मक परिस्थितीत वातानुकूलित यंत्रणा (AC) बंद पडल्यास
                  बाहेरून पंखे आणण्याची जबाबदारी अर्जदाराची राहील.
                </h4>

                <h4>
                  ७) शक्य असल्यास कार्यक्रमाच्या पूर्व तयारी साठी एक तास अगोदर
                  रंगमंदिर उपलब्ध करुन देण्यात येईल. मात्र कार्यक्रमानंतर
                  रंगमंदिर सोडण्यास अर्ध्या तासापेक्षा जास्त वेळ झाल्यास
                  त्यानुसार जादा भाडे आकारण्यात येईल.
                </h4>

                <h4>
                  ८) रंगित तालीम साठी वातानुकूलित यंत्रणा (AC) असणार नाही.
                </h4>

                <h4>
                  ९) रंगमंदिर ज्या अर्जदारास वापरावयास परवानगी दिली आहे अशा
                  अर्जदारास व्यवस्थापकाच्या परवानगी शिवाय दुसऱ्याच्या नावे
                  दिलेली परवानगी वर्ग करता येणार नाही.
                </h4>

                <h4>
                  १०) रंगमंदिर ताब्यात दिलेपासून ते रिकामे करून देई पर्यंतच्या
                  वेळेत रंगमंदिरात थुंकणे, धुम्रपान करणे, बेशिस्त किंवा
                  अक्षेपार्ह वर्तन केल्याचे निदर्शणास आल्यास तसेच रंगमंदिरातील
                  साधनसामग्रीची खराबी किंवा नुकसाण झाल्यास, नुकसान भरपाई
                  भरण्याची जबाबदारी अर्जदाराची राहील.
                </h4>

                <h4>
                  ११) कार्याक्रमाच्या पाच दिवस अगोदर अपरिहार्य कारणासाठी कारण न
                  देता दिलेली तारीख रद्द करण्याचा अधिकार व्यवस्थापकास राहील. व
                  या कामी अर्जदारास कोणत्याही प्रकारची नुकसान भरपाई देण्यात
                  येणार नाही.
                </h4>
                <h4>
                  १२) तीन महिने अगोदर बुकींग सुरु राहील. दर महिना पुढील महिने
                  समाविष्ट होत जातील.
                </h4>
                <h4>१३) नाटयगृहाचे भाडे १५ दिवस अगोदर भरावे.</h4>
                <h4>
                  १४) सदर नाटयगृह भाडे भरल्यानंतर संयोजकाने कार्यक्रम किंवा
                  बुकींग रदद केल्यास त्यांना नाटयगृह भाडे परत देता येणार नाही.
                </h4>
                <h4>
                  १५) काही कारणास्तव महापालिकेचे किंवा शासनाचे कार्यक्रमासाठी
                  नाटयगृहाची आवश्यकता असलेस सदर संयोजकांचे बुकींग रदद करून,
                  त्यावेळचे संयोजकाने भरलेले भाडे संयोजकांना परत करणेत येईल.
                  किंवा सदर भाडयामध्ये पुढील आवश्यकतेनुसार पुढील उपलब्ध तारीख
                  देणेत येईल.
                </h4>
                <h4>
                  १६) मनपाचे किंवा शासकीय विभागाचे कार्यक्रमाच्या बुकींगच्या
                  वेळी संबंधित विभागाचे अधिकृत पत्र अधिका-यांचे सही शिक्क्यानिशी
                  नाटयगृहामध्ये देणे, त्याचवेळी बुकींग होईल.
                </h4>
                <h4>
                  १७) मनपाच्या कार्यक्रमास व शासकीय विभागांच्या कार्यक्रमास
                  अनामत रक्कम भरणेची आवश्यकता नाही.
                </h4>
                <h4>
                  १८) एक व्यक्ती किवा संस्था/नाटयसंस्थासहीत/शाळा यांना एका दिवशी
                  एकच शो बुकींग करू शकतात. सलग जादा शो करावयाचे असल्यास, यांनी
                  तासाप्रमाणे सलग बुकींग करणे आवश्यक राहील.
                </h4>
                <h4>
                  १९) रंगीत तालमीसाठी बुकींग करणा-या संस्थेस कलाकार व सहकारी
                  व्यक्ती यांचे संख्येची मर्यादा ३५ पर्यंत आहे.
                </h4>
                <h4>
                  २०) रंगीत तालमीसाठी बुकींग करताना संयोजकांनी / संस्थेनी बुकींग
                  फॉर्म मध्ये व्यक्तींची संख्या नमूद करणे आवश्यक आहे. ३५ पेक्षा
                  जास्त व्यक्ती असल्यास अर्जदारास रंगीत तालमीची बुकींग करता आली
                  नाही पाहीजे.
                </h4>
                <h4>
                  २१) अनामत रक्कम जी जास्त आहे ती भरल्यास सर्व कार्यक्रमासाठी
                  ग्राह्य धरणेत येईल.
                </h4>
                <h4>
                  २२) अर्ज प्रक्रियेदरम्यान इव्हेंटचा प्रकार बदलता येणार नाही.
                </h4>
                <h4>
                  २३) पिंपरी चिंचवड महानगरपालिका जीएसटी क्रमांक -
                  27AAALM0464E1ZB
                </h4>
                <h4>
                  २४) प्रेक्षागृह / नाट्यगृह सकाळी ०९.०० ते रात्री १२.०० या
                  वेळेपर्यंत वापरण्यासाठी उपलब्ध असेल .रात्री १२.०० वाजेनंतर
                  कोणत्याही कार्यक्रमास परवानगी दिली जाणार नाही.
                </h4>
                <h4>
                  २५) बुकींग जास्तीत जास्त ३ महिने आधी स्विकारले जाईल. तसेच
                  बुकींग/ प्रेक्षागृह आरक्षण करतेवेळी संपूर्ण अनामत रक्कम भरणे
                  आवश्यक आहे. तोंडी बुकींग स्विकारले जाणार नाही.
                </h4>
                <h4>
                  २६) आयोजकाने कार्यक्रमापूर्वी १५ दिवस अगोदर भाडयाची संपूर्ण
                  रक्कम भरणे आवश्यक आहे. असे न केलेस बुकींग रदद होईल आणि तसेच
                  अनामत रकमेतून नियमाप्रमाणे रक्कम कपात/शुल्क वसुल करणेत येईल.
                </h4>
                <h4>
                  २७) लहान नाटयगृह / बहुददेशीय हॉलचे शुल्क मुख्य सभागृह
                  शुल्काच्या ३०% असेल.
                </h4>
                <h4>
                  २८) रंगीत तालीम दरम्यान कोणतेही निमंत्रित किंवा तिकीट घेतलेले
                  प्रेक्षक उपस्थित नसावेत.असे झाल्यास मुख्य कार्यक्रमाचे लागू
                  असलेले संपूर्ण शुल्क आकारले जाईल. तसेच रंगीत तालीमसाठी
                  कलाकारांसह फक्त 35 लोकांनाच प्रवेश असेल.
                </h4>
                <h4>
                  २९) सदर अनामत ,भाडे व इतर भाडे यामध्ये प्रतिवर्ष मागील
                  वर्षीच्या दरामध्ये ०१ एप्रिल रोजी १० % भाडेवाढ करणे. प्रथमची
                  भाडेवाढ दि. ०१/०४/२०२५ पासून केली जाईल.सदरच्या भाडेवाढीची
                  रक्कम नजीकची पुर्णांकित रकमेत घेतली जाईल.
                </h4>
                <h4>
                  ३०) पिंपरी चिंचवड महानगरपालिकेच्या कार्यक्रमास नाटयगृह
                  भाड्यामध्ये 50 % सवलत राहील.
                </h4>
                <h4>
                  ३१) इतर शासकीय विभागांच्या कार्यक्रमासाठी नाटयगृह भाड्यामध्ये
                  30% सवलत राहील.
                </h4>
                <h4>
                  ३२) कार्यक्रम वेळेत संपविणे बंधनकारक राहील. क्रचित प्रसंगी
                  काही कारणास्तव कार्यक्रमाची संपण्याची वेळ मर्यांदा ओलांडून जात
                  असल्यास व्यवस्थापकांची परवानगी घेणे बंधनकारक आहे. व त्याकरीता
                  १० मिनिटांपासून वेळ पुढे गेल्यास १ तासाचे भाडे आकारण्यात येईल.
                </h4>
                <h4>
                  ३३) कार्यक्रम आयोजकांना जादा वेळेसाठी प्रेक्षागृह/नाटयगृह
                  आरक्षित करावयाचे असल्यास, उपरोक्त भाडेदरानुसार तासी भाडेदरा
                  प्रमाणे एकूण तासांचे भाडेदर आकारले जाईल.
                </h4>
                <h4>
                  ३४) पिंपरी चिंचवड महानगरपालिका नाटयगृह,प्रेक्षागृह वापराबाबतचे
                  धोरणानुसार नियम, अटी व शर्ती लागू राहतील.
                </h4>
                <h4>
                  ३५) प्रेक्षागृह/नाटयगृह कोणालाही (पिंचिमनपा/शासकीय
                  कार्यालयासह) विनामूल्य/मोफत देता येणार नाही.
                </h4>
              </div>
              <p>
                <b>
                  टीप - सार्वजनिक प्रेक्षागृह बुकिंग पावती मध्ये काही त्रुटी
                  आढळल्यास सदर माहिती संबंधित कार्यालयास कळवण्यात यावी.
                  (पिं.चिं.मनपा हेल्पलाइन क्रमांक - 8888006666)
                </b>
              </p>

              <hr />

              <Grid container>
                <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>
                    इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img src="/qrcode1.png" alt="" height="50vh" width="50vw" />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img src="/barcode.png" alt="" height="35vh" width="60vw" />
                </Grid>
              </Grid>

              {/* <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </div>
                <div className={styles.add1}>
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
                </div>
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                </div>
                <div className={styles.logo1}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default BookedAcknowledgmentReceipt;
