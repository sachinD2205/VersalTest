import { ThemeProvider } from "@emotion/react";
import {
  Autocomplete,
  Box,
  Button,
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
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import "jspdf-autotable";
import ListAltIcon from "@mui/icons-material/ListAlt";
import gmLabels from "../../../../containers/reuseableComponents/labels/modules/gmLabels";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import gmReportLayoutCss from "../commonCss/gmReportLayoutCss.module.css";
import XLSX from "sheetjs-style";
import FileSaver from "file-saver";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  // handlePrint
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const router = useRouter();
  const [data, setData] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [wardsValue, setWardsValue] = useState(null);
  const [selectedWardsValue, setSelectedWardsValue] = useState(null);
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const language = useSelector((store) => store.labels.language);
  const [labels, setLabels] = useState(gmLabels[language ?? "en"]);
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

  useEffect(() => {
    setLabels(gmLabels[language ?? "en"]);
  }, [setLabels, language]);

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
    wardKey: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
      wardKey: null,
    });
    setValue("searchButtonInputState", true);
    setLoading(false);
    setData([]);
    setWardsValue(null);
    setSelectedWardsValue(null);
  };

  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };

  const getAllWards = () => {
    setLoadingWards(true);
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.ward?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            wardName: r.wardName,
            wardNameMr: r.wardNameMr,
          }));
          data.sort(sortByProperty("wardName"));
          setAllWards(data);
          setLoadingWards(false);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!"
          );
          setLoadingWards(false);
        }
      })
      .catch((error) => {
          setLoadingWards(false);
          cfcErrorCatchMethod(error,true);
      });
  };

  useEffect(() => {
    getAllWards();
    setValue("searchButtonInputState", true);
  }, []);

  //////////////////////////////////

  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";

      let apiBodyToSend = {
        ward: wardsValue != null ? wardsValue : null,
        fromDate: sendFromDate,
        toDate: sendToDate,
      };

      setLoading(true);
      axios
        .post(`${urls.GM}/report/getReportWardOfficerV2`, apiBodyToSend, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data?.length > 0) {
              setValue("searchButtonInputState", false);
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,

                  departmentName: newFunctionForNullValues(
                    "en",
                    r.departmentName
                  ),
                  departmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.departmentNameMr
                  ),
                  // subDepartmentName: newFunctionForNullValues("en",r.subDepartmentName),
                  // subDepartmentNameMr: newFunctionForNullValues("mr",r.subDepartmentNameMr),

                  wardOfficerName: newFunctionForNullValues(
                    "en",
                    r.wardOfficerName
                  ),
                  wardOfficerNameMr: newFunctionForNullValues(
                    "mr",
                    r.wardOfficerNameMr
                  ),
                  mobileNo: r.mobileNo,
                  emailId: r.emailId,

                  ////////////////////NEWLY ADDED FIELDS////////////////
                  areaName: newFunctionForNullValues("en", r.areaName),
                  areaNameMr: newFunctionForNullValues("mr", r.areaNameMr),
                  wardName: newFunctionForNullValues("en", r.wardName),
                  wardNameMr: newFunctionForNullValues("mr", r.wardNameMr),
                  zoneName: newFunctionForNullValues("en", r.zoneName),
                  zoneNameMr: newFunctionForNullValues("mr", r.zoneNameMr),
                }))
              );

              let _enData = res?.data?.map((r, index) => {
                return {
                  "Sr No ": index + 1,
                  "Department Name": r?.departmentName,
                  // "Sub Department Name": r?.subDepartmentName,
                  "Ward Officer's Name": r?.wardOfficerName,
                  "Mobile / Phone No ": r?.mobileNo,
                  "Email-Id": r?.emailId,
                  "Area Name": r?.areaName,
                  "Ward Name": r?.wardName,
                  "Zone Name": r?.zoneName,
                };
              });
              let _mrData = res?.data?.map((r, index) => {
                return {
                  "अ.क्र. ": index + 1,
                  विभाग: r?.departmentNameMr,
                  // "उप-विभागाचे नाव": r?.subDepartmentNameMr,
                  "प्रभाग अधिकारीचे नाव": r?.wardOfficerNameMr,
                  "दूरध्वनी क्रमांक": r?.mobileNo,
                  "ई-मेल आयडी": r?.emailId,
                  "क्षेत्राचे नाव": r?.areaNameMr,
                  "प्रभागाचे नाव": r?.wardNameMr,
                  "झोनचे नाव": r?.zoneNameMr,
                };
              });

              setEngReportsData(_enData);
              setMrReportsData(_mrData);

              setLoading(false);
            } else {
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

  ///////////////////////////
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
      headerAlign: "left",
    },
    {
      field: language === "en" ? "wardOfficerName" : "wardOfficerNameMr",
      headerName: labels.wardOfficerName,
      minWidth: 250,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "mobileNo",
      headerName: labels.mobileNo,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "emailId",
      headerName: labels.emailIds,
      minWidth: 250,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language === "en" ? "areaName" : "areaNameMr",
      headerName: labels.areaName,
      minWidth: 200,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language === "en" ? "wardName" : "wardNameMr",
      headerName: labels.wardName,
      minWidth: 200,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language === "en" ? "zoneName" : "zoneNameMr",
      headerName: labels.zoneName,
      minWidth: 200,
      headerAlign: "center",
      align:'left'
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName = language == "en" ? "Ward Officer" : "प्रभाग अधिकारी";

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

    const fileName = language === "en" ? "Ward Officer" : "प्रभाग अधिकारी";
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
                  {language == "en" ? "Ward Officer" : "प्रभाग अधिकारी"}
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
                    justifyContent: "center",
                    alignItems: "baseline",
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
                      alignItems: "baseline",
                      marginTop: 0,
                    }}
                  >
                    {loadingWards ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="ward" />
                          </InputLabel>
                          <Select
                            variant="standard"
                            sx={{ width: "300px" }}
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <Autocomplete
                        id="disable-close-on-select"
                        disableCloseOnSelect
                        options={allWards ? allWards : []}
                        getOptionLabel={(option) =>
                          language == "en"
                            ? option?.wardName
                            : option?.wardNameMr
                        }
                        value={selectedWardsValue}
                        onChange={(event, newValue) => {
                          setWardsValue(newValue?.id ? newValue?.id : null);
                          setSelectedWardsValue(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ width: "300px", margin: 0 }}
                            label={<FormattedLabel id="ward" />}
                            variant="standard"
                          />
                        )}
                      />
                    )}
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
                      color: "primary.main",
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

    const { language } = this?.props?.language;

    return (
      <>
        <table className={gmReportLayoutCss.table}>
          <tr>
            <td colSpan={15} className={gmReportLayoutCss.TableTitle}>
              {this?.props.language == "en" ? "Ward Officer" : "प्रभाग अधिकारी"}
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
              {this?.props.language == "en"
                ? "Ward Officer's Name"
                : "प्रभाग अधिकारीचे नाव"}
            </td>

            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Mobile / Phone No"
                : "दूरध्वनी क्रमांक"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Email-Id" : "ई-मेल आयडी"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Area Name" : "क्षेत्राचे नाव"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Ward Name" : "प्रभागाचे नाव"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Zone Name" : "झोनचे नाव"}
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
                    ? reportData?.wardOfficerName
                    : reportData?.wardOfficerNameMr}
                </td>

                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.mobileNo}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.emailId}
                </td>

                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.areaName
                    : reportData?.areaNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.wardName
                    : reportData?.wardNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.zoneName
                    : reportData?.zoneNameMr}
                </td>
              </tr>
            ))}
        </table>
      </>
    );
  }
}

export default Index;
