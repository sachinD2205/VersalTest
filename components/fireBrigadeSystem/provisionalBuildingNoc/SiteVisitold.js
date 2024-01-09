import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme.js";
import urls from "../../../URLS/urls";
import UploadButton from "../../fileUpload/UploadButton";
import styles from "../../streetVendorManagementSystem/styles/view.module.css";

// func
const SiteVisit = (props) => {
  const [applicationId, setApplicationId] = useState();
  const router = useRouter();
  useEffect(() => {
    setApplicationId(props.appID);
    console.log("props.state", props);
  }, [props]);

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

  useEffect(() => {
    watch("siteVisitRemark");
    console.log(
      "siteVisitPhoto3",
      watch("siteVisitPhoto3"),
      watch("siteVisitRemark")
    );
  }, []);

  // OnSubmit Form
  const handleNext = (formData) => {
    let siteVisit = {
      ...formData,
      applicationId,
    };

    let finalBodyForApi = {
      id: applicationId,
      role: "SITE_VISIT",
      siteVisit: { ...siteVisit },
    };

    console.log("finalBody ", finalBodyForApi);

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi
      )
      .then((res) => {
        props.siteVisitDailogP(false);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "site visit !", "success")
            : sweetAlert("Saved!", "site visit !", "success");
          router.push("/FireBrigadeSystem/dashboard");
        }
      });
  };

  // File Upload
  const [siteVisitPhoto1, setSiteVisitPhoto1] = useState(null);
  const [siteVisitPhoto2, setSiteVisitPhoto2] = useState(null);
  const [siteVisitPhoto3, setSiteVisitPhoto3] = useState(null);
  const [siteVisitPhoto4, setSiteVisitPhoto4] = useState(null);
  const [siteVisitPhoto5, setSiteVisitPhoto5] = useState(null);
  const [streetVendorPhoto, setStreetVendorPhoto] = useState(null);
  const [streetVendorThumb1, setStreetVendorThumb1] = useState(null);
  const [streetVendorThumb2, setStreetVendorThumb2] = useState(null);

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

  useEffect(() => {
    setValue("siteVisitPhoto1", getValues("siteVisitPhoto1"));
    setValue("siteVisitPhoto2", getValues("siteVisitPhoto2"));
    setValue("siteVisitPhoto3", getValues("siteVisitPhoto3"));
    setValue("siteVisitPhoto4", getValues("siteVisitPhoto4"));
    setValue("siteVisitPhoto5", getValues("siteVisitPhoto5"));
    setValue("streetVendorPhoto", getValues("streetVendorPhoto"));
    setValue("streetVendorThumb1", getValues("streetVendorThumb1"));
    setValue("streetVendorThumb2", getValues("streetVendorThumb2"));
  }, []);

  return (
    <>
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
                <strong>Questions</strong>
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
                {/* <Grid
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
                > */}
                {/* <Typography varaint="subtitle1">
                    <strong>
                      {<FormattedLabel id="siteVisitPhotoUpload" />}
                    </strong>
                  </Typography> */}
                {/* </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <div className={styles.attachFile}>
                    <UploadButton
                      appName="HMS"
                      serviceName="H-HmsSiteVisit"
                      filePath={setSiteVisitPhoto1}
                      fileName={siteVisitPhoto1}
                    />
                  </div>
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <UploadButton
                    appName="HMS"
                    serviceName="H-HmsSiteVisit"
                    filePath={setSiteVisitPhoto2}
                    fileName={siteVisitPhoto2}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <UploadButton
                    appName="HMS"
                    serviceName="H-HmsSiteVisit"
                    filePath={setSiteVisitPhoto3}
                    fileName={siteVisitPhoto3}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <UploadButton
                    appName="HMS"
                    serviceName="H-HmsSiteVisit"
                    filePath={setSiteVisitPhoto4}
                    fileName={siteVisitPhoto4}
                  />
                </Grid> */}

                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  sx={{ marginTop: 4 }}
                >
                  <UploadButton
                    appName="HMS"
                    serviceName="H-HmsSiteVisit"
                    filePath={setSiteVisitPhoto5}
                    fileName={siteVisitPhoto5}
                  />
                </Grid> */}
                {/* <Grid
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
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Typography variant="subtitle2">
                    <strong>{<FormattedLabel id="streetVendorPhoto" />}</strong>
                  </Typography>
                  <div className={styles.attachFile}>
                    <UploadButton
                      appName="HMS"
                      serviceName="H-HmsSiteVisit"
                      filePath={setStreetVendorPhoto}
                      fileName={streetVendorPhoto}
                    />
                  </div>
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Typography variant="subtitle2">
                    <strong>
                      {<FormattedLabel id="streetVendorThumb1" />}
                    </strong>
                  </Typography>
                  <div className={styles.attachFile}>
                    <UploadButton
                      appName="HMS"
                      serviceName="H-HmsSiteVisit"
                      filePath={setStreetVendorThumb1}
                      fileName={streetVendorThumb1}
                    />
                  </div>
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Typography variant="subtitle2">
                    <strong>
                      {<FormattedLabel id="streetVendorThumb2" />}
                    </strong>
                  </Typography>
                  <div className={styles.attachFile}>
                    <UploadButton
                      appName="HMS"
                      serviceName="H-HmsSiteVisit"
                      filePath={setStreetVendorThumb2}
                      fileName={streetVendorThumb2}
                    />
                  </div>
                </Grid> */}
                {/* <Grid
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
                </Grid> */}
                {/* <Grid
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
                    label=<FormattedLabel id="roadWithBusinessLocation" />
                    variant="standard"
                    {...register("roadWithBusinessLocation")}
                  />
                </Grid> */}
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
                      {/* {<FormattedLabel id="additionalLabour" />} */}
                      Questions
                    </FormLabel>
                    <Controller
                      name="additionalLabour"
                      control={control}
                      defaultValue="false"
                      render={({ field }) => (
                        <RadioGroup
                          sx={{ width: "270px" }}
                          // disabled={inputState}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            // disabled={inputState}
                            value="true"
                            control={<Radio size="small" />}
                            label="yes"
                            error={!!errors.additionalLabour}
                            helperText={
                              errors?.additionalLabour
                                ? errors.additionalLabour.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value="false"
                            control={<Radio size="small" />}
                            label="no"
                            error={!!errors.additionalLabour}
                            helperText={
                              errors?.additionalLabour
                                ? errors.additionalLabour.message
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
                      Question 1
                      {/* {<FormattedLabel id="businessHawkinglocation" />} */}
                    </FormLabel>
                    <Controller
                      name="businessHawkinglocation"
                      control={control}
                      defaultValue="false"
                      render={({ field }) => (
                        <RadioGroup
                          sx={{ width: "270px" }}
                          // disabled={inputState}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            // disabled={inputState}
                            value="Applicant itSelef"
                            control={<Radio size="small" />}
                            label="Yes"
                            error={!!errors.businessHawkinglocation}
                            helperText={
                              errors?.businessHawkinglocation
                                ? errors.businessHawkinglocation.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value="with Help of Family Members"
                            control={<Radio size="small" />}
                            label="No"
                            error={!!errors.businessHawkinglocation}
                            helperText={
                              errors?.businessHawkinglocation
                                ? errors.businessHawkinglocation.message
                                : null
                            }
                          />
                          {/* <FormControlLabel
                            // disabled={inputState}
                            value="by Keeping servant"
                            control={<Radio size="small" />}
                            label={<FormattedLabel id="byKeepingservant" />}
                            error={!!errors.businessHawkinglocation}
                            helperText={
                              errors?.businessHawkinglocation
                                ? errors.businessHawkinglocation.message
                                : null
                            }
                          /> */}
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
                      {/* {<FormattedLabel id="inspectionSellingGoods" />} */}
                      Question 2
                    </FormLabel>
                    <Controller
                      name="inspectionSellingGoods"
                      control={control}
                      defaultValue="false"
                      render={({ field }) => (
                        <RadioGroup
                          sx={{ width: "270px" }}
                          // disabled={inputState}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            // disabled={inputState}
                            value="true"
                            control={<Radio size="small" />}
                            label="yes"
                            error={!!errors.inspectionSellingGoods}
                            helperText={
                              errors?.inspectionSellingGoods
                                ? errors.inspectionSellingGoods.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value="false"
                            control={<Radio size="small" />}
                            label="no"
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
                      {/* {<FormattedLabel id="businessTrafficCongestion" />} */}
                      Question 3
                    </FormLabel>
                    <Controller
                      name="businessTrafficCongestion"
                      control={control}
                      defaultValue="false"
                      render={({ field }) => (
                        <RadioGroup
                          sx={{ width: "270px" }}
                          // disabled={inputState}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                          <FormControlLabel
                            // disabled={inputState}
                            value="true"
                            control={<Radio size="small" />}
                            label="yes"
                            error={!!errors.businessTrafficCongestion}
                            helperText={
                              errors?.businessTrafficCongestion
                                ? errors.businessTrafficCongestion.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value="false"
                            control={<Radio size="small" />}
                            label="no"
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
                  sx={{ marginTop: 2 }}
                >
                  <TextareaAutosize
                    {...register("siteVisitRemark")}
                    style={{
                      width: "250px",
                      height: "50px",
                    }}
                  />
                </Grid>
                <br />
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
                      Save
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </ThemeProvider>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default SiteVisit;
