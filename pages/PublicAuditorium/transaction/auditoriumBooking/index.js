import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import sweetAlert from "sweetalert";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Controller,
  useForm,
  useFieldArray,
  FormProvider,
} from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumBooking";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/publicAuditorium/transactions/[auditoriumBooking].module.css";
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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import UploadButtonOP from "../../../../components/publicAuditorium/DocumentsUploadOP";
// import UploadButtonOP from "../../../../components/fileUpload/DocumentsUploadOP";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      role: "",
      level: "",
    },
    // defaultValues: {
    //   levelsOfRolesDaoList: [
    //     { equipment: "", quantity: "", rate: "", total: "" },
    //   ],
    // },
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    setError,
    getValues,
    watch,
    clearErrors,
    formState: { errors, isDirty },
  } = methods;

  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
  //   {
  //     name: "levelsOfRolesDaoList",
  //     control,
  //   }
  // );

  const appendUI = () => {
    append({
      equipment: "",
      quantity: "",
      rate: "",
      total: "",
    });
  };

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();

  const [multiDataGrid, setMultiDataGrid] = useState(null);
  const [_loggedInUser, set_LoggedInUser] = useState(null);
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [slideChecked, setSlideChecked] = useState(true);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [id, setID] = useState();

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [events, setEvents] = useState([]);
  const [nextKeyToSend, setNextKeyToSend] = useState(null);
  const [auditoriums, setAuditoriums] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [services, setServices] = useState([]);
  const [bank, setBank] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);

  const [bookingFor, setBookingFor] = useState("Booking For PCMC Employee");
  const [loading, setLoading] = useState(false);

  const [nextEntryNumber, setNextEntryNumber] = useState();
  const [meetings, setMeetings] = useState([]);

  const [showListOfShifts, setShowListOfShifts] = useState(false);
  const [allData, setAllData] = useState();
  const [filteredShowTimes, setFilteredShowTimes] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [daysOfSlots, setDaysOfSlots] = useState([]);
  const [chargeNames, setChargeNames] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentCharges, setEquipmentCharges] = useState([]);

  const [accordionOpen, setAccordionOpen] = useState(false);

  const onView = useCallback((newView) => console.log("newView", newView));

  const user = useSelector((state) => {
    console.log("user", state.user.user);
    return state.user.user;
  });
  const [bookedAud, setBookedAud] = useState(0);
  const [cfcAudBookedDetails, setCfcAudBookedDetails] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isApplicable, setIsApplicable] = useState(true);
  const [checkAttend, setCheckAttend] = useState(null);
  const [sendquery, setSendquery] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedSendDates, setSelectedSendDates] = useState([]);
  const [sendData, setSendData] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [selectedPreviouslyBookedValues, setSelectedPreviouslyBookedValues] =
    useState([]);
  const [startDateLo, setstartDateLo] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endDateLo, setendDateLo] = useState();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [showBookingChargesTable, setShowBookingChargesTable] = useState(false);
  const [advanceStaticData, setAdvanceStaticData] = useState();
  const [selectedEvent, setSelectedEvent] = useState();
  const [showPreviousDeposit, setShowPreviousDeposit] = useState(false);

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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSelectCancel = () => {
    // getRateChartForSelectedShift();
    setIsSelectModalOpen(false);
  };

  useEffect(() => {
    // const dates = [];
    // let currentDate = moment(watch("fromDate"));
    // while (currentDate <= moment(watch("toDate"))) {
    //   dates.push(currentDate.format("YYYY-MM-DD"));
    //   currentDate = currentDate.add(1, "day");
    // }
    // setMeetings(
    //   dates.map((val) => {
    //     return {
    //       start: val,
    //       end: val,
    //       title: "Booking Available",
    //       outside: true,
    //     };
    //   })
    // );
  }, []);

  const onNavigate = (date, view) => {
    let start, end;
    setCurrentDate(date);

    if (view === "month") {
      // start = moment(date).startOf("month").format("YYYY-MM-DD")

      // end = moment(date).endOf("month").format("YYYY-MM-DD")
      setstartDateLo(moment(date).startOf("month").format("YYYY-MM-DD"));

      setendDateLo(moment(date).endOf("month").format("YYYY-MM-DD"));
    }

    return console.log({ start, end });
  };

  const dayPropGetter = (date) => {
    const isInRange = moment(date).isBetween(
      moment(watch("fromDate")),
      moment(watch("toDate")),
      null,
      "[]"
    );
    return {
      style: {
        background: isInRange ? "lightblue" : "white",
        color: isInRange ? "black" : "inherit",
        border: "solid #DB8876",
        borderRadius: "5px",
      },
    };
  };

  const _dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 6 && {
        style: {
          // color: "red",
          // backgroundColor: "#FFA07A",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // width: "50px",
        },
      }),
      ...(moment(date).day() === 0 && {
        style: {
          // color: "red",
          // backgroundColor: "#FFA07A",
        },
      }),
    }),
    []
  );

  // const handleSelectEvent = useCallback(
  //   // (event) => window.alert(event.title),
  //   (event) => {
  //     loging(event), setIsModalOpen(true);
  //   },
  //   []
  // );

  const handleSelectEvent = (event) => {
    console.log(
      "eve",
      event,
      event.title == ("Booking Available" || "बुकिंग उपलब्ध")
    );

    // Adding an extra field
    const modified = {
      ...event, // Copy existing properties
      mode:
        event.title == ("Booking Available" || "बुकिंग उपलब्ध")
          ? "modal_one"
          : "modal_two", // Add the new field
    };

    setSelectedEvent(modified);
    loging(event), event?.title && setIsModalOpen(true);
  };

  useEffect(() => {}, [selectedSendDates]);

  const handleSelectSlot = (e) => {
    setValue("selectedDate", e.start);
    if (!watch("fromDate") && !watch("toDate")) {
      toast("Please select from and to date !", {
        type: "error",
      });
    }
    let start = watch("fromDate");
    // let end = watch("toDate")?.format("YYYY-MM-DD");
    let end = watch("toDate");
    let dateToCheck = moment(e.start)?.format("YYYY-MM-DD");

    if (moment(dateToCheck)?.isBetween(start, end, null, "[]")) {
      setIsSelectModalOpen(true);
      setValue("eventHrs", null);
      setSelectedValues([]);
      if (selectedSendDates.includes(moment(e.start).format("YYYY/MM/DD"))) {
        //user has already liked. Choose one option (1 or 2)

        //Option 1: create a new like array without the current user
        const newLikes = selectedSendDates.filter(
          (like) =>
            moment(like).format("YYYY/MM/DD") !==
            moment(e.start).format("YYYY/MM/DD")
        );

        //Option 1: update state with new likes
        setSelectedSendDates(newLikes);

        //Option 2: or do nothing
        return;

        //this executes if the user has not liked yet
      } else {
        setSelectedSendDates([
          ...selectedSendDates,
          moment(e.start).format("YYYY/MM/DD"),
        ]);
      }
    }
  };

  const loging = (event) => {
    setSendquery(event);
    // filterDocketAddToLocalStorage("startDate", event.start)
    // filterDocketAddToLocalStorage("queryParams", event)
    return event;
  };

  const handleChangeRadio = (event) => {
    setValue("employeeId", null);
    setValue("employeeName", null);
    setValue("employeeDepartment", null);
    setValue("employeeDesignation", null);
    setValue("mobile", null);
    setValue("emailAddress", null);

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

  const [rateChartData, setRateChartData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [shortlistData, setShortlistData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let appName = "PABBM";
  let serviceName = "PABBM-DRPBA";

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getNextBookingKey();
    getShifts();
    getAuditorium();
    getChargeNames();
    getBank();
    getEvents();
    getSlots();
    getEquipment();
    getEquipmentCharges();
    getNexAuditoriumBookingNumber();
    getDepartments();
    getDesignation();
    getEmployee();
    getDocuments();
    // getAvailableSlotsForBooking();
  }, []);

  useEffect(() => {
    getAuditoriumBooking();
  }, [auditoriums]);

  useEffect(() => {
    getNormalBookingDataFirst();
  }, []);

  useEffect(() => {
    set_LoggedInUser(localStorage.getItem("loggedInUser"));
    if (localStorage.getItem("loggedInUser") == "cfcUser") {
      setValue("loggedInUserCFC", true);
    } else {
      setValue("loggedInUserCFC", false);
      user?.firstName &&
        setValue("applicantName", user?.firstName + " " + user?.surname);
      setValue("applicantMobileNo", user?.mobile);
      setValue("applicantConfirmMobileNo", user?.mobile);
      setValue("applicantEmail", user?.emailID);
      setValue("applicantConfirmEmail", user?.emailID);
      setValue("applicantFlatHouseNo", user?.pflatBuildingNo);
      setValue("applicantFlatBuildingName", user?.pbuildingName);
      setValue("applicantLandmark", user?.plandmark);
      setValue("applicantArea", user?.proadName);
      setValue(
        "applicantCity",
        user?.pcity?.charAt(0).toUpperCase() +
          user?.pcity?.slice(1).toLowerCase()
      );
      setValue("applicantPinCode", user?.ppincode);
    }
  }, []);

  useEffect(() => {
    const dates = [];

    auditoriums?.map((val) => {
      if (val.id == watch("auditoriumKey")) {
        let start = moment(val.startTime.split("T")[1], "HH:mm");
        let end = moment(val.endTime.split("T")[1], "HH:mm");
        let middile = moment(val.startTime.split("T")[1], "HH:mm");

        middile.add(1, "hour");

        while (true) {
          if (start.isAfter(end)) {
            break;
          }
          dates.push({
            fromTime: start.format("HH:mm"),
            toTime: middile.format("HH:mm"),
          });
          start = start.add(60, "minutes");
          middile = middile.add(60, "minutes");
        }

        dates.pop();
        // setAllSlots(dates);
      }
    }),
      // Iterate through available slots and if from time matches with the start time of the allslots then mark is same as true

      dates.map((row) => {
        let _aa = row.fromTime;

        // find matching from all slots where _aa matches with value of fromTime
        let _bb = availableSlots.find(
          (val) =>
            val.fromTime.split(":")[0] + ":" + row.fromTime.split(":")[1] == _aa
        );
        // set _bb isSame to true
        if (_bb) {
          row.isSame = true;
        } else {
          row.isSame = false;
        }
      });

    setAllSlots(dates);

    //bookingDate: "2023-03-27"
  }, [availableSlots]);

  const getEmployee = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let _res = res.data.user;

        setEmployee(
          _res.map((val) => {
            return {
              ...val,
              id: val.id,
              firstNameEn: val.firstNameEn,
              lastNameEn: val.lastNameEn,
              empCode: val.empCode,
              phoneNo: val.phoneNo,
            };
          })
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAdvanceBookingDataFirst = () => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstTimeSlots/getSlotDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        const isBetween = moment(new Date()).isBetween(
          r?.data?.publishFromDate,
          r?.data?.publishToDate,
          null,
          "[]"
        );

        if (isBetween) {
          toast("Advance Booking Is Open", {
            type: "Success",
          });
          r?.data?.fromDate && setValue("fromDate", r?.data?.fromDate);
          r?.data?.toDate && setValue("toDate", r?.data?.fromDate);

          // r?.data?.fromDate && setValue("eventDateFrom", r?.data?.fromDate);
          // r?.data?.toDate && setValue("eventDateTo", r?.data?.fromDate);

          // r?.data?.fromDate &&
          //   setValue("eventDayFrom", moment(r?.data?.fromDate).format("dddd"));
          // r?.data?.toDate &&
          //   setValue("eventDayTo", moment(r?.data?.fromDate).format("dddd"));

          setAdvanceStaticData(r?.data);
          setShowDatePicker(true);
        } else {
          toast(
            `Advance Booking Is Closed, Next booking will start from ${moment(
              r?.data?.publishFromDate
            ).format("DD/MM/YYYY")} to ${moment(r?.data?.publishToDate).format(
              "DD/MM/YYYY"
            )} for Dates ${moment(r?.data?.fromDate).format(
              "DD/MM/YYYY"
            )} to ${moment(r?.data?.toDate).format("DD/MM/YYYY")}`,
            {
              type: "error",
            }
          );
          setShowDatePicker(false);
        }
        setLoading(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const calendarStyles = {
    calendar: {
      height: "80vh",
      width: "80vw",
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

  const getNormalBookingDataFirst = () => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstTimeSlots/getFromDateToDateForNormalBooking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        let date1 = moment(new Date()).format("YYYY-MM-DD");
        let date2 = moment(r?.data?.bookingConformationDate).format(
          "YYYY-MM-DD"
        );

        console.log("Normal data static", r?.data);
        setLoading(false);
        setAdvanceStaticData(r?.data);
        if (moment(date1).isAfter(date2)) {
          setShowDatePicker(true);
        } else {
          toast("Booking Is Closed !", {
            type: "error",
          });
          setShowDatePicker(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getNexAuditoriumBookingNumber = () => {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("neext key", r);
        setNextEntryNumber(r.data);
        setValue("auditoriumBookingNo", r?.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const handleSelect = (event) => {
    console.log("4545ftf", selectedPreviouslyBookedValues, event.target.value);
    // setSelectedValues(event.target.value);

    let abc = event.target.value?.map((val) => {
      return val?.split(" To ");
    });

    const checkOverlap = (timeSegments) => {
      if (timeSegments.length === 1) return false;

      timeSegments.sort((timeSegment1, timeSegment2) =>
        timeSegment1[0].localeCompare(timeSegment2[0])
      );

      for (let i = 0; i < timeSegments.length - 1; i++) {
        const currentEndTime = timeSegments[i][1];

        const nextStartTime = timeSegments[i + 1][0];

        if (currentEndTime > nextStartTime) {
          return true;
        }
      }

      return false;
    };

    const isOverlap = checkOverlap(abc);

    if (!isOverlap) {
      setSelectedValues(event.target.value);
      setSendData([
        ...sendData,
        {
          date: moment(watch("selectedDate")).format("YYYY/MM/DD"),
          time: event.target.value,
        },
      ]);

      // sendData?.map((val) => {
      //   return setMeetings([
      //     ...meetings,
      //     {
      //       start: moment(val?.date).format("YYYY/MM/DD"),
      //       end: moment(val?.date).format("YYYY/MM/DD"),
      //       title: val?.time[0],
      //     },
      //   ]);
      // });
    } else {
      toast(
        "Can't Book this slot as it is booked already, Please select other slot !",
        {
          type: "error",
        }
      );
    }
  };

  useEffect(() => {
    let collectData = [];

    let abc = sendData?.map((val) => {
      let xyz = val.time?.map((item) => ({
        date: val.date,
        time: item,
      }));
      collectData = xyz;
      // return xyz
    });

    console.log("sendData", sendData, collectData);

    setFinalData((prev) => [...prev, ...collectData]);
  }, [sendData]);

  useEffect(() => {
    // finalData.filter((obj, index, self) => {
    //   return index === self.findIndex((o) => o.time === obj.time);
    // });
    console.log("finalData", finalData);
  }, [finalData]);

  const textFieldRef = useRef(null);
  const clickOutsideHandlerRef = useRef(null);

  const handleTextFieldBlur = () => {
    if (isDirty && !clickOutsideHandlerRef.current) {
      getEmployeeDetails();
      // Bind the event listener for the first time only
      document.addEventListener("mousedown", clickOutsideHandlerRef.current);
    }
  };

  const getEmployeeDetails = () => {
    let selectedEmployee = employee?.filter((item) => {
      return item.empCode === watch("employeeId");
    });

    if (selectedEmployee?.length > 0) {
      setValue("employeeDepartment", selectedEmployee[0]?.department);
      setValue(
        "employeeName",
        selectedEmployee[0]?.firstNameEn + " " + selectedEmployee[0]?.lastNameEn
      );
      setValue("emailAddress", selectedEmployee[0]?.email);
      setValue("mobile", selectedEmployee[0]?.phoneNo);
      setValue("mobile", selectedEmployee[0]?.phoneNo);
      setValue(
        "employeeDesignation",
        selectedEmployee[0]?.officeDepartmentDesignationUserDaoLst[0]
          ?.designationId
      );
    } else {
      toast("Wrong employee Id/Code or user not found !!!", {
        type: "error",
      });
    }
  };

  const getRateChartForSelectedShift = async (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);

    const filteredData = finalData?.filter((obj, index, self) => {
      return index === self?.findIndex((o) => o.time === obj.time);
    });

    const _eventHours = filteredData?.map((val) => {
      return (
        val?.time?.split(" To ")[1]?.split(":")[0] -
        val?.time?.split(" To ")[0]?.split(":")[0]
      );
    });

    const eventHours = _eventHours?.filter(
      (item, index) => _eventHours?.indexOf(item) === index
    );

    await axios
      .get(
        // `${urls.PABBMURL}/mstRateChart/getRateByAuditoriumKeyEventKeyApplicationDateAndShift`,
        `${urls.PABBMURL}/mstRateChart/getRateByAuditoriumKeyEventKeyApplicationDateAndShiftTicketRange`,
        {
          params: {
            auditoriumKey: watch("auditoriumKey"),
            eventKey: watch("eventKey"),
            // fromDate: moment(watch("fromDate")).format("DD/MM/YYYY"),
            // toDate: moment(watch("toDate")).format("DD/MM/YYYY"),
            applicationDate: moment(watch("fromDate")).format("DD/MM/YYYY"),
            period: _eventHours.toString(),
            // period: "3,5",
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
            ticketRange: watch("ticket"),
            userId: user?.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("res RC", res);
        setShowBookingChargesTable(true);
        setAccordionOpen(true);
        setLoading(false);
        let result = res?.data?.mstRateChartList;
        console.log(
          "res result",
          result,
          result?.some((obj) => obj.chargeNameKey == 33)
        );
        if (
          res?.data?.message == "You Cant Book Multiple Slot In Single Day."
        ) {
          toast("You Can't Book Multiple Slot In Single Day.", {
            type: "error",
          });
          return;
        }
        if (result?.length == 0) {
          toast("No rate chart available for this event!", {
            type: "error",
          });
          return;
        }
        if (result == null) {
          toast("Please Select Further Event or event hours!", {
            type: "error",
          });
          return;
        }
        // if (!result?.some((obj) => obj.chargeNameKey == 33)) {
        //   toast("Please Select Further Event!", {
        //     type: "error",
        //   });
        //   return;
        // }
        if (
          result?.some((obj) => obj.chargeNameKey == 33) &&
          !result?.some((obj) => obj.chargeNameKey == 34)
        ) {
          toast(
            "No rate chart available for selected event, Please Select Further Event...!",
            {
              type: "error",
            }
          );
          return;
        }
        let _res = result.map((val, i) => {
          console.log(
            "_ress",
            val.price,
            chargeNames,
            val.chargeNameKey,
            chargeNames?.find((obj) => {
              return obj?.id == val.chargeNameKey;
            })?.charge,
            chargeNames?.find((obj) => {
              return obj?.id == val.chargeNameKey;
            })?.charge == "Deposit"
              ? "-"
              : (0.09 * val.price).toFixed(2)
          );
          return {
            activeFlag: val.activeFlag,
            // srNo: i + 1,
            srNo: i + 1 + _pageNo * _pageSize,
            id: i,
            auditoriumName: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == val.auditoriumKey;
                })?.auditoriumNameEn
              : "-",
            eventName: val.eventKey
              ? events?.find((obj) => {
                  return obj?.id == val.eventKey;
                })?.eventNameEn
              : "-",
            chargeName: val.chargeNameKey
              ? chargeNames?.find((obj) => {
                  return obj?.id == val.chargeNameKey;
                })?.charge
              : "-",
            _charge: val.chargeNameKey ? val.chargeNameKey : "-",
            price: val.price ? val.price.toFixed(2) : "-",
            fromDate: val.fromDate
              ? moment(val.fromDate).format("DD-MM-YYYY")
              : "-",
            id: val.id,
            period: val.period,
            cgst:
              chargeNames?.find((obj) => {
                return obj?.id == val.chargeNameKey;
              })?.charge == "Deposit"
                ? "-"
                : (0.09 * val.price).toFixed(2),
            sgst:
              chargeNames?.find((obj) => {
                return obj?.id == val.chargeNameKey;
              })?.charge == "Deposit"
                ? "-"
                : (0.09 * val.price).toFixed(2),
            totalGst:
              chargeNames?.find((obj) => {
                return obj?.id == val.chargeNameKey;
              })?.charge == "Deposit"
                ? val.price.toFixed(2)
                : (1.18 * val.price).toFixed(2),
            totalPages: res.data.totalPages,
            totalElements: res.data.totalElements,
            pageNo: res.data.pageNo,
            pageSize: res.data.pageSize,
          };
        });
        // let _test = {};
        // _res?.map((val) => {
        //   chargeNames?.map((obj) => {
        //     if (obj?.id == val?._charge) {
        //       _test = { ..._test, [obj?.charge]: val?.price };
        //     }
        //   });
        // })

        let _test = [];
        _res?.map((val) => {
          chargeNames?.map((obj, index) => {
            if (obj?.id == val?._charge) {
              _test.push({ [obj?.charge]: val?.totalGst });
            }
          });
        });

        const ____result = _test.reduce((acc, obj) => {
          Object.keys(obj).forEach((key) => {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj[key]);
          });
          return acc;
        }, {});

        const abcdeh = {};

        for (const key in ____result) {
          if (____result.hasOwnProperty(key)) {
            const values = ____result[key];
            const sum = values.reduce((acc, curr) => acc + curr, 0);
            abcdeh[key] = sum;
          }
        }

        console.log("abcdeh", abcdeh);

        // setValue("depositAmount", abcdeh?.Deposit);
        // setValue("boardChargesAmount", abcdeh["Board Charges"]);
        // setValue(
        //   "securityGuardChargesAmount",
        //   abcdeh["Security Guard Charges"]
        // );
        // setValue("rentAmount", abcdeh?.Rent);

        let testing22 = filteredData?.map((val) => {
          return {
            time:
              val?.time?.split(" To ")[1]?.split(":")[0] -
              val?.time?.split(" To ")[0]?.split(":")[0],
            date: val?.date,
            _time: val?.time,
          };
        });

        let ss = [];
        testing22.map((rr) => {
          let kk = _res
            .filter((item) => {
              return rr.time == item.period;
            })
            .map((_item) => {
              return {
                ...rr,
                ..._item,
              };
            });
          kk && ss.push(kk);
        });
        setMultiDataGrid(ss);

        /////////////////////////////////////////////////////
        // Define variables to store deposit and rent amounts
        let depositAmount = 0;
        let rentWithoutGst = 0;
        let rentAmount = 0;

        // const rentAmountAccordingToBookingFor =
        //   showData?.bookingFor == "Booking For PCMC Employee"
        //     ? showData?.rentAmount - showData?.rentAmount * 0.5
        //     : showData?.bookingFor == "Booking For Other Than PCMC"
        //     ? showData?.rentAmount - showData?.rentAmount * 0.3
        //     : showData?.rentAmount;

        // Iterate through the outer array
        for (const innerArray of ss) {
          // Iterate through the objects within each inner array
          for (const obj of innerArray) {
            console.log("builder", obj);
            // Check the chargeName and set the corresponding amount
            if (obj.chargeName === "Deposit" && obj.price > depositAmount) {
              depositAmount = Number(obj.price);
            } else if (obj.chargeName === "Rent") {
              rentWithoutGst = Number(obj.price);
              rentAmount = Number(obj.totalGst);
            }
          }
        }

        console.log("::total", depositAmount, rentAmount);
        setValue("depositAmount", depositAmount);
        setValue("rentAmount", rentAmount);
        setValue("rentAmountWithoutGst", rentWithoutGst);

        /////////////////////////////////////////////////////

        setRateChartData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });

        console.log("filteredData2", filteredData);

        setFinalData(filteredData);
      })
      ?.catch((err) => {
        console.log("err", err);
        setAccordionOpen(false);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  console.log("getValues", getValues());

  const getChargeNames = () => {
    axios
      .get(`${urls.CFCURL}/master/chargeName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("charge names", res);
        let result = res.data.chargeName;
        let _res = result.map((val, i) => {
          return {
            ...val,
          };
        });

        setChargeNames(_res);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getSlots = () => {
    axios
      .get(`${urls.CFCURL}/master/slot/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setSlots(
          r.data.slots.map((row, index) => ({
            id: row.id,
            fromTime: row.fromTime,
            toTime: row.toTime,
            slotDate: row.slotDate,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getEquipment = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipment/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEquipments(res?.data?.mstEquipmentList);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getEquipmentCharges = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCharges/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEquipmentCharges(res?.data?.mstEquipmentChargesList);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            ...row,
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDepartments(
          r?.data?.department?.map((row, index) => ({
            ...row,
            id: row.id,
            department: row.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getDesignation = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDesignations(
          // r.data.designation.map((row) => ({
          //   id: row.id,
          //   description: row.description,
          // })),
          r.data.designation
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getBank = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // .get("http://15.206.219.76:8090/cfc/api/master/bank/getAll")
      .then((r) => {
        setBank(r?.data?.bank);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getEvents = () => {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setEvents(
          r.data.trnAuditoriumEventsList.map((row) => ({
            ...row,
            id: row.id,
            programEventDescription: row.programEventDescription,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getNextBookingKey = () => {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setNextKeyToSend(r?.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  function isWithinDateRange(startDate, endDate, startDay, endDay) {
    const start = moment(startDate);
    const end = moment(endDate);

    // Check if the start and end dates are within the specified day range
    if (start.isoWeekday() >= startDay && end.isoWeekday() <= endDay) {
      return true;
    }

    return false;
  }

  function separateEventsByDate(events) {
    const separatedEvents = [];

    for (const event of events) {
      console.log("444", event);
      const startDate = event.start;
      const endDate = event.end;
      const currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        separatedEvents.push({
          title: event.title,
          start: new Date(currentDate),
          end: new Date(currentDate),
          outside: event?.outside,
        });

        // Move to the next date
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    console.log("eventzz", separatedEvents);

    return separatedEvents;
  }

  const getAvailableSlotsForBooking = (auditoriumKey, fromDate, toDate) => {
    if ((toDate - fromDate) / (1000 * 60 * 60 * 24) + 1 > 4) {
      toast(
        "Please select correct date, date should be in between Monday to Thursday or Friday to Sunday",
        {
          type: "error",
        }
      );
    }
    if (
      (isWithinDateRange(fromDate, toDate, 1, 4) ||
        isWithinDateRange(fromDate, toDate, 5, 7)) &&
      !isWithinDateRange(fromDate, toDate, 5, 1)
    ) {
      // Range is between Monday to thursday or Friday to Sunday
      setLoading(true);
      axios
        .get(
          // `${urls.PABBMURL}/auditoriumBookingDetails/getBookingDetailsByDateAndAuditoriumId`,
          `${urls.PABBMURL}/auditoriumBookingDetails/getBookingDetailsByAuditoriumAndFromToDate`,
          {
            params: {
              auditoriumId: auditoriumKey,
              fromDate: moment(fromDate).format("DD/MM/YYYY"),
              toDate: moment(toDate).format("DD/MM/YYYY"),
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          console.log("slots from BE", r);
          setAllData(r.data);
          // setSelectedValues(
          //   r?.data?.previouslyBooked?.map((row) => {
          //     return (
          //       moment(row?.fromTime, "HH:mm:ss").format("HH:mm") +
          //       " To " +
          //       moment(row?.toTime, "HH:mm:ss").format("HH:mm")
          //     );
          //   })
          // );
          setSelectedPreviouslyBookedValues(
            r?.data?.previouslyBooked?.map((row) => {
              return {
                date: row?.bookingDate,
                timing:
                  moment(row?.fromTime, "HH:mm:ss").format("HH:mm") +
                  " To " +
                  (moment(row?.toTime, "HH:mm:ss").format("HH:mm") == "00:00"
                    ? "24:00"
                    : moment(row?.toTime, "HH:mm:ss").format("HH:mm")),
              };
            })
          );
          setShowCalendar(true);

          let eve = r?.data?.previouslyBooked?.map((row) => ({
            title:
              language == "en"
                ? `Booked ${moment(row?.fromTime, "HH:mm:ss").format(
                    "HH:mm"
                  )} To ${
                    moment(row?.toTime, "HH:mm:ss").format("HH:mm") == "00:00"
                      ? "24:00"
                      : moment(row?.toTime, "HH:mm:ss").format("HH:mm")
                  }`
                : `बुक केले ${moment(row?.fromTime, "HH:mm:ss").format(
                    "HH:mm"
                  )} ते ${
                    moment(row?.toTime, "HH:mm:ss").format("HH:mm") == "00:00"
                      ? "24:00"
                      : moment(row?.toTime, "HH:mm:ss").format("HH:mm")
                  }`,

            start: moment(row?.bookingDate).format("YYYY/MM/DD"),
            end: moment(row?.bookingDate).format("YYYY/MM/DD"),
            outside: false,
          }));

          setCurrentDate(watch("fromDate"));

          // setMeetings([
          //   ...eve,
          //   {
          //     start: moment(watch("fromDate")).format("YYYY/MM/DD"),
          //     end: moment(watch("toDate")).format("YYYY/MM/DD"),
          //     title: "Booking Available",
          //     outside: true,
          //   },
          // ]);

          const separatedEvents = separateEventsByDate([
            ...eve,
            {
              start: moment(watch("fromDate")).format("YYYY/MM/DD"),
              end: moment(watch("toDate")).format("YYYY/MM/DD"),
              title: language == "en" ? "Booking Available" : "बुकिंग उपलब्ध",
              outside: true,
            },
          ]);

          setMeetings(separatedEvents);

          const _isBetween = moment(watch("fromDate")).isBetween(
            advanceStaticData?.fromDate,
            advanceStaticData?.toDate,
            null,
            "[]"
          );

          if (!_isBetween) {
            toast("Please select correct date for advance booking", {
              type: "error",
            });
          }

          // setAvailableSlots(
          //   r.data.previouslyBooked.map((row) => ({
          //     ...row,
          //     id: row.id,
          //   }))
          // );

          setLoading(false);
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
      console.log("Selected date range is valid");
    } else {
      toast(
        "Please select correct date, date should be in between Monday to Thursday or Friday to Sunday",
        {
          type: "error",
        }
      );
      return;
    }
  };

  const getShifts = () => {
    axios
      .get(`${urls.PABBMURL}/mstEventHour/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setShifts(
          r.data.mstEventHourList.map((row, index) => ({
            id: row.id,
            timeSlot: row.timeSlot,
            shift: row.shift,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const checkIsInRange = (arr1 = [], arr2 = []) => {
    let inRange = false;
    if (!arr2 || arr2?.length == 0) return inRange;
    let _arr1 = arr1?.split(" To ");
    let _arr2 = arr2?.split(" To ");

    _arr1?.forEach((val) => {
      inRange =
        parseInt(val) >= parseInt(_arr2[0]) &&
        parseInt(_arr1[0]) <= parseInt(_arr2[1]);
    });
    return inRange;
  };

  const getAuditoriumBooking = () => {
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        // "http://192.168.68.123:9003/pabbm/api/trnAuditoriumBookingOnlineProcess/getAll",
      )
      .then((res) => {
        console.log("res aud", res);
        let _result = res.data.trnAuditoriumBookingOnlineProcessList[0];
        setBookedAud(_result);

        let result = res.data.trnAuditoriumBookingOnlineProcessList;
        let _res = result.map((val, i) => {
          return {
            // srNo: _pageSize * _pageNo + i + 1,
            id: val.id,
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            toDate: val.toDate ? val.toDate : "-",
            fromDate: val.fromDate ? val.fromDate : "-",
            holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
            // status: val.activeFlag === "Y" ? "Active" : "Inactive",
            status: val.applicationStatus,
            activeFlag: val.activeFlag,

            auditoriumId: val.auditoriumId
              ? auditoriums.find((obj) => obj?.id == val.auditoriumId)
                  ?.auditoriumNameEn
              : "Not Available",
            eventDate: val.eventDate
              ? moment(val?.eventDate).format("DD-MM-YYYY")
              : "-",
            mobile: val.mobile ? val.mobile : "-",
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName +
                " " +
                val.organizationOwnerLastName
              : "-",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
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
          axios
            .post(`${urls.CFCURL}/master/billType/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAuditoriumBooking();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
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
          axios
            .post(`${urls.CFCURL}/master/billType/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAuditoriumBooking();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  useEffect(() => {
    console.log("attachmentss", watch("attachmentss"));
  }, [watch("attachmentss")]);

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
    _loggedInUser == "cfcUser"
      ? router.push("../../../CFC_Dashboard")
      : router.push("/dashboardV3");
  };

  const getToPaymentGateway = (payDetail) => {
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
      </form>`;
    document.getElementById("dynForm").submit();

    // document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
    // <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
    // <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
    // document.getElementById("dynForm").submit();
  };

  const getDocuments = () => {
    axios
      .get(
        `${
          urls.CFCURL
        }/master/serviceWiseChecklist/getAllByServiceId?serviceId=${113}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("122", res);
        setValue(
          "attachmentss",
          res?.data?.serviceWiseChecklist?.map((r, ind) => {
            return {
              ...r,
              docKey: r.document,
              id: data?.attachments?.find((dd) => dd.docKey == r.document)?.id
                ? data?.attachments?.find((dd) => dd.docKey == r.document)?.id
                : null,
              status: r.isDocumentMandetory ? "Mandatory" : "Optional",
              statusMr: r.isDocumentMandetory ? "अनिवार्य" : "ऐच्छिक",
              srNo: ind + 1,
              filePath: data?.attachments?.find((dd) => dd.docKey == r.document)
                ?.filePath
                ? data?.attachments?.find((dd) => dd.docKey == r.document)
                    ?.filePath
                : null,
            };
          })
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (formData) => {
    console.log("formDara", formData);
    sweetAlert({
      title: language === "en" ? "Auditorium Booking" : "प्रेक्षागृह बुकिंग",
      text:
        language === "en"
          ? "Do you really want to book an auditorium?"
          : "तुम्हाला खरोखरच प्रेक्षागृह / नाट्यगृह बुक करायचे आहे का?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((will) => {
      if (will) {
        // const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
        const eventDate = moment(formData.eventDateFrom).format("YYYY-MM-DD");

        let initials = auditoriums?.find((obj) => {
          return obj?.id == Number(watch("auditoriumKey"));
        })?.auditoriumNameEn;

        let words = initials?.split(" ");
        let loggedInUser = localStorage.getItem("loggedInUser");
        console.log("loggedInUser", loggedInUser);

        const rentAmountAccordingToBookingFor =
          bookingFor == "Booking For PCMC Employee"
            ? Number(
                formData?.rentAmountWithoutGst -
                  formData?.rentAmountWithoutGst * 0.5
              )
            : bookingFor == "Booking For Other Than PCMC"
            ? Number(
                formData?.rentAmountWithoutGst -
                  formData?.rentAmountWithoutGst * 0.3
              )
            : Number(formData?.rentAmountWithoutGst);

        setValue("rentAmount", rentAmountAccordingToBookingFor * 1.18);

        let obj = {
          // applicationNumber: res?.data?.applicationNumber,
          applicationNumber: nextEntryNumber,
          id: null,
          applicationStatus: "APPLICATION_DRAFT",
        };

        const finalBodyForApi = {
          ...formData,
          createdUserId: user?.id,
          isApproved: true,
          eventDate,
          applicationNumber: nextEntryNumber.toString(),
          applicationDate: new Date(),
          auditoriumId: Number(formData.auditoriumId),
          aadhaarNo: Number(formData.aadhaarNo),
          landlineNo: Number(formData.landlineNo),
          mobile: Number(formData.mobile),
          depositAmount: Number(formData.depositAmount),
          payRentAmount: Number(formData.payRentAmount),
          pincode: Number(formData.pincode),
          // rentAmount: Number(formData.rentAmount),
          rentAmount: watch("rentAmount"),
          extendedRentAmount: Number(formData.extendedRentAmount),
          bankaAccountNo: Number(formData.bankaAccountNo),
          pincode: Number(formData?.pinCode),
          bookingFor: bookingFor,
          flatBuildingNo: Number(formData.flatBuildingNo),
          //booked data
          shift: watch("eventHrs"),
          startTime: watch("startTime"),
          // auditoriumBookingDetailsList: selectedCheckbox.map((val) => {
          //   return {
          //     auditoriumId: watch("auditoriumKey"),
          //     fromTime: val.split("-")[0].trim(),
          //     toTime: val.split("-")[1].trim(),
          //     bookingDate: moment(watch("fromDate")).format("YYYY-MM-DD"),
          //     // bookingKey: nextKeyToSend,
          //     applicationNumberKey: nextEntryNumber.toString(),
          //   };
          // }),
          // auditoriumBookingDetailsList: selectedValues.map((val) => {
          //   return {
          //     auditoriumId: watch("auditoriumKey"),
          //     fromTime: val.split("To")[0].trim(),
          //     toTime: val.split("To")[1].trim(),
          //     // fromTime: "20:00",
          //     // toTime: "23:00",
          //     bookingDate: moment(watch("fromDate")).format("YYYY-MM-DD"),
          //     // bookingKey: nextKeyToSend,
          //     applicationNumberKey: nextEntryNumber.toString(),
          //   };
          // }),
          auditoriumBookingDetailsList: finalData
            .filter((obj, index, self) => {
              return index === self.findIndex((o) => o.time === obj.time);
            })
            ?.map((val) => {
              return {
                auditoriumId: watch("auditoriumKey"),
                fromTime: val?.time?.split("To")[0].trim(),
                toTime:
                  val?.time?.split("To")[1].trim() == "24:00"
                    ? "00:00"
                    : val?.time?.split("To")[1].trim(),
                bookingDate: moment(val?.date).format("YYYY-MM-DD"),
                applicationNumberKey: nextEntryNumber.toString(),
              };
            }),
          totalAmount: (formData.depositAmount + watch("rentAmount")) * 1.18,
          serviceId: 113,
          paymentDao: {
            bankAccountHolderName: formData?.bankAccountHolderName,
            bankaAccountNo: formData?.bankaAccountNo,
            typeOfBankAccountId: formData?.typeOfBankAccount,
            bankNameId: formData?.bankNameId,
            bankAddress: formData?.bankAddress,
            ifscCode: formData?.ifscCode,
            micrCode: formData?.micrCode,
          },
          processType: "B",
          designation: "Citizen",
          bookingType: auditoriumBookingTypeValue,
          auditoriumTitle: words
            ?.map(function (word) {
              return word.charAt(0);
            })
            .join(""),
          actionBy: user?.firstName + " " + user?.surname,
          applicantType:
            loggedInUser == "citizenUser"
              ? 1
              : loggedInUser == "departmentUser"
              ? 3
              : 2,
          departmentalCopy:
            watch("attachmentss") &&
            watch("attachmentss")[0]?.filePathEncrypted,
          otherCopy:
            watch("attachmentss") &&
            watch("attachmentss")[1]?.filePathEncrypted,
          dumbInfo: JSON.stringify(obj),
          zoneKey: auditoriums?.find((obj) => {
            return Number(obj?.id) == Number(formData.auditoriumId);
          })?.zoneId,
        };

        console.log("formData", formData, "finalBodyForApi", finalBodyForApi);

        if (loggedInUser == "cfcUser") {
          console.log("cfcUser");
          /////////////////////////////////
          axios
            .post(
              `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`,
              finalBodyForApi,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              console.log("save data", res);
              if (res.status == 201) {
                // formData.id
                //   ? sweetAlert(
                //       "Updated!",
                //       "Record Updated successfully !",
                //       "success"
                //     )
                //   : sweetAlert(
                //       "Saved!",
                //       `Record Saved successfully, Your Application Number is ${res?.data?.applicationNumber}`,
                //       "success"
                //     );
                setCfcAudBookedDetails(res.data);
                getAuditoriumBooking();
                setButtonInputState(false);
                setIsOpenCollapse(true);
                setEditButtonInputState(false);
                setDeleteButtonState(false);

                const body = {
                  cfcId: user?.userDao?.cfc,
                  serviceId: 113,
                  moduleId: 16,
                  paymentAmount: Number(formData?.depositAmount),
                };

                axios
                  .post(
                    `${urls.CFCURL}/trasaction/cfcPaymentDetails/save`,
                    body,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((_res) => {
                    console.log("RES Topup", _res);
                    if (_res.status == 200 || _res.status == 201) {
                      if (_res?.data?.message == "InSufficient Balance...") {
                        console.log("_res.message", _res.message);

                        sweetAlert({
                          title: language === "en" ? "Error" : "त्रुटी",
                          text:
                            language === "en"
                              ? "Insufficient wallet balance!"
                              : "वॉलेटमध्ये अपुरी शिल्लक!",
                          dangerMode: false,
                          closeOnClickOutside: false,
                          buttons: [
                            language === "en" ? "Exit" : "बाहेर पडा",
                            language === "en" ? "Topup wallet" : "टॉपअप वॉलेट",
                          ],
                        }).then((will) => {
                          if (will) {
                            router.push(
                              "../../common/transactions/topUpProcess"
                            );
                          } else {
                            router.push("../../CFC_Dashboard");
                          }
                        });
                      } else {
                        const ppcBody = {
                          id: res?.data?.id,
                          depositAmount: res?.data?.depositAmount,
                          auditoriumBookingDetailsList: JSON.parse(
                            res?.data?.timeSlotList
                          ),
                          processType: "B",
                          designation: "CFC",
                          remark: res?.data?.remark,
                        };
                        console.log("ppcBody", ppcBody);

                        axios
                          .post(
                            `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/processPaymentCollection`,
                            ppcBody,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          )
                          .then((resp) => {
                            console.log("omkar", resp);
                            formData.id
                              ? sweetAlert(
                                  "Updated!",
                                  "Record Updated successfully !",
                                  "success"
                                )
                              : sweetAlert(
                                  "Saved!",
                                  `Record Saved successfully, Your Application Number is ${res?.data?.applicationNumber}`,
                                  "success"
                                );
                            router.push("/CFC_Dashboard");
                          })
                          .catch((err) => {
                            console.log("er", err);
                            swal("Error!", "Somethings Wrong!", "error");
                          });
                      }
                    }
                  });
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
          /////////////////////////////////
        } else {
          // if (watch("eventHrs") == 2) {
          //   console.log("eventHrs");
          //   axios
          //     .post(
          //       `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`,
          //       finalBodyForApi,
          //       {
          //         headers: {
          //           Authorization: `Bearer ${token}`,
          //         },
          //       }
          //     )
          //     .then((res) => {
          //       console.log("save data", res);
          //       if (res.status == 201) {
          //         formData.id
          //           ? sweetAlert(
          //               "Updated!",
          //               "Record Updated successfully !",
          //               "success"
          //             )
          //           : sweetAlert(
          //               "Saved!",
          //               `Record Saved successfully, Your Application Number is ${res?.data?.applicationNumber}`,
          //               "success"
          //             );

          //         getAuditoriumBooking();
          //         setButtonInputState(false);
          //         setIsOpenCollapse(true);
          //         setEditButtonInputState(false);
          //         setDeleteButtonState(false);

          //         let ccAvenueKitLtp = null;
          //         switch (location.hostname) {
          //           case "localhost":
          //             ccAvenueKitLtp = "L";
          //             break;
          //           case "noncoredev.pcmcindia.gov.in":
          //             ccAvenueKitLtp = "T";
          //             break;
          //           case "noncoreuat.pcmcindia.gov.in":
          //             ccAvenueKitLtp = "T";
          //             break;
          //           default:
          //             ccAvenueKitLtp = "L";
          //             break;
          //         }

          //         let testBodyCC = {
          //           currency: "INR",
          //           language: "EN",
          //           moduleId: "PABBM",
          //           amount: Number(formData?.rentAmount),
          //           divertPageLink:
          //             "PublicAuditorium/transaction/auditoriumBooking/pgSuccessRentRehearsal",
          //           loiId: 0,
          //           loiNo: "NA",
          //           ccAvenueKitLtp: ccAvenueKitLtp,
          //           serviceId: 113,
          //           applicationNo: Number(nextEntryNumber),
          //           applicationId: Number(nextEntryNumber),
          //           domain: window.location.hostname,
          //         };

          //         axios
          //           .post(
          //             `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
          //             testBodyCC,
          //             {
          //               headers: {
          //                 Authorization: `Bearer ${token}`,
          //               },
          //             }
          //           )
          //           .then((res) => {
          //             console.log("RES", res);
          //             if (res.status == 200 || res.status == 201) {
          //               let tempBody = {
          //                 encRequest: res.data.encRequest,
          //                 access_code: res.data.access_code,
          //               };

          //               getToPaymentGateway(res.data);
          //             }
          //           });
          //       }
          //     })
          //     ?.catch((err) => {
          //       console.log("err", err);
          //       setLoading(false);
          //       callCatchMethod(err, language);
          //     });
          // } else {
          axios
            .post(
              `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`,
              finalBodyForApi,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              console.log("save data", res);
              if (res.status == 201) {
                formData.id
                  ? sweetAlert(
                      "Updated!",
                      "Record Updated successfully !",
                      "success"
                    )
                  : sweetAlert(
                      "Saved!",
                      `Record Saved successfully, Your Application Number is ${res?.data?.applicationNumber}`,
                      "success"
                    );

                getAuditoriumBooking();
                setButtonInputState(false);
                setIsOpenCollapse(true);
                setEditButtonInputState(false);
                setDeleteButtonState(false);

                let ccAvenueKitLtp = null;
                switch (location.hostname) {
                  case "localhost":
                    ccAvenueKitLtp = "L";
                    break;
                  case "noncoredev.pcmcindia.gov.in":
                    ccAvenueKitLtp = "T";
                    break;
                  case "noncoreuat.pcmcindia.gov.in":
                    ccAvenueKitLtp = "T";
                    break;
                  default:
                    ccAvenueKitLtp = "L";
                    break;
                }

                let testBodyCC = {
                  currency: "INR",
                  language: "EN",
                  moduleId: "PABBM",
                  amount: Number(formData?.depositAmount),
                  divertPageLink:
                    "PublicAuditorium/transaction/auditoriumBooking/pgSuccessDeposite",
                  loiId: 0,
                  loiNo: "NA",
                  ccAvenueKitLtp: ccAvenueKitLtp,
                  serviceId: 113,
                  applicationNo: Number(nextEntryNumber),
                  applicationId: Number(nextEntryNumber),
                  domain: window.location.hostname,
                };

                axios
                  .post(
                    `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
                    testBodyCC,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((res) => {
                    console.log("RES", res);
                    if (res.status == 200 || res.status == 201) {
                      let tempBody = {
                        encRequest: res.data.encRequest,
                        access_code: res.data.access_code,
                      };

                      getToPaymentGateway(res.data);
                    }
                  });
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
          // }
        }
        /////////////////////////////////////////////////////////////
        // axios
        //   .post(
        //     `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
        //     testBody
        //   )
        //   .then((res) => {
        //     console.log("RES", res);
        //     if (res.status == 200 || res.status == 201) {
        //       let tempBody = {
        //         encRequest: res.data.encRequest,
        //         access_code: res.data.access_code,
        //       };

        //       getToPaymentGateway(res.data);
        //     }
        //   });
      }
      // if (will) {
      //   console.log("formData AUD BOOKING", formData);

      //   const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");

      //   let initials = auditoriums?.find((obj) => {
      //     return obj?.id == Number(watch("auditoriumKey"));
      //   })?.auditoriumNameEn;

      //   let words = initials.split(" ");
      //   let loggedInUser = localStorage.getItem("loggedInUser");

      //   const finalBodyForApi = {
      //     ...formData,
      //     createdUserId: user?.id,
      //     isApproved: true,
      //     eventDate,
      //     applicationNumber: nextEntryNumber.toString(),
      //     // auditoriumBookingNo: Number(formData.auditoriumBookingNo),
      //     auditoriumId: Number(formData.auditoriumId),
      //     aadhaarNo: Number(formData.aadhaarNo),
      //     landlineNo: Number(formData.landlineNo),
      //     mobile: Number(formData.mobile),
      //     depositAmount: Number(formData.depositAmount),
      //     payRentAmount: Number(formData.payRentAmount),
      //     pincode: Number(formData.pincode),
      //     rentAmount: Number(formData.rentAmount),
      //     extendedRentAmount: Number(formData.extendedRentAmount),
      //     bankaAccountNo: Number(formData.bankaAccountNo),
      //     pincode: Number(formData?.pinCode),
      //     bookingFor: bookingFor,
      //     flatBuildingNo: Number(formData.flatBuildingNo),
      //     //booked data
      //     shift: watch("eventHrs"),
      //     startTime: watch("startTime"),
      //     // auditoriumBookingDetailsList: selectedCheckbox.map((val) => {
      //     //   return {
      //     //     auditoriumId: watch("auditoriumKey"),
      //     //     fromTime: val.split("-")[0].trim(),
      //     //     toTime: val.split("-")[1].trim(),
      //     //     bookingDate: moment(watch("fromDate")).format("YYYY-MM-DD"),
      //     //     // bookingKey: nextKeyToSend,
      //     //     applicationNumberKey: nextEntryNumber.toString(),
      //     //   };
      //     // }),
      //     // auditoriumBookingDetailsList: selectedValues.map((val) => {
      //     //   return {
      //     //     auditoriumId: watch("auditoriumKey"),
      //     //     fromTime: val.split("To")[0].trim(),
      //     //     toTime: val.split("To")[1].trim(),
      //     //     // fromTime: "20:00",
      //     //     // toTime: "23:00",
      //     //     bookingDate: moment(watch("fromDate")).format("YYYY-MM-DD"),
      //     //     // bookingKey: nextKeyToSend,
      //     //     applicationNumberKey: nextEntryNumber.toString(),
      //     //   };
      //     // }),
      //     auditoriumBookingDetailsList: finalData
      //       .filter((obj, index, self) => {
      //         return index === self.findIndex((o) => o.time === obj.time);
      //       })
      //       ?.map((val) => {
      //         return {
      //           auditoriumId: watch("auditoriumKey"),
      //           fromTime: val?.time?.split("To")[0].trim(),
      //           toTime:
      //             val?.time?.split("To")[1].trim() == "24:00"
      //               ? "00:00"
      //               : val?.time?.split("To")[1].trim(),
      //           // fromTime: "20:00",
      //           // toTime: "23:00",
      //           bookingDate: moment(val?.date).format("YYYY-MM-DD"),
      //           // bookingKey: nextKeyToSend,
      //           applicationNumberKey: nextEntryNumber.toString(),
      //         };
      //       }),

      //     // equipmentBookingList: formData.levelsOfRolesDaoList.map((val) => {
      //     //   return {
      //     //     equipmentKey: Number(val.equipment),
      //     //     quantity: Number(val.quantity),
      //     //     rate: Number(val.rate),
      //     //     total: Number(val.total),
      //     //     applicationNumberKey: nextEntryNumber.toString(),
      //     //   };
      //     // }),
      //     totalAmount:
      //       (formData.depositAmount +
      //         formData.rentAmount +
      //         formData.securityGuardChargesAmount +
      //         formData.boardChargesAmount) *
      //       1.18,
      //     securityGuardChargeAmount: Number(
      //       formData.securityGuardChargesAmount
      //     ),
      //     boardChargesAmount: Number(formData.boardChargesAmount),
      //     serviceId: 113,
      //     paymentDao: {
      //       bankAccountHolderName: formData?.bankAccountHolderName,
      //       bankaAccountNo: formData?.bankaAccountNo,
      //       typeOfBankAccountId: formData?.typeOfBankAccount,
      //       bankNameId: formData?.bankNameId,
      //       bankAddress: formData?.bankAddress,
      //       ifscCode: formData?.ifscCode,
      //       micrCode: formData?.micrCode,
      //     },
      //     processType: "B",
      //     designation: "Citizen",
      //     bookingType: auditoriumBookingTypeValue,
      //     auditoriumTitle: words
      //       .map(function (word) {
      //         return word.charAt(0);
      //       })
      //       .join(""),
      //     actionBy: user?.firstName + " " + user?.surname,
      //     applicantType:
      //       loggedInUser == "citizenUser"
      //         ? 1
      //         : loggedInUser == "departmentUser"
      //         ? 3
      //         : 2,
      //   };

      //   console.log("finalBodyForApi", finalBodyForApi);

      //   axios
      //     .post(
      //       `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`,
      //       finalBodyForApi
      //     )
      //     .then((res) => {
      //       console.log("save data", res);
      //       if (res.status == 201) {
      //         formData.id
      //           ? sweetAlert(
      //               "Updated!",
      //               "Record Updated successfully !",
      //               "success"
      //             )
      //           : sweetAlert(
      //               "Saved!",
      //               `Record Saved successfully, Your Application Number is ${res?.data?.applicationNumber}`,
      //               "success"
      //             );

      //         getAuditoriumBooking();
      //         setButtonInputState(false);
      //         setIsOpenCollapse(true);
      //         setEditButtonInputState(false);
      //         setDeleteButtonState(false);
      //         router.push({
      //           pathname: "./auditoriumBooking/acknowledgmentReceiptmarathi",
      //           query: "",
      //         });
      //       }
      //     });
      // }
      else {
        // router.push("/dashboard");
      }
    });
  };

  const onSaveAsDraft = async (formData) => {
    console.log("formData 33", formData);

    try {
      await schema.validate(formData, { abortEarly: false });
      // Validation succeeded, proceed with your logic for Button 2
      console.log("formData submitted from Button 2:", formData);
      // Clear any previous validation errors
      sweetAlert({
        title: language === "en" ? "Auditorium Booking" : "प्रेक्षागृह बुकिंग",
        text:
          language === "en"
            ? "Do you want to apply?"
            : "तुम्हाला अर्ज करायचा आहे का?",
        dangerMode: false,
        closeOnClickOutside: false,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((will) => {
        if (will) {
          // const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
          const eventDate = moment(formData.eventDateFrom).format("YYYY-MM-DD");

          let initials = auditoriums?.find((obj) => {
            return obj?.id == Number(watch("auditoriumKey"));
          })?.auditoriumNameEn;

          let words = initials.split(" ");
          let loggedInUser = localStorage.getItem("loggedInUser");

          // const rentAmountAccordingToBookingFor =
          //   bookingFor == "Booking For PCMC Employee"
          //     ? formData?.rentAmount - formData?.rentAmount * 0.5
          //     : bookingFor == "Booking For Other Than PCMC"
          //     ? formData?.rentAmount - formData?.rentAmount * 0.3
          //     : formData?.rentAmount;

          // setValue("rentAmount", rentAmountAccordingToBookingFor);

          const rentAmountAccordingToBookingFor =
            bookingFor == "Booking For PCMC Employee"
              ? Number(
                  formData?.rentAmountWithoutGst -
                    formData?.rentAmountWithoutGst * 0.5
                )
              : bookingFor == "Booking For Other Than PCMC"
              ? Number(
                  formData?.rentAmountWithoutGst -
                    formData?.rentAmountWithoutGst * 0.3
                )
              : Number(formData?.rentAmountWithoutGst);

          console.log(
            "rentAmountAccordingToBookingFor",
            rentAmountAccordingToBookingFor * 1.18
          );

          setValue("rentAmount", rentAmountAccordingToBookingFor * 1.18);

          const finalBodyForApi = {
            ...formData,
            createdUserId: user?.id,
            isApproved: true,
            eventDate,
            applicationNumber: nextEntryNumber.toString(),
            applicationDate: new Date(),
            // auditoriumBookingNo: Number(formData.auditoriumBookingNo),
            auditoriumId: Number(formData.auditoriumId),
            aadhaarNo: Number(formData.aadhaarNo),
            landlineNo: Number(formData.landlineNo),
            mobile: Number(formData.mobile),
            depositAmount: watch("previousDeposit")
              ? watch("previousDeposit")
              : Number(formData.depositAmount),
            payRentAmount: Number(formData.payRentAmount),
            pincode: Number(formData.pincode),
            // rentAmount: Number(formData.rentAmount),
            rentAmount: watch("rentAmount"),
            extendedRentAmount: Number(formData.extendedRentAmount),
            bankaAccountNo: Number(formData.bankaAccountNo),
            pincode: Number(formData?.pinCode),
            bookingFor: bookingFor,
            flatBuildingNo: Number(formData.flatBuildingNo),
            //booked data
            shift: watch("eventHrs"),
            startTime: watch("startTime"),

            auditoriumBookingDetailsList: finalData
              .filter((obj, index, self) => {
                return index === self.findIndex((o) => o.time === obj.time);
              })
              ?.map((val) => {
                return {
                  auditoriumId: watch("auditoriumKey"),
                  fromTime: val?.time?.split("To")[0].trim(),
                  toTime:
                    val?.time?.split("To")[1].trim() == "24:00"
                      ? "00:00"
                      : val?.time?.split("To")[1].trim(),
                  // fromTime: "20:00",
                  // toTime: "23:00",
                  bookingDate: moment(val?.date).format("YYYY-MM-DD"),
                  // bookingKey: nextKeyToSend,
                  applicationNumberKey: nextEntryNumber.toString(),
                };
              }),
            totalAmount: (formData.depositAmount + watch("rentAmount")) * 1.18,
            serviceId: 113,
            paymentDao: {
              bankAccountHolderName: formData?.bankAccountHolderName,
              bankaAccountNo: formData?.bankaAccountNo,
              typeOfBankAccountId: formData?.typeOfBankAccount,
              bankNameId: formData?.bankNameId,
              bankAddress: formData?.bankAddress,
              ifscCode: formData?.ifscCode,
              micrCode: formData?.micrCode,
            },
            processType: "B",
            designation: "Citizen",
            bookingType: auditoriumBookingTypeValue,
            auditoriumTitle: words
              .map(function (word) {
                return word.charAt(0);
              })
              .join(""),
            actionBy: user?.firstName + " " + user?.surname,
            applicantType:
              loggedInUser == "citizenUser"
                ? 1
                : loggedInUser == "departmentUser"
                ? 3
                : 2,
            departmentalCopy:
              watch("attachmentss") &&
              watch("attachmentss")[0]?.filePathEncrypted,
            otherCopy:
              watch("attachmentss") &&
              watch("attachmentss")[1]?.filePathEncrypted,
            zoneKey: auditoriums?.find((obj) => {
              return Number(obj?.id) == Number(formData.auditoriumId);
            })?.zoneId,
          };

          console.log(
            "formData AUD BOOKING",
            formData,
            "finalBodyForApi",
            finalBodyForApi
          );

          axios
            .post(
              `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`,
              finalBodyForApi,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              console.log("save data", res);
              if (res.status == 201) {
                formData.id
                  ? sweetAlert(
                      "Updated!",
                      "Record Updated successfully !",
                      "success"
                    )
                  : sweetAlert(
                      "Saved!",
                      `Record Saved successfully, Your Application Number is ${res?.data?.applicationNumber}`,
                      "success"
                    );

                getAuditoriumBooking();
                setButtonInputState(false);
                setIsOpenCollapse(true);
                setEditButtonInputState(false);
                setDeleteButtonState(false);
                router.push("/dashboardV3");
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else {
          // router.push("/dashboard");
        }
      });
      clearErrors();
    } catch (error) {
      console.log("err", error);
      // Validation failed, set errors in the form
    }
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

  const _columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: "Auditorium",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "bookingDate",
      headerName: "Event Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "shift",
      headerName: "Shift",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const rateChartColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "auditoriumName",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 310,
    },
    {
      field: "eventName",
      headerName: <FormattedLabel id="eventName" />,
      flex: 0.4,
      headerAlign: "center",
      minWidth: 130,
    },
    {
      field: "chargeName",
      headerName: <FormattedLabel id="chargeName" />,
      flex: 0.7,
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "period",
      headerName: <FormattedLabel id="period" />,
      flex: 0.4,
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "price",
      headerName: <FormattedLabel id="price" />,
      flex: 0.4,
      align: "right",
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "cgst",
      headerName: <FormattedLabel id="cgst" />,
      flex: 0.4,
      align: "right",
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "sgst",
      headerName: <FormattedLabel id="sgst" />,
      flex: 0.4,
      align: "right",
      minWidth: 70,
      headerAlign: "center",
    },
    {
      field: "totalGst",
      headerName: <FormattedLabel id="total" />,
      flex: 0.4,
      align: "right",
      headerAlign: "center",
      minWidth: 70,
    },
  ];

  const columnsF = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "documentChecklistEn" : "documentChecklistMr",
      // field: "documentChecklistEn",
      headerName: language == "en" ? "Document Name" : "दस्तऐवजाचे नाव",
      flex: 1,
    },
    {
      field: language == "en" ? "status" : "statusMr",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: language == "en" ? "Upload Document" : "दस्तऐवज अपलोड करा",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <UploadButtonOP
              appName={appName}
              serviceName={serviceName}
              fileDtl={getValues(
                `attachmentss[${params.row.srNo - 1}].filePath`
              )}
              fileKey={params.row.srNo - 1}
              showDel={true}
            />
          </>
        );
      },
    },
  ];

  const handleSlotChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    //chargeKey
    //33 Depo,34 rent,35 Security,36 Board

    if (isChecked) {
      setSelectedCheckbox([...selectedCheckbox, value]);

      let _test = {};
      rateChartData?.rows?.map((val) => {
        chargeNames?.map((obj) => {
          if (obj?.id == val?._charge) {
            _test = { ..._test, [obj?.charge]: val?.price };
          }
        });
      }),
        setValue("depositAmount", _test.Deposit);
      setValue("boardChargesAmount", _test["Board Charges"]);
      setValue("securityGuardChargesAmount", _test["Security Guard Charges"]);
      setValue("rentAmount", _test.Rent);

      // setValue(
      //   "boardChargesAmount",
      //   ((selectedCheckbox.length + 1) * _test["Board Charges"]) / watch("shift"),
      // );
      // setValue(
      //   "securityGuardChargesAmount",
      //   ((selectedCheckbox.length + 1) * _test["Security Guard Charges"]) / watch("shift"),
      // );
      // setValue("rentAmount", ((selectedCheckbox.length + 1) * _test.Rent) / watch("shift"));

      // setValue("rentAmount", ((selectedCheckbox.length + 1) * rateChartData.rows[3].price) / watch("shift"));
    } else {
      setSelectedCheckbox(selectedCheckbox.filter((val) => val !== value));
    }
  };

  const getFilteredShowTimes = (value) => {
    let aa = allData.showTimes.map((val) => {
      return val.split(/\s+/).join("").split("To");
    });

    let bb = aa.map((val) => {
      let ee = moment.duration(
        moment(val[1], "HH:mm").diff(moment(val[0], "HH:mm"))
      );
      return (
        ee.hours() == value.target.value && val
        // val[1].split(":")[0] - val[0].split(":")[0] == value.target.value && val
      );
    });

    let cc = bb?.map((val) => {
      return val && val[0] + " To " + val[1];
    });
    setFilteredShowTimes(cc);
  };

  const [auditoriumBookingTypeValue, setAuditoriumBookingTypeValue] = useState(
    "Normal Auditorium Booking"
  );

  const handleAuditoriumBookingTypeValueChange = (event) => {
    if (event.target.value == "Advanced Auditorium Booking") {
      getAdvanceBookingDataFirst();
    } else if (event.target.value == "Normal Auditorium Booking") {
      // window.location.reload();
      getNormalBookingDataFirst();
      setValue("fromDate", null);
      setValue("toDate", null);
      setShowDatePicker(true);
    }
    setAuditoriumBookingTypeValue(event.target.value);
  };

  const getAuditoriumBookingDetailsById = (id) => {
    setLoading(true);
    console.log("oid", id);

    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setLoading(true);
        setValue("previousDeposit", r?.data?.depositAmount);
        if (!moment(r?.data?.eventDate)?.isSameOrBefore(moment(), "day")) {
          toast("The Event is not done yet", {
            type: "error",
          });
        }
        if (r?.data?.depositAmount) {
          setShowPreviousDeposit(true);
        }
        console.log("By id", r);
        setLoading(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setShowPreviousDeposit(false);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Paper>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
            }}
          >
            {/* <Grid item xs={1}></Grid> */}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PabbmHeader labelName="auditoriumBooking" />
              {/* </Grid>
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            > */}
              <Tooltip
                title={
                  <table
                    style={{
                      width: "100%",
                    }}
                  >
                    <tr>
                      <th className={styles.abcd}>Sr.No</th>
                      <th className={styles.abcd}>Booking Date</th>
                      <th className={styles.abcd}>Advance Booking Month</th>
                      <th className={styles.abcd}>Booking Confirmation Date</th>
                    </tr>
                    <tr>
                      <td className={styles.abcd}>1</td>
                      <td className={styles.abcd}>16 Nov To 25 Nov</td>
                      <td className={styles.abcd}>Jan, Feb ,Mar</td>
                      <td className={styles.abcd}>12 Dec</td>
                    </tr>
                    <tr>
                      <td className={styles.abcd}>2</td>
                      <td className={styles.abcd}>16 Feb To 25 Feb</td>
                      <td className={styles.abcd}>Apr, May, Jun</td>
                      <td className={styles.abcd}>12 March</td>
                    </tr>
                    <tr>
                      <td className={styles.abcd}>3</td>
                      <td className={styles.abcd}>16 May To 25 May</td>
                      <td className={styles.abcd}>Jul, Aug, Sept</td>
                      <td className={styles.abcd}>12 Jun</td>
                    </tr>
                    <tr>
                      <td className={styles.abcd}>4</td>
                      <td className={styles.abcd}>16 Aug To 25 Aug</td>
                      <td className={styles.abcd}>Oct, Nov, Dec</td>
                      <td className={styles.abcd}>12 Sept</td>
                    </tr>
                  </table>
                }
              >
                <InfoOutlinedIcon color="success" sx={{ fontSize: "30px" }} />
              </Tooltip>
            </Grid>
            {/* <Grid item xs={1}></Grid> */}
          </Grid>
          {/* {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            > */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <>
                {/* <Accordion sx={{ padding: "10px" }} defaultExpanded>
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>
                        Adjust Deposit
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="outlined-basic"
                            label={
                              "Previous Application Number"
                            }
                            variant="outlined"
                            size="small"
                            sx={{
                              width: "90%",
                            }}
                            {...register("previousApplicationNumber")}
                            error={!!errors.previousApplicationNumber}
                            helperText={
                              errors?.previousApplicationNumber
                                ? errors.previousApplicationNumber.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            variant="outlined"
                            color="success"
                            disabled={!watch("previousApplicationNumber")}
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor: "#0A4EE8",
                                color: "#fff",
                              },
                            }}
                            onClick={() => {
                              let enteredPreviousApplicationNumber = watch(
                                "previousApplicationNumber"
                              );
                              getAuditoriumBookingDetailsById(
                                enteredPreviousApplicationNumber
                              );
                            }}
                          >
                            Search
                          </Button>
                        </Grid>
                      </Grid>
                      {showPreviousDeposit && (
                        <Grid container>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              id="outlined-basic"
                              label={"Previous Deposit Amount"}
                              variant="outlined"
                              size="small"
                              disabled
                              sx={{
                                width: "90%",
                              }}
                              {...register("previousDeposit")}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion> */}
                <Accordion sx={{ padding: "10px" }} defaultExpanded>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="checkAuditoriumAvailability" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container sx={{ padding: "10px" }}>
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          {/* Auditorium Booking Type */}
                          <FormattedLabel id="auditoriumBookingType" />
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                          value={auditoriumBookingTypeValue}
                          onChange={handleAuditoriumBookingTypeValueChange}
                        >
                          <FormControlLabel
                            value="Normal Auditorium Booking"
                            control={<Radio />}
                            label={
                              <FormattedLabel id="normalAuditoriumBooking" />
                            }
                          />
                          <FormControlLabel
                            value="Advanced Auditorium Booking"
                            control={<Radio />}
                            label={
                              <FormattedLabel id="advancedAuditoriumBooking" />
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    {showDatePicker && (
                      <>
                        <Grid container style={{ padding: "10px" }}>
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
                              error={errors.auditoriumKey}
                              variant="outlined"
                              sx={{ width: "90%" }}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-outlined-label">
                                <FormattedLabel id="auditorium" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={field.value}
                                    onChange={(value) => {
                                      setValue(
                                        "auditoriumId",
                                        value.target.value
                                      );
                                      return field.onChange(value);
                                    }}
                                    label={<FormattedLabel id="auditorium" />}
                                  >
                                    {auditoriums &&
                                      auditoriums.map((auditorium, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={auditorium.id}
                                          >
                                            {language === "en"
                                              ? `${auditorium?.auditoriumNameEn} (Seats : ${auditorium?.seatingCapacity})`
                                              : `${auditorium?.auditoriumNameMr} (जागा : ${auditorium?.seatingCapacity})`}
                                          </MenuItem>
                                        );
                                      })}
                                  </Select>
                                )}
                                name="auditoriumKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.auditoriumKey
                                  ? errors.auditoriumKey.message
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
                              variant="outlined"
                              sx={{ width: "90%" }}
                              error={!!errors.eventKey}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-outlined-label">
                                <FormattedLabel id="selectEvent" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={field.value}
                                    onChange={(value) => {
                                      setValue("serviceId", value.target.value);
                                      return field.onChange(value);
                                    }}
                                    label={
                                      <FormattedLabel
                                        id="selectEvent"
                                        required
                                      />
                                    }
                                  >
                                    {events?.map((service, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={service.id}
                                        >
                                          {language === "en"
                                            ? service.eventNameEn
                                            : service.eventNameMr}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="eventKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.eventKey
                                  ? errors.eventKey.message
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
                            lg={6}
                            xl={6}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "end",
                            }}
                          >
                            <FormControl
                              sx={{ width: "90%" }}
                              error={errors.calendar}
                            >
                              <Controller
                                name="fromDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      open={advanceStaticData?.fromDate}
                                      minDate={
                                        auditoriumBookingTypeValue ==
                                        "Normal Auditorium Booking"
                                          ? new Date()
                                          : advanceStaticData?.fromDate
                                      }
                                      maxDate={advanceStaticData?.toDate}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel
                                            id="fromDate"
                                            required
                                          />
                                          {/* From Date */}
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) => {
                                        field.onChange(date);
                                        // setValue(
                                        //   "eventDayFrom",
                                        //   moment(date).format("dddd")
                                        // );
                                        // setValue("eventDateFrom", date);
                                        setValue("toDate", null);
                                      }}
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          fullWidth
                                          error={errors.calendar}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.calendar
                                  ? errors.calendar.message
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
                              alignItems: "end",
                            }}
                          >
                            <FormControl
                              sx={{ width: "90%" }}
                              error={errors.calendar}
                            >
                              <Controller
                                name="toDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      // minDate={watch("fromDate")}
                                      disabled={!watch("fromDate")}
                                      minDate={
                                        auditoriumBookingTypeValue ==
                                        "Normal Auditorium Booking"
                                          ? // ? new Date()
                                            watch("fromDate")
                                          : advanceStaticData?.fromDate
                                      }
                                      maxDate={advanceStaticData?.toDate}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel
                                            id="toDate"
                                            required
                                          />
                                          {/* To Date */}
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) => {
                                        field.onChange(date);
                                        setValue(
                                          "eventDayTo",
                                          moment(date).format("dddd")
                                        );
                                        setValue("eventDateTo", date);

                                        let _abc = [];

                                        let dates = [];

                                        let start = moment(watch("fromDate"));
                                        let end = moment(watch("toDate"));

                                        while (true) {
                                          if (start?.isAfter(end)) {
                                            break;
                                          }
                                          dates?.push({
                                            date: start?.format("DD-MM-YYYY"),
                                          });
                                          start = start?.add(1, "days");
                                        }

                                        setDaysOfSlots(dates);

                                        // for (
                                        //   var m = moment(watch("fromDate"));
                                        //   m.isBefore(watch("toDate"));
                                        //   m.add(1, "days")
                                        // ) {
                                        //   startDate.push(m.format("DD-MM-YYYY"));
                                        // }

                                        // for (
                                        //   let i = 0;
                                        //   i <= moment(watch("toDate")).diff(moment(watch("fromDate")), "days");
                                        //   i++
                                        // ) {
                                        //   _abc.push(i + 1);
                                        // }
                                        // setDaysOfSlots(_abc);
                                      }}
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          fullWidth
                                          error={errors.calendar}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.calendar
                                  ? errors.calendar.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          sx={{
                            padding: "10px",
                            display: "flex",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              disabled={
                                !(
                                  watch("auditoriumKey") &&
                                  watch("eventKey") &&
                                  watch("fromDate") &&
                                  watch("toDate")
                                )
                              }
                              endIcon={<SearchIcon />}
                              onClick={() => {
                                setShowListOfShifts(true);
                                setAvailableSlots([]);
                                getAvailableSlotsForBooking(
                                  watch("auditoriumKey"),
                                  watch("fromDate"),
                                  watch("toDate")
                                );
                              }}
                            >
                              {/* Search */}
                              <FormattedLabel id="search" />
                            </Button>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              disabled={
                                !watch("fromDate") &&
                                !watch("toDate") &&
                                !watch("auditoriumKey") &&
                                !watch("eventKey")
                              }
                              onClick={() => {
                                setValue("fromDate", null);
                                setValue("toDate", null);
                                setValue("auditoriumKey", null);
                                setValue("eventKey", null);

                                //reset calendar & rate chart as well
                                setMeetings([]);
                                setCurrentDate(new Date());
                                setShowCalendar(false);
                                setSelectedPreviouslyBookedValues([]);
                                setAllData();
                                setShowBookingChargesTable(false);
                                setAccordionOpen(false);
                                setMultiDataGrid(null);
                                setRateChartData({
                                  rows: [],
                                  totalRows: 0,
                                  rowsPerPageOptions: [10, 20, 50, 100],
                                  pageSize: 10,
                                  page: 1,
                                });
                                setFinalData([]);
                              }}
                            >
                              <FormattedLabel id="reset" />
                            </Button>
                          </Box>
                        </Grid>
                      </>
                    )}
                    {showCalendar && (
                      <>
                        {/* <Grid
                            container
                            sx={{
                              padding: "10px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <FormGroup fullWidth sx={{ width: "40%" }}>
                              <FormControl
                                fullWidth
                                error={errors.shift}
                                variant="outlined"
                                size="small"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  <FormattedLabel id="shift" />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-outlined-label"
                                      id="demo-simple-select-outlined"
                                      value={field.value}
                                      onChange={(value) => {
                                        return field.onChange(value);
                                      }}
                                      label={<FormattedLabel id="shift" />}
                                    >
                                      {shifts.map((auditorium, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={auditorium.timeSlot}
                                          >
                                            {auditorium.shift +
                                              " " +
                                              "(" +
                                              auditorium.timeSlot +
                                              " " +
                                              "Hrs" +
                                              ")"}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  )}
                                  name="shift"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.shift ? errors.shift.message : null}
                                </FormHelperText>
                              </FormControl>
                            </FormGroup>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              disabled={
                                !(
                                  watch("auditoriumKey") &&
                                  watch("eventKey") &&
                                  watch("fromDate") &&
                                  watch("toDate") &&
                                  watch("shift")
                                )
                              }
                              onClick={() => {
                                getRateChartForSelectedShift();
                              }}
                            >
                              Confirm
                            </Button>
                          </Grid> */}
                        <Divider />
                        {/* <Grid container sx={{ padding: "10px" }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 900 }}
                            >
                              Application Number :- {nextKeyToSend}
                            </Typography>
                          </Grid> */}

                        <Grid
                          container
                          sx={{
                            padding: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              padding: "10px",
                              border: "1px solid gray",
                              borderRadius: "5px",
                            }}
                            className="first"
                          >
                            <Calendar
                              // date={watch("fromDate")}
                              date={currentDate}
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
                              defaultDate={currentDate}
                              scrollToTime={new Date(1970, 1, 1, 6)}
                              onSelectEvent={(e) => handleSelectEvent(e)}
                              onSelectSlot={(e) => handleSelectSlot(e)}
                              onView={onView}
                              onNavigate={onNavigate}
                              // onNavigate={(e) => handleSelectSlot(e)}
                              dayPropGetter={dayPropGetter}
                              eventPropGetter={(event) => {
                                console.log("red", event);
                                const backgroundColor = event.outside
                                  ? "green"
                                  : "red";
                                return { style: { backgroundColor } };
                              }}
                              components={{
                                month: {
                                  header: ({ label }) => (
                                    <div style={calendarStyles.dateHeader}>
                                      {label}
                                    </div>
                                  ),
                                },
                              }}
                            />

                            {/* .............................MODAL............................... */}

                            <Modal
                              // title={<FormattedLabel id="eventModal" />}
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
                                  height: "50%",
                                  padding: "10px",
                                  width: "30%",
                                  backgroundColor: "white",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "5px",
                                }}
                              >
                                {console.log("selectedEvent", selectedEvent)}
                                {selectedEvent?.mode == "modal_two" && (
                                  <Typography variant="h6">
                                    {
                                      <FormattedLabel id="bookingConfirmedFor" />
                                    }
                                  </Typography>
                                )}
                                {selectedEvent?.mode == "modal_two" && (
                                  <Typography variant="h6">
                                    {language == "en"
                                      ? selectedEvent?.title
                                      : `${selectedEvent?.title
                                          .replace("Booked", "")
                                          .trim()}`}
                                  </Typography>
                                )}
                                {selectedEvent?.mode == "modal_one" && (
                                  <Typography variant="h6">
                                    {language == "en"
                                      ? selectedEvent?.title
                                      : `बुकिंग उपलब्ध`}
                                  </Typography>
                                )}
                                {/* <Typography variant="h6">
                                  {language == "en"
                                    ? selectedEvent?.title
                                    : `बुक केले ${selectedEvent?.title
                                        .replace("Booked", "")
                                        .trim()}`}
                                </Typography> */}

                                <Typography variant="h6">{`${
                                  language == "en" ? "Date" : "तारीख"
                                } - ${moment(selectedEvent?.start).format(
                                  "DD/MM/YYYY"
                                )}`}</Typography>
                                <Typography variant="h6">{`${
                                  language == "en" ? "Day" : "दिवस"
                                } - ${moment(selectedEvent?.start).format(
                                  "dddd"
                                )}`}</Typography>
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
                                  <FormattedLabel id="close" />
                                </Button>
                              </Box>
                            </Modal>

                            <Modal
                              title="Showtime Modal"
                              open={isSelectModalOpen}
                              onClose={handleSelectCancel}
                              onOk={true}
                              footer=""
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  height: "50%",
                                  width: "25%",
                                  backgroundColor: "white",
                                  display: "flex",
                                  // flexDirection: "column",
                                  flexWrap: "wrap",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "5px",
                                }}
                              >
                                <Grid
                                  item
                                  xs={12}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "end",
                                  }}
                                >
                                  <FormControl sx={{ width: "90%" }}>
                                    <Controller
                                      name="selectedDate"
                                      control={control}
                                      defaultValue={null}
                                      render={({ field }) => (
                                        <LocalizationProvider
                                          dateAdapter={AdapterMoment}
                                        >
                                          <DatePicker
                                            disabled
                                            inputFormat="DD/MM/YYYY"
                                            label={
                                              <span style={{ fontSize: 16 }}>
                                                Event Date
                                              </span>
                                            }
                                            value={field.value}
                                            onChange={(date) => {
                                              field.onChange(date);
                                            }}
                                            selected={field.value}
                                            center
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                size="small"
                                                fullWidth
                                              />
                                            )}
                                          />
                                        </LocalizationProvider>
                                      )}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "end",
                                  }}
                                >
                                  <FormControl
                                    error={errors.eventHrs}
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: "90%" }}
                                  >
                                    <InputLabel id="demo-simple-select-outlined-label">
                                      Event Hours
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          labelId="demo-simple-select-outlined-label"
                                          id="demo-simple-select-outlined"
                                          value={field.value}
                                          onChange={(value) => {
                                            field.onChange(value);
                                            getFilteredShowTimes(value);
                                          }}
                                          label="Event Hours"
                                        >
                                          {allData?.eventHours
                                            ?.sort((a, b) => a - b)
                                            ?.map((auditorium, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={auditorium}
                                                >
                                                  {auditorium}
                                                </MenuItem>
                                              );
                                            })}
                                        </Select>
                                      )}
                                      name="eventHrs"
                                      control={control}
                                      defaultValue=""
                                    />
                                    <FormHelperText>
                                      {errors?.eventHrs
                                        ? errors.eventHrs.message
                                        : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>

                                <Grid
                                  item
                                  xs={12}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "end",
                                  }}
                                >
                                  <FormControl
                                    fullWidth
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    size="small"
                                  >
                                    <InputLabel id="demo-simple-select-outlined-label">
                                      Show Time / Duration
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-outlined-label"
                                      id="demo-simple-select-outlined"
                                      multiple
                                      label="Show Time / Duration"
                                      value={selectedValues}
                                      onChange={handleSelect}
                                      renderValue={(selected) =>
                                        filteredShowTimes
                                          .filter((v) => selected.includes(v))
                                          .map((v) => v)
                                          .join(", ")
                                      }
                                    >
                                      {filteredShowTimes?.map(
                                        (value, index) => (
                                          <MenuItem
                                            sx={{
                                              display: value ? "flex" : "none",
                                            }}
                                            key={index}
                                            value={
                                              //@ts-ignore
                                              value
                                            }
                                            disabled={
                                              selectedPreviouslyBookedValues?.findIndex(
                                                ({ timing, date }) =>
                                                  checkIsInRange(
                                                    timing,
                                                    value
                                                  ) &&
                                                  date ==
                                                    moment(
                                                      watch("selectedDate")
                                                    ).format("YYYY-MM-DD")
                                              ) > -1
                                            }
                                            // disabled={checkIsInRange()}
                                          >
                                            <Checkbox
                                              disabled={
                                                selectedPreviouslyBookedValues?.findIndex(
                                                  ({ timing, date }) =>
                                                    checkIsInRange(
                                                      timing,
                                                      value
                                                    ) &&
                                                    date ==
                                                      moment(
                                                        watch("selectedDate")
                                                      ).format("YYYY-MM-DD")
                                                ) > -1
                                              }
                                              checked={
                                                selectedValues?.indexOf(value) >
                                                  -1 ||
                                                selectedPreviouslyBookedValues?.findIndex(
                                                  ({ timing, date }) =>
                                                    checkIsInRange(
                                                      timing,
                                                      value
                                                    ) &&
                                                    date ==
                                                      moment(
                                                        watch("selectedDate")
                                                      ).format("YYYY-MM-DD")
                                                ) > -1
                                              }
                                            />
                                            <ListItemText primary={value} />
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                  {/* <FormControl
                                      error={errors.showTimeDuration}
                                      variant="outlined"
                                      size="small"
                                      sx={{ width: "90%" }}
                                    >
                                      <InputLabel id="demo-simple-select-outlined-label">
                                        Show Time / Duration
                                      </InputLabel>
                                      <Controller
                                        render={({ field }) => (
                                          <Select
                                          {...field}
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={field.value}
                                            multiple
                                            onChange={(value) => {
                                              return field.onChange(value);
                                            }}
                                            label="Show Time / Duration"
                                          >
                                            {[
                                              "09.00 To 12.00",
                                              "09.00 To 12.00",
                                              "09.00 To 12.00",
                                            ]?.map((auditorium, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={auditorium}
                                                >
                                                  {auditorium}
                                                </MenuItem>
                                              );
                                            })}
                                          </Select>
                                        )}
                                        name="showTime"
                                        control={control}
                                        defaultValue=""
                                      />
                                      <FormHelperText>
                                        {errors?.showTimeDuration
                                          ? errors.showTimeDuration.message
                                          : null}
                                      </FormHelperText>
                                    </FormControl> */}
                                </Grid>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={6}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      endIcon={<ClearIcon />}
                                      size="small"
                                      onClick={() => {
                                        setValue("eventHrs", null);
                                        setSelectedValues([]);
                                      }}
                                    >
                                      Clear
                                    </Button>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={6}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="error"
                                      endIcon={<ExitToAppIcon />}
                                      size="small"
                                      onClick={handleSelectCancel}
                                    >
                                      Close
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Modal>
                          </div>
                        </Grid>

                        {/* <Grid container sx={{ padding: "10px" }}>
                            {daysOfSlots?.map((item) => {
                              return (
                                <Card sx={{ width: "100%" }}>
                                  <CardHeader
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      padding: "5px",
                                    }}
                                    subheader={item.date}
                                  />
                                  <Divider />

                                  <CardContent>
                                    <Grid container>
                                      {allSlots?.map((val, index) => {
                                        return (
                                          <Grid
                                            item
                                            xs={2}
                                            sx={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              border: "1px solid gray",
                                              borderRadius: "5px",
                                              margin: "5px",
                                            }}
                                          >
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  // checked={val.isSame}
                                                  value={
                                                    val.fromTime +
                                                    " - " +
                                                    val.toTime
                                                  }
                                                  checked={selectedCheckbox.includes(
                                                    val.fromTime +
                                                      " - " +
                                                      val.toTime
                                                  )}
                                                  disabled={val.isSame}
                                                  onChange={handleSlotChange}
                                                />
                                              }
                                              label={
                                                val.fromTime +
                                                " - " +
                                                val.toTime
                                              }
                                            />
                                          </Grid>
                                        );
                                      })}
                                    </Grid>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </Grid> */}
                        <Grid
                          container
                          sx={{
                            padding: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <FormLabel
                              component="legend"
                              sx={{ paddingLeft: "5%" }}
                            >
                              {<FormattedLabel id="ticket" />}
                            </FormLabel>
                            <FormControl
                              fullWidth
                              required
                              size="small"
                              sx={{ width: "100%" }}
                            >
                              <Controller
                                name="ticket"
                                control={control}
                                defaultValue={1}
                                render={({ field }) => (
                                  <RadioGroup
                                    {...field}
                                    defaultValue={1}
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-evenly",
                                    }}
                                  >
                                    <FormControlLabel
                                      value={1}
                                      control={<Radio />}
                                      label={
                                        <FormattedLabel id="withoutTicket" />
                                      }
                                    />
                                    <FormControlLabel
                                      value={2}
                                      control={<Radio />}
                                      label={<FormattedLabel id="withTicket" />}
                                    />
                                  </RadioGroup>
                                )}
                              />
                              <FormHelperText
                                style={{ color: "red" }}
                              ></FormHelperText>
                            </FormControl>
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
                          <Button
                            size="small"
                            variant="contained"
                            disabled={
                              watch("eventHrs") == undefined ||
                              selectedValues.length == 0 ||
                              multiDataGrid?.length > 0
                            }
                            color="success"
                            onClick={() => {
                              getRateChartForSelectedShift();
                            }}
                          >
                            <FormattedLabel id="confirmBookingForAboveSelectedDateAndTime" />
                          </Button>
                        </Grid>

                        {showBookingChargesTable && (
                          <>
                            <Grid container sx={{ padding: "10px" }}>
                              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                <FormattedLabel id="bookingCharges" /> -
                              </Typography>
                            </Grid>

                            {/* <Grid container sx={{ padding: "10px" }}>
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
                                  componentsProps={{
                                    toolbar: {
                                      showQuickFilter: true,
                                    },
                                  }}
                                  getRowId={(row) => row.srNo}
                                  components={{ Toolbar: GridToolbar }}
                                  autoHeight={rateChartData.pageSize}
                                  density="compact"
                                  pagination
                                  paginationMode="server"
                                  rowCount={rateChartData.totalRows}
                                  rowsPerPageOptions={
                                    rateChartData.rowsPerPageOptions
                                  }
                                  page={rateChartData.page}
                                  pageSize={rateChartData.pageSize}
                                  rows={rateChartData.rows}
                                  columns={rateChartColumns}
                                  onPageChange={(_data) => {
                                    getRateChartForSelectedShift(
                                      data.pageSize,
                                      _data
                                    );
                                  }}
                                  onPageSizeChange={(_data) => {
                                    getRateChartForSelectedShift(
                                      _data,
                                      data.page
                                    );
                                  }}
                                />
                              </Grid> */}

                            <Grid
                              container
                              sx={{
                                padding: "10px",
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                              }}
                            >
                              {multiDataGrid?.map((val, i) => {
                                console.log("val3", val);
                                return (
                                  <Box
                                    sx={{
                                      border: "1px solid gray",
                                      borderRadius: "5px",
                                      padding: "10px",
                                    }}
                                  >
                                    <Typography>{`Booking Date - ${moment(
                                      val[0]?.date
                                    ).format("DD/MM/YYYY")}`}</Typography>
                                    <Typography>{`Booking Time - ${val[0]?._time}`}</Typography>
                                    <DataGrid
                                      key={val.id}
                                      sx={{
                                        overflowY: "scroll",
                                        "& .MuiDataGrid-virtualScrollerContent":
                                          {},
                                        "& .MuiDataGrid-columnHeadersInner": {
                                          backgroundColor: "#556CD6",
                                          color: "white",
                                        },
                                        "& .MuiDataGrid-cell:hover": {
                                          color: "primary.main",
                                        },
                                      }}
                                      componentsProps={{
                                        toolbar: {
                                          showQuickFilter: true,
                                        },
                                      }}
                                      getRowId={(row) => row.id}
                                      components={{ Toolbar: GridToolbar }}
                                      autoHeight={true}
                                      density="compact"
                                      pagination
                                      paginationMode="server"
                                      rowCount={10}
                                      rowsPerPageOptions={[10, 20, 50, 100]}
                                      page={1}
                                      pageSize={val.pageSize}
                                      columns={rateChartColumns}
                                      rows={val}
                                      onPageChange={(_data) => {}}
                                      onPageSizeChange={(_data) => {}}
                                    />
                                    <Box
                                      sx={{
                                        paddingY: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        sx={{ fontWeight: "550" }}
                                      >{`Grand Total - ₹ ${val
                                        .map((ee) => {
                                          return parseFloat(ee.totalGst);
                                        })
                                        .reduce((acc, curr) => acc + curr, 0)
                                        ?.toFixed(2)} (18% GST (9% CGST +
                                            9% SGST))`}</Typography>
                                    </Box>
                                    <Divider />
                                  </Box>
                                );
                              })}
                              <Divider />
                            </Grid>
                          </>
                        )}

                        {/* <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              endIcon={<CheckIcon />}
                              onClick={() => {}}
                            >
                              Shortlist
                            </Button>
                          </Grid> */}
                      </>
                    )}

                    {/* <Box style={{ height: "auto", overflow: "auto" }}>
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
                          pagination
                          paginationMode="server"
                          rowCount={shortlistData.totalRows}
                          rowsPerPageOptions={shortlistData.rowsPerPageOptions}
                          page={shortlistData.page}
                          pageSize={shortlistData.pageSize}
                          rows={shortlistData.rows}
                          columns={_columns}
                          onPageChange={(_data) => {
                            // getBillType(data.pageSize, _data);
                          }}
                          onPageSizeChange={(_data) => {
                            // getBillType(_data, data.page);
                          }}
                        />
                      </Box> */}
                  </AccordionDetails>
                </Accordion>

                {/* <Accordion sx={{ padding: "10px" }}>
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>
                        <FormattedLabel id="equipments" />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          marginBottom: "10px",
                        }}
                      >
                        {router.query.mode === "view" ? (
                          <></>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            endIcon={<AddBoxOutlinedIcon />}
                            onClick={() => {
                              appendUI();
                            }}
                          >
                            <FormattedLabel id="addMore" />
                          </Button>
                        )}
                      </Box>
                      <Grid container>
                        {fields.map((witness, index) => {
                          return (
                            <>
                              <Grid
                                container
                                key={index}
                                sx={{
                                  backgroundColor: "#E8F6F3",
                                  padding: "5px",
                                }}
                              >
                                <Grid
                                  item
                                  xs={5}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControl
                                    style={{ width: "90%" }}
                                    size="small"
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                      <FormattedLabel id="equipments" />
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label={
                                            <FormattedLabel id="equipments" />
                                          }
                                          value={field.value}
                                          onChange={(value) => {
                                            field.onChange(value);
                                            let df = equipmentCharges.find(
                                              (val) => {
                                                return (
                                                  val.equipmentName ==
                                                    value.target.value &&
                                                  val.totalAmount
                                                );
                                              }
                                            );
                                            setValue(
                                              `levelsOfRolesDaoList.${index}.rate`,
                                              df?.totalAmount
                                            );
                                          }}
                                          style={{ backgroundColor: "white" }}
                                        >
                                          {equipments.length > 0
                                            ? equipments.map((val, id) => {
                                                return (
                                                  <MenuItem
                                                    key={id}
                                                    value={val.id}
                                                  >
                                                    {language === "en"
                                                      ? val.equipmentNameEn
                                                      : val.equipmentNameMr}
                                                  </MenuItem>
                                                );
                                              })
                                            : "Not Available"}
                                        </Select>
                                      )}
                                      name={`levelsOfRolesDaoList.${index}.equipment`}
                                      control={control}
                                      defaultValue=""
                                      key={witness.id}
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                      {errors?.departmentName
                                        ? errors.departmentName.message
                                        : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label={<FormattedLabel id="rate" />}
                                    disabled
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    variant="outlined"
                                    style={{ backgroundColor: "white" }}
                                    {...register(
                                      `levelsOfRolesDaoList.${index}.rate`
                                    )}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label={<FormattedLabel id="quantity" />}
                                    variant="outlined"
                                    style={{ backgroundColor: "white" }}
                                    {...register(
                                      `levelsOfRolesDaoList.${index}.quantity`
                                    )}
                                    key={witness.id}
                                    inputRef={register()}
                                    onChange={(event) => {
                                      const { value } = event.target;
                                      setValue(
                                        `levelsOfRolesDaoList[${index}].total`,
                                        value *
                                          watch(
                                            `levelsOfRolesDaoList.${index}.rate`
                                          )
                                      );
                                    }}
                                    error={
                                      errors?.levelsOfRolesDaoList?.[index]
                                        ?.quantity
                                    }
                                    helperText={
                                      errors?.levelsOfRolesDaoList?.[index]
                                        ?.quantity
                                        ? errors.levelsOfRolesDaoList?.[index]
                                            ?.quantity.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label={<FormattedLabel id="total" />}
                                    disabled
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    variant="outlined"
                                    style={{ backgroundColor: "white" }}
                                    {...register(
                                      `levelsOfRolesDaoList.${index}.total`
                                    )}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={1}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <IconButton
                                    color="error"
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion> */}

                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                      ".mui-style-o4b71y-MuiAccordionSummary-content.Mui-expanded":
                        {
                          margin: 0,
                        },
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="bookingAuditoriumDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container style={{ padding: "10px" }}>
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
                          error={errors.auditoriumId}
                          variant="outlined"
                          size="small"
                          sx={{ width: "90%" }}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            {" "}
                            <FormattedLabel id="selectAuditorium" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={field.value}
                                disabled
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="selectAuditorium" />}
                              >
                                {auditoriums &&
                                  auditoriums.map((auditorium, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={auditorium.id}
                                      >
                                        {auditorium.auditoriumNameEn}
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
                        lg={6}
                        xl={6}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          sx={{ width: "90%" }}
                          size="small"
                          error={!!errors.serviceId}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="selectEvent" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={field.value}
                                disabled
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="selectEvent" />}
                              >
                                {events &&
                                  events.map((service, index) => (
                                    <MenuItem
                                      key={index}
                                      sx={{
                                        display: service.programEventDescription
                                          ? "flex"
                                          : "none",
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
                          <FormHelperText>
                            {errors?.serviceId
                              ? errors.serviceId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            border:'solid red'
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={
                              <FormattedLabel id="auditoriumBookingNumber" />
                            }
                            variant="standard"
                            sx={{ width: "90%" }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            value={nextEntryNumber}
                            {...register("auditoriumBookingNo")}
                          />
                        </Grid> */}
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
                            value="Booking For PCMC Employee"
                            control={<Radio />}
                            label={<FormattedLabel id="bookingForPCMC" />}
                          />
                          <FormControlLabel
                            value="Booking For Other Than PCMC"
                            control={<Radio />}
                            label={
                              <FormattedLabel id="bookingForOtherVendor" />
                            }
                          />
                          <FormControlLabel
                            value="Booking For Other Organization"
                            control={<Radio />}
                            label={
                              <FormattedLabel id="bookingForOtherOrganization" />
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    {bookingFor === "Booking For PCMC Employee" && (
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
                            error={errors.employeeId}
                            variant="outlined"
                            size="small"
                            sx={{ width: "90%" }}
                          >
                            <Controller
                              name="employeeId"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  ref={textFieldRef}
                                  onBlur={handleTextFieldBlur}
                                  label={<FormattedLabel id="employeeId" />}
                                  variant="outlined"
                                />
                              )}
                            />
                            <FormHelperText>
                              {errors?.employeeId
                                ? errors.employeeId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                          {/* <TextField
                              sx={{
                                width: "90%",
                              }}
                              id="outlined-basic"
                              size="small"
                              label={<FormattedLabel id="employeeId" />}
                              variant="outlined"
                              {...register("employeeId")}
                              error={!!errors.employeeId}
                              helperText={
                                errors?.employeeId
                                  ? errors.employeeId.message
                                  : null
                              }
                            /> */}
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
                            id="outlined-basic"
                            size="small"
                            label={<FormattedLabel id="employeeName" />}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: watch("employeeName") ? true : false,
                            }}
                            {...register("employeeName")}
                            error={!!errors.employeeName}
                            helperText={
                              errors?.employeeName
                                ? errors.employeeName.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                    )}

                    <Grid container sx={{ padding: "10px" }}>
                      {(bookingFor === "Booking For Other Than PCMC" ||
                        "Booking For Other Organization") && (
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
                            id="outlined-basic"
                            size="small"
                            label={<FormattedLabel id="organizationName" />}
                            variant="outlined"
                            {...register("organizationName")}
                            multiline
                            error={!!errors.organizationName}
                            helperText={
                              errors?.organizationName
                                ? errors.organizationName.message
                                : null
                            }
                          />
                        </Grid>
                      )}

                      {bookingFor === "Booking For PCMC Employee" && (
                        <>
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
                              error={errors.departmentName}
                              variant="outlined"
                              size="small"
                              sx={{ width: "90%" }}
                            >
                              <InputLabel
                                id="demo-simple-select-outlined-label"
                                shrink={
                                  watch("employeeDepartment") ? true : false
                                }
                              >
                                <FormattedLabel id="departmentName" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="departmentName" />
                                    }
                                  >
                                    {departments?.map((department, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={department.id}
                                        >
                                          {department.department}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="employeeDepartment"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.departmentName
                                  ? errors.departmentName.message
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
                              error={errors.employeeDesignation}
                              variant="outlined"
                              size="small"
                              sx={{ width: "90%" }}
                            >
                              <InputLabel
                                id="demo-simple-select-outlined-label"
                                shrink={
                                  watch("employeeDesignation") ? true : false
                                }
                              >
                                Designation
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Designation"
                                  >
                                    {designations?.map((designation, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={designation.id}
                                        >
                                          {designation.designation}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="employeeDesignation"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.employeeDesignation
                                  ? errors.employeeDesignation.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                            {/* <TextField
                            sx={{ width: "90%" }}
                            id="outlined-basic"
                            size="small"
                            label={<FormattedLabel id="designation" />}
                            variant="outlined"
                            {...register("employeeDesignation")}
                            error={!!errors.employeeDesignation}
                            helperText={
                              errors?.employeeDesignation
                                ? errors.employeeDesignation.message
                                : null
                            }
                          /> */}
                          </Grid>
                        </>
                      )}
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
                          id="outlined-basic"
                          size="small"
                          // label="Event Title"
                          label={<FormattedLabel id="eventTitle" required />}
                          variant="outlined"
                          {...register("eventTitle")}
                          multiline
                          error={!!errors.eventTitle}
                          helperText={
                            errors?.eventTitle
                              ? errors.eventTitle.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={1.5}
                        sm={1.5}
                        md={1.5}
                        lg={1.5}
                        xl={1.5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl
                          error={errors.title}
                          variant="outlined"
                          size="small"
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="title" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="title" />}
                              >
                                {["Mr", "Mrs", "Ms", "Miss"].map(
                                  (city, index) => {
                                    return (
                                      <MenuItem key={index} value={city}>
                                        {city}
                                      </MenuItem>
                                    );
                                  }
                                )}
                              </Select>
                            )}
                            name="title"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.title ? errors.title.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={3.5}
                        sm={3.5}
                        md={3.5}
                        lg={3.5}
                        xl={3.5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel
                              id="organizationOwnerFirstName"
                              required
                            />
                          }
                          variant="outlined"
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
                        xs={3.5}
                        sm={3.5}
                        md={3.5}
                        lg={3.5}
                        xl={3.5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="organizationOwnerMiddleName" />
                          }
                          variant="outlined"
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
                        xs={3.5}
                        sm={3.5}
                        md={3.5}
                        lg={3.5}
                        xl={3.5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel
                              id="organizationOwnerLastName"
                              required
                            />
                          }
                          variant="outlined"
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
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="flat_buildingNo" required />
                          }
                          sx={{
                            width: "90%",
                          }}
                          variant="outlined"
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
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="buildingName" required />}
                          variant="outlined"
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
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="roadName" />}
                          variant="outlined"
                          {...register("roadName")}
                          error={!!errors.roadName}
                          helperText={
                            errors?.roadName ? errors.roadName.message : null
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
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="landmark" />}
                          variant="outlined"
                          {...register("landmark")}
                          error={!!errors.landmark}
                          helperText={
                            errors?.landmark ? errors.landmark.message : null
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
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="pinCode" required />}
                          variant="outlined"
                          sx={{
                            width: "90%",
                          }}
                          inputProps={{
                            maxLength: 6,
                          }}
                          {...register("pinCode")}
                          error={!!errors.pinCode}
                          helperText={
                            errors?.pinCode ? errors.pinCode.message : null
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
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="aadhaarNo" required />}
                          sx={{
                            width: "90%",
                          }}
                          variant="outlined"
                          inputProps={{ maxLength: 12 }}
                          {...register("aadhaarNo")}
                          error={!!errors.aadhaarNo}
                          helperText={
                            errors?.aadhaarNo ? errors.aadhaarNo.message : null
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
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="mobile" required />}
                          // type="number"
                          sx={{
                            width: "90%",
                            // "& input[type=number]": {
                            //   "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                            //     {
                            //       "-webkit-appearance": "none", // Remove Chrome and Safari arrow buttons
                            //       margin: 0,
                            //     },
                            // },
                          }}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: watch("mobile") ? true : false,
                          }}
                          {...register("mobile")}
                          // className={styles.numInput}
                          inputProps={{ maxLength: 10 }}
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
                          id="outlined-basic"
                          size="small"
                          sx={{
                            width: "90%",
                          }}
                          label={<FormattedLabel id="landline" required />}
                          variant="outlined"
                          {...register("landlineNo")}
                          error={!!errors.landlineNo}
                          helperText={
                            errors?.landlineNo
                              ? errors.landlineNo.message
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
                        <Controller
                          name="gstNo"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              id="outlined-basic"
                              size="small"
                              sx={{
                                width: "90%",
                              }}
                              placeholder="27DKKPS2852A1ZM"
                              label="GST Number"
                              variant="outlined"
                              inputProps={{ maxLength: 15 }}
                              error={getValues("gstNo") && !!errors.gstNo}
                              helperText={
                                getValues("gstNo") && errors?.gstNo
                                  ? errors.gstNo.message
                                  : null
                              }
                              {...field}
                            />
                          )}
                        />
                        {/* <TextField
                            id="outlined-basic"
                            size="small"
                            sx={{
                              width: "90%",
                            }}
                            placeholder="27DKKPS2852A1ZM"
                            label={<FormattedLabel id="gstNo" />}
                            variant="outlined"
                            inputProps={{ maxLength: 15 }}
                            {...register("gstNo")}
                            error={!!errors.gstNo}
                            helperText={
                              errors?.gstNo
                                ? field.value
                                  ? errors.gstNo.message
                                  : null
                                : null
                            }
                            // helperText={
                            //   errors?.gstNo ? errors.gstNo.message : null
                            // }
                          /> */}
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
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="emailAddress" required />}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: watch("emailAddress") ? true : false,
                          }}
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
                        sm={8}
                        md={8}
                        lg={8}
                        xl={8}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "96%" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="eventDetails" required />}
                          variant="outlined"
                          {...register("eventDetails")}
                          error={!!errors.eventDetails}
                          multiline
                          helperText={
                            errors?.eventDetails
                              ? errors.eventDetails.message
                              : null
                          }
                        />
                      </Grid>
                      {/* <Grid
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
                            error={errors.checkAuditoriumKey}
                            variant="standard"
                          >
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
                              {errors?.messageDisplay
                                ? errors.messageDisplay.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid> */}
                    </Grid>

                    <Grid container>
                      {finalData?.map((val) => {
                        return (
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
                              <FormControl
                                sx={{ width: "90%" }}
                                error={errors.eventDateFrom}
                              >
                                <Controller
                                  name="eventDateFrom"
                                  control={control}
                                  defaultValue={val.date}
                                  render={({ field }) => (
                                    <LocalizationProvider
                                      dateAdapter={AdapterMoment}
                                    >
                                      <DatePicker
                                        disablePast
                                        inputFormat="DD/MM/YYYY"
                                        disabled
                                        label={
                                          <span style={{ fontSize: 16 }}>
                                            <FormattedLabel id="eventDate" />
                                            {/* Event Date From */}
                                          </span>
                                        }
                                        value={val.date}
                                        onChange={(date) => {
                                          field.onChange(date);
                                        }}
                                        selected={field.value}
                                        center
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            size="small"
                                            fullWidth
                                            error={errors.eventDateFrom}
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  )}
                                />
                                <FormHelperText>
                                  {errors?.eventDateFrom
                                    ? errors.eventDateFrom.message
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
                                id="outlined-basic"
                                size="small"
                                label="Event Hours"
                                disabled
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                value={val.time}
                                variant="outlined"
                                {...register("EventHours")}
                                error={!!errors.EventHours}
                                helperText={
                                  errors?.EventHours
                                    ? errors.EventHours.message
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
                                id="outlined-basic"
                                size="small"
                                label={<FormattedLabel id="eventDayFrom" />}
                                disabled
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                value={moment(val.date).format("dddd")}
                                variant="outlined"
                                {...register("eventDayFrom")}
                                error={!!errors.eventDayFrom}
                                helperText={
                                  errors?.eventDayFrom
                                    ? errors.eventDayFrom.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      {/*   <Grid
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
                        </Grid> */}
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      {/* <Grid
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
                        </Grid> */}
                      {/* <Grid
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
                        </Grid> */}
                    </Grid>

                    {/* <Grid container sx={{ padding: "10px" }}>
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
                              router.push({
                                pathname: "/PublicAuditorium/transaction/auditoriumBooking/RentReceipt",
                              });
                            }}
                          >
                            Print
                          </Link>
                        </Grid>
                      </Grid> */}
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="applicantDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                          id="outlined-basic"
                          size="small"
                          disabled={
                            _loggedInUser != "cfcUser" && watch("applicantName")
                          }
                          label={<FormattedLabel id="applicantName" required />}
                          variant="outlined"
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel id="applicantMobileNo" required />
                          }
                          size="small"
                          sx={{
                            width: "90%",
                          }}
                          variant="outlined"
                          disabled={
                            _loggedInUser != "cfcUser" &&
                            watch("applicantMobileNo")
                          }
                          {...register("applicantMobileNo")}
                          error={!!errors.applicantMobileNo}
                          helperText={
                            errors?.applicantMobileNo
                              ? errors.applicantMobileNo.message
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel
                              id="applicantConfirmMobileNo"
                              required
                            />
                          }
                          size="small"
                          sx={{
                            width: "90%",
                          }}
                          disabled={
                            _loggedInUser != "cfcUser" &&
                            watch("applicantConfirmMobileNo")
                          }
                          variant="outlined"
                          {...register("applicantConfirmMobileNo")}
                          error={!!errors.applicantConfirmMobileNo}
                          helperText={
                            errors?.applicantConfirmMobileNo
                              ? errors.applicantConfirmMobileNo.message
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel id="applicantEmail" required />
                          }
                          variant="outlined"
                          size="small"
                          disabled={
                            _loggedInUser != "cfcUser" &&
                            watch("applicantEmail")
                          }
                          {...register("applicantEmail")}
                          error={!!errors.applicantEmail}
                          helperText={
                            errors?.applicantEmail
                              ? errors.applicantEmail.message
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel
                              id="applicantConfirmEmail"
                              required
                            />
                          }
                          variant="outlined"
                          disabled={
                            _loggedInUser != "cfcUser" &&
                            watch("applicantConfirmEmail")
                          }
                          size="small"
                          {...register("applicantConfirmEmail")}
                          error={!!errors.applicantConfirmEmail}
                          helperText={
                            errors?.applicantConfirmEmail
                              ? errors.applicantConfirmEmail.message
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel
                              id="relationWithOrganization"
                              required
                            />
                          }
                          variant="outlined"
                          size="small"
                          {...register("relationWithOrganization")}
                          error={!!errors.relationWithOrganization}
                          helperText={
                            errors?.relationWithOrganization
                              ? errors.relationWithOrganization.message
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel
                              id="applicantFlatHouseNo"
                              required
                            />
                          }
                          sx={{
                            width: "90%",
                          }}
                          size="small"
                          variant="outlined"
                          disabled={
                            _loggedInUser != "cfcUser" &&
                            watch("applicantFlatHouseNo")
                          }
                          {...register("applicantFlatHouseNo")}
                          error={!!errors.applicantFlatHouseNo}
                          helperText={
                            errors?.applicantFlatHouseNo
                              ? errors.applicantFlatHouseNo.message
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel
                              id="applicantFlatBuildingName"
                              required
                            />
                          }
                          variant="outlined"
                          size="small"
                          disabled={
                            _loggedInUser != "cfcUser" &&
                            watch("applicantFlatBuildingName")
                          }
                          {...register("applicantFlatBuildingName")}
                          error={!!errors.applicantFlatBuildingName}
                          helperText={
                            errors?.applicantFlatBuildingName
                              ? errors.applicantFlatBuildingName.message
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
                          id="outlined-basic"
                          label={<FormattedLabel id="applicantLandmark" />}
                          variant="outlined"
                          size="small"
                          disabled={
                            _loggedInUser != "cfcUser" &&
                            watch("applicantLandmark")
                          }
                          {...register("applicantLandmark")}
                          error={!!errors.applicantLandmark}
                          helperText={
                            errors?.applicantLandmark
                              ? errors.applicantLandmark.message
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
                          id="outlined-basic"
                          label={<FormattedLabel id="applicantArea" />}
                          variant="outlined"
                          size="small"
                          disabled={
                            _loggedInUser != "cfcUser" && watch("applicantArea")
                          }
                          {...register("applicantArea")}
                          error={!!errors.applicantArea}
                          helperText={
                            errors?.applicantArea
                              ? errors.applicantArea.message
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
                        <FormControl
                          error={errors.applicantCountry}
                          variant="outlined"
                          sx={{ width: "90%" }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="country" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                // value={field.value}
                                value="India"
                                disabled
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="country" />}
                              >
                                {[
                                  { id: 1, name: "India" },
                                  { id: 2, name: "Other" },
                                ].map((country, index) => {
                                  return (
                                    <MenuItem key={index} value={country.name}>
                                      {country.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            )}
                            name="applicantCountry"
                            control={control}
                            defaultValue="India"
                          />
                          <FormHelperText>
                            {errors?.applicantCountry
                              ? errors.applicantCountry.message
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
                          error={errors.applicantState}
                          variant="outlined"
                          sx={{ width: "90%" }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="applicantState" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={field.value}
                                disabled={
                                  _loggedInUser != "cfcUser" &&
                                  watch("applicantState")
                                }
                                // value="Maharashtra"
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="applicantState" />}
                              >
                                {["Maharashtra", "Other"].map(
                                  (state, index) => {
                                    return (
                                      <MenuItem key={index} value={state}>
                                        {state}
                                      </MenuItem>
                                    );
                                  }
                                )}
                              </Select>
                            )}
                            name="applicantState"
                            control={control}
                            defaultValue="Maharashtra"
                          />
                          <FormHelperText>
                            {errors?.applicantState
                              ? errors.applicantState.message
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
                          error={errors.applicantCity}
                          variant="outlined"
                          sx={{ width: "90%" }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="applicantCity" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={field.value}
                                disabled={
                                  _loggedInUser != "cfcUser" &&
                                  watch("applicantCity")
                                }
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="applicantCity" />}
                              >
                                {["Pimpri Chinchwad", "Pune", "Other"].map(
                                  (city, index) => {
                                    return (
                                      <MenuItem key={index} value={city}>
                                        {city}
                                      </MenuItem>
                                    );
                                  }
                                )}
                              </Select>
                            )}
                            name="applicantCity"
                            control={control}
                            defaultValue="Pimpri Chinchwad"
                          />
                          <FormHelperText>
                            {errors?.applicantCity
                              ? errors.applicantCity.message
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel id="applicantPinCode" required />
                          }
                          variant="outlined"
                          size="small"
                          disabled={
                            _loggedInUser != "cfcUser" &&
                            watch("applicantPinCode")
                          }
                          {...register("applicantPinCode")}
                          error={!!errors.applicantPinCode}
                          helperText={
                            errors?.applicantPinCode
                              ? errors.applicantPinCode.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="uploadDocuments" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <DataGrid
                        getRowId={(row) => row.srNo}
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        disableExport
                        hideFooter
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                        density="compact"
                        sx={{
                          backgroundColor: "white",
                          // paddingLeft: "2%",
                          // paddingRight: "2%",
                          boxShadow: 2,
                          border: 1,
                          borderColor: "primary.light",
                          "& .MuiDataGrid-cell:hover": {},
                          "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#E1FDFF",
                          },
                          "& .MuiDataGrid-columnHeadersInner": {
                            backgroundColor: "#87E9F7",
                          },
                        }}
                        rows={
                          watch(`attachmentss`) ? watch(`attachmentss`) : []
                        }
                        columns={columnsF}
                      />
                    </Box>
                    <Box sx={{}}>
                      <Typography sx={{ fontWeight: "400", fontSize: "12px" }}>
                        {language == "en"
                          ? "Note : Please only upload a PDF file"
                          : "नोंद : कृपया फक्त पीडीएफ फाइल अपलोड करा"}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      {" "}
                      <FormattedLabel id="ecsFormDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel
                              id="bankAccountHolderName"
                              required
                            />
                          }
                          variant="outlined"
                          size="small"
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
                        <FormControl
                          variant="outlined"
                          error={!!errors.bankNameId}
                          sx={{ width: "90%" }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="bankName" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={
                                  <FormattedLabel id="bankName" required />
                                }
                              >
                                {bank?.map((bank, index) => (
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
                        <FormControl
                          error={errors.typeOfBankAccount}
                          variant="outlined"
                          size="small"
                          sx={{ width: "90%" }}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typeOfBankAccount" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={
                                  <FormattedLabel id="typeOfBankAccount" />
                                }
                              >
                                {[
                                  { id: 1, type: "Current" },
                                  { id: 2, type: "Saving" },
                                ].map((auditorium, index) => {
                                  return (
                                    <MenuItem key={index} value={auditorium.id}>
                                      {auditorium.type}
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
                            {errors?.typeOfBankAccount
                              ? errors.typeOfBankAccount.message
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
                        <TextField
                          id="outlined-basic"
                          label={
                            <FormattedLabel id="bankAccountNumber" required />
                          }
                          variant="outlined"
                          size="small"
                          sx={{
                            width: "90%",
                          }}
                          type="password"
                          {...register("bankaAccountNo")}
                          error={!!errors.bankaAccountNo}
                          helperText={
                            errors?.bankaAccountNo
                              ? errors.bankaAccountNo.message
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
                          id="outlined-basic"
                          label={
                            <FormattedLabel
                              id="confirmBankAccountNo"
                              required
                            />
                          }
                          variant="outlined"
                          size="small"
                          sx={{
                            width: "90%",
                          }}
                          inputProps={{ maxLength: 15 }}
                          {...register("confirmBankAccountNo")}
                          onPaste={(e) => e.preventDefault()}
                          error={!!errors.confirmBankAccountNo}
                          helperText={
                            errors?.confirmBankAccountNo
                              ? errors.confirmBankAccountNo.message
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
                          id="outlined-basic"
                          label={<FormattedLabel id="ifscCode" required />}
                          variant="outlined"
                          size="small"
                          {...register("ifscCode")}
                          error={!!errors.ifscCode}
                          helperText={
                            errors?.ifscCode ? errors.ifscCode.message : null
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
                          id="outlined-basic"
                          label={<FormattedLabel id="micrCode" required />}
                          variant="outlined"
                          size="small"
                          sx={{
                            width: "90%",
                          }}
                          {...register("micrCode")}
                          error={!!errors.micrCode}
                          helperText={
                            errors?.micrCode ? errors.micrCode.message : null
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
                          id="outlined-basic"
                          label={<FormattedLabel id="bankAddress" />}
                          variant="outlined"
                          size="small"
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
                          id="outlined-basic"
                          label={<FormattedLabel id="remark" />}
                          {...register("remarks")}
                          variant="outlined"
                          size="small"
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </Grid>
                    </Grid>

                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {bookingFor == "Booking For PCMC Employee" ? (
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              type="button"
                              onClick={handleSubmit(onSaveAsDraft)}
                              endIcon={<SaveIcon />}
                            >
                              <FormattedLabel id="apply" />
                            </Button>
                          </Grid>
                        ) : (
                          <Grid container>
                            {watch("previousDeposit") ? (
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                                sx={{
                                  display: "flex",
                                  justifyContent: "end",
                                }}
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  type="button"
                                  onClick={handleSubmit(onSaveAsDraft)}
                                  endIcon={<SaveIcon />}
                                >
                                  Apply
                                </Button>
                              </Grid>
                            ) : (
                              <>
                                <Grid
                                  item
                                  xs={6}
                                  sm={6}
                                  md={6}
                                  lg={6}
                                  xl={6}
                                  style={{
                                    display: "flex",
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
                                    {/* {btnSaveText} */}
                                    <FormattedLabel id="payDepositeAndApply" />
                                  </Button>
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  sm={6}
                                  md={6}
                                  lg={6}
                                  xl={6}
                                  style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    alignItems: "center",
                                  }}
                                >
                                  <Button
                                    size="small"
                                    type="button"
                                    onClick={handleSubmit(onSaveAsDraft)}
                                    variant="contained"
                                    color="secondary"
                                    name="draft"
                                    endIcon={<SaveIcon />}
                                  >
                                    <FormattedLabel id="saveAsDraft" />
                                  </Button>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        )}
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
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
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
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
                  </AccordionDetails>
                </Accordion>
              </>
            </form>
          </FormProvider>
          {/* </Slide>
          )} */}
        </Paper>
      )}
    </div>
  );
};

export default AuditoriumBooking;
