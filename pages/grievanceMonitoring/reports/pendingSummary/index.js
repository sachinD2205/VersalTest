import { ThemeProvider } from "@emotion/react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import SearchIcon from "@mui/icons-material/Search";
import sweetAlert from "sweetalert";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import gmLabels from "../../../../containers/reuseableComponents/labels/modules/gmLabels";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import gmReportLayoutCss from "../commonCss/gmReportLayoutCss.module.css";
import XLSX from "sheetjs-style";
import FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const Index = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
  });

  const router = useRouter();
  // handlePrint
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingSubDept, setLoadingSubDept] = useState(false);
  const [selectedValuesOfDepartments, setSelectedValuesOfDepartments] =useState([]);
  const [subDepartments, setSubDepartment] = useState([]);
  const [selectedValuesOfSubDept, setSelectedValuesOfSubDept] = useState([]);
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const language = useSelector((store) => store.labels.language);
  const [labels, setLabels] = useState(gmLabels[language ?? "en"]);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
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

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
  };

  useEffect(() => {
    setLabels(gmLabels[language ?? "en"]);
  }, [setLabels, language]);

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    setValue("searchButtonInputState", true);
    setLoading(false);
    setData([]);
    setSelectedValuesOfDepartments([]);
  };

  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };


  const getAllDepartments = () => {
    setLoadingDept(true);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.department?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentEn: r.department,
            departmentMr: r.departmentMr,
          }));
          data.sort(sortByProperty("departmentEn"));
          setDepartments(data);
          setLoadingDept(false);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!"
          );
          setLoadingDept(false);
        }
      })
      .catch((error) => {
          setLoadingDept(false);
          cfcErrorCatchMethod(error,true);
      });
  };

  useEffect(() => {
    getAllDepartments();
    setValue("searchButtonInputState", true);
  }, []);

  const getSubDepartmentDetails = () => {
    if (selectedValuesOfDepartments.length != 0) {
      setLoading(true);
      setLoadingSubDept(true);
      axios
        .get(
          `${urls.GM}/master/subDepartment/getAllByDeptWise/${selectedValuesOfDepartments[0]}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            let data = res?.data?.subDepartment?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              departmentId: r.department,
              subDepartmentEn: r.subDepartment,
              subDepartmentMr: r.subDepartmentMr,
            }));
            data.sort(sortByProperty("subDepartmentEn"));
            setSubDepartment(data);
            setLoading(false);
            setLoadingSubDept(false);
          } else {
            sweetAlert(
              language == "en"
                ? "Something Went To Wrong !"
                : "काहीतरी चूक झाली!"
            );
            setLoading(false);
            setLoadingSubDept(false);
          }
        })
        .catch((error) => {
            setLoading(false);
            setLoadingSubDept(false);
            cfcErrorCatchMethod(error,false);
        });
    }
  };

  useEffect(() => {
    if (selectedValuesOfDepartments?.length == 1) {
      getSubDepartmentDetails();
    } else {
      setSubDepartment([]);
      setSelectedValuesOfSubDept([]);
    }
  }, [selectedValuesOfDepartments]);



  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";

      let apiBodyToSend = {
        lstDepartment:
          selectedValuesOfDepartments?.length > 0
            ? selectedValuesOfDepartments
            : [],
        lstSubDepartment:
          selectedValuesOfSubDept?.length > 0 ? selectedValuesOfSubDept : [],
        fromDate: sendFromDate,
        toDate: sendToDate,
      };
      setLoading(true);
      axios
        .post(`${urls.GM}/report/getReportPendingSummeryV3`, apiBodyToSend, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setValue("searchButtonInputState", false);
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  departmentName: newFunctionForNullValues(
                    "en",
                    r.departmentName
                  ),
                  departmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.departmentNameMr
                  ),
                  subDepartmentName: newFunctionForNullValues(
                    "en",
                    r.subDepartmentName
                  ),
                  subDepartmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.subDepartmentNameMr
                  ),

                  totalCount: r.totalCount,
                  zeroToOne: r.zeroToOne,
                  oneToThree: r.oneToThree,
                  threeToSix: r.threeToSix,
                  sixToOneYear: r.sixToOneYear,
                  aboveOneYear: r.aboveOneYear,
                  areaName: newFunctionForNullValues("en", r.areaName),
                  areaNameMr: newFunctionForNullValues("mr", r.areaNameMr),
                  wardName: newFunctionForNullValues("en", r.wardName),
                  wardNameMr: newFunctionForNullValues("mr", r.wardNameMr),
                  zoneName: newFunctionForNullValues("en", r.zoneName),
                  zoneNameMr: newFunctionForNullValues("mr", r.zoneNameMr),
                }))
              );

              let _enData = res?.data?.map((i, index) => {
                return {
                  "Sr No ": index + 1,
                  "Department Name": i?.departmentName,
                  "Sub Department Name": i?.subDepartmentName,
                  "Area Name": i?.areaName,
                  "Ward Name": i?.wardName,
                  "Zone Name": i?.zoneName,
                  "Zero To One": i?.zeroToOne, 
                  "One To Three": i?.oneToThree,
                  "Three To Six": i?.threeToSix,
                  "Six To One Year": i?.sixToOneYear,
                  "Above One Year": i?.aboveOneYear,
                  "Total Count": i?.totalCount,
                };
              });
              let _mrData = res?.data?.map((i, index) => {
                return {
                  "अ.क्र. ": index + 1,
                  "विभाग": i?.departmentNameMr,
                  "उप-विभाग": i?.subDepartmentNameMr,
                  "क्षेत्राचे नाव": i?.areaNameMr,
                  "प्रभागाचे नाव": i?.wardNameMr,
                  "झोनचे नाव": i?.zoneNameMr,
                  "शून्य ते एक": i?.zeroToOne,
                  "एक ते तीन": i?.oneToThree,
                  "तीन ते सहा": i?.threeToSix,
                  "सहा ते एक वर्ष": i?.sixToOneYear,
                  "एका वर्षाच्या वर": i?.aboveOneYear,
                  "एकूण संख्या": i?.totalCount,
                };
              });

              setEngReportsData(_enData);
              setMrReportsData(_mrData);
              setLoading(false);
            } else {
              setLoading(false);
              sweetAlert({
                title:language === "en" ? "OOPS!" : "क्षमस्व!",
                text:
                  language === "en"
                    ? "There is nothing to show you!"
                    : "माहिती उपलब्ध नाही",
                icon: "warning",
                dangerMode: false,
                closeOnClickOutside: false,
              }).then((will)=>{
                if(will){
                  setData([]);
                  setEngReportsData([]);
                  setMrReportsData([]);
                  }
              });
            }
          } else {
            setData([]);
            setEngReportsData([]);
            setMrReportsData([]);
            sweetAlert(
              language == "en"
                ? "Something Went To Wrong !"
                : "काहीतरी चूक झाली!"
            );
            setLoading(false);
          }
        })
        .catch((error) => {
            setData([]);
            setEngReportsData([]);
            setMrReportsData([]);
            setLoading(false);
            cfcErrorCatchMethod(error,false);
        });
    } else {
      sweetAlert({
        title: language == "en" ? "Oops!" : "क्षमस्व!",
        text:
          language == "en"
            ? "From and To Both Dates Are Required!"
            : "पासून आणि पर्यंत दोन्ही तारखा आवश्यक आहेत!",
        icon: "warning",
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
      setEngReportsData([]);
      setMrReportsData([]);
    }
  };

  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available";
    } else {
      return value ? value : "उपलब्ध नाही";
    }
  };

  const columns = [
    {
      field: "id",
      headerName: labels.srNo,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: labels.departmentName,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "subDepartmentName" : "subDepartmentNameMr",
      headerName: labels.subDepartmentName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "areaName" : "areaNameMr",
      headerName: labels.areaName,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "wardName" : "wardNameMr",
      headerName: labels.wardName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "zoneName" : "zoneNameMr",
      headerName: labels.zoneName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "zeroToOne",
      headerName: labels.zeroToOne,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    
    {
      field: "oneToThree",
      headerName: labels.oneToThree,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "threeToSix",
      headerName: labels.threeToSix,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "sixToOneYear",
      headerName: labels.sixToOneYear,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "aboveOneYear",
      headerName: labels.aboveOneYear,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalCount",
      headerName: labels.totalCount,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en" ? "Pending Summary" : "सारांशानुसार प्रलंबित";

    const date =
      language == "en"
        ? `DATE : From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक : ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;

    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    const fileName =
      language === "en" ? "Pending Summary" : "सारांशानुसार प्रलंबित";
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



  const currDate = new Date();


  const handleSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.id);

    setSelectedValuesOfDepartments(selectedIds);
  };

  const handleSelectForSubDept = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setSelectedValuesOfSubDept(selectedIds);
  };
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

  return (
    <>
      <ThemeProvider theme={theme}>
        <>
          <BreadcrumbComponent />
        </>
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
                    ? "Pending Summary"
                    : "सारांशानुसार प्रलंबित"}
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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    {loadingDept ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="departmentName" />
                          </InputLabel>
                          <Select
                            autoFocus
                            variant="standard"
                            sx={{ width: "320px" }}
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>

                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={departments}
                        disableCloseOnSelect
                        getOptionLabel={(option) =>
                          language === "en"
                            ? option.departmentEn
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : option.departmentMr
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        onChange={handleSelect}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.departmentEn
                              : option.departmentMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: "320px", margin: 0 }}
                            variant="standard"
                            {...params}
                            label={<FormattedLabel id="departmentName" />}
                          />
                        )}
                      />
                    )}
                  </Grid>
                  {selectedValuesOfDepartments?.length == 1 &&
                    subDepartments?.length !== 0 && (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loadingSubDept ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <FormControl>
                              <InputLabel>
                                <FormattedLabel id="subDepartmentName" />
                              </InputLabel>
                              <Select
                                autoFocus
                                variant="standard"
                                sx={{ width: "320px" }}
                                multiple
                              ></Select>
                            </FormControl>

                            <CircularProgress size={15} color="error" />
                          </div>
                        ) : (
                          <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={subDepartments ? subDepartments : []}
                            disableCloseOnSelect
                            getOptionLabel={(option) =>
                              language === "en"
                                ? option.subDepartmentEn
                                    ?.split(" ")
                                    .map((word) => word.charAt(0))
                                    .join("")
                                    .toUpperCase()
                                : option.subDepartmentMr
                                    ?.split(" ")
                                    .map((word) => word.charAt(0))
                                    .join(" ")
                            }
                            onChange={handleSelectForSubDept}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  checked={selected}
                                />
                                {language === "en"
                                  ? option.subDepartmentEn
                                  : option.subDepartmentMr}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: "320px", margin: 0 }}
                                variant="standard"
                                {...params}
                                label={
                                  <FormattedLabel id="subDepartmentName" />
                                }
                              />
                            )}
                          />
                        )}
                      </Grid>
                    )}
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
                                  <FormattedLabel id="fromDate" required />
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
                      <FormHelperText>
                        {errors?.toDate ? errors.toDate.message : null}
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
                            ? "DOWNLOAD EXCEL"
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
                      variant="contained"
                      color="primary"
                      size="small"
                      endIcon={<ClearIcon />}
                      onClick={() => onCancel()}
                    >
                      <FormattedLabel id="clear" />
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
              </form>
            </Paper>
            {loading ? (
              <>
                <CommonLoader />
              </>
            ) : data.length !== 0 ? (
              <div style={{ width: "100%" }}>
                <DataGrid
                  autoHeight={true}
                  sx={{
                    overflowY: "scroll",
                    backgroundColor: "white",
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                    },
                    "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                      marginTop: "17px",
                    },

                    "& .MuiSvgIcon-root": {
                      color: "black", // change the color of the check mark here
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 0 },
                      disableExport: true,
                      disableToolbarButton: false,
                      csvOptions: { disableToolbarButton: true },
                      printOptions: { disableToolbarButton: true },
                    },
                  }}
                  rows={data ? data : []}
                  columns={columns}
                  density="compact"
                  pageSize={pageSize}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  onPageSizeChange={handlePageSizeChange}
                  disableSelectionOnClick
                />
              </div>
            ) : (
              ""
            )}
          </Box>
        </Paper>
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
          <ComponentToPrintNew reportData={data} language={language} />
        </ReportLayout>
      </div>
    </>
  );
};

