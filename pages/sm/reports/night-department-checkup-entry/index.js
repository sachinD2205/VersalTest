import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/system";
import {
  DatePicker,
  DateTimePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  materialEntryReportrows,
  nightDeptReportrows,
  visitorEntryReportrows,
} from "../../../../components/security/contsants";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import styles from "../../../../styles/security/reports/nightDeptCheckupEntry.module.css";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function NightDepartmentCheckUpReport() {
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  useEffect(() => {
    getDepartment();
    getZoneKeys();
    getWardKeys();
    getBuildings();
  }, []);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  );
  const token = useSelector((state) => state.user.user.token);
  const [route, setRoute] = useState(null);

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  //buildings
  const [buildings, setBuildings] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios
      .get(`${urls.SMURL}/mstBuildingMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("building master", r);
        let result = r.data.mstBuildingMasterList;
        setBuildings(result);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // Ward Keys
  const [wardKeys, setWardKeys] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [updatedWardKeys, setUpdatedWardKeys] = useState([]);
  let router = useRouter();
  // get Ward Keys
  const getWardKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getInOut = (
    fromDate,
    toDate,
    departmentKey,
    _pageSize = 10,
    _pageNo = 0
  ) => {
    setLoading(true);
    let body = {
      fromDate: moment(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
      toDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ss"),
      departmentKey: departmentKey,
    };
    axios
      .post(
        `${urls.SMURL}/trnNightDepartmentCheckUpEntry/getReportByDateOrDepartmentName`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("fromTo", res);
        setLoading(false);
        setDataSource(
          res?.data?.trnNightDepartmentCheckUpEntryList?.map((r, i) => {
            return { srNo: i + 1, ...r };
          })
        );

        if (res?.data?.trnNightDepartmentCheckUpEntryList.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
        }
        let result = res.data.trnNightDepartmentCheckUpEntryList;
        console.log("result43", result);
        let _res = result?.map((r, i) => {
          return {
            buildingKey: r.buildingKey,
            checkupDateAndTime: r.checkupDateTime
              ? moment(r.checkupDateTime).format("DD-MM-YYYY hh:mm A")
              : "-",
            departmentKey: departments?.find(
              (obj) => obj?.id == r.departmentKey
            )?.department
              ? departments?.find((obj) => obj?.id == r.departmentKey)
                  ?.department
              : "-",
            departmentOnOffStatus: r.departmentOnOffStatus,
            fanOnOffStatus: r.fanOnOffStatus ? r.fanOnOffStatus : "-",
            floor: r.floor,
            id: r.id,
            lightOnOffStatus: r.lightOnOffStatus,
            presentEmployeeCount: r.presentEmployeeCount,
            presentEmployeeName: r.presentEmployeeName,
            remark: r.remark,
            subDepartmentKey: r.subDepartmentKey,
            ward: wardKeys?.find((obj) => obj?.id == r.wardKey)?.wardName
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zone: zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              : "-",
            srNo: _pageSize * _pageNo + i + 1,
            status: r.activeFlag == "Y" ? "Active" : "Inactive",
          };
        });
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setShowReports(true);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: <FormattedLabel id="departmentName" />,
      minWidth: 220,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingKey",
      headerName: "buildingKey",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentOnOffStatus",
      headerName: "departmentOnOffStatus",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "fanOnOffStatus",
      headerName: "fanOnOffStatus",
      // flex: 1,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "floor",
      headerName: <FormattedLabel id="floor" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "lightOnOffStatus",
      headerName: "lightOnOffStatus",
      align: "center",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "presentEmployeeCount",
      headerName: <FormattedLabel id="presentEmployeeCount" />,
      align: "center",
      flex: 1,
      headerAlign: "center",
    },

    {
      hide: true,
      field: "presentEmployeeName",
      headerName: <FormattedLabel id="presentEmployeeName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "subDepartmentKey",
      headerName: "Sub Department Key",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "zone",
      headerName: "zone",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "ward",
      headerName: "ward",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      headerAlign: "center",
    },
  ];

  const columnsPetLicense = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      formattedLabel: "srNo",
      width: 60,
      align: "center",
    },
    ,
    {
      headerClassName: "cellColor",
      field: "departmentKey",
      headerAlign: "center",
      formattedLabel: "departmentName",
      width: 180,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "buildingKey",
      headerAlign: "center",
      formattedLabel: "buildingKey",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "departmentOnOffStatus",
      headerAlign: "center",
      formattedLabel: "DepartmentOpen_Close",
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "fanOnOffStatus",
      headerAlign: "center",
      formattedLabel: "FanOn_Off",
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "floor",
      headerAlign: "center",
      formattedLabel: "floor",
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "lightOnOffStatus",
      headerAlign: "center",
      formattedLabel: "LightOn_Off",
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "remark",
      headerAlign: "center",
      formattedLabel: "remark",
      width: 100,
      align: "center",
    },
  ];

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
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

  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Grid
        container
        sx={{
          backgroundColor: "#556CD6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30,
          padding: "5px",
          // background:
          //   "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            onClick={() => {
              router.push("/sm/dashboard");
            }}
            variant="outlined"
            color="success"
            sx={{ color: "white" }}
          >
            {language === "en" ? "Back To home" : "मुखपृष्ठ"}
          </Button>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              color: "white",
              fontSize: "19px",
            }}
          >
            <strong>
              {language === "en"
                ? "Night Department Checkup Entry Report"
                : "रात्री विभाग तपासणी प्रवेश अहवाल"}
            </strong>
          </Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            color="success"
            sx={{ color: "white" }}
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            {language === "en" ? "Print" : "प्रत काढा"}
          </Button>
        </Grid>
      </Grid>

      <Box>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Grid container sx={{ padding: "10px", justifyContent: "center" }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ width: "90%" }}
                  error={errors.departmentKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="departmentName" />
                  </InputLabel>
                  <Controller
                    name="departmentKey"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        fullWidth
                        label={<FormattedLabel id="departmentName" />}
                      >
                        {departments?.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.id}>
                              {item.department}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                  <FormHelperText>
                    {errors.departmentKey ? errors.departmentKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl style={{ marginTop: 10 }}>
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={moment().startOf("day")}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          {...field}
                          ampm={false}
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
                          label={
                            <span style={{ fontSize: 16 }}>
                              {language === "en" ? "From Date" : "पासून"}
                            </span>
                          }
                          value={field.value}
                          // onChange={(date) => field.onChange(date)}
                          onChange={(date) => field.onChange(date)}
                          // defaultValue={new Date()}
                          inputFormat="DD-MM-YYYY HH:mm:ss"
                        />
                        {/* <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>{language === "en" ? "From Date" : "पासून"}</span>
                        }
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
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
                      /> */}
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {/* {errors?.fromDate ? errors.fromDate.message : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl style={{ marginTop: 10 }}>
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={new Date()}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          {...field}
                          ampm={false}
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
                          label={
                            <span style={{ fontSize: 16 }}>
                              {language === "en" ? "To Date" : "पर्यंत"}
                            </span>
                          }
                          value={field.value}
                          minDate={watch("fromDate")}
                          maxDate={new Date()}
                          // onChange={(date) => field.onChange(date)}
                          onChange={(date) => field.onChange(date)}
                          // defaultValue={new Date()}
                          inputFormat="DD-MM-YYYY HH:mm:ss"
                        />
                        {/* <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>{language === "en" ? "To Date" : "पर्यंत"}</span>
                        }
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        center
                        minDate={watch("fromDate")}
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
                      /> */}
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {/* {errors?.toDate ? errors.toDate.message : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
      </Box>

      <Grid
        container
        sx={{ display: "flex", justifyContent: "center", marginBottom: "2vh" }}
      >
        <Button
          variant="contained"
          size="small"
          disabled={watch("fromDate") == null || watch("toDate") == null}
          onClick={() => {
            getInOut(
              watch("fromDate"),
              watch("toDate"),
              watch("departmentKey")
            );
          }}
        >
          {language === "en" ? "Search" : "शोधा"}
        </Button>
      </Grid>

      <Box style={{ display: "flex", justifyContent: "center" }}>
        <ReportLayout
          centerHeader
          centerData
          rows={data.rows}
          columns={columnsPetLicense}
          showDates
          date={{
            from: moment(watch("fromDate")).format("DD/MM/YYYY"),
            to: moment(watch("toDate")).format("DD/MM/YYYY"),
          }}
          deptName={{
            en: "Security Management System",
            mr: "सुरक्षा व्यवस्थापन प्रणाली",
          }}
          reportName={{
            en: "Night Department Checkup Entry Report",
            mr: "रात्री विभाग तपासणी नोंद अहवाल",
          }}
          componentRef={componentRef}
        />
        {/* <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight
          sx={{
            overflowY: "scroll",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          density="compact"
          pagination
          paginationMode="server"
          rows={data ? data.rows : []}
          columns={columns}
        /> */}
      </Box>

      {/* <Box sx={{ paddingTop: "10px" }}>
        <ComponentToPrint
          data={{ dataSource, language, ...menu, route, departments, wardKeys, zoneKeys, watch }}
          ref={componentRef}
        />
      </Box> */}
    </>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper>
              <table className={styles.report}>
                <thead className={styles.head}>
                  <tr>
                    <th colSpan={8}>
                      {
                        this?.props?.data?.language === "en"
                          ? this.props.data.menuNameEng
                          : // "Application Details Report"
                            this.props.data.menuNameMr
                        /* "अर्ज तपशील अहवाल" */
                      }
                    </th>
                  </tr>
                </thead>
                <thead className={styles.head}>
                  <tr>
                    <th colSpan={4}>
                      {this.props.data.watch("fromDate") &&
                        (this?.props?.data?.language === "en"
                          ? "From Date"
                          : "पासून") +
                          ":" +
                          moment(this.props.data.watch("fromDate")).format(
                            "DD/MM/YYYY"
                          )}
                    </th>
                    <th colSpan={4}>
                      {this.props.data.watch("toDate") &&
                        (this?.props?.data?.language === "en"
                          ? "To Date"
                          : "तारखेपर्यंत") +
                          ":" +
                          moment(this.props.data.watch("toDate")).format(
                            "DD/MM/YYYY"
                          )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Check up Date & Time"
                        : "तारीख आणि वेळ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Department Name"
                        : "विभागाचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Floor" : "मजला"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Dept On Off Status"
                        : "विभाग उघडा/बंद"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Fan On Off Status"
                        : "पंखा ऑन/ऑफ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Light On Off Status"
                        : "लाईट ऑन/ऑफ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Remark"
                        : "टिप्पणी"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Ward" : "प्रभाग"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Zone" : "झोन"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language == "en"
                              ? moment(r.checkupDateTime).format(
                                  "DD-MM-YYYY hh:mm A"
                                )
                              : "-"}
                            {/* {this?.props?.data?.language === "en" ? r?.zone?.zoneName : r?.zone?.zoneNameMr} */}
                          </td>

                          <td>
                            {this?.props?.data?.language == "en"
                              ? this?.props?.data?.departments?.find(
                                  (obj) => obj?.id === r?.departmentKey
                                )?.department
                              : "-"}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r.floor
                              : "-"}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r.departmentOnOffStatus
                              : "-"}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r.fanOnOffStatus
                              : "-"}
                          </td>
                          <td>
                            {" "}
                            {this?.props?.data?.language === "en"
                              ? r.lightOnOffStatus
                              : "-"}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r.remark
                              : "-"}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? this?.props?.data?.wardKeys?.find((obj) => {
                                  return obj?.id == r.wardKey;
                                })?.wardName
                              : "-"}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? this?.props?.data?.zoneKeys?.find(
                                  (obj) => obj?.id == r.zoneKey
                                )?.zoneName
                              : "-"}
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}

export default NightDepartmentCheckUpReport;
