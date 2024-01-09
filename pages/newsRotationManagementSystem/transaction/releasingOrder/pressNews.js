import { Button } from "@mui/material"

import React, { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

import router from "next/router"
import styles from "./cuttingNews.module.css"
import axios from "axios"
import urls from "../../../../URLS/urls"
import swal from "sweetalert"
import moment from "moment"
import { useSelector } from "react-redux"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = () => {
  const componentRef = useRef()

  const userToken = useGetToken()
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
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" })
  }
  const [dataa, setDataa] = useState(null)
  const [selectedObject, setSelectedObject] = useState()
  const [work, setWork] = useState()

  let approvalId = router?.query?.id
  console.log("service123", router?.query?.id)
  useEffect(() => {
    // getWard();

    getAllPressData()
  }, [])
  useEffect(() => {})

  const user = useSelector((state) => state.user.user)

  // console.log("user", user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  )

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer)

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer
  })?.roles

  console.log("authority", authority)

  const getAllPressData = () => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnPaperCuttingBook/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log(";rressss", r)
        let result = r.data.trnPaperCuttingBookList
        console.log("getAllTableData", result)
        let press = result.map((r, i) => {
          console.log("4e455555", r)
          console.log("selectedobject", result)
        })
        result &&
          result.map((each) => {
            if (each.id == approvalId) {
              setSelectedObject(each)
            }
          })
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }
  console.log("sSelectedObject", selectedObject)

  console.log("selsadfdectedobject", selectedObject?.pressDescription)
  return (
    <>
      <div>
        <ComponentToPrint selectedObject={selectedObject} ref={componentRef} />
      </div>
      <br />

      <div className={styles.btn}>
        {authority && authority[0] === "RTI_APPEAL_ADHIKARI" ? (
          <>
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
                swal(
                  "Exit!",
                  "जारी केलेल्या प्रमाणपत्र प्रत घेण्यास झोन ऑफिस ला भेट दया",
                  "success"
                )

                router.push({
                  pathname:
                    "/newsRotationManagementSystem/transaction/paperCuttingBook/approval",
                })

                // router.push(`/newsRotationManagementSystem/transaction/newsAdvertisementRotation/view`)
              }}
            >
              Exit
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              sx={{ size: "23px" }}
              type="primary"
              //
              onClick={() => {
                const record = selectedObject

                router.push({
                  pathname:
                    "/newsRotationManagementSystem/transaction/paperCuttingBook/",
                  query: {
                    pageMode: "View",
                    ...record,
                  },
                }) // router.push(`/newsRotationManagementSystem/transaction/newsAdvertisementRotation/view`)
              }}
            >
              Exit
            </Button>
          </>
        )}
        {authority && authority[0] === "ENTRY" ? (
          <>
            <Button
              variant="contained"
              sx={{ size: "23px" }}
              type="primary"
              onClick={handlePrint}
            >
              Download
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

class ComponentToPrint extends React.Component {
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
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका </b>
                    </h5>
                    <h5>
                      {" "}
                      <b>मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</b>
                    </h5>
                    <h5>
                      <b> महाराष्ट्र, भारत</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फोन क्रमांक:91-020-2742-5511/12/13/14</b>
                    </h5>
                    <h5>
                      <b> इमेल: egov@pcmcindia.gov.in</b>
                    </h5>
                    <h5>
                      <b>/ sarathi@pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div>

                {/* <div className={styles.foot}>
               
               
                
              </div> */}
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
                {/* <b>पावती</b> */}
                <h5>
                  {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div >
                  <h4>
                    {' '}
                    <b>दिनांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>{this?.props?.dataa?.payment?.receiptDate}</b>
                  </h4>
                </div>

                <div >
                  <h4>
                    {' '}
                    <b>वेळ :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {this?.props?.dataa?.payment?.receiptTime}
                  </h4>
                </div>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: '40px' }}>
                  {' '}
                  <b>पावती क्रमांक :</b>
                </h4>{' '}
                <h4 style={{ marginLeft: '10px' }}>
                  <b>{this?.props?.dataa?.payment?.receiptNo}</b>
                </h4>
              </div> */}

              {/* subject */}

              <div className={styles.date5} style={{ marginBottom: "2vh" }}>
                <div className={styles.date6}>
                  <h1 style={{}}>
                    {" "}
                    <b>वृत्तपत्र कात्रन </b>
                  </h1>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {/* {' ' +
                                                moment(
                                                    this?.props?.selectedObject?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              {/* 
                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <h4 style={{ marginLeft: '40px' }}>
                                        {' '}
                                        <b>अर्जदाराचे नाव : </b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}>
                                        {' ' +
                                            this?.props?.dataa?.afNameMr +
                                            ' ' +
                                            this?.props?.dataa?.alNameMr}
                                    </h4>
                                </div>
                            </div> */}

              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h3 style={{ marginLeft: "30px" }}>
                    <ul>
                      <li>
                        <b>वृत्तपत्राचे नाव :</b>
                      </li>
                    </ul>
                  </h3>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.newspaperName}
                  </h4>
                  <h4 style={{ marginLeft: "250px" }}>
                    <ul>
                      <li>
                        <b> दिनांक :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h3 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.createDtTm.split("T")[0]}
                  </h3>
                  {/* {console.log("XCV",priority)} */}
                </div>
              </div>

              {/* department name */}

              <div className={styles.border}>
                <div
                  className={styles.date4}
                  style={{ margin: "1vh", width: "600px" }}
                >
                  <h4
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    {/* <b>{this?.props?.selectedObject?.pressHeading} </b> */}
                  </h4>
                  <h3 style={{ marginLeft: "10px" }}>
                    {" "}
                    <b>{this?.props?.selectedObject?.heading}: </b>
                    {this?.props?.selectedObject?.description}
                  </h3>
                </div>
                <div>
                  <div
                    className={styles.three}
                    style={{ marginLeft: "2vh", padding: "20px" }}
                  >
                    <img
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.selectedObject?.attachement}`}
                      height={300}
                      width={500}
                    ></img>
                  </div>
                  {/* details */}
                </div>
              </div>
              <div style={{ margin: "1vh", textAlign: "center" }}>
                {" "}
                Press Not
              </div>
              {/* details */}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Index
