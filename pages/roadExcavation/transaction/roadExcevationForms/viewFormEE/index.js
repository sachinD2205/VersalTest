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
import Loader from "../../../../../containers/Layout/components/Loader";
import HistoryComponent from "../../../../../components/roadExcevation/HistoryComponent";
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
  const [typeBInfo, setTypeBInfo] = useState();
  const [actionJEErr, setactionJEErr] = useState(false);
  const [remarkJEErr, setremarkJEErr] = useState(false);
  const [zoneKeys, setZoneKeys] = useState([]);
  const [zoneWardKeys, setZoneWardKeys] = useState([]);
  const [natureofExcavation, setnatureofExcavation] = useState([]);
  const [roadType, setRoadType] = useState();
  const [allWard, setAllWard] = useState();
  const [loadderState, setLoadderState] = useState(false);
  const [applicantId, setApplicantId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [applicantHistory, setApplicantHistory] = useState(null);

  const language = useSelector((store) => store.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);
  const userToken = useGetToken();
  // selected menu from drawer
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
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;
  // const authorityFullNameEn = `${user.userDao.firstNameEn}  ${user.userDao.lastNameEn}`
  // const authorityFullNameMr = `${user.userDao.firstNameMr}  ${user.userDao.lastNameMr}`
  // console.log("bbbbbbbbbauthority",authorityFullNameEn,authorityFullNameMr);
  // console.log("bbbbbbbbbauthority",user.userDao);
  // console.log("bbbbbbbbbauthority",user.userDao.lastNameEn);

  useEffect(() => {
    if (router.query.id) {
      getSingleApplicationData(router.query.id);
    }
  }, [router.query.id, zoneKeys, allWard, roadType]);

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
  //     headers: {
  //       Authorization: `Bearer ${user.token}`,
  //     },
  //   })
  //   .then((r) => {
  //     let result = r.data.trnExcavationRoadCpmpletionList;
  //       // console.log("getPhotopassDataById", result);
  //     setDataSource(result);
  //   })
  // }

  //get single application data
  const getSingleApplicationData = (id) => {
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
        // For History Component
        setApplicantId(result?.id);
        setServiceId(result?.serviceId);

        console.log("asfdfcvdfv", result.trnSiteVisite[0]?.widthOfRoadSite);
        setTypeBInfo(result.trnSiteVisite[0]);
        setValue("widthOfRoadSite", typeBInfo?.widthOfRoadSite);
        setValue("lengthOfRoadSite", typeBInfo?.lengthOfRoadSite);
        setValue("natureOfExcavationSite", typeBInfo?.natureOfExcavationSite);
        setsiteVisitData(
          result && result.trnSiteVisite[0]?.trnExcavationDetailsDao
        );
        setDataSource(result);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  console.log("nnnnnnnnnn", siteVisitData);
  //assigning value to fields
  useEffect(() => {
    if (dataSource) {
      let res = dataSource;
      console.log("res1", res);

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
      // setValue("mainScheme", res ? res?.mainScheme : "-");
      // setValue("subScheme", res ? res?.subScheme : "-");
      setValue("expectedPeriod", res ? res?.expectedPeriod : "-");

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

      // console.log("dfgvb",siteVisitData);
      siteVisitData?.map((item, i) => {
        // setValue(`zoneId${i}`,item?.zoneId)
        setValue(
          `zoneId${i}`,
          language == "en"
            ? zoneKeys?.find((data) => data?.id == item?.zoneId)?.zoneName
            : zoneKeys?.find((data) => data?.id == item?.zoneId)?.zoneNameMr
        );
        // setValue(`wardId${i}`,item?.wardId)
        setValue(
          `wardId${i}`,
          language == "en"
            ? allWard?.find((data) => data?.id == item?.wardId)?.wardName
            : allWard?.find((data) => data?.id == item?.wardId)?.wardNameMr
        );
        // setValue(`roadId${i}`,item?.roadId)
        setValue(
          `roadId${i}`,
          language == "en"
            ? roadType?.find((data) => data?.id == item?.roadId)?.roadTypeName
            : roadType?.find((data) => data?.id == item?.roadId)?.roadTypeNameMr
        );
        setValue(`locationOfExcavation${i}`, item?.locationOfExcavation);
        setValue(`lengthOfRoad${i}`, item?.lengthOfRoad);
        setValue(`widthOfRoad${i}`, item?.widthOfRoad);
        setValue(`depthOfRoad${i}`, item?.depthOfRoad);
        setValue(`excavationPattern${i}`, item?.excavationPattern);

        //values for remarks
        setValue(
          "additionalCityEngineerRemark",
          res ? res?.additionalCityEngineerRemark : "-"
        );
        setValue(
          "additionalCommissionerRemark",
          res ? res?.additionalCommissionerRemark : "-"
        );
        setValue("deputyEngineerRemark", res ? res?.deputyEngineerRemark : "-");
        setValue(
          "excutiveEngineerRemark",
          res ? res?.excutiveEngineerRemark : "-"
        );
      });
    }
  }, [dataSource]);

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
  const getAllWards = () => {
    //setVaIdlues("setBackDrop", true);
    axios.get(`${urls.BaseURL}/ward/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      // console.log("wardssss",r);
      console.log("wardssss", r.data.ward);
      setAllWard(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    });
  };

  useEffect(() => {
    getAllWards();
  }, []);

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
  //get roadType
  const getRoadType = () => {
    axios
      .get(`${urls.RENPURL}/mstRoadType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        let result = r.data.mstRoadTypeList;
        setRoadType(result);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  console.log("zoneKeys111", zoneKeys);
  console.log("zoneKeys", zoneWardKeys);

  useEffect(() => {
    getRoadType();
  }, []);
  console.log("roadType", roadType);

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
  console.log("iiiiiiiiii",loadderState);
  let onSubmitFunc = () => {
    setLoadderState(true);
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
        // senderNameEn:authorityFullNameEn,
        // senderNameMr:authorityFullNameMr
      };
      console.log("fgcvbfgbv", body);
      const tempData = axios
        .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/saveApprove`, body,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            setLoadderState(false);
            sweetAlert(
              "Saved!",
              "Road Excavation Application Saved successfully !",
              "success"
            );
            router.push(
              "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
            );
          }
        })
        .catch((error) => {
          setLoadderState(false)
          callCatchMethod(error, language);
        });
    }
  };
  //Css for table
  const tableStyle = {
    border: '1px solid black',
    width: "95%",
    marginLeft: "1vw",

  };

  const thStyle = {
    border: '1px solid black',
    // alignItems:"center"
    // backgroundColor:"green"
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
                <FormattedLabel id="RoadExcavation_NocPermission" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {/* <Box
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          > */}
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
                  disabled
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="companyNameMr"
                  name="companyNameMr"
                  label={<FormattedLabel id="companyNameMr" />}
                  variant="standard"
                  value={watch("companyNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("companyNameMr")
                        ? true
                        : false,
                  }}
                  error={!!errors.companyNameMr}
                  helperText={
                    errors?.companyNameMr
                      ? errors.companyNameMr.message
                      : null
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lastName"
                  name="lastName"
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  value={watch("lastName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("lastName") ? true : false,
                  }}
                  error={!!errors.lastName}
                  helperText={
                    errors?.lastName ? errors.lastName.message : null
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="mobileNo"
                  name="mobileNo"
                  label={<FormattedLabel id="mobileNo" />}
                  // label="Mobile No."
                  // variant="outlined"
                  variant="standard"
                  value={watch("mobileNo")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("mobileNo") ? true : false,
                  }}
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
                  <Typography>Category of Road</Typography>
                </div>
                <FormControl
                  flexDirection="row"
                  error={!!errors.categoryOfRoad}
                  disabled
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
                    <FormControl disabled>
                      <InputLabel required error={!!errors.nameOfBRTSRoad}>
                        Name of BRTS Road
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
                    <FormControl disabled>
                      <InputLabel required error={!!errors.nonBRTSRoadZone}>
                        Select Zone
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
                    <FormControl disabled>
                      <InputLabel required error={!!errors.nonBRTSRoadWard}>
                        Select Ward
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
                      disabled
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
                <FormControl disabled>
                  <InputLabel required error={!!errors.typeOfPavement}>
                    Type Of Pavement
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
                <FormControl disabled>
                  <InputLabel required error={!!errors.typesOfServices}>
                    Type Of Service
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
                      disabled
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
                <FormControl disabled>
                  <InputLabel required error={!!errors.firmorIndividual}>
                    Applicant Type
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
                    <FormControl disabled>
                      <InputLabel required error={!!errors.applicantSubType}>
                        Applicant Sub Type
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
                      disabled
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
                    <FormControl disabled>
                      <InputLabel required error={!!errors.applicantSubType}>
                        Applicant Sub Type
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
                      disabled
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
                <FormControl disabled>
                  <InputLabel required error={!!errors.natureOfExcavation}>
                    Nature of Excavation
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
                <TextField
                  disabled
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lengthOfRoad"
                  name="lengthOfRoad"
                  // label={<FormattedLabel id="lengthOfRoad" />}
                  label="Length of Road to be excavation  (Meter)"
                  variant="standard"
                  {...register("lengthOfRoad")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("lengthOfRoad") ? true : false,
                  }}
                  error={!!errors.lengthOfRoad}
                  helperText={
                    errors?.lengthOfRoad ? errors.lengthOfRoad.message : null
                  }
                />
                {/* <FormHelperText error={!!errors.natureofExcavation}>
                    {errors.natureofExcavation
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
                  label="Width of Road to be excavation (Meter) "
                  variant="standard"
                  {...register("widthOfRoad")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("widthOfRoad") ? true : false,
                  }}
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
                <FormControl disabled>
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
                <FormControl disabled>
                  <InputLabel required error={!!errors.depthOfRoad}>
                    Depth Of Road
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="expectedPeriod"
                  name="expectedPeriod"
                  label={<FormattedLabel id="expectedPeriodInDays" />}
                  disabled
                  // label="Expected Period"
                  // label="Permit Period"
                  // variant="outlined"
                  variant="standard"
                  value={watch("expectedPeriod")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("expectedPeriod")
                        ? true
                        : false,
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
                  disabled
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
                  disabled
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
                  disabled
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="endLatAndEndLng"
                  name="endLatAndEndLng"
                  disabled
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
                    <th style={thStyle}><FormattedLabel id="zone" /></th>
                    <th style={thStyle}><FormattedLabel id="ward" /></th>
                    <th style={thStyle}><FormattedLabel id="roadTypes" /></th>
                    <th style={thStyle}><FormattedLabel id="locationOfExcavation" /></th>
                    <th style={thStyle}><FormattedLabel id="lengthOfRoad" /></th>
                    <th style={thStyle}><FormattedLabel id="widthOfRoad" /></th>
                    <th style={thStyle}><FormattedLabel id="depthOfRoad" /></th>
                    <th style={thStyle}><FormattedLabel id="excavationPattern" /></th>
                    {/* {router.query.pageMode!="View" &&<th style={thStyle}>{language == "en" ?"Actions":"क्रिया"}</th>} */}
                  </tr>
                </thead>
                <tbody>
                  {siteVisitData &&
                    siteVisitData.map((item, i) => (
                      <tr key={item.id}>
                        {/* <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                        alignItems: "center",
                        borderStyle: "solid",
                        borderWidth: "2px",
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
                      > */}
                        <td style={thStyle}>
                          <TextField
                            style={{ backgroundColor: "white", width: "250px" }}
                            id={`zoneId${i}`}
                            name={`zoneId${i}`}
                            // label={<FormattedLabel id="zone" />}
                            // label="Zone "
                            // variant="outlined"
                            variant="standard"
                            value={watch(`zoneId${i}`)}
                            InputLabelProps={{
                              shrink:
                                router.query.id || watch(`zoneId${i}`)
                                  ? true
                                  : false,
                            }}
                          //  error={!!errors.`zoneId${i}`}
                          // helperText={errors?.`zoneId${i}` ? errors.`zoneId${i}`.message : null}
                          />
                        </td>
                        {/* </Grid> */}
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
                      > */}
                        <td style={thStyle}>
                          <TextField
                            style={{ backgroundColor: "white", width: "250px" }}
                            id={`wardId${i}`}
                            name={`wardId${i}`}
                            // label={<FormattedLabel id="ward" />}
                            // label="Ward "
                            // variant="outlined"
                            variant="standard"
                            value={watch(`wardId${i}`)}
                            InputLabelProps={{
                              shrink:
                                router.query.id || watch(`wardId${i}`)
                                  ? true
                                  : false,
                            }}
                            error={!!errors.wardId}
                            helperText={
                              errors?.wardId ? errors.wardId.message : null
                            }
                          />
                        </td>
                        {/* </Grid> */}
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
                      > */}
                        <td style={thStyle}>
                          <TextField
                            style={{ backgroundColor: "white", width: "250px" }}
                            id={`roadId${i}`}
                            name={`roadId${i}`}
                            // label={<FormattedLabel id="roadType" />}
                            // label="Road Type "
                            // variant="outlined"
                            variant="standard"
                            value={watch(`roadId${i}`)}
                            InputLabelProps={{
                              shrink:
                                router.query.id || watch(`roadId${i}`)
                                  ? true
                                  : false,
                            }}
                            error={!!errors.roadId}
                            helperText={
                              errors?.roadId ? errors.roadId.message : null
                            }
                          />
                        </td>
                        {/* </Grid> */}
                        {/* ////////////////////////////////////////// */}
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
                      > */}
                        <td style={thStyle}>
                          <TextField
                            style={{ backgroundColor: "white", width: "250px" }}
                            id={`locationOfExcavation${i}`}
                            name={`locationOfExcavation${i}`}
                            // label={<FormattedLabel id="locationOfExcavation" />}
                            // label="Location Of Excavation"
                            // variant="outlined"
                            variant="standard"
                            value={watch(`locationOfExcavation${i}`)}
                            InputLabelProps={{
                              shrink:
                                router.query.id ||
                                  watch(`locationOfExcavation${i}`)
                                  ? true
                                  : false,
                            }}
                            error={!!errors.locatonOfExcavation}
                            helperText={
                              errors?.locatonOfExcavation
                                ? errors.locatonOfExcavation.message
                                : null
                            }
                          />
                        </td>
                        {/* </Grid> */}
                        {/* ////////////////////////////////////////// */}

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
                      > */}
                        <td style={thStyle}>
                          <TextField
                            style={{ backgroundColor: "white", width: "250px" }}
                            id={`lengthOfRoad${i}`}
                            name={`lengthOfRoad${i}`}
                            // label={<FormattedLabel id="lengthOfRoad" />}
                            // label="Length Of Road"
                            // variant="outlined"
                            variant="standard"
                            value={watch(`lengthOfRoad${i}`)}
                            InputLabelProps={{
                              shrink:
                                router.query.id || watch(`lengthOfRoad${i}`)
                                  ? true
                                  : false,
                            }}
                            error={!!errors.lengthOfRoad}
                            helperText={
                              errors?.lengthOfRoad
                                ? errors.lengthOfRoad.message
                                : null
                            }
                          />
                        </td>
                        {/* </Grid> */}
                        {/* ////////////////////////////////////////// */}

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
                      > */}
                        <td style={thStyle}>
                          <TextField
                            style={{ backgroundColor: "white", width: "250px" }}
                            id={`widthOfRoad${i}`}
                            name={`widthOfRoad${i}`}
                            // label={<FormattedLabel id="widthOfRoad" />}
                            // label="width Of Road"
                            // variant="outlined"
                            variant="standard"
                            value={watch(`widthOfRoad${i}`)}
                            InputLabelProps={{
                              shrink:
                                router.query.id || watch(`widthOfRoad${i}`)
                                  ? true
                                  : false,
                            }}
                            error={!!errors.widthOfRoad}
                            helperText={
                              errors?.widthOfRoad
                                ? errors.widthOfRoad.message
                                : null
                            }
                          />
                        </td>
                        {/* </Grid> */}

                        {/* ////////////////////////////////////////// */}
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
                      > */}
                        <td style={thStyle}>
                          <TextField
                            style={{ backgroundColor: "white", width: "250px" }}
                            id={`depthOfRoad${i}`}
                            name={`depthOfRoad${i}`}
                            // label={<FormattedLabel id="depthOfRoad" />}
                            variant="standard"
                            value={watch(`depthOfRoad${i}`)}
                            InputLabelProps={{
                              shrink:
                                router.query.id || watch(`depthOfRoad${i}`)
                                  ? true
                                  : false,
                            }}
                            error={!!errors.depthOfRoad}
                            helperText={
                              errors?.depthOfRoad
                                ? errors.depthOfRoad.message
                                : null
                            }
                          />
                        </td>
                        {/* </Grid> */}
                        {/* ////////////////////////////////////////// */}

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
                      > */}
                        <td style={thStyle}>
                          <TextField
                            style={{ backgroundColor: "white", width: "250px" }}
                            id={`excavationPattern${i}`}
                            name={`excavationPattern${i}`}
                            // label={<FormattedLabel id="excavationPattern" />}
                            // label="Excavation Pattern"
                            // variant="outlined"
                            variant="standard"
                            value={watch(`excavationPattern${i}`)}
                            InputLabelProps={{
                              shrink:
                                router.query.id || watch(`excavationPattern${i}`)
                                  ? true
                                  : false,
                            }}
                            error={!!errors.excavationPattern}
                            helperText={
                              errors?.excavationPattern
                                ? errors.excavationPattern.message
                                : null
                            }
                          />
                        </td>
                        {/* </Grid> */}
                        {/* //////////////////////////////////////////////////// */}
                        {/* </Grid> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Typography sx={{ marginLeft: "20px", marginTop: "7vh" }}>
              <h4>
                <b>
                  {language == "en"
                    ? "Type B : Municipal Surcharge"
                    : "प्रकार ब: मनपा अधिभार"}
                </b>
              </h4>
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
                    <th style={thStyle}>{
                      language == "en"
                        ? "Width of Road to be excavation (Meter)"
                        : "खोदाईच्या रस्त्याची रुंदी (मीटर)"
                    }</th>
                    <th style={thStyle}>{
                      language == "en"
                        ? "Length of Road to be excavation (Meter)"
                        : "खोदाईच्या रस्त्याची लांबी (मीटर)"
                    }</th>

                    {/* {router.query.pageMode!="View" &&<th style={thStyle}>{language == "en" ?"Actions":"क्रिया"}</th>} */}
                  </tr>
                </thead>
                <tbody>


                  <tr>
                    <td style={thStyle}>
                      <FormControl disabled>
                        {/* <InputLabel
                          required
                          error={!!errors.natureOfExcavationSite}
                        >
                          {language == "en"
                            ? "Nature of Excavation"
                            : "उत्खननाचे स्वरूप"}
                        </InputLabel> */}
                        <Controller
                          control={control}
                          name="natureOfExcavationSite"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              {...field}
                              error={!!errors.natureOfExcavationSite}
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
                        <FormHelperText error={!!errors.natureOfExcavationSite}>
                          {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                        </FormHelperText>
                      </FormControl>
                    </td>
                    <td style={thStyle}>
                      <TextField
                        style={{ backgroundColor: "white" }}
                        id="widthOfRoadSite"
                        disabled
                        name={`widthOfRoadSite`}
                        // label={
                        //   language == "en"
                        //     ? "Width of Road to be excavation (Meter)"
                        //     : "खोदाईच्या रस्त्याची रुंदी (मीटर)"
                        // }
                        variant="standard"
                        {...register(`widthOfRoadSite`)}
                        InputLabelProps={{
                          shrink: watch("widthOfRoadSite") ? true : false,
                        }}
                        error={!!errors?.widthOfRoadSite}
                        helperText={
                          errors?.widthOfRoadSite
                            ? errors?.widthOfRoadSite.message
                            : null
                        }
                      />
                    </td>
                    <td style={thStyle}>
                      <TextField
                        style={{ backgroundColor: "white"}}
                        id="lengthOfRoadSite"
                        disabled
                        name={`lengthOfRoadSite`}
                        // label={
                        //   language == "en"
                        //     ? "Length of Road to be excavation (Meter)"
                        //     : "खोदाईच्या रस्त्याची लांबी (मीटर)"
                        // }
                        variant="standard"
                        {...register(`lengthOfRoadSite`)}
                        InputLabelProps={{
                          shrink: watch("lengthOfRoadSite") ? true : false,
                        }}
                        error={!!errors?.lengthOfRoadSite}
                        helperText={
                          errors?.lengthOfRoadSite
                            ? errors?.lengthOfRoadSite.message
                            : null
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
              <Typography
                variant="h6"
                style={{
                  padding: "10px",
                  marginTop: "40px",
                  marginLeft: "60px",
                }}
              >
                Uploaded Documents
              </Typography>
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
                      Digging Map
                     
                      <Button
                variant="contained"
                style={{ marginBottom: 2,marginLeft:"2vw" }}
                onClick={() =>
                  getFilePreview(watch("diggingMap"))
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
                      Work Order from Concern Department
                      <Button
                variant="contained"
                style={{ marginBottom: 2,marginLeft:"2vw" }}
                onClick={() =>
                  getFilePreview(watch("workOrderfromConcernDepartment"))
                }                
              >
                {language === "en" ? "View" : "पहा"}
              </Button>
                    </Grid>
                  </Grid>
                </>
              )}
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
                      Tax Receipt
                     
                      <Button
                variant="contained"
                style={{ marginBottom: 2,marginLeft:"2vw" }}
                onClick={() =>
                  getFilePreview(watch("taxReceipt"))
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
                      Other Document
                     
                      <Button
                variant="contained"
                style={{ marginBottom: 2,marginLeft:"2vw" }}
                onClick={() =>
                  getFilePreview(watch("otherDoc"))
                }                
              >
                {language === "en" ? "View" : "पहा"}
              </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              {/* table   */}
              {/* <h3><FormattedLabel id="uploadedDocument" /></h3> */}
              {/* <Typography
                 style={{marginLeft:"30px", marginTop:"20px"}}
                 variant="h6"
                >
                  <FormattedLabel id="uploadedDocument" />
                </Typography>
            <Table>
      <TableHead>
        <TableRow>
          <TableCell><FormattedLabel id="srNo" /></TableCell>
          <TableCell><FormattedLabel id="docName" /></TableCell>
          <TableCell><FormattedLabel id="docType" /></TableCell>
          <TableCell><FormattedLabel id="view" /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataSource
        &&
         dataSource.fileAttachementDao
.map((row,index) => (
          <TableRow key={row.id}>
              <TableCell>{index+1}</TableCell>
            <TableCell>{row.fileName}</TableCell>
            <TableCell>{row.extension}</TableCell>
            <TableCell> <Tooltip title="View">
            <a
            href={`${urls.CFCURL}/file/preview?filePath=${row.filePath}`}
            target='__blank'
          >
              <IconButton>               
                <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
              </IconButton>
                  </a>
            </Tooltip></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
               */}
              {/* <hr />
            <h1 style={{ marginTop: "20px" }}>
              <FormattedLabel id="remark" />
            </h1>
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
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="deputyEngineerRemark"
                  name="deputyEngineerRemark"
                  label={<FormattedLabel id="deputyEngineerRemark" />}
                  // label="Deputy Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("deputyEngineerRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("deputyEngineerRemark")
                        ? true
                        : false,
                  }}
                  error={!!errors.deputyEngineerRemark}
                  helperText={
                    errors?.deputyEngineerRemark
                      ? errors.deputyEngineerRemark.message
                      : null
                  }
                />{" "}
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
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="excutiveEngineerRemark"
                  name="excutiveEngineerRemark"
                  label={<FormattedLabel id="excutiveEngineerRemark" />}
                  // label="Excutive Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("excutiveEngineerRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("excutiveEngineerRemark")
                        ? true
                        : false,
                  }}
                  error={!!errors.excutiveEngineerRemark}
                  helperText={
                    errors?.excutiveEngineerRemark
                      ? errors.excutiveEngineerRemark.message
                      : null
                  }
                />{" "}
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
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="additionalCityEngineerRemark"
                  name="additionalCityEngineerRemark"
                  label={<FormattedLabel id="additionalCityEngineerRemark" />}
                  // label="Additional City Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("additionalCityEngineerRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("additionalCityEngineerRemark")
                        ? true
                        : false,
                  }}
                  error={!!errors.additionalCityEngineerRemark}
                  helperText={
                    errors?.additionalCityEngineerRemark
                      ? errors.additionalCityEngineerRemark.message
                      : null
                  }
                />
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
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="additionalCommissionerRemark"
                  name="additionalCommissionerRemark"
                  label={<FormattedLabel id="additionalCommissionerRemark" />}
                  // label="Additional Commissioner Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("additionalCommissionerRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("additionalCommissionerRemark")
                        ? true
                        : false,
                  }}
                  error={!!errors.additionalCommissionerRemark}
                  helperText={
                    errors?.additionalCommissionerRemark
                      ? errors.additionalCommissionerRemark.message
                      : null
                  }
                />
              </Grid>
            </Grid> */}
              <hr />
              {/* --------------show DemandNote/ LOI-------------- */}
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
                  Demand Note:
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
                          "/roadExcavation/transaction/documenstGeneration/LOI",
                        query: {
                          id: router.query.id,
                        },
                      })
                    }
                  >
                    {language === "en" ? "Demand Note" : "मागणी नोंद"}
                  </Button>
                  {/* </IconButton> */}
                </Grid>
              </Grid>
              <HistoryComponent tableData={applicantHistory} />
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
                          {/* <MenuItem value={"REASIGNE"}><FormattedLabel id="REASIGNE" /></MenuItem> */}
                          <MenuItem value={"REJECT"}>
                            <FormattedLabel id="REJECT" />
                          </MenuItem>
                          <MenuItem value={"REAASIGN"}>
                            <FormattedLabel id="REASIGNE" />
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
                <Grid item>
                  <Button type="submit" variant="outlined">
                    <FormattedLabel id="save" />
                  </Button>
                </Grid>
              </Grid>
              {/* //////////////////////////////////// */}
          </form>
          {/* </Box> */}
        </Paper>
      )}
    </ThemeProvider>
  );
};

export default Index;
