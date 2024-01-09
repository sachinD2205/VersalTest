import { Button } from "@mui/material";
import sweetAlert from "sweetalert";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../../URLS/urls";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./LoiGenerationRecipt.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
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
    console.log("1234", router?.query?.applicationId);

    if (router?.query?.applicationId) {
      axios
        .get(
          `${
            urls.MR
          }/transaction/applicant/getapplicantById?applicationId=${Number(
            router?.query?.applicationId,
          )}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          setdata(res.data);
          console.log("loi recept data", res.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  const [data, setdata] = useState();
  useEffect(() => {
    console.log("useeffect");
    getLoiGenerationData();
  }, []);
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
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
  }, []);
  // const router = useRouter()
  // View
  return (
    <>
      {console.log("componentRef", componentRef)}
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
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            const textAlert =
              language == "en"
                ? "Are you sure you want to exit this Record ? "
                : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
            const title = language == "en" ? "Exit ! " : "बाहेर पडा!";

            sweetAlert({
              title: title,
              text: textAlert,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                // swal("Record is Successfully Exit!", {
                //   icon: "success",
                // });
                language == "en"
                  ? sweetAlert({
                      title: "Exit!",
                      text: "Record is Successfully Exit!!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "बाहेर पडा!",
                      text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                      icon: "success",
                      button: "Ok",
                    });
                router.push(
                  "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
                );
              } else {
                language == "en"
                  ? sweetAlert({
                      title: "Cancel!",
                      text: "Record is Successfully Cancel!!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "रद्द केले!",
                      text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                      icon: "success",
                      button: "ओके",
                    });
              }
            });
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
      </div>
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

            <div
              className={styles.two}
              style={{
                marginTop: "2vh",
                marginLeft: "5vh",
                marginRight: "5vh",
              }}
            >
              <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "" }}> एल.ओ.आय.क्र :</h4>
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>{this?.props?.data?.loi?.loiNo}</b>
                  </h4>
                </div>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>दिनांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.data?.loi?.createDtTm,
                          "YYYY-MM-DD HH:mm:ss A",
                        ).format("DD-MM-YYYY HH:mm A")}
                    </b>{" "}
                    {/* <b>{router?.query?.appointmentDate}</b> */}
                  </h4>
                </div>
              </div>
              <p>
                <b>
                  <h3>प्रिय, {this?.props?.data?.applicantNameMr}</h3>
                  तुमच्या <b> {this?.props?.data?.serviceNameMr}</b> या सेवेसाठी
                  नागरी सेवा पोर्टलवर कृपया तुमची रक्कम रुपये:{" "}
                  {this?.props?.data?.loi?.amount} रू.
                  <br />
                  ऑनलाईन भरा आणि संबंधित क्षेत्रीय कार्यालयाला भेट द्या .
                  <br></br>
                </b>
              </p>

              <div className={styles.date2}>
                <h4>विभाग:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.serviceNameMr}</b>
                </h4>
              </div>

              {/* <div className={styles.date2}>
                <h4>LOI NO : </h4> <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.loi?.loiNo}</h4>
              </div> */}

              {/* <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम रुपये :</th>
                  </tr>
                  <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>{this?.props?.data?.serviceNameMr}</td>
                    <td colSpan={4}>{this?.props?.data?.serviceCharge}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>2)</td>
                    <td colSpan={4}>विलंब शुल्क</td>
                    <td colSpan={4}>{this?.props?.data?.penaltyCharge}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>3)</td>
                    <td colSpan={4}>
                      प्रत शुल्क( {this?.props?.data?.loi?.noOfCopies})
                    </td>
                    <td colSpan={4}>{this?.props?.data?.loi?.noOfCopies} </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>
                        एकूण रक्कम रुपये : {this?.props?.data?.loi?.amount}{" "}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table> */}

              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम रुपये :</th>
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.data?.serviceCharges.map((row, i) => (
                    <tr key={row.id}>
                      <td colSpan={4}>{i + 1}</td>
                      <td colSpan={4}>
                        {row.serviceChargesId == 5
                          ? row.chargeNameMr +
                            "(" +
                            row.rate +
                            ")" +
                            " X " +
                            this?.props?.data?.loi?.noOfCopies +
                            " (प्रति)"
                          : row.chargeNameMr}
                      </td>
                      <td colSpan={4}>
                        {row.serviceChargesId == 5
                          ? row.rate * this?.props?.data?.loi?.noOfCopies
                          : row.rate}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b> एकूण रक्कम रुपये :</b>
                    </td>
                    <td colSpan={4}>
                      <b>{this?.props?.data?.loi?.amount} </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4>अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.applicationNumber}</b>
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
                        "YYYY-MM-DD",
                      ).format("DD-MM-YYYY")}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  <b> {this?.props?.data?.applicantNameMr} </b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचा पत्ता : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {this?.props?.data?.aflatBuildingNoMr}
                    {" ,"}
                    {this?.props?.data?.abuildingNameMr}
                    {" ,"}
                    {this?.props?.data?.aroadNameMr} {","}
                    {this?.props?.data?.alandmarkMr} {","}
                    {/* <br></br> */}
                    {this?.props?.data?.acityNameMr} {""}{" "}
                  </b>
                  {/* {this?.props?.data?.astateMr}{" "} */}
                </h4>
              </div>

              <hr />

              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपालिका </h5>
                  <h5>
                    {" "}
                    {this?.props?.data?.zone?.zoneNameMr}
                    {","} {this?.props?.data?.zone?.zoneaddressMr}
                  </h5>
                </div>
                <div className={styles.add1}>
                  <h5>कृपया संबंधित क्षेत्रीय कार्यालयाशी संपर्क साधावा</h5>
                  {/* <h5>
                    इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5> */}
                </div>
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
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
