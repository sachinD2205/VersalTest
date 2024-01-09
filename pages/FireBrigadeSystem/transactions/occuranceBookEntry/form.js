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

import schema from "../../../../containers/schema/fireBrigadeSystem/occuranceBookEntryReport";
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

  useEffect(() => {
    getUser();
    getVardiTypes();
    getFireStationName();
  }, []);

  // get employee from cfc
  const getUser = () => {
    axios.get(`${urls.CFCURL}/master/user/getAll`).then((res) => {
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
                        "/FireBrigadeSystem/transactions/occuranceBookEntry",
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
                <FormattedLabel id="occuranceBookEntry" />
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
                      {<FormattedLabel id="informerDetails" />}
                    </h3>
                  </div>
                </div>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="informerName" />}
                      variant="standard"
                      {...register("informerName")}
                      error={!!errors.informerName}
                      helperText={
                        errors?.informerName
                          ? errors.informerName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="informerMiddleName" />}
                      variant="standard"
                      {...register("informerMiddleName")}
                      error={!!errors.informerMiddleName}
                      helperText={
                        errors?.informerMiddleName
                          ? errors.informerMiddleName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="informerLastName" />}
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
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="informerNameMr" />}
                      variant="standard"
                      {...register("informerNameMr")}
                      error={!!errors.informerNameMr}
                      helperText={
                        errors?.informerNameMr
                          ? errors.informerNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="informerMiddleNameMr" />}
                      variant="standard"
                      {...register("informerMiddleNameMr")}
                      error={!!errors.informerMiddleNameMr}
                      helperText={
                        errors?.informerMiddleNameMr
                          ? errors.informerMiddleNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="informerLastNameMr" />}
                      variant="standard"
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
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
                      label={<FormattedLabel id="area" />}
                      variant="standard"
                      {...register("area")}
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="city" />}
                      variant="standard"
                      {...register("city")}
                      error={!!errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant="standard"
                      sx={{ width: "65%" }}
                      error={!!errors.crPincode}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Pin Code
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Pin Code"
                          >
                            {/* {crPincodes &&
                              crPincodes.map((crPincode, index) => (
                                <MenuItem key={index} value={crPincode.id}>
                                  {crPincode.crPincode}
                                </MenuItem>
                              ))} */}
                          </Select>
                        )}
                        name="pinCode"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.pinCode ? errors.pinCode.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="areaMr" />}
                      variant="standard"
                      {...register("areaMr")}
                      error={!!errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="cityMr" />}
                      variant="standard"
                      {...register("cityMr")}
                      error={!!errors.cityMr}
                      helperText={errors?.cityMr ? errors.cityMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="contactNumber" />}
                      variant="standard"
                      {...register("contactNumber")}
                      error={!!errors.contactNumber}
                      helperText={
                        errors?.contactNumber
                          ? errors.contactNumber.message
                          : null
                      }
                    />
                  </Grid>
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
                            "/FireBrigadeSystem/transactions/emergencyService",
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
