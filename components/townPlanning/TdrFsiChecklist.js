import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import UploadButton from "../townPlanning/FileUploadTable/NewUploadButton";
import moment from "moment";
import { catchExceptionHandlingMethod } from "../../util/util";
// Component
const TdrFsiChecklist = () => {
  //catch
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
  let user = useSelector((state) => state.user.user);
  const router = useRouter();

  const language = useSelector((state) => state?.labels.language);

  // React Hook Form
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [quation12C, setQuation12C] = useState(null);
  const [quation12D, setQuation12D] = useState(null);
  const [quation8A, setQuation8A] = useState(null);
  const [gender, setGender] = useState();
  const [title, setTitle] = useState();
  const [zone, setZone] = useState();
  const [village, setVillage] = useState();
  const [gat, setGat] = useState();
  const [reservationName, setReservationName] = useState();
  const [documents, setDocuments] = useState();
  const [disabled, setDisabled] = useState(false);
  // Titles
  const [gTitleMars, setgTitleMars] = useState([]);

  // getTitles
  const getgTitleMars = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgTitleMars(
          r.data.title.map((row) => ({
            id: row.id,
            gtitleMar: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    if (router.query.pageMode === "View") {
      setDisabled(true);
    }
  }, [router.query]);
  useEffect(() => {
    // Date
    let appDate = new Date();
    // setNewDate(moment(appDate, "YYYY-MM-DD").format("YYYY-MM-DD"));

    //Gender
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setGender(
          res.data.gender.map((j) => ({
            id: j.id,
            genderEn: j.gender,
            genderMr: j.genderMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Title
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setTitle(
          res.data.title.map((j) => ({
            id: j.id,
            titleEn: j.title,
            titleMr: j.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Zone
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZone(
          res.data.zone.map((j) => ({
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Village
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setVillage(
          res.data.village.map((j) => ({
            id: j.id,
            villageEn: j.villageName,
            villageMr: j.villageNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Gat
    axios
      .get(`${urls.CFCURL}/master/gatMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setGat(
          r.data.gatMaster.map((j, i) => ({
            id: j.id,
            gatEn: j.gatNameEn,
            gatMr: j.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //DocumentsList
    axios
      .get(`${urls.CFCURL}/master/documentMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDocuments(
          res.data.documentMaster.map((j, i) => ({
            id: j.id,
            documentNameEn: j.documentChecklistEn,
            documentNameMr: j.documentChecklistMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    getgTitleMars();
  }, []);
  console.log("ppppppppp", watch("zoneId"));

  // ********code which is in use ******************
  let appName = "FBS";

  let serviceName = "BusinessNoc";
  const [docView, setDocView] = useState(false);

  // useEffect(()=>{
  //   setValue("quation8A",quation8ADoc)
  //   setValue("quation12C",quation12CDoc)
  //   setValue("quation12D",quation12DDoc)
  // },[])

  const area = [
    { id: 1, name: "CRZ", nameMr: "सीआरझेड" },
    { id: 2, name: "Hazardous Zone", nameMr: "धोकादायक झोन" },
    { id: 3, name: "Low Density Zone", nameMr: "कमी घनता झोन" },
    { id: 4, name: "Not Applicable", nameMr: "लागू नाही" },
  ];

  const tableStyle = {
    border: "1px solid black",

    width: "100%",
  };

  const thStyleLeft = {
    border: "1px solid black",
  };
  const thStylehead = {
    textAlign: "center",
    border: "1px solid black",
    background: "#dddddd",
  };
  const thStyle = {
    textAlign: "center",
    border: "1px solid black",
  };
  /// =========> useEffects
  useEffect(() => {
    // if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
    // } else {

    //   console.log("disabled");
    // }

    if (watch("quation12C") != null || watch("quation12C") != undefined) {
      setQuation12C(watch("quation12C"));
      clearErrors("quation12C");
    }
    if (watch("quation12D") != null || watch("quation12D") != undefined) {
      setQuation12D(watch("quation12D"));
      clearErrors("quation12D");
    }
    if (watch("quation8A") != null || watch("quation8A") != undefined) {
      setQuation8A(watch("quation8A"));
      clearErrors("quation8A");
    }
  }, []);

  useEffect(() => {
    setValue("quation12C", quation12C);
    setValue("quation12D", quation12D);
    setValue("quation8A", quation8A);
  }, [quation12C, quation12D, quation8A]);

  useEffect(() => {
    if (watch("quation12C") != null || watch("quation12C") != undefined) {
      setQuation12C(watch("quation12C"));
      clearErrors("quation12C");
    }
    if (watch("quation12D") != null || watch("quation12D") != undefined) {
      setQuation12D(watch("quation12D"));
      clearErrors("quation12D");
    }
    if (watch("quation8A") != null || watch("quation8A") != undefined) {
      setQuation8A(watch("quation8A"));
      clearErrors("quation8A");
    }
  }, [watch("quation12C"), watch("quation12D"), watch("quation8A")]);

  //   // view
  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="checkList" />
            {/* Application Details */}
          </h2>
        </Box>

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <Grid container sx={{ padding: "10px" }}></Grid>
          <div style={{ overflow: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStylehead}>
                    {language == "en" ? "Sr.No" : "क्र."}
                  </th>
                  <th style={thStylehead}>
                    {language == "en" ? "Discription" : "वर्णन"}
                  </th>
                  <th style={thStylehead}>
                    {language == "en" ? "Input" : "इनपुट"}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={thStyle}>1</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Record of right detail (Survey No./Gut No./CTS No./Village Name)"
                      : "योग्य तपशीलाची नोंद (सर्व्हे क्रमांक/गट क्रमांक/सीटीएस क्रमांक/गावाचे नाव)"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      id="standard-basic"
                      disabled={disabled}
                      variant="outlined"
                      {...register("quation1")}
                      error={!!errors.quation1}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation1") ? true : false) || (router.query.quation1 ? true : false),
                      }}
                      helperText={
                        errors?.quation1 ? errors.quation1.message : null
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>2</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Total Area in Land (in Sq.mt.)"
                      : "जमिनीतील एकूण क्षेत्रफळ (चौ.मी. मध्ये)"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      id="standard-basic"
                      variant="outlined"
                      disabled={disabled}
                      {...register("quation2")}
                      error={!!errors.quation2}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation2") ? true : false) || (router.query.quation2 ? true : false),
                      }}
                      helperText={
                        errors?.quation2 ? errors.quation2.message : null
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>3</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Whether the land is under reference from a part of larger reservation"
                      : "मोठ्या आरक्षणाच्या भागातून जमीन संदर्भाधीन आहे की नाही"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation2}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation3"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation3 ? errors.quation3.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>4</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Area under Reservation as per certificate of Architect/Technical person (in Sq.mt.)"
                      : "वास्तुविशारद/तांत्रिक व्यक्तीच्या प्रमाणपत्रानुसार आरक्षणाखालील क्षेत्र (चौ.मी. मध्ये)"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      id="standard-basic"
                      variant="outlined"
                      disabled={disabled}
                      {...register("quation4")}
                      error={!!errors.quation4}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation4") ? true : false) || (router.query.quation4 ? true : false),
                      }}
                      helperText={
                        errors?.quation4 ? errors.quation4.message : null
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>5</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Is reservation area is encumbered?"
                      : "आरक्षण क्षेत्र बोजड आहे का?"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation5}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation5"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation5 ? errors.quation5.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}></td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "A) Enter encumbered area (in Sq.mt)"
                      : "अ) भारित क्षेत्र प्रविष्ट करा (चौ.मी. मध्ये)"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      id="standard-basic"
                      disabled={disabled}
                      variant="outlined"
                      {...register("quation5A")}
                      error={!!errors.quation5A}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation5A") ? true : false) || (router.query.quation5A ? true : false),
                      }}
                      helperText={
                        errors?.quation5A ? errors.quation5A.message : null
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>6</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Is any Transmission line crossing through reservation?"
                      : "आरक्षणातून पारेषण लाईन ओलांडत आहे का?"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation6}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation6"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation6 ? errors.quation6.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>7</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Property tax applicable?"
                      : "मालमत्ता कर लागू?"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation7}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation7"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation7 ? errors.quation7.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>8</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "If reservation is related to other than planning authority,NOC from the appropriate authority submitted?"
                      : "जर आरक्षण नियोजन प्राधिकरणाव्यतिरिक्त इतर संबंधित असेल तर, योग्य प्राधिकरणाकडून एनओसी सादर केली जाईल?"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation8}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation8"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation8 ? errors.quation8.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}></td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "A) If Yes, Upload the NOC"
                      : "अ) होय असल्यास, एनओसी अपलोड करा"}
                  </td>
                  <td style={thStyle}>
                    {/* quation8A */}

                    <UploadButton
                      appName={appName}
                      serviceName={serviceName}
                      filePath={setQuation8A}
                      fileName={quation8A}
                      // fileData={applicantPhoto}
                    />

                    {/* <UploadButton
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("quation8A")}
                      fileKey={"quation8A"}
                      // showDel={pageMode == "View" ? false : true}
                      showDel="true"
                    /> */}

                    {/* <button>Upload</button> */}
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>9</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Additional Information, if any"
                      : "अतिरिक्त माहिती, असल्यास"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      disabled={disabled}
                      id="standard-basic"
                      variant="outlined"
                      {...register("quation9")}
                      error={!!errors.quation9}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation9") ? true : false) || (router.query.quation9 ? true : false),
                      }}
                      helperText={
                        errors?.quation9 ? errors.quation9.message : null
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>10</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Area Designated on Development Plan"
                      : "विकास आराखड्यावर नियुक्त केलेले क्षेत्र"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation10}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation10"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Congested"
                              control={<Radio />}
                              label={
                                language == "en" ? "Congested" : "गजबजलेले"
                              }
                            />
                            <FormControlLabel
                              value="Non Congested"
                              control={<Radio />}
                              label={
                                language == "en"
                                  ? "Non Congested"
                                  : "नॉन कंजेस्टेड"
                              }
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation10 ? errors.quation10.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>11</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "In case reservation for amenity, land leveling & compound is proposed?"
                      : "सुविधा, जमीन सपाटीकरण आणि कंपाउंडसाठी आरक्षण प्रस्तावित असल्यास?"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation11}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation11"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation11 ? errors.quation11.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}></td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "A) Applicant is ready to pay cost of construction of compound wall & land leveling?"
                      : "अ) अर्जदार कंपाऊंड वॉल आणि जमीन सपाटीकरणाचा खर्च देण्यास तयार आहे का?"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation11A}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation11A"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation11A ? errors.quation11A.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}></td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "B) Quantum of DRC shall be reduced by 0.15"
                      : "ब) DRC चे प्रमाण 0.15 ने कमी केले जाईल"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation11B}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation11B"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              label={language == "en" ? "Aggreed" : "सहमत"}
                              control={<Radio />}
                              value="aggreed"
                            />
                            <FormControlLabel
                              label={
                                language == "en" ? "Not Aggreed" : "सहमत नाही"
                              }
                              control={<Radio />}
                              value="notAggreed"
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation11B ? errors.quation11B.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>12</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Does land fall under ULC Section 20/21?"
                      : "जमीन ULC कलम 20/21 अंतर्गत येते का?"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation12}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation12"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation12 ? errors.quation12.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}></td>
                  <td style={thStyleLeft}>
                    {language == "en" ? "C) Affidevit" : "क) शपथपत्र"}
                  </td>
                  <td
                    style={thStyle}
                    // styles={{backgroundColor:"red"}}
                  >
                    {/* sdasda */}
                    {/* quation12C */}
                    <div>
                      <UploadButton
                        appName={appName}
                        serviceName={serviceName}
                        filePath={setQuation12C}
                        fileName={quation12C}
                        // fileData={applicantPhoto}
                      />
                      {/* <UploadButton
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("quation12C")}
                      fileKey={"quation12C"}
                      // showDel={pageMode == "View" ? false : true}
                      showDel="true"
                    /> */}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}></td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "D) Indemnity Bond"
                      : "ड) नुकसानभरपाई बाँड"}
                  </td>
                  <td style={thStyle}>
                    {/* quation12D */}
                    <UploadButton
                      appName={appName}
                      serviceName={serviceName}
                      filePath={setQuation12D}
                      fileName={quation12D}
                      // fileData={applicantPhoto}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>13</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "The area were land is situated is having legal impediment"
                      : "क्षेत्रफळ वसलेले असल्याने कायदेशीर अडथळे येत आहेत"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      sx={{
                        width: "230px",
                      }}
                      variant="standard"
                      disabled={disabled}
                      error={!!errors.quation13}
                    >
                      {/* <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.quation13 ? true : false}
                >
                  <FormattedLabel id="quation13" required />
                 reservation Name
                </InputLabel> */}
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            disabled={router.query.quation13 ? true : false}
                            value={
                              router.query.quation13
                                ? router.query.quation13
                                : field.value
                            }
                            onChange={(value) => field.onChange(value)}
                            label="quation13"
                          >
                            {area &&
                              area.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {
                                    // @ts-ignore
                                    language === "en"
                                      ? value?.name
                                      : value?.nameMr
                                  }
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="quation13"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.quation13 ? errors.quation13.message : null}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}></td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "A) How much area under reservation is affected by legal impediment?"
                      : "अ) आरक्षणाखालील किती क्षेत्र कायदेशीर अडथळ्यामुळे प्रभावित आहे?"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      id="standard-basic"
                      variant="outlined"
                      disabled={disabled}
                      {...register("quation13A")}
                      error={!!errors.quation13A}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation13A") ? true : false) || (router.query.quation13A ? true : false),
                      }}
                      helperText={
                        errors?.quation13A ? errors.quation13A.message : null
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>14</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Enter google map location link showing land under reference"
                      : "गुगल मॅप लोकेशन लिंक एंटर करा जी संदर्भाखाली जमीन दर्शवते"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      disabled={disabled}
                      id="standard-basic"
                      variant="outlined"
                      {...register("quation14")}
                      error={!!errors.quation14}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation14") ? true : false) || (router.query.quation14 ? true : false),
                      }}
                      helperText={
                        errors?.quation14 ? errors.quation14.message : null
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>15</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "TILR measurement plan number"
                      : "TILR मापन योजना क्रमांक"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      disabled={disabled}
                      id="standard-basic"
                      variant="outlined"
                      {...register("quation15")}
                      error={!!errors.quation15}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation15") ? true : false) || (router.query.quation15 ? true : false),
                      }}
                      helperText={
                        errors?.quation15 ? errors.quation15.message : null
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>16</td>
                  <td style={thStyleLeft}>
                    {language == "en" ? "Measurement Date " : "मापन तारीख"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      sx={{
                        marginTop: 0,
                        backgroundColor: "white",
                        width: "84%",
                      }}
                      disabled={disabled}
                      error={!!errors.quation16}
                    >
                      <Controller
                        control={control}
                        name="quation16"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              // disabled={inputState}
                              inputFormat="DD/MM/YYYY"
                              maxDate={new Date()}
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD"),
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
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
                        {errors?.quation16 ? errors.quation16.message : null}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}>17</td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "Are there any trees on the site ?"
                      : "साइटवर काही झाडे आहेत का?"}
                  </td>
                  <td style={thStyle}>
                    {" "}
                    <FormControl
                      flexDirection="row"
                      error={!!errors.quation17}
                      disabled={disabled}
                    >
                      {" "}
                      <Controller
                        name="quation17"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            row
                            onChange={(value) => field.onChange(value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.quation17 ? errors.quation17.message : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={thStyle}></td>
                  <td style={thStyleLeft}>
                    {language == "en"
                      ? "A) Number of trees"
                      : "अ) झाडांची संख्या"}
                  </td>
                  <td style={thStyle}>
                    <TextField
                      // label={<FormattedLabel id="natureOfExacavationMr" />}
                      disabled={disabled}
                      id="standard-basic"
                      variant="outlined"
                      {...register("quation17A")}
                      error={!!errors.quation17A}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("quation17A") ? true : false) || (router.query.quation17A ? true : false),
                      }}
                      helperText={
                        errors?.quation17A ? errors.quation17A.message : null
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Box>
      </Paper>
    </>
  );
};

export default TdrFsiChecklist;
