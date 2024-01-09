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
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/Module";
import styles from "../../../styles/cfc/cfc.module.css";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../components/common/linguosol/transliteration";
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
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({ resolver: yupResolver(schema) });

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
  const [departments, setDepartment] = useState([]);
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
    getModule();
    getIcon();
    getPackage();
  }, []);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [moduleTypes, setModuleTypes] = useState([]);

  const getPackage = () => {
    axios
      .get(`${urls.CFCURL}/master/packages/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("icon res", r);
          setModuleTypes(r.data);
        } else {
          message.error("Login Failed ! Please Try Again !");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [icons, setIcons] = useState([]);

  const getIcon = () => {
    axios
      .get(`${urls.CFCURL}/master/icon/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("icon res", r);

          setIcons(r.data.icon);
        } else {
          message.error("Login Failed ! Please Try Again !");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const resetValues = {
    appCode: "",
    applicationNameEng: "",
    applicationNameMr: "",
    displayOrder: "",
    icon: "",
    module: "",
    url: "",
    color: "",
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  const getModule = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoad(true);
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
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
        setLoad(false);

        console.log("333", res.data);
        let result = res.data.application;
        let _res = result?.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            srNo: i + 1 + _pageNo * _pageSize,
            id: r.id,
            appCode: r.appCode,
            applicationNameEng: r.applicationNameEng,
            applicationNameMr: r.applicationNameMr,
            displayOrder: r.displayOrder,
            icon: r.icon,
            module: r.module,
            url: r.url,
            color: r.color,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 30, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setLoad(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // const getDepartment = () => {
  //   axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
  //     setDepartment(
  //       res.data.department.map((r, i) => ({
  //         id: r.id,
  //         department: r.department,
  //         // zoneapplicationNameMr: r.zoneapplicationNameMr,
  //       }))
  //     );
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
            .post(`${urls.CFCURL}/master/application/save`, body, {
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

                getModule();
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
                getModule();
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
    const finalBodyForApi = {
      ...formData,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/application/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getModule();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    appCode: "",
    applicationNameEng: "",
    applicationNameMr: "",
    displayOrder: "",
    icon: "",
    module: "",
    url: "",
    color: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    appCode: "",
    applicationNameEng: "",
    applicationNameMr: "",
    displayOrder: "",
    icon: "",
    module: "",
    url: "",
    color: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      minWidth: 70,
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "appCode",
      headerName: <FormattedLabel id="moduleCode" />,
      minWidth: 80,
      flex: 0.8,
    },

    {
      field: "applicationNameEng",
      headerName: <FormattedLabel id="moduleNameEn" />,
      // type: "number",
      minWidth: 250,
      flex: 1,
    },

    {
      field: "applicationNameMr",
      headerName: <FormattedLabel id="moduleNameMr" />,
      // type: "number",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "color",
      headerName: <FormattedLabel id="color" />,
      // type: "number",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "displayOrder",
      headerName: <FormattedLabel id="displayOrder" />,
      // type: "number",
      minWidth: 70,
    },
    {
      field: "url",
      headerName: <FormattedLabel id="urlMenu" />,
      // type: "number",
      flex: 2,
      minWidth: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "36%" }}>
            {<FormattedLabel id="moduleMaster" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValues,
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper style={{ paddingTop: isOpenCollapse ? "10px" : "0px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                backgroundColor: "#F5F5F5",
              }}
              elevation={5}
            >
              <br />
              <br />
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={4}
                      // sx={{ marginTop: 5 }}
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
                        label={<FormattedLabel id="modulePrefix" />}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: watch("appCode") ? true : false,
                        }}
                        {...register("appCode")}
                        error={!!errors.appCode}
                        helperText={
                          errors?.appCode ? errors.appCode.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"bankName"}
                          labelName={"moduleNameEn"}
                          fieldName={"applicationNameEng"}
                          updateFieldName={"applicationNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="moduleNameEn" required />}
                          error={!!errors.applicationNameEng}
                          helperText={
                            errors?.applicationNameEng
                              ? errors.applicationNameEng.message
                              : null
                          }
                        />
                      </Box>
                      {/* <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="moduleNameEn" />}
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
                      xs={4}
                      // sx={{ marginTop: 5, marginLeft: 20 }}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"applicationNameMr"}
                          labelName={"moduleNameMr"}
                          fieldName={"applicationNameMr"}
                          updateFieldName={"applicationNameEng"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="moduleNameMr" required />}
                          error={!!errors.applicationNameMr}
                          helperText={
                            errors?.applicationNameMr
                              ? errors.applicationNameMr.message
                              : null
                          }
                        />
                      </Box>
                      {/* <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="moduleNameMr" />}
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
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.icon}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="icon" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label={<FormattedLabel id="icon" />}
                              value={field.value}
                              // {...register("applicationName")}
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                console.log("value", value);
                                field.onChange(value);
                              }}
                              style={{ backgroundColor: "white" }}
                            >
                              {icons.length > 0
                                ? icons.map((icon, index) => {
                                    console.log("33", icon);
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={icon.iconName}
                                      >
                                        {icon.iconName}
                                      </MenuItem>
                                    );
                                  })
                                : "NA"}
                            </Select>
                          )}
                          name="icon"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.icon ? errors.icon.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.module}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="moduleType" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label={<FormattedLabel id="moduleType" />}
                              value={field.value}
                              // {...register("applicationName")}
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                console.log("value", value);
                                field.onChange(value);
                              }}
                              style={{ backgroundColor: "white" }}
                            >
                              {moduleTypes.length > 0
                                ? moduleTypes.map((module, index) => {
                                    console.log("33", module);
                                    return (
                                      <MenuItem key={index} value={module.id}>
                                        {language === "en"
                                          ? module.packageNameEng
                                          : module.packageNameMr}
                                      </MenuItem>
                                    );
                                  })
                                : "NA"}
                            </Select>
                          )}
                          name="module"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.module ? errors.module.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      // sx={{ marginTop: 5 }}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        type="number"
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="displayOrder" />}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: watch("displayOrder") ? true : false,
                        }}
                        {...register("displayOrder")}
                        error={!!errors.displayOrder}
                        helperText={
                          errors?.displayOrder
                            ? errors.displayOrder.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={4}
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
                        label={<FormattedLabel id="color" />}
                        variant="outlined"
                        {...register("color")}
                        InputLabelProps={{
                          shrink: watch("color") ? true : false,
                        }}
                        error={!!errors.color}
                        helperText={errors?.color ? errors.color.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "96%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="urlMenu" />}
                        variant="outlined"
                        {...register("url")}
                        InputLabelProps={{
                          shrink: watch("url") ? true : false,
                        }}
                        error={!!errors.url}
                        helperText={errors?.url ? errors.url.message : null}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        variant="outlined"
                        color="success"
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
                    <Grid item>
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
              "& .MuiDataGrid-cell:hover": {
                // transform: "scale(1.1)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E3EAEA",
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
              getModule(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getModule(_data, data.page);
            }}
          />
        </Box>
        {/* <Box style={{ overflowX: "scroll", display: "flex" }}>
          <DataGrid
            sx={{
              backgroundColor: "white",
              // overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            getRowId={(row) => row.srNo}
            density="compact"
            autoHeight={true}
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
              getModule(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getModule(_data, data.page);
            }}
          />
        </Box> */}
      </Paper>
    </>
  );
};

export default Index;
