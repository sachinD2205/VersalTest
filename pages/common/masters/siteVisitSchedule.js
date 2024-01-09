import {
  AppBar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Typography,
  Paper,
  Select,
  TextField,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import urls from "../../../URLS/urls";
import { useSelector } from "react-redux";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { setSelectedServiceId } from "../../../features/userSlice";
import moment from "moment";
import { toast } from "react-toastify";

const SiteVisitSchedule = (props) => {
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
      setValue("applicantName", router?.query?.applicantNameCol);
    }

    // if (router?.query?.id) {
    //   axios
    //     .get(
    //       `${urls.FbsURL}/transaction/trnBussinessNOC/getById?id=${router?.query?.id}`
    //     )
    //     .then((res) => {
    //       if (res?.data?.nocType == "New") {
    //         setNocType(res?.data?.nocType == "SCHEDULE");
    //       } else if (res?.data?.nocType == "Reschedule") {
    //         setNocType(res?.data?.nocType == "RESCHEDULE");
    //       }
    //       console.log("res.dataaaa", res?.data);
    //       // reset(res?.data);
    //     });
    // }
  }, []);

  const [applications, setApplications] = useState([]);

  const getApplication = () => {
    axios
      .get(`${urls.BaseURL}/application/getAll`)
      .then((r) => {
        console.log("dataaaa", r);

        setApplications(
          // r.data.application.map((row) => ({
          //   id: row.id,
          //   appCode: row.appCode,
          //   applicationNameEng: row.applicationNameEng,
          //   applicationNameMr: row.applicationNameMr,
          //   module: row.module,
          // })),
          r.data.application
        );
      })
      .catch((err) => {
        // setOpen(false);
        console.log("err", err);
      });
  };

  const [serviceList, setServiceList] = useState([]);

  const getServiceList = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          //   console.log("res location", r);
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  let user = useSelector((state) => state.user.user);

  const onSubmitForm = (formData) => {
    const finalData = {
      // id: formData.id,
      moduleId: formData.moduleId,
      serviceId: formData.serviceId,
      siteVisitType: formData.siteVisitType,
      trnId: router?.query?.id,
      srDate: formData.srDate,
      srFromTime: moment(formData.srFromTime).format("HH:mm:ss"),
      srToTime: moment(formData.srToTime).format("HH:mm:ss"),
    };

    console.log("finalData", finalData);

    axios
      .post(`${urls.CFCURL}/siteVisit/saveSiteVisit`, finalData)
      .then((res) => {
        // new added
        const finalBody = {
          role: "SITE_VISIT_SCHEDULE",
          siteVisitType: formData.siteVisitType,
          id: router?.query?.id,

          // applicationId: formData.moduleId,
          // serviceId: formData.serviceId,
        };

        axios
          .post(
            `${urls.FbsURL}/transaction/trnBussinessNOC/saveApplicationApprove`,
            finalBody,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          )
          .then((r) => {
            // seteAppointmentBookModal(false);
            toast("site visit scheduled !", {
              type: "success",
            });
            router.push("/FireBrigadeSystem/transactions/businessNoc/scrutiny");
          });

        if (res.status == 201 || res.status == 200) {
          sweetAlert("Scheduled!", "Site Visit Scheduled !", "success");
        }
        router.push(`/FireBrigadeSystem/transactions/businessNoc/scrutiny`);
      });
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
              <AppBar position='static' sx={{ backgroundColor: "#FBFCFC " }}>
                <Toolbar variant='dense'>
                  <IconButton
                    edge='start'
                    color='inherit'
                    aria-label='menu'
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
                    <FormattedLabel id='siteVisitSchedule' />
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
              {/* <Grid
                container
                columns={{ xs: 12, sm: 12, md: 12 }}
                className={styles.feildres}
              >
                <Grid
                  item
                  sx={{
                    backgroundColor: "white",
                    // borderLeft: "0.5px solid black",
                  }}
                  xs={5}
                  className={styles.feildres}
                >
                  <FormControl
                    fullWidth
                    variant='outlined'
                    // sx={{ backgroundColor: "white" }}
                  >
                    <InputLabel htmlFor='standard-adornment'>
                      Application Number
                    </InputLabel>
                    <Input
                      id='standard-adornment'
                      {...register("applicantNumber")}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton>
                            <SearchIcon sx={{ color: "#2E86C1" }} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br /> */}

              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  <FormattedLabel id='applicationDetails' />
                </Box>
              </Box>
              <br />
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <FormControl style={{ width: "84%" }} size='small'>
                    <InputLabel id='demo-simple-select-label'>
                      <FormattedLabel id='applicationName' />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.application ? true : false}
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label={<FormattedLabel id='applicationName' />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {applications &&
                            applications.map((appName, index) => (
                              <MenuItem key={index} value={appName.id}>
                                {language === "en"
                                  ? appName.applicationNameEng
                                  : appName.applicationNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='moduleId'
                      control={control}
                      defaultValue=''
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
                      name='applicationDate'
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            // disabled={inputState}
                            inputFormat='DD/MM/YYYY'
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                {<FormattedLabel id='applicationDate' />}
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
                      {errors?.applicationDate
                        ? errors.applicationDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <FormControl style={{ width: "84%" }} size='small'>
                    <InputLabel id='demo-simple-select-label'>
                      <FormattedLabel id='serviceId' />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.service ? true : false}
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label={<FormattedLabel id='serviceId' />}
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
                      name='serviceId'
                      control={control}
                      defaultValue=''
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
                    size='small'
                    fullWidth
                    sx={{ backgroundColor: "white", width: "90%" }}
                    // id='standard-basic'
                    label={<FormattedLabel id='applicantName' />}
                    variant='outlined'
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
                    size='small'
                    fullWidth
                    sx={{ backgroundColor: "white", width: "90%" }}
                    id='outlined-basic'
                    label={<FormattedLabel id='applicationStatus' />}
                    variant='outlined'
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
              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  <FormattedLabel id='siteVisitDetails' />
                </Box>
              </Box>
              <br />

              <Grid
                container
                columns={{ xs: 5, sm: 10, md: 12 }}
                className={styles.feildres}
                spacing={2}
              >
                <Grid item xs={5} className={styles.feildres}>
                  <FormControl style={{ width: "84%" }} size='small'>
                    <InputLabel id='demo-simple-select-label'>
                      <FormattedLabel id='siteVistType' />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.application ? true : false}
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label={<FormattedLabel id='siteVistType' />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          <MenuItem value='SCHEDULE'>
                            {language === "en" ? "Schedule" : "वेळापत्रक"}
                          </MenuItem>
                          <MenuItem value='RESCHEDULE'>
                            {language === "en"
                              ? "ReSchedule"
                              : "पुन्हा वेळापत्रक"}
                          </MenuItem>
                        </Select>
                      )}
                      name='siteVisitType'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.siteVisitType
                        ? errors.siteVisitType.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
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
                      name='srDate'
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            // disabled={inputState}
                            inputFormat='DD/MM/YYYY'
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                {<FormattedLabel id='visitDate' />}
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
                      name='srFromTime'
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            label={<FormattedLabel id='fromTime' />}
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
                              <TextField size='small' {...params} />
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
                      name='srToTime'
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            label={<FormattedLabel id='toTime' />}
                            value={field.value}
                            onChange={(time) => field.onChange(time)}
                            selected={field.value}
                            renderInput={(params) => (
                              <TextField size='small' {...params} />
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
                    type='submit'
                    size='small'
                    variant='outlined'
                    className={styles.button}
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id='save' />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size='small'
                    variant='outlined'
                    className={styles.button}
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    {<FormattedLabel id='clear' />}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size='small'
                    variant='outlined'
                    className={styles.button}
                    endIcon={<ExitToAppIcon />}
                    onClick={() =>
                      router.push({
                        pathname:
                          "/FireBrigadeSystem/transactions/businessNoc/scrutiny",
                      })
                    }
                  >
                    {<FormattedLabel id='exit' />}
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
