import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Grid } from "@mui/material";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import styles from "./acknowledgement.module.css";

import CloseIcon from "@mui/icons-material/Close";

const Index = () => {
  // access query params
  const router = useRouter();
  const componentRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  console.log("useEffect");
  console.log("useEffect ", router.query);

  useEffect(() => {
    if (
      router.query != null &&
      router.query != undefined &&
      router.query != {}
    ) {
      data.push(router.query);
      console.log("aala", router.query);
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

  useEffect(() => {
    console.log("filteredData"), filteredData;
  }, [filteredData]);

  return (
    <>
      <div>
        <ComponentToPrint data={filteredData} ref={componentRef} />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push({
              pathname:
                "/skySignLicense/transactions/issuanceOfIndustry/ServiceChargeRecipt",
              query: {
                id: Number(router?.query?.applicationId),
                applicationSide: router?.query?.applicationSide,
              },
            });
          }}
        >
          <FormattedLabel id="goToList" />
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
                  <FormattedLabel id="yourPaymentDoneSuccess" />{" "}
                </h1>{" "}
              </>
            )}
            {this.props?.data[0]?.order_status === "Failure" && (
              <>
                <CloseIcon color="error" style={{ fontSize: "60px" }} />
                <h1>
                  <FormattedLabel id="paymentFailed" />{" "}
                </h1>
              </>
            )}
          </center>

          {/* <center> */}
          {this.props.data.map((item, index) => {
            return (
              <>
                <Grid container style={{ lineHeight: 2.2 }}>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="applicationNo" /> {"  :  "}{" "}
                      </b>{" "}
                      {item.merchant_param5}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="orderId" />
                        {"  :  "}{" "}
                      </b>{" "}
                      {item.order_id}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="trackingId" /> {"  :  "}{" "}
                      </b>{" "}
                      {item.tracking_id}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="bankRefNo" /> {"  :  "}
                      </b>{" "}
                      {item.bank_ref_no}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingName" /> {"  :  "}{" "}
                      </b>{" "}
                      {item.billing_name}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingAdd" /> {"  :  "}
                      </b>{" "}
                      {item.billing_address}{" "}
                    </div>
                  </Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingCity" /> {"  :  "}
                      </b>{" "}
                      {item.billing_city}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingState" /> {"  :  "}{" "}
                      </b>{" "}
                      {item.billing_state}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingZip" /> {"  :  "}
                      </b>{" "}
                      {item.billing_zip}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingCountry" /> {"  :  "}
                      </b>{" "}
                      {item.billing_country}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={2} lg={2} md={2} sm={0} xs={12}></Grid>

                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingEmail" /> {"  :  "}{" "}
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
                        <FormattedLabel id="transactionDate" />
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
                          <FormattedLabel id="loiNo" />
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
