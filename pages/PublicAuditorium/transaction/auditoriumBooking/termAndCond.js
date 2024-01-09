import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import styles from "../../../../styles/publicAuditorium/transactions/[tnc].module.css";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import ClearIcon from "@mui/icons-material/Clear";
import urls from "../../../../URLS/urls";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import { useEffect } from "react";
const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const [loading, setLoading] = useState(false);
  const [_loggedInUser, set_LoggedInUser] = useState(null);

  useEffect(() => {
    set_LoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  return (
    <>
      <Paper
        sx={{
          "@media (max-width: 750px)": {
            paddingTop: "5%",
          },
          border: "1px solid grey",
        }}
      >
        <div style={{ border: "solid pink" }}>
          <div
            style={{
              backgroundColor: "#3EADCF",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                color: "yellow",
                fontSize: "2.2vw",
              }}
            >
              <b>पिंपरी चिंचवड महानगरपलिका,पिंपरी-४११०१८</b>
            </h1>
            <h3
              style={{
                color: "yellow",
                fontSize: "1.3vw",
              }}
            >
              <b>
                सार्वजनिक प्रेक्षागृह / नाट्यगृह बुकिंग आणि प्रसारण व्यवस्थापन
              </b>
            </h3>
          </div>
          <div>
            <h3
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "red",
              }}
            >
              <b>रंगमंदिर वापराबाबत अटी व शर्ती</b>
            </h3>
          </div>

          <>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div style={{ padding: "10px" }}>
                  <h4>
                    १) कार्यक्रमाचे आरक्षण अनामत रक्कम भरुन घेउन करणेत येईल.
                    मात्र किमान १५ दिवस अगोदर भाडे जमा केल्यानंतरच कार्यक्रमाचे
                    आरक्षण निश्चीत होईल. कार्यक्रम / रंगीत तालमीपूर्वी
                    अर्जदाराने कार्यक्रमाचे भाडे न भरल्यास जमा केलेली अनामत
                    रक्कम जप्त करण्यात येईल.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                      marginRight: "25px",
                    }}
                  >
                    2) विजबिल व इतर साहित्य / आकार (उपलब्धतेनुसार) कार्यक्रमाचे
                    दिवशी भरावा लागेल.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                      marginRight: "25px",
                    }}
                  >
                    <b>
                      3) पोलीस परवान्याची प्रत कार्यक्रमाच्या १५ दिवस अगोदर किवा
                      भाडे भरताना नाट्यगृहात जमा करणे बंधनकारक राहील अन्यथा
                      कार्यक्रम रद्द करण्यात येईल (आदेशावरुन).
                    </b>
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    ४) करमणूक कर अधिकारी कार्यालय पुणे, धर्मादाय आयुक्त नोंदणी
                    प्रमाणपत्र, तिकीट सेलिंग परवाना, नाट्यप्रयोगास लेखकाचे
                    परवानगी पत्र इ. परवाने कार्यक्रमाच्या तीन दिवस अगोदर
                    व्यवस्थापकास दाखवण्यात यावेत, याबात कायदेशीर बाबी निर्माण
                    झाल्यास त्याची जबाबदारी अर्जदारावर राहील.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                      marginRight: "25px",
                    }}
                  >
                    ५) रंगमंदिरात स्वयंपाक करता येणार नाही.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    ६) अपवादात्मक परिस्थितीत वातानुकूलित यंत्रणा (AC) बंद
                    पडल्यास बाहेरून पखे आणण्याची जबाबदारी अर्जदाराची राहील.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    ७) शक्य असल्यास कार्यक्रमाच्या पूर्व तयारी साठी एक तास अगोदर
                    रंगमंदिर उपलब्ध करुन देण्यात येईल. मात्र कार्यक्रमानंतर
                    रंगमंदिर सोडण्यास १० मिनिटांपेक्षा जास्त वेळ झाल्यास
                    त्यानुसार जादा भाडे आकारण्यात येईल.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    ८) रंगित तालीम साठी वातानुकूलित यंत्रणा (AC) असणार नाही.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    ९) रंगमंदिर ज्या अर्जदारास वापरावयास परवानगी दिली आहे अशा
                    अर्जदारास व्यवस्थापकाच्या परवानगी शिवाय दुसऱ्याच्या नावे
                    दिलेली परवानगी वर्ग करता येणार नाही.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    १०) रंगमंदिर ताब्यात दिलेपासून ते रिकामे करून देई पर्यंतच्या
                    वेळेत रंगमंदिरात थुंकणे, धुम्रपान करणे, बेशिस्त किंवा
                    अक्षेपार्ह वर्तन केल्याचे निदर्शणास आल्यास तसेच रंगमंदिरातील
                    साधनसामग्रीची खराबी किंवा नुकसान झाल्यास, नुकसान भरपाई
                    भरण्याची जबाबदारी अर्जदाराची राहील.
                  </h4>

                  <h4
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    ११) कार्याक्रमाच्या पाच दिवस अगोदर अपरिहार्य कारणासाठी कारण
                    न देता दिलेली तारीख रद्द करण्याचा अधिकार व्यवस्थापकास राहील.
                    व या कामी अर्जदारास कोणत्याही प्रकारची नुकसान भरपाई देण्यात
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
                    वेळी संबंधित विभागाचे अधिकृत पत्र अधिका-यांचे सही
                    शिक्क्यानिशी नाटयगृहामध्ये देणे, त्याचवेळी बुकींग होईल.
                  </h4>
                  <h4>
                    १७) मनपाच्या कार्यक्रमास व शासकीय विभागांच्या कार्यक्रमास
                    अनामत रक्कम भरणेची आवश्यकता नाही.
                  </h4>
                  <h4>
                    १८) एक व्यक्ती किवा संस्था/नाटयसंस्थासहीत/शाळा यांना एका
                    दिवशी एकच शो बुकींग करू शकतात. सलग जादा शो करावयाचे असल्यास,
                    यांनी तासाप्रमाणे सलग बुकींग करणे आवश्यक राहील.
                  </h4>
                  <h4>
                    १९) रंगीत तालमीसाठी बुकींग करणा-या संस्थेस कलाकार व सहकारी
                    व्यक्ती यांचे संख्येची मर्यादा ३५ पर्यंत आहे.
                  </h4>
                  <h4>
                    २०) रंगीत तालमीसाठी बुकींग करताना संयोजकांनी / संस्थेनी
                    बुकींग फॉर्म मध्ये व्यक्तींची संख्या नमूद करणे आवश्यक आहे.
                    ३५ पेक्षा जास्त व्यक्ती असल्यास अर्जदारास रंगीत तालमीची
                    बुकींग करता आली नाही पाहीजे.
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
                    २८) रंगीत तालीम दरम्यान कोणतेही निमंत्रित किंवा तिकीट
                    घेतलेले प्रेक्षक उपस्थित नसावेत.असे झाल्यास मुख्य
                    कार्यक्रमाचे लागू असलेले संपूर्ण शुल्क आकारले जाईल. तसेच
                    रंगीत तालीमसाठी कलाकारांसह फक्त 35 लोकांनाच प्रवेश असेल.
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
                    ३१) इतर शासकीय विभागांच्या कार्यक्रमासाठी नाटयगृह
                    भाड्यामध्ये 30% सवलत राहील.
                  </h4>
                  <h4>
                    ३२) कार्यक्रम वेळेत संपविणे बंधनकारक राहील. क्रचित प्रसंगी
                    काही कारणास्तव कार्यक्रमाची संपण्याची वेळ मर्यांदा ओलांडून
                    जात असल्यास व्यवस्थापकांची परवानगी घेणे बंधनकारक आहे. व
                    त्याकरीता १० मिनिटांपासून वेळ पुढे गेल्यास १ तासाचे भाडे
                    आकारण्यात येईल.
                  </h4>
                  <h4>
                    ३३) कार्यक्रम आयोजकांना जादा वेळेसाठी प्रेक्षागृह/नाटयगृह
                    आरक्षित करावयाचे असल्यास, उपरोक्त भाडेदरानुसार तासी भाडेदरा
                    प्रमाणे एकूण तासांचे भाडेदर आकारले जाईल.
                  </h4>
                  <h4>
                    ३४) पिंपरी चिंचवड महानगरपालिका नाटयगृह,प्रेक्षागृह
                    वापराबाबतचे धोरणानुसार नियम, अटी व शर्ती लागू राहतील.
                  </h4>
                  <h4>
                    ३५) प्रेक्षागृह/नाटयगृह कोणालाही (पिंचिमनपा/शासकीय
                    कार्यालयासह) विनामूल्य/मोफत देता येणार नाही.
                  </h4>
                  <h4
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    ३६) आगाऊ बुकिंग वेळापत्रक.
                  </h4>
                  <table
                    style={{
                      width: "100%",
                    }}
                  >
                    <tr>
                      <th
                        className={styles.abcd}
                        style={{
                          "@media (max-width: 750px)": {
                            fontSize: "50px",
                          },
                        }}
                      >
                        Sr.No
                      </th>
                      <th className={styles.abcd}>Booking Date</th>
                      <th className={styles.abcd}>Advance Booking Month</th>
                      <th className={styles.abcd}>Booking Confirmation Date</th>
                    </tr>
                    <tr>
                      <td className={styles.abcd}>1</td>
                      <td className={styles.abcd}>16 Nov To 25 Nov</td>
                      <td className={styles.abcd}>Jan, Feb ,Mar</td>
                      <td className={styles.abcd}>12 Dec</td>
                    </tr>
                    <tr>
                      <td className={styles.abcd}>2</td>
                      <td className={styles.abcd}>16 Feb To 25 Feb</td>
                      <td className={styles.abcd}>Apr, May, Jun</td>
                      <td className={styles.abcd}>12 March</td>
                    </tr>
                    <tr>
                      <td className={styles.abcd}>3</td>
                      <td className={styles.abcd}>16 May To 25 May</td>
                      <td className={styles.abcd}>Jul, Aug, Sept</td>
                      <td className={styles.abcd}>12 Jun</td>
                    </tr>
                    <tr>
                      <td className={styles.abcd}>4</td>
                      <td className={styles.abcd}>16 Aug To 25 Aug</td>
                      <td className={styles.abcd}>Oct, Nov, Dec</td>
                      <td className={styles.abcd}>12 Sept</td>
                    </tr>
                  </table>
                </div>
                <Box
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    endIcon={<FileDownloadOutlinedIcon />}
                    onClick={() => {
                      setLoading(true);
                      const url = `${urls.PABBMURL}/mstRateChart/downloadRateChartPdf`;
                      axios
                        .get(url, {
                          headers: {
                            Authorization: `Bearer ${user.token}`,
                          },
                          responseType: "blob",
                        })
                        ?.then((r) => {
                          setLoading(false);
                          console.log("rrr", r);
                          const blob = new Blob([r?.data], {
                            type: "application/pdf",
                          });
                          const pdfDataUrl = URL.createObjectURL(blob);
                          const newTab = window.open();
                          newTab.location.href = pdfDataUrl;
                        })
                        ?.catch((error) => {
                          setLoading(false);
                          console.log("CatchPreviewApi", error);
                          sweetAlert({
                            title:
                              language === "en"
                                ? "Something Went Wrong"
                                : "काहीतरी चूक झाली",
                            dangerMode: false,
                            closeOnClickOutside: false,
                          });
                        });
                    }}
                  >
                    Download Rate Chart
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      router.push({
                        pathname: `/PublicAuditorium/transaction/auditoriumBooking`,
                        query: {
                          pageMode: "Add",
                        },
                      });
                    }}
                  >
                    Accept Terms And Conditions
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    endIcon={<ClearIcon />}
                    onClick={() => {
                      _loggedInUser == "cfcUser"
                        ? router.push({
                            pathname: `../../../CFC_Dashboard`,
                            query: {
                              pageMode: "Add",
                            },
                          })
                        : router.push({
                            pathname: `/dashboardV3`,
                            query: {
                              pageMode: "Add",
                            },
                          });
                    }}
                  >
                    {/* <FormattedLabel id="exit" /> */}
                    Exit
                  </Button>
                </Box>
              </>
            )}
          </>
        </div>
        <div className={styles.row}></div>
      </Paper>
    </>
  );
};

export default Index;
