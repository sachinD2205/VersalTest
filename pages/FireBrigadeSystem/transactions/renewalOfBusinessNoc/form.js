import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

import schema from "../../../../containers/schema/fireBrigadeSystem/renewalOfBusinessNocTransaction";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useSelector } from "react-redux";
import UploadButton from "../../../../components/fireBrigadeSystem/UploadButton";
import { DatePicker } from "@mui/x-date-pickers";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Form = () => {
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  // Exit button Routing
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [fireStation, setfireStation] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
  const [showVardiOther, setShowVardiOther] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [nocNo, setNocNO] = useState();
  const [nocTypeList, setNocTypeList] = useState([]);

  // Fetch User From cfc User (Optional)
  const [userLst, setUserLst] = useState([]);

  useEffect(() => {
    getUser();
    getVardiTypes();
    getFireStationName();
    getNOcData();
  }, []);

  // get employee from cfc
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setUserLst(res?.data);
      });
  };

  const getNOcData = (_pageSize, _pageNo, data) => {
    console.log("daatatat", data);
    axios
      .get(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("dattaaa", res.data);
        setNocTypeList(res.data.provisionBuilding);
      });
  };

  // get fire station name
  const getFireStationName = () => {
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("resss", res.data);
        setfireStation(res?.data);
      });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setVardiTypes(res?.data);
      });
  };

  const onSubmitForm = (fromData) => {
    const finalBody = {
      ...fromData,
    };
    console.log("form data", finalBody);
    console.log("form data", fromData);
    axios
      .post(`${urls.FbsURL}/trnBussinessNOC/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.back();
        }
      });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query.informerName);
      setBtnSaveText("Update");
      reset(router.query);
    }
  }, []);

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    informerName: "",
    informerNameMr: "",
    informerMiddleName: "",
    informerMiddleNameMr: "",
    informerLastName: "",
    informerLastNameMr: "",
    roadName: "",
    area: "",
    areaMr: "",
    city: "",
    cityMr: "",
    contactNumber: "",
    occurancePlace: "",
    occurancePlaceMr: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    slipHandedOverToMr: "",
    landmark: "",
    landmarkMr: "",
    vardiReceivedName: "",
    dateAndTimeOfVardi: "",
    documentsUpload: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    informerName: "",
    informerMiddleName: "",
    informerLastName: "",
    roadName: "",
    area: "",
    city: "",
    contactNumber: "",
    occurancePlace: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    landmark: "",
    vardiReceivedName: "",
    dateAndTimeOfVardi: "",
    documentsUpload: "",
  };

  const getNOcDataOnSearch = () => {
    console.log("nocccc dta", nocNo);

    nocTypeList.filter((item) => {
      if (nocNo && item.id && item.id.toString().includes(nocNo.toString())) {
        console.log("nocccc dta", item);
        // reset(item);
        reset({
          applicantName: item.applicantName,
          applicantMiddleName: item.applicantMiddleName,
          applicantLastName: item.applicantLastName,
          applicantNameMr: item.applicantNameMr,
          applicantMiddleNameMr: item.applicantMiddleNameMr,
          applicantLastNameMr: item.applicantLastNameMr,
          applicantAddress: item.applicantAddress,
          bussinessAddress: item.bussinessAddress,
          mobileNo: item.mobileNo,
          applicantAddressMr: item.applicantAddressMr,
          bussinessAddressMr: item.bussinessAddressMr,
          // ------------------------------------------
          remark: item.remark,
          typeOfBussiness: item.typeOfBussiness,
          approveDate: item.approveDate,
          fromDate: item.fromDate,
          toDate: item.toDate,
          dateOfApplication: item.dateOfApplication,
        });
      }
    });
  };
  let documentsUpload = null;

  let appName = "FBS";
  let serviceName = "M-MBR";
  let applicationFrom = "Web";

  // View
  return (
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname:
                        "/FireBrigadeSystem/transactions/renewalOfBusinessNoc",
                    })
                  }
                />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                <FormattedLabel id="renewalOfBusinessNoc" />
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "5px",
                        paddingLeft: 10,
                      }}
                    >
                      {<FormattedLabel id="renewalOfBusinessNoc" />}
                    </h3>
                  </div>
                </div>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={3} className={styles.feildres}>
                    {/* <TextField
                      fullWidth
                      id="standard-basic"
                      // label="Enter Business Noc Number"
                      label={<FormattedLabel id="enterBusinessNocNumber" />}
                      variant="standard"
                      {...register("applicantFirstName")}
                      error={!!errors.applicantFirstName}
                      helperText={
                        errors?.applicantFirstName
                          ? errors.applicantFirstName.message
                          : null
                      }
                    /> */}
                    <FormControl
                      fullWidth
                      variant="standard"
                      // sx={{ pr: 13 }}
                      error={!!errors.businessType}
                    >
                      <Select
                        sx={{ width: 185 }}
                        value={nocNo}
                        onChange={(e) => {
                          console.log(e.target.value);
                          setNocNO(e.target.value);
                        }}
                        label={<FormattedLabel id="enterBusinessNocNumber" />}
                      >
                        {nocTypeList &&
                          nocTypeList.map((nocItem, index) => (
                            // nocItem.nOCFor &&
                            <MenuItem key={index} value={nocItem.id}>
                              {nocItem.id}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2} className={styles.feildres}>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      onClick={getNOcDataOnSearch}
                    >
                      <FormattedLabel id="search" />
                    </Button>
                  </Grid>
                  <Grid item xs={5} className={styles.feildres}></Grid>
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantFirstName" />}
                      variant="standard"
                      {...register("applicantName")}
                      error={!!errors.applicantName}
                      helperText={
                        errors?.applicantName
                          ? errors.applicantName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Applicant Middle Name "
                      label={<FormattedLabel id="applicantMiddleName" />}
                      variant="standard"
                      {...register("applicantMiddleName")}
                      error={!!errors.applicantMiddleName}
                      helperText={
                        errors?.applicantMiddleName
                          ? errors.applicantMiddleName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Applicant Last Name"
                      label={<FormattedLabel id="applicantLastName" />}
                      variant="standard"
                      {...register("applicantLastName")}
                      error={!!errors.applicantLastName}
                      helperText={
                        errors?.applicantLastName
                          ? errors.applicantLastName.message
                          : null
                      }
                    />
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Applicant First Name"
                      label={<FormattedLabel id="applicantFirstNameMr" />}
                      variant="standard"
                      {...register("applicantNameMr")}
                      error={!!errors.applicantNameMr}
                      helperText={
                        errors?.applicantNameMr
                          ? errors.applicantNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Applicant Middle Name "
                      label={<FormattedLabel id="applicantMiddleNameMr" />}
                      variant="standard"
                      {...register("applicantMiddleNameMr")}
                      error={!!errors.applicantMiddleNameMr}
                      helperText={
                        errors?.applicantMiddleNameMr
                          ? errors.applicantMiddleNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Applicant Last Name"
                      label={<FormattedLabel id="applicantLastNameMr" />}
                      variant="standard"
                      {...register("applicantLastNameMr")}
                      error={!!errors.applicantLastNameMr}
                      helperText={
                        errors?.applicantLastNameMr
                          ? errors.applicantLastNameMr.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Applicant Address"
                      label={<FormattedLabel id="applicantAddress" />}
                      variant="standard"
                      {...register("applicantAddress")}
                      error={!!errors.applicantAddress}
                      helperText={
                        errors?.applicantAddress
                          ? errors.applicantAddress.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Business Address"
                      label={<FormattedLabel id="businessAddressE" />}
                      variant="standard"
                      {...register("bussinessAddress")}
                      error={!!errors.bussinessAddress}
                      helperText={
                        errors?.bussinessAddress
                          ? errors.bussinessAddress.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Mobile Number"
                      label={<FormattedLabel id="mobileNo" />}
                      variant="standard"
                      {...register("mobileNo")}
                      error={!!errors.mobileNo}
                      helperText={
                        errors?.mobileNo ? errors.mobileNo.message : null
                      }
                    />
                  </Grid>

                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Applicant Address"
                      label={<FormattedLabel id="applicantAddressMr" />}
                      variant="standard"
                      {...register("applicantAddressMr")}
                      error={!!errors.applicantAddressMr}
                      helperText={
                        errors?.applicantAddressMr
                          ? errors.applicantAddressMr.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Business Address"
                      label={<FormattedLabel id="businessAddressMr" />}
                      variant="standard"
                      {...register("bussinessAddressMr")}
                      error={!!errors.bussinessAddressMr}
                      helperText={
                        errors?.bussinessAddressMr
                          ? errors.bussinessAddressMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant="standard"
                      sx={{ width: "65%" }}
                      // error={!!errors.typeOfBussiness}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* <FormattedLabel id="typeOfBusiness" /> */}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            // required
                            label={<FormattedLabel id="typeOfBusiness" />}
                          >
                            {businessTypes &&
                              businessTypes.map((businessType, index) => (
                                <MenuItem key={index} value={businessType.id}>
                                  {businessType.businessType}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="typeOfBussiness"
                        control={control}
                        defaultValue=""
                      />
                      {/* <FormHelperText>
                        {errors?.businessType
                          ? errors.businessType.message
                          : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      style={{ marginTop: 10 }}
                      // error={!!errors.shiftStartTime}
                      sx={{ width: "65%" }}
                    >
                      <Controller
                        control={control}
                        name="approveDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              InputLabelProps={{ shrink: true }}
                              inputFormat="DD/MM/YYYY"
                              label={<FormattedLabel id="approveDate" />}
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
                      {/* <FormHelperText>
                        {errors?.shiftStartTime
                          ? errors.shiftStartTime.message
                          : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      style={{ marginTop: 10 }}
                      // error={!!errors.shiftStartTime}
                      sx={{ width: "65%" }}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<FormattedLabel id="fromDate" />}
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
                      {/* <FormHelperText>
                        {errors?.shiftStartTime
                          ? errors.shiftStartTime.message
                          : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      style={{ marginTop: 10 }}
                      error={!!errors.shiftStartTime}
                      sx={{ width: "65%" }}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        // required
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              x
                              label={<FormattedLabel id="toDate" />}
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
                      {/* <FormHelperText>
                        {errors?.shiftStartTime
                          ? errors.shiftStartTime.message
                          : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      style={{ marginTop: 10 }}
                      // error={!!errors.shiftStartTime}
                      sx={{ width: "75%" }}
                    >
                      <Controller
                        control={control}
                        name="dateOfApplication"
                        // required
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<FormattedLabel id="dateOfApplication" />}
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
                      {/* <FormHelperText>
                        {errors?.shiftStartTime
                          ? errors.shiftStartTime.message
                          : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={11} className={styles.feildres}>
                    <TextField
                      multiline
                      fullWidth
                      maxRows={4}
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="Remark"
                      label={<FormattedLabel id="remark" />}
                      variant="standard"
                      {...register("remark")}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                    />
                  </Grid>
                </Grid>
                <br />
                <br />
                <br />
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "5px",
                        paddingLeft: 10,
                      }}
                    >
                      {<FormattedLabel id="documentUpload" />}
                    </h3>
                  </div>
                </div>
                <br />
                <br />

                <Grid item xs={4}>
                  <Typography>
                    <FormattedLabel id="documentsUpload" />
                  </Typography>
                  <UploadButton
                    Change={(e) => {
                      handleFile1(e, "documentsUpload");
                    }}
                    {...register("documentName")}
                  />
                </Grid>
                <br />
                <br />
                <br />

                <Grid container className={styles.feildres} spacing={2}>
                  <Grid item>
                    <Button
                      type="submit"
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText == "Update" ? (
                        "Update"
                      ) : (
                        <FormattedLabel id="save" />
                      )}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      {<FormattedLabel id="clear" />}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<ExitToAppIcon />}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/FireBrigadeSystem/transactions/renewalOfBusinessNoc",
                        })
                      }
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default Form;
