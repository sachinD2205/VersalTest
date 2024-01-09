import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import {
  CalendarPicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import swal from "sweetalert";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
// import styles from "../styles/siteVisitSchedule.module.css";
import styles from "../../../../components/skySign/styles/siteVisitSchedule.module.css";
import Failed from "../../../../components/skySign/commonAlert";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

/** Author - Sahin Durge */
// Site Visit Schedule
const SiteVisitSchedule = ({ appID }) => {
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
  // useField Array
  const { fields, append, remove } = useFieldArray({ name: "slotss", control });
  let applicationId = appID;
  const router = useRouter();
  const [haveData, setHaveData] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [disabled, setdisabled] = useState(false);
  const [btnValue, setButtonValue] = useState(false);
  const [btnSaveText1, setBtnSaveText1] = useState("Save1");
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [appointmentBookModal, seteAppointmentBookModal] = useState(false);
  const [loadderState, setLoadderState] = useState(false);
  const language = useSelector((state) => state?.labels?.language);

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

  // Appointment Modal
  const appointmentModalOpen = () => setAppointmentModal(true);
  const appointmentModalClose = () => setAppointmentModal(false);

  // Appointment Book Modal
  const appointmentBookModalOpen = () => seteAppointmentBookModal(true);
  const appointmentBookModalClose = () => seteAppointmentBookModal(false);

  // Button Input State
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

  // Weekend Defined
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

  // Button
  const buttonValueSetFun = () => {
    if (getValues(`slotss.length`) >= 7) {
      setButtonValue(true);
    } else {
      appendUI(null, null, null, "");
      setButtonValue(false);
    }
  };

  // Final Data
  const onFinish = (data) => {
    setLoadderState(true);
    console.log("yetoy ka deta ki nhi ", data);
    let slots = [];
    let selectedDate = data.slotDate;

    // Array - Updated Data
    data.slotss.forEach((data) => {
      slots.push({
        fromTime: moment(data.fromTime).format("HH:mm:ss"),
        toTime: moment(data.toTime).format("HH:mm:ss"),
        noOfSlots: data.noOfSlots,
        slotDate: selectedDate,
      });
    });

    const reqBody = { slots: [...slots] };

    // Save
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.SSLM}/master/slot/save`, reqBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setLoadderState(false);
            sweetAlert({
              title: language === "en" ? "Slots !! " : "स्लॉट !!",
              text:
                language === "en"
                  ? "Slot Added Successfully !"
                  : "स्लॉट यशस्वीरित्या जोडले!",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                router.push("/skySignLicense/dashboards");
              }
            });
            // swal("Slots!", "slot added successfully !", "success");
            // router.push("/skySignLicense/dashboards");
            console.log("res", r);
          } else {
            setLoadderState(false);
            <Failed />;
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      // .catch((errors) => {
      //   setLoadderState(false);
      //   <Failed />;
      // });
    }
  };

  // Get Slot
  const getSlot = (selectedDate) => {
    axios
      .get(`${urls.SSLM}/master/slot/getByDate?slotDate=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (
          r?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setLoadderState(false);
          if (r.data?.slots?.length != 0) {
            r.data.slots.map((row) => {
              appendUI(
                row.id,
                moment(row.fromTime, "HH:mm:ss"),
                moment(row.toTime, "HH:mm:ss") /* .format('hh:mm:ss A') */,
                row.noOfSlots
              );
            });
            setHaveData(true);
          } else {
            appendUI(null, null, null, "");
          }
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // .catch((errors) => {
    //   setLoadderState(false);
    //   <Failed />;
    // });
  };

  // bookApptSubmit
  const bookApptSubmit = (data) => {
    let tokenNo = getValues("tokenNo");
    const finalBody = {
      ...data,
      // tokenNo,
      // applicationId,
    };
    console.log("finalbody", data);
    // if (btnSaveText1 === 'Save') {

    if (router?.query?.serviceId == 9) {
      axios
        .post(`${urls.SSLM}/master/slot/bookNowStoreLicense`, finalBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (
            res?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setLoadderState(false);
            res?.data?.id
              ? // ? sweetAlert("Slot !", "slot booked successfully", "success")
                sweetAlert({
                  title: language === "en" ? "Slots !! " : "स्लॉट !!",
                  text:
                    language === "en"
                      ? "Slot Booked Successfully !"
                      : "स्लॉट यशस्वीरित्या बुक केला!",
                  icon: "success",
                  button: language === "en" ? "Ok" : "ठीक आहे",
                })
              : // : sweetAlert("Slot !", "slot booked successfully", "success");
                sweetAlert({
                  title: language === "en" ? "Slots !! " : "स्लॉट !!",
                  text:
                    language === "en"
                      ? "Slot Booked Successfully !"
                      : "स्लॉट यशस्वीरित्या बुक केला!",
                  icon: "success",
                  button: language === "en" ? "Ok" : "ठीक आहे",
                });
            router.push("/skySignLicense/dashboards");
          } else {
            setLoadderState(false);
            <Failed />;
          }
          seteAppointmentBookModal(false);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      // .catch((errors) => {
      //   <Failed />;
      // });
    } else if (router?.query?.serviceId == 8) {
      axios
        .post(`${urls.SSLM}/master/slot/bookNowIndustryLicense`, finalBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (
            res?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setLoadderState(false);
            res?.data?.id
              ? sweetAlert("Slot !", "slot booked successfully", "success")
              : sweetAlert("Slot !", "slot booked successfully", "success");
            router.push("/skySignLicense/dashboards");
          } else {
            setLoadderState(false);
            <Failed />;
          }
          seteAppointmentBookModal(false);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      // .catch((errors) => {
      //   <Failed />;
      // });
    } else {
      axios
        .post(`${urls.SSLM}/master/slot/bookNowBusinessLicense`, finalBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (
            res?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setLoadderState(false);
            res?.data?.id
              ? sweetAlert("Slot !", "slot booked successfully", "success")
              : sweetAlert("Slot !", "slot booked successfully", "success");
            router.push("/skySignLicense/dashboards");
          } else {
            setLoadderState(false);
            <Failed />;
          }
          seteAppointmentBookModal(false);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      // .catch((errors) => {
      //   <Failed />;
      // });
    }
    // }
  };

  useEffect(() => {
    console.log(" applicationId ", applicationId);
  }, [applicationId]);

  // UseEffect
  useEffect(() => {
    setdisabled(haveData);
  }, [haveData]);

  useEffect(() => {}, [loadderState]);

  // View
  return (
    <>
      {/** Calender Picker */}
      {loadderState ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 10,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "65px",
              borderRadius: 100,
            }}
          >
            <strong>
              {<FormattedLabel id="siteVisitAppointmentSchedule" />}
            </strong>
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
                      ".mui-style-1n2mv2k": {
                        display: "flex",
                        justifyContent: "space-evenly",
                      },
                      ".css-mvmu1r": {
                        display: "flex",
                        justifyContent: "space-evenly",
                      },
                      ".css-1dozdou": {
                        backgroundColor: "red",
                        marginLeft: "5px",
                      },
                      ".mui-style-mvmu1r": {
                        display: "flex",
                        justifyContent: "space-evenly",
                      },
                    }}
                    orientation="landscape"
                    openTo="day"
                    inputFormat="DD/MM/YYYY"
                    shouldDisableDate={isWeekend}
                    value={field.value}
                    onChange={(date) => {
                      setLoadderState(true);
                      getSlot(moment(date).format("YYYY-MM-DD"));
                      field.onChange(moment(date).format("YYYY-MM-DD")),
                        appointmentModalOpen();
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )}
            />
          </div>

          {/** Appointment Modal */}
          <Modal
            open={appointmentModal}
            onCancel={() => {
              appointmentModalClose();
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
                    {<FormattedLabel id="addSlotsOfSiteVisit" />}
                  </Typography>
                  <IconButton
                    onClick={() => router.push(`/skySignLicense/dashboards`)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginRight: "20px",
                  }}
                >
                  {!haveData && (
                    <Button
                      disabled={btnValue}
                      variant="contained"
                      size="small"
                      type="button"
                      startIcon={<AddIcon />}
                      onClick={() => buttonValueSetFun()}
                    >
                      {<FormattedLabel id="addMore" />}
                    </Button>
                  )}
                </div>

                <div
                  container
                  style={{
                    overflowY: "auto",
                    padding: "10px",
                    backgroundColor: "#F9F9F9",
                  }}
                >
                  {fields.map((slot, index) => {
                    return (
                      <>
                        <div className={styles.row1}>
                          <div>
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors.fromTime}
                            >
                              <Controller
                                format="HH:mm:ss"
                                control={control}
                                name={`slotss.${index}.fromTime`}
                                defaultValue={null}
                                key={slot.id}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <TimePicker
                                      disabled={disabled}
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          From Time
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(time) => {
                                        moment(
                                          field.onChange(time),
                                          "HH:mm:ss a"
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
                                {errors?.fromTime
                                  ? errors.fromTime.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>

                          <div style={{ marginLeft: "50px" }}>
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors.toTime}
                            >
                              <Controller
                                control={control}
                                name={`slotss.${index}.toTime`}
                                defaultValue={null}
                                key={slot.id}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <TimePicker
                                      disabled={disabled}
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          To Time
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(time) => {
                                        moment(
                                          field.onChange(time),
                                          "HH:mm:ss a"
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
                              label="Add No.Of Slot's "
                              variant="standard"
                              {...register(`slotss.${index}.noOfSlots`)}
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
                            {!haveData ? (
                              <Button
                                variant="contained"
                                size="small"
                                style={{
                                  color: "white",
                                  backgroundColor: "red",
                                  height: "30px",
                                }}
                                onClick={() => {
                                  remove(index);
                                }}
                              >
                                {<FormattedLabel id="delete" />}
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
                                  setLoadderState(true);
                                  let data = {
                                    slotId: getValues(`slotss.${index}.id`),
                                    applicantId: Number(router?.query?.appId),
                                    tokenNo: getValues("tokenNo"),
                                    fromTime: moment(
                                      getValues(`slotss.${index}.fromTime`),
                                      "HH:mm:ss a"
                                    ).format("HH:mm:ss"),
                                    toTime: moment(
                                      getValues(`slotss.${index}.toTime`),
                                      "HH:mm:ss a"
                                    ).format("HH:mm:ss"),
                                  };
                                  console.log("BookNow", data);
                                  bookApptSubmit(data);
                                }}
                              >
                                {<FormattedLabel id="bookNow" />}
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>

                <div className={styles.btnappr}>
                  {!haveData && (
                    <>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<CancelIcon />}
                        onClick={() => {
                          setBtnSaveText("Save");
                        }}
                      >
                        {<FormattedLabel id="submit" />}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<CancelIcon />}
                        type="primary"
                        onClick={() => {
                          appointmentModalClose();
                          router.push(`/skySignLicense/dashboards`);
                        }}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </Modal>
        </ThemeProvider>
      )}
    </>
  );
};

export default SiteVisitSchedule;
