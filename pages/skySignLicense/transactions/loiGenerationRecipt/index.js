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
  const [applno, setapplno] = useState();
  const [inputState, setInputState] = useState(false);
  const [dataSource, setDataSource] = useState();
  const [data1, setData1] = useState([]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const router = useRouter();
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
    setInputState(true);
    if (router.query) {
      console.log("123", router.query);
      setapplno(router.query.applicationNumber);
    }
  }, []);

  useEffect(() => {
    reset(router.query);
  }, [router.query]);
  // Back
  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
  };
  const getserviceNames = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceNameEn: row.serviceName,
          serviceNameMar: row.serviceNameMr,
        }))
      );
    });
  };

  const getDataByApplicationNumber = () => {
    if (applno !== undefined) {
      console.log("applno", applno);
      axios
        .get(
          `${urls.SSLM}/TrnLoi/getDataByApplicationNumber?applicationNumber=${applno}`
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
            <h1>सेवा शुल्क पत्र </h1>
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
    const { loiDate, loiNo, servicesName1, total, totalInWords } =
      this?.props?.data;
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
                  <b>सेवा शुल्क पत्र </b>
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
            <div
              style={{ margin: "10px", marginLeft: "40px", padding: "10px" }}
            >
              <div style={{ marginLeft: "45vw" }}>
                <b>सेवा शुल्क पत्र क्र. : {loiNo}</b>
                <br />
              </div>

              <div style={{ marginLeft: "45vw" }}>
                <b>सेवा शुल्क पत्र दिनांक : {loiDate} </b>
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>प्रति , </b>
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>
                  अर्जदाराचे नाव : {router.query.firstName + " "}
                  {router.query.middleName + " "} {router.query.lastName}
                </b>
              </div>
              <div style={{ marginLeft: "3.8vw" }}>
                <b>शहर : {router.query.crCityName} </b>
              </div>
              <div style={{ marginLeft: "3.8vw" }}>
                <b>विषय :{servicesName1} </b>
              </div>

              {/** New Row */}
              <br />
              <div
                style={{ margin: "10px", marginLeft: "40px", padding: "10px" }}
              >
                <h4>
                  <b>महोदय ,</b>
                </h4>
                <h4>
                  <b>
                    आपला अर्ज क्र {router.query.applicationNumber} आहे .आर्थिक
                    वर्ष २०२३-२४ मध्ये सेवांसाठी नागरिक सेवा पोर्टेलवर दिलेली
                    रक्कम {total} ({totalInWords}) निश्चित करा व online
                    लिंकद्वारे अथवा जवळच्या झोनल ऑफिसला भेट देऊन शुल्क दिलेल्या
                    वेळेत जमा करा .
                  </b>
                </h4>
                <br />
              </div>

              <div
                style={{ margin: "10px", marginLeft: "40px", padding: "10px" }}
              >
                {/* <h4>
                                    <b>अर्जासोबत खालील कागदपत्रे स्विकारणेत आली </b>
                                </h4>
                                <h4> 1)इमारत प्रारंभ प्रमाणपत्र / मालमत्ता कर उतारा / इमारत पूर्णत्व प्रमाणपत्र </h4>
                                <h4> 2)शॉप ऍक्ट लायसन्स/एसएसआय नोंदणी प्रमाणपत्र/फॅक्टरी कायदा </h4>
                                <h4> 3)कच्चा स्थळ दर्शक नकाशा </h4>
                                <h4> 4)झोपडपट्टीत असल्यास झो. नि . पू. नाहरकत दाखला </h4>
                                <h4> 5)पीठ गिरणी परवान्याच्या बाबतीत - वैद्यकीय अधिकाऱ्याकडून अन्न परवाना </h4>
                                <h4> 6)भाडेकरू/भागीदाराच्या बाबतीत - मालमत्ताधारकाकडून संमतीपत्र/करारपत्र/ लिव्ह लॅन्ड लायसन्स पत्र </h4>
                                <h4> 7)भोगवटा प्रमाणपत्र </h4>
                                <h4> 8)स्टोन क्रशर मशीन आणि वीटभट्टी किंवा तत्सम परवाना, PCMC च्या पर्यावरण विभागाकडून ना हरकत प्रमाणपत्र आवश्यक</h4>

                                <br /> */}
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
