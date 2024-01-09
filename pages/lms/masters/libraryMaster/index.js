import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
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
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import sweetAlert from "sweetalert";
// import styles from '../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css'
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
// import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./view.module.css";
import { ThemeProvider } from "@emotion/react";
import theme from "../../../../theme";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import * as yup from "yup";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  // schema - validation
  let schema = yup.object().shape({
    zoneKey: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Zone name is Required !!!"
          : "झोनचे नाव आवश्यक आहे !!!"
      ),
    wardKey: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Ward name is Required !!!"
          : "प्रभाग नाव आवश्यक आहे !!!"
      ),
    village: yup
      .string()
      .required(
        language == "en"
          ? "Village name is Required !!!"
          : "गावाचे नाव आवश्यक आहे !!!"
      ),
    gisId: yup
      .string()
      .required(
        language == "en"
          ? "GIS ID is Required !!!"
          : "जीआयएस आयडी आवश्यक आहे !!!"
      ),
    libraryName: yup
      .string()
      .required(
        language == "en"
          ? "Library Name is Required !!!"
          : "ग्रंथालयचे नाव आवश्यक आहे !!!"
      ),
    libraryNameMr: yup
      .string()
      .required(
        language == "en"
          ? "Library Name in marathi is Required !!!"
          : "ग्रंथालयचे नाव मराठीत आवश्यक आहे !!!"
      )
      .matches(
        /^[a-zA-Z\s\u0900-\u0965\u096F-\u097F]+$/,
        "Only alphabets and spaces are allowed for this field"
      ),
    libraryType: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Library Type is Required !!!"
          : "ग्रंथालयचा प्रकार आवश्यक आहे !!!"
      ),
    libraryClassification: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Library Administrative status is Required !!!"
          : "ग्रंथालयची प्रशासकीय स्थिती आवश्यक आहे !!!"
      ),
  });

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   setValue,
  //   reset,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   // resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

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

  const [btnSaveText, setBtnSaveText] = useState("save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();
  const [libraryTypes, setLibraryTypes] = useState([
    { id: 1, libraryType: "L", libraryTypeName: "Library" },
    { id: 2, libraryType: "C", libraryTypeName: "Competetive Center" },
    ,
    { id: 2, libraryType: "P", libraryTypeName: "Post Graduate Library" },
  ]);
  const [libraryClassifications, setLibraryClassifications] = useState([
    { id: 1, libraryClassification: "Outsource" },
    { id: 2, libraryClassification: "PCMC Owned" },
  ]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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

  const [zoneKeys, setZoneKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const [wardKeys, setWardKeys] = useState([]);
  const [wardByZoneKeys, setWardByZoneKeys] = useState([]);

  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
    // .catch((err) => {
    //   swal(
    //     language == "en" ? "Error!" : "त्रुटी!",
    //     language == "en"
    //       ? "Somethings Wrong Zones not Found!"
    //       : "काहीतरी चुकीचे आहे, झोन सापडले नाहीत!",
    //     "error"
    //   );
    // });
  };
  // get Ward Keys
  const getWardKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardKey: row.wardName,
            wardKeyMr: row.wardNameMr,
          }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };

  //   WardKeys by zonekey
  const getWardByZoneId = () => {
    if (watch("zoneKey")) {
      axios
        .get(
          `${
            urls.CFCURL
          }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${watch(
            "zoneKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          setWardByZoneKeys(
            r?.data?.map((row) => ({
              id: row.id,
              wardName: row.wardName,
              wardNameMr: row.wardNameMr,
            }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };

  // Get Table - Data
  const getBookClassifications = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: "id",
          sortDir: "dsc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        console.log(";r", r);
        let result = r.data.libraryMasterList;
        console.log("result", result);
        let pno = r.data?.pageNo;
        let psize = r.data?.pageSize;
        let _res = result.map((r, i) => {
          console.log("44", r.wardKey, wardKeys);
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: pno * psize + (i + 1),
            // bookType: r.bookType,
            libraryName: r.libraryName,
            libraryNameMr: r.libraryNameMr,
            libraryType: r.libraryType,
            zone: zoneKeys?.find((item) => item.id == r.zoneKey)?.zoneName,
            zoneMr: zoneKeys?.find((item) => item.id == r.zoneKey)?.zoneNameMr,
            ward: wardKeys?.find((item) => item.id == r.wardKey)?.wardKey,
            wardMr: wardKeys?.find((item) => item.id == r.wardKey)?.wardKeyMr,
            village: r.village,
            gisId: r.gisId,
            libraryClassification: r.libraryClassification,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((e) => {
        setLoading(false);
        callCatchMethod(e, language);
      });
  };

  const onSubmitForm = (fromData) => {
    setLoading(true);
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "save") {
      const tempData = axios
        .post(`${urls.LMSURL}/libraryMaster/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        // .catch((err) => setLoading(false));
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      const tempData = axios
        .post(`${urls.LMSURL}/libraryMaster/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            setLoading(false);
            fromData.id
              ? sweetAlert(
                  language == "en" ? "Updated!" : "अपडेट केले",
                  language == "en"
                    ? "Record Updated successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  "success"
                )
              : sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            getBookClassifications();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        // .catch((err) => setLoading(false));
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    setLoading(true);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
            .post(`${urls.LMSURL}/libraryMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                setLoading(false);
                swal(
                  language == "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getBookClassifications();
                // setButtonInputState(false);
              }
            })
            // .catch((err) => setLoading(false));
            .catch((e) => {
              callCatchMethod(e, language);
              setLoading(false);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            // .delete(`${urls.LMSURL}/bookTypeMaster/delete/${body.id}`)
            .post(`${urls.LMSURL}/libraryMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                setLoading(false);
                swal(
                  language == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                // getPaymentRate();
                getBookClassifications();
                // setButtonInputState(false);
              }
            })
            // .catch((err) => setLoading(false));
            .catch((e) => {
              callCatchMethod(e, language);
              setLoading(false);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
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
    setWardByZoneKeys([]);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setWardByZoneKeys([]);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    libraryName: "",
    libraryNameMr: "",
    village: "",
    libraryType: "",
    gisId: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    libraryName: "",
    village: "",
    libraryNameMr: "",
    libraryType: "",
    gisId: "",
    id: null,
  };

  useEffect(() => {
    // getBookClassifications()
    getZoneKeys();
    getWardKeys();
  }, []);

  useEffect(() => {
    getWardByZoneId();
  }, [watch("zoneKey")]);

  useEffect(() => {
    getBookClassifications();
  }, [fetchData, zoneKeys, wardKeys]);

  const columns = [
    {
      field: "srNo",
      // headerName: 'id',
      // headerName: <FormattedLabel id="srNo" />,
      headerName: language === "en" ? "Sr.No" : "अनुक्रमांक",
      flex: 0.3,
    },
    {
      field: language === "en" ? "zone" : "zoneMr",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="zone" />,
      headerName: language === "en" ? "Zone" : "झोन",
      flex: 0.7,
    },
    {
      field: language === "en" ? "ward" : "wardMr",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="ward" />,
      headerName: language === "en" ? "Ward" : "प्रभाग",
      flex: 0.7,
    },
    {
      field: "village",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="village" />,
      headerName: language === "en" ? "Village" : "गाव",

      flex: 0.7,
    },
    {
      field: "gisId",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="gisId" />,
      headerName: language === "en" ? "GIS Id" : "GIS आयडी",

      flex: 0.5,
    },
    {
      field: "libraryType",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="libraryType" />,
      headerName: language === "en" ? "Library Type" : "ग्रंथालय प्रकार",
      flex: 0.6,
    },
    {
      field: "libraryClassification",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="libraryClassification" />,
      headerName:
        language === "en"
          ? "Library Administrative Status"
          : "लायब्ररी प्रशासकीय स्थिती",
      flex: 0.7,
    },

    {
      field: language === "en" ? "libraryName" : "libraryNameMr",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="libraryName" />,
      headerName:
        language === "en"
          ? "Library Name/Competitive Study Centre(En)"
          : "ग्रंथालयाचे/स्पर्धात्मक अभ्यास केंद्र नाव (मराठी मध्ये)",
      flex: 2,
    },
    // {
    //   field: "libraryNameMr",
    //   // headerName: 'Book Type',
    //   headerName: <FormattedLabel id="libraryNameMr" />,
    //   flex: 1,
    // },

    {
      field: "actions",
      // headerName: 'Actions',
      // headerName: <FormattedLabel id="actions" />,
      headerName: language === "en" ? "Actions" : "क्रिया",
      // width: 120,
      // flex: 1,
      flex: 1,
      align: "right",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue(
                  "zoneKey",
                  zoneKeys?.find((item) => item.zoneName == params.row.zone)?.id
                );
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
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
    <ThemeProvider theme={theme}>
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
          <BreadcrumbComponent />
        </Box>
        <LmsHeader labelName="libraryCSCMaster" />

        {loading ? (
          <Loader />
        ) : (
          <>
            <div>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "red",
                  marginLeft: "7vh",
                  marginTop: "2vh",
                  marginBottom: "2vh",
                }}
              >
                <FormattedLabel id="note" />
                {/* *Note - Library Type must be 1) L(for library)  2) C(for Competitive center) */}
              </Typography>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid
                      container
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
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.zoneKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="zone" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                //sx={{ width: 230 }}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("Zone Key: ", value.target.value);
                                  // setTemp(value.target.value)
                                }}
                                label="Zone Name  "
                              >
                                {zoneKeys &&
                                  zoneKeys.map((zoneKey, index) => (
                                    <MenuItem key={index} value={zoneKey.id}>
                                      {/*  {zoneKey.zoneKey} */}

                                      {language == "en"
                                        ? zoneKey?.zoneName
                                        : zoneKey?.zoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zoneKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneKey ? errors.zoneKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.wardKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="ward" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Ward Name *"
                              >
                                {/* {wardKeys &&
                                  wardKeys.map((wardKey, index) => (
                                    <MenuItem key={index} value={wardKey.id}>
                                      {wardKey.wardKey}
                                    </MenuItem>
                                  ))} */}
                                {wardByZoneKeys &&
                                  wardByZoneKeys.map((wardKey, index) => (
                                    <MenuItem key={index} value={wardKey.id}>
                                      {language === "en"
                                        ? wardKey.wardName
                                        : wardKey.wardNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="wardKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.wardKey ? errors.wardKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          // label="Book Type"
                          label={<FormattedLabel id="village" required />}
                          id="standard-basic"
                          variant="standard"
                          {...register("village")}
                          error={!!errors?.village}
                          sx={{ marginTop: 2 }}
                          InputLabelProps={{
                            shrink:
                              (watch("village") ? true : false) ||
                              (router.query.village ? true : false),
                          }}
                          helperText={
                            errors?.village ? errors.village.message : null
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
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          // label="Book Type"
                          label={<FormattedLabel id="gisId" required />}
                          id="standard-basic"
                          variant="standard"
                          {...register("gisId")}
                          error={!!errors?.gisId}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("gisId") ? true : false) ||
                              (router.query.gisId ? true : false),
                          }}
                          helperText={
                            errors?.gisId ? errors.gisId.message : null
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
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* <TextField
                      // label="Book Type"
                      label={<FormattedLabel id="libraryName" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("libraryName")}
                      error={!!errors.libraryName}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("libraryName") ? true : false) ||
                          (router.query.libraryName ? true : false),
                      }}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.libraryName
                          ? "libraryName is Required !!!"
                          : null
                      }
                    /> */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Transliteration
                            _key={"libraryName"}
                            // labelName={"libraryName"}
                            fieldName={"libraryName"}
                            updateFieldName={"libraryNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={<FormattedLabel id="libraryName" required />}
                            error={!!errors.libraryName}
                            targetError={"libraryNameMr"}
                            width={230}
                            InputLabelProps={{
                              shrink:
                                (watch("libraryName") ? true : false) ||
                                (router.query.libraryName ? true : false),
                            }}
                            textFieldMargin={1}
                            helperText={
                              errors?.libraryName
                                ? errors.libraryName.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* <TextField
                      // label="Book Type"
                      label={<FormattedLabel id="libraryNameMr" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("libraryNameMr")}
                      error={!!errors.libraryNameMr}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("libraryNameMr") ? true : false) ||
                          (router.query.libraryNameMr ? true : false),
                      }}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.libraryNameMr
                          ? "libraryNameMr is Required !!!"
                          : null
                      }
                    /> */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Transliteration
                            _key={"libraryNameMr"}
                            // labelName={"libraryNameMr"}
                            fieldName={"libraryNameMr"}
                            updateFieldName={"libraryName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel id="libraryNameMr" required />
                            }
                            error={!!errors.libraryNameMr}
                            targetError={"libraryName"}
                            textFieldMargin={1}
                            width={230}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink:
                                (watch("libraryNameMr") ? true : false) ||
                                (router.query.libraryNameMr ? true : false),
                            }}
                            helperText={
                              errors?.libraryNameMr
                                ? errors.libraryNameMr.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <TextField
                                            // label="Book Type"
                                            label={<FormattedLabel id="libraryType" />}
                                            id="standard-basic"
                                            variant="standard"
                                            {...register('libraryType')}
                                            error={!!errors.libraryType}
                                            InputProps={{ style: { fontSize: 18 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch('libraryType') ? true : false) ||
                                                    (router.query.libraryType ? true : false),
                                            }}
                                            helperText={
                                                // errors?.studentName ? errors.studentName.message : null
                                                errors?.libraryType ? 'Book Type is Required !!!' : null
                                            }
                                        />
                                    </Grid> */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.libraryType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Book Classification */}
                            {<FormattedLabel id="libraryType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                // label="Book Classification"
                                label={<FormattedLabel id="libraryType" />}
                              >
                                {libraryTypes &&
                                  libraryTypes.map((libraryType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={libraryType.libraryType}
                                    >
                                      {libraryType.libraryTypeName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="libraryType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.libraryType
                              ? errors.libraryType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.libraryClassification}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Book Classification */}
                            {
                              <FormattedLabel
                                id="libraryClassification"
                                required
                              />
                            }
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                // label="Book Classification"
                                label={
                                  <FormattedLabel id="libraryClassification" />
                                }
                              >
                                {libraryClassifications &&
                                  libraryClassifications.map(
                                    (libraryClassification, index) => (
                                      <MenuItem
                                        key={index}
                                        value={
                                          libraryClassification.libraryClassification
                                        }
                                      >
                                        {
                                          libraryClassification.libraryClassification
                                        }
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="libraryClassification"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.libraryClassification
                              ? errors.libraryClassification.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        container
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "10px",
                        }}
                      >
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "end" }}
                        >
                          <Button
                            type="submit"
                            size="small"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {/* {btnSaveText === 'Update' ? 'Update' : 'Save'} */}
                            {<FormattedLabel id={btnSaveText} />}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            {/* clear */}
                            {<FormattedLabel id="clear" />}
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            {/* exit */}
                            {<FormattedLabel id="exit" />}
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
                endIcon={<AddIcon />}
                size="small"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  });
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("save");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                {/* add */}
                {<FormattedLabel id="add" />}
              </Button>
            </div>

            <DataGrid
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

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
              // rows={dataSource}
              // columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection

              density="compact"
              // autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBookClassifications(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getBookClassifications(_data, data.page);
              }}
            />
          </>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
