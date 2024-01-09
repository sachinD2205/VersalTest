import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import moment from "moment/moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/serviceNameSchema";
import styles from "../../../styles/cfc/cfc.module.css";
import Transliteration from "../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [loiGeneration, setLoiGeneration] = useState(false);
  const [scrutinyProcess, setScrutinyProcess] = useState(false);
  const [immediateAtCounter, setImmediateAtCounter] = useState(false);
  const [rtsSelection, setRtsSelection] = useState(false);

  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [open, setOpen] = useState(false);
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

  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getServiceMaster = async (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setOpen(true);
    axios
      .get(`${urls.BaseURL}/service/getAll`, {
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
        if (res.status == 200) {
          setOpen(false);
          let result = res.data.service;
          let _res = result.map((r, i) => {
            console.log("res payment mode", res);
            return {
              srNo: i + 1 + _pageNo * _pageSize,
              id: r.id,
              ...r,
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              application: r.application,
              applicationNameEng: applications.find(
                (obj) => obj?.id === r.application
              )?.applicationNameEng,
              applicationNameMr: applications.find(
                (obj) => obj?.id === r.application
              )?.applicationNameMr,
              department: r.department,
              departmentName: departments?.find(
                (obj) => obj?.id == r.department
              )?.department,
              departmentNameMr: departments?.find(
                (obj) => obj?.id == r.department
              )?.departmentMr,
              serviceName: r.serviceName,
              serviceNameMr: r.serviceNameMr,
              serviceDays: r.serviceDays,
              scrutinyProcess: r.scrutinyProcess,
              noOfScrutinyLevel: r.noOfScrutinyLevel,
              immediateAtCounter: r.immediateAtCounter,
              rtsSelection: r.rtsSelection,
              loiGeneration: r.loiGeneration,

              scrutinyProcessOp: r.scrutinyProcess == true ? "Yes" : "No",
              immediateAtCounterOp: r.immediateAtCounter == true ? "Yes" : "No",
              rtsSelectionOp: r.rtsSelection == true ? "Yes" : "No",
              loiGenerationOp: r.loiGeneration == true ? "Yes" : "No",

              scrutinyProcessMrOp: r.scrutinyProcess == true ? "होय" : "नाही",
              immediateAtCounterMrOp:
                r.immediateAtCounter == true ? "होय" : "नाही",
              rtsSelectionMrOp: r.rtsSelection == true ? "होय" : "नाही",
              loiGenerationMrOp: r.loiGeneration == true ? "होय" : "नाही",

              status: r.activeFlag === "Y" ? "Active" : "Inactive",
              activeFlag: r.activeFlag,
            };
            setOpen(false);
          });

          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const getApplication = async () => {
    setOpen(true);

    await axios
      .get(`${urls.BaseURL}/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setApplications(
          r.data.application.map((row) => ({
            id: row.id,
            appCode: row.appCode,
            applicationNameEng: row.applicationNameEng,
            applicationNameMr: row.applicationNameMr,
            module: row.module,
          }))
        );
        setOpen(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const getDepartment = async () => {
    // setOpen(true);

    await axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
        setOpen(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    getApplication();
  }, [departments]);

  useEffect(() => {
    getServiceMaster();
  }, [applications]);

  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
      fromDate: moment(formData.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      toDate: moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
    };

    axios
      .post(`${urls.BaseURL}/service/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "serviceName") {
                setError("serviceName", { message: x.code });
              } else if (x.field == "serviceNameMr") {
                setError("serviceNameMr", { message: x.code });
              }
            });
          } else {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getApplication();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    // console.log('body', body)
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // // console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.BaseURL}/service/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              // console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getApplication();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
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
        // console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.BaseURL}/service/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              // console.log('delet res', res)
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getServiceMaster();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValues,
    });
    setScrutinyProcess(false);
    setRtsSelection(false);
    setImmediateAtCounter(false);
    setLoiGeneration(false);
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValues,
      id,
    });
  };

  // Reset Values Cancell || Exit
  const resetValues = {
    serviceName: "",
    serviceDays: null,
    rtsSelection: false,
    immediateAtCounter: false,
    scrutinyProcess: false,
    loiGeneration: false,
    noOfScrutinyLevel: null,
    department: null,
    application: null,
    toDate: null,
    fromDate: null,
    serviceNameMr: "",
    displayOrder: "",
    clickTo: "",
    serviceCode: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 0.4,
      cellClassName: "super-app-theme--cell",
    },

    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceName" />,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "serviceDays",
      headerName: <FormattedLabel id="serviceDays" />,
      headerAlign: "center",
      flex: 0.6,
    },

    {
      field: language == "en" ? "scrutinyProcessOp" : "scrutinyProcessMrOp",
      headerName: <FormattedLabel id="isScrutinyBased" />,
      headerAlign: "center",
      flex: 0.6,
    },

    {
      field: language == "en" ? "rtsSelectionOp" : "rtsSelectionMrOp",
      headerName: <FormattedLabel id="rtsSelection" />,
      headerAlign: "center",
      flex: 0.6,
    },

    {
      field:
        language == "en" ? "immediateAtCounterOp" : "immediateAtCounterMrOp",
      headerName: <FormattedLabel id="isImmediateAtCounter" />,
      headerAlign: "center",
      flex: 0.6,
    },

    {
      field: language == "en" ? "loiGenerationOp" : "loiGenerationMrOp",
      headerName: <FormattedLabel id="loiGeneration" />,
      headerAlign: "center",
      flex: 0.6,
    },

    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      headerAlign: "center",
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                //   disabled={editButtonInputState && params.row.activeFlag === "N" ? false : true}
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
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "40%" }}>
            {<FormattedLabel id="serviceMasterHeader" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValues,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                backgroundColor: "#F5F5F5",
              }}
              elevation={5}
            >
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* <FormControl style={{ marginTop: 30 }} error={!!errors.fromDate}>
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={<span style={{ fontSize: 16 }}>From Date</span>}
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      // error={errors?.fromDate ? true : false}
                                      error={true}
                                      style={{ backgroundColor: "white" }}
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
                            {errors?.fromDate ? (
                              <span style={{ color: "red" }}>{errors.fromDate.message}</span>
                            ) : null}
                          </FormHelperText>
                        </FormControl> */}
                        {/* <Typography>From Date</Typography> */}
                        <FormControl style={{ width: "90%" }}>
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="fromDate" />
                                    </span>
                                  }
                                  inputFormat="dd-MM-yyyy"
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      style={{ backgroundColor: "white" }}
                                      {...params}
                                      size="small"
                                      error={errors?.fromDate ? true : false}
                                      fullWidth
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromDate ? (
                              <span style={{ color: "red" }}>
                                {errors.fromDate.message}
                              </span>
                            ) : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl style={{ width: "90%" }}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="toDate" />
                                    </span>
                                  }
                                  inputFormat="dd-MM-yyyy"
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      style={{ backgroundColor: "white" }}
                                      {...params}
                                      size="small"
                                      error={errors?.toDate ? true : false}
                                      fullWidth
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.toDate ? (
                              <span style={{ color: "red" }}>
                                {errors.toDate.message}
                              </span>
                            ) : null}
                          </FormHelperText>
                        </FormControl>
                        {/* <FormControl style={{ marginTop: 50 }} error={!!errors.toDate}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={<span style={{ fontSize: 16 }}>To Date</span>}
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      style={{ backgroundColor: "white" }}
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
                          <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                        </FormControl> */}
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        // sx={{ marginTop: 5 }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          size="small"
                          variant="outlined"
                          style={{
                            width: "90%",
                          }}
                          // sx={{ width: 250, marginTop: 5, marginLeft: 12 }}
                          error={!!errors.application}
                        >
                          <InputLabel
                            id="demo-simple-select-outlined-label"
                            shrink={watch("application") ? true : false}
                          >
                            <FormattedLabel id="application" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ backgroundColor: "white" }}
                                value={field.value || ""}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="application" />}
                              >
                                {applications &&
                                  applications.map(
                                    (applicationNameEng, index) => (
                                      <MenuItem
                                        key={index}
                                        value={applicationNameEng.id}
                                      >
                                        {language === "en"
                                          ? applicationNameEng.applicationNameEng
                                          : applicationNameEng.applicationNameMr}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="application"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.application
                              ? errors.application.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          size="small"
                          // fullWidth
                          sx={{ width: "90%" }}
                          error={!!errors.department}
                        >
                          <InputLabel
                            id="demo-simple-select-outlined-label"
                            shrink={watch("department") ? true : false}
                          >
                            <FormattedLabel id="departmentName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ backgroundColor: "white" }}
                                value={field.value || ""}
                                variant="outlined"
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="departmentName" />}
                              >
                                {departments &&
                                  departments.map((department, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={department.id}
                                      >
                                        {language === "en"
                                          ? department.department
                                          : department.departmentMr}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="department"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.department
                              ? errors.department.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* ithn khali zalet */}
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{
                            width: "90%",
                            backgroundColor: "white",
                          }}
                          id="outlined-basic"
                          label={<FormattedLabel id="serviceCode" />}
                          variant="outlined"
                          {...register("serviceCode")}
                          error={!!errors.serviceCode}
                          helperText={
                            errors?.serviceCode
                              ? errors.serviceCode.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("serviceCode") ? true : false,
                          }}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <Box sx={{ width: "90%" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"serviceName"}
                            labelName={"serviceName"}
                            fieldName={"serviceName"}
                            updateFieldName={"serviceNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel id="serviceNameEn" required />
                            }
                            error={!!errors.serviceName}
                            helperText={
                              errors?.serviceName
                                ? errors.serviceName.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <Box sx={{ width: "90%" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"serviceNameMr"}
                            labelName={"serviceNameMr"}
                            fieldName={"serviceNameMr"}
                            updateFieldName={"serviceName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel id="serviceNameMr" required />
                            }
                            error={!!errors.serviceNameMr}
                            helperText={
                              errors?.serviceNameMr
                                ? errors.serviceNameMr.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          type="number"
                          sx={{
                            width: "90%",
                            backgroundColor: "white",
                          }}
                          id="outlined-basic"
                          label={<FormattedLabel id="serviceDays" />}
                          variant="outlined"
                          {...register("serviceDays")}
                          error={!!errors.serviceDays}
                          helperText={
                            errors?.serviceDays
                              ? errors.serviceDays.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("serviceDays") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{
                            width: "90%",
                            backgroundColor: "white",
                          }}
                          id="outlined-basic"
                          label={<FormattedLabel id="url" />}
                          variant="outlined"
                          {...register("clickTo")}
                          error={!!errors.clickTo}
                          helperText={
                            errors?.clickTo ? errors.clickTo.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("clickTo") ? true : false,
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          type="number"
                          size="small"
                          sx={{
                            width: "90%",
                            backgroundColor: "white",
                          }}
                          id="outlined-basic"
                          label={<FormattedLabel id="displayOrder" />}
                          variant="outlined"
                          {...register("displayOrder")}
                          error={!!errors.displayOrder}
                          helperText={
                            errors?.displayOrder
                              ? errors.displayOrder.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("displayOrder") ? true : false,
                          }}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          size="small"
                          error={!!errors.scrutinyProcess}
                          sx={{ width: "90%" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={immediateAtCounter}
                                checked={scrutinyProcess}
                              />
                            }
                            label={<FormattedLabel id="isScrutinyBased" />}
                            {...register("scrutinyProcess")}
                            onChange={(e) => {
                              // console.log("[on]",e.target.checked);
                              setScrutinyProcess(e.target.checked);
                            }}
                          />
                          <FormHelperText>
                            {errors?.scrutinyProcess
                              ? errors.scrutinyProcess.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {scrutinyProcess && (
                          <>
                            <TextField
                              size="small"
                              sx={{
                                width: "90%",
                                backgroundColor: "white",
                              }}
                              id="outlined-basic"
                              label={<FormattedLabel id="noOfScrutinyLevels" />}
                              variant="outlined"
                              {...register("noOfScrutinyLevel")}
                              error={!!errors.noOfScrutinyLevel}
                              helperText={
                                errors?.noOfScrutinyLevel
                                  ? errors.noOfScrutinyLevel.message
                                  : null
                              }
                              InputLabelProps={{
                                shrink: watch("noOfScrutinyLevel")
                                  ? true
                                  : false,
                              }}
                            />
                          </>
                        )}
                      </Grid>
                    </Grid>

                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        // style={{
                        //   display: "flex",
                        //   justifyContent: "left",
                        //   alignItems: "left",
                        // }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          size="small"
                          error={!!errors.rtsSelection}
                          sx={{ width: "90%" }}
                        >
                          <FormControlLabel
                            control={<Checkbox checked={rtsSelection} />}
                            label={<FormattedLabel id="rtsSelection" />}
                            {...register("rtsSelection")}
                            onChange={(e) => {
                              setRtsSelection(e.target.checked);
                            }}
                          />
                          <FormHelperText>
                            {errors?.rtsSelection
                              ? errors.rtsSelection.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          size="small"
                          error={!!errors.immediateAtCounter}
                          sx={{ width: "90%" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={scrutinyProcess}
                                checked={immediateAtCounter}
                              />
                            }
                            label={<FormattedLabel id="isImmediateAtCounter" />}
                            {...register("immediateAtCounter")}
                            onChange={(e) => {
                              setImmediateAtCounter(e.target.checked);
                            }}
                          />
                          <FormHelperText>
                            {errors?.immediateAtCounter
                              ? errors.immediateAtCounter.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          size="small"
                          error={!!errors.loiGeneration}
                          sx={{ width: "90%" }}
                        >
                          <FormControlLabel
                            control={<Checkbox checked={loiGeneration} />}
                            label={<FormattedLabel id="loiGeneration" />}
                            {...register("loiGeneration")}
                            onChange={(e) => {
                              setLoiGeneration(e.target.checked);
                            }}
                          />
                          <FormHelperText>
                            {errors?.loiGeneration
                              ? errors.loiGeneration.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={3}
                        md={3}
                        lg={3}
                        xl={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      ></Grid>
                    </Grid>

                    <br />
                    <Grid container className={styles.feildres}>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "end" }}
                      >
                        <Button
                          type="submit"
                          size="small"
                          color="success"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id="Save" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => {
                            setScrutinyProcess(false);
                            setRtsSelection(false);
                            setImmediateAtCounter(false);
                            setLoiGeneration(false);
                            reset({
                              ...resetValues,
                            });
                          }}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          className={styles.button}
                          // color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                  </div>
                </form>
              </FormProvider>
            </Paper>
          </Slide>
        )}
        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            autoHeight
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#E3EAEA",
                borderLeft: "10px solid white",
                borderRight: "10px solid white",
                borderTop: "4px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                // transform: "scale(1.1)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E3EAEA",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-column": {
                backgroundColor: "red",
              },
            }}
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
              getServiceMaster(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getServiceMaster(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
