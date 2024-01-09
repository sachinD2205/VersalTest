import BasicLayout from "../../../../containers/Layout/BasicLayout";

import React, { useEffect, useRef, useState } from "react";
import router from 'next/router'

import { useReactToPrint } from "react-to-print";
import styles from "../../../../styles/skysignstyles/goshwara.module.css";
import { Box, Button, Paper } from "@mui/material";
import { BorderColor, HighlightTwoTone } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";

//  Certificate Form
const IndustryCertificateReport = () => {
  const componentRef = useRef();
  const componentRef1 = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // content: () => componentRef1.current,
  });

  const [dataa, setDataa] = useState(null)


  useEffect(() => {
    if (router?.query?.id) {
      axios
        .get(
          `${urls.SSLM}/trnIssuanceOfIndustrialLicense/getByServiceIdAndId?serviceId=8&id=${router?.query?.id}`,
        )
        .then((res) => {
          console.log("aala", res?.data)
          setDataa(res?.data)
        })
    }
  }, [router?.query])



  return (
    <div>
      <Paper>
        <div>
          <center>
            <h1> Certificate</h1>
          </center>
        </div>

        <ComponentToPrint ref={componentRef} dataa={dataa} />
        <div style={{ padding: 10, display: "flex", justifyContent: "space-evenly", marginTop: "5vh" }}>
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
                title: 'Exit?',
                text: 'Are you sure you want to exit this Record ? ',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                  swal('Record is Successfully Exit!', {
                    icon: 'success',
                  })

                  if (router?.query?.citizenView) {
                    router.push(
                      '/dashboard',
                    )

                  }
                  else {
                    router.push(
                      '/skySignLicense/transactions/issuanceOfIndustry/scrutiny',
                    )
                  }
                } else {
                  swal('Record is Safe')
                }
              })
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
      <>
        <div>
          <div>
            <Paper>
              <Box>
                <div
                  style={{
                    // backgroundColor: 'aquamarine',
                    height: "170vh",
                  }}
                >
                  <table className={styles.data}>
                    <tr>
                      <div className={styles.main}>
                        <div className={styles.one}>
                          <img
                            src="/logo.png"
                            alt="Maharashtra Logo"
                            height={200}
                            width={200}
                          ></img>

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
                              <b>उद्योग परवाना</b>
                            </h3>{" "}
                            <h3>
                              <b>(नवीन)</b>
                            </h3>{" "}
                            <h3>
                              (मुंबई प्रांतिक मनपा अधिनियम १९४९ चे कलम ३७६ व
                              उपविधी अन्वये)
                            </h3>
                            <h3>
                              (नागरी व प्रशासकीय सेवेसाठी ISO 9001 : 2008
                              प्रमाणपत्र प्राप्त संस्था )
                            </h3>
                          </center>
                        </tr>
                        <div className={styles.three}>
                          <img
                            src="/rts_servicelogo.png"
                            alt="Maharashtra Logo"
                            height={197}
                            width={197}
                          ></img>
                        </div>
                      </div>
                    </tr>
                  </table>

                  <table className={styles.data}>


                    <div style={{ marginTop: "5vh", marginBottom: "5vh", marginLeft: "5vh" }}>

                      <tr>
                        <div>
                          <h3>
                            <b>परवाना क्रमांक :-&nbsp;{this?.props?.dataa?.trnLicenseDao.licenseNo}</b>
                          </h3>

                        </div>
                      </tr>
                      <tr>
                        <h3>
                          <b> परवाना दिनांक :-&nbsp;{moment(this?.props?.dataa?.trnLicenseDao.licenseDate).format('DD-MM-YYYY')} </b>
                        </h3>
                      </tr>
                      <tr>
                        <h3>
                          <b>परवाना कालावधी : &nbsp;{moment(this?.props?.dataa?.trnLicenseDao.licenseValidFrom).format('DD-MM-YYYY')}&nbsp;ते&nbsp;{moment(this?.props?.dataa?.trnLicenseDao.licenseValidTill).format('DD-MM-YYYY')}</b>
                        </h3>
                      </tr>
                      <tr>
                        <h3>
                          <b>उद्योगाचे नाव : &nbsp;{this?.props?.dataa?.trnIndustryDetailsDao?.nameOfIndustryOrganization}</b>
                        </h3>
                      </tr>
                      <tr> <h3>
                        <b>मालकाचे नाव : &nbsp;{this?.props?.dataa?.firstName + " " + this?.props?.dataa?.middleName + " " + this?.props?.dataa?.lastName}</b>
                      </h3></tr>
                      {/* <tr>
                        <h3>
                          <b>व्यवसायाचे स्वरूप :&nbsp;{this?.props?.dataa?.trnLicenseDao.licenseValidTill} </b>
                        </h3>
                      </tr>
                      <tr>
                        <div>
                          <h3>
                            <b>व्यवसायाचा प्रकार : &nbsp;{this?.props?.dataa?.trnLicenseDao.licenseValidTill}</b>
                          </h3>

                        </div>
                      </tr> */}
                      <tr>
                        <div>
                          <right>
                            {/* <h3>
                              <b>घरचा पत्ता : &nbsp;{this?.props?.dataa?.prCitySurveyNumber + "," + this?.props?.dataa?.prAreaName + "," + this?.props?.dataa?.prLandmarkName + "," + this?.props?.dataa?.prVillageName + "," + this?.props?.dataa?.prCityName + "," + this?.props?.dataa?.prState
                                + "," + this?.props?.dataa?.prPincode}</b>
                            </h3> */}
                            <h3>
                              <b>घरचा पत्ता : &nbsp;{this?.props?.dataa?.applicantAddress}</b>
                            </h3>
                            <h3>
                              <b> व्यवसायाचे ठिकाण : &nbsp;{this?.props?.dataa?.trnIndustryDetailsDao?.citySurveyNo + "," + this?.props?.dataa?.trnIndustryDetailsDao?.roadName + "," + this?.props?.dataa?.trnIndustryDetailsDao?.prCityName + "," + this?.props?.dataa?.trnIndustryDetailsDao?.prState
                                + "," + this?.props?.dataa?.trnIndustryDetailsDao?.pincode}</b>
                            </h3>
                            {/* <h3>
                              <b> व्यवसायाचा उपप्रकार : &nbsp;{this?.props?.dataa?.trnLicenseDao.licenseValidTill}</b>
                            </h3> */}
                          </right>
                        </div>
                      </tr>

                      <tr>
                        <h3>
                          <b>एकूण क्षेत्र : &nbsp;{this?.props?.dataa?.trnIndustryDetailsDao?.totalAreaM + " in sq.m"}</b>
                        </h3>
                      </tr>
                      {/* <tr>
                        <h3>
                          <b>इतर माहिती : </b>
                        </h3>
                      </tr>*/}
                      <tr>
                        <h3>
                          <b>बांधकाम क्षेत्र :  &nbsp;{this?.props?.dataa?.trnIndustryDetailsDao?.constructionAreaM + " in sq.m"}</b>
                        </h3>
                      </tr>
                      <tr>
                        <h3>
                          <b> कामाच्या वेळा :  &nbsp;{this?.props?.dataa?.trnIndustryDetailsDao?.workingHours + " तास"}</b>
                        </h3>

                      </tr>
                    </div>

                  </table>

                  {/* <table className={styles.data}>

                    <div style={{ marginTop: "5vh", marginBottom: "5vh", marginLeft: "5vh" }}>

                    </div>
                  </table> */}
                  <table className={styles.report}>
                    <div style={{ marginTop: "5vh", marginBottom: "5vh", marginLeft: "2vh" }}>
                      <tr>
                        <div className={styles.mmain}>
                          <div className={styles}>
                            <tr>
                              <div>
                                <right>
                                  <h3>
                                    (सदर परवाना हा महाराष्ट्र महानगरपालिका अधिनियम
                                    व महानगरपालिकेचे उपविधी यांच्या शर्तीस अधिन
                                    राहिल){" "}
                                  </h3>
                                  <h3>
                                    07/02/2020 च्या नोटराईज हमीपत्रामधील अटीस अधिन
                                    राहून तात्पुरत्या स्वरूपाचा परवाना दिला असे{" "}
                                  </h3>
                                  <h3>
                                    <b>परवान्याची फी र.रू.:  &nbsp;{this?.props?.dataa?.trnLoiDao?.amount}</b>
                                  </h3>
                                  <h3>
                                    <b>पावती क्रमांक :  &nbsp;{this?.props?.dataa?.trnPaymentCollectionDao?.receiptNo}</b>
                                  </h3>
                                  <h3>
                                    <b> फी भरल्याचा दिनांक :  &nbsp;{moment(this?.props?.dataa?.trnPaymentCollectionDao?.receiptDate).format('DD-MM-YYYY')}</b>
                                  </h3>
                                </right>

                              </div>
                            </tr>
                          </div>
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
                        </div>
                      </tr>
                      <tr style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className={styles.qrcode} style={{ marginBottom: "2vh" }}>
                          <img
                            src="/qrcode.png"
                            alt="Maharashtra Logo"
                            height={122}
                            width={122}
                          ></img>
                        </div>
                        <td colSpan="2" style={{ paddingRight: "50px", marginTop: "4vh" }}>
                          {" "}
                          <h3>
                            <b>उप आयुक्त (परवाना)</b>
                          </h3>
                          <h3>पिंपरी चिंचवड महानगरपालिका</h3>
                          <h3>पिंपरी ४११ ०१८</h3>
                        </td>
                      </tr>
                    </div>
                  </table>
                </div>
                <table className={styles.data}>
                  <div style={{ margin: "5vh" }}>
                    <tr>
                      <h2>
                        {" "}
                        १) प्रत्येक परवाना धारकाने परवान्याचे नुतनीकरण दरवर्षी
                        दि.३० एप्रिलच्या आत करुन घेणे बंधनकारक आहे पंरतु सवलत
                        म्हणून दि. ३० जुन पर्यंत नुतनीकरण करता येईल ३० जून पर्यंत
                        नुतनीकरण न केलेस माहे एप्रिल पासून विलंबशुल्क दरमहा
                        १०%प्रमाणे आकारणेत येईल.
                      </h2>
                      <h2>
                        {" "}
                        २) महानगरपालिकेच्या अधिका-याने परवाना तपासणीसाठी मागितला
                        तर तो परवाना धारकाने दाखविला पाहिजे.
                      </h2>
                      <h2>
                        {" "}
                        ३) परवाना ज्यासाठी दिला आहे त्या जागेतच उद्योगधंदा चालविला
                        पाहिजे. सार्वजनिक जागेवर अतिक्रमण करता कामा नये.
                      </h2>
                      <h2>
                        {" "}
                        ४) पिंपरी चिंचवड महानगरपालिकेने कोणत्याही कारणास्तव
                        जाहिरात परवाना रद्द केल्यास त्याविरुध्द न्यायालयात दाद
                        मागण्याचा हक्क मला राहणार नाही.
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
                        ७) निवासी विभागामध्ये असणा-या परवाना धारकाने रात्री ८.००
                        ते सकाळी ८.०० पर्यत व्यवसाय बंद ठेवला पाहिजे..
                      </h2>
                      <h2>
                        {" "}
                        ८) उद्योगधंदयापासून आजूबाजूच्या रहिवाश्यांना आवाजामुळे
                        किंवा उद्योगधंद्यामुळे निर्माण होणा-या वायुमुहे अगर
                        द्रवपदार्थामुळे उपद्रव होणार नाही किंवा धोका होणार नाही
                        याची काळजी घेतली पाहिजे.
                      </h2>
                      <h2>
                        {" "}
                        ९) उद्योगधंद्यापासून निचरा होणारे पाणी रसायने अगर इतर
                        कोणतेही द्रपदार्थ किंवा कचरा वा वायुमुळे अगर
                        द्रवपदार्थामुळे उपद्रव होणार नाही किंवा धोका होणार नाही
                        याची काळजी घेतली पाहिजे.
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
                        धारण करणे आवश्यक असतील असे सर्व परवाने धारण करणेची
                        जबाबदारी ही परवाना धारकावर राहील.
                      </h2>
                      <h2>
                        {" "}
                        १४) जाहिरात फलकाचा परवाना कालावधी संपल्यानंतर नुतनीकरण
                        करून घेणेची जबाबदारी माझी राहील तसेच नुतनीकरणासाठी अर्ज
                        सादर केला नाही. त्या कालावधीमध्ये सदरचा जाहिरात फलक
                        अतिवृष्टी, वारा, नैसर्गिक आपत्ती, किंवा अन्य कोणत्याही
                        कारणास्तव फलक पडुन जिवीत अथवा वित्त हानी झाल्यास त्याची
                        संपुर्णपणे कायदेशीर जबाबदारी फलक अस्तित्वात आहे तोपर्यंत
                        माझी राहील. त्या बाबत म.न.पास तोषीस लागून देणार नाही.
                      </h2>
                      <h2>
                        {" "}
                        १५) जाहिरात फलकाचे नुतनीकरण संपल्यानंतर किंवा मुदत
                        संपल्यानंतर सदरचा जाहिरात फलक संपुर्णपणे निष्कासित
                        करण्याची जबाबदारी माझी राहील.
                      </h2>
                      <h2>
                        १६) मनपाच्या विविध योजना व विविध उपक्रमाबाबत जाहिरात
                        फलकांवर दहा दिवस जाहिरात प्रसिध्द करून देणे बंधनकारक
                        राहील.
                      </h2>
                    </tr>
                  </div>
                </table>
              </Box>
            </Paper >
          </div >
        </div >
      </>
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
