/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
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
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import AadharAuthentication from "../../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import AdditionalDetails from "../../../../components/streetVendorManagementSystem/components/AdditionalDetails";
import AddressOfHawker from "../../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import HawkerDetails from "../../../../components/streetVendorManagementSystem/components/HawkerDetails";
import PropertyAndWaterTaxes from "../../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import UploadButton from "../../../../components/streetVendorManagementSystem/fileUpload/UploadButtonHawker";
import UploadButtonHawkerPhoto from "../../../../components/streetVendorManagementSystem/fileUpload/UploadButtonHawkerPhoto";
import SiteVisitSchema from "../../../../components/streetVendorManagementSystem/schema/SiteVisitSchema";
import HawkerReusableCSS from "../../../../components/streetVendorManagementSystem/styles/hawkerReusableForAllComponents.module.css";
import SiteVisitCSS from "../../../../components/streetVendorManagementSystem/styles/siteVisit.module.css";
import styles from "../../../../components/streetVendorManagementSystem/styles/view.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import DocumentsUploadWithouDeleteButton from "../../../../components/streetVendorManagementSystem/components/DocumentsUploadWithouDeleteButton";
import swal from "sweetalert";

// SiteVisit
const SiteVisit = (props) => {
  const router = useRouter();
  const language = useSelector((state) => state?.labels?.language);
  // Methods in useForm
  const methods = useForm({
    defaultValues: {
      disabledFieldInputState: false,
    },
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(SiteVisitSchema(language)),
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
    clearErrors,
    formState: { errors },
  } = methods;

  const userToken = useGetToken();
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

  const getHawkerLicenseData = () => {
    setValue("loadderState", true);

    let url = ``;
    // issuance
    if (
      issuanceOfHawkerLicenseId != null &&
      issuanceOfHawkerLicenseId != undefined &&
      issuanceOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`;
    }
    // renewal
    else if (
      renewalOfHawkerLicenseId != null &&
      renewalOfHawkerLicenseId != undefined &&
      renewalOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/getById?id=${renewalOfHawkerLicenseId}`;
    }
    // cancellation
    else if (
      cancellationOfHawkerLicenseId != null &&
      cancellationOfHawkerLicenseId != undefined &&
      cancellationOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/cancellationOfHawkerLicense/getById?id=${cancellationOfHawkerLicenseId}`;
    }
    // transfer
    else if (
      transferOfHawkerLicenseId != null &&
      transferOfHawkerLicenseId != undefined &&
      transferOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/transferOfHawkerLicense/getById?id=${transferOfHawkerLicenseId}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          if (typeof r?.data == "object" && r?.data != undefined) {
            const FinalData = {
              ...r?.data,
              disabledFieldInputState: true,
              loadderState: false,
            };
            reset(FinalData);
            setShrinkTemp(true);
          }
        }
        setValue("loadderState", false);
      })
      .catch((errors) => {
        setValue("loadderState", false);
        callCatchMethod(errors, language);
      });
  };

  // OnSubmit Form
  const handleNext = (formData) => {
    setValue("loadderState", true);

    let siteVisit = null;
    let finalBodyForApi = null;
    let url = ``;

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
      url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
    }

    // renewal
    else if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
      localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
      localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
      siteVisit = {
        ...formData,
        renewalOfHawkerLicenseId,
      };

      finalBodyForApi = {
        id: renewalOfHawkerLicenseId,
        role: "SITE_VISIT",
        appointmentType: "S",
        siteVisit: [{ ...siteVisit }],
      };
      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfHawkerLicenseApprove`;
    }

    // cancelltion
    else if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      siteVisit = {
        ...formData,
        cancellationOfHawkerLicenseId,
      };

      finalBodyForApi = {
        id: cancellationOfHawkerLicenseId,
        role: "SITE_VISIT",
        appointmentType: "S",
        siteVisit: [{ ...siteVisit }],
      };
      url = `${urls.HMSURL}/cancellationOfHawkerLicense/saveCancellationOfHawkerLicenseApprove`;
    }

    // transfer
    else if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" &&
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
      siteVisit = {
        ...formData,
        transferOfHawkerLicenseId,
      };

      finalBodyForApi = {
        id: transferOfHawkerLicenseId,
        role: "SITE_VISIT",
        appointmentType: "S",
        siteVisit: [{ ...siteVisit }],
      };
      url = `${urls.HMSURL}/transferOfHawkerLicense/saveTransferOfHawkerLicenseApprove`;
    }


    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setValue("loadderState", false);
        if (res?.status == 200 || res?.status == 201) {
          language == "en"
            ? swal("site visit successfully conducted", {
              icon: "success",
              buttons: { ok: "OK" },
            })
            : swal("साइट भेट यशस्वीरित्या आयोजित केली", {
              icon: "success",
              buttons: { ok: "ठीक आहे" },
            });
          router.push("/streetVendorManagementSystem/dashboards");
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // idSet
  useEffect(() => {
    setValue("loadderState", true);
    setValue("siteVisitPhoto1", getValues("siteVisitPhoto1"));
    clearErrors("siteVisitPhoto1");
    setValue("siteVisitPhoto2", getValues("siteVisitPhoto2"));
    clearErrors("siteVisitPhoto2");
    setValue("siteVisitPhoto3", getValues("siteVisitPhoto3"));
    clearErrors("siteVisitPhoto3");
    setValue("siteVisitPhoto4", getValues("siteVisitPhoto4"));
    clearErrors("siteVisitPhoto4");
    setValue("siteVisitPhoto5", getValues("siteVisitPhoto5"));
    clearErrors("siteVisitPhoto5");
    setValue("streetVendorPhoto", getValues("streetVendorPhoto"));
    clearErrors("streetVendorPhoto");
    setValue("streetVendorThumb1", getValues("streetVendorThumb1"));
    clearErrors("streetVendorThumb1");
    setValue("streetVendorThumb2", getValues("streetVendorThumb2"));
    clearErrors("streetVendorThumb2");

    setValue("disabledFieldInputState", true);

    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      setLoadderState(true);
      setIssuanceOfHawkerLicenseId(
        localStorage.getItem("issuanceOfHawkerLicenseId")
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
        localStorage.getItem("renewalOfHawkerLicenseId")
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
        localStorage.getItem("cancellationOfHawkerLicenseId")
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
        localStorage.getItem("transferOfHawkerLicenseId")
      );
    } else {
      setValue("loadderState", false);
    }
  }, []);

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
    if (
      siteVisitPhoto1 != null &&
      siteVisitPhoto1 != undefined &&
      siteVisitPhoto1 != ""
    ) {
      setValue("siteVisitPhoto1", siteVisitPhoto1);
      clearErrors("siteVisitPhoto1");
    }

    if (
      siteVisitPhoto2 != null &&
      siteVisitPhoto2 != undefined &&
      siteVisitPhoto2 != ""
    ) {
      setValue("siteVisitPhoto2", siteVisitPhoto2);
      clearErrors("siteVisitPhoto2");
    }

    if (
      siteVisitPhoto3 != null &&
      siteVisitPhoto3 != undefined &&
      siteVisitPhoto3 != ""
    ) {
      setValue("siteVisitPhoto3", siteVisitPhoto3);
      clearErrors("siteVisitPhoto3");
    }

    if (
      siteVisitPhoto4 != null &&
      siteVisitPhoto4 != undefined &&
      siteVisitPhoto4 != ""
    ) {
      setValue("siteVisitPhoto4", siteVisitPhoto4);
      clearErrors("siteVisitPhoto4");
    }

    if (
      siteVisitPhoto5 != null &&
      siteVisitPhoto5 != undefined &&
      siteVisitPhoto5 != ""
    ) {
      setValue("siteVisitPhoto5", siteVisitPhoto5);
      clearErrors("siteVisitPhoto5");
    }

    if (
      streetVendorPhoto != null &&
      streetVendorPhoto != undefined &&
      streetVendorPhoto != ""
    ) {
      setValue("streetVendorPhoto", streetVendorPhoto);
      clearErrors("streetVendorPhoto");
    }

    if (
      streetVendorThumb1 != null &&
      streetVendorThumb1 != undefined &&
      streetVendorThumb1 != ""
    ) {
      setValue("streetVendorThumb1", streetVendorThumb1);
      clearErrors("streetVendorThumb1");
    }

    if (
      streetVendorThumb2 != null &&
      streetVendorThumb2 != undefined &&
      streetVendorThumb2 != ""
    ) {
      setValue("streetVendorThumb2", streetVendorThumb2);
      clearErrors("streetVendorThumb2");
    }
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
  }, [errors]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <Paper square className={SiteVisitCSS.Paper} elevation={5}>
          <div className={SiteVisitCSS.Heading}>
            {<FormattedLabel id="siteVisit" />}
          </div>

          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleNext)}>
                <ThemeProvider theme={theme}>
                  {shrinkTemp && (
                    <>
                      <HawkerDetails />
                      <AddressOfHawker />
                      <AadharAuthentication />
                      <PropertyAndWaterTaxes />
                      <AdditionalDetails />
                      <DocumentsUploadWithouDeleteButton />
                    </>
                  )}

                  {/** site visit photo */}
                  <div className={HawkerReusableCSS.MainHeader}>
                    <strong> {<FormattedLabel id="siteVisit" />}</strong>
                  </div>

                  {/** site visit photo */}
                  <Grid container className={HawkerReusableCSS.GridContainer}>
                    {/** site visit photo header */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      className={SiteVisitCSS.SiteVisitPhotoHeader}
                    >
                      {<FormattedLabel id="siteVisitPhotoUpload" />}
                    </Grid>
                    {/** site visit photo 1  */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={HawkerReusableCSS.GridItemSiteVisit}
                    >
                      <Typography
                        variant="subtitle2"
                        error={!!errors?.siteVisitPhoto1}
                      >
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto1" required />}
                        </strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButton
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setSiteVisitPhoto1}
                          fileName={siteVisitPhoto1}
                        />
                      </div>
                      <FormHelperText error={!!errors?.siteVisitPhoto1}>
                        {errors?.siteVisitPhoto1
                          ? errors?.siteVisitPhoto1?.message
                          : null}
                      </FormHelperText>
                    </Grid>
                    {/** site visit photo 2 */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={HawkerReusableCSS.GridItemSiteVisit}
                    >
                      <Typography
                        variant="subtitle2"
                        error={!!errors?.siteVisitPhoto2}
                      >
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto2" required />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto2}
                        fileName={siteVisitPhoto2}
                      />
                      <FormHelperText error={!!errors?.siteVisitPhoto2}>
                        {errors?.siteVisitPhoto2
                          ? errors?.siteVisitPhoto2?.message
                          : null}
                      </FormHelperText>
                    </Grid>
                    {/** site visit photo 3 */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={HawkerReusableCSS.GridItemSiteVisit}
                    >
                      <Typography
                        variant="subtitle2"
                        error={!!errors?.siteVisitPhoto3}
                      >
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto3" required />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto3}
                        fileName={siteVisitPhoto3}
                      />
                      <FormHelperText error={!!errors?.siteVisitPhoto3}>
                        {errors?.siteVisitPhoto3
                          ? errors?.siteVisitPhoto3?.message
                          : null}
                      </FormHelperText>
                    </Grid>
                    {/** site visit photo 4 */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={HawkerReusableCSS.GridItemSiteVisit}
                    >
                      <Typography
                        variant="subtitle2"
                        error={!!errors?.siteVisitPhoto4}
                      >
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto4" required />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto4}
                        fileName={siteVisitPhoto4}
                      />
                      <FormHelperText error={!!errors?.siteVisitPhoto4}>
                        {errors?.siteVisitPhoto4
                          ? errors?.siteVisitPhoto4?.message
                          : null}
                      </FormHelperText>
                    </Grid>

                    {/** site visit photo 5 */}

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={HawkerReusableCSS.GridItemSiteVisit}
                    >
                      <Typography
                        variant="subtitle2"
                        error={!!errors?.siteVisitPhoto5}
                      >
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto5" required />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto5}
                        fileName={siteVisitPhoto5}
                      />
                      <FormHelperText error={!!errors?.siteVisitPhoto5}>
                        {errors?.siteVisitPhoto5
                          ? errors?.siteVisitPhoto5?.message
                          : null}
                      </FormHelperText>
                    </Grid>

                    {/** for resuable */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
                  </Grid>

                  {/** Hawker Details - Photo */}
                  <Grid container className={HawkerReusableCSS.GridContainer}>
                    {/** site visit photo header main */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      className={SiteVisitCSS.SiteVisitHawkerDetailHeader}
                    >
                      {<FormattedLabel id="streetVendorInformation" />}
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={HawkerReusableCSS.GridItemSiteVisit}
                    >
                      <Typography
                        variant="subtitle2"
                        error={!!errors?.streetVendorPhoto}
                      >
                        <strong>
                          {<FormattedLabel id="streetVendorPhoto" required />}
                        </strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButtonHawkerPhoto
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setStreetVendorPhoto}
                          fileName={streetVendorPhoto}
                        />
                      </div>
                      <FormHelperText error={!!errors?.streetVendorPhoto}>
                        {errors?.streetVendorPhoto
                          ? errors?.streetVendorPhoto?.message
                          : null}
                      </FormHelperText>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={HawkerReusableCSS.GridItemSiteVisit}
                    >
                      <Typography
                        variant="subtitle2"
                        error={!!errors?.streetVendorThumb1}
                      >
                        <strong>
                          {<FormattedLabel id="streetVendorThumb1" required />}
                        </strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButtonHawkerPhoto
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setStreetVendorThumb1}
                          fileName={streetVendorThumb1}
                        />
                        <FormHelperText error={!!errors?.streetVendorThumb1}>
                          {errors?.streetVendorThumb1
                            ? errors?.streetVendorThumb1?.message
                            : null}
                        </FormHelperText>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      className={HawkerReusableCSS.GridItemSiteVisit}
                    >
                      <Typography
                        variant="subtitle2"
                        error={!!errors?.streetVendorThumb2}
                      >
                        <strong>
                          {<FormattedLabel id="streetVendorThumb2" required />}
                        </strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButtonHawkerPhoto
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setStreetVendorThumb2}
                          fileName={streetVendorThumb2}
                        />
                        <FormHelperText error={!!errors?.streetVendorThumb2}>
                          {errors?.streetVendorThumb2
                            ? errors?.streetVendorThumb2?.message
                            : null}
                        </FormHelperText>
                      </div>
                    </Grid>

                    {/** for resuable */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
                  </Grid>

                  {/** site visit questions */}
                  <Grid container className={HawkerReusableCSS.GridContainer}>
                    {/** question Header */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      className={SiteVisitCSS.SiteVisitQuestionHeader}
                    >
                      {<FormattedLabel id="streetVendorQuestion" />}
                    </Grid>

                    {/** road width */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      className={SiteVisitCSS.SiteVisitQuestionAnswer}
                    >
                      <TextField
                        className={SiteVisitCSS.RoadWidthTextField}
                        label=<FormattedLabel
                          id="roadWithBusinessLocation"
                          required
                        />
                        error={!!errors?.roadWithBusinessLocation}
                        helperText={
                          errors?.roadWithBusinessLocation
                            ? errors?.roadWithBusinessLocation?.message
                            : null
                        }
                        variant="standard"
                        {...register("roadWithBusinessLocation")}
                      />
                    </Grid>
                    {/** business location */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      className={SiteVisitCSS.SiteVisitQuestionAnswer}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {
                            <FormattedLabel
                              id="businessHawkinglocation"
                              required
                            />
                          }
                        </FormLabel>
                        <Controller
                          name="businessHawkinglocation"
                          control={control}
                          defaultValue="Applicant itSelef"
                          render={({ field }) => (
                            <RadioGroup
                              className={
                                SiteVisitCSS.RadioButtonBusinessLocation
                              }
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
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
                        <FormHelperText>
                          {errors?.businessHawkinglocation
                            ? errors.businessHawkinglocation.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/** insfection selling selling foods */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      className={SiteVisitCSS.SiteVisitQuestionAnswer}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {
                            <FormattedLabel
                              id="inspectionSellingGoods"
                              required
                            />
                          }
                        </FormLabel>
                        <Controller
                          name="inspectionSellingGoods"
                          control={control}
                          defaultValue="false"
                          render={({ field }) => (
                            <RadioGroup
                              className={
                                SiteVisitCSS.RadioButtoninsefectionSellingFood
                              }
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
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

                    {/** business cause traffic congestion */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      className={SiteVisitCSS.SiteVisitQuestionAnswer}
                    >
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {
                            <FormattedLabel
                              id="businessTrafficCongestion"
                              required
                            />
                          }
                        </FormLabel>
                        <Controller
                          name="businessTrafficCongestion"
                          control={control}
                          defaultValue="false"
                          render={({ field }) => (
                            <RadioGroup
                              className={
                                SiteVisitCSS.RadioButtonBusinessTraffice
                              }
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
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

                    {/** remark title */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      sx={{ marginTop: 2 }}
                    >
                      <div className={SiteVisitCSS.SitieVisitRemark}>
                        <div className={SiteVisitCSS.SiteRemarkTitle}>
                          {/** remark title */}
                          <FormattedLabel id="remark" required />
                        </div>
                        {/** remark TextField */}
                        <div>
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
                                  {...register("siteVisitRemark")}
                                  className={SiteVisitCSS.TextareaAutosizeCSS}
                                />
                              )}
                            />
                            <FormHelperText>
                              {errors?.siteVisitRemark
                                ? errors.siteVisitRemark.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                      </div>
                    </Grid>
                  </Grid>

                  {/** Buttons Grid */}
                  <Grid container className={HawkerReusableCSS.GridContainer}>
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
                        {/** Submit  Button*/}
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          {<FormattedLabel id="submit" />}
                        </Button>
                        {/** Exit Button */}
                        <Button
                          onClick={() => {
                            setValue("loadderState", true);
                            localStorage.removeItem(
                              "issuanceOfHawkerLicenseId"
                            );
                            router.push(
                              "/streetVendorManagementSystem/dashboards"
                            );
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
