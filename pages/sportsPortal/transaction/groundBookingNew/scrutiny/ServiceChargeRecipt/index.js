import { Button } from "@mui/material";
import axios from "axios";
import html2pdf from "html2pdf-jspdf2";
import moment from "moment";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../../../URLS/urls";
import { useGetToken } from "../../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../../util/util";
import styles from "./goshwara.module.css";

const Index = (props) => {
  let language = useSelector((state) => state?.labels?.language);
  const userDao = useSelector((state) => state?.user?.user?.userDao);
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
  const [dataa, setDataa] = useState(null);
  const userToken = useGetToken();
  const [venueNames, setVenueNames] = useState([]);
  const componentRef = useRef();
  const [sum, setSum] = useState(0);
  const [applicableCharagesTemp, setApplicableCharagesTemp] = useState([]);
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


  // printHandler
  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "Receipt.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };
    const element = ReactDOMServer.renderToString(
      <ComponentToPrint dataa={dataa} sum={sum} ref={componentRef} />
    );
    html2pdf()
      .from(element)
      .toPdf()
      .set(opt)
      .output("datauristring")
      .save();
  };
  // handlePrint
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // getVenueNames
  const getVenueNames = () => {
    axios.get(`${urls.SPURL}/venueMasterSection/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setVenueNames(
        r.data.venueSection.map((row) => ({
          id: row.id,
          venue: row.venue,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // groundBookingGetById
  const groundBookingGetById = () => {
    axios
      .get(
        `${urls.SPURL}/groundBooking/getById?id=${router?.query?.applicationId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      )
      .then((res) => {
        const tempData = res?.data;
        // setApplicableCharagesTemp(res?.data?.applicableCharages);
        calculateCharges(res?.data?.applicableCharages);
        const _res = {
          ...tempData,
          selectedBookingSlots: JSON.parse(tempData?.selectedBookingSlots),
          venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)
            ?.venue,
          fromBookingTime: moment(tempData.fromBookingTime).format("hh:mm A"),
          toBookingTime: moment(tempData.toBookingTime).format("hh:mm A"),
        };

        // setDataa(_res);
        console.log("serviceCharge", res.data);
      }).catch((error) => {
        callCatchMethod(error, language);
      });;
  }


  // calculateCharges
  const calculateCharges = (chargesForApi) => {
    let deposite = 0;
    let rate = 0;
    let cgst = 0;
    let sgst = 0;
    let total = 0;
    let applicableCharagesBhava = null;
    let finalTotalWithCGSTSGST = 0;

    //! kllll
    if (chargesForApi) {
      chargesForApi.forEach((charge) => {
        deposite += charge?.chargeType == 2 ? charge?.amountPerHead : 0;
        rate += charge?.chargeType == 1 ? charge?.totalAmount : 0;
      });
      // total 
      total = deposite + rate;
      // cgst 
      cgst = (total * 9) / 100
      sgst = (total * 9) / 100
      finalTotalWithCGSTSGST = total + cgst + sgst;
      // sum 
      setSum(finalTotalWithCGSTSGST);

      //! ===============> updated content 
      applicableCharagesBhava = chargesForApi[0];

      let data1 = {
        ...applicableCharagesBhava,
        totalAmount: cgst,
        chargeTypeName: "CGST 9%",
        chargeTypeNameMr: "CGST 9%",
        amountPerHead: null,
        chargeType: null,
        hours: null,
        chargableDays: null,
      }

      let data2 = {
        ...applicableCharagesBhava,
        chargeTypeName: "SGST 9%",
        chargeTypeNameMr: "SGST 9%",
        totalAmount: sgst,
        amountPerHead: null,
        chargeType: null,
        hours: null,
        chargableDays: null,
      }

      console.log("dsf3253256456", data1, data2)
      const finalData = {
        ...dataa,
        applicableCharages: [...chargesForApi, data1, data2]
      }
      setDataa(finalData);
    }
  }

  //! ===================> useEffect



  // useEffect(() => {
  //   calculateCharges();
  // }, [applicableCharagesTemp]);


  useEffect(() => {
    getVenueNames();
    reset(props?.data);
  }, []);

  useEffect(() => {
    if (router?.query?.applicationId != null && router?.query?.applicationId != undefined && router?.query?.applicationId != "") {
      groundBookingGetById();
    }
  }, [venueNames]);


  //! =======================>  return 
  return (
    <>
      <div>
        <ComponentToPrint dataa={dataa} sum={sum} ref={componentRef} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={printHandler}
        >
          Download
        </Button>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            if (userDao?.cfcUser) {
              router.push("/CFC_Dashboard");
            } else if (userDao?.deptUser) {
              router.push("/sportsPortal/transaction/groundBookingNew/scrutiny");
            } else {
              router.push("/dashboard");
            }
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {

    console.log("dsfdsfs323232", this?.props?.dataa);


    return (
      <div>
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
                <b>पावती</b>
              </h2>
            </div>

            <div className={styles.two}>
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

              <div className={styles.date4}>
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
                  </h4>
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>अर्जदाराचे नाव : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" " + this?.props?.dataa?.applicantName}
                  </h4>
                </div>
                <br></br>
              </div>
              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>अर्जदाराचा मोबाईल क्र : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" " + this?.props?.dataa?.mobileNo}
                  </h4>
                </div>
                <br></br>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: "40px" }}>
                  {" "}
                  <b>ठिकाणाचे नाव : </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {" " + this?.props?.dataa?.venueNames}
                </h4>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: "40px" }}>
                  {" "}
                  <b>निवडलेली तारीख : </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {moment(
                    this?.props?.dataa?.fromDate,
                    "YYYY-MM-DD HH:mm:ss A"
                  ).format("DD-MM-YYYY")}{" "}
                  To{" "}
                  {moment(
                    this?.props?.dataa?.toDate,
                    "YYYY-MM-DD HH:mm:ss A"
                  ).format("DD-MM-YYYY")}
                </h4>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: "40px" }}>
                  {" "}
                  <b>निवडलेली स्लॉट : </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {
                    this?.props?.dataa?.selectedBookingSlots}
                </h4>
              </div>
              {/* <div className={styles.date2}>
                <h4 style={{ marginLeft: "40px" }}>
                  {" "}
                  <b>Time : </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {" " + this?.props?.dataa?.fromBookingTime} To
                  {" " + this?.props?.dataa?.toBookingTime}
                </h4>
              </div> */}

              <p>
                <h5 style={{ marginLeft: "40px", marginRight: "40px" }}>
                  <b>
                    पुढील प्रमाणे फी मिळाली :-
                    <br />
                    <table id="table-to-xls" className={styles.report_table}>
                      <thead>
                        <tr>
                          <th colSpan={2}>अ.क्र</th>
                          <th colSpan={8}>शुल्काचे नाव</th>
                          <th colSpan={2}>रक्कम (रु)</th>
                          <th colSpan={2}>तास</th>
                          <th colSpan={2}>दिवस</th>
                          <th colSpan={2}>एकूण (रु)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this?.props?.dataa?.applicableCharages?.map((r, i) => (
                          <>
                            <tr>
                              <td colSpan={4}>{i + 1}</td>
                              <td colSpan={4}>{r?.chargeTypeName}</td>
                              <td colSpan={4}>{r?.amountPerHead != null && r?.amountPerHead != undefined && r?.amountPerHead != "" ? r?.amountPerHead : "-"}</td>
                              <td colSpan={2}>
                                {(r?.chargeType == 2 ? "-" : r?.hours) != undefined &&
                                  (r?.chargeType == 2 ? "-" : r?.hours) != null &&
                                  (r?.chargeType == 2 ? "-" : r?.hours) != "" ?
                                  (r?.chargeType == 2 ? "-" : r?.hours) : "-"}
                              </td>
                              <td colSpan={2}>
                                {
                                  (r?.chargeType == 2 ? "-" : r?.chargableDays) != null
                                    &&
                                    (r?.chargeType == 2 ? "-" : r?.chargableDays) != undefined
                                    &&
                                    (r.chargeType == 2 ? "-" : r?.chargableDays) != ""
                                    ?
                                    (r.chargeType == 2 ? "-" : r?.chargableDays) : "-"}
                              </td>
                              <td colSpan={4}>
                                {(r.chargeType == 2 ? r?.amountPerHead : r?.totalAmount)
                                  != null &&
                                  (r.chargeType == 2 ? r?.amountPerHead : r?.totalAmount)
                                  != undefined &&
                                  (r.chargeType == 2 ? r?.amountPerHead : r?.totalAmount)
                                  != null ?
                                  (r.chargeType == 2 ? r?.amountPerHead : r?.totalAmount)
                                  : "-"
                                }
                              </td>
                            </tr>
                          </>
                        ))}

                        <tr>
                          <td colSpan={4}>
                            <b></b>
                          </td>
                          <td colSpan={4}>
                            <b>एकूण रक्कम : </b>
                          </td>
                          <td colSpan={4}>
                            <b></b>
                          </td>
                          <td colSpan={2}>
                            <b></b>
                          </td>
                          <td colSpan={2}>
                            <b></b>
                          </td>
                          <td colSpan={4}>
                            <b>{this?.props?.sum}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    मैदान आरक्षित झालेल्याचा दिनांक:{" "}
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.applicationDate,
                          "YYYY-MM-DD"
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.marriageDate} */}व मैदान आरक्षित
                    आकारण्यात येणारे शुल्क
                  </b>
                  <b> एकूण फी</b> &nbsp;
                  {/* <b>{this?.props?.dataa?.loi?.amount}</b> */}
                  <b>{this?.props?.sum} /- (रु) .</b>
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
      </div>
    );
  }
}

export default Index;
