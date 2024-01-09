import {
  Button,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import theme from "../../../../../theme";
import schema from "../../../../../containers/schema/slumManagementSchema/issuanceOfNocSchema";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import Loader from "../../../../../containers/Layout/components/Loader/index";
import sweetAlert from "sweetalert";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const [siteImages, setSiteImages] = useState();
  const [dataSource, setDataSource] = useState({});
  const [hutData, setHutData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);
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
  let loggedInUser = localStorage.getItem("loggedInUser");

  const headers = { Authorization: `Bearer ${user?.token}` };
  useEffect(() => {
    getPhotopassDataById(router.query.id);
  }, [router.query.id]);

  useEffect(() => {
    let res =
      dataSource?.trnVisitScheduleList?.length > 0
        ? dataSource?.trnVisitScheduleList[
            dataSource?.trnVisitScheduleList.length - 1
          ]
        : null;
    setValue("scheduledTime", res ? res?.scheduledDate : "-");
    setValue("rescheduleTime", res ? res?.rescheduleDate : "-");
  }, [dataSource]);

  const getPhotopassDataById = (id) => {
    if (id) {
      axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
          headers: headers,
        })
        .then((r) => {
          let result = r.data;
          setDataSource(result);
        }).catch((err)=>{
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnVisitSchedule/issuePhotopass/save`, _body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert(
            language == "en" ? "Saved!" : "जतन केले",
            language === "en"
              ? `Site visit against ${dataSource.applicationNo} scheduled successfully !`
              : ` साइट भेट ${dataSource.applicationNo} यशस्वीरित्या शेड्यूल केली!`,
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
          router.push(
            "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
          );
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
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <form onSubmit={handleSubmit(handleOnSubmit)}>
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

          <Grid container sx={{ padding: "10px" }}>
            {/* Schedule date & time */}

            <Grid
              item
              xl={4}
              lg={4}
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
              <Controller
                control={control}
                name="scheduledTime"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      {...field}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          size="small"
                          fullWidth
                          sx={{ width: "75%" }}
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
                      //   field.onChange(
                      //     moment(date).format("YYYY-MM-DD h:mm A")
                      //   )
                      // }
                      // defaultValue={null}
                      // inputFormat="YYYY-MM-DD h:mm A"
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

            <Grid
              item
              xl={4}
              lg={4}
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
              <Controller
                control={control}
                name="rescheduleTime"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      {...field}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          size="small"
                          fullWidth
                          sx={{ width: "75%" }}
                          error={errors.scheduledTime}
                          helperText={
                            errors?.scheduledTime
                              ? errors.scheduledTime.message
                              : null
                          }
                        />
                      )}
                      label={
                        <FormattedLabel id="rescheduleDateTime" required />
                      }
                      // value={field.value}
                      // onChange={(date) =>
                      //   field.onChange(
                      //     moment(date).format("YYYY-MM-DD h:mm A")
                      //   )
                      // }
                      // defaultValue={null}
                      // inputFormat="YYYY-MM-DD h:mm A"
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
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xl={4}
              lg={4}
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
                endIcon={<ExitToApp />}
                onClick={() => {
                  router.push(
                    `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
                  );
                }}
              >
                <FormattedLabel id="exit" />
                {/* {labels["exit"]} */}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
