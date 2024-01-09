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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import urls from "../../../URLS/urls";
import styles from "../../../styles/view.module.css";
// import { ModeOutlined } from "@mui/icons-material";
// import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../../../components/common/linguosol/transliteration";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  let schema = yup.object().shape({
    appCode: yup.string().nullable().required("AppCode is Required !!!"),
    applicationNameEng: yup
      .string()
      .required("Application Name is Required !!"),
    applicationNameMr: yup
      .string()
      .required("Application Name (In Marathi) is Required !!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),
    module: yup.string().nullable().required("Module is Required !!"),
    // remark: yup.string().required(" Remark is Required !!"),
  });

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
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [modules, setModules] = useState([]);
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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getModuleMaster();
  }, []);

  useEffect(() => {
    getApplicationMaster();
  }, [modules]);

  const getModuleMaster = () => {
    // axios.get(`${urls.BaseURL}/module/getAll`)
    axios
      .get(`${urls.BaseURL}/packages/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        // setModules(
        //   r.data.mstModules.map((row) => ({
        //     id: row.id,
        //     // packageCode: row.packageCode,
        //     // packageNameEng: row.packageNameEng,
        //     // packageNameMr: row.packageNameMr,
        //     nameEn: row.nameEn,
        //     nameMr: row.nameMr,
        //   })),
        // );
        setModules(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // Get Table - Data
  const getApplicationMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.BaseURL}/application/getAll`, {
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
        let result = res.data.application;
        console.log("result", result);
        let _res = result.map((r, i) => {
          console.log("res payment mode", r);
          return {
            id: r.id,
            srNo: Number(_pageNo + "0") + i + 1,
            activeFlag: r.activeFlag,
            appCode: r.appCode ? r.appCode : "-",
            applicationNameEng: r.applicationNameEng
              ? r.applicationNameEng
              : "-",
            applicationNameMr: r.applicationNameMr ? r.applicationNameMr : "-",
            module: r.module ? r.module : "-",
            packageNameEng: r.module
              ? modules?.find((obj) => obj?.id === r.module)?.packageNameEng
              : "-",
            status: r.activeFlag === "Y" ? "Active" : "InActive",
          };
        });

        setLoading(false);

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
    const finalBodyForApi = {
      ...formData,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.BaseURL}/application/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "applicationNameEng") {
                setError("applicationNameEng", {
                  message:
                    x.code == "Please Enter Valid Application"
                      ? "Application Name Already Exist"
                      : "",
                });
              } else if (x.field == "applicationNameMr") {
                setError("applicationNameMr", {
                  message:
                    x.code == "Please Enter Valid Application"
                      ? "Application Name Already Exist In Marathi"
                      : "",
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
            getApplicationMaster();
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
  };

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
            .post(`${urls.CFCURL}/master/application/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getApplicationMaster();
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
            .post(`${urls.CFCURL}/master/application/save`, body, {
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
                getApplicationMaster();
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
        }
      });
    }
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
  //       text: "Are you sure you want to inactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/application/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully Inactivated!", {
  //               icon: "success",
  //             });
  //             getApplicationMaster();
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
  //         axios.post(`${urls.CFCURL}/master/application/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });

  //             setButtonInputState(false);
  //             getApplicationMaster();
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };
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
    appCode: null,
    applicationNameEng: "",
    applicationNameMr: "",
    module: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    appCode: null,
    applicationNameEng: "",
    applicationNameMr: "",
    module: null,
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.2,
      headerAlign: "center",
    },
    {
      field: "appCode",
      headerName: <FormattedLabel id="appCode" />,
      flex: 0.3,
      headerAlign: "center",
    },
    {
      field: "applicationNameEng",
      headerName: <FormattedLabel id="applicationName" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "applicationNameMr",
      headerName: <FormattedLabel id="applicationNameMr" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "packageNameEng",
      headerName: <FormattedLabel id="module" />,
      headerAlign: "center",
      flex: 0.4,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.4,
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
        <FormattedLabel id="applicationMaster" />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            padding: "10px",
          }}
        >
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
                    <div>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"applicationNameEng"}
                              labelName={"firstName"}
                              fieldName={"applicationNameEng"}
                              updateFieldName={"applicationNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={
                                <FormattedLabel id="applicationName" required />
                              }
                              error={!!errors.applicationNameEng}
                              helperText={
                                errors?.applicationNameEng
                                  ? errors.applicationNameEng.message
                                  : null
                              }
                            />
                          </Box>
                          {/* <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="applicationName" />}
                          variant="outlined"
                          {...register("applicationNameEng")}
                          error={!!errors.applicationNameEng}
                          helperText={
                            errors?.applicationNameEng
                              ? errors.applicationNameEng.message
                              : null
                          }
                        /> */}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
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
                              _key={"applicationNameMr"}
                              labelName={"firstName"}
                              fieldName={"applicationNameMr"}
                              updateFieldName={"applicationNameEng"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              label={
                                <FormattedLabel
                                  id="applicationNameMr"
                                  required
                                />
                              }
                              error={!!errors.applicationNameMr}
                              helperText={
                                errors?.applicationNameMr
                                  ? errors.applicationNameMr.message
                                  : null
                              }
                            />
                          </Box>
                          {/* <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="applicationNameMr" />}
                          size="small"
                          variant="outlined"
                          {...register("applicationNameMr")}
                          error={!!errors.applicationNameMr}
                          helperText={
                            errors?.applicationNameMr
                              ? errors.applicationNameMr.message
                              : null
                          }
                        /> */}
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            variant="outlined"
                            id="outlined-basic"
                            size="small"
                            label={<FormattedLabel id="appCode" />}
                            {...register("appCode")}
                            error={errors.appCode}
                            helperText={
                              errors?.appCode ? errors.appCode.message : null
                            }
                            InputLabelProps={{
                              shrink: watch("appCode") ? true : false,
                            }}
                          />
                        </Grid>
                        <Grid
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ width: "90%" }}
                            error={!!errors.module}
                          >
                            <InputLabel
                              id="demo-simple-select-outlined-label"
                              shrink={watch("module") ? true : false}
                            >
                              <FormattedLabel id="module" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // sx={{ width: '90%' }}
                                  value={field.value || ""}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="module" />}
                                >
                                  {modules &&
                                    modules.map((module, index) => {
                                      return (
                                        <MenuItem key={index} value={module.id}>
                                          {/* {language === "en" ? module.nameEn : module.nameMr} */}
                                          {module.packageNameEng}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="module"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.module ? errors.module.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            size="small"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText === "Update" ? (
                              <FormattedLabel id="Update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
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
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
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
                  // backgroundColor: "#BBD5F1",
                  // border: "1px solid #556CD6",
                  // color: "white",
                  // border: "1px solid white",
                },
                backgroundColor: "white",
                boxShadow: 2,
                border: 1,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {
                  // transform: "scale(1.1)",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#BBD5F1",
                  // color: "white",
                },
                // "& .MuiDataGrid-columnHeadersInner": {
                //   backgroundColor: "#87E9F7",
                // },
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
                getApplicationMaster(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getApplicationMaster(_data, data.page);
              }}
            />
          </Box>
          {/* <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            // componentsProps={{
            //   toolbar: {
            //     showQuickFilter: true,
            //   },
            // }}
            getRowId={(row) => row.srNo}
            // components={{ Toolbar: GridToolbar }}
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
              getApplicationMaster(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getApplicationMaster(_data, data.page);
            }}
          />
        </Box> */}
        </Paper>
      )}
    </>
  );
};

export default Index;
