import { Button, Grid } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "./LoiGenerationRecipt.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
  const [receiptData, setReceiptData] = useState();
  const [loading, setLoading] = useState(false);

  const [auditoriums, setAuditoriums] = useState([]);

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
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  let _daata;

  useEffect(() => {
    console.log("router?.query", router.query);
    _daata =
      router?.query?.receiptData && JSON.parse(router?.query?.receiptData);
    console.log("router?.query", _daata);
    _daata && setReceiptData(_daata);
  }, [auditoriums]);

  const getLoiGenerationData = (data) => {
    console.log("1234", router?.query?.applicationId);

    if (router?.query?.applicationId) {
      axios
        .get(
          `${
            urls.MR
          }/transaction/applicant/getapplicantById?applicationId=${Number(
            router?.query?.applicationId
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
          console.log("556", item.id, _daata);
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
                // swal("Record is Successfully Exit!", {
                //   icon: "success",
                // });
                router.push(
                  "/PublicAuditorium/transaction/bookedPublicAuditorium"
                );
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
    const converter = require("number-to-words");
    // Convert the rupee part to words
    const rupeesWords =
      this?.props?.data?.rentAmount &&
      converter.toWords(Math.floor(this?.props?.data?.rentAmount));

    // Convert the paisa part to words
    const paisaWords =
      this?.props?.data?.rentAmount &&
      converter.toWords(
        Math.round(
          (this?.props?.data?.rentAmount -
            Math.floor(this?.props?.data?.rentAmount)) *
            100
        ),
        { unit: "paisa" }
      );
    console.log("props", this.props, rupeesWords, paisaWords);
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
                <b>सेवा स्वीकृती शुल्क पत्र</b>
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
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "" }}>
                    {" "}
                    LOI Number / एलओआय क्र : {}
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {this?.props?.data?.LoiNo
                        ? this?.props?.data?.LoiNo
                        : "-"}
                    </b>
                  </h4>
                </div>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}> Date / दिनांक :</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(this?.props?.data?.applicationDate).format(
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
                  <b>{this?.props?.data?.applicationNumber}</b>
                </h4>
              </div>
              <div className={styles.date2}>
                <h4>Application Date / अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " +
                      moment(this?.props?.data?.applicationDate).format(
                        "DD-MM-YYYY"
                      )}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
                </h4>
              </div>

              {/* <div className={styles.date2}>
                <h4>Applicant Name / अर्जदाराचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.applicantName}</b>
                </h4>
              </div> */}

              <p>
                <b>
                  <h3>प्रति, {this?.props?.data?.applicantName}</h3>
                  <div>
                    <h3 style={{ marginLeft: "15px" }}>
                      {this?.props?.data?.applicantFlatHouseNo}
                      {" ,"}
                      {this?.props?.data?.applicantFlatBuildingName}
                      {" ,"}
                      {this?.props?.data?.applicantLandmark} {","}
                      {this?.props?.data?.applicantArea} {","}
                      {/* <br></br> */}
                      {this?.props?.data?.applicantCity} {","}
                      {this?.props?.data?.applicantState}
                      {","}
                      {this?.props?.data?.applicantPinCode}
                      {"."}
                    </h3>
                  </div>
                  <p>
                    <b>
                      <h3 style={{ paddingLeft: "10%" }}>
                        विषय :-{" "}
                        <b>
                          सार्वजनिक प्रेक्षागृह / नाट्यगृह भाडे रक्कम भरणे बाबत
                        </b>
                      </h3>
                      <h3 style={{ paddingLeft: "10%" }}>
                        संदर्भ :- आपला अर्ज क्र{" "}
                        {this?.props?.data?.applicationNumber}, दिनांक -{" "}
                        {" " +
                          moment(this?.props?.data?.applicationDate).format(
                            "DD-MM-YYYY"
                          )}
                        ,
                      </h3>
                    </b>
                  </p>
                  महोदय/महोदया,
                  <br /> आपल्या वरील संदर्भीय अर्जान्वये केलेली अधिकृत सार्वजनिक
                  प्रेक्षागृह / नाट्यगृह बुकिंग ची मागणी पिंपरी चिंचवड महानगर
                  पालिका च्या प्राधिकृत अधिकाऱ्यांनी मान्य केली असून सदर आदेश
                  निर्गमित करण्यापूर्वी महानगरपालिकेला देय असलेली रक्कम अदा
                  करावी लागेल.
                  <br /> तुमच्या <b> {this?.props?.data?.serviceNameMr}</b> या
                  सेवेसाठी नागरिक सेवा पोर्टलवर कृपया तुमची रक्कम निश्चित करा
                  आणि केलेल्या सेवेची रक्कम/शुल्क भरा, किंवा जवळील पिंपरी चिंचवड
                  महानगरपलिका विभागीय कार्यालयाला भेट द्या .<br></br>
                </b>
              </p>

              <div className={styles.date2}>
                <h4>Auditorium Name / प्रेक्षागृह / नाट्यगृह नाव:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {
                      this?.props?.auditoriums?.find((obj) => {
                        return obj?.id == this?.props?.data?.auditoriumId;
                      })?.auditoriumNameMr
                    }
                  </b>
                </h4>
              </div>

              {/* <div className={styles.date2}>
                <h4>LOI NO : </h4> <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.loi?.loiNo}</h4>
              </div> */}

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
                  {/* <tr>
                    <td style={{ padding: "5px" }}>1)</td>
                    <td style={{ padding: "5px" }}>
                      Deposit Amount / ठेव रक्कम
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "5px",
                      }}
                    >
                      <b>{this?.props?.data?.depositAmount}</b>
                    </td>
                  </tr> */}
                  <tr>
                    <td style={{ padding: "5px" }}>1)</td>
                    <td style={{ padding: "5px" }}>Rent Amount / भाडे रक्कम</td>
                    <td style={{ textAlign: "right", padding: "5px" }}>
                      <b>
                        {(this?.props?.data?.rentAmount / 1.18)?.toFixed(2)}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>2)</td>
                    <td style={{ padding: "5px" }}>CGST / सीजीएसटी (9%)</td>
                    <td style={{ textAlign: "right", padding: "5px" }}>
                      <b>
                        {(
                          (this?.props?.data?.rentAmount -
                            this?.props?.data?.rentAmount / 1.18) /
                          2
                        )?.toFixed(2)}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>3)</td>
                    <td style={{ padding: "5px" }}>SGST / एसजीएसटी (9%)</td>
                    <td style={{ textAlign: "right", padding: "5px" }}>
                      <b>
                        {(
                          (this?.props?.data?.rentAmount -
                            this?.props?.data?.rentAmount / 1.18) /
                          2
                        )?.toFixed(2)}
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
                      <b>
                        एकूण रक्कम रुपये :{" "}
                        {this?.props?.data?.rentAmount?.toFixed(2)}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ padding: "5px", textAlign: "right" }}
                      colSpan={3}
                    >
                      <b>
                        Total Amount (In words) / एकूण रक्कम (अक्षरी) :{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {`${rupeesWords} rupees and ${paisaWords} paise`}
                          {/* {this?.props?.data &&
                            this?.props?.number2words(
                              this?.props?.data?.rentAmount
                            )} */}
                        </span>{" "}
                        Only
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4>Event Title / कार्यक्रमाचे शीर्षक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.eventTitle}</b>
                </h4>
              </div>
              {this?.props?.data?.timeSlotList &&
                JSON?.parse(this?.props?.data?.timeSlotList)?.map((val) => {
                  return (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div className={styles.date2}>
                        <h4>Event Date / कार्यक्रमाची तारीख:</h4>{" "}
                        <h4 style={{ marginLeft: "10px" }}>
                          <b>{moment(val?.bookingDate).format("DD-MM-YYYY")}</b>
                        </h4>
                        <h4 style={{ marginLeft: "10px" }}>
                          <b></b>
                        </h4>
                      </div>
                      <div className={styles.date2}>
                        <h4>Event Time / कार्यक्रमाची वेळ:</h4>{" "}
                        <h4 style={{ marginLeft: "10px" }}>
                          <b>
                            {val?.fromTime} To {val?.toTime}
                          </b>
                        </h4>
                        <h4 style={{ marginLeft: "10px" }}>
                          <b></b>
                        </h4>
                      </div>
                      <div className={styles.date2}>
                        <h4>Event Day / कार्यक्रमाचा दिवस:</h4>{" "}
                        <h4 style={{ marginLeft: "10px" }}>
                          <b>{moment(val?.bookingDate).format("dddd")}</b>
                        </h4>
                      </div>
                    </div>
                  );
                })}
              <div className={styles.date2}>
                <h4>Event Details / कार्यक्रमाचा तपशील : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.eventDetails}</b>
                </h4>
              </div>

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

export default LoiGenerationRecipt;
