import {
  Box,
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
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../containers/schema/common/UsageType";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/[usageType].module.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { GridToolbar } from "@mui/x-data-grid";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import Loader from "../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const UsageType = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [id, setID] = useState();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  let abc = [];
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

  useEffect(() => {
    console.log("ddslfdsfl", departments);
    getUsageType();
  }, [departments]);

  useEffect(() => {
    getDepartment();
  }, []);

  const getUsageType = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/usageType/getAll`, {
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
        setLoading(false);
        console.log(";res", res);

        let result = res.data;
        let _res = result?.usageType.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1 + _pageNo * _pageSize,
            usagePrefix: val.usagePrefix,
            department: val.department,
            departmentName: departments?.find((obj) => {
              return obj?.id === val.department;
            })?.department,
            usageType: val.usageType,
            id: val.id,
            _fromDate: val.fromDate,
            _toDate: val.toDate,
            fromDate: moment(val.fromDate).format("DD/MM/YYYY"),
            toDate: moment(val.toDate).format("DD/MM/YYYY"),
            remark: val.remark,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
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

  const getDepartment = () => {
    axios
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
      })
      ?.catch((err) => {
        console.log("err", err);
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
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/usageType/save`, body, {
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
                getUsageType();
                // getDepartment();
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
            .post(`${urls.CFCURL}/master/usageType/save`, body, {
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
                getUsageType();
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

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    usagePrefix: "",
    usageType: "",
    department: null,
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
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);
    axios
      .post(`${urls.CFCURL}/master/usageType/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "usageType") {
                setError("usageType", { message: x.code });
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
            getUsageType();
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
    department: null,
    usagePrefix: "",
    fromDate: null,
    toDate: null,
    usageType: "",
    remark: "",
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
      field: "usageType",
      headerName: <FormattedLabel id="usageType" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "usagePrefix",
      headerName: <FormattedLabel id="usagePrefix" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 0.6,
      headerAlign: "center",
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
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
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
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          padding: "10px",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="usageType" />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Paper>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
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
                      sx={{ width: "90%" }}
                      style={{ backgroundColor: "white" }}
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
                              value={field.value || null}
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
                      sx={{ width: "90%" }}
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
                    <TextField
                      sx={{ width: "90%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="Bill Type"
                      label={<FormattedLabel id="usageType" />}
                      variant="outlined"
                      {...register("usageType")}
                      error={!!errors.usageType}
                      helperText={
                        errors?.usageType ? errors.usageType.message : null
                      }
                      InputLabelProps={{
                        shrink: watch("usageType") ? true : false,
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
                      // fullWidth
                      sx={{ width: "90%" }}
                      error={!!errors.department}
                    >
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={watch("department") ? true : false}
                      >
                        <FormattedLabel id="department" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            variant="outlined"
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="department" />}
                          >
                            {departments &&
                              departments.map((department, index) => {
                                return (
                                  <MenuItem key={index} value={department.id}>
                                    {department.department}
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
                        {errors?.department ? errors.department.message : null}
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
                    <TextField
                      sx={{ width: "90%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="Remark"
                      label={<FormattedLabel id="usagePrefix" />}
                      variant="outlined"
                      {...register("usagePrefix")}
                      InputLabelProps={{
                        shrink: watch("usagePrefix") ? true : false,
                      }}
                      error={!!errors.usagePrefix}
                      helperText={
                        errors?.usagePrefix ? errors.usagePrefix.message : null
                      }
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
                      sx={{ width: "90%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="Remark"
                      label={<FormattedLabel id="remark" />}
                      variant="outlined"
                      {...register("remark")}
                      InputLabelProps={{
                        shrink: watch("remark") ? true : false,
                      }}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{
                    padding: "10px",
                  }}
                >
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
                      <FormattedLabel id={btnSaveText} />
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
                      size="small"
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
            </Slide>
          )}

          <Grid
            container
            style={{ display: "flex", justifyContent: "end", padding: "10px" }}
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

          <Box style={{ height: "auto", overflow: "auto" }}>
            <DataGrid
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => row.srNo}
              components={{ Toolbar: GridToolbar }}
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {
                  // backgroundColor:'red',
                  // height: '800px !important',
                  // display: "flex",
                  // flexDirection: "column-reverse",
                  // overflow:'auto !important'
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              autoHeight={data.pageSize}
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
                getUsageType(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getUsageType(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default UsageType;
