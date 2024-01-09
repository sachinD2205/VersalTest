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
import { toast } from "react-toastify";
import urls from "../../../../../URLS/urls";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/slotNew.module.css";
import theme from "../../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
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

  const getSlotNew = () => {
    const finalBodyForApi = {
      appointmentDate: watch("slotDate"),
      zoneId: watch("zoneKey"),
    };
    if (
      finalBodyForApi?.appointmentDate != null &&
      finalBodyForApi?.appointmentDate != undefined &&
      finalBodyForApi?.appointmentDate != "" &&
      finalBodyForApi?.zoneId != null &&
      finalBodyForApi?.zoneId != undefined &&
      finalBodyForApi?.zoneId != ""
    ) {
      axios
        .post(`${urls.MR}/appointmentSche/getSlots`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            if (
              res?.data != null &&
              res?.data != undefined &&
              res?.data != ""
            ) {
              setValue("tokenNo", res?.data?.tokenNo);
              setValue("time", res?.data?.time);
              setmodalforAppoitment(true);
            }
            console.log("newApiData", res?.data);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
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
        zoneId: watch("zoneKey"),
        tokenNo: watch("tokenNo"),
        time: watch("time"),
      },
    };

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
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
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
          .catch((error) => {
            callCatchMethod(error, language);
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
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [zoneDropDown, setZoneDropDown] = useState([]);

  const getAvailableZone = useCallback(() => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZoneDropDown(
          res.data.zone.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const getAvailableTimeSlot = useCallback(() => {
    const finalBodyForApi = {
      appointmentDate: watch("slotDate"),
      zoneId: watch("zoneKey"),
    };
    if (
      finalBodyForApi?.appointmentDate != null &&
      finalBodyForApi?.appointmentDate != undefined &&
      finalBodyForApi?.appointmentDate != "" &&
      finalBodyForApi?.zoneId != null &&
      finalBodyForApi?.zoneId != undefined &&
      finalBodyForApi?.zoneId != ""
    ) {
      axios
        .post(`${urls.MR}/appointmentSche/getSlots`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then(
          (res) => {
            if (res?.status == 200 || res?.status == 201) {
              if (
                res?.data != null &&
                res?.data != undefined &&
                res?.data != ""
              ) {
                setValue("tokenNo", res?.data?.tokenNo);
                setValue("time", res?.data?.time);
                setmodalforAppoitment(true);
              }
              console.log("newApiData", res?.data);
            }
          },
          // {
          //   let tempDataArray = [];

          //   if (
          //     res?.data?.availableSlots != null &&
          //     res?.data?.availableSlots != undefined &&
          //     res?.data?.availableSlots != ""
          //   ) {
          //     res?.data?.availableSlots.map((data, index) => {
          //       const timeSlots = {
          //         id: index + 1,
          //         timeSlot: data,
          //       };
          //       tempDataArray.push(timeSlots);
          //     });
          //   }

          //   console.log("availableSlots", tempDataArray);
          //   setTimeSlotDropDown(tempDataArray);
          // }
        )
        .catch((error) => {
          console.log("error343", error);
          callCatchMethod(error, language);
        });
    }
  }, []);

  useEffect(() => {
    getAvailableZone();
    // getAvailableToken();
    // getAvailableTimeSlot();
    console.log("MR: inside useEffect");
  }, [
    // getAvailableTimeSlot, getAvailableToken,

    getAvailableZone,
  ]);

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
                // container
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
                            <FormattedLabel id="zone" />
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

                      {/* token */}
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
                        <TextField
                          variant="standard"
                          style={{ width: 280 }}
                          disabled
                          label={<FormattedLabel id="token" />}
                          {...register("tokenNo")}
                          error={!!errors.tokenNo}
                          helperText={
                            errors?.tokenNo ? errors.tokenNo.message : null
                          }
                        />
                      </Grid>

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
                        <TextField
                          variant="standard"
                          style={{ width: 280 }}
                          disabled
                          label={<FormattedLabel id="time" />}
                          {...register("time")}
                          error={!!errors.time}
                          helperText={errors?.time ? errors.time.message : null}
                        />
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
                  <FormattedLabel id="save" />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<CancelIcon />}
                  // type="primary"
                  onClick={() =>
                    router.push(
                      `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slotAutoNew`,
                    )
                  }
                >
                  <FormattedLabel id="exit" />
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
                          setValue("zoneKey", router?.query?.zoneKey);
                          getSlotNew();
                          // modal ---
                          // setmodalforAppoitment(true),
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
