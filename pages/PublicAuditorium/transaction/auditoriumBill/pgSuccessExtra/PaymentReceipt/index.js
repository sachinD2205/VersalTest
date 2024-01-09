import { Button, Grid } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../../URLS/urls";
import styles from "./LoiGenerationRecipt.module.css";
import { catchExceptionHandlingMethod } from "../../../../../../util/util";

const PaymentReceipt = () => {
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
  const [receiptData, setReceiptData] = useState();
  const [loading, setLoading] = useState(false);
  const [auditoriums, setAuditoriums] = useState([]);
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
    console.log("useeffect");
    getLoiGenerationData();
    getAuditoriumBooking();
    getAuditorium();
  }, []);

  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const componentRef = useRef(null);
  const router = useRouter();
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  let _daata;

  useEffect(() => {
    console.log("receivedData", router.query);
    _daata = router?.query?.showData && JSON.parse(router?.query?.showData);
    console.log("router?.query", _daata);
    _daata && setReceiptData(_daata);
  }, [auditoriums]);

  const getLoiGenerationData = (data) => {
    console.log(
      "1234",
      router?.query?.showData &&
        JSON.parse(router?.query?.showData)?.merchant_param5
    );

    if (
      router?.query?.showData &&
      JSON.parse(router?.query?.showData)?.merchant_param5
    ) {
      let appId =
        router?.query?.showData &&
        JSON.parse(router?.query?.showData)?.merchant_param5;
      axios
        .get(
          `${
            urls.PABBMURL
          }/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${Number(
            appId
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setdata(res.data);
          console.log("loi recept data", res.data);
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
  };

  const getAuditoriumBooking = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: "dsc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res res", res);
        setLoading(false);
        let result = res.data.trnAuditoriumBookingOnlineProcessList;

        result?.map((item) => {
          if (item?.id == _daata?.id) {
            return item;
          }
        });

        // setReceiptData(
        //   result.map((item) => {
        //     if (item.id == _daata.id) {
        //       return item;
        //     }
        //   }),
        // );

        // let _res = result.map((val, i) => {
        //   return {
        //     ...val,
        //     srNo: _pageSize * _pageNo + i + 1,
        //     id: val.id,
        //     auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
        //     toDate: val.toDate ? val.toDate : "-",
        //     fromDate: val.fromDate ? val.fromDate : "-",
        //     holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
        //     status: val?.applicationStatus?.replace(/[_]/g, " "),
        //     _status: val.status,
        //     activeFlag: val.activeFlag,
        //     auditoriumBookingNo: val.applicationNumber,
        //     // auditoriumId: val.auditoriumId
        //     //   ? auditoriums.find((obj) => obj?.id == val.auditoriumId)?.auditoriumNameEn
        //     //   : "Not Available",
        //     auditoriumId: val.auditoriumId,
        //     _auditoriumId: val.auditoriumId,
        //     eventDate: val.eventDate ? moment(val?.eventDate).format("DD-MM-YYYY") : "-",
        //     mobile: val.mobile ? val.mobile : "-",
        //     organizationName: val.organizationName ? val.organizationName : "-",
        //     organizationOwnerFirstName: val.organizationOwnerFirstName
        //       ? val.organizationOwnerFirstName + " " + val.organizationOwnerLastName
        //       : "-",
        //   };
        // });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe 4Au", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            ...row,
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  var num =
    "Zero One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen".split(
      " "
    );
  var tens = "Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety".split(" ");

  function number2words(n = 0) {
    if (n < 20) return num[n];
    var digit = n % 10;
    if (n < 100) return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
    if (n < 1000)
      return (
        num[~~(n / 100)] +
        " Hundred" +
        (n % 100 == 0 ? "" : " " + number2words(n % 100))
      );
    return (
      number2words(~~(n / 1000)) +
      " Thousand" +
      (n % 1000 != 0 ? " " + number2words(n % 1000) : "")
    );
  }

  return (
    <>
      <div>
        <ComponentToPrint
          ref={componentRef}
          data={receiptData}
          receivedData={data}
          auditoriums={auditoriums}
          number2words={number2words}
        />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          size="small"
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
              title: language == "en" ? "Exit?" : "बाहेर पडायचे?",
              text:
                language == "en"
                  ? "Are you sure you want to exit this Record ? "
                  : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                console.log("33", router?.query?.showData);

                router.push({
                  pathname:
                    "/PublicAuditorium/transaction/auditoriumBill/AuditoriumBillReceipt",
                  query: {
                    showData: data && JSON.stringify(data),
                    user: "Citizen",
                  },
                });
              } else {
                // swal("Record is Safe");
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
    console.log("props", this.props);
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
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
                <img src="/logo.png" alt="" height="50vh" width="50vw" />
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
                  height="50vh"
                  width="50vw"
                />
              </Grid>
            </Grid>
            {/* <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
              </div>
              <div className={styles.logo1}>
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </div>
            </div> */}
            <div>
              <h2 className={styles.heading}>
                <b>पावती</b>
              </h2>
            </div>

            <div
              className={styles.two}
              style={{
                marginLeft: "2vh",
                marginRight: "2vh",
              }}
            >
              <div className={styles.date3}>
                <div className={styles.date2}></div>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}> Date / दिनांक :</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(this?.props?.data?.eventDate).format(
                          "DD-MM-YYYY"
                        )}
                    </b>{" "}
                    {/* <b>{router?.query?.appointmentDate}</b> */}
                  </h4>
                </div>
              </div>
              <div className={styles.date2}>
                <h4>Application Number / अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.receivedData?.applicationNumber}</b>
                </h4>
              </div>
              <div className={styles.date2}>
                <h4>Application Date / अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " +
                      moment(this?.props?.data?.eventDate).format("DD-MM-YYYY")}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>Applicant Name / अर्जदाराचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.receivedData?.applicantName}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>Applicant Address / अर्जदाराचा पत्ता : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    <h3>
                      {this?.props?.receivedData?.applicantFlatHouseNo}
                      {" ,"}
                      {this?.props?.receivedData?.applicantFlatBuildingName}
                      {" ,"}
                      {this?.props?.receivedData?.applicantLandmark} {","}
                      {this?.props?.receivedData?.applicantArea} {","}
                      {/* <br></br> */}
                      {this?.props?.receivedData?.applicantCity} {","}
                      {this?.props?.receivedData?.applicantState}
                      {","}
                      {this?.props?.receivedData?.applicantPinCode}
                      {"."}
                    </h3>
                  </b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>प्रेक्षागृह / नाट्यगृह नाव:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {
                      this?.props?.auditoriums?.find((obj) => {
                        return (
                          obj?.id == this?.props?.receivedData?.auditoriumId
                        );
                      })?.auditoriumNameMr
                    }
                  </b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>पुढील प्रमाणे फी मिळाली : </h4>{" "}
              </div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th style={{ width: "10%", backgroundColor: "#DEE3DE" }}>
                      Sr No. / अ.क्र
                    </th>
                    <th style={{ width: "30%", backgroundColor: "#DEE3DE" }}>
                      Charge name / शुल्काचे नाव
                    </th>
                    <th style={{ width: "60%", backgroundColor: "#DEE3DE" }}>
                      Amount / रक्कम (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px" }}>1)</td>
                    <td style={{ padding: "5px" }}>
                      Extra Equipment Charges / अतिरिक्त उपकरणे शुल्क
                    </td>
                    <td style={{ textAlign: "right", padding: "5px" }}>
                      <b>
                        {(
                          this?.props?.data?.mer_amount -
                          this?.props?.data?.mer_amount * 0.18
                        ).toFixed(2)}
                      </b>
                    </td>
                  </tr>
                  <tr className={styles.__tr}>
                    <td className={styles.__td}>2)</td>
                    <td className={styles.__td}>CGST / सीजीएसटी (9%)</td>
                    <td
                      className={styles.__tdAmt}
                      style={{ textAlign: "right", padding: "5px" }}
                    >
                      <b>
                        {(
                          (this?.props?.data?.mer_amount -
                            this?.props?.data?.mer_amount * 0.18) *
                          0.09
                        ).toFixed(2)}
                      </b>
                    </td>
                  </tr>
                  <tr className={styles.__tr}>
                    <td className={styles.__td}>3)</td>
                    <td className={styles.__td}>SGST / एसजीएसटी (9%)</td>
                    <td
                      className={styles.__tdAmt}
                      style={{ textAlign: "right", padding: "5px" }}
                    >
                      <b>
                        {(
                          (this?.props?.data?.mer_amount -
                            this?.props?.data?.mer_amount * 0.18) *
                          0.09
                        ).toFixed(2)}
                      </b>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b></b>
                    </td>
                    <td>
                      <b></b>
                    </td>
                    <td style={{ padding: "5px", textAlign: "right" }}>
                      <b>एकूण रक्कम रुपये : {this?.props?.data?.mer_amount}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b></b>
                    </td>
                    <td>
                      <b></b>
                    </td>
                    <td style={{ padding: "5px", textAlign: "right" }}>
                      <b>
                        Total Amount (In words) / एकूण रक्कम (अक्षरी) :{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {this?.props?.data &&
                            this?.props?.number2words(
                              this?.props?.data?.mer_amount
                            )}
                        </span>
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <hr />

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
                  <img src="/qrcode1.png" alt="" height="50vh" width="50vw" />
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

              {/* <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </div>
                <div className={styles.add1}>
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
                </div>
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                </div>
                <div className={styles.logo1}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default PaymentReceipt;
