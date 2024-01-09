import {
  Box,
  Button,
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
import React, { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import router from "next/router";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import styles from "../../../styles/view.module.css";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import axios from "axios";
import Head from "next/head";
import sweetAlert from "sweetalert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import urls from "../../../URLS/urls";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const NewIndex = () => {
  // let schema = yup.object().shape({
  //   zoneId: yup.string().required("Please select a zoneId."),
  //   wardId: yup.string().required("Please select a wardId ."),
  //   departmentId: yup.string().required("Please select a department."),
  //   // serviceName: yup.string().required("Please select a ServiceName."),
  //   counterNo: yup.string().required("Please select a counterNo ."),
  //   applicationCountPerEmployeeForADay: yup.string().required("Please select a applicationCountNo."),
  //   // employeeName: yup.string().required('Please select a department name.'),
  //   // fromDate: yup.string().required('Please select a department name.'),
  //   // toDate: yup.string().required('Please select a department name.'),
  //   // user: yup.string().required('Please select a department name.'),
  // });
  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
  });

  let isDisabled = false,
    DataBharaychaKiNahi,
    isAcknowledgement,
    isSave;

  if (router.query.pageMode === "view") {
    DataBharaychaKiNahi = true;
    isDisabled = true;
    isAcknowledgement = true;
    isSave = false;
  }

  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);
  const [departmentDropDown, setDepartmentDropDown] = useState([]);
  const [serviceDropDown, setServiceDropDown] = useState([]);
  const [table, setTable] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [runAgain, setRunAgain] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const token = useSelector((state) => state.user.user.token);

  //Zone
  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Zone data:", r.data);
        setZoneDropDown(
          // r.data.zone.map((j, i) => ({
          //   id: j.id,
          //   zoneId: j.zoneName,
          // })),
          r.data.zone
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, [runAgain]);

  //Ward
  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Table data: ", r.data);
        setWardDropDown(
          // r.data.ward.map((j, i) => ({
          //   id: j.id,
          //   srNo: i + 1,
          //   fromDate: j.fromDate,
          //   toDate: j.toDate,
          //   gisId: j.gisId,
          //   wardId: j.wardId,
          //   wardPrefix: j.wardPrefix,
          //   wardNo: j.wardNo,
          //   wardId: j.wardId,
          //   wardAddress: j.wardAddress,
          // })),
          r.data.ward
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, [zoneDropDown]);

  //Department
  useEffect(() => {
    setRunAgain(false);

    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        console.log("Department data: ", r.data);
        setDepartmentDropDown(
          // @ts-ignore
          r.data.department.map((j, i) => ({
            id: j.id,
            departmentId: j.department, //This is Department Name, not id
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, [wardDropDown]);

  //Service
  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Service data:", r.data);
        setServiceDropDown(
          // r.data.service.map((j, i) => ({
          //   id: j.id,
          //   serviceName: j.serviceName,
          // })),
          r.data.service
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, [departmentDropDown]);
  //Service
  // employee api not present
  useEffect(() => {
    // axios
    //   .get(`${urls.CFCURL}/master/employee/getAll`)
    //   .then((r) => {
    //     console.log('Employee data:', r.data)
    //     setServiceDropDown(
    //       r.data.employee.map((j, i) => ({
    //         id: j.id,
    //         employeeName: j.employeeName,
    //       })),
    //     )
    //   })
  }, [serviceDropDown]);

  //Table
  useEffect(() => {
    getCounterSchedulind();
  }, []);

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

  // get table data
  const getCounterSchedulind = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.CFCURL}/master/counterScheduling/getAll`, {
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
        let result = res.data.counterSheduling;
        let _res = result.map((j, i) => {
          console.log("44");
          return {
            id: j.id,
            srNo: i + 1,
            // wardId: getwardId(j.wardId),
            // departmentId: getDepartmentName(j.departmentId),
            // serviceName: getServiceName(j.serviceId),
            // zoneId: zoneDropDown[j.zoneId] ? zoneDropDown[j.zoneId].zoneId : "-",
            // serviceName: serviceDropDown[j.serviceId] ? serviceDropDown[j.serviceId].serviceName : "-",
            // wardId: wardDropDown[j.wardId] ? wardDropDown[j.wardId].wardId : "-",
            wardId: j.wardId,
            wardIdCol: wardDropDown.find((obj) => obj?.id == j.wardId)
              ?.wardName,
            serviceId: j.serviceId,
            serviceName: serviceDropDown.find((obj) => obj?.id == j.serviceId)
              ?.serviceName,
            // serviceName: serviceDropDown[j.serviceName] ? serviceDropDown[j.serviceName].serviceName : "-",

            zoneId: j.zoneId,
            zoneIdCol: zoneDropDown.find((obj) => obj?.id === j.zoneId)
              ?.zoneName,
            departmentId: j.departmentId,
            departmentIdCol: departmentDropDown[j.departmentId]
              ? departmentDropDown[j.departmentId].departmentId
              : "-",
            counterNo: j.counterNo,
            applicationCountPerEmployeeForADay:
              j.applicationCountPerEmployeeForADay,
            employeeName: j.employeeName,
            toDate: j.toDate,
            fromDate: j.fromDate,
            // toDate: moment(j.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // fromDate: moment(j.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // user: j.user,
            activeFlag: j.activeFlag,
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
        callCatchMethod(err, language);
      });
  };

  // function getzoneId(value) {
  //   // @ts-ignore
  //   return zoneDropDown.find((obj) => obj?.id === value)?.zoneId;
  // }
  // function getwardId(value) {
  //   // @ts-ignore
  //   return wardDropDown.find((obj) => obj?.id === value)?.wardId;
  // }
  // function getDepartmentName(value) {
  //   // @ts-ignore
  //   return departmentDropDown.find((obj) => obj?.id === value)?.departmentId;
  // }
  // function getServiceName(value) {
  //   // @ts-ignore
  //   return serviceDropDown.find((obj) => obj?.id === value)?.serviceName;
  // }

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      width: 10,
    },
    {
      field: "fromDate",
      headerName: "From Date",
      width: 120,
    },
    {
      field: "toDate",
      headerName: "To Date",
      width: 100,
    },

    // {
    //   field: "wardIdCol",
    //   headerName: "Ward Name",
    //   width: 100,
    // },
    {
      field: "departmentIdCol",
      headerName: "Department Name",
      width: 120,
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      width: 120,
    },
    {
      field: "counterNo",
      headerName: "Counter No.",
      width: 120,
    },
    {
      field: "applicationCountPerEmployeeForADay",
      headerName: "Application count per employee for a day",
      width: 170,
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
                    setCollapse(true),
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

  const editById = (values) => {
    console.log("Edit sathi: ", values);

    const deptId = departmentDropDown.find(
      // @ts-ignore
      (obj) => obj?.departmentId === values.departmentId
      // @ts-ignore
    )?.id;
    const serviceId = serviceDropDown.find(
      // @ts-ignore
      (obj) => obj?.serviceId === values.serviceId
      // @ts-ignore
    )?.id;

    reset({ ...values, departmentId: deptId, serviceId: serviceId });
    setCollapse(true);
  };

  // const deleteById = async (id) => {
  //   sweetAlert({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this record!",
  //     icon: "warning",
  //     buttons: ["Cancel", "Delete"],
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(`${urls.CFCURL}/master/counterScheduling/save/${id}`)
  //         .then((res) => {
  //           if (res.status == 226) {
  //             sweetAlert(
  //               "Deleted!",
  //               "Record Deleted successfully !",
  //               "success"
  //             );
  //             setRunAgain(true);
  //           }
  //         });
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
            .post(`${urls.CFCURL}/master/counterScheduling/save`, body, {
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
                getCounterSchedulind();
                // getZone();
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
            .post(`${urls.CFCURL}/master/counterScheduling/save`, body, {
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
                getCounterSchedulind();
                setButtonInputState(false);
                setEditButtonInputState(false);
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

  const onBack = () => {
    const urlLength = router.asPath.split("/").length;
    const urlArray = router.asPath.split("/");
    let backUrl = "";
    if (urlLength > 2) {
      for (let i = 0; i < urlLength - 1; i++) {
        backUrl += urlArray[i] + "/";
      }
      console.log("Final URL: ", backUrl);
      router.push("./counterScheduling");
    } else {
      router.push("./counterScheduling");
    }
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    zoneId: "",
    wardId: "",
    departmentId: "",
    serviceId: "",
    counterNo: "",
    applicationCountPerEmployeeForADay: "",
    // employeeName: '',
    // user: '',
    fromDate: null,
    toDate: null,
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // const onSubmit = async (data) => {
  //   console.log("Form Data: ", data);

  //   const bodyForAPI = {
  //     ...data,
  //   };

  //   console.log("Sagla data append kelya nantr: ", bodyForAPI);

  //   await axios
  //     .post(`${urls.CFCURL}/master/counterScheduling/save`, bodyForAPI)
  //     .then((response) => {
  //       if (response.status === 200 || response.status === 201) {
  //         if (data.id) {
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");
  //         } else {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         }
  //         setRunAgain(true);
  //         reset({ ...resetValuesCancell, id: null });
  //         setEditButtonInputState(false);
  //       }
  //     });
  // };

  const onSubmit = (formData) => {
    console.log("formData", formData);
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      // activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    axios
      .post(`${urls.CFCURL}/master/counterScheduling/save`, finalBodyForApi, {
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
          getCounterSchedulind();
          setButtonInputState(false);
          // setCollapse(false);
          setEditButtonInputState(false);
          // setDeleteButtonState(false);
          setCollapse(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        Counter Scheduling
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper
      //  className={styles.main}
      >
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          type="primary"
          disabled={buttonInputState}
          onClick={() => {
            reset({
              ...resetValuesCancell,
            });
            setEditButtonInputState(true);
            // setDeleteButtonState(true);
            setCollapse(true);
            setBtnSaveText("Save");
            setButtonInputState(true);
            setSlideChecked(true);
            setCollapse(!isOpenCollapse);
          }}
        >
          <FormattedLabel id="add" />
        </Button>

        {collapse && (
          <Slide direction="down" in={collapse} mountOnEnter unmountOnExit>
            <Paper style={{ padding: "3% 3%" }}>
              <>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControl error={!!errors.fromDate}>
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  inputFormat="dd/MM/yyyy"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date
                                    </span>
                                  }
                                  // value={field.value}
                                  disabled={isDisabled}
                                  value={
                                    router.query.fromDate
                                      ? router.query.fromDate
                                      : field.value
                                  }
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      // InputLabelProps={{
                                      //   style: {
                                      //     fontSize: 15,
                                      //     marginTop: 4,
                                      //   },
                                      // }}
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
                      <Grid item xs={4}>
                        <FormControl error={!!errors.toDate}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  inputFormat="dd/MM/yyyy"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
                                    </span>
                                  }
                                  // value={field.value}
                                  disabled={isDisabled}
                                  value={
                                    router.query.toDate
                                      ? router.query.toDate
                                      : field.value
                                  }
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      // InputLabelProps={{
                                      //   style: {
                                      //     fontSize: 15,
                                      //     marginTop: 4,
                                      //   },
                                      // }}
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

                      <Grid item xs={4}>
                        <FormControl
                          sx={{ width: "250px", marginTop: "2%" }}
                          variant="standard"
                          error={!!errors.zoneId}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            disabled={isDisabled}
                          >
                            Zone Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.zoneId
                                    ? router.query.zoneId
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label="zone Name"
                              >
                                {zoneDropDown &&
                                  zoneDropDown.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        // @ts-ignore
                                        value?.id
                                      }
                                    >
                                      {
                                        // @ts-ignore
                                        value?.zoneName
                                      }
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zoneId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneId ? errors.zoneId.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControl
                          sx={{ width: "250px", marginTop: "2%" }}
                          variant="standard"
                          error={!!errors.wardId}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            disabled={isDisabled}
                          >
                            Ward Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.wardId
                                    ? router.query.wardId
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label="Ward Name"
                              >
                                {wardDropDown &&
                                  wardDropDown.map((value, index) => (
                                    <MenuItem key={index} value={value?.id}>
                                      {value?.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="wardId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.wardId ? errors.wardId.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl
                          sx={{ width: "280px", marginTop: "2%" }}
                          variant="standard"
                          error={!!errors.departmentId}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            disabled={isDisabled}
                          >
                            Department Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.departmentId
                                    ? router.query.departmentId
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label="departmentId"
                              >
                                {departmentDropDown &&
                                  departmentDropDown.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        // @ts-ignore
                                        value?.id
                                      }
                                    >
                                      {
                                        // @ts-ignore
                                        value?.departmentId
                                      }
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="departmentId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.departmentId
                              ? errors.departmentId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl
                          sx={{ width: "250px", marginTop: "2%" }}
                          variant="standard"
                          error={!!errors.serviceId}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            disabled={isDisabled}
                          >
                            Service Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.serviceId
                                    ? router.query.serviceId
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label="Service Name"
                              >
                                {serviceDropDown &&
                                  serviceDropDown.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        // @ts-ignore
                                        value?.id
                                      }
                                    >
                                      {
                                        // @ts-ignore
                                        value?.serviceName
                                      }
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="serviceId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.serviceId
                              ? errors.serviceId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      {/* <FormControl
                          sx={{ width: '250px', marginTop: '2%' }}
                          variant="standard"
                          error={!!errors.user}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            disabled={isDisabled}
                          >
                            Type of User
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.user
                                    ? router.query.user
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label="user"
                              >
                                <MenuItem value={'CFC'}>CFC</MenuItem>
                                <MenuItem value={'Department'}>
                                  Department
                                </MenuItem>
                              </Select>
                            )}
                            name="user"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.user ? errors.user.message : null}
                          </FormHelperText>
                        </FormControl> */}

                      {/* <FormControl
                          sx={{ width: '280px', marginTop: '2%' }}
                          variant="standard"
                          error={!!errors.employeeName}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            disabled={isDisabled}
                          >
                            Employee Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.employeeName
                                    ? router.query.employeeName
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label="employeeName"
                              >
                                {employeeDropDown &&
                                  employeeDropDown.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        // @ts-ignore
                                        value?.id
                                      }
                                    >
                                      {
                                        // @ts-ignore
                                        value?.employeeName
                                      }
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="employeeName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.employeeName
                              ? errors.employeeName.message
                              : null}
                          </FormHelperText>
                        </FormControl> */}

                      <Grid item xs={4}>
                        <TextField
                          sx={{
                            width: "230px",
                            // marginRight: '5%',
                            marginTop: "2%",
                          }}
                          id="standard-basic"
                          label="Counter No.*"
                          variant="standard"
                          {...register("counterNo")}
                          error={!!errors.counterNo}
                          helperText={
                            errors?.counterNo ? errors.counterNo.message : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.counterNo ? router.query.counterNo : ""
                          }
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          sx={{
                            width: "320px",
                            // marginRight: '5%',
                            marginTop: "2%",
                          }}
                          id="standard-basic"
                          label="applicationCountPerEmployeeForADay*"
                          variant="standard"
                          {...register("applicationCountPerEmployeeForADay")}
                          error={!!errors.applicationCountPerEmployeeForADay}
                          helperText={
                            errors?.applicationCountPerEmployeeForADay
                              ? errors.applicationCountPerEmployeeForADay
                                  .message
                              : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.applicationCountPerEmployeeForADay
                              ? router.query.applicationCountPerEmployeeForADay
                              : ""
                          }
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} style={{ marginTop: "10px" }}>
                      <Grid item xs={4}>
                        <Button
                          sx={{
                            width: "100px",
                            height: "40px",
                          }}
                          variant="contained"
                          type="submit"
                          endIcon={<Save />}
                        >
                          <FormattedLabel id={btnSaveText} />
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          sx={{
                            width: "100px",
                            height: "40px",
                          }}
                          variant="outlined"
                          color="error"
                          endIcon={<Clear />}
                          onClick={cancellButton}
                        >
                          Clear
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          sx={{
                            width: "100px",
                            height: "40px",
                          }}
                          variant="contained"
                          color="error"
                          onClick={onBack}
                          endIcon={<ExitToApp />}
                        >
                          Exit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </FormProvider>
              </>
            </Paper>
          </Slide>
        )}

        <Box style={{ height: "auto", overflow: "auto" }}>
          <DataGrid
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
              getCounterSchedulind(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getCounterSchedulind(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default NewIndex;
