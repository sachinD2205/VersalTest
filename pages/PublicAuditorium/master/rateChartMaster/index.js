import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/rateChartMaster";
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
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const RateChartMaster = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({ resolver: yupResolver(schema) });
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      days: "isMondayToThursday",
      ticket: 1,
    },
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [loading, setLoading] = useState(false);

  const [chargeNames, setChargeNames] = useState([]);
  const [filteredEquipmentNames, setFilteredEquipmentNames] = useState([]);
  const [equipmentName, setEquipmentName] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [events, setEvents] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getChargeNames();
    getAuditorium();
    getEvents();
    getRateChart();
    getShifts();
  }, []);

  useEffect(() => {
    getRateChart();
  }, [chargeNames, auditoriums, events]);

  const getRateChart = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstRateChart/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res RCM", res);
        setLoading(false);
        let result = res.data.mstRateChartList;
        let _res = result.map((val, i) => {
          console.log("222", auditoriums);
          return {
            ...val,
            activeFlag: val.activeFlag,
            srNo: _pageSize * _pageNo + i + 1,
            id: i,
            auditoriumName: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == val.auditoriumKey;
                })?.auditoriumNameEn
              : "-",
            auditoriumNameMr: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == val.auditoriumKey;
                })?.auditoriumNameMr
              : "-",
            eventName: val.eventKey
              ? events?.find((obj) => {
                  return obj?.id == val.eventKey;
                })?.eventNameEn
              : "-",
            eventName: val.eventKey
              ? events?.find((obj) => {
                  return obj?.id == val.eventKey;
                })?.eventNameEn
              : "-",
            chargeName: val.chargeNameKey
              ? chargeNames?.find((obj) => {
                  return obj?.id == val.chargeNameKey;
                })?.charge
              : "-",
            chargeNameMr: val.changeNameKey
              ? chargeNames?.find((obj) => {
                  return obj?.id == val.chargeNameKey;
                })?.chargeMr
              : "-",
            price: val.price ? val.price : "-",
            fromDate: val.fromDate
              ? moment(val.fromDate).format("DD-MM-YYYY")
              : "-",
            id: val.id,
            toDate: val.toDate ? moment(val.toDate).format("DD-MM-YYYY") : "-",
            // range: val.rangeKey
            //   ? [
            //       { id: 1, type: "10%" },
            //       { id: 2, type: "20%" },
            //       { id: 3, type: "30%" },
            //       { id: 4, type: "40%" },
            //       { id: 5, type: "50%" },
            //     ].find((obj) => {
            //       return obj.id == val.rangeKey;
            //     })?.type
            //   : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            _auditoriumName: val?.auditoriumKey,
            eventKey: val?.eventKey,
            charge: val?.chargeNameKey,
            period: val.period ? val.period : "-",
            _fromDate: val?.fromDate,
            _toDate: val?.toDate,
            // ticketRange: val?.ticketRange == 1 ? "0 To 100" : "101 & above",
            ticketRange:
              val?.ticketRange == 1
                ? "0 To 100"
                : val?.ticketRange == 2
                ? "101 & above"
                : "-",
            isMondayToThursday: val?.isMondayToThursday == true ? true : false,
            isFridayToSunday: val?.isFridayToSunday == true ? true : false,
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

  const getChargeNames = () => {
    axios
      .get(`${urls.CFCURL}/master/chargeName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("11res11", res);

        let result = res.data.chargeName;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            ...val,
          };
        });

        setChargeNames(_res);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // const getChargeNames = () => {
  //   axios.get(`${urls.CFCURL}/master/servicecharges/getAll`).then((res) => {
  //     console.log("11res11", res);

  //     let result = res.data.serviceCharge;
  //     let _res = result?.map((val, i) => {
  //       console.log("44", val);
  //       return val.application == 16 && val;
  //     });
  //     console.log("33", _res);
  //     setChargeNames(_res);
  //   });
  // };

  const [shifts, setShifts] = useState([]);

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

  const getEvents = () => {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setEvents(
          r.data.trnAuditoriumEventsList.map((row) => ({
            ...row,
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
            .post(`${urls.PABBMURL}/mstEquipmentCharges/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal(
                  language == "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getRateChart();
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
            .post(`${urls.PABBMURL}/mstEquipmentCharges/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal(
                  language == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getRateChart();
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
      id,
    });
  };

  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    remark: "",
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
    console.log("formData", formData);
    setLoading(true);
    const finalBodyForApi = {
      ...formData,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
      price: Number(formData.price),
      auditoriumKey: Number(formData.auditoriumName),
      // rangeKey: Number(formData.range),
      eventKey: Number(formData.eventKey),
      chargeNameKey: Number(formData.charge),

      fromDate: moment(formData.fromDate).format("YYYY-MM-DDTHH:mm:ss"),
      toDate: formData.toDate
        ? moment(formData.toDate).format("YYYY-MM-DDTHH:mm:ss")
        : null,
      isMondayToThursday:
        watch("charge") == 33
          ? null
          : formData.days == "isMondayToThursday"
          ? true
          : false,
      isFridayToSunday:
        watch("charge") == 33
          ? null
          : formData.days == "isFridayToSunday"
          ? true
          : false,
      ticketRange: watch("charge") == 33 ? null : formData?.ticket,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PABBMURL}/mstRateChart/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        setLoading(false);
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
          getRateChart();
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
    fromDate: "",
    toDate: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
      minWidth: 60,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
      align: "right",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      flex: 1,
      align: "right",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: language == "en" ? "auditoriumName" : "auditoriumNameMr",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1.5,
      headerAlign: "center",
      minWidth: 310,
    },
    {
      field: language == "en" ? "eventName" : "eventNameMr",
      headerName: <FormattedLabel id="eventName" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "period",
      headerName: <FormattedLabel id="period" />,
      flex: 0.8,
      align: "right",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "isMondayToThursday",
      headerName: <FormattedLabel id="isMondayToThursday" />,
      flex: 0.8,
      align: "right",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "isFridayToSunday",
      headerName: <FormattedLabel id="isFridayToSunday" />,
      flex: 0.8,
      align: "right",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: language == "en" ? "chargeName" : "chargeNameMr",
      headerName: <FormattedLabel id="chargeName" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 120,
    },
    {
      field: "ticketRange",
      headerName: <FormattedLabel id="ticket" />,
      flex: 0.8,
      align: "right",
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "price",
      headerName: <FormattedLabel id="price" />,
      flex: 0.8,
      align: "right",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "cgst",
      headerName: <FormattedLabel id="cgst" />,
      flex: 0.8,
      align: "right",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "sgst",
      headerName: <FormattedLabel id="sgst" />,
      flex: 0.8,
      align: "right",
      headerAlign: "center",
      minWidth: 100,
    },
    // {
    //   field: "range",
    //   headerName: <FormattedLabel id="range" />,
    //   flex: 0.8,
    //   align: "center",
    //   headerAlign: "center",
    //   minWidth: 100,
    // },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue("auditoriumName", params.row._auditoriumName);
                setValue("equipmentCategory", params.row._equipmentCategory);
                setValue("equipmentName", params.row._equipmentName);
                setValue("fromDate", params.row._fromDate);
                setValue("toDate", params.row._toDate);
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
      <Paper style={{ marginTop: "10%" }}>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <PabbmHeader labelName="rateChartMaster" />

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
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
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
                          name="fromDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromDate" required />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
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
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl sx={{ width: "90%" }} error={errors.toDate}>
                        <Controller
                          name="toDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="toDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
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
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        error={errors.auditoriumName}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="auditorium" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                <FormattedLabel id="auditorium" required />
                              }
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
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        variant="outlined"
                        sx={{ width: "90%" }}
                        error={!!errors.eventKey}
                        size="small"
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="selectEvent" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                <FormattedLabel id="selectEvent" required />
                              }
                            >
                              {events &&
                                events.map((service, index) => (
                                  <MenuItem
                                    key={index}
                                    sx={{
                                      display: service.programEventDescription
                                        ? "flex"
                                        : "none",
                                    }}
                                    value={service.id}
                                  >
                                    {service.programEventDescription}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="eventKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.eventKey ? errors.eventKey.message : null}
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.period}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="period" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="period" required />}
                              // label="Period (Hours)"
                            >
                              {
                                // [
                                //   { id: 1, hour: "1 Hr" },
                                //   { id: 2, hour: "2 Hr" },
                                //   { id: 3, hour: "3 Hr" },
                                //   { id: 4, hour: "4 Hr" },
                                //   { id: 5, hour: "5 Hr" },
                                //   { id: 6, hour: "6 Hr" },
                                //   { id: 7, hour: "7 Hr" },
                                //   { id: 8, hour: "8 Hr" },
                                //   { id: 9, hour: "9 Hr" },
                                //   { id: 10, hour: "10 Hr" },
                                //   { id: 11, hour: "11 Hr" },
                                //   { id: 12, hour: "12 Hr" },
                                //   { id: 13, hour: "13 Hr" },
                                //   { id: 14, hour: "14 Hr" },
                                //   { id: 15, hour: "15 Hr" },
                                //   { id: 16, hour: "16 Hr" },
                                //   { id: 17, hour: "17 Hr" },
                                //   { id: 18, hour: "18 Hr" },
                                //   { id: 19, hour: "19 Hr" },
                                //   { id: 20, hour: "20 Hr" },
                                //   { id: 21, hour: "21 Hr" },
                                //   { id: 22, hour: "22 Hr" },
                                //   { id: 23, hour: "23 Hr" },
                                //   { id: 24, hour: "24 Hr" },
                                // ]
                                shifts?.map((equipmentCat, index) => {
                                  return (
                                    <MenuItem
                                      key={index}
                                      value={equipmentCat?.timeSlot}
                                    >
                                      {equipmentCat?.timeSlot}
                                    </MenuItem>
                                  );
                                })
                              }
                            </Select>
                          )}
                          name="period"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.period ? errors.period.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {watch("charge") != 33 && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <FormLabel
                          component="legend"
                          sx={{ paddingLeft: "5%" }}
                        >
                          <FormattedLabel id="days" />
                        </FormLabel>
                        <FormControl
                          fullWidth
                          required
                          size="small"
                          sx={{
                            width: "100%",
                          }}
                          // error={errors.lightOnOffStatus}
                        >
                          <Controller
                            name="days"
                            control={control}
                            defaultValue="isMondayToThursday"
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                defaultValue="isMondayToThursday"
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                }}
                              >
                                <FormControlLabel
                                  value="isMondayToThursday"
                                  control={<Radio />}
                                  label={
                                    <FormattedLabel id="isMondayToThursday" />
                                  }
                                />
                                <FormControlLabel
                                  value="isFridayToSunday"
                                  control={<Radio />}
                                  label={
                                    <FormattedLabel id="isFridayToSunday" />
                                  }
                                />
                              </RadioGroup>
                            )}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {/* {errors?.lightOnOffStatus
                    ? errors.lightOnOffStatus.message
                    : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.charge}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="chargeName" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                <FormattedLabel id="chargeName" required />
                              }
                            >
                              {chargeNames?.map((equipmentCat, index) => {
                                return (
                                  <MenuItem
                                    sx={{
                                      display: equipmentCat?.charge
                                        ? "flex"
                                        : "none",
                                    }}
                                    key={index}
                                    value={equipmentCat.id}
                                  >
                                    {equipmentCat.charge}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="charge"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.charge ? errors.charge.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {watch("period") != 2 && watch("charge") != 33 && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <FormLabel
                          component="legend"
                          sx={{ paddingLeft: "5%" }}
                        >
                          {<FormattedLabel id="ticket" />}
                        </FormLabel>
                        <FormControl
                          fullWidth
                          required
                          size="small"
                          sx={{ width: "100%" }}
                          // error={errors.lightOnOffStatus}
                        >
                          <Controller
                            name="ticket"
                            control={control}
                            defaultValue={1}
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                defaultValue={1}
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                }}
                              >
                                <FormControlLabel
                                  value={1}
                                  control={<Radio />}
                                  label={<FormattedLabel id="zeroToHundred" />}
                                />
                                <FormControlLabel
                                  value={2}
                                  control={<Radio />}
                                  label={
                                    <FormattedLabel id="oneHundredOneAndAbove" />
                                  }
                                />
                              </RadioGroup>
                            )}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {/* {errors?.lightOnOffStatus
                    ? errors.lightOnOffStatus.message
                    : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label={<FormattedLabel id="price" required />}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                        {...register("price")}
                        error={!!errors.price}
                        helperText={errors?.price ? errors.price.message : null}
                      />
                    </Grid>
                    {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        error={errors.discount}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="discount" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="discount" />}
                            >
                              {[
                                { id: 1, type: "10%" },
                                { id: 2, type: "20%" },
                                { id: 3, type: "30%" },
                                { id: 4, type: "40%" },
                                { id: 5, type: "50%" },
                              ]?.map((equipmentCat, index) => {
                                return (
                                  <MenuItem key={index} value={equipmentCat.id}>
                                    {equipmentCat.type}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="range"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.discount ? errors.discount.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                  </Grid>
                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label={<FormattedLabel id="cgst" />}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                        {...register("cgst")}
                        error={!!errors.cgst}
                        helperText={errors?.cgst ? errors.cgst.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label={<FormattedLabel id="sgst" />}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                        {...register("sgst")}
                        error={!!errors.sgst}
                        helperText={errors?.sgst ? errors.sgst.message : null}
                      />
                    </Grid>
                  </Grid> */}
                  {/* <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.ticketRate}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="ticketRate" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="ticketRate" />}
                            >
                              {[
                                { id: 1, tRate: "0 to 100" },
                                { id: 2, tRate: "100 and above" },
                              ]?.map((val, index) => {
                                return (
                                  <MenuItem key={index} value={val.id}>
                                    {val.tRate}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="ticketRate"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.ticketRate
                            ? errors.ticketRate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid> */}
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
                        size="small"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
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
                        size="small"
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
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
                        variant="contained"
                        color="error"
                        size="small"
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
                      size="small"
                      type="primary"
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

                <Box
                  style={{
                    backgroundColor: "white",
                    /* height: "auto" */ overflowY: "auto",
                    overflowX: "auto",
                    /* width: "auto" */ overflowY: "auto",
                    overflowX: "auto",
                    // overflow: "auto",
                  }}
                >
                  <DataGrid
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                    components={{ Toolbar: GridToolbar }}
                    sx={{
                      // overflowY: "scroll",
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
                    scroll={{ x: true }} // Enable horizontal scrolling
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
                      getRateChart(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getRateChart(_data, data.page);
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

export default RateChartMaster;
