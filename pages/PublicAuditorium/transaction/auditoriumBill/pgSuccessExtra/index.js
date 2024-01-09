import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Grid } from "@mui/material";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import styles from "./acknowledgement.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";

const Index = () => {
  // access query params
  const router = useRouter();
  const componentRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);

  const [dataById, setDataById] = useState([]);

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
        // setFilteredData(Array.from(new Set(results)));
        let __Data = Array.from(new Set(results));
        router?.query?.applicationId &&
          getAuditoriumBookingDetailsById(router?.query?.applicationId, __Data);
      }
    }
  }, [router.query]);

  const getAuditoriumBookingDetailsById = (id, __Data) => {
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("By id", r);
        let data = __Data?.map((item) => {
          return {
            ...item,
            applicantData: r?.data,
          };
        });
        setDataById(data);
        // setDataById(r?.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  console.log(
    "filteredData",
    filteredData[0]?.merchant_param5 &&
      JSON.parse(filteredData[0]?.merchant_param5)
  );

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
          dataById={dataById}
        />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          <FormattedLabel id="print" />
        </Button>
        <Button
          size="small"
          variant="contained"
          type="primary"
          onClick={() => {
            router.push({
              pathname:
                "/PublicAuditorium/transaction/auditoriumBill/pgSuccessExtra/PaymentReceipt",
              query: {
                showData: JSON.stringify(router?.query),
              },
            });
          }}
        >
          View Receipt
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push({
              pathname:
                "/PublicAuditorium/transaction/auditoriumBill/AuditoriumBillReceipt",
              query: {
                showData: JSON.stringify(router?.query),
                user: "Citizen",
              },
            });

            // router.push({
            //   pathname:
            //     "/PublicAuditorium/transaction/auditoriumBooking/acknowledgmentReceiptmarathi",
            //   query: { data: JSON.stringify(router?.query), mode: "ONLINE" },
            // });
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
    console.log("props", this.props);
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
            width: "80%",
          }}
        >
          <center>
            {this.props?.dataById[0]?.paymentStatus === "Success" && (
              <>
                <CheckCircleIcon color="success" style={{ fontSize: "60px" }} />
                <h1>
                  <FormattedLabel id="extraAmountPaid" />{" "}
                </h1>{" "}
              </>
            )}
            {this.props?.dataById[0]?.paymentStatus === "Failure" && (
              <>
                <CloseIcon color="error" style={{ fontSize: "60px" }} />
                <h1>
                  <FormattedLabel id="paymentFailed" />{" "}
                </h1>
              </>
            )}
          </center>

          {/* <center> */}
          {this?.props?.dataById?.map((item, index) => {
            return (
              <>
                <Grid container style={{ lineHeight: 2.2 }}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="applicationNo" /> {"  :  "}{" "}
                      </b>{" "}
                      {item.merchant_param5 && JSON.parse(item.merchant_param5)}{" "}
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
                        ? item.merchant_param5 &&
                          this.props?.serviceList.find(
                            (obj) => obj?.id == JSON.parse(item.serviceId)
                          )?.serviceName
                        : item.merchant_param5 &&
                          this.props?.serviceList.find(
                            (obj) => obj?.id == JSON.parse(item.serviceId)
                          )?.serviceNameMr}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="applicantName" /> {"  :  "}
                      </b>{" "}
                      {item?.applicantData?.applicantName}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="extraAmount" />
                        {"  :  "}
                      </b>{" "}
                      {item.mer_amount}
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
                      {item.mer_amount}{" "}
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
