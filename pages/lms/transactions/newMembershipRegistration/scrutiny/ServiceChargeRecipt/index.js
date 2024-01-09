import { Button, Grid } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "./goshwara.module.css";
import axios from "axios";
import swal from "sweetalert";
// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
import urls from "../../../../../../URLS/urls";
import moment from "moment";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../../../util/util";
import Loader from "../../../../../../containers/Layout/components/Loader";

const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [loading, setLoading] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [lastPaymentHistory, setLastPaymentHistory] = useState({});
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

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);

  useEffect(() => {
    getLibraryList();
  }, []);
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

  const [libraryType, setLibraryType] = useState();

  const [libraryList, setLibraryList] = useState([]);

  useEffect(() => {
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
          setDataa(res.data);
          getLibraryName(res.data.zoneKey, res.data.libraryKey);
          setLibraryType(
            libraryList.find((library) => library.id == res.data.libraryKey)
              ?.libraryType
          );
          res?.data?.paymentHistory?.length > 0
            ? setLastPaymentHistory(
                res?.data?.paymentHistory[res?.data?.paymentHistory?.length - 1]
              )
            : setLastPaymentHistory({});
          console.log("board data", res.data);
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  }, [libraryList]);

  useEffect(() => {
    getServiceCharges();
  }, [libraryType, router?.query]);

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
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
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
        console.log("Service charges", r.data.mstLibraryRateChargeList);
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

        let _checkServiceCharge =
          router?.query?.doublePay == "true"
            ? tempCharges?.filter(
                (rate) => rate?.chargeType != "D" && rate?.chargeType != "F"
              )
            : tempCharges;
        // setServiceCharges(tempCharges);
        console.log("_checkServiceCharge", _checkServiceCharge);
        setServiceCharges(_checkServiceCharge);
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {}, [serviceCharge]);

  // view
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <ComponentToPrint
            dataa={dataa}
            ref={componentRef}
            libraryName={libraryName}
            serviceCharge={serviceCharge}
            lastPaymentHistory={lastPaymentHistory}
          />
        </div>
      )}
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          {/* print */}
          <FormattedLabel id="printD" />
        </Button>
        <Button
          type="primary"
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
                    : "आपण रेकॉर्डमधून यशस्वीरित्या बाहेर पडलात!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                );
                if (localStorage.getItem("loggedInUser") == "citizenUser") {
                  router.push(`/dashboard`);
                } else if (localStorage.getItem("loggedInUser") == "cfcUser") {
                  router.push(`/CFC_Dashboard`);
                } else {
                  router.push(
                    `/lms/transactions/newMembershipRegistration/scrutiny`
                  );
                }
                // if (router.query.applicationSide == "Citizen") {
                //   router.push({
                //     pathname: `/dashboard`,
                //   });
                // } else {
                //   router.push(
                //     "/lms/transactions/newMembershipRegistration/scrutiny"
                //   );
                // }
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
  );
};

