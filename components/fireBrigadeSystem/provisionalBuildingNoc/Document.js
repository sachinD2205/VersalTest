import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import UploadButton from "../../fileUpload/UploadButton.js";

/** Sachin Durge */
// Document
const Document = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [overHearWaterTankCoApprovedMaps, setWaterTank] = useState(null);
  const [approvedKeyPlan, setLayoutPlan] = useState(null);
  const [approvedLayoutPlanPCMC, setTank] = useState(null);
  const [approvedApproachRoadPCMC, setPermission] = useState(null);
  const [measurementOfTank, setStability] = useState(null);
  const [explosiveLicense, setFireDrawing] = useState(null);
  const [permissionLetterOfPCMC, setElivation] = useState(null);
  const [completionCertificate, setRoad] = useState(null);
  const [structuralStabilityCertificate, setExplosive] = useState(null);
  const [escalatorApprovedByGovtCertificate, setCompletion] = useState(null);
  const [lift, setLift] = useState(null);

  // firstUseEffect
  useEffect(() => {
    if (getValues("overHearWaterTankCoApprovedMaps") != null) {
      setWaterTank(getValues("overHearWaterTankCoApprovedMaps"));
    }
    if (getValues("approvedKeyPlan") != null) {
      setLayoutPlan(getValues("approvedKeyPlan"));
    }
    if (getValues("approvedLayoutPlanPCMC") != null) {
      setTank(getValues("approvedLayoutPlanPCMC"));
    }
    if (getValues("approvedApproachRoadPCMC") != null) {
      setPermission(getValues("approvedApproachRoadPCMC"));
    }
    if (getValues("measurementOfTank") != null) {
      setStability(getValues("measurementOfTank"));
    }
    if (getValues("explosiveLicense") != null) {
      setFireDrawing(getValues("explosiveLicense"));
    }
    if (getValues("permissionLetterOfPCMC") != null) {
      setElivation(getValues("permissionLetterOfPCMC"));
    }
    if (getValues("completionCertificate") != null) {
      setRoad(getValues("completionCertificate"));
    }
    if (getValues("structuralStabilityCertificate") != null) {
      setExplosive(getValues("structuralStabilityCertificate"));
    }
    if (getValues("escalatorApprovedByGovtCertificate") != null) {
      setCompletion(getValues("escalatorApprovedByGovtCertificate"));
    }

    if (getValues("fireDrawingFloorWiseAlsoApprovedByComplianceAuthority") != null) {
      setLift(getValues("fireDrawingFloorWiseAlsoApprovedByComplianceAuthority"));
    }
  }, []);

  // secondUseEffect
  useEffect(() => {
    setValue("overHearWaterTankCoApprovedMaps", overHearWaterTankCoApprovedMaps);
    setValue("approvedKeyPlan", approvedKeyPlan);
    setValue("approvedLayoutPlanPCMC", approvedLayoutPlanPCMC);
    setValue("approvedApproachRoadPCMC", approvedApproachRoadPCMC);
    setValue("measurementOfTank", measurementOfTank);
    setValue("explosiveLicense", explosiveLicense);
    setValue("permissionLetterOfPCMC", permissionLetterOfPCMC);
    setValue("completionCertificate", completionCertificate);
    setValue("structuralStabilityCertificate", structuralStabilityCertificate);
    setValue("escalatorApprovedByGovtCertificate", escalatorApprovedByGovtCertificate);
    setValue("lift", lift);
  }, [
    overHearWaterTankCoApprovedMaps,
    approvedKeyPlan,
    approvedLayoutPlanPCMC,
    approvedApproachRoadPCMC,
    measurementOfTank,
    explosiveLicense,
    permissionLetterOfPCMC,
    completionCertificate,
    structuralStabilityCertificate,
    escalatorApprovedByGovtCertificate,
    escalatorApprovedByGovtCertificate,
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
        Documents Upload
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
          <Typography variant="subtitle2">
            {/* <strong>{<FormattedLabel id="adharCard" />}</strong> */}
            Over Hear Water Tank Coapproved Maps
          </Typography>
          <div>
            <UploadButton
              appName="FBS"
              serviceName="ProvisionalBuildingFire"
              filePath={setWaterTank}
              fileName={overHearWaterTankCoApprovedMaps}
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            {/* <strong>{<FormattedLabel id="panCard" />}</strong> */}
            Approved Layout Plan PCMC
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setLayoutPlan}
            fileName={approvedKeyPlan}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            {/* <strong>{<FormattedLabel id="rationCard" />}</strong> */}
            Measurement Of Tank (Underground , Overhead) with Map
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setTank}
            fileName={escalatorApprovedByGovtCertificate}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            {/* <strong>{<FormattedLabel id="disablityCretificatePhoto" />}</strong> */}
            Permission letter Of PCMC
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setPermission}
            fileName={approvedApproachRoadPCMC}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            {/* <strong>{<FormattedLabel id="otherDocumentPhoto" />}</strong> */}
            Structural Stability Certificate
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setStability}
            fileName={measurementOfTank}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            {/* <strong> */}
            {/* {<FormattedLabel id="affidaviteOnRS100StampAttachement" />} */}
            {/* </strong> */}
            Fire Drawing Floor wise i.e. also approved by Compliance authority
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setFireDrawing}
            fileName={explosiveLicense}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            {/* <strong> */}
            {/* {<FormattedLabel id="affidaviteOnRS100StampAttachement" />} */}
            {/* </strong> */}
            Approved Key Plan, Site Plan , Elivation Section PCMC
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setElivation}
            fileName={permissionLetterOfPCMC}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            {/* <strong>
              {<FormattedLabel id="affidaviteOnRS100StampAttachement" />}
            </strong> */}
            Approved Approach Road PCMC
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setRoad}
            fileName={completionCertificate}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            {/* <strong>
              {<FormattedLabel id="affidaviteOnRS100StampAttachement" />}
            </strong> */}
            Explosive License (for LGP, CNG , Petrol Pump ,Gas Station , Gas Storage)
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setExplosive}
            fileName={structuralStabilityCertificate}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            {/* <strong>
              {<FormattedLabel id="affidaviteOnRS100StampAttachement" />}
            </strong> */}
            Completion Certificate
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setCompletion}
            fileName={escalatorApprovedByGovtCertificate}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            {/* <strong>
              {<FormattedLabel id="affidaviteOnRS100StampAttachement" />}
            </strong> */}
            Escalator / Lift Approved by Govt Certificate
          </Typography>
          <UploadButton
            appName="FBS"
            serviceName="ProvisionalBuildingFire"
            filePath={setLift}
            fileName={structuralStabilityCertificate}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default Document;
