import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  Slide,
  TextField,
} from "@mui/material";
import CommonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import styles from "../../../../styles/BsupNagarvasthi/masters/[mainSchemes].module.css";
import schema from "../../../../containers/schema/BsupNagarvasthiSchema/mainSchemesSchema";
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
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
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
  const user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const [isLoading, setIsLoading] = useState(false);
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
  const handleDateChange = (date) => {
    setFromDate(date);
  };

  useEffect(() => {
    getMainSchemes();
  }, [fetchData]);

  // Get Table - Data
  const getMainSchemes = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data.mstMainSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              activeFlag: r.activeFlag,
              devisionKey: r.divisionKey,
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,
              schemePrefix: r.schemePrefix,
              fromDate: r.fromDate
                ? moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD")
                : "-",
              toDate: r.toDate
                ? moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD")
                : "-",
              schemeNo: r.schemeNo,
              schemeName: r.schemeName ? r.schemeName : "-",
              schemeNameMr: r.schemeNameMr,
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

  const onSubmitForm = (fromData) => {
    let _body = {
      ...fromData,
      fromDate: fromData.fromDate === "-" ? null : fromData.fromDate,
      toDate: fromData.toDate === "-" ? null : fromData.toDate,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      setIsLoading(true);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstMainSchemes/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record saved successfully !"
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
        .post(`${urls.BSUPURL}/mstMainSchemes/save`, _body, {
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
            getMainSchemes();
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setButtonInputState(false);
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
          setIsLoading(true);
          axios
            .post(`${urls.BSUPURL}/mstMainSchemes/save`, body, {
              headers: headers,
            })
            .then((res) => {
              setIsLoading(false);
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
                getMainSchemes();
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
          setIsLoading(true);
          axios
            .post(`${urls.BSUPURL}/mstMainSchemes/save`, body, {
              headers: headers,
            })
            .then((res) => {
              setIsLoading(false);
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
                getMainSchemes();
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
    schemePrefix: "",
    fromDate: null,
    toDate: null,
    schemeNo: "",
    schemeName: "",
    schemeNameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    schemePrefix: "",
    fromDate: null,
    toDate: null,
    schemeNo: "",
    schemeName: "",
    schemeNameMr: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      flex: 1,
    },
    {
      field: language === "en" ? "schemeName" : "schemeNameMr",
      headerName: <FormattedLabel id="schemeNameT" />,
      flex: 5,
    },
    {
      field: "schemePrefix",
      headerName: <FormattedLabel id="schemePrefixT" />,
      flex: 2,
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
                setButtonInputState(true);
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

  // UI
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
                <FormattedLabel id="mainSchemes" />
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
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      sx={{
                        m: { xs: 0, md: 1 },
                        backgroundColor: "white",
                        minWidth: "100%",
                      }}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 14 }}>
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
                                  fullWidth
                                  // InputLabelProps={{
                                  //   style: {
                                  //     fontSize: 12,
                                  //     marginTop: 3,
                                  //   },
                                  // }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      variant="standard"
                      sx={{
                        m: { xs: 0, md: 1 },
                        backgroundColor: "white",
                        minWidth: "100%",
                      }}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              // disablePast
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 14 }}>
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
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  // InputLabelProps={{
                                  //   style: {
                                  //     fontSize: 12,
                                  //     marginTop: 3,
                                  //   },
                                  //   shrink:
                                  //     (watch("toDate") ? true : false) ||
                                  //     (router.query.toDate ? true : false),
                                  // }}
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
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    label={<FormattedLabel id="schemeNameEn" required />}
                    id="standard-basic"
                    variant="standard"
                    name="schemeName"
                    {...register("schemeName")}
                    error={!!errors.schemeName}
                    inputProps={{  maxLength: 500 }}
                    // InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      shrink:
                        (watch("schemeName") ? true : false) ||
                        (router.query.schemeName ? true : false),
                    }}
                    helperText={
                      errors?.schemeName ? errors.schemeName.message : null
                    }
                  /> */}
                    <Transliteration
                      variant={"standard"}
                      _key={"schemeName"}
                      labelName={"schemeName"}
                      fieldName={"schemeName"}
                      updateFieldName={"schemeNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="schemeName" required />}
                      error={!!errors.schemeName}
                      helperText={
                        errors?.schemeName ? errors.schemeName.message : null
                      }
                    />
                  </Grid>

                  {/* Scheme name marathi */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    label={<FormattedLabel id="schemeNameMr" required />}
                    id="standard-basic"
                    variant="standard"
                    name="schemeNameMr"
                    {...register("schemeNameMr")}
                    error={!!errors.schemeNameMr}
                    inputProps={{  maxLength: 500 }}
                    // InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      shrink:
                        (watch("schemeNameMr") ? true : false) ||
                        (router.query.schemeNameMr ? true : false),
                    }}
                    helperText={
                      errors?.schemeNameMr ? errors.schemeNameMr.message : null
                    }
                  /> */}
                    <Transliteration
                      variant={"standard"}
                      _key={"schemeNameMr"}
                      labelName={"schemeNameMr"}
                      fieldName={"schemeNameMr"}
                      updateFieldName={"schemeName"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="schemeNameMr" required />}
                      error={!!errors.schemeNameMr}
                      helperText={
                        errors?.schemeNameMr
                          ? errors.schemeNameMr.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Scheme Prefix */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="schemePrefixEn" required />}
                      id="standard-basic"
                      variant="standard"
                      name="schemePrefix"
                      {...register("schemePrefix")}
                      error={!!errors.schemePrefix}
                      inputProps={{ maxLength: 15 }}
                      // InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("schemePrefix") ? true : false) ||
                          (router.query.schemePrefix ? true : false),
                      }}
                      helperText={
                        errors?.schemePrefix
                          ? errors.schemePrefix.message
                          : null
                      }
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
                        // className={CommonStyles.buttonExit}
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
                        color="primary"
                        size="small"
                        // className={CommonStyles.buttonBack}
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
                        color="success"
                        // className={CommonStyles.buttonSave}
                        size="small"
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
            className={CommonStyles.buttonSave}
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
            marginTop: "20px",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            // "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            //   {
            //     display: "none",
            //   },
          }}
          density="compact"
          pagination
          // disableColumnFilter
          // disableDensitySelector
          // disableColumnSelector
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            setPage(_data);
            getMainSchemes(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getMainSchemes(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
