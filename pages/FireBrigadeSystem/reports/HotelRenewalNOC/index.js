import { Button, Paper, Stack } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "./HotelRenewalNOC.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// http://localhost:4000//FireBrigadeSystem/reports/HotelRenewalNOC
// Index
const Index = (props) => {
  // to set current date and time
  const userToken = useGetToken();

  useEffect(() => {
    console.log("props", props?.props);
  }, []);

  const [disabledInputStateButton, setDisabledInputStateButton] =
    useState(false);

  const generateNoc = (fromData) => {
    console.log("fromData", fromData);
    setDisabledInputStateButton(true);

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
      });
    //   }
    // });
  };

  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [loadderState, setLoadderState] = useState(false);
  const language = useSelector((state) => state?.labels?.language);
  const user = useSelector((state) => state?.user?.user);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper className={styles.MainPaper}>
            <div className={styles.Title}>
              <h1>Business NOC</h1>
            </div>
            <ComponentToPrint ref={componentRef} props={props} user={user} />
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
    console.log("this?.props?.props?.props", this?.props?.user);

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
            <td>{/* <strong>File No:- </strong> */}</td>
            <td>
              <strong>{this?.props?.props?.props?.nocNo}</strong>
            </td>
            <td>
              {/* <strong>Date:-06/10/2021</strong> */}
              <p>
                <strong> Date:- </strong>
                {/* {new Date().toLocaleString()} */}
                {moment(Date.now()).format("DD-MM-YYYY")}
              </p>
            </td>
          </tr>

          <hr className={styles.hr}></hr>
          <tr className={styles.Name1}>
            <td>
              <strong>अग्निशामक ना हरकत दाखला </strong>
            </td>
          </tr>
          <tr className={styles.Token}>
            <td>{/* <strong>Token No:- 103320210010812</strong> */}</td>
            <td>{/* <strong>Token Dt:- /03/2021</strong> */}</td>
          </tr>
          <tr className={styles.TextArea}>
            <td>
              मे. {this?.props?.props?.props?.firmName}
              यांनी दिनांक{" "}
              {moment(this?.props?.props?.props?.nocStartDate).format(
                "DD-MM-YYYY"
              )}{" "}
              &{" "}
              {moment(this?.props?.props?.props?.nocEndDate).format(
                "DD-MM-YYYY"
              )}{" "}
              चे विनंती अर्जानुसार हॉटेल व्यवसाय करणेकामी अग्निशामक ना हरकत
              दाखल्याची मागणी केली आहे. सदर मे.{" "}
              {this?.props?.props?.props?.firmName},{" "}
              {this?.props?.props?.props?.applicantAddress} सदर इमारतीकरिता
              अंतिम अग्निशमन ना हरकत दाखला क्र.{" "}
              {this?.props?.props?.props?.nocNo}, दि.{" "}
              {moment(Date.now()).format("DD-MM-YYYY")
                ? moment(Date.now()).format("DD-MM-YYYY")
                : "--"}{" "}
              रोजी देणेत आला आहे. येथील व्यवसाय जागेची तपासणी अग्रिशामक दलाचे
              अधिकारी {this?.props?.props?.props?.nocNo} यांनी दिनांक{" "}
              {/* {this?.props?.user?.userDao?.firstNameMr +
                " " +
                this?.props?.user?.userDao?.middleNameMr +
                " " +
                this?.props?.user?.userDao?.lastNameMr} */}
              {this?.props?.props?.props?.siteVisit?.siteVisitPerson}
              {this?.props?.props?.props?.siteVisitDate} रोजी समक्ष जावून
              तांत्रिक तपासणी केली असून सदर हॉटेल मध्ये एल.पि.जो. गॅस
              रेटोग्युलेशन सिस्टिम आहे तसेच किचनमध्ये फ्युम हुड सप्रेशन सिस्टिम
              बसविण्यात आलेली आहे. आणि हॉटेलच्या बाहेरील बाजूस एल.पि.जी. गॅस बँक
              आहे. खालील अटीवर ना हरकत दाखला देणेत येत आहे.
            </td>
          </tr>

          <tr>
            <td>
              <ol>
                <li>
                  एकुण बांधकाम कार्पेट एरिया{" "}
                  {this?.props?.props?.props?.hotelDTLDao?.carpetArea
                    ? this?.props?.props?.props?.hotelDTLDao?.carpetArea
                    : "--"}{" "}
                  चौ.फु. (चार्जेबल एरिया{" "}
                  {this?.props?.props?.props?.hotelDTLDao?.chargebalArea
                    ? this?.props?.props?.props?.hotelDTLDao?.chargebalArea
                    : "--"}{" "}
                  चौ. फू.) असून लॉजोग रूम ची व्यवस्था उपलब्ध नाही.
                </li>
                <li>
                  सदरचा ना हरकत दाखला हॉटेल व्यवसाय करणे पुरताच मर्यादित राहील.
                </li>

                <li>
                  सदर खालील प्रमाणे अग्निशामक उपकरणे ठेवली आहेत.
                  <ul>
                    <li>
                      a) A.B.C. अग्निशामक यंत्रे 06 कि.मी. क्षमता 02 संख्या
                    </li>
                    <li>
                      ब) A.B.C. मॉड्यूलर अग्निशामक यंत्रे 05 कि.मी. क्षमता 01
                      क्र.
                    </li>
                  </ul>
                </li>
                <li>
                  अग्रिशामक साधने / यंत्रणा हाताळण्याचे/वापराचे प्रशिक्षण
                  कर्मचा-यांना देणेत आले आहे.
                </li>
                <li>सदर जागेत धुम्रपान निषेध बोर्ड लावले आहेत.</li>
                <li>
                  सदर जागेत महत्त्वाचे दुरध्वनी क्रमांक ठळक अक्षरात लावलेत,
                  पोलीस, अग्निशामक दल.इ.
                </li>
                <li>सदर जागेत असलेला पाण्याचा साठा सतत उपलब्ध ठेवणेत यावा.</li>
                <li>
                  सदर जागेत मनपा तसेच Statutory Bodies चे पुर्वपरवानगीशिवाय फेर
                  फार / बदल करुन नये.
                </li>
                <li>
                  मनपा ने वेळोवेळी केलेले नियम व उपविधी आपणावर बंधनकारक राहतील.
                </li>
                <li>वरील सर्व अटींची पुर्तता केली आहे. (क्र. १ ते ७ पर्यंत)</li>
                <li>
                  सदर ना हरकत दाखल्याची मुदत दिनांक ३१/०३/२०२२ पर्यंत राहील.
                </li>
                <li>
                  सदरचा ना हरकत दाखला केवळ अग्निप्रतिबंधात्मक व
                  जीव-सुरक्षिततेच्या दृष्टिने देणेत येत आहे. तथापि, सदर हॉटेल
                  व्यवसायासाठी, पिंपरी चिंचवड मनपाचे तसेच अन्य शासकिय, निमशासकिय
                  खात्यांची परवानगी आवश्यकतेनुसार घेण्यात यावी.
                </li>
                <li>
                  महाराष्ट्र महानगरपालिका अधिनियम, १९४९ चे कलम ३८६(२) नुसार)
                  ज्या माहिती व आपण सादर केलेल्या कागदपत्रांच्या आधारे उक्त ना
                  हरकत दाखला दिला आहे. तो माहिती अथवा कागदपत्रे विपर्यास अथवा
                  उक्त अटी/शतीचं उल्लंघन झाल्यास/केल्यास आपण कारवाईस पात्र रहाल.
                  सदर दाखला त्याचवेळेस रद्द समजणेत येईल.
                </li>
                <li>
                  अर्जदार यांनी त्यांच्याकडील लावणेत आलेली अग्रिक्षमन यंत्रणा
                  सुस्थितीत व वापरणे योग्य असल्याबाबत अधिकृत फायर लायसन्स धारक
                  यांचेकडील विहित नमुन्यातील “वो फॉर्म दरवर्षी माहे जानेवारी व
                  माहे जुलै मध्ये अग्निशामक विभागाच्या मुख्य कार्यालयात सादर
                  करणे आवश्यक आहे.
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
              <strong>
                मे, अप्पालूसा फूड प्रा. लि. युनिट नं.-९, एफ. सी.-४, एल्प्रो सिटी
                स्क्वेअर, स.नं.१७७ आणि २८०, सि.टी.एस. नं. ४२७०,चिंचवड, पुणे.
              </strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>
                (आगाऊ सेवा शुल्क रु. {this?.props?.props?.props?.loi?.allTotal}
                /- Application.No.
                {this?.props?.props?.props?.applicationNo}, dt.&nbsp;
                {/* {new Date().toLocaleString()} */}
                {moment(Date.now()).format("DD-MM-YYYY")})
                {/* &nbsp;आणि शुल्क रु.
                {this?.props?.props?.props?.loi?.allTotal}/- स्वीकारले. */}
              </strong>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Index;
