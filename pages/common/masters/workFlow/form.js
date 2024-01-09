import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/common/workFlowSchema";
import styles from "../../../../styles/cfc/cfc.module.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

const WorkFlow = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,

    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      roleId: "",
      workFlowId: "",
      officeLocationId: "",
      departmentId: "",
      employeeId: "",
      designationId: "",
      sla: "",
    },
    defaultValues: {
      applicationRolesList: [
        {
          roleId: "",
          workFlowId: "",
          officeLocationId: "",
          departmentId: "",
          employeeId: "",
          designationId: "",
          sla: "",
        },
      ],
    },
    resolver: yupResolver(schema),
  });
  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // const [isDepartmentChecked, setIsDepartmentChecked] = useState(false);
  const [isCFCChecked, setIsCFCChecked] = useState(false);
  const [isOtherUserChecked, setIsOtherUserChecked] = useState(false);

  const [dataFromDUR, setDataFromDUR] = useState(false);

  const [selectedRoleName, setSelectedRoleName] = useState([]);
  const [selectedModuleName, setSelectedModuleName] = useState([]);

  const [displayFeild, setDisplayFeild] = useState();

  const [feildValue, setFeildValue] = useState("102");

  const language = useSelector((state) => state?.labels.language);

  const handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedRoleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const _handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedModuleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    // name: "applicationName",
    name: "applicationRolesList",
    control,
    // defaultValues: [
    //   {applicationName:'aa',
    // }]
  });

  // useEffect(() => {
  //   console.log(
  //     "444",
  //     router.query,
  //     router.query.mode === "edit"
  //       ? setDataFromDUR(false)
  //       : setDataFromDUR(true)
  //   );
  //   if (router.query.mode === "edit") {
  //     setDataFromDUR(true);
  //   }
  //   if (router.query.mode === undefined) {
  //     setDataFromDUR(false);
  //   }
  //   reset(router.query);
  //   setValue("mobileNumber", router.query.mobileNo);
  //   setValue("userName", router.query.username);
  //   setValue(
  //     "isDepartmentChecked",
  //     router.query.isDepartmentUser === "true" ? true : false
  //   );
  //   setValue("isCFCChecked", router.query.isCfcUser === "true" ? true : false);
  //   setValue(
  //     "isOtherUserChecked",
  //     router.query.isOtherUser === "true" ? true : false
  //   );
  // }, [router.query.pageMode]);

  useEffect(() => {
    if (getValues(`applicationRolesList.length`) == 0) {
      appendUI();
    }
  }, []);

  useEffect(() => {
    getDepartmentName();
    getDesignationName();
    getApplicationsName();
    getRoleName();
    getLocationName();
    getServiceList();
    getOfficeLocation();
    getZone();
    getWard();
    getUser();
  }, []);

  const appendUI = () => {
    append({
      roleId: "",
      workFlowId: "",
      officeLocationId: "",
      departmentId: "",
      employeeId: "",
      designationId: "",
      sla: "",
    });
  };

  const [users, setUser] = useState();

  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res application", r);
          setUser(r.data.user);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res department", r);
          setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res zone", r);
          setZoneList(r.data.zone);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getWard = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res ward", r);
          setWardList(r.data.ward);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDesignationName = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res designation", r);
          setDesignationList(r.data.designation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getApplicationsName = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res application", r);
          setApplicationList(r.data.application);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getRoleName = () => {
    axios
      .get(`${urls.CFCURL}/master/role/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res role", r);
          setRoleList(r.data.role);
          // setRoleList(r.data.mstRole.map((val) => val.name));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getLocationName = () => {
    axios
      .get(`${urls.CFCURL}/master/locality/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res location", r);
          setLocationList(r.data.locality);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getServiceList = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res service", r);
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(
            // r.data.officeLocation.map((val) => val.officeLocationName)
            r.data.officeLocation,
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // old
  // const onFinish = (data) => {
  //   let applicationArray = data.applicationRolesList.map((val) => {
  //     return {
  //       roleId: val.roleId,
  //       workFlowId: val.workFlowId,
  //       officeLocationId: val.officeLocationId,
  //       departmentId: val.departmentId,
  //       employeeId: val.employeeId,
  //       designationId: val.designationId,
  //       sla: val.sla,
  //     };
  //   });

  //   const body = {
  //     moduleId: data.moduleId,
  //     applicationId: data.applicationId,
  //     departmentId: data.departmentId,
  //     serviceId: data.serviceId,
  //     serviceTypeId: data.serviceTypeId,
  //     zoneId: data.zoneId,
  //     wardId: data.wardId,
  //     isZoneWardApplicable: data.isZoneWardApplicable,
  //     workFlowStepsDaoLst: applicationArray,

  //     // designation: data.designationName,
  //     // officeDepartmentDesignationUserDaoLst: applicationArray,
  //     // roles: selectedRoleName,
  //     // service: data.serviceId,
  //     // zone: data.zoneId,
  //     // ward: data.wardId,

  //     // workFlowStepsDaoLst:
  //     // applications: selectedModuleName,
  //     // cFCUser: data.isCFCChecked,
  //     // otherUser: data.isOtherUserChecked,
  //     // deptUser: data.isDepartmentChecked,
  //   };

  //   console.log("body", body);

  //   const headers = { Accept: "application/json" };

  //   // axios
  //   //   .post(`${urls.AuthURL}/signup`, body, { headers })

  //   //   .then((r) => {
  //   //     if (r.status == 200) {
  //   //       console.log("res", r);
  //   //       toast("Registered Successfully", {
  //   //         type: "success",
  //   //       });
  //   //       router.push("./login");

  //   //       // D:\Workspace\FrontEnd\NewFrontEnd\pages\login.js
  //   //     }
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log("err", err);
  //   //     toast("Registeration Failed ! Please Try Again !", {
  //   //       type: "error",
  //   //     });
  //   //   });

  //   axios.post(`${urls.CFCURL}/master/workFlow/save`, body, { headers }).then((res) => {
  //     if (res.status == 200) {
  //       sweetAlert("Saved!", "Record Saved successfully !", "success");
  //       getDepartmentName();
  //       getDesignationName();
  //       getApplicationsName();
  //       getRoleName();
  //       getLocationName();
  //       getServiceList();
  //       getOfficeLocation();
  //       getZone();
  //       getWard();
  //     }
  //   });
  // };

  const onFinish = (data) => {
    console.log("222", data);
    let applicationArray = data.applicationRolesList.map((val) => {
      return {
        roleId: val.roleId,
        workFlowId: val.workFlowId,
        officeLocationId: val.officeLocationId,
        departmentId: val.departmentId,
        employeeId: val.employeeId,
        designationId: val.designationId,
        sla: val.sla,
      };
    });

    const body = {
      moduleId: data.moduleId,
      applicationId: data.applicationId,
      departmentId: data.departmentId,
      serviceId: data.serviceId,
      serviceTypeId: data.serviceTypeId,
      zoneId: data.zoneId,
      wardId: data.wardId,
      isZoneWardApplicable: data.isZoneWardApplicable,
      workFlowStepsDaoLst: applicationArray,

      // designation: data.designationName,
      // officeDepartmentDesignationUserDaoLst: applicationArray,
      // roles: selectedRoleName,
      // service: data.serviceId,
      // zone: data.zoneId,
      // ward: data.wardId,

      // workFlowStepsDaoLst:
      // applications: selectedModuleName,
      // cFCUser: data.isCFCChecked,
      // otherUser: data.isOtherUserChecked,
      // deptUser: data.isDepartmentChecked,
    };

    console.log("body", body);

    // swal({
    //   title: "Save?",
    //   text: "Are you sure you want to Save this Record ? ",
    //   icon: "warning",
    //   buttons: true,
    //   dangerMode: true,
    // })

    swal({
      title: "Confirmation",
      text: "Are you sure want to Create User ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${urls.CFCURL}/master/workFlow/save`, body)
          .then((r) => {
            if (r.status == 200) {
              console.log("res", r);
              toast("Added Successfully", {
                type: "success",
              });

              router.push("/common/masters/workFlow");
            } else if (r.status == 400) {
              toast("400 ! Bad Request", {
                type: "failure",
              });
            }
          })
          .catch((err) => {
            // if (err.response?.data?.length > 0) {
            //   err.response?.data?.map((x) => {
            //     if (x.field == "email") {
            //       setError("email", { message: x.code });
            //     } else if (x.field == "userName") {
            //       setError("userName", { message: x.code });
            //     }
            //   });
            // } else {

            sweetAlert(
              err,
              "Email all ready exits...Try again with different E-mail or userName !!",
              // "Try again with different E-mail or userName",
              "warning",
            );
            // console.log("err", err.response.data);
            // toast(err.response.data, {
            //   type: "error",
            // });
            // }
          });
      }
    });
  };

  // Reset Values Exit
  const resetValuesExit = {
    department: "",
    designation: "",
    officeDepartmentDesignationUserDaoLst: "",
    roles: "",
    service: "",
    zone: "",
    ward: "",
  };
  // Exit Button
  const exitButton = () => {
    // router.push("./workFlow");
    router.back();
  };

  // Filter Method
  const handleApplicationNameChange = (value) => {
    console.log("value", value);
    let test = [];

    let _ch =
      serviceList &&
      serviceList.filter((txt) => {
        return value.target.value === txt.departmentId && txt;
      });
    console.log("_ch", _ch);
    test.push(..._ch);

    // applicationList &&
    // applicationList.map((val) => {
    //  let _ch =  serviceList &&
    //     serviceList.filter((txt) => {
    //       return value.target.value === txt.application && txt;
    //     });
    //     console.log('_ch',_ch)
    //     test.push(..._ch);

    // });

    setFilteredServices(test);

    console.log(
      "123",
      departmentList &&
        departmentList.map((val) => {
          let _ch =
            serviceList &&
            serviceList.filter((txt) => {
              return val.id === txt.departmentId && txt;
            });
          console.log("_ch", _ch);
        }),
    );
    console.log("arr", test);
  };

  const handleDepartmentChecked = (e) => {
    console.log("e", e);
    // setIsDepartmentChecked(e.target.checked);
  };

  const handleCFCChecked = (e) => {
    setIsCFCChecked(e.target.checked);
  };

  const handleOtherUserChecked = (e) => {
    setIsOtherUserChecked(e.target.checked);
  };

  return (
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
                onClick={() => exitButton()}
              >
                <ArrowBackIcon />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                <FormattedLabel id="workFlowMaster" />
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <Box className={styles.tableHead}>
            <Box className={styles.feildHead}>
              <FormattedLabel id="selectWorkFlow" />
            </Box>
          </Box>
          <br />
          <form onSubmit={handleSubmit(onFinish)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
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
                        {applicationList &&
                          applicationList.map((applicationNameEng, index) => (
                            <MenuItem key={index} value={applicationNameEng.id}>
                              {language === "en" ? "applicationNameEng" : "applicationNameMr"}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="applicationId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.application ? errors.application.message : null}
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
                        error={errors?.departmentId ? true : false}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Department Name"
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
                        onChange={(value) => {
                          field.onChange(value);
                          // setDepartmentValue(value.target.value);
                          console.log("value.target.value", value.target.value);
                          // handleApplicationNameChange(value);
                        }}
                        style={{ backgroundColor: "white" }}
                      >
                        {departmentList &&
                          departmentList.map((department, index) => {
                            return (
                              <MenuItem key={index} value={department.id}>
                                {language === "en" ? "department" : "departmentMr"}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    )}
                    name="departmentId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.departmentId ? errors.departmentId.message : null}
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
                        error={errors?.serviceId ? true : false}
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
                            // .filter((f) => f.id === departmentValue)
                            .map((service, index) => {
                              return (
                                <MenuItem key={index} value={service.id}>
                                  {language === "en" ? "serviceName" : "serviceNameMr"}
                                </MenuItem>
                              );
                            })}
                      </Select>
                    )}
                    name="serviceId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.serviceId ? errors.serviceId.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
              <Grid item xs={3} className={styles.feildres}>
                <span style={{ backgroundColor: "white", marginRight: 6, marginLeft: -14, padding: 3 }}>
                  <InputLabel id="demo-simple-select-standard-label">Location Type =</InputLabel>
                </span>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="isZoneWardApplicable"
                >
                  <FormControlLabel
                    onChange={(value) => {
                      console.log("value", value.target.value);
                      setDisplayFeild(value.target.value);
                    }}
                    value="All"
                    control={
                      <Radio sx={{ backgroundColor: "white", padding: 0, marginRight: 2, marginLeft: 2 }} />
                    }
                    label="All"
                  />
                  <FormControlLabel
                    onChange={(value) => {
                      console.log("value", value.target.value);
                      setDisplayFeild(value.target.value);
                    }}
                    sx={{ paddingTop: 1 }}
                    value="Zone-Ward"
                    control={
                      <Radio sx={{ backgroundColor: "white", padding: 0, marginRight: 2, marginLeft: 2 }} />
                    }
                    label="Zone-Ward"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={4} className={styles.feildres}></Grid>
              <Grid item xs={4} className={styles.feildres}></Grid>
            </Grid>
            <br />
            {displayFeild == "Zone-Ward" ? (
              <>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl size="small" sx={{ width: "80%" }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zoneName" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // label="Zone Number"
                            label={<FormattedLabel id="zoneName" />}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              //  setSelectedZone(value.target.value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {zoneList.length > 0
                              ? zoneList.map((zone, index) => {
                                  return (
                                    <MenuItem key={index} value={zone.id}>
                                      {language === "en" ? zone.zoneName : zone.zoneNameMr}
                                    </MenuItem>
                                  );
                                })
                              : "NA"}
                          </Select>
                        )}
                        name="zoneId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.zoneId ? errors.zoneId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl size="small" sx={{ width: "80%" }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="wardId" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // label="Ward Number"
                            label={<FormattedLabel id="wardId" />}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value), setSelectedWard(value.target.value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {wardList.length > 0
                              ? wardList.map((ward, index) => {
                                  return (
                                    <MenuItem key={index} value={ward.id}>
                                      {language === "en" ? ward.wardName : ward.wardNameMr}
                                    </MenuItem>
                                  );
                                })
                              : "NA"}
                          </Select>
                        )}
                        name="wardId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.wardId ? errors.wardId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
              </>
            ) : (
              <></>
            )}

            <br />
            <br />
            <div>
              {/* <Box style={{ padding: "20px" }}>
                <Typography variant="h6">Add WorkFlow Steps</Typography>
                <Divider style={{ background: "black" }} />
              </Box> */}
              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  <FormattedLabel id="addWorkFlowStep" />
                </Box>
              </Box>
              <Grid container>
                <Grid item xs={11} style={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      appendUI();
                    }}
                  >
                    {<FormattedLabel id="addMore" />}
                  </Button>
                </Grid>
              </Grid>
              <Grid container style={{ padding: "10px", backgroundColor: "#E8F6F3" }}>
                {fields.map((witness, index) => {
                  return (
                    <>
                      <Grid container sx={{ borderBottom: "1px solid black", paddingBottom: 3 }}>
                        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl fullWidth style={{ width: "80%" }} size="small">
                              <InputLabel id="demo-simple-select-label">Event</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Role name"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {roleList.length > 0
                                      ? roleList.map((val, id) => {
                                          return (
                                            <MenuItem key={id} value={val.id}>
                                              {val.name}
                                            </MenuItem>
                                          );
                                        })
                                      : "Not Available"}
                                  </Select>
                                )}
                                name={`applicationRolesList[${index}].roleId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.roleId ? errors.roleId.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl style={{ width: "80%" }} size="small">
                              <InputLabel id="demo-simple-select-label">OfficeLocation</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="OfficeLocation"
                                    value={field.value}
                                    // onChange={(value) => field.onChange(value)}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      // handleApplicationNameChange(value);
                                    }}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {officeLocationList.length > 0
                                      ? officeLocationList.map((val, id) => {
                                          return (
                                            <MenuItem key={id} value={val.id}>
                                              {val.officeLocationName}
                                            </MenuItem>
                                          );
                                        })
                                      : "Not Available"}
                                  </Select>
                                )}
                                name={`applicationRolesList[${index}].officeLocationId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.officeLocationId ? errors.officeLocationId.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl style={{ width: "80%" }} size="small">
                              <InputLabel id="demo-simple-select-label">DepartmentName</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Department name"
                                    value={field.value}
                                    // onChange={(value) => field.onChange(value)}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      // handleApplicationNameChange(value);
                                    }}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {departmentList.length > 0
                                      ? departmentList.map((val, id) => {
                                          return (
                                            <MenuItem key={id} value={val.id}>
                                              {val.department}
                                            </MenuItem>
                                          );
                                        })
                                      : "Not Available"}
                                  </Select>
                                )}
                                name={`applicationRolesList[${index}].departmentId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.departmentId ? errors.departmentId.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl style={{ width: "80%" }} size="small">
                              <InputLabel id="demo-simple-select-label">Designation/Employee</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Designation/Employee"
                                    value={field.value}
                                    onChange={(value) => {
                                      setFeildValue(value.target.value);
                                      field.onChange(value);
                                    }}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    <MenuItem value="101">Designation</MenuItem>
                                    <MenuItem value="102">Employee</MenuItem>
                                  </Select>
                                )}
                                name={`applicationRolesList[${index}].designationId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.designationId ? errors.designationId.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {feildValue == 102 && (
                            <Grid item xs={4} className={styles.feildres}>
                              <FormControl style={{ width: "80%" }} size="small">
                                <InputLabel id="demo-simple-select-label">
                                  {<FormattedLabel id="employeeName" />}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label={<FormattedLabel id="employeeName" />}
                                      value={field.value}
                                      // onChange={(value) => field.onChange(value)}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        // handleApplicationNameChange(value);
                                      }}
                                      style={{ backgroundColor: "white" }}
                                    >
                                      {/* {applicationList.length > 0
                                        ? applicationList.map((val, id) => {
                                            return (
                                              <MenuItem key={id} value={val.id}>
                                                {language === "en"
                                                  ? val.applicationNameEng
                                                  : val.applicationNameMr}
                                              </MenuItem>
                                            );
                                          })
                                        : "Not Available"} */}
                                      {users?.length > 0
                                        ? users.map((val, id) => {
                                            return (
                                              <MenuItem key={id} value={val.id}>
                                                {language === "en"
                                                  ? val.firstNameEn +
                                                    " " +
                                                    val.middleNameEn +
                                                    " " +
                                                    val.lastNameEn
                                                  : val.firstNameMr +
                                                    " " +
                                                    val.middleNameMr +
                                                    " " +
                                                    val.lastNameMr}
                                              </MenuItem>
                                            );
                                          })
                                        : "Not Available"}
                                    </Select>
                                  )}
                                  name={`applicationRolesList[${index}].employeeId`}
                                  control={control}
                                  defaultValue=""
                                  key={witness.id}
                                />
                                <FormHelperText style={{ color: "red" }}>
                                  {errors?.employeeId ? errors.employeeId.message : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          )}

                          {feildValue == 101 && (
                            <Grid item xs={4} className={styles.feildres}>
                              <FormControl style={{ width: "80%" }} size="small">
                                <InputLabel id="demo-simple-select-label">
                                  {<FormattedLabel id="designationName" />}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label={<FormattedLabel id="designationName" />}
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      style={{ backgroundColor: "white" }}
                                    >
                                      {designationList.length > 0
                                        ? designationList.map((val, id) => {
                                            return (
                                              <MenuItem key={id} value={val.id}>
                                                {language === "en" ? val.designation : val.designationMr}
                                              </MenuItem>
                                            );
                                          })
                                        : "Not Available"}
                                    </Select>
                                  )}
                                  name={`applicationRolesList[${index}].designationId`}
                                  control={control}
                                  defaultValue=""
                                  key={witness.id}
                                />
                                <FormHelperText style={{ color: "red" }}>
                                  {errors?.designationId ? errors.designationId.message : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          )}

                          <Grid item xs={4} className={styles.feildres}></Grid>

                          {/* {feildValue === "102" ? (
                            <Grid item xs={4} className={styles.feildres}>
                              <FormControl style={{ width: "80%" }} size="small">
                                <InputLabel id="demo-simple-select-label">
                                  {<FormattedLabel id="designationName" />}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label={<FormattedLabel id="designationName" />}
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      style={{ backgroundColor: "white" }}
                                    >
                                      {designationList.length > 0
                                        ? designationList.map((val, id) => {
                                            return (
                                              <MenuItem key={id} value={val.id}>
                                                {language === "en" ? val.designation : val.designationMr}
                                              </MenuItem>
                                            );
                                          })
                                        : "Not Available"}
                                    </Select>
                                  )}
                                  name={`applicationRolesList[${index}].designationName`}
                                  control={control}
                                  defaultValue=""
                                  key={witness.id}
                                />
                                <FormHelperText style={{ color: "red" }}>
                                  {errors?.designationName ? errors.designationName.message : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          ) : (
                            <Grid item xs={4} className={styles.feildres}></Grid>
                          )} */}
                        </Grid>
                        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              style={{
                                backgroundColor: "white",
                              }}
                              size="small"
                              sx={{ width: "80%" }}
                              // id="demo-helper-text-misaligned-no-helper"
                              id="outlined"
                              label="SLA"
                              {...register("sla")}
                              error={!!errors.sla}
                              helperText={errors?.sla ? errors.sla.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              style={{
                                backgroundColor: "white",
                              }}
                              size="small"
                              sx={{ width: "80%" }}
                              // id="demo-helper-text-misaligned-no-helper"
                              id="outlined"
                              label="numberOfApprover"
                              {...register("numberOfApprover")}
                              error={!!errors.numberOfApprover}
                              helperText={errors?.numberOfApprover ? errors.numberOfApprover.message : null}
                            />
                          </Grid>
                          <Grid item xs={2} className={styles.feildres}></Grid>
                          <Grid item xs={2} className={styles.feildres}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<DeleteIcon />}
                              style={{
                                color: "white",
                                backgroundColor: "red",
                                height: "30px",
                              }}
                              onClick={() => {
                                // remove({
                                //   applicationName: "",
                                //   roleName: "",
                                // });
                                remove(index);
                              }}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  );
                })}
              </Grid>

              <br />
              <br />
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
              {/* <Toolbar /> */}
            </div>
          </form>
        </Paper>
      </Box>
    </>
  );
};

//
export default WorkFlow;
