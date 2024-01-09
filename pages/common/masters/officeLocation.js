import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
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
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/officeLocationSchema";
import styles from "../../../styles/cfc/cfc.module.css";
import { useSelector } from "react-redux";
import Transliteration from "../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const OfficeLocation = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();

  useEffect(() => {
    getZone();
    getPinCodes();
  }, []);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  const router = useRouter();

  const exitBack = () => {
    router.back();
  };

  const getZone = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoad(true);

    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res, i) => {
        setLoad(false);

        let result = res.data.officeLocation;
        let _res = result.map((res, i) => {
          // console.log("res payment mode", res.data.department);
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            activeFlag: res.activeFlag,
            gisId: res.gisId,
            id: res.id,
            officeLocationCode: res.officeLocationCode
              ? res.officeLocationCode
              : "-",
            officeLocationName: res.officeLocationName
              ? res.officeLocationName
              : "-",
            officeLocationNameMar: res.officeLocationNameMar
              ? res.officeLocationNameMar
              : "-",
            officeLocationArea: res.officeLocationArea
              ? res.officeLocationArea
              : "-",
            officeLocationAreaMar: res.officeLocationAreaMar
              ? res.officeLocationAreaMar
              : "-",
            officeLocationNameAddress: res.officeLocationNameAddress
              ? res.officeLocationNameAddress
              : "-",
            officeLocationNameAddressMar: res.officeLocationNameAddressMar
              ? res.officeLocationNameAddressMar
              : "-",
            officeLocationPincode: res.officeLocationPincode
              ? res.officeLocationPincode
              : "-",
            officeLocationLandmark: res.officeLocationLandmark
              ? res.officeLocationLandmark
              : "-",
            officeLocationLandmarkMr: res.officeLocationLandmarkMr
              ? res.officeLocationLandmarkMr
              : "-",
            isDepartmentLocation: res.isDepartmentLocation
              ? res.isDepartmentLocation
              : "-",
            latitude: res.latitude ? res.latitude : "-",
            longitude: res.longitude ? res.longitude : "-",
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setLoad(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // const getZone = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
  //   setLoad(true);
  //   axios
  //     .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
  //       params: {
  //         pageSize: _pageSize,
  //         pageNo: _pageNo,
  //         sortBy: _sortBy,
  //         sortDir: _sortDir,
  //       },
  //     })
  //     .then((res, i) => {
  //       if (res.status == 200) {
  //         setLoad(false);
  //         let result = res.data.officeLocation;
  //         let _res = result.map((res, i) => {
  //           console.log("res payment mode", res);
  //           return {
  // srNo: i + 1 + _pageNo * _pageSize,
  // activeFlag: res.activeFlag,
  // gisId: res.gisId,
  // id: res.id,
  // officeLocationCode: res.officeLocationCode,
  // officeLocationName: res.officeLocationName,
  // officeLocationNameMar: res.officeLocationNameMar,
  // officeLocationArea: res.officeLocationArea,
  // officeLocationAreaMar: res.officeLocationAreaMar,
  // officeLocationNameAddress: res.officeLocationNameAddress,
  // officeLocationNameAddressMar: res.officeLocationNameAddressMar,
  // officeLocationPincode: res.officeLocationPincode,
  // officeLocationLandmark: res.officeLocationLandmark,
  // officeLocationLandmarkMr: res.officeLocationLandmarkMr,
  // isDepartmentLocation: res.isDepartmentLocation,
  // latitude: res.latitude,
  // longitude: res.longitude,

  // status: res.activeFlag === "Y" ? "Active" : "InActive",
  //           };
  //         });
  //       }

  //       setData({
  //         rows: _res,
  //         totalRows: res.data.totalElements,
  //         rowsPerPageOptions: [10, 20, 50, 100],
  //         pageSize: res.data.pageSize,
  //         page: res.data.pageNo,
  //       });

  //       setLoad(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoad(false);
  //     });
  // };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/mstOfficeLocation/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getZone();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/mstOfficeLocation/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getZone();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

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

  const [pincodes, setPinCodes] = useState([]);

  // getCrPinCodes
  const getPinCodes = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setPinCodes(
          r.data.pinCode.map((row) => ({
            id: row.id,
            crPincode: row.pinCode,
            crPincodeMr: row.pinCodeMr,
            prPincode: row.pinCode,
            prPincodeMr: row.pinCodeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      // fromDate,
      // toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/mstOfficeLocation/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "officeLocationName") {
                setError("officeLocationName", { message: x.code });
              } else if (x.field == "officeLocationNameMar") {
                setError("officeLocationNameMar", { message: x.code });
              }
            });
          } else {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getZone();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    officeLocationCode: "",
    officeLocationName: "",
    officeLocationNameMar: "",
    officeLocationArea: "",
    officeLocationAreaMar: "",
    officeLocationNameAddress: "",
    officeLocationNameAddressMar: "",
    officeLocationPincode: "",
    officeLocationLandmark: "",
    officeLocationLandmarkMr: "",
    isDepartmentLocation: "",
    latitude: "",
    longitude: "",
    gisId: "",
  };

  const resetValues = {
    officeLocationCode: "",
    officeLocationName: "",
    officeLocationNameMar: "",
    officeLocationArea: "",
    officeLocationAreaMar: "",
    officeLocationNameAddress: "",
    officeLocationNameAddressMar: "",
    officeLocationPincode: "",
    officeLocationLandmark: "",
    officeLocationLandmarkMr: "",
    isDepartmentLocation: "",
    latitude: "",
    longitude: "",
    gisId: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    // fromDate: "",
    // toDate: "",
    officeLocationCode: "",
    officeLocationName: "",
    officeLocationNameMar: "",
    officeLocationArea: "",
    officeLocationAreaMar: "",
    officeLocationNameAddress: "",
    officeLocationNameAddressMar: "",
    officeLocationPincode: "",
    officeLocationLandmark: "",
    officeLocationLandmarkMr: "",
    isDepartmentLocation: "",
    latitude: "",
    longitude: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 0.3,
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "officeLocationCode",
      headerName: <FormattedLabel id="officeLocationCode" />,
      flex: 0.6,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "officeLocationName",
      headerName: <FormattedLabel id="officeLocationName" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "officeLocationNameMar",
      headerName: <FormattedLabel id="officeLocationNameMar" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "officeLocationArea" : "officeLocationAreaMar",
      headerName:
        language === "en" ? (
          <FormattedLabel id="officeLocationArea" />
        ) : (
          <FormattedLabel id="officeLocationAreaMar" />
        ),
      // type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                //   disabled={editButtonInputState && params.row.activeFlag === "N" ? false : true}
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  console.log("params.row: ", params.row);
                  reset(params.row);
                }}
              >
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  //   public String officeLocationCode;

  //     public String officeLocationName;

  //     public String officeLocationNameMar;

  //     public String officeLocationArea;

  //     public String officeLocationAreaMar;

  //     public String officeLocationNameAddress;

  //     public String officeLocationNameAddressMar;

  //     public Long officeLocationPincode;

  //     public String officeLocationLandmark;

  //     public String isDepartmentLocation;

  //     public String status;

  //     public String gisId;

  //     public Double latitude;

  //     public Double longitude;

  //     public String uploadLocationImage;

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "36%" }}>
            {<FormattedLabel id="officeLocation" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValues,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                backgroundColor: "#F5F5F5",
              }}
            >
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"officeLocationName"}
                          labelName={"officeLocationName"}
                          fieldName={"officeLocationName"}
                          updateFieldName={"officeLocationNameMar"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="officeLocationName" required />
                          }
                          error={!!errors.officeLocationName}
                          helperText={
                            errors?.officeLocationName
                              ? errors.officeLocationName.message
                              : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        sx={{ width: "90%", backgroundColor: "white" }}
                        size="small"
                        id="outlined-basic"
                        label={<FormattedLabel id="officeLocationName" />}
                        variant="outlined"
                        {...register("officeLocationName")}
                        error={!!errors.officeLocationName}
                        helperText={
                          errors?.officeLocationName
                            ? errors.officeLocationName.message
                            : null
                        }
                      /> */}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"officeLocationNameMar"}
                          labelName={"officeLocationNameMar"}
                          fieldName={"officeLocationNameMar"}
                          updateFieldName={"officeLocationName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel
                              id="officeLocationNameMar"
                              required
                            />
                          }
                          error={!!errors.officeLocationNameMar}
                          helperText={
                            errors?.officeLocationNameMar
                              ? errors.officeLocationNameMar.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"officeLocationArea"}
                          labelName={"officeLocationArea"}
                          fieldName={"officeLocationArea"}
                          updateFieldName={"officeLocationAreaMar"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="officeLocationArea" required />
                          }
                          error={!!errors.officeLocationArea}
                          helperText={
                            errors?.officeLocationArea
                              ? errors.officeLocationArea.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"officeLocationAreaMar"}
                          labelName={"officeLocationAreaMar"}
                          fieldName={"officeLocationAreaMar"}
                          updateFieldName={"officeLocationArea"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel
                              id="officeLocationAreaMar"
                              required
                            />
                          }
                          error={!!errors.officeLocationAreaMar}
                          helperText={
                            errors?.officeLocationAreaMar
                              ? errors.officeLocationAreaMar.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"officeLocationNameAddress"}
                          labelName={"officeLocationNameAddress"}
                          fieldName={"officeLocationNameAddress"}
                          updateFieldName={"officeLocationNameAddressMar"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel
                              id="officeLocationNameAddress"
                              required
                            />
                          }
                          error={!!errors.officeLocationNameAddress}
                          helperText={
                            errors?.officeLocationNameAddress
                              ? errors.officeLocationNameAddress.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"officeLocationNameAddressMar"}
                          labelName={"officeLocationNameAddressMar"}
                          fieldName={"officeLocationNameAddressMar"}
                          updateFieldName={"officeLocationNameAddress"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel
                              id="officeLocationNameAddressMar"
                              required
                            />
                          }
                          error={!!errors.officeLocationNameAddressMar}
                          helperText={
                            errors?.officeLocationNameAddressMar
                              ? errors.officeLocationNameAddressMar.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        sx={{
                          width: "90%",
                          backgroundColor: "white",
                        }}
                        error={!!errors.officeLocationPincode}
                        size="small"
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          {<FormattedLabel id="officeLocationPincode" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              variant="outlined"
                              // disabled={inputState}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                <FormattedLabel id="officeLocationPincode" />
                              }
                            >
                              {pincodes &&
                                pincodes.map((pincode, index) => (
                                  <MenuItem key={index} value={pincode.id}>
                                    {language === "en"
                                      ? pincode?.crPincode
                                      : pincode?.crPincodeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="officeLocationPincode"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.officeLocationPincode
                            ? errors.officeLocationPincode.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        // label="CFC Name Mr"
                        label={<FormattedLabel id="officeLocationLandmark" />}
                        variant="outlined"
                        {...register("officeLocationLandmark")}
                        error={!!errors.officeLocationLandmark}
                        helperText={
                          errors?.officeLocationLandmark
                            ? errors.officeLocationLandmark.message
                            : null
                        }
                        InputLabelProps={{
                          shrink: watch("officeLocationLandmark")
                            ? true
                            : false,
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        // label="CFC Name Mr"
                        label={<FormattedLabel id="isDepartmentLocation" />}
                        variant="outlined"
                        {...register("isDepartmentLocation")}
                        error={!!errors.isDepartmentLocation}
                        helperText={
                          errors?.isDepartmentLocation
                            ? errors.isDepartmentLocation.message
                            : null
                        }
                        InputLabelProps={{
                          shrink: watch("isDepartmentLocation") ? true : false,
                        }}
                      />
                    </Grid>
                  </Grid>
                  {/* gis */}
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        // label="CFC ID"
                        label={<FormattedLabel id="gisId" />}
                        variant="outlined"
                        {...register("gisId")}
                        error={!!errors.gisId}
                        helperText={errors?.gisId ? errors.gisId.message : null}
                        InputLabelProps={{
                          shrink: watch("gisId") ? true : false,
                        }}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="latitude" />}
                        variant="outlined"
                        {...register("latitude")}
                        error={!!errors.latitude}
                        helperText={
                          errors?.latitude ? errors.latitude.message : null
                        }
                        InputLabelProps={{
                          shrink: watch("latitude") ? true : false,
                        }}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="longitude" />}
                        variant="outlined"
                        {...register("longitude")}
                        error={!!errors.longitude}
                        helperText={
                          errors?.longitude ? errors.longitude.message : null
                        }
                        InputLabelProps={{
                          shrink: watch("longitude") ? true : false,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    {/* <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      sx={{ marginTop: 5 }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="fromDate" />}</span>}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "80%" }}
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
                      <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                    </FormControl>
                  </Grid> */}
                    {/* <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      sx={{ marginTop: 5 }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" />}</span>}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "80%" }}
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
                      <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                    </FormControl>
                  </Grid> */}
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        // label="CFC Name Mr"
                        label={<FormattedLabel id="officeLocationCode" />}
                        variant="outlined"
                        {...register("officeLocationCode")}
                        error={!!errors.officeLocationCode}
                        helperText={
                          errors?.officeLocationCode
                            ? errors.officeLocationCode.message
                            : null
                        }
                        InputLabelProps={{
                          shrink: watch("officeLocationCode") ? true : false,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className={styles.feildres}
                    sx={{ padding: "10px" }}
                  >
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        size="small"
                        color="success"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="Save" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<ClearIcon />}
                        color="primary"
                        onClick={() => {
                          reset({
                            ...resetValuesExit,
                          });
                        }}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Paper>
          </Slide>
        )}

        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            // autoHeight={true}
            autoHeight={data.pageSize}
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#E3EAEA",
                borderLeft: "10px solid white",
                borderRight: "10px solid white",
                borderTop: "4px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E3EAEA",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-column": {
                backgroundColor: "red",
              },
            }}
            pagination
            paginationMode="server"
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getZone(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              getZone(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default OfficeLocation;
