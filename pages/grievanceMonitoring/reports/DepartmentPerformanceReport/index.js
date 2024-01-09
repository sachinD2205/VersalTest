import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Box,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import gmReportLayoutCss from "../commonCss/gmReportLayoutCss.module.css";
import DepartmentPerformanceReportSchema from "../../../../components/grievanceMonitoring/schema/DepartmentPerformanceReportSchema";
import sweetalert from "sweetalert";
import DownloadIcon from "@mui/icons-material/Download";
import XLSX from "sheetjs-style";
import FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil.js";
const Index = () => {
  const {
    watch,
    setValue,
    control,
    methods,
    handleSubmit,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(DepartmentPerformanceReportSchema),
  });
  const language = useSelector((state) => state?.labels.language);
  const user = useSelector((state) => state?.user?.user);
  const router = useRouter();
  // handlePrint
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [departmentPerformanceReportData, setDepartmentPerformanceData] =
    useState([]);
  const [
    departmentPerformanceReportDataFinal,
    setDepartmentPerformanceDataFinal,
  ] = useState([]);

  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  // Department
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let data = res?.data?.department?.map((row) => ({
            id: row?.id,
            departmentEn: row?.department,
            departmentMr: row?.departmentMr,
          }));
          data.sort(sortByProperty("departmentEn"));
          setDepartments(data);
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err,true);
      });
  };

  // subDepartment
  const getSubDepartmentBasedonDepartment = () => {
    axios
      .get(
        `${
          urls.CFCURL
        }/master/subDepartment/getBySubDepartment?department=${watch(
          "lstDepartment"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let data = res?.data?.subDepartment?.map((r) => ({
            id: r.id,
            subDepartmentEn: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }));
          data.sort(sortByProperty("subDepartmentEn"));
          setSubDepartments(data);
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err,true);
      })
  };

  // Events
  const getEvents = () => {
    axios
      .get(`${urls.GM}/mediaMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((r) => {
        if (r?.status == "200" || r?.status == "201") {
          if (
            r?.data?.mediaMasterList != null &&
            r?.data?.mediaMasterList != undefined
          ) {
            let data = r?.data?.mediaMasterList?.map((res) => ({
              id: res?.id,
              eventNameEn: res?.mediaName,
              eventNameMr: res?.mediaNameMr,
            }));
            data.sort(sortByProperty("eventNameEn"));
            setEvents(data);
          }
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err,false);
      });
  };

  // ApplicantTypes
  const getApllicantTyps = () => {
    axios
      .get(`${urls.GM}/master/applicantType/getAll`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let data = res?.data?.applicantType?.map((row) => ({
            id: row?.id,
            applicantTypeEn: row?.applicantType,
            applicantTypeMr: row?.applicantTypeMr,
          }));
          data.sort(sortByProperty("applicantTypeEn"));
          setApplicantTypes(data);
        } else {
        }
      })
      .catch((err) => {cfcErrorCatchMethod(err,false);});
  };

  // findDepartmentPerformanceReportData
  const findDepartmentPerformanceReportData = (data) => {
    setValue("loadderState", true);
    let sendFromDate =
      moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
    let sendToDate = moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";
    let {
      fromDate,
      lstDepartment,
      lstSubDepartment,
      splevent,
      toDate,
      applicantType,
    } = data;

    let FinalBodyForApi = {
      fromDate: sendFromDate,
      toDate: sendToDate,
      lstSubDepartment,
      lstMedia:data.splevent,
      applicantType,
      // mediaId,
      lstDepartment: lstDepartment == null ? [] : [lstDepartment],
    };

    let url = `${urls.GM}/report/getReportDepartmentPerformanceReport`;

    axios
      .post(url, FinalBodyForApi, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        // if (res?.status == 200 || res?.status == 201) {
          if (res?.data.length > 0
          ) {
            setDepartmentPerformanceData(res?.data);
            setValue("searchButtonInputState", false);
            let _enData = res?.data?.map((r, i) => {
              return {
                "Sr No.": i + 1,
                "Department Name": r?.departmentName,
                "Sub Department Name": r?.subDepartmentName,
                "Received Complaints": r?.praptaTakrari,
                "Number of complaints disposed of within the time limit":
                  r?.mudatitNikaliCount,
                "Grievances settled within time in percentage":
                  r?.mudatitNikaliPercentage,
                "Delayed settlement number": r?.vilambaneNikaliCount,
                "Delayed settlement percentage": r?.vilambaneNikaliPercentage,
                "Total settled number": r?.totalNikaliCount,
                "Total settlement in percentage": r?.totalNikaliPercentage,
                "Number of complaints pending within time":
                  r?.mudatitAsleliTakariCount,
                "Number of out-of-time complaints": r?.mudatitBahyaTakariCount,
                "Total number of pending complaints":
                  r?.totalPralambitTakariCount,
              };
            });
            let _mrData = res?.data?.map((r, i) => {
              return {
                'अ.क्र.': i + 1,
                "विभाग": r?.departmentNameMr,
                "उप-विभाग": r?.subDepartmentNameMr,
                "प्राप्त झालेल्या तक्रारी": r?.praptaTakrari,
                "मुदतीत निकाली काढलेल्या तक्रारी संख्या": r?.mudatitNikaliCount,
                "मुदतीत निकाली काढलेल्या तक्रारी शेकड्यामध्ये":
                  r?.mudatitNikaliPercentage,
                "विलंबित निकाली संख्या": r?.vilambaneNikaliCount,
                "विलंबित निकाली शेकडा": r?.vilambaneNikaliPercentage,
                "एकूण निकाली संख्या": r?.totalNikaliCount,
                "एकूण निकाली शेकडा": r?.totalNikaliPercentage,
                "मुदतीत असलेल्या तक्रारारी संख्या": r?.mudatitAsleliTakariCount,
                "मुदती बाहेरील तक्रारीची संख्या": r?.mudatitBahyaTakariCount,
                "एकूण प्रलंबित तक्रारी संख्या": r?.totalPralambitTakariCount,
              };
            });
            setEngReportsData(_enData);
            setMrReportsData(_mrData);
            setValue("loadderState", false);
          } else {
            setValue("loadderState", false);
            sweetalert({
              title: language === "en" ? "OOPS!" : "क्षमस्व!",
              text:
                language === "en"
                  ? "There is nothing to show you!"
                  : "माहिती उपलब्ध नाही",
              icon: "warning",
              // buttons: ["No", "Yes"],
              dangerMode: false,
              closeOnClickOutside: false,
            });
          }
        // } else {
        //   sweetalert("Network Error!", "Please Try Again!", "warning");
        // }
      })
      .catch((err) => {
        setValue("loadderState", false);
        cfcErrorCatchMethod(err,false);
      });
  };

  // cancellButton
  const cancellButton = () => {
    setValue("loadderState", false);
    setValue("searchButtonInputState", true);
    setDepartmentPerformanceData([]);
    setDepartmentPerformanceDataFinal([]);
    setEngReportsData([]);
    setMrReportsData([]);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("lstDepartment", null);
    setValue("lstSubDepartment", []);
    setValue("splevent", []);
    setValue("applicantType", "");
  };

  // exitButton
  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };

  // DepartmentPerformanceReportTableColumns
  const DepartmentPerformanceReportTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: language == "en" ? "Department Name" : "विभाग",
      description: language == "en" ? "Department Name" : "विभाग",
      headerAlign: "center",
      align: "center",
      width: 270,
    },
    {
      field: language == "en" ? "subDepartmentName" : "subDepartmentNameMr",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "SubDepartment Name" : "उप-विभाग",
      description: language == "en" ? "SubDepartment Name" : "उप-विभाग",
      width: 270,
    },

    {
      field: language == "en" ? "praptaTakrari" : "praptaTakrari",
      align: "center",
      headerName:
        language == "en" ? "Received Complaints" : "प्राप्त झालेल्या तक्रारी",
      description:
        language == "en" ? "Received Complaints" : "प्राप्त झालेल्या तक्रारी",
      headerAlign: "center",
      width: 270,
    },

    {
      field: language == "en" ? "mudatitNikaliCount" : "mudatitNikaliCount",
      headerAlign: "center",
      align: "center",
      headerName:
        language == "en"
          ? "Number of complaints disposed of within the time limit"
          : "मुदतीत निकाली काढलेल्या तक्रारी संख्या",
      description:
        language == "en"
          ? "Number of complaints disposed of within the time limit"
          : "मुदतीत निकाली काढलेल्या तक्रारी संख्या",
      width: 270,
    },
    {
      field:
        language == "en"
          ? "mudatitNikaliPercentage"
          : "mudatitNikaliPercentage",
      align: "center",
      headerName:
        language == "en"
          ? "Grievances settled within time in percentage"
          : "मुदतीत निकाली काढलेल्या तक्रारी शेकड्यामध्ये",
      description:
        language == "en"
          ? "Grievances settled within time in percentage"
          : "मुदतीत निकाली काढलेल्या तक्रारी शेकड्यामध्ये",
      headerAlign: "center",
      width: 270,
    },
    {
      field: language == "en" ? "vilambaneNikaliCount" : "vilambaneNikaliCount",
      align: "center",
      headerName:
        language == "en"
          ? "Delayed settlement number"
          : "विलंबित निकाली संख्या",
      description:
        language == "en"
          ? "Delayed settlement number"
          : "विलंबित निकाली संख्या",
      headerAlign: "center",
      width: 270,
    },

    {
      field:
        language == "en"
          ? "vilambaneNikaliPercentage"
          : "vilambaneNikaliPercentage",
      align: "center",
      headerName:
        language == "en"
          ? "Delayed settlement percentage"
          : "विलंबित निकाली शेकडा",
      description:
        language == "en"
          ? "Delayed settlement percentage"
          : "विलंबित निकाली शेकडा",
      headerAlign: "center",
      width: 270,
    },

    {
      field: language == "en" ? "totalNikaliCount" : "totalNikaliCount",
      align: "center",
      headerName:
        language == "en" ? "Total settled number" : "एकूण निकाली संख्या",
      description:
        language == "en" ? "Total settled number" : "एकूण निकाली संख्या",
      headerAlign: "center",
      width: 270,
    },

    {
      field:
        language == "en" ? "totalNikaliPercentage" : "totalNikaliPercentage",
      align: "center",
      headerName:
        language == "en"
          ? "Total settlement in percentage"
          : "एकूण निकाली शेकडा",
      description:
        language == "en"
          ? "Total settlement  in percentage"
          : "एकूण निकाली शेकडा",
      headerAlign: "center",
      width: 270,
    },

    {
      field:
        language == "en"
          ? "mudatitAsleliTakariCount"
          : "mudatitAsleliTakariCount",
      align: "center",
      headerName:
        language == "en"
          ? "Number of complaints pending within time"
          : "मुदतीत असलेल्या तक्रारारी संख्या",
      description:
        language == "en"
          ? "Number of complaints pending within time"
          : "मुदतीत असलेल्या तक्रारारी संख्या",
      headerAlign: "center",
      width: 270,
    },

    {
      field:
        language == "en"
          ? "mudatitBahyaTakariCount"
          : "mudatitBahyaTakariCount",
      align: "center",
      headerName:
        language == "en"
          ? "Number of out-of-time complaints"
          : "मुदती बाहेरील तक्रारीची संख्या",
      description:
        language == "en"
          ? "Number of out-of-time complaints"
          : "मुदती बाहेरील तक्रारीची संख्या",
      headerAlign: "center",
      width: 270,
    },

    {
      field:
        language == "en"
          ? "totalPralambitTakariCount"
          : "totalPralambitTakariCount",
      align: "center",
      headerName:
        language == "en"
          ? "Total number of pending complaints"
          : "एकूण प्रलंबित तक्रारी संख्या",
      description:
        language == "en"
          ? "Total number of pending complaints"
          : "एकूण प्रलंबित तक्रारी संख्या",
      headerAlign: "center",
      width: 270,
    },
  ];

  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };


  useEffect(() => {
    setValue("loadderState", false);
    setValue("searchButtonInputState", true);
    setDepartmentPerformanceData([]);
    setDepartmentPerformanceDataFinal([]);
    setEngReportsData([]);
    setMrReportsData([]);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("lstDepartment", null);
    setValue("lstSubDepartment", []);
    setValue("splevent", []);
    setValue("applicantType", "");
    // api
    getDepartment();
    getEvents();
    getApllicantTyps();
  }, []);

  useEffect(() => {
    if (
      watch("lstDepartment") != null &&
      watch("lstDepartment") != "" &&
      watch("lstDepartment") != undefined
    ) {
      getSubDepartmentBasedonDepartment();
    }
  }, [watch("lstDepartment")]);

  useEffect(() => {
    let tempTable = [];
    if (
      departmentPerformanceReportData.length != 0 &&
      departmentPerformanceReportData != null &&
      departmentPerformanceReportData != undefined
    ) {
      tempTable = departmentPerformanceReportData?.map((data, index) => {
        return {
          ...data,
          srNo: index + 1,
        };
      });
    }

    setDepartmentPerformanceDataFinal(tempTable);
  }, [departmentPerformanceReportData]);

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en"
        ? "Department Performance Report"
        : "विभाग कामगिरी अहवाल";

    const date =
      language == "en"
        ? `DATE : From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक : ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;

    let columns = DepartmentPerformanceReportTableColumns;
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    // const headerColumns = columns.map((c) => c.headerName);

    const fileName =
      language === "en"
        ? "Department Performance Report"
        : "विभाग कामगिरी अहवाल";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    // const ws = XLSX.utils.json_to_sheet(data,{header: headerColumns});
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A5" });
    // const ws = XLSX.utils.sheet_add_aoa(ws0,);
    // ws.B1 = { t: "s", v: "This is PCMC report title 1" };
    ws.B1 = { t: "s", v: engHeading };
    ws.B2 = { t: "s", v: reportName };
    ws.B3 = { t: "s", v: date };
    const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } }];
    ws["!merges"] = merge;

    const wb = { Sheets: { [fileName]: ws }, SheetNames: [fileName] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }



  // view
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={gmReportLayoutCss.PaperMain}>
        {watch("loadderState") && <CommonLoader />}
        {
          <>
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <Box>
                  <Grid
                    container
                    style={{
                      display: "flex",
                      alignItems: "center", // Center vertically
                      alignItems: "center",
                      width: "100%",
                      height: "auto",
                      overflow: "auto",
                      color: "white",
                      fontSize: "18.72px",
                      borderRadius: 100,
                      fontWeight: 500,
                      background:
                        "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
                    }}
                  >
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
                        {language == "en"
                          ? "Department Performance Report"
                          : "विभाग कामगिरी अहवाल"}
                      </h3>
                    </Grid>
                  </Grid>
                </Box>

                <form
                  onSubmit={handleSubmit(findDepartmentPerformanceReportData)}
                >
                   <Grid
                    container
                    sx={{
                      marginTop: 1,
                      marginBottom: 5,
                      paddingLeft: "50px",
                      align: "center",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={gmReportLayoutCss.GridItem}
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
                                defaultValue={null}
                                maxDate={moment.now()}
                                disabled={!watch("searchButtonInputState")}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromDate" required />
                                  </span>
                                }
                                value={field.value}
                                onChange={
                                  (date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DDThh:mm:ss")
                                    )
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
                          {errors?.fromDate ? errors?.fromDate?.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={gmReportLayoutCss.GridItem}
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
                                defaultValue={null}
                                maxDate={moment.now()}
                                disabled={
                                  watch("fromDate") == null
                                    ? true
                                    : !watch("searchButtonInputState")
                                }
                                minDate={watch("fromDate")}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="toDate" required />
                                  </span>
                                }
                                value={field.value}
                                onChange={
                                  (date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DDThh:mm:ss")
                                    )
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
                          {errors?.toDate ? errors?.toDate?.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={gmReportLayoutCss.GridItem}
                    >
                      <FormControl
                        variant="standard"
                        error={!!errors?.lstDepartment}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="departmentName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={!watch("searchButtonInputState")}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="departmentName" />}
                            >
                              {departments &&
                                departments.map((department, index) => (
                                  <MenuItem key={index} value={department?.id}>
                                    {language == "en"
                                      ? department?.departmentEn
                                      : department?.departmentMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="lstDepartment"
                          control={control}
                          defaultValue={null}
                        />
                        <FormHelperText>
                          {errors?.lstDepartment
                            ? errors?.lstDepartment?.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={gmReportLayoutCss.GridItem}
                    >
                      <FormControl
                        variant="standard"
                        error={!!errors.lstSubDepartment}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="subDepartmentName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={
                                watch("lstDepartment") == null
                                  ? true
                                  : !watch("searchButtonInputState")
                              }
                              label={<FormattedLabel id="subDepartmentName" />}
                              multiple
                              value={field?.value}
                              onChange={(value) => field?.onChange(value)}
                              renderValue={(val) =>
                                watch("lstSubDepartment")
                                  .map((j) => {
                                    if (language == "en") {
                                      return subDepartments?.find(
                                        (obj) => obj?.id == j
                                      )?.subDepartmentEn;
                                    } else {
                                      return subDepartments?.find(
                                        (obj) => obj?.id == j
                                      )?.subDepartmentMr;
                                    }
                                  })
                                  .join(",")
                              }
                            >
                              {subDepartments?.map((obj) => (
                                <MenuItem key={obj?.id} value={obj?.id}>
                                  <Checkbox
                                    checked={watch(
                                      "lstSubDepartment"
                                    )?.includes(obj?.id)}
                                  />
                                  <ListItemText
                                    primary={
                                      language == "en"
                                        ? obj?.subDepartmentEn
                                        : obj?.subDepartmentMr
                                    }
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                          name="lstSubDepartment"
                          control={control}
                          defaultValue={[]}
                        />
                        <FormHelperText>
                          {errors?.lstSubDepartment
                            ? errors?.lstSubDepartment?.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={gmReportLayoutCss.GridItem}
                    >
                      <FormControl variant="standard" error={!!errors.splevent}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {language == "en" ? "Events" : "कार्यक्रम"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={!watch("searchButtonInputState")}
                              label={language == "en" ? "Events" : "कार्यक्रम"}
                              multiple
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              renderValue={(val) =>
                                watch("splevent")
                                  .map((j) => {
                                    if (language == "en") {
                                      return events.find((obj) => obj.id == j)
                                        ?.eventNameEn;
                                    } else {
                                      return events.find((obj) => obj.id == j)
                                        ?.eventNameMr;
                                    }
                                  })
                                  .join(",")
                              }
                            >
                              {events.map((obj) => (
                                <MenuItem key={obj.id} value={obj.id}>
                                  <Checkbox
                                    checked={watch("splevent")?.includes(
                                      obj?.id
                                    )}
                                  />
                                  <ListItemText
                                    primary={
                                      language == "en"
                                        ? obj.eventNameEn
                                        : obj.eventNameMr
                                    }
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                          name="splevent"
                          control={control}
                          defaultValue={[]}
                        />
                        <FormHelperText>
                          {errors?.splevent ? errors?.splevent?.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={gmReportLayoutCss.GridItem}
                    >
                      <FormControl
                        variant="standard"
                        error={!!errors?.applicantType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {language == "en"
                            ? "Applicant Types"
                            : "अर्जदाराचे प्रकार"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={!watch("searchButtonInputState")}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                language == "en"
                                  ? "Applicant Types"
                                  : "अर्जदाराचे प्रकार"
                              }
                            >
                              {applicantTypes &&
                                applicantTypes.map((applicantType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={applicantType?.id}
                                  >
                                    {language == "en"
                                      ? applicantType?.applicantTypeEn
                                      : applicantType?.applicantTypeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="applicantType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.applicantType
                            ? errors?.applicantType?.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {/** Buttons  */}
                  <Stack
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
                    paddingBottom="7"
                    marginTop="5"
                    marginBottom="10"
                  >
                    {watch("searchButtonInputState") == true ? (
                      <>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          size="small"
                          endIcon={<SearchIcon />}
                        >
                          {language == "en" ? "Search" : "शोधा"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          onClick={handlePrint}
                          size="small"
                        >
                          <FormattedLabel id="print" />
                        </Button>
                        <Button
                          type="button"
                          variant="contained"
                          color="success"
                          size="small"
                          endIcon={<DownloadIcon />}
                          onClick={() =>
                            language == "en"
                              ? generateCSVFile(engReportsData)
                              : generateCSVFile(mrReportsData)
                          }
                        >
                          {<FormattedLabel id="downloadEXCELL" />}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Stack>
                  {/** Button End */}
                  {/** DataGrid Start */}
                  {departmentPerformanceReportDataFinal != null &&
                  departmentPerformanceReportDataFinal != undefined &&
                  departmentPerformanceReportDataFinal.length != 0 ? (
                    <DataGrid
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 100 },
                          printOptions: { disableToolbarButton: true },
                          disableExport: false,
                          disableToolbarButton: false,
                          csvOptions: { disableToolbarButton: true },
                        },
                      }}
                      sx={{
                        backgroundColor: "white",
                        m: 2,
                        overflowY: "scroll",
                        "& .MuiDataGrid-columnHeadersInner": {
                          backgroundColor: "#556CD6",
                          color: "white",
                        },
                        "& .MuiDataGrid-cell:hover": {
                          color: "primary.main",
                        },
                      }}
                      density="density"
                      getRowId={(row) => row.srNo}
                      autoHeight
                      rows={
                        departmentPerformanceReportDataFinal != undefined &&
                        departmentPerformanceReportDataFinal != null
                          ? departmentPerformanceReportDataFinal
                          : []
                      }
                      columns={DepartmentPerformanceReportTableColumns}
                      pageSize={pageSize}
                      rowsPerPageOptions={[5, 10, 25, 50, 100]}
                      onPageSizeChange={handlePageSizeChange}
                      components={
                        {
                        }
                      }
                      title="Goshwara"
                    />
                  ) : (
                    <></>
                  )}
                </form>
              </FormProvider>
            </ThemeProvider>

            {/** New Table Report  */}
            <div className={gmReportLayoutCss.HideReportLayout}>
              <ReportLayout
                columnLength={5}
                componentRef={componentRef}
                deptName={{
                  en: "Department Name In English",
                  mr: "Department Name In Marathi",
                }}
                reportName={{
                  en: "Report Name IN English",
                  mr: "Report Name In Marathi",
                }}
              >
                <ComponentToPrintNew
                  reportData={departmentPerformanceReportDataFinal}
                  language={language}
                />
              </ReportLayout>
            </div>
          </>
        }
      </Paper>
    </>
  );
};

// ComponentToPrintNew
class ComponentToPrintNew extends React.Component {
  render() {
    const reportData = this?.props?.reportData;

    return (
      <>
        <table className={gmReportLayoutCss.table}>
          <tr>
            <td colSpan={13} className={gmReportLayoutCss.TableTitle}>
              {this?.props.language == "en"
                ? "Department Performance Report"
                : "विभाग कामगिरी अहवाल"}
            </td>
          </tr>
          <tr>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Serial Number" : "अ.क्र."}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Department Name"
                : "विभाग"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Sub Department Name"
                : "उप-विभाग"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Received Complaints"
                : "प्राप्त झालेल्या तक्रारी"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Number of complaints disposed of within the time limit"
                : "मुदतीत निकाली काढलेल्या तक्रारी संख्या"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Grievances settled within time in percentage"
                : "मुदतीत निकाली काढलेल्या तक्रारी शेकड्यामध्ये"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Delayed settlement number"
                : "विलंबित निकाली संख्या"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Delayed settlement percentage"
                : "विलंबित निकाली शेकडा"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Total settled number"
                : "एकूण निकाली संख्या"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Total settlement in percentage"
                : "एकूण निकाली शेकडा"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Number of complaints pending within time"
                : "मुदतीत असलेल्या तक्रारारी संख्या"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Number of out-of-time complaints"
                : "मुदती बाहेरील तक्रारीची संख्या"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Total number of pending complaints"
                : "एकूण प्रलंबित तक्रारी संख्या"}
            </td>
          </tr>
          {reportData &&
            reportData?.map((reportData, index) => (
              <tr>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en" ? index + 1 : index + 1}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.departmentName
                    : reportData?.departmentNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.subDepartmentName
                    : reportData?.subDepartmentNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.praptaTakrari
                    : reportData?.praptaTakrari}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.mudatitNikaliCount
                    : reportData?.mudatitNikaliCount}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.mudatitNikaliPercentage
                    : reportData?.mudatitNikaliPercentage}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.vilambaneNikaliCount
                    : reportData?.vilambaneNikaliCount}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.vilambaneNikaliPercentage
                    : reportData?.vilambaneNikaliPercentage}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.totalNikaliCount
                    : reportData?.totalNikaliCount}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.totalNikaliPercentage
                    : reportData?.totalNikaliPercentage}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.mudatitAsleliTakariCount
                    : reportData?.mudatitAsleliTakariCount}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.mudatitBahyaTakariCount
                    : reportData?.mudatitBahyaTakariCount}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.totalPralambitTakariCount
                    : reportData?.totalPralambitTakariCount}
                </td>
              </tr>
            ))}
        </table>
      </>
    );
  }
}

export default Index;
