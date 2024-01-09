import { Button } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import router from "next/router";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import styles from "../swimmingPoolM/scrutiny/SanctionLetter/payment9.module.css";

const Index = (props) => {
  const router = useRouter();
  const componentRef = useRef(null);
  const [facilityNames, setFacilityNames] = useState([]);
  const getFacilityName = () => {
    axios.get(`${urls.SPURL}/facilityName/getAll`).then((r) => {
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        })),
      );
    });
  };

  const [zoneKeys, setZoneKeys] = useState([]);

  const getZoneKeys = async () => {
    await axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };

  useEffect(() => {
    console.log("hgvghfv", router.query.applicationId);
  }, []);

  useEffect(() => {
    // getFacilityTypes();
    getFacilityName();
    getZoneKeys();
  }, []);
  const [dataa, setDataa] = useState(null);

  useEffect(() => {
    axios.get(`${urls.SPURL}/swimmingBooking/getById?id=${router?.query?.id}`).then((res) => {
      const tempData = res?.data;

      const _res = {
        ...tempData,
        zone: zoneKeys?.find((obj) => obj?.id == tempData?.zone)?.zoneName,
        facilityName: facilityNames?.find((obj) => obj?.id == tempData?.facilityName)?.facilityName,
      };
      setDataa(_res);
      console.log("ghbvgh", _res);
    });
  }, []);
  // data
  const data = [
    {
      id: 1,
      name: "Booking Name",
      value: "Sanskar School (upto 12 STD)",
    },
    {
      id: 2,
      name: "Ground Name",
      value: "Manapa Hockey Poligras Ground, Nehru Nagar",
    },
    // {
    //   id: 3,
    //   name: 'Rate',
    //   value: '25 for 1hr',
    // },
    // {
    //   id: 4,
    //   name: 'Booking Date',
    //   value: '8th June, 2022 Time 11:00 AM to 3:00 Pm for 1hr',
    // },
    // {
    //   id: 5,
    //   name: 'Chargable Time',
    //   value: '4 hr',
    // },
    // {
    //   id: 6,
    //   name: 'Charge',
    //   value: '4 hr * 25 = 100 ',
    // },
  ];
  const handleExit = () => {
    swal("Exit!", "Successfully Exitted  Payment!", "success");
    router.push("/dashboard");
  };

  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "Sanction-Letter.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };

    // const element = ReactDOMServer.renderToString(<ComponentToPrint data={data} ref={componentRef} />);
    const element = ReactDOMServer.renderToString(<ComponentToPrint dataa={dataa} ref={componentRef} />);
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} dataa={dataa} />
      </div>
      <div className={styles.btn}>
      <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={printHandler}>Download</Button>
        <Button type="primary" onClick={handlePrint}>
          print
        </Button>
        {/* <Button type="primary" onClick={() => console.log("paymentDone")}>
          Exit
        </Button> */}
        <Button
          variant="contained"
          color="primary"
          // disabled={validateSearch()}
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
                handleExit();
              } else {
                swal("Record is Safe");
              }
            });
          }}
          // onClick={() => {
          //   handleExit()
          // }}
        >
          {/* {<FormattedLabel id="exit" />} */}
          Exit
        </Button>
      </div>
    </>
  );
};

// class component
class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
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
                <b>I-CARD</b>
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
              </div> */}
              {/* <div className={styles.date2}>
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
                    <b>अर्जाचा क्रमांक : {router.query.applicationNumber}</b>
                  </h4>{" "}
                  {/* <h4 style={{ marginLeft: "10px" }}>{this?.props?.dataa?.bookingRegistrationId}</h4> */}
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>अर्ज दिनांक : {router.query.applicationDate}</b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>
                      अर्जदाराचे नाव : {router.query.firstName}
                      {""} {router.query.middleName}
                      {""} {router.query.lastName}
                    </b>
                  </h4>{" "}
                  {/* <h4 style={{ marginLeft: "10px" }}>{router.query.firstName}</h4> */}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>मोबाईल नं. : {router.query.mobileNo}</b>
                  </h4>{" "}
                  {/* <h4 style={{ marginLeft: "10px" }}>{router.query.firstName}</h4> */}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>पत्ता: {router.query.cAddress}</b>
                  </h4>{" "}
                  {/* <h4 style={{ marginLeft: "10px" }}>{router.query.firstName}</h4> */}
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>कालावधी: {router.query.selectSlot}</b>
                  </h4>{" "}
                  {/* <h4 style={{ marginLeft: "10px" }}>{router.query.firstName}</h4> */}
                </div>
              </div>
              <hr />

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
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
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

