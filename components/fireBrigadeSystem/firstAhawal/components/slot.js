import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import BasicLayout from '../../../../../containers/Layout/BasicLayout'
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled, ThemeProvider } from "@mui/material/styles";
import styles from "../../../../styles/skysignstyles/slot.module.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  CalendarPicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import theme from "../../../../theme";
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import swal from "sweetalert";
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
  const [haveData, setHaveData] = useState(false);
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
    setdisabled(haveData);
  }, [haveData]);
  // UseEffect
  // useEffect(() => {
  //   // if (getValues(`slotss.length`) == 0) {
  //   if (getValues(`slotss.length`) == 0) {
  //     appendUI(null, null, '')
  //   }
  // }, [])

  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  // const DateDisplay = styled(CalendarPicker)(({ theme }) => ({
  //   '& input': {
  //     width: '100%',
  //   },
  // }))

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
    let mstSiteVisitScheduler = [];

    let selectedDate = data.slotDate;
    // Array - Updated Data
    data.slotss.forEach((data) => {
      mstSiteVisitScheduler.push({
        fromTime: moment(data.fromTime).format("HH:mm:ss"),
        toTime: moment(data.toTime).format("HH:mm:ss"),
        noOfSlots: data.noOfSlots,
        slotDate: selectedDate,
      });
    });

    // const reqBody = { mstSiteVisitScheduler: [...mstSiteVisitScheduler] }
    const reqBody = { mstSiteVisitScheduler };

    if (btnSaveText === "Save") {
      axios
        .post(`http://localhost:8098/sslm/api/master/siteviste/save`, reqBody)
        .then((r) => {
          if (r.status == 200) {
            swal("Submited!", "Record Submited successfully !", "success");
            console.log("res", r);
          }
        });
    }
  };

  const getSlot = (selectedDate) => {
    axios
      .get(
        `http://localhost:8098/sslm/api/master/siteviste/getByDate?slotDate=${selectedDate}`
      )
      .then((r) => {
        if (r.data.mstSiteVisitScheduler) {
          r.data.mstSiteVisitScheduler.map((row) => {
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

  const bookApptSubmit = (data) => {
    console.log("slotId", data);
    // let token=getValues("tokenNo");
    // console.log("token",datatoken);
    // const finalBody = {
    //   ...data,
    //   tokenNo: token
    // }

    // if (btnSaveText1 === 'Save') {
    axios
      .post(
        `http://localhost:8098/sslm/api/master/MstSiteVisitAppoinment/save`,
        data
      )
      .then((r) => {
        setmodalforBook(false);
        toast("Record Submited successfully !", {
          type: "success",
        });
      });
    // }
  };

  const bookAppt = () => {
    setmodalforBook(false);
  };

  // useEffect(() => {
  //   getSlot()
  // }, [])

  return (
    <>
      <div className={styles.model}>
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
                  {/* <FormattedLabel id="AptBook" /> */}
                  AptBook
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={() =>
                      router.push(
                        `/skySignLicense/transactions/components/slot`
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
              </div>

              <div
                container
                style={{ padding: "10px", backgroundColor: "#F9F9F9" }}
              >
                {fields.map((slot, index) => {
                  return (
                    <>
                      <div className={styles.row1}>
                        <div>
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
                            style={{ marginTop: 10 }}
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
                          {!haveData ? (
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
                                setmodalforBook(true),
                                  console.log("id yetoy ka", i);
                              }}
                            >
                              Book Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
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
                    router.push(`/skySignLicense/transactions/components/slot`);
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
                    router.push(`/skySignLicense/transactions/components/slot`)
                  }
                >
                  Exit
                </Button>
              </div>
            </div>
          </form>
        </Modal>
        {/* booking */}
        <Modal
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
                    onClick={(data) =>
                      // bookApptSubmit(data)
                      router.push(
                        `/skySignLicense/transactions/components/slot`
                      )
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
                  //     `/ marriageRegistration / transactions / newMarriageRegistration / components / slot`,
                  //   )
                  // }
                >
                  Exit
                </Button>
              </div>
            </div>
          </form>
        </Modal>
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
                  {/* <FormattedLabel id="AptBook" /> */}
                  AptBook
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
                      // sx={{
                      //   '.mui-style-1n2mv2k': {
                      //     display: 'flex',
                      //     justifyContent: 'space-evenly',
                      //   },
                      //   '.css-mvmu1r': {
                      //     display: 'flex',
                      //     justifyContent: 'space-evenly',
                      //   },
                      //   '.css-1dozdou': {
                      //     backgroundColor: 'red',
                      //     marginLeft: '5px',
                      //   },
                      //   '.mui-style-mvmu1r': {
                      //     display: 'flex',
                      //     justifyContent: 'space-evenly',
                      //   },
                      // }}
                      orientation="landscape"
                      openTo="day"
                      inputFormat="DD/MM/YYYY"
                      shouldDisableDate={isWeekend}
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
