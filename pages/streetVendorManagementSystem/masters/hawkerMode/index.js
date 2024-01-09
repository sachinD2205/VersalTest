import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import Translation from "../../../../components/streetVendorManagementSystem/components/Translation";
import hawkerModeSchema from "../../../../components/streetVendorManagementSystem/schema/HawkerModeSchema";
import ItemCategoryCSS from "../../../../components/streetVendorManagementSystem/styles/HawkerMode.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
const Index = () => {
  const language = useSelector((state) => state?.labels?.language);
  const [dataValidation, setDataValidation] = useState(
    hawkerModeSchema(language)
  );
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    // methods,
    reset,
    formState: { errors },
  } = methods;
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [applicationNames, setApplicationNames] = useState([]);
  const userToken = useGetToken();
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


  // Hawker Type Data
  const [hawkerModeData, setHawkerModeData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // define colums table
  const hawkerModeColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "applicationNameEn" : "applicationNameMr",
      headerName: <FormattedLabel id="applicationName" />,
      description: <FormattedLabel id="applicationName" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fromDate1",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "toDate1",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "hawkerTypeEn" : "hawkerTypeMr",
      headerName: <FormattedLabel id="hawkerType" />,
      description: <FormattedLabel id="hawkerType" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hawkerMode",
      headerName: <FormattedLabel id="hawkerModeEn" />,
      description: <FormattedLabel id="hawkerModeEn" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hawkerModeMr",
      headerName: <FormattedLabel id="hawkerModeMr" />,
      description: <FormattedLabel id="hawkerModeMr" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update");
                setID(params?.row?.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton>
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
          </>
        );
      },
    },
  ];

  const getHawkerTypes = () => {
    axios
      .get(`${urls.HMSURL}/hawkerType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setHawkerTypes(
            r?.data?.hawkerType?.map((row) => ({
              id: row?.id,
              hawkerTypeMr: row?.hawkerTypeMr,
              hawkerType: row?.hawkerType,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Get Table -

  // Get Hawker Data
  const getHawkerMode = (_pageSize = 10, _pageNo = 0) => {
    setValue("loadderState", true);
    const url = `${urls.HMSURL}/hawkerMode/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let response = res?.data?.hawkerMode;
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              // application name
              applicationName: r?.applicationName,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,
              // applicationName

              toDate: r?.toDate,
              fromDate: r?.fromDate,
              toDate1:
                moment(r?.toDate, "YYYY-MM-DD").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r?.toDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                  : "-",
              fromDate1:
                moment(r?.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r?.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                  : "-",

              hawkerMode: r.hawkerMode,
              hawkerModeMr: r?.hawkerModeMr,
              hawkerType: r?.hawkerType,
              hawkerTypeEn: hawkerTypes?.find((obj) => obj?.id === r.hawkerType)
                ?.hawkerType,
              hawkerTypeMr: hawkerTypes?.find((obj) => obj?.id === r.hawkerType)
                ?.hawkerTypeMr,
              remark: r?.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setHawkerModeData({
            rows: _res,
            totalRows: res?.data?.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res?.data?.pageSize,
            page: res?.data?.pageNo,
          });
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // OnSubmit Form

  const onSubmitForm = (fromData) => {
    setValue("loadderState", true);
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      // activeFlag: btnSaveText === "Update" ? null : null,
      activeFlag: "Y",
    };

    // url
    const url = `${urls.HMSURL}/hawkerMode/save`;

    // Save - DB
    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setValue("loadderState", false);
        if (res?.status == 200 || res?.status == 201) {
          if (fromData?.id) {
            language == "en"
              ? sweetAlert({
                title: "Updated!",
                text: "Record Updated successfully!",
                icon: "success",
                button: "Ok",
              })
              : sweetAlert({
                title: "अपडेट केले!",
                text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                icon: "success",
                button: "ओके",
              });
          } else {
            language == "en"
              ? sweetAlert({
                title: "Saved!",
                text: "Record Saved successfully!",
                icon: "success",
                button: "Ok",
              })
              : sweetAlert({
                title: "जतन केले!",
                text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                icon: "success",
                button: "ओके",
              });
          }
          setButtonInputState(false);
          setIsOpenCollapse(false);
          getHawkerMode();
          setEditButtonInputState(false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // delete
  const deleteById = (value, _activeFlag) => {
    // body
    const body = {
      activeFlag: _activeFlag,
      id: value,
    };

    let url = `${urls.HMSURL}/hawkerMode/save`;

    if (_activeFlag === "N") {
      sweetAlert({
        title: language == "en" ? "Inactivate ?" : "निष्क्रिय ?",
        text:
          language == "en"
            ? "are you sure you want to inactivate this record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setValue("loadderState", true);
          axios
            .post(url, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setValue("loadderState", false);
              if (res?.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record successfully inactive"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय",
                  {
                    icon: "success",
                  }
                );
                getHawkerMode();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setValue("loadderState", false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
        }
      });
    } else {
      sweetAlert({
        title: language == "en" ? "Activate" : "सक्रिय",
        text:
          language == "en"
            ? "are you sure you want to activate this record? "
            : "तुम्हाला खात्री आहे की तुम्ही हा रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setValue("loadderState", true);
          axios
            .post(url, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setValue("loadderState", false);
              if (res.status == 200) {
                sweetAlert(
                  language == "en"
                    ? "record is successfully activated !"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getHawkerMode();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setValue("loadderState", false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
        }
      });
    }
  };


  // Module Name
  const getModuleName = () => {
    const url = `${urls.CFCURL}/master/application/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("applicationApiData", res?.data);
          let temp = [res?.data?.application?.find((data) => data?.id == "4")];
          console.log("tem123", temp);
          setApplicationNames(
            temp?.map((row) => ({
              id: row?.id,
              applicationNameEn: row?.applicationNameEng,
              applictionNameMr: row?.applicationNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
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
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Button
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    hawkerMode: "",
    hawkerModeMr: "",
    hawkerType: null,
    applicationName: null,
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    hawkerMode: "",
    hawkerModeMr: "",
    hawkerType: null,
    applicationName: null,
    remark: "",
    id: null,
  };



  //!  useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getHawkerTypes();
    getModuleName();
  }, []);

  useEffect(() => {
    getHawkerMode();
  }, [hawkerTypes]);

  // View
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div>
          <Paper className={ItemCategoryCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
              <div className={ItemCategoryCSS.MainHeader} elevation={5}>
                {<FormattedLabel id="hawkerMode" />}
              </div>
              {isOpenCollapse && (
                <Slide
                  direction="down"
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  <div>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmitForm)}>
                        <Grid
                          container
                          className={ItemCategoryCSS.GridContainer}
                        >
                          {/** Module Name */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors?.applicationName}
                            >
                              <InputLabel
                                shrink={
                                  watch("applicationName") !== null &&
                                    watch("applicationName") !== "" &&
                                    watch("applicationName") !== undefined
                                    ? true
                                    : false
                                }
                                id="demo-simple-select-standard-label"
                              >
                                <FormattedLabel id="applicationName" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemCategoryCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="applicationName"
                                      required
                                    />
                                  >
                                    {applicationNames &&
                                      applicationNames.map(
                                        (applicationName) => (
                                          <MenuItem
                                            key={applicationName?.id + 1}
                                            value={applicationName?.id}
                                          >
                                            {language == "en"
                                              ? applicationName?.applicationNameEn
                                              : applicationName?.applictionNameMr}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="applicationName"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.applicationName
                                  ? errors?.applicationName?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** From Date */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors?.fromDate}
                            >
                              <Controller
                                name="fromDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      className={ItemCategoryCSS.FiledWidth}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="fromDate" />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD")
                                        )
                                      }
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          fullWidth
                                          InputLabelProps={{
                                            style: {
                                              fontSize: 12,
                                              marginTop: 3,
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.fromDate
                                  ? errors?.fromDate?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** to Date */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors?.toDate}
                            >
                              <Controller
                                control={control}
                                name="toDate"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      className={ItemCategoryCSS.FiledWidth}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="toDate" />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD")
                                        )
                                      }
                                      minDate={watch("fromDate")}
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          fullWidth
                                          InputLabelProps={{
                                            style: {
                                              fontSize: 12,
                                              marginTop: 3,
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.toDate
                                  ? errors?.toDate?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** hawker Type */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            <FormControl
                              sx={{ marginTop: 2 }}
                              variant="standard"
                              error={!!errors?.hawkerType}
                            >
                              <InputLabel
                                shrink={
                                  watch("hawkerType") !== null &&
                                    watch("hawkerType") !== "" &&
                                    watch("hawkerType") !== undefined
                                    ? true
                                    : false
                                }
                                id="demo-simple-select-standard-label"
                              >
                                <FormattedLabel id="hawkerType" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemCategoryCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel id="itemCategoryT" />
                                  >
                                    {hawkerTypes &&
                                      hawkerTypes.map((hawkerType) => (
                                        <MenuItem
                                          key={hawkerType?.id + 1}
                                          value={hawkerType?.id}
                                        >
                                          {language == "en"
                                            ? hawkerType?.hawkerType
                                            : hawkerType?.hawkerTypeMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="hawkerType"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.hawkerType
                                  ? errors?.hawkerType?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** hawker Mode En */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            {/* <TextField
                              label=<FormattedLabel id="hawkerModeEn" />
                              className={ItemCategoryCSS.FiledWidth}
                              variant="standard"
                              {...register("hawkerMode")}
                              error={!!errors.hawkerMode}
                              helperText={
                                errors?.hawkerMode
                                  ? errors.hawkerMode.message
                                  : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel id="hawkerModeEn" required />
                              }
                              label={
                                <FormattedLabel id="hawkerModeEn" required />
                              }
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.hawkerMode}
                              helperText={
                                errors?.hawkerMode
                                  ? errors?.hawkerMode?.message
                                  : null
                              }
                              key={"hawkerMode"}
                              fieldName={"hawkerMode"}
                              updateFieldName={"hawkerModeMr"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>
                          {/** hawker Mode Mr */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            {/* <TextField
                              label=<FormattedLabel id="hawkerModeMr" />
                              className={ItemCategoryCSS.FiledWidth}
                              variant="standard"
                              {...register("hawkerModeMr")}
                              error={!!errors?.hawkerModeMr}
                              helperText={
                                errors?.hawkerModeMr
                                  ? errors?.hawkerModeMr?.message
                                  : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel id="hawkerModeMr" required />
                              }
                              label={
                                <FormattedLabel id="hawkerModeMr" required />
                              }
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.hawkerModeMr}
                              helperText={
                                errors?.hawkerModeMr
                                  ? errors?.hawkerModeMr?.message
                                  : null
                              }
                              key={"hawkerModeMr"}
                              fieldName={"hawkerModeMr"}
                              updateFieldName={"hawkerMode"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>
                          {/** Remark */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("remark") !== null &&
                                    watch("remark") !== "" &&
                                    watch("remark") !== undefined
                                    ? true
                                    : false,
                              }}
                              className={ItemCategoryCSS.FiledWidth}
                              label=<FormattedLabel id="remark" />
                              variant="standard"
                              {...register("remark")}
                              error={!!errors.remark}
                              helperText={
                                errors?.remark ? errors?.remark?.message : null
                              }
                            />
                          </Grid>
                        </Grid>

                        {/** Button */}
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                            md: "row",
                            lg: "row",
                            xl: "row",
                          }}
                          spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                          className={ItemCategoryCSS.ButtonStack}
                        >
                          <Button
                            size="small"
                            className={ItemCategoryCSS.ButtonForMobileWidth}
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText == "Save" ? (
                              <FormattedLabel id="save" />
                            ) : (
                              <FormattedLabel id="update" />
                            )}
                          </Button>
                          <Button
                            className={ItemCategoryCSS.ButtonForMobileWidth}
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            className={ItemCategoryCSS.ButtonForMobileWidth}
                            variant="contained"
                            color="error"
                            size="small"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Stack>
                      </form>
                    </FormProvider>
                  </div>
                </Slide>
              )}
              {/** Add Button */}
              <div className={ItemCategoryCSS.AddButton}>
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
                  <FormattedLabel id="add" />
                </Button>
              </div>
            </ThemeProvider>

            {/** Table */}
            <div className={ItemCategoryCSS.DataGridDiv}>
              <Box style={{ height: "auto", overflow: "auto" }}>
                <DataGrid
                  componentsProps={{
                    toolbar: {
                      searchPlaceholder: "शोधा",
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      printOptions: { disableToolbarButton: true },
                      // disableExport: true,
                      // disableToolbarButton: true,
                      csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  sx={{
                    overflowY: "scroll",

                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  columns={hawkerModeColumns}
                  density="standard"
                  autoHeight={true}
                  pagination
                  paginationMode="server"
                  page={hawkerModeData?.page}
                  rowCount={hawkerModeData?.totalRows}
                  rowsPerPageOptions={hawkerModeData?.rowsPerPageOptions}
                  pageSize={hawkerModeData?.pageSize}
                  rows={hawkerModeData?.rows}
                  onPageChange={(_data) => {
                    getHawkerMode(hawkerModeData?.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    getHawkerMode(_data, hawkerModeData?.page);
                  }}
                />
              </Box>
            </div>
          </Paper>
        </div>
      )}
    </>
  );
};

export default Index;
