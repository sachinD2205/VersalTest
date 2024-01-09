import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "../../../../styles/security/reports/vehicleInOutEntry.module.css";
import urls from "../../../../URLS/urls";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function VehicleEntryReport() {
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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const getInOut = (fromDate, toDate, _pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    let body = {
      fromDate: moment(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
      toDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ss"),
    };
    axios
      .post(
        `${urls.SMURL}/trnVehicleInOut/getReportByDateOrVehicleNumberOrDriverNameOrDriverNumber`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log("fromTo", res);

        setDataSource(
          res?.data?.trnVehicleInOutList?.map((r, i) => {
            console.log("11r", r);
            // return { srNo: i + 1, ...r };
            return {
              ...r,
              inTime: r.inTime,
              inTimeFormatted: r.inTime
                ? moment(r.inTime).format("DD-MM-YYYY hh:mm:ss")
                : "",
              outTime: r.outTime,
              outTimeFormatted: r.outTime
                ? moment(r.outTime).format("DD-MM-YYYY hh:mm:ss")
                : "",
              activeFlag: r.activeFlag,
              id: r.id,

              srNo: _pageSize * _pageNo + i + 1,
              inOutStatus: r.inOutStatus === "I" ? "In" : "Out",
              vehicalEntry: r.vehicalEntry,
              vehicalEntryMr: r.vehicalEntryMr,
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          })
        );

        if (res?.data?.trnVehicleInOutList.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
          setShowReports(false);
        }

        setShowReports(true);

        // let result = res.data.trnVehicleInOutList;
        // let _res = result?.map((r, i) => {
        //   return {
        //     ...r,
        //     inTime: r.inTime,
        //     inTimeFormatted: r.inTime ? moment(r.inTime).format("DD-MM-YYYY hh:mm:ss") : "",
        //     outTime: r.outTime,
        //     outTimeFormatted: r.outTime ? moment(r.outTime).format("DD-MM-YYYY hh:mm:ss") : "",
        //     activeFlag: r.activeFlag,
        //     id: r.id,

        //     srNo: _pageSize * _pageNo + i + 1,
        //     inOutStatus: r.inOutStatus === "I" ? "In" : "Out",
        //     vehicalEntry: r.vehicalEntry,
        //     vehicalEntryMr: r.vehicalEntryMr,
        //     status: r.activeFlag === "Y" ? "Active" : "Inactive",
        //   };
        // });
        // setData({
        //   rows: _res,
        //   totalRows: res.data.totalElements,
        //   rowsPerPageOptions: [10, 20, 50, 100],
        //   pageSize: res.data.pageSize,
        //   page: res.data.pageNo,
        // });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const columns = [
    // ...createColumn(),
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 1,
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "ownerStatus",
      headerName: "Owner Status",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "vehicleNumber",
      headerName: "Vehicle Number",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "vehicleType",
      headerName: "Vehicle Type",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "driverName",
      headerName: "Driver Name",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "driverNumber",
      headerName: "Driver Number",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "vehicleName",
      headerName: "Vehicle Name",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "travelDestination",
      headerName: "Travel Destination",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "approxKm",
      headerName: "Approx Km",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "driverLicenceNumber",
      headerName: "Driver Licence Number",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "meterReading",
      headerName: "Meter Reading",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "inTimeFormatted",
      headerName: "In Time",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "outTimeFormatted",
      headerName: "Out Time",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "driverAuthorization",
      headerName: "Driver Authorization",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "inOutStatus",
      headerName: "In / Out Status",
      // type: "number",
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
      width: 50,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "vehicleNumber",
      headerAlign: "center",
      formattedLabel: "vehicleNumber",
      width: 130,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "driverName",
      headerAlign: "center",
      formattedLabel: "driverName",
      width: 130,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "driverNumber",
      headerAlign: "center",
      formattedLabel: "driverNumber",
      width: 130,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "driverLicenceNumber",
      headerAlign: "center",
      formattedLabel: "driverLicenceNumber",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "inTimeFormatted",
      headerAlign: "center",
      formattedLabel: "inTime",
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "outTimeFormatted",
      headerAlign: "center",
      formattedLabel: "outTime",
      width: 160,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "inOutStatus",
      headerAlign: "center",
      formattedLabel: "inOutStatus",
      width: 120,
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
    <Paper>
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
                ? "Vehicle In/Out Entry Report"
                : "वाहन आगमन/निर्गमन नोंदणी अहवाल"}
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
        )}
      </Box>
      <Grid
        container
        sx={{ display: "flex", justifyContent: "center", padding: "2vh" }}
      >
        <Button
          variant="contained"
          size="small"
          // disabled={watch("fromDate") == null || watch("toDate") == null}
          onClick={() => {
            getInOut(watch("fromDate"), watch("toDate"));
          }}
        >
          {language === "en" ? "Search" : "शोधा"}
        </Button>
      </Grid>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        {showReports ? (
          <ReportLayout
            centerHeader
            centerData
            rows={dataSource}
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
              en: "Vehicle In/Out Entry Report",
              mr: "वाहनाच्या आत/बाहेर प्रवेश अहवाल",
            }}
            componentRef={componentRef}
          />
        ) : (
          ""
        )}

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
          rows={dataSource ? dataSource : []}
          // pageSize={100}
          // rowsPerPageOptions={[10]}
          columns={columns}
        /> */}
      </Box>

      {/* <Box>
        <Box sx={{ paddingTop: "10px" }}>
          <ComponentToPrint data={{ dataSource, language, ...menu, route, watch }} ref={componentRef} />
        </Box>
      </Box> */}
    </Paper>
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
                        ? "Vehicle Number"
                        : "वाहन क्रमांक"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Driver Name"
                        : "चालकाचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Driver Number"
                        : "चालक क्रमांक"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Driver Licence Number"
                        : "चालक परवाना क्रमांक"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "In Time"
                        : "ची वेळ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Out Time"
                        : "बाहेरची वेळ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "In Out Status"
                        : "आत/बाहेर स्थिती"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language == "en"
                              ? r?.vehicleNumber
                              : r?.vehicleNumber}
                            {/* {this?.props?.data?.language === "en" ? r?.zone?.zoneName : r?.zone?.zoneNameMr} */}
                          </td>

                          <td>
                            {this?.props?.data?.language == "en"
                              ? r?.driverName
                              : r?.driverName}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.driverNumber
                              : r?.driverNumber}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.driverLicenceNumber
                              : r?.driverLicenceNumber}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.inTime
                                ? moment(r?.inTime).format(
                                    "DD-MM-YYYY hh:mm:ss"
                                  )
                                : "Vehicle Out"
                              : moment(r?.inTime).format("DD-MM-YYYY hh:mm:ss")}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.outTime
                                ? moment(r?.outTime).format(
                                    "DD-MM-YYYY hh:mm:ss"
                                  )
                                : "Vehicle In"
                              : moment(r?.outTime).format(
                                  "DD-MM-YYYY hh:mm:ss"
                                )}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.inOutStatus === "I"
                                ? "In"
                                : "Out"
                              : r?.inOutStatus === "I"
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