export default Index;

//  import React from "react";
//  import styles from "../paymentOne/payment.module.css";

//  const Index = () => {
//   return (
//     <div className={styles.main}>
//       <div className={styles.small}>
//         <div className={styles.one}>
//           <div className={styles.logo}>
//             <div>
//               <img src="/logo.png" alt="" height="100vh" width="100vw" />
//             </div>
//             <div>
//               <h5>Receipt No :-</h5>
//               <h5>Receipt Date :-</h5>
//             </div>
//           </div>
//           <div className={styles.middle}>
//             <h4>Department Name : Town Planning</h4>

//             <h4>Receipt</h4>
//           </div>
//           <div className={styles.right}>
//             <div className={styles.leftt}>
//               <h4>Service Name</h4>
//               <h4>TP:Part Plan</h4>
//               <h5>Receipt No :-</h5>
//               <h5>Receipt Date :-</h5>
//             </div>
//             <div>
//               <h4>Address</h4>
//               <h5>Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune</h5>
//             </div>
//           </div>
//         </div>
//         <div className={styles.two}>
//           <p>
//             <b>
//               To,<br></br> Dear Shri ABC,<br></br> This is acknowledged that
//               your application with listed details received for Part Plan same
//               message is sent on you registered mobile no. and email.<br></br>
//             </b>
//             <p>
//               <b>
//                 Order No.:- 001235 Shri.ABC ,Address:-Plot
//                 No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
//               </b>
//             </p>
//             <div className={styles.order}>
//               Application Fees = 20.00<br></br> Certificate/Document/Map Fees =
//               150.00 <br></br>
//               ----------------------------------------------------
//               <br></br> Total Amount = 170.00 <br></br>Amount in Words = One
//               Hundred and Seventy Rupees Only/--
//             </div>
//           </p>

//           <div className={styles.enquiry}>
//             <div>
//               <b>For Contact :- Mobile No:-9999999999</b>
//             </div>
//             <div>
//               <b>email:-enquiry@pcmcindia.gov.in</b>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;

// // http://localhost:4000/sportsPortal/transaction/sportBooking/SanctionLetter
// import { Button } from "antd";
// import axios from "axios";
// import moment from "moment";
// import React, { useEffect, useRef, useState } from "react";
// import { useReactToPrint } from "react-to-print";
// import urls from "../../../../../../URLS/urls";
// import styles from "./payment9.module.css";
// // import URLS from "../../../../URLS/urls";
// // import SignatureCanvas from 'react-signature-canvas'

// const Index = () => {
//   const componentRef = useRef(null);
//   const [dataa, setDataa] = useState(null);

//   useEffect(() => {
//     axios.get(`${urls.SPURL}/groundBooking/getById?id=${34}`).then((res) => {
//       setDataa(res.data);
//       console.log("board data", res.data);
//     });
//   }, []);
//   // data
//   const data = [
//     {
//       id: 1,
//       name: "Booking Name",
//       value: "Sanskar School (upto 12 STD)",
//     },
//     {
//       id: 2,
//       name: "Ground Name",
//       value: "Manapa Hockey Poligras Ground, Nehru Nagar",
//     },
//     // {
//     //   id: 3,
//     //   name: 'Rate',
//     //   value: '25 for 1hr',
//     // },
//     // {
//     //   id: 4,
//     //   name: 'Booking Date',
//     //   value: '8th June, 2022 Time 11:00 AM to 3:00 Pm for 1hr',
//     // },
//     // {
//     //   id: 5,
//     //   name: 'Chargable Time',
//     //   value: '4 hr',
//     // },
//     // {
//     //   id: 6,
//     //   name: 'Charge',
//     //   value: '4 hr * 25 = 100 ',
//     // },
//   ];

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: "new document",
//   });
//   return (
//     <>
//       <div>
//         <ComponentToPrint ref={componentRef} data={dataa} />
//       </div>
//       <div className={styles.btn}>
//         <Button type="primary" onClick={handlePrint}>
//           print
//         </Button>
//         <Button type="primary" onClick={() => console.log("paymentDone")}>
//           Exit
//         </Button>
//       </div>
//     </>
//   );
// };

