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
// import styles from "../roadExcavationNocPermission/view.module.css";
import styles from "../../roadExcevationForms/roadExcavationNocPermission/view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

// import UploadButton from "../../fileUpload";
import UploadButton from "../../fileUpload/UploadButton";
import { roadExcavationCitizenSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import FileTable from "../../../../../components/roadExcevation/FileUpload/FileTable";
import { Engineering } from "@mui/icons-material";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { DecryptData, EncryptData } from "../../../../../components/common/EncryptDecrypt";

const Index = () => {
  const methods = useForm({
    // criteriaMode: "all",
    resolver: yupResolver(
      yup.object().shape({ ...roadExcavationCitizenSchema })
    ),
    // mode: "onSubmit",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
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
  //get logged in user
  const user = useSelector((state) => state.user.user);
  console.log("5555", user.id);
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
  const [affidavit, setaffidavit] = useState();
  const [underTaking, setunderTaking] = useState();
  const [underTakingEncrupt, setunderTakingEncrupt] = useState();
  const [previouslyApprovedDiggingMap, setpreviouslyApprovedDiggingMap] =useState();
  const [previouslyApprovedDiggingMapEncrupt, setpreviouslyApprovedDiggingMapEncrupt] =useState();
  const [affidavitEncrupt, setaffidavitEncrupt] = useState();
  const [previousWorkOrderEncrupt, setpreviousWorkOrderEncrupt] = useState();
  const [previousWorkOrder, setpreviousWorkOrder] = useState();
  const [docView, setDocView] = useState(false);
  const [applicationList, setapplicationList] = useState([]);
  const [dataSource, setdataSource] = useState();
  const [natureofExcavation, setnatureofExcavation] = useState([]);
  const userToken = useGetToken();
  // const [authorizedToUpload, setAuthorizedToUpload] = useState(false);

  //aplicationList
  const getaplicationList = () => {
    if(user.id){
    axios
      .get(
        `${urls.RENPURL}/trnExcavationRoadCpmpletion/getAllByCreatedUserId?createdUserId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        let array = r.data.trnExcavationRoadCpmpletionList;
        setapplicationList(
          array.map((row) => ({
            id: row.id,
            applicationNumber: row.applicationNumber,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    }
  };

  const getApplicationInfo = () => {
    if (watch("applicationNumber")) {
      axios
        .get(
          `${urls.RENPURL}/trnExcavationRoadCpmpletion/getByApplicationNo?applicationNo=${watch("applicationNumber")}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("rrrrrrrrdata", r.data.trnExcavationRoadCpmpletionList);
          setdataSource(r.data.trnExcavationRoadCpmpletionList[0]);
          // setZoneWardKeys(r.data)
          // setZoneWardKeys(
          //   r.data.map((row) => ({
          //     id: row.id,
          //     wardName: row.wardName,
          //     wardNameMr: row.wardNameMr,
          //   })),
          // )
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

  useEffect(() => {
    getApplicationInfo();
  }, [watch("applicationNumber")]);
  useEffect(() => {
    getNatureOfExcavation();
  }, []);

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

  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      flex: 1,
      // width: 140,
    },
    // language == "en"
    //   ? {
    //       headerName: "Uploaded By",
    //       field: "attachedNameEn",
    //       flex: 2,
    //       // width: 300,
    //     }
    //   : {
    //       headerName: "द्वारे अपलोड केले",
    //       field: "attachedNameMr",
    //       flex: 2,
    //       // width: 300,
    //     },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      // width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                  "_blank"
                );
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

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
    console.log("watch", watch("nonBRTSRoadZone"));
    // console.log("zoneee",getValues(`excavationData.${index}.zoneId`),"index",index);
    // let zoneIdd=getValues(`excavationData.${index}.zoneId`);
    if (watch("nonBRTSRoadZone")!=" "&& watch("nonBRTSRoadZone")!=null && watch("nonBRTSRoadZone")!=undefined) {
      axios
        .get(
          `${
            urls.CFCURL
          }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${watch(
            "nonBRTSRoadZone"
          )}`,
          {
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
  };
  console.log("previouslyApprovedDiggingMap", previouslyApprovedDiggingMap);
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

  console.log("applicationList", applicationList);
  let onSubmitFunc = (formData) => {
    let body = {
      ...formData,
      previousWorkOrder: previousWorkOrderEncrupt,
      previouslyApprovedDiggingMap: previouslyApprovedDiggingMapEncrupt,
      underTaking: underTakingEncrupt,
      affidavit: affidavitEncrupt,
      oldId: applicationList.find(
        (app) => app.applicationNumber === watch("applicationNumber")
      ).id,
      //   fileAttachementDao: finalFiles,
      createdUserId: user?.id,
    };
    console.log("onSubmitFunc", body);
    if (btnSaveText === "Save") {
      if (loggedInUser === "citizenUser") {
        const tempData = axios
          .post(`${urls.RENPURL}/nocPermissionForMaintenance/save`, body,{
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
                "/dashboard"
                // "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else {
        const tempData = axios
          .post(`${urls.RENPURL}/nocPermissionForMaintenance/save`, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
              sweetAlert(
                "Saved!",
                "Road Excevation Application Saved successfully !",
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

  //assigning value to fields
  useEffect(() => {
    let res = dataSource;
    // setValue("applicationNumber", res ? res?.applicationNumber : "-");
    setValue("isIndividualOrFirm", res ? res?.isIndividualOrFirm : "-");
    setValue("companyName", res ? res?.companyName : "-");
    setValue("companyNameMr", res ? res?.companyNameMr : "-");
    setValue("categoryOfRoad", res ? res?.categoryOfRoad : "-");
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
    setValue("scopeOfWork", res ? res?.scopeOfWork : "-");
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
    setValue("nonBRTSRoadZone", res?.nonBRTSRoadZone );
    setValue(
      "nonBRTSRoadLocationOfExcavation",
      res ? res?.nonBRTSRoadLocationOfExcavation : "-"
    );
    // setValue("eligibleForSchemeYn", res ? res?.eligibleForSchemeYn : "-");
    setValue("startLatAndStartLng", res ? res?.startLatAndStartLng : "-");
    setValue("endLatAndEndLng", res ? res?.endLatAndEndLng : "-");
    setValue("taxReceipt", res ? res?.taxReceipt : "-");
    setValue("diggingMap", res ? res?.diggingMap : "-");
    setValue("otherDoc", res ? res?.otherDoc : "-");
    setValue(
      "workOrderfromConcernDepartment",
      res ? res?.workOrderfromConcernDepartment : "-"
    );
    // setValue("locationSameAsPcmcOrderYn", res ? res?.locationSameAsPcmcOrderYn : null);
    // setValue("locationRemark", res ? res?.locationRemark : "-");
    // setValue("lengthSameAsPcmcOrderYn", res ? res?.lengthSameAsPcmcOrderYn : null);
    // setValue("lengthRemark", res ? res?.lengthRemark : "-");
    // setValue("depthSameAsPcmcOrderYn", res ? res?.depthSameAsPcmcOrderYn : null);
    // setValue("depthRemark", res ? res?.depthRemark : "-");
    // setValue("widthSameAsPcmcOrderYn", res ? res?.widthSameAsPcmcOrderYn : null);
    // setValue("widthRemark", res ? res?.widthRemark : "-");
    setValue("deputyEngineerRemark", res ? res?.deputyEngineerRemark : "-");
    setValue("excutiveEngineerRemark", res ? res?.excutiveEngineerRemark : "-");
    setValue(
      "additionalCityEngineerRemark",
      res ? res?.additionalCityEngineerRemark : "-"
    );
    setValue(
      "additionalCommissionerRemark",
      res ? res?.additionalCommissionerRemark : "-"
    );
    setValue("commissionerRemark", res ? res?.commissionerRemark : "-");
  }, [dataSource]);

  useEffect(() => {
    getaplicationList();
  }, []);

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
              <FormattedLabel id="RoadExcavation_NocPermissionMaintenance" />
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
              <InputLabel  error={!!errors.applicationNumber}>
                SelectApplication Number
              </InputLabel>
              <Controller
                control={control}
                name="applicationNumber"
                // rules={{ required: true }}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    variant="standard"
                    {...field}
                    error={!!errors.applicationNumber}
                  >
                    {applicationList &&
                      applicationList.map((type) => (
                        <MenuItem
                          key={type.applicationNumber}
                          value={type.applicationNumber}
                        >
                          {type.applicationNumber}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.applicationNumber}>
                {/* {errors.applicationNumber
                        ? labels.academicYearRequired
                        : null} */}
              </FormHelperText>
            </FormControl>
          </Grid>
          <FormProvider {...methods}>
            {watch("applicationNumber") && (
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
                    {/* <TextField
                  
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
                        disabled
                        label={<FormattedLabel id="companyName" required />}
                        error={!!errors.companyName}
                        helperText={
                          errors?.companyName
                            ? errors.companyName.message
                            : null
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
                        label={<FormattedLabel id="firstNameMr" required />}
                        error={!!errors.firstNameMr}
                        helperText={
                          errors?.firstNameMr
                            ? errors.firstNameMr.message
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
                        disabled
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
                        disabled
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
                      id="landlineNo"
                      name="landlineNo"
                      label={<FormattedLabel id="landLineNo" />}
                      variant="standard"
                      {...register("landlineNo")}
                      error={!!errors.landlineNo}
                      helperText={
                        errors?.landlineNo ? errors.landlineNo.message : null
                      }
                      disabled
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
                      variant="standard"
                      {...register("mobileNo")}
                      error={!!errors.mobileNo}
                      helperText={
                        errors?.mobileNo ? errors.mobileNo.message : null
                      }
                      disabled
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
                      disabled
                      label={<FormattedLabel id="emailAddress" />}
                      variant="standard"
                      {...register("emailAddress")}
                      error={!!errors.emailAddress}
                      helperText={
                        errors?.emailAddress
                          ? errors.emailAddress.message
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
                      // marginLeft:"50px"
                    }}
                  >
                    <div>
                      <Typography
                        style={{
                          paddingLeft: "70px",
                        }}
                      >
                        Category of Road
                      </Typography>
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
                                    <MenuItem
                                      key={type.value}
                                      value={type.value}
                                    >
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
                        disabled
                          style={{ backgroundColor: "white", width: "250px" }}
                          id="locationOfExcavation"
                          name="locationOfExcavation"
                          // label={<FormattedLabel id="locationOfExcavation" />}
                          label="Location Of Excavation"
                          variant="standard"
                          {...register("locationOfExcavation")}
                          error={!!errors.locationOfExcavation}
                          helperText={
                            errors?.locationOfExcavation
                              ? errors.locationOfExcavation.message
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
                          style={{ backgroundColor: "white", width: "250px" }}
                          id="otherTypeOfServices"
                          name="otherTypeOfServices"
                          disabled
                          // label={<FormattedLabel id="otherTypeOfServices" />}
                          label="Other type of service"
                          variant="standard"
                          {...register("otherTypeOfServices")}
                          error={!!errors.otherTypeOfServices}
                          helperText={
                            errors?.otherTypeOfServices
                              ? errors.otherTypeOfServices.message
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
                          <InputLabel
                            required
                            error={!!errors.subApplicantCentral}
                          >
                            Applicant Sub Type
                          </InputLabel>
                          <Controller
                            control={control}
                            name="subApplicantCentral"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.subApplicantCentral}
                              >
                                {subApplicantCentralList &&
                                  subApplicantCentralList.map((type) => (
                                    <MenuItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.lable}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.subApplicantCentral}>
                            {/* {errors.typeOfPavement
                        ? labels.academicYearRequired
                        : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {watch("subApplicantCentral") == 4 && (
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
                          id="othersubApplicantCentral"
                          name="othersubApplicantCentral"
                          // label={<FormattedLabel id="othersubApplicantCentral" />}
                          label="Other Applicant Sub Type"
                          variant="standard"
                          {...register("othersubApplicantCentral")}
                          error={!!errors.othersubApplicantCentral}
                          helperText={
                            errors?.othersubApplicantCentral
                              ? errors.othersubApplicantCentral.message
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
                          <InputLabel
                            required
                            error={!!errors.subApplicantState}
                          >
                            Applicant Sub Type
                          </InputLabel>
                          <Controller
                            control={control}
                            name="subApplicantState"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                {...field}
                                error={!!errors.subApplicantState}
                              >
                                {subApplicantStateList &&
                                  subApplicantStateList.map((type) => (
                                    <MenuItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.lable}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.subApplicantState}>
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
                          id="otherApplicantType"
                          name="otherApplicantType"
                          // label={<FormattedLabel id="otherApplicantType" />}
                          label="Other type of service"
                          variant="standard"
                          {...register("otherApplicantType")}
                          error={!!errors.otherApplicantType}
                          helperText={
                            errors?.otherApplicantType
                              ? errors.otherApplicantType.message
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
                                  {language === "en"
                                    ? type.nameEng
                                    : type.nameMr}
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
                      paddingLeft: "70px",
                      // marginLeft:"2px"
                    }}
                  >
                    <TextField
                    disabled
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="lengthOfRoad"
                      name="lengthOfRoad"
                      // label={<FormattedLabel id="lengthOfRoad" />}
                      label="Length of Road to be excavation (Meter)"
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
                      {errors.natureofExcavation
                        ? "requried only numbers"
                        : null}
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
                    disabled
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="expectedPeriod"
                      name="expectedPeriod"
                      label={<FormattedLabel id="expectedPeriodInDays" />}
                      // variant="outlined"
                      variant="standard"
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
                    disabled
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="scopeOfWork"
                      name="scopeOfWork"
                      label={<FormattedLabel id="scopeOfWork" />}
                      // variant="outlined"
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
                    }}
                  >
                    <TextField
                    disabled
                      style={{
                        backgroundColor: "white",
                        width: "250px",
                        marginTop: "10px",
                      }}
                      id="startLatAndStartLng"
                      name="startLatAndStartLng"
                      label={<FormattedLabel id="startLatAndStartLng" />}
                      variant="standard"
                      {...register("startLatAndStartLng")}
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
                      marginTop: "20px",
                    }}
                  >
                    <TextField
                      style={{
                        backgroundColor: "white",
                        width: "250px",
                        marginTop: "10px",
                      }}
                      disabled
                      id="endLatAndEndLng"
                      name="endLatAndEndLng"
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
                  </Grid>

                  {/*///////////////////////////////////////// */}

                  {/*///////////////////////////////////////// */}
                </Grid>
                <Grid item>
                  <Typography
                    style={{
                      marginLeft: "70px",
                      marginTop: "40px",
                      marginBottom: "20px",
                    }}
                    variant="h5"
                  >
                    <FormattedLabel id="uploadedDocument" />
                    {/* uploadedDocument */}
                  </Typography>
                </Grid>
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
                style={{ marginBottom: 2 ,marginLeft:"2vw"}}
                
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
                style={{ marginBottom: 2 ,marginLeft:"2vw"}}
                
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
                style={{ marginBottom: 2 ,marginLeft:"2vw"}}
                
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
                        Other Document
                      
                        <Button
                variant="contained"
                style={{ marginBottom: 2 ,marginLeft:"2vw"}}
                
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

{/* **************New Fields****************** */}
<Grid item>
                  <Typography
                    style={{
                      marginLeft: "70px",
                      marginTop: "40px",
                      marginBottom: "20px",
                    }}
                    variant="h5"
                  >
                    {/* <FormattedLabel id="uploadedDocument" /> */}
                    {/* uploadedDocument */}
                    Required Information
                  </Typography>
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
                      <InputLabel  error={!!errors.natureOfExcavationMaintnance}>
                        Nature of Excavation
                      </InputLabel>
                      <Controller
                        control={control}
                        name="natureOfExcavationMaintnance"
                        // rules={{ required: true }}
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
                                  {language === "en"
                                    ? type.nameEng
                                    : type.nameMr}
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
                        helperText={
                          errors?.widthOfRoadMaintenance
                            ? errors?.widthOfRoadMaintenance
                              .message
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
                    }}
                  >
                     <TextField
                        // style={{ backgroundColor: "white", width: ./"250px" }}
                        id="lengthOfRoadMaintenance"
                        name={`lengthOfRoadMaintenance`}
                        label={language == "en"
                          ? "Width of Road to be excavation (Meter)"
                          : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}
                        variant="outlined"
                        {...register(
                          `lengthOfRoadMaintenance`
                        )}
                        style={{ margin: "1vw", width: "350px" }}
                        error={
                          !!errors?.lengthOfRoadMaintenance
                        }
                        helperText={
                          errors?.lengthOfRoadMaintenance
                            ? errors?.lengthOfRoadMaintenance
                              .message
                            : null
                        }
                      />
                  </Grid>

</Grid>
                {/* file upload */}
                <Grid item>
                  <Typography
                    style={{
                      marginLeft: "80px",
                      marginTop: "50px",
                      marginBottom: "50px",
                    }}
                    variant="h5"
                  >
                    <FormattedLabel id="requiredDocuments" />
                  </Typography>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    xl={5}
                    lg={5}
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
                      {language=="en"?"Under Taking":"हमीपत्र"}<span style={{ color: "red" }}>*</span>
                      </label>
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <UploadButton
                        view={docView}
                        appName="ROAD"
                        serviceName="R-NOC"
                        fileUpdater={setunderTaking}
                        filePath={underTaking}
                        fileNameEncrypted={(path) => {                                                        
                          setunderTakingEncrupt(path)
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xl={5}
                    lg={5}
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
                      {language=="en"?"Affidavit":"प्रतिज्ञापत्र"} <span style={{ color: "red" }}>*</span>
                      </label>
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <UploadButton
                        view={docView}
                        appName="ROAD"
                        serviceName="R-NOC"
                        fileUpdater={setaffidavit}
                        filePath={affidavit}
                        fileNameEncrypted={(path) => {                                                        
                          setaffidavitEncrupt(path)
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xl={5}
                    lg={5}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "30px",
                    }}
                  >
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <label>
                      {language=="en"?"Previously approved Digging Map":"पूर्वी मंजूर खोदकाम नकाशा"} 

                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <UploadButton
                        view={docView}
                        appName="ROAD"
                        serviceName="R-NOC"
                        fileUpdater={setpreviouslyApprovedDiggingMap}
                        filePath={previouslyApprovedDiggingMap}
                        fileNameEncrypted={(path) => {                                                        
                          setpreviouslyApprovedDiggingMapEncrupt(path)
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xl={5}
                    lg={5}
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
                      {language=="en"?"Previously work order":"पूर्वी वर्क ऑर्डर"}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <UploadButton
                        view={docView}
                        appName="ROAD"
                        serviceName="R-NOC"
                        fileUpdater={setpreviousWorkOrder}
                        filePath={previousWorkOrder}
                        fileNameEncrypted={(path) => {                                                        
                          setpreviousWorkOrderEncrupt(path)
                        }}
                      />
                    </Grid>
                  </Grid>
                  {/* <FileTable
                appName="ROAD" //Module Name
                serviceName={"R-NOC"} //Transaction Name
                fileName={attachedFile} //State to attach file
                filePath={setAttachedFile} // File state upadtion function
                newFilesFn={setAdditionalFiles} // File data function
                columns={_columns} //columns for the table
                rows={finalFiles} //state to be displayed in table
                uploading={setUploading}
                // authorizedToUpload={authorizedToUpload}
              /> */}
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
                  <Grid item>
                    <Button variant="outlined" onClick={clearButton}>
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" onClick={exitButton}>
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
                {/* //////////////////////////////////// */}
              </form>
            )}
          </FormProvider>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
