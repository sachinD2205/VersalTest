import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { ThemeProvider, styled } from "@mui/material/styles";
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
import swal from "sweetalert";
import urls from "../../URLS/urls";
import styles from "../../components/streetVendorManagementSystem/styles/siteVisitSchedule.module.css";
import Loader from "../../containers/Layout/components/Loader";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import theme from "../../theme";
import { catchExceptionHandlingMethod } from "../../util/util";
import { useSelector } from "react-redux";

/** Author - Sahin Durge */
// Site Visit Schedule
const SiteVisitSchedule = (props) => {
  //catch
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
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels?.language);

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
  console.log("props.appID", props);
  let applicationId = props?.appID;
  let serviceId = props?.serviceId;
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
  const appendUI = (id, fromTime, toTime, noOfSlots, slotDate) => {
    console.log("id", id);
    console.log(`sdf ${getValues(`slotss.length`)}`);
    console.log("fromTime,toTime", fromTime, toTime);
    console.log("slot Date", slotDate);
    append({
      id: id,
      fromTime: fromTime,
      toTime: toTime,
      noOfSlots: noOfSlots,
      slotDate: slotDate,
    });
  };

  // Button
  const buttonValueSetFun = () => {
    if (getValues(`slotss.length`) >= 7) {
      setButtonValue(true);
    } else {
      appendUI(null, null, null, "", null);
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
        .post(`${urls.TPURL}/slot/save`, reqBody, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setLoadderState(false);
            swal("Slots!", "slot added successfully !", "success");
            router.push("/townPlanning/dashboard");
            console.log("res", r);
          } else {
            setLoadderState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // Get Slot
  const getSlot = (selectedDate, serviceId) => {
    setLoadderState(true);
    axios
      .get(
        `${urls.TPURL}/slot/getByDate?slotDate=${selectedDate}&${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        if (
          r?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setLoadderState(false);
          if (r?.data?.slots?.length != 0) {
            r?.data?.slots?.map((row) => {
              console.log("object23432", row);
              appendUI(
                row?.id,
                moment(row?.fromTime, "HH:mm:ss"),
                moment(row?.toTime, "HH:mm:ss") /* .format('hh:mm:ss A') */,
                row?.noOfSlots,
                row?.slotDate,
              );
            });
            setHaveData(true);
          } else {
            appendUI(null, null, null, "", null);
          }
        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        setLoadderState(false);
      });
    // .catch((errors) => {
    // });
    setLoadderState(false);
  };

  // let applicationId;
  // if (router?.query?.applicationId) {
  //   applicationId = router?.query?.applicationId;
  // } else if (router?.query?.id) {
  //   applicationId = router?.query?.id;
  // }
  // bookApptSubmit
  const bookApptSubmit = (data) => {
    setLoadderState(true);
    console.log("data 1212121", data);
    let tokenNo = getValues("tokenNo");

    let finalBody;
    let url = null;
    console.log("serviceId", serviceId);
    // issuance
    if (serviceId == "19") {
      finalBody = {
        ...data,
        tokenNo,
        applicationId: applicationId,
        appointmentType: "S",
        serviceId: 19,
        // slotDate:
      };
      url = `${urls.TPURL}/slot/bookNow`;
    }
    // renewal
    else if (serviceId == "25") {
      finalBody = {
        ...data,
        tokenNo,
        renewalOfHawkerLicense: applicationId,
        appointmentType: "S",
        // slotDate:
      };
      url = `${urls.TPURL}/slot/bookNowForRenewal`;
    }
    // cancellation
    else if (serviceId == "27") {
      finalBody = {
        ...data,
        tokenNo,
        cancellationOfHawkerLicense: applicationId,
        appointmentType: "S",
        // slotDate:
      };
      url = `${urls.HMSURL}/master/slot/bookNowForCancellation`;
    }
    // transfer
    else if (serviceId == "26") {
      finalBody = {
        ...data,
        tokenNo,
        applicationId: applicationId,
        appointmentType: "S",
        // slotDate:
      };
      url = `${urls.HMSURL}/master/slot/bookNow`;
    }

    // if (btnSaveText1 === 'Save') {
    axios
      .post(url, finalBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
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
          router.push(
            "/townPlanning/transactions/developmentPlanOpinion/scrutiny/AppointmentScheduledRecipt",
          );
        } else {
          setLoadderState(false);
        }
        seteAppointmentBookModal(false);
        setLoadderState(false);
      })
      .catch((error) => {
        callCatchMethod(error, language);
        setLoadderState(false);
      });
    // .catch((errors) => {
    // });
    setLoadderState(false);
  };

  useEffect(() => {
    console.log("props", props);
  }, [props]);

  useEffect(() => {
    console.log(" applicationId - serviceId", applicationId, serviceId);
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
          <Dialog
            fullWidth
            maxWidth={"lg"}
            open={appointmentModal}
            onClose={() => appointmentModalClose()}
          >
            <CssBaseline />

            <DialogTitle>
              <Grid container>
                <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                  {<FormattedLabel id="addSlotsOfSiteVisit" />}
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
                    onClick={() => router.push(`/townPlanning/dashboard`)}
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
              <form onSubmit={handleSubmit(onFinish)}>
                <Grid container style={{ marginTop: "2vh" }}>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    {!haveData && (
                      <Stack
                        direction="row"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          disabled={btnValue}
                          variant="contained"
                          size="medium"
                          type="button"
                          startIcon={<AddIcon />}
                          onClick={() => buttonValueSetFun()}
                        >
                          {<FormattedLabel id="addMore" />}
                        </Button>
                      </Stack>
                    )}
                  </Grid>
                </Grid>

                {fields &&
                  fields.map((slot, index) => {
                    return (
                      <Grid container key={slot.id}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          xl={2}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItem: "center",
                            marginBottom: "5px",
                          }}
                        >
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
                              {errors?.fromTime
                                ? errors.fromTime.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          xl={2}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItem: "center",
                            marginBottom: "5px",
                          }}
                        >
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
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
                        </Grid>

                        <Grid
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "5px",
                          }}
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          lg={2}
                          xl={1}
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
                                  siteVisitDate: getValues("slotDate"),
                                  tokenNo: getValues("tokenNo"),
                                };
                                console.log("BookNow", data);
                                bookApptSubmit(data);
                              }}
                            >
                              {<FormattedLabel id="bookNow" />}
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}
              </form>
            </DialogContent>
            <DialogTitle>
              <Grid container>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                      md: "row",
                      lg: "row",
                      xl: "row",
                    }}
                    spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                    justifyContent="center"
                    alignItems="center"
                    marginTop="5"
                  >
                    {!haveData && (
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
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<CancelIcon />}
                      type="primary"
                      onClick={() => {
                        appointmentModalClose();
                        router.push(`/townPlanning/dashboard`);
                      }}
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogTitle>
          </Dialog>
          ;
        </ThemeProvider>
      )}
    </>
  );
};

export default SiteVisitSchedule;
