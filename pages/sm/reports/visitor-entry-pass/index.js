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
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/security/reports/visitorInOutEntry.module.css";
import urls from "../../../../URLS/urls";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function VisitorEntryPassReport() {
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
  const [departments, setDepartments] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showReports, setShowReports] = useState(false);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDepartment();
  }, []);

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("dept", res);
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
        `${urls.SMURL}/trnVisitorEntryPass/getReportByDateOrDepartmentName`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res, i) => {
        setLoading(false);
        console.log("fromTo", res);
        setDataSource(
          res?.data?.trnVisitorEntryPassList?.map((r, i) => {
            console.log("fromTo34", r);
            return { srNo: i + 1, ...r };
          })
        );

        if (res?.data?.trnVisitorEntryPassList.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
        }

        let result = res?.data?.trnVisitorEntryPassList;
        let _res = result?.map((r, index) => {
          return {
            ...r,
            fromDate: r.inTime
              ? moment(r.inTime, "YYYY-MM-DD hh:mm A").format(
                  "DD-MM-YYYY hh:mm A"
                )
              : "Not Available",
            toDate: r.outTime
              ? moment(r.outTime, "YYYY-MM-DD hh:mm A").format(
                  "DD-MM-YYYY hh:mm A"
                )
              : "Not Available",
            id: r.id,
            srNo: _pageSize * _pageNo + index + 1,
            visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            toWhoomWantToMeet: r.toWhomWantToMeet,
            meetingReason: r.purpose,
            visitorOut: r.visitorStatus === "O" ? "Yes" : "No",
            visitorVisitedCount: r.visitorEntryNumber,
            departmentName: r?.departmentKeysList
              ? JSON.parse(r?.departmentKeysList)
                  ?.map((val) => {
                    return departments?.find((obj) => {
                      return obj?.id == val && obj;
                    })?.department;
                  })
                  ?.toString()
              : "-",
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
      headerName: "Sr No",
      flex: 1,
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: "From Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: "To Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "visitorName",
      headerName: "Visitor Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "toWhoomWantToMeet",
      headerName: "To Whoom Want To Meet",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "meetingReason",
      headerName: "Meeting Reason",
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "visitorOUT",
      headerName: "Visitor OUT",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "visitorVisitedCount",
      headerName: "Visitor visited Count",
      flex: 1,
      headerAlign: "center",
    },
  ];

  const table = [
    {
      id: 1,
      label1: "1",
      label2: "1",
      label3: "1",
      label4: "1",
      label5: "1",
      label6: "1",
      label6: "1",
    },
    {
      id: 2,
      label1: "2",
      label2: "2",
      label3: "2",
      label4: "2",
      label5: "2",
      label6: "2",
      label6: "2",
    },
  ];

  const columnsPetLicense = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      formattedLabel: "srNo",
      width: 40,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "fromDate",
      headerAlign: "center",
      formattedLabel: "fromDate",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "toDate",
      headerAlign: "center",
      formattedLabel: "toDate",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "visitorName",
      headerAlign: "center",
      formattedLabel: "visitorName",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "departmentName",
      headerAlign: "center",
      formattedLabel: "departmentName",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "toWhomWantToMeet",
      headerAlign: "center",
      formattedLabel: "toWhomWantToMeet",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "meetingReason",
      headerAlign: "center",
      formattedLabel: "meetingReason",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "priority",
      headerAlign: "center",
      formattedLabel: "priority",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "mobileNumber",
      headerAlign: "center",
      formattedLabel: "mobileNumber",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "visitorOut",
      headerAlign: "center",
      formattedLabel: "visitorOut",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "visitorVisitedCount",
      headerAlign: "center",
      formattedLabel: "visitorVisitedCount",
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
    <Box>
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
                  ? "Visitor In/Out Entry Report"
                  : "अभ्यागत प्रवेश अहवाल"}
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
              <Grid
                container
                sx={{ padding: "10px", justifyContent: "center" }}
              >
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
                      {errors.departmentKey
                        ? errors.departmentKey.message
                        : null}
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
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
          }}
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

        <div style={{ display: "flex", justifyContent: "center" }}>
          {showReports ? (
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
                en: "Visitor In/Out Entry Report",
                mr: "अभ्यागत आत/बाहेर प्रवेश अहवाल",
              }}
              componentRef={componentRef}
            />
          ) : (
            ""
          )}
        </div>

        {/* <Box sx={{}}>
          <DataGrid
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
            // pageSize={100}
            // rowsPerPageOptions={[10]}
            columns={columns}
          />
        </Box> */}
      </Paper>
    </Box>
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
                    <th colSpan={11}>
                      {this?.props?.data?.language === "en"
                        ? this.props.data.menuNameEng
                        : this.props.data.menuNameMr}
                    </th>
                  </tr>
                </thead>
                <thead className={styles.head}>
                  <tr>
                    <th colSpan={6}>
                      {this.props.data.watch("fromDate") &&
                        (this?.props?.data?.language === "en"
                          ? "From Date"
                          : "पासून") +
                          ":" +
                          moment(this.props.data.watch("fromDate")).format(
                            "DD/MM/YYYY"
                          )}
                    </th>
                    <th colSpan={6}>
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
                        ? "From Date"
                        : "या तारखेपासून"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "To Date"
                        : "आजपर्यंत"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Visitor Name"
                        : "अभ्यागताचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Department Name"
                        : "विभागाचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "To Whoom Want To Meet"
                        : "ज्याला भेटायचे आहे"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Meeting Reason"
                        : "उद्देश"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Priority"
                        : "प्राधान्य"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Mobile Number"
                        : "मोबाईल नंबर"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Visitor OUT"
                        : "अभ्यागत बाहेर"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Visitor visited Count"
                        : "भेट दिलेली संख्या"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language == "en"
                              ? moment(r?.inTime).format("DD-MM-YYYY hh:mm:ss")
                              : moment(r?.inTime).format("DD-MM-YYYY hh:mm:ss")}
                          </td>

                          <td>
                            {/* {this?.props?.data?.language == "en"
                              ? moment(r.outTime).format("DD-MM-YYYY hh:mm:ss")
                              : moment(r.outTime).format("DD-MM-YYYY hh:mm:ss")} */}
                            {this?.props?.data?.language === "en"
                              ? r?.outTime
                                ? moment(r?.outTime).format(
                                    "DD-MM-YYYY hh:mm:ss"
                                  )
                                : "Visitor In"
                              : moment(r?.outTime).format(
                                  "DD-MM-YYYY hh:mm:ss"
                                )}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.visitorName
                              : r?.visitorName}
                          </td>
                          <td>
                            {this?.props?.data?.language == "en"
                              ? JSON.parse(r?.departmentKeysList)
                                  ?.map((val) => {
                                    return this?.props?.data?.departments?.find(
                                      (obj) => {
                                        return obj?.id == val && obj;
                                      }
                                    )?.department;
                                  })
                                  ?.toString()
                              : JSON.parse(r?.departmentKeysList)
                                  ?.map((val) => {
                                    return this?.props?.data?.departments?.find(
                                      (obj) => {
                                        return obj?.id == val && obj;
                                      }
                                    )?.department;
                                  })
                                  ?.toString()}
                          </td>
                          <td>
                            {" "}
                            {this?.props?.data?.language === "en"
                              ? r?.toWhomWantToMeet
                              : r?.toWhomWantToMeet}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.purpose
                              : r?.purpose}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.priority
                              : r?.priority}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.mobileNumber
                              : r?.mobileNumber}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.visitorStatus === "I"
                                ? "In"
                                : "Out"
                              : r?.visitorStatus === "I"
                              ? "In"
                              : "Out"}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.visitorEntryNumber
                              : r?.visitorEntryNumber}
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
export default VisitorEntryPassReport;

