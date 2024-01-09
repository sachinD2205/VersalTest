import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import SaveIcon from "@mui/icons-material/Save";
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  Slide,
  TextField,
  InputAdornment,
  Input,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

// import styles from "../bookingTime/view.module.css";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import URLS from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import urls from "../../../../URLS/urls";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [disable, setDisable] = useState(true);
  const [value, setValuee] = useState(null);
  const [valuee, setValueTwo] = useState(null);
  const token = useSelector((state) => state.user.user.token);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [dateValue, setDateValue] = useState(null);
  const [venueNames, setVenueNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  // const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [venues, setVenues] = useState([]);
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  const [searchResults, setSearchResults] = useState([]);

  const [selectedFromDate, setSelectedFromDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const [selectedToDate, setSelectedToDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const language = useSelector((state) => state?.labels.language);
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
  const searchButton = () => {
    console.log("selected dates:" + selectedFromDate, selectedToDate);

    axios
      .get(
        `${URLS.SPURL}/swimmingPool/getDataByBookingDate?fromDate=${selectedFromDate}&toDate=${selectedToDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log("res123:", res);
        res.data.swimmingPool === 0 &&
          toast("No Swimming Pool Bookings Available !", {
            type: "warn",
          });
        setSearchResults(res.data.swimmingPool);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   console.log("error while fetching serach results:" + err);
    //   toast("Something went wrong!", {
    //     type: "error",
    //   });
    // });
  };
  // useEffect - Reload On update , delete ,Saved on refresh
  // useEffect(() => {
  //   getAllDetails();
  // }, [
  //   zoneNames,
  //   wardNames,
  //   departments,
  //   // subDepartments,
  //   facilityNames,
  //   fetchData,
  //   facilityTypess,
  // ]);

  useEffect(() => {}, []);

  // const searchButton = () => {
  //   //${URLS.SPURL}/sportsBooking/getDataByBookingDate?formDate=2022-12-12&toDate=2022-12-13
  //   axios
  //     .get(
  //       '${URLS.SPURL}/groundBooking/getDataByBookingDate?formDate=2022-12-12&toDate=2022-12-13'
  //     )
  //     .then((res) => {
  //       console.log('search data is :' + res.data.sportsBooking);
  //       setSearchResults(res.data.sportsBooking);
  //     });
  // };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const date = moment(fromData.Date.d, "YYYY-MM-DD").format("YYYY-MM-DD");
    let fromBookingTime;
    let toBookingTime;
    if (moment(value).format("HH") >= 12) {
      fromBookingTime = moment(value).format("HH:mm:SS");
    } else {
      fromBookingTime = moment(value).format("HH:mm:SS");
    }

    if (moment(valuee).format("HH") >= 12) {
      toBookingTime = moment(valuee).format("HH:mm:SS");
    } else {
      toBookingTime = moment(valuee).format("HH:mm:SS");
    }

    // const fromBookingTime = moment(value).format("HH:mm") + ":00";
    // const toBookingTime = moment(valuee).format("HH:mm") + ":00";

    console.log("From", fromBookingTime);
    console.log("To", toBookingTime);

    // const toBookingTime = moment(fromData.toBookingTime).format(
    //   "YYYY-MM-DD hh:mm:ss"
    // );

    // console.log("To", valuee.getTime());
    // console.log("date kuthli ahe re: ", date);

    const finalBodyForApi = {
      ...fromData,
      fromBookingTime,
      toBookingTime,
    };

    console.log("DATA: ", finalBodyForApi);

    if (btnSaveText === "Save") {
      console.log("Post -----");
      const tempData = axios
        .post(
          `${urls.BaseURL}/bookingMaster/saveBookingMaster`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 200) {
            // message.success("Data Saved !!!");
            sweetAlert("Saved!", "Record Saved successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Edit") {
      console.log("Put -----");
      const tempData = axios
        .post(
          `${urls.BaseURL}/bookingMaster/saveBookingMaster/?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },

          fromData,
        )
        .then((res) => {
          if (res.status == 200) {
            // message.success("Data Updated !!!");
            sweetAlert("Updated!", "Record Updated successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
    setDeleteButtonState(false);
    setEditButtonInputState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    zoneName: "",
    wardName: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    date: null,
    fromBookingTime: null,
    toBookingTime: null,
    capacity: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneName: "",
    wardName: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    date: null,
    fromBookingTime: null,
    toBookingTime: null,
    capacity: "",
    // fromDate: "",
    // toDate: "",
  };

  // Get Table - Data
  const getAllDetails = () => {
    axios
      .get(`${urls.BaseURL}/bookingMaster/getBookingMasterData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,

            capacity: r.capacity,
            zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
              ?.zoneName,

            venue: venueNames?.find((obj) => obj?.id === r.venue)?.venue,
            wardName: wardNames?.find((obj) => obj?.id === r.wardName)
              ?.wardName,
            department: departments?.find((obj) => obj?.id === r.department)
              ?.department,
            // subDepartment: subDepartments?.find(
            //   (obj) => obj?.id === r.subDepartment
            // )?.subDepartment,
            fromBookingTime: moment(r.fromBookingTime, "hh:mm A").format(
              "hh:mm A",
            ),
            toBookingTime: moment(r.toBookingTime, "hh:mm A").format("hh:mm A"),

            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityName,

            facilityType: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityType,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // define colums table
  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      padding: "2%",
    },

    {
      field: "applicantFirstName",
      headerName: "Applicant FirstName",
      //type: "number",
      flex: 1,
    },

    {
      field: "applicantMiddleName",
      headerName: "Applicant MiddleName",
      //type: "number",
      flex: 1,
    },

    {
      field: "applicantLastName",
      headerName: "Applicant LastName",
      //type: "number",
      flex: 1,
    },

    {
      field: "gender",
      headerName: "Gender",
      //type: "number",
      flex: 1,
    },

    // {
    //   field: 'dateOfBirth',
    //   headerName: 'Date Of Birth',
    //   //type: "number",
    //   flex: 1,
    // },
    {
      field: "age",
      headerName: "Age",
      //type: "number",
      flex: 1,
    },

    // {
    //   field: 'bankName',
    //   headerName: 'Bank Name',
    //   //type: "number",
    //   flex: 1,
    // },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      //type: "number",
      flex: 1,
    },

    {
      field: "aadharNo",
      headerName: "Aadhar No",
      //type: "number",
      flex: 1,
    },

    {
      field: "emailAddress",
      headerName: "Email",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: 'currentAddress',
    //   headerName: 'Current Address',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'cityName',
    //   headerName: 'City Name',
    //   //type: "number",
    //   flex: 1,
    // },

    // {
    //   field: 'state',
    //   headerName: 'State',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'pincode',
    //   headerName: 'Pincode',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'prPincode',
    //   headerName: 'Pr Pincode',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'permanantAddress',
    //   headerName: 'Permanant Address',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'prCityName',
    //   headerName: 'Pr CityName',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'prState',
    //   headerName: 'Pr State',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'swimmingPoolName',
    //   headerName: 'Swimming Pool Name',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'slots',
    //   headerName: 'Slots',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'swimmingPoolDetailsDao',
    //   headerName: 'Swimming Pool Details Dao',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'activeFlag',
    //   headerName: 'Active Flag',
    //   //type: "number",
    //   flex: 1,
    // },
    {
      field: "bookingDate",
      headerName: "Booking Date ",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: 'membershipRegistrationDate',
    //   headerName: 'Membership Registration Date',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'membershipValidDate',
    //   headerName: 'Membership Valid Date',
    //   //type: "number",
    //   flex: 1,
    // },

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box
    //         sx={{
    //           // backgroundColor: "whitesmoke",
    //           width: "100%",
    //           height: "100%",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       ></Box>
    //     );
    //   },
    // },
  ];

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  // View
  return (
    <>
      <BasicLayout>
        <div>
          <ComponentToPrint
            ref={componentRef}
            columns={columns}
            searchButton={searchButton}
            searchResults={searchResults}
            selectedFromDate={selectedFromDate}
            setSelectedFromDate={setSelectedFromDate}
            selectedToDate={selectedToDate}
            setSelectedToDate={setSelectedToDate}
            errors={errors}
          />
        </div>
        <div className={styles.btn}>
          <Button type="primary" variant="contained" onClick={handlePrint}>
            print
          </Button>
          <Button
            type="primary"
            variant="contained"
            onClick={() => console.log("Exited")}
          >
            Exit
          </Button>
        </div>
      </BasicLayout>
    </>
  );
};

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <div>
            <center>
              <h3>Sports Booking Deatils</h3>
            </center>
          </div>

          <div className={styles.date}>
            <div className={styles.sDate}>
              <FormControl
                style={{ marginTop: 10 }}
                error={!!this.props.errors.date}
              >
                {/* <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => ( */}
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        {/* <FormattedLabel id="toDate" /> */}
                        Date(From)
                      </span>
                    }
                    value={this.props.selectedFromDate}
                    onChange={(date) =>
                      this.props.setSelectedFromDate(
                        moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                      )
                    }
                    selected={this.props.selectedFromDate}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 2,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                {/* )}
                /> */}
                <FormHelperText>
                  {this.props.errors?.date
                    ? this.props.errors.toDate.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.sDate}>
              <FormControl
                style={{ marginTop: 10 }}
                error={!!this.props.errors.date}
              >
                {/* <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => ( */}
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        {/* <FormattedLabel id="toDate" /> */}
                        Date(To)
                      </span>
                    }
                    value={this.props.selectedToDate}
                    onChange={(date) =>
                      this.props.setSelectedToDate(
                        moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                      )
                    }
                    selected={this.props.selectedToDate}
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
                {/* )}
                /> */}
                <FormHelperText>
                  {this.props.error?.date
                    ? this.props.errors.toDate.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.searchBtn}>
              <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => this.props.searchButton()}
              >
                Search
              </Button>
            </div>
          </div>
          <DataGrid
            autoHeight
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
            rows={this.props.searchResults}
            columns={this.props.columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 15]}
            pagination
            //checkboxSelection
          />
          {/* <div className={styles.btndiv}>
            <div>
              <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => pdfBtn()}
              >
                PDF
              </Button>
            </div>
            <div>
              {/* EXCEL */}
          {/* <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => excelBtn()}
              >
                EXCEL
              </Button>
            </div>
            <div>
              {/* CSV */}
          {/* <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => csvBtn()}
              >
                CSV
              </Button>
            </div>
          </div> */}
        </Paper>
        {/* <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <div>
            <center>
              <h3>Swimming Pool Booking Deatils</h3>
            </center>
          </div>

          <div className={styles.date}>
            <div className={styles.sDate}>
              <FormControl
                style={{ marginTop: 10 }}
                error={!!this.props.errors.date}
              >
                {/* <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => ( */}
        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="YYYY-MM-DD"
                    label={
                      <span style={{ fontSize: 16 }}>
                        {/* <FormattedLabel id="toDate" /> */}
        {/* Date(From)
                      </span>
                    }
                    value={this.props.selectedFromDate}
                    onChange={(date) =>
                      this.props.setSelectedFromDate(
                        moment(date).format('YYYY-MM-DD')
                      )
                    }
                    selected={this.props.selectedFromDate}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 2,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                {/* )}
                /> */}
        {/* <FormHelperText>
                  {this.props.errors?.date
                    ? this.props.errors.toDate.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.sDate}>
              <FormControl
                style={{ marginTop: 10 }}
                error={!!this.props.errors.date}
              >
                {/* <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => ( */}
        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="YYYY-MM-DD"
                    label={
                      <span style={{ fontSize: 16 }}>
                        {/* <FormattedLabel id="toDate" /> */}
        {
          /* Date(To)
                      </span>
                    }
                    value={this.props.selectedToDate}
                    onChange={(date) =>
                      this.props.setSelectedToDate(
                        moment(date).format('YYYY-MM-DD')
                      )
                    }
                    selected={this.props.selectedToDate}
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
                </LocalizationProvider> */

          //       <FormHelperText>
          //         {this.props.error?.date
          //           ? this.props.errors.toDate.message
          //           : null}
          //       </FormHelperText>
          //     </FormControl>
          //   </div>
          //   <div className={styles.searchBtn}>
          //     <Button
          //       variant="contained"
          //       // color="error"
          //       // endIcon={<ExitToAppIcon />}
          //       onClick={() => this.props.searchButton()}
          //     >
          //       Search
          //     </Button>
          //   </div>
          // </div>
          // <DataGrid
          //   autoHeight
          //   sx={{
          //     marginLeft: 5,
          //     marginRight: 5,
          //     marginTop: 5,
          //     marginBottom: 5,
          //   }}
          //   rows={this.props.searchResults}
          //   columns={this.props.columns}
          //   pageSize={5}
          //   rowsPerPageOptions={[5]}
          //   //checkboxSelection
          // />
          {
            /* <div className={styles.btndiv}>
            <div>
              <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => pdfBtn()}
              >
                PDF
              </Button>
            </div>
            <div>
              {/* EXCEL *
              <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => excelBtn()}
              >
                EXCEL
              </Button>
            </div>
            <div>
              {/* CSV */
          }
          /* <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => csvBtn()}
              >
                CSV
              </Button>
            </div>
          </div> 
        
        /* // </Paper> */
        }
      </>
    );
  }
}

export default Index;

// import React, { useRef } from "react";
// import styles from "./payment.module.css";
// import { Card, Button, message } from "antd";
// import { useReactToPrint } from "react-to-print";
// import router from "next/router";
// // import URLS from '../../urls';
// import axios from "axios";
// import Link from "next/link";

// const index = () => {
//   const componentRef = useRef(null);

//   // const paymentDone = async () => {
//   //   const final = 'Payment Successful';
//   //   await axios
//   //     // .post(`${URLS.BaseURL}/tp/api/partplan/updatepartplan`, bodyForAPI)
//   //     .post(
//   //       `${URLS.BaseURL}/partplan/savepartplan`,
//   //       {
//   //         status: final,
//   //         id: router.query.id,
//   //       },
//   //       {
//   //         headers: {
//   //           // Authorization: `Bearer ${token}`,
//   //           role: 'CITIZEN',
//   //         },
//   //       }
//   //     )
//   //     .then((response) => {
//   //       if (response.status === 200) {
//   //         message.success('Data Updated !');
//   //         router.push('/townPlanning/transactions/applicationDetailsPartPlan');
//   //       }
//   //     });
//   // };

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: "new document",
//   });
//   return (
//     <>
//       <div>
//         <ComponentToPrint ref={componentRef} />
//       </div>
//       <div className={styles.btn}>
//         <Button type="primary" onClick={handlePrint}>
//           print
//         </Button>
//         <Button type="primary" onClick={() => console.log("paymentDone")}>
//           Exit
//         </Button>
//       </div>
//     </>
//   );
// };

// // class component
// class ComponentToPrint extends React.Component {
//   render() {
//     return (
//       <>
//         <div className={styles.main}>
//           <div className={styles.small}>
//             <div className={styles.one}>
//               <div className={styles.logo}>
//                 <div>
//                   <img src="/logo.png" alt="" height="100vh" width="100vw" />
//                 </div>
//                 <div className={styles.date}>
//                   <h5>Receipt No :-</h5>
//                   <h5>Receipt Date :-</h5>
//                 </div>
//               </div>
//               <div className={styles.middle}>
//                 <h3>Pimpri Chinchwad Municipal Corporation</h3>
//                 <h4> Mumbai-Pune Road,</h4>
//                 <h4>Pimpri - 411018,</h4>
//                 <h4> Maharashtra, INDIA</h4>
//               </div>
//             </div>
//             <div>
//               <h2 className={styles.heading}>Letter of Intimation</h2>
//             </div>

//             {/* <div className={styles.right}>
//                 <div className={styles.leftt}>
//                   <h4>Service Name</h4>
//                   <h4>TP:Part Plan</h4>
//                   <h5>Receipt No :-</h5>
//                   <h5>Receipt Date :-</h5>
//                 </div>
//                 <div>
//                   <h4>Address</h4>
//                   <h5>
//                     Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune
//                   </h5>
//                 </div>
//     </div>*/}

//             <div className={styles.two}>
//               <p>
//                 <b>
//                   Dear Applicant,
//                   <br></br> &ensp; you have for this services on citizen service
//                   portal kindly ensure the amount and pay the amount/charges of
//                   the applied service using below link.
//                   <br />
//                   <Link href="#">Link Data</Link> or by visiting pcmc nearest
//                   zonal office.
//                   <br></br>
//                 </b>
//                 {/* <p>
//                   <b>
//                     Order No.:- 001235 Shri.ABC ,Address:-Plot
//                     No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
//                   </b>
//                 </p> */}
//                 {/* <div className={styles.order}>
//                   Application Fees = 20.00<br></br> Certificate/Document/Map
//                   Fees = 150.00 <br></br>
//                   ----------------------------------------------------
//                   <br></br> Total Amount = 170.00 <br></br>Amount in Words = One
//                   Hundred and Seventy Rupees Only/--
//                 </div> */}
//               </p>

//               <div className={styles.enquiry}>
//                 <div>
//                   <b>For Contact :- Mobile No:-9999999999</b>
//                 </div>
//                 <div>
//                   <b>email:-enquiry@pcmcindia.gov.in</b>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }

// export default index;

// // import { yupResolver } from "@hookform/resolvers/yup";
// // import styles from "../../reports/reports.module.css";
// // import { Refresh } from "@mui/icons-material";
// // import AddIcon from "@mui/icons-material/Add";
// // import ClearIcon from "@mui/icons-material/Clear";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import EditIcon from "@mui/icons-material/Edit";
// // import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// // import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// // import SaveIcon from "@mui/icons-material/Save";
// // import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
// // import sweetAlert from "sweetalert";
// // import {
// //   Box,
// //   Button,
// //   FormControl,
// //   FormHelperText,
// //   Paper,
// //   Select,
// //   MenuItem,
// //   InputLabel,
// //   Slide,
// //   TextField,
// //   InputAdornment,
// //   Input,
// // } from "@mui/material";
// // import SearchIcon from "@mui/icons-material/Search";

// // import IconButton from "@mui/material/IconButton";
// // import { DataGrid } from "@mui/x-data-grid";
// // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { message } from "antd";
// // import axios from "axios";
// // import moment from "moment";
// // import React, { useEffect, useState } from "react";
// // import { Controller, FormProvider, useForm } from "react-hook-form";
// // import BasicLayout from "../../../../containers/Layout/BasicLayout";
// // import urls from "../../../URLS/urls";
// // // import styles from "../bookingTime/view.module.css";
// // import schema from "./schema";
// // import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import { TimePicker } from "@mui/x-date-pickers/TimePicker";

// // // func
// // const index = () => {
// //   const {
// //     register,
// //     control,
// //     handleSubmit,
// //     methods,
// //     watch,
// //     reset,
// //     setValue,
// //     formState: { errors },
// //   } = useForm({
// //     criteriaMode: "all",
// //     resolver: yupResolver(schema),
// //     mode: "onChange",
// //   });

// //   const [disableKadhnariState, setDisableKadhnariState] = useState(true);
// //   const [disable, setDisable] = useState(true);
// //   const [value, setValuee] = useState(null);
// //   const [valuee, setValueTwo] = useState(null);

// //   const [btnSaveText, setBtnSaveText] = useState("Save");
// //   const [editButtonInputState, setEditButtonInputState] = useState(false);
// //   const [deleteButtonInputState, setDeleteButtonState] = useState(false);
// //   const [dataSource, setDataSource] = useState([]);
// //   const [buttonInputState, setButtonInputState] = useState();
// //   const [isOpenCollapse, setIsOpenCollapse] = useState(false);
// //   const [id, setID] = useState();
// //   const [fetchData, setFetchData] = useState(null);
// //   const [slideChecked, setSlideChecked] = useState(false);
// //   const [zoneNames, setZoneNames] = useState([]);
// //   const [dateValue, setDateValue] = useState(null);
// //   const [venueNames, setVenueNames] = useState([]);
// //   const [wardNames, setWardNames] = useState([]);
// //   const [departments, setDepartments] = useState([]);
// //   // const [subDepartments, setSubDepartments] = useState([]);
// //   const [facilityTypess, setFacilityTypess] = useState([]);
// //   const [facilityNames, setFacilityNames] = useState([]);
// //   const [selectedFacilityType, setSelectedFacilityType] = useState();
// //   const [venues, setVenues] = useState([]);
// //   const [selectedFacilityName, setSelectedFacilityName] = useState();

// //   // useEffect - Reload On update , delete ,Saved on refresh
// //   // useEffect(() => {
// //   //   getAllDetails();
// //   // }, [
// //   //   zoneNames,
// //   //   wardNames,
// //   //   departments,
// //   //   // subDepartments,
// //   //   facilityNames,
// //   //   fetchData,
// //   //   facilityTypess,
// //   // ]);

// //   useEffect(() => {}, []);

// //   // OnSubmit Form
// //   const onSubmitForm = (fromData) => {
// //     // const date = moment(fromData.Date.d, "YYYY-MM-DD").format("YYYY-MM-DD");
// //     let fromBookingTime;
// //     let toBookingTime;
// //     if (moment(value).format("HH") >= 12) {
// //       fromBookingTime = moment(value).format("HH:mm:SS");
// //     } else {
// //       fromBookingTime = moment(value).format("HH:mm:SS");
// //     }

// //     if (moment(valuee).format("HH") >= 12) {
// //       toBookingTime = moment(valuee).format("HH:mm:SS");
// //     } else {
// //       toBookingTime = moment(valuee).format("HH:mm:SS");
// //     }

// //     // const fromBookingTime = moment(value).format("HH:mm") + ":00";
// //     // const toBookingTime = moment(valuee).format("HH:mm") + ":00";

// //     console.log("From", fromBookingTime);
// //     console.log("To", toBookingTime);

// //     // const toBookingTime = moment(fromData.toBookingTime).format(
// //     //   "YYYY-MM-DD hh:mm:ss"
// //     // );

// //     // console.log("To", valuee.getTime());
// //     // console.log("date kuthli ahe re: ", date);

// //     const finalBodyForApi = {
// //       ...fromData,
// //       fromBookingTime,
// //       toBookingTime,
// //     };

// //     console.log("DATA: ", finalBodyForApi);

// //     if (btnSaveText === "Save") {
// //       console.log("Post -----");
// //       const tempData = axios
// //         .post(
// //           `${urls.BaseURL}/bookingMaster/saveBookingMaster`,
// //           finalBodyForApi
// //         )
// //         .then((res) => {
// //           if (res.status == 200) {
// //             // message.success("Data Saved !!!");
// //             sweetAlert("Saved!", "Record Saved successfully !", "success");

// //             setButtonInputState(false);
// //             setIsOpenCollapse(false);
// //             setFetchData(tempData);
// //             setEditButtonInputState(false);
// //             setDeleteButtonState(false);
// //           }
// //         });
// //     }
// //     // Update Data Based On ID
// //     else if (btnSaveText === "Edit") {
// //       console.log("Put -----");
// //       const tempData = axios
// //         .post(
// //           `${urls.BaseURL}/bookingMaster/saveBookingMaster/?id=${id}`,

// //           fromData
// //         )
// //         .then((res) => {
// //           if (res.status == 200) {
// //             // message.success("Data Updated !!!");
// //             sweetAlert("Updated!", "Record Updated successfully !", "success");

// //             setButtonInputState(false);
// //             setIsOpenCollapse(false);
// //             setFetchData(tempData);
// //           }
// //         });
// //     }
// //   };

// //   // Exit Button
// //   const exitButton = () => {
// //     reset({
// //       ...resetValuesExit,
// //     });
// //     setButtonInputState(false);
// //     setIsOpenCollapse(false);
// //     setDeleteButtonState(false);
// //     setEditButtonInputState(false);
// //   };

// //   // cancell Button
// //   const cancellButton = () => {
// //     reset({
// //       ...resetValuesCancell,
// //     });
// //   };

// //   // Reset Values Cancell
// //   const resetValuesCancell = {
// //     zoneName: "",
// //     wardName: "",
// //     department: "",
// //     facilityType: "",
// //     facilityName: "",
// //     venue: "",
// //     date: null,
// //     fromBookingTime: null,
// //     toBookingTime: null,
// //     capacity: "",
// //   };

// //   // Reset Values Exit
// //   const resetValuesExit = {
// //     zoneName: "",
// //     wardName: "",
// //     department: "",
// //     facilityType: "",
// //     facilityName: "",
// //     venue: "",
// //     date: null,
// //     fromBookingTime: null,
// //     toBookingTime: null,
// //     capacity: "",
// //     // fromDate: "",
// //     // toDate: "",
// //   };

// //   // Get Table - Data
// //   const getAllDetails = () => {
// //     axios
// //       .get(`${urls.BaseURL}/bookingMaster/getBookingMasterData`)
// //       .then((res) => {
// //         setDataSource(
// //           res.data.map((r, i) => ({
// //             id: r.id,
// //             srNo: i + 1,

// //             capacity: r.capacity,
// //             zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
// //               ?.zoneName,

// //             venue: venueNames?.find((obj) => obj?.id === r.venue)?.venue,
// //             wardName: wardNames?.find((obj) => obj?.id === r.wardName)
// //               ?.wardName,
// //             department: departments?.find((obj) => obj?.id === r.department)
// //               ?.department,
// //             // subDepartment: subDepartments?.find(
// //             //   (obj) => obj?.id === r.subDepartment
// //             // )?.subDepartment,
// //             fromBookingTime: moment(r.fromBookingTime, "hh:mm A").format(
// //               "hh:mm A"
// //             ),
// //             toBookingTime: moment(r.toBookingTime, "hh:mm A").format("hh:mm A"),

// //             facilityName: facilityNames?.find(
// //               (obj) => obj?.id === r.facilityName
// //             )?.facilityName,

// //             facilityType: facilityTypess?.find(
// //               (obj) => obj?.id === r.facilityType
// //             )?.facilityType,
// //           }))
// //         );
// //       });
// //   };

// //   // define colums table
// //   const columns = [
// //     {
// //       field: "srNo",
// //       headerName: "Sr.No",
// //       // flex: 1,
// //       //   padding: "2%",
// //       width: 70,
// //     },
// //     {
// //       field: "toDate",
// //       headerName: "Swimming Pool Name & Address",
// //       //type: "number",
// //       //   flex: 1,
// //       width: 250,
// //     },

// //     {
// //       field: "zoneName",
// //       headerName: "Membership Number",
// //       //type: "number",
// //       // flex: 2,
// //       width: 150,
// //     },

// //     {
// //       field: "wardName",
// //       headerName: "Name of Member",
// //       //type: "number",
// //       // flex: 1,
// //       width: 150,
// //     },
// //     {
// //       field: "facilityType",
// //       headerName: "Age",
// //       //type: "number",
// //       //   flex: 1,
// //       width: 70,
// //     },
// //     {
// //       field: "facilityName",
// //       headerName: "Registration Date",
// //       //type: "number",
// //       // flex: 1,
// //       width: 150,
// //     },

// //     {
// //       field: "venue",
// //       headerName: "Membership Valid Date",
// //       //type: "number",
// //       // flex: 1,
// //       width: 200,
// //     },

// //     {
// //       field: "fromBookingTime",
// //       headerName: "Receipt Date & Number",
// //       //type: "number",
// //       // flex: 1,
// //       width: 200,
// //     },

// //     // {
// //     //   field: "toBookingTime",
// //     //   headerName: "Receipt Date & Receipt No.",
// //     //   //type: "number",
// //     //   flex: 1,
// //     // },
// //     // {
// //     //   field: "status",
// //     //   headerName: "Status",
// //     //   //type: "number",
// //     //   flex: 1,
// //     // },
// //     // {
// //     //   field: "remark",
// //     //   headerName: "Remark",
// //     //   flex: 1,
// //     // },

// //     // {
// //     //   field: "actions",
// //     //   headerName: "Actions",
// //     //   width: 120,
// //     //   sortable: false,
// //     //   disableColumnMenu: true,
// //     //   renderCell: (params) => {
// //     //     return (
// //     //       <Box
// //     //         sx={{
// //     //           // backgroundColor: "whitesmoke",
// //     //           width: "100%",
// //     //           height: "100%",
// //     //           display: "flex",
// //     //           justifyContent: "center",
// //     //           alignItems: "center",
// //     //         }}
// //     //       ></Box>
// //     //     );
// //     //   },
// //     // },
// //   ];

// //   // View
// //   return (
// //     <>
// //       <BasicLayout>
// //         <Paper
// //           sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
// //         >
// //           <div className={styles.btn}>
// //             <div className={styles.btns}>
// //               <Button
// //                 variant="contained"
// //                 // color="error"
// //                 // endIcon={<ExitToAppIcon />}
// //                 onClick={() => backButton()}
// //               >
// //                 Back
// //               </Button>
// //             </div>
// //             <div className={styles.btns}>
// //               <Button
// //                 variant="contained"
// //                 // color="error"
// //                 // endIcon={<ExitToAppIcon />}
// //                 onClick={() => printButton()}
// //               >
// //                 Print
// //               </Button>
// //             </div>
// //           </div>
// //           {/* <div className={styles.search}>
// //             <FormControl variant="standard">
// //               <InputLabel htmlFor="standard-adornment">Search</InputLabel>
// //               <Input
// //                 id="standard-adornment"
// //                 {...register("applicantNumber")}
// //                 endAdornment={
// //                   <InputAdornment position="end">
// //                     <IconButton>
// //                       <SearchIcon />
// //                     </IconButton>
// //                   </InputAdornment>
// //                 }
// //               />
// //             </FormControl>
// //           </div> */}
// //           <div className={styles.date}>
// //             <div className={styles.sDate}>
// //               <FormControl style={{ marginTop: 10 }} error={!!errors.date}>
// //                 <Controller
// //                   control={control}
// //                   name="toDate"
// //                   defaultValue={null}
// //                   render={({ field }) => (
// //                     <LocalizationProvider dateAdapter={AdapterMoment}>
// //                       <DatePicker
// //                         inputFormat="DD/MM/YYYY"
// //                         label={
// //                           <span style={{ fontSize: 16 }}>
// //                             {/* <FormattedLabel id="toDate" /> */}
// //                             Date(From)
// //                           </span>
// //                         }
// //                         value={field.value}
// //                         onChange={(date) =>
// //                           field.onChange(
// //                             moment(date).format("YYYY-MM-DD")
// //                             // moment(date).format("DD-MM-YYYY")
// //                           )
// //                         }
// //                         selected={field.value}
// //                         center
// //                         renderInput={(params) => (
// //                           <TextField
// //                             {...params}
// //                             size="small"
// //                             fullWidth
// //                             InputLabelProps={{
// //                               style: {
// //                                 fontSize: 12,
// //                                 marginTop: 2,
// //                               },
// //                             }}
// //                           />
// //                         )}
// //                       />
// //                     </LocalizationProvider>
// //                   )}
// //                 />
// //                 <FormHelperText>
// //                   {errors?.date ? errors.toDate.message : null}
// //                 </FormHelperText>
// //               </FormControl>
// //             </div>
// //             <div className={styles.sDate}>
// //               <FormControl style={{ marginTop: 10 }} error={!!errors.date}>
// //                 <Controller
// //                   control={control}
// //                   name="toDate"
// //                   defaultValue={null}
// //                   render={({ field }) => (
// //                     <LocalizationProvider dateAdapter={AdapterMoment}>
// //                       <DatePicker
// //                         inputFormat="DD/MM/YYYY"
// //                         label={
// //                           <span style={{ fontSize: 16 }}>
// //                             {/* <FormattedLabel id="toDate" /> */}
// //                             Date(To)
// //                           </span>
// //                         }
// //                         value={field.value}
// //                         onChange={(date) =>
// //                           field.onChange(
// //                             moment(date).format("YYYY-MM-DD")
// //                             // moment(date).format("DD-MM-YYYY")
// //                           )
// //                         }
// //                         selected={field.value}
// //                         center
// //                         renderInput={(params) => (
// //                           <TextField
// //                             {...params}
// //                             size="small"
// //                             fullWidth
// //                             InputLabelProps={{
// //                               style: {
// //                                 fontSize: 12,
// //                                 marginTop: 3,
// //                               },
// //                             }}
// //                           />
// //                         )}
// //                       />
// //                     </LocalizationProvider>
// //                   )}
// //                 />
// //                 <FormHelperText>
// //                   {errors?.date ? errors.toDate.message : null}
// //                 </FormHelperText>
// //               </FormControl>
// //             </div>
// //             <div className={styles.searchBtn}>
// //               <Button
// //                 variant="contained"
// //                 // color="error"
// //                 // endIcon={<ExitToAppIcon />}
// //                 onClick={() => searchButton()}
// //               >
// //                 Search
// //               </Button>
// //             </div>
// //           </div>
// //           <DataGrid
// //             autoHeight
// //             sx={{
// //               marginLeft: 5,
// //               marginRight: 5,
// //               marginTop: 5,
// //               marginBottom: 5,
// //             }}
// //             rows={dataSource}
// //             columns={columns}
// //             pageSize={5}
// //             rowsPerPageOptions={[5]}
// //             //checkboxSelection
// //           />
// //           <div className={styles.btndiv}>
// //             <div>
// //               <Button
// //                 variant="contained"
// //                 // color="error"
// //                 // endIcon={<ExitToAppIcon />}
// //                 onClick={() => pdfBtn()}
// //               >
// //                 PDF
// //               </Button>
// //             </div>
// //             <div>
// //               {/* EXCEL */}
// //               <Button
// //                 variant="contained"
// //                 // color="error"
// //                 // endIcon={<ExitToAppIcon />}
// //                 onClick={() => excelBtn()}
// //               >
// //                 EXCEL
// //               </Button>
// //             </div>
// //             <div>
// //               {/* CSV */}
// //               <Button
// //                 variant="contained"
// //                 // color="error"
// //                 // endIcon={<ExitToAppIcon />}
// //                 onClick={() => csvBtn()}
// //               >
// //                 CSV
// //               </Button>
// //             </div>
// //           </div>
// //         </Paper>
// //       </BasicLayout>
// //     </>
// //   );
// // };

// // export default index;

// // // import { Router } from "@mui/icons-material";
// // // import { Controller, FormProvider, useForm } from "react-hook-form";
// // // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // // import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// // // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // // import { yupResolver } from "@hookform/resolvers/yup";

// // // import React from "react";
// // // import {
// // //   Box,
// // //   Button,
// // //   FormControl,
// // //   FormHelperText,
// // //   Paper,
// // //   Select,
// // //   MenuItem,
// // //   InputLabel,
// // //   Slide,
// // //   TextField,
// // // } from "@mui/material";

// // // const index = () => {
// // //   const {
// // //     register,
// // //     control,
// // //     handleSubmit,
// // //     methods,
// // //     watch,
// // //     reset,
// // //     setValue,
// // //     formState: { errors },
// // //   } = useForm({
// // //     criteriaMode: "all",
// // //     // resolver: yupResolver(schema),
// // //     mode: "onChange",
// // //   });
// // //   const backButton = () => {
// // //     Router.push(`/sportsPortal/dashboard`);
// // //   };

// // //   const printButton = () => {
// // //     alert("Print Application");
// // //   };
// // //   return (
// // //     <div>
// // //       <div>
// // //         <Button
// // //           variant="contained"
// // //           color="error"
// // //           //   endIcon={<ExitToAppIcon />}
// // //           onClick={() => backButton()}
// // //         >
// // //           Back
// // //         </Button>
// // //         <Button
// // //           variant="contained"
// // //           color="error"
// // //           //   endIcon={<ExitToAppIcon />}
// // //           onClick={() => printButton()}
// // //         >
// // //           Print
// // //         </Button>
// // //       </div>
// // //       <div>
// // //         <FormControl style={{ marginTop: 10 }} error={!!errors.date}>
// // //           <Controller
// // //             control={control}
// // //             name="toDate"
// // //             defaultValue={null}
// // //             render={({ field }) => (
// // //               <LocalizationProvider dateAdapter={AdapterMoment}>
// // //                 <DatePicker
// // //                   inputFormat="DD/MM/YYYY"
// // //                   label={
// // //                     <span style={{ fontSize: 16 }}>
// // //                       {/* <FormattedLabel id="toDate" /> */}
// // //                       Date(From)
// // //                     </span>
// // //                   }
// // //                   value={field.value}
// // //                   onChange={(date) =>
// // //                     field.onChange(
// // //                       moment(date).format("YYYY-MM-DD")
// // //                       // moment(date).format("DD-MM-YYYY")
// // //                     )
// // //                   }
// // //                   selected={field.value}
// // //                   center
// // //                   renderInput={(params) => (
// // //                     <TextField
// // //                       {...params}
// // //                       size="small"
// // //                       fullWidth
// // //                       InputLabelProps={{
// // //                         style: {
// // //                           fontSize: 12,
// // //                           marginTop: 3,
// // //                         },
// // //                       }}
// // //                     />
// // //                   )}
// // //                 />
// // //               </LocalizationProvider>
// // //             )}
// // //           />
// // //           <FormHelperText>
// // //             {errors?.date ? errors.toDate.message : null}
// // //           </FormHelperText>
// // //         </FormControl>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default index;
