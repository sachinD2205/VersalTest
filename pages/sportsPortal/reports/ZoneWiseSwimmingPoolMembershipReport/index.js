import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
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
import styles from "../../../../styles/sportsPortalStyles/sportsBookingRegister.module.css";
import urls from "../../../../URLS/urls";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function SportsBooking() {
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
  const token = useSelector((state) => state.user.user.token);

  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  );
  const [route, setRoute] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDepartment();
    getFacilityName();
    getFacilityType();
    getTimeSlot();
    // getSportsBookingData();
  }, [facilityNames]);

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
  const getDepartment = () => {
    axios
      .get(`${urls.CfcURLMaster}/department/getAll`, {
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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const [facilityNames, setFacilityNames] = useState([]);
  const getFacilityName = () => {
    axios
      .get(`${urls.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            // facilityType: row.facilityType,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [facilityTimes, setFacilityTimes] = useState([]);
  const getTimeSlot = () => {
    axios
      .get(`${urls.SPURL}/bookingTime/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("76546453", r);
        setFacilityTimes(
          r.data.bookingTime.map((row) => ({
            id: row.id,
            facilityTime: row.fromBookingTime,
            // toBookingTime: row.toBookingTime,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [facilityTypes, setFacilityTypes] = useState([]);
  const getFacilityType = () => {
    axios
      .get(`${urls.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityTypes(
          r.data.facilityType.map((row) => ({
            id: row.id,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
            // facilityType: row.facilityType,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getSportsBookingData = (
    fromDate,
    toDate,
    _pageSize = 10,
    _pageNo = 0
  ) => {
    console.log("fromDate, toDate", fromDate, toDate);
    setLoading(true);
    axios
      .get(`${urls.SPURL}/report/getDataBySports`, {
        params: {
          fromDate: moment(fromDate).format("YYYY-MM-DD"),
          toDate: moment(toDate).format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res, i) => {
        setLoading(false);
        console.log("fromTo", res);
        setDataSource(
          res?.data?.map((r, i) => {
            console.log("fromTo34", r);
            return { srNo: i + 1, ...r };
          })
        );

        if (res?.data?.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
        }

        let result = res?.data;
        let _res = result?.map((r, index) => {
          return {
            ...r,

            id: r.id,
            srNo: _pageSize * _pageNo + index + 1,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            applicationNumber: r.applicationNumber,
            name: r.applicantName,
            bookingDate: r.bookingDate,
            fromDate: moment(r.fromDate).format("DD-MM-YYYY"),
            toDate: moment(r.toDate).format("DD-MM-YYYY"),
            // applicationDate: r.applicationDate
            //   ? moment(r.applicationDate).format("DD-MM-YYYY")
            //   : "Not Available",
            mobileNumber: r.mobileNumber,
            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName
            )?.facilityName,
            facilityType: facilityTypes?.find(
              (obj) => obj?.id === r.facilityType
            )?.facilityType,
            facilityTime: facilityTimes?.find((obj) => obj?.id === r.id)
              ?.fromBookingTime,
            // fromBookingTime: moment(r.fromBookingTime).format("hh:mm A"),
            // toBookingTime: r.toBookingTime,
          };
        });
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 1,
      maxWidth: 60,
      // align: "center",
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
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "mobileNumber",
      headerName: "Mobile Number",
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
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationNumber",
      headerAlign: "center",
      formattedLabel: "applicationNumber",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicantName",
      headerAlign: "center",
      formattedLabel: "applicantName",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "facilityType",
      headerAlign: "center",
      formattedLabel: "facilityType",
      width: 120,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "facilityName",
      headerAlign: "center",
      formattedLabel: "facilityName",
      width: 120,
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
    // {
    //   headerClassName: "cellColor",
    //   field: "facilityTime",
    //   headerAlign: "center",
    //   formattedLabel: "fromBookingTime",
    //   width: 120,
    //   align: "center",
    // },
    // {
    //   headerClassName: "cellColor",
    //   field: "toBookingTime",
    //   headerAlign: "center",
    //   formattedLabel: "toBookingTime",
    //   width: 120,
    //   align: "center",
    // },
    {
      headerClassName: "cellColor",
      field: "applicationStatus",
      headerAlign: "center",
      formattedLabel: "applicationStatus",
      width: 120,
      align: "center",
    },
    // {
    //   headerClassName: "cellColor",
    //   field: "firstName",
    //   headerAlign: "center",
    //   formattedLabel: "firstName",
    //   width: 120,
    //   align: "center",
    // },
    // {
    //   headerClassName: "cellColor",
    //   field: "departmentName",
    //   headerAlign: "center",
    //   formattedLabel: "departmentName",
    //   width: 120,
    //   align: "center",
    // },
    // {
    //   headerClassName: "cellColor",
    //   field: "mobileNumber",
    //   headerAlign: "center",
    //   formattedLabel: "mobileNumber",
    //   width: 120,
    //   align: "center",
    // },
    // {
    //   headerClassName: "cellColor",
    //   field: "lightOnOffStatus",
    //   headerAlign: "center",
    //   formattedLabel: "LightOn_Off",
    //   width: 120,
    //   align: "center",
    // },
    // {
    //   headerClassName: "cellColor",
    //   field: "remark",
    //   headerAlign: "center",
    //   formattedLabel: "remark",
    //   width: 120,
    //   align: "center",
    // },
  ];

  return (
    <Paper>
      <Grid
        container
        sx={{
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
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
              router.push("/sportsPortal/dashboard");
            }}
            variant="contained"
            color="primary"
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
          <h2>{language === "en" ? "Sports Details" : "क्रीडा तपशील"}</h2>
          {/* <h2>Sports Details</h2> */}
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
            variant="contained"
            color="primary"
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
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        maxDate={new Date()}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            {" "}
                            {language === "en" ? "From Date" : "पासून"}
                          </span>
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
                      />
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
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        minDate={watch("fromDate")}
                        maxDate={new Date()}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            {" "}
                            {language === "en" ? "To Date" : "पर्यंत"}
                          </span>
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
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {/* {errors?.toDate ? errors.toDate.message : null} */}
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
              <FormControl variant="standard" error={!!errors.zoneName}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zone" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: 220 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="zoneName"
                    >
                      {zoneNames &&
                        zoneNames.map((zoneName, index) => {
                          return (
                            <MenuItem key={index} value={zoneName.id}>
                              {language == "en"
                                ? zoneName?.zoneName
                                : zoneName?.zoneNameMr}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="zoneName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.zoneName ? errors.zoneName.message : null}
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
              <FormControl variant="standard" error={!!errors.wardName}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="ward" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: 220 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="wardName"
                    >
                      {wardNames &&
                        wardNames.map((wardName, index) => {
                          return (
                            <MenuItem key={index} value={wardName.id}>
                              {language == "en"
                                ? wardName?.wardName
                                : wardName?.wardNameMr}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="wardName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wardName ? errors.wardName.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Box>

      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="small"
          disabled={watch("fromDate") == null || watch("toDate") == null}
          onClick={() => {
            getSportsBookingData(watch("fromDate"), watch("toDate"));
          }}
        >
          {language === "en" ? "Search" : "शोधा"}
        </Button>
      </Grid>

      <Box sx={{ paddingTop: "10px", paddingLeft: "180px" }}>
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
            en: "Sports Portal",
            mr: "क्रीडा पोर्टल",
          }}
          reportName={{
            en: "Sports Booking Register",
            mr: "क्रीडा बुकिंग रजिस्टर",
          }}
          componentRef={componentRef}
        />
        {/* <ComponentToPrint
          data={{
            dataSource,
            facilityNames,
            language,
            ...menu,
            route,
            departments,
          }}
          ref={componentRef}
        /> */}
      </Box>
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
                    <th colSpan={11}>
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
                <tbody>
                  <tr>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Application Number"
                        : "अर्ज क्रमांक"}
                    </th>
                    {/* <th colSpan={1}>{this?.props?.data?.language === "en" ? "To Date" : "आजपर्यंत"}</th> */}
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Applicant Name"
                        : "अभ्यागताचे नाव"}
                    </th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Department Name" : "विभागाचे नाव"}
                    </th> */}
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Application Date"
                        : "अर्जाची तारीख"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Facility Name"
                        : "सुविधेचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "From Time"
                        : "वेळ(पासून)"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "To Time"
                        : "वेळ(पर्यंत)"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicationNumber
                              : r?.applicationNumber}
                          </td>
                          <td>
                            {}
                            {this?.props?.data?.language === "en"
                              ? r?.applicantName
                              : r?.applicantName}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.bookingDate
                              : r?.bookingDate}
                          </td>
                          {/* <td>
                            {this?.props?.data?.language === "en"
                              ? (r?.facilityName === this?.props?.data?.facilityNames?.facilityName).this
                                  ?.props?.data?.facilityNames
                              : r?.facilityName}
                          </td> */}
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.serviceName
                              : r?.serviceName}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.fromDate
                              : r?.fromDate}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.toDate
                              : r?.toDate}
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
export default SportsBooking;
