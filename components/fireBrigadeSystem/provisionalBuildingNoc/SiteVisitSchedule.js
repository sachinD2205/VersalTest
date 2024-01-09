import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
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
import theme from "../../../theme";
import urls from "../../../URLS/urls";
import styles from "../../streetVendorManagementSystem/styles/siteVisitSchedule.module.css";

// Site Visit Schedule
const SiteVisitSchedule = ({ appID }) => {
  let applicationId = appID;
  useEffect(() => {
    console.log(" applicationId ", applicationId);
  }, [applicationId]);

  // const router = useRouter();

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

  // Appointment Modal
  const [appointmentModal, seteAppointmentModal] = useState(false);
  const appointmentModalOpen = () => seteAppointmentModal(true);
  const appointmentModalClose = () => seteAppointmentModal(false);

  // Appointment Book Modal
  const [appointmentBookModal, seteAppointmentBookModal] = useState(false);
  const appointmentBookModalOpen = () => seteAppointmentBookModal(true);
  const appointmentBookModalClose = () => seteAppointmentBookModal(false);

  // router
  const router = useRouter();
  const [haveData, setHaveData] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [disabled, setdisabled] = useState(false);
  const [btnValue, setButtonValue] = useState(false);
  const CustomizedCalendarPicker = styled(CalendarPicker)`
  const [btnSaveText1, setBtnSaveText1] = useState('Save1')
  
  // Button Input State

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

  // UseEffect
  useEffect(() => {
    setdisabled(haveData);
  }, [haveData]);

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
    // alert("button set fun ");

    if (getValues(`slotss.length`) >= 7) {
      setButtonValue(true);
    } else {
      appendUI(null, null, null, "");
      setButtonValue(false);
    }
  };

  // Final Data
  const onFinish = (data) => {
    // alert("onFinish");

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
    // if (btnSaveText === "Save") {
    //   axios.post(`${urls.HMSURL}/master/slot/save`, reqBody).then((r) => {
    //     if (r.status == 200) {
    //       swal("Slots!", "slot added successfully !", "success");
    //       router.push("/FireBrigadeSystem/dashboard");
    //       console.log("res", r);
    //     }
    //   });
    // }

    if (btnSaveText === "Save") {
      axios.post(`${urls.FbsURL}/master/slot/save`, reqBody).then((r) => {
        if (r.status == 200) {
          swal("Slots!", "slot added successfully !", "success");
          // router.push("/FireBrigadeSystem/dashboard");
          router.push(
            "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
          );

          console.log("res", r);
        }
      });
    }
  };

  // Get Slot
  const getSlot = (selectedDate) => {
    axios
      .get(`${urls.FbsURL}/master/slot/getByDate?slotDate=${selectedDate}`)
      .then((r) => {
        console.log("slot length", r.data?.slots?.length);
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
      });
  };

  // bookApptSubmit
  const bookApptSubmit = (data) => {
    let tokenNo = getValues("tokenNo");
    const finalBody = {
      ...data,
      tokenNo,
      applicationId,
      serviceId: 76,
    };

    // if (btnSaveText1 === 'Save') {
    axios.post(`${urls.FbsURL}/master/slot/bookNow`, finalBody).then((r) => {
      seteAppointmentBookModal(false);
      toast("site visit scheduled !", {
        type: "success",
      });
      // router.push("/FireBrigadeSystem/dashboard");
      router.push(
        "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
      );
    });
  };

  return (
    <>
      {/** Calender Picker */}
      <ThemeProvider theme={theme}>
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
          <strong>Site Visit Appointment Schedule</strong>
        </div>
        <div className={styles.appoitment} style={{ marginTop: "25px" }}>
          <Controller
            control={control}
            name='slotDate'
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
                  orientation='landscape'
                  openTo='day'
                  inputFormat='DD/MM/YYYY'
                  shouldDisableDate={isWeekend}
                  value={field.value}
                  onChange={(date) => {
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
                  variant='h6'
                  component='h2'
                  color='#f7f8fa'
                  style={{ marginLeft: "25px" }}
                >
                  Slot Schedule
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={() =>
                      router.push(
                        `/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny`
                      )
                    }
                  />
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
                    variant='contained'
                    size='small'
                    type='button'
                    startIcon={<AddIcon />}
                    onClick={() => {
                      buttonValueSetFun();
                    }}
                  >
                    Add more
                  </Button>
                )}
              </div>

              <Grid
                container
                sx={{ padding: "10px", backgroundColor: "#F9F9F9" }}
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
                              format='HH:mm:ss'
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
                                        size='small'
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
                                        size='small'
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
                            id='standard-basic'
                            label="Add No.Of Slot's "
                            variant='standard'
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
                        <Grid
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
                              variant='contained'
                              size='small'
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
                              Delete
                            </Button>
                          ) : (
                            <Button
                              variant='contained'
                              size='small'
                              // startIcon={<DeleteIcon />}
                              style={{
                                color: "white",
                                backgroundColor: "blue",
                                height: "30px",
                              }}
                              onClick={() => {
                                let i = getValues(`slotss.${index}.id`);
                                console.log("id yetoy ka", i);
                                setSelectedSlotId(i);
                                seteAppointmentBookModal(true);
                              }}
                            >
                              Book Now
                            </Button>
                          )}
                        </Grid>
                      </div>
                    </>
                  );
                })}
              </Grid>

              <div className={styles.btnappr}>
                <Button
                  type='submit'
                  variant='contained'
                  color='success'
                  endIcon={<CancelIcon />}
                  // type="primary"
                  onClick={() => {
                    // alert("Save");
                    setBtnSaveText("Save");
                  }}
                >
                  Save
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  endIcon={<CancelIcon />}
                  type='primary'
                  onClick={() => {
                    appointmentModalClose();
                  }}
                >
                  Exit
                </Button>
              </div>
            </div>
          </form>
        </Modal>

        {/** Appointment Book Modal*/}
        <Modal
          open={appointmentBookModal}
          onCancel={() => {
            appointmentBookModalClose();
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
                  variant='h6'
                  component='h2'
                  color='#f7f8fa'
                  style={{ marginLeft: "25px" }}
                >
                  booking button
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={() => {
                      appointmentBookModalClose();
                      router.push(
                        `/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny`
                      );
                    }}
                  />
                </IconButton>
              </div>

              <Grid
                container
                sx={{ padding: "10px", backgroundColor: "#F9F9F9" }}
              >
                <>
                  <div className={styles.row1}>
                    <div>
                      <TextField
                        sx={{ width: 230 }}
                        id='standard-basic'
                        label='Token No *'
                        variant='standard'
                        {...register("tokenNo")}
                        error={!!errors.tokenNo}
                        helperText={
                          errors?.tokenNo ? errors.tokenNo.message : null
                        }
                      />
                    </div>
                  </div>
                </>
              </Grid>

              <div className={styles.btnappr1}>
                <Button
                  // type="submit"
                  variant='contained'
                  color='success'
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
                  variant='contained'
                  color='error'
                  endIcon={<CancelIcon />}
                  onClick={() => {
                    appointmentBookModalClose();
                  }}
                >
                  Exit
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </ThemeProvider>
    </>
  );
};

export default SiteVisitSchedule;
