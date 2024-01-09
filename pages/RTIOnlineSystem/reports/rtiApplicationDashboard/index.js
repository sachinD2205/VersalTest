import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  Tooltip,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useRef, useState } from "react";
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
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import "jspdf-autotable";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import RTIReportLayout from "../../../../containers/reuseableComponents/RTIReportLayout";
import { useReactToPrint } from "react-to-print";
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
    formState: { errors },
  } = useForm({});

  const router = useRouter();

  const [data, setData] = useState([]);
  const currDate = new Date();
  const [loading, setLoading] = useState(false);
  const language = useSelector((store) => store.labels.language);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [statusAll, setStatus] = useState([]);
  let user = useSelector((state) => state.user.user);

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

  useEffect(() => {
    getAllStatus();
  }, []);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en" ? "RTI Application Dashboard" : "आरटीआय अर्ज डॅशबोर्ड",
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

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      let sendFromDate = moment(watch("fromDate")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DD HH:mm:ss");

      setDateObj({
        from: moment(watch("fromDate")).format("DD-MM-YYYY"),
        to: moment(watch("toDate")).format("DD-MM-YYYY"),
      });

      let apiBodyToSend = {
        strFromDate: sendFromDate,
        strToDate: sendToDate,
      };
      setLoading(true);
      axios
        .post(`${urls.RTI}/report/getRTIApplicationDashboard`, apiBodyToSend, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setApplicationDetails(res.data);
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
          // sweetAlert(error);
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

  useEffect(() => {
    if (applicationDetails != null) {
      setOnUI();
    }
  }, [applicationDetails, language]);

  const setOnUI = () => {
    let res = applicationDetails;
    setData(
      res?.map((r, i) => ({
        id: i + 1,
        serialNumber: r.serialNumber,
        applicantName: r.applicantName,
        applicationDate:
          r.applicationDate == null
            ? "-"
            : moment(r.applicationDate).format("DD-MM-YYYY"),
        systemEntryDate:
          r.systemEntryDate == null
            ? "-"
            : moment(r.systemEntryDate).format("DD-MM-YYYY"),
        currentStatus: manageStatus(r.currentStatus, language, statusAll),
        subjectName: r.subjectName,
        requiredInfoPurpose: r.requiredInfoPurpose,
        ward: r.ward,
        officeLocation: r.officeLocation,
        officeLocationMr: r.officeLocationMr,
        challanNo: r.challanNo,
        receiptNo: r.receiptNo,
      }))
    );

    setEngReportsData(
      res?.map((r, i) => ({
        "Sr.No": i + 1,
        "Application NUmber": r.serialNumber,
        "Applicant Name": r.applicantName,
        "Office Location": r.officeLocation,
        "Application Date":
          r.applicationDate == null
            ? "-"
            : moment(r.applicationDate).format("DD-MM-YYYY"),
        "Challan Number": r.challanNo,
        "Receipt Number": r.receiptNo,
        "System Entry Date":
          r.systemEntryDate == null
            ? "-"
            : moment(r.systemEntryDate).format("DD-MM-YYYY"),
        "Required Info Purpose": r.requiredInfoPurpose,
        "Current Status": manageStatus(r.currentStatus, language, statusAll),
      }))
    );

    setMrReportsData(
      res?.map((r, i) => ({
        "अ.क्र.": i + 1,
        "अर्ज क्रमांक": r.serialNumber,
        "अर्जदाराचे नाव": r.applicantName,
        "कार्यालयाचे स्थान": r.officeLocation,
        "अर्जाची तारीख":
          r.applicationDate == null
            ? "-"
            : moment(r.applicationDate).format("DD-MM-YYYY"),
        "चलन क्र": r.challanNo,
        "पावती क्र": r.receiptNo,
        "सिस्टम एंट्रीची तारीख":
          r.systemEntryDate == null
            ? "-"
            : moment(r.systemEntryDate).format("DD-MM-YYYY"),
        "ज्यासाठी माहिती आवश्यक आहे ते प्रयोजन": r.requiredInfoPurpose,
        "वर्तमान स्थिती": manageStatus(r.currentStatus, language, statusAll),
      }))
    );
  };

  const columns = [
    {
      field: "id",
      headerName: language == "en" ? "Sr.No" : "अ.क्र.",
      headerAlign: "center",
      width: 40,
      align: "center",
    },
    {
      field: "serialNumber",
      headerName: language == "en" ? "Application Number" : "अर्ज क्रमांक",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicantName",
      headerName: language == "en" ? "Full Name" : "पूर्ण नाव",
      width: 200,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "officeLocation" : "officeLocationMr",
      headerName: language == "en" ? "Office Location" : "कार्यालयाचे स्थान",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: language == "en" ? "Application Date" : "अर्जाची तारीख",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "challanNo",
      headerName: language == "en" ? "Challan No" : "चलन क्र",
      width: 100,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "receiptNo",
      headerName: language == "en" ? "Receipt No" : "पावती क्र",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "systemEntryDate",
      headerName:
        language == "en" ? "System Entry Date" : "सिस्टम एंट्रीची तारीख",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "requiredInfoPurpose",
      headerName:
        language == "en"
          ? "Required Information Purpose"
          : "ज्यासाठी माहिती आवश्यक आहे ते प्रयोजन",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "currentStatus",
      headerName: language == "en" ? "Current Status" : "वर्तमान स्थिती",
      width: 150,
      headerAlign: "center",
      align: "left",
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    const fileName =
      language == "en" ? "RTI Application Dashboard" : "आरटीआय अर्ज डॅशबोर्ड";
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
          ? `Report Name: RTI Application Dashboard`
          : `अहवालाचे नाव: आरटीआय अर्ज डॅशबोर्ड`,
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
                <FormattedLabel id="rtiApplicationDashboard" />
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
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDateR" required />
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
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText>
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
                                <FormattedLabel id="toDateR" required />
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
