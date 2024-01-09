import CloseIcon from "@mui/icons-material/Close";
import {
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SiteVisitAppointmentView from "./SiteVisitAppointmentView";
import Loader from "../../../containers/Layout/components/Loader";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useSelector } from "react-redux";

// siteVisitDashboard
// http://localhost:4000/streetVendorManagementSystem/dashboards/siteVisitDashboard
// main Component
const SiteVisitDashboard = () => {
  const [loadderState, setLoadderState] = useState(false);
  // localizer
  const localizer = momentLocalizer(moment);
  // date
  const [startDateMonth, setStartDateMonth] = useState();
  const [endDateMonth, setEndDateMonth] = useState();
  
  const [selectedEventData, setSelectedEventData] = useState();
  const [roadExcavation, setRoadExcavation] = useState([]);
  const [roadExcavation1, setRoadExcavation1] = useState([]);
  const [roadExcavationMaintenance, setRoadExcavationMaintenance] = useState([]);
  const [roadExcavationMaintenance1, setRoadExcavationMaintenance1] = useState([]);
  // Dailog
  const [siteVisitAppointmentViewDailog, setSiteVisitAppointmentViewDailog] =
    useState(false);
  const siteVisitAppointmentViewDailogOpen = () =>
    setSiteVisitAppointmentViewDailog(true);
  const siteVisitAppointmentViewDailogClose = () =>
    setSiteVisitAppointmentViewDailog(false);
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const language = useSelector((state) => state.labels.language);
  // callCatchMethod
  // const callCatchMethod = (error, language) => {
  //   console.log("catchMethodStatus", catchMethodStatus);
  //   if (!catchMethodStatus) {
  //     setTimeout(() => {
  //       catchExceptionHandlingMethod(error, language);
  //       setCatchMethodStatus(false);
  //     }, [0]);
  //     setCatchMethodStatus(true);
  //   }
  // };

  // holidays
  const holidays = [
    {
      start: moment("2023-04-05T10:00:00").toDate(),
      end: moment("2023-04-05T11:00:00").toDate(),
      title: "Holiday",
      description: "sdf",
      color: "white",
      backgroundColor: "red",
    },

    {
      start: moment("2023-04-04T12:00:00").toDate(),
      end: moment("2023-04-04T13:00:00").toDate(),
      title: "Holiday",
      color: "white",
      backgroundColor: "red",
    },
  ];

  // hadleSelectEvent - onClick info
  const handleSelectEvent = useCallback((event) => {
    if (
      event?.applicationNumber != null &&
      event?.applicationNumber != undefined &&
      event?.applicationNumber != ""
    ) {
      siteVisitAppointmentViewDailogOpen();
      setSelectedEventData(event);
    }
    console.log("eventhandleSelect", event);
  }, []);

  // getAllSiteVisitAppointments
  const getAllSiteVisitAppointments = () => {
    console.log("startDateMonth2342", startDateMonth, endDateMonth);
    setLoadderState(true);
    axios
      .get(
        `${urls.RENPURL}/AppointmentScheduleReschedule/getAppointmentByFromDateAndToDate?fromDate=${startDateMonth}&toDate=${endDateMonth}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("resssdfds", res?.data);
          // roadEvents
          if(res?.data?.trnExcavationRoadCpmpletionList!=undefined && res?.data?.trnExcavationRoadCpmpletionList!=""&& res?.data?.trnExcavationRoadCpmpletionList!=null){
          setRoadExcavation(
            res?.data?.trnExcavationRoadCpmpletionList?.map((r, index) => ({
              start: moment(
                r?.appointmentScheduleRescheduleDao?.siteVisitDate + "T" + r?.appointmentScheduleRescheduleDao?.fromTime
              ).toDate(),
              end: moment(
                r?.appointmentScheduleRescheduleDao?.siteVisitDate + "T" + r?.appointmentScheduleRescheduleDao?.toTime
              ).toDate(),
              title: r?.applicationNumber,
              siteVisitTime: r?.appointmentScheduleRescheduleDao?.fromTime + " To " + r?.appointmentScheduleRescheduleDao?.toTime,
              color: "white",
              backgroundColor: "blue",
              applicationId: r?.appointmentScheduleRescheduleDao?.id,
              siteVisitDate: r?.appointmentScheduleRescheduleDao?.siteVisitDate,
              id: r?.id,
              // slotId: r?.mstSlot?.id,
              applicationNumber:
                r?.applicationNumber,
              applicationDate: r?.applicationDate,
              applicantName:
                r?.firstName +
                " " +
                r?.middleName +
                " " +
                r?.lastName,
              applicationNameMar:
                r?.firstNameMr +
                " " +
                r?.middleNameMr +
                " " +
                r?.lastNameMr,
              serviceName: r?.serviceId,
              emailAddress: r?.emailAddress,
              mobile: r?.mobileNo,
              deptName: "Road Excavation NOC Permission",
            }))
          );
        }
        if(res?.data?.nocPermissionForMaintenanceDaoList!=undefined && res?.data?.nocPermissionForMaintenanceDaoList!=""&& res?.data?.nocPermissionForMaintenanceDaoList!=null){

          setRoadExcavationMaintenance(
            res?.data?.nocPermissionForMaintenanceDaoList?.map((r, index) => ({
              start: moment(
                r?.appointmentScheduleReschedule?.siteVisitDate + "T" + r?.appointmentScheduleReschedule?.fromTime
              ).toDate(),
              end: moment(
                r?.appointmentScheduleReschedule?.siteVisitDate + "T" + r?.appointmentScheduleReschedule?.toTime
              ).toDate(),
              title: r?.applicationNumber,
              siteVisitTime: r?.appointmentScheduleReschedule?.fromTime + " To " + r?.appointmentScheduleReschedule?.toTime,
              color: "white",
              backgroundColor: "blue",
              applicationId: r?.appointmentScheduleReschedule?.id,
              siteVisitDate: r?.appointmentScheduleReschedule?.siteVisitDate,
              id: r?.id,
              // slotId: r?.mstSlot?.id,
              applicationNumber:
                r?.applicationNumber,
              applicationDate: r?.applicationDate,
              applicantName:
                r?.firstName +
                " " +
                r?.middleName +
                " " +
                r?.lastName,
              applicationNameMar:
                r?.firstNameMr +
                " " +
                r?.middleNameMr +
                " " +
                r?.lastNameMr,
              serviceName: r?.serviceId,
              emailAddress: r?.emailAddress,
              mobile: r?.mobileNo,
              deptName: "Road Excavation NOC Permission Maintenance",
            }))
          );
          }
         
          setLoadderState(false);
        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {
        setLoadderState(false);
        // callCatchMethod(error, language);
      });
  };
  console.log("roadState", roadExcavation);
  // weekends  
  const _dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 6 && {
        style: {
          color: "red",
          backgroundColor: "#FFA07A",
        },
      }),
      ...(moment(date).day() === 0 && {
        style: {
          color: "red",
          backgroundColor: "#FFA07A",
        },
      }),
    }),
    []
  );

  // onNavigate - Back / Next / Today Button
  const onNavigate = (date, MonthWeekDay) => {
    console.log("StartDate12312", date, "MonthWeekDay:", MonthWeekDay);
    // month start Date
    setStartDateMonth(moment(date).startOf("month").format("YYYY-MM-DD"));
    // month end Date
    setEndDateMonth(moment(date).endOf("month").format("YYYY-MM-DD"));

    console.log(
      "bhava234234",
      moment(date).startOf("month").format("YYYY-MM-DD"),
      moment(date).endOf("month").format("YYYY-MM-DD")
    );
  };

  // Filtered Events
  const getFilteredEvents = () => {
    //Road 1
    console.log("data23423", roadExcavation);
    let roadExcavationDataEvt = roadExcavation?.filter((data) => {
      if (
        data?.applicationNumber != null &&
        data?.applicationNumber != undefined &&
        data?.applicationNumber != ""
      ) {
        return data;
      }
    });
    console.log("roadExcavationDataEvt", roadExcavationDataEvt);
    setRoadExcavation1(roadExcavationDataEvt);
    //Road maintenance
    let roadExcavationMainDataEvt = roadExcavationMaintenance?.filter((data) => {
      if (
        data?.applicationNumber != null &&
        data?.applicationNumber != undefined &&
        data?.applicationNumber != ""
      ) {
        return data;
      }
    });
    console.log("roadExcavationMainDataEvt", roadExcavationMainDataEvt);
    {
      roadExcavationMainDataEvt &&
      setRoadExcavationMaintenance1(roadExcavationMainDataEvt);
    }

  };

  // ================== useEffects ============>

  // initial useEffect
  useEffect(() => {
    // current Date
    const date = new Date();
    // month start Date
    setStartDateMonth(moment(date).startOf("month").format("YYYY-MM-DD"));
    // month end Date
    setEndDateMonth(moment(date).endOf("month").format("YYYY-MM-DD"));
  }, []);

  useEffect(() => {
    console.log("roadExcavation", roadExcavation);
    getFilteredEvents();
  }, [roadExcavation,roadExcavationMaintenance]);

  //  onNavigate Trigger
  useEffect(() => {
    console.log(
      "StartDateMonth:",
      startDateMonth,
      "endDateMonth:",
      endDateMonth
    );
    if (startDateMonth != undefined && endDateMonth != undefined) {
      getAllSiteVisitAppointments();
    }
  }, [startDateMonth, endDateMonth]);

  // particular event pass to SiteVisitAppointmentViewComponent 
  useEffect(() => {
    console.log("Selected Event Data ---> ", selectedEventData);
  }, [selectedEventData]);

  useEffect(() => {
    console.log(
      "Events1112",
      roadExcavation1,
      );
  }, [roadExcavation1,roadExcavationMaintenance1]);

  // view
  return (
    <div>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          square
          sx={{
            padding: 1,
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: "white",
          }}
          elevation={5}
        >
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "65px",
              borderRadius: 100,
            }}
          >
            <strong>{language == "en" ? " Site Visit Dashboard" : "साइट भेट डॅशबोर्ड"}</strong>
          </div>

          <div style={{ height: "90vh", padding: "5vh" }}>
            <Calendar
              // localizer
              localizer={localizer}
              // events
              events={[
                ...roadExcavation1,
                ...roadExcavationMaintenance1,
                ...holidays,
              ]}
              // popup={true}
              onSelectEvent={handleSelectEvent}
              // navigate
              onNavigate={onNavigate}
              // default
              defaultView="month"
              defaultDate={new Date()}
              // min={moment("2023-04-30T08:00:00").toDate()}
              // max={moment("2023-04-30T23:00:00").toDate()}
              // holidays
              dayPropGetter={_dayPropGetter}
              // Color - based on event
              eventPropGetter={(myEventsList) => {
                console.log("myEventsList", myEventsList);
                const backgroundColor = myEventsList.backgroundColor
                  ? myEventsList.backgroundColor
                  : "blue";
                const color = myEventsList.color ? myEventsList.color : "white";
                return { style: { backgroundColor, color } };
              }}
            />
          </div>
        </Paper>
      )}
      {/** Form Preview Dailog  - OK */}
      <Dialog
        fullWidth
        maxWidth={"xl"}
        open={siteVisitAppointmentViewDailog}
        onClose={() => siteVisitAppointmentViewDailogClose()}
      >
        <CssBaseline />
        <DialogTitle>
          <Grid container>
            <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
              <strong> {language == "en" ? "Site Visit Appointment View" : "साइट भेट अपॉइंटमेंट दृश्य"}</strong>
            </Grid>
            <Grid
              item
              xs={1}
              sm={2}
              md={4}
              lg={6}
              xl={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <IconButton
                aria-label="delete"
                sx={{
                  marginLeft: "530px",
                  backgroundColor: "primary",
                  ":hover": {
                    bgcolor: "red", // theme.palette.primary.main
                    color: "white",
                  },
                }}
                onClick={() => {
                  siteVisitAppointmentViewDailogClose();
                }}
              >
                <CloseIcon
                  sx={{
                    color: "black",
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {/** 
            <FormProvider {...methods}>*/}
          <SiteVisitAppointmentView selectedEventData={selectedEventData} />
          {/**  </FormProvider>*/}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteVisitDashboard;