// import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
// import Paper from "@mui/material/Paper";
// import { Box } from "@mui/system";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import axios from "axios";
// import moment from "moment";
// import { useRouter } from "next/router";
// import React, { useEffect, useRef, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { useReactToPrint } from "react-to-print";
// import { toast } from "react-toastify";
// import Loader from "../../../../containers/Layout/components/Loader";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import styles from "../../../../styles/security/reports/visitorInOutEntry.module.css";
// import urls from "../../../../URLS/urls";

// function VisitorEntryPassReport() {
//   const {
//     register,
//     control,
//     handleSubmit,
//     methods,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: "all",
//     mode: "onChange",
//   });

//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   let language = useSelector((state) => state.labels.language);
//   let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
//   let menu = useSelector((state) => state?.user?.user?.menus?.find((m) => m?.id == selectedMenu));
//   const [route, setRoute] = useState(null);
//   const [departments, setDepartments] = useState([]);

//   const [dataSource, setDataSource] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const [data, setData] = useState({
//     rows: [],
//     totalRows: 0,
//     rowsPerPageOptions: [10, 20, 50, 100],
//     pageSize: 10,
//     page: 1,
//   });

//   useEffect(() => {
//     getDepartment();
//   }, []);

//   const getDepartment = () => {
//     axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
//       console.log("dept", res);
//       setDepartments(
//         res.data.department.map((r, i) => ({
//           id: r.id,
//           department: r.department,
//         })),
//       );
//     });
//   };

