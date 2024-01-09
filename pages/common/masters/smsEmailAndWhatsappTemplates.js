import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
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
import moment from "moment/moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/cfc/cfc.module.css";
import urls from "../../../URLS/urls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
  let schema = yup.object().shape({
    // service: yup.string().required('Service Name is Required !!!'),
    // village: yup.string().required(" Village is Required !!"),
    // ward: yup.string().required(" Ward is Required !!"),
    // zone: yup.string().required(" Zone is Required !!"),
    // remark: yup.string().required(" Remark is Required !!"),
  });

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
  });

  // Exit Button
  const exitBack = () => {
    // router.push("./departmentUserList");
    router.back();
  };

  const language = useSelector((state) => state.labels.language);

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
  const [loiGeneration, setLoiGeneration] = useState(false);
  const [rtsSelection, setRtsSelection] = useState(false);

  const [dataFromDUR, setDataFromDUR] = useState(false);

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const [serviceList, setServiceList] = useState([]);

  const getServiceList = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res location", r);
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getRoleName();
    getServiceList();
  }, []);

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
  const getServiceMaster = async (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    setOpen(true);
    axios
      .get(`${urls.BaseURL}/smsEmailAndWhatsappTemplates/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setOpen(false);
          let result = res.data.smsEmailAndWhatsappTemplates;
          let _res = result.map((r, i) => {
            console.log("res payment mode", res);
            return {
              srNo: Number(_pageNo + "0") + i + 1,
              id: r.id,
              ...r,
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              application: r.application,
              applicationNameEng: applications.find((obj) => obj?.id === r.application)?.applicationNameEng,
              applicationNameMr: applications.find((obj) => obj?.id === r.application)?.applicationNameMr,
              department: r.department,
              departmentName: departments?.find((obj) => obj?.id == r.department)?.department,
              departmentNameMr: departments?.find((obj) => obj?.id == r.department)?.departmentMr,
              serviceName: r.serviceName,
              serviceName: serviceList?.find((obj) => obj?.id == r.service)?.serviceName,
              serviceNameMr: serviceList?.find((obj) => obj?.id == r.service)?.serviceNameMr,

              type: r.type,
              subject: r.subject,
              body: r.body,

              status: r.activeFlag === "Y" ? "Active" : "Inactive",
              activeFlag: r.activeFlag,
            };
            setOpen(false);
          });

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
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  const getApplication = async () => {
    // setOpen(true);

    await axios
      .get(`${urls.BaseURL}/application/getAll`)
      .then((r) => {
        setApplications(
          r.data.map((row) => ({
            id: row.id,
            appCode: row.appCode,
            applicationNameEng: row.applicationNameEng,
            applicationNameMr: row.applicationNameMr,
            module: row.module,
          })),
        );
        setOpen(false);
      })
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  const [roleList, setRoleList] = useState([]);

  const getRoleName = () => {
    axios
      .get(`${urls.CFCURL}/master/role/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res role", r);
          setRoleList(r.data.role);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDepartment = async () => {
    // setOpen(true);

    await axios
      .get(`${urls.CFCURL}/master/department/getAll`)

      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          })),
        );
        setOpen(false);
      })
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    getApplication();
  }, [departments]);

  useEffect(() => {
    getServiceMaster();
  }, [applications]);

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
    const finalBodyForApi = {
      ...formData,
    };

    axios.post(`${urls.BaseURL}/smsEmailAndWhatsappTemplates/save`, finalBodyForApi).then((res) => {
      if (res.status == 200) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getApplication();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
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
          axios.post(`${urls.BaseURL}/service/save`, body).then((res) => {
            // console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Inactivated!", {
                icon: "success",
              });
              getApplication();
              setButtonInputState(false);
            }
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
          axios.post(`${urls.BaseURL}/service/save`, body).then((res) => {
            // console.log('delet res', res)
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getServiceMaster();
              setButtonInputState(false);
            }
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
    service: null,
    application: null,
    department: null,
    type: null,
    subject: "",
    body: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: language == "en" ? "applicationNameEng" : "applicationNameMr",
      headerName: "Module Name",
      width: 300,
      // flex: 5,
    },
    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceName" />,
      width: 250,
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: <FormattedLabel id="department" />,
      width: 250,
    },
    {
      field: "type",
      headerName: <FormattedLabel id="rtsSelection" />,
      //type: "number",
      flex: 5,
      align: "center",
      headerAlign: "center",
      minWidth: 230,
    },
    {
      field: "subject",
      headerName: <FormattedLabel id="subject" />,
      //type: "number",
      flex: 5,
      align: "center",
      headerAlign: "center",
      minWidth: 230,
    },
    {
      field: "body",
      headerName: <FormattedLabel id="body" />,
      //type: "number",
      flex: 8,
      align: "center",
      headerAlign: "center",
      minWidth: 180,
    },

    {
      field: language == "en" ? "loiGenerationOp" : "loiGenerationMrOp",
      headerName: <FormattedLabel id="loiGeneration" />,
      //type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 210,
    },
    // {
    //   field: "noOfScrutinyLevel",
    //   headerName: "No Of Scrutiny Level",
    //   //type: "number",
    //   flex: 1,
    //   align: 'center',
    //   headerAlign: 'center',
    // },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      //type: "number",
      flex: 2,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
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
                setBtnSaveText("Update"), setID(params.row.id), setSlideChecked(true);
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
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,
                color: "white",
              }}
              onClick={() => exitBack()}
            >
              <ArrowBackIcon />
            </IconButton>
            {<FormattedLabel id="smsEmailAndWhatsapp" />}
          </Box>
        </Box>
        <Box>
          <Button
            sx={{
              color: "white",
            }}
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
      {/* <Paper
        sx={{
          paddingTop: 3,
        }}
      > */}
      {isOpenCollapse && (
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <Paper
            sx={{
              marginTop: 2,
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
                <Grid container style={{ padding: "10px" }}>
                  <Grid item md={4}>
                    <FormControl style={{ width: "80%" }} size="small">
                      <InputLabel id="demo-simple-select-label">Application Name</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Application Name"
                            value={field.value}
                            // onChange={(value) => field.onChange(value)}
                            onChange={(value) => {
                              field.onChange(value);
                              // handleApplicationNameChange(value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {applications &&
                              applications.map((applicationNameEng, index) => (
                                <MenuItem key={index} value={applicationNameEng.id}>
                                  {language === "en" ? "applicationNameEng" : "applicationNameMr"}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="application"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.application ? errors.application.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={4}>
                    <FormControl style={{ width: "80%" }} size="small">
                      <InputLabel id="demo-simple-select-label">Department Name</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Department Name"
                            value={field.value}
                            // onChange={(value) => field.onChange(value)}
                            onChange={(value) => {
                              field.onChange(value);
                              // handleApplicationNameChange(value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {departments &&
                              departments.map((department, index) => {
                                return (
                                  <MenuItem key={index} value={department.id}>
                                    {language === "en" ? "department" : "departmentMr"}
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
                        {errors?.department ? errors.department.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={4}>
                    <FormControl style={{ width: "80%" }} size="small">
                      <InputLabel id="demo-simple-select-label">Service Name</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Service Name"
                            value={field.value}
                            // onChange={(value) => field.onChange(value)}
                            onChange={(value) => {
                              field.onChange(value);
                              // handleApplicationNameChange(value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {serviceList &&
                              serviceList.map((service, index) => {
                                return (
                                  <MenuItem key={index} value={service.id}>
                                    {language === "en" ? "serviceName" : "serviceNameMr"}
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

                <Grid container style={{ padding: "10px" }}>
                  <Grid item md={4}>
                    <FormControl style={{ width: "80%" }} size="small">
                      <InputLabel id="demo-simple-select-label">Type</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Type"
                            value={field.value}
                            // onChange={(value) => field.onChange(value)}
                            onChange={(value) => {
                              field.onChange(value);
                              // handleApplicationNameChange(value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            <MenuItem key="1" value="1">
                              Sms
                            </MenuItem>
                            <MenuItem key="2" value="2">
                              E-mail
                            </MenuItem>
                            <MenuItem key="3" value="3">
                              Whatsapp
                            </MenuItem>
                          </Select>
                        )}
                        name="type"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.type ? errors.type.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={4}></Grid>
                  <Grid item md={4}></Grid>
                </Grid>

                <Grid container style={{ padding: "10px" }}>
                  <Grid item md={12}>
                    <TextField
                      sx={{ width: "86%" }}
                      size="small"
                      id="outlined-multiline-static"
                      multiline
                      label="Subject"
                      variant="outlined"
                      style={{ backgroundColor: "white" }}
                      {...register("subject")}
                      error={errors.subject}
                      helperText={errors.subject?.message}
                    />
                  </Grid>
                  <br />
                  <br />
                  <br />
                  <Grid item md={12}>
                    <TextField
                      // id="filled-multiline-flexible"
                      // multiline
                      // maxRows={4}
                      // // variant="filled"
                      // size="small"
                      // // id="outlined-basic"
                      // label="Body"
                      // variant="outlined"
                      // error={errors.body}
                      // helperText={errors.body?.message}
                      sx={{ width: "66%" }}
                      style={{ backgroundColor: "white" }}
                      {...register("body")}
                      label="Body"
                      id="outlined-multiline-static"
                      multiline
                      rows={6}
                      defaultValue="Default Value"
                    />
                  </Grid>
                </Grid>

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
                          {/* <FormattedLabel id="save" /> */}
                          Save
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
                              ...resetValuesExit,
                            });
                          }}
                        >
                          {/* {<FormattedLabel id="clear" />} */}
                          Clear
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
                          {/* {<FormattedLabel id="exit" />} */}
                          Exit
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                  </>
                )}
                {/* <Toolbar /> */}
              </div>
            </form>
          </Paper>
        </Slide>
      )}
      {/* <Grid container sx={{ padding: '10px' }}>
          <Grid item xs={11}></Grid>
          <Grid item xs={1}>
            <Button
              variant='contained'
              endIcon={<AddIcon />}
              type='primary'
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValues,
                })
                setEditButtonInputState(true)
                setDeleteButtonState(true)
                setBtnSaveText('Save')
                setButtonInputState(true)
                setSlideChecked(true)
                setIsOpenCollapse(!isOpenCollapse)
              }}
            >
              Add{' '}
            </Button>
          </Grid>
        </Grid> */}
      {/* <Box style={{ height: 'auto', overflow: 'auto' }}>
          <DataGrid
            sx={{
              // fontSize: 16,
              // fontFamily: 'Montserrat',
              // font: 'center',
              // backgroundColor:'yellow',
              // // height:'auto',
              // border: 2,
              // borderColor: "primary.light",
              overflowY: 'scroll',

              '& .MuiDataGrid-virtualScrollerContent': {
                // backgroundColor:'red',
                // height: '800px !important',
                // display: "flex",
                // flexDirection: "column-reverse",
                // overflow:'auto !important'
              },
              '& .MuiDataGrid-columnHeadersInner': {
                backgroundColor: '#556CD6',
                color: 'white',
              },

              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
            density='compact'
            autoHeight={true}
            // rowHeight={50}
            pagination
            paginationMode='server'
            // loading={data.loading}
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getServiceMaster(data.pageSize, _data)
            }}
            onPageSizeChange={(_data) => {
              // console.log('222', _data)
              // updateData("page", 1);
              getServiceMaster(_data, data.page)
            }}
          />
        </Box> */}

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
              getServiceMaster(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getServiceMaster(_data, data.page);
            }}
          />
        </Box> */}

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
            getServiceMaster(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getServiceMaster(_data, data.page);
          }}
        />
      </Box>
      {/* </Paper> */}
    </>
  );
};

export default Index;
