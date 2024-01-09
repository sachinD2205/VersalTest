import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";

import router from "next/router";
import styles from "../goshwara.module.css";
import axios from "axios";
// import urls from "../../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { ToWords } from "to-words";
import urls from "../../../../../URLS/urls";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { useSelector } from "react-redux";

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = ({ connectionData, usageType, ownership, slumName, villageName, componentRef }) => {
    const backToHomeButton = () => {
        history.push({ pathname: "/homepage" });
    };
    const [dataSource, setDataSource] = useState();
    const [finalTotalAmount, setfinalTotalAmount] = useState("");
    const [receiptDate, setreceiptDate] = useState("");
    const [receiptNo, setreceiptNo] = useState("");
    const [applicationNumber, setapplicationNumber] = useState("");
    const [fullName, setfullName] = useState("");
    const language = useSelector((state) => state?.labels.language);
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
    const userToken = useGetToken();
    //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
    const getSingleApplicationData =(id)=>{
        console.log("caleddfff");
        if(id){
            if(router.query.serviceId==139){
        axios
        .get(`${urls.RENPURL}/nocPermissionForMaintenance/getDataById?id=${id}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }).then((r) => {
          let result = r.data;
          setDataSource(result)
       
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    }else{
        axios
        .get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getDataById?id=${id}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }).then((r) => {
          let result = r.data;
          setDataSource(result)
       
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    }
}
    }
console.log("dataqqqq",dataSource);
    useEffect(()=>{
    //     setfullName(`${dataSource?.firstName} ${dataSource?.middleName} ${dataSource?.lastName}`)
    // setapplicationNumber(dataSource?.applicationNumber)
    // setreceiptNo(dataSource?.trnPaymentCollectionDao?.receiptNo)
    // setreceiptDate(dataSource?.trnPaymentCollectionDao?.receiptDate)
    // setfinalTotalAmount(dataSource?.trnLoiDao?.finalTotalAmount)
    },[dataSource])
    useEffect(() => {
        getSingleApplicationData( router.query.id)
        
      }, [router.query.id]);
//print start
const componentRef1 = useRef();
const handleGenerateButton1 = useReactToPrint({
  content: () => componentRef1.current,
});
  //print end
    // view
    return (
        <>
            <div>
                <ComponentToPrintOfficialNotesheet
                    connectionData={connectionData}
                    slumName={slumName}
                    usageType={usageType}
                    ownership={ownership}
                    villageName={villageName}
                    ref={componentRef1}
                    dataSource={dataSource}
                    serviceId={router.query.serviceId}
                />
            </div>
            <br />

            <div className={styles.btn}>
                <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                    onClick={handleGenerateButton1}
                >
                    print
                </Button>

                {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                >
                    Digital Signature
                </Button> */}

                <Button
                    type="primary"
                    variant="contained"
                    onClick={() => {
                        router.push(`/dashboard`);
                    }}
                >
                    Exit
                </Button>
            </div>
        </>
    );
};

class ComponentToPrintOfficialNotesheet extends React.Component {
    render() {
        const toWords = new ToWords({ localeCode: "mr-IN" });
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let serviceId = this.props.serviceId

        return (
            <>

                {/* <div className={styles.main}> */}

                    {/* <div className={styles.small}>

                        <div className={styles.one} style={{ marginLeft: "80px", marginRight: "80px" }}>

                            <div className={styles.logo}>
                                <div>
                                    <img src="/logo.png" alt="" height="150vh" width="150vw" />
                                </div>


                            </div>
                            <div><h1 style={{ marginTop: "80px",marginLeft: "80px" }}>
                            <FormattedLabel id="pcmc" />
                            <br/>
                            <h4 style={{ marginTop: "20px",marginLeft: "50px" }}>

                            <FormattedLabel id="receipt" />
                            </h4>

                                </h1></div>
                           

                        </div>
                       



                        <div style={{ margin: "10px",border: "2px solid" ,padding:"20px"}}>
                            <div className={styles.one}>
                                <div> <h3><FormattedLabel id="receiptNo" />: {this.props.dataSource?.trnPaymentCollectionDao?.receiptNo}</h3></div>
                                <div> <h3><FormattedLabel id="date" /> : {this.props.dataSource?.trnPaymentCollectionDao?.receiptDate}</h3></div>

                            </div>
                                <div>
                                    <h3> <FormattedLabel id="applicationNumber" /> {this.props.dataSource?.applicationNumber} </h3>
                                    <h3> <FormattedLabel id="name" /> : {`${this.props.dataSource?.firstName} ${this.props.dataSource?.middleName} ${this.props.dataSource?.lastName}`} </h3>
                                    {
                                        serviceId==139 
                                        ?<h3> <FormattedLabel id="totalAmount" /> : Rs.{this.props.dataSource?.trnLoiDao?.amount} </h3>
                                    :<h3> <FormattedLabel id="totalAmount" /> : Rs.{this.props.dataSource?.trnLoiDao?.finalTotalAmount} </h3>
                                }
                                </div>

                                <div className={styles.contact} style={{ marginTop: "200px" }}>
                                    <b>Authority Signature</b><br></br>
                                    <b>Oficier, Municipal Corporation</b>
                                </div>
                        </div>




                    </div> */}
                {/* </div> */}
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
                <b>पावती</b>
                {/* <h5>(महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८)</h5> */}
              </h2>
            </div>

            <div className={styles.two}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>अर्जाचा क्रमांक :</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>{this.props.dataSource?.applicationNumber}</b>
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "0vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}> अर्ज दिनांक :</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                    {" "}
                      {moment(
                        this.props.dataSource?.trnPaymentCollectionDao?.receiptDate,
                        "YYYY-MM-DD HH:mm:ss A"
                      ).format("DD-MM-YYYY")}
                    </b>{" "}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "0vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}> अर्जदाराचे नाव :</h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                    {`${this.props.dataSource?.firstNameMr} ${this.props.dataSource?.middleNameMr} ${this.props.dataSource?.lastNameMr}`} 
                    </b>
                  </h4>
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  {/* <h4 style={{ marginLeft: "40px" }}>एकूण रक्कम :</h4>{" "} */}
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>
                    {
                                        serviceId==139 
                                        ?<h4> एकूण रक्कम : <b>रु.{this.props.dataSource?.trnLoiDao?.amount}</b> </h4>
                                    :<h4> एकूण रक्कम : <b>रु.{this.props.dataSource?.trnLoiDao?.finalTotalAmount} </b></h4>
                                }
                    </b>
                  </h4>
                </div>
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

export default Index;


