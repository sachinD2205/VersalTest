import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[financialYear].module.css";
import schema from "../../../containers/schema/common/FinancialYear";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { Watch } from "@mui/icons-material";
import { catchExceptionHandlingMethod } from "../../../util/util";
// func
const FinancialYear = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    setError,
    watch,
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

  const [data1, setData1] = useState({
    financialYear: "",
  });
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

  const handleChangeSelect = (e) => {
    setData1({ ...data1, [e.target.name]: e.target.value });
    console.log(e.target.value);
  };

  // Get Data By ID
  const getDataById = (value) => {
    setIsOpenCollapse(false);
    setID(value);
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll/?id=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
  // const deleteById = (value) => {
  //   swal({
  //     title: 'Delete?',
  //     text: 'Are you sure you want to delete this Record ? ',
  //     icon: 'warning',
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${urls.CFCURL}/master/financialYearMaster/save/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             getFinancialYearDetails()
  //             swal('Record is Successfully Deleted!', {
  //               icon: 'success',
  //             })
  //             setButtonInputState(false)
  //             //getcast();
  //           }
  //         })
  //     } else {
  //       swal('Record is Safe')
  //     }
  //   })
  // }

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
            .post(`${urls.CFCURL}/master/financialYearMaster/save`, body, {
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
                getFinancialYearDetails();
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
            .post(`${urls.CFCURL}/master/financialYearMaster/save`, body, {
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
                getFinancialYearDetails();
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

  // OnSubmit Form
  // const onSubmitForm = (fromData) => {

  //   const fromDate = new Date(formData.fromDate).toISOString();
  //   const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
  //   console.log('From Date ${fromDate} ')

  //   // Update Form Data
  //   const finalBodyForApi = {
  //     ...fromData,
  //     fromDate,
  //     toDate,
  //   }

  //   // Save - DB
  //   if (btnSaveText === 'Save') {
  //     console.log('Post -----')
  //     axios
  //       .post(
  //         `${urls.CFCURL}/master/MstFinancialYear/saveFinancialYear`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert('Saved!', 'Record Saved successfully !', 'success')
  //           getFinancialYearDetails()
  //           setButtonInputState(false)
  //           setEditButtonInputState(false)
  //           setDeleteButtonState(false)
  //           setIsOpenCollapse(false)
  //         }
  //       })
  //   }
  //   // Update Data Based On ID
  //   else if (btnSaveText === 'Update') {
  //     console.log('Put -----')
  //     axios
  //       .put(
  //         `${urls.CFCURL}/master/MstFinancialYear/editFinancialYear/?id=${id}`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           sweetAlert('Updated!', 'Record Updated successfully !', 'success')
  //           getFinancialYearDetails()
  //           setButtonInputState(false)
  //           setIsOpenCollapse(false)
  //         }
  //       })
  //   }
  // }

  const onSubmitForm = (formData) => {
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/financialYearMaster/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "financialYear") {
                setError("financialYear", { message: x.code });
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
            getFinancialYearDetails();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            // setEditButtonInputState(false);
            // setDeleteButtonState(false);
          }
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
    financialYear: "",
    financialYearPrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    financialYear: "",
    financialYearPrefix: "",
    remark: "",
    id: "",
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getFinancialYearDetails = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("getLIC ----");
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll`, {
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
        let result = res.data.financialYear;
        let _res = result.map((r, i) => {
          console.log("res payment mode", res);
          return {
            ...r,
            srNo: Number(_pageNo + "0") + i + 1,
            id: r.id,
            srNo: i + 1,
            financialYearPrefix: r.financialYearPrefix,
            // _toDate: moment(r.toDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            // _fromDate: moment(r.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            // toDate: r.toDate,
            // fromDate: r.fromDate,
            fromDate: r.fromDate
              ? moment(r.fromDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : "-",
            toDate: r.toDate
              ? moment(r.toDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : "-",
            _fromDate: r.fromDate,
            _toDate: r.toDate,
            financialYear: r.financialYear,
            remark: r.remark,
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
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

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getFinancialYearDetails();
  }, []);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.5,
    },
    { field: "fromDate", headerName: <FormattedLabel id="fromDate" /> },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "financialYear",
      headerName: <FormattedLabel id="financialYear" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "financialYearPrefix",
      headerName: <FormattedLabel id="financialYearPrefix" />,
      flex: 1.5,
    },
    {
      field: "isCurrentYear",
      headerName: <FormattedLabel id="isCurrentYear" />,
      flex: 1,
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.8,
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
                // setIsOpenCollapse(true),
                // // console.log('params.row: ', params.row)
                // reset(params.row)
                // setLoiGeneration(params.row.loiGeneration)
                // setScrutinyProcess(params.row.scrutinyProcess)
                // setImmediateAtCounter(params.row.immediateAtCounter)
                // setRtsSelection(params.row.rtsSelection)
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
          padding: "10px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FormattedLabel id="financialYear" />
      </div>
      <Paper>
        {isOpenCollapse && (
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
                    <TextField
                      sx={{ width: "90%" }}
                      id="outlined-basic"
                      size="small"
                      label={<FormattedLabel id="financialYearPrefix" />}
                      variant="outlined"
                      {...register("financialYearPrefix")}
                      error={!!errors.financialYearPrefix}
                      helperText={
                        errors?.financialYearPrefix
                          ? errors.financialYearPrefix.message
                          : null
                      }
                      InputLabelProps={{
                        shrink: watch("financialYearPrefix") ? true : false,
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
                    <FormControl
                      sx={{ width: "90%" }}
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
                                  {" "}
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
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl sx={{ width: "90%" }} error={!!errors.toDate}>
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
                                  error={!!errors.toDate}
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
                      id="outlined-basic"
                      label={<FormattedLabel id="financialYear" />}
                      sx={{ width: "90%" }}
                      size="small"
                      variant="outlined"
                      {...register("financialYear")}
                      error={!!errors.financialYear}
                      helperText={
                        errors?.financialYear
                          ? errors.financialYear.message
                          : null
                      }
                      InputLabelProps={{
                        shrink: watch("financialYear") ? true : false,
                      }}
                    />
                    {/* <FormControl
                      variant="outlined"
                      sx={{ width: "90%" }}
                      size="small"
                      error={!!errors.financialYear}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="financialYear" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="financialYear" />}
                          >
                            <MenuItem value={"2019-20"}>2019-20</MenuItem>
                            <MenuItem value={"2020-21"}>2020-21</MenuItem>
                            <MenuItem value={"2021-22"}>2021-22</MenuItem>
                            <MenuItem value={"2022-23"}>2022-23</MenuItem>
                          </Select>
                        )}
                        name="financialYear"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.financialYear
                          ? errors.financialYear.message
                          : null}
                      </FormHelperText>
                    </FormControl> */}
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
                      id="outlined-basic"
                      label={<FormattedLabel id="remark" />}
                      sx={{ width: "90%" }}
                      size="small"
                      variant="outlined"
                      // value={dataInForm && dataInForm.remark}
                      {...register("remark")}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                      InputLabelProps={{
                        shrink: watch("remark") ? true : false,
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
                    <FormControlLabel
                      control={
                        //  @ts-ignore
                        <Controller
                          name="isCurrentYear"
                          control={control}
                          defaultValue={false}
                          render={({ field: props }) => (
                            <Checkbox
                              {...props}
                              checked={props.value}
                              onChange={(e) => props.onChange(e.target.checked)}
                            />
                          )}
                        />
                      }
                      label={<FormattedLabel id="isCurrentYear" />}
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: "flex", justifyContent: "end" }}
                  >
                    <Button
                      size="small"
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      <FormattedLabel id={btnSaveText} />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: "flex", justifyContent: "center" }}
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
                  <Grid item xs={4} sx={{}}>
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
            <FormattedLabel id="add" />
          </Button>
        </div>

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
              getFinancialYearDetails(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getFinancialYearDetails(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default FinancialYear;

// export default index
