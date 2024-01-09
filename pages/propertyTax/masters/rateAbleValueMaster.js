import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  InputLabel,
  Select,
  ThemeProvider,
  MenuItem,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import Schema from "../../../containers/schema/propertyTax/masters/rateAbleValueMaster";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";

import theme from "../../../theme";
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  });
  const userToken = useGetToken();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneCategorys, setZoneCategorys] = useState([]);
  const [zones, setZones] = useState([]);
  const [gats, setgats] = useState([]);
  const [usageTypes, setUsageTypes] = useState([]);
  const [usageSubTypes, setUsageSubTypes] = useState([]);
  const [constructionTypes, setConstructionTypes] = useState([]);
  const [constructionSubTypes, setConstructionSubTypes] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    getAllRateAbleValueRate();
  }, [
    zoneCategorys,
    zones,
    gats,
    usageTypes,
    constructionTypes,
    constructionSubTypes,
  ]);

  // Get Table - Data
  const getAllRateAbleValueRate = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PTAXURL}/master/rateableValueRate/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log(";res", res);

        let result = res.data?.rateableValueRate;
        let _res = result?.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1,
            zoneCategory: val.zoneCategory,
            zoneCategory1: zoneCategorys?.find(
              (obj) => obj.id === val.zoneCategory
            )?.zoneCategory,

            zone: val.zone,
            zone1: zones?.find((obj) => obj.id === val.zone)?.zone,

            gat: val.gat,
            gat1: gats?.find((obj) => obj.id === val.gat)?.gat,

            usageType: val.usageType,
            usageType1: usageTypes?.find((obj) => obj.id === val.usageType)
              ?.usageType,

            usageSubType: val.usageSubType,
            usageSubType1: usageSubTypes?.find(
              (obj) => obj.id === val.usageSubType
            )?.usageSubType,

            constructionType: val.constructionType,
            constructionType1: constructionTypes?.find(
              (obj) => obj.id === val.constructionType
            )?.constructionType,

            constructionSubType: val.constructionSubType,
            fromDate: moment(val.fromDate).format("llll"),
            toDate: val.toDate,
            remark: val.remark,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Zone Categorys

  const gettingAllZoneCategory = () => {
    axios
      .get(`${urls.PTAXURL}/master/zoneCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setZoneCategorys(
          res.data?.zoneCategory.map((r, i) => ({
            id: r.id,
            zoneCategory: r.zoneCategory,
            zoneCategoryMr: r.zoneCategoryMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Zone

  const gettingAllZone = () => {
    axios
      .get(`${urls.PTAXURL}/master/administrativeZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setZones(
          res.data?.administrativeZone.map((r, i) => ({
            id: r.id,
            zone: r.adZoneName,
            zoneMr: r.adZoneNameMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Gat Name

  const gettingAllGatName = () => {
    axios
      .get(`${urls.PTAXURL}/master/circleGatMapping/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setgats(
          res.data?.circleGat.map((r, i) => ({
            id: r.id,
            gat: r.gatName,
            gatMr: r.gatNameMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Usage Type

  const gettingAllUsageType = () => {
    axios
      .get(`${urls.PTAXURL}/master/usageType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setUsageTypes(
          res.data?.usageType.map((r, i) => ({
            id: r.id,
            usageType: r.usageType,
            usageTypeMr: r.usageTypeMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Sub Usage Type

  const gettingAllSubUsageType = () => {
    axios
      .get(`${urls.PTAXURL}/master/subUsageType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setUsageSubTypes(
          res.data?.subUsageType.map((r, i) => ({
            id: r.id,
            subUsageType: r.subUsageType,
            subUsageTypeMr: r.subUsageTypeMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Construction Type

  const gettingAllConstructionType = () => {
    axios
      .get(`${urls.PTAXURL}/master/constructionType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setConstructionTypes(
          res.data?.constructionType.map((r, i) => ({
            id: r.id,
            constructionTypeName: r.constructionTypeName,
            constructionTypeNameMr: r.constructionTypeNameMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // ConstructionSub Type

  // const gettingAllConstructionType = () => {
  //   axios
  //     .get("${urls.PTAXURL}/master/constructionType/getAll")
  //     .then((res) => {
  //       console.log("res", res);
  //       setFinYear(
  //         res.data?.constructionType.map((r, i) => ({
  //           id: r.id,
  //           constructionTypeName: r.constructionTypeName,
  //           constructionTypeNameMr: r.constructionTypeNameMr,
  //         }))
  //       );
  //     });
  // };

  useEffect(() => {
    gettingAllZoneCategory();
    gettingAllZone();
    gettingAllGatName();
    gettingAllUsageType();
    gettingAllSubUsageType();
    gettingAllConstructionType();
  }, []);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Save - DB
    // alert("Clicked...");
    console.log("form Data", formData);

    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const percentage = Number(formData.percentage);

    const finalBodyForApi = {
      ...formData,
      percentage,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("420", finalBodyForApi);

    axios
      .post(`${urls.PTAXURL}/master/rateableValueRate/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllRateAbleValueRate();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        if (error.request.status === 500) {
          swal(error.response.data.message, {
            icon: "error",
          });
          getAllRateAbleValueRate();
          setButtonInputState(false);
        } else {
          catchExceptionHandlingMethod(error, language);
          getAllRateAbleValueRate();
          setButtonInputState(false);
        }
        // console.log("error", error);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("520", body);
        if (willDelete === true) {
          axios
            .post(`${urls.PTAXURL}/master/rateableValueRate/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAllRateAbleValueRate();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllRateAbleValueRate();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllRateAbleValueRate();
                setButtonInputState(false);
              }
              // console.log("error", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setButtonInputState(false);
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
        // console.log("inn", willDelete);
        console.log("620", body);

        if (willDelete === true) {
          axios
            .post(`${urls.PTAXURL}/master/rateableValueRate/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Recovered!", {
                  icon: "success",
                });
                getAllRateAbleValueRate();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllRateAbleValueRate();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllRateAbleValueRate();
                setButtonInputState(false);
              }
              // console.log("error", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setButtonInputState(false);
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
    zoneCategory: "",
    zone: "",
    gat: "",
    usageType: "",
    usageSubType: "",
    constructionType: "",
    constructionSubType: "",
    remark: "",
    fromDate: null,
    toDate: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneCategory: "",
    zone: "",
    gat: "",
    usageType: "",
    usageSubType: "",
    constructionType: "",
    constructionSubType: "",
    remark: "",
    fromDate: null,
    toDate: null,
    id: null,
  };

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" /> },
    {
      field: "zoneCategory1",
      headerName: <FormattedLabel id="zoneCategory" />,
      flex: 1,
    },
    {
      field: "zone1",
      headerName: <FormattedLabel id="administrativeZone" />,
      flex: 1,
    },
    {
      field: "gat1",
      headerName: <FormattedLabel id="gatName" />,
      flex: 1,
    },
    {
      field: "usageType1",
      headerName: <FormattedLabel id="usageType" />,
      flex: 1,
    },
    {
      field: "constructionType1",
      headerName: <FormattedLabel id="constructionType" />,
      flex: 1,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
    },
    { field: "toDate", headerName: <FormattedLabel id="toDate" /> },
    { field: "status", headerName: <FormattedLabel id="status" /> },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Save");
                setBtnSaveTextMr("अद्यतन");
                setID(params.row.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update");
                setBtnSaveTextMr("अद्यतन");
                setID(params.row.id);
                //   setIsOpenCollapse(true),
                setSlideChecked(true);
                setButtonInputState(true);
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
          </>
        );
      },
    },
  ];

  // Row

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              height: "auto",
              overflow: "auto",
              padding: "10px 80px",
            }}
          >
            <Grid
              className={styles.details}
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: linearGradient(
                //   "90deg,rgb(72 115 218 / 91%) 2%,rgb(142 122 231) 100%"
                // ),
                color: "black",
                padding: "8px",
                fontSize: 19,
                borderRadius: "20px",
              }}
            >
              <strong>
                <FormattedLabel id="rateableValueMaster" />
              </strong>
            </Grid>
          </Box>

          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* //////////////////////////////////////////////////First Line////////////////////////////////////////////////////// */}

                  <Grid
                    container
                    spacing={2}
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.zoneCategory}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="zoneCategory" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // label="Financial Year"
                              label={<FormattedLabel id="zoneCategory" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {zoneCategorys &&
                                zoneCategorys.map((zoneCat, i) => (
                                  <MenuItem key={i} value={zoneCat.id}>
                                    {zoneCat.zoneCategory}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zoneCategory"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zoneCategory
                            ? errors.zoneCategory.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.zone}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="administrativeZone" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // label="Financial Year"
                              label={<FormattedLabel id="administrativeZone" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {zones &&
                                zones.map((zone, i) => (
                                  <MenuItem key={i} value={zone.id}>
                                    {zone.zone}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zone"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zone ? errors.zone.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.gat}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="gatName" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // label="Financial Year"
                              label={<FormattedLabel id="gatName" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {gats &&
                                gats.map((gat, i) => (
                                  <MenuItem key={i} value={gat.id}>
                                    {gat.gat}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="gat"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.gat ? errors.gat.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.usageType}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="usageType" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // label="Financial Year"
                              label={<FormattedLabel id="usageType" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {usageTypes &&
                                usageTypes.map((usageType, i) => (
                                  <MenuItem key={i} value={usageType.id}>
                                    {usageType.usageType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="usageType"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.usageType ? errors.usageType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.usageSubType}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="usageSubType" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // label="Financial Year"
                              label={<FormattedLabel id="usageSubType" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {usageSubTypes &&
                                usageSubTypes.map((usageSubType, i) => (
                                  <MenuItem key={i} value={usageSubType.id}>
                                    {usageSubType.subUsageType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="usageSubType"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.usageSubType
                            ? errors.usageSubType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.constructionType}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="constructionType" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // label="Financial Year"
                              label={<FormattedLabel id="constructionType" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {constructionTypes &&
                                constructionTypes.map((ct, i) => (
                                  <MenuItem key={i} value={ct.id}>
                                    {ct.constructionTypeName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="constructionType"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.constructionType
                            ? errors.constructionType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white" }}
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
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromDate" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
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

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white" }}
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
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="toDate" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDate ? errors.toDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="remark" />}
                        // variant="outlined"
                        variant="standard"
                        {...register("remark")}
                      />
                    </Grid>
                  </Grid>

                  {/* //////////////////////////////////////////////////Buttons Line////////////////////////////////////////////////////// */}

                  <Grid container style={{ padding: "10px" }} spacing={2}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {language === "en" ? btnSaveText : btnSaveTextMr}
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Slide>
          )}

          <Grid
            container
            style={{ padding: "10px" }}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={9}></Grid>
            <Grid
              item={true}
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  });
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("Save");
                  setBtnSaveTextMr("जतन करा");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                <FormattedLabel id="add" />
              </Button>
            </Grid>
          </Grid>

          <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
            <DataGrid
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {
                  // backgroundColor:'red',
                  // height: '800px !important',
                  // display: "flex",
                  // flexDirection: "column-reverse",
                  // overflow:'auto !important'
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  disableExport: true,
                  disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              density="compact"
              autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data?.totalRows}
              rowsPerPageOptions={data?.rowsPerPageOptions}
              page={data?.page}
              pageSize={data?.pageSize}
              rows={data?.rows}
              columns={columns}
              onPageChange={(_data) => {
                getAllRateAbleValueRate(data?.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllRateAbleValueRate(_data, data?.page);
              }}
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
