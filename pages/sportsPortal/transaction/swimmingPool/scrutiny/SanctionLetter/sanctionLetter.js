// import { Button, Paper, Stack } from "@mui/material";
// import axios from "axios";
// import moment from "moment";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import React, { useEffect, useRef, useState } from "react";
// import { useReactToPrint } from "react-to-print";
// import urls from "../../../../../../URLS/urls";

// // import Loader from "../../../../containers/Layout/components/Loader";
// import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";

// // Identity
// const IdCardOfStreetVendor = () => {
//   const componentRef = useRef();
//   const router = useRouter();
//   const [iCardData, setICardData] = useState();
//   const [loadderState, setLoadderState] = useState(false);
//   const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
//   const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
//   const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
//     useState();
//   const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   // getICardData
//   const getICardData = () => {
//     let url;
//     // issuance
//     if (
//       issuanceOfHawkerLicenseId != null &&
//       issuanceOfHawkerLicenseId != undefined &&
//       issuanceOfHawkerLicenseId != ""
//     ) {
//       url = `${urls.HMSURL}/hawkerLiscenseIdCard/getById?issuanceOfliscenseId=${issuanceOfHawkerLicenseId}`;
//     }
//     // renewal
//     else if (
//       renewalOfHawkerLicenseId != null &&
//       renewalOfHawkerLicenseId != undefined &&
//       renewalOfHawkerLicenseId != ""
//     ) {
//       url = `${urls.HMSURL}/hawkerLiscenseIdCard/getByRenewalId?renewalOfliscenseId=${renewalOfHawkerLicenseId}`;
//     }
//     // cancellation
//     else if (
//       cancellationOfHawkerLicenseId != null &&
//       cancellationOfHawkerLicenseId != undefined &&
//       cancellationOfHawkerLicenseId != ""
//     ) {
//       url = `${urls.HMSURL}/hawkerLiscenseIdCard/getById?cancellationOfHawkerLicenseId=${cancellationOfHawkerLicenseId}`;
//     }
//     // transfer
//     else if (
//       transferOfHawkerLicenseId != null &&
//       transferOfHawkerLicenseId != undefined &&
//       transferOfHawkerLicenseId != ""
//     ) {
//       url = `${urls.HMSURL}/hawkerLiscenseIdCard/getByTransferId?transferOfliscenseId=${transferOfHawkerLicenseId}`;
//     }

//     axios
//       .get(url)
//       .then((r) => {
//         if (
//           r?.status == 200 ||
//           res?.status == 201 ||
//           res?.status == "SUCCESS"
//         ) {
//           setICardData(r?.data);
//           setLoadderState(false);
//         } else {
//           setLoadderState(false);
//         }
//       })
//       .catch(() => {
//         setLoadderState(false);
//       });
//   };

//   // idSet
//   useEffect(() => {
//     // issuance
//     if (
//       localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
//       localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
//       localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
//     ) {
//       setLoadderState(true);
//       setIssuanceOfHawkerLicenseId(
//         localStorage.getItem("issuanceOfHawkerLicenseId"),
//       );
//     }

//     // renewal
//     else if (
//       localStorage.getItem("renewalOfHawkerLicenseId") != null &&
//       localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
//       localStorage.getItem("renewalOfHawkerLicenseId") != undefined
//     ) {
//       setLoadderState(true);
//       setRenewalOfHawkerLicenseId(
//         localStorage.getItem("renewalOfHawkerLicenseId"),
//       );
//     }

//     // cancelltion
//     else if (
//       localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
//       localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
//       localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
//     ) {
//       setLoadderState(true);
//       setCancellationOfHawkerLicenseId(
//         localStorage.getItem("cancellationOfHawkerLicenseId"),
//       );
//     }

//     // transfer
//     else if (
//       localStorage.getItem("transferOfHawkerLicenseId") != null &&
//       localStorage.getItem("transferOfHawkerLicenseId") != "" &&
//       localStorage.getItem("transferOfHawkerLicenseId") != undefined
//     ) {
//       setLoadderState(true);
//       setTransferOfHawkerLicenseId(
//         localStorage.getItem("transferOfHawkerLicenseId"),
//       );
//     }
//   }, []);

//   // api
//   useEffect(() => {
//     // ICardData
//     getICardData();
//   }, [
//     issuanceOfHawkerLicenseId,
//     renewalOfHawkerLicenseId,
//     cancellationOfHawkerLicenseId,
//     transferOfHawkerLicenseId,
//   ]);

//   useEffect(() => {
//     console.log("iCardData", iCardData);
//   }, [iCardData]);

