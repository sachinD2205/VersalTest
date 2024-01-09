import {
  Button,
  Grid,
  Paper,
  TextField,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import theme from "../../../../../theme";
// import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import sweetAlert from "sweetalert";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import Loader from "../../../../../containers/Layout/components/Loader/index";
import { useSelector } from "react-redux";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";

const Index = (props) => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
  });
  const [siteImages, setSiteImages] = useState();
  const [dataSource, setDataSource] = useState({});
  const [hutData, setHutData] = useState({});
  const [scheduledData, setScheduledData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mangeData, setMangeData] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  var currDate = new Date();
  const headers = { Authorization: `Bearer ${user?.token}` };
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  useEffect(() => {
    getNocDataById(props.id);
  }, [props.id]);

  useEffect(() => {
    getHutData();
  }, [dataSource]);

  useEffect(() => {
    let _res = scheduledData;
    let rescheduledDateTimearray =
      _res && _res?.rescheduleTimeText && _res?.rescheduleTimeText.split(".");
    let rescheduledDateTime =
      rescheduledDateTimearray && rescheduledDateTimearray[0];
    setValue(
      "scheduledTime",
      rescheduledDateTime
        ? moment(rescheduledDateTime).format("YYYY-MM-DDThh:mm:ss")
        : _res?.scheduledTimeText
        ? moment(_res?.scheduledTimeText).format("YYYY-MM-DDThh:mm:ss")
        : null
    );
  }, [scheduledData]);

  const getHutData = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstHutList;
        let res = result && result.find((obj) => obj.id == dataSource?.hutNo);
        setHutData(res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getNocDataById = (id) => {
    if (id) {
      axios
        .get(`${urls.SLUMURL}/trnIssueNoc/getById?id=${id}`, {
          headers: headers,
        })
        .then((r) => {
          let result = r.data;
          setDataSource(result);
          let temp =
            result?.trnVisitScheduleList && result?.trnVisitScheduleList[0];
          setScheduledData(temp);

          let temp1 = result?.trnVisitScheduleList;
          setMangeData(temp1);
        }).catch((err)=>{
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const isScheduleFilled = !!(
    watch("scheduledTime") && watch("scheduledTime").toString().trim()
  );
  const isRescheduleFilled = !!(
    watch("rescheduleTime") && watch("rescheduleTime").toString().trim()
  );

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    let payload = {
      ...formData,
      ...mangeData[0],
      referenceKey: props.id,
      rescheduleDate: moment(formData.rescheduleTime).format(
        "YYYY-MM-DDThh:mm:ss"
      ),
      rescheduleTimeText: moment(formData.rescheduleTime).format(
        "YYYY-MM-DDThh:mm:ss"
      ),
      scheduledTimeText: moment(formData.scheduledTime).format(
        "YYYY-MM-DDThh:mm:ss"
      ),
      scheduleTokenNo: "123456",
      slumKey: dataSource?.slumKey,
      hutNo: dataSource?.hutNo,
      length: hutData?.length,
      breadth: hutData?.breadth,
      isDraft: false,
      height: hutData?.height,
      constructionTypeKey: hutData?.constructionTypeKey,
      usageTypeKey: hutData?.usageTypeKey,
      area: hutData?.areaOfHut,
      employeeKey: "2",
      inspectionReportDocumentPath: "terst",
      isRescheduled: props.isRescheduled === true ? true : false,
    };

    const tempData = axios
      .post(`${urls.SLUMURL}/trnVisitSchedule/trnIssuesNoc/save`, payload, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले",
            text:
              language === "en"
                ? `Site visit against ${dataSource.applicationNo} scheduled successfully !`
                : ` साइट भेट ${dataSource.applicationNo} यशस्वीरित्या शेड्यूल केली!`,
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              router.push(
                "/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails"
              );
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading && <CommonLoader />}
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        style={{
          margin: "10px",
        }}
      >
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={12}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FormattedLabel id="scheduleSiteVisit" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          {/* Schedule date & time */}
          {props.isScheduled === true && (
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <Controller
                control={control}
                name="scheduledTime"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      variant="standard"
                      {...field}
                      disablePast
                      minDate={currDate}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          size="small"
                          variant="standard"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={errors.scheduledTime}
                          helperText={
                            errors?.scheduledTime
                              ? errors.scheduledTime.message
                              : null
                          }
                        />
                      )}
                      label={<FormattedLabel id="scheduleDateTime" required />}
                      // value={field.value}
                      // onChange={(date) =>
                      //   field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                      // }
                      // defaultValue={null}
                      // disabled={dataSource?.status == 15}
                      // inputFormat="YYYY-MM-DDThh:mm:ss"
                      onChange={(date) => {
                        const formattedDate = moment(date).format("YYYY-MM-DD");
                        const formattedTime = moment(date).format("hh:mm:ss A");
                        field.onChange(`${formattedDate} ${formattedTime}`);
                      }}
                      value={
                        field.value
                          ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                          : null
                      }
                      defaultValue={null}
                      inputFormat="YYYY-MM-DD hh:mm:ss A"
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
          )}
          {/* Reschedule Date & time */}
          {props.isRescheduled === true && (
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <Controller
                control={control}
                name="rescheduleTime"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      variant="standard"
                      {...field}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          size="small"
                          variant="standard"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={errors.rescheduleTime}
                          helperText={
                            errors?.rescheduleTime
                              ? errors.rescheduleTime.message
                              : null
                          }
                        />
                      )}
                      label={<FormattedLabel id="rescheduleDateTime" />}
                      // value={field.value}
                      // onChange={(date) =>
                      //   field.onChange(
                      //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                      //   )
                      // }
                      // defaultValue={null}
                      // disabled={dataSource?.status == 2}
                      // inputFormat="YYYY-MM-DDThh:mm:ss"
                      onChange={(date) => {
                        const formattedDate = moment(date).format("YYYY-MM-DD");
                        const formattedTime = moment(date).format("hh:mm:ss A");
                        field.onChange(`${formattedDate} ${formattedTime}`);
                      }}
                      value={
                        field.value
                          ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                          : null
                      }
                      defaultValue={null}
                      inputFormat="YYYY-MM-DD hh:mm:ss A"
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
          )}
        </Grid>

        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Button
              color="success"
              size="small"
              variant="contained"
              type="submit"
              disabled={
                (!isScheduleFilled && props.isScheduled) ||
                (!isRescheduleFilled && props.isRescheduled)
              } // Disable the button if both schedule and reschedule fields are empty.
              endIcon={<Save />}
            >
              <FormattedLabel id="save" />
            </Button>
          </Grid>

          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="error"
              size="small"
              endIcon={<ExitToApp />}
              onClick={() => {
                if(loggedInUser==='citizenUser'){
                  router.push("/dashboard");
                }else if(loggedInUser==='cfcUser'){
                  router.push("/CFC_Dashboard");
                } else {
                  router.push(
                    `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`
                  );
                }
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </Grid>
        </Grid>
      </form>
    </ThemeProvider>
  );
};

export default Index;
