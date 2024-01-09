import {
  Button,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Modal,
  Dialog,
  DialogTitle,
  CssBaseline,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  DialogContent,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
  TextareaAutosize,
} from "@mui/material";
import { flexbox, Stack } from "@mui/system";
import UploadButton1 from "../../fileUpload/UploadButton1";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ThemeProvider } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import urls from "../../../URLS/urls";
import router, { useRouter } from "next/router";
import ApplicantDetails from "./ApplicantDetails";
import FormsDetails from "./FormsDetails";
import BuildingUse from "./BuildingUse";

const LoiCollectionComponent = (props) => {
  const {
    setValue,
    getValues,
    methods,
    watch,
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [inputState, setInputState] = useState(false);

  // Form Preview - ===================>
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);
  //documents
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] =
    useState(null);
  const [overHearWaterTankCoApprovedMaps, setWaterTank] = useState(null);
  const [layoutPlan, setLayoutPlan] = useState(null);
  const [tank, setTank] = useState(null);
  const [permission, setPermission] = useState(null);
  const [stability, setStability] = useState(null);
  const [fireDrawing, setFireDrawing] = useState(null);
  const [elivation, setElivation] = useState(null);
  const [road, setRoad] = useState(null);
  const [explosive, setExplosive] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [lift, setLift] = useState(null);
  // payment Mode
  const [paymentModeName, setPaymentModeName] = useState();
  const [hardCodeAuthority, setHardCodeAuthority] = useState();
  const [newRole, setNewRole] = useState();

  // Approve Remark Modal Close
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const approveRevertRemarkDailogOpen = () =>
    setApproveRevertRemarkDailog(true);
  const approveRevertRemarkDailogClose = () =>
    setApproveRevertRemarkDailog(false);

  // Pay
  const pay = () => {};
  useEffect(() => {
    console.log("watch", watch("paymentMode"));
  }, [watch("paymentMode")]);

  // Input State
  useEffect(() => {
    setInputState(true);
  }, []);

  // useEffect(() => {
  //   reset(...props)
  //   // setInputState(true);
  // }, [props]);

  // const [licenseTypes, setLicenseTypes] = useState([]);

  // const getLicenseTypes = () => {
  //   axios.get(`${urls.FbsURL}/licenseValidity/getAll`).then((r) => {
  //     setLicenseTypes(
  //       r.data.licenseValidity.map((row) => ({
  //         id: row.id,
  //         licenseType: row.licenseValidity,
  //         licenseTypeMr: row.licenseValidity,
  //       }))
  //     );
  //   });
  // };

  // title
  const [titles, setTitles] = useState();

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        }))
      );
    });
  };

  const remarkFun = (data) => {
    let approveRemark;
    let rejectRemark;

    if (data == "Approve") {
      approveRemark = watch("verificationRemark");
    } else if (data == "Revert") {
      rejectRemark = watch("verificationRemark");
    }

    const finalBodyForApi = {
      approveRemark,
      rejectRemark,
      id: getValues("id"),
      desg: props?.hardCodeAuthority,
      role: props?.newRole,
    };
    console.log("finalBodyForApi", finalBodyForApi);
    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi
      )
      .then((res) => {
        if (res.status == 200) {
          router.push("/FireBrigadeSystem/dashboard");

          approveRevertRemarkDailogClose();
        } else if (res.status == 201) {
          router.push("/FireBrigadeSystem/dashboard");
          approveRevertRemarkDailogClose();
        }
      });
  };

  const [serviceNames, setServiceNames] = useState([]);
  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            }))
          );
        } else {
          message.error("Filed To Load !! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.success("Error !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((r) => {
      setPaymentTypes(
        r.data.paymentType.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
          paymentTypeMr: row.paymentTypeMr,
        }))
      );
    });
  };

  const [paymentModes, setPaymentModes] = useState([]);

  const getPaymentModes = () => {
    axios.get(`${urls.FbsURL}/master/paymentMode/getAll`).then((r) => {
      setPaymentModes(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        }))
      );
    });
  };

  // Bank Masters

  const [bankMasters, setBankMasters] = useState([]);

  // getBankMasters
  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(
        r.data.bank.map((row) => ({
          id: row.id,
          bankMaster: row.bankName,
          bankMasterMr: row.bankNameMr,
        }))
      );
    });
  };

  useEffect(() => {
    console.log("propssachin", props);
  }, [props]);

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getserviceNames();
    getTitles();
    // getLicenseTypes();
    getBankMasters();
  }, []);

  // const getLoiCollectionData = () => {
  //   const id = getValues("id");
  //   console.log("id ky yetoy", id);
  //   axios
  //     .get(`${urls.FbsURL}/transactions/provisionalBuildingNoc/getAll`)
  //     .then((res) => {
  //       if (res.data == 200) {
  //         console.log("resp.data", res.data);
  //         reset(res.data);
  //       }
  //     });
  // };

  // useEffect(() => {
  //   getLoiCollectionData();
  // }, [getValues("id")]);

  const handleNext = (data) => {
    console.log("payment data", data);
    const finalBodyForApi = {
      ...data,
      role: "LOI_COLLECTION",
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            role: "LOI_COLLECTION",
            id: data.id,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          finalBodyForApi.id
            ? sweetAlert("LOI !", `LOI Generated successfully ! `, "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push("/streetVendorManagementSystem/dashboards");
        } else if (res.status == 201) {
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved !", "Record Saved successfully !", "success");
          router.push("/streetVendorManagementSystem/dashboards");
        }
      });
  };

  useEffect(() => {
    if (getValues("paymentCollection.paymentMode") == "CASH") {
      setValue("paymentCollection.receiptAmount", getValues("loi.total"));
    }
  }, [watch("paymentMode")]);

  // view
  return (
    <>
      <div>
        <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit(handleNext)}>
            <div>
              {/***
            <div
              style={{
                backgroundColor: "#0084ff",
                color: "white",
                fontSize: 19,
                marginTop: 30,
                // marginBottom: 30,
                padding: 8,
                paddingLeft: 30,
                marginLeft: "40px",
                marginRight: "40px",
                borderRadius: 100,
              }}
            >
              <strong>{<FormattedLabel id='loiCollection' />}</strong>
            </div>
            <Grid
              container
              sx={{
                marginTop: 1,
                marginBottom: "15px",
                paddingLeft: "50px",
                align: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >
                <TextField
                  label={<FormattedLabel id='applicationNumber' />}
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                  marginTop: "20px",
                }}
              >
                <Typography variant='h1'>
                  <strong>
                    <FormattedLabel id='or' />
                  </strong>
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >

                <Stack spacing={12} direction='row'>
                  <TextField
                    label={<FormattedLabel id='loiNO' />}
                    {...register("loi.loiNo")}
                    // error={!!errors.loi.loiNo}
                    // helperText={
                    //   errors?.(loi.loiNo) ? errors.loi.loiNo.message : null
                    // }
                  />
                  <FormControl
                    sx={{ marginTop: 2 }}

                    // error={!!errors.loi.loi.loiDate}
                  >
                    <Controller
                      name='loi.loiDate'
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat='DD/MM/YYYY'
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                <FormattedLabel id='loiDate' />
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size='small'
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
                      {errors?.loiDate ? errors.loiDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >
                <Button variant='contained' sx={{ marginTop: "20px" }}>
                  <FormattedLabel id='search'></FormattedLabel>
                </Button>
              </Grid>
            </Grid>
              */}

              <div
                style={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  fontSize: 19,
                  marginTop: 30,
                  marginBottom: 30,
                  padding: 8,
                  paddingLeft: 30,
                  marginLeft: "40px",
                  marginRight: "40px",
                  borderRadius: 100,
                }}
              >
                <strong>
                  {/* <FormattedLabel id="applicantDetails" /> */}
                  Application Details
                </strong>
              </div>
              <Grid
                container
                sx={{
                  marginTop: 1,
                  marginBottom: 5,
                  paddingLeft: "50px",
                  align: "center",
                }}
              >
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <FormControl
                    error={!!errors.serviceName}
                    sx={{ marginTop: 2 }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* {<FormattedLabel id="serviceName" />} */}
                      Service Name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={inputState}
                          sx={{ minWidth: "230px", width: "500px" }}
                          autoFocus
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Service Name *"
                          id="demo-simple-select-standard"
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {serviceNames &&
                            serviceNames.map((serviceName, index) => (
                              <MenuItem key={index} value={serviceName.id}>
                                {language == "en"
                                  ? serviceName?.serviceName
                                  : serviceName?.serviceNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="serviceName"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <TextField
                    disabled={inputState}
                    label="Application No."
                    {...register("applicationNo")}
                    error={!!errors.applicationNumber}
                    helperText={
                      errors?.applicationNumber
                        ? errors.applicationNumber.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <FormControl
                    sx={{ marginTop: 0 }}
                    error={!!errors.applicationDate}
                  >
                    <Controller
                      name="applicationDate"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled={inputState}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                Application Date
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
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
                      {errors?.applicationDate
                        ? errors.applicationDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* {<FormattedLabel id="title" />} */}
                      Title
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          inputFormat="DD/MM/YYYY"
                          disabled={inputState}
                          sx={{ width: "230px" }}
                          autoFocus
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label={<FormattedLabel id="title" />}
                          label="Title"
                          id="demo-simple-select-standard"
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {titles &&
                            titles.map((title, index) => (
                              <MenuItem key={index} value={title.id}>
                                {language == "en"
                                  ? title?.title
                                  : title?.titleMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="title"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.title ? errors.title.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
                    // label={<FormattedLabel id="firstName" />}
                    label="First Name"
                    {...register("applicantName")}
                    error={!!errors.firstName}
                    helperText={
                      errors?.firstName ? errors.firstName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
                    // disabled={inputState}
                    // label={<FormattedLabel id="middleName" />}
                    label="Middle Name"
                    {...register("applicantMiddleName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
                    // label={<FormattedLabel id="lastName" />}
                    label="Last Name"
                    {...register("applicantLastName")}
                    error={!!errors.lastName}
                    helperText={
                      errors?.lastName ? errors.lastName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
                    // label={<FormattedLabel id="emailAddress" />}
                    label="Email Address"
                    {...register("emailId")}
                    error={!!errors.emailId}
                    helperText={errors?.emailId ? errors.emailId.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id="standard-basic"
                    disabled={inputState}
                    // label={<FormattedLabel id="mobile" />}
                    label="Mobile"
                    {...register("mobileNO")}
                    error={!!errors.mobile}
                    helperText={errors?.mobile ? errors.mobile.message : null}
                  />
                </Grid>
              </Grid>

              {/* View Form & Document */}

              <Grid container>
                <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
                  <Stack
                    style={{ display: flexbox, justifyContent: "center" }}
                    spacing={3}
                    direction={"row"}
                  >
                    {/** Form Preview Button */}

                    <IconButton
                      onClick={() => {
                        console.log("viewFormProps", props?.props);
                        reset(props?.props);

                        setValue("serviceName", props.serviceId);
                        formPreviewDailogOpen();
                      }}
                    >
                      <Button
                        variant="contained"
                        endIcon={<VisibilityIcon />}
                        size="small"
                      >
                        View Form
                      </Button>
                    </IconButton>

                    {/** View Document Button */}

                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<VisibilityIcon />}
                        size="small"
                        onClick={() => {
                          reset(props?.props);
                          setValue("serviceName", props.serviceId);
                          documentPreviewDailogOpen();
                        }}
                      >
                        View Document
                      </Button>
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>

              <div
                style={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  fontSize: 19,
                  marginTop: 30,
                  marginBottom: 30,
                  padding: 8,
                  paddingLeft: 30,
                  marginLeft: "40px",
                  marginRight: "40px",
                  borderRadius: 100,
                }}
              >
                {/* <strong>{<FormattedLabel id="loiDetails" />}</strong> */}
                <strong> LOI Details</strong>
              </div>

              <Grid
                container
                sx={{
                  marginTop: 1,
                  marginBottom: 5,
                  paddingLeft: "50px",
                  align: "center",
                }}
              >
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    // label={<FormattedLabel id="loiNO" />}
                    label="LOI No."
                    {...register("loi.loiNO")}
                    error={!!errors.loiNO}
                    helperText={errors?.loiNO ? errors.loiNO.message : null}
                  />
                </Grid>

                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl sx={{ marginTop: 0 }} error={!!errors.loiDate}>
                    <Controller
                      name="loi.loiDate"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                {/* <FormattedLabel id="loiDate" /> */}
                                LOI Date
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
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
                      {errors?.loiDate ? errors.loiDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.durationOfLicenseValidity}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="durationOfLicenseValidity" />}
                  
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 230 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          
                          label={
                            <FormattedLabel id="durationOfLicenseValidity" />
                          }
                        >
                          {licenseTypes &&
                            licenseTypes.map((licenseType, index) => (
                              <MenuItem key={index} value={licenseType.id}>
                                {licenseType.licenseType}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="loi.durationOfLicenseValidity"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.licenseType ? errors.licenseType.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    // label={<FormattedLabel id="totalCharges" />}
                    label="Total Charges"
                    {...register("loi.total")}
                    error={!!errors.total}
                    helperText={errors?.total ? errors.total.message : null}
                  />
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    // label={<FormattedLabel id="totalInWords" />}
                    label="Total In Words"
                    {...register("loi.totalInWords")}
                    error={!!errors.totalInWords}
                    helperText={
                      errors?.totalInWords ? errors.totalInWords.message : null
                    }
                  />
                </Grid>
              </Grid>
              {/* <div
                style={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  fontSize: 19,
                  marginTop: 30,
                  marginBottom: 30,
                  padding: 8,
                  paddingLeft: 30,
                  marginLeft: "40px",
                  marginRight: "40px",
                  borderRadius: 100,
                }}
              >
                <strong>
                  Receipt Mode Details
                </strong>
              </div>
              <Grid
                container
                sx={{
                  marginTop: 1,
                  marginBottom: 5,
                  paddingLeft: "50px",
                  align: "center",
                }}
              >
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl
                    error={!!errors.paymentType}
                    sx={{ marginTop: 2 }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Payment Type
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "230px" }}
                          // // dissabled={inputState}
                          autoFocus
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Payment Type"
                          id="demo-simple-select-standard"
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {paymentTypes &&
                            paymentTypes.map((paymentType, index) => (
                              <MenuItem
                                key={index}
                                value={paymentType.paymentType}
                              >
                                {language == "en"
                                  ? paymentType?.paymentType
                                  : paymentType?.paymentTypeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="paymentCollection.paymentType"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl
                    error={!!errors.paymentMode}
                    sx={{ marginTop: 2 }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Payment Mode
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "230px" }}
                          // // dissabled={inputState}
                          autoFocus
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label="Payment Mode"
                          id="demo-simple-select-standard"
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {paymentModes &&
                            paymentModes.map((paymentMode, index) => (
                              <MenuItem
                                key={index}
                                value={paymentMode.paymentMode}
                              >
                                {language == "en"
                                  ? paymentMode?.paymentMode
                                  : paymentMode?.paymentModeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="paymentCollection.paymentMode"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid>

                {watch("paymentCollection.paymentMode") == "DD" && (
                  <>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        id="standard-basic"
                        label="Bank Name"
                        variant="standard"
                        {...register("paymentCollection.bankName")}
                        error={!!errors.bankName}
                        helperText={
                          errors?.bankName ? errors.bankName.message : null
                        }
                      />
                    </Grid>

                
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        id="standard-basic"
                        label="Bank Account No"
                        variant="standard"
                        {...register("paymentCollection.bankAccountNo")}
                        error={!!errors.bankAccountNo}
                        helperText={
                          errors?.bankAccountNo
                            ? errors.bankAccountNo.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        id="standard-basic"
                        label="DD No"
                        variant="standard"
                        {...register("paymentCollection.dDNo")}
                        error={!!errors.dDNo}
                        helperText={errors?.dDNo ? errors.dDNo.message : null}
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.dDDate}
                      >
                        <Controller
                          name="paymentCollection.dDDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    <FormattedLabel id="ddDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
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
                          {errors?.dDDate ? errors.dDDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {watch("paymentCollection.paymentMode") == "CASH" && (
                  <>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        id="standard-basic"
                        label="ReceiptAmount"
                        variant="standard"
                        {...register("paymentCollection.receiptAmount")}
                        error={!!errors.receiptAmount}
                        helperText={
                          errors?.receiptAmount
                            ? errors.receiptAmount.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        id="standard-basic"
                        label="Receipt Number"
                        variant="standard"
                        {...register("paymentCollection.receiptNo")}
                        error={!!errors.receiptNo}
                        helperText={
                          errors?.receiptNo ? errors.receiptNo.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.receiptDate}
                      >
                        <Controller
                          name="paymentCollection.receiptDate"
                          control={control}
                          defaultValue={moment()}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    <FormattedLabel id="receiptDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
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
                          {errors?.receiptDate
                            ? errors.receiptDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid> */}
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Stack
                    style={{ display: "flex", justifyContent: "center" }}
                    spacing={3}
                    direction={"row"}
                  >
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "green" }}
                      onClick={() => approveRevertRemarkDailogOpen()}
                    >
                      Action
                    </Button>
                    {/* <Button
                      style={{ backgroundColor: "red" }}
                      variant="contained"
                      onClick={() => verificationAoClose()}
                    >
                      Exit
                    </Button> */}
                  </Stack>
                </Grid>
              </Grid>
              {/** Form Preview Dailog  - OK */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={formPreviewDailog}
                onClose={() => formPreviewDailogClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      Preview
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            formPreviewDailogClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  {/* <PropertyTax /> */}
                  <ApplicantDetails />
                  <FormsDetails />
                  <BuildingUse />
                </DialogContent>

                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button onClick={formPreviewDailogClose}>Exit</Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** Document Preview Dailog - OK */}
              <Dialog
                fullWidth
                maxWidth={"md"}
                open={documentPreviewDialog}
                onClose={() => documentPreviewDailogClose()}
              >
                <Paper sx={{ p: 2 }}>
                  <CssBaseline />
                  <DialogTitle>
                    <Grid container>
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        lg={6}
                        xl={6}
                        md={6}
                        sx={{
                          display: "flex",
                          alignItem: "left",
                          justifyContent: "left",
                        }}
                      >
                        Document Preview
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        sm={2}
                        md={4}
                        lg={6}
                        xl={6}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <IconButton
                          aria-label="delete"
                          sx={{
                            marginLeft: "530px",
                            backgroundColor: "primary",
                            ":hover": {
                              bgcolor: "red", // theme.palette.primary.main
                              color: "white",
                            },
                          }}
                        >
                          <CloseIcon
                            sx={{
                              color: "black",
                            }}
                            onClick={() => {
                              documentPreviewDailogClose();
                            }}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </DialogTitle>
                  <DialogContent
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/** <FormProvider {...methods}>*/}
                    <TableContainer style={{ border: "2px soiid black" }}>
                      <Table style={{ border: "2px soiid red" }}>
                        <TableHead
                          stickyHeader={true}
                          sx={{
                            // textDecorationColor: "white",
                            backgroundColor: "#1890ff",
                          }}
                        >
                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <h3 style={{ color: "white" }}>Sr.No</h3>
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <h3 style={{ color: "white" }}>Document Name</h3>
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <h3 style={{ color: "white" }}>Mandatory</h3>
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <h3 style={{ color: "white" }}>View Document</h3>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              1{" "}
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Over Hear Water Tank Coapproved Maps
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setWaterTank}
                                fileName={getValues(
                                  "overHearWaterTankCoApprovedMaps"
                                )}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              2{" "}
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Approved Layout Plan PCMC
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setLayoutPlan}
                                fileName={getValues("layoutPlan")}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              3
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Set Tank
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setTank}
                                fileName={getValues("tank")}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              4
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Permission letter Of PCMC
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={disablityCertificatePhoto}
                                fileName={getValues(
                                  "disablityCertificatePhoto"
                                )}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              5
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Structural Stability Certificate
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setPermission}
                                fileName={getValues("permission")}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              6
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Fire Drawing Floor wise i.e. also approved by
                              Compliance authority
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setStability}
                                fileName={getValues("stability")}
                              />
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              7
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Approved Key Plan, Site Plan , Elivation Section
                              PCMC
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setStability}
                                fileName={getValues("stability")}
                              />
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              8
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Approved Approach Road PCMC
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setRoad}
                                fileName={getValues("road")}
                              />
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              9
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Explosive License (for LGP, CNG , Petrol Pump ,Gas
                              Station , Gas Storage)
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setExplosive}
                                fileName={getValues("explosive")}
                              />
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              10
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Completion Certificate
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setCompletion}
                                fileName={getValues("completion")}
                              />
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell style={{ border: "2px soiid black" }}>
                              11
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Escalator / Lift Approved by Govt Certificate
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              Required
                            </TableCell>
                            <TableCell style={{ border: "2px soiid black" }}>
                              <UploadButton1
                                appName="FBS"
                                serviceName="ProvisionalBuildingFire"
                                filePath={setLift}
                                fileName={getValues("lift")}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/**   </FormProvider>*/}
                  </DialogContent>
                  {/**
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Stack
                direction='row'
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant='contained' onClick={approveButton}>
                  Approve
                </Button>
                <Button variant='contained' onClick={revertButton}>
                  Revert
                </Button>
              </Stack>
            </Grid>
          </Grid>
           */}
                  <DialogTitle>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="contained"
                        onClick={documentPreviewDailogClose}
                      >
                        Exit
                      </Button>
                    </Grid>
                  </DialogTitle>
                </Paper>
              </Dialog>

              {/** Approve Button   Preview Dailog  */}
              <Modal
                open={approveRevertRemarkDailog}
                onClose={() => approveRevertRemarkDailogClose()}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Paper
                  sx={{
                    // backgroundColor: "#F5F5F5",
                    padding: 2,
                    height: "400px",
                    width: "600px",
                    // display: "flex",
                    // alignItems: "center",
                    // justifyContent: "center",
                  }}
                  elevation={5}
                  component={Box}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ marginBottom: "30px", marginTop: "20px" }}
                        variant="h6"
                      >
                        Enter Remark for Application
                      </Typography>
                      <br />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextareaAutosize
                        style={{
                          width: "550px",
                          height: "200px",
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "30px",
                        }}
                        {...register("verificationRemark")}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Stack spacing={5} direction="row">
                        <Button
                          variant="contained"
                          // type='submit'
                          style={{ backgroundColor: "green" }}
                          onClick={() => {
                            remarkFun("Approve");
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            remarkFun("Revert");
                          }}
                        >
                          Revert
                        </Button>
                        <Button
                          style={{ backgroundColor: "red" }}
                          onClick={approveRevertRemarkDailogClose}
                        >
                          Exit
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal>
            </div>
          </form>
        </ThemeProvider>
      </div>
    </>
  );
};

export default LoiCollectionComponent;
