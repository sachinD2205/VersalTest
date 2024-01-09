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
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert";
import urls from "../../../../../URLS/urls";
import Loader from "../../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import styles from "../../../../../components/streetVendorManagementSystem/styles/siteVisitSchedule.module.css";

/** Author - Sahin Durge */
// Site Visit Schedule
const SiteVisitSchedule = (props) => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { tokenNo: "" },
  });
  // useField Array
  const { fields, append, remove } = useFieldArray({ name: "slotss", control });
  let applicationId = props?.appID;
  let serviceId = props?.serviceId;
  const router = useRouter();
  const language = useSelector((state) => state?.lables?.language);
  // Appointment Modal
  const [appointmentModal, setAppointmentModal] = useState(false);
  const appointmentModalOpen = () => setAppointmentModal(true);
  const appointmentModalClose = () => setAppointmentModal(false);

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

  // Weekend
  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  // AppendUI
  const appendUI = (id, fromTime, toTime, noOfSlots, slotDate) => {
    append({
      id: id,
      fromTime: fromTime,
      toTime: toTime,
      noOfSlots: noOfSlots,
      slotDate: slotDate,
    });
  };

  // FinalData
  const onFinish = (data) => console.log("formData", data);

  // GetSlot
  const getSlot = (selectedDate) => {
    setValue("loadderState", true);

    let url = `${urls.HMSURL}/master/slot/getByDate?slotDate=${selectedDate}`;

    axios
      .get(url)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          if (r?.data?.slots?.length != 0) {
            r?.data?.slots?.map((row) => {
              console.log("object23432", row);
              // appendUi
              appendUI(
                row?.id,
                moment(row?.fromTime, "HH:mm:ss"),
                moment(row?.toTime, "HH:mm:ss") /* .format('hh:mm:ss A') */,
                row?.noOfSlots,
                row?.slotDate,
              );
              // modal State
              setValue("loadderState", false);
              appointmentModalOpen();
            });
          } else {
            setValue("loadderState", false);
            sweetAlert(
              "Slot Not Available !",
              "Slots are not available for this day !!!",
              "warning",
            );
          }
        } else {
          sweetAlert("Network Error!", "Please try again !!!", "error");
          setValue("loadderState", false);
        }
      })
      .catch((errors) => {
        sweetAlert("Network Error!", "Please try again !!!", "error");
        setValue("loadderState", false);
      });
  };

  // bookApptSubmit
  const bookApptSubmit = (data) => {
    setValue("loadderState", true);
    console.log("data 1212121", data);
    let tokenNo = getValues("tokenNo");
    let finalBody;
    let url;

    // issuance
    if (serviceId == "24") {
      finalBody = {
        ...data,
        tokenNo,
        applicationId: applicationId,
        appointmentType: "S",
      };
      url = `${urls.HMSURL}/master/slot/bookNow`;
    }
    // renewal
    else if (serviceId == "25") {
      finalBody = {
        ...data,
        tokenNo,
        renewalOfHawkerLicense: applicationId,
        appointmentType: "S",
      };
      url = `${urls.HMSURL}/master/slot/bookNowForRenewal`;
    }
    // cancellation
    else if (serviceId == "27") {
      finalBody = {
        ...data,
        tokenNo,
        cancellationOfHawkerLicense: applicationId,
        appointmentType: "S",
      };
      url = `${urls.HMSURL}/master/slot/bookNowForCancellation`;
    }
    // transfer
    else if (serviceId == "26") {
      finalBody = {
        ...data,
        tokenNo,
        transferOfHawkerLicense: applicationId,
        appointmentType: "S",
      };
      url = `${urls.HMSURL}/master/slot/bookNowForTransfer`;
    }

    axios
      .post(url, finalBody)
      .then((res) => {
        if (
          res?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setValue("loadderState", false);
          toast.success(
            language == "en"
              ? "Slot Booked Sucessfully"
              : "स्लॉट यशस्वीरित्या बुक केला",
            {
              position: toast.POSITION.TOP_RIGHT,
            },
          );

          router.push("/streetVendorManagementSystem/dashboards");
        } else {
          setValue("loadderState", false);
        }
      })
      .catch((errors) => {
        setValue("loadderState", false);
      });
  };

  // ! ==================> useEffects =============>

  useEffect(() => {
    console.log("props", props);
  }, [props]);

  useEffect(() => {
    console.log(" applicationId - serviceId", applicationId, serviceId);
  }, [applicationId]);

  useEffect(() => {
    console.log("LoadderState123", watch("loadderState"));
  }, [watch("loadderState")]);

  // View
  return (
    <>
      {/** Calender Picker */}
      {watch("loadderState") ? (
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
                    value={field?.value}
                    minDate={moment.now()}
                    onChange={(date) => {
                      setValue("loadderState", true);
                      getSlot(moment(date).format("YYYY-MM-DD"));
                      field?.onChange(moment(date).format("YYYY-MM-DD"));
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
                        bgcolor: "red",
                        color: "white",
                      },
                    }}
                    onClick={() =>
                      router.push(`/streetVendorManagementSystem/dashboards`)
                    }
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
                {fields.map((slot, index) => {
                  console.log("slot1212", slot);
                  return (
                    <Grid container key={slot?.id}>
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
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  disabled
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
                            {errors?.fromTime ? errors.fromTime.message : null}
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
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  disabled
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
                          disabled
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
                        {slot?.noOfSlots == "0" ? (
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: "bold",
                              color: "green",
                            }}
                          >
                            {language == "en"
                              ? "Slot Not Available"
                              : "स्लॉट उपलब्ध नाहीत"}
                          </span>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            style={{
                              color: "white",
                              backgroundColor: "blue",
                              height: "30px",
                            }}
                            onClick={() => {
                              setValue("loadderState", true);
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
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<CancelIcon />}
                      type="primary"
                      onClick={() => {
                        appointmentModalClose();
                        router.push(`/streetVendorManagementSystem/dashboards`);
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
