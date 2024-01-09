import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Grid } from "@mui/material";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import styles from "./acknowledgement.module.css";

import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";

const Index = () => {
  // access query params
  const router = useRouter();
  const componentRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [cfcs, setCfcs] = useState([]);
  const [cfcUserDetails, setCfcUserDetails] = useState(null);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const user = useSelector((state) => {
    console.log("user", state.user.user);
    return state.user.user;
  });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  console.log("useEffect ", router.query);
  useEffect(() => {
    getCfcS();
    getCfcUserDetails(user?.userDao?.cfc);
  }, []);

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
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res cfcs", r);
        setCfcs(
          r?.data?.cfcCenters.map((row) => ({
            ...row,
          }))
        );
      })
      .catch((err) => {});
  };

  const getCfcUserDetails = (cfcId) => {
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getByCfcId?cfcId=${cfcId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res", r);
        setCfcUserDetails(r?.data);
      })
      .catch((err) => {});
  };

  console.log("filteredData", filteredData);

  return (
    <>
      <div>
        <ComponentToPrint
          data={filteredData}
          ref={componentRef}
          cfcs={cfcs}
          language={language}
          user={user}
          cfcUserDetails={cfcUserDetails}
        />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            console.log("paymentSlip", router.query, filteredData);
            router.push({
              pathname: "./topUpProcess",
              query: router.query,
              // "/PublicAuditorium/transaction/auditoriumBooking/paymentSlip",
              // query: { data: JSON.stringify(router?.query), mode: "ONLINE" },
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
            {this.props?.data[0]?.paymentStatus === "Success" && (
              <>
                <CheckCircleIcon color="success" style={{ fontSize: "60px" }} />
                <h1>
                  {this.props?.language == "en"
                    ? "Topup Success"
                    : "टॉपअप यशस्वी"}
                </h1>{" "}
              </>
            )}
            {this.props?.data[0]?.paymentStatus === "Failure" && (
              <>
                <CloseIcon color="error" style={{ fontSize: "60px" }} />
                <h1>
                  {this.props?.language == "en"
                    ? "Topup Failed"
                    : "टॉपअप अयशस्वी"}
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
                        {/* <FormattedLabel id="applicationNo" /> {"  :  "}{" "} */}
                        <FormattedLabel id="cfcId" /> {"  :  "}{" "}
                      </b>{" "}
                      {item.merchant_param5}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="cfcCenterName" />
                        {"  :  "}{" "}
                      </b>{" "}
                      {
                        this.props.cfcs?.find(
                          (v) => v.cfcId == Number(item?.merchant_param5)
                        )?.cfcName
                      }{" "}
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
                      {this.props.cfcUserDetails?.cfcOwnerName}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingAdd" /> {"  :  "}
                      </b>{" "}
                      {this.props.cfcUserDetails?.cfcAddress}{" "}
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
