import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Grid } from "@mui/material";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import styles from "./acknowledgement.module.css";

import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import urls from "../../../URLS/urls";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../util/util";
// import urls from "../../../../URLS/urls";

const Index = () => {
  // access query params
  const router = useRouter();
  const componentRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [cfcs, setCfcs] = useState([]);
  const userToken = useGetToken();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  useEffect(() => {
   
    console.log("useEffect ", router.query);
  }, [router.query]);
  useEffect(() => {
    getCfcS();
  }, []);
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
    if (
      router.query != null &&
      router.query != undefined &&
      router.query != {}
    ) {
      data.push(router.query);
      if (data != undefined && data != [] && data != null) {
        const results = data.filter((element) => {
          if (Object.keys(element).length !== 0) {
            return true;
          }
          return false;
        });
        setFilteredData(Array.from(new Set(results)));
      }
    }
  }, [router.query]);

  const getCfcS = () => {
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setCfcs(
          r?.data?.cfcCenters.map((row) => ({
            ...row,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  console.log("filteredData", filteredData);

  return (
    <>
      <div>
        <ComponentToPrint data={filteredData} ref={componentRef} cfcs={cfcs} language={language} />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() =>
            router.push({
              pathname:
                "/roadExcavation/transaction/documenstGeneration/receipt",
              query: {
                id:router.query.applicationId,
              
                // serviceId:params.row.serviceId
              },
            })
          }
          // onClick={() => {
          //   console.log("paymentSlip", router.query, filteredData);
            
          //   router.push({
          //     pathname: "./topUpProcess",
          //     query: router.query,
          //     // "/PublicAuditorium/transaction/auditoriumBooking/paymentSlip",
          //     // query: { data: JSON.stringify(router?.query), mode: "ONLINE" },
          //   });
          // }}
        >
          {language == "en" ? "View Receipt" : "पावती पहा"}
          {/* <FormattedLabel id="goToList" /> */}
        </Button>
      </div>
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.mainn}>
        <div
          style={{
            borderStyle: "solid",
            borderColor: "black",
            borderWidth: "2px",
            padding: "20px",
            marginTop: "20px",
            background: "white",
            width: "70%",
          }}
        >
          <center>
            {this.props?.data[0]?.order_status === "Success" && (
              <>
                <CheckCircleIcon color="success" style={{ fontSize: "60px" }} />
                <h1>
                  {/* <FormattedLabel id="yourPaymentDoneSuccess" />{" "} */}
                  {this.props?.language=="en"?"Your Payment Done Successfully":"तुमचे पेमेंट यशस्वीरित्या पूर्ण झाले"} {" "}
                </h1>{" "}
              </>
            )}
            {this.props?.data[0]?.order_status === "Failure" && (
              <>
                <CloseIcon color="error" style={{ fontSize: "60px" }} />
                <h1>
                  {/* <FormattedLabel id="paymentFailed" />{" "} */}
                  {this.props?.language == "en"?"Payment Failed":"पेमेंट अयशस्वी"} {" "}
                </h1>
              </>
            )}
          </center>

          {/* <center> */}
          {this.props.data.map((item, index) => {
            return (
              <>
              {console.log("00sdfsedf", this.props.cfcs)}
                <Grid container style={{ lineHeight: 2.2 }}>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  {/* <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                     
                        {this.props?.language == "en"?"CFC Id":"CFC आयडी"} {"  :  "}{" "}
                      </b>{" "}
                      {item.merchant_param5}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                      
                        {this.props?.language == "en"?"CFC Center Name":"CFC केंद्राचे नाव"}
                        {"  :  "}{" "}
                      </b>{" "}
                      {
                        this.props.cfcs?.find(
                          (v) => v.cfcId == Number(item?.merchant_param5)
                        )?.cfcName
                      }{" "}
                    </div>
                  </Grid> */}
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="trackingId" /> {"  :  "}{" "} */}
                        {this.props?.language == "en"?"Tracking Id":"ट्रॅकिंग आयडी"}{"  :  "}{" "}
                      </b>{" "}
                      {item.tracking_id}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="bankRefNo" /> {"  :  "} */}
                        {this.props?.language == "en"?"Bank Ref No":"बँक संदर्भ क्र"} {"  :  "}
                      </b>{" "}
                      {item.bank_ref_no}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="billingName" /> {"  :  "}{" "} */}
                        {this.props?.language == "en"?"Billing Name":"बिलिंग नाव"}{"  :  "}{" "}
                      </b>{" "}
                      {item.billing_name}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="billingAdd" /> {"  :  "} */}
                        {this.props?.language == "en"?"Billing Address":"बिलिंग पत्ता"} {"  :  "}
                      </b>{" "}
                      {item.billing_address}{" "}
                    </div>
                  </Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="billingCity" /> {"  :  "} */}
                        {this.props?.language == "en"?"Billing City":"बिलिंग शहर"} {"  :  "}
                      </b>{" "}
                      {item.billing_city}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="billingState" /> {"  :  "}{" "} */}
                        {this.props?.language == "en"?"Billing State":"बिलिंग राज्य"}{"  :  "}{" "}
                      </b>{" "}
                      {item.billing_state}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="billingZip" /> {"  :  "} */}
                        {this.props?.language == "en"?"Billing Zip":"बिलिंग कोड"}{"  :  "}
                      </b>{" "}
                      {item.billing_zip}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="billingCountry" /> {"  :  "} */}
                        {this.props?.language == "en"?"Billing Country":"बिलिंग देश"} {"  :  "}
                      </b>{" "}
                      {item.billing_country}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="billingEmail" /> {"  :  "}{" "} */}
                        {this.props?.language == "en"?"Billing Email":"बिलिंग ईमेल"} {"  :  "}{" "}
                      </b>{" "}
                      {item.billing_email}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="mobileNo" />
                        {"  :  "}{" "}
                      </b>{" "}
                      {item.delivery_tel}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="totalAmount" /> {"  :  "}
                      </b>{" "}
                      {item.mer_amount}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        {/* <FormattedLabel id="transactionDate" /> */}
                        {this.props?.language == "en"?"Transaction Date":"व्यवहाराची तारीख"}
                        {"  :  "}
                      </b>{" "}
                      {item.trans_date}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  {item.merchant_param3 != 0 && (
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                      <div>
                        <b>
                          {/* <FormattedLabel id="loiNo" /> */}
                          {this.props?.language == "en"?"LOI No":"LOI क्र"}
                          {"  :  "}
                        </b>{" "}
                        {item.merchant_param3}{" "}
                      </div>
                    </Grid>
                  )}
                </Grid>
              </>
            );
          })}

          {/* </center> */}
        </div>
      </div>
    );
  }
}
export default Index;
