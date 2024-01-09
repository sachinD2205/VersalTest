import { Button } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import router from "next/router"
import styles from "./press.module.css"
import axios from "axios"
import urls from "../../../../URLS/urls"
import swal from "sweetalert"
import moment from "moment"
import { useSelector } from "react-redux"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const componentRef = useRef()

  const userToken = useGetToken()
  const language = useSelector((state) => state?.labels.language);

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
  console.log("service123", approvalId)
  const user = useSelector((state) => state.user.user)
  // console.log("user", user);
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

  useEffect(() => {
    axios
      .get(
        `${urls.NRMS}/trnPressNoteRequestApproval/getById?id=${router?.query?.id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        let result = r?.data

        console.log("getAllTableData", result)

        setSelectedObject(result)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }, [router?.query?.id])

  console.log("selectedobject", selectedObject)

  return (
    <>
      <div>
        <ComponentToPrint selectedObject={selectedObject} ref={componentRef} />
      </div>
      <br />

      <div className={styles.btn}>
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
            router.push(
              "/newsRotationManagementSystem/transaction/pressNoteRelease"
            )
          }}
        >
          Exit
        </Button>
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
                <h2>
                  <b>पिंपरी चिंचवड महानगरपालिका, पिंपरी,पुणे</b>
                </h2>
                <h3>
                  <b>माहिती व जनसंपर्क विभाग </b>
                </h3>
                {/* <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>दुरध्वनी क्रमांक:020-67333333/1528/1534</b>
                    </h5>
                    <h5>
                      <b>E-mail :pro@pcmcindia.gov.in</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फॅक्स क्रमांक:27425600</b>
                    </h5>
                    <h5>
                      <b> इमेल: egov@pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div> */}
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
              <hr />
            </div>

            <div className={styles.date4} style={{ marginTop: "2vh" }}>
              <div className={styles.date3}>
                <h4 style={{ marginRight: "4vh" }}>
                  <b>
                    प्रेस प्रकाशन ऑर्डर क्रमांक:{" "}
                    {this?.props?.selectedObject?.pressNoteRequestNo}
                  </b>
                </h4>{" "}
              </div>
            </div>
            <div className={styles.two}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginRight: "4vh" }}>
                    <b>
                      <b>पिंपरी चिंचवड महानगरपलिका </b>
                    </b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date4} style={{}}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>
                      <h4 style={{ marginRight: "4vh" }}>
                        <b>
                          <b>माहिती व जनसंपर्क विभाग </b>
                        </b>
                      </h4>{" "}
                    </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b></b>{" "}
                  </h4>
                </div>
              </div>

              {/* subject */}

              <div className={styles.date5} style={{ marginBottom: "2vh" }}>
                <div className={styles.date6}>
                  <h4 style={{ marginLeft: "4vh", justifyContent: "center" }}>
                    {" "}
                    <b>विषय:-नोटीस प्रसिद्धीबाबात</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b></b> {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              <div className={styles.date5} style={{ marginBottom: "2vh" }}>
                <div className={styles.date6}>
                  <h4 style={{ marginLeft: "4vh" }}>
                    <b>
                      {" "}
                      {/* {this?.props?.selectedObject?.pressNoteSubject} */}
                      दिनांक :{" "}
                      {moment(
                        this?.props?.selectedObject?.pressNoteReleaseDate,
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")}{" "}
                    </b>
                    <br />
                    <br />
                    <b>{this?.props?.selectedObject?.pressNoteSubject}:-</b>
                    {/* <br /> */}
                    {this?.props?.selectedObject?.pressNoteDescription}
                  </h4>
                </div>
              </div>

              <div className={styles.lastBotm} style={{ marginBottom: "2vh" }}>
                <div className={styles.date6}>
                  <h4 style={{ marginLeft: "80px" }}>
                    <b>जनता संपर्क अधिकारी</b>
                  </h4>
                </div>
              </div>
              {/* <hr /> */}
              {/* <div className={styles.border}>
                 <div className={styles.three} style={{ marginLeft: "2vh", padding: "2vh" }}>
                  {this?.props?.selectedObject?.pressNoteRequestApprovalAttachment.map((item, index) => {
                    return (
                      <>
                        <div>
                          <img
                            src={`${urls.CFCURL}/file/preview?filePath=${item.filePath}`}
                            height={300}
                            width={500}
                          ></img>
                        </div>
                      </>
                    );
                  })}
                </div> 
              </div>*/}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Index
