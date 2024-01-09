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
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";

const Index = () => {
  // access query params
  const router = useRouter();
  const componentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
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
        // setFilteredData(Array.from(new Set(results)));
        let __Data = Array.from(new Set(results));
        Number(router?.query?.applicationId) &&
          getDataByApplicationNumber(
            Number(router?.query?.applicationId),
            __Data
          );
      }
    }
  }, [router.query]);

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

  const getDataByApplicationNumber = (applicationNumber, __Data) => {
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${applicationNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("by application no", res);
        // setFilteredData([...filteredData, res?.data]);
        console.log("itemitem", filteredData);

        let data = __Data?.map((item) => {
          return {
            ...item,
            applicantData: res?.data,
          };
        });
        setFilteredData(data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  console.log("filteredData", filteredData);

  return (
    <>
      <div>
        <ComponentToPrint data={filteredData} ref={componentRef} />
      </div>
      <div className={styles.btn}>
        <Button
          variant="contained"
          type="primary"
          onClick={handlePrint}
          size="small"
        >
          <FormattedLabel id="print" />
        </Button>
        {filteredData[0]?.paymentStatus == "Success" && (
          <Button
            size="small"
            variant="contained"
            type="primary"
            onClick={() => {
              router.push({
                pathname:
                  "/PublicAuditorium/transaction/auditoriumBooking/pgSuccess/PaymentReceipt",
                query: { data: JSON.stringify(router?.query), mode: "ONLINE" },
              });
            }}
          >
            View Receipt
          </Button>
        )}

        <Button
          type="primary"
          color="error"
          variant="contained"
          size="small"
          onClick={() => {
            filteredData[0]?.paymentStatus == "Success"
              ? router.push({
                  pathname:
                    "/PublicAuditorium/transaction/auditoriumBooking/paymentSlip",
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
            border: "2px solid black",
            padding: "10px",
            background: "white",
            width: "80%",
          }}
        >
          <center>
            {this.props?.data[0]?.paymentStatus === "Success" && (
              <>
                <CheckCircleIcon color="success" style={{ fontSize: "60px" }} />
                <h1>
                  {/* <FormattedLabel id="yourPaymentDoneSuccess" />{" "} */}
                  <FormattedLabel id="audBookingRentCharges" />{" "}
                </h1>{" "}
              </>
            )}
            {this.props?.data[0]?.paymentStatus === "Aborted" && (
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
                  {item.merchant_param3 != 0 && (
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div>
                        <b>
                          <FormattedLabel id="loiNo" />
                          {"  :  "}
                        </b>{" "}
                        {item.merchant_param3}{" "}
                      </div>
                    </Grid>
                  )}
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="applicationNo" /> {"  :  "}{" "}
                      </b>{" "}
                      {item.applicationId}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="orderId" />
                        {"  :  "}{" "}
                      </b>{" "}
                      {item.order_id}{" "}
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
                        <FormattedLabel id="bankRefNo" /> {"  :  "}
                      </b>{" "}
                      {item.bank_ref_no}{" "}
                    </div>
                  </Grid>

                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingName" /> {"  :  "}{" "}
                      </b>{" "}
                      {item?.applicantData?.applicantName}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingAdd" /> {"  :  "}
                      </b>{" "}
                      {item?.applicantData?.applicantFlatHouseNo}
                      {" ,"}
                      {item?.applicantData?.applicantFlatBuildingName}
                      {" ,"}
                      {item?.applicantData?.applicantArea}
                      {"."}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingCity" /> {"  :  "}
                      </b>{" "}
                      {item?.applicantData?.applicantCity}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={4} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingState" /> {"  :  "}{" "}
                      </b>{" "}
                      {item?.applicantData?.applicantState}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingZip" /> {"  :  "}
                      </b>{" "}
                      {item?.applicantData?.applicantPinCode}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingCountry" /> {"  :  "}
                      </b>{" "}
                      {item?.applicantData?.applicantCountry}{" "}
                    </div>
                  </Grid>

                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="billingEmail" /> {"  :  "}{" "}
                      </b>{" "}
                      {item?.applicantData?.applicantEmail}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="mobileNo" />
                        {"  :  "}{" "}
                      </b>{" "}
                      {item?.applicantData?.applicantMobileNo}{" "}
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
                        <FormattedLabel id="transactionDate" />
                        {"  :  "}
                      </b>{" "}
                      {item.trans_date}{" "}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div>
                      <b>
                        <FormattedLabel id="orderStatus" />
                        {"  :  "}
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
