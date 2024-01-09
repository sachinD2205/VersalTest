import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import styles from "../../../../styles/BsupNagarvasthi/masters/[subSchemes].module.css";
import schema from "../../../../containers/schema/BsupNagarvasthiSchema/subSchemesSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import moment from "moment";
import Loader from "../../../../containers/Layout/components/Loader";
import { sortByProperty } from "../../../../components/bsupNagarVasthi/bsupCommonFunctions";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    watch,
    formState: { errors },
  } = methods;
  const [mainNames, setMainNames] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [pageNo, setPage] = useState(10);
  const [dataPageNo, setDataPage] = useState();
  const [FromDate, setFromDate] = useState();
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const [forBachatGat, setForBachatGat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const loggedUser = localStorage.getItem("loggedInUser");

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

  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };
  const headers = { Authorization: `Bearer ${user?.token}` };
  const inputRef = useRef(null);

  const handleInputChange = () => {
    const inputValue = inputRef.current.value;
    if (inputValue.length > 10) {
      inputRef.current.value = inputValue.slice(0, 10);
    }
  };

  //added by satej
  const handleDateChange = (date) => {
    setFromDate(date);
  };
  useEffect(() => {
    getMainSchemes();
  }, []);

  //added by satej on 11-04-2023
  useEffect(() => {
    getSubSchemes();
  }, [mainNames]);

  //fetch all main schemes to map their name by scheme id in table column
  const getMainSchemes = (_pageSize = 10, _pageNo = 0) => {
    var mainschemeList;
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: null,
        },
        headers: headers,
      })
      .then(async (r) => {
        let result = r.data.mstMainSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              schemeName: r.schemeName ? r.schemeName : "-",
              schemeNameMr: r.schemeNameMr ? r.schemeNameMr : "-",
            };
          });
        mainschemeList = _res;
        setMainNames(
          language === "en"
            ? _res.sort(sortByProperty("schemeName"))
            : _res.sort(sortByProperty("schemeNameMr"))
        );
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    getSubSchemes();
  }, [fetchData]);

  // Get Table - Data
  const getSubSchemes = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data.mstSubSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              activeFlag: r.activeFlag,
              devisionKey: r.divisionKey,
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,
              subSchemePrefix: r.subSchemePrefix,
              fromDate: r.fromDate
                ? moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD")
                : "-",
              toDate: r.toDate
                ? moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD")
                : "-",
              mainSchemeKey: r.mainSchemeKey,
              mainSchemeName: mainNames?.find(
                (obj) => obj.id == r.mainSchemeKey
              )?.schemeName
                ? mainNames?.find((obj) => obj.id == r.mainSchemeKey)
                    ?.schemeName
                : "-",
              mainSchemeNameMr: mainNames?.find(
                (obj) => obj.id == r.mainSchemeKey
              )?.schemeNameMr
                ? mainNames?.find((obj) => obj.id == r.mainSchemeKey)
                    ?.schemeNameMr
                : "-",
              subSchemeName: r.subSchemeName,
              subSchemeNameMr: r.subSchemeNameMr,
              benefitAmount: r.benefitAmount,
              forBachatGat: r.forBachatGat,
              installments: r.installments,
              note: r.note,
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // on submit
  const onSubmitForm = (fromData) => {
    let _body = {
      ...fromData,
      forBachatGat: forBachatGat,
      fromDate: fromData.fromDate === "-" ? null : fromData.fromDate,
      toDate: fromData.toDate === "-" ? null : fromData.toDate,
      activeFlag: fromData.activeFlag == null ? "Y" : fromData.activeFlag,
    };

    if (btnSaveText === "Save") {
      setIsLoading(true);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstSubSchemes/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved Successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setIsLoading(true);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstSubSchemes/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
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
            getSubSchemes();
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
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
          axios
            .post(`${urls.BSUPURL}/mstSubSchemes/save/`, body, {
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
                getSubSchemes();
              }
            })
            .catch((err) => {
              setIsLoading(false);
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
          axios
            .post(`${urls.BSUPURL}/mstSubSchemes/save`, body, {
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
                getSubSchemes();
              }
            })
            .catch((err) => {
              setIsLoading(false);
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

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
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
    mainSchemeKey: "",
    mainSchemeKeyMr: "",
    subSchemePrefix: "",
    subSchemePrefixMr: "",
    fromDate: null,
    fromDateMr: null,
    toDate: null,
    toDateMr: null,
    subSchemeName: "",
    subSchemeNameMr: "",
    benefitAmount: "",
    installments: "",
    forBachatGat: false,
    note: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    mainSchemeKey: "",
    mainSchemeKeyMr: "",
    subSchemePrefix: "",
    subSchemePrefixMr: "",
    fromDate: null,
    fromDateMr: null,
    toDate: null,
    toDateMr: null,
    subSchemeName: "",
    subSchemeNameMr: "",
    benefitAmount: "",
    installments: "",
    id: null,
    forBachatGat: false,
    note: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 60,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      width: 100,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      width: 100,
    },
    {
      field: language === "en" ? "mainSchemeName" : "mainSchemeNameMr",
      headerName: <FormattedLabel id="mainSchemeNameT" />,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
      width: 200,
    },
    {
      field: language === "en" ? "subSchemeName" : "subSchemeNameMr",
      headerName: <FormattedLabel id="subSchemeNameT" />,
      width: 700,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
    },
    {
      field: "subSchemePrefix",
      headerName: <FormattedLabel id="subSchemePrefix" />,
      width: 150,
    },
    {
      field: "benefitAmount",
      headerName: <FormattedLabel id="benefitTitle" />,
      width: 150,
    },
    {
      field: "installments",
      headerName: <FormattedLabel id="installment" />,
      width: 150,
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
                  setForBachatGat(params.row.forBachatGat),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setNote(params.row.note);
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

  const isThisSchemeForBachatGatSelectorChangeHandle = (event) => {
    const newValue = event.target.checked;
    forBachatGat = newValue;
    setForBachatGat(newValue);
  };

  const labelStyle = {
    fontSize: "18px",
    color: "#515252",
    marginRight: "10px !important",
  };

  const checkBoxStyle = {
    margin: "10px !important",
  };

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
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
          "@media (max-width: 500px)": {
            marginTop: "7rem",
          },
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
                <FormattedLabel id="subschemeTitle" />
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
                <Grid container spacing={2} style={{ padding: "1rem" }}>
                  {/* Date */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      variant="standard"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="fromDate" />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                );
                                handleDateChange(date);
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.fromDate ? errors.fromDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      variant="standard"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="toDate" />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                );
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                />
                              )}
                              shouldDisableDate={(date) => {
                                const fromDate = moment(
                                  FromDate,
                                  "YYYY-MM-DD"
                                ).startOf("day");
                                const toDate = moment(
                                  date,
                                  "YYYY-MM-DD"
                                ).startOf("day");
                                return toDate.isSameOrBefore(fromDate);
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.toDate ? errors.toDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* main scheme dropdown */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      error={errors.mainSchemeKey}
                      variant="standard"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="mainScheme" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            {mainNames &&
                              mainNames.map((auditorium, index) => (
                                <MenuItem key={index} value={auditorium.id}>
                                  {language === "en"
                                    ? auditorium.schemeName
                                    : auditorium.schemeNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="mainSchemeKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.mainSchemeKey
                          ? errors.mainSchemeKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* sub Scheme prefix */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="subSchemePrefix" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("subSchemePrefix")}
                      error={!!errors.subSchemePrefix}
                      inputProps={{ maxLength: 15 }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("subSchemePrefix") ? true : false) ||
                          (router.query.subSchemePrefix ? true : false),
                      }}
                      helperText={
                        errors?.subSchemePrefix
                          ? errors.subSchemePrefix.message
                          : null
                      }
                    />
                  </Grid>

                  {/* sub scheme name */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="subSchemeNameFEn" required />}
                      id="standard-basic"
                      variant="standard"
                      multiline
                      rows={4}
                      {...register("subSchemeName")}
                      error={!!errors.subSchemeName}
                      inputProps={{ maxLength: 500 }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("subSchemeName") ? true : false) ||
                          (router.query.subSchemeName ? true : false),
                      }}
                      helperText={
                        errors?.subSchemeName
                          ? errors.subSchemeName.message
                          : null
                      }
                    /> */}

                    <Transliteration
                      variant={"standard"}
                      _key={"subSchemeName"}
                      labelName={"subSchemeName"}
                      fieldName={"subSchemeName"}
                      updateFieldName={"subSchemeNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="subSchemeNameFEn" required />}
                      error={!!errors.subSchemeName}
                      helperText={
                        errors?.subSchemeName
                          ? errors.subSchemeName.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Sub Scheme Name Marathi */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="subSchemeNameMr" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("subSchemeNameMr")}
                      multiline
                      rows={4}
                      error={!!errors.subSchemeNameMr}
                      inputProps={{ maxLength: 500 }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("subSchemeNameMr") ? true : false) ||
                          (router.query.subSchemeNameMr ? true : false),
                      }}
                      helperText={
                        errors?.subSchemeNameMr
                          ? errors.subSchemeNameMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"standard"}
                      _key={"subSchemeNameMr"}
                      labelName={"subSchemeNameMr"}
                      fieldName={"subSchemeNameMr"}
                      updateFieldName={"subSchemeNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="subSchemeNameMr" required />}
                      error={!!errors.subSchemeNameMr}
                      helperText={
                        errors?.subSchemeNameMr
                          ? errors.subSchemeNameMr.message
                          : null
                      }
                    />
                  </Grid>

                  {/* benefit amount */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      type="number"
                      label={<FormattedLabel id="benefitAmount" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("benefitAmount")}
                      error={!!errors.benefitAmount}
                      inputProps={{
                        ref: inputRef,
                        onInput: handleInputChange,
                      }}
                      // InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("benefitAmount") ? true : false) ||
                          (router.query.benefitAmount ? true : false),
                      }}
                      helperText={
                        errors?.benefitAmount
                          ? errors.benefitAmount.message
                          : null
                      }
                    />
                  </Grid>

                  {/* no of installments for benefit amount */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      type="number"
                      label={<FormattedLabel id="installments" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("installments")}
                      error={!!errors.installments}
                      inputProps={{ maxLength: 5 }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("installments") ? true : false) ||
                          (router.query.installments ? true : false),
                      }}
                      helperText={
                        errors?.installments
                          ? errors.installments.message
                          : null
                      }
                    />
                  </Grid>

                  {/* is this bachat gat scheme selector checkbox */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={forBachatGat}
                            checked={forBachatGat}
                            onChange={
                              isThisSchemeForBachatGatSelectorChangeHandle
                            }
                          />
                        }
                        label={<FormattedLabel id="isSchemeForBachatGat" />}
                      />
                    </div>
                  </Grid>

                  {/* note */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="note" />}
                      id="standard-basic"
                      variant="standard"
                      multiline
                      rows={4}
                      {...register("note")}
                      error={!!errors.note}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("note") ? true : false) ||
                          (router.query.note ? true : false),
                      }}
                      helperText={errors?.note ? errors.note.message : null}
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
                        // className={commonStyles.buttonExit}
                        size="small"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => {
                          exitButton();
                          setForBachatGat(false);
                        }}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        size="small"
                        // className={commonStyles.buttonBack}
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => {
                          cancellButton();
                          setForBachatGat(false);
                        }}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        // className={commonStyles.buttonSave}
                        variant="contained"
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
                </Grid>
              </Slide>
            )}
          </form>
        </FormProvider>

        <div className={styles.addbtn}>
          <Button
            variant="contained"
            size="small"
            className={commonStyles.buttonSave}
            endIcon={<AddIcon />}
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
          density="comfortable"
          // components={{
          //   Toolbar: GridToolbar,
          // }}
          // componentsProps={{
          //   toolbar: {
          //     showQuickFilter: true,
          //     quickFilterProps: { debounceMs: 500 },
          //   },
          // }}
          // autoHeight={true}
          // sx={{
          //   overflowY: "scroll",
          //   "& .MuiDataGrid-virtualScrollerContent": {},
          //   "& .MuiDataGrid-columnHeadersInner": {
          //     backgroundColor: "#556CD6",
          //     color: "white",
          //   },
          //   "& .MuiDataGrid-cell:hover": {
          //     color: "primary.main",
          //   },
          //   "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
          //     {
          //       display: "none",
          //     },
          // }}
          // density="comfortable"
          // disableColumnFilter
          // disableDensitySelector
          // disableColumnSelector
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            setPage(_data);
            getSubSchemes(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getSubSchemes(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
