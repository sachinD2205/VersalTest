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
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  Slide,
  TextField,
  Grid,
  Breadcrumbs,
  Typography,
  Box,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls.js";
import styles from "../../../styles/[businessCategory].module.css";
import schema from "../../../containers/schema/common/BusinessCategory";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import Loader from "../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../util/util";

const BusinessCategory = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [subBusinessTypes, setSubBusinessTypes] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [loading, setLoading] = useState(false);
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
  // useEffect(() => {
  //   getSubBusinessTypes();
  // }, []);

  useEffect(() => {
    getBusinessCategory();
  }, []);

  // Get Table - Data
  const getBusinessCategory = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/businessCategory/getAll`, {
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
        let _res = res.data.businessCategory.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          businessCategoryPrefix: r.businessCategoryPrefix,
          toDate: moment(r.toDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
          _toDate: r.toDate,
          _fromDate: r.fromDate,
          businessName: r.businessName,
          // subBusinessType: r.subBusinessType ? r.subBusinessType : "-",
          // subBusinessTypeName: subBusinessTypes?.find(
          //   (obj) => obj?.id === r.subBusinessType
          // )?.subBusinessType,
          remark: r.remark,
          activeFlag: r.activeFlag,
          status: r.activeFlag === "Y" ? "Active" : "Inactive",
        }));
        setDataSource({
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
    setLoading(true);
    const fromDate = moment(formData.fromDate, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/businessCategory/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "businessCategoryPrefix") {
                setError("businessCategoryPrefix", {
                  message: x.code,
                });
              }
            });
          } else {
            formData.id
              ? sweetAlert(
                  language == "en" ? "Updated!" : "अपडेट केले!",
                  language == "en"
                    ? "Record Updated successfully!"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  "success"
                )
              : sweetAlert(
                  language == "en" ? "Saved!" : "जतन केले!",
                  language == "en"
                    ? "Record Saved successfully!"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            getBusinessCategory();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const deleteById = (value, _activeFlag) => {
    setLoading(true);
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
          setLoading(false);
          axios
            .post(`${urls.CFCURL}/master/businessCategory/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBusinessCategory();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          setLoading(false);
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
          setLoading(false);
          axios
            .post(`${urls.CFCURL}/master/businessCategory/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBusinessCategory();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setLoading(false);
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
    fromDate: null,
    toDate: null,
    businessName: "",
    subBusinessType: null,
    businessCategoryPrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessName: "",
    subBusinessType: null,
    businessCategoryPrefix: "",
    remark: "",
    id: null,
  };

  // define colums table
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
      field: "businessName",
      headerName: <FormattedLabel id="businessName" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "businessCategoryPrefix",
      headerName: <FormattedLabel id="businessCategoryPrefix" />,
      flex: 1.5,
      headerAlign: "center",
    },

    // {
    //   field: "subBusinessType",
    //   headerName: "Sub Business Type",
    //   // type: "number",
    //   flex: 1,
    // },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.5,
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
      {" "}
      <Box>
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
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
        <FormattedLabel id="businessCategory" />
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
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className={styles.small}>
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
                          <FormControl
                            style={{ width: "90%" }}
                            fullWidth
                            error={!!errors.fromDate}
                            required
                          >
                            <Controller
                              control={control}
                              name="fromDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
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
                              {errors?.fromDate
                                ? errors.fromDate.message
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
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            style={{ width: "90%" }}
                            fullWidth
                            error={!!errors.toDate}
                            required
                          >
                            <Controller
                              control={control}
                              name="toDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
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
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="outlined-basic"
                            size="small"
                            label={<FormattedLabel id="businessName" />}
                            variant="outlined"
                            {...register("businessName")}
                            error={!!errors.businessName}
                            helperText={
                              errors?.businessName
                                ? errors.businessName.message
                                : null
                            }
                            InputLabelProps={{
                              shrink: watch("businessName") ? true : false,
                            }}
                          />
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
                            sx={{ width: "90%" }}
                            id="outlined-basic"
                            size="small"
                            label={
                              <FormattedLabel id="businessCategoryPrefix" />
                            }
                            variant="outlined"
                            {...register("businessCategoryPrefix")}
                            error={!!errors.businessCategoryPrefix}
                            helperText={
                              errors?.businessCategoryPrefix
                                ? errors.businessCategoryPrefix.message
                                : null
                            }
                            InputLabelProps={{
                              shrink: watch("businessCategoryPrefix")
                                ? true
                                : false,
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
                          <TextField
                            sx={{ width: "90%" }}
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

                      <div className={styles.row}>
                        {/* <div>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.subBusinessType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Sub Business Type
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Sub Business Type"
                                >
                                  {subBusinessTypes &&
                                    subBusinessTypes.map(
                                      (subBusinessType, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={subBusinessType.id}
                                          >
                                            {subBusinessType.businessSubType}
                                          </MenuItem>
                                        );
                                      }
                                    )}
                                </Select>
                              )}
                              name="subBusinessType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.subBusinessType
                                ? errors.subBusinessType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}
                      </div>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {<FormattedLabel id={btnSaveText} />}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
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
                          sx={{ display: "flex", justifyContent: "center" }}
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
                    </div>
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
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            components={{ Toolbar: GridToolbar }}
            autoHeight={dataSource.pageSize}
            sx={{
              "& .super-app-theme--cell": {
                // backgroundColor: "#BBD5F1",
                // border: "1px solid #556CD6",
                // color: "white",
                // border: "1px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#BBD5F1",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-column": {
                backgroundColor: "red",
              },
            }}
            rows={dataSource.rows}
            columns={columns}
            page={dataSource.page}
            pageSize={dataSource.pageSize}
            onPageChange={(_data) => {
              getBusinessCategory(dataSource.pageSize, _data);
            }}
            onPageSizeChange={(newPageSize) => {
              getBusinessCategory(newPageSize, dataSource.page);
            }}
            rowsPerPageOptions={dataSource.rowsPerPageOptions}
            pagination
            paginationMode="server"
            density="compact"
            rowCount={dataSource.totalRows}
            //checkboxSelection
          />
        </Paper>
      )}
    </>
  );
};

export default BusinessCategory;
