import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme.js";
import Loader from "../../containers/Layout/components/Loader";
import UploadButton1 from "../fileUpload/UploadButton1";
import styles from "../styles/view.module.css";

// func
const SiteVisitView = (props) => {
  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  const [loadderState, setLoadderState] = useState(false);

  // File Upload
  const [siteVisitPhoto1, setSiteVisitPhoto1] = useState(null);
  const [siteVisitPhoto2, setSiteVisitPhoto2] = useState(null);
  const [siteVisitPhoto3, setSiteVisitPhoto3] = useState(null);
  const [siteVisitPhoto4, setSiteVisitPhoto4] = useState(null);
  const [siteVisitPhoto5, setSiteVisitPhoto5] = useState(null);
  const [streetVendorPhoto, setStreetVendorPhoto] = useState(null);
  const [streetVendorThumb1, setStreetVendorThumb1] = useState(null);
  const [streetVendorThumb2, setStreetVendorThumb2] = useState(null);

  // OnSubmit Form
  const handleNext = (data) => {};

  useEffect(() => {
    setLoadderState(true);
    console.log("CurrentSiteVisitData", props?.props);
    setSiteVisitPhoto1(props?.props[props?.props?.length - 1].siteVisitPhoto1);
    setSiteVisitPhoto2(props?.props[props?.props?.length - 1].siteVisitPhoto2);
    setSiteVisitPhoto3(props?.props[props?.props?.length - 1].siteVisitPhoto3);
    setSiteVisitPhoto4(props?.props[props?.props?.length - 1].siteVisitPhoto4);
    setSiteVisitPhoto5(props?.props[props?.props?.length - 1].siteVisitPhoto5);
    setStreetVendorPhoto(
      props?.props[props?.props?.length - 1].streetVendorPhoto,
    );
    setStreetVendorThumb1(
      props?.props[props?.props?.length - 1].streetVendorThumb1,
    );
    setStreetVendorThumb2(
      props?.props[props?.props?.length - 1].streetVendorThumb2,
    );
    setStreetVendorThumb2(
      props?.props[props?.props?.length - 1].streetVendorThumb2,
    );
    setValue(
      "additionalLabour",
      props?.props[props?.props?.length - 1].additionalLabour,
    );
    setValue(
      "businessHawkinglocation",
      props?.props[props?.props?.length - 1].businessHawkinglocation,
    );
    setValue(
      "businessTrafficCongestion",
      props?.props[props?.props?.length - 1].businessTrafficCongestion,
    );
    setValue(
      "emailAddress",
      props?.props[props?.props?.length - 1].emailAddress,
    );
    setValue(
      "inspectionSellingGoods",
      props?.props[props?.props?.length - 1].inspectionSellingGoods,
    );
    setValue(
      "roadWithBusinessLocation",
      props?.props[props?.props?.length - 1].roadWithBusinessLocation,
    );
    setValue(
      "siteVisitRemark",
      props?.props[props?.props?.length - 1].siteVisitRemark,
    );
    setLoadderState(false);
  }, []);

  useEffect(() => {
    setValue("siteVisitPhoto1", siteVisitPhoto1);
    setValue("siteVisitPhoto2", siteVisitPhoto2);
    setValue("siteVisitPhoto3", siteVisitPhoto3);
    setValue("siteVisitPhoto4", siteVisitPhoto4);
    setValue("siteVisitPhoto5", siteVisitPhoto5);
    setValue("streetVendorPhoto", streetVendorPhoto);
    setValue("streetVendorThumb1", streetVendorThumb1);
    setValue("streetVendorThumb2", streetVendorThumb2);
  }, [
    siteVisitPhoto1,
    siteVisitPhoto2,
    siteVisitPhoto3,
    siteVisitPhoto4,
    siteVisitPhoto5,
    streetVendorPhoto,
    streetVendorThumb1,
    streetVendorThumb2,
  ]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleNext)}>
              <ThemeProvider theme={theme}>
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
                  <strong> {<FormattedLabel id="siteVisit" />}</strong>
                </div>

                <Grid
                  container
                  sx={{
                    marginTop: 5,
                    marginBottom: 5,
                    paddingLeft: "50px",
                    align: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <Typography varaint="subtitle1">
                      <strong>{<FormattedLabel id="siteVisitPhoto" />}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto1" />}</strong>
                    </Typography>
                    <div className={styles.attachFile}>
                      <UploadButton1
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto1}
                        fileName={siteVisitPhoto1}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto2" />}</strong>
                    </Typography>
                    <UploadButton1
                      appName="HMS"
                      serviceName="H-HmsSiteVisit"
                      filePath={setSiteVisitPhoto2}
                      fileName={siteVisitPhoto2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto3" />}</strong>
                    </Typography>
                    <UploadButton1
                      appName="HMS"
                      serviceName="H-HmsSiteVisit"
                      filePath={setSiteVisitPhoto3}
                      fileName={siteVisitPhoto3}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto4" />}</strong>
                    </Typography>
                    <UploadButton1
                      appName="HMS"
                      serviceName="H-HmsSiteVisit"
                      filePath={setSiteVisitPhoto4}
                      fileName={siteVisitPhoto4}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    sx={{ marginTop: 2 }}
                  >
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto5" />}</strong>
                    </Typography>
                    <UploadButton1
                      appName="HMS"
                      serviceName="H-HmsSiteVisit"
                      filePath={setSiteVisitPhoto5}
                      fileName={siteVisitPhoto5}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <Typography variant="subtitle1">
                      <strong>
                        {<FormattedLabel id="streetVendorInformation" />}
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant="subtitle2">
                      <strong>
                        {<FormattedLabel id="streetVendorPhoto" />}
                      </strong>
                    </Typography>
                    <div className={styles.attachFile}>
                      <UploadButton1
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setStreetVendorPhoto}
                        fileName={streetVendorPhoto}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant="subtitle2">
                      <strong>
                        {<FormattedLabel id="streetVendorThumb1" />}
                      </strong>
                    </Typography>
                    <div className={styles.attachFile}>
                      <UploadButton1
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setStreetVendorThumb1}
                        fileName={streetVendorThumb1}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant="subtitle2">
                      <strong>
                        {<FormattedLabel id="streetVendorThumb2" />}
                      </strong>
                    </Typography>
                    <div className={styles.attachFile}>
                      <UploadButton1
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setStreetVendorThumb2}
                        fileName={streetVendorThumb2}
                      />
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <Typography variant="subtitle1">
                      <strong>
                        {<FormattedLabel id="streetVendorQuestion" />}
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    sx={{ marginTop: 2 }}
                  >
                    <TextField
                      sx={{ width: "300px" }}
                      disabled
                      InputLabelProps={{ shrink: true }}
                      label=<FormattedLabel id="roadWithBusinessLocation" />
                      variant="standard"
                      {...register("roadWithBusinessLocation")}
                    />
                  </Grid>
                  {/**  
                  <Grid item xs={12} md={12} sm={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                    <FormControl flexDirection="row">
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="additionalLabour" />}
                      </FormLabel>
                      <Controller
                        name="additionalLabour"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                          <RadioGroup
                            disabled
                            sx={{ width: "270px" }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              disabled
                              value="true"
                              control={<Radio size="small" />}
                              label={<FormattedLabel id="yes" />}
                              error={!!errors.additionalLabour}
                              helperText={errors?.additionalLabour ? errors.additionalLabour.message : null}
                            />
                            <FormControlLabel
                              disabled
                              value="false"
                              control={<Radio size="small" />}
                              label={<FormattedLabel id="no" />}
                              error={!!errors.additionalLabour}
                              helperText={errors?.additionalLabour ? errors.additionalLabour.message : null}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  */}
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    sx={{ marginTop: 2 }}
                  >
                    <FormControl flexDirection="row">
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="businessHawkinglocation" />}
                      </FormLabel>
                      <Controller
                        name="businessHawkinglocation"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                          <RadioGroup
                            disabled
                            sx={{ width: "270px" }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              disabled
                              value="Applicant itSelef"
                              control={<Radio size="small" />}
                              label={<FormattedLabel id="applicantItsSelf" />}
                              error={!!errors.businessHawkinglocation}
                              helperText={
                                errors?.businessHawkinglocation
                                  ? errors.businessHawkinglocation.message
                                  : null
                              }
                            />
                            <FormControlLabel
                              disabled
                              value="with Help of Family Members"
                              control={<Radio size="small" />}
                              label={
                                <FormattedLabel id="withHelpofFamilyMembers" />
                              }
                              error={!!errors.businessHawkinglocation}
                              helperText={
                                errors?.businessHawkinglocation
                                  ? errors.businessHawkinglocation.message
                                  : null
                              }
                            />
                            <FormControlLabel
                              disabled
                              value="by Keeping servant"
                              control={<Radio size="small" />}
                              label={<FormattedLabel id="byKeepingservant" />}
                              error={!!errors.businessHawkinglocation}
                              helperText={
                                errors?.businessHawkinglocation
                                  ? errors.businessHawkinglocation.message
                                  : null
                              }
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    sx={{ marginTop: 2 }}
                  >
                    <FormControl flexDirection="row">
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="inspectionSellingGoods" />}
                      </FormLabel>
                      <Controller
                        name="inspectionSellingGoods"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                          <RadioGroup
                            disabled
                            sx={{ width: "270px" }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              disabled
                              value="true"
                              control={<Radio size="small" />}
                              label={<FormattedLabel id="yes" />}
                              error={!!errors.inspectionSellingGoods}
                              helperText={
                                errors?.inspectionSellingGoods
                                  ? errors.inspectionSellingGoods.message
                                  : null
                              }
                            />
                            <FormControlLabel
                              disabled
                              value="false"
                              control={<Radio size="small" />}
                              label={<FormattedLabel id="no" />}
                              error={!!errors.inspectionSellingGoods}
                              helperText={
                                errors?.inspectionSellingGoods
                                  ? errors.inspectionSellingGoods.message
                                  : null
                              }
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    sx={{ marginTop: 2 }}
                  >
                    <FormControl flexDirection="row">
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="businessTrafficCongestion" />}
                      </FormLabel>
                      <Controller
                        name="businessTrafficCongestion"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                          <RadioGroup
                            disabled
                            sx={{ width: "270px" }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              disabled
                              value="true"
                              control={<Radio size="small" />}
                              label={<FormattedLabel id="yes" />}
                              error={!!errors.businessTrafficCongestion}
                              helperText={
                                errors?.businessTrafficCongestion
                                  ? errors.businessTrafficCongestion.message
                                  : null
                              }
                            />
                            <FormControlLabel
                              disabled
                              value="false"
                              control={<Radio size="small" />}
                              label={<FormattedLabel id="no" />}
                              error={!!errors.businessTrafficCongestion}
                              helperText={
                                errors?.businessTrafficCongestion
                                  ? errors.businessTrafficCongestion.message
                                  : null
                              }
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    md={1}
                    sm={1}
                    lg={1}
                    xl={1}
                    sx={{ marginTop: 2 }}
                  >
                    <strong>
                      <FormattedLabel id="remark" />{" "}
                    </strong>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    sm={6}
                    lg={6}
                    xl={6}
                    sx={{ marginTop: 1 }}
                  >
                    <FormControl
                      error={!!errors.siteVisitRemark}
                      sx={{ marginTop: 0 }}
                    >
                      <Controller
                        name="siteVisitRemark"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextareaAutosize
                            disabled
                            {...register("siteVisitRemark")}
                            style={{
                              width: "250px",
                              height: "50px",
                            }}
                          />
                        )}
                      />
                      <FormHelperText>
                        {errors?.siteVisitRemark
                          ? errors.siteVisitRemark.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <br />

                  {/**
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack spacing={5} direction="row">
                    <Button type="submit" variant="contained" color="primary">
                      {<FormattedLabel id="submit" />}
                    </Button>
                  </Stack>
                </Grid>
              */}
                </Grid>
              </ThemeProvider>
            </form>
          </FormProvider>
        </div>
      )}
    </>
  );
};

export default SiteVisitView;
