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
  Box,
  Button,
  Checkbox,
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
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/departmentAndOfficeLocationMapping";
import urls from "../../../URLS/urls";
import Loader from "../../../containers/Layout/components/Loader";
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
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
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
    getDesignatonMaster();
  }, [departments, subDepartments]);

  useEffect(() => {
    getDepartment();
    getofficeLocation();
  }, []);

  useEffect(() => {
    getSubDepartment();
  }, []);

  const language = useSelector((state) => state?.labels?.language);
  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getDesignatonMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/departmentAndOfficeLocationMapping/getAll`, {
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
        let result = res.data.departmentAndOfficeLocationMapping;
        let _res = result.map((res, i) => {
          console.log("res payment mode", res);
          return {
            activeFlag: res.activeFlag,
            // srNo: i + 1,
            srNo: Number(_pageNo + "0") + i + 1,

            id: res.id,
            // fromDate: moment(res.fromDate).format("llll"),
            // toDate: moment(res.toDate).format("llll"),
            officeLocation: res.officeLocation,
            officeLocationCol: officeLocationList.find(
              (f) => f.id == res.officeLocation
            )?.officeLocationName,

            department: res.department,
            // departmentCol: departments.find((f) => f.id == res.departmentId)
            //   ?.department,
            departmentCol: res.department,
            _department: res.departmentId,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
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

  const [officeLocationList, setofficeLocation] = useState([]);

  // get department
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          // res.data.department.map((r, i) => ({
          //   id: r.id,
          //   department: r.department,
          //   departmentMr: r.departmentMr,
          // })),
          res.data.department
        );
      })
      ?.catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get officeLocation
  const getofficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("desi", r);
        setofficeLocation(
          // r.data.officeLocation.map((row) => ({
          //   id: row.id,
          //   description: row.description,
          // })),
          r.data.officeLocation
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getSubDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/subDepartment/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSubDepartments(
          res.data.subDepartment.map((r, i) => ({
            id: r.id,
            subDepartment: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
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
              `${urls.CFCURL}/master/departmentAndOfficeLocationMapping/save`,
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
                getDesignatonMaster();
                getDepartment();
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
              `${urls.CFCURL}/master/departmentAndOfficeLocationMapping/save`,
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
                getDesignatonMaster();
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
      // ...formData,
      departmentId: Number(formData?.department),
      officeLocation: Number(formData?.officeLocation),
      department: departments?.find((obj) => obj.id == formData.department)
        ?.department,
      // fromDate,
      // toDate,
    };

    let body = formData.officeLocation.map((areaObj, index) => {
      return {
        departmentId: Number(formData?.department),
        department: departments?.find((obj) => obj.id == formData.department)
          ?.department,
        officeLocation: areaObj?.id,
        activeFlag: btnSaveText === "Update" ? formData?.activeFlag : null,
        id:
          index === 0 ? (btnSaveText === "Update" ? formData.id : null) : null,
        // id: btnSaveText === "Update" ? data.id : null,
        // area: Number(data?.area),
      };
    });

    console.log("finalBodyForApi", finalBodyForApi, "body", body);

    axios
      .post(
        `${urls.CFCURL}/master/departmentAndOfficeLocationMapping/save`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("save data", res);
        // alert("Ye na");
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "id") {
                setError("department", { message: "Mapping Already exist" });
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
            getDesignatonMaster();
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
    officeLocation: null,
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    department: null,
    officeLocation: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "departmentCol",
      headerName: <FormattedLabel id="department" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "officeLocationCol",
      headerName: <FormattedLabel id="officeLocationName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.4,
      headerAlign: "center",
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
                  setValue("department", params.row._department);
                  setValue("officeLocation", [
                    officeLocationList?.find(
                      (area) => area.id === params.row.officeLocation
                    ),
                  ]);
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
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          padding: "10px",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="officeLocationAndDepartmentMappingMaster" />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
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
                    <FormControl
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
                    </FormControl>
                  </Grid>
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
                    {/* <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ width: "90%", backgroundColor: "white" }}
                      error={!!errors.officeLocation}
                    >
                      <InputLabel
                        shrink={watch("officeLocation") ? true : false}
                        id="demo-simple-select-outlined-label"
                      >
                        <FormattedLabel id="officeLocationName" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            variant="outlined"
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="officeLocationName" />}
                          >
                            {officeLocationList &&
                              officeLocationList.map((desg, index) => {
                                return (
                                  <MenuItem key={index} value={desg.id}>
                                    {language === "en"
                                      ? desg.officeLocationName
                                      : desg.officeLocationNameMar}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        )}
                        name="officeLocation"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.officeLocation
                          ? errors.officeLocation.message
                          : null}
                      </FormHelperText>
                    </FormControl> */}
                    <FormControl style={{ width: "90%" }} size="small">
                      {/* <InputLabel
                            id="demo-simple-select-label"
                            shrink={watch("area") ? true : false}
                          >
                            <FormattedLabel id="areaName" />
                          </InputLabel> */}
                      <Controller
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            id="area-multiselect"
                            options={officeLocationList}
                            size="small"
                            disableCloseOnSelect
                            getOptionLabel={(option) => {
                              return language === "en"
                                ? option.officeLocationName
                                : option.officeLocationNameMar;
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
                                  ? option.officeLocationName
                                  : option.officeLocationNameMar}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                {...params}
                                variant="outlined"
                                label={
                                  <FormattedLabel id="officeLocationName" />
                                }
                                error={errors?.officeLocation ? true : false}
                                style={{ backgroundColor: "white" }}
                              />
                            )}
                          />
                        )}
                        name="officeLocation"
                        control={control}
                        defaultValue={[]}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.officeLocation
                          ? errors.officeLocation.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container style={{ padding: "10px" }}>
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
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
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
                      justifyContent: "center",
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
            style={{ padding: "10px", display: "flex", justifyContent: "end" }}
          >
            <Button
              variant="contained"
              size="small"
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
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
          {/* <DataGrid
            autoHeight
            sx={{
              margin: 5,
            }}
            rows={dataSource}
            // rows={abc}
            // rows={jugaad}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              getDesignatonMaster(newPageSize);
              setPageSize(newPageSize);
            }}
            onPageChange={(e) => {
              console.log("event", e);
              getDesignatonMaster(pageSize, e);
              console.log("dataSource->", dataSource);
            }}
            // {...dataSource}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            rowCount={totalElements}
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
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getDesignatonMaster(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getDesignatonMaster(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Index;
