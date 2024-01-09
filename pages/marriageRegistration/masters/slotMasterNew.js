import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { ThemeProvider, styled } from "@mui/styles";
import { CalendarPicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import styles from "../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import theme from "../../../theme";

const SlotMaster = () => {
  const language = useSelector((state) => state?.labels.language);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [tokenDropDown, setTokenDropDown] = useState([]);
  const [timeSlotDropDown, setTimeSlotDropDown] = useState([]); // { id, timeSlotString }

  const CustomizedCalendarPicker = styled(CalendarPicker)`
  & .css-1n2mv2k {
    display: 'flex',
    justifyContent: 'spaceAround',
    backgroundColor: 'red',
  }
  & mui-style-mvmu1r{
    display: 'flex',
    justifyContent: 'spaceAround',
    backgroundColor: 'red',
  }
`;

  const isWeekend = useCallback((date) => {
    const day = date.day();
    return day === 0 || day === 6;
  }, []);

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { slotDate: "", zoneKey: "", tokenNo: "", timeSlotId: "" },
  });

  const getAvailableZone = useCallback(() => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZoneDropDown(
        res.data.zone.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        })),
      );
    });
  }, []);

  const getAvailableToken = useCallback(() => {
    // TODO: write the login to disable zone which are already booked
    let tempTokens = [];
    for (let i = 0; i < 20; i++) {
      tempTokens.push(i + 1);
    }
    setTokenDropDown(tempTokens);
  }, []);

  const getAvailableTimeSlot = useCallback(() => {
    // TODO: find a better way to update this state, and add logic to disable time slots
    const tempTimeSlot = [
      { id: 1, timeSlotString: "10:00 AM - 10:15 AM" },
      { id: 2, timeSlotString: "10:15 AM - 10:30 AM" },
      { id: 3, timeSlotString: "10:30 AM - 10:45 AM" },
      { id: 4, timeSlotString: "10:45 AM - 11:00 AM" },
      { id: 5, timeSlotString: "11:00 AM - 11:15 AM" },
      { id: 6, timeSlotString: "11:15 AM - 11:30 AM" },
      { id: 7, timeSlotString: "11:30 AM - 11:45 AM" },
      { id: 8, timeSlotString: "11:45 AM - 12:00 PM" },
      { id: 9, timeSlotString: "12:00 PM - 12:15 PM" },
      { id: 10, timeSlotString: "12:15 PM - 12:30 PM" },
      { id: 11, timeSlotString: "12:30 PM - 12:45 PM" },
      { id: 12, timeSlotString: "12:45 PM - 01:00 PM" },
      { id: 13, timeSlotString: "01:00 PM - 01:15 PM" },
      { id: 14, timeSlotString: "01:15 PM - 01:30 PM" },
      { id: 15, timeSlotString: "02:00 PM - 02:15 PM" },
      { id: 16, timeSlotString: "02:15 PM - 02:30 PM" },
      { id: 17, timeSlotString: "02:30 PM - 02:45 PM" },
      { id: 18, timeSlotString: "02:45 PM - 03:00 PM" },
      { id: 19, timeSlotString: "03:00 PM - 03:15 PM" },
      { id: 20, timeSlotString: "03:15 PM - 03:30 PM" },
    ];

    setTimeSlotDropDown(tempTimeSlot);
  }, []);

  useEffect(() => {
    getAvailableZone();
    getAvailableToken();
    getAvailableTimeSlot();
    console.log("MR: inside useEffect");
  }, [getAvailableTimeSlot, getAvailableToken, getAvailableZone]);

  return (
    <>
      <div>
        <ThemeProvider theme={theme}>
          <Box>
            <BreadcrumbComponent />
          </Box>
          <Paper
            sx={{
              marginLeft: 4,
              marginRight: 4,
              marginTop: 2,
              marginBottom: 1,
              padding: 5,
              border: 1,
            }}
          >
            <div>
              <div>
                <div
                  className={styles.detailsApot}
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h1
                    style={{
                      padding: "4px",
                    }}
                  >
                    {language == "en" ? "Slot Master" : "स्लॉट मास्टर"}
                  </h1>
                </div>
              </div>

              <div className={styles.appoitment} style={{ marginTop: "25px" }}>
                <Controller
                  control={control}
                  name="slotDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <CustomizedCalendarPicker
                        sx={{
                          border: "1px solid #ccc", // Add this border style
                          padding: "8px",
                        }}
                        orientation="landscape"
                        openTo="day"
                        inputFormat="DD/MM/YYYY"
                        shouldDisableDate={isWeekend}
                        minDate={new Date()}
                        value={field.value}
                        onChange={(date) => {
                          console.log("MR: date =", date);
                          //   setSelectedDate(moment(date).format("DD-MM-YY"));
                          //   getSlot(moment(date).format("YYYY-MM-DD"));
                          //   setmodalforBook(true),
                          //     field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  )}
                />
              </div>

              <div className={styles.appoitment} style={{ marginTop: "25px" }}>
                {/* Zone Dropdown Input field */}
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  p={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl variant="standard">
                    <InputLabel id="demo-simple-select-standard-label">
                      Zone
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 300 }}
                          {...field}
                          value={field.value}
                          {...register("zoneKey")}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {zoneDropDown &&
                            zoneDropDown.map((zone, index) => {
                              return (
                                <MenuItem key={index} value={zone.id}>
                                  {language == "en"
                                    ? zone?.zoneEn
                                    : zone?.zoneMr}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="zoneKey"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>

                {/* Token Dropdown Input field */}
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  p={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl variant="standard">
                    <InputLabel id="demo-simple-select-standard-label">
                      Token
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 300 }}
                          {...field}
                          value={field.value}
                          {...register("tokenNo")}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {tokenDropDown &&
                            tokenDropDown.map((token, index) => {
                              return (
                                <MenuItem key={index} value={token}>
                                  {token}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="tokenNo"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>

                {/* Time Slot Dropdown Input field */}
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  p={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl variant="standard">
                    <InputLabel id="demo-simple-select-standard-label">
                      Time Slot
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 300 }}
                          {...field}
                          value={field.value}
                          {...register("timeSlotId")}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {timeSlotDropDown &&
                            timeSlotDropDown.map((timeSlot, index) => {
                              return (
                                <MenuItem key={index} value={timeSlot.id}>
                                  {timeSlot.timeSlotString}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="timeSlotId"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>
              </div>
            </div>
          </Paper>
        </ThemeProvider>
      </div>
    </>
  );
};

export default SlotMaster;
