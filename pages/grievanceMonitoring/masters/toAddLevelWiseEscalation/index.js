import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Typography,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  Breadcrumbs,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
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
import styles from "./view.module.css";
import { getLEVEL_WISE_ESCALATIONFromLocalStorage } from "../../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import { useRouter } from "next/router";
import Schema from "../../../../containers/schema/grievanceMonitoring/levelWiseEscalationDuration";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
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
    mode: "onSubmit",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [levelToEdit, setLevelToEdit] = useState(null);
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((store) => store.labels.language);
  const [levelsToSend, setLevelsToSend] = useState([]);
  const [levelsDropdown, setLevelsDropdown] = useState([]);
  const [levelVariable, setLevelVariable] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const [dataFromLocalStorage] = useState(
    getLEVEL_WISE_ESCALATIONFromLocalStorage("Level_Wise_Escalation")
      ? getLEVEL_WISE_ESCALATIONFromLocalStorage("Level_Wise_Escalation")
      : []
  );
  
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
  const getAllAmenities = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(
        `${urls.GM}/levelwiseEscalationDuration/getByComplaintId?id=${dataFromLocalStorage?.id}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        if (res?.status == 200 || res?.status == 201) {
          let result = res?.data;
          let _res = result?.map((val, i) => {
            return {
              id: val.id,
              activeFlag: val.activeFlag,
              srNo: i + 1,
              complaintTypeLevelsKey: val.complaintTypeLevelsKey,
              complaintTypeEn: dataFromLocalStorage?.complaintTypeName,
              complaintTypeMr: dataFromLocalStorage?.complaintTypeNameMr,
              complaintSubTypeEn: dataFromLocalStorage?.complaintSubTypeName,
              complaintSubTypeMr: dataFromLocalStorage?.complaintSubTypeNameMr,
              deptKey: val.deptKey,
              departmentEn: dataFromLocalStorage?.depName,
              departmentMr: dataFromLocalStorage?.depNameMr,
              subDepartmentKey: val.subDepartmentKey,
              subDepartmentEn: dataFromLocalStorage?.subDepName,
              subDepartmentMr: dataFromLocalStorage?.subDepNameMr,
              level: val.level,
              duration: val.duration,
              durationType: val.durationType,
            };
          });
          setData({
            rows: _res,
            totalRows: res?.data?.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res?.data?.pageSize,
            page: res?.data?.pageNo,
          });
          setLevelVariable(_res.map((obj) => obj.level));
          setLoading(false);
        } else {
          setLoading(false);
          sweetAlert({
            title: language == "en" ? "Error" : "त्रुटी !",
            closeOnClickOutside: false,
            dangerMode: true,
            text:
              language == "en"
                ? "Something Went To Wrong !"
                : "काहीतरी चूक झाली!",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
      
        }
      })
      .catch((error) => {
        setLoading(false);
        cfcErrorCatchMethod(error,false);
      });
  };

  useEffect(() => {
    getAllAmenities();
  }, [dataFromLocalStorage?.id]);

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
            : 'तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ? ',
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        setLoading(true);
        if (willDelete === true) {
          axios
            .post(`${urls.GM}/levelwiseEscalationDuration/save`, body, {
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
                }).then((will)=>{
                  if(will){
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
            .post(`${urls.GM}/levelwiseEscalationDuration/save`, body, {
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
                    getAllAmenities();
                    setButtonInputState(false);
                  }
                });;
              }
            })
            .catch((error) => {
              setLoading(true);
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


  // Reset Values Exit
  const resetValuesExit = {
    complaintTypeLevelsKey: "",
    deptKey: "",
    subDepartmentKey: "",
    level: "",
    duration: "",
    selectedOption: "",
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setBtnSaveText('Save')
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  let checkingSandU = (finalBodyForApi, finalBodyForUpdate) => {

      return axios.post(
        `${urls.GM}/levelwiseEscalationDuration/save`,
        finalBodyForUpdate,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    let valueToSend = 0;
    if (watch("selectedOption") === "days") {
      valueToSend = parseInt(formData.days) * 24 * 60;
    } else if (watch("selectedOption") === "hours") {
      valueToSend = parseInt(formData.hours) * 60;
    }
    let finalBodyForApi = {
      complaintTypeLevelsKey: dataFromLocalStorage?.id,
      level: formData.level,
      duration: valueToSend,
      durationType: watch("selectedOption"),
    };

    const finalBodyForUpdate = {
      id: formData.id,
      activeFlag: "Y",
      complaintTypeLevelsKey: dataFromLocalStorage?.id,
      level: formData.level,
      duration: valueToSend,
      durationType: watch("selectedOption"),
    };

    setLoading(true);
    checkingSandU(finalBodyForApi, finalBodyForUpdate)
      .then((res) => {
    setLoading(false);
        if (res.status == 200 || res.status == 201) {
          btnSaveText != "Save"
            ? sweetAlert({
                title: language === "en" ? "Updated!" : "अपडेट केले",
                text:
                  language === "en"
                    ? "Record Updated successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will)=>{
                if(will){
                  getAllAmenities();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setLoading(false);
                }
              })
            : sweetAlert({
                title: language === "en" ? "Saved!" : "जतन केले!",
                text:
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will)=>{
                if(will){
                  getAllAmenities();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setLoading(false);
                }
              });
        }
      })
      .catch((error) => {
        setLoading(false);
        cfcErrorCatchMethod(error,false);
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "complaintTypeEn" : "complaintTypeMr",
      headerName: <FormattedLabel id="complaintType" />,
      flex: 1,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language === "en" ? "complaintSubTypeEn" : "complaintSubTypeMr",
      headerName: <FormattedLabel id="complaintSubType" />,
      headerAlign: "center",
      flex: 1,
      align:'left'
    },
    {
      field: language === "en" ? "departmentEn" : "departmentMr",
      headerName: <FormattedLabel id="depName" />,
      headerAlign: "center",
      flex: 1,
      align:'left'
    },
    {
      field: language === "en" ? "subDepartmentEn" : "subDepartmentMr",
      headerName: <FormattedLabel id="subDepName" />,
      headerAlign: "center",
      flex: 1,
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
      field: "defaultEscDuration",
      headerName: <FormattedLabel id="durations" />,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.durationType === "days" && (
              <div>
                {params?.row?.duration / 1440}{" "}
                {params?.row?.duration / 1440 == 1
                  ? "day"
                  : params?.row?.durationType}
              </div>
            )}
            {params?.row?.durationType === "hours" && (
              <div>
                {params?.row?.duration / 60} {params?.row?.durationType}
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
                setBtnSaveText("Update"),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
                setLevelToEdit(params?.row?.level);
                setValue("selectedOption", params?.row?.durationType);
                {
                  params?.row?.durationType === "days" &&
                    setValue("days", params?.row?.duration / 1440);
                }
                {
                  params?.row?.durationType === "hours" &&
                    setValue("hours", params?.row?.duration / 60);
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
                setBtnSaveText("Update"),
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
          </div>
        );
      },
    },
  ];

  let pushToArray = [];
  let settngLevels = () => {
    if (dataFromLocalStorage?.totalLevels) {
      for (let i = 1; i <= dataFromLocalStorage?.totalLevels; i++) {
        pushToArray.push(i);
      }
      setLevelsToSend(pushToArray);
    }
  };

  useEffect(() => {
    if (dataFromLocalStorage?.totalLevels) {
      settngLevels();
    }
  }, [dataFromLocalStorage?.totalLevels]);


  let mergeTwoArrays = () => {
    if (levelVariable && levelsToSend.length > 0) {
      if (btnSaveText == "Save") {
        let ResultMerge = levelsToSend?.filter(
          (item) => !levelVariable?.includes(item)
        );
        setLevelsDropdown(ResultMerge);
      } else {
        if (levelToEdit !== null) {
          let ResultMerge = levelsToSend?.filter(
            (item) => !levelVariable?.includes(item)
          );
          setLevelsDropdown([...ResultMerge, levelToEdit]);
        }
      }
    }
  };

  useEffect(() => {
    mergeTwoArrays(levelVariable, levelsToSend);
  }, [slideChecked, isOpenCollapse, levelVariable, levelsToSend]);

  return (
    <>
      <>
        <Breadcrumbs aria-label="breadcrumb" sx={{ padding: "10px" }}>
          <Typography
            color="primary"
            sx={{
              fontSize: "12px",
            }}
          >
            {"Grievance Monitoring > Masters > Level Wise Escalation Duration"}
          </Typography>
        </Breadcrumbs>
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
                    <FormattedLabel id="levelWiseEscalationDuration" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <>
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
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="outlined-basic"
                            label={<FormattedLabel id="complaintType" />}
                            variant="standard"
                            {...register("complaintTypeKey")}
                            error={!!errors.complaintTypeKey}
                            helperText={
                              errors?.complaintTypeKey
                                ? errors.complaintTypeKey.message
                                : null
                            }
                            value={
                              language == "en"
                                ? dataFromLocalStorage?.complaintTypeName
                                : dataFromLocalStorage?.complaintTypeNameMr
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="outlined-basic"
                            label={<FormattedLabel id="complaintSubType" />}
                            variant="standard"
                            {...register("subComplaintTypeLevelsKey")}
                            error={!!errors.subComplaintTypeLevelsKey}
                            helperText={
                              errors?.subComplaintTypeLevelsKey
                                ? errors.subComplaintTypeLevelsKey.message
                                : null
                            }
                            value={
                              language == "en"
                                ? dataFromLocalStorage?.complaintSubTypeName
                                : dataFromLocalStorage?.complaintSubTypeNameMr
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="outlined-basic"
                            label={<FormattedLabel id="totalLevels" />}
                            variant="standard"
                            value={dataFromLocalStorage?.totalLevels}
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
                          lg={4}
                          xl={4}
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
                            <InputLabel id="demo-simple-select-label">
                              {<FormattedLabel id="level" required />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  autoFocus
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  variant="standard"
                                  value={field.value}
                                  label={<FormattedLabel id="level" required />}
                                  onChange={(value) => field.onChange(value)}
                                >
                                  {levelsDropdown &&
                                    levelsDropdown
                                      ?.sort((a, b) => (a > b ? 1 : -1))
                                      .map((obj, index) => {
                                        return (
                                          <MenuItem key={index} value={obj}>
                                            {obj}
                                          </MenuItem>
                                        );
                                      })}
                                </Select>
                              )}
                              name="level"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.level ? errors.level.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid
                          container
                          style={{
                            padding: "1rem",
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
                            lg={12}
                            xl={12}
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
                            xs={12}
                            sm={4}
                            md={4}
                            lg={4}
                            xl={4}
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
                                        variant="standard"
                                        label={
                                          <FormattedLabel id="days" required />
                                        }
                                        {...field}
                                      />
                                    </>
                                  )}
                                />
                              ) : (
                                <Controller
                                  name="hours"
                                  control={control}
                                  variant="standard"
                                  defaultValue=""
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <>
                                      {<FormattedLabel id="hours" required />} :{" "}
                                      <Select
                                        sx={{
                                          m: { xs: 0, md: 1 },
                                          minWidth: "100%",
                                        }}
                                        variant="standard"
                                        label="Hours"
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
                      </Grid>

                      <Grid container style={{ padding: "1rem" }} spacing={2}>
                      <Grid
                          item
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
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => {
                              exitButton();
                            }}
                            size="small"
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>

                        <Grid
                          item
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
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => {
                              setValue("level", "");
                              setValue("days", "");
                              setValue("hours", "");
                              setValue("duration", "");
                              setValue("selectedOption", "");
                            }}
                            size="small"
                          >
                            {<FormattedLabel id="clear" />}
                          </Button>
                        </Grid>
                        <Grid
                          item
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
                          <Button
                            type="submit"
                            disabled={!watch("days") && !watch("hours")}
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                            size="small"
                          >
                            {btnSaveText==='Save'?<FormattedLabel id='save'/>:<FormattedLabel id='update'/>}
                          </Button>
                        </Grid>
                      
                      </Grid>
                    </form>
                  </div>
                </Slide>
              )}
              <div className={styles.addbtn}>
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
              </div>
              <Box
                style={{ height: "auto", overflow: "auto", }}
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
                    // marginTop: "10px",
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
                  pageSize={data?.pageSize}
                  rowsPerPageOptions={data.rowsPerPageOptions}
                  rows={data?.rows || []}
                  columns={columns}
                  onPageChange={(_data) => {
                    getAllAmenities(data?.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    getAllAmenities(_data, data?.page);
                  }}
                />
              </Box>{" "}
            </>
          </Paper>
        </div>
      </>
    </>
  );
};

export default Index;
