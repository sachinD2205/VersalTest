import { Button, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import router from "next/router";
import styles from "./goshwara.module.css";
import moment from "moment";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const language = useSelector((state) => state?.labels.language);
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
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
  let user = useSelector((state) => state.user.user);
  // useEffect(() => {
  //   axios
  //     .get(
  //       `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router?.query?.id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       },
  //     )
  //     .then((res) => {
  //       setDataa(res.data);
  //       console.log("board data", res.data);
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //     });
  // }, []);

  // view
  return (
    <>
      <div>
        <ComponentToPrint dataa={dataa} ref={componentRef} />
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
                // swal("Record is Successfully Exit!", {
                //   icon: "success",
                // });
                localStorage.loggedInUser == "departmentUser"
                  ? router.push(
                      "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
                    )
                  : router.push("/dashboard");
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

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <Paper
          elevation={0}
          sx={{
            paddingRight: "10px",
            // marginTop: "50px",
            paddingLeft: "10px",
            // paddingBottom: "50px",
            // height: "1000px",
          }}
        >
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
                  <h1 style={{ fontSize: "x-large" }}>
                    <b>पिंपरी चिंचवड महानगरपालिका,पिंपरी ४११०१८</b>
                  </h1>

                  <h3 style={{ textAlign: "center" }}>
                    <b>नागरी सुविधा केंद्र (संगणक प्रणाली )</b>
                  </h3>
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
                  <b>अर्जाची पावती / पोहोच पावती </b>
                </h2>
              </div>

              <div className={styles.two}>
                <div className={styles.date4} style={{ marginTop: "" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "41px" }}>
                      <b>पावती क्रमांक :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.payment?.receiptNo}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "5vh" }}>
                    <h4 style={{ marginLeft: "" }}>
                      <b>पावती दिनांक :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.dataa?.payment?.createDtTm,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>{" "}
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.dataa?.payment?.receiptTime,
                            "HH:mm:ss",
                          ).format("hh:mm A")}
                      </b>{" "}
                    </h4>
                  </div>
                  <div></div>
                </div>
                <div
                  className={styles.date4}
                  style={
                    {
                      // marginTop: "2vh"
                    }
                  }
                >
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>अर्जाचा क्रमांक :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.applicationNumber}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "1vh" }}>
                    <h4 style={{ marginLeft: "" }}>
                      <b>अर्ज दिनांक : </b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.dataa?.applicationDate,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>{" "}
                      {/* {this?.props?.dataa?.applicationDate} */}
                    </h4>
                  </div>

                  <div className={styles.date3} style={{ marginRight: "2vh" }}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>कार्यालय :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.applicationNumber}
                    </h4>
                  </div>
                </div>
                <div className={styles.date4} style={{}}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "40px" }}>
                      {"  "}
                      <b> विषय:</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.serviceNameMr}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "5vh" }}>
                    <h4 style={{ marginLeft: "" }}>
                      {" "}
                      <b>विभाग :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.serviceNameMr}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "2vh" }}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>पत्ता :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.applicationNumber}
                    </h4>
                  </div>
                </div>

                <div className={styles.date4} style={{}}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "40px" }}>
                      {"  "}
                      <b> अर्जदाराचे नाव :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      <b>
                        {" " +
                          this?.props?.dataa?.afNameMr +
                          " " +
                          this?.props?.dataa?.amNameMr +
                          " " +
                          this?.props?.dataa?.alNameMr}
                      </b>
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "2vh" }}>
                    <h4 style={{ marginLeft: "40px" }}>
                      {" "}
                      <b>मोबाईल नं :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.dataa?.loi?.createDtTm,
                          "YYYY-MM-DD HH:mm:ss A",
                        ).format("DD-MM-YYYY hh:mm A")}
                    </h4>
                  </div>
                </div>

                <hr />
                <p>
                  <h5 style={{ marginLeft: "40px", marginRight: "40px" }}>
                    <b>
                      महोदय, <br />
                      आपण दिलेल्या अर्जाची नोंद आम्ही घेतली आहे.आपला अर्ज
                      क्रमांक : {this?.props?.dataa?.applicationNumber} आहे.आपण
                      दिलेले काम अंदाजे <br />
                      दि._______ पर्यत पूर्ण होणे अपेक्षित आहे. आपल्या अर्जावर
                      तपासणी करून आपणांस त्याबाबत लवकरच SMS द्वारे कळविण्यात
                      येईल. <br />
                      आपले प्रमाणपत्र / कागदपत्र मिळविण्याचे ठिकाण
                      {this?.props?.dataa?.zone?.zoneNameMr}
                      {","} {this?.props?.dataa?.zone?.zoneaddressMr} राहील.{" "}
                      <br />
                      २०(विस फक्त)
                    </b>
                  </h5>
                </p>

                <p>
                  <h5 style={{ marginLeft: "40px", marginRight: "40px" }}>
                    <b>
                      अर्जासोबत खालील कागदपत्रे स्वीकारण्यात आली.
                      <br />
                      १)फॉर्ममध्ये कॉलम ७ मध्ये पुरोहित / भटजी यांची माहिती व
                      स्वाक्षरी दिनांका सहित असावी..
                    </b>
                  </h5>
                </p>

                {/* <tr style={{ marginLeft: "25px" }}>
                  <td>
                    <h5 style={{ padding: "10px", marginLeft: "20px" }}>
                      अर्जासोबत खालील कागदपत्रे स्वीकारण्यात आली.
                      <br />
                      १)फॉर्ममध्ये कॉलम ७ मध्ये पुरोहित / भटजी यांची माहिती व
                      स्वाक्षरी दिनांका सहित असावी..
                    </h5>
                  </td>
                </tr> */}

                {/* <tr>
                  <td>
                    <h5 style={{ marginLeft: "20px" }}>
                      <b>कागदपत्रांची यादी :</b>
                    </h5>
                  </td>
                </tr> */}

                <hr />

                <div className={styles.foot}>
                  <div className={styles.add}>
                    <h5>पिंपरी चिंचवड महानगरपालिका </h5>
                    <h5>
                      {" "}
                      {this?.props?.dataa?.zone?.zoneNameMr}
                      {","} {this?.props?.dataa?.zone?.zoneaddressMr}
                    </h5>
                    {/* <h5> महाराष्ट्र, भारत</h5> */}
                  </div>
                  <div className={styles.add1}>
                    <h5>कृपया संबंधित क्षेत्रीय कार्यालयाशी संपर्क साधावा</h5>
                  </div>
                  <div
                    className={styles.logo1}
                    style={{ paddingRight: "5vh", paddingLeft: "5vh" }}
                  >
                    <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                  </div>
                  <div className={styles.logoBar}>
                    <img
                      src="/barcode.png"
                      alt=""
                      height="50vh"
                      width="100vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </>
    );
  }
}

