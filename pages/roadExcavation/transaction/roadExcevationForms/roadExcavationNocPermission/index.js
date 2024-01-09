import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useState } from "react";
import theme from "../../../../../theme";
import * as yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import router from "next/router";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import styles from "./view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";

// import UploadButton from "../../../../../components/fileUpload/UploadButton";
import UploadButton from "../../fileUpload/UploadButton";
import { roadExcavationCitizenSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import FileTable from "../../../../../components/roadExcevation/FileUpload/FileTable";
import { Engineering } from "@mui/icons-material";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import Loader from "../../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  const methods = useForm({
    // criteriaMode: "all",
    resolver: yupResolver(
      yup.object().shape({ ...roadExcavationCitizenSchema })
    ),
    // mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "witnesses", // unique name for your Field Array
    }
  );

  console.log(":fields", fields);
  const [doc, setDoc] = useState();
  const language = useSelector((store) => store.labels.language);
  const logedInUser = localStorage.getItem("loggedInUser");
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
  //get logged in user
  const user = useSelector((state) => state.user.user);
  //upload states
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [zoneKeys, setZoneKeys] = useState([]);
  const [zoneWardKeys, setZoneWardKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [taxReceipt, setTaxReceipt] = useState();
  const [diggingMap, setDiggingMap] = useState();
  const [otherDoc, setotherDoc] = useState();
  const [workOrderfromConcernDepartment, setworkOrderfromConcernDepartment] =useState();
  const [taxReceiptEncrypt, setTaxReceiptEncrupt] = useState();
  const [diggingMapEncrypt, setDiggingMapEncrupt] = useState();
  const [otherDocEncrypt, setotherDocEncrupt] = useState();
  const [workOrderfromConcernDepartmentEncrypt, setworkOrderfromConcernDepartmentEncrupt] =useState();
  const [docView, setDocView] = useState(false);
  const [natureofExcavation, setnatureofExcavation] = useState([]);
  const [loadderState, setLoadderState] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const userToken = useGetToken();
  // const [authorizedToUpload, setAuthorizedToUpload] = useState(false);

  let typeOfPavementList = [
    { value: 1, lable: "Soil (Murum) road" },
    // { value: 2, lable: "WBM Road" },
    { value: 3, lable: "BBM With MPM road" },
    { value: 4, lable: "BT Road (Full Crushed)" },
    { value: 5, lable: "Footpath" },
    { value: 6, lable: "Paving Blocks" },
  ];

  let typeOfServicesList = [
    { value: 1, lable: "OFC" },
    { value: 2, lable: "GAS Line" },
    { value: 3, lable: "Electricity Cable" },
    { value: 4, lable: "Drainage" },
    { value: 5, lable: "Water Line" },
    { value: 6, lable: "CCTV" },
    { value: 7, lable: "Other" },
  ];

  let applicantTypeList = [
    { value: 1, lable: "Central" },
    { value: 2, lable: "State" },
    { value: 3, lable: "Private" },
    { value: 4, lable: "Other" },
  ];

  let subApplicantCentralList = [
    { value: 1, lable: "Defence" },
    { value: 2, lable: "BSNL" },
    { value: 3, lable: "GAIL" },
    { value: 4, lable: "Other" },
  ];

  let subApplicantStateList = [
    { value: 1, lable: "Maha Metro" },
    { value: 2, lable: "MNGL (Maharashtra Natural GAS Ltd)" },
    { value: 3, lable: "MSEB (Maharashtra State Electricity Board)" },
    { value: 4, lable: "PCMC" },
  ];
  // let natureofExcavation = [
  //   { value: 1, lable: "Parallel" },
  //   { value: 2, lable: "Perpendicular" },
  //   { value: 3, lable: "Cross Cut" },
  // ];

  let typeOfBRTSRoadList = [
    { value: 1, lable: "Old Mumbai Pune(NH4) BRTS Road" },
    { value: 2, lable: "Wakad - Bhosari BRTS Road" },
    { value: 3, lable: "Aundh - Ravet BRTS Road" },
    { value: 4, lable: "Kalewadi - KSB Chowk - Chikhali BRTS Road" },
    // {value:5,lable:"Old Mumbai Pune(NH4) BRTS Road"},
    { value: 5, lable: "Aundh - Ravet BRTS Road" },
    { value: 6, lable: "Vishrantwadi - Alandi BRTS Road" },
  ];
  let depthOfRoadList = [
    { value: 1, lable: "0.6 to 0.9" },
    { value: 2, lable: "1.0 to 1.2" },
    { value: 3, lable: "1.3 to 1.5" },
    { value: 4, lable: "1.5 and Above" },
  ];
  let widthOfRoadList = [
    { value: 1, lable: "Below 18 meter" },
    // { value: 2, lable: "18 Meter" },
    { value: 3, lable: "18-30 meter" },
    { value: 4, lable: "30-45 meter" },
    { value: 5, lable: "Above 45 meter" },
  ];
  // console.log("typesOfServices",watch("typesOfServices"));
  const getNatureOfExcavation = () => {
    axios.get(`${urls.RENPURL}/mstNatureOfExcavation/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      // console.log("mstNatureOfExcavation", r);
      let result = r.data.mstNatureOfExcavationDaoList;
      // console.log("mstNatureOfExcavation", result);
      setnatureofExcavation(result);
    })
    .catch((error) => {
      callCatchMethod(error, language);
    });
  };
  // const _columns = [
  //   {
  //     headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
  //     field: "srNo",
  //     flex: 0.2,
  //     //   width: 100,
  //     // flex: 1,
  //   },
  //   {
  //     headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
  //     field: "fileName",
  //     // File: "originalFileName",
  //     // width: 300,
  //     flex: 1,
  //   },
  //   {
  //     headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
  //     field: "extension",
  //     flex: 1,
  //     // width: 140,
  //   },
  //   // language == "en"
  //   //   ? {
  //   //       headerName: "Uploaded By",
  //   //       field: "attachedNameEn",
  //   //       flex: 2,
  //   //       // width: 300,
  //   //     }
  //   //   : {
  //   //       headerName: "द्वारे अपलोड केले",
  //   //       field: "attachedNameMr",
  //   //       flex: 2,
  //   //       // width: 300,
  //   //     },
  //   {
  //     headerName: `${language == "en" ? "Action" : "क्रिया"}`,
  //     field: "Action",
  //     flex: 1,
  //     // width: 200,

  //     renderCell: (record) => {
  //       return (
  //         <>
  //           <IconButton
  //             color="primary"
  //             onClick={() => {
  //               window.open(
  //                 `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
  //                 "_blank"
  //               );
  //             }}
  //           >
  //             <VisibilityIcon />
  //           </IconButton>
  //         </>
  //       );
  //     },
  //   },
  // ];

  const getZoneKeys = () => {
    //setVaIdlues("setBackDrop", true);
    axios.get(`${urls.BaseURL}/zone/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      console.log("ee", r.data.zone);
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    });
  };
  const getWardZoneKeys = (index) => {
    {
      if (watch("nonBRTSRoadZone")) {
        axios
          .get(
            `${urls.CFCURL
            }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${watch(
              "nonBRTSRoadZone"
            )}`,{
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((r) => {
            console.log("rrrrrrrr", r);
            // setZoneWardKeys(r.data)
            setZoneWardKeys(
              r.data.map((row) => ({
                id: row.id,
                wardName: row.wardName,
                wardNameMr: row.wardNameMr,
              }))
            );
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    }
    // }
  };

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);
  useEffect(() => {
    getZoneKeys();
    getWardZoneKeys();
  }, [watch("nonBRTSRoadZone")]);
  console.log("zoneKeys", watch("nonBRTSRoadZone"));

  useEffect(() => {
    console.log("finalFiles", finalFiles);
  }, [finalFiles]);
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  // const authority = user?.menus?.find((r) => {
  //   return r.id == selectedMenuFromDrawer;
  // })?.roles;

  // console.log("authority", authority);

  // let juniorEngineer = authority && authority.find((val) => val === "JUNIOR_ENGINEER")
  // let deputyEngineer = authority && authority.find((val) => val === "DEPUTY_ENGINEER")
  // let executiveEngineer = authority && authority.find((val) => val === "EXECUTIVE_ENGINEER")

  // console.log("juniorEngineer", juniorEngineer);
  // console.log("deputyEngineer", deputyEngineer);
  // console.log("executiveEngineer", executiveEngineer);

  //clear
  const exitButton = () => {
    router.push("/dashboard");
  };
  const [btnSaveText, setbtnSaveText] = useState("Save");
  const clearButton = () => {
    console.log("clear");
    reset({
      ...resetValuesClear,
    });
  };

  useEffect(() => {
    getNatureOfExcavation();
  }, []);

  // Reset Values Clear
  const resetValuesClear = {
    companyName: "",
    companyNameMr: "",
    categoryOfRoad: "",
    firstName: "",
    firstNameMr: "",
    middleName: "",
    middleNameMr: "",
    lastName: "",
    lastNameMr: "",
    landlineNo: "",
    mobileNo: "",
    email: "",
    // eligibleForSchemeYn: "",
    mainScheme: "",
    subScheme: "",
    permitPeriod: "",
    scopeOfWork: "",
    startLatAndStartLng: "",
    endLatAndEndLng: "",
    // locationSameAsPcmcOrderYn: "",
    // locationRemark: "",
    // lengthSameAsPcmcOrderYn: "",
    // lengthRemark: "",
    // depthSameAsPcmcOrderYn: "",
    // depthRemark: "",
    // widthSameAsPcmcOrderYn: "",
    // widthRemark: "",
  };

  const handleUploadDocument = (path) => {
    console.log("handleUploadDocument", path);
    let temp = {
      documentPath: path,
      documentKey: 1,
      documentType: "",
      remark: "",
    };
    setDoc(temp);
  };

  let onSubmitFunc = (formData) => {
    console.log("onSubmitFunc", taxReceiptEncrypt);
    let body = {
      ...formData,
      taxReceipt: taxReceiptEncrypt,
      diggingMap: diggingMapEncrypt,
      workOrderfromConcernDepartment: workOrderfromConcernDepartmentEncrypt,
      otherDoc: otherDocEncrypt,
      createdUserId: user?.id,
    };
    console.log("onSubmitFunc1", body);
    if (btnSaveText === "Save") {
      if (loggedInUser === "citizenUser") {
        setLoadderState(true)
        const tempData = axios
          .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/save`, body, {
            headers: {
              UserId: user.id,
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
              setLoadderState(false)
              sweetAlert(
                "Saved!",
                "Road Excavation Application Saved successfully !",
                "success"
              );
              router.push(
                "/dashboard"
                // "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else {
        setLoadderState(true)
        const tempData = axios
          .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/save`, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            setLoadderState(false)
            if (res.status == 201 || res.status == 200) {
              sweetAlert(
                "Saved!",
                "Road Excavation Application Saved successfully !",
                "success"
              );
              // router.push("/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails");
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    }
  };
  console.log("user123", logedInUser, user);
  useEffect(() => {
    if (router.query.pageMode != "View") {
      if (logedInUser == "citizenUser" && watch("isIndividualOrFirm") == "Individual") {
        setValue("firstName", user.firstName);
        setValue("middleName", user.middleName);
        setValue("lastName", user.surname);
        setValue("firstNameMr", user.firstNamemr);
        setValue("middleNameMr", user.middleNamemr);
        setValue("lastNameMr", user.surnamemr);
        setValue("emailAddress", user.emailID);
        setValue("mobileNo", user.mobile);
      }
      else {
        setValue("firstName", "");
        setValue("middleName", "");
        setValue("lastName", "");
        setValue("firstNameMr", "");
        setValue("middleNameMr", "");
        setValue("lastNameMr", "");
        setValue("emailAddress", "");
        setValue("mobileNo", "");
      }
    }
  }, [watch("isIndividualOrFirm")])


  const getApplicationData = (id) => {
    if (id) {
      axios
        .get(
          `${urls.RENPURL}/trnExcavationRoadCpmpletion/getDataById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          let result = r.data;
          console.log("result", result);
          reset(result);    
          setDiggingMap(r.data.diggingMap)
          setworkOrderfromConcernDepartment(r.data.workOrderfromConcernDepartment)
          setTaxReceipt(r.data.taxReceipt)
          setotherDoc(r.data.otherDoc)
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }
  useEffect(() => {
    if (router.query.pageMode == "View") {
      // setDisabled(true)
      getApplicationData(router.query.applicationId)
      setDisabled(true)
      setDocView(true)

    }
  }, [])
console.log("natureOfExcavation",watch("natureOfExcavation"));
  return (
    <ThemeProvider theme={theme}>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          style={{
            // margin: "30px",
            marginBottom: "100px",
            marginTop: "50px",
          }}
          elevation={2}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "98%",
                height: "auto",
                // overflow: "auto",
                padding: "0.5%",
                color: "black",
                fontSize: 19,
                fontWeight: 500,
                // borderRadius: 100,
              }}
            >
              <strong className={styles.fancy_link1}>
                <FormattedLabel id="RoadExcavation_NocPermission" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          <Box
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitFunc)}>
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                      paddingLeft: "70px",
                    }}
                  >
                    <div>
                      <Typography error={!!errors.mobileNo}>Select</Typography>
                    </div>
                    <FormControl
                      flexDirection="row"
                      error={!!errors.isIndividualOrFirm}
                      style={{
                        paddingLeft: "80px",
                      }}
                      disabled={disabled}
                    >
                      <Controller
                        name="isIndividualOrFirm"
                        control={control}
                        defaultValue=""
                        error={!!errors.mobileNo}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="Individual"
                              control={<Radio />}
                              label={<FormattedLabel id="individual" />}
                            />
                            <FormControlLabel
                              value="Firm"
                              control={<Radio />}
                              label={<FormattedLabel id="firm" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.isIndividualOrFirm
                          ? errors.isIndividualOrFirm.message
                          : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  rules={{ required: true }}
                  id="companyName"
                  name="companyName"
                  label={<FormattedLabel id="companyName" />}
                  variant="standard"
                  {...register("companyName")}
                  error={!!errors.companyName}
                  helperText={
                    errors?.companyName ? errors.companyName.message : null
                  }
                /> */}
                    <div style={{ width: "250px" }}>
                      <Transliteration
                        style={{ backgroundColor: "white", margin: "250px" }}
                        _key={"companyName"}
                        labelName={"companyName"}
                        fieldName={"companyName"}
                        updateFieldName={"companyNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={disabled}
                        label={<FormattedLabel id="companyName" required />}
                        error={!!errors.companyName}
                        helperText={
                          errors?.companyName ? errors.companyName.message : null
                        }
                      />
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  rules={{ required: true }}
                  id="companyNameMr"
                  name="companyNameMr"
                  label={<FormattedLabel id="companyNameMr" />}
                  variant="standard"
                  {...register("companyNameMr")}
                  error={!!errors.companyNameMr}
                  helperText={
                    errors?.companyNameMr ? errors.companyNameMr.message : null
                  }
                /> */}
                    <div style={{ width: "250px" }}>
                      <Transliteration
                        _key={"companyNameMr"}
                        labelName={"companyNameMr"}
                        fieldName={"companyNameMr"}
                        updateFieldName={"companyName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={disabled}
                        label={<FormattedLabel id="companyNameMr" required />}
                        error={!!errors.companyNameMr}
                        helperText={
                          errors?.companyNameMr
                            ? errors.companyNameMr.message
                            : null
                        }
                      />
                    </div>
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  {/* ////////////////////////////////////////// */}

                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="firstName"
                  name="firstName"
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={
                    errors?.firstName ? errors.firstName.message : null
                  }
                /> */}
                    <div style={{ width: "250px" }}>
                      <Transliteration
                        _key={"firstName"}
                        labelName={"firstName"}
                        fieldName={"firstName"}
                        updateFieldName={"firstNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={disabled}
                        label={<FormattedLabel id="firstName" required />}
                        error={!!errors.firstName}
                        helperText={
                          errors?.firstName ? errors.firstName.message : null
                        }
                      />
                    </div>
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="middleName"
                  name="middleName"
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  {...register("middleName")}
                  error={!!errors.middleName}
                  helperText={
                    errors?.middleName ? errors.middleName.message : null
                  }
                /> */}
                    <div style={{ width: "250px" }}>
                      <Transliteration
                        _key={"middleName"}
                        labelName={"middleName"}
                        fieldName={"middleName"}
                        updateFieldName={"middleNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={disabled}
                        label={<FormattedLabel id="middleName" required />}
                        error={!!errors.middleName}
                        helperText={
                          errors?.middleName ? errors.middleName.message : null
                        }
                      />
                    </div>
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lastName"
                  name="lastName"
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors?.lastName ? errors.lastName.message : null}
                /> */}
                    <div style={{ width: "250px" }}>
                      <Transliteration
                        _key={"lastName"}
                        labelName={"lastName"}
                        fieldName={"lastName"}
                        updateFieldName={"lastNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={disabled}
                        label={<FormattedLabel id="lastName" required />}
                        error={!!errors.lastName}
                        helperText={
                          errors?.lastName ? errors.lastName.message : null
                        }
                      />
                    </div>
                  </Grid>

                  {/* ////////////////////////////////////////// */}

                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="firstNameMr"
                  name="firstNameMr"
                  label={<FormattedLabel id="firstNameMr" />}
                  variant="standard"
                  {...register("firstNameMr")}
                  error={!!errors.firstNameMr}
                  helperText={
                    errors?.firstNameMr ? errors.firstNameMr.message : null
                  }
                /> */}
                    <div style={{ width: "250px" }}>
                      <Transliteration
                        _key={"firstNameMr"}
                        labelName={"firstNameMr"}
                        fieldName={"firstNameMr"}
                        updateFieldName={"firstName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={disabled}
                        label={<FormattedLabel id="firstNameMr" required />}
                        error={!!errors.firstNameMr}
                        helperText={
                          errors?.firstNameMr ? errors.firstNameMr.message : null
                        }
                      />
                    </div>
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="middleNameMr"
                  name="middleNameMr"
                  label={<FormattedLabel id="middleNameMr" />}
                  variant="standard"
                  {...register("middleNameMr")}
                  error={!!errors.middleNameMr}
                  helperText={
                    errors?.middleNameMr ? errors.middleNameMr.message : null
                  }
                /> */}
                    <div style={{ width: "250px" }}>
                      <Transliteration
                        _key={"middleNameMr"}
                        labelName={"middleNameMr"}
                        fieldName={"middleNameMr"}
                        updateFieldName={"middleName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={disabled}
                        label={<FormattedLabel id="middleNameMr" required />}
                        error={!!errors.middleNameMr}
                        helperText={
                          errors?.middleNameMr
                            ? errors.middleNameMr.message
                            : null
                        }
                      />
                    </div>
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lastNameMr"
                  name="lastNameMr"
                  label={<FormattedLabel id="lastNameMr" />}
                  variant="standard"
                  {...register("lastNameMr")}
                  error={!!errors.lastNameMr}
                  helperText={
                    errors?.lastNameMr ? errors.lastNameMr.message : null
                  }
                /> */}
                    <div style={{ width: "250px" }}>
                      <Transliteration
                        _key={"lastNameMr"}
                        labelName={"lastNameMr"}
                        fieldName={"lastNameMr"}
                        updateFieldName={"lastName"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={disabled}
                        label={<FormattedLabel id="lastNameMr" required />}
                        error={!!errors.lastNameMr}
                        helperText={
                          errors?.lastNameMr ? errors.lastNameMr.message : null
                        }
                      />
                    </div>
                  </Grid>

                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      InputLabelProps={{
                        shrink:watch("landlineNo")? true: false
                      }}
                      id="landlineNo"
                      name="landlineNo"
                      label={<FormattedLabel id="landLineNo" />}
                      variant="standard"
                      disabled={disabled}
                      {...register("landlineNo")}
                      error={!!errors.landlineNo}
                      helperText={
                        errors?.landlineNo ? errors.landlineNo.message : null
                      }
                    />
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="mobileNo"
                      name="mobileNo"
                      InputLabelProps={{
                        shrink: watch("mobileNo") ? true : false,
                      }}
                      label={<FormattedLabel id="mobileNo" />}
                      variant="standard"
                      disabled={disabled}
                      {...register("mobileNo")}
                      error={!!errors.mobileNo}
                      helperText={
                        errors?.mobileNo ? errors.mobileNo.message : null
                      }
                    />
                  </Grid>
                  {/* //////////////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="emailAddress"
                      name="emailAddress"
                      InputLabelProps={{
                        shrink: watch("emailAddress") ? true : false,
                      }}
                      disabled={disabled}
                      label={<FormattedLabel id="emailAddress" />}
                      variant="standard"
                      {...register("emailAddress")}
                      error={!!errors.emailAddress}
                      helperText={
                        errors?.emailAddress ? errors.emailAddress.message : null
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                      paddingLeft: "70px",
                    }}
                  >
                    <div>
                      <Typography>
                        {language == "en"
                          ? "Category of Road"
                          : "रस्त्याची श्रेणी"}
                      </Typography>
                    </div>
                    <FormControl
                      flexDirection="row"
                      error={!!errors.categoryOfRoad}
                      disabled={disabled}
                    >
                      <Controller
                        name="categoryOfRoad"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="BRTS Road"
                              control={<Radio />}
                              label={<FormattedLabel id="brtsRoad" />}
                            />
                            <FormControlLabel
                              value="Internal Road"
                              control={<Radio />}
                              label={<FormattedLabel id="internalRoad" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText>
                        {errors?.categoryOfRoad
                          ? errors.categoryOfRoad.message
                          : null}{" "}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {watch("categoryOfRoad") == "BRTS Road" && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <FormControl disabled={disabled}>
                          <InputLabel required error={!!errors.nameOfBRTSRoad}>
                            <FormattedLabel id="nameofBRTSRoad" />
                          </InputLabel>
                          <Controller
                            control={control}
                            name="nameOfBRTSRoad"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.nameOfBRTSRoad}
                              >
                                {typeOfBRTSRoadList &&
                                  typeOfBRTSRoadList.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                      {type.lable}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.nameOfBRTSRoad}>
                            {/* {errors.nameOfBRTSRoad
                        ? labels.academicYearRequired
                        : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {watch("categoryOfRoad") == "Internal Road" && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <FormControl disabled={disabled}>
                          <InputLabel required error={!!errors.nonBRTSRoadZone}>
                            <FormattedLabel id="zone" />
                          </InputLabel>
                          <Controller
                            control={control}
                            name="nonBRTSRoadZone"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.nonBRTSRoadZone}
                              >
                                {zoneKeys &&
                                  zoneKeys.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                      {type.zoneName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.nonBRTSRoadZone}>
                            {/* {errors.nonBRTSRoadZone
                        ? labels.academicYearRequired
                        : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <FormControl disabled={disabled}>
                          <InputLabel required error={!!errors.nonBRTSRoadWard}>
                            <FormattedLabel id="ward" />
                          </InputLabel>
                          <Controller
                            control={control}
                            name="nonBRTSRoadWard"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.nonBRTSRoadWard}
                              >
                                {zoneWardKeys &&
                                  zoneWardKeys.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                      {type.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.nonBRTSRoadWard}>
                            {/* {errors.nonBRTSRoadWard
                        ? labels.academicYearRequired
                        : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white", width: "250px" }}
                          id="nonBRTSRoadLocationOfExcavation"
                          name="nonBRTSRoadLocationOfExcavation"
                          label={<FormattedLabel id="locationOfExcavation" />}
                          disabled={disabled}
                          // label="Location Of Excavation"
                          variant="standard"
                          {...register("nonBRTSRoadLocationOfExcavation")}
                          error={!!errors.nonBRTSRoadLocationOfExcavation}
                          helperText={
                            errors?.nonBRTSRoadLocationOfExcavation
                              ? errors.nonBRTSRoadLocationOfExcavation.message
                              : null
                          }
                        />
                      </Grid>
                    </>
                  )}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled={disabled}>
                      <InputLabel required error={!!errors.typeOfPavement}>
                        {language == "en"
                          ? "Type Of Pavement"
                          : "फुटपाथचा प्रकार"}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="typeOfPavement"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.typeOfPavement}
                          >
                            {typeOfPavementList &&
                              typeOfPavementList.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.lable}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.typeOfPavement}>
                        {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled={disabled}>
                      <InputLabel required error={!!errors.typesOfServices}>
                        {language == "en" ? "Type Of Service" : "सेवेचा प्रकार"}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="typesOfServices"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.typesOfServices}
                          >
                            {typeOfServicesList &&
                              typeOfServicesList.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.lable}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.typesOfServices}>
                        {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {watch("typesOfServices") == 7 && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white", width: "250px" }}
                          id="otherTypesOfServices"
                          name="otherTypesOfServices"
                          // label={<FormattedLabel id="otherTypesOfServices" />}
                          label="Other type of service"
                          variant="standard"
                          disabled={disabled}
                          {...register("otherTypesOfServices")}
                          error={!!errors.otherTypesOfServices}
                          helperText={
                            errors?.otherTypesOfServices
                              ? errors.otherTypesOfServices.message
                              : null
                          }
                        />
                      </Grid>
                    </>
                  )}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled={disabled}>
                      <InputLabel required error={!!errors.firmorIndividual}>
                        {language == "en"
                          ? "Applicant Type"
                          : "अर्जदाराचा प्रकार"}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="firmorIndividual"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.firmorIndividual}
                          >
                            {applicantTypeList &&
                              applicantTypeList.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.lable}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.firmorIndividual}>
                        {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {watch("firmorIndividual") == 1 && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <FormControl disabled={disabled}>
                          <InputLabel required error={!!errors.applicantSubType}>
                            {language == "en"
                              ? "Applicant Sub Type"
                              : "अर्जदार उपप्रकार"}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="applicantSubType"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.applicantSubType}
                              >
                                {subApplicantCentralList &&
                                  subApplicantCentralList.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                      {type.lable}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.applicantSubType}>
                            {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {watch("applicantSubType") == 4 && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white", width: "250px" }}
                          id="otherApplicantSubType"
                          name="otherApplicantSubType"
                          disabled={disabled}
                          // label={<FormattedLabel id="otherApplicantSubType" />}
                          label="Other Applicant Sub Type"
                          variant="standard"
                          {...register("otherApplicantSubType")}
                          error={!!errors.otherApplicantSubType}
                          helperText={
                            errors?.otherApplicantSubType
                              ? errors.otherApplicantSubType.message
                              : null
                          }
                        />
                      </Grid>
                    </>
                  )}

                  {watch("firmorIndividual") == 2 && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <FormControl disabled={disabled}>
                          <InputLabel required error={!!errors.applicantSubType}>
                            {language == "en"
                              ? "Applicant Sub Type"
                              : "अर्जदार उपप्रकार"}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="applicantSubType"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.applicantSubType}
                              >
                                {subApplicantStateList &&
                                  subApplicantStateList.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                      {type.lable}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.applicantSubType}>
                            {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {watch("firmorIndividual") == 4 && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white", width: "250px" }}
                          id="applicantSubType"
                          name="applicantSubType"
                          disabled={disabled}
                          // label={<FormattedLabel id="applicantSubType" />}
                          label="Other applicant type"
                          variant="standard"
                          {...register("applicantSubType")}
                          error={!!errors.applicantSubType}
                          helperText={
                            errors?.applicantSubType
                              ? errors.applicantSubType.message
                              : null
                          }
                        />
                      </Grid>
                    </>
                  )}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled={disabled}>
                      <InputLabel required error={!!errors.natureOfExcavation}>
                        {language == "en"
                          ? "Nature of Excavation"
                          : "उत्खननाचे स्वरूप"}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="natureOfExcavation"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.natureOfExcavation}
                          >
                            {natureofExcavation &&
                              natureofExcavation.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                  {language === "en" ? type.nameEng : type.nameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.natureOfExcavation}>
                        {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* /////////////////////////////////////////////////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                      style={{ backgroundColor: "white", width: "560px" }}
                      id="lengthOfRoad"
                      name="lengthOfRoad"
                      // label={<FormattedLabel id="lengthOfRoad" />}
                      label="Length of Road to be excavation  (Meter)"
                      variant="standard"
                      {...register("lengthOfRoad")}
                      error={!!errors.lengthOfRoad}
                      // helperText={
                      //   errors?.lengthOfRoad
                      //     ? errors.lengthOfRoad.message
                      //     : null
                      // }
                    /> */}
                    <TextField
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="lengthOfRoad"
                      name="lengthOfRoad"
                      disabled={disabled}
                      // label={<FormattedLabel id="lengthOfRoad" />}
                      label={
                        language == "en"
                          ? "Length of Road to be excavation (Meter)"
                          : "खोदाईच्या रस्त्याची लांबी (मीटर)"
                      }
                      InputLabelProps={{
                        shrink:watch("lengthOfRoad")? true: false
                      }}
                      variant="standard"
                      {...register("lengthOfRoad")}
                      error={!!errors.lengthOfRoad}
                      helperText={
                        errors?.lengthOfRoad ? errors.lengthOfRoad.message : null
                      }
                    />
                    {/* <FormHelperText error={!!errors.lengthOfRoad}>
                    {errors.lengthOfRoad
                        ? "requried only numbers"
                        : null}
                  </FormHelperText> */}
                  </Grid>
                  {/* /////////////////////////////////////////////////////////////////////////////////////// */}
                  {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    style={{ backgroundColor: "white", width: "250px" }}
                    id="widthOfRoad"
                    name="widthOfRoad"
                    // label={<FormattedLabel id="widthOfRoad" />}
                    label={
                      language == "en"
                        ? "Width of Road to be excavation (Meter)"
                        : "खोदाईच्या रस्त्याची रुंदी (मीटर)"
                    }
                    variant="standard"
                    {...register("widthOfRoad")}
                    error={!!errors.widthOfRoad}
                    helperText={
                      errors?.widthOfRoad ? errors.widthOfRoad.message : null
                    }
                  />
                </Grid> */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Tooltip title={language == "en"
                      ? "Width of Road to be excavation (Meter)"
                      : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}>
                      <FormControl disabled={disabled}>
                        <InputLabel required error={!!errors.widthOfRoad}>
                          {language == "en"
                            ? "Width of Road to be excavation (Meter)"
                            : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="widthOfRoad"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              {...field}
                              error={!!errors.widthOfRoad}
                            >
                              {widthOfRoadList &&
                                widthOfRoadList.map((type) => (
                                  <MenuItem key={type.value} value={type.value}>
                                    {type.lable}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.widthOfRoad}>
                          {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>
                  {/* /////////////////////////////////////////////////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled={disabled}>
                      <InputLabel required error={!!errors.depthOfRoad}>
                        {language == "en"
                          ? "Depth Of Road (meter)"
                          : "रस्त्याची खोली (मीटर)"}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="depthOfRoad"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.depthOfRoad}
                          >
                            {depthOfRoadList &&
                              depthOfRoadList.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.lable}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.depthOfRoad}>
                        {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* /////////////////////////////////////////////////////////////////////////////////////// */}
                </Grid>
                {/* /////////////////////////////////////////////////////////////////////////////////////// */}
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  {/* ////////////////////////////////////////// */}

                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="expectedPeriod"
                      name="expectedPeriod"
                      disabled={disabled}
                      label={<FormattedLabel id="expectedPeriodInDays" />}
                      // variant="outlined"
                      variant="standard"
                      InputLabelProps={{
                        shrink:watch("expectedPeriod")? true: false
                      }}
                      {...register("expectedPeriod")}
                      error={!!errors.expectedPeriod}
                      helperText={
                        errors?.expectedPeriod
                          ? errors.expectedPeriod.message
                          : null
                      }
                    />
                  </Grid>
                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="scopeOfWork"
                      name="scopeOfWork"
                      disabled={disabled}
                      label={<FormattedLabel id="scopeOfWork" />}
                      // variant="outlined"
                      InputLabelProps={{
                        shrink:watch("scopeOfWork")? true: false
                      }}
                      variant="standard"
                      {...register("scopeOfWork")}
                      error={!!errors.scopeOfWork}
                      helperText={
                        errors?.scopeOfWork ? errors.scopeOfWork.message : null
                      }
                    />
                  </Grid>
                </Grid>

                {/* ////////////////////////////////////////// */}
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >

                    <Tooltip title={<FormattedLabel id="startLatAndStartLng" />}>
                      <TextField
                        style={{
                          backgroundColor: "white",
                          width: "250px",
                          marginTop: "-10px",
                        }}
                        disabled={disabled}
                        id="startLatAndStartLng"
                        name="startLatAndStartLng"
                        InputLabelProps={{
                          shrink:watch("startLatAndStartLng")? true: false
                        }}
                        label={<FormattedLabel id="startLatAndStartLng" />}
                        variant="standard"
                        {...register("startLatAndStartLng")}
                        error={!!errors.startLatAndStartLng}
                        helperText={
                          errors?.startLatAndStartLng
                            ? errors.startLatAndStartLng.message
                            : null
                        }
                      /></Tooltip>
                  </Grid>
                  {/*///////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Tooltip title={<FormattedLabel id="endLatAndEndLng" />}>
                      <TextField
                        style={{
                          backgroundColor: "white",
                          width: "250px",
                          marginTop: "-10px",
                        }}
                        disabled={disabled}
                        id="endLatAndEndLng"
                        name="endLatAndEndLng"
                        InputLabelProps={{
                          shrink:watch("endLatAndEndLng")? true: false
                        }}
                        label={<FormattedLabel id="endLatAndEndLng" />}
                        // variant="outlined"
                        variant="standard"
                        {...register("endLatAndEndLng")}
                        error={!!errors.endLatAndEndLng}
                        helperText={
                          errors?.endLatAndEndLng
                            ? errors.endLatAndEndLng.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>
                  {/*///////////////////////////////////////// */}

                  {/*///////////////////////////////////////// */}
                </Grid>

                {/* file upload */}

                <Grid container>
                  <Grid item container alignItems="center">
                    <Grid item>
                      <Typography variant="h5" style={{ marginLeft: "50px", marginRight: "10px"}}>
                        <FormattedLabel id="requiredDocuments" />
                      </Typography>
                    </Grid>
                    <Grid item>
                    <span style={{ color: "red" }}>{language === "en" ? " (The maximum allowable document size is 5 megabytes (MB))" : " (अधिकतम स्वीकार्य दस्तऐवज आकार 5 मेगाबाइट्स (MB) आहे)"}</span>
                    </Grid>
                  </Grid>
                </Grid>
                {watch("isIndividualOrFirm") == "Individual" && (
                  <>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Grid
                        item
                        xl={3}
                        lg={3}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // marginLeft:"5vw"
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          <label>
                            {language == "en" ? "Tax Receipt" : "कर पावती"}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                        {console.log("taxReceipt1111",taxReceipt,taxReceiptEncrypt)}
                          <UploadButton
                            view={docView}
                            appName="ROAD"
                            serviceName="R-NOC"
                            fileUpdater={setTaxReceipt}
                            filePath={taxReceipt}
                            fileNameEncrypted={(path) => {                                                        
                              setTaxReceiptEncrupt(path)
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xl={3}
                        lg={3}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          <label>
                          {language=="en"?"Other":"इतर"}  <span style={{ color: "red" }}>*</span>
                          </label>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          <UploadButton
                            view={docView}
                            appName="ROAD"
                            serviceName="R-NOC"
                            fileUpdater={setotherDoc}
                            filePath={otherDoc}
                            fileNameEncrypted={(path) => {
                              // handleGetName(path); 
                              setotherDocEncrupt(path)
                            }}
                          />
                        </Grid>
                      </Grid>

                      {/* <Grid item xs={12}>
              <FileTable
                appName="ROAD" //Module Name
                serviceName={"R-NOC"} //Transaction Name
                fileName={attachedFile} //State to attach file
                filePath={setAttachedFile} // File state upadtion function
                newFilesFn={setAdditionalFiles} // File data function
                columns={_columns} //columns for the table
                rows={finalFiles} //state to be displayed in table
                uploading={setUploading}
                // authorizedToUpload={authorizedToUpload}
              />
            </Grid> */}
                    </Grid>
                  </>
                )}
                {watch("isIndividualOrFirm") == "Firm" && (
                  <>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Grid
                        item
                        xl={3}
                        lg={3}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          <label>
                          {language=="en"?"Digging Map":"खोदणे नकाशा"}<span style={{ color: "red" }}>*</span>
                          </label>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          <UploadButton
                            view={docView}
                            appName="ROAD"
                            serviceName="R-NOC"
                            fileUpdater={setDiggingMap}
                            filePath={diggingMap}
                            rules={{ required: true }}
                            fileNameEncrypted={(path) => {
                              // handleGetName(path); 
                              setDiggingMapEncrupt(path)
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xl={3}
                        lg={3}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          <label>
                            {" "}
                            {language=="en"?"Work Order from Concern Department":"संबंधित विभागाकडून कार्यादेश"}

                            <span style={{ color: "red" }}>*</span>
                          </label>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                          
                          <UploadButton
                            view={docView}
                            appName="ROAD"
                            serviceName="R-NOC"
                            fileUpdater={setworkOrderfromConcernDepartment}
                            filePath={workOrderfromConcernDepartment}
                            fileNameEncrypted={(path) => { 
                              // handleGetName(path);                           
                              setworkOrderfromConcernDepartmentEncrupt(path)
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
                <Grid
                  container
                  spacing={2}
                  style={{
                    // padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  {router.query.pageMode != "View" && <>
                    <Grid item>
                      <Button type="submit" variant="outlined">
                        <FormattedLabel id="save" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" onClick={clearButton}>
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                  </>}
                  <Grid item>
                    <Button variant="outlined" onClick={exitButton}>
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
                {/* //////////////////////////////////// */}
              </form>
            </FormProvider>
          </Box>
        </Paper>)}
    </ThemeProvider>
  );
};

export default Index;
