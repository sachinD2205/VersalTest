import React from 'react'

const UserRoleRightCopy = () => {
  return (
    <div>UserRoleRightCopy</div>
  )
}

export default UserRoleRightCopy

// import {
//   Box,
//   Button,
//   Checkbox,
//   Divider,
//   FormControl,
//   FormGroup,
//   FormHelperText,
//   Grid,
//   InputLabel,
//   ListItemIcon,
//   ListItemText,
//   MenuItem,
//   Select,
//   Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "../../../containers/schema/UserRoleRightSchema";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loader from "../../../containers/Layout/components/Loader";
// import { Controller, useForm, FormProvider } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { MenuProps, useStyles } from "../../../containers/utils/UserRoleRightUtils";
// import styles from "../../../styles/[UserRoleRight].module.css";
// import urls from "../../../URLS/urls";
// import BasicLayout from "../../../containers/Layout/BasicLayout";
// import { useRouter } from "next/router";

// const UserRoleRight = () => {
//   const {
//     control,
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     methods,
//     getValues,
//     formState: { errors },
//   } = useForm({ resolver: yupResolver(schema) });

//   const [departmentList, setDepartmentList] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [selectedDesignation, setSelectedDesignation] = useState(null);
//   const [selectedApplicationR, setSelectedApplicationR] = useState(null);
//   const [selectedService, setSelectedService] = useState(null);
//   const [selectedUser, setSelectedUser] = useState();
//   const [serviceList, setServiceList] = useState([]);
//   const [employee, setEmployeeName] = useState([]);
//   const [userList, setUserList] = useState([]);
//   const [applicationList, setApplicationList] = useState([]);
//   const applicationName = watch("applicationName");
//   const [roleList, setRoleList] = useState([]);
//   const [menuList, setMenuList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [lang, setLang] = useState(null);
//   const roleName = watch("roleName");
//   const [testArray, setTestArray] = useState({ res: [], objj: [] });
//   // let userR = null;
//   // const krBhava=useSelector(state=> state.user.lang)

//   // const options = [
//   //   "Oliver Hansen",
//   //   "Van Henry",
//   //   "April Tucker",
//   //   "Ralph Hubbard",
//   //   "Omar Alexander",
//   //   "Carlos Abbott",
//   //   "Miriam Wagner",
//   //   "Bradley Wilkerson",
//   //   "Virginia Andrews",
//   //   "Kelly Snyder"
//   // ];

//   const router = useRouter();

//   // useEffect(() => {
//   //   if (router.query.pageMode == "Edit") {
//   //     console.log("router.query", router.query);
//   //     reset(router.query);
//   //   }
//   // }, []);

//   const classes = useStyles();
//   const [selected, setSelected] = useState([]);
//   console.log("selected", selected);
//   const isAllSelected = roleList.length > 0 && selected.length === roleList.length;

//   let userId = getValues("employeeName");
//   const _handleChange = (event, val, index) => {
//     console.log("event", event.target.value, "val", val, "index", index, "checked", checkedState);
//     const value = event.target.value;
//     const _selected = [...selected];
//     const _checkedState = [...checkedState];
//     let selectedIndex = _selected.findIndex((txt) => {
//       console.log(21, txt, val.id);
//       return txt.menuId === val.id;
//       // return txt.id === val.id;
//     });
//     if (selectedIndex > -1) {
//       // found roleId ->
//       if (value[value.length - 1] === "all") {
//         // uncheck select all checkbox
//         if (_selected[selectedIndex].roleId.length === roleList.length) {
//           // if all selected -> unselect all
//           _selected.splice(selectedIndex, 1);
//           _checkedState = _checkedState.filter((mid) => mid != val.id);
//         } else if (_selected[selectedIndex].roleId.length > 0) {
//           // partially selectec -> select all
//           _selected[selectedIndex].roleId = roleList.map((val) => val.id);
//         }
//         setSelected([..._selected]);
//         setCheckedState([..._checkedState]);
//       } else {
//         // if any role is selected when there is atlest one role selected.
//         if (_selected[selectedIndex].roleId.includes(value[0])) {
//           // remove added role -> uncheck
//           _selected[selectedIndex].roleId = _selected[selectedIndex].roleId.filter((rid) => rid !== value[0]);

