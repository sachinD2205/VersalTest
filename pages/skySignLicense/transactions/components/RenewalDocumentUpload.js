import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import UploadButton from "../../fileUpload/UploadButton.js";
import UploadButton from "../../../../components/fileUpload/UploadButtonSSLM";
import styles from "../../../../styles/skysignstyles/documentUpload.module.css";
import { useRouter } from "next/router";

// Documents Upload
const DocumentsUpload = (props) => {
    // UseForm Context
    const {
        control,
        register,
        reset,
        getValues,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();
    // { resolver: yupResolver(schema) }
    const router = useRouter()

    const [registrarionCertificateN, setregistrarionCertificateN] = useState(null);
    const [buildingCommencementCertificateN, setbuildingCommencementCertificateN] =
        useState(null);
    const [rentAgreement, setRentAgreement] = useState(null)
    const [previousLicenseCertificate, setPreviousLicenseCertificate] = useState(null)
    const [RawsiteviewermapN, setRawsiteviewermapN] = useState(null);
    const [slumNOCN, setslumNOCN] = useState(null);
    const [foodLicenseN, setfoodLicenseN] = useState(null);
    const [agreementLetterN, seteagreementLetterN] = useState(null);
    const [occupancyCertificateN, setoccupancyCertificateN] = useState(null);
    const [environmentalNocN, setenvironmentalNocN] = useState(null);
    const [showDel, setShowDel] = useState(true)
    // @ First UseEffect
    useEffect(() => {
        console.log("certificate yetay", watch("buildingCommencementCertificateN"))
        if (getValues("buildingCommencementCertificateN")) {
            console.log("aala re");
            setbuildingCommencementCertificateN(
                getValues("buildingCommencementCertificateN")
            );
        }

        if (getValues('previousLicenseCertificate')) {
            setPreviousLicenseCertificate(getValues('previousLicenseCertificate'))
        }

        if (watch('rentAgreement')) {
            setRentAgreement(getValues('rentAgreement'));
        }
        if (getValues("registrarionCertificateN") != null) {
            setregistrarionCertificateN(getValues("registrarionCertificateN"));
        }
        if (getValues("RawsiteviewermapN") != null) {
            setRawsiteviewermapN(getValues("RawsiteviewermapN"));
        }
        if (getValues("slumNOCN") != null) {
            setslumNOCN(getValues("slumNOCN"));
        }
        if (getValues("foodLicenseN") != null) {
            setfoodLicenseN(getValues("foodLicenseN"));
        }
        if (getValues("agreementLetterN") != null) {
            seteagreementLetterN(getValues("agreementLetterN"));
        }
        if (getValues("occupancyCertificateN") != null) {
            setoccupancyCertificateN(getValues("occupancyCertificateN"));
        }
        if (getValues("environmentalNocN") != null) {
            setenvironmentalNocN(getValues("environmentalNocN"));
        }

        console.log("disabled", router?.query?.disabled)
        if (router?.query?.disabled) {
            setShowDel(false)
        }
    }, []);

    // @ Second UseEffect
    useEffect(() => {
        setValue(
            "buildingCommencementCertificateN",
            buildingCommencementCertificateN
        );
        setValue("registrarionCertificateN", registrarionCertificateN);
        setValue("RawsiteviewermapN", RawsiteviewermapN);
        setValue("slumNOCN", slumNOCN);
        setValue("foodLicenseN", foodLicenseN);
        setValue("agreementLetterN", agreementLetterN);
        setValue("occupancyCertificateN", occupancyCertificateN);
        setValue("environmentalNocN", environmentalNocN);
        setValue('previousLicenseCertificate', previousLicenseCertificate);
        setValue('rentAgreement', rentAgreement);
    }, [
        buildingCommencementCertificateN,
        registrarionCertificateN,
        RawsiteviewermapN,
        slumNOCN,
        foodLicenseN,
        agreementLetterN,
        occupancyCertificateN,
        environmentalNocN,
        previousLicenseCertificate,
        rentAgreement
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
                <strong>
                    {/* {<FormattedLabel id="documentUpload" />} */}
                    Renewal of Business License Document Upload
                </strong>
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
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ marginTop: 2 }}
                >
                    <Typography variant="subtitle2">
                        <strong>
                            {/* {<FormattedLabel id="buildingCommencementCertificateN" />} */}
                            Rent Agreement if Previous Expired
                        </strong>
                    </Typography>
                    <div className={styles.attachFile}>
                        <UploadButton
                            appName="SSLM"
                            serviceName="S-IssuanceofSkyLicense"
                            filePath={setRentAgreement}
                            fileName={rentAgreement}
                            // fileData={buildingCommencementCertificateData}
                            disabled={props.disabled}

                        />
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
                    <Typography variant="subtitle2">
                        <strong>
                            {/* {<FormattedLabel id="buildingCommencementCertificateN" />} */}
                            Issued License Certificate
                        </strong>
                    </Typography>
                    <div className={styles.attachFile}>
                        <UploadButton
                            appName="SSLM"
                            serviceName="S-IssuanceofSkyLicense"
                            filePath={setPreviousLicenseCertificate}
                            fileName={previousLicenseCertificate}
                            // fileData={buildingCommencementCertificateData}
                            disabled={props.disabled}

                        />
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
                    <Typography variant="subtitle2">
                        <strong>
                            {<FormattedLabel id="buildingCommencementCertificate" />}
                        </strong>
                    </Typography>
                    <div className={styles.attachFile}>
                        <UploadButton
                            appName="SSLM"
                            serviceName="S-IssuanceofSkyLicense"
                            filePath={setbuildingCommencementCertificateN}
                            fileName={buildingCommencementCertificateN}
                            // fileData={buildingCommencementCertificateData}
                            disabled={props.disabled}

                        />
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
                    <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="registrarionCertificate" />}</strong>
                    </Typography>
                    <UploadButton
                        appName="SSLM"
                        serviceName="S-IssuanceofSkyLicense"
                        filePath={setregistrarionCertificateN}
                        fileName={registrarionCertificateN}
                        disabled={props.disabled}
                    />
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
                    <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="rawsiteviewermap" />}</strong>
                    </Typography>
                    <UploadButton
                        appName="SSLM"
                        serviceName="S-IssuanceofSkyLicense"
                        filePath={setRawsiteviewermapN}
                        fileName={RawsiteviewermapN}
                        disabled={props.disabled}

                    />
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
                    <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="slumNOC" />}</strong>
                    </Typography>
                    <UploadButton
                        appName="SSLM"
                        serviceName="S-IssuanceofSkyLicense"
                        filePath={setslumNOCN}
                        fileName={slumNOCN}
                        disabled={props.disabled}

                    />
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
                    <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="foodLicense" />}</strong>
                    </Typography>
                    <UploadButton
                        appName="SSLM"
                        serviceName="S-IssuanceofSkyLicense"
                        filePath={setfoodLicenseN}
                        fileName={foodLicenseN}
                        disabled={props.disabled}

                    />
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
                    <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="agreementLetter" />}</strong>
                    </Typography>
                    <UploadButton
                        appName="SSLM"
                        serviceName="S-IssuanceofSkyLicense"
                        filePath={seteagreementLetterN}
                        fileName={agreementLetterN}
                        disabled={props.disabled}

                    />
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
                    <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="occupancyCertificate" />}</strong>
                    </Typography>
                    <UploadButton
                        appName="SSLM"
                        serviceName="S-IssuanceofSkyLicense"
                        filePath={setoccupancyCertificateN}
                        fileName={occupancyCertificateN}
                        disabled={props.disabled}

                    />
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
                    <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="environmentalNoc" />}</strong>
                    </Typography>
                    <UploadButton
                        appName="SSLM"
                        serviceName="S-IssuanceofSkyLicense"
                        filePath={setenvironmentalNocN}
                        fileName={environmentalNocN}
                        disabled={props.disabled}

                    />
                </Grid>
            </Grid>
        </>
    );
};
export default DocumentsUpload;
