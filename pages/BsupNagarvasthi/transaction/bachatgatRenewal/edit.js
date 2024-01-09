import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Modal,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import theme from "../../../../theme";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import bachatgatRegistration from "../../../../containers/schema/BsupNagarvasthiSchema/bachatgatRegistration";
import { yupResolver } from "@hookform/resolvers/yup";
import { Add } from "@mui/icons-material";
import Document from "../../uploadDocuments/UploadButton";
import Loader from "../../../../containers/Layout/components/Loader";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const BachatGatRenewal = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bachatgatRegistration),
    defaultValues: {
      trnBachatgatRegistrationMembersList: [
        { fullName: "", designation: "", address: "", aadharNumber: "" },
      ],
    },
  });

  const language = useSelector((state) => state.labels.language);
  const [attachedFile, setAttachedFile] = useState();
  const [uploading, setUploading] = useState(false);
  let filePath = {};
  const [regId, setRegistrationID] = useState();
  const user = useSelector((state) => state.user.user);
  const [statusAll, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [statusVal, setStatusVal] = useState(null);
  const [remarkTableData, setRemarkData] = useState([]);
  const [memberList, setMemberData] = useState([]);
  localStorage.removeItem("bsupDocuments");
  function temp(arg) {
    filePath = arg;
  }
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const loggedUser = localStorage.getItem("loggedInUser");
  const [renewalRemarks, setRenewalRemark] = useState("");
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

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

  const getFilePreview = (filePath) => {
    const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
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
    setIsRemarksFilled(renewalRemarks);
  }, [renewalRemarks]);

  const handleRemarkChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    switch (fieldName) {
      case "renewalRemarks":
        setRenewalRemark(fieldValue);
        break;
      default:
        break;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  // fetch bachatgat regsitration details by id
  useEffect(() => {
    if (router.query.id != undefined && router.query.id != null)
      fetchRegistrationDetails();
  }, [router.query.id]);

  useEffect(() => {
    getZoneName();
    getAllStatus();
    getWardNames();
    getCRAreaName();
    getBachatGatCategory();
    getBank();
    getUser();
  }, []);

  const handleClose = () => {
    setFetchDocuments([
      ...fetchDocument,
      {
        srNo:
          fetchDocument.length != 0
            ? fetchDocument[fetchDocument.length - 1].srNo + 1
            : 1,
        id:
          fetchDocument.length != 0
            ? fetchDocument[fetchDocument.length - 1].id + 1
            : 1,
        documentKey: null,
        documentPath: filePath.filePath,
        fileType:
          filePath?.extension &&
          filePath?.extension.split(".")[1].toUpperCase(),
        attachedDate: moment(new Date()).format("DD/MM/YYYY, h:mm:ss a"),
        fileName: filePath.fileName,
        activeFlag: "Y",
        bachatgatNo: null,
        bachatgatRegistrationKey: Number(regId),
        bachatgatRenewalKey: null,
        documentFlow: null,
        documentTypeKey: null,
        serviceWiseChecklistKey: null,
        trnBachatgatRegistrationDocumentsList: null,
        trnType: "BGRN",
        addUpdate: "Add",
      },
    ]);
    setAttachedFile("");
    setUploading(false);
  };

  // load user
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setUserLst(res?.data?.user);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getAllStatus = () => {
    axios
      .get(`${urls.BSUPURL}/mstStatus/getAll`, {
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
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // load zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load wards
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setCRAreaName(
          r.data.area.map((row) => ({
            id: row.id,
            crAreaName: row.areaName,
            crAreaNameMr: row.areaNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load bank
  const getBank = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setBankMasters(r.data.bank);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load bachatgat category
  const getBachatGatCategory = () => {
    axios
      .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setBachatGatCategory(
          r.data.mstBachatGatCategoryList.map((row) => ({
            id: row.id,
            bachatGatCategoryName: row.bgCategoryName,
            bachatGatCategoryNameMr: row.bgCategoryMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const deleteById = (value, _activeFlag) => {
    sweetAlert({
      title: language === "en" ? "Delete?" : "हटवा?",
      text:
        language === "en"
          ? "Are you sure you want to delete this file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      buttons: [
        language == "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
      allowOutsideClick: false, // Prevent closing on outside click
      allowEscapeKey: false, // Prevent closing on Esc key
      closeOnClickOutside: false,
    }).then((result) => {
      if (result) {
        const deleteArr = fetchDocument.map((obj) => {
          if (obj.id === value) {
            return { ...obj, activeFlag: "N" };
          }
          return obj;
        });
        setFetchDocuments(deleteArr);
        sweetAlert(
          language === "en"
            ? "File deleted successfully!"
            : "फाइल यशस्वीरित्या हटवली!",
          {
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false,
          }
        );
      }
    });
  };

  // call api by id
  const fetchRegistrationDetails = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.BSUPURL}/trnBachatgatRenewal/getById?id=${router.query.id}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setRegistrationDetails(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    }
  };

  useEffect(() => {
    if (registrationDetails != null) setDataOnForm();
  }, [registrationDetails]);

  const setDataOnForm = () => {
    let data = registrationDetails;
    setValue("areaKey", data.areaKey);
    setValue("zoneKey", data.zoneKey);
    setValue("wardKey", data.wardKey);
    setValue("geoCode", data.geoCode);
    setValue("bachatgatName", data.bachatgatName);
    setValue("categoryKey", data.categoryKey);
    setValue("presidentFirstName", data.presidentFirstName);
    setValue("presidentLastName", data.presidentLastName);
    setValue("presidentMiddleName", data.presidentMiddleName);
    setValue("totalMembersCount", data.totalMembersCount);
    setValue("flatBuldingNo", data.flatBuldingNo);
    setValue("buildingName", data.buildingName);
    setValue("roadName", data.roadName);
    setValue("landmark", data.landmark);
    setValue("pinCode", data.pinCode);
    setValue("landlineNo", data.landlineNo);
    setValue("applicantFirstName", data?.applicantFirstName);
    setValue("applicantMiddleName", data?.applicantMiddleName);
    setValue("applicantLastName", data?.applicantLastName);
    setValue("emailId", data?.emailId);
    setValue("mobileNo", data?.mobileNo);
    setValue("renewalRemarks", data.renewalRemarks);
    setStatusVal(data.status);
    setValue("status", manageStatus(data.status, language, statusAll));
    setValue(
      "bankNameId",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        : "-"
    );
    setValue(
      "bankBranchKey",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        : "-"
    );
    setValue(
      "bankIFSC",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        : "-"
    );
    let res = data.trnBachatgatRegistrationMembersList?.map((r, i) => {
      return {
        id: i + 1,
        fullName: r.fullName,
        address: r.address,
        designation: r.designation,
        aadharNumber: r.aadharNumber,
      };
    });
    res && setMemberData([...res]);
    setRegistrationID(data.bgRegistrationKey);
    setValue("bankAccountFullName", data.bankAccountFullName);
    setValue("startDate", data.startDate);
    setValue("saSanghatakRemark", data.saSanghatakRemark);
    setValue("deptClerkRemark", data.deptClerkRemark);
    setValue("deptyCommissionerRemark", data.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", data.asstCommissionerRemark);
    setValue("branchName", data.branchName);
    setValue("ifscCode", data.ifscCode);
    setValue("bankMICR", data.micrCode);
    setValue("pan_no", data.pan_no);
    setValue("savingAccountNo", data.savingAccountNo);
    setValue("renewalRemarks", data.renewalRemarks);
    const bankDoc = [];
    let _res = data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
      bankDoc.push({
        id: r.id,
        srNo: i + 1,
        fileType: r.documentPath && r.documentPath.split(".").pop(),
        documentPath: r.documentPath,
        activeFlag: r.activeFlag,
        fileName:
          r.documentPath && r.documentPath.split("/").pop().split("_").pop(),
        bachatgatRegistrationKey: r.bachatgatRegistrationKey,
        bachatgatRenewalKey: r.bachatgatRenewalKey,
        documentFlow: r.documentFlow,
        activeFlag: r.activeFlag,
        bachatgatNo: r.bachatgatNo,
        documentTypeKey: r.documentTypeKey,
        serviceWiseChecklistKey: r.serviceWiseChecklistKey,
        trnBachatgatRegistrationDocumentsList:
          r.trnBachatgatRegistrationDocumentsList,
        attachedDate: r.createDtTm,
        addUpdate: "Update",
      });
    });
    setFetchDocuments([...bankDoc]);
  };

  // useEffect(() => {
  //   if (regId != null) {
  //     getRegistrationDetails();
  //   }
  // }, [regId]);

  // const getRegistrationDetails = () => {
  //   // setIsLoading(true);
  //   axios
  //     .get(`${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${regId}`, {
  //       headers: headers,
  //     })
  //     .then((r) => {
  //       // setIsLoading(false);

  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //       // catchMethod(err);
  //     });
  // };

  // set remark table details
  useEffect(() => {
    setDataToTable();
  }, [registrationDetails, bankMaster, language]);

  const setDataToTable = () => {
    const a = [];
    if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 4; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.asstCommissionerRemark
              : registrationDetails.deptyCommissionerRemark,
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Department Clerk"
              : i == 2
              ? "Assistant Commissioner"
              : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1110
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.asstCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Department Clerk"
              : i == 2
              ? "Assistant Commissioner"
              : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1101
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Department Clerk"
              : i == 2
              ? "Deputy Commissioner"
              : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1100
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : "",
          designation:
            i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1001
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Samuh Sanghtak" : i == 1 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1000
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.saSanghatakRemark : "",
          designation: i == 0 ? "Samuh Sanghtak" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //    0111
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.asstCommissionerRemark
              : i == 2
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Department Clerk"
              : i == 1
              ? "Assistant Commissioner"
              : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //0110
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.asstCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Department Clerk"
              : i == 1
              ? "Assistant Commissioner"
              : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 0101
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Department Clerk" : i == 1 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0100
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.deptClerkRemark : "",
          designation: i == 0 ? "Department Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0011
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.asstCommissionerRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Assistant Commissioner" : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0010
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.asstCommissionerRemark : "",
          designation: i == 0 ? "Assistant Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
      // 0001
    }
    // 0001
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.deptyCommissionerRemark : "",
          designation: i == 0 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    setRemarkData([...a]);
  };

  // document columns
  const docColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fileName",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                //   "_blank"
                // );
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>

            {record.row.activeFlag === "Y" && (
              <IconButton
                color="primary"
                onClick={() => deleteById(record.id, "N")}
              >
                <DeleteIcon style={{ color: "red", fontSize: 30 }} />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // member columns
  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: <FormattedLabel id="memFullName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: <FormattedLabel id="memFullAdd" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="memDesign" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "aadharNumber",
      headerName: <FormattedLabel id="memAdharNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  // approve or revert caalll
  const onRenewal = () => {
    setIsLoading(true);
    const docArray = fetchDocument.map((obj) => {
      if (obj.addUpdate === "Add") {
        return { ...obj, id: null };
      }
      return obj;
    });
    const temp = [
      {
        ...registrationDetails,
        status: statusVal,
        renewalRemarks: watch("renewalRemarks"),
        trnType: "BGRN",
        isApproved: false,
        isComplete: false,
        isDraft: false,
        trnBachatgatRegistrationDocumentsList: docArray,
      },
    ];

    const tempData = axios
      .post(`${urls.BSUPURL}/trnBachatgatRenewal/save`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          localStorage.removeItem("bsupDocuments");
          localStorage.removeItem("bsupAlreadyDocuments");

          sweetAlert({
            text:
              language === "en"
                ? `Bachatgat renewal application no. is : ${
                    res.data.message.split("[")[1].split("]")[0]
                  } is updated Successfully`
                : ` बचतगट नूतनीकरण अर्ज क्र.: ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या अद्यतनित केले`,
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
            dangerMode: false,
            closeOnClickOutside: false,
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
          })
            .then((will) => {
              if (will) {
                {
                  router.push("/dashboard");
                }
              }
            })
            .catch((err) => {
              setIsLoading(false);
              catchMethod(err);
            });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // UI
  return (
    <>
      <ThemeProvider theme={theme}>
        <>
          <BreadcrumbComponent />
        </>
        {isLoading && <CommonLoader />}
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
            "@media (max-width: 770px)": {
              marginTop: "2rem",
            },
          }}
        >
          {/* bachatgat details box */}

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
                    marginRight: "2rem",
                  }}
                >
                  <FormattedLabel id="bachatGatDetails" />
                </h3>
              </Grid>
            </Grid>
          </Box>
          <form>
            <Grid container spacing={2} style={{ padding: "1rem" }}>
              {/* area name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <FormControl
                  error={errors.areaKey}
                  variant="standard"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="areaNm" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        disabled={true}
                        onChange={(value) => field.onChange(value)}
                      >
                        {crAreaNames &&
                          crAreaNames.map((auditorium, index) => (
                            <MenuItem key={index} value={auditorium.id}>
                              {language === "en"
                                ? auditorium.crAreaName
                                : auditorium.crAreaNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="areaKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.areaKey ? errors.areaKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Zone Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <FormControl
                  error={errors.zoneKey}
                  variant="standard"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="zoneNames" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={true}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        {zoneNames &&
                          zoneNames.map((auditorium, index) => (
                            <MenuItem key={index} value={auditorium.id}>
                              {language === "en"
                                ? auditorium.zoneName
                                : auditorium.zoneNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="zoneKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.zoneKey ? errors.zoneKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Ward name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <FormControl
                  variant="standard"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.wardKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="wardname" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={true}
                        // sx={{ minWidth: 220 }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        {wardNames &&
                          wardNames.map((service, index) => (
                            <MenuItem key={index} value={service.id}>
                              {language === "en"
                                ? service.wardName
                                : service.wardNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="wardKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.wardKey ? errors.wardKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* geo code */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="gisgioCode" />}
                  variant="standard"
                  {...register("geoCode")}
                />
              </Grid>

              {/* bachatgat name */}
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="bachatgatFullName" />}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  {...register("bachatgatName")}
                  error={!!errors.bachatgatName}
                  helperText={
                    errors?.bachatgatName ? errors.bachatgatName.message : null
                  }
                />
              </Grid>

              {/* bachatgat category */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <FormControl
                  variant="standard"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.categoryKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="bachatgatCat" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={true}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        {bachatGatCategory &&
                          bachatGatCategory.map((service, index) => (
                            <MenuItem key={index} value={service.id}>
                              {language === "en"
                                ? service.bachatGatCategoryName
                                : service.bachatGatCategoryNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="categoryKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.categoryKey ? errors.categoryKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Bachat Gat start date */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <FormControl
                  variant="standard"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.fromDate}
                >
                  <Controller
                    control={control}
                    name="startDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={true}
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              {<FormattedLabel id="bachatgatStartDate" />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="standard"
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.startDate ? errors.startDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* bachatgat address box */}
              <Grid item xs={12}>
                <Box>
                  <Grid container className={commonStyles.title}>
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
                        <FormattedLabel id="bachatgatAddress" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* president first name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFirstName" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("presidentFirstName")}
                  error={!!errors.presidentFirstName}
                  helperText={
                    errors?.presidentFirstName
                      ? errors.presidentFirstName.message
                      : null
                  }
                />
              </Grid>

              {/* bahcatgat middle name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFatherName" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("presidentMiddleName")}
                  error={!!errors.presidentMiddleName}
                  helperText={
                    errors?.presidentMiddleName
                      ? errors.presidentMiddleName.message
                      : null
                  }
                />
              </Grid>

              {/* bahcatgat last name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="presidentLastName" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("presidentLastName")}
                  error={!!errors.presidentLastName}
                  helperText={
                    errors?.presidentLastName
                      ? errors.presidentLastName.message
                      : null
                  }
                />
              </Grid>

              {/* total member */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <Tooltip title="Gat Total Members Count">
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="totalCount" />}
                    variant="standard"
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    {...register("totalMembersCount")}
                    error={!!errors.totalMembersCount}
                    helperText={
                      errors?.totalMembersCount
                        ? errors.totalMembersCount.message
                        : null
                    }
                  />
                </Tooltip>
              </Grid>

              {/* building no */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="flatBuildNo" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("flatBuldingNo")}
                  error={!!errors.flatBuldingNo}
                  helperText={
                    errors?.flatBuldingNo ? errors.flatBuldingNo.message : null
                  }
                />
              </Grid>

              {/* building name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="buildingNm" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("buildingName")}
                  error={!!errors.buildingName}
                  helperText={
                    errors?.buildingName ? errors.buildingName.message : null
                  }
                />
              </Grid>

              {/* Road Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="roadName" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("roadName")}
                  error={!!errors.roadName}
                  helperText={errors?.roadName ? errors.roadName.message : null}
                />
              </Grid>

              {/* Landmark */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="landmark" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("landmark")}
                  error={!!errors.landmark}
                  helperText={errors?.landmark ? errors.landmark.message : null}
                />
              </Grid>

              {/* Pin Code */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 6 }}
                  label={<FormattedLabel id="pincode" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("pinCode")}
                  error={!!errors.pinCode}
                  helperText={errors?.pinCode ? errors.pinCode.message : null}
                />
              </Grid>

              {/*   Applicant Name Details*/}
              <Grid item xs={12}>
                <Box>
                  <Grid container className={commonStyles.title}>
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
                        <FormattedLabel id="applicantDetails" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* applicant first name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantFirstName" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("applicantFirstName")}
                  error={!!errors.applicantFirstName}
                  helperText={
                    errors?.applicantFirstName
                      ? errors.applicantFirstName.message
                      : null
                  }
                />
              </Grid>

              {/* applicant middle name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="applicantMiddleName" />}
                  variant="standard"
                  {...register("applicantMiddleName")}
                  error={!!errors.applicantMiddleName}
                  helperText={
                    errors?.applicantMiddleName
                      ? errors.applicantMiddleName.message
                      : null
                  }
                />
              </Grid>

              {/* applicant last name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="applicantLastName" />}
                  variant="standard"
                  {...register("applicantLastName")}
                  error={!!errors.applicantLastName}
                  helperText={
                    errors?.applicantLastName
                      ? errors.applicantLastName.message
                      : null
                  }
                />
              </Grid>

              {/* Landline No. */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="landlineNo" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("landlineNo")}
                />
              </Grid>

              {/* mobile no */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  {...register("mobileNo")}
                  error={!!errors.mobileNo}
                  helperText={errors?.mobileNo ? errors.mobileNo.message : null}
                />
              </Grid>

              {/* Email Id */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="emailId" />}
                  variant="standard"
                  {...register("emailId")}
                  error={!!errors.emailId}
                  helperText={errors?.emailId ? errors.emailId.message : null}
                />
              </Grid>

              {/* bank details box */}
              <Grid item xs={12}>
                <Box>
                  <Grid container className={commonStyles.title}>
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
                        <FormattedLabel id="bankDetails" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* bank name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="bankName" />}
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={true}
                  {...register("bankNameId")}
                  error={!!errors.bankNameId}
                  helperText={
                    errors?.bankNameId ? errors.bankNameId.message : null
                  }
                />
              </Grid>

              {/* Branch Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="branchName" />}
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={true}
                  {...register("branchName")}
                  error={!!errors.branchName}
                  helperText={
                    errors?.branchName ? errors.branchName.message : null
                  }
                />
              </Grid>

              {/* Saving Account No */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 18, minLength: 6 }}
                  label={<FormattedLabel id="accountNo" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("savingAccountNo")}
                  error={!!errors.savingAccountNo}
                  helperText={
                    errors?.savingAccountNo
                      ? errors.savingAccountNo.message
                      : null
                  }
                />
              </Grid>

              {/* Saving Account Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="accountHolderName" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("bankAccountFullName")}
                  error={!!errors.bankAccountFullName}
                  helperText={
                    errors?.bankAccountFullName
                      ? errors.bankAccountFullName.message
                      : null
                  }
                />
              </Grid>

              {/* ifsc code */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="bankIFSC" />}
                  variant="standard"
                  {...register("ifscCode")}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.ifscCode}
                  helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                />
              </Grid>

              {/* Bank MICR Code */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="bankMICR" />}
                  variant="standard"
                  {...register("bankMICR")}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* PAN Number */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="panNumber" />}
                  variant="standard"
                  inputProps={{ maxLength: 10, minLength: 10 }}
                  {...register("pan_no")}
                  InputLabelProps={{
                    shrink: watch("pan_no") ? true : false,
                  }}
                  error={!!errors.pan_no}
                  helperText={
                    errors?.pan_no ? errors.pan_no.message : null
                  }
                />
              </Grid>
              {/* member info box */}
              <Grid item xs={12}>
                <Box>
                  <Grid container className={commonStyles.title}>
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
                        <FormattedLabel id="memberInfo" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {/* members show in table */}
              <DataGrid
                autoHeight
                sx={{
                  marginTop: 5,
                  overflowY: "scroll",
                  overflowX: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {},
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  flexDirection: "column",
                  overflowX: "scroll",
                }}
                autoWidth
                density="standard"
                pageSize={10}
                rowsPerPageOptions={[10]}
                rows={memberList}
                columns={columns}
              />

              <Divider />
            </Grid>

            {/* Required documents */}

            <Grid item xs={12}>
              <Box>
                <Grid container className={commonStyles.title}>
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
                      <FormattedLabel id="renewalSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                required
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="renewalRemark" />}
                variant="standard"
                // disabled={true}
                {...register("renewalRemarks")}
                // value={renewalRemarks}
                multiline
                onChange={(e) => handleRemarkChange(e, "renewalRemarks")}
                InputLabelProps={{ shrink: true }}
                error={!!errors.renewalRemarks}
                helperText={
                  errors?.renewalRemarks ? errors.renewalRemarks.message : null
                }
              />
            </Grid>
            <>
              <Grid
                container
                style={{
                  padding: "10px",
                  marginTop: "1rem",
                  backgroundColor: "lightblue",
                }}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid
                  item
                  xs={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      marginLeft: { xs: "5%", md: "20%" },
                      textAlign: { xs: "center", md: "left" },
                    }}
                  >
                    <FormattedLabel id="uploadFile" />
                  </Typography>
                </Grid>
                <Grid item md={2} lg={2} xl={2}>
                  <Button
                    variant="contained"
                    endIcon={<Add />}
                    className={commonStyles.buttonSave}
                    type="button"
                    color="primary"
                    onClick={handleOpen}
                    size="small"
                  >
                    {<FormattedLabel id="addDoc" />}
                  </Button>
                </Grid>
              </Grid>

              <DataGrid
                sx={{
                  overflowY: "scroll",
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                autoHeight
                disableSelectionOnClick
                rows={fetchDocument.filter((obj) => obj.activeFlag != "N")}
                columns={docColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </>
            {/* </Grid> */}
            {((loggedUser != "citizenUser" && loggedUser != "cfcUser") ||
              ((loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
                (statusVal === 1 || statusVal === 23 || statusVal === 22) &&
                remarkTableData.length != 0)) && (
              <Grid item xs={12}>
                <Box>
                  <Grid container className={commonStyles.title}>
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
                        <FormattedLabel id="approvalSection" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
            {/* samuh sanghtak remark show only citizen when status is reverted */}
            {(loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
              (statusVal === 22 || statusVal === 1) && (
                <>
                  {" "}
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      label={
                        statusVal === 1 ? (
                          <FormattedLabel id="revertedReason" />
                        ) : (
                          <FormattedLabel id="rejectedReason" />
                        )
                      }
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={true}
                      multiline
                      {...register("saSanghatakRemark")}
                      error={!!errors.saSanghatakRemark}
                      helperText={
                        errors?.saSanghatakRemark
                          ? errors.saSanghatakRemark.message
                          : null
                      }
                    />
                  </Grid>
                </>
              )}
            {/* save cancel button button */}
            <Grid container sx={{ marginTop: "6px" }}>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{}}
                  size="small"
                  variant="contained"
                  color="success"
                  className={commonStyles.buttonSave}
                  disabled={!isRemarksFilled}
                  onClick={onRenewal}
                  endIcon={<SaveIcon />}
                >
                  <FormattedLabel id="update" />
                </Button>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  className={commonStyles.buttonExit}
                  endIcon={<ClearIcon />}
                  onClick={() => {
                    router.push(
                      "/BsupNagarvasthi/transaction/bachatgatRenewal"
                    );
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </ThemeProvider>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "15%",
        }}
      >
        <Box
          sx={{
            width: "50%",
            backgroundColor: "white",
            height: "40%",
            borderRadius: "10px",
          }}
        >
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.5%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bolder",
                  fontSize: "large",
                  textTransform: "capitalize",
                }}
              >
                <FormattedLabel id="fileUpload" />
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Document
                appName={"BSUP"}
                serviceName={"BSUP-BachatgatRegistration"}
                fileName={attachedFile} //State to attach file
                filePath={temp}
                fileLabel={setLabel}
                handleClose={handleClose}
                uploading={setUploading}
                modalState={setOpen}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <Button
                variant="contained"
                className={commonStyles.buttonExit}
                color="error"
                onClick={() => {
                  handleCancel(false);
                }}
                size="small"
              >
                <FormattedLabel id="cancel" />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default BachatGatRenewal;
