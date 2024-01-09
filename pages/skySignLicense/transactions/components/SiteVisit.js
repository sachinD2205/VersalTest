import {
  Grid,
  TextField,
  TextareaAutosize,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import axios from "axios";
import { useFieldArray } from "react-hook-form";
import { useRouter } from "next/router";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

/////////////////// Drawer Related

import { styled, useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
// import UploadButton from "../../FileUpload/UploadButton.js";
import UploadButton from "../../../../components/fileUpload/UploadButtonSSLM";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

import UploadButtonNew from "../../../../components/fileUpload/UploadButtonSSLMEncryptDecrypt";

let drawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
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

const SiteVisit = (props) => {
  const router = useRouter();
  const {
    watch,
    control,
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // if (router.query.pageMode === 'Add' || router.query.pageMode === 'Edit') {
    //   setDisabled(false)
    // } else {
    //   setDisabled(true)
    // }
    if (router?.query?.disabled) {
      setDisabled(true);
    } else if (props.disabled) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, []);

  // OnSubmit Form
  const handleNext = (formData) => {
    const finalBodyForApi = {
      ...formData,
      applicationId,
    };
    axios
      .post(`${urls.HMSURL}/trnSiteVisit/save`, finalBodyForApi)
      .then((res) => {
        props.siteVisitDailogP(false);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
        }
      });
  };

  const [photo1, setphoto1] = useState(null);
  const [photo2, setphoto2] = useState(null);
  const [photo3, setphoto3] = useState(null);
  const [photo4, setphoto4] = useState(null);
  const [photo5, setphoto5] = useState(null);

  // @ First UseEffect
  useEffect(() => {
    if (getValues("trnSiteVisitFormDao.photo2") != null) {
      setphoto2(getValues("trnSiteVisitFormDao.photo2"));
    }
    if (getValues("trnSiteVisitFormDao.photo1") != null) {
      setphoto1(getValues("trnSiteVisitFormDao.photo1"));
    }
    if (getValues("trnSiteVisitFormDao.photo3") != null) {
      setphoto3(getValues("trnSiteVisitFormDao.photo3"));
    }
    if (getValues("trnSiteVisitFormDao.photo4") != null) {
      setphoto4(getValues("trnSiteVisitFormDao.photo4"));
    }
    if (getValues("trnSiteVisitFormDao.photo5") != null) {
      setphoto5(getValues("trnSiteVisitFormDao.photo5"));
    }
  }, []);

  // @ Second UseEffect
  useEffect(() => {
    setValue("trnSiteVisitFormDao.photo2", photo2);
    setValue("trnSiteVisitFormDao.photo1", photo1);
    setValue("trnSiteVisitFormDao.photo3", photo3);
    setValue("trnSiteVisitFormDao.photo4", photo4);
    setValue("trnSiteVisitFormDao.photo5", photo5);
  }, [photo2, photo1, photo3, photo4, photo5]);

  return (
    <>
      {/** Main Component  */}
      <Main>
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
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
          {/* <FormattedLabel id='applicantInformation' /> */}
          Site Visit
        </div>

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
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
          <FormattedLabel id="isavailable" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "45vw",
            margin: "5vh",
          }}
        >
          <FormControl flexDirection="row">
            <FormLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="fireEquirepment" />}
            </FormLabel>
            <Controller
              name="trnSiteVisitFormDao.fireEquirepment"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.fireEquirepment}
                    value="true"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.fireEquirepment}
                    value="false"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.fireEquirepment}>
              {errors?.fireEquirepment
                ? errors?.fireEquirepment?.message
                : null}
            </FormHelperText>
          </FormControl>

          <FormControl flexDirection="row">
            <FormLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="firstAidKit" />}
            </FormLabel>

            <Controller
              name="trnSiteVisitFormDao.firstAidKit"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  // disabled={disabled}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.firstAidKit}
                    value="true"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.firstAidKit}
                    value="false"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.firstAidKit}>
              {errors?.firstAidKit ? errors?.firstAidKit?.message : null}
            </FormHelperText>
          </FormControl>

          <FormControl flexDirection="row">
            <FormLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="toilets" />}
            </FormLabel>
            <Controller
              name="trnSiteVisitFormDao.toilets"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  // disabled={disabled}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.toilets}
                    value="true"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.toilets}
                    value="false"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.toilets}>
              {errors?.toilets ? errors?.toilets?.message : null}
            </FormHelperText>
          </FormControl>

          <FormControl flexDirection="row">
            <FormLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="storageofrawmaterial" />}
            </FormLabel>
            <Controller
              name="trnSiteVisitFormDao.storageofrawmaterial"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.storageofrawmaterial}
                    value="true"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.storageofrawmaterial}
                    value="false"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.storageofrawmaterial}>
              {errors?.storageofrawmaterial
                ? errors?.storageofrawmaterial?.message
                : null}
            </FormHelperText>
          </FormControl>

          <FormControl flexDirection="row">
            <FormLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="disposalSystemOfWaste" />}
            </FormLabel>
            <Controller
              name="trnSiteVisitFormDao.disposalSystemOfWaste"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.disposalSystemOfWaste}
                    value="true"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.disposalSystemOfWaste}
                    value="false"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.disposalSystemOfWaste}>
              {errors?.disposalSystemOfWaste
                ? errors?.disposalSystemOfWaste?.message
                : null}
            </FormHelperText>
          </FormControl>

          <FormControl flexDirection="row">
            <FormLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="nuisanceOfResidents" />}
            </FormLabel>
            <Controller
              name="trnSiteVisitFormDao.nuisanceOfResidents"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.nuisanceOfResidents}
                    value="true"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.nuisanceOfResidents}
                    value="false"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.nuisanceOfResidents}>
              {errors?.nuisanceOfResidents
                ? errors?.nuisanceOfResidents?.message
                : null}
            </FormHelperText>
          </FormControl>

          <FormControl flexDirection="row">
            <FormLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="ObjectionCertificate" />}
            </FormLabel>
            <Controller
              name="trnSiteVisitFormDao.ObjectionCertificate"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.ObjectionCertificate}
                    value="true"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.ObjectionCertificate}
                    value="false"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.ObjectionCertificate}>
              {errors?.ObjectionCertificate
                ? errors?.ObjectionCertificate?.message
                : null}
            </FormHelperText>
          </FormControl>

          <FormControl flexDirection="row">
            <FormLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="separatebusiness" />}
            </FormLabel>
            <Controller
              name="trnSiteVisitFormDao.separatebusiness"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.separatebusiness}
                    value="true"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    disabled={disabled}
                    error={!!errors?.separatebusiness}
                    value="false"
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.separatebusiness}>
              {errors?.separatebusiness
                ? errors?.separatebusiness?.message
                : null}
            </FormHelperText>
          </FormControl>

          <div></div>
        </div>
        <Grid container sx={{ marginLeft: 5, marginTop: 2, align: "center" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ marginTop: 2 }}
          >
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
              style={{ marginTop: 10, marginLeft: 35 }}
            >
              <FormLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="industryDate"></FormattedLabel>}
              </FormLabel>
              <Controller
                sx={{ marginTop: 0 }}
                control={control}
                name="trnSiteVisitFormDao.businessDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabled}
                      inputFormat="DD/MM/YYYY"
                      // label={
                      //   <FormattedLabel id="industryDate" />

                      // }
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                      }}
                      // selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            style: {
                              // fontSize: 12,
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
                {errors?.trnBussinessDetailsDao?.businessDate
                  ? errors.trnBussinessDetailsDao.businessDate.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ marginTop: 2 }}
          >
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
              style={{ marginTop: 10, marginLeft: 35 }}
            >
              <FormLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="temporarylicDate"></FormattedLabel>}
              </FormLabel>
              <Controller
                sx={{ marginTop: 0 }}
                control={control}
                name="trnSiteVisitFormDao.temporarylicDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabled}
                      inputFormat="DD/MM/YYYY"
                      // label={
                      //   <FormattedLabel id="industryDate" />

                      // }
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                      }}
                      // selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            style: {
                              // fontSize: 12,
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
                {errors?.trnBussinessDetailsDao?.temporarylicDate
                  ? errors.trnBussinessDetailsDao.temporarylicDate.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container sx={{ marginLeft: 5, marginTop: 2, align: "center" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ marginTop: 2 }}
          >
            {/* <Typography variant='subtitle2'>Upload Photo 1</Typography> */}
            {/* {<FormattedLabel id="photo1" />} */}
            {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo1");
                            }}
                        /> */}

            <div
              className={styles.attachFile}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <div>
                <TextField
                  disabled={disabled}
                  //  InputLabelProps={{ shrink: true }}
                  id="standard-basic"
                  label={<FormattedLabel id="photo1TextField"></FormattedLabel>}
                  {...register("trnSiteVisitFormDao.photo1TextField")}
                  error={!!errors.photo1TextField}
                  helperText={
                    errors?.photo1TextField
                      ? errors.photo1TextField.message
                      : null
                  }
                />
              </div>
              <div>
                {/* <UploadButton */}
                <UploadButtonNew
                  appName="SSLM"
                  serviceName="S-sitevisit"
                  filePath={setphoto1}
                  fileName={photo1}
                  disabled={props.disabled}
                />
              </div>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ marginTop: 2 }}
          >
            {/* <Typography variant='subtitle2'>Upload Photo 2</Typography> */}
            {/* {<FormattedLabel id="photo1" />} */}
            {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo2");
                            }}
                        /> */}
            <div
              className={styles.attachFile}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <div>
                <TextField
                  disabled={disabled}
                  //  InputLabelProps={{ shrink: true }}
                  id="standard-basic"
                  label={<FormattedLabel id="photo2TextField"></FormattedLabel>}
                  {...register("trnSiteVisitFormDao.photo2TextField")}
                  error={!!errors.photo2TextField}
                  helperText={
                    errors?.photo2TextField
                      ? errors.photo2TextField.message
                      : null
                  }
                />
              </div>
              <div>
                {/* <UploadButton */}
                <UploadButtonNew
                  appName="SSLM"
                  serviceName="S-sitevisit"
                  filePath={setphoto2}
                  fileName={photo2}
                  disabled={props.disabled}
                />
              </div>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ marginTop: 2 }}
          >
            {/* <Typography variant='subtitle2'>Upload Photo 3</Typography> */}
            {/* {<FormattedLabel id="photo1" />} */}
            {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo3");
                            }}
                        /> */}

            <div
              className={styles.attachFile}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <div>
                <TextField
                  disabled={disabled}
                  //  InputLabelProps={{ shrink: true }}
                  id="standard-basic"
                  label={<FormattedLabel id="photo3TextField"></FormattedLabel>}
                  {...register("trnSiteVisitFormDao.photo3TextField")}
                  error={!!errors.photo3TextField}
                  helperText={
                    errors?.photo3TextField
                      ? errors.photo3TextField.message
                      : null
                  }
                />
              </div>
              <div>
                {/* <UploadButton */}
                <UploadButtonNew
                  appName="SSLM"
                  serviceName="S-sitevisit"
                  filePath={setphoto3}
                  fileName={photo3}
                  disabled={props.disabled}
                />
              </div>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ marginTop: 2 }}
          >
            {/* <Typography variant='subtitle2'>Upload Photo 4</Typography> */}
            {/* {<FormattedLabel id="photo1" />} */}
            {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo4");
                            }}
                        /> */}
            <div
              className={styles.attachFile}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <div>
                <TextField
                  disabled={disabled}
                  //  InputLabelProps={{ shrink: true }}
                  id="standard-basic"
                  label={<FormattedLabel id="photo4TextField"></FormattedLabel>}
                  {...register("trnSiteVisitFormDao.photo4TextField")}
                  error={!!errors.photo4TextField}
                  helperText={
                    errors?.photo4TextField
                      ? errors.photo4TextField.message
                      : null
                  }
                />
              </div>
              <div>
                {/* <UploadButton */}
                <UploadButtonNew
                  appName="SSLM"
                  serviceName="S-sitevisit"
                  filePath={setphoto4}
                  fileName={photo4}
                  disabled={props.disabled}
                />
              </div>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ marginTop: 2 }}
          >
            {/* <Typography variant='subtitle2'>Upload Photo 5</Typography> */}
            {/* {<FormattedLabel id="photo1" />} */}
            {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo5");
                            }}
                        /> */}
            <div
              className={styles.attachFile}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <div>
                <TextField
                  disabled={disabled}
                  //  InputLabelProps={{ shrink: true }}
                  id="standard-basic"
                  label={<FormattedLabel id="photo5TextField"></FormattedLabel>}
                  {...register("trnSiteVisitFormDao.photo5TextField")}
                  error={!!errors.photo5TextField}
                  helperText={
                    errors?.photo5TextField
                      ? errors.photo5TextField.message
                      : null
                  }
                />
              </div>
              <div>
                {/* <UploadButton */}
                <UploadButtonNew
                  appName="SSLM"
                  serviceName="S-sitevisit"
                  filePath={setphoto5}
                  fileName={photo5}
                  disabled={props.disabled}
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <TextField
              disabled={disabled}
              id="standard-basic"
              label={<FormattedLabel id="crLattitude"></FormattedLabel>}
              {...register("trnSiteVisitFormDao.crLattitude")}
              error={!!errors.crLattitude}
              helperText={
                errors?.crLattitude ? errors.crLattitude.message : null
              }
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <TextField
              disabled={disabled}
              //  InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="crLongitud"></FormattedLabel>}
              {...register("trnSiteVisitFormDao.crLongitud")}
              error={!!errors.crLongitud}
              helperText={errors?.crLongitud ? errors.crLongitud.message : null}
            />
          </Grid>

          <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
            <TextareaAutosize
              disabled={disabled}
              //  InputLabelProps={{ shrink: true }}
              aria-label="minimum height"
              minRows={3}
              placeholder="Remark"
              style={{ marginTop: 40, width: 1000 }}
              id="standard-basic"
              label="Remark"
              {...register("trnSiteVisitFormDao.remark")}
              error={!!errors.remark}
              helperText={errors?.remark ? errors.remark.message : null}
            />
          </Grid>
        </Grid>
      </Main>
    </>
  );
};

export default SiteVisit;
