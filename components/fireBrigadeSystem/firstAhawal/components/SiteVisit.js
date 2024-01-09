import {
    Grid,
    TextField,
    TextareaAutosize,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import axios from "axios";
import { useFieldArray } from "react-hook-form";
import { useRouter } from "next/router";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";


/////////////////// Drawer Related

import { styled, useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import UploadButton from "../../FileUpload/UploadButton.js";


let drawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        }),
    }),
);



const SiteVisit = () => {
    const router = useRouter();
    const {
        control,
        register,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    let appName = "SSLM";
    let serviceName = "S-IssuanceofSkyLicense";

    const [flag, setFlag] = useState(null);
    const language = useSelector((state) => state?.labels.language);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);


    useEffect(() => {
        reset(router?.query);
        if (router.query.id) {
            axios
                .get(
                    `http://localhost:8098/sslm/api/Trn/ApplicantDetails/getApplicationById?appId=${router.query.id}`,)
                .then((r) => {

                    reset(r.data);
                });
        }
    }, [])




    // getBase64 ===
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const { fields } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "documents", // unique name for your Field Array
    });

    const handleFile1 = async (e, labelName) => {
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios
            .post(
                `http://localhost:8090/cfc/api/file/upload?appName=${appName}&serviceName=${serviceName}`,
                formData,
            )
            .then((r) => {
                if (r.status === 200) {
                    if (labelName === "photo1") {
                        setValue("photo1", r.data.filePath);
                    } else if (labelName === "photo2") {
                        setValue("photo2", r.data.filePath);
                    } else if (labelName == "photo3") {
                        setValue("photo3", r.data.filePath);
                    } else if (labelName == "photo4") {
                        setValue("photo4", r.data.filePath);
                    } else if (labelName == "photo5") {
                        setValue("photo5", r.data.filePath);
                    }
                } else {
                    sweetAlert("Error");
                }
            });
    };



    return (
        <>
            {/** Main Component  */}
            <Main>

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
                    {/* <FormattedLabel id='applicantInformation' /> */}
                    Site Visit
                </div>
                <Grid
                    container
                    sx={{ marginLeft: 5, marginTop: 2, align: "center" }}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 1</Typography> */}
                        {/* {<FormattedLabel id="registrarionCertificate" />} */}
                        <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo1");
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 2</Typography> */}
                        {/* {<FormattedLabel id="registrarionCertificate" />} */}
                        <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo2");
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 3</Typography> */}
                        {/* {<FormattedLabel id="registrarionCertificate" />} */}
                        <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo3");
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 4</Typography> */}
                        {/* {<FormattedLabel id="registrarionCertificate" />} */}
                        <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo4");
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 5</Typography> */}
                        {/* {<FormattedLabel id="registrarionCertificate" />} */}
                        <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo5");
                            }}
                        />
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                            id='standard-basic'
                            label={<FormattedLabel id="crLattitude"></FormattedLabel>}
                            {...register("trnApplicantDetailsDao.crLattitude")}
                            error={!!errors.crLattitude}
                            helperText={
                                errors?.crLattitude ? errors.crLattitude.message : null
                            }
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                            //  InputLabelProps={{ shrink: true }}
                            id='standard-basic'
                            label={<FormattedLabel id="crLongitud"></FormattedLabel>}
                            {...register("crLongitud")}
                            error={!!errors.crLongitud}
                            helperText={
                                errors?.crLongitud ? errors.crLongitud.message : null
                            }
                        />
                    </Grid>

                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextareaAutosize
                            //  InputLabelProps={{ shrink: true }}
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Remark"
                            style={{ marginTop: 40, width: 1000 }}
                            id='standard-basic'
                            label="Remark"
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                                errors?.remark ? errors.remark.message : null
                            }
                        />
                    </Grid>


                </Grid>
            </Main >


        </>
    );
};

export default SiteVisit;
