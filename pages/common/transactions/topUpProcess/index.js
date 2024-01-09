import {
  Box,
  Button,
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
import urls from "../../../../URLS/urls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/common/topUpProcess";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import HomeIcon from "@mui/icons-material/Home";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import styles from "../../../../styles/[topUpProcess].module.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import { useRouter } from "next/router";
import { setTopupData } from "../../../../features/userSlice";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const TopUpProcess = () => {
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

  const [loading, setLoading] = useState(false);
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
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [cfcCenters, setCfcCenters] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  // const language = useSelector((state) => state?.lables.language);
  const language = useSelector((state) => state?.labels.language);
  const topupData = useSelector((state) => {
    console.log("topupDatabb", state?.user?.topupData);
    return state?.user?.topupData;
  });
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

  useEffect(() => {
    let data =
      router?.query?.cfcDetails && JSON.parse(router?.query?.cfcDetails);
    console.log("router.query", router.query, data);

    if (router.query.pageMode == "Edit") {
      setSlideChecked(true);
      setIsOpenCollapse(true);
      setValue("cfcName", data?.cfcId);
    }
    if (router?.query?.order_status == "Success") {
    }
  }, []);

  useEffect(() => {
    getTopUpProcess();
  }, [cfcCenters]);

  useEffect(() => {
    // getPaymentMode();
    getPaymentTypes();
  }, []);

  useEffect(() => {
    getCfcCenter();
  }, []);

  const getTopUpProcess = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/trasaction/topUpProcess/getAll`, {
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
        console.log(";res", res);

        let result = res.data.topUpProcess;
        setDataSource(
          result?.map((res, i) => {
            return {
              activeFlag: res.activeFlag,
              cfcId: res.cfcId,
              srNo: i + 1,
              cfcName: res.cfcName,
              cfcNamee: cfcCenters?.find((obj) => obj?.cfcId == res.cfcId)
                ?.cfcName,
              id: res.id,
              // fromDate: moment(res.fromDate).format("llll"),
              // toDate: moment(res.toDate).format("llll"),
              cfcNameMr: res.cfcNameMr,
              rechargeAmount: res.rechargeAmount,
              paymentMode: res.paymentMode,
              status: res.status,
              cfcUserRemark: res.cfcUserRemark,
              paymentMode: res.paymentMode,
              paymentModeName: paymentModes?.find(
                (obj) => obj?.id === res.paymentMode
              )?.paymentMode,
              status: res.activeFlag === "Y" ? "Active" : "InActive",
            };
          })
        );

        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
        setLoading(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getPaymentMode = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentMode/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPaymentModes(
          res.data.paymentMode.map((r, i) => ({
            id: r.id,
            paymentMode: r.paymentMode,
            paymentModeMr: r.paymentModeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setPaymentTypes(
          r.data.paymentType.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
            paymentTypeMr: row.paymentTypeMr,
          }))
        );
        setValue("paymentType", 2);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getCfcCenter = () => {
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCfcCenters(
          res.data.cfcCenters.map((r, i) => ({
            ...r,
            id: r.id,
            cfcName: r.cfcName,
            cfcNameMr: r.cfcNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/trasaction/topUpProcess/save`, body, {
              headers: {
                role: "CFC_USER",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getTopUpProcess();
                // getPaymentMode();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
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
            .post(`${urls.CFCURL}/trasaction/topUpProcess/save`, body, {
              headers: {
                role: "CFC_USER",

                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getTopUpProcess();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
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

  const getToPaymentGateway = (payDetail) => {
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
      </form>`;
    document.getElementById("dynForm").submit();
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      cfcId: Number(formData?.cfcName),
      cfcName: cfcCenters?.find((obj) => obj?.cfcId == formData?.cfcName)
        ?.cfcName,
      id: cfcCenters?.find((obj) => obj?.cfcId == formData?.cfcName)?.id,
      // cfcName: cfcCenters?.find((obj) => obj?.cfcId == formData?.cfcName)?.id,
      rechargeAmount: Number(formData?.rechargeAmount),
    };

    // dispatch(setTopupData(finalBodyForApi));
    let ccAvenueKitLtp = null;
    switch (location.hostname) {
      case "localhost":
        ccAvenueKitLtp = "L";
        break;
      case "noncoredev.pcmcindia.gov.in":
        ccAvenueKitLtp = "T";
        break;
      case "noncoreuat.pcmcindia.gov.in":
        ccAvenueKitLtp = "T";
        break;
      default:
        ccAvenueKitLtp = "L";
        break;
    }

    let testBody = {
      currency: "INR",
      language: "EN",
      moduleId: "CFC",
      amount: formData?.rechargeAmount,
      ccAvenueKitLtp: ccAvenueKitLtp,
      divertPageLink: "/common/transactions/pgSuccess",
      loiNo: 0,
      serviceId: 0,
      applicationNo: String(formData?.cfcName),
      loiId: 0,
      cfcId: Number(formData?.cfcName),
      userRemark: formData?.cfcUserRemark,
    };

    let testBodyCC = {
      currency: "INR",
      language: "EN",
      moduleId: "CFC",
      amount: formData?.rechargeAmount,
      ccAvenueKitLtp: ccAvenueKitLtp,
      divertPageLink: "/common/transactions/pgSuccess",
      loiId: 0,
      loiNo: 0,
      serviceId: 0,
      applicationNo: Number(formData?.cfcName),
      applicationId: Number(formData?.cfcName),
      // cfcId: Number(formData?.cfcName),
      // userRemark: formData?.cfcUserRemark,
      domain: window.location.hostname,
    };

    axios
      .post(
        `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
        testBodyCC,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("RES", res);
        if (res.status == 200 || res.status == 201) {
          let tempBody = {
            encRequest: res.data.encRequest,
            access_code: res.data.access_code,
          };

          getToPaymentGateway(res.data);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });

    console.log("finalBodyForApi33", finalBodyForApi, testBodyCC);

    // axios
    //   .post(`${urls.CFCURL}/trasaction/topUpProcess/save`, finalBodyForApi, {
    //     headers: {
    //       role: "CFC_USER",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     console.log("save data", res);
    //     if (res.status == 200) {
    //       formData.id
    //         ? sweetAlert("Updated!", "Record Updated successfully !", "success")
    //         : sweetAlert("Saved!", "Record Saved successfully !", "success");
    //       getTopUpProcess();
    //       setButtonInputState(false);
    //       setIsOpenCollapse(false);
    //       setEditButtonInputState(false);
    //       setDeleteButtonState(false);
    //     }
    //   });
  };

  const resetValuesExit = {
    // fromDate: null,
    // toDate: null,
    // cfcId: "",
    cfcName: null,
    // cfcNameMr: "",
    rechargeAmount: "",
    paymentMode: null,
    status: "",
    cfcUserRemark: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const resetValuesCancell = {
    // fromDate: null,
    // toDate: null,
    // cfcId: "",
    cfcName: null,
    // cfcNameMr: "",
    rechargeAmount: "",
    paymentMode: null,
    status: "",
    cfcUserRemark: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.2,
      headerAlign: "center",
    },
    // {
    //   field: "fromDate",
    //   headerName: <FormattedLabel id="fromDate" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 250,
    // },
    // {
    //   field: "toDate",
    //   headerName: <FormattedLabel id="toDate" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 250,
    // },
    // {
    //   field: "cfcId",
    //   headerName: <FormattedLabel id="cfcId" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 100,
    // },
    {
      field: "cfcNamee",
      headerName: <FormattedLabel id="cfcName" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "cfcNameMr",
    //   headerName: <FormattedLabel id="cfcNameMr" />,
    //   flex: 1,
    //   minWidth: 100,
    // },
    {
      field: "rechargeAmount",
      headerName: <FormattedLabel id="rechargeAmount" />,
      flex: 0.4,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "paymentModeName",
      headerName: <FormattedLabel id="paymentMode" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "cfcUserRemark",
      headerName: <FormattedLabel id="cfcUserRemark" />,
      flex: 0.8,
      headerAlign: "center",
    },
    // {
    //   field: "actions",
    //   headerName: <FormattedLabel id="actions" />,
    //   headerAlign: "center",
    //   flex: 0.4,
    //   align: "center",
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             setButtonInputState(true);
    //             console.log("params.row: ", params.row);
    //             reset(params.row);
    //           }}
    //         >
    //           <Tooltip title="Edit">
    //             <EditIcon style={{ color: "#556CD6" }} />
    //           </Tooltip>
    //         </IconButton>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setID(params.row.id),
    //               //   setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             setButtonInputState(true);
    //             console.log("params.row: ", params.row);
    //             reset(params.row);
    //           }}
    //         >
    //           {params.row.activeFlag == "Y" ? (
    //             <Tooltip title="Deactivate">
    //               <ToggleOnIcon
    //                 style={{ color: "green", fontSize: 30 }}
    //                 onClick={() => deleteById(params.id, "N")}
    //               />
    //             </Tooltip>
    //           ) : (
    //             <Tooltip title="Activate">
    //               <ToggleOffIcon
    //                 style={{ color: "red", fontSize: 30 }}
    //                 onClick={() => deleteById(params.id, "Y")}
    //               />
    //             </Tooltip>
    //           )}
    //         </IconButton>
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <div>
      <Grid
        container
        sx={{
          backgroundColor: "#3F6FD2",
          color: "white",
          borderRadius: "30px",
          padding: "5px",
        }}
      >
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title="Go to CFC Dashboard">
            <IconButton
              color="inherit"
              aria-label="menu"
              sx={
                {
                  // border: "solid red",
                }
              }
              onClick={() => {
                router.push("../../CFC_Dashboard");
              }}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={11}
          sx={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "35%",
            fontSize: "25px",
          }}
        >
          <FormattedLabel id="topUpProcess" />
        </Grid>
      </Grid>
      {/* <Box className={styles.tableHead} sx={{ display: "flex" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            mr: 2,
            paddingLeft: "30px",
            color: "white",
            border: "solid red",
          }}
          onClick={() => {}}
        >
          <HomeIcon />
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            border: "solid green",
            mr: 2,
            paddingLeft: "30px",
            color: "white",
          }}
          onClick={() => exitBack()}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box className={styles.h1Tag}>
          <FormattedLabel id="topUpProcess" />
        </Box>
      </Box> */}
      {loading ? (
        <Loader />
      ) : (
        <Paper>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    xs={12}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ width: "90%" }}
                      error={!!errors.cfcName}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="cfcName" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={router?.query?.pageMode == "Edit"}
                            value={field.value}
                            variant="outlined"
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="cfcName" />}
                          >
                            {cfcCenters &&
                              cfcCenters.map((cfcName, index) => {
                                return (
                                  <MenuItem key={index} value={cfcName.cfcId}>
                                    {language == "en"
                                      ? cfcName?.cfcName
                                      : cfcName?.cfcNameMr}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        )}
                        name="cfcName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.cfcName ? errors.cfcName.message : null}
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
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ width: "90%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="rechargeAmount" />}
                      variant="outlined"
                      {...register("rechargeAmount")}
                      error={!!errors.rechargeAmount}
                      helperText={
                        errors?.rechargeAmount
                          ? errors.rechargeAmount.message
                          : null
                      }
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
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ width: "90%" }}
                      disabled
                      error={!!errors.paymentType}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        {<FormattedLabel id="paymentType" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="paymentType" />}
                            id="demo-simple-select-outlined"
                            labelId="id='demo-simple-select-outlined-label'"
                          >
                            {paymentTypes &&
                              paymentTypes.map((paymentType, index) => {
                                return (
                                  <MenuItem key={index} value={paymentType?.id}>
                                    {paymentType?.paymentType}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        )}
                        name="paymentType"
                        control={control}
                        defaultValue={2}
                      />
                    </FormControl>
                  </Grid>
                  {/* <Grid
                    Payment
                    Mode
                    xs={12}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ width: "90%" }}
                      error={!!errors.paymentMode}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="paymentMode" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            variant="outlined"
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="paymentMode" />}
                          >
                            {paymentModes &&
                              paymentModes.map((paymentMode, index) => {
                                return (
                                  <MenuItem key={index} value={paymentMode.id}>
                                    {paymentMode.paymentMode}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        )}
                        name="paymentMode"
                        control={control}
                        defaultValue={1}
                      />
                      <FormHelperText>
                        {errors?.paymentMode
                          ? errors.paymentMode.message
                          : null}
                      </FormHelperText>
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
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="cfcNameMr" />}
                    variant="standard"
                    {...register("cfcNameMr")}
                    error={!!errors.cfcNameMr}
                    helperText={
                      errors?.cfcNameMr ? errors.cfcNameMr.message : null
                    }
                  />
                </Grid> */}
                </Grid>
                {/* <Grid container style={{ padding: "10px" }}> */}
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
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="fromDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
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
                    <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText>
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
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="toDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
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
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                {/* </Grid> */}
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
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      style={{ backgroundColor: "white", width: "90%" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="cfcUserRemark" />}
                      variant="outlined"
                      {...register("cfcUserRemark")}
                      error={!!errors.cfcUserRemark}
                      helperText={
                        errors?.cfcUserRemark
                          ? errors.cfcUserRemark.message
                          : null
                      }
                    />
                  </Grid>
                  {/* <Grid
                    item
                    xs={12}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      style={{ backgroundColor: "white", width: "90%" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="clerkRemark" />}
                      variant="outlined"
                      {...register("clerkRemark")}
                      error={!!errors.clerkRemark}
                      helperText={
                        errors?.clerkRemark ? errors.clerkRemark.message : null
                      }
                    />
                  </Grid> */}
                </Grid>
                <Grid container style={{ padding: "10px" }}>
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
                      type="submit"
                      size="small"
                      variant="contained"
                      color="success"
                      endIcon={<CurrencyRupeeIcon />}
                    >
                      {<FormattedLabel id="topup" />}
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
                      variant="contained"
                      size="small"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
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
                      variant="contained"
                      size="small"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
                <Divider />
              </form>
            </Slide>
          )}

          <Grid
            container
            style={{ padding: "10px", display: "flex", justifyContent: "end" }}
          >
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              size="small"
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
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
          <DataGrid
            autoHeight
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
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            rows={dataSource}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              getTopUpProcess(newPageSize);
              setPageSize(newPageSize);
            }}
            onPageChange={(e) => {
              console.log("event", e);
              getTopUpProcess(pageSize, e);
              console.log("dataSource->", dataSource);
            }}
            // {...dataSource}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            rowCount={totalElements}
            //checkboxSelection
          />
        </Paper>
      )}
    </div>
  );
};

export default TopUpProcess;
