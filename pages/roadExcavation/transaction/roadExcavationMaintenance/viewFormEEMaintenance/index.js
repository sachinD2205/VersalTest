import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useState } from "react";
import theme from "../../../../../theme";
import * as yup from "yup";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";

import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { roadExcavationCitizenSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import HistoryComponent from "../../../../../components/roadExcevation/HistoryComponent";
import Loader from "../../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { DecryptData, EncryptData } from "../../../../../components/common/EncryptDecrypt";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    resolver: yupResolver(
      yup.object().shape({ ...roadExcavationCitizenSchema })
    ),
    // mode: "onSubmit",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "witnesses", // unique name for your Field Array
    }
  );

  console.log(":fields", fields);
  const [doc, setDoc] = useState();
  const [dataSource, setDataSource] = useState();
  const [actionEE, setactionEE] = useState();
  const [remarkEE, setremarkEE] = useState();
  const [siteVisitData, setsiteVisitData] = useState();
  const [actionJEErr, setactionJEErr] = useState(false);
  const [remarkJEErr, setremarkJEErr] = useState(false);
  const [zoneKeys, setZoneKeys] = useState([]);
  const [zoneWardKeys, setZoneWardKeys] = useState([]);
  const [natureofExcavation, setnatureofExcavation] = useState([]);
  const [applicantHistory, setApplicantHistory] = useState(null);
  const [applicantId, setApplicantId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [amount, setAmount] = useState();
  const [loadderState, setLoadderState] = useState(false);



  const language = useSelector((store) => store.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);
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
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const userToken = useGetToken();
  // console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;
let authorityFinal =authority[0]
  console.log("authorityFinal", authorityFinal);

  useEffect(() => {
    getSingleApplicationData(router.query.id);
  }, [router.query.id]);

  let typeOfPavementList = [
    { value: 1, lable: "Soil (Murum) road" },
    { value: 2, lable: "WBM Road" },
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
    { value: 5, lable: "Old Mumbai Pune(NH4) BRTS Road" },
    { value: 6, lable: "Aundh - Ravet BRTS Road" },
    { value: 7, lable: "Vishrantwadi - Alandi BRTS Road" },
  ];
  let depthOfRoadList = [
    { value: 1, lable: "0.6 to 0.9" },
    { value: 2, lable: "1.0 to 1.2" },
    { value: 3, lable: "1.3 to 1.5" },
    { value: 4, lable: "1.5 and Above" },
  ];
  let widthOfRoadList = [
    { value: 1, lable: "Below 18 meter" },
    { value: 2, lable: "18 Meter" },
    { value: 3, lable: "18-30 meter" },
    { value: 4, lable: "30-45 meter" },
    { value: 5, lable: "Above 45 meter" },
  ];

  //get single application data
  // const getSingleApplicationData =(applicationNo)=>{
  //   axios
  //   .get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getByApplicationNo?applicationNo=${applicationNo}`, {
      //   headers: {
      //     Authorization: `Bearer ${userToken}`,
      //   },
      // })
  //   .then((r) => {
  //     let result = r.data.trnExcavationRoadCpmpletionList;
  //       // console.log("getPhotopassDataById", result);
  //     setDataSource(result);
  //   })
  // }

  //get single application data
  const getSingleApplicationData = (id) => {
    if (id) {
      axios
        .get(
          `${urls.RENPURL}/nocPermissionForMaintenance/getDataById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          let result = r.data;
          console.log("resultData",result);
          // setsiteVisitData(
          //   result && result?.trnSiteVisite[0]?.trnExcavationDetailsDao
          // );
          setDataSource(result);
          setApplicantId(result?.id);
          setServiceId(result?.serviceId);
         
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

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

  //assigning value to fields
  useEffect(() => {
    if (dataSource) {
      let res = dataSource;
      // console.log("res1",res);

      setValue("applicationNumber", res ? res?.applicationNumber : "-");
      setValue("isIndividualOrFirm", res ? res?.isIndividualOrFirm : "-");
      setValue("categoryOfRoad", res ? res?.categoryOfRoad : "-");

      setValue("companyName", res ? res?.companyName : "-");
      setValue("companyNameMr", res ? res?.companyNameMr : "-");
      setValue("roadType", res ? res?.roadType : "-");
      setValue("eligibleForSchemeYn", res ? res?.eligibleForSchemeYn : "-");
      setValue("firstName", res ? res?.firstName : "-");
      setValue("firstNameMr", res ? res?.firstNameMr : "-");
      setValue("middleName", res ? res?.middleName : "-");
      setValue("middleNameMr", res ? res?.middleNameMr : "-");
      setValue("lastName", res ? res?.lastName : "-");
      setValue("lastNameMr", res ? res?.lastNameMr : "-");
      setValue("mobileNo", res ? res?.mobileNo : "-");
      setValue("landlineNo", res ? res?.landlineNo : "-");
      setValue("emailAddress", res ? res?.emailAddress : "-");
      setValue("widthOfRoadMaintenance", res ? res?.widthOfRoadMaintenance : "-");
      setValue("lengthOfRoadMaintenance", res ? res?.lengthOfRoadMaintenance : "-");
      setValue("natureOfExcavationMaintnance", res ? res?.natureOfExcavationMaintnance : "-");
      // setValue("mainScheme", res ? res?.mainScheme : "-");
      // setValue("subScheme", res ? res?.subScheme : "-");
      setValue("expectedPeriod", res ? res?.expectedPeriod : "-");
      setValue("affidavit", res ? res?.affidavit : "-");
      setValue("underTaking", res ? res?.underTaking : "-");
      setValue("permitPeriod", res ? res?.permitPeriod : "-");
      setValue("scopeOfWork", res ? res?.scopeOfWork : "-");
      setValue("startLatAndStartLng", res ? res?.startLatAndStartLng : "-");
      setValue("endLatAndEndLng", res ? res?.endLatAndEndLng : "-");
      setValue("typeOfPavement", res ? res?.typeOfPavement : "-");
      setValue("typesOfServices", res ? res?.typesOfServices : "-");
      setValue("firmorIndividual", res ? res?.firmorIndividual : "-");
      setValue("applicantSubType", res ? res?.applicantSubType : "-");
      setValue("otherApplicantSubType", res ? res?.otherApplicantSubType : "-");
      setValue("natureOfExcavation", res ? res?.natureOfExcavation : "-");
      setValue("lengthOfRoad", res ? res?.lengthOfRoad : "-");
      setValue("widthOfRoad", res ? res?.widthOfRoad : "-");
      setValue("depthOfRoad", res ? res?.depthOfRoad : "-");
      setValue("nameOfBRTSRoad", res ? res?.nameOfBRTSRoad : "-");
      setValue("nonBRTSRoadWard", res ? res?.nonBRTSRoadWard : "-");
      setValue("nonBRTSRoadZone", res ? res?.nonBRTSRoadZone : "-");
      setValue(
        "nonBRTSRoadLocationOfExcavation",
        res ? res?.nonBRTSRoadLocationOfExcavation : "-"
      );
      setValue("taxReceipt", res ? res?.taxReceipt : "-");
      setValue("diggingMap", res ? res?.diggingMap : "-");
      setValue("otherDoc", res ? res?.otherDoc : "-");
      setValue(
        "workOrderfromConcernDepartment",
        res ? res?.workOrderfromConcernDepartment : "-"
      );
      setValue("previousWorkOrder", res ? res?.previousWorkOrder : "-");
      setValue("previouslyApprovedDiggingMap", res ? res?.previouslyApprovedDiggingMap : "-");
      setValue("underTaking", res ? res?.underTaking : "-");
      setValue("affidavit", res ? res?.affidavit : "-");
      // setValue("locationSameAsPcmcOrderYn", res ? res?.locationSameAsPcmcOrderYn : null);
      // setValue("locationRemark", res ? res?.locationRemark : "-");
      // setValue("lengthSameAsPcmcOrderYn", res ? res?.lengthSameAsPcmcOrderYn : null);
      // setValue("lengthRemark", res ? res?.lengthRemark : "-");
      // setValue("depthSameAsPcmcOrderYn", res ? res?.depthSameAsPcmcOrderYn : null);
      // setValue("depthRemark", res ? res?.depthRemark : "-");
      // setValue("widthSameAsPcmcOrderYn", res ? res?.widthSameAsPcmcOrderYn : null);
      // setValue("widthRemark", res ? res?.widthRemark : "-");

      siteVisitData?.map((item, i) => {
        setValue(`zoneId${i}`, item?.zoneId);
        setValue(`wardId${i}`, item?.wardId);
        setValue(`roadId${i}`, item?.roadId);
        setValue(`locationOfExcavation${i}`, item?.locationOfExcavation);
        setValue(`lengthOfRoad${i}`, item?.lengthOfRoad);
        setValue(`widthOfRoad${i}`, item?.widthOfRoad);
        setValue(`depthOfRoad${i}`, item?.depthOfRoad);
        setValue(`excavationPattern${i}`, item?.excavationPattern);
      });
    }
  }, [dataSource]);

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
            `${
              urls.CFCURL
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
            )
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    }
    // }
  };

  useEffect(() => {
    getZoneKeys();
    getWardZoneKeys();
  }, [watch("nonBRTSRoadZone")]);
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

  // const handleUploadDocument = (path) => {
  //   console.log("handleUploadDocument", path);
  //   let temp = {
  //     documentPath: path,
  //     documentKey: 1,
  //     documentType: "",
  //     remark: "",
  //   };
  //   setDoc(temp);
  // };

  let onSubmitFunc = () => {
    if (!actionEE && !remarkEE) {
      setactionJEErr(true);
      setremarkJEErr(true);
    } else if (actionEE && remarkEE) {
      setactionJEErr(false);
      setremarkJEErr(false);
      let body = {
        id: router.query.id,
        action: actionEE,
        remark: remarkEE,
        role: authority[0],
      };

      const tempData = axios
        .post(`${urls.RENPURL}/nocPermissionForMaintenance/saveApprove`, body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            sweetAlert(
              "Saved!",
              "Road Excavation Application Saved successfully !",
              "success"
            );
            router.push(
              "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  useEffect(() => {
    if (applicantId !== null && serviceId !== null) {
      axios
        .get(
          `${urls.RENPURL}/trnExcavationRoadCpmpletion/findAllByApplicantAndServiceId?serviceId=${serviceId}&applicantId=${applicantId}`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          console.log(
            "RE: applicationHistory =",
            res.data?.applicantHistoryDaoList
          );
          setApplicantHistory(res.data?.applicantHistoryDaoList);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [applicantId, serviceId]);


const getLOIInfo =()=>{
    if (router.query.id && router.query.mode=="DemandNote") {
      axios
        .get(
          `${urls.RENPURL}/mstRateCharge/getRateMSCB?id=${router.query.id}`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          console.log(
            "Rate",
            res.data.amount
          );
          setAmount(res?.data?.amount)
          
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }
  useEffect(()=>{
    if (router.query.id && router.query.mode=="DemandNote") {
    getLOIInfo()
    }
  },[router.query.id])
  const generateLOI = () => {
    let body = {
      id: router.query.id,
      role: "LOI_GENRATION",
      trnLoiDao: {
       amount:amount
      },
    };
    console.log("bodyypppp", body);
    setLoadderState(true)
    const tempData = axios
      .post(`${urls.RENPURL}/nocPermissionForMaintenance/saveApprove`, body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 201 || res.status == 200) {
          setLoadderState(false)
          sweetAlert(
            "Saved!",
            "Demand Note Genrated Successfully !",
            "success"
          );
          router.push(
            "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

   //CSS for Table
   const tableStyle = {
    border: '1px solid black',
    width: "95%",
    marginLeft: "1vw",

  };

  const thStyle = {
    border: '1px solid black',
    // backgroundColor:"green"
  };
  const thStyleMain = {
    border: '1px solid black',
    backgroundColor: 'lightgray',
  };
  // getFilePreview
  const getFilePreview = (filePath) => {
    console.log("filePath123", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
        const newTab = window.open();
        newTab.document.body.innerHTML = `<img src="${imageUrl}"  width="100%" height="100%"/>`;
        // const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
        // const newTab = window.open();
        // newTab.document.write(`
        //   <html>
        //     <body style="margin: 0;">
        //       <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
        //     </body>
        //   </html>
        // `);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error)
        callCatchMethod(error, language);
      });
  }
  return (
    
    <ThemeProvider theme={theme}>
       {loadderState ? (
        <Loader />
      ) : (
      <Paper
        style={{
          marginTop: "120px",
          marginBottom: "80px",
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
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              {/* <FormattedLabel id="RoadExcavation_NocPermission" /> */}
              {language=="en"?"ROAD EXCAVATION / NOC PERMISSION MAINTENANCE":"रस्ता उत्खनन / NOC परवानगी देखभाल"}
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
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicationNumber"
                  name="applicationNumber"
                  label={<FormattedLabel id="applicationNumber" />}
                  variant="standard"
                  value={watch("applicationNumber")}
                  InputLabelProps={{
                    shrink:
                      router.query.applicationNumber ||
                      watch("applicationNumber")
                        ? true
                        : false,
                  }}
                  error={!!errors.applicationNumber}
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
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
                  <Typography>Select</Typography>
                </div>
                <FormControl
                  flexDirection="row"
                  error={!!errors.isIndividualOrFirm}
                  style={{
                    paddingLeft: "80px",
                  }}
                >
                  <Controller
                    name="isIndividualOrFirm"
                    control={control}
                    defaultValue=""
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
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="companyName"
                  name="companyName"
                  label={<FormattedLabel id="companyName" />}
                  variant="standard"
                  value={watch("companyName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("companyName") ? true : false,
                  }}
                  error={!!errors.companyName}
                  helperText={
                    errors?.companyName ? errors.companyName.message : null
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
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="companyNameMr"
                  name="companyNameMr"
                  label={<FormattedLabel id="companyNameMr" />}
                  variant="standard"
                  value={watch("companyNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("companyNameMr") ? true : false,
                  }}
                  error={!!errors.companyNameMr}
                  helperText={
                    errors?.companyNameMr ? errors.companyNameMr.message : null
                  }
                />
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
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="firstName"
                  name="firstName"
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  value={watch("firstName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("firstName") ? true : false,
                  }}
                  error={!!errors.firstName}
                  helperText={
                    errors?.firstName ? errors.firstName.message : null
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="middleName"
                  name="middleName"
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  value={watch("middleName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("middleName") ? true : false,
                  }}
                  error={!!errors.middleName}
                  helperText={
                    errors?.middleName ? errors.middleName.message : null
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lastName"
                  name="lastName"
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  value={watch("lastName")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("lastName") ? true : false,
                  }}
                  error={!!errors.lastName}
                  helperText={errors?.lastName ? errors.lastName.message : null}
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="firstNameMr"
                  name="firstNameMr"
                  label={<FormattedLabel id="firstNameMr" />}
                  variant="standard"
                  value={watch("firstNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("firstNameMr") ? true : false,
                  }}
                  error={!!errors.firstNameMr}
                  helperText={
                    errors?.firstNameMr ? errors.firstNameMr.message : null
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="middleNameMr"
                  name="middleNameMr"
                  label={<FormattedLabel id="middleNameMr" />}
                  variant="standard"
                  value={watch("middleNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("middleNameMr") ? true : false,
                  }}
                  error={!!errors.middleNameMr}
                  helperText={
                    errors?.middleNameMr ? errors.middleNameMr.message : null
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lastNameMr"
                  name="lastNameMr"
                  label={<FormattedLabel id="lastNameMr" />}
                  variant="standard"
                  value={watch("lastNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("lastNameMr") ? true : false,
                  }}
                  error={!!errors.lastNameMr}
                  helperText={
                    errors?.lastNameMr ? errors.lastNameMr.message : null
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
                  marginTop: "20px",
                }}
              >
                <TextField
                  sx={{ width: 250 }}
                  id="landlineNo"
                  name="landlineNo"
                  label={<FormattedLabel id="landLineNo" />}
                  variant="standard"
                  value={watch("landlineNo")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("landlineNo") ? true : false,
                  }}
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="mobileNo"
                  name="mobileNo"
                  label={<FormattedLabel id="mobileNo" />}
                  // label="Mobile No."
                  // variant="outlined"
                  variant="standard"
                  value={watch("mobileNo")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("mobileNo") ? true : false,
                  }}
                  error={!!errors.mobileNo}
                  helperText={errors?.mobileNo ? errors.mobileNo.message : null}
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="emailAddress"
                  name="emailAddress"
                  label={<FormattedLabel id="emailAddress" />}
                  // label="emailAddress "
                  // variant="outlined"
                  variant="standard"
                  value={watch("emailAddress")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("emailAddress") ? true : false,
                  }}
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
                  <Typography>{language=="en"?"Category of Road":"रस्त्याची श्रेणी"}</Typography>
                </div>
                <FormControl
                  flexDirection="row"
                  error={!!errors.categoryOfRoad}
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
                    <FormControl>
                      <InputLabel required error={!!errors.nameOfBRTSRoad}>
                      {language=="en"?"Name of BRTS Road":"बीआरटीएस रोडचे नाव"} 
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
                    <FormControl>
                      <InputLabel required error={!!errors.nonBRTSRoadZone}>
                      {language=="en"?"Select Zone":"झोन निवडा"} 
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
                    <FormControl>
                      <InputLabel required error={!!errors.nonBRTSRoadWard}>
                      {language=="en"?"Select Ward":"प्रभाग निवडा"} 
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
                      // label={<FormattedLabel id="nonBRTSRoadLocationOfExcavation" />}
                      label="Location Of Excavation"
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

              {/* ///////////////////////////////////////////////////////////////// */}

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
                <FormControl>
                  <InputLabel required error={!!errors.typeOfPavement}>
                  {language=="en"?"Type Of Pavement":"फुटपाथचा प्रकार"} 
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
                <FormControl>
                  <InputLabel required error={!!errors.typesOfServices}>
                  {language=="en"?"Type Of Service":"सेवेचा प्रकार"}  
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
                <FormControl>
                  <InputLabel required error={!!errors.firmorIndividual}>
                  {language=="en"?"Applicant Type":"अर्जदाराचा प्रकार"}  
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
                    <FormControl>
                      <InputLabel required error={!!errors.applicantSubType}>
                      {language=="en"?"Applicant Sub Type":"अर्जदार उपप्रकार"} 
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
                    <FormControl>
                      <InputLabel required error={!!errors.applicantSubType}>
                      {language=="en"?"Applicant Sub Type":"अर्जदार उपप्रकार"} 
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
                <FormControl>
                  <InputLabel required error={!!errors.natureOfExcavation}>
                  {language=="en"?"Nature of Excavation":"उत्खननाचे स्वरूप"} 
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
                  paddingLeft: "75px",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
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
                />
                <FormHelperText error={!!errors.natureofExcavation}>
                  {errors.natureofExcavation ? "requried only numbers" : null}
                </FormHelperText>
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
                      label="Width of Road to be excavation (Meter) "
                      variant="standard"
                      {...register("widthOfRoad")}
                      error={!!errors.widthOfRoad}
                      helperText={
                        errors?.widthOfRoad
                          ? errors.widthOfRoad.message
                          : null
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
                <FormControl>
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
                <FormControl>
                  <InputLabel required error={!!errors.depthOfRoad}>
                  {language=="en"?"Depth Of Road":"रस्त्याची खोली"}
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
            </Grid>
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="expectedPeriod"
                  name="expectedPeriod"
                  label={<FormattedLabel id="expectedPeriodInDays" />}
                  // label="Expected Period"
                  // label="Permit Period"
                  // variant="outlined"
                  variant="standard"
                  value={watch("expectedPeriod")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("expectedPeriod") ? true : false,
                  }}
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="scopeOfWork"
                  name="scopeOfWork"
                  label={<FormattedLabel id="scopeOfWork" />}
                  // label="Scope Of Work"
                  // variant="outlined"
                  variant="standard"
                  value={watch("scopeOfWork")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("scopeOfWork") ? true : false,
                  }}
                  error={!!errors.scopeOfWork}
                  helperText={
                    errors?.scopeOfWork ? errors.scopeOfWork.message : null
                  }
                />
              </Grid>
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="scopeOfWork"
                  name="scopeOfWork"
                  label={<FormattedLabel id="scopeOfWork" />}
                  // label="Scope Of Work"
                  // variant="outlined"
                  variant="standard"
                  value={watch("scopeOfWork")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("scopeOfWork") ? true : false,
                  }}
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
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="startLatAndStartLng"
                  name="startLatAndStartLng"
                  label={<FormattedLabel id="startLatAndStartLng" />}
                  // label="START Latitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  value={watch("startLatAndStartLng")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("startLatAndStartLng")
                        ? true
                        : false,
                  }}
                  error={!!errors.startLatAndStartLng}
                  helperText={
                    errors?.startLatAndStartLng
                      ? errors.startLatAndStartLng.message
                      : null
                  }
                />
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
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="endLatAndEndLng"
                  name="endLatAndEndLng"
                  label={<FormattedLabel id="endLatAndEndLng" />}
                  // label="END Latitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  value={watch("endLatAndEndLng")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("endLatAndEndLng")
                        ? true
                        : false,
                  }}
                  error={!!errors.endLatAndEndLng}
                  helperText={
                    errors?.endLatAndEndLng
                      ? errors.endLatAndEndLng.message
                      : null
                  }
                />
              </Grid>
              {/*///////////////////////////////////////// */}
            </Grid>

            {/* Excavation Details */}
            <Typography
              sx={{
                marginLeft: "20px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <h2>
                <FormattedLabel id="excavationDetails" />
              </h2>
            </Typography>
            <div
              style={{
                overflowX: 'auto',
                //  background:"yellow",
                margin: "2vh 2vw"
              }}
            >
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{language == "en"
                      ? "Nature of Excavation"
                      : "उत्खननाचे स्वरूप"}</th>
                    <th style={thStyle}>{language == "en"
                      ? "Length of Road to be excavation (Meter)"
                      : "खोदाईच्या रस्त्याची लांबी (मीटर)"}</th>
                    <th style={thStyle}>{language == "en"
                      ? "Width of Road to be excavation (Meter)"
                      : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}</th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td style={thStyle}>
                      <FormControl style={{ margin: "1vw" }}>
                        <InputLabel required error={!!errors.natureOfExcavationMaintnance}>
                          {language == "en"
                            ? "Nature of Excavation"
                            : "उत्खननाचे स्वरूप"}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="natureOfExcavationMaintnance"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              variant="outlined"
                              {...field}
                              error={!!errors.natureOfExcavationMaintnance}
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
                        <FormHelperText error={!!errors.natureOfExcavationMaintnance}>
                          {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                        </FormHelperText>
                      </FormControl></td>
                    <td style={thStyle}>
                      <TextField
                        // style={{ backgroundColor: "white", width: "250px" }}
                        id="lengthOfRoadMaintenance"
                        style={{ margin: "1vw", width: "350px" }}
                        name={`lengthOfRoadMaintenance`}
                        label={language == "en"
                          ? "Length of Road to be excavation (Meter)"
                          : "खोदाईच्या रस्त्याची लांबी (मीटर)"}
                        variant="outlined"
                        {...register(
                          `lengthOfRoadMaintenance`
                        )}
                        InputLabelProps={{
                          shrink:watch("lengthOfRoadMaintenance")
                              ? true
                              : false,
                        }}
                        error={
                          !!errors?.lengthOfRoadMaintenance
                        }
                        helperText={
                          errors?.lengthOfRoadMaintenance
                            ? errors?.lengthOfRoadMaintenance
                              .message
                            : null
                        }
                      /></td>
                    <td style={thStyle}>
                      <TextField
                        // style={{ backgroundColor: "white", width: ./"250px" }}
                        id="widthOfRoadMaintenance"
                        name={`widthOfRoadMaintenance`}
                        label={language == "en"
                          ? "Width of Road to be excavation (Meter)"
                          : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}
                        variant="outlined"
                        {...register(
                          `widthOfRoadMaintenance`
                        )}
                        style={{ margin: "1vw", width: "350px" }}
                        error={
                          !!errors?.widthOfRoadMaintenance
                        }
                        InputLabelProps={{
                          shrink:watch("widthOfRoadMaintenance")
                              ? true
                              : false,
                        }}
                        helperText={
                          errors?.widthOfRoadMaintenance
                            ? errors?.widthOfRoadMaintenance
                              .message
                            : null
                        }
                      /></td>
                  </tr>
                </tbody></table>
            </div>
            <Typography
              variant="h6"
              style={{
                padding: "10px",
                marginTop: "40px",
                marginLeft: "60px",
              }}
            >
              {language=="en"?"Uploaded Documents":"अपलोड केलेले दस्तऐवज"}
            </Typography>

            {watch("isIndividualOrFirm") == "Individual" && (
              <>
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
                    {language=="en"?"Digging Map":"खोदणे नकाशा"}
                   
                    <Button
                      variant="contained"
                      style={{ marginBottom: 2, marginLeft: "2vw" }}
                      onClick={() =>
                        getFilePreview(watch("previouslyApprovedDiggingMap"))
                      }
                    >
                      {language === "en" ? "View" : "पहा"}
                    </Button>
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
                    {language=="en"?"Work Order from Concern Department":"संबंधित विभागाकडून कार्यादेश"}
                    
                    <Button
                      variant="contained"
                      style={{ marginBottom: 2, marginLeft: "2vw" }}
                      onClick={() =>
                        getFilePreview(watch("previousWorkOrder"))
                      }
                    >
                      {language === "en" ? "View" : "पहा"}
                    </Button>
                  </Grid>
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
                   {language=="en"?"Tax Receipt":"कर पावती"} 
                    
                    <Button
                      variant="contained"
                      style={{ marginBottom: 2, marginLeft: "2vw" }}
                      onClick={() =>
                        getFilePreview(watch("taxReceipt"))
                      }
                    >
                      {language === "en" ? "View" : "पहा"}
                    </Button>
                    {/* <Button
                variant="outlined"
                style={{
                 marginLeft:"40px"
                }}
                onClick={e=>{
                  router.push(`${urls.CFCURL}/file/preview?filePath=${watch("diggingMap")}`)
                }
                
                }
                >
                  View
                </Button> */}
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
                    {language=="en"?"Other Document":"इतर दस्तऐवज"}
                   
                    <Button
                      variant="contained"
                      style={{ marginBottom: 2, marginLeft: "2vw" }}
                      onClick={() =>
                        getFilePreview(watch("otherDoc"))
                      }
                    >
                      {language === "en" ? "View" : "पहा"}
                    </Button>
                    {/* <Button
                variant="outlined"
                style={{
                 marginLeft:"40px"
                }}
                onClick={e=>{
                  router.push(`${urls.CFCURL}/file/preview?filePath=${watch("workOrderfromConcernDepartment")}`)
                } } >
                  View
                </Button> */}
                  </Grid>
                </Grid>
              </>
            )}
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "baseline",
              }}
            >
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
                               {language=="en"?"Affidavit":"प्रतिज्ञापत्र"}

              
                <Button
                      variant="contained"
                      style={{ marginBottom: 2, marginLeft: "2vw" }}
                      onClick={() =>
                        getFilePreview(watch("affidavit"))
                      }
                    >
                      {language === "en" ? "View" : "पहा"}
                    </Button>
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
                               {language=="en"?"Under Taking":"हमीपत्र"}

              
                <Button
                      variant="contained"
                      style={{ marginBottom: 2, marginLeft: "2vw" }}
                      onClick={() =>
                        getFilePreview(watch("underTaking"))
                      }
                    >
                      {language === "en" ? "View" : "पहा"}
                    </Button>
              </Grid>
            </Grid>
            
            {
              (authority == "DEPUTY_ENGINEER" 
              || authority == "EXECUTIVE_ENGINEER"
              || authority == "ADDITIONAL_COMMISHIONER"
               || authority == "ADDITIONAL_CITY_ENGINEER") && <>
               <hr/>
             {
              watch("applicantSubType")==3 && 
                    
            <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                                 {language=="en"?"Demand Note:":"मागणी नोंद:"}
 
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "left",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    style={{
                      height: "30px",
                      width: "200px",
                      marginLeft: "20px",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      router.push({
                        pathname:
                          "/roadExcavation/transaction/documenstGeneration/maintenanceLOI",
                        query: {
                          id: router.query.id,
                          applicationNumber:watch("applicationNumber")
                        },
                      })
                    }
                  >
                    {language === "en" ? "Demand Note" : "मागणी नोंद"}
                  </Button>
                  {/* </IconButton> */}
                </Grid>
              </Grid>
            }
              </>  
              }
       
            <HistoryComponent tableData={applicantHistory} />
            <hr />

         { router.query.mode!="DemandNote" &&<>  <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <FormControl xs={12} sm={6} md={6} error={actionJEErr}>
                  <InputLabel>
                    <FormattedLabel id="actions" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={actionEE}
                        onChange={(e) => setactionEE(e.target.value)}
                        variant="standard"
                      >
                        <MenuItem value={"APPROVE"}>
                          <FormattedLabel id="APPROVE" />
                        </MenuItem>
                        <MenuItem value={"REVERT"}>
                          <FormattedLabel id="REVERT" />
                        </MenuItem>
                        <MenuItem value={"REJECT"}>
                          <FormattedLabel id="REJECT" />
                        </MenuItem>
                        
                      </Select>
                    )}
                    name="action"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {actionJEErr ? "action is required" : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "-10px",
                }}
              >
                <TextField
                  autoFocus
                  id="remark"
                  name="remark"
                  label={<FormattedLabel id="remark" />}
                  // label="Remark"
                  // variant="outlined"
                  variant="standard"
                  onChange={(e) => setremarkEE(e.target.value)}
                  error={remarkJEErr}
                  helperText={remarkJEErr ? "Remark is required" : null}
                />
              </Grid>
            </Grid>
            </>}
            {/* <Grid
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
              <Grid item>
                <Button type="submit" variant="outlined">
                  <FormattedLabel id="save" />
                </Button>
              </Grid>
            </Grid> */}
            
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
             {dataSource &&
                dataSource.applicationStatus != "SITE_VISIT"  && (
                  <Grid item>
                    <Button type="submit" variant="outlined">
                    {language=="en"?"Save":"जतन करा"}

                    </Button>
                  </Grid>
                )}
              {dataSource &&
                dataSource.applicationStatus === "SITE_VISIT" && (
                  <Grid item>
                    <Button variant="outlined" onClick={generateLOI}>
                      {/* <FormattedLabel id="generateNOC" /> */}
                      {language=="en"?"Generate Demand Note":"डिमांड नोट तयार करा"}

                    </Button>
                  </Grid>
                )}
            </Grid>
            {/* //////////////////////////////////// */}
          </form>
        </Box>
      </Paper>
      )}
    </ThemeProvider>
  );
};

export default Index;
