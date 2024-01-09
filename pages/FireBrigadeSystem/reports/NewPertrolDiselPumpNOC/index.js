import { Button, Paper, Stack } from "@mui/material";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "./NewPertrolDiselPumpNOC.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import urls from "../../../../URLS/urls";
import { ErrorOutline } from "@mui/icons-material";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// http://localhost:4000//FireBrigadeSystem/reports/NewPertrolDiselPumpNOC
// Index
const Index = (props) => {
  const router = useRouter();
  const componentRef = useRef();
  const userToken = useGetToken();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [loadderState, setLoadderState] = useState(false);
  const language = useSelector((state) => state?.labels.language);

  const [disabledInputStateButton, setDisabledInputStateButton] =
    useState(false);

  const generateNoc = (fromData) => {
    setDisabledInputStateButton(true);

    const finalBody = {
      nocNo: props?.props?.nocNumber,
      nocType: props?.props?.nocType,
      id: props?.props?.id,
      role: "NOC_ISSUE",
    };

    // sweetAlert({
    //   title: "Confirmation",
    //   text: "Are you sure you want to submit the application ?",
    //   icon: "warning",
    //   buttons: ["Cancel", "Save"],
    // }).then((ok) => {
    //   if (ok) {
    axios
      .post(
        `${urls.FbsURL}/transaction/trnBussinessNOC/saveApplicationApprove`,
        finalBody,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          setDisabledInputStateButton(false);

          swal({
            title: "Noc Generated",
            text: "Noc generated successfully",
            icon: "success",
            button: "Ok",
          });

          //   router.back();
          router.push({
            pathname: "/FireBrigadeSystem/transactions/businessNoc/scrutiny",
          });
        }
      })
      .catch((err) => {
        setDisabledInputStateButton(false);
        console.log(err);
      });
    //   }
    // });
  };

  let date = moment(props?.props?.props?.applicationDate);

  let formattedDate = date.format("DD-MM-YYYY");
  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper className={styles.MainPaper}>
            <div className={styles.Title}>
              <h1> NOC</h1>
            </div>

            <ComponentToPrint
              ref={componentRef}
              props={props}
              formattedDate={formattedDate}
            />
          </Paper>
          <br />
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            spacing={2}
            direction="row"
            // className={styles.Stack}
          >
            <Button
              size="small"
              onClick={() => {
                router.push({
                  pathname:
                    "/FireBrigadeSystem/transactions/businessNoc/scrutiny",
                });
              }}
              type="button"
              variant="contained"
              color="primary"
            >
              {<FormattedLabel id="back" />}
            </Button>
            <Button
              size="small"
              variant="contained"
              type="primary"
              onClick={handlePrint}
            >
              {language == "en" ? "Print" : "प्रिंट"}
            </Button>
            {console.log(
              "this?.props?.props?.props?.applicationStatus",
              props?.props
            )}
            {props?.props?.applicationStatus == "NOC_ISSUED_TO_CITIZEN" ? (
              <></>
            ) : (
              <Button
                disabled={disabledInputStateButton}
                size="small"
                variant="contained"
                // type='primary'
                onClick={generateNoc}
              >
                {language == "en" ? "Generate Noc" : "एनओसी तयार करा"}
              </Button>
            )}
          </Stack>
        </div>
      )}
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    console.log("this?.props?.props?.props", this?.props);
    return (
      <div className={styles.MainDiv}>
        <table className={styles.Table}>
          <tr className={styles.TitleHeaderImage}>
            <td>
              <img
                className={styles.img1}
                src="/logo.png"
                alt="Maharashtra Logo"
              ></img>
            </td>
            <td className={styles.tt}>
              <div className={styles.div1}>पिंपरी चिंचवड महानगरपालिका</div>
              <div className={styles.div2}>अग्निशमन विभाग</div>
              <div className={styles.div3}>
                Pimpri Chinchwad Municipal Corporation
              </div>
              <div className={styles.div4}>Fire Department.</div>
            </td>
            <td>
              <img
                src="/rts_servicelogo.png"
                alt="Maharashtra Logo"
                className={styles.img2}
              ></img>
            </td>
          </tr>

          <tr className={styles.FileOwc}>
            <td>
              <strong>File No:- </strong>
            </td>
            <td>
              <strong>O.W.No:-Fire/01/SRC-449/WS/2021</strong>
            </td>
            <td>
              <strong>
                Date:-{" "}
                {moment(new Date().toLocaleString()).format("DD-MM-YYYY")}{" "}
              </strong>
            </td>
          </tr>

          <hr className={styles.hr}></hr>
          <tr className={styles.Name1}>
            <td>
              <strong>
                अग्निशामक ना हरकत दाखला (पेट्रोल व डिझेल पंप व्यवसाय)
              </strong>
            </td>
          </tr>
          <tr className={styles.Token}>
            <td>{/* <strong>Token No:- 103321220012060</strong> */}</td>
            <td>{/* <strong>Token Dt: 13/12/2021</strong> */}</td>
          </tr>
          <tr className={styles.TextArea}>
            <td>
              <strong>{this?.props?.props?.props?.firmName} ,</strong>{" "}
              {this?.props?.props?.props?.businessAddress}, दिनांक-
              {this?.props?.formattedDate}, वे पेट्रोल व डिझेल पंप व्यवसाय
              करणेकामी (प्रथम) अतिशामक ना हरकत दाखल्याची मागणी केली आहे. सदर
              इमारतीकरिता तात्पुरता म ना हरकत दाखला //का.वि./२३६/२००७, दि.
              १९/०१/२००७ रोजी नुसार प्राप्त करत बाला असून मदर इमारतीकरिता अंतिम
              अमिन ना हरकत दाखला Fire/01/5RC/396/WS/678/2021, दि. २४/११/२०२१
              रोजी जुगार प्राप्त करणेत आला आहे. सदर पेट्रोल विझेल पंप व्यवसाय
              जागेची तपासणी अग्निशामक दलाचे अधिकारी{" "}
              {this?.props?.props?.props?.siteVisit?.siteVisitPerson} यांनी
              दिनांक{" "}
              {moment(this?.props?.props?.props?.siteVisit?.visitDate).format(
                "DD-MM-YYYY"
              )}{" "}
              रोजी समक्ष जावुन तांत्रिक तपासणी केली खालील अटींवर ना हरकत दाखला
              देणेत येत आहे.
            </td>
          </tr>

          <tr>
            <td>
              <ol>
                <li>
                  सदरचा ना हरकत दाखला पेट्रोल आणि डिझेल (पेट्रोल समता ३० KL x १
                  टाकी आणि पॉवर पेट्रोल १५ KL x १ टा डिन क्षमता १५ KL X १ टाकी
                  तसेच एकूण फ्युल डिस्पेनिंग एप ०४ नग माहेत.) इंधन विक्रीसाठी
                  व्यवसाय करणे पुरताच मर्यादित राहील.
                </li>
                <li>सदर खालील प्रमाणे अग्रिशामक उपकरणे ठेवली आहेत.</li>

                <li>
                  सदर खालील प्रमाणे अग्रिशामक उपकरणे ठेवली आहेत.
                  <ul>
                    <li>
                      ए.बी.सी. शामक साधने १० कि. क्षमता थे ०८ नग आहेत. नग.
                    </li>
                    <li>ए.बी.सी. ग्राम माने ७९ कि. क्षमता २ नग आहे.</li>
                    <li>ए.बी.सी. अनामक साधने ५० कि. क्षमता ३ नग आहे.</li>
                    <li>एम. फोम ४५ लिटर्स अामक साधने ३ नग आहेत.</li>
                    <li>एम फोम ०९ निटर्स अग्रिशामक साधने नग आहेत.</li>
                    <li>
                      सैन्य बकेट (वाळूने भरलेल्या बादल्या ९ नि. क्षमता मे ०५ नग
                      आहेत.
                    </li>
                  </ul>
                </li>
                <li>
                  अग्रिशामक साधने / यंत्रणा हाताळण्याचे/ वापराचे प्रशिक्षण
                  कर्मचा-यांना देणेत आले आहे.
                </li>
                <li> सदर जागेत धुम्रपान निषेध बोर्ड लावले आहेत.</li>
                <li>
                  सदर जागेत महत्त्वाचे दुरध्वनी क्रमांक ठळक अक्षरात लावनेत
                  पोलीस, अग्रिशामक दल, ई.
                </li>
                <li>सदर जागेत असलेला पाण्याचा साठा सतत उपलब्ध ठेवला आहे.</li>
                <li>
                  सदर जागेत मनपा तसेच Statutory Bodies चे पूर्वपरवानगीशिवाय फेर
                  फार बदल करुन नये.
                </li>
                <li>
                  मनपा ने वेळोवेळी केलेले नियम व उपविधी आपणावर बंधनकारक राहतील.
                </li>
                <li>
                  सदर ना हरकत दाखल्याचे दरवर्षी ३१ मार्च पूर्वी नुतनीकरण करून
                  घेणे बंधनकारक राहील.
                </li>
                {console.log()}

                <li>
                  सदर ना हरकत दाखल्याची मुदत दिनांक.{" "}
                  {moment(this?.props?.props?.props?.nocEndDate).format(
                    "DD-MM-YYYY"
                  )}{" "}
                  पर्यंत राहील.
                </li>
                <li>वरील सर्व अटींची पुर्तता केली आहे. (क. १ ते ६ पर्यंत).</li>
                <li>
                  ना हरकत दाखला केवळ प्रतिबंधात्मक दृष्टिने देणेत येत आहे. गदर
                  व्यवसायासाठी पिंपरी चिंचवड मनपाचे इतर खात्यांची शासकिय,
                  निमशासकिय चात्यांची परवानगी आवश्यकतेनुसार घेण्यात यावी.
                </li>
                <li>
                  अर्जदार यांनी त्यांच्याकडील भावणेत जानेली अक्षिमन यंत्रणा
                  सुस्थितीत व वापरणे योग्य असल्याबाबत अधिकृत फायर लायसन्सधारक
                  यांचेकडील विहित नमुन्यातील "बी फॉर्म' दरवर्षी माहे जानेवारी व
                  माहे जुलै मध्ये अद्विशामक विभागाच्या मुख्य कार्यालयात सादर
                  करणे आवश्यक आहे. तथापि (महाराष्ट्र महानगरपालिका अधिनियम, १९४९
                  चे कलम ३८६ (३) नुसार ज्या माहिती व आपण सादर केलेल्या
                  कागदपत्रांच्या आधारे उक्त ना हरकत दाखला दिला आहे. ती माहिती
                  अथवा कागदपत्रे विपर्यास अथवा उक्त अती उत्पन झाल्यास / केल्यास
                  आपण कारवाईस पात्र रहास सदर दाखला त्याचवेळेस रद्द समजणेत येईन.
                </li>
                <li>
                  सदर पेट्रोल व डिझेल पंप करिता विद्युत निरीक्षक कार्यालय मेरवडा
                  येथील विद्युत सुरक्षितता प्रमाणपत्र पुढील ६ महिन्यांच्या
                  कालावधीत प्रास करणेच्या अटीस अधीन राहून सदर पेट्रोल व डिझेल
                  पंप व्यवसाय कामी अग्रिशमन ना हरकत दाखला देणेत येत आहे तसेच पुल
                  नुतनीकरण करतेवेळी सदरील प्रमाणपत्रे / दस्तावेज सादर करणे
                  आवश्यक असेल याची संबंधितांनी विशेष नोंद घ्यावी.
                </li>
              </ol>
            </td>
          </tr>
          <br />
          <br />
          <tr className={styles.Bottom1}>
            <td>
              <strong>मुख्य अग्निशमन अधिकारी</strong>
            </td>
          </tr>

          <tr className={styles.Bottom2}>
            <td>
              <strong>पिंपरी चिंचवड महानगरपालिका</strong>
            </td>
          </tr>

          <tr className={styles.Bottom3}>
            <td>
              <strong> पिंपरी-411018.</strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>प्रति,</strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>{this?.props?.props?.props?.firmName}, </strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>
                पत्ता:- {this?.props?.props?.props?.businessAddress},
                {/* स.न. १५३७, भक्ती प्रेमीयम, जुना पुणे-मुंबई हायवे, फुगेवाडी
                दापोडी, पुणे - १२. */}
              </strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>
                {/* (अग्नि सेवा शुल्क रु १५००/- पा. क्र.३०३३२१२२००३१९१२,
                दि.२९/०३/२०२२ नुसार स्विकारलेत तसेच शिल्लक र.रु.१२,४००/- पा.
                क्र. ३०३३२२२३००००७०९ दि. ०८/०४/२०२२ नुसार स्विकारलेत.) */}{" "}
                (अग्नि सेवा शुल्क र.रु{" "}
                {this?.props?.props?.props?.loi?.allTotal}/- पा. क्र.
                {this?.props?.props?.props?.loi?.loiNO}, दिनांक{" "}
                {moment(this?.props?.props?.props?.loi?.loiDate).format(
                  "DD-MM-YYYY"
                )}{" "}
                स्विकारलेत आणि शिल्लक शुल्क र.रु.९,९००/- पा.क्र.३०३३२१२२०००६७३३,
                दिनांक १६/०७/२०२१ नुसार स्विकारलेत. )
              </strong>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Index;
