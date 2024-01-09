import { Button, Grid, Stack } from "@mui/material";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./LoiGenerationRecipt.module.css";
import router, { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const LoiGenerationRecipt = () => {
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [data, setdata] = useState();
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state?.labels?.language);

  const userToken = useGetToken();
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
  const getLoiGenerationData = (data) => {
    console.log("1234", router?.query?.id);

    if (router?.query?.id) {
      setLoading(true);
      axios
        .get(
          `${urls.SSLM}/trnIssuanceOfIndustrialLicense/getByServiceIdAndId?serviceId=8&id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setdata(res.data);
          console.log("loi recept data", res.data);
        })
        .catch((err) => {
          // callCatchMethod(err, language);
          setLoading(false);
          sweetAlert({
            title: language === "en" ? "Error !! " : "त्रुटी !!",
            text:
              language === "en"
                ? "Somethings Wrong !! Getting error while fetching records !"
                : "काहीतरी त्रुटी !! रेकॉर्ड मिळवताना त्रुटी येत आहे",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              router.push(`/dashboard`);
            }
          });
        });
    }
  };

  useEffect(() => {
    console.log("useeffect");
    getLoiGenerationData();
  }, []);
  const user = useSelector((state) => state?.user.user);

  const componentRef = useRef(null);
  const router = useRouter();
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("router?.query", router?.query);
    reset(router?.query);
  }, [router?.query]);
  // const router = useRouter()
  // View
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <ComponentToPrint ref={componentRef} data={data} />
          </div>
          <br />

          <div className={styles.btn}>
            <Button
              variant="contained"
              sx={{ size: "23px" }}
              type="primary"
              onClick={handlePrint}
            >
              {/* print */}
              <FormattedLabel id="print" />
            </Button>

            <Button
              type="primary"
              variant="contained"
              onClick={() => {
                swal({
                  title: "Exit?",
                  text: "Are you sure you want to exit this Record ? ",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    swal("Record is Successfully Exit!", {
                      icon: "success",
                    });
                    if (router?.query?.citizenView) {
                      router.push("/dashboard");
                    } else {
                      router.push(
                        "/skySignLicense/transactions/issuanceOfIndustry/scrutiny"
                      );
                    }
                  } else {
                    swal("Record is Safe");
                  }
                });
              }}
            >
              {/* Exit */}
              <FormattedLabel id="exit" />
            </Button>
          </div>
        </>
      )}
    </>
  );
};
// class component To Print
class ComponentToPrint extends React.Component {
  render() {
    console.log(this.props.data, "props");
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div
                className={styles.middle}
                styles={{ paddingTop: "15vh", marginTop: "20vh" }}
              >
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                {/* <h4>
                {' '}
                <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
              </h4> */}

                {/* <h4>
                {' '}
                <b>महाराष्ट्र, भारत</b>
              </h4> */}
              </div>
              <div className={styles.logo1}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                <b>सेवा स्वीकृती पत्र</b>
              </h2>
            </div>

            <div className={styles.two}>
              <p>
                <b>
                  <h3>प्रिय, {this?.props?.data?.marFirstName}</h3>
                  <br></br> &ensp; तुमच्या{" "}
                  <b>{this?.props?.data?.serviceNameMr}</b> या सेवेसाठी नागरिक
                  सेवा पोर्टलवर कृपया तुमची रक्कम रुपये:{" "}
                  {this?.props?.data?.trnLoiDao?.amount}(रु)&nbsp; निश्चित करा
                  आणि केलेल्या सेवेची रक्कम/शुल्क भरा.
                  <br /> किंवा जवळील पिंपरी चिंचवड महानगरपलिका विभागीय
                  कार्यालयाला भेट द्या .<br></br>
                </b>
              </p>

              <div className={styles.date2}>
                <h4>विभाग:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.serviceNameMr}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>LOI NO : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.trnLoiDao?.loiNo}
                </h4>
              </div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम (रु)</th>
                  </tr>
                  <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>{this?.props?.data?.serviceNameMr}</td>
                    <td colSpan={4}>{this?.props?.data?.trnLoiDao?.amount}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>
                        एकूण रक्कम (रु): {this?.props?.data?.trnLoiDao?.amount}
                        /-
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4>अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.applicationNumber}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.marFirstName +
                    " " +
                    this?.props?.data?.marLastName}
                </h4>
              </div>
              <div className={styles.date2}>
                <h4>संस्थेचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.trnIndustryDetailsDao
                    ?.nameOfIndustryOrganization + " "}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " +
                      moment(
                        this?.props?.data?.applicationDate,
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचा पत्ता : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {/* {this?.props?.data?.crCitySurveyNumber}
                  {' ,'}
                  {this?.props?.data?.crAreaName}
                  {' ,'}
                  {this?.props?.data?.crLandmarkName} {','}
                  {this?.props?.data?.crVillageName} {','}
                  {this?.props?.data?.crCityName} {','}
                  {this?.props?.data?.crState}{' - '}
                  {this?.props?.data?.crPincode} */}
                  {this?.props?.data?.applicantAddress}
                </h4>
              </div>

              <hr />
              {/* 
              <div className={styles.add}>
                <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                <h5> महाराष्ट्र, भारत</h5>
              </div>

              <div className={styles.add1}>
                <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
              </div> */}
              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </div>
                <div className={styles.add1}>
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>
                    इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5>
                </div>
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
                </div>
                <div className={styles.logo1}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
