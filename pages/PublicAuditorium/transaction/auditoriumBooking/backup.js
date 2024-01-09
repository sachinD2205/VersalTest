import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Slide,
    Tab,
    Tabs,
    TextField,
    Typography,
  } from "@mui/material";
  import sweetAlert from "sweetalert";
  import React, { useCallback, useEffect, useState } from "react";
  import { Controller, useForm } from "react-hook-form";
  import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumBooking";
  import AddIcon from "@mui/icons-material/Add";
  import { DataGrid } from "@mui/x-data-grid";
  // import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
  import ClearIcon from "@mui/icons-material/Clear";
  import ExitToAppIcon from "@mui/icons-material/ExitToApp";
  import SaveIcon from "@mui/icons-material/Save";
  import axios from "axios";
  import moment from "moment";
  import { yupResolver } from "@hookform/resolvers/yup";
  import { useSelector } from "react-redux";
  import urls from "../../../../URLS/urls";
  import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { TimePicker } from "@mui/x-date-pickers/TimePicker";
  import PropTypes from "prop-types";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
  import Loader from "../../../../containers/Layout/components/Loader";
  import { Calendar, momentLocalizer } from "react-big-calendar";
  import "react-big-calendar/lib/css/react-big-calendar.css";
  import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
  import { useRouter } from "next/router";
  import Accordion from '@mui/material/Accordion'
  import AccordionSummary from '@mui/material/AccordionSummary'
  import AccordionDetails from '@mui/material/AccordionDetails'
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
  
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  
  const localizer = momentLocalizer(moment);
  
  const AuditoriumBooking = () => {
    const {
      register,
      control,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });
  
    const language = useSelector((state) => state.labels.language);
  
    const router = useRouter();
  
    const [buttonInputState, setButtonInputState] = useState();
    const [dataSource, setDataSource] = useState([]);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [slideChecked, setSlideChecked] = useState(false);
    const [id, setID] = useState();
  
    const [zoneNames, setZoneNames] = useState([]);
    const [wardNames, setWardNames] = useState([]);
    const [events, setEvents] = useState([]);
    const [auditoriums, setAuditoriums] = useState([]);
    const [services, setServices] = useState([]);
    const [bank, setBank] = useState([]);
    const [slots, setSlots] = useState([]);
    const [isAvailable, setIsAvailable] = useState(false);
  
    const [bookingFor, setBookingFor] = useState("Booking For PCMC");
    const [loading, setLoading] = useState(false);
  
    const [nextEntryNumber, setNextEntryNumber] = useState();
    const [meetings, setMeetings] = useState([]);
  
    const onView = useCallback((newView) => console.log("newView", newView));
  
    const onNavigate = (date, view) => {
      let start, end;
  
      if (view === "month") {
        // start = moment(date).startOf("month").format("YYYY-MM-DD")
        // console.log(start)
        // end = moment(date).endOf("month").format("YYYY-MM-DD")
        setstartDateLo(moment(date).startOf("month").format("YYYY-MM-DD"));
        console.log(start);
        setendDateLo(moment(date).endOf("month").format("YYYY-MM-DD"));
      }
      console.log("Navigate", start, end);
  
      return console.log({ start, end });
    };
  
    const _dayPropGetter = useCallback(
      (date) => ({
        ...(moment(date).day() === 6 && {
          style: {
            color: "red",
            backgroundColor: "#FFA07A",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // width: "50px",
          },
        }),
        ...(moment(date).day() === 0 && {
          style: {
            color: "red",
            backgroundColor: "#FFA07A",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // width: "50px",
          },
        }),
      }),
      [],
    );
  
    const handleSelectEvent = useCallback(
      // (event) => window.alert(event.title),
      (event) => {
        loging(event), setIsModalOpen(true);
      },
      [],
    );
  
    const loging = (event) => {
      console.log("..........events", event);
      setSendquery(event);
      // filterDocketAddToLocalStorage("startDate", event.start)
      // filterDocketAddToLocalStorage("queryParams", event)
      return event;
    };
  
    const handleChangeRadio = (event) => {
      setBookingFor(event.target.value);
    };
  
    const [_value, set_Value] = useState(0);
  
    const handleChange = (event, newValue) => {
      set_Value(newValue);
    };
  
    const [data, setData] = useState({
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: 10,
      page: 1,
    });
  
    let abc = [];
  
    useEffect(() => {
      // getZoneName();
      // getWardNames();
      getAuditorium();
      getServices();
      getBank();
      getEvents();
      getSlots();
      getNexAuditoriumBookingNumber();
      setMeetings(
        [
          { id: 1, committeeName: "ABC", agendaNo: 123 },
          { id: 1, committeeName: "ABC", agendaNo: 123 },
        ].map((row) => ({
          id: row.id,
          title: row.committeeName,
          start: moment(new Date()).format("YYYY/MM/DD"),
          end: moment(new Date()).format("YYYY/MM/DD"),
          resourceId: 1,
          agendaNo: row.agendaNo,
        })),
      );
    }, []);
  
    useEffect(() => {
      getAuditoriumBooking();
    }, [auditoriums]);
  
    const getNexAuditoriumBookingNumber = () => {
      setLoading(true);
      axios.get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`).then((r) => {
        console.log("neext key", r);
        setNextEntryNumber(r.data);
        setValue("auditoriumBookingNo", r?.data);
        setLoading(false);
      });
    };
  
    const getSlots = () => {
      axios.get(`${urls.CFCURL}/master/slot/getAll`).then((r) => {
        console.log("slots res", r);
        setSlots(
          r.data.slots.map((row, index) => ({
            id: row.id,
            fromTime: row.fromTime,
            toTime: row.toTime,
            slotDate: row.slotDate,
          })),
        );
      });
    };
  
    const getAuditorium = () => {
      axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
        console.log("respe", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            id: row.id,
            auditoriumName: row.auditoriumName,
          })),
        );
      });
    };
  
    const getServices = () => {
      axios.get(`http://15.206.219.76:8090/cfc/api/master/service/getAll`).then((r) => {
        console.log("respe ser", r);
        setServices(
          r.data.service.map((row, index) => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceNameMr: row.serviceNameMr,
          })),
        );
      });
    };
  
    const getBank = () => {
      console.log("123");
      axios
        .get(`${urls.CFCURL}/master/bank/getAll`)
        // .get("http://15.206.219.76:8090/cfc/api/master/bank/getAll")
        .then((r) => {
          console.log("bank 123", r);
          setBank(r?.data?.bank);
        });
    };
  
    const getZoneName = () => {
      axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
        setZoneNames(
          r.data.zone.map((row, index) => ({
            id: row.id,
            zoneName: row.zoneName,
          })),
        );
      });
    };
  
    const getWardNames = () => {
      axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
          })),
        );
      });
    };
  
    const getEvents = () => {
      axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
        setEvents(
          r.data.trnAuditoriumEventsList.map((row) => ({
            id: row.id,
            programEventDescription: row.programEventDescription,
          })),
        );
      });
    };
  
    const getAuditoriumBooking = (_pageSize = 10, _pageNo = 0) => {
      console.log("_pageSize,_pageNo", _pageSize, _pageNo);
      setLoading(true);
      axios
        .get(
          `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`,
          // "http://192.168.68.123:9003/pabbm/api/trnAuditoriumBookingOnlineProcess/getAll",
          {
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
          },
        )
        .then((res) => {
          console.log("res aud", res);
  
          setLoading(false);
          let result = res.data.trnAuditoriumBookingOnlineProcessList;
          let _res = result.map((val, i) => {
            console.log("44", val);
            return {
              srNo: _pageSize * _pageNo + i + 1,
              id: val.id,
              auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
              toDate: val.toDate ? val.toDate : "-",
              fromDate: val.fromDate ? val.fromDate : "-",
              holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
              status: val.activeFlag === "Y" ? "Active" : "Inactive",
              activeFlag: val.activeFlag,
  
              auditoriumId: val.auditoriumId
                ? auditoriums.find((obj) => obj?.id == val.auditoriumId)?.auditoriumName
                : "Not Available",
              eventDate: val.eventDate ? moment(val?.eventDate).format("DD-MM-YYYY") : "-",
              mobile: val.mobile ? val.mobile : "-",
              organizationName: val.organizationName ? val.organizationName : "-",
              organizationOwnerFirstName: val.organizationOwnerFirstName
                ? val.organizationOwnerFirstName + " " + val.organizationOwnerLastName
                : "-",
            };
          });
  
          console.log("result", _res);
  
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        });
    };
  
    const deleteById = (value, _activeFlag) => {
      let body = {
        activeFlag: _activeFlag,
        id: value,
      };
      console.log("body", body);
      if (_activeFlag === "N") {
        swal({
          title: "Inactivate?",
          text: "Are you sure you want to inactivate this Record ? ",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          console.log("inn", willDelete);
          if (willDelete === true) {
            axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAuditoriumBooking();
                setButtonInputState(false);
              }
            });
          } else if (willDelete == null) {
            swal("Record is Safe");
          }
        });
      } else {
        swal({
          title: "Activate?",
          text: "Are you sure you want to activate this Record ? ",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          console.log("inn", willDelete);
          if (willDelete === true) {
            axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAuditoriumBooking();
                setButtonInputState(false);
              }
            });
          } else if (willDelete == null) {
            swal("Record is Safe");
          }
        });
      }
    };
  
    const cancellButton = () => {
      reset({
        ...resetValuesCancell,
        id,
      });
    };
  
    const resetValuesCancell = {
      billPrefix: "",
      billType: "",
      fromDate: null,
      toDate: null,
      remark: "",
    };
  
    const exitButton = () => {
      reset({
        ...resetValuesExit,
      });
      setButtonInputState(false);
      setSlideChecked(false);
      setSlideChecked(false);
      setIsOpenCollapse(false);
      setEditButtonInputState(false);
      setDeleteButtonState(false);
    };
  
    const onSubmitForm = (formData) => {
      console.log("formData", formData);
      const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
      const finalBodyForApi = {
        ...formData,
        eventDate,
        auditoriumBookingNo: nextEntryNumber,
        // auditoriumBookingNo: Number(formData.auditoriumBookingNo),
        auditoriumId: Number(formData.auditoriumId),
        aadhaarNo: Number(formData.aadhaarNo),
        landlineNo: Number(formData.landlineNo),
        mobile: Number(formData.mobile),
        depositAmount: Number(formData.depositAmount),
        payRentAmount: Number(formData.payRentAmount),
        pincode: Number(formData.pincode),
        rentAmount: Number(formData.rentAmount),
        extendedRentAmount: Number(formData.extendedRentAmount),
        bankaAccountNo: Number(formData.bankaAccountNo),
        pincode: Number(formData?.pinCode),
        bookingFor: bookingFor,
        flatBuildingNo: Number(formData.flatBuildingNo),
      };
  
      console.log("finalBodyForApi", finalBodyForApi);
  
      axios.post(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`, finalBodyForApi).then((res) => {
        // axios
        //   .post("http://192.168.68.125:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/save", finalBodyForApi)
        //   .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAuditoriumBooking();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    };
  
    const resetValuesExit = {
      fromDate: "",
      toDate: "",
    };
  
    const columns = [
      {
        field: "srNo",
        headerName: <FormattedLabel id="srNo" />,
        flex: 0.3,
        headerAlign: "center",
      },
      {
        field: "auditoriumId",
        headerName: <FormattedLabel id="auditorium" />,
        flex: 1,
        headerAlign: "center",
      },
      {
        field: "organizationOwnerFirstName",
        headerName: <FormattedLabel id="organizationOwnerFirstName" />,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "eventDate",
        headerName: <FormattedLabel id="eventDate" />,
        maxWidth: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "mobile",
        headerName: <FormattedLabel id="mobile" />,
        flex: 0.5,
        headerAlign: "center",
      },
      {
        field: "organizationName",
        headerName: <FormattedLabel id="organizationName" />,
        flex: 1,
        headerAlign: "center",
      },
      ,
      {
        field: "status",
        headerName: <FormattedLabel id="status" />,
        flex: 1,
        headerAlign: "center",
      },
    ];
  
    return (
      <div>
        {loading ? (
          <Loader />
        ) : (
          <Paper>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "10px",
                // backgroundColor:'#0E4C92'
                // backgroundColor:'		#0F52BA'
                // backgroundColor:'		#0F52BA'
                background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              <h2>
                {/* Auditorium Booking */}
                <FormattedLabel id="auditoriumBooking" />
              </h2>
            </Box>
            {isOpenCollapse && (
              <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12}>
                      <Typography variant="h6">Important instructions</Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Typography>
                      1.It is compulsory to deposit e 10,000/-in reserve and
                      Police Performance License in the town house office before
                      the date of the program.
                    </Typography>
                    <Typography>
                      2. Arranging metal detectors and dress code security staff
                      is mandatory for the safety of the spectators
                    </Typography>
                    <Typography>
                      3. In any case, inviting more than 911 spectators is
                      prohibited
                    </Typography>
                    <Typography>
                      4. Experiments with flames and explosives, as well as
                      incense-burning incense, are prohibited in the town hall
                      complex
                    </Typography>
                    <Typography>
                      5. It is mandatory to write the name of the applicant and
                      the name of the organization in the banners and invitation
                      cards or tickets prepared for the presentation of the
                      program.
                    </Typography>
                    <Typography>
                      6. In any case, considering the safety of the public, the
                      program must be started and completed within the stipulated
                      time in the first and second shifts and it is also mandatory
                      to close the program after 1:00 pm in the third shift.
                    </Typography>
                    <Typography>
                      7. First shift-09-00 to 12-30 hours in the morning Second
                      shift-03-00 to 6-30 hours Third shift-09:00 to 12-30 hours
                      at night s in addition to the rules laid down by the
                      township, taking into account the current site conditions
                      and Considering the facilities and safety of the audience,
                      the applicant and the organization must strictly follow the
                      instructions of the above sequence number: 1 to 6 The above
                      instruction must be strictly enforced otherwise the program
                      will be forced to close.
                    </Typography>
                  </Grid> */}
                  {/* <Divider /> */}
                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12}>
                      <Typography variant="h6">
                        Auditorium Availability
                      </Typography>
                    </Grid>
                  </Grid> */}
                  {/* <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        error={errors.checkAuditoriumKey}
                        variant="standard"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Select Auditorium
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Select Auditorium"
                            >
                              {auditoriums &&
                                auditoriums.map((auditorium, index) => {
                                  return (
                                    <MenuItem key={index} value={auditorium.id}>
                                      {auditorium.auditoriumName}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          )}
                          name="checkAuditoriumKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.checkAuditoriumKey
                            ? errors.checkAuditoriumKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ width: "90%" }}
                        error={!!errors.slotKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Select Slot
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Select Slot"
                            >
                              {slots.map((service, index) => (
                                <MenuItem key={index} value={service.id}>
                                  {service.fromTime} - {service.toTime}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                          name="slotKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.slotKey ? errors.slotKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid> */}
                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <Calendar
                        localizer={localizer}
                        events={meetings}
                        startAccessor="start"
                        endAccessor="end"
                        selectable={true}
                        popup={true}
                        style={{
                          height: "50vh",
                          border: "1px solid gray",
                          borderRadius: "5px",
                        }}
                        step={30}
                        defaultView="month"
                        selectRange={true}
                        views={["month"]}
                        defaultDate={new Date()}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        onSelectEvent={handleSelectEvent}
                        onView={onView}
                        onNavigate={onNavigate}
                        dayPropGetter={_dayPropGetter}
                        eventPropGetter={(event) => {
                          const backgroundColor = event.allday
                            ? "yellow"
                            : "blue";
                          return { style: { backgroundColor,height:'10px',display:'flex',alignItems:'center',fontSize:'7px' } };
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems:'center'
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ width: "90%" }}
                        error={!!errors.eventKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Select Event
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Select Event"
                            >
                              {events?.map((service, index) => (
                                <MenuItem key={index} value={service.id}>
                                  {service.programEventDescription}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                          name="eventKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.eventKey ? errors.eventKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid> */}
                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        size="small"
                        onClick={() => {
                          console.log("search");
                          setIsAvailable(!isAvailable);
                        }}
                        variant="contained"
                        color="success"
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid> */}
                  <>
                    {/* <Box sx={{ width: "100%" }}>
                        <Box
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            width: "100%",
                          }}
                        >
                          <Tabs
                            value={_value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                          >
                            <Tab
                              label="Organization Details"
                              {...a11yProps(0)}
                              sx={{ width: "100%" }}
                            />
                            <Tab
                              label="Applicant Details"
                              {...a11yProps(1)}
                              sx={{ width: "100%" }}
                            />
                            <Tab
                              label="Bank Details"
                              {...a11yProps(2)}
                              sx={{ width: "100%" }}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={_value} index={0}>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Organization Name"
                                variant="standard"
                                {...register("organizationName")}
                                error={!!errors.organizationName}
                                helperText={
                                  errors?.organizationName
                                    ? errors.organizationName.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                label="Mobile"
                                type="number"
                                sx={{
                                  width: "90%",
                                  "& .MuiInput-input": {
                                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                      {
                                        "-webkit-appearance": "none",
                                      },
                                  },
                                }}
                                onInput={(e) => {
                                  e.target.value = Math.max(
                                    0,
                                    parseInt(e.target.value)
                                  )
                                    .toString()
                                    .slice(0, 10);
                                }}
                                variant="standard"
                                {...register("mobile")}
                                error={!!errors.mobile}
                                helperText={
                                  errors?.mobile ? errors.mobile.message : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Name"
                                variant="standard"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={
                                  errors?.name ? errors.name.message : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="GST number"
                                variant="standard"
                                {...register("gstNumber")}
                                error={!!errors.gstNumber}
                                helperText={
                                  errors?.gstNumber
                                    ? errors.gstNumber.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Event Name"
                                variant="standard"
                                {...register("eventName")}
                                error={!!errors.eventName}
                                helperText={
                                  errors?.eventName
                                    ? errors.eventName.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                label="Flat/Building No."
                                sx={{
                                  width: "90%",
                                  "& .MuiInput-input": {
                                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                      {
                                        "-webkit-appearance": "none",
                                      },
                                  },
                                }}
                                variant="standard"
                                type="number"
                                {...register("flatBuildingNo")}
                                error={!!errors.flatBuildingNo}
                                helperText={
                                  errors?.flatBuildingNo
                                    ? errors.flatBuildingNo.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Building Name"
                                variant="standard"
                                {...register("buildingName")}
                                error={!!errors.buildingName}
                                helperText={
                                  errors?.buildingName
                                    ? errors.buildingName.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Landmark"
                                variant="standard"
                                {...register("landmark")}
                                error={!!errors.landmark}
                                helperText={
                                  errors?.landmark
                                    ? errors.landmark.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Area"
                                variant="standard"
                                {...register("area")}
                                error={!!errors.area}
                                helperText={
                                  errors?.area ? errors.area.message : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormControl
                                error={errors.auditoriumId}
                                variant="standard"
                                sx={{ width: "90%" }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Country
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      sx={{ minWidth: 220 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      label="Select Country"
                                    >
                                      {auditoriums &&
                                        auditoriums.map((auditorium, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={auditorium.id}
                                            >
                                              {auditorium.auditoriumName}
                                            </MenuItem>
                                          );
                                        })}
                                    </Select>
                                  )}
                                  name="auditoriumId"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.auditoriumId
                                    ? errors.auditoriumId.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormControl
                                error={errors.auditoriumId}
                                variant="standard"
                                sx={{ width: "90%" }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Select State
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      sx={{ minWidth: 220 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      label="Select State"
                                    >
                                      {auditoriums &&
                                        auditoriums.map((auditorium, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={auditorium.id}
                                            >
                                              {auditorium.auditoriumName}
                                            </MenuItem>
                                          );
                                        })}
                                    </Select>
                                  )}
                                  name="auditoriumId"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.auditoriumId
                                    ? errors.auditoriumId.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormControl
                                error={errors.auditoriumId}
                                variant="standard"
                                sx={{ width: "90%" }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  City
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      sx={{ minWidth: 220 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      label="City"
                                    >
                                      {auditoriums &&
                                        auditoriums.map((auditorium, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={auditorium.id}
                                            >
                                              {auditorium.auditoriumName}
                                            </MenuItem>
                                          );
                                        })}
                                    </Select>
                                  )}
                                  name="auditoriumId"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.auditoriumId
                                    ? errors.auditoriumId.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Pin Code"
                                variant="standard"
                                {...register("pinCode")}
                                error={!!errors.pinCode}
                                helperText={
                                  errors?.pinCode ? errors.pinCode.message : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Divider />
                        </TabPanel>
                        <TabPanel value={_value} index={1}>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Organization Owner First Name"
                                variant="standard"
                                {...register("applicantName")}
                                error={!!errors.applicantName}
                                helperText={
                                  errors?.applicantName
                                    ? errors.applicantName.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                label="Mobile"
                                type="number"
                                sx={{
                                  width: "90%",
                                  "& .MuiInput-input": {
                                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                      {
                                        "-webkit-appearance": "none",
                                      },
                                  },
                                }}
                                onInput={(e) => {
                                  e.target.value = Math.max(
                                    0,
                                    parseInt(e.target.value)
                                  )
                                    .toString()
                                    .slice(0, 10);
                                }}
                                variant="standard"
                                {...register("mobile")}
                                error={!!errors.mobile}
                                helperText={
                                  errors?.mobile ? errors.mobile.message : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                label="Confirm Mobile"
                                type="number"
                                sx={{
                                  width: "90%",
                                  "& .MuiInput-input": {
                                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                      {
                                        "-webkit-appearance": "none",
                                      },
                                  },
                                }}
                                onInput={(e) => {
                                  e.target.value = Math.max(
                                    0,
                                    parseInt(e.target.value)
                                  )
                                    .toString()
                                    .slice(0, 10);
                                }}
                                variant="standard"
                                {...register("confirmMobile")}
                                error={!!errors.confirmMobile}
                                helperText={
                                  errors?.confirmMobile
                                    ? errors.confirmMobile.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Email Address"
                                variant="standard"
                                {...register("emailAddress")}
                                error={!!errors.emailAddress}
                                helperText={
                                  errors?.emailAddress
                                    ? errors.emailAddress.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Confirm Email Address"
                                variant="standard"
                                {...register("confirmEmailAddress")}
                                error={!!errors.confirmEmailAddress}
                                helperText={
                                  errors?.confirmEmailAddress
                                    ? errors.confirmEmailAddress.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Relation With Organization"
                                variant="standard"
                                {...register("relationWithOrganization")}
                                error={!!errors.relationWithOrganization}
                                helperText={
                                  errors?.relationWithOrganization
                                    ? errors.relationWithOrganization.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Organization Owner Last Name"
                                variant="standard"
                                {...register("organizationOwnerLastName")}
                                error={!!errors.organizationOwnerLastName}
                                helperText={
                                  errors?.organizationOwnerLastName
                                    ? errors.organizationOwnerLastName.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                label="Flat/Building No."
                                sx={{
                                  width: "90%",
                                  "& .MuiInput-input": {
                                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                      {
                                        "-webkit-appearance": "none",
                                      },
                                  },
                                }}
                                variant="standard"
                                type="number"
                                {...register("flatBuildingNo")}
                                error={!!errors.flatBuildingNo}
                                helperText={
                                  errors?.flatBuildingNo
                                    ? errors.flatBuildingNo.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Building Name"
                                variant="standard"
                                {...register("buildingName")}
                                error={!!errors.buildingName}
                                helperText={
                                  errors?.buildingName
                                    ? errors.buildingName.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Landmark"
                                variant="standard"
                                {...register("landmark")}
                                error={!!errors.landmark}
                                helperText={
                                  errors?.landmark
                                    ? errors.landmark.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Area"
                                variant="standard"
                                {...register("area")}
                                error={!!errors.area}
                                helperText={
                                  errors?.area ? errors.area.message : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormControl
                                error={errors.auditoriumId}
                                variant="standard"
                                sx={{ width: "90%" }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Country
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      sx={{ minWidth: 220 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      label="Select Country"
                                    >
                                      {auditoriums &&
                                        auditoriums.map((auditorium, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={auditorium.id}
                                            >
                                              {auditorium.auditoriumName}
                                            </MenuItem>
                                          );
                                        })}
                                    </Select>
                                  )}
                                  name="auditoriumId"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.auditoriumId
                                    ? errors.auditoriumId.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormControl
                                error={errors.auditoriumId}
                                variant="standard"
                                sx={{ width: "90%" }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Select State
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      sx={{ minWidth: 220 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      label="Select State"
                                    >
                                      {auditoriums &&
                                        auditoriums.map((auditorium, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={auditorium.id}
                                            >
                                              {auditorium.auditoriumName}
                                            </MenuItem>
                                          );
                                        })}
                                    </Select>
                                  )}
                                  name="auditoriumId"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.auditoriumId
                                    ? errors.auditoriumId.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormControl
                                error={errors.auditoriumId}
                                variant="standard"
                                sx={{ width: "90%" }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  City
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      sx={{ minWidth: 220 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      label="City"
                                    >
                                      {auditoriums &&
                                        auditoriums.map((auditorium, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={auditorium.id}
                                            >
                                              {auditorium.auditoriumName}
                                            </MenuItem>
                                          );
                                        })}
                                    </Select>
                                  )}
                                  name="auditoriumId"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.auditoriumId
                                    ? errors.auditoriumId.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Pin Code"
                                variant="standard"
                                {...register("pinCode")}
                                error={!!errors.pinCode}
                                helperText={
                                  errors?.pinCode ? errors.pinCode.message : null
                                }
                              />
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <TabPanel value={_value} index={2}>
                          <Grid
                            container
                            sx={{
                              padding: "10px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="h5">ECS Form Details</Typography>
                          </Grid>
  
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Bank account holder name"
                                variant="standard"
                                {...register("bankAccountHolderName")}
                                error={!!errors.bankAccountHolderName}
                                helperText={
                                  errors?.bankAccountHolderName
                                    ? errors.bankAccountHolderName.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                label="Bank account number"
                                variant="standard"
                                type="number"
                                sx={{
                                  width: "90%",
                                  "& .MuiInput-input": {
                                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                      {
                                        "-webkit-appearance": "none",
                                      },
                                  },
                                }}
                                {...register("bankaAccountNo")}
                                error={!!errors.bankaAccountNo}
                                helperText={
                                  errors?.bankaAccountNo
                                    ? errors.bankaAccountNo.message
                                    : null
                                }
                              />
                            </Grid>
                            
                          </Grid>
  
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormControl
                                variant="standard"
                                error={!!errors.bankNameId}
                                sx={{ width: "90%" }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Bank name
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      sx={{ minWidth: 220 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      label="Bank name"
                                    >
                                      {bank.map((bank, index) => (
                                        <MenuItem
                                          key={index}
                                          value={bank.id}
                                          sx={{
                                            display: bank.bankName
                                              ? "flex"
                                              : "none",
                                          }}
                                        >
                                          {bank.bankName}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  )}
                                  name="bankNameId"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.bankNameId
                                    ? errors.bankNameId.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Bank address"
                                variant="standard"
                                {...register("bankAddress")}
                                error={!!errors.bankAddress}
                                helperText={
                                  errors?.bankAddress
                                    ? errors.bankAddress.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="IFSC Code"
                                variant="standard"
                                {...register("ifscCode")}
                                error={!!errors.ifscCode}
                                helperText={
                                  errors?.ifscCode
                                    ? errors.ifscCode.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
  
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                type="number"
                                sx={{
                                  width: "90%",
                                  "& .MuiInput-input": {
                                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                      {
                                        "-webkit-appearance": "none",
                                      },
                                  },
                                }}
                                label="Short details of Programme"
                                variant="standard"
                                {...register("shortDetailsOfProgramme")}
                                error={!!errors.shortDetailsOfProgramme}
                                helperText={
                                  errors?.shortDetailsOfProgramme
                                    ? errors.shortDetailsOfProgramme.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label="Programme Purpose"
                                variant="standard"
                                error={!!errors.programmePurpose}
                                helperText={
                                  errors?.programmePurpose
                                    ? errors.programmePurpose.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={4}>
                              <Typography>Terms and conditions</Typography>
                            </Grid>
                          </Grid>
  
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Controller
                                    name="isBankDetailsCorrect"
                                    control={control}
                                    render={({ field: props }) => (
                                      <Checkbox
                                        {...props}
                                        checked={props.value}
                                        onChange={(e) =>
                                          props.onChange(e.target.checked)
                                        }
                                      />
                                    )}
                                  />
                                }
                                label="I agree with above bank details are correct"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Controller
                                    name="tnc"
                                    control={control}
                                    render={({ field: props }) => (
                                      <Checkbox
                                        {...props}
                                        checked={props.value}
                                        onChange={(e) =>
                                          props.onChange(e.target.checked)
                                        }
                                      />
                                    )}
                                  />
                                }
                                label="I have read and agree with terms and conditions"
                              />
                            </Grid>
                          </Grid>
                        </TabPanel>
                      </Box> */}
  
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl error={errors.auditoriumId} variant="standard" sx={{ width: "90%" }}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {" "}
                            <FormattedLabel id="selectAuditorium" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="selectAuditorium" />}
                              >
                                {auditoriums &&
                                  auditoriums.map((auditorium, index) => {
                                    return (
                                      <MenuItem key={index} value={auditorium.id}>
                                        {auditorium.auditoriumName}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="auditoriumId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.auditoriumId ? errors.auditoriumId.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.serviceId}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="selectEvent" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="selectEvent" />}
                              >
                                {events &&
                                  events.map((service, index) => (
                                    <MenuItem
                                      key={index}
                                      sx={{
                                        display: service.programEventDescription ? "flex" : "none",
                                      }}
                                      value={service.id}
                                    >
                                      {service.programEventDescription}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="serviceId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>{errors?.serviceId ? errors.serviceId.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="auditoriumBookingNumber" />}
                          variant="standard"
                          sx={{ width: "90%" }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          value={nextEntryNumber}
                          {...register("auditoriumBookingNo")}
                          // error={!!errors.auditoriumBookingNo}
                          // helperText={
                          //   errors?.auditoriumBookingNo
                          //     ? errors.auditoriumBookingNo.message
                          //     : null
                          // }
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <FormControl sx={{ width: "100%" }}>
                        <RadioGroup
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                          }}
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={bookingFor}
                          onChange={handleChangeRadio}
                        >
                          <FormControlLabel
                            value="Booking For PCMC"
                            control={<Radio />}
                            label={<FormattedLabel id="bookingForPCMC" />}
                          />
                          <FormControlLabel
                            value="Booking For Other Vendor"
                            control={<Radio />}
                            label={<FormattedLabel id="bookingForOtherVendor" />}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="organizationName" />}
                          variant="standard"
                          {...register("organizationName")}
                          error={!!errors.organizationName}
                          helperText={errors?.organizationName ? errors.organizationName.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="title" />}
                          variant="standard"
                          {...register("title")}
                          error={!!errors.title}
                          helperText={errors?.title ? errors.title.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="flat_buildingNo" />}
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          variant="standard"
                          type="number"
                          {...register("flatBuildingNo")}
                          error={!!errors.flatBuildingNo}
                          helperText={errors?.flatBuildingNo ? errors.flatBuildingNo.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="organizationOwnerFirstName" />}
                          variant="standard"
                          {...register("organizationOwnerFirstName")}
                          error={!!errors.organizationOwnerFirstName}
                          helperText={
                            errors?.organizationOwnerFirstName
                              ? errors.organizationOwnerFirstName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="organizationOwnerMiddleName" />}
                          variant="standard"
                          {...register("organizationOwnerMiddleName")}
                          error={!!errors.organizationOwnerMiddleName}
                          helperText={
                            errors?.organizationOwnerMiddleName
                              ? errors.organizationOwnerMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="organizationOwnerLastName" />}
                          variant="standard"
                          {...register("organizationOwnerLastName")}
                          error={!!errors.organizationOwnerLastName}
                          helperText={
                            errors?.organizationOwnerLastName ? errors.organizationOwnerLastName.message : null
                          }
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="buildingName" />}
                          variant="standard"
                          {...register("buildingName")}
                          error={!!errors.buildingName}
                          helperText={errors?.buildingName ? errors.buildingName.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="roadName" />}
                          variant="standard"
                          {...register("roadName")}
                          error={!!errors.roadName}
                          helperText={errors?.roadName ? errors.roadName.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="landmark" />}
                          variant="standard"
                          {...register("landmark")}
                          error={!!errors.landmark}
                          helperText={errors?.landmark ? errors.landmark.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="pinCode" />}
                          variant="standard"
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6);
                          }}
                          {...register("pinCode")}
                          error={!!errors.pinCode}
                          helperText={errors?.pinCode ? errors.pinCode.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="aadhaarNo" />}
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          variant="standard"
                          {...register("aadhaarNo")}
                          error={!!errors.aadhaarNo}
                          helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 11);
                          }}
                          label={<FormattedLabel id="landline" />}
                          variant="standard"
                          {...register("landlineNo")}
                          error={!!errors.landlineNo}
                          helperText={errors?.landlineNo ? errors.landlineNo.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="mobile" />}
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          variant="standard"
                          {...register("mobile")}
                          error={!!errors.mobile}
                          helperText={errors?.mobile ? errors.mobile.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="emailAddress" />}
                          variant="standard"
                          {...register("emailAddress")}
                          error={!!errors.emailAddress}
                          helperText={errors?.emailAddress ? errors.emailAddress.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl error={errors.checkAuditoriumKey} variant="standard">
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="messageDisplay" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="messageDisplay" />}
                              >
                                {["Yes", "No"].map((auditorium, index) => {
                                  return (
                                    <MenuItem key={index} value={auditorium}>
                                      {auditorium}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            )}
                            name="messageDisplay"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.messageDisplay ? errors.messageDisplay.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="eventDetails" />}
                          variant="standard"
                          {...register("eventDetails")}
                          error={!!errors.eventDetails}
                          helperText={errors?.eventDetails ? errors.eventDetails.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }} error={errors.eventDate}>
                          <Controller
                            name="eventDate"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disablePast
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="eventDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => {
                                    field.onChange(date);
                                    setValue("eventDay", moment(date).format("dddd"));
                                  }}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" fullWidth error={errors.eventDate} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>{errors?.eventDate ? errors.eventDate.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="eventDay" />}
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="standard"
                          {...register("eventDay")}
                          error={!!errors.eventDay}
                          helperText={errors?.eventDay ? errors.eventDay.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
                          <Controller
                            name="eventTimeFrom"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="eventTimeFrom" />
                                    </span>
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" error={!!errors.eventTimeFrom} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.eventTimeFrom ? errors.eventTimeFrom.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
                          <Controller
                            name="eventTimeTo"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="eventTimeTo" />
                                    </span>
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" error={!!errors.eventTimeTo} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.eventTimeTo ? errors.eventTimeTo.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="depositAmount" />}
                          variant="standard"
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          {...register("depositAmount")}
                          error={!!errors.depositAmount}
                          helperText={errors?.depositAmount ? errors.depositAmount.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="payDepositAmount" />
                        </Typography>
                        <Link href="#">Link</Link>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="rentAmount" />}
                          variant="standard"
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("rentAmount")}
                          error={!!errors.rentAmount}
                          helperText={errors?.rentAmount ? errors.rentAmount.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="payRentAmount" />}
                          variant="standard"
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("payRentAmount")}
                          error={!!errors.payRentAmount}
                          helperText={errors?.payRentAmount ? errors.payRentAmount.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="depositReceipt" />
                        </Typography>
                        <Link
                          onClick={() => {
                            console.log("ww");
                            router.push({
                              pathname: "/PublicAuditorium/transaction/auditoriumBooking/DepositReceipt",
                              // query: {
                              //   ...router?.query,
                              // },
                            });
                          }}
                        >
                          Print
                        </Link>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="extendedRentAmount" />}
                          variant="standard"
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("extendedRentAmount")}
                          error={!!errors.extendedRentAmount}
                          helperText={errors?.extendedRentAmount ? errors.extendedRentAmount.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="rentReceipt" />
                        </Typography>
                        <Link
                          onClick={() => {
                            console.log("ww");
                            router.push({
                              pathname: "/PublicAuditorium/transaction/auditoriumBooking/RentReceipt",
                              // query: {
                              //   ...router?.query,
                              // },
                            });
                          }}
                        >
                          Print
                        </Link>
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="managersDigitalSignature" />}
                          variant="standard"
                          {...register("managersDigitalSignature")}
                          error={!!errors.managersDigitalSignature}
                          helperText={
                            errors?.managersDigitalSignature ? errors.managersDigitalSignature.message : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="termsAndConditions" />}
                          variant="standard"
                          {...register("termsAndCondition")}
                          error={!!errors.termsAndCondition}
                          helperText={errors?.termsAndCondition ? errors.termsAndCondition.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5">
                        <FormattedLabel id="ecsFormDetails" />
                      </Typography>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="bankAccountHolderName" />}
                          variant="standard"
                          {...register("bankAccountHolderName")}
                          error={!!errors.bankAccountHolderName}
                          helperText={
                            errors?.bankAccountHolderName ? errors.bankAccountHolderName.message : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="bankAccountNumber" />}
                          variant="standard"
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          {...register("bankaAccountNo")}
                          error={!!errors.bankaAccountNo}
                          helperText={errors?.bankaAccountNo ? errors.bankaAccountNo.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl error={errors.checkAuditoriumKey} variant="standard">
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="typeOfBankAccount" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="typeOfBankAccount" />}
                              >
                                {["Current", "Saving", "Other"].map((auditorium, index) => {
                                  return (
                                    <MenuItem key={index} value={auditorium}>
                                      {auditorium}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            )}
                            name="typeOfBankAccount"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.typeOfBankAccount ? errors.typeOfBankAccount.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl variant="standard" error={!!errors.bankNameId} sx={{ width: "90%" }}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="bankName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="bankName" />}
                              >
                                {bank.map((bank, index) => (
                                  <MenuItem
                                    key={index}
                                    value={bank.id}
                                    sx={{
                                      display: bank.bankName ? "flex" : "none",
                                    }}
                                  >
                                    {bank.bankName}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            name="bankNameId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.bankNameId ? errors.bankNameId.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="bankAddress" />}
                          variant="standard"
                          {...register("bankAddress")}
                          error={!!errors.bankAddress}
                          helperText={errors?.bankAddress ? errors.bankAddress.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ifscCode" />}
                          variant="standard"
                          {...register("ifscCode")}
                          error={!!errors.ifscCode}
                          helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="micrCode" />}
                          variant="standard"
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("micrCode")}
                          error={!!errors.micrCode}
                          helperText={errors?.micrCode ? errors.micrCode.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="remark" />}
                          {...register("remarks")}
                          variant="standard"
                          error={!!errors.remark}
                          helperText={errors?.remark ? errors.remark.message : null}
                        />
                      </Grid>
                    </Grid>
  
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider />
                  </>
                </form>
              </Slide>
            )}
  
            <Grid container style={{ padding: "10px" }}>
              <Grid item xs={9}></Grid>
              <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  type="primary"
                  size="small"
                  disabled={buttonInputState}
                  onClick={() => {
                    reset({
                      ...resetValuesExit,
                    });
                    setEditButtonInputState(true);
                    setDeleteButtonState(true);
                    setBtnSaveText("Save");
                    setButtonInputState(true);
                    setSlideChecked(true);
                    setIsOpenCollapse(!isOpenCollapse);
                  }}
                >
                  <FormattedLabel id="add" />
                </Button>
              </Grid>
            </Grid>
  
            <Box style={{ height: "auto", overflow: "auto" }}>
              <DataGrid
                sx={{
                  overflowY: "scroll",
  
                  "& .MuiDataGrid-virtualScrollerContent": {},
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },
  
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                density="compact"
                autoHeight={true}
                // rowHeight={50}
                pagination
                paginationMode="server"
                // loading={data.loading}
                rowCount={data.totalRows}
                rowsPerPageOptions={data.rowsPerPageOptions}
                page={data.page}
                pageSize={data.pageSize}
                rows={data.rows}
                columns={columns}
                onPageChange={(_data) => {
                  getAuditoriumBooking(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAuditoriumBooking(_data, data.page);
                }}
              />
            </Box>
          </Paper>
        )}
      </div>
    );
  };
  
  export default AuditoriumBooking;
  