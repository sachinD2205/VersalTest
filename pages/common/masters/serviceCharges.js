import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../URLS/urls";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";
import sweetAlert from "sweetalert";
import styles from "../../../styles/[serviceCharges].module.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { toast } from "react-toastify";
import schema from "../../../containers/schema/common/serviceCharges";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    setError,
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
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceChargeTypes, setServiceChargeTypes] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [amount, setAmount] = useState(false);
  const token = useSelector((state) => state.user.user.token);

  // let check = watch("serviceChargeType");

  const [load, setLoad] = useState();
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

  const handleLoad = () => {
    setLoad(false);
  };

  useEffect(() => {
    getApplication();
    getChargeType();
    getService();
    getServiceChargeType();
  }, []);

  useEffect(() => {
    getServiceCharges();
  }, [applications, services, serviceChargeTypes, chargeTypes]);

  const getApplication = () => {
    axios
      .get(`${urls.BaseURL}/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setApplications(
          r.data?.application?.map((row) => ({
            id: row.id,
            appCode: row.appCode,
            applicationNameEng: row.applicationNameEng,
            applicationNameMr: row.applicationNameMr,
            module: row.module,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getService = () => {
    axios
      .get(`${urls.BaseURL}/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setServices(
          r.data.service.map((row) => ({
            id: row.id,
            service: row.serviceName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getServiceChargeType = () => {
    axios
      .get(`${urls.BaseURL}/serviceChargeType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setServiceChargeTypes(
          r.data.serviceChargeType.map((row) => ({
            id: row.id,
            serviceChargeType: row.serviceChargeType,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getChargeType = () => {
    axios
      .get(`${urls.BaseURL}/chargeName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setChargeTypes(
          r.data.chargeName.map((row) => ({
            id: row.id,
            charge: row.charge,
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
  const getServiceCharges = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.BaseURL}/servicecharges/getAll`, {
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
        let result = res.data.serviceCharge;
        let _res = result.map((r, i) => {
          console.log("res payment mode", res);
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            id: r.id,
            // srNo: i + 1,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            _toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            _fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            application: r.application,
            amount: r.amount,
            service: r.service,
            serviceChargeType: r.serviceChargeType,
            charge: r.charge,
            applicationNameEng: applications.find(
              (obj) => obj?.id === r.application
            )?.applicationNameEng,
            applicationNameMr: applications.find(
              (obj) => obj?.id === r.application
            )?.applicationNameMr,
            serviceName: services.find((obj) => obj?.id === r.service)?.service,
            serviceChargeTypeName: serviceChargeTypes.find(
              (obj) => obj.id === r.serviceChargeType
            )?.serviceChargeType,
            chargeName: chargeTypes.find((obj) => obj?.id === r.charge)?.charge,
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
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const fromDate = moment(formData.fromDate, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.BaseURL}/servicecharges/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save", res);
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              toast(x?.code, {
                type: "error",
              });
              setError("charge", { message: x.code });
            });
          } else {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getServiceCharges();
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
  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios
  //       .delete(`${urls.BaseURL}/servicecharges/discard/${value}`)
  //       .then((res) => {
  //         if (res.status == 226) {
  //           if (willDelete) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //           } else {
  //             swal("Record is Safe");
  //           }
  //           getServiceCharges();
  //           setButtonInputState(false);
  //         }
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
            .post(`${urls.CFCURL}/master/servicecharges/save`, body, {
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

                getServiceCharges();
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
            .post(`${urls.CFCURL}/master/servicecharges/save`, body, {
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

                getServiceCharges();
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

  const handleChange = (value) => {
    // console.log("check", check);
    if (value === 1) {
      setAmount(true);
    } else {
      setAmount(false);
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
    fromDate: null,
    toDate: null,
    application: null,
    service: null,
    serviceChargeType: null,
    charge: null,
    amount: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    application: null,
    service: null,
    serviceChargeType: null,
    charge: null,
    id: null,
    amount: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      flex: 0.4,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "toDate",
      headerAlign: "center",
      headerName: <FormattedLabel id="toDate" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "applicationNameEng",
      headerAlign: "center",
      headerName: <FormattedLabel id="applicationName" />,
      flex: 1,
    },
    {
      field: "serviceName",
      headerAlign: "center",
      headerName: <FormattedLabel id="serviceName" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "serviceChargeTypeName",
      headerAlign: "center",
      headerName: <FormattedLabel id="serviceChargeType" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "chargeName",
      headerAlign: "center",
      headerName: <FormattedLabel id="chargeName" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "amount",
      headerAlign: "center",
      headerName: <FormattedLabel id="amount" />,
      // type: "number",
      flex: 0.4,
    },
    {
      field: "actions",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
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
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="serviceCharge" />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{ width: "90%" }}
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
                                    error={errors?.fromDate}
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{ width: "90%" }}
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
                                    error={errors?.toDate}
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                        error={!!errors.application}
                      >
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={watch("application") ? true : false}
                        >
                          <FormattedLabel id="applicationName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="applicationName" />}
                            >
                              {applications &&
                                applications.map(
                                  (applicationNameEng, index) => (
                                    <MenuItem
                                      key={index}
                                      value={applicationNameEng.id}
                                    >
                                      {applicationNameEng.applicationNameEng}
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
                      <FormControl
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                        error={!!errors.service}
                      >
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={watch("service") ? true : false}
                        >
                          <FormattedLabel id="serviceName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="serviceName" />}
                            >
                              {services &&
                                services.map((service, index) => (
                                  <MenuItem key={index} value={service.id}>
                                    {service.service}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="service"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.service ? errors.service.message : null}
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
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                        error={!!errors.serviceChargeType}
                      >
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={watch("serviceChargeType") ? true : false}
                        >
                          <FormattedLabel id="serviceChargeType" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onChange={(value) => {
                                return (
                                  field.onChange(value),
                                  handleChange(value.target.value)
                                );
                              }}
                              label={<FormattedLabel id="serviceChargeType" />}
                            >
                              {serviceChargeTypes &&
                                serviceChargeTypes.map(
                                  (serviceChargeType, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={serviceChargeType.id}
                                      >
                                        {serviceChargeType.serviceChargeType}
                                      </MenuItem>
                                    );
                                  }
                                )}
                            </Select>
                          )}
                          name="serviceChargeType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.serviceChargeType
                            ? errors.serviceChargeType.message
                            : null}
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
                        variant="outlined"
                        sx={{
                          width: "90%",
                        }}
                        size="small"
                        error={!!errors.charge}
                      >
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={watch("charge") ? true : false}
                        >
                          <FormattedLabel id="chargeName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="chargeName" />}
                            >
                              {chargeTypes &&
                                chargeTypes.map((charge, index) => (
                                  <MenuItem key={index} value={charge.id}>
                                    {charge.charge}
                                  </MenuItem>
                                ))}
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
                        sx={{ width: "90%" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="amount" />}
                        size="small"
                        variant="outlined"
                        // value={dataInForm && dataInForm.religion}
                        {...register("amount")}
                        error={!!errors.amount}
                        helperText={
                          errors?.amount ? errors.amount.message : null
                        }
                        InputLabelProps={{
                          shrink: watch("amount") ? true : false,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container sx={{ padding: "10px" }}>
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
                        variant="contained"
                        size="small"
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
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <Grid
          container
          sx={{ padding: "10px", display: "flex", justifyContent: "end" }}
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
              getServiceCharges(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getServiceCharges(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
