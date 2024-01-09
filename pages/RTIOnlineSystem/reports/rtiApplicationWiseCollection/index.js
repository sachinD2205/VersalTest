import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import "jspdf-autotable";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useReactToPrint } from "react-to-print";
import RTIReportLayout from "../../../../containers/reuseableComponents/RTIReportLayout";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
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
    setValue,
    formState: { errors },
  } = useForm({});
  let user = useSelector((state) => state.user.user);

  const router = useRouter();

  const currDate = new Date();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const language = useSelector((store) => store.labels.language);
  const [services] = useState([
    {
      id: 103,
      serviceEn: "RTI Application",
      serviceMr: "आरटीआय अर्ज",
    },
    {
      id: 104,
      serviceEn: "RTI Appeal",
      serviceMr: "आरटीआय अपील",
    },
  ]);

  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const [dateObj, setDateObj] = useState({
    from: "",
    to: "",
  });

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
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    setValue("service", "");
  };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en"
        ? "RTI Application Wise Collection"
        : "आरटीआय अर्जानुसार संकलन",
  });

  //////////////////////////////////
  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate") && watch("service")) {
      let sendFromDate = moment(watch("fromDate")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DD HH:mm:ss");

      setDateObj({
        from: moment(watch("fromDate")).format("DD-MM-YYYY"),
        to: moment(watch("toDate")).format("DD-MM-YYYY"),
      });

      let apiBodyToSend = {
        service: watch("service") ? watch("service") : null,
        strFromDate: sendFromDate,
        strToDate: sendToDate,
      };
      setLoading(true);
      axios
        .post(
          `${urls.RTI}/report/getApplicationWiseCollection`,
          apiBodyToSend,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  strFromDate: moment(r.strFromDate)?.format("DD-MM-YYYY"),
                  strToDate: moment(r.strToDate)?.format("DD-MM-YYYY"),
                  totalApplication: r.totalApplication,
                  serviceId: r.serviceId,
                  serviceName: newFunctionForServiceName(r.serviceId, "en"),
                  serviceNameMr: newFunctionForServiceName(r.serviceId, "mr"),
                  deptName: newFunctionForNullValues("en", r.deptName),
                  deptNameMr: newFunctionForNullValues("en", r.deptNameMr),
                  serviceAcceptanceCharges: r.serviceAcceptanceCharges,
                  serviceCharges: r.serviceCharges,
                  collectedAmount: r.collectedAmount,
                  grandTotal: r.serviceCharges + r.serviceAcceptanceCharges,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Department Name": newFunctionForNullValues("en", r.deptName),
                  "Service Name": newFunctionForServiceName(r.serviceId, "en"),
                  "Service Charges": r.serviceCharges,
                  "Service Acceptance Charges": r.serviceAcceptanceCharges,
                  "Received Amount": r.collectedAmount,
                  "Grand Total": r.serviceCharges + r.serviceAcceptanceCharges,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  "विभागाचे नाव": newFunctionForNullValues("en", r.deptNameMr),
                  "सेवेचे नाव": newFunctionForServiceName(r.serviceId, "mr"),
                  "सेवा शुल्क": r.serviceCharges,
                  "सेवा स्वीकृती शुल्क": r.serviceAcceptanceCharges,
                  "प्राप्त रक्कम": r.collectedAmount,
                  एकूण: r.serviceCharges + r.serviceAcceptanceCharges,
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
            ? "Both Dates Are Required!"
            : "दोन्ही तारखा आवश्यक आहेत!",
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

  ///////////////////////////
  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available";
    } else {
      return value ? value : "उपलब्ध नाही";
    }
  };
  ///////////////////////////
  const newFunctionForServiceName = (sId, lang) => {
    if (sId === 103) {
      if (lang == "en") {
        return "RTI Application";
      } else {
        return "आरटीआय अर्ज";
      }
    } else if (sId === 104) {
      if (lang == "en") {
        return "RTI Appeal";
      } else {
        return "आरटीआय अपील";
      }
    }
  };

  const columns = [
    {
      field: "id",
      headerName: language == "en" ? "Sr.No" : "अ.क्र.",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "deptName" : "deptNameMr",
      headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
      width: 300,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerName: language == "en" ? "Service Name" : "सेवेचे नाव",
      width: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "serviceCharges",
      headerName: language == "en" ? "Service Charges" : "सेवा शुल्क",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "serviceAcceptanceCharges",
      headerName:
        language == "en" ? "Service Acceptance Charges" : "सेवा स्वीकृती शुल्क",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "collectedAmount",
      headerName: language == "en" ? "Received Amount" : "प्राप्त रक्कम",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "grandTotal",
      headerName: language == "en" ? "Grand Total" : "एकूण",
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
    const fileName =
      language == "en"
        ? "RTI Application Wise Collection"
        : "आरटीआय अर्जानुसार संकलन";
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
          ? `Report Name: RTI Application Wise Collection`
          : `अहवालाचे नाव: आरटीआय अर्जानुसार संकलन`,
      s: dataStyle,
    };
    ws.D5 = {
      t: "s",
      v:
        language == "en"
          ? `From Date: ${dateObj?.from}`
          : `तारखेपासून: ${dateObj?.from}`,
      s: dataStyle,
    };
    ws.D6 = {
      t: "s",
      v:
        language == "en"
          ? `To Date: ${dateObj?.to}`
          : `तारखेपर्यंत: ${dateObj?.to}`,
      s: dataStyle,
    };

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
                <FormattedLabel id="appWiseCollection" />
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
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <FormControl>
                    <InputLabel>
                      <FormattedLabel id="serviceName" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          variant="standard"
                          sx={{ width: "350px" }}
                          fullWidth
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id="serviceName" required/>}
                        >
                          {services &&
                            services.map((service, index) => (
                              <MenuItem key={index} value={service.id}>
                                {language == "en"
                                  ? service.serviceEn
                                  : service?.serviceMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="service"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>
              </Grid>
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
                  <FormControl>
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDateR" required/>
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
                  </FormControl>
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
                  <FormControl>
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDateR" required/>
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
                            minDate={watch("fromDate")}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </FormControl>
                </Grid>
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
                      size="small"
                      type="submit"
                      disabled={!watch("service")}
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
                      size="small"
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<ListAltIcon />}
                      onClick={() =>
                        language == "en"
                          ? generateCSVFile(engReportsData)
                          : generateCSVFile(mrReportsData)
                      }
                    >
                      {language == "en"
                        ? "Download Excel"
                        : "एक्सेल डाउनलोड करा"}
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
                      size="small"
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<PictureAsPdfIcon />}
                      onClick={() => handlePrint()}
                    >
                      {language == "en" ? "Download Pdf" : "पीडीएफ डाउनलोड करा"}
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
                      size="small"
                      type="button"
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
                showDates={true}
                date={dateObj}
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