// // class component
// class ComponentToPrint extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//       <>
//         <div className={styles.main}>
//           <div className={styles.small}>
//             <div className={styles.one}>
//               <div className={styles.logo}>
//                 <div>
//                   <img src="/logo.png" alt="" height="100vh" width="100vw" />
//                 </div>
//                 <div className={styles.date}>
//                   <h5>Application No :-</h5>
//                   <h4 style={{ marginLeft: "10px" }}>{this?.props?.dataa?.bookingRegistrationId}</h4>
//                   <h5>Application Date :-</h5>
//                   <h4 style={{ marginLeft: "10px" }}>
//                     <b>
//                       {" "}
//                       {" " + moment(this?.props?.dataa?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
//                     </b>{" "}
//                     {/* {this?.props?.dataa?.applicationDate} */}
//                   </h4>
//                 </div>
//               </div>
//               <div className={styles.middle}>
//                 <h3>
//                   <b>Pimpri Chinchwad Municipal Corporation</b>
//                 </h3>
//               </div>
//               <div className={styles.right}>
//                 <div className={styles.left}>
//                   <h4>Service Name</h4>
//                   <h4>Sports Department- Ground booking</h4>
//                 </div>
//                 <div>
//                   <h4>Address</h4>
//                   <h5>Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune</h5>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h2 className={styles.heading}>
//                 <b>Sanction Letter</b>
//               </h2>
//             </div>

//             <div>
//               <h2 className={styles.heading1}>
//                 <b style={{ marginLeft: "4vh" }}>Subject : Approval Letter (Sanction Letter) Date : </b>
//               </h2>
//             </div>

//             <div>
//               <h5 className={styles.innerTable}>
//                 <p>
//                   {/* <div className={styles.date}>
//                     <h5>Information By Zone :-</h5>
//                     <h5>Sport Officer </h5>
//                     <h5>PCMC </h5>
//                   </div> */}
//                   <div className={styles.right1}>
//                     <div className={styles.left1}>
//                       <h4>
//                         <b>Information By Zone :-</b>
//                       </h4>
//                       <h4>
//                         {" "}
//                         <b>Sport Officer </b>
//                       </h4>
//                       <h4>
//                         {" "}
//                         <b>PCMC </b>
//                       </h4>
//                       <h4>
//                         {" "}
//                         <b>Remark : </b>
//                       </h4>
//                     </div>

//                     <div>
//                       <h4>Outward No :</h4>
//                       <h4>Date :</h4>
//                     </div>
//                   </div>
//                   <hr />
//                   <div style={{ marginLeft: "4vh" }}>
//                     <h4>Order No :</h4>
//                     <h4>Address :</h4>
//                   </div>
//                   <hr />
//                   <p>
//                     <p>
//                       <br />
//                       1) Meentai Tharkare sketting Ground, Yamuna Nagar, Nigadi-Booking sample case
//                     </p>
//                   </p>
//                   <div style={{ marginLeft: "4vh" }}>
//                     <table className={styles.table}>
//                       {/* {this.props.data.map((row) => (
//                         <tr key={row.id}>
//                           <td className={styles.table}>{row.id}</td>
//                           <td className={styles.table}>{row.name}</td>
//                           <td className={styles.table}>{row.value}</td>
//                         </tr>
//                       ))} */}
//                     </table>
//                     <br />
//                   </div>
//                 </p>
//               </h5>
//             </div>

