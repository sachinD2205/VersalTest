// dept user register

import { yupResolver } from "@hookform/resolvers/yup";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
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
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

import schema from "../../../containers/schema/common/DepartmentUserRegisterSchema";
// import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import styles from "../../../styles/cfc/cfc.module.css";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import swal from "sweetalert";
import Transliteration from "../../../components/common/linguosol/transliteration";
import Loader from "../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../util/util";

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

const DepartmentUserRegister = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      officeDepartmentDesignationUserDaoLst: [
        {
          departmentId: "",
          designationId: "",
          officeId: "",
        },
      ],
      department: "",
      designation: "",
      officeLocation: "",
      //
      departmentId: "",
      designationId: "",
      officeId: "",
      department: "",
      designation: "",
      officeLocation: "",
      userType: "departmentUser",
    },
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

  // const {
  //   control,
  //   register,
  //   handleSubmit,
  //   reset,
  //   getValues,
  //   watch,
  //   setValue,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     departmentId: "",
  //     designationId: "",
  //     officeId: "",
  //     department: "",
  //     designation: "",
  //     officeLocation: "",
  //   },
  //   defaultValues: {
  //     officeDepartmentDesignationUserDaoLst: [
  //       {
  //         activeFlag: "",
  //         id: "",
  //         departmentId: "",
  //         designationId: "",
  //         officeId: "",
  //       },
  //     ],
  //     department: "",
  //     designation: "",
  //     officeLocation: "",
  //   },
  //   criteriaMode: "all",
  //   mode: "onChange",
  //   resolver: yupResolver(schema),
  // });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      // name: "applicationName",
      name: "officeDepartmentDesignationUserDaoLst",
      control,
      defaultValues: {
        officeDepartmentDesignationUserDaoLst: [
          {
            departmentId: "",
            designationId: "",
            officeId: "",
          },
        ],
      },
    }
  );

  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [_officeLocationList, _setOfficeLocationList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [isDepartmentChecked, setIsDepartmentChecked] = useState(false);
  const [isCFCChecked, setIsCFCChecked] = useState(false);
  const [isOtherUserChecked, setIsOtherUserChecked] = useState(false);

  const [dataFromDUR, setDataFromDUR] = useState(false);

  const [selectedRoleName, setSelectedRoleName] = useState([]);
  const [selectedModuleName, setSelectedModuleName] = useState([]);

  const [primaryLocationChange, setPrimaryLocationChange] = useState();

  const [locationChange, setLocationChange] = useState();

  const [departmentNameChange, setDepartmentNameChange] = useState();

  const [departmentChange, setDepartmentChange] = useState();
  const [departmentListName, setDepartmentListName] = useState([]);
  const [designationListName, setDesignationListName] = useState([]);

  const [loading, setLoading] = useState(false);
  const [cfcCenters, setCfcCenters] = useState([]);

  useEffect(() => {
    getDepartmentNameList();
    getDesignationNameList();
    getCfcCenter();
    getDepartmentName();
    getDesignationName();
    getApplicationsName();
    getRoleName();
    getLocationName();
    getServiceList();
    getOfficeLocation();
    getEmployeeCode();
  }, []);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

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

  const getDepartmentNameList = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res department22", r);
          setDepartmentListName(r?.data?.department);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getDesignationNameList = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("333res designation", r);
          setDesignationListName(r?.data?.designation);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedRoleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const _handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedModuleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    console.log("first", watch(`officeDepartmentDesignationUserDaoLst`).length);
    if (watch(`officeDepartmentDesignationUserDaoLst`).length == 0) {
      appendUI();
    }
  }, []);

  const [employeeCodeState, setEmployeeCode] = useState();

  const getEmployeeCode = () => {
    axios
      .get(`${urls.AuthURL}/getNextUserName`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("12345", r?.data);
          setEmployeeCode(r.data);
          setValue("empCode", r?.data);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const appendUI = () => {
    append({
      // applicationName: "",
      // roleName: "",
      departmentId: "",
      designationId: "",
      officeId: "",
    });
  };

  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/departmentAndOfficeLocationMapping/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res department", r);
          setDepartmentList(r?.data?.departmentAndOfficeLocationMapping);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getDesignationName = () => {
    axios
      .get(`${urls.CFCURL}/master/departmentAndDesignationMapping/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res designation", r);
          setDesignationList(r?.data?.departmentAndDesignationMapping);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getApplicationsName = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res application", r);
          setApplicationList(r?.data?.application);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getRoleName = () => {
    axios
      .get(`${urls.CFCURL}/master/mstRole/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res role", r);
          setRoleList(r?.data?.mstRole);
          // setRoleList(r.data.mstRole.map((val) => val.name));
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getLocationName = () => {
    axios
      .get(`${urls.CFCURL}/master/locality/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res location", r);
          setLocationList(r?.data);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getServiceList = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res location", r);
          setServiceList(r?.data?.service);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(
            // r.data.officeLocation.map((val) => val.officeLocationName)
            r?.data?.officeLocation
          );
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getOfficeLocationByDepartmentId = (deptId) => {
    axios
      .get(
        `${urls.CFCURL}/master/departmentAndOfficeLocationMapping/getByDepartmentId?deptId=${deptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r.status == 200) {
          let result = officeLocationList?.filter((item) =>
            r?.data?.departmentAndOfficeLocationMapping?.find(
              (abcItem) => abcItem.officeLocation === item.id
            )
          );
          console.log("res office location by dept id", r, result);
          _setOfficeLocationList(result);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    if (
      router?.query &&
      // officeLocationList?.length > 0 &&
      applicationList?.length > 0 &&
      serviceList?.length > 0 &&
      designationListName?.length > 0
    ) {
      console.log(
        "checking",
        router.query.mode,
        typeof router.query.mode,
        router.query
      );
      if (router.query.mode === "edit") {
        setDataFromDUR(false);
      }
      if (router.query.mode === "view") {
        setDataFromDUR(true);
      }
      if (router.query.mode === undefined) {
        setDataFromDUR(false);
      }
      // reset(router?.query);

      // setValue("officeDepartmentDesignationUserDaoLst", []);
      setValue("serviceList", []);
      setValue("applicationList", []);
      setValue("officeLocationList", []);
      setValue("departmentListName", []);
      setValue("designationListName", []);

      // if (router.query.mode == "edit") {
      if (router?.query?.id) {
        setLoading(true);
        axios
          .get(
            `${urls.CFCURL}/master/user/getById?userId=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((r) => {
            if (r.status == 200) {
              console.log(
                "332233",
                r?.data,
                r?.data?.cfc,
                r?.data?.cfcUser
                  ? "cfcUser"
                  : r?.data?.otherUser
                  ? "otherUser"
                  : r?.data?.deptUser
                  ? "departmentUser"
                  : "defaultUser"
              );
              getOfficeLocationByDepartmentId(r?.data?.department);
              setSelectedModuleName(r?.data?.applications);

              reset(router?.query);

              let officeDepartmentDesignationUserDaoLst =
                r?.data?.officeDepartmentDesignationUserDaoLst &&
                r?.data?.officeDepartmentDesignationUserDaoLst?.map((val) => {
                  return {
                    officeId: val.officeId,
                    departmentId: val.departmentId,
                    designationId: val.designationId,
                    id: val.id,
                    activeFlag: val.activeFlag,
                  };
                });

              setValue(
                "officeDepartmentDesignationUserDaoLst",
                officeDepartmentDesignationUserDaoLst &&
                  officeDepartmentDesignationUserDaoLst
              );

              setValue("department", Number(r?.data?.department));
              setValue("designation", Number(r?.data?.designation));
              setValue("officeLocation", Number(r?.data?.officeLocation));

              //////////////////////////////////////////////////////
              // setIsCFCChecked(r?.data?.cfcUser);
              // setIsOtherUserChecked(r?.data?.otherUser);
              // setIsDepartmentChecked(r?.data?.deptUser);
              //////////////////////////////////////////////////////
              setValue(
                "userType",
                r?.data?.cfcUser
                  ? "cfcUser"
                  : r?.data?.otherUser
                  ? "otherUser"
                  : r?.data?.deptUser
                  ? "departmentUser"
                  : "defaultUser"
              );
              //////////////////////////////////////////////////////
              setValue("mobileNumber", router.query?.mobileNo);
              // setValue("userName", router.query.userName);
              setValue("isDepartmentChecked", r?.data?.deptUser);
              setValue("isCFCChecked", r?.data?.cfcUser);
              setValue("cfcName", r?.data?.cfc);
              setValue("isOtherUserChecked", r?.data?.otherUser);
              setValue("employeeCode", r?.data?.empCode);

              setLoading(false);
            } else {
              setLoading(false);
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            setLoading(false);
            callCatchMethod(err, language);
          });
      }
      // }
      // else {
      // setValue("officeDepartmentDesignationUserDaoLst", []);
      // }
    }
  }, [
    router?.query,
    serviceList,
    applicationList,
    officeLocationList,
    departmentListName,
    designationListName,
  ]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onFinish = (data) => {
    console.log("iiii222", data);

    let applicationArray =
      data?.officeDepartmentDesignationUserDaoLst &&
      data?.officeDepartmentDesignationUserDaoLst?.map((val) => {
        return {
          // officeId: val.locationName,
          // departmentId: val.departmentName,
          // designationId: val.designationName,
          id: val.id,
          activeFlag: val.activeFlag,
          officeId: val.officeId,
          departmentId: val.departmentId,
          designationId: val.designationId,
        };
      });

    console.log("applicationArray", applicationArray);

    const body = {
      activeFlag: data.activeFlag,
      id: data.id ? Number(data.id) : null,
      // userName: employeeCodeState,
      // empCode: employeeCodeState,
      userName: data.userName,
      empCode: data.empCode,
      password: data.password,
      firstNameEn: data.firstName,
      middleNameEn: data.middleName,
      lastNameEn: data.lastName,
      firstNameMr: data.firstNameMr,
      middleNameMr: data.middleNameMr,
      lastNameMr: data.lastNameMr,
      email: data.email,
      phoneNo: data.mobileNumber,
      officeDepartmentDesignationUserDaoLst: applicationArray,
      // officeDepartmentDesignationUserDaoLst: getValues("officeDepartmentDesignationUserDaoLst"),
      // roles: selectedRoleName,
      applications: selectedModuleName,
      // cFCUser: data.isCFCChecked,
      //////////////////////////////////////////////////////////////
      // cfcUser: data.isCFCChecked,
      // otherUser: data.isOtherUserChecked,
      // deptUser: data.isDepartmentChecked,
      //////////////////////////////////////////////////////////////
      cfcUser: watch("userType") == "cfcUser" ? true : false,
      otherUser: watch("userType") == "otherUser" ? true : false,
      deptUser: watch("userType") == "departmentUser" ? true : false,
      //////////////////////////////////////////////////////////////
      department: data.department,
      designation: data.designation,
      officeLocation: data.officeLocation,
      cfc: data?.cfcName,

      // primaryDesignation: data.primaryDesignation,
      // primaryDepartment: data.primaryDepartment,
      // primaryOffice: data.primaryOffice,
    };

    console.log("body", body);

    const _headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    swal({
      title: language === "en" ? "Save?" : "जतन करा?",
      text:
        language === "en"
          ? "Are you sure you want to Save this Record?"
          : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड जतन करू इच्छिता?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    swal({
      title: data?.id
        ? language === "en"
          ? "Update?"
          : "अपडेट करा?"
        : language === "en"
        ? "Confirmation"
        : "पुष्टीकरण",
      text:
        language === "en"
          ? `Are you sure want to ${data?.id ? "Update" : "Create"} User ?`
          : `तुम्हाला नक्की वापरकर्ता ${
              data?.id ? "अपडेट" : "तयार"
            } करायचा आहे का?`,
      icon: "warning",
      buttons: [
        language === "en" ? "Cancel" : "रद्द करा",
        language === "en" ? "Save" : "जतन करा",
      ],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${urls.AuthURL}/signup`, body, { headers: _headers })
          .then((r) => {
            if (r.status == 200) {
              data.id
                ? swal({
                    title: language === "en" ? "Updated" : "अपडेट केले",
                    text:
                      language === "en"
                        ? "User Updated Successfully"
                        : "वापरकर्ता यशस्वीरित्या अपडेट झाला",
                    icon: "success",
                    // buttons: ["Cancel", "Save"],
                  })
                : swal({
                    icon: "success",
                    title:
                      language === "en"
                        ? "User Created.. Please Check Mail"
                        : "वापरकर्ता तयार केला.. कृपया मेल तपासा",
                    text:
                      language === "en"
                        ? "Password sent on your given Mail-Id"
                        : "आपल्या दिलेल्या मेल-आयडीवर पासवर्ड पाठवला आहे",
                    confirmButtonText: "OK",
                    // buttons: ["Cancel", "Save"],
                  });
              // toast("User Created Successfully", {
              //   type: "success",
              // });
              router.push("/common/masters/departmentUserList");
            } else if (r.status == 400) {
              toast("400 ! Bad Request", {
                type: "failure",
              });
            } else if (r.status == 500) {
              toast("Already Exist", {
                type: "error",
              });
              swal({
                icon: "warning",
                title: "Please try again...!!",
                text: "Change Employee Code and try again",
                confirmButtonText: "OK",
                // buttons: ["Cancel", "Save"],
              });
            }
          })
          .catch((err) => {
            console.log("22222", err?.response?.data);
            toast(
              "Email or Username all ready exits...Try again with different E-mail or userName !!",
              {
                type: "error",
              }
            );
            // if (err.response?.data?.length > 0) {
            //   err.response?.data?.map((x) => {
            //     if (x.field == "email") {
            //       setError("email", { message: x.code });
            //     } else if (x.field == "userName") {
            //       setError("userName", { message: x.code });
            //     }
            //   });
            // } else {
            // swal(
            //   err?.response?.data,
            //   "Email or Username all ready exits...Try again with different E-mail or userName !!",
            //   // "Try again with different E-mail or userName",
            //   "warning"
            // );
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
    userName: "",
    password: "",
    employeeCode: "",
    empCode: "",
    firstName: "",
    firstNameEn: "",
    middleName: "",
    middleNameEn: "",
    lastName: "",
    lastNameEn: "",
    firstNameMr: "",
    middleNameMr: "",
    lastNameMr: "",
    email: "",
    mobileNumber: "",
    applicationArray: "",
    selectedModuleName: "",
    isOtherUserChecked: "",
    isCFCChecked: "",
    isDepartmentChecked: "",
    // primaryOffice: "",
    // primaryDepartment: "",
    // primaryDesignation: "",
    department: "",
    designation: "",
    officeLocation: "",
  };

  // Exit Button
  const exitButton = () => {
    // router.push("./departmentUserList");
    router.push("/common/masters/departmentUserList");
  };

  const handleApplicationNameChange = (value) => {
    console.log("value", value);
    let test = [];

    let _ch =
      serviceList &&
      serviceList?.filter((txt) => {
        return value.target.value === txt.application && txt;
      });
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
  };

  const handleDepartmentChecked = (e) => {
    console.log("e", e);
    setIsDepartmentChecked(e.target.checked);
  };

  const handleCFCChecked = (e) => {
    setIsCFCChecked(e.target.checked);
  };

  const handleOtherUserChecked = (e) => {
    setIsOtherUserChecked(e.target.checked);
  };

  const getCfcCenter = () => {
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCfcCenters(
          res.data.cfcCenters.map((r, i) => ({
            ...r,
            id: r.id,
            cfcName: r.cfcName,
            cfcNameMr: r.cfcNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
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
                <FormattedLabel id="departmentUserRegister" />
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Box>
          {loading ? (
            <Loader />
          ) : (
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
                  <FormattedLabel id="userDetails" />
                </Box>
              </Box>
              <br />
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onFinish)}>
                  <div>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {" "}
                        <Box sx={{ width: "90%", backgroundColor: "white" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"firstName"}
                            labelName={"firstName"}
                            fieldName={"firstName"}
                            updateFieldName={"firstNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={dataFromDUR}
                            label={<FormattedLabel id="firstName" required />}
                            error={!!errors.firstName}
                            helperText={
                              errors?.firstName
                                ? errors.firstName.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {" "}
                        <Box sx={{ width: "90%", backgroundColor: "white" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"middleName"}
                            labelName={"middleName"}
                            fieldName={"middleName"}
                            updateFieldName={"middleNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={dataFromDUR}
                            label={<FormattedLabel id="middleName" required />}
                            error={!!errors.middleName}
                            helperText={
                              errors?.middleName
                                ? errors.middleName.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {" "}
                        <Box sx={{ width: "90%", backgroundColor: "white" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"lastName"}
                            labelName={"lastName"}
                            fieldName={"lastName"}
                            updateFieldName={"lastNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={dataFromDUR}
                            label={<FormattedLabel id="lastName" required />}
                            error={!!errors.lastName}
                            helperText={
                              errors?.lastName ? errors.lastName.message : null
                            }
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {" "}
                        <Box sx={{ width: "90%", backgroundColor: "white" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"firstNameMr"}
                            labelName={"firstNameMr"}
                            fieldName={"firstNameMr"}
                            updateFieldName={"firstName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={dataFromDUR}
                            label={<FormattedLabel id="firstNameMr" required />}
                            error={!!errors.firstNameMr}
                            helperText={
                              errors?.firstNameMr
                                ? errors.firstNameMr.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {" "}
                        <Box sx={{ width: "90%", backgroundColor: "white" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"middleNameMr"}
                            labelName={"middleNameMr"}
                            fieldName={"middleNameMr"}
                            updateFieldName={"middleName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={dataFromDUR}
                            label={
                              <FormattedLabel id="middleNameMr" required />
                            }
                            error={!!errors.middleNameMr}
                            helperText={
                              errors?.middleNameMr
                                ? errors.middleNameMr.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {" "}
                        <Box sx={{ width: "90%", backgroundColor: "white" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"lastNameMr"}
                            labelName={"lastNameMr"}
                            fieldName={"lastNameMr"}
                            updateFieldName={"lastName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={dataFromDUR}
                            label={<FormattedLabel id="lastNameMr" required />}
                            error={!!errors.lastNameMr}
                            helperText={
                              errors?.lastNameMr
                                ? errors.lastNameMr.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <br />
                    <Alert variant="outlined" color="info">
                      {language === "en"
                        ? "You can login through your- E-mail, Mobile Number,Employee Code or via User Name"
                        : "तुम्ही तुमच्या ई-मेल, मोबाईल नंबर, कर्मचारी कोड किंवा वापरकर्ता नावाद्वारे लॉग इन करू शकता"}
                    </Alert>
                    <br />

                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          sx={{ width: "86%" }}
                          InputLabelProps={{
                            shrink: watch("email") && true,
                          }}
                          size="small"
                          id="outlined-basic"
                          label={<FormattedLabel id="userEmail" />}
                          disabled={dataFromDUR}
                          variant="outlined"
                          style={{ backgroundColor: "white" }}
                          {...register("email")}
                          error={errors.email}
                          helperText={errors.email?.message}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          sx={{ width: "86%" }}
                          InputLabelProps={{
                            shrink: watch("mobileNumber") && true,
                          }}
                          size="small"
                          id="outlined-basic"
                          label={<FormattedLabel id="mobileNo" />}
                          variant="outlined"
                          disabled={dataFromDUR}
                          style={{ backgroundColor: "white" }}
                          {...register("mobileNumber")}
                          error={errors.mobileNumber}
                          helperText={errors.mobileNumber?.message}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          InputLabelProps={{
                            shrink: watch("empCode") && true,
                          }}
                          disabled={dataFromDUR}
                          sx={{ width: "86%" }}
                          size="small"
                          id="outlined-basic"
                          label={<FormattedLabel id="employeeCode" />}
                          variant="outlined"
                          style={{ backgroundColor: "white" }}
                          // {...register("employeeCodeState")}
                          {...register("empCode")}
                          error={errors.empCode}
                          helperText={errors.empCode?.message}
                        />
                      </Grid>

                      {/* <Grid item xs={4} style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
                  <FormControl style={{ width: "86%" }} size="small">
                    <InputLabel id="demo-simple-select-label">Primary Department name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Primary Department name"
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
                      name="department"
                      control={control}
                      defaultValue=""
                      // key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.department ? errors.department.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
                  <FormControl style={{ width: "86%" }} size="small">
                    <InputLabel id="demo-simple-select-label">Primary Designation name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Primary Designation name"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: "white" }}
                        >
                          {designationList.length > 0
                            ? designationList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.designation}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name="designation"
                      control={control}
                      defaultValue=""
                      // key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.designation ? errors.designation.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
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
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          InputLabelProps={{
                            shrink: watch("userName") && true,
                          }}
                          disabled={dataFromDUR}
                          // value={router.query.employeeCode ? router.query.employeeCode : employeeCodeState}
                          sx={{ width: "86%" }}
                          size="small"
                          id="outlined-basic"
                          label={<FormattedLabel id="userN" />}
                          variant="outlined"
                          // readonly={dataFromDUR}
                          style={{ backgroundColor: "white" }}
                          {...register("userName")}
                          // {...register("employeeCodeState")}
                          error={errors.userName}
                          helperText={errors.userName?.message}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {/* <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="password" />}
                    // readonly
                    readonly={dataFromDUR}
                    // defaultValue="Admin@123"
                    variant="outlined"
                    style={{ backgroundColor: "white" }}
                    {...register("password")}
                    error={errors.password}
                    helperText={errors.password?.message}
                    type={showPassword ? "" : "password"}
                    InputProps={{
                      style: { fontSize: "15px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  /> */}
                      </Grid>

                      {/* <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl size="small" fullWidth sx={{ width: "50%" }}>
              <InputLabel id="demo-multiple-checkbox-label">Role</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                sx={{ backgroundColor: "white" }}
                value={selectedRoleName}
                readonly={dataFromDUR}
                onChange={handleChange}
                label="Role"
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {roleList.length > 0
                  ? roleList.map((name, index) => {
                      return (
                        <MenuItem key={index} value={name.name}>
                          <Checkbox
                            checked={selectedRoleName.indexOf(name.name) > -1}
                          />
                          <ListItemText primary={name.name} />
                        </MenuItem>
                      );
                    })
                  : []}
              </Select>
            </FormControl>
          </Grid> */}
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl style={{ width: "86%" }} size="small">
                          <InputLabel id="demo-simple-select-label">
                            <FormattedLabel id="primaryDepartmentName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                error={errors?.department ? true : false}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                disabled={dataFromDUR}
                                label={
                                  <FormattedLabel id="primaryDepartmentName" />
                                }
                                {...field}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setDepartmentNameChange(value.target.value);
                                  getOfficeLocationByDepartmentId(
                                    value.target.value
                                  );
                                }}
                                style={{ backgroundColor: "white" }}
                              >
                                {departmentListName?.length > 0
                                  ? departmentListName
                                      // .filter((item) => item.id == primaryLocationChange)
                                      ?.map((val, id) => {
                                        return (
                                          <MenuItem key={id} value={val.id}>
                                            {language === "en"
                                              ? val?.department
                                              : val?.departmentMr}
                                          </MenuItem>
                                        );
                                      })
                                  : "Not Available"}
                              </Select>
                            )}
                            name="department"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.department
                              ? errors.department.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl
                          style={{ width: "86%" }}
                          size="small"
                          error={!!errors.officeLocation}
                        >
                          <InputLabel id="demo-simple-select-label">
                            <FormattedLabel id="primaryLocationName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                error={errors?.officeLocation ? true : false}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label={
                                  <FormattedLabel id="primaryLocationName" />
                                }
                                disabled={dataFromDUR}
                                {...field}
                                value={field.value || []}
                                // onChange={(value) => field.onChange(value)}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setPrimaryLocationChange(value.target.value);
                                }}
                                style={{ backgroundColor: "white" }}
                              >
                                {_officeLocationList?.length > 0
                                  ? _officeLocationList?.map((val, id) => {
                                      return (
                                        <MenuItem key={id} value={val.id}>
                                          {language === "en"
                                            ? val?.officeLocationName
                                            : val?.officeLocationNameMar}
                                        </MenuItem>
                                      );
                                    })
                                  : []}
                              </Select>
                            )}
                            name="officeLocation"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.officeLocation
                              ? errors.officeLocation.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl style={{ width: "86%" }} size="small">
                          <InputLabel id="demo-simple-select-label">
                            <FormattedLabel id="primaryDesignationName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                error={errors?.designation ? true : false}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                disabled={dataFromDUR}
                                label={
                                  <FormattedLabel id="primaryDesignationName" />
                                }
                                {...field}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                style={{ backgroundColor: "white" }}
                              >
                                {designationListName?.length > 0
                                  ? designationListName?.map((val, id) => {
                                      return (
                                        <MenuItem key={id} value={val.id}>
                                          {language === "en"
                                            ? val?.designation
                                            : val?.designationMr}
                                        </MenuItem>
                                      );
                                    })
                                  : "Not Available"}
                              </Select>
                            )}
                            name="designation"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.designation
                              ? errors.designation.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      sx={{ padding: "23px" }}
                    >
                      <Grid item xs={12} sx={{ marginLeft: 2 }}>
                        <FormControl size="small" fullWidth>
                          <InputLabel id="demo-multiple-checkbox-label">
                            <FormattedLabel id="moduleName" />
                          </InputLabel>
                          <Select
                            // required
                            // {...register("applications")}
                            // error={errors?.selectedModuleName < 1 ? true : false}
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            disabled={dataFromDUR}
                            // maxRows={3}
                            // multiline
                            sx={{ backgroundColor: "white" }}
                            value={selectedModuleName}
                            onChange={_handleChange}
                            label={<FormattedLabel id="moduleName" />}
                            renderValue={(selected) => selected.join(", ")}
                            // MenuProps={MenuProps}
                          >
                            {applicationList?.length > 0
                              ? applicationList?.map((name, index) => {
                                  return (
                                    <MenuItem
                                      key={index}
                                      value={name.applicationNameEng}
                                    >
                                      <Checkbox
                                        checked={
                                          selectedModuleName?.indexOf(
                                            name?.applicationNameEng
                                          ) > -1
                                        }
                                      />
                                      {/* <Checkbox /> */}
                                      <ListItemText
                                        primary={name?.applicationNameEng}
                                      />
                                    </MenuItem>
                                  );
                                })
                              : []}
                          </Select>
                          <FormHelperText style={{ color: "red" }}>
                            {/* {errors?.selectedModuleName < 1 ? errors.applications.message : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container sx={{ backgroundColor: "white" }}>
                      <Grid
                        xs={12}
                        sm={8}
                        md={8}
                        lg={8}
                        xl={8}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Controller
                          name="userType"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <RadioGroup
                              row
                              aria-label="userType"
                              name="userType"
                              value={field.value}
                              onChange={(e) =>
                                setValue("userType", e.target.value)
                              }
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-evenly",
                              }}
                            >
                              <FormControlLabel
                                value="departmentUser"
                                control={
                                  <Radio
                                    variant="outlined"
                                    disabled={dataFromDUR}
                                  />
                                }
                                label={<FormattedLabel id="isDepartmentUser" />}
                              />
                              <FormControlLabel
                                value="cfcUser"
                                control={
                                  <Radio
                                    variant="outlined"
                                    disabled={dataFromDUR}
                                  />
                                }
                                label={<FormattedLabel id="isCfcUser" />}
                              />
                            </RadioGroup>
                          )}
                        />
                      </Grid>
                      {console.log("watch userType", watch("userType"))}

                      {watch("userType") == "cfcUser" && (
                        <Grid
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
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
                            error={!!errors.cfcName}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              <FormattedLabel id="cfcName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled={dataFromDUR}
                                  value={field.value}
                                  variant="outlined"
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="cfcName" />}
                                >
                                  {cfcCenters &&
                                    cfcCenters.map((cfcName, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={cfcName.cfcId}
                                        >
                                          {language == "en"
                                            ? cfcName?.cfcName
                                            : cfcName?.cfcNameMr}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="cfcName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.cfcName ? errors.cfcName.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      )}

                      {/* <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControlLabel
                          sx={{
                            backgroundColor: "white",
                            border: "1px dotted black",
                            paddingRight: 3,
                            marginRight: language === "en" ? 10 : 2,
                          }}
                          control={
                            <Checkbox
                              checked={isDepartmentChecked}
                              sx={{
                                backgroundColor: "white",
                                marginRight: 1,
                              }}
                            />
                          }
                          disabled={dataFromDUR}
                          {...register("isDepartmentChecked")}
                          onChange={handleDepartmentChecked}
                          label={<FormattedLabel id="isDepartmentUser" />}
                        />
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
                        <FormControlLabel
                          sx={{
                            backgroundColor: "white",
                            border: "1px dotted black",
                            paddingRight: 3,
                            marginRight: language === "en" ? 17 : 5,
                          }}
                          control={
                            <Checkbox
                              checked={isCFCChecked}
                              sx={{
                                backgroundColor: "white",
                                marginRight: 1,
                              }}
                            />
                          }
                          disabled={dataFromDUR}
                          {...register("isCFCChecked")}
                          onChange={handleCFCChecked}
                          label={<FormattedLabel id="isCfcUser" />}
                        />
                      </Grid>
                      {isCFCChecked && (
                        <Grid
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
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
                            error={!!errors.cfcName}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              <FormattedLabel id="cfcName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled={dataFromDUR}
                                  value={field.value}
                                  variant="outlined"
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="cfcName" />}
                                >
                                  {cfcCenters &&
                                    cfcCenters.map((cfcName, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={cfcName.cfcId}
                                        >
                                          {language == "en"
                                            ? cfcName?.cfcName
                                            : cfcName?.cfcNameMr}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="cfcName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.cfcName ? errors.cfcName.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      )} */}
                    </Grid>
                    {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    readonly={dataFromDUR}
                    control={<Checkbox checked={isOtherUserChecked} />}
                    {...register("isOtherUserChecked")}
                    onChange={handleOtherUserChecked}
                    label={<FormattedLabel id="isOtherUser" />}
                  />
                </Grid> */}

                    {/* <Box style={{ padding: "20px" }}>
                <Typography variant="h6">Applications Roles List</Typography>
                <Divider style={{ background: "black" }} />
              </Box> */}
                    <br />
                    <br />
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {/* <FormattedLabel id="officeDepartmentDesignationUserDaoLst" /> */}
                        <FormattedLabel id="applicationRolesList" />
                      </Box>
                    </Box>
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
                              <FormattedLabel id="addMore" />
                            </Button>
                          )}
                        </Box>
                        {fields?.map((witness, index) => {
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
                                  <FormControl
                                    style={{ width: "100%" }}
                                    size="small"
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                      <FormattedLabel id="departmentName" />
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          error={
                                            errors
                                              ?.officeDepartmentDesignationUserDaoLst?.[
                                              index
                                            ]?.departmentId
                                              ? true
                                              : false
                                          }
                                          disabled={dataFromDUR}
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label={
                                            <FormattedLabel id="departmentName" />
                                          }
                                          value={field.value}
                                          // onChange={(value) => field.onChange(value)}
                                          onChange={(value) => {
                                            field.onChange(value);
                                            setDepartmentChange(
                                              value.target.value
                                            );
                                          }}
                                          style={{ backgroundColor: "white" }}
                                        >
                                          {departmentListName?.length > 0
                                            ? departmentListName
                                                // .filter((item) => item.id == locationChange)
                                                ?.map((val, id) => {
                                                  return (
                                                    <MenuItem
                                                      key={id}
                                                      value={val.id}
                                                    >
                                                      {/* {language === "en"
                                                  ? departmentListName.find((f) => f.id === val.department)
                                                      ?.department
                                                  : departmentListName.find((f) => f.id === val.department)
                                                      ?.departmentMr} */}
                                                      {language === "en"
                                                        ? val?.department
                                                        : val?.departmentMr}
                                                    </MenuItem>
                                                  );
                                                })
                                            : "Not Available"}
                                        </Select>
                                      )}
                                      // name={`officeDepartmentDesignationUserDaoLst[${index}].departmentName`}
                                      name={`officeDepartmentDesignationUserDaoLst.${index}.departmentId`}
                                      control={control}
                                      defaultValue=""
                                      key={witness.id}
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                      {errors
                                        ?.officeDepartmentDesignationUserDaoLst?.[
                                        index
                                      ]?.departmentId
                                        ? errors
                                            ?.officeDepartmentDesignationUserDaoLst?.[
                                            index
                                          ]?.departmentId.message
                                        : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid item md={4}>
                                  <FormControl
                                    style={{ width: "100%" }}
                                    size="small"
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                      <FormattedLabel id="locationName" />
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          error={
                                            errors
                                              ?.officeDepartmentDesignationUserDaoLst?.[
                                              index
                                            ]?.officeId
                                              ? true
                                              : false
                                          }
                                          disabled={dataFromDUR}
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label={
                                            <FormattedLabel id="locationName" />
                                          }
                                          value={field.value}
                                          // onChange={(value) => field.onChange(value)}
                                          onChange={(value) => {
                                            field.onChange(value);
                                            setLocationChange(
                                              value.target.value
                                            );
                                          }}
                                          style={{ backgroundColor: "white" }}
                                        >
                                          {officeLocationList?.length > 0
                                            ? officeLocationList?.map(
                                                (val, id) => {
                                                  return (
                                                    <MenuItem
                                                      key={id}
                                                      value={val.id}
                                                    >
                                                      {language === "en"
                                                        ? val.officeLocationName
                                                        : val.officeLocationNameMar}
                                                    </MenuItem>
                                                  );
                                                }
                                              )
                                            : "Not Available"}
                                        </Select>
                                      )}
                                      // name={`officeDepartmentDesignationUserDaoLst[${index}].locationName`}
                                      name={`officeDepartmentDesignationUserDaoLst.${index}.officeId`}
                                      control={control}
                                      defaultValue=""
                                      key={witness.id}
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                      {errors
                                        ?.officeDepartmentDesignationUserDaoLst?.[
                                        index
                                      ]?.officeId
                                        ? errors
                                            ?.officeDepartmentDesignationUserDaoLst?.[
                                            index
                                          ]?.officeId.message
                                        : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid item md={3}>
                                  <FormControl
                                    style={{ width: "100%" }}
                                    size="small"
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                      <FormattedLabel id="designationName" />
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          error={
                                            errors
                                              ?.officeDepartmentDesignationUserDaoLst?.[
                                              index
                                            ]?.designationId
                                              ? true
                                              : false
                                          }
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label={
                                            <FormattedLabel id="designationName" />
                                          }
                                          disabled={dataFromDUR}
                                          value={field.value}
                                          onChange={(value) =>
                                            field.onChange(value)
                                          }
                                          style={{ backgroundColor: "white" }}
                                        >
                                          {designationListName?.length > 0
                                            ? designationListName
                                                // .filter((f) => f.id == departmentChange)
                                                ?.map((val, id) => {
                                                  return (
                                                    <MenuItem
                                                      key={id}
                                                      value={val.id}
                                                    >
                                                      {/* {
                                                  designationListName.find((f) => f.id === val.designation)
                                                    ?.designationMr
                                                } */}
                                                      {language === "en"
                                                        ? val?.designation
                                                        : val?.designationMr}
                                                    </MenuItem>
                                                  );
                                                })
                                            : "Not Available"}
                                        </Select>
                                      )}
                                      // name={`officeDepartmentDesignationUserDaoLst[${index}].designationName`}
                                      name={`officeDepartmentDesignationUserDaoLst.${index}.designationId`}
                                      control={control}
                                      defaultValue=""
                                      key={witness.id}
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                      {errors
                                        ?.officeDepartmentDesignationUserDaoLst?.[
                                        index
                                      ]?.designationId
                                        ? errors
                                            ?.officeDepartmentDesignationUserDaoLst?.[
                                            index
                                          ]?.designationId.message
                                        : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                {router.query.mode === "view" ? (
                                  <></>
                                ) : (
                                  <>
                                    <Grid
                                      item
                                      xs={1}
                                      className={styles.feildres}
                                    >
                                      <IconButton
                                        color="error"
                                        // onClick={() => {
                                        //   remove(index, {
                                        //     activeFlag: "",
                                        //     id: "",
                                        //     departmentId: "",
                                        //     designationId: "",
                                        //     officeId: "",
                                        //   });
                                        // remove(index);
                                        // }}
                                        onClick={() => remove(index)}
                                      >
                                        <DeleteIcon sx={{ fontSize: 35 }} />
                                      </IconButton>
                                    </Grid>
                                  </>
                                )}
                              </Grid>

                              {/* <Grid
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
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Department name"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {applicationList.length > 0
                            ? applicationList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.applicationNameEng}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={`officeDepartmentDesignationUserDaoLst[${index}].applicationName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.applicationName
                        ? errors.applicationName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Service name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Service name"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: "white" }}
                        >
                          {filteredServices.length > 0
                            ? filteredServices.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.service}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={`officeDepartmentDesignationUserDaoLst[${index}].serviceName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.serviceName ? errors.serviceName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                              {/* <Grid
                  item
                  xs={4}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl fullWidth style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Role name
                    </InputLabel>
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
                      name={`officeDepartmentDesignationUserDaoLst[${index}].roleName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.roleName ? errors.roleName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}

                              {/* <Grid
                          item
                          xs={1}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
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

                        </Grid> */}
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
                                setIsDepartmentChecked(false);
                                setIsCFCChecked(false);
                                setIsOtherUserChecked(false);
                                setSelectedModuleName([]);
                                reset({
                                  ...resetValuesExit,
                                  officeDepartmentDesignationUserDaoLst: [
                                    {
                                      departmentId: "",
                                      designationId: "",
                                      officeId: "",
                                    },
                                  ],
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
                              onClick={() => {
                                setSelectedModuleName([]);
                                setIsDepartmentChecked(false);
                                setIsCFCChecked(false);
                                setIsOtherUserChecked(false);
                                exitButton();
                              }}
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
              </FormProvider>
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
};

export default DepartmentUserRegister;
