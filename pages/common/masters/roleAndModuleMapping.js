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
  Checkbox,
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
import schema from "../../../containers/schema/common/roleAndModuleMappingMaster";
import styles from "../../../styles/cfc/cfc.module.css";
import { toast } from "react-toastify";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // import from use Form

  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [applications, setApplications] = useState([]);
  const [roles, setRoles] = useState([]);
  const [id, setID] = useState();
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

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
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

  const [open, setOpen] = useState();

  const handleOpen = () => {
    setOpen(false);
  };

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let isSave = true;

  useEffect(() => {
    getApplications();
    getRoles();
  }, []);

  useEffect(() => {
    getRoleAndModuleMapping();
  }, [applications]);

  // getApplicationName
  const getApplications = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res app", r);
        setApplications(
          r?.data?.application?.map((row) => ({
            id: row.id,
            application: row.applicationNameEng,
            applicationMr: row.applicationNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getRoles = () => {
    axios
      .get(`${urls.CFCURL}/master/role/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let result = res?.data?.role;
        setRoles(result);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getRoleAndModuleMapping = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/mstRole/getAll`, {
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
        console.log("res mst", res);
        if (res.status == 200) {
          setOpen(false);
          let result = res.data.mstRole;
          let _res = result.map((val, i) => {
            return {
              ...val,
              activeFlag: val.activeFlag,
              srNo: i + 1 + _pageNo * _pageSize,
              id: val.id,
              status: val.activeFlag === "Y" ? "Active" : "Inactive",
              applicationId: val.applicationId
                ? applications?.find((obj) => obj.id == val.applicationId)
                    ?.application
                : "-",
              _applicationId: val.applicationId,
              role: val.name,
            };
          });
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setDataSource(res.data);
          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const onSubmit = async (data) => {
    setOpen(true);
    const bodyForAPI = {
      //   ...data,
      activeFlag: btnSaveText === "Update" ? data.activeFlag : null,
      applicationId: Number(data.moduleId),
      name: roles?.find((obj) => obj.id == Number(data.role))?.name,
      nameMr: roles?.find((obj) => obj.id == data.role)?.nameMr
        ? roles?.find((obj) => obj.id == data.role)?.nameMr
        : "अनुपलब्ध",
      roleId: Number(data.role),
      id: btnSaveText === "Update" ? data.id : null,
    };

    console.log(
      "bodyForAPI",
      bodyForAPI,
      roles,
      data.role,
      roles?.find((obj) => obj.id == data.role)?.nameMr
    );

    await axios
      //   .post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/saveAll`, body, {
      .post(`${urls.CFCURL}/master/mstRole/save`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("save data", response);
        if (response.status == 200) {
          if (response.data?.errors?.length > 0) {
            response.data?.errors?.map((x) => {
              toast(x?.code, {
                type: "error",
              });
              setOpen(false);
            });
          } else {
            data.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getRoleAndModuleMapping();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setOpen(false);
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const deleteById = (value, _activeFlag, params) => {
    let body = {
      applicationId: Number(params._applicationId),
      name: params.name,
      nameMr: params?.nameMr ? params?.nameMr : "अनुपलब्ध",
      roleId: Number(params.roleId),
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
            .post(`${urls.CFCURL}/master/mstRole/save`, body, {
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
                getRoleAndModuleMapping();
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
            .post(`${urls.CFCURL}/master/mstRole/save`, body, {
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
                getRoleAndModuleMapping();
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

  const resetValuesExit = {
    role: null,
    moduleId: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationId",
      headerName: <FormattedLabel id="module" />,
      //   width: 160,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "role",
      headerName: <FormattedLabel id="roles" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={
                editButtonInputState || params.row.activeFlag === "Y"
                  ? false
                  : true
              }
              onClick={() => {
                setBtnSaveText("Update");
                setID(params.row.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue(
                  "role",
                  roles?.find((obj) => obj.name == params.row.role)?.id
                );
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip title="Edit">
                  <EditIcon disabled />
                </Tooltip>
              )}
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
                  onClick={() => deleteById(params.row.id, "N", params.row)}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y", params.row)}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  // Reset Values Cancell
  const resetValuesCancell = {
    role: null,
    moduleId: null,
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const onBack = () => {
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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "34%" }}>
            <FormattedLabel id="moduleAndRoleMapping" />
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleOpen}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper>
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <Paper
            sx={{
              backgroundColor: "#F5F5F5",
            }}
            elevation={5}
          >
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div className={styles.fields}>
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
                          <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ width: "90%", backgroundColor: "white" }}
                            error={errors.moduleId}
                          >
                            <InputLabel
                              shrink={
                                watch("moduleId") && watch("moduleId") != null
                                  ? true
                                  : false
                              }
                              id="demo-simple-select-outlined-label"
                            >
                              <FormattedLabel id="moduleName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  label={<FormattedLabel id="moduleName" />}
                                  value={field.value || ""}
                                  onChange={(value) => field.onChange(value)}
                                >
                                  {applications &&
                                    applications.map(
                                      (ApplicationNameKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={ApplicationNameKey.id}
                                        >
                                          {ApplicationNameKey.application}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="moduleId"
                              control={control}
                              defaultValue=""
                            />
                            {console.log("moduleId", watch("moduleId"))}
                            <FormHelperText>
                              {errors?.moduleId
                                ? errors.moduleId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
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
                          <FormControl size="small" sx={{ width: "90%" }}>
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              shrink={
                                watch("role") && watch("role") != null
                                  ? true
                                  : false
                              }
                            >
                              <FormattedLabel id="roles" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={<FormattedLabel id="roles" />}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {roles.length > 0
                                    ? roles.map((department, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={department.id}
                                          >
                                            {department.name}
                                          </MenuItem>
                                        );
                                      })
                                    : []}
                                </Select>
                              )}
                              name="role"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.role ? errors.role.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "end" }}
                        >
                          <Button
                            type="submit"
                            size="small"
                            color="success"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<SaveIcon />}
                          >
                            <FormattedLabel id="Save" />
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            size="small"
                            color="primary"
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
                        <Grid item xs={4}>
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
                    </div>
                  </Slide>
                )}
              </form>
            </FormProvider>
          </Paper>
        </Slide>

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
              getRoleAndModuleMapping(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              getRoleAndModuleMapping(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
