import {
    Button,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
    ThemeProvider,
    TextField,
    Box,
    Grid,
    FormControl,
    FormHelperText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    InputLabel,
    Select,
    MenuItem,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../../theme";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { router } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import urls from "../../../../URLS/urls";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ApplicantDetails from "../components/ApplicantDetails";
import AddressOfLicense from "../components/AddressOfLicense";
import BusinessAndEmployeeDetails from "../components/BusinessAndEmployeeDetails";
import PartenershipDetail from "../components/PartenershipDetail";
import BusinessInfo from "../components/BusinessInfo";
import IndustryDocumentsUpload from "../components/IndustryDocumentsUpload";
import RenewalDocumentUpload from "../components/RenewalDocumentUpload";
import SiteVisit from "../components/SiteVisit";



const Index = () => {
    const methods = useForm({

        mode: "onChange",
        criteriaMode: "all",
        // resolver: yupResolver(Schema),
    });

    const {
        errors,
        getValues,
        setValue,
        reset,
        watch,
        control,
        register,
        handleSubmit,
    } = methods;

    const language = useSelector((state) => state?.labels.language);

    const dispach = useDispatch();
    const [licenseType, setlicenseType] = useState([]);
    const [searchFlag, setSearchFlag] = useState(false)

    const [data, setData] = useState()

    // useEffect(() => {
    //     // reset(router?.query);
    //     if (router.query.id) {
    //         axios
    //             .get(
    //                 `${urls.SSLM}/Trn/ApplicantDetails/getApplicationById?appId=${router.query.id}`
    //             )
    //             .then((r) => {
    //                 reset(r.data);
    //             });
    //     }
    // }, []);
    useEffect(() => {
        getlicenseType();

    }, [])
    const getlicenseType = () => {
        axios
            .get(`${urls.SSLM}/master/MstLicenseType/getAll`)
            .then((r) => {
                setlicenseType(
                    r.data.MstLicenseType.map((row) => ({
                        id: row.id,
                        licenseTypeEn: row.licenseType,
                        licenseTypeMar: row.licenseTypeMar,
                    })),
                );
            });
    };

    const handleSearch = () => {
        if (watch('licenseNo')) {

            console.log("filter", watch('licenseNo'));
        } else if (watch('applicantFulllName') && watch('aadharNo')) {
            console.log("filter1", watch('organizationName'), watch('aadharNo'), watch('mstLicensetypekey'));

        }
        else if (watch('organizationName1') && watch('mobileNo') && watch('mstLicensetypekey1')) {
            console.log("filter2", watch('organizationName1'), watch('mobileNo'), watch('mstLicensetypekey1'));

        }


        let bodyForApi = {
            applicantFulllName: watch("applicantFulllName") != "" ? watch("applicantFulllName") : null,
            aadhaarNo: watch("aadharNo") != "" ? Number(watch("aadharNo")) : null,
            licenseNumber: watch("licenseNo") != "" ? watch("licenseNo") : null,
        };

        axios
            .post(
                `${urls.SSLM}/trnIssuanceOfBusinessLicense/getReissuanceOfLicense`,
                bodyForApi,
            )
            .then((res) => {
                if (res.status == 200) {
                    swal("Success!", "Record Searched successfully !", "success");
                    setSearchFlag(true)
                    reset(res.data)
                    setValue('firstAidKitN', res?.data?.trnSiteVisitFormDao?.firstAidKit)
                    setValue('fireEquirepmentN', res?.data?.trnSiteVisitFormDao?.fireEquirepment)
                    setValue('toiletsN', res?.data?.trnSiteVisitFormDao?.toilets)

                    // setValue('constructionAreaMN', res?.data?.trnBussinessDetailsDao?.totalAreaM)
                    setValue('constructionAreaFtN', res?.data?.trnBussinessDetailsDao?.constructionAreaFt)
                    setValue('workingHoursN', res?.data?.trnBussinessDetailsDao?.workingHours)

                    setValue('buildingCommencementCertificateN', res?.data?.buildingCommencementCertificate)
                    setValue('registrarionCertificateN', res?.data?.registrarionCertificate)
                    setValue('agreementLetterN', res?.data?.agreementLetter)
                    setValue('foodLicenseN', res?.data?.foodLicense)
                    setValue('slumNOCN', res?.data?.slumNOC)
                    setValue('RawsiteviewermapN', res?.data?.Rawsiteviewermap)
                    setValue('environmentalNocN', res?.data?.environmentalNoc)
                    setValue('occupancyCertificateN', res?.data?.occupancyCertificate)

                    setValue('renewFromDate', moment(res?.data?.trnLicenseDao?.licenseValidTill, "YYYY-MM-DD").add(1, 'days'))
                    setValue('renewToDate', moment(res?.data?.trnLicenseDao?.licenseValidTill, "YYYY-MM-DD").add(1, 'y'))


                }
            })
            .catch((error) => {
                console.log("133", error);
                swal("Error!", error?.response?.data?.message, "error");
            });


    }
    // Handle Next
    const handleNext = () => {
        console.log("Form  Submit Data --->",);
        //dispach(addIsssuanceofLicenseSlice(data));
        // console.log("data", data);
        // if (activeStep == steps.length - 1) {
        //   axios
        //     .post(
        //       `${urls.SSLM}/Trn/ApplicantDetails/saveTrnApplicantDetails`,
        //       data
        //       // {
        //       //   headers: {
        //       //     role: "CITIZEN",
        //       //   },
        //       // },
        //     )
        //     .then((res) => {
        //       if (res.status == 201) {
        //         data.id
        //           ? sweetAlert(
        //             "Updated!",
        //             "Record Updated successfully !",
        //             "success"
        //           )
        //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
        //         router.push(`/dashboard`);
        //       }
        //     });
        // } else {
        //   setActiveStep(activeStep + 1);
        // }
    };

    // // Handle Back
    const handleExit = () => {
        router.push({
            pathname: `/dashboard`,
        })
    };
    // useEffect(() => {
    //     // reset(router?.query);
    //     if (router.query.id) {
    //         axios
    //             .get(
    //                 `${urls.SSLM}/Trn/ApplicantDetails/getApplicationById?appId=${router.query.id}`
    //             )
    //             .then((r) => {
    //                 reset(r.data);
    //             });
    //     }
    // }, [router.query.pagemode]);

    const convertFeetToMeter = (val) => {
        let temp = val * 0.3048;
        return temp;
    };

    const convertMeterToFeet = (val) => {
        return val * 3.2808;
    }

    useEffect(() => {
        if (watch("totalAreaFtN")) {
            setValue(
                "totalAreaMN",
                convertFeetToMeter(watch("totalAreaFtN"))
            );
        }
        if (watch("constructionAreaFtN")) {
            setValue(
                "constructionAreaMN",
                convertMeterToFeet(watch("constructionAreaFtN"))
            );
        }
    }, [
        watch("totalAreaFtN"),
        watch("constructionAreaFtN"),
    ]);

    // useEffect(() => {


    //     if (watch("totalAreaMN")) {
    //         setValue(
    //             "totalAreaFtN",
    //             convertFeetToMeter(watch("totalAreaFtN"))
    //         );
    //     }
    //     if (watch("constructionAreaMN")) {
    //         setValue(
    //             "constructionAreaFtN",
    //             convertFeetToMeter(watch("constructionAreaFtN"))
    //         );
    //     }
    // }, [watch("totalAreaMN"),
    // watch("constructionAreaMN"),])

    // View
    return (
        <>

            <ThemeProvider theme={theme}>
                <Paper
                    component={Box}
                    sx={
                        {
                            marginLeft: '10px',
                            marginRight: '10px',
                            paddingTop: '5vh',
                            paddingBottom: '2vh',

                        }
                    }
                    square
                    elevation={5}
                >
                    <FormProvider {...methods}>
                        <form sx={{ marginTop: 10 }}>
                            <div
                                style={{
                                    backgroundColor: "#0084ff",
                                    color: "white",
                                    fontSize: 19,
                                    padding: 8,
                                    paddingLeft: "5vh",
                                    marginLeft: "5vh",
                                    marginRight: "15vh",
                                    // marginTop: "10vh",
                                    paddingTop: "2vh",
                                    borderRadius: 100,
                                }}
                            >
                                <strong> Renewal of Business License </strong>
                            </div>
                            <Accordion
                                sx={{
                                    marginLeft: "10vh",
                                    marginRight: "15vh",
                                    marginTop: "2vh",
                                    marginBottom: "2vh",
                                    // paddingLeft:"5vh",
                                    // paddingRight:"5vh",
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        textTransform: "uppercase",
                                        // marginLeft: "5vh",
                                        // marginRight: "5vh",
                                    }}
                                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    backgroundColor="#0070f3"
                                >
                                    <Typography>
                                        1) Filter (License No. *)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField

                                                id='standard-basic'
                                                label='License No. *'
                                                variant='standard'
                                                {...register("licenseNo")}
                                                error={!!errors?.licenseNo}
                                                helperText={
                                                    errors?.licenseNo ? errors.licenseNo?.message : null
                                                }
                                            />
                                        </Grid>

                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                sx={{
                                    marginLeft: "10vh",
                                    marginRight: "15vh",
                                    marginTop: "2vh",
                                    marginBottom: "2vh",
                                    // paddingLeft:"5vh",
                                    // paddingRight:"5vh",
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        textTransform: "uppercase",
                                        // marginLeft: "5vh",
                                        // marginRight: "5vh",
                                    }}
                                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    backgroundColor="#0070f3"
                                >
                                    <Typography>
                                        2) Filter (Applicant Full Name,Aadhar No)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                id='standard-basic'
                                                // label={<FormattedLabel id="applicationNumber" />}
                                                label="Applicant Full Name"
                                                variant='standard'
                                                {...register("applicantFulllName")}
                                                error={!!errors?.applicantFulllName}
                                                helperText={
                                                    errors?.applicantFulllName
                                                        ? errors?.applicantFulllName?.message
                                                        : null
                                                }
                                            />
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField

                                                id='standard-basic'
                                                label='Aadhar No. *'
                                                variant='standard'
                                                {...register("aadharNo")}
                                                error={!!errors?.aadharNo}
                                                helperText={
                                                    errors?.aadharNo ? errors.aadharNo?.message : null
                                                }
                                            />
                                        </Grid>

                                    </Grid>
                                </AccordionDetails>


                            </Accordion>
                            {/* <Accordion
                                sx={{
                                    marginLeft: "5vh",
                                    marginRight: "5vh",
                                    marginTop: "2vh",
                                    marginBottom: "2vh",
                                    // paddingLeft:"5vh",
                                    // paddingRight:"5vh",
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        textTransform: "uppercase",
                                        // marginLeft: "5vh",
                                        // marginRight: "5vh",
                                    }}
                                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    backgroundColor="#0070f3"
                                >
                                    <Typography>
                                        2) Filter (Organization Name,Aadhar No,License Type)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                id='standard-basic'
                                                // label={<FormattedLabel id="applicationNumber" />}
                                                label="Organization Name"
                                                variant='standard'
                                                {...register("organizationName")}
                                                error={!!errors?.organizationName}
                                                helperText={
                                                    errors?.organizationName
                                                        ? errors?.organizationName?.message
                                                        : null
                                                }
                                            />
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField

                                                id='standard-basic'
                                                label='Aadhar No. *'
                                                variant='standard'
                                                {...register("aadharNo")}
                                                error={!!errors?.aadharNo}
                                                helperText={
                                                    errors?.aadharNo ? errors.aadharNo?.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl sx={{ marginTop: 2 }} error={!!errors?.licenseType}>
                                                <InputLabel id='demo-simple-select-standard-label'>
                                                    {<FormattedLabel id="licenseType"></FormattedLabel>}

                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            label='License Type *'
                                                        >
                                                            {licenseType &&
                                                                licenseType.map((licenseType, index) => (
                                                                    <MenuItem key={index} value={licenseType.id}>
                                                                        {licenseType.licenseType}

                                                                        {language == 'en'
                                                                            ?
                                                                            licenseType?.licenseTypeEn
                                                                            : licenseType?.licenseTypeMar}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name='mstLicensetypekey'
                                                    control={control}
                                                    defaultValue=''
                                                />
                                                <FormHelperText>
                                                    {errors?.licenseType ? errors.licenseType?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>


                            </Accordion>
                            <Accordion
                                sx={{
                                    marginLeft: "5vh",
                                    marginRight: "5vh",
                                    marginTop: "2vh",
                                    marginBottom: "2vh",
                                    // paddingLeft:"5vh",
                                    // paddingRight:"5vh",
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        textTransform: "uppercase",
                                        // marginLeft: "5vh",
                                        // marginRight: "5vh",
                                    }}
                                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    backgroundColor="#0070f3"
                                >
                                    <Typography>
                                        3) Filter (Organization Name,Mobile No,License Type)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                id='standard-basic'
                                                // label={<FormattedLabel id="applicationNumber" />}
                                                label="Organization Name"
                                                variant='standard'
                                                {...register("organizationName1")}
                                                error={!!errors?.organizationName1}
                                                helperText={
                                                    errors?.organizationName1
                                                        ? errors?.organizationName1?.message
                                                        : null
                                                }
                                            />
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField

                                                id='standard-basic'
                                                label='Mobile No.'
                                                variant='standard'
                                                {...register("mobileNo")}
                                                error={!!errors?.mobileNo}
                                                helperText={
                                                    errors?.mobileNo ? errors.mobileNo?.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl sx={{ marginTop: 2 }} error={!!errors?.mstLicensetypekey1}>
                                                <InputLabel id='demo-simple-select-standard-label'>
                                                    {<FormattedLabel id="licenseType"></FormattedLabel>}

                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            label='License Type *'
                                                        >
                                                            {licenseType &&
                                                                licenseType.map((licenseType, index) => (
                                                                    <MenuItem key={index} value={licenseType.id}>
                                                                        {licenseType.licenseType}

                                                                        {language == 'en'
                                                                            ?
                                                                            licenseType?.licenseTypeEn
                                                                            : licenseType?.licenseTypeMar}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name='mstLicensetypekey1'
                                                    control={control}
                                                    defaultValue=''
                                                />
                                                <FormHelperText>
                                                    {errors?.mstLicensetypekey1 ? errors.mstLicensetypekey1?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>


                            </Accordion> */}
                            <Grid
                                container
                                sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, justifyContent: "center" }}
                            >

                                <Grid item
                                    xl={4}
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        // disabled={validateSearch()}
                                        onClick={() => {
                                            handleSearch();
                                        }}
                                    >
                                        {<FormattedLabel id="search" />}
                                        {/* Search */}
                                    </Button>
                                </Grid>

                            </Grid>
                            {searchFlag ? (
                                <>
                                    < div
                                        style={{
                                            backgroundColor: "#0084ff",
                                            color: "white",
                                            fontSize: 19,
                                            padding: 8,
                                            paddingLeft: "5vh",
                                            marginLeft: "5vh",
                                            marginRight: "15vh",
                                            // marginTop: "10vh",
                                            paddingTop: "2vh",
                                            borderRadius: 100,
                                        }}
                                    >
                                        <strong> License Previous Information</strong>
                                    </div>
                                    {/* <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                id='standard-basic'
                                                disabled
                                                // label={<FormattedLabel id="applicationNumber" />}
                                                label="Organization Name"
                                                variant='standard'
                                                {...register("organizationName2")}
                                                error={!!errors?.organizationName2}
                                                helperText={
                                                    errors?.organizationName2
                                                        ? errors?.organizationName2?.message
                                                        : null
                                                }
                                            />
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                disabled
                                                id='standard-basic'
                                                label='Applicant Name.'
                                                variant='standard'
                                                {...register("applicantName")}
                                                error={!!errors?.applicantName}
                                                helperText={
                                                    errors?.applicantName ? errors.applicantName?.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl error={!!errors?.previousExpiryDate} sx={{ marginTop: 0 }}>
                                                <Controller
                                                    sx={{ marginTop: 0 }}

                                                    control={control}
                                                    name='previousExpiryDate'
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                disabled
                                                                inputFormat='DD/MM/YYYY'
                                                                // label={
                                                                //     <FormattedLabel id="dateOfBirth" />

                                                                // }
                                                                label="Previous Expiry Date"
                                                                value={field.value}
                                                                onChange={(date) =>
                                                                    field.onChange(
                                                                        moment(date).format('YYYY-MM-DD'),
                                                                    )
                                                                }
                                                                // selected={field.value}
                                                                center
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        size='small'
                                                                        fullWidth
                                                                        InputLabelProps={{
                                                                            style: {
                                                                                // fontSize: 12,
                                                                                marginTop: 3,
                                                                            },
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.previousExpiryDate ? errors?.previousExpiryDate?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                    <Grid
                                        container
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, justifyContent: "center" }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                // disabled={validateSearch()}
                                                onClick={() => {
                                                    handleNext();
                                                }}
                                            >
                                                {<FormattedLabel id="submit" />}
                                            </Button>
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                // disabled={validateSearch()}
                                                onClick={() => {
                                                    handleExit();
                                                }}
                                            >
                                                {<FormattedLabel id="exit" />}
                                            </Button>
                                        </Grid>
                                    </Grid> */}
                                    <>
                                        <ApplicantDetails disabled={true} />


                                        {/* <AadharAuthentication /> */}

                                        <AddressOfLicense disabled={true} />

                                        <BusinessInfo disabled={true} />


                                        <PartenershipDetail disabled={true} />
                                        <IndustryDocumentsUpload disabled={true} />
                                        <SiteVisit disabled={true} />
                                    </>
                                    < div
                                        style={{
                                            backgroundColor: "#0084ff",
                                            color: "white",
                                            fontSize: 19,
                                            padding: 8,
                                            paddingLeft: "5vh",
                                            marginLeft: "5vh",
                                            marginRight: "15vh",
                                            // marginTop: "10vh",
                                            paddingTop: "2vh",
                                            borderRadius: 100,
                                        }}
                                    >
                                        <strong> Update Information</strong>
                                    </div>

                                    < div
                                        style={{
                                            backgroundColor: "#0084ff",
                                            color: "white",
                                            fontSize: 15,
                                            padding: 8,
                                            paddingLeft: "5vh",
                                            marginLeft: "5vh",
                                            marginRight: "15vh",
                                            marginTop: "5vh",
                                            paddingTop: "2vh",
                                            borderRadius: 100,
                                        }}
                                    >
                                        <strong> Old Values</strong>
                                    </div>
                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                disabled
                                                // autoFocus
                                                id="standard-basic"
                                                label={<FormattedLabel id="constructionAreaFt"></FormattedLabel>}
                                                {...register("trnBussinessDetailsDao.constructionAreaFt")}
                                                // error={!!errors.constructionAreaFt}
                                                helperText={
                                                    errors?.constructionAreaFt
                                                        ? errors.constructionAreaFt.message
                                                        : null
                                                }
                                            />

                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                disabled
                                                // autoFocus
                                                id="standard-basic"
                                                InputLabelProps={{
                                                    shrink: watch("trnBussinessDetailsDao.constructionAreaM")
                                                        ? true
                                                        : false,
                                                }}
                                                label={<FormattedLabel id="constructionAreaM"></FormattedLabel>}
                                                {...register("trnBussinessDetailsDao.constructionAreaM")}
                                                // error={!!errors.constructionAreaM}
                                                helperText={
                                                    errors?.constructionAreaM
                                                        ? errors.constructionAreaM.message
                                                        : null
                                                }
                                            />

                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                disabled
                                                sx={{ width: 250 }}
                                                id="standard-basic"
                                                placeholder="Example :- 08:30"
                                                label={<FormattedLabel id="workingHours"></FormattedLabel>}
                                                variant="standard"
                                                {...register("trnBussinessDetailsDao.workingHours")}
                                                // error={!!errors.workingHours}
                                                helperText={
                                                    errors?.workingHours ? errors.workingHours.message : null
                                                }
                                            />

                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl flexDirection="row">
                                                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="fireEquirepment" />}</FormLabel>
                                                <Controller
                                                    name="trnSiteVisitFormDao.fireEquirepment"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup

                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            selected={field.value}
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                        >
                                                            <FormControlLabel
                                                                disabled
                                                                error={!!errors?.fireEquirepment}
                                                                value="true"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="yes" />}
                                                            />
                                                            <FormControlLabel
                                                                disabled
                                                                error={!!errors?.fireEquirepment}
                                                                value="false"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="no" />}
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                                <FormHelperText error={!!errors?.fireEquirepment}>
                                                    {errors?.fireEquirepment ? errors?.fireEquirepment?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl flexDirection="row">
                                                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="firstAidKit" />}</FormLabel>

                                                <Controller
                                                    name="trnSiteVisitFormDao.firstAidKit"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            // disabled={disabled}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            selected={field.value}
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                        >
                                                            <FormControlLabel
                                                                disabled
                                                                error={!!errors?.firstAidKit}
                                                                value="true"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="yes" />}
                                                            />
                                                            <FormControlLabel
                                                                disabled
                                                                error={!!errors?.firstAidKit}
                                                                value="false"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="no" />}
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                                <FormHelperText error={!!errors?.firstAidKit}>
                                                    {errors?.firstAidKit ? errors?.firstAidKit?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl flexDirection="row">
                                                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="toilets" />}</FormLabel>
                                                <Controller
                                                    name="trnSiteVisitFormDao.toilets"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            // disabled={disabled}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            selected={field.value}
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                        >
                                                            <FormControlLabel
                                                                disabled
                                                                error={!!errors?.toilets}
                                                                value="true"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="yes" />}
                                                            />
                                                            <FormControlLabel
                                                                disabled
                                                                error={!!errors?.toilets}
                                                                value="false"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="no" />}
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                                <FormHelperText error={!!errors?.toilets}>
                                                    {errors?.toilets ? errors?.toilets?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    < div
                                        style={{
                                            backgroundColor: "#0084ff",
                                            color: "white",
                                            fontSize: 15,
                                            padding: 8,
                                            paddingLeft: "5vh",
                                            marginLeft: "5vh",
                                            marginRight: "15vh",
                                            marginTop: "5vh",
                                            paddingTop: "2vh",
                                            borderRadius: 100,
                                        }}
                                    >
                                        <strong> New Values</strong>
                                    </div>

                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                // autoFocus
                                                id="standard-basic"
                                                label={<FormattedLabel id="constructionAreaFt"></FormattedLabel>}
                                                {...register("constructionAreaFtN")}
                                                // error={!!errors.constructionAreaFt}
                                                helperText={
                                                    errors?.constructionAreaFt
                                                        ? errors.constructionAreaFt.message
                                                        : null
                                                }
                                            />

                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                // autoFocus
                                                id="standard-basic"
                                                InputLabelProps={{
                                                    shrink: watch("constructionAreaMN")
                                                        ? true
                                                        : false,
                                                }}
                                                label={<FormattedLabel id="constructionAreaM"></FormattedLabel>}
                                                {...register("constructionAreaMN")}
                                                // error={!!errors.constructionAreaM}
                                                helperText={
                                                    errors?.constructionAreaM
                                                        ? errors.constructionAreaM.message
                                                        : null
                                                }
                                            />

                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                sx={{ width: 250 }}
                                                InputLabelProps={{
                                                    shrink: watch("workingHoursN")
                                                        ? true
                                                        : false,
                                                }}
                                                id="standard-basic"
                                                placeholder="Example :- 08:30"
                                                label={<FormattedLabel id="workingHours"></FormattedLabel>}
                                                variant="standard"
                                                {...register("workingHoursN")}
                                                // error={!!errors.workingHours}
                                                helperText={
                                                    errors?.workingHours ? errors.workingHours.message : null
                                                }
                                            />

                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl flexDirection="row">
                                                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="fireEquirepment" />}</FormLabel>
                                                <Controller
                                                    name="fireEquirepmentN"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup

                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            selected={field.value}
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                        >
                                                            <FormControlLabel
                                                                error={!!errors?.fireEquirepment}
                                                                value="true"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="yes" />}
                                                            />
                                                            <FormControlLabel
                                                                error={!!errors?.fireEquirepment}
                                                                value="false"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="no" />}
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                                <FormHelperText error={!!errors?.fireEquirepment}>
                                                    {errors?.fireEquirepment ? errors?.fireEquirepment?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl flexDirection="row">
                                                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="firstAidKit" />}</FormLabel>

                                                <Controller
                                                    name="firstAidKitN"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            // disabled={disabled}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            selected={field.value}
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                        >
                                                            <FormControlLabel

                                                                error={!!errors?.firstAidKit}
                                                                value="true"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="yes" />}
                                                            />
                                                            <FormControlLabel
                                                                error={!!errors?.firstAidKit}
                                                                value="false"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="no" />}
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                                <FormHelperText error={!!errors?.firstAidKit}>
                                                    {errors?.firstAidKit ? errors?.firstAidKit?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl flexDirection="row">
                                                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="toilets" />}</FormLabel>
                                                <Controller
                                                    name="toiletsN"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            // disabled={disabled}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            selected={field.value}
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                        >
                                                            <FormControlLabel

                                                                error={!!errors?.toilets}
                                                                value="true"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="yes" />}
                                                            />
                                                            <FormControlLabel
                                                                error={!!errors?.toilets}
                                                                value="false"
                                                                control={<Radio size="small" />}
                                                                label={<FormattedLabel id="no" />}
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                                <FormHelperText error={!!errors?.toilets}>
                                                    {errors?.toilets ? errors?.toilets?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl sx={{ display: "flex", alignItems: "baseline" }} style={{ marginTop: 10, marginLeft: 35 }}>
                                                {/* <FormLabel id='demo-simple-select-standard-label'>
                                                    Renew From Date
                                                </FormLabel> */}
                                                <Controller
                                                    sx={{ marginTop: 0 }}

                                                    control={control}
                                                    name='renewFromDate'
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                inputFormat='DD/MM/YYYY'
                                                                // label={
                                                                // //   <FormattedLabel id="industryDate" />

                                                                // }
                                                                label="Renew From Date"
                                                                value={field.value}
                                                                onChange={(date) => {
                                                                    field.onChange(moment(date).format("YYYY-MM-DD"));

                                                                }}
                                                                // selected={field.value}
                                                                center
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        size='small'
                                                                        fullWidth
                                                                        InputLabelProps={{
                                                                            style: {
                                                                                // fontSize: 12,
                                                                                marginTop: 3,
                                                                            },
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.renewFromDate ? errors.renewFromDate.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl sx={{ display: "flex", alignItems: "baseline" }} style={{ marginTop: 10, marginLeft: 35 }}>
                                                {/* <FormLabel id='demo-simple-select-standard-label'>
                                                    Renew To Date
                                                </FormLabel> */}
                                                <Controller
                                                    sx={{ marginTop: 0 }}

                                                    control={control}
                                                    name='renewToDate'
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                inputFormat='DD/MM/YYYY'
                                                                // label={
                                                                //   <FormattedLabel id="industryDate" />

                                                                // }
                                                                label="Renew To Date"
                                                                value={field.value}
                                                                onChange={(date) => {
                                                                    field.onChange(moment(date).format("YYYY-MM-DD"));

                                                                }}
                                                                // selected={field.value}
                                                                center
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        size='small'
                                                                        fullWidth
                                                                        InputLabelProps={{
                                                                            style: {
                                                                                // fontSize: 12,
                                                                                marginTop: 3,
                                                                            },
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.renewToDate ? errors.renewToDate.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <RenewalDocumentUpload />

                                </>
                            ) : ""
                            }
                        </form>

                    </FormProvider>
                </Paper>
            </ThemeProvider>
        </>
    );
};

export default Index;