//   const getInOut = (fromDate, toDate, departmentKey, _pageSize = 10, _pageNo = 0) => {
//     console.log("fromDate, toDate", fromDate, toDate);
//     setLoading(true);
//     let body = {
//       fromDate: moment(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
//       toDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ss"),
//       departmentKey: departmentKey
//     }
//     axios
//       .post(`${urls.SMURL}/trnVisitorEntryPass/getReportByDateOrDepartmentName`, body)
//       .then((res, i) => {
//         setLoading(false);
//         console.log("fromTo", res);
//         setDataSource(
//           res?.data?.trnVisitorEntryPassList?.map((r, i) => {
//             console.log("fromTo34", r);
//             return { srNo: i + 1, ...r };
//           }),
//         );

//         if (res?.data?.trnVisitorEntryPassList.length === 0) {
//           toast("No Data Available", {
//             type: "error",
//           });
//         }

//         let result = res?.data?.trnVisitorEntryPassList;
//         let _res = result?.map((r, index) => {
//           return {
//             ...r,
//             fromDate: r.inTime
//               ? moment(r.inTime, "DD-MM-YYYY hh:mm A").format("DD-MM-YYYY hh:mm A")
//               : "Not Available",
//             toDate: r.outTime
//               ? moment(r.outTime, "DD-MM-YYYY hh:mm A").format("DD-MM-YYYY hh:mm A")
//               : "Not Available",
//             id: r.id,
//             srNo: _pageSize * _pageNo + index + 1,
//             visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
//             status: r.activeFlag === "Y" ? "Active" : "Inactive",
//             toWhoomWantToMeet: r.toWhomWantToMeet,
//             meetingReason: r.purpose,
//             visitorOUT: r.visitorStatus === "O" ? "Yes" : "No",
//             visitorVisitedCount: r.visitorEntryNumber,
//           };
//         });
//         setData({
//           rows: _res,
//           totalRows: res.data.totalElements,
//           rowsPerPageOptions: [10, 20, 50, 100],
//           pageSize: res.data.pageSize,
//           page: res.data.pageNo,
//         });
//       });
//   };

//   const columns = [
//     {
//       field: "srNo",
//       headerName: "Sr No",
//       flex: 1,
//       maxWidth: 60,
//       // align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "fromDate",
//       headerName: "From Date",
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "toDate",
//       headerName: "To Date",
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "visitorName",
//       headerName: "Visitor Name",
//       flex: 1,
//       headerAlign: "center",
//     },
//     {
//       field: "departmentName",
//       headerName: "Department Name",
//       // type: "number",
//       flex: 1,
//       headerAlign: "center",
//     },
//     {
//       field: "toWhoomWantToMeet",
//       headerName: "To Whoom Want To Meet",
//       // type: "number",
//       flex: 1,
//       headerAlign: "center",
//     },
//     {
//       field: "meetingReason",
//       headerName: "Meeting Reason",
//       // type: "number",
//       flex: 1,
//       headerAlign: "center",
//     },

//     {
//       field: "priority",
//       headerName: "Priority",
//       // type: "number",
//       flex: 1,
//       headerAlign: "center",
//     },
//     {
//       field: "mobileNumber",
//       headerName: "Mobile Number",
//       // type: "number",
//       flex: 1,
//       headerAlign: "center",
//     },
//     {
//       field: "visitorOUT",
//       headerName: "Visitor OUT",
//       // type: "number",
//       flex: 1,
//       headerAlign: "center",
//     },
//     {
//       field: "visitorVisitedCount",
//       headerName: "Visitor visited Count",
//       // type: "number",
//       flex: 1,
//       headerAlign: "center",
//     },
//   ];