class ComponentToPrint extends React.Component {
  render() {
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
                <b>पावती</b>
                <h5>
                  (महाराष्ट्र ग्रंथालय अभ्यास केंद्र विनियमन नवीन सदस्य नोंदणी)
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex' }}>
                  <h4>
                    {' '}
                    <b>दिनांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>{this?.props?.dataa?.payment?.receiptDate}</b>
                  </h4>
                </div>

                <div style={{ display: 'flex' }}>
                  <h4>
                    {' '}
                    <b>वेळ :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {this?.props?.dataa?.payment?.receiptTime}
                  </h4>
                </div>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: '40px' }}>
                  {' '}
                  <b>पावती क्रमांक :</b>
                </h4>{' '}
                <h4 style={{ marginLeft: '10px' }}>
                  <b>{this?.props?.dataa?.payment?.receiptNo}</b>
                </h4>
              </div> */}
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>अर्जाचा क्रमांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.dataa?.applicationNumber}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "1vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>अर्ज दिनांक : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.applicationDate,
                          "YYYY-MM-DD"
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>अर्जदाराचे नाव : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" " +
                      this?.props?.dataa?.afNameMr +
                      " " +
                      this?.props?.dataa?.alNameMr}
                  </h4>
                </div>
              </div>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>ग्रंथालयचे नाव :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.libraryName}
                  </h4>
                </div>
              </div>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>सदस्यत्व क्र :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.dataa?.membershipNo}
                  </h4>
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "1vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>सदस्यत्व सुरू होण्याची तारीख : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.startDate,
                          "YYYY-MM-DD"
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>सदस्यत्व समाप्ती तारीख : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.endDate,
                          "YYYY-MM-DD"
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              <p>
                <h5 style={{ marginLeft: "40px", marginRight: "40px" }}>
                  <b>
                    पुढीलप्रमाणे फी मिळाली :-
                    <br />
                    <table id="table-to-xls" className={styles.report_table}>
                      <thead>
                        <tr>
                          <th colSpan={2}>अ.क्र</th>
                          <th colSpan={8}>शुल्काचे नाव</th>
                          <th colSpan={2}>रक्कम (रु)</th>
                        </tr>
                        {/* <tr>
                          <td colSpan={4}>1)</td>
                          <td colSpan={4}>
                            {this?.props?.dataa?.serviceNameMr}
                          </td>
                          <td colSpan={4}>
                            {this?.props?.dataa?.paymentDao?.amount}
                          </td>
                        </tr> */}
                        {this.props.serviceCharge?.map((service, index) => (
                          // < tr >
                          //   <td colSpan={4}>{index + 1}</td>
                          //   <td colSpan={4}>{service.chargeNameMr}</td>
                          //   <td colSpan={4}>{service.amount}</td>
                          // </tr>
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
                                {this.props?.dataa?.libraryType == "C" &&
                                this?.props?.lastPaymentHistory
                                  ? this?.props?.lastPaymentHistory
                                      ?.noOfMonthsForPayment
                                  : this?.props?.dataa?.membershipMonths}
                                {/* {router?.query?.doublePay == "true"
                                  ? router?.query?.lastMonthsOfPay
                                  : this?.props?.dataa?.membershipMonths} */}
                              </td>
                            ) : (
                              <td colSpan={4}>{service.amount}</td>
                            )}
                          </tr>
                        ))}
                        {this.props?.dataa?.libraryType == "C" &&
                          this?.props?.lastPaymentHistory &&
                          this?.props?.lastPaymentHistory?.discountAmount >
                            0 && (
                            <tr>
                              <td colSpan={4}>
                                {" "}
                                {this?.props?.dataa?.paymentInstallmentCount ==
                                1
                                  ? 4
                                  : 2}{" "}
                              </td>
                              <td colSpan={4}>सवलत</td>
                              {/* <td colSpan={4}>-40</td> */}
                              <td colSpan={4}>
                                -
                                {
                                  this?.props?.lastPaymentHistory
                                    ?.discountAmount
                                }
                              </td>
                            </tr>
                          )}
                        {this.props?.dataa?.libraryType == "L" &&
                          this?.props?.dataa?.membershipMonths == "12" &&
                          this?.props?.dataa?.loiDao?.isDiscount == true && (
                            <tr>
                              <td colSpan={4}>3</td>
                              <td colSpan={4}>सवलत</td>
                              {/* <td colSpan={4}>-40</td> */}
                              <td colSpan={4}>
                                {`-${this?.props?.dataa?.loiDao?.discountAmount}`}
                              </td>
                            </tr>
                          )}
                        {/* {this.props?.dataa?.libraryType == "L" ? (
                          this?.props?.dataa?.membershipMonths == "12" ? (
                            <tr>
                              <td colSpan={4}></td>
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
                              एकूण रक्कम :{" "}
                              {this.props?.dataa?.libraryType == "C" &&
                              this?.props?.lastPaymentHistory
                                ? this?.props?.lastPaymentHistory?.amount
                                : this?.props?.dataa?.paymentDao?.amount}
                              /-
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    नवीन सदस्य नोंदणी झालेली दिनांक:{" "}
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.applicationDate,
                          "YYYY-MM-DD"
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.marriageDate} */}
                    ग्रंथालय अभ्यास केंद्र नोंदणी आकारण्यात येणारे नवीन सदस्य
                    नोंदणी करणे शुल्क
                  </b>
                  <b>{` एकूण फी`}</b> &nbsp;
                  {/* <b>{this?.props?.dataa?.loi?.amount}</b> */}
                  {/* <b>{this?.props?.dataa?.paymentDao?.amount} रु .</b> */}
                  <b>
                    {this.props?.dataa?.libraryType == "C" &&
                    this?.props?.lastPaymentHistory
                      ? this?.props?.lastPaymentHistory?.amount
                      : this?.props?.dataa?.paymentDao?.amount}{" "}
                    रु .
                  </b>
                  <br />
                  <br />
                  <b>
                    {this?.props?.dataa?.serviceNameMr} या सेवेसाठी नागरिक सेवा
                    पोर्टलवर तुमची रक्कम प्राप्त झाली आहे. <br />
                    <br />
                    पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालय आपल्यासेवेस तत्पर
                    आहे ,धन्यवाद.!!
                  </b>
                </h5>
              </p>

              <hr />

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
              <Grid container sx={{ padding: "1%" }}>
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

export default Index;
