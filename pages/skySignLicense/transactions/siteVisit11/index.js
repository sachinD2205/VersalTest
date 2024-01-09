import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Slide,
  Grid,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/view.module.css";
// import schema from "../schema/skySignLicense/siteVisit";
import schema from "../../../../containers/schema/skysignschema/siteVisit11schema";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import { TimePicker } from "@mui/x-date-pickers";

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

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [value, setValuee] = useState(null);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // state for name
  const [Onlines, setOnlines] = useState([]);

  const getOnlines = () => {
    axios.get(`${urls.SSLM}/master/paymentType/getAll`).then((r) => {
      setOnlines(
        r.data.paymentType.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
        }))
      );
    });
  };

  useEffect(() => {
    getOnlines();
  }, []);

  // state for name
  const [cfc, setcfc] = useState([]);

  const getcfc = () => {
    axios.get(`${urls.CFCURL}/master/cfcCenters/getAll`).then((r) => {
      setcfc(
        r.data.cfcCenters.map((row) => ({
          id: row.id,
          cfc: row.cfcName,
        }))
      );
    });
  };

  useEffect(() => {
    getcfc();
  }, []);

  // state for name
  const [licenseType, setlicenseType] = useState([]);

  const getlicenseType = () => {
    axios.get(`${urls.SSLM}/master/MstLicenseType/getAll`).then((r) => {
      setlicenseType(
        r.data.MstLicenseType.map((row) => ({
          id: row.id,
          licenseType: row.licenseType,
        }))
      );
    });
  };

  useEffect(() => {
    getlicenseType();
  }, []);

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SSLM}/master/siteVisit/saveSiteVisit`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getSiteVisit();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SSLM}/master/siteVisit/saveSiteVisit`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getSiteVisit();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    console.log("formData", fromData);
    const fromDate = moment(fromData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(fromData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
      // activeFlag: btnSaveText === "Update" ? null : fromData.activeFlag,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    // Save - DB
    console.log("Post -----");
    axios
      .post(
        `${urls.SSLM}/master/siteVisit/saveSiteVisit`,
        finalBodyForApi
      )
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getSiteVisit();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    online: "",
    cfc: "",
    applicationNumber: "",
    licenseType: "",
    licenseNumber: "",
    scheduleDate: null,
    scheduleTime: null,
    scheduleTokenNo: "",
    RescheduleDate: null,
    rescheduleTime: null,
    status: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    online: "",
    cfc: "",
    applicationNumber: "",
    licenseType: "",
    licenseNumber: "",
    scheduleDate: null,
    scheduleTime: null,
    scheduleTokenNo: "",
    RescheduleDate: null,
    rescheduleTime: null,
    status: "",
  };

  // Get Table - Data
  const getSiteVisit = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    console.log("getLIC ----");
    axios
      .get(`${urls.SSLM}/master/siteVisit/getSiteVisitDetails`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),

            // online: r.online,

            // Online: Onlines?.find((obj) => obj?.id === r.Online)?.Online,
            cfc: cfc?.find((obj) => obj?.id === r.CFC)?.CFC,
            licenseType: licenseType?.find((obj) => obj?.id === r.licenseType)?.licenseType,
            // cfc: r.cfc,

            applicationNo:r.applicationNo,
            scheduleDate:r.scheduleDate,
            scheduleTime:r.scheduleTime,
            rescheduleDate:r.rescheduleDate,
            rescheduleTime:r.rescheduleTime,
            scheduleTokenNo:r.scheduleTokenNo,
            // licenseType:r.licenseType,
            licenseNumber:r.LicenseNumber,
            remark: r.remarkFromPCMC,
            // mediaTypeName: mediaTypes?.find((obj) => obj?.id == r.mediaType)?.mediaType,
            // mediaSubTypeName: mediaSubType?.find((obj) => obj?.id == r.mediaSubType)?.mediaSubType,
            status: r.Status,
          };
        });
        setDataSource([..._res]);
        setData({
          // rows: _res,
          // totalRows: r.data.totalElements,
          // rowsPerPageOptions: [10, 20, 50, 100],
          // pageSize: r.data.pageSize,
          // page: r.data.pageNo,
        });
      });
  };
  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getSiteVisit();
  }, []);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "fromDate",
      headerName: "From Date",
    },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "Online",
    //   headerName: "Online",
    //   //type: "number",
    //   flex: 1,
    // },
    {
      field: "cfc",
      headerName: "cfc",
      //type: "number",
      flex: 1,
    },
    {
      field: "applicationNo",
      headerName: "applicationNumber",
      //type: "number",
      flex: 1,
    },
    {
      field: "licenseType",
      headerName: "licenseType ",
      //type: "number",
      flex: 1,
    },
    {
      field: "licenseNumber",
      headerName: "licenseNumber",
      //type: "number",
      flex: 1,
    },
    {
      field: "scheduleDate",
      headerName: "scheduleDate",
      //type: "number",
      flex: 1,
    },
    {
      field: "scheduleTime",
      headerName: "scheduleTime",
      //type: "number",
      flex: 1,
    },
    {
      field: "scheduleTokenNo",
      headerName: "scheduleTokenNo",
      //type: "number",
      flex: 1,
    },
    {
      field: "RescheduleDate",
      headerName: "RescheduleDate",
      //type: "number",
      flex: 1,
    },

    {
      field: "rescheduleTime",
      headerName: "rescheduleTime",
      //type: "number",
      flex: 1,
    },
    {
      field: "status",
      headerName: "status",
      //type: "number",
      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
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
          </Box>
        );
      },
    },
  ];

  // View
  return (
    <>
      {/* <BasicLayout titleProp={"none"}> */}
      <Paper
        sx={{
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div>
                  <Typography
                    className={styles.rap}
                    variant="h6"
                    sx={{ marginTop: 5 }}
                  >
                    <strong>Site Visit </strong>
                  </Typography>
                </div>
                <Grid
                  container
                  sx={{
                    marginLeft: 5,
                    marginTop: 2,
                    marginBottom: 5,
                    align: "center",
                  }}
                >
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormControl style={{ marginTop: 10 }}>
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="YYYY/MM/DD"
                              label={
                                <span style={{ fontSize: 16 }}>From Date</span>
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormControl style={{ marginTop: 10 }}>
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="YYYY/MM/DD"
                              label={
                                <span style={{ fontSize: 16 }}>To Date</span>
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
                    </FormControl>
                  </Grid>

                  {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.Online}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Online *
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Online *"
                          >
                            {Onlines &&
                              Onlines.map((Online, index) => (
                                <MenuItem key={index} value={Online.id}>
                                  {Online.paymentType}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="Online"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.Online ? errors.Online.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.cfc}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Cfc *
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Cfc *"
                          >
                            {cfc &&
                              cfc.map((cfc, index) => (
                                <MenuItem key={index} value={cfc.id}>
                                  {cfc.cfc}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="cfc"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.cfc ? errors.cfc.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <TextField
                      id="standard-basic"
                      label="Application Number"
                      variant="standard"
                      defaultValue=""
                      {...register("applicationNumber")}
                      error={!!errors.applicationNumber}
                      helperText={
                        errors?.applicationNumber
                          ? errors.applicationNumber.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <div>
                  <Typography
                    className={styles.rap}
                    variant="h6"
                    sx={{ marginTop: 5 }}
                  >
                    <strong>License Info</strong>
                  </Typography>
                </div>
                <Grid
                  container
                  sx={{
                    marginLeft: 5,
                    marginTop: 2,
                    marginBottom: 5,
                    align: "center",
                  }}
                >
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.licenseType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        License Type *
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="License Type *"
                          >
                            {licenseType &&
                              licenseType.map((licenseType, index) => (
                                <MenuItem key={index} value={licenseType.id}>
                                  {licenseType.licenseType}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="licenseType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.licenseType
                          ? errors.licenseType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                      id="standard-basic"
                      label="License Number"
                      variant="standard"
                      defaultValue=""
                      {...register("licenseNumber")}
                      error={!!errors.licenseNumber}
                      helperText={
                        errors?.licenseNumber
                          ? errors.licenseNumber.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormControl style={{ marginTop: 50 }}>
                      <Controller
                        control={control}
                        name="scheduleDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="YYYY/MM/DD"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Schedule Date
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormControl
                      style={{ marginTop: 50, width: 250 }}
                      error={!!errors.scheduleTime}
                    >
                      <Controller
                        control={control}
                        sx={{ width: 200 }}
                        name="scheduleTime"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Select Time
                                </span>
                              }
                              value={value}
                              onChange={(newValue) => {
                                setValuee(newValue);
                                console.log("Ha Time Aahe: ", newValue);
                              }}
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
                        {errors?.scheduleTime ? errors.scheduleTime.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      style={{ marginTop: 45 }}
                      id="standard-basic"
                      label="Schedule Token No"
                      variant="standard"
                      defaultValue=""
                      {...register("scheduleTokenNo")}
                      error={!!errors.scheduleTokenNo}
                      helperText={
                        errors?.scheduleTokenNo
                          ? errors.scheduleTokenNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormControl style={{ marginTop: 50 }}>
                      <Controller
                        control={control}
                        name="RescheduleDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="YYYY/MM/DD"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Reschedule Date
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormControl
                      style={{ marginTop: 50, width: 250 }}
                      error={!!errors.rescheduleTime}
                    >
                      <Controller
                        control={control}
                        sx={{ width: 200 }}
                        name="rescheduleTime"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              label={
                                <span style={{ fontSize: 16 }}>
                               rescheduleTime
                                </span>
                              }
                              value={value}
                              onChange={(newValue) => {
                                setValuee(newValue);
                                console.log("Ha Time Aahe: ", newValue);
                              }}
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
                        {errors?.rescheduleTime
                          ? errors.rescheduleTime.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      style={{ marginTop: 45 }}
                      id="standard-basic"
                      label="Status"
                      variant="standard"
                      defaultValue=""
                      {...register("status")}
                      error={!!errors.status}
                      helperText={errors?.status ? errors.status.message : null}
                    />
                  </Grid>
                </Grid>
                <div className={styles.btn}>
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    {btnSaveText}
                  </Button>{" "}
                  <Button
                    sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    Exit
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        )}
        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setBtnSaveText("Save");
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            Add{" "}
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            // marginLeft: 5,
            // marginRight: 5,
            // marginTop: 5,
            // marginBottom: 5,

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
          // rows={dataSource}
          // columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          //checkboxSelection

          density="compact"
          // autoHeight={true}
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
            getSiteVisit(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getSiteVisit(_data, data.page);
          }}
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;

// export default index
