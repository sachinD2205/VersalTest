import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
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
import FileTableCitizen from "../tdrFsiTable/FileTableCitizen";

// import TdrFsiViewApplication from "./TdrFsiViewApplication"

// import styles from "../../../../components/townPlanning/SiteVisitScheduleTP.module.css";
import styles from "../scrutiny/SiteVisitScheduleTP.module.css";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import SiteVisitQuestionNew from "../../../../../components/townPlanning/SiteVisitQuestionNew";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const ResubmitDocument = (props) => {
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
  const methods = useForm({
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    // methods,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);

  const Application = useSelector((state) => state.user.selectedApplicationId);
  const [docApi, setDocApi] = useState(true);
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

  const [answerPayload, setAnswerPayload] = useState([]);
  const [applications, setApplications] = useState([]);
  const [files, setFiles] = useState([]);

  const getApplication = () => {
    axios
      .get(`${urls.BaseURL}/application/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("sssssData", r);
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
          //   console.log("res location", r);
          setServiceList(r.data.service);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getApplicationData = (id) => {
    console.log("result111id", id);
    axios
      .get(`${urls.TPURL}/generationTdrFsi/getGenerationTdrFsi?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("result111", res);
        reset(res?.data);
        setValue(
          "attachmentss",
          res?.data.files.sort((a, b) => parseInt(a.srNo) - parseInt(b.srNo)),
        );
        setValue("zoneId", JSON.parse(res?.data.zoneId));
        setValue("villageName", JSON.parse(res?.data.villageName));
        setValue("gatNo", JSON.parse(res?.data.gatNo));
        setValue("applicantName", res?.data.applicantNameEn);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    // if(router.query.pageMode == "View" && router.query.applicationId){
    getApplicationData(router.query.applicationId);
  }, [router.query]);

  console.log("files", files);

  const onSubmitForm = (formData) => {
    console.log("formDataformData", formData);

    let finalData = {
      ...formData,
      id: Number(router.query.applicationId),
      files: watch("attachmentss"),
      applicationStat: "DOCUMENTS_CORRECTED",
      zoneId: JSON.stringify(formData?.zoneId),
      villageName: JSON.stringify(formData?.villageName),
      gatNo: JSON.stringify(formData?.gatNo),
    };

    console.log("finalDataCheck", finalData);
    axios
      .post(`${urls.TPURL}/generationTdrFsi/save`, finalData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 201 || res.status == 200) {
          // swal("Submited!", "Record Submited successfully !", "success");
          language == "en"
            ? sweetAlert({
                title: "Saved!",
                text: "Document Updated successfully!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "जतन केले!",
                text: "दस्तऐवज यशस्वीरित्या अद्यतनित केले!",
                icon: "success",
                button: "ओके",
              });
          router.back();
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
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
                {/* <Grid item xs={4} className={styles.feildres}>
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
                </Grid> */}
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
              {/* <TdrFsiViewApplication setFiles={setFiles}/> */}
              <FileTableCitizen key={2} serviceId={21} />
              {/* <FileTableCi */}
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
              <br />
            </Paper>
          </Box>
        </form>
      </FormProvider>
    </>
  );
};

export default ResubmitDocument;
