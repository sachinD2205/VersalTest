import { ExitToApp, Print } from "@mui/icons-material"
import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  ThemeProvider,
} from "@mui/material"
import axios from "axios"
import moment from "moment"
import Head from "next/head"
import router from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import sweetAlert from "sweetalert"
import URLS from "../../../../URLS/urls"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import styles from "./view.module.css"
import html2pdf from "html2pdf-jspdf2"
import ReactHtmlParser from "html-react-parser"
import SendIcon from "@mui/icons-material/Send"
import theme from "../../../../theme"
import Loader from "../../../../containers/Layout/components/Loader"
import EmailSendingLoader from "../../../../components/municipalSecretariatManagement/loaders/EmailSendingLoader"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { useSelector } from "react-redux"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const ToPrint = () => {
  const [agendaDetails, setAgendaDetails] = useState({})
  const [committeeName, setCommitteeName] = useState("")
  const [specialMeeting, setSpecialMeeting] = useState(false)
  const [meetingScheduleLing, setMeetingScheduleLing] = useState(null)
  const [currentTimeOfTheDay, setCurrentTimeOfTheDay] = useState(null)

  const [checkIfMailSent, setCheckIfMailSent] = useState(false)

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

  const [showingFormatForVishay, setShowingFormatForVishay] = useState(null)
  const [showingFormat, setShowingFormat] = useState(null)
  const [mailSending, setMailSending] = useState(false)

  const [departmentName, setDepartmentName] = useState([])

  const [timeIn12Hour, setTimeIn12Hour] = useState(null)
  /////////////////////////////////////////////
  const [dayFromDate, setDayFromDate] = useState(null)

  const [loading, setLoading] = useState(false)
  const [pdfContent, setPdfContent] = useState("")
  const parser = new DOMParser()
  const componentRef = useRef(null) // ANWAR A. ANSARI
  const [pdfOp, setPdfOp] = useState(null)

  const [tempTableData, setTempTableData] = useState([])

  const userToken = useGetToken()

  const currDate = new Date()

  const pdfOptions = {
    margin: 10,
    filename: `Agenda${currDate}.pdf`,
    image: { type: "jpeg", quality: 100 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }

  function blobToFile(blob, fileName) {
    const file = new File([blob], fileName, { type: blob.type })
    return file
  }

  // download a document/output

  // const download = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: `Agenda${currDate}.pdf`,
  //   copyStyles: true,
  //   print: async (printIframe) => {
  //     setLoading(true)
  //     const document = printIframe.contentDocument
  //     if (document) {
  //       const html = document.getElementsByTagName("html")[0]
  //       console.log(html)
  //       try {
  //         await html2pdf().set(pdfOptions).from(html).save()
  //         setLoading(false)
  //       } catch (error) {
  //         console.log("error", error)
  //         setLoading(false)
  //       }
  //     }
  //   },
  // })
  const handleToNormalPrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: ,
    pageStyle: "A4",
    color: "color",
  })

  // save a document/output to server for future use
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Agneda${currDate}.pdf`,
    copyStyles: true,
    print: async (printIframe) => {
      const document = printIframe.contentDocument
      if (document) {
        const html = document.getElementsByTagName("html")[0]
        console.log(html)
        try {
          setLoading(true)
          let worker = await html2pdf()
            .set(pdfOptions)
            .from(html)
            .toPdf()
            .output("blob")
            .then((data) => {
              return data
            })
          console.log("gggg::", worker)
          var file = blobToFile(worker, "Agenda.pdf")
          console.log("file::", file)
          let formData = new FormData()
          formData.append("file", file)
          formData.append("appName", "TP")
          formData.append("serviceName", "PARTMAP")
          // formData.append("fileName", `Agenda${currDate}.pdf`)
          axios
            .post(
              `${URLS.CFCURL}/file/uploadAllTypeOfFileEncrypted`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((r) => {
              if (r.status === 200 || r.status === 201) {
                console.log("pathhhh", r?.data?.filePath)
                setLoading(false)
                // return r.data.filePath
                return sendAgenda(r?.data?.filePath)
              } else {
                sweetAlert("Something went wrong, can't upload file right now!")
                setLoading(false)
              }
            })
        } catch (error) {
          console.log("error", error)
          setLoading(false)
          callCatchMethod(error, language)
        }
      }
    },
  })

  // ///////////////////////////////
  const sendAgenda = (filPath) => {
    let apiBody = {
      agendaNo: router?.query?.agendaNo,
      filePath: [filPath],
    }

    setMailSending(true)
    axios
      .post(
        `${URLS.MSURL}/trnPrepareMeetingAgenda/sendMeetingCircularOnMail`,
        apiBody,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          sweetAlert({
            title: "Success",
            text: "Agenda sent successfully!",
            icon: "success",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              setMailSending(false)
              // Assuming you want to set mailSent to "true"
              router.replace({
                pathname: router.pathname,
                query: { ...router.query, mailSent: "true" },
              })
            }
          })
        } else {
          sweetAlert("Something Went Wrong!")
          setMailSending(false)
        }
      })
      .catch((error) => {
        // console.log("error", error)
        // if (!error.status) {
        //   console.log(":1000", error)
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setMailSending(false)
        // } else {
        //   sweetAlert(error)
        //   setMailSending(false)
        // }
        setMailSending(false)
        callCatchMethod(error, language)
      })
  }

  // /////////////////////////////

  useEffect(() => {
    //Get Department
    setLoading(true)
    axios
      .get(`${URLS.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Department: ", res.data.department)
        setDepartmentName(
          res?.data?.department?.map((j) => ({
            id: j.id,
            departmentNameEn: j.department,
            departmentNameMr: j.departmentMr,
          }))
        )
        setLoading(false)
      })
      .catch((error) => {
        // console.log("error: ", error)
        // sweetAlert({
        //   title: "ERROR!",
        //   text: `${error}`,
        //   icon: "error",
        //   buttons: {
        //     confirm: {
        //       text: "OK",
        //       visible: true,
        //       closeModal: true,
        //     },
        //   },
        //   dangerMode: true,
        // })
        setLoading(false)
        callCatchMethod(error, language)
      })
  }, [])

  //////////////////////////////////

  useEffect(() => {
    if (router?.query?.agendaNo) {
      setLoading(true)
      axios
        .get(
          `${URLS.MSURL}/trnPrepareMeetingAgenda/getByFromDateAndToDateOrAgendaNo?agendaNo=${router.query.agendaNo}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            setAgendaDetails(res?.data?.prepareMeetingAgenda[0])

            // NEW CODE FOR EXCEL TABLE PRAPATRA
            let temp =
              res?.data?.prepareMeetingAgenda[0]?.agendaSubjectDao?.map(
                (o, i) => {
                  let prData
                  if (o?.prapatra === null) {
                    // alert("null")
                    prData = []
                  } else if (o?.prapatra === "[]") {
                    // alert("[]")
                    prData = []
                  } else if (
                    o?.prapatra !== "[]" &&
                    o.prapatra.startsWith("[")
                  ) {
                    // alert("aaya")
                    prData = JSON.parse(o?.prapatra)
                  }
                  return {
                    id: o.id,
                    indexNo: i + 1,
                    data: prData,
                    outwardNo: o.outwardNumber,
                    inwardOutWardDate: o.inwardOutWardDate
                      ? moment(o.inwardOutWardDate).format("DD/MM/YYYY")
                      : null,
                  }
                }
              )

            let champuArray = []
            temp?.forEach((item, index) => {
              if (item?.data !== null && item?.data?.length > 0) {
                let tempHeader = []
                tempHeader = item?.data?.map((obj) => {
                  return Object.keys(obj)
                })
                let tempRows = []
                tempRows = item?.data?.map((obj) => {
                  return Object.values(obj)
                })

                let obj = {
                  head: tempHeader[0],
                  body: tempRows,
                  outwardNo: item?.outwardNo,
                  inwardOutWardDate: item?.inwardOutWardDate,
                  indexNo: item?.indexNo,
                }

                console.log(":as1", obj)
                champuArray.push(obj)
              }
            })

            setTempTableData(champuArray)
            // NEW CODE FOR EXCEL TABLE PRAPATRA

            setMeetingScheduleLing(
              res?.data?.prepareMeetingAgenda?.map((obj) => {
                return obj?.meetingSchedule[0]
              })
            )
            setLoading(false)
          } else {
            sweetAlert({
              title: "ERROR!",
              text: `Something Went Wrong!`,
              icon: "error",
              buttons: {
                confirm: {
                  text: "OK",
                  visible: true,
                  closeModal: true,
                },
              },
              closeOnClickOutside: false,
              dangerMode: true,
            })
            setLoading(false)
          }
        })
        .catch((error) => {
          // console.log("error: ", error)
          // sweetAlert({
          //   title: "ERROR!",
          //   text: `${error}`,
          //   icon: "error",
          //   buttons: {
          //     confirm: {
          //       text: "OK",
          //       visible: true,
          //       closeModal: true,
          //     },
          //   },
          //   dangerMode: true,
          // })
          setLoading(false)
          callCatchMethod(error, language)
        })
    }
  }, [router?.query])

  useEffect(() => {
    //Get Committee Name
    axios
      .get(`${URLS.MSURL}/mstDefineCommittees/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        res.data.committees.forEach((j) => {
          if (j.id === agendaDetails["committeeId"]) {
            setCommitteeName(j.committeeNameMr)

            commBasedFormatt(j.committeeNameMr)
            // commBasedFormatt("विधी समिती")
          }
        })
      })
      .catch((error) => {
        // console.log("error: ", error)
        // sweetAlert({
        //   title: "ERROR!",
        //   text: `${error}`,
        //   icon: "error",
        //   buttons: {
        //     confirm: {
        //       text: "OK",
        //       visible: true,
        //       closeModal: true,
        //     },
        //   },
        //   dangerMode: true,
        // })
        callCatchMethod(error, language)
      })
  }, [agendaDetails])

  // ////////////
  const commBasedFormatt = (value) => {
    switch (value) {
      case "मा. महापालिका सभा ":
        return (
          setShowingFormat(
            `पिंपरी चिंचवड महानगरपालिकेची मासीक मा.महापालिका सभा`
          ),
          setShowingFormatForVishay(
            `पिंपरी चिंचवड महानगरपालिकेची मा.महापालिका सभा`
          )
        )
      case "मा. स्थायी समिती":
        return (
          setShowingFormat(
            `पिंपरी चिंचवड महानगरपालिकेची मा.स्थायी समितीची साप्ताहीक सभा`
          ),
          setShowingFormatForVishay(
            `पिंपरी चिंचवड महानगरपालिकेची मा.स्थायी समितीची सभा`
          )
        )

      default:
        return (
          setShowingFormat(
            `पिंपरी चिंचवड महानगरपालिकेची ${value}ची पाक्षिक सभा`
          ),
          setShowingFormatForVishay(
            `पिंपरी चिंचवड महानगरपालिकेची ${value}ची सभा`
          )
        )
    }
  }

  ////////////////////////////////////////////////////

  useEffect(() => {
    if (meetingScheduleLing && meetingScheduleLing[0] !== null) {
      const timeString = meetingScheduleLing[0]?.meetingTime

      console.log(":loj", timeString)

      const [hourString, minuteString] = timeString?.split(":")

      const date = new Date()
      date.setHours(parseInt(hourString))
      date.setMinutes(parseInt(minuteString))

      const currentHour = date.getHours()

      if (currentHour >= 0 && currentHour < 12) {
        setCurrentTimeOfTheDay("सकाळी.")
      } else if (currentHour >= 12 && currentHour < 18) {
        setCurrentTimeOfTheDay("दुपारी.")
      } else {
        setCurrentTimeOfTheDay("सायं.")
      }

      ////////////////////////////

      let hour = parseInt(hourString, 10)

      if (hour >= 12) {
        if (hour > 12) {
          hour -= 12
        }
      }

      const formattedHour = hour.toString() // Ensure the hour is always 2 digits
      const timeIn12Hour = `${formattedHour}:${minuteString}`
      setTimeIn12Hour(timeIn12Hour)
    }
  }, [meetingScheduleLing])

  ////////////////////////////////////////////////////
  useEffect(() => {
    if (meetingScheduleLing !== null) {
      // const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const weekdayNames = [
        "रविवार",
        "सोमवार",
        "मंगळवार",
        "बुधवार",
        "गुरुवार",
        "शुक्रवार",
        "शनिवार",
      ]
      const dateString = moment(meetingScheduleLing[0]?.meetingDate).format(
        "DD/MM/YYYY"
      )
      const dateParts = dateString?.split("/")
      const dayIndex = new Date(
        `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
      ).getDay()
      const dayName = weekdayNames[dayIndex]

      setDayFromDate(dayName)
    }
  }, [meetingScheduleLing])

  ////////////////////////////////////////////////////

  // ENGLISH TO MARARTHI NUMBER
  function convertToMarathiNumber(number) {
    console.log(":100.toString()", number)
    const marathiNumbersMap = {
      0: "०",
      1: "१",
      2: "२",
      3: "३",
      4: "४",
      5: "५",
      6: "६",
      7: "७",
      8: "८",
      9: "९",
    }

    const englishNumber = number ? number.toString() : ""
    let marathiNumber = ""

    for (let i = 0; i < englishNumber.length; i++) {
      const char = englishNumber.charAt(i)
      if (!isNaN(char)) {
        marathiNumber += marathiNumbersMap[char]
      } else {
        marathiNumber += char
      }
    }

    return marathiNumber
  }

  /////////////////////////////////
  let conditionallyRenderLoader = (x, y) => {
    if (x) {
      return <Loader />
    } else if (y) {
      return <EmailSendingLoader />
    }
  }

  return (
    <>
      <Head>
        <title>Reports - Meeting Agenda</title>
      </Head>

      {loading || mailSending ? (
        conditionallyRenderLoader(loading, mailSending)
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Paper
            className={styles.main}
            style={{
              backgroundColor: "whitesmoke",
              width: "100%",
            }}
          >
            <div className={styles.row}>
              <Button
                disabled={router?.query?.mailSent === "true" ? true : false}
                variant="contained"
                color="success"
                endIcon={<SendIcon />}
                onClick={() => {
                  handleToPrint()
                }}
                size="small"
                sx={{ minWidth: "50px", height: "28px" }}
              >
                <FormattedLabel id="send" />
              </Button>
              {/* ////////////////////// */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleToNormalPrint()
                }}
                size="small"
                sx={{ minWidth: "50px", height: "28px" }}
              >
                {/* <FormattedLabel id="print" /> */}
                {<Print />}
              </Button>
              <div>
                <span
                  style={{
                    fontWeight: "bolder",
                    fontSize: "large",
                  }}
                >
                  Special Meeting
                </span>
                <Checkbox
                  onChange={() => {
                    setSpecialMeeting(!specialMeeting)
                  }}
                />
              </div>
              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToApp />}
                onClick={() => {
                  router.back()
                }}
                size="small"
                sx={{ minWidth: "50px", height: "28px" }}
              >
                <FormattedLabel id="back" />
              </Button>
            </div>
            <div
              id="myForm"
              className={styles.reportWrapper}
              ref={componentRef}
              style={{
                pageBreakInside: "avoid",
                pageBreakBefore: "auto",
                pageBreakAfter: "auto",
                margin: 0,
              }}
            >
              <Grid
                container
                style={{
                  pageBreakAfter: "always",
                }}
              >
                <Grid item xs={12} sm={12} md={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div></div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span>पिंपरी चिंचवड महानगरपालिका,</span>
                      <span style={{ textAlign: "start" }}>
                        {" "}
                        पिंपरी - ४११०१८
                      </span>
                      <span style={{ textAlign: "start" }}>
                        {" "}
                        नगरसचिव कार्यालय,
                      </span>

                      <span style={{ textJustify: "inter-word" }}>
                        {" "}
                        क्रमांक -{" "}
                        {meetingScheduleLing &&
                          meetingScheduleLing[0]?.outwardNo}{" "}
                      </span>

                      <span style={{ textAlign: "justify" }}>
                        दिनांक -{" "}
                        {convertToMarathiNumber(
                          moment(
                            meetingScheduleLing &&
                              meetingScheduleLing[0]?.outwardDate
                          ).format("DD/MM/YYYY")
                        )}
                      </span>
                    </div>
                  </div>
                </Grid>

                {/* ///////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "start",
                    marginTop: "20px",
                  }}
                >
                  <span>प्रती,</span>

                  <span>माननीय सदस्य (सर्व),</span>
                  <span>{committeeName},</span>

                  <span>पिंपरी चिंचवड महानगरपालिका,</span>
                  <span> पिंपरी - ४११०१८</span>
                </Grid>
                {/* ///////////////////////////////////////// */}
                <Grid item xs={12} sm={12} md={2}></Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={10}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginTop: "30px",
                  }}
                >
                  विषय - {showingFormatForVishay && showingFormatForVishay}{" "}
                  दिनांक.{" "}
                  {meetingScheduleLing &&
                    convertToMarathiNumber(
                      meetingScheduleLing &&
                        moment(meetingScheduleLing[0]?.meetingDate).format(
                          "DD/MM/YYYY"
                        )
                    )}{" "}
                  रोजी आयोजित केलेबाबत.
                </Grid>

                {/* ///////////////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "start",
                    marginTop: "30px",
                  }}
                >
                  <span
                    style={{
                      textAlign: "justify",
                      textJustify: "inter-word",
                    }}
                  >
                    महोदय/महोदया,
                  </span>
                  <span
                    style={{
                      textAlign: "justify",
                      textJustify: "inter-word",
                      textIndent: "90px",
                    }}
                  >
                    {showingFormat && showingFormat}{" "}
                    {dayFromDate !== null && dayFromDate}, दिनांक.{" "}
                    {convertToMarathiNumber(
                      meetingScheduleLing &&
                        moment(meetingScheduleLing[0]?.meetingDate).format(
                          "DD/MM/YYYY"
                        )
                    )}{" "}
                    रोजी {currentTimeOfTheDay !== null && currentTimeOfTheDay}{" "}
                    {convertToMarathiNumber(timeIn12Hour && timeIn12Hour)} वा.
                    महानगरपालिकेच्या प्रशासकीय इमारती मधील{" "}
                    {meetingScheduleLing &&
                      meetingScheduleLing[0]?.meetingPlace}{" "}
                    येथे आयोजित करण्यात आली आहे. सोबत सभेची कार्यपत्रिका जोडली
                    आहे. सभेस आपण उपस्थित रहावे, ही विनंती.
                  </span>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "70px",
                    }}
                  >
                    <div></div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      आपल्या विश्वासू ,
                      <span
                        style={{
                          height: 40,
                          width: 200,
                          padding: "2%",
                          marginBottom: "5%",
                          marginTop: "5%",
                          border: "1px solid black",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ opacity: "30%" }}>
                          इथे हस्ताक्षर करा
                        </span>
                      </span>
                      <strong>{"( उल्हास बबनराव जगताप )"}</strong>
                      <span>नगरसचिव</span>
                      <span>पिंपरी चिंचवड महानगरपालिका</span>
                      <span>पिंपरी - ४११०१८</span>
                    </div>
                  </div>
                </Grid>

                {/* //////////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginTop: "40px",
                  }}
                >
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                    }}
                  >
                    {/* <li> प्रत - १) सर्व सदस्य,{committeeName}, </li> */}
                    <li> प्रत - १) सर्व संबंधित शाखा प्रमुख व शाखाधिकारी </li>
                    <li style={{ marginLeft: "35px" }}>
                      २) कार्यालयीन नोटीस बोर्ड{" "}
                    </li>
                  </ul>
                </Grid>
              </Grid>

              {/* //////////////////////////// */}
              <div className={styles.heading} style={{ marginBottom: 25 }}>
                <span>पिंपरी चिंचवड महानगरपालिका, पिंपरी-४११०१८. </span>
                <span>
                  <strong>{committeeName}</strong>
                  {specialMeeting && <strong> ( विशेष सभा )</strong>}
                </span>
                <span>
                  कार्यपत्रिका क्रमांक -{" "}
                  {convertToMarathiNumber(agendaDetails.agendaNo)}
                </span>
              </div>

              {/* PAGE BREAKING */}

              <div
                className={styles.dateAndTime}
                style={{ justifyContent: "space-between", marginBottom: 15 }}
              >
                <span>
                  दिनांक -{" "}
                  <strong>
                    {/* ०१/०२/२०२३ */}
                    {convertToMarathiNumber(
                      meetingScheduleLing &&
                        moment(meetingScheduleLing[0]?.meetingDate).format(
                          "DD/MM/YYYY"
                        )
                    )}
                  </strong>
                </span>
                <span>
                  वेळ -{" "}
                  <strong>
                    {currentTimeOfTheDay !== null && currentTimeOfTheDay}{" "}
                    {convertToMarathiNumber(timeIn12Hour && timeIn12Hour)} वा.
                  </strong>
                </span>
              </div>
              <p
                className={styles.description}
                style={{
                  textAlign: "justify",
                  textJustify: "inter-word",
                  marginBottom: 20,
                }}
              >
                {showingFormat && showingFormat}
                {/* पिंपरी चिंचवड महानगरपालिकेची मा.{" "}
              <strong>{committeeName}ची</strong> साप्ताहिक सभा */}{" "}
                {dayFromDate !== null && dayFromDate}{" "}
                {specialMeeting && <> ( विशेष सभा )</>}, दिनांक{" "}
                <strong>
                  {convertToMarathiNumber(
                    meetingScheduleLing &&
                      moment(meetingScheduleLing[0]?.meetingDate).format(
                        "DD/MM/YYYY"
                      )
                  )}
                </strong>{" "}
                रोजी {currentTimeOfTheDay !== null && currentTimeOfTheDay}{" "}
                <strong>
                  {" "}
                  {convertToMarathiNumber(timeIn12Hour && timeIn12Hour)}{" "}
                </strong>
                वा. महानगरपालिकेच्या{" "}
                <strong>
                  {" "}
                  {meetingScheduleLing &&
                    meetingScheduleLing[0]?.meetingPlace}{" "}
                </strong>{" "}
                येथे आयोजीत करण्यात आली आहे . सभेत खालील कामकाज होईल.
              </p>
              {agendaDetails?.agendaSubjectDao &&
                // @ts-ignore
                agendaDetails?.agendaSubjectDao?.map((obj, index) => {
                  return (
                    <>
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{ marginBottom: 10 }}
                        >
                          <div
                            className={styles.dateAndTime}
                            style={{ justifyContent: "space-between" }}
                          >
                            <span>
                              विषय क्रं :{" "}
                              <strong>
                                {convertToMarathiNumber(index + 1)})
                              </strong>
                            </span>
                            {/* //////////////// */}
                            <span>
                              विभाग :{" "}
                              <strong>
                                {
                                  departmentName?.find((val) => {
                                    return obj.departmentId == val.id
                                  })?.departmentNameMr
                                }
                              </strong>
                            </span>
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                          <p>{ReactHtmlParser(obj?.subjectSummary)}</p>
                          {/* <p>
                            अभिनंदन ! आज सकाळी वर्तमान पत्रात आलेली तुझी बातमी
                            की, तू जिल्हास्तरीय निबंध स्पर्धेत सहभागी होऊन प्रथम
                            क्रमांक पटकावला आहेस, हे वाचून मला खूप आनंद झाला.
                            लागलीच तुला हे पत्र लिहीत आहे. शाळेत असतानाच तुझ्या
                            विचारांनी मन भारावून जायचं. ज्या पद्धतीने तू एखाद्या
                            विषयाला अनुसरून अगदी सोप्या आणि साध्या शब्दात लेख
                            लिहायचा स सर्वांना च तुझा हेवा वाटायचाअभिनंदन ! आज
                            सकाळी वर्तमान पत्रात आलेली तुझी बातमी की,
                          </p> */}
                        </Grid>
                      </Grid>
                    </>
                  )
                })}

              {/* //////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  pageBreakInside: "avoid",
                  pageBreakBefore: "auto",
                  pageBreakAfter: "auto",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div></div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        height: 40,
                        width: 200,
                        padding: "2%",
                        marginBottom: "5%",
                        marginTop: "5%",
                        border: "1px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ opacity: "30%" }}>इथे हस्ताक्षर करा</span>
                    </span>
                    <strong>{"( उल्हास बबनराव जगताप )"}</strong>
                    <span>नगरसचिव</span>
                    <span>पिंपरी चिंचवड महानगरपालिका</span>
                    <span>पिंपरी - ४११०१८</span>
                  </div>
                </div>
              </Grid>
              {/* ADDING OUTER DIV */}

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  pageBreakInside: "avoid",
                  pageBreakBefore: "auto",
                  pageBreakAfter: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span>पिंपरी चिंचवड महानगरपालिका</span>
                  <span>पिंपरी - १८. नगरसचिव विभाग</span>
                  <span>
                    क्रमांक -{" "}
                    {meetingScheduleLing && meetingScheduleLing[0]?.outwardNo}
                  </span>
                  <span>
                    दिनांक -{" "}
                    {convertToMarathiNumber(
                      meetingScheduleLing &&
                        moment(meetingScheduleLing[0]?.meetingDate).format(
                          "DD/MM/YYYY"
                        )
                    )}
                  </span>
                  <br />
                  <span>टिप - {agendaDetails?.tip}</span>
                </div>
              </Grid>

              {/* EXCEL TO TABLE */}
              {tempTableData?.map((item, index) => (
                <div
                  className={styles.table_container}
                  style={{
                    // margin: "500px 20px 20px 20px",
                    pageBreakAfter: "always",
                    pageBreakBefore: "always",
                    marginBottom: "20px",
                  }}
                >
                  <span style={{ textAlign: "center" }}>
                    (क्र.{item?.outwardNo} दिनांक.{" "}
                    {convertToMarathiNumber(item?.inwardOutWardDate)} विषय क्र.
                    {convertToMarathiNumber(item?.indexNo)} चे लगत)
                  </span>

                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {item.head?.map((header, headerIndex) => (
                          <th key={headerIndex}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {item.body?.map((body1) => (
                        <tr>
                          {body1.map((value) => (
                            <td>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </Paper>
        </div>
      )}
    </>
  )
}

export default ToPrint
