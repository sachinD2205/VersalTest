import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  ThemeProvider,
} from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import theme from "../../../../../theme"
import { useReactToPrint } from "react-to-print"
import PrintIcon from "@mui/icons-material/Print"
import Send from "@mui/icons-material/Send"
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import { useRouter } from "next/router"
import axios from "axios"
import urls from "../../../../../URLS/urls"
import moment from "moment"
import UploadBtn from "./UploadBtn"
import Loader from "../../../../../containers/Layout/components/Loader"
import EmailSendingLoader from "../../../../../components/municipalSecretariatManagement/loaders/EmailSendingLoader"
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks"
import { useSelector } from "react-redux"
import { catchExceptionHandlingMethod } from "../../../../../util/util"

const Index = () => {
  const componentRef = useRef(null)
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

  const router = useRouter()

  const userToken = useGetToken()

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: ,
    pageStyle: "A4",
    color: "color",
  })
  const [data, setData] = useState([])
  const [comittees1, setcomittees1] = useState([])
  const [loading, setLoading] = useState(false)
  const [dayFromDate, setDayFromDate] = useState(null)
  const [attachment, setAttachment] = useState("")
  const [mailSending, setMailSending] = useState(false)

  const [currentTimeOfTheDay, setCurrentTimeOfTheDay] = useState(null)
  const [timeIn12Hour, setTimeIn12Hour] = useState(null)

  const getAllInfoAboutReshedule = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true)
    axios
      .get(
        `${urls.MSURL}/trnMeetingSchedule/getByMeetingScheduleData?agendaNo=${router?.query?.agNo}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let result = res?.data
          setData(
            result?.map((r, i) => ({
              currentMeeetingDate: moment(r?.currentMeeetingDate).format(
                "DD/MM/YYYY"
              ),
              currentMeetingPlace: r?.currentMeetingPlace,
              currentMeetingTime: r?.currentMeetingTime,
              previousMeetingDate: moment(r?.previousMeetingDate).format(
                "DD/MM/YYYY"
              ),
              committeeName: comittees1?.find(
                (obj) => obj?.id === r?.committeeId
              )?.committee,
              agendaOutwardNo: r?.agendaOutwardNo,
              agendaNo: r?.agendaNo,
            }))
          )
          setLoading(false)
        } else {
          sweetAlert({
            title: "Oops!",
            text: "There is nothing to show you!",
            icon: "warning",
            // buttons: ["No", "Yes"],
            dangerMode: false,
            closeOnClickOutside: false,
          })
          setLoading(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: error?.toString(),
        //     icon: "warning",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // } else {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: error?.toString(),
        //     icon: "warning",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // }
        callCatchMethod(error, language)
        setLoading(false)
      })
  }

  const getcomittees1 = () => {
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAllForDropDown`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setcomittees1(
          r?.data?.committees?.map((row) => ({
            id: row.id,
            committee: row.committeeNameMr,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }
  useEffect(() => {
    getAllInfoAboutReshedule()
  }, [comittees1])

  useEffect(() => {
    getcomittees1()
  }, [])

  useEffect(() => {
    if (data.length !== 0) {
      console.log(":data", data)
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
      const dateString = data[0]?.currentMeeetingDate
      const dateParts = dateString?.split("/")
      const dayIndex = new Date(
        `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
      ).getDay()
      const dayName = weekdayNames[dayIndex]

      setDayFromDate(dayName)
    }
  }, [data])

  let currDate = new moment(Date()).format("DD/MM/YYYY")

  // CURRRENT MEETING TIME AND TIME

  useEffect(() => {
    if (data?.length !== 0) {
      const timeString = data[0]?.currentMeetingTime

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
  }, [data])

  ////////////////////////////////////////////////////////////
  const sendAgenda = () => {
    console.log("Filepath: ", attachment)

    let apiBody = {
      agendaNo: router?.query?.agNo,
      filePath: [attachment],
    }

    setMailSending(true)
    axios
      .post(
        `${urls.MSURL}/trnPrepareMeetingAgenda/sendTahkubCircularOnMail`,
        apiBody,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data)
        if (res?.status === 200 || res?.status === 201) {
          setMailSending(false)
          sweetAlert({
            title: "Success!",
            text: "Notice sent successfully!",
            icon: "success",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              router.push({
                pathname:
                  "/municipalSecretariatManagement/transaction/calender",
              })
            }
          })
        } else {
          sweetAlert({
            title: "Error!",
            text: "Something Went Wrong,please try again",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          })
          setMailSending(false)
        }
      })
      .catch((error) => {
        // sweetAlert("Error", error, "error")
        callCatchMethod(error, language)
        setMailSending(false)
      })
  }

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
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {loading || mailSending ? (
          conditionallyRenderLoader(loading, mailSending)
        ) : (
          <Paper
            style={{
              marginBottom: "30px",
              width: "65vw",
            }}
          >
            <div>
              <form ref={componentRef}>
                <Grid
                  container
                  spacing={3}
                  style={{
                    marginTop: "10px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    fontSize: "16px",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2>
                      <strong style={{ textDecoration: "underline" }}>
                        नोटीस
                      </strong>
                    </h2>
                  </Grid>
                  {/* //////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      textAlign: "justify",
                      textJustify: "inter-word",
                      textIndent: "70px",
                    }}
                  >
                    <span
                      style={{
                        textAlign: "justify",
                        textJustify: "inter-word",
                      }}
                    >
                      पिंपरी चिंचवड महानगरपालिकेची{" "}
                      {data.length !== 0 ? data[0]?.committeeName : ""}ची
                    </span>{" "}
                    <span
                      style={{
                        textAlign: "justify",
                        textJustify: "inter-word",
                      }}
                    >
                      दिनांक.{" "}
                      <strong>
                        {data.length !== 0
                          ? convertToMarathiNumber(data[0]?.previousMeetingDate)
                          : ""}{" "}
                        (कार्यपत्रिका क्र.{" "}
                        {data.length !== 0
                          ? convertToMarathiNumber(data[0]?.agendaNo)
                          : ""}{" "}
                        )
                      </strong>{" "}
                      सभा {dayFromDate !== null ? dayFromDate : ""} दिनांक.{" "}
                      <strong>
                        {" "}
                        {data.length !== 0
                          ? convertToMarathiNumber(data[0]?.currentMeeetingDate)
                          : ""}
                      </strong>{" "}
                      रोजी {currentTimeOfTheDay !== null && currentTimeOfTheDay}{" "}
                      <strong>
                        {" "}
                        {convertToMarathiNumber(timeIn12Hour && timeIn12Hour)}
                      </strong>{" "}
                      वा. पर्यंत तहकूब करणेत आलेली आहे. तरी सन्मा. सदस्यांनी
                      याची नोंद घेवून ठरविलेल्या दिवशी व वेळी{" "}
                      <strong>
                        {" "}
                        {data.length !== 0 ? data[0]?.currentMeetingPlace : ""}
                      </strong>{" "}
                      येथे उपस्थित रहावे, ही नम्र विनंती.
                    </span>
                  </Grid>

                  {/* //////////////////////////////////// */}
                  <Grid item xs={12} sm={12} md={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "80px",
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
                          <strong style={{ opacity: "30%" }}>
                            इथे हस्ताक्षर करा
                          </strong>
                        </span>
                        <strong>{"( उल्हास बबनराव जगताप )"}</strong>
                        <span>नगरसचिव</span>
                        <span>पिंपरी चिंचवड महानगरपालिका</span>
                        <span>पिंपरी - ४११०१८</span>
                      </div>
                    </div>
                  </Grid>
                  {/* <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginTop: "50px",
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
                      <strong style={{ opacity: "30%" }}>
                        इथे हस्ताक्षर करा
                      </strong>
                    </span>
                    <strong>{"( उल्हास बबनराव जगताप )"}</strong>
                    <span>नगरसचिव</span>
                    <span>पिंपरी चिंचवड महानगरपालिका</span>
                    <span>पिंपरी - ४११०१८</span>
                  </Grid> */}

                  {/* ////////////////////// */}

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
                      marginTop: "40px",
                    }}
                  >
                    <span>पिंपरी चिंचवड महानगरपालिका</span>
                    <span>पिंपरी - १८. नगरसचिव कार्यालय</span>
                    <span>
                      क्रमांक :{" "}
                      {data.length !== 0 ? data[0]?.agendaOutwardNo : ""}
                    </span>
                    <span>दिनांक : {convertToMarathiNumber(currDate)}</span>
                  </Grid>

                  {/* /////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      alignItems: "baseline",
                      marginTop: "6px",
                    }}
                  >
                    <ul style={{ listStyle: "none" }}>
                      <li> प्रत - १) सर्व संबंधित शाखा प्रमुख व शाखाधिकारी</li>
                      <li style={{ marginLeft: "32px" }}>
                        २) कार्यालयीन नोटीस बोर्ड{" "}
                      </li>
                    </ul>
                  </Grid>

                  {/* ///////////////////////////////// */}
                </Grid>
              </form>
              <Grid
                container
                spacing={3}
                style={{
                  // padding: "10px",
                  marginTop: "10px",
                  // paddingLeft: "100px",
                  // paddingRight: "85px",
                  // pageBreakAfter: "300px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={3}
                  md={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "40px",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    sx={{ width: "auto" }}
                    // disabled={showSaveButton}
                    type="button"
                    variant="contained"
                    color="primary"
                    endIcon={<PrintIcon />}
                    size="small"
                    onClick={handleToPrint}
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </Grid>
                {/* ///////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={5}
                  md={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "40px",
                    marginTop: "40px",
                  }}
                >
                  <UploadBtn
                    appName="TP"
                    serviceName="PARTMAP"
                    label={<FormattedLabel id="circulateTahkubNotice" />}
                    filePath={attachment}
                    fileUpdater={setAttachment}
                    // view
                  />
                  {attachment && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      endIcon={<Send />}
                      onClick={() => {
                        sendAgenda()
                      }}
                    >
                      <FormattedLabel id="send" />
                    </Button>
                  )}
                </Grid>
                {/* ///////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "40px",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    // sx={{ width: "auto" }}
                    // disabled={showSaveButton}
                    type="button"
                    variant="contained"
                    color="secondary"
                    endIcon={<CalendarMonthIcon />}
                    size="small"
                    onClick={() => {
                      router.push({
                        pathname:
                          "/municipalSecretariatManagement/transaction/calender",
                      })
                    }}
                  >
                    <FormattedLabel id="calender" />
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Paper>
        )}
      </div>
    </ThemeProvider>
  )
}

export default Index
