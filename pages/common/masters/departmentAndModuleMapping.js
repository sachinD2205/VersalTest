import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/departmentAndModuleMappingSchema";
import styles from "../../../styles/cfc/cfc.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
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
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [applications, setApplications] = useState([]);
  const router = useRouter();
  const [load, setLoad] = useState(false);
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
    getDepartmentAndModuleMapping();
  }, [departments, subDepartments]);

  useEffect(() => {
    getApplications();
    getDepartment();
  }, []);

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const handleLoad = () => {
    setLoad(false);
  };

  const language = useSelector((state) => state?.labels?.language);
  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getDepartmentAndModuleMapping = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoad(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/departmentAndModuleMapping/getAll`, {
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
        let result = res.data.departmentAndModuleMapping;
        let _res = result.map((res, i) => {
          console.log("res payment mode", res);
          return {
            activeFlag: res.activeFlag,
            srNo: Number(_pageNo + "0") + i + 1,

            id: res.id,
            designationCol: designationList.find((f) => f.id == res.designation)
              ?.designation,

            department: res.departmentId,
            departmentCol: departments.find((f) => f.id == res.departmentId)
              ?.department,
            _moduleId: res?.applicationId,
            _department: res?.departmentId,
            moduleId: applications?.find((f) => f.id == res.applicationId)
              ?.application,

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
        setLoad(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  const [designationList, setDesignation] = useState([]);

  // get department
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(res.data.department);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

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

  const deleteById = (value, _activeFlag) => {
    let body = [
      {
        activeFlag: _activeFlag,
        id: value,
      },
    ];
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
            .post(
              `${urls.CFCURL}/master/departmentAndModuleMapping/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getDepartmentAndModuleMapping();
                getDepartment();
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
            .post(
              `${urls.CFCURL}/master/departmentAndModuleMapping/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getDepartmentAndModuleMapping();
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
    // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      department: departments?.find((obj) => obj.id == formData.department)
        ?.department,
      departmentId: formData?.department,
      applicationId: formData?.moduleId,
      application: applications?.find((obj) => obj.id == formData.moduleId)
        ?.application,
    };

    let body = formData?.department?.map((areaObj, index) => {
      return {
        department: areaObj?.department,
        departmentId: areaObj?.id,
        application: applications?.find((obj) => obj.id == formData.moduleId)
          ?.application,
        applicationId: Number(formData?.moduleId),
        // id: btnSaveText === "Update" ? formData.id : null,
        id:
          index === 0 ? (btnSaveText === "Update" ? formData.id : null) : null,
        activeFlag: btnSaveText === "Update" ? formData?.activeFlag : null,
      };
    });

    console.log("finalBodyForApi", finalBodyForApi, "body", body);

    axios
      .post(`${urls.CFCURL}/master/departmentAndModuleMapping/save`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        // alert("Ye na");
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "id") {
                setError("department", { message: x.code });
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
            getDepartmentAndModuleMapping();
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
    moduleId: null,
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    department: null,
    moduleId: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "departmentCol",
      headerName: <FormattedLabel id="departmentName" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "moduleId",
      headerName: <FormattedLabel id="moduleName" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      sortable: false,
      flex: 0.9,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              // disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue("moduleId", params?.row?._moduleId);
                setValue("department", [
                  departments?.find(
                    (area) => area.id === params.row._department
                  ),
                ]);
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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "30%" }}>
            <FormattedLabel id="departmentAndModuleMapping" />
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
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper>
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
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl style={{ width: "90%" }} size="small">
                      <Controller
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            id="department-multiselect"
                            options={departments}
                            size="small"
                            disableCloseOnSelect
                            getOptionLabel={(option) => {
                              return language === "en"
                                ? option.department
                                : option.departmentMr;
                            }}
                            value={field.value || []}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={
                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                  }
                                  checkedIcon={
                                    <CheckBoxIcon fontSize="small" />
                                  }
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                  size="small"
                                />
                                {language === "en"
                                  ? option.department
                                  : option.departmentMr}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                {...params}
                                variant="outlined"
                                label={<FormattedLabel id="department" />}
                                error={errors?.department ? true : false}
                                style={{ backgroundColor: "white" }}
                              />
                            )}
                          />
                        )}
                        name="department"
                        control={control}
                        defaultValue={[]}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.department ? errors.department.message : null}
                      </FormHelperText>
                    </FormControl>
                    {/* <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ width: "90%", backgroundColor: "white" }}
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
                                    {language === "en"
                                      ? department.department
                                      : department.departmentMr}
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
                    </FormControl> */}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
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
                              applications.map((ApplicationNameKey, index) => (
                                <MenuItem
                                  key={index}
                                  value={ApplicationNameKey.id}
                                >
                                  {ApplicationNameKey.application}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="moduleId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.moduleId ? errors.moduleId.message : null}
                      </FormHelperText>
                    </FormControl>
                    {/* <FormControl style={{ width: "90%" }} size="small">
                      <Controller
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            id="moduleId-multiselect"
                            options={applications}
                            size="small"
                            disableCloseOnSelect
                            getOptionLabel={(option) => {
                              return language === "en"
                                ? option.application
                                : option.applicationMr;
                            }}
                            value={field.value || []}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={
                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                  }
                                  checkedIcon={
                                    <CheckBoxIcon fontSize="small" />
                                  }
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                  size="small"
                                />
                                {language === "en"
                                  ? option.application
                                  : option.applicationMr}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                {...params}
                                variant="outlined"
                                label={<FormattedLabel id="moduleName" />}
                                error={errors?.moduleId ? true : false}
                                style={{ backgroundColor: "white" }}
                              />
                            )}
                          />
                        )}
                        name="moduleId"
                        control={control}
                        defaultValue={[]}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.moduleId ? errors.moduleId.message : null}
                      </FormHelperText>
                    </FormControl> */}
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
                      variant="contained"
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
              getDepartmentAndModuleMapping(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              getDepartmentAndModuleMapping(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
