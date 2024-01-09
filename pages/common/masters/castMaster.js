import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
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
import urls from "../../../URLS/urls";
import schema from "../../../containers/schema/common/CastMaster";
import styles from "../../../styles/[castMaster].module.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../../../components/common/linguosol/transliteration";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const CastMaster = () => {
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
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const token = useSelector((state) => state.user.user.token);

  // state for name
  const [religions, setReligions] = useState([]);
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

  const getReligions = () => {
    axios
      .get(`${urls.BaseURL}/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // religionMaster/getReligionMasterData
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
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getReligions();
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getcast = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.BaseURL}/cast/getAll`, {
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
        let result = res.data.mCast;
        let _res = result.map((r, i) => {
          console.log("44");
          return {
            id: r.id,
            srNo: i + 1,
            castPrefix: r.castPrefix,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            _toDate: r.toDate,
            _fromDate: r.fromDate,
            religion: r.religion,
            religionName: religions?.find((obj) => obj?.id === r.religion)
              ?.religion,
            cast: r.cast,
            remark: r.remark,
            castMr: r.castMr,
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
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getcast();
  }, [religions]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // const fromDate = new Date(fromData.fromDate).toISOString();
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

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.BaseURL}/cast/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            if (res.data?.errors?.length > 0) {
              res.data?.errors?.map((x) => {
                if (x.field == "Cast") {
                  setError("cast", {
                    message: x.code,
                  });
                } else if (x.field == "CastMr") {
                  setError("castMr", {
                    message: x.code,
                  });
                }
              });
            } else {
              sweetAlert("Saved!", "Record Saved successfully !", "success");
              getcast();
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
            }
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios
        .post(`${urls.BaseURL}/cast/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            getcast();
            setButtonInputState(false);
            setIsOpenCollapse(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
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
  //     if (willDelete) {
  //       axios
  //         .delete(`${urls.BaseURL}/cast/save/${value}`)
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             getcast();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
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
            .post(`${urls.CFCURL}/master/cast/save`, body, {
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
                getcast();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
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
            .post(`${urls.CFCURL}/master/cast/save`, body, {
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
                getcast();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
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
    fromDate: null,
    toDate: null,
    religion: "",
    cast: "",
    castPrefix: "",
    remark: "",
    castMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    religion: "",
    cast: "",
    castPrefix: "",
    remark: "",
    id: null,
    castMr: "",
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
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      headerAlign: "center",
      flex: 1,
    },
    // {
    //   field: "religionName",
    //   headerName: "Religion",
    //   // type: "number",
    //   flex: 1,
    // },
    {
      field: "cast",
      headerName: <FormattedLabel id="castNameEn" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "castMr",
      headerName: <FormattedLabel id="castNameMr" />,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "castPrefix",
      headerName: <FormattedLabel id="castMasterPrefix" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      //type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
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
      <Box>
        <BreadcrumbComponent />
      </Box>
      <div
        style={{
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          padding: "10px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FormattedLabel id="castMaster" />
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
                          xs={122}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{ display: "flex", justifyContent: "center" }}
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
                          sx={{ display: "flex", justifyContent: "center" }}
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
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="outlined-basic"
                            size="small"
                            label={<FormattedLabel id="castMasterPrefix" />}
                            variant="outlined"
                            {...register("castPrefix")}
                            error={!!errors.castPrefix}
                            helperText={
                              errors?.castPrefix
                                ? errors.castPrefix.message
                                : null
                            }
                            InputLabelProps={{
                              shrink: watch("castPrefix") ? true : false,
                            }}
                          />
                        </Grid>

                        {/* <div>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.religion}
                        >
                          <InputLabel id="demo-simple-select-standard-label">Religion *</InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Religion *"
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
                          <FormHelperText>{errors?.religion ? errors.religion.message : null}</FormHelperText>
                        </FormControl>
                      </div> */}
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"cast"}
                              labelName={"cast"}
                              fieldName={"cast"}
                              updateFieldName={"castMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={
                                <FormattedLabel id="castNameEn" required />
                              }
                              error={!!errors.cast}
                              helperText={
                                errors?.cast ? errors.cast.message : null
                              }
                            />
                          </Box>
                          {/* <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="castNameEn" />}
                          variant="outlined"
                          {...register("cast")}
                          error={!!errors.cast}
                          helperText={errors?.cast ? errors.cast.message : null}
                        /> */}
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"castMr"}
                              labelName={"castMr"}
                              fieldName={"castMr"}
                              updateFieldName={"cast"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              label={
                                <FormattedLabel id="castNameMr" required />
                              }
                              error={!!errors.castMr}
                              helperText={
                                errors?.castMr ? errors.castMr.message : null
                              }
                            />
                          </Box>
                          {/* <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="castNameMr" />}
                          variant="outlined"
                          {...register("castMr")}
                          error={!!errors.castMr}
                          helperText={
                            errors?.castMr ? errors.castMr.message : null
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
                          sx={{ display: "flex", justifyContent: "center" }}
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
                            {btnSaveText}
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
                        <Grid item xs={4} sx={{ display: "flex" }}>
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
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}
          <Box sx={{ padding: "10px", display: "flex", justifyContent: "end" }}>
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
          </Box>
          {/* <DataGrid
            autoHeight
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            //checkboxSelection
          /> */}

          <Box style={{ height: "auto", overflow: "auto" }}>
            <DataGrid
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              components={{ Toolbar: GridToolbar }}
              sx={{
                // fontSize: 16,
                // fontFamily: 'Montserrat',
                // font: 'center',
                // backgroundColor:'yellow',
                // // height:'auto',
                // border: 2,
                // borderColor: "primary.light",
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
                getcast(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getcast(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default CastMaster;
