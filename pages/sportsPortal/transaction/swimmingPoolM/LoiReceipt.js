import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import styles from "../swimmingPoolM/scrutiny/LoiGenerationRecipt.module.css";

const LoiGenerationRecipt = (props) => {
  const [data, setdata] = useState();
  const [dataa, setdataa] = useState();
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
  const getLoiGenerationData = (data) => {
    axios.get(`${urls.SPURL}/swimmingBooking/getById?id=${router?.query?.applicationId}`).then((res) => {
      setdata(res.data);
      console.log("loi recept data", res.data);
    });
  };

  useEffect(() => {
    console.log("useeffect");
    getLoiGenerationData();
  }, []);
  const user = useSelector((state) => state?.user.user);
  const [id, setid] = useState();

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
    const element = ReactDOMServer.renderToString(<ComponentToPrint  data={data}  ref={componentRef} />);
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
  const getData = () => {
    axios
      .get(`${urls.SPURL}/swimmingBooking/getById?id=${id}`)
      .then((r) => {
        console.log("54332313456", r?.data);
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log("hawkerLicenseData", r?.data);
          setdataa(r?.data);
          reset(r.data);
          if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
            setValue("disabledFieldInputState", false);
          } else {
            setValue("disabledFieldInputState", true);
          }
          //   setShrinkTemp(true);
        } else {
          //   setShrinkTemp(true);
          //  
        }
      })
      .catch(() => {
        // setShrinkTemp(true);
        //
      });
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (localStorage.getItem("id") != null || localStorage.getItem("id") != "") {
      setid(localStorage.getItem("id"));
    }
    if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
      //   setApplicationRevertedToCititizen(true);
      //   setApplicationRevertedToCititizenNew(false);
      //   setValue("disabledFieldInputState", true);
    } else {
      //   setApplicationRevertedToCititizen(false);
      //   setApplicationRevertedToCititizenNew(true);
      //   setValue("disabledFieldInputState", false);
    }
  }, []);

  useEffect(() => {
    console.log("65456", dataa);
    console.log("router?.query", router?.query);
    reset(router?.query);
  }, []);
  // const router = useRouter()
  // View
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={data} />
      </div>
      <br />

      <div className={styles.btn}>
      <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={printHandler}>Download</Button>
        <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={handlePrint}>
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
                router.push("/dashboard");
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
              <div className={styles.middle} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>
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
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
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
                  प्रिय, {dataa?.firstName}
                  {/* प्रिय, {router?.query?.firstName} */}
                  {""} {this?.props?.data?.middleName}
                  {""}
                  {this?.props?.data?.lastName}
                </h3>
                &ensp; तुमच्याकडे {this?.props?.data?.serviceName} या सेवेसाठी नागरिक सेवा पोर्टलवर तुमची
                रक्कम रुपये: {this?.props?.data?.loi?.amount}
                निश्चित करा आणि केलेल्या सेवेची रक्कम/शुल्क भरा. किंवा जवळील पिंपरी चिंचवड महानगरपलिका विभागीय
                कार्यालयाला भेट द्या .
              </p>

              <div className={styles.date2}>
                <h4>विभाग:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.serviceName}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>LOI NO : </h4> <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.loi?.loiNo}</h4>
              </div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम</th>
                  </tr>
                  <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>{this?.props?.data?.serviceName}</td>
                    {/* <td colSpan={4}>{this?.props?.data?.totalAmount}</td> */}
                    <td colSpan={4}>{this?.props?.data?.amount}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}> इतर</td>
                    <td colSpan={4}>{this?.props?.data?.penaltyCharge}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>एकूण रक्कम : {this?.props?.data?.amount}</b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4>अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.applicationNumber}</h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.firstName} {this?.props?.data?.middleName} {this?.props?.data?.lastName}{" "}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " + moment(this?.props?.data?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
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
                  <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
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
