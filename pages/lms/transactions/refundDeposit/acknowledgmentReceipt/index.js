import { Button, Grid, Paper, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import router from "next/router";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import moment from "moment";
import Loader from "../../../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";

// Index
const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Back
  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
    // router.push({
    //   pathname: `/dashboard`,
    // });

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      router.push(`/dashboard`);
    } else if (localStorage.getItem("loggedInUser") == "cfcUser") {
      router.push(`/CFC_Dashboard`);
    } else {
      router.push(`/lms/transactions/refundDeposit/scrutiny`);
    }
  };

  const [dataa, setDataa] = useState(null);
  const [loading, setLoading] = useState(false);
  let language = useSelector((state) => state.labels.language);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useSelector((state) => state.user.user.token);

  useEffect(() => {
    if (router?.query?.id) {
      setLoading(true);
      axios
        .get(
          `${urls.LMSURL}/trnDepositeRefund/getAllByServiceId?serviceId=${89}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          console.log(res, "reg123");

          let _res = res.data.trnDepositeRefundList.find((r, i) => {
            if (r.id == router?.query?.id) {
              // console.log("abc123", r.id, props.id)
              return {
                srNo: i + 1,
                ...r,
              };
            }
          });
          console.log(_res, "_res");
          setDataa(_res);
        })
        .catch((err) => setLoading(false));
    }
  }, []);
  // view
  return (
    <div style={{ color: "white" }}>
      <Paper
        style={{
          margin: "50px",
        }}
      >
        {/* <div>
          <br />
          <br />
          <center>
            <h1>अर्जाची पावती / पोहोच पावती </h1>
          </center>
        </div> */}
        <LmsHeader
          language={language}
          enName="Application Receipt / Delivery Receipt"
          mrName="अर्जाची पावती / पोहोच पावती"
        />
        <br />

        {loading ? (
          <Loader />
        ) : (
          <>
            <Stack
              direction="row"
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button
                variant="contained"
                size="small"
                type="primary"
                onClick={backToHomeButton}
              >
                {/* back To home */}
                <FormattedLabel id="backToHomeBtn" />
              </Button>
              <Button
                variant="contained"
                type="primary"
                size="small"
                style={{ float: "right" }}
                onClick={handlePrint}
              >
                {/* print */}
                <FormattedLabel id="printD" />
              </Button>
            </Stack>
            <ComponentToPrint
              ref={componentRef}
              dataa={dataa}
              isSmallScreen={isSmallScreen}
            />
          </>
        )}
      </Paper>
    </div>
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
                {this.props.isSmallScreen ? (
                  <img
                    src="/logo.png"
                    alt="Maharashtra Logo"
                    height={50}
                    width={50}
                  />
                ) : (
                  <img
                    src="/logo.png"
                    alt="Maharashtra Logo"
                    height={100}
                    width={100}
                  />
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                {this.props.isSmallScreen ? (
                  <h4>
                    <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                  </h4>
                ) : (
                  <h2>
                    <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                  </h2>
                )}
                {this.props.isSmallScreen ? (
                  <>
                    <h5>
                      <b>ग्रंथालय व्यवस्थापन प्रणाली</b>
                    </h5>
                    <h5>
                      <b>अर्जाची पावती / पोहोच पावती </b>
                    </h5>
                  </>
                ) : (
                  <>
                    {" "}
                    <h3>
                      <b>ग्रंथालय व्यवस्थापन प्रणाली</b>
                    </h3>
                    <h3>
                      <b>अर्जाची पावती / पोहोच पावती </b>
                    </h3>
                  </>
                )}
              </div>
              <div className="col-md-7">
                {this.props.isSmallScreen ? (
                  <img
                    src="/barcode.jpg"
                    alt="Maharashtra Logo"
                    height={50}
                    width={50}
                  />
                ) : (
                  <img
                    src="/barcode.jpg"
                    alt="Maharashtra Logo"
                    height={100}
                    width={100}
                  />
                )}
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
                  <b>अर्जादाराचे नाव : {this.props.dataa?.memberName}</b>
                </Grid>
                {/* <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                                    <b>मोबाईल नंबर :{this.props.dataa?.amobileNo} </b>
                                </Grid>
                                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                                    <b>ई - मेल आयडी : {this.props.dataa?.aemail}</b>
                                </Grid> */}
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
                  <b>महोदय {this.props.dataa?.memberName},</b>
                </h4>
                <h4>
                  <b>
                    आपण दिलेल्या अर्जाची नोंदणी आम्ही घेतली आहे.आपला अर्ज
                    क्रमांक ({this.props.dataa?.applicationNumber}) आहे. आपल्या
                    अर्जावर तपासणी करून आपणांस त्याबाबत लवकरच SMS द्वारे
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
                  <b>अर्जासोबत कोणतेही कागदपत्रे स्विकारणेत आले नाहीत </b>
                </h4>
                {/* <h4> 1)पत्ता पुरावा </h4>
                                <h4> 2)ओळख पुरावा</h4>
                                <h4> 3)ओळख पुरावा </h4> */}

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