//   // view
//   return (
//     <>
//       {loadderState ? (
//         <Loader />
//       ) : (
//         <div style={{ color: "white" }}>
//           <Paper
//             style={{
//               margin: "50px",
//             }}>
//             <br />
//             <Stack
//               spacing={5}
//               direction='row'
//               style={{
//                 display: "flex",
//                 justifyContent: "left",
//                 marginLeft: "50px",
//               }}>
//               <Button
//                 variant='contained'
//                 type='primary'
//                 style={{ float: "right" }}
//                 onClick={() => handlePrint()}>
//                 {<FormattedLabel id='print' />}
//               </Button>
//               <Button
//                 onClick={() => {
//                   localStorage.removeItem("issuanceOfHawkerLicenseId");
//                   if (localStorage.getItem("loggedInUser") == "citizenUser") {
//                     router.push("/dashboard");
//                   } else {
//                     router.push("/streetVendorManagementSystem/dashboards");
//                   }
//                 }}
//                 type='button'
//                 variant='contained'
//                 color='primary'>
//                 {<FormattedLabel id='back' />}
//               </Button>
//             </Stack>
//             <div>
//               <center>
//                 <h1>ओळखपत्र</h1>
//               </center>
//             </div>

//             <ComponentToPrint ref={componentRef} iCardData={iCardData} />
//           </Paper>
//         </div>
//       )}
//     </>
//   );
// };

// // ComponentToPrint - ClassComonent
// class ComponentToPrint extends React.Component {
//   render() {
//     // View
//     return (
//       <div>
//         <Paper
//           // style={{
//           //   margin: "50px",
//           // }}
//           elevation={0}
//           sx={{
//             paddingRight: "75px",
//             marginTop: "50px",
//             paddingLeft: "30px",
//             paddingBottom: "50px",
//             height: "1000px",
//           }}>
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <div
//               style={{
//                 width: "700px",
//                 border: "2px solid black",
//                 paddingLeft: "20px",
//                 paddingRight: "20px",
//                 // padding: "20px",
//               }}>
//               {/** First Row */}
//               <div
//                 style={{
//                   marginTop: "50px",
//                   display: "flex",
//                   justifyContent: "space-around",
//                 }}>
//                 <div style={{ display: "flex" }}>
//                   <Image
//                     src='/logo.png'
//                     alt='PCMC Logo'
//                     height={100}
//                     width={100}
//                   />
//                 </div>
//                 <div style={{ textAlign: "center" }}>
//                   <h2>
//                     <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
//                   </h2>
//                   <h3>
//                     <b>ओळखपत्र</b>
//                   </h3>
//                 </div>
//                 <div className='col-md-7'>
//                   <Image
//                     src='/barcode.jpg'
//                     alt='Barcode Logo'
//                     height={100}
//                     width={100}
//                   />
//                 </div>
//               </div>
//               <table
//                 style={{
//                   width: "100%",
//                   marginTop: "75px",
//                   marginLeft: "20px",
//                   marginRight: "20px",
//                   marginBottom: "20px",
//                   // border: "2px solid red",
//                 }}>
//                 {/**1 */}
//                 <tr>
//                   <td
//                     colSpan={30}
//                     // style={{ border: "2px solid yellow" }}
//                   >
//                     <h3>
//                       <b>ओळखपत्र क्रमांक : </b>&nbsp;{" "}
//                       {this?.props?.iCardData?.iCardNo}
//                     </h3>
//                   </td>

