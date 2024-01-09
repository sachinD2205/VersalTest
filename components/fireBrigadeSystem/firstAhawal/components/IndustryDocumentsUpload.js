import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import UploadButton from "../../fileUpload/UploadButton.js";
import styles from "../../../../styles/skysignstyles/documentUpload.module.css";

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

  const [registrarionCertificate, setregistrarionCertificate] = useState(null);
  const [buildingCommencementCertificate, setbuildingCommencementCertificate] = useState(null);
  const [Rawsiteviewermap, setRawsiteviewermap] = useState(null);
  const [slumNOC, setslumNOC] =
    useState(null);
  const [foodLicense, setfoodLicense] = useState(null);
  const [agreementLetter, seteagreementLetter] =
    useState(null);
  const [occupancyCertificate, setoccupancyCertificate] =
    useState(null);
  const [environmentalNoc, setenvironmentalNoc] =
    useState(null);



  // @ First UseEffect
  useEffect(() => {
    if (getValues("buildingCommencementCertificate") != null) {
      setbuildingCommencementCertificate(getValues("buildingCommencementCertificate"));
    }
    if (getValues("registrarionCertificate") != null) {
      setregistrarionCertificate(getValues("registrarionCertificate"));
    }
    if (getValues("Rawsiteviewermap") != null) {
      setRawsiteviewermap(getValues("Rawsiteviewermap"));
    }
    if (getValues("slumNOC") != null) {
      setslumNOC(getValues("slumNOC"));
    }
    if (getValues("foodLicense") != null) {
      setfoodLicense(getValues("foodLicense"));
    }
    if (getValues("agreementLetter") != null) {
      seteagreementLetter(
        getValues("agreementLetter"),
      );
    }
    if (getValues("occupancyCertificate") != null) {
      setoccupancyCertificate(
        getValues("occupancyCertificate"),
      );
    }
    if (getValues("environmentalNoc") != null) {
      setenvironmentalNoc(
        getValues("environmentalNoc"),
      );
    }
  }, []);

  // @ Second UseEffect
  useEffect(() => {
    setValue("buildingCommencementCertificate", buildingCommencementCertificate);
    setValue("registrarionCertificate", registrarionCertificate);
    setValue("Rawsiteviewermap", Rawsiteviewermap);
    setValue("slumNOC", slumNOC);
    setValue("foodLicense", foodLicense);
    setValue("agreementLetter", agreementLetter);
    setValue("occupancyCertificate", occupancyCertificate);
    setValue("environmentalNoc", environmentalNoc);
  }, [
    buildingCommencementCertificate,
    registrarionCertificate,
    Rawsiteviewermap,
    slumNOC,
    foodLicense,
    agreementLetter,
    occupancyCertificate,
    environmentalNoc,
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
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='buildingCommencementCertificate' />}</strong>
          </Typography>
          <div className={styles.attachFile}>
            <UploadButton
              appName='SSLM'
              serviceName='S-IssuanceofSkyLicense'
              filePath={setbuildingCommencementCertificate}
              fileName={buildingCommencementCertificate}
            // fileData={buildingCommencementCertificateData}
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='registrarionCertificate' />}</strong>
          </Typography>
          <UploadButton
            appName='SSLM'
            serviceName='S-IssuanceofSkyLicense'
            filePath={setregistrarionCertificate}
            fileName={registrarionCertificate}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='rawsiteviewermap' />}</strong>
          </Typography>
          <UploadButton
            appName='SSLM'
            serviceName='S-IssuanceofSkyLicense'
            filePath={setRawsiteviewermap}
            fileName={Rawsiteviewermap}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='slumNOC' />}</strong>
          </Typography>
          <UploadButton
            appName='SSLM'
            serviceName='S-IssuanceofSkyLicense'
            filePath={setslumNOC}
            fileName={slumNOC}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <Typography variant='subtitle2'>
            <strong>{<FormattedLabel id='foodLicense' />}</strong>
          </Typography>
          <UploadButton
            appName='SSLM'
            serviceName='S-IssuanceofSkyLicense'
            filePath={setfoodLicense}
            fileName={foodLicense}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <Typography variant='subtitle2'>
            <strong>
              {<FormattedLabel id='agreementLetter' />}
            </strong>
          </Typography>
          <UploadButton
            appName='SSLM'
            serviceName='S-IssuanceofSkyLicense'
            filePath={seteagreementLetter}
            fileName={agreementLetter}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <Typography variant='subtitle2'>
            <strong>
              {<FormattedLabel id='occupancyCertificate' />}
            </strong>
          </Typography>
          <UploadButton
            appName='SSLM'
            serviceName='S-IssuanceofSkyLicense'
            filePath={setoccupancyCertificate}
            fileName={occupancyCertificate}
          />

        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <Typography variant='subtitle2'>
            <strong>
              {<FormattedLabel id='environmentalNoc' />}
            </strong>
          </Typography>
          <UploadButton
            appName='SSLM'
            serviceName='S-IssuanceofSkyLicense'
            filePath={setenvironmentalNoc}
            fileName={environmentalNoc}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default DocumentsUpload;