//   return (
//     <Paper>
//       <Grid
//         container
//         sx={{
//           background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
//         }}
//       >
//         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Button
//             size="small"
//             onClick={() => {
//               router.push("/sm/dashboard");
//             }}
//             variant="contained"
//             color="primary"
//           >
//             {language === "en" ? "Back To home" : "मुखपृष्ठ"}
//           </Button>
//         </Grid>
//         <Grid item xs={8} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <h2>{language === "en" ? "Visitor In/Out Entry Report" : "अभ्यागत आत/बाहेर प्रवेश अहवाल"}</h2>
//         </Grid>
//         <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Button
//             size="small"
//             variant="contained"
//             color="primary"
//             style={{ float: "right" }}
//             onClick={handlePrint}
//           >
//             {language === "en" ? "Print" : "प्रत काढा"}
//           </Button>
//         </Grid>
//       </Grid>
//       <Box>
//         {loading ? (
//           <Loader />
//         ) : (
//           <>
//             <Grid container sx={{ padding: "10px", justifyContent: "center" }}>
//               <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center" }}>
//                 <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.departmentKey}>
//                   <InputLabel id="demo-simple-select-standard-label">
//                     <FormattedLabel id="departmentName" />
//                   </InputLabel>
//                   <Controller
//                     name="departmentKey"
//                     control={control}
//                     defaultValue=""
//                     render={({ field }) => (
//                       <Select
//                         onChange={(value) => field.onChange(value)}
//                         value={field.value}
//                         fullWidth
//                         label={<FormattedLabel id="departmentName" />}
//                       >
//                         {departments?.map((item, i) => {
//                           return (
//                             <MenuItem key={i} value={item.id}>
//                               {item.department}
//                             </MenuItem>
//                           );
//                         })}
//                       </Select>
//                     )}
//                   />
//                   <FormHelperText>
//                     {errors.departmentKey ? errors.departmentKey.message : null}
//                   </FormHelperText>
//                 </FormControl>
//               </Grid>
//             </Grid>
//             <Grid container sx={{ padding: "10px" }}>
//               <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center" }}>
//                 <FormControl style={{ marginTop: 10 }}>
//                   <Controller
//                     control={control}
//                     name="fromDate"
//                     defaultValue={null}
//                     render={({ field }) => (
//                       <LocalizationProvider dateAdapter={AdapterMoment}>
//                         <DateTimePicker
//                           {...field}
//                           ampm={false}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               size="small"
//                               fullWidth
//                               InputLabelProps={{
//                                 style: {
//                                   fontSize: 12,
//                                   marginTop: 3,
//                                 },
//                               }}
//                             />
//                           )}
//                           label={
//                             <span style={{ fontSize: 16 }}>{language === "en" ? "From Date" : "पासून"}</span>
//                           } value={field.value}
//                           // onChange={(date) => field.onChange(date)}
//                           onChange={(date) => field.onChange(date)}

//                           // defaultValue={new Date()}
//                           inputFormat="DD-MM-YYYY HH:mm:ss"
//                         />
//                         {/* <DatePicker
//                         inputFormat="DD/MM/YYYY"
//                         label={
//                           <span style={{ fontSize: 16 }}>{language === "en" ? "From Date" : "पासून"}</span>
//                         }
//                         value={field.value}
//                         onChange={(date) => field.onChange(date)}
//                         selected={field.value}
//                         center
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             size="small"
//                             fullWidth
//                             InputLabelProps={{
//                               style: {
//                                 fontSize: 12,
//                                 marginTop: 3,
//                               },
//                             }}
//                           />
//                         )}
//                       /> */}
//                       </LocalizationProvider>
//                     )}
//                   />
//                   <FormHelperText>{/* {errors?.fromDate ? errors.fromDate.message : null} */}</FormHelperText>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center" }}>
//                 <FormControl style={{ marginTop: 10 }}>
//                   <Controller
//                     control={control}
//                     name="toDate"
//                     defaultValue={null}
//                     render={({ field }) => (
//                       <LocalizationProvider dateAdapter={AdapterMoment}>
//                         <DateTimePicker
//                           {...field}
//                           ampm={false}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               size="small"
//                               fullWidth
//                               InputLabelProps={{
//                                 style: {
//                                   fontSize: 12,
//                                   marginTop: 3,
//                                 },
//                               }}
//                             />
//                           )}
//                           label={
//                             <span style={{ fontSize: 16 }}>{language === "en" ? "To Date" : "पर्यंत"}</span>
//                           } value={field.value}
//                           // onChange={(date) => field.onChange(date)}
//                           onChange={(date) => field.onChange(date)}