//           if (_selected[selectedIndex].roleId.length === 0) {
//             _selected.splice(selectedIndex, 1);
//             _checkedState = _checkedState.filter((mid) => mid != val.id);
//           }
//         } else {
//           // add newly selected role -> check
//           _selected[selectedIndex].roleId = [..._selected[selectedIndex].roleId, ...value];
//           // if (_selected[selectedIndex].roleId.length === roleList.length) {
//           //   //
//           // }
//         }
//         setSelected([..._selected]);
//         setCheckedState([..._checkedState]);
//       }
//     } else {
//       //not found roleId => first time inserting
//       if (value[value.length - 1] === "all") {
//         setSelected([
//           ..._selected,
//           {
//             menuId: val.id,
//             roleId: roleList.map((val) => val.id),
//             userId: userId,
//           },
//         ]);
//         if (!_checkedState.includes(val.id)) {
//           setCheckedState([..._checkedState, val.id]);
//         }
//       } else {
//         setSelected([
//           ..._selected,
//           {
//             menuId: val.id,
//             roleId: value,
//             userId: userId,
//           },
//         ]);
//         if (!_checkedState.includes(val.id)) {
//           setCheckedState([..._checkedState, val.id]);
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     getDepartmentName();
//     getEmployeeName();
//     // getSubDepartmentName();
//     // getUserName();
//     // getServiceName();
//     // getMenuName();
//     // getRoleName();
//     // setLang(krBhava)
//   }, []);

//   const checkIsChecked = (val, option) => {
//     console.log("check is checked", selected);
//     const _selected = [...selected];
//     let i = _selected.filter((_role) => _role.menuId == val.id);

//     if (i.length > 0) {
//       let test = i[0].roleId.indexOf(option.id) > -1;
//       return test;
//     }
//     return false;
//   };

//   const getDepartmentName = async () => {
//     await axios
//       .get(`${urls.CFCURL}/master/department/getAll`)

//       .then((r) => {
//         if (r.status == 200) {
//           // console.log("res department", r);
//           setDepartmentList(r.data.department);
//         }
//       })
//       .catch((err) => {
//         console.log("err", err);
//       });
//   };

//   // const getServiceName = async () => {
//   //   await axios
//   //     .get(`${urls.CFCURL}/master/service/getAll`)

//   //     .then((r) => {
//   //       if (r.status == 200) {
//   //         setServiceList(r.data.service);
//   //       }
//   //     })
//   //     .catch((err) => {
//   //       control.log("err", err);
//   //     });
//   // };

//   // const getSubDepartmentName = async () => {
//   //   await axios
//   //     .get(`${urls.CFCURL}/master/employeeName/getAll`)
//   //     .then((r) => {
//   //       if (r.status == 200) {
//   //         setSubDepartmentName(r.data.employeeName);
//   //       }
//   //     })
//   //     .catch((err) => {
//   //       control.log("err", err);
//   //     });
//   // };

//   // const getMenuName = async () => {
//   //   // setLoading(true);
//   //   await axios
//   //     .get(`${urls.CFCURL}/master/menu/getAll`)
//   //     .then((r) => {
//   //       setLoading(false);
//   //       if (r.status == 200) {
//   //         console.log("res menu", r);
//   //         setMenuList(r.data.menu);
//   //       }
//   //     })
//   //     .catch((err) => {
//   //       setLoading(false);
//   //       console.log("err", err);
//   //     });
//   // };

//   // const getUserName = async () => {
//   //   // setLoading(true);
//   //   await axios
//   //     .get(`${urls.CFCURL}/master/user/getAll`)
//   //     .then((r) => {
//   //       if (r.status == 200) {
//   //         // console.log("res designation", r);
//   //         setLoading(false);
//   //         setUserList(r.data);
//   //       }
//   //     })
//   //     .catch((err) => {
//   //       setLoading(false);
//   //       console.log("err", err);
//   //     });
//   // };

