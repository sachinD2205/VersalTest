import {
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
  Tooltip,
  Box,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../containers/schema/common/Ward";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import styles from "../../../styles/[ward].module.css";
import urls from "../../../URLS/urls";
import Loader from "../../../containers/Layout/components/Loader";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import Transliteration from "../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
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

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();

  useEffect(() => {
    getWard();
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [loading, setLoading] = useState(false);
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

  const getWard = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
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
      .then((res, i) => {
        let result = res.data.ward;
        console.log("res payment mode", result);
        let _res = result.map((res, i) => {
          return {
            activeFlag: res.activeFlag,
            gisId: res.gisId ? res.gisId : "-",
            srNo: Number(_pageNo + "0") + i + 1,
            id: res.id,
            _fromDate: res.fromDate,
            _toDate: res.toDate,
            fromDate: moment(res.fromDate).format("DD/MM/YYYY"),
            toDate: moment(res.toDate).format("DD/MM/YYYY"),
            wardPrefix: res.wardPrefix ? res.wardPrefix : "-",
            wardPrefixMr: res.wardPrefixMr ? res.wardPrefixMr : "-",
            status: res.status,
            wardNo: res.wardNo,
            wardNoMr: res.wardNoMr,
            wardName: res.wardName ? res.wardName : "-",
            wardNameMr: res.wardNameMr ? res.wardNameMr : "-",
            wardAddress: res.wardAddress,
            wardaddressMr: res.wardaddressMr,
            latitude: res.latitude ? res.latitude : "-",
            longitude: res.longitude ? res.longitude : "-",
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });

        setLoading(false);

        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
        // setTotalElements(res.data.totalElements);
        // setPageSize(res.data.pageSize);
        // setPageNo(res.data.pageNo);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Deactivate?",
  //       text: "Are you sure you want to deactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/ward/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully Deactivated!", {
  //               icon: "success",
  //             });
  //             getWard();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/ward/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });
  //             getWard();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Inactivate?",
  //       text: "Are you sure you want to inactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios
  //           .post(`${urls.CFCURL}/master/ward/save`, body)

  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               swal("Record is Successfully Inactivated!", {
  //                 icon: "success",
  //               });
  //               getWard();
  //               setButtonInputState(false);
  //             }
  //           });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/ward/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });
  //             getWard();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };

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
            .post(`${urls.CFCURL}/master/ward/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getWard();
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
            .post(`${urls.CFCURL}/master/ward/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getWard();
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
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/ward/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "wardName") {
                setError("wardName", { message: x.code });
              } else if (x.field == "wardNameMr") {
                setError("wardNameMr", { message: x.code });
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
            getWard();
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

  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    gisId: "",
    wardPrefix: "",
    wardPrefixMr: "",
    wardNo: "",
    wardNoMr: "",
    wardName: "",
    wardNameMr: "",
    wardAddress: "",
    wardaddressMr: "",
    longitude: "",
    latitude: "",
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
    gisId: "",
    wardPrefix: "",
    wardPrefixMr: "",
    wardNo: "",
    wardNoMr: "",
    wardName: "",
    wardNameMr: "",
    wardAddress: "",
    wardaddressMr: "",
    longitude: "",
    latitude: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,

      headerAlign: "center",
      flex: 1,
    },
    {
      field: "wardName",
      headerName: <FormattedLabel id="wardName" />,

      headerAlign: "center",
      flex: 1,
    },
    {
      field: "wardNameMr",
      headerName: <FormattedLabel id="wardNameMr" />,

      headerAlign: "center",
      flex: 1,
    },

    {
      field: "gisId",
      headerName: <FormattedLabel id="gisId" />,

      headerAlign: "center",
      flex: 1,
    },
    {
      field: "latitude",
      headerName: <FormattedLabel id="latitude" />,

      headerAlign: "center",
      flex: 1,
    },
    {
      field: "longitude",
      headerName: <FormattedLabel id="longitude" />,

      headerAlign: "center",
      flex: 1,
    },
    // {
    //   field: "wardPrefix",
    //   headerName: <FormattedLabel id="wardPrefix" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 100,
    // },
    // {
    //   field: "wardNo",
    //   headerName: <FormattedLabel id="wardNo" />,
    //   flex: 1,
    //   minWidth: 100,
    // },

    // {
    //   field: "wardAddress",
    //   headerName: <FormattedLabel id="wardAddress" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 130,
    // },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.8,
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
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
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

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <div
        style={{
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          padding: "10px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormattedLabel id="ward" />
      </div>
      <Paper>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{
                          backgroundColor: "white",
                          width: "90%",
                        }}
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
                                    {<FormattedLabel id="fromDate" />}
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
                                    error={!!errors.fromDate}
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white", width: "90%" }}
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
                                    {<FormattedLabel id="toDate" />}
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"wardName"}
                          labelName={"wardName"}
                          fieldName={"wardName"}
                          updateFieldName={"wardNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="wardName" required />}
                          error={!!errors.wardName}
                          helperText={
                            errors?.wardName ? errors.wardName.message : null
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"wardNameMr"}
                          labelName={"wardNameMr"}
                          fieldName={"wardNameMr"}
                          updateFieldName={"wardName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="wardNameMr" required />}
                          error={!!errors.wardNameMr}
                          helperText={
                            errors?.wardNameMr
                              ? errors.wardNameMr.message
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
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white", width: "90%" }}
                        id="outlined-basic"
                        // label="CFC ID"
                        label={<FormattedLabel id="gisId" />}
                        variant="outlined"
                        {...register("gisId")}
                        error={!!errors.gisId}
                        helperText={errors?.gisId ? errors.gisId.message : null}
                        InputLabelProps={{
                          shrink: watch("gisId") ? true : false,
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white", width: "90%" }}
                        id="outlined-basic"
                        // label="CFC ID"
                        label={<FormattedLabel id="latitude" />}
                        variant="outlined"
                        {...register("latitude")}
                        error={!!errors.latitude}
                        helperText={
                          errors?.latitude ? errors.latitude.message : null
                        }
                        InputLabelProps={{
                          shrink: watch("latitude") ? true : false,
                        }}
                      />
                    </Grid>

                    {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="wardPrefix" />}
                    // label="CFC Name"
                    variant="standard"
                    {...register("wardPrefix")}
                    error={!!errors.wardPrefix}
                    helperText={
                      errors?.wardPrefix ? errors.wardPrefix.message : null
                    }
                  />
                </Grid> */}

                    {/* <Grid container style={{ padding: "10px" }}> */}
                    {/* <Grid
                  item
                  xs={4}
                  // sx={{ }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="wardNo" />}
                    // label="Recharge Amount"
                    variant="standard"
                    {...register("wardNo")}
                    error={!!errors.wardNo}
                    helperText={errors?.wardNo ? errors.wardNo.message : null}
                  />
                </Grid> */}
                    {/* <Grid
                    item
                    xs={4}
                    // sx={{ }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="wardAddress" />}
                      // label="Recharge Amount"
                      variant="standard"
                      {...register("wardAddress")}
                      error={!!errors.wardAddress}
                      helperText={
                        errors?.wardAddress ? errors.wardAddress.message : null
                      }
                    />
                  </Grid> */}
                    {/* </Grid> */}
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white", width: "90%" }}
                        id="outlined-basic"
                        // label="CFC ID"
                        label={<FormattedLabel id="longitude" />}
                        variant="outlined"
                        {...register("longitude")}
                        error={!!errors.longitude}
                        helperText={
                          errors?.longitude ? errors.longitude.message : null
                        }
                        InputLabelProps={{
                          shrink: watch("longitude") ? true : false,
                        }}
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
                        variant="outlined"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {<FormattedLabel id={btnSaveText} />}
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
                        variant="outlined"
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
                        variant="outlined"
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
              </FormProvider>
            </div>
          </Slide>
        )}

        <Grid
          container
          style={{ padding: "10px", display: "flex", justifyContent: "end" }}
        >
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            size="small"
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
            <FormattedLabel id="add" />{" "}
          </Button>
        </Grid>
        {loading ? (
          <Loader />
        ) : (
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
              autoHeight={data.pageSize}
              density="compact"
              sx={{
                "& .super-app-theme--cell": {
                  backgroundColor: "#87E9F7",
                  border: "1px solid white",
                },
                backgroundColor: "white",
                boxShadow: 2,
                border: 1,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {
                  transform: "scale(1.1)",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#E1FDFF",
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
                getWard(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getWard(_data, data.page);
              }}
            />
          </Box>
        )}

        {/* <DataGrid
          autoHeight
          sx={{
            margin: 5,
          }}
          rows={dataSource}
          // rows={abc}
          // rows={jugaad}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => {
            getWard(newPageSize);
            setPageSize(newPageSize);
          }}
          onPageChange={(e) => {
            console.log("event", e);
            getWard(pageSize, e);
            console.log("dataSource->", dataSource);
          }}
          // {...dataSource}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          rowCount={totalElements}
          //checkboxSelection
        /> */}
      </Paper>
    </>
  );
};

export default Index;
