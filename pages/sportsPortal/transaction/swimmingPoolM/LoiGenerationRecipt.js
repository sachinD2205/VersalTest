import { Button, Paper, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";

/** Authore - Sachin Durge */
// LoiGenerationRecipt
const LoiGenerationRecipt = (props) => {
  // const [loadderState, setLoadderState] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [loiGenerationReciptData, setLoiGenerationReciptData] = useState();
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // getHawkerLiceseData
  const getIssuanceOfHawkerLicsenseData = () => {
    // setLoadderState(true);
    axios
      .get(`${urls.SPURL}/swimmingBooking/getById?id=${props?.data?.id}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setLoiGenerationReciptData(r?.data);
          // setLoadderState(false);
        } else {
          // setLoadderState(false);
         
        }
      })
      .catch((errors) => {
       
      });
  };

  useEffect(() => {
    // setLoadderState(true);
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
      localStorage.getItem("issuanceOfHawkerLicenseId") != ""
    ) {
      setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
    }
  }, []);

  useEffect(() => {
    console.log("issuanceOfHawkerLicenseId", issuanceOfHawkerLicenseId);
    getIssuanceOfHawkerLicsenseData();
  }, [issuanceOfHawkerLicenseId]);

  useEffect(() => {
    console.log("loiGenrationReciptData", loiGenerationReciptData);
  }, [loiGenerationReciptData]);

  // view
  return (
    <>
      <div style={{ color: "white" }}>
        <Paper
          elevation={0}
          style={{
            margin: "50px",
          }}
        >
          <br />
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
              style={{ float: "right" }}
              onClick={() => handlePrint()}
            >
              {<FormattedLabel id="print" />}
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("issuanceOfHawkerLicenseId");
                if (localStorage.getItem("loggedInUser") == "citizenUser") {
                  router.push("/dashboard");
                } else {
                  router.push("/streetVendorManagementSystem/dashboards");
                }
              }}
              type="button"
              variant="contained"
              color="primary"
            >
              {<FormattedLabel id="back" />}
            </Button>
          </Stack>
          <br />
          <div>
            <center>
              <h1>सेवा शुल्क पत्र </h1>
            </center>
          </div>

          <ComponentToPrint ref={componentRef} loiGenerationReciptData={loiGenerationReciptData} />
        </Paper>
      </div>
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends React.Component {
  render() {
    console.log("loiGenerationReciptData", this?.props?.loiGenerationReciptData);
    // view
    return (
      <div>
        <Paper
          elevation={0}
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
                <img src="/logo.png" alt="Maharashtra Logo" height={100} width={100} />
              </div>
              <div style={{ textAlign: "center" }}>
                <h2>
                  <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                </h2>
                <h3>
                  <b>परवाना प्रणाली</b>
                </h3>
                <h3>
                  <b>सेवाशुल्क पत्र </b>
                </h3>
              </div>
              <div className="col-md-7">
                <img src="/barcode.jpg" alt="Maharashtra Logo" height={100} width={100} />
              </div>
            </div>

            {/** Second Row */}
            <div style={{ margin: "10px", marginLeft: "15px", padding: "10px" }}>
              <div style={{ marginLeft: "40vw" }}>
                <b>सेवा शुल्क पत्र क्र. :</b> &nbsp; {this?.props?.loiGenerationReciptData?.loi?.loiNo}
                <br />
              </div>

              <div style={{ marginLeft: "40vw" }}>
                <b>सेवा शुल्क पत्र दिनांक : </b>&nbsp; {this?.props?.loiGenerationReciptData?.loi?.loiDate}
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>प्रति , </b>
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>अर्जदाराचे नाव :</b> &nbsp;&nbsp;{this?.props?.loiGenerationReciptData?.applicantName}
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>विषय :</b>&nbsp;&nbsp;पथाविक्रेता परवाना सेवाशुल्क पत्र
              </div>
              <div style={{ marginLeft: "3.8vw" }}>
                <b>पत्ता :</b>&nbsp;&nbsp;{this?.props?.loiGenerationReciptData?.fullAddressCrMr}
              </div>

              {/** New Row */}
              <br />
              <div style={{ margin: "10px", marginLeft: "20px", padding: "10px" }}>
                <h4>
                  <b>महोदय ,</b>
                </h4>
                <h4>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;आपला
                  <b>
                    &nbsp;&nbsp;अर्ज क्रमांक. &nbsp;({this?.props?.loiGenerationReciptData?.applicationNumber}
                    ){" "}
                  </b>
                  आहे .आर्थिक वर्ष २०२३-२४ मध्ये सेवांसाठी नागरिक सेवा पोर्टेलवर दिलेली{" "}
                  <b>
                    रक्कम {this?.props?.loiGenerationReciptData?.loi?.totalAmount} (
                    {this?.props?.loiGenerationReciptData?.loi?.totalInWords}){" "}
                  </b>
                  निश्चित करा व online लिंकद्वारे अथवा जवळच्या झोनल ऑफिसला भेट देऊन शुल्क दिलेल्या वेळेत जमा
                  करा .
                </h4>
                <br />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default LoiGenerationRecipt;
