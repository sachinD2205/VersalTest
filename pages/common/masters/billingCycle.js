import { yupResolver } from "@hookform/resolvers/yup";
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
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
// import BasicLayout from "../../../containers/Layout/BasicLayout";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/BillingCycle";
import styles from "../../../styles/cfc/cfc.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import Loader from "../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

// func
const BillingCycle = () => {
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

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getBillingCycleDetails();
  }, []);

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  // Get Table - Data
  const getBillingCycleDetails = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("getLIC ----");
    setLoad(true);
    axios
      .get(`${urls.CFCURL}/master/billingCycleNameMaster/getAll`, {
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
        let result = res.data.billingCycleName;
        let _res = result.map((r, i) => {
          console.log("res payment mode", res);
          return {
            id: r.id,
            activeFlag: r.activeFlag,
            srNo: i + 1,
            billingCyclePrefix: r.billingCyclePrefix,
            // toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: r.fromDate,
            toDate: r.toDate,
            billingCycle: r.billingCycle,
            billingCycleMr: r.billingCycleMr,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setLoad(false);
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
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  // Get Data By ID
  const getDataById = (value) => {
    setIsOpenCollapse(false);
    setID(value);
    axios
      .get(
        `${urls.CFCURL}/master/MstBillingCycle/getbillingCycleDaoDataById/?id=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        reset(res.data);
        setButtonInputState(true);
        setIsOpenCollapse(true);
        setBtnSaveText("Update");
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
            .post(`${urls.CFCURL}/master/billingCycleNameMaster/save`, body, {
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
                getBillingCycleDetails();
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
            .post(`${urls.CFCURL}/master/billingCycleNameMaster/save`, body, {
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
                getBillingCycleDetails();
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

  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    // const toDate = new Date(fromData.toDate).toISOString();
    const toDate = moment(fromData.toDate).format("YYYY-MM-DD");
    const fromDate = moment(fromData.fromDate).format("YYYY-MM-DD");

    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      toDate,
      fromDate,
      // toDate,
      // activeFlag: btnSaveText === "Update" ? null : null,
      // activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    axios
      .post(
        `${urls.CFCURL}/master/billingCycleNameMaster/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getBillingCycleDetails();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
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
    billingCycle: "",
    billingCyclePrefix: "",
    billingCycleMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    billingCycle: "",
    billingCycleMr: "",
    billingCyclePrefix: "",

    id: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 0.6,
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "fromDate",
      flex: 2,
      headerName: <FormattedLabel id="fromDate" />,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      flex: 2,
    },
    {
      field: "billingCycle",
      headerName: <FormattedLabel id="billingCycle" />,
      flex: 2,
    },
    {
      field: "billingCycleMr",
      headerName: <FormattedLabel id="billingCycleMr" />,
      // type: "number",
      flex: 2,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      headerAlign: "center",
      align: "center",
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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "38%" }}>
            <FormattedLabel id="billingCycle" />
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

      {load ? (
        <Loader />
      ) : (
        <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Paper
                sx={{
                  marginLeft: 3,
                  marginRight: 3,
                  marginBottom: 3,
                  padding: 2,
                  backgroundColor: "#F5F5F5",
                }}
                elevation={5}
              >
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={2} className={styles.feildres}></Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "80%", marginTop: 3 }}
                          style={{ backgroundColor: "white" }}
                          error={!!errors.toDate}
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
                                  value={field.value || null}
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
                          <FormHelperText>
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "80%", marginTop: 3 }}
                          style={{ backgroundColor: "white" }}
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
                                  value={field.value || null}
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
                          <FormHelperText>
                            {errors?.toDate ? errors.toDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2} className={styles.feildres}></Grid>
                    </Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={2} className={styles.feildres}></Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          size="small"
                          sx={{ width: "80%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="billingCycle" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.billingCycle}
                          {...register("billingCycle")}
                          error={!!errors.billingCycle}
                          helperText={
                            errors?.billingCycle
                              ? errors.billingCycle.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          size="small"
                          sx={{ width: "80%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="billingCycleMr" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.billingCycle}
                          {...register("billingCycleMr")}
                          error={!!errors.billingCycleMr}
                          helperText={
                            errors?.billingCycleMr
                              ? errors.billingCycleMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={2} className={styles.feildres}></Grid>
                    </Grid>
                    <br />
                    <br />
                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        <Button
                          type="submit"
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id="Save" />
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
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
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
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
              // autoHeight={true}
              autoHeight={data.pageSize}
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
                "& .MuiDataGrid-cell:hover": {},
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
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBillingCycleDetails(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                getBillingCycleDetails(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default BillingCycle;

// export default index
