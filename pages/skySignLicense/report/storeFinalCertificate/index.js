import BasicLayout from "../../../../containers/Layout/BasicLayout";

import React, { useEffect, useRef, useState } from "react";
import router from "next/router";

import { useReactToPrint } from "react-to-print";
import styles from "../../../../styles/skysignstyles/storeCertificateFinal.module.css";
import { Box, Button, Paper } from "@mui/material";
import { BorderColor, HighlightTwoTone } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { useSelector } from "react-redux";

//  Certificate Form
const IndustryCertificateReport = () => {
  const componentRef = useRef();
  const componentRef1 = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // content: () => componentRef1.current,
  });

  const [dataa, setDataa] = useState(null);

  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();
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
    if (router?.query?.id) {
      axios
        .get(
          `${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/getByIdAndServiceId?serviceId=9&id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          console.log("aala", res.data);
          setDataa(res.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [router?.query]);

  return (
    <div>
      <Paper>
        <div>
          <center>
            <h1> Certificate</h1>
          </center>
        </div>

        <ComponentToPrint ref={componentRef} dataa={dataa} />
        <div
          style={{
            padding: 10,
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "5vh",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            // style={{ float: "right" }}
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

                  if (router?.query?.citizenView) {
                    router.push("/dashboard");
                  } else {
                    router.push(
                      "/skySignLicense/transactions/issuanceofStore/scrutiny"
                    );
                  }
                } else {
                  swal("Record is Safe");
                }
              });
            }}
          >
            Exit
          </Button>
        </div>
      </Paper>

      {/* <ComponentToPrintNotice ref={componentRef1} /> */}
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.outerPrintContainer}>
        <div
          style={
            {
              // backgroundColor: 'aquamarine',
              // height: "170vh",
            }
          }
        >
          <table className={styles.data}>
            <tr>
              <div className={styles.main}>
                <div className={styles.one}>
                  <img
                    src="/logo.png"
                    alt="Maharashtra Logo"
                    // height={200}
                    // width={200}
                    className={styles.mahlogo}
                  ></img>
                </div>
                <div className={styles.headingContain}>
                  <span className={styles.headings}>
                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                  </span>
                  <span className={styles.headings}>
                    <b>मुख्य कार्यालय, पिंपरी ४११ ०१८</b>
                  </span>
                  <span className={styles.headings}>
                    <b>आकाशचिन्ह व परवाना विभाग</b>
                  </span>
                  <span className={styles.headings}>
                    <b>साठा व विक्रकरणेबाबतचा परवाना</b>
                  </span>{" "}
                  <span className={styles.headings}>
                    <b>(नवीन)</b>
                  </span>{" "}
                  <span className={styles.headings}>
                    (मुंबई प्रांतिक मनपा अधिनियम १९४९ चे कलम ३७६ व उपविधी
                    अन्वये)
                  </span>
                  <span className={styles.headings}>
                    (नागरी व प्रशासकीय सेवेसाठी ISO 9001 : 2008 प्रमाणपत्र
                    प्राप्त संस्था )
                  </span>
                </div>
                <div className={styles.three}>
                  <img
                    src="/rts_servicelogo.png"
                    alt="Maharashtra Logo"
                    // height={197}
                    // width={197}
                    className={styles.servicelogo}
                  ></img>
                </div>
              </div>
            </tr>
            <tr className={styles.upperDetails}>
              <div className={styles.detailLines}>
                <b>
                  परवाना क्रमांक :-&nbsp;
                  {this?.props?.dataa?.trnLicenseDao.licenseNo}
                </b>
              </div>

              <div className={styles.detailLines}>
                <b>टोकन क्रमांक:-&nbsp;</b>
                {this?.props?.dataa?.applicationNumber}
              </div>
            </tr>

            <tr className={styles.upperDetails}>
              <div className={styles.detailLines}>
                <b>
                  {" "}
                  परवाना दिनांक :-&nbsp;
                  {moment(this?.props?.dataa?.trnLicenseDao.licenseDate).format(
                    "DD-MM-YYYY"
                  )}{" "}
                </b>
              </div>
              <div className={styles.detailLines}>
                <b> टोकन दिनांक:-&nbsp;</b>
                {moment(this?.props?.dataa?.applicationDate).format(
                  "DD-MM-YYYY"
                )}
              </div>
            </tr>
          </table>

          <table className={styles.data}>
            <tr>
              <td className={styles.innerTableTd}>
                <table>
                  {/* <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>परवाना क्रमांक :-&nbsp;{this?.props?.dataa?.trnLicenseDao.licenseNo}</b>
                    </div>
                
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b> परवाना दिनांक :-&nbsp;{moment(this?.props?.dataa?.trnLicenseDao.licenseDate).format('DD-MM-YYYY')} </b>
                    </div>
                
                  </tr> */}
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        परवाना कालावधी : &nbsp;
                        {moment(
                          this?.props?.dataa?.trnLicenseDao.licenseValidTill
                        ).format("DD-MM-YYYY")}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        व्यवसायाचे नाव : &nbsp;
                        {
                          this?.props?.dataa?.trnStoreDetailsDao
                            ?.nameOfStoreOrganization
                        }
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        मालकाचे नाव : &nbsp;
                        {this?.props?.dataa?.firstName +
                          " " +
                          this?.props?.dataa?.middleName +
                          " " +
                          this?.props?.dataa?.lastName}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>व्यवसायाचे स्वरूप :&nbsp;</b>उद्योगधंदा परवाना
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        व्यवसायाचा प्रकार : &nbsp;
                        {this?.props?.dataa?.trnStoreDetailsDao?.storeType}
                      </b>
                    </div>
                  </tr>
                  {/* <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>एकूण क्षेत्र : &nbsp;{this?.props?.dataa?.trnStoreDetailsDao?.totalAreaM + " in sq.m"}</b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b> कामाच्या वेळा :  &nbsp;{this?.props?.dataa?.trnStoreDetailsDao?.workingHours + " तास"}</b>

                    </div>
                  </tr> */}
                </table>
              </td>
              <td className={styles.innerTableTd2}>
                <table>
                  {/* <tr className={styles.rowCheck}>

                    <div className={styles.detailLines}>
                      <b>टोकन क्रमांक:-&nbsp;</b>१०२५५२१३44444444444
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>  टोकन दिनांक:-&nbsp;</b>११/०८/२३
                    </div>
                  </tr> */}
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b> झोनचे नाव:-&nbsp;</b>
                      {this?.props?.dataa?.trnLicenseDao.zoneKey}
                    </div>
                  </tr>

                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        घरचा पत्ता : &nbsp;
                        {this?.props?.dataa?.applicantAddress}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}></div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}></div>
                  </tr>

                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        {" "}
                        व्यवसायाचे ठिकाण : &nbsp;
                        {this?.props?.dataa?.trnStoreDetailsDao
                          ?.cityServrNumber +
                          "," +
                          this?.props?.dataa?.trnStoreDetailsDao?.roadName +
                          "," +
                          this?.props?.dataa?.trnStoreDetailsDao?.prCityName +
                          "," +
                          this?.props?.dataa?.trnStoreDetailsDao?.prState +
                          "," +
                          this?.props?.dataa?.trnStoreDetailsDao?.pincode}
                      </b>{" "}
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}></div>
                  </tr>

                  {/* <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>बांधकाम क्षेत्र :  &nbsp;{this?.props?.dataa?.trnStoreDetailsDao?.constructionAreaM + " in sq.m"}</b>

                    </div>
                  </tr> */}
                </table>
              </td>
            </tr>
          </table>

          <table className={styles.data}>
            <tr>
              <td className={styles.innerTableTd}>
                <table>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        एकूण क्षेत्र : &nbsp;
                        {this?.props?.dataa?.trnStoreDetailsDao?.totalAreaM +
                          " in sq.m"}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        अग्निशामक साधने : &nbsp;
                        {this?.props?.dataa?.trnSiteVisitFormDao
                          ?.fireEquirepment == "true"
                          ? "आहे"
                          : "नाही"}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        एकूण मशिनरी : &nbsp;
                        {this?.props?.dataa?.trnStoreDetailsDao?.machineCount}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        एकूण कर्मचारी : &nbsp;
                        {this?.props?.dataa?.trnStoreDetailsDao?.totalEmployees}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        {" "}
                        कामाच्या वेळा : &nbsp;
                        {this?.props?.dataa?.trnStoreDetailsDao?.workingHours +
                          " तास"}
                      </b>
                    </div>
                  </tr>
                </table>
              </td>
              <td className={styles.innerTableTd2}>
                <table>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>बांधकाम क्षेत्र : &nbsp;</b>
                      {this?.props?.dataa?.trnStoreDetailsDao
                        ?.constructionAreaM + " in sq.m"}
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>प्रथमोपचार साधने : &nbsp;</b>
                      {this?.props?.dataa?.trnSiteVisitFormDao?.firstAidKit ==
                      "true"
                        ? "आहे"
                        : "नाही"}
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>स्वच्छतागृह सोय : &nbsp;</b>
                      {this?.props?.dataa?.trnSiteVisitFormDao?.toilets ==
                      "true"
                        ? "आहे"
                        : "नाही"}
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>विजेबाबत मंजूर अश्वशक्ती : &nbsp;</b>नियमानुसार
                    </div>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table className={styles.report}>
            <tr>
              <tr>
                <div className={styles.rowCheck22}>
                  <b>
                    (सदर परवाना हा महाराष्ट्र महानगरपालिका अधिनियम व
                    महानगरपालिकेचे उपविधी यांच्या शर्तीस अधिन राहिल){" "}
                  </b>
                </div>
                <div className={styles.rowCheck22}>
                  <b>
                    {" "}
                    07/02/2020 च्या नोटराईज हमीपत्रामधील अटीस अधिन राहून
                    तात्पुरत्या स्वरूपाचा परवाना दिला असे{" "}
                  </b>
                </div>
                <div className={styles.rowCheck22}>
                  <b>परवान्याची फी र.रू.: &nbsp;</b>
                  {this?.props?.dataa?.trnLoiDao?.amount}
                </div>
                <div className={styles.rowCheck22}>
                  <b>पावती क्रमांक : &nbsp;</b>
                  {this?.props?.dataa?.trnPaymentCollectionDao?.receiptNo}
                </div>
                <div className={styles.rowCheck22}>
                  <b> फी भरल्याचा दिनांक : &nbsp;</b>
                  {moment(
                    this?.props?.dataa?.trnPaymentCollectionDao?.receiptDate
                  ).format("DD-MM-YYYY")}
                </div>
              </tr>
              {/* <div className={styles.mtwo}>
                          <tr>
                            <div>
                              <right>
                                <h3>
                                  <b>एकूण र.रु. : </b>
                                </h3>
                                
                              </right>
                            </div>
                          </tr>
                        </div> */}
            </tr>
            <tr className={styles.bottomRow}>
              <div className={styles.qrcode}>
                <img
                  src="/qrcode.png"
                  alt="Maharashtra Logo"
                  className={styles.qrLogo}
                ></img>
              </div>

              <div className={styles.signDetails}>
                <tr>
                  <b>उप आयुक्त (परवाना)</b>
                </tr>
                <tr>पिंपरी चिंचवड महानगरपालिका</tr>
                <tr>पिंपरी ४११ ०१८</tr>
              </div>
              {/* <td colSpan="2" style={{ paddingRight: "50px", marginTop: "4vh" }}>
                  {" "}
                  <h3>
                    <b>उप आयुक्त (परवाना)</b>
                  </h3>
                  <h3>पिंपरी चिंचवड महानगरपालिका</h3>
                  <h3>पिंपरी ४११ ०१८</h3>
                </td> */}
            </tr>
          </table>
        </div>

        <div className={styles.secondPageTable}>
          <table className={styles.dataNewPage}>
            <tr>
              <ol className={styles.listDetails}>
                <li className={styles.listClass}>
                  {" "}
                  प्रत्येक परवाना धारकाने परवान्याचे नुतनीकरण दरवर्षी दि.३०
                  एप्रिलच्या आत करुन घेणे बंधनकारक आहे पंरतु सवलत म्हणून दि. ३०
                  जुन पर्यंत नुतनीकरण करता येईल ३० जून पर्यंत नुतनीकरण न केलेस
                  माहे एप्रिल पासून विलंबशुल्क दरमहा १०%प्रमाणे आकारणेत येईल.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  महानगरपालिकेच्या अधिका-याने परवाना तपासणीसाठी मागितला तर तो
                  परवाना धारकाने दाखविला पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  परवाना ज्यासाठी दिला आहे त्या जागेतच उद्योगधंदा चालविला
                  पाहिजे. सार्वजनिक जागेवर अतिक्रमण करता कामा नये.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  पिंपरी चिंचवड महानगरपालिकेने कोणत्याही कारणास्तव जाहिरात
                  परवाना रद्द केल्यास त्याविरुध्द न्यायालयात दाद मागण्याचा हक्क
                  मला राहणार नाही.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  प्रत्येक कामगारास व्यवसाय क्षेत्रामध्ये प्रत्यक्ष जागेच्या
                  ठिकाणी कमीत कमी २५ चौ.फूट जागा ठेवली पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  निवासी भागातील परवाना धारकास जर १० पेक्षा जास्त कामगार ठेवायचे
                  असतील तर त्याने आपला उद्योगधंदा महानगरपालिकेच्या औद्योगिक
                  विभागात हलविला पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  निवासी विभागामध्ये असणा-या परवाना धारकाने रात्री ८.०० ते सकाळी
                  ८.०० पर्यत व्यवसाय बंद ठेवला पाहिजे..
                </li>
                <li className={styles.listClass}>
                  {" "}
                  उद्योगधंदयापासून आजूबाजूच्या रहिवाश्यांना आवाजामुळे किंवा
                  उद्योगधंद्यामुळे निर्माण होणा-या वायुमुहे अगर द्रवपदार्थामुळे
                  उपद्रव होणार नाही किंवा धोका होणार नाही याची काळजी घेतली
                  पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  उद्योगधंद्यापासून निचरा होणारे पाणी रसायने अगर इतर कोणतेही
                  द्रपदार्थ किंवा कचरा वा वायुमुळे अगर द्रवपदार्थामुळे उपद्रव
                  होणार नाही किंवा धोका होणार नाही याची काळजी घेतली पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  महाराष्ट्र महानगरपालिका अधिनियम मधील कलमांचा व्यवसाय धारकाने
                  भंग केल्यास त्यावर कायदेशीर इलाज केला जाईल.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  महानगरपालिका उपविधीमधील तरतुदींचे कोणी उल्लंघन केल्यास
                  त्यांचेवर कायदेशीर इलाज केला जाईल.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  महानगरपालिका या कामी वेळोवळी जे नियम उपविधी करील व परवाना
                  शुल्क संबधी निर्णय घेईल ते परवाना धारकावर बंधनकारक राहतील.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  सदर परवान्या व्यतिरिक्त जे शासकीय / निमशासकीय परवाने धारण करणे
                  आवश्यक असतील असे सर्व परवाने धारण करणेची जबाबदारी ही परवाना
                  धारकावर राहील.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  जाहिरात फलकाचा परवाना कालावधी संपल्यानंतर नुतनीकरण करून घेणेची
                  जबाबदारी माझी राहील तसेच नुतनीकरणासाठी अर्ज सादर केला नाही.
                  त्या कालावधीमध्ये सदरचा जाहिरात फलक अतिवृष्टी, वारा, नैसर्गिक
                  आपत्ती, किंवा अन्य कोणत्याही कारणास्तव फलक पडुन जिवीत अथवा
                  वित्त हानी झाल्यास त्याची संपुर्णपणे कायदेशीर जबाबदारी फलक
                  अस्तित्वात आहे तोपर्यंत माझी राहील. त्या बाबत म.न.पास तोषीस
                  लागून देणार नाही.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  जाहिरात फलकाचे नुतनीकरण संपल्यानंतर किंवा मुदत संपल्यानंतर
                  सदरचा जाहिरात फलक संपुर्णपणे निष्कासित करण्याची जबाबदारी माझी
                  राहील.
                </li>
                <li className={styles.listClass}>
                  मनपाच्या विविध योजना व विविध उपक्रमाबाबत जाहिरात फलकांवर दहा
                  दिवस जाहिरात प्रसिध्द करून देणे बंधनकारक राहील.
                </li>
              </ol>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

class ComponentToPrintNotice extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper>
              <table className={styles.data}>
                <tr>
                  <h2>
                    {" "}
                    १) प्रत्येक परवाना धारकाने परवान्याचे नुतनीकरण दरवर्षी दि.३०
                    एप्रिलच्या आत करुन घेणे बंधनकारक आहे पंरतु सवलत म्हणून दि.
                    ३० जुन पर्यंत नुतनीकरण करता येईल ३० जून पर्यंत नुतनीकरण न
                    केलेस माहे एप्रिल पासून विलंबशुल्क दरमहा १०%प्रमाणे आकारणेत
                    येईल.
                  </h2>
                  <h2>
                    {" "}
                    २) महानगरपालिकेच्या अधिका-याने परवाना तपासणीसाठी मागितला तर
                    तो परवाना धारकाने दाखविला पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    ३) परवाना ज्यासाठी दिला आहे त्या जागेतच उद्योगधंदा चालविला
                    पाहिजे. सार्वजनिक जागेवर अतिक्रमण करता कामा नये.
                  </h2>
                  <h2>
                    {" "}
                    ४) पिंपरी चिंचवड महानगरपालिकेने कोणत्याही कारणास्तव जाहिरात
                    परवाना रद्द केल्यास त्याविरुध्द न्यायालयात दाद मागण्याचा
                    हक्क मला राहणार नाही.
                  </h2>
                  <h2>
                    {" "}
                    ५) प्रत्येक कामगारास व्यवसाय क्षेत्रामध्ये प्रत्यक्ष
                    जागेच्या ठिकाणी कमीत कमी २५ चौ.फूट जागा ठेवली पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    ६) निवासी भागातील परवाना धारकास जर १० पेक्षा जास्त कामगार
                    ठेवायचे असतील तर त्याने आपला उद्योगधंदा महानगरपालिकेच्या
                    औद्योगिक विभागात हलविला पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    ७) निवासी विभागामध्ये असणा-या परवाना धारकाने रात्री ८.०० ते
                    सकाळी ८.०० पर्यत व्यवसाय बंद ठेवला पाहिजे..
                  </h2>
                  <h2>
                    {" "}
                    ८) उद्योगधंदयापासून आजूबाजूच्या रहिवाश्यांना आवाजामुळे किंवा
                    उद्योगधंद्यामुळे निर्माण होणा-या वायुमुहे अगर
                    द्रवपदार्थामुळे उपद्रव होणार नाही किंवा धोका होणार नाही याची
                    काळजी घेतली पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    ९) उद्योगधंद्यापासून निचरा होणारे पाणी रसायने अगर इतर
                    कोणतेही द्रपदार्थ किंवा कचरा वा वायुमुळे अगर द्रवपदार्थामुळे
                    उपद्रव होणार नाही किंवा धोका होणार नाही याची काळजी घेतली
                    पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    १०) महाराष्ट्र महानगरपालिका अधिनियम मधील कलमांचा व्यवसाय
                    धारकाने भंग केल्यास त्यावर कायदेशीर इलाज केला जाईल.
                  </h2>
                  <h2>
                    {" "}
                    ११) महानगरपालिका उपविधीमधील तरतुदींचे कोणी उल्लंघन केल्यास
                    त्यांचेवर कायदेशीर इलाज केला जाईल.
                  </h2>
                  <h2>
                    {" "}
                    १२) महानगरपालिका या कामी वेळोवळी जे नियम उपविधी करील व
                    परवाना शुल्क संबधी निर्णय घेईल ते परवाना धारकावर बंधनकारक
                    राहतील.
                  </h2>
                  <h2>
                    {" "}
                    १३) सदर परवान्या व्यतिरिक्त जे शासकीय / निमशासकीय परवाने
                    धारण करणे आवश्यक असतील असे सर्व परवाने धारण करणेची जबाबदारी
                    ही परवाना धारकावर राहील.
                  </h2>
                  <h2>
                    {" "}
                    १४) जाहिरात फलकाचा परवाना कालावधी संपल्यानंतर नुतनीकरण करून
                    घेणेची जबाबदारी माझी राहील तसेच नुतनीकरणासाठी अर्ज सादर केला
                    नाही. त्या कालावधीमध्ये सदरचा जाहिरात फलक अतिवृष्टी, वारा,
                    नैसर्गिक आपत्ती, किंवा अन्य कोणत्याही कारणास्तव फलक पडुन
                    जिवीत अथवा वित्त हानी झाल्यास त्याची संपुर्णपणे कायदेशीर
                    जबाबदारी फलक अस्तित्वात आहे तोपर्यंत माझी राहील. त्या बाबत
                    म.न.पास तोषीस लागून देणार नाही.
                  </h2>
                  <h2>
                    {" "}
                    १५) जाहिरात फलकाचे नुतनीकरण संपल्यानंतर किंवा मुदत
                    संपल्यानंतर सदरचा जाहिरात फलक संपुर्णपणे निष्कासित करण्याची
                    जबाबदारी माझी राहील.
                  </h2>
                  <h2>
                    १६) मनपाच्या विविध योजना व विविध उपक्रमाबाबत जाहिरात फलकांवर
                    दहा दिवस जाहिरात प्रसिध्द करून देणे बंधनकारक राहील.
                  </h2>
                </tr>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default IndustryCertificateReport;
