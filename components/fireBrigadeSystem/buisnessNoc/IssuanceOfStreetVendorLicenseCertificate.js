import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "../../../styles/fireBrigadeSystem/styles/issuanceOfStreetVendorLicenseCertificate.module.css";

import { Paper, Button, Stack } from "@mui/material";
import Image from "next/image";
// Issuance of Street vendor license certificate
const IssuanceOfStreetVendorLicenseCertificate = (props) => {
  // useRef
  const componentRef = useRef();
  // let props1 = applicationData;

  // Handle To Print Button
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {}, [props]);

  // view
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          paddingTop: "50px",
          paddingRight: "100px",
          paddingLeft: "100px",
        }}
      >
        <br />
        <br />
        <Stack
          spacing={5}
          direction="row"
          style={{
            display: "flex",
            justifyContent: "left",
            marginLeft: "50px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Stack>
        <br />
        <br />
        <ComponentToPrint ref={componentRef} props={props} />
      </Paper>
    </>
  );
};

// sldfjl
class ComponentToPrint extends React.Component {
  render(props) {
    const {
      applicantName,
      dateOfBirth,
      gender,
      hawkerType,
      mobile,
      fullAddressCrMr,
    } = this?.props?.props?.props;

    return (
      <>
        <Paper
          elevation={0}
          sx={{
            paddingRight: "20px",
            paddingLeft: "20px",
            paddingLeft: "20px",
            paddingBottom: "50px",
            height: "1200px",
          }}
        >
          <table style={{ border: "2px solid black", width: "100%" }}>
            {/** Header */}
            <tr style={{ border: "2px solid black" }}>
              <div className={styles.main}>
                <div className={styles.one}>
                  <Image
                    src="/sign.png"
                    alt="Maharashtra Logo"
                    height={200}
                    width={200}
                  ></Image>
                  <tr>
                    <div style={{ marginTop: "5px" }}>
                      <right>
                        <h3>
                          <b>फेरीवाला नोंदणी क्र.::- </b>
                        </h3>
                      </right>
                    </div>
                  </tr>
                </div>
                <tr>
                  <center>
                    <h3>
                      <b>पिंपरी चिंचवड महानगरपालिका</b>
                    </h3>
                    <h3>
                      <b>मुख्य कार्यालय, पिंपरी ४११ ०१८</b>
                    </h3>
                    <h3>
                      <b>आकाशचिन्ह व परवाना विभाग</b>
                    </h3>
                    <h3>
                      <b>व्यवसाय परवाना</b>
                    </h3>{" "}
                    <h3>
                      <b>(नवीन)</b>
                    </h3>{" "}
                    <h3>
                      (मुंबई प्रांतिक मनपा अधिनियम १९४९ चे कलम ३७६ व उपविधी
                      अन्वये)
                    </h3>
                    <h3>
                      (नागरी व प्रशासकीय सेवेसाठी ISO 9001 : 2008 प्रमाणपत्र
                      प्राप्त संस्था )
                    </h3>
                  </center>
                </tr>
                <div className={styles.three}>
                  <Image
                    src="/rts_servicelogo.png"
                    alt="Maharashtra Logo"
                    height={197}
                    width={197}
                  ></Image>
                  <tr>
                    <div style={{ marginTop: "5px" }}>
                      <right>
                        <h3>
                          <b>फेरीवाला नोंदणी दिनांक :- </b>
                        </h3>
                      </right>
                    </div>
                  </tr>
                </div>
              </div>
            </tr>
            {/** Header End */}
            <tbody>
              <tr colSpan="30">
                <center>
                  <td>
                    <h2
                      style={{ marginTop: "25px" }}
                      className={styles.extraWidth1}
                    >
                      <b>फेरीवाला नोंदणी प्रमाणपत्र</b>
                    </h2>
                  </td>
                </center>
              </tr>
              {/** P1 */}
              <tr colSpan="30">
                <td>
                  <h3 className={styles.extraWidth1}>
                    <p className={styles.p1}>
                      श्री./श्रीमती. योगेश अशोक रूपवते यांना भारत सरकारच्या "दि
                      स्ट्रीट व्हेंडर्स (प्रोटेक्शन ऑफ लाईव्हलिहूड अँड
                      रेग्युलेशन ऑफ स्ट्रीट व्हेंडींग) अधिनियम २०१४" चे मधील
                      प्रकरण २ कलम ४ (१) अन्वये सदर फेरीवाला नोंदणी प्रमाणपत
                      देणेत येते की, महाराष्ट्र शासनाचे आदेशान्वये लागू असलेल्या
                      राष्ट्रीय फेरीवाला धोरण २००९ चे प्रकरण क्र. ४.५.४ मधील
                      तरतूदींनुसार पिंपरी चिंचवड शहरातील ‘‘फेरीवाला व्यावसायिक”
                      म्हणून पिंपरी चिंचवड महानगरपालिकेकडून मॉडर्न इलेक्ट्रॉनिक
                      समोर सिद्धटेक सोसायटी कॉर्नर या चालू व्यवसाय जागेवरील
                      बायोमेट्रीक सर्वेक्षण करण्यात येऊन महानगरपालिका स्तरावर
                      खालील तक्त्यात दर्शविल्याप्रमाणे नोंद घेणेत आलेली आहे.
                    </p>
                  </h3>
                </td>
              </tr>
              <tr colSpan="30">
                <center>
                  <td>
                    <h2 className={styles.extraWidth1}>
                      <b>फेरीवाला नोंद तपशील</b>
                    </h2>
                  </td>
                </center>
              </tr>

              {/** Inside Table */}
              <center>
                <div className={styles.extraWidth1}>
                  <tr>
                    <td colSpan={20} className={styles.borderBlack}>
                      <h3
                        className={styles.center}
                        style={{ marginLeft: "5px", marginRight: "5px" }}
                      >
                        फेरीवाल्याचे नाव: योगेश अशोक रूपवते
                      </h3>
                    </td>
                    <td colSpan={10} rowSpan={4} className={styles.borderBlack}>
                      <img
                        src="/sign.png"
                        alt="Maharashtra Logo"
                        width={200}
                      ></img>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={20} className={styles.borderBlack}>
                      <h3
                        className={styles.center}
                        style={{ marginLeft: "5px", marginRight: "5px" }}
                      >
                        निवासाचा पत्ता: आर एच 35, थरमॅक्स चौक, संभाजीनगर चिंचवड
                        पुणे 19
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={20} className={styles.borderBlack}>
                      <h3
                        className={styles.center}
                        style={{ marginLeft: "5px", marginRight: "5px" }}
                      >
                        फोन क्र: 9881477004
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={10} className={styles.borderBlack}>
                      <h3
                        className={styles.center}
                        style={{ marginLeft: "10px", marginRight: "5px" }}
                      >
                        व्यवसाय प्रकार: स्थिर
                      </h3>
                    </td>
                    <td colSpan={10} className={styles.borderBlack}>
                      <h3
                        className={styles.center}
                        style={{ marginLeft: "10px", marginRight: "5px" }}
                      >
                        व्यवसाय साधन: स्टॉल
                      </h3>
                    </td>
                  </tr>
                </div>
              </center>

              {/** P2 */}
              <tr>
                <td>
                  <h3 className={styles.extraWidth1}>
                    <p className={styles.p1}>
                      सदर नोंदणीनुसार आपणांस पिंपरी चिंचवड महानगरपालिके कडून
                      नव्याने नेमून दिलेल्या जागेवर या नोंदणी प्रमाणपत्राचे
                      मागील बाजूस ठरवून दिलेल्या अटी/शर्तीनुसार आपण व्यवसाय
                      करावयाचा आहे. सदर अटी /शर्तीचे पालन करणे आपणांवर बंधनकारक
                      असून, या अटींवरच सदरचे ‘‘फेरीवाला नोंदणी प्रमाणपत्र”
                      आपणांस देणेत येत आहे. सदरचे फेरीवाला नोंदणी प्रमाणपत्र
                      अथवा व्यवसायाची नेमून दिलेली जागा आपणांस इतरांचे नावे
                      परस्पर हस्तांतरीत करता येणार नाही. या प्रमाणपत्राचे
                      नुतनीकरण दरवर्षी एप्रिल महिन्यामध्ये करणे आपणांस बंधनकारक
                      राहील.
                    </p>
                  </h3>
                </td>
              </tr>
              {/** P3 */}
              <tr>
                <td>
                  <h3 className={styles.extraWidth1}>
                    <p className={styles.p1}>
                      आपण मनपाच्या सर्व अटी/शर्ती व ठरविलेले परवाना शुल्क, विलंब
                      शुल्क तसेच महाराष्ट्र शासनाचे योजनेनुसार त्यामध्ये
                      वेळोवेळी होणारे बदल इत्यादींच्या अधिन राहून व्यवसाय
                      करावयाचा आहे. सदर नियम व कायदेशीर तरतूदींचा आपणाकडू न भंग
                      झाल्यास आपले फे रीवाला नोंदणी प्रमाणपत्र रद्द करण्यात
                      येईल.
                    </p>
                  </h3>
                </td>
              </tr>

              {/** Footer */}
              <div className={styles.extraWidth1}>
                <tr>
                  <td rowSpan="4" colSpan={10}>
                    <div style={{ width: "600px", marginLeft: "50px" }}>
                      <img
                        src="/sign.png"
                        alt="Maharashtra Logo"
                        width={200}
                        height={100}
                      ></img>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td colSpan={20}>
                    <h3 className={styles.extraWidth2}>क्षेत्रिय अधिकारी</h3>
                  </td>
                </tr>

                <tr>
                  <td colSpan={20}>
                    <h3 className={styles.extraWidth2}>अक्षेत्रिय कार्यालय</h3>
                  </td>
                </tr>

                <tr>
                  <td colSpan={20}>
                    <h3 className={styles.extraWidth2}>
                      पिंपरी चिंचवड महानगरपालिका ,पिंपरी – ४११ ०१८
                    </h3>
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </Paper>
      </>
    );
  }
}

export default IssuanceOfStreetVendorLicenseCertificate;
