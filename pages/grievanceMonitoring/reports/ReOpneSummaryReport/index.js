import ClearIcon from "@mui/icons-material/Clear";import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import { yupResolver } from "@hookform/resolvers/yup";
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
  TextField,
  Box,
  ThemeProvider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import gmReportLayoutCss from "../commonCss/gmReportLayoutCss.module.css";
import theme from "../../../../theme.js";
import styles from "./ReOpneSummaryReport.module.css";
import ReOpneSummaryReport from "../../../../components/grievanceMonitoring/schema/ReOpneSummaryReport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import gmLabels from "../../../../containers/reuseableComponents/labels/modules/gmLabels";
import XLSX from "sheetjs-style";
import "jspdf-autotable";
import FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil.js";
const Index = () => {
  const {
    setValue,
    control,
    watch,
    methods,
    handleSubmit,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(ReOpneSummaryReport),
  });
  const language = useSelector((state) => state?.labels.language);
  const user = useSelector((state) => state?.user?.user);
  const router = useRouter();
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
  // handlePrint
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  const [spacialEvents, setSpacialEvents] = useState([]);
  const [reOpneSummaryReportData, setReOpneSummaryReportData] = useState([]);
  const [reOpneSummaryReportDataFinal, setReOpneSummaryReportDataFinal] =
    useState([]);
  const currDate = new Date();
  const tDate = moment(currDate).format("YYYY-MM-DDThh:mm:ss");
  const [labels, setLabels] = useState(gmLabels[language ?? "en"]);
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  useEffect(() => {
    setLabels(gmLabels[language ?? "en"]);
  }, [setLabels, language]);
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
          let data = res?.data?.department?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentEn: r.department,
            departmentMr: r.departmentMr,
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
          "department"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let data = res?.data?.subDepartment?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartmentEn: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }));
          data.sort(sortByProperty("subDepartmentEn"));
          setSubDepartments(data);
        } else {
        }
      })
      .catch((err) => {  cfcErrorCatchMethod(err,true);});
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
      .catch((error) => {
        cfcErrorCatchMethod(error,false);
      });
  };

  // Events
  const getSpecialEvents = () => {
    axios
      .get(`${urls.GM}/eventTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((r) => {
        if (r?.status == "200" || r?.status == "201") {
          if (
            r?.data?.eventTypeMasterList != null &&
            r?.data?.eventTypeMasterList != undefined
          ) {
            let data = r?.data?.eventTypeMasterList?.map((res) => ({
              id: res?.id,
              spacialEventNameEn: res?.eventType,
              spacialEventNameMr: res?.eventTypeMr,
            }));
            data.sort(sortByProperty("spacialEventNameEn"));
            setSpacialEvents(data);
          }
        } else {
        }
      })
      .catch((error) => {
        cfcErrorCatchMethod(error,false);
      });
  };



  // findDepartmentPerformanceReportData
  const findDepartmentPerformanceReportData = (data) => {
    setValue("loadderState", true);
    setLoading(true);
    let { fromDate, toDate, department, subDepartment, eventId, mediaId } =
      data;
    let sendFromDate =
      moment(data?.fromDate).format("YYYY-MM-DDT") + "00:00:01";
    let sendToDate = moment(data?.toDate).format("YYYY-MM-DDT") + "23:59:59";

    let FinalBodyForApi = {
      sendFromDate,
      sendToDate,
      department: department,
      lstSubDepartment: data.subDepartment,
      splevent: data.eventId,
      lstMedia: data.mediaId,
    };

    let url = `${urls.GM}/report/getReportReopenSummery`;

    axios
      .post(url, FinalBodyForApi, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (res?.data.length > 0) {
            setReOpneSummaryReportData(res?.data);
            setValue("loadderState", false);
            setLoading(false);
            setValue("searchButtonInputState", false);
          } else {
            setValue("loadderState", false);
            setLoading(false);
            sweetAlert({
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
        } else {
          setValue("loadderState", false);
          setLoading(false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        setLoading(false);
        cfcErrorCatchMethod(error,false);
      });
  };


  // cancellButton
  const cancellButton = () => {
    setValue("loadderState", false);
    setLoading(false);
    setValue("searchButtonInputState", true);
    setReOpneSummaryReportData([]);
    setReOpneSummaryReportDataFinal([]);
    setEngReportsData([]);
    setMrReportsData([]);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("department", "");
    setValue("subDepartment", []);
    setValue("mediaId", []);
    setValue("eventId", []);
  };

  // exitButton
  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };

  // DepartmentPerformanceReportTableColumns
  const DepartmentPerformanceReportTableColumns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: language == "en" ? "Department Name" : "विभाग",
      description: language == "en" ? "Department Name" : "विभाग",
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: language == "en" ? "splEventName" : "splEventNameMr",
      headerName: labels.splEvent,
      description:
        language == "en" ? "Special Event Name" : "विशेष कार्यक्रमाचे नाव",
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: language == "en" ? "sum" : "sum",
      headerAlign: "center",
      align: "center",
      headerName: labels.sum,
      description: language == "en" ? "Total" : "एकूण",
      flex: 1,
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en" ? "ReOpen Summary Report" : "सारांश अहवाल पुन्हा उघडा";

    const date =
      language == "en"
        ? `DATE : From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक : ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;

    const columns = DepartmentPerformanceReportTableColumns;
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    const fileName =
      language === "en" ? "Re-Open Summary Report" : "सारांश अहवाल पुन्हा उघडा";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A5" });
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



  useEffect(() => {
    setValue("loadderState", false);
    setLoading(false);
    setValue("searchButtonInputState", true);
    setReOpneSummaryReportData([]);
    setReOpneSummaryReportDataFinal([]);
    setEngReportsData([]);
    setMrReportsData([]);
    setValue("fromDate", null);
    // setValue("toDate", null);
    setValue("department", "");
    setValue("subDepartment", []);
    setValue("mediaId", []);
    setValue("eventId", []);
    //api
    getDepartment();
    getEvents();
    getSpecialEvents();
  }, []);

  useEffect(() => {
    if (
      watch("department") != null &&
      watch("department") != "" &&
      watch("department") != undefined
    ) {
      getSubDepartmentBasedonDepartment();
    }
  }, [watch("department")]);

  useEffect(() => {
    let tempTable = [];
    let _enData = [];
    let _mrData = [];
    if (
      reOpneSummaryReportData.length != 0 &&
      reOpneSummaryReportData != null &&
      reOpneSummaryReportData != undefined
    ) {
      tempTable = reOpneSummaryReportData?.map((data, index) => {
        return {
          ...data,
          srNo: index + 1,
        };
      });

      _enData = reOpneSummaryReportData?.map((data, index) => {
        return {
          "Sr No": index + 1,
          "Department Name": data.departmentName,
          "Sub-Department Name": data.subDepartmentName,
          "Special Event": data.splEventName,
          Total: data.sum,
        };
      });
      _mrData = reOpneSummaryReportData?.map((data, index) => {
        return {
          "अ.क्र. ": index + 1,
          विभाग: data.departmentNameMr,
          "उप-विभाग": data.subDepartmentNameMr,
          "विशेष कार्यक्रम": data.splEventNameMr,
          एकूण: data.sum,
        };
      });
    }

    setReOpneSummaryReportDataFinal(tempTable);
    setEngReportsData(_enData);
    setMrReportsData(_mrData);
  }, [reOpneSummaryReportData]);

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

  // view
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.PaperMain}>
        {
          <>
            <ThemeProvider theme={theme}>
              {
                <FormProvider {...methods}>
                  <form
                    onSubmit={handleSubmit(findDepartmentPerformanceReportData)}
                  >
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
                              ? "ReOpen Summary Report"
                              : "सारांश अहवाल पुन्हा उघडा"}
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>

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
                        className={styles.GridItem}
                      >
                        <FormControl
                          style={{ marginTop: 0 }}
                          error={!!errors?.fromDate}
                        >
                          <Controller
                            disabled={!watch("searchButtonInputState")}
                            name="fromDate"
                            control={control}
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
                                  value={field.value}
                                  onChange={(date) =>
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
                            {errors?.fromDate
                              ? errors?.fromDate?.message
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
                        className={styles.GridItem}
                      >
                        <FormControl
                          style={{ marginTop: 0 }}
                          error={!!errors?.toDate}
                        >
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={tDate}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disableFuture
                                  disabled={!watch("searchButtonInputState")}
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="toDate" required />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
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
                        className={styles.GridItem}
                      >
                        <FormControl
                          variant="standard"
                          error={!!errors?.department}
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
                                    <MenuItem
                                      key={index}
                                      value={department?.id}
                                    >
                                      {language == "en"
                                        ? department?.departmentEn
                                        : department?.departmentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="department"
                            control={control}
                            defaultValue={[]}
                          />
                          <FormHelperText>
                            {errors?.department
                              ? errors?.department?.message
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
                        className={styles.GridItem}
                      >
                        <FormControl
                          variant="standard"
                          error={!!errors.subDepartment}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="subDepartmentName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={!watch("searchButtonInputState")}
                                label={
                                  <FormattedLabel id="subDepartmentName" />
                                }
                                multiple
                                value={field?.value}
                                onChange={(value) => field?.onChange(value)}
                                renderValue={(val) =>
                                  watch("subDepartment")
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
                                      checked={watch("subDepartment")?.includes(
                                        obj?.id
                                      )}
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
                            name="subDepartment"
                            control={control}
                            defaultValue={[]}
                          />
                          <FormHelperText>
                            {errors?.subDepartment
                              ? errors?.subDepartment?.message
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
                        className={styles.GridItem}
                      >
                        <FormControl
                          variant="standard"
                          error={!!errors.mediaId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {language == "en" ? "Events" : "कार्यक्रम"}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={!watch("searchButtonInputState")}
                                label={
                                  language == "en" ? "Events" : "कार्यक्रम"
                                }
                                multiple
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                renderValue={(val) =>
                                  watch("mediaId")
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
                                      checked={watch("mediaId")?.includes(
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
                            name="mediaId"
                            control={control}
                            defaultValue={[]}
                          />
                          <FormHelperText>
                            {errors?.mediaId ? errors?.mediaId?.message : null}
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
                        className={styles.GridItem}
                      >
                        <FormControl
                          variant="standard"
                          error={!!errors.eventId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {language == "en"
                              ? "Special Events"
                              : "विशेष कार्यक्रम"}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={!watch("searchButtonInputState")}
                                label={
                                  language == "en"
                                    ? "Special Events"
                                    : "विशेष कार्यक्रम"
                                }
                                multiple
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                renderValue={(val) =>
                                  watch("eventId")
                                    .map((j) => {
                                      if (language == "en") {
                                        return spacialEvents.find(
                                          (obj) => obj.id == j
                                        )?.spacialEventNameEn;
                                      } else {
                                        return spacialEvents.find(
                                          (obj) => obj.id == j
                                        )?.spacialEventNameMr;
                                      }
                                    })
                                    .join(",")
                                }
                              >
                                {spacialEvents.map((obj) => (
                                  <MenuItem key={obj.id} value={obj.id}>
                                    <Checkbox
                                      checked={watch("eventId")?.includes(
                                        obj?.id
                                      )}
                                    />
                                    <ListItemText
                                      primary={
                                        language == "en"
                                          ? obj.spacialEventNameEn
                                          : obj.spacialEventNameMr
                                      }
                                    />
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            name="eventId"
                            control={control}
                            defaultValue={[]}
                          />
                          <FormHelperText>
                            {errors?.eventId ? errors?.eventId?.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                  
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {watch("searchButtonInputState") == true ? (
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
                          <Button
                            size="small"
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SearchIcon />}
                          >
                            {language == "en" ? "Search" : "शोधा"}
                          </Button>
                        </Grid>
                      ) : (
                        <>
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
                            <Button
                              size="small"
                              disabled={
                                reOpneSummaryReportDataFinal?.length > 0
                                  ? false
                                  : true
                              }
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
                           
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ float: "right" }}
                              onClick={handlePrint}
                              size="small"
                            >
                              <FormattedLabel id="print" />
                            </Button>
                          </Grid>
                        </>
                      )}

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
                        <Button
                          size="small"
                          type="button"
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
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
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>

                    {loading ? (
                      <CommonLoader />
                    ) : (
                      <>
                        {reOpneSummaryReportDataFinal != null &&
                        reOpneSummaryReportDataFinal != undefined &&
                        reOpneSummaryReportDataFinal.length != 0 ? (
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
                              reOpneSummaryReportDataFinal != undefined &&
                              reOpneSummaryReportDataFinal != null
                                ? reOpneSummaryReportDataFinal
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
                      </>
                    )}
                  </form>
                </FormProvider>
              }
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
                  reportData={reOpneSummaryReportDataFinal}
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

class ComponentToPrintNew extends React.Component {
  render() {
    const reportData = this?.props?.reportData;

    const { language } = this?.props?.language;

    return (
      <>
        <table className={gmReportLayoutCss.table}>
          <tr>
            <td colSpan={15} className={gmReportLayoutCss.TableTitle}>
              {this?.props.language == "en"
                ? "Re-Open Summary Report"
                : "सारांश अहवाल पुन्हा उघडा"}
            </td>
          </tr>
          <tr>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Serial Number" : "अ.क्र."}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Department Name" : "विभाग"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Sub Department Name" : "उपविभाग"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Special Event"
                : "विशेष कार्यक्रम"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Sum" : "एकूण"}
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
                    ? reportData?.splEventName
                    : reportData?.splEventNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.sum}
                </td>
              </tr>
            ))}
        </table>
      </>
    );
  }
}

export default Index;
