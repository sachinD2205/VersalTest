import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import itiTradeMasterSchema from "../../../../containers/schema/iti/masters/itiTradeMasterSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(itiTradeMasterSchema),
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const router = useRouter();
  const userToken = useGetToken();

  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [departmentKeys, setDepartmentKeys] = useState([]);
  const [subDepartmentKeys, setSubDepartmentKeys] = useState([]);
  const [itiKeys, setItiKeys] = useState([]);
  const [tradeTypes, setTradeTypes] = useState([
    {
      id: 1,
      value: "Engineering",
    },
    {
      id: 2,
      value: "Non Engineering",
    },
  ]);

  const language = useSelector((state) => state.labels.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);
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

  //   get zoneKeys
  const getZoneKeys = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setZoneKeys(
        r?.data?.zone?.map((data) => ({
          id: data?.id,
          zoneName: data?.zoneName,
          zoneNameMr: data?.zoneNameMr,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  //   get all ward
  const getAllWards = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setAllWards(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  //   get filtered wardKeys
  let zoneId = watch("zoneKey");
  const getWardKeys = () => {
    if (zoneId === "" || zoneId === null) {
      setWardKeys([]);
    } else if (zoneId) {
      axios
        .get(
          `${
            urls.CFCURL
          }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${zoneId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setWardKeys(
            r?.data?.map((data) => ({
              id: data?.id,
              wardName: data?.wardName,
              wardNameMr: data?.wardNameMr,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  //   get ITI Names
  const getItiKeys = () => {
    axios.get(`${urls.SCHOOL}/mstIti/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setItiKeys(
        r?.data?.mstItiList.map((data) => ({
          id: data?.id,
          itiName: data?.itiName,
          itiType: data?.itiType,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  useEffect(() => {
    getWardKeys();
  }, [zoneId]);

  useEffect(() => {
    getZoneKeys();
    getAllWards();
    getItiKeys();
  }, []);

  useEffect(() => {
    getItiTradeMaster();
  }, [fetchData, zoneKeys, itiKeys, allWards]);

  // Get Table - Data
  const getItiTradeMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.SCHOOL}/mstItiTrade/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
       
      })
      .then((r) => {
        console.log(";r", r);
        let result = r?.data?.mstItiTradeList;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            ...r,
            activeFlag: r.activeFlag,
            id: r?.id,
            srNo: i + 1 + page,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",

            zoneKey: r?.zoneKey,
            zoneName: zoneKeys?.find((i) => i?.id === r?.zoneKey)?.zoneName,
            wardKey: r?.wardKey,
            wardName: allWards?.find((i) => i?.id === r?.wardKey)?.wardName,
            wardNameMr: allWards?.find((i) => i?.id === r?.wardKey)?.wardNameMr,
            itiKey: r?.itiKey,
            itiName: itiKeys?.find((i) => i?.id === r?.itiKey)?.itiName,
            itiType: itiKeys?.find((i) => i?.id === r?.itiKey)?.itiType,
            tradeName: r?.tradeName,
            tradeFees: r?.tradeFees,
            tradeDescription: r?.tradeDescription,
            intake: r?.intake,
            remark: r?.remark,
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
        console.log("Eroor", error);
      });
  };

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/mstItiTrade/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
          console.log("Eroor", error);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/mstItiTrade/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getItiTradeMaster();
            setButtonInputState(false);
            setShowTable(true);
            setEditButtonInputState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  // Delete By ID
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
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/mstItiTrade/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getItiTradeMaster();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
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
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/mstItiTrade/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getItiTradeMaster();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
              console.log("Eroor", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
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
    setShowTable(true);
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
    zoneKey: "",
    wardKey: "",
    itiKey: "",
    tradeName: "",
    tradeDuration: "",
    tradeUnit: "",
    tradeAffiliationNo: "",
    tradeType: "",
    tradeDescription: "",
    intake: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,

    zoneKey: "",
    wardKey: "",
    itiKey: "",
    tradeName: "",
    tradeDuration: "",
    tradeUnit: "",
    tradeAffiliationNo: "",
    tradeType: "",
    tradeDescription: "",
    intake: "",
    remark: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "zoneName",
      headerName: labels.zoneName,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wardName",
      headerName: labels.wardName,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itiName",
      headerName: labels.itiName,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tradeType",
      headerName: labels.tradeType,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tradeName",
      headerName: labels.tradeName,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "tradeFees",
    //   headerName: labels.tradeFees,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "intake",
      headerName: labels.intakeCapacity,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: labels.actions,
      width: 120,
      align: "center",
      headerAlign: "center",
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
                  setShowTable(false),
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
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                console.log("params.row: ", params.row);
                reset(params.row);
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
          </Box>
        );
      },
    },
  ];

  // Row

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          // marginTop: "50px",
          // marginBottom: "60px",
          padding: 1,
        }}
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
          <h2>{labels.itiTradeMaster}</h2>
        </Box>
        <Box
          sx={{
            marginLeft: 10,
            marginRight: 5,
            marginTop: 2,
            marginBottom: 3,
            padding: 1,
            // border: 1,
            // borderColor:'grey.500'
          }}
        >
          <Box p={1}>
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
                      {/* Zone Name */}
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
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel error={!!errors.zoneKey}>
                            {labels.zoneName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="zoneKey"
                            // rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.zoneKey}
                              >
                                {zoneKeys &&
                                  zoneKeys.map((zone, index) => (
                                    <MenuItem key={index} value={zone.id}>
                                      {language == "en"
                                        ? zone?.zoneName
                                        : zone?.zoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.zoneKey ? errors.zoneKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Ward Name */}
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
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel error={!!errors.wardKey}>
                            {labels.wardName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="wardKey"
                            // rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                disabled={
                                  watch("zoneKey") === 20 ? true : false
                                }
                                variant="standard"
                                {...field}
                                error={!!errors.wardKey}
                              >
                                {wardKeys &&
                                  wardKeys.map((ward, index) => (
                                    <MenuItem key={index} value={ward.id}>
                                      {language == "en"
                                        ? ward?.wardName
                                        : ward?.wardNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.wardKey ? errors.wardKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Select itiKey */}
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
                          sx={{ width: 230 }}
                          error={!!errors.itiKey}
                        >
                          <InputLabel required error={!!errors.itiKey}>
                            {labels.selectIti}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="itiKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.itiKey}
                              >
                                {itiKeys &&
                                  itiKeys.map((iti) => (
                                    <MenuItem key={iti.id} value={iti.id}>
                                      {iti?.itiName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.itiKey ? labels.itiNameReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* tradeName */}
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
                          id="standard-basic"
                          variant="standard"
                          // required
                          sx={{ width: 220 }}
                          label={`${labels.tradeName} *`}
                          {...register("tradeName")}
                          error={!!errors.tradeName}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("tradeName") ? true : false,
                          }}
                          helperText={
                            errors?.tradeName ? labels.itiTradeReq : null
                          }
                        />
                      </Grid>
                      {/* tradeDuration */}
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
                          id="standard-basic"
                          variant="standard"
                          sx={{ width: 220 }}
                          // required
                          label={`${labels.tradeDuration} *`}
                          {...register("tradeDuration")}
                          error={!!errors.tradeDuration}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("tradeDuration") ? true : false,
                          }}
                          helperText={
                            errors?.tradeDuration
                              ? labels.tradeDurationReq
                              : null
                          }
                        />
                      </Grid>
                      {/* tradeUnit */}
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
                          id="standard-basic"
                          variant="standard"
                          // required
                          sx={{ width: 220 }}
                          label={`${labels.tradeUnit} *`}
                          {...register("tradeUnit")}
                          error={!!errors.tradeUnit}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("tradeUnit") ? true : false,
                          }}
                          helperText={
                            errors?.tradeUnit ? labels.tradeUnitReq : null
                          }
                        />
                      </Grid>
                      {/* tradeAffiliationNo */}
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
                          id="standard-basic"
                          variant="standard"
                          // required
                          sx={{ width: 220 }}
                          label={`${labels.tradeAffiliationNo} *`}
                          {...register("tradeAffiliationNo")}
                          error={!!errors.tradeAffiliationNo}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("tradeAffiliationNo") ? true : false,
                          }}
                          helperText={
                            errors?.tradeAffiliationNo
                              ? labels.tradeAffiliationNoReq
                              : null
                          }
                        />
                      </Grid>
                      {/* tradeType */}
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
                          sx={{ width: 230 }}
                          error={!!errors.tradeType}
                        >
                          <InputLabel required error={!!errors.tradeType}>
                            {labels.tradeType}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="tradeType"
                            // rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.tradeType}
                              >
                                {tradeTypes &&
                                  tradeTypes.map((trd) => (
                                    <MenuItem key={trd.id} value={trd.value}>
                                      {trd?.value}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.tradeType ? labels.tradeTypeReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* tradeDescription */}
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
                          id="standard-basic"
                          variant="standard"
                          // required
                          sx={{ width: 220 }}
                          label={`${labels.tradeDesc} *`}
                          {...register("tradeDescription")}
                          error={!!errors.tradeDescription}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("tradeDescription") ? true : false,
                          }}
                          helperText={
                            errors?.tradeDescription
                              ? labels.tradeDescriptionReq
                              : null
                          }
                        />
                      </Grid>
                      {/* intake */}
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
                          id="standard-basic"
                          variant="standard"
                          // required
                          sx={{ width: 220 }}
                          label={`${labels.intakeCapacity} *`}
                          {...register("intake")}
                          error={!!errors.intake}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("intake") ? true : false,
                          }}
                          helperText={errors?.intake ? labels.intakeReq : null}
                        />
                      </Grid>
                      {/* remark */}
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
                          id="standard-basic"
                          sx={{ width: 220 }}
                          variant="standard"
                          label={labels?.remark}
                          {...register("remark")}
                          error={!!errors.remark}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("remark") ? true : false,
                          }}
                          helperText={
                            errors?.remark ? errors.remark.message : null
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
                            // sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {labels.save}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            // sx={{ marginRight: 8 }}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {labels.clear}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {labels.exit}
                          </Button>
                        </Grid>
                      </Grid>
                      {/* </div> */}
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>
          </Box>
        </Box>

        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            // type='primary'
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
              setShowTable(false);
            }}
          >
            {labels.add}
          </Button>
        </div>

        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              {showTable && (
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
                    getItiTradeMaster(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getItiTradeMaster(_data, data.page);
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
