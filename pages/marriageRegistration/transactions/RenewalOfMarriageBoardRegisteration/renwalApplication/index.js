import { Button, Paper } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../../URLS/urls";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./goshwara.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [dataa, setDataa] = useState();
  const [loaderstate, setloaderstate] = useState(false);
  const language = useSelector((state) => state?.labels.language);
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
    console.log("router.query", router.query);
    let applicationId;
    if (router.query) {
      if (router?.query?.applicationId) {
        applicationId = router?.query?.applicationId;
      } else if (router?.query?.id) {
        applicationId = router?.query?.id;
      }
      setloaderstate(true);
      axios
        .get(
          `${urls.MR}/transaction/marriageBoardCertificate/getMCBySIdAndId?applicationId=${applicationId}&serviceId=${router.query.serviceId}`,
        )
        .then((r) => {
          console.log("r.data", r.data);
          setloaderstate(false);
          setDataa(r.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  return (
    <div>
      {/* {loaderstate ? (
        <Loader />
      ) : ( */}
      <Paper>
        <>
          <div>
            <ComponentToPrint
              ref={componentRef}
              dataa={dataa}
              query={router?.query}
            />
          </div>
          <br />

          <div className={styles.btn}>
            <Button
              variant="contained"
              sx={{ size: "23px" }}
              type="primary"
              onClick={handlePrint}
            >
              <FormattedLabel id="print" />
            </Button>
            <Button
              sx={{ width: "25px" }}
              type="primary"
              variant="contained"
              onClick={() => {
                router.back();
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </div>
        </>
      </Paper>
      {/* )} */}
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div>
          <div
            style={{
              marginLeft: "1vh",
              fontSize: "13px",
              // marginRight: "3vh",
              // backgroundColor: "red",
            }}
          >
            <Paper
              sx={{
                border: 1,
                borderColor: "grey.500",
              }}
            >
              <table
                className={styles.report}
                style={{
                  // marginLeft: "3vh",
                  // marginRight: "3vh",
                  // backgroundColor: "red",
                  width: "100%",
                }}
              >
                <tr>
                  <div className={styles.main}>
                    <div className={styles.one} style={{ marginRight: "2vh" }}>
                      <img
                        src="/logo.png"
                        alt=""
                        height="150vh"
                        width="150vw"
                      />
                    </div>

                    <div className={styles.two}>
                      <center style={{ lineHeight: "1.2" }}>
                        <h1>
                          <b>पिंपरी चिंचवड महानगरपालिका</b>
                        </h1>
                        <h3>
                          <b>
                            (नागरी व प्रशासकीय सेवेसाठी आयएसओ 9001:2008
                            प्रमाणपत्र प्राप्त संस्था)
                          </b>
                        </h3>
                        <h3>
                          <b>ब-क्षेत्रिय कार्यालय, लोकमान्य हॉस्पीटल जवळ,</b>
                        </h3>{" "}
                        <h3>
                          <b>चिंचवड रेल्वेगेट समोर, चिंचवड, पुणे-३३.</b>
                        </h3>
                        <h3>
                          <b>Email - </b>bward@pcmcindia.gov.in <b>Website -</b>{" "}
                          www.pcmcindia.gov.in
                        </h3>
                        <h3>
                          <b>दुरध्वनी क्रमांक -</b> ०२०-२७३५०१५३
                        </h3>
                      </center>
                    </div>
                    {/* <div className={styles.three} style={{ marginLeft: "2vh" }}>
                      <img
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.dataa?.boardHeadPersonPhoto}`}
                        alt="Applicant photo"
                        height={140}
                        width={130}
                      ></img>
                    </div> */}
                  </div>
                </tr>
                <tr></tr>
                <hr />

                <tr className={styles.trrowf1}>
                  <div
                    className={styles.one}
                    style={{ marginRight: "5vh", marginLeft: "5vh" }}
                  >
                    <h3>
                      <b>क्रमांक : </b>
                    </h3>
                  </div>
                  <div
                    className={styles.one}
                    style={{ marginRight: "2vh", marginLeft: "5vh" }}
                  >
                    <h3>
                      <b>दिनांक : </b>
                    </h3>
                  </div>
                </tr>
                <tr>
                  <div className={styles.one}>
                    <h3>
                      <b>प्रति, </b>
                    </h3>
                  </div>
                  <h3 className={styles.address}>
                    <b>
                      श्री. अमित उपेंद्र कुलकर्णी,
                      <br /> मंगलाष्टक वधू वर सूचक केंद्र,
                      <br />
                      गजानन अपार्टमेंट, फ्लॅट नं. १०, मंगलमूर्ती वाडयाजवळ,
                      <br />
                      गणेश पेठ, चिंचवड, पुणे ४११०३३.{" "}
                    </b>
                  </h3>
                  <h3 style={{ marginLeft: "25vw", marginTop: "3vh" }}>
                    <b>विषय- विवाह मंडळाची नोंदणी नुतनीकरण करणेबाबत.</b>
                  </h3>
                  <div className={styles.one}>
                    <h3>
                      <b>महाशय , </b>
                    </h3>
                  </div>
                  <h3 style={{ marginLeft: "5vw" }}>
                    <b>
                      &nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      महाराष्ट्र विवाह मंडळाचे विनियमन आणि विवाह नोंदणी अधिनियम
                      १९९८ अन्वये आपले मंगलाष्टक वधू वर सूचक मंडळाची नोंदणी
                      दिनांक २९/०५/२०१८ रोजी करणेत आलेली आहे. सदर विवाहमंडळ
                      नोंदणी प्रमाणपत्राची तारीख संपुष्टात आलेली आहे. दर दोन
                      वर्षांनी विवाह मंडळाची नुतनीकरण करणे आवश्यक असलेने आपण
                      दिनांक ०५/०६/२०२० रोजी मुळ विवाह मंडळ नोंदणी प्रमाणपत्र
                      घेऊन व क्षेत्रीय कार्यालयात दुपारी २.०० वाजता हजर रहावे.
                    </b>
                  </h3>
                </tr>
                <tr className={styles.trrowf}>
                  <td colSpan={2}>
                    {" "}
                    <div style={{ textAlign: "center" }}>
                      <h3>
                        <b>
                          विवाह निंबधक तथा जेष्ठ वैद्यकीय अधिकारी <br />व
                          क्षेत्रीय कार्यालय
                          <br /> चिंचवड, पुणे- -३३
                        </b>
                      </h3>
                    </div>
                  </td>
                </tr>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
