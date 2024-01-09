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
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const LoiGenerationRecipt = () => {
  const token = useSelector((state) => state.user.user.token);

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

  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);

  const componentRef = useRef(null);
  const router = useRouter();
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState();

  const [libraryName, setLibraryName] = useState();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [libraryType, setLibraryType] = useState();

  const [libraryList, setLibraryList] = useState([]);

  const getLoiGenerationData = (data) => {
    console.log("1234", router?.query?.id);
    if (router?.query?.id) {
      setLoading(true);
      axios
        .get(
          `${urls.LMSURL}/trnApplyForNewMembership/getById?id=${router?.query?.id}`,
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
          setLibraryType(
            libraryList.find((library) => library.id == res.data.libraryKey)
              ?.libraryType
          );
          console.log(
            "loi recept data",
            res.data,
            libraryList.find((library) => library.id == res.data.libraryKey)
              ?.libraryType
          );
        })
        .catch((err) => {
          // swal("Error!", "Somethings Wrong Record not Updated!", "error");
          catchExceptionHandlingMethod(err, language);
          setLoading(false);
        });
    }
  };

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
        });
    }
  };

  useEffect(() => {
    console.log("useeffect");
    getLibraryList();
    // getLoiGenerationData()
  }, []);

  useEffect(() => {
    console.log("setting library list", libraryList);
    getLoiGenerationData();
  }, [libraryList]);

  useEffect(() => {
    if (libraryType) {
      getServiceCharges();
    }
  }, [libraryType]);

  const getLibraryList = () => {
    axios
      // .get(
      //   `${urls.CFCURL
      //   }/master/servicecharges/getByServiceId?serviceId=${getValues(
      //     'serviceId',
      //   )}`,
      // )
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLibraryList(r.data?.libraryMasterList);
      });
  };
  const [serviceCharge, setServiceCharges] = useState([]);

  const getServiceCharges = () => {
    axios
      // .get(
      //   `${urls.CFCURL
      //   }/master/servicecharges/getByServiceId?serviceId=${getValues(
      //     'serviceId',
      //   )}`,
      // )
      .get(`${urls.LMSURL}/libraryRateCharge/getByServiceId?serviceId=85`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log(
          "Service charges",
          r.data.mstLibraryRateChargeList,
          libraryType
        );
        // setValue('serviceCharges', r.data.mstLibraryRateChargeList)
        let tempCharges = [];
        r.data.mstLibraryRateChargeList.forEach((data) => {
          if (libraryType == "L" && data.libraryType == "L") {
            if (
              data.chargeType == "C" ||
              data.chargeType == "D" ||
              data.chargeType == "F"
            ) {
              tempCharges.push(data);
            }
          } else if (libraryType == "C" && data.libraryType == "C") {
            if (
              data.chargeType == "C" ||
              data.chargeType == "D" ||
              data.chargeType == "F"
            ) {
              tempCharges.push(data);
            }
          }
        });

        console.log("tempcharges", tempCharges);
        setServiceCharges(tempCharges);
      });
  };

  useEffect(() => {}, [serviceCharge]);

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
        <>
          <div>
            <ComponentToPrint
              ref={componentRef}
              data={data}
              libraryName={libraryName}
              serviceCharge={serviceCharge}
              isSmallScreen={isSmallScreen}
            />
          </div>
          <br />

          <div className={styles.btn}>
            <Button
              variant="contained"
              sx={{ size: "23px" }}
              size="small"
              type="primary"
              onClick={handlePrint}
            >
              {/* print */}
              <FormattedLabel id="printD" />
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
                      : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?",
                  icon: "warning",
                  buttons: {
                    ok: language === "en" ? "Ok" : "ठीक आहे",
                    cancel: language === "en" ? "Cancel" : "रद्द करा",
                  },
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    swal(
                      language == "en"
                        ? "Record is Successfully Exit!"
                        : "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                      {
                        icon: "success",
                        button: language === "en" ? "Ok" : "ठीक आहे",
                      }
                    );
                    router.push(
                      "/lms/transactions/newMembershipRegistration/scrutiny"
                    );
                  } else {
                    swal({
                      text:
                        language == "en"
                          ? "Record is Safe"
                          : "रेकॉर्ड सुरक्षित आहे",
                      button: language === "en" ? "Ok" : "ठीक आहे",
                    });
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
                {this.props.isSmallScreen ? (
                  <img src="/logo.png" alt="" height="50vh" width="50vw" />
                ) : (
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                )}
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
                {this.props.isSmallScreen ? (
                  <h4>
                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                  </h4>
                ) : (
                  <h2>
                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                  </h2>
                )}
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
                {this.props.isSmallScreen ? (
                  <img
                    src="/smartCityPCMC.png"
                    alt=""
                    height="50vh"
                    width="50vw"
                  />
                ) : (
                  <img
                    src="/smartCityPCMC.png"
                    alt=""
                    height="100vh"
                    width="100vw"
                  />
                )}
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
                  <h3>प्रति, {this?.props?.data?.applicantNameMr}</h3>
                  <br></br> &ensp; तुमच्या{" "}
                  <b>{this?.props?.data?.serviceNameMr}</b> या सेवेसाठी नागरिक
                  सेवा पोर्टलवर कृपया तुमची रक्कम रुपये:{" "}
                  {this?.props?.data?.loiDao?.amount}/-&nbsp; निश्चित करा आणि
                  केलेल्या सेवेची रक्कम/शुल्क भरा.
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
                  {this?.props?.data?.loiDao?.loiNo}
                </h4>
              </div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम(रु)</th>
                  </tr>
                  {/* <tr>
                      <td colSpan={4}>1)</td>
                      <td colSpan={4}>{this?.props?.serviceCharge}</td>
                      <td colSpan={4}>{this?.props?.serviceCharge}</td>
                    </tr> */}

                  {this.props.serviceCharge?.map((service, index) => (
                    <tr>
                      <td colSpan={4}>{index + 1}</td>
                      {service.chargeType == "C" ? (
                        <td colSpan={4}>
                          {service.chargeNameMr} * सदस्यत्व महिने
                        </td>
                      ) : (
                        <td colSpan={4}>{service.chargeNameMr}</td>
                      )}
                      {service.chargeType == "C" ? (
                        <td colSpan={4}>
                          {service.amount} *{" "}
                          {this?.props?.data?.membershipMonths}
                        </td>
                      ) : (
                        <td colSpan={4}>{service.amount}</td>
                      )}
                    </tr>
                  ))}
                  {this.props?.data?.libraryType == "L" &&
                    this?.props?.data?.membershipMonths == "12" &&
                    this?.props?.data?.loiDao?.isDiscount == true && (
                      <tr>
                        <td colSpan={4}>3</td>
                        <td colSpan={4}>सवलत</td>
                        {/* <td colSpan={4}>-40</td> */}
                        <td colSpan={4}>
                          {`-${this?.props?.data?.loiDao?.discountAmount}`}
                        </td>
                      </tr>
                    )}
                  {/* {this.props?.data?.libraryType == "L" ? (
                    this?.props?.data?.membershipMonths == "12" ? (
                      <tr>
                        <td colSpan={4}>3</td>
                        <td colSpan={4}>सवलत</td>
                        <td colSpan={4}>-40</td>
                      </tr>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )} */}
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
                        एकूण रक्कम : {this?.props?.data?.loiDao?.amount}&nbsp;/-
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
                  {this.props.isSmallScreen ? (
                    <img src="/qrcode1.png" alt="" height="50vh" width="50vw" />
                  ) : (
                    <img
                      src="/qrcode1.png"
                      alt=""
                      height="100vh"
                      width="100vw"
                    />
                  )}
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
                  {this.props.isSmallScreen ? (
                    <img src="/barcode.png" alt="" height="25vh" width="50vw" />
                  ) : (
                    <img src="/barcode.png" alt="" height="35vh" width="60vw" />
                  )}
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
