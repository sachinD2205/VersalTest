import { Button, Grid, Paper, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import router from "next/router";
import axios from "axios";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import Loader from "../../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// Index
const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Back
  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
    router.push(`/dashboard`);
  };
  const language = useSelector((lang) => lang?.labels?.language);
  const [dataa, setDataa] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
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
          setLoading(false);
          console.log("aala", res?.data);
          setDataa(res?.data);
        })
        .catch((err) => {
          setLoading(false);
          sweetAlert({
            title: language === "en" ? "Error !! " : "त्रुटी !!",
            text:
              language === "en"
                ? "Somethings Wrong !! Getting error while fetching records !"
                : "काहीतरी त्रुटी !! रेकॉर्ड मिळवताना त्रुटी येत आहे",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              // router.push(`/skySignLicense/dashboards`);
              router.push(`/dashboard`);
            }
          });
        });
    }
  }, [router?.query]);
  // view
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper
            style={{
              margin: "50px",
            }}
          >
            <div>
              <br />
              <br />
              <center>
                <h1>अर्जाची पावती / पोहोच पावती</h1>
              </center>
            </div>
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
                type="primary"
                onClick={backToHomeButton}
              >
                {/* back To home */}
                {<FormattedLabel id="backToHome" />}
              </Button>
              <Button
                variant="contained"
                type="primary"
                style={{ float: "right" }}
                onClick={handlePrint}
              >
                {/* print */}
                {<FormattedLabel id="print" />}
              </Button>
            </Stack>
            <ComponentToPrint ref={componentRef} dataa={dataa} />
          </Paper>
        </div>
      )}
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <Paper
          // style={{
          //   margin: "50px",
          // }}
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "1000px",
          }}
        >
          <div
            style={{
              width: "100%",
              border: "2px solid black",
            }}
          >
            {/** First Row */}
            <div
              style={{
                marginTop: "30px",
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <img
                  src="/logo.png"
                  alt="Maharashtra Logo"
                  height={100}
                  width={100}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h2>
                  <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                </h2>
                <h3>
                  <b>परवाना प्रणाली</b>
                </h3>
                <h3>
                  <b>अर्जाची पावती / पोहोच पावती</b>
                </h3>
              </div>
              <div className="col-md-7">
                <img
                  src="/barcode.jpg"
                  alt="Maharashtra Logo"
                  height={100}
                  width={100}
                />
              </div>
            </div>

            {/** Second Row */}
            <div>
              <Grid
                container
                style={{
                  marginLeft: "10vw",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                {/* <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                                    <b>पावती क्रमांक : { }</b>
                                </Grid> */}
                {/* <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                                    <b>परवाना क्रमांक : </b>
                                </Grid> */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्ज क्र : {this.props.dataa?.applicationNumber}</b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>
                    दिनांक :{" "}
                    {moment(this.props.dataa?.applicationDate).format(
                      "DD-MM-YYYY"
                    )}
                  </b>
                </Grid>
                {/** Third Row */}
                {/* <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                                    <b>वेळ : </b>
                                </Grid> */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय : {this.props.dataa?.serviceNameMr}</b>
                </Grid>
                {/* <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                                    <b>विभाग : </b>
                                </Grid> */}
                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>
                    अर्जादाराचे नाव :{" "}
                    {this.props.dataa?.marFirstName +
                      " " +
                      this.props.dataa?.marLastName}
                  </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>मोबाईल नंबर :{this.props.dataa?.mobile} </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>ई - मेल आयडी : {this.props.dataa?.emailAddress}</b>
                </Grid>
                {/** Fifth Row */}
                {/* <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                                    <b>पत्ता : </b>
                                </Grid> */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
              </Grid>
              {/** New Row */}
              <br />
              <div
                style={{ margin: "10px", marginLeft: "40px", padding: "10px" }}
              >
                <h4>
                  <b>महोदय {this.props.dataa?.firstNameMr},</b>
                </h4>
                <h4>
                  <b>
                    आपण दिलेल्या अर्जाची नोंदणी आम्ही घेतली आहे.आपला अर्ज
                    क्रमांक ({this.props.dataa?.applicationNumber}) आहे. आपण
                    दिलेले काम अंदाजे १० दिवस पर्यंत पूर्ण होणे अपेक्षित आहे.
                    आपल्या अर्जावर तपासणी करून आपणांस त्याबाबत लवकरच SMS द्वारे
                    कळविण्यात येईल. आपले प्रमाणपत्र/कागदपत्र मिळण्याचे ठिकाण ("
                    ") राहील.
                  </b>
                </h4>
                <br />
              </div>

              <div
                style={{ margin: "10px", marginLeft: "40px", padding: "10px" }}
              >
                <h4>
                  <b>अर्जासोबत खालील कागदपत्रे स्विकारणेत आली </b>
                </h4>
                <h4>
                  {" "}
                  1)इमारत प्रारंभ प्रमाणपत्र / मालमत्ता कर उतारा / इमारत
                  पूर्णत्व प्रमाणपत्र{" "}
                </h4>
                <h4>
                  {" "}
                  2)शॉप ऍक्ट लायसन्स/एसएसआय नोंदणी प्रमाणपत्र/फॅक्टरी कायदा{" "}
                </h4>
                <h4> 3)कच्चा स्थळ दर्शक नकाशा </h4>
                <h4> 4)झोपडपट्टीत असल्यास झो. नि . पू. नाहरकत दाखला </h4>
                <h4>
                  {" "}
                  5)पीठ गिरणी परवान्याच्या बाबतीत - वैद्यकीय अधिकाऱ्याकडून अन्न
                  परवाना{" "}
                </h4>
                <h4>
                  {" "}
                  6)भाडेकरू/भागीदाराच्या बाबतीत - मालमत्ताधारकाकडून
                  संमतीपत्र/करारपत्र/ लिव्ह लॅन्ड लायसन्स पत्र{" "}
                </h4>
                <h4> 7)भोगवटा प्रमाणपत्र </h4>
                <h4>
                  {" "}
                  8)स्टोन क्रशर मशीन आणि वीटभट्टी किंवा तत्सम परवाना, PCMC च्या
                  पर्यावरण विभागाकडून ना हरकत प्रमाणपत्र आवश्यक
                </h4>

                <br />
              </div>

              {/* <div
                                style={{ margin: "10px", marginLeft: "500px", padding: "10px" }}
                            >
                                <h4>
                                    <b>सही </b>
                                </h4>
                                <br />

                            </div> */}
            </div>
          </div>

          {/**
          <table className={styles.report} style={{ marginLeft: "50px" }}>
            <tr style={{ marginLeft: "25px" }}>
              <td>
                <h5 style={{ padding: "10px", marginLeft: "20px" }}>
                  अर्जासोबत खालील कागदपत्रे स्वीकारण्यात आली.
                  <br />
                  <br />
                  <br /> <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </h5>
              </td>
            </tr>
          </table>
           */}
        </Paper>
      </div>
    );
  }
}

export default Index;
