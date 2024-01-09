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
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

// import schema from "../../../../containers/schema/fireBrigadeSystem/sanctionLetterReport";
import schema from "../../../../containers/schema/fireBrigadeSystem/sanctionLetterReport";
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
  // Fetch User From cfc User (Optional)
  const [userLst, setUserLst] = useState([]);

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
                        "/FireBrigadeSystem/transactions/sanctionLetter",
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
                {btnSaveText == "Update" ? (
                  <FormattedLabel id="sanctionLetterUpdate" />
                ) : (
                  <FormattedLabel id="sanctionLetter" />
                )}
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
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="sanctionLetter" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size="small"
                      autoFocus
                      id="outlined-basic"
                      label={<FormattedLabel id="applicationNo" />}
                      variant="outlined"
                      {...register("applicationNo")}
                      error={!!errors.applicationNo}
                      helperText={
                        errors?.applicationNo
                          ? errors.applicationNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={1} className={styles.feildres}>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      // onClick={getNOcDataOnSearch}
                    >
                      <FormattedLabel id="search" />
                      {/* Search */}
                    </Button>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={3}
                >
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size='small'
                      id='outlined-basic'
                      label={<FormattedLabel id='corporationName' />}
                      variant='outlined'
                      {...register("corporationName")}
                      error={!!errors.corporationName}
                      helperText={
                        errors?.corporationName
                          ? errors.corporationName.message
                          : null
                      }
                    />
                  </Grid> */}
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField sx={{width: "100%", backgroundColor: "white" }} size="small" sx=
                      id="outlined-basic"
                      label={<FormattedLabel id="corporationLogo" />}
                      variant="outlined"
                      {...register("corporationLogo")}
                      error={!!errors.corporationLogo}
                      helperText={
                        errors?.corporationLogo
                          ? errors.corporationLogo.message
                          : null
                      }
                    />
                  </Grid> */}
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField sx={{width: "100%", backgroundColor: "white" }} size="small"
                      autoFocus
                      id="outlined-basic"
                      label={<FormattedLabel id="departmentLogo" />}
                      variant="outlined"
                      {...register("departmentLogo")}
                      error={!!errors.departmentLogo}
                      helperText={
                        errors?.departmentLogo
                          ? errors.departmentLogo.message
                          : null
                      }
                    />
                  </Grid> */}
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size='small'
                      id='outlined-basic'
                      label={<FormattedLabel id='applicationNo' />}
                      variant='outlined'
                      {...register("applicationNo")}
                      error={!!errors.applicationNo}
                      helperText={
                        errors?.applicationNo
                          ? errors.applicationNo.message
                          : null
                      }
                    />
                  </Grid> */}
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ width: "100%" }}
                      style={{ marginTop: 10 }}
                      error={!!errors.applicationDate}
                    >
                      <Controller
                        control={control}
                        name="applicationDate"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              required
                              inputFormat="YYYY-DD-MM"
                              label={<FormattedLabel id="applicationDate" />}
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-DD-MM")
                                )
                              }
                              selected={field.value}
                              onError={
                                errors?.DateOfIncident
                                  ? errors.DateOfIncident.message
                                  : null
                              }
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "100%",
                                    backgroundColor: "white",
                                  }}
                                  size="small"
                                  variant="outlined"
                                  {...params}
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ width: "100%" }}
                      style={{ marginTop: 10 }}
                      error={!!errors.sanctionDate}
                    >
                      <Controller
                        control={control}
                        name="sanctionDate"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              required
                              inputFormat="YYYY-DD-MM"
                              label={<FormattedLabel id="sanctionDate" />}
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-DD-MM")
                                )
                              }
                              selected={field.value}
                              onError={
                                errors?.DateOfIncident
                                  ? errors.DateOfIncident.message
                                  : null
                              }
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "100%",
                                    backgroundColor: "white",
                                  }}
                                  size="small"
                                  variant="outlined"
                                  {...params}
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ width: "100%" }}
                      style={{ marginTop: 10 }}
                      error={!!errors.receiptDate}
                    >
                      <Controller
                        control={control}
                        name="receiptDate"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              required
                              inputFormat="YYYY-DD-MM"
                              label={<FormattedLabel id="receiptDate" />}
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-DD-MM")
                                )
                              }
                              selected={field.value}
                              onError={
                                errors?.DateOfIncident
                                  ? errors.DateOfIncident.message
                                  : null
                              }
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "100%",
                                    backgroundColor: "white",
                                  }}
                                  size="small"
                                  variant="outlined"
                                  {...params}
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size="small"
                      id="outlined-basic"
                      label={<FormattedLabel id="receiptNo" />}
                      variant="outlined"
                      {...register("receiptNo")}
                      error={!!errors.receiptNo}
                      helperText={
                        errors?.receiptNo ? errors.receiptNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size="small"
                      id="outlined-basic"
                      label={<FormattedLabel id="nameOfNoc" />}
                      variant="outlined"
                      {...register("nameOfNoc")}
                      error={!!errors.nameOfNoc}
                      helperText={
                        errors?.nameOfNoc ? errors.nameOfNoc.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size="small"
                      id="outlined-basic"
                      label={<FormattedLabel id="addressDeatils" />}
                      variant="outlined"
                      {...register("addressDeatils")}
                      error={!!errors.addressDeatils}
                      helperText={
                        errors?.addressDeatils
                          ? errors.addressDeatils.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size="small"
                      id="outlined-basic"
                      label={<FormattedLabel id="buildingDetails" />}
                      variant="outlined"
                      {...register("buildingDetails")}
                      error={!!errors.buildingDetails}
                      helperText={
                        errors?.buildingDetails
                          ? errors.buildingDetails.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size="small"
                      id="outlined-basic"
                      label={<FormattedLabel id="proposedSiteAddress" />}
                      variant="outlined"
                      {...register("proposedSiteAddress")}
                      error={!!errors.proposedSiteAddress}
                      helperText={
                        errors?.proposedSiteAddress
                          ? errors.proposedSiteAddress.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "100%", backgroundColor: "white" }}
                      size="small"
                      id="outlined-basic"
                      label={<FormattedLabel id="plotDetails" />}
                      variant="outlined"
                      {...register("plotDetails")}
                      error={!!errors.plotDetails}
                      helperText={
                        errors?.plotDetails ? errors.plotDetails.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={2} className={styles.feildres}>
                    <FormControl sx={{ marginTop: 3 }}>
                      <FormLabel id="demo-radio-buttons-group-label">
                        {<FormattedLabel id="termAndCondition" />}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="yes"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={5} className={styles.feildres}></Grid>
                  <Grid item xs={5} className={styles.feildres}></Grid>
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant='outlined'
                      sx={{ width: "50%" }}
                      error={!!errors.crPincode}
                    >
                      <InputLabel id='demo-simple-select-outlined-label'>
                        <FormattedLabel id='conditions' />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label='Pin Code'
                          >
                       
                          </Select>
                        )}
                        name='pinCode'
                        control={control}
                        defaultValue=''
                      />
                      <FormHelperText>
                        {errors?.pinCode ? errors.pinCode.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}
                </Grid>
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
                            "/FireBrigadeSystem/transactions/sanctionLetter",
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
