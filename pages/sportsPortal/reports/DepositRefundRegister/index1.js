import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";

// import styles from "../../reports/reports.module.css";
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
import { useSelector } from "react-redux";

// import styles from "../bookingTime/view.module.css";
import schema from "../../../../containers/schema/sportsPortalSchema/departmentSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

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
    moment().format("YYYY-MM-DD")
  );
  // moment().format('YYYY-MM-DD')
  const [selectedToDate, setSelectedToDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  // moment().format('YYYY-MM-DD')

  // const [pageSize, setPageSize] = useState();
  // const [totalElements, setTotalElements] = useState();
  // const [pageNo, setPageNo] = useState(0);

  // const [data, setData] = useState({
  //   rows: [],
  //   totalRows: 0,
  //   rowsPerPageOptions: [10, 20, 50, 100],
  //   pageSize: 10,
  //   page: 1,
  // });

  const searchButton = () => {
    console.log("selected dates:" + selectedFromDate, selectedToDate);
    console.log(typeof selectedFromDate);

    axios
      .get(
        // `${URLS.SPURL}/groundBooking/getDataByBookingDate?fromDate=2022-12-12&toDate=2022-12-13`
        `${URLS.SPURL}/groundBooking/getDepositFunds?fromDate=${selectedFromDate}&toDate=${selectedToDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("response123", res);
        res.data.groundBooking.length === 0 &&
          toast("No Ground Bookings Available !", {
            type: "warn",
          });

        setSearchResults(res.data.groundBooking);
      })
      .catch((err) => {
        console.log("error while fetching serach results:" + err);
        toast("Something went wrong!", {
          type: "error",
        });
      });
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
          finalBodyForApi
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

          fromData
        )
        .then((res) => {
          if (res.status == 200) {
            // message.success("Data Updated !!!");
            sweetAlert("Updated!", "Record Updated successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
          }
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
              "hh:mm A"
            ),
            toBookingTime: moment(r.toBookingTime, "hh:mm A").format("hh:mm A"),

            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName
            )?.facilityName,

            facilityType: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType
            )?.facilityType,
          }))
        );
      });
  };

  // define colums table
  const columns = [
    {
      field: "id", //'bookingRegistrationId',
      headerName: "Sr.no", // Sr No
      width: 20,
      // flex: 1,
      // width: 160,
      // padding: '2%',
    },
    {
      field: "applicationNumber",
      headerName: "Application No",
      width: 120,
      // flex: 1,
      // padding: '2%',
    },
    {
      field: "applicationDate",
      headerName: "Application Date",
      width: 120,
      // flex: 1,
      // padding: '2%',
    },
    {
      field: "bookingRegistrationId",
      headerName: "Booking No",
      width: 90,
      // flex: 1,
      // padding: '2%',
    },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      width: 100,
      //type: "number",
      // flex: 1,
    },

    // {
    //   field: 'bookingType',
    //   headerName: 'Booking Type',
    //   width: 102,
    //   //type: "number",
    //   // flex: 1,
    // },

    // {
    //   field: 'applicationDate',
    //   headerName: 'Application Date',
    //   width: 120,
    //   //type: "number",
    //   // flex: 1,
    // },

    {
      field: "zone",
      headerName: "Zone",
      width: 20,
      //type: "number",
      // flex: 1,
    },

    {
      field: "department",
      headerName: "Department",
      width: 90,
      //type: "number",
      // flex: 1,
    },

    {
      field: "facilityType",
      headerName: "Facility Type",
      width: 100,
      //type: "number",
      // flex: 1,
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      width: 100,
      //type: "number",
      // flex: 1,
    },

    // {
    //   field: 'bankName',
    //   headerName: 'Bank Name',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'branchName',
    //   headerName: 'Branch Name',
    //   //type: "number",
    //   flex: 1,
    // },

    {
      field: "bankAccountHolderName",
      headerName: "Name",
      width: 20,
      //type: "number",
      // flex: 1,
    },

    // {
    //   field: 'bankAccountNo',
    //   headerName: 'Bank Account No',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'ifscCode',
    //   headerName: 'ifscCode',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'bankAddress',
    //   headerName: 'bankAddress',
    //   //type: "number",
    //   flex: 1,
    // },

    // {
    //   field: 'aadharCard',
    //   headerName: 'Aadhar Card',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'panCard',
    //   headerName: 'Pan Card',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'otherDocumentPhoto',
    //   headerName: 'Other Document Photo',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'purposeOfBooking',
    //   headerName: 'Purpose Of Booking',
    //   width: 151,
    //   // flex: 1,
    // },
    // {
    //   field: 'status',
    //   headerName: 'status',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'jrClerkRemark',
    //   headerName: 'Jr Clerk Remark',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'srClerkRemark',
    //   headerName: 'Sr Clerk Remark',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'officeSuperidentRemark',
    //   headerName: 'Office Superident Remark',
    //   //type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'sportsOfficerRemark',
    //   headerName: 'Sports Officer Remark',
    //   //type: "number",
    //   flex: 1,
    // },
    {
      field: "groundName",
      headerName: "Ground Name",
      width: 102,
      //type: "number",
      // flex: 1,
    },
    {
      field: "groundLocation",
      headerName: "Ground addr.",
      width: 100,
      //type: "number",
      // flex: 1,
    },

    // {
    //   field: 'groundReservationDate',
    //   headerName: 'Ground Reserved Date',
    //   width: 130,
    //   //type: "number",
    //   // flex: 1,
    // },
    // {
    //   field: 'groundReservationDatails',
    //   headerName: 'Ground Reservation Datails',
    //   width: 130,
    //   //type: "number",
    //   // flex: 1,
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
          onClick={() => console.log("paymentDone")}
        >
          Exit
        </Button>
      </div>
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
              <h3>Deposit Refund Register Deatils</h3>
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
                    inputFormat="YYYY-MM-DD"
                    label={
                      <span style={{ fontSize: 16 }}>
                        {/* <FormattedLabel id="toDate" /> */}
                        Date(From)
                      </span>
                    }
                    value={this.props.selectedFromDate}
                    onChange={(date) =>
                      this.props.setSelectedFromDate(
                        // date
                        // moment(date).format('YYYY-MM-DD')
                        moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
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
                    inputFormat="YYYY-MM-DD"
                    label={
                      <span style={{ fontSize: 16 }}>
                        {/* <FormattedLabel id="toDate" /> */}
                        Date(To)
                      </span>
                    }
                    value={this.props.selectedToDate}
                    onChange={(date) =>
                      this.props.setSelectedToDate(
                        moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                        // date
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
              {/* CSV */
          /*  <Button
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