//             <div className={styles.two}>
//               {/* <p>
//                 <b>
//                   To,
//                   <br></br> Dear Shri ABC,
//                   <br></br>This is an acknowledgement that your applicationwith
//                   listed detailsreceived for Ground Booking same message is sent
//                   on you
//                   <br></br>registeredmobile no.and email.
//                   <br></br>
//                 </b>
//                 <p>
//                   <b>
//                     <br />
//                     Order No.:- 001235 Shri.ABC ,Address:-Plot
//                     No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
//                   </b>
//                   <br />
//                   <p>
//                     <br />
//                     1) Meentai Tharkare sketting Ground, Yamuna Nagar,
//                     Nigadi-Booking sample case
//                   </p>
//                 </p>
//                 <div>
//                   <table className={styles.table}>
//                     {this.props.data.map((row) => (
//                       <tr key={row.id}>
//                         <td className={styles.table}>{row.id}</td>
//                         <td className={styles.table}>{row.name}</td>
//                         <td className={styles.table}>{row.value}</td>
//                       </tr>
//                     ))}
//                   </table>
//                   <br />
//                   <p>
//                     <b>Total Cash received Rs 100</b>
//                   </p>
//                 </div>

//               </p> */}
//               <div className={styles.bottomContainer}>
//                 <div className={styles.enquiry}>
//                   <div>
//                     <b>For Contact :- Mobile No:-9999999999</b>
//                   </div>
//                   <div>
//                     <b>email:-enquiry@pcmcindia.gov.in</b>
//                   </div>
//                 </div>

//                 <div className={styles.signature}>
//                   <h4>Authority Signature</h4>
//                   <div className={styles.canvaSign}>
//                     {/* <SignatureCanvas
//                       penColor="black"
//                       canvasProps={{
//                         width: 200,
//                         height: 100,
//                         border: '1px solid black',
//                       }}
//                     /> */}
//                   </div>
//                   <p>Max file size accepted is 200kb in jpeg, PNG and pdf format</p>
//                   <h4>Officer Municipal Corporation</h4>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }

// export default Index;

// //  import React from "react";
// //  import styles from "../paymentOne/payment.module.css";

// //  const Index = () => {
// //   return (
// //     <div className={styles.main}>
// //       <div className={styles.small}>
// //         <div className={styles.one}>
// //           <div className={styles.logo}>
// //             <div>
// //               <img src="/logo.png" alt="" height="100vh" width="100vw" />
// //             </div>
// //             <div>
// //               <h5>Receipt No :-</h5>
// //               <h5>Receipt Date :-</h5>
// //             </div>
// //           </div>
// //           <div className={styles.middle}>
// //             <h4>Department Name : Town Planning</h4>

// //             <h4>Receipt</h4>
// //           </div>
// //           <div className={styles.right}>
// //             <div className={styles.leftt}>
// //               <h4>Service Name</h4>
// //               <h4>TP:Part Plan</h4>
// //               <h5>Receipt No :-</h5>
// //               <h5>Receipt Date :-</h5>
// //             </div>
// //             <div>
// //               <h4>Address</h4>
// //               <h5>Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune</h5>
// //             </div>
// //           </div>
// //         </div>
// //         <div className={styles.two}>
// //           <p>
// //             <b>
// //               To,<br></br> Dear Shri ABC,<br></br> This is acknowledged that
// //               your application with listed details received for Part Plan same
// //               message is sent on you registered mobile no. and email.<br></br>
// //             </b>
// //             <p>
// //               <b>
// //                 Order No.:- 001235 Shri.ABC ,Address:-Plot
// //                 No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
// //               </b>
// //             </p>
// //             <div className={styles.order}>
// //               Application Fees = 20.00<br></br> Certificate/Document/Map Fees =
// //               150.00 <br></br>
// //               ----------------------------------------------------
// //               <br></br> Total Amount = 170.00 <br></br>Amount in Words = One
// //               Hundred and Seventy Rupees Only/--
// //             </div>
// //           </p>

// //           <div className={styles.enquiry}>
// //             <div>
// //               <b>For Contact :- Mobile No:-9999999999</b>
// //             </div>
// //             <div>
// //               <b>email:-enquiry@pcmcindia.gov.in</b>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Index;
