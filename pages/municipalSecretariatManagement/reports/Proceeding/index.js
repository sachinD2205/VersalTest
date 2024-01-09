import React, { useEffect, useRef, useState } from "react"
import {
  Paper,
  Button,
  ThemeProvider,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { useReactToPrint } from "react-to-print"
import theme from "../../../../theme"
import PrintIcon from "@mui/icons-material/Print"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import router from "next/router"
import urls from "../../../../URLS/urls"
import axios from "axios"
import sweetAlert from "sweetalert"
import { useSelector } from "react-redux"
import moment from "moment"
import tables from "./table.module.css"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ReactHtmlParser from "html-react-parser"
import { ExitToApp } from "@mui/icons-material"
import Loader from "../../../../containers/Layout/components/Loader"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const [loading, setLoading] = useState(false)
  const [meetSchedule, setMeetSchedule] = useState(null)
  const [attendences, setAttendences] = useState([])
  const [agendaSubDao, setAgendaSubDao] = useState([])
  const [agendaSubDaoFiltered, setAgendaSubDaoFiltered] = useState([])
  const [agendaVerdict, setAgendaVerdict] = useState(null)
  const [commId, setCommId] = useState()
  const [committeeName, setCommitteeName] = useState([])
  const [sarvaNumteCommName, setSarvaNumteCommName] = useState([])
  const [agendaNumber, setAgendaNumber] = useState(null)
  const [data, setData] = useState(null)
  const [corporators, setCorporators] = useState([])

  const [departmentName, setDepartmentName] = useState([])

  const [suchakName, setSuchakName] = useState(null)
  const [anumodakName, setAnumodakName] = useState(null)
  const [presidentName, setPresidentName] = useState(null)

  const [currentTimeOfTheDay, setCurrentTimeOfTheDay] = useState(null)
  const [dayFromDate, setDayFromDate] = useState(null)
  const [timeIn12Hour, setTimeIn12Hour] = useState(null)

  const [printTableData, setPrintTableData] = useState([])
  const [tableRowData, setTableRowData] = useState([])
  const [tempTableData, setTempTableData] = useState([])
  const [showingFormat, setShowingFormat] = useState(null)

  const [selectedPresidentId, setSelectedPresidentId] = useState(null)

  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "कार्यवाही अहवाल",
    pageStyle: "A4",
    color: "color",
  })

  const language = useSelector((state) => state.labels.language)
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

  const userToken = useGetToken()

  const getAllProceedingRelatedInform = () => {
    ////////////////////////////////////////////
    setLoading(true)
    axios
      .get(
        `${urls.MSURL}/trnMom/getMomReportByAgenda?agendaNo=${router?.query?.agendaNo}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let responseRes = res?.data?.trnMom[0]
          // console.log("100", responseRes.agendaNo)
          if (responseRes?.length !== 0) {
            const extractedData = [{ ...responseRes }]

            setAgendaNumber(responseRes.agendaNo)

            setAttendences(responseRes.attendance)

            setAgendaVerdict(responseRes.verdict)

            setCommId(responseRes.committeeId)

            setMeetSchedule(responseRes?.schedule[0])

            setAgendaSubDao(responseRes.momAgendaSubjectDao)

            // COMMENTING THIS CODE FOR CHANGES HOLD
            let temp = responseRes?.momAgendaSubjectDao?.map((o, i) => {
              let prData
              if (o?.prapatra === null) {
                // alert("null")
                prData = []
              } else if (o?.prapatra === "[]") {
                // alert("[]")
                prData = []
              } else if (o?.prapatra !== "[]" && o.prapatra.startsWith("[")) {
                // alert("aaya")
                prData = JSON.parse(o?.prapatra)
              }
              return {
                id: o.id,
                indexNo: i + 1,
                data: prData,
                outwardNo: o.outwardNumber,
                subjectDate: moment(o.subjectDate).format("DD/MM/YYYY"),
              }
            })
            setPrintTableData(temp)

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
                  subjectDate: item?.subjectDate,
                  indexNo: item?.indexNo,
                }
                console.log("aala re", obj)
                champuArray.push(obj)
              }
            })

            setTempTableData(champuArray)
            // COMMENTING THIS CODE FOR CHANGES HOLD

            setData(extractedData)
            // // setTableRowData(champu)

            /////////////////////////////////////////
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
        } else {
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   console.log("majja maaaaa", error)
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
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    if (router?.query?.agendaNo) {
      getAllProceedingRelatedInform()
    }
  }, [router?.query])

  useEffect(() => {
    if (commId) {
      setLoading(true)
      axios
        .get(`${urls.MSURL}/mstDefineCommittees/getAllForDropDown`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log("Committee: ", res.data.committees)
          setCommitteeName(
            res?.data?.committees
              ?.filter((r) => r.id === commId)
              .map((j) => {
                commBasedFormatt(j.committeeNameMr)
                return {
                  id: j.id,
                  committeeNameEn: j.committeeName,
                  committeeNameMr: j.committeeNameMr,
                }
              })
          )
          setSarvaNumteCommName(
            res?.data?.committees?.map((j) => {
              return {
                id: j.id,
                committeeNameMr: j.committeeNameMr,
              }
            })
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
    }
  }, [commId])

  useEffect(() => {
    //Get Department
    setLoading(true)
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
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

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${urls.MSURL}/mstDefineCorporators/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setCorporators(
            res?.data?.corporator?.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              fullNameEn:
                (j.firstName ? j.firstName : "") +
                " " +
                (j.middleName ? j.middleName : "") +
                " " +
                (j.lastName ? j.lastName : ""),
              fullNameMr:
                (j.firstNameMr ? j.firstNameMr : "") +
                " " +
                (j.middleNameMr ? j.middleNameMr : "") +
                " " +
                (j.lastNameMr ? j.lastNameMr : ""),
            }))
          )
          setLoading(false)
        } else {
          sweetAlert("Something Went Wrong!")
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
  }, [])

  useEffect(() => {
    if (meetSchedule && meetSchedule !== null) {
      console.log(":10", meetSchedule)
      const timeString = meetSchedule?.meetingTime

      console.log(":loj", timeString)

      const [hourString, minuteString] = timeString?.split(":")

      const date = new Date()
      date.setHours(parseInt(hourString))
      date.setMinutes(parseInt(minuteString))

      const currentHour = date.getHours()

      if (currentHour >= 0 && currentHour < 12) {
        setCurrentTimeOfTheDay("सकाळी.")
      } else if (currentHour >= 12 && currentHour < 16) {
        setCurrentTimeOfTheDay("दुपारी.")
      } else {
        setCurrentTimeOfTheDay("सायं.")
      }
      ////////////////////////////
      // const [hours, minutes] = time24. split(":")
      let suffix = "AM"

      let hour = parseInt(hourString, 10)

      if (hour >= 12) {
        suffix = "PM"
        if (hour > 12) {
          hour -= 12
        }
      }

      const formattedHour = hour.toString() // Ensure the hour is always 2 digits
      const timeIn12Hour = `${formattedHour}:${minuteString}`
      setTimeIn12Hour(timeIn12Hour)
    }
  }, [meetSchedule])

  ////////////////////////////////////////////////////
  useEffect(() => {
    if (meetSchedule !== null) {
      const weekdayNames = [
        "रविवार",
        "सोमवार",
        "मंगळवार",
        "बुधवार",
        "गुरुवार",
        "शुक्रवार",
        "शनिवार",
      ]
      const dateString = moment(meetSchedule?.meetingDate).format("DD/MM/YYYY")
      const dateParts = dateString?.split("/")
      const dayIndex = new Date(
        `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
      ).getDay()
      const dayName = weekdayNames[dayIndex]

      setDayFromDate(dayName)
    }
  }, [meetSchedule])

  ///////////////////////////////////////////////////
  useEffect(() => {
    if (tempTableData) {
      console.log(":100bnm", tempTableData)
    }
  }, [tempTableData])

  useEffect(() => {
    if (data != null && corporators) {
      // let suchName =
      // language == "en"
      //   ? corporators?.find((val) => {
      //       return data[0]?.proposer == val.id
      //     })?.fullNameEn
      //   : corporators?.find((val) => {
      //       return data[0]?.proposer == val.id
      //     })?.fullNameMr
      let suchName = corporators?.find((val) => {
        return data[0]?.proposer == val.id
      })?.fullNameMr
      setSuchakName(suchName)

      //////////////////// ANUMUDAK //////////////////

      let anuName = corporators?.find((val) => {
        return data[0]?.seconder == val.id
      })?.fullNameMr

      setAnumodakName(anuName)

      //////////////////// PRESIDENT //////////////////

      let preName = corporators?.find((val) => {
        return data[0]?.president == val.id
      })?.fullNameMr

      let preNameId = corporators?.find((val) => {
        return data[0]?.president == val.id
      })?.id

      setSelectedPresidentId(preNameId)

      setPresidentName(preName)
    }
  }, [data, corporators, language])

  useEffect(() => {
    if (agendaSubDao?.length !== 0) {
      const filteredArray = []
      agendaSubDao?.forEach((obj, index) => {
        if (obj.isDirectlyAdded === true) {
          filteredArray.push({ ...obj, index })
        }
      })

      setAgendaSubDaoFiltered(filteredArray)
    }
  }, [agendaSubDao])

  // ////////////
  const commBasedFormatt = (value) => {
    switch (value) {
      case "मा. महापालिका सभा ":
        return setShowingFormat(
          `पिंपरी चिंचवड महानगरपालिकेची मासीक मा.महापालिका सभा`
        )

      case "मा. स्थायी समिती":
        return setShowingFormat(
          `पिंपरी चिंचवड महानगरपालिकेची मा.स्थायी समितीची साप्ताहीक सभा`
        )

      default:
        return setShowingFormat(
          `पिंपरी चिंचवड महानगरपालिकेची ${value}ची पाक्षिक सभा`
        )
    }
  }

  // checkTheStatus
  const checkTheStatus = (status, forwardId) => {
    let committeeNameMr
    if (status == "Forward") {
      const foundObject = sarvaNumteCommName?.find((obj) => obj.id == forwardId)

      committeeNameMr = foundObject?.committeeNameMr
      return `सदर ठराव सर्वानुमते ${committeeNameMr} ला शिफारस करण्यात येत आहे.`
    } else {
      return ""
    }

    // switch (status) {
    //   case "Reject":
    //     return "सदर ठराव सर्वानुमते नामंजूर करण्यात आला"
    //   case "Approve":
    //     return "सदर ठराव सर्वानुमते मान्य करण्यात आला"
    //   case "ON_HOLD":
    //     return "सदर ठराव सर्वानुमते तात्पुरता स्थगित करण्यात आला"

    //   default:
    //     break
    // }
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

  // PRESIDENT SHOULD BE ON THE TOP
  const presidentIndex = attendences.findIndex((val) => {
    const corporator = corporators?.find(
      (obj) => obj.id === val.listOfConcernCommitteeMembers
    )
    return corporator?.id === selectedPresidentId
  })

  if (presidentIndex !== -1) {
    const presidentItem = attendences[presidentIndex]
    attendences.splice(presidentIndex, 1) // Remove the president's item
    attendences.unshift(presidentItem) // Add the president's item to the beginning
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          style={{
            marginBottom: "30px",
            width: "100%",
            // fontSize: 20,
          }}
        >
          <div>
            {loading ? (
              <Loader />
            ) : (
              <>
                <form
                  ref={componentRef}
                  // style={{ fontSize: "16px" }}
                  style={{
                    fontSize: "16px",
                  }}
                >
                  <Grid
                    container
                    spacing={3}
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "avoid",
                      pageBreakAfter: "avoid",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "40px",
                      }}
                    >
                      <h3>
                        <strong>
                          पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११०१८{" "}
                        </strong>
                      </h3>
                      <h3>
                        <strong>{committeeName[0]?.committeeNameMr}</strong>{" "}
                      </h3>
                      <h3>
                        <strong>
                          सभावृत्तांत क्रमांक -{" "}
                          {/* {agendaNumber ? agendaNumber : ""} */}
                          {convertToMarathiNumber(agendaNumber)}
                        </strong>{" "}
                      </h3>
                    </Grid>
                  </Grid>

                  {/* 2nd  */}
                  <Grid
                    container
                    spacing={3}
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "avoid",
                      pageBreakAfter: "avoid",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginTop: "40px",
                      }}
                    >
                      <span>
                        <strong>
                          दिनांक -{" "}
                          {/* {moment(meetSchedule?.meetingDate).format(
                            "DD/MM/YYYY"
                          )} */}
                          {convertToMarathiNumber(
                            moment(meetSchedule?.meetingDate)
                              .format("DD-MM-YYYY")
                              .toString()
                          )}
                        </strong>
                      </span>
                      <span>
                        <strong>वेळ - </strong>
                        {currentTimeOfTheDay !== null &&
                          currentTimeOfTheDay}{" "}
                        {/* <strong>{timeIn12Hour && timeIn12Hour}</strong> वा. */}
                        <strong>
                          {convertToMarathiNumber(timeIn12Hour && timeIn12Hour)}
                        </strong>{" "}
                        वा.
                      </span>
                    </Grid>
                  </Grid>

                  {/* 3rd */}
                  <Grid
                    container
                    spacing={3}
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "avoid",
                      pageBreakAfter: "avoid",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "baseline",
                        marginTop: "15px",
                      }}
                    >
                      <p
                        style={{
                          textAlign: "justify",
                          textJustify: "inter-word",
                          textIndent: "65px",
                          lineHeight: "1.8",
                        }}
                      >
                        {/* पिंपरी चिंचवड महापालिकेच्या,{" "}
                        <strong>
                          मा.{" "}
                          {language == "en"
                            ? committeeName[0]?.committeeNameEn
                            : committeeName[0]?.committeeNameMr}
                          ची
                        </strong>{" "}
                        सभा  */}
                        {showingFormat && showingFormat}{" "}
                        {dayFromDate !== null && dayFromDate} दिनांक.{" "}
                        {/* <strong>
                          {moment(meetSchedule?.meetingDate).format(
                            "DD/MM/YYYY"
                          )}
                        </strong>{" "} */}
                        <strong>
                          {convertToMarathiNumber(
                            moment(meetSchedule?.meetingDate)
                              .format("DD-MM-YYYY")
                              .toString()
                          )}
                        </strong>{" "}
                        रोजी{" "}
                        {currentTimeOfTheDay !== null && currentTimeOfTheDay}{" "}
                        {/* <strong>{timeIn12Hour && timeIn12Hour}</strong> वा. */}
                        <strong>{convertToMarathiNumber(timeIn12Hour)}</strong>{" "}
                        वा. महानगरपालिकेच्या प्रशासकीय इमारतीमधील{" "}
                        <strong>{meetSchedule?.meetingPlace}</strong> येथे
                        आयोजित करण्यात आली आहे. सदर सभेत खालील प्रमाणे
                        सन्मा.सदस्य उपस्थित होते.
                      </p>
                    </Grid>
                  </Grid>

                  {/* 4th */}

                  <Grid
                    container
                    spacing={3}
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "avoid",
                      pageBreakAfter: "avoid",
                    }}
                  >
                    <Grid item style={{ marginTop: "15px" }}>
                      {attendences?.map((val, index) => {
                        const corporator = corporators?.find(
                          (obj) => obj.id === val.listOfConcernCommitteeMembers
                        )
                        const fullNameMr = corporator?.fullNameMr

                        return (
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            key={index}
                            sx={{ paddingLeft: "100px" }}
                          >
                            <ul style={{ listStyle: "none" }}>
                              <li
                                style={{
                                  padding: 5,
                                  fontWeight:
                                    corporator?.id === selectedPresidentId
                                      ? "bold"
                                      : "normal",
                                  lineHeight: "0.7", // Adjust the line-height value as needed
                                }}
                              >
                                <span>
                                  {/* {index + 1} :{" "} */}
                                  {convertToMarathiNumber(index + 1)} :{" "}
                                  {/* {language === "en" ? fullNameEn : fullNameMr} */}
                                  मा.{fullNameMr}
                                </span>
                              </li>
                            </ul>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Grid>

                  {/* 5th */}
                  <Grid
                    container
                    spacing={3}
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "avoid",
                      pageBreakAfter: "avoid",
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
                        alignItems: "baseline",
                        textAlign: "justify",
                        textJustify: "inter-word",
                        textIndent: "65px",
                      }}
                    >
                      {agendaVerdict}
                      {/* अभिनंदन ! आज सकाळी वर्तमान पत्रात आलेली तुझी बातमी की, तू
                      जिल्हास्तरीय निबंध स्पर्धेत सहभागी होऊन प्रथम क्रमांक
                      पटकावला आहेस, हे वाचून मला खूप आनंद झाला. लागलीच तुला हे
                      पत्र लिहीत आहे. शाळेत असतानाच तुझ्या विचारांनी मन भारावून
                      जायचं. ज्या पद्धतीने तू एखाद्या विषयाला अनुसरून अगदी
                      सोप्या आणि साध्या शब्दात लेख लिहायचा स सर्वांना च तुझा
                      हेवा वाटायचाअभिनंदन ! आज सकाळी वर्तमान पत्रात आलेली तुझी
                      बातमी की, */}
                    </Grid>
                  </Grid>

                  {/* //////////////////////////////////////////////////////// 2ND Page //////////////////////////////////////////////// */}

                  <Grid
                    container
                    spacing={3}
                    style={{
                      marginTop: "10px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "auto",
                      pageBreakAfter: "auto",
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
                        alignItems: "baseline",
                      }}
                    >
                      <strong>- - - - - - - - - - </strong>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        // marginTop: "40px",
                      }}
                    >
                      <h3>
                        <span>खालील प्रमाणे सुचना मांडण्यात आली. </span>
                      </h3>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",

                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginTop: "15px",
                      }}
                    >
                      <span>
                        <strong>
                          सुचक - {suchakName != null ? suchakName : ""}
                        </strong>{" "}
                      </span>
                      <span>
                        <strong>
                          अनुमोदक - {anumodakName != null ? anumodakName : ""}
                        </strong>{" "}
                      </span>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "15px",
                      }}
                    >
                      <span>
                        <strong>
                          मा. {presidentName != null ? presidentName : ""}
                        </strong>{" "}
                        यांनी आजच्या मा.
                        {/* {language == "en"
                            ? committeeName[0]?.committeeNameEn
                            : committeeName[0]?.committeeNameMr}{" "} */}
                        {committeeName[0]?.committeeNameMr} सभेचे अध्यक्ष स्थान
                        स्विकारावे.
                      </span>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span>सदर सुचना सर्वानुमते मान्य करण्यात आली.</span>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        ({" "}
                        <strong>
                          मा. {presidentName != null ? presidentName : ""}
                        </strong>{" "}
                        यांनी सभेचे अध्यक्ष स्थान स्विकारले.)
                      </span>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>- - - - - - - - - - </strong>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          textAlign: "justify",
                          textJustify: "inter-word",
                          textIndent: "65px",
                        }}
                      >
                        उपस्थित सन्मा.सदस्यांचे संमतीने खालील ऐनवेळचे विषय सभा
                        कामकाजामध्ये दाखल करून घेणेत आले.
                      </p>
                    </Grid>
                    {/* //////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                    {agendaSubDaoFiltered?.map((obj, index) => {
                      // alert("obj");
                      return (
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
                              // width: "930px",
                              // height: "200px",
                              display: "flex",
                              flexDirection: "column",
                              // justifyContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                textAlign: "justify",
                                textJustify: "inter-word",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  // textAlign: "justify",
                                  // textJustify: "inter-word",
                                }}
                              >
                                {/* विषय क्र.{" "}
                                {agendaSubDao?.length -
                                  agendaSubDaoFiltered?.length +
                                  index +
                                  1}{" "}
                                ) : */}
                                विषय क्र.{" "}
                                {convertToMarathiNumber(
                                  agendaSubDao?.length -
                                    agendaSubDaoFiltered?.length +
                                    index +
                                    1
                                )}{" "}
                                ) :
                              </label>

                              <span
                                style={{
                                  paddingLeft: "5px",
                                  // textAlign: "justify",
                                  // textJustify: "inter-word",
                                }}
                              >
                                {/* {checkB?.subject} */}
                                {obj.subject}
                              </span>
                            </div>
                            <br />
                          </div>
                        </Grid>
                      )
                    })}

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                        // pageBreakBefore: "always",
                        pageBreakInside: "avoid",
                        pageBreakBefore: "auto",
                        pageBreakAfter: "auto",
                      }}
                    >
                      <strong>- - - - - - - - - - </strong>
                    </Grid>

                    {/* ///////////////////////////////////////////////////////////////////////////////////// */}
                    {agendaSubDao
                      ?.sort((a, b) => a.tharavNo - b.tharavNo)
                      .map((obj, index) => {
                        return (
                          <Grid item xs={12} sm={12} md={12}>
                            <div>
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>
                                    <label
                                    // style={{
                                    //   fontSize: 15,
                                    //   fontWeight: 700,
                                    // }}
                                    >
                                      ठराव क्रमांक :
                                    </label>{" "}
                                    <span
                                      style={{
                                        paddingLeft: "5px",
                                        paddingTop: "30px",
                                        paddingBottom: "30px",
                                      }}
                                    >
                                      {/* {obj.tharavNo} */}
                                      {convertToMarathiNumber(obj?.tharavNo)}
                                    </span>
                                  </div>

                                  <div>
                                    <label>विषय क्रमांक :</label>{" "}
                                    <span
                                      style={{
                                        paddingLeft: "5px",
                                        paddingTop: "30px",
                                        paddingBottom: "30px",
                                      }}
                                    >
                                      {convertToMarathiNumber(index + 1)}
                                    </span>
                                  </div>
                                </div>

                                {/* ///////////////////// */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    // marginBottom: 20,
                                    // marginLeft: 90,
                                    // marginRight: 90,
                                  }}
                                >
                                  <div>
                                    <label
                                    // style={{
                                    //   fontSize: 15,
                                    //   fontWeight: 700,
                                    // }}
                                    >
                                      दिनांक :
                                    </label>{" "}
                                    <span
                                      style={{
                                        paddingLeft: "5px",
                                        paddingTop: "30px",
                                        paddingBottom: "30px",
                                      }}
                                    >
                                      {convertToMarathiNumber(
                                        moment(
                                          meetSchedule?.meetingDate
                                        ).format("DD/MM/YYYY")
                                      )}
                                    </span>
                                  </div>

                                  <div>
                                    <label
                                    // style={{
                                    //   fontSize: 15,
                                    //   fontWeight: 700,
                                    // }}
                                    >
                                      विभाग :
                                    </label>{" "}
                                    <span
                                      style={{
                                        paddingLeft: "5px",
                                        paddingTop: "30px",
                                        paddingBottom: "30px",
                                      }}
                                    >
                                      {
                                        departmentName?.find((val) => {
                                          return obj.departmentId == val.id
                                        })?.departmentNameMr
                                      }
                                    </span>
                                  </div>
                                </div>
                                {/* ///////////////////// */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 20,
                                  }}
                                >
                                  <div>
                                    <label
                                    // style={{
                                    //   fontSize: 15,
                                    //   fontWeight: 700,
                                    // }}
                                    >
                                      सुचक :
                                    </label>{" "}
                                    <span
                                      style={{
                                        paddingLeft: "5px",
                                        paddingTop: "30px",
                                        paddingBottom: "30px",
                                      }}
                                    >
                                      {
                                        corporators?.find((val) => {
                                          return obj?.suchak == val.id
                                        })?.fullNameMr
                                      }
                                    </span>
                                  </div>

                                  <div>
                                    <label
                                    // style={{
                                    //   fontSize: 15,
                                    //   fontWeight: 700,
                                    // }}
                                    >
                                      अनुमोदक :
                                    </label>{" "}
                                    <span
                                      style={{
                                        paddingLeft: "5px",
                                        paddingTop: "30px",
                                        paddingBottom: "30px",
                                      }}
                                    >
                                      {
                                        corporators?.find((val) => {
                                          return obj?.anumodak == val.id
                                        })?.fullNameMr
                                      }
                                    </span>
                                  </div>
                                </div>

                                {/* ///////////////////// */}

                                <div style={{ marginBottom: "20px" }}>
                                  <label
                                  // style={{
                                  //   fontSize: 15,
                                  //   fontWeight: 700,
                                  // }}
                                  >
                                    संदर्भ :
                                  </label>{" "}
                                  <span>{obj.reference}</span>
                                </div>

                                <div
                                  style={{
                                    textAlign: "justify",
                                    textJustify: "inter-word",
                                  }}
                                >
                                  <p>
                                    {obj?.subjectSummary &&
                                      ReactHtmlParser(obj.subjectSummary)}
                                  </p>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    marginTop: 10,
                                  }}
                                >
                                  <span style={{ marginBottom: "10px" }}>
                                    {checkTheStatus(
                                      `${obj.status}`,
                                      `${obj.forwardToComm}`
                                    )}
                                  </span>
                                  <span>
                                    सदर ठराव सर्वानुमते मान्य करण्यात आला.
                                  </span>
                                </div>

                                {/* //////////////////// */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: 10,
                                  }}
                                >
                                  <span>-----------------</span>
                                </div>
                              </div>
                            </div>
                          </Grid>
                        )
                      })}

                    {/* //////////////////// */}
                  </Grid>

                  {/* /////////////////  3RD Page ///////////////// */}
                  <Grid
                    container
                    spacing={3}
                    style={{
                      // padding: "10px",
                      marginTop: "10px",
                      paddingLeft: "10px",
                      // paddingRight: "80px",
                      pageBreakAfter: "auto",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "auto",
                    }}
                  >
                    {/* //////////////////////////////// */}
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
                      <span>
                        यानंतर मा.सभापती यांनी सभा संपल्याचे जाहीर केले.
                      </span>
                    </Grid>

                    {/* //////////////////////////////// */}
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
                      <span>-----------------</span>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{
                      marginTop: "10px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "auto",
                    }}
                  >
                    <Grid item xs={12} sm={12} md={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "30px",
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
                          <span style={{ padding: 5 }}>
                            <strong>
                              {presidentName != null
                                ? `( ${presidentName} )`
                                : ""}{" "}
                            </strong>{" "}
                          </span>
                          <span style={{ padding: 5, textAlign: "center" }}>
                            सभाध्यक्ष, {committeeName[0]?.committeeNameMr}
                          </span>
                          <span style={{ padding: 5 }}>
                            पिंपरी चिंचवड महानगरपालिका,
                          </span>
                          <span style={{ padding: 5 }}>पिंपरी - ४११०१८ </span>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={3}
                    style={{
                      marginTop: "10px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "auto",
                    }}
                  >
                    {/* ///////////////////////// */}
                    <Grid item xs={12} sm={12} md={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "30px",
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
                          <strong>{"( उल्हास बबनराव जगताप )"}</strong>
                          <span>नगरसचिव</span>
                          <span>पिंपरी चिंचवड महानगरपालिका</span>
                          <span>पिंपरी - ४११०१८</span>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                  {/* ////////////////////////////////////// */}
                  <Grid
                    container
                    style={{
                      marginTop: "10px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pageBreakInside: "avoid",
                      pageBreakBefore: "auto",
                    }}
                  >
                    <Grid
                      item
                      xs={8}
                      sm={8}
                      md={8}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "start",
                      }}
                    >
                      <span style={{ padding: 5 }}>
                        पिंपरी चिंचवड महानगरपालिका,
                      </span>
                      <span style={{ padding: 5 }}>
                        पिंपरी - १८, नगरसचिव विभाग{" "}
                      </span>
                      <span style={{ padding: 5 }}>
                        क्रमांक -{" "}
                        {data && data[0]?.momOutwardno
                          ? data[0]?.momOutwardno
                          : "Not Available"}
                      </span>
                      <span style={{ padding: 5 }}>
                        {/* दिनांक - {moment(currDate).format("DD/MM/YYYY")} */}
                        दिनांक -{" "}
                        {data &&
                          convertToMarathiNumber(
                            moment(data[0]?.proceedingDate).format("DD/MM/YYYY")
                          )}
                      </span>
                      <span style={{ padding: 5 }}>पिंपरी - ४११०१८ </span>
                    </Grid>
                  </Grid>

                  {/* //////////////////////////////////////// TABLES //////////////////////////////////////////// */}

                  {tempTableData?.map((item, index) => (
                    <div
                      className={tables.table_container}
                      // style={{ margin: "500px 10px 5px 10px" }}
                      style={{
                        pageBreakBefore: "always",
                        pageBreakAfter: "always",
                        marginBottom: "20px",
                      }}
                    >
                      <span style={{ textAlign: "center" }}>
                        (क्र.{convertToMarathiNumber(item?.outwardNo)} दिनांक.{" "}
                        {convertToMarathiNumber(item?.subjectDate)} विषय क्र.
                        {convertToMarathiNumber(item?.indexNo)} चे लगत)
                      </span>

                      <table className={tables.table}>
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
                </form>
                <Grid
                  container
                  // spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* //////////////////////////////////////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<PrintIcon />}
                      onClick={handleToPrint}
                      size="small"
                    >
                      <FormattedLabel id="print" />
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToApp />}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/municipalSecretariatManagement/transaction/calender",
                        })
                      }
                      size="small"
                    >
                      {<FormattedLabel id="back" />}
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default Index
