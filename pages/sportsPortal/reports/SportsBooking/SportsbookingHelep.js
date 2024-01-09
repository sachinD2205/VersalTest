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
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import sweetAlert from "sweetalert";
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
import URLS from "../../../../URLS/urls";
// import styles from "../bookingTime/view.module.css";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
  // const getAllData('')
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
    mode: "onSubmit",
  });

  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [disable, setDisable] = useState(true);
  const [value, setValuee] = useState(null);
  const [valuee, setValueTwo] = useState(null);

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

  // date states
  const [selectedFromDate, setSelectedFromDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const [selectedToDate, setSelectedToDate] = useState(
    moment().format("YYYY-MM-DD"),
  );

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
  // OnSubmit Form
  const searchButton = () => {
    console.log("selected dates:" + selectedFromDate, selectedToDate);
    axios
      .get(
        // `${URLS.SPURL}/groundBooking/getDataByBookingDate?fromDate=2022-12-12&toDate=2022-12-13`
        `${URLS.SPURL}/sportsBooking/getDataByBookingDate?fromDate=${selectedFromDate}&toDate=${selectedToDate}`,
      )
      .then((res) => {
        console.log("response123", res);
        res.data.sportsBookingGroupDetails.length === 0 &&
          toast("No Sports Bookings Available !", {
            type: "warn",
          });

        setSearchResults(res.data.sportsBookingGroupDetails);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

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

  const handleChange = (date) => {
    console.log(date);
  };

  // Get Table - Data
  const getAllDetails = () => {
    axios
      .get(`${urls.BaseURL}/bookingMaster/getBookingMasterData`)
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
      field: "sportsBookingKey",
      headerName: "Sports Booking Key",
      flex: 1,
      padding: "2%",
    },

    {
      field: "groupDetails",
      headerName: "Group Details",
      //type: "number",
      flex: 1,
    },

    {
      field: "title",
      headerName: "Title",
      //type: "number",
      flex: 1,
    },
    {
      field: "applicantFirstName",
      headerName: "Applicant FirstName",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: 'applicantFirstNameMR',
    //   headerName: 'Applicant FirstName Mr',
    //   //type: "number",
    //   flex: 1,
    // },
    {
      field: "applicantMiddleName",
      headerName: "Applicant MiddleName",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: 'applicantMiddleNameMr',
    //   headerName: 'Applicant MiddleName Mr',
    //   //type: "number",
    //   flex: 1,
    // },

    {
      field: "applicantLastName",
      headerName: "Applicant LastName",
      //type: "number",
      flex: 1,
    },

    // {
    //   field: 'applicantLastNameMr',
    //   headerName: 'Applicant LastName Mr',
    //   //type: "number",
    //   flex: 1,
    // },

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
    //   field: 'currentAddressMr',
    //   headerName: 'Current Address Mr',
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
    //   field: 'cityNameMr',
    //   headerName: 'City Name Mr',
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
    //   field: 'stateMr',
    //   headerName: 'State Mr',
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
    //   field: 'permanantAddress',
    //   headerName: 'Permanant Address',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'permanantAddressMr',
    //   headerName: 'Permanant Address Mr',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'prCityName',
    //   headerName: 'Pr City Name',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'prCityNameMr',
    //   headerName: 'PrCity Name Mr',
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
      field: "bookingRegistrationId",
      headerName: "Booking Registration Id",
      //type: "number",
      flex: 1,
    },
    {
      field: "venue",
      headerName: "Venue",
      //type: "number",
      flex: 1,
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box
    //         sx={{
    //           // backgroundColor: "whitesmoke",
    //           width: '100%',
    //           height: '100%',
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
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
          <Button type="primary" onClick={handlePrint} variant="contained">
            print
          </Button>
          <Button
            type="primary"
            variant="contained"
            onClick={() => console.log("paymentDone")}
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
      </>
    );
  }
}

export default Index;
