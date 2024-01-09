import { Button } from "@mui/material"

import axios from "axios"
import html2pdf from "html2pdf-jspdf2"
import moment from "moment"
import router from "next/router"
import React, { useEffect, useRef, useState } from "react"
import ReactDOMServer from "react-dom/server"
import { useReactToPrint } from "react-to-print"
import urls from "../../../../URLS/urls"
import styles from "./payment.module.css"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"

import { ToWords } from "to-words"
import { catchExceptionHandlingMethod } from "../../../../util/util"

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
          .post(`${urls.CFCURL}/file/upload`, formData, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            console.log(r.data.filePath)
          })
          .catch((error) => {
            callCatchMethod(error, language);
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
        callCatchMethod(error, language);
      })
  }, [])

  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
      </div>
      <br />
      <div className={styles.btn}>
        <Button onClick={printHandler}>Download</Button>
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
            router.push({
              pathname:
                "/newsRotationManagementSystem/transaction/newsPaperAgencybill",
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
    const toWords = new ToWords({ localeCode: "mr-IN" })
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.two}>
              {/* <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>वाचले -</b>
                  </h4>{" "}
                  // <h4 style={{ marginLeft: "10px" }}> {this?.props?.data?.id} </h4>
                  // {console.log("XCV",priority)}
                </div>
              </div> */}

              {/* <div>
                <ol>
                  <li> माजसं/2/कावि/358/2019 दि. 13/08/2019 रोजीचे जाहिरात रोटेशन धोरणाचे परिपत्रक.</li>
                  <li> माजसं/2/कावि/1/2020 दि. 01/01/2020 रोजीचे जाहिरात सेल स्थापनेबाबतचे परिपत्रक.</li>
                  <li>
                    मध्यवर्ती भांडार विभागाकडील पत्र क्र.मभां/ 15/कावि/41/2021 दिनांक 10/02/2021 अन्वये मा.
                    माहिती व जनसंपर्क विभाग यांना जाहिरात प्रसिद्ध करणेकामी पत्र.
                  </li>
                  <li>
                    मा. माहिती व जनसंपर्क विभाग यांचे क्र.माजसं / 2 /कावि/ 56 / 2021 दिनांक 28/01/2021 चे दै.
                    सकाळ, दै. आज का आनंद चे जाहिरात व्यवस्थापक यांना दिलेले पत्र.
                  </li>
                  <li>
                    दै. सकाळ, दै. आज का आनंद यांचे अनुक्रमे बिल क्रमांक 20001030727, 12-02-2021 |
                    ADVTFEB104/2021, 12-02-2021 अन्वये जाहिरातचे बिल सादर 97
                  </li>
                  <li>मा. माहिती व जनसंपर्क विभाग यांचा दिनांक- / / 2021 रोजीचा मान्य प्रस्ताव.</li>
                </ol>
              </div> */}

              {/* horizontal line */}
              {/* <div> */}
              {/* <h2 className={styles.heading}> */}
              {/* <b>पावती</b> */}
              {/* <h5>(महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८)</h5> */}
              {/* </h2> */}
              {/* </div> */}

              <div className={styles.date7} style={{ marginBottom: "" }}>
                <div className={styles.date8}>
                  <div
                    className={styles.add7}
                    style={{ lineHeight: "1.2", marginTop: "1vh" }}
                  >
                    <h3>
                      <b>पिंपरी चिंचवड महानगरपालिका </b>
                      <b>पिंपरी-411018</b>
                    </h3>
                    <h4>माहिती व जनसंपर्क विभाग,</h4>
                    <h4>क्र.माजसं /5/कावि/391 / 2021</h4>
                    <h4>
                      दिनांक-
                      {/* {this?.props?.data?.createDtTm.split("T")[0]} */}
                      {moment(
                        this?.props?.data?.createDtTm,
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")}
                    </h4>
                  </div>
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {/* {' ' +
                                                moment(
                                                    this?.props?.data?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              {/* subject */}

              <div className={styles.date8} style={{ marginBottom: "" }}>
                <div className={styles.date6}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>विषय-</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
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

              <div className={styles.date4} style={{ marginBottom: "" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "60px" }}>
                    {" "}
                    <b>आदेश, </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {/* {' ' +
                                                moment(
                                                    this?.props?.data?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "" }}>
                <div
                  className={styles.date2}
                  style={{ lineHeight: "1.2", fontSize: "smaller" }}
                >
                  <p style={{ marginLeft: "40px", marginRight: "40px" }}>
                    {" "}
                    पिंपरी चिंचवड महानगरपालिकेच्या{" "}
                    {this?.props?.data?.departmentNameMr} विभागाकडील निविदा
                    नोटीस क्र. {/* 46/2022-23 */} चे शुद्धीपत्रक क्र.1 संबंधित
                    जाहिरात प्रसिध्द करणेकामी मध्यवर्ती भांडार विभाग यांनी
                    उपरोक्त वाचले क्रमांक {/* 3 */} अन्वये जाहिरात प्रसिध्द
                    करणेकामी पत्र दिले आहे. त्यास अनुसरुन माहिती व जनसंपर्क
                    विभाग यांनी वाचले क्रमांक {/* 4 */} अन्वये दिनांक{" "}
                    {this?.props?.data?.newsPublishRequestDao?.newsPublishDate}{" "}
                    रोजी जाहिरात प्रसिध्द करण्याबाबत
                    {
                      this?.props?.data?.newsPublishRequestDao
                        ?.newsPapersNamesMr
                    }{" "}
                    या वर्तमानपत्राचे जाहिरात व्यवस्थापक यांना कळविले आहे.
                    संबंधित वर्तमानपत्र यांनी जाहिरात राज्य स्तरावर प्रसिध्द
                    करुन वाचले क्रमांक 5 अन्वये बिल सादर केले आहे.
                  </p>{" "}
                  {/* <h4 style={{ marginLeft: "10px" }}> */}
                  {/* <b> */}
                  {/* {" "} */}
                  {/* {' ' +
                                                moment(
                                                    this?.props?.data?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                  {/* </b>{" "} */}
                  {/* </h4> */}
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
                      <th>वजा दंड र.रू.</th>
                      <th>वजा टी.डी.एस र.रू.</th>
                      <th>निव्वळ देय र. रू.</th>
                    </tr>
                    {console.log(
                      "this.props.data",
                      this?.props?.data?.paymentDetails
                    )}
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

                    <tr>
                      {/* <td colSpan={12}></td> */}

                      {/* <td rowSpan={6}>अक्षरी रुपये:</td> */}

                      <td colSpan={45} className={styles.heading11}>
                        <b>
                          अक्षरी रुपये:
                          {toWords.convert(
                            Number(
                              this?.props?.data?.totalAmount == undefined
                                ? 0
                                : this?.props?.data?.totalAmount
                            )
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

              {/* details */}
              <div className={styles.date4} style={{ marginBottom: "" }}>
                <div
                  className={styles.date2}
                  style={{ lineHeight: "1.2", fontSize: "smaller" }}
                >
                  <p style={{ marginLeft: "40px", marginRight: "40px" }}>
                    {" "}
                    उपरोक्त नमुद केल्याप्रमाणे विल प्राप्त झाले असून{" "}
                    {
                      this?.props?.data?.newsPublishRequestDao
                        ?.newsPapersNamesMr
                    }{" "}
                    या वर्तमानपत्राने जाहिरात{" "}
                    {
                      this?.props?.data?.newsPublishRequestDao
                        ?.standardFormatSizeNM
                    }{" "}
                    चौ.से.मी. या कमीत कमी आकारमानात प्रसिध्द केलेली आहे. रोटेशन
                    धोरण परिपत्रक {/* वाचले क्र.2 */} नुसार बिल अदा करणे आवश्यक
                    आहे. सबब, मी सहाय्यक आयुक्त, माहिती व जनसंपर्क विभाग, पिंपरी
                    चिंचवड महानगरपालिका, पिंपरी- 411018, उक्त तक्यात नमुद
                    केल्याप्रमाणे नियमानुसार कपाती करून प्रदानार्थ मंजूर रक्कम
                    रु.
                    {this?.props?.data?.totalAmount}/- यामधुन बजा दंड रक्कम रु.
                    {this?.props?.data?.totalDeduction}/- व 1.5% आयकर रक्कम रु.
                    {this?.props?.data?.totalTaxDeduction}/- कपात करुन उर्वरित
                    रक्कम रु.
                    {this?.props?.data?.totalNetAmount}/- अदा करण्यास या
                    आदेशान्वये मान्यता देत आहे.
                  </p>{" "}
                </div>
              </div>

              <div className={styles.date7} style={{ marginBottom: "2vh" }}>
                <div className={styles.date8}>
                  <div className={styles.add7} style={{ lineHeight: "1.2" }}>
                    <h5>सहाय्यक आयुक्त</h5>
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
