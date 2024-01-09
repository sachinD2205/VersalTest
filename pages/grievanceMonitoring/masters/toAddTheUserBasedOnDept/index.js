import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,Paper,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Schema from "../../../../containers/schema/grievanceMonitoring/userBasedOnDepartmentSchema";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const Index = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onSubmit",
  });
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const language = useSelector((store) => store.labels.language);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [usersAgainstDept, setUsersAgainstDept] = useState([]);
  const [tempUser, settempUser] = useState(false);
  const [complaintFlag, setComplaintFlag] = useState(false);
  const [areaNames, setAreaNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allUsersOnLoad, setAllUsersOnLoad] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [OfficeLocationName, setOfficeLocationName] = useState([]);
  const [departments, setDepartments] = useState([
    {
      id: 1,
      departmentEn: "",
      departmentMr: "",
    },
  ]);
  const router = useRouter();
  const [levels, setLevels] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  //newFunctionForNullValues
  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available";
    } else {
      return value ? value : "उपलब्ध नाही";
    }
  };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  //checkingSandU
  let checkingSandU = (finalBodyForApi, finalBodyForUpdate) => {
      return axios.post(
        `${urls.GM}/empGrievanceLevelMapping/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      deptKey: formData.deptKey,
      level: formData.level,
      userKey: formData.userKey,
      complaintTypeKey: formData.complaintTypeKey,
      complaintSubTypeKey: formData.complaintSubTypeKey,
      areaKey: Number(watch("uniqueId")),
      subdeptKey: watch("subdeptKey"),
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
    };

    const finalBodyForUpdate = {
      activeFlag: formData.activeFlag,
      id: formData.id,
      deptKey: Number(formData.deptKey),
      level: formData.level,
      userKey: formData.userKey,
      subdeptKey: watch("subdeptKey"),
      complaintTypeKey: Number(formData.complaintTypeKey),
      complaintSubTypeKey: formData.complaintSubTypeKey
        ? Number(formData.complaintSubTypeKey)
        : null,
      areaKey: Number(watch("uniqueId")),
      zoneKey: Number(watch("zoneKey")),
      wardKey: Number(watch("wardKey")),
    };
    setLoading(true);
    checkingSandU(finalBodyForApi, finalBodyForUpdate)
      .then((res) => {
        setLoading(false);

        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert({
                title: language === "en" ? "Updated!" : "अपडेट केले",
                text:
                language === "en"
                  ? "Record Updated Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will)=>{
                if(will){
                  getAllUsersWithDept();
                  settempUser(false);
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setLevels([]);
                  setValue("deptKey", null);
                  setValue("zoneKey", null);
                  setValue("wardKey", null);
                  setUsersAgainstDept([]);
                  setComplaintSubTypes([]);
                  setComplaintFlag(false);
                  cancellButton();
                }
              })
            : sweetAlert({
                title: language === "en" ? "Saved!" : "जतन केले!",
                text:
                  language === "en"
                    ? "Record Saved Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will)=>{
                if(will){
                  getAllUsersWithDept();
                  settempUser(false);
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setLevels([]);
                  setValue("deptKey", null);
                  setValue("zoneKey", null);
                  setValue("wardKey", null);
                  setUsersAgainstDept([]);
                  setComplaintSubTypes([]);
                  setComplaintFlag(false);
                  cancellButton();
                }
              });
         
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };

  // deleteById
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      sweetAlert({
        title: language === "en" ? "Deactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are You Sure You Want To Deactivate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.GM}/empGrievanceLevelMapping/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              if (res.status == 200 || res.status == 201) {
                sweetAlert({
                  title: language === "en" ? "Deactivated!" : "निष्क्रिय केले!",
                  text:
                    language === "en"
                      ? "Record Is Successfully Deactivated!"
                      : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  icon: "success",
                }).then((will)=>{
                  if(will){
                    getAllUsersWithDept();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((error) => {
              setLoading(false);
              cfcErrorCatchMethod(error,false);
            });
        } else if (willDelete == null) {
          sweetAlert({
            text:
              language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
          setButtonInputState(false);
        }
      });
    } else {
      sweetAlert({
        title: language === "en" ? "Activate?" : "सक्रिय करू?",
        text:
          language === "en"
            ? "Are You Sure You Want To Activate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.GM}/empGrievanceLevelMapping/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              if (res.status == 200 || res.status == 201) {
                sweetAlert({
                  title: language === "en" ? "Activated!" : "सक्रिय झाले!",
                  text:
                    language === "en"
                      ? "Record Is Successfully Activated!"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय झाले!",
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  icon: "success",
                }).then((will)=>{
                  if(will){
                    getAllUsersWithDept();
                    setButtonInputState(false);
                  }
                });
              }
            }).catch((error) => {
              setLoading(false);
              cfcErrorCatchMethod(error,false);
            });
        } else if (willDelete == null) {
          sweetAlert({
            text:
              language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
          setButtonInputState(false);
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setValue("deptKey", null);
    setValue("complaintTypeKey", null);
    setValue("complaintSubTypeKey", null);
    setUsersAgainstDept([]);
    setComplaintTypes([]);
    setComplaintSubTypes([]);
    settempUser(false);
    setComplaintFlag(false);
    setLevels([]);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setValue("deptKey", null);
    setValue("complaintTypeKey", null);
    setValue("complaintSubTypeKey", null);
    setValue("zoneKey", null);
    setValue("wardKey", null);
    setValue("subdeptKey", null);
    setUsersAgainstDept([]);
    setComplaintTypes([]);
    setComplaintSubTypes([]);
    settempUser(false);
    setComplaintFlag(false);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    depName: "",
    deptKey: null,
    complaintTypeKey: null,
    userKey: null,
    level: "",
    user_NameEn: "",
    user_NameMr: "",
    zoneKey: null,
    wardKey: null,
    subdeptKey: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    depName: "",
    deptKey: null,
    complaintTypeKey: null,
    userKey: null,
    level: null,
    user_NameEn: "",
    user_NameMr: "",
    zoneKey: null,
    wardKey: null,
    subdeptKey: null,
    id: null,
  };

  //columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: language === "en" ? "user_NameEn" : "user_NameMr",
      headerName: <FormattedLabel id="userName" />,
      minWidth: 200,
      headerAlign: "center",
      align:'left'
    },
    {
      field: "officeLocation",
      headerName: <FormattedLabel id="officeLocation" />,
      minWidth: 550,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language === "en" ? "depNameEn" : "depNameMr",
      headerName: <FormattedLabel id="depName" />,
      minWidth: 200,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language === "en" ? "complaintTypeNameEn" : "complaintTypeNameMr",
      headerName: <FormattedLabel id="complaintType" />,
      minWidth: 200,
      headerAlign: "center",
      align:'left'
    },
    {
      field:
        language === "en" ? "complaintSubTypeNameEn" : "complaintSubTypeNameMr",
      headerName: <FormattedLabel id="complaintSubType" />,
      minWidth: 200,
      headerAlign: "center",
      align:'left'
    },
    {
      field: "level",
      headerName: <FormattedLabel id="level" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 180,
      headerAlign: "center",
      align: "left",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);

                let key = areaNames?.find(
                  (data) =>
                    data?.zoneId == params?.row?.zoneKey &&
                    data?.wardId == params?.row?.wardKey &&
                    data?.areaId == params?.row?.areaKey
                );

                const finalData = {
                  ...params?.row,
                  uniqueId: key?.areaId,
                  areaKey: key?.uniqueId,
                };
                reset(finalData);
                settempUser(true);
                setComplaintFlag(true);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row.id);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </div>
        );
      },
    },
  ];

  // getAllUsersWithDept
  const getAllUsersWithDept = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.GM}/empGrievanceLevelMapping/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res?.status === 200 || res?.status === 201) {
          let result = res?.data?.empGrievanceLevelMappingList;
          let _res = result?.map((val, i) => {
            return {
              activeFlag: val.activeFlag,
              id: val.id,
              srNo: i + 1 + _pageNo * _pageSize,
              depName: val?.depName,
              userKey: val?.userKey,
              areaKey: val?.areaKey,
              subdeptKey: val?.subdeptKey,
              user_NameEn:
                (val?.firstName ? val?.firstName : "") +
                " " +
                (val?.middleName ? val?.middleName : "") +
                " " +
                (val?.lastName ? val?.lastName : ""),
              user_NameMr:
                (val?.firstNameMr ? val?.firstNameMr : "") +
                " " +
                (val?.middleNameMr ? val?.middleNameMr : "") +
                " " +
                (val?.lastNameMr ? val?.lastNameMr : ""),
              userName: val?.userName,
              level: val?.level,
              deptKey: val?.deptKey,
              depNameEn: newFunctionForNullValues("en", val?.depName),
              depNameMr: newFunctionForNullValues("mr", val?.depNameMr),
              complaintTypeKey: val?.complaintTypeKey,
              complaintTypeNameEn: newFunctionForNullValues(
                "en",
                val?.complaintTypeName
              ),
              complaintTypeNameMr: newFunctionForNullValues(
                "mr",
                val?.complaintTypeNameMr
              ),
              complaintSubTypeKey: val?.complaintSubTypeKey,
              complaintSubTypeNameEn: newFunctionForNullValues(
                "en",
                val?.complaintSubTypeName
              ),
              complaintSubTypeNameMr: newFunctionForNullValues(
                "mr",
                val?.complaintSubTypeNameMr
              ),
              areaKey: val?.areaKey,
              wardKey: val?.wardKey,
              zoneKey: val?.zoneKey,
              officeLocation: val.officeLocations,
            };
          });

          setData({
            rows: _res,
            totalRows: res?.data?.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res?.data?.pageSize,
            page: res?.data?.pageNo,
          });
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };

  // getArea
  const getAreas = () => {
    setLoading(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaNameByModuleId?moduleId=9`
      ,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res?.status === 200 || res?.status === 201) {
          if (res?.data.length !== 0) {
            setAreaNames(
              res?.data?.map((r, i) => ({
                id: r?.areaId,
                srNo: i + 1,
                areaId: r?.areaId,
                zoneId: r?.zoneId,
                wardId: r?.wardId,
                zoneName: r?.zoneName,
                zoneNameMr: r?.zoneNameMr,
                wardName: r?.wardName,
                wardNameMr: r?.wardNameMr,
                areaName: r?.areaName,
                areaNameMr: r?.areaNameMr,
                uniqueId: r?.id,
              }))
            );
          } else {
            setValue("wardKey", "");
            setValue("zoneKey", "");
            sweetAlert({
              title: language === "en" ? "OOPS!" : "क्षमस्व!",
              text:
                language === "en"
                  ? "There Are No Areas Match With Your Search!"
                  : "तुमच्या शोधाशी जुळणारे कोणतेही क्षेत्र नाहीत!",
              icon: "warning",
              dangerMode: true,
              button: language === "en" ? "Ok" : "ठीक आहे",
              closeOnClickOutside: false,
            });
          }
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error1) => {
        setLoading(false);
        cfcErrorCatchMethod(error1,true);
      });
  };

  const getAllUsersOnLoad = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllUsersOnLoad(
            res?.data?.user?.map((r, i) => ({
              id: r.id,
              userName: r.userName,
              firstNameEn: r.firstNameEn,
              firstNameMr: r.firstNameMr,
              middleNameEn: r.middleNameEn,
              middleNameMr: r.middleNameMr,
              lastNameEn: r.lastNameEn,
              lastNameMr: r.lastNameMr,
            }))
          );
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            button: language === "en" ? "Ok" : "ठीक आहे",
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error2) => {
        cfcErrorCatchMethod(error2,true);
      });
  };

  // getAllZones
  const getAllZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllZones(
            res?.data?.zone?.map((r, i) => ({
              id: r.id,
              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            }))
          );
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((error2) => {
        cfcErrorCatchMethod(error2,true);
      });
  };

  // getAllWards
  const getAllWards = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllWards(
            res?.data?.ward?.map((r, i) => ({
              id: r.id,
              wardName: r.wardName,
              wardNameMr: r.wardNameMr,
            }))
          );
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((error3) => {
        cfcErrorCatchMethod(error3,true);
      });
  };

  // subDepartment
  const getSubDepartmentBasedonDepartment = () => {
    setLoading(true);
    axios
      .get(
        `${
          urls.CFCURL
        }/master/subDepartment/getBySubDepartment?department=${watch(
          "deptKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        if (res?.status == 200 || res?.status == 201) {
          setSubDepartments(
            res?.data?.subDepartment?.map((r) => ({
              id: r.id,
              subDepartmentEn: r.subDepartment,
              subDepartmentMr: r.subDepartmentMr,
            }))
          );
        } else {
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,true);
      });
  };

  // getDepartment

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((res) => {
      let data = res.data.department.map((r, i) => ({
        id: r.id,
        departmentEn: r.department,
        departmentMr: r.departmentMr,
      }));
      setDepartments(data.sort(sortByProperty("departmentEn")));
    }).catch((err) => {
      setLoading(false);
      cfcErrorCatchMethod(err,true);
    });
  };

  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  //getSubDepartments
  const getSubDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/subDepartment/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let data = res?.data?.subDepartment?.map((r) => ({
            id: r.id,
            subDepartmentEn: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }));
          setSubDepartments(data.sort(sortByProperty("subDepartmentEn")));
        } else {
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,true);
      });
  };

  // getComplaintSubType
  const getComplaintSubType = () => {
    if (watch("complaintTypeKey")) {
      setLoading(true);
      axios
        .get(
          `${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${watch(
            "complaintTypeKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res?.status === 200 || res?.status === 201) {
            if (res.data.complaintSubTypeMasterList.length == 0) {
              setValue("complaintSubTypeKey", null);
            }

            let data = res.data.complaintSubTypeMasterList.map((r, i) => ({
              id: r.id,
              complaintSubTypeMr: r.complaintSubTypeMr,
              complaintSubType: r.complaintSubType,
              complaintTypeMr: r.complaintTypeMr,
              complaintTypeId: r.complaintTypeId,
            }));
            setComplaintSubTypes(data.sort(sortByProperty("complaintSubType")));
          }
        })
        .catch((error) => {
          setLoading(false);
          cfcErrorCatchMethod(error,false);
        });
    }
  };

  const gettOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data?.officeLocation != null &&
            res?.data?.officeLocation != undefined &&
            res?.data?.officeLocation.length != 0
          ) {
            let data = res?.data?.officeLocation?.map((r, i) => ({
              id: r?.id,
              officeLocationName: r?.officeLocationName,
              officeLocationNameMar: r?.officeLocationNameMar,
            }));
            setOfficeLocationName(
              data.sort(sortByProperty("officeLocationName"))
            );
          } else {
          }
        } else {
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,true);
      });
  };

  //getAllUsers
  let getAllUsers = () => {
    setLoading(true);
    axios
      .get(`${urls.GM}/master/user/getAllBydept?dept=${watch("deptKey")}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        let result = res.data;
        let _res = result?.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1,
            firstNameEn:
              allUsersOnLoad &&
              allUsersOnLoad.find((obj) => obj.id === val.userId)?.firstNameEn,
            firstNameMr:
              allUsersOnLoad &&
              allUsersOnLoad.find((obj) => obj.id === val.userId)?.firstNameMr,
            middleNameEn:
              allUsersOnLoad &&
              allUsersOnLoad.find((obj) => obj.id === val.userId)?.middleNameEn,
            middleNameMr:
              allUsersOnLoad &&
              allUsersOnLoad.find((obj) => obj.id === val.userId)?.middleNameMr,
            lastNameEn:
              allUsersOnLoad &&
              allUsersOnLoad.find((obj) => obj.id === val.userId)?.lastNameEn,
            lastNameMr:
              allUsersOnLoad &&
              allUsersOnLoad.find((obj) => obj.id === val.userId)?.lastNameMr,
            userId: val.userId,
            officeId: val.officeId,
            userName:
              allUsersOnLoad &&
              allUsersOnLoad.find((obj) => obj.id === val.userId)?.userName,
            OfficeLocationName:
              OfficeLocationName &&
              OfficeLocationName?.find((obj) => obj?.id == val?.officeId)
                ?.officeLocationName,
            OfficeLocationNameMr:
              OfficeLocationName &&
              OfficeLocationName?.find((obj) => obj?.id == val?.officeId)
                ?.officeLocationNameMar,
          };
        });
        setUsersAgainstDept(_res.sort(sortByProperty("firstNameEn")));
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };

  //getComplaintTypes
  const getComplaintTypes = () => {
    if (watch("deptKey")) {
      setLoading(true);
      axios
        .get(
          `${urls.GM}/complaintTypeMaster/getByDepId?id=${watch("deptKey")}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          let data = res?.data?.complaintTypeMasterList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            complaintTypeEn: r.complaintType,
            complaintTypeMr: r.complaintTypeMr,
            departmentId: r.departmentId,
            departmentName: r.departmentName,
          }));
          setComplaintTypes(data.sort(sortByProperty("complaintTypeEn")));
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  // getLevelsBasedOnId
  const getLevelsBasedOnId = () => {
    if (watch("deptKey") != null || watch("complaintTypeKey") != null) {
      let finalBodyForApi = {
        department: watch("deptKey"),
        subDepartment: watch("subdeptKey"),
        complaintTypeId: watch("complaintTypeKey"),
        complaintSubTypeId: watch("complaintSubTypeKey"),
        area: Number(watch("uniqueId")),
        ward: watch("wardKey"),
        zone: watch("zoneKey"),
      };

      // url
      let url = `${urls.GM}/empGrievanceLevelMapping/getLevels`;
      setLoading(true);
      axios
        .post(url, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res?.status == 200 || res?.status == 201) {
            if (
              res?.data != null &&
              res?.data != undefined &&
              res?.data?.totalLevels != null &&
              res?.data?.totalLevels != undefined
            ) {
              if (
                res?.data?.totalLevels != null &&
                res?.data?.totalLevels != undefined &&
                res?.data?.totalLevels != ""
              ) {
                const level = [];
                for (var i = 1; i <= res?.data?.totalLevels; i++) {
                  level.push({
                    id: i,
                    srNo: i + 1,
                    levels: i,
                  });
                }
                setLevels(level);
                clearErrors("level");
              }
            } else {
              setLoading(false);
              setValue("level", []);
              setLevels([]);
              toast.error(
                language === "en"
                  ? "Level is not avalible Plase select another complaint type !!!"
                  : "स्तर उपलब्ध नाही, कृपया दुसरा तक्रार प्रकार निवडा !!!",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  className: "foo-bar",
                }
              );
         
              clearErrors("level");
            }
          } else {
            setLoading(false);
            toast.error(
              language === "en"
                ? "Level is not avalible Plase select another complaint type !!!"
                : "स्तर उपलब्ध नाही, कृपया दुसरा तक्रार प्रकार निवडा !!!",
              {
                position: toast.POSITION.TOP_RIGHT,
                className: "foo-bar",
              }
            );
            setValue("level", null);
            clearErrors("level");
            setLevels([]);
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  const setWardZoneBasedOnArrray = () => {
    if (watch("uniqueId" != null) && watch("areaKey") != null) {
      let filteredArrayZone = areaNames?.filter(
        (obj) => obj?.areaId == watch("uniqueId")
      );

      let anotherFind = filteredArrayZone?.find(
        (data) => data?.uniqueId == watch("areaKey")
      );
      setValue("zoneKey", anotherFind?.zoneId);
      setValue("wardKey", anotherFind?.wardId);
    } else {
      setValue("zoneKey", null);
      setValue("wardKey", null);
    }
  };

  // ! ===========> useEffects <===================

  useEffect(() => {
    // setValue("loadderState", false);
    getAllUsersWithDept();
    getAreas();
    // getAreaName();
    getDepartment();
    getAllZones();
    getAllWards();
    getSubDepartments();
    getAllUsersOnLoad();
    gettOfficeLocation();
    if (watch("deptKey")) {
      if (complaintTypes.length === 0 || !watch("complaintTypeKey")) {
        setComplaintSubTypes([]);
      }
    }
  }, []);



  useEffect(() => {
    if (watch("deptKey") || tempUser) {
      getAllUsers();
    }
  }, [watch("deptKey"), tempUser]);

  useEffect(() => {
    if (
      watch("deptKey") != null &&
      watch("deptKey") != "" &&
      watch("deptKey") != undefined
    ) {
      getComplaintTypes();
      getSubDepartmentBasedonDepartment();
    }
  }, [watch("deptKey")]);

  useEffect(() => {
    if (watch("complaintTypeKey") || complaintFlag) {
      getComplaintSubType();
    }
  }, [watch("complaintTypeKey"), complaintFlag]);


  useEffect(() => {
    console.log("subDept1214", watch("subdeptKey"), subDepartments);
  }, [watch("subdeptKey"), subDepartments]);


  useEffect(() => {
    console.log(
      "Keys2323",
      watch("zoneKey"),
      watch("deptKey"),
      watch("complaintTypeKey"),
      watch("areaKey"),
      watch("wardKey")
    );

    if (
      watch("zoneKey") != null &&
      watch("deptKey") != null &&
      watch("complaintTypeKey") != null &&
      watch("areaKey") != null &&
      watch("wardKey") != null
    ) {
      getLevelsBasedOnId();
    }
  }, [
    watch("deptKey"),
    watch("subDepartment"),
    watch("complaintTypeKey"),
    watch("complaintSubTypeKey"),
    watch("areaKey"),
    watch("wardKey"),
    watch("zoneKey"),
  ]);


  return (
    <>
      <>
        <>
          <BreadcrumbComponent />
        </>
        {loading && <CommonLoader/>}
        <div>
          <Paper
            elevation={8}
            variant="outlined"
            sx={{
              border: 1,
              borderColor: "grey.500",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "10px",
              marginBottom: "60px",
              padding: 1,
            }}
          >
            <Box>
              <Grid
                container
                style={{
                  display: "flex",
                  alignItems: "center", // Center vertically
                  alignItems: "center",
                  width: "100%",
                  height: "auto",
                  overflow: "auto",
                  color: "white",
                  fontSize: "18.72px",
                  borderRadius: 100,
                  fontWeight: 500,
                  background:
                    "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
                }}
              >
                <Grid item xs={1}>
                  <IconButton
                    style={{
                      color: "white",
                    }}
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      marginRight: "2rem",
                    }}
                  >
                    <FormattedLabel id="addUsersBasedOnDepartment" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "1rem",
                      }}
                    >
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          error={!!errors?.areaKey}
                          sx={{ m: { xs: 0 }, minWidth: "100%" }}
                        >
                          <Controller
                            //! Sachin_😴
                            name="areaKey"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                              <Autocomplete
                                id="controllable-states-demo"
                                variant="standard"
                                onChange={(event, newValue) => {
                                  setValue("uniqueId", newValue?.id);
                                  onChange(
                                    newValue ? newValue?.uniqueId : null
                                  );
                                  setWardZoneBasedOnArrray();
                                }}
                                value={
                                  areaNames?.find(
                                    (data) => data?.uniqueId === value
                                  ) || null
                                }
                                options={areaNames} //! api Data
                                getOptionLabel={(areaName) =>
                                  language == "en"
                                    ? areaName?.uniqueId +
                                      " -" +
                                      areaName?.areaName +
                                      " - " +
                                      areaName?.zoneName +
                                      " - " +
                                      areaName?.wardName
                                    : areaName?.uniqueId +
                                      "-" +
                                      areaName?.areaNameMr +
                                      " - " +
                                      areaName?.zoneNameMr +
                                      " -" +
                                      areaName?.wardNameMr
                                } 
                                renderInput={(params) => (
                                  <TextField
                                    variant="standard"
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                    {...params}
                                    label={
                                      language == "en"
                                        ? "Area Name"
                                        : "Area Name"
                                    }
                                  />
                                )}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.areaKey ? errors?.areaKey?.message : null}
                          </FormHelperText>
                        </FormControl>
                    
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.zoneKey}
                        >
                          <InputLabel
                            shrink={watch("zoneKey") == null ? false : true}
                            id="demo-simple-select-standard-label"
                          >
                            <FormattedLabel id="zone" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                disabled
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field?.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {allZones &&
                                  allZones.map((allZones, index) => (
                                    <MenuItem key={index} value={allZones?.id}>
                                      {allZones?.zoneName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zoneKey"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.zoneKey ? errors.zoneKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/** Ward Name */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.wardKey}
                        >
                          <InputLabel
                            shrink={watch("wardKey") == null ? false : true}
                            id="demo-simple-select-standard-label"
                          >
                            <FormattedLabel id="ward" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field?.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {allWards &&
                                  allWards?.map((allWards, index) => (
                                    <MenuItem key={index} value={allWards?.id}>
                                      {allWards?.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="wardKey"
                            control={control}
                            defaultValue={null}
                          />

                          <FormHelperText>
                            {errors?.wardKey ? errors.wardKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/** DepartmentName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.deptKey}
                        >
                          <InputLabel
                            shrink={watch("deptKey") == null ? false : true}
                            id="demo-simple-select-standard-label"
                          >
                            <FormattedLabel id="departmentName" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field?.onChange(value);
                                }}
                                label={
                                  <FormattedLabel
                                    id="departmentName"
                                    required
                                  />
                                }
                              >
                                {departments &&
                                  departments.map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {language == "en"
                                        ? department?.departmentEn
                                        : department?.departmentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="deptKey"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.deptKey ? errors.deptKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/** Sub Department*/}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors?.subdeptKey}
                        >
                          <InputLabel
                            shrink={watch("subdeptKey") == null ? false : true}
                            id="demo-simple-select-standard-label"
                          >
                            {language == "en" ? "Sub Department" : "उपविभाग"}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label={
                                  language == "en"
                                    ? "Sub Department"
                                    : "उपविभाग"
                                }
                              >
                                {subDepartments &&
                                  subDepartments?.map(
                                    (subDepartment, index) => (
                                      <MenuItem
                                        key={index}
                                        value={subDepartment?.id}
                                      >
                                        {language == "en"
                                          ? subDepartment?.subDepartmentEn
                                          : subDepartment?.subDepartmentMr}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="subdeptKey"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.subdeptKey
                              ? errors?.subdeptKey?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/** Complaint Type */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.complaintTypeKey}
                        >
                          <InputLabel
                            shrink={
                              watch("complaintTypeKey") == null ? false : true
                            }
                            id="demo-simple-select-standard-label"
                          >
                            <FormattedLabel id="complaintTypes" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {complaintTypes &&
                                  complaintTypes.map((complaintType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={complaintType?.id}
                                    >
                                      {language == "en"
                                        ? complaintType?.complaintTypeEn
                                        : complaintType?.complaintTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="complaintTypeKey"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.complaintTypeKey
                              ? errors.complaintTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/** Complaint Sub Type */}
                      {complaintSubTypes && complaintSubTypes?.length !== 0 ? (
                        <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        >
                          <FormControl
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            error={!!errors?.complaintSubTypeKey}
                          >
                            <InputLabel
                              shrink={
                                watch("complaintSubTypeKey") == null
                                  ? false
                                  : true
                              }
                              id="demo-simple-select-standard-label"
                            >
                              <FormattedLabel id="complaintSubTypes" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{
                                    m: { xs: 0, md: 1 },
                                    minWidth: "100%",
                                  }}
                                  variant="standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Sub-Complaint Type"
                                >
                                  {complaintSubTypes &&
                                    complaintSubTypes.map(
                                      (complaintSubType, index) => (
                                        <MenuItem
                                          key={index}
                                          value={complaintSubType?.id}
                                        >
                                          {language == "en"
                                            ? complaintSubType.complaintSubType
                                            : complaintSubType.complaintSubTypeMr}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="complaintSubTypeKey"
                              control={control}
                              defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.complaintSubTypeKey
                                ? errors.complaintSubTypeKey.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : (
                        ""
                      )}
                      {/** userName */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.userKey}
                        >
                          <InputLabel
                            shrink={watch("userKey") == null ? false : true}
                            id="demo-simple-select-standard-label"
                          >
                            <FormattedLabel id="user" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label={<FormattedLabel id="user" required />}
                              >
                                {usersAgainstDept &&
                                  usersAgainstDept.map((user, index) => (
                                    <MenuItem key={index} value={user.userId}>
                                      {language == "en"
                                        ? user?.firstNameEn +
                                          " " +
                                          user?.middleNameEn +
                                          " " +
                                          user?.lastNameEn +
                                          " - " +
                                          user?.OfficeLocationName
                                        : user?.firstNameMr +
                                          " " +
                                          user?.middleNameMr +
                                          " " +
                                          user?.lastNameMr +
                                          " - " +
                                          user?.OfficeLocationNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="userKey"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.userKey ? errors?.userKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/** Level */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.level}
                        >
                          <InputLabel
                            shrink={watch("level") == null ? false : true}
                            id="demo-simple-select-label"
                          >
                            <FormattedLabel id="levels" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label={<FormattedLabel id="levels" required />}
                              >
                                {levels &&
                                  levels.map((levels, index) => (
                                    <MenuItem
                                      key={index}
                                      value={levels?.levels}
                                    >
                                      {language == "en"
                                        ? levels?.levels
                                        : levels?.levels}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="level"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.level ? errors.level.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/** Buttons */}
                    <Grid container style={{ padding: "1rem" }} spacing={2}>
                    <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                          size="small"
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                          size="small"
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                          size="small"
                        >
                          { btnSaveText==='Save'?<FormattedLabel id='save'/>:<FormattedLabel id='update'/>}
                        </Button>
                      </Grid>
                    
                    </Grid>
                  </form>
                </div>
              </Slide>
            )}
            <Grid
              container
              style={{ padding: "10px" }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={9}></Grid>
              <Grid
                item
                xs={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  type="primary"
                  size="small"
                  disabled={buttonInputState}
                  onClick={() => {
                    reset({
                      ...resetValuesExit,
                    });
                    setEditButtonInputState(true);
                    setBtnSaveText("Save");
                    setButtonInputState(true);
                    setSlideChecked(true);
                    setIsOpenCollapse(!isOpenCollapse);
                  }}
                >
                  {<FormattedLabel id="add" />}
                </Button>
              </Grid>
            </Grid>

           
              <Box
                style={{
                  height: "auto",
                  overflow: "auto",
                  padding: "10px",
                }}
              >
                <DataGrid
                  autoHeight
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                  sx={{
                    overflowY: "scroll",
                    marginTop: "20px",
                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  density="compact"
                  pagination
                  paginationMode="server"
                  rowCount={data?.totalRows}
                  rowsPerPageOptions={data?.rowsPerPageOptions}
                  page={data?.page}
                  pageSize={data?.pageSize}
                  rows={data?.rows || []}
                  columns={columns}
                  onPageChange={(_data) => {
                    getAllUsersWithDept(data?.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    getAllUsersWithDept(_data, data?.page);
                  }}
                />
              </Box>
            
          </Paper>
        </div>
      </>
    </>
  );
};

export default Index;
