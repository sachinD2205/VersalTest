import {
  Box,
  Button,
  // @ts-ignore
  Checkbox,
  Divider,
  FormControl,
  // @ts-ignore
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  // @ts-ignore
  List,
  // @ts-ignore
  ListItem,
  // @ts-ignore
  ListItemIcon,
  // @ts-ignore
  ListItemText,
  Paper,
  // @ts-ignore
  Radio,
  // @ts-ignore
  RadioGroup,
  Select,
  Slide,
  TextField,
  ThemeProvider,
  MenuItem,
  // @ts-ignore
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Schema from "../../../containers/schema/propertyTax/masters/circleGatMappingMaster";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
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
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onSubmit",
  });

  const userToken = useGetToken();

  const [buttonInputState, setButtonInputState] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  // @ts-ignore
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  // @ts-ignore
  const [circleNo, setcircleNo] = useState([]);
  const [circleName, setCircleName] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  // @ts-ignore
  const [plotNo, setPlotNo] = useState(false);
  // @ts-ignore
  const [serveyNo, setServeyNo] = useState(false);
  // @ts-ignore
  const [sectorNo, setSectorNo] = useState(false);
  // @ts-ignore
  const [blockNo, setBlockNo] = useState(false);
  // @ts-ignore
  const [cTSNo, setCTSNo] = useState(false);

  // @ts-ignore
  const [gatName, setGatName] = useState([
    { id: 1, gatNo: 1, gatNameEn: "Gat 1", gatNameMr: "Gat 1" },
  ]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // @ts-ignore
  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    getCircleGatMapping();
  }, [pincodes, circleNo, circleName]);

  const getCircleGatMapping = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PTAXURL}/master/circleGatMapping/getAll`, {
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

        let result = res.data?.circleGat;
        let _res = result.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1,
            // billPrefix: val.billPrefix,
            // billType: val.billType,
            id: val.id,
            fromDate: moment(val.fromDate).format("YYYY-MM-DD"),
            toDate: val.toDate,
            remark: val.remark,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",

            circleGatMappingPrefix: val.circleGatMappingPrefix,
            circleNo: val.circleNo,
            // @ts-ignore
            circleNo1:
              // @ts-ignore
              circleNo?.find((obj) => obj.id === val.circleNo)?.circleNo,
            circleName: val.circleName,
            // @ts-ignore
            circleName1:
              // @ts-ignore
              circleName?.find((obj) => obj.id === val.circleName)?.circleName,
            circleGat: val.circleGat,
            gatNo: val.gatNo,
            gatName: val.gatName,
            address: val.address,
            pincode: val.pincode,
            // @ts-ignore
            pinCodeName:
              // @ts-ignore
              pincodes?.find((obj) => obj.id === val.pincode)?.pincode,
            // locality: val.locality,
            serveyNo: val.serveyNo,
            plotNo: val.plotNo,
            blockNo: val.blockNo,
            cTSNo: val.cTSNo,
            sectorNo: val.sectorNo,

            rate: val.rate,
            employeeDetails: val.employeeDetails,
            gisId: val.gisId,
            zoneType: val.zoneType,
          };
        });
        console.log("Gett All", _res);

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

  // Extra Requests
  // @ts-ignore
  const gettingLocality = () => {
    axios
      .get(`${urls.PTAXURL}/master/locality/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        // @ts-ignore
        setLocality(
          // @ts-ignore
          res.data?.circleGat.map((r, i) => ({
            id: r.id,
            landmark: r.landmark,
            landmarkMr: r.landmarkMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  //CircleName
  const gettingCircleName = () => {
    axios
      .get(`${urls.PTAXURL}/master/circle/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setCircleName(
          // @ts-ignore
          res.data?.circle.map((r, i) => ({
            id: r.id,
            circleNo: r.circleNo,
            circleName: r.circleName,
            circleNameMr: r.circleNameMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };
  // Pincode
  const gettingPincode = () => {
    axios
      .get(`${urls.PTAXURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("gettingPincode", res.data.pinCode);
        setPincodes(
          // @ts-ignore
          res.data?.pinCode?.map((r, i) => ({
            id: r.id,
            pincode: r.pinCode,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  useEffect(() => {
    gettingCircleName();
    gettingPincode();
  }, []);

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      // @ts-ignore
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
            .post(`${urls.PTAXURL}/master/circleGatMapping/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status === 200 || res.status === 201) {
                // @ts-ignore
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getCircleGatMapping();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                // @ts-ignore
                swal(error.response.data.message, {
                  icon: "error",
                });
                getCircleGatMapping();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getCircleGatMapping();
                setButtonInputState(false);
              }
              console.log("error", error);
            });
        } else if (willDelete == null) {
          // @ts-ignore
          swal("Record is Safe");
          setButtonInputState(false);
        }
      });
    } else {
      // @ts-ignore
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
            .post(`${urls.PTAXURL}/master/circleGatMapping/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status === 200 || res.status == 201) {
                // @ts-ignore
                swal("Record is Successfully Recovered!", {
                  icon: "success",
                });
                getCircleGatMapping();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                // @ts-ignore
                swal(error.response.data.message, {
                  icon: "error",
                });
                getCircleGatMapping();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getCircleGatMapping();
                setButtonInputState(false);
              }
              // console.log("error", error);
            });
        } else if (willDelete == null) {
          // @ts-ignore
          swal("Record is Safe");
          setButtonInputState(false);
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    // NUmbers Present In Block
    setServeyNo(false);
    setSectorNo(false);
    setPlotNo(false);
    setCTSNo(false);
    setBlockNo(false);
  };

  const resetValuesCancell = {
    circleGatMappingPrefix: "",
    circleNo: "",
    circleName: "",
    gatNo: "",
    gatName: "",
    address: "",
    pincode: "",
    // locality: "",
    serveyNo: "",
    plotNo: "",
    cTSNo: "",
    blockNo: "",
    sectorNo: "",
    rate: "",
    employeeDetails: "",
    remark: "",
    fromDate: null,
    toDate: null,
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
    // NUmbers Present In Block
    setServeyNo(false);
    setSectorNo(false);
    setPlotNo(false);
    setCTSNo(false);
    setBlockNo(false);
  };

  const onSubmitForm = (formData) => {
    // console.log("formData", formData);
    // alert("Clicked");
    console.log("110", formData);
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const circleNo = parseInt(formData.circleNo);
    const circleName = parseInt(formData.circleName);
    const pincode = parseInt(formData.pincode);
    // const rate = parseInt(formData.rate).toFixed(2);

    const rate = Number(parseFloat(formData.rate).toFixed(2));

    const finalBodyForApi = {
      ...formData,
      circleNo,
      circleName,
      pincode,
      rate,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PTAXURL}/master/circleGatMapping/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status === 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getCircleGatMapping();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        if (error.request.status === 500) {
          // @ts-ignore
          swal(error.response.data.message, {
            icon: "error",
          });
          getCircleGatMapping();
          setButtonInputState(false);
        } else {
          // @ts-ignore
          swal("Something went wrong!", {
            icon: "error",
          });
          getCircleGatMapping();
          setButtonInputState(false);
        }
        // console.log("error", error);
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  const resetValuesExit = {
    circleGatMappingPrefix: "",
    circleNo: "",
    circleName: "",
    gatNo: "",
    gatName: "",
    address: "",
    pincode: "",
    // locality: "",
    serveyNo: "",
    plotNo: "",
    cTSNo: "",
    blockNo: "",
    sectorNo: "",
    rate: "",
    employeeDetails: "",
    remark: "",
    fromDate: null,
    toDate: null,
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // flex: 1,
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      // field: 'circleNo1',
      field: "circleNo",
      headerName: <FormattedLabel id="zoneNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "circleName1",
      headerName: <FormattedLabel id="zoneName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: 'pinCodeName',
    //   headerName: <FormattedLabel id='pincode' />,

    //   flex: 1,
    //   align: 'center',
    //   headerAlign: 'center',
    // },
    // {
    //   field: 'address',
    //   headerName: <FormattedLabel id='address' />,
    //   flex: 1,
    //   align: 'center',
    //   headerAlign: 'center',
    // },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      flex: 1,
      //   minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
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
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                {
                  params.row.serveyNo ? setServeyNo(true) : setServeyNo(false);
                }
                {
                  params.row.sectorNo ? setSectorNo(true) : setSectorNo(false);
                }
                {
                  params.row.plotNo ? setPlotNo(true) : setPlotNo(false);
                }
                {
                  params.row.cTSNo ? setCTSNo(true) : setCTSNo(false);
                }
                {
                  params.row.blockNo ? setBlockNo(true) : setBlockNo(false);
                }
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
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

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              height: "auto",
              overflow: "auto",
              padding: "10px 80px",
              // paddingLeft: "20px",
              // paddingRight: "20px",
              // paddingTop: "10px",
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
                {/* <FormattedLabel id='circleGatMappingMaster' /> */}
                <FormattedLabel id="zoneGatMappingMaster" />
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
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }} spacing={2}>
                  <Grid
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
                              // @ts-ignore
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
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
                              // @ts-ignore
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
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

                  {/* >>>>>>>>>>>>>>>>>>>>>>>>>> */}

                  <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                      disabled
                      style={{ backgroundColor: 'white' }}
                      id='outlined-basic'
                      label={<FormattedLabel id='zoneNo' />}
                      variant='standard'
                      {...register('circleNo')}
                      InputLabelProps={{
                        shrink: watch('circleNo') ? true : false,
                      }}
                      error={!!errors.circleNo}
                      helperText={
                        errors?.circleNo ? errors.circleNo.message : null
                      }
                    /> */}

                    <FormControl
                      error={!!errors.circleName}
                      style={{ width: "230px" }}
                    >
                      <InputLabel>{<FormattedLabel id="zoneNo" />}</InputLabel>
                      <Controller
                        control={control}
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            label={<FormattedLabel id="zoneNo" />}
                            onChange={(value) => {
                              setValue(
                                "circleName",
                                circleName.find(
                                  // @ts-ignore
                                  (obj) => obj.id == value.target.value
                                  // @ts-ignore
                                )?.id
                              );
                              field.onChange(value);
                            }}
                            // style={{ height: 40, padding: "14px 14px" }}
                            variant="standard"
                          >
                            {circleName &&
                              circleName.map((circleName, i) => (
                                <MenuItem
                                  key={i}
                                  value={
                                    // @ts-ignore
                                    circleName.id
                                  }
                                >
                                  {
                                    // @ts-ignore
                                    circleName.circleNo
                                  }
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="circleName"
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.circleName ? errors.circleName.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* NEW LINE */}
                <Grid
                  container
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                  spacing={2}
                >
                  <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      error={!!errors.circleName}
                      style={{ width: "230px" }}
                    >
                      <InputLabel>
                        {<FormattedLabel id="zoneName" />}
                      </InputLabel>
                      <Controller
                        control={control}
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            label={<FormattedLabel id="zoneName" />}
                            onChange={(value) => {
                              setValue(
                                "circleNo",
                                circleName.find(
                                  // @ts-ignore
                                  (obj) => obj.id == value.target.value
                                  // @ts-ignore
                                )?.circleNo
                              );
                              field.onChange(value);
                            }}
                            // style={{ height: 40, padding: "14px 14px" }}
                            variant="standard"
                          >
                            {circleName &&
                              circleName.map((circleName, i) => (
                                <MenuItem
                                  key={i}
                                  value={
                                    // @ts-ignore
                                    circleName.id
                                  }
                                >
                                  {
                                    // @ts-ignore
                                    circleName.circleName
                                  }
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="circleName"
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.circleName ? errors.circleName.message : null}
                      </FormHelperText>
                    </FormControl>
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
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="gatNo" />}
                      variant="standard"
                      {...register("gatNo")}
                      InputLabelProps={{
                        shrink: watch("gatNo") ? true : false,
                      }}
                      error={!!errors.gatNo}
                      helperText={errors?.gatNo ? errors.gatNo.message : null}
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
                    <FormControl
                      error={!!errors.gatName}
                      style={{ width: "230px" }}
                    >
                      <InputLabel>{<FormattedLabel id="gatName" />}</InputLabel>
                      <Controller
                        control={control}
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            label={<FormattedLabel id="gatName" />}
                            onChange={(value) => {
                              setValue(
                                "gatNo",
                                // @ts-ignore
                                gatName.find(
                                  (obj) => obj.id == value.target.value
                                ).gatNo
                              );
                              field.onChange(value);
                            }}
                            // style={{ height: 40, padding: "14px 14px" }}
                            variant="standard"
                          >
                            {gatName &&
                              gatName.map((gatName, i) => (
                                <MenuItem key={i} value={gatName.id}>
                                  {gatName.gatNameEn}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="gatName"
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.gatName ? errors.gatName.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                </Grid>

                {/* <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl>
                    <Controller
                      name="serveyNo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            value="serveyNo"
                            control={<Radio />}
                            label="Survey No."
                            error={!!errors.serveyNo}
                            helperText={
                              errors?.serveyNo ? errors.serveyNo.message : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <Controller
                      name="plotNo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            value="plotNo"
                            control={<Radio />}
                            label="Plot No."
                            error={!!errors.plotNo}
                            helperText={
                              errors?.plotNo ? errors.plotNo.message : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <Controller
                      name="blockNo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            value="blockNo"
                            control={<Radio />}
                            label="Block No."
                            error={!!errors.blockNo}
                            helperText={
                              errors?.blockNo ? errors.blockNo.message : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <Controller
                      name="cTSNo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            value="cTSNo"
                            control={<Radio />}
                            label="CTS No."
                            error={!!errors.cTSNo}
                            helperText={
                              errors?.cTSNo ? errors.cTSNo.message : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <Controller
                      name="sectorNo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            value="sectorNo"
                            control={<Radio />}
                            label="Sector No."
                            error={!!errors.sectorNo}
                            helperText={
                              errors?.sectorNo ? errors.sectorNo.message : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid> */}

                {/* <Grid
                  container
                  style={{
                    // padding: "10px",
                    display: 'flex',
                    // justifyContent: "space-evenly",
                    alignItems: 'baseline',
                  }}
                >
                  <Grid item xs={12}> */}
                {/* <List
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        // columnGap: 1,
                      }}
                    > */}
                {/* <div>
                        <ListItem disablePadding>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <Checkbox
                              checked={serveyNo}
                              name="checkboxOptions"
                              onChange={(event) => {
                                setServeyNo(event.target.checked);
                                setValue("serveyNo", "");
                              }}
                              //   selected={field.value}
                              inputProps={{ "aria-label": "primary checkbox" }}
                              // style={{ marginTop: "15px" }}
                            />
                            <TextField
                              //
                              // fullWidth
                              style={{
                                backgroundColor: "white",
                                width: "215px",
                              }}
                              id="outlined-basic"
                              label={<FormattedLabel id="surveyNo" />}
                              variant="standard"
                              {...register("serveyNo")}
                              error={!!errors.serveyNo}
                              helperText={errors?.serveyNo ? errors.serveyNo.message : null}
                              disabled={!serveyNo}
                            />
                          </div>
                        </ListItem>
                      </div> */}

                {/* <div>
                        <ListItem
                          // alignItems="center"
                          disablePadding
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <Checkbox
                              checked={blockNo}
                              name="checkboxOptions"
                              onChange={(event) => {
                                console.log("eve", event.target.checked);
                                setBlockNo(event.target.checked);
                                setValue("blockNo", "");
                              }}
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />
                            <TextField
                              // fullWidth
                              style={{
                                backgroundColor: "white",
                                width: "215px",
                              }}
                              id="outlined-basic"
                              label={<FormattedLabel id="blockNo" />}
                              variant="standard"
                              {...register("blockNo")}
                              error={!!errors.blockNo}
                              helperText={errors?.blockNo ? errors.blockNo.message : null}
                              disabled={!blockNo}
                            />
                          </div>
                        </ListItem>
                      </div> */}

                {/* <div>
                        <ListItem
                          // alignItems="center"

                          disablePadding
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <Checkbox
                              checked={cTSNo}
                              name="checkboxOptions"
                              onChange={(event) => {
                                setCTSNo(event.target.checked);
                                setValue("cTSNo", "");
                              }}
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />
                            <TextField
                              //
                              // fullWidth
                              style={{
                                backgroundColor: "white",
                                width: "215px",
                              }}
                              id="outlined-basic"
                              label={<FormattedLabel id="cTSNo" />}
                              variant="standard"
                              {...register("cTSNo")}
                              error={!!errors.cTSNo}
                              helperText={errors?.cTSNo ? errors.cTSNo.message : null}
                              disabled={!cTSNo}
                            />
                          </div>
                        </ListItem>
                      </div> */}

                {/* <div>
                        <ListItem
                          // alignItems="center"
                          disablePadding
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <Checkbox
                              checked={sectorNo}
                              name="checkboxOptions"
                              onChange={(event) => {
                                setSectorNo(event.target.checked);
                                setValue("sectorNo", "");
                              }}
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />
                            <TextField
                              //
                              // fullWidth
                              style={{
                                backgroundColor: "white",
                                width: "215px",
                              }}
                              id="outlined-basic"
                              label={<FormattedLabel id="sectorNo" />}
                              variant="standard"
                              {...register("sectorNo")}
                              error={!!errors.sectorNo}
                              helperText={errors?.sectorNo ? errors.sectorNo.message : null}
                              disabled={!sectorNo}
                            />
                          </div>
                        </ListItem>
                      </div> */}
                {/* </List>
                  </Grid>
                </Grid> */}

                {/* NEW LINE */}
                <Grid container style={{ padding: "10px" }} spacing={2}>
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
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="plotNo" />}
                      variant="standard"
                      {...register("plotNo")}
                      error={!!errors.plotNo}
                      helperText={errors?.plotNo ? errors.plotNo.message : null}
                      // disabled={!plotNo}
                    />
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
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="address" />}
                      variant="standard"
                      {...register("address")}
                      error={!!errors.address}
                      helperText={errors?.address ? errors.address.message : null}
                    />
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
                    <FormControl error={!!errors.pincode} style={{ width: "230px" }}>
                      <InputLabel> {<FormattedLabel id="pincode" />}</InputLabel>
                      <Controller
                        control={control}
                        render={({ field }) => (
                          <Select
                            // fullWidth
                            value={field.value}
                            label={<FormattedLabel id="pincode" />}
                            onChange={(value) => field.onChange(value)}
                            // style={{ height: 40, padding: "14px 14px" }}
                            variant="standard"
                          >
                            {pincodes &&
                              pincodes.map((pincodes, i) => (
                                <MenuItem key={i} value={pincodes.id}>
                                  {pincodes?.pincode}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="pincode"
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.pincode ? errors.pincode.message : null}</FormHelperText>
                    </FormControl>
                  </Grid> */}
                </Grid>

                <Grid container style={{ padding: "10px" }}>
                  {/* <Grid
                    item
                    xs={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TextField
                      style={{ backgroundColor: 'white' }}
                      id='outlined-basic'
                      label={<FormattedLabel id='employeeDetails' />}
                      variant='standard'
                      {...register('employeeDetails')}
                      error={!!errors.employeeDetails}
                      helperText={
                        errors?.employeeDetails
                          ? errors.employeeDetails.message
                          : null
                      }
                    />
                  </Grid> */}

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
                      type="number"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="rate" />}
                      variant="standard"
                      {...register("rate")}
                      // error={!!errors.rate}
                      // helperText={errors?.rate ? errors.rate.message : null}
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
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="zoneType" />}
                      variant="standard"
                      {...register("zoneType")}
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
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="remark" />}
                      variant="standard"
                      {...register("remark")}
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
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="gisId" />}
                      variant="standard"
                      {...register("gisId")}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
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
                      variant="contained"
                      size="small"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {/* <FormattedLabel id={btnSaveText} /> */}
                      {language === "en" ? btnSaveText : btnSaveTextMr}
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

          <Grid container style={{ padding: "10px" }}>
            <Grid item xs={9}></Grid>
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                size="small"
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
                // fontSize: 16,
                // fontFamily: 'Montserrat',
                // font: 'center',
                // backgroundColor:'yellow',
                // // height:'auto',
                // border: 2,
                // borderColor: "primary.light",
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
              density="standard"
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
              // @ts-ignore
              columns={columns}
              onPageChange={(_data) => {
                getCircleGatMapping(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getCircleGatMapping(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
