import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
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
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import { HawkingDurationSchema } from "../../../../components/streetVendorManagementSystem/schema/HawkingDurationDailySchema";
import ItemMasterCSS from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(HawkingDurationSchema(language)),
    mode: "onChange",
    defaultValues: {
      id: null,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [businessSubTypes, setBusinessSubTypes] = useState([]);
  const [hawkingDurationDaily, setHawkingDurationDaily] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const userToken = useGetToken();
  const [applicationNames, setApplicationNames] = useState([]);
  const [loadderState, setLoadderState] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

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

  // businessTypes
  const getBusinessTypes = () => {
    axios
      .get(`${urls.HMSURL}/master/businessType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          console.log("businessTypes", r?.data?.businessType);
          setBusinessTypes(
            r?.data?.businessType?.map((row) => ({
              id: row?.id,
              businessType: row?.businessType,
              businessTypeMr: row?.businessTypeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // SubBusinessType
  const getBusinessSubTypes = () => {
    axios
      .get(`${urls.HMSURL}/master/businessSubType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          console.log("businessSubType", r?.data?.businessSubType);
          setBusinessSubTypes(
            r?.data?.businessSubType?.map((row) => ({
              id: row?.id,
              businessSubType: row?.businessSubType,
              businessSubTypeMr: row?.businessSubTypeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Get Table - Data
  const getHawkingDurationDaily = (_pageSize = 10, _pageNo = 0) => {
    setLoadderState(true);

    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/hawkingDurationDaily/getAll`, {
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
          setLoadderState(false);

          setLoadderState(false);
          let response = res?.data?.hawkingDurationDaily;
          console.log("hawkingDurationDailyGet", response);
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              applicationName: r?.applicationName,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,

              toDate: r.toDate,
              fromDate: r.fromDate,
              toDate1:
                moment(r.toDate, "DD-MM-YYYY").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r.toDate, "DD-MM-YYYY").format("DD-MM-YYYY")
                  : "-",
              fromDate1:
                moment(r.fromDate, "DD-MM-YYYY").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r.fromDate, "DD-MM-YYYY").format("DD-MM-YYYY")
                  : "-",

              hawkingDurationDailyFrom: moment(
                r?.hawkingDurationDailyFrom,
                "HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss"),
              hawkingDurationDailyF: moment(
                r?.hawkingDurationDailyFrom,
                "HH:mm:ss"
              ).format("hh:mm a"),
              hawkingDurationDailyTo: moment(
                r?.hawkingDurationDailyTo,
                "HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss"),
              hawkingDurationDailyT: moment(
                r?.hawkingDurationDailyTo,
                "HH:mm:ss"
              ).format("hh:mm a"),
              businessType: r?.businessType,
              businessTypeEn: businessTypes?.find(
                (obj) => obj?.id === r.businessType
              )?.businessType,
              businessTypeMr: businessTypes?.find(
                (obj) => obj?.id === r.businessType
              )?.businessTypeMr,
              businessSubType: r?.businessSubType,
              subBusinessTypeEn: businessSubTypes?.find(
                (obj) => obj?.id === r.businessSubType
              )?.businessSubType,
              subBusinessTypeMr: businessSubTypes?.find(
                (obj) => obj?.id === r.businessSubType
              )?.businessSubTypeMr,
              remarks: r?.remarks,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          console.log("___res123", _res);
          setHawkingDurationDaily({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        } else {
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
      hawkingDurationDailyFrom: moment(
        fromData?.hawkingDurationDailyFrom
      ).format("HH:mm:ss"),
      hawkingDurationDailyTo: moment(fromData?.hawkingDurationDailyTo).format(
        "HH:mm:ss"
      ),
    };

    axios
      .post(`${urls.HMSURL}/hawkingDurationDaily/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 201 || res?.status == 200) {
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
          getHawkingDurationDaily();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
        } else {
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Delete
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record ?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Inactivate" : "होय, निष्क्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.HMSURL}/hawkingDurationDaily/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              if (res.status == 200 || res?.status == 201) {
                swal(
                  language == "en"
                    ? "Record is Successfully Deleted!"
                    : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                  {
                    icon: "success",
                  }
                );
                getHawkingDurationDaily();
                setButtonInputState(false);
              }
            }).catch((error) => {
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
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record ?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Activate" : "होय, सक्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.HMSURL}/hawkingDurationDaily/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res?.status == 201) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Activated !"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",

                  icon: "success",
                  button: {
                    confirm: language === "en" ? "OK" : "ओके",
                  },
                });
                getHawkingDurationDaily();
                setButtonInputState(false);
              }
            }).catch((error) => {
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

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
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

  // Reset Values Cancell
  const resetValuesCancell = {
    applicationName: null,
    fromDate: null,
    toDate: null,
    hawkingDurationDailyFrom: null,
    hawkingDurationDailyTo: null,
    businessType: "",
    businessSubType: "",
    remarks: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    applicationName: null,
    fromDate: null,
    toDate: null,
    hawkingDurationDailyFrom: null,
    hawkingDurationDailyTo: null,
    businessType: "",
    businessSubType: "",
    remarks: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 20,
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
      align: "left",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "toDate1",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      width: 100,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "hawkingDurationDailyF",
      headerName: <FormattedLabel id="hawkingDurationDailyFrom" />,
      description: <FormattedLabel id="hawkingDurationDailyFrom" />,
      width: 100,

      align: "left",
      headerAlign: "center",
    },
    {
      field: "hawkingDurationDailyT",
      headerName: <FormattedLabel id="hawkingDurationDailyTo" />,
      description: <FormattedLabel id="hawkingDurationDailyTo" />,
      width: 100,

      align: "left",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "businessTypeEn" : "businessTypeMr",
      headerName: <FormattedLabel id="businessType" />,
      description: <FormattedLabel id="businessType" />,
      width: 200,

      align: "left",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "subBusinessTypeEn" : "subBusinessTypeMr",
      headerName: <FormattedLabel id="businessSubType" />,
      description: <FormattedLabel id="businessSubType" />,
      width: 200,

      align: "left",
      headerAlign: "center",
    },
    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 200,
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
        console.log("params", params.row.activeFlag);
        return (
          <>
            <IconButton
              disabled={params.row.activeFlag == "N" || editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update");
                setID(params?.row?.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
              }}
            >
              <EditIcon
                sx={{
                  color: params.row.activeFlag === "N" ? "gray" : "#556CD6",
                }}
              />
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

  useEffect(() => {
    getBusinessTypes();
    getBusinessSubTypes();
    getModuleName();
  }, []);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getHawkingDurationDaily();
  }, [businessTypes, businessSubTypes]);

  // View
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div>
          <Paper className={ItemMasterCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
              <div className={ItemMasterCSS.MainHeader}>
                {<FormattedLabel id="hawkingDurationDaily" />}
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
                        <Grid container style={{ marginBottom: "7vh" }}>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemMasterCSS.GridItem}
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
                                    className={ItemMasterCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel
                                        id="applicationName"
                                        required
                                      />
                                    }
                                  >
                                    {applicationNames &&
                                      applicationNames.map(
                                        (applicationName, index) => (
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

                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemMasterCSS.GridItem}
                          >
                            <FormControl
                              style={{ marginTop: 0, width: "70%" }}
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
                                      // minDate={moment.now()}
                                      className={ItemMasterCSS.FiledWidth}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel
                                            id="fromDate"
                                            required
                                          />
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
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemMasterCSS.GridItem}
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
                                      minDate={watch("fromDate")}
                                      disabled={
                                        watch("fromDate") == null ? true : false
                                      }
                                      className={ItemMasterCSS.FiledWidth}
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
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemMasterCSS.GridItem}
                          >
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors?.hawkingDurationDailyFrom}
                            >
                              <Controller
                                format="HH:mm:ss"
                                control={control}
                                name="hawkingDurationDailyFrom"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <TimePicker
                                      className={ItemMasterCSS.FiledWidth}
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="hawkingDurationDailyFrom" />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(time) => {
                                        moment(
                                          field.onChange(time),
                                          "HH:mm:ss a"
                                        ).format("HH:mm:ss a");
                                      }}
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
                                {errors?.hawkingDurationDailyFrom
                                  ? errors?.hawkingDurationDailyFrom?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemMasterCSS.GridItem}
                          >
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors?.hawkingDurationDailyTo}
                            >
                              <Controller
                                format="HH:mm:ss"
                                control={control}
                                name="hawkingDurationDailyTo"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <TimePicker
                                      className={ItemMasterCSS.FiledWidth}
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="hawkingDurationDailyTo" />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(time) => {
                                        moment(
                                          field.onChange(time),
                                          "HH:mm:ss a"
                                        ).format("HH:mm:ss a");
                                      }}
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
                                {errors?.hawkingDurationDailyTo
                                  ? errors?.hawkingDurationDailyTo?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItem: "center",
                              marginBottom: "5px",
                            }}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors?.businessType}
                            >
                              <InputLabel shrink={
                                watch("businessType") !== null &&
                                  watch("businessType") !== "" &&
                                  watch("businessType") !== undefined
                                  ? true
                                  : false
                              } id="demo-simple-select-standard-label">
                                <FormattedLabel id="businessType" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemMasterCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={<FormattedLabel id="businessType" />}
                                  >
                                    {businessTypes &&
                                      businessTypes.map(
                                        (businessType, index) => (
                                          <MenuItem
                                            key={index}
                                            value={businessType?.id}
                                          >
                                            {language == "en"
                                              ? businessType?.businessType
                                              : businessType?.businessTypeMr}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="businessType"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.businessType
                                  ? errors?.businessType?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItem: "center",
                              marginBottom: "5px",
                            }}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors?.businessSubType}
                            >
                              <InputLabel shrink={
                                watch("businessSubType") !== null &&
                                  watch("businessSubType") !== "" &&
                                  watch("businessSubType") !== undefined
                                  ? true
                                  : false
                              } id="demo-simple-select-standard-label">
                                <FormattedLabel id="businessSubType" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemMasterCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="itemCategoryT" />
                                    }
                                  >
                                    {businessSubTypes &&
                                      businessSubTypes.map(
                                        (businessSubType, index) => (
                                          <MenuItem
                                            key={index}
                                            value={businessSubType?.id}
                                          >
                                            {language == "en"
                                              ? businessSubType?.businessSubType
                                              : businessSubType?.businessSubTypeMr}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="businessSubType"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.businessSubType
                                  ? errors?.businessSubType?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItem: "center",
                              marginBottom: "5px",
                            }}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("remarks") !== null &&
                                    watch("remarks") !== "" &&
                                    watch("remarks") !== undefined
                                    ? true
                                    : false,
                              }}
                              sx={{ width: 270 }}
                              id="standard-basic"
                              label={<FormattedLabel id="remark" />}
                              variant="standard"
                              {...register("remarks")}
                              error={!!errors.remarks}
                              helperText={
                                errors?.remarks ? errors.remarks.message : null
                              }
                            />
                          </Grid>
                        </Grid>

                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                            md: "row",
                            lg: "row",
                            xl: "row",
                          }}
                          spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                          justifyContent="center"
                          alignItems="center"
                          marginTop="5"
                        >
                          <Button
                            className={ItemMasterCSS.ButtonForMobileWidth}
                            size="small"
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
                            size="small"
                            className={ItemMasterCSS.ButtonForMobileWidth}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            className={ItemMasterCSS.ButtonForMobileWidth}
                            size="small"
                            variant="contained"
                            color="error"
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
              <div className={ItemMasterCSS.AddButton}>
                <Button
                  size="small"
                  variant="contained"
                  endIcon={<AddIcon />}
                  type="primary"
                  disabled={buttonInputState}
                  onClick={() => {
                    reset({
                      ...resetValuesExit,
                    });
                    setEditButtonInputState(true);
                    setBtnSaveText("Save");
                    setButtonInputState(true);
                    setIsOpenCollapse(!isOpenCollapse);
                    setSlideChecked(true);
                  }}
                >
                  <FormattedLabel id="add" />
                </Button>
              </div>
            </ThemeProvider>
            <div className={ItemMasterCSS.DataGridDiv}>
              {/* <DataGrid
                // autoHeight
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
                density='standard'
                autoHeight={true}
                columns={columns}
                pagination
                paginationMode='server'
                page={hawkingDurationDaily?.page}
                rowCount={hawkingDurationDaily?.totalRows}
                rowsPerPageOptions={hawkingDurationDaily?.rowsPerPageOptions}
                pageSize={hawkingDurationDaily?.pageSize}
                rows={hawkingDurationDaily?.rows}
                onPageChange={(_data) => {
                  getHawkingDurationDaily(
                    hawkingDurationDaily?.pageSize,
                    _data
                  );
                }}
                onPageSizeChange={(_data) => {
                  getHawkingDurationDaily(_data, hawkingDurationDaily?.page);
                }}
              /> */}
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
                columns={columns}
                density="compact"
                autoHeight={true}
                pagination
                paginationMode="server"
                page={hawkingDurationDaily?.page}
                rowCount={hawkingDurationDaily?.totalRows}
                rowsPerPageOptions={hawkingDurationDaily?.rowsPerPageOptions}
                pageSize={hawkingDurationDaily?.pageSize}
                rows={hawkingDurationDaily?.rows}
                onPageChange={(_data) => {
                  getHawkingDurationDaily(
                    hawkingDurationDaily?.pageSize,
                    _data
                  );
                }}
                onPageSizeChange={(_data) => {
                  getHawkingDurationDaily(_data, hawkingDurationDaily?.page);
                }}
              />
            </div>
          </Paper>
        </div>
      )}
    </>
  );
};

export default Index;
