// http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/slot
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider, styled } from "@mui/material/styles";
import { CalendarPicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
// import swal from "sweetalert";

import { toast } from "react-toastify";
import urls from "../../../../../URLS/urls";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/slotNew.module.css";
import theme from "../../../../../theme";
const Index = () => {
  const {
    control,
    register,
    reset,
    getValues,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { tokenNo: "" },
  });
  const router = useRouter();
  let language = useSelector((state) => state.labels.language);
  let user = useSelector((state) => state.user.user);
  const [haveData, setHaveData] = useState(false);
  const [suffiecient, setSuffiecient] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  // const [btnSaveText1, setBtnSaveText1] = useState('Save1')

  const [modalforAppoitment, setmodalforAppoitment] = useState(false);
  const [modalforBook, setmodalforBook] = useState(false);
  const { fields, append, remove } = useFieldArray({ name: "slotss", control });
  const [Id, setId] = useState();
  const [disabled, setdisabled] = useState(false);
  const CustomizedCalendarPicker = styled(CalendarPicker)`
    & .css-1n2mv2k 
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

  useEffect(() => {
    console.log("router mandi ahe kai", router.query);
  }, []);

  useEffect(() => {
    setdisabled(haveData);
  }, [haveData]);

  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  // Final Data
  const onFinish = (data) => {
    console.log("yetoy ka deta ki nhi", data);

    console.log("appid", router?.query?.appId);
    const reqBody = {
      id: +router?.query?.appId,
      role: router.query.role,
      appointmentScheduleReschDao: {
        appointmentDate: watch("slotDate"),
        zoneId: getValues("zoneKey"),
        tokenNo: getValues("tokenNo"),
        time: getValues("timeSlotId"),
      },
    };

    // "id":41130,
    // "role":"DOCUMENT_CHECKLIST",
    // "appointmentScheduleReschDao":{
    // "appointmentDate": "2023-11-02",
    // "zoneId": 1,
    // "tokenNo":6,
    // "time":"10:00 AM - 10:15 AM"
    // }

    console.log("reqBody", reqBody);
    axios
      .post(
        `${urls.MR}/transaction/applicant/saveApplicationApprove`,
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        axios
          .get(
            `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router?.query?.appId}`,
          )
          .then((resp) => {
            console.log("resssssss", data);
            console.log("ressss1", resp.data);
            router.push({
              pathname:
                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
              query: {
                ...resp.data,
              },
            });
          })
          .catch((err) => {
            swal("Error!", "Somethings Wrong!", "error");
          });
        setmodalforBook(false);
        toast(
          language == "en"
            ? "Record Submited successfully !"
            : "रेकॉर्ड यशस्वीरित्या सबमिट केले गेले!",
          {
            type: "success",
          },
        );
      });
  };

  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [tokenDropDown, setTokenDropDown] = useState([]);
  const [timeSlotDropDown, setTimeSlotDropDown] = useState([]);

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

  // const getAvailableTimeSlot = useCallback(() => {
  //   // TODO: find a better way to update this state, and add logic to disable time slots
  //   const tempTimeSlot = [
  //     { id: 1, timeSlotString: "10:00 AM - 10:15 AM" },
  //     { id: 2, timeSlotString: "10:15 AM - 10:30 AM" },
  //     { id: 3, timeSlotString: "10:30 AM - 10:45 AM" },
  //     { id: 4, timeSlotString: "10:45 AM - 11:00 AM" },
  //     { id: 5, timeSlotString: "11:00 AM - 11:15 AM" },
  //     { id: 6, timeSlotString: "11:15 AM - 11:30 AM" },
  //     { id: 7, timeSlotString: "11:30 AM - 11:45 AM" },
  //     { id: 8, timeSlotString: "11:45 AM - 12:00 PM" },
  //     { id: 9, timeSlotString: "12:00 PM - 12:15 PM" },
  //     { id: 10, timeSlotString: "12:15 PM - 12:30 PM" },
  //     { id: 11, timeSlotString: "12:30 PM - 12:45 PM" },
  //     { id: 12, timeSlotString: "12:45 PM - 01:00 PM" },
  //     { id: 13, timeSlotString: "01:00 PM - 01:15 PM" },
  //     { id: 14, timeSlotString: "01:15 PM - 01:30 PM" },
  //     { id: 15, timeSlotString: "02:00 PM - 02:15 PM" },
  //     { id: 16, timeSlotString: "02:15 PM - 02:30 PM" },
  //     { id: 17, timeSlotString: "02:30 PM - 02:45 PM" },
  //     { id: 18, timeSlotString: "02:45 PM - 03:00 PM" },
  //     { id: 19, timeSlotString: "03:00 PM - 03:15 PM" },
  //     { id: 20, timeSlotString: "03:15 PM - 03:30 PM" },
  //   ];

  //   setTimeSlotDropDown(tempTimeSlot);
  // }, []);

  const getAvailableTimeSlot = useCallback(() => {
    axios
      .get(
        `${urls.MR}/appointmentSche/appointmentDetails?appointmentDate=${watch(
          "slotDate",
        )}&zoneId=${watch("zoneKey")}&tokenNo=${watch("tokenNo")}`,
      )
      .then((res) => {
        let tempDataArray = [];
        res?.data?.availableSlots.map((data, index) => {
          const timeSlots = {
            id: index + 1,
            timeSlot: data,
          };
          tempDataArray.push(timeSlots);
        });
        console.log("availableSlots", tempDataArray);
        setTimeSlotDropDown(tempDataArray);
      });
  }, []);

  useEffect(() => {
    getAvailableZone();
    getAvailableToken();
    // getAvailableTimeSlot();
    console.log("MR: inside useEffect");
  }, [getAvailableTimeSlot, getAvailableToken, getAvailableZone]);

  useEffect(() => {
    if (
      watch("zoneKey") != null &&
      watch("zoneKey") != undefined &&
      watch("zoneKey") != "" &&
      watch("tokenNo") != null &&
      watch("tokenNo") != undefined &&
      watch("tokenNo") != ""
    ) {
      getAvailableTimeSlot();
    }
  }, [watch("zoneKey"), watch("tokenNo")]);

  return (
    <>
      <form onSubmit={handleSubmit(onFinish)}>
        <div className={styles.model}>
          {/* Slot View/Add */}
          <Modal
            open={modalforAppoitment}
            onCancel={() => {
              setmodalforAppoitment(false);
            }}
          >
            <div className={styles.box}>
              <div
                className={styles.titlemodelT}
                style={{ marginLeft: "25px" }}
              >
                <Typography
                  className={styles.titleOne}
                  variant="h6"
                  component="h2"
                  color="#f7f8fa"
                  style={{ marginLeft: "25px" }}
                >
                  <FormattedLabel id="AptBook" />
                </Typography>
                <IconButton>
                  <CloseIcon onClick={() => setmodalforAppoitment(false)} />
                </IconButton>
              </div>
              <div
                container
                style={{ padding: "10px", backgroundColor: "#F9F9F9" }}
              >
                <>
                  <div className={styles.row1}>
                    <div
                      className={styles.appoitment}
                      style={{ marginTop: "25px" }}
                    >
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
                                sx={{ width: 200 }}
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
                                      <MenuItem
                                        key={index}
                                        value={timeSlot?.timeSlot}
                                      >
                                        {timeSlot?.timeSlot}
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
                </>
              </div>

              <div className={styles.btnappr}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<CancelIcon />}
                  // type="primary"
                  onClick={() => {
                    setTimeout(() => {
                      onFinish();
                    }, 100);

                    // setBtnSaveText("Save");
                    router.push(
                      `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
                    );
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<CancelIcon />}
                  // type="primary"
                  onClick={() =>
                    router.push(
                      `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slotNew`,
                    )
                  }
                >
                  Exit
                </Button>
              </div>
            </div>
          </Modal>
        </div>

        <ThemeProvider theme={theme}>
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
            <div className={styles.small}>
              <div className={styles.detailsApot}>
                <div className={styles.h1TagApot}>
                  <h1
                    style={{
                      color: "white",
                      marginTop: "1px",
                    }}
                  >
                    <FormattedLabel id="AptBook" />
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
                          border: "2px solid #ccc", // Add this border style
                          padding: "8px",
                        }}
                        orientation="landscape"
                        openTo="day"
                        inputFormat="DD/MM/YYYY"
                        shouldDisableDate={isWeekend}
                        minDate={new Date()}
                        value={field.value}
                        onChange={(date) => {
                          // getSlot(moment(date).format("YYYY-MM-DD"));
                          setmodalforAppoitment(true),
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  )}
                />
              </div>
            </div>
          </Paper>
        </ThemeProvider>
      </form>
    </>
  );
};

export default Index;
