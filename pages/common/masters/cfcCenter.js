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
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
// import styles from "../../../styles/[cfcCenter].module.css";
// import styles from '../../../styles/[cfcCenter].module.css'
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../containers/Layout/components/Loader";
import moment from "moment";
import { toast } from "react-toastify";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import schema from "../../../containers/schema/common/CfcCenter";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zones, setZones] = useState([]);
  const [wards, setWards] = useState([]);

  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
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

  useEffect(() => {
    getZone();
  }, []);

  useEffect(() => {
    getWard();
  }, []);

  useEffect(() => {
    getCfcCenterMaster();
  }, [zones, wards]);

  const getZone = () => {
    axios
      .get(`${urls.BaseURL}/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        // setZones(
        //   r.data.zone.map((row) => ({
        //     id: row.id,
        //     zone: row.zone,
        //   })),
        // );
        setZones(r.data.zone);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getWard = () => {
    axios
      .get(`${urls.BaseURL}/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        // setWards(
        //   r.data.ward.map((row) => ({
        //     id: row.id,
        //     ward: row.ward,
        //   })),
        // );
        setWards(r.data.ward);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // Get Table - Data
  const getCfcCenterMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getAll`, {
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
      .then((res) => {
        let result = res.data.cfcCenters;
        let _res = result.map((r, i) => ({
          id: r.id,
          srNo: Number(_pageNo + "0") + i + 1,
          fromDate: r.fromDate,
          toDate: r.toDate,
          zoneId: r.zoneId,
          wardId: r.wardId,
          zoneName: zones.find?.((zone) => r.zoneId == zone.id)?.zoneName,
          wardName: wards.find?.((ward) => ward.id == r.wardId)?.wardName,
          cfcName: r.cfcName,
          cfcOwnerName: r.cfcOwnerName,
          cfcAddress: r.cfcAddress,
          cfcGisID: r.cfcGisID,
          cfcGstinNo: r.cfcGstinNo,
          cfcOwnerAadharNo: r.cfcOwnerAadharNo,
          cfcOwnerPanNo: r.cfcOwnerPanNo,
          licenseNo: r.licenseNo,
          walletId: r.walletId,
          BankName: r.BankName,
          branchAddress: r.branchAddress,
          accountNumber: r.accountNumber,
          branchNumber: r.branchNumber,
          ifscCode: r.ifscCode,
          microde: r.microde,
          maximumDailyLimitForWalletRechargeRs:
            r.maximumDailyLimitForWalletRechargeRs,
          threshholdBalanceRs: r.threshholdBalanceRs,
          minimumBalanceRs: r.minimumBalanceRs,
          BalanceAvailableRs: r.BalanceAvailableRs,
          // zoneId: zones?.find((obj) => obj?.id === r.zoneId)?.zoneId,
          // wardId: wardIds?.find((obj) => obj?.id === r.wardId)?.wardId,
          activeFlag: r.activeFlag,
        }));

        setLoading(false);
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    setLoading(true);
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/cfcCenters/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Data Saved", res);
        setLoading(false);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getCfcCenterMaster();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: 'Delete?',
  //     text: 'Are you sure you want to delete this Record ? ',
  //     icon: 'warning',
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios
  //       .delete(`${urls.BaseURL}/master/cfcCenters/discard/${value}`)
  //       .then((res) => {
  //         if (res.status == 226) {
  //           if (willDelete) {
  //             swal('Record is Successfully Deleted!', {
  //               icon: 'success',
  //             })
  //           } else {
  //             swal('Record is Safe')
  //           }
  //           getCfcCenterMaster()
  //           setButtonInputState(false)
  //         }
  //       })
  //   })
  // }

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Deactivate?",
  //       text: "Are you sure you want to deactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/cfcCenters/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully Deactivated!", {
  //               icon: "success",
  //             });
  //             getCfcCenterMaster();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/cfcCenters/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });
  //             getCfcCenterMaster();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Deactivate?" : "निष्क्रिय करा?",
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
            .post(`${urls.CFCURL}/master/cfcCenters/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal(
                  language == "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getCfcCenterMaster();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
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
            .post(`${urls.CFCURL}/master/cfcCenters/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal(
                  language == "en"
                    ? "Record is Successfully activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );

                setButtonInputState(false);
                getCfcCenterMaster();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
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
    zoneId: "",
    wardId: "",
    cfcName: "",
    cfcOwnerName: "",
    cfcAddress: "",
    cfcGisID: "",
    cfcGstinNo: "",
    cfcOwnerAadharNo: "",
    cfcOwnerPanNo: "",
    licenseNo: "",
    walletId: "",
    BankName: "",
    accountNumber: "",
    branchNumber: "",
    branchAddress: "",
    ifscCode: "",
    microde: "",
    maximumDailyLimitForWalletRechargeRs: "",
    threshholdBalanceRs: "",
    minimumBalanceRs: "",
    BalanceAvailableRs: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneId: "",
    wardId: "",
    cfcName: "",
    cfcOwnerName: "",
    cfcAddress: "",
    cfcGisID: "",
    cfcGstinNo: "",
    cfcOwnerAadharNo: "",
    cfcOwnerPanNo: "",
    licenseNo: "",
    walletId: "",
    BankName: "",
    accountNumber: "",
    branchNumber: "",
    branchAddress: "",
    ifscCode: "",
    microde: "",
    maximumDailyLimitForWalletRechargeRs: "",
    threshholdBalanceRs: "",
    minimumBalanceRs: "",
    BalanceAvailableRs: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "zoneName",
      headerName: <FormattedLabel id="zone" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "wardName",
      headerName: <FormattedLabel id="ward" />,
      headerAlign: "center",
      flex: 1,
    },
    // {
    //   field: "cfcGisID",
    //   headerName: "cfc Gis ID",
    // headerAlign:'center',
    //   flex: 1,
    // },
    // {
    //   field: "cfcGstinNo",
    //   headerName: "cfcGstinNo",
    // headerAlign:'center',
    //   flex: 1,
    // },
    {
      field: "cfcName",
      headerName: <FormattedLabel id="cfcName" />,
      headerAlign: "center",
      flex: 2,
    },
    {
      field: "cfcOwnerName",
      headerName: <FormattedLabel id="cfcOwnerName" />,
      headerAlign: "center",

      flex: 2,
    },
    {
      field: "cfcAddress",
      headerName: <FormattedLabel id="cfcAddress" />,
      headerAlign: "center",

      flex: 2,
    },
    // {
    //   field: "cfcOwnerAadharNo",
    //   headerName: "cfcOwnerAadharNo",
    // headerAlign:'center',
    //   flex: 1,
    // },
    // {
    //   field: "cfcOwnerPanNo",
    //   headerName: "cfcOwnerPanNo",
    // headerAlign:'center',
    //   flex: 1,
    // },
    {
      field: "licenseNo",
      headerName: <FormattedLabel id="licenceNo" />,
      headerAlign: "center",
      flex: 1,
    },
    // {
    //   field: "walletId",
    //   headerName: <FormattedLabel id="walletId" />,
    // headerAlign:'center',
    //   flex: 1,
    // },
    {
      field: "BankName",
      headerName: "BankName",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "accountNumber",
      headerName: <FormattedLabel id="accountNo" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "branchNumber",
      headerName: <FormattedLabel id="branchNo" />,
      headerAlign: "center",
      flex: 1,
    },
    // {
    //   field: "ifscCode",
    //   headerName: "ifscCode",
    // headerAlign:'center',
    //   flex: 1,
    // },
    // {
    //   field: "microde",
    //   headerName: "microde",
    // headerAlign:'center',
    //   flex: 1,
    // },
    {
      field: "branchAddress",
      headerName: <FormattedLabel id="branchAddress" />,
      headerAlign: "center",
      // type: "number",
      flex: 1,
    },

    // {
    //   field: "maximumDailyLimitForWalletRechargeRs",
    //   headerName: "MLFWRR",
    // headerAlign:'center',
    //   // type: "number",
    //   flex: 1,
    // },
    // {
    //   field: "threshholdBalanceRs",
    //   headerName: "threshholdBalanceRs",
    // headerAlign:'center',
    //   // type: "number",
    //   flex: 1,
    // },

    // {
    //   field: "minimumBalanceRs",
    //   headerName: "minimumBalanceRs",
    // headerAlign:'center',
    //   // type: "number",
    //   flex: 1,
    // },

    {
      field: "BalanceAvailableRs",
      headerName: "Balance Available(Rs)",
      headerAlign: "center",
      // type: "number",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      flex: 1,
      headerAlign: "center",
      align: "center",
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

  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="cfcCenter" />
      </div>
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
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={6}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            style={{ width: "90%" }}
                            error={!!errors.fromDate}
                          >
                            <Controller
                              control={control}
                              name="fromDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="fromDate" />
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
                              {errors?.fromDate
                                ? errors.fromDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid
                          xs={6}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            style={{ width: "90%" }}
                            error={!!errors.toDate}
                          >
                            <Controller
                              control={control}
                              name="toDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="toDate" />
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
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="outlined-basic"
                            size="small"
                            label={<FormattedLabel id="cfcName" />}
                            variant="outlined"
                            {...register("cfcName")}
                            error={!!errors.cfcName}
                            helperText={
                              errors?.cfcName ? errors.cfcName.message : null
                            }
                          />
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
                          <TextField
                            sx={{ width: "90%" }}
                            id="outlined-basic"
                            label={<FormattedLabel id="cfcOwnerName" />}
                            variant="outlined"
                            size="small"
                            {...register("cfcOwnerName")}
                            error={!!errors.cfcOwnerName}
                            helperText={
                              errors?.cfcOwnerName
                                ? errors.cfcOwnerName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="outlined-basic"
                            label={<FormattedLabel id="cfcAddress" />}
                            variant="outlined"
                            size="small"
                            {...register("cfcAddress")}
                            error={!!errors.cfcAddress}
                            helperText={
                              errors?.cfcAddress
                                ? errors.cfcAddress.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={4}
                          item
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
                            error={!!errors.zoneId}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              <FormattedLabel id="zone" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="zone" />}
                                >
                                  {zones &&
                                    zones.map((zone, index) => {
                                      return (
                                        <MenuItem key={index} value={zone.id}>
                                          {language == "en"
                                            ? zone.zoneName
                                            : zone.zoneNameMr}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="zoneId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.zoneId ? errors.zoneId.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          xs={4}
                          item
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
                            error={!!errors.wardId}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              <FormattedLabel id="ward" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="ward" />}
                                >
                                  {wards &&
                                    wards.map((ward, index) => {
                                      return (
                                        <MenuItem key={index} value={ward.id}>
                                          {language == "en"
                                            ? ward.wardName
                                            : ward.wardNameMr}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="wardId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.wardId ? errors.wardId.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="cfcGisId" />}
                            variant="outlined"
                            {...register("cfcGisID")}
                            error={!!errors.cfcGisID}
                            helperText={
                              errors?.cfcGisID ? errors.cfcGisID.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="cfcGstInNo" />}
                            variant="outlined"
                            placeholder="27DKKPS2852A1ZM"
                            {...register("cfcGstinNo")}
                            error={!!errors.cfcGstinNo}
                            helperText={
                              errors?.cfcGstinNo
                                ? errors.cfcGstinNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="cfcOwnerAadharNo" />}
                            variant="outlined"
                            placeholder="123456789012"
                            inputProps={{ maxLength: 12 }}
                            {...register("cfcOwnerAadharNo")}
                            error={!!errors.cfcOwnerAadharNo}
                            helperText={
                              errors?.cfcOwnerAadharNo
                                ? errors.cfcOwnerAadharNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="cfcOwnerPanNo" />}
                            variant="outlined"
                            placeholder="ABCDE1234F"
                            {...register("cfcOwnerPanNo")}
                            error={!!errors.cfcOwnerPanNo}
                            helperText={
                              errors?.cfcOwnerPanNo
                                ? errors.cfcOwnerPanNo.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="licenceNo" />}
                            variant="outlined"
                            {...register("licenseNo")}
                            error={!!errors.licenseNo}
                            helperText={
                              errors?.licenseNo
                                ? errors.licenseNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="walletId" />}
                            variant="outlined"
                            {...register("walletId")}
                            error={!!errors.walletId}
                            helperText={
                              errors?.walletId ? errors.walletId.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="bankName" />}
                            variant="outlined"
                            {...register("BankName")}
                            error={!!errors.BankName}
                            helperText={
                              errors?.BankName ? errors.BankName.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="accountNo" />}
                            variant="outlined"
                            {...register("accountNumber")}
                            error={!!errors.accountNumber}
                            helperText={
                              errors?.accountNumber
                                ? errors.accountNumber.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="branchNo" />}
                            variant="outlined"
                            {...register("branchNumber")}
                            error={!!errors.branchNumber}
                            helperText={
                              errors?.branchNumber
                                ? errors.branchNumber.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="branchAddress" />}
                            variant="outlined"
                            {...register("branchAddress")}
                            error={!!errors.branchAddress}
                            helperText={
                              errors?.branchAddress
                                ? errors.branchAddress.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="ifscCode" />}
                            variant="outlined"
                            placeholder="SBIN0005943"
                            {...register("ifscCode")}
                            error={!!errors.ifscCode}
                            helperText={
                              errors?.ifscCode ? errors.ifscCode.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="micrCode" />}
                            variant="outlined"
                            inputProps={{ maxLength: 9 }}
                            placeholder="123456789"
                            {...register("microde")}
                            error={!!errors.microde}
                            helperText={
                              errors?.microde ? errors.microde.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={
                              <FormattedLabel id="maximumDailyLimitForWalletRecharge" />
                            }
                            variant="outlined"
                            {...register(
                              "maximumDailyLimitForWalletRechargeRs"
                            )}
                            error={
                              !!errors.maximumDailyLimitForWalletRechargeRs
                            }
                            helperText={
                              errors?.maximumDailyLimitForWalletRechargeRs
                                ? errors.maximumDailyLimitForWalletRechargeRs
                                    .message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="outlined-basic"
                            size="small"
                            label={<FormattedLabel id="thresholdBalance" />}
                            variant="outlined"
                            {...register("threshholdBalanceRs")}
                            error={!!errors.threshholdBalanceRs}
                            helperText={
                              errors?.threshholdBalanceRs
                                ? errors.threshholdBalanceRs.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="minimumBalance" />}
                            variant="outlined"
                            {...register("minimumBalanceRs")}
                            error={!!errors.minimumBalanceRs}
                            helperText={
                              errors?.minimumBalanceRs
                                ? errors.minimumBalanceRs.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="balanceAvailable" />}
                            variant="outlined"
                            {...register("BalanceAvailableRs")}
                            error={!!errors.BalanceAvailableRs}
                            helperText={
                              errors?.BalanceAvailableRs
                                ? errors.BalanceAvailableRs.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>

                      {/* <div className={styles.buttons}> */}
                      <Grid
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Button
                          sx={{}}
                          type="submit"
                          variant="contained"
                          color="success"
                          size="small"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                          {/* <FormattedLabel id="Save" /> */}
                        </Button>{" "}
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}
          {/* <div className={styles.addbtn}> */}
          <Grid
            container
            sx={{ display: "flex", justifyContent: "end", padding: "10px" }}
          >
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              size="small"
              type="primary"
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
          </Grid>

          {/* 
        <DataGrid
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
          autoHeight={true}
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
            getCfcCenterMaster(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getCfcCenterMaster(_data, data.page);
          }}
        /> */}

          <Box style={{ overflowX: "scroll", display: "flex" }}>
            <DataGrid
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => row.srNo}
              components={{ Toolbar: GridToolbar }}
              sx={{
                backgroundColor: "white",
                // overflowY: "scroll",

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
              autoHeight={true}
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
                getCfcCenterMaster(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                // updateData("page", 1);
                getCfcCenterMaster(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Index;
