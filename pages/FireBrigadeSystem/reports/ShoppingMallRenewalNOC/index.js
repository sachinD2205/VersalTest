import { Button, Paper, Stack } from "@mui/material";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "./ShoppingMallRenewalNOC.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// http://localhost:4000//FireBrigadeSystem/reports/ShoppingMallRenewalNOC
// Index
const Index = (props) => {
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [loadderState, setLoadderState] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const [disabledInputStateButton, setDisabledInputStateButton] =
    useState(false);

  const generateNoc = (fromData) => {
    setDisabledInputStateButton(true);
    console.log("fromData", fromData);

    const finalBody = {
      nocNo: props?.props?.nocNumber,
      nocType: props?.props?.nocType,
      id: props?.props?.id,
      role: "NOC_ISSUE",
    };

    console.log("finalBody", finalBody);

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
        setDisabledInputStateButton(false);

        if (res.status == 200) {
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
      });
    //   }
    // });
  };
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
            {/* <Stack spacing={5} direction='row' className={styles.Stack}>
              <Button
                onClick={() => {
                  router.push("/FireBrigadeSystem");
                }}
                type='button'
                variant='contained'
                color='primary'>
                {<FormattedLabel id='back' />}
              </Button>
              <Button variant='contained' type='primary' onClick={handlePrint}>
                {language == "en" ? "Print" : "प्रिंट"}
              </Button>
            </Stack> */}

            <ComponentToPrint ref={componentRef} />
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
              <strong>O.W.No:- Fire/01/5RC-684/ Ws/20/2022.</strong>
            </td>
            <td>
              <strong>Date:- 08/04/2022</strong>
            </td>
          </tr>

          <hr className={styles.hr}></hr>
          <tr className={styles.Name1}>
            <td>
              <strong>
                अग्निशामक ना हरकत दाखला (शॉपिंग मॉल व्यवसाय नूतनीकरण)
              </strong>
            </td>
          </tr>
          <tr className={styles.Token}>
            <td>
              <strong>Token No:- 103321220018991</strong>
            </td>
            <td>
              <strong>Token Dt:- 29/03/2022</strong>
            </td>
          </tr>
          <tr className={styles.TextArea}>
            <td>
              <strong>
                {" "}
                मे. मेगा मार्ट, अरविंद लाइफस्टाईल ब्रान्ड्स लिमिटेड
              </strong>{" "}
              यांनी दिनांक <strong> २९/०३/२०२२</strong> विनंती अर्जानुसार
              <strong> शॉपिंग मॉल व्यवसाय </strong> करणेकामी अग्निशामक ना हरकत
              दाखल्याची मागणी केली आहे. सदर इमारतीकरिता तात्पुरता अग्रिशमन ना
              हरकत दाखला क्र. अग्नि /२/का.वि./२३६/२००७, दि. २९/०२/२००७ रोजी
              नुसार प्राप्त करणेत आला असून{" "}
              <strong>
                {" "}
                सदर इमारतीकरिता अंतिम अग्निशमन ना हरकत दाखला क्र.
                Fire/04/S/383/2008, दि. 16/01/2008 रोजी नुसार प्राप्त करणेत आला
                आहे.
              </strong>
              &nbsp; सदर{" "}
              <strong>
                मे. मेगा मार्ट, अरविंद लाइफस्टाइल ब्रान्ड्स लिमिटेड, स.न. १५३७,
                भक्ती प्रेमीयम, जुना पुणे-मुंबई हायवे, फुगेवाडी दापोडी पुणे-
                ४११०१२
              </strong>{" "}
              आणि हॉटेलच्या बाहेरील बाजूस एल.पि.जी. गॅस बैंक आहे. खालील अटीवर ना
              हरकत दाखला देणेत येत आहे. येथील व्यवसाय जागेची तपासणी अग्रिशामक
              दलाचे अधिकारी यांनी <strong> दिनांक ३१/०३/२०२२ </strong> रोजी
              समक्ष जावुन तात्रिक तपासणी केली असून सदर हॉटेल मध्ये एल.पि.जी. गॅस
              रेटीग्युलेशन सिस्टिम आहे तसेच किचनमध्ये फ्युम हूड सप्रेशन सिस्टिम
              बसविण्यात आलेली आहे.
            </td>
          </tr>

          <tr>
            <td>
              <ol>
                <li>
                  एकुण बांधकाम <b> ३५११.८३ </b> घो. मि. असून लॉजोग रूम ची
                  व्यवस्था उपलब्ध नाही.
                </li>
                <li>
                  सदरचा ना हरकत दाखला <strong> शॉपिंग मॉल </strong> व्यवसाय करणे
                  पुरताच मर्यादित राहील.
                </li>

                <li>
                  सदर खालील प्रमाणे अग्रिशामक उपकरणे ठेवली आहेत.
                  <ul>
                    <li>
                      अ) डॉ.सी.पी. व कार्बन डाय ऑक्साईड अनिशामक साधने एकूण ५६
                      नग.
                    </li>
                    <li>ब) ३. एच.पी. बुस्टर पंप आणि हायड्रेट सिस्टिम.</li>
                    <li>क) फायर डिटेक्टशन आणि आलामें सिस्टिम.</li>
                  </ul>
                </li>
                <li>
                  अग्रिशामक साधने / यंत्रणा हाताळण्याचे / वापराचे प्रशिक्षण
                  कर्मचा-यांना देणेत आले आहे.
                </li>
                <li>सदर जागेत धुम्रपान निषेध बोर्ड लावले आहेत.</li>
                <li>
                  सदर जागेत महत्त्वाचे दुरध्वनी क्रमांक ठळक अक्षरात लावलेत,
                  पोलीस, अग्रिशामक दल, ई
                </li>
                <li>सदर जागेत असलेला पाण्याचा साठा सतत उपलब्ध ठेवणेत यावा.</li>
                <li>
                  सदर जागेत मनपा तसेच Statutory Bodies चे पुर्वपरवानगीशिवाय फेर
                  फार / बदल करुन नये.
                </li>
                <li>
                  मनपा ने वेळोवेळी केलेले नियम व उपविधी आपणावर बंधनकारक राहतील.
                </li>
                <li>
                  वरील सर्व अटींची पुर्तता केली आहे. (क्र. १ ते ७ पर्यंत).
                </li>
                <li>
                  सदर ना हरकत दाखल्याची मुदत दिनांक <b> ३१/०३/२०२३ </b>
                  रोजी पर्यंत राहील.
                </li>
                <li>
                  सदरचा ना हरकत दाखला केवळ अग्रिप्रतिबंधात्मक व सुरक्षिततेच्या
                  दृष्टिने देणेत येत आहे. सदर व्यवसायासाठी, पिंपरी चिंचवड मनपाचे
                  इतर खात्यांची शासकिय, निमशासकिय खात्यांची परवानगी
                  आवश्यकतेनुसार घेण्यात यावी.
                </li>
                <li>
                  महाराष्ट्र महानगरपालिका अधिनियम, १९४९ चे कलम ३८६ (३) नुसार)
                  ज्या माहिती व आपण सादर केलेल्या कागदपत्राच्या आधारे उक्त ना
                  हरकत दाखला दिला आहे. ती माहिती अथवा कागदपत्रे विपर्यास अथवा
                  उक्त अटी/शतीचे उल्लंघन झाल्यास / केल्यास आपण कारवाईस पात्र
                  रहाल. सदर दाखला त्याचवेळेस रद्द समजणेत येईल.
                </li>
                <li>
                  अर्जदार यांनी त्यांच्याकडील लावणेत आलेली अग्रिशमन यंत्रणा
                  सुस्थितीत व वापरणे योग्य असल्याबाबत अधिकृत फायर लायसन्सधारक
                  यांचेकडील विहित नमुन्यातील "बी फॉर्म" दरवर्षी माहे जानेवारी व
                  माहे जुलै मध्ये अग्रिशामक विभागाच्या मुख्य कार्यालयात सादर
                  करणे आवश्यक आहे.
                </li>
                <li>
                  सदर संबंधित अर्जदार श्री. असिफ अब्बास लालजी यांनी सादर केलेले
                  हमीपत्रमध्ये नमूद केलेप्रमाणे सदर मॉल इमारतीमध्ये ऑटोमेटिक
                  वॉटर स्प्रिंकलर सिस्टिम बसविणेच्या अटिस अधिन राहून अग्रिशमन
                  अग्नि. ना. ह. दाखला देणेत येत आहे.
                </li>
              </ol>
            </td>
          </tr>

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
              <strong>मे. अरविंद लाइफस्टाईल ब्रान्ड्स लिमिटेड</strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>
                पत्ता:- मे. मेगा मार्ट, अरविंद लाइफस्टाईल ब्रान्ड्स लिमिटेड,
                स.न. १५३७, भक्ती प्रेमीयम, जुना पुणे-मुंबई हायवे, फुगेवाdi
                दापोडी, पुणे - १२.
              </strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>
                (अग्नि सेवा शुल्क रु १५००/- पा. क्र.३०३३२१२२००३१९१२,
                दि.२९/०३/२०२२ नुसार स्विकारलेत तसेच शिल्लक र.रु.१२,४००/- पा.
                क्र. ३०३३२२२३००००७०९ दि. ०८/०४/२०२२ नुसार स्विकारलेत.)
              </strong>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Index;
