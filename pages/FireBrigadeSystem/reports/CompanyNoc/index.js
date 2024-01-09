import React, { useEffect, useRef, useState } from "react";
import styles from "./view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card, Grid, Stack } from "@mui/material";
import urls from "../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = (props) => {
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const generateNoc = (fromData) => {
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

  const componentRef = useRef(null);
  const router = useRouter();

  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  let date = moment(props?.props?.props?.applicationDate);

  let formattedDate = date.format("DD-MM-YYYY");

  console.log("date", formattedDate);

  useEffect(() => {
    console.log("props", props?.props);
    if (router.query.id && router.query.serviceId) {
      axios
        .get(
          `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${router.query.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("r.data", r.data);
          setData(r.data);
        });
    }
  }, []);

  return (
    <>
      <div>
        <ComponentToPrint
          data={data}
          ref={componentRef}
          props={props}
          formattedDate={formattedDate}
        />
      </div>
      <br />
      <br />
      {/* Button for Print and Exit */}
      {/* <div className={styles.btn}>
        <Button variant='contained' type='primary' onClick={handlePrint}>
          print
        </Button>
        <Button
          type='primary'
          variant='contained'
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Exit
        </Button>
      </div> */}
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
            router.push("/FireBrigadeSystem");
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
        <Button
          size="small"
          variant="contained"
          // type='primary'
          onClick={generateNoc}
        >
          {language == "en" ? "Generate Noc" : "एनओसी तयार करा"}
        </Button>
      </Stack>
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div className={styles.mainBox}>
          <div className={styles.reportContainer}>
            <div className={styles.header}>
              <div className={styles.one}>
                <img src="/logo.png" alt="" height={160} width={160} />
              </div>

              <div className={styles.second}>
                <div className={styles.pcm}>
                  <b>पिंपरी-चिंचवड महानगरपालिका</b>
                </div>
                <div className={styles.pcmMiddle}>
                  <b>अग्निशमन विभाग</b>
                </div>
                <div className={styles.pcmSecond}>
                  <h4>
                    <b>Pimpri Chinchwad Municipal Corporation</b>
                  </h4>
                </div>
              </div>
              <div className={styles.one}>
                <img
                  src="/rts_servicelogo.png"
                  alt=""
                  height={170}
                  width={170}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <h2>Fire Department</h2>
            </div>

            <div className={styles.reportContent}>
              <div className={styles.sHeadingg}>
                <h3>{/* File No:- <span></span> */}</h3>

                <h3>
                  O.W.No:- Fire/01/5PC/WS/<span></span>/2022
                </h3>

                <h3>
                  Date:-
                  {moment(new Date().toLocaleString()).format(
                    "DD-MM-YYYY"
                  )}{" "}
                </h3>
              </div>
              <div className={styles.footer}>
                <b>
                  <p>
                    ................................................................................................................................................................................................................................................
                  </p>
                </b>
              </div>
              <br />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2>
                  <u>अग्रिशामक ना हरकत दाखला - (कंपनी/कारखाने)</u>
                </h2>
              </div>
              <br />
              <div className={styles.sHeadingg}>
                <div>{/* <h3>Token No:-103322230010950</h3> */}</div>

                <div>{/* <h3>Token Dt:- 21/10/2022</h3> */}</div>
              </div>
              {console.log("this?.props", this?.props?.props?.props)}
              <p></p>
              <p>
                <b>{this?.props?.props?.props?.firmName}</b> यांनी दिनांक{" "}
                <b>{this?.props?.formattedDate}</b> चे विनंती अर्जानुसार कंपनी
                उद्योगधंदा व्यवसाय करणेकामी अग्निशामक ना हरकत दाखल्याची मागणी
                केली आहे.
                <b>
                  {" "}
                  सदर दाखला व्यवसाय धारकाने कंपनी / कारखाना इमारतकरिता तात्पुरता
                  अग्निशमन ना.. क्र.. Fire / 01/SRC-117/WS/192/2020, दि.{" "}
                  {moment(Date.now()).format("DD-MM-YYYY")} रोजी प्राप्त केला
                  आहे. सदर {this?.props?.props?.props?.firmName}{" "}
                  {this?.props?.props?.props?.businessAddress}
                </b>{" "}
                येथील व्यवसाय जागेची तपासणी अग्निशामक दलाचे अधिकारी{" "}
                {this?.props?.props?.props?.siteVisit?.siteVisitPerson} यांनी{" "}
                <b>
                  दिनांक{" "}
                  {moment(
                    this?.props?.props?.props?.siteVisit?.visitDate
                  ).format("DD-MM-YYYY")}{" "}
                  रोजी
                  {/* वार गुरुवार*/}{" "}
                </b>
                समक्ष जावुन ताजिक तपासणी केली खालील अटीवर ना हरकत दाखला देणेत
                येत आहे,
              </p>

              <ol>
                <li>
                  सदर कंपनी उद्योगधंदा जागेचे एकुण बांधकाम{" "}
                  {this?.props?.props?.props?.area} चौ.मी. आहे.{" "}
                </li>
                <li>
                  सदरचा ना हरकत दाखला कंपनी उद्योगधंदा व्यवसाय करणे पुरताच
                  मर्यादित राहील.
                </li>
                <li>
                  सदर खालील प्रमाण अग्निशानक उपकरण ठेवली आहेत :<br />{" "}
                  <span
                    style={{
                      marginLeft: "20px",
                    }}
                  >
                    {" "}
                    अ) फायर पंप सिस्टीम, ऑटोमेटीक वॉटर स्प्रिंकलर सिस्टीम, फायर
                    हायडन्ट स्टिीम, ऑटोनेटीक फायर डिटेक्टशन सिस्टीम, फायर आलार्म
                    सिस्टीम एक्सटियुशवसविणेत आले आहे.
                  </span>
                </li>

                <li>
                  अग्निशामक साधने / यंत्रण हाताळण्याचे / वापराचे प्रशिक्षण
                  कर्मचा-यांना देणेत आले आहे.
                </li>
                <li>सदर जागेत धुम्रपान निषेध बोर्ड लावले आहेत.</li>
                <li>
                  सदर जागेत महत्त्वाचे दुरध्वनी क्रमांक ठळक अक्षरात लावलेत.
                  पोलीस, अग्रिशमक दल, ई.
                </li>
                <li>सदर जागेत असलेला पाण्याचा साठा सतत उपलब्ध ठेवणेत यावा.</li>
                <li>
                  {" "}
                  सदर जागेत मनपा तसेच Statutory Bodies चे पुर्वपरवानगीशिवाय फेर
                  फार / बदल करुन नये.
                </li>
                <li>
                  मनपा ने वेळोवेळी केलेले नियम व उपविधी आपणावर बंधनकारक राहतील.
                </li>
                <li>वरील सर्व अटींची पुर्तता केली आहे. (क्र. १ ते ७ पर्यंत)</li>
                <li>
                  {" "}
                  सदर ना हरकत दाखल्याची मुदत दिनांक {
                    this?.props?.nocEndDate
                  }{" "}
                  रोजी पयंत राहील,{" "}
                </li>
                <li>
                  {" "}
                  सदरचा ना हरकत दाखला केवळ अग्निप्रतिबंधात्मक व सुरक्षिततेच्या
                  दृष्टिने देणेत येत आहे. सदर व्यवसायासाठी, पिंपरी चिंचवड मनपाचे
                  इतर खात्यांची, शासकिय, निमशासकिय खात्यांची परवानगी
                  आवश्यकतेनुसार घेण्यात यावी.
                </li>
                <li>
                  महाराष्ट्र महानगरपालिका अधिनियम, १९४९ चे कलम ३८६(३) नुसार ज्या
                  माहिती व आपण सादर केलेल्या कागदपत्रांच्या आधारे उक्त ना हरकत
                  दाखला दिला आहे. ती माहिती अथवा कागदपत्रे विपर्यास अथवा उक्त
                  अटी/शर्तीचे उल्लंघन झाल्यास/केल्यास आपण कारवाईस पात्र रहाल.
                  सदर दाखला त्याचवेळेस रद्द समजणेत येईल.
                </li>
                <li>
                  {" "}
                  अर्जदार यांनी त्यांच्याकडील लावणेत आलेली अग्निक्षमन यंत्रणा
                  सुस्थितीत व वापरणे योग्य असल्याबाबत अधिकृत फायर लायसन्स धारक
                  यांचेकडील विहित नमुन्यातील "बी फॉर्म', दरवर्षी माहे जानेवारी व
                  माहे जुलै मध्ये अग्निशामक विभागाच्या कार्यालयात सादर करणे
                  आवश्यक आहे.
                </li>
              </ol>

              <div></div>
              <br />
              <br />
              <br />

              <div>
                <div className={styles.mFooter}>
                  <p>
                    {" "}
                    <div className={styles.footer}>
                      <b> मुख्य अग्निशमन अधिकारी </b>
                    </div>
                    <div className={styles.footer}>
                      <b>पिंपरी चिंचवड महानगरपालिका, पिंपरी-१८</b>{" "}
                    </div>
                  </p>
                </div>
              </div>
              <br />
              <br />
              <div>
                <div className={styles.lFooter}>
                  <p>
                    {" "}
                    <div>
                      <b> प्रति, </b>
                    </div>
                    <div>
                      <b>{this?.props?.props?.props?.firmName} </b>{" "}
                    </div>
                    <div className={styles.footer}>
                      <b> {this?.props?.props?.props?.businessAddress}</b>{" "}
                    </div>
                  </p>
                </div>
              </div>
              <br />

              <div>
                <p>
                  <b>
                    {" "}
                    (अग्नि सेवा शुल्क र.रु{" "}
                    {this?.props?.props?.props?.loi?.allTotal}/- पा. क्र.
                    {this?.props?.props?.props?.loi?.loiNO}, दिनांक{" "}
                    {moment(this?.props?.props?.props?.loi?.loiDate).format(
                      "DD-MM-YYYY"
                    )}{" "}
                    स्विकारलेत आणि शिल्लक शुल्क र.रु.९,९००/-
                    पा.क्र.३०३३२१२२०००६७३३, दिनांक १६/०७/२०२१ नुसार स्विकारलेत.
                    )
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
