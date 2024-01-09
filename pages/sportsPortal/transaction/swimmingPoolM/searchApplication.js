import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {

    Button,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./searchApplication.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import moment, { lang } from "moment/moment";
import Loader from "../../../../containers/Layout/components/Loader";
const Index = () => {
    const [photo, setPhoto] = useState();
    const [loader, setLoader] = useState(false);
    const [viewDocument, setViewDocument] = useState(false);
    const token = useSelector((state) => state.user.user.token);
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
    const disptach = useDispatch();
    const router = useRouter();
    const {
        control,
        register,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useForm();
    const [flagSearch, setFlagSearch] = useState(false);
    const [data, setData] = useState();
    const [serviceName, setServiceName] = useState();
    const [swimmingMemberArray, setSwimmingMemberArray] = useState();
    const [sportsMemberArray, setSportsMemberArray] = useState();
    const [swimmingPhoto, setSwimmingPhoto] = useState();
    const [showMembers, setShowMembers] = useState(false);
    const logedInUser = localStorage.getItem("loggedInUser");
    const [loadderState, setLoadderState] = useState(false);

    let user = useSelector((state) => state.user.user);
    const language = useSelector((state) => state?.labels.language);

    // handleSearch
    const handleSearch = () => {
        setLoadderState(true)
        axios
            .get(
                `${urls.SPURL}/report/getByApplicationNumber?applicationNumber=${watch("applicationNo")}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            )
            .then(async (res) => {
                setLoadderState(false)
                console.log("dszfsdf", res);
                if (res.status == 200) {
                    swal(
                        language == "en" ? "Searched!" : "शोधले!",
                        language == "en" ? "Record Found!" : "रेकॉर्ड सापडले!",
                        "success",
                    );
                    const finalDataArray = [
                        ...res?.data?.trnMonthlySwimmingBooking,
                        ...res?.data?.swimmingPool,
                        ...res?.data?.sportsBooking,
                        ...res?.data?.gymBooking,
                        ...res?.data?.groundBooking
                    ]
                    setFlagSearch(true);
                    if (finalDataArray) {
                        const _res = {
                            ...finalDataArray[0],
                            venueNames: venueNames?.find((obj) => obj?.id == finalDataArray[0]?.venue)
                                ?.venue,
                            fromBookingTime: datetime?.find(
                                (obj) => obj?.id == finalDataArray[0]?.bookingTimeId
                            )?.fromBookingTime,
                            toBookingTime: datetime?.find(
                                (obj) => obj?.id == finalDataArray[0]?.bookingTimeId
                            )?.toBookingTime,

                        };
                        setData(_res)
                        getIcardPhoto(_res.attachmentList[1].filePath)
                        let serviceNameD = services?.find((ff) => ff.id === _res?.serviceId)?.serviceName
                        setServiceName(serviceNameD)
                        if (_res?.serviceId == 32) {
                            const testFinal = await Promise.all(
                                _res?.swimmingPoolDetailsDao?.map(async (data) => {
                                    const memberPhotoCertificate = await getPhoto(data?.memberPhotoCertificate);
                                    return {
                                        ...data,
                                        memberPhotoCertificate: memberPhotoCertificate
                                    };
                                })
                            );
                            setSwimmingMemberArray(testFinal)
                        }
                        if (_res?.serviceId == 29) {

                            setSportsMemberArray(_res.sportsBookingGroupDetailsDao)
                        }
                    }
                }
            })
            .catch((error) => {
                setLoadderState(false)
                callCatchMethod(error, language);
            });
    };
    const [datetime, setDatetime] = useState([]);
    const [services, setServices] = useState([]);
    const [venueNames, setVenueNames] = useState([]);

    // getFacilityName
    const getFacilityName = () => {
        axios.get(`${urls.CFCURL}/master/service/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((r) => {
            setServices(r?.data?.service)
            console.log("//////////////", r?.data?.service);
        })
            .catch((error) => {
                callCatchMethod(error, language);
            });
    };
    //  getVenueNames
    const getVenueNames = () => {
        axios.get(`${urls.SPURL}/venueMasterSection/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((r) => {
            setVenueNames(
                r.data.venueSection.map((row) => ({
                    id: row.id,
                    venue: row.venue,
                }))
            );
        })
            .catch((error) => {
                callCatchMethod(error, language);
            });
    };

    // getDateTime
    const getDateTime = () => {
        axios.get(`${urls.SPURL}/master/slotDetails/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((r) => {
            setDatetime(
                r.data.slotDetails.map((row) => ({
                    id: row.id,
                    fromBookingTime: row.fromTime,
                    toBookingTime: row.toTime,
                }))
            );
        })
            .catch((error) => {
                callCatchMethod(error, language);
            });
    };

    // getIcardPhoto
    const getIcardPhoto = (filePath) => {
        const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((r) => {
                console.log("ImageApi21312", r?.data);
                setPhoto(r?.data?.fileName);
            })
            .catch((error) => {
                callCatchMethod(error, language);
            });
    }

    // getPhoto  -- multiplePhotos
    const getPhoto = async (filePath) => {
        console.log("filePath123", filePath);
        const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
        const base64Data = await axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((r) => {
                console.log("ImageApi21312", r?.data);
                return r?.data?.fileName
            })
            .catch((error) => {
                callCatchMethod(error, language);
            });
        return `data:image/png;base64,${base64Data}`
    }

    // getFilePreview
    const getFilePreview = (filePath) => {
        console.log("filePath123", filePath);
        const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((r) => {
                const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
                const newTab = window.open();
                newTab.document.body.innerHTML = `<img src="${imageUrl}"  width="100%" height="100%"/>`;
            })
            .catch((error) => {
                console.log("CatchPreviewApi", error)
                callCatchMethod(error, language);
            });
    }

    // submitRemrk
    const submitRemrk = () => {
        setLoadderState(true)
        const reqBody = {
            "applicationNumber": data?.applicationNumber,
            "remark": watch("remark")
        }
        axios.post(`${urls.SPURL}/report/saveApplication`, reqBody, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((r) => {
            setLoadderState(false)
            if (r.status == 200 || r.status == 201) {
                swal("Submited!", "Record Submited successfully !", "success");
                //   console.log("res", r);
                router.push({
                    pathname: `/sportsPortal/dashboard`,
                });
            }
        })
            .catch((error) => {
                setLoadderState(false)
                callCatchMethod(error, language);
                router.push({
                    pathname: `/sportsPortal/dashboard`,
                });
            });
    }

    useEffect(() => {
        getVenueNames()
        getDateTime()
        getFacilityName()
    }, [])

    //!================
    return (
        <>
            {loadderState ? (
                <Loader />
            ) : (
                <div style={{ backgroundColor: "#F5F5F5" }}>
                    <div>
                        <Paper
                            sx={{
                                marginLeft: 2,
                                marginRight: 2,
                                marginTop: 5,
                                marginBottom: 5,
                                padding: 1,
                                border: 1,
                                borderColor: "grey.500",
                            }}
                        >
                            <>
                                <div className={styles.details}>
                                    <div className={styles.h1Tag}>
                                        <h3
                                            style={{
                                                color: "white",
                                                marginTop: "7px",
                                            }}
                                        >{language == "en" ? "Search Application" : "अर्ज शोधा"}</h3>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div>
                                        <TextField
                                            sx={{ width: 230 }}
                                            id="standard-basic"
                                            label={
                                                language == "en"
                                                    ? "Registration Number"
                                                    : "नोंदणी क्रमांक"
                                            }
                                            variant="standard"
                                            {...register("applicationNo")}
                                            name="applicationNo"
                                        />
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                handleSearch();
                                            }}
                                        >
                                            {<FormattedLabel id="search" />}
                                        </Button>
                                    </div>
                                </div>
                            </>

                            {flagSearch ? <>
                                <div className={styles.row}>
                                    <h2><b>{serviceName}</b></h2>
                                </div>
                                <Grid container sx={{ marginTop: "5vh" }}>
                                    <Grid item xs={12} sm={12} md={6} sx={{ textAlign: 'center' }}>
                                        <img
                                            className={styles.ImageOp}
                                            src={`data:image/png;base64,${photo}`}
                                            alt=" Photo"
                                        ></img>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} >
                                        <h4 >
                                            <b>
                                                अर्जाचा क्रमांक : {data?.applicationNumber}
                                            </b>
                                        </h4>
                                        <h4 >
                                            <b>
                                                अर्जदाराचे नाव : {data?.firstName}
                                                {""} {data?.middleName}
                                                {""} {data?.lastName}
                                            </b>
                                        </h4>
                                        <h4 style={{ paddingRight: "117px" }}>
                                            <b>मोबाईल नं. : {data?.mobileNo}</b>
                                        </h4>
                                        <h4 style={{ paddingRight: "0px" }}>
                                            <b>पत्ता: {data?.cAddress}</b>
                                        </h4>
                                        <h4 style={{ paddingRight: "33px" }}>
                                            <b>
                                                कालावधी:{" "}
                                                {moment(
                                                    data?.fromDate,
                                                    "YYYY-MM-DD HH:mm:ss A"
                                                ).format("DD-MM-YYYY")} {" "}
                                                To{" "}
                                                {moment(
                                                    data?.toDate,
                                                    "YYYY-MM-DD HH:mm:ss A"
                                                ).format("DD-MM-YYYY")}
                                            </b>
                                        </h4>
                                        <h4 style={{ paddingRight: "80px" }}>
                                            <b>ठिकाण: {data?.venueNames}</b>
                                        </h4>
                                        <b>
                                            वेळ: {data?.fromBookingTime} To
                                            {data?.toBookingTime}
                                        </b>
                                    </Grid>
                                </Grid>
                                {/* <div className={styles.row}> */}
                                <Grid container justifyContent="space-evenly" style={{ marginTop: "5vh" }}>
                                    <Grid item>
                                        <div>
                                            <Button
                                                variant="outlined" color="primary"
                                                size="small"
                                                // disabled={validateSearch()}
                                                onClick={() => {
                                                    setViewDocument(true)
                                                }}
                                            >View Documents
                                            </Button>
                                        </div>
                                    </Grid>
                                    <Grid item style={{ marginLeft: "5vw" }}>
                                        {viewDocument && <>
                                            {/* <div className={styles.row1}> */}
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                size="small"
                                                // disabled={validateSearch()}
                                                onClick={() =>
                                                    getFilePreview(data?.attachmentList[0].filePath)
                                                }
                                            >{language == "en" ? "Adhar Card" : "आधार कार्ड"}
                                            </Button>
                                            {
                                                data.serviceId != 29 && <Button
                                                    variant="outlined"
                                                    color="warning"
                                                    size="small"
                                                    sx={{ marginLeft: "5vw" }}
                                                    // disabled={validateSearch()}
                                                    onClick={() =>
                                                        getFilePreview(data?.attachmentList[2]?.filePath)
                                                    }
                                                >{language == "en" ? "Medical Certificate" : "वैद्यकीय प्रमाणपत्र"}
                                                </Button>}
                                            {/* </div> */}
                                        </>}
                                    </Grid>
                                </Grid>

                                {/* </div> */}
                                <Grid container justifyContent="space-evenly" style={{ marginTop: "5vh" }}>
                                    <Grid item>
                                {
                                    (data.serviceId == 32 || data.serviceId == 29) && <div >
                                        <div>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                // style={{ backgroundColor: '#6EB5FF', color: '#fff' }} // Light blue background
                                                size="small"
                                                // disabled={validateSearch()}
                                                onClick={() => {
                                                    setShowMembers(true)
                                                }}
                                            >Show Members
                                            </Button>
                                        </div>
                                    </div>}</Grid>
                                    <Grid item>
                                {
                                    showMembers && <>
                                        {
                                            swimmingMemberArray?.map((data) => <>
                                                <Grid container>
                                                    <Grid item xs={12} sm={12} md={6} sx={{ textAlign: 'center' }}>
                                                        <img
                                                            className={styles.ImageOpM}
                                                            src={data?.memberPhotoCertificate}
                                                            alt=" Photo"
                                                        ></img>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6} >
                                                        <h4 >
                                                            <b>
                                                                अर्जदाराचे नाव : {data?.memberName}
                                                                {""} {data?.memberMname}
                                                                {""} {data?.memberLname}
                                                            </b>
                                                        </h4>
                                                        <h4 style={{ paddingRight: "117px" }}>

                                                            <b>मोबाईल नं. : {data?.memberAadharNo}</b>
                                                        </h4>
                                                    </Grid>
                                                </Grid>
                                            </>)
                                        }
                                    </>
                                }
                                </Grid>
                                </Grid>
                                <Grid container sx={{ marginTop: "5vh" }}>
                                    {
                                        showMembers && <>
                                            {
                                                sportsMemberArray?.map((data) => <><Grid item sx={{ paddingLeft: "6vh" }} xs={12} sm={12} md={4} lg={4} xl={4}  >
                                                    <h4 >
                                                        <b>
                                                            अर्जदाराचे नाव : {data?.applicantFirstName}
                                                            {""} {data?.applicantMiddleName}
                                                            {""} {data?.applicantLastName}
                                                        </b>
                                                    </h4>
                                                    <h4 style={{ paddingRight: "117px" }}>

                                                        <b>मोबाईल नं. : {data?.applicantMobile}</b>
                                                    </h4>
                                                </Grid>
                                                </>)
                                            }
                                        </>
                                    }
                                </Grid>
                                <div className={styles.row1}>
                                    <TextField
                                        sx={{ width: "400px" }}
                                        id="standard-basic"
                                        label={language == "en" ? "Remark" : "शेरा"}
                                        {...register("remark")}
                                        error={!!errors.remark}
                                        helperText={errors?.remark ? errors.remark.message : null}
                                    /></div>
                                <div className={styles.row1}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!watch("remark")}
                                        onClick={() => submitRemrk()}
                                    >Send
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginLeft: "2vw" }}
                                        // disabled={validateSearch()}
                                        onClick={() =>
                                            router.back()
                                        }
                                    >Exit
                                    </Button>
                                </div>
                            </>
                                : ""}
                        </Paper>
                    </div>
                </div>
            )}</>
    );
};

export default Index;