export default Index;

// import { Button, Paper } from "@mui/material";

// import React, { useRef } from "react";
// import { useReactToPrint } from "react-to-print";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";

// import styles from "./goshwara.module.css";

// const Index = () => {
//   const componentRef = useRef();
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const backToHomeButton = () => {
//     history.push({ pathname: "/homepage" });
//   };

//   // view
//   return (
//     <div>
//       <BasicLayout titleProp={"none"}>
//         <Paper>
//           <div>
//             <center>
//               <h1>अर्जाची पावती / पोहोच पावती / Acknowledgement slip</h1>
//             </center>
//           </div>
//           <div style={{ padding: 10 }}>
//             <Button
//               type="primary"
//               style={{ float: "right" }}
//               onClick={handlePrint}
//             >
//               print
//             </Button>
//             <Button onClick={backToHomeButton} type="primary">
//               back To home
//             </Button>
//           </div>
//         </Paper>
//         <ComponentToPrint ref={componentRef} />
//       </BasicLayout>
//     </div>
//   );
// };

// class ComponentToPrint extends React.Component {
//   render() {
//     return (
//       <div>
//         <Paper>
//           <table
//             className={styles.report}
//             style={{ marginLeft: "50px", marginTop: "50px" }}
//           >
//             {/* <tr>
//               <th colspan="3">
//                 <h2>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</h2>
//               </th>
//             </tr> */}

//             <div className={styles.main1}></div>

//             <tr>
//               <th colSpan={"3"}>
//                 <h2>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</h2>
//                 <h3>नागरी सुविधा केंद्र (संगणक प्रणाली )</h3>
//                 <h4>अर्जाची पावती / पोहोच पावती </h4>
//               </th>
//             </tr>

//             {/* <tr className={styles.trThree}>
//               <th colspan="3">
//                 <h4>अर्जाची पावती / पोहोच पावती 1</h4>
//               </th>
//             </tr> */}
//             <tr>
//               <th colSpan={"3"}>
//                 <div className={styles.main}>
//                   <img
//                     src="/logo.png"
//                     alt="Maharashtra Logo"
//                     height={100}
//                     width={100}
//                   />

//                   <img
//                     src="/barcode.jpg"
//                     alt="Maharashtra Logo"
//                     height={100}
//                     width={100}
//                   />
//                 </div>
//               </th>
//             </tr>

//             {/* <tr>
//               <th colspan="3">
//                 <h2>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</h2>
//               </th>
//             </tr>

//             <tr>
//               <th colspan="3">
//                 <h3>नागरी सुविधा केंद्र (संगणक प्रणाली )</h3>
//               </th>
//             </tr>

//             <tr className={styles.trThree}>
//               <th colspan="3">
//                 <h4>अर्जाची पावती / पोहोच पावती / Acknowledgement slip</h4>
//               </th>
//             </tr> */}
//           </table>
//           <table className={styles.report} style={{ marginLeft: "50px" }}>
//             <tr className={styles.trFour} style={{ marginLeft: "25px" }}>
//               <td colSpan={"2"}>
//                 <b>Receipt No:</b>
//               </td>
//               <div className={styles.date}>
//                 <td>
//                   <b>दिनांक :</b>
//                 </td>
//               </div>
//             </tr>

//             <tr className={styles.trFive} style={{ marginLeft: "25px" }}>
//               <div>
//                 <td>
//                   <b>अर्ज क्र :</b>
//                 </td>
//               </div>
//               <div className={styles.vel}>
//                 <td>
//                   <b>वेळ :</b>
//                 </td>
//               </div>
//               <div className={styles.vel}>
//                 <td>
//                   <b>कार्यालय :</b>
//                 </td>
//               </div>
//             </tr>

//             <tr className={styles.trSix} style={{ marginLeft: "25px" }}>
//               <td>
//                 <b>विषय :</b>
//               </td>
//               <div className={styles.vibhag}>
//                 <td>
//                   <b>विभाग :</b>
//                 </td>
//               </div>
//               <div className={styles.patta}>
//                 <td>
//                   <b>पत्ता :</b>
//                 </td>
//               </div>
//             </tr>

//             <tr className={styles.trSeven} style={{ marginLeft: "25px" }}>
//               <td>
//                 <b>अर्जादाराचे नाव :</b>
//               </td>
//               <div className={styles.mobile}>
//                 <td>
//                   <b>Mobile No :</b>
//                 </td>
//               </div>
//               <div className={styles.pattaa}>
//                 <td>
//                   <b>पत्ता :</b>
//                 </td>
//               </div>
//             </tr>

//             <br />
//           </table>

//           <table className={styles.report} style={{ marginLeft: "50px" }}>
//             <tr>
//               <h5 style={{ padding: "15px", marginLeft: "50px" }}>
//                 महोदय,
//                 <br />
//                 आपण दिलेल्या अर्जाची नोंद आम्ही घेतली आहे.आपला अर्ज क्रमांक
//                 ______ _____ _____ ___ आहे.आपण दिलेले काम अंदाजे <br />
//                 दि._______ पर्यत पूर्ण होणे अपेक्षित आहे. आपल्या अर्जावर तपासणी
//                 करून आपणांस त्याबाबत लवकरच SMS द्वारे कळविण्यात येईल.
//                 <br />
//                 आपले प्रमाणपत्र / कागदपत्र मिळविण्याचे ठिकाण ________/_______
//                 राहील.
//                 <br />
//                 २०(विस फक्त)
//               </h5>
//             </tr>
//           </table>

//           <table className={styles.report} style={{ marginLeft: "50px" }}>
//             <tr style={{ marginLeft: "25px" }}>
//               <td>
//                 <h5 style={{ padding: "10px", marginLeft: "20px" }}>
//                   अर्जासोबत खालील कागदपत्रे स्वीकारण्यात आली.
//                   <br />
//                   १)फॉर्ममध्ये कॉलम ७ मध्ये पुरोहित / भटजी यांची माहिती व
//                   स्वाक्षरी दिनांका सहित असावी..
//                 </h5>
//               </td>
//             </tr>

//             <tr>
//               <td>
//                 <h5 style={{ marginLeft: "20px" }}>
//                   <b>कागदपत्रांची यादी :</b>
//                 </h5>
//               </td>
//             </tr>
//             <tr>
//               <b>1)</b>
//             </tr>

//             <tr>
//               <b>2)</b>
//             </tr>

//             {/* <tr>
//               <b>3)</b>
//             </tr>

//             <tr>
//               <b>4)</b>
//             </tr>

//             <tr>
//               <b>5)</b>
//             </tr>

//             <tr>
//               <b>6)</b>
//             </tr> */}
//           </table>
//         </Paper>
//       </div>
//     );
//   }
// }

// export default Index;
