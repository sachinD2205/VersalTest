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
import React, { useRef, useState, useEffect } from "react";
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
  const [data, setData] = useState([]);
  const currDate = new Date();
  const [loading, setLoading] = useState(false);
  const language = useSelector((store) => store.labels.language);

  const router = useRouter();

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
  };
  let user = useSelector((state) => state.user.user);

  const [isLargeScreen, setIsLargeScreen] = useState(false);

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
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en" ? "RTI Application Register" : "आरटीआय अर्ज नोंदणी",
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
        .post(`${urls.RTI}/report/getRTIApplicationRegister`, apiBodyToSend, {
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
                  fullName:
                    r.applicantFirstName +
                    " " +
                    r.applicantMiddlename +
                    " " +
                    r.applicantLastName,
                  address: r.address,
                  bplCardNumber: r.bplCardNumber,
                  contactDetails: r.contactDetails,
                  deptName: r.deptName,
                  deptNameMr: r.deptNameMr,
                  descriptioniOfInformationRequired:
                    r.descriptioniOfInformationRequired,
                  education: r.education,
                  emailId: r.emailId,
                  gender:
                    (r.gender == 1 && "Male") ||
                    (r.gender == 2 && "Female") ||
                    (r.gender == 3 && "Other"),
                  genderMr:
                    (r.gender == 1 && "पुरुष") ||
                    (r.gender == 2 && "स्त्री") ||
                    (r.gender == 3 && "इतर"),
                  informationSubject: r.informationSubject,
                  isApplicantBPL:
                    (r.isApplicantBPL == "t" && "YES") ||
                    (r.isApplicantBPL == "f" && "NO"),
                  isApplicantBPLMr:
                    (r.isApplicantBPL == "t" && "होय") ||
                    (r.isApplicantBPL == "f" && "नाही"),
                  issuingAuthority: r.issuingAuthority,
                  periodOfRelatedInformation: r.periodOfRelatedInformation,
                  pinCode: r.pinCode,
                  wardName: r.wardName,
                  yearOfIssue: r.yearOfIssue,
                  officeLocation: r.officeLocation,
                  officeLocationMr: r.officeLocationMr,
                  requiredInformationByPostOrPersonallly:
                    r.requiredInformationByPostOrPersonallly,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Office Location": r.officeLocation,
                  "Department Name": r.deptName,
                  "Full Name":
                    r.applicantFirstName +
                    " " +
                    r.applicantMiddlename +
                    " " +
                    r.applicantLastName,
                  Gender:
                    (r.gender == 1 && "Male") ||
                    (r.gender == 2 && "Female") ||
                    (r.gender == 3 && "Other"),
                  Address: r.address,
                  PinCode: r.pinCode,
                  "Contact Details": r.contactDetails,
                  "Email Id": r.emailId,
                  Education: r.education,
                  "Is Applicant BPL":
                    (r.isApplicantBPL == "t" && "YES") ||
                    (r.isApplicantBPL == "f" && "NO"),
                  "BPL Card Number": r.bplCardNumber,
                  "Year Of Issue": r.yearOfIssue,
                  "Issuing Authority": r.issuingAuthority,
                  "Period Of Related Information": r.periodOfRelatedInformation,
                  "Description Of Information Required":
                    r.descriptioniOfInformationRequired,
                  "Required Information By Post Or Personally":
                    r.requiredInformationByPostOrPersonallly,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  "कार्यालयाचे स्थान": r.officeLocationMr,
                  "	विभागाचे नाव": r.deptNameMr,
                  "	पूर्ण नाव":
                    r.applicantFirstName +
                    " " +
                    r.applicantMiddlename +
                    " " +
                    r.applicantLastName,

                  लिंग:
                    (r.gender == 1 && "पुरुष") ||
                    (r.gender == 2 && "स्त्री") ||
                    (r.gender == 3 && "इतर"),
                  पत्ता: r.address,
                  "पिन कोड": r.pinCode,
                  "संपर्काची माहिती": r.contactDetails,
                  "ई-मेल आयडी": r.emailId,
                  "शैक्षणिक स्थिती": r.education,
                  "अर्जदार बीपीएल आहे":
                    (r.isApplicantBPL == "t" && "होय") ||
                    (r.isApplicantBPL == "f" && "नाही"),
                  "बीपीएल कार्ड क्रमांक": r.bplCardNumber,
                  "कार्ड वितरीत वर्ष": r.yearOfIssue,
                  "कार्ड मान्यता अधिकारी यांचे नाव": r.issuingAuthority,
                  "कालावधी संबंधित माहिती": r.periodOfRelatedInformation,
                  "आवश्यक माहितीचे वर्णन": r.descriptioniOfInformationRequired,
                  "पोस्टाने किंवा वैयक्तिकरित्या आवश्यक माहिती":
                    r.requiredInformationByPostOrPersonallly,
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

  const columns = [
    {
      field: "id",
      headerName: language == "en" ? "Sr.No" : "अ. क्र.",
      width: 5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "officeLocation" : "officeLocationMr",
      headerName: language == "en" ? "Office Location" : "कार्यालयाचे स्थान",
      width: 100,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "deptName" : "deptNameMr",
      headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
      width: 80,
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: language == "en" ? "Full Name" : "पूर्ण नाव",
      width: 80,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "gender" : "genderMr",
      headerName: language == "en" ? "Gender" : "लिंग",
      width: 30,
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: language == "en" ? "Address" : "पत्ता",
      width: 100,
      headerAlign: "center",
    },
    {
      field: "pinCode",
      headerName: language == "en" ? "Pin Code" : "पिन कोड",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "contactDetails",
      headerName: language == "en" ? "Contact Details" : "संपर्काची माहिती",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "emailId",
      headerName: language == "en" ? "Email Id" : "ई-मेल आयडी",
      width: 100,
      headerAlign: "center",
    },
    {
      field: "education",
      headerName: language == "en" ? "Education" : "शैक्षणिक स्थिती",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "isApplicantBPL" : "isApplicantBPLMr",
      headerName: language == "en" ? "Is Applicant BPL" : "अर्जदार बीपीएल आहे",
      width: 30,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bplCardNumber",
      headerName: language == "en" ? "BPL Card Number" : "बीपीएल कार्ड क्रमांक",
      width: 80,
      headerAlign: "center",
    },
    {
      field: "yearOfIssue",
      headerName: language == "en" ? "Year of Issues" : "कार्ड वितरीत वर्ष",
      width: 30,
      headerAlign: "center",
    },
    {
      field: "issuingAuthority",
      headerName:
        language == "en"
          ? "Issuing Authority"
          : "कार्ड मान्यता अधिकारी यांचे नाव",
      width: 100,
      headerAlign: "center",
    },
    {
      field: "periodOfRelatedInformation",
      headerName:
        language == "en"
          ? "Period Of Related Information"
          : "कालावधी संबंधित माहिती",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "descriptioniOfInformationRequired",
      headerName:
        language == "en"
          ? "Description Of Information Required"
          : "आवश्यक माहितीचे वर्णन",
      width: 100,
      headerAlign: "center",
    },
    {
      field: "requiredInformationByPostOrPersonallly",
      headerName:
        language == "en"
          ? "Required Information By Post Or Personallly"
          : "पोस्टाने किंवा वैयक्तिकरित्या आवश्यक माहिती",
      width: 100,
      headerAlign: "center",
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    const fileName =
      language == "en" ? "RTI Application Register" : "आरटीआय अर्ज नोंदणी";
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
          ? `Report Name: RTI Application Register`
          : `अहवालाचे नाव: आरटीआय अर्ज नोंदणी`,
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
                <FormattedLabel id="rtiApplicationRegister" />
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
                      onClick={() => generateCSVFile(data)}
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
                      variant="contained"
                      color="success"
                      size="small"
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
            // style={
            //   isLargeScreen
            //     ? { display: "flex", justifyContent: "center" }
            //     : { textAlign: "center" }
            // }
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></div>
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
