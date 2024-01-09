import { Button, Paper } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import axios from "axios"
import moment from "moment"
import router from "next/router"
import swal from "sweetalert"
// import urls from "../../../../../../URLS/urls";
import styles from "./goshwara.module.css"
import urls from "../../../../../URLS/urls"
import { red } from "@mui/material/colors"
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../../util/util"

const Index = () => {
  const componentRef = useRef()

  const userToken = useGetToken()
  const language = useSelector((state) => state?.labels.language);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
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
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" })
  }
  const [dataa, setDataa] = useState(null)

  useEffect(() => {
    axios
      .get(`${urls.NRMS}/trnPaperCuttingBook/getById?id=${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDataa(res.data)
        console.log("board data", res.data)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }, [])
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
                })
                router.push("/newsRotationManagementSystem/dashboard")
              } else {
                swal("Record is Safe")
              }
            })
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
        <Paper
          elevation={0}
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "1000px",
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
                  <h1>
                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                  </h1>
                  <h2>
                    {" "}
                    <b>माहिती व जनसंपर्क विभाग </b>
                  </h2>

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
                  <b>वृत्तपत्र कात्रण</b>
                </h2>
              </div>

              <div className={styles.two}>
                <div
                  className={styles.date4}
                  style={{ marginTop: "2vh", marginLeft: "6vh" }}
                >
                  <div className={styles.date3}>
                    <h4 style={{ marginRight: "" }}>
                      {" "}
                      <b>वृतपत्रचे नाव :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {this?.props?.dataa?.newspaperName}
                    </h4>
                  </div>
                  <div className={styles.date3} style={{ marginRight: "5vh" }}>
                    <h4 style={{ marginLeft: "6vh" }}>
                      {" "}
                      <b>दिनांक :</b>
                    </h4>{" "}
                    <h4 style={{ marginLeft: "10px" }}>
                      {" " +
                        moment(
                          this?.props?.dataa?.createDtTm,
                          "YYYY-MM-DD HH:mm:ss A"
                        ).format("DD-MM-YYYY hh:mm A")}
                    </h4>
                  </div>
                </div>

                <div className={styles.kahipnB}>
                  <div className={styles.mainB}>
                    <div className={styles.oneB}>
                      {this?.props?.dataa?.paperCuttingAttachment.map(
                        (item, index) => {
                          return (
                            <div
                              style={{
                                margin: "1vh",
                                display: "inline",
                                background: "red",
                              }}
                            >
                              <img
                                src={`${urls.CFCURL}/file/preview?filePath=${item.filePath}`}
                                height={200}
                                width={200}
                              />
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                </div>

                <hr />
                <div className={styles.foot}>
                  <div className={styles.add}>
                    <h5>पिंपरी चिंचवड महानगरपालिका </h5>
                    <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  </div>
                  <div className={styles.add1}>
                    <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
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
    )
  }
}

export default Index
