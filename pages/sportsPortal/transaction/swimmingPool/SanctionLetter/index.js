// http://localhost:4000/sportsPortal/transaction/sportBooking/SanctionLetter
import { Button } from "antd";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./payment9.module.css";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
// import URLS from "../../../../URLS/urls";
// import SignatureCanvas from 'react-signature-canvas'

const Index = () => {
  const componentRef = useRef(null);

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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={data} />
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
        <Button type="primary" onClick={() => console.log("paymentDone")}>
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
                <div className={styles.date}>
                  <h5>Application No :-</h5>
                  <h5>Application Date :-</h5>
                </div>
              </div>
              <div className={styles.middle}>
                <h3>
                  <b>Pimpri Chinchwad Municipal Corporation</b>
                </h3>
                {/* <h4> Mumbai-Pune Road,</h4>
                <h4>Pimpri - 411018,</h4>
                <h4> Maharashtra, INDIA</h4> */}
              </div>
              <div className={styles.right}>
                <div className={styles.left}>
                  <h4>Service Name</h4>
                  <h4>Sports Department- Ground booking</h4>
                  {/* <h5>Receipt No :-</h5>
                  <h5>Receipt Date :-</h5> */}
                </div>
                <div>
                  <h4>Address</h4>
                  <h5>
                    Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune
                  </h5>
                </div>
              </div>
            </div>

            <div>
              <h2 className={styles.heading}>
                <b>Sanction Letter</b>
              </h2>
            </div>

            <div>
              <h2 className={styles.heading1}>
                <b style={{ marginLeft: "4vh" }}>
                  Subject : Approval Letter (Sanction Letter) Date :
                </b>
              </h2>
            </div>

            <div>
              <h5 className={styles.innerTable}>
                <p>
                  {/* <div className={styles.date}>
                    <h5>Information By Zone :-</h5>
                    <h5>Sport Officer </h5>
                    <h5>PCMC </h5>
                  </div> */}
                  <div className={styles.right1}>
                    <div className={styles.left1}>
                      <h4>
                        <b>Information By Zone :-</b>
                      </h4>
                      <h4>
                        {" "}
                        <b>Sport Officer </b>
                      </h4>
                      <h4>
                        {" "}
                        <b>PCMC </b>
                      </h4>
                      <h4>
                        {" "}
                        <b>Remark : </b>
                      </h4>
                    </div>

                    <div>
                      <h4>Outward No :</h4>
                      <h4>Date :</h4>
                    </div>
                  </div>
                  <hr />
                  <div style={{ marginLeft: "4vh" }}>
                    <h4>Order No :</h4>
                    <h4>Address :</h4>
                  </div>
                  <hr />
                  <p>
                    <p>
                      <br />
                      1) Meentai Tharkare sketting Ground, Yamuna Nagar,
                      Nigadi-Booking sample case
                    </p>
                  </p>
                  <div style={{ marginLeft: "4vh" }}>
                    <table className={styles.table}>
                      {this.props.data.map((row) => (
                        <tr key={row.id}>
                          <td className={styles.table}>{row.id}</td>
                          <td className={styles.table}>{row.name}</td>
                          <td className={styles.table}>{row.value}</td>
                        </tr>
                      ))}
                    </table>
                    <br />
                  </div>
                </p>
              </h5>
            </div>

            <div className={styles.two}>
              {/* <p>
                <b>
                  To,
                  <br></br> Dear Shri ABC,
                  <br></br>This is an acknowledgement that your applicationwith
                  listed detailsreceived for Ground Booking same message is sent
                  on you
                  <br></br>registeredmobile no.and email.
                  <br></br>
                </b>
                <p>
                  <b>
                    <br />
                    Order No.:- 001235 Shri.ABC ,Address:-Plot
                    No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
                  </b>
                  <br />
                  <p>
                    <br />
                    1) Meentai Tharkare sketting Ground, Yamuna Nagar,
                    Nigadi-Booking sample case
                  </p>
                </p>
                <div>
                  <table className={styles.table}>
                    {this.props.data.map((row) => (
                      <tr key={row.id}>
                        <td className={styles.table}>{row.id}</td>
                        <td className={styles.table}>{row.name}</td>
                        <td className={styles.table}>{row.value}</td>
                      </tr>
                    ))}
                  </table>
                  <br />
                  <p>
                    <b>Total Cash received Rs 100</b>
                  </p>
                </div>
             
              </p> */}
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
                  <p>
                    Max file size accepted is 200kb in jpeg, PNG and pdf format
                  </p>
                  <h4>Officer Municipal Corporation</h4>
                </div>
              </div>
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
