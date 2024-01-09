import {
    Grid,
    TextField,
    TextareaAutosize,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import axios from "axios";
import { useFieldArray } from "react-hook-form";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";


/////////////////// Drawer Related

import { styled, useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
// import UploadButton from "../../FileUpload/UploadButton.js";
import UploadButton from "../../../../components/fileUpload/UploadButton";



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



const CancellationofIndustry = () => {
    const {
        control,
        register,
        reset,
        setValue,
        formState: { errors },
    } = useFormContext();

    let appName = "SSLM";
    let serviceName = "S-IssuanceofSkyLicense";

    const [flag, setFlag] = useState(null);
    const language = useSelector((state) => state?.labels.language);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);



    return (
        <>
            {/** Main Component  */}
            <Main>

                <div
                // style={{
                //     backgroundColor: "#0084ff",
                //     color: "white",
                //     fontSize: 19,
                //     marginTop: 30,
                //     marginBottom: 30,
                //     padding: 8,
                //     paddingLeft: 30,
                //     marginLeft: "40px",
                //     marginRight: "65px",
                //     borderRadius: 100,
                // }}
                >
                    {/* <FormattedLabel id='applicantInformation' /> */}
                    {/* Site Visit */}
                </div>
                <Grid
                    container
                    sx={{ marginLeft: 5, marginTop: 2, align: "center" }}
                >
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

export default CancellationofIndustry;
