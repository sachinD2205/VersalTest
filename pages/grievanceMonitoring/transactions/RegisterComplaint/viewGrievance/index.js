import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DocumentUploadTableSachinCss from "../../../../../containers/reuseableComponents/DocumentUploadTableSachin/DocumentUploadTableSachin.module.css";
import { DataGrid } from "@mui/x-data-grid";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import { Visibility } from "@mui/icons-material";
import { EncryptData,DecryptData } from "../../../../../components/common/EncryptDecrypt";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import { removeDocumentToLocalStorage } from "../../../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import DocumentUploadTableSachin from "../../../../../containers/reuseableComponents/DocumentUploadTableSachin";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import Schema from "../../../../../containers/schema/grievanceMonitoring/TransactionsSchema's/viewGrievance";
import theme from "../../../../../theme";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
// view
const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const language = useSelector((state) => state?.labels?.language);
  const logedInUser = localStorage.getItem("loggedInUser");
  const [fullName, setFullName] = useState(null);
  const [grievanceIdd, setGrievanceIdd] = useState(null);
  const [OfficeLocationName, setOfficeLocationName] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [villages, setVillages] = useState([]);
  let dataObject = null;
  const [isLoading, setIsLoading] = useState(false);
  const [fetchdata, setFetchData] = useState(null);
  let user = useSelector((state) => state.user.user);
  const [statusText, setStatusText] = useState("");
  const [isDashboard, setIsDeptUser] = useState("true");
  const [applicationNoRouter, setApplicationNo] = useState();
  const [document, setDocument] = useState([]);
  const [deptDoc, setDeptDoc] = useState([]);
  const [isClosed, setIsReopen] = useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };
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

  // getAllZones
  const getAllZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res?.data?.zone?.map((r, i) => ({
          id: r.id,
          zoneName: r.zoneName,
          zoneNameMr: r.zoneNameMr,
        }));
        setAllZones(data.sort(sortByProperty("zoneName")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };
  const checkCondition = () => {
    if (
      (logedInUser === "citizenUser" || logedInUser === "cfcUser") &&
      (statusText === "Close" ||
        statusText === "Close " ||
        statusText === "close " ||
        statusText === "Close") &&
      isClosed
    ) {
      return true;
    } else if (
      isDashboard === "false" &&
      logedInUser === "departmentUser" &&
      (statusText === "open" ||
        statusText === "Open" ||
        statusText === "open " ||
        statusText === "Open ")
    ) {
      return true;
    } else {
      return false;
    }
  };

useEffect(()=>{
console.log('isDashboard ', isDashboard)

},[isDashboard])
  // getAllWards
  const getAllWards = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res?.data?.ward?.map((r, i) => ({
          id: r.id,
          wardName: r.wardName,
          wardNameMr: r.wardNameMr,
        }));
        setAllWards(data.sort(sortByProperty("wardName")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // getVillages
  const getVillages = () => {
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res?.data?.village?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          villageNameEn: r.villageName,
          villageNameMr: r.villageNameMr,
        }));
        setVillages(data.sort(sortByProperty("villageNameEn")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // gettOfficeLocation
  const gettOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: headers,
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data?.officeLocation != null &&
            res?.data?.officeLocation != undefined &&
            res?.data?.officeLocation.length != 0
          ) {
            let data = res?.data?.officeLocation?.map((r, i) => ({
              id: r?.id,
              officeLocationName: r?.officeLocationName,
              officeLocationNameMar: r?.officeLocationNameMar,
            }));
            setOfficeLocationName(
              data.sort(sortByProperty("officeLocationName"))
            );
          } else {
          }
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  // getAllAmenities
  const getAllAmenities = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.GM
        }/trnRegisterComplaint/getByApplicationId?applicationNo=${router?.query?.id?.replaceAll(
          "+",
          "%2b"
        )}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        if (res?.status === 200 || res?.status === 201) {
          let result = res?.data;
          setFetchData(result);
        } else {
          sweetAlert(
            language == "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
            { button: language == "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (fetchdata != null) setDataonUi();
  }, [fetchdata, language]);

  let setDataonUi = () => {
    const result = fetchdata;
    setValue(
      "grievanceRaiseDate",
      logedInUser === "departmentUser"
        ? moment(result.createDtTm).format("DD-MM-YYYY HH:mm:ss")
        : moment(result.createDtTm).format("DD-MM-YYYY")
    );
    setValue(
      "grievanceRaiseDate",
      logedInUser === "departmentUser"
        ? moment(result.createDtTm).format("DD-MM-YYYY HH:mm:ss")
        : moment(result.createDtTm).format("DD-MM-YYYY")
    );
    setValue("grievanceId", result.applicationNo);

    setStatusText(result.complaintStatusText);
    setIsReopen(result.isClosed);

    setValue(
      "complaintStatusText",
      result.reopenCount > 0 && result.complaintStatusText === "Open"
        ? language === "en"
          ? "Reopen"
          : "पुन्हा उघडले"
        : language === "en"
        ? result.complaintStatusText
        : result.complaintStatusTextMr
    );
    setValue("reply", result.reply);
    setValue("board", language === "en" ? result.location : result.locationMr);
    setValue("subject", result.subject);
    setValue(
      "complaintDescription",
      language === "en"
        ? result.complaintDescription
        : result.complaintDescriptionMr
    );
    setValue(
      "complaintType",
      language === "en" ? result.complaintType : result.complaintTypeMr
    );
    setValue("complaintSubType", result.complaintSubType);
    setValue(
      "deptName",
      language === "en" ? result.deptName : result.deptNameMr
    );
    setValue(
      "subDepartmentText",
      language === "en"
        ? result?.subDepartmentDao?.subDepartment
        : result?.subDepartmentDao?.subDepartmentMr
    );
    setValue("officeLocation", result?.officeLocation);
    setFullName(
      result.firstName + " " + result.middleName + " " + result.surname
    );
    setGrievanceIdd(result.id);
    setValue("zoneKey", result?.zoneKey);
    setValue("wardKey", result?.wardKey);
    setValue("subject", result?.subject);
    setValue("subjectMr", result?.subjectMr ? result?.subjectMr : "");
    setValue("complaintDescription", result?.complaintDescription);
    setValue(
      "complaintDescriptionMr",
      result?.complaintDescriptionMr ? result?.complaintDescriptionMr : ""
    );
    setValue("villageKey", result?.villageKey);
    setValue("citiRemark", result?.citiRemark);
    setValue("deptRemark", result?.deptRemark);
  };

  useEffect(() => {
    if (fetchdata != null) setDataImageonUi();
  }, [fetchdata]);

  let setDataImageonUi = () => {
    const result = fetchdata;
    let res = [];
    if (result?.trnAttacheDocumentDtos != 0) {
      result?.trnAttacheDocumentDtos?.map((obj, index) => {
        if (obj.transactionType === "ROC" || obj.transactionType === "RC") {
          return res.push({
            id: index + 1,
            originalFileName: obj.originalFileName,
            documentType: obj.documentType,
            filePath: obj.filePath,
            attachedDate1:
              logedInUser === "departmentUser"
                ? moment(obj.attachedDate).format("DD-MM-YYYY HH:mm:ss")
                : moment(obj.attachedDate).format("DD-MM-YYYY"),
            transactionType:
              obj.transactionType === "ROC" ? "Reopen" : "Register",
          });
        }
      });

      let res1 = [];
      result?.trnAttacheDocumentDtos?.map((obj, index) => {
        if (obj.transactionType === "CC") {
          return res1.push({
            id: index + 1,
            originalFileName: obj.originalFileName,
            documentType: obj.documentType,
            filePath: obj.filePath,
            attachedDate1:
              logedInUser === "departmentUser"
                ? moment(obj.attachedDate).format("DD-MM-YYYY HH:mm:ss")
                : moment(obj.attachedDate).format("DD-MM-YYYY"),
            transactionType: "Close",
          });
        }
      });
      setDeptDoc(res1);
      setDocument(res);
    } else {
      setDocument([]);
      setDeptDoc([]);
    }
  };

  const getFilePreview = (filePath) => {
    console.log("filePath", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    console.log('DecryptPhoto', DecryptPhoto)
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        console.log("Shvani", r);
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
        } else if (r?.data?.mimeType == "video/mp4") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
        <html>
          <body style="margin: 0;">
            <video width="100%" height="100%" controls>
              <source src="${dataUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </body>
        </html>
      `);
        } else if (r?.data?.mimeType == "audio/mpeg") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
  <html>
    <body style="margin: 0;">
      <audio controls>
        <source src="${dataUrl}" type="audio/mpeg">
        Your browser does not support the audio tag.
      </audio>
    </body>
  </html>
`);
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          console.log("dataUrl", dataUrl);
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

  const documentCol = [
    {
      field: "originalFileName",
      headerName: language == "en" ? "Original File Name" : "मूळ फाइल नाव",
      headerAlign: "center",
      align: "center",
      width: "250",
    },
    {
      field: "transactionType",
      headerName: language == "en" ? "Action" : "कृती",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "250",
    },
    {
      field: "documentType",
      headerName: language == "en" ? "File Type" : "दस्तऐवजाचा प्रकार",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "250",
    },
    {
      field: "attachedDate1",
      headerName:
        language == "en" ? "Document Attached Date" : "दस्तऐवज संलग्न तारीख",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "250",
    },
    {
      field: "Action",
      headerName: language == "en" ? "View" : "पहा",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "50",
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
                getFilePreview(record?.row?.filePath);
              }}
            >
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

  // onSubmitForm
  const onSubmitForm = (formData) => {
    let doc = [
      ...fetchdata.trnAttacheDocumentDtos,
      ...watch("documentUploadTable"),
    ];
    const finalBodyForApi = {
      id: grievanceIdd !== null ? grievanceIdd : "",
      remark: watch("reply"),
      trnAttacheDocumentDtos: doc,
    };

    sweetAlert({
      title: language == "en" ? "Are You Sure" : "तुम्हाला खात्री आहे",
      text:
        language === "en"
          ? "Do You Want To Close This Grievance?"
          : "तुम्हाला ही तक्रार बंद करायची आहे का?",
      icon: "warning",
      buttons: [
        language == "en" ? "Cancel" : "रद्द करा",
        language == "en" ? "Yes" : "होय",
      ],
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((willDelete) => {
      setIsLoading(true);
      if (willDelete) {
        axios
          .post(
            `${urls.GM}/trnRegisterComplaint/closeComplaint`,
            finalBodyForApi,
            {
              headers: headers,
            }
          )
          .then((res) => {
            setIsLoading(false);
            if (res.status == 200 || res.status == 201) {
              sweetAlert(
                language == "en" ? "Closed!" : "बंद!",
                language == "en"
                  ? "Grievance Closed Successfully !"
                  : "तक्रार यशस्वीरित्या बंद झाली!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  reset({
                    grievanceId: "",
                    grievanceRaiseDate: "",
                    currentStatus: "",
                    board: "",
                    subject: "",
                    complaintDescription: "",
                    reply: "",
                  });
                  removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                  {
                    logedInUser === "departmentUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/deptUserDashboard",
                      });
                  }
                  {
                    logedInUser === "citizenUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/citizenUserDashboard",
                      });
                  }
                  {
                    logedInUser === "cfcUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/cfcUserDashboard",
                      });
                  }
                } else {
                  reset({
                    grievanceId: "",
                    grievanceRaiseDate: "",
                    currentStatus: "",
                    board: "",
                    subject: "",
                    complaintDescription: "",
                    reply: "",
                  });
                  removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                  {
                    logedInUser === "departmentUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/deptUserDashboard",
                      });
                  }
                  {
                    logedInUser === "citizenUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/citizenUserDashboard",
                      });
                  }
                  {
                    logedInUser === "cfcUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/cfcUserDashboard",
                      });
                  }
                }
              });
            }
          })
          .catch((err) => {
            setIsLoading(false);
            cfcErrorCatchMethod(err, false);
          });
      } else {
        setIsLoading(false);
        sweetAlert(
          language === "en"
            ? "Your Grievance Is Not Closed"
            : "तुमची तक्रार बंद केली नाही",
          { button: language == "en" ? "Ok" : "ठीक आहे" }
        );
      }
    });
  };

  // handleReopenButton
  const handleReopenButton = () => {
    const finalBodyForApi = {
      id: grievanceIdd !== null ? grievanceIdd : "",
      remark: watch("remark"),
      trnAttacheDocumentDtos: watch("documentUploadTable"),
    };
    sweetAlert({
      title: language == "en" ? "Are You Sure?" : "तुम्हाला खात्री आहे?",
      text:
        language == "en"
          ? "Do You Want To Re-Open This Grievance?"
          : "तुम्हाला ही तक्रार पुन्हा उघडायची आहे का?",
      icon: "warning",
      buttons: [
        language == "en" ? "Cancel" : "रद्द करा",
        language == "en" ? "Yes" : "होय",
      ],
      dangerMode: true,
      closeOnClickOutside: false,
    }).then((willDelete) => {
      if (willDelete) {
        setIsLoading(true);
        axios
          .post(
            `${urls.GM}/trnRegisterComplaint/reopenComplaint`,
            finalBodyForApi,
            {
              headers: headers,
            }
          )
          .then((res) => {
            setIsLoading(false);
            if (res.status == 200 || res.status == 201) {
              sweetAlert({
                icon: "success",
                title: language == "en" ? "Re-Opened" : "पुन्हा उघडले",
                text:
                  language == "en"
                    ? "Grievance Re-Opened Successfully !"
                    : "तक्रार यशस्वीपणे पुन्हा उघडली!",

                dangerMode: false,
                closeOnClickOutside: false,
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will) => {
                if (will) {
                  reset({
                    grievanceId: "",
                    grievanceRaiseDate: "",
                    currentStatus: "",
                    board: "",
                    subject: "",
                    complaintDescription: "",
                    reply: "",
                  });
                  removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                  {
                    logedInUser === "departmentUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/deptUserDashboard",
                      });
                  }
                  {
                    logedInUser === "citizenUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/citizenUserDashboard",
                      });
                  }
                  {
                    logedInUser === "cfcUser" &&
                      router.push({
                        pathname:
                          "/grievanceMonitoring/dashboards/cfcUserDashboard",
                      });
                  }
                }
              });
            } else {
              sweetAlert(
                language === "en"
                  ? "Something Went Wrong!"
                  : "काहीतरी चूक झाली!",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              );
            }
          })
          .catch((err) => {
            setIsLoading(false);
            cfcErrorCatchMethod(err, false);
          });
      } else {
        sweetAlert(
          language == "en"
            ? "Your Grievance Is Not Re-Opened"
            : "तुमची तक्रार पुन्हा उघडली गेली नाही",
          { button: language == "en" ? "Ok" : "ठीक आहे" }
        );
      }
    });
  };

  useEffect(() => {
    getAllZones();
    getAllWards();
    getVillages();
    gettOfficeLocation();
    setValue("documentUploadSachinDeleteButtonInputState", true);
    setValue("disabledInputState", false);
  }, []);

  useEffect(() => {
    if (
      ((logedInUser === "citizenUser" || logedInUser === "cfcUser") &&
        (statusText === "close" || statusText === "Close")) ||
      statusText === "क्लोज"
    ) {
      setValue("documentUploadButtonSachinInputState", true);
    } else {
      setValue("documentUploadButtonSachinInputState", false);
    }
  });

  useEffect(() => {
    if (watch("grievanceRaiseDate")) {
      dataObject = {
        grievanceRaiseDate: watch("grievanceRaiseDate")
          ? watch("grievanceRaiseDate")
          : "",
        grievanceId: watch("grievanceId") ? watch("grievanceId") : "",
        complaintStatusText: watch("complaintStatusText")
          ? watch("complaintStatusText")
          : "",
        deptName: watch("deptName") ? watch("deptName") : "",
        subDepartmentText: watch("subDepartmentText")
          ? watch("subDepartmentText")
          : "",
        complaintType: watch("complaintType") ? watch("complaintType") : "",
        complaintSubType: watch("complaintSubType")
          ? watch("complaintSubType")
          : "",
        subject: watch("subject") ? watch("subject") : "",
        complaintDescription: watch("complaintDescription")
          ? watch("complaintDescription")
          : "",
        complaintRaisedBy: fullName !== null ? fullName : "",
      };
    }
  }, [watch("grievanceRaiseDate")]);

  useEffect(() => {
    setIsDeptUser(router.query.isDashboard===undefined?false:router.query.isDashboard);

    if (router.query.id != undefined && router.query.id != null)
    getAllAmenities();
  }, [router.query.id]);

  // view
  return (
    <>
      <>
        <ThemeProvider theme={theme}>
          {isLoading && <CommonLoader />}
          <div>
            <Paper
              elevation={8}
              variant="outlined"
              sx={{
                marginLeft: "10px",
                marginRight: "10px",
                marginTop: "10px",
                marginBottom: "60px",
                padding: 1,
              }}
            >
              <Box>
                <Grid
                  container
                  style={{
                    display: "flex",
                    alignItems: "center", // Center vertically
                    alignItems: "center",
                    width: "100%",
                    height: "auto",
                    overflow: "auto",
                    color: "white",
                    fontSize: "18.72px",
                    borderRadius: 100,
                    fontWeight: 500,
                    background:
                      "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
                  }}
                >
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
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="viewGrievance" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>

              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "1rem",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      {/** grievanceRaiseDate */}
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
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          style={{
                            backgroundColor: "white",
                          }}
                          InputLabelProps={{
                            shrink: watch("grievanceRaiseDate") ? true : false,
                          }}
                          id="outlined-basic"
                          label={<FormattedLabel id="grievanceRaiseDate" />}
                          variant="standard"
                          {...register("grievanceRaiseDate")}
                        />
                      </Grid>
                      {/** grievanceId */}
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
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          style={{
                            backgroundColor: "white",
                          }}
                          InputLabelProps={{
                            shrink: watch("grievanceId") ? true : false,
                          }}
                          id="outlined-basic"
                          label={
                            language === "en"
                              ? "Complaint Number"
                              : "तक्रार क्रमांक"
                          }
                          variant="standard"
                          {...register("grievanceId")}
                        />
                      </Grid>
                      {/**complaintStatusText */}
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
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          InputLabelProps={{
                            shrink: watch("complaintStatusText") ? true : false,
                          }}
                          label={<FormattedLabel id="complaintStatusText" />}
                          {...register("complaintStatusText")}
                        />
                      </Grid>

                      {/** deptName */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="departmentName" />}
                          InputLabelProps={{
                            shrink: watch("deptName") ? true : false,
                          }}
                          variant="standard"
                          {...register("deptName")}
                        />
                      </Grid>
                      {/** subDepartmentText */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="subDepartmentName" />}
                          InputLabelProps={{
                            shrink: watch("subDepartmentText") ? true : false,
                          }}
                          variant="standard"
                          {...register("subDepartmentText")}
                        />
                      </Grid>

                      {/** Office Location */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel
                            shrink={
                              watch("officeLocation") == null ? false : true
                            }
                            id="demo-simple-select-standard-label"
                          >
                            {language == "en"
                              ? "Office Location"
                              : "कार्यालयाचे स्थान"}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={
                                  language == "en"
                                    ? "Office Location"
                                    : "कार्यालयाचे स्थान"
                                }
                              >
                                {OfficeLocationName &&
                                  OfficeLocationName?.map(
                                    (officeLocationName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={officeLocationName.id}
                                      >
                                        {language == "en"
                                          ? officeLocationName?.officeLocationName
                                          : officeLocationName?.officeLocationNameMar}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="officeLocation"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.officeLocation
                              ? errors.officeLocation.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/** complaintType */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="complaintType" />}
                          InputLabelProps={{
                            shrink: watch("complaintType") ? true : false,
                          }}
                          variant="standard"
                          {...register("complaintType")}
                        />
                      </Grid>

                      {/* /zoneKey */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.zoneKey}
                        >
                          <InputLabel
                            shrink={watch("zoneKey") == null ? false : true}
                            id="demo-simple-select-standard-label"
                          >
                            <FormattedLabel id="zone" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                disabled
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {allZones &&
                                  allZones.map((allZones, index) => (
                                    <MenuItem key={index} value={allZones.id}>
                                      {language == "en"
                                        ? allZones.zoneName
                                        : allZones?.zoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zoneKey"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.zoneKey ? errors.zoneKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/** wardKey */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.wardKey}
                        >
                          <InputLabel
                            shrink={watch("wardKey") == null ? false : true}
                            id="demo-simple-select-standard-label"
                          >
                            <FormattedLabel id="ward" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {allWards &&
                                  allWards.map((allWards, index) => (
                                    <MenuItem key={index} value={allWards.id}>
                                      {language == "en"
                                        ? allWards.wardName
                                        : allWards?.wardNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="wardKey"
                            control={control}
                            defaultValue={null}
                          />
                          <FormHelperText>
                            {errors?.wardKey ? errors.wardKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/** villageKey */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <InputLabel
                            shrink={watch("villageKey") == null ? false : true}
                            id="demo-simple-select-standard-label"
                          >
                            <FormattedLabel id="villages" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                sx={{
                                  m: { xs: 0, md: 1 },
                                  minWidth: "100%",
                                }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Villages"
                              >
                                {villages &&
                                  villages.map((village, index) => (
                                    <MenuItem key={index} value={village.id}>
                                      {language == "en"
                                        ? village.villageNameEn
                                        : village?.villageNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="villageKey"
                            control={control}
                            defaultValue={null}
                          />
                        </FormControl>
                      </Grid>

                      {/* complaintDescription */}
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          label={<FormattedLabel id="complaintDescriptionEn" />}
                          multiline
                          InputLabelProps={{
                            shrink: watch("complaintDescription")
                              ? true
                              : false,
                          }}
                          id="standard-basic"
                          variant="standard"
                          {...register("complaintDescription")}
                        />
                      </Grid>
                      {/* complaintDescriptionMr*/}
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          label={<FormattedLabel id="complaintDescriptionMr" />}
                          multiline
                          InputLabelProps={{
                            shrink: watch("complaintDescriptionMr")
                              ? true
                              : false,
                          }}
                          id="standard-basic"
                          variant="standard"
                          {...register("complaintDescriptionMr")}
                        />
                      </Grid>
                      {watch("citiRemark") && (
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            label={<FormattedLabel id="reopenRemark" />}
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            multiline
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: watch("citiRemark") ? true : false,
                            }}
                            id="standard-basic"
                            variant="standard"
                            {...register("citiRemark")}
                          />
                        </Grid>
                      )}
                      {watch("deptRemark") && (
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            label={<FormattedLabel id="closeRemark" />}
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            multiline
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: watch("deptRemark") ? true : false,
                            }}
                            id="standard-basic"
                            variant="standard"
                            {...register("deptRemark")}
                          />
                        </Grid>
                      )}
                      {(logedInUser === "citizenUser" ||
                        logedInUser === "cfcUser") &&
                        (statusText === "close" ||
                          statusText === "Close" ||
                          statusText === "क्लोज") && (
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              label={
                                <FormattedLabel id="reopenRemark" required />
                              }
                              disabled={!checkCondition()}
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              multiline
                              inputProps={{ maxLength: 1000 }}
                              InputLabelProps={{
                                shrink: watch("remark") ? true : false,
                              }}
                              id="standard-basic"
                              variant="standard"
                              {...register("remark")}
                            />
                          </Grid>
                        )}
                    </Grid>

                    <div className={DocumentUploadTableSachinCss.doctitle}>
                      <strong
                        style={{ textDecorationColor: "red", fontSize: "20px" }}
                      >
                        {language == "en"
                          ? "Uploaded Documents Section"
                          : "अपलोड केलेला दस्तऐवज विभाग"}
                      </strong>
                    </div>
                    {document.length === 0 && deptDoc.length === 0 && (
                      <span
                        style={{
                          color: "red",
                          display: "flex",
                          textAlign: "center",
                          flexDirection: "column",
                        }}
                      >
                        {language == "en"
                          ? "NO DOCUMENTS TO SHOW HERE"
                          : "येथे दर्शविण्यासाठी कोणतेही दस्तऐवज नाहीत"}
                      </span>
                    )}
                    {document.length != 0 && (
                      <>
                        <Box>
                          <Grid
                            container
                            className={commonStyles.title}
                            style={{ marginBottom: "1rem", marginTop: "1rem" }}
                          >
                            <Grid item xs={12}>
                              <h3
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  marginRight: "2rem",
                                }}
                              >
                                <FormattedLabel id="citizenUploaded" />
                              </h3>
                            </Grid>
                          </Grid>
                        </Box>
                        <div>
                          <DataGrid
                            sx={{
                              overflowY: "scroll",
                              "& .MuiDataGrid-columnHeadersInner": {
                                backgroundColor: "#556CD6",
                                color: "white",
                              },

                              "& .MuiDataGrid-cell:hover": {},
                            }}
                            autoHeight
                            disableSelectionOnClick
                            //rows
                            rows={document || []}
                            //columns
                            columns={documentCol}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                          />
                        </div>
                      </>
                    )}
                    {deptDoc.length != 0 && (
                      <>
                        <Box>
                          <Grid
                            container
                            className={commonStyles.title}
                            style={{ marginTop: "1rem" }}
                          >
                            <Grid item xs={12}>
                              <h3
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  marginRight: "2rem",
                                }}
                              >
                                <FormattedLabel id="deptUploaded" />
                              </h3>
                            </Grid>
                          </Grid>
                        </Box>
                        <div>
                          <DataGrid
                            sx={{
                              overflowY: "scroll",
                              marginTop: 2,
                              "& .MuiDataGrid-columnHeadersInner": {
                                backgroundColor: "#556CD6",
                                color: "white",
                              },

                              "& .MuiDataGrid-cell:hover": {},
                            }}
                            autoHeight
                            disableSelectionOnClick
                            rows={deptDoc || []}
                            columns={documentCol}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                          />
                        </div>
                      </>
                    )}

                    {checkCondition() ? (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "2vh 0.5vw",
                          flexDirection: "row",
                          marginTop: " 23px",
                        }}
                      >
                        {(logedInUser === "citizenUser" ||
                          logedInUser === "cfcUser" ||
                          logedInUser === "departmentUser") && (
                          <Box sx={{ width: "100%" }}>
                            <DocumentUploadTableSachin
                              isButton={checkCondition()}
                            />
                          </Box>
                        )}
                      </Grid>
                    ) : (
                      <>
                        <hr />
                        <div
                          style={{
                            padding: "10px",
                            color: "red",
                            textAlign: "center",
                          }}
                        >
                        {logedInUser === "citizenUser" ||
                          logedInUser === "cfcUser" && <FormattedLabel id="reopen7dayscondition" />}
                        </div>
                      </>
                    )}

                    {isDashboard === "false" &&
                      (statusText === "open" ||
                        statusText === "Open" ||
                        statusText === "ओपन") &&
                      logedInUser === "departmentUser" && (
                        <Grid
                          container
                          style={{
                            paddingLeft: "10vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                          >
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              style={{ backgroundColor: "white" }}
                              id="outlined-basic"
                              multiline
                              inputProps={{ maxLength: 1000 }}
                              label={<FormattedLabel id="reply" required />}
                              variant="standard"
                              {...register("reply")}
                              error={errors.reply}
                              helperText={
                                errors.reply ? errors.reply.message : null
                              }
                            />
                          </Grid>
                        </Grid>
                      )}
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        paddingBottom: "5vh",
                        paddingTop: "5vh",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={ 
                          (statusText === "close" ||
                            statusText === "Close" ||
                            statusText === "क्लोज") &&
                          (isDashboard === "false"||isDashboard ===undefined)
                            ? 12
                            : 6
                        }
                        md={
                          (statusText === "close" ||
                            statusText === "Close" ||
                            statusText === "क्लोज") &&
                            (isDashboard === "false"||isDashboard ===undefined)
                            ? 12
                            : 6
                        }
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="button"
                          variant="contained"
                          color="error"
                          disabled={isLoading}
                          startIcon={<ArrowBackIcon />}
                          // style={{ borderRadius: "20px" }}
                          size="small"
                          onClick={() => {
                            {
                              logedInUser === "departmentUser" &&
                                router.push({
                                  pathname:
                                    "/grievanceMonitoring/dashboards/deptUserDashboard",
                                });
                            }
                            {
                              logedInUser === "citizenUser" &&
                                router.push({
                                  pathname:
                                    "/grievanceMonitoring/dashboards/citizenUserDashboard",
                                });
                            }
                            {
                              logedInUser === "cfcUser" &&
                                router.push({
                                  pathname:
                                    "/grievanceMonitoring/dashboards/cfcUserDashboard",
                                });
                            }
                          }}
                        >
                          <FormattedLabel id="backToDashboard" />
                        </Button>
                      </Grid>
                      {/**departmentUser  */}
                      {isDashboard === "false" &&
                      logedInUser === "departmentUser" &&
                      (statusText === "Open" ||
                        statusText === "open" ||
                        statusText === "ओपन") ? (
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
                          <Button
                            type="submit"
                            variant="contained"
                            // color="error"
                            disabled={isLoading}
                            endIcon={<CloseIcon />}
                            // style={{ borderRadius: "20px" }}
                            size="small"
                          >
                            <FormattedLabel id="closeGrievance" />
                          </Button>
                        </Grid>
                      ) : (
                        <></>
                      )}

                      {/** citizenUser */}
                      {(logedInUser === "citizenUser" ||
                        logedInUser === "cfcUser") &&
                      (statusText === "close" ||
                        statusText === "Close" ||
                        statusText === "क्लोज") ? (
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
                          <Button
                            type="button"
                            variant="contained"
                            color="success"
                            disabled={!watch("remark") || isLoading}
                            endIcon={<LockOpenIcon />}
                            // style={{ borderRadius: "20px" }}
                            size="small"
                            onClick={handleReopenButton}
                          >
                            {language === "en" ? "RE-OPEN" : "पुन्हा उघडा"}
                          </Button>
                        </Grid>
                      ) : (
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
                          {(isDashboard === "true"||logedInUser==='citizenUser'||logedInUser==='cfcUser') ? (
                            <Button
                              type="button"
                              variant="contained"
                              color="success"
                              endIcon={<DownloadIcon />}
                              // style={{ borderRadius: "20px" }}
                              size="small"
                              disabled={isLoading}
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance/downloadAcknowledgement",
                                  query: { id: router?.query?.id },
                                });
                              }}
                            >
                              {language === "en"
                                ? "Download Acknowledgement"
                                : "पावती डाउनलोड करा"}
                            </Button>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </FormProvider>
              </div>
            </Paper>
          </div>
        </ThemeProvider>
      </>
    </>
  );
};
export default Index;
