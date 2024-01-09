import React, { useCallback, useEffect, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import PropTypes from "prop-types"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import { Box, CircularProgress, Modal, Paper, TextField } from "@mui/material"
import axios from "axios"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import URLs from "../../../../URLS/urls"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import urls from "../../../../URLS/urls"
import { useRouter } from "next/router"
import { filterDocketAddToLocalStorage } from "../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import UploadButton from "../../../../containers/reuseableComponents/UploadButton"
import { Close, Send } from "@mui/icons-material"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

function SimpleDialog(props) {
  const { onClose, setSelectedValue, open } = props
  const [_selectedValue, _setSelectedValue] = useState()

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box>
        <DialogTitle>Event Name</DialogTitle>
        <List
          style={{
            padding: "20px",
            // paddingRight: "20px",
          }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Enter event name"
            label="Enter event name"
            value={_selectedValue}
            onChange={(e) => {
              _setSelectedValue(e.target.value)
            }}
          />
          <Button
            onClick={() => {
              setSelectedValue(_selectedValue)
              onClose()
            }}
          >
            Ok
          </Button>
        </List>
      </Box>
    </Dialog>
  )
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
}

const localizer = momentLocalizer(moment)

const CalenderSchedulingAndHoliday = (props) => {
  const [attachment, setAttachment] = useState("")
  const [loading, setLoading] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [sendquery, setSendquery] = useState([])
  const [queryAgendaNo, setQueryAgendaNo] = useState([])
  const [committeName1, setCommitteName1] = useState(null)
  const [committeName2, setCommitteName2] = useState(null)
  const [committeId, setCommitteId] = useState(null)

  const [agendaNoToSendMail, setAgendaNoToSendMail] = useState(null)

  const [startDateLo, setstartDateLo] = useState()
  const [endDateLo, setendDateLo] = useState()
  const [isApplicable, setIsApplicable] = useState(true)
  const router = useRouter()

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

  const getAllMeetings = () => {
    setLoading(true)
    axios
      .get(
        `${urls.MSURL}/trnPrepareMeetingAgenda/getByFromDate?fromDate=${
          startDateLo
            ? startDateLo
            : moment(new Date()).startOf("month").format("YYYY-MM-DD")
        }&toDate=${
          endDateLo
            ? endDateLo
            : moment(new Date()).endOf("month").format("YYYY-MM-DD")
        }`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        if (r?.status === 200 || r?.status === 201) {
          if (r?.data?.length !== 0) {
            language == "en"
              ? toast.success(
                  `You Have ${r?.data?.length}  Meetings, Here We Go....`
                )
              : toast.success(`तुमच्या ${r?.data?.length} मीटिंग्ज आहेत`)
            ////////////////////
            setMeetings(
              r?.data?.map((row) => ({
                // id: row.id,
                // meetingDate: row.meetingDate,
                // meetingPlace: row.meetingPlace,
                id: row.id,
                title:
                  row?.committeeName
                    ?.split(" ")
                    .map((word) => word.charAt(0))
                    .join("") +
                  " " +
                  row?.meetingTime,
                start: moment(row.meetingDate).format("YYYY/MM/DD"),
                end: moment(row.meetingDate).format("YYYY/MM/DD"),
                resourceId: 1,
                agendaNo: row.agendaNo,
                title1: row?.committeeName,
                title2: row?.committeeNameMr,
                /////////////////////////
                attendancePrepared: row?.attendancePrepared,
                momPrepared: row?.momPrepared,
                committeeId: row.committeeId,

                mailSent: row.mailSent,
              }))
            )
            setLoading(false)
          } else {
            language == "en"
              ? toast.error("No Data Found ")
              : toast.error("कोणताही डेटा आढळला नाही")
            setLoading(false)
          }
        } else {
          language == "en"
            ? toast.error("Something Went Wrong!")
            : toast.error("काहीतरी चूक झाली!")
          setLoading(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // } else {
        //   sweetAlert(error)
        //   setLoading(false)
        // }
        callCatchMethod(error, language)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (startDateLo && endDateLo) {
      getAllMeetings()
    } else {
      getAllMeetings()
    }
  }, [startDateLo, endDateLo])

  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = useState()
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenForEmail, setIsModalOpenForEmail] = useState(false)
  const [OptionsForRoute, setOptionsForRoute] = useState([
    { name: "Subject/Agenda" },
    { name: "Attendance" },
    { name: "Proceeding" },
    { name: "Reschedule Meeting" },
    { name: "Honorarium Process" },
  ])

  const [checkAttend, setCheckAttend] = useState(null)
  const [checkMOMStatus, setCheckMOMStatus] = useState(null)
  const [eventDate, setEventDate] = useState(null)
  const [checkMailStatus, setCheckMailStatus] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
  })

  // useEffect(() => {
  //   getCalendarAndHolidays()
  // }, [])

  // const getCalendarAndHolidays = () => {
  //   axios
  //     // .get(`http://localhost:8090/cfc/api/master/calendarAndHolidays/getAll`)
  //     .get(`${URLs.CFCURL}/master/calendarAndHolidays/getAll`)
  //     .then((res) => {
  //       console.log("data: ", res)
  //       let result = res.data.calendarAndHolidays
  //       let _res = result.map((val, i) => {
  //         // {
  //         //   id: 0,
  //         //   title: "Board meeting",
  //         //   start: new Date(2018, 11, 29, 9, 0, 0),
  //         //   end: new Date(2018, 11, 29, 13, 0, 0),
  //         //   resourceId: 1,
  //         //  }
  //         return {
  //           activeFlag: val.activeFlag,
  //           srNo: val.id,
  //           calenderPrefix: val.calenderPrefix,
  //           title: val.event,
  //           id: val.id,
  //           start: val.holidayDate,
  //           end: val.holidayDate,
  //           month: val.month,
  //           nameOfYear: val.nameOfYear,
  //           remark: val.remark,
  //           status: val.activeFlag === "Y" ? "Active" : "Inactive",
  //         }
  //       })
  //       console.log("_res ", _res)
  //       // setEvents(_res)
  //     })
  // }

  // const addEvent = (start, title) => {
  //   console.log("start,title", start, title)

  //   const bodyForAPI = {
  //     // ...formData,
  //     nameOfYear: Number(moment(start).format("YYYY")),
  //     month: Number(moment(start).format("MM")),
  //     holidayDate: start,
  //     event: title,
  //   }

  //   console.log("data ", bodyForAPI)

  //   axios
  //     .post(
  //       // `http://localhost:8090/cfc/api/master/calendarAndHolidays/save`,
  //       `${URLs.CFCURL}/master/calendarAndHolidays/save`,
  //       bodyForAPI
  //     )
  //     .then((response) => {
  //       console.log("response1", response)
  //     })
  // }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (value) => {
    console.log("56", value)
    setOpen(false)
  }

  // const handleSelectSlot = useCallback(
  //   ({ start, end }) => {
  //     console.log("start", start)
  //     // handleClickOpen();
  //     // if (selectedValue) {
  //     //   setEvents((prev) => [...prev, { start, end, title }]);
  //     // }
  //     const title = window.prompt("Event Name")
  //     if (title) {
  //       setEvents((prev) => [...prev, { start, end, title }])
  //       addEvent(end, title)
  //     }
  //   },
  //   [setEvents]
  // )

  const handleSelectEvent = useCallback(
    // (event) => window.alert(event.title),
    (event) => {
      loging(event), setIsModalOpen(true)
    },
    []
  )

  // ...................>>>>>>>>>>>><<<<<<<<<<<<...................
  const loging = (event) => {
    console.log("..........events", event)
    setSendquery(event)
    setQueryAgendaNo(event.agendaNo)
    setCommitteName1(event.title1)
    setCommitteName2(event.title2)
    setCommitteId(event.committeeId)

    setAgendaNoToSendMail(event.agendaNo)

    // filterDocketAddToLocalStorage("startDate", event.start)
    // filterDocketAddToLocalStorage("queryParams", event)

    // REMOVING ALL CONDITIONS FROM HERE, BEACUSE DEPARTMENT NOT WANT THIS ////////
    setCheckAttend(event?.attendancePrepared)
    setCheckMOMStatus(event?.momPrepared)
    setEventDate(event?.start)

    setCheckMailStatus(event?.mailSent)

    let eventDate = event?.start
    let currDate = moment(new Date()).format("YYYY/MM/DD")
    let checkAttend = event?.attendancePrepared
    let checkMom = event?.momPrepared

    if (eventDate != null && currDate != null && checkAttend != null) {
      console.log("all set ")
      if (eventDate > currDate) {
        console.log("ghari ja")
        setIsApplicable(true)
      } else if (eventDate < currDate) {
        console.log("kharach ghari ja")
        setIsApplicable(true)
      } else {
        console.log("tuch bhava")
        if (checkAttend) {
          console.log("gg bhava")
          setIsApplicable(true)
        }
        if (!checkAttend) {
          console.log("sorry bhava")
          setIsApplicable(false)
        }
        if (checkMom) {
          setCheckMOMStatus(true)
        }
        if (!checkMom) {
          setCheckMOMStatus(false)
        }
      }
    }

    return event
  }

  const calendarStyles = {
    calendar: {
      padding: "3vh",
      height: "90vh",
      backgroundColor: "white",
      // border: "1px solid blue",
      borderRadius: 5,
      fontFamily: "Arial, sans-serif",
      fontSize: `15px`,
    },
    toolbar: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 10,
      border: "solid red",
    },
    dateHeader: {
      color: "white",
      background: "purple",
      fontWeight: "bold",
      fontFamily: `serif`,
      fontSize: `18px`,
    },
  }

  // ////////////////////////////////////////////////////

  const _dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 6 && {
        style: {
          color: "red",
          backgroundColor: "orange",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // width: "50px",
        },
      }),
      ...(moment(date).day() === 0 && {
        style: {
          color: "red",
          backgroundColor: "orange",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // width: "50px",
        },
      }),
    }),
    []
  )

  const onView = useCallback((newView) => console.log("newView", newView))

  //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   //
  const showModal = () => {
    setIsModalOpen(true)
    // alert("true")
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)

    setAgendaNoToSendMail(null)
  }

  const handleEmailCancel = () => {
    setIsModalOpenForEmail(false)

    {
      attachment &&
        axios
          .delete(`${URLs.CFCURL}/file/discard?filePath=${attachment}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setAttachment("")
            }
          })
    }
  }

  // .startOf("week")
  //  .endOf("week")
  // ...........................>>>>>>>>>>
  const onNavigate = (date, view) => {
    let start, end

    if (view === "month") {
      // start = moment(date).startOf("month").format("YYYY-MM-DD")
      // console.log(start)
      // end = moment(date).endOf("month").format("YYYY-MM-DD")
      setstartDateLo(moment(date).startOf("month").format("YYYY-MM-DD"))
      console.log(start)
      setendDateLo(moment(date).endOf("month").format("YYYY-MM-DD"))
    }
    console.log("Navigate", start, end)

    return console.log({ start, end })
  }

  // useEffect(() => {
  //   const date = new Date()
  //   setstartDateLo(moment(date).startOf("month").format("YYYY-MM-DD"))
  //   setendDateLo(moment(date).endOf("month").format("YYYY-MM-DD"))
  // }, [])

  let currDate = moment(new Date()).format("YYYY/MM/DD")

  console.log("::kol", currDate)

  useEffect(() => {
    if (eventDate != null && currDate != null && checkAttend != null) {
      console.log("all set ")
      if (eventDate > currDate) {
        console.log("ghari ja")
        setIsApplicable(false)
      } else if (eventDate < currDate) {
        console.log("kharach ghari ja")
        setIsApplicable(false)
      } else {
        console.log("tuch bhava")
        if (checkAttend) {
          console.log("gg bhava")
          setIsApplicable(true)
        }
        // else {
        //   console.log("sorry bhava")
        //   setIsApplicable(false)
        // }
        if (!checkAttend) {
          console.log("sorry bhava")
          setIsApplicable(false)
        }
        if (checkMOMStatus) {
          setCheckMOMStatus(true)
        }
        if (!checkMOMStatus) {
          setCheckMOMStatus(false)
        }
      }
    }
  }, [checkAttend, checkMOMStatus, eventDate, currDate])

  // useEffect(() => {
  //   console.log("isApplicable------", isApplicable);
  // }, [isApplicable]);

  // useEffect(() => {
  //   console.log("eventDate:-", eventDate);
  // }, [eventDate]);

  // useEffect(() => {
  //   console.log("currDate:-", currDate);
  // }, [currDate]);

  const sendAgenda = () => {
    let apiBody = {
      agendaNo: agendaNoToSendMail && agendaNoToSendMail,
      filePath: [attachment],
    }
    setLoading(true)
    axios
      .post(
        `${URLs.MSURL}/trnPrepareMeetingAgenda/sendMeetingCircularOnMail`,
        apiBody,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          console.log(res.data)
          sweetAlert("Success", "Agenda sent successfully !", "success")
          setLoading(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log("error", error)
        if (!error.status) {
          console.log(":1000", error)
          sweetAlert({
            title: "ERROR",
            text: "Server is unreachable or may be a network issue, please try after sometime",
            icon: "warning",
            dangerMode: false,
            closeOnClickOutside: false,
          })
          setLoading(false)
        } else {
          sweetAlert(error)
          setLoading(false)
        }
      })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper elevation={4} style={{ marginTop: "1px", width: "auto" }}>
        <Calendar
          localizer={localizer}
          events={meetings}
          startAccessor="start"
          endAccessor="end"
          // onSelectSlot={handleSelectSlot}
          selectable={true}
          popup={true}
          style={calendarStyles.calendar}
          step={30}
          defaultView="month"
          selectRange={true}
          // views={["month", "week", "day"]}
          views={["month"]}
          defaultDate={new Date()}
          scrollToTime={new Date(1970, 1, 1, 6)}
          onSelectEvent={handleSelectEvent}
          onView={onView}
          onNavigate={onNavigate}
          dayPropGetter={_dayPropGetter}
          eventPropGetter={(event) => {
            const backgroundColor = event.allday ? "yellow" : "#bff5ec"
            const color = "black"
            const border = "1px solid black"
            const fontWeight = "bold"
            const fontSize = 13
            return {
              style: { backgroundColor, color, border, fontWeight, fontSize },
            }
          }}
          components={{
            month: {
              header: ({ label }) => (
                <div style={calendarStyles.dateHeader}>{label}</div>
              ),
            },
          }}
        />
      </Paper>

      {/* .............................MODAL............................... */}

      <Modal
        title="Welcom to Calendar Modal"
        open={isModalOpen}
        onOk={true}
        // onClose={handleCancel}
        footer=""
        // width="1800px"
        // height="auto"
        sx={{
          padding: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "auto",
            width: "290px",
            // backgroundColor: "#8a79c9",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "12px solid purple",
            borderRadius: "24px",
            borderLeft: "1px solid purple ",
            borderRight: "1px solid purple ",
            borderBottom: "3px solid purple",
            padding: "10px",
          }}
        >
          <Button
            // disabled={checkAttend ? true : false}
            disabled={checkMailStatus ? true : false}
            style={{
              backgroundColor:
                checkMailStatus && checkMailStatus ? "#800080" : "aqua",
              width: "90%",
              marginBottom: "3%",
              color: checkMailStatus && checkMailStatus ? "red" : "black",
              fontSize: 15,
              fontWeight: "bold",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              // setIsModalOpenForEmail(true)
              router.push({
                pathname:
                  "/municipalSecretariatManagement/reports/meetingAgenda/print",
                query: {
                  agendaNo: queryAgendaNo,
                  pageMode: "sendAgendaOnEmail",
                },
              })
            }}
          >
            <FormattedLabel id="sendAgendaOnEMail" />
          </Button>

          <Button
            disabled={checkMOMStatus}
            style={{
              backgroundColor:
                checkMOMStatus && checkMOMStatus ? "#800080" : "aqua",
              width: "90%",
              marginBottom: "3%",
              color: checkMOMStatus && checkMOMStatus ? "red" : "black",
              fontSize: 15,
              fontWeight: "bold",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              console.log("...sendquery", sendquery)
              router.push(
                {
                  pathname:
                    "/municipalSecretariatManagement/transaction/meetingReScheduling",
                  query: sendquery,
                },
                "/municipalSecretariatManagement/transaction/meetingReScheduling"
              )

              filterDocketAddToLocalStorage("queryParams", sendquery)
            }}
          >
            <FormattedLabel id="meetingReschedule" />
          </Button>

          <Button
            // disabled={checkAttend ? true : false}
            disabled={checkMOMStatus}
            style={{
              backgroundColor:
                checkMOMStatus && checkMOMStatus ? "#800080" : "aqua",
              width: "90%",
              marginBottom: "3%",
              color: checkMOMStatus && checkMOMStatus ? "red" : "black",
              fontSize: 15,
              fontWeight: "bold",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              router.push({
                pathname:
                  "/municipalSecretariatManagement/transaction/markAttendance",
                query: {
                  // agendaNo: queryAgendaNo,
                  // commId: committeId ? committeId : null,
                  // committeeId: committeName1 !== null ? committeName1 : "",
                  agendaNo: queryAgendaNo,
                  committeName: committeName1 !== null ? committeName1 : "",
                  committeNameMr: committeName2 !== null ? committeName2 : "",
                  committeeId: committeId ? committeId : null,
                },
              })
            }}
          >
            <FormattedLabel id="attendance" />
          </Button>

          <Button
            disabled={checkMOMStatus}
            style={{
              backgroundColor:
                checkMOMStatus && checkMOMStatus ? "#800080" : "aqua",
              width: "90%",
              marginBottom: "3%",
              color: checkMOMStatus && checkMOMStatus ? "red" : "black",
              fontSize: 15,
              fontWeight: "bold",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              router.push({
                pathname:
                  "/municipalSecretariatManagement/transaction/minutesOfMeeting",
                query: {
                  agendaNo: queryAgendaNo,
                  committeName: committeName1 !== null ? committeName1 : "",
                  committeNameMr: committeName2 !== null ? committeName2 : "",
                  committeeId: committeId ? committeId : null,
                },
              })
            }}
          >
            <FormattedLabel id="MOM" />
          </Button>

          <Button
            disabled={checkMOMStatus ? false : true}
            style={{
              backgroundColor:
                checkMOMStatus && checkMOMStatus ? "aqua" : "#800080",
              width: "90%",
              marginBottom: "3%",
              color: checkMOMStatus ? "black" : "red",
              fontSize: 15,
              fontWeight: "bold",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              router.push({
                pathname: "/municipalSecretariatManagement/reports/Proceeding",
                query: {
                  agendaNo: queryAgendaNo,
                },
              })
            }}
          >
            <FormattedLabel id="proceedingReport" />
          </Button>

          <Button
            variant="contained"
            color="error"
            endIcon={<Close />}
            style={{
              marginTop: "20px",
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
            }}
            size="small"
            onClick={handleCancel}
          >
            <FormattedLabel id="close" />
          </Button>
          {/* <div
            style={{
              top: "60%",
              // bottom: ,
              position: "fixed",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // gap: 90,
            }}
          >
            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToAppIcon />}
              style={{ borderRadius: "20px" }}
              size="small"
              onClick={handleCancel}
            >
              Close
            </Button>
          </div> */}
        </Box>
      </Modal>

      {/* ADD ATTACHMENT  */}

      <Modal
        title="Send On E-Mail"
        open={isModalOpenForEmail}
        onOk={true}
        footer=""
        sx={{
          padding: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "auto",
            width: "auto",
            backgroundColor: "#8a79c9",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "12px solid purple",
            borderRadius: "24px",
            borderLeft: "1px solid purple ",
            borderRight: "1px solid purple ",
            borderBottom: "3px solid purple",
            padding: "10px",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paper
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "white",
                  borderRadius: "50%",
                  padding: 8,
                }}
                elevation={8}
              >
                <CircularProgress color="success" />
              </Paper>
            </div>
          ) : (
            <>
              <UploadButton
                appName="TP"
                serviceName="PARTMAP"
                label="Select File To Send"
                filePath={attachment}
                fileUpdater={setAttachment}
                // view
              />
              {attachment && (
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<Send sx={{ color: "white" }} />}
                  onClick={() => {
                    sendAgenda()
                  }}
                >
                  Send
                </Button>
              )}
              {/* ///////////////////////////// */}
              <Button
                variant="contained"
                color="error"
                endIcon={<Close />}
                style={{
                  marginTop: "20px",
                  borderRadius: "20px",
                  color: "white",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
                size="small"
                onClick={handleEmailCancel}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  )
}

export default CalenderSchedulingAndHoliday
