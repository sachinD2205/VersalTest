import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "./AppointmentScheduleRecipt.module.css";
import moment from "moment";
import swal from "sweetalert";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { language } from "../../../../../features/labelSlice";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { useSelector } from "react-redux";

const index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    router.push({ pathname: "/homepage" });
  };
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
const [siteVisitData,setsiteVisitData]=useState()
const userToken = useGetToken();
console.log("eeeeee",router.query);
//get info
const getAppointmentInfo = () => {
  console.log("caledddddd");
   
     if(router.query.serviceName=="Road Excavation And NOC Permission"&&router?.query?.applicationNumber){
    axios
    .get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getByApplicationNo?applicationNo=${router?.query?.applicationNumber}`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((r) => {
        console.log("rrrrrrrraaa", r?.data?.trnExcavationRoadCpmpletionList[0].appointmentScheduleRescheduleDao);
        setsiteVisitData(r?.data?.trnExcavationRoadCpmpletionList[0]?.appointmentScheduleRescheduleDao)
        // setZoneWardKeys(r.data)
        // setZoneWardKeys(
        //   r.data.map((row) => ({
        //     id: row.id,
        //     wardName: row.wardName,
        //     wardNameMr: row.wardNameMr,
        //   })),
        // )
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    
    }else if(router.query.serviceId==139 && router?.query?.applicationNumber){
    axios
    .get(`${urls.RENPURL}/nocPermissionForMaintenance/getByApplicationNo?applicationNo=${router?.query?.applicationNumber}`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((r) => {
        console.log("rrrrrrrraaa", r?.data?.nocPermissionForMaintenanceDaoList[0]?.appointmentScheduleReschedule);
        setsiteVisitData(r?.data?.nocPermissionForMaintenanceDaoList[0]?.appointmentScheduleReschedule)
       
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    
    }
  };

//   useEffect(()=>{
//     let date =siteVisitData.siteVisitDate
//   },[])
//   console.log("query",siteVisitData?.siteVisitDate);

  useEffect(()=>{
    getAppointmentInfo()
  },[router?.query?.applicationNumber])

  // view
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} siteVisitData={siteVisitData} />
      </div>
      <br />

      <div className={styles.btn}>
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

class ComponentToPrint extends React.Component {
  render() {
    console.log("this",this?.props?.siteVisitData)

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
              <div className={styles.middle}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                {/* <h4>
                  {' '}
                  <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
                </h4>

                <h4>
                  {' '}
                  <b>महाराष्ट्र, भारत</b>
                </h4> */}
              </div>
              <div className={styles.logo}>
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                <b>अपॉइंटमेंट बुकिंग</b>
                
              </h2>
            </div>

            <div className={styles.two}>
              {/* <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>टोकन क्रमांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>{router?.query?.tokenNo}</b>
                  </h4>
                </div>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>दिनांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b> {" " + moment(router?.query?.appointmentDate, "YYYY-MM-DD").format("DD-MM-YYYY")}</b>{" "}
                  </h4>
                </div>

                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>वेळ :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {router?.query?.appointmentFromTime} - {router?.query?.appointmentToTime}
                  </h4>
                </div>
              </div> */}

              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    <b>अर्जाचा क्रमांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{router?.query?.applicationNumber}</h4>
                </div>
              </div>

              <div className={styles.date4} style={{}}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>अर्ज दिनांक : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b> {" " + moment(router?.query?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}</b>{" "}
                  </h4>
                </div>
              </div>

              {/* <div className={styles.date4} style={{}}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>अर्जदाराचे नाव : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{router?.query?.applicantNameMr}</h4>
                </div>
              </div> */}

              <div style={{ marginTop: "2vh", marginLeft: "5vh", marginRight: "5vh" }}>
                <h4>
                  <b>प्रिय {router?.query?.applicantNameMr} ,</b>
                  <b>
                    <br />
                    तुमचा {router?.query?.serviceNameMr} अर्ज प्राप्त झाला आहे आणि साइट भेट नियोजित आहे .
                  </b>
                    <br />
                  <b>
                    
                  अपॉइंटमेंट तारीख  
                    {" " + moment(this?.props?.siteVisitData?.siteVisitDate, "YYYY-MM-DD").format("DD-MM-YYYY")}{" "}
                   
                  </b>{" "}
                    <br />
                  <b>
                    
                  अपॉइंटमेंट वेळ {moment(this?.props?.siteVisitData?.fromTime,"HH:mm:ss").format("hh:mm A")}  ते {moment(this?.props?.siteVisitData?.toTime,"HH:mm:ss").format("hh:mm A")}
                   
                  </b>{" "}
                  <br />
                  <b>
                   
                  सर्वेक्षकाचे नाव : {this?.props?.siteVisitData?.jeName}  
                   
                  </b>{" "}
                  &nbsp;
                  <b>
                    <br />
                    
                  </b>
                  <b>
                    पिंपरी चिंचवड महानगरपालिका विभागीय कार्यालय आपल्यासेवेस तत्पर आहे ,धन्यवाद.!!
                  </b>
                </h4>
              </div>

              <hr />

              <div className={styles.add}>
                <h5>पिंपरी चिंचवड महानगरपालिका </h5>
                <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                <h5> महाराष्ट्र, भारत</h5>
              </div>

              <div className={styles.add1}>
                <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default index;
