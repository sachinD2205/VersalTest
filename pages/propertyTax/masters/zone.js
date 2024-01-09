import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  Paper,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import router from "next/router";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import UploadButtonPtax from "../../../components/fileUpload/UploadButtonPtax";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import Schema from "../../../containers/schema/propertyTax/masters/zoneMaster";
import { yupResolver } from "@hookform/resolvers/yup";
import UploadButtonNew from "../../../containers/reuseableComponents/UploadButton";

import theme from "../../../theme";
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css";
import styles2 from "./masters.module.css";
import { Search } from "@mui/icons-material";
import Head from "next/head";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

let drawerWidth;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

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
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = useState(false);
  const [circlePhoto, setCirclePhoto] = useState("");
  const [showFile, setShowFile] = useState();

  useEffect(() => {
    console.log("showFile", showFile);
  }, [showFile]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    getAllZone();
  }, []);

  // console.log('302', setCirclePhoto)
  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "50%";
  };

  // Close Drawer
  const handleDrawerClose = () => {
    // drawerWidth = 0
    setOpen(false);
  };

  // Get Table - Data
  const getAllZone = () => {
    axios
      .get(`${urls.PTAXURL}/master/circle/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        // console.log("response", res);

        let result = res.data?.circle;
        let _res = result?.map((r, i) => {
          return {
            id: r.id,
            srNo: i + 1,
            zoneCategory: 1,
            circleNo: r.circleNo,
            gisId: r.gisId,
            circleName: r.circleName,
            circleNameMr: r.circleNameMr,
            circleAddress: r.circleAddress,
            circlePhoto: r.circlePhoto,
            telephone: r.telephone,
            mobileNo: r.mobileNo,
            geoLocation: r.geoLocation,
            employeeId: r.employeeId,
            remark: r.remark,
            fromDate: r.fromDate,
            toDate: r.toDate,
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        console.log("102", _res);
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

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    console.log("formData", formData);

    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...formData,
      circlePhoto,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    axios
      .post(`${urls.PTAXURL}/master/circle/save`, finalBodyForApi, {
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
          getAllZone();
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
          getAllZone();
          setButtonInputState(false);
        } else {
          catchExceptionHandlingMethod(error, language);
          getAllZone();
          setButtonInputState(false);
        }
        // console.log("error", error);
      });
  };

  // // Delete By ID

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
            .post(`${urls.PTAXURL}/master/circle/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status === 200 || res.status === 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAllZone();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllZone();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllZone();
                setButtonInputState(false);
              }
              console.log("error", error);
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
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.PTAXURL}/master/circle/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status === 200 || res.status == 201) {
                swal("Record is Successfully Recovered!", {
                  icon: "success",
                });
                getAllZone();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllZone();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllZone();
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
    setCirclePhoto("");
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
    circlePrefix: "",
    circleNo: "",
    circleName: "",
    circleNameMr: "",
    circleAddress: "",
    circlePhoto: "",
    telephone: "",
    mobileNo: "",
    geoLocation: "",
    employeeId: "",
    remark: "",
    fromDate: null,
    toDate: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneCategory: "",
    circlePrefix: "",
    circleNo: "",
    circleName: "",
    circleNameMr: "",
    circleAddress: "",
    circlePhoto: "",
    telephone: "",
    mobileNo: "",
    geoLocation: "",
    employeeId: "",
    remark: "",
    fromDate: null,
    toDate: null,
  };

  const columns = [
    {
      field: "srNo",
      // headerName: 'Sr.No',
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "zoneCategory",
      headerName: <FormattedLabel id="zoneCategory" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "circleNo",
      headerName: <FormattedLabel id="zoneNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "circleName" : "circleNameMr",
      headerName: <FormattedLabel id="zoneName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "telephone",
      headerName: "Telephone",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: 'employeeId',
    //   headerName: 'Employee Id',
    //   flex: 1,
    //   align: 'center',
    //   headerAlign: 'center',
    // },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      flex: 1,
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
                // window.scrollTo(10, 500)
                setBtnSaveText("Update");
                setBtnSaveTextMr("अद्यतन");
                setID(params.row.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                setCirclePhoto(params.row.circlePhoto);
                reset(params.row);
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

  // Row

  return (
    <ThemeProvider theme={theme}>
      <>
        <Box
          style={{
            right: 25,
            position: "absolute",
            top: "50%",
            backgroundColor: "#bdbdbd",
          }}
        >
          {/* <IconButton
          color="inherit"
          aria-label="open drawer"
          // edge="end"
          onClick={handleDrawerOpen}
          sx={{ width: "30px", height: "75px", borderRadius: 0 }}
        >
          <ArrowLeftIcon />
        </IconButton> */}
        </Box>
        <Head>
          <title>Zone Master</title>
        </Head>

        {/** Main Component  */}
        <Main>
          <Paper className={styles2.main}>
            {/* <Box
              style={{
                height: 'auto',
                overflow: 'auto',
                padding: '10px 80px',
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
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: linearGradient(
                  //   "90deg,rgb(72 115 218 / 91%) 2%,rgb(142 122 231) 100%"
                  // ),
                  color: 'black',
                  padding: '8px',
                  fontSize: 19,
                  borderRadius: '20px',
                }}
              >
                <strong>
                  <FormattedLabel id='zoneMaster' />
                </strong>
              </Grid>
            </Box> */}

            <div className={styles2.title}>
              <FormattedLabel id="zoneMaster" />
            </div>

            <Grid container style={{ padding: "10px" }}>
              <Grid item xs={9}></Grid>
              <Grid
                item
                xs={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
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

            {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* //////////////////////////FIRST LINE////////////////////////// */}
                  {/* <Grid container spacing={2} style={{ padding: '10px' }}> */}
                  {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                      }}
                    >
                      <FormControl error={!!errors.fromDate}>
                        <Controller
                          control={control}
                          name='fromDate'
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                inputFormat='dd/MM/yyyy'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id='fromDate' />
                                  </span>
                                }
                                // value={field.value}
                                // disabled={isDisabled}
                                value={
                                  router.query.fromDate
                                    ? router.query.fromDate
                                    : field.value
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date, 'YYYY-MM-DD').format(
                                      'YYYY-MM-DD'
                                    )
                                  )
                                }
                                // selected={field.value}
                                // center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
                                    fullWidth
                                    // InputLabelProps={{
                                    //   style: {
                                    //     fontSize: 15,
                                    //     marginTop: 4,
                                    //   },
                                    // }}
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
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                      }}
                    >
                      <FormControl
                        // style={{
                        //   width: '230px',
                        //   marginTop: '2%',
                        // }}
                        error={!!errors.toDate}
                      >
                        <Controller
                          control={control}
                          name='toDate'
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                inputFormat='dd/MM/yyyy'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id='toDate' />
                                  </span>
                                }
                                // value={field.value}
                                // disabled={isDisabled}
                                value={
                                  router.query.toDate
                                    ? router.query.toDate
                                    : field.value
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date, 'YYYY-MM-DD').format(
                                      'YYYY-MM-DD'
                                    )
                                  )
                                }
                                // selected={field.value}
                                // center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
                                    fullWidth
                                    // InputLabelProps={{
                                    //   style: {
                                    //     fontSize: 15,
                                    //     marginTop: 4,
                                    //   },
                                    // }}
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
                  {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

                  {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        id='standard-basic'
                        label={<FormattedLabel id='zoneNumber' />}
                        variant='standard'
                        // InputProps={{ style: { fontSize: 18 } }}
                        // InputLabelProps={{ style: { fontSize: 18 } }}
                        {...register('circleNo')}
                        onChange={(e) => {
                          if (e.target.value.length > 0) {
                            setIsDisabled(false)
                          } else {
                            setIsDisabled(true)
                          }
                        }}
                        error={!!errors.circleNo}
                        helperText={
                          // errors?.studentName ? errors.studentName.message : null
                          errors?.circleNo ? errors.circleNo.message : null
                        }
                      />
                    </Grid> */}

                  {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        id='standard-basic'
                        label={<FormattedLabel id='zoneName' />}
                        variant='standard'
                        {...register('circleName')}
                        error={!!errors.circleName}
                        helperText={
                          // errors?.studentName ? errors.studentName.message : null
                          errors?.circleName ? errors.circleName.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        id='standard-basic'
                        label={<FormattedLabel id='administrativeZone' />}
                        variant='standard'
                        {...register('administrativeZone')}
                        error={!!errors.administrativeZone}
                        helperText={
                          errors?.administrativeZone
                            ? errors.administrativeZone.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: '200px',
                      }}
                    >
                      <UploadButtonPtax
                        appName='ptax'
                        serviceName='PT-CircleMaster'
                        filePath={setCirclePhoto}
                        fileName={circlePhoto}
                        fileData={setShowFile}
                        file={showFile}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        id='standard-basic'
                        label={<FormattedLabel id='email' />}
                        variant='standard'
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors?.email ? errors.email.message : null}
                      />
                    </Grid> */}
                  <div
                    // className={styles2.row}
                    style={{
                      padding: "0% 3%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      // columnGap: 50,
                    }}
                  >
                    {/* <TextField
                      id='standard-basic'
                      label={<FormattedLabel id='zoneNumber' />}
                      variant='standard'
                      // InputProps={{ style: { fontSize: 18 } }}
                      // InputLabelProps={{ style: { fontSize: 18 } }}
                      {...register('circleNo')}
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          setIsDisabled(false)
                        } else {
                          setIsDisabled(true)
                        }
                      }}
                      error={!!errors.circleNo}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.circleNo ? errors.circleNo.message : null
                      }
                    /> */}
                    <FormControl error={!!errors.fromDate}>
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              inputFormat="dd/MM/yyyy"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="fromDate" />
                                </span>
                              }
                              // value={field.value}
                              // disabled={isDisabled}
                              value={
                                router.query.fromDate
                                  ? router.query.fromDate
                                  : field.value
                              }
                              onChange={(date) =>
                                field.onChange(
                                  moment(date, "YYYY-MM-DD").format(
                                    "YYYY-MM-DD"
                                  )
                                )
                              }
                              // selected={field.value}
                              // center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  // InputLabelProps={{
                                  //   style: {
                                  //     fontSize: 15,
                                  //     marginTop: 4,
                                  //   },
                                  // }}
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
                    <FormControl
                      // style={{
                      //   width: '230px',
                      //   marginTop: '2%',
                      // }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              inputFormat="dd/MM/yyyy"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="toDate" />
                                </span>
                              }
                              // value={field.value}
                              // disabled={isDisabled}
                              value={
                                router.query.toDate
                                  ? router.query.toDate
                                  : field.value
                              }
                              onChange={(date) =>
                                field.onChange(
                                  moment(date, "YYYY-MM-DD").format(
                                    "YYYY-MM-DD"
                                  )
                                )
                              }
                              // selected={field.value}
                              // center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  // InputLabelProps={{
                                  //   style: {
                                  //     fontSize: 15,
                                  //     marginTop: 4,
                                  //   },
                                  // }}
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

                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="zoneNumber" />}
                      variant="standard"
                      // InputProps={{ style: { fontSize: 18 } }}
                      // InputLabelProps={{ style: { fontSize: 18 } }}
                      {...register("circleNo")}
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          setIsDisabled(false);
                        } else {
                          setIsDisabled(true);
                        }
                      }}
                      error={!!errors.circleNo}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.circleNo ? errors.circleNo.message : null
                      }
                    />

                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="zoneName" />}
                      variant="standard"
                      {...register("circleName")}
                      error={!!errors.circleName}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.circleName ? errors.circleName.message : null
                      }
                    />

                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="gisId" />}
                      variant="standard"
                      {...register("gisId")}
                      error={!!errors.gisId}
                      helperText={errors?.gisId ? errors.gisId.message : null}
                    />

                    <div
                      style={{
                        width: "230px",
                      }}
                    >
                      {/* <UploadButtonPtax
                        appName='ptax'
                        serviceName='PT-CircleMaster'
                        filePath={setCirclePhoto}
                        fileName={circlePhoto}
                        fileData={setShowFile}
                        file={showFile}
                      /> */}

                      <UploadButtonNew
                        appName="TP"
                        serviceName="PARTMAP"
                        // appName='PTax'
                        // serviceName='zoneMaster'
                        // label={<FormattedLabel id='uploadPhoto' />}
                        addFileText={{ en: "Upload Photo", mr: "चित्र जोडा" }}
                        filePath={circlePhoto}
                        fileUpdater={setCirclePhoto}
                        view={router.query.pageMode === "view" ? true : false}
                        onlyImage
                      />
                    </div>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="email" />}
                      variant="standard"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors?.email ? errors.email.message : null}
                    />

                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="telephone" />}
                      variant="standard"
                      {...register("telephone")}
                      error={!!errors.telephone}
                      helperText={
                        errors?.telephone ? errors.telephone.message : null
                      }
                    />
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="mobile" />}
                      variant="standard"
                      {...register("mobileNo")}
                      error={!!errors.mobileNo}
                      helperText={
                        errors?.mobileNo ? errors.mobileNo.message : null
                      }
                    />
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="address" />}
                      variant="standard"
                      {...register("circleAddress")}
                      error={!!errors.circleAddress}
                      helperText={
                        errors?.circleAddress
                          ? errors.circleAddress.message
                          : null
                      }
                    />
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="remark" />}
                      variant="standard"
                      {...register("remark")}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                    />
                    {/* <TextField
                      id='standard-basic'
                      label='Remark'
                      variant='standard'
                      {...register('remark')}
                    /> */}
                    <TextField
                      // sx={{ flex: 0.85 }}

                      id="standard-basic"
                      label={<FormattedLabel id="searchYourAddress" />}
                      variant="standard"
                      {...register("geoLocation")}
                      error={!!errors.geoLocation}
                      helperText={
                        errors?.geoLocation ? errors.geoLocation.message : null
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              // sx={{ color: '#0a0908' }}
                              sx={{ color: "#1976D2" }}
                              onClick={handleDrawerOpen}
                            >
                              <Search />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/* <div
                      style={{
                        width: '535px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        sx={{ flex: 0.85 }}
                        id='standard-basic'
                        label={<FormattedLabel id='searchYourAddress' />}
                        variant='standard'
                        {...register('geoLocation')}
                        error={!!errors.geoLocation}
                        helperText={
                          errors?.geoLocation
                            ? errors.geoLocation.message
                            : null
                        }
                      />
                      <Button onClick={handleDrawerOpen}>
                        {language === 'en' ? 'Search' : 'शोधा'}
                      </Button>
                    </div> */}
                  </div>
                  {/* <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <TextField
                      id='standard-basic'
                      label={<FormattedLabel id='zoneName' />}
                      variant='standard'
                      {...register('circleName')}
                      error={!!errors.circleName}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.circleName ? errors.circleName.message : null
                      }
                    />
                    <div
                      style={{
                        width: '230px',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <UploadButtonPtax
                        appName='ptax'
                        serviceName='PT-CircleMaster'
                        filePath={setCirclePhoto}
                        fileName={circlePhoto}
                        fileData={setShowFile}
                        file={showFile}
                      />
                    </div>
                    <TextField
                      id='standard-basic'
                      label={<FormattedLabel id='email' />}
                      variant='standard'
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors?.email ? errors.email.message : null}
                    />
                  </div> */}

                  {/* <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <TextField
                      id='standard-basic'
                      label={<FormattedLabel id='telephone' />}
                      variant='standard'
                      {...register('telephone')}
                      error={!!errors.telephone}
                      helperText={
                        errors?.telephone ? errors.telephone.message : null
                      }
                    />
                    <TextField
                      id='standard-basic'
                      label={<FormattedLabel id='mobile' />}
                      variant='standard'
                      {...register('mobileNo')}
                      error={!!errors.mobileNo}
                      helperText={
                        errors?.mobileNo ? errors.mobileNo.message : null
                      }
                    />
                    <TextField
                      id='standard-basic'
                      label={<FormattedLabel id='address' />}
                      variant='standard'
                      {...register('address')}
                      error={!!errors.address}
                      helperText={
                        errors?.address ? errors.address.message : null
                      }
                    />
                  </div> */}

                  {/* <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TextField
                      id='standard-basic'
                      label={<FormattedLabel id='telephone' />}
                      variant='standard'
                      {...register('telephone')}
                      error={!!errors.telephone}
                      helperText={
                        errors?.telephone ? errors.telephone.message : null
                      }
                    />
                  </Grid> */}

                  {/* <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TextField
                      id='standard-basic'
                      label={<FormattedLabel id='mobile' />}
                      variant='standard'
                      {...register('mobileNo')}
                      error={!!errors.mobileNo}
                      helperText={
                        errors?.mobileNo ? errors.mobileNo.message : null
                      }
                    />
                  </Grid> */}
                  {/* </Grid> */}

                  {/* <Grid container spacing={2} style={{ padding: '10px' }}> */}
                  {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        id='standard-basic'
                        label={<FormattedLabel id='address' />}
                        variant='standard'
                        {...register('address')}
                        error={!!errors.address}
                        helperText={
                          errors?.address ? errors.address.message : null
                        }
                      />
                    </Grid> */}

                  {/* <Grid
                      item
                      xs={12}
                      sm={8}
                      md={8}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        columnGap: 50,
                        // marginRight: "5px",
                      }}
                    >
                      <TextField
                        style={{ flex: 0.5 }}
                        id='standard-basic'
                        label={<FormattedLabel id='searchYourAddress' />}
                        variant='standard'
                        {...register('geoLocation')}
                        error={!!errors.geoLocation}
                        helperText={
                          errors?.geoLocation
                            ? errors.geoLocation.message
                            : null
                        }
                      />
                      <Button onClick={handleDrawerOpen}>
                        {language === 'en' ? 'Search' : 'शोधा'}
                      </Button>
                    </Grid> */}
                  {/* </Grid> */}

                  {/* <Grid container spacing={2} style={{ padding: '10px' }}> */}
                  {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        id='standard-basic'
                        label={<FormattedLabel id='employeeId' />}
                        variant='standard'
                        {...register('employeeId')}
                        error={!!errors.employeeId}
                        helperText={
                          errors?.employeeId ? errors.employeeId.message : null
                        }
                      />
                    </Grid> */}

                  {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        id='standard-basic'
                        label='Remark'
                        variant='standard'
                        {...register('remark')}
                      />
                    </Grid> */}
                  {/* </Grid> */}
                  <div
                    className={styles2.buttons}
                    style={{ marginBottom: "3vh" }}
                  >
                    <Button
                      // sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {/* <FormattedLabel id={btnSaveText} /> */}
                      {language === "en" ? btnSaveText : btnSaveTextMr}
                    </Button>{" "}
                    <Button
                      // sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </div>

                  {/* <Grid container spacing={2} style={{ padding: '10px' }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        sx={{ marginRight: 8 }}
                        type='submit'
                        variant='contained'
                        color='success'
                        endIcon={<SaveIcon />}
                      >
                        {language === 'en' ? btnSaveText : btnSaveTextMr}
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        sx={{ marginRight: 8 }}
                        variant='contained'
                        color='primary'
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id='clear' />
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        variant='contained'
                        color='error'
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id='exit' />
                      </Button>
                    </Grid>
                  </Grid> */}
                  {/* <Divider /> */}
                </form>
              </Slide>
            )}

            {/* <Grid container style={{ padding: '10px' }}>
              <Grid item xs={9}></Grid>
              <Grid
                item
                xs={2}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button
                  variant='contained'
                  endIcon={<AddIcon />}
                  type='primary'
                  disabled={buttonInputState}
                  onClick={() => {
                    reset({
                      ...resetValuesExit,
                    })
                    setEditButtonInputState(true)
                    setDeleteButtonState(true)
                    setBtnSaveText('Save')
                    setBtnSaveTextMr('जतन करा')
                    setButtonInputState(true)
                    setSlideChecked(true)
                    setIsOpenCollapse(!isOpenCollapse)
                  }}
                >
                  <FormattedLabel id='add' />
                </Button>
              </Grid>
            </Grid> */}

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
                  // overflowY: 'scroll',

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
                rowCount={data?.totalRows}
                rowsPerPageOptions={data.rowsPerPageOptions}
                page={data?.page}
                pageSize={data?.pageSize}
                rows={data?.rows || []}
                columns={columns}
                onPageChange={(_data) => {
                  getAllZone(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAllZone(_data, data.page);
                }}
              />
            </Box>
          </Paper>
        </Main>
        {/** Drawer  */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          {/* <DrawerHeader>
      <IconButton onClick={handleDrawerClose}>
        {theme.direction === "rtl" ? (
          <ChevronLeftIcon />
        ) : (
          <ChevronRightIcon />
        )}
      </IconButton>
    </DrawerHeader> */}
          {/* <Divider /> */}

          <Box
            style={{
              left: 0,
              position: "absolute",
              top: "50%",
              backgroundColor: "#bdbdbd",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // edge="end"
              onClick={handleDrawerClose}
              sx={{ width: "30px", height: "75px", borderRadius: 0 }}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>

          <img
            src="/ABC.png"
            //hegiht='300px'
            width="800px"
            alt="Map Not Found"
            style={{ width: "100%", height: "100%" }}
          />
        </Drawer>
        {/** End Drawer  */}
      </>
    </ThemeProvider>
  );
};

export default Index;
