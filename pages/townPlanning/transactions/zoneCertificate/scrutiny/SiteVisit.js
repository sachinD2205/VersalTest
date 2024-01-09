import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextareaAutosize,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../../URLS/urls";
import UploadButton from "../../../../../components/streetVendorManagementSystem/fileUpload/UploadButtonHawker";
import styles from "../../../../../components/streetVendorManagementSystem/styles/view.module.css";
import UploadButtonThumbOP from "../../../../../components/townPlanning/CameraDocuments";
import Loader from "../../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { useSelector } from "react-redux";
// import UploadButton from "../../../../../components/townPlanning/FileUploadTable/UploadButton";

// func
const SiteVisit = (props) => {
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels?.language);

  const router = useRouter();

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

  // File Upload
  const [siteVisitPhoto1, setSiteVisitPhoto1] = useState(null);
  const [siteVisitPhoto2, setSiteVisitPhoto2] = useState(null);
  const [siteVisitPhoto3, setSiteVisitPhoto3] = useState(null);
  const [siteVisitPhoto4, setSiteVisitPhoto4] = useState(null);
  const [siteVisitPhoto5, setSiteVisitPhoto5] = useState(null);
  const [streetVendorPhoto, setStreetVendorPhoto] = useState(null);
  const [streetVendorThumb1, setStreetVendorThumb1] = useState(null);
  const [streetVendorThumb2, setStreetVendorThumb2] = useState(null);
  const [loadderState, setLoadderState] = useState(false);
  const [shrinkTemp, setShrinkTemp] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
    useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
  let pageMode = router?.query?.pageMode;
  const getHawkerLicenseData = () => {
    let url;
    // issuance
    if (
      issuanceOfHawkerLicenseId != null &&
      issuanceOfHawkerLicenseId != undefined &&
      issuanceOfHawkerLicenseId != ""
    ) {
      url = `${urls.TPURL}/developmentPlanOpinion/getDevelopmentPlanOpinionById?id=${router?.query?.applicationId}`;
    }
    // // renewal
    // else if (
    //   renewalOfHawkerLicenseId != null &&
    //   renewalOfHawkerLicenseId != undefined &&
    //   renewalOfHawkerLicenseId != ""
    // ) {
    //   url = `${urls.TPURL}/transaction/renewalOfHawkerLicense/getById?id=${renewalOfHawkerLicenseId}`;
    // }
    // // cancellation
    // else if (
    //   cancellationOfHawkerLicenseId != null &&
    //   cancellationOfHawkerLicenseId != undefined &&
    //   cancellationOfHawkerLicenseId != ""
    // ) {
    //   url = `${urls.TPURL}/cancellationOfHawkerLicense/getById?id=${cancellationOfHawkerLicenseId}`;
    // }
    // // transfer
    // else if (
    //   transferOfHawkerLicenseId != null &&
    //   transferOfHawkerLicenseId != undefined &&
    //   transferOfHawkerLicenseId != ""
    // ) {
    //   url = `${urls.TPURL}/transferOfHawkerLicense/getById?id=${transferOfHawkerLicenseId}`;
    // }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          reset(r?.data);
          setValue("disabledFieldInputState", true);
          setShrinkTemp(true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        setLoadderState(false);
      });
  };

  // OnSubmit Form
  const handleNext = (formData) => {
    setLoadderState(true);
    console.log("FromData", formData);

    let siteVisit = null;
    let finalBodyForApi = null;
    let url = null;

    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      siteVisit = {
        ...formData,
        issuanceOfHawkerLicenseId,
      };

      finalBodyForApi = {
        id: issuanceOfHawkerLicenseId,
        role: "SITE_VISIT",
        appointmentType: "S",
        siteVisit: [{ ...siteVisit }],
      };
      url = `${urls.TPURL}/developmentPlanOpinion/saveApplication`;
    }

    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (
          res?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          formData.id
            ? sweetAlert(
                "Site Visit !",
                "site visit successfully conducted !",
                "success",
              )
            : sweetAlert(
                "Site Visit !",
                "site visit successfully conducted!",
                "success",
              );
          router.push("/townPlanning/dashboard");
          setLoadderState(false);
        } else {
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        setLoadderState(false);
      });

    setLoadderState(false);
  };

  // idSet
  useEffect(() => {
    setValue("disabledFieldInputState", true);

    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      setLoadderState(true);
      setIssuanceOfHawkerLicenseId(
        localStorage.getItem("issuanceOfHawkerLicenseId"),
      );
    }

    // renewal
    else if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
      localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
      localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
      setLoadderState(true);
      setRenewalOfHawkerLicenseId(
        localStorage.getItem("renewalOfHawkerLicenseId"),
      );
    }

    // cancelltion
    else if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      setLoadderState(true);
      setCancellationOfHawkerLicenseId(
        localStorage.getItem("cancellationOfHawkerLicenseId"),
      );
    }

    // transfer
    else if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" &&
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
      setLoadderState(true);
      setTransferOfHawkerLicenseId(
        localStorage.getItem("transferOfHawkerLicenseId"),
      );
    }
  }, []);

  useEffect(() => {
    console.log("disabledInputStae", watch("disabledFieldInputState"));
  }, [watch("disabledFieldInputState")]);

  // api
  useEffect(() => {
    getHawkerLicenseData();
  }, [
    issuanceOfHawkerLicenseId,
    renewalOfHawkerLicenseId,
    cancellationOfHawkerLicenseId,
    transferOfHawkerLicenseId,
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

  useEffect(() => {}, [loadderState]);

  useEffect(() => {
    if (
      watch("siteVisitPhoto1") ||
      watch("gphoto") ||
      watch("bphoto") ||
      watch("wfPhoto") ||
      watch("wsPhoto")
    ) {
      console.log("66666666666", watch("siteVisitPhoto1"), watch("gphoto"));
    }
  }, [
    watch("siteVisitPhoto1"),
    watch("gphoto"),
    watch("bphoto"),
    watch("wfPhoto"),
    watch("wsPhoto"),
  ]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          square
          sx={{
            // margin: 5,
            padding: 1,
            // paddingTop: 5,
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: "white",
          }}
          elevation={5}
        >
          <div>
            {/** Main Heading */}
            <marquee width="100%" direction="left" scrollamount="12">
              <Typography
                variant="h5"
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  marginTop: "2px",
                }}
              >
                <strong>{<FormattedLabel id="siteVisit" />}</strong>
              </Typography>
            </marquee>
            <br /> <br />
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleNext)}>
                <ThemeProvider theme={theme}>
                  {shrinkTemp && (
                    <>
                      {/* <BasicApplicationDetails />
                      <HawkerDetails />
                      <AddressOfHawker />
                      <AadharAuthentication />
                      <PropertyAndWaterTaxes />
                      <AdditionalDetails /> */}
                    </>
                  )}

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
                        marginTop: "15px",
                      }}
                    >
                      <Typography variant="subtitle1">
                        <strong>
                          <h2>Town planner Information</h2>
                          {/* {<FormattedLabel id="streetVendorInformation" />} */}
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
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "15px",
                        marginTop: "15px",
                      }}
                    >
                      <Typography variant="subtitle1">
                        <strong>
                          {<FormattedLabel id="townplanQuestion" />}
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
                      <Typography>
                        {<FormattedLabel id="LandDetails" />}
                      </Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={4}
                        placeholder="Enter a Land Details"
                        style={{ width: 700 }}
                        {...register("LandDetails")}
                      />
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
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="BRTCorridore" />}
                        </FormLabel>
                        <Controller
                          name="BRTCorridore"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.BRTCorridore}
                                helperText={
                                  errors?.BRTCorridore
                                    ? errors.BRTCorridore.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.BRTCorridore}
                                helperText={
                                  errors?.BRTCorridore
                                    ? errors.BRTCorridore.message
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
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      sx={{ marginTop: 2 }}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="MetroCorridore" />}
                        </FormLabel>
                        <Controller
                          name="MetroCorridore"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.MetroCorridore}
                                helperText={
                                  errors?.MetroCorridore
                                    ? errors.MetroCorridore.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.MetroCorridore}
                                helperText={
                                  errors?.MetroCorridore
                                    ? errors.MetroCorridore.message
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
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      sx={{ marginTop: 2 }}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="FloodLine" />}
                        </FormLabel>
                        <Controller
                          name="FloodLine"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.FloodLine}
                                helperText={
                                  errors?.FloodLine
                                    ? errors.FloodLine.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.FloodLine}
                                helperText={
                                  errors?.FloodLine
                                    ? errors.FloodLine.message
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
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      sx={{ marginTop: 2 }}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="RedZone" />}
                        </FormLabel>
                        <Controller
                          name="RedZone"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.RedZone}
                                helperText={
                                  errors?.RedZone
                                    ? errors.RedZone.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.RedZone}
                                helperText={
                                  errors?.RedZone
                                    ? errors.RedZone.message
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
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      sx={{ marginTop: 2 }}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="ReservationDetail" />}
                        </FormLabel>
                        <Controller
                          name="ReservationDetail"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.ReservationDetail}
                                helperText={
                                  errors?.ReservationDetail
                                    ? errors.ReservationDetail.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.ReservationDetail}
                                helperText={
                                  errors?.ReservationDetail
                                    ? errors.ReservationDetail.message
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
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      sx={{ marginTop: 2 }}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="roadWidth" />}
                        </FormLabel>
                        <Controller
                          name="roadWidth"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.roadWidth}
                                helperText={
                                  errors?.roadWidth
                                    ? errors.roadWidth.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.roadWidth}
                                helperText={
                                  errors?.roadWidth
                                    ? errors.roadWidth.message
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
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      sx={{ marginTop: 2 }}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="PlannedRoad" />}
                        </FormLabel>
                        <Controller
                          name="PlannedRoad"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.PlannedRoad}
                                helperText={
                                  errors?.PlannedRoad
                                    ? errors.PlannedRoad.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.PlannedRoad}
                                helperText={
                                  errors?.PlannedRoad
                                    ? errors.PlannedRoad.message
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
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      sx={{ marginTop: 2 }}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="SpecialZone" />}
                        </FormLabel>
                        <Controller
                          name="SpecialZone"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.SpecialZone}
                                helperText={
                                  errors?.SpecialZone
                                    ? errors.SpecialZone.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.SpecialZone}
                                helperText={
                                  errors?.SpecialZone
                                    ? errors.SpecialZone.message
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
                          {<FormattedLabel id="AreaZone" />}
                        </FormLabel>
                        <Controller
                          name="AreaZone"
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
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.AreaZone}
                                helperText={
                                  errors?.AreaZone
                                    ? errors.AreaZone.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.AreaZone}
                                helperText={
                                  errors?.AreaZone
                                    ? errors.AreaZone.message
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
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <Typography varaint="subtitle1">
                        <strong>
                          {<FormattedLabel id="siteVisitPhotoUpload" />}
                        </strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                      <Typography variant="subtitle2">
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto1" />}
                        </strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButton
                          appName="TP"
                          serviceName="H-HmsSiteVisit"
                          filePath={setSiteVisitPhoto1}
                          fileName={siteVisitPhoto1}
                          // fileKey={"siteVisitPhoto1"}
                        />
                        OR
                        <UploadButtonThumbOP
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setSiteVisitPhoto1}
                          fileName={siteVisitPhoto1}
                          // fileKey={"siteVisitPhoto1"}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                      <Typography variant="subtitle2">
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto2" />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto2}
                        fileName={siteVisitPhoto2}
                      />
                      OR
                      <UploadButtonThumbOP
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto2}
                        fileName={siteVisitPhoto2}
                      />
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                      <Typography variant="subtitle2">
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto3" />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto3}
                        fileName={siteVisitPhoto3}
                      />
                      OR
                      <UploadButtonThumbOP
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto3}
                        fileName={siteVisitPhoto3}
                      />
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                      <Typography variant="subtitle2">
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto4" />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto4}
                        fileName={siteVisitPhoto4}
                      />
                      OR
                      <UploadButtonThumbOP
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto4}
                        fileName={siteVisitPhoto4}
                      />
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
                              aria-label="minimum height"
                              minRows={4}
                              placeholder="Enter a Remarks"
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
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          {<FormattedLabel id="submit" />}
                        </Button>
                        <Button
                          onClick={() => {
                            // localStorage.removeItem(
                            //   "issuanceOfHawkerLicenseId",
                            // );
                            router.push("/townPlanning/dashboard");
                          }}
                          type="button"
                          variant="contained"
                          color="primary"
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </ThemeProvider>
              </form>
            </FormProvider>
          </div>
        </Paper>
      )}
    </>
  );
};

export default SiteVisit;
