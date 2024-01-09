import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import UploadButton from "../../fileUpload/UploadButton.js";
import UploadButton from "../../../../components/fileUpload/UploadButton";
import styles from "../../../../styles/skysignstyles/documentUpload.module.css";
import UploadButton1 from "../../../../components/fileUpload/UploadButton1";
import { useRouter } from "next/router";
import { FormProvider } from "react-hook-form";

import ScrutinyAction from "../../../skySignLicense/transactions/components/ScrutinyAction";

import { Stack, Button, DialogContent } from "@mui/material";
// Documents Upload
const DocumentsView = () => {
  // UseForm
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  // { resolver: yupResolver(schema) }

  const router = useRouter();
  const methods = useForm();

  const [registrarionCertificate, setregistrarionCertificate] = useState(null);
  const [buildingCommencementCertificate, setbuildingCommencementCertificate] =
    useState(null);
  const [Rawsiteviewermap, setRawsiteviewermap] = useState(null);
  const [slumNOC, setslumNOC] = useState(null);
  const [foodLicense, setfoodLicense] = useState(null);
  const [agreementLetter, seteagreementLetter] = useState(null);
  const [occupancyCertificate, setoccupancyCertificate] = useState(null);
  const [environmentalNoc, setenvironmentalNoc] = useState(null);

  // const viewRecord = (record) => {
  //   console.log("record", JSON.stringify(record));
  //   router.push({
  //     pathname: `/skySignLicense/transactions/ScrutinyAction`,
  //     query: {
  //       ...record,
  //       pagemode: "view",
  //       disabled: true,
  //     },
  //   });
  // };

  //   // @ First UseEffect
  //   useEffect(() => {
  //     console.log("foodLicense1", router.query.slumNOC);
  //     if (getValues("buildingCommencementCertificate") != null) {
  //       setbuildingCommencementCertificate(
  //         getValues("buildingCommencementCertificate")
  //       );
  //     }
  //     if (getValues("registrarionCertificate") != null) {
  //       setregistrarionCertificate(getValues("registrarionCertificate"));
  //     }
  //     if (getValues("Rawsiteviewermap") != null) {
  //       setRawsiteviewermap(getValues("Rawsiteviewermap"));
  //     }
  //     if (getValues("slumNOC") != null) {
  //       setslumNOC(router.query.slumNOC);
  //     }
  //     if (getValues("foodLicense") != null) {
  //       console.log("foodLicense1", router.query.slumNOC);
  //       setfoodLicense(router.query.foodLicense1);
  //     }
  //     if (getValues("agreementLetter") != null) {
  //       seteagreementLetter(getValues("agreementLetter"));
  //     }
  //     if (getValues("occupancyCertificate") != null) {
  //       setoccupancyCertificate(getValues("occupancyCertificate"));
  //     }
  //     if (getValues("environmentalNoc") != null) {
  //       setenvironmentalNoc(getValues("environmentalNoc"));
  //     }
  //   }, []);

  // @ Second UseEffect
  useEffect(() => {
    // console.log("foodLicense1", router.query.slumNOC);
    // setValue(
    //   "buildingCommencementCertificate",
    //   buildingCommencementCertificate
    // );
    // setValue("registrarionCertificate", registrarionCertificate);
    // setValue("Rawsiteviewermap", Rawsiteviewermap);
    // setValue("slumNOC", router.query.slumNOC);
    // setValue("foodLicense", foodLicense);
    // setValue("agreementLetter", agreementLetter);
    // setValue("occupancyCertificate", occupancyCertificate);
    // setValue("environmentalNoc", environmentalNoc);
  }, [router.query]);

  // Revert Button
  const revertButton = () => {
    documentPreviewDailogClose();
    documentRemarkModalOpen();
  };

  // Approve Button
  const approveButton = () => {
    documentPreviewDailogClose();
    sendApprovedNotify();
  };

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
        Document View
        {/* <strong>{<FormattedLabel id='documentUpload' />}</strong> */}
      </div>
      <Grid
        container
        sx={{
          marginTop: 0,
          marginBottom: 5,
          paddingLeft: "7px",
          align: "center",
        }}
      >
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <table
            style={{
              border: "1",
              cellpadding: "5",
              cellspacing: "5",
              width: "1700px",
              height: "400px",
            }}
          >
            <thead
              style={{
                height: "50px",
              }}
            >
              <tr
                style={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <th>sr.no</th>
                <th>Document Name</th>
                <th>Mandatory</th>
                <th>View Document</th>
              </tr>
            </thead>
            <tbody
              style={{
                textAlign: "left",
              }}
            >
              <tr>
                <td>1</td>
                <td>
                  <Typography variant="subtitle2">
                    <strong>
                      {<FormattedLabel id="buildingCommencementCertificate" />}
                    </strong>
                  </Typography>
                </td>
                <td>Required</td>
                <td>
                  <UploadButton1
                    appName="SSLM"
                    serviceName="S-IssuanceofSkyLicense"
                    filePath={setbuildingCommencementCertificate}
                    fileName={router.query.buildingCommencementCertificate}
                  />
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <Typography variant="subtitle2">
                    <strong>
                      {<FormattedLabel id="registrarionCertificate" />}
                    </strong>
                  </Typography>
                </td>
                <td>Required</td>
                <td>
                  <UploadButton1
                    appName="SSLM"
                    serviceName="S-IssuanceofSkyLicense"
                    filePath={setregistrarionCertificate}
                    fileName={router.query.registrarionCertificate}
                  />
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  <Typography variant="subtitle2">
                    <strong>{<FormattedLabel id="rawsiteviewermap" />}</strong>
                  </Typography>
                </td>
                <td>Required</td>
                <td>
                  <UploadButton1
                    appName="SSLM"
                    serviceName="S-IssuanceofSkyLicense"
                    filePath={setRawsiteviewermap}
                    fileName={router.query.rawsiteviewermap}
                  />
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  {" "}
                  <Typography variant="subtitle2">
                    <strong>{<FormattedLabel id="slumNOC" />}</strong>
                  </Typography>
                </td>
                <td>Required</td>
                <td>
                  <UploadButton1
                    appName="SSLM"
                    serviceName="S-IssuanceofSkyLicense"
                    filePath={setslumNOC}
                    fileName={router.query.slumNOC}
                  />
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>
                  {" "}
                  <Typography variant="subtitle2">
                    <strong>{<FormattedLabel id="foodLicense" />}</strong>
                  </Typography>{" "}
                </td>
                <td>Required</td>
                <td>
                  <UploadButton1
                    appName="SSLM"
                    serviceName="S-IssuanceofSkyLicense"
                    filePath={setfoodLicense}
                    fileName={router.query.foodLicense}
                  />
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>
                  {" "}
                  <Typography variant="subtitle2">
                    <strong>{<FormattedLabel id="agreementLetter" />}</strong>
                  </Typography>
                </td>
                <td>Required</td>
                <td>
                  <UploadButton1
                    appName="SSLM"
                    serviceName="S-IssuanceofSkyLicense"
                    filePath={seteagreementLetter}
                    fileName={router.query.agreementLetter}
                  />
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>
                  <Typography variant="subtitle2">
                    <strong>
                      {<FormattedLabel id="occupancyCertificate" />}
                    </strong>
                  </Typography>
                </td>
                <td>Required</td>
                <td>
                  <UploadButton1
                    appName="SSLM"
                    serviceName="S-IssuanceofSkyLicense"
                    filePath={setoccupancyCertificate}
                    fileName={router.query.occupancyCertificate}
                  />
                </td>
              </tr>
              <tr>
                <td>8</td>
                <td>
                  {" "}
                  <Typography variant="subtitle2">
                    <strong>{<FormattedLabel id="environmentalNoc" />}</strong>
                  </Typography>
                </td>
                <td>Required</td>
                <td>
                  <UploadButton1
                    appName="SSLM"
                    serviceName="S-IssuanceofSkyLicense"
                    filePath={setenvironmentalNoc}
                    fileName={router.query.environmentalNoc}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </DialogContent>


        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <IconButton onClick={() => viewRecord(params.row)}>
          </IconButton>        </Grid> */}

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormProvider {...methods}>
            <ScrutinyAction />
          </FormProvider>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button variant="contained" onClick={approveButton}>
              Approve
            </Button>
            <Button variant="contained" onClick={revertButton}>
              Revert
            </Button>
          </Stack>
        </Grid> */}
      </Grid>
    </>
  );
};
export default DocumentsView;
