import React, { useEffect, useRef, useState } from "react";
import styles from "./acknowledgement.module.css";
import { useReactToPrint } from "react-to-print";
import { Button, Card } from "@mui/material";
import urls from "../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ToWords } from "to-words";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import Loader from "../../../../containers/Layout/components/Loader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language === "en"
        ? "RTI Application Acknowldgement"
        : "आरटीआय अर्जाची पोचपावती",
  });
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // get application details by application no
  useEffect(() => {
    if (router.query.id != undefined) {
      axios
        .get(
          `${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setData(r.data);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  }, [router.query.id]);

  useEffect(() => {
    getPaymentTypes();
  }, []);

  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}//master/paymentMode/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setPaymentTypes(
          r.data.paymentMode.map((row) => ({
            id: row.id,
            paymentMode: row.paymentMode,
            paymentModeMr: row.paymentModeMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };



  return (
    <>
      {isLoading && <CommonLoader />}
      <div>
        <ComponentToPrint
          data={data}
          paymentTypes={paymentTypes}
          ref={componentRef}
          language={language}
        />
      </div>
      <div className={styles.btn}>
        <Button
          type="primary"
          size="small"
          variant="contained"
          color="error"
          onClick={() => {
            logedInUser === "citizenUser"
              ? router.push("/dashboard")
              : logedInUser === "cfcUser"
              ? router.push("/CFC_Dashboard")
              : router.push(
                  "/RTIOnlineSystem/transactions/rtiApplication/rtiAplicationList"
                );
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
        <Button
          variant="contained"
          type="primary"
          size="small"
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>
      </div>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    const toWordsEn = new ToWords({ localeCode: "en-IN" });
    const toWordsMr = new ToWords({ localeCode: "mr-IN" });
    const toWords = this.props.language == "en" ? toWordsEn : toWordsMr;
    return (
      <div className={styles.mainn}>
        <div className={styles.main}>
          <div className={styles.one}>
            <div className={styles.logo}>
              <div>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div
              className={styles.one}
              styles={{
                paddingTop: "15vh",
                marginTop: "20vh",
                display: "flex",
              }}
            >
              <div className={styles.logo1} style={{ margin: "5px" }}>
                <img src="/logo.png" alt="" height="50vh" width="50vw" />
              </div>
              <h1>
                <b>
                  <FormattedLabel id="pimpariChinchwadMaha" />
                </b>
              </h1>
            </div>
            <div className={styles.logo1}>
              <img
                src="/RTIReceiptLogo.jpeg"
                alt=""
                height="100vh"
                width="100vw"
              />
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>
              <b>
                <FormattedLabel id="appAcknowldgement" />
              </b>
            </h2>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h3>
                  <FormattedLabel id="ackDear" />,{" "}
                  <b>
                    {this.props.language == "en" && (
                      <>
                        {" "}
                        {this?.props?.data?.applicantFirstName +
                          " " +
                          this?.props?.data?.applicantMiddleName +
                          " " +
                          this?.props?.data?.applicantLastName}
                      </>
                    )}
                    {this.props.language == "mr" && (
                      <>
                        {" "}
                        {this?.props?.data?.applicantFirstNameMr +
                          " " +
                          this?.props?.data?.applicantMiddleNameMr +
                          " " +
                          this?.props?.data?.applicantLastNameMr}
                      </>
                    )}
                  </b>
                </h3>
                <h3>
                  <FormattedLabel id="ackpcmcthanku" />
                </h3>
                <h3>
                  <FormattedLabel id="ackshortDesc" />
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}>
                <FormattedLabel id="ackApplicationSummery" />
              </h2>
            </div>
            <Card>
              <div className={styles.summ}>
                <div style={{ width: "100%" }}>
                  <div className={`${styles.labelValue} ${styles.address}`}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="acknowldgementNo" />:
                    </h3>
                    <h3 className={styles.value}>
                      {this?.props?.data?.acknowledgementNo}
                    </h3>
                  </div>

                  <div className={`${styles.labelValue} ${styles.address}`}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="applicationNo" /> :
                    </h3>

                    <h3 className={styles.value}>
                      {this?.props?.data?.applicationNo}
                    </h3>
                  </div>
                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="applicantName" />:
                    </h3>
                    <h3 className={styles.value}>
                      <b>
                        {this.props.language == "en" && (
                          <>
                            {" "}
                            {this?.props?.data?.applicantFirstName +
                              " " +
                              this?.props?.data?.applicantMiddleName +
                              " " +
                              this?.props?.data?.applicantLastName}
                          </>
                        )}
                        {this.props.language == "mr" && (
                          <>
                            {" "}
                            {this?.props?.data?.applicantFirstNameMr +
                              " " +
                              this?.props?.data?.applicantMiddleNameMr +
                              " " +
                              this?.props?.data?.applicantLastNameMr}
                          </>
                        )}{" "}
                      </b>
                    </h3>
                  </div>

                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="dateofApplication" />:
                    </h3>
                    <h3 className={styles.value}>
                      {moment(this?.props?.data?.applicationDate).format(
                        "DD-MM-YYYY"
                      )}
                    </h3>
                  </div>
                  <div className={`${styles.labelValue} ${styles.address}`}>
                    <h3 className={styles.labelAddress}>
                      <FormattedLabel id="address" />:
                    </h3>
                    <div className={styles.value}>
                      {this.props.language === "en" && (
                        <h3>{this?.props?.data?.address}</h3>
                      )}
                      {this.props.language === "mr" && (
                        <h3>{this?.props?.data?.addressMr}</h3>
                      )}
                    </div>
                  </div>

                  {this.props?.data?.isBpl === false && (
                    <>
                      <div className={styles.labelValue}>
                        <h3 className={styles.label}>
                          <FormattedLabel id="paymentModeKey" />:
                        </h3>
                        <h3 className={styles.value}>
                          {/* {this?.props?.data?.paymentMode} */}

                          {this?.props?.data?.paymentModeKey != 0 ||
                          this?.props?.data.paymentModeKey != null
                            ? this?.props?.language === "en"
                              ? this.props?.paymentTypes &&
                                this.props?.paymentTypes?.find(
                                  (obj) =>
                                    obj.id === this?.props?.data?.paymentModeKey
                                )?.paymentMode
                              : this.props?.paymentTypes &&
                                this.props?.paymentTypes?.find(
                                  (obj) =>
                                    obj.id === this?.props?.data?.paymentModeKey
                                )?.paymentModeMr
                            : this?.props?.data?.paymentMode}
                        </h3>
                      </div>
                      <div className={styles.labelValue}>
                        <h3 className={styles.label}>
                          <FormattedLabel id="paymentType" />:
                        </h3>
                        <h3 className={styles.value}>
                          {this?.props?.data?.paymentType != undefined
                            ? this?.props?.language === "en"
                              ? this?.props?.data?.paymentType + ""
                              : this?.props?.data?.paymentType === "Online"
                              ? "ऑनलाइन "
                              : "ऑफलाइन "
                            : ""}
                        </h3>
                      </div>
                      <div className={styles.labelValue}>
                        <h3 className={styles.label}>
                          <FormattedLabel id="amount" />:
                        </h3>
                        <h3 className={styles.value}>
                          ₹. {this?.props?.data?.serviceChargeAmount}
                        </h3>
                      </div>
                      <div className={styles.labelValue}>
                        <h3 className={styles.label}>
                          <FormattedLabel id="amountInWord" />:
                        </h3>
                        <h3 className={styles.value}>
                          ₹.{" "}
                          {toWords.convert(
                            Number(this?.props?.data?.serviceChargeAmount || 0)
                          )}{" "}
                          {this.props.language === "en"
                            ? " Rupees Only"
                            : " रुपये फक्त "}
                        </h3>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <div className={styles.query}>
              <h4>
                <FormattedLabel id="ackplzContactNearestOperator" />
              </h4>
            </div>

            <div className={styles.foot}>
              <div className={styles.add}>
                <h5>
                  <FormattedLabel id="pimpariChinchwadMaha" />
                </h5>
                <h5>
                  {" "}
                  <FormattedLabel id="ackpcmcAddress" />
                </h5>
              </div>
              <div className={styles.add1}>
                <h5>
                  <FormattedLabel id="ackPcmcphNo" />
                </h5>
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                }}
              >
                <img src="/rtiqrcode.png" alt="" height="100vh" width="100vw" />
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                  marginRight: "5vh",
                }}
              >
                <img src="/barcode.png" alt="" height="50vh" width="100vw" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
