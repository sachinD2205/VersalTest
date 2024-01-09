import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import styles from "./view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import "jspdf-autotable";
import RTIReportLayout from "../../../../containers/reuseableComponents/RTIReportLayout";
import { useReactToPrint } from "react-to-print";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
const Index = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({});

  const router = useRouter();

  const currDate = new Date();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const language = useSelector((store) => store.labels.language);
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
  let resetValuesCancell = {
    fromDate: null,
    // toDate: null,
  };

  const componentRef = useRef(null);
  let user = useSelector((state) => state.user.user);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: language == "en" ? ` Vivaran Patra_02` : ` विवरण पत्र_०२`,
  });

  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const [dateObj, setDateObj] = useState({
    from: "",
    to: "",
  });

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const onSubmitFunc = () => {
    if (watch("fromDate")) {
      let sendFromDate = moment(watch("fromDate")).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      setDateObj({
        from: moment(watch("fromDate")).format("MM-YYYY"),
        // from: moment(watch("fromDate")).format("DD-MM-YYYY"),
        // to: moment(watch("toDate")).format("DD-MM-YYYY"),
      });

      let apiBodyToSend = {
        strFromDate: sendFromDate,
      };
      setLoading(true);
      axios
        .post(`${urls.RTI}/report/getVivaranPatra02`, apiBodyToSend, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  wardname: r.wardname,
                  strFromDate: r.strFromDate,
                  toDateStr: r.toDateStr,
                  sumLastMonthPendingAndreportingMonthReceived:r.sumLastMonthPendingAndreportingMonthReceived,
                  informationDelivered: r.informationDelivered,
                  informationRejected: r.informationRejected,
                  pendingApplicationCount: r.pendingApplicationCount,
                  reportingMonthApplicationClearance:
                    r.reportingMonthApplicationClearance,
                  reportingMonthReceived: r.reportingMonthReceived,
                  officeLocation: r.officeLocation,
                  officeLocationMr: r.officeLocationMr,
                  lastMonthPendingApplication: r.lastMonthPendingApplication,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Department Name": r.officeLocation,
                  "Last Month Pending Appeal Count":
                    r.lastMonthPendingApplication,
                  "In Reporting Month's received appeal count":
                    r.reportingMonthReceived,
                    "In Reporting Month's received appeal count":r.sumLastMonthPendingAndreportingMonthReceived,

                  "In Reporting Month's appeal clearance count":
                    r.reportingMonthApplicationClearance,
                  "Appeal Accepted Count": r.informationDelivered,
                  "Appeal Rejected Count": r.informationRejected,
                  "Pending Appeal Count": r.pendingApplicationCount,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  "	कार्यालयाचे स्थान": r.officeLocationMr,
                  "मागिल महिन्यातील थकीत अपिलांची संख्या":
                    r.lastMonthPendingApplication,
                  "अहवालाच्या महिन्यात प्राप्त झालेल्या अपिलांची संख्या":
                    r.reportingMonthReceived,
                    'एकूण अपिलांची संख्या':r.sumLastMonthPendingAndreportingMonthReceived,

                  "निकाली अपिलांची संख्या":
                    r.reportingMonthApplicationClearance,
                  "विनंती मान्य केलेल्या अपिलांची संख्या": r.informationDelivered,
                  "नाकारलेल्या अपिलांची संख्या": r.informationRejected,
                  "प्रलंबित अपिलांची संख्या": r.pendingApplicationCount,
                }))
              );
              setLoading(false);
            } else {
              sweetAlert({
                title: language == "en" ? "Oops!" : "क्षमस्व!",
                text:
                  language == "en"
                    ? "There is nothing to show you!"
                    : "तुम्हाला दाखवण्यासारखे काही नाही!",
                icon: "warning",
                dangerMode: false,
                closeOnClickOutside: false,
                button: language === "en" ? "Ok" : "ठीक आहे",
              });
              setData([]);
              setEngReportsData([]);
              setMrReportsData([]);
              setLoading(false);
            }
          } else {
            setData([]);
            setEngReportsData([]);
            setMrReportsData([]);
            sweetAlert(
              language == "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setLoading(false);
          }
        })
        .catch((err) => {
          setData([]);
          setEngReportsData([]);
          setMrReportsData([]);
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      sweetAlert({
        title: language == "en" ? "Oops!" : "क्षमस्व!",
        text:
          language == "en"
            ? " Month and Year Are Required!"
            : "महिना आणि वर्ष आवश्यक आहेत!",
        icon: "warning",
        dangerMode: false,
        closeOnClickOutside: false,
        button: language === "en" ? "Ok" : "ठीक आहे",
      });
      setData([]);
      setEngReportsData([]);
      setMrReportsData([]);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: language == "en" ? "Sr.No" : "अ.क्र.",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "officeLocation" : "officeLocationMr",
      headerName: language == "en" ? "Department Name" : "विभागाचे नांव",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "lastMonthPendingApplication",
      headerName:
        language == "en"
          ? "Last Month Pending Appeal Application Count"
          : "मागिल महिन्यातील थकीत अपिलांची संख्या",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reportingMonthReceived",
      headerName:
        language == "en"
          ? "In Reporting Month's received appeal count"
          : "अहवालाच्या महिन्यात प्राप्त झालेल्या अपिलांची संख्या",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "sumLastMonthPendingAndreportingMonthReceived",
      headerName:
        language == "en"
          ? "In Reporting Month's total appeal count"
          : "एकूण अपिलांची संख्या",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reportingMonthApplicationClearance",
      headerName:
        language == "en"
          ? "In Reporting Month's appeal clearance count"
          : "निकाली अपिलांची संख्या",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "informationDelivered",
      headerName:
        language == "en" ? "Appeal Accepted Count" : "विनंती मान्य केलेल्या अपिलांची संख्या",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "informationRejected",
      headerName:
        language == "en" ? "Appeal Rejected Count" : "नाकारलेल्या अपिलांची संख्या",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pendingApplicationCount",
      headerName:
        language == "en" ? "Pending Appeal Count" : "प्रलंबित अपिलांची संख्या",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    const fileName = language == "en" ? "Vivaran Patra_02" : "विवरण पत्र_०२";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A8" });
    const boldFont = { bold: true };
    const fontSize = 16;
    const headerStyle = {
      font: { ...boldFont, size: fontSize },
    };
    const dataStyle = {
      font: { ...boldFont, size: fontSize },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const columnWidths = columns.map((column) => column.headerName.length);
    columns.forEach((column, index) => {
      const cell = XLSX.utils.encode_cell({ r: 7, c: index });
      ws[cell] = {
        t: "s",
        v: column.headerName,
        s: headerStyle,
      };

      const columnWidth = (columnWidths[index] + 2) * 10;
      if (!ws["!cols"]) ws["!cols"] = [];
      ws["!cols"][index] = { wpx: columnWidth };
    });
    ws.D1 = {
      t: "s",
      v:
        language == "en"
          ? "Pimpri-Chinchwad Municipal Corporation"
          : "पिंपरी-चिंचवड महानगरपालिका",
      s: dataStyle,
    };
    ws.D2 = {
      t: "s",
      v:
        language == "en"
          ? "Mumbai-Pune Road, Pimpri - 411018"
          : "मुंबई-पुणे रोड, पिंपरी - ४११ ०१८",
      s: dataStyle,
    };
    ws.D3 = {
      t: "s",
      v:
        language == "en"
          ? `Department Name: RTI Online System`
          : `विभागाचे नाव: महितीचा अधिकार प्रणाली`,
      s: dataStyle,
    };
    ws.D4 = {
      t: "s",
      v:
        language == "en"
          ? `Report Name:  Vivaran Patra_02`
          : `अहवालाचे नाव: विवरण पत्र_०२`,
      s: dataStyle,
    };
    ws.D5 = {
      t: "s",
      v:
        language == "en"
          ? `Month and Year:${dateObj?.from}`
          : `महिना आणि वर्ष:${dateObj?.from}`,
      s: dataStyle,
    };
    // ws.D6 = {
    //   t: "s",
    //   v:
    //     language == "en"
    //       ? `To Date: ${dateObj?.to}`
    //       : `तारखेपर्यंत: ${dateObj?.to}`,
    //   s: dataStyle,
    // };

    const wb = { Sheets: { [fileName]: ws }, SheetNames: [fileName] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }

  return (
    <ThemeProvider theme={theme}>
      <BreadcrumbComponent />
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
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="vivaranPatra02" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} style={{ margin: "10px", width: "80%" }}>
            <form onSubmit={handleSubmit(onSubmitFunc)}>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            // inputFormat="MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="selectMonthYr" />
                              </span>
                            }
                            views={["month", "year"]}
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.toDate}
                  >
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            minDate={watch("fromDate")}
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDateR" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
              </Grid>
              <Grid
                container
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      type="submit"
                      size="small"
                      variant="contained"
                      color="success"
                      endIcon={<ArrowUpwardIcon />}
                    >
                      {<FormattedLabel id="submit" />}
                    </Button>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      size="small"
                      variant="contained"
                      color="success"
                      endIcon={<DownloadIcon />}
                      onClick={() =>
                        language == "en"
                          ? generateCSVFile(engReportsData)
                          : generateCSVFile(mrReportsData)
                      }
                    >
                      {<FormattedLabel id="downloadEXCELL" />}
                    </Button>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      size="small"
                      variant="contained"
                      color="success"
                      endIcon={<DownloadIcon />}
                      onClick={() => handlePrint()}
                    >
                      {<FormattedLabel id="downloadPDF" />}
                    </Button>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      type="button"
                      size="small"
                      variant="contained"
                      color="error"
                      endIcon={<ClearIcon />}
                      onClick={onCancel}
                    >
                      {<FormattedLabel id="cancel" />}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </Paper>
          {loading ? (
            <CommonLoader />
          ) : data.length !== 0 ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <RTIReportLayout
                componentRef={componentRef}
                rows={data ? data : []}
                columns={columns}
                // showDates={true}
                date={dateObj}
                vivaranPatra={true}
              />
            </div>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
