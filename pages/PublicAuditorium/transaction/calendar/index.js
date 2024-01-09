import { Box, Button, Grid, Modal, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useEffect } from "react";
import axios from "axios";
import urls from "../../../../URLS/urls";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const localizer = momentLocalizer(moment);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const token = useSelector((state) => state.user.user.token);
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

  const generateDaysOfMonth = (year, month) => {
    const firstDayOfMonth = moment({ year, month, day: 1 });
    const lastDayOfMonth = moment(firstDayOfMonth).endOf("month");
    const days = [];

    let currentDay = moment(firstDayOfMonth);
    while (currentDay.isSameOrBefore(lastDayOfMonth, "day")) {
      days.push(currentDay.toDate());
      currentDay.add(1, "day");
    }

    return days;
  };

  useEffect(() => {
    // const year = moment().year();
    // const month = moment().month(); // July (months are 0-indexed, so January is 0, February is 1, and so on)

    // const daysOfMonth = generateDaysOfMonth(year, month);

    // setMeetings(
    //   daysOfMonth?.map((val) => {
    //     return {
    //       start: val,
    //       end: val,
    //       title: `Booking Available`,
    //     };
    //   })
    // );
    getAuditoriumBookingWithoutPagination();
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const calendarStyles = {
    calendar: {
      height: "80vh",
      width: "100%",
      backgroundColor: "white",
      border: "1px solid gray",
      borderRadius: 5,
      fontFamily: "Arial, sans-serif",
      // fontSize: `15px`,
    },
    toolbar: {
      border: "1px solid red",
      backgroundColor: "red",
      display: "flex",
      justifyContent: "center",
      marginBottom: 10,
    },
    dateHeader: {
      color: "white",
      background: "#2D74B4",
      fontWeight: "bold",
      fontFamily: `serif`,
      fontSize: `18px`,
    },
  };

  const CustomEventComponent = ({ event }) => (
    <div
      onMouseEnter={() => {
        setSelectedEvent(event);
        event?.title && setIsModalOpen(true);
      }}
    >
      {event.title}
    </div>
  );

  const handleSelectSlot = (e) => {
    console.log("e", e);
  };

  const getAuditoriumBookingWithoutPagination = () => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res aud", res?.data);

        setLoading(false);
        let result = res?.data?.trnAuditoriumBookingOnlineProcessList;

        console.log("result 443", result);

        // let timeSlots = result?.map((val) => {
        //   return {
        //     key: JSON.parse(val.timeSlotList),
        //     key2: val.applicationStatus,
        //   };
        // });

        let ffg = [...result];
        let nn = [];

        ffg?.forEach((item) => {
          if (
            item?.timeSlotList !== null &&
            typeof item?.timeSlotList !== "undefined"
          ) {
            let oo = []?.concat(...JSON.parse(item?.timeSlotList));
            oo.forEach((obj) => {
              obj.applicationStatus = item?.applicationStatus;
              obj.applicantName = item?.applicantName;
            });
            delete item?.key2;
            nn?.push(oo);
          }
        });

        const mergedArray = []?.concat(...nn);

        setMeetings((prev) =>
          prev?.concat(
            mergedArray?.map((val) => {
              return {
                start: moment(val?.bookingDate).format("YYYY/MM/DD"),
                end: moment(val?.bookingDate).format("YYYY/MM/DD"),
                title:
                  val?.applicationStatus == "PAYMENT_SUCCESSFUL"
                    ? `Booked (${val?.fromTime} To ${val.toTime})`
                    : `${val?.fromTime} To ${val.toTime}`,
                applicationStatus: val?.applicationStatus,
                applicantName: val?.applicantName,
              };
            })
          )
        );

        // let filterMeetings = result.filter((item) => {
        //   return item.applicationStatus == "PAYMENT_SUCCESSFUL";
        // });

        // let timeSlots = filterMeetings?.map((val) => {
        //   return JSON.parse(val.timeSlotList);
        // });

        // const mergedArray = [].concat(...timeSlots);

        // setMeetings(
        //   mergedArray?.map((val) => {
        //     return {
        //       start: moment(val.bookingDate).format("YYYY/MM/DD"),
        //       end: moment(val.bookingDate).format("YYYY/MM/DD"),
        //       title: `${val.fromTime} To ${val.toTime}`,
        //     };
        //   })
        // );

        // let PS = mergedArray?.map((val) => {
        //     return {
        //       start: moment(val.bookingDate).format("YYYY/MM/DD"),
        //       end: moment(val.bookingDate).format("YYYY/MM/DD"),
        //       title: `${val.fromTime} To ${val.toTime}`,
        //     };
        //   })

        //   let filterMeetingsAS = result.filter((item) => {
        //     return item.applicationStatus == "APPLICATION_SUBMITTED";
        //   });

        //   let timeSlotsAS = filterMeetingsAS?.map((val) => {
        //     return val?.timeSlotList && JSON.parse(val?.timeSlotList);
        //   });

        //   const mergedArrayAS = [].concat(...timeSlotsAS);

        //   console.log("mergedArrayAS",mergedArrayAS?.map((val) => ({
        //     start: moment(val?.bookingDate).format("YYYY/MM/DD"),
        //     end: moment(val?.bookingDate).format("YYYY/MM/DD"),
        //     title: `${val?.fromTime} To ${val?.toTime}`,
        //   })
        // ))

        //   setMeetings([
        //     ...PS,
        //     ...mergedArrayAS?.map((val) => ({
        //         start: moment(val?.bookingDate).format("YYYY/MM/DD"),
        //         end: moment(val?.bookingDate).format("YYYY/MM/DD"),
        //         title: `${val?.fromTime} To ${val?.toTime}`,
        //         AS: true
        //       })
        //     ),
        //   ]);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  return (
    <div>
      <Grid container>
        <PabbmHeader labelName="calendar" />
      </Grid>
      <Box
        style={{
          padding: "10px",
        }}
      >
        <Calendar
          // date={watch("fromDate")}
          date={new Date()}
          localizer={localizer}
          events={meetings}
          startAccessor="start"
          endAccessor="end"
          // onSelectSlot={handleSelectSlot}
          selectable={true}
          popup={true}
          // style={{
          //   height: "80vh",
          //   width: "80vw",
          // }}
          style={calendarStyles.calendar}
          step={30}
          defaultView="month"
          selectRange={true}
          // views={["month", "week", "day"]}
          views={["month"]}
          // defaultDate={new Date()}
          defaultDate={new Date()}
          scrollToTime={new Date(1970, 1, 1, 6)}
          onSelectEvent={(e) => handleSelectEvent(e)}
          onSelectSlot={(e) => handleSelectSlot(e)}
          // onNavigate={(e) => handleSelectSlot(e)}
          eventPropGetter={(event) => {
            console.log("eve", event);
            const backgroundColor = event.AS ? "red" : "green";
            // const backgroundColor =
            //   event.title == "Booking Available" ? "green" : "gray";
            return { style: { backgroundColor } };
          }}
          components={{
            month: {
              header: ({ label }) => (
                <div style={calendarStyles.dateHeader}>{label}</div>
              ),
            },
            event: CustomEventComponent,
          }}
        />

        {/* .............................MODAL............................... */}

        <Modal
          title="Event Modal"
          open={isModalOpen}
          onClose={handleCancel}
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
              height: "70%",
              padding: "10px",
              width: "40%",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // alignItems: "center",
              borderRadius: "5px",
            }}
            onMouseLeave={() => {
              setIsModalOpen(false);
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "600" }}>
                Event Details
              </Typography>
            </Box>
            <Grid container>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "600" }} variant="h6">
                  Applicant Name -
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">
                  {`${selectedEvent?.applicantName}`}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "600" }} variant="h6">
                  Booking time -
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">
                  {`${selectedEvent?.title}`}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "600" }} variant="h6">
                  Date -
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">
                  {`${moment(selectedEvent?.start).format("DD/MM/YYYY")}`}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "600" }} variant="h6">
                  Day -
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">
                  {`${moment(selectedEvent?.start).format("dddd")}`}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "600" }} variant="h6">
                  Application Status -
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">
                  {`${
                    selectedEvent?.applicationStatus
                      ?.split("_")
                      .join(" ")
                      .charAt(0)
                      .toUpperCase() +
                    selectedEvent?.applicationStatus
                      ?.split("_")
                      .join(" ")
                      .slice(1)
                      .toLowerCase()
                  }`}
                </Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToAppIcon />}
              style={{
                marginTop: "20px",
                borderRadius: "20px",
              }}
              size="small"
              onClick={handleCancel}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default Index;
