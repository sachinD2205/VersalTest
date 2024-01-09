import { Button, Paper, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

// Index
const LoiGenerationRecipt = (props) => {
  // const language = useSelector((state) => state.labels.language);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Back
  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
  };
  useEffect(() => {
    console.log("props121", props?.props?.loi);
  }, [props]);

  // view
  return (
    <div style={{ color: "white" }}>
      <Paper
        elevation={0}
        style={{
          margin: "36px",
          marginTop: "5px",
        }}
      >
        <div>
          <center>
            <h1>सेवा शुल्क पत्र </h1>
          </center>
        </div>

        <ComponentToPrint ref={componentRef} props={props} />
        <Stack
          spacing={5}
          direction='row'
          style={{
            display: "flex",
            justifyContent: "center",
            // marginLeft: "50px",
          }}
        >
          <Button
            size='small'
            variant='contained'
            type='primary'
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            print
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    const {
      applicantNameMr,
      applicantMiddleNameMr,
      applicantLastNameMr,
      typeOfBusinessMr,

      // paymentCollection: {
      //   receiptDate,
      //   receiptNo,
      //   receiptAmount,
      //   paymentType,
      //   paymentMode,
      // },
      // loi: { loiNo, loiDate, totalInWords, total },
    } = this?.props?.props?.props;

    console.log("this?.props?.props?.props", this?.props?.props?.props);
    return (
      <div>
        <Paper
          elevation={0}
          sx={{
            // paddingRight: "75px",
            // marginTop: "50px",
            // paddingLeft: "30px",
            // paddingBottom: "50px",
            height: "460px",
          }}
        >
          <div
            style={{
              width: "100%",
              border: "1.5px solid black",
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
                  src='/logo.png'
                  alt='Maharashtra Logo'
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
                  <b>सेवाशुल्क पत्र </b>
                </h3>
              </div>
              <div className='col-md-7'>
                <img
                  src='/barcode.jpg'
                  alt='Maharashtra Logo'
                  height={100}
                  width={100}
                />
              </div>
            </div>

            {/** Second Row */}
            <div
              style={{ margin: "10px", marginLeft: "15px", padding: "10px" }}
            >
              <div style={{ marginLeft: "40vw" }}>
                <b>सेवा शुल्क पत्र क्र. :</b> &nbsp;{" "}
                {this?.props?.props?.props?.loi?.loiNO}
                <br />
              </div>

              <div style={{ marginLeft: "40vw" }}>
                <b>सेवा शुल्क पत्र दिनांक : </b>&nbsp;{" "}
                {moment(this?.props?.props?.props?.loi?.loiDate).format(
                  "DD-MM-YYYY"
                )}
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>प्रति , </b>
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>अर्जदाराचे नाव :</b> &nbsp;&nbsp;
                {applicantNameMr +
                  " " +
                  applicantMiddleNameMr +
                  " " +
                  applicantLastNameMr}
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>विषय :</b>&nbsp;&nbsp;{typeOfBusinessMr} परवाना सेवाशुल्क
                पत्र
              </div>
              <div style={{ marginLeft: "3.8vw" }}>
                <b>
                  पत्ता :&nbsp;{" "}
                  {/* {language == "en"
                    ? this?.props?.props?.props?.applicantAddress
                    : this?.props?.props?.props?.applicantAddressMr}{" "} */}
                  {this?.props?.props?.props?.applicantAddressMr}
                </b>
              </div>

              {/** New Row */}
              <br />
              <div
                style={{ margin: "10px", marginLeft: "20px", padding: "10px" }}
              >
                <h4>
                  <b>महोदय ,</b>
                </h4>
                <h4>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;आपला
                  <b>
                    &nbsp;&nbsp;अर्ज क्रमांक. &nbsp;(
                    {this?.props?.props?.props?.applicationNo}){" "}
                  </b>
                  आहे .आर्थिक वर्ष २०२३-२४ मध्ये सेवांसाठी नागरिक सेवा पोर्टेलवर
                  दिलेली <b>{/* रक्कम {total} ({totalInWords}){" "} */}</b>
                  निश्चित करा व online लिंकद्वारे अथवा जवळच्या झोनल ऑफिसला भेट
                  देऊन शुल्क दिलेल्या वेळेत जमा करा .
                </h4>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default LoiGenerationRecipt;