//   // const getApplicationsName = async (value) => {
//   //   await axios
//   //     .get(
//   //       `${urls.CFCURL}/master/application/getByUserId?userId=${value}`
//   //     )
//   //     .then((r) => {
//   //       if (r.status == 200) {
//   //         console.log("res application", r);
//   //         setApplicationList(r.data);
//   //       }
//   //     })
//   //     .catch((err) => {
//   //       console.log("err", err);
//   //     });
//   // };

//   // const getRoleName = async () => {
//   //   await axios
//   //     .get(`${urls.CFCURL}/master/mstRole/getAll`)
//   //     .then((r) => {
//   //       if (r.status == 200) {
//   //         console.log("res role", r.data.mstRole);
//   //         setRoleList(r.data.mstRole);
//   //         // setRoleList(
//   //         //   r.data.mstRole.map((opt) => {
//   //         //     return opt.name;
//   //         //   })
//   //         // );
//   //       }
//   //     })
//   //     .catch((err) => {
//   //       console.log("err", err);
//   //     });
//   // };

//   const getEmployeeName = async () => {
//     await axios
//       .get(`${urls.CFCURL}/master/employee/getAll`)
//       .then((r) => {
//         if (r.status == 200) {
//           setEmployeeName(r.data.employee);
//         }
//       })
//       .catch((err) => {
//         // control.log("err", err);
//       });
//   };

//   const onFinish = async (data) => {
//     console.log("data", data);

//     const body = {
//       // menuIds: checkedState,
//       // applicationId: parseInt(data.applicationName),
//       // userId: parseInt(data.userName),
//       // roleId: parseInt(data.roleName),
//       departmentId: parseInt(data.departmentName),
//       // role: selected,
//       employeeName: parseInt(data.employeeName),
//       id: data.id,
//       activeFlag: data.activeFlag,
//       // user menu role 1
//       // user menu role 2

//       // id : 27 // first null, in case of edit pass it
//       // user : 1 // employee ID
//       // role : 2 // role  roel ID
//       // menu : 15 // new MR registration
//       // activeFlag : "Y"
//     };
//     console.log("body", body);

//     await axios
//       .post(`${urls.CFCURL}/master/userAuthenticationAndRoleRights/save`, body)

//       //  "http://localhost:8090/cfc/api/master/userRoleMenu/save"
//       .then((r) => {
//         if (r.status == 200) {
//           console.log("res", r);
//         } else {
//           message.error("Login Failed ! Please Try Again !");
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         toast("Login Failed ! Please Try Again !", {
//           type: "error",
//         });
//       });
//   };

//   const [checkedState, setCheckedState] = useState([]);

//   const handleChange = (e, { id, menuNameEng }) => {
//     const newCheckedState = [...checkedState];
//     let indexOfElement = newCheckedState.indexOf(id);
//     let isChecked;
//     if (indexOfElement === -1) {
//       newCheckedState.push(id);
//       isChecked = true;
//     } else {
//       newCheckedState.splice(indexOfElement, 1);
//       isChecked = false;
//     }

//     if (objj[menuNameEng]) {
//       let childIds = objj[menuNameEng].map((_menu) => _menu.id);
//       if (isChecked) {
//         // to select all child elements if parent is selected
//         newCheckedState = [...newCheckedState, ...childIds];
//         newCheckedState = [...new Set(newCheckedState)];
//       } else {
//         // to unselect all child elements if parent is unselected
//         newCheckedState = newCheckedState.filter((_id) => !childIds.includes(_id));
//       }
//     }
//     setCheckedState(newCheckedState);
//   };

//   // useEffect(() => {
//   //   console.log("123selected", selected);
//   //   //do something here with personName
//   // }, [selected]);

//   // const handleRoleNameChange = (value) => {
//   //   console.log("value22", value);
//   // };

//   let res = [];
//   let objj = {};
//   let arr = [];

//   const handleApplicationNameChange = () => {
//     // let selectedApplication = applicationId;
//     console.log("selectedApplication", selectedApplicationR);

//     let abc = menuList.filter((val) => {
//       return val.appId === selectedApplicationR;
//     });

//     arr = menuList.filter((val) => {
//       return val.isParent === "Y";
//     });

//     arr.map((val) => {
//       let childEle = abc.filter((value) => {
//         return val.id == value.parentId;
//       });

//       objj[val.menuNameEng] = childEle;

//       res.push(val);
//       res.push(...childEle);

//       return val;
//     });

//     setTestArray({ res: [...res], objj: { ...objj } });
//   };

//   const getSelectedRoleValue = (val) => {
//     console.log("selected role", selected);
//     return selected.roleId || [];
//     // const { roleId, menuId } = selected;
//     // return roleId.filter((_role) => {
//     //   console.log("432", _role, _role.menuId == val.id);
//     //   return menuId == val.id;
//     // });

//     // .roleId?.map((val) => val) || [];
//   };
//   return (
//     <>
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onFinish)}>
//           <Box
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               padding: "10px",
//             }}
//           >
//             {loading && <Loader />}
//           </Box>

