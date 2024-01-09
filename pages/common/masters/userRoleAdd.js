import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  Paper,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  Chip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import React, { useEffect, useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../../../containers/Layout/components/Loader";
import schema from "../../../containers/schema/UserRoleRightSchema";
import {
  MenuProps,
  useStyles,
} from "../../../containers/utils/UserRoleRightUtils";
import urls from "../../../URLS/urls";
// import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import { useSelector } from "react-redux";
import styles from "../../../styles/cfc/cfc.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import AlbumIcon from "@mui/icons-material/Album";
import swal from "sweetalert";

const UserRoleRight = () => {
  const language = useSelector((state) => state.labels.language);

  const [load, setLoad] = useState(false);

  const handleLoad = () => {
    setLoad(false);
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedApplicationR, setSelectedApplicationR] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [designationList, setDesignationList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const applicationName = watch("applicationName");
  const [roleList, setRoleList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(null);
  const roleName = watch("roleName");
  const [testArray, setTestArray] = useState({ res: [], objj: [] });
  const router = useRouter();

  const [buttonShow, setButtonShow] = useState(false);
  // let userR = null;
  // const krBhava=useSelector(state=> state.user.lang)

  // const options = [
  //   "Oliver Hansen",
  //   "Van Henry",
  //   "April Tucker",
  //   "Ralph Hubbard",
  //   "Omar Alexander",
  //   "Carlos Abbott",
  //   "Miriam Wagner",
  //   "Bradley Wilkerson",
  //   "Virginia Andrews",
  //   "Kelly Snyder"
  // ];

  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  console.log("selected", selected, selected.roleId);
  const isAllSelected =
    roleList.length > 0 && (selected.roleId || []).length === roleList.length;

  let userId = getValues("employeeName");
  const _handleChange = (event, val, index) => {
    console.log(
      "event",
      event.target.value,
      "val",
      val,
      "index",
      index,
      "checked",
      checkedState
    );
    const value = event.target.value;
    let _selected = [...selected];
    let _checkedState = [...checkedState];
    let selectedIndex = _selected.findIndex((txt) => {
      console.log(21, txt, val.id);
      return txt.menuId === val.id;
      // return txt.id === val.id;
    });
    if (selectedIndex > -1) {
      // found roleId ->
      if (value[value.length - 1] === "all") {
        // uncheck select all checkbox
        if (_selected[selectedIndex].roleId.length === roleList.length) {
          // if all selected -> unselect all
          _selected.splice(selectedIndex, 1);
          _checkedState = _checkedState.filter((mid) => mid != val.id);
        } else if (_selected[selectedIndex].roleId.length > 0) {
          // partially selectec -> select all
          _selected[selectedIndex].roleId = roleList.map((val) => val.id);
        }
        setSelected([..._selected]);
        setCheckedState([..._checkedState]);
      } else {
        // if any role is selected when there is atlest one role selected.
        if (_selected[selectedIndex].roleId.includes(value[0])) {
          // remove added role -> uncheck
          _selected[selectedIndex].roleId = _selected[
            selectedIndex
          ].roleId.filter((rid) => rid !== value[0]);

          if (_selected[selectedIndex].roleId.length === 0) {
            _selected.splice(selectedIndex, 1);
            _checkedState = _checkedState.filter((mid) => mid != val.id);
          }
        } else {
          // add newly selected role -> check
          _selected[selectedIndex].roleId = [
            ..._selected[selectedIndex].roleId,
            ...value,
          ];
          // if (_selected[selectedIndex].roleId.length === roleList.length) {
          //   //
          // }
        }
        setSelected([..._selected]);
        setCheckedState([..._checkedState]);
      }
    } else {
      //not found roleId => first time inserting
      if (value[value.length - 1] === "all") {
        setSelected([
          ..._selected,
          {
            menuId: val.id,
            roleId: roleList.map((val) => val.id),
            userId: userId,
          },
        ]);
        if (!_checkedState.includes(val.id)) {
          setCheckedState([..._checkedState, val.id]);
        }
      } else {
        setSelected([
          ..._selected,
          {
            menuId: val.id,
            roleId: value,
            userId: userId,
          },
        ]);
        if (!_checkedState.includes(val.id)) {
          setCheckedState([..._checkedState, val.id]);
        }
      }
    }
  };

  useEffect(() => {
    getDepartmentName();
    getDesignationName();
    getUserName();
    getServiceName();
    getMenuName();
    getRoleName();
    // setLang(krBhava)
  }, []);

  useEffect(() => {
    console.log("router.query", router?.query);
    // if (router?.query?.pageMode === "EDIT") {
    console.log("Hit", router?.query);
    reset(router?.query);
    setValue("departmentName", Number(router?.query?.dept));
    setSelectedDepartment(Number(router?.query?.dept));
    setValue("designationName", Number(router?.query?.desig));
    setSelectedDesignation(Number(router?.query?.desig));
    // let nmr = user?.menus?.find((r) => r.serviceId == 10)?.roles

    // setValue("employeeName", userList.find((f) => f.id == router.query.id)?.firstNameEn);
    setValue(
      "employeeName",
      router?.query?.firstName +
        " " +
        router?.query?.middleName +
        " " +
        router?.query?.lastName
    );
    // setSelectedUser(Number(router?.query?.id));
    setSelectedUser(router?.query?.id);
    // }
  }, []);

  console.log("selectedUser", selectedUser);

  useEffect(() => {
    // if (selectedUser != null) {
    getApplicationsName();
    getSelectedRoleRights();
    // }
  }, [selectedUser]);

  const checkIsChecked = (val, option) => {
    let _selected = [...selected];
    let i = _selected.filter((_role) => _role.menuId == val.id);

    if (i.length > 0) {
      let test = i[0].roleId.indexOf(option.id) > -1;
      return test;
    }
    return false;
  };

  const getDepartmentName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((r) => {
        if (r.status == 200) {
          // console.log("res department", r);
          setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  // Exit Button
  const exitButton = () => {
    router.push("/common/masters/departmentUserList");
  };

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDesignationName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/designation/getAll`)
      .then((r) => {
        console.log("res deg", r);
        if (r.status == 200) {
          setDesignationList(r.data.designation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getMenuName = async () => {
    // setLoading(true);
    // setLoad(true);

    await axios
      .get(`${urls.CFCURL}/master/menu/getAll`)
      .then((r) => {
        // setLoading(false);
        // setLoad(false);

        if (r.status == 200) {
          console.log("res menu", r);
          setMenuList(r.data.menu);
        }
      })
      .catch((err) => {
        // setLoading(false);
        // setLoad(false);

        console.log("err", err);
      });
  };

  const getUserName = async () => {
    // setLoading(true);
    // setLoad(true);

    await axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res user", r);
          // setLoading(false);
          // setLoad(false);

          setUserList(r.data.user);
        }
      })
      .catch((err) => {
        // setLoading(false);
        console.log("err", err);
      });
  };

  const getApplicationsName = async () => {
    await axios
      .get(
        `${urls.CFCURL}/master/application/getByUserId?userId=${selectedUser}`
      )
      .then((r) => {
        if (r.status == 200) {
          console.log("111res application", r.data);
          setApplicationList(r.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getSelectedRoleRights = async () => {
    await axios
      .get(
        `${urls.CFCURL}/master/userRoleMenu/getByUserId?userId=${selectedUser}`
      )
      .then((r) => {
        if (r.status == 200) {
          console.log("res selected role", r);
          setSelectedList(r.data.userRoleMenu);
          // setSelected(r.data.userRoleMenu)
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getRoleName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/mstRole/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res role", r.data.mstRole);
          setRoleList(r.data.mstRole);
          // setRoleList(
          //   r.data.mstRole.map((opt) => {
          //     return opt.name;
          //   })
          // );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const onFinish = async (data) => {
    console.log("data", data);

    // const body = {
    // menuIds: checkedState,
    // applicationId: parseInt(data.applicationName),
    // userId: parseInt(data.userName),
    // roleId: parseInt(data.roleName),
    // departmentId: parseInt(data.departmentName),
    // role: selected,
    // employeeName: parseInt(data.employeeName),

    // id : 27 // first null, in case of edit pass it
    // activeFlag : "Y"
    // };
    // let _body = {
    //   userRoleMenu : selected.map((val) => {
    //     return {
    //       user: val.userId,
    //       role: val.roleId,
    //       menu: val.menuId
    //     }
    //   })
    // }
    let empName = router.query.id;
    let userRoleMenu = [];
    selected.map((val) => {
      console.log("00", val.roleId);
      val.roleId.map((e) =>
        userRoleMenu.push({
          // user: val.userId,
          user: empName,
          role: e,
          menu: val.menuId,
        })
      );
    });

    const body = {
      userRoleMenu: userRoleMenu,
    };

    console.log("userRoleMenu", userRoleMenu);

    swal({
      title: "Confirmation",
      text: "Are you sure you want to submit ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${urls.CFCURL}/master/userRoleMenu/save`, body)
          .then((r) => {
            if (r.status == 200) {
              console.log("res", r);
              router.push("/common/masters/departmentUserList");
              toast("User Role added succesfully!!!", {
                type: "success",
              });
            } else {
              message.error("Please Try Again !");
            }
          })
          .catch((err) => {
            console.log(err);
            toast("Please Try Again !", {
              type: "error",
            });
          });
      }
    });
    // console.log("body", body,"_body",_body);
  };

  const [checkedState, setCheckedState] = useState([]);

  const handleChange = (e, { id, menuNameEng }) => {
    const newCheckedState = [...checkedState];
    let indexOfElement = newCheckedState.indexOf(id);
    let isChecked;
    if (indexOfElement === -1) {
      newCheckedState.push(id);
      isChecked = true;
    } else {
      newCheckedState.splice(indexOfElement, 1);
      isChecked = false;
    }

    if (objj[menuNameEng]) {
      let childIds = objj[menuNameEng].map((_menu) => _menu.id);
      if (isChecked) {
        // to select all child elements if parent is selected
        newCheckedState = [...newCheckedState, ...childIds];
        newCheckedState = [...new Set(newCheckedState)];
      } else {
        // to unselect all child elements if parent is unselected
        newCheckedState = newCheckedState.filter(
          (_id) => !childIds.includes(_id)
        );
      }
    }
    setCheckedState(newCheckedState);
  };

  let res = [];
  let objj = {};
  let arr = [];

  const handleApplicationNameChange = () => {
    // setLoad(true);
    // let selectedApplication = applicationId;
    console.log("selectedApplication", selectedApplicationR);

    let abc = menuList.filter((val) => {
      return val.appId === selectedApplicationR;
    });

    arr = menuList.filter((val) => {
      return val.isParent === "Y";
    });

    arr.map((val) => {
      let childEle = abc.filter((value) => {
        return val.id == value.parentId;
      });

      objj[val.menuNameEng] = childEle;

      res.push(val);
      res.push(...childEle);

      return val;
    });

    setTestArray({ res: [...res], objj: { ...objj } });
    // setLoad(false);
  };

  const getSelectedRoleValue = (val) => {
    return selected.roleId || [];
    // const { roleId, menuId } = selected;
    // return roleId.filter((_role) => {
    //   console.log("432", _role, _role.menuId == val.id);
    //   return menuId == val.id;
    // });

    // .roleId?.map((val) => val) || [];
  };

  const checkIsAllSelected = (val) => {
    const _selected = [...selected];
    let selectedIndex = _selected.findIndex((txt) => {
      return txt.menuId === val.id;
    });
    if (selectedIndex > -1)
      return _selected[selectedIndex].roleId.length === roleList.length;

    return false;
  };

  const checkIsIntermediate = (val) => {
    const _selected = [...selected];
    let selectedIndex = _selected.findIndex((txt) => {
      return txt.menuId === val.id;
    });

    if (selectedIndex > -1) {
      return _selected[selectedIndex].roleId.length != roleList.length;
    }

    return false;
  };

  return (
    <form onSubmit={handleSubmit(onFinish)}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        {loading && <Loader />}
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
        <AppBar position='static' sx={{ backgroundColor: "#FBFCFC " }}>
          <Toolbar variant='dense'>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{
                mr: 2,
                color: "#2980B9",
              }}
            >
              <ArrowBackIcon
                onClick={() =>
                  router.push({
                    pathname: "/common/masters/userRoleRight",
                  })
                }
              />
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
              {/* {<FormattedLabel id="emergencyServicesFirstVardiAhawal" />} */}
              User Role Right
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
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={styles.feildres}
        >
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
              sx={{ width: "86%" }}
              size='small'
              id='outlined-basic'
              // label={<FormattedLabel id="employeeCode" />}
              label='Emplyee Name'
              // readonly={employeeName}
              // value={router.query.employeeCode ? router.query.employeeCode : employeeCodeState}
              variant='outlined'
              style={{ backgroundColor: "white" }}
              {...register("employeeName")}
            />
            {/* <TextField
                sx={{ width: "86%" }}
                size="small"
                id="outlined-basic"
                variant="standard"
                readonly
                {...register("employeeName")}
                error={errors.employeeName}
                helperText={errors.employeeName?.message}
              /> */}
          </Grid>
          <Grid item xs={4} className={styles.feildres}>
            <FormControl size='small' sx={{ m: 1, width: "86%" }}>
              <InputLabel id='demo-simple-select-standard-label'>
                Application Name
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    style={{ backgroundColor: "white" }}
                    variant='outlined'
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Application Name'
                    value={field.value}
                    // {...register("applicationName")}
                    // onChange={(value) => field.onChange(value)}
                    onChange={(value) => {
                      // console.log("value", value);
                      field.onChange(value);
                      setSelectedApplicationR(value.target.value);
                    }}
                  >
                    {applicationList.length > 0 ? (
                      applicationList.map((application, index) => {
                        return (
                          <MenuItem key={index} value={application.id}>
                            {application.applicationNameEng}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem
                        sx={{
                          border: "1px solid red",
                          color: "red",
                          borderRadius: "100px",
                          backgroundColor: "#D5DBDB",
                        }}
                        value=''
                      >
                        {language === "en"
                          ? router?.query?.firstName +
                            " " +
                            router?.query?.lastName +
                            " " +
                            "does not have access for menu"
                          : router?.query?.firstName +
                            " " +
                            router?.query?.lastName +
                            " " +
                            "याला मेनूसाठी प्रवेश नाही"}
                      </MenuItem>
                    )}
                  </Select>
                )}
                name='applicationName'
                control={control}
                defaultValue=''
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.applicationName
                  ? errors.applicationName.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container>
        {/* <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
           <FormControl size="small" sx={{ m: 1, width: "86%" }}>
              <InputLabel id="demo-simple-select-standard-label">Department Name</InputLabel>
  
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
                      setSelectedDepartment(value.target.value);
                      // handleRoleNameChange(value);
                    }}
                    style={{ backgroundColor: "white" }}
                  >
                    {departmentList.length > 0
                      ? departmentList.map((department, index) => {
                          return (
                            <MenuItem key={index} value={department.id}>
                              {lang === "en" ? department.department : department.departmentMr}
                            </MenuItem>
                          );
                        })
                      : []}
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
          </Grid>*/}

        {/*  <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
           <FormControl size="small" sx={{ m: 1, width: "86%" }}>
              <InputLabel id="demo-simple-select-standard-label">Designation Name</InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Designation Name"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value), setSelectedDesignation(value.target.value);
                    }}
                    style={{ backgroundColor: "white" }}
                  >
                    {designationList.length > 0
                      ? designationList
                          .filter((designation) => designation.departmentId === selectedDepartment)
                          .map((designation, index) => {
                            return (
                              <MenuItem key={index} value={designation.id}>
                                {designation.designation}
                              </MenuItem>
                            );
                          })
                      : []}
                  </Select>
                )}
                name="designationName"
                control={control}
                defaultValue=""
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.designationName ? errors.designationName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

        {/* <Grid item xs={3}> */}
        {/* <FormControl size="small" sx={{ m: 1, width: "86%" }}>
              <InputLabel id="demo-simple-select-standard-label">Employee Name</InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Employee Name"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value), setSelectedUser(value.target.value);
                      // userR = userList.filter((u) => u.id === value.target.value),
                      // console.log("userR",userR);
                    }}
                    style={{ backgroundColor: "white" }}
                  >
                    {userList.length > 0
                      ? userList
                          // .filter((user) => {
                          //   if (
                          //     // user.department === selectedDepartment &&
                          //     // user.designation === selectedDesignation
                          //     selectedDepartment &&
                          //     selectedDesignation &&
                          //     user.department === selectedDepartment &&
                          //     user.designation === selectedDesignation
                          //   ) {
                          //     return user;
                          //   } else {
                          //     return user;
                          //   }
                          // })
                          .map((user, index) => {
                            return (
                              <MenuItem key={index} value={user.id}>
                                {user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn}
                              </MenuItem>
                            );
                          })
                      : []}
                  </Select>
                )}
                name="employeeName"
                control={control}
                defaultValue=""
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.employeeName ? errors.employeeName.message : null}
              </FormHelperText>
            </FormControl> */}

        {/* </Grid> */}

        {/* <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
              <FormControl size="small" sx={{ m: 1, width: "86%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Service Name
                </InputLabel>
    
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
                        setSelectedService(value.target.value);
                        // handleRoleNameChange(value);
                      }}
                      style={{ backgroundColor: "white" }}
                    >
                      {serviceList.length > 0
                        ? serviceList.filter((service)=>service.application===selectedApplicationR).map((service, index) => {
                            return (
                              <MenuItem key={index} value={service.id}>
                                {service.serviceName}
                              </MenuItem>
                            );
                          })
                        : "NA"}
                    </Select>
                  )}
                  name="serviceName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText style={{ color: "red" }}>
                  {errors?.roleName ? errors.roleName.message : null}
                </FormHelperText>
              </FormControl>
            </Grid> */}
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "5px",
        }}
      >
        <Button
          onClick={() => {
            handleApplicationNameChange();
            setButtonShow(true);
          }}
          variant='contained'
          sx={{ backgroundColor: "#3C8DBC" }}
          size='small'
        >
          Search
        </Button>
      </Grid>

      {
        testArray && (
          <Paper>
            <Grid
              container
              style={{
                // backgroundColor: "#D3D3D3",
                backgroundColor: "white",
                // height: "290px",
                // overflow: "auto",
              }}
            >
              {testArray.res &&
                testArray.res.map((text, index) => {
                  return (
                    <>
                      {text.isParent !== null && (
                        <>
                          <Grid
                            item
                            xs={3}
                            // style={{
                            //   display: "flex",
                            //   // justifyContent: "center",
                            //   flexDirection: "column",
                            //   // border: "1px solid green",
                            // }}
                            key={index}
                          >
                            <FormGroup>
                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "10px",
                                  backgroundColor: "#2980B9",
                                  color: "white",
                                }}
                              >
                                <Grid container>
                                  <Grid
                                    xs={2}
                                    item
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {/* <Checkbox
                                      checked={checkedState.indexOf(text.id) >= 0}
                                      onChange={(e) => {
                                        handleChange(e, text);
                                      }}
                                    /> */}
                                  </Grid>

                                  <Grid
                                    item
                                    xs={5}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      style={{ fontWeight: "normal" }}
                                    >
                                      {text.menuNameEng}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={5}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "normal",
                                        marginLeft: "60px",
                                      }}
                                    >
                                      Role
                                    </Typography>
                                  </Grid>
                                  {/* {text.parentId == 3 ? (
                           
                                ) : (
                                  <></>
                                )} */}
                                </Grid>
                                {/* <FormControlLabel
                              control={
                                <Checkbox
                                  checked={checkedState.indexOf(text.id) >= 0}
                                  onChange={(e) => {
                                    console.log("id", text.id, text);
                                    handleChange(e, text);
                                  }}
                                />
                              }
                              label={text.menuNameEng}
                            /> */}
                              </Box>
                            </FormGroup>
                            <Divider />

                            {testArray.res
                              .filter((val) => val.isParent === "Y")
                              .map((abc, index) => {
                                return testArray.objj[abc.menuNameEng].map(
                                  (val, id) => {
                                    return (
                                      val.parentId == text.id && (
                                        <FormGroup
                                          sx={{
                                            backgroundColor:
                                              (val.parentId == 3 &&
                                                "#AED6F1") ||
                                              val.parentId == 1
                                                ? "#AED6F1"
                                                : "#D5F5E3",
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "2px solid white",
                                          }}
                                        >
                                          <Grid
                                            container
                                            style={{
                                              padding: "5px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <Grid
                                              xs={2}
                                              item
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Checkbox
                                                sx={{
                                                  backgroundColor: "white",
                                                  marginRight: "20px",
                                                  marginLeft: "5px",
                                                  padding: "2px",
                                                }}
                                                checked={
                                                  checkedState.indexOf(val.id) >
                                                  -1
                                                }
                                                // checked={checkedState.indexOf(val.id) >= 0}

                                                // checked={checkedState.indexOf(val.id) > -1}
                                                // checked={selectedModuleName.indexOf(name.applicationNameEng) > -1}
                                                onChange={(e) => {
                                                  handleChange(e, val);
                                                }}
                                              />
                                            </Grid>
                                            <Grid
                                              item
                                              xs={6}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Typography>
                                                {val.menuNameEng}
                                              </Typography>
                                            </Grid>
                                            <Grid
                                              item
                                              xs={4}
                                              style={{ padding: "5px" }}
                                            >
                                              <FormControl
                                                fullWidth
                                                size='small'
                                              >
                                                <InputLabel id='mutiple-select-label'>
                                                  Roles
                                                </InputLabel>
                                                <Select
                                                  sx={{
                                                    width: "100%",
                                                    backgroundColor: "white",
                                                  }}
                                                  // size="small"
                                                  key={"role_" + index}
                                                  labelId='mutiple-select-label'
                                                  multiple
                                                  label='Roles'
                                                  value={getSelectedRoleValue(
                                                    val
                                                  )}
                                                  // value={
                                                  //   selected.filter(
                                                  //     (_role) => {
                                                  //      return _role.menuId == val.id
                                                  //     }
                                                  //   ).roleId || []
                                                  // }
                                                  onChange={(event) => {
                                                    _handleChange(
                                                      event,
                                                      val,
                                                      id
                                                    );
                                                  }}
                                                  renderValue={(selected) =>
                                                    selected.join(", ")
                                                  }
                                                  MenuProps={MenuProps}
                                                >
                                                  <MenuItem
                                                    value='all'
                                                    key={"mt_" + index}
                                                    classes={{
                                                      root: checkIsAllSelected(
                                                        val
                                                      )
                                                        ? classes.selectedAll
                                                        : classes.container,
                                                    }}
                                                  >
                                                    <ListItemIcon>
                                                      <Checkbox
                                                        classes={{
                                                          indeterminate:
                                                            classes.indeterminateColor,
                                                        }}
                                                        checked={checkIsAllSelected(
                                                          val
                                                        )}
                                                        indeterminate={checkIsIntermediate(
                                                          val
                                                        )}
                                                        // indeterminate={
                                                        //   selected.length > 0 &&
                                                        //   selected.length <
                                                        //     roleList.length
                                                        // }
                                                      />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                      classes={{
                                                        primary:
                                                          classes.selectAllText,
                                                      }}
                                                      primary='Select All'
                                                    />
                                                  </MenuItem>

                                                  {roleList.map(
                                                    (option, index) => (
                                                      <MenuItem
                                                        key={index}
                                                        value={option.id}
                                                        sx={{
                                                          padding: 0,
                                                          border:
                                                            "1px solid red",
                                                        }}
                                                      >
                                                        <ListItemIcon>
                                                          <Checkbox
                                                            key={"CH" + index}
                                                            checked={
                                                              // selected.indexOf(
                                                              //   option.id
                                                              // ) > -1
                                                              checkIsChecked(
                                                                val,
                                                                option
                                                              )
                                                            }
                                                          />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                          primary={option.name}
                                                        />
                                                      </MenuItem>
                                                    )
                                                  )}
                                                </Select>
                                              </FormControl>
                                              {/* <FormControl size="small" fullWidth>
                                                <InputLabel id="demo-simple-select-standard-label">
                                                  Role
                                                </InputLabel>
    
                                                <Controller
                                                  render={({ field }) => (
                                                    <Select
                                                      labelId="demo-simple-select-label"
                                                      id="demo-simple-select"
                                                      label="Role"
                                                      value={field.value}
                                                      onChange={(value) => {
                                                        field.onChange(value);
                                                      }}
                                                      style={{
                                                        backgroundColor: "white",
                                                      }}
                                                    >
                                                      {roleList.length > 0
                                                        ? roleList.map(
                                                            (role, index) => {
                                                              return (
                                                                <MenuItem
                                                                  key={index}
                                                                  value={role.id}
                                                                >
                                                                  {role.name}
                                                                </MenuItem>
                                                              );
                                                            }
                                                          )
                                                        : "NA"}
                                                    </Select>
                                                  )}
                                                  name="roleName"
                                                  control={control}
                                                  defaultValue=""
                                                />
                                                <FormHelperText
                                                  style={{ color: "red" }}
                                                >
                                                  {errors?.roleName
                                                    ? errors.roleName.message
                                                    : null}
                                                </FormHelperText>
                                              </FormControl> */}
                                            </Grid>
                                            {/* {val.parentId == 3 ? (
                                          <>
                                            
                                          </>
                                        ) : (
                                          <></>
                                        )} */}

                                            {/* <Divider style={{ width: "100%" }} /> */}
                                          </Grid>
                                        </FormGroup>

                                        // <FormControlLabel
                                        //   style={{
                                        //     border: "1px solid red",
                                        //     width: "100%",
                                        //     display: "flex",
                                        //   }}
                                        //   control={
                                        //     <Checkbox
                                        //       checked={checkedState.indexOf(val.id) >= 0}
                                        //       onChange={(e) => {
                                        //         console.log("id", id, val);
                                        //         handleChange(e, val);
                                        //       }}
                                        //     />
                                        //   }
                                        //   label={val.menuNameEng}
                                        // />
                                      )
                                    );
                                  }
                                );
                              })}
                          </Grid>
                          <Divider
                            orientation='vertical'
                            variant='middle'
                            flexItem
                            sx={{ mr: "-1px" }}
                          />
                        </>
                      )}
                    </>
                  );
                })}
            </Grid>
            {buttonShow == true ? (
              <>
                <br />
                <br />
                <Grid container className={styles.feildres} spacing={2}>
                  <Grid item>
                    <Button
                      endIcon={<SaveIcon />}
                      variant='contained'
                      type='submit'
                      size='small'
                      sx={{
                        backgroundColor: "#00A65A",
                        textTransform: "capitalize",
                      }}
                    >
                      <FormattedLabel id='Save' />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      endIcon={<ClearIcon />}
                      size='small'
                      variant='contained'
                      sx={{
                        backgroundColor: "#3C8DBC",
                        textTransform: "capitalize",
                      }}
                    >
                      <FormattedLabel id='clear' />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      endIcon={<ExitToAppIcon />}
                      size='small'
                      variant='contained'
                      onClick={() => exitButton()}
                      sx={{
                        backgroundColor: "#DD4B39",
                        textTransform: "capitalize",
                      }}
                    >
                      <FormattedLabel id='exit' />
                    </Button>
                  </Grid>
                </Grid>
                <br />
                <br />
              </>
            ) : (
              <></>
            )}
          </Paper>
        )
        //  : (
        //   <>Please Choose Application Name then Search</>
        // )
      }
    </form>
  );
};

export default UserRoleRight;
