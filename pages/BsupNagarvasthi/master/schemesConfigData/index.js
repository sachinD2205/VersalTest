import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
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
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import styles from "../../../../styles/BsupNagarvasthi/masters/[mainSchemes].module.css";
import schema from "../../../../containers/schema/BsupNagarvasthiSchema/schemeConfigData";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import { sortByProperty } from "../../../../components/bsupNagarVasthi/bsupCommonFunctions";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
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

  const router = useRouter();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [informationType, setInformationType] = useState([]);
  const [showDocuentInput, setDocuentInput] = useState(false);
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
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

  useEffect(() => {
    getInformationType();
  }, []);

  //added by satej on 11-04-2023
  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async (_pageSize = 10, _pageNo = 0) => {
    var mainschemeList;
    var subschemeList;
    //fetch all main schemes to map their name by scheme id in table column
    setIsLoading(true);
    const response1 = await axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then(async (r) => {
        setIsLoading(false);
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

    //fetch all sub schemes to map their name by scheme id in table column
    const response2 = await axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
        headers: headers,
      })
      .then(async (r) => {
        let result = r.data.mstSubSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              subSchemeName: r.subSchemeName ? r.subSchemeName : "-",
              subSchemeNameMr: r.subSchemeNameMr ? r.subSchemeNameMr : "-",
            };
          });
        subschemeList = _res;
        setSubSchemeNames(
          language === "en"
            ? _res.sort(sortByProperty("subSchemeName"))
            : _res.sort(sortByProperty("subSchemeNameMr"))
        );
      }).catch((err) => {
        cfcErrorCatchMethod(err, false);
      });

    setIsLoading(true);
    const response3 = axios
      .get(`${urls.BSUPURL}/mstSchemesConfigData/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then(async (r) => {
        setIsLoading(false);
        let result = r.data.mstSchemesConfigDataList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,
              informationTitle: r.informationTitle,
              informationType: r.informationType,
              infoSelectionData: r.infoSelectionData,
              isOptional: r.isOptional,
              infoDataSize: r.infoDataSize,
              isMandatory: r.isMandatory,
              documentTypeKey: r.documentTypeKey,

              mainSchemeName: mainschemeList?.find(
                (obj) => obj.id == r.schemesConfigKey
              )?.schemeName
                ? mainschemeList?.find((obj) => obj.id == r.schemesConfigKey)
                    ?.schemeName
                : "-",
              mainSchemeNameMr: mainschemeList?.find(
                (obj) => obj.id == r.schemesConfigKey
              )?.schemeNameMr
                ? mainschemeList?.find((obj) => obj.id == r.schemesConfigKey)
                    ?.schemeNameMr
                : "-",
              subSchemeName: subschemeList?.find(
                (obj) => obj.id == r.subSchemeKey
              )?.subSchemeName
                ? subschemeList?.find((obj) => obj.id == r.subSchemeKey)
                    ?.subSchemeName
                : "-",
              subSchemeNameMr: subschemeList?.find(
                (obj) => obj.id == r.subSchemeKey
              )?.subSchemeNameMr
                ? subschemeList?.find((obj) => obj.id == r.subSchemeKey)
                    ?.subSchemeNameMr
                : "-",
              mainSchemeKey: r.schemesConfigKey,
              subSchemeKey: r.subSchemeKey,
              informationTitleMr: r.informationTitleMr,
              activeFlag: r.activeFlag,
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
        await setData({
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

  useEffect(() => {
    if (watch("mainSchemeKey")) {
      getSubScheme();
      var a =
        mainNames &&
        mainNames.find((r) => {
          return r.id == watch("mainSchemeKey");
        })?.schemePrefix;
    }
  }, [watch("mainSchemeKey")]);

  const getSubScheme = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.BSUPURL
        }/mstSubSchemes/getAllByMainSchemeKey?mainSchemeKey=${watch(
          "mainSchemeKey"
        )}`,
        {
          headers:headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setSubSchemeNames(
          r.data.mstSubSchemesList.map((row) => ({
            id: row.id,
            subSchemeName: row.subSchemeName,
            subSchemeNameMr: row.subSchemeNameMr,
          }))
        );
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getInformationType = () => {
    const infoType = [
      { value: "ft", name: "Textbox" },
      { value: "dd", name: "Dropdown" },
      { value: "fl", name: "File/Document" },
    ];
    setInformationType(infoType);
  };

  const onSubmitForm = (fromData) => {
    let _body = {
      ...fromData,
      isMandatory: isMandatory,
      isOptional: false,
      isVerified: false,
      schemesConfigKey: fromData.mainSchemeKey,
      subSchemeKey: fromData.subSchemeKey,
      infoSelectionData: fromData.infoSelectionData,
    };
    if (btnSaveText === "Save") {
      setIsLoading(true);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstSchemesConfigData/save`, _body, {
          headers:headers,
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
            setIsMandatory(false);
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
        .post(`${urls.BSUPURL}/mstSchemesConfigData/save`, _body, {
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
            fetchTableData();
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsMandatory(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

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
            .post(`${urls.BSUPURL}/mstSchemesConfigData/save/`, body, {
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
                fetchTableData();
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
            .post(`${urls.BSUPURL}/mstSchemesConfigData/save`, body, {
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
                fetchTableData();
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

  useEffect(() => {
    if (watch("informationType") == "dd") {
      setShowDropdown(true);
      setDocuentInput(false);
    } else if (watch("informationType") == "fl") {
      setShowDropdown(false);
      setDocuentInput(true);
    } else {
      setShowDropdown(false);
      setDocuentInput(false);
    }
  }, [watch("informationType")]);

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
    isMandatory: false;
    setIsMandatory(false);
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
    subSchemeKey: "",
    informationTitle: "",
    informationType: "",
    informationTitleMr: "",
    isMandatory: false,
  };

  // Reset Values Exit
  const resetValuesExit = {
    schemePrefix: "",
    schemePrefixMr: "",
    fromDate: "",
    fromDateMr: "",
    toDate: "",
    toDateMr: "",
    schemeNo: "",
    schemeNoMr: "",
    schemeName: "",
    schemeNameMr: "",
    id: null,
    isMandatory: false,
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 60,
    },
    {
      field: language === "en" ? "informationTitle" : "informationTitleMr",
      headerName: <FormattedLabel id="informationTitleT" />,
      width: 700,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
    },
    {
      field: language === "en" ? "mainSchemeName" : "mainSchemeNameMr",
      headerName: <FormattedLabel id="schemeNameT" />,
      width: 300,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
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
                reset(params.row);
                setIsMandatory(params.row.isMandatory);
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

  const isMandatoryChangeHandle = (event) => {
    const newValue = event.target.checked;
    isMandatory = newValue;
    setIsMandatory(newValue);
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
                <FormattedLabel id="schemeConfigData" />
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
                            sx={{ minWidth: "90%" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            {mainNames &&
                              mainNames.map((auditorium, index) => (
                                <MenuItem key={index} value={auditorium.id}>
                                  {language == "en"
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

                  {/* sub scheme dropdown */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      error={errors.subSchemeKey}
                      variant="standard"
                      sx={{
                        m: { xs: 0, md: 1 },
                        minWidth: "100%",
                        maxWidth: "100%", 
                      }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="subScheme" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{
                              m: { xs: 0, md: 1 },
                              minWidth: "100%",
                            }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            {subSchemeNames &&
                              subSchemeNames.map((auditorium, index) => (
                                <MenuItem
                                  key={index}
                                  value={auditorium.id}
                                  style={{ whiteSpace: "normal" }}
                                >
                                  {language == "en"
                                    ? auditorium.subSchemeName
                                    : auditorium.subSchemeNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="subSchemeKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.subSchemeKey
                          ? errors.subSchemeKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Information title english */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    style={{ backgroundColor: "white" }}
                    inputProps={{ maxLength: 500 }}
                    id="outlined-basic"
                    multiline
                    rows={4}
                    label={<FormattedLabel id="informationTitle" />}
                    variant="standard"
                    {...register("informationTitle")}
                    error={!!errors.informationTitle}
                    helperText={
                      errors?.informationTitle
                        ? errors.informationTitle.message
                        : null
                    }
                  /> */}
                    <Transliteration
                      variant={"standard"}
                      _key={"informationTitle"}
                      labelName={"informationTitle"}
                      fieldName={"informationTitle"}
                      updateFieldName={"informationTitleMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="informationTitle" required />}
                      error={!!errors.informationTitle}
                      helperText={
                        errors?.informationTitle
                          ? errors.informationTitle.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Information title marathi */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    multiline
                    rows={4}
                    label={<FormattedLabel id="informationTitleMr" />}
                    inputProps={{ maxLength: 500 }}
                    variant="standard"
                    {...register("informationTitleMr")}
                    error={!!errors.informationTitleMr}
                    helperText={
                      errors?.informationTitleMr
                        ? errors.informationTitleMr.message
                        : null
                    }
                  /> */}
                    <Transliteration
                      variant={"standard"}
                      _key={"informationTitleMr"}
                      labelName={"informationTitleMr"}
                      multiline
                      rows={4}
                      fieldName={"informationTitleMr"}
                      updateFieldName={"informationTitle"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={
                        <FormattedLabel id="informationTitleMr" required />
                      }
                      error={!!errors.informationTitleMr}
                      helperText={
                        errors?.informationTitleMr
                          ? errors.informationTitleMr.message
                          : null
                      }
                    />
                  </Grid>

                  {/* information type dropdown */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      error={errors.informationType}
                      variant="standard"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="informationType" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: "90%" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            {informationType &&
                              informationType.map((auditorium, index) => (
                                <MenuItem key={index} value={auditorium.value}>
                                  {auditorium.name}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="informationType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.informationType
                          ? errors.informationType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {showDropdown && showDocuentInput === false && (
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="informationSelectionData" />}
                        variant="standard"
                        {...register("infoSelectionData")}
                        error={!!errors.infoSelectionData}
                        helperText={
                          errors?.infoSelectionData
                            ? errors.infoSelectionData.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  {/* bachat gat or new scheme application selection */}
                  {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      error={errors.isMandatory}
                      variant="standard"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="isMandatory" required />
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
                                <MenuItem  value='true'>
                                  {language === "en"
                                    ? 'Mandatory'
                                    : 'अनिवार्य'}
                                </MenuItem>

                                <MenuItem  value='false'>
                                  {language === "en"
                                    ? 'Optional'
                                    : 'पर्यायी'}
                                </MenuItem>

                          </Select>
                        )}
                        name="isMandatory"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.isMandatory
                          ? errors.isMandatory.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={isMandatory}
                            checked={isMandatory}
                            onChange={isMandatoryChangeHandle}
                          />
                        }
                        label={<FormattedLabel id="isMandatory" />}
                      />
                    </div>
                  </Grid>

                  {/* Buttons  */}
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
                        // className={commonStyles.buttonExit}
                        endIcon={<ExitToAppIcon />}
                        onClick={() => {
                          exitButton();
                          setIsMandatory(false);
                          setIsMandatory(false);
                        }}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        // className={commonStyles.buttonBack}
                        endIcon={<ClearIcon />}
                        onClick={() => {
                          cancellButton();
                          setIsMandatory(false);
                          setIsMandatory(false);
                        }}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        // className={commonStyles.buttonSave}
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
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight={true}
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
            // "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            // {
            //   display: "none",
            // },
          }}
          density="comfortable"
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
            fetchTableData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            fetchTableData(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
