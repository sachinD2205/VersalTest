import React, { useEffect, useRef, useState } from "react";
import styles from "./acknowledgement.module.css";
import { useReactToPrint } from "react-to-print";
import { Button, Card } from "@mui/material";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import { useSelector } from "react-redux";
import { ToWords } from "to-words";
import Loader from "../../../../containers/Layout/components/Loader";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const language = useSelector((state) => state.labels.language);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language === "en" ? "RTI Appeal Acknowldgement" : "आरटीआय अपील पोचपावती",
  });

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

  // get appeal details by application no
  useEffect(() => {
    if (router.query.id != undefined && router.query.id != null) {
    
      setIsLoading(true);
      axios
        .get(
          `${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          setData(r.data);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  }, [router.query.id]);



  return (
    <>
      {isLoading && <CommonLoader />}
      <div>
        <ComponentToPrint data={data} ref={componentRef} language={language} />
      </div>
      <div className={styles.btn}>
      <Button
          type="primary"
          size="small"
          color="error"
          variant="contained"
          onClick={() => {
            logedInUser==='citizenUser'
            ? router.push("/dashboard")
            : logedInUser==='cfcUser'? router.push("/CFC_Dashboard"):
            router.push("RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList");
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
            <div className={styles.middle} styles={{ display: "flex" }}>
              <div className={styles.one}>
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
                  {this.props.language === "en" && (
                    <b>
                      {this?.props?.data?.applicantFirstName +
                        " " +
                        this?.props?.data?.applicantMiddleName +
                        " " +
                        this?.props?.data?.applicantLastName}
                    </b>
                  )}
                  {this.props.language === "mr" && (
                    <b>
                      {this?.props?.data?.applicantFirstNameMr +
                        " " +
                        this?.props?.data?.applicantMiddleNameMr +
                        " " +
                        this?.props?.data?.applicantLastNameMr}
                    </b>
                  )}
                </h3>
                <h3>
                  <FormattedLabel id="ackpcmcthanku" />
                </h3>
                <h3>
                  <FormattedLabel id="ackRTIAppealshortDesc" />
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
                      <FormattedLabel id="applicationNo" />:
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
                      {this.props.language === "en" && (
                        <b>
                          {this?.props?.data?.applicantFirstName +
                            " " +
                            this?.props?.data?.applicantMiddleName +
                            " " +
                            this?.props?.data?.applicantLastName}
                        </b>
                      )}
                      {this.props.language === "mr" && (
                        <b>
                          {this?.props?.data?.applicantFirstNameMr +
                            " " +
                            this?.props?.data?.applicantMiddleNameMr +
                            " " +
                            this?.props?.data?.applicantLastNameMr}
                        </b>
                      )}
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
                    <h3 className={styles.label}>
                      <FormattedLabel id="address" />:
                    </h3>
                    <div className={styles.value}>
                      <h3>
                        {this.props.language === "en"
                          ? this?.props?.data?.address
                          : this?.props?.data?.addressMr}
                      </h3>
                    </div>
                  </div>

                  {this.props?.data?.paymentType === "Online" && (
                    <>
                      <div className={styles.labelValue}>
                        <h3 className={styles.label}>
                          <FormattedLabel id="paymentModeKey" />:
                        </h3>
                        <h3 className={styles.value}>
                          {this?.props?.data?.paymentMode}
                        </h3>
                      </div>
                      <div className={styles.labelValue}>
                        <h3 className={styles.label}>
                          <FormattedLabel id="paymentType" />:
                        </h3>
                        <h3 className={styles.value}>
                          {this?.props?.data?.paymentType}
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
