import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Grid } from "@mui/material";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import styles from "./acknowledgement.module.css";

import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  // access query params
  const router = useRouter();
  const componentRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  console.log("useEffect");
  console.log("useEffect ", router.query);

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
    getServiceName();
  }, []);

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

  console.log("filteredData", filteredData[0]?.merchant_param5 && filteredData);

  const [serviceList, setServiceList] = useState([]);

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      <div>
        <ComponentToPrint
          data={filteredData}
          ref={componentRef}
          serviceList={serviceList}
          language={language}
        />
      </div>
      <div className={styles.btn}>
        <Button
          size="small"
          variant="contained"
          type="primary"
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>

        {filteredData[0]?.paymentStatus === "Success" && (
          <Button
            size="small"
            variant="contained"
            type="primary"
            onClick={() => {
              router.push({
                pathname:
                  "/PublicAuditorium/transaction/auditoriumBooking/pgSuccessRentRehearsal/PaymentReceiptRentRehearsal",
                query: { data: JSON.stringify(router?.query), mode: "ONLINE" },
              });
              console.log("onCLick", JSON.stringify(router?.query));
            }}
          >
            View Receipt
          </Button>
        )}

        <Button
          size="small"
          type="primary"
          variant="contained"
          onClick={() => {
            filteredData[0]?.paymentStatus === "Success"
              ? router.push({
                  pathname:
                    "/PublicAuditorium/transaction/auditoriumBooking/acknowledgmentReceiptmarathi",
                  query: {
                    data: JSON.stringify(router?.query),
                    mode: "ONLINE",
                  },
                })
              : router.push("/PublicAuditorium/dashboard");
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
            width: "90%",
          }}
        >
          <center>
            {this.props?.data[0]?.paymentStatus === "Success" && (
              <>
                <CheckCircleIcon color="success" style={{ fontSize: "60px" }} />
                <h1>
                  <FormattedLabel id="yourRehearsalRentPaymentDoneSuccess" />{" "}
                </h1>{" "}
              </>
            )}
            {this.props?.data[0]?.paymentStatus === "Aborted" && (
              <>
                <CloseIcon color="error" style={{ fontSize: "60px" }} />
                <h1>
                  <FormattedLabel id="paymentRehearsalRentFailed" />{" "}
                </h1>
              </>
            )}
          </center>

          {/* <center> */}
          {this.props.data.map((item, index) => {
            return (
              <>
                <Grid container style={{ lineHeight: 2.2 }}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="applicationNo" /> {"  :  "}{" "}
                      </b>{" "}
                      {Number(item.applicationId)}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="applicationDate" />
                        {"  :  "}{" "}
                      </b>{" "}
                      {item.merchant_param5 &&
                        moment(
                          JSON.parse(item.merchant_param5)?.applicationDate
                        ).format("DD/MM/YYYY")}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="moduleName" /> {"  :  "}
                      </b>{" "}
                      {this.props.language == "en"
                        ? "Public Auditorium Booking & Broadcast Management"
                        : "सार्वजनिक प्रेक्षागृह / नाट्यगृह बुकिंग आणि प्रसारण व्यवस्थापन"}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="selectService" />
                        {"  :  "}
                      </b>{" "}
                      {this.props.language == "en"
                        ? item.serviceId &&
                          this.props?.serviceList.find(
                            (obj) => obj?.id == item.serviceId
                          )?.serviceName
                        : item.serviceId &&
                          this.props?.serviceList.find(
                            (obj) => obj?.id == item.serviceId
                          )?.serviceNameMr}
                    </div>
                  </Grid>
                  {/* <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="applicantName" /> {"  :  "}
                      </b>{" "}
                      {item.merchant_param5 &&
                        JSON.parse(item.merchant_param5)?.applicantName}
                    </div>
                  </Grid> */}
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="deposite" />
                        {"  :  "}
                      </b>{" "}
                      {Number(item.mer_amount).toFixed(2)}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="trackingId" /> {"  :  "}{" "}
                      </b>{" "}
                      {item.tracking_id}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="transactionDate" />
                        {"  :  "}
                      </b>{" "}
                      {item.trans_date}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="totalAmount" /> {"  :  "}
                      </b>{" "}
                      {Number(item.mer_amount)?.toFixed(2)}{" "}
                    </div>
                  </Grid>

                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="status" /> {"  :  "}
                      </b>{" "}
                      {item.paymentStatus}{" "}
                    </div>
                  </Grid>
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
