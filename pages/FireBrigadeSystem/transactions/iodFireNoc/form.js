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

import schema from "../../../../containers/schema/fireBrigadeSystem/iodFireNocReport";
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
import UploadButton from "../../../../components/fireBrigadeSystem/UploadButton";
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

  const [businessTypes, setBusinessTypes] = useState([]);

  // get Business Types
  const getBusinessTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBusinessTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };

  const onSubmitForm = (fromData) => {
    // const finalBody = {
    //   ...fromData,
    //   activeFlag: "Y",
    // };
    const finalBody = {
      ...fromData,
      dateOfApplication: moment(fromData.dateOfApplication).format(
        "YYYY-MM-DD"
      ),
    };
    console.log("Form Data of iod", finalBody);

    axios
      .post(`${urls.FbsURL}/trnIODFireNOC/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // setButtonInputState(false);

          router.back();
          // setFetchData(tempData);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
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
                      pathname: "/FireBrigadeSystem/transactions/iodFireNoc",
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
                  <FormattedLabel id="iodFireNocUpdate" />
                ) : (
                  <FormattedLabel id="iodFireNoc" />
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
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
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
                    <TextField
                      id="standard-basic"
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
                      label={<FormattedLabel id="applicantNameMr" />}
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
                      label={<FormattedLabel id="bussinessAddress" />}
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
                      label={<FormattedLabel id="bussinessAddressMr" />}
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
                      style={{ marginTop: 10 }}
                      error={!!errors.dateOfApplication}
                      sx={{ width: "65%" }}
                    >
                      <Controller
                        control={control}
                        name="dateOfApplication"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              readOnly
                              requried
                              inputFormat="DD/MM/YYYY"
                              label={<FormattedLabel id="dateOfApplication" />}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              // onChange={(date) =>
                              //   field.onChange(
                              //     moment(date).format("yyyy-MM-dd")
                              //   )
                              // }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField size="small" {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.dateOfApplication
                          ? errors.dateOfApplication.message
                          : null}
                      </FormHelperText>
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
                      variant="standard"
                      sx={{ width: "65%" }}
                      error={!!errors.typeOfBussiness}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="typeOfBussiness" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="List"
                          >
                            {businessTypes &&
                              businessTypes.map((businessType, index) => (
                                <MenuItem key={index} value={businessType.id}>
                                  {language == "en"
                                    ? businessType.typeOfBusiness
                                    : businessType.typeOfBusinessMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="typeOfBussiness"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfBussiness
                          ? errors.typeOfBussiness.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  {/* <Grid item xs={11} className={styles.feildres}>
                    <TextField
                      multiline
                      fullWidth
                      maxRows={4}
                      id="standard-basic"
                      label={<FormattedLabel id="remark" />}
                      variant="standard"
                      {...register("remark")}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                    />
                  </Grid> */}
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
                    {<FormattedLabel id="documentUpload" />}
                  </Typography>
                  <UploadButton
                    Change={(e) => {
                      handleFile1(e, "documentsUpload");
                    }}
                    {...register("documentsUpload")}
                  />
                </Grid>
                <br />
                <br />
                <br />
                {/* Fetch User From cfc User (Optional)*/}
                {/* <div>
                      <FormControl
                        variant="standard"
                             sx={{ minWidth: "70%" }}
                        error={!!errors.typeOfVardiId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="slipHandedOverTo" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="slipHandedOverTo" />}
                            >
                              {userLst &&
                                userLst.map((user, index) => (
                                  <MenuItem key={index} value={user.firstName}>
                                    {user.firstName +
                                      " " +
                                      (typeof user.middleName === "string"
                                        ? user.middleName + " "
                                        : " ") +
                                      user.lastName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="slipHandedOverTo"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.slipHandedOverTo
                            ? errors.slipHandedOverTo.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div> */}

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
                            "/FireBrigadeSystem/transactions/businessNoc",
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
