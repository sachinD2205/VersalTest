import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import Autocomplete from "@mui/material/Autocomplete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Schema from "../../../../containers/schema/grievanceMonitoring/totalLevelsAndDefaultDurationSchema";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useRouter } from "next/router";
import { addLEVEL_WISE_ESCALATIONToLocalStorage } from "../../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {cfcCatchMethod,moduleCatchMethod} from '../../../../util/commonErrorUtil'
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  });

  const [rowId, setRowId] = useState(null);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [hoursToMinutes, setHoursToMinutes] = useState(null);
  const [daysToMinutes, setDaysToMinutes] = useState(null);
  const [areaNames, setAreaNames] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [departments, setDepartments] = useState([
    {
      id: 1,
      departmentEn: "",
      departmentMr: "",
    },
  ]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const [complaintTypes, setcomplaintTypes] = useState([]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const router = useRouter();
  const language = useSelector((store) => store.labels.language);
  const [deptFlag, setDeptFlag] = useState(false);
  const [complaintFlag, setComplaintFlag] = useState(false);
  const [escalates, setEscalates] = useState(false);
  const [slideCheckedForEscalate, setSlideCheckedForEscalate] = useState(false);
  const [levelsToSend, setLevelsToSend] = useState([]);
  const [submitEscalate, setSubmitEscalate] = useState(null);
  const [allZones, setAllZones] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const [loading, setLoading] = useState(false);
  const [dayVal,setDays]=useState()
  useEffect(() => {
    getDepartment();
    getAllAmenities();
  }, []);

  // Get Table - Data
  const getAllAmenities = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.GM}/complaintTypeLevels/getAll`, {
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
        let result = res?.data?.complaintTypeLevelsList;
        let _res = result?.map((val, i) => {
          return {
            id: val.id,
            activeFlag: val.activeFlag,
            srNo: i + 1 + _pageNo * _pageSize,
            complaintSubTypeName: newFunctionForNullValues(
              "en",
              val.complaintSubTypeName
            ),
            complaintSubTypeNameMr: newFunctionForNullValues(
              "mr",
              val.complaintSubTypeNameMr
            ),
            complaintTypeName: newFunctionForNullValues(
              "en",
              val.complaintTypeName
            ),
            complaintTypeNameMr: newFunctionForNullValues(
              "mr",
              val.complaintTypeNameMr
            ),
            defaultEscDuration: val.defaultEscDuration,
            subDepName: newFunctionForNullValues("en", val.subDepName),
            subDepNameMr: newFunctionForNullValues("mr", val.subDepNameMr),
            totalLevels: val.totalLevels,
            depName: newFunctionForNullValues("en", val.depName),
            depNameMr: newFunctionForNullValues("mr", val.depNameMr),
            complaintSubTypeKey: val.complaintSubTypeKey,
            complaintTypeKey: val.complaintTypeKey,
            deptKey: val.deptKey,
            subDepartmentKey: val.subDepartmentKey,
            areaKey: val.areaKey,
            zoneKey: val.zoneKey,
            wardKey: val.wardKey,
            selectedOption: val.durationType,
            defaultEscDuration: val.defaultEscDuration,
          };
        });
        setData({
          rows: _res,
          totalRows: res?.data?.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res?.data?.pageSize,
          page: res?.data?.pageNo,
        });
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,false)
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

  ///////////////////////////
  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available";
    } else {
      return value ? value : "उपलब्ध नाही";
    }
  };

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
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.GM}/complaintTypeLevels/save`, body, {
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

                  icon: "success",
                  button: language === "en" ? "Ok" : "ठीक आहे",
                }).then((will) => {
                  if (will) {
                    getAllAmenities();
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
            text: language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
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
            .post(`${urls.GM}/complaintTypeLevels/save`, body, {
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
                }).then((will) => {
                  if (will) {
                    getAllAmenities();
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
            text: language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
          setButtonInputState(false);
        }
      });
    }
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    complaintSubTypeName: "",
    wardId:'',
    complaintTypeName: "",
    defaultEscDuration: "",
    subDepName: "",
    totalLevels: "",
    depName: "",
    selectedOption: "",
  };

  const handleInputChange = (event) => {
    const input = event.target.value;
    // Use a regular expression to check for special characters
    const regex = /^[a-zA-Z0-9 ]*$/;

    // If the input value contains special characters, do not update the state
    if (/^[a-zA-Z0-9\s]*$/.test(input)) {
      console.log('input', input)
    
      setDays(input)
    }

    // Update the state if the input is valid
    // setInputValue(event.target.value);
  };
  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
    setValue('areaKey','')
    setValue("zoneKey", "");
    setValue("wardkey", null);
    setValue("deptKey", "");
    setValue("complaintTypeKey", "");
    setSubDepartmentList([]);
    setComplaintSubTypes([]);
    setDeptFlag(false);
    setComplaintFlag(false);
  };
  // Reset Values Exit
  const resetValuesExit = {
    complaintSubTypeName: "",
    complaintTypeName: "",
    defaultEscDuration: "",
    subDepName: "",
    totalLevels: "",
    depName: "",
    selectedOption: "",
  };
  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setRowId(null);
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setSubDepartmentList([]);
    setComplaintSubTypes([]);
    setDeptFlag(false);
    setComplaintFlag(false);
  };

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((res) => {
      // sgetDepartments(
      let data = res.data.department.map((r, i) => ({
        id: r.id,
        departmentEn: r.department,
        departmentMr: r.departmentMr,
      }));
      setDepartments(data.sort(sortByProperty("departmentEn")));
    }) .catch((err) => {
      setLoading(false);
      cfcErrorCatchMethod(err,true);
    });
  };

  const getSubDepartmentDetails = () => {
    if (watch("deptKey")) {
      setLoading(true);
      axios
        .get(
          `${urls.GM}/master/subDepartment/getAllByDeptWise/${watch(
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
          let data = res?.data?.subDepartment?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartmentEn: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }));
          setSubDepartmentList(data.sort(sortByProperty("subDepartmentEn")));
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  useEffect(() => {
    if (watch("deptKey") || deptFlag) {
      getSubDepartmentDetails();
    }
  }, [watch("deptKey"), deptFlag]);

  useEffect(() => {
    if (watch("deptKey")) {
      if (watch("complaintTypeKey") || complaintFlag) {
        getComplaintSubType();
      }
    }
  }, [watch("complaintTypeKey"), watch("deptKey"), complaintFlag]);

  useEffect(() => {
    if (watch("deptKey")) {
      if (complaintTypes.length === 0 || !watch("complaintTypeKey")) {
        setComplaintSubTypes([]);
      }
    }
  }, []);

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
          setcomplaintTypes(data.sort(sortByProperty("complaintTypeEn")));
        })
        .catch((error) => {
          setLoading(false);
          cfcErrorCatchMethod(error,false);
        });
    } 
  };

  useEffect(() => {
    getComplaintTypes();
  }, [watch("deptKey")]);

  // Get Table - Data
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
          let data = res.data.complaintSubTypeMasterList.map((r, i) => ({
            id: r.id,
            complaintSubType: r.complaintSubType,
            complaintSubTypeMr: r.complaintSubTypeMr,
            complaintTypeMr: r.complaintTypeMr,
            complaintTypeId: r.complaintTypeId,
          }));
          setComplaintSubTypes(data.sort(sortByProperty("complaintSubType")));
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  let checkingSandU = (finalBodyForApi, finalBodyForUpdate) => {
      return axios.post(
        `${urls.GM}/complaintTypeLevels/save`,
        finalBodyForUpdate,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
  };

  let convertDaysToMinute = () => {
    let days = watch("defaultEscDuration");
    let minutes;
    minutes = days * 24 * 60;
    setDaysToMinutes(minutes);
  };

  useEffect(() => {
    convertDaysToMinute();
  }, [watch("defaultEscDuration")]);

  let convertHoursToMinute = () => {
    let hours = watch("defaultEscDurationInHours");
    let minutes;

    minutes = hours * 60;
    setHoursToMinutes(minutes);
  };

  useEffect(() => {
    convertHoursToMinute();
  }, [watch("defaultEscDurationInHours")]);

  const onSubmitForm = (formData) => {
    let valueToSend = 0;
    if (watch("selectedOption") === "days") {
      valueToSend = parseInt(formData.days) * 24 * 60;
    } else if (watch("selectedOption") === "hours") {
      valueToSend = parseInt(formData.hours) * 60;
    }
    const finalBodyForApi = {
      deptKey: Number(formData.deptKey),
      subDepartmentKey: formData.subDepartmentKey
        ? Number(formData.subDepartmentKey)
        : null,
      complaintTypeKey: formData.complaintTypeKey
        ? Number(formData.complaintTypeKey)
        : null,
      complaintSubTypeKey: formData.complaintSubTypeKey
        ? Number(formData.complaintSubTypeKey)
        : null,
      totalLevels: formData.totalLevels,
      areaKey: Number(watch("uniqueId")),
      zoneKey: watch("zoneKey") ? Number(watch("zoneKey")) : null,
      wardKey: watch("wardKey") ? Number(watch("wardKey")) : null,
      defaultEscDuration: valueToSend,
      durationType: watch("selectedOption"),
    };

    const finalBodyForUpdate = {
      id: rowId !== null ? rowId : null,
      activeFlag: "Y",
      deptKey: Number(formData.deptKey),
      subDepartmentKey: formData.subDepartmentKey
        ? Number(formData.subDepartmentKey)
        : null,
      complaintTypeKey: formData.complaintTypeKey
        ? Number(formData.complaintTypeKey)
        : null,
      complaintSubTypeKey: formData.complaintSubTypeKey
        ? Number(formData.complaintSubTypeKey)
        : null,
      totalLevels: formData.totalLevels ? Number(formData.totalLevels) : null,
      areaKey: Number(watch("uniqueId")),
      zoneKey: watch("zoneKey") ? Number(watch("zoneKey")) : null,
      wardKey: watch("wardKey") ? Number(watch("wardKey")) : null,
      defaultEscDuration: valueToSend,
      durationType: watch("selectedOption"),
    };

    setLoading(true);
    checkingSandU(finalBodyForApi, finalBodyForUpdate)
      .then((res) => {
        setLoading(false);
        if (res.status == 200 || res.status == 201) {
          rowId
            ? sweetAlert({
                title: language === "en" ? "Updated!" : "अपडेट केले",
                text:
                  language === "en"
                    ? "Record Updated Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will) => {
                if (will) {
                  getAllAmenities();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeptFlag(false);
                  setComplaintFlag(false);
                  setSubDepartmentList([]);
                  setComplaintSubTypes([]);
                  setRowId(null);
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
              }).then((will) => {
                if (will) {
                  getAllAmenities();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeptFlag(false);
                  setComplaintFlag(false);
                  setSubDepartmentList([]);
                  setComplaintSubTypes([]);
                  setRowId(null);
                }
              });
        }
      })
      .catch((error) => {
        setLoading(false);
        cfcErrorCatchMethod(error,false);
      });
  };

  /////////////////////////////////ESCALATES//////////////////////////////////
  let handleSaveForEscalate = (formData) => {
    if (submitEscalate !== null) {
      let finalBodyForApiEscalate = {
        complaintTypeLevelsKey: submitEscalate.complaintTypeKey,
        level: watch("level"),
        duration: watch("duration") ? Number(watch("duration")) : null,
      };
      axios.post(
        `${urls.GM}/levelwiseEscalationDuration/save`,
        finalBodyForApiEscalate,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      ).then(()=>{

      }).catch((err)=>{
        cfcErrorCatchMethod(err,false)
      });
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "complaintTypeName" : "complaintTypeNameMr",
      headerName: <FormattedLabel id="complaintName" />,
      minWidth: 300,
      headerAlign: "center",
      align: "left",
    },
    {
      field:
        language === "en" ? "complaintSubTypeName" : "complaintSubTypeNameMr",
      headerName: <FormattedLabel id="complaintSubTypeName" />,
      headerAlign: "center",
      align: "left",
      minWidth: 250,
    },
    {
      field: language === "en" ? "depName" : "depNameMr",
      headerName: <FormattedLabel id="depName" />,
      headerAlign: "center",
      align: "left",
      minWidth: 230,
    },
    {
      field: language === "en" ? "subDepName" : "subDepNameMr",
      headerName: <FormattedLabel id="subDepName" />,
      minWidth: 230,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "totalLevels",
      headerName: <FormattedLabel id="totalLevels" />,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "defaultEscDuration",
      headerName: language==='en'?"Esc Duration":'वाढीचा कालावधी',
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.selectedOption === "days" && (
              <div>
                {params?.row?.defaultEscDuration / 1440}{" "}
                {params?.row?.defaultEscDuration / 1440 == 1
                  ? "day"
                  : params?.row?.selectedOption}
              </div>
            )}
            {params?.row?.selectedOption === "hours" && (
              <div>
                {params?.row?.defaultEscDuration / 60}{" "}
                {params?.row?.selectedOption}
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "left",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              gap: 10,
            }}
          >
            <IconButton
              disabled={isOpenCollapse}
              onClick={() => {
                  setRowId(params?.row?.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
                setDeptFlag(true);
                setComplaintFlag(true);
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
                setValue("selectedOption", params?.row?.selectedOption);
                {
                  params?.row?.selectedOption === "days" &&
                    setValue("days", params?.row?.defaultEscDuration / 1440);
                }
                {
                  params?.row?.selectedOption === "hours" &&
                    setValue("hours", params?.row?.defaultEscDuration / 60);
                }
              }}
            >
              <Tooltip
                title={
                  language === "en"
                    ? `EDIT THIS RECORD`
                    : `हा रेकॉर्ड संपादित करा`
                }
              >
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                  setRowId(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row.id);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip
                  title={
                    language === "en"
                      ? `DE-ACTIVATE THIS RECORD`
                      : `हा रेकॉर्ड डि-सक्रिय करा`
                  }
                >
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  title={
                    language === "en"
                      ? `ACTIVATE THIS RECORD`
                      : "हे रेकॉर्ड सक्रिय करा"
                  }
                >
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                addLEVEL_WISE_ESCALATIONToLocalStorage(
                  "Level_Wise_Escalation",
                  {
                    ...params.row,
                    defaultEscDuration:
                      params.row.selectedOption === "days"
                        ? params?.row?.defaultEscDuration / 1440
                        : params?.row?.defaultEscDuration / 60,
                  }
                );

                router.push({
                  pathname:
                    "/grievanceMonitoring/masters/toAddLevelWiseEscalation",
                });
              }}
            >
              <Tooltip title={`ADD ESCALATION AGAINST THIS RECORD`}>
                <ArrowUpwardIcon />
              </Tooltip>
            </IconButton>
          </div>
        );
      },
    },
  ];

  let pushToArray = [];
  let settngLevels = () => {
    if (watch("totalLevel")) {
      for (let i = 1; i <= watch("totalLevel"); i++) {
        pushToArray.push(i);
      }
      setLevelsToSend(pushToArray);
    }
  };

  useEffect(() => {
    if (escalates === true) {
      settngLevels();
    }
  }, [escalates]);

  const [hoursValue, setHoursValue] = useState("");

  const options = [];
  for (let i = 6; i <= 24; i++) {
    options.push(
      <MenuItem key={i} value={i}>
        {i}
      </MenuItem>
    );
  }

  useEffect(() => {
    getAreas();
  }, []);

  // getArea
  const getAreas = () => {
    setLoading(true);
    axios
    .get(
      `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaNameByModuleId?moduleId=9`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
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
            // setValue("areaName", "");
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
        cfcErrorCatchMethod(error1,true)
      });
  };

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
        cfcErrorCatchMethod(error2,true)
      });
  };

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
      .catch((err) => {
        cfcErrorCatchMethod(err,true);
      });
    }

  useEffect(() => {
    getAllZones();
    getAllWards();
  }, []);

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

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {loading && <CommonLoader />}
      <>
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
                    <FormattedLabel id="totalLevelsAndDefaultDuration" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            {
              <>
                {isOpenCollapse && (
                  <>
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
                                error={!!errors?.areaKey}
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              >
                                <Controller
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
                                      options={areaNames}
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
                                      isOptionEqualToValue={(option, value) =>
                                        option.areaName === value.areaName
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          variant="standard"
                                          {...params}
                                          label={
                                            <FormattedLabel
                                              id="areaName"
                                              required
                                            />
                                          }
                                        />
                                      )}
                                    />
                                  )}
                                />
                                <FormHelperText>
                                  {errors?.areaKey
                                    ? errors?.areaKey?.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                              <FormControl
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                error={!!errors.zoneKey}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="zone" />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled
                                      variant="standard"
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      label="Complaint Type"
                                    >
                                      {allZones &&
                                        allZones.map((allZones, index) => (
                                          <MenuItem
                                            key={index}
                                            value={allZones.id}
                                          >
                                            {language == "en"
                                              ? allZones?.zoneName
                                              : allZones?.zoneNameMr}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="zoneKey"
                                  control={control}
                                  defaultValue=""
                                />
                                {watch("zoneKey") == "" && (
                                  <FormHelperText>
                                    {errors?.zoneKey
                                      ? errors.zoneKey.message
                                      : null}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>

                            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                              <FormControl
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                error={!!errors.wardKey}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="ward" />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled
                                      variant="standard"
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      label="Complaint Type"
                                    >
                                      {allWards &&
                                        allWards?.map((allWards, index) => (
                                          <MenuItem
                                            key={index}
                                            value={allWards.id}
                                          >
                                            {language == "en"
                                              ? allWards.wardName
                                              : allWards.wardNameMr}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="wardKey"
                                  control={control}
                                  defaultValue=""
                                />

                                {watch("wardKey") == "" && (
                                  <FormHelperText>
                                    {errors?.wardKey
                                      ? errors.wardKey.message
                                      : null}
                                  </FormHelperText>
                                )}
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
                                error={!!errors.deptKey}
                              >
                                <InputLabel
                                  shrink={
                                    watch("deptKey") == null ? false : true
                                  }
                                  id="demo-simple-select-standard-label"
                                >
                                  <FormattedLabel
                                    id="departmentName"
                                    required
                                  />
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
                                          <MenuItem
                                            key={index}
                                            value={department.id}
                                          >
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
                                  {errors?.deptKey
                                    ? errors.deptKey.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            {subDepartments?.length !== 0 ? (
                              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                <FormControl
                                  sx={{
                                    m: { xs: 0, md: 1 },
                                    minWidth: "100%",
                                  }}
                                  error={!!errors.subDepartmentKey}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="subDepartmentName" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        variant="standard"
                                        value={field.value}
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label="Sub Department Name"
                                      >
                                        {subDepartments &&
                                          subDepartments?.map(
                                            (subDepartment, index) => (
                                              <MenuItem
                                                key={index}
                                                value={subDepartment.id}
                                              >
                                                {language == "en"
                                                  ? subDepartment.subDepartmentEn
                                                  : subDepartment?.subDepartmentMr}
                                              </MenuItem>
                                            )
                                          )}
                                      </Select>
                                    )}
                                    name="subDepartmentKey"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.subDepartmentKey
                                      ? errors.subDepartmentKey.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </Grid>
                            ) : (
                              ""
                            )}

                            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                              <FormControl
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                error={!!errors.complaintTypeKey}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel
                                    id="complaintTypes"
                                    required
                                  />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      variant="standard"
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      label="Complaint Type"
                                    >
                                      {complaintTypes &&
                                        complaintTypes.map(
                                          (complaintType, index) => (
                                            <MenuItem
                                              key={index}
                                              value={complaintType.id}
                                            >
                                              {language == "en"
                                                ? complaintType.complaintTypeEn
                                                : complaintType?.complaintTypeMr}
                                            </MenuItem>
                                          )
                                        )}
                                    </Select>
                                  )}
                                  name="complaintTypeKey"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.complaintTypeKey
                                    ? errors.complaintTypeKey.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            {complaintSubTypes?.length !== 0 ? (
                              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                <FormControl
                                  sx={{
                                    m: { xs: 0, md: 1 },
                                    minWidth: "100%",
                                  }}
                                  error={!!errors.complaintSubTypeKey}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="complaintSubTypes" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        variant="standard"
                                        value={field.value}
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label="Sub-Complaint Type"
                                      >
                                        {complaintSubTypes &&
                                          complaintSubTypes.map(
                                            (complaintSubType, index) => (
                                              <MenuItem
                                                key={index}
                                                value={complaintSubType.id}
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
                                    defaultValue=""
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

                            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                              <FormControl
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                error={!!errors.totalLevels}
                              >
                                <InputLabel id="demo-simple-select-label">
                                  <FormattedLabel id="levels" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      variant="standard"
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      value={field.value}
                                      label="Level"
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                    >
                                      <MenuItem value={1}>1</MenuItem>
                                      <MenuItem value={2}>2</MenuItem>
                                      <MenuItem value={3}>3</MenuItem>
                                      <MenuItem value={4}>4</MenuItem>
                                      <MenuItem value={5}>5</MenuItem>
                                      <MenuItem value={6}>6</MenuItem>
                                      <MenuItem value={7}>7</MenuItem>
                                      <MenuItem value={8}>8</MenuItem>
                                      <MenuItem value={9}>9</MenuItem>
                                      <MenuItem value={10}>10</MenuItem>
                                    </Select>
                                  )}
                                  name="totalLevels"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.totalLevels
                                    ? errors.totalLevels.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            style={{
                              padding: "10px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "baseline",
                              }}
                            >
                              <Controller
                                name="selectedOption"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <RadioGroup
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      selected={field.value}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "baseline",
                                          flexDirection: "row",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="days"
                                          control={<Radio color="primary" />}
                                          label={
                                            <FormattedLabel id="escDurationInDays" />
                                          }
                                        />
                                        <FormControlLabel
                                          value="hours"
                                          control={<Radio color="primary" />}
                                          label={
                                            <FormattedLabel id="escDurationInHours" />
                                          }
                                        />
                                      </div>
                                    </RadioGroup>
                                    {errors?.selectedOption && (
                                      <FormHelperText sx={{ color: "red" }}>
                                        {errors?.selectedOption
                                          ? errors.selectedOption.message
                                          : null}
                                      </FormHelperText>
                                    )}
                                  </div>
                                )}
                              />
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
                                alignItems: "baseline",
                              }}
                            >
                              {watch("selectedOption") !== "" ? (
                                watch("selectedOption") === "days" ? (
                                  <Controller
                                    name="days"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                      <>
                                        <TextField
                                         onKeyPress={(event) => {
                                          if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                          }
                                        }}
                                        // type="number"
                                        value={dayVal}
                                        //  inputProps={{ pattern: '^[0-9]*$' }}
                                          label={
                                            <FormattedLabel
                                              id="days"
                                              required
                                            />
                                          }
                                          variant="standard"
                                          {...field}
                                        />
                                      </>
                                    )}
                                  />
                                ) : (
                                  <Controller
                                    name="hours"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                      <>
                                        {<FormattedLabel id="hours" required />}{" "}
                                        :{" "}
                                        <Select
                                          sx={{ width: "100px" }}
                                          label="Hours"
                                          value={watch("hours")}
                                          variant="standard"
                                          {...field}
                                        >
                                          {[...Array(18)].map((_, i) => (
                                            <MenuItem key={i + 6} value={i + 6}>
                                              {i + 6}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </>
                                    )}
                                  />
                                )
                              ) : (
                                ""
                              )}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            style={{ padding: "1rem" }}
                            spacing={2}
                          >
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
                                disabled={!watch("days") && !watch("hours")}
                                color="success"
                                endIcon={<SaveIcon />}
                                size="small"
                              >
                             {rowId?<FormattedLabel id='update'/>: <FormattedLabel id='save'/>}
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </div>
                    </Slide>
                  </>
                )}
                {escalates && (
                  <Slide
                    direction="down"
                    in={slideCheckedForEscalate}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div>
                      <form>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            padding: "10px",
                            display: "flex",
                            alignItems: "baseline",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              autoFocus
                              disabled
                              style={{ backgroundColor: "white" }}
                              id="outlined-basic"
                              label="Complaint Type"
                              variant="standard"
                              {...register("complaintTypeLevelsKey")}
                              error={!!errors.complaintTypeLevelsKey}
                              helperText={
                                errors?.complaintTypeLevelsKey
                                  ? errors.complaintTypeLevelsKey.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              disabled
                              style={{ backgroundColor: "white" }}
                              id="outlined-basic"
                              label="Complaint Sub Type"
                              variant="standard"
                              {...register("subComplaintTypeLevelsKey")}
                              error={!!errors.subComplaintTypeLevelsKey}
                              helperText={
                                errors?.subComplaintTypeLevelsKey
                                  ? errors.subComplaintTypeLevelsKey.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              disabled
                              style={{ backgroundColor: "white" }}
                              id="outlined-basic"
                              label="Total Levels"
                              variant="standard"
                              {...register("totalLevel")}
                              error={!!errors.totalLevel}
                              helperText={
                                errors?.totalLevel
                                  ? errors.totalLevel.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Levels
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={field.value}
                                    label="Levels"
                                    onChange={(value) => field.onChange(value)}
                                  >
                                    {levelsToSend &&
                                      levelsToSend?.map((obj, index) => (
                                        <MenuItem key={index} value={obj}>
                                          {obj}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="level"
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              style={{ backgroundColor: "white" }}
                              id="outlined-basic"
                              label="Escalation Duration"
                              variant="standard"
                             
                              error={!!errors.duration}
                              helperText={
                                errors?.duration
                                  ? errors.duration.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>

                        <Grid container style={{ padding: "10px" }} spacing={2}>
                       
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              endIcon={<ExitToAppIcon />}
                              onClick={() => {
                                setValue("level", "");
                                setValue("duration", "");
                                setEscalates(!escalates),
                                  setSlideCheckedForEscalate(true),
                                  setButtonInputState(!buttonInputState);
                              }}
                            >
                              {<FormattedLabel id="exit" />}
                            </Button>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
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
                              onClick={() => {
                                setValue("level", "");
                                setValue("duration", "");
                              }}
                            >
                              {<FormattedLabel id="clear" />}
                            </Button>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              type="button"
                              variant="contained"
                              color="success"
                              size="small"
                              endIcon={<SaveIcon />}
                              onClick={handleSaveForEscalate}
                            >
                           <FormattedLabel id='save'/>
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
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "end" }}
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
                        setButtonInputState(true);
                        setSlideChecked(true);
                        setIsOpenCollapse(!isOpenCollapse);
                      }}
                    >
                      {<FormattedLabel id="add" />}
                    </Button>
                  </Grid>
                </Grid>

                <DataGrid
                  autoHeight={data?.pageSize}
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
                    },
                  }}
                  density="compact"
                  pagination
                  paginationMode="server"
                  rowCount={data?.totalRows}
                  page={data?.page}
                  pageSize={data?.pageSize}
                  rowsPerPageOptions={data?.rowsPerPageOptions}
                  rows={data?.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    getAllAmenities(data?.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    getAllAmenities(_data, data?.page);
                  }}
                />
              </>
            }
          </Paper>
        </div>
      </>
    </>
  );
};

export default Index;