//                           // defaultValue={new Date()}
//                           inputFormat="DD-MM-YYYY HH:mm:ss"
//                         />
//                         {/* <DatePicker
//                         inputFormat="DD/MM/YYYY"
//                         label={
//                           <span style={{ fontSize: 16 }}>{language === "en" ? "To Date" : "पर्यंत"}</span>
//                         }
//                         value={field.value}
//                         onChange={(date) => field.onChange(date)}
//                         selected={field.value}
//                         center
//                         minDate={watch("fromDate")}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             size="small"
//                             fullWidth
//                             InputLabelProps={{
//                               style: {
//                                 fontSize: 12,
//                                 marginTop: 3,
//                               },
//                             }}
//                           />
//                         )}
//                       /> */}
//                       </LocalizationProvider>
//                     )}
//                   />
//                   <FormHelperText>{/* {errors?.toDate ? errors.toDate.message : null} */}</FormHelperText>
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </>
//         )}
//       </Box>
//       <Grid container sx={{ display: "flex", justifyContent: "center" }}>
//         <Button
//           variant="contained"
//           size="small"
//           disabled={watch("fromDate") == null || watch("toDate") == null}
//           onClick={() => {
//             getInOut(watch("fromDate"), watch("toDate"), watch('departmentKey'));
//           }}
//         >
//           {language === "en" ? "Search" : "शोधा"}
//         </Button>
//       </Grid>

//       <Box sx={{}}>
//         <DataGrid
//           components={{ Toolbar: GridToolbar }}
//           componentsProps={{
//             toolbar: {
//               showQuickFilter: true,
//               quickFilterProps: { debounceMs: 500 },
//             },
//           }}
//           autoHeight
//           sx={{
//             overflowY: "scroll",
//             "& .MuiDataGrid-virtualScrollerContent": {},
//             "& .MuiDataGrid-columnHeadersInner": {
//               backgroundColor: "#556CD6",
//               color: "white",
//             },
//             "& .MuiDataGrid-cell:hover": {
//               color: "primary.main",
//             },
//           }}
//           density="compact"
//           pagination
//           paginationMode="server"
//           rows={data ? data.rows : []}
//           // pageSize={100}
//           // rowsPerPageOptions={[10]}
//           columns={columns}
//         />
//       </Box>

//       {/* <Box sx={{ paddingTop: "10px" }}>
//         <ComponentToPrint
//           data={{ dataSource, language, ...menu, route, departments, watch }}
//           ref={componentRef}
//         />
//       </Box> */}
//     </Paper>
//   );
// }

