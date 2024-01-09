import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/timeSlots";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[equipmentCharges].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import { Watch } from "@mui/icons-material";
import { Typography } from "antd";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const TimeSlots = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [auditoriums, setAuditoriums] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [showTime, setShowTime] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getTimeSlots();
  }, [auditoriums]);

  useEffect(() => {
    getAuditorium();
    getShifts();
  }, []);

  const getTimeSlots = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstTimeSlots/getAll`, {
        // .get(`http://10.0.0.160:9006/pabbm/api/mstTimeSlots/getAll`, {

        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: "desc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(";res", res);
        setLoading(false);
        let result = res.data.mstTimeSlotsList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            ...val,
            fromDate: val.fromDate
              ? moment(val.fromDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : "-",
            toDate: val.toDate
              ? moment(val.toDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : "-",
            publishFromDate: val.publishFromDate
              ? moment(val.publishFromDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : "-",
            publishToDate: val.publishToDate
              ? moment(val.publishToDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : "-",
            _publishFromDate: val.publishFromDate ? val.publishFromDate : "-",
            _publishToDate: val.publishToDate ? val.publishToDate : "-",
            bookingConformationDate: val.bookingConformationDate
              ? moment(val.bookingConformationDate, "YYYY-MM-DD").format(
                  "DD/MM/YYYY"
                )
              : "-",
            activeFlag: val.activeFlag,
            srNo: _pageSize * _pageNo + i + 1,
            slotDescription: val.slotDescription ? val.slotDescription : "-",
            from: val.slotFrom
              ? moment(val.slotFrom).format("DD/MM/YYYY hh:mm A")
              : "-",
            id: val.id,
            to: val.slotTo
              ? moment(val.slotTo).format("DD/MM/YYYY hh:mm A")
              : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            shift: val.shift
              ? shifts?.find((obj) => {
                  return obj?.id == Number(val.shift);
                })?.shift
              : "-",
            shiftId: val.shift ? val.shift : null,
            auditorium: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == Number(val.auditoriumKey);
                })?.auditoriumNameEn
              : "-",
            auditoriumName: val.auditoriumKey ? val.auditoriumKey : null,
            applicationDisAndAcceptDuration:
              val?.applicationDisAndAcceptDuration
                ? moment(val?.applicationDisAndAcceptDuration).format(
                    "YYYY-MM-DD HH:mm A"
                  )
                : null,
            // _from: val.slotFrom ? val.slotFrom : null,
            // _to: val.slotTo ? val.slotTo : null,
            _from: val.fromDate ? val.fromDate : null,
            _to: val.toDate ? val.toDate : null,
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
            auditoriumNameMr: row.auditoriumNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getShifts = () => {
    axios
      .get(`${urls.PABBMURL}/mstEventHour/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe shift", r);
        setShifts(
          r.data.mstEventHourList.map((row, index) => ({
            id: row.id,
            timeSlot: row.timeSlot,
            shift: row.shift,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.PABBMURL}/mstTimeSlots/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal(
                  language == "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getTimeSlots();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.PABBMURL}/mstTimeSlots/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal(
                  language == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getTimeSlots();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const resetValuesCancell = {
    slotDescription: "",
    fromDate: null,
    toDate: null,
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData, btnSaveText);
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const publishFromDate = moment(formData.publishFromDate).format(
      "YYYY-MM-DD"
    );
    const publishToDate = moment(formData.publishToDate).format("YYYY-MM-DD");
    const bookingConformationDate = moment(
      formData.bookingConformationDate
    ).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...formData,
      activeFlag: btnSaveText == "Update" ? formData.activeFlag : null,
      auditoriumKey: Number(formData?.auditoriumName),
      eventHours: formData?.eventHrs,
      fromDate,
      toDate,
      publishFromDate,
      publishToDate,
      bookingConformationDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      // .post(`http://10.0.0.160:9006/pabbm/api/mstTimeSlots/save`, finalBodyForApi)
      .post(`${urls.PABBMURL}/mstTimeSlots/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert(
                language == "en" ? "Updated!" : "अपडेट केले",
                language == "en"
                  ? "Record Updated successfully!"
                  : "रेकॉर्ड यशस्वीरित्या अपडेट केले",
                "success"
              )
            : sweetAlert(
                language == "en" ? "Saved!" : "जतन केले",
                language == "en"
                  ? "Record Saved successfully!"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
                "success"
              );
          getTimeSlots();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    billType: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      align: "center",
      headerAlign: "center",
      minWidth: 60,
    },
    {
      field: "auditorium",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1.3,
      headerAlign: "center",
      minWidth: 350,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "eventHours",
      headerName: <FormattedLabel id="eventHours" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },

    {
      field: "showTime",
      headerName: <FormattedLabel id="showTimeDuration" />,
      flex: 0.8,
      headerAlign: "center",
      minWidth: 150,
    },
    // {
    //   field: "shift",
    //   headerName: <FormattedLabel id="shift" />,
    //   flex: 0.6,
    //   headerAlign: "center",
    // },
    {
      field: "publishFromDate",
      headerName: <FormattedLabel id="publishFromDate" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "publishToDate",
      headerName: <FormattedLabel id="publishToDate" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    // {
    //   field: "from",
    //   headerName: <FormattedLabel id="eventTimeFrom" />,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "to",
    //   headerName: <FormattedLabel id="eventTimeTo" />,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "bookingConformationDate",
      headerName: <FormattedLabel id="bookingConfirmationDate" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },

    // {
    //   field: "applicationDisAndAcceptDuration",
    //   headerName: "Application Display & Accept Duration",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setBtnSaveText("Update"),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
                setValue("eventHrs", params?.row?.eventHours);
                setValue("fromDate", params?.row?._from);
                setValue("toDate", params?.row?._to);
                setValue("publishFromDate", params?.row?._publishFromDate);
                setValue("publishToDate", params?.row?._publishToDate);

                setValue("showTime", params?.row?.showTime);
                console.log("params.row: ", params.row, watch("toDate"));
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton> */}
          </>
        );
      },
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
    <div>
      <Paper style={{ marginTop: "50px" }}>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <PabbmHeader labelName="auditoriumSchedule" />

        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container sx={{ padding: "10px" }}>
                    {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{ width: "90%" }}
                        error={errors.slotFrom}
                      >
                        <Controller
                          control={control}
                          name="slotFrom"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => (
                                  <TextField
                                    {...props}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                                label={<FormattedLabel id="eventTimeFrom" />}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.slotFrom ? errors.slotFrom.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={errors.fromDate}
                      >
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD-MM-YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromDate" />
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
                                    error={errors.fromDate}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromDate ? errors.fromDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl sx={{ width: "90%" }} error={errors.toDate}>
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD-MM-YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="toDate" />
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
                                    error={errors.toDate}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDate ? errors.toDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{ width: "90%" }}
                        error={errors.slotTo}
                      >
                        <Controller
                          control={control}
                          name="slotTo"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => (
                                  <TextField
                                    {...props}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                                label={<FormattedLabel id="eventTimeTo" />}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.slotTo ? errors.slotTo.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>
                        <FormattedLabel id="noOfDays" /> :{" "}
                        {moment(watch("toDate"))?.diff(
                          moment(watch("fromDate")),
                          "days",
                          true
                        ) || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.auditoriumName}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="auditorium" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="auditorium" />}
                            >
                              {auditoriums &&
                                auditoriums.map((auditorium, index) => {
                                  return (
                                    <MenuItem key={index} value={auditorium.id}>
                                      {auditorium.auditoriumNameEn}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          )}
                          name="auditoriumName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.auditoriumName
                            ? errors.auditoriumName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.shift}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="shift" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => {
                                return field.onChange(value);
                              }}
                              label={<FormattedLabel id="shift" />}
                            >
                              {shifts.map((auditorium, index) => {
                                return (
                                  <MenuItem key={index} value={auditorium.id}>
                                    {auditorium.shift}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="shift"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.shift ? errors.shift.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.eventHrs}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="eventHours" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => {
                                if (value.target.value === 3) {
                                  setShowTime([
                                    "12:00 To 15:00",
                                    "17:00 To 20:00",
                                    "21:00 To 00:00",
                                  ]);
                                } else if (value.target.value === 2) {
                                  setShowTime(["09:00 To 11:00"]);
                                } else if (value.target.value === 5) {
                                  setShowTime([
                                    "10:00 To 15:00",
                                    "17:00 To 22:00",
                                  ]);
                                } else if (value.target.value === 8) {
                                  setShowTime(["12:00 To 20:00"]);
                                } else if (value.target.value === 10) {
                                  setShowTime(["10:00 To 20:00"]);
                                } else if (value.target.value === 12) {
                                  setShowTime(["10:00 To 22:00"]);
                                } else if (value.target.value === 15) {
                                  setShowTime(["09:00 To 00:00"]);
                                } else {
                                  setShowTime([]);
                                }
                                field.onChange(value);
                              }}
                              label="Event Hours"
                            >
                              {/* {[2, 3, 5, 8, 10, 12, 15].map( */}
                              {shifts?.map((auditorium, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={auditorium?.timeSlot}
                                  >
                                    {auditorium?.timeSlot}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="eventHrs"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.eventHrs ? errors.eventHrs.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.showTime}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="showTimeDuration" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => {
                                return field.onChange(value);
                              }}
                              label="Show Time / Duration"
                            >
                              {showTime?.map((auditorium, index) => {
                                return (
                                  <MenuItem key={index} value={auditorium}>
                                    {auditorium}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="showTime"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.showTime ? errors.showTime.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {watch("shift") == 1 && <Typography>2 Hours</Typography>}
                      {watch("shift") == 2 && <Typography>3 Hours</Typography>}
                      {watch("shift") == 3 && <Typography>5 Hours</Typography>}
                      {watch("shift") == 4 && <Typography>8 Hours</Typography>}
                      {watch("shift") == 5 && <Typography>10 Hours</Typography>}
                      {watch("shift") == 6 && <Typography>12 Hours</Typography>}
                      {watch("shift") == 7 && <Typography>15 Hours</Typography>}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{ width: "90%" }}
                        error={
                          errors.durationOfApplicationDistributionAndAcceptance
                        }
                      >
                        <Controller
                          control={control}
                          name="applicationDisAndAcceptDuration"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => (
                                  <TextField
                                    {...props}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                                label={
                                  <FormattedLabel id="durationOfApplicationDistributionAndAcceptance" />
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.durationOfApplicationDistributionAndAcceptance
                            ? errors
                                .durationOfApplicationDistributionAndAcceptance
                                .message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={errors.publishFromDate}
                      >
                        <Controller
                          control={control}
                          name="publishFromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD-MM-YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="publishFromDate" />
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
                                    error={errors.publishFromDate}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.publishFromDate
                            ? errors.publishFromDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={errors.publishToDate}
                      >
                        <Controller
                          control={control}
                          name="publishToDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD-MM-YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="publishToDate" />
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
                                    error={errors.publishFromDate}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.publishToDate
                            ? errors.publishToDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={errors.bookingConformationDate}
                      >
                        <Controller
                          control={control}
                          name="bookingConformationDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD-MM-YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="bookingConfirmationDate" />
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
                                    error={errors.bookingConformationDate}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.bookingConformationDate
                            ? errors.bookingConformationDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{ width: "90%" }}
                        error={errors.holidayWeekendSchedule}
                      >
                        <Controller
                          control={control}
                          name="holidayWeekendSchedule"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => (
                                  <TextField
                                    {...props}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                                label={
                                  <FormattedLabel id="holidayWeekendSchedule" />
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.holidayWeekendSchedule
                            ? errors.holidayWeekendSchedule.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                        size="small"
                      >
                        {btnSaveText}
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                        size="small"
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider />
                </form>
              </Slide>
            )}

            {!isOpenCollapse && (
              <>
                <Grid container style={{ padding: "10px" }}>
                  <Grid item xs={9}></Grid>
                  <Grid
                    item
                    xs={2}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<AddIcon />}
                      type="primary"
                      size="small"
                      disabled={buttonInputState}
                      onClick={() => {
                        reset({
                          ...resetValuesExit,
                        });
                        setEditButtonInputState(true);
                        setDeleteButtonState(true);
                        setBtnSaveText("Save");
                        setButtonInputState(true);
                        setSlideChecked(true);
                        setIsOpenCollapse(!isOpenCollapse);
                      }}
                    >
                      <FormattedLabel id="add" />
                    </Button>
                  </Grid>
                </Grid>

                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                    components={{ Toolbar: GridToolbar }}
                    sx={{
                      overflowY: "scroll",
                      overflowX: "scroll",
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
                    autoHeight={true}
                    // rowHeight={50}
                    pagination
                    paginationMode="server"
                    // loading={data.loading}
                    rowCount={data.totalRows}
                    rowsPerPageOptions={data.rowsPerPageOptions}
                    page={data.page}
                    pageSize={data.pageSize}
                    rows={data.rows}
                    columns={columns}
                    onPageChange={(_data) => {
                      getTimeSlots(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getTimeSlots(_data, data.page);
                    }}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default TimeSlots;
