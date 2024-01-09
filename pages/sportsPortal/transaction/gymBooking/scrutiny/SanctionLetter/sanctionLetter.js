// http://localhost:4000/sportsPortal/transaction/sportBooking/SanctionLetter
import { Button } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../../URLS/urls";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import styles from "./payment9.module.css";

const Index = () => {
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
  const [venueNames, setVenueNames] = useState([]);

  const getVenueNames = () => {
    axios.get(`${urls.SPURL}/venueMasterSection/getAll`).then((r) => {
      setVenueNames(
        r.data.venueSection.map((row) => ({
          id: row.id,
          venue: row.venue,
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
  const [datetime, setDatetime] = useState([]);

  const getDateTime = () => {
    axios.get(`${urls.SPURL}/bookingTime/getAll`).then((r) => {
      setDatetime(
        r.data.bookingTime.map((row) => ({
          id: row.id,
          fromBookingTime: row.fromBookingTime,
          toBookingTime: row.toBookingTime,
        })),
      );
    });
  };
  useEffect(() => {
    // getFacilityTypes();
    getVenueNames();
    getFacilityName();
    getZoneKeys();
    getDateTime();
  }, []);
  const [dataa, setDataa] = useState(null);
  const [sum, setSum] = useState(0);
  const [applicableCharages, setApplicableCharages] = useState([]);

  useEffect(() => {
    if (applicableCharages) {
      let total = 0;
      applicableCharages.map((charge) => {
        total = total + charge.amountPerHead;
      });
      setSum(total);
      console.log("&&", total);
    }
  }, [applicableCharages]);

  useEffect(() => {
    axios.get(`${urls.SPURL}/gymBooking/getById?id=${router?.query?.id}`).then((res) => {
      const tempData = res?.data;
      console.log("getbyId", tempData);
      setApplicableCharages(res?.data?.applicableCharages);

      const _res = {
        ...tempData,
        venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
        // fromBookingTime: moment(tempData.fromBookingTime).format("hh:mm A"),
        // toBookingTime: moment(tempData.toBookingTime).format("hh:mm A"),
        fromBookingTime: datetime?.find((obj) => obj?.id == tempData?.bookingTimeId)?.fromBookingTime,
        toBookingTime: datetime?.find((obj) => obj?.id == tempData?.bookingTimeId)?.toBookingTime,
        // zone: zoneKeys?.find((obj) => obj?.id == tempData?.zone)?.zoneName,
        // venue: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
        // facilityName: facilityNames?.find((obj) => obj?.id == tempData?.facilityName)?.facilityName,
      };

      setDataa(_res);

      // console.log("765342", _res.venue);
    });
  }, [venueNames],[datetime]);
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
  ];
  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "Sanction-Letter.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };

    // const element = ReactDOMServer.renderToString(<ComponentToPrint data={data} ref={componentRef} />);
    const element = ReactDOMServer.renderToString(<ComponentToPrint dataa={dataa} venueNames={venueNames} sum={sum}  ref={componentRef} />);
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
        <ComponentToPrint ref={componentRef} dataa={dataa} venueNames={venueNames} sum={sum} />
      </div>
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
                router.push("/sportsPortal/transaction/gymBooking/scrutiny");
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

// class component
class ComponentToPrint extends React.Component {
  constructor(props) {
    console.log("6556", props);
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
                <div className={styles.date}>
                  {/* <h5>Receipt No :-</h5>
                  <h5>Receipt Date :-</h5> */}
                </div>
              </div>
              <div className={styles.middle}>
                <h3>Pimpri Chinchwad Municipal Corporation</h3>
                <h4> Mumbai-Pune Road,</h4>
                <h4>Pimpri - 411018,</h4>
                <h4> Maharashtra, INDIA</h4>
              </div>
              <div className={styles.right}>
                <div className={styles.left}>
                  <h4>Service Name</h4>
                  <h4>Sports Department- GYM booking</h4>
                  {/* <h5>Receipt No :-{this?.props?.dataa?.applicationNumber}</h5> */}
                  <h5>Receipt Date :-{this?.props?.dataa?.applicationDate}</h5>
                </div>
                <div>
                  <h4>Address</h4>
                  <h5>Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune</h5>
                </div>
              </div>
            </div>

            <div>
              <h2 className={styles.heading}>Sanction Letter</h2>
            </div>

            <div className={styles.two}>
              <p>
                To,
                <br></br> Dear{" "}
                <b>
                  {this?.props?.dataa?.firstName} {this?.props?.dataa?.middleName}{" "}
                  {this?.props?.dataa?.lastName}
                </b>
                ,<br></br>
                This is an acknowledgement that your applicationwith listed detailsreceived for GYM Booking
                same message is sent on you
                <br></br>registeredmobile no.and email.
                <br></br>
                <p>
                  {/* <b>
                    <br />
                    Order No.:- 001235 Shri.ABC ,Address:-Plot No.000,Pradhikaran,Nigadi,Pimpri
                    Chinchwad:411018.
                  </b> */}
                  <br />
                  {/* <p>
                    <br />
                    1) Meentai Tharkare sketting Ground, Yamuna Nagar, Nigadi-Booking sample case
                  </p> */}
                  <h3>
                    {" "}
                    <b>ApplicationNumber: </b>
                    {this?.props?.dataa?.applicationNumber}
                  </h3>
                  <h3>
                    {" "}
                    <b>Venue Name : </b>
                    {this?.props?.dataa?.venueNames}
                  </h3>
                  <h3>
                    {" "}
                    <b>Date : </b>
                    {this?.props?.dataa?.fromDate} - {this?.props?.dataa?.toDate}
                  </h3>

                  <h3>
                    <b> Time : </b>
                    {this?.props?.dataa?.fromBookingTime} - {this?.props?.dataa?.toBookingTime}
                  </h3>
                  {/* <h3>
                    {" "}
                    <b>Booking Time (To): </b>
                    {this?.props?.dataa?.toBookingTime}
                  </h3> */}

                  {/* venueNames */}
                </p>
                <div>
                  <table className={styles.table}></table>
                  <br />
                  <p>
                    Total Cash received <b>Rs. {this?.props?.sum}-/ (रु)</b>
                  </p>
                </div>
              </p>
              <div className={styles.bottomContainer}>
                <div className={styles.enquiry}>
                  <div>
                    <b>For Contact :- Mobile No:-9999999999</b>
                  </div>
                  <div>
                    <b>email:-enquiry@pcmcindia.gov.in</b>
                  </div>
                </div>

                <div className={styles.signature}>
                  <h4>Authority Signature</h4>
                  <div className={styles.canvaSign}>
                    {/* <SignatureCanvas
                      penColor="black"
                      canvasProps={{
                        width: 200,
                        height: 100,
                        border: '1px solid black',
                      }}
                    /> */}
                  </div>
                  {/* <p>Max file size accepted is 200kb in jpeg, PNG and pdf format</p> */}
                  <h4>Officer Municipal Corporation</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
    // return (
    //   <>
    //     <div className={styles.main}>
    //       <div className={styles.small}>
    //         <div className={styles.one}>
    //           <div className={styles.logo}>
    //             <div>
    //               <img src="/logo.png" alt="" height="100vh" width="100vw" />
    //             </div>
    //             <div className={styles.date}>
    //               <h5>Application No :-{this?.props?.dataa?.applicationNumber}</h5>
    //               <h5>
    //                 Application Date :-{" "}
    //                 {" " + moment(this?.props?.dataa?.bookingDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
    //               </h5>
    //             </div>
    //           </div>
    //           <div className={styles.middle}>
    //             <h3>
    //               <b>Pimpri Chinchwad Municipal Corporation</b>
    //             </h3>
    //             {/* <h4> Mumbai-Pune Road,</h4>
    //             <h4>Pimpri - 411018,</h4>
    //             <h4> Maharashtra, INDIA</h4> */}
    //           </div>
    //           <div className={styles.right}>
    //             <div className={styles.left}>
    //               <h4>Service Name :{this?.props?.dataa?.serviceName}</h4>
    //               <h4>Sports Department- {this?.props?.dataa?.facilityName}</h4>
    //               {/* <h5>Receipt No :-</h5>
    //               <h5>Receipt Date :-</h5> */}
    //             </div>
    //             <div>
    //               <h4>Address</h4>
    //               <h5>Zone name. :{this?.props?.dataa?.zone}</h5>
    //             </div>
    //           </div>
    //         </div>

    //         <div>
    //           <h2 className={styles.heading}>
    //             <b>Sanction Letter</b>
    //           </h2>
    //         </div>

    //         <div>
    //           <h2 className={styles.heading1}>
    //             <b style={{ marginLeft: "4vh" }}>
    //               Subject : Approval Letter (Sanction Letter) Date :
    //               {" " + moment(this?.props?.dataa?.bookingDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
    //             </b>
    //           </h2>
    //         </div>

    //         <div>
    //           <h5 className={styles.innerTable}>
    //             <p>
    //               {/* <div className={styles.date}>
    //                 <h5>Information By Zone :-</h5>
    //                 <h5>Sport Officer </h5>
    //                 <h5>PCMC </h5>
    //               </div> */}
    //               <div className={styles.right1}>
    //                 <div className={styles.left1}>
    //                   <h4>
    //                     <b>Information By Zone :-{this?.props?.dataa?.zone}</b>
    //                   </h4>
    //                   <h4>
    //                     {" "}
    //                     <b>Sport Officer </b>
    //                   </h4>
    //                   <h4>
    //                     {" "}
    //                     <b>PCMC </b>
    //                   </h4>
    //                   <h4>
    //                     {" "}
    //                     <b>Remark : </b>
    //                   </h4>
    //                 </div>

    //                 <div>
    //                   <h4>Outward No :</h4>
    //                   <h4>
    //                     Date :{" "}
    //                     {" " + moment(this?.props?.dataa?.bookingDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
    //                   </h4>
    //                 </div>
    //               </div>
    //               <hr />
    //               <div style={{ marginLeft: "4vh" }}>
    //                 <h4>Order No :</h4>
    //                 <h4>Address :</h4>
    //               </div>
    //               <hr />
    //               <p>
    //                 <p>
    //                   <br />
    //                 </p>
    //               </p>
    //               <div style={{ marginLeft: "4vh" }}>
    //                 <table id="table-to-xls" className={styles.report_table}>
    //                   <thead>
    //                     <tr>
    //                       <th colSpan={2}>अ.क्र</th>
    //                       <th colSpan={8}>Booking Name</th>
    //                       <th colSpan={2}>Booking Type</th>
    //                     </tr>
    //                     <tr>
    //                       <td colSpan={4}>1)</td>
    //                       <td colSpan={4}>{this?.props?.dataa?.serviceName}</td>
    //                       <td colSpan={4}>{this?.props?.dataa?.facilityName}</td>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     <tr>
    //                       <td colSpan={4}>
    //                         <b></b>
    //                       </td>
    //                       <td colSpan={4}>
    //                         <b></b>
    //                       </td>
    //                       <td colSpan={4}>{/* <b>एकूण रक्कम : {this?.props?.dataa?.amount}</b> */}</td>
    //                     </tr>
    //                   </tbody>
    //                 </table>
    //                 <br />
    //               </div>
    //             </p>
    //           </h5>
    //         </div>

    //         <div className={styles.two}>
    //           {/* <p>
    //             <b>
    //               To,
    //               <br></br> Dear Shri ABC,
    //               <br></br>This is an acknowledgement that your applicationwith
    //               listed detailsreceived for Ground Booking same message is sent
    //               on you
    //               <br></br>registeredmobile no.and email.
    //               <br></br>
    //             </b>
    //             <p>
    //               <b>
    //                 <br />
    //                 Order No.:- 001235 Shri.ABC ,Address:-Plot
    //                 No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
    //               </b>
    //               <br />
    //               <p>
    //                 <br />
    //                 1) Meentai Tharkare sketting Ground, Yamuna Nagar,
    //                 Nigadi-Booking sample case
    //               </p>
    //             </p>
    //             <div>
    //               <table className={styles.table}>
    //                 {this.props.data.map((row) => (
    //                   <tr key={row.id}>
    //                     <td className={styles.table}>{row.id}</td>
    //                     <td className={styles.table}>{row.name}</td>
    //                     <td className={styles.table}>{row.value}</td>
    //                   </tr>
    //                 ))}
    //               </table>
    //               <br />
    //               <p>
    //                 <b>Total Cash received Rs 100</b>
    //               </p>
    //             </div>

    //           </p> */}
    //           <div className={styles.bottomContainer}>
    //             <div className={styles.enquiry}>
    //               <div>
    //                 <b>For Contact :- Mobile No:-9999999999</b>
    //               </div>
    //               <div>
    //                 <b>email:-enquiry@pcmcindia.gov.in</b>
    //               </div>
    //             </div>

    //             <div className={styles.signature}>
    //               <h4>Authority Signature</h4>
    //               <div className={styles.canvaSign}>
    //                 {/* <SignatureCanvas
    //                   penColor="black"
    //                   canvasProps={{
    //                     width: 200,
    //                     height: 100,
    //                     border: '1px solid black',
    //                   }}
    //                 /> */}
    //               </div>
    //               <p>Max file size accepted is 200kb in jpeg, PNG and pdf format</p>
    //               <h4>Officer Municipal Corporation</h4>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </>
    // );
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
