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
import SiteVisitAppointmentView from "../../../components/streetVendorManagementSystem/components/SiteVisitAppointmentView";
import Loader from "../../../containers/Layout/components/Loader";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../util/util";

// siteVisitDashboard
// main Component
//! -----------Sachin Durge ----------------->
const SiteVisitDashboard = () => {
  const [loadderState, setLoadderState] = useState(false);
  const localizer = momentLocalizer(moment);
  const [startDateMonth, setStartDateMonth] = useState();
  const [endDateMonth, setEndDateMonth] = useState();
  const [issuanceEvents, setIssuanceEvents] = useState([]);
  const [renewaleEvents, setRenewalEvents] = useState([]);
  const [cancellationEvents, setCancellationEvents] = useState([]);
  const [transferEvents, setTransferEvents] = useState([]);
  const [issuanceEvents1, setIssuanceEvents1] = useState([]);
  const [renewaleEvents1, setRenewalEvents1] = useState([]);
  const [cancellationEvents1, setCancellationEvents1] = useState([]);
  const [transferEvents1, setTransferEvents1] = useState([]);
  const [selectedEventData, setSelectedEventData] = useState();
  // Dailog
  const [siteVisitAppointmentViewDailog, setSiteVisitAppointmentViewDailog] =
    useState(false);
  const siteVisitAppointmentViewDailogOpen = () =>
    setSiteVisitAppointmentViewDailog(true);
  const siteVisitAppointmentViewDailogClose = () =>
    setSiteVisitAppointmentViewDailog(false);
  const userToken = useGetToken();
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

  // hadleSelectEvent
  const handleSelectEvent = useCallback((event) => {
    if (
      event?.applicationNumber != null &&
      event?.applicationNumber != undefined &&
      event?.applicationNumber != ""
    ) {
      siteVisitAppointmentViewDailogOpen();
      setSelectedEventData(event);
    }
  }, []);

  // getAllSiteVisitAppointments
  const getAllSiteVisitAppointments = () => {
    setLoadderState(true);

    axios
      .get(
        `${urls.HMSURL}/master/AppointmentScheduleReschedule/getAppointmentByFromDateAndToDate?fromDate=${startDateMonth}&toDate=${endDateMonth}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          // issuanceEvents
          setIssuanceEvents(
            res?.data?.map((r, index) => ({
              start: moment(
                r?.mstSlot?.slotDate + "T" + r?.mstSlot?.fromTime
              ).toDate(),
              end: moment(
                r?.mstSlot?.slotDate + "T" + r?.mstSlot?.toTime
              ).toDate(),
              title: r?.issuanceOfHawkerLicenseDao?.applicationNumber,
              siteVisitTime: r?.mstSlot?.fromTime + " To " + r?.mstSlot?.toTime,
              color: "white",
              backgroundColor: "blue",
              applicationId: r?.applicationId,
              siteVisitDate: r?.siteVisitDate,
              id: r?.index,
              slotId: r?.mstSlot?.id,
              applicationNumber:
                r?.issuanceOfHawkerLicenseDao?.applicationNumber,
              applicationDate: r?.issuanceOfHawkerLicenseDao?.applicationDate,
              applicantName:
                r?.issuanceOfHawkerLicenseDao?.firstName +
                " " +
                r?.issuanceOfHawkerLicenseDao?.middleName +
                " " +
                r?.issuanceOfHawkerLicenseDao?.lastName,
              applicationNameMar:
                r?.issuanceOfHawkerLicenseDao?.firstNameMr +
                " " +
                r?.issuanceOfHawkerLicenseDao?.middleNameMr +
                " " +
                r?.issuanceOfHawkerLicenseDao?.lastNameMr,
              serviceName: r?.issuanceOfHawkerLicenseDao?.serviceId,
              emailAddress: r?.issuanceOfHawkerLicenseDao?.emailAddress,
              mobile: r?.issuanceOfHawkerLicenseDao?.mobile,
              deptName: "Hawker Management System",
            }))
          );

          // renewalEvents
          setRenewalEvents(
            res?.data?.map((r, index) => ({
              start: moment(
                r?.mstSlot?.slotDate + "T" + r?.mstSlot?.fromTime
              ).toDate(),
              end: moment(
                r?.mstSlot?.slotDate + "T" + r?.mstSlot?.toTime
              ).toDate(),
              title: r?.renewalOfHawkerLicenseDao?.applicationNumber,
              siteVisitTime: r?.mstSlot?.fromTime + " To " + r?.mstSlot?.toTime,
              color: "white",
              backgroundColor: "blue",
              applicationId: r?.renewalOfHawkerLicense,
              siteVisitDate: r?.siteVisitDate,
              id: r?.index,
              slotId: r?.mstSlot?.id,
              applicationNumber:
                r?.renewalOfHawkerLicenseDao?.applicationNumber,
              applicationDate: r?.renewalOfHawkerLicenseDao?.applicationDate,
              applicantName:
                r?.renewalOfHawkerLicenseDao?.firstName +
                " " +
                r?.renewalOfHawkerLicenseDao?.middleName +
                " " +
                r?.renewalOfHawkerLicenseDao?.lastName,
              applicationNameMar:
                r?.renewalOfHawkerLicenseDao?.firstNameMr +
                " " +
                r?.renewalOfHawkerLicenseDao?.middleNameMr +
                " " +
                r?.renewalOfHawkerLicenseDao?.lastNameMr,
              serviceName: r?.renewalOfHawkerLicenseDao?.serviceId,
              emailAddress: r?.renewalOfHawkerLicenseDao?.emailAddress,
              mobile: r?.renewalOfHawkerLicenseDao?.mobile,
              deptName: "Hawker Management System",
            }))
          );

          // transfer
          setTransferEvents(
            res?.data?.map((r, index) => ({
              start: moment(
                r?.mstSlot?.slotDate + "T" + r?.mstSlot?.fromTime
              ).toDate(),
              end: moment(
                r?.mstSlot?.slotDate + "T" + r?.mstSlot?.toTime
              ).toDate(),
              title: r?.transferOfHawkerLicenseDao?.applicationNumber,
              siteVisitTime: r?.mstSlot?.fromTime + " To " + r?.mstSlot?.toTime,
              color: "white",
              backgroundColor: "blue",
              applicationId: r?.transferOfHawkerLicense,
              siteVisitDate: r?.siteVisitDate,
              id: r?.index,
              slotId: r?.mstSlot?.id,
              applicationNumber:
                r?.transferOfHawkerLicenseDao?.applicationNumber,
              applicationDate: r?.transferOfHawkerLicenseDao?.applicationDate,
              applicantName:
                r?.transferOfHawkerLicenseDao?.firstName +
                " " +
                r?.transferOfHawkerLicenseDao?.middleName +
                " " +
                r?.transferOfHawkerLicenseDao?.lastName,
              applicationNameMar:
                r?.transferOfHawkerLicenseDao?.firstNameMr +
                " " +
                r?.transferOfHawkerLicenseDao?.middleNameMr +
                " " +
                r?.transferOfHawkerLicenseDao?.lastNameMr,
              serviceName: r?.transferOfHawkerLicenseDao?.serviceId,
              emailAddress: r?.transferOfHawkerLicenseDao?.emailAddress,
              mobile: r?.transferOfHawkerLicenseDao?.mobile,
              deptName: "Hawker Management System",
            }))
          );

          // cancellation
          setCancellationEvents(
            res?.data?.map((r, index) => ({
              start: moment(
                r?.mstSlot?.slotDate + "T" + r?.mstSlot?.fromTime
              ).toDate(),
              end: moment(
                r?.mstSlot?.slotDate + "T" + r?.mstSlot?.toTime
              ).toDate(),
              title: r?.cancellationOfHawkerLicenseDao?.applicationNumber,
              siteVisitTime: r?.mstSlot?.fromTime + " To " + r?.mstSlot?.toTime,
              color: "white",
              backgroundColor: "blue",
              applicationId: r?.cancellationOfHawkerLicense,
              siteVisitDate: r?.siteVisitDate,
              id: r?.index,
              slotId: r?.mstSlot?.id,
              applicationNumber:
                r?.cancellationOfHawkerLicenseDao?.applicationNumber,
              applicationDate:
                r?.cancellationOfHawkerLicenseDao?.applicationDate,
              applicantName:
                r?.cancellationOfHawkerLicenseDao?.firstName +
                " " +
                r?.cancellationOfHawkerLicenseDao?.middleName +
                " " +
                r?.cancellationOfHawkerLicenseDao?.lastName,
              applicationNameMar:
                r?.cancellationOfHawkerLicenseDao?.firstNameMr +
                " " +
                r?.cancellationOfHawkerLicenseDao?.middleNameMr +
                " " +
                r?.cancellationOfHawkerLicenseDao?.lastNameMr,
              serviceName: r?.cancellationOfHawkerLicenseDao?.serviceId,
              emailAddress: r?.cancellationOfHawkerLicenseDao?.emailAddress,
              mobile: r?.cancellationOfHawkerLicenseDao?.mobile,
              deptName: "Hawker Management System",
            }))
          );

          setLoadderState(false);
        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

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
    // month start Date
    setStartDateMonth(moment(date).startOf("month").format("YYYY-MM-DD"));
    // month end Date
    setEndDateMonth(moment(date).endOf("month").format("YYYY-MM-DD"));
  };

  // Filtered Events
  const getFilteredEvents = () => {
    // issuance
    let issuanceEvt = issuanceEvents?.filter((data) => {
      if (
        data?.applicationNumber != null &&
        data?.applicationNumber != undefined &&
        data?.applicationNumber != ""
      ) {
        return data;
      }
    });
    setIssuanceEvents1(issuanceEvt);

    // renewal
    let renewalEvt = renewaleEvents?.filter((data) => {
      if (
        data?.applicationNumber != null &&
        data?.applicationNumber != undefined &&
        data?.applicationNumber != ""
      ) {
        return data;
      }
    });

    setRenewalEvents1(renewalEvt);

    // cancellation
    let cancellationEvt = cancellationEvents?.filter((data) => {
      if (
        data?.applicationNumber != null &&
        data?.applicationNumber != undefined &&
        data?.applicationNumber != ""
      ) {
        return data;
      }
    });

    setCancellationEvents1(cancellationEvt);

    // transfer
    let transferEvt = transferEvents?.filter((data) => {
      if (
        data?.applicationNumber != null &&
        data?.applicationNumber != undefined &&
        data?.applicationNumber != ""
      ) {
        return data;
      }
    });

    setTransferEvents1(transferEvt);
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
    getFilteredEvents();
  }, [issuanceEvents, renewaleEvents]);

  //  onNavigate Trigger
  useEffect(() => {
    if (startDateMonth != undefined && endDateMonth != undefined) {
      getAllSiteVisitAppointments();
    }
  }, [startDateMonth, endDateMonth]);

  // particular event pass to SiteVisitAppointmentViewComponent
  useEffect(() => {
  }, [selectedEventData]);

  useEffect(() => {
  }, [issuanceEvents1, renewaleEvents1, cancellationEvents1, transferEvents1]);

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
            <strong> Site Visit Dashboard </strong>
          </div>

          <div style={{ height: "90vh", padding: "5vh" }}>
            <Calendar
              // localizer
              localizer={localizer}
              // events
              events={[
                ...issuanceEvents1,
                ...renewaleEvents1,
                ...cancellationEvents1,
                ...transferEvents1,
                ...holidays,
              ]}
              // popup={true}
              onSelectEvent={handleSelectEvent}
              // navigate
              onNavigate={onNavigate}
              // default
              defaultView="month"
              defaultDate={new Date()}
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
              <strong> Site Visit Appointment View</strong>
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
                    bgcolor: "red",
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
          <SiteVisitAppointmentView selectedEventData={selectedEventData} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteVisitDashboard;
