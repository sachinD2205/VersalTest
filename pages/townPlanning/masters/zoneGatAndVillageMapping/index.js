import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import styles from "../view.module.css";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";
const Index = () => {
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
    gatName: yup.string().required(<FormattedLabel id="gatV" />),
    tdrZoneKey: yup.string().required(<FormattedLabel id="zoneV" />),
  });
  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  let isDisabled = false;
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [ID, setID] = useState(null);
  const [villageDropDown, setVillageDropDown] = useState([
    {
      id: 1,
      villageNameEn: "",
      villageNameMr: "",
    },
  ]);
  const [gatDropDown, setGatDropDown] = useState([
    { id: 1, gatNameEn: "", gatNameMr: "" },
  ]);
  const [zoneDropDown, setzoneDropDown] = useState([
    { id: 1, zoneName: "", zoneNamemar: "" },
  ]);
  const [table, setTable] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [runAgain, setRunAgain] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRunAgain(false);

    //Village
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setVillageDropDown(
          // @ts-ignore
          r.data.village.map((j) => ({
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
      .get(`${urls.CFCURL}/master/gatMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setGatDropDown(
          r.data.gatMaster.map((j) => ({
            id: j.id,
            gatNameEn: j.gatNameEn,
            gatNameMr: j.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Zone
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setzoneDropDown(
          r.data.zone.map((j) => ({
            id: j.id,
            zoneNameEn: j.zoneName,
            zoneNameMr: j.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const getZoneGatVillage = () => {
    axios
      .get(`${urls.TPURL}/tDRZoneGatVillageMappingMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setTable(
          r.data.gatVillageMapping.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            activeFlag: j.activeFlag,
            villageNameEn: villageDropDown.find(
              (obj) => obj?.id === j.villageKey,
            )?.villageNameEn,
            villageNameMr: villageDropDown.find(
              (obj) => obj?.id === j.villageKey,
            )?.villageNameMr,
            gatNameEn: gatDropDown.find((obj) => obj?.id === j.gatName)
              ?.gatNameEn,
            gatNameMr: gatDropDown.find((obj) => obj?.id === j.gatName)
              ?.gatNameMr,
            zoneNameEn: zoneDropDown.find((obj) => obj?.id === j.tdrZoneKey)
              ?.zoneNameEn,
            zoneNameMr: zoneDropDown.find((obj) => obj?.id === j.tdrZoneKey)
              ?.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getZoneGatVillage();
  }, [runAgain, villageDropDown, gatDropDown, zoneDropDown]);
  // Reset Values Exit
  const resetValuesExit = {
    id: null,
  };
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 120,
    },
    {
      field: language === "en" ? "villageNameEn" : "villageNameMr",
      headerName: <FormattedLabel id="villageName" />,
      width: 250,
    },
    {
      field: language === "en" ? "gatNameEn" : "gatNameMr",
      headerName: <FormattedLabel id="gatName" />,
      width: 250,
    },
    {
      field: language === "en" ? "zoneNameEn" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneName" />,
      width: 250,
    },

    {
      field: "action",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      renderCell: (params) => {
        console.log("dfgfd", params);
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
    console.log("fffff", values, villageDropDown);
    const villageId = villageDropDown.find(
      // @ts-ignore
      (obj) => obj?.villageNameEn === values.villageNameEn,
      // @ts-ignore
    )?.id;
    const gatId = gatDropDown.find(
      // @ts-ignore
      (obj) => obj?.gatNameEn === values.gatNameEn,
      // @ts-ignore
    )?.id;
    const zoneId = zoneDropDown.find(
      // @ts-ignore
      (obj) => obj?.zoneNameEn === values.zoneNameEn,
      // @ts-ignore
    )?.id;
    setID(values.id);
    reset({
      ...values,
      villageKey: villageId,
      gatName: gatId,
      tdrZoneKey: zoneId,
    });
    setEditButtonInputState(true);
    setBtnSaveText("Save");
    setButtonInputState(true);
    setSlideChecked(true);
    setIsOpenCollapse(!isOpenCollapse);
  };

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
            .post(`${urls.TPURL}/tDRZoneGatVillageMappingMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                language == "en"
                  ? sweetAlert({
                      title: "Inactivate!",
                      text: "The record is Successfully inactive!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "निष्क्रिय करा!",
                      text: "रेकॉर्ड यशस्वीरित्या निष्क्रिय केला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                getZoneGatVillage();
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
            .post(`${urls.TPURL}/tDRZoneGatVillageMappingMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
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
                getZoneGatVillage();
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

  const onBack = () => {
    const urlLength = router.asPath.split("/").length;
    const urlArray = router.asPath.split("/");
    let backUrl = "";
    if (urlLength > 2) {
      for (let i = 0; i < urlLength - 1; i++) {
        backUrl += urlArray[i] + "/";
      }
      router.push(`${backUrl}`);
    } else {
      router.push("/dashboard");
    }
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    villageKey: "",
    gatName: "",
    tdrZoneKey: "",
  };

  const cancellButton = () => {
    reset({ id: ID, ...resetValuesCancell });
  };

  const onSubmit = async (data) => {
    const bodyForAPI = {
      ...data,
    };

    await axios
      .post(`${urls.TPURL}/tDRZoneGatVillageMappingMaster/save`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
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
          setRunAgain(true);
          reset({ ...resetValuesCancell, id: null });
          setCollapse(false);
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
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
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
            <FormattedLabel id="ZoneGatAndVillageMapping" />
            {/* Zone-Gat and Village Mapping */}
          </h2>
        </Box>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={3}
                      lg={3}
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
                        sx={{ width: "200px", marginTop: "2%" }}
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
                              {villageDropDown &&
                                villageDropDown.map((value, index) => (
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
                                        ? value?.villageNameEn
                                        : value?.villageNameMr
                                    }
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
                      xl={3}
                      lg={3}
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
                        sx={{ width: "200px", marginTop: "2%" }}
                        variant="standard"
                        error={!!errors.gatName}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          disabled={isDisabled}
                        >
                          <FormattedLabel id="gatName" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
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
                                      language === "en"
                                        ? value?.gatNameEn
                                        : value?.gatNameMr
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
                      xl={3}
                      lg={3}
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
                        sx={{ width: "200px", marginTop: "2%" }}
                        variant="standard"
                        error={!!errors.tdrZoneKey}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          disabled={isDisabled}
                        >
                          <FormattedLabel id="zoneName" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // value={field.value}
                              disabled={isDisabled}
                              value={
                                router.query.tdrZoneKey
                                  ? router.query.tdrZoneKey
                                  : field.value
                              }
                              onChange={(value) => field.onChange(value)}
                              label="tdrZoneKey"
                            >
                              {zoneDropDown &&
                                zoneDropDown.map((value, index) => (
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
                                        ? value?.zoneNameEn
                                        : value?.zoneNameMr
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="tdrZoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.tdrZoneKey
                            ? errors.tdrZoneKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* 
                    <Grid
                      item
                      xl={3}
                      lg={3}
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
                        InputLabelProps={{
                          shrink:
                            (watch("citySurveyNo") ? true : false) ||
                            (router.query.citySurveyNo ? true : false),
                        }}
                        sx={{ width: 230 }}
                        id="standard-basic"
                        label={<FormattedLabel id="citySurveyNo" required />}
                        variant="standard"
                        {...register("citySurveyNo")}
                        error={!!errors.citySurveyNo}
                        helperText={
                          errors?.citySurveyNo
                            ? errors.citySurveyNo.message
                            : null
                        }
                      />
                    </Grid> */}
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
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText === <FormattedLabel id="update" /> ? (
                          <FormattedLabel id="update" />
                        ) : (
                          <FormattedLabel id="save" />
                        )}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
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
            endIcon={<AddIcon />}
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
            {/* Add */}
            <FormattedLabel id="add" />
          </Button>
        </div>

        <div
          className={styles.table}
          style={{ display: "flex", alignItems: "center" }}
        >
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
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </div>
      </Paper>
    </>
  );
};

export default Index;
