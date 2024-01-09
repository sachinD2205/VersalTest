import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/Auditorium";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Auditorium = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
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

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getZoneName();
    getWardNames();
  }, []);

  useEffect(() => {
    getAuditorium();
  }, [wardNames, zoneNames]);

  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneNames(r.data.zone);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardNames(r.data.ward);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditorium = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log("res aud", res);

        let result = res.data.mstAuditoriumList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            srNo: i + 1,
            id: val.id,
            auditoriumNameEn: val.auditoriumNameEn ? val.auditoriumNameEn : "-",
            auditoriumNameMr: val.auditoriumNameMr ? val.auditoriumNameMr : "-",
            zone: val.zoneId
              ? zoneNames.find((obj) => obj?.id == val.zoneId)?.zoneName
              : "Not Available",
            ward: val.wardId
              ? wardNames.find((obj) => obj?.id == val.wardId)?.wardName
              : "Not Available",
            addressEn: val.addressEn ? val.addressEn : "-",
            addressMr: val.addressMr ? val.addressMr : "-",
            gsiIdGeocode: val.gsiIdGeocode ? val.gsiIdGeocode : "-",
            seatingCapacity: val.seatingCapacity ? val.seatingCapacity : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            activeFlag: val.activeFlag,
            zoneId: val.zoneId,
            wardId: val.wardId,
            startTime: val.startTime
              ? moment(val.startTime).format("hh:mm A")
              : null,
            endTime: val.endTime ? moment(val.endTime).format("hh:mm A") : null,
            _startTime: val.startTime,
            _endTime: val.endTime,
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
      })
        .then((willDelete) => {
          console.log("inn", willDelete);
          if (willDelete === true) {
            console.log("aaaafffee");
            axios
              .post(`${urls.PABBMURL}/mstAuditorium/save`, body, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                console.log("delet res", res);
                if (res.status == 201) {
                  console.log("response", res);
                  swal(
                    language == "en"
                      ? "Record is Successfully Deactivated!"
                      : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                    {
                      icon: "success",
                    }
                  );
                  getAuditorium();
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
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
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
            .post(`${urls.PABBMURL}/mstAuditorium/save`, body, {
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
                getAuditorium();
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

  const getFilterWards = (value) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
        {
          params: { departmentId: 30, zoneId: value.target.value },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("Filtered Wards", r);
        setWardNames(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const resetValuesCancell = {
    zone: null,
    wardName: null,
    auditoriumName: "",
    address: "",
    gsiIdGeocode: "",
    seatingCapacity: "",
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
    const finalBodyForApi = {
      ...formData,
      zoneId: Number(formData.zone),
      wardId: Number(formData.wardName),
      seatingCapacity: Number(formData.seatingCapacity),
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
      startTime: formData.startTime
        ? moment(formData.startTime).format("YYYY-MM-DDTHH:mm:ss")
        : null,
      endTime: formData.endTime
        ? moment(formData.endTime).format("YYYY-MM-DDTHH:mm:ss")
        : null,
      // startTime: moment(formData.startTime).format("HH:mm"),
      // endTime: moment(formData.endTime).format("HH:mm"),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PABBMURL}/mstAuditorium/save`, finalBodyForApi, {
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
          getAuditorium();
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
      minWidth: 70,
      headerAlign: "center",
    },
    {
      field: "zone",
      headerName: <FormattedLabel id="zone" />,
      flex: 0.5,
      minWidth: 120,
      headerAlign: "center",
    },
    {
      field: "ward",
      headerName: <FormattedLabel id="ward" />,
      flex: 0.5,
      minWidth: 120,
      headerAlign: "center",
    },
    {
      // field: "auditoriumName",
      // headerName: <FormattedLabel id="auditorium" />,
      field: language == "en" ? "auditoriumNameEn" : "auditoriumNameMr",
      headerName:
        language == "en" ? (
          <FormattedLabel id="auditorium" />
        ) : (
          <FormattedLabel id="auditoriumMr" />
        ),
      flex: 1,
      minWidth: 310,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "addressEn" : "addressMr",
      headerName:
        language == "en" ? (
          <FormattedLabel id="address" />
        ) : (
          <FormattedLabel id="addressMr" />
        ),
      // field: "address",
      // headerName: <FormattedLabel id="address" />,
      flex: 0.8,
      minWidth: 300,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "startTime",
      headerName: <FormattedLabel id="startTime" />,
      flex: 0.4,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
    },
    {
      field: "endTime",
      headerName: <FormattedLabel id="endTime" />,
      flex: 0.4,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
    },
    {
      field: "gsiIdGeocode",
      headerName: <FormattedLabel id="gisIdGeocode" />,
      flex: 0.4,
      align: "center",
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "seatingCapacity",
      headerName: <FormattedLabel id="seatingCapacity" />,
      flex: 0.3,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.4,
      sortable: false,
      minWidth: 150,
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
                setValue("zone", params.row.zoneId);
                setValue("wardName", params.row.wardId);
                setValue("startTime", params.row._startTime);
                setValue("endTime", params.row._endTime);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
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
            </IconButton>
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
      <Paper>
        <Box>
          <BreadcrumbComponent />
        </Box>
        {/* <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="newAuditoriumEntry" />{" "}
          </h2>
        </Box> */}
        <PabbmHeader labelName="newAuditoriumEntry" />
        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse && (
              <FormProvider {...methods}>
                {/* <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit> */}
                <form onSubmit={handleSubmit(onSubmitForm)}>
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
                        variant="outlined"
                        size="small"
                        error={!!errors.zone}
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="zone" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                field.onChange(value);
                                // getFilterWards(value);
                              }}
                              label={<FormattedLabel id="zone" required />}
                            >
                              {zoneNames &&
                                zoneNames.map((zoneName, index) => (
                                  <MenuItem key={index} value={zoneName.id}>
                                    {zoneName.zoneName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zone"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zone ? errors.zone.message : null}
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
                        size="small"
                        error={!!errors.wardName}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="ward" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="ward" required />}
                            >
                              {wardNames &&
                                wardNames.map((wardName, index) => (
                                  <MenuItem key={index} value={wardName.id}>
                                    {wardName.wardName}
                                  </MenuItem>
                                ))}
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
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          fieldName={"auditoriumNameEn"}
                          updateFieldName={"auditoriumNameMr"}
                          sourceLang={"eng"}
                          variant="outlined"
                          targetLang={"mar"}
                          label={<FormattedLabel id="auditorium" required />}
                          error={!!errors.auditoriumNameEn}
                          targetError={"auditoriumNameEn"}
                          InputLabelProps={{
                            shrink: !!watch("auditoriumNameEn"),
                          }}
                          helperText={
                            errors?.auditoriumNameEn
                              ? errors.auditoriumNameEn.message
                              : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="auditorium" />}
                        variant="standard"
                        sx={{ width: "90%" }}
                        {...register("auditoriumNameEn")}
                        error={!!errors.auditoriumNameEn}
                        helperText={
                          errors?.auditoriumNameEn
                            ? errors.auditoriumNameEn.message
                            : null
                        }
                      /> */}
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
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          fieldName={"auditoriumNameMr"}
                          updateFieldName={"auditoriumNameEn"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          variant="outlined"
                          label={<FormattedLabel id="auditoriumMr" required />}
                          error={!!errors.auditoriumNameMr}
                          targetError={"auditoriumNameMr"}
                          InputLabelProps={{
                            shrink: !!watch("auditoriumNameMr"),
                          }}
                          helperText={
                            errors?.auditoriumNameMr
                              ? errors.auditoriumNameMr.message
                              : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="auditoriumMr" />}
                        variant="standard"
                        sx={{ width: "90%" }}
                        {...register("auditoriumNameMr")}
                        error={!!errors.auditoriumNameMr}
                        helperText={
                          errors?.auditoriumNameMr
                            ? errors.auditoriumNameMr.message
                            : null
                        }
                      /> */}
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
                        sx={{ width: "90%" }}
                        error={!!errors.startTime}
                      >
                        <Controller
                          name="startTime"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <TimePicker
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DDTHH:mm")
                                  )
                                }
                                selected={field.value}
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Auditorium Start Time
                                    {/* <FormattedLabel id="eventTimeFrom" /> */}
                                  </span>
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    error={!!errors.startTime}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.startTime ? errors.startTime.message : null}
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
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={!!errors.endTime}
                      >
                        <Controller
                          name="endTime"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <TimePicker
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Auditorium End Time
                                    {/* <FormattedLabel id="eventTimeFrom" /> */}
                                  </span>
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    error={!!errors.endTime}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.endTime ? errors.endTime.message : null}
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
                      }}
                    >
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          fieldName={"addressEn"}
                          updateFieldName={"addressMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          variant="outlined"
                          label={<FormattedLabel id="address" required />}
                          error={!!errors.addressEn}
                          targetError={"addressEn"}
                          InputLabelProps={{
                            shrink: !!watch("addressEn"),
                          }}
                          helperText={
                            errors?.addressEn ? errors.addressEn.message : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        sx={{ width: "90%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="address" />}
                        variant="standard"
                        {...register("addressEn")}
                        error={!!errors.addressEn}
                        helperText={
                          errors?.addressEn ? errors.addressEn.message : null
                        }
                      /> */}
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
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          fieldName={"addressMr"}
                          updateFieldName={"addressEn"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          variant="outlined"
                          label={<FormattedLabel id="address" required />}
                          error={!!errors.addressMr}
                          targetError={"addressMr"}
                          InputLabelProps={{
                            shrink: !!watch("addressMr"),
                          }}
                          helperText={
                            errors?.addressMr ? errors.addressMr.message : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        sx={{ width: "90%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="addressMr" />}
                        variant="standard"
                        {...register("addressMr")}
                        error={!!errors.addressMr}
                        helperText={
                          errors?.addressMr ? errors.addressMr.message : null
                        }
                      /> */}
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
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        id="outlined-basic"
                        size="small"
                        label={<FormattedLabel id="gisIdGeocode" required />}
                        variant="outlined"
                        {...register("gsiIdGeocode")}
                        error={!!errors.gsiIdGeocode}
                        helperText={
                          errors?.gsiIdGeocode
                            ? errors.gsiIdGeocode.message
                            : null
                        }
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
                        sx={{ width: "90%" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="seatingCapacity" required />}
                        variant="outlined"
                        size="small"
                        {...register("seatingCapacity")}
                        error={errors.seatingCapacity}
                        helperText={
                          errors?.seatingCapacity
                            ? errors.seatingCapacity.message
                            : null
                        }
                      />
                    </Grid>
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
                        size="small"
                        type="submit"
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
                {/* </Slide> */}
              </FormProvider>
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
                      getAuditorium(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getAuditorium(_data, data.page);
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

export default Auditorium;
