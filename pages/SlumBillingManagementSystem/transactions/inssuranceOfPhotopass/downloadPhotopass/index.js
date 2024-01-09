import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  Modal,
  ThemeProvider,
} from "@mui/material";
import React, { useRef } from "react";
import theme from "../../../../../theme";
import { useForm } from "react-hook-form";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import router from "next/router";
import axios from "axios";
import { Clear, ExitToApp, Language, Save } from "@mui/icons-material";
import urls from "../../../../../URLS/urls";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FileTable from "../../../../../components/SlumBillingManagementSystem/FileUpload/FileTable";
import sweetAlert from "sweetalert";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { useReactToPrint } from "react-to-print";
import Photopass from "../generateDocuments/photopass";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";
import { manageStatus } from "../../../../../components/ElectricBillingComponent/commonStatus/manageEnMr";
import { DataGrid } from "@mui/x-data-grid";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    height: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");

  const [finalFiles, setFinalFiles] = useState([]);
  const [statusAll, setStatus] = useState([]);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const [currentStatus1, setCurrentStatus] = useState();
  const [payloadImages, setPayloadImages] = useState({});
  const [photo, setPhoto] = useState(null);
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [relationDropDown, setRelationDropDown] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataSource, setDataSource] = useState({});
  const [siteImages, setSiteImages] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isDisabled, setIsDisabled] = useState(false);
  const [remark, setRemark] = useState("");
  const [clerkApprovalRemark, setClerkApprovalRemark] = useState(null);
  const [headClerkApprovalRemark, setHeadClerkApprovalRemark] = useState(null);
  const [
    officeSuperintendantApprovalRemark,
    setOfficeSuperintendantApprovalRemark,
  ] = useState(null);
  const [
    administrativeOfficerApprovalRemark,
    setAdministrativeOfficerApprovalRemark,
  ] = useState(null);
  const [
    assistantCommissionerApprovalRemark,
    setAssistantCommissionerApprovalRemark,
  ] = useState(null);
  const [slumName, setSlumName] = useState("");
  const [villageName, setVillageName] = useState("");
  const [hutData, setHutData] = useState({});
  const [ownership, setOwnership] = useState({});
  const [usageType, setUsageType] = useState({});
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  const headers =
    loggedInUser === "citizenUser"
      ? { Userid: user?.id }
      : { Authorization: `Bearer ${user?.token}` };

      const getFilePreview = (filePath) => {
        const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
        const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
        axios
          .get(url, {
            headers: headers,
          })
          .then((r) => {
            if (r?.data?.mimeType == "application/pdf") {
              const byteCharacters = atob(r?.data?.fileName);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: "application/pdf" });
              const url = URL.createObjectURL(blob);
              const newTab = window.open();
              newTab.location.href = url;
            }
            // for img
            else if (r?.data?.mimeType == "image/jpeg") {
              const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
              const newTab = window.open();
              newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
            } else {
              const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
              const newTab = window.open();
              newTab.document.write(`
                    <html>
                      <body style="margin: 0;">
                        <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
                      </body>
                    </html>
                  `);
            }
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, true);
          });
      };
  useEffect(() => {
    getPhotopassDataById(router.query.id);
    getHutData();
    getTitleData();
    getRelationDetails();
  }, [router.query.id]);

  useEffect(() => {
    getOwnerShipData();
    getUsageType();
  }, [hutData]);

  useEffect(() => {
    getAllStatus();
  }, []);

  const getAllStatus = () => {
    axios
      .get(`${urls.SLUMURL}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getPhotopassDataById = (id) => {
    setIsLoading(true);
    if (id) {
      axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
          headers: headers,
        })
        .then((r) => {
          setIsLoading(false);
          let result = r.data;
          //   console.log("getPhotopassDataById", result);
          setDataSource(result);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  useEffect(() => {
    getHutData();
  }, [dataSource]);

  useEffect(() => {
    if (dataSource != null) {
      setDataOnForm();
    }
  }, [dataSource, language]);

  const setDataOnForm = () => {
    let res = dataSource;

    setValue("hutNo", res ? res.hutNo : "-");
    setValue("applicationNo", res ? res.applicationNo : "-");
    setValue("currentStatus", manageStatus(res?.status, language, statusAll));

    setValue(
      "ownerTitle",
      !res?.applicantTitle
        ? "-"
        : language == "en"
        ? titleDropDown &&
          titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleEn
        : titleDropDown &&
          titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleMr
    );
    setValue(
      "ownerFirstName",
      !res?.applicantFirstName
        ? "-"
        : language == "en"
        ? res?.applicantFirstName
        : res?.applicantFirstNameMr
    );
    setValue(
      "ownerMiddleName",
      !res?.applicantMiddleName
        ? "-"
        : language == "en"
        ? res?.applicantMiddleName
        : res?.applicantMiddleNameMr
    );
    setValue(
      "ownerLastName",
      !res?.applicantLastName
        ? "-"
        : language == "en"
        ? res?.applicantLastName
        : res?.applicantLastNameMr
    );
    setValue(
      "ownerMobileNo",
      res?.applicantMobileNo ? res?.applicantMobileNo : "-"
    );
    setValue(
      "ownerAadharNo",
      res?.applicantAadharNo ? res?.applicantAadharNo : "-"
    );
    setValue("ownerEmail", res?.applicantEmailId ? res?.applicantEmailId : "-");
    setValue("ownerAge", res?.applicantAge ? res?.applicantAge : "-");
    setValue(
      "ownerOccupation",
      res?.applicantOccupation ? res?.applicantOccupation : "-"
    );
    setValue(
      "ownerRelation",
      !res?.applicantRelationKey
        ? "-"
        : language == "en"
        ? relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.applicantRelationKey)
            ?.relation
        : relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.applicantRelationKey)
            ?.relationMr
    );
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    setValue("outstandingTax", res ? res?.outstandingTax : "-");
    setValue(
      "spouseTitle",
      !res?.coApplicantTitle
        ? "-"
        : language == "en"
        ? titleDropDown &&
          titleDropDown.find((obj) => obj.id == res?.coApplicantTitle)?.titleEn
        : titleDropDown &&
          titleDropDown.find((obj) => obj.id == res?.coApplicantTitle)?.titleMr
    );
    setValue(
      "spouseFirstName",
      !res?.coApplicantFirstName
        ? "-"
        : language == "en"
        ? res?.coApplicantFirstName
        : res?.coApplicantFirstNameMr
    );
    setValue(
      "spouseMiddleName",
      !res?.coApplicantMiddleName
        ? "-"
        : language == "en"
        ? res?.coApplicantMiddleName
        : res?.coApplicantMiddleNameMr
    );
    setValue(
      "spouseLastName",
      !res?.coApplicantLastName
        ? "-"
        : language == "en"
        ? res?.coApplicantLastName
        : res?.coApplicantLastNameMr
    );
    setValue(
      "spouseMobileNo",
      res?.coApplicantMobileNo ? res?.coApplicantMobileNo : "-"
    );
    setValue(
      "spouseAadharNo",
      res?.coApplicantAadharNo ? res?.coApplicantAadharNo : "-"
    );
    setValue(
      "spouseEmail",
      res?.coApplicantEmail ? res?.coApplicantEmail : "-"
    );
    setValue("spouseAge", res?.coApplicantAge ? res?.coApplicantAge : "-");
    setValue(
      "spouseOccupation",
      res?.coApplicantOccupation ? res?.coApplicantOccupation : "-"
    );
    setValue(
      "spouseRelation",
      !res?.coApplicantRelationKey
        ? "-"
        : language == "en"
        ? relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.coApplicantRelationKey)
            ?.relation
        : relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.coApplicantRelationKey)
            ?.relationMr
    );
    setPhoto({ documentPath: res?.husbandWifeCombinedPhoto });
    setValue(
      "clerkApprovalRemark",
      res?.clerkApprovalRemark ? res?.clerkApprovalRemark : "-"
    );
    setValue(
      "headClerkApprovalRemark",
      res?.headClerkApprovalRemark ? res?.headClerkApprovalRemark : "-"
    );
    setValue(
      "officeSuperintendantApprovalRemark",
      res?.officeSuperintendantApprovalRemark
        ? res?.officeSuperintendantApprovalRemark
        : "-"
    );
    setValue(
      "administrativeOfficerApprovalRemark",
      res?.administrativeOfficerApprovalRemark
        ? res?.administrativeOfficerApprovalRemark
        : "-"
    );
    setValue(
      "assistantCommissionerApprovalRemark",
      res?.assistantCommissionerApprovalRemark
        ? res?.assistantCommissionerApprovalRemark
        : "-"
    );

    let siteVisitObj =
      res?.trnVisitScheduleList &&
      res?.trnVisitScheduleList[res?.trnVisitScheduleList?.length - 1];

    const doc = [];
    // Loop through each attached document and add it to the `doc` array

    for (let i = 1; i <= 5; i++) {
      const attachedDocument = siteVisitObj?.[`siteImage${i}`];

      if (attachedDocument != null) {
        doc.push({
          id: i,
          fileName: attachedDocument.split("/").pop().split("_").pop(),
          documentPath: attachedDocument,
          documentType: attachedDocument.split(".").pop().toUpperCase(),
        });
      }
      setFinalFiles(doc);
    }

    // setFinalFiles([
    //   {
    //     srNo: 1,
    //     fileName: showFileName(siteVisitObj?.siteImage1),
    //     filePath: siteVisitObj?.siteImage1,
    //   },
    //   {
    //     srNo: 2,
    //     fileName: showFileName(siteVisitObj?.siteImage2),
    //     filePath: siteVisitObj?.siteImage2,
    //   },
    //   {
    //     srNo: 3,
    //     fileName: showFileName(siteVisitObj?.siteImage3),
    //     filePath: siteVisitObj?.siteImage3,
    //   },
    //   {
    //     srNo: 4,
    //     fileName: showFileName(siteVisitObj?.siteImage4),
    //     filePath: siteVisitObj?.siteImage4,
    //   },
    //   {
    //     srNo: 5,
    //     fileName: showFileName(siteVisitObj?.siteImage5),
    //     filePath: siteVisitObj?.siteImage5,
    //   },
    // ]);
    setValue("siteVisitRemark", siteVisitObj?.remarks);
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    console.log("fileNamee", fileNamee);
    return fileNamee?.length > 0 && fileNamee[1];
  }

  const getRelationDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstRelation/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let temp = r.data.mstRelationDao;
        setRelationDropDown(
          temp?.map((row) => ({
            id: row.id,
            relation: row.relation,
            relationMr: row.relationMr,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getTitleData = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`,
    { headers: headers }).then((r) => {
      let result = r.data.title;
      let res =
        result && result.find((obj) => obj.id == dataSource?.applicantTitle);

      let res1 =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            titleEn: r.title,
            titleMr: r.titleMr,
          };
        });
      setTitleDropDown(res1);
    }).catch((err)=>{
      cfcErrorCatchMethod(err, true);
    });
  };

  useEffect(() => {
    let res = hutData;

    let hutOwner = hutData?.mstHutMembersList?.find(
      (each) => each.headOfFamily == "Y"
    );
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    getVillageData(res?.villageKey);
    getAreaData(res?.areaKey);
    getSlumData(res?.slumKey);
  }, [hutData, language]);

  const getHutData = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstHutList;
        let res = result && result.find((obj) => obj.id == dataSource?.hutKey);
        console.log("getHutData", res);
        setHutData(res);
        setValue("hutNo", res ? res?.hutNo : "-");
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getOwnerShipData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbOwnershipType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSbOwnershipTypeList;
        let res =
          result && result.find((obj) => obj.id == hutData?.ownershipKey);
        console.log("getOwnerShipData", res, r.data);
        setOwnership(res?.ownershipTypeMr);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getUsageType = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbUsageType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSbUsageTypeList;
        let res =
          result && result.find((obj) => obj.id == hutData?.usageTypeKey);
        console.log("getUsageType", res, result);
        setUsageType(res?.usageTypeMr);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getVillageData = (villageKey) => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        let res = result && result.find((obj) => obj.id == villageKey);
        setValue(
          "villageKey",
          !res ? "-" : language === "en" ? res?.villageName : res?.villageNameMr
        );
        let villageData1 =
          language === "en" ? res?.villageName : res?.villageNameMr;
        setVillageName(villageData1);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getSlumData = (slumKey) => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        let res = result && result.find((obj) => obj.id == slumKey);
        setValue(
          "slumKey",
          !res ? "-" : language === "en" ? res?.slumName : res?.slumNameMr
        );
        let slumData1 = language === "en" ? res?.slumName : res?.slumNameMr;
        setSlumName(slumData1);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAreaData = (areaKey) => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.area;
        let res = result && result.find((obj) => obj.id == areaKey);
        setValue(
          "areaKey",
          !res ? "-" : language === "en" ? res?.areaName : res?.areaNameMr
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });
  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  // file attache column
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      headerAlign: "center",
      align: "center",
      // File: "originalFileName",
      width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      headerAlign: "center",
      align: "center",
      // flex: 1,
      width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                getFilePreview(record?.row?.filePath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {isLoading && <CommonLoader />}
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <form>
            {/********* Hut Owner Information *********/}

            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={1}>
                  <IconButton
                    style={{
                      color: "white",
                    }}
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="hutOwnerDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={1} sx={{ padding: "1rem" }}>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {photo?.documentPath ? (
                  <img
                    src={`${urls.CFCURL}/file/preview?filePath=${photo?.documentPath}`}
                    alt="अर्जदाराचा फोटो"
                    height="150px"
                    width="144px"
                  />
                ) : (
                  <h4>अर्जदाराचा फोटो</h4>
                )}
              </Grid>

              {/* Hut No */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="hutNo" />}
                  variant="standard"
                  value={watch("hutNo")}
                  InputLabelProps={{
                    shrink: watch("hutNo") ? true : false,
                  }}
                  error={!!error.hutNo}
                  helperText={error?.hutNo ? error.hutNo.message : null}
                />
              </Grid>

              {/* Application No */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="applicationNo" />}
                  variant="standard"
                  value={watch("applicationNo")}
                  InputLabelProps={{
                    shrink: watch("applicationNo") ? true : false,
                  }}
                  error={!!error.applicationNo}
                  helperText={
                    error?.applicationNo ? error.applicationNo.message : null
                  }
                />
              </Grid>

              {/* Current Status */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="currentStatus" />}
                  variant="standard"
                  value={watch("currentStatus")}
                  InputLabelProps={{
                    shrink: watch("currentStatus") ? true : false,
                  }}
                  error={!!error.currentStatus}
                  helperText={
                    error?.currentStatus ? error.currentStatus.message : null
                  }
                />
              </Grid>

              {/* owner Title */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="title" />}
                  variant="standard"
                  value={watch("ownerTitle")}
                  InputLabelProps={{
                    shrink: watch("ownerTitle") ? true : false,
                  }}
                  error={!!error.ownerTitle}
                  helperText={
                    error?.ownerTitle ? error.ownerTitle.message : null
                  }
                />
              </Grid>

              {/* firstName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  value={watch("ownerFirstName")}
                  InputLabelProps={{
                    shrink: watch("ownerFirstName") ? true : false,
                  }}
                  error={!!error.ownerFirstName}
                  helperText={
                    error?.ownerFirstName ? error.ownerFirstName.message : null
                  }
                />
              </Grid>

              {/* middleName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  value={watch("ownerMiddleName")}
                  InputLabelProps={{
                    shrink: watch("ownerMiddleName") ? true : false,
                  }}
                  error={!!error.ownerMiddleName}
                  helperText={
                    error?.ownerMiddleName
                      ? error.ownerMiddleName.message
                      : null
                  }
                />
              </Grid>

              {/* lastName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  value={watch("ownerLastName")}
                  InputLabelProps={{
                    shrink: watch("ownerLastName") ? true : false,
                  }}
                  error={!!error.ownerLastName}
                  helperText={
                    error?.ownerLastName ? error.ownerLastName.message : null
                  }
                />
              </Grid>

              {/* mobileNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  value={watch("ownerMobileNo")}
                  InputLabelProps={{
                    shrink: watch("ownerMobileNo") ? true : false,
                  }}
                  error={!!error.ownerMobileNo}
                  helperText={
                    error?.ownerMobileNo ? error.ownerMobileNo.message : null
                  }
                />
              </Grid>

              {/* aadharNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="aadharNo" />}
                  variant="standard"
                  value={watch("ownerAadharNo")}
                  InputLabelProps={{
                    shrink: watch("ownerAadharNo") ? true : false,
                  }}
                  error={!!error.ownerAadharNo}
                  helperText={
                    error?.ownerAadharNo ? error.ownerAadharNo.message : null
                  }
                />
              </Grid>

              {/* email */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="email" />}
                  variant="standard"
                  value={watch("ownerEmail")}
                  InputLabelProps={{
                    shrink: watch("ownerEmail") ? true : false,
                  }}
                  error={!!error.ownerEmail}
                  helperText={
                    error?.ownerEmail ? error.ownerEmail.message : null
                  }
                />
              </Grid>

              {/* age */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="age" />}
                  variant="standard"
                  value={watch("ownerAge")}
                  InputLabelProps={{
                    shrink: watch("ownerAge") ? true : false,
                  }}
                  error={!!error.ownerAge}
                  helperText={error?.ownerAge ? error.ownerAge.message : null}
                />
              </Grid>

              {/* occupation */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="occupation" />}
                  variant="standard"
                  value={watch("ownerOccupation")}
                  InputLabelProps={{
                    shrink: watch("ownerOccupation") ? true : false,
                  }}
                  error={!!error.ownerOccupation}
                  helperText={
                    error?.ownerOccupation
                      ? error.ownerOccupation.message
                      : null
                  }
                />
              </Grid>

              {/* relation  */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="relation" />}
                  variant="standard"
                  value={watch("ownerRelation")}
                  InputLabelProps={{
                    shrink: watch("ownerRelation") ? true : false,
                  }}
                  error={!!error.ownerRelation}
                  helperText={
                    error?.ownerRelation ? error.ownerRelation.message : null
                  }
                />
              </Grid>

              {/* Slum Name */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="slumName" />}
                  variant="standard"
                  value={watch("slumKey")}
                  InputLabelProps={{
                    shrink: watch("slumKey") ? true : false,
                  }}
                  error={!!error.slumKey}
                  helperText={error?.slumKey ? error.slumKey.message : null}
                />
              </Grid>

              {/* Area */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="area" />}
                  variant="standard"
                  value={watch("areaKey")}
                  InputLabelProps={{
                    shrink: watch("areaKey") ? true : false,
                  }}
                  error={!!error.areaKey}
                  helperText={error?.areaKey ? error.areaKey.message : null}
                />
              </Grid>

              {/* Village */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="village" />}
                  variant="standard"
                  value={watch("villageKey")}
                  InputLabelProps={{
                    shrink: watch("villageKey") ? true : false,
                  }}
                  error={!!error.villageKey}
                  helperText={
                    error?.villageKey ? error.villageKey.message : null
                  }
                />
              </Grid>

              {/* pincode */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="pincode" />}
                  variant="standard"
                  value={watch("pincode")}
                  InputLabelProps={{
                    shrink: watch("pincode") ? true : false,
                  }}
                  error={!!error.pincode}
                  helperText={error?.pincode ? error.pincode.message : null}
                />
              </Grid>

              {/* Lattitude */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lattitude" />}
                  variant="standard"
                  value={watch("lattitude")}
                  InputLabelProps={{
                    shrink: watch("lattitude") ? true : false,
                  }}
                  error={!!error.lattitude}
                  helperText={error?.lattitude ? error.lattitude.message : null}
                />
              </Grid>

              {/* Longitude */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="longitude" />}
                  variant="standard"
                  value={watch("longitude")}
                  InputLabelProps={{
                    shrink: watch("longitude") ? true : false,
                  }}
                  error={!!error.longitude}
                  helperText={error?.longitude ? error.longitude.message : null}
                />
              </Grid>
            </Grid>

            {/********* Spouse Information *********/}

            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="spouseDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={1} sx={{ padding: "10px" }}>
              {/* Spouse Title */}

              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="title" />}
                  variant="standard"
                  value={watch("spouseTitle")}
                  InputLabelProps={{
                    shrink: watch("spouseTitle") ? true : false,
                  }}
                  error={!!error.spouseTitle}
                  helperText={
                    error?.spouseTitle ? error.spouseTitle.message : null
                  }
                />
              </Grid>

              {/* Spouse firstName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseFirstName") != ""}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  {...register("spouseFirstName")}
                  InputLabelProps={{
                    shrink: watch("spouseFirstName") ? true : false,
                  }}
                  error={!!error.spouseFirstName}
                  helperText={
                    error?.spouseFirstName
                      ? error.spouseFirstName.message
                      : null
                  }
                />
              </Grid>

              {/* Spouse middleName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseMiddleName") != ""}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  {...register("spouseMiddleName")}
                  InputLabelProps={{
                    shrink: watch("spouseMiddleName") ? true : false,
                  }}
                  error={!!error.spouseMiddleName}
                  helperText={
                    error?.spouseMiddleName
                      ? error.spouseMiddleName.message
                      : null
                  }
                />
              </Grid>

              {/* Spouse lastName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseLastName") != ""}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lastNameEn" />}
                  variant="standard"
                  {...register("spouseLastName")}
                  InputLabelProps={{
                    shrink: watch("spouseLastName") ? true : false,
                  }}
                  error={!!error.spouseLastName}
                  helperText={
                    error?.spouseLastName ? error.spouseLastName.message : null
                  }
                />
              </Grid>

              {/* Spouse mobileNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseMobileNo")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  {...register("spouseMobileNo")}
                  InputLabelProps={{
                    shrink: watch("spouseMobileNo") ? true : false,
                  }}
                  error={!!error.spouseMobileNo}
                  helperText={
                    error?.spouseMobileNo ? error.spouseMobileNo.message : null
                  }
                />
              </Grid>

              {/* Spouse aadharNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseAadharNo")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="aadharNo" />}
                  variant="standard"
                  {...register("spouseAadharNo")}
                  InputLabelProps={{
                    shrink: watch("spouseAadharNo") ? true : false,
                  }}
                  error={!!error.spouseAadharNo}
                  helperText={
                    error?.spouseAadharNo ? error.spouseAadharNo.message : null
                  }
                />
              </Grid>

              {/* Spouse email */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseEmail")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="email" />}
                  variant="standard"
                  {...register("spouseEmail")}
                  InputLabelProps={{
                    shrink: watch("spouseEmail") ? true : false,
                  }}
                  error={!!error.spouseEmail}
                  helperText={
                    error?.spouseEmail ? error.spouseEmail.message : null
                  }
                />
              </Grid>

              {/* Spouse age */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseAge")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="age" />}
                  variant="standard"
                  {...register("spouseAge")}
                  InputLabelProps={{
                    shrink: watch("spouseAge") ? true : false,
                  }}
                  error={!!error.spouseAge}
                  helperText={error?.spouseAge ? error.spouseAge.message : null}
                />
              </Grid>

              {/* Spouse occupation */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseOccupation")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="occupation" />}
                  variant="standard"
                  {...register("spouseOccupation")}
                  InputLabelProps={{
                    shrink: watch("spouseOccupation") ? true : false,
                  }}
                  error={!!error.spouseOccupation}
                  helperText={
                    error?.spouseOccupation
                      ? error.spouseOccupation.message
                      : null
                  }
                />
              </Grid>

              {/* Spouse relation */}

              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="relation" />}
                  variant="standard"
                  value={watch("spouseRelation")}
                  InputLabelProps={{
                    shrink: watch("spouseRelation") ? true : false,
                  }}
                  error={!!error.spouseRelation}
                  helperText={
                    error?.spouseRelation ? error.spouseRelation.message : null
                  }
                />
              </Grid>
            </Grid>

            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="remarks" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* site visit remark */}
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  multiline
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="siteVisitRemark" />}
                  // @ts-ignore
                  variant="standard"
                  value={watch("siteVisitRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("siteVisitRemark")
                        ? true
                        : false,
                  }}
                  error={!!error.siteVisitRemark}
                  helperText={
                    error?.siteVisitRemark
                      ? error.siteVisitRemark.message
                      : null
                  }
                />
              </Grid>

              {/* clerk remark */}
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  multiline
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="clerkApprovalRemark" />}
                  // @ts-ignore
                  variant="standard"
                  value={watch("clerkApprovalRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("clerkApprovalRemark")
                        ? true
                        : false,
                  }}
                  error={!!error.clerkApprovalRemark}
                  helperText={
                    error?.clerkApprovalRemark
                      ? error.clerkApprovalRemark.message
                      : null
                  }
                />
              </Grid>

              {/* headClerkApprovalRemark */}
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  multiline
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="headClerkApprovalRemark" />}
                  // @ts-ignore
                  variant="standard"
                  value={watch("headClerkApprovalRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("headClerkApprovalRemark")
                        ? true
                        : false,
                  }}
                  error={!!error.headClerkApprovalRemark}
                  helperText={
                    error?.headClerkApprovalRemark
                      ? error.headClerkApprovalRemark.message
                      : null
                  }
                />
              </Grid>

              {/* officeSuperintendantApprovalRemark */}
              {/* <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="officeSuperintendantApprovalRemark" />}
                // @ts-ignore
                variant="outlined"
                value={watch("officeSuperintendantApprovalRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("officeSuperintendantApprovalRemark") ? true : false,
                }}
                error={!!error.officeSuperintendantApprovalRemark}
                helperText={
                  error?.officeSuperintendantApprovalRemark
                    ? error.officeSuperintendantApprovalRemark.message
                    : null
                }
              />
            </Grid> */}

              {/* administrativeOfficerApprovalRemark */}
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  multiline
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={
                    <FormattedLabel id="administrativeOfficerApprovalRemark" />
                  }
                  // @ts-ignore
                  variant="standard"
                  value={watch("administrativeOfficerApprovalRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id ||
                      watch("administrativeOfficerApprovalRemark")
                        ? true
                        : false,
                  }}
                  error={!!error.administrativeOfficerApprovalRemark}
                  helperText={
                    error?.administrativeOfficerApprovalRemark
                      ? error.administrativeOfficerApprovalRemark.message
                      : null
                  }
                />
              </Grid>

              {/* assistantCommissionerApprovalRemark */}
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  multiline
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={
                    <FormattedLabel id="assistantCommissionerApprovalRemark" />
                  }
                  // @ts-ignore
                  variant="standard"
                  value={watch("assistantCommissionerApprovalRemark")}
                  InputLabelProps={{
                    shrink:
                      router.query.id ||
                      watch("assistantCommissionerApprovalRemark")
                        ? true
                        : false,
                  }}
                  error={!!error.assistantCommissionerApprovalRemark}
                  helperText={
                    error?.assistantCommissionerApprovalRemark
                      ? error.assistantCommissionerApprovalRemark.message
                      : null
                  }
                />
              </Grid>
            </Grid>

            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="attachInspectionImages" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xs={12}>
                <DataGrid
                  autoHeight
                  sx={{
                    padding: "10px",
                    overflowY: "scroll",
                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  density="standard"
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  rows={finalFiles}
                  columns={_columns}
                />
              </Grid>
            </Grid>

            {/* <Box
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                paddingTop: "10px",
                // backgroundColor:'#0E4C92'
                // backgroundColor:'		#0F52BA'
                // backgroundColor:'		#0F52BA'
                background:
                  "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              <h2>
                <FormattedLabel id="generateReports" />
              </h2>
            </Box> */}

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Generate Inspection Report */}
              {/* <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}></Grid>
                <Grid item xl={9} lg={9} md={6} sm={6} xs={12}>
                  <label>
                    <b>
                      <FormattedLabel id="generatedInspectionReport" />
                    </b>
                  </label>
                </Grid>

                <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
                  <Button color="primary" variant="contained" size="samll">
                    <FormattedLabel id="download" />
                  </Button>
                </Grid>
              </Grid> */}

              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  {" "}
                  <Button
                    color="success"
                    size="samll"
                    variant="contained"
                    onClick={() => {
                      dataSource && handleOpen();
                    }}
                    endIcon={<Save />}
                  >
                    <FormattedLabel id="downloadPhotopass" />
                  </Button>
                </Grid>

                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    size="samll"
                    color="error"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      if(loggedInUser==='citizenUser'){
                        router.push("/dashboard");
                      }else if(loggedInUser==='cfcUser'){
                        router.push("/CFC_Dashboard");
                      }else {
                        router.push(
                          `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
                        );
                      }
                    }}
                  >
                    <FormattedLabel id="exit" />
                    {/* {labels["exit"]} */}
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* View Demand Letter */}
            <div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  {dataSource && (
                    <Photopass
                      connectionData={hutData}
                      ownership={ownership}
                      usageType={usageType}
                      slumName={slumName}
                      husbandWifeCombinedPhoto={photo?.documentPath}
                      handleClose={handleClose}
                      villageName={villageName}
                      componentRef={componentRef1}
                    />
                  )}
                </Box>
              </Modal>
            </div>
          </form>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
