// http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/slot
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
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { styled, ThemeProvider } from "@mui/material/styles";
import { CalendarPicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
// import swal from "sweetalert";
import sweetAlert from "sweetalert";

import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/slotNew.module.css";
import theme from "../../../../../theme";
import urls from "../../../../../URLS/urls";
const Index = () => {
  const {
    control,
    register,
    reset,
    getValues,
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

  // Append UI
  const appendUI = (id, fromTime, toTime, noOfSlots) => {
    console.log("id", id);
    console.log(`sdf ${getValues(`slotss.length`)}`);
    console.log("fromTime,toTime", fromTime, toTime);
    append({
      id: id,
      fromTime: fromTime,
      toTime: toTime,
      noOfSlots: noOfSlots,
    });
  };

  // Button Input State
  const [btnValue, setButtonValue] = useState(false);

  // Button
  const buttonValueSetFun = () => {
    if (getValues(`slotss.length`) >= 7) {
      setButtonValue(true);
    } else {
      appendUI(null, null, null, "");
      setButtonValue(false);
    }
  };
  const [slotsUpdate, setslotsUpdate] = useState();
  // Final Data
  const onFinish = (data) => {
    console.log("yetoy ka deta ki nhi ", data);
    let slots = [];

    let selectedDate = data.slotDate;
    // Array - Updated Data
    data.slotss.forEach((data, i) => {
      slots.push({
        i: i + 1,
        fromTime: moment(data.fromTime).format("HH:mm:ss"),
        toTime: moment(data.toTime).format("HH:mm:ss"),
        noOfSlots: data.noOfSlots,
        slotDate: selectedDate,
      });
    });

    const reqBody = { slots: [...slots] };
    console.log("reqBody", reqBody);
    if (btnSaveText === "Save") {
      console.log("reqBody", reqBody);
      axios.post(`${urls.MR}/master/slot/save`, reqBody).then((r) => {
        if (r.status == 200) {
          language == "en"
            ? sweetAlert({
                title: "Saved!",
                text: "Record Saved successfully!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "जतन केले!",
                text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                icon: "success",
                button: "ओके",
              });
          console.log("res", r);
        }
      });
    }
  };

  const getSlot = (selectedDate) => {
    axios
      .get(`${urls.MR}/master/slot/getByDate?slotDate=${selectedDate}`)
      .then((r) => {
        if (r.data.slots.length != 0) {
          r.data.slots.map((row) => {
            appendUI(
              row.id,
              moment(row.fromTime, "HH:mm:ss"),
              moment(row.toTime, "HH:mm:ss") /* .format('hh:mm:ss A') */,
              row.noOfSlots,
            );
          });
          setHaveData(true);
          if (r.data.slots.length < 7 && !router.query.role) {
            appendUI(null, null, null, "");
          } else {
            setSuffiecient(true);
          }
        } else {
          appendUI(null, null, null, "");
        }
      });
  };

  //Api ithe add kara slot cha

  // const bookApptSubmit = (data) => {
  //   console.log("slotId", data);

  //   axios
  //     .post(
  //       `${urls.MR}/master/appointmentScheduleReschedule/saveAppointmentScheduleReschedule`,
  //       data,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       },
  //     )
  //     .then((r) => {
  //       axios
  //         .get(
  //           `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${data.applicationId}`,
  //         )
  //         .then((resp) => {
  //           console.log("resssssss", data);
  //           console.log("ressss1", resp.data);
  //           router.push({
  //             pathname:
  //               "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
  //             query: {
  //               ...resp.data,
  //             },
  //           });
  //         })
  //         .catch((err) => {
  //           swal("Error!", "Somethings Wrong!", "error");
  //         });
  //       setmodalforBook(false);
  //       toast(
  //         language == "en"
  //           ? "Record Submited successfully !"
  //           : "रेकॉर्ड यशस्वीरित्या सबमिट केले गेले!",
  //         {
  //           type: "success",
  //         },
  //       );
  //     });
  // };

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

  // const getAvailableTimeSlot = useCallback(() => {
  //   axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
  //     setZoneDropDown(
  //       res.data.zone.map((j, i) => ({
  //         srNo: i + 1,
  //         id: j.id,
  //         zoneEn: j.zoneName,
  //         zoneMr: j.zoneNameMr,
  //       })),
  //     );
  //   });
  // }, []);

  useEffect(() => {
    getAvailableZone();
    getAvailableToken();
    getAvailableTimeSlot();
    console.log("MR: inside useEffect");
  }, [getAvailableTimeSlot, getAvailableToken, getAvailableZone]);

  return (
    <>
      <div className={styles.model}>
        {/* Slot View/Add */}
        <Modal
          open={modalforAppoitment}
          onCancel={() => {
            setmodalforAppoitment(false);
          }}
        >
          <form onSubmit={handleSubmit(onFinish)}>
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

              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginRight: "20px",
                }}
              >
                {!suffiecient && (
                  <Button
                    disabled={btnValue}
                    variant="contained"
                    size="small"
                    type="button"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      buttonValueSetFun();
                    }}
                  >
                    Add more
                  </Button>
                )}
              </div> */}

              <div
                container
                style={{ padding: "10px", backgroundColor: "#F9F9F9" }}
              >
                {/* {fields.map((slot, index) => { */}
                {/* return ( */}
                <>
                  <div className={styles.row1}>
                    {/* <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.fromTime}
                      >
                        <Controller
                          format="HH:mm:ss"
                          control={control}
                          name={`slotss.${index}.fromTime`}
                          defaultValue={null}
                          key={slot.id}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <TimePicker
                                disabled={disabled}
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromTime" />,
                                  </span>
                                }
                                value={field.value}
                                onChange={(time) => {
                                  moment(
                                    field.onChange(time),
                                    "HH:mm:ss a",
                                  ).format("HH:mm:ss a");
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromTime ? errors.fromTime.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div style={{ marginLeft: "50px" }}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.toTime}
                      >
                        <Controller
                          control={control}
                          name={`slotss.${index}.toTime`}
                          defaultValue={null}
                          key={slot.id}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <TimePicker
                                disabled={disabled}
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="toTime" />,
                                  </span>
                                }
                                value={field.value}
                                onChange={(time) => {
                                  moment(
                                    field.onChange(time),
                                    "HH:mm:ss a",
                                  ).format("HH:mm:ss a");
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toTime ? errors.toTime.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div style={{ marginLeft: "50px" }}>
                      <TextField
                        disabled={disabled}
                        defaultValue={null}
                        key={slot.id}
                        id="standard-basic"
                        label={
                          language === "en"
                            ? "Add No. Of Slot's"
                            : "स्लॉटची संख्या जोडा"
                        }
                        variant="standard"
                        {...register(`slotss.${index}.noOfSlots`)}
                        // error={!!errors.noOfSlots}
                        // helperText={
                        //   errors?.noOfSlots
                        //     ? errors.noOfSlots.message
                        //     : null
                        // }
                      />
                      <TextField
                        hidden
                        sx={{ opacity: "0%" }}
                        key={slot.id}
                        {...register(`slotss.${index}.id`)}
                      />
                    </div>
                    <div
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "50px",
                      }}
                    >
                      {!router.query.role ? (
                        <Button
                          variant="contained"
                          size="small"
                          // startIcon={<DeleteIcon />}
                          style={{
                            color: "white",
                            backgroundColor: "red",
                            height: "30px",
                          }}
                          onClick={() => {
                            // remove({
                            //   applicationName: "",
                            //   roleName: "",
                            // });
                            remove(index);
                          }}
                        >
                          <FormattedLabel id="delete" />
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          // startIcon={<DeleteIcon />}
                          style={{
                            color: "white",
                            backgroundColor: "blue",
                            height: "30px",
                          }}
                          onClick={() => {
                            let i = getValues(`slotss.${index}.id`);
                            // const tokenNo = getValues('tokenNo')
                            setSelectedSlotId(i);
                            let data = {
                              slotId: i,
                              applicationId: router?.query?.appId,
                              // tokenNo: getValues("tokenNo"),
                            };
                            bookApptSubmit(data);
                            console.log("id yetoy ka", i);
                            // setmodalforBook(true),
                          }}
                        >
                          <FormattedLabel id="bookNow" />
                        </Button>
                      )}
                    </div> */}

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
                </>
                {/* ); */}
                {/* })} */}
              </div>

              <div className={styles.btnappr}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<CancelIcon />}
                  // type="primary"
                  onClick={() => {
                    setBtnSaveText("Save");
                    router.push(
                      `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slotNew`,
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
          </form>
        </Modal>

        {/* booking */}
        {/* <Modal
          open={modalforBook}
          onCancel={() => {
            setmodalforBook(false);
          }}
        >
          <form onSubmit={handleSubmit(onFinish)}>
            <div className={styles.box1}>
              <div
                className={styles.titlemodelT1}
                style={{ marginLeft: "25px" }}
              >
                <Typography
                  className={styles.titleOne1}
                  variant="h6"
                  component="h2"
                  color="#f7f8fa"
                  style={{ marginLeft: "25px" }}
                >
                  booking button
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={
                      (data) => setmodalforBook(false)
                      // bookApptSubmit(data)
                      // router.push(
                      //   `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slot`
                      // )
                    }
                  />
                </IconButton>
              </div>

              <div
                container
                style={{ padding: "10px", backgroundColor: "#F9F9F9" }}
              >
                <>
                  <div className={styles.row1}>
                    <div>
                      <TextField
                        sx={{ width: 230 }}
                        id="standard-basic"
                        label="Token No *"
                        variant="standard"
                        {...register("tokenNo")}
                        error={!!errors.tokenNo}
                        helperText={
                          errors?.tokenNo ? errors.tokenNo.message : null
                        }
                      />
                    </div>
                  </div>
                </>
              </div>

              <div className={styles.btnappr1}>
                <Button
                  // type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<CancelIcon />}
                  onClick={() => {
                    let data = {
                      slotId: selectedSlotId,
                      applicationId: router?.query?.appId,
                      tokenNo: getValues("tokenNo"),
                    };
                    bookApptSubmit(data);
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<CancelIcon />}

                  // onClick={() =>
                  //   router.push(
                  //     `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slot`,
                  //   )
                  // }
                >
                  Exit
                </Button>
              </div>
            </div>
          </form>
        </Modal> */}
      </div>

      {/* <BasicLayout> */}
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
                        getSlot(moment(date).format("YYYY-MM-DD"));
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
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;
