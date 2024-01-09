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
import LicenseValiditySchema from "../../../../components/streetVendorManagementSystem/schema/LicenseValiditySchema";
import ItemMasterCSS from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// func
const Index = () => {
  const language = useSelector((state) => state?.labels?.language);
  const [dataValidation, setDataValidation] = useState(
    LicenseValiditySchema(language)
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
    watch,
    // methods,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [applicationNames, setApplicationNames] = useState([]);
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
  const [licenseValidityData, setLicenseValidityData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const userToken = useGetToken();

  // hawkerType
  const getHawkerType = () => {
    const url = `${urls.HMSURL}/hawkerType/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      )
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setHawkerTypes(
            r?.data?.hawkerType?.map((row) => ({
              id: row?.id,
              hawkerType: row?.hawkerType,
              hawkerTypeMr: row?.hawkerTypeMr,
            }))
          );
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // serviceNames
  const getserviceNames = () => {
    const url = `${urls.CFCURL}/master/service/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      )
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          const apiData = r?.data?.service;
          console.log("apiData", apiData);
          const fillteredData = apiData?.filter((d) => d?.application == "4");

          console.log("fillteredData", fillteredData);
          setServiceNames(
            fillteredData?.map((row) => ({
              id: row?.id,
              serviceName: row?.serviceName,
              serviceNameMr: row?.serviceNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // Module Name
  const getModuleName = () => {
    const url = `${urls.CFCURL}/master/application/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
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

  // Get Table - Data
  const getLicenseValidityDetails = (_pageSize = 10, _pageNo = 0) => {
    setValue("loadderState", true);

    const url = `${urls.HMSURL}/licenseValidity/getAll`;

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
          let response = res?.data?.licenseValidity;
          console.log("licenseValidity", response);
          let _res = response?.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
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

              // application name
              applicationName: r?.applicationName,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,
              // applicationName
              licenseValidity: r?.licenseValidity,
              // hawkerName
              hawkerType: r?.hawkerType,
              hawkerTypeNameEn: hawkerTypes?.find(
                (obj) => obj?.id === r?.hawkerType
              )?.hawkerType,
              hawkerTypeNameMr: hawkerTypes?.find(
                (obj) => obj?.id === r?.hawkerType
              )?.hawkerTypeMr,
              // service
              serviceName: r?.serviceId,
              serviceId: r?.serviceId,
              serviceNameEng: serviceNames?.find(
                (obj) => obj?.id === r?.serviceId
              )?.serviceName,
              serviceNameMar: serviceNames?.find(
                (obj) => obj?.id === r?.serviceId
              )?.serviceNameMr,
              remark: r.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          console.log("reseponse45454", _res);

          setLicenseValidityData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
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
    // Save - DB
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    axios
      .post(`${urls.HMSURL}/licenseValidity/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      )
      .then((res) => {
        setValue("loadderState", false);
        if (res?.status == 201 || res?.status == 200) {
          if (fromData?.id) {
            language == "en"
              ? sweetAlert(
                "Updated!",
                "Record Updated successfully!",
                "success"
              )
              : sweetAlert(
                "अपडेट केले!",
                "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                "success"
              );
          } else {
            language == "en"
              ? sweetAlert("Saved!", "Record Saved successfully!", "success")
              : sweetAlert(
                "जतन केले!",
                "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success"
              );
          }
          getLicenseValidityDetails();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

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
            .post(`${urls.HMSURL}/licenseValidity/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
            )
            .then((res) => {
              setValue("loadderState", false);
              if (res.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record successfully inactive"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय",
                  {
                    icon: "success",
                  }
                );
                getLicenseValidityDetails();
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
            .post(`${urls.HMSURL}/licenseValidity/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
            )
            .then((res) => {
              setValue("loadderState", false);
              if (res.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record is successfully activated !"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getLicenseValidityDetails();
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

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    licenseValidity: "",
    licenseValidityMr: "",
    hawkerType: null,
    applicationName: null,
    serviceId: null,
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    licenseValidity: "",
    licenseValidityMr: "",
    hawkerType: null,
    applicationName: null,
    serviceId: null,
    remark: "",
    id: null,
  };

  // define colums table
  const licenseValidityColumns = [
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
      field: language == "en" ? "hawkerTypeNameEn" : "hawkerTypeNameMr",
      headerName: <FormattedLabel id="hawkerTypeName" />,
      description: <FormattedLabel id="hawkerTypeName" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "serviceNameEng" : "serviceNameMar",
      headerName: <FormattedLabel id="serviceName" />,
      description: <FormattedLabel id="serviceName" />,
      width: 300,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "licenseValidity",
      headerName: <FormattedLabel id="licenseValidity" />,
      description: <FormattedLabel id="licenseValidity" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      headerAlign: "center",
      align: "center",
      width: 150,
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

  // loadderSetTimeOutFunction
  const loadderSetTimeOutFunction = () => {
    setTimeout(() => {
      console.log("bhvaa", watch("loadderState"));
      setValue("loadderState", false);
      console.log("bhvaa2", watch("loadderState"));
    }, 0);
  };


  //! useEffects  ===========>
  useEffect(() => {
    setValue("loadderState", true);
    loadderSetTimeOutFunction();
    getHawkerType();
    getserviceNames();
    getModuleName();
  }, []);

  useEffect(() => {
    getLicenseValidityDetails();
    console.log("useEffect");
  }, [hawkerTypes, serviceNames, applicationNames]);

  // View
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div>
          <Paper className={ItemMasterCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
              <div className={ItemMasterCSS.MainHeader}>
                {<FormattedLabel id="licenseValidityHeader" />}
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
                        <Grid container className={ItemMasterCSS.GridContainer}>
                          {/** Module Name */}
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
                          {/** from Date  */}
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
                          {/** to Date  */}
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
                                      className={ItemMasterCSS.FiledWidth}
                                      minDate={watch("fromDate")}
                                      disabled={
                                        watch("fromDate") == null ? true : false
                                      }
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
                          {/** Service Name  */}
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

                              error={!!errors?.serviceId}
                              sx={{ marginTop: 2 }}
                            >
                              <InputLabel
                                shrink={
                                  watch("serviceId") !== null &&
                                    watch("serviceId") !== "" &&
                                    watch("serviceId") !== undefined
                                    ? true
                                    : false
                                }
                                id="demo-simple-select-standard-label"
                              >
                                {<FormattedLabel id="serviceName" required />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemMasterCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="serviceName"
                                      required
                                    />
                                    id="demo-simple-select-standard"
                                    labelId="id='demo-simple-select-standard-label'"
                                  >
                                    {serviceNames &&
                                      serviceNames.map((serviceName, index) => (
                                        <MenuItem
                                          key={index}
                                          value={serviceName.id}
                                        >
                                          {language == "en"
                                            ? serviceName?.serviceName
                                            : serviceName?.serviceNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="serviceId"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.serviceId
                                  ? errors.serviceId.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** Street Vendor Name */}
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
                              error={!!errors.hawkerType}
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
                                <FormattedLabel id="hawkerTypeName" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemMasterCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="hawkerTypeName"
                                      required
                                    />
                                  >
                                    {hawkerTypes &&
                                      hawkerTypes.map((hawkerType, index) => (
                                        <MenuItem
                                          key={index}
                                          value={hawkerType.id}
                                        >
                                          {hawkerType.hawkerType}
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
                          {/** License Validaity */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemMasterCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("licenseValidity") !== null &&
                                    watch("licenseValidity") !== "" &&
                                    watch("licenseValidity") !== undefined
                                    ? true
                                    : false,
                              }}
                              id="standard-basic"
                              className={ItemMasterCSS.FiledWidth}
                              label=<FormattedLabel
                                id="licenseValidity"
                                required
                              />
                              variant="standard"
                              {...register("licenseValidity")}
                              error={!!errors.licenseValidity}
                              helperText={
                                errors?.licenseValidity
                                  ? errors?.licenseValidity?.message
                                  : null
                              }
                            />
                          </Grid>

                          {/** Remark  */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemMasterCSS.GridItem}
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
                              id="standard-basic"
                              className={ItemMasterCSS.FiledWidth}
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
                        {/** Buttons  */}
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                            md: "row",
                            lg: "row",
                            xl: "row",
                          }}
                          spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                          className={ItemMasterCSS.ButtonStack}
                        >
                          <Button
                            className={ItemMasterCSS.ButtonForMobileWidth}
                            type="submit"
                            size="small"
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
                            className={ItemMasterCSS.ButtonForMobileWidth}
                            variant="contained"
                            size="small"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            className={ItemMasterCSS.ButtonForMobileWidth}
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
                  variant="contained"
                  size="small"
                  endIcon={<AddIcon />}
                  type="primary"
                  disabled={buttonInputState}
                  onClick={() => {
                    // var inputElement = document.getElementById(
                    //   "uploadButtonHawkerWithoutAdd"
                    // );
                    // inputElement.value = "";
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
            <div className={ItemMasterCSS.DataGridDiv}>
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
                columns={licenseValidityColumns}
                density="standard"
                autoHeight={true}
                pagination
                paginationMode="server"
                page={licenseValidityData?.page}
                rowCount={licenseValidityData?.totalRows}
                rowsPerPageOptions={licenseValidityData?.rowsPerPageOptions}
                pageSize={licenseValidityData?.pageSize}
                rows={licenseValidityData?.rows}
                onPageChange={(_data) => {
                  getLicenseValidityDetails(
                    licenseValidityData?.pageSize,
                    _data
                  );
                }}
                onPageSizeChange={(_data) => {
                  getLicenseValidityDetails(_data, licenseValidityData?.page);
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
