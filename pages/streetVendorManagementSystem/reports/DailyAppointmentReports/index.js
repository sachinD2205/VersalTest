import { yupResolver } from "@hookform/resolvers/yup";
import { SearchOutlined } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import NewReportLayout from "../../../../components/streetVendorManagementSystem/components/NewReportLayout";
import DailyAppointmentReportSchema from "../../../../components/streetVendorManagementSystem/schema/DailyAppointmentReportSchema";
import styles from "../../../../components/streetVendorManagementSystem/styles/DailyAppointmentReports.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// DailyAppointmentReports
const Index = () => {
  let language = useSelector((state) => state.labels.language);
  const methods = useForm({
    resolver: yupResolver(DailyAppointmentReportSchema),
  });
  const {
    control,
    watch,
    clearErrors,
    setValue,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [reportData, setReportData] = useState([]);
  const [tempReportData, setTempReportData] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // handlePrint
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  //handleNext
  const handleNext = (data) => {
    console.log("data", data);

    axios
      .get(
        `${urls.HMSURL}/report/getDailyAppointmentReport?zoneName=${
          data.zoneName
        }&fromDate=${moment(data.fromDate).format(
          "YYYY-MM-DD"
        )}&toDate=${moment(data.toDate).format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log(
            "dailyAppointmentCount",
            res?.data?.dailyAppointmentCount
          );
          if (
            res?.data?.dailyAppointmentCount != null &&
            res?.data?.dailyAppointmentCount != undefined &&
            res?.data?.dailyAppointmentCount != ""
          ) {
            setTempReportData(res?.data?.dailyAppointmentCount);

            sweetAlert({
              title: language == "en" ? "Success!" : "यशस्वीपणे",
              text:
                language == "en"
                  ? "Record Successfully Fetched!"
                  : "रेकॉर्ड यशस्वीरित्या आणले!",
              icon: "success",
              buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
            });
          } else {
            setTempReportData([]);
            sweetAlert({
              title: language == "en" ? "Empty!" : "रिकामे",
              text:
                language == "en" ? "Record Not Found!" : "रेकॉर्ड सापडला नाही!",
              icon: "error",
              buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
            });
          }
        } else {
          setTempReportData([]);
          sweetAlert({
            title: language == "en" ? "Empty!" : "रिकामे",
            text:
              language == "en" ? "Record Not Found!" : "रेकॉर्ड सापडला नाही!",
            icon: "error",
            buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
          });
        }
      })
      .catch((error) => {
        setTempReportData([]);
        callCatchMethod(error, language);
      });
  };

  // zones
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setZoneNames(
            r?.data?.zone?.map((row) => ({
              id: row?.id,
              zoneName: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // clearButton
  const clearButton = () => {
    setValue("zoneName", null);
    setValue("fromDate");
    setValue("toDate");
    clearErrors(["zoneName", "fromDate", "toDate"]);
    setTempReportData([]);
  };

  // exitButton
  const exitButton = () => {
    router.push(`/streetVendorManagementSystem/dashboards`);
  };

  // useEffect ----------->

  useEffect(() => {
    getZoneName();
  }, []);

  useEffect(() => {
    console.log("tempReportData", tempReportData);
    let testReportData = [];
    if (
      tempReportData != null &&
      tempReportData != undefined &&
      tempReportData.length != 0
    ) {
      testReportData = tempReportData.map((data, index) => {
        return {
          ...data,
          srNo: index + 1,
        };
      });
    } else {
      testReportData = [];
    }

    setReportData(testReportData);
  }, [tempReportData]);

  useEffect(() => {
    console.log("reportData", reportData);
  }, [reportData]);

  // view -- search
  return (
    <>
      <Paper className={styles.Paper1} elevation={5}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            <ThemeProvider theme={theme}>
              <div className={styles.Paper11}>
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
                  <strong>
                    <center>
                      {language == "en"
                        ? "Daily Appointment Report"
                        : "दैनंदिन भेटीचा अहवाल"}
                    </center>
                  </strong>
                </div>
                <Grid container className={styles.GridMain}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors?.zoneName}
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="zoneName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={watch("disabledFieldInputState")}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label=<FormattedLabel id="zoneName" />
                          >
                            {zoneNames &&
                              zoneNames.map((zoneName, index) => (
                                <MenuItem key={index} value={zoneName?.id}>
                                  {language == "en"
                                    ? zoneName?.zoneName
                                    : zoneName?.zoneNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="zoneName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zoneName ? errors?.zoneName?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      style={{ marginTop: 0 }}
                      error={!!errors?.fromDate}
                    >
                      <Controller
                        name="fromDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="fromDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              maxDate={new Date()}
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
                        {errors?.fromDate ? errors?.fromDate?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      style={{ marginTop: 0 }}
                      error={!!errors?.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled={
                                watch("fromDate") != null ? false : true
                              }
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="toDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              minDate={watch("fromDate")}
                              maxDate={new Date()}
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
                        {errors?.toDate ? errors?.toDate?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Stack
                  className={styles.Stack}
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
                    size="small"
                    type="submit"
                    variant="contained"
                    style={{
                      backgroundColor: "#008CBA",
                      color: "white",
                    }}
                    startIcon={<SearchOutlined />}
                  >
                    <FormattedLabel id="search" />
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => clearButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Stack>
                <div className={styles.printButton}>
                  <Button
                    size="small"
                    onClick={handlePrint}
                    variant="contained"
                    startIcon={<PrintIcon />}
                    type="button"
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </div>
              </div>
            </ThemeProvider>
          </form>
        </FormProvider>

        <NewReportLayout
          showDates
          date={{
            from: moment(watch("fromDate")).format("DD-MM-YYYY"),
            to: moment(watch("toDate")).format("DD-MM-YYYY"),
          }}
          componentRef={componentRef}
          deptName={{
            en: "Streetvendor Management System",
            mr: "पथविक्रेता व्यवस्थापन प्रणाली",
          }}
          reportName={{
            en: "Daily Appointment Report",
            mr: "दैनंदिन भेटीचा अहवाल",
          }}
        >
          <ComponentToPrint reportData={reportData} language={language} />
        </NewReportLayout>
      </Paper>
    </>
  );
};

// Class Component  ---- Report Content
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.Div1}>
        <table className={`${styles.table} ${styles.tableBorder}`}>
          <thead>
            {/* <tr className={styles.bg}>
              <th
                colSpan={60}
                className={`${styles.reportHeader} ${styles.tableBorder} ${styles.reportTitle}`}>
                {this?.props?.language == "en"
                  ? "Daily Appointment Report"
                  : "दैनंदिन भेटीचा अहवाल"}
              </th>
            </tr> */}

            <tr className={styles.bg1}>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}    ${styles.srWidth}`}
              >
                {this?.props?.language == "en" ? "Sr.No" : "क्र."}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
              >
                {this?.props?.language == "en" ? "Ward Name" : "प्रभागाचे नाव"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
              >
                {this?.props?.language == "en"
                  ? "Date of Appointment"
                  : "भेटीची तारीख"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
              >
                {this?.props?.language == "en" ? "Total" : "एकूण"}
              </th>
            </tr>
          </thead>
          <tbody>
            {this?.props?.reportData &&
              this?.props?.reportData?.map((data) => (
                <>
                  <tr className={styles.tdAlign}>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.srWidth}`}
                    >
                      {data?.srNo}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
                    >
                      {data?.wardname}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
                    >
                      {data?.dateofappointment}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
                    >
                      {data?.count}
                    </td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Index;
