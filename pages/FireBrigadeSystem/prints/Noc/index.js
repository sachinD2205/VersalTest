import React, { useEffect, useRef, useState } from "react";
import styles from "./view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card, Grid } from "@mui/material";
import urls from "../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const userToken = useGetToken();

  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("router.query", router.query);
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
        <ComponentToPrint data={data} ref={componentRef} />
      </div>

      {/* Button for Print and Exit */}
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Exit
        </Button>
      </div>
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
                <h3>
                  File No:- <span></span>
                </h3>

                <h3>
                  O.W.No:- Fire/01/5PC/WS/<span></span>/2022
                </h3>

                <h3>
                  Date:- <span>18</span>
                  <span>/06</span>/2022
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
                  <u>अग्निशामक ना हरकत दाखला - (केटरिंग नविन व्यवसाय) </u>
                </h2>
              </div>
              <br />
              <div className={styles.sHeadingg}>
                <div>
                  <h3>Token No:-103322230010950</h3>
                </div>

                <div>
                  <h3>Token Dt:- 21/10/2022</h3>
                </div>
              </div>
              <p></p>
              <p>
                मे अथर्व महिला संस्था, मार्फत सौ. सिताबाई निवृती भुसारे
                (अध्यक्ष), यांनी दिनांक 27/06/2022 चे विनंती अर्जानुसार हॉटेल
                व्यवसाय करणेकामी अग्निशामक ना हरकत दाखल्याची मागणी केली आहे. सदर
                मे अथर्व महिला संस्था, संस्था मर्या. पत्ता – स. नं.८०/२/१,
                सुदर्शन नगर पिंपळे गुरव, पुणे-६१ येथील व्यवसाय जागेची तपासणी
                अग्निशामक दलाचे अधिकारी यांनी दिनांक 07/06/2022 रोजी समक्ष जावुन
                तांत्रिक तपासणी केली खालील अटींवर ना हरकत दाखला देणेत येत आहे.
              </p>

              <ol>
                <li>एकुण बांधकाम 185.80 चौ. मीटर असून.</li>
                <li>
                  सदरचा ना हरकत दाखला केटरिंग व्यवसाय करणे पुरताच मर्यादित
                  राहील.
                </li>
                <li>
                  सदर खालील प्रमाण अग्निशानक उपकरण ठेवली आहेत :<br />{" "}
                  <span
                    style={{
                      marginLeft: "20px",
                    }}
                  >
                    {" "}
                    अ) ए.बी.सी. अग्निशामक साधने ०६ कि. क्षमता ०२ नग.
                  </span>
                  <span
                    style={{
                      marginLeft: "20px",
                    }}
                  >
                    {" "}
                    ब) ए.बी.सी. मॉड्युलर साधने ०५ कि. क्षमता ०१ नग.
                  </span>
                </li>
                <li>
                  अग्निशामक साधने / यंत्रणा हाताळण्याचे / वापराचे प्रशिक्षण
                  कर्मचा-यांना देणेत आले आहे.
                </li>
                <li> सदर जागेत धुम्रपान निषेध बोर्ड लावले आहेत.</li>
                <li>
                  सदर जागेत महत्त्वाचे दुरध्वनी क्रमांक ठळक अक्षरात लावलेत,
                  पोलीस, अग्निशामक दल, ई.
                </li>
                <li>
                  सदर जागेत महत्त्वाचे दुरध्वनी क्रमांक ठळक अक्षरात लावलेत,
                  पोलीस, अग्निशामक दल, ई.
                </li>
                <li>
                  सदर जागेत मनपा तसेच Statutory Bodies चे पुर्वपरवानगीशिवाय फेर
                  फार / बदल करुन नये.
                </li>
                <li>
                  मनपा ने वेळोवेळी केलेले नियम व उपविधी आपणावर बंधनकारक राहतील.
                </li>
                <li>वरील सर्व अटींची पुर्तता केली आहे. (क्र. १ ते ७ पर्यंत)</li>
                <li>
                  {" "}
                  सदर ना हरकत दाखल्याची मुदत दिनांक ३१/०३/२०२३ पर्यंत राहील.
                </li>

                <li>
                  {" "}
                  सदरचा ना हरकत दाखला केवळ अग्निप्रतिबंधात्मक व सुरक्षिततेच्या
                  दृष्टिने देणेत येत आहे. सदर व्यवसायासाठी, पिंपरी चिंचवड मनपाचे
                  इतर खात्यांची, शासकिय, निमशासकिय खात्यांची परवानगी
                  आवश्यकतेनुसार घेण्यात यावी.
                </li>

                <li>
                  महाराष्ट्र महानगरपालिका अधिनियम, १९४९ चे कलम ३८६ (३) नुसार
                  ज्या माहिती व आपण सादर केलेल्या कागदपत्रांच्या आधारे उक्त ना
                  हरकत दाखला दिला आहे. ती माहिती अथवा कागदपत्रे विपर्यास अथवा
                  उक्त अटी/शर्तीचे उल्लंघन झाल्यास/केल्यास आपण कारवाईस पात्र
                  रहाल. सदर दाखला त्याचवेळेस रद्द समजणेत येईल.
                </li>

                <li>
                  {" "}
                  अर्जदार यांनी त्यांच्याकडील लावणेत आलेली अग्निक्षमन यंत्रणा
                  सुस्थितीत व वापरणे योग्य असल्याबाबत अधिकृत फायर लायसन्स धारक
                  यांचेकडील विहित नमुन्यातील "बी फॉर्म", दरवर्षी माहे जानेवारी व
                  माहे जुलै मध्ये अग्निशामक विभागाच्या मुख्य कार्यालयात सादर
                  करणे आवश्यक आहे.
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
              <br />
              <div>
                <div className={styles.lFooter}>
                  <p>
                    {" "}
                    <div>
                      <b> प्रति, </b>
                    </div>
                    <div>
                      <b>
                        {" "}
                        मे अथर्व महिला संस्था, मार्फत सौ. सिताबाई निवृती भुसारे
                        (अध्यक्ष),
                      </b>{" "}
                    </div>
                    <div className={styles.footer}>
                      <b>
                        {" "}
                        पत्ता - स. नं. ८०/२/१, सुदर्शन नगर पिंपळे गुरव, पुणे-६१
                      </b>{" "}
                    </div>
                  </p>
                </div>
              </div>
              <br />
              <br />
              <br />
              <div>
                <p>
                  <b>
                    {" "}
                    (अग्नि सेवा शुल्क र.रु.५०
                    /-पा.क्र.३०१५२२२३००००२८४,दि.२७/०६/२०२२ नुसार स्वीकारलेत तसेच
                    शि.शुल्क. र.रु.१४,२००/- पा.क्र.३०१५२२२३००००३२०,दि.१२/०७/२०२२
                    नुसार स्वीकारलेत )
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