//           <Grid container>
//             <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
//               <FormControl size="small" sx={{ m: 1, width: "50%" }}>
//                 <InputLabel id="demo-simple-select-standard-label">Department Name</InputLabel>

//                 <Controller
//                   render={({ field }) => (
//                     <Select
//                       labelId="demo-simple-select-label"
//                       id="demo-simple-select"
//                       label="Department Name"
//                       value={field.value}
//                       // onChange={(value) => field.onChange(value)}
//                       onChange={(value) => {
//                         field.onChange(value);
//                         setSelectedDepartment(value.target.value);
//                         // handleRoleNameChange(value);
//                       }}
//                       style={{ backgroundColor: "white" }}
//                     >
//                       {departmentList.length > 0
//                         ? departmentList.map((department, index) => {
//                             return (
//                               <MenuItem key={index} value={department.id}>
//                                 {lang === "en" ? department.department : department.departmentMr}
//                               </MenuItem>
//                             );
//                           })
//                         : "NA"}
//                     </Select>
//                   )}
//                   name="department"
//                   control={control}
//                   defaultValue=""
//                 />
//                 <FormHelperText style={{ color: "red" }}>
//                   {errors?.departmentName ? errors.departmentName.message : null}
//                 </FormHelperText>
//               </FormControl>
//             </Grid>
//             <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
//               <FormControl size="small" sx={{ m: 1, width: "50%" }}>
//                 <InputLabel id="demo-simple-select-standard-label">employeeName</InputLabel>

//                 <Controller
//                   render={({ field }) => (
//                     <Select
//                       labelId="demo-simple-select-label"
//                       id="demo-simple-select"
//                       label="employeeName"
//                       value={field.value}
//                       // onChange={(value) => field.onChange(value)}
//                       onChange={(value) => {
//                         field.onChange(value);
//                         setSelectedDepartment(value.target.value);
//                         // handleRoleNameChange(value);
//                       }}
//                       style={{ backgroundColor: "white" }}
//                     >
//                       {employee.length > 0
//                         ? employee.map((employeeName, index) => {
//                             return (
//                               <MenuItem key={index} value={employeeName.id}>
//                                 {lang === "en" ? employeeName.employeeName : employeeName.employeeNameMr}
//                               </MenuItem>
//                             );
//                           })
//                         : "NA"}
//                     </Select>
//                   )}
//                   name="employee"
//                   control={control}
//                   defaultValue=""
//                 />
//                 <FormHelperText style={{ color: "red" }}>
//                   {errors?.employee ? errors.employee.message : null}
//                 </FormHelperText>
//               </FormControl>
//             </Grid>

