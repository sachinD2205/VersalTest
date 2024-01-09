import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
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
  Container,
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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import schema from "../../../containers/schema/common/defineServiceHierarchy";
import styles from "../../../styles/cfc/cfc.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      role: "",
      level: "",
    },
    defaultValues: {
      levelsOfRolesDaoList: [{ role: "", level: "" }],
    },
  });

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [applications, setApplications] = useState([]);

  const [dataFromDUR, setDataFromDUR] = useState(false);

  const [departmentValue, setDepartmentValue] = useState();

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const [serviceList, setServiceList] = useState([]);

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

  const getServiceList = () => {
    setOpen(true);

    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          //   console.log("res location", r);
          setServiceList(r.data.service);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getApplication();
    getDepartment();
    getServiceList();
    getRoleName();
  }, []);

  useEffect(() => {
    getServiceMaster();
  }, [departments, serviceList, applications]);

  // Exit Button
  const exitBack = () => {
    // router.push("./departmentUserList");
    router.back();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getServiceMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setOpen(true);
    axios
      .get(`${urls.BaseURL}/serviceHierarchy/getAll`, {
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
        if (res.status == 200) {
          setOpen(false);
          let result = res.data.serviceHierarchy;
          console.log("result", result);
          let _res = result.map((r, i) => {
            console.log(
              "res payment mode",
              departments?.find((obj) => obj?.id == r.department)?.department
            );
            return {
              srNo: i + 1 + _pageNo * _pageSize,
              id: r.id,
              ...r,
              application: r.application,
              applicationNameEng: applications.find(
                (obj) => obj?.id == r.application
              )?.applicationNameEng,
              applicationNameMr: applications.find(
                (obj) => obj?.id == r.application
              )?.applicationNameMr,
              department: r.department,
              // departmentName: r.department,
              departmentName: departments?.find((obj) => {
                return obj?.id == r.department;
              })?.department,

              departmentNameMr: departments?.find(
                (obj) => obj?.id == r.department
              )?.departmentMr,
              serviceName: r.serviceName,
              serviceNameFeild: serviceList?.find((obj) => obj?.id == r.service)
                ?.serviceName,
              serviceNameMr: serviceList?.find((obj) => obj?.id == r.service)
                ?.serviceNameMr,

              status: r.activeFlag === "Y" ? "Active" : "Inactive",
              activeFlag: r.activeFlag,

              role: r.levelsOfRolesDaoList.map((data) => {
                return data?.role;
              }),

              level: r.levelsOfRolesDaoList.map((data) => {
                return data.level;
              }),

              // roleColEn: role.map((f)=> f.id == )
              // roleColEn: roleList.filter((f) => f.id == role)?.name,
              roleColEn: roleList.filter((f) => f.id == data?.role)?.name,
              roleColMr: roleList.find((f) => f.id == data?.role)?.nameMr,
            };
            setOpen(false);
          });

          console.log("_res", _res);
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      // name: "applicationName",
      name: "levelsOfRolesDaoList",
      control,
      // defaultValues: [
      //   {applicationName:'aa',
      // }]
    }
  );

  const appendUI = () => {
    append({
      level: "",
      role: "",
    });
  };

  useEffect(() => {
    if (getValues(`levelsOfRolesDaoList.length`) == 0) {
      appendUI();
    }
    // if (getValues(`officeDepartmentDesignationUserDaoLst.length`) == 0) {
    //   appendUI();
    // }
  }, []);

  const getApplication = async () => {
    setOpen(true);

    await axios
      .get(`${urls.BaseURL}/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setApplications(
          // r.data.application.map((row) => ({
          //   id: row.id,
          //   appCode: row.appCode,
          //   applicationNameEng: row.applicationNameEng,
          //   applicationNameMr: row.applicationNameMr,
          //   module: row.module,
          // })),
          r.data.application
        );
        setOpen(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
        setOpen(false);
      });
  };

  const [roleList, setRoleList] = useState([]);

  const getRoleName = () => {
    setOpen(true);

    axios
      .get(`${urls.CFCURL}/master/role/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res role", r);
          setRoleList(r.data.role);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const getDepartment = async () => {
    setOpen(true);

    await axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        // setDepartments(
        //   res.data.department.map((r, i) => ({
        //     id: r.id,
        //     department: r.department,
        //     departmentMr: r.departmentMr,
        //   })),
        // );
        setDepartments(res?.data?.department);
        setOpen(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  // useEffect(() => {
  //   getDepartment();
  //   getApplication();
  // }, []);

  // useEffect(() => {
  //   getServiceMaster();
  // }, [applications, departments]);

  // const editRecord = (rows) => {
  //   console.log('Edit cha data:', rows)
  //   setBtnSaveText('Update'),
  //     setID(rows.id),
  //     setIsOpenCollapse(true),
  //     setSlideChecked(true)
  //   reset(rows)
  // }

  const onSubmitForm = (formData) => {
    let applicationArray = formData.levelsOfRolesDaoList.map((val) => {
      return {
        level: val.level,
        role: val.role,
      };
    });

    console.log("applicationArray", applicationArray);

    const finalBodyForApi = {
      // ...formData,
      application: formData.application,
      department: formData.department,
      service: formData.service,
      // role: formData.role,
      levelsOfRolesDaoList: applicationArray,
      // fromDate: moment(formData.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      // toDate: moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
    };

    axios
      .post(`${urls.BaseURL}/serviceHierarchy/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getServiceMaster();
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

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    // console.log('body', body)
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // // console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.BaseURL}/serviceHierarchy/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              // console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getServiceMaster();
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
        // console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.BaseURL}/serviceHierarchy/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              // console.log('delet res', res)
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getServiceMaster();
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

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValues,
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
      ...resetValues,
      id,
    });
  };

  // Reset Values Cancell || Exit
  const resetValues = {
    serviceNameFeild: "",
    serviceDays: null,
    rtsSelection: false,
    immediateAtCounter: false,
    scrutinyProcess: false,
    loiGeneration: false,
    noOfScrutinyLevel: null,
    department: null,
    application: null,
    toDate: null,
    fromDate: null,
    serviceNameMr: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      width: 90,
      headerName: "Sr.No",
      align: "center",
      headerAlign: "center",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: language === "en" ? "applicationNameEng" : "applicationNameMr",
      headerName: <FormattedLabel id="application" />,
      width: 300,
      // flex: 5,
    },
    {
      field: language === "en" ? "serviceNameFeild" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceName" />,
      width: 250,
    },
    {
      field: language === "en" ? "departmentName" : "departmentNameMr",
      headerName: <FormattedLabel id="departmentName" />,
      width: 250,
    },

    {
      field: "level",
      headerName: <FormattedLabel id="level" />,
      width: 84,
    },
    {
      // field: language == "en" ? "roleColEn" : "roleColMr",
      field: "roleColEn",
      headerName: <FormattedLabel id="role" />,
      width: 200,
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

  // useEffect(() => {
  //   console.log("444", router.query);
  //   if (router.query.mode === "edit") {
  //     setDataFromDUR(true);
  //   }
  //   // if (router.query.mode === "view") {
  //   //   setDataFromDUR(true);
  //   // }
  //   if (router.query.mode === undefined) {
  //     setDataFromDUR(false);
  //   }
  //   reset(router.query);

  //   setValue("levelsOfRolesDaoList", []);

  //   // if (router.query.mode == "edit") {
  //   axios
  //     .get(`${urls.CFCURL}/master/user/getById?id=${id}`)
  //     .then((r) => {
  //       if (r.status == 200) {
  //         console.log("332233", r?.data);
  //         setSelectedModuleName(r.data.applications);
  //         let levelsOfRolesDaoList = r.data.levelsOfRolesDaoList.map((val) => {
  //           console.log("value33", val);
  //           return {
  //             role: val.role,
  //             level: val.level,
  //           };
  //         });

  //         console.log("levelsOfRolesDaoList43434", levelsOfRolesDaoList);
  //         setValue("levelsOfRolesDaoList", levelsOfRolesDaoList);

  //         console.log("levelsOfRolesDaoList**", getValues("levelsOfRolesDaoList"));
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("errApplication", err);
  //     });
  // }, []);

  // View
  return (
    <>
      {/* <Grid
        container

        sx={{
          backgroundColor: "#0084ff",
          // backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 10,
          marginBottom: 2,
          padding: 8,
          // paddingLeft: 20,
          // marginLeft: "40px",
          // marginRight: "65px",
          borderRadius: 100,
          padding: "10px"
        }}
      > */}
      {/* <Grid item xs={12}
          style={{ marginLeft: "none" }}
        > */}
      {/* <FormattedLabel id={"serviceMasterHeader"} /> */}
      {/* </Grid> */}
      {/* <Grid>
          <AddIcon></AddIcon>
        </Grid> */}
      {/* </Grid> */}

      {/* <div
        style={{
          backgroundColor: "#0084ff",
          // backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 20,
          // marginLeft: "40px",
          // marginRight: "65px",
          borderRadius: 100,
          
        }}
      > */}
      {/* Service Name */}
      {/* <FormattedLabel id='aadharAuthentication' /> */}

      {/* <AddIcon></AddIcon> */}
      {/* </div> */}
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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "32%" }}>
            {<FormattedLabel id="serviceHierarchyMaster" />}
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
        open={open}
        onClick={handleClose}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
        {isOpenCollapse && (
          // <Paper sx={{ marginTop: "20px" }}>
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                marginLeft: 3,
                marginRight: 3,
                marginBottom: 3,
                padding: 2,
                backgroundColor: "#F5F5F5",
              }}
              elevation={5}
            >
              <br />
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div>
                  <br />
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl style={{ width: "84%" }} size="small">
                        <InputLabel id="demo-simple-select-label">
                          <FormattedLabel id="applicationName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              error={errors?.application ? true : false}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label={<FormattedLabel id="applicationName" />}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                field.onChange(value);
                                // handleApplicationNameChange(value);
                              }}
                              style={{ backgroundColor: "white" }}
                            >
                              {applications &&
                                applications.map(
                                  (applicationNameEng, index) => (
                                    <MenuItem
                                      key={index}
                                      value={applicationNameEng.id}
                                    >
                                      {language === "en"
                                        ? "applicationNameEng"
                                        : "applicationNameMr"}
                                    </MenuItem>
                                  )
                                )}
                            </Select>
                          )}
                          name="application"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.application
                            ? errors.application.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl style={{ width: "84%" }} size="small">
                        <InputLabel id="demo-simple-select-label">
                          <FormattedLabel id="departmentName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              error={errors?.department ? true : false}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Department Name"
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                field.onChange(value);
                                setDepartmentValue(value.target.value);
                                console.log(
                                  "value.target.value",
                                  value.target.value
                                );
                                // handleApplicationNameChange(value);
                              }}
                              style={{ backgroundColor: "white" }}
                            >
                              {departments &&
                                departments.map((department, index) => {
                                  return (
                                    <MenuItem key={index} value={department.id}>
                                      {language === "en"
                                        ? "department"
                                        : "departmentMr"}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          )}
                          name="department"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.department
                            ? errors.department.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl style={{ width: "84%" }} size="small">
                        <InputLabel id="demo-simple-select-label">
                          <FormattedLabel id="serviceId" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              error={errors?.service ? true : false}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label={<FormattedLabel id="serviceId" />}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                field.onChange(value);
                                // handleApplicationNameChange(value);
                              }}
                              style={{ backgroundColor: "white" }}
                            >
                              {serviceList &&
                                serviceList
                                  .filter((f) => f.id === departmentValue)
                                  .map((service, index) => {
                                    return (
                                      <MenuItem key={index} value={service.id}>
                                        {language === "en"
                                          ? "serviceName"
                                          : "serviceNameMr"}
                                      </MenuItem>
                                    );
                                  })}
                            </Select>
                          )}
                          name="service"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.service ? errors.service.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  {/* <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Department name
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    readonly={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={field.value}
                    label="Department name"
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {roleList.length > 0
                      ? roleList.map((val, id) => {
                          return (
                            <MenuItem key={id} value={val.id}>
                              {val.department}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="departmentName"
                control={control}
                defaultValue=""
              />

              <FormHelperText style={{ color: "red" }}>
                {errors?.departmentName ? errors.departmentName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Location name
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    readonly={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={field.value}
                    label="Location name"
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {[
                      { id: 1, department: "Location 1" },
                      { id: 2, department: "Location 2" },
                    ].length > 0
                      ? [
                          { id: 1, department: "Location 1" },
                          { id: 2, department: "Location 2" },
                        ].map((val, id) => {
                          return (
                            <MenuItem key={id} value={val.id}>
                              {val.department}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="locationName"
                control={control}
                defaultValue=""
              />

              <FormHelperText style={{ color: "red" }}>
                {errors?.departmentName ? errors.departmentName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl fullWidth style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Designation name
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    readonly={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Designation name"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {designationList.length > 0
                      ? designationList.map((val, id) => {
                          return (
                            <MenuItem value={val.id} key={id}>
                              {val.designation}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="designationName"
                control={control}
                defaultValue=""
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.designationName
                  ? errors.designationName.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid> */}

                  {/* <Box style={{ padding: "20px" }}>
                <Typography variant="h6">Applications Roles List</Typography>
                <Divider style={{ background: "black" }} />
              </Box> */}

                  <br />

                  <Container>
                    <Paper component={Box} p={1}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          marginBottom: "10px",
                        }}
                      >
                        {router.query.mode === "view" ? (
                          <></>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            endIcon={<AddBoxOutlinedIcon />}
                            onClick={() => {
                              appendUI();
                            }}
                          >
                            {<FormattedLabel id="addMore" />}
                          </Button>
                        )}
                      </Box>

                      {fields.map((witness, index) => {
                        return (
                          <>
                            <Grid
                              container
                              columns={{ xs: 4, sm: 8, md: 12 }}
                              className={styles.feildres}
                              spacing={3}
                              key={index}
                              p={1}
                              sx={{
                                backgroundColor: "#E8F6F3",
                                // border: "5px solid #E8F6F3",
                                // padding: "5px",
                                paddingBottom: "16px",
                                margin: "5px",
                                width: "99%",
                              }}
                            >
                              <Grid item md={4}>
                                <TextField
                                  // type="number"
                                  sx={{ width: "86%" }}
                                  size="small"
                                  id="outlined-basic"
                                  label={<FormattedLabel id="level" />}
                                  variant="outlined"
                                  // readonly={dataFromDUR}
                                  style={{ backgroundColor: "white" }}
                                  // name={`levelsOfRolesDaoList.${index}.level`}
                                  {...register(
                                    `levelsOfRolesDaoList.${index}.level`
                                  )}
                                  error={
                                    errors?.levelsOfRolesDaoList?.[index]?.level
                                  }
                                  helperText={
                                    errors?.levelsOfRolesDaoList?.[index]?.level
                                      ? errors.levelsOfRolesDaoList?.[index]
                                          ?.level.message
                                      : null
                                  }
                                />
                              </Grid>
                              <Grid item md={4}>
                                <FormControl
                                  style={{ width: "100%" }}
                                  size="small"
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    {<FormattedLabel id="role" />}
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        error={
                                          errors?.levelsOfRolesDaoList?.[index]
                                            ?.role
                                            ? true
                                            : false
                                        }
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label={<FormattedLabel id="role" />}
                                        value={field.value}
                                        // onChange={(value) => field.onChange(value)}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          // handleApplicationNameChange(value);
                                        }}
                                        style={{ backgroundColor: "white" }}
                                      >
                                        {roleList.length > 0
                                          ? roleList.map((val, id) => {
                                              return (
                                                <MenuItem
                                                  key={id}
                                                  value={val.id}
                                                >
                                                  {language === "en"
                                                    ? val.name
                                                    : val.nameMr}
                                                </MenuItem>
                                              );
                                            })
                                          : "Not Available"}
                                      </Select>
                                    )}
                                    // name={`levelsOfRolesDaoList[${index}].departmentName`}
                                    name={`levelsOfRolesDaoList.${index}.role`}
                                    control={control}
                                    defaultValue=""
                                    key={witness.id}
                                  />
                                  <FormHelperText style={{ color: "red" }}>
                                    {errors?.levelsOfRolesDaoList?.[index]?.role
                                      ? errors?.levelsOfRolesDaoList?.[index]
                                          ?.role.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </Grid>

                              {router.query.mode === "view" ? (
                                <></>
                              ) : (
                                <>
                                  <Grid item xs={1} className={styles.feildres}>
                                    <IconButton
                                      color="error"
                                      onClick={() => remove(index)}
                                    >
                                      <DeleteIcon sx={{ fontSize: 35 }} />
                                    </IconButton>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </>
                        );
                      })}
                    </Paper>
                  </Container>
                  <br />
                  <br />
                  <br />
                  {router.query.mode === "view" ? (
                    <></>
                  ) : (
                    <>
                      <Grid container className={styles.feildres} spacing={2}>
                        <Grid item>
                          <Button
                            type="submit"
                            size="small"
                            variant="outlined"
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
                            className={styles.button}
                            endIcon={<ClearIcon />}
                            onClick={() => {
                              reset({
                                ...resetValues,
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
                            // color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {/* <Toolbar /> */}
                </div>
              </form>
            </Paper>
          </Slide>
          // </Paper>
        )}
      </Paper>

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
            getServiceMaster(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getServiceMaster(_data, data.page);
          }}
        />
      </Box>
    </>
  );
};

export default Index;