//                   <td
//                     colSpan={10}
//                     rowSpan={5}
//                     style={{
//                       // border: "2px solid pink",
//                       display: "table-cell",
//                     }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         marginRight: "20px",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}>
//                       <img
//                         src={`${urls.CFCURL}/file/preview?filePath=${
//                           this?.props?.iCardData?.siteVisits[
//                             this?.props?.iCardData?.siteVisits?.length == 1
//                               ? 0
//                               : this?.props?.iCardData?.siteVisits?.length - 1
//                           ]?.streetVendorPhoto
//                         }`}
//                         alt='Street Vendor Photo'
//                         width={200}></img>
//                     </div>
//                   </td>
//                 </tr>
//                 {/**2 */}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>नावं : &nbsp; </b>
//                       {this?.props?.iCardData?.applicantName}
//                     </h3>
//                   </td>
//                 </tr>
//                 {/**3 */}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>जन्मदिनांक :&nbsp;</b>{" "}
//                       {moment(this?.props?.iCardData?.dateOfBirth).format(
//                         "DD-MM-YYYY",
//                       )}
//                     </h3>
//                   </td>
//                 </tr>
//                 {/**4 */}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>लिंग :&nbsp; </b>
//                       {this?.props?.iCardData?.genderNameMr}
//                     </h3>
//                   </td>
//                 </tr>
//                 {/**5 */}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>पथविक्रेत्याची वर्गवारी :&nbsp; </b>
//                       {this?.props?.iCardData?.hawkerTypeNameMr}
//                     </h3>
//                   </td>
//                 </tr>
//                 {/**6 */}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>व्यवसायाचा प्रकार : </b>&nbsp;
//                       {this?.props?.iCardData?.hawkingModeNameMr}
//                     </h3>
//                   </td>
//                 </tr>
//                 {/**7 */}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>भ्रमणध्वनी क्रमांक : </b>&nbsp;{" "}
//                       {this?.props?.iCardData?.mobile}
//                     </h3>
//                   </td>
//                 </tr>
//                 {/**9 */}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>जारी केल्याचा दिनांक :</b> &nbsp;{" "}
//                       {moment(this?.props?.iCardData?.icardIssuedDate).format(
//                         "DD-MM-YYYY",
//                       )}
//                     </h3>
//                   </td>
//                 </tr>
//                 {/**10 */}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>वैधता (पर्यंत) :&nbsp; </b>
//                     </h3>
//                   </td>
//                   <td
//                     style={{
//                       // border: "2px solid pink",
//                       display: "table-cell",
//                     }}>
//                     <h3
//                       style={{
//                         marginRight: "20px",
//                         //   border: "2px solid pink",
//                         display: "flex",
//                         justifyContent: "center",
//                       }}>
//                       <b>स्वाक्षरी : </b>
//                     </h3>
//                   </td>
//                 </tr>
//                 {/**11*/}
//                 <tr>
//                   <td colSpan={30}>
//                     <h3>
//                       <b>पथविक्रेत्याचा निवासी पत्ता :</b>&nbsp;
//                       {this?.props?.iCardData?.fullAddressMr}
//                     </h3>
//                   </td>
//                 </tr>
//               </table>
//             </div>
//           </div>
//         </Paper>
//       </div>
//     );
//   }
// }

// export default IdCardOfStreetVendor;

import { Button } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../../URLS/urls";
import router from "next/router";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import styles from "./payment9.module.css";

// import styles from "./goshwara.module.css";

const Index = (props) => {
  const router = useRouter();
  const componentRef = useRef(null);
  const [facilityNames, setFacilityNames] = useState([]);
  const [queryData, setQueryData] = useState();
  const [datetime, setDatetime] = useState([]);

  const getDateTime = () => {
    axios.get(`${urls.SPURL}/bookingTime/getAll`).then((r) => {
      setDatetime(
        r.data.bookingTime.map((row) => ({
          id: row.id,
          fromBookingTime: row.fromBookingTime,
          toBookingTime: row.toBookingTime,
        }))
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
  const getFacilityName = () => {
    axios.get(`${urls.SPURL}/facilityName/getAll`).then((r) => {
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        }))
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
        }))
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

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${urls.SPURL}/swimmingBookingMonthly/getById?id=${router?.query?.id}`
  //     )
  //     .then((res) => {
  //       console.log("75765", res);
  //       const tempData = res?.data;
  //       const _res = {
  //         ...tempData,
  //         venue: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
  //         // facilityName: facilityNames?.find(
  //         //   (obj) => obj?.id == tempData?.facilityName
  //         // )?.facilityName,
  //         fromBookingTime: datetime?.find(
  //           (obj) => obj?.id == tempData?.bookingTimeId
  //         )?.fromBookingTime,
  //         toBookingTime: datetime?.find(
  //           (obj) => obj?.id == tempData?.bookingTimeId
  //         )?.toBookingTime,
  //       };
  //       // setDataa(_res);
  //       setdata(_res);

  //       // const _res = {
  //       //   ...tempData,

  //       // };
  //       // setDataa(_res);
  //       // console.log("ghbvgh", _res);
  //     });
  // }, []);

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
        .get(`${urls.SPURL}/swimmingPool/getById?id=${router?.query?.id}`)
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
          setDataa(_res);

          // setdata(res.data);
          // setappCharagesDaos(res?.data?.appCharagesDaos);
        });
    }
  };
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
    router.push("/sportsPortal/transaction/swimmingPoolM/scrutiny");
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
    const element = ReactDOMServer.renderToString(
      <ComponentToPrint dataa={dataa} ref={componentRef} />
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
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={printHandler}
        >
          Download
        </Button>
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
              <div style={{ marginLeft: "15vh" }}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div style={{ marginLeft: "15vh" }}>
                    <img
                      src={`${urls.CFCURL}/file/preview?filePath=${router.query.photo}`}
                      alt="Photo "
                      width={200}
                    ></img>
                  </div>
                </div>

                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "40px" }}>
                      <b>
                        अर्जाचा क्रमांक :{" "}
                        {this?.props?.dataa?.applicationNumber}
                      </b>
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
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    {/* <b>कालावधी: {router.query.selectSlot}</b> */}
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