//             {/* <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
//           <FormControl size="small" sx={{ m: 1, width: "50%" }}>
//             <InputLabel id="demo-simple-select-standard-label">
//               Employee Name
//             </InputLabel>
//             <Controller
//               render={({ field }) => (
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   label="Employee Name"
//                   value={field.value}
//                   // {...register("applicationName")}
//                   onChange={(value) => {
//                     field.onChange(value),
//                       getApplicationsName(value.target.value);
//                     // userR = userList.filter((u) => u.id === value.target.value),
//                     // console.log("userR",userR);
//                   }}
//                   style={{ backgroundColor: "white" }}
//                 >
//                   {userList.length > 0
//                     ? userList
//                         .filter((user) => {
//                           if (
//                             user.department === selectedDepartment &&
//                             user.designation === selectedDesignation
//                           ) {
//                             return user;
//                           }
//                         })
//                         .map((user, index) => {
//                           return (
//                             <MenuItem key={index} value={user.id}>
//                               {user.firstNameEn +
//                                 " " +
//                                 user.middleNameEn +
//                                 " " +
//                                 user.lastNameEn}
//                             </MenuItem>
//                           );
//                         })
//                     : "NA"}
//                 </Select>
//               )}
//               name="employeeName"
//               control={control}
//               defaultValue=""
//             />
//             <FormHelperText style={{ color: "red" }}>
//               {errors?.employeeName ? errors.employeeName.message : null}
//             </FormHelperText>
//           </FormControl>
//         </Grid> */}

//             {/* 
//         <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
//           <FormControl size="small" sx={{ m: 1, width: "50%" }}>
//             <InputLabel id="demo-simple-select-standard-label">
//             Module Name
//             </InputLabel>
//             <Controller
//               render={({ field }) => (
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   label="Module Name"
//                   value={field.value}
//                   // {...register("applicationName")}
//                   // onChange={(value) => field.onChange(value)}
//                   onChange={(value) => {
//                     // console.log("value", value);
//                     field.onChange(value);
//                     setSelectedApplicationR(value.target.value);
//                   }}
//                   style={{ backgroundColor: "white" }}
//                 >
//                   {applicationList.length > 0
//                     ? applicationList.map((application, index) => {
//                         return (
//                           <MenuItem key={index} value={application.id}>
//                             {application.applicationNameEng}
//                           </MenuItem>
//                         );
//                       })
//                     : "NA"}
//                 </Select>
//               )}
//               name="applicationName"
//               control={control}
//               defaultValue=""
//             />
//             <FormHelperText style={{ color: "red" }}>
//               {errors?.applicationName ? errors.applicationName.message : null}
//             </FormHelperText>
//           </FormControl>
//         </Grid> */}
//             {/* <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
//           <FormControl size="small" sx={{ m: 1, width: "50%" }}>
//             <InputLabel id="demo-simple-select-standard-label">
//               Service Name
//             </InputLabel>

//             <Controller
//               render={({ field }) => (
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   label="Service Name"
//                   value={field.value}
//                   // onChange={(value) => field.onChange(value)}
//                   onChange={(value) => {
//                     field.onChange(value);
//                     setSelectedService(value.target.value);
//                     // handleRoleNameChange(value);
//                   }}
//                   style={{ backgroundColor: "white" }}
//                 >
//                   {serviceList.length > 0
//                     ? serviceList.filter((service)=>service.application===selectedApplicationR).map((service, index) => {
//                         return (
//                           <MenuItem key={index} value={service.id}>
//                             {service.serviceName}
//                           </MenuItem>
//                         );
//                       })
//                     : "NA"}
//                 </Select>
//               )}
//               name="serviceName"
//               control={control}
//               defaultValue=""
//             />
//             <FormHelperText style={{ color: "red" }}>
//               {errors?.roleName ? errors.roleName.message : null}
//             </FormHelperText>
//           </FormControl>
//         </Grid> */}
//           </Grid>
//           <Grid
//             item
//             xs={12}
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               padding: "5px",
//             }}
//           >
//             <Button
//               onClick={() => handleApplicationNameChange()}
//               variant="contained"
//               sx={{ backgroundColor: "#3C8DBC" }}
//               size="small"
//             >
//               Search
//             </Button>
//           </Grid>

