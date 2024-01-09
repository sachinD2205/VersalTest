import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
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
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import styles from "../styles/SiteVisit.module.css";
import urls from "../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(),
    // mode: "onChange",
  });

  const userToken = useGetToken();

  const [value, setValuee] = useState(null);
  const [usageTypes, setUsageTypes] = useState([]);
  const [usageSubTypes, setUsageSubTypes] = useState([]);
  const [constructionTypes, setConstructionTypes] = useState([]);

  const gettingAllUsageType = () => {
    axios
      .get(`${urls.PTAXURL}/master/usageType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setUsageTypes(
          res.data?.usageType.map((r, i) => ({
            id: r.id,
            usageType: r.usageType,
            usageTypeMr: r.usageTypeMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Sub Usage Type

  const gettingAllSubUsageType = () => {
    axios
      .get(`${urls.PTAXURL}/master/subUsageType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setUsageSubTypes(
          res.data?.subUsageType.map((r, i) => ({
            id: r.id,
            subUsageType: r.subUsageType,
            subUsageTypeMr: r.subUsageTypeMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Construction Type

  const gettingAllConstructionType = () => {
    axios
      .get(`${urls.PTAXURL}/master/constructionType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setConstructionTypes(
          res.data?.constructionType.map((r, i) => ({
            id: r.id,
            constructionTypeName: r.constructionTypeName,
            constructionTypeNameMr: r.constructionTypeNameMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    online: "",
    cfc: "",
    applicationNo: "",
    surveyNo: "",
    blockNo: "",
    cityNo: "",
    sectorNo: "",
    parkingArea: "",
    usageType: "",
    usageSubType: "",
    annualRate: "",
    annualRvValue: "",
    initiationOfPropertyUsageDate: null,
    action: "",
    scheduleDate: null,
    scheduleTime: null,
    rescheduleDate: null,
    rescheduleTime: null,
    scheduleTokenNo: "",
    propertyStatus: "",
    remark: "",
    fromDate: null,
    toDate: null,
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };
  // Reset Values Exit
  const resetValuesExit = {
    online: "",
    cfc: "",
    applicationNo: "",
    surveyNo: "",
    blockNo: "",
    cityNo: "",
    sectorNo: "",
    parkingArea: "",
    usageType: "",
    usageSubType: "",
    annualRate: "",
    annualRvValue: "",
    initiationOfPropertyUsageDate: null,
    action: "",
    scheduleDate: null,
    scheduleTime: null,
    rescheduleDate: null,
    rescheduleTime: null,
    scheduleTokenNo: "",
    propertyStatus: "",
    remark: "",
    fromDate: null,
    toDate: null,
    id: null,
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
  };

  useEffect(() => {
    gettingAllUsageType();
    gettingAllSubUsageType();
    gettingAllConstructionType();
  }, []);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // const fromDate = new Date(formData.fromDate).toISOString();
    // const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // const declarationDate = moment(formData.declarationDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      // fromDate,
      // toDate,
      // declarationDate,
      ...formData,
      rescheduleTime: moment(formData.rescheduleTime).format("h:mm:ss"),
      scheduleTime: moment(formData.scheduleTime).format("h:mm:ss"),
    };
    console.log("100", formData.rescheduleTime);
    axios
      .post(`${urls.PTAXURL}/transaction/siteVisit/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  return (
    <div>
      <Paper
        sx={{
          backgroundColor: "#FFFFF",
        }}
        elevation={5}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              borderRadius: 100,
            }}
          >
            <strong>
              {/* <FormattedLabel id="propertyHolderDetails" /> */}
              Site Visit
            </strong>
          </Box>
        </Box>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid
              container
              style={{
                padding: "1%",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl sx={{ marginTop: 0 }} error={!!errors.fromDate}>
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>From Date</span>
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
                              autoFocus
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
                    {errors?.fromDate ? errors.fromDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl sx={{ marginTop: 0 }} error={!!errors.toDate}>
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={<span style={{ fontSize: 14 }}>To Date</span>}
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
                    {errors?.toDate ? errors.toDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl error={!!errors.Online} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Online *
                  </InputLabel>
                  <Controller
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Online *"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {/* {Onlines &&
                              Onlines.map((Online, index) => (
                                <MenuItem key={index} value={Online.id}>
                                  {Online.Online}
                                </MenuItem>
                              ))} */}
                        <MenuItem value="online">online</MenuItem>
                        <MenuItem value="online">online</MenuItem>
                        <MenuItem value="online">online</MenuItem>
                      </Select>
                    )}
                    name="online"
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.Online ? errors.Online.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl error={!!errors.CFC} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    CFC *
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="CFC *"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {/* {CFCs &&
                              CFCs.map((CFC, index) => (
                                <MenuItem key={index} value={CFC.id}>
                                  {CFC.CFC}
                                </MenuItem>
                              ))} */}

                        <MenuItem value="CFC">CFC</MenuItem>
                      </Select>
                    )}
                    name="cfc"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.Online ? errors.Online.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Application No *"
                  {...register("applicationNo")}
                  error={!!errors.applicationNo}
                  helperText={
                    errors?.applicationNo ? errors.applicationNo.message : null
                  }
                  defaultValue=""
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Survey No. *"
                  {...register("surveyNo")}
                  error={!!errors.surveyNo}
                  helperText={errors?.surveyNo ? errors.surveyNo.message : null}
                  defaultValue=""
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Block No. *"
                  {...register("blockNo")}
                  error={!!errors.blockNo}
                  helperText={errors?.blockNo ? errors.blockNo.message : null}
                  defaultValue=""
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="City No. *"
                  {...register("cityNo")}
                  error={!!errors.cityNo}
                  helperText={errors?.cityNo ? errors.cityNo.message : null}
                  defaultValue=""
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Sector No. *"
                  {...register("sectorNo")}
                  error={!!errors.sectorNo}
                  helperText={errors?.sectorNo ? errors.sectorNo.message : null}
                  defaultValue=""
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Parking Area. *"
                  {...register("parkingArea")}
                  error={!!errors.parkingArea}
                  helperText={
                    errors?.parkingArea ? errors.parkingArea.message : null
                  }
                  defaultValue=""
                />
              </Grid>

              {/* ....................................DropDown Fields...................... */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  error={!!errors.usageType}
                  style={{ width: "230px" }}
                >
                  <InputLabel>{<FormattedLabel id="usageType" />}</InputLabel>
                  <Controller
                    control={control}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={field.value}
                        // label="Financial Year"
                        label={<FormattedLabel id="usageType" />}
                        onChange={(value) => field.onChange(value)}
                        // style={{ height: 40, padding: "14px 14px" }}
                        variant="standard"
                      >
                        {usageTypes &&
                          usageTypes.map((usageType, i) => (
                            <MenuItem key={i} value={usageType.id}>
                              {usageType.usageType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="usageType"
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.usageType ? errors.usageType.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  error={!!errors.usageSubType}
                  style={{ width: "230px" }}
                >
                  <InputLabel>
                    {<FormattedLabel id="usageSubType" />}
                  </InputLabel>
                  <Controller
                    control={control}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={field.value}
                        // label="Financial Year"
                        label={<FormattedLabel id="usageSubType" />}
                        onChange={(value) => field.onChange(value)}
                        // style={{ height: 40, padding: "14px 14px" }}
                        variant="standard"
                      >
                        {usageSubTypes &&
                          usageSubTypes.map((usageSubType, i) => (
                            <MenuItem key={i} value={usageSubType.id}>
                              {usageSubType.subUsageType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="usageSubType"
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.usageSubType ? errors.usageSubType.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  error={!!errors.constructionType}
                  style={{ width: "230px" }}
                >
                  <InputLabel>
                    {<FormattedLabel id="constructionType" />}
                  </InputLabel>
                  <Controller
                    control={control}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={field.value}
                        // label="Financial Year"
                        label={<FormattedLabel id="constructionType" />}
                        onChange={(value) => field.onChange(value)}
                        // style={{ height: 40, padding: "14px 14px" }}
                        variant="standard"
                      >
                        {constructionTypes &&
                          constructionTypes.map((ct, i) => (
                            <MenuItem key={i} value={ct.id}>
                              {ct.constructionTypeName}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="constructionType"
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.constructionType
                      ? errors.constructionType.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* ................................Text Fields............................... */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Annual Rate. *"
                  {...register("annualRate")}
                  error={!!errors.annualRate}
                  helperText={
                    errors?.annualRate ? errors.annualRate.message : null
                  }
                  defaultValue=""
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Annual Rv Value. *"
                  {...register("annualRvValue")}
                  error={!!errors.annualRvValue}
                  helperText={
                    errors?.annualRvValue ? errors.annualRvValue.message : null
                  }
                  defaultValue=""
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ marginTop: 0 }}
                  error={!!errors.initiationOfPropertyUsageDate}
                >
                  <Controller
                    control={control}
                    name="initiationOfPropertyUsageDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>
                              Initiation Of Property Usage Date
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
                    {errors?.initiationOfPropertyUsageDate
                      ? errors.initiationOfPropertyUsageDate.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Action. *"
                  {...register("action")}
                  error={!!errors.action}
                  helperText={errors?.action ? errors.action.message : null}
                  defaultValue=""
                />
              </Grid>

              {/* ................................DATES AND TIME............................... */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ marginTop: 0 }}
                  error={!!errors.scheduleDate}
                >
                  <Controller
                    control={control}
                    name="scheduleDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>Schedule Date</span>
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
                    {errors?.scheduleDate ? errors.scheduleDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  style={{ marginTop: 10 }}
                  error={!!errors.scheduleTime}
                >
                  <Controller
                    control={control}
                    name="scheduleTime"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <TimePicker
                          label={
                            <span style={{ fontSize: 16 }}>Schedule Time</span>
                          }
                          value={field.value || null}
                          onChange={(time) => field.onChange(time)}
                          selected={field.value}
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
                    {errors?.scheduleTime ? errors.scheduleTime.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ marginTop: 0 }}
                  error={!!errors.rescheduleDate}
                >
                  <Controller
                    control={control}
                    name="rescheduleDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 15 }}>
                              Reschedule Date
                            </span>
                          }
                          value={field.value}
                          onChange={
                            (date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))

                            // field.onChange(date)
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
                    {errors?.rescheduleDate
                      ? errors.rescheduleDate.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ marginTop: 0 }}
                  error={!!errors.rescheduleTime}
                >
                  <Controller
                    control={control}
                    name="rescheduleTime"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <TimePicker
                          label={
                            <span style={{ fontSize: 14 }}>
                              Reschedule Time
                            </span>
                          }
                          value={field.value}
                          // onChange={(newValue) => {
                          //   field.onChange(setValuee(newValue))
                          // }}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                          }}
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
                    {errors?.rescheduleTime
                      ? errors.rescheduleTime.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Schedule Token No"
                  {...register("scheduleTokenNo")}
                  error={!!errors.scheduleTokenNo}
                  helperText={
                    errors?.scheduleTokenNo
                      ? errors.scheduleTokenNo.message
                      : null
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Property Status"
                  {...register("propertyStatus")}
                  error={!!errors.Status}
                  helperText={errors?.Status ? errors.Status.message : null}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Remark"
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}
                />
              </Grid>
            </Grid>

            {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}

            <Grid container style={{ padding: "10px" }} spacing={2}>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  // sx={{ marginRight: 8 }}
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                >
                  {/* {language === "en" ? btnSaveText : btnSaveTextMr} */}
                  {<FormattedLabel id="save" />}
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  // sx={{ marginRight: 8 }}
                  variant="contained"
                  color="primary"
                  endIcon={<ClearIcon />}
                  onClick={() => cancellButton()}
                >
                  {<FormattedLabel id="clear" />}
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  onClick={() => exitButton()}
                >
                  {<FormattedLabel id="exit" />}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Paper>
    </div>
  );
};

export default Index;
