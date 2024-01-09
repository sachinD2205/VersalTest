import { Button, Grid, Paper, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

// Index
const ApplicationPaymentReceipt = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { register, control, setValue, getValue, methods, handleSubmit } =
    useFormContext();

  const { applicationNumber } = props;

  // useEffect
  useEffect(() => {
    console.log("props", props?.props);
  }, [props]);

  // Back
  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
  };

  const [paymentModes, setPaymentModes] = useState([]);

  const getPaymentModes = () => {
    axios.get(`${urls.HMSURL}/master/paymentMode/getAll`).then((r) => {
      setPaymentModes(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        }))
      );
    });
  };

  // view
  return (
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
            onClick={handlePrint}
          >
            print
          </Button>
        </Stack>
        <div>
          <br />
          <br />
          <center>
            <h1>पैसे भरल्याची पावती / Payment Paid Slip</h1>
          </center>
        </div>

        <ComponentToPrint ref={componentRef} props={props} />
      </Paper>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    const {
      applicationNumber,
      applicationDate,
      firstName,
      middleName,
      lastName,
      applicantName,
      mobile,
      emailAddress,
      fullAddressCrMr,
      paymentCollection: {
        receiptDate,
        receiptNo,
        receiptAmount,
        paymentType,
        paymentMode,
      },
      loi: { loiNo, totalInWords },
    } = this?.props?.props?.props;

    // let paymentType1 = this.paymentTypes.find(paymentType.id == paymentType)
    //   ?.paymentType.id;

    console.log("props123", this?.props?.props?.props);
    // const { applicationNumber } = props?.props;
    return (
      <div>
        <Paper
          elevation={0}
          // style={{
          //   margin: "50px",
          // }}
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "650px",
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
                  <b>पथविक्रेता व्यवस्थापन प्रणाली</b>
                </h3>
                <h3>
                  <b>पैसे भरल्याची पावती </b>
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
                  marginLeft: "5vw",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>पावती क्रमांक : </b> {receiptNo}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>सेवा शुल्क पत्र : </b> {loiNo}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्ज क्र : </b> {applicationNumber}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>दिनांक : </b> {receiptDate}
                </Grid>
                {/** Third Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>वेळ : </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय : </b> पथाविक्रेता परवाना जारी करणे
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विभाग : </b> भूमी आणि जिंदगी
                </Grid>
                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्जादाराचे नाव : </b>
                  {applicantName}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>मोबाईल नंबर : </b> {mobile}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>ई - मेल आयडी : </b> {emailAddress}
                </Grid>
                {/** Fifth Row */}
                <Grid item sx={4} sm={4} md={4} lg={4} xl={4}>
                  <b>पत्ता :</b> &nbsp; {fullAddressCrMr}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
              </Grid>
              {/** New Row */}
              <br />
              <div
                style={{
                  margin: "10px",
                  marginLeft: "40px",
                  padding: "10px",
                  // border: "2px solid red",
                }}
              >
                <h3>
                  <b>
                    देय रक्कम :&nbsp;&nbsp; &nbsp;{receiptAmount} (
                    {totalInWords})
                  </b>
                </h3>

                <h3>
                  <b>
                    पेमेंट मोड :&nbsp;&nbsp; &nbsp; {paymentType} ({paymentMode}
                    )
                  </b>
                </h3>

                <br />
              </div>
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

export default ApplicationPaymentReceipt;
