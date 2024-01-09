import React, { useEffect, useState, useRef } from "react";
import router from "next/router";
import {
  Paper,
  Button,
  TextField,
  Modal,
  IconButton,
  Box,
  ThemeProvider,
  Grid,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import theme from "../../../../../theme";
import sweetAlert from "sweetalert";
import { useForm } from "react-hook-form";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import ViewNocApplicationDetails from "../viewNocApprovalDetails";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { ExitToApp } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import SaveIcon from "@mui/icons-material/Save";
import urls from "../../../../../URLS/urls";
import { manageStatus } from "../../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import { ToWords } from "to-words";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Save } from "@mui/icons-material";
import Noc from "../generateDocuments/noc";
import { DecryptData,EncryptData } from "../../../../../components/common/EncryptDecrypt";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";
const Index = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
  });
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  const toWordsEn = new ToWords({ localeCode: "en-IN" });
  const toWordsMr = new ToWords({ localeCode: "mr-IN" });
  const toWords = language == "en" ? toWordsEn : toWordsMr;
  const [hutKey, setHutkeyVal] = useState(null);
  const [statusAll, setStatus] = useState(null);
  const [appliNo, setApplicationNo] = useState();
  const [photo, setPhoto] = useState([]);
  const [dataSource, setDataSource] = useState({});
  const [currentStatus1, setCurrentStatus] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [statusVal, setStatusVal] = useState(null);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const [totalInWords, setTotalInWords] = useState(0);
  const [slumData, setSlumData] = useState([]);
  const [slumName, setSlumName] = useState("");
  const [areaData, setAreaData] = useState([]);
  const [villlageData, setVillageData] = useState([]);
  const [villageName, setVillageName] = useState("");
  const [docList, setDocList] = useState([]);
  const [requiredUploadDoc, setRequiredUploadDoc] = useState(null);
  const [requiredUploadDoc1, setRequiredUploadDoc1] = useState(null);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [hutOwnerData, setHutOwnerData] = useState(null);
  const [hutData, setHutData] = useState([]);
  const [usageType, setUsageType] = useState([]);
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
  const handleTotalAmountChange = (event) => {
    const totalAmountValue = event.target.value;
    const totalAmountNumber = parseFloat(totalAmountValue);
    const amountToConvert = isNaN(totalAmountNumber) ? 0 : totalAmountNumber;
    const words = toWords.convert(amountToConvert);
    setTotalInWords(words);
  };

  const handleCancel = () => {
    setIsModalOpenForResolved(false);
  };

  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
    documentTitle:language==='en'?'Download Identity Card for Hut owner':'झोपडी मालकाचे ओळखपत्र डाउनलोड करा'
  });

  // document columns
  const docColumns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      getNocDataById();
  }, [router.query.id]);

  useEffect(() => {
    if (hutKey != null) getHutByHutkey();
  }, [hutKey]);

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
      .catch((error) => {
        console.log("CatchPreviewApi", error);
      });
  };

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

  const getHutByHutkey = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${hutKey}`, {
        headers: headers,
      })
      .then((r) => {
        setHutData(r.data);
        let res = r.data.mstHutMembersList.find(
          (obj) => obj.headOfFamily === "Y"
        );
        setHutOwnerData(res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (hutData.length != 0 && hutData?.usageTypeKey!=undefined) {
      getUsageType();
    }
  }, [hutData?.usageTypeKey]);

  useEffect(() => {
    if (hutOwnerData != null) {
      let res = hutOwnerData;
      setValue(
        "ownerTitle",
        !res?.title
          ? "-"
          : language == "en"
          ? titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.title)?.titleEn
          : titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.title)?.titleMr
      );
      setValue(
        "ownerFirstName",
        !res?.firstName
          ? "-"
          : language == "en"
          ? res?.firstName
          : res?.firstNameMr
      );
      setValue(
        "ownerMiddleName",
        !res?.middleName
          ? "-"
          : language == "en"
          ? res?.middleName
          : res?.middleNameMr
      );
      setValue(
        "ownerLastName",
        !res?.lastName
          ? "-"
          : language == "en"
          ? res?.lastName
          : res?.lastNameMr
      );
      setValue("ownerMobileNo", res?.mobileNo ? res?.mobileNo : "-");
      setValue("ownerAadharNo", res?.aadharNo ? res?.aadharNo : "-");
    }
  }, [hutOwnerData, language, titleDropDown]);

  const getUsageType = () => {
    axios
      .get(
        `${urls.SLUMURL}/mstSbUsageType/getById?id=${hutData?.usageTypeKey}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let res = r.data;
        // let res =
        //   result && result.find((obj) => obj.id == hutData?.usageTypeKey);

        setUsageType(res?.usageTypeMr);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getNocDataById = () => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/trnIssueNoc/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data;
        setDataSource(result);
        setValue("visitTime", result?.trnVisitScheduleList[0]?.visitTime);
        setValue(
          "scheduledTime",
          result?.trnVisitScheduleList[0]?.scheduledDate
        );
        setValue("slongitude", result?.trnVisitScheduleList[0]?.longitude);
        setValue("slattitude", result?.trnVisitScheduleList[0]?.lattitude);
        setValue("remarks", result?.trnVisitScheduleList[0]?.remarks);
        setValue("geocode", result?.trnVisitScheduleList[0]?.geocode);
        const extractedData = result?.transactionDocumentsList?.map(
          ({ id, documentKey, documentType, documentPath, remark }) => ({
            id,
            documentKey,
            documentType,
            documentPath,
            remark,
          })
        );
        setRequiredUploadDoc1(extractedData);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    getTitleData();
    getAllStatus();
    getServiceCharges();
    getSlumData();
    getAreaData();
    getVillageData();
    getRequiredDocs();
  }, []);

  const getRequiredDocs = () => {
    axios
      .get(
        `${urls.CFCURL}/master/documentMaster/getDocumentByService?serviceId=129`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let temp = r.data.documentMaster;
        setRequiredUploadDoc(temp);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (dataSource != null) {
      setDataOnForm();
    }
  }, [dataSource, language, areaData, titleDropDown]);

  const setDataOnForm = () => {
    let res = dataSource;
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    setStatusVal(res.status);
    setHutkeyVal(res?.hutKey);
    setValue("hutNo", res ? res?.hutNo : "-");
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    let villageData1 =
      villlageData &&
      villlageData.find((obj) => obj.id == res?.villageKey)?.villageNameMr;
    setVillageName(villageData1);
    const slumName1 =
      slumData && slumData.find((obj) => obj.id == res?.slumKey)?.slumNameMr;
    setSlumName(slumName1);
    setValue(
      "slumTaxesAmount",
      res?.outstandingTax == null ? "0" : res?.outstandingTax
    );
    setValue(
      "applicantFirstName",
      res
        ? language == "en"
          ? res?.applicantFirstName
          : res?.applicantFirstNameMr
        : "-"
    );
    setValue(
      "applicantMiddleName",
      res
        ? language == "en"
          ? res?.applicantMiddleName
          : res?.applicantMiddleNameMr
        : "-"
    );
    setValue(
      "applicantLastName",
      res
        ? language == "en"
          ? res?.applicantLastName
          : res?.applicantLastNameMr
        : "-"
    );
    setValue("applicantMobileNo", res ? res?.applicantMobileNo : "-");
    setValue("applicantEmailId", res ? res?.applicantEmailId : "-");
    setValue("applicantAadharNo", res ? res?.applicantAadharNo : "-");
    setValue("noOfCopies", res ? res?.noOfCopies : "-");
    setValue("feesApplicable", res.feesApplicable);
    setValue("asOnDate", res.asOnDate);
    setApplicationNo(res?.applicationNo);
    setCurrentStatus(manageStatus(res.status, language, statusAll));
    let applicantPhoto = [];
    if (res.applicantPhoto != null) {
      applicantPhoto.push({
        id: 1,
        filenm:DecryptData("passphraseaaaaaaaaupload", res.applicantPhoto).split("/").pop().split("_").pop(),
        documentPath: res.applicantPhoto,
        documentType:DecryptData("passphraseaaaaaaaaupload", res.applicantPhoto).split(".").pop().toUpperCase(),
      });
    }
    setPhoto(applicantPhoto);
    setValue(
      "applicantTitle",
      language == "en"
        ? titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleEn
        : titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleMr
    );
    setValue(
      "slumKey",
      language === "en"
        ? slumData && slumData.find((obj) => obj.id == res?.slumKey)?.slumName
        : slumData && slumData.find((obj) => obj.id == res?.slumKey)?.slumNameMr
    );
    setValue(
      "areaKey",
      language === "en"
        ? areaData && areaData.find((obj) => obj.id == res?.areaKey)?.areaName
        : areaData && areaData.find((obj) => obj.id == res?.areaKey)?.areaNameMr
    );
    setValue(
      "villageKey",
      language === "en"
        ? villlageData &&
            villlageData.find((obj) => obj.id == res?.villageKey)?.villageName
        : villlageData &&
            villlageData.find((obj) => obj.id == res?.villageKey)?.villageNameMr
    );
  };

  useEffect(() => {
    if (router.query.id) {
      setDocList(
        requiredUploadDoc1?.map((row, i) => ({
          srNo: i + 1,
          id: row.id,
          documentChecklistEn:
            requiredUploadDoc &&
            requiredUploadDoc.find((obj) => obj.id === row.documentKey)
              ?.documentChecklistEn,
          documentChecklistMr:
            requiredUploadDoc &&
            requiredUploadDoc.find((obj) => obj.id === row.documentKey)
              ?.documentChecklistMr,
          typeOfDocument: row.typeOfDocument,
          service: row.service,
          documentPath: row.documentPath,
          activeFlag: row.activeFlag,
          documentKey: row.documentKey,
          activeFlag: "Y",
          application: row.application,
        }))
      );
    } else {
      setDocList(
        requiredUploadDoc?.map((row, i) => ({
          srNo: i + 1,
          id: row.id,
          documentChecklistEn: row.documentChecklistEn,
          documentChecklistMr: row.documentChecklistMr,
          typeOfDocument: row.typeOfDocument,
          service: row.service,
          documentPath: row.documentPath,
          documentKey: row.documentKey,
          activeFlag: row.activeFlag,
          application: row.application,
        }))
      );
    }
  }, [requiredUploadDoc, requiredUploadDoc1]);

  const getTitleData = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.title;
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

  const getVillageData = () => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        setVillageData(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getSlumData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        setSlumData(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAreaData = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.area;
        setAreaData(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const getServiceCharges = () => {
    axios
      .get(
        `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=123`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let temp = r.data.serviceCharge[0];
        setValue("serviceAmount", temp?.amount);
        setValue("totalAmount", temp?.amount);
        setValue(
          "chargeName",
          temp?.chargeName === null ? "-" : temp?.chargeName
        );
        setTotalInWords(toWords.convert(temp?.amount));
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    if (formData === "Save") {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/issuanceOfNoc/ScheduleSiteVisitCompo",
        query: {
          id: router.query.id,
        },
      });
    } else {
      let payload = {
        ...dataSource,
        isApproved: false,
        isComplete: false,
        id: dataSource?.id,
        hutKey: hutKey,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnIssueNoc/save`, payload, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert({
              title: language == "en" ? "Revert!" : "पूर्वस्थितीवर येणे",
              text:
                language == "en"
                  ? `Noc against ${dataSource.applicationNo} Revert Back successfully !`
                  : `विरुद्ध एन.ओ.सी ${dataSource.applicationNo} यशस्वीरित्या परत या!`,
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            }).then((will) => {
              if (will) {
                router.push(
                  "/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails"
                );
              }
            });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

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

  const handleLOIButton = () => {
    let formData = {
      referenceKey: dataSource?.id,
      title: dataSource?.applicantTitle,
      middleName: dataSource?.applicantMiddleName,
      firstName: dataSource?.applicantFirstName,
      lastName: dataSource?.applicantLastName,
      mobileNo: dataSource?.applicantMobileNo,
    };
    setIsModalOpenForResolved(false);
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnLoi/trnIssuesNoc/save`, formData, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Generated!" : "उत्पन्न!",
            text:
              language === "en"
                ? `LOI payment against ${dataSource.applicationNo} generated Successfully !`
                : `उद्देशीय पत्र पेमेंट ${dataSource.applicationNo} यशस्वीरित्या उत्पन्न केले!`,
            icon: "success",
          }).then((will) => {
            if (will) {
              router.push({
                pathname:
                  "/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails",
                query: {
                  id: router.query.id,
                },
              });
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const attachFileColumns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },

    //File Name
    {
      headerClassName: "cellColor",
      field: "documentChecklistMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="fileName" />,
      flex: 1,
    },
    {
      field: "attachedDoc1",
      headerName: <FormattedLabel id="attachment" />,
      width: 200,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              color="primary"
              onClick={() => {
                getFilePreview(params?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];
  return (
    <>
      {isLoading && <CommonLoader />}
      <ThemeProvider theme={theme}>
        <>
          <BreadcrumbComponent />
        </>
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
          <form onSubmit={handleSubmit(handleOnSubmit)}>
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
                    <FormattedLabel id="issuanceOfNoc" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            {/* Current status and application No */}
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                sx={{
                  "@media (max-width: 390px)": {
                    display: "grid",
                  },
                }}
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <FormattedLabel id="applicationNo" /> :
                </label>
                <label
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {appliNo}
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                sx={{
                  "@media (max-width: 390px)": {
                    display: "grid",
                  },
                }}
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <FormattedLabel id="currentStatus" /> :
                </label>
                <label
                  style={{
                    fontSize: "18px",
                    gap: 3,
                  }}
                >
                  {currentStatus1}
                </label>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* owner Title */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="title" required />}
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
                  label={<FormattedLabel id="firstName" required />}
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
                  label={<FormattedLabel id="middleName" required />}
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
                  label={<FormattedLabel id="lastName" required />}
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
                  label={<FormattedLabel id="mobileNo" required />}
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
                  label={<FormattedLabel id="aadharNo" required />}
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

              {/* Slum Name */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="slumName" required />}
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
                  label={<FormattedLabel id="area" required />}
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
                  label={<FormattedLabel id="village" required />}
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
                  label={<FormattedLabel id="pincode" required />}
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
                  label={<FormattedLabel id="lattitude" required />}
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
                  label={<FormattedLabel id="longitude" required />}
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

            <>
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
                      <FormattedLabel id="rquiredAttachFile" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>

              <Grid
                container
                spacing={2}
                sx={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DataGrid
                  getRowId={(row) => row.id}
                  autoHeight
                  sx={{
                    margin: "10px",
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
                  rows={docList || []}
                  columns={attachFileColumns}
                  pageSize={6}
                />
              </Grid>
            </>

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
                    <FormattedLabel id="applicantInfo" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="title" />}
                  variant="standard"
                  value={watch("applicantTitle")}
                  InputLabelProps={{
                    shrink: watch("applicantTitle") ? true : false,
                  }}
                  error={!!error.applicantTitle}
                  helperText={
                    error?.applicantTitle ? error.applicantTitle.message : null
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
                  value={watch("applicantFirstName")}
                  InputLabelProps={{
                    shrink: watch("applicantFirstName") ? true : false,
                  }}
                  error={!!error.applicantFirstName}
                  helperText={
                    error?.applicantFirstName
                      ? error.applicantFirstName.message
                      : null
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
                  value={watch("applicantMiddleName")}
                  InputLabelProps={{
                    shrink: watch("applicantMiddleName") ? true : false,
                  }}
                  error={!!error.applicantMiddleName}
                  helperText={
                    error?.applicantMiddleName
                      ? error.applicantMiddleName.message
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
                  value={watch("applicantLastName")}
                  InputLabelProps={{
                    shrink: watch("applicantLastName") ? true : false,
                  }}
                  error={!!error.applicantLastName}
                  helperText={
                    error?.applicantLastName
                      ? error.applicantLastName.message
                      : null
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
                  value={watch("applicantMobileNo")}
                  InputLabelProps={{
                    shrink: watch("applicantMobileNo") ? true : false,
                  }}
                  error={!!error.applicantMobileNo}
                  helperText={
                    error?.applicantMobileNo
                      ? error.applicantMobileNo.message
                      : null
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
                  value={watch("applicantAadharNo")}
                  InputLabelProps={{
                    shrink: watch("applicantAadharNo") ? true : false,
                  }}
                  error={!!error.applicantAadharNo}
                  helperText={
                    error?.applicantAadharNo
                      ? error.applicantAadharNo.message
                      : null
                  }
                />
              </Grid>
            </Grid>
            {photo.length != 0 && (
              <Grid
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
                  rows={photo}
                  columns={docColumns}
                  pageSize={6}
                />
              </Grid>
            )}
          </form>

          {(statusVal === 14 ||
            statusVal === 5 ||
            statusVal === 1 ||
            statusVal === 3 ||
            statusVal === 13 ||
            statusVal === 7 ||
            statusVal === 9 ||
            statusVal === 11 ||
            statusVal === 21 ||
            statusVal === 26 ||
            statusVal === 27 ||
            statusVal === 17 ||
            statusVal === 29) && (
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <ViewNocApplicationDetails data={dataSource} />
            </Grid>
          )}
          {statusVal === 17 && (
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              {/* <DownloadNoc id={router.query.id} /> */}

              <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>
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
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      if(loggedInUser==='citizenUser'){
                        router.push("/dashboard");
                      }else if(loggedInUser==='cfcUser'){
                        router.push("/CFC_Dashboard");
                      } else {
                        router.push(
                          `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`
                        );
                      }
                    }}
                  >
                    <FormattedLabel id="exit" />
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
                    marginTop: "20px",
                  }}
                >
                  <Button
                    color="success"
                    size="small"
                    variant="contained"
                    onClick={() => {
                      dataSource && handleGenerateButton1();
                    }}
                    endIcon={<Save />}
                  >
                    <FormattedLabel id="downloadNoc" />
                  </Button>
                </Grid>
              </Grid>

              <Paper style={{ display: "none" }}>
                {dataSource && (
                  <Noc
                    connectionData={hutData}
                    ownership={hutOwnerData}
                    usageType={usageType}
                    slumName={slumName}
                    villageName={villageName}
                    componentRef={componentRef1}
                  />
                )}
              </Paper>
            </Grid>
          )}

          {loggedInUser === "citizenUser" && (
            <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>
              {dataSource?.status == 0 && loggedInUser === "citizenUser" && (
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
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      if(loggedInUser==='citizenUser'){
                        router.push("/dashboard");
                      }else if(loggedInUser==='cfcUser'){
                        router.push("/CFC_Dashboard");
                      }else {
                        router.push(
                          `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`
                        );
                      }
                    }}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Paper>
      </ThemeProvider>

      <Modal
        title="Modal For LOI"
        open={isModalOpenForResolved}
        onOk={true}
        onClose={handleCancel} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
        footer=""
        style={{
          maxheight: "40%",
          margin: "50px",
        }}
      >
        <Box
          sx={{
            overflowY: "scroll",
            backgroundColor: "white",
            height: "60vh",
          }}
        >
          <>
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
                    <FormattedLabel id="loiGenerate" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <form>
              <Grid container spacing={3} sx={{ padding: "2rem" }}>
                {/* Service Name */}
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    label={<FormattedLabel id="serviceName" />}
                    multiline
                    variant="standard"
                    value={"Issuance NOC Service charges"}
                  />
                </Grid>
                {/* Application Number */}
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="standard-textarea"
                    label={<FormattedLabel id="applicationNo" />}
                    multiline
                    variant="standard"
                    value={appliNo}
                  />
                </Grid>

                {/* Applicant Title */}
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    disabled={true}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    label={<FormattedLabel id="title" />}
                    variant="standard"
                    value={watch("applicantTitle")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* Applicant Name */}
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    label={<FormattedLabel id="applicantName" />}
                    multiline
                    variant="standard"
                    value={
                      watch("applicantFirstName") +
                      " " +
                      watch("applicantMiddleName") +
                      " " +
                      watch("applicantLastName")
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
                    value={watch("applicantMobileNo")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {/* EmailId */}
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    disabled={true}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    label={<FormattedLabel id="emailId" />}
                    variant="standard"
                    value={watch("applicantEmailId")}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                      <FormattedLabel id="chargesDetails" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={2} sx={{ padding: "2rem" }}>
                {/* Name of charge */}
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    label={<FormattedLabel id="chargeName" />}
                    {...register("chargeName")}
                    variant="standard"
                    value={watch("chargeName")}
                  />
                </Grid>

                {/* loi Genrate */}
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    disabled={true}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    label={<FormattedLabel id="serviceCharges" required />}
                    {...register("serviceAmount")}
                    variant="standard"
                  />
                </Grid>

                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    label={<FormattedLabel id="totalAmount" required />}
                    id="standard-textarea"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    variant="standard"
                    {...register("totalAmount")}
                    onChange={handleTotalAmountChange}
                    error={!!error.totalAmount}
                    helperText={
                      error?.totalAmount ? error.totalAmount.message : null
                    }
                  />
                </Grid>
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                  <TextField
                    label="Total Amount in Words"
                    id={<FormattedLabel id="totalInWords" />}
                    disabled
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    variant="standard"
                    value={totalInWords}
                  />
                </Grid>

                <Grid container spacing={2} sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={handleLOIButton}
                      variant="contained"
                      color="primary"
                      endIcon={<SaveIcon />}
                    >
                      <FormattedLabel id="loiGenerate" />
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ClearIcon />}
                      onClick={() => handleCancel()}
                    >
                      <FormattedLabel id="close" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </>
        </Box>
      </Modal>
    </>
  );
};

export default Index;
