import { Button } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "./LoiGenerationRecipt.module.css";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";

const LoiGenerationRecipt = (props) => {
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

  const [datetime, setDatetime] = useState([]);

  const getDateTime = () => {
    axios
      .get(`${urls.SPURL}/master/slotDetails/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDatetime(
          r.data.slotDetails.map((row) => ({
            id: row.id,
            fromBookingTime: row.fromTime,
            toBookingTime: row.toTime,
          }))
        );
      });
  };
  const token = useSelector((state) => state.user.user.token);

  const [venueNames, setVenueNames] = useState([]);
  const getVenueNames = () => {
    axios
      .get(`${urls.SPURL}/venueMasterSection/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setVenueNames(
          r.data.venueSection.map((row) => ({
            id: row.id,
            venue: row.venue,
          }))
        );
      });
  };

  useEffect(() => {
    getVenueNames();
    getDateTime();
  }, []);

  useEffect(() => {
    getLoiGenerationData();
  }, [venueNames, datetime, router?.query]);

  const getLoiGenerationData = (data) => {
    console.log(
      "aala",
      venueNames?.length > 0 &&
        datetime?.length > 0 &&
        router?.query?.applicationId
    );
    if (
      venueNames?.length > 0 &&
      datetime?.length > 0 &&
      router?.query?.applicationId
    ) {
      axios
        .get(
          `${urls.SPURL}/swimmingPool/getById?id=${router?.query?.applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const tempData = res?.data;
          const _res = {
            ...tempData,
            venue: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
            // facilityName: facilityNames?.find(
            //   (obj) => obj?.id == tempData?.facilityName
            // )?.facilityName,
            fromBookingTime: datetime?.find(
              (obj) => obj?.id == tempData?.bookingTimeId
            )?.fromBookingTime,
            toBookingTime: datetime?.find(
              (obj) => obj?.id == tempData?.bookingTimeId
            )?.toBookingTime,
          };
          // setDataa(_res);
          setdata(_res);

          // setdata(res.data);
          // setappCharagesDaos(res?.data?.appCharagesDaos);
        });
    }
  };

  const [data, setdata] = useState();

  const user = useSelector((state) => state?.user.user);

  const componentRef = useRef(null);
  const router = useRouter();

  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "Sanction-Letter.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };

    // const element = ReactDOMServer.renderToString(<ComponentToPrint data={data} ref={componentRef} />);
    const element = ReactDOMServer.renderToString(
      <ComponentToPrint data={data} ref={componentRef} />
    );
    // console.log("ggggggg", html2pdf().set(opt).from(element));
    let base64str;
    html2pdf()
      .from(element)
      .toPdf()
      .set(opt)
      .output("datauristring")
      // .then(function (pdfAsString) {
      //   console.log("pdfAsString", pdfAsString);
      //   var file = dataURLtoFile(pdfAsString, "final-bill.pdf");
      //   console.log(file);
      //   let formData = new FormData();
      //   formData.append("file", file);
      //   formData.append("appName", "NRMS");
      //   formData.append("serviceName", "N-BS");
      //   formData.append("fileName", "bill.pdf");
      //   axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
      //     console.log(r.data.filePath);
      //   });
      // });
      .save();
  };
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  // useEffect(() => {
  //   console.log("router?.query", router?.query);
  //   reset(router?.query);
  // }, []);
  // const router = useRouter()
  // View
  return (
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
                // router.push("/dashboard");
                router.push("/sportsPortal/transaction/swimmingPool/scrutiny");
              } else {
                swal("Record is Safe");
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
                <h3>
                  प्रिय, {this?.props?.data?.firstName}
                  {""} {this?.props?.data?.middleName}
                  {""}
                  {this?.props?.data?.lastName}
                </h3>
                &ensp; तुमच्याकडे {this?.props?.data?.serviceName} या सेवेसाठी
                नागरिक सेवा पोर्टलवर तुमची रक्कम रुपये:{" "}
                {this?.props?.data?.loi?.amount}
                निश्चित करा आणि केलेल्या सेवेची रक्कम/शुल्क भरा. किंवा जवळील
                पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालयाला भेट द्या .
              </p>

              <div className={styles.date2}>
                <h4>विभाग:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.serviceName}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>LOI NO : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b> {this?.props?.data?.loi?.loiNo}</b>
                </h4>
              </div>

              {/* <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम (रु)</th>
                  </tr>
                 
                </thead>
                <tbody>
                 
                  <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>
                      {this?.props?.data?.applicableCharages?.map(
                        (charge, index) => {
                          return (
                            <td colSpan={4}>
                              <b>{charge.chargeTypeName}</b>
                            </td>
                          );
                        }
                      )}
                    </td>

                    <>
                      {this?.props?.data?.applicableCharages?.map(
                        (charge, index) => {
                          console.log("serviceChargeId1212", charge);
                          return <td colSpan={4}>{charge.amountPerHead}</td>;
                        }
                      )}
                    </>
                  </tr>

                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>एकूण रक्कम : </b>
                    </td>
                    <td colSpan={4}>
                      <b>
                        {this?.props?.data?.applicableCharages?.map(
                          (charge, index) => {
                            console.log("serviceChargeId1212", charge);
                            return <td colSpan={4}>{charge.totalAmount}</td>;
                          }
                        )}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table> */}

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}> नाव</th>
                    <th colSpan={2}>रक्कम(रु)</th>
                  </tr>
                  <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>{this?.props?.dataa?.firstName}</td>
                    {/* <td colSpan={4}>10 रु</td> */}
                    <td colSpan={4}>
                      {this?.props?.dataa?.applicableCharages?.map((r, i) => (
                        <>{r.amountPerHead} रु</>
                      ))}
                    </td>
                    {/* <td colSpan={4}>{this?.props?.dataa?.applicableCharages?.amountPerHead}</td> */}
                  </tr>
                  {this?.props?.dataa?.swimmingPoolDetailsDao?.map((r, i) => (
                    <tr>
                      <td colSpan={4}>{i + 2})</td>
                      <td colSpan={4}>{r.memberName}</td>
                      <td colSpan={4}>
                        {this?.props?.dataa?.applicableCharages?.map((r, i) => (
                          <>{r.amountPerHead} रु</>
                        ))}
                      </td>
                    </tr>
                  ))}
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
                        <td colSpan={4}>
                          {this?.props?.dataa?.applicableCharages?.map(
                            (r, i) => (
                              <td colSpan={4}>{r.totalAmount} /-(रु)</td>
                            )
                          )}
                        </td>
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4>अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b> {this?.props?.data?.applicationNumber}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {this?.props?.data?.firstName}{" "}
                    {this?.props?.data?.middleName}{" "}
                    {this?.props?.data?.lastName}{" "}
                  </b>
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
                <h4>ठिकाण :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.venue}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>वेळ:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {this?.props?.data?.fromBookingTime} -{" "}
                    {this?.props?.data?.toBookingTime}{" "}
                  </b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>कालावधी:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {moment(
                      this?.props?.data?.date,
                      "YYYY-MM-DD HH:mm:ss A"
                    ).format("DD-MM-YYYY")}{" "}
                    {/* To{" "}
                    {moment(
                      this?.props?.data?.toDate,
                      "YYYY-MM-DD HH:mm:ss A"
                    ).format("DD-MM-YYYY")}{" "} */}
                  </b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचा पत्ता : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.cAddress}
                  {" ,"}
                  {/* {this?.props?.data?.abuildingNameMr}
                  {' ,'}
                  <br></br>
                  {this?.props?.data?.aroadNameMr} {','}
                  {this?.props?.data?.alandmarkMr} {','} */}
                  <br></br>
                  {this?.props?.data?.cCityName} {","}
                  {this?.props?.data?.cState}
                  {","}
                  {this?.props?.data?.cPincode}{" "}
                </h4>
              </div>

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
      </>
    );
  }
}

export default LoiGenerationRecipt;
