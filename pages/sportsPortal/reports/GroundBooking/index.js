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

function GroundBooking() {
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
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
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
  const [venueNames, setVenueNames] = useState([]);

  const getVenueNames = () => {
    axios
      .get(`${urls.SPURL}/venueMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setVenueNames(
          r.data.venue.map((row) => ({
            id: row.id,
            venue: row.venue,
          })),
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
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // const [facilityTimes, setFacilityTimes] = useState([]);
  // const getTimeSlot = () => {
  //   axios.get(`${urls.SPURL}/bookingTime/getAll`).then((r) => {
  //     console.log("76546453", r);
  //     setFacilityTimes(
  //       r.data.bookingTime.map((row) => ({
  //         id: row.id,
  //         facilityTime: row.fromBookingTime,
  //         // toBookingTime: row.toBookingTime,
  //       }))
  //     );
  //   });
  // };

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
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getDepartment();
    getVenueNames();
    getFacilityName();
    getFacilityType();
  }, []);

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
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getGroundBookingData = (
    fromDate,
    toDate,
    _pageSize = 10,
    _pageNo = 0,
  ) => {
    console.log("fromDate, toDate", fromDate, toDate);
    setLoading(true);
    axios
      .get(`${urls.SPURL}/report/getDataByGround`, {
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
          }),
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
            venue: r.venue,
            applicationDate: r.applicationDate
              ? moment(r.applicationDate).format("YYYY-MM-DD")
              : "Not Available",
            // applicationDate: r.applicationDate
            //   ? moment(r.applicationDate, "DD-MM-YYYY hh:mm A").format("YYYY-MM-DD")
            //   : "Not Available",
            venueNames: venueNames?.find((obj) => obj?.id == r?.venue)?.venue,
            mobileNumber: r.mobileNumber,
            fromDate: moment(r.fromDate).format("DD-MM-YYYY"),
            toDate: moment(r.toDate).format("DD-MM-YYYY"),
            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityName,
            facilityType: facilityTypes?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityType,
            // fromBookingTime: r.fromBookingTime,
            fromBookingTime: moment(r.fromBookingTime).format("hh:mm A"),
            toBookingTime: r.toBookingTime,
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
      headerName: "Application Number",
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
          <h2>{language === "en" ? "Grounds Details" : "ग्राउंड तपशील"}</h2>
          {/* <h2>Grounds Details</h2> */}
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
          </Grid>
        )}
      </Box>

      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="small"
          disabled={watch("fromDate") == null || watch("toDate") == null}
          onClick={() => {
            getGroundBookingData(watch("fromDate"), watch("toDate"));
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
            en: "Daily Ground Reservation Register",
            mr: "दैनिक ग्राउंड आरक्षण नोंदणी",
          }}
          componentRef={componentRef}
        />
        {/* <ComponentToPrint data={{ dataSource, language, ...menu, route, departments }} ref={componentRef} /> */}
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
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Application Date" : "अर्जाची तारीख"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Ground Name" : "मैदानाचे नाव"}
                    </th> */}
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "From Date"
                        : "पासून"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "To Date"
                        : "पर्यंत"}
                    </th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "From Booking Time" : "पर्यंत"}
                    </th> */}
                    {/* <th colSpan={1}>{this?.props?.data?.language === "en" ? "To Booking Time" : "पर्यंत"}</th> */}
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Application Status"
                        : ""}
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
                            {" "}
                            {this?.props?.data?.language === "en"
                              ? r?.applicantName
                              : r?.applicantName}
                          </td>
                          {/* <td>{this?.props?.data?.language === "en" ? r?.bookingDate : r?.bookingDate}</td>
                          <td>{this?.props?.data?.language === "en" ? r?.venueNames : r?.venueNames}</td> */}
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
                          {/* <td>
                            {this?.props?.data?.language === "en" ? r?.fromBookingTime : r?.fromBookingTime}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en" ? r?.toBookingTime : r?.toBookingTime}
                          </td> */}

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicationStatus
                              : r?.applicationStatus}
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
export default GroundBooking;

// import {
//   Button,
//   FormControl,
//   FormHelperText,
//   Paper,
//   TextField,
// } from '@mui/material'
// import sweetAlert from 'sweetalert'

// import { DataGrid } from '@mui/x-data-grid'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import axios from 'axios'
// import moment from 'moment'
// import React, { useEffect, useRef, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import URLS from '../../../../URLS/urls'
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
// import { useReactToPrint } from 'react-to-print'
// import { toast } from 'react-toastify'
// // import schema from '../../../../containers/schema/sportsPortalSchema/groundSchema'

// // func
// const Index = () => {
//   const {
//     register,
//     control,
//     handleSubmit,
//     methods,
//     watch,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: 'all',
//     // resolver: yupResolver(schema),
//     mode: 'onChange',
//   })

//   const [disableKadhnariState, setDisableKadhnariState] = useState(true)
//   const [disable, setDisable] = useState(true)
//   const [value, setValuee] = useState(null)
//   const [valuee, setValueTwo] = useState(null)

//   const [btnSaveText, setBtnSaveText] = useState('Save')
//   const [editButtonInputState, setEditButtonInputState] = useState(false)
//   const [deleteButtonInputState, setDeleteButtonState] = useState(false)
//   const [dataSource, setDataSource] = useState([])
//   const [buttonInputState, setButtonInputState] = useState()
//   const [isOpenCollapse, setIsOpenCollapse] = useState(false)
//   const [id, setID] = useState()
//   const [fetchData, setFetchData] = useState(null)
//   const [slideChecked, setSlideChecked] = useState(false)
//   const [zoneNames, setZoneNames] = useState([])
//   const [dateValue, setDateValue] = useState(null)
//   const [venueNames, setVenueNames] = useState([])
//   const [wardNames, setWardNames] = useState([])
//   const [departments, setDepartments] = useState([])
//   // const [subDepartments, setSubDepartments] = useState([]);
//   const [facilityTypess, setFacilityTypess] = useState([])
//   const [facilityNames, setFacilityNames] = useState([])
//   const [selectedFacilityType, setSelectedFacilityType] = useState()
//   const [venues, setVenues] = useState([])
//   const [selectedFacilityName, setSelectedFacilityName] = useState()
//   const [searchResults, setSearchResults] = useState([])

//   const [selectedFromDate, setSelectedFromDate] = useState(
//     moment().format('YYYY-MM-DD'),
//   )
//   // moment().format('YYYY-MM-DD')
//   const [selectedToDate, setSelectedToDate] = useState(
//     moment().format('YYYY-MM-DD'),
//   )

//   const searchButton = () => {
//     console.log('selected dates:' + selectedFromDate, selectedToDate)
//     console.log(typeof selectedFromDate)

//     axios
//       .get(
//         `${URLS.SPURL}/groundBooking/getDataByBookingDate?fromDate=${selectedFromDate}&toDate=${selectedToDate}`,
//       )
//       .then((res) => {
//         console.log('response123', res)
//         res.data.groundBooking.length === 0 &&
//           toast('No Ground Bookings Available !', {
//             type: 'warn',
//           })

//         setSearchResults(res.data.groundBooking)
//       })
//       .catch((err) => {
//         console.log('error while fetching serach results:' + err)
//         toast('Something went wrong!', {
//           type: 'error',
//         })
//       })
//   }

//   useEffect(() => {}, [])

//   // OnSubmit Form
//   const onSubmitForm = (fromData) => {
//     let fromBookingTime
//     let toBookingTime
//     if (moment(value).format('HH') >= 12) {
//       fromBookingTime = moment(value).format('HH:mm:SS')
//     } else {
//       fromBookingTime = moment(value).format('HH:mm:SS')
//     }

//     if (moment(valuee).format('HH') >= 12) {
//       toBookingTime = moment(valuee).format('HH:mm:SS')
//     } else {
//       toBookingTime = moment(valuee).format('HH:mm:SS')
//     }

//     console.log('From', fromBookingTime)
//     console.log('To', toBookingTime)

//     const finalBodyForApi = {
//       ...fromData,
//       fromBookingTime,
//       toBookingTime,
//     }

//     console.log('DATA: ', finalBodyForApi)

//     if (btnSaveText === 'Save') {
//       console.log('Post -----')
//       const tempData = axios
//         .post(
//           `${urls.BaseURL}/bookingMaster/saveBookingMaster`,
//           finalBodyForApi,
//         )
//         .then((res) => {
//           if (res.status == 200) {
//             // message.success("Data Saved !!!");
//             sweetAlert('Saved!', 'Record Saved successfully !', 'success')

//             setButtonInputState(false)
//             setIsOpenCollapse(false)
//             setFetchData(tempData)
//             setEditButtonInputState(false)
//             setDeleteButtonState(false)
//           }
//         })
//     }
//     // Update Data Based On ID
//     else if (btnSaveText === 'Edit') {
//       console.log('Put -----')
//       const tempData = axios
//         .post(
//           `${urls.BaseURL}/bookingMaster/saveBookingMaster/?id=${id}`,

//           fromData,
//         )
//         .then((res) => {
//           if (res.status == 200) {
//             sweetAlert('Updated!', 'Record Updated successfully !', 'success')

//             setButtonInputState(false)
//             setIsOpenCollapse(false)
//             setFetchData(tempData)
//           }
//         })
//     }
//   }

//   // Exit Button
//   const exitButton = () => {
//     reset({
//       ...resetValuesExit,
//     })
//     setButtonInputState(false)
//     setIsOpenCollapse(false)
//     setDeleteButtonState(false)
//     setEditButtonInputState(false)
//   }

//   // cancell Button
//   const cancellButton = () => {
//     reset({
//       ...resetValuesCancell,
//     })
//   }

//   // Reset Values Cancell
//   const resetValuesCancell = {
//     zoneName: '',
//     wardName: '',
//     department: '',
//     facilityType: '',
//     facilityName: '',
//     venue: '',
//     date: null,
//     fromBookingTime: null,
//     toBookingTime: null,
//     capacity: '',
//   }

//   // Reset Values Exit
//   const resetValuesExit = {
//     zoneName: '',
//     wardName: '',
//     department: '',
//     facilityType: '',
//     facilityName: '',
//     venue: '',
//     date: null,
//     fromBookingTime: null,
//     toBookingTime: null,
//     capacity: '',
//     // fromDate: "",
//     // toDate: "",
//   }

//   // Get Table - Data
//   const getAllDetails = () => {
//     axios
//       .get(`${urls.BaseURL}/bookingMaster/getBookingMasterData`)
//       .then((res) => {
//         setDataSource(
//           res.data.map((r, i) => ({
//             id: r.id,
//             srNo: i + 1,

//             capacity: r.capacity,
//             zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
//               ?.zoneName,

//             venue: venueNames?.find((obj) => obj?.id === r.venue)?.venue,
//             wardName: wardNames?.find((obj) => obj?.id === r.wardName)
//               ?.wardName,
//             department: departments?.find((obj) => obj?.id === r.department)
//               ?.department,
//             // subDepartment: subDepartments?.find(
//             //   (obj) => obj?.id === r.subDepartment
//             // )?.subDepartment,
//             fromBookingTime: moment(r.fromBookingTime, 'hh:mm A').format(
//               'hh:mm A',
//             ),
//             toBookingTime: moment(r.toBookingTime, 'hh:mm A').format('hh:mm A'),

//             facilityName: facilityNames?.find(
//               (obj) => obj?.id === r.facilityName,
//             )?.facilityName,

//             facilityType: facilityTypess?.find(
//               (obj) => obj?.id === r.facilityType,
//             )?.facilityType,
//           })),
//         )
//       })
//   }

//   // define colums table
//   const columns = [
//     {
//       field: 'id', //'bookingRegistrationId',
//       headerName: 'Sr.no', // Sr No
//       width: 20,
//       // flex: 1,
//       // width: 160,
//       // padding: '2%',
//     },
//     {
//       field: 'applicationNumber',
//       headerName: 'Application No',
//       width: 120,
//       // flex: 1,
//       // padding: '2%',
//     },
//     {
//       field: 'applicationDate',
//       headerName: 'Application Date',
//       width: 120,
//       // flex: 1,
//       // padding: '2%',
//     },
//     {
//       field: 'bookingRegistrationId',
//       headerName: 'Booking No',
//       width: 90,
//       // flex: 1,
//       // padding: '2%',
//     },
//     {
//       field: 'bookingDate',
//       headerName: 'Booking Date',
//       width: 100,
//       //type: "number",
//       // flex: 1,
//     },

//     // {
//     //   field: 'bookingType',
//     //   headerName: 'Booking Type',
//     //   width: 102,
//     //   //type: "number",
//     //   // flex: 1,
//     // },

//     // {
//     //   field: 'applicationDate',
//     //   headerName: 'Application Date',
//     //   width: 120,
//     //   //type: "number",
//     //   // flex: 1,
//     // },

//     {
//       field: 'zone',
//       headerName: 'Zone',
//       width: 20,
//       //type: "number",
//       // flex: 1,
//     },

//     {
//       field: 'department',
//       headerName: 'Department',
//       width: 90,
//       //type: "number",
//       // flex: 1,
//     },

//     {
//       field: 'facilityType',
//       headerName: 'Facility Type',
//       width: 100,
//       //type: "number",
//       // flex: 1,
//     },
//     {
//       field: 'facilityName',
//       headerName: 'Facility Name',
//       width: 100,
//       //type: "number",
//       // flex: 1,
//     },

//     // {
//     //   field: 'bankName',
//     //   headerName: 'Bank Name',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'branchName',
//     //   headerName: 'Branch Name',
//     //   //type: "number",
//     //   flex: 1,
//     // },

//     {
//       field: 'bankAccountHolderName',
//       headerName: 'Name',
//       width: 20,
//       //type: "number",
//       // flex: 1,
//     },

//     // {
//     //   field: 'bankAccountNo',
//     //   headerName: 'Bank Account No',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'ifscCode',
//     //   headerName: 'ifscCode',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'bankAddress',
//     //   headerName: 'bankAddress',
//     //   //type: "number",
//     //   flex: 1,
//     // },

//     // {
//     //   field: 'aadharCard',
//     //   headerName: 'Aadhar Card',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'panCard',
//     //   headerName: 'Pan Card',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'otherDocumentPhoto',
//     //   headerName: 'Other Document Photo',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'purposeOfBooking',
//     //   headerName: 'Purpose Of Booking',
//     //   width: 151,
//     //   // flex: 1,
//     // },
//     // {
//     //   field: 'status',
//     //   headerName: 'status',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'jrClerkRemark',
//     //   headerName: 'Jr Clerk Remark',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'srClerkRemark',
//     //   headerName: 'Sr Clerk Remark',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'officeSuperidentRemark',
//     //   headerName: 'Office Superident Remark',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'sportsOfficerRemark',
//     //   headerName: 'Sports Officer Remark',
//     //   //type: "number",
//     //   flex: 1,
//     // },
//     {
//       field: 'groundName',
//       headerName: 'Ground Name',
//       width: 102,
//       //type: "number",
//       // flex: 1,
//     },
//     {
//       field: 'groundLocation',
//       headerName: 'Ground addr.',
//       width: 100,
//       //type: "number",
//       // flex: 1,
//     },

//     // {
//     //   field: 'groundReservationDate',
//     //   headerName: 'Ground Reserved Date',
//     //   width: 130,
//     //   //type: "number",
//     //   // flex: 1,
//     // },
//     // {
//     //   field: 'groundReservationDatails',
//     //   headerName: 'Ground Reservation Datails',
//     //   width: 130,
//     //   //type: "number",
//     //   // flex: 1,
//     // },

//     // {
//     //   field: "actions",
//     //   headerName: "Actions",
//     //   width: 120,
//     //   sortable: false,
//     //   disableColumnMenu: true,
//     //   renderCell: (params) => {
//     //     return (
//     //       <Box
//     //         sx={{
//     //           // backgroundColor: "whitesmoke",
//     //           width: "100%",
//     //           height: "100%",
//     //           display: "flex",
//     //           justifyContent: "center",
//     //           alignItems: "center",
//     //         }}
//     //       ></Box>
//     //     );
//     //   },
//     // },
//   ]

//   const componentRef = useRef(null)
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: 'new document',
//   })

//   // View
//   return (
//     <>
//       <div>
//         <ComponentToPrint
//           ref={componentRef}
//           columns={columns}
//           searchButton={searchButton}
//           searchResults={searchResults}
//           selectedFromDate={selectedFromDate}
//           setSelectedFromDate={setSelectedFromDate}
//           selectedToDate={selectedToDate}
//           setSelectedToDate={setSelectedToDate}
//           errors={errors}
//         />
//       </div>
//       <div className={styles.btn}>
//         <Button type="primary" variant="contained" onClick={handlePrint}>
//           print
//         </Button>
//         <Button
//           type="primary"
//           variant="contained"
//           onClick={() => console.log('paymentDone')}
//         >
//           Exit
//         </Button>
//       </div>
//     </>
//   )
// }

// class ComponentToPrint extends React.Component {
//   constructor(props) {
//     super(props)
//   }
//   render() {
//     return (
//       <>
//         <Paper
//           sx={{
//             marginLeft: 5,
//             marginRight: 5,
//             marginTop: 5,
//             marginBottom: 5,
//           }}
//         >
//           <div>
//             <center>
//               <h3>Ground Booking Deatils</h3>
//             </center>
//           </div>

//           <div className={styles.date}>
//             <div className={styles.sDate}>
//               <FormControl
//                 style={{ marginTop: 10 }}
//                 error={!!this.props.errors.date}
//               >
//                 {/* <Controller
//                   control={control}
//                   name="toDate"
//                   defaultValue={null}
//                   render={({ field }) => ( */}
//                 <LocalizationProvider dateAdapter={AdapterMoment}>
//                   <DatePicker
//                     inputFormat="YYYY-MM-DD"
//                     label={
//                       <span style={{ fontSize: 16 }}>
//                         {/* <FormattedLabel id="toDate" /> */}
//                         Date(From)
//                       </span>
//                     }
//                     value={this.props.selectedFromDate}
//                     onChange={(date) =>
//                       this.props.setSelectedFromDate(
//                         // date
//                         // moment(date).format('YYYY-MM-DD')
//                         moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
//                       )
//                     }
//                     selected={this.props.selectedFromDate}
//                     center
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         size="small"
//                         fullWidth
//                         InputLabelProps={{
//                           style: {
//                             fontSize: 12,
//                             marginTop: 2,
//                           },
//                         }}
//                       />
//                     )}
//                   />
//                 </LocalizationProvider>
//                 {/* )}
//                 /> */}
//                 <FormHelperText>
//                   {this.props.errors?.date
//                     ? this.props.errors.toDate.message
//                     : null}
//                 </FormHelperText>
//               </FormControl>
//             </div>
//             <div className={styles.sDate}>
//               <FormControl
//                 style={{ marginTop: 10 }}
//                 error={!!this.props.errors.date}
//               >
//                 {/* <Controller
//                   control={control}
//                   name="toDate"
//                   defaultValue={null}
//                   render={({ field }) => ( */}
//                 <LocalizationProvider dateAdapter={AdapterMoment}>
//                   <DatePicker
//                     inputFormat="YYYY-MM-DD"
//                     label={
//                       <span style={{ fontSize: 16 }}>
//                         {/* <FormattedLabel id="toDate" /> */}
//                         Date(To)
//                       </span>
//                     }
//                     value={this.props.selectedToDate}
//                     onChange={(date) =>
//                       this.props.setSelectedToDate(
//                         moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
//                         // date
//                       )
//                     }
//                     selected={this.props.selectedToDate}
//                     center
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         size="small"
//                         fullWidth
//                         InputLabelProps={{
//                           style: {
//                             fontSize: 12,
//                             marginTop: 3,
//                           },
//                         }}
//                       />
//                     )}
//                   />
//                 </LocalizationProvider>
//                 {/* )}
//                 /> */}
//                 <FormHelperText>
//                   {this.props.error?.date
//                     ? this.props.errors.toDate.message
//                     : null}
//                 </FormHelperText>
//               </FormControl>
//             </div>
//             <div className={styles.searchBtn}>
//               <Button
//                 variant="contained"
//                 // color="error"
//                 // endIcon={<ExitToAppIcon />}
//                 onClick={() => this.props.searchButton()}
//               >
//                 Search
//               </Button>
//             </div>
//           </div>
//           <DataGrid
//             autoHeight
//             sx={{
//               marginLeft: 5,
//               marginRight: 5,
//               marginTop: 5,
//               marginBottom: 5,
//             }}
//             rows={this.props.searchResults}
//             columns={this.props.columns}
//             pageSize={10}
//             rowsPerPageOptions={[5, 10, 15]}
//             pagination
//             //checkboxSelection
//           />
//           {/* <div className={styles.btndiv}>
//             <div>
//               <Button
//                 variant="contained"
//                 // color="error"
//                 // endIcon={<ExitToAppIcon />}
//                 onClick={() => pdfBtn()}
//               >
//                 PDF
//               </Button>
//             </div>
//             <div>
//               {/* EXCEL */}
//           {/* <Button
//                 variant="contained"
//                 // color="error"
//                 // endIcon={<ExitToAppIcon />}
//                 onClick={() => excelBtn()}
//               >
//                 EXCEL
//               </Button>
//             </div>
//             <div>
//               {/* CSV */
//           /*  <Button
//                 variant="contained"
//                 // color="error"
//                 // endIcon={<ExitToAppIcon />}
//                 onClick={() => csvBtn()}
//               >
//                 CSV
//               </Button>
//             </div>
//           </div> */}
//         </Paper>
//       </>
//     )
//   }
// }

// export default Index
