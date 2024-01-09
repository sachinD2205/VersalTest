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
  CircularProgress,
  FormControl,
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/Locality";
import styles from "../../../styles/cfc/cfc.module.css";
import Transliteration from "../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Locality = () => {
  const language = useSelector((state) => state?.label?.language);
  const token = useSelector((state) => state.user.user.token);

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

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [zones, setZone] = useState([]);
  const [circle, setCircle] = useState([]);

  const router = useRouter();

  const [load, setLoad] = useState(false);
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

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const handleLoad = () => {
    setLoad(false);
  };

  useEffect(() => {
    getZone();
  }, []);

  // useEffect(() => {
  //   getCircle();
  // }, [zones]);

  useEffect(() => {
    // setFetchData(false);
    getAllLocality();
  }, [zones]);

  //get All Administrative Zone
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setZone(
          // res.data.zone.map((r, i) => ({
          //   id: r.id,
          //   zone: r.zoneName,
          // })),
          res.data.zone
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  //get All Circle
  const getCircle = () => {
    axios
      .get(`${urls.CFCURL}/master/circle/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCircle(
          res.data.circle.map((r, i) => ({
            id: r.id,
            circle: r.circle,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getAllLocality = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoad(true);
    axios
      .get(`${urls.CFCURL}/master/locality/getAll`, {
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
        setLoad(false);
        let result = res.data.locality;
        let _res = result.map((r, i) => {
          console.log("first", r);
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            circle: r.circle ? r.circle : "-",
            localityPrefix: r.localityPrefix ? r.localityPrefix : "-",
            landmark: r.landmark ? r.landmark : "-",
            _fromDate: r.fromDate,
            _toDate: r.toDate,
            fromDate: r.fromDate
              ? moment(r.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "-",
            toDate: r.toDate
              ? moment(r.toDate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "-",
            landmarkMr: r.landmarkMr ? r.landmarkMr : "-",
            id: r.id,
            zone: r.zone ? r.zone : "-",
            zoneName: r.zone
              ? zones?.find((obj) => obj?.id === r.zone)?.zoneName
              : "-",
            remark: r.remark ? r.remark : "-",
            activeFlag: r.activeFlag,
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
      ?.catch((err) => {
        setLoad(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (formData) => {
    const fromDate = moment(formData.fromDate, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      landmark: formData?.landMark,
      landmarkMr: formData?.landMarkMr,
      fromDate,
      toDate,
    };

    axios
      .post(`${urls.CFCURL}/master/locality/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("locality res", res);
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "Landmark") {
                setError("landMark", {
                  message: x.code,
                });
              } else if (x.field == "LandmarkMr") {
                setError("landMarkMr", {
                  message: x.code,
                });
              } else if (x.field == "zone") {
                setError("zone", {
                  message: x.code,
                });
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
            getAllLocality();
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

  // // Delete By ID
  // const deleteById = async (value) => {
  //   await axios
  //     .delete(`${urls.CFCURL}/master/locality/save/${value}`)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         message.success("Record Deleted !!!");
  //         setFetchData(true);
  //         setButtonInputState(false);
  //       }
  //     });
  // };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/locality/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getAllLocality();
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
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/locality/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });

                getAllLocality();
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
      ...resetValuesExit,
    });
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
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    localityPrefix: "",
    landmark: "",
    toDate: null,
    fromDate: null,
    landmarkMr: "",
    zoneName: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    localityPrefix: "",
    landmark: "",
    toDate: null,
    fromDate: null,
    landmarkMr: "",
    zoneName: "",
    remark: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      headerAlign: "center",
      flex: 0.3,
    },

    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      headerAlign: "center",
      flex: 0.3,
    },

    {
      field: "landmark",
      headerName: <FormattedLabel id="landMark" />,
      headerAlign: "center",
      flex: 0.5,
    },

    {
      field: "landmarkMr",
      headerName: <FormattedLabel id="landMarkMr" />,
      headerAlign: "center",
      flex: 0.5,
    },

    {
      field: "localityPrefix",
      headerName: <FormattedLabel id="localityPrefix" />,
      headerAlign: "center",
      flex: 0.5,
    },
    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      headerAlign: "center",
      flex: 0.3,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      flex: 0.3,
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
                  setValue("fromDate", params.row._fromDate);
                  setValue("toDate", params.row._toDate);
                  setValue("landMark", params.row.landmark);
                  setValue("landMarkMr", params.row.landmarkMr);
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

  // Row

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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "39%" }}>
            <FormattedLabel id="locality" />
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
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
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>

      <Paper>
        {load ? (
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
                <Paper
                  sx={{
                    backgroundColor: "#F5F5F5",
                  }}
                  elevation={5}
                >
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {/* <FormControl error={!!errors.fromDate} sx={{ width: "80%" }}>
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" />}</span>}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    error={errors?.fromDate ? true : false}
                                    sx={{ width: "100%", backgroundColor: "white" }}
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
                        <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                      </FormControl> */}
                          <FormControl sx={{ width: "90%" }}>
                            <Controller
                              control={control}
                              name="fromDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {<FormattedLabel id="fromDate" />}
                                      </span>
                                    }
                                    inputFormat="DD/MM/YYYY"
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
                                        sx={{
                                          backgroundColor: "white",
                                        }}
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
                          lg={4}
                          xl={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {/* <FormControl sx={{ width: "80%" }}>
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                inputFormat="yyyy/MM/dd"
                                // inputFormat="DD/MM/YYYY"
                                label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" />}</span>}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "100%", backgroundColor: "white" }}
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
                          {/* <Typography>{<FormattedLabel id="toDate" />}</Typography> */}
                          <FormControl sx={{ width: "90%" }}>
                            <Controller
                              control={control}
                              name="toDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {<FormattedLabel id="toDate" />}
                                      </span>
                                    }
                                    inputFormat="DD/MM/YYYY"
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
                                        sx={{
                                          backgroundColor: "white",
                                        }}
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
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {" "}
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"landMark"}
                              labelName={"landMark"}
                              fieldName={"landMark"}
                              updateFieldName={"landMarkMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={<FormattedLabel id="landMark" required />}
                              error={!!errors.landMark}
                              helperText={
                                errors?.landMark
                                  ? errors.landMark.message
                                  : null
                              }
                            />
                          </Box>
                          {/* <TextField
                        size="small"
                        sx={{ width: "90%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="landMark" />}
                        variant="outlined"
                        {...register("landmark")}
                        error={!!errors.landmark}
                        helperText={
                          errors?.landmark ? errors.landmark.message : null
                        }
                      /> */}
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {" "}
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"landMarkMr"}
                              labelName={"landMarkMr"}
                              fieldName={"landMarkMr"}
                              updateFieldName={"landMark"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              label={
                                <FormattedLabel id="landMarkMr" required />
                              }
                              error={!!errors.landMarkMr}
                              helperText={
                                errors?.landMarkMr
                                  ? errors.landMarkMr.message
                                  : null
                              }
                            />
                          </Box>
                          {/* <TextField
                        size="small"
                        sx={{ width: "90%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="landMarkMr" />}
                        variant="outlined"
                        {...register("landmarkMr")}
                        error={!!errors.landmarkMr}
                        helperText={
                          errors?.landmarkMr ? errors.landmarkMr.message : null
                        }
                      /> */}
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            size="small"
                            sx={{ width: "90%", backgroundColor: "white" }}
                            id="outlined-basic"
                            label={<FormattedLabel id="localityPrefix" />}
                            variant="outlined"
                            {...register("localityPrefix")}
                            error={!!errors.localityPrefix}
                            helperText={
                              errors?.localityPrefix
                                ? errors.localityPrefix.message
                                : null
                            }
                            InputLabelProps={{
                              shrink: watch("localityPrefix") ? true : false,
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            error={!!errors.zone}
                            sx={{ width: "90%" }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {<FormattedLabel id="zoneName" />}
                            </InputLabel>
                            <Controller
                              sx={{ backgroundColor: "white" }}
                              render={({ field }) => (
                                <Select
                                  size="small"
                                  sx={{ backgroundColor: "white" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="zoneName" />}
                                >
                                  {zones &&
                                    zones?.map((zone, index) => (
                                      <MenuItem key={index} value={zone.id}>
                                        {zone.zoneName}
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
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            multiline
                            rows={4}
                            size="small"
                            sx={{ width: "90%", backgroundColor: "white" }}
                            id="outlined-basic"
                            label={<FormattedLabel id="remark" />}
                            variant="outlined"
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                            InputLabelProps={{
                              shrink: watch("remark") ? true : false,
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}></Grid>
                      </Grid>
                      <Grid
                        container
                        className={styles.feildres}
                        sx={{ padding: "10px" }}
                      >
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
                            variant="outlined"
                            color="primary"
                            className={styles.button}
                            endIcon={<ClearIcon />}
                            onClick={() => {
                              reset({
                                ...resetValuesExit,
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
                            className={styles.button}
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </FormProvider>
                </Paper>
              </Slide>
            )}
          </>
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
            autoHeight={true}
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
              getAllLocality(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllLocality(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

//

export default Locality;
