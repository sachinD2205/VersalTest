import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, TextField } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../containers/schema/common/CalendarSchedulingAndHoliday";
import URLs from "../../../URLS/urls";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

function SimpleDialog(props) {
  const { onClose, setSelectedValue, open } = props;
  const [_selectedValue, _setSelectedValue] = useState();

  const handleClose = () => {
    onClose();
  };

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
              _setSelectedValue(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              setSelectedValue(_selectedValue);
              onClose();
            }}
          >
            Ok
          </Button>
        </List>
      </Box>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

const localizer = momentLocalizer(moment);

const CalenderSchedulingAndHoliday = (props) => {
  const events = [
    {
      id: 0,
      title: "Board meeting",
      start: new Date(2018, 11, 29, 9, 0, 0),
      end: new Date(2018, 11, 29, 13, 0, 0),
      resourceId: 1,
    },
  ];

  const [myEvents, setEvents] = useState(events);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getCalendarAndHolidays();
  }, []);

  const getCalendarAndHolidays = () => {
    axios
      // .get(`http://localhost:8090/cfc/api/master/calendarAndHolidays/getAll`)
      .get(`${URLs.CFCURL}/master/calendarAndHolidays/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("data: ", res);
        let result = res.data.calendarAndHolidays;
        let _res = result.map((val, i) => {
          // {
          //   id: 0,
          //   title: "Board meeting",
          //   start: new Date(2018, 11, 29, 9, 0, 0),
          //   end: new Date(2018, 11, 29, 13, 0, 0),
          //   resourceId: 1,
          //  }
          return {
            activeFlag: val.activeFlag,
            srNo: val.id,
            calenderPrefix: val.calenderPrefix,
            title: val.event,
            id: val.id,
            start: val.holidayDate,
            end: val.holidayDate,
            month: val.month,
            nameOfYear: val.nameOfYear,
            remark: val.remark,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        console.log("_res ", _res);
        setEvents(_res);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const addEvent = (start, title) => {
    console.log("start,title", start, title);

    const bodyForAPI = {
      // ...formData,
      nameOfYear: Number(moment(start).format("YYYY")),
      month: Number(moment(start).format("MM")),
      holidayDate: start,
      event: title,
    };

    console.log("data ", bodyForAPI);

    axios
      .post(
        // `http://localhost:8090/cfc/api/master/calendarAndHolidays/save`,
        `${URLs.CFCURL}/master/calendarAndHolidays/save`,
        bodyForAPI,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("response1", response);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    console.log("56", value);
    setOpen(false);
  };

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      console.log("start", start);
      // handleClickOpen();
      // if (selectedValue) {
      //   setEvents((prev) => [...prev, { start, end, title }]);
      // }
      const title = window.prompt("Event Name");
      if (title) {
        setEvents((prev) => [...prev, { start, end, title }]);
        addEvent(end, title);
      }
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

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

  const onView = useCallback((newView) => console.log("newView", newView));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center",
        padding: "10px",
      }}
    >
      <div>
        <SimpleDialog
          setSelectedValue={setSelectedValue}
          open={open}
          onClose={handleClose}
        />
      </div>
      {console.log("myEvents", myEvents)}

      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        selectable={true}
        popup={true}
        style={{
          height: "80vh",
          width: "98vw",
        }}
        step={30}
        defaultView="month"
        selectRange={true}
        // views={["month", "week", "day"]}
        views={["month"]}
        defaultDate={new Date()}
        scrollToTime={new Date(1970, 1, 1, 6)}
        onSelectEvent={handleSelectEvent}
        onView={onView}
        dayPropGetter={_dayPropGetter}
        eventPropGetter={(event) => {
          const backgroundColor = event.allday ? "yellow" : "blue";
          return { style: { backgroundColor } };
        }}
      />
    </div>
  );
};

export default CalenderSchedulingAndHoliday;
