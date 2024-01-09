import { yupResolver } from "@hookform/resolvers/yup";
import { Add, Clear, Edit, ExitToApp, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import styles from "../view.module.css";
// import URLS from '../../../components/townPlanning/urls'
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useSelector } from "react-redux";
import { default as URLS, default as urls } from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";
const NewIndex = () => {
  const user = useSelector((state) => state?.user.user);
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
  let schema = yup.object().shape({
    villageKey: yup.string().required(<FormattedLabel id="villageNameV" />),
    landReservationLegend: yup
      .string()
      .required(<FormattedLabel id="landReservationLegendV" />),
    landReservationNameEn: yup
      .string()
      .required(<FormattedLabel id="landReservationNameEnV" />),

    landReservationNameMr: yup
      .string()
      .required(<FormattedLabel id="landReservationNameMrV" />),

    landReservationNumber: yup
      .string()
      .required(<FormattedLabel id="landReservationNumberV" />),

    surveyNo: yup.string().required(<FormattedLabel id="surveyNoV" />),
    gatName: yup.string().required(<FormattedLabel id="gatV" />),
    citySurveyNo: yup.string().required(<FormattedLabel id="citySurveyNoV" />),

    // resrvationArea: yup.string().required("Please enter remark in Marathi."),

    // landInPossession: yup.string().required("Please enter remark in Marathi."),
    // landNotInPossession: yup
    //   .string()
    //   .required("Please enter remark in Marathi."),
  });
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    // methods,
    reset,
    watch,
    formState: { errors },
  } = methods;

  let isDisabled = false;
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [ID, setID] = useState(null);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [villageNameDropDown, setVillageNameDropDown] = useState([
    {
      id: 1,
      villageNameEn: "",
      villageNameMr: "",
    },
  ]);
  const [gatDropDown, setGatDropDown] = useState([
    {
      id: 1,
      gatNameEn: "",
      gatNameMr: "",
    },
  ]);

  const [landReservationNameDropDown, setLandReservationNameDropDown] =
    useState([
      {
        id: 1,
        landReservationNameEn: "",
        landReservationNameMr: "",
      },
    ]);
  const [table, setTable] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [runAgain, setRunAgain] = useState(false);

  useEffect(() => {
    setRunAgain(false);

    //Village
    // axios.get(`${URLS.CFCURL}/master/village/getAll`).then((r) => {
    axios
      .get(`${URLS.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Village data: ", r.data.village);
        setVillageNameDropDown(
          // @ts-ignore
          r.data.village.map((j, i) => ({
            id: j.id,
            villageNameEn: j.villageName,
            villageNameMr: j.villageNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Gat
    axios
      .get(`${URLS.CFCURL}/master/gatMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Gat data:", r.data.gatMaster);
        setGatDropDown(
          r.data.gatMaster.map((j, i) => ({
            id: j.id,
            gatNameEn: j.gatNameEn,
            gatNameMr: j.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Land Reservation
    // axios.get(`${URLS.BaseURL}/landReservationMaster/getAll`).then((r) => {
    axios
      .get(`${URLS.TPURL}/reservationTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Land Reservation data:", r.data.reservationType);
        setLandReservationNameDropDown(
          r.data.reservationType.map((j, i) => ({
            id: j.id,
            landReservationNameEn: j.reservationNameEn,
            landReservationNameMr: j.reservationNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  //Table
  useEffect(() => {
    getData();
  }, [runAgain, villageNameDropDown, landReservationNameDropDown, gatDropDown]);

  const getData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "Desc",
  ) => {
    axios
      .get(`${URLS.TPURL}/villageWiseLandReservationEntryMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let _res = r.data.villageWiseLandReservationEntryMaster.map((j, i) => {
          console.log("Table33", j);
          return {
            id: j.id,
            srNo: i + 1,
            activeFlag: j.activeFlag,
            surveyNo: j.surveyNo,
            citySurveyNo: j.citySurveyNo,
            resrvationArea: j.resrvationArea,
            landReservationLegend: j.landReservationLegend,
            landInPossession: j.landInPossession,
            landNotInPossession: j.landNotInPossession,
            landReservationNameEn: j.landReservationNameEn,
            landReservationNumber: j.landReservationNumber,
            landReservationNameMr: j.landReservationNameMr,
            villageNameEn: villageNameDropDown.find(
              (arg) => arg.id === j.villageKey,
            )?.villageNameEn,
            villageNameMr: villageNameDropDown.find(
              (arg) => arg.id === j.villageKey,
            )?.villageNameMr,
            // landReservationNameEn: j.landReservationName,
            // landReservationNameEn: j.landReservationNameEn
            //   ? landReservationNameDropDown?.find(
            //       (obj) => obj?.id == j.landReservationNameEn,
            //     )?.landReservationNameEn
            //   : "-",
            // landReservationLegend: landReservationNameDropDown?.find(
            //   (obj) => obj?.id === j.landReservationLegend,
            // )?.landReservationLegend,
            gatNameEn: gatDropDown.find((obj) => obj?.id === j.gatName)
              ?.gatNameEn,
            gatNameMr: gatDropDown.find((obj) => obj?.id === j.gatName)
              ?.gatNameMr,
          };
        });
        // setTable()
        console.log("kay mahanti public", _res);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
    },
    {
      field: language === "en" ? "villageNameEn" : "villageNameMr",
      headerName: <FormattedLabel id="villageName" />,
      width: 200,
    },
    {
      field: "landReservationNameEn",
      headerName: <FormattedLabel id="landReservationNameEn" />,
      width: 200,
    },
    {
      field: language === "en" ? "gatNameEn" : "gatNameMr",
      headerName: <FormattedLabel id="gatName" />,
      width: 200,
    },
    {
      field: "surveyNo",
      headerName: <FormattedLabel id="surveyNumber" />,
      width: 140,
    },
    {
      field: "citySurveyNo",
      headerName: <FormattedLabel id="citySurveyNo" />,
      width: 140,
    },
    // {
    //   field: 'resrvationArea',
    //   headerName: <FormattedLabel id='reservationNo' />,
    //   width: 150,
    // },
    {
      field: "landReservationLegend",
      headerName: <FormattedLabel id="landReservationLegend" />,
      width: 100,
    },

    {
      field: "action",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      renderCell: (params) => {
        console.log("sdzfsdf", params);
        return (
          <>
            <IconButton
              disabled={collapse}
              onClick={() => editById(params.row)}
            >
              <Edit color="primary" />
            </IconButton>
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
          </>
        );
      },
    },
  ];

  const editById = (values) => {
    console.log("sdfesdf", values);
    setID(values.id);
    setBtnSaveText("Update");
    const villageID = villageNameDropDown.find(
      // @ts-ignore
      (obj) => obj?.villageNameEn === values.villageNameEn,
      // @ts-ignore
    )?.id;
    const gatID = gatDropDown.find(
      // @ts-ignore
      (obj) => obj?.gatNameEn === values.gatNameEn,
      // @ts-ignore
    )?.id;
    const landID = landReservationNameDropDown.find(
      // @ts-ignore
      (obj) => obj?.serviceName === values.serviceName,
      // @ts-ignore
    )?.id;

    reset({
      ...values,
      villageKey: villageID,
      landReservationName: landID,
      gatName: gatID,
    });
    setCollapse(true);
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", _activeFlag);
    if (_activeFlag === "N") {
      const textAlert =
        language == "en"
          ? "Are you sure you want to inactivate this Record ?"
          : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?";
      const title = language == "en" ? "Inactivate?" : "निष्क्रिय करा";
      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${urls.TPURL}/villageWiseLandReservationEntryMaster/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                language == "en"
                  ? sweetAlert({
                      title: "Inactivate!",
                      text: "The record is Successfully Inactivate!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "निष्क्रिय करा!",
                      text: "रेकॉर्ड यशस्वीरित्या निष्क्रिय केला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                getData();
                // setButtonInputState(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
        }
      });
    } else {
      language == "en"
        ? "Are you sure you want to activate this Record ? "
        : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?";
      const title = language == "en" ? "Activate?" : "सक्रिय करायचे?";
      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${urls.TPURL}/villageWiseLandReservationEntryMaster/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 200) {
                language == "en"
                  ? sweetAlert({
                      title: "Activate!",
                      text: "The record is Successfully Activated!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "सक्रिय केला!",
                      text: "रेकॉर्ड यशस्वीरित्या सक्रिय केला गेला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                getData();
                // setButtonInputState(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
        }
      });
    }
  };
  // Reset Values Exit
  const resetValuesExit = {
    id: null,
  };
  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setCollapse(false);
    setRunAgain(true);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    villageKey: "",
    landReservationName: "",
    gatName: "",
    surveyNo: "",
    citySurveyNo: "",
    resrvationArea: "",
    landReservationLegend: "",
    landInPossession: "",
    landNotInPossession: "",
  };

  const cancellButton = () => {
    reset({
      id: ID,
      ...resetValuesCancell,
    });
  };

  const onSubmit = async (data) => {
    console.log("Form Data: ", data);

    const bodyForAPI = {
      ...data,
      activeFlag: btnSaveText == "Update" ? "Y" : null,
      landReservationName: Number(data?.landReservationName),
      villageKey: Number(data?.villageKey),
      surveyNo: Number(data?.surveyNo),
      citySurveyNo: Number(data?.citySurveyNo),
      gatName: Number(data?.gatName),
      resrvationArea: Number(data?.resrvationArea),
      landInPossession: Number(data?.landInPossession),
      landNotInPossession: Number(data?.landNotInPossession),
    };

    console.log("Sagla data append kelya nantr: ", bodyForAPI);

    await axios
      .post(
        `${URLS.TPURL}/villageWiseLandReservationEntryMaster/save`,
        bodyForAPI,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (data.id) {
            sweetAlert(
              language == "en" ? "Updated!" : "अपडेट केले!",
              language == "en"
                ? "Record Updated successfully !"
                : " यशस्वीरित्या अपडेट केले गेले",
              "success",
            );
          } else {
            sweetAlert(
              language == "en" ? "Saved!" : "जतन केले!",
              language == "en"
                ? "Record Saved successfully! "
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success",
            );
          }
          getData();
          setRunAgain(true);
          reset({ ...resetValuesCancell, id: null });
          setCollapse(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 2,
          marginBottom: 2,
          padding: 1,
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
        autoHeight
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="villageWiseLandReservationEntry" />
            {/* Village Wise Land Reservation Entry */}
          </h2>
        </Box>

        <Paper style={{ padding: "3% 3%" }}>
          {collapse && (
            <Slide direction="down" in={collapse} mountOnEnter unmountOnExit>
              <div style={{ padding: "3% 3%" }}>
                <>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            sx={{
                              marginTop: "2%",
                            }}
                            variant="standard"
                            error={!!errors.villageKey}
                          >
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              disabled={isDisabled}
                            >
                              <FormattedLabel id="villageName" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "250px" }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  // value={field.value}
                                  disabled={isDisabled}
                                  value={
                                    router.query.villageKey
                                      ? router.query.villageKey
                                      : field.value
                                  }
                                  onChange={(value) => field.onChange(value)}
                                  label="villageKey"
                                >
                                  {villageNameDropDown &&
                                    villageNameDropDown.map((value, index) => (
                                      <MenuItem key={index} value={value?.id}>
                                        {language === "en"
                                          ? value?.villageNameEn
                                          : value?.villageNameMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="villageKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.villageKey
                                ? errors.villageKey.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            sx={{ width: "250px", marginTop: "2%" }}
                            variant="standard"
                            error={!!errors.landReservationLegend}
                          >
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              disabled={isDisabled}
                            >
                              <FormattedLabel id="landReservationLegend" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "250px" }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  disabled={isDisabled}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="landReservationLegend"
                                >
                                  {landReservationNameDropDown &&
                                    landReservationNameDropDown.map(
                                      (value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === "en"
                                              ? value?.landReservationNameEn
                                              : value?.landReservationNameMr
                                          }
                                        </MenuItem>
                                      ),
                                    )}
                                </Select>
                              )}
                              name="landReservationLegend"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.landReservationLegend
                                ? errors.landReservationLegend.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: "3vw",
                          }}
                        >
                          <Transliteration
                            // variant={"outlined"}
                            _key={"landReservationNameEn"}
                            labelName={"landReservationNameEn"}
                            fieldName={"landReservationNameEn"}
                            updateFieldName={"landReservationNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            width={250}
                            label={
                              <FormattedLabel
                                id="landReservationNameEn"
                                required
                              />
                            }
                            error={!!errors.landReservationNameEn}
                            helperText={
                              errors?.landReservationNameEn
                                ? errors.landReservationNameEn.message
                                : null
                            }
                          />
                        </Grid>
                        {/* <TextField
                          sx={{
                            width: "200px", marginTop: "2%",
                          }}
                          id="standard-basic"
                          label={
                            <FormattedLabel
                              id="landReservationNameEn"
                              required
                            />}
                          variant="standard"
                          {...register("landReservationNameEn")}
                          error={!!errors.landReservationNameEn}
                          helperText={
                            errors?.landReservationNameEn
                              ? errors.landReservationNameEn.message
                              : null}
                          disabled={isDisabled}
                          defaultValue={
                            router.query.landReservationNameEn
                              ? router.query.landReservationNameEn
                              : ""}
                        /> */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: "3vw",
                          }}
                        >
                          <Transliteration
                            // variant={"outlined"}
                            _key={"landReservationNameMr"}
                            labelName={"landReservationNameMr"}
                            fieldName={"landReservationNameMr"}
                            updateFieldName={"landReservationNameEn"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            width={250}
                            label={
                              <FormattedLabel
                                id="landReservationNameMr"
                                required
                              />
                            }
                            error={!!errors.landReservationNameMr}
                            helperText={
                              errors?.landReservationNameMr
                                ? errors.landReservationNameMr.message
                                : null
                            }
                          />
                        </Grid>
                        {/* <TextField
                          sx={{
                            width: "200px",
                            // marginRight: '5%',
                            marginTop: "2%",
                          }}
                          id="standard-basic"
                          label={
                            <FormattedLabel
                              id="landReservationNameMr"
                              required
                            />
                          }
                          variant="standard"
                          {...register("landReservationNameMr")}
                          error={!!errors.landReservationNameMr}
                          helperText={
                            errors?.landReservationNameMr
                              ? errors.landReservationNameMr.message
                              : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.landReservationNameMr
                              ? router.query.landReservationNameMr
                              : ""
                          }
                        /> */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "250px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="landReservationNo" required />
                            }
                            // label="land Reservation Number"
                            variant="standard"
                            {...register("landReservationNumber")}
                            error={!!errors.landReservationNumber}
                            helperText={
                              errors?.landReservationNumber
                                ? errors.landReservationNumber.message
                                : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.landReservationNumber
                                ? router.query.landReservationNumber
                                : ""
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "250px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="surveyNumber" required />
                            }
                            variant="standard"
                            {...register("surveyNo")}
                            error={!!errors.surveyNo}
                            helperText={
                              errors?.surveyNo ? errors.surveyNo.message : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.surveyNo ? router.query.surveyNo : ""
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            // sx={{ width: "200px", marginTop: "2%" }}
                            variant="standard"
                            error={!!errors.gatName}
                          >
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              disabled={isDisabled}
                            >
                              <FormattedLabel id="gatName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "250px" }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  // value={field.value}
                                  disabled={isDisabled}
                                  value={
                                    router.query.gatName
                                      ? router.query.gatName
                                      : field.value
                                  }
                                  onChange={(value) => field.onChange(value)}
                                  label="gatName"
                                >
                                  {gatDropDown &&
                                    gatDropDown.map((value, index) => (
                                      <MenuItem
                                        key={index}
                                        value={
                                          // @ts-ignore
                                          value?.id
                                        }
                                      >
                                        {
                                          // @ts-ignore
                                          value?.gatNameEn
                                        }
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="gatName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.gatName ? errors.gatName.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "250px",
                              // marginRight: '5%',
                              // marginTop: "2%",
                            }}
                            id="standard-basic"
                            label={<FormattedLabel id="citySurveyNo" />}
                            variant="standard"
                            {...register("citySurveyNo")}
                            error={!!errors.citySurveyNo}
                            helperText={
                              errors?.citySurveyNo
                                ? errors.citySurveyNo.message
                                : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.citySurveyNo
                                ? router.query.citySurveyNo
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>
                      <div className={styles.buttons}>
                        <Button
                          variant="contained"
                          type="submit"
                          endIcon={<Save />}
                        >
                          {/* <FormattedLabel id='save' /> */}
                          {btnSaveText}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          endIcon={<Clear />}
                          onClick={cancellButton}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => exitButton()}
                          endIcon={<ExitToApp />}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </>
              </div>
            </Slide>
          )}

          <div className={styles.addbtn}>
            <Button
              variant="contained"
              // endIcon={<AddIcon />}
              endIcon={<Add />}
              disabled={buttonInputState}
              onClick={() => {
                if (!collapse) {
                  setCollapse(true);
                } else {
                  setCollapse(false);
                }
                setButtonInputState(true);
              }}
            >
              {/* Add */}
              <FormattedLabel id="add" />
            </Button>
          </div>
          <div
            className={styles.table}
            style={{ display: "flex", alignItems: "center" }}
          >
            <DataGrid
              sx={{
                marginTop: "5vh",
                marginBottom: "3vh",
                // height: 370.5,
                width: 1005,
              }}
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              autoHeight
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
                getData(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                getData(_data, data.page);
              }}
            />
          </div>
        </Paper>
      </Paper>
    </>
  );
};

export default NewIndex;