//           {testArray && (
//             <Grid
//               container
//               style={{
//                 backgroundColor: "#D3D3D3",
//                 height: "290px",
//                 overflow: "auto",
//               }}
//             >
//               {testArray.res &&
//                 testArray.res.map((text, index) => {
//                   return (
//                     <>
//                       {text.isParent !== null && (
//                         <>
//                           <Grid
//                             item
//                             xs={3}
//                             // style={{
//                             //   display: "flex",
//                             //   // justifyContent: "center",
//                             //   flexDirection: "column",
//                             //   // border: "1px solid green",
//                             // }}
//                             key={index}
//                           >
//                             <FormGroup>
//                               <Box
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 <Grid container>
//                                   <Grid
//                                     xs={2}
//                                     item
//                                     style={{
//                                       display: "flex",
//                                       justifyContent: "center",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <Checkbox
//                                       checked={checkedState.indexOf(text.id) >= 0}
//                                       onChange={(e) => {
//                                         handleChange(e, text);
//                                       }}
//                                     />
//                                   </Grid>
//                                   <Grid
//                                     item
//                                     xs={5}
//                                     style={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <Typography style={{ fontWeight: "900" }}>{text.menuNameEng}</Typography>
//                                   </Grid>
//                                   <Grid
//                                     item
//                                     xs={5}
//                                     style={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <Typography
//                                       style={{
//                                         fontWeight: "900",
//                                         marginLeft: "10px",
//                                       }}
//                                     >
//                                       Role
//                                     </Typography>
//                                   </Grid>
//                                 </Grid>
//                                 {/* <FormControlLabel
//                           control={
//                             <Checkbox
//                               checked={checkedState.indexOf(text.id) >= 0}
//                               onChange={(e) => {
//                                 console.log("id", text.id, text);
//                                 handleChange(e, text);
//                               }}
//                             />
//                           }
//                           label={text.menuNameEng}
//                         /> */}
//                               </Box>
//                             </FormGroup>
//                             <Divider />
//                             <FormGroup
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                               }}
//                             >
//                               {testArray.res
//                                 .filter((val) => val.isParent === "Y")
//                                 .map((abc, index) => {
//                                   return testArray.objj[abc.menuNameEng].map((val, id) => {
//                                     return (
//                                       val.parentId == text.id && (
//                                         <Grid
//                                           container
//                                           style={{
//                                             padding: "5px",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                           }}
//                                         >
//                                           <Grid
//                                             xs={2}
//                                             item
//                                             style={{
//                                               display: "flex",
//                                               justifyContent: "center",
//                                               alignItems: "center",
//                                             }}
//                                           >
//                                             <Checkbox
//                                               checked={checkedState.indexOf(val.id) >= 0}
//                                               onChange={(e) => {
//                                                 handleChange(e, val);
//                                               }}
//                                             />
//                                           </Grid>
//                                           <Grid
//                                             item
//                                             xs={6}
//                                             style={{
//                                               display: "flex",
//                                               alignItems: "center",
//                                             }}
//                                           >
//                                             <Typography>{val.menuNameEng}</Typography>
//                                           </Grid>
//                                           <Grid item xs={4}>
//                                             <FormControl fullWidth className={classes.formControl}>
//                                               <InputLabel id="mutiple-select-label">Roles</InputLabel>
//                                               <Select
//                                                 size="small"
//                                                 key={"role_" + index}
//                                                 labelId="mutiple-select-label"
//                                                 multiple
//                                                 label="Roles"
//                                                 value={getSelectedRoleValue(val)}
//                                                 // value={
//                                                 //   selected.filter(
//                                                 //     (_role) => {
//                                                 //      return _role.menuId == val.id
//                                                 //     }
//                                                 //   ).roleId || []
//                                                 // }
//                                                 onChange={(event) => {
//                                                   _handleChange(event, val, id);
//                                                 }}
//                                                 renderValue={(selected) => selected.join(", ")}
//                                                 MenuProps={MenuProps}
//                                               >
//                                                 <MenuItem
//                                                   value="all"
//                                                   key={"mt_" + index}
//                                                   classes={{
//                                                     root: isAllSelected
//                                                       ? classes.selectedAll
//                                                       : classes.container,
//                                                   }}
//                                                 >
//                                                   <ListItemIcon>
//                                                     <Checkbox
//                                                       classes={{
//                                                         indeterminate: classes.indeterminateColor,
//                                                       }}
//                                                       checked={isAllSelected}
//                                                       indeterminate={
//                                                         selected.length > 0 &&
//                                                         selected.length < roleList.length
//                                                       }
//                                                     />
//                                                   </ListItemIcon>
//                                                   <ListItemText
//                                                     classes={{
//                                                       primary: classes.selectAllText,
//                                                     }}
//                                                     primary="Select All"
//                                                   />
//                                                 </MenuItem>

