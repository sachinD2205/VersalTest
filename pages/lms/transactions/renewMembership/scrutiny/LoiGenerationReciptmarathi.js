import { Button, Grid, Stack } from "@mui/material";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./LoiGenerationRecipt.module.css";
import router, { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import moment from "moment";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import Loader from "../../../../../containers/Layout/components/Loader";

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
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state?.labels.language);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    axios
      .get(
        `${urls.LMSURL}/trnRenewalOfMembership/getByIdAndServiceId?id=${
          router?.query?.id
        }&serviceId=${90}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setdata(res.data);
        getLibraryName(res.data.zoneKey, res.data.libraryKey);
        console.log("loi recept data", res.data);
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    if (router?.query?.id) {
      getLoiGenerationData();
    }
  }, [router?.query?.id]);

  const [data, setdata] = useState();

  const [libraryName, setLibraryName] = useState();

  const getLibraryName = (zoneKey, libraryKey) => {
    if (zoneKey) {
      axios
        .get(
          `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${zoneKey}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          // setLibraryKeys(
          //   r.data.libraryMasterList.map((row) => ({
          //     id: row.id,
          //     // zoneName: row.zoneName,
          //     // zoneNameMr: row.zoneNameMr,
          //     libraryName: row.libraryName,
          //   })),

          let tempName = r.data?.libraryMasterList?.find(
            (r, i) => r.id == libraryKey
          ).libraryName;
          console.log(tempName, "tempName");
          setLibraryName(tempName);
          // )
        })
        .catch((error) => {
          // setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

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
  }, []);
  // const router = useRouter()
  // View

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <ComponentToPrint
            ref={componentRef}
            data={data}
            libraryName={libraryName}
          />
        </div>
      )}
      <br />

      <div className={styles.btn}>
        <Button
          size="small"
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          print
        </Button>

        <Button
          type="primary"
          size="small"
          variant="contained"
          onClick={() => {
            swal({
              title: language == "en" ? "Exit?" : "बाहेर पडा?",
              text:
                language == "en"
                  ? "Are you sure you want to exit this Record?"
                  : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal(
                  language == "en"
                    ? "Successfully exited from record"
                    : "रेकॉर्डमधून यशस्वीरित्या बाहेर पडले",
                  {
                    icon: "success",
                  }
                );
                router.push("/lms/transactions/renewMembership/scrutiny");
              } else {
                swal(
                  language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे"
                );
              }
            });
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};
// class component To Print
class ComponentToPrint extends React.Component {
  render() {
    const currDate = new Date();
    console.log(this.props.data, "props");
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            {/* <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div
                className={styles.middle}
                styles={{ paddingTop: '15vh', marginTop: '20vh' }}
              >
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
           
              </div>
              <div className={styles.logo1}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div> */}
            <Grid container sx={{ padding: "5px" }}>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src="/logo.png" alt="" height="100vh" width="100vw" />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h2>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </Grid>
            </Grid>
            <div>
              <h2 className={styles.heading}>
                <b>सेवा स्वीकृती पत्र</b>
              </h2>
            </div>

            <div className={styles.two}>
              <p>
                <b>
                  <h3>प्रिय, {this?.props?.data?.applicantNameMr}</h3>
                  <br></br> &ensp; तुमच्या{" "}
                  <b>{this?.props?.data?.serviceNameMr}</b> या सेवेसाठी नागरिक
                  सेवा पोर्टलवर कृपया तुमची रक्कम रुपये:{" "}
                  {this?.props?.data?.amount}/-&nbsp; निश्चित करा आणि केलेल्या
                  सेवेची रक्कम/शुल्क भरा.
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
                  {this?.props?.data?.loiNo}
                </h4>
              </div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम(रु)</th>
                  </tr>
                  <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>{this?.props?.data?.serviceNameMr}</td>
                    <td colSpan={4}>{this?.props?.data?.amount}</td>
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
                      <b>एकूण रक्कम : {this?.props?.data?.amount}&nbsp;/-</b>
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
                <h4>ग्रंथालयाचे नाव : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.libraryName}
                </h4>
              </div>
              <div className={styles.date2}>
                <h4>अर्जदाराचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.applicantNameMr}
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

              {/* NEWLY ADDED */}

              <div className={styles.date2}>
                <h4>नूतनीकरण दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " + moment(this.currDate).format("DD-MM-YYYY HH:mm")}
                  </b>{" "}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचा पत्ता : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.aflatBuildingNoMr}
                  {" ,"}
                  {this?.props?.data?.abuildingNameMr}
                  {" ,"}
                  {this?.props?.data?.aroadNameMr} {","}
                  {this?.props?.data?.alandmarkMr} {","}
                  {this?.props?.data?.acityNameMr} {","}
                  {this?.props?.data?.astateMr}{" "}
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
              {/* <div className={styles.foot}>
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
              </div> */}
              <Grid container>
                <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>
                    इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img src="/barcode.png" alt="" height="35vh" width="60vw" />
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
