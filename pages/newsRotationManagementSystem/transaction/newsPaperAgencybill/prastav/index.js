import { Button } from "@mui/material"
import axios from "axios"
import html2pdf from "html2pdf-jspdf2"
import moment from "moment"
import router from "next/router"
import React, { useEffect, useRef, useState } from "react"
import ReactDOMServer from "react-dom/server"
import { useReactToPrint } from "react-to-print"
import { ToWords } from "to-words"
import urls from "../../../../../URLS/urls"
import styles from "./prastav.module.css"
import { Download, ExitToApp, Print } from "@mui/icons-material"
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../../util/util"
import { useSelector } from "react-redux"

const Index = () => {
  const componentRef = useRef()

  const userToken = useGetToken()
  const language = useSelector((state) => state?.labels.language)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }
  const toWords = new ToWords()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "final-bill.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    }

    const element = ReactDOMServer.renderToString(
      <ComponentToPrint data={data} ref={componentRef} />
    )
    // console.log("ggggggg", html2pdf().set(opt).from(element));
    let base64str
    html2pdf()
      .from(element)
      .toPdf()
      .set(opt)
      .output("datauristring")
      .then(function (pdfAsString) {
        // The PDF has been converted to a Data URI string and passed to this function.
        // Use pdfAsString however you like (send as email, etc)! For instance:
        console.log("pdfAsString", pdfAsString)
        var file = dataURLtoFile(pdfAsString, "final-bill.pdf")
        console.log(file)
        let formData = new FormData()
        formData.append("file", file)
        formData.append("appName", "NRMS")
        formData.append("serviceName", "N-BS")
        formData.append("fileName", "bill.pdf")
        axios
          .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            console.log(r.data.filePath)
          })
          .catch((error) => {
            callCatchMethod(error, language)
          })
      })
      .save()
  }

  const [data, setData] = useState()

  useEffect(() => {
    axios
      .get(
        `${
          urls.NRMS
        }/trnNewspaperAgencyBillSubmission/getById?id=${localStorage.getItem(
          "newspaperAgencyBillSubmissionId"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        let result = r.data
        console.log("result007", result)
        setData(result)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }, [])

  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
      </div>
      <br />
      <div className={styles.btn}>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<Download />}
          onClick={printHandler}
        >
          Download
        </Button>
        <Button
          endIcon={<Print />}
          variant="contained"
          sx={{ size: "23px" }}
          onClick={handlePrint}
        >
          Print
        </Button>
        <Button
          variant="outlined"
          color="error"
          endIcon={<ExitToApp />}
          onClick={() => {
            router.push({
              pathname:
                "/newsRotationManagementSystem/transaction/newsPaperAgencybill/create",
              query: {
                id: localStorage.getItem("newspaperAgencyBillSubmissionId"),
                pageMode: localStorage.getItem("pageMode"),
              },
            })
            localStorage.removeItem("newspaperAgencyBillSubmissionId")
            localStorage.removeItem("pageMode")
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
    const toWords = new ToWords({ localeCode: "mr-IN" })
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.two}>
              <div className={styles.date7} style={{ marginBottom: "" }}>
                <div className={styles.date8}>
                  <h4
                    style={{
                      marginTop: "1vh",
                      marginLeft: "1vh",
                      marginRight: "1vh",
                    }}
                  >
                    {" "}
                    <b>प्रस्ताव, </b>
                  </h4>{" "}
                  <div
                    className={styles.add7}
                    style={{ lineHeight: "1", marginTop: "1vh" }}
                  >
                    <h4>माहिती व जनसंपर्क विभाग,टेबल क्र. </h4>
                    <h4>
                      दिनांक-
                      {moment(
                        this?.props?.data?.createDtTm,
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")}
                    </h4>
                  </div>
                </div>
              </div>

              {/* subject */}
              <div className={styles.date8} style={{ marginBottom: "" }}>
                <div className={styles.date6}>
                  <h4 style={{ marginLeft: "40px", fontSize: "small" }}>
                    {" "}
                    <b>विषय-</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px", fontSize: "small" }}>
                    <b>
                      {
                        this?.props?.data?.newsPublishRequestDao
                          ?.departmentNameMr
                      }{" "}
                      विभागाकडील निविदा नोटीस क्र.46/2022-23 चे शुद्धीपत्रक
                      क्र.1 चे जाहिरात प्रसिध्दीचे बिल अदा करणेबाबत. जाहिरात
                      क्रमांक{" "}
                      {
                        this?.props?.data?.newsPublishRequestDao
                          ?.newsPublishRequestNo
                      }
                      {". "}
                      {
                        this?.props?.data?.newsPublishRequestDao
                          ?.newsPapersNamesMr
                      }
                    </b>{" "}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "60px", fontSize: "small" }}>
                    {" "}
                    <b>मा.स.सादर, </b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "" }}>
                <div
                  className={styles.date2}
                  style={{ lineHeight: "1" /* , fontSize: "small" */ }}
                >
                  <p style={{ marginLeft: "40px", marginRight: "40px" }}>
                    {" "}
                    पिंपरी चिंचवड महानगरपालिकेच्या
                    {this?.props?.data?.departmentNameMr} विभागाकडील निविदा
                    नोटीस क्र. {/* 46/2022-23 */} चे शुद्धीपत्रक क्र. संबंधित
                    जाहिरात प्रसिध्द करणेकामी
                    {"                "}
                    {/* 3 */} अन्वये कळविले होते. त्यानुसार माहिती व जनसंपर्क
                    विभाग,पिंपरी चिंचवड मन्पामार्फात आदेश क्र.
                    {"                "}
                    दिनांक {/* 4 */} च्या{" "}
                    {this?.props?.data?.newsPublishRequestDao?.newsPublishDate}{" "}
                    प्रसिद्धी आदेशान्वये दिनांक रोजी प्रसिद्धीसाठी,
                    {this?.props?.data?.departmentNameMr}
                    विभागाकडील निविदा नोटीस क्र. {/* 46/2022-23 */} चे
                    शुद्धीपत्रक क्र. संबधित जाहिरात क्र नुसार
                    {
                      this?.props?.data?.newsPublishRequestDao
                        ?.newsPapersNamesMr
                    }{" "}
                    या वर्तमानपत्राचे जाहिरात व्यवस्थापक यांना कळविण्यात आले
                    होते. त्यांनी जाहिरात {this?.props?.data?.newsPaperLevelMr}{" "}
                    प्रसिध्द करुन बिल सादर केले आहे,त्याचा तपशील पुढीलप्रमाणे
                  </p>{" "}
                </div>
              </div>

              <div className={styles.date9} style={{ marginTop: "" }}>
                <div className={styles.date10}>
                  <table className={styles.table}>
                    <tr className={styles.heading}>
                      <th className={styles.h1}>अ.क्रं. </th>
                      <th>वर्तमान पत्राचे नांव / बिल अदा करणार ते नाव</th>
                      <th>प्रसिद्धी दिनांक</th>
                      <th>जाहिरात चौ.से.मी. आकारमान</th>
                      <th>मंजूर दर प्र. से.मी.</th>
                      <th>एकुण र.रू.</th>
                    </tr>
                    {this?.props?.data?.prePaymentDetails?.map((row, index) => (
                      <tr key={index} className={styles.row}>
                        <td>{index + 1}</td>
                        <td> {row.newsPaperNameMr}</td>

                        <td>
                          {" "}
                          {moment(
                            this?.props?.data?.newsPublishRequestDao
                              ?.newsPublishDate,
                            "YYYY-MM-DD"
                          ).format("DD-MM-YYYY")}
                        </td>

                        <td> {row?.standardFormatSize}</td>

                        <td>
                          {/* ₹. */} {row?.calculatedRate}{" "}
                        </td>

                        <td>
                          {/* ₹. */} {row?.totalAmount}/-
                        </td>
                      </tr>
                    ))}
                    <tr className={styles.heading2}>
                      <th
                        colSpan={5}
                        style={{ textAlign: "end", paddingRight: "10px" }}
                      >
                        एकूण रू.:
                      </th>
                      <th>{this?.props?.data?.preTotalAmount}</th>
                    </tr>
                    <tr className={styles.heading2}>
                      <th
                        colSpan={5}
                        style={{ textAlign: "end", paddingRight: "10px" }}
                      >
                        अक्षरी रुपये:
                      </th>
                      <th>
                        {toWords?.convert(
                          this?.props?.data?.preTotalAmount ?? 0
                        )}
                      </th>
                    </tr>
                  </table>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "" }}>
                <div
                  className={styles.date2}
                  style={{ lineHeight: "1" /* , fontSize: "small"  */ }}
                >
                  <p style={{ marginLeft: "40px", marginRight: "40px" }}>
                    उक्त नमुद केल्याप्रमाणे बिल प्राप्त झाले असून दै.सकाळ, दै.आज
                    का आनंद या वर्तमानपत्रांनी जाहिरात{" "}
                    {this?.props?.data?.paymentDetails[0]?.standardFormatSize}{" "}
                    चौ.से.मी. या कमीत कमी आकारमानात प्रसिध्द केलेली आहे. रोटेशन
                    धोरण परिपत्रक क्र.माजसं/2/कावि/358/2022 दिनांक 13/08/2022
                    मधील अटींनुसार जाहिरात क्रमांक{" "}
                    {
                      this?.props?.data?.newsPublishRequestDao
                        ?.newsPublishRequestNo
                    }{" "}
                    चे मंजुर दराने मनपा नियम/ धोरण/ परिपत्रकानुसार बिल देय
                    रक्कमेमधुन दंड/ आयकर/ इतर वजावट कपात करुन खालील प्रमाणे बिल
                    अदा करणे आवश्यक आहे.
                  </p>
                </div>
              </div>

              <div className={styles.date9} style={{ marginTop: "" }}>
                <div className={styles.date10}>
                  <table className={styles.table}>
                    <tr className={styles.heading}>
                      <th className={styles.h1}>अ.क्रं. </th>
                      <th>वर्तमान पत्राचे नांव / बिल अदा करणार ते नाव</th>
                      <th>प्रसिद्धी दिनांक</th>
                      <th>वास्तविक स्वरूप चौ.से.मी. आकारमान</th>
                      <th>जाहिरात चौ.से.मी. आकारमान</th>
                      <th>मंजूर दर प्र. से.मी.</th>
                      <th>एकुण र.रू.</th>
                      <th>वजा दंड र.रू.</th>
                      <th>वजा टी.डी.एस र.रू.</th>
                      <th>निव्वळ देय र. रू.</th>
                    </tr>
                    {this?.props?.data?.paymentDetails?.map((row, index) => (
                      <tr key={index} className={styles.row}>
                        <td>{index + 1}</td>
                        <td> {row.newsPaperNameMr}</td>
                        <td>
                          {" "}
                          {moment(
                            this?.props?.data?.newsPublishRequestDao
                              ?.newsPublishDate,
                            "YYYY-MM-DD"
                          ).format("DD-MM-YYYY")}
                        </td>
                        <td> {row?.actualFormatSize}</td>
                        <td> {row.standardFormatSize}</td>
                        <td>
                          {/* ₹. */} {row?.calculatedRate}{" "}
                        </td>
                        <td>
                          {/* ₹. */} {row?.totalAmount}/-
                        </td>
                        <td>
                          {/* ₹. */} {row?.totalDeduction}/-
                        </td>
                        <td>
                          {/* ₹. */} {row?.totalTaxDeduction}/-
                        </td>
                        <td>
                          {/* ₹. */} {row?.totalNetAmount}/-
                        </td>
                      </tr>
                    ))}
                    <tr className={styles.heading2}>
                      <th
                        colSpan={5}
                        style={{ textAlign: "end", paddingRight: "10px" }}
                      >
                        एकूण रू.:
                      </th>
                      <th>{this?.props?.data?.totalAmount}</th>
                      <th>{this?.props?.data?.totalPenalty}</th>
                      <th>{this?.props?.data?.totalTDS}</th>
                      <th>{this?.props?.data?.totalNetAmount}</th>
                    </tr>

                    <tr>
                      {/* <td colSpan={12}></td> */}

                      {/* <td rowSpan={6}>अक्षरी रुपये:</td> */}
                      <td
                        colSpan={5}
                        style={{ textAlign: "end", paddingRight: "10px" }}
                      >
                        <b>अक्षरी रुपये:</b>
                      </td>

                      <td
                        colSpan={4}
                        className={styles.heading11}
                        style={{ textAlign: "left", paddingLeft: "10px" }}
                      >
                        <b>
                          {toWords?.convert(
                            Number(this?.props?.data?.totalNetAmount ?? 0)
                          )}
                        </b>
                      </td>

                      {/* <td rowSpan={6}></td> */}

                      {/* <td rowSpan={6} style={{ marginLeft: "4vh" }}>
                        अक्षरी रुपये:
                        {toWords.convert(
                          Number(
                            this?.props?.data?.totalAmount == undefined ? 0 : this?.props?.data?.totalAmount,
                          ),
                        )}
                      </td> */}
                    </tr>
                  </table>
                  {/* <table className={styles.table}>
                    <tr className={styles.heading2}>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>एकूण रू.</th>
                      <th>-</th>
                      <th>-</th>
                      <th>{this?.props?.data?.totalAmount}</th>
                    </tr>
                  </table>
                  <table className={styles.table}>
                    <tr className={styles.heading1}>
                      <th style={{ marginLeft: "4vh" }}>
                        अक्षरी रुपये:
                        {toWords.convert(
                          Number(
                            this?.props?.data?.totalAmount == undefined ? 0 : this?.props?.data?.totalAmount,
                          ),
                        )}
                      </th>
                    </tr>
                  </table> */}
                </div>
              </div>

              {/* Penalties for newspapers */}
              <div style={{ margin: "0px 40px" }} className={styles.penalties}>
                {this?.props?.data?.prePaymentDetails?.filter(
                  (f) => f.trnPenaltyDeductionDaoList?.length > 0
                )?.length > 0 && (
                  <>
                    <b style={{ color: "red" }}>दंड कपातीचे तपशील: </b>
                    <ol>
                      {this?.props?.data?.prePaymentDetails?.map(
                        (newspaper) => {
                          return (
                            !!newspaper?.trnPenaltyDeductionDaoList && (
                              <>
                                <li>
                                  <b>{newspaper["newsPaperNameMr"]}</b>
                                  {": " +
                                    newspaper?.trnPenaltyDeductionDaoList
                                      ?.map(
                                        (penalty) =>
                                          (!!penalty?.description
                                            ? penalty?.description
                                            : penalty?.pointDescMr) +
                                          " (रु. " +
                                          penalty?.amount +
                                          ")"
                                      )
                                      .join(", ")}
                                </li>
                              </>
                            )
                          )
                        }
                      )}
                    </ol>
                  </>
                )}
              </div>

              {/* details */}
              <div className={styles.date4} style={{ marginBottom: "" }}>
                <div
                  className={styles.date2}
                  style={{ lineHeight: "1" /* , fontSize: "small" */ }}
                >
                  <p style={{ marginLeft: "40px", marginRight: "40px" }}>
                    उपरोक्त प्रस्तावित केल्यानुसार संबधित वर्तमानपत्राने जहिरात
                    प्रसिध्द केलेली असल्याने त्यांना बिल अदा करणे आवश्यक आहे.
                    धोरणात्मक बाबी, अटी- शर्ती व नियमानुसार आयकर कपात करून
                    त्यांच्या नावासमोरील एकूण प्रदानार्थ मंजूर रक्कम रु.
                    {this?.props?.data?.totalAmount}/- यामधुन वजा दंड रक्कम रु.
                    {this?.props?.data?.totalPenalty}
                    /- व २% आयकर रक्कूम रु.
                    {this?.props?.data?.totalTDS}/- कपात करुन उर्वरित रक्कम रु.
                    {this?.props?.data?.totalNetAmount}/- (अक्षरी रक्कम रु.
                    {toWords.convert(
                      Number(
                        this?.props?.data?.totalNetAmount == undefined
                          ? 0
                          : this?.props?.data?.totalNetAmount
                      )
                    )}
                    ) अदा करण्याचे बिल व आदेशाचे प्रारुप सादर केले आहे. सदरचा
                    प्रस्ताव मान्य असल्यास आदेशार्थ स्वाक्षरीकामी सादर आहे.
                  </p>{" "}
                </div>
              </div>

              <div className={styles.date7} style={{ marginBottom: "2vh" }}>
                <div className={styles.date8}>
                  <div className={styles.add7} style={{ lineHeight: "1" }}>
                    <h5>उपायुक्त</h5>
                    <h5>माहिती व जनसंपर्क विभाग</h5>
                    <h5>पिंपरी चिंचवड महानगरपालिका</h5>
                    <h5>पिंपरी ४११ ०१८</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Index
