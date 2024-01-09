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
import { useReactToPrint } from "react-to-print";
import { keyIssueEntryReportrows } from "../../../../components/security/contsants";
import React, { useEffect, useState, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../../../../styles/security/reports/deptKeyIssueReceive.module.css";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function KeyIssueEntryReport() {
  const [dataSource, setDataSource] = useState([]);
  const [pdata, setPdata] = useState([]);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [employee, setEmployee] = useState([]);
  let router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  );
  const token = useSelector((state) => state.user.user.token);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    console.log("selected menu", menu);

    if (menu?.id == 1110) {
      setRoute("Dept Key Issue Receive Entry");
    } else if (menu?.id == 123) {
      // setRoute("goshwara2");
    } else if (menu?.id == 51) {
      // setRoute("marriageCertificate");
    }
    // console.log("selected menu",menus?.find((m)=>m?.id==selectedMenu));
  }, [menu, selectedMenu]);

  useEffect(() => {
    console.log("1");
    getDepartment();
  }, []);

  useEffect(() => {
    console.log("2");
    getEmployee();
  }, [departments]);

  useEffect(() => {
    console.log("3");
    // getAllVisitors();
  }, [employee]);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res dep", res);
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

  const getEmployee = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("user ", res);
        let _res = res.data.user;

        setEmployee(
          _res.map((val) => {
            return {
              id: val.id,
              firstNameEn: val.firstNameEn,
              lastNameEn: val.lastNameEn,
            };
          })
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
    console.log("fromDate, toDate", fromDate, toDate, departmentKey);
    let body = {
      fromDate: moment(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
      toDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ss"),
      departmentKey: departmentKey,
    };
    axios
      .post(
        `${urls.SMURL}/trnDepartmentKeyInOut/getReportByDateOrDepartmentNameOrEmployeeName`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("fromTo", res);
        setDataSource(
          res?.data?.trnDepartmentKeyInOutList?.map((r, i) => {
            return { srNo: i + 1, ...r };
          })
        );

        if (res?.data?.trnDepartmentKeyInOutList.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
          setLoading(false);
        }
        setLoading(false);
        let result = res.data.trnDepartmentKeyInOutList;
        let _res = result?.map((r, i) => {
          return {
            ...r,
            departmentKey: departments?.find(
              (obj) => obj?.id === r?.departmentKey
            )?.department
              ? departments?.find((obj) => obj?.id === r?.departmentKey)
                  ?.department
              : "-",
            // employeeName: employee?.find((obj) => obj?.id === r?.employeeKey)?.firstNameEn
            //   ? employee?.find((obj) => obj?.id === r?.employeeKey)?.firstNameEn +
            //     " " +
            //     employee?.find((obj) => obj?.id === r?.employeeKey)?.lastNameEn
            //   : "-",
            // employeeName: r.employeeKey,
            employeeName: r.employeeName,
            id: r.id,
            keyIssueAt: r.keyIssueAt
              ? moment(r.keyIssueAt).format("DD-MM-YYYY hh:mm A")
              : "-",
            keyReceivedAt: r.keyReceivedAt
              ? moment(r.keyReceivedAt).format("DD-MM-YYYY hh:mm A")
              : "-",
            keyStatus: r.keyStatus,
            mobileNumber: r.mobileNumber,
            subDepartmentKey: r.subDepartmentKey,
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            // srNo: i + 1,
            visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        // setData({
        //   rows: _res,
        //   totalRows: res.data.totalElements,
        //   rowsPerPageOptions: [10, 20, 50, 100],
        //   pageSize: res.data.pageSize,
        //   page: res.data.pageNo,
        // });
        setPdata(_res);
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
    // {
    //   hide: false,
    //   field: "employeeKey",
    //   headerName: "Employee Key",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      hide: false,
      field: "employeeName",
      headerName: <FormattedLabel id="employeeName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyIssueAt",
      headerName: <FormattedLabel id="keyIssueAt" />,
      // flex: 1,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyReceivedAt",
      headerName: <FormattedLabel id="keyReceivedAt" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyStatus",
      headerName: <FormattedLabel id="keyStatus" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "mobileNumber",
      headerName: <FormattedLabel id="mobileNumber" />,
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
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "employeeName",
      headerAlign: "center",
      formattedLabel: "employeeName",
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "keyIssueAt",
      headerAlign: "center",
      formattedLabel: "keyIssueAt",
      width: 180,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "keyReceivedAt",
      headerAlign: "center",
      formattedLabel: "keyReceivedAt",
      width: 180,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "keyStatus",
      headerAlign: "center",
      formattedLabel: "keyStatus",
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "mobileNumber",
      headerAlign: "center",
      formattedLabel: "mobileNumber",
      width: 160,
      align: "center",
    },
  ];

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    router.push("/sm/dashboard");
  };

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    console.log(":generateCSVFile", data);

    const csv = [
      columns
        .map((c) => c.headerName)
        .map((obj) => obj?.props?.id)
        .join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    // downloadLink.download = "data.csv";
    downloadLink.download = "data.csv";
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  //////////////////////////////////////////
  function generatePDF(data) {
    const columnsData = columns
      .map((c) => c.headerName)
      .map((obj) => obj?.props?.id);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));
    console.log(
      ":45",
      columns.map((c) => c.headerName).map((obj) => obj)
    );
    const doc = new jsPDF();
    doc.autoTable({
      head: [columnsData],
      body: rowsData,
    });
    doc.save("datagrid.pdf");
  }

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
                ? "Department Key Issue Received Entry Report"
                : "विभाग चावी जारी/प्राप्त नोंद अहवाल"}
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
          // <Box sx={{}}>
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
          <Paper elevation={4} style={{ width: "auto" }}>
            <Button
              disabled={watch("fromDate") == null || watch("toDate") == null}
              onClick={() => {
                getInOut(
                  watch("fromDate"),
                  watch("toDate"),
                  watch("departmentKey")
                );
              }}
              type="submit"
              size="small"
              variant="contained"
            >
              {language === "en" ? "Search" : "शोधा"}
            </Button>
          </Paper>
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
          <Paper elevation={4} style={{ width: "auto" }}>
            <Button
              disabled={pdata?.length > 0 ? false : true}
              type="button"
              size="small"
              variant="contained"
              color="success"
              endIcon={<DownloadIcon />}
              onClick={() => generateCSVFile(pdata)}
            >
              <FormattedLabel id="downloadExcel" />
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
          <Paper elevation={4} style={{ width: "auto" }}>
            <Button
              disabled={pdata?.length > 0 ? false : true}
              type="button"
              variant="contained"
              size="small"
              color="success"
              endIcon={<DownloadIcon />}
              onClick={() => generatePDF(pdata)}
            >
              <FormattedLabel id="downloadPdf" />
            </Button>
          </Paper>
        </Grid> */}
      </Grid>

      {/* <Grid container sx={{ padding: "10px" }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="small"
            endIcon={<ClearIcon />}
            onClick={onCancel}
          >
            <FormattedLabel id="cancel" />
          </Button>
        </Grid>
      </Grid> */}

      {/* <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="small"
          disabled={watch("fromDate") == null || watch("toDate") == null}
          onClick={() => {
            getInOut(watch("fromDate"), watch("toDate"));
          }}
        >
          {language === "en" ? "Search" : "शोधा"}
        </Button>
      </Grid> */}

      <Box style={{ display: "flex", justifyContent: "center" }}>
        <ReportLayout
          centerHeader
          centerData
          rows={pdata}
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
            en: "Department Key Issue Received Entry Report",
            mr: "विभाग चावी जारी/प्राप्त नोंद अहवाल",
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
          rows={pdata ? pdata : []}
          columns={columns}
        /> */}
      </Box>
      {/* <div>
        <ComponentToPrint
          data={{ dataSource, language, ...menu, route, departments, employee, watch }}
          ref={componentRef}
        />
      </div> */}
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
                        ? "Department Name"
                        : "विभागाचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Employee Name"
                        : "कर्मचारी नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Key Issue At"
                        : "चावी दिली ती वेळ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Key Received At"
                        : "किल्ली प्राप्त झाली ती वेळ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Key Status"
                        : "चावी स्थिती"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Mobile No"
                        : "मोबाईल नं."}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Visitor Status"
                        : "अभ्यागत स्थिती"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language == "en"
                              ? this?.props?.data?.departments?.find(
                                  (obj) => obj?.id === r?.departmentKey
                                )?.department
                              : "-"}
                            {/* {this?.props?.data?.language === "en" ? r?.zone?.zoneName : r?.zone?.zoneNameMr} */}
                          </td>
                          <td>
                            {/* {this?.props?.data?.language === "en"
                              ? this?.props?.data?.employee?.find((obj) => obj?.id == r?.employeeKey)
                                  ?.firstNameEn
                              : "-"} */}
                            {this?.props?.data?.language === "en"
                              ? r.employeeKey
                              : "-"}
                          </td>
                          <td>
                            {moment(r.keyIssueAt).format("DD-MM-YYYY hh:mm A")}
                          </td>
                          <td>
                            {" "}
                            {moment(r.keyReceivedAt).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r.keyStatus
                              : r.keyStatus}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r.mobileNumber
                              : mobileNumber}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r.visitorStatus === "I"
                                ? "In"
                                : "Out"
                              : r.visitorStatus === "I"
                              ? "In"
                              : "Out"}
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

export default KeyIssueEntryReport;