class ComponentToPrintNew extends React.Component {
  render() {
    const reportData = this?.props?.reportData;

    return (
      <>
        <table className={gmReportLayoutCss.table}>
          <tr>
            <td colSpan={15} className={gmReportLayoutCss.TableTitle}>
              {this?.props?.language == "en" ? "Pending Summary" : "सारांशानुसार प्रलंबित"}
            </td>
          </tr>
          <tr>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Serial Number" : "अ.क्र."}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Department Name" : "विभाग"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Sub Department Name" : "उप-विभाग"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Area Name" : "क्षेत्राचे नाव"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Ward Name" : "प्रभागाचे नाव"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Zone Name" : "झोनचे नाव"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Zero To One" : "शून्य ते एक"}
            </td>
           
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "One To Three" : "एक ते तीन"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Three To Six" : "तीन ते सहा"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Six To One Year" : "सहा ते एक वर्ष"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Above One Year" : "एका वर्षाच्या वर"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props?.language == "en" ? "Total Count" : "एकूण संख्या"}
            </td>
          </tr>
          {reportData &&
            reportData?.map((reportData, index) => (
              <tr>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props?.language == "en" ? index + 1 : index + 1}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props?.language == "en"
                    ? reportData?.departmentName
                    : reportData?.departmentNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props?.language == "en"
                    ? reportData?.subDepartmentName
                    : reportData?.subDepartmentNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props?.language == "en"
                    ? reportData?.areaName
                    : reportData?.areaNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props?.language == "en"
                    ? reportData?.wardName
                    : reportData?.wardNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props?.language == "en"
                    ? reportData?.zoneName
                    : reportData?.zoneNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.zeroToOne}
                </td>
               
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.oneToThree}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.threeToSix}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.sixToOneYear}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.aboveOneYear}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.totalCount}
                </td>
              </tr>
            ))}
        </table>
      </>
    );
  }
}

export default Index;
