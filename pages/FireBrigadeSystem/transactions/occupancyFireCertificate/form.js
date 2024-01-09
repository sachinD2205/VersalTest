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

import schema from "../../../../containers/schema/fireBrigadeSystem/occupancyFireCertificateReport";
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
  // Fetch User From cfc User (Optional)
  const [userLst, setUserLst] = useState([]);
  const [nocTypeList, setNocTypeList] = useState([]);
  const [nocNo, setNocNO] = useState();

  useEffect(() => {
    getUser();
    getVardiTypes();
    getFireStationName();
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
      dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
        "YYYY-DD-MMThh:mm:ss"
      ),
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/trnEmergencyServices/saveTrnEmergencyServices`,
        finalBody,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          // setFetchData(tempData);

          router.back();
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query);
      setBtnSaveText("Update");
      reset(router.query);
    }
    getNOcData();
  }, []);

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

  const getNOcDataOnSearch = () => {
    console.log("nocccc dta", nocNo);

    nocTypeList.filter((item) => {
      if (nocNo && item.id && item.id.toString().includes(nocNo.toString())) {
        console.log("nocccc dta", item);
        reset(item);
      }
    });
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      // id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    applicantName: "",
    applicationDate: "",
    officeContactNo: "",
    personMobileNo: "",
    emailId: "",
    appliedFor: "",
    applicantName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    applicantContactNo: "",
    siteAddress: "",
    FinalPlotNoFP: "",
    applicantContactNo: "",
    RevenueSurveyNoRS: "",
    BuildingLocation: "",
    townPlanningNo: "",
    blockNo: "",
    OPNo: "",
    citySurveyNo: "",
    typeofBuilding: "",
    residentialUse: "",
    commercialUse: "",
    NOCFor: "",
    buildingHeight: "",
    noOfBasement: "",
    totalBuilding: "",
    basementArea: "",
    noOfVentilation: "",
    noOfTowers: "",
    plotArea: "",
    construction: "",
    noOfApprochedRoad: "",
    drawingProvided: "",
    siteAddressWithName: "",
    highTensionLineMac: "",
    areaZone: "",
    fireNocTaken: "",
    underTheGroundWaterTank: "",
    l: "",
    b: "",
    h: "",
    volumeLBHIn: "",
    approvedMap: "",
    overHeadWaterTank: "",
    l: "",
    b: "",
    h: "",
    volumeLBHIn: "",
    OverHearWaterTank: "",
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
                        "/FireBrigadeSystem/transactions/occupancyFireCertificate",
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
                {/* {btnSaveText == "Update" ? (
                  <FormattedLabel id="emergencyServicesUpdate" />
                ) : (
                  <FormattedLabel id="emergencyServices" />
                )} */}
                <FormattedLabel id="occupancyFireCertificate" />
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
                      {/* Occupancy Fire Certificate */}
                      {<FormattedLabel id="occupancyFireCertificate" />}
                    </h3>
                  </div>
                </div>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={1} className={styles.feildres}></Grid>
                  <Grid item xs={3} className={styles.feildres}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      // sx={{ pr: 13 }}
                      error={!!errors.businessType}
                    >
                      {/* <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="finalFireNOCNumber" />}
                      </InputLabel> */}
                      <Select
                        sx={{ width: 185 }}
                        value={nocNo}
                        onChange={(e) => {
                          console.log(e.target.value);
                          setNocNO(e.target.value);
                        }}
                        label={<FormattedLabel id="finalFireNOCNumber" />}
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
                  <Grid item xs={3} className={styles.feildres}>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      onClick={getNOcDataOnSearch}
                    >
                      <FormattedLabel id="search" />
                      {/* Search */}
                    </Button>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantName" />}
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
                    <FormControl
                      style={{ marginTop: 10 }}
                      // error={!!errors.dateAndTimeOfVardi}
                    >
                      <Controller
                        control={control}
                        // required
                        defaultValue={moment().format("YYYY-DD-MMThh:mm:ss")}
                        name="applicationDate"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              // label='Application Date *'
                              label={<FormattedLabel id="applicationDate" />}
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-DD-MM hh:mm:ss")
                                )
                              }
                              //selected={field.value}
                              renderInput={(params) => (
                                <TextField size="small" {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      {/* <FormHelperText>
                        {errors?.DateOfIncident
                          ? errors.DateOfIncident.message
                          : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      label={<FormattedLabel id="officeContactNo" />}
                      variant="standard"
                      {...register("officeContactNo")}
                      error={!!errors.officeContactNo}
                      helperText={
                        errors?.officeContactNo
                          ? errors.officeContactNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="working site Onsite person Mobile No"
                      label={<FormattedLabel id="personMobileNo" />}
                      variant="standard"
                      {...register("personMobileNo")}
                      error={!!errors.personMobileNo}
                      helperText={
                        errors?.personMobileNo
                          ? errors.personMobileNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="Email Id *"
                      label={<FormattedLabel id="emailId" />}
                      variant="standard"
                      {...register("emailId")}
                      error={!!errors.emailId}
                      helperText={
                        errors?.emailId ? errors.emailId.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      sx={{ ml: 13 }}
                      error={!!errors.businessType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="appliedFor" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 185 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="appliedFor" />}
                            // label="Applied For *"
                          >
                            {/* {businessTypes &&
                            businessTypes.map((businessType, index) => (
                              <MenuItem key={index} value={businessType.id}>
                                {businessType.businessType}
                              </MenuItem>
                            ))} */}
                          </Select>
                        )}
                        name="areaZone"
                        control={control}
                        defaultValue=""
                      />
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="architectNameMr" />}
                      variant="standard"
                      {...register("architectNameMr")}
                      error={!!errors.architectNameMr}
                      helperText={
                        errors?.architectNameMr
                          ? errors.architectNameMr.message
                          : null
                      }
                    />
                  </Grid> */}

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="architectNameMr" />}
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("architectNameMr")}
                      error={!!errors.architectNameMr}
                      helperText={
                        errors?.architectNameMr
                          ? errors.architectNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="architectFirmName" />}
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("architectFirmName")}
                      error={!!errors.architectFirmName}
                      helperText={
                        errors?.architectFirmName
                          ? errors.architectFirmName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="architectRegistrationNo" />}
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("architectRegistrationNo")}
                      error={!!errors.architectRegistrationNo}
                      helperText={
                        errors?.architectRegistrationNo
                          ? errors.architectRegistrationNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="applicantPermanentAddress" />}
                      variant="standard"
                      {...register("applicantPermanentAddress")}
                      error={!!errors.applicantPermanentAddress}
                      helperText={
                        errors?.applicantPermanentAddress
                          ? errors.applicantPermanentAddress.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="siteAddress" />}
                      variant="standard"
                      {...register("siteAddress")}
                      error={!!errors.siteAddress}
                      helperText={
                        errors?.siteAddress ? errors.siteAddress.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="applicantContactNo" />}
                      variant="standard"
                      {...register("applicantContactNo")}
                      error={!!errors.applicantContactNo}
                      helperText={
                        errors?.applicantContactNo
                          ? errors.applicantContactNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="FinalPlotNoFP" />}
                      variant="standard"
                      {...register("FinalPlotNoFP")}
                      error={!!errors.FinalPlotNoFP}
                      helperText={
                        errors?.FinalPlotNoFP
                          ? errors.FinalPlotNoFP.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="RevenueSurveyNoRS" />}
                      variant="standard"
                      {...register("RevenueSurveyNoRS")}
                      error={!!errors.RevenueSurveyNoRS}
                      helperText={
                        errors?.RevenueSurveyNoRS
                          ? errors.RevenueSurveyNoRS.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="BuildingLocation" />}
                      variant="standard"
                      {...register("BuildingLocation")}
                      error={!!errors.BuildingLocation}
                      helperText={
                        errors?.BuildingLocation
                          ? errors.BuildingLocation.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="townPlanningNo" />}
                      variant="standard"
                      {...register("townPlanningNo")}
                      error={!!errors.townPlanningNo}
                      helperText={
                        errors?.townPlanningNo
                          ? errors.townPlanningNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="blockNo" />}
                      variant="standard"
                      {...register("blockNo")}
                      error={!!errors.blockNo}
                      helperText={
                        errors?.blockNo ? errors.blockNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="OPNo" />}
                      variant="standard"
                      {...register("OPNo")}
                      error={!!errors.OPNo}
                      helperText={errors?.OPNo ? errors.OPNo.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="citySurveyNo" />}
                      variant="standard"
                      {...register("citySurveyNo")}
                      error={!!errors.citySurveyNo}
                      helperText={
                        errors?.citySurveyNo
                          ? errors.citySurveyNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="typeofBuilding" />}
                      variant="standard"
                      {...register("typeofBuilding")}
                      error={!!errors.typeofBuilding}
                      helperText={
                        errors?.typeofBuilding
                          ? errors.typeofBuilding.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="residentialUse" />}
                      variant="standard"
                      {...register("residentialUse")}
                      error={!!errors.residentialUse}
                      helperText={
                        errors?.residentialUse
                          ? errors.residentialUse.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="commercialUse" />}
                      variant="standard"
                      {...register("commercialUse")}
                      error={!!errors.commercialUse}
                      helperText={
                        errors?.commercialUse
                          ? errors.commercialUse.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="NOCFor" />}
                      variant="standard"
                      {...register("NOCFor")}
                      error={!!errors.NOCFor}
                      helperText={errors?.NOCFor ? errors.NOCFor.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="buildingHeight" />}
                      variant="standard"
                      {...register("buildingHeight")}
                      error={!!errors.buildingHeight}
                      helperText={
                        errors?.buildingHeight
                          ? errors.buildingHeight.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="noOfBasement" />}
                      variant="standard"
                      {...register("noOfBasement")}
                      error={!!errors.noOfBasement}
                      helperText={
                        errors?.noOfBasement
                          ? errors.noOfBasement.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="Total Building Floor (G+) *"
                      label={<FormattedLabel id="totalBuilding" />}
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      {...register("totalBuilding")}
                      error={!!errors.totalBuilding}
                      helperText={
                        errors?.totalBuilding
                          ? errors.totalBuilding.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="Basement Area in square Meter *"
                      label={<FormattedLabel id="basementArea" />}
                      variant="standard"
                      {...register("basementArea")}
                      error={!!errors.basementArea}
                      helperText={
                        errors?.basementArea
                          ? errors.basementArea.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="No of Ventilation *"
                      label={<FormattedLabel id="noOfVentilation" />}
                      variant="standard"
                      {...register("noOfVentilation")}
                      error={!!errors.noOfVentilation}
                      helperText={
                        errors?.noOfVentilation
                          ? errors.noOfVentilation.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="No of Towers *"
                      label={<FormattedLabel id="noOfTowers" />}
                      variant="standard"
                      {...register("noOfTowers")}
                      error={!!errors.noOfTowers}
                      helperText={
                        errors?.noOfTowers ? errors.noOfTowers.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Plot area square Meter *"
                      label={<FormattedLabel id="plotArea" />}
                      variant="standard"
                      {...register("plotArea")}
                      error={!!errors.plotArea}
                      helperText={
                        errors?.plotArea ? errors.plotArea.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="construction are sq meter *"
                      label={<FormattedLabel id="construction" />}
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("construction")}
                      error={!!errors.construction}
                      helperText={
                        errors?.construction
                          ? errors.construction.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="No of Approched road *"
                      label={<FormattedLabel id="noOfApprochedRoad" />}
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      {...register("noOfApprochedRoad")}
                      error={!!errors.noOfApprochedRoad}
                      helperText={
                        errors?.noOfApprochedRoad
                          ? errors.noOfApprochedRoad.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Drawing Provided *"
                      label={<FormattedLabel id="drawingProvided" />}
                      variant="standard"
                      {...register("drawingProvided")}
                      error={!!errors.drawingProvided}
                      helperText={
                        errors?.drawingProvided
                          ? errors.drawingProvided.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Site Address (with Building Name) *"
                      label={<FormattedLabel id="siteAddressWithName" />}
                      variant="standard"
                      {...register("siteAddressWithName")}
                      error={!!errors.siteAddressWithName}
                      helperText={
                        errors?.siteAddressWithName
                          ? errors.siteAddressWithName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="High Tension Line, Mac Grid Channel Railway Crossing information *"
                      label={<FormattedLabel id="highTensionLineMac" />}
                      variant="standard"
                      {...register("highTensionLineMac")}
                      error={!!errors.highTensionLineMac}
                      helperText={
                        errors?.highTensionLineMac
                          ? errors.highTensionLineMac.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Area Zone *"
                      label={<FormattedLabel id="areaZone" />}
                      variant="standard"
                      {...register("areaZone")}
                      error={!!errors.areaZone}
                      helperText={
                        errors?.areaZone ? errors.areaZone.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Previously Any Fire Noc Taken *"
                      label={<FormattedLabel id="fireNocTaken" />}
                      variant="standard"
                      {...register("fireNocTaken")}
                      error={!!errors.fireNocTaken}
                      helperText={
                        errors?.fireNocTaken
                          ? errors.fireNocTaken.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Under the Ground water Tank capacity Lighter *"
                      label={<FormattedLabel id="underTheGroundWaterTank" />}
                      variant="standard"
                      {...register("underTheGroundWaterTank")}
                      error={!!errors.underTheGroundWaterTank}
                      helperText={
                        errors?.underTheGroundWaterTank
                          ? errors.underTheGroundWaterTank.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="L *"
                      label={<FormattedLabel id="l" />}
                      variant="standard"
                      {...register("l")}
                      error={!!errors.l}
                      helperText={errors?.l ? errors.l.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="B *"
                      label={<FormattedLabel id="b" />}
                      variant="standard"
                      {...register("b")}
                      error={!!errors.b}
                      helperText={errors?.b ? errors.b.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="H *"
                      label={<FormattedLabel id="h" />}
                      variant="standard"
                      {...register("h")}
                      error={!!errors.h}
                      helperText={errors?.h ? errors.h.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="Volume LBH in (M³) *"
                      label={<FormattedLabel id="volumeLBH" />}
                      variant="standard"
                      {...register("volumeLBHIn")}
                      error={!!errors.volumeLBHIn}
                      helperText={
                        errors?.volumeLBHIn ? errors.volumeLBHIn.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Approved map of Underground water Tank *"
                      label={<FormattedLabel id="approvedMap" />}
                      variant="standard"
                      {...register("approvedMap")}
                      error={!!errors.approvedMap}
                      helperText={
                        errors?.approvedMap ? errors.approvedMap.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Over head water Tank Capacity in Liter *"
                      label={<FormattedLabel id="overHeadWaterTank" />}
                      variant="standard"
                      {...register("overHeadWaterTank")}
                      error={!!errors.overHeadWaterTank}
                      helperText={
                        errors?.overHeadWaterTank
                          ? errors.overHeadWaterTank.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="L *"
                      label={<FormattedLabel id="l" />}
                      variant="standard"
                      {...register("l")}
                      error={!!errors.l}
                      helperText={errors?.l ? errors.l.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="B *"
                      label={<FormattedLabel id="b" />}
                      variant="standard"
                      {...register("b")}
                      error={!!errors.b}
                      helperText={errors?.b ? errors.b.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="H *"
                      label={<FormattedLabel id="h" />}
                      variant="standard"
                      {...register("h")}
                      error={!!errors.h}
                      helperText={errors?.h ? errors.h.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      // label="Volume LBH in (M³) *"
                      label={<FormattedLabel id="volumeLBH" />}
                      variant="standard"
                      {...register("volumeLBHIn")}
                      error={!!errors.volumeLBHIn}
                      helperText={
                        errors?.volumeLBHIn ? errors.volumeLBHIn.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      // label="Over Hear water Tank co approved Maps *"
                      label={<FormattedLabel id="OverHearWaterTank" />}
                      variant="standard"
                      {...register("OverHearWaterTank")}
                      error={!!errors.OverHearWaterTank}
                      helperText={
                        errors?.OverHearWaterTank
                          ? errors.OverHearWaterTank.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
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
                            "/FireBrigadeSystem/transactions/occupancyFireCertificate",
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
