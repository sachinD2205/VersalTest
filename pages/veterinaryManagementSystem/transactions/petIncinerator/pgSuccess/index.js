import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./acknowledgement.module.css";

import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  // access query params
  const router = useRouter();
  const componentRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  // let data = []
  let data = [router.query];
  const receiptData = router.query;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Receipt",
  });

  useEffect(() => {
    if (
      router.query != null &&
      router.query != undefined &&
      router.query != {}
    ) {
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

  return (
    <>
      <div>
        {/* <ComponentToPrint
          data={filteredData}
          actualData={receiptData}
          ref={componentRef}
        /> */}
        <ReceiptToPrint actualData={receiptData} componentRef={componentRef} />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" onClick={() => handlePrint()}>
          <FormattedLabel id="print" />
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            router.push({
              pathname: `/veterinaryManagementSystem/transactions/petIncinerator/paymentSlip`,
              query: {
                id: String(data[0]?.merchant_param5)?.split("_____")[1],
              },
            })
          }
        >
          {language == "en" ? "View Receipt" : "पावती पहा"}
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            router.push({
              pathname: "/dashboard",
            })
          }
        >
          <FormattedLabel id="exit" />
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
                  <FormattedLabel id="yourPaymentDoneSuccess" />
                </h1>
              </>
            )}
            {this.props?.data[0]?.order_status === "Failure" && (
              <>
                <CloseIcon color="error" style={{ fontSize: "60px" }} />
                <h1>
                  <FormattedLabel id="paymentFailed" />
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
                        <FormattedLabel id="applicationNo" /> {"  :  "}
                      </b>
                      {item.merchant_param5?.split("_____")[0]}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="orderId" />
                        {"  :  "}
                      </b>
                      {item.order_id}
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

const ReceiptToPrint = ({ actualData, componentRef }) => {
  return (
    <div className={styles.wrapper} ref={componentRef}>
      <div className={styles.smolWrapper}>
        <center>
          {actualData?.paymentStatus === "Success" ? (
            <CheckCircleIcon color="success" style={{ fontSize: "60px" }} />
          ) : (
            <CloseIcon color="error" style={{ fontSize: "60px" }} />
          )}
          <h1 style={{ textTransform: "capitalize" }}>
            <FormattedLabel
              id={
                actualData?.paymentStatus === "Success"
                  ? "yourPaymentDoneSuccess"
                  : "paymentFailed"
              }
            />
          </h1>
        </center>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {/* Left */}
          <div className={styles.columns}>
            <label>
              <FormattedLabel id="applicationNo" bold textCase="uppercase" />:{" "}
              <span>{actualData.merchant_param5?.split("_____")[0]}</span>
            </label>
            <label>
              <FormattedLabel id="trackingId" bold textCase="uppercase" />:{" "}
              <span>{actualData.tracking_id}</span>
            </label>
            <label>
              <FormattedLabel id="billingName" bold textCase="uppercase" />:{" "}
              <span>{actualData.billing_name}</span>
            </label>
            <label>
              <FormattedLabel id="billingCity" bold textCase="uppercase" />:{" "}
              <span>{actualData.billing_city}</span>
            </label>
            <label>
              <FormattedLabel id="billingZip" bold textCase="uppercase" />:{" "}
              <span>{actualData.billing_zip}</span>
            </label>
            <label>
              <FormattedLabel id="billingEmail" bold textCase="uppercase" />:{" "}
              <span>{actualData.billing_email}</span>
            </label>
            <label>
              <FormattedLabel id="totalAmount" bold textCase="uppercase" />:{" "}
              <span>{actualData.mer_amount}</span>
            </label>
          </div>

          {/* Right */}
          <div className={styles.columns}>
            <label>
              <FormattedLabel id="orderId" bold textCase="uppercase" />:{" "}
              <span>{actualData.order_id}</span>
            </label>
            <label>
              <FormattedLabel id="bankRefNo" bold textCase="uppercase" />:{" "}
              <span>{actualData.bank_ref_no}</span>
            </label>
            <label>
              <FormattedLabel id="billingAdd" bold textCase="uppercase" />:{" "}
              <span>{actualData.billing_address}</span>
            </label>
            <label>
              <FormattedLabel id="billingState" bold textCase="uppercase" />:{" "}
              <span>{actualData.billing_state}</span>
            </label>
            <label>
              <FormattedLabel id="billingCountry" bold textCase="uppercase" />:{" "}
              <span>{actualData.billing_country}</span>
            </label>
            <label>
              <FormattedLabel id="mobileNo" bold textCase="uppercase" />:{" "}
              <span>{actualData.delivery_tel}</span>
            </label>
            <label>
              <FormattedLabel id="transactionDate" bold textCase="uppercase" />:{" "}
              <span>{actualData.trans_date}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
