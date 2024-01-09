import React, { useRef } from "react";
import router, { useRouter } from "next/router";
import Head from "next/head";
import styles from "./SR2AadeshUnautorised.module.css";
import { Button, Paper, Stack } from "@mui/material";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { useReactToPrint } from "react-to-print";

const SR2AadeshUnautorised = () => {
  const componentRef = useRef();
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  // HandleToPrintButton
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      {/* {watch("loadderState") ? (
        <Loader />
      ) : ( */}
      <Paper elevation={0} className={styles.Paper}>
        {/** componentToPrint */}
        <div className={styles.ComponentToPrint}>
          <ComponentToPrint
            ref={componentRef}
            // propertyTaxShapeInformationData={propertyTaxShapeInformationData}
            language={language}
          />
        </div>
        {/**Stack */}
        <Stack spacing={5} direction="row" className={styles.Stack}>
          {/** Print Button */}
          <Button
            variant="contained"
            type="primary"
            // startIcon={<PrintIcon />}
            style={{ float: "right" }}
            onClick={() => handlePrint()}
          >
            {<FormattedLabel id="print" />}
          </Button>
          {/** Back Button */}
          <Button
            onClick={() => {
              localStorage.removeItem("id");
              if (localStorage.getItem("loggedInUser") == "citizenUser") {
                router.push("/dashboard");
              } else {
                router.push("/streetVendorManagementSystem/dashboards");
              }
            }}
            type="button"
            variant="contained"
            color="primary"
          >
            {<FormattedLabel id="back" />}
          </Button>
        </Stack>
      </Paper>
      {/* )} */}
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends React.Component {
  // render
  render() {
    // Print_view;
    return (
      <>
        <Head>
          <title>SR2 Aadesh Unautorised</title>
        </Head>
        <Paper className={styles.main}>
          <div className={styles.docWrapper}>
            <table className={styles.headTable}>
              <tbody className={styles.tableBody}>
                <tr>
                  <td rowSpan={4} className={styles.borderedBody}>
                    <img
                      src="/logo.png"
                      alt="PCMC Logo"
                      className={styles.pcmcLogo}
                    />
                  </td>
                  <td className={styles.nonBorderedBody}>
                    <b className={styles.labelHeading}>
                      पिंपरी-चिंचवड महानगरपालिका
                    </b>
                  </td>
                  <td className={styles.borderedBody}>
                    <b>विभागीय कार्यालय</b>
                  </td>
                  <td className={styles.borderedBody}>....</td>
                </tr>
                <tr>
                  <td className={styles.nonBorderedBody}>
                    <b className={styles.labelSubHeading1}>
                      करआकारणी व करसंकलन विभाग
                    </b>
                  </td>
                  <td className={styles.borderedBody}>
                    <b>गट व ब्लॉक क्रमांक</b>
                  </td>
                  <td className={styles.borderedBody}>....</td>
                </tr>
                <tr>
                  <td className={styles.nonBorderedBody}>
                    {/* <label className={styles.labelSubHeading2}>
                      {
                        "(महाराष्ट्र महानगरपालिका अधिनियम प्रकरण ८ नियम २० (२) १५ (२) अन्वये)"
                      }
                    </label> */}
                  </td>
                  <td className={styles.borderedBody}>
                    <b>इमारत क्रमांक</b>
                  </td>
                  <td className={styles.borderedBody}>....</td>
                </tr>
                <tr>
                  <td className={styles.nonBorderedBody}>
                    {/* <b className={styles.labelSubHeading1}>
                      मालमत्ता कर आकारणीबाबत विशेष नोटीस
                    </b> */}
                  </td>
                  <td className={styles.borderedBody}>
                    <b>मालमत्ता क्रमांक</b>
                  </td>
                  <td className={styles.borderedBody}>.....</td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    className={`${styles.borderedBody} ${styles.labelSubHeading2}`}
                  >
                    <b>
                      वाचले : १) मालमत्ता कर आकारणी बाबत विशेष नोटीस क्र. ……………
                      दिनांक - / /{" "}
                    </b>
                    <br />
                    <b style={{ marginLeft: "7vh" }}>
                      २) फ्लोअरेज कर आकारणी विशेष नोटीस क्र. ……………….. दिनांक - /
                      /
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className={styles.docBody}>
              <table style={{ marginTop: 10 }}>
                <tbody>
                  <tr
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b> जाक्र. कर / / कावि/ /20 </b>

                    <b> दिनांक : / /</b>
                  </tr>
                  <tr>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <b> विषय - करयोग्य मूल्य निश्चितीबाबत </b>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: 0 }}>आदेश,</td>
                  </tr>

                  <tr>
                    <td colSpan={3} className={styles.docBodyParagraph}>
                      पिंपरी चिंचवड महानगरपालिका हद्दीतील …………{" "}
                      <b>कर संकलन विभागीय कार्यालयाचे </b>कार्यक्षेत्रातील ………..
                      या ठिकाणी <b>मे/श्री./श्रीम. …………………..</b> यांचे इमारत
                      बांधकाम / जमिन आहे. त्यावर महाराष्ट्र महानगरपालिका
                      अधिनियमामधील तरतुदीनुसार <b>मालमत्ता</b> कर आकारणीची विशेष
                      नोटीस उपरोक्त वाचले क्रमांक 1 अन्वये दिलेली आहे.{" "}
                      <b>मालमत्ता</b> धारक यांनी नोटीसमधील अथवा कर आकारणी
                      रजिस्टरमधील नोंदीबाबत कोणत्याही प्रकारची हरकत अथवा तक्रार
                      नोटीस मधील मुदतीत दाखल केलेली नाही. यावरून नोटीसमधील मजकूर
                      व कर आकारणी रजिस्टरमधील नोंदीबाबत काहीही तक्रार नाही असे
                      समजणेत येत आहे.
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp; महाराष्ट्र महानगरपालिका
                      अधिनियमातील कलम /अ नुसार आपल्या अवैध 267 <b>
                        अनधिकृत
                      </b>{" "}
                      मालमत्तेचे किंवा मालमत्तेच्या भागाचे अवैधरित्या झालेल्या
                      बांधकामांना ते बांधकाम जोपर्यंत अवैध बांधकाम म्हणुन राहील
                      तोपर्यंत, अधिनियमातील तरतूदीनुसार / शासन आदेशानुसार शास्ती
                      भरण्यास पात्र राहील. तसेच या बांधकामावर मालमत्ता करआकारणी
                      व अवैध बांधकाम शास्तीची आकारणी केली म्हणजे सदरचे बांधकाम
                      विनियमित झाले आहे असा अन्वयार्थ लावला जाणार नाही.
                      अधिनियमातील कलम अनधिकृत /अ तरतुदीनुसार अवैध 397 व 260त
                      बांधकाम निष्कासित करणेची संबंधीत वैधानिक महामंडळ यांनी
                      कारवाई केल्यास आपणास प्रतिबंधअटकाव करता येणार नाही किंवा
                      न्यायालयात /विरोध / दावा दाखल करता येणार नाही, तसेच सदर
                      अवैधअनधिकृत मालमत्ते / वर कोणत्याही स्वरुपाचा कोणत्याही
                      वित्तीय संस्थेचा बोजा असेल व सदर मालमत्ता कलम निष्कासित
                      करणारी , अ चे तरतुदी प्रमाणे निष्कासीत केली तर,397 व
                      260.संस्था सदर बोजास जबाबदार रहाणार नसुन निष्कासित करणेचा
                      खर्च वसुल करणेत येईल.
                      <br /> &nbsp;&nbsp;&nbsp;&nbsp;सबब प्रस्तुत{" "}
                      <b>मालमत्ता</b> करआकारणी प्रकरणी खालीलप्रमाणे करआकारणी
                      कायम करणेस या आदेशान्वये मान्यता देत आहे.
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className={styles.bodyTable}>
                <tbody>
                  <tr>
                    <th className={styles.borderedBody}>
                      <b>वापर</b>
                    </th>
                    <th className={styles.borderedBody}>
                      <b>आकारणी क्षेत्रफळ (चौ. फुट )</b>
                    </th>
                    <th className={styles.borderedBody}>
                      <b>करयोग्य मूल्य</b>
                    </th>
                    <th className={styles.borderedBody}>
                      <b>आकारणी कालावधी पासून</b>
                    </th>
                  </tr>
                  <tr>
                    <td className={styles.borderedBody}>
                      <b>निवासी</b>
                    </td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                  </tr>
                  <tr>
                    <td className={styles.borderedBody}>
                      <b>बिगर निवासी</b>
                    </td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                  </tr>
                  <tr>
                    <td className={styles.borderedBody}>
                      <b>औद्योगिक</b>
                    </td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                  </tr>
                  <tr>
                    <td className={styles.borderedBody}>
                      <b>मोकळी जमीन</b>
                    </td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                  </tr>
                  <tr>
                    <td className={styles.borderedBody}>
                      <b>पार्कींग</b>
                    </td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                  </tr>
                  <tr>
                    <td className={styles.borderedBody}>
                      <b>एकुण</b>
                    </td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                    <td className={styles.borderedBody}></td>
                  </tr>

                  <tr>
                    <td colSpan={4} className={styles.docBodyParagraph}>
                      निश्चित केलेले करयोग्य मूल्य <b>मालमत्ता</b> धारकास मान्य
                      नसलेस जरूर तर महाराष्ट्र महानगरपालिका अधिनियम कलम 406
                      नुसार व त्यातील तरतुदी नुसार योग्य त्या कोर्टात १५
                      दिवसांचे आत अपिल दाखल करता येईल. <br />
                      <br />
                      कळावे,
                    </td>
                  </tr>

                  <tr>
                    <td style={{ paddingTop: 65 }}></td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <th>सहायक आयुक्त, / प्रशासन अधिकारी ( कर)</th>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <th>पिंपरी चिंचवड महानगरपालिका, पिंपरी – ४११०१८</th>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <b>प्रति,</b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      १. श्री. …….……………….……. <br />
                      पत्ता ……………………………….
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={3}>
                      <b> प्रत,</b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      १. सहायक मंडलाधिकारी <br />
                      <b>
                        {" "}
                        २/- आदेशाचे नोंदी घेणेकरिता व पुढील कार्यवाही करिता
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Paper>
      </>
    );
  }
}
export default SR2AadeshUnautorised;
