import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Box,
  Button,
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
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[subCastMaster].module.css";
import schema from "../../../containers/schema/common/SubCastMaster";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import Transliteration from "../../../components/common/linguosol/transliteration";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const SubCastMaster = () => {
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

  const [loading, setLoading] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const underline = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
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
  // state for name
  const [religions, setReligions] = useState([]);

  const getReligions = () => {
    axios
      .get(`${urls.BaseURL}/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getReligions();
  }, []);

  // state for name
  const [casts, setCasts] = useState([]);

  const getCasts = () => {
    axios
      .get(`${urls.BaseURL}/cast/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setCasts(
          r.data.mcast.map((row) => ({
            id: row.id,
            cast: row.cast,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getCasts();
  }, []);

  // Get Table - Data
  const getSubCast = async (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    await axios
      .get(`${urls.BaseURL}/subCast/getAll`, {
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
      // await axios
      //   .get(`http://192.168.68.148:8090/cfc/api/master/subCast/getAll`)
      .then((res) => {
        console.log("sub cast res", res);
        setDataSource(
          res.data.subCast.map((r, i) => ({
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            subCastPrefix: r.subCastPrefix,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
            _fromDate: r?.fromDate,
            _toDate: r?.toDate,
            religion: r.religion,
            subCast: r.subCast,
            subCastMr: r.subCastMr,
            remark: r.remark,
            activeFlag: r.activeFlag,
            religionName: religions?.find((obj) => obj?.id === r.religion)
              ?.religion,
            cast: r.cast,
            castCol: casts?.find((obj) => obj?.id == r.cast)?.cast,
          }))
        );
        setLoading(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getSubCast();
  }, [casts, religions]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    // const toDate = new Date(fromData.toDate).toISOString();
    const fromDate = moment(fromData.fromDate, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.BaseURL}/subCast/saveSubCast`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            if (res.data?.errors?.length > 0) {
              res.data?.errors?.map((x) => {
                if (x.field == "subCast") {
                  setError("subCast", {
                    message: x.code,
                  });
                } else if (x.field == "subCastMr") {
                  setError("subCastMr", {
                    message: x.code,
                  });
                }
              });
            } else {
              sweetAlert("Saved!", "Record Saved successfully !", "success");
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
            }
          }
          getSubCast();
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios
        .post(`${urls.BaseURL}/subCast/saveSubCast`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
          }
          getSubCast();
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios
  //       .delete(`${urls.BaseURL}/subCast/saveSubCast/${value}`)
  //       .then((res) => {
  //         if (res.status == 200) {
  //           if (willDelete) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //           } else {
  //             swal("Record is Safe");
  //           }
  //         }
  //         setButtonInputState(false);
  //         getSubCast();
  //       });
  //   });
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
            .post(`${urls.CFCURL}/master/subCast/saveSubCast`, body, {
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
                setButtonInputState(false);
                getSubCast();
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
            .post(`${urls.CFCURL}/master/subCast/saveSubCast`, body, {
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
                setButtonInputState(false);
                getSubCast();
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
    subCastPrefix: "",
    fromDate: null,
    toDate: null,
    religion: "",
    cast: "",
    subCast: "",
    remark: "",
    subCastMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    subCastPrefix: "",
    fromDate: null,
    toDate: null,
    religion: "",
    cast: "",
    subCast: "",
    id: null,
    subCastMr: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerAlign: "center",
      flex: 0.4,
      headerName: <FormattedLabel id="srNo" />,
    },
    {
      field: "fromDate",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
    },

    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      align: "center",
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "religionName",
      headerName: <FormattedLabel id="religion" />,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "castCol",
      headerName: <FormattedLabel id="caste" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "subCast",
      headerName: <FormattedLabel id="subCaste" />,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "subCastMr",
      headerName: <FormattedLabel id="subCasteMr" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "subCastPrefix",
      headerName: <FormattedLabel id="subCastPrefix" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
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
                setValue("fromDate", params.row._fromDate);
                setValue("toDate", params.row._toDate);
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

  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          display: "flex",
          justifyContent: "center",
          color: "white",
          fontSize: 19,
          padding: "10px",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="subCastMaster" />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
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
                        }}
                      >
                        <FormControl
                          sx={{ width: "90%", backgroundColor: "white" }}
                          error={!!errors.fromDate}
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
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
                                      error={!!errors.fromDate}
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
                            {errors?.fromDate ? errors.fromDate.message : null}
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
                        }}
                      >
                        <FormControl
                          sx={{ width: "90%", backgroundColor: "white" }}
                          error={!!errors.toDate}
                        >
                          <Controller
                            control={control}
                            name="toDate"
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
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      error={!!errors.toDate}
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
                            {errors?.toDate ? errors.toDate.message : null}
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
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          error={!!errors.religion}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="religion" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="religion" />}
                              >
                                {religions &&
                                  religions.map((religion, index) => (
                                    <MenuItem key={index} value={religion.id}>
                                      {religion.religion}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="religion"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.religion ? errors.religion.message : null}
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
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          error={!!errors.cast}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="caste" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="caste" />}
                              >
                                {casts &&
                                  casts.map((cast, index) => (
                                    <MenuItem key={index} value={cast.id}>
                                      {cast.cast}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cast"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cast ? errors.cast.message : null}
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
                        }}
                      >
                        <Box sx={{ width: "90%" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"subCast"}
                            labelName={"subCast"}
                            fieldName={"subCast"}
                            updateFieldName={"subCastMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={<FormattedLabel id="subCaste" required />}
                            error={!!errors.subCast}
                            helperText={
                              errors?.subCast ? errors.subCast.message : null
                            }
                          />
                        </Box>
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
                        }}
                      >
                        <Box sx={{ width: "90%" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"subCastMr"}
                            labelName={"subCastMr"}
                            fieldName={"subCastMr"}
                            updateFieldName={"subCast"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={<FormattedLabel id="subCasteMr" required />}
                            error={!!errors.subCastMr}
                            helperText={
                              errors?.subCastMr
                                ? errors.subCastMr.message
                                : null
                            }
                          />
                        </Box>
                        {/* <TextField
                        sx={{ width: "90%" }}
                        id="outlined-basic"
                        size="small"
                        label={<FormattedLabel id="subCasteMr" />}
                        variant="outlined"
                        {...register("subCastMr")}
                        error={!!errors.subCastMr}
                        helperText={
                          errors?.subCastMr ? errors.subCastMr.message : null
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
                        }}
                      >
                        <TextField
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="subCastPrefix" />}
                          variant="outlined"
                          {...register("subCastPrefix")}
                          error={!!errors.subCastPrefix}
                          helperText={
                            errors?.subCastPrefix
                              ? errors.subCastPrefix.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("subCastPrefix") ? true : false,
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
                        }}
                      >
                        <TextField
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
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
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        sx={{
                          display: "flex",
                          justifyContent: "end",
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          size="small"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == "Save"
                            ? underline == "en"
                              ? "Save"
                              : "जतन करा"
                            : ""}
                          {btnSaveText == "Update"
                            ? underline == "en"
                              ? "Update"
                              : "अपडेट करा"
                            : ""}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
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
                  </form>
                </FormProvider>
              </div>
            </Slide>
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
          </div>
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            autoHeight
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                backgroundColor: "#D3D3D3",
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
            rows={dataSource}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            //checkboxSelection
          />
        </Box>
      )}
    </>
  );
};

export default SubCastMaster;