export default VehicleEntryReport;

// import { Button, TextField, Typography } from "@mui/material";
// import Head from "next/head";
// import SearchIcon from "@mui/icons-material/Search";
// import { Box } from "@mui/system";
// import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { useState } from "react";
// import {
//   vehicleEntryReportrows,
//   visitorEntryReportrows,
// } from "../../../../components/security/contsants";

// function VehicleEntryReport() {
//   return (
//     <>
//       <Head>
//         <title>Visitor Entry Report</title>
//       </Head>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-around",
//         }}
//       >
//         <Box>
//           <Button variant="contained">Back</Button>
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             margin: "1vh 0",
//           }}
//         >
//           <Typography sx={{ margin: "0 20px" }}>From Date</Typography>

//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DesktopDatePicker
//               disabled
//               inputFormat="MM/DD/YYYY"
//               renderInput={(params) => <TextField disabled {...params} />}
//             />
//           </LocalizationProvider>
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             margin: "1vh 0",
//           }}
//         >
//           <Typography sx={{ margin: "0 20px" }}>To Date</Typography>

//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DesktopDatePicker
//               disabled
//               inputFormat="MM/DD/YYYY"
//               renderInput={(params) => <TextField disabled {...params} />}
//             />
//           </LocalizationProvider>
//         </Box>
//         <Box>
//           <Button variant="contained">Print</Button>
//         </Box>
//       </Box>
//       <TextField
//         disabled
//         style={{
//           margin: "2vh 1vw",
//           float: "right",
//         }}
//         id="outlined-basic"
//         label="Search"
//         variant="outlined"
//         prefix={<SearchIcon />}
//       />
//       <Box
//         sx={{
//           maxWidth: "83vw",
//           margin: "3rem auto",
//           clear: "both",
//         }}
//       >
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Sr.No</TableCell>
//                 <TableCell align="right">Search</TableCell>
//                 <TableCell align="right">From Date</TableCell>
//                 <TableCell align="right">To Date</TableCell>
//                 <TableCell align="right">Vehicle Type</TableCell>
//                 <TableCell align="right">Vehicle Number</TableCell>
//                 <TableCell align="right">Vehicle Driver Name</TableCell>
//                 <TableCell align="right">Mobile Number</TableCell>
//                 <TableCell align="right">Security Gaurd Name</TableCell>
//                 <TableCell align="right">Private Vehicle Name</TableCell>
//                 <TableCell align="right">Privale Driver Name</TableCell>
//                 <TableCell align="right">Vehicle Destination</TableCell>
//                 <TableCell align="right">Licence Number</TableCell>
//                 <TableCell align="right">KM to travel</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {vehicleEntryReportrows.map((row, i) => (
//                 <TableRow
//                   key={i}
//                   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                 >
//                   <TableCell component="th" scope="row">
//                     {i}
//                   </TableCell>
//                   <TableCell align="right">{row.search}</TableCell>
//                   <TableCell align="right">{row.from_date}</TableCell>
//                   <TableCell align="right">{row.to_date}</TableCell>
//                   <TableCell align="right">{row.vehicle_type}</TableCell>
//                   <TableCell align="right">{row.vehicle_number}</TableCell>
//                   <TableCell align="right">{row.vehicle_driver_name}</TableCell>
//                   <TableCell align="right">{row.mobile_number}</TableCell>
//                   <TableCell align="right">{row.security_gaurd_name}</TableCell>
//                   <TableCell align="right">
//                     {row.private_vehicle_name}
//                   </TableCell>
//                   <TableCell align="right">{row.private_driver_name}</TableCell>
//                   <TableCell align="right">{row.vehicle_destination}</TableCell>
//                   <TableCell align="right">{row.licence_number}</TableCell>
//                   <TableCell align="right">{row.km_to_travel}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </>
//   );
// }
// export default VehicleEntryReport;
