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
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useSelector } from "react-redux";
// import urls from "../../../URLS/urls";
// import styles from "../bookingTime/view.module.css";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
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
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
      //   padding: "2%",
    },
    {
      field: "nameOfMember",
      headerName: "Name of Member",
      //type: "number",
      //   flex: 1,
      margin: "5vw",
      padding: "2%",
    },

    {
      field: "age",
      headerName: "Age",
      //type: "number",
      flex: 1,
    },
    {
      field: "applicationNumber",
      headerName: "Application Number",
      //type: "number",
      flex: 1,
    },
    {
      field: "approvedDate",
      headerName: "Approved Date",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "facilityName",
    //   headerName: "Registration Date",
    //   //type: "number",
    // flex: 1s,
    // },

    // {
    //   field: "venue",
    //   headerName: "Membership Valid Date",
    //   //type: "number",
    //   flex: 1,
    // },

    // {
    //   field: "fromBookingTime",
    //   headerName: "Receipt Date & Number",
    //   //type: "number",
    //   flex: 1,
    // },
  ];

  // View
  return (
    <>
      <BasicLayout>
        <Paper
          sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
        >
          <div className={styles.btn}>
            <div className={styles.btns}>
              <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => backButton()}
              >
                Back
              </Button>
            </div>
            <div className={styles.btns}>
              <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => printButton()}
              >
                Print
              </Button>
            </div>
          </div>

          <div className={styles.date}>
            <div className={styles.sDate}>
              <FormControl style={{ marginTop: 10 }} error={!!errors.date}>
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
                            {/* <FormattedLabel id="toDate" /> */}
                            Date(From)
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(
                            moment(date).format("YYYY-MM-DD"),
                            // moment(date).format("DD-MM-YYYY")
                          )
                        }
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
                                marginTop: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.date ? errors.toDate.message : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.sDate}>
              <FormControl style={{ marginTop: 10 }} error={!!errors.date}>
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
                            {/* <FormattedLabel id="toDate" /> */}
                            Date(To)
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(
                            moment(date).format("YYYY-MM-DD"),
                            // moment(date).format("DD-MM-YYYY")
                          )
                        }
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
                  {errors?.date ? errors.toDate.message : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.searchBtn}>
              <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => searchButton()}
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
            rows={dataSource}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            //checkboxSelection
          />
          <div className={styles.btndiv}>
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
              {/* CSV */}
              <Button
                variant="contained"
                // color="error"
                // endIcon={<ExitToAppIcon />}
                onClick={() => csvBtn()}
              >
                CSV
              </Button>
            </div>
          </div>
        </Paper>
      </BasicLayout>
    </>
  );
};

export default Index;
