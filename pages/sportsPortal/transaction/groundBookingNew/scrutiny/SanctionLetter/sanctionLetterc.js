import { Button } from "antd";
import axios from "axios";
import html2pdf from "html2pdf-jspdf2";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../../../URLS/urls";
import { useGetToken } from "../../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../../util/util";
import styles from "./payment9.module.css";


const Index = () => {
  const router = useRouter();
  const userDao = useSelector((state) => state?.user?.user?.userDao);
  let language = useSelector((state) => state.labels.language);
  const componentRef = useRef(null);
  const userToken = useGetToken();
  const [venueNames, setVenueNames] = useState([]);
  const [id, setid] = useState();
  const [dataa, setDataa] = useState(null);
  const [applicableCharages, setApplicableCharages] = useState([]);
  const [sum, setSum] = useState(0);
  const [title, setTitle] = useState([]);
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

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setTitle(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });;
  };

  // getData
  const getData = () => {
    axios
      .get(`${urls.SPURL}/groundBooking/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("54332313456", r?.data);
        setApplicableCharages(r?.data?.applicableCharages);

        const tempData = r?.data;
        const _res = {
          ...tempData,
          selectedBookingSlots: JSON.parse(tempData?.selectedBookingSlots),
          venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)
            ?.venue,
          title: title?.find((obj) => obj?.id == tempData?.title)?.title,
          fromBookingTime: moment(tempData.fromBookingTime).format("hh:mm A"),
          toBookingTime: moment(tempData.toBookingTime).format("hh:mm A"),
        };

        console.log("getbyId", _res);
        setDataa(_res);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };


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
    });;
  };


  //  printHandler
  const printHandler = () => {
    console.log("Download is working now");
    let opt = {
      margin: 1,
      filename: "Sanction-Letter.pdf",
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
    documentTitle: "new document",
  });

  //! ================= useEffect
  useEffect(() => {
    getVenueNames();
    getTitles();
  }, []);

  useEffect(() => {
    if (applicableCharages) {
      let deposite = 0,
        rate = 0;

      applicableCharages.forEach((charge) => {
        deposite += charge.chargeType == 2 ? charge.amountPerHead : 0;
        rate += charge.chargeType == 1 ? charge.totalAmount : 0;
      });
      console.log("Rate: ", rate);
      console.log("deposite: ", deposite);
      setSum(deposite + rate);
    }
  }, [applicableCharages]);

  useEffect(() => {
    if (id != null && id != undefined && id != "") {
      getData();
    }
  }, [venueNames]);

  useEffect(() => {
    if (
      localStorage.getItem("id") != null &&
      localStorage.getItem("id") != "" && localStorage.getItem("id") != undefined
    ) {
      setid(localStorage.getItem("id"));
    }
  }, []);

  //!============================ view
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} dataa={dataa} sum={sum} />
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

// class component
class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className={styles.main}>
          <div className={styles.small}>
            {/* <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
                <div className={styles.date}>
                
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
                  <h4>Sports Department- Ground booking</h4>
                  <h5>
                    Application No. :-{this?.props?.dataa?.applicationNumber}
                  </h5>
                </div>
                <div>
                  <h4>Address</h4>
                  <h5>
                    Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune
                  </h5>
                </div>
              </div>
            </div> */}
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
                  {/* <b>पिंपरी चिंचवड महानगरपालिका</b> */}
                  <b>Pimpri Chinchwad Municipal Corporation</b>
                </h1>
              </div>
              <div className={styles.logo}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>

            <div>
              <h2 className={styles.heading}>Sanction Letter</h2>
            </div>

            <div className={styles.two}>
              <p>
                To,
                <br></br>
                {/* Dear */}
                {this?.props?.dataa?.title}
                <b>
                  {" "}
                  {this?.props?.dataa?.firstName}{" "}
                  {this?.props?.dataa?.middleName}{" "}
                  {this?.props?.dataa?.lastName},
                </b>
                <br></br>This is an acknowledgement that your application with
                listed details received for Ground Booking same message is sent
                on you
                <br></br>registered mobile no.and email.
                <br></br>
                <p>
                  <b>
                    <br />
                    Order No.:- 001235
                  </b>
                  <b>
                    <br />
                    {/* Address:-Plot No.000,Pradhikaran,Nigadi,Pimpri
                    Chinchwad:411018. */}
                    Address:-{this?.props?.dataa?.cAddress}{" "}
                    {this?.props?.dataa?.cCityName}{" "}
                    {this?.props?.dataa?.cPincode}{" "}
                  </b>
                  <br />
                  <p>
                    <br />
                    {/* 1) Meentai Tharkare sketting Ground, Yamuna Nagar, Nigadi-Booking sample case */}
                    <h3>
                      {" "}
                      <b>Application No. : </b>
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
                      {moment(
                        this?.props?.dataa?.fromDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}{" "}
                      <b>To</b>{" "}
                      {moment(
                        this?.props?.dataa?.toDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}
                    </h3>

                    <h3>
                      <b> Time : </b>
                      {this?.props?.dataa?.selectedBookingSlots}
                    </h3>
                  </p>
                </p>
                <div>
                  <table className={styles.table}>
                    {/* {this.props.dataa.map((row) => (
                      <tr key={row.id}>
                        <td className={styles.table}>{row.id}</td>
                        <td className={styles.table}>{row.name}</td>
                        <td className={styles.table}>{row.value}</td>
                      </tr>
                    ))} */}
                    {/* <tr>
                      <td className={styles.table}></td>
                      <td className={styles.table}></td>
                      <td className={styles.table}></td>
                    </tr> */}
                  </table>
                  <br />
                  <p>
                    <b>Total Cash received Rs {this?.props?.sum}-/(रु)</b>
                  </p>
                </div>
                {/* <div className={styles.order}>
                  Application Fees = 20.00<br></br> Certificate/Document/Map
                  Fees = 150.00 <br></br>
                  ----------------------------------------------------
                  <br></br> Total Amount = 170.00 <br></br>Amount in Words = One
                  Hundred and Seventy Rupees Only/--
                </div> */}
              </p>
              <div className={styles.bottomContainer}>
                {/* <div className={styles.enquiry}>
                  <div>
                    <b>For Contact :- Mobile No:-9999999999</b>
                  </div>
                  <div>
                    <b>email:-enquiry@pcmcindia.gov.in</b>
                  </div>
                </div> */}

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
              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>Pimpri Chinchwad Municipal Corporation </h5>
                  <h5>Mumbai-Pune Highway Pimpri, Pune</h5>
                  <h5>Maharashtra, India</h5>
                </div>
                <div className={styles.add1}>
                  <h5>Phone Number:91-020-2742-5511/12/13/14</h5>
                  <h5>
                    email: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5>
                </div>
                <div className={styles.logo}>
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
                </div>
                <div className={styles.logo}>
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
