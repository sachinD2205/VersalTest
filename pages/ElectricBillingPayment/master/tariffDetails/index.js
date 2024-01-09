import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../../components/common/BreadcrumbComponent";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

import styles from "../../../../styles/ElectricBillingPayment_Styles/tariffDetail.module.css";
import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/tariffDetailSchema";

import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import Loader from "../../../../containers/Layout/components/Loader";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loadingFile, setLoadFile] = useState(false);
  const [tariffCategoryDropDown, setTariffCategoryDropDown] = useState();
  const router = useRouter();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  const language = useSelector((state) => state.labels.language);

  const user = useSelector((state) => state.user.user);

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getTariffDetails();
  }, [fetchData]);

  useEffect(() => {
    getTariffCategory();
  }, []);

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error"
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error"
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error"
      );
    }
  };

  // get Tariff Category

  const getTariffCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstTariffCategory/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstTariffCategoryList;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              tariffCategoryEn: r.tariffCategory,
              tariffCategoryMr: r.tariffCategoryMr,
            };
          });
        setTariffCategoryDropDown(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // Get Table - Data
  const getTariffDetails = (_pageSize = 10, _pageNo = 0) => {
    setLoadFile(true);
    axios
      .get(`${urls.EBPSURL}/mstTariffDetails/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstTariffDetailsList;

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * 10,
            energyCharge: r.energyCharge,
            fixedDemandCharge: r.fixedDemandCharge,
            fromDate: moment(r.fromDate).format("YYYY-MM-DD"),
            toDate: moment(r.toDate).format("YYYY-MM-DD"),
            tariffCategory: r.tariffCategory,
            tariffCategoryMr: r.tariffCategoryMr,
            fromRange: r.fromRange,
            toRange: r.toRange,
            units: r.units,
            wheelingCharge: r.wheelingCharge,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setLoadFile(false);
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((err) => {
        setLoadFile(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const onSubmitForm = (fromData) => {
    // Save - DB
    console.log("fromData", fromData);
    let fDate = moment(fromData.fromDate).format("YYYY-MM-DD");
    let tDate = moment(fromData.toDate).format("YYYY-MM-DD");

    let _body = {
      ...fromData,
      fromDate: fDate,
      toDate: tDate,
      activeFlag: "Y",
    };
    setLoadFile(true);
    if (btnSaveText === "Save") {
      delete _body.id;
      const tempData = axios
        .post(`${urls.EBPSURL}/mstTariffDetails/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved Successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setLoadFile(false);
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((err) => {
          setLoadFile(false);
          cfcErrorCatchMethod(err, false);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      const tempData = axios
        .post(`${urls.EBPSURL}/mstTariffDetails/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  language === "en" ? "Updated!" : "अद्ययावत केले!",
                  language === "en"
                    ? "Record Updated Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
              : sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                );
            getTariffDetails();
            setLoadFile(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((err) => {
          setLoadFile(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        if (willDelete === true) {
          setLoadFile(true);
          axios
            .post(`${urls.EBPSURL}/mstTariffDetails/save`, body, {
              headers: headers,
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                );
                getTariffDetails();
                setLoadFile(false);
              }
            })
            .catch((err) => {
              setLoadFile(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      swal({
        title: language === "en" ? "Activate?" : "सक्रिय करू?",
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        if (willDelete === true) {
          setLoadFile(true);
          axios
            .post(`${urls.EBPSURL}/mstTariffDetails/save`, body, {
              headers: headers,
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                );
                getTariffDetails();
                setLoadFile(false);
              }
            })
            .catch((err) => {
              setLoadFile(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
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
    setDeleteButtonState(false);
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
    energyCharge: "",
    fixedDemandCharge: "",
    fromDate: null,
    fromRange: "",
    tariffCategory: "",
    tariffCategoryMr: "",
    toDate: null,
    toRange: "",
    units: "",
    wheelingCharge: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    energyCharge: "",
    fixedDemandCharge: "",
    fromDate: "",
    fromRange: "",
    tariffCategory: "",
    tariffCategoryMr: "",
    toDate: "",
    toRange: "",
    units: "",
    wheelingCharge: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      //   flex: 1,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "energyCharge",
      headerName: <FormattedLabel id="energyCharge" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fixedDemandCharge",
      headerName: <FormattedLabel id="fixedDemandCharge" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fromRange",
      headerName: <FormattedLabel id="fromRange" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toRange",
      headerName: <FormattedLabel id="toRange" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tariffCategory",
      headerName: <FormattedLabel id="tarriffCategory" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "units",
      headerName: <FormattedLabel id="unit" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wheelingCharge",
      headerName: <FormattedLabel id="wheelingCharge" />,
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                reset(params.row);
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
                reset(params.row);
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
          </Box>
        );
      },
    },
  ];

  // Row

  return (
    <>
      <Box>
        <div>
          <BreadCrumb />
        </div>
      </Box>
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
          <Grid container className={commonStyles.title}>
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
                <FormattedLabel id="TariffDetails" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <Grid container>
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                  {/* for energy charge */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    marginTop={"20px"}
                  >
                    <TextField
                      label={<FormattedLabel id="energyCharge" />}
                      style={{ width: "50%" }}
                      id="standard-basic"
                      variant="standard"
                      {...register("energyCharge")}
                      error={!!errors.energyCharge}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("energyCharge") ? true : false) ||
                          (router.query.energyCharge ? true : false),
                      }}
                      helperText={
                        errors?.energyCharge
                          ? errors?.energyCharge?.message
                          : null
                      }
                    />
                  </Grid>

                  {/* for fixedDemandCharge */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    marginTop={"20px"}
                  >
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="fixedDemandCharge" />}
                      style={{ width: "50%" }}
                      variant="standard"
                      {...register("fixedDemandCharge")}
                      error={!!errors.fixedDemandCharge}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("fixedDemandCharge") ? true : false) ||
                          (router.query.fixedDemandCharge ? true : false),
                      }}
                      helperText={
                        errors?.fixedDemandCharge
                          ? errors?.fixedDemandCharge?.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                  {/* for from date */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    marginTop={"20px"}
                  >
                    <FormControl
                      variant="standard"
                      style={{ width: "50%" }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        // variant="standard"
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="fromDate" />}
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
                                  variant="standard"
                                  // sx={{ width: 230 }}
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
                                      marginTop: 3,
                                    },

                                    //true
                                    shrink: true,
                                  }}
                                  error={!!errors.fromDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.fromDate ? errors?.fromDate?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/*for  To date */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    marginTop={"20px"}
                  >
                    <FormControl variant="standard" style={{ width: "50%" }}>
                      <Controller
                        // variant="standard"
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="toDate" />}
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
                                  variant="standard"
                                  // sx={{ width: 230 }}
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
                                      marginTop: 3,
                                    },

                                    //true
                                    shrink: true,
                                  }}
                                  error={!!errors.toDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.toDate ? errors?.toDate?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={3} xl={3}></Grid>

                  {/* for tariff category */}

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    marginTop={"20px"}
                  >
                    <FormControl
                      disabled={router.query.pageMode == "view" ? true : false}
                      variant="standard"
                      error={!!errors.tariffCategory}
                      sx={{ width: "50%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="tarriffCategory" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            // @ts-ignore
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="tariffCategory"
                          >
                            {tariffCategoryDropDown &&
                              tariffCategoryDropDown.map(
                                (auditorium, index) => (
                                  <MenuItem key={index} value={auditorium.id}>
                                    {language === "en"
                                      ? auditorium.tariffCategoryEn
                                      : auditorium.tariffCategoryMr}
                                  </MenuItem>
                                )
                              )}
                          </Select>
                        )}
                        name="tariffCategory"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.tariffCategory
                          ? errors?.tariffCategory?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* for wheelingCharge */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    marginTop={"20px"}
                  >
                    <TextField
                      label={<FormattedLabel id="wheelingCharge" />}
                      style={{ width: "50%" }}
                      id="standard-basic"
                      variant="standard"
                      {...register("wheelingCharge")}
                      error={!!errors.wheelingCharge}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("wheelingCharge") ? true : false) ||
                          (router.query.wheelingCharge ? true : false),
                      }}
                      helperText={
                        errors?.wheelingCharge
                          ? errors?.wheelingCharge?.message
                          : null
                      }
                    />
                  </Grid>

                  {/* for from range */}

                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    marginTop={"20px"}
                  >
                    <TextField
                      label={<FormattedLabel id="fromRange" />}
                      style={{ width: "50%" }}
                      id="standard-basic"
                      variant="standard"
                      {...register("fromRange")}
                      error={!!errors.fromRange}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("fromRange") ? true : false) ||
                          (router.query.fromRange ? true : false),
                      }}
                      helperText={
                        errors?.fromRange ? errors?.fromRange?.message : null
                      }
                    />
                  </Grid>

                  {/* for To range */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    marginTop={"20px"}
                  >
                    <TextField
                      label={<FormattedLabel id="toRange" />}
                      style={{ width: "50%" }}
                      id="standard-basic"
                      variant="standard"
                      {...register("toRange")}
                      error={!!errors.toRange}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("toRange") ? true : false) ||
                          (router.query.toRange ? true : false),
                      }}
                      helperText={
                        errors?.toRange ? errors?.toRange?.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                  {/* for units */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    marginTop={"20px"}
                  >
                    <TextField
                      label={<FormattedLabel id="unit" />}
                      style={{ width: "50%" }}
                      id="standard-basic"
                      variant="standard"
                      {...register("units")}
                      error={!!errors.units}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink: watch("units") ? true : false,
                      }}
                      helperText={errors?.units ? errors?.units?.message : null}
                    />
                  </Grid>

                  <Grid
                    container
                    spacing={5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText === "Update" ? (
                          <FormattedLabel id="update" />
                        ) : (
                          <FormattedLabel id="save" />
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                  {/* </div> */}
                </Grid>
              </Slide>
            )}
          </form>
        </FormProvider>

        <div className={styles.addbtn}>
          <Button
            variant="contained"
            size="small"
            endIcon={<AddIcon />}
            // type='primary'
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        </div>

        {loadingFile ? (
          <CommonLoader />
        ) : (
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            autoHeight
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
            density="compact"
            pagination
            paginationMode="server"
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getTariffDetails(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getTariffDetails(_data, data.page);
            }}
          />
        )}
      </Paper>
    </>
  );
};

export default Index;
