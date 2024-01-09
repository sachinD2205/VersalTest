import { FormHelperText, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import UploadButton1 from "../fileUpload/UploadButton1";
import styles from "../styles/documentUpload.module.css";
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css";

/** Author - Sachin Durge */
// DocumentsUpload
const DocumentsUploadWithouDeleteButton = () => {
  const {
    control,
    register,
    reset,
    getValues,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [panCardPhoto, setPanCardPhoto] = useState(null);
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [rationCardPhoto, setRationCardPhoto] = useState(null);
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] =
    useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [applicantPhoto, setApplicantPhoto] = useState(null);
  const [chequeorPassbookPhoto, setChequeOrPassbookPhoto] = useState(null);
  const [shopBusinessOldLicensePhoto, setBusinessOldLicensePhoto] =
    useState(null);

  // @ First UseEffect
  useEffect(() => {
    // aadhar photo
    if (watch("aadharPhoto") != null) {
      setAadharPhoto(watch("aadharPhoto"));
      clearErrors("aadharPhoto");
    }
    // pan card photo
    if (watch("panCardPhoto") != null) {
      setPanCardPhoto(watch("panCardPhoto"));
      clearErrors("panCardPhoto");
    }
    // ration card photo
    if (watch("rationCardPhoto") != null) {
      setRationCardPhoto(watch("rationCardPhoto"));
      clearErrors("rationCardPhoto");
    }
    // disablity certificate photo
    if (watch("disablityCertificatePhoto") != null) {
      setDisablityCertificatePhoto(watch("disablityCertificatePhoto"));
      clearErrors("disablityCertificatePhoto");
    }
    // other document photo
    if (watch("otherDocumentPhoto") != null) {
      setOtherDocumentPhoto(watch("otherDocumentPhoto"));
      clearErrors("otherDocumentPhoto");
    }

    // applicant photo
    if (
      watch("applicantPhoto") != null ||
      watch("applicantPhoto") != undefined
    ) {
      setApplicantPhoto(watch("applicantPhoto"));
      clearErrors("applicantPhoto");
    }

    // cheque or passbook photo
    if (
      watch("chequeorPassbookPhoto") != null ||
      watch("chequeorPassbookPhoto") != undefined
    ) {
      setChequeOrPassbookPhoto(watch("chequeorPassbookPhoto"));
      clearErrors("chequeorPassbookPhoto");
    }

    // shop business old License photo
    if (
      watch("shopBusinessOldLicensePhoto") != null ||
      watch("shopBusinessOldLicensePhoto") != undefined
    ) {
      setBusinessOldLicensePhoto(watch("shopBusinessOldLicensePhoto"));
      clearErrors("shopBusinessOldLicensePhoto");
    }
  }, []);

  // @ Second UseEffect
  useEffect(() => {
    setValue("aadharPhoto", aadharPhoto);
    setValue("panCardPhoto", panCardPhoto);
    setValue("rationCardPhoto", rationCardPhoto);
    setValue("disablityCertificatePhoto", disablityCertificatePhoto);
    setValue("otherDocumentPhoto", otherDocumentPhoto);
    setValue("applicantPhoto", applicantPhoto);
    setValue("shopBusinessOldLicensePhoto", shopBusinessOldLicensePhoto);
    setValue("chequeorPassbookPhoto", chequeorPassbookPhoto);
  }, [
    aadharPhoto,
    panCardPhoto,
    rationCardPhoto,
    disablityCertificatePhoto,
    otherDocumentPhoto,
    applicantPhoto,
    shopBusinessOldLicensePhoto,
    chequeorPassbookPhoto,
  ]);

  // view
  return (
    <>
      {/** Document Upload Header */}
      <div className={HawkerReusableCSS.MainHeader}>
        <strong>{<FormattedLabel id="documentUploadview" />}</strong>
      </div>
      <Grid container className={HawkerReusableCSS.GridContainerFileUpload}>
        {/** Hawker Photo Card */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        >
          <Typography variant="subtitle2" error={!!errors?.applicantPhoto}>
            <strong>{<FormattedLabel id="hawkerPhoto" />}</strong>
          </Typography>

          <div className={styles.attachFile}>
            <UploadButton1
              appName="HMS"
              serviceName="H-IssuanceofHawkerLicense"
              filePath={setApplicantPhoto}
              fileName={applicantPhoto}
              // fileData={applicantPhoto}
            />
            <FormHelperText error={!!errors?.applicantPhoto}>
              {errors?.applicantPhoto ? errors?.applicantPhoto?.message : null}
            </FormHelperText>
          </div>
        </Grid>
        {/** aadhaar Card number */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        >
          <Typography variant="subtitle2" error={!!errors?.aadharPhoto}>
            <strong>{<FormattedLabel id="adharCard" />}</strong>
          </Typography>
          <div className={styles.attachFile}>
            <UploadButton1
              appName="HMS"
              serviceName="H-IssuanceofHawkerLicense"
              filePath={setAadharPhoto}
              fileName={aadharPhoto}
              // fileData={aadhaarCardPhotoData}
            />
            <FormHelperText error={!!errors?.aadharPhoto}>
              {errors?.aadharPhoto ? errors?.aadharPhoto?.message : null}
            </FormHelperText>
          </div>
        </Grid>
        {/** pan Card number */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        >
          <Typography variant="subtitle2" error={!!errors?.panCardPhoto}>
            <strong>{<FormattedLabel id="panCard" />}</strong>
          </Typography>
          <UploadButton1
            error={!!errors?.panCardPhoto}
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setPanCardPhoto}
            fileName={panCardPhoto}
          />
          <FormHelperText error={!!errors?.panCardPhoto}>
            {errors?.panCardPhoto ? errors?.panCardPhoto?.message : null}
          </FormHelperText>
        </Grid>
        {/** shop business old licences phtoto  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          sx={{ marginTop: 2 }}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        >
          <Typography
            variant="subtitle2"
            error={!!errors?.shopBusinessOldLicensePhoto}
          >
            <strong>
              {<FormattedLabel id="shopBusinessOldLicensePhoto" />}
            </strong>
          </Typography>
          <UploadButton1
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setBusinessOldLicensePhoto}
            fileName={shopBusinessOldLicensePhoto}
          />
          <FormHelperText error={!!errors?.shopBusinessOldLicensePhoto}>
            {errors?.shopBusinessOldLicensePhoto
              ? errors?.shopBusinessOldLicensePhoto?.message
              : null}
          </FormHelperText>
        </Grid>

        {/** ration card number */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        >
          <Typography variant="subtitle2" error={!!errors?.rationCardPhoto}>
            <strong>{<FormattedLabel id="rationCard" />}</strong>
          </Typography>
          <UploadButton1
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setRationCardPhoto}
            fileName={rationCardPhoto}
          />
          <FormHelperText error={!!errors?.rationCardPhoto}>
            {errors?.rationCardPhoto ? errors?.rationCardPhoto?.message : null}
          </FormHelperText>
        </Grid>
        {/** disablity certificate photo */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        >
          <Typography
            variant="subtitle2"
            // error={!!errors?.disablityCertificatePhoto}
          >
            <strong>{<FormattedLabel id="disablityCretificatePhoto" />}</strong>
          </Typography>
          <UploadButton1
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setDisablityCertificatePhoto}
            fileName={disablityCertificatePhoto}
          />
          {/*
          <FormHelperText error={!!errors?.disablityCertificatePhoto}>
            {errors?.disablityCertificatePhoto
              ? errors?.disablityCertificatePhoto?.message
              : null}
          </FormHelperText>
          * */}
        </Grid>
        {/** other photo */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          sx={{ marginTop: 2 }}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        >
          <Typography variant="subtitle2" error={!!errors?.otherDocumentPhoto}>
            <strong>{<FormattedLabel id="otherDocumentPhoto" />}</strong>
          </Typography>
          <UploadButton1
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setOtherDocumentPhoto}
            fileName={otherDocumentPhoto}
          />
          <FormHelperText error={!!errors?.otherDocumentPhoto}>
            {errors?.otherDocumentPhoto
              ? errors?.otherDocumentPhoto?.message
              : null}
          </FormHelperText>
        </Grid>
        {/** Cheque or Passbook photo  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          sx={{ marginTop: 2 }}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        >
          <Typography
            variant="subtitle2"
            error={!!errors?.chequeorPassbookPhoto}
          >
            <strong>{<FormattedLabel id="chequeorPassbookPhoto" />}</strong>
          </Typography>
          <UploadButton1
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setChequeOrPassbookPhoto}
            fileName={chequeorPassbookPhoto}
          />
          <FormHelperText error={!!errors?.chequeorPassbookPhoto}>
            {errors?.chequeorPassbookPhoto
              ? errors?.chequeorPassbookPhoto?.message
              : null}
          </FormHelperText>
        </Grid>
        {/** for reusble onle */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        ></Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenterFileUplaod}
        ></Grid>
      </Grid>
    </>
  );
};
export default DocumentsUploadWithouDeleteButton;