// class ComponentToPrint extends React.Component {
//   render() {
//     return (
//       <>
//         <div>
//           <div>
//             <Paper>
//               <table className={styles.report}>
//                 <thead className={styles.head}>
//                   <tr>
//                     <th colSpan={11}>
//                       {
//                         this?.props?.data?.language === "en"
//                           ? this.props.data.menuNameEng
//                           : // "Application Details Report"
//                           this.props.data.menuNameMr
//                         /* "अर्ज तपशील अहवाल" */
//                       }
//                     </th>
//                   </tr>
//                 </thead>
//                 <thead className={styles.head}>
//                   <tr>
//                     <th colSpan={6}>
//                       {this.props.data.watch("fromDate") &&
//                         (this?.props?.data?.language === "en" ? "From Date" : "पासून") +
//                         ":" +
//                         moment(this.props.data.watch("fromDate")).format("DD/MM/YYYY")}
//                     </th>
//                     <th colSpan={6}>
//                       {this.props.data.watch("toDate") &&
//                         (this?.props?.data?.language === "en" ? "To Date" : "तारखेपर्यंत") +
//                         ":" +
//                         moment(this.props.data.watch("toDate")).format("DD/MM/YYYY")}
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th colSpan={1}>{this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}</th>
//                     <th colSpan={1}>
//                       {this?.props?.data?.language === "en" ? "From Date" : "या तारखेपासून"}
//                     </th>
//                     <th colSpan={1}>{this?.props?.data?.language === "en" ? "To Date" : "आजपर्यंत"}</th>
//                     <th colSpan={1}>
//                       {this?.props?.data?.language === "en" ? "Visitor Name" : "अभ्यागताचे नाव"}
//                     </th>
//                     <th colSpan={1}>
//                       {this?.props?.data?.language === "en" ? "Department Name" : "विभागाचे नाव"}
//                     </th>
//                     <th colSpan={1}>
//                       {this?.props?.data?.language === "en" ? "To Whoom Want To Meet" : "ज्याला भेटायचे आहे"}
//                     </th>
//                     <th colSpan={1}>{this?.props?.data?.language === "en" ? "Meeting Reason" : "उद्देश"}</th>
//                     <th colSpan={1}>{this?.props?.data?.language === "en" ? "Priority" : "प्राधान्य"}</th>
//                     <th colSpan={1}>
//                       {this?.props?.data?.language === "en" ? "Mobile Number" : "मोबाईल नंबर"}
//                     </th>
//                     <th colSpan={1}>
//                       {this?.props?.data?.language === "en" ? "Visitor OUT" : "अभ्यागत बाहेर"}
//                     </th>
//                     <th colSpan={1}>
//                       {this?.props?.data?.language === "en" ? "Visitor visited Count" : "भेट दिलेली संख्या"}
//                     </th>
//                   </tr>
//                   {this?.props?.data?.dataSource &&
//                     this?.props?.data?.dataSource?.map((r, i) => (
//                       <>
//                         <tr>
//                           <td>{i + 1}</td>
//                           <td>
//                             {this?.props?.data?.language == "en"
//                               ? moment(r?.inTime).format("DD-MM-YYYY hh:mm:ss")
//                               : moment(r?.inTime).format("DD-MM-YYYY hh:mm:ss")}
//                           </td>

//                           <td>
//                             {/* {this?.props?.data?.language == "en"
//                               ? moment(r.outTime).format("DD-MM-YYYY hh:mm:ss")
//                               : moment(r.outTime).format("DD-MM-YYYY hh:mm:ss")} */}
//                             {this?.props?.data?.language === "en"
//                               ? r?.outTime
//                                 ? moment(r?.outTime).format("DD-MM-YYYY hh:mm:ss")
//                                 : "Visitor In"
//                               : moment(r?.outTime).format("DD-MM-YYYY hh:mm:ss")}
//                           </td>

//                           <td>{this?.props?.data?.language === "en" ? r?.visitorName : r?.visitorName}</td>
//                           <td>
//                             {this?.props?.data?.language == "en"
//                               ? JSON.parse(r?.departmentKeysList)
//                                 ?.map((val) => {
//                                   return this?.props?.data?.departments?.find((obj) => {
//                                     return obj?.id == val && obj;
//                                   })?.department;
//                                 })
//                                 ?.toString()
//                               : JSON.parse(r?.departmentKeysList)
//                                 ?.map((val) => {
//                                   return this?.props?.data?.departments?.find((obj) => {
//                                     return obj?.id == val && obj;
//                                   })?.department;
//                                 })
//                                 ?.toString()}
//                           </td>
//                           <td>
//                             {" "}
//                             {this?.props?.data?.language === "en" ? r?.toWhomWantToMeet : r?.toWhomWantToMeet}
//                           </td>
//                           <td>{this?.props?.data?.language === "en" ? r?.purpose : r?.purpose}</td>
//                           <td>{this?.props?.data?.language === "en" ? r?.priority : r?.priority}</td>
//                           <td>{this?.props?.data?.language === "en" ? r?.mobileNumber : r?.mobileNumber}</td>
//                           <td>
//                             {this?.props?.data?.language === "en"
//                               ? r?.visitorStatus === "I"
//                                 ? "In"
//                                 : "Out"
//                               : r?.visitorStatus === "I"
//                                 ? "In"
//                                 : "Out"}
//                           </td>
//                           <td>
//                             {this?.props?.data?.language === "en"
//                               ? r?.visitorEntryNumber
//                               : r?.visitorEntryNumber}
//                           </td>
//                         </tr>
//                       </>
//                     ))}
//                 </tbody>
//               </table>
//             </Paper>
//           </div>
//         </div>
//       </>
//     );
//   }
// }
// export default VisitorEntryPassReport;