//                                                 {roleList.map((option, index) => (
//                                                   <MenuItem key={index} value={option.id} sx={{ padding: 0 }}>
//                                                     <ListItemIcon>
//                                                       <Checkbox
//                                                         key={"CH" + index}
//                                                         checked={
//                                                           // selected.indexOf(
//                                                           //   option.id
//                                                           // ) > -1
//                                                           checkIsChecked(val, option)
//                                                         }
//                                                       />
//                                                     </ListItemIcon>
//                                                     <ListItemText primary={option.name} />
//                                                   </MenuItem>
//                                                 ))}
//                                               </Select>
//                                             </FormControl>
//                                             {/* <FormControl size="small" fullWidth>
//                                             <InputLabel id="demo-simple-select-standard-label">
//                                               Role
//                                             </InputLabel>

//                                             <Controller
//                                               render={({ field }) => (
//                                                 <Select
//                                                   labelId="demo-simple-select-label"
//                                                   id="demo-simple-select"
//                                                   label="Role"
//                                                   value={field.value}
//                                                   onChange={(value) => {
//                                                     field.onChange(value);
//                                                   }}
//                                                   style={{
//                                                     backgroundColor: "white",
//                                                   }}
//                                                 >
//                                                   {roleList.length > 0
//                                                     ? roleList.map(
//                                                         (role, index) => {
//                                                           return (
//                                                             <MenuItem
//                                                               key={index}
//                                                               value={role.id}
//                                                             >
//                                                               {role.name}
//                                                             </MenuItem>
//                                                           );
//                                                         }
//                                                       )
//                                                     : "NA"}
//                                                 </Select>
//                                               )}
//                                               name="roleName"
//                                               control={control}
//                                               defaultValue=""
//                                             />
//                                             <FormHelperText
//                                               style={{ color: "red" }}
//                                             >
//                                               {errors?.roleName
//                                                 ? errors.roleName.message
//                                                 : null}
//                                             </FormHelperText>
//                                           </FormControl> */}
//                                           </Grid>
//                                           <Divider style={{ width: "100%" }} />
//                                         </Grid>
//                                         // <FormControlLabel
//                                         //   style={{
//                                         //     border: "1px solid red",
//                                         //     width: "100%",
//                                         //     display: "flex",
//                                         //   }}
//                                         //   control={
//                                         //     <Checkbox
//                                         //       checked={checkedState.indexOf(val.id) >= 0}
//                                         //       onChange={(e) => {
//                                         //         console.log("id", id, val);
//                                         //         handleChange(e, val);
//                                         //       }}
//                                         //     />
//                                         //   }
//                                         //   label={val.menuNameEng}
//                                         // />
//                                       )
//                                     );
//                                   });
//                                 })}
//                             </FormGroup>
//                           </Grid>
//                           <Divider orientation="vertical" variant="middle" flexItem sx={{ mr: "-1px" }} />
//                         </>
//                       )}
//                     </>
//                   );
//                 })}
//             </Grid>
//           )}
//           <Grid container>
//             <Grid item xs={4} style={{ display: "flex", justifyContent: "end" }}>
//               <Button variant="contained" type="submit" size="small" sx={{ backgroundColor: "#00A65A" }}>
//                 Submit
//               </Button>
//             </Grid>
//             <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
//               <Button size="small" variant="contained" sx={{ backgroundColor: "#3C8DBC" }}>
//                 Reset
//               </Button>
//             </Grid>
//             <Grid item xs={4}>
//               <Button size="small" variant="contained" sx={{ backgroundColor: "#DD4B39" }}>
//                 Exit
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </FormProvider>
//     </>
//   );
// };

// export default UserRoleRight;
