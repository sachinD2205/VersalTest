import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../components/Schedule.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    methods,

    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);

  const Application = useSelector((state) => state.user.selectedApplicationId);

  useEffect(() => {
    setValue("title", Application.selectedApplicationId);
    console.log("Application----", Application);
  }, [Application]);

  const test = useSelector((state) => {
    return state.user.selectedApplicationId;
  });

  console.log("test", test);
  const router = useRouter();

  useEffect(() => {
    getApplication();
    getServiceList();
  }, []);

  useEffect(() => {
    console.log("router.query", router?.query);
    if (router?.query) {
      reset(router?.query);
      setValue("moduleId", test);
    }
  }, [router.query]);

  const [applications, setApplications] = useState([]);

  const getApplication = () => {
    axios
      .get(`${urls.BaseURL}/application/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setApplications(r.data.application);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [serviceList, setServiceList] = useState([]);

  const getServiceList = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [historyArray, setHistoryArray] = useState([]);
  useEffect(() => {
    if (router.query.siteVisitMode == "Reschedule") {
      axios
        .get(
          `${urls.TPURL}/generationTdrFsi/getGenerationTdrFsi?id=${router?.query?.applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log("viewEditMode", resp.data.siteVisit);
          setHistoryArray(resp?.data?.siteVisit);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [router.query]);
  const onSubmitForm = (formData) => {
    console.log("historyArray", formData);

    const finalData = {
      id: Number(router?.query?.applicationId),
      role: "MEETING_SCHEDULE",
      meetingSchedule: [
        {
          rescheduleRemark: formData.rescheduleRemark,
          siteVisitDate: formData.srDate,
          fromTime: moment(formData.srFromTime).format("HH:mm:ss"),
          toTime: moment(formData.srToTime).format("HH:mm:ss"),
        },
      ],
    };

    console.log("finalData", finalData);

    // const tempData = axios
    //   .post(`${urls.CFCURL}/siteVisit/saveSiteVisit`, finalData, {
    //     headers: {
    //       Authorization: `Bearer ${user.token}`,
    //     },
    //   })
    //   .then((r) => {
    //     // new added
    //     const finalBody = {
    //       id: Number(router?.query?.applicationId),
    //       role: "MEETING_SCHEDULE",
    //       meetingSchedule: [
    //         {
    //           rescheduleRemark: formData.rescheduleRemark,
    //           siteVisitDate: formData.srDate,
    //           fromTime: moment(formData.srFromTime).format("HH:mm:ss"),
    //           toTime: moment(formData.srToTime).format("HH:mm:ss"),
    //         },
    //       ],
    //     };

    if (router.query.serviceId == 20) {
      // alert("set back===>");
      axios
        .post(`${urls.TPURL}/setBackCertificate/saveApplication`, finalData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            serviceId: 20,
          },
        })
        .then((r) => {
          {
            language == "en"
              ? toast("MEETING SCHEDULED !", {
                  type: "success",
                })
              : toast("मीटिंग शेड्यूल केली आहे!", {
                  type: "success",
                });
          }
          router.push("/townPlanning/transactions/setBackCertificate/scrutiny");
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

      if (r.status == 201 || r.status == 200) {
        {
          language == "en"
            ? sweetAlert("SCHEDULED!", "MEETING SCHEDULED !", "success")
            : sweetAlert("अनुसूचित!", "मीटिंग शेड्यूल केली आहे!", "success");
        }
      }
      router.push(`/townPlanning/transactions/setBackCertificate/scrutiny`);
    } else if (router.query.serviceId == 19) {
      // alert("development Plan Opinion===>");
      axios
        .post(
          `${urls.TPURL}/developmentPlanOpinion/saveApplication`,
          finalData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              serviceId: 19,
            },
          },
        )
        .then((r) => {
          language == "en"
            ? toast("MEETING SCHEDULED !", {
                type: "success",
              })
            : toast("मीटिंग शेड्यूल केली आहे!", {
                type: "success",
              });
          router.push(
            "/townPlanning/transactions/developmentPlanOpinion/scrutiny",
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

      // if (r.status == 201 || r.status == 200) {
      //   language == "en"
      //     ? toast("MEETING SCHEDULED !", {
      //         type: "success",
      //       })
      //     : toast("मीटिंग शेड्यूल केली आहे!", {
      //         type: "success",
      //       });
      // }
      router.push(`/townPlanning/transactions/developmentPlanOpinion/scrutiny`);
    } else if (router.query.serviceId == 17) {
      console.log("serviceId == 17", router.query.serviceId);
      // alert("part map===>");
      axios
        .post(`${urls.TPURL}/partplan/savepartplan`, finalData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            serviceId: 17,
          },
        })
        .then((r) => {
          language == "en"
            ? toast("Site Visit Scheduled !", {
                type: "success",
              })
            : toast("साईट भेट शेड्यूल केली आहे!", {
                type: "success",
              });
          router.push("/townPlanning/transactions/partPlan/scrutiny");
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

      // if (r.status == 201 || r.status == 200) {
      //   // sweetAlert("Scheduled!", "Site Visit Scheduled !", "success");

      //   sweetAlert(
      //     language == "en" ? "Scheduled!" : "साईट भेट शेड्यूल",
      //     language == "en"
      //       ? "Site Visit Scheduled !"
      //       : "यशस्वीरित्या साईट भेट शेड्यूल व्युत्पन्न झाले",
      //     "success",
      //   );
      // }
      router.push(`/townPlanning/transactions/partPlan/scrutiny`);
    } else if (router.query.serviceId == 18) {
      // alert("zone certificate===>");
      axios
        .post(
          `${urls.TPURL}/transaction/zoneCertificate/savezonecertificate`,
          finalData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              serviceId: 18,
            },
          },
        )
        .then((r) => {
          console.log("reschedule---", r);
          toast("site visit scheduled !", {
            type: "success",
          });

          language == "en"
            ? toast("site visit scheduled !", {
                type: "success",
              })
            : toast("साईट भेट शेड्यूल केली आहे!", {
                type: "success",
              });
          router.push("/townPlanning/transactions/zoneCertificate/scrutiny");
        })

        .catch((error) => {
          callCatchMethod(error, language);
        });

      // if (r.status == 201 || r.status == 200) {
      //   sweetAlert(
      //     language == "en" ? "Scheduled!" : "साईट भेट शेड्यूल",
      //     language == "en"
      //       ? "Site Visit Scheduled !"
      //       : "यशस्वीरित्या साईट भेट शेड्यूल व्युत्पन्न झाले",
      //     "success",
      //   );
      // }
      router.push(`/townPlanning/transactions/zoneCertificate/scrutiny`);
    }

    //     .catch((error) => {
    //       callCatchMethod(error, language);
    //     });
  };

  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Box
            style={{
              margin: "4%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingBottom: "20%",
              // overflowY: "auto",
            }}
          >
            <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
              <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
                <Toolbar variant="dense">
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{
                      mr: 2,
                      color: "#2980B9",
                    }}
                  >
                    <ArrowBackIcon
                      onClick={() =>
                        router.push({
                          pathname: "/common",
                        })
                      }
                    />
                  </IconButton>

                  <Typography
                    sx={{
                      textAlignVertical: "center",
                      textAlign: "center",
                      color: "rgb(7 110 230 / 91%)",
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      typography: {
                        xs: "body1",
                        sm: "h6",
                        md: "h5",
                        lg: "h4",
                        xl: "h3",
                      },
                    }}
                  >
                    {router.query.siteVisitMode == "Reschedule"
                      ? language == "en"
                        ? "Reschedule Meeting"
                        : "पुन्हा वेळापत्रक"
                      : language == "en"
                      ? "Schedule Meeting"
                      : "बैठकीचे वेळापत्रक"}
                  </Typography>
                </Toolbar>
              </AppBar>
            </Box>
            <Paper
              sx={{
                margin: 1,
                padding: 2,
                backgroundColor: "#F5F5F5",
              }}
              elevation={5}
            >
              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  <FormattedLabel id="applicationDetails" />
                </Box>
              </Box>
              <br />
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <FormControl style={{ width: "84%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      <FormattedLabel id="applicationName" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.application ? true : false}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="applicationName" />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {applications &&
                            applications.map((applicationNameEng, index) => (
                              <MenuItem
                                key={index}
                                value={applicationNameEng.id}
                              >
                                {language === "en"
                                  ? applicationNameEng.applicationNameEng
                                  : applicationNameEng.applicationNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="moduleId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.application ? errors.application.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <FormControl
                    sx={{
                      marginTop: 0,
                      backgroundColor: "white",
                      width: "84%",
                    }}
                    error={!!errors.applicationDate}
                  >
                    <Controller
                      control={control}
                      name="applicationDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            // disabled={inputState}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                {<FormattedLabel id="applicationDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
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
                      {errors?.applicationDate
                        ? errors.applicationDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <FormControl style={{ width: "84%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      <FormattedLabel id="serviceId" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.service ? true : false}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="serviceId" />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {serviceList &&
                            serviceList
                              //   .filter((f) => f.id === departmentValue)
                              .map((service, index) => {
                                return (
                                  <MenuItem key={index} value={service.id}>
                                    {language === "en"
                                      ? service.serviceName
                                      : service.serviceNameMr}
                                  </MenuItem>
                                );
                              })}
                        </Select>
                      )}
                      name="serviceId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.service ? errors.service.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                columns={{ xs: 6, sm: 12, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={6} className={styles.feildres}>
                  <TextField
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: watch("applicantName") ? true : false,
                    }}
                    sx={{ backgroundColor: "white", width: "90%" }}
                    // id='standard-basic'
                    label={<FormattedLabel id="applicantName" />}
                    variant="outlined"
                    // value={dataInForm && dataInForm.religion}
                    {...register("applicantName")}
                    error={!!errors.applicantName}
                    helperText={
                      errors?.applicantName
                        ? errors.applicantName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={6} className={styles.feildres}>
                  <TextField
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: watch("applicationStatus") ? true : false,
                    }}
                    sx={{ backgroundColor: "white", width: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="applicationStatus" />}
                    variant="outlined"
                    // value={dataInForm && dataInForm.religion}
                    {...register("applicationStatus")}
                    error={!!errors.applicationStatus}
                    helperText={
                      errors?.applicationStatus
                        ? errors.applicationStatus.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              {/* <TdrFsiViewApplication /> */}

              {router.query.siteVisitMode == "Reschedule" && (
                <>
                  <Box className={styles.tableHead}>
                    <Box className={styles.feildHead}>
                      {language == "en"
                        ? "Site Visit Schedule History"
                        : "साइट भेट शेड्यूल इतिहास"}
                    </Box>
                  </Box>
                  <div>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <b> {language == "en" ? "Sr.No" : "अनु.क्र."}</b>
                            </TableCell>
                            <TableCell>
                              <b>
                                {" "}
                                {language == "en"
                                  ? "Previous Site Visit Date"
                                  : "मागील साइटला भेट देण्याची तारीख"}
                              </b>
                            </TableCell>
                            <TableCell>
                              <b>
                                {" "}
                                {language == "en"
                                  ? "From Time"
                                  : "सुरवातीची वेळ"}
                              </b>
                            </TableCell>
                            <TableCell>
                              <b>
                                {" "}
                                {language == "en"
                                  ? "To Time"
                                  : "समाप्तीचा कालावधी"}
                              </b>
                            </TableCell>
                            <TableCell>
                              <b>
                                {" "}
                                {language == "en"
                                  ? "Reason of Reschedule"
                                  : "रीशेड्यूलचे कारण"}
                              </b>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {historyArray?.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                {moment(row.siteVisitDate).format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell>
                                {moment(row.fromTime, "HH:mm:ss").format(
                                  "hh:mm A",
                                )}
                              </TableCell>
                              <TableCell>
                                {moment(row.toTime, "HH:mm:ss").format(
                                  "hh:mm A",
                                )}
                              </TableCell>
                              <TableCell>{row.rescheduleRemark}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </>
              )}
              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  <FormattedLabel id="siteVisitDetails" />
                </Box>
              </Box>
              <br />

              <Grid
                container
                columns={{ xs: 5, sm: 10, md: 12 }}
                className={styles.feildres}
                spacing={2}
              >
                {/* <Grid item xs={5} className={styles.feildres}>
                  <FormControl style={{ width: "84%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      <FormattedLabel id="siteVistType" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.application ? true : false}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="siteVistType" />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          <MenuItem value="SCHEDULE">
                            {language === "en" ? "Schedule" : "वेळापत्रक"}
                          </MenuItem>
                          <MenuItem value="RESCHEDULE">
                            {language === "en"
                              ? "ReSchedule"
                              : "पुन्हा वेळापत्रक"}
                          </MenuItem>
                        </Select>
                      )}
                      name="siteVisitType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.siteVisitType
                        ? errors.siteVisitType.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                {router.query.siteVisitMode == "Reschedule" && (
                  <Grid item xs={5} className={styles.feildres}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      id="standard-basic"
                      variant="outlined"
                      {...register("rescheduleRemark")}
                      size="small"
                      // fullWidth
                      InputLabelProps={{
                        style: {
                          fontSize: 12,
                        },
                      }}
                      sx={{ backgroundColor: "white", width: "85%" }}
                      error={!!errors.rescheduleRemark}
                      label={
                        language == "en"
                          ? "Reschedule Reason"
                          : "रीशेड्यूलचे कारण"
                      }
                      placeholder={
                        language == "en"
                          ? "Reschedule Reason"
                          : "रीशेड्यूलचे कारण"
                      }
                      // InputProps={{ style: { fontSize: 18 } }}
                      // InputLabelProps={{
                      //   style: { fontSize: 15 },
                      //   //true
                      //   // shrink:
                      //   //   (watch("rescheduleRemark") ? true : false) || (router.query.rescheduleRemark ? true : false),
                      // }}
                      helperText={
                        errors?.rescheduleRemark
                          ? errors.rescheduleRemark.message
                          : null
                      }
                    />
                  </Grid>
                )}
                <Grid item xs={5} className={styles.feildres}>
                  <FormControl
                    sx={{
                      marginTop: 0,
                      backgroundColor: "white",
                      width: "84%",
                    }}
                    error={!!errors.srDate}
                  >
                    <Controller
                      control={control}
                      name="srDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            // disabled={inputState}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                {<FormattedLabel id="visitDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            shouldDisableDate={isWeekend}
                            minDate={new Date()}
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
                      {errors?.srDate ? errors.srDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <br />

              <Grid
                container
                columns={{ xs: 5, sm: 10, md: 12 }}
                className={styles.feildres}
                spacing={2}
              >
                <Grid item xs={5} className={styles.feildres}>
                  <FormControl
                    sx={{ width: "84%", backgroundColor: "white" }}
                    error={!!errors.srFromTime}
                  >
                    <Controller
                      // format="HH:mm:ss"

                      control={control}
                      name="srFromTime"
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            label={<FormattedLabel id="fromTime" />}
                            value={field.value}
                            onChange={(time) => field.onChange(time)}
                            // onChange={(time) => {
                            // moment(
                            //   field.onChange(time),
                            //   "HH:mm:ss a"
                            // ).format("HH:mm:ss a");
                            // }}
                            selected={field.value}
                            renderInput={(params) => (
                              <TextField size="small" {...params} />
                            )}
                            defaultValue={null}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.srFromTime ? errors.srFromTime.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={5} className={styles.feildres}>
                  <FormControl
                    sx={{ width: "84%", backgroundColor: "white" }}
                    error={!!errors.srToTime}
                  >
                    <Controller
                      control={control}
                      name="srToTime"
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            label={<FormattedLabel id="toTime" />}
                            value={field.value}
                            onChange={(time) => field.onChange(time)}
                            selected={field.value}
                            renderInput={(params) => (
                              <TextField size="small" {...params} />
                            )}
                            defaultValue={null}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.srToTime ? errors.srToTime.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <Grid container className={styles.feildres} spacing={2}>
                <Grid item>
                  <Button
                    type="submit"
                    size="small"
                    variant="outlined"
                    className={styles.button}
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id="save" />
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    className={styles.button}
                    endIcon={<ExitToAppIcon />}
                    onClick={() => router.back()}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </form>
      </FormProvider>
    </>
  );
};

export default SiteVisitSchedule;
