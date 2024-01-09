import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import UploadButton from "../../fileUpload/UploadButton.js";
import styles from "../styles/documentUpload.module.css";

// Documents Upload
const DocumentsUpload = () => {
  // UseForm Context
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  // { resolver: yupResolver(schema) }

  const [panCardPhoto, setPanCardPhoto] = useState(null);
  const [aadhaarCardPhoto, setAadhaarCardPhoto] = useState(null);
  const [rationCardPhoto, setRationCardPhoto] = useState(null);
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] =
    useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] =
    useState(null);

  // @ First UseEffect
  useEffect(() => {
    if (getValues("aadhaarCardPhoto") != null) {
      setAadhaarCardPhoto(getValues("aadhaarCardPhoto"));
    }
    if (getValues("panCardPhoto") != null) {
      setPanCardPhoto(getValues("panCardPhoto"));
    }
    if (getValues("rationCardPhoto") != null) {
      setRationCardPhoto(getValues("rationCardPhoto"));
    }
    if (getValues("disablityCertificatePhoto") != null) {
      setDisablityCertificatePhoto(getValues("disablityCertificatePhoto"));
    }
    if (getValues("otherDocumentPhoto") != null) {
      setOtherDocumentPhoto(getValues("otherDocumentPhoto"));
    }
    if (getValues("affidaviteOnRS100StampAttache") != null) {
      seteAffidaviteOnRS100StampAttache(
        getValues("affidaviteOnRS100StampAttache"),
      );
    }
  }, []);

  // @ Second UseEffect
  useEffect(() => {
    setValue("aadhaarCardPhoto", aadhaarCardPhoto);
    setValue("panCardPhoto", panCardPhoto);
    setValue("rationCardPhoto", rationCardPhoto);
    setValue("disablityCertificatePhoto", disablityCertificatePhoto);
    setValue("otherDocumentPhoto", otherDocumentPhoto);
    setValue("affidaviteOnRS100StampAttache", affidaviteOnRS100StampAttache);
  }, [
    aadhaarCardPhoto,
    panCardPhoto,
    rationCardPhoto,
    disablityCertificatePhoto,
    otherDocumentPhoto,
    affidaviteOnRS100StampAttache,
  ]);

  // view
  return (
    <>
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
        <strong>{<FormattedLabel id='documentUpload' />}</strong>
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
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='adharCard' />}</strong>
          </Typography>
          <div className={styles.attachFile}>
            <UploadButton
              appName='HMS'
              serviceName='H-IssuanceofHawkerLicense'
              filePath={setAadhaarCardPhoto}
              fileName={aadhaarCardPhoto}
              // fileData={aadhaarCardPhotoData}
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='panCard' />}</strong>
          </Typography>
          <UploadButton
            appName='HMS'
            serviceName='H-IssuanceofHawkerLicense'
            filePath={setPanCardPhoto}
            fileName={panCardPhoto}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='rationCard' />}</strong>
          </Typography>
          <UploadButton
            appName='HMS'
            serviceName='H-IssuanceofHawkerLicense'
            filePath={setRationCardPhoto}
            fileName={rationCardPhoto}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='disablityCretificatePhoto' />}</strong>
          </Typography>
          <UploadButton
            appName='HMS'
            serviceName='H-IssuanceofHawkerLicense'
            filePath={setDisablityCertificatePhoto}
            fileName={disablityCertificatePhoto}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 4 }}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='otherDocumentPhoto' />}</strong>
          </Typography>
          <UploadButton
            appName='HMS'
            serviceName='H-IssuanceofHawkerLicense'
            filePath={setOtherDocumentPhoto}
            fileName={otherDocumentPhoto}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
          <Typography variant='subtitle2'>
            <strong>
              {<FormattedLabel id='affidaviteOnRS100StampAttachement' />}
            </strong>
          </Typography>
          <UploadButton
            appName='HMS'
            serviceName='H-IssuanceofHawkerLicense'
            filePath={seteAffidaviteOnRS100StampAttache}
            fileName={affidaviteOnRS100StampAttache}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default DocumentsUpload;
