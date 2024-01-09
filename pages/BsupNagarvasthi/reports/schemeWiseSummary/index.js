import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
// import styles from "./view.module.css";
import styles from "./view.module.css";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DetailsIcon from "@mui/icons-material/Details";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const schema = yup.object().shape({
    strToDate: yup
      .date()
      .nullable()
      .required(<FormattedLabel id="bachatgatToDate" />),
    strFromDate: yup
      .date()
      .nullable()
      .required(<FormattedLabel id="bachatgatFromDate" />),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [data, setData] = useState([]);
  const currDate = new Date();
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const language = useSelector((store) => store.labels.language);
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [dateObj, setDateObj] = useState();
  const [isSubScheme, setIsSubScheme] = useState(false);
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);

  const componentRef = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const loggedUser = localStorage.getItem("loggedInUser");

  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

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
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en" ? "Scheme Wise Summary" : "योजना निहाय सारांश",
  });

  useEffect(() => {
    getAllMainSchemes();
  }, []);

  useEffect(() => {
    if (watch("strMainSchemeKeys") !== "all") {
      getSubSchemes();
    } else {
      getAllSubSchemes();
    }
    setValue("strSubSchemeKeys", "");
  }, [watch("strMainSchemeKeys")]);

  const getAllMainSchemes = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: null,
        },
        headers: headers,
      })
      .then(async (r) => {
        let result = r.data.mstMainSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              schemeName: r.schemeName ? r.schemeName : "-",
            };
          });
        setMainNames([..._res]);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAllSubSchemes = async (_pageSize = 10, _pageNo = 0) => {
    await axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: null,
        },
        headers: headers,
      })
      .then((r) => {
        setSubSchemeNames([
          { id: "all", subSchemeName: "All" }, // Add "All" option as the default value
          ...r.data.mstSubSchemesList.map((row) => ({
            id: row.id,
            subSchemeName: row.subSchemeName,
            subSchemeNameMr: row.subSchemeNameMr,
          })),
        ]);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getSubSchemes = async (_pageSize = 10, _pageNo = 0) => {
    if (watch("getAllByMainSchemeKey")) {
      await axios
        .get(
          `${
            urls.BSUPURL
          }/mstSubSchemes/getAllByMainSchemeKey?mainSchemeKey=${watch(
            "strMainSchemeKeys"
          )}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setSubSchemeNames(
            r.data.mstSubSchemesList.map((row) => ({
              id: row.id,
              subSchemeName: row.subSchemeName,
              subSchemeNameMr: row.subSchemeNameMr,
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  let resetValuesCancell = {
    strFromDate: null,
    strToDate: null,
    strMainSchemeKeys: null,
    strSubSchemeKeys: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    setData([]);
  };

  ///////////// On submit method ////////////////////
  const onSubmitFunc = (formData) => {
    if (watch("strFromDate") && watch("strToDate")) {
      let sendFromDate = moment(watch("strFromDate")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let sendToDate = moment(watch("strToDate")).format("YYYY-MM-DD HH:mm:ss");

      setDateObj({
        from: moment(watch("strFromDate")).format("DD-MM-YYYY"),
        to: moment(watch("strToDate")).format("DD-MM-YYYY"),
      });

      if (watch("strSubSchemeKeys") === "") {
        setIsSubScheme(false);
      } else {
        setIsSubScheme(true);
      }
      let apiBodyToSend = {
        ...formData,
        strFromDate: sendFromDate,
        strToDate: sendToDate,
        strSubSchemeKeys:
          formData.strSubSchemeKeys === "all"
            ? subSchemeNames
                .filter((obj) => obj.id != "all")
                .map((r) => r.id)
                .join(",")
            : formData.strSubSchemeKeys,
      };

      if (formData.strMainSchemeKeys === "all") {
        // If "All" option is selected, send all main scheme IDs separated by commas
        const allMainSchemeIds = mainNames.map((r) => r.id).join(",");
        apiBodyToSend.strMainSchemeKeys = allMainSchemeIds;
        apiBodyToSend.strFromDate = sendFromDate;
        apiBodyToSend.strToDate = sendToDate;

        // delete apiBodyToSend.strSubSchemeKeys;
      }

      axios
        .post(
          `${urls.BSUPURL}/report/getSchemeWiseSummaryReport`,
          apiBodyToSend,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setLoading(true);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // applicationDate: r.applicationDate,
                  mainSchemeName: r.mainSchemeName,
                  subSchemeName: r.subSchemeName,
                  mainSchemeNameMr: r.mainSchemeNameMr,
                  subSchemeNameMr: r.subSchemeNameMr,
                  totalApplications: r.totalApplications,
                  rejectedApplications: r.rejectedApplications,
                  approvedApplications: r.approvedApplications,
                  benefitedApplications: r.benefitedApplications,
                  benefitRejectedApplications: r.benefitRejectedApplications,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,

                  "Main Scheme Name": r.mainSchemeName,
                  // "Sub Scheme Name": r.subSchemeName,
                  "Total Applications": r.totalApplications,
                  "Rejected Applications": r.rejectedApplications,
                  "Approved Applications": r.approvedApplications,
                  "Benefited Applications": r.benefitedApplications,
                  "Benefit Rejected Applications":
                    r.benefitRejectedApplications,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,

                  "मुख्य योजनेचे नाव": r.mainSchemeNameMr,
                  // "उप योजनेचे नाव": r.subSchemeNameMr,
                  "एकूण अर्ज": r.totalApplications,
                  "नाकारलेले अर्ज": r.rejectedApplications,
                  "मंजूर केलेले अर्ज": r.approvedApplications,
                  "लाभलेले अर्ज": r.benefitedApplications,
                  "लाभ नाकारलेले अर्ज": r.benefitRejectedApplications,
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
                button: language === "en" ? "Ok" : "ठीक आहे",
                dangerMode: false,
                closeOnClickOutside: false,
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
        .catch((error) => {
          setData([]);
          setEngReportsData([]);
          setMrReportsData([]);
          // sweetAlert(error);
          setLoading(false);
          cfcErrorCatchMethod(error, false);
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

  const columnsWithoutSubScheme = [
    {
      field: "id",
      headerName: language == "en" ? "Sr.No" : "अ.क्र.",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mainSchemeName",
      headerName: language == "en" ? "Main Scheme Name" : "मुख्य योजनेचे नाव",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalApplications",
      headerName: language == "en" ? "Total Applications" : "एकूण अर्ज",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rejectedApplications",
      headerName: language == "en" ? "Rejected Applications" : "नाकारलेले अर्ज",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "approvedApplications",
      headerName:
        language == "en" ? "Approved Applications" : "मंजूर केलेले अर्ज",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benefitedApplications",
      headerName: language == "en" ? "Benefited Applications" : "लाभलेले अर्ज",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benefitRejectedApplications",
      headerName:
        language == "en"
          ? "Benefit Rejected Applications"
          : "लाभ नाकारलेले अर्ज",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
  ];
  const columns = [
    {
      field: "id",
      // headerName: <FormattedLabel id="srNo" />,
      headerName: language == "en" ? "Sr.No" : "अ.क्र.",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mainSchemeName",
      headerName: language == "en" ? "Main Scheme Name" : "मुख्य योजनेचे नाव",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "subSchemeName",
    //   headerName: language == "en" ? "Sub Scheme Name" : "उप योजनेचे नाव",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "totalApplications",
      headerName: language == "en" ? "Total Applications" : "एकूण अर्ज",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rejectedApplications",
      headerName: language == "en" ? "Rejected Applications" : "नाकारलेले अर्ज",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "approvedApplications",
      headerName:
        language == "en" ? "Approved Applications" : "मंजूर केलेले अर्ज",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benefitedApplications",
      headerName: language == "en" ? "Benefited Applications" : "लाभलेले अर्ज",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benefitRejectedApplications",
      headerName:
        language == "en"
          ? "Benefit Rejected Applications"
          : "लाभ नाकारलेले अर्ज",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
  ];

  function generateCSVFile(data) {
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    // const headerColumns = columns.map((c) => c.headerName);
    const fileName =
      language == "en" ? "Scheme Wise Summary" : "योजना निहाय सारांश";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    // const ws = XLSX.utils.json_to_sheet(data,{header: headerColumns});
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A8" });
    // const ws = XLSX.utils.sheet_add_aoa(ws0,);
    const boldFont = { bold: true };
    const fontSize = 16;
    const headerStyle = {
      font: { ...boldFont, size: fontSize },
      // alignment: { horizontal: "center", vertical: "center" },
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
          ? `Department Name: Samaj Vikas Department`
          : `विभागाचे नाव: समाज विकास विभाग`,
      s: dataStyle,
    };
    ws.D4 = {
      t: "s",
      v:
        language == "en"
          ? `Report Name: Scheme Wise Summary`
          : `अहवालाचे नाव: योजना निहाय सारांश`,
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

    // const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } }];
    // ws["!merges"] = merge;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }

  ////////////////// PDF DOWNLOAD /////////////////////////
  function generatePDF(data) {
    const columnsData = columns.map((c) => c.headerName);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));
    const doc = new jsPDF();
    const autoTableConfig = {
      startY: 10,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 8,
      },
      columnStyles: {
        0: { columnWidth: 10 },
        1: { columnWidth: 15 },
        2: { columnWidth: 15 },
        3: { columnWidth: 15 },
        4: { columnWidth: 15 },
        5: { columnWidth: 15 },
        6: { columnWidth: 15 },
        7: { columnWidth: 15 },
      },
      margin: { top: 20, right: 10, bottom: 10, left: 10 },
      autoSize: {
        tableWidth: "wrap",
      },
    };

    doc.autoTable(columnsData, rowsData, autoTableConfig);
    doc.save(
      language == "en" ? "Scheme Wise Summary.pdf" : "योजना निहाय सारांश.pdf"
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        style={{
          margin: "30px",
        }}
      >
        <Box style={{ padding: "8px" }}>
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
                <FormattedLabel id="schemeWiseSummaryHeading" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
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
                  padding: "2rem",
                }}
              >
                {/* ///////////////////// */}

                {/* main scheme dropdown */}
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl
                    // error={errors.mainSchemeKeyValidation}
                    variant="standard"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="mainScheme" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          selected={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          <MenuItem id="all" value="all">
                            All
                          </MenuItem>
                          {mainNames &&
                            mainNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.schemeName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="strMainSchemeKeys"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl
                    variant="standard"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="subScheme" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {subSchemeNames &&
                            subSchemeNames.map((auditorium, index) => (
                              <MenuItem
                                key={index}
                                value={auditorium.id}
                                disabled={
                                  watch("strMainSchemeKeys") === "all" &&
                                  auditorium.id !== "all"
                                }
                              >
                                {auditorium.subSchemeName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="strSubSchemeKeys"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.strFromDate}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <Controller
                      control={control}
                      name="strFromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDate" required />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
                      {errors?.strFromDate ? errors.strFromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.strToDate}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <Controller
                      control={control}
                      name="strToDate"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            minDate={watch("strFromDate")}
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDate" required />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
                      {errors?.strToDate ? errors.strToDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Buttons Section */}
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
                {/* Submit Button */}
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
                      variant="contained"
                      // className={commonStyles.buttonSubmit}
                      color="success"
                      endIcon={<ArrowUpwardIcon />}
                    >
                      {<FormattedLabel id="submit" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* Download Button */}
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
                      disabled={engReportsData?.length > 0 ? false : true}
                      type="button"
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
                      variant="contained"
                      color="success"
                      endIcon={<DownloadIcon />}
                      onClick={() => handlePrint()}
                    >
                      {<FormattedLabel id="downloadPDF" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* Cancel Button */}
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
                      variant="contained"
                      color="error"
                      // className={commonStyles.buttonBack}
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
              style={
                isLargeScreen
                  ? { display: "flex", justifyContent: "center" }
                  : { textAlign: "center" }
              }
            >
              <ReportLayout
                componentRef={componentRef}
                rows={data ? data : []}
                columns={isSubScheme ? columns : columnsWithoutSubScheme}
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
