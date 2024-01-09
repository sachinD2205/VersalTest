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
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/SubDepartment";
import Transliteration from "../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import Loader from "../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";
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
  const token = useSelector((state) => state.user.user.token);

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const [departments, setDepartments] = useState([]);
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

  useEffect(() => {
    getSubDepartment();
  }, [departments]);

  useEffect(() => {
    getDepartment();
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getSubDepartment = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/subDepartment/getAll`, {
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
        setLoading(false);
        let result = res.data.subDepartment;
        let _res = result.map((res, i) => {
          console.log("res payment mode", res);
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            activeFlag: res.activeFlag,
            srNo: i + 1,
            id: res.id,
            subDepartment: res.subDepartment ? res.subDepartment : "-",
            subDepartmentMr: res.subDepartmentMr ? res.subDepartmentMr : "-",
            description: res.description ? res.description : "-",
            descriptionMr: res.descriptionMr ? res.descriptionMr : "-",
            department: res.department ? res.department : "-",
            status: res.status,
            departmentName: departments?.find(
              (obj) => obj?.id === res.department
            )?.department
              ? departments?.find((obj) => obj?.id === res.department)
                  ?.department
              : "-",
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
    setLoading(true);
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
            .post(`${urls.CFCURL}/master/subDepartment/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              setLoading(false);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getSubDepartment();
                getDepartment();
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
            .post(`${urls.CFCURL}/master/subDepartment/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                setLoading(false);
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getSubDepartment();
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
    setLoading(true);
    console.log("formData", formData);
    // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      // fromDate,
      // toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/subDepartment/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        setLoading(false);
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "subDepartment") {
                setError("subDepartment", { message: x.code });
              } else if (x.field == "subDepartmentMr") {
                setError("subDepartmentMr", { message: x.code });
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
            getSubDepartment();
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

  const resetValuesExit = {
    department: null,
    subDepartment: "",
    subDepartmentMr: "",
    description: "",
    descriptionMr: "",
    status: "",
    activeFlag: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    department: null,
    subDepartment: "",
    subDepartmentMr: "",
    description: "",
    descriptionMr: "",
    status: "",
    activeFlag: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="department" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "subDepartment",
      headerName: <FormattedLabel id="subDepartment" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "subDepartmentMr",
      headerName: <FormattedLabel id="subDepartmentMr" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: <FormattedLabel id="description" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
      sortable: false,
      headerAlign: "center",
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="subDepartmentMaster" />
      </div>
      <Paper>
        {loading ? (
          <Loader />
        ) : (
          <>
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
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={3}
                          lg={3}
                          xl={3}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
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
                                  value={field.value}
                                  variant="outlined"
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="department" />}
                                >
                                  {departments &&
                                    departments.map((department, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={department.id}
                                        >
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
                              {errors?.department
                                ? errors.department.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={3}
                          lg={3}
                          xl={3}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"subDepartment"}
                              labelName={"subDepartment"}
                              fieldName={"subDepartment"}
                              updateFieldName={"subDepartmentMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={
                                <FormattedLabel id="subDepartment" required />
                              }
                              error={!!errors.subDepartment}
                              helperText={
                                errors?.subDepartment
                                  ? errors.subDepartment.message
                                  : null
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={3}
                          lg={3}
                          xl={3}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"subDepartmentMr"}
                              labelName={"subDepartmentMr"}
                              fieldName={"subDepartmentMr"}
                              updateFieldName={"subDepartment"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              label={
                                <FormattedLabel id="subDepartmentMr" required />
                              }
                              error={!!errors.subDepartmentMr}
                              helperText={
                                errors?.subDepartmentMr
                                  ? errors.subDepartmentMr.message
                                  : null
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={3}
                          lg={3}
                          xl={3}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            style={{ backgroundColor: "white" }}
                            id="outlined-basic"
                            // label="CFC User Remark"
                            label={<FormattedLabel id="description" />}
                            variant="outlined"
                            {...register("description")}
                            error={!!errors.description}
                            helperText={
                              errors?.description
                                ? errors.description.message
                                : null
                            }
                            InputLabelProps={{
                              shrink: watch("description") ? true : false,
                            }}
                          />
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
                  </FormProvider>
                </div>
              </Slide>
            )}

            <Grid
              container
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "end",
              }}
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
                <FormattedLabel id="add" />{" "}
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
                  getSubDepartment(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getSubDepartment(_data, data.page);
                }}
              />
            </Box>
          </>
        )}
      </Paper>
    </>
  );
};

export default Index;
