import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../../URLS/urls";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/fireBrigadeSystem/fireAttendanceCertificateReport";
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
  const [applicationNo, setApplicationNo] = useState();
  const [applicationList, setApplicationList] = useState([]);

  useEffect(() => {
    getUser();
    getVardiTypes();
    getFireStationName();
    getApplicationNo();
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
        `${urls.BaseURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`,
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
      .get(`${urls.BaseURL}/vardiTypeMaster/getVardiTypeMasterData`, {
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
    console.log("form datta", finalBody);
    axios
      .post(`${urls.BaseURL}/transaction/trnFireAttendance/save`, finalBody, {
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
      // id,
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

  const getApplicationNo = () => {
    axios
      .get(`${urls.BaseURL}/transaction/provisionalBuildingFireNOC/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("dattaaa", res.data);
        setApplicationList(res.data.provisionBuilding);
      });
  };

  const getDataOnSearch = () => {
    console.log("application dta ", applicationList, applicationNo);
    applicationList.filter((item) => {
      if (
        applicationNo &&
        item.id &&
        item.id.toString().includes(applicationNo.toString())
      ) {
        console.log("application dta", item);
        reset({
          applicationDate: item.applicationDate,
        });
        // reset({
        //   applicantName: item.applicantName,
        //   applicantMiddleName: item.applicantMiddleName,
        //   applicantLastName: item.applicantLastName,
        //   applicantNameMr: item.applicantNameMr,
        //   applicantMiddleNameMr: item.applicantMiddleNameMr,
        //   applicantLastNameMr: item.applicantLastNameMr,
        //   applicantAddress: item.applicantAddress,
        //   bussinessAddress: item.bussinessAddress,
        //   mobileNo: item.mobileNo,
        //   applicantAddressMr: item.applicantAddressMr,
        //   bussinessAddressMr: item.bussinessAddressMr,
        //   // ------------------------------------------
        //   remark: item.remark,
        //   typeOfBussiness: item.typeOfBussiness,
        //   approveDate: item.approveDate,
        //   fromDate: item.fromDate,
        //   toDate: item.toDate,
        //   dateOfApplication: item.dateOfApplication
        // })
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
                        "/FireBrigadeSystem/transactions/fireAttendanceCertificate",
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
                  <FormattedLabel id="fireAttendanceCertificateUpdate" />
                ) : (
                  <FormattedLabel id="fireAttendanceCertificate" />
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
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "5px",
                        paddingLeft: 10,
                      }}
                    >
                      {<FormattedLabel id="fireAttendanceCertificate" />}
                    </h3>
                  </div>
                </div>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      autoFocus
                      id="standard-basic"
                      label={<FormattedLabel id="applicationNo" />}
                      variant="standard"
                      {...register("applicationNo")}
                      error={!!errors.applicationNo}
                      helperText={
                        errors?.applicationNo
                          ? errors.applicationNo.message
                          : null
                      }
                    /> */}

                    <FormControl
                      fullWidth
                      variant="standard"
                      // sx={{ pr: 13 }}
                      error={!!errors.businessType}
                      {...register("applicationNo")}
                    >
                      <Select
                        sx={{ width: 185 }}
                        value={applicationNo}
                        onChange={(e) => {
                          console.log(e.target.value);
                          setApplicationNo(e.target.value);
                        }}
                        label={<FormattedLabel id="applicationNo" />}
                        // {...register("applicationNo")}
                      >
                        {applicationList &&
                          applicationList.map((item, index) => (
                            // item.nOCFor &&
                            <MenuItem key={index} value={item.id}>
                              {item.id}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    <Grid item xs={1} className={styles.feildres}>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        onClick={getDataOnSearch}
                      >
                        <FormattedLabel id="search" />
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="corporationName" />}
                      variant="standard"
                      {...register("corporationName")}
                      error={!!errors.informerName}
                      helperText={
                        errors?.informerName
                          ? errors.informerName.message
                          : null
                      }
                    />
                  </Grid>
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="corporationLogo" />}
                      variant="standard"
                      {...register("corporationLogo")}
                      error={!!errors.corporationLogo}
                      helperText={
                        errors?.corporationLogo
                          ? errors.corporationLogo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="departmentLogo" />}
                      variant="standard"
                      {...register("informerLastName")}
                      error={!!errors.informerLastName}
                      helperText={
                        errors?.informerLastName
                          ? errors.informerLastName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="applicationNo" />}
                      variant="standard"
                      {...register("informerNameMr")}
                      error={!!errors.informerNameMr}
                      helperText={
                        errors?.informerNameMr
                          ? errors.informerNameMr.message
                          : null
                      }
                    />
                  </Grid> */}
                  <Grid
                    item
                    xs={4}
                    className={styles.feildres}
                    style={{ width: "500px" }}
                  >
                    {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        renderInput={(props) => <TextField {...props} />}
                        label={<FormattedLabel id="applicationDate" />}
                        // value={field.value}
                        {...register("applicationDate")}
                        onChange={(date) =>
                          field.onChange(
                            moment(date).format("YYYY-MM-DD")
                          )
                        }
                      />
                    </LocalizationProvider> */}
                    <FormControl
                      style={{ marginTop: 10 }}
                      error={!!errors.dateOfApplication}
                      sx={{ width: "65%" }}
                    >
                      <Controller
                        control={control}
                        name="applicationDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="YYYY-MM-DD"
                              label={<FormattedLabel id="applicationDate" />}
                              {...register("applicationDate")}
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
                                      shrink: true,
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
                      style={{ marginTop: 10 }}
                      error={!!errors.dateOfApplication}
                      sx={{ width: "65%" }}
                    >
                      <Controller
                        control={control}
                        name="sanctionDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              required
                              inputFormat="YYYY-MM-DD"
                              label={<FormattedLabel id="sanctionDate" />}
                              {...register("sanctionDate")}
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
                                      shrink: true,
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </FormControl>
                    {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                     

                      <DatePicker
                        renderInput={(props) => <TextField {...props} />}
                        label={<FormattedLabel id="sanctionDate" />}
                        // value={field.value}
                        {...register("sanctionDate")}
                        onChange={(date) =>
                          field.onChange(
                            moment(date).format("YYYY-MM-DD")
                          )
                        }
                      />
                    </LocalizationProvider> */}
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="proposedSiteAddress" />}
                      variant="standard"
                      {...register("proposedSiteAddress")}
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="plotDetails" />}
                      variant="standard"
                      {...register("plotDetails")}
                      error={!!errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="buildingDetails" />}
                      variant="standard"
                      {...register("buildingDetails")}
                      error={!!errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="conditions" />}
                      variant="standard"
                      {...register("conditions")}
                      error={!!errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
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
                            "/FireBrigadeSystem/transactions/fireAttendanceCertificate",
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
