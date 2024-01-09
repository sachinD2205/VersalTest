import { Button, Grid, Paper, Stack } from "@mui/material";

import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import router from "next/router";
import axios from "axios";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useForm,
} from "react-hook-form";

// Index
const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const router = useRouter();
  const [inputState, setInputState] = useState(false);
  const [applno, setapplno] = useState();
  const [loiNo, setloiNo] = useState();
  const [loiDate, setloiDate] = useState();
  const [data1, setData1] = useState([]);
  const [total, settotal] = useState();
  const [totalInWords, settotalInWords] = useState();
  const [servicename, setservicename] = useState();
  const [dataSource, setDataSource] = useState();
  // Back
  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
  };
  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    reset(router.query);
  }, [router.query]);

  useEffect(() => {
    setInputState(true);
    if (router.query) {
      console.log("123", router.query);
      setapplno(router.query.applicationNumber);
    }
  }, []);

  const getDataByApplicationNumber = () => {
    if (applno !== undefined) {
      console.log("applno", applno);
      axios
        .get(
          `${urls.SSLM}/TrnLoi/getDataByApplicationNumberReceipt?applicationNumber=${applno}`
        )
        .then((res) => {
          console.log("res1245", res.data.trnLoiDao[0]);
          setData1(res.data.trnLoiDao[0]);
        });
    }
  };
  useEffect(() => {
    getDataByApplicationNumber();
  }, []);
  useEffect(() => {
    getDataByApplicationNumber();
  }, [applno]);
  // view
  return (
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
            <h1>पैसे भरल्याची पावती / Payment Paid Slip</h1>
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
            onClick={() => router.push(`/skySignLicense/transactions/workFlow`)}
          >
            back To home
          </Button>
          <Button
            variant="contained"
            type="primary"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            print
          </Button>
        </Stack>
        <ComponentToPrint ref={componentRef} data={data1} />
      </Paper>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render(props) {
    const {
      licenseNo,
      paymentMode1,
      paymentType2,
      total,
      totalInWords,
      servicesName1,
    } = this?.props?.data;
    console.log("props3453", this?.props?.data);
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
                  marginLeft: "10vw",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>पावती क्रमांक : </b>
                </Grid>
                {/* <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>परवाना क्रमांक :{licenseNo} </b>
                </Grid> */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्ज क्र :{router.query.applicationNumber}</b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>दिनांक : </b>
                </Grid>
                {/** Third Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>वेळ : </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय :{servicesName1} </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विभाग : परवाना विभाग </b>
                </Grid>
                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>
                    अर्जादाराचे नाव : {router.query.firstName + "  "}
                    {router.query.middleName + "  "}
                    {router.query.lastName}
                  </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>मोबाईल नंबर :{router.query.mobile} </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>ई - मेल आयडी :{router.query.emailAddress} </b>
                </Grid>
                {/** Fifth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>
                    पत्ता :{router.query.crCitySurveyNumber},
                    {router.query.crAreaName}{" "}
                  </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
              </Grid>
              {/** New Row */}
              <br />
              <div
                style={{ margin: "10px", marginLeft: "40px", padding: "10px" }}
              >
                <h4>
                  <b>देय रक्कम</b> : {total}({totalInWords})
                </h4>
                <h4>
                  <b>पेमेंट मोड</b> : {paymentType2} ( {paymentMode1} ){" "}
                </h4>
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

export default Index;
